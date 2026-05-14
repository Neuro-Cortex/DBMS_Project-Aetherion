// src/types/hospital.ts
import type { ElementType } from 'react';

// ============================================
// HOSPITAL TYPE
// ============================================
export type HospitalType = 'general' | 'multispecialty' | 'teaching' | 'community' | 'specialty' | 'clinic' | 'trauma';

// ============================================
// BED INFO
// ============================================
export interface BedInfo {
  type: string;
  total: number;
  occupied: number;
  available: number;
  pricePerDay: number;
  features?: string[];
}

// ============================================
// BED SUMMARY (for card display)
// ============================================
export interface BedSummary {
  total: number;
  available: number;
  icu: { total: number; available: number };
  emergency: number;
}

// ============================================
// HOSPITAL CONTACT
// ============================================
export interface HospitalContact {
  phone: string;
  emergencyPhone?: string;
  email: string;
  website?: string;
}

// ============================================
// HOSPITAL LOCATION
// ============================================
export interface HospitalLocation {
  address: string;
  city: string;
  state: string;
  coordinates?: { lat: number; lng: number };
}

// ============================================
// CORE HOSPITAL INTERFACE
// ============================================
export interface Hospital {
  id: string;
  name: string;
  type: HospitalType;
  
  // Location (supports both formats)
  location?: HospitalLocation;
  address?: {
    city?: string;
    state?: string;
    address?: string;
  };
  
  // Contact
  contact?: HospitalContact;
  
  // Beds (supports both formats)
  beds?: BedInfo[] | BedSummary;
  
  // Services & Specialties
  services?: string[];
  specialties?: string[];
  
  // Counts
  doctorsCount?: number;
  rating: number;
  reviewCount: number;
  
  // Flags (supports both naming conventions)
  emergency?: boolean;
  emergencyAvailable?: boolean;
  ambulance?: boolean;
  ambulanceAvailable?: boolean;
  bloodBank?: boolean;
  bloodBankAvailable?: boolean;
  oxygen?: boolean;
  oxygenAvailable?: boolean;
  
  // Status
  verified?: boolean;
  isVerified?: boolean;
  premium?: boolean;
  isPremium?: boolean;
  
  // Location metrics
  distance?: number;
  eta?: number;
  
  // Media
  image?: string;
  images?: string[];
  
  // Meta
  established?: number;
  establishedYear?: number;
  accreditation?: string[];
}

// ============================================
// CARD PROPS
// ============================================
export interface HospitalCardProps {
  hospital: Hospital;
  onViewBeds?: (hospital: Hospital) => void;
  variant?: 'default' | 'compact' | 'featured';
}

// ============================================
// BED BOOKING
// ============================================
export interface BedBooking {
  id: string;
  hospitalId: string;
  bedType: string;
  patientId: string;
  patientName: string;
  admittedAt: string;
  expectedDischarge?: string;
  status: 'pending' | 'confirmed' | 'admitted' | 'discharged' | 'cancelled';
  totalCost?: number;
}

export interface HospitalState {
  hospitals: Hospital[];
  nearbyHospitals: Hospital[];
  emergencyHospitals: Hospital[];
  selectedHospital: Hospital | null;
  beds: BedInfo[];
  isLoading: boolean;
  error: string | null;
}