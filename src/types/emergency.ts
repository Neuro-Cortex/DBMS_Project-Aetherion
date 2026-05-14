// src/types/emergency.ts - সম্পূর্ণ ঠিক করা version

import { Address } from './user';

// ============================================
// EMERGENCY SERVICE TYPES
// ============================================


// src/types/doctor.ts
export interface DoctorProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  qualifications: string[];
  hospitalAffiliation: string;
  hospitalAddress: string;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  avatar?: string;
  isOnline: boolean;
  bio: string;
  languages: string[];
  education: Education[];
  awards: Award[];
  availableSlots: TimeSlot[];
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
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
  maxPatients: number;
  currentBookings: number;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: 'male' | 'female';
  bloodGroup: string;
  lastVisit: string;
  totalVisits: number;
  condition: string;
  avatar?: string;
  upcomingAppointment?: string;
}

export interface DoctorAppointment {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  patientAge: number;
  patientGender: string;
  date: string;
  time: string;
  duration: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  type: 'video' | 'in-person' | 'phone';
  reason: string;
  notes?: string;
  isEmergency: boolean;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  date: string;
  diagnosis: string;
  medications: PrescribedMedication[];
  instructions: string;
  followUpDate?: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface PrescribedMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: 'before_meal' | 'after_meal' | 'empty_stomach' | 'anytime';
  instructions: string;
  quantity: number;
}

export interface EmergencyRequest {
  id: string;
  patientName: string;
  patientAge: number;
  condition: string;
  severity: 'critical' | 'high' | 'medium';
  location: string;
  timestamp: string;
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  notes?: string;
  bloodGroup?: string;
  unitsNeeded?: number;
}

export interface VideoConsultation {
  id: string;
  patientName: string;
  patientAvatar?: string;
  scheduledTime: string;
  duration: number;
  status: 'waiting' | 'ongoing' | 'completed';
  reason: string;
  meetingLink?: string;
}

export interface EarningsData {
  today: number;
  yesterday: number;
  weekly: number;
  monthly: number;
  yearly: number;
  totalConsultations: number;
  completedAppointments: number;
  cancelledAppointments: number;
  averageRating: number;
  earningsByDay: { day: string; amount: number }[];
  earningsByMonth: { month: string; amount: number }[];
}

export interface DoctorStats {
  totalPatients: number;
  todayAppointments: number;
  completedToday: number;
  pendingEmergencies: number;
  videoConsultations: number;
  earningsToday: number;
  onlineStatus: boolean;
  totalPrescriptions: number;
  averageConsultationTime: string;
}

export interface PatientReport {
  id: string;
  patientId: string;
  patientName: string;
  type: 'lab' | 'imaging' | 'prescription' | 'discharge';
  title: string;
  date: string;
  status: 'normal' | 'abnormal' | 'critical';
  fileUrl?: string;
  notes?: string;
}
export type EmergencyServiceType = 'ambulance' | 'blood' | 'oxygen' | 'doctor' | 'emergency-room' | 'helicopter';

export type EmergencyServiceStatus = 'available' | 'busy' | 'dispatched' | 'offline' | 'maintenance';

export type EmergencyPriority = 'low' | 'medium' | 'high' | 'critical';

export type EmergencyRequestStatus = 'pending' | 'dispatched' | 'en-route' | 'arrived' | 'completed' | 'cancelled';

// ============================================
// EMERGENCY SERVICE INTERFACE
// ============================================
export interface EmergencyService {
  id: string;
  name: string;
  type: EmergencyServiceType;
  status: EmergencyServiceStatus;
  provider: string;
  phone: string;
  location: Address;
  eta?: number; // in minutes
  capacity?: number;
  currentLoad?: number;
  vehicleNumber?: string;
  crewMembers?: number;
  equipment?: string[];
  lastDispatchedAt?: string;
  rating?: number;
  price?: number;
}

// ============================================
// EMERGENCY REQUEST INTERFACE
// ============================================
export interface EmergencyRequest {
  id: string;
  type: EmergencyServiceType;
  priority: EmergencyPriority;
  status: EmergencyRequestStatus;
  patientId?: string;
  patientName?: string;
  patientPhone?: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  notes?: string;
  serviceId?: string;
  serviceName?: string;
  estimatedTime?: number;
  requestedAt: string;
  dispatchedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

// ============================================
// EMERGENCY REQUEST PAYLOAD
// ============================================
export interface CreateEmergencyRequestPayload {
  type: EmergencyServiceType;
  priority: EmergencyPriority;
  patientId?: string;
  patientName?: string;
  patientPhone?: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  notes?: string;
}

// ============================================
// EMERGENCY RESOURCE TRACKING
// ============================================
export interface EmergencyResource {
  id: string;
  type: 'ventilator' | 'monitor' | 'defibrillator' | 'stretcher' | 'oxygen-cylinder';
  total: number;
  available: number;
  status: 'operational' | 'low' | 'critical' | 'maintenance';
  lastServiced: string;
}

export interface EmergencyStaff {
  role: 'doctor' | 'nurse' | 'paramedic' | 'driver';
  total: number;
  available: number;
  onCall: number;
  onDuty: number;
}

// ============================================
// EMERGENCY STATE
// ============================================
export interface EmergencyState {
  services: EmergencyService[];
  requests: EmergencyRequest[];
  activeRequests: EmergencyRequest[];
  criticalRequests: EmergencyRequest[];
  resources: EmergencyResource[];
  staff: EmergencyStaff[];
  isLoading: boolean;
  error: string | null;
  isMonitoring: boolean;
}

// ============================================
// EMERGENCY STATS
// ============================================
export interface EmergencyStats {
  totalServices: number;
  availableServices: number;
  activeRequests: number;
  criticalRequests: number;
  avgResponseTime: number; // in minutes
  byType: Record<EmergencyServiceType, number>;
  byPriority: Record<EmergencyPriority, number>;
  successRate: number;
}