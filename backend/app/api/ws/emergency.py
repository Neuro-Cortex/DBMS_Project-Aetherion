"""
Emergency WebSocket endpoint — live emergency tracking.

Connection: ws://host/api/v1/ws/emergency?token=xxx

Message types (server → client):
  - sos_alert: New SOS received (for dispatchers/admins)
  - emergency_update: Status change on tracked emergency
  - location_update: Live location of dispatched ambulance/service
  - status_change: Emergency request status changed

Message types (client → server):
  - subscribe: Subscribe to specific emergency request updates
  - unsubscribe: Unsubscribe from a request
  - ping: Keep-alive
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Optional

from .manager import manager
from .auth import authenticate_websocket
from ...core.logger import get_logger

logger = get_logger("ws.emergency")

router = APIRouter()


@router.websocket("/emergency")
async def emergency_websocket(websocket: WebSocket):
    """Emergency live tracking WebSocket endpoint."""
    # Authenticate
    user = await authenticate_websocket(websocket)
    if not user:
        await websocket.close(code=4001, reason="Authentication required")
        return

    user_id = user.id
    await manager.connect(websocket, user_id)

    # Auto-join rooms based on role
    if user.is_admin or user.is_hospital:
        manager.join_room(user_id, "emergency_dispatchers")

    try:
        while True:
            data = await websocket.receive_json()

            msg_type = data.get("type", "")

            if msg_type == "subscribe":
                request_id = data.get("request_id")
                if request_id:
                    manager.join_room(user_id, f"emergency_{request_id}")
                    await websocket.send_json({
                        "type": "subscribed",
                        "request_id": request_id,
                    })

            elif msg_type == "unsubscribe":
                request_id = data.get("request_id")
                if request_id:
                    manager.leave_room(user_id, f"emergency_{request_id}")

            elif msg_type == "ping":
                await websocket.send_json({"type": "pong"})

    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        logger.info(f"Emergency WS disconnected: user {user_id}")
    except Exception as e:
        logger.error(f"Emergency WS error for user {user_id}: {e}")
        manager.disconnect(websocket, user_id)
