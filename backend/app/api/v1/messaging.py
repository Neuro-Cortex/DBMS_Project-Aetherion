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


@router.post("/messages", response_model=APIResponse)
async def send_message(data: MessageCreateRequest, current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db), background_tasks: BackgroundTasks = None):
    service = MessagingService(db)
    result = service.send_message(current_user.id, data)
    event_bus = get_event_bus()
    await event_bus.dispatch(
        Event(type=EventType.MESSAGE_SENT, payload={"message_id": result.get("id"), "sender_id": current_user.id, "receiver_id": data.receiver_id if hasattr(data, "receiver_id") else None}, user_id=current_user.id),
        bg_tasks=background_tasks,
    )
    return APIResponse(success=True, message="Message sent", data=result)


@router.get("/messages/{other_user_id}", response_model=APIResponse)
async def get_conversation(other_user_id: str, page: int = Query(1, ge=1), size: int = Query(50, ge=1, le=200), current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    service = MessagingService(db)
    result = service.get_conversation(current_user.id, other_user_id, page=page, size=size)
    return APIResponse(success=True, message="Conversation retrieved", data=result)


@router.get("/conversations", response_model=APIResponse)
async def get_conversations(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    service = MessagingService(db)
    result = service.get_conversations_list(current_user.id)
    return APIResponse(success=True, message="Conversations retrieved", data=result)


@router.get("/notifications", response_model=APIResponse)
async def get_notifications(page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100), current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    service = MessagingService(db)
    result = service.get_notifications(current_user.id, page=page, size=size)
    return APIResponse(success=True, message="Notifications retrieved", data=result)


@router.put("/notifications/{notification_id}/read", response_model=APIResponse)
async def mark_notification_read(notification_id: str, current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    service = MessagingService(db)
    service.mark_notification_read(current_user.id, notification_id)
    return APIResponse(success=True, message="Notification marked as read")


@router.put("/notifications/read-all", response_model=APIResponse)
async def mark_all_notifications_read(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    service = MessagingService(db)
    service.mark_all_notifications_read(current_user.id)
    return APIResponse(success=True, message="All notifications marked as read")


@router.get("/unread-count", response_model=APIResponse)
async def get_unread_count(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    service = MessagingService(db)
    result = service.get_unread_count(current_user.id)
    return APIResponse(success=True, message="Unread count retrieved", data=result)
