// src/context/AuthContext.tsx

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, User as AuthUser } from '../services/authService';

// Role-to-dashboard route mapping
export const ROLE_DASHBOARD_MAP: Record<string, string> = {
  patient: '/patient/dashboard',
  client: '/patient/dashboard',
  doctor: '/doctor/dashboard',
  hospital: '/hospital/dashboard',
  pharmacy: '/pharmacy/dashboard',
  admin: '/admin/dashboard',
  super_admin: '/admin/dashboard',
};

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: Parameters<typeof authService.login>[0]) => Promise<void>;
  register: (data: Parameters<typeof authService.register>[0]) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: string | string[]) => boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  hasRole: () => false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser && authService.isAuthenticated()) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (credentials: Parameters<typeof authService.login>[0]) => {
    const response = await authService.login(credentials);
    setUser(response.user);
  }, []);

  const register = useCallback(async (data: Parameters<typeof authService.register>[0]) => {
    const response = await authService.register(data);
    setUser(response.user);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (roles: string | string[]): boolean => {
      if (!user) return false;
      const roleList = Array.isArray(roles) ? roles : [roles];
      return roleList.includes(user.role);
    },
    [user],
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => useContext(AuthContext);
