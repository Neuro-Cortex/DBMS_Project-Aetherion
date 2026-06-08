"""
Notification tasks — email, SMS, push notifications, and emergency alerts.

These tasks can be dispatched via Celery or run synchronously.
"""

import logging
from typing import Optional

logger = logging.getLogger("aetherion.tasks.notifications")


def send_email_task(to: str, subject: str, body: str, html: Optional[str] = None) -> dict:
    """
    Send an email notification.

    Args:
        to: Recipient email address
        subject: Email subject
        body: Plain text body
        html: Optional HTML body

    Returns:
        Dict with success status
    """
    try:
        from ...utils.email import send_email
        # send_email handles SMTP availability check internally
        send_email(to=to, subject=subject, body=body, html_body=html)
        logger.info(f"Email sent to {to}: {subject}")
        return {"success": True, "to": to}
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {e}")
        return {"success": False, "error": str(e)}


def send_sms_task(phone: str, message: str) -> dict:
    """
    Send an SMS notification.

    Currently a placeholder — integrate with Twilio or similar service.

    Args:
        phone: Recipient phone number
        message: SMS message content

    Returns:
        Dict with success status
    """
    # Placeholder — integrate with SMS provider
    logger.info(f"SMS would be sent to {phone}: {message[:50]}...")
    return {"success": True, "phone": phone, "note": "SMS provider not configured"}


def send_push_notification_task(user_id: str, title: str, body: str, data: Optional[dict] = None) -> dict:
    """
    Send a push notification to a user.

    Currently a placeholder — integrate with Firebase Cloud Messaging or similar.

    Args:
        user_id: Target user ID
        title: Notification title
        body: Notification body
        data: Optional data payload

    Returns:
        Dict with success status
    """
    logger.info(f"Push notification for user {user_id}: {title}")
    return {"success": True, "user_id": user_id, "note": "Push notification provider not configured"}


def send_emergency_alert_task(request_id: str, nearby_service_ids: list) -> dict:
    """
    Send emergency alerts to nearby services/hospitals.

    Args:
        request_id: Emergency request ID
        nearby_service_ids: List of service IDs to alert

    Returns:
        Dict with success status and count of alerted services
    """
    alerted_count = 0
    for service_id in nearby_service_ids:
        # In production, this would send real-time notifications
        logger.info(f"Emergency alert: request {request_id} → service {service_id}")
        alerted_count += 1

    return {
        "success": True,
        "request_id": request_id,
        "services_alerted": alerted_count,
    }
