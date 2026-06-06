from pydantic import BaseModel, Field
from typing import Optional, List, Any
from datetime import datetime


class SearchResultItem(BaseModel):
    id: str
    title: str
    type: str  # doctor, hospital, pharmacy, medicine
    description: Optional[str] = None
    rating: Optional[float] = None
    location: Optional[str] = None
    price: Optional[float] = None
    availability: Optional[str] = None
    image: Optional[str] = None
    extra: Optional[dict] = None


class SearchResponse(BaseModel):
    query: str
    results: List[SearchResultItem] = []
    total: int = 0
    page: int = 1
    size: int = 20
    pages: int = 0


class SearchLogResponse(BaseModel):
    id: str
    user_id: Optional[str] = None
    query: Optional[str] = None
    type: Optional[str] = None
    results_count: int = 0
    created_at: Optional[datetime] = None

    model_config = {"from_attributes": True}
