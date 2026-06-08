from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional, List
from datetime import date, datetime

from ..models.oxygen import OxygenStock, OxygenCenter, OxygenRequest, OxygenAlert
from ..models.hospital import Hospital
from ..schemas.oxygen import (
    OxygenStockResponse, OxygenStockUpdateRequest,
    OxygenCenterResponse, OxygenRequestCreate, OxygenRequestResponse,
    OxygenAlertResponse, OxygenDashboardResponse,
)
from ..core.exceptions import NotFoundException, BadRequestException
from ..utils.helpers import build_pagination_meta, generate_request_number


class OxygenServiceLayer:
    def __init__(self, db: Session):
        self.db = db

    def get_all_stocks(self, page: int = 1, size: int = 20) -> dict:
        query = self.db.query(OxygenStock)
        total = query.count()
        stocks = query.offset((page - 1) * size).limit(size).all()
        return {
            "items": [OxygenStockResponse.model_validate(s) for s in stocks],
            **build_pagination_meta(total, page, size),
        }

    def get_hospital_stock(self, hospital_id: str) -> OxygenStockResponse:
        stock = self.db.query(OxygenStock).filter(OxygenStock.hospital_id == hospital_id).first()
        if not stock:
            raise NotFoundException("Oxygen stock not found for this hospital")
        return OxygenStockResponse.model_validate(stock)

    def update_stock(self, stock_id: str, data: OxygenStockUpdateRequest) -> OxygenStockResponse:
        stock = self.db.query(OxygenStock).filter(OxygenStock.id == stock_id).first()
        if not stock:
            raise NotFoundException("Oxygen stock record not found")
        update_fields = data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(stock, field, value)
        # Auto-update status
        available = stock.available_cylinders or 0
        total = stock.total_cylinders or 1
        if available == 0:
            stock.status = "out-of-stock"
        elif available / total < 0.1:
            stock.status = "critical"
        elif available / total < 0.3:
            stock.status = "low"
        else:
            stock.status = "sufficient"
        self.db.commit()
        self.db.refresh(stock)
        return OxygenStockResponse.model_validate(stock)

    def get_nearby_centers(self, lat: float, lng: float, radius: float = 10, page: int = 1, size: int = 20) -> dict:
        query = self.db.query(OxygenCenter).filter(OxygenCenter.is_active == True)
        total = query.count()
        centers = query.offset((page - 1) * size).limit(size).all()
        return {
            "items": [OxygenCenterResponse.model_validate(c) for c in centers],
            **build_pagination_meta(total, page, size),
        }

    def create_request(self, user_id: str, data: OxygenRequestCreate) -> OxygenRequestResponse:
        request_number = generate_request_number("OXY")
        req = OxygenRequest(
            request_number=request_number,
            patient_name=data.patient_name,
            patient_age=data.patient_age,
            patient_condition=data.patient_condition,
            oxygen_type=data.oxygen_type,
            cylinders_needed=data.cylinders_needed,
            urgency=data.urgency,
            hospital_name=data.hospital_name,
            doctor_name=data.doctor_name,
            status="pending",
            delivery_address=data.delivery_address,
            latitude=data.latitude,
            longitude=data.longitude,
            contact_phone=data.contact_phone,
            contact_email=data.contact_email,
            requested_by=user_id,
            hospital_id=data.hospital_id,
            required_date=data.required_date,
        )
        self.db.add(req)
        self.db.commit()
        self.db.refresh(req)
        return OxygenRequestResponse.model_validate(req)

    def get_requests(self, user_id: Optional[str] = None, status: Optional[str] = None, page: int = 1, size: int = 20) -> dict:
        query = self.db.query(OxygenRequest)
        if user_id:
            query = query.filter(OxygenRequest.requested_by == user_id)
        if status:
            query = query.filter(OxygenRequest.status == status)
        query = query.order_by(OxygenRequest.created_at.desc())
        total = query.count()
        requests = query.offset((page - 1) * size).limit(size).all()
        return {
            "items": [OxygenRequestResponse.model_validate(r) for r in requests],
            **build_pagination_meta(total, page, size),
        }

    def update_request_status(self, request_id: str, status: str) -> OxygenRequestResponse:
        req = self.db.query(OxygenRequest).filter(OxygenRequest.id == request_id).first()
        if not req:
            raise NotFoundException("Oxygen request not found")
        valid = ["pending", "approved", "dispatched", "delivered", "cancelled"]
        if status not in valid:
            raise BadRequestException(f"Invalid status. Must be one of: {valid}")
        req.status = status
        if status == "delivered":
            req.delivery_date = date.today()
        self.db.commit()
        self.db.refresh(req)
        return OxygenRequestResponse.model_validate(req)

    def get_alerts(self, page: int = 1, size: int = 20) -> dict:
        query = self.db.query(OxygenAlert).order_by(OxygenAlert.created_at.desc())
        total = query.count()
        alerts = query.offset((page - 1) * size).limit(size).all()
        return {
            "items": [OxygenAlertResponse.model_validate(a) for a in alerts],
            **build_pagination_meta(total, page, size),
        }

    def get_dashboard(self) -> OxygenDashboardResponse:
        total_centers = self.db.query(OxygenCenter).filter(OxygenCenter.is_active == True).count()
        total_cylinders = self.db.query(func.sum(OxygenStock.total_cylinders)).scalar() or 0
        available = self.db.query(func.sum(OxygenStock.available_cylinders)).scalar() or 0
        critical = self.db.query(OxygenStock).filter(OxygenStock.status.in_(["critical", "out-of-stock"])).count()
        pending = self.db.query(OxygenRequest).filter(OxygenRequest.status == "pending").count()
        return OxygenDashboardResponse(
            total_centers=total_centers,
            total_cylinders=total_cylinders,
            available_cylinders=available,
            critical_alerts=critical,
            pending_requests=pending,
        )
