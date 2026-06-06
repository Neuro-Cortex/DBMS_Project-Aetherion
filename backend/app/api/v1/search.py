from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional

from ...core.database import get_db
from ...schemas.common import APIResponse
from ...services.search_service import SearchService
from ...middleware.auth_middleware import get_current_user, get_current_user_optional
from ...core.permissions import CurrentUser

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("/", response_model=APIResponse)
async def global_search(
    q: str = Query(..., min_length=1, max_length=200),
    type: Optional[str] = Query(None, description="doctor, hospital, pharmacy, medicine"),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: Optional[CurrentUser] = Depends(get_current_user_optional),
    db: Session = Depends(get_db),
):
    """Global search across doctors, hospitals, pharmacies, and medicines."""
    service = SearchService(db)
    user_id = current_user.id if current_user else None
    result = service.global_search(q, user_id=user_id, search_type=type, page=page, size=size)
    return APIResponse(success=True, message="Search completed", data=result)


@router.get("/history", response_model=APIResponse)
async def get_search_history(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get user's search history."""
    service = SearchService(db)
    result = service.get_search_history(current_user.id, page=page, size=size)
    return APIResponse(success=True, message="Search history retrieved", data=result)
