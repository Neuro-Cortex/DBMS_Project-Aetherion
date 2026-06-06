from typing import Optional
import uuid
from math import ceil


def generate_uuid() -> str:
    return str(uuid.uuid4())


def paginate(page: int = 1, size: int = 20) -> dict:
    return {"offset": (page - 1) * size, "limit": size}


def calculate_pages(total: int, size: int) -> int:
    """Calculate total number of pages."""
    if size <= 0:
        return 0
    return ceil(total / size)


def build_pagination_meta(total: int, page: int, size: int) -> dict:
    """Build pagination metadata for API responses."""
    return {
        "total": total,
        "page": page,
        "size": size,
        "pages": calculate_pages(total, size),
    }


def generate_order_number(prefix: str = "ORD") -> str:
    """Generate a unique order number."""
    import time
    return f"{prefix}-{int(time.time())}-{uuid.uuid4().hex[:6].upper()}"


def generate_request_number(prefix: str = "REQ") -> str:
    """Generate a unique request number."""
    import time
    return f"{prefix}-{int(time.time())}-{uuid.uuid4().hex[:6].upper()}"
