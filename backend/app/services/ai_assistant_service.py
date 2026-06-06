from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime

from ..models.ai_assistant import AIConversation, AIMessage, AIVoiceSession
from ..schemas.ai_assistant import (
    AIChatRequest, AIMessageResponse,
    AIConversationResponse, AIVoiceSessionResponse,
)
from ..core.exceptions import NotFoundException
from ..utils.helpers import build_pagination_meta


class AIAssistantService:
    def __init__(self, db: Session):
        self.db = db

    def chat(self, user_id: str, data: AIChatRequest) -> AIMessageResponse:
        # Get or create conversation
        conversation = None
        if data.conversation_id:
            conversation = self.db.query(AIConversation).filter(
                AIConversation.id == data.conversation_id,
                AIConversation.user_id == user_id,
            ).first()
            if not conversation:
                raise NotFoundException("Conversation not found")

        if not conversation:
            conversation = AIConversation(
                user_id=user_id,
                title=data.message[:50] + "..." if len(data.message) > 50 else data.message,
                status="active",
            )
            self.db.add(conversation)
            self.db.flush()

        # Store user message
        user_msg = AIMessage(
            conversation_id=conversation.id,
            role="user",
            content=data.message,
            type="text",
        )
        self.db.add(user_msg)

        # Generate AI response (rule-based for now — no external API)
        ai_content, suggestions, emotion, confidence = self._generate_response(data.message)

        ai_msg = AIMessage(
            conversation_id=conversation.id,
            role="assistant",
            content=ai_content,
            type="text",
            emotion=emotion,
            confidence=confidence,
            suggestions=suggestions,
        )
        self.db.add(ai_msg)
        self.db.commit()
        self.db.refresh(ai_msg)

        return AIMessageResponse(
            id=ai_msg.id,
            conversation_id=conversation.id,
            role=ai_msg.role,
            content=ai_msg.content,
            type=ai_msg.type,
            emotion=ai_msg.emotion,
            confidence=float(ai_msg.confidence) if ai_msg.confidence else None,
            suggestions=ai_msg.suggestions,
            created_at=ai_msg.created_at,
        )

    def get_conversations(self, user_id: str, page: int = 1, size: int = 20) -> dict:
        query = self.db.query(AIConversation).filter(
            AIConversation.user_id == user_id,
            AIConversation.status != "deleted",
        ).order_by(AIConversation.created_at.desc())

        total = query.count()
        conversations = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [AIConversationResponse.model_validate(c) for c in conversations],
            **build_pagination_meta(total, page, size),
        }

    def get_conversation_messages(self, conversation_id: str, user_id: str, page: int = 1, size: int = 50) -> dict:
        conversation = self.db.query(AIConversation).filter(
            AIConversation.id == conversation_id,
            AIConversation.user_id == user_id,
        ).first()
        if not conversation:
            raise NotFoundException("Conversation not found")

        query = self.db.query(AIMessage).filter(
            AIMessage.conversation_id == conversation_id,
        ).order_by(AIMessage.created_at.asc())

        total = query.count()
        messages = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [AIMessageResponse.model_validate(m) for m in messages],
            **build_pagination_meta(total, page, size),
        }

    def create_voice_session(self, user_id: str) -> AIVoiceSessionResponse:
        session = AIVoiceSession(
            user_id=user_id,
            is_listening=True,
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return AIVoiceSessionResponse.model_validate(session)

    def _generate_response(self, message: str) -> tuple:
        msg_lower = message.lower()

        if any(w in msg_lower for w in ["emergency", "urgent", "help", "911", "sos"]):
            return (
                "This sounds urgent. If this is a medical emergency, please call your local emergency number (911) immediately. "
                "I can also help you find nearby hospitals or request an ambulance through our emergency system.",
                ["Find nearby hospitals", "Request ambulance", "Call emergency"],
                "concerned", 0.95
            )
        elif any(w in msg_lower for w in ["headache", "pain", "fever", "cough", "cold", "flu"]):
            return (
                "I understand you're experiencing symptoms. For proper diagnosis, please consult a healthcare professional. "
                "I can help you find a doctor or book an appointment. Can you share more details about when symptoms started?",
                ["Find a doctor", "Book appointment", "Check symptoms"],
                "concerned", 0.75
            )
        elif any(w in msg_lower for w in ["medicine", "drug", "prescription", "pharmacy"]):
            return (
                "I can help you with medicine-related queries. I can search for medicines, compare prices at pharmacies, "
                "or help you find a nearby pharmacy. What specifically would you like to know?",
                ["Search medicines", "Find pharmacy", "Compare prices"],
                "neutral", 0.70
            )
        elif any(w in msg_lower for w in ["appointment", "book", "schedule", "doctor"]):
            return (
                "I can help you find and book appointments with doctors. Would you like to search by specialty, "
                "name, or location?",
                ["Search doctors", "Book appointment", "View specialties"],
                "neutral", 0.80
            )
        else:
            return (
                f"I understand your question: \"{message}\". For urgent symptoms, please contact emergency care. "
                "For general guidance, share your age, symptoms, duration, and any medication you are taking.",
                ["Find nearby doctors", "Check medicine reminders", "Open emergency help"],
                "neutral", 0.60
            )
