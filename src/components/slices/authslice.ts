// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { 
  UserProfile, 
  AccountRole, 
  ProfileUpgrade, 
  DoctorProfile,
  HospitalProfile,
  BloodDonorProfile,
  PharmacyProfile 
} from '../../types/auth';

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingRole: AccountRole | null;
  pendingUpgrades: ProfileUpgrade[];
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  pendingRole: null,
  pendingUpgrades: [],
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserProfile>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.pendingRole = null;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.pendingRole = null;
      state.pendingUpgrades = [];
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    // Multi-role management
    addRole: (state, action: PayloadAction<AccountRole>) => {
      if (state.user && !state.user.roles.includes(action.payload)) {
        state.user.roles.push(action.payload);
      }
    },
    removeRole: (state, action: PayloadAction<AccountRole>) => {
      if (state.user) {
        state.user.roles = state.user.roles.filter(r => r !== action.payload);
      }
    },
    setPrimaryRole: (state, action: PayloadAction<AccountRole>) => {
      if (state.user) {
        state.user.primaryRole = action.payload;
      }
    },
    // Profile upgrades
    addUpgrade: (state, action: PayloadAction<ProfileUpgrade>) => {
      if (state.user && !state.user.upgrades.includes(action.payload)) {
        state.user.upgrades.push(action.payload);
      }
    },
    removeUpgrade: (state, action: PayloadAction<ProfileUpgrade>) => {
      if (state.user) {
        state.user.upgrades = state.user.upgrades.filter(u => u !== action.payload);
      }
    },
    // Admin approval
    setAdminApproved: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.isAdminApproved = action.payload;
      }
    },
    // Update profile with specific types
    updateDoctorProfile: (state, action: PayloadAction<Partial<DoctorProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateHospitalProfile: (state, action: PayloadAction<Partial<HospitalProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updateBloodDonorProfile: (state, action: PayloadAction<Partial<BloodDonorProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    updatePharmacyProfile: (state, action: PayloadAction<Partial<PharmacyProfile>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const {
  login,
  logout,
  setLoading,
  addRole,
  removeRole,
  setPrimaryRole,
  addUpgrade,
  removeUpgrade,
  setAdminApproved,
  updateDoctorProfile,
  updateHospitalProfile,
  updateBloodDonorProfile,
  updatePharmacyProfile,
} = authSlice.actions;

export default authSlice.reducer;