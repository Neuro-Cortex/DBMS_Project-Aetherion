"""
User schemas
"""
from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime
from app.models.base import UserRole, Gender, BloodGroup

class UserProfileUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    gender: Optional[Gender] = None
    date_of_birth: Optional[datetime] = None
    blood_group: Optional[BloodGroup] = None
    address: Optional[str] = None
    city: Optional[str] = None
    country: Optional[str] = None
    language: Optional[str] = None
    timezone: Optional[str] = None
    dark_mode_enabled: Optional[bool] = None
    profile_image_url: Optional[str] = None

class UserLocationUpdate(BaseModel):
    latitude: float
    longitude: float

class RoleUpdateRequest(BaseModel):
    role: UserRole

class NotificationPreferences(BaseModel):
    email_notifications: Optional[bool] = True
    sms_notifications: Optional[bool] = True
    push_notifications: Optional[bool] = True
    emergency_alerts: Optional[bool] = True
    appointment_reminders: Optional[bool] = True
    medicine_reminders: Optional[bool] = True
    blood_donation_alerts: Optional[bool] = True

class EmergencyContactCreate(BaseModel):
    name: str
    phone: str
    email: Optional[EmailStr] = None
    relationship: str
    is_primary: Optional[bool] = False
    notify_on_emergency: Optional[bool] = True

class EmergencyContactUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[EmailStr] = None
    relationship: Optional[str] = None
    is_primary: Optional[bool] = None
    notify_on_emergency: Optional[bool] = None