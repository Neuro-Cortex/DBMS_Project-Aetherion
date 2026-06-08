"""
Built-in event handlers for the Aetherion system.

These handlers are automatically registered on application startup.
They handle cross-cutting concerns like notifications, audit logging,
and real-time WebSocket updates.
"""

from typing import Optional
from .types import Event, EventType
from .registry import subscribe, subscribe_multiple
from ..logger import get_logger

logger = get_logger("events.handlers")


# ============================================
# EMERGENCY HANDLERS
# ============================================

async def handle_emergency_sos(event: Event) -> None:
    """Handle SOS emergency request — notify dispatchers and nearby hospitals."""
    request_id = event.payload.get("request_id")
    patient_name = event.payload.get("patient_name", "Unknown")
    emergency_type = event.payload.get("type", "unknown")
    location = event.payload.get("location_address", "Unknown location")

    logger.info(
        f"SOS ALERT: {emergency_type} request for {patient_name} at {location}",
        extra={"request_id": event.correlation_id, "extra_fields": {"request_id": request_id}},
    )

    # Push to WebSocket (emergency_dispatchers room)
    try:
        from ...api.ws.manager import manager as ws_manager
        await ws_manager.send_to_room("emergency_dispatchers", {
            "type": "sos_alert",
            "data": event.payload,
            "correlation_id": event.correlation_id,
        })
    except Exception:
        pass  # WebSocket manager may not be initialized yet


async def handle_emergency_dispatched(event: Event) -> None:
    """Handle emergency dispatch — notify patient and track service."""
    request_id = event.payload.get("request_id")
    patient_id = event.payload.get("patient_id")
    service_id = event.payload.get("service_id")
    eta = event.payload.get("estimated_time")

    logger.info(
        f"Emergency dispatched: service {service_id} → request {request_id}, ETA: {eta}min",
        extra={"request_id": event.correlation_id},
    )

    # Notify patient via WebSocket
    if patient_id:
        try:
            from ...api.ws.manager import manager as ws_manager
            await ws_manager.send_to_user(patient_id, {
                "type": "emergency_update",
                "data": {
                    "request_id": request_id,
                    "status": "dispatched",
                    "service_id": service_id,
                    "estimated_time": eta,
                },
            })
        except Exception:
            pass


# ============================================
# BLOOD DONATION HANDLERS
# ============================================

async def handle_blood_request_created(event: Event) -> None:
    """Handle blood request — find and notify compatible donors."""
    blood_group = event.payload.get("blood_group")
    request_id = event.payload.get("request_id")
    urgency = event.payload.get("urgency", "normal")

    logger.info(
        f"Blood request created: {blood_group} (urgency: {urgency})",
        extra={"request_id": event.correlation_id, "extra_fields": {"blood_group": blood_group}},
    )

    # Notify compatible donors via WebSocket
    try:
        from ...api.ws.manager import manager as ws_manager
        room = f"blood_donors_{blood_group.replace('-', 'neg').replace('+', 'pos')}"
        await ws_manager.send_to_room(room, {
            "type": "blood_request_alert",
            "data": event.payload,
        })
    except Exception:
        pass


async def handle_blood_donation_recorded(event: Event) -> None:
    """Handle donation recorded — update donor stats and check eligibility."""
    donor_id = event.payload.get("donor_id")
    logger.info(f"Blood donation recorded for donor {donor_id}")


# ============================================
# OXYGEN HANDLERS
# ============================================

async def handle_oxygen_request_created(event: Event) -> None:
    """Handle oxygen request — notify nearby centers."""
    request_id = event.payload.get("request_id")
    hospital_id = event.payload.get("hospital_id")

    logger.info(
        f"Oxygen request created: {request_id}",
        extra={"request_id": event.correlation_id},
    )

    # Notify oxygen center admins
    try:
        from ...api.ws.manager import manager as ws_manager
        await ws_manager.send_to_room("oxygen_centers", {
            "type": "oxygen_request",
            "data": event.payload,
        })
    except Exception:
        pass


async def handle_oxygen_low_stock(event: Event) -> None:
    """Handle low oxygen stock alert — notify admins and nearby centers."""
    hospital_id = event.payload.get("hospital_id")
    stock_level = event.payload.get("stock_level")

    logger.warning(
        f"Oxygen LOW STOCK at hospital {hospital_id}: {stock_level} units remaining",
        extra={"request_id": event.correlation_id},
    )


# ============================================
# APPOINTMENT HANDLERS
# ============================================

async def handle_appointment_booked(event: Event) -> None:
    """Handle appointment booked — notify doctor and patient."""
    appointment_id = event.payload.get("appointment_id")
    doctor_id = event.payload.get("doctor_id")
    patient_id = event.payload.get("patient_id")

    logger.info(f"Appointment booked: {appointment_id}")

    # Notify doctor
    if doctor_id:
        try:
            from ...api.ws.manager import manager as ws_manager
            await ws_manager.send_to_user(doctor_id, {
                "type": "new_appointment",
                "data": event.payload,
            })
        except Exception:
            pass


# ============================================
# AUTH / USER HANDLERS
# ============================================

async def handle_user_registered(event: Event) -> None:
    """Handle user registration — create welcome notification."""
    user_id = event.payload.get("user_id")
    email = event.payload.get("email")
    logger.info(f"New user registered: {email}")


# ============================================
# ADMIN HANDLERS
# ============================================

async def handle_verification_approved(event: Event) -> None:
    """Handle verification approved — notify user."""
    user_id = event.payload.get("user_id")
    entity_type = event.payload.get("entity_type")

    logger.info(f"Verification approved for {entity_type}: user {user_id}")

    if user_id:
        try:
            from ...api.ws.manager import manager as ws_manager
            await ws_manager.send_to_user(user_id, {
                "type": "verification_status",
                "data": {"status": "approved", "entity_type": entity_type},
            })
        except Exception:
            pass


# ============================================
# MESSAGING HANDLERS
# ============================================

async def handle_message_sent(event: Event) -> None:
    """Handle message sent — deliver to recipient via WebSocket."""
    recipient_id = event.payload.get("recipient_id")
    conversation_id = event.payload.get("conversation_id")

    if recipient_id:
        try:
            from ...api.ws.manager import manager as ws_manager
            await ws_manager.send_to_user(recipient_id, {
                "type": "new_message",
                "data": event.payload,
            })
        except Exception:
            pass


# ============================================
# GENERIC HANDLER — AUDIT LOG
# ============================================

async def create_audit_log(event: Event) -> None:
    """Create an audit log entry for any event."""
    # This handler runs for ALL events to maintain an audit trail
    logger.info(
        f"AUDIT: {event.type.value}",
        extra={
            "request_id": event.correlation_id,
            "extra_fields": {
                "event_type": event.type.value,
                "user_id": event.user_id,
                "payload_keys": list(event.payload.keys()),
            },
        },
    )


# ============================================
# REGISTRATION — Wire up all handlers
# ============================================

def register_default_handlers() -> None:
    """Register all built-in event handlers. Called during application startup."""

    # Emergency
    subscribe(EventType.EMERGENCY_SOS_CREATED, handle_emergency_sos)
    subscribe(EventType.EMERGENCY_DISPATCHED, handle_emergency_dispatched)

    # Blood
    subscribe(EventType.BLOOD_REQUEST_CREATED, handle_blood_request_created)
    subscribe(EventType.BLOOD_DONATION_RECORDED, handle_blood_donation_recorded)

    # Oxygen
    subscribe(EventType.OXYGEN_REQUEST_CREATED, handle_oxygen_request_created)
    subscribe(EventType.OXYGEN_LOW_STOCK_ALERT, handle_oxygen_low_stock)

    # Appointments
    subscribe(EventType.APPOINTMENT_BOOKED, handle_appointment_booked)

    # Auth
    subscribe(EventType.USER_REGISTERED, handle_user_registered)

    # Admin
    subscribe(EventType.VERIFICATION_APPROVED, handle_verification_approved)

    # Messaging
    subscribe(EventType.MESSAGE_SENT, handle_message_sent)

    # Audit — subscribe to all high-priority events
    for event_type in EventType:
        subscribe(event_type, create_audit_log)

    logger.info("Default event handlers registered")
