// src/types/doctor.ts

export interface Doctor {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  fullName: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';

  // Professional Info
  specialization: string;
  subSpecializations: string[];
  qualifications: Qualification[];
  experience: number; // years
  licenseNumber: string;
  medicalCouncil: string;

  // Hospital Info
  hospitalName: string;
  hospitalAddress: Address;
  department: string;
  designation: string;

  // Consultation
  consultationFee: number;
  followUpFee: number;
  videoConsultationFee: number;
  consultationDuration: number; // minutes
  languages: string[];
  consultationModes: ('in-person' | 'video' | 'phone')[];

  // Availability
  availabilitySchedule: WeeklySchedule;
  isOnline: boolean;
  isAvailable: boolean;
  maxPatientsPerDay: number;

  // Stats
  rating: number;
  reviewCount: number;
  totalPatients: number;
  totalConsultations: number;
  successRate: number;
  experience_years: number;

  // Profile
  about: string;
  profileImage: string;
  coverImage: string;
  achievements: string[];
  awards: Award[];
  publications: Publication[];
  memberships: string[];

  // Contact
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  joinedDate: string;

  // Settings
  notificationsEnabled: boolean;
  smsAlertsEnabled: boolean;
  emailAlertsEnabled: boolean;

  address: string;
  education: Education[];
  status: 'online' | 'offline' | 'busy';
}

export interface Qualification {
  degree: string;
  institution: string;
  year: number;
  country: string;
}

export interface Education {
  degree: string;
  institution: string;
  year: number;
}

export interface Award {
  title: string;
  organization: string;
  year: number;
  description?: string;
}

export interface Publication {
  title: string;
  journal: string;
  year: number;
  doi?: string;
  citations?: number;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface WeeklySchedule {
  monday: DaySchedule;
  tuesday: DaySchedule;
  wednesday: DaySchedule;
  thursday: DaySchedule;
  friday: DaySchedule;
  saturday: DaySchedule;
  sunday: DaySchedule;
}

export interface DaySchedule {
  isAvailable: boolean;
  slots: TimeSlot[];
}

export interface TimeSlot {
  startTime: string;
  endTime: string;
  maxPatients: number;
  currentPatients: number;
  isAvailable: boolean;
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodGroup: BloodGroup;
  gender: string;
  lastVisit: string;
  totalVisits: number;
  upcomingAppointment?: Appointment;
  medicalHistory: PatientMedicalHistory;
  currentMedications: Medication[];
  allergies: string[];
  notes?: string;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface PatientMedicalHistory {
  conditions: MedicalCondition[];
  surgeries: Surgery[];
  familyHistory: string[];
}

export interface MedicalCondition {
  name: string;
  diagnosedDate: string;
  status: 'active' | 'resolved' | 'managed';
  notes?: string;
}

export interface Surgery {
  name: string;
  date: string;
  hospital: string;
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  date: string;
  time: string;
  duration: number;
  type: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  symptoms?: string[];
  isEmergency: boolean;
  isFirstVisit: boolean;
  notes?: string;
  prescriptionId?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  appointmentId: string;
  date: string;
  diagnosis: string;
  symptoms: string[];
  medications: PrescribedMedication[];
  tests: PrescribedTest[];
  advice: string;
  followUpDate?: string;
  validUntil: string;
  isDigital: boolean;
  digitalSignature?: string;
  status: 'active' | 'completed' | 'expired';
}

export interface PrescribedMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: 'before-food' | 'after-food' | 'with-food' | 'empty-stomach';
  quantity: number;
  refills: number;
  instructions?: string;
}

export interface PrescribedTest {
  name: string;
  type: string;
  instructions?: string;
  isUrgent: boolean;
}

export interface BloodRequest {
  id: string;
  patientId: string;
  patientName: string;
  bloodGroup: BloodGroup;
  units: number;
  hospital: string;
  urgency: 'normal' | 'urgent' | 'emergency';
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  requestDate: string;
  requiredDate: string;
  reason: string;
  approvedBy?: string;
  approvalDate?: string;
}

export interface VideoConsultation {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'waiting' | 'in-progress' | 'completed' | 'missed';
  roomId: string;
  recordingUrl?: string;
  notes?: string;
}

export interface DoctorDashboardData {
  todayAppointments: Appointment[];
  upcomingAppointments: Appointment[];
  emergencyRequests: BloodRequest[];
  pendingPrescriptions: Prescription[];
  videoConsultations: VideoConsultation[];
  recentPatients: Patient[];
  earnings: EarningsData;
  stats: DoctorStats;
  activities: Activity[];
  notifications: DoctorNotification[];
}

export interface EarningsData {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  breakdown: {
    consultations: number;
    videoConsultations: number;
    followUps: number;
  };
  chartData: {
    labels: string[];
    values: number[];
  };
}

export interface DoctorStats {
  totalPatients: number;
  todayPatients: number;
  completedAppointments: number;
  cancelledAppointments: number;
  averageRating: number;
  totalReviews: number;
  prescriptionCount: number;
  videoConsultCount: number;
}

export interface Activity {
  id: string;
  type: 'appointment' | 'prescription' | 'consultation' | 'review' | 'emergency';
  description: string;
  patientName?: string;
  time: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface DoctorNotification {
  id: string;
  type: 'appointment' | 'emergency' | 'prescription' | 'review' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}
