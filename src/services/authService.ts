// src/services/authService.ts

import api, { simulateDelay } from './api';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'patient' | 'doctor' | 'admin';
  avatar?: string;
  token?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  preferences?: UserPreferences;
}

export interface UserPreferences {
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
  language: 'en' | 'bn';
  theme: 'light' | 'dark' | 'system';
  timezone: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  role: 'patient' | 'doctor';
  acceptTerms?: boolean;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ResetPasswordData {
  email: string;
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface ForgotPasswordResponse {
  message: string;
  resetToken?: string; // Only in development
}

export interface VerifyEmailResponse {
  verified: boolean;
  message: string;
}

// ============================================
// MOCK DATABASE (will be replaced by real API)
// ============================================

interface MockUser extends User {
  password: string;
  refreshToken?: string;
}

const mockUsers: MockUser[] = [
  {
    id: 'usr_001',
    name: 'Admin User',
    email: 'admin@medicare.com',
    phone: '+1 (555) 000-0000',
    role: 'admin',
    password: 'Admin@123',
    token: 'mock_admin_token_123',
    refreshToken: 'mock_admin_refresh_123',
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date().toISOString(),
    preferences: {
      notifications: { email: true, sms: true, push: true },
      language: 'en',
      theme: 'dark',
      timezone: 'Asia/Dhaka'
    }
  },
  {
    id: 'usr_002',
    name: 'Dr. Sarah Wilson',
    email: 'sarah@hospital.com',
    phone: '+1 (555) 111-2222',
    role: 'doctor',
    password: 'Doctor@123',
    token: 'mock_doctor_token_456',
    refreshToken: 'mock_doctor_refresh_456',
    isActive: true,
    emailVerified: true,
    phoneVerified: true,
    createdAt: new Date().toISOString(),
    preferences: {
      notifications: { email: true, sms: false, push: true },
      language: 'en',
      theme: 'system',
      timezone: 'Asia/Dhaka'
    }
  },
  {
    id: 'usr_003',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 333-4444',
    role: 'patient',
    password: 'Patient@123',
    token: 'mock_patient_token_789',
    refreshToken: 'mock_patient_refresh_789',
    isActive: true,
    emailVerified: false,
    phoneVerified: true,
    createdAt: new Date().toISOString(),
    preferences: {
      notifications: { email: true, sms: true, push: false },
      language: 'bn',
      theme: 'light',
      timezone: 'Asia/Dhaka'
    }
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateToken = (userId: string, role: string): string => {
  // In production, this would be a JWT signed by the server
  return `jwt_${Date.now()}_${userId}_${role}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateRefreshToken = (userId: string): string => {
  return `refresh_${Date.now()}_${userId}_${Math.random().toString(36).substr(2, 9)}`;
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;
  return phoneRegex.test(phone);
};

const validatePassword = (password: string): { valid: boolean; message: string } => {
  if (password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters long' };
  }
  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!/[a-z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!/[0-9]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number' };
  }
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one special character' };
  }
  return { valid: true, message: 'Password is valid' };
};

// ============================================
// AUTH SERVICE
// ============================================

export const authService = {
  /**
   * Login user with email and password
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    await simulateDelay(1200);

    try {
      // TODO: Uncomment for real API
      // const response = await api.post<AuthResponse>('/auth/login', credentials);
      // if (response.success && response.data) {
      //   const { user, token, refreshToken, expiresIn } = response.data;
      //   const userData = { ...user, token };
      //   localStorage.setItem('medicare_user', JSON.stringify(userData));
      //   if (credentials.rememberMe) {
      //     localStorage.setItem('medicare_refresh_token', refreshToken || '');
      //   }
      //   return { user: userData, token, refreshToken, expiresIn };
      // }
      // throw new Error(response.message);

      // Mock implementation (remove in production)
      const user = mockUsers.find(
        u => u.email === credentials.email && u.password === credentials.password
      );

      if (!user) {
        throw new Error('Invalid email or password');
      }

      if (!user.isActive) {
        throw new Error('Your account has been deactivated. Please contact support.');
      }

      const { password, refreshToken: oldRefreshToken, ...userWithoutPassword } = user;
      const token = generateToken(user.id, user.role);
      const refreshToken = credentials.rememberMe ? generateRefreshToken(user.id) : undefined;
      
      const userData = { ...userWithoutPassword, token };
      
      // Persist auth data
      localStorage.setItem('medicare_user', JSON.stringify(userData));
      if (refreshToken) {
        localStorage.setItem('medicare_refresh_token', refreshToken);
      }
      
      // Update mock user's refresh token
      if (refreshToken) {
        user.refreshToken = refreshToken;
      }

      return {
        user: userData,
        token,
        refreshToken,
        expiresIn: 7 * 24 * 60 * 60 // 7 days in seconds
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  /**
   * Register new user
   */
  register: async (data: RegisterData): Promise<AuthResponse> => {
    await simulateDelay(1500);

    try {
      // TODO: Uncomment for real API
      // const response = await api.post<AuthResponse>('/auth/register', data);
      // if (response.success && response.data) {
      //   const { user, token, refreshToken } = response.data;
      //   const userData = { ...user, token };
      //   localStorage.setItem('medicare_user', JSON.stringify(userData));
      //   return { user: userData, token, refreshToken };
      // }
      // throw new Error(response.message);

      // Validation
      if (!data.name || data.name.trim().length < 2) {
        throw new Error('Name must be at least 2 characters long');
      }

      if (!validateEmail(data.email)) {
        throw new Error('Please enter a valid email address');
      }

      if (!validatePhone(data.phone)) {
        throw new Error('Please enter a valid phone number');
      }

      const passwordValidation = validatePassword(data.password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (!data.acceptTerms) {
        throw new Error('You must accept the terms and conditions');
      }

      // Check if email already exists
      const existingUser = mockUsers.find(u => u.email === data.email);
      if (existingUser) {
        throw new Error('Email already registered. Please login or use a different email.');
      }

      // Create new user
      const newUser: MockUser = {
        id: `usr_${Date.now()}`,
        name: data.name,
        email: data.email,
        phone: data.phone,
        role: data.role,
        password: data.password,
        isActive: true,
        emailVerified: false,
        phoneVerified: false,
        createdAt: new Date().toISOString(),
        preferences: {
          notifications: { email: true, sms: true, push: true },
          language: 'en',
          theme: 'system',
          timezone: 'Asia/Dhaka'
        }
      };

      // Add to mock database
      mockUsers.push(newUser);

      const token = generateToken(newUser.id, newUser.role);
      const refreshToken = generateRefreshToken(newUser.id);
      
      const { password, ...userWithoutPassword } = newUser;
      const userData = { ...userWithoutPassword, token };
      
      localStorage.setItem('medicare_user', JSON.stringify(userData));
      localStorage.setItem('medicare_refresh_token', refreshToken);

      return {
        user: userData,
        token,
        refreshToken,
        expiresIn: 7 * 24 * 60 * 60
      };
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    await simulateDelay(300);
    
    try {
      // TODO: Uncomment for real API
      // await api.post('/auth/logout');
      
      const refreshToken = localStorage.getItem('medicare_refresh_token');
      if (refreshToken) {
        // Invalidate refresh token on server
        // await api.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('medicare_user');
      localStorage.removeItem('medicare_refresh_token');
    }
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: (): User | null => {
    try {
      const stored = localStorage.getItem('medicare_user');
      if (!stored) return null;
      return JSON.parse(stored);
    } catch {
      return null;
    }
  },

  /**
   * Get user profile from server
   */
  getProfile: async (): Promise<User> => {
    await simulateDelay(800);

    try {
      // TODO: Uncomment for real API
      // const response = await api.get<User>('/auth/profile');
      // if (response.success && response.data) {
      //   return response.data;
      // }
      // throw new Error(response.message);

      const stored = localStorage.getItem('medicare_user');
      if (!stored) throw new Error('Not authenticated');
      
      const user = JSON.parse(stored) as User;
      
      // Get latest user data from mock database
      const mockUser = mockUsers.find(u => u.id === user.id);
      if (mockUser) {
        const { password, ...userWithoutPassword } = mockUser;
        return { ...userWithoutPassword, token: user.token };
      }
      
      return user;
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  },

  /**
   * Update user profile
   */
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    await simulateDelay(1000);

    try {
      // TODO: Uncomment for real API
      // const response = await api.put<User>('/auth/profile', updates);
      // if (response.success && response.data) {
      //   const updatedUser = { ...response.data, token: getCurrentUser()?.token };
      //   localStorage.setItem('medicare_user', JSON.stringify(updatedUser));
      //   return updatedUser;
      // }
      // throw new Error(response.message);

      const stored = localStorage.getItem('medicare_user');
      if (!stored) throw new Error('Not authenticated');

      const currentUser = JSON.parse(stored) as User;
      
      // Prevent updating sensitive fields
      const allowedUpdates = ['name', 'phone', 'avatar', 'preferences'];
      const filteredUpdates: Partial<User> = {};
      
      Object.keys(updates).forEach(key => {
        if (allowedUpdates.includes(key)) {
          filteredUpdates[key as keyof User] = updates[key as keyof User];
        }
      });
      
      const updatedUser = { ...currentUser, ...filteredUpdates, updatedAt: new Date().toISOString() };
      
      // Update in mock database
      const mockUserIndex = mockUsers.findIndex(u => u.id === currentUser.id);
      if (mockUserIndex !== -1) {
        mockUsers[mockUserIndex] = { ...mockUsers[mockUserIndex], ...filteredUpdates };
      }
      
      localStorage.setItem('medicare_user', JSON.stringify(updatedUser));
      
      return updatedUser;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  /**
   * Change user password
   */
  changePassword: async (data: ChangePasswordData): Promise<{ message: string }> => {
    await simulateDelay(1200);

    try {
      // TODO: Uncomment for real API
      // const response = await api.post<{ message: string }>('/auth/change-password', data);
      // if (response.success) {
      //   return { message: response.message };
      // }
      // throw new Error(response.message);

      const currentUser = authService.getCurrentUser();
      if (!currentUser) throw new Error('Not authenticated');

      const mockUser = mockUsers.find(u => u.id === currentUser.id);
      if (!mockUser) throw new Error('User not found');

      if (mockUser.password !== data.currentPassword) {
        throw new Error('Current password is incorrect');
      }

      const passwordValidation = validatePassword(data.newPassword);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      if (data.newPassword !== data.confirmNewPassword) {
        throw new Error('New passwords do not match');
      }

      // Update password in mock database
      mockUser.password = data.newPassword;

      return { message: 'Password changed successfully' };
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string): Promise<ForgotPasswordResponse> => {
    await simulateDelay(1000);

    try {
      // TODO: Uncomment for real API
      // const response = await api.post<ForgotPasswordResponse>('/auth/forgot-password', { email });
      // return response.data!;

      const user = mockUsers.find(u => u.email === email);
      if (!user) {
        // Don't reveal if user exists or not for security
        return {
          message: 'If an account exists with this email, you will receive a password reset link.'
        };
      }

      // Generate reset token (in production, this would be stored in database)
      const resetToken = `reset_${Date.now()}_${user.id}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Store reset token (in mock, store in memory)
      (global as any).resetTokens = (global as any).resetTokens || {};
      (global as any).resetTokens[resetToken] = user.id;

      return {
        message: 'Password reset email sent. Please check your inbox.',
        resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
      };
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  },

  /**
   * Reset password using token
   */
  resetPassword: async (data: ResetPasswordData): Promise<{ message: string }> => {
    await simulateDelay(1000);

    try {
      // TODO: Uncomment for real API
      // const response = await api.post<{ message: string }>('/auth/reset-password', data);
      // return response.data!;

      const resetTokens = (global as any).resetTokens || {};
      const userId = resetTokens[data.token];
      
      if (!userId) {
        throw new Error('Invalid or expired reset token');
      }

      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      const passwordValidation = validatePassword(data.newPassword);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      if (data.newPassword !== data.confirmNewPassword) {
        throw new Error('Passwords do not match');
      }

      // Update password
      user.password = data.newPassword;
      
      // Delete used token
      delete resetTokens[data.token];

      return { message: 'Password reset successfully. Please login with your new password.' };
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  },

  /**
   * Verify email address
   */
  verifyEmail: async (token: string): Promise<VerifyEmailResponse> => {
    await simulateDelay(800);

    try {
      // TODO: Uncomment for real API
      // const response = await api.post<VerifyEmailResponse>('/auth/verify-email', { token });
      // return response.data!;

      // Mock verification
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        const mockUser = mockUsers.find(u => u.id === currentUser.id);
        if (mockUser) {
          mockUser.emailVerified = true;
          
          const updatedUser = { ...currentUser, emailVerified: true };
          localStorage.setItem('medicare_user', JSON.stringify(updatedUser));
        }
      }

      return {
        verified: true,
        message: 'Email verified successfully'
      };
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  },

  /**
   * Resend verification email
   */
  resendVerificationEmail: async (email?: string): Promise<{ message: string }> => {
    await simulateDelay(800);

    try {
      // TODO: Uncomment for real API
      // const response = await api.post<{ message: string }>('/auth/resend-verification', { email });
      // return response.data!;

      const targetEmail = email || authService.getCurrentUser()?.email;
      if (!targetEmail) {
        throw new Error('Email is required');
      }

      const user = mockUsers.find(u => u.email === targetEmail);
      if (!user) {
        throw new Error('User not found');
      }

      if (user.emailVerified) {
        throw new Error('Email is already verified');
      }

      return {
        message: 'Verification email sent. Please check your inbox.'
      };
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  },

  /**
   * Refresh authentication token
   */
  refreshToken: async (): Promise<{ token: string; refreshToken?: string }> => {
    await simulateDelay(500);

    try {
      const refreshToken = localStorage.getItem('medicare_refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // TODO: Uncomment for real API
      // const response = await api.post<{ token: string; refreshToken?: string }>('/auth/refresh', { refreshToken });
      // return response.data!;

      const currentUser = authService.getCurrentUser();
      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      const newToken = generateToken(currentUser.id, currentUser.role);
      const newRefreshToken = generateRefreshToken(currentUser.id);
      
      const userData = { ...currentUser, token: newToken };
      localStorage.setItem('medicare_user', JSON.stringify(userData));
      localStorage.setItem('medicare_refresh_token', newRefreshToken);
      
      // Update mock user
      const mockUser = mockUsers.find(u => u.id === currentUser.id);
      if (mockUser) {
        mockUser.refreshToken = newRefreshToken;
      }

      return {
        token: newToken,
        refreshToken: newRefreshToken
      };
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    const user = authService.getCurrentUser();
    const token = user?.token;
    return !!user && !!token;
  },

  /**
   * Check if user has specific role
   */
  hasRole: (roles: User['role'] | User['role'][]): boolean => {
    const user = authService.getCurrentUser();
    if (!user) return false;
    
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(user.role);
  },

  /**
   * Check if email is verified
   */
  isEmailVerified: (): boolean => {
    const user = authService.getCurrentUser();
    return user?.emailVerified || false;
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
    await simulateDelay(600);
    
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error('Not authenticated');
    }
    
    const updatedPreferences = {
      ...currentUser.preferences,
      ...preferences
    } as UserPreferences;
    
    await authService.updateProfile({ preferences: updatedPreferences });
    
    return updatedPreferences;
  }
};

// ============================================
// AUTH HOOKS (can be used in components)
// ============================================

export const useAuth = () => {
  return {
    user: authService.getCurrentUser(),
    isAuthenticated: authService.isAuthenticated(),
    isAdmin: authService.hasRole('admin'),
    isDoctor: authService.hasRole('doctor'),
    isPatient: authService.hasRole('patient'),
    isEmailVerified: authService.isEmailVerified(),
    login: authService.login,
    register: authService.register,
    logout: authService.logout,
    updateProfile: authService.updateProfile,
    changePassword: authService.changePassword,
    refreshToken: authService.refreshToken
  };
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default authService;