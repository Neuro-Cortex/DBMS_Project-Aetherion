// src/types/admin.ts

export interface Admin {
  id: string;
  username: string;
  email: string;
  password?: string;
  fullName: string;
  role: 'super-admin' | 'admin' | 'moderator' | 'support';
  permissions: AdminPermission[];
  phone: string;
  avatar?: string;
  lastLogin: string;
  isActive: boolean;
  isTwoFactorEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminPermission {
  module: AdminModule;
  actions: ('create' | 'read' | 'update' | 'delete' | 'approve' | 'block')[];
}

export type AdminModule = 
  | 'users' | 'doctors' | 'hospitals' | 'pharmacies' 
  | 'blood-bank' | 'donors' | 'appointments' | 'reports'
  | 'feedback' | 'emergency' | 'security' | 'settings';

export interface SystemStats {
  totalUsers: number;
  totalDoctors: number;
  totalHospitals: number;
  totalPharmacies: number;
  totalBloodDonors: number;
  totalAppointments: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  verifiedDoctors: number;
  pendingVerifications: number;
  blockedUsers: number;
  totalDonations: number;
  totalBloodUnits: number;
  livesSaved: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: 'client' | 'doctor' | 'hospital' | 'pharmacy' | 'blood-donor';
  status: 'active' | 'inactive' | 'blocked' | 'pending';
  isVerified: boolean;
  registeredDate: string;
  lastActive: string;
  totalReports?: number;
  warnings?: number;
}

export interface DoctorVerification {
  id: string;
  doctorId: string;
  doctorName: string;
  email: string;
  phone: string;
  specialization: string;
  qualification: string;
  licenseNumber: string;
  documents: VerificationDocument[];
  status: 'pending' | 'approved' | 'rejected' | 'more-info';
  submittedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
  rejectionReason?: string;
  notes?: string;
}

export interface VerificationDocument {
  id: string;
  type: 'license' | 'degree' | 'id-proof' | 'certificate' | 'other';
  name: string;
  fileUrl: string;
  uploadDate: string;
  verified: boolean;
}

export interface HospitalVerification {
  id: string;
  hospitalId: string;
  hospitalName: string;
  registrationNumber: string;
  type: string;
  documents: VerificationDocument[];
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
  reviewedBy?: string;
  reviewedDate?: string;
}

export interface PharmacyVerification {
  id: string;
  pharmacyId: string;
  pharmacyName: string;
  licenseNumber: string;
  pharmacistName: string;
  documents: VerificationDocument[];
  status: 'pending' | 'approved' | 'rejected';
  submittedDate: string;
}

export interface SystemAnalytics {
  userGrowth: ChartData;
  doctorDistribution: ChartData;
  appointmentTrends: ChartData;
  bloodDonationTrends: ChartData;
  revenueAnalytics: ChartData;
  userActivity: UserActivity[];
  popularDoctors: PopularItem[];
  topHospitals: PopularItem[];
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
  }[];
}

export interface UserActivity {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  description: string;
  ipAddress: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface PopularItem {
  id: string;
  name: string;
  category: string;
  rating: number;
  totalInteractions: number;
  trend: 'up' | 'down' | 'stable';
}

export interface BloodStockAnalytics {
  totalBloodBanks: number;
  totalUnits: number;
  availableUnits: number;
  expiringUnits: number;
  bloodGroupDistribution: Record<string, number>;
  donationTrends: ChartData;
  usageTrends: ChartData;
  criticalAlerts: BloodAlert[];
}

export interface BloodAlert {
  id: string;
  bloodBank: string;
  bloodGroup: string;
  status: 'low' | 'critical' | 'out-of-stock';
  unitsLeft: number;
  lastUpdated: string;
}

export interface Report {
  id: string;
  title: string;
  type: 'user' | 'doctor' | 'hospital' | 'donation' | 'financial' | 'system';
  generatedBy: string;
  generatedDate: string;
  parameters: Record<string, unknown>;
  format: 'pdf' | 'excel' | 'csv';
  downloadUrl: string;
  fileSize: string;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  type: 'complaint' | 'suggestion' | 'review' | 'bug-report';
  subject: string;
  message: string;
  rating?: number;
  status: 'pending' | 'reviewed' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedDate: string;
  resolvedBy?: string;
  resolvedDate?: string;
  response?: string;
}

export interface EmergencyAlert {
  id: string;
  type: 'blood' | 'oxygen' | 'ambulance' | 'medical' | 'disaster';
  title: string;
  description: string;
  location: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'responding' | 'resolved';
  reportedBy: string;
  reportedDate: string;
  responders: EmergencyResponder[];
  updates: EmergencyUpdate[];
}

export interface EmergencyResponder {
  id: string;
  name: string;
  type: 'hospital' | 'ambulance' | 'doctor' | 'volunteer';
  status: 'dispatched' | 'arrived' | 'completed';
  estimatedArrival: string;
  contactPhone: string;
}

export interface EmergencyUpdate {
  id: string;
  message: string;
  timestamp: string;
  updatedBy: string;
}

export interface SecurityLog {
  id: string;
  event: string;
  userId?: string;
  userName?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'success' | 'failed' | 'blocked';
  details: string;
}

export interface AdminDashboardData {
  stats: SystemStats;
  analytics: SystemAnalytics;
  pendingVerifications: {
    doctors: number;
    hospitals: number;
    pharmacies: number;
  };
  recentActivities: UserActivity[];
  bloodAlerts: BloodAlert[];
  activeEmergencies: EmergencyAlert[];
  recentFeedbacks: Feedback[];
  securityAlerts: SecurityLog[];
  systemHealth: SystemHealth;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
  responseTime: string;
  lastIncident: string;
}