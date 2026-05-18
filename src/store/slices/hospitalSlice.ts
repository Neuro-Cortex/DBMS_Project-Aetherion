// src/store/slices/hospitalSlice.ts
// HOSPITAL STATE MANAGEMENT

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================
// TYPES
// ============================================

export interface HospitalProfile {
  id: string;
  name: string;
  registrationNumber: string;
  type: 'government' | 'private' | 'charitable';
  phone: string;
  emergencyPhone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalBeds: number;
  availableBeds: number;
  icuTotalBeds: number;
  icuAvailableBeds: number;
  emergencyServiceStatus: 'active' | 'busy' | 'unavailable';
  ambulanceCount: number;
  ambulanceAvailable: number;
  rating: number;
  isVerified: boolean;
}

export interface BedInfo {
  id: string;
  hospitalId: string;
  type: 'general' | 'icu' | 'emergency' | 'pediatric' | 'maternity';
  total: number;
  available: number;
  occupied: number;
  costPerDay: number;
}

export interface BloodStock {
  bloodGroup: string;
  units: number;
  status: 'sufficient' | 'low' | 'critical' | 'out-of-stock';
}

export interface HospitalStats {
  todayPatients: number;
  newAdmissions: number;
  discharges: number;
  emergencies: number;
  surgeries: number;
  occupancyRate: number;
}

export interface HospitalState {
  profile: HospitalProfile | null;
  bedInfo: BedInfo[];
  bloodStock: BloodStock[];
  stats: HospitalStats | null;
  doctors: any[];
  departments: any[];
  isLoading: boolean;
  error: string | null;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: HospitalState = {
  profile: null,
  bedInfo: [],
  bloodStock: [],
  stats: null,
  doctors: [],
  departments: [],
  isLoading: false,
  error: null,
};

// ============================================
// SLICE
// ============================================

const hospitalSlice = createSlice({
  name: 'hospital',
  initialState,
  reducers: {
    // Profile
    setHospitalProfile: (state, action: PayloadAction<HospitalProfile>) => {
      state.profile = action.payload;
    },
    updateHospitalProfile: (state, action: PayloadAction<Partial<HospitalProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },

    // Beds
    setBedInfo: (state, action: PayloadAction<BedInfo[]>) => {
      state.bedInfo = action.payload;
    },
    updateBedAvailability: (state, action: PayloadAction<{ bedId: string; available: number; occupied: number }>) => {
      state.bedInfo = state.bedInfo.map(bed =>
        bed.id === action.payload.bedId
          ? { ...bed, available: action.payload.available, occupied: action.payload.occupied }
          : bed
      );
    },

    // Blood Stock
    setBloodStock: (state, action: PayloadAction<BloodStock[]>) => {
      state.bloodStock = action.payload;
    },
    updateBloodStock: (state, action: PayloadAction<{ bloodGroup: string; units: number }>) => {
      state.bloodStock = state.bloodStock.map(bs =>
        bs.bloodGroup === action.payload.bloodGroup
          ? { ...bs, units: action.payload.units }
          : bs
      );
    },

    // Stats
    setHospitalStats: (state, action: PayloadAction<HospitalStats>) => {
      state.stats = action.payload;
    },

    // Doctors
    setDoctors: (state, action: PayloadAction<any[]>) => {
      state.doctors = action.payload;
    },
    addDoctor: (state, action: PayloadAction<any>) => {
      state.doctors.push(action.payload);
    },
    removeDoctor: (state, action: PayloadAction<string>) => {
      state.doctors = state.doctors.filter(d => d.id !== action.payload);
    },

    // Departments
    setDepartments: (state, action: PayloadAction<any[]>) => {
      state.departments = action.payload;
    },

    // Emergency Status
    setEmergencyStatus: (state, action: PayloadAction<'active' | 'busy' | 'unavailable'>) => {
      if (state.profile) {
        state.profile.emergencyServiceStatus = action.payload;
      }
    },

    // Loading & Error
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Reset
    clearHospital: () => initialState,
  },
});

export const {
  setHospitalProfile, updateHospitalProfile,
  setBedInfo, updateBedAvailability,
  setBloodStock, updateBloodStock,
  setHospitalStats, setDoctors, addDoctor, removeDoctor,
  setDepartments, setEmergencyStatus,
  setLoading, setError, clearHospital,
} = hospitalSlice.actions;

export default hospitalSlice.reducer;