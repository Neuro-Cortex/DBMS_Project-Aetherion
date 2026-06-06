from fastapi import APIRouter, Depends, Query, Body, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional

from ...core.database import get_db
from ...core.events import Event, EventType, get_event_bus
from ...schemas.common import APIResponse
from ...schemas.messaging import MessageCreateRequest, NotificationCreateRequest
from ...services.messaging_service import MessagingService
from ...middleware.auth_middleware import get_current_user
from ...core.permissions import CurrentUser

router = APIRouter(prefix="/messaging", tags=["Messaging"])


# ============================================
# MESSAGES
# ============================================
@router.post("/messages", response_model=APIResponse)
async def send_message(
    data: MessageCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """Send a message to another user."""
    service = MessagingService(db)
    result = service.send_message(current_user.id, data)
    event_bus = get_event_bus()
    await event_bus.dispatch(
        Event(type=EventType.MESSAGE_SENT, payload={"message_id": result.get("id"), "sender_id": current_user.id, "receiver_id": data.receiver_id if hasattr(data, "receiver_id") else None}, user_id=current_user.id),
        bg_tasks=background_tasks,
    )
    return APIResponse(success=True, message="Message sent", data=result)


@router.get("/messages/{other_user_id}", response_model=APIResponse)
async def get_conversation(
    other_user_id: str,
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=200),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get conversation with a specific user."""
    service = MessagingService(db)
    result = service.get_conversation(current_user.id, other_user_id, page=page, size=size)
    return APIResponse(success=True, message="Conversation retrieved", data=result)


@router.get("/messages/{other_user_id}/search", response_model=APIResponse)
async def search_messages(
    other_user_id: str,
    q: str = Query(..., min_length=1, max_length=200),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Search messages in a conversation."""
    service = MessagingService(db)
    result = service.search_messages(current_user.id, other_user_id, q, page=page, size=size)
    return APIResponse(success=True, message="Search results retrieved", data=result)


# ============================================
# CONVERSATIONS
# ============================================
@router.get("/conversations", response_model=APIResponse)
async def get_conversations(
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all user conversations with pagination and search."""
    service = MessagingService(db)
    result = service.get_conversations_list(current_user.id, search=search, page=page, size=size)
    return APIResponse(success=True, message="Conversations retrieved", data=result)


@router.post("/conversations/{user_id}/pin", response_model=APIResponse)
async def pin_conversation(
    user_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Pin a conversation."""
    service = MessagingService(db)
    service.pin_conversation(current_user.id, user_id)
    return APIResponse(success=True, message="Conversation pinned")


@router.post("/conversations/{user_id}/unpin", response_model=APIResponse)
async def unpin_conversation(
    user_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Unpin a conversation."""
    service = MessagingService(db)
    service.unpin_conversation(current_user.id, user_id)
    return APIResponse(success=True, message="Conversation unpinned")


@router.delete("/conversations/{user_id}", response_model=APIResponse)
async def delete_conversation(
    user_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a conversation."""
    service = MessagingService(db)
    service.delete_conversation(current_user.id, user_id)
    return APIResponse(success=True, message="Conversation deleted")


# ============================================
# NOTIFICATIONS
# ============================================
@router.get("/notifications", response_model=APIResponse)
async def get_notifications(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    unread_only: bool = Query(False),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user notifications with pagination."""
    service = MessagingService(db)
    result = service.get_notifications(current_user.id, page=page, size=size, unread_only=unread_only)
    return APIResponse(success=True, message="Notifications retrieved", data=result)


@router.put("/notifications/{notification_id}/read", response_model=APIResponse)
async def mark_notification_read(
    notification_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark a notification as read."""
    service = MessagingService(db)
    service.mark_notification_read(current_user.id, notification_id)
    return APIResponse(success=True, message="Notification marked as read")


@router.put("/notifications/read-all", response_model=APIResponse)
async def mark_all_notifications_read(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Mark all notifications as read."""
    service = MessagingService(db)
    service.mark_all_notifications_read(current_user.id)
    return APIResponse(success=True, message="All notifications marked as read")


@router.delete("/notifications/{notification_id}", response_model=APIResponse)
async def delete_notification(
    notification_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a notification."""
    service = MessagingService(db)
    service.delete_notification(current_user.id, notification_id)
    return APIResponse(success=True, message="Notification deleted")


@router.get("/unread-count", response_model=APIResponse)
async def get_unread_count(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get count of unread notifications."""
    service = MessagingService(db)
    result = service.get_unread_count(current_user.id)
    return APIResponse(success=True, message="Unread count retrieved", data=result)


# ============================================
# NOTIFICATION PREFERENCES
# ============================================
@router.get("/preferences", response_model=APIResponse)
async def get_notification_preferences(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's notification preferences."""
    service = MessagingService(db)
    result = service.get_notification_preferences(current_user.id)
    return APIResponse(success=True, message="Preferences retrieved", data=result)


@router.put("/preferences", response_model=APIResponse)
async def update_notification_preferences(
    data: dict = Body(...),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update user's notification preferences."""
    service = MessagingService(db)
    result = service.update_notification_preferences(current_user.id, data)
    return APIResponse(success=True, message="Preferences updated", data=result)
