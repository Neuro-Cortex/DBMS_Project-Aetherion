// src/types/auth.ts
export type AccountRole =
  | 'normal_user'
  | 'client'
  | 'doctor'
  | 'hospital'
  | 'hospital_admin'
  | 'hospital_authority'
  | 'blood_donor'
  | 'pharmacy'
  | 'pharmacy_admin'
  | 'admin'
  | 'admin_applicant'
  | 'emergency_volunteer';

export type Gender = 'male' | 'female' | 'other';

export type ProfileUpgrade =
  | 'client_patient'
  | 'blood_donor'
  | 'pharmacy_user'
  | 'emergency_volunteer';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  name?: string;
  phone?: string;
  gender: Gender;
  primaryRole: AccountRole;
  role?: AccountRole;
  roles: AccountRole[];
  upgrades: ProfileUpgrade[];
  isAdminApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorProfile extends UserProfile {
  specialization: string;
  licenseNumber: string;
  experience: number;
  qualifications: string[];
  hospitalAffiliation?: string;
  consultationFee: number;
  availableSlots: TimeSlot[];
}

export interface HospitalProfile extends UserProfile {
  hospitalName: string;
  registrationNumber: string;
  bedCapacity: number;
  icuCapacity: number;
  emergencyServices: boolean;
  address: HospitalAddress;
  departments: string[];
}

export interface BloodDonorProfile extends UserProfile {
  bloodGroup: string;
  lastDonationDate?: string;
  donationCount: number;
  isAvailable: boolean;
  medicalConditions: string[];
}

export interface PharmacyProfile extends UserProfile {
  pharmacyName: string;
  licenseNumber: string;
  address: string;
  operatingHours: string;
  deliveryAvailable: boolean;
  inventoryCount: number;
}

export interface TimeSlot {
  day: string;
  startTime: string;
  endTime: string;
}

export interface HospitalAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

/*
Legacy design notes preserved:
- Profile upgrades: Client/Patient, Blood Donor, Pharmacy User, Emergency Volunteer.
- Account roles: Normal User, Doctor, Hospital Authority, Blood Donor, Pharmacy, Admin Applicant.
- Registration UI displays icons, badges, and descriptions for all role choices.
*/
