from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional, List
from datetime import date, datetime

from ..models.emergency import EmergencyService, EmergencyRequest
from ..models.hospital import Hospital
from ..schemas.emergency import (
    EmergencyServiceResponse, EmergencyRequestCreate,
    SOSRequest, EmergencyCancelRequest, EmergencyRequestResponse,
    EmergencyDashboardResponse,
)
from ..core.exceptions import NotFoundException, BadRequestException
from ..utils.helpers import build_pagination_meta, generate_request_number


class EmergencyServiceLayer:
    """Handles all emergency-related business logic."""

    def __init__(self, db: Session):
        self.db = db

    # ============================================
    # CREATE EMERGENCY REQUEST
    # ============================================
    def create_request(self, user_id: str, data: EmergencyRequestCreate) -> EmergencyRequestResponse:
        valid_types = ["ambulance", "blood", "oxygen", "doctor", "emergency-room"]
        if data.type not in valid_types:
            raise BadRequestException(f"Invalid type. Must be one of: {valid_types}")

        valid_priorities = ["low", "medium", "high", "critical"]
        if data.priority not in valid_priorities:
            raise BadRequestException(f"Invalid priority. Must be one of: {valid_priorities}")

        # Try to find nearest available service
        service_id = None
        estimated_time = None
        available_service = (
            self.db.query(EmergencyService)
            .filter(
                EmergencyService.type == data.type,
                EmergencyService.status == "available",
                EmergencyService.is_active == True,
            )
            .first()
        )
        if available_service:
            service_id = available_service.id
            estimated_time = available_service.eta_minutes
            # Mark service as dispatched
            available_service.status = "dispatched"
            available_service.current_load = (available_service.current_load or 0) + 1

        request = EmergencyRequest(
            type=data.type,
            priority=data.priority,
            status="pending",
            patient_id=user_id,
            patient_name=data.patient_name,
            patient_phone=data.patient_phone,
            location_address=data.location_address,
            latitude=data.latitude,
            longitude=data.longitude,
            notes=data.notes,
            service_id=service_id,
            hospital_id=data.hospital_id,
            estimated_time=estimated_time,
        )
        self.db.add(request)

        # If service found, auto-dispatch
        if service_id:
            request.status = "dispatched"

        self.db.commit()
        self.db.refresh(request)
        return EmergencyRequestResponse.model_validate(request)

    # ============================================
    # SOS — IMMEDIATE CRITICAL REQUEST
    # ============================================
    def create_sos(self, user_id: str, data: SOSRequest) -> EmergencyRequestResponse:
        sos_data = EmergencyRequestCreate(
            type=data.type,
            priority="critical",
            patient_name=data.patient_name,
            patient_phone=data.patient_phone,
            location_address=data.location_address,
            latitude=data.latitude,
            longitude=data.longitude,
            notes=data.notes,
        )
        return self.create_request(user_id, sos_data)

    # ============================================
    # GET EMERGENCY STATUS
    # ============================================
    def get_request_status(self, request_id: str) -> EmergencyRequestResponse:
        request = self.db.query(EmergencyRequest).filter(EmergencyRequest.id == request_id).first()
        if not request:
            raise NotFoundException("Emergency request not found")
        return EmergencyRequestResponse.model_validate(request)

    # ============================================
    # CANCEL EMERGENCY REQUEST
    # ============================================
    def cancel_request(self, request_id: str, user_id: str, reason: str) -> EmergencyRequestResponse:
        request = self.db.query(EmergencyRequest).filter(
            EmergencyRequest.id == request_id,
            EmergencyRequest.patient_id == user_id,
        ).first()
        if not request:
            raise NotFoundException("Emergency request not found")

        if request.status in ["completed", "cancelled"]:
            raise BadRequestException(f"Cannot cancel request with status: {request.status}")

        request.status = "cancelled"
        request.cancellation_reason = reason

        # Free up the assigned service
        if request.service_id:
            service = self.db.query(EmergencyService).filter(
                EmergencyService.id == request.service_id
            ).first()
            if service:
                service.status = "available"
                service.current_load = max((service.current_load or 0) - 1, 0)

        self.db.commit()
        self.db.refresh(request)
        return EmergencyRequestResponse.model_validate(request)

    # ============================================
    # GET AVAILABLE AMBULANCES
    # ============================================
    def get_ambulances(self, lat: Optional[float] = None, lng: Optional[float] = None) -> List[EmergencyServiceResponse]:
        query = self.db.query(EmergencyService).filter(
            EmergencyService.type == "ambulance",
            EmergencyService.is_active == True,
        )
        ambulances = query.all()
        return [EmergencyServiceResponse.model_validate(a) for a in ambulances]

    # ============================================
    # GET NEARBY HOSPITALS
    # ============================================
    def get_nearby_hospitals(
        self, lat: Optional[float] = None, lng: Optional[float] = None,
        radius: float = 10, page: int = 1, size: int = 20,
    ) -> dict:
        query = self.db.query(Hospital).filter(
            Hospital.is_active == True,
            Hospital.emergency_service == "active",
        )

        total = query.count()
        hospitals = query.offset((page - 1) * size).limit(size).all()

        items = [
            {
                "id": h.id,
                "name": h.name,
                "type": h.type,
                "city": h.city,
                "state": h.state,
                "phone": h.phone,
                "emergency_phone": h.emergency_phone,
                "latitude": float(h.latitude) if h.latitude else None,
                "longitude": float(h.longitude) if h.longitude else None,
                "available_beds": h.available_beds,
                "icu_available_beds": h.icu_available_beds,
                "emergency_service": h.emergency_service,
                "rating": float(h.rating or 0),
            }
            for h in hospitals
        ]

        return {
            "items": items,
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # GET EMERGENCY SERVICES
    # ============================================
    def get_services(
        self, type_filter: Optional[str] = None,
        status: Optional[str] = None,
        page: int = 1, size: int = 20,
    ) -> dict:
        query = self.db.query(EmergencyService).filter(EmergencyService.is_active == True)

        if type_filter:
            query = query.filter(EmergencyService.type == type_filter)
        if status:
            query = query.filter(EmergencyService.status == status)

        total = query.count()
        services = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [EmergencyServiceResponse.model_validate(s) for s in services],
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # GET USER EMERGENCY REQUESTS
    # ============================================
    def get_user_requests(
        self, user_id: str, status: Optional[str] = None,
        page: int = 1, size: int = 20,
    ) -> dict:
        query = self.db.query(EmergencyRequest).filter(
            EmergencyRequest.patient_id == user_id,
        )

        if status:
            query = query.filter(EmergencyRequest.status == status)

        query = query.order_by(EmergencyRequest.created_at.desc())
        total = query.count()
        requests = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [EmergencyRequestResponse.model_validate(r) for r in requests],
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # DASHBOARD
    # ============================================
    def get_dashboard(self) -> EmergencyDashboardResponse:
        active = self.db.query(EmergencyRequest).filter(
            EmergencyRequest.status.in_(["pending", "dispatched", "en-route"]),
        ).count()
        pending = self.db.query(EmergencyRequest).filter(
            EmergencyRequest.status == "pending",
        ).count()
        dispatched = self.db.query(EmergencyRequest).filter(
            EmergencyRequest.status == "dispatched",
        ).count()
        completed_today = self.db.query(EmergencyRequest).filter(
            EmergencyRequest.status == "completed",
        ).count()
        available_ambulances = self.db.query(EmergencyService).filter(
            EmergencyService.type == "ambulance",
            EmergencyService.status == "available",
            EmergencyService.is_active == True,
        ).count()
        nearby_hospitals = self.db.query(Hospital).filter(
            Hospital.is_active == True,
            Hospital.emergency_service == "active",
        ).count()

        return EmergencyDashboardResponse(
            active_requests=active,
            pending_requests=pending,
            dispatched_requests=dispatched,
            completed_today=completed_today,
            available_ambulances=available_ambulances,
            nearby_hospitals=nearby_hospitals,
        )
