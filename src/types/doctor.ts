// src/types/doctor.ts

// ============================================
// DOCTOR TYPES (Completely self-contained)
// ============================================

// Base types (redefined locally)
export type Gender = 'male' | 'female' | 'other' | 'prefer-not-to-say';

export interface Address {
  street?: string;
  city: string;
  state: string;
  zipCode?: string;
  country: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: 'patient' | 'doctor' | 'admin' | 'staff';
  gender?: Gender;
  avatar?: string;
  dateOfBirth?: string;
  address?: Address;
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// DOCTOR SPECIFIC TYPES
// ============================================
export type DoctorStatus = 'available' | 'busy' | 'offline' | 'on-leave';

export type DoctorVerificationStatus = 'verified' | 'pending' | 'rejected';

export interface DoctorQualification {
  degree: string;
  institution: string;
  year: number;
  certificate?: string;
}

export interface TimeSlot {
  time: string;
  isAvailable: boolean;
  appointmentId?: string;
}

export interface DaySchedule {
  day: string;
  isAvailable: boolean;
  slots: TimeSlot[];
  breakStart?: string;
  breakEnd?: string;
}

export interface DoctorReview {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
  response?: {
    text: string;
    date: string;
  };
}

// ============================================
// CORE DOCTOR INTERFACE
// ============================================
export interface Doctor extends User {
  role: 'doctor';
  specialty: string;
  subSpecialties: string[];
  qualifications: DoctorQualification[];
  medicalLicenseNumber: string;
  experience: number;
  rating: number;
  reviewsCount: number;
  consultationFee: number;
  followUpFee?: number;
  availableFor: ('in-person' | 'video' | 'phone')[];
  languages: string[];
  hospitalId: string;
  hospitalName: string;
  status: DoctorStatus;
  verificationStatus: DoctorVerificationStatus;
  bio?: string;
  awards?: string[];
  publications?: number;
  schedule?: DaySchedule[];
  nextAvailableSlot?: string;
  image?: string;
  waitingTime?: string;
  insuranceAccepted?: string[];
}

// ============================================
// DOCTOR FILTERS
// ============================================
export interface DoctorFilters {
  searchQuery?: string;
  specialty?: string;
  subSpecialty?: string;
  minRating?: number;
  maxFee?: number;
  minExperience?: number;
  availableFor?: 'in-person' | 'video' | 'phone';
  location?: string;
  hospitalId?: string;
  gender?: Gender;
  language?: string;
  status?: DoctorStatus;
  sortBy?: 'rating' | 'experience' | 'fee' | 'reviews' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// ============================================
// DOCTOR STATE
// ============================================
export interface DoctorState {
  doctors: Doctor[];
  filteredDoctors: Doctor[];
  selectedDoctor: Doctor | null;
  filters: DoctorFilters;
  specialties: string[];
  schedule: DaySchedule[];
  reviews: DoctorReview[];
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}