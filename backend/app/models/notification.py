"""
Notification model for all types of alerts and messages
"""
from datetime import datetime
from typing import Optional, Dict
import uuid
from sqlalchemy import String, Integer, Text, Boolean, Enum, JSON, ForeignKey, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.models.base import Base, TimestampMixin, UUIDMixin

class Notification(Base, UUIDMixin, TimestampMixin):
    """Notification system"""
    
    __tablename__ = "notifications"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    
    # Notification Details
    type: Mapped[str] = mapped_column(String(100), nullable=False)
    title: Mapped[str] = mapped_column(String(500), nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    
    # Priority
    priority: Mapped[str] = mapped_column(String(50), default="normal")
    
    # Status
    is_read: Mapped[bool] = mapped_column(Boolean, default=False)
    read_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    # Action
    action_url: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    action_type: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    
    # Metadata
    metadata: Mapped[Optional[Dict]] = mapped_column(JSON, nullable=True)
    
    # Delivery Status
    email_sent: Mapped[bool] = mapped_column(Boolean, default=False)
    sms_sent: Mapped[bool] = mapped_column(Boolean, default=False)
    push_sent: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="notifications")

class NotificationTemplate(Base, UUIDMixin, TimestampMixin):
    """Notification templates"""
    
    __tablename__ = "notification_templates"
    
    template_code: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    title_template: Mapped[str] = mapped_column(String(500), nullable=False)
    body_template: Mapped[str] = mapped_column(Text, nullable=False)
    type: Mapped[str] = mapped_column(String(100), nullable=False)
    
    variables: Mapped[Optional[Dict]] = mapped_column(JSON, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

class PushNotificationToken(Base, UUIDMixin, TimestampMixin):
    """Push notification tokens for mobile devices"""
    
    __tablename__ = "push_notification_tokens"
    
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    
    token: Mapped[str] = mapped_column(String(500), nullable=False)
    device_type: Mapped[str] = mapped_column(String(50), nullable=False)  # ios, android, web
    device_model: Mapped[Optional[str]] = mapped_column(String(200), nullable=True)
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    last_used: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)