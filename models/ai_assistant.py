from sqlalchemy import (
    Column, String, Text, Boolean, DECIMAL, JSON,
    Enum as SQLEnum, ForeignKey
)
from sqlalchemy.dialects.mysql import CHAR
from ..core.database import Base
from .base import BaseModel


# ============================================
# AI CONVERSATIONS
# ============================================
class AIConversation(Base, BaseModel):
    __tablename__ = "ai_conversations"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255))
    status = Column(SQLEnum("active", "archived", "deleted"), default="active")


# ============================================
# AI MESSAGES
# ============================================
class AIMessage(Base, BaseModel):
    __tablename__ = "ai_messages"

    conversation_id = Column(CHAR(36), ForeignKey("ai_conversations.id", ondelete="CASCADE"), nullable=False, index=True)
    role = Column(SQLEnum("user", "assistant", "system"), nullable=False)
    content = Column(Text, nullable=False)
    type = Column(SQLEnum("text", "data", "suggestion", "error"), default="text")
    data = Column(JSON)
    emotion = Column(SQLEnum("happy", "neutral", "concerned", "excited"))
    confidence = Column(DECIMAL(3, 2))
    suggestions = Column(JSON)
    sql_query = Column(Text)


# ============================================
# AI VOICE SESSIONS
# ============================================
class AIVoiceSession(Base, BaseModel):
    __tablename__ = "ai_voice_sessions"

    user_id = Column(CHAR(36), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    transcript = Column(Text)
    audio_url = Column(String(500))
    is_listening = Column(Boolean, default=False)
    is_speaking = Column(Boolean, default=False)
