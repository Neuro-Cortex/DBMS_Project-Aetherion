import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// ============================================
// TYPES
// ============================================
export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'checkup';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  location: 'in-person' | 'video' | 'phone';
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface BookingData {
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  type: Appointment['type'];
  location: Appointment['location'];
  notes?: string;
}

export interface AppointmentState {
  appointments: Appointment[];
  upcomingAppointments: Appointment[];
  isLoading: boolean;
  error: string | null;
  bookingSuccess: boolean;
}

// ============================================
// INITIAL STATE
// ============================================
const initialState: AppointmentState = {
  appointments: [],
  upcomingAppointments: [],
  isLoading: false,
  error: null,
  bookingSuccess: false,
};

// ============================================
// HELPERS
// ============================================
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getUpcoming = (appointments: Appointment[]): Appointment[] =>
  appointments
    .filter((a) => a.status !== 'cancelled' && a.status !== 'completed')
    .sort((a, b) => new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime());

// ============================================
// ASYNC THUNKS
// ============================================
export const fetchAppointments = createAsyncThunk(
  'appointment/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      await delay(1000);
      // TODO: Replace with API call
      const mockAppointments: Appointment[] = [
        { id: 'apt_1', doctorId: '1', doctorName: 'Dr. Sarah Wilson', patientId: 'usr_001', patientName: 'John Doe', date: '2024-03-15', time: '10:00', type: 'consultation', status: 'confirmed', location: 'video', priority: 'medium' },
        { id: 'apt_2', doctorId: '2', doctorName: 'Dr. James Lee', patientId: 'usr_001', patientName: 'John Doe', date: '2024-03-16', time: '14:30', type: 'follow-up', status: 'scheduled', location: 'in-person', priority: 'low' },
        { id: 'apt_3', doctorId: '3', doctorName: 'Dr. Emily Chen', patientId: 'usr_002', patientName: 'Jane Smith', date: '2024-03-15', time: '16:00', type: 'checkup', status: 'in-progress', location: 'in-person', priority: 'low' },
      ];
      return mockAppointments;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch appointments');
    }
  }
);

export const bookAppointment = createAsyncThunk(
  'appointment/bookAppointment',
  async (data: BookingData, { rejectWithValue }) => {
    try {
      await delay(2000);
      const newAppointment: Appointment = {
        id: 'apt_' + Date.now(),
        doctorId: data.doctorId,
        doctorName: 'Doctor',
        patientId: data.patientId,
        patientName: 'Patient',
        date: data.date,
        time: data.time,
        type: data.type,
        status: 'scheduled',
        location: data.location,
        notes: data.notes,
      };
      return newAppointment;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Booking failed');
    }
  }
);

export const cancelAppointment = createAsyncThunk(
  'appointment/cancelAppointment',
  async (id: string, { rejectWithValue }) => {
    try {
      await delay(800);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Cancel failed');
    }
  }
);

export const rescheduleAppointment = createAsyncThunk(
  'appointment/rescheduleAppointment',
  async ({ id, date, time }: { id: string; date: string; time: string }, { rejectWithValue }) => {
    try {
      await delay(1000);
      return { id, date, time };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Reschedule failed');
    }
  }
);

// ============================================
// SLICE
// ============================================
const appointmentSlice = createSlice({
  name: 'appointment',
  initialState,
  reducers: {
    updateAppointmentStatus: (state, action: PayloadAction<{ id: string; status: Appointment['status'] }>) => {
      state.appointments = state.appointments.map((apt) =>
        apt.id === action.payload.id ? { ...apt, status: action.payload.status } : apt
      );
      state.upcomingAppointments = getUpcoming(state.appointments);
    },
    clearBookingSuccess: (state) => {
      state.bookingSuccess = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetAppointments: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Appointments
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action: PayloadAction<Appointment[]>) => {
        state.isLoading = false;
        state.appointments = action.payload;
        state.upcomingAppointments = getUpcoming(action.payload);
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Book Appointment
    builder
      .addCase(bookAppointment.pending, (state) => {
        state.isLoading = true;
        state.bookingSuccess = false;
      })
      .addCase(bookAppointment.fulfilled, (state, action: PayloadAction<Appointment>) => {
        state.isLoading = false;
        state.appointments.push(action.payload);
        state.upcomingAppointments = getUpcoming(state.appointments);
        state.bookingSuccess = true;
      })
      .addCase(bookAppointment.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Cancel Appointment
    builder
      .addCase(cancelAppointment.fulfilled, (state, action: PayloadAction<string>) => {
        state.appointments = state.appointments.map((apt) =>
          apt.id === action.payload ? { ...apt, status: 'cancelled' as const } : apt
        );
        state.upcomingAppointments = getUpcoming(state.appointments);
      });

    // Reschedule Appointment
    builder
      .addCase(rescheduleAppointment.fulfilled, (state, action: PayloadAction<{ id: string; date: string; time: string }>) => {
        state.appointments = state.appointments.map((apt) =>
          apt.id === action.payload.id
            ? { ...apt, date: action.payload.date, time: action.payload.time, status: 'scheduled' as const }
            : apt
        );
        state.upcomingAppointments = getUpcoming(state.appointments);
      });
  },
});

// ============================================
// EXPORTS
// ============================================
export const { updateAppointmentStatus, clearBookingSuccess, clearError, resetAppointments } = appointmentSlice.actions;
export default appointmentSlice.reducer;

// Selectors
export const selectAppointments = (state: { appointment: AppointmentState }) => state.appointment.appointments;
export const selectUpcomingAppointments = (state: { appointment: AppointmentState }) => state.appointment.upcomingAppointments;
export const selectAppointmentLoading = (state: { appointment: AppointmentState }) => state.appointment.isLoading;
export const selectAppointmentError = (state: { appointment: AppointmentState }) => state.appointment.error;
export const selectBookingSuccess = (state: { appointment: AppointmentState }) => state.appointment.bookingSuccess;
export const selectAppointmentStats = (state: { appointment: AppointmentState }) => ({
  total: state.appointment.appointments.length,
  scheduled: state.appointment.appointments.filter((a) => a.status === 'scheduled').length,
  confirmed: state.appointment.appointments.filter((a) => a.status === 'confirmed').length,
  completed: state.appointment.appointments.filter((a) => a.status === 'completed').length,
  cancelled: state.appointment.appointments.filter((a) => a.status === 'cancelled').length,
});