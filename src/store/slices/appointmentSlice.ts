// ============================================
// src/store/slices/appointmentSlice.ts
// Aetherion Health - Appointment Redux Slice
// ============================================

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// ============================================
// TYPES
// ============================================

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  hospitalName: string;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  notes?: string;
  prescriptionId?: string;
  followUpDate?: string;
  amount: number;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'insurance';
  createdAt: string;
  updatedAt: string;
}

interface AppointmentState {
  appointments: Appointment[];
  selectedAppointment: Appointment | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string;
    type: string;
    date: string;
    search: string;
  };
  stats: {
    total: number;
    scheduled: number;
    completed: number;
    cancelled: number;
    todayCount: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
  };
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: AppointmentState = {
  appointments: [],
  selectedAppointment: null,
  isLoading: false,
  error: null,
  filters: {
    status: 'all',
    type: 'all',
    date: '',
    search: '',
  },
  stats: {
    total: 0,
    scheduled: 0,
    completed: 0,
    cancelled: 0,
    todayCount: 0,
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
  },
};

// ============================================
// ASYNC THUNKS
// ============================================

// Fetch all appointments
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAll',
  async (params: { page?: number; limit?: number; status?: string } | undefined, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/appointments', { params });
      // return response.data;
      
      // Mock data for now
      return {
        appointments: [],
        pagination: { page: 1, limit: 10, total: 0 },
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch appointments');
    }
  }
);

// Book new appointment
export const bookAppointment = createAsyncThunk(
  'appointments/book',
  async (appointmentData: Partial<Appointment>, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/appointments', appointmentData);
      // return response.data;
      
      return {
        ...appointmentData,
        id: Date.now().toString(),
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Appointment;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to book appointment');
    }
  }
);

// Cancel appointment
export const cancelAppointment = createAsyncThunk(
  'appointments/cancel',
  async (id: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // await api.put(`/appointments/${id}/cancel`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel appointment');
    }
  }
);

// Reschedule appointment
export const rescheduleAppointment = createAsyncThunk(
  'appointments/reschedule',
  async ({ id, date, time }: { id: string; date: string; time: string }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.put(`/appointments/${id}/reschedule`, { date, time });
      // return response.data;
      
      return { id, date, time };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to reschedule appointment');
    }
  }
);

// ============================================
// APPOINTMENT SLICE
// ============================================

const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    // Select appointment
    setSelectedAppointment: (state, action: PayloadAction<Appointment | null>) => {
      state.selectedAppointment = action.payload;
    },

    // Clear selection
    clearSelectedAppointment: (state) => {
      state.selectedAppointment = null;
    },

    // Set filters
    setFilters: (state, action: PayloadAction<Partial<AppointmentState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },

    // Reset filters
    resetFilters: (state) => {
      state.filters = initialState.filters;
    },

    // Set page
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.page = action.payload;
    },

    // Update appointment status locally
    updateAppointmentStatus: (state, action: PayloadAction<{ id: string; status: Appointment['status'] }>) => {
      const appointment = state.appointments.find(a => a.id === action.payload.id);
      if (appointment) {
        appointment.status = action.payload.status;
        appointment.updatedAt = new Date().toISOString();
      }
    },

    // Add note to appointment
    addAppointmentNote: (state, action: PayloadAction<{ id: string; note: string }>) => {
      const appointment = state.appointments.find(a => a.id === action.payload.id);
      if (appointment) {
        appointment.notes = action.payload.note;
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset entire state
    resetAppointmentState: () => initialState,
  },

  // ============================================
  // EXTRA REDUCERS (Async)
  // ============================================
  extraReducers: (builder) => {
    builder
      // Fetch Appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments = action.payload.appointments;
        state.pagination = action.payload.pagination;
        
        // Calculate stats
        state.stats.total = action.payload.pagination.total;
        state.stats.scheduled = state.appointments.filter(a => a.status === 'scheduled').length;
        state.stats.completed = state.appointments.filter(a => a.status === 'completed').length;
        state.stats.cancelled = state.appointments.filter(a => a.status === 'cancelled').length;
        state.stats.todayCount = state.appointments.filter(a => {
          const today = new Date().toDateString();
          return new Date(a.date).toDateString() === today;
        }).length;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Book Appointment
      .addCase(bookAppointment.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(bookAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.appointments.unshift(action.payload);
        state.stats.total += 1;
        state.stats.scheduled += 1;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Cancel Appointment
      .addCase(cancelAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(cancelAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        const appointment = state.appointments.find(a => a.id === action.payload);
        if (appointment) {
          appointment.status = 'cancelled';
          appointment.updatedAt = new Date().toISOString();
          state.stats.scheduled = Math.max(0, state.stats.scheduled - 1);
          state.stats.cancelled += 1;
        }
      })
      .addCase(cancelAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Reschedule Appointment
      .addCase(rescheduleAppointment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(rescheduleAppointment.fulfilled, (state, action) => {
        state.isLoading = false;
        const appointment = state.appointments.find(a => a.id === action.payload.id);
        if (appointment) {
          appointment.date = action.payload.date;
          appointment.time = action.payload.time;
          appointment.updatedAt = new Date().toISOString();
        }
      })
      .addCase(rescheduleAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// ============================================
// ACTIONS
// ============================================

export const {
  setSelectedAppointment,
  clearSelectedAppointment,
  setFilters,
  resetFilters,
  setPage,
  updateAppointmentStatus,
  addAppointmentNote,
  clearError,
  resetAppointmentState,
} = appointmentSlice.actions;

// ============================================
// SELECTORS
// ============================================

export const selectAllAppointments = (state: { appointments: AppointmentState }) => state.appointments.appointments;
export const selectSelectedAppointment = (state: { appointments: AppointmentState }) => state.appointments.selectedAppointment;
export const selectAppointmentLoading = (state: { appointments: AppointmentState }) => state.appointments.isLoading;
export const selectAppointmentError = (state: { appointments: AppointmentState }) => state.appointments.error;
export const selectAppointmentFilters = (state: { appointments: AppointmentState }) => state.appointments.filters;
export const selectAppointmentStats = (state: { appointments: AppointmentState }) => state.appointments.stats;
export const selectAppointmentPagination = (state: { appointments: AppointmentState }) => state.appointments.pagination;

export const selectTodayAppointments = (state: { appointments: AppointmentState }) => {
  const today = new Date().toDateString();
  return state.appointments.appointments.filter(a => new Date(a.date).toDateString() === today);
};

export const selectUpcomingAppointments = (state: { appointments: AppointmentState }) => {
  const now = new Date();
  return state.appointments.appointments.filter(a => {
    const appDate = new Date(`${a.date}T${a.time}`);
    return appDate > now && a.status !== 'cancelled';
  });
};

export const selectFilteredAppointments = (state: { appointments: AppointmentState }) => {
  const { appointments, filters } = state.appointments;
  
  return appointments.filter(app => {
    const statusMatch = filters.status === 'all' || app.status === filters.status;
    const typeMatch = filters.type === 'all' || app.type === filters.type;
    const searchMatch = !filters.search || 
      app.doctorName.toLowerCase().includes(filters.search.toLowerCase()) ||
      app.patientName.toLowerCase().includes(filters.search.toLowerCase()) ||
      app.hospitalName.toLowerCase().includes(filters.search.toLowerCase());
    
    return statusMatch && typeMatch && searchMatch;
  });
};

// ============================================
// REDUCER
// ============================================

export default appointmentSlice.reducer;