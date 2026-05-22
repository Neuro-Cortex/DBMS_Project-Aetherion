// src/types/hospital.ts

// ============================================
// Core hospital (admin / dashboard)
// ============================================

export interface Hospital {
  id: string;
  name: string;
  registrationNumber: string;
  type: 'government' | 'private' | 'charitable' | 'general' | 'multispecialty' | 'community' | 'teaching' | 'specialized';

  phone: string;
  emergencyPhone: string;
  email: string;
  website?: string;

  address: HospitalAddress;

  rating: number;
  reviewCount: number;
  totalBeds: number;
  occupiedBeds: number;
  availableBeds: number;

  icuTotalBeds: number;
  icuOccupiedBeds: number;
  icuAvailableBeds: number;
  icuWithVentilator: number;
  icuWithoutVentilator: number;

  emergencyServiceStatus: 'active' | 'busy' | 'unavailable';
  emergencyResponseTime: string;
  ambulanceCount: number;
  ambulanceAvailable: number;

  oxygenCylinders: OxygenStock;
  bloodBank: BloodBank;
  departments: Department[];

  totalDoctors: number;
  totalNurses: number;
  totalStaff: number;

  services: string[];
  facilities: string[];
  insuranceAccepted: string[];

  workingHours: WorkingHours;
  visitingHours: VisitingHours;

  coordinates: {
    latitude: number;
    longitude: number;
  };

  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;

  // Extended properties for hospital service
  location?: HospitalLocation & { coordinates?: { lat: number; lng: number } };
  rating?: number;
  reviewsCount?: number;
  beds?: {
    total: number;
    available: number;
    icu: { total: number; available: number };
    emergency?: { total: number; available: number };
  };
  emergency?: boolean;
  verified?: boolean;
  distance?: number;
  eta?: number;
  ambulanceAvailable?: boolean;
  oxygenAvailable?: boolean;
  pharmacy?: boolean;
  departments?: Department[] | string[];
}

export interface HospitalAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  landmark?: string;
}

export interface OxygenStock {
  total: number;
  available: number;
  inUse: number;
  reserved: number;
  lastRefilled: string;
  supplier: string;
  cylinderTypes: CylinderType[];
}

export interface CylinderType {
  type: string;
  capacity: string;
  total: number;
  available: number;
}

export interface BloodBank {
  isAvailable: boolean;
  bloodStock: BloodStock[];
  lastUpdated: string;
  totalUnits: number;
  expiryAlerts: number;
}

export interface BloodStock {
  bloodGroup: BloodGroup;
  units: number;
  expiryDate: string;
  status: 'sufficient' | 'low' | 'critical' | 'out-of-stock';
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export interface Department {
  id: string;
  name: string;
  description: string;
  headDoctor: string;
  headDoctorId: string;
  totalBeds: number;
  availableBeds: number;
  totalDoctors: number;
  totalNurses: number;
  services: string[];
  isActive: boolean;
  timings: string;
}

export interface WorkingHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
  isOpen: boolean;
}

export interface VisitingHours {
  morning: VisitingTimeSlot;
  evening: VisitingTimeSlot;
}

export interface VisitingTimeSlot {
  start: string;
  end: string;
}

export interface HospitalDoctor {
  id: string;
  hospitalId: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  department: string;
  designation: string;
  qualification: string;
  experience: number;
  consultationFee: number;
  availability: DoctorAvailability[];
  rating: number;
  reviewCount: number;
  status: 'active' | 'on-leave' | 'inactive';
  joinedDate: string;
  profileImage?: string;
}

export interface DoctorAvailability {
  day: string;
  startTime: string;
  endTime: string;
  maxPatients: number;
}

export interface BloodDonor {
  id: string;
  name: string;
  email: string;
  phone: string;
  bloodGroup: BloodGroup;
  age: number;
  gender: string;
  address: string;
  lastDonationDate?: string;
  totalDonations: number;
  isVerified: boolean;
  isAvailable: boolean;
  medicalConditions: string[];
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'blocked';
}

export interface BloodRequest {
  id: string;
  requestNumber: string;
  patientName: string;
  patientAge: number;
  bloodGroup: BloodGroup;
  units: number;
  hospitalName: string;
  doctorName: string;
  urgency: 'normal' | 'urgent' | 'emergency';
  status: 'pending' | 'approved' | 'processing' | 'fulfilled' | 'rejected';
  requestDate: string;
  requiredDate: string;
  reason: string;
  approvedBy?: string;
  fulfilledBy?: string;
}

export interface Ambulance {
  id: string;
  vehicleNumber: string;
  type: 'basic' | 'advanced' | 'cardiac' | 'neonatal' | 'mobile-icu';
  status: 'available' | 'on-call' | 'maintenance' | 'offline';
  currentLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  driverName: string;
  driverPhone: string;
  paramedicName?: string;
  equipment: string[];
  lastService: string;
  nextService: string;
  isACAvailable: boolean;
  hasOxygenSupport: boolean;
}

export interface AmbulanceRequest {
  id: string;
  patientName: string;
  patientPhone: string;
  pickupLocation: string;
  dropLocation: string;
  emergencyType: string;
  status: 'pending' | 'dispatched' | 'picked-up' | 'arrived' | 'cancelled';
  assignedAmbulance?: string;
  requestTime: string;
  dispatchTime?: string;
  estimatedArrival: string;
}

export interface EmergencyAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'general' | 'emergency' | 'blood-camp' | 'health-camp' | 'awareness';
  priority: 'low' | 'medium' | 'high' | 'critical';
  targetAudience: 'all' | 'doctors' | 'patients' | 'staff' | 'public';
  createdBy: string;
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
  attachments?: string[];
}

export interface ICUBed {
  id: string;
  bedNumber: string;
  hospitalId: string;
  hospitalName: string;
  type: 'general-icu' | 'cardiac-icu' | 'neuro-icu' | 'pediatric-icu' | 'neonatal-icu';
  status: 'available' | 'occupied' | 'reserved' | 'maintenance';
  patientName?: string;
  patientId?: string;
  admissionDate?: string;
  hasVentilator: boolean;
  hasMonitor: boolean;
  nurseStation: string;
  floor: string;
  dailyCharge: number;
}

export interface HospitalDashboardData {
  hospital: Hospital;
  todayStats: TodayStats;
  bedStats: BedStats;
  icuStats: ICUStats;
  bloodStats: BloodStats;
  oxygenStats: OxygenStats;
  emergencyStats: EmergencyStats;
  ambulanceStats: AmbulanceStats;
  recentActivities: HospitalActivity[];
  pendingApprovals: PendingApproval[];
  alerts: Alert[];
  analytics: HospitalAnalytics;
}

export interface TodayStats {
  totalPatients: number;
  newAdmissions: number;
  discharges: number;
  emergencies: number;
  surgeries: number;
  deaths: number;
  births: number;
}

export interface BedStats {
  total: number;
  occupied: number;
  available: number;
  reserved: number;
  occupancyRate: number;
  byDepartment: DepartmentBedStat[];
}

export interface DepartmentBedStat {
  department: string;
  total: number;
  occupied: number;
  available: number;
}

export interface ICUStats {
  total: number;
  occupied: number;
  available: number;
  onVentilator: number;
  criticalPatients: number;
  averageStay: string;
}

export interface BloodStats {
  totalUnits: number;
  expiringSoon: number;
  criticalGroups: BloodGroup[];
  todayRequests: number;
  todayDonations: number;
}

export interface OxygenStats {
  totalCylinders: number;
  inUse: number;
  available: number;
  reserved: number;
  daysLeft: number;
}

export interface EmergencyStats {
  todayEmergencies: number;
  activeEmergencies: number;
  averageResponseTime: string;
  ambulancesDispatched: number;
}

export interface AmbulanceStats {
  total: number;
  available: number;
  onCall: number;
  inMaintenance: number;
}

export interface HospitalActivity {
  id: string;
  type: 'admission' | 'discharge' | 'emergency' | 'surgery' | 'blood' | 'ambulance' | 'other';
  description: string;
  time: string;
  department?: string;
  user?: string;
}

export interface PendingApproval {
  id: string;
  type: 'doctor' | 'blood-donor' | 'blood-request' | 'leave';
  name: string;
  details: string;
  requestDate: string;
  priority: 'normal' | 'urgent';
}

export interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  message: string;
  time: string;
  isRead: boolean;
}

export interface HospitalAnalytics {
  patientFlow: {
    labels: string[];
    admissions: number[];
    discharges: number[];
  };
  bedOccupancy: {
    labels: string[];
    rates: number[];
  };
  bloodUsage: {
    labels: string[];
    used: number[];
    donated: number[];
  };
  revenue: {
    labels: string[];
    amount: number[];
  };
}

// ============================================
// Legacy listing / card types (public directory)
// ============================================

export type HospitalType =
  | 'general'
  | 'multispecialty'
  | 'teaching'
  | 'community'
  | 'specialty'
  | 'clinic'
  | 'trauma';

export interface BedInfo {
  type: string;
  total: number;
  occupied: number;
  available: number;
  pricePerDay: number;
  features?: string[];
}

export interface BedSummary {
  total: number;
  available: number;
  icu: { total: number; available: number };
  emergency: number;
}

export interface HospitalContact {
  phone: string;
  emergencyPhone?: string;
  email: string;
  website?: string;
}

export interface HospitalLocation {
  address: string;
  city: string;
  state: string;
  coordinates?: { lat: number; lng: number };
}

/** Hospital card / search listing shape used by mock data and public pages */
export interface HospitalListItem {
  id: string;
  name: string;
  type: HospitalType;
  location?: HospitalLocation;
  address?: {
    city?: string;
    state?: string;
    address?: string;
  };
  contact?: HospitalContact;
  beds?: BedInfo[] | BedSummary;
  services?: string[];
  specialties?: string[];
  doctorsCount?: number;
  rating: number;
  reviewCount: number;
  emergency?: boolean;
  emergencyAvailable?: boolean;
  ambulance?: boolean;
  ambulanceAvailable?: boolean;
  bloodBank?: boolean;
  bloodBankAvailable?: boolean;
  oxygen?: boolean;
  oxygenAvailable?: boolean;
  verified?: boolean;
  isVerified?: boolean;
  premium?: boolean;
  isPremium?: boolean;
  distance?: number;
  eta?: number;
  image?: string;
  images?: string[];
  established?: number;
  establishedYear?: number;
  accreditation?: string[];
}

export interface HospitalCardProps {
  hospital: HospitalListItem;
  onViewBeds?: (hospital: HospitalListItem) => void;
  variant?: 'default' | 'compact' | 'featured';
}

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

export interface BookBedPayload {
  hospitalId: string;
  bedType: string;
  patientId: string;
  patientName: string;
  admittedAt: string;
  expectedDischarge?: string;
}

export interface HospitalState {
  hospitals: HospitalListItem[];
  nearbyHospitals: HospitalListItem[];
  emergencyHospitals: HospitalListItem[];
  selectedHospital: HospitalListItem | null;
  beds: BedInfo[];
  isLoading: boolean;
  error: string | null;
}
