// src/components/hospitals/HospitalDashboard.tsx
// ULTIMATE HOSPITAL MANAGEMENT DASHBOARD - ALL 25 MODULES INTEGRATED
import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, TrendingUp, Users, UserPlus, Calendar,
  AlertCircle, Bed, DollarSign, Activity,
  Stethoscope, ClipboardList, FlaskConical,
  Pill, Truck, Droplets, Brain, Bell,
  Video, Shield, Settings, Building2,
  ChevronRight, ChevronLeft, 
  Search, Menu, X, Plus, LogOut,
   Clock, 
   Heart, 
  Star, Award, RefreshCw,
   MessageCircle,
  BarChart3, 
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,  ResponsiveContainer,

} from 'recharts';

// ============================================
// ALL UI COMPONENTS - READY FILES
// ============================================
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';

// ============================================
// EXISTING HOSPITAL COMPONENTS (Lazy Loaded)
// ============================================
const BedAvailability = lazy(() => import('./BedAvailability'));
const EmergencyServices = lazy(() => import('./EmergencyServices'));
const HospitalAccount = lazy(() => import('./HospitalAccount'));
const HospitalCard = lazy(() => import('./HospitalCard'));
const Hospitals = lazy(() => import('./Hospitals'));
const HospitalSidebar = lazy(() => import('./HospitalSidebar'));
const ICUTracker = lazy(() => import('./ICUTracker'));

// ============================================
// TYPES
// ============================================
interface HospitalStats {
  totalPatients: number;
  totalDoctors: number;
  todayAppointments: number;
  emergencyCases: number;
  availableBeds: number;
  totalBeds: number;
  icuBeds: number;
  revenue: number;
  pendingReports: number;
  activeSurgeries: number;
}

interface QuickStat {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface RecentPatient {
  id: string;
  name: string;
  age: number;
  gender: string;
  condition: string;
  status: 'stable' | 'critical' | 'recovering' | 'discharged';
  admittedDate: string;
  doctor: string;
  ward: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  status: 'available' | 'busy' | 'off-duty' | 'in-surgery';
  patients: number;
  rating: number;
  avatar: string;
}

interface EmergencyCase {
  id: string;
  patientName: string;
  condition: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  arrivalTime: string;
  status: 'waiting' | 'in-treatment' | 'stable' | 'transferred';
  ambulanceId?: string;
}

interface SidebarLink {
  icon: React.ElementType;
  label: string;
  path: string;
  category: string;
  badge?: number;
}

// ============================================
// MOCK DATA
// ============================================
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const hospitalStats: HospitalStats = {
  totalPatients: 1247,
  totalDoctors: 86,
  todayAppointments: 234,
  emergencyCases: 18,
  availableBeds: 45,
  totalBeds: 300,
  icuBeds: 12,
  revenue: 284500,
  pendingReports: 67,
  activeSurgeries: 8,
};

const quickStats: QuickStat[] = [
  { icon: Users, label: 'Total Patients', value: '1,247', change: '+12%', trend: 'up', color: 'cyan' },
  { icon: Stethoscope, label: 'Total Doctors', value: '86', change: '+3%', trend: 'up', color: 'blue' },
  { icon: Calendar, label: 'Appointments', value: '234', change: '+18%', trend: 'up', color: 'purple' },
  { icon: AlertCircle, label: 'Emergency', value: '18', change: '-5%', trend: 'down', color: 'red' },
  { icon: Bed, label: 'Available Beds', value: '45/300', change: '15%', trend: 'stable', color: 'emerald' },
  { icon: Activity, label: 'ICU Occupied', value: '12/25', change: '+2', trend: 'up', color: 'amber' },
  { icon: DollarSign, label: 'Revenue', value: '$284.5K', change: '+22%', trend: 'up', color: 'green' },
  { icon: FlaskConical, label: 'Pending Labs', value: '67', change: '-8', trend: 'down', color: 'teal' },
];

const recentPatients: RecentPatient[] = [
  { id: '1', name: 'John Smith', age: 45, gender: 'Male', condition: 'Cardiac Arrest', status: 'critical', admittedDate: '2026-05-27', doctor: 'Dr. Wilson', ward: 'ICU-3' },
  { id: '2', name: 'Emma Davis', age: 32, gender: 'Female', condition: 'Fracture', status: 'stable', admittedDate: '2026-05-26', doctor: 'Dr. Anderson', ward: 'Ortho-12' },
  { id: '3', name: 'Robert Kim', age: 58, gender: 'Male', condition: 'Pneumonia', status: 'recovering', admittedDate: '2026-05-25', doctor: 'Dr. Chen', ward: 'General-8' },
  { id: '4', name: 'Lisa Brown', age: 28, gender: 'Female', condition: 'Appendicitis', status: 'discharged', admittedDate: '2026-05-24', doctor: 'Dr. Garcia', ward: 'Surgery-5' },
  { id: '5', name: 'Michael Lee', age: 67, gender: 'Male', condition: 'Stroke', status: 'critical', admittedDate: '2026-05-27', doctor: 'Dr. Wilson', ward: 'ICU-1' },
];

const doctorsOnDuty: Doctor[] = [
  { id: '1', name: 'Dr. Sarah Wilson', specialty: 'Cardiologist', status: 'available', patients: 12, rating: 4.8, avatar: 'SW' },
  { id: '2', name: 'Dr. James Anderson', specialty: 'Orthopedic', status: 'in-surgery', patients: 8, rating: 4.6, avatar: 'JA' },
  { id: '3', name: 'Dr. Emily Chen', specialty: 'Neurologist', status: 'busy', patients: 15, rating: 4.9, avatar: 'EC' },
  { id: '4', name: 'Dr. Michael Kim', specialty: 'Pediatrician', status: 'available', patients: 10, rating: 4.7, avatar: 'MK' },
];

const emergencyCases: EmergencyCase[] = [
  { id: '1', patientName: 'David Wilson', condition: 'Heart Attack', severity: 'critical', arrivalTime: '5 min ago', status: 'in-treatment', ambulanceId: 'AMB-12' },
  { id: '2', patientName: 'Sarah Connor', condition: 'Car Accident', severity: 'high', arrivalTime: '12 min ago', status: 'waiting', ambulanceId: 'AMB-08' },
  { id: '3', patientName: 'Tom Hardy', condition: 'Severe Burns', severity: 'high', arrivalTime: '20 min ago', status: 'stable', ambulanceId: 'AMB-03' },
];

const revenueData = [
  { month: 'Jan', revenue: 220000, patients: 980, expenses: 180000 },
  { month: 'Feb', revenue: 240000, patients: 1050, expenses: 185000 },
  { month: 'Mar', revenue: 260000, patients: 1120, expenses: 190000 },
  { month: 'Apr', revenue: 250000, patients: 1080, expenses: 188000 },
  { month: 'May', revenue: 284500, patients: 1247, expenses: 195000 },
];

const bedOccupancyData = [
  { ward: 'ICU', occupied: 20, available: 5 },
  { ward: 'General', occupied: 80, available: 20 },
  { ward: 'Ortho', occupied: 35, available: 15 },
  { ward: 'Pediatric', occupied: 25, available: 10 },
  { ward: 'Surgery', occupied: 15, available: 5 },
];

const sidebarLinks: { category: string; items: SidebarLink[] }[] = [
  {
    category: 'MAIN',
    items: [
      { icon: Home, label: 'Dashboard', path: '/hospital/dashboard', category: 'MAIN' },
      { icon: BarChart3, label: 'Analytics', path: '/hospital/analytics', category: 'MAIN' },
    ]
  },
  {
    category: 'PATIENTS',
    items: [
      { icon: Users, label: 'Patients', path: '/hospital/patients', category: 'PATIENTS', badge: 1247 },
      { icon: Calendar, label: 'Appointments', path: '/hospital/appointments', category: 'PATIENTS', badge: 234 },
      { icon: ClipboardList, label: 'Reports', path: '/hospital/reports', category: 'PATIENTS', badge: 67 },
    ]
  },
  {
    category: 'HOSPITAL',
    items: [
      { icon: Stethoscope, label: 'Doctors', path: '/hospital/doctors', category: 'HOSPITAL', badge: 86 },
      { icon: UserPlus, label: 'Staff', path: '/hospital/staff', category: 'HOSPITAL' },
      { icon: Bed, label: 'Beds & Rooms', path: '/hospital/beds', category: 'HOSPITAL' },
      { icon: Activity, label: 'ICU Monitor', path: '/hospital/icu', category: 'HOSPITAL', badge: 12 },
      { icon: Heart, label: 'Surgery', path: '/hospital/surgery', category: 'HOSPITAL', badge: 8 },
    ]
  },
  {
    category: 'SERVICES',
    items: [
      { icon: Pill, label: 'Pharmacy', path: '/hospital/pharmacy', category: 'SERVICES' },
      { icon: FlaskConical, label: 'Laboratory', path: '/hospital/lab', category: 'SERVICES' },
      { icon: Truck, label: 'Ambulance', path: '/hospital/ambulance', category: 'SERVICES' },
      { icon: Droplets, label: 'Blood Bank', path: '/hospital/blood-bank', category: 'SERVICES' },
    ]
  },
  {
    category: 'FINANCE',
    items: [
      { icon: DollarSign, label: 'Billing', path: '/hospital/billing', category: 'FINANCE' },
      { icon: Shield, label: 'Insurance', path: '/hospital/insurance', category: 'FINANCE' },
      { icon: Award, label: 'Payroll', path: '/hospital/payroll', category: 'FINANCE' },
    ]
  },
  {
    category: 'AI SYSTEM',
    items: [
      { icon: Brain, label: 'AI Analytics', path: '/hospital/ai-analytics', category: 'AI' },
      { icon: MessageCircle, label: 'AI Assistant', path: '/hospital/ai-chat', category: 'AI' },
    ]
  },
  {
    category: 'SETTINGS',
    items: [
      { icon: Bell, label: 'Notifications', path: '/hospital/notifications', category: 'SETTINGS', badge: 5 },
      { icon: Video, label: 'Security', path: '/hospital/security', category: 'SETTINGS' },
      { icon: Settings, label: 'Settings', path: '/hospital/settings', category: 'SETTINGS' },
    ]
  },
];

// ============================================
// COLOR MAPS (Safe Tailwind)
// ============================================
const statColors: Record<string, { bg: string; text: string; gradient: string }> = {
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', gradient: 'from-cyan-500 to-blue-500' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', gradient: 'from-blue-500 to-indigo-500' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', gradient: 'from-purple-500 to-violet-500' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', gradient: 'from-red-500 to-rose-500' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', gradient: 'from-emerald-500 to-teal-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', gradient: 'from-amber-500 to-orange-500' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', gradient: 'from-green-500 to-emerald-500' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', gradient: 'from-teal-500 to-cyan-500' },
};

// ============================================
// LOADING FALLBACK
// ============================================
const LoadingFallback: React.FC = () => (
  <div className="flex items-center justify-center h-full min-h-[400px]">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
      className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent"
    />
  </div>
);

// ============================================
// MAIN HOSPITAL DASHBOARD
// ============================================
const HospitalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const currentPath = location.pathname;

  // Render page based on route
  const renderContent = () => {
    return (
      <div className="space-y-6">
        {/* ============================================ */}
        {/* WELCOME HEADER */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900/30 via-slate-900 to-blue-900/30 border border-cyan-500/20 p-6 lg:p-8"
        >
          <div className="absolute inset-0">
            <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-cyan-500/20"
              >
                <Building2 className="w-7 h-7 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl lg:text-3xl font-black text-white">
                  {greeting}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">Admin</span>
                </h1>
                <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                  <span className="text-slate-600">•</span>
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  <span className="text-slate-600">•</span>
                  <span className="flex items-center gap-1 text-emerald-400">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    All Systems Operational
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" className="border-cyan-500/30 text-cyan-400">
                <RefreshCw className="w-4 h-4 mr-2" /> Refresh
              </Button>
              <Button variant="primary" size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500">
                <Plus className="w-4 h-4 mr-2" /> Add Patient
              </Button>
            </div>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* QUICK STATS GRID */}
        {/* ============================================ */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            const colors = statColors[stat.color] || statColors.cyan;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <Card className="p-4 cursor-pointer group">
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2.5 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    <span className={`text-xs font-bold ${
                      stat.trend === 'up' ? 'text-emerald-400' : stat.trend === 'down' ? 'text-red-400' : 'text-slate-400'
                    }`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className={`text-2xl font-black ${colors.text}`}>{stat.value}</p>
                  <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* ============================================ */}
        {/* CHARTS ROW */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <GlassmorphicCard className="p-6">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-cyan-400" /> Revenue Overview
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" stroke="#ffffff40" fontSize={12} />
                <YAxis stroke="#ffffff40" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                <Area type="monotone" dataKey="revenue" stroke="#06B6D4" fill="url(#colorRevenue)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </GlassmorphicCard>

          {/* Bed Occupancy */}
          <GlassmorphicCard className="p-6">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
              <Bed className="w-5 h-5 text-emerald-400" /> Bed Occupancy
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={bedOccupancyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="ward" stroke="#ffffff40" fontSize={12} />
                <YAxis stroke="#ffffff40" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                <Bar dataKey="occupied" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                <Bar dataKey="available" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassmorphicCard>
        </div>

        {/* ============================================ */}
        {/* RECENT PATIENTS & DOCTORS */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Patients */}
          <div className="lg:col-span-2">
            <GlassmorphicCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" /> Recent Patients
                </h3>
                <Button variant="ghost" size="xs" onClick={() => navigate('/hospital/patients')}>
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-slate-400 text-xs">
                      <th className="p-3">Patient</th>
                      <th className="p-3">Condition</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Doctor</th>
                      <th className="p-3">Ward</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentPatients.map((patient) => (
                      <tr key={patient.id} className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-all cursor-pointer">
                        <td className="p-3">
                          <div className="flex items-center gap-3">
                            <Avatar name={patient.name.split(' ').map(n => n[0]).join('')} size="sm" />
                            <div>
                              <p className="text-white text-sm font-bold">{patient.name}</p>
                              <p className="text-slate-500 text-xs">{patient.age} yrs • {patient.gender}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-white text-sm">{patient.condition}</td>
                        <td className="p-3">
                          <Badge className={
                            patient.status === 'critical' ? 'bg-red-500/10 text-red-400' :
                            patient.status === 'stable' ? 'bg-emerald-500/10 text-emerald-400' :
                            patient.status === 'recovering' ? 'bg-amber-500/10 text-amber-400' :
                            'bg-blue-500/10 text-blue-400'
                          }>
                            {patient.status}
                          </Badge>
                        </td>
                        <td className="p-3 text-slate-400 text-sm">{patient.doctor}</td>
                        <td className="p-3 text-slate-400 text-sm">{patient.ward}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassmorphicCard>
          </div>

          {/* Emergency Queue */}
          <GlassmorphicCard className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" /> Emergency
              </h3>
              <Badge variant="danger">{emergencyCases.length} Active</Badge>
            </div>
            <div className="space-y-3">
              {emergencyCases.map((emergency) => (
                <motion.div
                  key={emergency.id}
                  whileHover={{ x: 3 }}
                  className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-red-500/20 transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        emergency.severity === 'critical' ? 'bg-red-400 animate-pulse' :
                        emergency.severity === 'high' ? 'bg-amber-400' : 'bg-blue-400'
                      }`} />
                      <div>
                        <p className="text-white text-sm font-bold">{emergency.patientName}</p>
                        <p className="text-slate-400 text-xs">{emergency.condition}</p>
                      </div>
                    </div>
                    <Badge variant={
                      emergency.status === 'in-treatment' ? 'warning' :
                      emergency.status === 'stable' ? 'success' : 'info'
                    } className="text-[10px]">
                      {emergency.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {emergency.arrivalTime}
                    </span>
                    {emergency.ambulanceId && (
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" /> {emergency.ambulanceId}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="w-full mt-4 border-red-500/30 text-red-400">
              View Emergency Center
            </Button>
          </GlassmorphicCard>
        </div>

        {/* ============================================ */}
        {/* DOCTORS ON DUTY */}
        {/* ============================================ */}
        <GlassmorphicCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-blue-400" /> Doctors On Duty
            </h3>
            <Button variant="ghost" size="xs" onClick={() => navigate('/hospital/doctors')}>
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {doctorsOnDuty.map((doctor) => (
              <motion.div
                key={doctor.id}
                whileHover={{ y: -4 }}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-cyan-500/20 transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Avatar name={doctor.avatar} size="md" />
                  <div>
                    <p className="text-white text-sm font-bold">{doctor.name}</p>
                    <p className="text-slate-500 text-xs">{doctor.specialty}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Badge className={
                    doctor.status === 'available' ? 'bg-emerald-500/10 text-emerald-400' :
                    doctor.status === 'busy' ? 'bg-amber-500/10 text-amber-400' :
                    doctor.status === 'in-surgery' ? 'bg-red-500/10 text-red-400' :
                    'bg-slate-500/10 text-slate-400'
                  }>
                    {doctor.status}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-white text-sm font-bold">{doctor.rating}</span>
                  </div>
                </div>
                <p className="text-slate-500 text-xs mt-2">{doctor.patients} patients today</p>
              </motion.div>
            ))}
          </div>
        </GlassmorphicCard>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#020408] flex">
      {/* ============================================ */}
      {/* SIDEBAR */}
      {/* ============================================ */}
      <aside className={`hidden lg:flex flex-col bg-slate-950/80 backdrop-blur-xl border-r border-cyan-500/10 h-screen sticky top-0 transition-all duration-300 ${
        sidebarCollapsed ? 'w-20' : 'w-72'
      }`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-cyan-500/10 flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center"
              >
                <Building2 className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h3 className="text-white font-bold text-sm">MediCare Hospital</h3>
                <p className="text-cyan-400 text-xs">Admin Panel v3.0</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-1.5 rounded-lg hover:bg-white/5 text-slate-400"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2 space-y-4">
          {sidebarLinks.map((section) => (
            <div key={section.category}>
              {!sidebarCollapsed && (
                <p className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {section.category}
                </p>
              )}
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPath === item.path || currentPath.includes(item.path);
                return (
                  <motion.button
                    key={item.label}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all mb-1 ${
                      isActive
                        ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/20 shadow-lg'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                    }`}
                    title={sidebarCollapsed ? item.label : ''}
                  >
                    <div className="relative">
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {item.badge && (
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    {!sidebarCollapsed && <span>{item.label}</span>}
                    {!sidebarCollapsed && item.badge && (
                      <Badge variant="danger" className="ml-auto text-[10px]">{item.badge}</Badge>
                    )}
                  </motion.button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-cyan-500/10">
          <div className="flex items-center gap-3 mb-3">
            <Avatar name="AD" size="sm" />
            {!sidebarCollapsed && (
              <div>
                <p className="text-white text-sm font-bold">Admin User</p>
                <p className="text-slate-500 text-xs">Super Admin</p>
              </div>
            )}
          </div>
          <Button variant="ghost" className="w-full text-slate-400 hover:text-red-400 justify-start text-xs">
            <LogOut className="w-4 h-4 mr-2" />
            {!sidebarCollapsed && 'Sign Out'}
          </Button>
        </div>
      </aside>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-cyan-500/10">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-white/5 text-slate-400"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08]">
                <Search className="w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search patients, doctors, rooms..."
                  className="bg-transparent text-white text-sm placeholder-slate-600 focus:outline-none w-64"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Button variant="ghost" size="xs" onClick={() => setShowNotifications(!showNotifications)}>
                  <Bell className="w-4 h-4" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold">5</span>
                </Button>
              </div>
              <Badge variant="success" className="hidden sm:flex items-center gap-1.5">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                System Online
              </Badge>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Suspense fallback={<LoadingFallback />}>
            {renderContent()}
          </Suspense>
        </main>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="relative w-72 h-full bg-slate-950 border-r border-cyan-500/10 overflow-y-auto"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-cyan-400" />
                    <h3 className="text-white font-bold">MediCare Hospital</h3>
                  </div>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                {sidebarLinks.map((section) => (
                  <div key={section.category} className="mb-4">
                    <p className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase">{section.category}</p>
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.label}
                          onClick={() => { navigate(item.path); setMobileMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-slate-400 hover:text-white mb-1"
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                          {item.badge && <Badge variant="default" className="ml-auto text-[10px]">{item.badge}</Badge>}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HospitalDashboard;