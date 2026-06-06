// src/store/slices/authSlice.ts
// AUTHENTICATION + MULTI-ROLE MANAGEMENT (No Data Save)

import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

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
  
  // ❌ Token সরানো হয়েছে - কোন ডাটা সেভ হবে না
  // token?: string;
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
// ASYNC THUNKS - localStorage সরানো হয়েছে
// ============================================

// ✅ Login thunk - calls real API
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password, role }: { email: string; password: string; role?: string }) => {
    const { authService } = await import('../../services/authService');
    const result = await authService.login({ email, password, role });
    return result.user;
  }
);

// ✅ Register thunk - calls real API
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData: Partial<User> & { password: string }) => {
    const { authService } = await import('../../services/authService');
    const result = await authService.register({
      name: userData.name || userData.fullName || '',
      full_name: userData.fullName || userData.name || '',
      email: userData.email || '',
      phone: userData.phone || '',
      password: userData.password,
      confirm_password: userData.password,
      role: userData.primaryRole || userData.role || 'patient',
      gender: userData.gender,
    });
    return result.user;
  }
);

// ✅ Logout thunk - calls real API
export const logoutUser = createAsyncThunk('auth/logoutUser', async () => {
  const { authService } = await import('../../services/authService');
  await authService.logout();
  return null;
});

// ============================================
// SLICE
// ============================================

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
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

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
      // ❌ localStorage.removeItem('token'); সরানো হয়েছে
    },

    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
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
        if (state.user.primaryRole === action.payload) {
          state.user.primaryRole = state.user.roles[0] || 'normal_user';
        }
      }
    },
    setPrimaryRole: (state, action: PayloadAction<AccountRole>) => {
      if (state.user && state.user.roles.includes(action.payload)) {
        state.user.primaryRole = action.payload;
      }
    },
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
    switchRole: (state, action: PayloadAction<AccountRole>) => {
      if (state.user && state.user.roles.includes(action.payload)) {
        state.user.primaryRole = action.payload;
      }
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      if (state.user) {
        state.user.isOnline = action.payload;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  
  extraReducers: (builder) => {
    builder
      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload as any;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload as any;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      // Logout User
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = null;
      });
      // getCurrentUser extraReducers can be added when needed
  },
});

// ============================================
// SELECTORS
// ============================================

export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export const selectIsLoading = (state: { auth: AuthState }) => state.auth.isLoading;
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error;
export const selectUserRoles = (state: { auth: AuthState }) => state.auth.user?.roles || [];
export const selectPrimaryRole = (state: { auth: AuthState }) => state.auth.user?.primaryRole || 'normal_user';
export const selectUserUpgrades = (state: { auth: AuthState }) => state.auth.user?.upgrades || [];

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
  clearError,
  setLoading,
} = authSlice.actions;

export default authSlice.reducer;