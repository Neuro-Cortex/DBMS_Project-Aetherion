// ============================================
// src/App.tsx
// Aetherion Health - Main Application Component
// ============================================

import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Layouts
import MainLayout from '@layouts/MainLayout';
import AuthLayout from '@layouts/AuthLayout';
import DashboardLayout from '@layouts/DashboardLayout';

// Loading Component
import PageLoader from '@components/common/PageLoader';

// Lazy Loaded Pages
const Home = lazy(() => import('@pages/Home'));
const About = lazy(() => import('@pages/About'));
const Contact = lazy(() => import('@pages/Contact'));
const Login = lazy(() => import('@pages/auth/Login'));
const Register = lazy(() => import('@pages/auth/Register'));
const ForgotPassword = lazy(() => import('@pages/auth/ForgotPassword'));
const Dashboard = lazy(() => import('@pages/dashboard/Dashboard'));
const Appointments = lazy(() => import('@pages/dashboard/Appointments'));
const Doctors = lazy(() => import('@pages/dashboard/Doctors'));
const Pharmacy = lazy(() => import('@pages/dashboard/Pharmacy'));
const Emergency = lazy(() => import('@pages/Emergency'));
const Telemedicine = lazy(() => import('@pages/Telemedicine'));
const PatientRecords = lazy(() => import('@pages/dashboard/PatientRecords'));
const Billing = lazy(() => import('@pages/dashboard/Billing'));
const Settings = lazy(() => import('@pages/dashboard/Settings'));
const NotFound = lazy(() => import('@pages/NotFound'));

// Route Protection
import ProtectedRoute from '@components/auth/ProtectedRoute';
import PublicRoute from '@components/auth/PublicRoute';

// Scroll to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Page transition variants
const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
    },
  },
};

// Animated Page Wrapper
const AnimatedPage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
  >
    {children}
  </motion.div>
);

// ============================================
// MAIN APP COMPONENT
// ============================================

const App: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <ScrollToTop />
      
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route element={<PublicRoute />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={
                  <AnimatedPage><Home /></AnimatedPage>
                } />
                <Route path="/about" element={
                  <AnimatedPage><About /></AnimatedPage>
                } />
                <Route path="/contact" element={
                  <AnimatedPage><Contact /></AnimatedPage>
                } />
                <Route path="/emergency" element={
                  <AnimatedPage><Emergency /></AnimatedPage>
                } />
              </Route>
            </Route>

            {/* Auth Routes */}
            <Route element={<PublicRoute />}>
              <Route element={<AuthLayout />}>
                <Route path="/login" element={
                  <AnimatedPage><Login /></AnimatedPage>
                } />
                <Route path="/register" element={
                  <AnimatedPage><Register /></AnimatedPage>
                } />
                <Route path="/forgot-password" element={
                  <AnimatedPage><ForgotPassword /></AnimatedPage>
                } />
              </Route>
            </Route>

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={
                  <AnimatedPage><Dashboard /></AnimatedPage>
                } />
                <Route path="/appointments" element={
                  <AnimatedPage><Appointments /></AnimatedPage>
                } />
                <Route path="/doctors" element={
                  <AnimatedPage><Doctors /></AnimatedPage>
                } />
                <Route path="/pharmacy" element={
                  <AnimatedPage><Pharmacy /></AnimatedPage>
                } />
                <Route path="/telemedicine" element={
                  <AnimatedPage><Telemedicine /></AnimatedPage>
                } />
                <Route path="/patient-records" element={
                  <AnimatedPage><PatientRecords /></AnimatedPage>
                } />
                <Route path="/billing" element={
                  <AnimatedPage><Billing /></AnimatedPage>
                } />
                <Route path="/settings" element={
                  <AnimatedPage><Settings /></AnimatedPage>
                } />
              </Route>
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={
              <AnimatedPage><NotFound /></AnimatedPage>
            } />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </>
  );
};

export default App;