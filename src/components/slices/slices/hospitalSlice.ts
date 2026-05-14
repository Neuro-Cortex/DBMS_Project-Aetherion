import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { hospitalService } from '../../../services/hospitalService';

// ============================================
// TYPES
// ============================================
export interface Hospital {
  id: string;
  name: string;
  type: string;
  location: { address: string; city: string; state: string };
  rating: number;
  beds: { total: number; available: number; icu: { total: number; available: number } };
  emergency: boolean;
  verified: boolean;
  distance: number;
  eta: number;
}

export interface BedInfo {
  type: string;
  total: number;
  occupied: number;
  available: number;
  price: number;
}

export interface HospitalState {
  hospitals: Hospital[];
  nearbyHospitals: Hospital[];
  emergencyHospitals: Hospital[];
  selectedHospital: Hospital | null;
  beds: BedInfo[];
  isLoading: boolean;
  error: string | null;
}

// ============================================
// INITIAL STATE
// ============================================
const initialState: HospitalState = {
  hospitals: [],
  nearbyHospitals: [],
  emergencyHospitals: [],
  selectedHospital: null,
  beds: [],
  isLoading: false,
  error: null,
};

// ============================================
// ASYNC THUNKS
// ============================================
export const fetchHospitals = createAsyncThunk(
  'hospital/fetchHospitals',
  async (params?: { emergency?: boolean; city?: string }, { rejectWithValue }) => {
    try {
      return await hospitalService.getHospitals(params);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch hospitals');
    }
  }
);

export const fetchHospitalById = createAsyncThunk(
  'hospital/fetchHospitalById',
  async (id: string, { rejectWithValue }) => {
    try {
      return await hospitalService.getHospitalById(id);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Hospital not found');
    }
  }
);

export const fetchBeds = createAsyncThunk(
  'hospital/fetchBeds',
  async (hospitalId: string, { rejectWithValue }) => {
    try {
      return await hospitalService.getBeds(hospitalId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch beds');
    }
  }
);

export const bookBed = createAsyncThunk(
  'hospital/bookBed',
  async (
    { hospitalId, bedType, patientId }: { hospitalId: string; bedType: string; patientId: string },
    { rejectWithValue }
  ) => {
    try {
      return await hospitalService.bookBed(hospitalId, bedType, patientId);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Booking failed');
    }
  }
);

// ============================================
// SLICE
// ============================================
const hospitalSlice = createSlice({
  name: 'hospital',
  initialState,
  reducers: {
    setSelectedHospital: (state, action: PayloadAction<Hospital | null>) => {
      state.selectedHospital = action.payload;
    },
    updateBedAvailability: (state, action: PayloadAction<{ type: string; change: number }>) => {
      state.beds = state.beds.map((bed) => {
        if (bed.type === action.payload.type) {
          const newAvailable = Math.max(0, Math.min(bed.total, bed.available + action.payload.change));
          return { ...bed, available: newAvailable, occupied: bed.total - newAvailable };
        }
        return bed;
      });
    },
    clearError: (state) => {
      state.error = null;
    },
    resetHospital: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Hospitals
    builder
      .addCase(fetchHospitals.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchHospitals.fulfilled, (state, action: PayloadAction<Hospital[]>) => {
        state.isLoading = false;
        state.hospitals = action.payload;
        state.nearbyHospitals = [...action.payload].sort((a, b) => a.distance - b.distance);
        state.emergencyHospitals = action.payload.filter((h) => h.emergency);
      })
      .addCase(fetchHospitals.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Hospital By ID
    builder
      .addCase(fetchHospitalById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchHospitalById.fulfilled, (state, action: PayloadAction<Hospital>) => {
        state.isLoading = false;
        state.selectedHospital = action.payload;
      })
      .addCase(fetchHospitalById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Beds
    builder
      .addCase(fetchBeds.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBeds.fulfilled, (state, action: PayloadAction<BedInfo[]>) => {
        state.isLoading = false;
        state.beds = action.payload;
      })
      .addCase(fetchBeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Book Bed
    builder
      .addCase(bookBed.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(bookBed.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(bookBed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// ============================================
// EXPORTS
// ============================================
export const { setSelectedHospital, updateBedAvailability, clearError, resetHospital } = hospitalSlice.actions;
export default hospitalSlice.reducer;

// Selectors
export const selectHospitals = (state: { hospital: HospitalState }) => state.hospital.hospitals;
export const selectNearbyHospitals = (state: { hospital: HospitalState }) => state.hospital.nearbyHospitals;
export const selectEmergencyHospitals = (state: { hospital: HospitalState }) => state.hospital.emergencyHospitals;
export const selectSelectedHospital = (state: { hospital: HospitalState }) => state.hospital.selectedHospital;
export const selectBeds = (state: { hospital: HospitalState }) => state.hospital.beds;
export const selectHospitalLoading = (state: { hospital: HospitalState }) => state.hospital.isLoading;
export const selectHospitalError = (state: { hospital: HospitalState }) => state.hospital.error;
export const selectTotalBedsAvailable = (state: { hospital: HospitalState }) =>
  state.hospital.beds.reduce((sum, b) => sum + b.available, 0);