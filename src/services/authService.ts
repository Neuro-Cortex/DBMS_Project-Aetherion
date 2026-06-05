// src/services/authService.ts

import api, { saveUser, clearUser, getCurrentUser } from './api';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface User {
  id: string;
  name: string;
  fullName?: string;
  email: string;
  phone?: string;
  role?: string;
  roles?: string[];
  primaryRole?: string;
  upgrades?: string[];
  avatar?: string;
  profileImage?: string;
  bloodGroup?: string;
  gender?: string;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  isVerified?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  isAdminApproved?: boolean;
  isOnline?: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  language: string;
  theme: string;
  timezone: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  role?: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  full_name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  confirm_password?: string;
  role: string;
  gender?: string;
  acceptTerms?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface ChangePasswordData {
  currentPassword: string;
  current_password: string;
  newPassword: string;
  new_password: string;
  confirmNewPassword: string;
  confirm_new_password: string;
}

export interface ResetPasswordData {
  email?: string;
  token: string;
  newPassword: string;
  new_password: string;
  confirmNewPassword: string;
  confirm_password: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface VerifyEmailResponse {
  verified: boolean;
  message: string;
}

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<any>('/auth/login', {
      email: credentials.email,
      password: credentials.password,
      role: credentials.role,
    });

    if (response.success && response.data) {
      const tokenData = response.data;
      const accessToken = tokenData.access_token;
      const refreshToken = tokenData.refresh_token;
      const userData = tokenData.user || {};

      // Normalize user object
      const user: User = {
        id: userData.id,
        name: userData.full_name || userData.name || credentials.email.split('@')[0],
        fullName: userData.full_name,
        email: userData.email || credentials.email,
        phone: userData.phone,
        role: userData.primary_role || userData.role || 'patient',
        roles: userData.roles || [userData.primary_role || 'patient'],
        primaryRole: userData.primary_role,
        upgrades: userData.upgrades || [],
        avatar: userData.profile_image,
        profileImage: userData.profile_image,
        bloodGroup: userData.blood_group,
        gender: userData.gender,
        token: accessToken,
        isVerified: userData.is_verified,
        emailVerified: userData.is_verified,
        isAdminApproved: userData.is_admin_approved,
        isActive: userData.is_active,
        isOnline: userData.is_online,
        createdAt: userData.created_at,
      };

      // Persist auth data
      saveUser({ ...user, token: accessToken });
      if (credentials.rememberMe && refreshToken) {
        localStorage.setItem('medicare_refresh_token', refreshToken);
      }

      return {
        user,
        token: accessToken,
        refreshToken,
        expiresIn: tokenData.expires_in,
      };
    }

    throw new Error(response.message || 'Login failed');
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<any>('/auth/register', {
      full_name: data.full_name || data.name,
      email: data.email,
      phone: data.phone,
      password: data.password,
      confirm_password: data.confirm_password || data.confirmPassword,
      role: data.role,
      gender: data.gender,
    });

    if (response.success && response.data) {
      const tokenData = response.data;
      const accessToken = tokenData.access_token;
      const refreshToken = tokenData.refresh_token;
      const userData = tokenData.user || {};

      const user: User = {
        id: userData.id,
        name: userData.full_name || data.name,
        fullName: userData.full_name,
        email: userData.email || data.email,
        phone: userData.phone || data.phone,
        role: userData.primary_role || data.role,
        roles: userData.roles || [data.role],
        primaryRole: userData.primary_role,
        upgrades: userData.upgrades || [],
        avatar: userData.profile_image,
        profileImage: userData.profile_image,
        token: accessToken,
        isVerified: userData.is_verified || false,
        emailVerified: userData.is_verified || false,
        isActive: userData.is_active ?? true,
        isAdminApproved: userData.is_admin_approved || false,
        createdAt: userData.created_at,
      };

      saveUser({ ...user, token: accessToken });

      return {
        user,
        token: accessToken,
        refreshToken,
        expiresIn: tokenData.expires_in,
      };
    }

    throw new Error(response.message || 'Registration failed');
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      const refreshToken = localStorage.getItem('medicare_refresh_token');
      await api.post('/auth/logout', { refresh_token: refreshToken });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearUser();
    }
  },

  /**
   * Get current authenticated user from localStorage
   */
  getCurrentUser: (): User | null => {
    return getCurrentUser() as User | null;
  },

  /**
   * Get user profile from server
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<any>('/auth/profile');

    if (response.success && response.data) {
      const userData = response.data;
      const currentUser = getCurrentUser() as User | null;
      const token = currentUser?.token;

      const user: User = {
        id: userData.id,
        name: userData.full_name || userData.name,
        fullName: userData.full_name,
        email: userData.email,
        phone: userData.phone,
        role: userData.primary_role || userData.role,
        roles: userData.roles,
        primaryRole: userData.primary_role,
        upgrades: userData.upgrades || [],
        avatar: userData.profile_image,
        profileImage: userData.profile_image,
        bloodGroup: userData.blood_group,
        gender: userData.gender,
        token,
        isVerified: userData.is_verified,
        emailVerified: userData.is_verified,
        isAdminApproved: userData.is_admin_approved,
        isActive: userData.is_active,
        isOnline: userData.is_online,
        createdAt: userData.created_at,
        updatedAt: userData.updated_at,
      };

      saveUser({ ...user, token });
      return user;
    }

    throw new Error(response.message || 'Failed to fetch profile');
  },

  /**
   * Update user profile
   */
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    const response = await api.put<any>('/auth/profile', {
      full_name: updates.fullName || updates.name,
      phone: updates.phone,
      gender: updates.gender,
      profile_image: updates.avatar || updates.profileImage,
      blood_group: updates.bloodGroup,
    });

    if (response.success) {
      const currentUser = getCurrentUser() as User;
      const updatedUser = {
        ...currentUser,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      saveUser(updatedUser);
      return updatedUser;
    }

    throw new Error(response.message || 'Failed to update profile');
  },

  /**
   * Change user password
   */
  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    const response = await api.post<any>('/auth/change-password', {
      current_password: data.currentPassword || data.current_password,
      new_password: data.newPassword || data.new_password,
      confirm_new_password: data.confirmNewPassword || data.confirm_new_password,
    });

    if (response.success) {
      return { message: response.message || 'Password changed successfully' };
    }

    throw new Error(response.message || 'Failed to change password');
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    const response = await api.post<any>('/auth/forgot-password', { email });

    if (response.success) {
      return { message: response.message || 'Password reset email sent.' };
    }

    throw new Error(response.message || 'Failed to request password reset');
  },

  /**
   * Reset password using token
   */
  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    const response = await api.post<any>('/auth/reset-password', {
      token: data.token,
      new_password: data.newPassword || data.new_password,
      confirm_password: data.confirmNewPassword || data.confirm_password,
    });

    if (response.success) {
      return { message: response.message || 'Password reset successfully' };
    }

    throw new Error(response.message || 'Failed to reset password');
  },

  /**
   * Verify email address
   */
  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    const response = await api.post<any>('/auth/verify-email', { token });

    if (response.success) {
      const currentUser = getCurrentUser() as User | null;
      if (currentUser) {
        const updatedUser = { ...currentUser, emailVerified: true, isVerified: true };
        saveUser(updatedUser);
      }
      return { verified: true, message: response.message || 'Email verified successfully' };
    }

    throw new Error(response.message || 'Email verification failed');
  },

  /**
   * Resend verification email
   */
  resendVerificationEmail: async (email?: string): Promise<{ message: string }> => {
    const response = await api.post<any>('/auth/verify-email', { email });

    return { message: response.message || 'Verification email sent' };
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (): Promise<{ token: string; refreshToken?: string }> => {
    const refreshToken = localStorage.getItem('medicare_refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await api.post<any>('/auth/refresh', {
      refresh_token: refreshToken,
    });

    if (response.success && response.data) {
      const newToken = response.data.access_token;
      const newRefreshToken = response.data.refresh_token;
      const currentUser = getCurrentUser() as User | null;

      if (currentUser) {
        const userData = { ...currentUser, token: newToken };
        saveUser(userData);
        if (newRefreshToken) {
          localStorage.setItem('medicare_refresh_token', newRefreshToken);
        }
      }

      return { token: newToken, refreshToken: newRefreshToken };
    }

    throw new Error(response.message || 'Token refresh failed');
  },

  /**
   * Switch active role
   */
  switchRole: async (role: string): Promise<{ token: string; role: string }> => {
    const response = await api.post<any>('/auth/switch-role', { role });

    if (response.success && response.data) {
      const newToken = response.data.access_token;
      const currentUser = getCurrentUser() as User | null;

      if (currentUser) {
        const userData = {
          ...currentUser,
          token: newToken,
          primaryRole: role,
          role,
        };
        saveUser(userData);
      }

      return { token: newToken, role };
    }

    throw new Error(response.message || 'Role switch failed');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const user = authService.getCurrentUser();
    return !!user && !!user.token;
  },

  /**
   * Check if user has specific role
   */
  hasRole: (roles: string | string[]): boolean => {
    const user = authService.getCurrentUser();
    if (!user) return false;

    const roleList = Array.isArray(roles) ? roles : [roles];
    const userRoles = user.roles || [user.role] || [];
    return roleList.some(r => userRoles.includes(r) || user.primaryRole === r || user.role === r);
  },

  /**
   * Check if email is verified
   */
  isEmailVerified: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.emailVerified || user?.isVerified || false;
  },

  /**
   * Get user preferences
   */
  getUserPreferences: (): UserPreferences | null => {
    const user = authService.getCurrentUser();
    return user?.preferences || null;
  },

  /**
   * Update user preferences
   */
  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<UserPreferences> => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }

    const updatedPreferences: UserPreferences = {
      ...(currentUser.preferences ?? {
        notifications: { email: true, sms: true, push: true },
        language: 'en',
        theme: 'system',
        timezone: 'UTC',
      }),
      ...preferences,
    };

    await authService.updateProfile({ preferences: updatedPreferences });
    return updatedPreferences;
  },
};

// ============================================
// AUTH HOOK
// ============================================

export const useAuth = () => {
  return {
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated(),
    isAdmin: authService.hasRole(['admin', 'super_admin']),
    isDoctor: authService.hasRole('doctor'),
    isPatient: authService.hasRole(['patient', 'client']),
    isEmailVerified: authService.isEmailVerified(),
    login: authService.login,
    register: authService.register,
    logout: authService.logout,
    updateProfile: authService.updateProfile,
    changePassword: authService.changePassword,
    refreshToken: authService.refreshToken,
    switchRole: authService.switchRole,
  };
};

export default authService;
