// src/types/bloodDonation.ts

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface BloodDonor {
  id: string;
  userId: string;
  
  // Personal Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  weight: number; // kg - minimum 50kg for donation
  bloodGroup: BloodGroup;
  
  // Address
  address: BloodDonorAddress;
  
  // Medical Info
  medicalConditions: string[];
  isOnMedication: boolean;
  currentMedications: string[];
  hasTattoo: boolean;
  tattooDate?: string;
  hasPiercing: boolean;
  piercingDate?: string;
  hasTraveledAbroad: boolean;
  traveledCountries: string[];
  travelDates: string[];
  
  // Donation History
  totalDonations: number;
  lastDonationDate: string;
  nextEligibleDate: string;
  isEligible: boolean;
  donationHistory: Donation[];
  
  // Status
  isVerified: boolean;
  isAvailable: boolean;
  isActive: boolean;
  status: 'active' | 'inactive' | 'temporary-deferred' | 'permanent-deferred';
  deferralReason?: string;
  deferralUntil?: string;
  
  // Emergency
  isEmergencyDonor: boolean;
  emergencyContact: EmergencyContact;
  
  // Rewards
  rewardPoints: number;
  rewards: DonorReward[];
  
  // Preferences
  preferredDonationCenter: string;
  preferredTime: 'morning' | 'afternoon' | 'evening';
  notificationPreferences: NotificationPreference;
  
  // Documents
  documents: DonorDocument[];
  
  // Stats
  livesSaved: number;
  donatedUnits: number;
  lastUpdated: string;
  registeredDate: string;
}

export interface BloodDonorAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface NotificationPreference {
  sms: boolean;
  email: boolean;
  pushNotification: boolean;
  emergencyAlerts: boolean;
  donationReminders: boolean;
}

export interface DonorDocument {
  id: string;
  type: 'id-proof' | 'medical-certificate' | 'donation-certificate' | 'other';
  name: string;
  fileUrl: string;
  uploadDate: string;
  verified: boolean;
}

export interface Donation {
  id: string;
  donorId: string;
  date: string;
  bloodGroup: BloodGroup;
  units: number;
  donationType: 'whole-blood' | 'plasma' | 'platelets' | 'double-red-cells';
  location: string;
  hospitalName: string;
  bloodBankName: string;
  recipientInfo?: string;
  certificateId: string;
  certificateUrl: string;
  rewardPointsEarned: number;
  notes?: string;
  verifiedBy: string;
  createdAt: string;
}

export interface DonorReward {
  id: string;
  type: 'points' | 'badge' | 'certificate' | 'gift-card';
  name: string;
  description: string;
  points: number;
  earnedDate: string;
  expiryDate?: string;
  status: 'active' | 'used' | 'expired';
}

export interface BloodStock {
  id: string;
  bloodBankId: string;
  bloodBankName: string;
  bloodGroup: BloodGroup;
  units: number;
  expiryDate: string;
  status: 'sufficient' | 'low' | 'critical' | 'out-of-stock';
  lastUpdated: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface BloodRequest {
  id: string;
  requestNumber: string;
  patientName: string;
  patientAge: number;
  patientBloodGroup: BloodGroup;
  units: number;
  hospitalName: string;
  doctorName: string;
  urgency: 'normal' | 'urgent' | 'emergency';
  status: 'pending' | 'approved' | 'processing' | 'fulfilled' | 'rejected';
  requestDate: string;
  requiredDate: string;
  reason: string;
  location: string;
  contactPhone: string;
  contactEmail: string;
}

export interface EmergencyAlert {
  id: string;
  bloodGroup: BloodGroup;
  units: number;
  hospitalName: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  urgency: 'emergency';
  patientCondition: string;
  contactPhone: string;
  createdAt: string;
  expiresAt: string;
  respondedDonors: number;
  status: 'active' | 'fulfilled' | 'expired';
}

export interface BloodDonationCamp {
  id: string;
  name: string;
  organizer: string;
  date: string;
  time: string;
  location: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  expectedDonors: number;
  registeredDonors: number;
  bloodGroupsNeeded: BloodGroup[];
  facilities: string[];
  contactPhone: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export interface DonorStats {
  totalDonors: number;
  availableDonors: number;
  todayDonations: number;
  thisMonthDonations: number;
  totalUnitsDonated: number;
  livesSaved: number;
  bloodGroupDistribution: Record<BloodGroup, number>;
  donationTrends: {
    labels: string[];
    values: number[];
  };
}

export interface DonationCertificate {
  id: string;
  donorName: string;
  bloodGroup: BloodGroup;
  donationDate: string;
  units: number;
  hospitalName: string;
  certificateNumber: string;
  issuedBy: string;
  issuedDate: string;
  qrCode: string;
  verificationUrl: string;
}

export interface BloodDonorSearch {
  bloodGroup?: BloodGroup;
  location?: string;
  radius: number; // km
  availability: 'all' | 'available' | 'emergency';
  sortBy: 'distance' | 'rating' | 'donations';
}

export interface DonationReminder {
  id: string;
  donorId: string;
  nextEligibleDate: string;
  reminderDate: string;
  status: 'pending' | 'sent' | 'cancelled';
  type: 'email' | 'sms' | 'push';
  message: string;
  createdAt: string;
}