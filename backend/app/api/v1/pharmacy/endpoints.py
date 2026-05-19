"""
Pharmacy API endpoints
"""
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.api.deps import get_current_user, require_pharmacy_admin
from app.models.user import User
from app.services.pharmacy_service import PharmacyService
from app.api.v1.pharmacy.schemas import (
    PharmacyProfileCreate, MedicineCreate,
    InventoryAdd, InventoryUpdate, OrderCreate,
    OrderStatusUpdate, MedicineSearchFilters
)
import uuid

router = APIRouter()

@router.post("/profile")
async def create_pharmacy_profile(
    data: PharmacyProfileCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Create pharmacy profile"""
    service = PharmacyService(session)
    return await service.create_profile(current_user.id, data.dict())

@router.get("/profile/{pharmacy_id}")
async def get_pharmacy_profile(
    pharmacy_id: uuid.UUID,
    session: AsyncSession = Depends(get_db)
):
    """Get pharmacy profile"""
    service = PharmacyService(session)
    return await service.get_profile(pharmacy_id)

@router.get("/search")
async def search_pharmacies(
    city: Optional[str] = None,
    is_24x7: Optional[bool] = None,
    home_delivery: Optional[bool] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius_km: float = 10,
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_db)
):
    """Search pharmacies"""
    service = PharmacyService(session)
    
    if latitude and longitude:
        return await service.search_nearby_pharmacies(
            latitude, longitude, radius_km, skip, limit
        )
    
    return await service.search_pharmacies(city, is_24x7, home_delivery, skip, limit)

@router.post("/medicines")
async def add_medicine(
    data: MedicineCreate,
    current_user: User = Depends(require_pharmacy_admin),
    session: AsyncSession = Depends(get_db)
):
    """Add medicine to catalog"""
    service = PharmacyService(session)
    return await service.add_medicine(data.dict())

@router.get("/medicines/search")
async def search_medicines(
    query: str = Query(..., min_length=2),
    category: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_db)
):
    """Search medicines"""
    service = PharmacyService(session)
    return await service.search_medicines(query, category, skip, limit)

@router.get("/medicines/{medicine_id}")
async def get_medicine_details(
    medicine_id: uuid.UUID,
    session: AsyncSession = Depends(get_db)
):
    """Get medicine details"""
    service = PharmacyService(session)
    return await service.get_medicine(medicine_id)

@router.get("/medicines/compare")
async def compare_medicines(
    medicine_ids: List[uuid.UUID] = Query(...),
    session: AsyncSession = Depends(get_db)
):
    """Compare medicines"""
    service = PharmacyService(session)
    return await service.compare_medicines(medicine_ids)

@router.post("/inventory")
async def add_inventory(
    data: InventoryAdd,
    current_user: User = Depends(require_pharmacy_admin),
    session: AsyncSession = Depends(get_db)
):
    """Add inventory item"""
    service = PharmacyService(session)
    return await service.add_inventory(current_user.id, data.dict())

@router.put("/inventory/{inventory_id}")
async def update_inventory(
    inventory_id: uuid.UUID,
    data: InventoryUpdate,
    current_user: User = Depends(require_pharmacy_admin),
    session: AsyncSession = Depends(get_db)
):
    """Update inventory"""
    service = PharmacyService(session)
    return await service.update_inventory(
        current_user.id, inventory_id, data.dict(exclude_unset=True)
    )

@router.get("/inventory")
async def get_inventory(
    current_user: User = Depends(require_pharmacy_admin),
    low_stock_only: bool = False,
    expiring_soon: bool = False,
    skip: int = 0,
    limit: int = 50,
    session: AsyncSession = Depends(get_db)
):
    """Get pharmacy inventory"""
    service = PharmacyService(session)
    return await service.get_inventory(
        current_user.id, low_stock_only, expiring_soon, skip, limit
    )

@router.post("/orders")
async def create_order(
    data: OrderCreate,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Create medicine order"""
    service = PharmacyService(session)
    return await service.create_order(current_user.id, data.dict())

@router.get("/orders/{order_id}")
async def get_order(
    order_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get order details"""
    service = PharmacyService(session)
    return await service.get_order(current_user.id, order_id)

@router.put("/orders/{order_id}/status")
async def update_order_status(
    order_id: uuid.UUID,
    data: OrderStatusUpdate,
    current_user: User = Depends(require_pharmacy_admin),
    session: AsyncSession = Depends(get_db)
):
    """Update order status"""
    service = PharmacyService(session)
    return await service.update_order_status(
        current_user.id, order_id, data.status, data.notes
    )

@router.get("/orders")
async def get_orders(
    current_user: User = Depends(get_current_user),
    status: Optional[str] = None,
    skip: int = 0,
    limit: int = 20,
    session: AsyncSession = Depends(get_db)
):
    """Get user orders"""
    service = PharmacyService(session)
    return await service.get_user_orders(current_user.id, status, skip, limit)

@router.post("/prescriptions/upload")
async def upload_prescription(
    order_id: Optional[uuid.UUID] = None,
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Upload prescription"""
    service = PharmacyService(session)
    return await service.upload_prescription(current_user.id, order_id, file)

@router.get("/dashboard")
async def pharmacy_dashboard(
    current_user: User = Depends(require_pharmacy_admin),
    session: AsyncSession = Depends(get_db)
):
    """Get pharmacy dashboard"""
    service = PharmacyService(session)
    return await service.get_dashboard(current_user.id)

@router.get("/client-dashboard")
async def client_pharmacy_dashboard(
    current_user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_db)
):
    """Get client pharmacy dashboard"""
    service = PharmacyService(session)
    return await service.get_client_dashboard(current_user.id)

@router.get("/medicines/prices")
async def compare_medicine_prices(
    medicine_name: str = Query(...),
    city: Optional[str] = None,
    latitude: Optional[float] = None,
    longitude: Optional[float] = None,
    radius_km: float = 10,
    session: AsyncSession = Depends(get_db)
):
    """Compare medicine prices across pharmacies"""
    service = PharmacyService(session)
    return await service.compare_prices(medicine_name, city, latitude, longitude, radius_km)