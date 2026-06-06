// src/hooks/useHospital.ts
// COMPLETE & ERROR-FREE HOSPITAL HOOK

import { useState, useCallback } from 'react';

// ============================================
// TYPES (Local - no external dependency)
// ============================================

export interface Hospital {
  id: string;
  name: string;
  registrationNumber: string;
  type: 'government' | 'private' | 'charitable';
  phone: string;
  emergencyPhone: string;
  email: string;
  address: HospitalAddress;
  rating: number;
  reviewCount: number;
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  icuAvailable: number;
  emergencyStatus: 'active' | 'busy' | 'unavailable';
  ambulanceCount: number;
  oxygenAvailable: boolean;
  bloodBankAvailable: boolean;
  distance: string;
  eta: string;
  isOpen: boolean;
  hasEmergency: boolean;
  hasICU: boolean;
  services: string[];
  coordinates: { lat: number; lng: number };
  imageUrl: string;
}

export interface HospitalAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export interface HospitalFilter {
  type?: string;
  searchTerm?: string;
  hasEmergency?: boolean;
  hasICU?: boolean;
  isOpen?: boolean;
  minRating?: number;
  maxDistance?: number;
  sortBy?: 'rating' | 'distance' | 'beds';
  page?: number;
  limit?: number;
}

export interface BedInfo {
  id: string;
  hospitalId: string;
  type: 'general' | 'icu' | 'emergency' | 'pediatric' | 'maternity';
  total: number;
  available: number;
  occupied: number;
  costPerDay: number;
}

export interface BedBookingRequest {
  hospitalId: string;
  bedType: string;
  patientName: string;
  patientAge: number;
  patientBloodGroup: string;
  reason: string;
  date: string;
  emergencyContact: string;
}

export interface BookingResult {
  success: boolean;
  bookingId?: string;
  bedNumber?: string;
  message: string;
}

export interface UseHospitalReturn {
  hospitals: Hospital[];
  totalHospitals: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  selectedHospital: Hospital | null;
  hospitalBeds: BedInfo[];
  loadHospitals: (filters?: HospitalFilter, page?: number) => Promise<void>;
  getHospitalById: (id: string) => Promise<Hospital | null>;
  getHospitalBeds: (hospitalId: string) => Promise<void>;
  bookBed: (request: BedBookingRequest) => Promise<BookingResult | null>;
  getNearbyHospitals: (lat: number, lng: number, radius?: number, filters?: HospitalFilter) => Promise<Hospital[]>;
  searchHospitals: (query: string, filters?: HospitalFilter) => Promise<void>;
  getBedAvailabilitySummary: () => Promise<BedSummary[]>;
  clearError: () => void;
  resetSelectedHospital: () => void;
}

export interface BedSummary {
  hospitalId: string;
  hospitalName: string;
  totalBeds: number;
  availableBeds: number;
  occupancyRate: number;
  icuAvailability: number;
}

// ============================================
// MOCK DATA
// ============================================

const MOCK_HOSPITALS: Hospital[] = [
  {
    id: '1', name: 'City General Hospital', registrationNumber: 'HOSP-001',
    type: 'private', phone: '+1 (555) 999-8888', emergencyPhone: '911',
    email: 'info@citygeneral.com',
    address: { street: '123 Medical Dr', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
    rating: 4.5, reviewCount: 1250, totalBeds: 500, availableBeds: 150,
    icuBeds: 50, icuAvailable: 15, emergencyStatus: 'active',
    ambulanceCount: 15, oxygenAvailable: true, bloodBankAvailable: true,
    distance: '2.5 km', eta: '8 min', isOpen: true, hasEmergency: true, hasICU: true,
    services: ['Emergency', 'Cardiology', 'Neurology', 'Surgery', 'Pediatrics'],
    coordinates: { lat: 40.7128, lng: -74.006 }, imageUrl: ''
  },
  {
    id: '2', name: 'Metro Hospital', registrationNumber: 'HOSP-002',
    type: 'government', phone: '+1 (555) 777-6666', emergencyPhone: '911',
    email: 'info@metrohospital.com',
    address: { street: '456 Health Blvd', city: 'New York', state: 'NY', zipCode: '10019', country: 'USA' },
    rating: 4.2, reviewCount: 850, totalBeds: 300, availableBeds: 45,
    icuBeds: 30, icuAvailable: 5, emergencyStatus: 'busy',
    ambulanceCount: 10, oxygenAvailable: true, bloodBankAvailable: false,
    distance: '5.2 km', eta: '15 min', isOpen: true, hasEmergency: true, hasICU: true,
    services: ['Emergency', 'Orthopedics', 'Dermatology', 'Psychiatry'],
    coordinates: { lat: 40.7580, lng: -73.9855 }, imageUrl: ''
  },
  {
    id: '3', name: 'Women Care Hospital', registrationNumber: 'HOSP-003',
    type: 'private', phone: '+1 (555) 444-3333', emergencyPhone: '911',
    email: 'info@womencare.com',
    address: { street: '789 Care Ave', city: 'New York', state: 'NY', zipCode: '10011', country: 'USA' },
    rating: 4.8, reviewCount: 650, totalBeds: 200, availableBeds: 80,
    icuBeds: 20, icuAvailable: 8, emergencyStatus: 'active',
    ambulanceCount: 5, oxygenAvailable: true, bloodBankAvailable: true,
    distance: '3.8 km', eta: '12 min', isOpen: true, hasEmergency: true, hasICU: true,
    services: ['Emergency', 'Gynecology', 'Pediatrics', 'Maternity', 'Neonatal'],
    coordinates: { lat: 40.7420, lng: -73.9890 }, imageUrl: ''
  },
  {
    id: '4', name: 'Community Health Center', registrationNumber: 'HOSP-004',
    type: 'charitable', phone: '+1 (555) 222-1111', emergencyPhone: '911',
    email: 'info@communityhealth.com',
    address: { street: '321 Community Rd', city: 'New York', state: 'NY', zipCode: '10003', country: 'USA' },
    rating: 4.0, reviewCount: 450, totalBeds: 100, availableBeds: 30,
    icuBeds: 10, icuAvailable: 2, emergencyStatus: 'unavailable',
    ambulanceCount: 3, oxygenAvailable: false, bloodBankAvailable: false,
    distance: '7.5 km', eta: '20 min', isOpen: false, hasEmergency: false, hasICU: false,
    services: ['General Medicine', 'Vaccination', 'Family Planning'],
    coordinates: { lat: 40.7280, lng: -73.9950 }, imageUrl: ''
  },
  {
    id: '5', name: 'Apollo Medical Center', registrationNumber: 'HOSP-005',
    type: 'private', phone: '+1 (555) 888-7777', emergencyPhone: '911',
    email: 'info@apollomedical.com',
    address: { street: '555 Premium Blvd', city: 'New York', state: 'NY', zipCode: '10022', country: 'USA' },
    rating: 4.9, reviewCount: 980, totalBeds: 400, availableBeds: 120,
    icuBeds: 60, icuAvailable: 25, emergencyStatus: 'active',
    ambulanceCount: 20, oxygenAvailable: true, bloodBankAvailable: true,
    distance: '4.0 km', eta: '10 min', isOpen: true, hasEmergency: true, hasICU: true,
    services: ['Emergency', 'Cardiology', 'Neurology', 'Surgery', 'Oncology', 'Radiology'],
    coordinates: { lat: 40.7500, lng: -73.9800 }, imageUrl: ''
  }
];

const MOCK_BEDS: Record<string, BedInfo[]> = {
  '1': [
    { id: 'b1', hospitalId: '1', type: 'general', total: 350, available: 100, occupied: 250, costPerDay: 200 },
    { id: 'b2', hospitalId: '1', type: 'icu', total: 50, available: 15, occupied: 35, costPerDay: 800 },
    { id: 'b3', hospitalId: '1', type: 'emergency', total: 50, available: 20, occupied: 30, costPerDay: 300 },
    { id: 'b4', hospitalId: '1', type: 'pediatric', total: 30, available: 10, occupied: 20, costPerDay: 250 },
    { id: 'b5', hospitalId: '1', type: 'maternity', total: 20, available: 5, occupied: 15, costPerDay: 400 }
  ]
};

// ============================================
// MOCK API FUNCTIONS
// ============================================

const mockGetHospitals = async (filters?: HospitalFilter): Promise<{
  hospitals: Hospital[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filtered = [...MOCK_HOSPITALS];
  
  if (filters?.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(h => 
      h.name.toLowerCase().includes(term) ||
      h.address.city.toLowerCase().includes(term)
    );
  }
  if (filters?.hasEmergency) filtered = filtered.filter(h => h.hasEmergency);
  if (filters?.hasICU) filtered = filtered.filter(h => h.hasICU);
  if (filters?.isOpen) filtered = filtered.filter(h => h.isOpen);
  if (filters?.minRating) filtered = filtered.filter(h => h.rating >= filters.minRating!);
  if (filters?.type && filters.type !== 'all') filtered = filtered.filter(h => h.type === filters.type);
  
  if (filters?.sortBy) {
    switch(filters.sortBy) {
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'beds': filtered.sort((a, b) => b.availableBeds - a.availableBeds); break;
    }
  }
  
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);
  
  return { hospitals: paginated, total, page, totalPages };
};

const mockGetHospitalById = async (id: string): Promise<Hospital> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const hospital = MOCK_HOSPITALS.find(h => h.id === id);
  if (!hospital) throw new Error('Hospital not found');
  return hospital;
};

const mockGetBeds = async (hospitalId: string): Promise<BedInfo[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  return MOCK_BEDS[hospitalId] || [];
};

const mockBookBed = async (request: BedBookingRequest): Promise<BookingResult> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    success: true,
    bookingId: 'BED-' + Date.now(),
    bedNumber: 'B-' + Math.floor(Math.random() * 100),
    message: 'Bed booked successfully!'
  };
};

const mockGetNearbyHospitals = async (
  lat: number, lng: number, radius: number = 10, filters?: HospitalFilter
): Promise<Hospital[]> => {
  await new Promise(resolve => setTimeout(resolve, 700));
  let filtered = MOCK_HOSPITALS.filter(h => parseFloat(h.distance) <= radius);
  if (filters?.hasEmergency) filtered = filtered.filter(h => h.hasEmergency);
  return filtered;
};

const mockSearchHospitals = async (query: string, filters?: HospitalFilter): Promise<Hospital[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const term = query.toLowerCase();
  return MOCK_HOSPITALS.filter(h => 
    h.name.toLowerCase().includes(term) ||
    h.services.some(s => s.toLowerCase().includes(term))
  );
};

const mockGetBedSummary = async (): Promise<BedSummary[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return MOCK_HOSPITALS.map(h => ({
    hospitalId: h.id,
    hospitalName: h.name,
    totalBeds: h.totalBeds,
    availableBeds: h.availableBeds,
    occupancyRate: Math.round(((h.totalBeds - h.availableBeds) / h.totalBeds) * 100),
    icuAvailability: h.icuAvailable
  }));
};

// ============================================
// MAIN HOOK
// ============================================

export const useHospital = (): UseHospitalReturn => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [totalHospitals, setTotalHospitals] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [hospitalBeds, setHospitalBeds] = useState<BedInfo[]>([]);

  const loadHospitals = useCallback(async (filters?: HospitalFilter, page: number = 1): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await mockGetHospitals({ ...filters, page });
      setHospitals(result.hospitals);
      setTotalHospitals(result.total);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      setError(err?.message || 'Failed to load hospitals');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getHospitalById = useCallback(async (id: string): Promise<Hospital | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const hospital = await mockGetHospitalById(id);
      setSelectedHospital(hospital);
      return hospital;
    } catch (err: any) {
      setError(err?.message || 'Hospital not found');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getHospitalBeds = useCallback(async (hospitalId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const beds = await mockGetBeds(hospitalId);
      setHospitalBeds(beds);
    } catch (err: any) {
      setError(err?.message || 'Failed to load bed information');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const bookBed = useCallback(async (request: BedBookingRequest): Promise<BookingResult | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await mockBookBed(request);
    } catch (err: any) {
      setError(err?.message || 'Failed to book bed');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getNearbyHospitals = useCallback(async (
    lat: number, lng: number, radius: number = 10, filters?: HospitalFilter
  ): Promise<Hospital[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await mockGetNearbyHospitals(lat, lng, radius, filters);
    } catch (err: any) {
      setError(err?.message || 'Failed to find nearby hospitals');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchHospitals = useCallback(async (query: string, filters?: HospitalFilter): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await mockSearchHospitals(query, filters);
      setHospitals(results);
      setTotalHospitals(results.length);
      setCurrentPage(1);
      setTotalPages(1);
    } catch (err: any) {
      setError(err?.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getBedAvailabilitySummary = useCallback(async (): Promise<BedSummary[]> => {
    setIsLoading(true);
    setError(null);
    try {
      return await mockGetBedSummary();
    } catch (err: any) {
      setError(err?.message || 'Failed to load bed summary');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  const resetSelectedHospital = useCallback((): void => {
    setSelectedHospital(null);
    setHospitalBeds([]);
  }, []);

  return {
    hospitals,
    totalHospitals,
    currentPage,
    totalPages,
    isLoading,
    error,
    selectedHospital,
    hospitalBeds,
    loadHospitals,
    getHospitalById,
    getHospitalBeds,
    bookBed,
    getNearbyHospitals,
    searchHospitals,
    getBedAvailabilitySummary,
    clearError,
    resetSelectedHospital,
  };
};

export default useHospital;