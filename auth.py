from fastapi import APIRouter, Depends, Body, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional

from ...core.database import get_db
from ...core.events import Event, EventType, get_event_bus
from ...schemas.auth import (
    LoginRequest, RegisterRequest, TokenResponse, AuthResponse,
    RefreshTokenRequest, RefreshTokenResponse, ForgotPasswordRequest,
    ResetPasswordRequest, ChangePasswordRequest, VerifyEmailRequest,
    RoleSwitchRequest, MessageResponse, UserBasicResponse,
)
from ...schemas.common import APIResponse
from ...services.auth_service import AuthService
from ...services.user_service import UserService
from ...middleware.auth_middleware import get_current_user
from ...core.permissions import CurrentUser, require_role

router = APIRouter(prefix="/auth", tags=["Authentication"])


# ============================================
# LOGIN
# ============================================
@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest, db: Session = Depends(get_db)):
    """Authenticate user and return JWT tokens."""
    service = AuthService(db)
    token_data = await service.login(request)
    return AuthResponse(
        success=True,
        message="Login successful",
        data=token_data,
    )


# ============================================
# REGISTER
# ============================================
@router.post("/register", response_model=AuthResponse)
async def register(request: RegisterRequest, db: Session = Depends(get_db), background_tasks: BackgroundTasks = None):
    """Register a new user account."""
    service = AuthService(db)
    token_data = await service.register(request)
    event_bus = get_event_bus()
    await event_bus.dispatch(
        Event(type=EventType.USER_REGISTERED, payload={"user_id": token_data.get("user", {}).get("id") if isinstance(token_data, dict) else None, "email": request.email}, user_id=token_data.get("user", {}).get("id") if isinstance(token_data, dict) else None),
        bg_tasks=background_tasks,
    )
    return AuthResponse(
        success=True,
        message="Registration successful",
        data=token_data,
    )


# ============================================
# REFRESH TOKEN
# ============================================
@router.post("/refresh", response_model=APIResponse)
async def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Refresh access token using a valid refresh token."""
    service = AuthService(db)
    result = await service.refresh_token(request.refresh_token)
    return APIResponse(success=True, message="Token refreshed", data=result)


# ============================================
# LOGOUT
# ============================================
@router.post("/logout", response_model=APIResponse)
async def logout(
    current_user: CurrentUser = Depends(get_current_user),
    refresh_token: Optional[str] = Body(None, embed=True),
    db: Session = Depends(get_db),
):
    """Logout and revoke refresh token."""
    service = AuthService(db)
    await service.logout(current_user.id, refresh_token)
    return APIResponse(success=True, message="Logged out successfully")


# ============================================
# FORGOT PASSWORD
# ============================================
@router.post("/forgot-password", response_model=APIResponse)
async def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """Request a password reset link."""
    service = AuthService(db)
    message = await service.forgot_password(request.email)
    return APIResponse(success=True, message=message)


# ============================================
# RESET PASSWORD
# ============================================
@router.post("/reset-password", response_model=APIResponse)
async def reset_password(request: ResetPasswordRequest, db: Session = Depends(get_db)):
    """Reset password using a valid reset token."""
    service = AuthService(db)
    if request.new_password != request.confirm_password:
        return APIResponse(success=False, message="Passwords do not match")
    await service.reset_password(request.token, request.new_password)
    return APIResponse(success=True, message="Password reset successful")


# ============================================
# CHANGE PASSWORD
# ============================================
@router.post("/change-password", response_model=APIResponse)
async def change_password(
    request: ChangePasswordRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Change password for authenticated user."""
    if request.new_password != request.confirm_new_password:
        return APIResponse(success=False, message="Passwords do not match")
    service = AuthService(db)
    await service.change_password(current_user.id, request.current_password, request.new_password)
    return APIResponse(success=True, message="Password changed successfully")


# ============================================
# VERIFY EMAIL
# ============================================
@router.post("/verify-email", response_model=APIResponse)
async def verify_email(request: VerifyEmailRequest, db: Session = Depends(get_db)):
    """Verify user email address."""
    service = AuthService(db)
    await service.verify_email(request.token)
    return APIResponse(success=True, message="Email verified successfully")


# ============================================
# GET PROFILE (Enhanced with Permissions)
# ============================================
@router.get("/profile", response_model=APIResponse)
async def get_profile(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's full profile with permissions."""
    service = UserService(db)
    profile = service.get_user_detail(current_user.id)

    # Add permission summary
    permission_summary = current_user.get_permission_summary()

    return APIResponse(
        success=True,
        message="Profile retrieved with permissions",
        data={
            **profile,
            **permission_summary,
        },
    )


# ============================================
# AUTH ME (Permissions & Features)
# ============================================
@router.get("/me", response_model=APIResponse)
async def get_auth_me(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """
    Get current user's profile with permissions and features.

    KEY endpoint for frontend auto-UI generation.

    Returns user permissions, features, and dashboard configuration.
    """
    service = UserService(db)
    profile = service.get_user_detail(current_user.id)

    # Get permission summary
    permission_summary = current_user.get_permission_summary()

    # Get dashboard configuration
    from ...api.v1.system import _get_dashboard_config
    dashboard_config = _get_dashboard_config(current_user.primary_role)

    # Get available actions
    from ...api.v1.actions import _get_available_actions
    can_execute_actions = _get_available_actions(current_user)

    return APIResponse(
        success=True,
        message="User profile with permissions retrieved",
        data={
            "user": {
                "id": current_user.id,
                "email": current_user.email,
                "full_name": current_user.full_name,
                "role": current_user.primary_role,
                "roles": current_user.roles,
                "primary_role": current_user.primary_role,
                "is_active": current_user.is_active,
                "is_verified": current_user.is_verified,
                "is_admin_approved": current_user.is_admin_approved,
                **profile,
            },
            "permissions": permission_summary["permissions"],
            "features": permission_summary["features"],
            "can_execute_actions": can_execute_actions,
            "dashboard_config": dashboard_config,
            "is_full_access": permission_summary["is_full_access"],
        },
    )


# ============================================
# UPDATE PROFILE
# ============================================
@router.put("/profile", response_model=APIResponse)
async def update_profile(
    full_name: Optional[str] = Body(None),
    phone: Optional[str] = Body(None),
    gender: Optional[str] = Body(None),
    date_of_birth: Optional[str] = Body(None),
    profile_image: Optional[str] = Body(None),
    blood_group: Optional[str] = Body(None),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update current user's basic info."""
    service = UserService(db)
    from ...schemas.user import UserUpdateRequest
    data = UserUpdateRequest(
        full_name=full_name, phone=phone, gender=gender,
        date_of_birth=date_of_birth, profile_image=profile_image,
        blood_group=blood_group,
    )
    # Only update non-None fields
    update_data = data.model_dump(exclude_unset=True, exclude_none=True)
    if update_data:
        user = service.update_user(current_user.id, data)

    # Return updated profile with permissions
    profile = service.get_user_detail(current_user.id)
    permission_summary = current_user.get_permission_summary()

    return APIResponse(
        success=True,
        message="Profile updated",
        data={
            **profile,
            **permission_summary,
        },
    )


# ============================================
# SWITCH ROLE
# ============================================
@router.post("/switch-role", response_model=APIResponse)
async def switch_role(
    request: RoleSwitchRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Switch the user's active role."""
    if request.role not in current_user.roles:
        return APIResponse(success=False, message=f"Role '{request.role}' not available for this account")
    # Create new access token with switched role
    from ...core.security import create_access_token
    new_token = create_access_token({
        "sub": current_user.id, "role": request.role, "roles": current_user.roles,
    })
    return APIResponse(
        success=True,
        message=f"Switched to role: {request.role}",
        data={"access_token": new_token, "role": request.role},
    )
