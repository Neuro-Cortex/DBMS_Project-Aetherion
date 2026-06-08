from sqlalchemy import (
    Column, String, Integer, Text, Boolean, JSON,
    Enum as SQLEnum, ForeignKey, Index
)
from sqlalchemy.dialects.mysql import CHAR
from ..core.database import Base
from .base import BaseModel


# ============================================
# MESSAGES
# ============================================
class Message(Base, BaseModel):
    __tablename__ = "messages"

    sender_id = Column(CHAR(36), ForeignKey("users.id"), nullable=False, index=True)
    receiver_id = Column(CHAR(36), ForeignKey("users.id"), nullable=False, index=True)
    appointment_id = Column(CHAR(36), ForeignKey("appointments.id"), nullable=True)
    message_body = Column(Text, nullable=False)
    message_type = Column(SQLEnum("text", "image", "file", "system", "voice"), default="text")
    file_url = Column(String(500))
    file_name = Column(String(255))
    file_size = Column(Integer)
    is_read = Column(Boolean, default=False)


# ============================================
# NOTIFICATIONS
# ============================================
class Notification(Base, BaseModel):
    __tablename__ = "notifications"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    type = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    body = Column(Text)
    data = Column(JSON)
    action_url = Column(String(500))
    priority = Column(SQLEnum("low", "medium", "high", "urgent"), default="medium")
    is_read = Column(Boolean, default=False)
