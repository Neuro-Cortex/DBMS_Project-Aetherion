import { getAuthToken } from '../../services/api';
// src/components/admin/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate,  } from 'react-router-dom';



import {
  Search, Bell, 
   Zap,
  Users, Stethoscope, Building2, Pill, Calendar,
  AlertCircle, Brain, FileText, DollarSign, Shield,
  Activity, Server,
   PieChart, Crown,
   UserPlus, UserCheck,
  Droplets, MessageSquare, Bot, MapPin, Heart, Sparkles,
  Star,
  TrendingUp,
} from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart as ReLineChart, Line
} from 'recharts';
import AdminSidebar from './AdminSidebar';
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Input } from 'src/ui/Input';

interface SystemStats { totalUsers: number; totalDoctors: number; totalPatients: number; totalPharmacies: number; totalHospitals: number; totalAppointments: number; totalRevenue: number; emergencyCases: number; activeUsers: number; systemUptime: number; pendingVerifications: number; totalBloodDonors: number; livesSaved: number; }
interface ActivityItem { id: string; user: string; action: string; type: string; time: string; status: string; }
interface NotificationItem { id: string; title: string; message: string; type: 'info'|'success'|'warning'|'error'; timestamp: string; isRead: boolean; }
interface TopPerformer { id: string; name: string; role: string; rating: number; totalPatients: number; revenue: number; avatar: string; }
interface BloodAlert { id: string; bloodBank: string; bloodGroup: string; unitsLeft: number; status: 'critical'|'low'|'normal'; }
interface FeedbackItem { id: string; userName: string; subject: string; message: string; priority: 'low'|'medium'|'high'|'urgent'; status: 'pending'|'reviewed'|'resolved'|'closed'; timestamp: string; }

const userGrowthData = [{ month: 'Jan', users: 12000, active: 8900 },{ month: 'Feb', users: 12500, active: 9200 },{ month: 'Mar', users: 13100, active: 9600 },{ month: 'Apr', users: 13800, active: 10100 },{ month: 'May', users: 14500, active: 10700 },{ month: 'Jun', users: 15200, active: 11300 }];
const appointmentData = [{ day: 'Mon', appointments: 450, consultations: 380 },{ day: 'Tue', appointments: 520, consultations: 430 },{ day: 'Wed', appointments: 480, consultations: 410 },{ day: 'Thu', appointments: 550, consultations: 460 },{ day: 'Fri', appointments: 600, consultations: 510 },{ day: 'Sat', appointments: 350, consultations: 290 },{ day: 'Sun', appointments: 200, consultations: 160 }];
const revenueData = [{ month: 'Jan', revenue: 45000, expenses: 32000 },{ month: 'Feb', revenue: 52000, expenses: 35000 },{ month: 'Mar', revenue: 48000, expenses: 33000 },{ month: 'Apr', revenue: 58000, expenses: 38000 },{ month: 'May', revenue: 65000, expenses: 42000 },{ month: 'Jun', revenue: 72000, expenses: 45000 }];
const doctorDistribution = [{ name: 'Cardiology', value: 25, color: '#3B82F6' },{ name: 'Neurology', value: 18, color: '#10B981' },{ name: 'Pediatrics', value: 22, color: '#F59E0B' },{ name: 'Orthopedics', value: 20, color: '#EF4444' },{ name: 'Dermatology', value: 15, color: '#8B5CF6' }];

const systemStats: SystemStats = { totalUsers: 15234, totalDoctors: 450, totalPatients: 12847, totalPharmacies: 320, totalHospitals: 85, totalAppointments: 8453, totalRevenue: 2840000, emergencyCases: 67, activeUsers: 1247, systemUptime: 99.99, pendingVerifications: 23, totalBloodDonors: 5231, livesSaved: 54321 };
const recentActivities: ActivityItem[] = [
  { id: '1', user: 'Dr. Sarah Wilson', action: 'New doctor registered', type: 'doctor', time: '2 min ago', status: 'pending' },
  { id: '2', user: 'MediPlus Pharmacy', action: 'License verification requested', type: 'pharmacy', time: '15 min ago', status: 'pending' },
  { id: '3', user: 'Rahima Khatun', action: 'Emergency SOS activated', type: 'emergency', time: '30 min ago', status: 'resolved' },
  { id: '4', user: 'Admin User', action: 'System backup completed', type: 'system', time: '1 hour ago', status: 'success' },
  { id: '5', user: 'Dr. James Lee', action: 'Account suspended - complaint', type: 'doctor', time: '2 hours ago', status: 'flagged' },
];
const notifications: NotificationItem[] = [
  { id: '1', title: 'New User Registration', message: 'John Doe registered as a patient', type: 'info', timestamp: '5 min ago', isRead: false },
  { id: '2', title: 'Doctor Verification', message: 'Dr. Smith needs verification', type: 'warning', timestamp: '30 min ago', isRead: false },
  { id: '3', title: 'System Update Complete', message: 'Version 2.1.0 deployed', type: 'success', timestamp: '2 hours ago', isRead: true },
  { id: '4', title: 'Security Alert', message: 'Multiple failed login attempts', type: 'error', timestamp: '3 hours ago', isRead: false },
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
  { id: '2', userName: 'Dr. Sarah Johnson', subject: 'System Performance', message: 'The EMR system is running slow...', priority: 'urgent', status: 'pending', timestamp: '2 hours ago' },
  { id: '3', userName: 'Emma Wilson', subject: 'Excellent Service', message: 'Dr. Johnson was very professional', priority: 'low', status: 'resolved', timestamp: '5 hours ago' },
  { id: '4', userName: 'Robert Chen', subject: 'Payment Issue', message: 'Double charged for consultation', priority: 'urgent', status: 'pending', timestamp: '8 hours ago' },
];

const statCards = [
  { icon: Users, label: 'Total Users', value: systemStats.totalUsers.toLocaleString(), color: 'blue', change: '+12%', trend: 'up' },
  { icon: Stethoscope, label: 'Doctors', value: systemStats.totalDoctors, color: 'teal', change: '+8%', trend: 'up' },
  { icon: UserCheck, label: 'Patients', value: systemStats.totalPatients.toLocaleString(), color: 'emerald', change: '+15%', trend: 'up' },
  { icon: Pill, label: 'Pharmacies', value: systemStats.totalPharmacies, color: 'amber', change: '+5%', trend: 'up' },
  { icon: Building2, label: 'Hospitals', value: systemStats.totalHospitals, color: 'purple', change: '+3%', trend: 'up' },
  { icon: Calendar, label: 'Appointments', value: systemStats.totalAppointments.toLocaleString(), color: 'cyan', change: '+10%', trend: 'up' },
  { icon: DollarSign, label: 'Revenue', value: `$${(systemStats.totalRevenue / 1000000).toFixed(2)}M`, color: 'green', change: '+18%', trend: 'up' },
  { icon: AlertCircle, label: 'Emergency', value: systemStats.emergencyCases, color: 'red', change: '-5%', trend: 'down' },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400', teal: 'bg-teal-500/10 text-teal-400',
  purple: 'bg-purple-500/10 text-purple-400', amber: 'bg-amber-500/10 text-amber-400',
  green: 'bg-green-500/10 text-green-400', red: 'bg-red-500/10 text-red-400',
  cyan: 'bg-cyan-500/10 text-cyan-400', emerald: 'bg-emerald-500/10 text-emerald-400',
  indigo: 'bg-indigo-500/10 text-indigo-400', slate: 'bg-slate-500/10 text-slate-400',
  pink: 'bg-pink-500/10 text-pink-400', rose: 'bg-rose-500/10 text-rose-400',
};

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [selectedChart, setSelectedChart] = useState<'users'|'appointments'|'revenue'>('users');
  const [activeTab, setActiveTab] = useState<'overview'|'smart'>('overview');
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/admin/dashboard`,
          { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        const data = await res.json();
        if (data.stats) {
          setDashboardData(data);
          // Update stat cards with real data
          const s = data.stats;
          statCards[0].value = (s.total_users || 0).toLocaleString();
          statCards[1].value = s.total_doctors || 0;
          statCards[2].value = (s.total_users || 0).toLocaleString();
          statCards[3].value = s.total_pharmacies || 0;
          statCards[4].value = s.total_hospitals || 0;
          statCards[5].value = (s.total_appointments || 0).toLocaleString();
          statCards[6].value = `$${((s.total_appointments || 0) * 50).toLocaleString()}`;
          statCards[7].value = (data.active_emergencies?.length || 0);
        }
      } catch (err) {
        console.error('Failed to fetch dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getChartComponent = () => {
    switch(selectedChart) {
      case 'users':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={userGrowthData}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/><stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/></linearGradient>
                <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#ffffff40" /><YAxis stroke="#ffffff40" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
              <Legend />
              <Area type="monotone" dataKey="users" stroke="#3B82F6" fillOpacity={1} fill="url(#colorUsers)" />
              <Area type="monotone" dataKey="active" stroke="#10B981" fillOpacity={1} fill="url(#colorActive)" />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'appointments':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#ffffff40" /><YAxis stroke="#ffffff40" />
              <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
              <Legend />
              <Bar dataKey="appointments" fill="#3B82F6" radius={[8,8,0,0]} />
              <Bar dataKey="consultations" fill="#10B981" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'revenue':
        return (
          <ResponsiveContainer width="100%" height={280}>
            <ReLineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#ffffff40" /><YAxis stroke="#ffffff40" />
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
    <div className="min-h-screen bg-[#020408] flex">
      <AdminSidebar unreadCount={unreadCount} />

      <div className="flex-1 min-w-0">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* HEADER */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                <Shield className="w-8 h-8 text-amber-400" /> {greeting}, <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Admin</span>
              </h1>
              <p className="text-slate-400 text-sm mt-1">{currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} • {currentTime.toLocaleTimeString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <Input placeholder="Search..." leftIcon={Search} className="w-56" />
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all">
                  <Bell className="w-5 h-5 text-slate-400" />
                  {unreadCount > 0 && <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">{unreadCount}</span>}
                </button>
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-white/[0.08] shadow-2xl overflow-hidden z-50">
                      <div className="flex items-center justify-between p-4 border-b border-white/[0.06]"><h4 className="text-white font-semibold text-sm">Notifications</h4><Badge variant="danger" className="text-[10px]">{unreadCount} New</Badge></div>
                      <div className="max-h-72 overflow-y-auto">
                        {notifications.map((n) => (
                          <div key={n.id} className={`p-3 border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors ${!n.isRead ? 'bg-cyan-500/5' : ''}`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-2 h-2 rounded-full mt-1.5 ${n.type==='success'?'bg-green-400':n.type==='warning'?'bg-amber-400':n.type==='error'?'bg-red-400':'bg-blue-400'}`} />
                              <div className="flex-1"><p className="text-white text-xs font-medium">{n.title}</p><p className="text-slate-400 text-[10px] mt-0.5">{n.message}</p><p className="text-slate-500 text-[10px] mt-1">{n.timestamp}</p></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <Button variant="danger" size="sm" className="animate-pulse bg-gradient-to-r from-red-500 to-rose-500" onClick={() => navigate('/admin/emergency')}>
                <AlertCircle className="w-4 h-4 mr-1.5" /> Emergency
              </Button>
            </div>
          </motion.div>

          {/* TABS - Overview / Smart Features */}
          <div className="flex gap-2 border-b border-white/[0.06] pb-2">
            <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'overview' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}>
              <Activity className="w-4 h-4 inline mr-1.5" /> Overview
            </button>
            <button onClick={() => setActiveTab('smart')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'smart' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'text-slate-400 hover:text-white'}`}>
              <Sparkles className="w-4 h-4 inline mr-1.5" /> Smart Features
            </button>
          </div>

          {activeTab === 'overview' ? (
            <>
              {/* STAT CARDS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {statCards.map((stat, i) => {
                  const Icon = stat.icon;
                  const colors = colorMap[stat.color] || ''; const [bg, text] = colors.split(' ');
                  return (
                    <Card key={i} className="p-4 text-center hover:shadow-lg transition-all group cursor-pointer">
                      <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3 group-hover:scale-110 transition-transform`}><Icon className={`w-5 h-5 ${text}`} /></div>
                      <p className="text-2xl font-black text-white">{stat.value}</p><p className="text-xs text-slate-400">{stat.label}</p>
                      <p className={`text-[10px] mt-1 font-bold ${stat.trend==='up'?'text-emerald-400':'text-red-400'}`}>{stat.trend==='up'?'↑':'↓'} {stat.change}</p>
                    </Card>
                  );
                })}
              </div>

              {/* CHARTS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GlassmorphicCard className="lg:col-span-2 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2"><TrendingUp className="w-5 h-5 text-cyan-400" /> Analytics</h3>
                    <div className="flex gap-1">
                      {(['users','appointments','revenue'] as const).map((c) => (
                        <Button key={c} variant={selectedChart===c?'primary':'ghost'} size="xs" onClick={()=>setSelectedChart(c)} className={selectedChart===c?'bg-cyan-500':''}>{c.charAt(0).toUpperCase()+c.slice(1)}</Button>
                      ))}
                    </div>
                  </div>
                  {getChartComponent()}
                </GlassmorphicCard>

                <GlassmorphicCard className="p-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><PieChart className="w-5 h-5 text-purple-400" /> Doctor Distribution</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <RePieChart>
                      <Pie data={doctorDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                        {doctorDistribution.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    {doctorDistribution.map((item) => <div key={item.name} className="flex items-center gap-2"><div className="w-2 h-2 rounded-full" style={{backgroundColor:item.color}} /><span className="text-white/60 text-xs">{item.name}</span><span className="text-white text-xs ml-auto">{item.value}%</span></div>)}
                  </div>
                </GlassmorphicCard>
              </div>

              {/* QUICK ACTIONS + ACTIVITY */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <GlassmorphicCard className="p-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Zap className="w-5 h-5 text-amber-400" /> Quick Actions</h3>
                  <div className="space-y-2">
                    {[
                      { icon: UserPlus, label: 'Add User', color: 'blue', path: '/admin/users/add' },
                      { icon: Stethoscope, label: 'Verify Doctor', color: 'teal', path: '/admin/doctor-verification', badge: '23' },
                      { icon: Brain, label: 'AI Analytics', color: 'purple', path: '/admin/ai-system' },
                      { icon: DollarSign, label: 'Revenue', color: 'green', path: '/admin/revenue' },
                      { icon: AlertCircle, label: 'Emergency', color: 'red', path: '/admin/emergency', badge: '5' },
                      { icon: MessageSquare, label: 'Messages', color: 'cyan', path: '/admin/messages' },
                      { icon: Shield, label: 'Security', color: 'indigo', path: '/admin/security' },
                      { icon: FileText, label: 'Reports', color: 'slate', path: '/admin/reports' },
                    ].map((action, i) => {
                      const Icon = action.icon; const colors = colorMap[action.color] || ''; const [bg, text] = colors.split(' ');
                      return (
                        <motion.button key={i} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={() => navigate(action.path)}
                          className="relative flex items-center gap-3 w-full p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                          <div className={`p-2 rounded-xl ${bg}`}><Icon className={`w-4 h-4 ${text}`} /></div>
                          <span className="text-white text-sm font-bold">{action.label}</span>
                          {action.badge && <span className="ml-auto w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">{action.badge}</span>}
                        </motion.button>
                      );
                    })}
                  </div>
                </GlassmorphicCard>

                <div className="lg:col-span-2">
                  <GlassmorphicCard className="p-6">
                    <div className="flex items-center justify-between mb-4"><h3 className="text-white font-bold text-lg flex items-center gap-2"><Activity className="w-5 h-5 text-cyan-400" /> Recent Activity</h3><Button variant="ghost" size="xs" className="text-cyan-400" onClick={() => navigate('/admin/live-monitor')}>View Live</Button></div>
                    <div className="space-y-2">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer">
                          <div className={`p-2 rounded-xl ${activity.type==='emergency'?'bg-red-500/10':activity.type==='doctor'?'bg-blue-500/10':activity.type==='pharmacy'?'bg-amber-500/10':'bg-slate-500/10'}`}><Activity className={`w-4 h-4 ${activity.type==='emergency'?'text-red-400':'text-cyan-400'}`} /></div>
                          <div className="flex-1 min-w-0"><h4 className="text-white text-sm font-bold truncate">{activity.user}</h4><p className="text-xs text-slate-400">{activity.action}</p></div>
                          <div className="text-right"><p className="text-xs text-slate-500">{activity.time}</p><Badge variant={activity.status==='pending'?'warning':activity.status==='success'?'success':'danger'} className="text-[10px] mt-1">{activity.status}</Badge></div>
                        </div>
                      ))}
                    </div>
                  </GlassmorphicCard>
                </div>
              </div>

              {/* TOP PERFORMERS + BLOOD ALERTS */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <GlassmorphicCard className="p-6">
                    <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Crown className="w-5 h-5 text-amber-400" /> Top Performers</h3>
                    <div className="space-y-3">
                      {topPerformers.map((performer) => (
                        <div key={performer.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                          <Avatar name={performer.avatar} size="md" />
                          <div className="flex-1"><h4 className="text-white text-sm font-bold">{performer.name}</h4><p className="text-xs text-slate-400">{performer.role}</p></div>
                          <div className="text-right"><div className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" /><span className="text-white font-bold">{performer.rating}</span></div><p className="text-xs text-slate-500">{performer.totalPatients.toLocaleString()} patients</p></div>
                        </div>
                      ))}
                    </div>
                  </GlassmorphicCard>
                </div>

                <GlassmorphicCard className="p-6 bg-gradient-to-br from-red-500/5 to-transparent border-red-500/10">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Droplets className="w-5 h-5 text-red-400 animate-pulse" /> Blood Alerts</h3>
                  <div className="space-y-3">
                    {bloodAlerts.map((alert) => (
                      <div key={alert.id} className="p-3 rounded-2xl bg-red-500/5 border border-red-500/10">
                        <div className="flex justify-between mb-1"><span className="text-white text-sm font-bold">{alert.bloodBank}</span><Badge variant={alert.status==='critical'?'danger':alert.status==='low'?'warning':'success'} className="text-[10px]">{alert.status}</Badge></div>
                        <div className="flex justify-between items-center"><span className="text-2xl font-black text-white">{alert.bloodGroup}</span><span className="text-red-400 text-sm">{alert.unitsLeft} units left</span></div>
                      </div>
                    ))}
                  </div>
                </GlassmorphicCard>
              </div>
            </>
          ) : (
            /* SMART FEATURES */
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-6 cursor-pointer hover:border-cyan-500/30 transition-all" onClick={() => navigate('/admin/heatmap')}>
                  <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 mb-3"><MapPin className="w-6 h-6 text-emerald-400" /></div>
                  <h3 className="text-white font-bold text-base">Health Heatmap</h3>
                  <p className="text-xs text-slate-400 mt-1">Disease distribution & health analytics by division</p>
                  <Badge variant="info" className="text-[10px] mt-2">AI Powered</Badge>
                </Card>
                <Card className="p-6 cursor-pointer hover:border-cyan-500/30 transition-all" onClick={() => navigate('/admin/ai-system')}>
                  <div className="inline-flex p-3 rounded-xl bg-purple-500/10 mb-3"><Brain className="w-6 h-6 text-purple-400" /></div>
                  <h3 className="text-white font-bold text-base">AI Fraud Detection</h3>
                  <p className="text-xs text-slate-400 mt-1">Detect fake prescriptions & suspicious activity</p>
                  <Badge variant="danger" className="text-[10px] mt-2">12 Flagged</Badge>
                </Card>
                <Card className="p-6 cursor-pointer hover:border-cyan-500/30 transition-all" onClick={() => navigate('/admin/ai-system')}>
                  <div className="inline-flex p-3 rounded-xl bg-rose-500/10 mb-3"><Heart className="w-6 h-6 text-rose-400" /></div>
                  <h3 className="text-white font-bold text-base">Mental Health Detection</h3>
                  <p className="text-xs text-slate-400 mt-1">AI analyzes messages for mental health risks</p>
                  <Badge variant="warning" className="text-[10px] mt-2">3 Alerts</Badge>
                </Card>
                <Card className="p-6 cursor-pointer hover:border-cyan-500/30 transition-all" onClick={() => navigate('/admin/doctor-verification')}>
                  <div className="inline-flex p-3 rounded-xl bg-amber-500/10 mb-3"><Bot className="w-6 h-6 text-amber-400" /></div>
                  <h3 className="text-white font-bold text-base">Smart Doctor Assignment</h3>
                  <p className="text-xs text-slate-400 mt-1">AI suggests best doctor for each patient</p>
                  <Badge variant="success" className="text-[10px] mt-2">Active</Badge>
                </Card>
              </div>
              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Sparkles className="w-5 h-5 text-cyan-400" /> AI Smart Insights</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Smart Doctor Assignment', desc: 'AI analyzes patient symptoms, location, and doctor availability to recommend the best specialist.', status: 'Active', icon: Bot, color: 'amber' },
                    { title: 'Mental Health Risk Detection', desc: 'Real-time chat/message analysis detects suicidal ideation, depression, and anxiety patterns.', status: '3 Alerts', icon: Heart, color: 'rose' },
                    { title: 'Fraud Detection Engine', desc: 'AI identifies fake doctors, fraudulent prescriptions, and suspicious pharmacy activities.', status: '12 Flagged', icon: Shield, color: 'red' },
                    { title: 'Health Heatmap Analytics', desc: 'Disease outbreak prediction and health trend analysis across 8 divisions of Bangladesh.', status: 'Live', icon: MapPin, color: 'emerald' },
                  ].map((feature, i) => {
                    const Icon = feature.icon;
                    return (
                      <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                        <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded-xl bg-${feature.color}-500/10`}><Icon className={`w-5 h-5 text-${feature.color}-400`} /></div>
                          <h4 className="text-white font-bold text-sm">{feature.title}</h4>
                          <Badge variant="info" className="text-[8px] ml-auto">{feature.status}</Badge>
                        </div>
                        <p className="text-xs text-slate-400">{feature.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </GlassmorphicCard>
            </div>
          )}

          {/* FEEDBACK + SYSTEM HEALTH */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><MessageSquare className="w-5 h-5 text-amber-400" /> Recent Feedbacks</h3>
                <div className="space-y-3">
                  {feedbacks.map((fb) => (
                    <div key={fb.id} className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-white text-sm font-bold">{fb.userName}</span>
                        <Badge variant={fb.priority==='urgent'?'danger':fb.priority==='high'?'warning':'info'} className="text-[10px]">{fb.priority}</Badge>
                      </div>
                      <p className="text-slate-400 text-xs">{fb.subject}</p>
                      <p className="text-slate-500 text-[10px] mt-1">{fb.message}</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="primary" size="xs" className="flex-1 bg-cyan-500">Resolve</Button>
                        <Button variant="ghost" size="xs" className="flex-1">Reply</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            </div>

            <GlassmorphicCard className="p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Server className="w-5 h-5 text-emerald-400" /> System Health</h3>
              <div className="space-y-4">
                {[
                  { label: 'CPU Usage', value: 35, color: 'from-green-500 to-cyan-500' },
                  { label: 'Memory', value: 62, color: 'from-amber-500 to-orange-500' },
                  { label: 'Storage', value: 42, color: 'from-purple-500 to-pink-500' },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between items-center mb-1.5"><span className="text-slate-400 text-xs">{item.label}</span><span className="text-white text-sm font-bold">{item.value}%</span></div>
                    <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} className={`h-full bg-gradient-to-r ${item.color} rounded-full`} /></div>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="text-center p-3 rounded-2xl bg-white/[0.02]"><p className="text-slate-400 text-xs">Uptime</p><p className="text-white text-lg font-black">99.99%</p></div>
                  <div className="text-center p-3 rounded-2xl bg-white/[0.02]"><p className="text-slate-400 text-xs">Response</p><p className="text-white text-lg font-black">45ms</p></div>
                </div>
              </div>
            </GlassmorphicCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;