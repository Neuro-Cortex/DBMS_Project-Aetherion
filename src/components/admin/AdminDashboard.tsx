// src/pages/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield, Users, UserCheck, Building2, Pill,
  Droplet, Calendar, TrendingUp, Activity, AlertCircle, 
  Bell, Settings, FileText, MessageSquare, Radio, Zap,
  Server, Clock, HardDrive, Cpu, Wifi, LogOut, Menu, X,
  Search, ChevronRight, Eye, CheckCircle, XCircle, Clock as ClockIcon,
  Heart, Stethoscope, Syringe, ClipboardList
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';

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
  verifiedDoctors: number;
  pendingVerifications: number;
  totalDonations: number;
  totalBloodUnits: number;
  livesSaved: number;
}

interface ActivityItem {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

interface BloodAlert {
  id: string;
  bloodBank: string;
  bloodGroup: string;
  status: 'critical' | 'low' | 'normal';
  unitsLeft: number;
}

interface FeedbackItem {
  id: string;
  userName: string;
  subject: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: string;
}

// ============================================
// STATIC DATA
// ============================================
const statsCards = [
  { title: 'Total Users', value: '12,847', change: '+12.5%', icon: Users, color: 'from-blue-500 to-cyan-500' },
  { title: 'Active Doctors', value: '1,234', change: '+8.2%', icon: Stethoscope, color: 'from-emerald-500 to-teal-500' },
  { title: 'Hospitals', value: '156', change: '+3', icon: Building2, color: 'from-purple-500 to-violet-500' },
  { title: 'Pharmacies', value: '432', change: '+5', icon: Pill, color: 'from-amber-500 to-orange-500' },
  { title: 'Blood Donors', value: '5,231', change: '+15%', icon: Droplet, color: 'from-red-500 to-rose-500' },
  { title: 'Appointments', value: '45.2K', change: '+22%', icon: Calendar, color: 'from-indigo-500 to-blue-500' },
  { title: 'Lives Saved', value: '54,321', change: '+1,234', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { title: 'Active Sessions', value: '3,245', change: '+432', icon: Activity, color: 'from-green-500 to-emerald-500' }
];

const recentActivities: ActivityItem[] = [
  { id: '1', userName: 'Dr. Sarah Johnson', userRole: 'doctor', action: 'New patient appointment scheduled', timestamp: '2 min ago', severity: 'info' },
  { id: '2', userName: 'City Hospital', userRole: 'hospital', action: 'Updated bed availability (45 beds available)', timestamp: '15 min ago', severity: 'info' },
  { id: '3', userName: 'John Patient', userRole: 'patient', action: 'Medical records requested', timestamp: '1 hour ago', severity: 'warning' },
  { id: '4', userName: 'MediCare Pharmacy', userRole: 'pharmacy', action: 'Low stock alert: Paracetamol', timestamp: '2 hours ago', severity: 'critical' },
  { id: '5', userName: 'Blood Bank', userRole: 'blood-donor', action: 'Emergency: O- blood needed', timestamp: '3 hours ago', severity: 'critical' }
];

const bloodAlerts: BloodAlert[] = [
  { id: '1', bloodBank: 'City Blood Bank', bloodGroup: 'O-', status: 'critical', unitsLeft: 3 },
  { id: '2', bloodBank: 'Red Cross', bloodGroup: 'A+', status: 'low', unitsLeft: 8 },
  { id: '3', bloodBank: 'LifeSave Center', bloodGroup: 'B-', status: 'critical', unitsLeft: 2 }
];

const feedbacks: FeedbackItem[] = [
  { id: '1', userName: 'Michael Brown', subject: 'Appointment Delay', message: 'Had to wait 45 minutes beyond scheduled time', priority: 'high', status: 'pending' },
  { id: '2', userName: 'Emma Wilson', subject: 'Excellent Service', message: 'Dr. Johnson was very professional', priority: 'low', status: 'resolved' },
  { id: '3', userName: 'Robert Chen', subject: 'Payment Issue', message: 'Double charged for consultation', priority: 'urgent', status: 'pending' }
];

// ============================================
// QUICK ACTIONS
// ============================================
const quickActions = [
  { title: 'User Management', icon: Users, path: '/admin/users', color: 'from-blue-500 to-cyan-500' },
  { title: 'Doctor Verification', icon: UserCheck, path: '/admin/doctors/verify', color: 'from-emerald-500 to-teal-500' },
  { title: 'Emergency Monitor', icon: Syringe, path: '/admin/emergency', color: 'from-red-500 to-rose-500' },
  { title: 'Blood Bank', icon: Droplet, path: '/admin/blood-bank', color: 'from-red-500 to-pink-500' },
  { title: 'Hospital Management', icon: Building2, path: '/admin/hospitals', color: 'from-purple-500 to-violet-500' },
  { title: 'Pharmacy Control', icon: Pill, path: '/admin/pharmacies', color: 'from-amber-500 to-orange-500' },
  { title: 'Security Settings', icon: Shield, path: '/admin/security', color: 'from-slate-500 to-gray-500' },
  { title: 'System Analytics', icon: TrendingUp, path: '/admin/analytics', color: 'from-indigo-500 to-blue-500' }
];

// ============================================
// MAIN ADMIN DASHBOARD
// ============================================
const AdminDashboard: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
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
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStats({
      totalUsers: 12847,
      totalDoctors: 1234,
      totalHospitals: 156,
      totalPharmacies: 432,
      totalBloodDonors: 5231,
      totalAppointments: 45200,
      activeUsers: 3245,
      newUsersToday: 47,
      verifiedDoctors: 1189,
      pendingVerifications: 45,
      totalDonations: 15234,
      totalBloodUnits: 18456,
      livesSaved: 54321
    });
    setIsLoading(false);
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      default: return 'text-green-400 bg-green-500/10 border-green-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'critical': return 'text-red-400 bg-red-500/10';
      case 'low': return 'text-orange-400 bg-orange-500/10';
      default: return 'text-green-400 bg-green-500/10';
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              {isSidebarOpen && (
                <span className="text-white font-bold text-lg">Aetherion</span>
              )}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70"
            >
              {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-6 space-y-1">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-white/60 hover:text-white hover:bg-white/[0.04] transition-all ${
                    !isSidebarOpen && 'justify-center'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {isSidebarOpen && <span className="text-sm">{action.title}</span>}
                </button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-white/[0.06]">
            <button
              onClick={handleLogout}
              className={`w-full flex items-center gap-3 px-4 py-3 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all ${
                !isSidebarOpen && 'justify-center'
              }`}
            >
              <LogOut className="w-5 h-5" />
              {isSidebarOpen && <span className="text-sm">Logout</span>}
            </button>
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
                  className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/20 outline-none focus:border-cyan-400/50 transition-all"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/60 hover:text-white/90"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                </button>
                
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-80 rounded-2xl bg-[#0a0a14] border border-white/[0.08] shadow-2xl overflow-hidden"
                    >
                      <div className="p-4 border-b border-white/[0.06]">
                        <h4 className="text-white font-semibold">Notifications</h4>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {recentActivities.slice(0, 3).map((activity) => (
                          <div key={activity.id} className="p-4 border-b border-white/[0.04] hover:bg-white/[0.02]">
                            <p className="text-white text-sm">{activity.userName}</p>
                            <p className="text-white/40 text-xs mt-1">{activity.action}</p>
                            <p className="text-white/20 text-[10px] mt-1">{activity.timestamp}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-3 pl-3 border-l border-white/[0.06]">
                <div className="text-right hidden sm:block">
                  <p className="text-white text-sm font-medium">{user?.fullName || 'Admin User'}</p>
                  <p className="text-white/40 text-xs">Super Admin</p>
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
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-white/[0.06]"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Welcome back, {user?.fullName?.split(' ')[0] || 'Admin'}!
                </h1>
                <p className="text-white/40 text-sm">
                  Here's what's happening with your healthcare platform today.
                </p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/60 hover:text-white/90 text-sm flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Export Report
                </button>
                <button className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium shadow-lg shadow-cyan-500/25">
                  View Analytics
                </button>
              </div>
            </div>
          </motion.div>

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
                  className="relative overflow-hidden rounded-2xl bg-white/[0.02] border border-white/[0.06] p-4 group hover:bg-white/[0.04] transition-all"
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-3">
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-[10px] text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded-full">
                        {card.change}
                      </span>
                    </div>
                    <p className="text-white text-xl font-bold">{card.value}</p>
                    <p className="text-white/40 text-[10px] mt-1">{card.title}</p>
                  </div>
                </motion.div>
              );
            })}
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

              {/* Recent Activities */}
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                <div className="p-6 border-b border-white/[0.06]">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Recent Activities
                  </h3>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-white text-sm font-medium">{activity.userName}</p>
                          <p className="text-white/40 text-xs mt-1">{activity.action}</p>
                        </div>
                        <div className="text-right">
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            activity.severity === 'critical' ? 'bg-red-500/10 text-red-400' :
                            activity.severity === 'warning' ? 'bg-yellow-500/10 text-yellow-400' :
                            'bg-green-500/10 text-green-400'
                          }`}>
                            {activity.severity}
                          </span>
                          <p className="text-white/20 text-[10px] mt-1">{activity.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - 1 col */}
            <div className="space-y-6">
              {/* Blood Stock Alerts */}
              <div className="rounded-2xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/20 overflow-hidden">
                <div className="p-6 border-b border-red-500/20">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <Droplet className="w-5 h-5 text-red-400" />
                    Blood Stock Alerts
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {bloodAlerts.map((alert) => (
                    <div key={alert.id} className="p-3 rounded-xl bg-red-500/5 border border-red-500/10">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-white font-medium text-sm">{alert.bloodBank}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${getStatusColor(alert.status)}`}>
                          {alert.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-2xl font-bold text-white">{alert.bloodGroup}</span>
                        <span className="text-red-400 text-sm">{alert.unitsLeft} units left</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Feedbacks */}
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden">
                <div className="p-6 border-b border-white/[0.06]">
                  <h3 className="text-white font-semibold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-yellow-400" />
                    Recent Feedbacks
                  </h3>
                </div>
                <div className="p-4 space-y-3">
                  {feedbacks.map((feedback) => (
                    <div key={feedback.id} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-white text-sm font-medium">{feedback.userName}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full ${getPriorityColor(feedback.priority)}`}>
                          {feedback.priority}
                        </span>
                      </div>
                      <p className="text-white/60 text-xs mb-2">{feedback.subject}</p>
                      <p className="text-white/40 text-[10px] line-clamp-2">{feedback.message}</p>
                      <div className="flex gap-2 mt-3">
                        <button className="text-[10px] px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 hover:bg-cyan-500/30 transition-colors">
                          Resolve
                        </button>
                        <button className="text-[10px] px-3 py-1 rounded-lg bg-white/[0.05] text-white/60 hover:bg-white/[0.1] transition-colors">
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Status */}
              <div className="rounded-2xl bg-white/[0.02] border border-white/[0.06] p-6">
                <h3 className="text-white font-semibold flex items-center gap-2 mb-4">
                  <Server className="w-5 h-5 text-green-400" />
                  System Status
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 text-xs">API Response</span>
                    <span className="text-white text-sm">124ms</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full w-[96%] bg-gradient-to-r from-green-500 to-cyan-500 rounded-full" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 text-xs">Uptime</span>
                    <span className="text-white text-sm">99.9%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full w-[99.9%] bg-gradient-to-r from-emerald-500 to-green-500 rounded-full" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/40 text-xs">Storage</span>
                    <span className="text-white text-sm">42%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full w-[42%] bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;