import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Auth Pages
import Login from './pages/auth/Login';

// Dashboard Pages
import PatientDashboard from './pages/patient/PatientDashboard';
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Legal Pages
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

// ============================================
// PROTECTED ROUTE
// ============================================
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactElement; allowedRoles?: string[] }) => {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const role = user?.primaryRole || user?.role;
  
  if (allowedRoles && role && !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// ============================================
// APP ROUTES
// ============================================
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/patient/dashboard" replace /> : <Login />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      
      {/* Protected Dashboard Routes */}
      <Route path="/patient/dashboard" element={
        <ProtectedRoute allowedRoles={['patient', 'client', 'normal_user']}>
          <PatientDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/doctor/dashboard" element={
        <ProtectedRoute allowedRoles={['doctor']}>
          <DoctorDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/hospital/dashboard" element={
        <ProtectedRoute allowedRoles={['hospital', 'hospital_admin', 'hospital_authority']}>
          <HospitalDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/pharmacy/dashboard" element={
        <ProtectedRoute allowedRoles={['pharmacy', 'pharmacy_admin']}>
          <PharmacyDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/admin/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminDashboard />
        </ProtectedRoute>
      } />
      
      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

// ============================================
// MAIN APP
// ============================================
const App: React.FC = () => {
  return <AppRoutes />;
};

export default App;