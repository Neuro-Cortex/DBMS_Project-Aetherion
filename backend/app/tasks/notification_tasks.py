"""
Background notification tasks
"""
from app.core.celery_app import celery_app
from app.services.notification_service import NotificationService
from app.integrations.firebase import firebase_client
from app.integrations.twilio import twilio_client
from app.integrations.sendgrid import sendgrid_client
import logging
from typing import List, Dict, Any

logger = logging.getLogger(__name__)

@celery_app.task(name="send_push_notification")
def send_push_notification(
    token: str,
    title: str,
    body: str,
    data: Dict[str, str] = None
):
    """Send push notification via Firebase"""
    import asyncio
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(
        firebase_client.send_push_notification(token, title, body, data)
    )

@celery_app.task(name="send_sms_notification")
def send_sms_notification(to_number: str, message: str):
    """Send SMS notification via Twilio"""
    import asyncio
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(
        twilio_client.send_sms(to_number, message)
    )

@celery_app.task(name="send_email_notification")
def send_email_notification(
    to_email: str,
    subject: str,
    content: str
):
    """Send email notification via SendGrid"""
    import asyncio
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(
        sendgrid_client.send_email(to_email, subject, content)
    )

@celery_app.task(name="send_bulk_notifications")
def send_bulk_notifications(
    user_ids: List[str],
    notification_type: str,
    title: str,
    message: str,
    channels: List[str] = ["push", "email"]
):
    """Send bulk notifications to users"""
    import asyncio
    
    async def _send():
        # This would use NotificationService to send to all users
        pass
    
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(_send())

@celery_app.task(name="send_emergency_notifications")
def send_emergency_notifications(
    user_ids: List[str],
    alert_data: Dict[str, Any]
):
    """Send emergency notifications"""
    import asyncio
    
    async def _send():
        from app.services.realtime_service import realtime_service
        await realtime_service.notify_emergency_alert(user_ids, alert_data)
    
    loop = asyncio.get_event_loop()
    return loop.run_until_complete(_send())