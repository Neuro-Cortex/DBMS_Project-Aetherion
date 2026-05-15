// ============================================
// src/App.tsx (PRO VERSION)
// ============================================

import React, { Suspense, lazy } from 'react';
import {
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import type { RootState } from './store';

// ============================================
// LAYOUT
// ============================================

import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/layout/BackToTop';
import DashboardLayout from '@/components/layout/DashboardLayout';

// ============================================
// COMMON
// ============================================
// App.tsx
import React from 'react';
import { OxygenDashboard } from './components/oxygen/OxygenDashboard';

function App() {
  return (
    <OxygenDashboard 
      onNavigate={(page) => console.log('Navigate to:', page)}
      googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY || ''}
    />
  );
}
import LoadingScreen from '@/components/common/LoadingScreen';

// ============================================
// LAZY PAGES
// ============================================

const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));

// src/App.tsx or src/routes/index.tsx
import ClientDashboard from './pages/Client/ClientDashboard';

// Add this route
<Route path="/client/dashboard" element={<ClientDashboard />} />
<Route path="/client/*" element={<ClientDashboard />} />





// src/App.tsx or src/routes/index.tsx
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProfile from './pages/client/ClientProfile';
import ClientAppointments from './pages/client/Appointments';
import ClientPrescriptions from './pages/client/Prescriptions';
import ClientVaccineTracking from './pages/client/VaccineTracking';
import ClientMedicalReports from './pages/client/MedicalReports';
import ClientRecommendations from './pages/client/Recommendations';

// Update routes:
<Route path="/client/dashboard" element={<ClientDashboard />} />
<Route path="/client/profile" element={<ClientProfile />} />
<Route path="/client/appointments" element={<ClientAppointments />} />
<Route path="/client/health-records" element={<ClientMedicalReports />} />
<Route path="/client/blood-donation" element={<ClientDashboard />} />
<Route path="/client/prescriptions" element={<ClientPrescriptions />} />
<Route path="/client/emergency" element={<ClientDashboard />} />
<Route path="/client/recommendations" element={<ClientRecommendations />} />
<Route path="/client/vaccines" element={<ClientVaccineTracking />} />
<Route path="/client/reports" element={<ClientMedicalReports />} />
<Route path="/client/doctor-comparison" element={<ClientDashboard />} />
// src/App.tsx (Route Configuration)
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import { Toaster } from 'react-hot-toast';

// Auth Pages
import RoleSelection from './pages/auth/RoleSelection';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Client Pages
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProfile from './pages/client/ClientProfile';
import ClientAppointments from './pages/client/Appointments';
import ClientPrescriptions from './pages/client/Prescriptions';
import ClientBloodDonation from './pages/client/BloodDonation';
import ClientEmergencyRequest from './pages/client/EmergencyRequest';
import ClientRecommendations from './pages/client/Recommendations';
import ClientVaccineTracking from './pages/client/VaccineTracking';
import ClientMedicalReports from './pages/client/MedicalReports';
import ClientPhysiotherapy from './pages/client/Physiotherapy';
import ClientDoctorComparison from './pages/client/DoctorComparison';
import ClientNearbyDonors from './pages/client/NearbyDonors';

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RoleSelection />} />
          <Route path="/register" element={<RoleSelection />} />
          <Route path="/register/client" element={<Register />} />
          <Route path="/register/doctor" element={<Register />} />
          <Route path="/register/admin" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Client Routes */}
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/profile" element={<ClientProfile />} />
          <Route path="/client/appointments" element={<ClientAppointments />} />
          <Route path="/client/prescriptions" element={<ClientPrescriptions />} />
          <Route path="/client/blood-donation" element={<ClientBloodDonation />} />
          <Route path="/client/emergency" element={<ClientEmergencyRequest />} />
          <Route path="/client/recommendations" element={<ClientRecommendations />} />
          <Route path="/client/vaccines" element={<ClientVaccineTracking />} />
          <Route path="/client/reports" element={<ClientMedicalReports />} />
          <Route path="/client/physiotherapy" element={<ClientPhysiotherapy />} />
          <Route path="/client/doctor-comparison" element={<ClientDoctorComparison />} />
          <Route path="/client/nearby-donors" element={<ClientNearbyDonors />} />

          {/* Doctor Routes */}
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={<AdminDashboard />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </Provider>
  );
};
// Add to App.tsx routes
import DoctorDashboard from './pages/doctor/DoctorDashboard';
import DoctorProfile from './pages/doctor/DoctorProfile';

// Inside Routes:
<Route path="/doctor/dashboard" element={<DoctorDashboard />} />
<Route path="/doctor/profile" element={<DoctorProfile />} />
<Route path="/doctor/appointments" element={<DoctorDashboard />} />
<Route path="/doctor/patients" element={<DoctorDashboard />} />
<Route path="/doctor/prescriptions" element={<DoctorDashboard />} />
<Route path="/doctor/video-consultation" element={<DoctorDashboard />} />
<Route path="/doctor/emergency" element={<DoctorDashboard />} />
<Route path="/doctor/earnings" element={<DoctorDashboard />} />
<Route path="/doctor/reports" element={<DoctorDashboard />} />
<Route path="/doctor/settings" element={<DoctorDashboard />} />


export default App;
// src/App.tsx or src/routes/index.tsx
import ClientDashboard from './pages/client/ClientDashboard';
import ClientProfile from './pages/client/Profile';
import ClientRecommendations from './pages/client/Recommendations';

// Add these routes
<Route path="/client/dashboard" element={<ClientDashboard />} />
<Route path="/client/profile" element={<ClientProfile />} />
<Route path="/client/appointments" element={<ClientDashboard />} />
<Route path="/client/health-records" element={<ClientDashboard />} />
<Route path="/client/blood-donation" element={<ClientDashboard />} />
<Route path="/client/prescriptions" element={<ClientDashboard />} />
<Route path="/client/emergency" element={<ClientDashboard />} />
<Route path="/client/recommendations" element={<ClientRecommendations />} />
<Route path="/client/doctor-comparison" element={<ClientDashboard />} />

import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
<Route path="/register" element={<Register />} />
<Route path="/dashboard" element={<Dashboard />} />

const PatientDashboard = lazy(() => import('@/pages/dashboard/PatientDashboard'));
const DoctorDashboard = lazy(() => import('@/pages/dashboard/DoctorDashboard'));
const HospitalAdminPanel = lazy(() => import('@/pages/hospital/HospitalAdminPanel'));
const PharmacyDashboard = lazy(() => import('@/pages/dashboard/PharmacyDashboard'));
const AdminDashboard = lazy(() => import('@/pages/dashboard/AdminDashboard'));

const Doctors = lazy(() => import('@/pages/Doctors'));
const DoctorProfile = lazy(() => import('@/pages/DoctorProfile'));
const Hospitals = lazy(() => import('@/pages/Hospitals'));
const Appointments = lazy(() => import('@/pages/Appointments'));
const Emergency = lazy(() => import('@/pages/Emergency'));
const Pharmacy = lazy(() => import('@/pages/Pharmacy'));
const MedicalRecords = lazy(() => import('@/pages/MedicalRecords'));
const AIAssistant = lazy(() => import('@/pages/AIAssistant'));
const WomenHealth = lazy(() => import('@/pages/WomenHealth'));
const BloodDonors = lazy(() => import('@/pages/BloodDonors'));
const OxygenNetwork = lazy(() => import('@/pages/OxygenNetwork'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));
const Profile = lazy(() => import('@/pages/Profile'));
const Settings = lazy(() => import('@/pages/Settings'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// ============================================
// LOADER
// ============================================

const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-[#050508] flex items-center justify-center">
    <LoadingScreen />
  </div>
);

// ============================================
// PROTECTED ROUTE (FIXED)
// ============================================

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role =
    (user as { primaryRole?: string; role?: string } | null)?.primaryRole ??
    (user as { role?: string } | null)?.role;

  if (allowedRoles?.length && role && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// ============================================
// DASHBOARD ROUTER (PRO FIX)
// ============================================

const DashboardRouter: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const role =
    (user as { primaryRole?: string; role?: string } | null)?.primaryRole ??
    (user as { role?: string } | null)?.role;

  if (role === 'doctor') return <DoctorDashboard />;
  if (role === 'hospital' || role === 'hospital_admin' || role === 'hospital_authority') {
    return <Navigate to="/hospital/dashboard" replace />;
  }
  if (role === 'pharmacy_admin') return <PharmacyDashboard />;
  if (role === 'admin') return <AdminDashboard />;

  return <PatientDashboard />;
};

// ============================================
// ROUTES
// ============================================

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  return (
    <AnimatePresence mode="wait">
      <Routes>

        {/* PUBLIC */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<Services />} />

        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
        />

        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
        />

        {/* HOSPITAL ADMIN (standalone layout) */}
        <Route
          path="/hospital/*"
          element={
            <ProtectedRoute allowedRoles={['hospital', 'hospital_admin', 'hospital_authority']}>
              <HospitalAdminPanel />
            </ProtectedRoute>
          }
        />

        {/* DASHBOARD WRAPPER */}
        <Route element={<DashboardLayout />}>
          
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />

          <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
          <Route path="/doctors/:id" element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
          <Route path="/hospitals" element={<ProtectedRoute><Hospitals /></ProtectedRoute>} />
          <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />

          <Route path="/emergency" element={<Emergency />} />

          <Route path="/pharmacy" element={<ProtectedRoute><Pharmacy /></ProtectedRoute>} />
          <Route path="/medical-records" element={<ProtectedRoute><MedicalRecords /></ProtectedRoute>} />
          <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
          <Route path="/women-health" element={<ProtectedRoute><WomenHealth /></ProtectedRoute>} />
          <Route path="/blood-donors" element={<ProtectedRoute><BloodDonors /></ProtectedRoute>} />
          <Route path="/oxygen-network" element={<ProtectedRoute><OxygenNetwork /></ProtectedRoute>} />

          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminPanel /></ProtectedRoute>} />

          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />

        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </AnimatePresence>
  );
};

// ============================================
// LAYOUT
// ============================================

const LayoutWrapper: React.FC = () => {
  const location = useLocation();

  const hideLayout =
    ['/login', '/register'].includes(location.pathname) ||
    location.pathname.startsWith('/hospital');

  return (
    <div className="min-h-screen flex flex-col bg-[#050508] text-white">

      {!hideLayout && <Navbar />}

      <main className={`flex-1 ${!hideLayout ? 'pt-16 md:pt-20' : ''}`}>
        <Suspense fallback={<PageLoader />}>
          <AppRoutes />
        </Suspense>
      </main>

      {!hideLayout && <Footer />}
      {!hideLayout && <BackToTop />}

    </div>
  );
};

// ============================================
// APP
// ============================================

const App: React.FC = () => {
  const { darkMode } = useSelector((state: RootState) => state.ui);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Toaster position="top-right" />
      <LayoutWrapper />
    </div>
  );
};

export default App;