// src/types/appointment.ts - সম্পূর্ণ ঠিক করা version

// ============================================
// APPOINTMENT TYPES
// ============================================
export type AppointmentType = 'consultation' | 'follow-up' | 'emergency' | 'checkup' | 'surgery' | 'lab-review';

export type AppointmentStatus = 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';

export type AppointmentLocation = 'in-person' | 'video' | 'phone';

export type AppointmentPriority = 'low' | 'medium' | 'high' | 'urgent';

// ============================================
// CORE APPOINTMENT INTERFACE
// ============================================
export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorAvatar?: string;
  doctorSpecialty?: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  patientPhone?: string;
  patientEmail?: string;
  hospitalId?: string;
  hospitalName?: string;
  date: string;
  time: string;
  endTime?: string;
  duration?: number; // in minutes
  type: AppointmentType;
  status: AppointmentStatus;
  location: AppointmentLocation;
  priority: AppointmentPriority;
  notes?: string;
  symptoms?: string[];
  cancellationReason?: string;
  prescriptionId?: string;
  meetingLink?: string;
  fee?: number;
  paymentStatus?: 'pending' | 'paid' | 'insurance';
  createdAt: string;
  updatedAt: string;
}

// ============================================
// APPOINTMENT PAYLOADS
// ============================================
export interface BookAppointmentPayload {
  doctorId: string;
  patientId: string;
  hospitalId?: string;
  date: string;
  time: string;
  type: AppointmentType;
  location: AppointmentLocation;
  priority?: AppointmentPriority;
  notes?: string;
  symptoms?: string[];
}

export interface RescheduleAppointmentPayload {
  appointmentId: string;
  newDate: string;
  newTime: string;
  reason?: string;
}

export interface CancelAppointmentPayload {
  appointmentId: string;
  cancellationReason: string;
}

// ============================================
// APPOINTMENT FILTERS
// ============================================
export interface AppointmentFilters {
  status?: AppointmentStatus;
  type?: AppointmentType;
  dateFrom?: string;
  dateTo?: string;
  doctorId?: string;
  patientId?: string;
  location?: AppointmentLocation;
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'status' | 'type';
  sortOrder?: 'asc' | 'desc';
}

// ============================================
// APPOINTMENT STATE
// ============================================
export interface AppointmentState {
  appointments: Appointment[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  todayAppointments: Appointment[];
  selectedAppointment: Appointment | null;
  filters: AppointmentFilters;
  isLoading: boolean;
  error: string | null;
  bookingSuccess: boolean;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// ============================================
// APPOINTMENT STATS
// ============================================
export interface AppointmentStats {
  total: number;
  scheduled: number;
  confirmed: number;
  inProgress: number;
  completed: number;
  cancelled: number;
  noShow: number;
  completionRate: number;
  cancellationRate: number;
  byStatus: Record<AppointmentStatus, number>;
  byType: Record<AppointmentType, number>;
  monthlyData: Array<{ month: string; count: number }>;
}