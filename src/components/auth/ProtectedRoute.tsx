// ============================================
// src/components/auth/ProtectedRoute.tsx
// Aetherion Health - Protected Route Component
// ============================================

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import PageLoader from '@components/common/PageLoader';

interface ProtectedRouteProps {
  isAuthenticated?: boolean;
  children?: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  isAuthenticated = false, // Replace with actual auth check
  children 
}) => {
  const location = useLocation();

  // TODO: Replace with actual authentication check
  // const { isAuthenticated, isLoading } = useAuth();
  
  // if (isLoading) {
  //   return <PageLoader message="Checking authentication" />;
  // }

  if (!isAuthenticated) {
    // Redirect to login page with return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;