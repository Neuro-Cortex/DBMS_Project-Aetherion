"""
Aetherion Event-Driven System.

Provides a centralized event bus for decoupled communication between modules.
"""

from .types import EventType, Event, EventPriority
from .bus import EventBus, get_event_bus, reset_event_bus
from .registry import subscribe, unsubscribe, get_handlers, get_all_handlers
from .handlers import register_default_handlers

__all__ = [
    "EventType",
    "Event",
    "EventPriority",
    "EventBus",
    "get_event_bus",
    "reset_event_bus",
    "subscribe",
    "unsubscribe",
    "get_handlers",
    "get_all_handlers",
    "register_default_handlers",
]
