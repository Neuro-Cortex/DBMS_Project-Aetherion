// src/app/routes/AppRoutes.tsx
import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { routeConfig, type RouteItem } from './routeConfig';
import type { RootState } from '../../store';

// ============================================
// PAGE LOADER
// ============================================
const PageLoader: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen bg-[#030508]">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500" />
      <p className="text-white/30 text-sm">Loading...</p>
    </div>
  </div>
);

// ============================================
// AUTH GUARD
// ============================================
const AuthGuard: React.FC<{ route: RouteItem; children: React.ReactNode }> = ({ route, children }) => {
  const auth = useSelector((state: RootState) => state.auth);

  if (!auth?.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRole = auth.user?.primaryRole || auth.user?.role || '';

  // Map backend roles to route roles
  const roleMapping: Record<string, string[]> = {
    patient: ['client', 'normal_user'],
    doctor: ['doctor'],
    hospital: ['hospital_admin', 'hospital_authority', 'hospital'],
    pharmacy: ['pharmacy_admin', 'pharmacy'],
    admin: ['admin', 'super_admin'],
  };

  const mappedRole = Object.entries(roleMapping).find(([_, backendRoles]) =>
    backendRoles.includes(userRole as string)
  )?.[0] || userRole;

  if (route.roles && !route.roles.includes(mappedRole as string)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// ============================================
// PUBLIC GUARD
// ============================================
const PublicGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useSelector((state: RootState) => state.auth);

  if (auth?.isAuthenticated && auth.user) {
    const primaryRole = auth.user.primaryRole || auth.user.role || '';
    const roleMapping: Record<string, string> = {
      client: 'patient', normal_user: 'patient',
      doctor: 'doctor',
      hospital_admin: 'hospital', hospital_authority: 'hospital',
      pharmacy_admin: 'pharmacy',
      admin: 'admin', super_admin: 'admin',
    };
    const dashboardRole = roleMapping[primaryRole] || 'patient';
    return <Navigate to={`/${dashboardRole}/dashboard`} replace />;
  }

  return <>{children}</>;
};

// ============================================
// HOSPITAL DETAILS WRAPPER
// ============================================
import HospitalDetails from '../../components/hospital/EmergencyServices';

const HospitalDetailsWrapper: React.FC = () => (
  <HospitalDetails
    icuBeds={{ total: 50, available: 15, occupied: 35, covid: 10, nonCovid: 25, emergency: 5, cardiac: 8, pediatric: 5, neonatal: 2 }}
    resources={[]}
    staff={[]}
  />
);

// ============================================
// MAIN ROUTES
// ============================================
export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {routeConfig.map((route) => {
          const Component = route.component;

          // Special case for hospital/:id with props
          if (route.path === '/hospital/:id') {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={<HospitalDetailsWrapper />}
              />
            );
          }

          // Protected routes
          if (route.isProtected) {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <AuthGuard route={route}>
                    <Component />
                  </AuthGuard>
                }
              />
            );
          }

          // Login/Register - redirect if already logged in
          if (route.path === '/login' || route.path === '/register') {
            return (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <PublicGuard>
                    <Component />
                  </PublicGuard>
                }
              />
            );
          }

          // Public routes
          return (
            <Route
              key={route.path}
              path={route.path}
              element={<Component />}
            />
          );
        })}
      </Routes>
    </Suspense>
  );
};