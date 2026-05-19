"""
Admin service for system management
"""
from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_
from app.repositories.user_repository import UserRepository
from app.models.user import User, AccountStatus, UserRole
from datetime import datetime, date
import uuid
import logging

logger = logging.getLogger(__name__)

class AdminService:
    """Admin management service"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.user_repo = UserRepository(session)
    
    async def get_dashboard_analytics(self) -> Dict:
        """Get admin dashboard analytics"""
        total_users = await self.user_repo.count()
        
        # Count by role
        role_counts = {}
        for role in UserRole:
            count = await self.session.scalar(
                select(func.count()).where(User.roles.contains([role]))
            )
            role_counts[role.value] = count or 0
        
        # Count by status
        status_counts = {}
        for status in AccountStatus:
            count = await self.session.scalar(
                select(func.count()).where(User.account_status == status)
            )
            status_counts[status.value] = count or 0
        
        # Recent registrations (last 30 days)
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        recent_users = await self.session.scalar(
            select(func.count()).where(User.created_at >= thirty_days_ago)
        )
        
        return {
            "total_users": total_users or 0,
            "by_role": role_counts,
            "by_status": status_counts,
            "recent_registrations": recent_users or 0,
            "generated_at": datetime.utcnow().isoformat()
        }
    
    async def get_users(
        self,
        skip: int = 0,
        limit: int = 50,
        role: Optional[str] = None,
        status: Optional[str] = None,
        search: Optional[str] = None
    ) -> Dict:
        """Get all users with filters"""
        conditions = [User.is_deleted == False]
        
        if role:
            conditions.append(User.roles.contains([UserRole(role)]))
        
        if status:
            conditions.append(User.account_status == AccountStatus(status))
        
        if search:
            conditions.append(
                or_(
                    User.email.ilike(f"%{search}%"),
                    User.first_name.ilike(f"%{search}%"),
                    User.last_name.ilike(f"%{search}%")
                )
            )
        
        query = select(User).where(and_(*conditions)).offset(skip).limit(limit)
        result = await self.session.execute(query)
        users = result.scalars().all()
        
        total = await self.session.scalar(
            select(func.count()).where(and_(*conditions))
        )
        
        return {
            "users": [user.to_dict() for user in users],
            "total": total or 0,
            "skip": skip,
            "limit": limit
        }
    
    async def get_user_details(self, user_id: uuid.UUID) -> Dict:
        """Get detailed user information"""
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        return {
            **user.to_dict(),
            "roles": [role.value for role in user.roles],
            "created_at": user.created_at.isoformat(),
            "last_login": user.last_login_at.isoformat() if user.last_login_at else None
        }
    
    async def update_user_status(
        self, user_id: uuid.UUID, status: AccountStatus
    ) -> User:
        """Update user account status"""
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.account_status = status
        await self.session.commit()
        return user
    
    async def block_user(
        self, user_id: uuid.UUID, reason: Optional[str] = None
    ) -> User:
        """Block user account"""
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.account_status = AccountStatus.BLOCKED
        await self.session.commit()
        return user
    
    async def delete_user(self, user_id: uuid.UUID) -> bool:
        """Delete user account"""
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Soft delete
        user.is_deleted = True
        user.deleted_at = datetime.utcnow()
        user.account_status = AccountStatus.DELETED
        
        await self.session.commit()
        return True
    
    async def verify_doctor(
        self, user_id: uuid.UUID, is_approved: bool, notes: Optional[str] = None
    ) -> Dict:
        """Verify doctor profile"""
        from app.repositories.doctor_repository import DoctorRepository
        
        doctor_repo = DoctorRepository(self.session)
        doctor = await doctor_repo.get_by_user_id(user_id)
        
        if not doctor:
            raise HTTPException(status_code=404, detail="Doctor profile not found")
        
        doctor.is_verified = is_approved
        
        await self.session.commit()
        return {"verified": is_approved, "notes": notes}
    
    async def verify_hospital(
        self, user_id: uuid.UUID, is_approved: bool, notes: Optional[str] = None
    ) -> Dict:
        """Verify hospital registration"""
        from app.repositories.hospital_repository import HospitalRepository
        
        hospital_repo = HospitalRepository(self.session)
        hospital = await hospital_repo.get_by_admin_user_id(user_id)
        
        if not hospital:
            raise HTTPException(status_code=404, detail="Hospital not found")
        
        hospital.is_verified = is_approved
        
        await self.session.commit()
        return {"verified": is_approved, "notes": notes}
    
    async def verify_pharmacy(
        self, user_id: uuid.UUID, is_approved: bool, notes: Optional[str] = None
    ) -> Dict:
        """Verify pharmacy registration"""
        from app.repositories.pharmacy_repository import PharmacyRepository
        
        pharmacy_repo = PharmacyRepository(self.session)
        pharmacy = await pharmacy_repo.get_by_user_id(user_id)
        
        if not pharmacy:
            raise HTTPException(status_code=404, detail="Pharmacy not found")
        
        pharmacy.is_verified = is_approved
        
        await self.session.commit()
        return {"verified": is_approved, "notes": notes}
    
    async def get_user_analytics(
        self,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> Dict:
        """Get user analytics"""
        conditions = [User.is_deleted == False]
        
        if start_date:
            conditions.append(User.created_at >= start_date)
        
        if end_date:
            conditions.append(User.created_at <= end_date)
        
        total = await self.session.scalar(
            select(func.count()).where(and_(*conditions))
        )
        
        # Growth over time
        from sqlalchemy import extract
        
        monthly_query = (
            select(
                extract('year', User.created_at).label('year'),
                extract('month', User.created_at).label('month'),
                func.count(User.id).label('count')
            )
            .where(and_(*conditions))
            .group_by('year', 'month')
            .order_by('year', 'month')
        )
        
        result = await self.session.execute(monthly_query)
        monthly_data = [
            {"year": int(r[0]), "month": int(r[1]), "count": r[2]}
            for r in result
        ]
        
        return {
            "total_users": total or 0,
            "monthly_growth": monthly_data
        }
    
    async def get_blood_analytics(self) -> Dict:
        """Get blood donation analytics"""
        from app.repositories.blood_donor_repository import BloodDonorRepository
        
        donor_repo = BloodDonorRepository(self.session)
        stats = await donor_repo.get_donation_statistics()
        
        return stats
    
    async def get_revenue_analytics(
        self,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> Dict:
        """Get revenue analytics"""
        from app.models.payment import Payment
        
        conditions = [Payment.status == 'completed']
        
        if start_date:
            conditions.append(Payment.created_at >= start_date)
        
        if end_date:
            conditions.append(Payment.created_at <= end_date)
        
        total_revenue = await self.session.scalar(
            select(func.sum(Payment.amount)).where(and_(*conditions))
        )
        
        total_transactions = await self.session.scalar(
            select(func.count()).where(and_(*conditions))
        )
        
        return {
            "total_revenue": total_revenue or 0,
            "total_transactions": total_transactions or 0
        }
    
    async def get_emergency_analytics(
        self,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None
    ) -> Dict:
        """Get emergency response analytics"""
        from app.models.emergency import EmergencyRequest
        
        conditions = []
        
        if start_date:
            conditions.append(EmergencyRequest.created_at >= start_date)
        
        if end_date:
            conditions.append(EmergencyRequest.created_at <= end_date)
        
        total = await self.session.scalar(
            select(func.count()).where(and_(*conditions))
        )
        
        by_severity = await self.session.execute(
            select(
                EmergencyRequest.severity,
                func.count(EmergencyRequest.id)
            )
            .where(and_(*conditions))
            .group_by(EmergencyRequest.severity)
        )
        
        severity_data = {}
        for severity, count in by_severity:
            severity_data[severity.value if hasattr(severity, 'value') else severity] = count
        
        return {
            "total_emergencies": total or 0,
            "by_severity": severity_data
        }
    
    async def generate_report(
        self,
        report_type: str,
        start_date: Optional[date] = None,
        end_date: Optional[date] = None,
        format: str = "json"
    ) -> Dict:
        """Generate various reports"""
        
        reports = {
            "users": await self.get_user_analytics(start_date, end_date),
            "blood": await self.get_blood_analytics(),
            "revenue": await self.get_revenue_analytics(start_date, end_date),
            "emergency": await self.get_emergency_analytics(start_date, end_date)
        }
        
        if report_type in reports:
            return {
                "report_type": report_type,
                "format": format,
                "data": reports[report_type],
                "generated_at": datetime.utcnow().isoformat()
            }
        
        raise HTTPException(status_code=400, detail=f"Unknown report type: {report_type}")
    
    async def get_feedback(
        self,
        skip: int = 0,
        limit: int = 50,
        status: Optional[str] = None
    ) -> List[Dict]:
        """Get user feedback"""
        from app.models.review import Review
        
        conditions = [Review.review_type == 'feedback']
        
        if status:
            conditions.append(Review.status == status)
        
        query = (
            select(Review)
            .where(and_(*conditions))
            .order_by(Review.created_at.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        
        return [
            {
                "id": str(r.id),
                "rating": r.rating,
                "comment": r.comment,
                "created_at": r.created_at.isoformat()
            }
            for r in result.scalars().all()
        ]
    
    async def get_audit_logs(
        self,
        skip: int = 0,
        limit: int = 100,
        user_id: Optional[uuid.UUID] = None,
        action: Optional[str] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> List[Dict]:
        """Get audit logs"""
        # Implementation would query audit trail table
        return []