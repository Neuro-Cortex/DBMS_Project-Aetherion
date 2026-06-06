# ============================================
# MODELS PACKAGE — Import all ORM models
# This ensures Alembic and SQLAlchemy metadata discovery works.
# ============================================

from .user import (
    Role, User, UserSession, UserRole, UserRoleUpgrade,
    UserProfile, UserAddress, UserEmergencyContact,
    UserNotificationSetting, UserDocument, PasswordReset, UserPreference,
)
from .doctor import (
    DoctorProfile, DoctorAvailability, DoctorEarning,
    DoctorPatient, DoctorNotification, DoctorActivity,
)
from .hospital import (
    Hospital, HospitalDepartment, HospitalDoctor, HospitalBed,
    HospitalBloodBank, HospitalBloodStock, HospitalOxygenStock,
    HospitalAmbulance, HospitalActivity,
)
from .pharmacy import (
    Pharmacy, PharmacyInventory, MedicineOrder, OrderItem,
    StockAlert, DeliveryTracking,
)
from .appointment import (
    Appointment, Prescription, PrescriptionItem, PrescriptionTest,
)
from .blood_donation import (
    BloodDonor, BloodDonation, BloodRequest, BloodDonationCamp,
    DonorReward, DonorDocument, DonationReminder,
)
from .patient import (
    PatientHealthRecord, PatientVaccination, PatientMedication,
    PatientMedicalHistory, PatientSurgery,
)
from .women_health import (
    WomenMenstrualCycle, WomenPregnancy, WomenPregnancyTracking,
    BabyVaccine, BabyVaccineRecord, BabyGrowthRecord,
    BabyHealthRecord, GynecologistConsultation,
)
from .admin import AdminUser, VerificationRequest
from .messaging import Message, Notification
from .review import UserReview, Feedback
from .ai_assistant import AIConversation, AIMessage, AIVoiceSession
from .emergency import EmergencyService, EmergencyRequest
from .oxygen import OxygenStock, OxygenCenter, OxygenRequest, OxygenAlert
from .search import SearchLog, AuditLog, SecurityLog


__all__ = [
    # Auth & Users
    "Role", "User", "UserSession", "UserRole", "UserRoleUpgrade",
    "UserProfile", "UserAddress", "UserEmergencyContact",
    "UserNotificationSetting", "UserDocument", "PasswordReset", "UserPreference",
    # Doctor
    "DoctorProfile", "DoctorAvailability", "DoctorEarning",
    "DoctorPatient", "DoctorNotification", "DoctorActivity",
    # Hospital
    "Hospital", "HospitalDepartment", "HospitalDoctor", "HospitalBed",
    "HospitalBloodBank", "HospitalBloodStock", "HospitalOxygenStock",
    "HospitalAmbulance", "HospitalActivity",
    # Pharmacy
    "Pharmacy", "PharmacyInventory", "MedicineOrder", "OrderItem",
    "StockAlert", "DeliveryTracking",
    # Appointment
    "Appointment", "Prescription", "PrescriptionItem", "PrescriptionTest",
    # Blood Donation
    "BloodDonor", "BloodDonation", "BloodRequest", "BloodDonationCamp",
    "DonorReward", "DonorDocument", "DonationReminder",
    # Patient
    "PatientHealthRecord", "PatientVaccination", "PatientMedication",
    "PatientMedicalHistory", "PatientSurgery",
    # Women's Health
    "WomenMenstrualCycle", "WomenPregnancy", "WomenPregnancyTracking",
    "BabyVaccine", "BabyVaccineRecord", "BabyGrowthRecord",
    "BabyHealthRecord", "GynecologistConsultation",
    # Admin
    "AdminUser", "VerificationRequest",
    # Messaging
    "Message", "Notification",
    # Reviews
    "UserReview", "Feedback",
    # AI
    "AIConversation", "AIMessage", "AIVoiceSession",
    # Emergency
    "EmergencyService", "EmergencyRequest",
    # Oxygen
    "OxygenStock", "OxygenCenter", "OxygenRequest", "OxygenAlert",
    # Search & Audit
    "SearchLog", "AuditLog", "SecurityLog",
]
