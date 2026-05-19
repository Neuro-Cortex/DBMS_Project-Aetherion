"""
Oxygen network endpoints
"""
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user, require_hospital_admin
from app.models.user import User
from app.services.oxygen_service import OxygenService
from app.api.v1.oxygen.schemas import (
    OxygenStockCreate, OxygenStockUpdate,
    OxygenRequestCreate, SupplierCreate
)
import uuid

router = APIRouter()

@router.post("/stock")
async def add_oxygen_stock(
    data: OxygenStockCreate,
    current_user: User = Depends(require_hospital_admin),
    session: AsyncSession = Depends(get_db)
):
    """Add oxygen stock record"""
    service = OxygenService(session)
    return await service.create_stock(current_user.id, data.dict())

@router.put("/stock")
async def update_oxygen_stock(
    data: OxygenStockUpdate,
    current_user: User = Depends(require_hospital_admin),
    session: AsyncSession = Depends(get_db)
):
    """Update oxygen stock"""
    service = OxygenService(session)
    return await service.update_stock(current_user.id, data.dict(exclude_unset=True))

@router.get("/stock/{hospital_id}")
async def get_oxygen_stock(
    hospital_id: uuid.UUID,
    session: AsyncSession = Depends(get_db)
):
    """Get oxygen stock for hospital"""
    service = OxygenService(session)
    return await service.get_stock(hospital_id)

@router.get("/availability")
async def check_oxygen_availability(
    latitude: float = Query(...),
    longitude: float = Query(...),
    radius_km: float = Query(20),
    emergency_only: bool = False,
    session: AsyncSession = Depends(get_db)
):
    """Check oxygen availability nearby"""
    service = OxygenService(session)
    return await service.check_availability(
        latitude, longitude, radius_km, emergency_only
    )

@router.post("/request")
async def request_oxygen(
    data: OxygenRequestCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Request oxygen supply"""
    service = OxygenService(session)
    return await service.create_request(current_user.id, data.dict())

@router.get("/request/{request_id}")
async def get_oxygen_request(
    request_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get oxygen request details"""
    service = OxygenService(session)
    return await service.get_request(current_user.id, request_id)

@router.get("/requests")
async def get_oxygen_requests(
    current_user: User = Depends(get_current_user),
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_db)
):
    """Get oxygen requests"""
    service = OxygenService(session)
    return await service.get_user_requests(current_user.id, status, skip, limit)

@router.put("/request/{request_id}/fulfill")
async def fulfill_oxygen_request(
    request_id: uuid.UUID,
    current_user: User = Depends(require_hospital_admin),
    session: AsyncSession = Depends(get_db)
):
    """Fulfill oxygen request"""
    service = OxygenService(session)
    return await service.fulfill_request(current_user.id, request_id)

@router.post("/suppliers")
async def add_supplier(
    data: SupplierCreate,
    current_user: User = Depends(require_hospital_admin),
    session: AsyncSession = Depends(get_db)
):
    """Add oxygen supplier"""
    service = OxygenService(session)
    return await service.add_supplier(data.dict())

@router.get("/suppliers")
async def get_suppliers(
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius_km: float = 50,
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_db)
):
    """Get oxygen suppliers"""
    service = OxygenService(session)
    
    if latitude and longitude:
        return await service.get_nearby_suppliers(
            latitude, longitude, radius_km, skip, limit
        )
    
    return await service.get_suppliers(skip, limit)

@router.get("/alerts")
async def get_oxygen_alerts(
    session: AsyncSession = Depends(get_db)
):
    """Get critical oxygen alerts"""
    service = OxygenService(session)
    return await service.get_alerts()

@router.get("/dashboard")
async def oxygen_dashboard(
    current_user: User = Depends(require_hospital_admin),
    session: AsyncSession = Depends(get_db)
):
    """Get oxygen dashboard"""
    service = OxygenService(session)
    return await service.get_dashboard(current_user.id)

@router.post("/cylinder-tracking")
async def track_cylinder(
    cylinder_id: str = Query(...),
    latitude: float = Query(...),
    longitude: float = Query(...),
    status: str = Query("in_transit"),
    session: AsyncSession = Depends(get_db)
):
    """Update cylinder tracking location"""
    service = OxygenService(session)
    return await service.update_cylinder_tracking(
        cylinder_id, latitude, longitude, status
    )

@router.get("/cylinder-tracking/{cylinder_id}")
async def get_cylinder_location(
    cylinder_id: str,
    session: AsyncSession = Depends(get_db)
):
    """Get cylinder tracking info"""
    service = OxygenService(session)
    return await service.get_cylinder_tracking(cylinder_id)