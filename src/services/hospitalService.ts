// src/services/hospitalService.ts

import {
  HospitalDoctor, BloodDonor, BloodRequest,
  Ambulance, EmergencyAnnouncement, Department,
  ICUBed, HospitalDashboardData, OxygenStock,
  BloodStock, AmbulanceRequest as AmbulanceRequestType, HospitalAnalytics as HospitalAnalyticsType
} from '../types/hospital';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class HospitalServiceAPI {
  private token: string = '';

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  // Hospital Profile
  async getHospitalProfile(): Promise<Hospital> {
    const response = await fetch(`${API_BASE_URL}/hospital/profile`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updateHospitalProfile(data: Partial<Hospital>): Promise<Hospital> {
    const response = await fetch(`${API_BASE_URL}/hospital/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Dashboard
  async getDashboardData(): Promise<HospitalDashboardData> {
    const response = await fetch(`${API_BASE_URL}/hospital/dashboard`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Doctor Management
  async getDoctors(): Promise<HospitalDoctor[]> {
    const response = await fetch(`${API_BASE_URL}/hospital/doctors`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async addDoctor(data: Partial<HospitalDoctor>): Promise<HospitalDoctor> {
    const response = await fetch(`${API_BASE_URL}/hospital/doctors`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async updateDoctor(id: string, data: Partial<HospitalDoctor>): Promise<HospitalDoctor> {
    const response = await fetch(`${API_BASE_URL}/hospital/doctors/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async removeDoctor(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/hospital/doctors/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
  }

  // Department Management
  async getDepartments(): Promise<Department[]> {
    const response = await fetch(`${API_BASE_URL}/hospital/departments`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async addDepartment(data: Partial<Department>): Promise<Department> {
    const response = await fetch(`${API_BASE_URL}/hospital/departments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async updateDepartment(id: string, data: Partial<Department>): Promise<Department> {
    const response = await fetch(`${API_BASE_URL}/hospital/departments/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Blood Bank Management
  async getBloodStock(): Promise<BloodStock[]> {
    const response = await fetch(`${API_BASE_URL}/hospital/blood-stock`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updateBloodStock(data: Partial<BloodStock>): Promise<void> {
    await fetch(`${API_BASE_URL}/hospital/blood-stock`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  // Blood Donor Management
  async getBloodDonors(): Promise<BloodDonor[]> {
    const response = await fetch(`${API_BASE_URL}/hospital/blood-donors`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async approveBloodDonor(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/hospital/blood-donors/${id}/approve`, {
      method: 'POST',
      headers: this.getHeaders()
    });
  }

  async rejectBloodDonor(id: string, reason: string): Promise<void> {
    await fetch(`${API_BASE_URL}/hospital/blood-donors/${id}/reject`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ reason })
    });
  }

  // Blood Request Tracking
  async getBloodRequests(): Promise<BloodRequest[]> {
    const response = await fetch(`${API_BASE_URL}/hospital/blood-requests`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async processBloodRequest(id: string, status: string): Promise<void> {
    await fetch(`${API_BASE_URL}/hospital/blood-requests/${id}/process`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
  }

  // Ambulance Management
  async getAmbulances(): Promise<Ambulance[]> {
    const response = await fetch(`${API_BASE_URL}/hospital/ambulances`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async addAmbulance(data: Partial<Ambulance>): Promise<Ambulance> {
    const response = await fetch(`${API_BASE_URL}/hospital/ambulances`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async updateAmbulanceStatus(id: string, status: string): Promise<void> {
    await fetch(`${API_BASE_URL}/hospital/ambulances/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
  }

  async getAmbulanceRequests(): Promise<AmbulanceRequest[]> {
    const response = await fetch(`${API_BASE_URL}/hospital/ambulance-requests`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async dispatchAmbulance(requestId: string, ambulanceId: string): Promise<void> {
    await fetch(`${API_BASE_URL}/hospital/ambulance-requests/${requestId}/dispatch`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ ambulanceId })
    });
  }

  // ICU Management
  async getICUBeds(): Promise<ICUBed[]> {
    const response = await fetch(`${API_BASE_URL}/hospital/icu-beds`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updateICUBedStatus(id: string, status: string): Promise<void> {
    await fetch(`${API_BASE_URL}/hospital/icu-beds/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
  }

  // Oxygen Management
  async getOxygenStock(): Promise<OxygenStock> {
    const response = await fetch(`${API_BASE_URL}/hospital/oxygen-stock`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updateOxygenStock(data: Partial<OxygenStock>): Promise<void> {
    await fetch(`${API_BASE_URL}/hospital/oxygen-stock`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  // Emergency Announcements
  async getAnnouncements(): Promise<EmergencyAnnouncement[]> {
    const response = await fetch(`${API_BASE_URL}/hospital/announcements`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async createAnnouncement(data: Partial<EmergencyAnnouncement>): Promise<EmergencyAnnouncement> {
    const response = await fetch(`${API_BASE_URL}/hospital/announcements`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async deleteAnnouncement(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/hospital/announcements/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
  }

  // Analytics
  async getAnalytics(period: string): Promise<HospitalAnalytics> {
    const response = await fetch(`${API_BASE_URL}/hospital/analytics?period=${period}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // ICU Network
  async getNearbyICUBeds(lat: number, lng: number, radius: number): Promise<ICUBed[]> {
    const response = await fetch(
      `${API_BASE_URL}/hospital/icu-network?lat=${lat}&lng=${lng}&radius=${radius}`,
      { headers: this.getHeaders() }
    );
    return response.json();
  }
}

import api, { simulateDelay } from './api';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface Hospital {
  id: string;
  name: string;
  type: 'general' | 'multispecialty' | 'community' | 'teaching' | 'specialized';
  location: {
    address: string;
    city: string;
    state: string;
    zipCode?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  rating: number;
  reviewsCount?: number;
  beds: {
    total: number;
    available: number;
    icu: {
      total: number;
      available: number;
    };
    emergency?: {
      total: number;
      available: number;
    };
  };
  emergency: boolean;
  verified: boolean;
  distance: number;
  eta: number;
  phone?: string;
  email?: string;
  website?: string;
  established?: number;
  accreditation?: string[];
  facilities?: string[];
  departments?: string[];
  image?: string;
  ambulanceAvailable?: boolean;
  oxygenAvailable?: boolean;
  bloodBank?: boolean;
  pharmacy?: boolean;
  operatingHours?: {
    emergency: string;
    general: string;
  };
}

export interface BedInfo {
  type: 'general' | 'icu' | 'pediatric' | 'nicu' | 'emergency' | 'maternity' | 'cardiac' | 'orthopedic';
  total: number;
  occupied: number;
  available: number;
  price: number;
  waitingList?: number;
  lastUpdated?: string;
}

export interface BookingResult {
  success: boolean;
  bookingId: string;
  message: string;
  bedNumber?: string;
  floor?: string;
  ward?: string;
  estimatedWaitTime?: number;
}

export interface BedBookingRequest {
  hospitalId: string;
  bedType: BedInfo['type'];
  patientId: string;
  patientName: string;
  patientAge?: number;
  patientGender?: 'male' | 'female' | 'other';
  emergencyContact?: string;
  insuranceInfo?: string;
  reason?: string;
  expectedStay?: number;
}

export interface HospitalFilter {
  emergency?: boolean;
  city?: string;
  state?: string;
  type?: Hospital['type'];
  minRating?: number;
  maxDistance?: number;
  availableBeds?: boolean;
  icuAvailable?: boolean;
  ambulanceAvailable?: boolean;
  oxygenAvailable?: boolean;
  searchQuery?: string;
  sortBy?: 'rating' | 'distance' | 'availableBeds' | 'name';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface HospitalStats {
  totalHospitals: number;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  availableIcuBeds: number;
  emergencyBeds: number;
  averageResponseTime: number;
  topRatedHospital: string;
}

// ============================================
// ENHANCED MOCK DATA
// ============================================

const mockHospitals: Hospital[] = [
  {
    id: 'hosp_001',
    name: 'City General Hospital',
    type: 'general',
    location: {
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      coordinates: { lat: 40.7128, lng: -74.0060 }
    },
    rating: 4.8,
    reviewsCount: 1250,
    beds: {
      total: 300,
      available: 45,
      icu: { total: 50, available: 5 },
      emergency: { total: 25, available: 8 }
    },
    emergency: true,
    verified: true,
    distance: 2.5,
    eta: 15,
    phone: '+1 (555) 100-2001',
    email: 'contact@citygeneral.com',
    website: 'www.citygeneral.com',
    established: 1985,
    accreditation: ['JCI', 'NABH'],
    facilities: ['24/7 Emergency', 'Pharmacy', 'Lab', 'Radiology', 'ICU', 'Blood Bank'],
    departments: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Gynecology'],
    ambulanceAvailable: true,
    oxygenAvailable: true,
    bloodBank: true,
    pharmacy: true,
    operatingHours: {
      emergency: '24/7',
      general: '9:00 AM - 9:00 PM'
    }
  },
  {
    id: 'hosp_002',
    name: 'Metro Medical Center',
    type: 'multispecialty',
    location: {
      address: '456 Oak Avenue',
      city: 'New York',
      state: 'NY',
      zipCode: '10002',
      coordinates: { lat: 40.7580, lng: -73.9855 }
    },
    rating: 4.6,
    reviewsCount: 980,
    beds: {
      total: 200,
      available: 30,
      icu: { total: 30, available: 3 },
      emergency: { total: 20, available: 5 }
    },
    emergency: true,
    verified: true,
    distance: 4.0,
    eta: 25,
    phone: '+1 (555) 200-2002',
    email: 'info@metromedical.com',
    website: 'www.metromedical.com',
    established: 1992,
    accreditation: ['JCI'],
    facilities: ['24/7 Emergency', 'Pharmacy', 'ICU', 'Blood Bank', 'MRI Center'],
    departments: ['Cardiology', 'Neurology', 'Oncology', 'Urology'],
    ambulanceAvailable: true,
    oxygenAvailable: true,
    bloodBank: true,
    pharmacy: true,
    operatingHours: {
      emergency: '24/7',
      general: '8:00 AM - 8:00 PM'
    }
  },
  {
    id: 'hosp_003',
    name: 'Sun Community Hospital',
    type: 'community',
    location: {
      address: '789 Pine Road',
      city: 'Brooklyn',
      state: 'NY',
      zipCode: '11201',
      coordinates: { lat: 40.6782, lng: -73.9442 }
    },
    rating: 4.5,
    reviewsCount: 750,
    beds: {
      total: 150,
      available: 60,
      icu: { total: 20, available: 8 },
      emergency: { total: 15, available: 10 }
    },
    emergency: false,
    verified: true,
    distance: 5.5,
    eta: 35,
    phone: '+1 (555) 300-2003',
    email: 'care@suncommunity.com',
    website: 'www.suncommunity.com',
    established: 2000,
    accreditation: ['NABH'],
    facilities: ['Pharmacy', 'Lab', 'General Ward'],
    departments: ['General Medicine', 'Pediatrics', 'Gynecology'],
    ambulanceAvailable: false,
    oxygenAvailable: true,
    bloodBank: false,
    pharmacy: true,
    operatingHours: {
      emergency: '8:00 AM - 8:00 PM',
      general: '9:00 AM - 6:00 PM'
    }
  }
];

const mockBeds: Record<string, BedInfo[]> = {
  'hosp_001': [
    {
      type: 'general',
      total: 300,
      occupied: 255,
      available: 45,
      price: 500,
      waitingList: 12,
      lastUpdated: new Date().toISOString()
    },
    {
      type: 'icu',
      total: 50,
      occupied: 45,
      available: 5,
      price: 2000,
      waitingList: 3,
      lastUpdated: new Date().toISOString()
    },
    {
      type: 'pediatric',
      total: 30,
      occupied: 20,
      available: 10,
      price: 800,
      waitingList: 5,
      lastUpdated: new Date().toISOString()
    },
    {
      type: 'emergency',
      total: 25,
      occupied: 17,
      available: 8,
      price: 1000,
      lastUpdated: new Date().toISOString()
    },
    {
      type: 'cardiac',
      total: 20,
      occupied: 15,
      available: 5,
      price: 1500,
      waitingList: 2,
      lastUpdated: new Date().toISOString()
    }
  ],
  'hosp_002': [
    {
      type: 'general',
      total: 200,
      occupied: 170,
      available: 30,
      price: 600,
      waitingList: 8,
      lastUpdated: new Date().toISOString()
    },
    {
      type: 'icu',
      total: 30,
      occupied: 27,
      available: 3,
      price: 2500,
      waitingList: 2,
      lastUpdated: new Date().toISOString()
    },
    {
      type: 'emergency',
      total: 20,
      occupied: 15,
      available: 5,
      price: 1200,
      lastUpdated: new Date().toISOString()
    }
  ],
  'hosp_003': [
    {
      type: 'general',
      total: 150,
      occupied: 90,
      available: 60,
      price: 400,
      waitingList: 0,
      lastUpdated: new Date().toISOString()
    },
    {
      type: 'icu',
      total: 20,
      occupied: 12,
      available: 8,
      price: 1800,
      waitingList: 1,
      lastUpdated: new Date().toISOString()
    },
    {
      type: 'pediatric',
      total: 15,
      occupied: 8,
      available: 7,
      price: 600,
      lastUpdated: new Date().toISOString()
    }
  ]
};

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateId = (): string => {
  return `BK_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const filterHospitals = (hospitals: Hospital[], filters: HospitalFilter): Hospital[] => {
  let filtered = [...hospitals];

  // Search query
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(h =>
      h.name.toLowerCase().includes(query) ||
      h.location.city.toLowerCase().includes(query) ||
      h.location.address.toLowerCase().includes(query)
    );
  }

  // Emergency filter
  if (filters.emergency !== undefined) {
    filtered = filtered.filter(h => h.emergency === filters.emergency);
  }

  // City filter
  if (filters.city) {
    filtered = filtered.filter(h =>
      h.location.city.toLowerCase().includes(filters.city!.toLowerCase())
    );
  }

  // State filter
  if (filters.state) {
    filtered = filtered.filter(h =>
      h.location.state.toLowerCase() === filters.state!.toLowerCase()
    );
  }

  // Hospital type filter
  if (filters.type) {
    filtered = filtered.filter(h => h.type === filters.type);
  }

  // Minimum rating filter
  if (filters.minRating) {
    filtered = filtered.filter(h => h.rating >= filters.minRating!);
  }

  // Maximum distance filter
  if (filters.maxDistance) {
    filtered = filtered.filter(h => h.distance <= filters.maxDistance!);
  }

  // Available beds filter
  if (filters.availableBeds) {
    filtered = filtered.filter(h => h.beds.available > 0);
  }

  // ICU available filter
  if (filters.icuAvailable) {
    filtered = filtered.filter(h => h.beds.icu.available > 0);
  }

  // Ambulance available filter
  if (filters.ambulanceAvailable) {
    filtered = filtered.filter(h => h.ambulanceAvailable === true);
  }

  // Oxygen available filter
  if (filters.oxygenAvailable) {
    filtered = filtered.filter(h => h.oxygenAvailable === true);
  }

  // Sorting
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'distance':
          comparison = a.distance - b.distance;
          break;
        case 'availableBeds':
          comparison = a.beds.available - b.beds.available;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        default:
          comparison = 0;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  return filtered;
};

// ============================================
// HOSPITAL SERVICE
// ============================================

export const hospitalService = {
  /**
   * Get all hospitals with optional filters and pagination
   */
  getHospitals: async (filters?: HospitalFilter): Promise<{
    hospitals: Hospital[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    await simulateDelay(1000);

    // TODO: Replace with real API call
    // const response = await api.get<{ hospitals: Hospital[]; total: number; page: number; totalPages: number }>('/hospitals', { params: filters });
    // return response.data!;

    let filtered = filterHospitals(mockHospitals, filters || {});
    
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedHospitals = filtered.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filtered.length / limit);

    return {
      hospitals: paginatedHospitals,
      total: filtered.length,
      page,
      totalPages
    };
  },

  /**
   * Get hospital by ID
   */
  getHospitalById: async (id: string): Promise<Hospital> => {
    await simulateDelay(500);

    // TODO: Replace with real API call
    // const response = await api.get<Hospital>(`/hospitals/${id}`);
    // return response.data!;

    const hospital = mockHospitals.find(h => h.id === id);
    if (!hospital) {
      throw new Error(`Hospital not found with ID: ${id}`);
    }
    return hospital;
  },

  /**
   * Get bed availability for a hospital
   */
  getBeds: async (hospitalId: string): Promise<BedInfo[]> => {
    await simulateDelay(600);

    // TODO: Replace with real API call
    // const response = await api.get<BedInfo[]>(`/hospitals/${hospitalId}/beds`);
    // return response.data!;

    // First verify hospital exists
    await hospitalService.getHospitalById(hospitalId);
    
    const beds = mockBeds[hospitalId] || [];
    if (beds.length === 0) {
      throw new Error(`No bed information found for hospital: ${hospitalId}`);
    }
    
    return beds;
  },

  /**
   * Get specific bed type availability
   */
  getBedByType: async (hospitalId: string, bedType: BedInfo['type']): Promise<BedInfo> => {
    await simulateDelay(400);

    const beds = await hospitalService.getBeds(hospitalId);
    const bed = beds.find(b => b.type === bedType);
    
    if (!bed) {
      throw new Error(`Bed type '${bedType}' not found in hospital: ${hospitalId}`);
    }
    
    return bed;
  },

  /**
   * Book a bed
   */
  bookBed: async (request: BedBookingRequest): Promise<BookingResult> => {
    await simulateDelay(1200);

    // TODO: Replace with real API call
    // const response = await api.post<BookingResult>(`/hospitals/${request.hospitalId}/beds/book`, request);
    // return response.data!;

    // Verify hospital exists
    const hospital = await hospitalService.getHospitalById(request.hospitalId);
    
    // Check bed availability
    const bed = await hospitalService.getBedByType(request.hospitalId, request.bedType);
    
    if (bed.available <= 0) {
      throw new Error(`No ${request.bedType} beds available at ${hospital.name}`);
    }

    // Generate random bed number and floor
    const bedNumber = `${request.bedType.substring(0, 2).toUpperCase()}${Math.floor(Math.random() * 100) + 1}`;
    const floor = Math.floor(Math.random() * 5) + 1;
    const wardNames = ['A', 'B', 'C', 'D', 'E'];
    const ward = `Ward ${wardNames[Math.floor(Math.random() * wardNames.length)]}`;

    return {
      success: true,
      bookingId: generateId(),
      message: `${request.bedType.toUpperCase()} bed booked successfully at ${hospital.name}`,
      bedNumber,
      floor: `${floor}th Floor`,
      ward,
      estimatedWaitTime: Math.floor(Math.random() * 30) + 10
    };
  },

  /**
   * Get nearby hospitals based on user location
   */
  getNearbyHospitals: async (
    lat: number,
    lng: number,
    radius?: number,
    filters?: HospitalFilter
  ): Promise<Hospital[]> => {
    await simulateDelay(800);

    // TODO: Replace with real API call
    // const response = await api.get<Hospital[]>('/hospitals/nearby', { 
    //   params: { lat, lng, radius, ...filters } 
    // });
    // return response.data!;

    let hospitals = [...mockHospitals];
    
    // Filter by radius if specified
    if (radius) {
      hospitals = hospitals.filter(h => h.distance <= radius);
    }
    
    // Apply additional filters
    if (filters) {
      const filtered = filterHospitals(hospitals, filters);
      hospitals = filtered;
    }
    
    // Sort by distance
    return hospitals.sort((a, b) => a.distance - b.distance);
  },

  /**
   * Get hospital statistics
   */
  getHospitalStats: async (): Promise<HospitalStats> => {
    await simulateDelay(700);

    // TODO: Replace with real API call
    // const response = await api.get<HospitalStats>('/hospitals/stats');
    // return response.data!;

    const totalBeds = mockHospitals.reduce((sum, h) => sum + h.beds.total, 0);
    const availableBeds = mockHospitals.reduce((sum, h) => sum + h.beds.available, 0);
    const icuBeds = mockHospitals.reduce((sum, h) => sum + h.beds.icu.total, 0);
    const availableIcuBeds = mockHospitals.reduce((sum, h) => sum + h.beds.icu.available, 0);
    const emergencyBeds = mockHospitals.reduce((sum, h) => 
      sum + (h.beds.emergency?.total || 0), 0
    );
    
    const topRated = [...mockHospitals].sort((a, b) => b.rating - a.rating)[0];

    return {
      totalHospitals: mockHospitals.length,
      totalBeds,
      availableBeds,
      icuBeds,
      availableIcuBeds,
      emergencyBeds,
      averageResponseTime: 18.5,
      topRatedHospital: topRated.name
    };
  },

  /**
   * Get all unique cities with hospitals
   */
  getHospitalCities: async (): Promise<string[]> => {
    await simulateDelay(300);

    const cities = [...new Set(mockHospitals.map(h => h.location.city))];
    return cities.sort();
  },

  /**
   * Get all unique hospital types
   */
  getHospitalTypes: async (): Promise<Hospital['type'][]> => {
    await simulateDelay(300);

    const types = [...new Set(mockHospitals.map(h => h.type))];
    return types.sort();
  },

  /**
   * Search hospitals by name or location
   */
  searchHospitals: async (query: string, filters?: HospitalFilter): Promise<Hospital[]> => {
    await simulateDelay(600);

    const searchFilters: HospitalFilter = {
      ...filters,
      searchQuery: query
    };
    
    const result = await hospitalService.getHospitals(searchFilters);
    return result.hospitals;
  },

  /**
   * Get bed availability summary for all hospitals
   */
  getBedAvailabilitySummary: async (): Promise<Array<{
    hospitalId: string;
    hospitalName: string;
    totalBeds: number;
    availableBeds: number;
    occupancyRate: number;
    icuAvailability: number;
  }>> => {
    await simulateDelay(500);

    const summary = mockHospitals.map(hospital => {
      const totalBeds = hospital.beds.total;
      const availableBeds = hospital.beds.available;
      const occupancyRate = ((totalBeds - availableBeds) / totalBeds) * 100;
      const icuAvailability = (hospital.beds.icu.available / hospital.beds.icu.total) * 100;

      return {
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        totalBeds,
        availableBeds,
        occupancyRate: Math.round(occupancyRate),
        icuAvailability: Math.round(icuAvailability)
      };
    });

    return summary.sort((a, b) => b.availableBeds - a.availableBeds);
  },

  /**
   * Validate if hospital has emergency services
   */
  hasEmergencyServices: async (hospitalId: string): Promise<boolean> => {
    await simulateDelay(300);

    const hospital = await hospitalService.getHospitalById(hospitalId);
    return hospital.emergency;
  },

  /**
   * Get emergency contact for hospital
   */
  getEmergencyContact: async (hospitalId: string): Promise<{ phone: string; eta: number }> => {
    await simulateDelay(300);

    const hospital = await hospitalService.getHospitalById(hospitalId);
    
    return {
      phone: hospital.phone || '+1 (555) 911-0000',
      eta: hospital.eta
    };
  }
};

// ============================================
// REACT HOOK
// ============================================

export const useHospitalService = () => {
  return {
    getHospitals: hospitalService.getHospitals,
    getHospitalById: hospitalService.getHospitalById,
    getBeds: hospitalService.getBeds,
    getBedByType: hospitalService.getBedByType,
    bookBed: hospitalService.bookBed,
    getNearbyHospitals: hospitalService.getNearbyHospitals,
    getHospitalStats: hospitalService.getHospitalStats,
    getHospitalCities: hospitalService.getHospitalCities,
    getHospitalTypes: hospitalService.getHospitalTypes,
    searchHospitals: hospitalService.searchHospitals,
    getBedAvailabilitySummary: hospitalService.getBedAvailabilitySummary,
    hasEmergencyServices: hospitalService.hasEmergencyServices,
    getEmergencyContact: hospitalService.getEmergencyContact
  };
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default hospitalService;