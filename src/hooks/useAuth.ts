// src/hooks/useAuth.ts

import { useState, useEffect, useCallback } from 'react';
import { authService, User, LoginCredentials, RegisterData } from '../services/authService';

interface UseAuthReturn {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshToken: () => Promise<void>;
  hasRole: (roles: string | string[]) => boolean;
  isAdmin: boolean;
  isDoctor: boolean;
  isPatient: boolean;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
          // Verify token is still valid
          const isValid = authService.isAuthenticated();
          if (isValid) {
            setUser(currentUser);
          } else {
            await authService.logout();
            setUser(null);
          }
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login handler
  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
    } catch (err: any) {
      const errorMessage = err?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Register handler
  const register = useCallback(async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } catch (err: any) {
      const errorMessage = err?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout handler
  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } catch (err: any) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Update profile handler
  const updateProfile = useCallback(async (updates: Partial<User>): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedUser = await authService.updateProfile(updates);
      setUser(updatedUser);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Change password handler
  const changePassword = useCallback(async (currentPassword: string, newPassword: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      await authService.changePassword({ currentPassword, newPassword, confirmNewPassword: newPassword });
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to change password';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refresh token handler
  const refreshToken = useCallback(async (): Promise<void> => {
    try {
      const { token } = await authService.refreshToken();
      if (user) {
        setUser({ ...user, token });
      }
    } catch (err) {
      console.error('Token refresh failed:', err);
      await logout();
    }
  }, [user, logout]);

  // Role check helpers
  const hasRole = useCallback((roles: string | string[]): boolean => {
    if (!user) return false;
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.includes(user.role);
  }, [user]);

  const isAdmin = user?.role === 'admin';
  const isDoctor = user?.role === 'doctor';
  const isPatient = user?.role === 'patient';

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshToken,
    hasRole,
    isAdmin,
    isDoctor,
    isPatient,
  };
};

export default useAuth;
// src/hooks/useAuth.ts - শেষের দিকে
export type { UseAuthReturn };