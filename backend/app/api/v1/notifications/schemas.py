"""
Notification schemas
"""
from pydantic import BaseModel
from typing import Optional, Dict

class PushTokenRegister(BaseModel):
    token: str
    device_type: str
    device_model: Optional[str] = None

class NotificationPreferences(BaseModel):
    email_enabled: bool = True
    sms_enabled: bool = True
    push_enabled: bool = True
    appointment_reminders: bool = True
    medicine_reminders: bool = True
    emergency_alerts: bool = True
    blood_donation_alerts: bool = True
    promotional: bool = False