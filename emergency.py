from fastapi import APIRouter, Depends, Query, Body, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional

from ...core.database import get_db
from ...core.events import Event, EventType, get_event_bus
from ...schemas.common import APIResponse
from ...schemas.emergency import (
    EmergencyRequestCreate, SOSRequest, EmergencyCancelRequest,
)
from ...services.emergency_service import EmergencyServiceLayer
from ...middleware.auth_middleware import get_current_user
from ...core.permissions import CurrentUser

router = APIRouter(prefix="/emergency", tags=["Emergency"])


# ============================================
# SOS — CRITICAL EMERGENCY
# ============================================
@router.post("/sos", response_model=APIResponse)
async def create_sos(
    data: SOSRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """Create a critical SOS emergency request."""
    service = EmergencyServiceLayer(db)
    result = service.create_sos(current_user.id, data)
    event_bus = get_event_bus()
    await event_bus.dispatch(
        Event(type=EventType.EMERGENCY_SOS_CREATED, payload={"request_id": result.get("id"), "user_id": current_user.id}, user_id=current_user.id),
        bg_tasks=background_tasks,
    )
    return APIResponse(success=True, message="SOS request created", data=result)


# ============================================
# CREATE EMERGENCY REQUEST
# ============================================
@router.post("/request", response_model=APIResponse)
async def create_emergency_request(
    data: EmergencyRequestCreate,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """Create an emergency service request."""
    service = EmergencyServiceLayer(db)
    result = service.create_request(current_user.id, data)
    event_bus = get_event_bus()
    await event_bus.dispatch(
        Event(type=EventType.EMERGENCY_REQUEST_CREATED, payload={"request_id": result.get("id"), "user_id": current_user.id, "type": data.type if hasattr(data, "type") else None}, user_id=current_user.id),
        bg_tasks=background_tasks,
    )
    return APIResponse(success=True, message="Emergency request created", data=result)


# ============================================
# GET EMERGENCY REQUEST STATUS
# ============================================
@router.get("/status/{request_id}", response_model=APIResponse)
async def get_request_status(
    request_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the status of an emergency request."""
    service = EmergencyServiceLayer(db)
    result = service.get_request_status(request_id)
    return APIResponse(success=True, message="Status retrieved", data=result)


# ============================================
# GET AMBULANCES
# ============================================
@router.get("/ambulances", response_model=APIResponse)
async def get_ambulances(
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get available ambulances."""
    service = EmergencyServiceLayer(db)
    result = service.get_ambulances(lat=lat, lng=lng)
    return APIResponse(success=True, message="Ambulances retrieved", data=result)


# ============================================
# GET NEARBY HOSPITALS
# ============================================
@router.get("/nearby-hospitals", response_model=APIResponse)
async def get_nearby_hospitals(
    lat: Optional[float] = Query(None),
    lng: Optional[float] = Query(None),
    radius: float = Query(10),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get nearby hospitals with emergency services."""
    service = EmergencyServiceLayer(db)
    result = service.get_nearby_hospitals(lat=lat, lng=lng, radius=radius, page=page, size=size)
    return APIResponse(success=True, message="Nearby hospitals retrieved", data=result)


# ============================================
# CANCEL EMERGENCY REQUEST
# ============================================
@router.put("/cancel/{request_id}", response_model=APIResponse)
async def cancel_emergency_request(
    request_id: str,
    data: EmergencyCancelRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """Cancel an emergency request."""
    service = EmergencyServiceLayer(db)
    result = service.cancel_request(request_id, current_user.id, data.cancellation_reason)
    event_bus = get_event_bus()
    await event_bus.dispatch(
        Event(type=EventType.EMERGENCY_CANCELLED, payload={"request_id": request_id, "user_id": current_user.id, "reason": data.cancellation_reason}, user_id=current_user.id),
        bg_tasks=background_tasks,
    )
    return APIResponse(success=True, message="Emergency request cancelled", data=result)


# ============================================
# GET EMERGENCY SERVICES
# ============================================
@router.get("/services", response_model=APIResponse)
async def get_emergency_services(
    type: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get emergency services with optional filters."""
    service = EmergencyServiceLayer(db)
    result = service.get_services(type_filter=type, status=status, page=page, size=size)
    return APIResponse(success=True, message="Services retrieved", data=result)


# ============================================
# GET MY EMERGENCY REQUESTS
# ============================================
@router.get("/my-requests", response_model=APIResponse)
async def get_my_requests(
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's emergency requests."""
    service = EmergencyServiceLayer(db)
    result = service.get_user_requests(current_user.id, status=status, page=page, size=size)
    return APIResponse(success=True, message="Requests retrieved", data=result)


# ============================================
# EMERGENCY DASHBOARD
# ============================================
@router.get("/dashboard", response_model=APIResponse)
async def get_emergency_dashboard(
    db: Session = Depends(get_db),
):
    """Get emergency system dashboard."""
    service = EmergencyServiceLayer(db)
    result = service.get_dashboard()
    return APIResponse(success=True, message="Dashboard retrieved", data=result)
