"""
Celery application configuration for Aetherion.

When Celery is not configured (CELERY_BROKER_URL is None),
tasks fall back to synchronous execution or FastAPI BackgroundTasks.
"""

from .config import get_settings

settings = get_settings()

_celery_app = None


def get_celery_app():
    """
    Get or create the Celery application instance.
    Returns None if Celery is not configured.
    """
    global _celery_app
    if _celery_app is not None:
        return _celery_app

    broker_url = settings.CELERY_EFFECTIVE_BROKER_URL
    if not broker_url:
        return None

    try:
        from celery import Celery

        _celery_app = Celery(
            "aetherion",
            broker=broker_url,
            backend=settings.CELERY_EFFECTIVE_RESULT_BACKEND,
        )

        _celery_app.conf.update(
            task_serializer="json",
            result_serializer="json",
            accept_content=["json"],
            timezone="UTC",
            enable_utc=True,
            task_track_started=True,
            task_acks_late=True,
            worker_prefetch_multiplier=1,
            task_always_eager=settings.CELERY_TASK_ALWAYS_EAGER,
            # Retry settings
            task_default_retry_delay=60,
            task_max_retries=3,
            # Result settings
            result_expires=3600,
        )

        # Auto-discover tasks from core.tasks package
        _celery_app.autodiscover_tasks(["app.core.tasks"])

    except ImportError:
        # Celery not installed — tasks will run synchronously
        return None

    return _celery_app


def dispatch_task(task_name: str, *args, **kwargs):
    """
    Dispatch a task to Celery if available, otherwise return None.
    The caller should fall back to BackgroundTasks or synchronous execution.

    Args:
        task_name: Dotted path to the task function (e.g., "app.core.tasks.notifications.send_email_task")
        *args, **kwargs: Arguments to pass to the task

    Returns:
        Celery AsyncResult if dispatched, None if Celery not available
    """
    app = get_celery_app()
    if app and not settings.CELERY_TASK_ALWAYS_EAGER:
        try:
            return app.send_task(task_name, args=args, kwargs=kwargs)
        except Exception:
            return None
    return None
