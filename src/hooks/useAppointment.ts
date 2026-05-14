// src/hooks/useAppointment.ts

import { useState, useCallback } from 'react';
import { apiService } from '@/services/api';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty?: string;
  patientId: string;
  patientName: string;
  patientPhone?: string;
  patientEmail?: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'checkup' | 'surgery';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  location: 'in-person' | 'video' | 'phone';
  locationDetails?: string;
  notes?: string;
  symptoms?: string;
  prescription?: string;
  fee?: number;
  paymentStatus?: 'pending' | 'paid' | 'insurance';
  createdAt: string;
  updatedAt?: string;
  remindBefore?: number;
}

export interface CreateAppointmentData {
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  type: Appointment['type'];
  location: Appointment['location'];
  notes?: string;
  symptoms?: string;
  remindBefore?: number;
}

export interface UpdateAppointmentData {
  date?: string;
  time?: string;
  type?: Appointment['type'];
  location?: Appointment['location'];
  notes?: string;
  symptoms?: string;
  status?: Appointment['status'];
}

export interface AppointmentFilters {
  doctorId?: string;
  patientId?: string;
  status?: Appointment['status'];
  type?: Appointment['type'];
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

export interface AppointmentStatistics {
  total: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  byStatus: Record<Appointment['status'], number>;
  byType: Record<Appointment['type'], number>;
  monthlyData: Array<{ month: string; count: number }>;
  completionRate: number;
  cancellationRate: number;
}

interface AppointmentState {
  appointments: Appointment[];
  upcomingAppointments: Appointment[];
  pastAppointments: Appointment[];
  todayAppointments: Appointment[];
  selectedAppointment: Appointment | null;
  isLoading: boolean;
  error: string | null;
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const isToday = (dateString: string): boolean => {
  const today = new Date().toISOString().split('T')[0];
  return dateString === today;
};

const isUpcoming = (dateString: string): boolean => {
  return new Date(dateString) >= new Date();
};

const isPast = (dateString: string): boolean => {
  return new Date(dateString) < new Date();
};

// Helper to safely extract data from response
const extractData = <T>(response: any): T => {
  if (!response) return {} as T;
  return (response?.data ?? response) as T;
};

// Helper to safely extract array from response
const extractArray = <T>(response: any): T[] => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (response?.data && Array.isArray(response.data)) return response.data;
  if (response?.appointments && Array.isArray(response.appointments)) return response.appointments;
  return [];
};

// ============================================
// APPOINTMENT HOOK
// ============================================

export const useAppointment = () => {
  const [state, setState] = useState<AppointmentState>({
    appointments: [],
    upcomingAppointments: [],
    pastAppointments: [],
    todayAppointments: [],
    selectedAppointment: null,
    isLoading: false,
    error: null,
    totalCount: 0,
    currentPage: 1,
    totalPages: 1,
  });

  // Update categorized appointments
  const updateCategorizedAppointments = useCallback((appointments: Appointment[]) => {
    const upcoming = appointments.filter(a => 
      isUpcoming(a.date) && a.status !== 'cancelled' && a.status !== 'completed'
    );
    const past = appointments.filter(a => 
      isPast(a.date) || a.status === 'completed' || a.status === 'cancelled'
    );
    const today = appointments.filter(a => 
      isToday(a.date) && a.status !== 'cancelled'
    );

    setState(prev => ({
      ...prev,
      appointments,
      upcomingAppointments: upcoming,
      pastAppointments: past,
      todayAppointments: today,
    }));
  }, []);

  // Fetch appointments
  const fetchAppointments = useCallback(async (
    userId: string,
    role: 'patient' | 'doctor' = 'patient',
    page: number = 1,
    limit: number = 10
  ) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      let response: any;
      if (role === 'patient') {
        response = await apiService.getAppointments(userId);
      } else {
        response = await apiService.getDoctorAppointments(userId);
      }
      
      const appointments = extractArray<Appointment>(response);
      updateCategorizedAppointments(appointments);
      
      setState(prev => ({
        ...prev,
        totalCount: appointments.length,
        totalPages: Math.max(1, Math.ceil(appointments.length / limit)),
        currentPage: page,
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch appointments';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      console.error('Fetch appointments error:', error);
    }
  }, [updateCategorizedAppointments]);

  // Get appointment by ID
  const getAppointmentById = useCallback(async (id: string): Promise<Appointment | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.getAppointmentById(id);
      const appointment = extractData<Appointment>(response);
      
      setState(prev => ({
        ...prev,
        selectedAppointment: appointment,
        isLoading: false,
      }));
      
      return appointment;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to get appointment';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      console.error('Get appointment error:', error);
      return null;
    }
  }, []);

  // Create appointment
  const createAppointment = useCallback(async (data: CreateAppointmentData): Promise<Appointment | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.createAppointment(data);
      const newAppointment = extractData<Appointment>(response);
      
      if (newAppointment && newAppointment.id) {
        setState(prev => {
          const updatedAppointments = [...prev.appointments, newAppointment];
          const upcoming = isUpcoming(newAppointment.date) && newAppointment.status !== 'cancelled'
            ? [...prev.upcomingAppointments, newAppointment]
            : prev.upcomingAppointments;
          
          return {
            ...prev,
            appointments: updatedAppointments,
            upcomingAppointments: upcoming,
            totalCount: updatedAppointments.length,
            isLoading: false,
          };
        });
      }
      
      return newAppointment;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to create appointment';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      console.error('Create appointment error:', error);
      return null;
    }
  }, []);

  // Update appointment
  const updateAppointment = useCallback(async (id: string, data: UpdateAppointmentData): Promise<Appointment | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.updateAppointment(id, data);
      const updatedAppointment = extractData<Appointment>(response);
      
      if (updatedAppointment && updatedAppointment.id) {
        setState(prev => {
          const updatedList = prev.appointments.map(a => a.id === id ? updatedAppointment : a);
          return {
            ...prev,
            appointments: updatedList,
            selectedAppointment: prev.selectedAppointment?.id === id ? updatedAppointment : prev.selectedAppointment,
            isLoading: false,
          };
        });
        
        // Re-categorize after update
        setTimeout(() => {
          setState(prev => {
            const upcoming = prev.appointments.filter(a => 
              isUpcoming(a.date) && a.status !== 'cancelled' && a.status !== 'completed'
            );
            const past = prev.appointments.filter(a => 
              isPast(a.date) || a.status === 'completed' || a.status === 'cancelled'
            );
            const today = prev.appointments.filter(a => 
              isToday(a.date) && a.status !== 'cancelled'
            );
            
            return {
              ...prev,
              upcomingAppointments: upcoming,
              pastAppointments: past,
              todayAppointments: today,
            };
          });
        }, 0);
      }
      
      return updatedAppointment;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update appointment';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      console.error('Update appointment error:', error);
      return null;
    }
  }, []);

  // Cancel appointment
  const cancelAppointment = useCallback(async (id: string, reason?: string): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      await apiService.cancelAppointment(id, reason);
      
      setState(prev => ({
        ...prev,
        appointments: prev.appointments.map(a => 
          a.id === id ? { ...a, status: 'cancelled' as const } : a
        ),
        upcomingAppointments: prev.upcomingAppointments.filter(a => a.id !== id),
        selectedAppointment: prev.selectedAppointment?.id === id 
          ? { ...prev.selectedAppointment, status: 'cancelled' as const }
          : prev.selectedAppointment,
        isLoading: false,
      }));
      
      return true;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to cancel appointment';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      console.error('Cancel appointment error:', error);
      return false;
    }
  }, []);

  // Reschedule appointment
  const rescheduleAppointment = useCallback(async (
    id: string, 
    newDate: string, 
    newTime: string
  ): Promise<Appointment | null> => {
    return updateAppointment(id, { date: newDate, time: newTime });
  }, [updateAppointment]);

  // Get appointment details
  const getAppointmentDetails = useCallback(async (id: string): Promise<any | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.getAppointmentDetails(id);
      const details = extractData<any>(response);
      return details;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to get appointment details';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      console.error('Get appointment details error:', error);
      return null;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Search appointments
  const searchAppointments = useCallback(async (query: string, filters?: AppointmentFilters): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.searchAppointments(query, filters);
      const appointments = extractArray<Appointment>(response);
      
      updateCategorizedAppointments(appointments);
      
      setState(prev => ({
        ...prev,
        totalCount: appointments.length,
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to search appointments';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      console.error('Search appointments error:', error);
    }
  }, [updateCategorizedAppointments]);

  // Filter appointments
  const filterAppointments = useCallback(async (filters: AppointmentFilters): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.filterAppointments(filters);
      const appointments = extractArray<Appointment>(response);
      
      updateCategorizedAppointments(appointments);
      
      setState(prev => ({
        ...prev,
        totalCount: appointments.length,
        isLoading: false,
      }));
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to filter appointments';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      console.error('Filter appointments error:', error);
    }
  }, [updateCategorizedAppointments]);

  // Get appointment statistics
  const getAppointmentStatistics = useCallback(async (userId?: string): Promise<AppointmentStatistics | null> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.getAppointmentStatistics(userId);
      const statistics = extractData<AppointmentStatistics>(response);
      return statistics;
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to get statistics';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      console.error('Get statistics error:', error);
      return null;
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Get available time slots
  const getAvailableTimeSlots = useCallback(async (
    doctorId: string, 
    date: string
  ): Promise<string[]> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const response = await apiService.getAvailableTimeSlots(doctorId, date);
      const slots = extractArray<string>(response);
      return Array.isArray(slots) ? slots : [];
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to get time slots';
      setState(prev => ({ ...prev, error: errorMessage, isLoading: false }));
      console.error('Get time slots error:', error);
      return [];
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Clear error
  const clearError = useCallback((): void => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Reset selected appointment
  const resetSelectedAppointment = useCallback((): void => {
    setState(prev => ({ ...prev, selectedAppointment: null }));
  }, []);

  // Refresh appointments
  const refreshAppointments = useCallback(async (userId: string, role: 'patient' | 'doctor' = 'patient'): Promise<void> => {
    await fetchAppointments(userId, role, state.currentPage);
  }, [fetchAppointments, state.currentPage]);

  // Reset all state
  const resetState = useCallback((): void => {
    setState({
      appointments: [],
      upcomingAppointments: [],
      pastAppointments: [],
      todayAppointments: [],
      selectedAppointment: null,
      isLoading: false,
      error: null,
      totalCount: 0,
      currentPage: 1,
      totalPages: 1,
    });
  }, []);

  return {
    // State
    appointments: state.appointments,
    upcomingAppointments: state.upcomingAppointments,
    pastAppointments: state.pastAppointments,
    todayAppointments: state.todayAppointments,
    selectedAppointment: state.selectedAppointment,
    isLoading: state.isLoading,
    error: state.error,
    totalCount: state.totalCount,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
    
    // Actions
    fetchAppointments,
    getAppointmentById,
    getAppointmentDetails,
    createAppointment,
    updateAppointment,
    cancelAppointment,
    rescheduleAppointment,
    searchAppointments,
    filterAppointments,
    getAppointmentStatistics,
    getAvailableTimeSlots,
    clearError,
    resetSelectedAppointment,
    refreshAppointments,
    resetState,
  };
};

export default useAppointment;