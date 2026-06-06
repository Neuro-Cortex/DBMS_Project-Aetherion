from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session
from typing import Optional

from ...core.database import get_db
from ...schemas.common import APIResponse, PaginatedAPIResponse
from ...schemas.user import (
    UserDetailResponse, UserProfileUpdateRequest,
    UserAddressCreateRequest, UserAddressResponse,
    EmergencyContactCreateRequest, EmergencyContactResponse,
    NotificationSettingsUpdateRequest, NotificationSettingsResponse,
)
from ...services.user_service import UserService
from ...middleware.auth_middleware import get_current_user
from ...core.permissions import CurrentUser, require_role, require_admin

router = APIRouter(prefix="/users", tags=["Users"])


# ============================================
# GET CURRENT USER
# ============================================
@router.get("/me", response_model=APIResponse)
async def get_me(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current authenticated user's full profile."""
    service = UserService(db)
    profile = service.get_user_detail(current_user.id)
    return APIResponse(success=True, message="User profile retrieved", data=profile)


# ============================================
# UPDATE CURRENT USER PROFILE
# ============================================
@router.put("/me/profile", response_model=APIResponse)
async def update_my_profile(
    data: UserProfileUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update current user's extended profile."""
    service = UserService(db)
    profile = service.update_profile(current_user.id, data)
    return APIResponse(success=True, message="Profile updated", data=profile)


# ============================================
# ADDRESSES
# ============================================
@router.get("/me/addresses", response_model=APIResponse)
async def get_my_addresses(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's addresses."""
    service = UserService(db)
    addresses = service.get_addresses(current_user.id)
    return APIResponse(
        success=True,
        message="Addresses retrieved",
        data=[UserAddressResponse.model_validate(a) for a in addresses],
    )


@router.post("/me/addresses", response_model=APIResponse)
async def add_address(
    data: UserAddressCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a new address."""
    service = UserService(db)
    address = service.add_address(current_user.id, data)
    return APIResponse(
        success=True,
        message="Address added",
        data=UserAddressResponse.model_validate(address),
    )


@router.delete("/me/addresses/{address_id}", response_model=APIResponse)
async def delete_address(
    address_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete an address."""
    service = UserService(db)
    service.delete_address(current_user.id, address_id)
    return APIResponse(success=True, message="Address deleted")


# ============================================
# EMERGENCY CONTACTS
# ============================================
@router.get("/me/emergency-contacts", response_model=APIResponse)
async def get_my_emergency_contacts(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's emergency contacts."""
    service = UserService(db)
    contacts = service.get_emergency_contacts(current_user.id)
    return APIResponse(
        success=True,
        message="Emergency contacts retrieved",
        data=[EmergencyContactResponse.model_validate(c) for c in contacts],
    )


@router.post("/me/emergency-contacts", response_model=APIResponse)
async def add_emergency_contact(
    data: EmergencyContactCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add an emergency contact."""
    service = UserService(db)
    contact = service.add_emergency_contact(current_user.id, data)
    return APIResponse(
        success=True,
        message="Emergency contact added",
        data=EmergencyContactResponse.model_validate(contact),
    )


@router.delete("/me/emergency-contacts/{contact_id}", response_model=APIResponse)
async def delete_emergency_contact(
    contact_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete an emergency contact."""
    service = UserService(db)
    service.delete_emergency_contact(current_user.id, contact_id)
    return APIResponse(success=True, message="Emergency contact deleted")


# ============================================
# NOTIFICATION SETTINGS
# ============================================
@router.get("/me/notification-settings", response_model=APIResponse)
async def get_notification_settings(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's notification settings."""
    service = UserService(db)
    settings = service.get_notification_settings(current_user.id)
    return APIResponse(
        success=True,
        message="Notification settings retrieved",
        data=NotificationSettingsResponse.model_validate(settings),
    )


@router.put("/me/notification-settings", response_model=APIResponse)
async def update_notification_settings(
    data: NotificationSettingsUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update notification settings."""
    service = UserService(db)
    settings = service.update_notification_settings(current_user.id, data)
    return APIResponse(
        success=True,
        message="Notification settings updated",
        data=NotificationSettingsResponse.model_validate(settings),
    )


# ============================================
# ADMIN: LIST ALL USERS
# ============================================
@router.get("/", response_model=APIResponse, dependencies=[Depends(require_admin())])
async def get_users(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    role: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """List all users (admin only)."""
    service = UserService(db)
    result = service.list_users(page=page, size=size, search=search, role=role)
    return APIResponse(
        success=True,
        message="Users retrieved",
        data={
            "items": result["items"],
            "total": result["total"],
            "page": result["page"],
            "size": result["size"],
            "pages": result["pages"],
        },
    )


# ============================================
# ADMIN: GET USER BY ID
# ============================================
@router.get("/{user_id}", response_model=APIResponse, dependencies=[Depends(require_admin())])
async def get_user_by_id(
    user_id: str,
    db: Session = Depends(get_db),
):
    """Get a user's full profile by ID (admin only)."""
    service = UserService(db)
    profile = service.get_user_detail(user_id)
    return APIResponse(success=True, message="User retrieved", data=profile)


# ============================================
# ADMIN: ACTIVATE/DEACTIVATE USER
# ============================================
@router.patch("/{user_id}/status", response_model=APIResponse, dependencies=[Depends(require_admin())])
async def toggle_user_status(
    user_id: str,
    is_active: bool = Body(..., embed=True),
    db: Session = Depends(get_db),
):
    """Activate or deactivate a user (admin only)."""
    service = UserService(db)
    if is_active:
        service.activate_user(user_id)
    else:
        service.deactivate_user(user_id)
    return APIResponse(success=True, message=f"User {'activated' if is_active else 'deactivated'}")
