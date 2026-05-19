"""
Models package initialization
Import all models here for Alembic to detect
"""
from app.models.base import (
    Base, TimestampMixin, SoftDeleteMixin, UUIDMixin,
    UserRole, Gender, AccountStatus, BloodGroup,
    AppointmentStatus, EmergencySeverity, PaymentStatus,
    MedicineForm, PrescriptionStatus, VaccineStatus,
    OrderStatus, ConsultationType, DaysOfWeek
)
from app.models.user import User
from app.models.doctor import (
    DoctorProfile, DoctorSchedule, ScheduleException,
    DoctorHospitalAffiliation
)
from app.models.patient import (
    PatientProfile, PatientVitals, VaccinationRecord, MedicalRecord
)
from app.models.hospital import (
    HospitalProfile, HospitalDepartment, BloodStock
)
from app.models.appointment import (
    Appointment, Prescription, PrescriptionMedicine, PrescribedTest
)
from app.models.pharmacy import (
    PharmacyProfile, Medicine, PharmacyInventory,
    MedicineOrder, OrderItem
)
from app.models.emergency import (
    EmergencyRequest, Ambulance, SOSAlert,
    EmergencyContact, EmergencyVolunteer
)
from app.models.blood_donor import (
    BloodDonorProfile, BloodDonation, DonorReward, BloodRequest
)
from app.models.oxygen import (
    OxygenStock, OxygenRequest, OxygenSupplier
)
from app.models.women_health import (
    WomenHealthProfile, PregnancyRecord, PregnancyAppointment,
    MenstrualLog, GynecologistVisit, BabyRecord
)
from app.models.notification import (
    Notification, NotificationTemplate, PushNotificationToken
)
from app.models.review import Review
from app.models.payment import Payment, PaymentMethod, InsuranceClaim

__all__ = [
    "Base", "TimestampMixin", "SoftDeleteMixin", "UUIDMixin",
    "UserRole", "Gender", "AccountStatus", "BloodGroup",
    "AppointmentStatus", "EmergencySeverity", "PaymentStatus",
    "MedicineForm", "PrescriptionStatus", "VaccineStatus",
    "OrderStatus", "ConsultationType", "DaysOfWeek",
    "User", "DoctorProfile", "DoctorSchedule", "ScheduleException",
    "DoctorHospitalAffiliation", "PatientProfile", "PatientVitals",
    "VaccinationRecord", "MedicalRecord", "HospitalProfile",
    "HospitalDepartment", "BloodStock", "Appointment", "Prescription",
    "PrescriptionMedicine", "PrescribedTest", "PharmacyProfile",
    "Medicine", "PharmacyInventory", "MedicineOrder", "OrderItem",
    "EmergencyRequest", "Ambulance", "SOSAlert", "EmergencyContact",
    "EmergencyVolunteer", "BloodDonorProfile", "BloodDonation",
    "DonorReward", "BloodRequest", "OxygenStock", "OxygenRequest",
    "OxygenSupplier", "WomenHealthProfile", "PregnancyRecord",
    "PregnancyAppointment", "MenstrualLog", "GynecologistVisit",
    "BabyRecord", "Notification", "NotificationTemplate",
    "PushNotificationToken", "Review", "Payment", "PaymentMethod",
    "InsuranceClaim"
]