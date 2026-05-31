// ============================================
// src/store/slices/emergencySlice.ts
// Aetherion Health - Emergency Redux Slice
// ============================================

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// ============================================
// TYPES
// ============================================

export type EmergencyType = 
  | 'cardiac' 
  | 'accident' 
  | 'stroke' 
  | 'breathing' 
  | 'bleeding' 
  | 'allergy' 
  | 'pregnancy' 
  | 'other';

export type EmergencyStatus = 
  | 'pending' 
  | 'dispatched' 
  | 'en-route' 
  | 'arrived' 
  | 'picked-up' 
  | 'at-hospital' 
  | 'completed' 
  | 'cancelled';

export interface EmergencyLocation {
  lat: number;
  lng: number;
  address: string;
  landmark?: string;
}

export interface AmbulanceInfo {
  id: string;
  driverName: string;
  vehicleNumber: string;
  contactNumber: string;
  currentLocation: {
    lat: number;
    lng: number;
  };
  estimatedArrival: string; // minutes
  status: 'available' | 'busy' | 'maintenance';
}

export interface HospitalInfo {
  id: string;
  name: string;
  address: string;
  distance: string;
  estimatedTime: string;
  erAvailable: boolean;
  bedsAvailable: number;
  icuBedsAvailable: number;
  phone: string;
  location: {
    lat: number;
    lng: number;
  };
}

export interface EmergencyRequest {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  emergencyType: EmergencyType;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: EmergencyLocation;
  status: EmergencyStatus;
  ambulanceId?: string;
  ambulance?: AmbulanceInfo;
  hospitalId?: string;
  hospital?: HospitalInfo;
  assignedDoctor?: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: string;
    oxygenLevel?: string;
    temperature?: string;
  };
  timeline: {
    status: EmergencyStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

interface EmergencyState {
  requests: EmergencyRequest[];
  activeRequest: EmergencyRequest | null;
  nearbyHospitals: HospitalInfo[];
  availableAmbulances: AmbulanceInfo[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  sosActivated: boolean;
  stats: {
    total: number;
    active: number;
    completed: number;
    avgResponseTime: string;
    todayCount: number;
  };
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: EmergencyState = {
  requests: [],
  activeRequest: null,
  nearbyHospitals: [],
  availableAmbulances: [],
  isLoading: false,
  isSubmitting: false,
  error: null,
  sosActivated: false,
  stats: {
    total: 0,
    active: 0,
    completed: 0,
    avgResponseTime: '8 min',
    todayCount: 0,
  },
};

// ============================================
// ASYNC THUNKS
// ============================================

// Send Emergency SOS
export const sendEmergencySOS = createAsyncThunk(
  'emergency/sendSOS',
  async (emergencyData: {
    emergencyType: EmergencyType;
    description: string;
    severity: 'critical' | 'high' | 'medium' | 'low';
    location: EmergencyLocation;
    patientPhone: string;
  }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.post('/emergency/sos', emergencyData);
      // return response.data;

      // Mock response
      const mockRequest: EmergencyRequest = {
        id: `EM-${Date.now()}`,
        patientId: 'patient-1',
        patientName: 'Current User',
        patientPhone: emergencyData.patientPhone,
        emergencyType: emergencyData.emergencyType,
        description: emergencyData.description,
        severity: emergencyData.severity,
        location: emergencyData.location,
        status: 'pending',
        timeline: [{
          status: 'pending',
          timestamp: new Date().toISOString(),
          note: 'Emergency request received',
        }],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      return mockRequest;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send SOS');
    }
  }
);

// Fetch nearby hospitals
export const fetchNearbyHospitals = createAsyncThunk(
  'emergency/fetchHospitals',
  async (location: { lat: number; lng: number }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/hospitals/nearby', { params: location });
      // return response.data;

      // Mock data
      const mockHospitals: HospitalInfo[] = [
        {
          id: 'h1',
          name: 'City General Hospital',
          address: '123 Main St, Downtown',
          distance: '2.3 km',
          estimatedTime: '5 min',
          erAvailable: true,
          bedsAvailable: 12,
          icuBedsAvailable: 3,
          phone: '+1-555-0101',
          location: { lat: 23.8103, lng: 90.4125 },
        },
        {
          id: 'h2',
          name: 'Metro Medical Center',
          address: '456 Park Ave, Midtown',
          distance: '4.1 km',
          estimatedTime: '8 min',
          erAvailable: true,
          bedsAvailable: 8,
          icuBedsAvailable: 2,
          phone: '+1-555-0102',
          location: { lat: 23.8220, lng: 90.4250 },
        },
        {
          id: 'h3',
          name: 'Memorial Emergency Hospital',
          address: '789 Oak Rd, Uptown',
          distance: '6.5 km',
          estimatedTime: '12 min',
          erAvailable: true,
          bedsAvailable: 20,
          icuBedsAvailable: 5,
          phone: '+1-555-0103',
          location: { lat: 23.7950, lng: 90.4000 },
        },
      ];

      return mockHospitals;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch hospitals');
    }
  }
);

// Fetch available ambulances
export const fetchAvailableAmbulances = createAsyncThunk(
  'emergency/fetchAmbulances',
  async (location: { lat: number; lng: number }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.get('/ambulances/available', { params: location });
      // return response.data;

      // Mock data
      const mockAmbulances: AmbulanceInfo[] = [
        {
          id: 'a1',
          driverName: 'John Smith',
          vehicleNumber: 'AMB-001',
          contactNumber: '+1-555-0201',
          currentLocation: { lat: 23.8120, lng: 90.4140 },
          estimatedArrival: '5',
          status: 'available',
        },
        {
          id: 'a2',
          driverName: 'Sarah Johnson',
          vehicleNumber: 'AMB-002',
          contactNumber: '+1-555-0202',
          currentLocation: { lat: 23.8180, lng: 90.4200 },
          estimatedArrival: '8',
          status: 'available',
        },
      ];

      return mockAmbulances;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch ambulances');
    }
  }
);

// Cancel emergency
export const cancelEmergency = createAsyncThunk(
  'emergency/cancel',
  async (id: string, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // await api.put(`/emergency/${id}/cancel`);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to cancel emergency');
    }
  }
);

// Update emergency status
export const updateEmergencyStatus = createAsyncThunk(
  'emergency/updateStatus',
  async ({ id, status, note }: { id: string; status: EmergencyStatus; note?: string }, { rejectWithValue }) => {
    try {
      // TODO: Replace with actual API call
      // const response = await api.put(`/emergency/${id}/status`, { status, note });
      // return response.data;

      return { id, status, note };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to update status');
    }
  }
);

// ============================================
// EMERGENCY SLICE
// ============================================

const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    // Activate SOS mode
    activateSOS: (state) => {
      state.sosActivated = true;
    },

    // Deactivate SOS mode
    deactivateSOS: (state) => {
      state.sosActivated = false;
    },

    // Set active request
    setActiveRequest: (state, action: PayloadAction<EmergencyRequest | null>) => {
      state.activeRequest = action.payload;
    },

    // Add timeline event
    addTimelineEvent: (state, action: PayloadAction<{ id: string; status: EmergencyStatus; note?: string }>) => {
      const request = state.requests.find(r => r.id === action.payload.id);
      if (request) {
        request.timeline.push({
          status: action.payload.status,
          timestamp: new Date().toISOString(),
          note: action.payload.note,
        });
        request.status = action.payload.status;
      }
    },

    // Update ambulance tracking
    updateAmbulanceLocation: (state, action: PayloadAction<{ ambulanceId: string; location: { lat: number; lng: number }; estimatedArrival: string }>) => {
      const ambulance = state.availableAmbulances.find(a => a.id === action.payload.ambulanceId);
      if (ambulance) {
        ambulance.currentLocation = action.payload.location;
        ambulance.estimatedArrival = action.payload.estimatedArrival;
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Reset emergency state
    resetEmergencyState: () => initialState,
  },

  // ============================================
  // EXTRA REDUCERS
  // ============================================
  extraReducers: (builder) => {
    builder
      // Send SOS
      .addCase(sendEmergencySOS.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(sendEmergencySOS.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.requests.unshift(action.payload);
        state.activeRequest = action.payload;
        state.sosActivated = true;
        state.stats.active += 1;
        state.stats.total += 1;
        state.stats.todayCount += 1;
      })
      .addCase(sendEmergencySOS.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // Fetch Hospitals
      .addCase(fetchNearbyHospitals.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchNearbyHospitals.fulfilled, (state, action) => {
        state.isLoading = false;
        state.nearbyHospitals = action.payload;
      })
      .addCase(fetchNearbyHospitals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Fetch Ambulances
      .addCase(fetchAvailableAmbulances.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAvailableAmbulances.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableAmbulances = action.payload;
      })
      .addCase(fetchAvailableAmbulances.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Cancel Emergency
      .addCase(cancelEmergency.pending, (state) => {
        state.isSubmitting = true;
      })
      .addCase(cancelEmergency.fulfilled, (state, action) => {
        state.isSubmitting = false;
        const request = state.requests.find(r => r.id === action.payload);
        if (request) {
          request.status = 'cancelled';
          request.timeline.push({
            status: 'cancelled',
            timestamp: new Date().toISOString(),
            note: 'Emergency cancelled by user',
          });
          state.stats.active = Math.max(0, state.stats.active - 1);
        }
        if (state.activeRequest?.id === action.payload) {
          state.activeRequest = null;
          state.sosActivated = false;
        }
      })
      .addCase(cancelEmergency.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
      })

      // Update Status
      .addCase(updateEmergencyStatus.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateEmergencyStatus.fulfilled, (state, action) => {
        state.isLoading = false;
        const request = state.requests.find(r => r.id === action.payload.id);
        if (request) {
          request.status = action.payload.status;
          request.timeline.push({
            status: action.payload.status,
            timestamp: new Date().toISOString(),
            note: action.payload.note,
          });
          
          if (action.payload.status === 'completed') {
            state.stats.active = Math.max(0, state.stats.active - 1);
            state.stats.completed += 1;
            state.sosActivated = false;
            state.activeRequest = null;
          }
        }
      })
      .addCase(updateEmergencyStatus.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// ============================================
// ACTIONS
// ============================================

export const {
  activateSOS,
  deactivateSOS,
  setActiveRequest,
  addTimelineEvent,
  updateAmbulanceLocation,
  clearError,
  resetEmergencyState,
} = emergencySlice.actions;

// ============================================
// SELECTORS
// ============================================

export const selectAllEmergencyRequests = (state: { emergency: EmergencyState }) => state.emergency.requests;
export const selectActiveRequest = (state: { emergency: EmergencyState }) => state.emergency.activeRequest;
export const selectNearbyHospitals = (state: { emergency: EmergencyState }) => state.emergency.nearbyHospitals;
export const selectAvailableAmbulances = (state: { emergency: EmergencyState }) => state.emergency.availableAmbulances;
export const selectEmergencyLoading = (state: { emergency: EmergencyState }) => state.emergency.isLoading;
export const selectEmergencySubmitting = (state: { emergency: EmergencyState }) => state.emergency.isSubmitting;
export const selectEmergencyError = (state: { emergency: EmergencyState }) => state.emergency.error;
export const selectSOSActivated = (state: { emergency: EmergencyState }) => state.emergency.sosActivated;
export const selectEmergencyStats = (state: { emergency: EmergencyState }) => state.emergency.stats;

export const selectActiveEmergencies = (state: { emergency: EmergencyState }) => 
  state.emergency.requests.filter(r => 
    r.status !== 'completed' && r.status !== 'cancelled'
  );

export const selectCriticalEmergencies = (state: { emergency: EmergencyState }) =>
  state.emergency.requests.filter(r => r.severity === 'critical' && r.status !== 'completed');

// ============================================
// REDUCER
// ============================================

export default emergencySlice.reducer;