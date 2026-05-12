// src/App.tsx

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

// ============================================
// LAYOUT COMPONENTS
// ============================================
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BackToTop } from '@/components/layout/BackToTop';

// ============================================
// LAZY LOADED PAGES (Code Splitting)
// ============================================
const Home = lazy(() => import('@/pages/Home'));
const About = lazy(() => import('@/pages/About'));
const Services = lazy(() => import('@/pages/Services'));
const Login = lazy(() => import('@/pages/Login'));
const Register = lazy(() => import('@/pages/Register'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
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
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// ============================================
// PREMIUM PAGE LOADER COMPONENT
// ============================================
const PageLoader: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
    <div className="relative w-24 h-24">
      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30 animate-ping" />

      {/* Spinning gradient ring */}
      <div
        className="absolute inset-2 rounded-full border-4 border-transparent animate-spin"
        style={{
          borderTopColor: '#06b6d4',
          borderRightColor: '#a855f7',
          borderBottomColor: '#ec4899',
        }}
      />

      {/* Reverse spinning ring */}
      <div
        className="absolute inset-5 rounded-full border-2 border-white/20 animate-spin"
        style={{ animationDirection: 'reverse', animationDuration: '3s' }}
      />

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
          <span className="text-2xl animate-pulse">⚡</span>
        </div>
      </div>
    </div>

    <div className="absolute bottom-20 left-0 right-0 text-center">
      <p className="text-white/40 text-xs tracking-[0.3em] uppercase animate-pulse">
        Initializing Aetherion
      </p>
    </div>
  </div>
);

// ============================================
// LAYOUT WRAPPER COMPONENT
// ============================================
const LayoutWrapper: React.FC = () => {
  const location = useLocation();

  // Hide Navbar/Footer on auth pages
  const hideNavbarFooter =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavbarFooter && <Navbar />}
      <main className={`flex-1 ${!hideNavbarFooter ? 'pt-16 md:pt-20' : ''}`}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorProfile />} />
            <Route path="/hospitals" element={<Hospitals />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/pharmacy" element={<Pharmacy />} />
            <Route path="/records" element={<MedicalRecords />} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/women-health" element={<WomenHealth />} />
            <Route path="/blood-donors" element={<BloodDonors />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!hideNavbarFooter && <Footer />}
      {!hideNavbarFooter && <BackToTop />}
    </div>
  );
};

// ============================================
// TOAST CONFIGURATION
// ============================================
const toastOptions = {
  duration: 4000,
  style: {
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(12px)',
    color: '#fff',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    borderRadius: '12px',
    fontSize: '14px',
  },
  success: {
    iconTheme: {
      primary: '#22c55e',
      secondary: '#fff',
    },
  },
  error: {
    iconTheme: {
      primary: '#ef4444',
      secondary: '#fff',
    },
  },
};

// ============================================
// MAIN APP COMPONENT
// ============================================
const App: React.FC = () => {
  return (
    // ✅ FIX: BrowserRouter-এ future flags যোগ করা হয়েছে
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Toaster position="top-right" toastOptions={toastOptions} />
      <AnimatePresence mode="wait">
        <LayoutWrapper />
      </AnimatePresence>
    </BrowserRouter>
  );
};

export default App;