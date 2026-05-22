import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { doctorService } from '../../../services/doctorService';

// ============================================
// TYPES
// ============================================
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  image?: string;
  availability: string;
  fee: number;
  languages: string[];
  location: string;
  verified: boolean;
  specialties: string[];
  education: string;
  reviewsCount: number;
  nextSlot: string;
}

export interface DoctorFilters {
  specialty?: string;
  minRating?: number;
  maxFee?: number;
  searchQuery?: string;
  location?: string;
}

export interface DoctorState {
  doctors: Doctor[];
  filteredDoctors: Doctor[];
  selectedDoctor: Doctor | null;
  filters: DoctorFilters;
  specialties: string[];
  isLoading: boolean;
  error: string | null;
}

// ============================================
// INITIAL STATE
// ============================================
const initialState: DoctorState = {
  doctors: [],
  filteredDoctors: [],
  selectedDoctor: null,
  filters: {},
  specialties: [],
  isLoading: false,
  error: null,
};

// ============================================
// ASYNC THUNKS
// ============================================
export const fetchDoctors = createAsyncThunk(
  'doctor/fetchDoctors',
  async (filters: DoctorFilters | undefined, { rejectWithValue }: any) => {
    try {
      const doctors = await doctorService.getDoctors(filters);
      return { doctors, filters };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch doctors');
    }
  }
);

export const fetchDoctorById = createAsyncThunk(
  'doctor/fetchDoctorById',
  async (id: string, { rejectWithValue }: any) => {
    try {
      const doctor = await doctorService.getDoctorById(id);
      return doctor;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Doctor not found');
    }
  }
);

export const fetchSpecialties = createAsyncThunk(
  'doctor/fetchSpecialties',
  async (_: void, { rejectWithValue }: any) => {
    try {
      return await doctorService.getSpecialties();
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch specialties');
    }
  }
);

// ============================================
// HELPER: Apply Filters
// ============================================
const applyFilters = (doctors: Doctor[], filters: DoctorFilters): Doctor[] => {
  let filtered = [...doctors];

  if (filters.searchQuery) {
    const q = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (d) =>
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.location.toLowerCase().includes(q)
    );
  }

  if (filters.specialty) {
    filtered = filtered.filter((d) => d.specialty === filters.specialty);
  }

  if (filters.minRating) {
    filtered = filtered.filter((d) => d.rating >= filters.minRating!);
  }

  if (filters.maxFee) {
    filtered = filtered.filter((d) => d.fee <= filters.maxFee!);
  }

  return filtered;
};

// ============================================
// SLICE
// ============================================
const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    setSelectedDoctor: (state, action: PayloadAction<Doctor | null>) => {
      state.selectedDoctor = action.payload;
    },
    setFilters: (state, action: PayloadAction<DoctorFilters>) => {
      state.filters = action.payload;
      state.filteredDoctors = applyFilters(state.doctors, action.payload);
    },
    updateFilters: (state, action: PayloadAction<Partial<DoctorFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.filteredDoctors = applyFilters(state.doctors, state.filters);
    },
    resetFilters: (state) => {
      state.filters = {};
      state.filteredDoctors = state.doctors;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Doctors
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action: PayloadAction<{ doctors: Doctor[]; filters?: DoctorFilters }>) => {
        state.isLoading = false;
        state.doctors = action.payload.doctors;
        state.filteredDoctors = applyFilters(action.payload.doctors, state.filters);
        state.specialties = [...new Set(action.payload.doctors.map((d) => d.specialty))];
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Doctor By ID
    builder
      .addCase(fetchDoctorById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action: PayloadAction<Doctor>) => {
        state.isLoading = false;
        state.selectedDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Specialties
    builder
      .addCase(fetchSpecialties.fulfilled, (state, action: PayloadAction<string[]>) => {
        state.specialties = action.payload;
      });
  },
});

// ============================================
// EXPORTS
// ============================================
export const { setSelectedDoctor, setFilters, updateFilters, resetFilters, clearError } = doctorSlice.actions;
export default doctorSlice.reducer;

// Selectors
export const selectDoctors = (state: { doctor: DoctorState }) => state.doctor.filteredDoctors;
export const selectAllDoctors = (state: { doctor: DoctorState }) => state.doctor.doctors;
export const selectSelectedDoctor = (state: { doctor: DoctorState }) => state.doctor.selectedDoctor;
export const selectDoctorFilters = (state: { doctor: DoctorState }) => state.doctor.filters;
export const selectSpecialties = (state: { doctor: DoctorState }) => state.doctor.specialties;
export const selectDoctorLoading = (state: { doctor: DoctorState }) => state.doctor.isLoading;
export const selectDoctorError = (state: { doctor: DoctorState }) => state.doctor.error;
export const selectDoctorCount = (state: { doctor: DoctorState }) => state.doctor.filteredDoctors.length;