"""
Notifications WebSocket endpoint — live push notifications.

Connection: ws://host/api/v1/ws/notifications?token=xxx

Message types (server → client):
  - notification: New notification (emergency alert, blood request, appointment reminder, etc.)
  - unread_count: Updated unread notification count
  - notification_read: Notification marked as read

Message types (client → server):
  - mark_read: Mark a notification as read
  - mark_all_read: Mark all notifications as read
  - ping: Keep-alive
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Optional

from .manager import manager
from .auth import authenticate_websocket
from ...core.logger import get_logger

logger = get_logger("ws.notifications")

router = APIRouter()


@router.websocket("/notifications")
async def notifications_websocket(websocket: WebSocket):
    """Live notifications WebSocket endpoint."""
    user = await authenticate_websocket(websocket)
    if not user:
        await websocket.close(code=4001, reason="Authentication required")
        return

    user_id = user.id
    await manager.connect(websocket, user_id)

    # Send initial unread count
    try:
        from ...core.database import SessionLocal
        from ...models.messaging import Notification
        db = SessionLocal()
        try:
            unread = db.query(Notification).filter(
                Notification.user_id == user_id,
                Notification.is_read == False,
            ).count()
            await websocket.send_json({
                "type": "unread_count",
                "count": unread,
            })
        finally:
            db.close()
    except Exception:
        pass

    try:
        while True:
            data = await websocket.receive_json()

            msg_type = data.get("type", "")

            if msg_type == "mark_read":
                notification_id = data.get("notification_id")
                # Mark as read in database
                try:
                    from ...core.database import SessionLocal
                    from ...models.messaging import Notification
                    db = SessionLocal()
                    try:
                        db.query(Notification).filter(
                            Notification.id == notification_id,
                            Notification.user_id == user_id,
                        ).update({"is_read": True})
                        db.commit()
                    finally:
                        db.close()
                except Exception:
                    pass

                await websocket.send_json({
                    "type": "notification_read",
                    "notification_id": notification_id,
                })

            elif msg_type == "mark_all_read":
                try:
                    from ...core.database import SessionLocal
                    from ...models.messaging import Notification
                    db = SessionLocal()
                    try:
                        db.query(Notification).filter(
                            Notification.user_id == user_id,
                            Notification.is_read == False,
                        ).update({"is_read": True})
                        db.commit()
                    finally:
                        db.close()
                except Exception:
                    pass

                await websocket.send_json({
                    "type": "unread_count",
                    "count": 0,
                })

            elif msg_type == "ping":
                await websocket.send_json({"type": "pong"})

    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        logger.info(f"Notifications WS disconnected: user {user_id}")
    except Exception as e:
        logger.error(f"Notifications WS error for user {user_id}: {e}")
        manager.disconnect(websocket, user_id)
