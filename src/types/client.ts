// src/types/client.ts
export interface ClientProfile {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  bloodGroup: string;
  address: string;
  avatar?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  medicalHistory: MedicalHistory;
  vaccines: Vaccine[];
  allergies: string[];
  chronicDiseases: string[];
}

export interface MedicalHistory {
  conditions: MedicalCondition[];
  surgeries: Surgery[];
  medications: Medication[];
  reports: MedicalReport[];
}

export interface MedicalCondition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: 'active' | 'resolved' | 'ongoing';
  notes: string;
}

export interface Surgery {
  id: string;
  name: string;
  date: string;
  hospital: string;
  doctorName: string;
  notes: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  instructions: string;
}

export interface MedicalReport {
  id: string;
  title: string;
  type: 'lab' | 'imaging' | 'prescription' | 'discharge' | 'other';
  date: string;
  doctor: string;
  hospital: string;
  fileUrl: string;
  notes: string;
}

export interface Vaccine {
  id: string;
  name: string;
  date: string;
  dose: string;
  nextDueDate?: string;
  administeredBy: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar?: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled' | 'rescheduled';
  type: 'in-person' | 'video' | 'phone';
  reason: string;
  notes?: string;
  prescription?: Prescription;
}

export interface Prescription {
  id: string;
  appointmentId: string;
  doctorName: string;
  date: string;
  medications: PrescribedMedication[];
  instructions: string;
  followUpDate?: string;
  fileUrl?: string;
}

export interface PrescribedMedication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: 'before_meal' | 'after_meal' | 'empty_stomach';
  instructions: string;
}

export interface BloodDonation {
  id: string;
  date: string;
  location: string;
  hospital: string;
  bloodGroup: string;
  quantity: string;
  nextEligibleDate: string;
  certificateUrl?: string;
}

export interface HealthRecommendation {
  id: string;
  type: 'food' | 'exercise' | 'lifestyle' | 'warning' | 'medicine';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: 'recommend' | 'avoid';
  createdAt: string;
}

export interface MedicineReminder {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: 'once' | 'twice' | 'thrice' | 'custom';
  times: string[];
  startDate: string;
  endDate: string;
  isActive: boolean;
  notes: string;
}

export interface EmergencyRequest {
  id: string;
  type: 'blood' | 'ambulance' | 'doctor' | 'hospital';
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  bloodGroup?: string;
  units?: number;
  location: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  createdAt: string;
  acceptedBy?: string;
}

export interface HealthTimelineEvent {
  id: string;
  type: 'appointment' | 'report' | 'vaccine' | 'surgery' | 'medication' | 'donation';
  title: string;
  description: string;
  date: string;
  icon: string;
  color: string;
}

export interface HealthStats {
  upcomingAppointments: number;
  activePrescriptions: number;
  bloodDonations: number;
  medicalReports: number;
  nextDonationDate?: string;
  lastCheckup?: string;
  healthScore: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  availability: 'available' | 'busy' | 'offline';
  nextAvailable?: string;
  hospital: string;
  education: string;
  languages: string[];
  avatar?: string;
  distance?: number;
}

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: string;
  distance: number;
  lastDonation: string;
  donationCount: number;
  isAvailable: boolean;
  phone: string;
  address: string;
}