// src/pages/doctor/DoctorDashboard.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { Link } from 'react-router-dom';
import {
  Stethoscope, Users, Calendar, TrendingUp,
  AlertCircle, Video, DollarSign, Star,
  Clock, ChevronRight, CheckCircle2, XCircle,
  Activity, Bell, FileText, Phone, MapPin,
  Pill, Search, Filter, Plus, ArrowRight,
  Heart, MessageCircle, BarChart3, Settings
} from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { stats, appointments, emergencies, videoConsultations, patients } = useSelector(
    (state: RootState) => state.doctor
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const mockStats = {
    totalPatients: 234,
    todayAppointments: 8,
    completedToday: 5,
    pendingEmergencies: 2,
    videoConsultations: 3,
    earningsToday: 1200,
    onlineStatus: true,
    totalPrescriptions: 45,
    averageConsultationTime: '15 mins',
  };

  const mockAppointments = [
    { id: 'a1', patientId: 'p1', patientName: 'John Doe', patientAge: 45, patientGender: 'male', date: '2024-11-20', time: '09:00 AM', duration: 30, status: 'upcoming', type: 'in-person', reason: 'Heart checkup', isEmergency: false },
    { id: 'a2', patientId: 'p2', patientName: 'Jane Smith', patientAge: 32, patientGender: 'female', date: '2024-11-20', time: '09:30 AM', duration: 45, status: 'ongoing', type: 'video', reason: 'Blood pressure', isEmergency: false },
    { id: 'a3', patientId: 'p3', patientName: 'Robert Brown', patientAge: 58, patientGender: 'male', date: '2024-11-20', time: '10:30 AM', duration: 30, status: 'upcoming', type: 'in-person', reason: 'Chest pain - EMERGENCY', isEmergency: true },
    { id: 'a4', patientId: 'p4', patientName: 'Emily White', patientAge: 27, patientGender: 'female', date: '2024-11-20', time: '11:30 AM', duration: 30, status: 'upcoming', type: 'phone', reason: 'Medication review', isEmergency: false },
    { id: 'a5', patientId: 'p5', patientName: 'Michael Green', patientAge: 62, patientGender: 'male', date: '2024-11-20', time: '02:00 PM', duration: 45, status: 'upcoming', type: 'in-person', reason: 'ECG follow-up', isEmergency: false },
  ];

  const mockEmergencies = [
    { id: 'e1', patientName: 'Michael Green', patientAge: 62, condition: 'Severe chest pain with shortness of breath', severity: 'critical', location: 'City General ER', timestamp: '5 mins ago', status: 'pending', bloodGroup: 'O+', unitsNeeded: 2 },
    { id: 'e2', patientName: 'Lisa Anderson', patientAge: 34, condition: 'Heart palpitations and dizziness', severity: 'high', location: 'Metro Medical Center', timestamp: '15 mins ago', status: 'pending' },
  ];

  const mockVideoConsultations = [
    { id: 'v1', patientName: 'David Wilson', scheduledTime: '09:30 AM', duration: 45, status: 'ongoing', reason: 'Follow-up consultation' },
    { id: 'v2', patientName: 'Maria Garcia', scheduledTime: '01:00 PM', duration: 30, status: 'waiting', reason: 'New symptoms evaluation' },
    { id: 'v3', patientName: 'Tom Harris', scheduledTime: '03:30 PM', duration: 30, status: 'waiting', reason: 'Test results discussion' },
  ];

  const todayPatients = [
    { name: 'John Doe', time: '09:00 AM', type: 'Checkup', status: 'waiting' },
    { name: 'Jane Smith', time: '09:30 AM', type: 'Video Call', status: 'in-session' },
    { name: 'Robert Brown', time: '10:30 AM', type: 'Emergency', status: 'next' },
    { name: 'Emily White', time: '11:30 AM', type: 'Phone Call', status: 'waiting' },
    { name: 'Michael Green', time: '02:00 PM', type: 'Follow-up', status: 'waiting' },
  ];

  return (
    <div className="min-h-screen bg-[#050508] flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-[#08080d] border-r border-white/[0.04] fixed left-0 top-0 flex flex-col z-10">
        {/* Logo */}
        <div className="p-6 border-b border-white/[0.04]">
          <Link to="/doctor/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg">Doctor Panel</h1>
              <p className="text-white/30 text-xs">Medical Dashboard</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {[
            { icon: Activity, label: 'Dashboard', path: '/doctor/dashboard', active: true },
            { icon: Calendar, label: 'Appointments', path: '/doctor/appointments' },
            { icon: Users, label: 'My Patients', path: '/doctor/patients' },
            { icon: FileText, label: 'Prescriptions', path: '/doctor/prescriptions' },
            { icon: Video, label: 'Video Calls', path: '/doctor/video-consultation' },
            { icon: AlertCircle, label: 'Emergency', path: '/doctor/emergency' },
            { icon: TrendingUp, label: 'Earnings', path: '/doctor/earnings' },
            { icon: BarChart3, label: 'Reports', path: '/doctor/reports' },
            { icon: Settings, label: 'Settings', path: '/doctor/settings' },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    item.active
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                      : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'
                  }`}>
                  <Icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.label}</span>
                </motion.div>
              </Link>
            );
          })}
        </nav>

        {/* Doctor Profile */}
        <div className="p-4 border-t border-white/[0.04]">
          <div className="flex items-center gap-3 px-3 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
            <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="Doctor"
              className="w-10 h-10 rounded-xl object-cover" />
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Dr. Sarah Johnson</p>
              <p className="text-emerald-400 text-xs">Cardiologist</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Welcome back,{' '}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                Dr. Sarah
              </span>
            </h1>
            <p className="text-white/40 text-sm mt-1 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Online Toggle */}
            <button className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition-all">
              <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-sm font-medium">Online</span>
            </button>

            {/* Notifications */}
            <button className="relative p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">5</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-6 gap-4 mb-8">
          {[
            { label: 'Total Patients', value: mockStats.totalPatients, icon: Users, color: 'from-blue-500 to-cyan-500' },
            { label: "Today's Appointments", value: mockStats.todayAppointments, icon: Calendar, color: 'from-emerald-500 to-teal-500' },
            { label: 'Completed Today', value: mockStats.completedToday, icon: CheckCircle2, color: 'from-green-500 to-emerald-500' },
            { label: 'Emergency Cases', value: mockStats.pendingEmergencies, icon: AlertCircle, color: 'from-red-500 to-rose-500' },
            { label: 'Video Calls', value: mockStats.videoConsultations, icon: Video, color: 'from-purple-500 to-violet-500' },
            { label: "Today's Earnings", value: `$${mockStats.earningsToday}`, icon: DollarSign, color: 'from-amber-500 to-orange-500' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-emerald-500/20 transition-all cursor-default">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-white/40 text-xs mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-3 gap-6">
          {/* Today's Appointments - Span 2 */}
          <div className="col-span-2 space-y-6">
            {/* Appointments */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                  Today's Appointments
                </h3>
                <Link to="/doctor/appointments" className="text-emerald-400 text-sm hover:text-emerald-300 flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="space-y-3">
                {mockAppointments.map((appt, i) => (
                  <motion.div key={appt.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                    whileHover={{ x: 4 }}
                    className={`p-4 rounded-xl border transition-all ${
                      appt.isEmergency ? 'bg-red-500/5 border-red-500/20' : 'bg-white/[0.02] border-white/[0.04] hover:border-emerald-500/20'
                    }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          appt.isEmergency ? 'bg-red-500/10' : appt.type === 'video' ? 'bg-purple-500/10' : 'bg-emerald-500/10'
                        }`}>
                          {appt.isEmergency ? <AlertCircle className="w-6 h-6 text-red-400" /> :
                           appt.type === 'video' ? <Video className="w-6 h-6 text-purple-400" /> :
                           appt.type === 'phone' ? <Phone className="w-6 h-6 text-blue-400" /> :
                           <Stethoscope className="w-6 h-6 text-emerald-400" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-medium">{appt.patientName}</h4>
                            <span className="text-white/20 text-xs">{appt.patientAge} yrs</span>
                            <span className="text-white/20">•</span>
                            <span className="text-white/40 text-xs capitalize">{appt.patientGender}</span>
                          </div>
                          <p className="text-white/40 text-xs">{appt.reason}</p>
                          <div className="flex items-center gap-3 mt-1.5">
                            <span className="text-white/30 text-xs flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {appt.time} ({appt.duration} min)
                            </span>
                            <span className="text-white/30 text-xs capitalize px-2 py-0.5 rounded-md bg-white/[0.03]">
                              {appt.type}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                          appt.status === 'ongoing' ? 'bg-amber-500/10 text-amber-400 animate-pulse' :
                          appt.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' :
                          'bg-blue-500/10 text-blue-400'
                        }`}>
                          {appt.status}
                        </span>
                        {appt.status === 'upcoming' && (
                          <div className="flex gap-1.5">
                            <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all">
                              Start
                            </button>
                            <button className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all">
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Prescription Management */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <Pill className="w-5 h-5 text-purple-400" />
                  Recent Prescriptions
                </h3>
                <button className="px-4 py-2 rounded-xl bg-purple-500/10 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-all flex items-center gap-2">
                  <Plus className="w-4 h-4" /> New Prescription
                </button>
              </div>
              <div className="space-y-3">
                {[
                  { patient: 'John Doe', date: '2024-11-19', meds: 'Amlodipine 5mg, Aspirin 81mg', status: 'active' },
                  { patient: 'Jane Smith', date: '2024-11-18', meds: 'Metformin 500mg', status: 'active' },
                  { patient: 'Robert Brown', date: '2024-11-17', meds: 'Atorvastatin 10mg', status: 'completed' },
                ].map((pres, i) => (
                  <motion.div key={i} whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-purple-500/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-purple-400" />
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-medium">{pres.patient}</h4>
                        <p className="text-white/40 text-xs">{pres.meds}</p>
                        <p className="text-white/30 text-[10px] mt-0.5">{pres.date}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-medium ${
                      pres.status === 'active' ? 'bg-purple-500/10 text-purple-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>{pres.status}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Emergency Requests */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-red-950/20 via-red-500/5 to-amber-950/20 border border-red-500/10">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 animate-pulse" />
                Emergency Requests
                <span className="text-red-400 text-xs font-medium px-2 py-0.5 rounded-md bg-red-500/10 ml-auto">
                  {mockEmergencies.length} pending
                </span>
              </h3>
              <div className="space-y-3">
                {mockEmergencies.map((emergency, i) => (
                  <motion.div key={emergency.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl bg-white/[0.02] border border-red-500/10">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="text-white text-sm font-medium">{emergency.patientName}</h4>
                        <p className="text-red-400/80 text-xs">{emergency.condition}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        emergency.severity === 'critical' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/10 text-amber-400'
                      }`}>{emergency.severity}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/30 mb-3">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {emergency.location}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {emergency.timestamp}</span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all">
                        Accept
                      </button>
                      <button className="flex-1 py-2 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all">
                        Decline
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Video Consultations */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Video className="w-5 h-5 text-purple-400" />
                Video Consultations
              </h3>
              <div className="space-y-3">
                {mockVideoConsultations.map((consult, i) => (
                  <motion.div key={consult.id} whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-purple-500/20 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        consult.status === 'ongoing' ? 'bg-purple-500/20' : 'bg-purple-500/10'
                      }`}>
                        <Video className={`w-5 h-5 ${consult.status === 'ongoing' ? 'text-purple-400 animate-pulse' : 'text-purple-400'}`} />
                      </div>
                      <div>
                        <h4 className="text-white text-sm font-medium">{consult.patientName}</h4>
                        <p className="text-white/40 text-xs">{consult.reason}</p>
                        <p className="text-white/30 text-[10px] mt-0.5">{consult.scheduledTime} • {consult.duration} min</p>
                      </div>
                    </div>
                    <button className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                      consult.status === 'ongoing' ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20'
                    } transition-all`}>
                      {consult.status === 'ongoing' ? 'Join' : 'Start'}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Quick Patient Search */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-cyan-400" />
                Quick Patient Search
              </h3>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input type="text" placeholder="Search patient..."
                  className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm outline-none focus:border-cyan-400/50 transition-all" />
              </div>
              <div className="space-y-2">
                {todayPatients.map((patient, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/[0.03] cursor-pointer transition-all">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                        <Users className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-white text-xs font-medium">{patient.name}</p>
                        <p className="text-white/30 text-[10px]">{patient.time} • {patient.type}</p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium ${
                      patient.status === 'in-session' ? 'text-amber-400' : 'text-white/30'
                    }`}>{patient.status}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom Section - Earnings & Hospital Activity */}
        <div className="grid grid-cols-2 gap-6 mt-8">
          {/* Earnings Analytics */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Earnings Analytics
            </h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Today', value: '$1,200', color: 'text-emerald-400' },
                { label: 'Yesterday', value: '$950', color: 'text-blue-400' },
                { label: 'This Week', value: '$8,400', color: 'text-purple-400' },
                { label: 'This Month', value: '$36,000', color: 'text-amber-400' },
              ].map((item, i) => (
                <div key={i} className="text-center p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <p className="text-white/40 text-xs">{item.label}</p>
                  <p className={`text-lg font-bold mt-1 ${item.color}`}>{item.value}</p>
                </div>
              ))}
            </div>
            {/* Simple bar chart */}
            <div className="flex items-end gap-2 h-32">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => {
                const heights = [60, 80, 45, 90, 70, 30, 50];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <motion.div initial={{ height: 0 }} animate={{ height: heights[i] * 1.2 }}
                      className="w-full bg-gradient-to-t from-emerald-500/60 to-emerald-400 rounded-t-lg" />
                    <span className="text-white/30 text-[10px]">{day}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Hospital Activity */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <h3 className="text-white font-semibold text-lg mb-6 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400" />
              Hospital Activity
            </h3>
            <div className="space-y-3">
              {[
                { title: 'Total Patients Today', value: '45', icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                { title: 'ER Admissions', value: '12', icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
                { title: 'Surgeries Scheduled', value: '3', icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                { title: 'Beds Available', value: '28', icon: MapPin, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                { title: 'Staff on Duty', value: '18', icon: Users, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              ].map((item, i) => (
                <motion.div key={i} whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${item.bg} flex items-center justify-center`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <span className="text-white/70 text-sm">{item.title}</span>
                  </div>
                  <span className={`text-lg font-bold ${item.color}`}>{item.value}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;