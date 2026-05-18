// src/pages/hospital/HospitalAdminPanel.tsx

import React, { useMemo } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';

import { HospitalSidebar } from '@/components/hospital/HospitalSidebar';
import { HospitalDashboard } from '@/components/hospital/HospitalDashboard';
import { resetAuth } from '@/components/slices/slices/authSlice';
import type { RootState } from '@/store';

import {
  HospitalAnalyticsSection,
  HospitalAmbulanceSection,
  HospitalAnnouncementsSection,
  HospitalBedsSection,
  HospitalBloodDonorsSection,
  HospitalBloodRequestsSection,
  HospitalBloodStockSection,
  HospitalDepartmentsSection,
  HospitalDoctorsSection,
  HospitalEmergencySection,
  HospitalICUSection,
  HospitalMessagesSection,
  HospitalOxygenSection,
  HospitalReportsSection,
  HospitalSettingsSection,
} from './HospitalAdminSections';
import { HOSPITAL_ID, HOSPITAL_NAME } from './hospitalAdminMockData';

const HospitalAdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const hospitalName = user?.name ?? HOSPITAL_NAME;
  const alertCount = 3;

  const activePage = useMemo(() => {
    const segment = location.pathname.split('/').filter(Boolean);
    const last = segment[segment.length - 1];
    return last === 'hospital' ? 'dashboard' : last;
  }, [location.pathname]);

  const handleNavigate = (page: string) => {
    navigate(`/hospital/${page}`);
  };

  const handleLogout = () => {
    dispatch(resetAuth());
    toast.success('Logged out');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <HospitalSidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        hospitalName={hospitalName}
        onLogout={handleLogout}
        alertCount={alertCount}
      />

      <main className="flex-1 min-w-0 overflow-auto">
        <Routes>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route
            path="dashboard"
            element={<HospitalDashboard hospitalId={HOSPITAL_ID} onNavigate={handleNavigate} />}
          />
          <Route path="analytics" element={<HospitalAnalyticsSection />} />
          <Route path="doctors" element={<HospitalDoctorsSection />} />
          <Route path="departments" element={<HospitalDepartmentsSection />} />
          <Route path="beds" element={<HospitalBedsSection />} />
          <Route path="icu-tracker" element={<HospitalICUSection />} />
          <Route path="blood-stock" element={<HospitalBloodStockSection />} />
          <Route path="blood-donors" element={<HospitalBloodDonorsSection />} />
          <Route path="blood-requests" element={<HospitalBloodRequestsSection />} />
          <Route path="oxygen" element={<HospitalOxygenSection />} />
          <Route path="ambulance" element={<HospitalAmbulanceSection />} />
          <Route path="emergency" element={<HospitalEmergencySection />} />
          <Route path="announcements" element={<HospitalAnnouncementsSection />} />
          <Route path="messages" element={<HospitalMessagesSection />} />
          <Route path="reports" element={<HospitalReportsSection />} />
          <Route path="settings" element={<HospitalSettingsSection />} />
          <Route path="*" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default HospitalAdminPanel;
