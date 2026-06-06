"""
WebSocket authentication helper.

Validates JWT tokens passed as query parameters for WebSocket connections.
"""

from fastapi import WebSocket
from typing import Optional

from ...core.security import decode_and_validate_token
from ...core.database import SessionLocal
from ...models.user import User, UserRole, Role
from ...core.permissions import CurrentUser
from ...core.logger import get_logger

logger = get_logger("ws.auth")


async def authenticate_websocket(websocket: WebSocket) -> Optional[CurrentUser]:
    """
    Authenticate a WebSocket connection using JWT token from query params.

    Usage:
        user = await authenticate_websocket(websocket)
        if not user:
            await websocket.close(code=4001, reason="Authentication required")
            return

    Token can be provided via:
        - Query parameter: ws://host/ws/endpoint?token=xxx
        - First message: {"type": "auth", "token": "xxx"}
    """
    token = websocket.query_params.get("token")

    if not token:
        # Try to receive auth from first message
        try:
            data = await asyncio.wait_for(websocket.receive_json(), timeout=5.0)
            if isinstance(data, dict) and data.get("type") == "auth":
                token = data.get("token")
        except Exception:
            return None

    if not token:
        return None

    payload = decode_and_validate_token(token, expected_type="access")
    if not payload:
        return None

    user_id = payload.get("sub")
    if not user_id:
        return None

    # Verify user exists and is active
    db = SessionLocal()
    try:
        user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
        if not user:
            return None

        # Load roles
        role_rows = (
            db.query(Role.name)
            .join(UserRole, UserRole.role_id == Role.id)
            .filter(UserRole.user_id == user_id, UserRole.is_active == True, Role.is_active == True)
            .all()
        )
        roles = [r[0] for r in role_rows]
        primary_role = payload.get("role", "client")

        return CurrentUser(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            role=primary_role,
            roles=roles,
            primary_role=primary_role,
            is_active=user.is_active,
            is_admin_approved=user.is_admin_approved,
            is_verified=user.is_verified,
        )
    finally:
        db.close()


import asyncio  # noqa: E402 — needed for wait_for above
