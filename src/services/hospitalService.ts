// src/services/hospitalService.ts

import {
  HospitalDoctor, BloodDonor, BloodRequest,
  Ambulance, EmergencyAnnouncement, Department,
  ICUBed, HospitalDashboardData, OxygenStock,
  BloodStock, AmbulanceRequest as AmbulanceRequestType, HospitalAnalytics as HospitalAnalyticsType
} from '../types/hospital';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

  async getAmbulanceRequests(): Promise<AmbulanceRequestType[]> {
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
  async getAnalytics(period: string): Promise<HospitalAnalyticsType> {
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

import api from './api';

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
  admissionDate?: string;
  department?: string;
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
  search?: string;
  specialty?: string;
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

// Helper: Map backend hospital response to frontend Hospital interface
const mapHospitalResponse = (h: any): Hospital => ({
  id: h.id,
  name: h.name || '',
  type: h.type || 'general',
  location: {
    address: h.street || h.address || '',
    city: h.city || '',
    state: h.state || '',
    zipCode: h.zip_code,
    coordinates: h.latitude && h.longitude ? { lat: h.latitude, lng: h.longitude } : undefined,
  },
  rating: h.rating || 0,
  reviewsCount: h.review_count,
  beds: {
    total: h.total_beds || 0,
    available: h.available_beds || 0,
    icu: {
      total: h.icu_total_beds || 0,
      available: h.icu_available_beds || 0,
    },
    emergency: h.emergency_service ? { total: 0, available: 0 } : undefined,
  },
  emergency: h.emergency_service === 'active',
  verified: h.is_verified || false,
  distance: h.distance || 0,
  eta: parseInt(h.emergency_response_time) || 15,
  phone: h.phone || h.emergency_phone,
  email: h.email,
  website: h.website,
  established: h.established_year,
});

// ============================================
// MOCK DATA REMOVED - Using real API

// Helper for generating IDs
const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

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
    const params: any = {};
    if (filters?.search) params.search = filters.search;
    if (filters?.type) params.type = filters.type;
    if (filters?.city) params.city = filters.city;
    if (filters?.page) params.page = filters.page;
    if (filters?.limit) params.limit = filters.limit;
    if (filters?.specialty) params.specialty = filters.specialty;

    const response = await api.get<any>('/hospitals', params);
    if (response.success && response.data) {
      const raw = Array.isArray(response.data) ? response.data : (response.data as any)?.data || (response.data as any)?.hospitals || [];
      const total = response.data?.total || raw.length;
      const page = response.data?.page || filters?.page || 1;
      const totalPages = response.data?.total_pages || response.data?.totalPages || Math.ceil(total / (filters?.limit || 10));

      const hospitals: Hospital[] = raw.map(mapHospitalResponse);
      return { hospitals, total, page, totalPages };
    }
    return { hospitals: [], total: 0, page: 1, totalPages: 0 };
  },

  /**
   * Get hospital by ID
   */
  getHospitalById: async (id: string): Promise<Hospital> => {
    const response = await api.get<any>('/hospitals/' + id);
    if (response.success && response.data) {
      return mapHospitalResponse(response.data);
    }
    throw new Error(response.message || 'Hospital not found');
  },

  /**
   * Get bed availability for a hospital
   */
  getBeds: async (hospitalId: string): Promise<BedInfo[]> => {
    const response = await api.get<any>('/hospitals/' + hospitalId + '/beds');
    if (response.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return items.map((b: any) => ({
        type: b.bed_type || b.type || 'general',
        total: b.total || 0,
        available: b.available || 0,
        price: b.price_per_day || b.daily_charge || 0,
        floor: b.floor || '',
        ward: b.ward || '',
      }));
    }
    return [];
  },

  /**
   * Get specific bed type availability
   */
  getBedByType: async (hospitalId: string, bedType: BedInfo['type']): Promise<BedInfo> => {
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
    const response = await api.post<any>(`/hospitals/${request.hospitalId}/beds/book`, {
      bed_type: request.bedType,
      patient_id: request.patientId,
      patient_name: request.patientName,
      admission_date: request.admissionDate,
      department: request.department,
    });
    if (response.success && response.data) {
      return {
        success: true,
        bookingId: response.data.booking_id || response.data.id || generateId(),
        message: response.data.message || 'Bed booked successfully',
        bedNumber: response.data.bed_number || '',
        floor: response.data.floor || '',
        ward: response.data.ward || '',
        estimatedWaitTime: response.data.estimated_wait_time || 15,
      };
    }
    throw new Error(response.message || 'Failed to book bed');
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
    const params: any = { lat, lng };
    if (radius) params.radius = radius;
    if (filters?.type) params.type = filters.type;
    if (filters?.specialty) params.specialty = filters.specialty;

    const response = await api.get<any>('/hospitals/nearby', params);
    if (response.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : (response.data as any)?.data || [];
      return (items as any[]).map(mapHospitalResponse).sort((a: any, b: any) => a.distance - b.distance);
    }
    return [];
  },

  /**
   * Get hospital statistics
   */
  getHospitalStats: async (): Promise<HospitalStats> => {
    const response = await api.get<any>('/hospitals/stats');
    if (response.success && response.data) {
      return {
        totalHospitals: response.data.total_hospitals || 0,
        totalBeds: response.data.total_beds || 0,
        availableBeds: response.data.available_beds || 0,
        icuBeds: response.data.icu_beds || 0,
        availableIcuBeds: response.data.available_icu_beds || 0,
        emergencyBeds: response.data.emergency_beds || 0,
        averageResponseTime: response.data.average_response_time || 0,
        topRatedHospital: response.data.top_rated_hospital || '',
      };
    }
    // Fallback: compute from hospital list
    const result = await hospitalService.getHospitals();
    const totalBeds = result.hospitals.reduce((s, h) => s + h.beds.total, 0);
    const availableBeds = result.hospitals.reduce((s, h) => s + h.beds.available, 0);
    return {
      totalHospitals: result.total,
      totalBeds,
      availableBeds,
      icuBeds: result.hospitals.reduce((s, h) => s + h.beds.icu.total, 0),
      availableIcuBeds: result.hospitals.reduce((s, h) => s + h.beds.icu.available, 0),
      emergencyBeds: result.hospitals.reduce((s, h) => s + (h.beds.emergency?.total || 0), 0),
      averageResponseTime: 18.5,
      topRatedHospital: [...result.hospitals].sort((a, b) => b.rating - a.rating)[0]?.name || '',
    };
  },

  /**
   * Get all unique cities with hospitals
   */
  getHospitalCities: async (): Promise<string[]> => {
    const response = await api.get<any>('/hospitals/cities');
    if (response.success && response.data) {
      const cities = Array.isArray(response.data) ? response.data : response.data?.cities || [];
      return cities.sort();
    }
    // Fallback: derive from hospital list
    const result = await hospitalService.getHospitals({ limit: 100 });
    return [...new Set(result.hospitals.map(h => h.location.city))].sort();
  },

  /**
   * Get all unique hospital types
   */
  getHospitalTypes: async (): Promise<Hospital['type'][]> => {
    const result = await hospitalService.getHospitals({ limit: 100 });
    return [...new Set(result.hospitals.map(h => h.type))].sort() as Hospital['type'][];
  },

  /**
   * Search hospitals by name or location
   */
  searchHospitals: async (query: string, filters?: HospitalFilter): Promise<Hospital[]> => {
    const result = await hospitalService.getHospitals({ ...filters, search: query });
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
    const result = await hospitalService.getHospitals({ limit: 100 });
    return result.hospitals.map(hospital => {
      const totalBeds = hospital.beds.total;
      const availableBeds = hospital.beds.available;
      const occupancyRate = totalBeds > 0 ? ((totalBeds - availableBeds) / totalBeds) * 100 : 0;
      const icuAvailability = hospital.beds.icu.total > 0
        ? (hospital.beds.icu.available / hospital.beds.icu.total) * 100 : 0;

      return {
        hospitalId: hospital.id,
        hospitalName: hospital.name,
        totalBeds,
        availableBeds,
        occupancyRate: Math.round(occupancyRate),
        icuAvailability: Math.round(icuAvailability),
      };
    }).sort((a, b) => b.availableBeds - a.availableBeds);
  },

  /**
   * Validate if hospital has emergency services
   */
  hasEmergencyServices: async (hospitalId: string): Promise<boolean> => {
    try {
      const hospital = await hospitalService.getHospitalById(hospitalId);
      return hospital.emergency;
    } catch {
      return false;
    }
  },

  /**
   * Get emergency contact for hospital
   */
  getEmergencyContact: async (hospitalId: string): Promise<{ phone: string; eta: number }> => {
    const hospital = await hospitalService.getHospitalById(hospitalId);
    return {
      phone: hospital.phone || '+1 (555) 911-0000',
      eta: hospital.eta,
    };
  },
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