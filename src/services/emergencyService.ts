// src/services/emergencyService.ts

import api from './api';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface EmergencyServiceType {
  id: string;
  name: string;
  type: 'ambulance' | 'blood' | 'oxygen' | 'doctor' | 'emergency-room' | 'helicopter';
  status: 'available' | 'busy' | 'dispatched' | 'offline' | 'maintenance';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  eta?: number;
  provider: string;
  phone: string;
  rating?: number;
  availableUnits?: number;
  price?: number;
}

export interface EmergencyRequest {
  id: string;
  requested_by?: string;
  patient_name?: string;
  patient_phone?: string;
  type: 'ambulance' | 'blood' | 'oxygen' | 'doctor';
  priority: 'low' | 'medium' | 'high' | 'critical' | 'urgent' | 'emergency';
  location: string;
  pickup_address?: string;
  status: 'pending' | 'dispatched' | 'picked-up' | 'arrived' | 'completed' | 'cancelled';
  timestamp: string;
  estimatedTime?: number;
  assignedServiceId?: string;
  notes?: string;
  patientId?: string;
  resolvedAt?: string;
  emergency_type?: string;
  needs_oxygen?: boolean;
  hospital_id?: string;
}

export interface CreateEmergencyRequest {
  type: EmergencyRequest['type'];
  priority?: EmergencyRequest['priority'];
  location: string;
  patientId?: string;
  notes?: string;
  contactNumber?: string;
  patient_name?: string;
  patient_phone?: string;
  pickup_address?: string;
  emergency_type?: string;
  needs_oxygen?: boolean;
  hospital_id?: string;
}

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: string;
  location: string;
  distance: number;
  phone: string;
  lastDonated?: string;
  available: boolean;
}

export interface OxygenSupplier {
  id: string;
  name: string;
  location: string;
  distance: number;
  price: number;
  stock: string;
  phone: string;
  deliveryTime: string;
  is24Hours: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  isPrimary: boolean;
}

export interface EmergencyAlert {
  id: string;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  location: string;
  timestamp: string;
  status: 'active' | 'resolved' | 'dispatched';
}

// ============================================
// EMERGENCY SERVICE
// ============================================

export const emergencyService = {
  /**
   * Get all emergency services with optional filters
   */
  getServices: async (type?: string): Promise<EmergencyServiceType[]> => {
    const response = await api.get<any>('/emergency/services', { type });
    if (response.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return items.map((s: any) => ({
        id: String(s.id),
        name: s.name,
        type: s.type,
        status: s.status,
        location: {
          lat: s.latitude || 0,
          lng: s.longitude || 0,
          address: s.address || '',
        },
        eta: s.eta_minutes,
        provider: s.provider || '',
        phone: s.phone || '',
        rating: s.rating,
        availableUnits: s.capacity,
        price: s.price,
      }));
    }
    return [];
  },

  /**
   * Get service by ID
   */
  getServiceById: async (id: string): Promise<EmergencyServiceType> => {
    const response = await api.get<any>('/emergency/services/' + id);
    if (response.success && response.data) {
      const s = response.data;
      return {
        id: String(s.id),
        name: s.name,
        type: s.type,
        status: s.status,
        location: { lat: s.latitude || 0, lng: s.longitude || 0, address: s.address || '' },
        eta: s.eta_minutes,
        provider: s.provider || '',
        phone: s.phone || '',
        rating: s.rating,
        availableUnits: s.capacity,
        price: s.price,
      };
    }
    throw new Error(response.message || 'Emergency service not found');
  },

  /**
   * Get available services by type
   */
  getAvailableServices: async (type?: string): Promise<EmergencyServiceType[]> => {
    const services = await emergencyService.getServices(type);
    return services.filter(s => s.status === 'available');
  },

  /**
   * Create emergency request (ambulance)
   */
  createRequest: async (data: CreateEmergencyRequest): Promise<EmergencyRequest> => {
    const payload: any = {
      patient_name: data.patient_name,
      patient_phone: data.contactNumber || data.patient_phone,
      pickup_address: data.pickup_address || data.location,
      emergency_type: data.emergency_type || data.type,
      needs_oxygen: data.needs_oxygen || false,
      hospital_id: data.hospital_id,
    };

    const response = await api.post<any>('/ambulance/request', payload);
    if (response.success && response.data) {
      const r = response.data;
      return {
        id: r.id,
        requested_by: r.requested_by,
        patient_name: r.patient_name,
        patient_phone: r.patient_phone,
        type: data.type,
        priority: data.priority || 'medium',
        location: r.pickup_address || data.location,
        pickup_address: r.pickup_address,
        status: r.status || 'pending',
        timestamp: r.created_at || new Date().toISOString(),
        estimatedTime: r.estimated_arrival,
        notes: data.notes,
      };
    }
    throw new Error(response.message || 'Failed to create emergency request');
  },

  /**
   * Update emergency request status
   */
  updateRequestStatus: async (id: string, status: EmergencyRequest['status']): Promise<EmergencyRequest> => {
    const response = await api.put<any>(`/ambulance/request/${id}/status`, { status });
    if (response.success && response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to update request status');
  },

  /**
   * Get all emergency requests
   */
  getRequests: async (status?: EmergencyRequest['status']): Promise<EmergencyRequest[]> => {
    const params: any = {};
    if (status) params.status = status;

    const response = await api.get<any>('/ambulance/requests', params);
    if (response.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return items.map((r: any) => ({
        id: r.id,
        requested_by: r.requested_by,
        patient_name: r.patient_name,
        patient_phone: r.patient_phone,
        type: r.emergency_type || 'ambulance',
        priority: r.priority || 'medium',
        location: r.pickup_address || '',
        pickup_address: r.pickup_address,
        status: r.status,
        timestamp: r.created_at,
        estimatedTime: r.estimated_arrival,
        notes: r.notes,
      }));
    }
    return [];
  },

  /**
   * Get emergency request by ID
   */
  getRequestById: async (id: string): Promise<EmergencyRequest> => {
    const response = await api.get<any>('/ambulance/requests/' + id);
    if (response.success && response.data) {
      const r = response.data;
      return {
        id: r.id,
        patient_name: r.patient_name,
        type: r.emergency_type || 'ambulance',
        priority: 'medium',
        location: r.pickup_address || '',
        status: r.status,
        timestamp: r.created_at,
        estimatedTime: r.estimated_arrival,
      };
    }
    throw new Error(response.message || 'Request not found');
  },

  /**
   * Get available ambulances
   */
  getAvailableAmbulances: async (): Promise<EmergencyServiceType[]> => {
    return emergencyService.getAvailableServices('ambulance');
  },

  /**
   * Get all blood donors
   */
  getBloodDonors: async (bloodGroup?: string): Promise<BloodDonor[]> => {
    const params: any = {};
    if (bloodGroup) params.blood_group = bloodGroup;

    const response = await api.get<any>('/blood-donation/donors', params);
    if (response.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return items.map((d: any) => ({
        id: String(d.id),
        name: d.user?.full_name || d.name || 'Donor',
        bloodGroup: d.blood_group,
        location: d.preferred_donation_center || '',
        distance: 0,
        phone: d.user?.phone || '',
        lastDonated: d.last_donation_date,
        available: d.is_available && d.is_eligible,
      }));
    }
    return [];
  },

  /**
   * Search blood donors by location
   */
  searchBloodDonors: async (bloodGroup: string, location: string, maxDistance: number = 5): Promise<BloodDonor[]> => {
    const response = await api.get<any>('/blood-donation/donors/search', {
      blood_group: bloodGroup,
      city: location,
    });
    if (response.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return items.map((d: any) => ({
        id: String(d.id),
        name: d.user?.full_name || d.name || 'Donor',
        bloodGroup: d.blood_group,
        location: d.preferred_donation_center || location,
        distance: 0,
        phone: d.user?.phone || '',
        lastDonated: d.last_donation_date,
        available: d.is_available && d.is_eligible,
      }));
    }
    return [];
  },

  /**
   * Get oxygen suppliers
   */
  getOxygenSuppliers: async (): Promise<OxygenSupplier[]> => {
    const response = await api.get<any>('/oxygen/stocks');
    if (response.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return items.map((s: any) => ({
        id: String(s.id),
        name: s.hospital?.name || s.supplier || 'Oxygen Supplier',
        location: s.hospital?.city || '',
        distance: 0,
        price: 0,
        stock: s.status === 'sufficient' ? 'in-stock' : s.status === 'low' ? 'limited' : 'out-of-stock',
        phone: s.supplier_contact || '',
        deliveryTime: '30 mins',
        is24Hours: !!s.emergency_support,
      }));
    }
    return [];
  },

  /**
   * Get nearby oxygen suppliers
   */
  getNearbyOxygenSuppliers: async (location: string, maxDistance: number = 5): Promise<OxygenSupplier[]> => {
    return emergencyService.getOxygenSuppliers();
  },

  /**
   * Get emergency contacts for current user
   */
  getEmergencyContacts: async (): Promise<EmergencyContact[]> => {
    const response = await api.get<any>('/users/me/emergency-contacts');
    if (response.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data?.data || [];
      if (items.length === 0) {
        // Return default emergency numbers
        return [
          { id: '1', name: 'Emergency Services', relation: 'General', phone: '911', isPrimary: true },
          { id: '2', name: 'Poison Control', relation: 'Medical', phone: '1-800-222-1222', isPrimary: false },
        ];
      }
      return items.map((c: any) => ({
        id: String(c.id),
        name: c.name,
        relation: c.relation,
        phone: c.phone,
        isPrimary: c.is_available,
      }));
    }
    return [
      { id: '1', name: 'Emergency Services', relation: 'General', phone: '911', isPrimary: true },
      { id: '2', name: 'Poison Control', relation: 'Medical', phone: '1-800-222-1222', isPrimary: false },
    ];
  },

  /**
   * Get active emergency announcements
   */
  getActiveEmergencies: async (): Promise<EmergencyAlert[]> => {
    const response = await api.get<any>('/emergency/announcements', { is_active: true });
    if (response.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return items.map((a: any) => ({
        id: String(a.id),
        type: a.type,
        severity: a.priority || 'medium',
        message: a.message,
        location: '',
        timestamp: a.created_at,
        status: 'active',
      }));
    }
    return [];
  },

  /**
   * Cancel emergency request
   */
  cancelRequest: async (id: string, reason?: string): Promise<EmergencyRequest> => {
    return emergencyService.updateRequestStatus(id, 'cancelled');
  },

  /**
   * Get response time statistics
   */
  getResponseStats: async (): Promise<{
    averageResponseTime: number;
    totalRequests: number;
    completedRequests: number;
    criticalResponseTime: number;
  }> => {
    const requests = await emergencyService.getRequests();
    const completed = requests.filter(r => r.status === 'completed');
    const avgTime = completed.reduce((sum, r) => sum + (r.estimatedTime || 0), 0) / (completed.length || 1);

    return {
      averageResponseTime: Math.round(avgTime),
      totalRequests: requests.length,
      completedRequests: completed.length,
      criticalResponseTime: 7,
    };
  },

  /**
   * Subscribe to emergency alerts (placeholder for WebSocket)
   */
  subscribeToAlerts: (callback: (alert: EmergencyAlert) => void): (() => void) => {
    // TODO: Replace with real WebSocket connection when available
    return () => {};
  },
};

// ============================================
// REACT HOOK
// ============================================

export const useEmergencyService = () => {
  return {
    getServices: emergencyService.getServices,
    getServiceById: emergencyService.getServiceById,
    getAvailableServices: emergencyService.getAvailableServices,
    createRequest: emergencyService.createRequest,
    updateRequestStatus: emergencyService.updateRequestStatus,
    getRequests: emergencyService.getRequests,
    getRequestById: emergencyService.getRequestById,
    getAvailableAmbulances: emergencyService.getAvailableAmbulances,
    getBloodDonors: emergencyService.getBloodDonors,
    searchBloodDonors: emergencyService.searchBloodDonors,
    getOxygenSuppliers: emergencyService.getOxygenSuppliers,
    getNearbyOxygenSuppliers: emergencyService.getNearbyOxygenSuppliers,
    getEmergencyContacts: emergencyService.getEmergencyContacts,
    getActiveEmergencies: emergencyService.getActiveEmergencies,
    cancelRequest: emergencyService.cancelRequest,
    getResponseStats: emergencyService.getResponseStats,
    subscribeToAlerts: emergencyService.subscribeToAlerts,
  };
};

export default emergencyService;
