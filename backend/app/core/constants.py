from enum import Enum


# ============================================
# USER ROLES
# ============================================
class UserRole(str, Enum):
    SUPER_ADMIN = "super_admin"
    ADMIN = "admin"
    ADMIN_APPLICANT = "admin_applicant"
    MODERATOR = "moderator"
    DOCTOR = "doctor"
    HOSPITAL = "hospital"
    HOSPITAL_ADMIN = "hospital_admin"
    PHARMACY = "pharmacy"
    PHARMACY_ADMIN = "pharmacy_admin"
    PATIENT = "patient"
    CLIENT = "client"
    BLOOD_DONOR = "blood_donor"
    EMERGENCY_VOLUNTEER = "emergency_volunteer"
    NORMAL_USER = "normal_user"


# ============================================
# GENDER
# ============================================
class Gender(str, Enum):
    MALE = "male"
    FEMALE = "female"
    OTHER = "other"
    PREFER_NOT_TO_SAY = "prefer-not-to-say"


# ============================================
# BLOOD GROUP
# ============================================
class BloodGroup(str, Enum):
    A_POS = "A+"
    A_NEG = "A-"
    B_POS = "B+"
    B_NEG = "B-"
    AB_POS = "AB+"
    AB_NEG = "AB-"
    O_POS = "O+"
    O_NEG = "O-"


# ============================================
# APPOINTMENT
# ============================================
class AppointmentType(str, Enum):
    CONSULTATION = "consultation"
    FOLLOW_UP = "follow-up"
    EMERGENCY = "emergency"
    CHECKUP = "checkup"
    SURGERY = "surgery"
    LAB_REVIEW = "lab-review"


class AppointmentStatus(str, Enum):
    SCHEDULED = "scheduled"
    CONFIRMED = "confirmed"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
    CANCELLED = "cancelled"
    RESCHEDULED = "rescheduled"
    NO_SHOW = "no-show"


class AppointmentLocation(str, Enum):
    IN_PERSON = "in-person"
    VIDEO = "video"
    PHONE = "phone"


class AppointmentPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


# ============================================
# DOCTOR
# ============================================
class DoctorStatus(str, Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    BUSY = "busy"


class DoctorNotificationType(str, Enum):
    APPOINTMENT = "appointment"
    EMERGENCY = "emergency"
    PRESCRIPTION = "prescription"
    REVIEW = "review"
    SYSTEM = "system"
    PATIENT = "patient"
    EARNINGS = "earnings"


# ============================================
# HOSPITAL
# ============================================
class HospitalType(str, Enum):
    GOVERNMENT = "government"
    PRIVATE = "private"
    CHARITABLE = "charitable"
    GENERAL = "general"
    MULTISPECIALTY = "multispecialty"
    COMMUNITY = "community"
    TEACHING = "teaching"
    SPECIALIZED = "specialized"


class BedType(str, Enum):
    GENERAL = "general"
    SEMI_PRIVATE = "semi-private"
    PRIVATE = "private"
    ICU = "icu"
    NICU = "nicu"
    PICU = "picu"
    CARDIAC_ICU = "cardiac-icu"
    EMERGENCY = "emergency"
    PEDIATRIC = "pediatric"
    MATERNITY = "maternity"


class BedStatus(str, Enum):
    AVAILABLE = "available"
    OCCUPIED = "occupied"
    RESERVED = "reserved"
    MAINTENANCE = "maintenance"
    CLEANING = "cleaning"


class EmergencyServiceStatus(str, Enum):
    ACTIVE = "active"
    BUSY = "busy"
    UNAVAILABLE = "unavailable"


# ============================================
# PHARMACY
# ============================================
class MedicineCategory(str, Enum):
    ANTIBIOTICS = "antibiotics"
    PAIN_RELIEF = "pain-relief"
    VITAMINS = "vitamins"
    CARDIAC = "cardiac"
    DIABETES = "diabetes"
    RESPIRATORY = "respiratory"
    DERMATOLOGY = "dermatology"
    PEDIATRIC = "pediatric"
    GYNECOLOGY = "gynecology"
    NEUROLOGY = "neurology"
    PSYCHIATRY = "psychiatry"
    OTHER = "other"


class MedicineForm(str, Enum):
    TABLET = "tablet"
    CAPSULE = "capsule"
    SYRUP = "syrup"
    INJECTION = "injection"
    CREAM = "cream"
    OINTMENT = "ointment"
    DROPS = "drops"
    INHALER = "inhaler"
    SPRAY = "spray"
    POWDER = "powder"
    GEL = "gel"
    OTHER = "other"


class OrderStatus(str, Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    PROCESSING = "processing"
    PACKED = "packed"
    SHIPPED = "shipped"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"
    REFUNDED = "refunded"


class DeliveryStatus(str, Enum):
    PENDING = "pending"
    ASSIGNED = "assigned"
    PICKED_UP = "picked-up"
    IN_TRANSIT = "in-transit"
    DELIVERED = "delivered"
    FAILED = "failed"


class PaymentMethod(str, Enum):
    CASH = "cash"
    CARD = "card"
    ONLINE = "online"
    INSURANCE = "insurance"


class PaymentStatus(str, Enum):
    PENDING = "pending"
    PAID = "paid"
    REFUNDED = "refunded"
    FAILED = "failed"
    UNPAID = "unpaid"


# ============================================
# EMERGENCY
# ============================================
class EmergencyServiceType(str, Enum):
    AMBULANCE = "ambulance"
    BLOOD = "blood"
    OXYGEN = "oxygen"
    DOCTOR = "doctor"
    EMERGENCY_ROOM = "emergency-room"
    HELICOPTER = "helicopter"


class EmergencyServiceStatus(str, Enum):
    AVAILABLE = "available"
    BUSY = "busy"
    DISPATCHED = "dispatched"
    OFFLINE = "offline"
    MAINTENANCE = "maintenance"


class EmergencyPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class EmergencyRequestStatus(str, Enum):
    PENDING = "pending"
    DISPATCHED = "dispatched"
    EN_ROUTE = "en-route"
    ARRIVED = "arrived"
    COMPLETED = "completed"
    CANCELLED = "cancelled"


# ============================================
# BLOOD DONATION
# ============================================
class DonationType(str, Enum):
    WHOLE_BLOOD = "whole-blood"
    PLASMA = "plasma"
    PLATELETS = "platelets"
    DOUBLE_RED_CELLS = "double-red-cells"


class DonorStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    BLOCKED = "blocked"
    ACTIVE = "active"
    INACTIVE = "inactive"
    TEMPORARY_DEFERRED = "temporary-deferred"
    PERMANENT_DEFERRED = "permanent-deferred"


class BloodRequestStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    PROCESSING = "processing"
    FULFILLED = "fulfilled"
    REJECTED = "rejected"
    CANCELLED = "cancelled"


class BloodRequestUrgency(str, Enum):
    NORMAL = "normal"
    URGENT = "urgent"
    EMERGENCY = "emergency"


# ============================================
# WOMEN'S HEALTH
# ============================================
class MenstrualFlowIntensity(str, Enum):
    LIGHT = "light"
    MEDIUM = "medium"
    HEAVY = "heavy"
    VERY_HEAVY = "very_heavy"


class PregnancyTrimester(str, Enum):
    FIRST = "first"
    SECOND = "second"
    THIRD = "third"


class PregnancyStatus(str, Enum):
    ACTIVE = "active"
    ONGOING = "ongoing"
    COMPLETED = "completed"
    MISCARRIAGE = "miscarriage"
    TERMINATED = "terminated"
    HIGH_RISK = "high-risk"


class BabyGender(str, Enum):
    BOY = "boy"
    GIRL = "girl"
    UNKNOWN = "unknown"


class VaccineStatus(str, Enum):
    SCHEDULED = "scheduled"
    COMPLETED = "completed"
    MISSED = "missed"
    DELAYED = "delayed"


# ============================================
# VERIFICATION
# ============================================
class VerificationEntityType(str, Enum):
    DOCTOR = "doctor"
    HOSPITAL = "hospital"
    PHARMACY = "pharmacy"
    BLOOD_DONOR = "blood_donor"


class VerificationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    MORE_INFO = "more-info"


# ============================================
# REVIEW & FEEDBACK
# ============================================
class ReviewableType(str, Enum):
    DOCTOR = "doctor"
    HOSPITAL = "hospital"
    PHARMACY = "pharmacy"
    MEDICINE = "medicine"


class FeedbackType(str, Enum):
    COMPLAINT = "complaint"
    SUGGESTION = "suggestion"
    REVIEW = "review"
    BUG_REPORT = "bug-report"


class FeedbackStatus(str, Enum):
    PENDING = "pending"
    REVIEWED = "reviewed"
    RESOLVED = "resolved"
    CLOSED = "closed"


class FeedbackPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


# ============================================
# MESSAGING
# ============================================
class MessageType(str, Enum):
    TEXT = "text"
    IMAGE = "image"
    FILE = "file"
    SYSTEM = "system"
    VOICE = "voice"


class NotificationPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    URGENT = "urgent"


# ============================================
# PROFILE UPGRADE
# ============================================
class ProfileUpgrade(str, Enum):
    CLIENT_PATIENT = "client_patient"
    BLOOD_DONOR = "blood_donor"
    PHARMACY_USER = "pharmacy_user"
    EMERGENCY_VOLUNTEER = "emergency_volunteer"


# ============================================
# MEDICATION TIMING
# ============================================
class MedicationTiming(str, Enum):
    BEFORE_FOOD = "before-food"
    AFTER_FOOD = "after-food"
    WITH_FOOD = "with-food"
    EMPTY_STOMACH = "empty-stomach"


# ============================================
# PRESCRIPTION
# ============================================
class PrescriptionStatus(str, Enum):
    ACTIVE = "active"
    COMPLETED = "completed"
    EXPIRED = "expired"


# ============================================
# OXYGEN
# ============================================
class OxygenStockStatus(str, Enum):
    SUFFICIENT = "sufficient"
    LOW = "low"
    CRITICAL = "critical"
    OUT_OF_STOCK = "out-of-stock"


class OxygenRequestStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    DISPATCHED = "dispatched"
    DELIVERED = "delivered"
    CANCELLED = "cancelled"


# ============================================
# AI ASSISTANT
# ============================================
class AIMessageRole(str, Enum):
    USER = "user"
    ASSISTANT = "assistant"
    SYSTEM = "system"


class AIEmotion(str, Enum):
    HAPPY = "happy"
    NEUTRAL = "neutral"
    CONCERNED = "concerned"
    EXCITED = "excited"


class AIConversationStatus(str, Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"
    DELETED = "deleted"
