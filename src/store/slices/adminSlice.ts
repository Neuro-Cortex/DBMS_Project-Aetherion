// src/store/slices/adminSlice.ts
// ADMIN STATE MANAGEMENT

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================
// TYPES
// ============================================

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: 'super-admin' | 'admin' | 'moderator' | 'support';
  permissions: string[];
  lastLogin: string;
  isActive: boolean;
}

export interface SystemStats {
  totalUsers: number;
  totalDoctors: number;
  totalHospitals: number;
  totalPharmacies: number;
  totalBloodDonors: number;
  activeUsers: number;
  newUsersToday: number;
  blockedUsers: number;
}

export interface PendingVerification {
  id: string;
  type: 'doctor' | 'hospital' | 'pharmacy';
  name: string;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface AdminState {
  currentAdmin: AdminUser | null;
  stats: SystemStats | null;
  pendingVerifications: PendingVerification[];
  allUsers: any[];
  isLoading: boolean;
  error: string | null;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: AdminState = {
  currentAdmin: null,
  stats: null,
  pendingVerifications: [],
  allUsers: [],
  isLoading: false,
  error: null,
};

// ============================================
// SLICE
// ============================================

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Admin Auth
    setCurrentAdmin: (state, action: PayloadAction<AdminUser>) => {
      state.currentAdmin = action.payload;
    },

    // Stats
    setStats: (state, action: PayloadAction<SystemStats>) => {
      state.stats = action.payload;
    },
    updateStats: (state, action: PayloadAction<Partial<SystemStats>>) => {
      if (state.stats) {
        state.stats = { ...state.stats, ...action.payload };
      }
    },

    // Pending Verifications
    setPendingVerifications: (state, action: PayloadAction<PendingVerification[]>) => {
      state.pendingVerifications = action.payload;
    },
    approveVerification: (state, action: PayloadAction<string>) => {
      state.pendingVerifications = state.pendingVerifications.map(v =>
        v.id === action.payload ? { ...v, status: 'approved' as const } : v
      );
    },
    rejectVerification: (state, action: PayloadAction<string>) => {
      state.pendingVerifications = state.pendingVerifications.map(v =>
        v.id === action.payload ? { ...v, status: 'rejected' as const } : v
      );
    },

    // Users Management
    setAllUsers: (state, action: PayloadAction<any[]>) => {
      state.allUsers = action.payload;
    },
    blockUser: (state, action: PayloadAction<string>) => {
      state.allUsers = state.allUsers.map(u =>
        u.id === action.payload ? { ...u, isActive: false } : u
      );
    },
    unblockUser: (state, action: PayloadAction<string>) => {
      state.allUsers = state.allUsers.map(u =>
        u.id === action.payload ? { ...u, isActive: true } : u
      );
    },
    deleteUser: (state, action: PayloadAction<string>) => {
      state.allUsers = state.allUsers.filter(u => u.id !== action.payload);
    },

    // Loading & Error
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Reset
    clearAdmin: () => initialState,
  },
});

export const {
  setCurrentAdmin, setStats, updateStats,
  setPendingVerifications, approveVerification, rejectVerification,
  setAllUsers, blockUser, unblockUser, deleteUser,
  setLoading, setError, clearAdmin,
} = adminSlice.actions;

export default adminSlice.reducer;