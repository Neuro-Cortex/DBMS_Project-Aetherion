"""
Event Bus — dispatches events to registered handlers.

Supports two dispatch modes:
1. BackgroundTasks (default) — no external dependencies
2. Redis Pub/Sub — when Redis is available, for distributed systems
"""

import json
from typing import Optional, List
from fastapi import BackgroundTasks

from .types import Event, EventType, EventPriority
from .registry import get_handlers, subscribe, get_all_handlers
from ..logger import get_logger
from ..config import get_settings

logger = get_logger("events.bus")

# Global event bus instance
_event_bus: Optional["EventBus"] = None


class EventBus:
    """
    Central event dispatcher for the application.

    Usage:
        bus = get_event_bus()
        bus.dispatch(Event(type=EventType.EMERGENCY_SOS_CREATED, payload={...}), bg_tasks=background_tasks)
    """

    def __init__(self, redis_client=None):
        self._redis = redis_client
        self._settings = get_settings()

    async def dispatch(
        self,
        event: Event,
        bg_tasks: Optional[BackgroundTasks] = None,
    ) -> None:
        """
        Dispatch an event to all registered handlers.

        If BackgroundTasks is provided, handlers run as background tasks.
        If Redis is available, the event is also published to a Redis channel.
        Otherwise, handlers run synchronously.
        """
        handlers = get_handlers(event.type)

        if not handlers and not self._redis:
            return

        # Set correlation_id if not provided
        if not event.correlation_id:
            from ..logger import generate_request_id
            event.correlation_id = generate_request_id()

        logger.info(
            f"Dispatching event {event.type.value} to {len(handlers)} handler(s)",
            extra={"request_id": event.correlation_id, "extra_fields": {"event_type": event.type.value}},
        )

        # Publish to Redis channel for distributed processing
        if self._redis:
            await self._publish_to_redis(event)

        # Execute handlers
        for handler in handlers:
            if bg_tasks and event.priority < EventPriority.CRITICAL:
                # Non-critical events run as background tasks
                bg_tasks.add_task(self._run_handler_safe, handler, event)
            else:
                # Critical events or no BackgroundTasks → run immediately
                await self._run_handler_async(handler, event)

    async def _run_handler_async(self, handler, event: Event) -> None:
        """Run a handler directly (async or sync)."""
        try:
            result = handler(event)
            if result is not None and hasattr(result, "__await__"):
                await result
        except Exception as e:
            logger.error(
                f"Handler {handler.__name__} failed for {event.type.value}: {e}",
                extra={"request_id": event.correlation_id},
                exc_info=True,
            )

    def _run_handler_safe(self, handler, event: Event) -> None:
        """Run a handler safely in a background task (sync wrapper)."""
        try:
            result = handler(event)
            # If handler is async, we can't await in sync context
            # Background tasks should be sync or use asyncio.run
            if result is not None and hasattr(result, "__await__"):
                import asyncio
                asyncio.run(result)
        except Exception as e:
            logger.error(
                f"Background handler {handler.__name__} failed for {event.type.value}: {e}",
                extra={"request_id": event.correlation_id},
            )

    async def _publish_to_redis(self, event: Event) -> None:
        """Publish event to Redis channel for distributed processing."""
        try:
            channel = f"aetherion:events:{event.type.value.split('.')[0]}"
            await self._redis.publish(channel, json.dumps(event.to_dict()))
        except Exception as e:
            logger.warning(f"Failed to publish event to Redis: {e}")


def get_event_bus() -> EventBus:
    """Get or create the global event bus instance."""
    global _event_bus
    if _event_bus is None:
        # Try to get Redis client
        redis_client = None
        try:
            from ..deps import get_redis
            redis_client = get_redis()
        except Exception:
            pass
        _event_bus = EventBus(redis_client=redis_client)
    return _event_bus


def reset_event_bus() -> None:
    """Reset the event bus (useful for testing)."""
    global _event_bus
    _event_bus = None
