// src/hooks/useHospital.ts

import { useState, useCallback } from 'react';
import { hospitalService, Hospital, BedInfo, HospitalFilter, BookingResult, BedBookingRequest } from '../services/hospitalService';

interface UseHospitalReturn {
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
  getBedAvailabilitySummary: () => Promise<Array<{
    hospitalId: string;
    hospitalName: string;
    totalBeds: number;
    availableBeds: number;
    occupancyRate: number;
    icuAvailability: number;
  }>>;
  clearError: () => void;
  resetSelectedHospital: () => void;
}

export const useHospital = (): UseHospitalReturn => {
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [totalHospitals, setTotalHospitals] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [hospitalBeds, setHospitalBeds] = useState<BedInfo[]>([]);

  // Load hospitals with filters
  const loadHospitals = useCallback(async (filters?: HospitalFilter, page: number = 1): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await hospitalService.getHospitals({ ...filters, page });
      setHospitals(result.hospitals);
      setTotalHospitals(result.total);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load hospitals';
      setError(errorMessage);
      console.error('Load hospitals error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get hospital by ID
  const getHospitalById = useCallback(async (id: string): Promise<Hospital | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const hospital = await hospitalService.getHospitalById(id);
      setSelectedHospital(hospital);
      return hospital;
    } catch (err: any) {
      const errorMessage = err?.message || 'Hospital not found';
      setError(errorMessage);
      console.error('Get hospital error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get hospital beds
  const getHospitalBeds = useCallback(async (hospitalId: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const beds = await hospitalService.getBeds(hospitalId);
      setHospitalBeds(beds);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load bed information';
      setError(errorMessage);
      console.error('Get beds error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Book a bed
  const bookBed = useCallback(async (request: BedBookingRequest): Promise<BookingResult | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await hospitalService.bookBed(request);
      return result;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to book bed';
      setError(errorMessage);
      console.error('Book bed error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get nearby hospitals
  const getNearbyHospitals = useCallback(async (
    lat: number, 
    lng: number, 
    radius?: number, 
    filters?: HospitalFilter
  ): Promise<Hospital[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const nearby = await hospitalService.getNearbyHospitals(lat, lng, radius, filters);
      return nearby;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to find nearby hospitals';
      setError(errorMessage);
      console.error('Get nearby hospitals error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search hospitals
  const searchHospitals = useCallback(async (query: string, filters?: HospitalFilter): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await hospitalService.searchHospitals(query, filters);
      setHospitals(results);
      setTotalHospitals(results.length);
      setCurrentPage(1);
      setTotalPages(1);
    } catch (err: any) {
      const errorMessage = err?.message || 'Search failed';
      setError(errorMessage);
      console.error('Search hospitals error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get bed availability summary
  const getBedAvailabilitySummary = useCallback(async (): Promise<Array<{
    hospitalId: string;
    hospitalName: string;
    totalBeds: number;
    availableBeds: number;
    occupancyRate: number;
    icuAvailability: number;
  }>> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const summary = await hospitalService.getBedAvailabilitySummary();
      return summary;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load bed summary';
      setError(errorMessage);
      console.error('Get bed summary error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // Reset selected hospital
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
// src/hooks/useHospital.ts - শেষের দিকে
export type { UseHospitalReturn };