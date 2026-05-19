"""
Blood donor repository with specialized queries
"""
from typing import Optional, List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, and_, or_, func
from app.models.blood_donor import BloodDonorProfile, BloodDonation, BloodRequest
from app.models.user import User
from app.repositories.base import BaseRepository
import uuid

class BloodDonorRepository(BaseRepository[BloodDonorProfile]):
    """Blood donor-specific repository"""
    
    def __init__(self, session: AsyncSession):
        super().__init__(BloodDonorProfile, session)
    
    async def get_by_user_id(self, user_id: uuid.UUID) -> Optional[BloodDonorProfile]:
        """Get blood donor profile by user ID"""
        query = select(BloodDonorProfile).where(
            BloodDonorProfile.user_id == user_id
        )
        result = await self.session.execute(query)
        return result.scalar_one_or_none()
    
    async def search_donors(
        self,
        blood_group: Optional[str] = None,
        city: Optional[str] = None,
        available_only: bool = True,
        skip: int = 0,
        limit: int = 20
    ) -> List[BloodDonorProfile]:
        """Search blood donors"""
        conditions = [BloodDonorProfile.is_eligible == True]
        
        if blood_group:
            conditions.append(BloodDonorProfile.blood_group == blood_group)
        
        if available_only:
            conditions.append(
                or_(
                    BloodDonorProfile.last_donation_date.is_(None),
                    BloodDonorProfile.last_donation_date < func.current_date() - 90
                )
            )
        
        if city:
            conditions.append(User.city.ilike(f"%{city}%"))
        
        query = (
            select(BloodDonorProfile)
            .join(User)
            .where(and_(*conditions))
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def find_nearby_donors(
        self,
        latitude: float,
        longitude: float,
        radius_km: float,
        blood_group: Optional[str] = None
    ) -> List[tuple]:
        """Find nearby blood donors"""
        conditions = [
            BloodDonorProfile.is_eligible == True,
            BloodDonorProfile.is_willing_emergency_donor == True,
            User.latitude.isnot(None),
            User.longitude.isnot(None)
        ]
        
        if blood_group:
            conditions.append(BloodDonorProfile.blood_group == blood_group)
        
        distance_query = (
            6371 * func.acos(
                func.cos(func.radians(latitude)) *
                func.cos(func.radians(User.latitude)) *
                func.cos(func.radians(User.longitude) - func.radians(longitude)) +
                func.sin(func.radians(latitude)) *
                func.sin(func.radians(User.latitude))
            )
        )
        
        query = (
            select(BloodDonorProfile, User, distance_query.label("distance"))
            .join(User, BloodDonorProfile.user_id == User.id)
            .where(and_(*conditions))
            .having(distance_query <= radius_km)
            .order_by("distance")
        )
        
        result = await self.session.execute(query)
        return result.all()
    
    async def get_donation_history(
        self, donor_id: uuid.UUID, skip: int = 0, limit: int = 20
    ) -> List[BloodDonation]:
        """Get donation history"""
        query = (
            select(BloodDonation)
            .where(BloodDonation.donor_id == donor_id)
            .order_by(BloodDonation.donation_date.desc())
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_pending_requests(
        self,
        blood_group: Optional[str] = None,
        is_emergency: bool = False,
        skip: int = 0,
        limit: int = 20
    ) -> List[BloodRequest]:
        """Get pending blood requests"""
        conditions = [BloodRequest.status == 'pending']
        
        if blood_group:
            conditions.append(BloodRequest.blood_group == blood_group)
        
        if is_emergency:
            conditions.append(BloodRequest.is_emergency == True)
        
        query = (
            select(BloodRequest)
            .where(and_(*conditions))
            .order_by(
                BloodRequest.is_emergency.desc(),
                BloodRequest.created_at.asc()
            )
            .offset(skip)
            .limit(limit)
        )
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def get_blood_stock_summary(self) -> Dict:
        """Get blood stock summary"""
        from app.models.hospital import BloodStock
        
        query = select(
            BloodStock.blood_group,
            func.sum(BloodStock.quantity_units).label('total')
        ).group_by(BloodStock.blood_group)
        
        result = await self.session.execute(query)
        
        stock_summary = {}
        for blood_group, total in result:
            stock_summary[blood_group] = total or 0
        
        return stock_summary
    
    async def get_donation_statistics(self) -> Dict:
        """Get donation statistics"""
        total_donors = await self.session.scalar(
            select(func.count()).where(BloodDonorProfile.is_eligible == True)
        )
        
        total_donations = await self.session.scalar(
            select(func.count()).select_from(BloodDonation)
        )
        
        total_volume = await self.session.scalar(
            select(func.sum(BloodDonation.volume_ml)).select_from(BloodDonation)
        )
        
        # Donations by blood group
        query = select(
            BloodDonation.blood_group,
            func.count(BloodDonation.id)
        ).group_by(BloodDonation.blood_group)
        
        result = await self.session.execute(query)
        by_blood_group = {bg.value if hasattr(bg, 'value') else bg: count for bg, count in result}
        
        return {
            "total_eligible_donors": total_donors or 0,
            "total_donations": total_donations or 0,
            "total_volume_ml": total_volume or 0,
            "donations_by_blood_group": by_blood_group
        }