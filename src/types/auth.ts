// src/types/auth.ts
export type AccountRole = 
  | 'normal_user'
  | 'doctor'
  | 'hospital_authority'
  | 'blood_donor'
  | 'pharmacy'
  | 'admin_applicant';

export type Gender = 'male' | 'female';

export type ProfileUpgrade = 
  | 'client_patient'
  | 'blood_donor'
  | 'pharmacy_user'
  | 'emergency_volunteer';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  gender: Gender;
  primaryRole: AccountRole;
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


// src/types/auth.ts
export type AccountRole = 
  | 'normal_user'
  | 'doctor'
  | 'hospital_authority'
  | 'blood_donor'
  | 'pharmacy'
  | 'admin_applicant';


  // ✅ All 4 upgrades defined
ProfileUpgrade = 'client_patient' | 'blood_donor' | 'pharmacy_user' | 'emergency_volunteer'

// ✅ Upgrade UI with features displayed
- Client/Patient Profile (Full healthcare access)
- Blood Donor Profile (Donation tracking)
- Pharmacy User (Medicine ordering)
- Emergency Volunteer (Crisis response)

  // ✅ All 6 types defined
AccountRole = 'normal_user' | 'doctor' | 'hospital_authority' | 'blood_donor' | 'pharmacy' | 'admin_applicant'

// ✅ All displayed with icons, badges, and descriptions
- Normal User / Client (Flexible badge)
- Doctor (Professional badge)
- Hospital Authority (Institution badge)
- Blood Donor (Lifesaver badge)
- Pharmacy (Business badge)
- Apply for Admin Access (Advanced badge)

export type Gender = 'male' | 'female';

export type ProfileUpgrade = 
  | 'client_patient'
  | 'blood_donor'
  | 'pharmacy_user'
  | 'emergency_volunteer';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  gender: Gender;
  primaryRole: AccountRole;
  roles: AccountRole[];
  upgrades: ProfileUpgrade[];
  isAdminApproved: boolean;
  createdAt: string;
  updatedAt: string;
}