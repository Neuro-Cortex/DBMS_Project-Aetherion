from sqlalchemy import (
    Column, String, Boolean, Date, DateTime, Text, Integer, DECIMAL, JSON,
    Enum as SQLEnum, ForeignKey, Index, func
)
from sqlalchemy.dialects.mysql import CHAR
from ..core.database import Base
from .base import BaseModel


# ============================================
# ROLES
# ============================================
class Role(Base, BaseModel):
    __tablename__ = "roles"

    name = Column(String(50), unique=True, nullable=False)
    display_name = Column(String(100), nullable=False)
    description = Column(Text)
    priority = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)


# ============================================
# USERS (Core Identity)
# ============================================
class User(Base, BaseModel):
    __tablename__ = "users"

    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(20))
    password_hash = Column(String(255), nullable=False)
    full_name = Column(String(150), nullable=False)
    gender = Column(SQLEnum("male", "female", "other", "prefer-not-to-say"))
    date_of_birth = Column(Date)
    profile_image = Column(String(500))
    blood_group = Column(SQLEnum("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"))
    primary_role_id = Column(CHAR(36), ForeignKey("roles.id"), nullable=False)
    is_verified = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    is_admin_approved = Column(Boolean, default=False)
    is_online = Column(Boolean, default=False)
    deleted_at = Column(DateTime, nullable=True)


# ============================================
# USER SESSIONS (JWT Refresh Tokens)
# ============================================
class UserSession(Base, BaseModel):
    __tablename__ = "user_sessions"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    refresh_token = Column(String(500), unique=True, nullable=False)
    device_info = Column(String(255))
    ip_address = Column(String(45))
    expires_at = Column(DateTime, nullable=False)
    is_revoked = Column(Boolean, default=False)


# ============================================
# USER ROLES (Many-to-Many)
# ============================================
class UserRole(Base, BaseModel):
    __tablename__ = "user_roles"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    role_id = Column(CHAR(36), ForeignKey("roles.id", ondelete="CASCADE"), nullable=False, index=True)
    is_active = Column(Boolean, default=True)

    __table_args__ = (Index("ix_user_roles_user_role", "user_id", "role_id", unique=True),)


# ============================================
# USER ROLE UPGRADES
# ============================================
class UserRoleUpgrade(Base, BaseModel):
    __tablename__ = "user_role_upgrades"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    from_role_id = Column(CHAR(36), ForeignKey("roles.id"), nullable=True)
    to_role_id = Column(CHAR(36), ForeignKey("roles.id"), nullable=False)
    status = Column(SQLEnum("pending", "approved", "rejected"), default="pending")
    reviewed_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    notes = Column(Text)


# ============================================
# USER PROFILES (Extended Info)
# ============================================
class UserProfile(Base, BaseModel):
    __tablename__ = "user_profiles"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    bio = Column(Text)
    height_cm = Column(DECIMAL(5, 1))
    weight_kg = Column(DECIMAL(5, 1))
    allergies = Column(JSON)
    chronic_conditions = Column(JSON)
    insurance_provider = Column(String(255))
    insurance_policy_number = Column(String(100))
    language_preference = Column(String(10), default="en")
    theme_preference = Column(String(10), default="dark")


# ============================================
# USER ADDRESSES
# ============================================
class UserAddress(Base, BaseModel):
    __tablename__ = "user_addresses"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    label = Column(String(50), default="home")
    street = Column(String(255))
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    zip_code = Column(String(20))
    country = Column(String(100), default="USA")
    latitude = Column(DECIMAL(10, 7))
    longitude = Column(DECIMAL(10, 7))
    is_primary = Column(Boolean, default=False)


# ============================================
# USER EMERGENCY CONTACTS
# ============================================
class UserEmergencyContact(Base, BaseModel):
    __tablename__ = "user_emergency_contacts"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(150), nullable=False)
    relationship = Column(String(50), nullable=False)
    phone = Column(String(20), nullable=False)
    email = Column(String(255))
    is_primary = Column(Boolean, default=False)


# ============================================
# USER NOTIFICATION SETTINGS
# ============================================
class UserNotificationSetting(Base, BaseModel):
    __tablename__ = "user_notification_settings"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    email_notifications = Column(Boolean, default=True)
    sms_notifications = Column(Boolean, default=True)
    push_notifications = Column(Boolean, default=True)
    emergency_alerts = Column(Boolean, default=True)
    appointment_reminders = Column(Boolean, default=True)
    donation_reminders = Column(Boolean, default=True)
    health_tips = Column(Boolean, default=True)
    marketing_emails = Column(Boolean, default=False)


# ============================================
# USER DOCUMENTS
# ============================================
class UserDocument(Base, BaseModel):
    __tablename__ = "user_documents"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(SQLEnum("id-proof", "medical-certificate", "license", "degree", "certificate", "other"), nullable=False)
    name = Column(String(255), nullable=False)
    file_url = Column(String(500), nullable=False)
    verified = Column(Boolean, default=False)
    verified_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)


# ============================================
# PASSWORD RESETS
# ============================================
class PasswordReset(Base, BaseModel):
    __tablename__ = "password_resets"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    token = Column(String(255), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    used_at = Column(DateTime, nullable=True)
    ip_address = Column(String(45))


# ============================================
# USER PREFERENCES
# ============================================
class UserPreference(Base, BaseModel):
    __tablename__ = "user_preferences"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    language = Column(String(10), default="en")
    voice_enabled = Column(Boolean, default=False)
    theme = Column(String(10), default="dark")
    font_size = Column(String(10), default="medium")
    sidebar_collapsed = Column(Boolean, default=False)
