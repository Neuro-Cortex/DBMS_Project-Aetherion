"""
Messaging WebSocket endpoint — real-time chat.

Connection: ws://host/api/v1/ws/messaging?token=xxx

Message types (server → client):
  - new_message: New message received
  - typing: User is typing in a conversation
  - read_receipt: Message read confirmation
  - conversation_update: Conversation metadata changed

Message types (client → server):
  - send_message: Send a new message
  - typing: Notify typing
  - mark_read: Mark messages as read
  - ping: Keep-alive
"""

from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import Optional
from datetime import datetime

from .manager import manager
from .auth import authenticate_websocket
from ...core.logger import get_logger

logger = get_logger("ws.messaging")

router = APIRouter()


@router.websocket("/messaging")
async def messaging_websocket(websocket: WebSocket):
    """Real-time messaging WebSocket endpoint."""
    user = await authenticate_websocket(websocket)
    if not user:
        await websocket.close(code=4001, reason="Authentication required")
        return

    user_id = user.id
    await manager.connect(websocket, user_id)

    try:
        while True:
            data = await websocket.receive_json()

            msg_type = data.get("type", "")

            if msg_type == "send_message":
                recipient_id = data.get("recipient_id")
                conversation_id = data.get("conversation_id")
                content = data.get("content", "")

                # Notify recipient in real-time
                message_data = {
                    "type": "new_message",
                    "data": {
                        "sender_id": user_id,
                        "sender_name": user.full_name,
                        "conversation_id": conversation_id,
                        "content": content,
                        "timestamp": datetime.utcnow().isoformat(),
                    },
                }
                await manager.send_to_user(recipient_id, message_data)

                # Acknowledge to sender
                await websocket.send_json({
                    "type": "message_sent",
                    "conversation_id": conversation_id,
                })

            elif msg_type == "typing":
                recipient_id = data.get("recipient_id")
                conversation_id = data.get("conversation_id")
                await manager.send_to_user(recipient_id, {
                    "type": "typing",
                    "data": {
                        "user_id": user_id,
                        "conversation_id": conversation_id,
                    },
                })

            elif msg_type == "mark_read":
                conversation_id = data.get("conversation_id")
                # Notify other participants
                other_user_id = data.get("other_user_id")
                if other_user_id:
                    await manager.send_to_user(other_user_id, {
                        "type": "read_receipt",
                        "data": {
                            "user_id": user_id,
                            "conversation_id": conversation_id,
                        },
                    })

            elif msg_type == "ping":
                await websocket.send_json({"type": "pong"})

    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
        logger.info(f"Messaging WS disconnected: user {user_id}")
    except Exception as e:
        logger.error(f"Messaging WS error for user {user_id}: {e}")
        manager.disconnect(websocket, user_id)
