// src/pages/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, UserCheck, Building2, Pill,
  Droplet, Calendar, TrendingUp, Activity, AlertCircle, 
  Bell, Settings, BarChart3, PieChart as LucidePieChart, LineChart,
  MessageSquare, Award, Star, ArrowUp, ArrowDown,
  Server, LogOut, Menu, X, Search, ChevronRight,
  Eye, CheckCircle, XCircle, Download, MoreVertical,
  Heart, Stethoscope, DollarSign, Clock as ClockIcon,
  Syringe, ClipboardList, Filter, Zap, Radio,
  Globe, Database, Cloud, Lock, Key
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import {
  LineChart as ReLineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Shared UI Components
import { Card } from 'src/ui/Card';
import { Button } from 'src/ui/Button';
import { Badge } from  'src/ui/Badge';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';

// ============================================
// TYPES
// ============================================
interface SystemStats {
  totalUsers: number;
  totalDoctors: number;
  totalHospitals: number;
  totalPharmacies: number;
  totalBloodDonors: number;
  totalAppointments: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  verifiedDoctors: number;
  pendingVerifications: number;
  blockedUsers: number;
  totalDonations: number;
  totalBloodUnits: number;
  livesSaved: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

interface ActivityItem {
  id: string;
  userName: string;
  userAvatar?: string;
  userRole: string;
  action: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical' | 'success';
  ipAddress?: string;
  location?: string;
}

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
}

interface TopPerformer {
  id: string;
  name: string;
  role: string;
  rating: number;
  totalPatients: number;
  revenue: number;
  avatar: string;
}

interface BloodAlert {
  id: string;
  bloodBank: string;
  bloodGroup: string;
  unitsLeft: number;
  status: 'critical' | 'low' | 'normal';
}

interface FeedbackItem {
  id: string;
  userName: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'reviewed' | 'resolved' | 'closed';
  timestamp: string;
}

interface QuickAction {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  color: string;
  description?: string;
}

// ============================================
// CHART DATA
// ============================================
const userGrowthData = [
  { month: 'Jan', users: 12000, active: 8900 },
  { month: 'Feb', users: 12500, active: 9200 },
  { month: 'Mar', users: 13100, active: 9600 },
  { month: 'Apr', users: 13800, active: 10100 },
  { month: 'May', users: 14500, active: 10700 },
  { month: 'Jun', users: 15200, active: 11300 },
];

const appointmentData = [
  { day: 'Mon', appointments: 450, consultations: 380 },
  { day: 'Tue', appointments: 520, consultations: 430 },
  { day: 'Wed', appointments: 480, consultations: 410 },
  { day: 'Thu', appointments: 550, consultations: 460 },
  { day: 'Fri', appointments: 600, consultations: 510 },
  { day: 'Sat', appointments: 350, consultations: 290 },
  { day: 'Sun', appointments: 200, consultations: 160 },
];

const revenueData = [
  { month: 'Jan', revenue: 45000, expenses: 32000 },
  { month: 'Feb', revenue: 52000, expenses: 35000 },
  { month: 'Mar', revenue: 48000, expenses: 33000 },
  { month: 'Apr', revenue: 58000, expenses: 38000 },
  { month: 'May', revenue: 65000, expenses: 42000 },
  { month: 'Jun', revenue: 72000, expenses: 45000 },
];

const doctorDistribution = [
  { name: 'Cardiology', value: 25, color: '#3B82F6' },
  { name: 'Neurology', value: 18, color: '#10B981' },
  { name: 'Pediatrics', value: 22, color: '#F59E0B' },
  { name: 'Orthopedics', value: 20, color: '#EF4444' },
  { name: 'Dermatology', value: 15, color: '#8B5CF6' },
];

// ============================================
// STATIC DATA
// ============================================
const quickActions: QuickAction[] = [
  { title: 'User Management', icon: Users, path: '/admin/users', color: 'from-blue-500 to-cyan-500' },
  { title: 'Doctor Verification', icon: UserCheck, path: '/admin/doctors/verify', color: 'from-emerald-500 to-teal-500' },
  { title: 'Emergency Monitor', icon: Syringe, path: '/admin/emergency', color: 'from-red-500 to-rose-500' },
  { title: 'Blood Bank', icon: Droplet, path: '/admin/blood-bank', color: 'from-red-500 to-pink-500' },
  { title: 'Hospital Management', icon: Building2, path: '/admin/hospitals', color: 'from-purple-500 to-violet-500' },
  { title: 'Pharmacy Control', icon: Pill, path: '/admin/pharmacies', color: 'from-amber-500 to-orange-500' },
  { title: 'Security Settings', icon: Shield, path: '/admin/security', color: 'from-slate-500 to-gray-500' },
  { title: 'System Analytics', icon: TrendingUp, path: '/admin/analytics', color: 'from-indigo-500 to-blue-500' },
];

const statsCards = [
  { title: 'Total Users', value: '12,847', change: '+12.5%', icon: Users, color: 'from-blue-500 to-cyan-500', trend: 'up' },
  { title: 'Active Doctors', value: '1,234', change: '+8.2%', icon: Stethoscope, color: 'from-emerald-500 to-teal-500', trend: 'up' },
  { title: 'Hospitals', value: '156', change: '+3', icon: Building2, color: 'from-purple-500 to-violet-500', trend: 'up' },
  { title: 'Pharmacies', value: '432', change: '+5', icon: Pill, color: 'from-amber-500 to-orange-500', trend: 'up' },
  { title: 'Blood Donors', value: '5,231', change: '+15%', icon: Droplet, color: 'from-red-500 to-rose-500', trend: 'up' },
  { title: 'Appointments', value: '45.2K', change: '+22%', icon: Calendar, color: 'from-indigo-500 to-blue-500', trend: 'up' },
  { title: 'Lives Saved', value: '54,321', change: '+1,234', icon: Heart, color: 'from-pink-500 to-rose-500', trend: 'up' },
  { title: 'Revenue', value: '$72.5K', change: '+18%', icon: DollarSign, color: 'from-green-500 to-emerald-500', trend: 'up' }
];

const recentActivities: ActivityItem[] = [
  { id: '1', userName: 'Dr. Sarah Johnson', userRole: 'doctor', action: 'New patient appointment scheduled', timestamp: '2 min ago', severity: 'info', ipAddress: '192.168.1.1', location: 'New York, USA' },
  { id: '2', userName: 'City Hospital', userRole: 'hospital', action: 'Updated bed availability (45 beds available)', timestamp: '15 min ago', severity: 'success', ipAddress: '192.168.1.2', location: 'Los Angeles, USA' },
  { id: '3', userName: 'John Patient', userRole: 'patient', action: 'Medical records requested', timestamp: '1 hour ago', severity: 'warning', ipAddress: '192.168.1.3', location: 'Chicago, USA' },
  { id: '4', userName: 'MediCare Pharmacy', userRole: 'pharmacy', action: 'Low stock alert: Paracetamol', timestamp: '2 hours ago', severity: 'critical', ipAddress: '192.168.1.4', location: 'Houston, USA' },
  { id: '5', userName: 'Blood Bank', userRole: 'blood-donor', action: 'Emergency: O- blood needed', timestamp: '3 hours ago', severity: 'critical', ipAddress: '192.168.1.5', location: 'Phoenix, USA' },
];

const notifications: NotificationItem[] = [
  { id: '1', title: 'New User Registration', message: 'John Doe registered as a patient', type: 'info', timestamp: '5 min ago', isRead: false },
  { id: '2', title: 'Doctor Verification Request', message: 'Dr. Smith needs verification', type: 'warning', timestamp: '30 min ago', isRead: false },
  { id: '3', title: 'System Update Complete', message: 'Version 2.1.0 deployed successfully', type: 'success', timestamp: '2 hours ago', isRead: true },
  { id: '4', title: 'Security Alert', message: 'Multiple failed login attempts detected', type: 'error', timestamp: '3 hours ago', isRead: false },
];

const topPerformers: TopPerformer[] = [
  { id: '1', name: 'Dr. Sarah Johnson', role: 'Cardiologist', rating: 4.9, totalPatients: 1247, revenue: 184500, avatar: 'SJ' },
  { id: '2', name: 'Dr. Michael Chen', role: 'Neurologist', rating: 4.8, totalPatients: 982, revenue: 147300, avatar: 'MC' },
  { id: '3', name: 'City General Hospital', role: 'Hospital', rating: 4.7, totalPatients: 5840, revenue: 892000, avatar: 'CG' },
  { id: '4', name: 'MediCare Pharmacy', role: 'Pharmacy', rating: 4.9, totalPatients: 3421, revenue: 456000, avatar: 'MP' },
];

const bloodAlerts: BloodAlert[] = [
  { id: '1', bloodBank: 'City Blood Bank', bloodGroup: 'O-', status: 'critical', unitsLeft: 3 },
  { id: '2', bloodBank: 'Red Cross', bloodGroup: 'A+', status: 'low', unitsLeft: 8 },
  { id: '3', bloodBank: 'LifeSave Center', bloodGroup: 'B-', status: 'critical', unitsLeft: 2 },
  { id: '4', bloodBank: 'Plasma Center', bloodGroup: 'AB+', status: 'normal', unitsLeft: 25 },
];

const feedbacks: FeedbackItem[] = [
  { id: '1', userName: 'Michael Brown', subject: 'Appointment Delay', message: 'Had to wait 45 minutes beyond scheduled time', priority: 'high', status: 'pending', timestamp: '1 hour ago' },
  { id: '2', userName: 'Dr. Sarah Johnson', subject: 'System Performance', message: 'The EMR system is running slow during peak hours...', priority: 'urgent', status: 'pending', timestamp: '2 hours ago' },
  { id: '3', userName: 'Emma Wilson', subject: 'Excellent Service', message: 'Dr. Johnson was very professional and thorough', priority: 'low', status: 'resolved', timestamp: '5 hours ago' },
  { id: '4', userName: 'Robert Chen', subject: 'Payment Issue', message: 'Double charged for consultation visit', priority: 'urgent', status: 'pending', timestamp: '8 hours ago' },
];

// ============================================
// MAIN ADMIN DASHBOARD
// ============================================
const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'today' | 'week' | 'month' | 'year'>('month');
  const [selectedChart, setSelectedChart] = useState<'users' | 'appointments' | 'revenue'>('users');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/login');
    }
    loadStats();
  }, [user, navigate]);

  const loadStats = async () => {
    setIsLoading(true);
    setStats({
      totalUsers: 12847,
      totalDoctors: 1234,
      totalHospitals: 156,
      totalPharmacies: 432,
      totalBloodDonors: 5231,
      totalAppointments: 45200,
      activeUsers: 3245,
      newUsersToday: 47,
      newUsersThisMonth: 1250,
      verifiedDoctors: 1189,
      pendingVerifications: 45,
      blockedUsers: 23,
      totalDonations: 15234,
      totalBloodUnits: 18456,
      livesSaved: 54321,
      totalRevenue: 72500,
      monthlyGrowth: 18.5
    });
    setIsLoading(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getNotificationIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'warning': return <AlertCircle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  const severityVariant = (severity: string): 'success' | 'warning' | 'danger' | 'default' | 'info' => {
    switch(severity) {
      case 'critical': return 'danger';
      case 'warning': return 'warning';
      case 'success': return 'success';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  const priorityVariant = (priority: string): 'success' | 'warning' | 'danger' | 'default' | 'info' => {
    switch(priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'critical': return 'danger';
      case 'low': return 'warning';
      case 'normal': return 'success';
      default: return 'default' as const;
    }
  };

  const feedbackStatusVariant = (status: string): 'success' | 'warning' | 'danger' | 'default' | 'info' => {
    switch(status) {
      case 'resolved': return 'success';
      case 'reviewed': return 'info';
      case 'pending': return 'warning';
      case 'closed': return 'default';
      default: return 'default';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#050508] via-[#0a0a14] to-[#050508] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/60">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const getChartComponent = () => {
    switch(selectedChart) {
      case 'users':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
              <Legend />
              <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" />
              <Area type="monotone" dataKey="active" stroke="#10B981" fillOpacity={1} fill="url(#colorActive)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'appointments':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="appointments" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              <Bar dataKey="consultations" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ReLineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#ffffff40" />
              <YAxis stroke="#ffffff40" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B' }} />
              <Line type="monotone" dataKey="expenses" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444' }} />
            </ReLineChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050508] via-[#0a0a14] to-[#050508]">
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-20'
      } bg-white/[0.02] backdrop-blur-xl border-r border-white/[0.06]`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
            <div className={`flex items-center gap-3 ${!isSidebarOpen && 'justify-center w-full'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl blur-lg opacity-50" />
                <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
              </div>
              {isSidebarOpen && (
                <span className="text-white font-bold text-lg bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                  Aetherion
                </span>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 transition-all"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Admin Profile */}
          <div className="p-4 border-b border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">
                    {user?.fullName?.charAt(0) || 'A'}
                  </span>
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0a14] animate-pulse" />
              </div>
              {isSidebarOpen && (
                <div>
                  <p className="text-white font-semibold text-sm">{user?.fullName || 'Admin User'}</p>
                  <p className="text-cyan-400 text-xs">Super Administrator</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={index}
                  whileHover={{ x: 5 }}
                  onClick={() => navigate(action.path)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-white/60 hover:text-white hover:bg-white/[0.04] transition-all ${
                    !isSidebarOpen && 'justify-center'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {isSidebarOpen && <span className="text-sm">{action.title}</span>}
                </motion.button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/[0.06]">
            <motion.button
              whileHover={{ x: -5 }}
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all ${
                !isSidebarOpen && 'justify-center'
              }`}
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span className="text-sm">Logout</span>}
            </motion.button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white/[0.02] backdrop-blur-xl border-b border-white/[0.06]">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder="Search users, doctors, activities..."
                  className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/20 outline-none focus:border-cyan-400/50 focus:ring-1 focus:ring-cyan-400/50 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Time Range Selector */}
              <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                {(['today', 'week', 'month', 'year'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-3 py-1 rounded-lg text-xs transition-all ${
                      selectedTimeRange === range
                        ? 'bg-cyan-500/20 text-cyan-400'
                        : 'text-white/40 hover:text-white/60'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/60 hover:text-white/90 transition-all"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                </button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-96 rounded-2xl bg-[#0a0a14] border border-white/[0.08] shadow-2xl overflow-hidden z-50"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                        <h4 className="text-white font-semibold">Notifications</h4>
                        <button onClick={() => toast.success('All notifications marked as read')} className="text-xs text-cyan-400 hover:text-cyan-300">
                          Mark all read
                        </button>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.map((notification) => (
                          <div key={notification.id} className={`p-4 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${!notification.isRead ? 'bg-cyan-500/5' : ''}`}>
                            <div className="flex items-start gap-3">
                              {getNotificationIcon(notification.type)}
                              <div className="flex-1">
                                <p className="text-white text-sm font-medium">{notification.title}</p>
                                <p className="text-white/40 text-xs mt-1">{notification.message}</p>
                                <p className="text-white/20 text-[10px] mt-1">{notification.timestamp}</p>
                              </div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-cyan-400 rounded-full" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Admin Profile */}
              <div className="flex items-center gap-3 pl-3 border-l border-white/[0.06]">
                <div className="text-right hidden sm:block">
                  <p className="text-white text-sm font-medium">{user?.fullName || 'Admin User'}</p>
                  <p className="text-cyan-400 text-xs">Super Admin</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">
                    {user?.fullName?.charAt(0) || 'A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="p-6">
          {/* Welcome Banner */}
          <GlassmorphicCard variant="premium" padding="lg" rounded="2xl" border="subtle" className="mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-transparent" />
            <div className="relative flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Welcome back, {user?.fullName?.split(' ')[0] || 'Admin'}! 👋
                </h1>
                <p className="text-white/40 text-sm">
                  Here's what's happening with your healthcare platform today.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="glass" size="sm" leftIcon={Download}>Export Report</Button>
                <Button variant="gradient" size="sm">View Analytics</Button>
              </div>
            </div>
          </GlassmorphicCard>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 mb-8">
            {statsCards.map((card, index) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onHoverStart={() => setHoveredCard(card.title)}
                  onHoverEnd={() => setHoveredCard(null)}
                  className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 group hover:bg-white/[0.04] transition-all cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <Badge variant={card.trend === 'up' ? 'success' : 'danger'} size="xs" dot>
                        <span className="flex items-center gap-0.5">
                          {card.trend === 'up' ? <ArrowUp className="w-2 h-2" /> : <ArrowDown className="w-2 h-2" />}
                          {card.change}
                        </span>
                      </Badge>
                    </div>
                    <motion.p 
                      className="text-white text-xl font-bold"
                      animate={{ scale: hoveredCard === card.title ? 1.05 : 1 }}
                    >
                      {card.value}
                    </motion.p>
                    <p className="text-white/40 text-[10px] mt-1">{card.title}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Main Chart */}
            <Card variant="glass" padding="lg" rounded="2xl" className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" />
                  Analytics Overview
                </h3>
                <div className="flex gap-2">
                  {(['users', 'appointments', 'revenue'] as const).map((chart) => (
                    <Button
                      key={chart}
                      variant={selectedChart === chart ? 'neon' : 'ghost'}
                      size="xs"
                      onClick={() => setSelectedChart(chart)}
                    >
                      {chart.charAt(0).toUpperCase() + chart.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
              {getChartComponent()}
            </Card>

            {/* Doctor Distribution Pie Chart */}
            <Card variant="glass" padding="lg" rounded="2xl">
              <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                <LucidePieChart className="w-5 h-5 text-purple-400" />
                Doctor Distribution
              </h3>
              <ResponsiveContainer width="100%" height={250}>
                <RePieChart>
                  <Pie
                    data={doctorDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {doctorDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                  <Legend />
                </RePieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {doctorDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-white/60 text-xs">{item.name}</span>
                    <span className="text-white text-xs ml-auto">{item.value}%</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - 2 cols */}
            <div className="lg:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {quickActions.slice(0, 4).map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <motion.button
                      key={action.title}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      whileHover={{ y: -5 }}
                      onClick={() => navigate(action.path)}
                      className="relative p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all group overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                      <Icon className={`w-6 h-6 bg-gradient-to-r ${action.color} bg-clip-text text-transparent mb-2`} />
                      <p className="text-white text-xs font-medium">{action.title}</p>
                      <ChevronRight className="absolute bottom-3 right-3 w-3 h-3 text-white/20 group-hover:text-white/40 transition-all" />
                    </motion.button>
                  );
                })}
              </div>

              {/* Top Performers */}
              <Card variant="glass" padding="none" rounded="2xl" className="overflow-hidden">
                <div className="p-6 border-b border-white/[0.06]">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Award className="w-5 h-5 text-yellow-400" />
                    Top Performers
                  </h3>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {topPerformers.map((performer) => (
                    <div key={performer.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">{performer.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-white font-medium text-sm">{performer.name}</p>
                          <p className="text-white/40 text-xs">{performer.role}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                            <span className="text-white text-sm">{performer.rating}</span>
                          </div>
                          <p className="text-white/40 text-xs">{performer.totalPatients} patients</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Activities */}
              <Card variant="glass" padding="none" rounded="2xl" className="overflow-hidden">
                <div className="p-6 border-b border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <Activity className="w-5 h-5 text-cyan-400" />
                      Recent Activities
                    </h3>
                    <Button variant="ghost" size="xs">View All</Button>
                  </div>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white text-sm font-medium">{activity.userName}</p>
                            <Badge variant={severityVariant(activity.severity)} size="xs">
                              {activity.severity}
                            </Badge>
                          </div>
                          <p className="text-white/40 text-xs">{activity.action}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <p className="text-white/20 text-[10px]">{activity.timestamp}</p>
                            {activity.ipAddress && (
                              <p className="text-white/20 text-[10px]">{activity.ipAddress}</p>
                            )}
                          </div>
                        </div>
                        <button className="p-1 hover:bg-white/[0.04] rounded-lg transition-colors">
                          <MoreVertical className="w-4 h-4 text-white/30" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Right Column - 1 col */}
            <div className="space-y-6">
              {/* Blood Stock Alerts */}
              <Card variant="glass" padding="none" rounded="2xl" className="overflow-hidden bg-gradient-to-br from-red-500/10 to-rose-500/10 border-red-500/20">
                <div className="p-6 border-b border-red-500/20">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-red-400 animate-pulse" />
                    Blood Stock Alerts
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {bloodAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium text-sm">{alert.bloodBank}</span>
                        <Badge variant={getStatusBadge(alert.status)} size="xs" dot>
                          {alert.status === 'critical' ? 'CRITICAL' : alert.status === 'low' ? 'LOW' : 'NORMAL'}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-white">{alert.bloodGroup}</span>
                        <span className="text-red-400 text-sm font-medium">{alert.unitsLeft} units left</span>
                      </div>
                      {alert.status === 'critical' && (
                        <Button variant="danger" size="xs" fullWidth className="mt-3">
                          Request Emergency Supply
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>

              {/* System Health Monitor */}
              <Card variant="glass" padding="lg" rounded="2xl">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                  <Server className="w-5 h-5 text-green-400" />
                  System Health
                </h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/40 text-xs">CPU Usage</span>
                      <span className="text-white text-sm font-medium">35%</span>
                    </div>
                    <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full w-[35%] bg-gradient-to-r from-green-500 to-cyan-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/40 text-xs">Memory Usage</span>
                      <span className="text-white text-sm font-medium">62%</span>
                    </div>
                    <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full w-[62%] bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full" />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-white/40 text-xs">Storage</span>
                      <span className="text-white text-sm font-medium">42%</span>
                    </div>
                    <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                      <div className="h-full w-[42%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/[0.06]">
                    <div className="text-center">
                      <p className="text-white/40 text-xs">Uptime</p>
                      <p className="text-white text-lg font-bold">99.9%</p>
                    </div>
                    <div className="text-center">
                      <p className="text-white/40 text-xs">Response Time</p>
                      <p className="text-white text-lg font-bold">124ms</p>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Recent Feedbacks */}
              <Card variant="glass" padding="none" rounded="2xl" className="overflow-hidden">
                <div className="p-6 border-b border-white/[0.06]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-white font-semibold flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-yellow-400" />
                      Recent Feedbacks
                    </h3>
                    <Button variant="ghost" size="xs">View All</Button>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white text-sm font-medium">{feedback.userName}</span>
                        <div className="flex items-center gap-1.5">
                          <Badge variant={feedbackStatusVariant(feedback.status)} size="xs">
                            {feedback.status}
                          </Badge>
                          <Badge variant={priorityVariant(feedback.priority)} size="xs">
                            {feedback.priority.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-white/60 text-xs mb-1">{feedback.subject}</p>
                      <p className="text-white/40 text-[10px] line-clamp-2">{feedback.message}</p>
                      <p className="text-white/20 text-[10px] mt-1">{feedback.timestamp}</p>
                      <div className="flex gap-2 mt-3">
                        <Button variant="glass" size="xs" className="flex-1">Resolve</Button>
                        <Button variant="ghost" size="xs" className="flex-1">Reply</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;