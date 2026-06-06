from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from ...core.database import get_db
from ...schemas.common import APIResponse
from ...schemas.ai_assistant import AIChatRequest
from ...services.ai_assistant_service import AIAssistantService
from ...middleware.auth_middleware import get_current_user
from ...core.permissions import CurrentUser

router = APIRouter(prefix="/ai", tags=["AI Assistant"])


@router.post("/chat", response_model=APIResponse)
async def ai_chat(data: AIChatRequest, current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """Send a message to the AI assistant."""
    service = AIAssistantService(db)
    result = service.chat(current_user.id, data)
    return APIResponse(success=True, message="AI response generated", data=result)


@router.get("/conversations", response_model=APIResponse)
async def get_conversations(page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100), current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get AI conversation history."""
    service = AIAssistantService(db)
    result = service.get_conversations(current_user.id, page=page, size=size)
    return APIResponse(success=True, message="Conversations retrieved", data=result)


@router.get("/conversations/{conversation_id}", response_model=APIResponse)
async def get_conversation_messages(conversation_id: str, page: int = Query(1, ge=1), size: int = Query(50, ge=1, le=200), current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """Get messages from a specific AI conversation."""
    service = AIAssistantService(db)
    result = service.get_conversation_messages(conversation_id, current_user.id, page=page, size=size)
    return APIResponse(success=True, message="Messages retrieved", data=result)


@router.post("/voice-session", response_model=APIResponse)
async def create_voice_session(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    """Start a voice session with AI assistant."""
    service = AIAssistantService(db)
    result = service.create_voice_session(current_user.id)
    return APIResponse(success=True, message="Voice session created", data=result)
