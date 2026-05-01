// ============================================
// BASE USER TYPES
// ============================================
export type UserRole = 'patient' | 'doctor' | 'admin' | 'staff';

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

export interface EmergencyContact {
  name: string;
  phone: string;
  relation: string;
}

// ============================================
// CORE USER INTERFACE
// ============================================
export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
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
// PATIENT SPECIFIC
// ============================================
export interface Patient extends User {
  role: 'patient';
  bloodGroup?: BloodGroup;
  height?: number; // in cm
  weight?: number; // in kg
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  emergencyContacts: EmergencyContact[];
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

// ============================================
// AUTH TYPES
// ============================================
export interface AuthUser extends User {
  token: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  role: 'patient' | 'doctor';
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

// ============================================
// PROFILE UPDATE
// ============================================
export type ProfileUpdateData = Partial<
  Pick<User, 'name' | 'phone' | 'avatar' | 'gender' | 'dateOfBirth' | 'address'>
>;

export type PatientUpdateData = ProfileUpdateData & {
  bloodGroup?: BloodGroup;
  height?: number;
  weight?: number;
  allergies?: string[];
  chronicConditions?: string[];
};