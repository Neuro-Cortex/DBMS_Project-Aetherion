from fastapi import APIRouter, Depends, Query, Body, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional

from ...core.database import get_db
from ...core.events import Event, EventType, get_event_bus
from ...schemas.common import APIResponse
from ...schemas.blood_donation import (
    DonorRegisterRequest, DonorProfileUpdateRequest,
    BloodRequestCreate,
)
from ...services.blood_donation_service import BloodDonationServiceLayer
from ...middleware.auth_middleware import get_current_user
from ...core.permissions import CurrentUser

router = APIRouter(prefix="/blood-donation", tags=["Blood Donation"])


# ============================================
# DONOR REGISTRATION
# ============================================
@router.post("/register", response_model=APIResponse)
async def register_donor(
    data: DonorRegisterRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Register as a blood donor."""
    service = BloodDonationServiceLayer(db)
    result = service.register_donor(current_user.id, data)
    return APIResponse(success=True, message="Donor registered successfully", data=result)


# ============================================
# GET DONOR PROFILE
# ============================================
@router.get("/profile", response_model=APIResponse)
async def get_donor_profile(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get donor profile."""
    service = BloodDonationServiceLayer(db)
    result = service.get_donor_profile(current_user.id)
    return APIResponse(success=True, message="Profile retrieved", data=result)


# ============================================
# UPDATE DONOR PROFILE
# ============================================
@router.put("/profile", response_model=APIResponse)
async def update_donor_profile(
    data: DonorProfileUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update donor profile."""
    service = BloodDonationServiceLayer(db)
    result = service.update_donor_profile(current_user.id, data)
    return APIResponse(success=True, message="Profile updated", data=result)


# ============================================
# CHECK ELIGIBILITY
# ============================================
@router.get("/check-eligibility", response_model=APIResponse)
async def check_eligibility(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Check donor eligibility."""
    service = BloodDonationServiceLayer(db)
    result = service.check_eligibility(current_user.id)
    return APIResponse(success=True, message="Eligibility checked", data=result)


# ============================================
# SEARCH DONORS
# ============================================
@router.get("/search", response_model=APIResponse)
async def search_donors(
    bloodGroup: Optional[str] = Query(None),
    location: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Search for available blood donors."""
    service = BloodDonationServiceLayer(db)
    result = service.search_donors(blood_group=bloodGroup, city=location, page=page, size=size)
    return APIResponse(success=True, message="Donors found", data=result)


# ============================================
# RECORD DONATION
# ============================================
@router.post("/donations", response_model=APIResponse)
async def record_donation(
    data: dict,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """Record a new blood donation."""
    service = BloodDonationServiceLayer(db)
    result = service.record_donation(current_user.id, data)
    event_bus = get_event_bus()
    await event_bus.dispatch(
        Event(type=EventType.BLOOD_DONATION_RECORDED, payload={"donation_id": result.get("id"), "user_id": current_user.id, "blood_group": data.get("blood_group")}, user_id=current_user.id),
        bg_tasks=background_tasks,
    )
    return APIResponse(success=True, message="Donation recorded", data=result)


# ============================================
# DONATION HISTORY
# ============================================
@router.get("/history", response_model=APIResponse)
async def get_donation_history(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get donation history."""
    service = BloodDonationServiceLayer(db)
    result = service.get_donation_history(current_user.id, page=page, size=size)
    return APIResponse(success=True, message="History retrieved", data=result)


# ============================================
# BLOOD REQUEST
# ============================================
@router.post("/request", response_model=APIResponse)
async def create_blood_request(
    data: BloodRequestCreate,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
    background_tasks: BackgroundTasks = None,
):
    """Create a blood request."""
    service = BloodDonationServiceLayer(db)
    result = service.create_blood_request(current_user.id, data)
    event_bus = get_event_bus()
    await event_bus.dispatch(
        Event(type=EventType.BLOOD_REQUEST_CREATED, payload={"request_id": result.get("id"), "user_id": current_user.id, "blood_group": data.blood_group if hasattr(data, "blood_group") else None}, user_id=current_user.id),
        bg_tasks=background_tasks,
    )
    return APIResponse(success=True, message="Blood request created", data=result)


# ============================================
# GET BLOOD REQUESTS
# ============================================
@router.get("/requests", response_model=APIResponse)
async def get_blood_requests(
    status: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get blood requests."""
    service = BloodDonationServiceLayer(db)
    result = service.get_blood_requests(user_id=current_user.id, status=status, page=page, size=size)
    return APIResponse(success=True, message="Requests retrieved", data=result)


# ============================================
# DONATION CAMPS
# ============================================
@router.get("/camps", response_model=APIResponse)
async def get_donation_camps(
    status: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Get blood donation camps with filtering."""
    service = BloodDonationServiceLayer(db)
    result = service.get_donation_camps(status=status, city=city, page=page, size=size)
    return APIResponse(success=True, message="Camps retrieved", data=result)


# ============================================
# GET CAMP DETAILS
# ============================================
@router.get("/camps/{camp_id}", response_model=APIResponse)
async def get_camp_details(
    camp_id: str,
    db: Session = Depends(get_db),
):
    """Get details of a specific donation camp."""
    service = BloodDonationServiceLayer(db)
    result = service.get_camp_details(camp_id)
    return APIResponse(success=True, message="Camp details retrieved", data=result)


# ============================================
# REGISTER FOR DONATION CAMP
# ============================================
@router.post("/camps/{camp_id}/register", response_model=APIResponse)
async def register_for_camp(
    camp_id: str,
    data: dict,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Register for a blood donation camp."""
    service = BloodDonationServiceLayer(db)
    result = service.register_for_camp(current_user.id, camp_id, data)
    return APIResponse(success=True, message="Registered for camp", data=result)


# ============================================
# EMERGENCY BLOOD ALERT
# ============================================
@router.post("/emergency-alert", response_model=APIResponse)
async def create_emergency_alert(
    data: dict,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create an emergency blood alert."""
    service = BloodDonationServiceLayer(db)
    result = service.create_emergency_alert(current_user.id, data)
    return APIResponse(success=True, message="Emergency alert created", data=result)


# ============================================
# GET EMERGENCY ALERTS
# ============================================
@router.get("/emergency-alerts", response_model=APIResponse)
async def get_emergency_alerts(
    blood_group: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Get emergency blood alerts with filtering."""
    service = BloodDonationServiceLayer(db)
    result = service.get_emergency_alerts(blood_group=blood_group, city=city, page=page, size=size)
    return APIResponse(success=True, message="Emergency alerts retrieved", data=result)


# ============================================
# BLOOD STOCK (PUBLIC)
# ============================================
@router.get("/stock", response_model=APIResponse)
async def get_blood_stock(
    blood_group: Optional[str] = Query(None),
    city: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    """Get blood stock across all centers."""
    service = BloodDonationServiceLayer(db)
    result = service.get_blood_stock(blood_group=blood_group, city=city)
    return APIResponse(success=True, message="Blood stock retrieved", data=result)


# ============================================
# NEARBY DONORS
# ============================================
@router.get("/nearby-donors", response_model=APIResponse)
async def get_nearby_donors(
    lat: float = Query(...),
    lng: float = Query(...),
    blood_group: Optional[str] = Query(None),
    radius: float = Query(10, ge=1, le=100),
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """Get nearby blood donors based on geolocation."""
    service = BloodDonationServiceLayer(db)
    result = service.get_nearby_donors(lat=lat, lng=lng, blood_group=blood_group, radius=radius, page=page, size=size)
    return APIResponse(success=True, message="Nearby donors retrieved", data=result)


@router.post("/camps/{camp_id}/register", response_model=APIResponse)
async def register_for_camp(
    camp_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Register for a donation camp."""
    service = BloodDonationServiceLayer(db)
    service.register_for_camp(current_user.id, camp_id)
    return APIResponse(success=True, message="Registered for camp")


# ============================================
# DONOR STATS
# ============================================
@router.get("/stats", response_model=APIResponse)
async def get_donor_stats(
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get donor statistics."""
    service = BloodDonationServiceLayer(db)
    result = service.get_donor_stats(current_user.id)
    return APIResponse(success=True, message="Stats retrieved", data=result)
