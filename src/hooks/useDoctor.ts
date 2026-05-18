// src/hooks/useDoctor.ts
// COMPLETE & ERROR-FREE DOCTOR HOOK

import { useState, useCallback } from 'react';

// ============================================
// TYPES (Local - no external dependency)
// ============================================

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  experience: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  videoConsultationFee: number;
  availableSlots: number;
  languages: string[];
  education: string;
  isOnline: boolean;
  distance: string;
  nextAvailable: string;
  successRate: number;
  totalPatients: number;
  profileImage: string;
}

export interface DoctorFilters {
  specialization?: string;
  hospital?: string;
  searchTerm?: string;
  sortBy?: 'rating' | 'fee' | 'experience' | 'distance';
  page?: number;
  limit?: number;
  isOnline?: boolean;
  minRating?: number;
  maxFee?: number;
}

export interface DoctorReview {
  id: string;
  doctorId: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  isVerified: boolean;
}

export interface AppointmentRequest {
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  reason: string;
  symptoms?: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
}

export interface UseDoctorReturn {
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

// ============================================
// MOCK DATA
// ============================================

const MOCK_DOCTORS: Doctor[] = [
  {
    id: '1', name: 'Dr. Sarah Wilson', specialization: 'Cardiologist',
    hospital: 'City General Hospital', experience: 15, rating: 4.8,
    reviewCount: 245, consultationFee: 150, videoConsultationFee: 100,
    availableSlots: 8, languages: ['English', 'Spanish'],
    education: 'MD - Harvard Medical School', isOnline: true,
    distance: '2.5 km', nextAvailable: '2025-01-20',
    successRate: 98, totalPatients: 5000, profileImage: ''
  },
  {
    id: '2', name: 'Dr. James Brown', specialization: 'Dermatologist',
    hospital: 'Metro Hospital', experience: 10, rating: 4.6,
    reviewCount: 180, consultationFee: 120, videoConsultationFee: 80,
    availableSlots: 3, languages: ['English', 'French'],
    education: 'MD - Yale University', isOnline: true,
    distance: '5.2 km', nextAvailable: '2025-01-21',
    successRate: 92, totalPatients: 3500, profileImage: ''
  },
  {
    id: '3', name: 'Dr. Emily White', specialization: 'Gynecologist',
    hospital: 'Women Care Hospital', experience: 12, rating: 4.9,
    reviewCount: 320, consultationFee: 180, videoConsultationFee: 120,
    availableSlots: 0, languages: ['English'],
    education: 'MD - Johns Hopkins University', isOnline: false,
    distance: '3.8 km', nextAvailable: '2025-01-22',
    successRate: 96, totalPatients: 4200, profileImage: ''
  },
  {
    id: '4', name: 'Dr. Michael Chen', specialization: 'Neurologist',
    hospital: 'City General Hospital', experience: 20, rating: 4.7,
    reviewCount: 290, consultationFee: 200, videoConsultationFee: 150,
    availableSlots: 5, languages: ['English', 'Chinese'],
    education: 'MD - Stanford University', isOnline: true,
    distance: '4.0 km', nextAvailable: '2025-01-19',
    successRate: 94, totalPatients: 3800, profileImage: ''
  },
  {
    id: '5', name: 'Dr. Lisa Anderson', specialization: 'Pediatrician',
    hospital: 'Children Hospital', experience: 8, rating: 4.5,
    reviewCount: 150, consultationFee: 100, videoConsultationFee: 70,
    availableSlots: 10, languages: ['English'],
    education: 'MD - Boston University', isOnline: true,
    distance: '6.5 km', nextAvailable: '2025-01-18',
    successRate: 90, totalPatients: 2500, profileImage: ''
  }
];

const MOCK_REVIEWS: DoctorReview[] = [
  { id: 'r1', doctorId: '1', patientName: 'John Doe', rating: 5, comment: 'Excellent doctor! Very thorough and caring.', date: '2025-01-10', isVerified: true },
  { id: 'r2', doctorId: '1', patientName: 'Jane Smith', rating: 4, comment: 'Great experience, wait time was a bit long.', date: '2025-01-08', isVerified: true },
  { id: 'r3', doctorId: '1', patientName: 'Bob Wilson', rating: 5, comment: 'Life-saving treatment. Highly recommend!', date: '2025-01-05', isVerified: false }
];

// ============================================
// MOCK API FUNCTIONS
// ============================================

const mockGetDoctors = async (filters?: DoctorFilters): Promise<{
  doctors: Doctor[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  let filtered = [...MOCK_DOCTORS];
  
  if (filters?.specialization && filters.specialization !== 'all') {
    filtered = filtered.filter(d => d.specialization === filters.specialization);
  }
  if (filters?.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(d => 
      d.name.toLowerCase().includes(term) ||
      d.specialization.toLowerCase().includes(term) ||
      d.hospital.toLowerCase().includes(term)
    );
  }
  if (filters?.isOnline) {
    filtered = filtered.filter(d => d.isOnline);
  }
  if (filters?.minRating) {
    filtered = filtered.filter(d => d.rating >= filters.minRating!);
  }
  if (filters?.maxFee) {
    filtered = filtered.filter(d => d.consultationFee <= filters.maxFee!);
  }
  
  if (filters?.sortBy) {
    switch(filters.sortBy) {
      case 'rating': filtered.sort((a, b) => b.rating - a.rating); break;
      case 'fee': filtered.sort((a, b) => a.consultationFee - b.consultationFee); break;
      case 'experience': filtered.sort((a, b) => b.experience - a.experience); break;
    }
  }
  
  const page = filters?.page || 1;
  const limit = filters?.limit || 10;
  const total = filtered.length;
  const totalPages = Math.ceil(total / limit);
  const start = (page - 1) * limit;
  const paginatedDoctors = filtered.slice(start, start + limit);
  
  return { doctors: paginatedDoctors, total, page, totalPages };
};

const mockGetDoctorById = async (id: string): Promise<Doctor> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  const doctor = MOCK_DOCTORS.find(d => d.id === id);
  if (!doctor) throw new Error('Doctor not found');
  return doctor;
};

const mockGetReviews = async (doctorId: string, page: number = 1): Promise<{
  reviews: DoctorReview[];
  averageRating: number;
  total: number;
}> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const reviews = MOCK_REVIEWS.filter(r => r.doctorId === doctorId);
  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length || 0;
  return { reviews, averageRating: parseFloat(average.toFixed(1)), total: reviews.length };
};

const mockBookAppointment = async (request: AppointmentRequest): Promise<Appointment> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return {
    id: 'apt-' + Date.now(),
    doctorId: request.doctorId,
    doctorName: 'Dr. Sarah Wilson',
    patientId: request.patientId,
    patientName: 'John Doe',
    date: request.date,
    time: request.time,
    type: request.type,
    status: 'scheduled',
    reason: request.reason
  };
};

const mockSearchDoctors = async (query: string, filters?: DoctorFilters): Promise<Doctor[]> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  const term = query.toLowerCase();
  let results = MOCK_DOCTORS.filter(d => 
    d.name.toLowerCase().includes(term) ||
    d.specialization.toLowerCase().includes(term) ||
    d.hospital.toLowerCase().includes(term)
  );
  if (filters?.sortBy === 'rating') {
    results.sort((a, b) => b.rating - a.rating);
  }
  return results;
};

// ============================================
// MAIN HOOK
// ============================================

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

  const loadDoctors = useCallback(async (filters?: DoctorFilters, page: number = 1): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await mockGetDoctors({ ...filters, page });
      setDoctors(result.doctors);
      setTotalDoctors(result.total);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
    } catch (err: any) {
      setError(err?.message || 'Failed to load doctors');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDoctorById = useCallback(async (id: string): Promise<Doctor | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const doctor = await mockGetDoctorById(id);
      setSelectedDoctor(doctor);
      return doctor;
    } catch (err: any) {
      setError(err?.message || 'Doctor not found');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDoctorReviews = useCallback(async (doctorId: string, page: number = 1): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await mockGetReviews(doctorId, page);
      setDoctorReviews(result.reviews);
      setReviewsAverage(result.averageRating);
    } catch (err: any) {
      setError(err?.message || 'Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const bookAppointment = useCallback(async (request: AppointmentRequest): Promise<Appointment | null> => {
    setIsLoading(true);
    setError(null);
    try {
      return await mockBookAppointment(request);
    } catch (err: any) {
      setError(err?.message || 'Failed to book appointment');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchDoctors = useCallback(async (query: string, filters?: DoctorFilters): Promise<void> => {
    setIsLoading(true);
    setError(null);
    try {
      const results = await mockSearchDoctors(query, filters);
      setDoctors(results);
      setTotalDoctors(results.length);
      setCurrentPage(1);
      setTotalPages(1);
    } catch (err: any) {
      setError(err?.message || 'Search failed');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getTopRatedDoctors = useCallback(async (limit: number = 5): Promise<Doctor[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const sorted = [...MOCK_DOCTORS].sort((a, b) => b.rating - a.rating);
      return sorted.slice(0, limit);
    } catch (err: any) {
      setError(err?.message || 'Failed to load top doctors');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getRecommendedDoctors = useCallback(async (doctorId: string, limit: number = 3): Promise<Doctor[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const currentDoctor = MOCK_DOCTORS.find(d => d.id === doctorId);
      const recommended = MOCK_DOCTORS.filter(d => 
        d.id !== doctorId && d.specialization === currentDoctor?.specialization
      );
      return recommended.slice(0, limit);
    } catch (err: any) {
      setError(err?.message || 'Failed to load recommendations');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback((): void => {
    setError(null);
  }, []);

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