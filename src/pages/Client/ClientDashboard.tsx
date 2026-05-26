// src/pages/Client/ClientDashboard.tsx
// UI IMPROVED - NO CODE DELETED - PREMIUM DARK THEME
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Search, Bell, User, Menu,
  ChevronRight, Plus,
  Heart, Activity, Calendar, Pill,
  Microscope, Thermometer, Stethoscope,
  Building2, Droplets, Truck, Phone, Video,
  FileText, AlertCircle, Brain,
  CheckCircle2, Home, Baby, Wind, Moon,
  Sparkles, TrendingUp, Clock, Zap
} from 'lucide-react';



// ============================================
// ✅ ALL EXISTING UI COMPONENTS
// ============================================
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';

import { Modal } from 'src/ui/Modal';


// ============================================
// TYPES
// ============================================
interface VitalsData {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical';
  color: string;
  trend: 'up' | 'down' | 'stable';
}

interface QuickAction {
  icon: React.ElementType;
  label: string;
  color: string;
  path: string;
  badge?: string;
}

interface AppointmentData {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  type: 'in-person' | 'video' | 'phone';
  avatar: string;
}

interface MedicineReminder {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  color: string;
}

interface SystemModule {
  icon: React.ElementType;
  title: string;
  desc: string;
  color: string;
  path: string;
  badge?: string;
}

interface HealthMetric {
  label: string;
  value: number;
  max: number;
  color: string;
  icon: React.ElementType;
}

// ============================================
// MOCK DATA
// ============================================
const vitalsData: VitalsData[] = [
  { icon: Heart, label: 'Heart Rate', value: '72', unit: 'bpm', status: 'normal', color: 'rose', trend: 'stable' },
  { icon: Activity, label: 'Blood Pressure', value: '120/80', unit: 'mmHg', status: 'normal', color: 'blue', trend: 'stable' },
  { icon: Thermometer, label: 'Temperature', value: '98.6', unit: '°F', status: 'normal', color: 'amber', trend: 'stable' },
  { icon: Microscope, label: 'Blood Sugar', value: '95', unit: 'mg/dL', status: 'normal', color: 'green', trend: 'down' },
];

const quickActions: QuickAction[] = [
  { icon: Calendar, label: 'Book Appointment', color: 'blue', path: '/doctor' },
  { icon: Video, label: 'Telemedicine', color: 'teal', path: '/telemedicine' },
  { icon: Pill, label: 'Pharmacy', color: 'amber', path: '/pharmacy' },
  { icon: Building2, label: 'Hospitals', color: 'purple', path: '/hospitals' },
  { icon: Droplets, label: 'Blood Donors', color: 'red', path: '/blood-donors' },
  { icon: AlertCircle, label: 'Emergency', color: 'rose', path: '/emergency' },
  { icon: Brain, label: 'AI Assistant', color: 'indigo', path: '/ai-assistant' },
  { icon: FileText, label: 'Health Records', color: 'slate', path: '/patient/records' },
];

const appointments: AppointmentData[] = [
  { id: '1', doctorName: 'Dr. Sarah Wilson', specialty: 'Cardiologist', date: '2026-05-25', time: '10:00 AM', status: 'confirmed', type: 'in-person', avatar: 'SW' },
  { id: '2', doctorName: 'Dr. James Lee', specialty: 'Neurologist', date: '2026-05-26', time: '2:30 PM', status: 'pending', type: 'video', avatar: 'JL' },
  { id: '3', doctorName: 'Dr. Emily Chen', specialty: 'Pediatrician', date: '2026-05-28', time: '11:00 AM', status: 'confirmed', type: 'phone', avatar: 'EC' },
];

const medicineReminders: MedicineReminder[] = [
  { id: '1', name: 'Paracetamol', dosage: '500mg - 1 tablet', time: '8:00 AM', taken: true, color: 'blue' },
  { id: '2', name: 'Amoxicillin', dosage: '250mg - 2 tablets', time: '2:00 PM', taken: false, color: 'green' },
  { id: '3', name: 'Vitamin D', dosage: '1000IU - 1 capsule', time: '8:00 PM', taken: false, color: 'amber' },
];

const systemModules: SystemModule[] = [
  { icon: Building2, title: 'Hospitals', desc: 'Find & connect with hospitals', color: 'purple', path: '/hospitals', badge: '250+' },
  { icon: Pill, title: 'Pharmacy', desc: 'Order medicines online', color: 'amber', path: '/pharmacy', badge: '24/7' },
  { icon: Droplets, title: 'Blood Donation', desc: 'Find blood donors nearby', color: 'red', path: '/blood-donors', badge: '10K+' },
  { icon: Wind, title: 'Oxygen Network', desc: 'Real-time O2 tracking', color: 'sky', path: '/oxygen-network', badge: 'Live' },
  { icon: Truck, title: 'Ambulance', desc: 'Emergency transport', color: 'rose', path: '/emergency', badge: '8min' },
  { icon: Baby, title: 'Women Care', desc: 'Specialized health', color: 'pink', path: '/women-care', badge: 'New' },
  { icon: Brain, title: 'AI Assistant', desc: 'Smart health insights', color: 'indigo', path: '/ai-assistant', badge: 'AI' },
  { icon: Stethoscope, title: 'Find Doctors', desc: 'Compare & book doctors', color: 'teal', path: '/client/doctor-comparison', badge: '500+' },
];

const healthMetrics: HealthMetric[] = [
  { label: 'Health Score', value: 92, max: 100, color: 'emerald', icon: Heart },
  { label: 'Activity', value: 75, max: 100, color: 'blue', icon: Activity },
  { label: 'Sleep', value: 85, max: 100, color: 'purple', icon: Moon },
  { label: 'Nutrition', value: 68, max: 100, color: 'amber', icon: FileText },
];

// Color map for safe Tailwind usage
const colorMap: Record<string, { bg: string; text: string; gradient: string }> = {
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', gradient: 'from-rose-500 to-pink-500' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', gradient: 'from-blue-500 to-cyan-500' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', gradient: 'from-amber-500 to-orange-500' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', gradient: 'from-green-500 to-emerald-500' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', gradient: 'from-emerald-500 to-teal-500' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', gradient: 'from-purple-500 to-violet-500' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', gradient: 'from-red-500 to-rose-500' },
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', gradient: 'from-indigo-500 to-blue-500' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', gradient: 'from-teal-500 to-cyan-500' },
  slate: { bg: 'bg-slate-500/10', text: 'text-slate-400', gradient: 'from-slate-500 to-gray-500' },
  sky: { bg: 'bg-sky-500/10', text: 'text-sky-400', gradient: 'from-sky-500 to-blue-500' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', gradient: 'from-pink-500 to-rose-500' },
};

// ============================================
// HEALTH SCORE RING
// ============================================
const HealthScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;
  const getColor = (s: number) => s >= 90 ? '#22c55e' : s >= 70 ? '#14b8a6' : s >= 50 ? '#f59e0b' : '#ef4444';

  return (
    <div className="relative w-40 h-40 mx-auto">
      {/* Glow effect */}
      <div className="absolute inset-0 rounded-full blur-2xl opacity-20" style={{ background: getColor(score) }} />
      <svg className="w-full h-full -rotate-90 relative z-10" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={radius} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="8" />
        <motion.circle cx="65" cy="65" r={radius} fill="none" stroke={getColor(score)} strokeWidth="8" strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: `${progress} ${circumference}` }}
          transition={{ duration: 1.5, ease: 'easeOut' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
        <motion.span initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          className="text-4xl font-black text-white drop-shadow-lg">{score}</motion.span>
        <span className="text-white/30 text-xs mt-1">Health Score</span>
        <Badge variant="success" className="mt-2 text-[10px] shadow-lg">Excellent</Badge>
      </div>
    </div>
  );
};

// ============================================
// MAIN CLIENT DASHBOARD
// ============================================
const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [medicines, setMedicines] = useState(medicineReminders);

  const user = useSelector((state: any) => state?.auth?.user) || { name: 'John Doe', email: 'john@email.com' };

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning ☀️' : hour < 18 ? 'Good Afternoon 🌤️' : 'Good Evening 🌙');
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const toggleMedicine = useCallback((id: string) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  }, []);

  const pendingMeds = medicines.filter(m => !m.taken).length;

  return (
    <div className="min-h-screen bg-[#020408]">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '50px 50px' }} />
      
      <div className="relative max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* ============================================ */}
        {/* TOP HEADER - Enhanced */}
        {/* ============================================ */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-xl" />
              <Avatar name={user?.name || 'JD'} size="lg" className="relative ring-2 ring-cyan-500/20" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-[#020408] shadow-lg shadow-emerald-400/50" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {greeting}, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0] || 'John'}</span>
              </h1>
              <p className="text-slate-400 text-sm flex items-center gap-2 mt-0.5">
                <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                <span className="text-slate-600">•</span>
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search doctors, medicines..."
                className="w-56 lg:w-72 bg-white/[0.03] border border-white/[0.08] rounded-2xl py-2.5 pl-10 pr-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/30 transition-all"
              />
            </div>
            <button className="relative p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all group">
              <Bell className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold shadow-lg shadow-red-500/20">3</span>
            </button>
            <button className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all">
              <User className="w-5 h-5 text-slate-400" />
            </button>
            <Button variant="danger" size="sm" onClick={() => setSosModalOpen(true)}
              className="animate-pulse bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/20 hover:shadow-red-500/40">
              <AlertCircle className="w-4 h-4 mr-1.5" /> SOS
            </Button>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* HEALTH SCORE + VITALS - Enhanced */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <GlassmorphicCard className="p-6 text-center relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent" />
            <div className="relative z-10">
              <HealthScoreRing score={92} />
              <div className="flex items-center justify-center gap-2 mt-3">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-xs font-bold">+2% from last week</span>
              </div>
            </div>
          </GlassmorphicCard>
          
          <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {vitalsData.map((vital, i) => {
              const Icon = vital.icon;
              const colors = colorMap[vital.color] || colorMap.blue;
              return (
                <Card key={i} className="p-4 hover:border-white/10 transition-all cursor-default group relative overflow-hidden">
                  <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-5 group-hover:opacity-10 transition-opacity"
                    style={{ background: `var(--${vital.color})` }} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2.5 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-4 h-4 ${colors.text}`} />
                      </div>
                      <span className="text-slate-400 text-xs font-medium uppercase tracking-wider">{vital.label}</span>
                    </div>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-white">{vital.value}</span>
                      <span className="text-slate-500 text-xs">{vital.unit}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className={`w-2 h-2 rounded-full ${
                        vital.status === 'normal' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' :
                        vital.status === 'warning' ? 'bg-amber-400' : 'bg-red-400'
                      }`} />
                      <span className={`text-[11px] font-bold capitalize ${
                        vital.status === 'normal' ? 'text-emerald-400' : 'text-amber-400'
                      }`}>{vital.status}</span>
                      <span className="text-slate-600 text-[10px]">• {vital.trend}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ============================================ */}
        {/* QUICK ACTIONS - ALL SYSTEMS - Enhanced */}
        {/* ============================================ */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-400" />
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              const colors = colorMap[action.color] || colorMap.blue;
              return (
                <motion.button key={i} whileHover={{ scale: 1.08, y: -4 }} whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-2.5 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.06] hover:border-cyan-500/20 transition-all group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className={`relative p-3 rounded-xl ${colors.bg} group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <span className="text-slate-400 text-[11px] font-semibold group-hover:text-white transition-colors text-center leading-tight relative">
                    {action.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* ============================================ */}
        {/* MAIN CONTENT GRID - Enhanced */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* Appointments + Health Metrics */}
          <div className="lg:col-span-2 space-y-5">
            {/* Appointments - Enhanced */}
            <GlassmorphicCard className="p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-cyan-400" />
                    Upcoming Appointments
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">Your scheduled medical visits</p>
                </div>
                <Button variant="ghost" size="xs" onClick={() => navigate('/patient/appointments')}
                  className="text-cyan-400 hover:text-cyan-300">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-2">
                {appointments.map((apt) => (
                  <motion.div key={apt.id} whileHover={{ x: 3 }}
                    className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition-all cursor-pointer group">
                    <Avatar name={apt.avatar} size="md" className="ring-2 ring-white/5 group-hover:ring-cyan-500/20 transition-all" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-bold truncate">{apt.doctorName}</h4>
                      <p className="text-slate-500 text-xs">{apt.specialty}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-slate-500 text-[10px]">{apt.date}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500 text-[10px]">{apt.type}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white text-sm font-bold">{apt.time}</p>
                      <Badge variant={apt.status === 'confirmed' ? 'success' : apt.status === 'pending' ? 'warning' : 'default'}
                        className="text-[10px] mt-1 shadow-lg">
                        {apt.status}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Button variant="primary" size="sm" className="w-full mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all"
                onClick={() => navigate('/patient/appointments')}>
                <Plus className="w-4 h-4 mr-2" /> Book New Appointment
              </Button>
            </GlassmorphicCard>

            {/* Health Metrics - Enhanced */}
            <GlassmorphicCard className="p-6">
              <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <Activity className="w-5 h-5 text-purple-400" />
                Health Metrics
              </h3>
              <div className="space-y-5">
                {healthMetrics.map((metric, i) => {
                  const Icon = metric.icon;
                  const percentage = (metric.value / metric.max) * 100;
                  const colors = colorMap[metric.color] || colorMap.blue;
                  return (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className={`p-1.5 rounded-lg ${colors.bg}`}>
                            <Icon className={`w-3.5 h-3.5 ${colors.text}`} />
                          </div>
                          <span className="text-slate-400 text-sm font-medium">{metric.label}</span>
                        </div>
                        <span className="text-white font-bold">{metric.value}%</span>
                      </div>
                      <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }}
                          transition={{ duration: 1.2, ease: 'easeOut', delay: i * 0.1 }}
                          className={`h-full bg-gradient-to-r ${colors.gradient} rounded-full shadow-lg`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </GlassmorphicCard>
          </div>

          {/* Medicine Reminders + System Modules - Enhanced */}
          <div className="space-y-5">
            {/* Medicine Reminders - Enhanced */}
            <GlassmorphicCard className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Pill className="w-5 h-5 text-amber-400" />
                  Medicines
                </h3>
                <Badge variant="warning" className="shadow-lg">{pendingMeds} Pending</Badge>
              </div>
              <div className="space-y-2">
                {medicines.map((med) => (
                  <motion.div key={med.id} whileHover={{ x: 2 }}
                    onClick={() => toggleMedicine(med.id)}
                    className={`flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer ${
                      med.taken
                        ? 'bg-white/[0.01] border border-transparent'
                        : 'bg-white/[0.03] border border-white/[0.06] hover:border-cyan-500/20'
                    }`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${
                      colorMap[med.color]?.bg || 'bg-blue-500/10'
                    }`}>
                      <Pill className={`w-5 h-5 ${colorMap[med.color]?.text || 'text-blue-400'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold ${med.taken ? 'text-slate-500 line-through' : 'text-white'}`}>
                        {med.name}
                      </h4>
                      <p className="text-slate-500 text-xs">{med.dosage} • {med.time}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                      med.taken ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/30' : 'border-slate-600'
                    }`}>
                      {med.taken && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </motion.div>
                ))}
              </div>
              {medicines.every(m => m.taken) && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-3">
                  <Badge variant="success" className="shadow-lg">🎉 All medicines taken!</Badge>
                </motion.div>
              )}
            </GlassmorphicCard>

            {/* System Modules - ALL SYSTEMS - Enhanced */}
            <GlassmorphicCard className="p-6">
              <h3 className="text-white font-bold text-lg mb-5 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                Connected Systems
              </h3>
              <div className="space-y-1.5">
                {systemModules.map((sys, i) => {
                  const Icon = sys.icon;
                  const colors = colorMap[sys.color] || colorMap.blue;
                  return (
                    <motion.div key={i} whileHover={{ x: 4, scale: 1.01 }}
                      onClick={() => navigate(sys.path)}
                      className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition-all cursor-pointer group">
                      <div className={`p-2.5 rounded-xl ${colors.bg} group-hover:scale-110 transition-transform shadow-lg`}>
                        <Icon className={`w-4 h-4 ${colors.text}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-bold">{sys.title}</h4>
                        <p className="text-slate-500 text-[11px]">{sys.desc}</p>
                      </div>
                      {sys.badge && (
                        <Badge variant="info" className="text-[10px] shadow-lg group-hover:scale-105 transition-transform">
                          {sys.badge}
                        </Badge>
                      )}
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                    </motion.div>
                  );
                })}
              </div>
            </GlassmorphicCard>
          </div>
        </div>

        {/* ============================================ */}
        {/* MOBILE BOTTOM NAVIGATION - Enhanced */}
        {/* ============================================ */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900/98 backdrop-blur-2xl border-t border-white/08 z-50 safe-area-bottom">
          <div className="flex items-center justify-around py-2.5 px-2">
            {[
              { icon: Home, label: 'Home', path: '/client/dashboard' },
              { icon: Calendar, label: 'Appts', path: '/patient/appointments' },
              { icon: Pill, label: 'Meds', path: '/patient/prescriptions' },
              { icon: User, label: 'Profile', path: '/profile' },
              { icon: Menu, label: 'More', path: '/client/dashboard' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button key={item.label} onClick={() => navigate(item.path)}
                  className="flex flex-col items-center gap-1 p-2 text-slate-500 hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* EMERGENCY SOS MODAL - Enhanced */}
      {/* ============================================ */}
      <AnimatePresence>
        {sosModalOpen && (
          <Modal isOpen={true} onClose={() => setSosModalOpen(false)} size="sm">
            <div className="text-center p-8 bg-gradient-to-b from-slate-900 to-slate-950">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center shadow-2xl shadow-red-500/10">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </motion.div>
              <h2 className="text-2xl font-black text-white mb-2">Emergency Assistance</h2>
              <p className="text-slate-400 text-sm mb-8">This will immediately alert nearby emergency services</p>
              <div className="space-y-3">
                <Button variant="danger" size="lg" className="w-full bg-gradient-to-r from-red-500 to-rose-500 shadow-xl shadow-red-500/20"
                  onClick={() => { setSosModalOpen(false); navigate('/emergency'); }}>
                  <Phone className="w-5 h-5 mr-2" /> Call Emergency (911)
                </Button>
                <Button variant="outline" size="lg" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/5"
                  onClick={() => { setSosModalOpen(false); navigate('/emergency'); }}>
                  <Truck className="w-5 h-5 mr-2" /> Request Ambulance
                </Button>
                <Button variant="ghost" size="sm" className="w-full text-slate-500" onClick={() => setSosModalOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientDashboard;