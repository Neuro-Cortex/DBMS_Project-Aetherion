"""
User service with profile management
"""
from typing import Optional, List, Dict, Any
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.user_repository import UserRepository
from app.models.user import User, UserRole
from app.models.emergency import EmergencyContact
from app.core.security import security_manager
from app.integrations.cloudinary import cloudinary_client
from app.utils.validators import Validators
import uuid
import logging

logger = logging.getLogger(__name__)

class UserService:
    """User management service"""
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.user_repo = UserRepository(session)
    
    async def get_user_profile(self, user_id: uuid.UUID) -> Dict:
        """Get user profile with all related data"""
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user.to_dict()
    
    async def update_profile(
        self, user_id: uuid.UUID, data: Dict[str, Any]
    ) -> User:
        """Update user profile"""
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Update allowed fields
        allowed_fields = [
            'first_name', 'last_name', 'phone', 'gender',
            'date_of_birth', 'blood_group', 'address', 'city',
            'country', 'language', 'timezone', 'dark_mode_enabled'
        ]
        
        for key, value in data.items():
            if key in allowed_fields and value is not None:
                setattr(user, key, value)
        
        await self.session.commit()
        return user
    
    async def update_location(
        self, user_id: uuid.UUID, latitude: float, longitude: float
    ) -> User:
        """Update user location"""
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if not Validators.validate_latitude(latitude):
            raise HTTPException(status_code=400, detail="Invalid latitude")
        
        if not Validators.validate_longitude(longitude):
            raise HTTPException(status_code=400, detail="Invalid longitude")
        
        user.latitude = latitude
        user.longitude = longitude
        await self.session.commit()
        return user
    
    async def add_user_role(self, user_id: uuid.UUID, role: UserRole) -> User:
        """Add role to user"""
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.add_role(role)
        await self.session.commit()
        return user
    
    async def remove_user_role(self, user_id: uuid.UUID, role: str) -> User:
        """Remove role from user"""
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        try:
            role_enum = UserRole(role)
            if role_enum == UserRole.PATIENT and len(user.roles) == 1:
                raise HTTPException(
                    status_code=400,
                    detail="Cannot remove last role"
                )
            user.remove_role(role_enum)
        except ValueError:
            raise HTTPException(status_code=400, detail=f"Invalid role: {role}")
        
        await self.session.commit()
        return user
    
    async def update_notification_preferences(
        self, user_id: uuid.UUID, preferences: Dict
    ) -> User:
        """Update notification preferences"""
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user.notification_preferences = preferences
        await self.session.commit()
        return user
    
    async def get_emergency_contacts(
        self, user_id: uuid.UUID
    ) -> List[EmergencyContact]:
        """Get user emergency contacts"""
        from sqlalchemy import select
        
        query = select(EmergencyContact).where(
            EmergencyContact.user_id == user_id
        ).order_by(EmergencyContact.is_primary.desc())
        
        result = await self.session.execute(query)
        return result.scalars().all()
    
    async def add_emergency_contact(
        self, user_id: uuid.UUID, data: Dict
    ) -> EmergencyContact:
        """Add emergency contact"""
        from sqlalchemy import select
        
        # Check max contacts (limit 5)
        count_query = select(func.count()).where(
            EmergencyContact.user_id == user_id
        )
        result = await self.session.execute(count_query)
        count = result.scalar()
        
        if count >= 5:
            raise HTTPException(
                status_code=400,
                detail="Maximum 5 emergency contacts allowed"
            )
        
        contact = EmergencyContact(
            user_id=user_id,
            **data
        )
        
        self.session.add(contact)
        await self.session.commit()
        return contact
    
    async def update_emergency_contact(
        self, user_id: uuid.UUID, contact_id: uuid.UUID, data: Dict
    ) -> EmergencyContact:
        """Update emergency contact"""
        from sqlalchemy import select
        
        query = select(EmergencyContact).where(
            and_(
                EmergencyContact.id == contact_id,
                EmergencyContact.user_id == user_id
            )
        )
        result = await self.session.execute(query)
        contact = result.scalar_one_or_none()
        
        if not contact:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        for key, value in data.items():
            setattr(contact, key, value)
        
        await self.session.commit()
        return contact
    
    async def delete_emergency_contact(
        self, user_id: uuid.UUID, contact_id: uuid.UUID
    ) -> bool:
        """Delete emergency contact"""
        from sqlalchemy import delete
        
        query = delete(EmergencyContact).where(
            and_(
                EmergencyContact.id == contact_id,
                EmergencyContact.user_id == user_id
            )
        )
        result = await self.session.execute(query)
        await self.session.commit()
        
        return result.rowcount > 0
    
    async def upload_avatar(
        self, user_id: uuid.UUID, file: UploadFile
    ) -> str:
        """Upload profile avatar"""
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Upload to Cloudinary
        result = await cloudinary_client.upload_image(
            file,
            folder=f"avatars/{user_id}",
            public_id=f"avatar_{user_id}"
        )
        
        user.profile_image_url = result['secure_url']
        await self.session.commit()
        
        return result['secure_url']
    
    async def search_users(
        self, query: str, skip: int = 0, limit: int = 20
    ) -> List[User]:
        """Search users by name or email"""
        return await self.user_repo.search_users(query, skip, limit)
    
    async def get_dashboard(self, user_id: uuid.UUID) -> Dict:
        """Get user dashboard data"""
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get upcoming appointments
        from app.repositories.appointment_repository import AppointmentRepository
        app_repo = AppointmentRepository(self.session)
        upcoming = await app_repo.get_upcoming_appointments(user_id, limit=5)
        
        # Get recent notifications
        from app.models.notification import Notification
        notif_query = select(Notification).where(
            Notification.user_id == user_id
        ).order_by(Notification.created_at.desc()).limit(10)
        result = await self.session.execute(notif_query)
        notifications = result.scalars().all()
        
        # Get blood donation info if donor
        blood_info = None
        if UserRole.BLOOD_DONOR in user.roles:
            from app.repositories.blood_donor_repository import BloodDonorRepository
            donor_repo = BloodDonorRepository(self.session)
            donor = await donor_repo.get_by_user_id(user_id)
            if donor:
                blood_info = {
                    "total_donations": donor.total_donations,
                    "next_eligible_date": donor.next_eligible_date.isoformat() if donor.next_eligible_date else None,
                    "donor_level": donor.donor_level,
                    "reward_points": donor.reward_points
                }
        
        return {
            "user": user.to_dict(),
            "upcoming_appointments": [
                {
                    "id": str(app.id),
                    "date": app.appointment_date.isoformat(),
                    "time": app.start_time.isoformat(),
                    "status": app.status.value
                }
                for app in upcoming
            ],
            "recent_notifications": [
                {
                    "id": str(n.id),
                    "title": n.title,
                    "message": n.message,
                    "is_read": n.is_read,
                    "created_at": n.created_at.isoformat()
                }
                for n in notifications
            ],
            "blood_donation": blood_info
        }
    
    async def delete_account(
        self, user_id: uuid.UUID, password: str
    ) -> bool:
        """Delete user account"""
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        if not user.verify_password(password):
            raise HTTPException(status_code=400, detail="Invalid password")
        
        # Soft delete
        user.is_deleted = True
        user.deleted_at = func.now()
        user.account_status = 'deleted'
        
        await self.session.commit()
        return True