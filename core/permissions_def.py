"""
Aetherion Healthcare - Role & Permission Definitions
====================================================
Comprehensive RBAC system for multi-role healthcare ecosystem.

Roles:
  - patient: End-users seeking healthcare services
  - doctor: Medical professionals treating patients
  - hospital: Healthcare facility administrators
  - pharmacy: Pharmacy management
  - admin: Platform administrators
  - authority: Regulatory/audit/compliance officers

Permissions define WHAT a role can do (granular actions)
Features define WHICH UI modules a role can see (high-level access)
"""

from enum import Enum
from typing import List, Dict, Set, Optional
from pydantic import BaseModel, Field


# ============================================
# ROLE ENUMERATION
# ============================================
class Role(str, Enum):
    """All system roles with hierarchical levels."""

    # Level 1: Basic Users
    PATIENT = "patient"
    BLOOD_DONOR = "blood_donor"
    EMERGENCY_VOLUNTEER = "emergency_volunteer"

    # Level 2: Healthcare Providers
    DOCTOR = "doctor"
    HOSPITAL_ADMIN = "hospital_admin"
    PHARMACY_ADMIN = "pharmacy_admin"

    # Level 3: Platform Management
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"

    # Level 4: Authority/Regulation
    AUTHORITY = "authority"  # Regulator, auditor, compliance officer


# ============================================
# PERMISSION DEFINITIONS
# ============================================
class Permission(str, Enum):
    """Granular permissions for all system actions."""

    # ==================== PATIENT MODULE ====================
    # Personal
    PATIENT_VIEW_PROFILE = "patient.view_profile"
    PATIENT_UPDATE_PROFILE = "patient.update_profile"
    PATIENT_VIEW_MEDICAL_RECORDS = "patient.view_medical_records"
    PATIENT_UPLOAD_DOCUMENTS = "patient.upload_documents"

    # Appointments
    APPOINTMENT_VIEW = "appointment.view"
    APPOINTMENT_BOOK = "appointment.book"
    APPOINTMENT_CANCEL = "appointment.cancel"
    APPOINTMENT_RESCHEDULE = "appointment.reschedule"
    APPOINTMENT_VIEW_HISTORY = "appointment.view_history"

    # Prescriptions
    PRESCRIPTION_VIEW = "prescription.view"
    PRESCRIPTION_DOWNLOAD = "prescription.download"

    # ==================== DOCTOR MODULE ====================
    # Patients
    DOCTOR_VIEW_PATIENTS = "doctor.view_patients"
    DOCTOR_VIEW_PATIENT_DETAILS = "doctor.view_patient_details"
    DOCTOR_SEARCH_PATIENTS = "doctor.search_patients"

    # Medical Records
    DOCTOR_VIEW_MEDICAL_RECORDS = "doctor.view_medical_records"
    DOCTOR_WRITE_MEDICAL_RECORDS = "doctor.write_medical_records"
    DOCTOR_UPDATE_MEDICAL_RECORDS = "doctor.update_medical_records"

    # Prescriptions
    DOCTOR_WRITE_PRESCRIPTION = "doctor.write_prescription"
    DOCTOR_UPDATE_PRESCRIPTION = "doctor.update_prescription"
    DOCTOR_REVOKE_PRESCRIPTION = "doctor.revoke_prescription"

    # Appointments
    DOCTOR_MANAGE_APPOINTMENTS = "doctor.manage_appointments"
    DOCTOR_VIEW_APPOINTMENTS = "doctor.view_appointments"
    DOCTOR_ACCEPT_APPOINTMENT = "doctor.accept_appointment"
    DOCTOR_REJECT_APPOINTMENT = "doctor.reject_appointment"

    # Consultation
    DOCTOR_START_CONSULTATION = "doctor.start_consultation"
    DOCTOR_END_CONSULTATION = "doctor.end_consultation"
    DOCTOR_DIAGNOSE = "doctor.diagnose"

    # ==================== HOSPITAL MODULE ====================
    # Dashboard
    HOSPITAL_VIEW_DASHBOARD = "hospital.view_dashboard"
    HOSPITAL_VIEW_STATISTICS = "hospital.view_statistics"
    HOSPITAL_VIEW_ANALYTICS = "hospital.view_analytics"

    # Beds
    HOSPITAL_MANAGE_BEDS = "hospital.manage_beds"
    HOSPITAL_ALLOCATE_BED = "hospital.allocate_bed"
    HOSPITAL_RELEASE_BED = "hospital.release_bed"
    HOSPITAL_VIEW_BED_STATUS = "hospital.view_bed_status"

    # ICU
    HOSPITAL_MANAGE_ICU = "hospital.manage_icu"
    HOSPITAL_VIEW_ICU_STATUS = "hospital.view_icu_status"
    HOSPITAL_MANAGE_VENTILATORS = "hospital.manage_ventilators"

    # Staff
    HOSPITAL_MANAGE_DOCTORS = "hospital.manage_doctors"
    HOSPITAL_MANAGE_NURSES = "hospital.manage_nurses"
    HOSPITAL_MANAGE_STAFF = "hospital.manage_staff"
    HOSPITAL_ASSIGN_STAFF = "hospital.assign_staff"

    # Emergency
    HOSPITAL_MANAGE_EMERGENCY_QUEUE = "hospital.manage_emergency_queue"
    HOSPITAL_VIEW_EMERGENCY_REQUESTS = "hospital.view_emergency_requests"

    # Blood Bank
    HOSPITAL_MANAGE_BLOOD_BANK = "hospital.manage_blood_bank"
    HOSPITAL_VIEW_BLOOD_INVENTORY = "hospital.view_blood_inventory"

    # Departments
    HOSPITAL_MANAGE_DEPARTMENTS = "hospital.manage_departments"
    HOSPITAL_VIEW_DEPARTMENT_STATS = "hospital.view_department_stats"

    # ==================== PHARMACY MODULE ====================
    # Inventory
    PHARMACY_VIEW_INVENTORY = "pharmacy.view_inventory"
    PHARMACY_MANAGE_INVENTORY = "pharmacy.manage_inventory"
    PHARMACY_ADD_MEDICINE = "pharmacy.add_medicine"
    PHARMACY_UPDATE_MEDICINE = "pharmacy.update_medicine"
    PHARMACY_DELETE_MEDICINE = "pharmacy.delete_medicine"
    PHARMACY_VIEW_STOCK_ALERTS = "pharmacy.view_stock_alerts"

    # Prescriptions
    PHARMACY_VIEW_PRESCRIPTIONS = "pharmacy.view_prescriptions"
    PHARMACY_VERIFY_PRESCRIPTION = "pharmacy.verify_prescription"
    PHARMACY_PROCESS_PRESCRIPTION = "pharmacy.process_prescription"
    PHARMACY_DISPENSE_MEDICINE = "pharmacy.dispense_medicine"

    # Orders
    PHARMACY_MANAGE_ORDERS = "pharmacy.manage_orders"
    PHARMACY_CREATE_ORDER = "pharmacy.create_order"
    PHARMACY_VIEW_ORDERS = "pharmacy.view_orders"
    PHARMACY_UPDATE_ORDER = "pharmacy.update_order"

    # Suppliers
    PHARMACY_MANAGE_SUPPLIERS = "pharmacy.manage_suppliers"

    # ==================== EMERGENCY MODULE ====================
    EMERGENCY_CREATE_REQUEST = "emergency.create_request"
    EMERGENCY_VIEW_REQUESTS = "emergency.view_requests"
    EMERGENCY_UPDATE_STATUS = "emergency.update_status"
    EMERGENCY_CANCEL_REQUEST = "emergency.cancel_request"

    # ==================== BLOOD DONATION MODULE ====================
    BLOOD_DONOR_REGISTER = "blood_donor.register"
    BLOOD_DONOR_VIEW_PROFILE = "blood_donor.view_profile"
    BLOOD_DONOR_UPDATE_PROFILE = "blood_donor.update_profile"
    BLOOD_DONOR_REQUEST_DONATION = "blood_donor.request_donation"

    BLOOD_REQUEST_CREATE = "blood_request.create"
    BLOOD_REQUEST_VIEW = "blood_request.view"
    BLOOD_REQUEST_MANAGE = "blood_request.manage"

    # ==================== OXYGEN MODULE ====================
    OXYGEN_REQUEST_CREATE = "oxygen_request.create"
    OXYGEN_REQUEST_VIEW = "oxygen_request.view"
    OXYGEN_SUPPLY_MANAGE = "oxygen_supply.manage"

    # ==================== ADMIN MODULE ====================
    # Users
    ADMIN_VIEW_USERS = "admin.view_users"
    ADMIN_CREATE_USER = "admin.create_user"
    ADMIN_UPDATE_USER = "admin.update_user"
    ADMIN_DELETE_USER = "admin.delete_user"
    ADMIN_BLOCK_USER = "admin.block_user"
    ADMIN_UNBLOCK_USER = "admin.unblock_user"

    # Roles & Permissions
    ADMIN_ASSIGN_ROLES = "admin.assign_roles"
    ADMIN_MANAGE_PERMISSIONS = "admin.manage_permissions"

    # System
    ADMIN_VIEW_DASHBOARD = "admin.view_dashboard"
    ADMIN_VIEW_STATISTICS = "admin.view_statistics"
    ADMIN_VIEW_ANALYTICS = "admin.view_analytics"

    # Content Moderation
    ADMIN_VIEW_REPORTS = "admin.view_reports"
    ADMIN_MODERATE_CONTENT = "admin.moderate_content"
    ADMIN_MANAGE_FEEDBACK = "admin.manage_feedback"

    # ==================== AUTHORITY MODULE ====================
    # Audit
    AUTHORITY_VIEW_AUDIT_LOGS = "authority.view_audit_logs"
    AUTHORITY_EXPORT_AUDIT_LOGS = "authority.export_audit_logs"

    # Compliance
    AUTHORITY_VIEW_COMPLIANCE_REPORTS = "authority.view_compliance_reports"
    AUTHORITY_GENERATE_COMPLIANCE_REPORT = "authority.generate_compliance_report"
    AUTHORITY_TRACK_REGULATIONS = "authority.track_regulations"

    # System Monitoring
    AUTHORITY_VIEW_SYSTEM_LOGS = "authority.view_system_logs"
    AUTHORITY_VIEW_SECURITY_LOGS = "authority.view_security_logs"
    AUTHORITY_MONITOR_API_USAGE = "authority.monitor_api_usage"

    # Investigation
    AUTHORITY_INVESTIGATE_INCIDENTS = "authority.investigate_incidents"
    AUTHORITY_VIEW_USER_ACTIVITY = "authority.view_user_activity"

    # ==================== AI ASSISTANT MODULE ====================
    AI_ASSISTANT_USE = "ai_assistant.use"
    AI_ASSISTANT_DIAGNOSE = "ai_assistant.diagnose"
    AI_ASSISTANT_ANALYZE = "ai_assistant.analyze"

    # ==================== MESSAGING MODULE ====================
    MESSAGING_SEND = "messaging.send"
    MESSAGING_VIEW = "messaging.view"
    MESSAGING_DELETE = "messaging.delete"

    # ==================== SEARCH MODULE ====================
    SEARCH_GLOBAL = "search.global"
    SEARCH_PATIENTS = "search.patients"
    SEARCH_DOCTORS = "search.doctors"
    SEARCH_HOSPITALS = "search.hospitals"
    SEARCH_MEDICINES = "search.medicines"

    # ==================== WOMEN'S HEALTH MODULE ====================
    WOMEN_HEALTH_VIEW = "women_health.view"
    WOMEN_HEALTH_TRACK = "women_health.track"
    WOMEN_HEALTH_REPORT = "women_health.report"

    # ==================== FULL ACCESS ====================
    FULL_ACCESS = "full_access"


# ============================================
# ROLE TO PERMISSIONS MAPPING
# ============================================
ROLE_PERMISSIONS: Dict[Role, Set[Permission]] = {
    # ==================== PATIENT ====================
    Role.PATIENT: {
        # Personal
        Permission.PATIENT_VIEW_PROFILE,
        Permission.PATIENT_UPDATE_PROFILE,
        Permission.PATIENT_VIEW_MEDICAL_RECORDS,
        Permission.PATIENT_UPLOAD_DOCUMENTS,
        # Appointments
        Permission.APPOINTMENT_VIEW,
        Permission.APPOINTMENT_BOOK,
        Permission.APPOINTMENT_CANCEL,
        Permission.APPOINTMENT_RESCHEDULE,
        Permission.APPOINTMENT_VIEW_HISTORY,
        # Prescriptions
        Permission.PRESCRIPTION_VIEW,
        Permission.PRESCRIPTION_DOWNLOAD,
        # Emergency
        Permission.EMERGENCY_CREATE_REQUEST,
        Permission.EMERGENCY_VIEW_REQUESTS,
        # Blood Donation
        Permission.BLOOD_DONOR_REGISTER,
        Permission.BLOOD_DONOR_VIEW_PROFILE,
        Permission.BLOOD_DONOR_UPDATE_PROFILE,
        Permission.BLOOD_DONOR_REQUEST_DONATION,
        # Oxygen
        Permission.OXYGEN_REQUEST_CREATE,
        Permission.OXYGEN_REQUEST_VIEW,
        # AI
        Permission.AI_ASSISTANT_USE,
        Permission.AI_ASSISTANT_DIAGNOSE,
        # Messaging
        Permission.MESSAGING_SEND,
        Permission.MESSAGING_VIEW,
        # Search
        Permission.SEARCH_GLOBAL,
        Permission.SEARCH_DOCTORS,
        Permission.SEARCH_HOSPITALS,
        # Women's Health
        Permission.WOMEN_HEALTH_VIEW,
        Permission.WOMEN_HEALTH_TRACK,
    },

    # ==================== DOCTOR ====================
    Role.DOCTOR: {
        # Patients
        Permission.DOCTOR_VIEW_PATIENTS,
        Permission.DOCTOR_VIEW_PATIENT_DETAILS,
        Permission.DOCTOR_SEARCH_PATIENTS,
        # Medical Records
        Permission.DOCTOR_VIEW_MEDICAL_RECORDS,
        Permission.DOCTOR_WRITE_MEDICAL_RECORDS,
        Permission.DOCTOR_UPDATE_MEDICAL_RECORDS,
        # Prescriptions
        Permission.DOCTOR_WRITE_PRESCRIPTION,
        Permission.DOCTOR_UPDATE_PRESCRIPTION,
        Permission.DOCTOR_REVOKE_PRESCRIPTION,
        # Appointments
        Permission.DOCTOR_MANAGE_APPOINTMENTS,
        Permission.DOCTOR_VIEW_APPOINTMENTS,
        Permission.DOCTOR_ACCEPT_APPOINTMENT,
        Permission.DOCTOR_REJECT_APPOINTMENT,
        # Consultation
        Permission.DOCTOR_START_CONSULTATION,
        Permission.DOCTOR_END_CONSULTATION,
        Permission.DOCTOR_DIAGNOSE,
        # Emergency
        Permission.EMERGENCY_VIEW_REQUESTS,
        Permission.EMERGENCY_UPDATE_STATUS,
        # AI
        Permission.AI_ASSISTANT_USE,
        Permission.AI_ASSISTANT_DIAGNOSE,
        Permission.AI_ASSISTANT_ANALYZE,
        # Messaging
        Permission.MESSAGING_SEND,
        Permission.MESSAGING_VIEW,
        # Search
        Permission.SEARCH_GLOBAL,
        Permission.SEARCH_PATIENTS,
        Permission.SEARCH_MEDICINES,
    },

    # ==================== HOSPITAL ADMIN ====================
    Role.HOSPITAL_ADMIN: {
        # Dashboard
        Permission.HOSPITAL_VIEW_DASHBOARD,
        Permission.HOSPITAL_VIEW_STATISTICS,
        Permission.HOSPITAL_VIEW_ANALYTICS,
        # Beds
        Permission.HOSPITAL_MANAGE_BEDS,
        Permission.HOSPITAL_ALLOCATE_BED,
        Permission.HOSPITAL_RELEASE_BED,
        Permission.HOSPITAL_VIEW_BED_STATUS,
        # ICU
        Permission.HOSPITAL_MANAGE_ICU,
        Permission.HOSPITAL_VIEW_ICU_STATUS,
        Permission.HOSPITAL_MANAGE_VENTILATORS,
        # Staff
        Permission.HOSPITAL_MANAGE_DOCTORS,
        Permission.HOSPITAL_MANAGE_NURSES,
        Permission.HOSPITAL_MANAGE_STAFF,
        Permission.HOSPITAL_ASSIGN_STAFF,
        # Emergency
        Permission.HOSPITAL_MANAGE_EMERGENCY_QUEUE,
        Permission.HOSPITAL_VIEW_EMERGENCY_REQUESTS,
        Permission.EMERGENCY_VIEW_REQUESTS,
        Permission.EMERGENCY_UPDATE_STATUS,
        # Blood Bank
        Permission.HOSPITAL_MANAGE_BLOOD_BANK,
        Permission.HOSPITAL_VIEW_BLOOD_INVENTORY,
        Permission.BLOOD_REQUEST_VIEW,
        # Departments
        Permission.HOSPITAL_MANAGE_DEPARTMENTS,
        Permission.HOSPITAL_VIEW_DEPARTMENT_STATS,
        # Patients
        Permission.DOCTOR_VIEW_PATIENTS,
        Permission.DOCTOR_VIEW_PATIENT_DETAILS,
        # Appointments
        Permission.APPOINTMENT_VIEW,
        Permission.APPOINTMENT_VIEW_HISTORY,
        # Messaging
        Permission.MESSAGING_SEND,
        Permission.MESSAGING_VIEW,
        # Search
        Permission.SEARCH_GLOBAL,
        Permission.SEARCH_PATIENTS,
    },

    # ==================== PHARMACY ADMIN ====================
    Role.PHARMACY_ADMIN: {
        # Inventory
        Permission.PHARMACY_VIEW_INVENTORY,
        Permission.PHARMACY_MANAGE_INVENTORY,
        Permission.PHARMACY_ADD_MEDICINE,
        Permission.PHARMACY_UPDATE_MEDICINE,
        Permission.PHARMACY_DELETE_MEDICINE,
        Permission.PHARMACY_VIEW_STOCK_ALERTS,
        # Prescriptions
        Permission.PHARMACY_VIEW_PRESCRIPTIONS,
        Permission.PHARMACY_VERIFY_PRESCRIPTION,
        Permission.PHARMACY_PROCESS_PRESCRIPTION,
        Permission.PHARMACY_DISPENSE_MEDICINE,
        # Orders
        Permission.PHARMACY_MANAGE_ORDERS,
        Permission.PHARMACY_CREATE_ORDER,
        Permission.PHARMACY_VIEW_ORDERS,
        Permission.PHARMACY_UPDATE_ORDER,
        # Suppliers
        Permission.PHARMACY_MANAGE_SUPPLIERS,
        # Dashboard
        Permission.HOSPITAL_VIEW_DASHBOARD,
        Permission.HOSPITAL_VIEW_STATISTICS,
        # Search
        Permission.SEARCH_GLOBAL,
        Permission.SEARCH_MEDICINES,
        # Messaging
        Permission.MESSAGING_SEND,
        Permission.MESSAGING_VIEW,
    },

    # ==================== ADMIN ====================
    Role.ADMIN: {
        # All permissions except Authority
        *{p for p in Permission if not p.value.startswith("authority.")},
    },

    # ==================== SUPER ADMIN ====================
    Role.SUPER_ADMIN: {
        # All permissions
        *{p for p in Permission},
    },

    # ==================== AUTHORITY ====================
    Role.AUTHORITY: {
        # Read-only access to all modules
        Permission.APPOINTMENT_VIEW,
        Permission.APPOINTMENT_VIEW_HISTORY,
        Permission.DOCTOR_VIEW_PATIENTS,
        Permission.DOCTOR_VIEW_PATIENT_DETAILS,
        Permission.DOCTOR_VIEW_MEDICAL_RECORDS,
        Permission.PRESCRIPTION_VIEW,
        Permission.HOSPITAL_VIEW_DASHBOARD,
        Permission.HOSPITAL_VIEW_STATISTICS,
        Permission.HOSPITAL_VIEW_ANALYTICS,
        Permission.HOSPITAL_VIEW_BED_STATUS,
        Permission.HOSPITAL_VIEW_ICU_STATUS,
        Permission.HOSPITAL_VIEW_DEPARTMENT_STATS,
        Permission.PHARMACY_VIEW_INVENTORY,
        Permission.PHARMACY_VIEW_PRESCRIPTIONS,
        Permission.PHARMACY_VIEW_ORDERS,
        Permission.EMERGENCY_VIEW_REQUESTS,
        Permission.BLOOD_REQUEST_VIEW,
        Permission.OXYGEN_REQUEST_VIEW,
        Permission.ADMIN_VIEW_USERS,
        Permission.ADMIN_VIEW_STATISTICS,
        # Authority-specific
        Permission.AUTHORITY_VIEW_AUDIT_LOGS,
        Permission.AUTHORITY_EXPORT_AUDIT_LOGS,
        Permission.AUTHORITY_VIEW_COMPLIANCE_REPORTS,
        Permission.AUTHORITY_GENERATE_COMPLIANCE_REPORT,
        Permission.AUTHORITY_TRACK_REGULATIONS,
        Permission.AUTHORITY_VIEW_SYSTEM_LOGS,
        Permission.AUTHORITY_VIEW_SECURITY_LOGS,
        Permission.AUTHORITY_MONITOR_API_USAGE,
        Permission.AUTHORITY_INVESTIGATE_INCIDENTS,
        Permission.AUTHORITY_VIEW_USER_ACTIVITY,
        # Search
        Permission.SEARCH_GLOBAL,
    },

    # ==================== BLOOD DONOR ====================
    Role.BLOOD_DONOR: {
        Permission.BLOOD_DONOR_VIEW_PROFILE,
        Permission.BLOOD_DONOR_UPDATE_PROFILE,
        Permission.BLOOD_DONOR_REQUEST_DONATION,
        Permission.SEARCH_GLOBAL,
    },

    # ==================== EMERGENCY VOLUNTEER ====================
    Role.EMERGENCY_VOLUNTEER: {
        Permission.EMERGENCY_VIEW_REQUESTS,
        Permission.EMERGENCY_UPDATE_STATUS,
        Permission.SEARCH_GLOBAL,
    },
}


# ============================================
# FEATURE DEFINITIONS (UI MODULES)
# ============================================
class Feature(str, Enum):
    """High-level UI features that can be shown/hidden based on role."""

    # Core
    DASHBOARD = "dashboard"
    PROFILE = "profile"
    NOTIFICATIONS = "notifications"
    MESSAGING = "messaging"
    SEARCH = "search"

    # Patient Features
    MY_APPOINTMENTS = "my_appointments"
    MY_PRESCRIPTIONS = "my_prescriptions"
    MEDICAL_RECORDS = "medical_records"
    FIND_DOCTORS = "find_doctors"
    FIND_HOSPITALS = "find_hospitals"
    EMERGENCY_REQUEST = "emergency_request"
    BLOOD_DONATION = "blood_donation"
    OXYGEN_REQUEST = "oxygen_request"
    WOMEN_HEALTH = "women_health"

    # Doctor Features
    PATIENT_LIST = "patient_list"
    PATIENT_DETAILS = "patient_details"
    MY_APPOINTMENTS_DOCTOR = "my_appointments_doctor"
    WRITE_PRESCRIPTION = "write_prescription"
    MEDICAL_HISTORY = "medical_history"
    AI_DIAGNOSTICS = "ai_diagnostics"
    VIDEO_CONSULTATION = "video_consultation"

    # Hospital Features
    HOSPITAL_DASHBOARD = "hospital_dashboard"
    BED_MANAGEMENT = "bed_management"
    ICU_MANAGEMENT = "icu_management"
    STAFF_MANAGEMENT = "staff_management"
    DEPARTMENT_MANAGEMENT = "department_management"
    EMERGENCY_QUEUE = "emergency_queue"
    BLOOD_BANK = "blood_bank"
    HOSPITAL_ANALYTICS = "hospital_analytics"

    # Pharmacy Features
    PHARMACY_DASHBOARD = "pharmacy_dashboard"
    MEDICINE_INVENTORY = "medicine_inventory"
    PRESCRIPTION_VERIFICATION = "prescription_verification"
    ORDER_MANAGEMENT = "order_management"
    SUPPLIER_MANAGEMENT = "supplier_management"

    # Admin Features
    ADMIN_DASHBOARD = "admin_dashboard"
    USER_MANAGEMENT = "user_management"
    ROLE_MANAGEMENT = "role_management"
    SYSTEM_STATS = "system_stats"
    CONTENT_MODERATION = "content_moderation"
    VERIFICATION_REQUESTS = "verification_requests"
    AUDIT_LOGS = "audit_logs"
    FEEDBACK_MANAGEMENT = "feedback_management"

    # Authority Features
    AUTHORITY_DASHBOARD = "authority_dashboard"
    COMPLIANCE_REPORTS = "compliance_reports"
    SYSTEM_AUDIT = "system_audit"
    SECURITY_MONITORING = "security_monitoring"
    INCIDENT_INVESTIGATION = "incident_investigation"
    REGULATORY_TRACKING = "regulatory_tracking"


# ============================================
# ROLE TO FEATURES MAPPING
# ============================================
ROLE_FEATURES: Dict[Role, Set[Feature]] = {
    Role.PATIENT: {
        Feature.DASHBOARD,
        Feature.PROFILE,
        Feature.NOTIFICATIONS,
        Feature.MESSAGING,
        Feature.SEARCH,
        Feature.MY_APPOINTMENTS,
        Feature.MY_PRESCRIPTIONS,
        Feature.MEDICAL_RECORDS,
        Feature.FIND_DOCTORS,
        Feature.FIND_HOSPITALS,
        Feature.EMERGENCY_REQUEST,
        Feature.BLOOD_DONATION,
        Feature.OXYGEN_REQUEST,
        Feature.WOMEN_HEALTH,
    },

    Role.DOCTOR: {
        Feature.DASHBOARD,
        Feature.PROFILE,
        Feature.NOTIFICATIONS,
        Feature.MESSAGING,
        Feature.SEARCH,
        Feature.PATIENT_LIST,
        Feature.PATIENT_DETAILS,
        Feature.MY_APPOINTMENTS_DOCTOR,
        Feature.WRITE_PRESCRIPTION,
        Feature.MEDICAL_HISTORY,
        Feature.AI_DIAGNOSTICS,
        Feature.VIDEO_CONSULTATION,
        Feature.EMERGENCY_REQUEST,
    },

    Role.HOSPITAL_ADMIN: {
        Feature.DASHBOARD,
        Feature.PROFILE,
        Feature.NOTIFICATIONS,
        Feature.MESSAGING,
        Feature.SEARCH,
        Feature.HOSPITAL_DASHBOARD,
        Feature.BED_MANAGEMENT,
        Feature.ICU_MANAGEMENT,
        Feature.STAFF_MANAGEMENT,
        Feature.DEPARTMENT_MANAGEMENT,
        Feature.EMERGENCY_QUEUE,
        Feature.BLOOD_BANK,
        Feature.HOSPITAL_ANALYTICS,
        Feature.PATIENT_LIST,
        Feature.PATIENT_DETAILS,
    },

    Role.PHARMACY_ADMIN: {
        Feature.DASHBOARD,
        Feature.PROFILE,
        Feature.NOTIFICATIONS,
        Feature.MESSAGING,
        Feature.SEARCH,
        Feature.PHARMACY_DASHBOARD,
        Feature.MEDICINE_INVENTORY,
        Feature.PRESCRIPTION_VERIFICATION,
        Feature.ORDER_MANAGEMENT,
        Feature.SUPPLIER_MANAGEMENT,
    },

    Role.ADMIN: {
        Feature.DASHBOARD,
        Feature.PROFILE,
        Feature.NOTIFICATIONS,
        Feature.MESSAGING,
        Feature.SEARCH,
        Feature.ADMIN_DASHBOARD,
        Feature.USER_MANAGEMENT,
        Feature.ROLE_MANAGEMENT,
        Feature.SYSTEM_STATS,
        Feature.CONTENT_MODERATION,
        Feature.VERIFICATION_REQUESTS,
        Feature.AUDIT_LOGS,
        Feature.FEEDBACK_MANAGEMENT,
        # Read access to other modules
        Feature.HOSPITAL_DASHBOARD,
        Feature.PHARMACY_DASHBOARD,
        Feature.EMERGENCY_REQUEST,
        Feature.BLOOD_DONATION,
    },

    Role.SUPER_ADMIN: {
        # All features
        *{f for f in Feature},
    },

    Role.AUTHORITY: {
        Feature.DASHBOARD,
        Feature.PROFILE,
        Feature.NOTIFICATIONS,
        Feature.SEARCH,
        Feature.AUTHORITY_DASHBOARD,
        Feature.COMPLIANCE_REPORTS,
        Feature.SYSTEM_AUDIT,
        Feature.SECURITY_MONITORING,
        Feature.INCIDENT_INVESTIGATION,
        Feature.REGULATORY_TRACKING,
        # Read access to monitor other modules
        Feature.HOSPITAL_DASHBOARD,
        Feature.PHARMACY_DASHBOARD,
        Feature.ADMIN_DASHBOARD,
        Feature.SYSTEM_STATS,
        Feature.EMERGENCY_REQUEST,
        Feature.BLOOD_DONATION,
    },

    Role.BLOOD_DONOR: {
        Feature.DASHBOARD,
        Feature.PROFILE,
        Feature.NOTIFICATIONS,
        Feature.BLOOD_DONATION,
        Feature.SEARCH,
    },

    Role.EMERGENCY_VOLUNTEER: {
        Feature.DASHBOARD,
        Feature.PROFILE,
        Feature.NOTIFICATIONS,
        Feature.EMERGENCY_REQUEST,
        Feature.SEARCH,
    },
}


# ============================================
# ACTION DEFINITIONS (Universal Action API)
# ============================================
class ActionModule(str, Enum):
    """Modules for the universal action API."""

    APPOINTMENT = "appointment"
    PRESCRIPTION = "prescription"
    PATIENT = "patient"
    DOCTOR = "doctor"
    HOSPITAL = "hospital"
    PHARMACY = "pharmacy"
    EMERGENCY = "emergency"
    BLOOD_DONATION = "blood_donation"
    OXYGEN = "oxygen"
    USER = "user"
    ADMIN = "admin"
    AUTHORITY = "authority"
    AI_ASSISTANT = "ai_assistant"
    MESSAGING = "messaging"
    SEARCH = "search"


class Action(str, Enum):
    """Actions for the universal action API."""

    # Appointment actions
    APPOINTMENT_LIST = "list"
    APPOINTMENT_VIEW = "view"
    APPOINTMENT_BOOK = "book"
    APPOINTMENT_CANCEL = "cancel"
    APPOINTMENT_RESCHEDULE = "reschedule"
    APPOINTMENT_ACCEPT = "accept"
    APPOINTMENT_REJECT = "reject"

    # Prescription actions
    PRESCRIPTION_LIST = "list"
    PRESCRIPTION_VIEW = "view"
    PRESCRIPTION_CREATE = "create"
    PRESCRIPTION_UPDATE = "update"
    PRESCRIPTION_REVOKE = "revoke"
    PRESCRIPTION_DOWNLOAD = "download"

    # Patient actions
    PATIENT_LIST = "list"
    PATIENT_VIEW = "view"
    PATIENT_SEARCH = "search"
    PATIENT_MEDICAL_RECORDS = "medical_records"

    # Doctor actions
    DOCTOR_LIST = "list"
    DOCTOR_VIEW = "view"
    DOCTOR_SEARCH = "search"

    # Hospital actions
    HOSPITAL_LIST = "list"
    HOSPITAL_VIEW = "view"
    HOSPITAL_BED_ALLOCATE = "bed_allocate"
    HOSPITAL_BED_RELEASE = "bed_release"

    # Pharmacy actions
    PHARMACY_LIST = "list"
    PHARMACY_VIEW = "view"
    PHARMACY_INVENTORY_ADD = "inventory_add"
    PHARMACY_PRESCRIPTION_VERIFY = "prescription_verify"

    # Emergency actions
    EMERGENCY_CREATE = "create"
    EMERGENCY_LIST = "list"
    EMERGENCY_UPDATE = "update"
    EMERGENCY_CANCEL = "cancel"

    # Blood donation actions
    BLOOD_DONOR_REGISTER = "register"
    BLOOD_REQUEST_CREATE = "request_create"
    BLOOD_INVENTORY_VIEW = "inventory_view"

    # Oxygen actions
    OXYGEN_REQUEST_CREATE = "request_create"
    OXYGEN_REQUEST_VIEW = "request_view"

    # User actions
    USER_LIST = "list"
    USER_VIEW = "view"
    USER_CREATE = "create"
    USER_UPDATE = "update"
    USER_DELETE = "delete"
    USER_BLOCK = "block"
    USER_UNBLOCK = "unblock"

    # Admin actions
    ADMIN_STATS = "stats"
    ADMIN_VERIFICATIONS = "verifications"
    ADMIN_AUDIT_LOGS = "audit_logs"

    # Authority actions
    AUTHORITY_AUDIT_LOGS = "audit_logs"
    AUTHORITY_COMPLIANCE_REPORTS = "compliance_reports"
    AUTHORITY_SYSTEM_LOGS = "system_logs"
    AUTHORITY_INCIDENT_INVESTIGATE = "incident_investigate"


# ============================================
# ACTION TO PERMISSION MAPPING
# ============================================
ACTION_PERMISSIONS: Dict[tuple[ActionModule, Action], Permission] = {
    # Appointments
    (ActionModule.APPOINTMENT, Action.APPOINTMENT_LIST): Permission.APPOINTMENT_VIEW,
    (ActionModule.APPOINTMENT, Action.APPOINTMENT_VIEW): Permission.APPOINTMENT_VIEW,
    (ActionModule.APPOINTMENT, Action.APPOINTMENT_BOOK): Permission.APPOINTMENT_BOOK,
    (ActionModule.APPOINTMENT, Action.APPOINTMENT_CANCEL): Permission.APPOINTMENT_CANCEL,
    (ActionModule.APPOINTMENT, Action.APPOINTMENT_RESCHEDULE): Permission.APPOINTMENT_RESCHEDULE,
    (ActionModule.APPOINTMENT, Action.APPOINTMENT_ACCEPT): Permission.DOCTOR_ACCEPT_APPOINTMENT,
    (ActionModule.APPOINTMENT, Action.APPOINTMENT_REJECT): Permission.DOCTOR_REJECT_APPOINTMENT,

    # Prescriptions
    (ActionModule.PRESCRIPTION, Action.PRESCRIPTION_LIST): Permission.PRESCRIPTION_VIEW,
    (ActionModule.PRESCRIPTION, Action.PRESCRIPTION_VIEW): Permission.PRESCRIPTION_VIEW,
    (ActionModule.PRESCRIPTION, Action.PRESCRIPTION_CREATE): Permission.DOCTOR_WRITE_PRESCRIPTION,
    (ActionModule.PRESCRIPTION, Action.PRESCRIPTION_UPDATE): Permission.DOCTOR_UPDATE_PRESCRIPTION,
    (ActionModule.PRESCRIPTION, Action.PRESCRIPTION_REVOKE): Permission.DOCTOR_REVOKE_PRESCRIPTION,
    (ActionModule.PRESCRIPTION, Action.PRESCRIPTION_DOWNLOAD): Permission.PRESCRIPTION_DOWNLOAD,

    # Patients
    (ActionModule.PATIENT, Action.PATIENT_LIST): Permission.DOCTOR_VIEW_PATIENTS,
    (ActionModule.PATIENT, Action.PATIENT_VIEW): Permission.DOCTOR_VIEW_PATIENT_DETAILS,
    (ActionModule.PATIENT, Action.PATIENT_SEARCH): Permission.DOCTOR_SEARCH_PATIENTS,
    (ActionModule.PATIENT, Action.PATIENT_MEDICAL_RECORDS): Permission.DOCTOR_VIEW_MEDICAL_RECORDS,

    # Hospitals
    (ActionModule.HOSPITAL, Action.HOSPITAL_LIST): Permission.SEARCH_HOSPITALS,
    (ActionModule.HOSPITAL, Action.HOSPITAL_VIEW): Permission.SEARCH_HOSPITALS,
    (ActionModule.HOSPITAL, Action.HOSPITAL_BED_ALLOCATE): Permission.HOSPITAL_ALLOCATE_BED,
    (ActionModule.HOSPITAL, Action.HOSPITAL_BED_RELEASE): Permission.HOSPITAL_RELEASE_BED,

    # Pharmacy
    (ActionModule.PHARMACY, Action.PHARMACY_LIST): Permission.SEARCH_GLOBAL,
    (ActionModule.PHARMACY, Action.PHARMACY_VIEW): Permission.SEARCH_GLOBAL,
    (ActionModule.PHARMACY, Action.PHARMACY_INVENTORY_ADD): Permission.PHARMACY_ADD_MEDICINE,
    (ActionModule.PHARMACY, Action.PHARMACY_PRESCRIPTION_VERIFY): Permission.PHARMACY_VERIFY_PRESCRIPTION,

    # Emergency
    (ActionModule.EMERGENCY, Action.EMERGENCY_CREATE): Permission.EMERGENCY_CREATE_REQUEST,
    (ActionModule.EMERGENCY, Action.EMERGENCY_LIST): Permission.EMERGENCY_VIEW_REQUESTS,
    (ActionModule.EMERGENCY, Action.EMERGENCY_UPDATE): Permission.EMERGENCY_UPDATE_STATUS,
    (ActionModule.EMERGENCY, Action.EMERGENCY_CANCEL): Permission.EMERGENCY_CANCEL_REQUEST,

    # Blood Donation
    (ActionModule.BLOOD_DONATION, Action.BLOOD_DONOR_REGISTER): Permission.BLOOD_DONOR_REGISTER,
    (ActionModule.BLOOD_DONATION, Action.BLOOD_REQUEST_CREATE): Permission.BLOOD_REQUEST_CREATE,
    (ActionModule.BLOOD_DONATION, Action.BLOOD_INVENTORY_VIEW): Permission.HOSPITAL_VIEW_BLOOD_INVENTORY,

    # Oxygen
    (ActionModule.OXYGEN, Action.OXYGEN_REQUEST_CREATE): Permission.OXYGEN_REQUEST_CREATE,
    (ActionModule.OXYGEN, Action.OXYGEN_REQUEST_VIEW): Permission.OXYGEN_REQUEST_VIEW,

    # Users (Admin)
    (ActionModule.USER, Action.USER_LIST): Permission.ADMIN_VIEW_USERS,
    (ActionModule.USER, Action.USER_VIEW): Permission.ADMIN_VIEW_USERS,
    (ActionModule.USER, Action.USER_CREATE): Permission.ADMIN_CREATE_USER,
    (ActionModule.USER, Action.USER_UPDATE): Permission.ADMIN_UPDATE_USER,
    (ActionModule.USER, Action.USER_DELETE): Permission.ADMIN_DELETE_USER,
    (ActionModule.USER, Action.USER_BLOCK): Permission.ADMIN_BLOCK_USER,
    (ActionModule.USER, Action.USER_UNBLOCK): Permission.ADMIN_UNBLOCK_USER,

    # Admin
    (ActionModule.ADMIN, Action.ADMIN_STATS): Permission.ADMIN_VIEW_STATISTICS,
    (ActionModule.ADMIN, Action.ADMIN_VERIFICATIONS): Permission.ADMIN_VIEW_USERS,
    (ActionModule.ADMIN, Action.ADMIN_AUDIT_LOGS): Permission.AUTHORITY_VIEW_AUDIT_LOGS,

    # Authority
    (ActionModule.AUTHORITY, Action.AUTHORITY_AUDIT_LOGS): Permission.AUTHORITY_VIEW_AUDIT_LOGS,
    (ActionModule.AUTHORITY, Action.AUTHORITY_COMPLIANCE_REPORTS): Permission.AUTHORITY_VIEW_COMPLIANCE_REPORTS,
    (ActionModule.AUTHORITY, Action.AUTHORITY_SYSTEM_LOGS): Permission.AUTHORITY_VIEW_SYSTEM_LOGS,
    (ActionModule.AUTHORITY, Action.AUTHORITY_INCIDENT_INVESTIGATE): Permission.AUTHORITY_INVESTIGATE_INCIDENTS,
}


# ============================================
# HELPER FUNCTIONS
# ============================================
def get_permissions_for_role(role: Role) -> Set[Permission]:
    """Get all permissions for a given role."""
    return ROLE_PERMISSIONS.get(role, set())


def get_features_for_role(role: Role) -> Set[Feature]:
    """Get all features for a given role."""
    return ROLE_FEATURES.get(role, set())


def has_permission(role: Role, permission: Permission) -> bool:
    """Check if a role has a specific permission."""
    if Permission.FULL_ACCESS in get_permissions_for_role(role):
        return True
    return permission in get_permissions_for_role(role)


def has_any_permission(role: Role, permissions: Set[Permission]) -> bool:
    """Check if a role has any of the given permissions."""
    if Permission.FULL_ACCESS in get_permissions_for_role(role):
        return True
    return bool(get_permissions_for_role(role) & permissions)


def has_all_permissions(role: Role, permissions: Set[Permission]) -> bool:
    """Check if a role has all of the given permissions."""
    if Permission.FULL_ACCESS in get_permissions_for_role(role):
        return True
    return permissions.issubset(get_permissions_for_role(role))


def get_permission_for_action(module: ActionModule, action: Action) -> Optional[Permission]:
    """Get the required permission for an action."""
    return ACTION_PERMISSIONS.get((module, action))


def can_execute_action(role: Role, module: ActionModule, action: Action) -> bool:
    """Check if a role can execute a specific action."""
    if Permission.FULL_ACCESS in get_permissions_for_role(role):
        return True
    required_permission = get_permission_for_action(module, action)
    if not required_permission:
        return False
    return has_permission(role, required_permission)