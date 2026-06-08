from sqlalchemy.orm import Session
from sqlalchemy import or_, func, case
from typing import Optional, List
from datetime import date, datetime

from ..models.hospital import (
    Hospital, HospitalDepartment, HospitalDoctor, HospitalBed,
    HospitalBloodBank, HospitalBloodStock, HospitalOxygenStock,
    HospitalAmbulance, HospitalActivity,
)
from ..models.doctor import DoctorProfile
from ..models.user import User
from ..schemas.hospital import (
    HospitalResponse, HospitalListItemResponse, HospitalUpdateRequest,
    HospitalDashboardResponse, HospitalDoctorResponse,
    HospitalDoctorCreateRequest, HospitalDepartmentResponse,
    HospitalDepartmentCreateRequest, HospitalBedResponse,
    BedBookingRequest, BloodStockResponse, BloodStockUpdateRequest,
    OxygenStockResponse, OxygenStockUpdateRequest,
    AmbulanceResponse, AmbulanceStatusUpdateRequest,
    AmbulanceCreateRequest, HospitalStatsResponse,
)
from ..core.exceptions import NotFoundException, ConflictException, BadRequestException
from ..utils.helpers import build_pagination_meta


class HospitalService:
    """Handles all hospital-related business logic."""

    def __init__(self, db: Session):
        self.db = db

    # ============================================
    # GET HOSPITAL BY USER ID (for hospital admins)
    # ============================================
    def get_hospital_by_user_id(self, user_id: str) -> Hospital:
        hospital = self.db.query(Hospital).filter(Hospital.admin_user_id == user_id).first()
        if not hospital:
            raise NotFoundException("Hospital profile not found")
        return hospital

    # ============================================
    # LIST HOSPITALS (public)
    # ============================================
    def list_hospitals(
        self, page: int = 1, size: int = 20,
        search: Optional[str] = None, city: Optional[str] = None,
        state: Optional[str] = None, hospital_type: Optional[str] = None,
        is_verified: Optional[bool] = None,
        sort_by: str = "rating", sort_order: str = "desc",
    ) -> dict:
        query = self.db.query(Hospital).filter(Hospital.is_active == True)

        if search:
            search_term = f"%{search}%"
            query = query.filter(
                or_(
                    Hospital.name.ilike(search_term),
                    Hospital.city.ilike(search_term),
                    Hospital.state.ilike(search_term),
                    Hospital.street.ilike(search_term),
                )
            )
        if city:
            query = query.filter(Hospital.city.ilike(f"%{city}%"))
        if state:
            query = query.filter(Hospital.state.ilike(f"%{state}%"))
        if hospital_type:
            query = query.filter(Hospital.type == hospital_type)
        if is_verified is not None:
            query = query.filter(Hospital.is_verified == is_verified)

        # Sorting
        sort_map = {
            "rating": Hospital.rating,
            "name": Hospital.name,
            "available_beds": Hospital.available_beds,
            "created_at": Hospital.created_at,
        }
        sort_col = sort_map.get(sort_by, Hospital.rating)
        if sort_order == "desc":
            query = query.order_by(sort_col.desc())
        else:
            query = query.order_by(sort_col.asc())

        total = query.count()
        hospitals = query.offset((page - 1) * size).limit(size).all()

        items = [HospitalListItemResponse.model_validate(h) for h in hospitals]
        return {
            "items": items,
            **build_pagination_meta(total, page, size),
        }

    # ============================================
    # GET HOSPITAL BY ID (public)
    # ============================================
    def get_hospital_by_id(self, hospital_id: str) -> HospitalResponse:
        hospital = self.db.query(Hospital).filter(Hospital.id == hospital_id).first()
        if not hospital:
            raise NotFoundException("Hospital not found")
        return HospitalResponse.model_validate(hospital)

    # ============================================
    # GET HOSPITAL PROFILE (for authenticated hospital admin)
    # ============================================
    def get_hospital_profile(self, user_id: str) -> HospitalResponse:
        hospital = self.get_hospital_by_user_id(user_id)
        return HospitalResponse.model_validate(hospital)

    # ============================================
    # UPDATE HOSPITAL PROFILE
    # ============================================
    def update_hospital_profile(self, user_id: str, data: HospitalUpdateRequest) -> HospitalResponse:
        hospital = self.get_hospital_by_user_id(user_id)
        update_fields = data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(hospital, field, value)
        self.db.commit()
        self.db.refresh(hospital)
        return HospitalResponse.model_validate(hospital)

    # ============================================
    # HOSPITAL DASHBOARD
    # ============================================
    def get_dashboard(self, user_id: str) -> HospitalDashboardResponse:
        hospital = self.get_hospital_by_user_id(user_id)

        # Blood bank status
        blood_bank = self.db.query(HospitalBloodBank).filter(
            HospitalBloodBank.hospital_id == hospital.id
        ).first()

        # Oxygen status
        oxygen = self.db.query(HospitalOxygenStock).filter(
            HospitalOxygenStock.hospital_id == hospital.id
        ).first()

        # Recent activities
        activities = self.db.query(HospitalActivity).filter(
            HospitalActivity.hospital_id == hospital.id
        ).order_by(HospitalActivity.created_at.desc()).limit(10).all()

        return HospitalDashboardResponse(
            hospital={
                "id": hospital.id,
                "name": hospital.name,
                "type": hospital.type,
                "city": hospital.city,
                "rating": float(hospital.rating or 0),
                "is_verified": hospital.is_verified,
            },
            total_beds=hospital.total_beds or 0,
            available_beds=hospital.available_beds or 0,
            icu_beds=hospital.icu_total_beds or 0,
            icu_available=hospital.icu_available_beds or 0,
            total_doctors=hospital.total_doctors or 0,
            total_patients=0,
            ambulance_count=hospital.ambulance_count or 0,
            ambulance_available=hospital.ambulance_available or 0,
            blood_bank_available=blood_bank.is_available if blood_bank else False,
            oxygen_status=oxygen.status if oxygen else None,
            recent_activities=[
                {
                    "id": a.id,
                    "type": a.type,
                    "description": a.description,
                    "department": a.department,
                    "created_at": str(a.created_at) if a.created_at else None,
                }
                for a in activities
            ],
        )

    # ============================================
    # HOSPITAL DOCTORS
    # ============================================
    def get_hospital_doctors(self, user_id: str, page: int = 1, size: int = 20) -> dict:
        hospital = self.get_hospital_by_user_id(user_id)
        query = (
            self.db.query(HospitalDoctor, DoctorProfile, User)
            .join(DoctorProfile, DoctorProfile.id == HospitalDoctor.doctor_id)
            .join(User, User.id == DoctorProfile.user_id)
            .filter(HospitalDoctor.hospital_id == hospital.id, HospitalDoctor.is_active == True)
        )

        total = query.count()
        results = query.offset((page - 1) * size).limit(size).all()

        items = []
        for hd, doc, user in results:
            items.append(HospitalDoctorResponse(
                id=hd.id,
                hospital_id=hd.hospital_id,
                doctor_id=hd.doctor_id,
                department_id=hd.department_id,
                designation=hd.designation,
                joining_date=hd.joining_date,
                is_active=hd.is_active,
                full_name=user.full_name,
                specialization=doc.specialization,
                profile_image=doc.profile_image or user.profile_image,
                status=doc.status,
            ))

        return {
            "items": items,
            **build_pagination_meta(total, page, size),
        }

    def add_hospital_doctor(self, user_id: str, data: HospitalDoctorCreateRequest) -> HospitalDoctorResponse:
        hospital = self.get_hospital_by_user_id(user_id)

        # Check if doctor already affiliated
        existing = self.db.query(HospitalDoctor).filter(
            HospitalDoctor.hospital_id == hospital.id,
            HospitalDoctor.doctor_id == data.doctor_id,
        ).first()
        if existing:
            raise ConflictException("Doctor is already affiliated with this hospital")

        hd = HospitalDoctor(
            hospital_id=hospital.id,
            doctor_id=data.doctor_id,
            department_id=data.department_id,
            designation=data.designation,
            is_active=True,
        )
        self.db.add(hd)

        # Update hospital doctor count
        hospital.total_doctors = (hospital.total_doctors or 0) + 1
        self.db.commit()
        self.db.refresh(hd)

        return HospitalDoctorResponse(
            id=hd.id, hospital_id=hd.hospital_id, doctor_id=hd.doctor_id,
            department_id=hd.department_id, designation=hd.designation,
            is_active=hd.is_active,
        )

    def remove_hospital_doctor(self, user_id: str, doctor_id: str) -> None:
        hospital = self.get_hospital_by_user_id(user_id)
        hd = self.db.query(HospitalDoctor).filter(
            HospitalDoctor.hospital_id == hospital.id,
            HospitalDoctor.doctor_id == doctor_id,
        ).first()
        if not hd:
            raise NotFoundException("Hospital doctor not found")
        hd.is_active = False
        hospital.total_doctors = max((hospital.total_doctors or 0) - 1, 0)
        self.db.commit()

    # ============================================
    # DEPARTMENTS
    # ============================================
    def get_departments(self, user_id: str) -> List[HospitalDepartmentResponse]:
        hospital = self.get_hospital_by_user_id(user_id)
        departments = self.db.query(HospitalDepartment).filter(
            HospitalDepartment.hospital_id == hospital.id,
            HospitalDepartment.is_active == True,
        ).all()
        return [HospitalDepartmentResponse.model_validate(d) for d in departments]

    def add_department(self, user_id: str, data: HospitalDepartmentCreateRequest) -> HospitalDepartmentResponse:
        hospital = self.get_hospital_by_user_id(user_id)
        dept = HospitalDepartment(
            hospital_id=hospital.id,
            name=data.name,
            description=data.description,
            head_doctor_id=data.head_doctor_id,
            total_beds=data.total_beds or 0,
            available_beds=data.total_beds or 0,
        )
        self.db.add(dept)
        self.db.commit()
        self.db.refresh(dept)
        return HospitalDepartmentResponse.model_validate(dept)

    # ============================================
    # BEDS
    # ============================================
    def get_beds(
        self, user_id: str, bed_type: Optional[str] = None,
        status: Optional[str] = None, page: int = 1, size: int = 50,
    ) -> dict:
        hospital = self.get_hospital_by_user_id(user_id)
        query = self.db.query(HospitalBed).filter(HospitalBed.hospital_id == hospital.id)

        if bed_type:
            query = query.filter(HospitalBed.bed_type == bed_type)
        if status:
            query = query.filter(HospitalBed.status == status)

        total = query.count()
        beds = query.offset((page - 1) * size).limit(size).all()

        return {
            "items": [HospitalBedResponse.model_validate(b) for b in beds],
            **build_pagination_meta(total, page, size),
        }

    def get_beds_by_type_summary(self, user_id: str) -> List[dict]:
        hospital = self.get_hospital_by_user_id(user_id)
        results = (
            self.db.query(
                HospitalBed.bed_type,
                func.count(HospitalBed.id).label("total"),
                func.sum(case((HospitalBed.status == "available", 1), else_=0)).label("available"),
            )
            .filter(HospitalBed.hospital_id == hospital.id)
            .group_by(HospitalBed.bed_type)
            .all()
        )
        return [
            {
                "type": r[0],
                "total": r[1],
                "occupied": r[1] - r[2],
                "available": r[2],
            }
            for r in results
        ]

    # ============================================
    # BLOOD BANK
    # ============================================
    def get_blood_bank(self, user_id: str) -> dict:
        hospital = self.get_hospital_by_user_id(user_id)
        blood_bank = self.db.query(HospitalBloodBank).filter(
            HospitalBloodBank.hospital_id == hospital.id
        ).first()

        if not blood_bank:
            return {"blood_bank": None, "stocks": []}

        stocks = self.db.query(HospitalBloodStock).filter(
            HospitalBloodStock.blood_bank_id == blood_bank.id
        ).all()

        return {
            "blood_bank": {
                "id": blood_bank.id,
                "is_available": blood_bank.is_available,
                "total_units": blood_bank.total_units,
                "expiry_alerts": blood_bank.expiry_alerts,
            },
            "stocks": [BloodStockResponse.model_validate(s) for s in stocks],
        }

    def get_blood_stock(self, user_id: str) -> List[BloodStockResponse]:
        hospital = self.get_hospital_by_user_id(user_id)
        blood_bank = self.db.query(HospitalBloodBank).filter(
            HospitalBloodBank.hospital_id == hospital.id
        ).first()
        if not blood_bank:
            return []
        stocks = self.db.query(HospitalBloodStock).filter(
            HospitalBloodStock.blood_bank_id == blood_bank.id
        ).all()
        return [BloodStockResponse.model_validate(s) for s in stocks]

    def update_blood_stock(self, user_id: str, data: BloodStockUpdateRequest) -> BloodStockResponse:
        hospital = self.get_hospital_by_user_id(user_id)
        blood_bank = self.db.query(HospitalBloodBank).filter(
            HospitalBloodBank.hospital_id == hospital.id
        ).first()
        if not blood_bank:
            raise NotFoundException("Blood bank not found for this hospital")

        stock = self.db.query(HospitalBloodStock).filter(
            HospitalBloodStock.blood_bank_id == blood_bank.id,
            HospitalBloodStock.blood_group == data.blood_group,
        ).first()

        if stock:
            stock.units = data.units
            # Update status based on units
            if data.units == 0:
                stock.status = "out-of-stock"
            elif data.units < 5:
                stock.status = "critical"
            elif data.units < 10:
                stock.status = "low"
            else:
                stock.status = "sufficient"
        else:
            stock = HospitalBloodStock(
                blood_bank_id=blood_bank.id,
                blood_group=data.blood_group,
                units=data.units,
                status="sufficient" if data.units >= 10 else "low",
            )
            self.db.add(stock)

        # Update blood bank total
        total = self.db.query(func.sum(HospitalBloodStock.units)).filter(
            HospitalBloodStock.blood_bank_id == blood_bank.id
        ).scalar() or 0
        blood_bank.total_units = total

        self.db.commit()
        self.db.refresh(stock)
        return BloodStockResponse.model_validate(stock)

    # ============================================
    # OXYGEN
    # ============================================
    def get_oxygen_stock(self, user_id: str) -> Optional[OxygenStockResponse]:
        hospital = self.get_hospital_by_user_id(user_id)
        oxygen = self.db.query(HospitalOxygenStock).filter(
            HospitalOxygenStock.hospital_id == hospital.id
        ).first()
        if not oxygen:
            return None
        return OxygenStockResponse.model_validate(oxygen)

    def update_oxygen_stock(self, user_id: str, data: OxygenStockUpdateRequest) -> OxygenStockResponse:
        hospital = self.get_hospital_by_user_id(user_id)
        oxygen = self.db.query(HospitalOxygenStock).filter(
            HospitalOxygenStock.hospital_id == hospital.id
        ).first()

        if not oxygen:
            oxygen = HospitalOxygenStock(hospital_id=hospital.id)
            self.db.add(oxygen)
            self.db.flush()

        update_fields = data.model_dump(exclude_unset=True)
        for field, value in update_fields.items():
            setattr(oxygen, field, value)

        # Auto-update status
        available = oxygen.available_cylinders or 0
        total = oxygen.total_cylinders or 1
        if available == 0:
            oxygen.status = "out-of-stock"
        elif available / total < 0.1:
            oxygen.status = "critical"
        elif available / total < 0.3:
            oxygen.status = "low"
        else:
            oxygen.status = "sufficient"

        self.db.commit()
        self.db.refresh(oxygen)
        return OxygenStockResponse.model_validate(oxygen)

    # ============================================
    # AMBULANCES
    # ============================================
    def get_ambulances(self, user_id: str) -> List[AmbulanceResponse]:
        hospital = self.get_hospital_by_user_id(user_id)
        ambulances = self.db.query(HospitalAmbulance).filter(
            HospitalAmbulance.hospital_id == hospital.id
        ).all()
        return [AmbulanceResponse.model_validate(a) for a in ambulances]

    def add_ambulance(self, user_id: str, data: AmbulanceCreateRequest) -> AmbulanceResponse:
        hospital = self.get_hospital_by_user_id(user_id)
        ambulance = HospitalAmbulance(
            hospital_id=hospital.id,
            vehicle_number=data.vehicle_number,
            type=data.type,
            driver_name=data.driver_name,
            driver_phone=data.driver_phone,
            status="available",
        )
        self.db.add(ambulance)
        hospital.ambulance_count = (hospital.ambulance_count or 0) + 1
        hospital.ambulance_available = (hospital.ambulance_available or 0) + 1
        self.db.commit()
        self.db.refresh(ambulance)
        return AmbulanceResponse.model_validate(ambulance)

    def update_ambulance_status(self, user_id: str, ambulance_id: str, status: str) -> None:
        hospital = self.get_hospital_by_user_id(user_id)
        ambulance = self.db.query(HospitalAmbulance).filter(
            HospitalAmbulance.id == ambulance_id,
            HospitalAmbulance.hospital_id == hospital.id,
        ).first()
        if not ambulance:
            raise NotFoundException("Ambulance not found")

        old_status = ambulance.status
        ambulance.status = status

        # Update availability counts
        if old_status == "available" and status != "available":
            hospital.ambulance_available = max((hospital.ambulance_available or 0) - 1, 0)
        elif old_status != "available" and status == "available":
            hospital.ambulance_available = (hospital.ambulance_available or 0) + 1

        self.db.commit()

    # ============================================
    # HOSPITAL STATS (public)
    # ============================================
    def get_hospital_stats(self) -> HospitalStatsResponse:
        total = self.db.query(Hospital).filter(Hospital.is_active == True).count()
        total_beds = self.db.query(func.sum(Hospital.total_beds)).filter(
            Hospital.is_active == True
        ).scalar() or 0
        available_beds = self.db.query(func.sum(Hospital.available_beds)).filter(
            Hospital.is_active == True
        ).scalar() or 0
        icu_beds = self.db.query(func.sum(Hospital.icu_total_beds)).filter(
            Hospital.is_active == True
        ).scalar() or 0
        available_icu = self.db.query(func.sum(Hospital.icu_available_beds)).filter(
            Hospital.is_active == True
        ).scalar() or 0

        return HospitalStatsResponse(
            total_hospitals=total,
            total_beds=total_beds,
            available_beds=available_beds,
            icu_beds=icu_beds,
            available_icu_beds=available_icu,
        )
