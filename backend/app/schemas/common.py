from pydantic import BaseModel
from typing import Optional, Any, List, Generic, TypeVar
from datetime import datetime


T = TypeVar("T")


# ============================================
# STANDARD API RESPONSE
# ============================================
class APIResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[Any] = None


class APIErrorResponse(BaseModel):
    success: bool = False
    message: str
    errors: Optional[Any] = None
    status_code: int = 400


# ============================================
# PAGINATED RESPONSE
# ============================================
class PaginatedResponse(BaseModel):
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int


class PaginatedMeta(BaseModel):
    total: int
    page: int
    size: int
    pages: int


class PaginatedAPIResponse(BaseModel):
    success: bool = True
    message: str = "Success"
    data: Optional[Any] = None
    meta: Optional[PaginatedMeta] = None


# ============================================
# PAGINATION REQUEST
# ============================================
class PaginationParams(BaseModel):
    page: int = 1
    size: int = 20

    @property
    def offset(self) -> int:
        return (self.page - 1) * self.size

    @property
    def limit(self) -> int:
        return self.size


# ============================================
# COMMON FILTERS
# ============================================
class DateRangeFilter(BaseModel):
    date_from: Optional[str] = None
    date_to: Optional[str] = None


class SortParams(BaseModel):
    sort_by: str = "created_at"
    sort_order: str = "desc"  # asc or desc


# ============================================
# ID RESPONSE (for create operations)
# ============================================
class CreatedResponse(BaseModel):
    success: bool = True
    message: str = "Created successfully"
    data: Optional[Any] = None


class DeletedResponse(BaseModel):
    success: bool = True
    message: str = "Deleted successfully"


# ============================================
# HEALTH CHECK
# ============================================
class HealthCheckResponse(BaseModel):
    status: str = "healthy"
    version: str
    database: str = "connected"
    timestamp: datetime
