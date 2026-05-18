// src/store/slices/authSlice.ts
// AUTHENTICATION + MULTI-ROLE MANAGEMENT

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================
// TYPES
// ============================================

export type AccountRole = 'normal_user' | 'client' | 'doctor' | 'hospital' | 'hospital_admin' | 'hospital_authority' | 'pharmacy' | 'pharmacy_admin' | 'admin' | 'admin_applicant' | 'blood_donor' | 'emergency_volunteer';

export type ProfileUpgrade = 'client_patient' | 'blood_donor' | 'pharmacy_user' | 'emergency_volunteer';

export interface User {
  id: string;
  name?: string;
  fullName?: string;
  email: string;
  phone?: string;
  bloodGroup?: string;
  gender?: 'male' | 'female' | 'other';
  profileImage?: string;
  role?: AccountRole;
  
  // Multi-role support
  roles: AccountRole[];           // All roles user has
  primaryRole: AccountRole;       // Current active role
  upgrades: ProfileUpgrade[];     // Profile upgrades
  
  // Status
  isVerified?: boolean;
  isAdminApproved?: boolean;
  isActive?: boolean;
  isOnline?: boolean;
  
  // Timestamps
  createdAt: string;
  updatedAt?: string;
  lastLogin?: string;
  
  // Token
  token?: string;
  [key: string]: unknown;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// ============================================
// SLICE
// ============================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    login: (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      localStorage.removeItem('token');
    },

    // Update Profile
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    // ============================================
    // MULTI-ROLE MANAGEMENT
    // ============================================
    
    // Add a new role
    addRole: (state, action: PayloadAction<AccountRole>) => {
      if (state.user && !state.user.roles.includes(action.payload)) {
        state.user.roles.push(action.payload);
      }
    },

    // Remove a role
    removeRole: (state, action: PayloadAction<AccountRole>) => {
      if (state.user) {
        state.user.roles = state.user.roles.filter(r => r !== action.payload);
        // If primary role is removed, set to first available
        if (state.user.primaryRole === action.payload) {
          state.user.primaryRole = state.user.roles[0] || 'normal_user';
        }
      }
    },

    // Set primary (active) role
    setPrimaryRole: (state, action: PayloadAction<AccountRole>) => {
      if (state.user && state.user.roles.includes(action.payload)) {
        state.user.primaryRole = action.payload;
      }
    },

    // Add profile upgrade
    addUpgrade: (state, action: PayloadAction<ProfileUpgrade>) => {
      if (state.user && !state.user.upgrades.includes(action.payload)) {
        state.user.upgrades.push(action.payload);
      }
    },

    // Remove profile upgrade
    removeUpgrade: (state, action: PayloadAction<ProfileUpgrade>) => {
      if (state.user) {
        state.user.upgrades = state.user.upgrades.filter(u => u !== action.payload);
      }
    },

    // Switch role (convenience)
    switchRole: (state, action: PayloadAction<AccountRole>) => {
      if (state.user && state.user.roles.includes(action.payload)) {
        state.user.primaryRole = action.payload;
      }
    },

    // Set online status
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.isOnline = action.payload;
      }
    },
  },
});

// ============================================
// EXPORTS
// ============================================

export const {
  loginStart,
  login,
  loginSuccess,
  loginFailure,
  logout,
  updateProfile,
  addRole,
  removeRole,
  setPrimaryRole,
  addUpgrade,
  removeUpgrade,
  switchRole,
  setOnlineStatus,
} = authSlice.actions;

export default authSlice.reducer;

