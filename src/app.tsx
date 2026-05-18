// ============================================
// src/App.tsx - COMPLETE ERROR-FREE VERSION
// ALL CODE PRESERVED | ALL ERRORS FIXED
// Project Aetherion - Healthcare Management System
// ============================================

import React, { Suspense, lazy, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { Bot } from 'lucide-react';

import type { RootState } from './store';

// ============================================
// LAYOUT COMPONENTS
// ============================================
import DashboardLayout from './components/layout/DashboardLayout';
import LoadingScreen from './components/common/LoadingScreen';
import { AIAssistant } from './components/ai-assistent/AIAssistant';

// ============================================
// COMMON COMPONENTS (Direct Import)
// ============================================
import GoogleMap from './components/common/GoogleMap';
import NotificationBell from './components/common/NotificationBell';
import NotificationCenter from './components/common/NotificationCenter';
import QRMedicalCard from './components/common/QRMedicalCard';
import SearchBar from './components/common/SearchBar';
import SmartSearch from './components/common/SmartSearch';
import TestimonialsSection from './components/common/TestimonialsSection';
import UserAvatar from './components/common/Avatar';
import BreadCrumb from './components/common/BreadCrumb';

// ============================================
// LAZY LOADED PAGES - PUBLIC
// ============================================
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Login = lazy(() => import('./pages/auth/Login'));
const Register = lazy(() => import('./pages/auth/Register'));
const RoleSelection = lazy(() => import('./pages/auth/RoleSelection'));
const Emergency = lazy(() => import('./pages/Emergency'));
const NotFound = lazy(() => import('./pages/NotFound'));

// ============================================
// LAZY LOADED PAGES - CLIENT
// ============================================
const ClientDashboard = lazy(() => import('./pages/Client/ClientDashboard'));
const ClientProfile = lazy(() => import('./pages/Client/Clientprofile'));
const ClientAppointments = lazy(() => import('./pages/Client/Appointments'));
const ClientPrescriptions = lazy(() => import('./pages/Client/Prescriptions'));
const ClientBloodDonation = lazy(() => import('./pages/Client/bloodDonation'));
const ClientEmergencyRequest = lazy(() => import('./pages/Client/EmergencyRequest'));
const ClientRecommendations = lazy(() => import('./pages/Client/Recommendations'));
const ClientVaccineTracking = lazy(() => import('./pages/Client/VeccineTracking'));
const ClientMedicalReports = lazy(() => import('./pages/Client/MedicalReports'));
const ClientPhysiotherapy = lazy(() => import('./pages/Client/Physiothrerapy'));
const ClientDoctorComparison = lazy(() => import('./pages/Client/DoctorComparison'));
const ClientNearbyDonors = lazy(() => import('./pages/Client/ClientNearbyDonors'));
const ClientOrders = lazy(() => import('./pages/Client/ClientOrders'));
const ClientHealthRecords = lazy(() => import('./pages/Client/HealthRecords'));
const Discover = lazy(() => import('./pages/Client/Discover'));

// ============================================
// LAZY LOADED PAGES - DOCTOR
// ============================================
const DoctorDashboard = lazy(() => import('./components/doctors/DoctorDashboard'));
const DoctorProfile = lazy(() => import('./components/doctors/DoctorProfile'));
const Doctors = lazy(() => import('./components/doctors/Doctors'));
const DoctorRanking = lazy(() => import('./components/doctors/DoctorRanking'));
const DoctorSchedule = lazy(() => import('./components/doctors/DoctorSchdule'));

// ============================================
// LAZY LOADED PAGES - HOSPITAL
// ============================================
const HospitalDashboard = lazy(() => import('./components/hospital/HospitalDashboard'));
const BedAvailability = lazy(() => import('./components/hospital/BedAvailability'));
const ICUTracker = lazy(() => import('./components/hospital/ICUTracker'));
const EmergencyServices = lazy(() => import('./components/hospital/EmergencyServices'));

// ============================================
// LAZY LOADED PAGES - PHARMACY
// ============================================
const PharmacyDashboard = lazy(() => import('./components/pharmacy/PharmacyDashboard'));
const Pharmacy = lazy(() => import('./components/pharmacy/Pharmacy'));
const MedicineSearch = lazy(() => import('./components/pharmacy/MedicineSearch'));
const PharmacyAccount = lazy(() => import('./components/pharmacy/PharmacyAccount'));

// ============================================
// LAZY LOADED PAGES - ADMIN
// ============================================
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const AdminLogin = lazy(() => import('./components/admin/AdminLogin'));
const AdminSidebar = lazy(() => import('./components/admin/AdminSidebar'));
const UserManager = lazy(() => import('./components/admin/UserManager'));
const DoctorVerification = lazy(() => import('./components/admin/DoctorVerification'));
const EmergencyMonitor = lazy(() => import('./components/admin/EmergencyMonitor'));
const SecurityManager = lazy(() => import('./components/admin/SecurityManager'));

// ============================================
// LAZY LOADED PAGES - WOMEN CARE
// ============================================
const WomenHealth = lazy(() => import('./components/women/WomenHealth'));
const WomenCareDashboard = lazy(() => import('./components/women/WomenCareDashboard'));
const PregnancyTracker = lazy(() => import('./components/women/pregnancyTracker'));
const MedicineRecord = lazy(() => import('./components/women/MedicineRecord'));
const MenstrualCycleTracker = lazy(() => import('./components/women/MenstrualCycleTracker'));
const MotherHealthMonitor = lazy(() => import('./components/women/MotherHealthMonitor'));
const VaccineSchedule = lazy(() => import('./components/women/VaccineSchedule'));
const SpecialCare = lazy(() => import('./components/women/SpecialCare'));
const GynecologistCard = lazy(() => import('./components/women/GynecologistCard'));

// ============================================
// LAZY LOADED PAGES - PATIENTS
// ============================================
const PatientProfile = lazy(() => import('./components/patients/PatientProfile'));
const MedicalHistory = lazy(() => import('./components/patients/MedicalHistory'));
const MedicineTracker = lazy(() => import('./components/patients/MedicineTracker'));
const VaccinationTracker = lazy(() => import('./components/patients/VaccinationTracker'));

// ============================================
// LAZY LOADED PAGES - OTHER
// ============================================
const BloodDonors = lazy(() => import('./pages/Client/BloodDonors'));
const MedicalRecords = lazy(() => import('./pages/Client/MedicalReports'));
const AIAssistantPage = lazy(() => import('./pages/AIAssistant'));
const Profile = lazy(() => import('./pages/Client/Clientprofile'));
const Settings = lazy(() => import('./pages/Settings'));
const OxygenDashboard = lazy(() => import('./components/oxygen/OxygenDashboard'));

// ============================================
// PAGE LOADER
// ============================================
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <LoadingScreen type="medical" message="Loading..." />
  </div>
);

// ============================================
// PROTECTED ROUTE
// ============================================
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const role = user?.primaryRole || user?.role;

  if (allowedRoles?.length && role && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// ============================================
// DASHBOARD ROUTER
// ============================================
const DashboardRouter: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const role = user?.primaryRole || user?.role;

  switch (role) {
    case 'doctor':
      return <DoctorDashboard />;
    case 'hospital':
    case 'hospital_admin':
    case 'hospital_authority':
      return <Navigate to="/hospital/dashboard" replace />;
    case 'pharmacy':
    case 'pharmacy_admin':
      return <PharmacyDashboard />;
    case 'admin':
      return <AdminDashboard />;
    default:
      return <ClientDashboard />;
  }
};

// ============================================
// MAIN ROUTES
// ============================================
const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ============================================ */}
          {/* PUBLIC ROUTES */}
          {/* ============================================ */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/role-selection" element={<RoleSelection />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/register" element={<Register />} />
          <Route path="/discover" element={<Discover />} />

          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
          />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* ============================================ */}
          {/* PROTECTED DASHBOARD LAYOUT */}
          {/* ============================================ */}
          <Route element={<DashboardLayout />}>
            
            {/* Main Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              }
            />

            {/* ============================================ */}
            {/* CLIENT ROUTES */}
            {/* ============================================ */}
            <Route path="/client/dashboard" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
            <Route path="/client/profile" element={<ProtectedRoute><ClientProfile /></ProtectedRoute>} />
            <Route path="/client/appointments" element={<ProtectedRoute><ClientAppointments /></ProtectedRoute>} />
            <Route path="/client/prescriptions" element={<ProtectedRoute><ClientPrescriptions /></ProtectedRoute>} />
            <Route path="/client/blood-donation" element={<ProtectedRoute><ClientBloodDonation /></ProtectedRoute>} />
            <Route path="/client/emergency" element={<ProtectedRoute><ClientEmergencyRequest /></ProtectedRoute>} />
            <Route path="/client/recommendations" element={<ProtectedRoute><ClientRecommendations /></ProtectedRoute>} />
            <Route path="/client/vaccines" element={<ProtectedRoute><ClientVaccineTracking /></ProtectedRoute>} />
            <Route path="/client/reports" element={<ProtectedRoute><ClientMedicalReports /></ProtectedRoute>} />
            <Route path="/client/physiotherapy" element={<ProtectedRoute><ClientPhysiotherapy /></ProtectedRoute>} />
            <Route path="/client/doctor-comparison" element={<ProtectedRoute><ClientDoctorComparison /></ProtectedRoute>} />
            <Route path="/client/nearby-donors" element={<ProtectedRoute><ClientNearbyDonors /></ProtectedRoute>} />
            <Route path="/client/orders" element={<ProtectedRoute><ClientOrders /></ProtectedRoute>} />
            <Route path="/client/health-records" element={<ProtectedRoute><ClientHealthRecords /></ProtectedRoute>} />

            {/* ============================================ */}
            {/* DOCTOR ROUTES */}
            {/* ============================================ */}
            <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
            <Route path="/doctor/profile" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorProfile /></ProtectedRoute>} />
            <Route path="/doctor/schedule" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorSchedule /></ProtectedRoute>} />
            <Route path="/doctor/ranking" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorRanking /></ProtectedRoute>} />
            <Route path="/doctor/patients" element={<ProtectedRoute allowedRoles={['doctor']}><PatientProfile /></ProtectedRoute>} />

            {/* ============================================ */}
            {/* HOSPITAL ROUTES */}
            {/* ============================================ */}
            <Route path="/hospital/dashboard" element={<ProtectedRoute allowedRoles={['hospital', 'hospital_admin', 'hospital_authority']}><HospitalDashboard /></ProtectedRoute>} />
            <Route path="/hospital/beds" element={<ProtectedRoute allowedRoles={['hospital', 'hospital_admin', 'hospital_authority']}><BedAvailability /></ProtectedRoute>} />
            <Route path="/hospital/icu" element={<ProtectedRoute allowedRoles={['hospital', 'hospital_admin', 'hospital_authority']}><ICUTracker /></ProtectedRoute>} />
            <Route path="/hospital/emergency" element={<ProtectedRoute allowedRoles={['hospital', 'hospital_admin', 'hospital_authority']}><EmergencyServices /></ProtectedRoute>} />

            {/* ============================================ */}
            {/* PHARMACY ROUTES */}
            {/* ============================================ */}
            <Route path="/pharmacy/dashboard" element={<ProtectedRoute allowedRoles={['pharmacy', 'pharmacy_admin']}><PharmacyDashboard /></ProtectedRoute>} />
            <Route path="/pharmacy/account" element={<ProtectedRoute allowedRoles={['pharmacy', 'pharmacy_admin']}><PharmacyAccount /></ProtectedRoute>} />
            <Route path="/pharmacy" element={<ProtectedRoute><Pharmacy /></ProtectedRoute>} />
            <Route path="/pharmacy/search" element={<ProtectedRoute><MedicineSearch /></ProtectedRoute>} />

            {/* ============================================ */}
            {/* ADMIN ROUTES */}
            {/* ============================================ */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UserManager /></ProtectedRoute>} />
            <Route path="/admin/verification" element={<ProtectedRoute allowedRoles={['admin']}><DoctorVerification /></ProtectedRoute>} />
            <Route path="/admin/emergency" element={<ProtectedRoute allowedRoles={['admin']}><EmergencyMonitor /></ProtectedRoute>} />
            <Route path="/admin/security" element={<ProtectedRoute allowedRoles={['admin']}><SecurityManager /></ProtectedRoute>} />

            {/* ============================================ */}
            {/* WOMEN CARE ROUTES */}
            {/* ============================================ */}
            <Route path="/women-care" element={<ProtectedRoute><WomenCareDashboard /></ProtectedRoute>} />
            <Route path="/women-health" element={<ProtectedRoute><WomenHealth /></ProtectedRoute>} />
            <Route path="/women/pregnancy" element={<ProtectedRoute><PregnancyTracker /></ProtectedRoute>} />
            <Route path="/women/medicine" element={<ProtectedRoute><MedicineRecord /></ProtectedRoute>} />
            <Route path="/women/cycle" element={<ProtectedRoute><MenstrualCycleTracker /></ProtectedRoute>} />
            <Route path="/women/health-monitor" element={<ProtectedRoute><MotherHealthMonitor /></ProtectedRoute>} />
            <Route path="/women/vaccines" element={<ProtectedRoute><VaccineSchedule /></ProtectedRoute>} />
            <Route path="/women/special-care" element={<ProtectedRoute><SpecialCare /></ProtectedRoute>} />
            <Route path="/women/gynecologist" element={<ProtectedRoute><GynecologistCard /></ProtectedRoute>} />

            {/* ============================================ */}
            {/* GENERAL ROUTES */}
            {/* ============================================ */}
            <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
            <Route path="/doctors/:id" element={<ProtectedRoute><DoctorProfile /></ProtectedRoute>} />
            <Route path="/medical-records" element={<ProtectedRoute><MedicalRecords /></ProtectedRoute>} />
            <Route path="/medical-history" element={<ProtectedRoute><MedicalHistory /></ProtectedRoute>} />
            <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistantPage /></ProtectedRoute>} />
            <Route path="/blood-donors" element={<ProtectedRoute><BloodDonors /></ProtectedRoute>} />
            <Route path="/oxygen-network" element={<ProtectedRoute><OxygenDashboard /></ProtectedRoute>} />
            <Route path="/medicine-tracker" element={<ProtectedRoute><MedicineTracker /></ProtectedRoute>} />
            <Route path="/vaccination-tracker" element={<ProtectedRoute><VaccinationTracker /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          </Route>

          {/* ============================================ */}
          {/* 404 - NOT FOUND */}
          {/* ============================================ */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
const App: React.FC = () => {
  const [showAI, setShowAI] = useState(false);
  const { darkMode } = useSelector((state: RootState) => state.ui);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  return (
    <div className={darkMode ? 'dark' : ''}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: darkMode ? '#1f2937' : '#fff',
              color: darkMode ? '#fff' : '#000',
            }
          }}
        />
        
        <AppRoutes />

        {/* AI Assistant - Global Floating Button */}
        {isAuthenticated && (
          <>
            {!showAI ? (
              <button
                onClick={() => setShowAI(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 animate-pulse"
                title="AI Health Assistant"
              >
                <Bot className="w-6 h-6" />
              </button>
            ) : (
              <AIAssistant
                userId={user?.id || 'guest'}
                token={localStorage.getItem('token') || ''}
                userRole={user?.primaryRole || user?.role || 'client'}
                onClose={() => setShowAI(false)}
              />
            )}
          </>
        )}
    </div>
  );
};

export default App;
