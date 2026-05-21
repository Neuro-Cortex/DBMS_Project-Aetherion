// ============================================
// src/components/auth/PublicRoute.tsx
// Aetherion Health - Public Route Component
// ============================================

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface PublicRouteProps {
  isAuthenticated?: boolean;
  children?: React.ReactNode;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ 
  isAuthenticated = false, // Replace with actual auth check
  children 
}) => {
  // TODO: Replace with actual authentication check
  // const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // Redirect to dashboard if already logged in
    return <Navigate to="/dashboard" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default PublicRoute;