// src/hooks/useDoctor.ts

import { useState, useCallback } from 'react';
import { doctorService, Doctor, DoctorFilters, DoctorReview, AppointmentRequest, Appointment } from '../services/doctorService';

interface UseDoctorReturn {
  doctors: Doctor[];
  totalDoctors: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  selectedDoctor: Doctor | null;
  doctorReviews: DoctorReview[];
  reviewsAverage: number;
  loadDoctors: (filters?: DoctorFilters, page?: number) => Promise<void>;
  getDoctorById: (id: string) => Promise<Doctor | null>;
  getDoctorReviews: (doctorId: string, page?: number) => Promise<void>;
  bookAppointment: (request: AppointmentRequest) => Promise<Appointment | null>;
  searchDoctors: (query: string, filters?: DoctorFilters) => Promise<void>;
  getTopRatedDoctors: (limit?: number) => Promise<Doctor[]>;
  getRecommendedDoctors: (doctorId: string, limit?: number) => Promise<Doctor[]>;
  clearError: () => void;
  resetSelectedDoctor: () => void;
}

export const useDoctor = (): UseDoctorReturn => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [totalDoctors, setTotalDoctors] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [doctorReviews, setDoctorReviews] = useState<DoctorReview[]>([]);
  const [reviewsAverage, setReviewsAverage] = useState<number>(0);

  // Load doctors with filters
  const loadDoctors = useCallback(async (filters?: DoctorFilters, page: number = 1): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await doctorService.getDoctors({ ...filters, page });
      setDoctors(result.doctors);
      setTotalDoctors(result.total);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load doctors';
      setError(errorMessage);
      console.error('Load doctors error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get doctor by ID
  const getDoctorById = useCallback(async (id: string): Promise<Doctor | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const doctor = await doctorService.getDoctorById(id);
      setSelectedDoctor(doctor);
      return doctor;
    } catch (err: any) {
      const errorMessage = err?.message || 'Doctor not found';
      setError(errorMessage);
      console.error('Get doctor error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get doctor reviews
  const getDoctorReviews = useCallback(async (doctorId: string, page: number = 1): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await doctorService.getReviews(doctorId, page);
      setDoctorReviews(result.reviews);
      setReviewsAverage(result.averageRating);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load reviews';
      setError(errorMessage);
      console.error('Get reviews error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Book appointment
  const bookAppointment = useCallback(async (request: AppointmentRequest): Promise<Appointment | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const appointment = await doctorService.bookAppointment(request);
      return appointment;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to book appointment';
      setError(errorMessage);
      console.error('Book appointment error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Search doctors
  const searchDoctors = useCallback(async (query: string, filters?: DoctorFilters): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = await doctorService.searchDoctors(query, filters);
      setDoctors(results);
      setTotalDoctors(results.length);
      setCurrentPage(1);
      setTotalPages(1);
    } catch (err: any) {
      const errorMessage = err?.message || 'Search failed';
      setError(errorMessage);
      console.error('Search doctors error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get top rated doctors
  const getTopRatedDoctors = useCallback(async (limit: number = 5): Promise<Doctor[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const topDoctors = await doctorService.getTopRatedDoctors(limit);
      return topDoctors;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load top doctors';
      setError(errorMessage);
      console.error('Get top doctors error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get recommended doctors
  const getRecommendedDoctors = useCallback(async (doctorId: string, limit: number = 3): Promise<Doctor[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const recommended = await doctorService.getRecommendedDoctors(doctorId, limit);
      return recommended;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load recommendations';
      setError(errorMessage);
      console.error('Get recommendations error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Clear error
  const clearError = useCallback((): void => {
    setError(null);
  }, []);

  // Reset selected doctor
  const resetSelectedDoctor = useCallback((): void => {
    setSelectedDoctor(null);
    setDoctorReviews([]);
    setReviewsAverage(0);
  }, []);

  return {
    doctors,
    totalDoctors,
    currentPage,
    totalPages,
    isLoading,
    error,
    selectedDoctor,
    doctorReviews,
    reviewsAverage,
    loadDoctors,
    getDoctorById,
    getDoctorReviews,
    bookAppointment,
    searchDoctors,
    getTopRatedDoctors,
    getRecommendedDoctors,
    clearError,
    resetSelectedDoctor,
  };
};

export default useDoctor;
// src/hooks/useDoctor.ts - শেষের দিকে
export type { UseDoctorReturn };