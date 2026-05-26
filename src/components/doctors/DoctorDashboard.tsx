// src/pages/Doctor/DoctorDashboard.tsx
// COMPLETE DOCTOR DASHBOARD - ALL FEATURES
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  // Core
  Search, Bell, Settings, Calendar, Clock, 
  ChevronRight, Plus,
  Brain,  Baby,  Activity,Truck,
  Pill,  Microscope
, Download,  Send, Video, Phone, MessageCircle,
  Users, TrendingUp,  AlertCircle, 
  // Systems Truck, 
  CheckCircle2, XCircle, 
  // Navigation
  Home, MapPin,
  FileText
} from 'lucide-react';



import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Input } from 'src/ui/Input';
import { Modal } from 'src/ui/Modal';


// ============================================
// TYPES
// ============================================
interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  condition: string;
  lastVisit: string;
  nextAppointment: string;
  priority: 'normal' | 'urgent' | 'emergency';
  allergies: string[];
  chronicDiseases: string[];
  avatar: string;
}

interface AppointmentData {
  id: string;
  patientName: string;
  patientAvatar: string;
  type: 'in-person' | 'video' | 'phone';
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  reason: string;
  priority: 'normal' | 'urgent';
}

interface PrescriptionData {
  id: string;
  patientName: string;
  date: string;
  medicines: { name: string; dosage: string; duration: string }[];
  diagnosis: string;
  status: 'draft' | 'issued';
}

interface LabReport {
  id: string;
  patientName: string;
  type: string;
  date: string;
  status: 'normal' | 'abnormal' | 'critical';
  fileType: string;
}

interface EmergencyCase {
  id: string;
  patientName: string;
  condition: string;
  severity: 'critical' | 'severe' | 'moderate';
  time: string;
  location: string;
}

// ============================================
// MOCK DATA
// ============================================
const patientsData: PatientData[] = [
  { id: '1', name: 'Rahima Khatun', age: 32, gender: 'Female', bloodGroup: 'A+', condition: 'Hypertension', lastVisit: '2026-05-20', nextAppointment: '2026-06-05', priority: 'normal', allergies: ['Penicillin'], chronicDiseases: ['Hypertension'], avatar: 'RK' },
  { id: '2', name: 'Kamal Hossain', age: 45, gender: 'Male', bloodGroup: 'O+', condition: 'Diabetes Type 2', lastVisit: '2026-05-18', nextAppointment: '2026-06-02', priority: 'urgent', allergies: [], chronicDiseases: ['Diabetes', 'Hypertension'], avatar: 'KH' },
  { id: '3', name: 'Nasrin Sultana', age: 28, gender: 'Female', bloodGroup: 'B+', condition: 'Pregnancy - Week 24', lastVisit: '2026-05-22', nextAppointment: '2026-06-10', priority: 'normal', allergies: [], chronicDiseases: [], avatar: 'NS' },
  { id: '4', name: 'Rafiqul Islam', age: 58, gender: 'Male', bloodGroup: 'AB+', condition: 'Cardiac Arrest Risk', lastVisit: '2026-05-15', nextAppointment: '2026-05-28', priority: 'emergency', allergies: ['Aspirin'], chronicDiseases: ['Heart Disease', 'Diabetes'], avatar: 'RI' },
];

const appointmentsData: AppointmentData[] = [
  { id: '1', patientName: 'Rahima Khatun', patientAvatar: 'RK', type: 'in-person', date: '2026-05-25', time: '10:00 AM', status: 'confirmed', reason: 'Blood pressure checkup', priority: 'normal' },
  { id: '2', patientName: 'Kamal Hossain', patientAvatar: 'KH', type: 'video', date: '2026-05-25', time: '11:30 AM', status: 'pending', reason: 'Diabetes follow-up', priority: 'urgent' },
  { id: '3', patientName: 'Nasrin Sultana', patientAvatar: 'NS', type: 'in-person', date: '2026-05-25', time: '2:00 PM', status: 'confirmed', reason: 'Pregnancy checkup', priority: 'normal' },
  { id: '4', patientName: 'Rafiqul Islam', patientAvatar: 'RI', type: 'phone', date: '2026-05-25', time: '4:00 PM', status: 'confirmed', reason: 'Cardiac review', priority: 'urgent' },
];

const prescriptionsData: PrescriptionData[] = [
  { id: '1', patientName: 'Rahima Khatun', date: '2026-05-20', medicines: [{ name: 'Losartan 50mg', dosage: '1 tablet daily', duration: '30 days' }, { name: 'Amlodipine 5mg', dosage: '1 tablet daily', duration: '30 days' }], diagnosis: 'Hypertension Stage 1', status: 'issued' },
  { id: '2', patientName: 'Kamal Hossain', date: '2026-05-18', medicines: [{ name: 'Metformin 500mg', dosage: '1 tablet twice daily', duration: '30 days' }], diagnosis: 'Diabetes Type 2', status: 'issued' },
];

const labReports: LabReport[] = [
  { id: '1', patientName: 'Rafiqul Islam', type: 'ECG', date: '2026-05-22', status: 'abnormal', fileType: 'PDF' },
  { id: '2', patientName: 'Nasrin Sultana', type: 'Ultrasound', date: '2026-05-20', status: 'normal', fileType: 'Image' },
  { id: '3', patientName: 'Kamal Hossain', type: 'Blood Test', date: '2026-05-19', status: 'normal', fileType: 'PDF' },
];

const emergencyCases: EmergencyCase[] = [
  { id: '1', patientName: 'Rafiqul Islam', condition: 'Cardiac Arrest Risk', severity: 'critical', time: '30 min ago', location: 'ICU Room 3' },
  { id: '2', patientName: 'Emergency Patient', condition: 'Severe Allergic Reaction', severity: 'severe', time: '1 hour ago', location: 'ER Bay 2' },
];

const quickStats = [
  { icon: Users, label: 'Total Patients', value: '1,250', color: 'blue', trend: '+12%' },
  { icon: Calendar, label: "Today's Appointments", value: '8', color: 'teal', trend: '4 remaining' },
  { icon: FileText, label: 'Prescriptions', value: '45', color: 'purple', trend: 'This month' },
  { icon: TrendingUp, label: 'Success Rate', value: '98%', color: 'emerald', trend: '+2%' },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400', teal: 'bg-teal-500/10 text-teal-400',
  purple: 'bg-purple-500/10 text-purple-400', emerald: 'bg-emerald-500/10 text-emerald-400',
  red: 'bg-red-500/10 text-red-400', amber: 'bg-amber-500/10 text-amber-400',
  green: 'bg-green-500/10 text-green-400', cyan: 'bg-cyan-500/10 text-cyan-400',
  pink: 'bg-pink-500/10 text-pink-400', indigo: 'bg-indigo-500/10 text-indigo-400',
  rose: 'bg-rose-500/10 text-rose-400',
};

// ============================================
// MAIN DOCTOR DASHBOARD
// ============================================
const DoctorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(null);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [sosModalOpen, setSosModalOpen] = useState(false);

  const user = useSelector((state: any) => state?.auth?.user) || { name: 'Dr. Doctor', specialty: 'Cardiologist' };

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');
  }, []);

  const sidebarLinks = [
    { icon: Home, label: 'Dashboard', path: 'dashboard' },
    { icon: Users, label: 'Patients', path: 'patients' },
    { icon: Calendar, label: 'Appointments', path: 'appointments' },
    { icon: FileText, label: 'Prescriptions', path: 'prescriptions' },
    { icon: Baby, label: 'Women Care', path: 'women' },
    { icon: Activity, label: 'Reports', path: 'reports' },
    { icon: AlertCircle, label: 'Emergency', path: 'emergency' },
    { icon: Pill, label: 'Pharmacy', path: 'pharmacy' },
    { icon: Brain, label: 'AI Assistant', path: 'ai' },
    { icon: TrendingUp, label: 'Analytics', path: 'analytics' },
    { icon: MessageCircle, label: 'Messages', path: 'messages' },
    { icon: Settings, label: 'Settings', path: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-[#030508] flex">
      
      {/* ============================================ */}
      {/* SIDEBAR */}
      {/* ============================================ */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-900/50 border-r border-white/[0.04] h-screen sticky top-0">
        {/* Doctor Profile */}
        <div className="p-6 border-b border-white/[0.04]">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-xl" />
              <Avatar name={user?.name || 'DR'} size="lg" className="relative ring-2 ring-cyan-500/20" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 shadow-lg shadow-emerald-400/50" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{user?.name || 'Dr. Doctor'}</h3>
              <p className="text-cyan-400 text-xs">{user?.specialty || 'Cardiologist'}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Badge variant="success" className="text-[10px]">🟢 Available</Badge>
            <Badge variant="info" className="text-[10px]">⭐ 4.8</Badge>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.path;
            return (
              <motion.button key={link.path} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(link.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/20 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}>
                <Icon className="w-5 h-5" />
                {link.label}
                {link.path === 'emergency' && (
                  <Badge variant="danger" className="text-[9px] ml-auto">2</Badge>
                )}
              </motion.button>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/[0.04]">
          <Button variant="ghost" className="w-full text-slate-400 hover:text-red-400 justify-start">
            <XCircle className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </aside>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="flex-1 min-w-0">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          
          {/* TOP HEADER */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {greeting}, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{user?.name?.split(' ')[1] || 'Doctor'}</span>
              </h1>
              <p className="text-slate-400 text-sm">Doctor Dashboard • {user?.specialty || 'Cardiologist'}</p>
            </div>
            <div className="flex items-center gap-3">
              <Input placeholder="Search patients..." leftIcon={Search} className="w-64" />
              <button className="relative p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all">
                <Bell className="w-5 h-5 text-slate-400" />
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-red-500 to-rose-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">5</span>
              </button>
              <Button variant="danger" size="sm" onClick={() => setSosModalOpen(true)}
                className="animate-pulse bg-gradient-to-r from-red-500 to-rose-500 shadow-lg">
                <AlertCircle className="w-4 h-4 mr-1.5" /> Emergency
              </Button>
            </div>
          </motion.div>

          {/* QUICK STATS */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, i) => {
              const Icon = stat.icon;
              const colors = colorMap[stat.color] || '';
              const [bg, text] = colors.split(' ');
              return (
                <Card key={i} className="p-4 text-center hover:shadow-lg transition-all group">
                  <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${text}`} />
                  </div>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{stat.trend}</p>
                </Card>
              );
            })}
          </div>

          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* LEFT: Patient Queue + Appointments */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* PATIENT QUEUE */}
              <GlassmorphicCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" /> Patient Queue
                  </h3>
                  <Button variant="ghost" size="xs" onClick={() => setActiveTab('patients')} className="text-cyan-400">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {patientsData.map((patient) => (
                    <motion.div key={patient.id} whileHover={{ x: 3 }} onClick={() => setSelectedPatient(patient)}
                      className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08] transition-all cursor-pointer">
                      <Avatar name={patient.avatar} size="md" className="ring-2 ring-white/5" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-white text-sm font-bold">{patient.name}</h4>
                          <span className="text-slate-500 text-xs">{patient.age}y • {patient.gender}</span>
                        </div>
                        <p className="text-slate-500 text-xs">{patient.condition}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={patient.priority === 'emergency' ? 'danger' : patient.priority === 'urgent' ? 'warning' : 'info'} className="text-[10px]">
                          {patient.priority}
                        </Badge>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassmorphicCard>

              {/* APPOINTMENTS */}
              <GlassmorphicCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-400" /> Today's Appointments
                  </h3>
                  <Badge variant="info">{appointmentsData.length} scheduled</Badge>
                </div>
                <div className="space-y-2">
                  {appointmentsData.map((apt) => (
                    <div key={apt.id} className="flex items-center gap-4 p-3.5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                      <Avatar name={apt.patientAvatar} size="md" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-bold">{apt.patientName}</h4>
                        <p className="text-slate-500 text-xs">{apt.reason}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-bold">{apt.time}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={apt.type === 'video' ? 'info' : apt.type === 'phone' ? 'warning' : 'default'} className="text-[10px]">
                            {apt.type}
                          </Badge>
                          <Badge variant={apt.status === 'confirmed' ? 'success' : 'warning'} className="text-[10px]">{apt.status}</Badge>
                        </div>
                      </div>
                      {apt.type === 'video' && (
                        <Button variant="primary" size="xs" className="bg-green-500">
                          <Video className="w-3.5 h-3.5 mr-1" /> Join
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>

              {/* LAB REPORTS */}
              <GlassmorphicCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Microscope className="w-5 h-5 text-teal-400" /> Lab Reports
                  </h3>
                  <Button variant="ghost" size="xs" onClick={() => setActiveTab('reports')} className="text-teal-400">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {labReports.map((report) => (
                    <div key={report.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer">
                      <FileText className="w-5 h-5 text-cyan-400" />
                      <div className="flex-1">
                        <h4 className="text-white text-sm font-bold">{report.type} - {report.patientName}</h4>
                        <p className="text-xs text-slate-500">{report.date}</p>
                      </div>
                      <Badge variant={report.status === 'normal' ? 'success' : report.status === 'abnormal' ? 'warning' : 'danger'} className="text-[10px]">
                        {report.status}
                      </Badge>
                      <Button variant="ghost" size="xs"><Download className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            </div>

            {/* RIGHT: Prescriptions + Emergency + Quick Actions */}
            <div className="space-y-6">
              
              {/* PRESCRIPTIONS */}
              <GlassmorphicCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Pill className="w-5 h-5 text-amber-400" /> Recent Prescriptions
                  </h3>
                  <Button variant="primary" size="xs" className="bg-amber-500" onClick={() => setShowPrescriptionModal(true)}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> New
                  </Button>
                </div>
                <div className="space-y-2">
                  {prescriptionsData.map((pres) => (
                    <div key={pres.id} className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white text-sm font-bold">{pres.patientName}</h4>
                        <Badge variant={pres.status === 'issued' ? 'success' : 'warning'} className="text-[10px]">{pres.status}</Badge>
                      </div>
                      <p className="text-slate-500 text-xs">{pres.diagnosis}</p>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {pres.medicines.slice(0, 2).map((med, i) => (
                          <span key={i} className="text-[10px] text-amber-400">{med.name}</span>
                        ))}
                        {pres.medicines.length > 2 && (
                          <span className="text-[10px] text-slate-500">+{pres.medicines.length - 2} more</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>

              {/* EMERGENCY CASES */}
              <GlassmorphicCard className="p-6 bg-gradient-to-br from-red-500/5 to-transparent border-red-500/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" /> Emergency Cases
                  </h3>
                  <Badge variant="danger">{emergencyCases.length} Active</Badge>
                </div>
                <div className="space-y-2">
                  {emergencyCases.map((em) => (
                    <div key={em.id} className="p-3 rounded-2xl bg-red-500/5 border border-red-500/10 hover:border-red-500/20 transition-all cursor-pointer">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white text-sm font-bold">{em.patientName}</h4>
                        <Badge variant={em.severity === 'critical' ? 'danger' : 'warning'} className="text-[10px]">{em.severity}</Badge>
                      </div>
                      <p className="text-slate-400 text-xs">{em.condition}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" /> {em.time}
                        <span>•</span>
                        <MapPin className="w-3 h-3" /> {em.location}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="danger" size="sm" className="w-full mt-4 bg-gradient-to-r from-red-500 to-rose-500">
                  <Phone className="w-4 h-4 mr-2" /> Respond to Emergency
                </Button>
              </GlassmorphicCard>

              {/* QUICK ACTIONS */}
              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-bold text-lg mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: FileText, label: 'Write Prescription', color: 'amber', action: () => setShowPrescriptionModal(true) },
                    { icon: Calendar, label: 'Schedule', color: 'blue', action: () => setShowScheduleModal(true) },
                    { icon: Video, label: 'Video Call', color: 'green', action: () => {} },
                    { icon: MessageCircle, label: 'Messages', color: 'indigo', action: () => setActiveTab('messages') },
                    { icon: Brain, label: 'AI Assistant', color: 'purple', action: () => navigate('/ai-assistant') },
                    { icon: Pill, label: 'Pharmacy', color: 'teal', action: () => navigate('/pharmacy') },
                    { icon: Baby, label: 'Women Care', color: 'pink', action: () => navigate('/women-care') },
                    { icon: TrendingUp, label: 'Analytics', color: 'cyan', action: () => setActiveTab('analytics') },
                  ].map((action, i) => {
                    const Icon = action.icon;
                    const colors = colorMap[action.color] || '';
                    const [bg, text] = colors.split(' ');
                    return (
                      <motion.button key={i} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        onClick={action.action}
                        className={`flex flex-col items-center gap-2 p-3 rounded-2xl ${bg} hover:shadow-lg transition-all text-center`}>
                        <Icon className={`w-5 h-5 ${text}`} />
                        <span className="text-white text-xs font-bold">{action.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </GlassmorphicCard>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* PRESCRIPTION MODAL */}
      {/* ============================================ */}
      <AnimatePresence>
        {showPrescriptionModal && (
          <Modal isOpen={true} onClose={() => setShowPrescriptionModal(false)} size="lg">
            <div className="p-6">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-amber-400" /> Write Prescription
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Patient Name</label>
                    <input type="text" className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-sm" placeholder="Search patient..." />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Diagnosis</label>
                    <input type="text" className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-sm" placeholder="Enter diagnosis..." />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">Medicines</label>
                  <div className="space-y-2">
                    {[1, 2].map((i) => (
                      <div key={i} className="grid grid-cols-3 gap-3">
                        <input type="text" className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-sm" placeholder="Medicine name" />
                        <input type="text" className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-sm" placeholder="Dosage" />
                        <input type="text" className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-sm" placeholder="Duration" />
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" size="xs" className="mt-2 text-amber-400">
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Medicine
                  </Button>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button variant="primary" className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500">
                    <Send className="w-4 h-4 mr-2" /> Issue Prescription
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="w-4 h-4 mr-2" /> Save as Draft
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* SCHEDULE MODAL */}
      {/* ============================================ */}
      <AnimatePresence>
        {showScheduleModal && (
          <Modal isOpen={true} onClose={() => setShowScheduleModal(false)} size="md">
            <div className="p-6">
              <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-cyan-400" /> Manage Schedule
              </h2>
              <div className="space-y-3">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03]">
                    <span className="text-white font-bold w-10">{day}</span>
                    <input type="text" className="flex-1 p-2 rounded-xl bg-white/[0.05] text-white text-sm" placeholder="9:00 AM - 5:00 PM" />
                    <Button variant="outline" size="xs" className="text-emerald-400 border-emerald-500/30">Available</Button>
                  </div>
                ))}
              </div>
              <Button variant="primary" className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-blue-500">
                <CheckCircle2 className="w-4 h-4 mr-2" /> Save Schedule
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* PATIENT DETAIL MODAL */}
      {/* ============================================ */}
      <AnimatePresence>
        {selectedPatient && (
          <Modal isOpen={true} onClose={() => setSelectedPatient(null)} size="md">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6">
                <Avatar name={selectedPatient.avatar} size="lg" />
                <div>
                  <h2 className="text-2xl font-black text-white">{selectedPatient.name}</h2>
                  <p className="text-slate-400 text-sm">{selectedPatient.age}y • {selectedPatient.gender} • {selectedPatient.bloodGroup}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-2xl bg-white/[0.03]">
                  <p className="text-xs text-slate-400">Condition</p>
                  <p className="text-white font-bold">{selectedPatient.condition}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03]">
                  <p className="text-xs text-slate-400">Last Visit</p>
                  <p className="text-white font-bold">{selectedPatient.lastVisit}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03]">
                  <p className="text-xs text-slate-400">Allergies</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPatient.allergies.length > 0 ? selectedPatient.allergies.map(a => (
                      <Badge key={a} variant="danger" className="text-[10px]">{a}</Badge>
                    )) : <span className="text-slate-500 text-xs">None</span>}
                  </div>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03]">
                  <p className="text-xs text-slate-400">Chronic Diseases</p>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedPatient.chronicDiseases.map(d => (
                      <Badge key={d} variant="warning" className="text-[10px]">{d}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="primary" className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500">
                  <FileText className="w-4 h-4 mr-2" /> Write Prescription
                </Button>
                <Button variant="outline" className="flex-1">
                  <Calendar className="w-4 h-4 mr-2" /> Schedule Appointment
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* SOS MODAL */}
      {/* ============================================ */}
      <AnimatePresence>
        {sosModalOpen && (
          <Modal isOpen={true} onClose={() => setSosModalOpen(false)} size="sm">
            <div className="text-center p-8">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </motion.div>
              <h2 className="text-2xl font-black text-white mb-2">Emergency Protocol</h2>
              <p className="text-slate-400 text-sm mb-6">Activate emergency response for critical patients</p>
              <div className="space-y-3">
                <Button variant="danger" size="lg" className="w-full bg-gradient-to-r from-red-500 to-rose-500">
                  <Phone className="w-5 h-5 mr-2" /> Call Emergency Team
                </Button>
                <Button variant="outline" size="lg" className="w-full border-amber-500/30 text-amber-400">
                  <Truck className="w-5 h-5 mr-2" /> Request Ambulance
                </Button>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setSosModalOpen(false)}>Cancel</Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DoctorDashboard;