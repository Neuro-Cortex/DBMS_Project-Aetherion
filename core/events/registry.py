"""
Event handler registry — maps event types to handler functions.
"""

from typing import Dict, List, Callable, Optional
from .types import EventType, Event
from ..logger import get_logger

logger = get_logger("events.registry")

# Global registry: event type → list of handler functions
_handlers: Dict[EventType, List[Callable]] = {}


def subscribe(event_type: EventType, handler: Callable) -> None:
    """Register a handler for an event type."""
    if event_type not in _handlers:
        _handlers[event_type] = []
    _handlers[event_type].append(handler)
    logger.info(f"Registered handler {handler.__name__} for {event_type.value}")


def unsubscribe(event_type: EventType, handler: Callable) -> None:
    """Remove a handler for an event type."""
    if event_type in _handlers:
        _handlers[event_type] = [h for h in _handlers[event_type] if h != handler]


def get_handlers(event_type: EventType) -> List[Callable]:
    """Get all registered handlers for an event type."""
    return _handlers.get(event_type, [])


def get_all_handlers() -> Dict[EventType, List[Callable]]:
    """Return the complete handler registry."""
    return _handlers.copy()


def clear_handlers() -> None:
    """Remove all registered handlers (useful for testing)."""
    _handlers.clear()


def subscribe_multiple(event_type: EventType, handlers: List[Callable]) -> None:
    """Register multiple handlers for an event type at once."""
    for handler in handlers:
        subscribe(event_type, handler)
