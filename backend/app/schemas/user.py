from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import date, datetime


# ============================================
# USER PROFILE SCHEMAS
# ============================================
class UserProfileResponse(BaseModel):
    id: str
    user_id: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    bio: Optional[str] = None
    height_cm: Optional[float] = None
    weight_kg: Optional[float] = None
    allergies: Optional[List[str]] = None
    chronic_conditions: Optional[List[str]] = None
    insurance_provider: Optional[str] = None
    insurance_policy_number: Optional[str] = None
    language_preference: str = "en"
    theme_preference: str = "dark"

    model_config = {"from_attributes": True}


class UserProfileUpdateRequest(BaseModel):
    first_name: Optional[str] = Field(None, max_length=100)
    last_name: Optional[str] = Field(None, max_length=100)
    bio: Optional[str] = Field(None, max_length=2000)
    height_cm: Optional[float] = Field(None, ge=50, le=300)
    weight_kg: Optional[float] = Field(None, ge=10, le=500)
    allergies: Optional[List[str]] = None
    chronic_conditions: Optional[List[str]] = None
    insurance_provider: Optional[str] = Field(None, max_length=255)
    insurance_policy_number: Optional[str] = Field(None, max_length=100)
    language_preference: Optional[str] = Field(None, max_length=10)
    theme_preference: Optional[str] = Field(None, max_length=10)


# ============================================
# USER ADDRESS SCHEMAS
# ============================================
class UserAddressCreateRequest(BaseModel):
    label: str = Field(default="home", max_length=50)
    street: Optional[str] = Field(None, max_length=255)
    city: str = Field(..., max_length=100)
    state: str = Field(..., max_length=100)
    zip_code: Optional[str] = Field(None, max_length=20)
    country: str = Field(default="USA", max_length=100)
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_primary: bool = False


class UserAddressResponse(BaseModel):
    id: str
    label: str
    street: Optional[str] = None
    city: str
    state: str
    zip_code: Optional[str] = None
    country: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_primary: bool

    model_config = {"from_attributes": True}


# ============================================
# EMERGENCY CONTACT SCHEMAS
# ============================================
class EmergencyContactCreateRequest(BaseModel):
    name: str = Field(..., max_length=150)
    relationship: str = Field(..., max_length=50)
    phone: str = Field(..., max_length=20)
    email: Optional[EmailStr] = None
    is_primary: bool = False


class EmergencyContactResponse(BaseModel):
    id: str
    name: str
    relationship: str
    phone: str
    email: Optional[str] = None
    is_primary: bool

    model_config = {"from_attributes": True}


# ============================================
# USER UPDATE SCHEMAS
# ============================================
class UserUpdateRequest(BaseModel):
    full_name: Optional[str] = Field(None, max_length=150)
    phone: Optional[str] = Field(None, max_length=20)
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    profile_image: Optional[str] = Field(None, max_length=500)
    blood_group: Optional[str] = None


# ============================================
# NOTIFICATION SETTINGS SCHEMAS
# ============================================
class NotificationSettingsUpdateRequest(BaseModel):
    email_notifications: Optional[bool] = None
    sms_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
    emergency_alerts: Optional[bool] = None
    appointment_reminders: Optional[bool] = None
    donation_reminders: Optional[bool] = None
    health_tips: Optional[bool] = None
    marketing_emails: Optional[bool] = None


class NotificationSettingsResponse(BaseModel):
    email_notifications: bool = True
    sms_notifications: bool = True
    push_notifications: bool = True
    emergency_alerts: bool = True
    appointment_reminders: bool = True
    donation_reminders: bool = True
    health_tips: bool = True
    marketing_emails: bool = False

    model_config = {"from_attributes": True}


# ============================================
# FULL USER DETAIL (User + Profile combined)
# ============================================
class UserDetailResponse(BaseModel):
    id: str
    email: str
    full_name: str
    phone: Optional[str] = None
    gender: Optional[str] = None
    date_of_birth: Optional[date] = None
    profile_image: Optional[str] = None
    blood_group: Optional[str] = None
    primary_role: str
    roles: List[str]
    upgrades: List[str] = []
    is_verified: bool = False
    is_admin_approved: bool = False
    is_active: bool = True
    is_online: bool = False
    profile: Optional[UserProfileResponse] = None
    addresses: List[UserAddressResponse] = []
    emergency_contacts: List[EmergencyContactResponse] = []
    notification_settings: Optional[NotificationSettingsResponse] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ============================================
# USER DOCUMENT SCHEMAS
# ============================================
class UserDocumentCreateRequest(BaseModel):
    type: str = Field(..., pattern="^(id-proof|medical-certificate|license|degree|certificate|other)$")
    name: str = Field(..., min_length=1, max_length=255)
    file_url: str = Field(..., min_length=1, max_length=500)


class UserDocumentResponse(BaseModel):
    id: str
    type: Optional[str] = None
    name: Optional[str] = None
    file_url: Optional[str] = None
    verified: bool = False
    verified_by: Optional[str] = None
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}


# ============================================
# USER PREFERENCE SCHEMAS
# ============================================
class UserPreferenceUpdateRequest(BaseModel):
    language: Optional[str] = None
    voice_enabled: Optional[bool] = None
    theme: Optional[str] = None
    font_size: Optional[str] = Field(default=None, pattern="^(small|medium|large)$")
    sidebar_collapsed: Optional[bool] = None


class UserPreferenceResponse(BaseModel):
    id: str
    user_id: str
    language: Optional[str] = None
    voice_enabled: Optional[bool] = None
    theme: Optional[str] = None
    font_size: Optional[str] = None
    sidebar_collapsed: Optional[bool] = None

    model_config = {"from_attributes": True}
