"""Services package initialization"""
from app.services.auth_service import AuthService
from app.services.user_service import UserService
from app.services.doctor_service import DoctorService
from app.services.patient_service import PatientService
from app.services.hospital_service import HospitalService
from app.services.appointment_service import AppointmentService
from app.services.pharmacy_service import PharmacyService
from app.services.emergency_service import EmergencyService
from app.services.blood_donor_service import BloodDonorService
from app.services.oxygen_service import OxygenService
from app.services.women_health_service import WomenHealthService
from app.services.ai_service import AIService
from app.services.notification_service import NotificationService
from app.services.payment_service import PaymentService
from app.services.admin_service import AdminService
from app.services.realtime_service import RealtimeService, ConnectionManager, realtime_service, connection_manager

__all__ = [
    "AuthService", "UserService", "DoctorService", "PatientService",
    "HospitalService", "AppointmentService", "PharmacyService",
    "EmergencyService", "BloodDonorService", "OxygenService",
    "WomenHealthService", "AIService", "NotificationService",
    "PaymentService", "AdminService", "RealtimeService",
    "ConnectionManager", "realtime_service", "connection_manager"
]