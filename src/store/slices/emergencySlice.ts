import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { emergencyService } from '../../services/emergencyService';

// ============================================
// TYPES
// ============================================
export interface EmergencyServiceItem {
  id: string;
  name: string;
  type: 'ambulance' | 'blood' | 'oxygen' | 'doctor' | 'emergency-room';
  status: 'available' | 'busy' | 'critical' | 'dispatched';
  location: { lat: number; lng: number; address: string };
  eta?: number;
  provider: string;
  phone: string;
}

export interface EmergencyRequest {
  id: string;
  type: 'ambulance' | 'blood' | 'oxygen' | 'doctor';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  status: 'pending' | 'dispatched' | 'completed' | 'cancelled';
  timestamp: string;
  estimatedTime?: number;
}

export interface EmergencyState {
  services: EmergencyServiceItem[];
  requests: EmergencyRequest[];
  activeRequests: EmergencyRequest[];
  criticalRequests: EmergencyRequest[];
  isLoading: boolean;
  error: string | null;
  isMonitoring: boolean;
}

// ============================================
// INITIAL STATE
// ============================================
const initialState: EmergencyState = {
  services: [],
  requests: [],
  activeRequests: [],
  criticalRequests: [],
  isLoading: false,
  error: null,
  isMonitoring: false,
};

// ============================================
// HELPERS
// ============================================
const getActive = (requests: EmergencyRequest[]): EmergencyRequest[] =>
  requests.filter((r) => r.status === 'pending' || r.status === 'dispatched');

const getCritical = (requests: EmergencyRequest[]): EmergencyRequest[] =>
  requests.filter((r) => r.priority === 'critical' && r.status !== 'completed' && r.status !== 'cancelled');

// ============================================
// ASYNC THUNKS
// ============================================
export const fetchEmergencyServices = createAsyncThunk(
  'emergency/fetchServices',
  async (type?: EmergencyServiceItem['type'], { rejectWithValue }) => {
    try {
      return await emergencyService.getServices(type);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch services');
    }
  }
);

export const createEmergencyRequest = createAsyncThunk(
  'emergency/createRequest',
  async (
    data: { type: EmergencyRequest['type']; priority: EmergencyRequest['priority']; location: string; patientId: string; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      return await emergencyService.createRequest(data);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create request');
    }
  }
);

export const updateEmergencyRequestStatus = createAsyncThunk(
  'emergency/updateRequestStatus',
  async ({ id, status }: { id: string; status: EmergencyRequest['status'] }, { rejectWithValue }) => {
    try {
      await emergencyService.updateRequestStatus(id, status);
      return { id, status };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update');
    }
  }
);

// ============================================
// SLICE
// ============================================
const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    addIncomingRequest: (state, action: PayloadAction<EmergencyRequest>) => {
      state.requests = [action.payload, ...state.requests].slice(0, 50);
      state.activeRequests = getActive(state.requests);
      state.criticalRequests = getCritical(state.requests);
    },
    updateServiceStatus: (state, action: PayloadAction<{ id: string; status: EmergencyServiceItem['status'] }>) => {
      state.services = state.services.map((s) =>
        s.id === action.payload.id ? { ...s, status: action.payload.status } : s
      );
    },
    setMonitoring: (state, action: PayloadAction<boolean>) => {
      state.isMonitoring = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetEmergency: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Services
    builder
      .addCase(fetchEmergencyServices.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEmergencyServices.fulfilled, (state, action: PayloadAction<EmergencyServiceItem[]>) => {
        state.isLoading = false;
        state.services = action.payload;
      })
      .addCase(fetchEmergencyServices.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Request
    builder
      .addCase(createEmergencyRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createEmergencyRequest.fulfilled, (state, action: PayloadAction<EmergencyRequest>) => {
        state.isLoading = false;
        state.requests = [action.payload, ...state.requests];
        state.activeRequests = getActive(state.requests);
        state.criticalRequests = getCritical(state.requests);
      })
      .addCase(createEmergencyRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Request Status
    builder
      .addCase(updateEmergencyRequestStatus.fulfilled, (state, action: PayloadAction<{ id: string; status: EmergencyRequest['status'] }>) => {
        state.requests = state.requests.map((r) =>
          r.id === action.payload.id ? { ...r, status: action.payload.status } : r
        );
        state.activeRequests = getActive(state.requests);
        state.criticalRequests = getCritical(state.requests);
      });
  },
});

// ============================================
// EXPORTS
// ============================================
export const { addIncomingRequest, updateServiceStatus, setMonitoring, clearError, resetEmergency } = emergencySlice.actions;
export default emergencySlice.reducer;

// Selectors
export const selectEmergencyServices = (state: { emergency: EmergencyState }) => state.emergency.services;
export const selectEmergencyRequests = (state: { emergency: EmergencyState }) => state.emergency.requests;
export const selectActiveRequests = (state: { emergency: EmergencyState }) => state.emergency.activeRequests;
export const selectCriticalRequests = (state: { emergency: EmergencyState }) => state.emergency.criticalRequests;
export const selectAvailableServices = (state: { emergency: EmergencyState }) =>
  state.emergency.services.filter((s) => s.status === 'available');
export const selectEmergencyLoading = (state: { emergency: EmergencyState }) => state.emergency.isLoading;
export const selectEmergencyError = (state: { emergency: EmergencyState }) => state.emergency.error;
export const selectIsMonitoring = (state: { emergency: EmergencyState }) => state.emergency.isMonitoring;
export const selectEmergencyStats = (state: { emergency: EmergencyState }) => ({
  totalServices: state.emergency.services.length,
  availableCount: state.emergency.services.filter((s) => s.status === 'available').length,
  activeRequests: state.emergency.activeRequests.length,
  criticalCount: state.emergency.criticalRequests.length,
});