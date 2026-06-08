"""
Event types and data classes for the Aetherion event-driven system.
"""

from enum import Enum
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional, Dict, Any


class EventType(str, Enum):
    """All event types in the system, namespaced by domain."""

    # ── Emergency ──────────────────────────────
    EMERGENCY_SOS_CREATED = "emergency.sos.created"
    EMERGENCY_REQUEST_CREATED = "emergency.request.created"
    EMERGENCY_DISPATCHED = "emergency.dispatched"
    EMERGENCY_EN_ROUTE = "emergency.en_route"
    EMERGENCY_COMPLETED = "emergency.completed"
    EMERGENCY_CANCELLED = "emergency.cancelled"

    # ── Blood Donation ─────────────────────────
    BLOOD_REQUEST_CREATED = "blood.request.created"
    BLOOD_DONATION_RECORDED = "blood.donation.recorded"
    BLOOD_DONOR_ELIGIBLE = "blood.donor.eligible"
    BLOOD_REQUEST_FULFILLED = "blood.request.fulfilled"

    # ── Oxygen ─────────────────────────────────
    OXYGEN_REQUEST_CREATED = "oxygen.request.created"
    OXYGEN_LOW_STOCK_ALERT = "oxygen.low_stock.alert"
    OXYGEN_REQUEST_FULFILLED = "oxygen.request.fulfilled"

    # ── Appointments ───────────────────────────
    APPOINTMENT_BOOKED = "appointment.booked"
    APPOINTMENT_CANCELLED = "appointment.cancelled"
    APPOINTMENT_RESCHEDULED = "appointment.rescheduled"
    APPOINTMENT_COMPLETED = "appointment.completed"

    # ── Auth / Users ───────────────────────────
    USER_REGISTERED = "user.registered"
    USER_VERIFIED = "user.verified"
    USER_PASSWORD_CHANGED = "user.password_changed"
    USER_ROLE_SWITCHED = "user.role_switched"

    # ── Admin ──────────────────────────────────
    VERIFICATION_APPROVED = "admin.verification.approved"
    VERIFICATION_REJECTED = "admin.verification.rejected"
    USER_DEACTIVATED = "admin.user.deactivated"

    # ── Messaging ──────────────────────────────
    MESSAGE_SENT = "messaging.message_sent"
    NOTIFICATION_CREATED = "messaging.notification_created"

    # ── Pharmacy ───────────────────────────────
    ORDER_PLACED = "pharmacy.order_placed"
    ORDER_STATUS_CHANGED = "pharmacy.order_status_changed"
    STOCK_ALERT = "pharmacy.stock_alert"

    # ── Search ─────────────────────────────────
    SEARCH_PERFORMED = "search.performed"


# Event priority levels for processing order
class EventPriority(int, Enum):
    LOW = 0
    NORMAL = 1
    HIGH = 2
    CRITICAL = 3


@dataclass
class Event:
    """Represents a single event in the system."""

    type: EventType
    payload: Dict[str, Any]
    timestamp: datetime = field(default_factory=datetime.utcnow)
    correlation_id: str = ""
    user_id: Optional[str] = None
    priority: EventPriority = EventPriority.NORMAL
    metadata: Dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "type": self.type.value,
            "payload": self.payload,
            "timestamp": self.timestamp.isoformat(),
            "correlation_id": self.correlation_id,
            "user_id": self.user_id,
            "priority": self.priority.value,
            "metadata": self.metadata,
        }
