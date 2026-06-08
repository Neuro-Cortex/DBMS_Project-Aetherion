"""
Aetherion WebSocket API Package.

Real-time endpoints for emergency tracking, messaging, and notifications.
"""

from fastapi import APIRouter

from .emergency import router as emergency_ws_router
from .messaging import router as messaging_ws_router
from .notifications import router as notifications_ws_router

ws_router = APIRouter(tags=["WebSocket"])

ws_router.include_router(emergency_ws_router)
ws_router.include_router(messaging_ws_router)
ws_router.include_router(notifications_ws_router)

__all__ = ["ws_router"]
