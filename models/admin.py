from sqlalchemy import (
    Column, String, Boolean, JSON, Text,
    Enum as SQLEnum, ForeignKey
)
from sqlalchemy.dialects.mysql import CHAR
from ..core.database import Base
from .base import BaseModel


# ============================================
# ADMIN USERS
# ============================================
class AdminUser(Base, BaseModel):
    __tablename__ = "admin_users"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    username = Column(String(100), unique=True, nullable=False)
    full_name = Column(String(150), nullable=False)
    role = Column(SQLEnum("super-admin", "admin", "moderator", "support"), default="admin")
    permissions = Column(JSON)
    is_active = Column(Boolean, default=True)
    is_two_factor_enabled = Column(Boolean, default=False)


# ============================================
# VERIFICATION REQUESTS
# ============================================
class VerificationRequest(Base, BaseModel):
    __tablename__ = "verification_requests"

    entity_type = Column(SQLEnum("doctor", "hospital", "pharmacy", "blood_donor"), nullable=False, index=True)
    entity_id = Column(CHAR(36), nullable=False, index=True)
    entity_name = Column(String(255))
    documents = Column(JSON)
    status = Column(SQLEnum("pending", "approved", "rejected", "more-info"), default="pending", index=True)
    reviewed_by = Column(CHAR(36), ForeignKey("users.id"), nullable=True)
    rejection_reason = Column(Text)
    notes = Column(Text)
