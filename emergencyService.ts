// src/services/emergencyService.ts

import api, { simulateDelay } from './api';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface EmergencyService {
  id: string;
  name: string;
  type: 'ambulance' | 'blood' | 'oxygen' | 'doctor' | 'emergency-room';
  status: 'available' | 'busy' | 'critical' | 'dispatched';
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
  type: 'ambulance' | 'blood' | 'oxygen' | 'doctor';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  status: 'pending' | 'dispatched' | 'completed' | 'cancelled';
  timestamp: string;
  estimatedTime?: number;
  assignedServiceId?: string;
  notes?: string;
  patientId?: string;
  resolvedAt?: string;
}

export interface CreateEmergencyRequest {
  type: EmergencyRequest['type'];
  priority: EmergencyRequest['priority'];
  location: string;
  patientId: string;
  notes?: string;
  contactNumber?: string;
  patientName?: string;
}

export interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: 'A+' | 'A-' | 'B+' | 'B-' | 'O+' | 'O-' | 'AB+' | 'AB-';
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
  stock: 'in-stock' | 'limited' | 'out-of-stock';
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
// ENHANCED MOCK DATA
// ============================================

const mockServices: EmergencyService[] = [
  {
    id: 'amb_001',
    name: 'Ambulance Unit Alpha',
    type: 'ambulance',
    status: 'available',
    location: { lat: 40.7128, lng: -74.0060, address: '123 Main St, Downtown' },
    eta: 8,
    provider: 'City EMS',
    phone: '+1 (555) 100-1001',
    rating: 4.8,
    availableUnits: 3,
    price: 50
  },
  {
    id: 'amb_002',
    name: 'Ambulance Unit Bravo',
    type: 'ambulance',
    status: 'dispatched',
    location: { lat: 40.7580, lng: -73.9855, address: '456 Broadway, Midtown' },
    eta: 12,
    provider: 'Metro Ambulance',
    phone: '+1 (555) 100-1002',
    rating: 4.6,
    availableUnits: 1,
    price: 55
  },
  {
    id: 'amb_003',
    name: 'Life Support Ambulance',
    type: 'ambulance',
    status: 'available',
    location: { lat: 40.7549, lng: -73.9840, address: '789 5th Ave' },
    eta: 5,
    provider: 'Life Support Inc',
    phone: '+1 (555) 100-1003',
    rating: 4.9,
    availableUnits: 2,
    price: 60
  },
  {
    id: 'er_001',
    name: 'Emergency Room - City Hospital',
    type: 'emergency-room',
    status: 'busy',
    location: { lat: 40.7128, lng: -74.0060, address: '500 Medical Center Dr' },
    eta: 0,
    provider: 'City Hospital',
    phone: '+1 (555) 911-0001',
    rating: 4.7
  },
  {
    id: 'er_002',
    name: 'Emergency Room - Metro Medical',
    type: 'emergency-room',
    status: 'available',
    location: { lat: 40.7580, lng: -73.9855, address: '200 Health Way' },
    eta: 0,
    provider: 'Metro Medical Center',
    phone: '+1 (555) 911-0002',
    rating: 4.5
  },
  {
    id: 'blood_001',
    name: 'Blood Bank Central',
    type: 'blood',
    status: 'available',
    location: { lat: 40.7128, lng: -74.0060, address: '100 Red Cross Square' },
    eta: 20,
    provider: 'Red Cross',
    phone: '+1 (555) 200-2001',
    rating: 4.9
  },
  {
    id: 'oxygen_001',
    name: 'Oxygen Supply Unit',
    type: 'oxygen',
    status: 'available',
    location: { lat: 40.7580, lng: -73.9855, address: '300 Medical Supply Blvd' },
    eta: 15,
    provider: 'MedSupply Co',
    phone: '+1 (555) 300-3001',
    rating: 4.6,
    price: 25
  },
  {
    id: 'doctor_001',
    name: 'On-Call Doctor Team',
    type: 'doctor',
    status: 'available',
    location: { lat: 40.7128, lng: -74.0060, address: 'City Hospital' },
    eta: 10,
    provider: 'City Hospital',
    phone: '+1 (555) 911-0001',
    rating: 4.8
  }
];

const mockBloodDonors: BloodDonor[] = [
  {
    id: 'donor_001',
    name: 'Rahman Ahmed',
    bloodGroup: 'A+',
    location: 'Gulshan, Dhaka',
    distance: 2.5,
    phone: '+8801712345678',
    lastDonated: '2024-02-15',
    available: true
  },
  {
    id: 'donor_002',
    name: 'Fatema Begum',
    bloodGroup: 'O-',
    location: 'Banani, Dhaka',
    distance: 3.2,
    phone: '+8801712345679',
    lastDonated: '2024-01-20',
    available: true
  },
  {
    id: 'donor_003',
    name: 'Karim Hossain',
    bloodGroup: 'B+',
    location: 'Dhanmondi, Dhaka',
    distance: 1.8,
    phone: '+8801712345680',
    lastDonated: '2024-03-01',
    available: true
  },
  {
    id: 'donor_004',
    name: 'Nusrat Jahan',
    bloodGroup: 'AB+',
    location: 'Uttara, Dhaka',
    distance: 5.5,
    phone: '+8801712345681',
    lastDonated: '2023-12-10',
    available: false
  }
];

const mockOxygenSuppliers: OxygenSupplier[] = [
  {
    id: 'oxy_001',
    name: 'Health Plus Oxygen',
    location: 'Gulshan, Dhaka',
    distance: 1.5,
    price: 15,
    stock: 'in-stock',
    phone: '+8801712345682',
    deliveryTime: '30 mins',
    is24Hours: true
  },
  {
    id: 'oxy_002',
    name: 'MediCare Oxygen',
    location: 'Banani, Dhaka',
    distance: 2.3,
    price: 12,
    stock: 'limited',
    phone: '+8801712345683',
    deliveryTime: '45 mins',
    is24Hours: false
  },
  {
    id: 'oxy_003',
    name: 'Life Gas Supply',
    location: 'Dhanmondi, Dhaka',
    distance: 3.0,
    price: 18,
    stock: 'in-stock',
    phone: '+8801712345684',
    deliveryTime: '25 mins',
    is24Hours: true
  }
];

const mockRequests: EmergencyRequest[] = [
  {
    id: 'emr_001',
    type: 'ambulance',
    priority: 'critical',
    location: '123 Main St, Downtown',
    status: 'dispatched',
    timestamp: new Date().toISOString(),
    estimatedTime: 8,
    assignedServiceId: 'amb_002',
    notes: 'Patient experiencing chest pain',
    patientId: 'pat_001'
  },
  {
    id: 'emr_002',
    type: 'blood',
    priority: 'high',
    location: 'City Hospital, Room 204',
    status: 'pending',
    timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
    estimatedTime: 15,
    notes: 'Blood required for surgery - A+',
    patientId: 'pat_002'
  },
  {
    id: 'emr_003',
    type: 'oxygen',
    priority: 'high',
    location: '456 Park Ave, Apt 12B',
    status: 'pending',
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(),
    estimatedTime: 20,
    notes: 'Oxygen cylinder required for elderly patient',
    patientId: 'pat_003'
  }
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateId = (prefix: string): string => {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

// ============================================
// EMERGENCY SERVICE
// ============================================

export const emergencyService = {
  /**
   * Get all emergency services with optional filters
   */
  getServices: async (type?: EmergencyService['type']): Promise<EmergencyService[]> => {
    await simulateDelay(600);
    
    // TODO: Replace with real API call
    // const response = await api.get<EmergencyService[]>('/emergency/services', { params: { type } });
    // return response.data!;

    if (type) {
      return mockServices.filter(s => s.type === type);
    }
    return [...mockServices];
  },

  /**
   * Get service by ID
   */
  getServiceById: async (id: string): Promise<EmergencyService> => {
    await simulateDelay(400);
    
    // TODO: Replace with real API call
    // const response = await api.get<EmergencyService>(`/emergency/services/${id}`);
    // return response.data!;

    const service = mockServices.find(s => s.id === id);
    if (!service) {
      throw new Error(`Emergency service not found with ID: ${id}`);
    }
    return service;
  },

  /**
   * Get available services by type
   */
  getAvailableServices: async (type?: EmergencyService['type']): Promise<EmergencyService[]> => {
    await simulateDelay(500);
    
    let services = mockServices;
    if (type) {
      services = services.filter(s => s.type === type);
    }
    
    return services.filter(s => s.status === 'available');
  },

  /**
   * Create emergency request
   */
  createRequest: async (data: CreateEmergencyRequest): Promise<EmergencyRequest> => {
    await simulateDelay(1000);
    
    // TODO: Replace with real API call
    // const response = await api.post<EmergencyRequest>('/emergency/requests', data);
    // return response.data!;

    // Find nearest available service based on type
    let estimatedTime = 10;
    let assignedServiceId: string | undefined;
    
    const availableServices = mockServices.filter(s => 
      s.type === data.type && s.status === 'available'
    );
    
    if (availableServices.length > 0) {
      assignedServiceId = availableServices[0].id;
      estimatedTime = availableServices[0].eta || 10;
    }

    const newRequest: EmergencyRequest = {
      id: generateId('emr'),
      type: data.type,
      priority: data.priority,
      location: data.location,
      status: 'pending',
      timestamp: new Date().toISOString(),
      estimatedTime,
      assignedServiceId,
      notes: data.notes,
      patientId: data.patientId
    };

    // Update service status if assigned
    if (assignedServiceId) {
      const serviceIndex = mockServices.findIndex(s => s.id === assignedServiceId);
      if (serviceIndex !== -1) {
        mockServices[serviceIndex].status = 'dispatched';
      }
    }

    // Add to requests list (mock)
    mockRequests.unshift(newRequest);

    return newRequest;
  },

  /**
   * Update emergency request status
   */
  updateRequestStatus: async (
    id: string, 
    status: EmergencyRequest['status']
  ): Promise<EmergencyRequest> => {
    await simulateDelay(500);
    
    // TODO: Replace with real API call
    // const response = await api.put<EmergencyRequest>(`/emergency/requests/${id}`, { status });
    // return response.data!;

    const requestIndex = mockRequests.findIndex(r => r.id === id);
    if (requestIndex === -1) {
      throw new Error(`Emergency request not found with ID: ${id}`);
    }

    mockRequests[requestIndex].status = status;
    
    if (status === 'completed' || status === 'cancelled') {
      mockRequests[requestIndex].resolvedAt = new Date().toISOString();
      
      // Free up assigned service
      const assignedServiceId = mockRequests[requestIndex].assignedServiceId;
      if (assignedServiceId) {
        const serviceIndex = mockServices.findIndex(s => s.id === assignedServiceId);
        if (serviceIndex !== -1) {
          mockServices[serviceIndex].status = 'available';
        }
      }
    }

    return mockRequests[requestIndex];
  },

  /**
   * Get all emergency requests
   */
  getRequests: async (status?: EmergencyRequest['status']): Promise<EmergencyRequest[]> => {
    await simulateDelay(700);
    
    // TODO: Replace with real API call
    // const response = await api.get<EmergencyRequest[]>('/emergency/requests', { params: { status } });
    // return response.data!;

    let requests = [...mockRequests];
    if (status) {
      requests = requests.filter(r => r.status === status);
    }
    
    return requests.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  },

  /**
   * Get emergency request by ID
   */
  getRequestById: async (id: string): Promise<EmergencyRequest> => {
    await simulateDelay(400);
    
    const request = mockRequests.find(r => r.id === id);
    if (!request) {
      throw new Error(`Emergency request not found with ID: ${id}`);
    }
    
    return request;
  },

  /**
   * Get available ambulances
   */
  getAvailableAmbulances: async (): Promise<EmergencyService[]> => {
    await simulateDelay(500);
    
    return mockServices.filter(s => 
      s.type === 'ambulance' && s.status === 'available'
    );
  },

  /**
   * Get all blood donors
   */
  getBloodDonors: async (bloodGroup?: string): Promise<BloodDonor[]> => {
    await simulateDelay(600);
    
    let donors = [...mockBloodDonors];
    if (bloodGroup) {
      donors = donors.filter(d => d.bloodGroup === bloodGroup);
    }
    
    return donors.filter(d => d.available);
  },

  /**
   * Search blood donors by location
   */
  searchBloodDonors: async (
    bloodGroup: string,
    location: string,
    maxDistance: number = 5
  ): Promise<BloodDonor[]> => {
    await simulateDelay(800);
    
    let donors = mockBloodDonors.filter(d => 
      d.bloodGroup === bloodGroup && 
      d.available &&
      d.distance <= maxDistance
    );
    
    return donors.sort((a, b) => a.distance - b.distance);
  },

  /**
   * Get oxygen suppliers
   */
  getOxygenSuppliers: async (): Promise<OxygenSupplier[]> => {
    await simulateDelay(500);
    
    return [...mockOxygenSuppliers];
  },

  /**
   * Get nearby oxygen suppliers
   */
  getNearbyOxygenSuppliers: async (location: string, maxDistance: number = 5): Promise<OxygenSupplier[]> => {
    await simulateDelay(600);
    
    let suppliers = mockOxygenSuppliers.filter(s => 
      s.distance <= maxDistance && s.stock !== 'out-of-stock'
    );
    
    return suppliers.sort((a, b) => a.distance - b.distance);
  },

  /**
   * Get emergency contacts
   */
  getEmergencyContacts: async (): Promise<EmergencyContact[]> => {
    await simulateDelay(300);
    
    // Mock emergency contacts
    return [
      {
        id: 'contact_001',
        name: 'Emergency Services',
        relation: 'General',
        phone: '999',
        isPrimary: true
      },
      {
        id: 'contact_002',
        name: 'Ambulance',
        relation: 'Medical',
        phone: '999',
        isPrimary: false
      },
      {
        id: 'contact_003',
        name: 'Police',
        relation: 'Security',
        phone: '999',
        isPrimary: false
      },
      {
        id: 'contact_004',
        name: 'Fire Service',
        relation: 'Emergency',
        phone: '999',
        isPrimary: false
      },
      {
        id: 'contact_005',
        name: 'Poison Control',
        relation: 'Medical',
        phone: '1-800-222-1222',
        isPrimary: false
      }
    ];
  },

  /**
   * Get active emergencies (alerts)
   */
  getActiveEmergencies: async (): Promise<EmergencyAlert[]> => {
    await simulateDelay(400);
    
    // Mock active emergencies
    return [
      {
        id: 'alert_001',
        type: 'Accident',
        severity: 'critical',
        message: 'Major accident reported on Highway 101',
        location: 'Highway 101, Exit 45',
        timestamp: new Date().toISOString(),
        status: 'active'
      },
      {
        id: 'alert_002',
        type: 'Medical Emergency',
        severity: 'high',
        message: 'Heart attack patient needs immediate attention',
        location: '123 Main St, Apartment 4B',
        timestamp: new Date().toISOString(),
        status: 'dispatched'
      }
    ];
  },

  /**
   * Cancel emergency request
   */
  cancelRequest: async (id: string, reason?: string): Promise<EmergencyRequest> => {
    await simulateDelay(400);
    
    const request = await emergencyService.updateRequestStatus(id, 'cancelled');
    
    // TODO: Notify assigned service about cancellation
    // await api.post(`/emergency/requests/${id}/cancel`, { reason });
    
    return request;
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
    await simulateDelay(500);
    
    // Calculate from mock data
    const completed = mockRequests.filter(r => r.status === 'completed');
    const avgTime = completed.reduce((sum, r) => sum + (r.estimatedTime || 0), 0) / (completed.length || 1);
    
    return {
      averageResponseTime: Math.round(avgTime),
      totalRequests: mockRequests.length,
      completedRequests: completed.length,
      criticalResponseTime: 7
    };
  },

  /**
   * Subscribe to emergency alerts (WebSocket simulation)
   */
  subscribeToAlerts: (callback: (alert: EmergencyAlert) => void): (() => void) => {
    // Simulate real-time alerts
    const interval = setInterval(() => {
      const mockAlert: EmergencyAlert = {
        id: `alert_${Date.now()}`,
        type: 'New Emergency',
        severity: 'medium',
        message: 'New emergency reported in your area',
        location: 'Near your location',
        timestamp: new Date().toISOString(),
        status: 'active'
      };
      callback(mockAlert);
    }, 30000); // Every 30 seconds
    
    // Return unsubscribe function
    return () => clearInterval(interval);
  }
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
    subscribeToAlerts: emergencyService.subscribeToAlerts
  };
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default emergencyService;