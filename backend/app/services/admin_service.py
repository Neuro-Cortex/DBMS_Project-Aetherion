from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
from datetime import date, datetime, timedelta

from ..models.admin import AdminUser, VerificationRequest
from ..models.user import User, UserRole, Role
from ..models.doctor import DoctorProfile
from ..models.hospital import Hospital
from ..models.pharmacy import Pharmacy
from ..models.appointment import Appointment
from ..models.emergency import EmergencyRequest
from ..models.search import AuditLog, SecurityLog
from ..models.review import Feedback
from ..schemas.admin import (
    VerificationRequestResponse, VerificationActionRequest,
    AdminDashboardResponse, AuditLogResponse,
    FeedbackResponse, FeedbackResolveRequest,
)
from ..core.exceptions import NotFoundException, BadRequestException, ForbiddenException
from ..utils.helpers import build_pagination_meta


class AdminService:
    def __init__(self, db: Session):
        self.db = db

    def get_dashboard(self) -> AdminDashboardResponse:
        total_users = self.db.query(User).count()
        total_doctors = self.db.query(DoctorProfile).count()
        total_hospitals = self.db.query(Hospital).count()
        total_pharmacies = self.db.query(Pharmacy).count()
        total_appointments = self.db.query(Appointment).count()
        pending_verifs = self.db.query(VerificationRequest).filter(
            VerificationRequest.status == "pending"
        ).count()
        active_emergencies = self.db.query(EmergencyRequest).filter(
            EmergencyRequest.status.in_(["pending", "dispatched", "en-route"])
        ).count()
        recent_signups = self.db.query(User).filter(
            User.created_at >= datetime.utcnow() - timedelta(days=7)
        ).count()

        return AdminDashboardResponse(
            total_users=total_users,
            total_doctors=total_doctors,
            total_hospitals=total_hospitals,
            total_pharmacies=total_pharmacies,
            total_appointments=total_appointments,
            pending_verifications=pending_verifs,
            active_emergencies=active_emergencies,
            recent_signups=recent_signups,
        )

    def get_verifications(self, status: Optional[str] = None, page: int = 1, size: int = 20) -> dict:
        query = self.db.query(VerificationRequest)
        if status:
            query = query.filter(VerificationRequest.status == status)
        query = query.order_by(VerificationRequest.created_at.desc())
        total = query.count()
        items = query.offset((page - 1) * size).limit(size).all()
        return {
            "items": [VerificationRequestResponse.model_validate(v) for v in items],
            **build_pagination_meta(total, page, size),
        }

    def process_verification(self, verification_id: str, admin_user_id: str, data: VerificationActionRequest) -> VerificationRequestResponse:
        vreq = self.db.query(VerificationRequest).filter(VerificationRequest.id == verification_id).first()
        if not vreq:
            raise NotFoundException("Verification request not found")

        valid_statuses = ["approved", "rejected", "more-info"]
        if data.status not in valid_statuses:
            raise BadRequestException(f"Invalid status. Must be one of: {valid_statuses}")

        vreq.status = data.status
        vreq.reviewed_by = admin_user_id
        if data.rejection_reason:
            vreq.rejection_reason = data.rejection_reason
        if data.notes:
            vreq.notes = data.notes

        # Update the entity's verification status
        if data.status == "approved":
            if vreq.entity_type == "doctor":
                profile = self.db.query(DoctorProfile).filter(DoctorProfile.id == vreq.entity_id).first()
                if profile:
                    profile.is_verified = True
            elif vreq.entity_type == "hospital":
                hospital = self.db.query(Hospital).filter(Hospital.id == vreq.entity_id).first()
                if hospital:
                    hospital.is_verified = True
            elif vreq.entity_type == "pharmacy":
                pharmacy = self.db.query(Pharmacy).filter(Pharmacy.id == vreq.entity_id).first()
                if pharmacy:
                    pharmacy.is_verified = True

        self.db.commit()
        self.db.refresh(vreq)
        return VerificationRequestResponse.model_validate(vreq)

    def get_audit_logs(self, page: int = 1, size: int = 20, user_id: Optional[str] = None, action: Optional[str] = None) -> dict:
        query = self.db.query(AuditLog)
        if user_id:
            query = query.filter(AuditLog.user_id == user_id)
        if action:
            query = query.filter(AuditLog.action.ilike(f"%{action}%"))
        query = query.order_by(AuditLog.created_at.desc())
        total = query.count()
        logs = query.offset((page - 1) * size).limit(size).all()
        return {
            "items": [AuditLogResponse.model_validate(l) for l in logs],
            **build_pagination_meta(total, page, size),
        }

    def get_feedback(self, status: Optional[str] = None, page: int = 1, size: int = 20) -> dict:
        query = self.db.query(Feedback)
        if status:
            query = query.filter(Feedback.status == status)
        query = query.order_by(Feedback.created_at.desc())
        total = query.count()
        items = query.offset((page - 1) * size).limit(size).all()
        return {
            "items": [FeedbackResponse.model_validate(f) for f in items],
            **build_pagination_meta(total, page, size),
        }

    def resolve_feedback(self, feedback_id: str, admin_user_id: str, data: FeedbackResolveRequest) -> FeedbackResponse:
        fb = self.db.query(Feedback).filter(Feedback.id == feedback_id).first()
        if not fb:
            raise NotFoundException("Feedback not found")
        fb.status = data.status
        fb.response = data.response
        fb.resolved_by = admin_user_id
        self.db.commit()
        self.db.refresh(fb)
        return FeedbackResponse.model_validate(fb)

    def toggle_user_active(self, user_id: str, is_active: bool) -> dict:
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise NotFoundException("User not found")
        user.is_active = is_active
        self.db.commit()
        return {"user_id": user_id, "is_active": is_active}

    def get_users(self, page: int = 1, size: int = 20, search: Optional[str] = None, role: Optional[str] = None, status: Optional[str] = None) -> dict:
        query = (
            self.db.query(User)
            .join(UserRole, User.id == UserRole.user_id, isouter=True)
            .join(Role, UserRole.role_id == Role.id, isouter=True)
        )

        if search:
            query = query.filter(
                (User.full_name.ilike(f"%{search}%")) |
                (User.email.ilike(f"%{search}%")) |
                (User.phone.ilike(f"%{search}%"))
            )

        if role:
            role_obj = self.db.query(Role).filter(Role.name == role).first()
            if role_obj:
                query = query.filter(User.primary_role_id == role_obj.id)

        if status == "active":
            query = query.filter(User.is_active == True)
        elif status == "blocked":
            query = query.filter(User.is_active == False)
        elif status == "verified":
            query = query.filter(User.is_verified == True)
        elif status == "pending":
            query = query.filter(User.is_verified == False, User.is_active == True)

        query = query.order_by(User.created_at.desc())
        total = query.count()
        users = query.offset((page - 1) * size).limit(size).all()

        items = []
        for u in users:
            user_role = self.db.query(Role).filter(Role.id == u.primary_role_id).first()
            items.append({
                "id": u.id,
                "full_name": u.full_name,
                "email": u.email,
                "phone": u.phone,
                "role": user_role.name if user_role else "unknown",
                "role_display": user_role.display_name if user_role else "Unknown",
                "status": "active" if u.is_active else "blocked",
                "is_verified": u.is_verified,
                "is_admin_approved": u.is_admin_approved,
                "gender": u.gender,
                "blood_group": u.blood_group,
                "is_online": u.is_online,
                "created_at": u.created_at.isoformat() if u.created_at else None,
                "last_login_at": u.last_login_at.isoformat() if u.last_login_at else None,
            })

        return {
            "items": items,
            **build_pagination_meta(total, page, size),
        }

    def get_system_stats(self) -> dict:
        from ..models.blood_donation import BloodDonor, BloodRequest
        from ..models.oxygen import OxygenRequest as OxyReq
        return {
            "users": self.db.query(User).count(),
            "doctors": self.db.query(DoctorProfile).count(),
            "hospitals": self.db.query(Hospital).count(),
            "pharmacies": self.db.query(Pharmacy).count(),
            "appointments": self.db.query(Appointment).count(),
            "blood_donors": self.db.query(BloodDonor).count(),
            "blood_requests": self.db.query(BloodRequest).count(),
            "oxygen_requests": self.db.query(OxyReq).count(),
            "emergencies": self.db.query(EmergencyRequest).count(),
        }
