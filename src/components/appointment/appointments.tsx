// src/pages/Appointments.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, List, Plus, Search, Download, Clock, MapPin,
  Video, Phone, User, Stethoscope, CheckCircle, XCircle,
  AlertCircle, TrendingUp, Activity, SlidersHorizontal,
  RefreshCw, ArrowRight, FileText, Filter
} from 'lucide-react';
import { AppointmentList } from '@/components/appointment/AppointmentList';
import { Modal } from '@/components/ui/Modal';

// ============================================
// TYPES
// ============================================
interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty?: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  date: string;
  time: string;
  duration: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'checkup' | 'procedure';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  location: 'in-person' | 'video' | 'phone';
  priority: 'low' | 'medium' | 'high';
  notes?: string;
  symptoms?: string;
  contact?: string;
  room?: string;
}

interface AppointmentStats {
  total: number;
  today: number;
  upcoming: number;
  completed: number;
  cancelled: number;
  inProgress: number;
  emergency: number;
}

// ============================================
// MOCK DATA
// ============================================
const initialAppointments: Appointment[] = [
  {
    id: '1', doctorId: '1', doctorName: 'Dr. Sarah Wilson', doctorSpecialty: 'Cardiology',
    patientId: 'p1', patientName: 'John Doe', date: new Date().toISOString().split('T')[0],
    time: '10:00 AM', duration: '30 min', type: 'consultation', status: 'confirmed',
    location: 'video', priority: 'medium', symptoms: 'Chest pain and shortness of breath'
  },
  {
    id: '2', doctorId: '2', doctorName: 'Dr. James Lee', doctorSpecialty: 'Neurology',
    patientId: 'p2', patientName: 'Jane Smith', date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '02:30 PM', duration: '45 min', type: 'follow-up', status: 'scheduled',
    location: 'in-person', priority: 'low', notes: 'Follow-up after previous consultation'
  },
  {
    id: '3', doctorId: '1', doctorName: 'Dr. Sarah Wilson', doctorSpecialty: 'Cardiology',
    patientId: 'p3', patientName: 'Robert Johnson', date: new Date().toISOString().split('T')[0],
    time: '11:30 AM', duration: '20 min', type: 'emergency', status: 'in-progress',
    location: 'video', priority: 'high', symptoms: 'Severe headache and dizziness'
  },
  {
    id: '4', doctorId: '3', doctorName: 'Dr. Emily Chen', doctorSpecialty: 'Pediatrics',
    patientId: 'p4', patientName: 'Maria Garcia', date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    time: '09:00 AM', duration: '30 min', type: 'checkup', status: 'scheduled',
    location: 'in-person', priority: 'low'
  },
  {
    id: '5', doctorId: '4', doctorName: 'Dr. Michael Park', doctorSpecialty: 'Orthopedics',
    patientId: 'p5', patientName: 'David Kim', date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    time: '03:00 PM', duration: '45 min', type: 'procedure', status: 'completed',
    location: 'in-person', priority: 'medium', notes: 'Knee surgery follow-up'
  },
  {
    id: '6', doctorId: '2', doctorName: 'Dr. James Lee', doctorSpecialty: 'Neurology',
    patientId: 'p6', patientName: 'Lisa Thompson', date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    time: '01:00 PM', duration: '30 min', type: 'consultation', status: 'cancelled',
    location: 'phone', priority: 'low'
  },
];

const doctorsList = [
  { id: '1', name: 'Dr. Sarah Wilson', specialty: 'Cardiology', rating: 4.9 },
  { id: '2', name: 'Dr. James Lee', specialty: 'Neurology', rating: 4.8 },
  { id: '3', name: 'Dr. Emily Chen', specialty: 'Pediatrics', rating: 4.7 },
  { id: '4', name: 'Dr. Michael Park', specialty: 'Orthopedics', rating: 4.6 },
];

// ============================================
// MAIN COMPONENT
// ============================================
export const Appointments: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('list');
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0, today: 0, upcoming: 0, completed: 0, cancelled: 0, inProgress: 0, emergency: 0
  });

  // Calculate statistics
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    setStats({
      total: appointments.length,
      today: appointments.filter(a => a.date === today).length,
      upcoming: appointments.filter(a => new Date(a.date) > now && a.status !== 'cancelled').length,
      completed: appointments.filter(a => a.status === 'completed').length,
      cancelled: appointments.filter(a => a.status === 'cancelled').length,
      inProgress: appointments.filter(a => a.status === 'in-progress').length,
      emergency: appointments.filter(a => a.type === 'emergency').length,
    });
  }, [appointments]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  }, []);

  const handleAppointmentClick = useCallback((appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  }, []);

  const handleStatusChange = useCallback((id: string, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt));
  }, []);

  const handleAppointmentDelete = useCallback((id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  }, []);

  const statCards = useMemo(() => [
    { label: 'Total', value: stats.total, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Today', value: stats.today, icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Upcoming', value: stats.upcoming, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Active', value: stats.inProgress, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Emergency', value: stats.emergency, icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  ], [stats]);

  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* ============================================ */}
        {/* HEADER */}
        {/* ============================================ */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em]">Appointments</h1>
            <p className="text-white/35 text-sm mt-1">Manage and track all patient appointments</p>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={handleRefresh}
              className="p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white/40 hover:text-white/70 transition-all">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            <button type="button"
              className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/60 text-sm font-medium hover:bg-white/[0.06] transition-all">
              <Download className="w-4 h-4" /> Export
            </button>
            <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-medium hover:bg-white/90 transition-all">
              <Plus className="w-4 h-4" /> New Appointment
            </motion.button>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* STATS ROW */}
        {/* ============================================ */}
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {statCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -2 }} className={`${stat.bg} rounded-xl border border-white/[0.06] p-4 text-center hover:border-white/[0.12] transition-all`}>
                <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-white/35 text-[11px] font-medium">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* ============================================ */}
        {/* VIEW TOGGLE & FILTERS */}
        {/* ============================================ */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1">
            <button type="button" onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/70'}`}>
              <List className="w-4 h-4" /> List View
            </button>
            <button type="button" onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'calendar' ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/70'}`}>
              <Calendar className="w-4 h-4" /> Calendar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search appointments..." className="w-48 pl-9 pr-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/15 transition-all" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white/70 text-sm focus:outline-none cursor-pointer">
              <option value="all" className="bg-[#1a1a2e]">All Status</option>
              <option value="scheduled" className="bg-[#1a1a2e]">Scheduled</option>
              <option value="confirmed" className="bg-[#1a1a2e]">Confirmed</option>
              <option value="in-progress" className="bg-[#1a1a2e]">In Progress</option>
              <option value="completed" className="bg-[#1a1a2e]">Completed</option>
              <option value="cancelled" className="bg-[#1a1a2e]">Cancelled</option>
            </select>
            <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white/70 text-sm focus:outline-none cursor-pointer">
              <option value="all" className="bg-[#1a1a2e]">All Types</option>
              <option value="consultation" className="bg-[#1a1a2e]">Consultation</option>
              <option value="follow-up" className="bg-[#1a1a2e]">Follow-up</option>
              <option value="emergency" className="bg-[#1a1a2e]">Emergency</option>
              <option value="checkup" className="bg-[#1a1a2e]">Checkup</option>
              <option value="procedure" className="bg-[#1a1a2e]">Procedure</option>
            </select>
          </div>
        </div>

        {/* ============================================ */}
        {/* APPOINTMENT LIST */}
        {/* ============================================ */}
        <AppointmentList
          appointments={appointments}
          doctors={doctorsList}
          showFilters={false}
          showActions
          realTime
          onAppointmentClick={handleAppointmentClick}
          onAppointmentEdit={handleAppointmentClick}
          onAppointmentDelete={handleAppointmentDelete}
          onStatusChange={handleStatusChange}
        />

        {/* ============================================ */}
        {/* APPOINTMENT DETAILS MODAL */}
        {/* ============================================ */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Appointment Details" size="lg">
          {selectedAppointment && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg">{selectedAppointment.patientName.charAt(0)}</div>
                  <div>
                    <h3 className="text-white font-semibold">{selectedAppointment.patientName}</h3>
                    <p className="text-white/35 text-xs">ID: {selectedAppointment.patientId}</p>
                  </div>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium border ${
                  selectedAppointment.status === 'confirmed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                  selectedAppointment.status === 'in-progress' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                  selectedAppointment.status === 'completed' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                  selectedAppointment.status === 'cancelled' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                  'bg-blue-500/10 text-blue-400 border-blue-500/20'
                }`}>
                  {selectedAppointment.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Stethoscope, label: 'Doctor', value: selectedAppointment.doctorName, sub: selectedAppointment.doctorSpecialty },
                  { icon: Calendar, label: 'Date & Time', value: `${selectedAppointment.date} at ${selectedAppointment.time}`, sub: selectedAppointment.duration },
                  { icon: Activity, label: 'Type', value: selectedAppointment.type, sub: `Priority: ${selectedAppointment.priority}` },
                  { icon: selectedAppointment.location === 'video' ? Video : selectedAppointment.location === 'phone' ? Phone : MapPin, label: 'Location', value: selectedAppointment.location, sub: selectedAppointment.room || 'N/A' },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                      <div className="flex items-center gap-2 text-white/30 text-xs mb-1"><Icon className="w-3.5 h-3.5" />{item.label}</div>
                      <p className="text-white text-sm font-medium capitalize">{item.value}</p>
                      <p className="text-white/25 text-[10px] mt-0.5">{item.sub}</p>
                    </div>
                  );
                })}
              </div>

              {selectedAppointment.symptoms && (
                <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Symptoms</p>
                  <p className="text-white/70 text-sm">{selectedAppointment.symptoms}</p>
                </div>
              )}
              {selectedAppointment.notes && (
                <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]">
                  <p className="text-white/40 text-xs uppercase tracking-wider mb-2">Notes</p>
                  <p className="text-white/70 text-sm">{selectedAppointment.notes}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/60 text-sm font-medium hover:bg-white/[0.06] transition-all">Close</button>
                <button type="button" className="flex-1 py-2.5 bg-white text-black rounded-xl text-sm font-medium hover:bg-white/90 transition-all flex items-center justify-center gap-1.5"><Calendar className="w-4 h-4" /> Reschedule</button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Appointments;