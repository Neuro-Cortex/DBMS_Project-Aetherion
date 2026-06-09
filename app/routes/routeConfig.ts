// src/app/routes/routeConfig.ts
import { lazy } from 'react';

export interface RouteItem {
  path: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.LazyExoticComponent<React.ComponentType<any>>;
  isProtected: boolean;
  roles?: string[];
  title: string;
}

export const routeConfig: RouteItem[] = [

  // ==================== PUBLIC (No auth required) ====================
  { path: '/', component: lazy(() => import('src/pages/Home')), isProtected: false, title: 'Home' },

  // === STATIC PAGES ===
  { path: '/about', component: lazy(() => import('src/pages/About')), isProtected: false, title: 'About Us' },
  { path: '/services', component: lazy(() => import('src/pages/Services')), isProtected: false, title: 'Services' },
  { path: '/help', component: lazy(() => import('src/pages/helpcenter')), isProtected: false, title: 'Help Center' },
  { path: '/feedback', component: lazy(() => import('src/pages/Feedback')), isProtected: false, title: 'Feedback' },
  { path: '/privacy-policy', component: lazy(() => import('src/pages/PrivacyPolicy')), isProtected: false, title: 'Privacy Policy' },
  { path: '/terms-of-service', component: lazy(() => import('src/pages/TermsOfService')), isProtected: false, title: 'Terms of Service' },
  { path: '/immersive-preview', component: lazy(() => import('src/pages/ImmersivePreview')), isProtected: false, title: 'Immersive Preview' },

  // === BLOOD DONORS ===
  { path: '/blood-donors', component: lazy(() => import('../../pages/bloodDonor')), isProtected: false, title: 'Blood Donors' },

  // === NOTIFICATIONS ===
  { path: '/notifications', component: lazy(() => import('../../components/common/NotificationCenter')), isProtected: false, title: 'Notifications' },

  // === QR MEDICAL CARD ===
  { path: '/qrcode', component: lazy(() => import('src/components/common/QRMedicalCard')), isProtected: false, title: 'QR Medical Card' },

  // === SEARCH ===
  { path: '/search', component: lazy(() => import('src/components/common/SmartSearch')), isProtected: false, title: 'Search' },

  // ==================== AUTH ====================
  { path: '/login', component: lazy(() => import('../../pages/auth/Login')), isProtected: false, title: 'Login' },
  { path: '/register', component: lazy(() => import('../../pages/auth/Register')), isProtected: false, title: 'Register' },
  { path: '/forgot-password', component: lazy(() => import('src/pages/auth/ForgotPassword')), isProtected: false, title: 'Forgot Password' },
  { path: '/role-selection', component: lazy(() => import('src/pages/auth/RoleSelection')), isProtected: false, title: 'Select Role' },

  // ==================== DOCTOR (Listing - Public) ====================
  { path: '/doctor', component: lazy(() => import('src/pages/Doctor')), isProtected: false, title: 'Doctors' },
  { path: '/doctor/:id', component: lazy(() => import('src/components/doctors/DoctorRanking')), isProtected: false, title: 'Doctor Details' },
  { path: '/doctors', component: lazy(() => import('src/pages/Doctor')), isProtected: false, title: 'Find Doctors' },
  { path: '/doctor/ranking', component: lazy(() => import('src/components/doctors/DoctorRanking')), isProtected: false, title: 'Doctor Rankings' },
  { path: '/doctor/card', component: lazy(() => import('src/components/doctors/DoctorCard')), isProtected: false, title: 'Doctor Card' },
  { path: '/doctor/booking', component: lazy(() => import('src/components/doctors/BookingForm')), isProtected: true, roles: ['patient'], title: 'Book Doctor' },
  { path: '/client/doctor-comparison', component: lazy(() => import('src/pages/Doctor')), isProtected: false, title: 'Compare Doctors' },

  // === DOCTOR (Protected - Doctor/Admin) ===
  { path: '/doctor/dashboard', component: lazy(() => import('src/components/doctors/DoctorDashboard')), isProtected: true, roles: ['doctor', 'admin'], title: 'Doctor Dashboard' },
  { path: '/doctor/profile', component: lazy(() => import('src/components/doctors/DoctorProfile')), isProtected: true, roles: ['doctor', 'admin'], title: 'Doctor Profile' },
  { path: '/doctor/schedule', component: lazy(() => import('src/components/doctors/DoctorSchdule')), isProtected: true, roles: ['doctor', 'admin'], title: 'Doctor Schedule' },
  { path: '/doctor/patients', component: lazy(() => import('src/components/doctors/Patient')), isProtected: true, roles: ['doctor', 'admin'], title: 'Patient Management' },
  { path: '/doctor/appointments', component: lazy(() => import('src/components/doctors/Appointments')), isProtected: true, roles: ['doctor', 'admin'], title: 'Appointments' },
  { path: '/doctor/prescriptions', component: lazy(() => import('src/components/doctors/Prescriptions')), isProtected: true, roles: ['doctor', 'admin'], title: 'Prescriptions' },
  { path: '/doctor/women-care', component: lazy(() => import('src/components/doctors/WomenCare')), isProtected: true, roles: ['doctor', 'admin'], title: 'Women Care' },
  { path: '/doctor/reports', component: lazy(() => import('src/components/doctors/Reports')), isProtected: true, roles: ['doctor', 'admin'], title: 'Medical Reports' },
  { path: '/doctor/emergency', component: lazy(() => import('src/components/doctors/Emergency')), isProtected: true, roles: ['doctor', 'admin'], title: 'Emergency Cases' },
  { path: '/doctor/messages', component: lazy(() => import('src/components/doctors/Messages')), isProtected: true, roles: ['doctor', 'admin'], title: 'Messages' },
  { path: '/doctor/analytics', component: lazy(() => import('src/components/doctors/Analytics')), isProtected: true, roles: ['doctor', 'admin'], title: 'Analytics' },
  { path: '/doctor/settings', component: lazy(() => import('src/components/doctors/Settings')), isProtected: true, roles: ['doctor', 'admin'], title: 'Settings' },

  // ==================== HOSPITAL (Public) ====================
  { path: '/hospital', component: lazy(() => import('src/pages/Hospital')), isProtected: false, title: 'Hospitals' },
  { path: '/hospital/:id', component: lazy(() => import('src/components/hospital/EmergencyServices')), isProtected: false, title: 'Hospital Details' },

  // === HOSPITAL (Protected - Hospital/Admin) ===
  { path: '/hospital/dashboard', component: lazy(() => import('src/components/hospital/HospitalDashboard')), isProtected: true, roles: ['hospital', 'admin'], title: 'Hospital Dashboard' },
  { path: '/hospital/account', component: lazy(() => import('src/components/hospital/HospitalAccount')), isProtected: true, roles: ['hospital'], title: 'Hospital Account' },
  { path: '/hospital/admin', component: lazy(() => import('src/components/hospital/HospitalAdminPanel')), isProtected: true, roles: ['hospital', 'admin'], title: 'Hospital Admin Panel' },

  // ==================== PHARMACY (Public) ====================
  { path: '/pharmacy', component: lazy(() => import('src/pages/Pharmacy')), isProtected: false, title: 'Pharmacy' },
  { path: '/pharmacy/:id', component: lazy(() => import('src/components/pharmacy/MedicineSearch')), isProtected: false, title: 'Medicine Details' },
  { path: '/pharmacy/medicine-search', component: lazy(() => import('src/components/pharmacy/MedicineSearch')), isProtected: false, title: 'Medicine Search' },
  { path: '/pharmacy/card', component: lazy(() => import('src/components/pharmacy/PharmacyCard')), isProtected: false, title: 'Pharmacy Card' },

  // === PHARMACY (Protected - Pharmacy/Admin) ===
  { path: '/pharmacy/dashboard', component: lazy(() => import('src/components/pharmacy/PharmacyDashboard')), isProtected: true, roles: ['pharmacy', 'admin'], title: 'Pharmacy Dashboard' },
  { path: '/pharmacy/account', component: lazy(() => import('src/components/pharmacy/PharmacyAccount')), isProtected: true, roles: ['pharmacy'], title: 'Pharmacy Account' },
  { path: '/pharmacy/stock', component: lazy(() => import('src/components/pharmacy/StockIndicator')), isProtected: true, roles: ['pharmacy', 'admin'], title: 'Stock Indicator' },

  // ==================== EMERGENCY ====================
  { path: '/emergency', component: lazy(() => import('src/pages/Emergency')), isProtected: false, title: 'Emergency' },
  { path: '/emergency/bed-availability', component: lazy(() => import('src/components/emergency/BadAvailability')), isProtected: false, title: 'Bed Availability' },
  { path: '/emergency/icu-tracker', component: lazy(() => import('src/components/emergency/ICUTracker')), isProtected: false, title: 'ICU Tracker' },

  // ============================================
  // AI DASHBOARD (MAIN)
  // ============================================
  {
    path: '/ai-assistant',
    component: lazy(() => import('src/components/ai-assistent/AI-DashBoard')),
    isProtected: false,
    title: 'AI Assistant',
  },

  // ============================================
  // CORE AI FEATURES
  // ============================================
  {
    path: '/ai-assistant/symptom-checker',
    component: lazy(() =>
      import('src/components/ai-assistent/SymptomChecker').then(m => ({
        default: m.SymptomChecker,
      }))
    ),
    isProtected: false,
    title: 'Symptom Checker',
  },
  {
    path: '/ai-assistant/pregnancy-guide',
    component: lazy(() =>
      import('src/components/ai-assistent/PregnancyGuide').then(m => ({
        default: m.PregnancyGuide,
      }))
    ),
    isProtected: false,
    title: 'Pregnancy Guide',
  },
  {
    path: '/ai-assistant/baby-care',
    component: lazy(() =>
      import('src/components/ai-assistent/BabyCareAdvice').then(m => ({
        default: m.BabyCareAdvice,
      }))
    ),
    isProtected: false,
    title: 'Baby Care Advice',
  },
  {
    path: '/ai-assistant/recommendations',
    component: lazy(() => import('src/components/ai-assistent/SmartRecommendation')),
    isProtected: false,
    title: 'Smart Recommendations',
  },

  {
    path: '/ai-assistant/chat',
    component: lazy(() =>
      import('src/components/ai-assistent/ChatBot').then(m => ({ default: m.ChatBot }))
    ),
    isProtected: false,
    title: 'AI Chat',
  },

  
  
  // ============================================
  // EXTRA FEATURES
  // ============================================
  {
    path: '/ai-assistant/voice',
    component: lazy(() =>
      import('src/components/ai-assistent/AIVoiceButton').then(m => ({ default: m.AIVoiceButton }))
    ),
    isProtected: false,
    title: 'Voice Assistant',
  },
  {
    path: '/ai-assistant/suggestions',
    component: lazy(() =>
      import('src/components/ai-assistent/AISuggestionChips').then(m => ({ default: m.AISuggestionChips }))
    ),
    isProtected: false,
    title: 'AI Suggestions',
  },











  
  // ==================== OXYGEN ====================
  { path: '/oxygen', component: lazy(() => import('src/components/oxygen/OxygenDashboard')), isProtected: false, title: 'Oxygen Dashboard' },

  // ==================== APPOINTMENTS ====================
  { path: '/appointments/calendar', component: lazy(() => import('src/components/appointment/AppointmentCalendar')), isProtected: false, title: 'Appointment Calendar' },
  { path: '/appointments/list', component: lazy(() => import('src/components/appointment/AppointmentList')), isProtected: false, title: 'Appointment List' },

  // ==================== WOMEN CARE (Public) ====================
  { path: '/women-care', component: lazy(() => import('src/components/women/WomenCareDashboard')), isProtected: false, title: 'Women Care' },

  // === WOMEN CARE (Protected - Patient) ===
  { path: '/women-care/gynecologist', component: lazy(() => import('src/components/women/GynecologistCard')), isProtected: true, roles: ['patient'], title: 'Gynecologist' },
  { path: '/women-care/medicine-record', component: lazy(() => import('src/components/women/MedicineRecord')), isProtected: true, roles: ['patient'], title: 'Medicine Record' },
  { path: '/women-care/menstrual-cycle', component: lazy(() => import('src/components/women/MenstrualCycleTracker')), isProtected: true, roles: ['patient'], title: 'Menstrual Cycle' },
  { path: '/women-care/mother-health', component: lazy(() => import('src/components/women/MotherHealthMonitor')), isProtected: true, roles: ['patient'], title: 'Mother Health' },
  { path: '/women-care/pregnancy', component: lazy(() => import('src/components/women/pregnancyTracker')), isProtected: true, roles: ['patient'], title: 'Pregnancy Tracker' },
  { path: '/women-care/special-care', component: lazy(() => import('src/components/women/SpecialCare')), isProtected: true, roles: ['patient'], title: 'Special Care' },
  { path: '/women-care/vaccine-schedule', component: lazy(() => import('src/components/women/VaccineSchedule')), isProtected: true, roles: ['patient'], title: 'Vaccine Schedule' },
  { path: '/women-care/health', component: lazy(() => import('src/components/women/WomenHealth')), isProtected: true, roles: ['patient'], title: 'Women Health' },























  
  // ==================== PATIENT (Protected) ====================
  { path: '/patient/dashboard', component: lazy(() => import('../../pages/Client/ClientDashboard')), isProtected: true, roles: ['patient'], title: 'Dashboard' },
  { path: '/patient/appointments', component: lazy(() => import('../../pages/Client/Appointments')), isProtected: true, roles: ['patient'], title: 'Appointments' },
  { path: '/patient/messages', component: lazy(() => import('../../pages/Client/Messages')), isProtected: true, roles: ['patient'], title: 'Messages' },
  { path: '/patient/records', component: lazy(() => import('../../pages/Client/patients/MedicalHistory')), isProtected: true, roles: ['patient'], title: 'Medical Records' },
  { path: '/patient/billing', component: lazy(() => import('../../pages/Client/Clientprofile')), isProtected: true, roles: ['patient'], title: 'Billing' },
  { path: '/patient/blood-donation', component: lazy(() => import('../../pages/Client/bloodDonation')), isProtected: true, roles: ['patient'], title: 'Blood Donation' },
  { path: '/patient/orders', component: lazy(() => import('../../pages/Client/ClientOrders')), isProtected: true, roles: ['patient'], title: 'My Orders' },
  { path: '/patient/discover', component: lazy(() => import('../../pages/Client/Discover')), isProtected: true, roles: ['patient'], title: 'Discover' },
  { path: '/patient/emergency-request', component: lazy(() => import('../../pages/Client/EmergencyRequest')), isProtected: true, roles: ['patient'], title: 'Emergency Request' },
  { path: '/patient/health-records', component: lazy(() => import('../../pages/Client/HealthRecords')), isProtected: true, roles: ['patient'], title: 'Health Records' },
  { path: '/patient/health-timeline', component: lazy(() => import('../../pages/Client/HealthTimeline')), isProtected: true, roles: ['patient'], title: 'Health Timeline' },
  { path: '/patient/medical-reports', component: lazy(() => import('../../pages/Client/MedicalReports')), isProtected: true, roles: ['patient'], title: 'Medical Reports' },
  { path: '/patient/physiotherapy', component: lazy(() => import('../../pages/Client/Physiothrerapy')), isProtected: true, roles: ['patient'], title: 'Physiotherapy' },
  { path: '/patient/prescriptions', component: lazy(() => import('../../pages/Client/Prescriptions')), isProtected: true, roles: ['patient'], title: 'Prescriptions' },
  { path: '/patient/profile-converter', component: lazy(() => import('../../pages/Client/ProfileConverter')), isProtected: true, roles: ['patient'], title: 'Profile Converter' },
  { path: '/patient/recommendations', component: lazy(() => import('../../pages/Client/Recommendations')), isProtected: true, roles: ['patient'], title: 'Recommendations' },
  { path: '/patient/vaccine-tracking', component: lazy(() => import('../../pages/Client/VeccineTracking')), isProtected: true, roles: ['patient'], title: 'Vaccine Tracking' },
  { path: '/patient/medicine-tracker', component: lazy(() => import('../../pages/Client/patients/MedicineTracker')), isProtected: true, roles: ['patient'], title: 'Medicine Tracker' },
  { path: '/patient/vaccination-tracker', component: lazy(() => import('../../pages/Client/patients/VaccinationTracker')), isProtected: true, roles: ['patient'], title: 'Vaccination Tracker' },

  // ==================== PATIENT WELLNESS (Protected) ====================
  { path: '/patient/mental-health', component: lazy(() => import('../../pages/Client/MentalHealth')), isProtected: true, roles: ['patient'], title: 'Mental Health' },
  { path: '/patient/nutrition', component: lazy(() => import('../../pages/Client/Nutrition')), isProtected: true, roles: ['patient'], title: 'Nutrition' },
  { path: '/patient/sleep', component: lazy(() => import('../../pages/Client/Sleep')), isProtected: true, roles: ['patient'], title: 'Sleep' },
  { path: '/patient/fitness', component: lazy(() => import('../../pages/Client/Fitness')), isProtected: true, roles: ['patient'], title: 'Fitness' },

  // ==================== SHARED (All roles) ====================
  { path: '/profile', component: lazy(() => import('../../pages/Client/Clientprofile')), isProtected: true, roles: ['patient', 'doctor', 'hospital', 'pharmacy', 'admin', 'super_admin'], title: 'Profile' },
  { path: '/settings', component: lazy(() => import('../../pages/Client/Settings')), isProtected: true, roles: ['patient', 'doctor', 'hospital', 'pharmacy', 'admin', 'super_admin'], title: 'Settings' },
  { path: '/security', component: lazy(() => import('../../pages/Client/Security')), isProtected: true, roles: ['patient', 'doctor', 'hospital', 'pharmacy', 'admin', 'super_admin'], title: 'Security' },
























  // ==================== ADMIN (Protected - Admin/Super Admin only) ====================
  { path: '/admin/dashboard', component: lazy(() => import('src/components/admin/AdminDashboard')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Admin Dashboard' },
  { path: '/admin/login', component: lazy(() => import('../../pages/auth/Login')), isProtected: false, title: 'Admin Login' },
  { path: '/admin/live-monitor', component: lazy(() => import('src/components/admin/LiveMonitor')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Live Monitoring' },
  { path: '/admin/users', component: lazy(() => import('src/components/admin/UserManager')), isProtected: true, roles: ['admin', 'super_admin'], title: 'User Management' },
  { path: '/admin/users/add', component: lazy(() => import('src/components/admin/UserManager')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Add User' },
  { path: '/admin/doctor-verification', component: lazy(() => import('src/components/admin/DoctorVerification')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Doctor Verification' },
  { path: '/admin/doctors/verify', component: lazy(() => import('src/components/admin/DoctorVerification')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Verify Doctor' },
  { path: '/admin/patients', component: lazy(() => import('src/components/admin/PatientManagement')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Patient Management' },
  { path: '/admin/emergency', component: lazy(() => import('src/components/admin/EmergencyMonitor')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Emergency Monitor' },
  { path: '/admin/security', component: lazy(() => import('src/components/admin/SecurityManager')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Security Manager' },
  { path: '/admin/hospitals', component: lazy(() => import('src/components/admin/HospitalManagement')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Hospital Management' },
  { path: '/admin/pharmacy', component: lazy(() => import('src/components/admin/PharmacyManagement')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Pharmacy Management' },

  { path: '/admin/women-care-management', component: lazy(() => import('src/components/admin/WomenCareManagement')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Women Care Management' },
  { path: '/admin/messages', component: lazy(() => import('src/components/admin/MessagesCenter')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Messages' },
  { path: '/admin/complaints', component: lazy(() => import('src/components/admin/ComplaintManager')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Complaints' },
  { path: '/admin/revenue', component: lazy(() => import('src/components/admin/RevenueManager')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Revenue' },

  { path: '/admin/reports', component: lazy(() => import('src/components/admin/ReportsAnalytics')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Reports' },
  { path: '/admin/analytics', component: lazy(() => import('src/components/admin/ReportsAnalytics')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Analytics' },
  { path: '/admin/ai-system', component: lazy(() => import('src/components/admin/AIControlPanel')), isProtected: true, roles: ['admin', 'super_admin'], title: 'AI System' },
  { path: '/admin/verification', component: lazy(() => import('src/components/admin/VerificationCenter')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Verification' },
  { path: '/admin/notifications', component: lazy(() => import('src/components/admin/AdminNotifications')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Notifications' },

  { path: '/admin/audit-logs', component: lazy(() => import('src/components/admin/AuditLogs')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Audit Logs' },
  { path: '/admin/appointments', component: lazy(() => import('src/components/admin/AdminAppointments')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Admin Appointments' },
  { path: '/admin/meetings', component: lazy(() => import('src/components/admin/AdminMeetingSystem')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Admin Meetings' },
  { path: '/admin/heatmap', component: lazy(() => import('src/components/admin/HealthHeatmap')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Health Heatmap' },
  { path: '/admin/settings', component: lazy(() => import('src/components/admin/SecurityManager')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Settings' },
  { path: '/admin/blood-bank', component: lazy(() => import('src/components/admin/EmergencyMonitor')), isProtected: true, roles: ['admin', 'super_admin'], title: 'Blood Bank' },

  // ==================== 404 ====================
  { path: '*', component: lazy(() => import('../../pages/NotFound')), isProtected: false, title: '404' },
];