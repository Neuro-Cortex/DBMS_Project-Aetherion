from fastapi import APIRouter, Depends, Query, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional

from ...core.database import get_db
from ...core.events import Event, EventType, get_event_bus
from ...schemas.common import APIResponse
from ...schemas.oxygen import OxygenStockUpdateRequest, OxygenRequestCreate
from ...services.oxygen_service import OxygenServiceLayer
from ...middleware.auth_middleware import get_current_user
from ...core.permissions import CurrentUser

router = APIRouter(prefix="/oxygen", tags=["Oxygen"])


# ============================================
# GET ALL OXYGEN STOCKS (PUBLIC)
# ============================================
@router.get("/stocks", response_model=APIResponse)
async def get_all_stocks(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Get all oxygen stocks across all centers."""
    service = OxygenServiceLayer(db)
    result = service.get_all_stocks(page=page, size=size)
    return APIResponse(success=True, message="Oxygen stocks retrieved", data=result)


# ============================================
# GET HOSPITAL OXYGEN STOCK
# ============================================
@router.get("/stocks/{hospital_id}", response_model=APIResponse)
async def get_hospital_stock(hospital_id: str, db: Session = Depends(get_db)):
    """Get oxygen stock for a specific hospital/center."""
    service = OxygenServiceLayer(db)
    result = service.get_hospital_stock(hospital_id)
    return APIResponse(success=True, message="Stock retrieved", data=result)


# ============================================
# OXYGEN CENTERS SEARCH (PUBLIC)
# ============================================
@router.get("/centers/search", response_model=APIResponse)
async def search_oxygen_centers(
    q: str = Query(..., min_length=1, max_length=100),
    city: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Search oxygen centers by name or location."""
    service = OxygenServiceLayer(db)
    result = service.search_centers(q, city=city, page=page, size=size)
    return APIResponse(success=True, message="Centers found", data=result)


@router.put("/stocks/{stock_id}", response_model=APIResponse)
async def update_stock(stock_id: str, data: OxygenStockUpdateRequest, current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db), background_tasks: BackgroundTasks = None):
    service = OxygenServiceLayer(db)
    result = service.update_stock(stock_id, data)
    # Dispatch low stock alert if stock is low
    current_qty = result.get("quantity", 0) if isinstance(result, dict) else getattr(result, "quantity", 0)
    threshold = data.low_stock_threshold if hasattr(data, "low_stock_threshold") and data.low_stock_threshold else 10
    if current_qty <= threshold:
        event_bus = get_event_bus()
        await event_bus.dispatch(
            Event(type=EventType.OXYGEN_LOW_STOCK_ALERT, payload={"stock_id": stock_id, "quantity": current_qty, "threshold": threshold, "hospital_id": result.get("hospital_id") if isinstance(result, dict) else getattr(result, "hospital_id", None)}, user_id=None),
            bg_tasks=background_tasks,
        )
    return APIResponse(success=True, message="Stock updated", data=result)


@router.get("/centers/nearby", response_model=APIResponse)
async def get_nearby_centers(lat: float = Query(0), lng: float = Query(0), radius: float = Query(10), page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100), db: Session = Depends(get_db)):
    service = OxygenServiceLayer(db)
    result = service.get_nearby_centers(lat, lng, radius, page=page, size=size)
    return APIResponse(success=True, message="Centers retrieved", data=result)


@router.post("/requests", response_model=APIResponse)
async def create_oxygen_request(data: OxygenRequestCreate, current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db), background_tasks: BackgroundTasks = None):
    service = OxygenServiceLayer(db)
    result = service.create_request(current_user.id, data)
    event_bus = get_event_bus()
    await event_bus.dispatch(
        Event(type=EventType.OXYGEN_REQUEST_CREATED, payload={"request_id": result.get("id"), "user_id": current_user.id, "hospital_id": data.hospital_id if hasattr(data, "hospital_id") else None}, user_id=current_user.id),
        bg_tasks=background_tasks,
    )
    return APIResponse(success=True, message="Oxygen request created", data=result)


@router.get("/requests", response_model=APIResponse)
async def get_oxygen_requests(status: Optional[str] = Query(None), page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100), current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    service = OxygenServiceLayer(db)
    result = service.get_requests(user_id=current_user.id, status=status, page=page, size=size)
    return APIResponse(success=True, message="Requests retrieved", data=result)


@router.put("/requests/{request_id}/status", response_model=APIResponse)
async def update_oxygen_request_status(request_id: str, status: str = Query(...), current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    service = OxygenServiceLayer(db)
    result = service.update_request_status(request_id, status)
    return APIResponse(success=True, message="Status updated", data=result)


@router.get("/emergency-alerts", response_model=APIResponse)
async def get_emergency_alerts(page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100), db: Session = Depends(get_db)):
    service = OxygenServiceLayer(db)
    result = service.get_alerts(page=page, size=size)
    return APIResponse(success=True, message="Alerts retrieved", data=result)


@router.get("/dashboard", response_model=APIResponse)
async def get_oxygen_dashboard(db: Session = Depends(get_db)):
    service = OxygenServiceLayer(db)
    result = service.get_dashboard()
    return APIResponse(success=True, message="Dashboard retrieved", data=result)
