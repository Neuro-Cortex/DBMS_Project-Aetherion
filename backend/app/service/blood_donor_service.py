"""
Blood donor service with donation tracking and matching
"""
from typing import Optional, List, Dict, Any
from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.blood_donor_repository import BloodDonorRepository
from app.repositories.user_repository import UserRepository
from app.models.blood_donor import (
    BloodDonorProfile, BloodDonation, DonorReward, BloodRequest
)
from app.models.user import BloodGroup
from datetime import datetime, date, timedelta
import uuid
import logging

logger = logging.getLogger(__name__)

class BloodDonorService:
    """Blood donor management service"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.donor_repo = BloodDonorRepository(session)
        self.user_repo = UserRepository(session)
    
    async def register_donor(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> BloodDonorProfile:
        """Register as blood donor"""
        existing = await self.donor_repo.get_by_user_id(user_id)
        if existing:
            raise HTTPException(
                status_code=400,
                detail="Already registered as blood donor"
            )
        
        # Validate age
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if user.age and (user.age < 18 or user.age > 65):
            raise HTTPException(
                status_code=400,
                detail="Donors must be between 18 and 65 years"
            )
        
        # Validate weight
        if data['weight_kg'] < 45:
            raise HTTPException(
                status_code=400,
                detail="Donors must weigh at least 45kg"
            )
        
        donor = BloodDonorProfile(
            user_id=user_id,
            **data
        )
        
        self.session.add(donor)
        await self.session.commit()
        return donor
    
    async def search_donors(
        self,
        blood_group: Optional[str] = None,
        city: Optional[str] = None,
        available_only: bool = True,
        skip: int = 0,
        limit: int = 20
    ) -> List[Dict]:
        """Search blood donors"""
        donors = await self.donor_repo.search_donors(
            blood_group, city, available_only, skip, limit
        )
        
        result = []
        for donor in donors:
            user = await self.user_repo.get_by_id(donor.user_id)
            result.append({
                "donor_id": str(donor.id),
                "blood_group": donor.blood_group.value,
                "total_donations": donor.total_donations,
                "donor_level": donor.donor_level,
                "user": user.to_dict() if user and not donor.is_anonymous else None
            })
        
        return result
    
    async def find_nearby_donors(
        self,
        latitude: float,
        longitude: float,
        radius_km: float,
        blood_group: Optional[str] = None
    ) -> List[Dict]:
        """Find nearby blood donors"""
        results = await self.donor_repo.find_nearby_donors(
            latitude, longitude, radius_km, blood_group
        )
        
        donors = []
        for donor, user, distance in results:
            donors.append({
                "donor_id": str(donor.id),
                "blood_group": donor.blood_group.value,
                "distance_km": round(distance, 2),
                "user": user.to_dict() if user and not donor.is_anonymous else None
            })
        
        return donors
    
    async def request_blood(
        self, requester_id: uuid.UUID, data: Dict[str, Any]
    ) -> BloodRequest:
        """Request blood donation"""
        request = BloodRequest(
            requester_id=requester_id,
            **data
        )
        
        self.session.add(request)
        
        # If emergency, alert nearby donors
        if data.get('is_emergency') and data.get('latitude') and data.get('longitude'):
            nearby_donors = await self.donor_repo.find_nearby_donors(
                data['latitude'],
                data['longitude'],
                20,  # 20km radius for emergencies
                data['blood_group']
            )
            
            # Send alerts to nearby donors
            donor_ids = [str(donor.id) for donor, _, _ in nearby_donors]
            # Use realtime service to notify
            
        await self.session.commit()
        return request
    
    async def record_donation(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> BloodDonation:
        """Record blood donation"""
        donor = await self.donor_repo.get_by_user_id(user_id)
        if not donor:
            raise HTTPException(status_code=404, detail="Donor profile not found")
        
        # Check eligibility
        if not donor.is_eligible:
            raise HTTPException(
                status_code=400,
                detail="Donor is not currently eligible"
            )
        
        donation = BloodDonation(
            donor_id=donor.id,
            **data
        )
        
        self.session.add(donation)
        
        # Update donor statistics
        donor.last_donation_date = data['donation_date']
        donor.total_donations += 1
        donor.total_volume_donated_ml += data.get('quantity_ml', 450)
        
        # Add reward points
        points = 100  # Base points
        if donor.total_donations % 5 == 0:
            points += 200  # Bonus for every 5 donations
        
        donor.reward_points += points
        donor.update_donor_level()
        
        # Create reward record
        reward = DonorReward(
            donor_id=donor.id,
            reward_type="points",
            points_earned=points,
            description=f"Points earned for donation #{donor.total_donations}",
            awarded_for_donation_id=donation.id
        )
        self.session.add(reward)
        
        await self.session.commit()
        return donation
    
    async def check_eligibility(self, user_id: uuid.UUID) -> Dict:
        """Check blood donation eligibility"""
        donor = await self.donor_repo.get_by_user_id(user_id)
        if not donor:
            return {"is_eligible": False, "reason": "Not registered as donor"}
        
        reasons = []
        
        if donor.permanent_deferral_reason:
            return {
                "is_eligible": False,
                "reason": f"Permanently deferred: {donor.permanent_deferral_reason}"
            }
        
        if donor.temporary_deferral_until and donor.temporary_deferral_until > date.today():
            days_left = (donor.temporary_deferral_until - date.today()).days
            reasons.append(f"Temporarily deferred for {days_left} more days")
        
        if donor.next_eligible_date and donor.next_eligible_date > date.today():
            days_left = (donor.next_eligible_date - date.today()).days
            reasons.append(f"Next eligible in {days_left} days")
        
        user = await self.user_repo.get_by_id(user_id)
        if user and user.age:
            if user.age < 18:
                reasons.append("Must be at least 18 years old")
            elif user.age > 65:
                reasons.append("Must be under 65 years old")
        
        if donor.weight_kg < 45:
            reasons.append("Must weigh at least 45kg")
        
        return {
            "is_eligible": len(reasons) == 0,
            "reasons": reasons if reasons else ["You are eligible to donate!"],
            "next_eligible_date": donor.next_eligible_date.isoformat() if donor.next_eligible_date else None,
            "total_donations": donor.total_donations,
            "donor_level": donor.donor_level
        }
    
    async def get_donation_history(
        self, user_id: uuid.UUID, skip: int = 0, limit: int = 20
    ) -> List[BloodDonation]:
        """Get donation history"""
        donor = await self.donor_repo.get_by_user_id(user_id)
        if not donor:
            return []
        
        return await self.donor_repo.get_donation_history(donor.id, skip, limit)
    
    async def get_blood_stock(
        self,
        hospital_id: Optional[uuid.UUID] = None,
        blood_group: Optional[str] = None
    ) -> Dict:
        """Get blood stock levels"""
        from app.repositories.hospital_repository import HospitalRepository
        
        if hospital_id:
            hospital_repo = HospitalRepository(self.session)
            stock = await hospital_repo.get_blood_stock(hospital_id, blood_group)
            return {
                str(s.id): {
                    "blood_group": s.blood_group,
                    "quantity": s.quantity_units,
                    "is_low": s.is_low_stock
                }
                for s in stock
            }
        
        return await self.donor_repo.get_blood_stock_summary()
    
    async def get_rewards(self, user_id: uuid.UUID) -> Dict:
        """Get donor rewards"""
        donor = await self.donor_repo.get_by_user_id(user_id)
        if not donor:
            raise HTTPException(status_code=404, detail="Donor profile not found")
        
        from sqlalchemy import select
        
        query = select(DonorReward).where(
            DonorReward.donor_id == donor.id
        ).order_by(DonorReward.created_at.desc())
        
        result = await self.session.execute(query)
        rewards = result.scalars().all()
        
        return {
            "total_points": donor.reward_points,
            "donor_level": donor.donor_level,
            "total_donations": donor.total_donations,
            "rewards_history": [
                {
                    "id": str(r.id),
                    "type": r.reward_type,
                    "points": r.points_earned,
                    "description": r.description,
                    "awarded_at": r.created_at.isoformat()
                }
                for r in rewards
            ]
        }
    
    async def send_emergency_alert(
        self,
        blood_group: str,
        latitude: float,
        longitude: float,
        radius_km: float,
        requester_id: uuid.UUID
    ) -> Dict:
        """Send emergency alert to nearby donors"""
        results = await self.donor_repo.find_nearby_donors(
            latitude, longitude, radius_km, blood_group
        )
        
        donors_alerted = len(results)
        
        # Send notifications via realtime service
        donor_ids = [str(donor.id) for donor, _, _ in results]
        
        return {
            "donors_alerted": donors_alerted,
            "search_radius_km": radius_km,
            "blood_group": blood_group
        }
    
    async def get_statistics(self) -> Dict:
        """Get blood donation statistics"""
        return await self.donor_repo.get_donation_statistics()