"""
User management endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.user_service import UserService
from app.api.v1.users.schemas import (
    UserProfileUpdate, UserLocationUpdate, RoleUpdateRequest,
    NotificationPreferences, EmergencyContactCreate, EmergencyContactUpdate
)
import uuid

router = APIRouter()

@router.get("/profile")
async def get_profile(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get current user profile"""
    service = UserService(session)
    return await service.get_user_profile(current_user.id)

@router.put("/profile")
async def update_profile(
    data: UserProfileUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Update user profile"""
    service = UserService(session)
    return await service.update_profile(current_user.id, data.dict(exclude_unset=True))

@router.put("/location")
async def update_location(
    data: UserLocationUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Update user location"""
    service = UserService(session)
    return await service.update_location(current_user.id, data.latitude, data.longitude)

@router.post("/roles")
async def add_role(
    data: RoleUpdateRequest,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Add role to user"""
    service = UserService(session)
    return await service.add_user_role(current_user.id, data.role)

@router.delete("/roles/{role}")
async def remove_role(
    role: str,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Remove role from user"""
    service = UserService(session)
    return await service.remove_user_role(current_user.id, role)

@router.put("/notification-preferences")
async def update_notification_preferences(
    data: NotificationPreferences,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Update notification preferences"""
    service = UserService(session)
    return await service.update_notification_preferences(
        current_user.id, data.dict()
    )

@router.get("/emergency-contacts")
async def get_emergency_contacts(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get emergency contacts"""
    service = UserService(session)
    return await service.get_emergency_contacts(current_user.id)

@router.post("/emergency-contacts")
async def add_emergency_contact(
    data: EmergencyContactCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Add emergency contact"""
    service = UserService(session)
    return await service.add_emergency_contact(current_user.id, data.dict())

@router.put("/emergency-contacts/{contact_id}")
async def update_emergency_contact(
    contact_id: uuid.UUID,
    data: EmergencyContactUpdate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Update emergency contact"""
    service = UserService(session)
    return await service.update_emergency_contact(
        current_user.id, contact_id, data.dict(exclude_unset=True)
    )

@router.delete("/emergency-contacts/{contact_id}")
async def delete_emergency_contact(
    contact_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Delete emergency contact"""
    service = UserService(session)
    return await service.delete_emergency_contact(current_user.id, contact_id)

@router.post("/upload-avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Upload profile avatar"""
    service = UserService(session)
    return await service.upload_avatar(current_user.id, file)

@router.get("/search")
async def search_users(
    query: str = Query(..., min_length=2),
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_db)
):
    """Search users by name or email"""
    service = UserService(session)
    return await service.search_users(query, skip, limit)

@router.get("/dashboard")
async def user_dashboard(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get user dashboard data"""
    service = UserService(session)
    return await service.get_dashboard(current_user.id)

@router.delete("/account")
async def delete_account(
    password: str = Query(...),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Delete user account"""
    service = UserService(session)
    return await service.delete_account(current_user.id, password)