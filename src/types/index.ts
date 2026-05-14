// ============================================
// 🔷 USER & AUTH TYPES
// ============================================
export type {
  UserRole,
  Gender,
  Address,
  EmergencyContact,
  User,
  Patient,
  BloodGroup,
  AuthUser,
  LoginCredentials,
  RegisterData,
  AuthState,
  ProfileUpdateData,
  PatientUpdateData,
} from './user';

// ============================================
// 🩺 DOCTOR TYPES
// ============================================
export type {
  DoctorStatus,
  DoctorVerificationStatus,
  DoctorQualification,
  TimeSlot,
  DaySchedule,
  DoctorReview,
  Doctor,
  DoctorFilters,
  DoctorState,
} from './doctor';

// ============================================
// 🏥 HOSPITAL TYPES
// ============================================
export type {
  HospitalType,
  BedType,
  HospitalService,
  BedInfo,
  HospitalContact,
  Hospital,
  BedBooking,
  BookBedPayload,
  HospitalState,
} from './hospital';

// ============================================
// 📅 APPOINTMENT TYPES
// ============================================
export type {
  AppointmentType,
  AppointmentStatus,
  AppointmentLocation,
  AppointmentPriority,
  Appointment,
  BookAppointmentPayload,
  RescheduleAppointmentPayload,
  CancelAppointmentPayload,
  AppointmentFilters,
  AppointmentState,
  AppointmentStats,
} from './appointment';

// ============================================
// 🚑 EMERGENCY TYPES
// ============================================
export type {
  EmergencyServiceType,
  EmergencyServiceStatus,
  EmergencyPriority,
  EmergencyRequestStatus,
  EmergencyService,
  EmergencyRequest,
  CreateEmergencyRequestPayload,
  EmergencyResource,
  EmergencyStaff,
  EmergencyState,
  EmergencyStats,
} from './emergency';