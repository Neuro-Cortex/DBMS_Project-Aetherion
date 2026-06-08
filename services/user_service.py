from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import Optional, List
from datetime import datetime

from ..models.user import (
    User, UserProfile, UserAddress, UserEmergencyContact,
    UserNotificationSetting,
)
from ..schemas.user import (
    UserDetailResponse, UserProfileResponse, UserProfileUpdateRequest,
    UserAddressResponse, UserAddressCreateRequest,
    EmergencyContactResponse, EmergencyContactCreateRequest,
    NotificationSettingsResponse, NotificationSettingsUpdateRequest,
    UserUpdateRequest,
)
from ..schemas.auth import UserBasicResponse
from ..schemas.common import PaginatedMeta
from ..core.exceptions import NotFoundException, BadRequestException


class UserService:
    """Handles all user CRUD operations."""

    def __init__(self, db: Session):
        self.db = db

    # ============================================
    # GET USER BY ID
    # ============================================
    def get_user_by_id(self, user_id: str) -> Optional[User]:
        return self.db.query(User).filter(User.id == user_id).first()

    # ============================================
    # GET USER BY EMAIL
    # ============================================
    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.db.query(User).filter(User.email == email).first()

    # ============================================
    # GET USER DETAIL (full profile)
    # ============================================
    def get_user_detail(self, user_id: str) -> UserDetailResponse:
        user = self.get_user_by_id(user_id)
        if not user:
            raise NotFoundException("User not found")

        profile = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        addresses = self.db.query(UserAddress).filter(UserAddress.user_id == user_id).all()
        emergency_contacts = self.db.query(UserEmergencyContact).filter(UserEmergencyContact.user_id == user_id).all()
        notif_settings = self.db.query(UserNotificationSetting).filter(UserNotificationSetting.user_id == user_id).first()

        # Get roles
        from ..models.user import UserRole, Role
        role_rows = (
            self.db.query(Role.name)
            .join(UserRole, UserRole.role_id == Role.id)
            .filter(UserRole.user_id == user_id, UserRole.is_active == True)
            .all()
        )
        roles = [r[0] for r in role_rows]
        primary_role = "client"
        if user.primary_role_id:
            role = self.db.query(Role).filter(Role.id == user.primary_role_id).first()
            if role:
                primary_role = role.name

        return UserDetailResponse(
            id=user.id,
            email=user.email,
            full_name=user.full_name,
            phone=user.phone,
            gender=user.gender,
            date_of_birth=user.date_of_birth,
            profile_image=user.profile_image,
            blood_group=user.blood_group,
            primary_role=primary_role,
            roles=roles,
            is_verified=user.is_verified,
            is_admin_approved=user.is_admin_approved,
            is_active=user.is_active,
            is_online=user.is_online,
            profile=UserProfileResponse.model_validate(profile) if profile else None,
            addresses=[UserAddressResponse.model_validate(a) for a in addresses],
            emergency_contacts=[EmergencyContactResponse.model_validate(ec) for ec in emergency_contacts],
            notification_settings=NotificationSettingsResponse.model_validate(notif_settings) if notif_settings else None,
            created_at=user.created_at,
            updated_at=user.updated_at,
        )

    # ============================================
    # UPDATE USER
    # ============================================
    def update_user(self, user_id: str, data: UserUpdateRequest) -> User:
        user = self.get_user_by_id(user_id)
        if not user:
            raise NotFoundException("User not found")

        update_fields = data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(user, field, value)

        self.db.commit()
        self.db.refresh(user)
        return user

    # ============================================
    # UPDATE USER PROFILE
    # ============================================
    def update_profile(self, user_id: str, data: UserProfileUpdateRequest) -> UserProfile:
        profile = self.db.query(UserProfile).filter(UserProfile.user_id == user_id).first()
        if not profile:
            raise NotFoundException("User profile not found")

        update_fields = data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(profile, field, value)

        self.db.commit()
        self.db.refresh(profile)
        return profile

    # ============================================
    # ADDRESSES
    # ============================================
    def add_address(self, user_id: str, data: UserAddressCreateRequest) -> UserAddress:
        if data.is_primary:
            self.db.query(UserAddress).filter(
                UserAddress.user_id == user_id, UserAddress.is_primary == True
            ).update({"is_primary": False})

        address = UserAddress(user_id=user_id, **data.model_dump())
        self.db.add(address)
        self.db.commit()
        self.db.refresh(address)
        return address

    def get_addresses(self, user_id: str) -> List[UserAddress]:
        return self.db.query(UserAddress).filter(UserAddress.user_id == user_id).all()

    def delete_address(self, user_id: str, address_id: str) -> None:
        address = self.db.query(UserAddress).filter(
            UserAddress.id == address_id, UserAddress.user_id == user_id
        ).first()
        if not address:
            raise NotFoundException("Address not found")
        self.db.delete(address)
        self.db.commit()

    # ============================================
    # EMERGENCY CONTACTS
    # ============================================
    def add_emergency_contact(self, user_id: str, data: EmergencyContactCreateRequest) -> UserEmergencyContact:
        if data.is_primary:
            self.db.query(UserEmergencyContact).filter(
                UserEmergencyContact.user_id == user_id, UserEmergencyContact.is_primary == True
            ).update({"is_primary": False})

        contact = UserEmergencyContact(user_id=user_id, **data.model_dump())
        self.db.add(contact)
        self.db.commit()
        self.db.refresh(contact)
        return contact

    def get_emergency_contacts(self, user_id: str) -> List[UserEmergencyContact]:
        return self.db.query(UserEmergencyContact).filter(UserEmergencyContact.user_id == user_id).all()

    def delete_emergency_contact(self, user_id: str, contact_id: str) -> None:
        contact = self.db.query(UserEmergencyContact).filter(
            UserEmergencyContact.id == contact_id, UserEmergencyContact.user_id == user_id
        ).first()
        if not contact:
            raise NotFoundException("Emergency contact not found")
        self.db.delete(contact)
        self.db.commit()

    # ============================================
    # NOTIFICATION SETTINGS
    # ============================================
    def get_notification_settings(self, user_id: str) -> UserNotificationSetting:
        settings = self.db.query(UserNotificationSetting).filter(
            UserNotificationSetting.user_id == user_id
        ).first()
        if not settings:
            # Create default settings
            settings = UserNotificationSetting(user_id=user_id)
            self.db.add(settings)
            self.db.commit()
            self.db.refresh(settings)
        return settings

    def update_notification_settings(self, user_id: str, data: NotificationSettingsUpdateRequest) -> UserNotificationSetting:
        settings = self.get_notification_settings(user_id)
        update_fields = data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(settings, field, value)
        self.db.commit()
        self.db.refresh(settings)
        return settings

    # ============================================
    # LIST USERS (Admin)
    # ============================================
    def list_users(
        self, page: int = 1, size: int = 20, search: Optional[str] = None, role: Optional[str] = None
    ) -> dict:
        query = self.db.query(User)

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    User.full_name.ilike(search_term),
                    User.email.ilike(search_term),
                    User.phone.ilike(search_term),
                )
            )

        if role:
            from ..models.user import UserRole, Role
            query = query.join(UserRole, UserRole.user_id == User.id).join(
                Role, Role.id == UserRole.role_id
            ).filter(Role.name == role)

        total = query.count()
        users = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": users,
            "total": total,
            "page": page,
            "size": size,
            "pages": (total + size - 1) // size if size > 0 else 0,
        }

    # ============================================
    # DEACTIVATE USER
    # ============================================
    def deactivate_user(self, user_id: str) -> None:
        user = self.get_user_by_id(user_id)
        if not user:
            raise NotFoundException("User not found")
        user.is_active = False
        self.db.commit()

    def activate_user(self, user_id: str) -> None:
        user = self.get_user_by_id(user_id)
        if not user:
            raise NotFoundException("User not found")
        user.is_active = True
        self.db.commit()
