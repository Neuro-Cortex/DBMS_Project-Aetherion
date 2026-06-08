from fastapi import APIRouter, Depends, Query, Body, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional

from ...core.database import get_db
from ...core.events import Event, EventType, get_event_bus
from ...schemas.common import APIResponse
from ...schemas.pharmacy import (
    PharmacyUpdateRequest, MedicineCreateRequest, MedicineUpdateRequest,
    StockUpdateRequest, OrderCreateRequest, OrderStatusUpdateRequest,
)
from ...services.pharmacy_service import PharmacyService
from ...middleware.auth_middleware import get_current_user
from ...core.permissions import CurrentUser, require_role

router = APIRouter(prefix="/pharmacy", tags=["Pharmacy"])


# ============================================
# AUTHENTICATED: PHARMACY PROFILE
# ============================================
@router.get("/profile", response_model=APIResponse, dependencies=[Depends(require_role("pharmacy", "pharmacy_admin"))])
async def get_pharmacy_profile(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get the authenticated pharmacy's profile."""
    service = PharmacyService(db)
    profile = service.get_pharmacy_profile(current_user.id)
    return APIResponse(success=True, message="Profile retrieved", data=profile)


@router.put("/profile", response_model=APIResponse, dependencies=[Depends(require_role("pharmacy", "pharmacy_admin"))])
async def update_pharmacy_profile(
    data: PharmacyUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update the authenticated pharmacy's profile."""
    service = PharmacyService(db)
    profile = service.update_pharmacy_profile(current_user.id, data)
    return APIResponse(success=True, message="Profile updated", data=profile)


# ============================================
# AUTHENTICATED: PHARMACY DASHBOARD
# ============================================
@router.get("/dashboard", response_model=APIResponse, dependencies=[Depends(require_role("pharmacy", "pharmacy_admin"))])
async def get_pharmacy_dashboard(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get pharmacy dashboard data."""
    service = PharmacyService(db)
    dashboard = service.get_pharmacy_dashboard(current_user.id)
    return APIResponse(success=True, message="Dashboard retrieved", data=dashboard)


# ============================================
# CLIENT PHARMACY DASHBOARD
# ============================================
@router.get("/client-dashboard", response_model=APIResponse)
async def get_client_pharmacy_dashboard(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get pharmacy data for patient/client view."""
    service = PharmacyService(db)
    dashboard = service.get_client_pharmacy_dashboard(current_user.id)
    return APIResponse(success=True, message="Client dashboard retrieved", data=dashboard)


# ============================================
# MEDICINES (INVENTORY)
# ============================================
@router.get("/medicines", response_model=APIResponse, dependencies=[Depends(require_role("pharmacy", "pharmacy_admin"))])
async def get_medicines(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    is_available: Optional[bool] = Query(None),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get medicines for the authenticated pharmacy."""
    service = PharmacyService(db)
    result = service.get_medicines(
        current_user.id, page=page, size=size,
        search=search, category=category, is_available=is_available,
    )
    return APIResponse(success=True, message="Medicines retrieved", data=result)


@router.post("/medicines", response_model=APIResponse, dependencies=[Depends(require_role("pharmacy", "pharmacy_admin"))])
async def add_medicine(
    data: MedicineCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a new medicine to the pharmacy inventory."""
    service = PharmacyService(db)
    medicine = service.add_medicine(current_user.id, data)
    return APIResponse(success=True, message="Medicine added", data=medicine)


@router.put("/medicines/{medicine_id}", response_model=APIResponse, dependencies=[Depends(require_role("pharmacy", "pharmacy_admin"))])
async def update_medicine(
    medicine_id: str,
    data: MedicineUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update a medicine in the pharmacy inventory."""
    service = PharmacyService(db)
    medicine = service.update_medicine(current_user.id, medicine_id, data)
    return APIResponse(success=True, message="Medicine updated", data=medicine)


@router.delete("/medicines/{medicine_id}", response_model=APIResponse, dependencies=[Depends(require_role("pharmacy", "pharmacy_admin"))])
async def delete_medicine(
    medicine_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Delete a medicine from the pharmacy inventory."""
    service = PharmacyService(db)
    service.delete_medicine(current_user.id, medicine_id)
    return APIResponse(success=True, message="Medicine deleted")


# ============================================
# STOCK MANAGEMENT
# ============================================
@router.put("/medicines/{medicine_id}/stock", response_model=APIResponse, dependencies=[Depends(require_role("pharmacy", "pharmacy_admin"))])
async def update_stock(
    medicine_id: str,
    data: StockUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update medicine stock quantity."""
    service = PharmacyService(db)
    medicine = service.update_stock(current_user.id, medicine_id, data.quantity)
    return APIResponse(success=True, message="Stock updated", data=medicine)


@router.get("/stock-alerts", response_model=APIResponse, dependencies=[Depends(require_role("pharmacy", "pharmacy_admin"))])
async def get_stock_alerts(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get stock alerts for the pharmacy."""
    service = PharmacyService(db)
    result = service.get_stock_alerts(current_user.id, page=page, size=size)
    return APIResponse(success=True, message="Stock alerts retrieved", data=result)


@router.get("/medicines/expiring", response_model=APIResponse, dependencies=[Depends(require_role("pharmacy", "pharmacy_admin"))])
async def get_expiring_medicines(
    days: int = Query(30, ge=1, le=365),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get medicines expiring within specified days."""
    service = PharmacyService(db)
    result = service.get_expiring_medicines(current_user.id, days)
    return APIResponse(success=True, message="Expiring medicines retrieved", data=result)


# ============================================
# ORDERS
# ============================================
@router.post("/orders", response_model=APIResponse)
async def create_order(
    data: OrderCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """Place a new medicine order."""
    service = PharmacyService(db)
    order = service.create_order(current_user.id, data)
    event_bus = get_event_bus()
    await event_bus.dispatch(
        Event(type=EventType.ORDER_PLACED, payload={"order_id": order.get("id") if isinstance(order, dict) else order.id, "user_id": current_user.id, "pharmacy_id": data.pharmacy_id if hasattr(data, "pharmacy_id") else None}, user_id=current_user.id),
        bg_tasks=background_tasks,
    )
    return APIResponse(success=True, message="Order placed successfully", data=order)


@router.get("/orders", response_model=APIResponse)
async def get_orders(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    as_pharmacy: bool = Query(False),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get orders (as patient or pharmacy)."""
    service = PharmacyService(db)
    result = service.get_orders(current_user.id, page=page, size=size, status=status, as_pharmacy=as_pharmacy)
    return APIResponse(success=True, message="Orders retrieved", data=result)


@router.put("/orders/{order_id}/status", response_model=APIResponse, dependencies=[Depends(require_role("pharmacy", "pharmacy_admin"))])
async def update_order_status(
    order_id: str,
    data: OrderStatusUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update order status (pharmacy only)."""
    service = PharmacyService(db)
    order = service.update_order_status(current_user.id, order_id, data.status)
    return APIResponse(success=True, message="Order status updated", data=order)


# ============================================
# DELIVERY TRACKING
# ============================================
@router.get("/delivery/{order_id}/track", response_model=APIResponse)
async def track_delivery(
    order_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Track delivery for an order."""
    service = PharmacyService(db)
    result = service.track_delivery(order_id)
    return APIResponse(success=True, message="Delivery tracking retrieved", data=result)


# ============================================
# MEDICINE SEARCH (public)
# ============================================
@router.get("/search", response_model=APIResponse)
async def search_medicines(
    name: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Search medicines across all pharmacies."""
    service = PharmacyService(db)
    result = service.search_medicines(name=name, category=category, page=page, size=size)
    return APIResponse(success=True, message="Search results retrieved", data=result)


# ============================================
# NEARBY PHARMACIES (public)
# ============================================
@router.get("/nearby", response_model=APIResponse)
async def get_nearby_pharmacies(
    lat: float = Query(...),
    lng: float = Query(...),
    radius: float = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Get pharmacies near a location."""
    from ...models.pharmacy import Pharmacy
    from sqlalchemy import or_

    query = db.query(Pharmacy).filter(
        Pharmacy.is_active == True,
        Pharmacy.delivery_available == True,
    )
    pharmacies = query.limit(50).all()
    # TODO: Implement geospatial filtering using lat/lng
    return APIResponse(
        success=True,
        message="Nearby pharmacies retrieved",
        data=[{"id": p.id, "name": p.name, "city": p.city, "rating": float(p.rating or 0)} for p in pharmacies],
    )


# ============================================
# COMPARE PRICES
# ============================================
@router.get("/compare-prices", response_model=APIResponse)
async def compare_medicine_prices(
    name: str = Query(...),
    db: Session = Depends(get_db),
):
    """Compare medicine prices across pharmacies."""
    from ...models.pharmacy import Pharmacy
    from ...models.pharmacy import PharmacyInventory
    from sqlalchemy import or_

    term = f"%{name}%"
    results = (
        db.query(PharmacyInventory, Pharmacy)
        .join(Pharmacy, Pharmacy.id == PharmacyInventory.pharmacy_id)
        .filter(
            or_(
                PharmacyInventory.medicine_name.ilike(term),
                PharmacyInventory.generic_name.ilike(term),
            ),
            PharmacyInventory.is_available == True,
        )
        .all()
    )

    comparisons = [
        {
            "pharmacy": {"id": p.id, "name": p.name, "city": p.city},
            "medicine_name": inv.medicine_name,
            "price": float(inv.discounted_price or inv.price or 0),
            "available": True,
        }
        for inv, p in results
    ]
    return APIResponse(success=True, message="Price comparison retrieved", data=comparisons)


# ============================================
# EMERGENCY PHARMACIES
# ============================================
@router.get("/emergency", response_model=APIResponse)
async def get_emergency_pharmacies(db: Session = Depends(get_db)):
    """Get pharmacies with emergency service."""
    from ...models.pharmacy import Pharmacy
    pharmacies = db.query(Pharmacy).filter(
        Pharmacy.emergency_service == True,
        Pharmacy.is_active == True,
    ).all()
    return APIResponse(
        success=True,
        message="Emergency pharmacies retrieved",
        data=[{"id": p.id, "name": p.name, "phone": p.phone, "emergency_phone": p.emergency_phone} for p in pharmacies],
    )
