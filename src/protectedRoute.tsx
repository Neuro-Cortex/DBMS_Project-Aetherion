// src/components/ProtectedRoute.tsx
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from 'src/store';  // ✅ পাথ ঠিক করা হয়েছে

// Optional: Add role-based protection
interface ProtectedRouteProps {
  allowedRoles?: string[];  // নতুন: রোল বেসড অ্যাক্সেস
  redirectTo?: string;       // নতুন: কাস্টম রিডাইরেক্ট
}

const ProtectedRoute = ({ allowedRoles, redirectTo = '/login' }: ProtectedRouteProps = {}) => {
  const { isAuthenticated, isLoading, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location.pathname }} replace />;
  }

  // Optional: Check if user has required role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.primaryRole || user?.role;
    if (!userRole || !allowedRoles.includes(userRole)) {
      // User doesn't have required role, redirect to home page
      return <Navigate to="/" replace />;
    }
  }

  // If authenticated, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;