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
  Doctor,
  Qualification,
  Education as DoctorEducation,
  Award as DoctorAward,
  Publication,
  Address as DoctorAddress,
  WeeklySchedule,
  DaySchedule,
  TimeSlot as DoctorTimeSlot,
  Patient as DoctorPatient,
  BloodGroup as DoctorBloodGroup,
  PatientMedicalHistory,
  MedicalCondition as DoctorMedicalCondition,
  Surgery as DoctorSurgery,
  Medication as DoctorMedication,
  Appointment as DoctorAppointment,
  Prescription as DoctorPrescription,
  PrescribedMedication,
  PrescribedTest,
  BloodRequest,
  VideoConsultation,
  DoctorDashboardData,
  EarningsData as DoctorEarningsData,
  DoctorStats,
  Activity as DoctorActivity,
  DoctorNotification,
} from './doctor';

// ============================================
// 🏥 HOSPITAL TYPES
// ============================================
export type {
  Hospital,
  HospitalAddress,
  OxygenStock,
  CylinderType,
  BloodBank,
  BloodStock,
  BloodGroup as HospitalBloodGroup,
  Department,
  WorkingHours,
  DayHours,
  VisitingHours,
  VisitingTimeSlot,
  HospitalDoctor,
  DoctorAvailability,
  BloodDonor,
  BloodRequest as HospitalBloodRequest,
  Ambulance,
  AmbulanceRequest,
  EmergencyAnnouncement,
  ICUBed,
  HospitalDashboardData,
  TodayStats,
  BedStats,
  DepartmentBedStat,
  ICUStats,
  BloodStats,
  OxygenStats,
  EmergencyStats,
  AmbulanceStats,
  HospitalActivity,
  PendingApproval,
  Alert as HospitalAlert,
  HospitalAnalytics,
  HospitalType,
  BedInfo,
  BedSummary,
  HospitalContact,
  HospitalLocation,
  HospitalListItem,
  HospitalCardProps,
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