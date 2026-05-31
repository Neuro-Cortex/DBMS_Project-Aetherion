// src/types/emergency.ts - সম্পূর্ণ ঠিক করা version

import { Address } from './user';

// ============================================
// EMERGENCY SERVICE TYPES
// ============================================

export type EmergencyServiceType = 'ambulance' | 'blood' | 'oxygen' | 'doctor' | 'emergency-room' | 'helicopter';

export type EmergencyServiceStatus = 'available' | 'busy' | 'dispatched' | 'offline' | 'maintenance';

export type EmergencyPriority = 'low' | 'medium' | 'high' | 'critical';

export type EmergencyRequestStatus = 'pending' | 'dispatched' | 'en-route' | 'arrived' | 'completed' | 'cancelled';

// ============================================
// EMERGENCY SERVICE INTERFACE
// ============================================
export interface EmergencyService {
  id: string;
  name: string;
  type: EmergencyServiceType;
  status: EmergencyServiceStatus;
  provider: string;
  phone: string;
  location: Address;
  eta?: number; // in minutes
  capacity?: number;
  currentLoad?: number;
  vehicleNumber?: string;
  crewMembers?: number;
  equipment?: string[];
  lastDispatchedAt?: string;
  rating?: number;
  price?: number;
}

// ============================================
// EMERGENCY REQUEST INTERFACE
// ============================================
export interface EmergencyRequest {
  id: string;
  type: EmergencyServiceType;
  priority: EmergencyPriority;
  status: EmergencyRequestStatus;
  patientId?: string;
  patientName?: string;
  patientPhone?: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  notes?: string;
  serviceId?: string;
  serviceName?: string;
  estimatedTime?: number;
  requestedAt: string;
  dispatchedAt?: string;
  arrivedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

// ============================================
// EMERGENCY REQUEST PAYLOAD
// ============================================
export interface CreateEmergencyRequestPayload {
  type: EmergencyServiceType;
  priority: EmergencyPriority;
  patientId?: string;
  patientName?: string;
  patientPhone?: string;
  location: string;
  coordinates?: { lat: number; lng: number };
  notes?: string;
}

// ============================================
// EMERGENCY RESOURCE TRACKING
// ============================================
export interface EmergencyResource {
  id: string;
  type: 'ventilator' | 'monitor' | 'defibrillator' | 'stretcher' | 'oxygen-cylinder';
  total: number;
  available: number;
  status: 'operational' | 'low' | 'critical' | 'maintenance';
  lastServiced: string;
}

export interface EmergencyStaff {
  role: 'doctor' | 'nurse' | 'paramedic' | 'driver';
  total: number;
  available: number;
  onCall: number;
  onDuty: number;
}

// ============================================
// EMERGENCY STATE
// ============================================
export interface EmergencyState {
  services: EmergencyService[];
  requests: EmergencyRequest[];
  activeRequests: EmergencyRequest[];
  criticalRequests: EmergencyRequest[];
  resources: EmergencyResource[];
  staff: EmergencyStaff[];
  isLoading: boolean;
  error: string | null;
  isMonitoring: boolean;
}

// ============================================
// EMERGENCY STATS
// ============================================
export interface EmergencyStats {
  totalServices: number;
  availableServices: number;
  activeRequests: number;
  criticalRequests: number;
  avgResponseTime: number; // in minutes
  byType: Record<EmergencyServiceType, number>;
  byPriority: Record<EmergencyPriority, number>;
  successRate: number;
}