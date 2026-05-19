"""
Notification endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.notification_service import NotificationService
from app.api.v1.notifications.schemas import PushTokenRegister, NotificationPreferences
import uuid

router = APIRouter()

@router.get("/")
async def get_notifications(
    current_user: User = Depends(get_current_user),
    is_read: Optional[bool] = None,
    notification_type: Optional[str] = None,
    skip: int = 0,
    limit: int = 50,
    session: AsyncSession = Depends(get_db)
):
    """Get user notifications"""
    service = NotificationService(session)
    return await service.get_notifications(
        current_user.id, is_read, notification_type, skip, limit
    )

@router.get("/unread-count")
async def get_unread_count(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get unread notification count"""
    service = NotificationService(session)
    return await service.get_unread_count(current_user.id)

@router.put("/{notification_id}/read")
async def mark_as_read(
    notification_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Mark notification as read"""
    service = NotificationService(session)
    return await service.mark_as_read(current_user.id, notification_id)

@router.put("/read-all")
async def mark_all_as_read(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Mark all notifications as read"""
    service = NotificationService(session)
    return await service.mark_all_as_read(current_user.id)

@router.delete("/{notification_id}")
async def delete_notification(
    notification_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Delete notification"""
    service = NotificationService(session)
    return await service.delete_notification(current_user.id, notification_id)

@router.post("/push-token")
async def register_push_token(
    data: PushTokenRegister,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Register push notification token"""
    service = NotificationService(session)
    return await service.register_push_token(current_user.id, data.dict())

@router.put("/preferences")
async def update_notification_preferences(
    data: NotificationPreferences,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Update notification preferences"""
    service = NotificationService(session)
    return await service.update_preferences(current_user.id, data.dict())

@router.get("/preferences")
async def get_notification_preferences(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get notification preferences"""
    service = NotificationService(session)
    return await service.get_preferences(current_user.id)

@router.post("/test")
async def send_test_notification(
    notification_type: str = Query(...),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Send test notification"""
    service = NotificationService(session)
    return await service.send_test_notification(current_user.id, notification_type)