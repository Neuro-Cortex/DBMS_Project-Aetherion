from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional, List
from datetime import date, datetime, timedelta

from ..models.blood_donation import (
    BloodDonor, BloodDonation, BloodRequest, BloodDonationCamp,
    DonorReward, DonorDocument, DonationReminder,
)
from ..models.user import User
from ..schemas.blood_donation import (
    DonorRegisterRequest, DonorProfileResponse, DonorProfileUpdateRequest,
    BloodDonationResponse, BloodRequestCreate, BloodRequestResponse,
    BloodDonationCampResponse, EligibilityResponse, DonorStatsResponse,
)
from ..core.exceptions import NotFoundException, ConflictException, BadRequestException
from ..utils.helpers import build_pagination_meta, generate_request_number


class BloodDonationServiceLayer:
    """Handles all blood donation-related business logic."""

    def __init__(self, db: Session):
        self.db = db

    # ============================================
    # DONOR REGISTRATION
    # ============================================
    def register_donor(self, user_id: str, data: DonorRegisterRequest) -> DonorProfileResponse:
        # Check if already registered
        existing = self.db.query(BloodDonor).filter(BloodDonor.user_id == user_id).first()
        if existing:
            raise ConflictException("You are already registered as a blood donor")

        valid_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
        if data.blood_group not in valid_groups:
            raise BadRequestException(f"Invalid blood group. Must be one of: {valid_groups}")

        donor = BloodDonor(
            user_id=user_id,
            blood_group=data.blood_group,
            age=data.age,
            weight_kg=data.weight_kg,
            gender=data.gender,
            is_emergency_donor=data.is_emergency_donor,
            medical_conditions=data.medical_conditions,
            is_on_medication=data.is_on_medication,
            current_medications=data.current_medications,
            has_tattoo=data.has_tattoo,
            has_piercing=data.has_piercing,
            has_traveled_abroad=data.has_traveled_abroad,
            status="pending",
            is_available=True,
            is_eligible=True,
        )
        self.db.add(donor)
        self.db.commit()
        self.db.refresh(donor)

        user = self.db.query(User).filter(User.id == user_id).first()
        return self._build_donor_response(donor, user)

    # ============================================
    # GET DONOR PROFILE
    # ============================================
    def get_donor_profile(self, user_id: str) -> DonorProfileResponse:
        donor = self.db.query(BloodDonor).filter(BloodDonor.user_id == user_id).first()
        if not donor:
            raise NotFoundException("Donor profile not found")
        user = self.db.query(User).filter(User.id == user_id).first()
        return self._build_donor_response(donor, user)

    # ============================================
    # UPDATE DONOR PROFILE
    # ============================================
    def update_donor_profile(self, user_id: str, data: DonorProfileUpdateRequest) -> DonorProfileResponse:
        donor = self.db.query(BloodDonor).filter(BloodDonor.user_id == user_id).first()
        if not donor:
            raise NotFoundException("Donor profile not found")
        update_fields = data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(donor, field, value)
        self.db.commit()
        user = self.db.query(User).filter(User.id == user_id).first()
        return self._build_donor_response(donor, user)

    # ============================================
    # CHECK ELIGIBILITY
    # ============================================
    def check_eligibility(self, user_id: str) -> EligibilityResponse:
        donor = self.db.query(BloodDonor).filter(BloodDonor.user_id == user_id).first()
        if not donor:
            raise NotFoundException("Donor profile not found")

        if donor.status in ["blocked", "permanent-deferred"]:
            return EligibilityResponse(
                is_eligible=False,
                reason=f"Your donor status is: {donor.status}. {donor.deferral_reason or ''}",
            )

        if donor.status == "temporary-deferred" and donor.deferral_until:
            if donor.deferral_until > date.today():
                return EligibilityResponse(
                    is_eligible=False,
                    next_eligible_date=str(donor.deferral_until),
                    reason=f"Temporarily deferred until {donor.deferral_until}. {donor.deferral_reason or ''}",
                )

        # Check 3-month rule
        if donor.last_donation_date:
            next_eligible = donor.last_donation_date + timedelta(days=90)
            if next_eligible > date.today():
                return EligibilityResponse(
                    is_eligible=False,
                    next_eligible_date=str(next_eligible),
                    reason="Must wait 90 days between donations",
                )

        # Check disqualifying conditions
        reasons = []
        if donor.has_tattoo:
            reasons.append("Recent tattoo - wait period may apply")
        if donor.is_on_medication:
            reasons.append("Currently on medication - may affect eligibility")

        # Compute next eligible date from last donation
        next_eligible = None
        if donor.last_donation_date:
            next_eligible = donor.last_donation_date + timedelta(days=90)
            if next_eligible <= date.today():
                next_eligible = None  # Already eligible

        return EligibilityResponse(
            is_eligible=len(reasons) == 0,
            next_eligible_date=str(next_eligible) if next_eligible else None,
            reason="; ".join(reasons) if reasons else None,
        )

    # ============================================
    # SEARCH DONORS
    # ============================================
    def search_donors(
        self, blood_group: Optional[str] = None, city: Optional[str] = None,
        is_available: bool = True, page: int = 1, size: int = 20,
    ) -> dict:
        query = (
            self.db.query(BloodDonor, User)
            .join(User, User.id == BloodDonor.user_id)
            .filter(BloodDonor.is_available == is_available, BloodDonor.status.in_(["approved", "active"]))
        )

        if blood_group:
            query = query.filter(BloodDonor.blood_group == blood_group)
        if city:
            # Search by city via user addresses or user name as fallback
            from ..models.user import UserAddress
            user_ids_with_city = self.db.query(UserAddress.user_id).filter(
                UserAddress.city.ilike(f"%{city}%")
            ).subquery()
            query = query.filter(User.id.in_(user_ids_with_city))

        total = query.count()
        results = query.offset((page - 1) * size).limit(size).all()

        items = [self._build_donor_response(d, u) for d, u in results]
        return {
            "items": items,
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # RECORD DONATION
    # ============================================
    def record_donation(self, user_id: str, data: dict) -> BloodDonationResponse:
        donor = self.db.query(BloodDonor).filter(BloodDonor.user_id == user_id).first()
        if not donor:
            raise NotFoundException("Donor profile not found")

        donation = BloodDonation(
            donor_id=donor.id,
            donation_date=data.get("donation_date", date.today()),
            blood_group=donor.blood_group,
            units=data.get("units", 1),
            donation_type=data.get("donation_type", "whole-blood"),
            location=data.get("location"),
            hospital_name=data.get("hospital_name"),
            reward_points_earned=10,
        )
        self.db.add(donation)

        # Update donor stats
        donor.total_donations = (donor.total_donations or 0) + 1
        donor.donated_units = (donor.donated_units or 0) + donation.units
        donor.last_donation_date = donation.donation_date
        donor.next_eligible_date = donation.donation_date + timedelta(days=90)
        donor.reward_points = (donor.reward_points or 0) + 10
        donor.lives_saved = (donor.lives_saved or 0) + donation.units

        self.db.commit()
        self.db.refresh(donation)
        return BloodDonationResponse.model_validate(donation)

    # ============================================
    # DONATION HISTORY
    # ============================================
    def get_donation_history(self, user_id: str, page: int = 1, size: int = 20) -> dict:
        donor = self.db.query(BloodDonor).filter(BloodDonor.user_id == user_id).first()
        if not donor:
            raise NotFoundException("Donor profile not found")

        query = self.db.query(BloodDonation).filter(
            BloodDonation.donor_id == donor.id,
        ).order_by(BloodDonation.donation_date.desc())

        total = query.count()
        donations = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [BloodDonationResponse.model_validate(d) for d in donations],
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # BLOOD REQUEST
    # ============================================
    def create_blood_request(self, user_id: str, data: BloodRequestCreate) -> BloodRequestResponse:
        valid_groups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
        if data.blood_group not in valid_groups:
            raise BadRequestException("Invalid blood group")

        request_number = generate_request_number("BLD")

        blood_req = BloodRequest(
            request_number=request_number,
            requested_by=user_id,
            hospital_id=data.hospital_id,
            patient_name=data.patient_name,
            patient_age=data.patient_age,
            blood_group=data.blood_group,
            units_required=data.units_required,
            urgency=data.urgency,
            reason=data.reason,
            doctor_name=data.doctor_name,
            status="pending",
            required_by_date=data.required_by_date,
        )
        self.db.add(blood_req)
        self.db.commit()
        self.db.refresh(blood_req)
        return BloodRequestResponse.model_validate(blood_req)

    def get_blood_requests(self, user_id: Optional[str] = None, status: Optional[str] = None, page: int = 1, size: int = 20) -> dict:
        query = self.db.query(BloodRequest)
        if user_id:
            query = query.filter(BloodRequest.requested_by == user_id)
        if status:
            query = query.filter(BloodRequest.status == status)
        query = query.order_by(BloodRequest.created_at.desc())
        total = query.count()
        requests = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [BloodRequestResponse.model_validate(r) for r in requests],
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # DONATION CAMPS
    # ============================================
    def get_donation_camps(self, status: Optional[str] = None, page: int = 1, size: int = 20) -> dict:
        query = self.db.query(BloodDonationCamp)
        if status:
            query = query.filter(BloodDonationCamp.status == status)
        query = query.order_by(BloodDonationCamp.camp_date)
        total = query.count()
        camps = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [BloodDonationCampResponse.model_validate(c) for c in camps],
            **build_pagination_meta(total, page, size),
        }

    def register_for_camp(self, user_id: str, camp_id: str) -> None:
        camp = self.db.query(BloodDonationCamp).filter(BloodDonationCamp.id == camp_id).first()
        if not camp:
            raise NotFoundException("Donation camp not found")

        donor = self.db.query(BloodDonor).filter(BloodDonor.user_id == user_id).first()
        if not donor:
            raise NotFoundException("You must register as a donor first")

        camp.registered_donors = (camp.registered_donors or 0) + 1
        self.db.commit()

    # ============================================
    # DONOR STATS
    # ============================================
    def get_donor_stats(self, user_id: str) -> DonorStatsResponse:
        donor = self.db.query(BloodDonor).filter(BloodDonor.user_id == user_id).first()
        if not donor:
            raise NotFoundException("Donor profile not found")

        return DonorStatsResponse(
            total_donations=donor.total_donations or 0,
            donated_units=donor.donated_units or 0,
            lives_saved=donor.lives_saved or 0,
            reward_points=donor.reward_points or 0,
            last_donation=str(donor.last_donation_date) if donor.last_donation_date else None,
            next_eligible=str(donor.next_eligible_date) if donor.next_eligible_date else None,
        )

    # ============================================
    # HELPER
    # ============================================
    def _build_donor_response(self, donor: BloodDonor, user: Optional[User]) -> DonorProfileResponse:
        return DonorProfileResponse(
            id=donor.id,
            user_id=donor.user_id,
            blood_group=donor.blood_group,
            age=donor.age,
            weight_kg=float(donor.weight_kg) if donor.weight_kg else None,
            gender=donor.gender,
            last_donation_date=donor.last_donation_date,
            total_donations=donor.total_donations or 0,
            next_eligible_date=donor.next_eligible_date,
            is_eligible=donor.is_eligible or True,
            is_available=donor.is_available or True,
            is_emergency_donor=donor.is_emergency_donor or False,
            status=donor.status,
            reward_points=donor.reward_points or 0,
            lives_saved=donor.lives_saved or 0,
            donated_units=donor.donated_units or 0,
            full_name=user.full_name if user else None,
            email=user.email if user else None,
            phone=user.phone if user else None,
            profile_image=user.profile_image if user else None,
        )
