"""
Women's Health API Routes — Aetherion Healthcare
"""

from fastapi import APIRouter, Depends, Query, Body
from sqlalchemy.orm import Session
from typing import Optional

from ...core.database import get_db
from ...core.permissions import CurrentUser, require_role
from ...schemas.common import APIResponse
from ...schemas.women_health import (
    MenstrualCycleCreateRequest,
    MenstrualCycleResponse,
    PregnancyCreateRequest,
    PregnancyUpdateRequest,
    PregnancyTrackingCreateRequest,
    BabyVaccineRecordCreateRequest,
    VaccineStatusUpdateRequest,
    BabyGrowthCreateRequest,
    ConsultationCreateRequest,
    ConsultationUpdateRequest,
)
from ...services.women_health_service import WomenHealthService
from ...middleware.auth_middleware import get_current_user

router = APIRouter(prefix="/women-care", tags=["Women's Health"])


# ============================================
# DASHBOARD
# ============================================

@router.get("/dashboard", response_model=APIResponse)
async def get_dashboard(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    service = WomenHealthService(db)
    result = service.get_dashboard(current_user.id)
    return APIResponse(success=True, message="Dashboard retrieved", data=result)


# ============================================
# MENSTRUAL CYCLE
# ============================================

@router.get("/menstrual-cycle", response_model=APIResponse)
async def get_menstrual_cycle(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    service = WomenHealthService(db)
    result = service.get_menstrual_cycle(current_user.id)
    return APIResponse(success=True, message="Cycle retrieved", data=result)


@router.post("/menstrual-cycle", response_model=APIResponse)
async def create_menstrual_cycle(
    data: MenstrualCycleCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = WomenHealthService(db)
    result = service.create_or_update_menstrual_cycle(current_user.id, data.model_dump())
    return APIResponse(success=True, message="Cycle saved", data=result)


@router.get("/menstrual-cycle/history", response_model=APIResponse)
async def get_cycle_history(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = WomenHealthService(db)
    result = service.get_cycle_history(current_user.id, page=page, size=size)
    return APIResponse(success=True, message="History retrieved", data=result)


# ============================================
# PREGNANCY
# ============================================

@router.get("/pregnancy", response_model=APIResponse)
async def get_pregnancy(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    service = WomenHealthService(db)
    result = service.get_pregnancy(current_user.id)
    return APIResponse(success=True, message="Pregnancy retrieved", data=result)


@router.post("/pregnancy", response_model=APIResponse)
async def create_pregnancy(
    data: PregnancyCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = WomenHealthService(db)
    result = service.create_pregnancy(current_user.id, data.model_dump())
    return APIResponse(success=True, message="Pregnancy record created", data=result)


@router.put("/pregnancy", response_model=APIResponse)
async def update_pregnancy(
    data: PregnancyUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = WomenHealthService(db)
    result = service.update_pregnancy(current_user.id, data.model_dump(exclude_unset=True))
    return APIResponse(success=True, message="Pregnancy updated", data=result)


@router.post("/pregnancy/tracking", response_model=APIResponse)
async def add_pregnancy_tracking(
    data: PregnancyTrackingCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = WomenHealthService(db)
    result = service.add_pregnancy_tracking(current_user.id, data.model_dump())
    return APIResponse(success=True, message="Tracking record added", data=result)


@router.get("/pregnancy/{pregnancy_id}/tracking", response_model=APIResponse)
async def get_pregnancy_tracking(
    pregnancy_id: str,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = WomenHealthService(db)
    result = service.get_pregnancy_tracking(pregnancy_id, page=page, size=size)
    return APIResponse(success=True, message="Tracking records retrieved", data=result)


# ============================================
# BABY VACCINES
# ============================================

@router.get("/baby-vaccines", response_model=APIResponse)
async def get_baby_vaccines(current_user: CurrentUser = Depends(get_current_user), db: Session = Depends(get_db)):
    service = WomenHealthService(db)
    result = service.get_baby_vaccines(current_user.id)
    return APIResponse(success=True, message="Vaccines retrieved", data=result)


@router.post("/baby-vaccines", response_model=APIResponse)
async def add_baby_vaccine_record(
    data: BabyVaccineRecordCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = WomenHealthService(db)
    result = service.add_baby_vaccine_record(current_user.id, data.model_dump())
    return APIResponse(success=True, message="Vaccine record added", data=result)


@router.put("/baby-vaccines/{record_id}", response_model=APIResponse)
async def update_vaccine_status(
    record_id: str,
    data: VaccineStatusUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = WomenHealthService(db)
    result = service.update_vaccine_status(record_id, data.model_dump(exclude_unset=True))
    return APIResponse(success=True, message="Vaccine updated", data=result)


# ============================================
# BABY GROWTH
# ============================================

@router.post("/baby-growth", response_model=APIResponse)
async def add_growth_record(
    data: BabyGrowthCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = WomenHealthService(db)
    result = service.add_growth_record(current_user.id, data.model_dump())
    return APIResponse(success=True, message="Growth record added", data=result)


@router.get("/baby-growth/{baby_id}", response_model=APIResponse)
async def get_growth_records(
    baby_id: str,
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = WomenHealthService(db)
    result = service.get_growth_records(baby_id, page=page, size=size)
    return APIResponse(success=True, message="Growth records retrieved", data=result)


# ============================================
# CONSULTATIONS
# ============================================

@router.get("/consultations", response_model=APIResponse)
async def get_consultations(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    status: Optional[str] = Query(None),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get women's health consultations."""
    service = WomenHealthService(db)
    result = service.get_consultations(current_user.id, status=status, page=page, size=size)
    return APIResponse(success=True, message="Consultations retrieved", data=result)


@router.post("/consultations", response_model=APIResponse)
async def create_consultation(
    data: ConsultationCreateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Create a new consultation booking."""
    service = WomenHealthService(db)
    result = service.create_consultation(current_user.id, data.model_dump())
    return APIResponse(success=True, message="Consultation created", data=result)


@router.get("/consultations/{consultation_id}", response_model=APIResponse)
async def get_consultation(
    consultation_id: str,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get consultation details."""
    service = WomenHealthService(db)
    result = service.get_consultation(consultation_id, current_user.id)
    return APIResponse(success=True, message="Consultation retrieved", data=result)


@router.put("/consultations/{consultation_id}", response_model=APIResponse)
async def update_consultation(
    consultation_id: str,
    data: ConsultationUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update consultation details."""
    service = WomenHealthService(db)
    result = service.update_consultation(consultation_id, current_user.id, data.model_dump(exclude_unset=True))
    return APIResponse(success=True, message="Consultation updated", data=result)


@router.delete("/consultations/{consultation_id}", response_model=APIResponse)
async def cancel_consultation(
    consultation_id: str,
    reason: Optional[str] = Body(None, embed=True),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Cancel a consultation."""
    service = WomenHealthService(db)
    service.cancel_consultation(consultation_id, current_user.id, reason)
    return APIResponse(success=True, message="Consultation cancelled")


# ============================================
# HEALTH TIPS
# ============================================

@router.get("/health-tips", response_model=APIResponse)
async def get_health_tips(
    page: int = Query(1, ge=1),
    size: int = Query(20, ge=1, le=100),
    category: Optional[str] = Query(None),
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get personalized health tips based on pregnancy week or menstrual cycle."""
    service = WomenHealthService(db)
    result = service.get_health_tips(current_user.id, category=category, page=page, size=size)
    return APIResponse(success=True, message="Health tips retrieved", data=result)


@router.put("/consultations/{consultation_id}", response_model=APIResponse)
async def update_consultation(
    consultation_id: str,
    data: ConsultationUpdateRequest,
    current_user: CurrentUser = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    service = WomenHealthService(db)
    result = service.update_consultation(consultation_id, data.model_dump(exclude_unset=True))
    return APIResponse(success=True, message="Consultation updated", data=result)
