// src/pages/Appointments.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, List, Plus, Search, Download, Clock, MapPin,
  Video, Phone, User, Stethoscope, CheckCircle, XCircle,
  AlertCircle, TrendingUp, Activity, RefreshCw, CalendarDays,
  Filter, Edit2, Share2, Printer, FileText, DollarSign,
  Shield, Sparkles, Grid, Trash2, Mail, Send
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Input } from '@/components/ui/Input';
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
  patientAge?: number;
  patientGender?: string;
  patientBloodGroup?: string;
  date: string;
  time: string;
  duration: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'checkup' | 'procedure' | 'vaccination';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  location: 'in-person' | 'video' | 'phone';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  symptoms?: string;
  diagnosis?: string;
  contact?: string;
  email?: string;
  room?: string;
  floor?: string;
  building?: string;
  insuranceProvider?: string;
  policyNumber?: string;
  paymentStatus?: 'paid' | 'pending' | 'unpaid' | 'refunded';
  amount?: string;
  copay?: string;
  labTests?: string[];
  isEmergency?: boolean;
}

interface AppointmentStats {
  total: number; today: number; upcoming: number; completed: number;
  cancelled: number; inProgress: number; emergency: number; noShow: number;
  virtual: number; inPerson: number; phoneConsult: number;
}

interface Doctor {
  id: string; name: string; specialty: string; rating: number;
  availability?: 'available' | 'busy' | 'offline';
}

// ============================================
// MOCK DATA
// ============================================
const initialAppointments: Appointment[] = [
  { id: 'APT-001', doctorId: '1', doctorName: 'Dr. Sarah Wilson', doctorSpecialty: 'Cardiology', patientId: 'PAT-1001', patientName: 'Johnathan Doe', patientAge: 45, patientGender: 'Male', patientBloodGroup: 'O+', date: new Date().toISOString().split('T')[0], time: '10:00 AM', duration: '30 min', type: 'consultation', status: 'confirmed', location: 'video', priority: 'medium', symptoms: 'Chest pain, shortness of breath', contact: '+1 (555) 123-4567', email: 'john@email.com', room: 'Virtual A', insuranceProvider: 'BlueCross', policyNumber: 'BC-2024-78945', paymentStatus: 'paid', amount: '$250', copay: '$25', labTests: ['ECG', 'Lipid Profile'], isEmergency: false },
  { id: 'APT-002', doctorId: '2', doctorName: 'Dr. James Lee', doctorSpecialty: 'Neurology', patientId: 'PAT-1002', patientName: 'Jane Smith', patientAge: 32, patientGender: 'Female', patientBloodGroup: 'A+', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '02:30 PM', duration: '45 min', type: 'follow-up', status: 'scheduled', location: 'in-person', priority: 'low', notes: 'Post-migraine follow-up', contact: '+1 (555) 234-5678', room: 'Room 302', floor: '3rd Floor', building: 'West Wing', insuranceProvider: 'Aetna', policyNumber: 'AET-2024-33421', paymentStatus: 'pending', amount: '$180', copay: '$20' },
  { id: 'APT-003', doctorId: '1', doctorName: 'Dr. Sarah Wilson', doctorSpecialty: 'Cardiology', patientId: 'PAT-1003', patientName: 'Robert Johnson', patientAge: 58, patientGender: 'Male', patientBloodGroup: 'B+', date: new Date().toISOString().split('T')[0], time: '11:30 AM', duration: '20 min', type: 'emergency', status: 'in-progress', location: 'video', priority: 'urgent', symptoms: 'Severe headache, dizziness', contact: '+1 (555) 345-6789', room: 'Virtual B', insuranceProvider: 'UnitedHealth', policyNumber: 'UH-2024-56789', paymentStatus: 'paid', amount: '$500', copay: '$50', labTests: ['CT Scan', 'MRI'], isEmergency: true },
  { id: 'APT-004', doctorId: '3', doctorName: 'Dr. Emily Chen', doctorSpecialty: 'Pediatrics', patientId: 'PAT-1004', patientName: 'Maria Garcia', patientAge: 28, patientGender: 'Female', patientBloodGroup: 'AB+', date: new Date(Date.now() + 172800000).toISOString().split('T')[0], time: '09:00 AM', duration: '30 min', type: 'checkup', status: 'scheduled', location: 'in-person', priority: 'low', room: 'Room 105', floor: '1st Floor', building: 'East Wing', insuranceProvider: 'Cigna', policyNumber: 'CIG-2024-90123', paymentStatus: 'unpaid', amount: '$150', copay: '$15' },
  { id: 'APT-005', doctorId: '4', doctorName: 'Dr. Michael Park', doctorSpecialty: 'Orthopedics', patientId: 'PAT-1005', patientName: 'David Kim', patientAge: 52, patientGender: 'Male', patientBloodGroup: 'O-', date: new Date(Date.now() - 86400000).toISOString().split('T')[0], time: '03:00 PM', duration: '45 min', type: 'procedure', status: 'completed', location: 'in-person', priority: 'medium', diagnosis: '90% recovery achieved', room: 'OR 2', floor: '2nd Floor', building: 'Surgical Wing', insuranceProvider: 'Humana', policyNumber: 'HUM-2024-45678', paymentStatus: 'paid', amount: '$1,200', copay: '$100' },
  { id: 'APT-006', doctorId: '2', doctorName: 'Dr. James Lee', doctorSpecialty: 'Neurology', patientId: 'PAT-1006', patientName: 'Lisa Thompson', patientAge: 41, patientGender: 'Female', date: new Date(Date.now() - 172800000).toISOString().split('T')[0], time: '01:00 PM', duration: '30 min', type: 'consultation', status: 'cancelled', location: 'phone', priority: 'low', insuranceProvider: 'BlueCross', paymentStatus: 'refunded', amount: '$250', copay: '$25' },
  { id: 'APT-007', doctorId: '3', doctorName: 'Dr. Emily Chen', doctorSpecialty: 'Pediatrics', patientId: 'PAT-1007', patientName: 'Emma Wilson', patientAge: 35, patientGender: 'Female', date: new Date().toISOString().split('T')[0], time: '03:30 PM', duration: '30 min', type: 'checkup', status: 'scheduled', location: 'in-person', priority: 'medium', room: 'Room 108', floor: '1st Floor', insuranceProvider: 'Aetna', paymentStatus: 'pending', amount: '$150', copay: '$15' },
  { id: 'APT-008', doctorId: '4', doctorName: 'Dr. Michael Park', doctorSpecialty: 'Orthopedics', patientId: 'PAT-1008', patientName: 'Thomas Brown', patientAge: 47, patientGender: 'Male', date: new Date(Date.now() + 86400000).toISOString().split('T')[0], time: '10:00 AM', duration: '60 min', type: 'procedure', status: 'confirmed', location: 'in-person', priority: 'high', notes: 'Hip replacement consultation', room: 'OR 1', floor: '2nd Floor', building: 'Surgical Wing', insuranceProvider: 'Cigna', paymentStatus: 'paid', amount: '$800', copay: '$75', labTests: ['X-Ray', 'MRI', 'Blood Panel'] },
  { id: 'APT-009', doctorId: '1', doctorName: 'Dr. Sarah Wilson', doctorSpecialty: 'Cardiology', patientId: 'PAT-1009', patientName: 'Anna White', patientAge: 55, patientGender: 'Female', date: new Date(Date.now() + 259200000).toISOString().split('T')[0], time: '11:00 AM', duration: '30 min', type: 'follow-up', status: 'scheduled', location: 'video', priority: 'medium', notes: 'Hypertension follow-up', room: 'Virtual C', insuranceProvider: 'UnitedHealth', paymentStatus: 'pending', amount: '$180', copay: '$20' },
  { id: 'APT-010', doctorId: '2', doctorName: 'Dr. James Lee', doctorSpecialty: 'Neurology', patientId: 'PAT-1010', patientName: 'Mark Davis', patientAge: 62, patientGender: 'Male', date: new Date(Date.now() - 259200000).toISOString().split('T')[0], time: '09:30 AM', duration: '45 min', type: 'vaccination', status: 'no-show', location: 'in-person', priority: 'high', room: 'Room 205', floor: '2nd Floor', insuranceProvider: 'Humana', paymentStatus: 'unpaid', amount: '$350', copay: '$35' },
];

const doctorsList: Doctor[] = [
  { id: '1', name: 'Dr. Sarah Wilson', specialty: 'Cardiology', rating: 4.9, availability: 'available' },
  { id: '2', name: 'Dr. James Lee', specialty: 'Neurology', rating: 4.8, availability: 'busy' },
  { id: '3', name: 'Dr. Emily Chen', specialty: 'Pediatrics', rating: 4.7, availability: 'available' },
  { id: '4', name: 'Dr. Michael Park', specialty: 'Orthopedics', rating: 4.6, availability: 'offline' },
];

// ============================================
// MAIN COMPONENT
// ============================================
export const Appointments: React.FC = () => {
  const [appointments] = useState<Appointment[]>(initialAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isNewAppointmentModal, setIsNewAppointmentModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'today' | 'upcoming' | 'past' | 'emergency'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'time' | 'priority' | 'status'>('date');
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const today = new Date().toISOString().split('T')[0];

  const stats: AppointmentStats = useMemo(() => ({
    total: appointments.length, today: appointments.filter(a => a.date === today).length,
    upcoming: appointments.filter(a => a.date > today && a.status !== 'cancelled').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    inProgress: appointments.filter(a => a.status === 'in-progress').length,
    emergency: appointments.filter(a => a.type === 'emergency' || a.isEmergency).length,
    noShow: appointments.filter(a => a.status === 'no-show').length,
    virtual: appointments.filter(a => a.location === 'video').length,
    inPerson: appointments.filter(a => a.location === 'in-person').length,
    phoneConsult: appointments.filter(a => a.location === 'phone').length,
  }), [appointments, today]);

  const filteredAppointments = useMemo(() => {
    let filtered = [...appointments];
    if (activeTab === 'today') filtered = filtered.filter(a => a.date === today);
    else if (activeTab === 'upcoming') filtered = filtered.filter(a => a.date >= today && a.status !== 'cancelled');
    else if (activeTab === 'past') filtered = filtered.filter(a => a.date < today || a.status === 'completed');
    else if (activeTab === 'emergency') filtered = filtered.filter(a => a.type === 'emergency' || a.isEmergency);

    const q = searchQuery.toLowerCase();
    if (q) filtered = filtered.filter(a => a.patientName.toLowerCase().includes(q) || a.doctorName.toLowerCase().includes(q) || a.id.toLowerCase().includes(q));
    if (statusFilter !== 'all') filtered = filtered.filter(a => a.status === statusFilter);
    if (typeFilter !== 'all') filtered = filtered.filter(a => a.type === typeFilter);
    if (priorityFilter !== 'all') filtered = filtered.filter(a => a.priority === priorityFilter);
    if (locationFilter !== 'all') filtered = filtered.filter(a => a.location === locationFilter);

    filtered.sort((a, b) => {
      if (sortBy === 'date') return new Date(a.date).getTime() - new Date(b.date).getTime();
      if (sortBy === 'time') return a.time.localeCompare(b.time);
      if (sortBy === 'priority') return (a.priority || '').localeCompare(b.priority || '');
      return a.status.localeCompare(b.status);
    });
    return filtered;
  }, [appointments, searchQuery, statusFilter, typeFilter, priorityFilter, locationFilter, sortBy, activeTab, today]);

  const handleRefresh = useCallback(() => { setIsRefreshing(true); setTimeout(() => setIsRefreshing(false), 1200); }, []);
  const activeFilterCount = [statusFilter, typeFilter, priorityFilter, locationFilter].filter(f => f !== 'all').length;

  const getStatusBadge = (status: Appointment['status']) => {
    const config: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info'; text: string; icon: React.ElementType }> = {
      scheduled: { variant: 'warning', text: 'Scheduled', icon: Clock }, confirmed: { variant: 'success', text: 'Confirmed', icon: CheckCircle },
      'in-progress': { variant: 'warning', text: 'In Progress', icon: Activity }, completed: { variant: 'info', text: 'Completed', icon: CheckCircle },
      cancelled: { variant: 'danger', text: 'Cancelled', icon: XCircle }, 'no-show': { variant: 'danger', text: 'No Show', icon: AlertCircle },
    };
    const c = config[status];
    return c ? <Badge variant={c.variant} size="xs" className="gap-1"><c.icon className="w-3 h-3" />{c.text}</Badge> : <Badge variant="info" size="xs">{status}</Badge>;
  };

  const getPaymentBadge = (status?: string) => {
    const config: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info'; text: string }> = {
      paid: { variant: 'success', text: 'Paid' }, pending: { variant: 'warning', text: 'Pending' },
      unpaid: { variant: 'danger', text: 'Unpaid' }, refunded: { variant: 'info', text: 'Refunded' },
    };
    const c = status ? config[status] : null;
    return c ? <Badge variant={c.variant} size="xs">{c.text}</Badge> : null;
  };

  const statCards = [
    { label: 'Total', value: stats.total, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Today', value: stats.today, icon: Clock, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Upcoming', value: stats.upcoming, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Active', value: stats.inProgress, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Done', value: stats.completed, icon: CheckCircle, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Emergency', value: stats.emergency, icon: AlertCircle, color: 'text-orange-400', bg: 'bg-orange-500/10' },
    { label: 'No Show', value: stats.noShow, icon: User, color: 'text-gray-400', bg: 'bg-gray-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-white/[0.04]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/20">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em]">Appointments</h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20 animate-pulse">Live</span>
              </div>
              <p className="text-white/35 text-sm mt-1">Enterprise appointment management system</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 border border-white/[0.06]">
              <button type="button" onClick={() => setViewMode('card')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'card' ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/70'}`}><Grid className="w-4 h-4" /> Cards</button>
              <button type="button" onClick={() => setViewMode('table')} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'table' ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/70'}`}><List className="w-4 h-4" /> Table</button>
            </div>
            <Button variant="glass" size="sm" onClick={handleRefresh}><RefreshCw className={`w-4 h-4 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />Refresh</Button>
            <Button variant="glass" size="sm"><Download className="w-4 h-4 mr-1.5" />Export</Button>
            <Button variant="gradient" size="sm" onClick={() => setIsNewAppointmentModal(true)}><Plus className="w-4 h-4 mr-1.5" />New</Button>
          </div>
        </motion.div>

        {/* LOCATION STATS */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-white/30 text-xs font-medium uppercase tracking-wider">Types:</span>
          {[{ label: 'In-Person', value: stats.inPerson, color: 'text-emerald-400', bg: 'bg-emerald-500/10' }, { label: 'Virtual', value: stats.virtual, color: 'text-indigo-400', bg: 'bg-indigo-500/10' }, { label: 'Phone', value: stats.phoneConsult, color: 'text-amber-400', bg: 'bg-amber-500/10' }].map((item, i) => (
            <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${item.bg} border border-white/[0.06]`}>
              <span className={`w-2 h-2 rounded-full ${item.color.replace('text-', 'bg-')}`} />
              <span className="text-white text-xs font-medium">{item.value}</span><span className="text-white/30 text-[10px]">{item.label}</span>
            </div>
          ))}
        </div>

        {/* STATS GRID */}
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {statCards.map((stat, i) => { const Icon = stat.icon; return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} whileHover={{ y: -2 }}
              className={`${stat.bg} rounded-xl border border-white/[0.06] p-3 text-center hover:border-white/[0.15] transition-all cursor-default`}>
              <Icon className={`w-4 h-4 mx-auto mb-1.5 ${stat.color}`} /><div className="text-lg font-bold text-white">{stat.value}</div><div className="text-white/35 text-[10px] font-medium">{stat.label}</div>
            </motion.div>
          );})}
        </div>

        {/* FILTERS */}
        <GlassmorphicCard className="p-4 space-y-3">
          <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1">
                {(['all', 'today', 'upcoming', 'past', 'emergency'] as const).map(tab => (
                  <button key={tab} type="button" onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${activeTab === tab ? 'bg-white/[0.08] text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}>
                    {tab === 'emergency' ? <AlertCircle className="w-3 h-3 inline mr-1" /> : null}{tab}
                  </button>
                ))}
              </div>
              <span className="text-white/30 text-xs">{filteredAppointments.length} of {appointments.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <div className="relative w-48"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" /><Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-9" /></div>
              <Button variant="glass" size="sm" onClick={() => setShowFilters(!showFilters)}><Filter className="w-4 h-4 mr-1.5" />Filters {activeFilterCount > 0 && <span className="ml-1 w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] flex items-center justify-center">{activeFilterCount}</span>}</Button>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-3 py-2 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white/70 text-sm focus:outline-none cursor-pointer">
                <option value="date" className="bg-[#1a1a2e]">Date</option><option value="time" className="bg-[#1a1a2e]">Time</option><option value="priority" className="bg-[#1a1a2e]">Priority</option><option value="status" className="bg-[#1a1a2e]">Status</option>
              </select>
            </div>
          </div>
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 mt-3 border-t border-white/[0.04]">
                  {[{ label: 'Status', value: statusFilter, setter: setStatusFilter, options: ['all','scheduled','confirmed','in-progress','completed','cancelled','no-show'] }, { label: 'Type', value: typeFilter, setter: setTypeFilter, options: ['all','consultation','follow-up','emergency','checkup','procedure','vaccination'] }, { label: 'Priority', value: priorityFilter, setter: setPriorityFilter, options: ['all','urgent','high','medium','low'] }, { label: 'Location', value: locationFilter, setter: setLocationFilter, options: ['all','in-person','video','phone'] }].map((f, i) => (
                    <div key={i}><label className="text-white/40 text-[10px] font-medium uppercase tracking-wider mb-1.5 block">{f.label}</label><select value={f.value} onChange={(e) => f.setter(e.target.value)} className="w-full px-2.5 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white/70 text-xs focus:outline-none cursor-pointer">{f.options.map(o => <option key={o} value={o} className="bg-[#1a1a2e] capitalize">{o}</option>)}</select></div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassmorphicCard>

        {/* ============================================ */}
        {/* ✅ APPOINTMENT CARDS GRID (No external components) */}
        {/* ============================================ */}
        {filteredAppointments.length > 0 ? (
          <div className={viewMode === 'card' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-2'}>
            {filteredAppointments.map((apt, i) => {
              const doctor = doctorsList.find(d => d.id === apt.doctorId);
              const statusColor: Record<string, string> = { scheduled: 'border-l-blue-500', confirmed: 'border-l-emerald-500', 'in-progress': 'border-l-amber-500', completed: 'border-l-gray-500', cancelled: 'border-l-red-500', 'no-show': 'border-l-orange-500' };
              const priorityColor: Record<string, string> = { urgent: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-amber-500', low: 'bg-slate-500' };

              if (viewMode === 'table') {
                return (
                  <motion.div key={apt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.02)' }} onClick={() => { setSelectedAppointment(apt); setIsDetailModalOpen(true); }}
                    className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.015] border border-white/[0.04] cursor-pointer transition-all">
                    <span className={`w-1 h-10 rounded-full ${priorityColor[apt.priority] || 'bg-slate-500'}`} />
                    <div className="flex-1 min-w-0"><p className="text-white text-sm font-medium truncate">{apt.patientName}</p><p className="text-white/30 text-xs truncate">{apt.doctorName} • {apt.type}</p></div>
                    <div className="text-right shrink-0"><p className="text-white/60 text-xs">{apt.time}</p><p className="text-white/25 text-[10px]">{apt.date}</p></div>
                    {getStatusBadge(apt.status)}
                  </motion.div>
                );
              }

              return (
                <motion.div key={apt.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -3 }} onClick={() => { setSelectedAppointment(apt); setIsDetailModalOpen(true); }}
                  className={`bg-white/[0.015] rounded-2xl border border-white/[0.06] border-l-2 ${statusColor[apt.status] || 'border-l-indigo-500'} p-5 cursor-pointer hover:border-white/[0.12] transition-all duration-200`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">{apt.patientName.charAt(0)}</div>
                      <div className="min-w-0">
                        <p className="text-white text-sm font-medium truncate">{apt.patientName}</p>
                        <p className="text-white/30 text-xs">{apt.patientAge} yrs • {apt.patientGender} • {apt.patientBloodGroup || ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {apt.isEmergency && <Badge variant="danger" size="xs">EMG</Badge>}
                      {getStatusBadge(apt.status)}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
                    <span className="flex items-center gap-1 text-white/40"><Calendar className="w-3 h-3" />{apt.date}</span>
                    <span className="text-white/15">•</span>
                    <span className="flex items-center gap-1 text-white/40"><Clock className="w-3 h-3" />{apt.time} ({apt.duration})</span>
                    <span className="text-white/15">•</span>
                    <span className="flex items-center gap-1 text-white/40"><Stethoscope className="w-3 h-3" />{apt.doctorName.split(' ').slice(-1)[0]}</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium capitalize ${apt.location === 'video' ? 'bg-indigo-500/10 text-indigo-400' : apt.location === 'phone' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'}`}>{apt.location}</span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium capitalize bg-white/[0.03] text-white/50`}>{apt.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getPaymentBadge(apt.paymentStatus)}
                      <span className="text-white/60 text-xs font-bold">{apt.amount}</span>
                    </div>
                  </div>
                  {apt.symptoms && <p className="text-white/25 text-[10px] mt-3 line-clamp-1">🩺 {apt.symptoms}</p>}
                </motion.div>
              );
            })}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Calendar className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No appointments found</h3>
            <p className="text-white/35 text-sm">Try adjusting your filters.</p>
          </motion.div>
        )}

        {/* DETAIL MODAL */}
        <Modal isOpen={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} title="Appointment Details" size="xl">
          {selectedAppointment && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl">{selectedAppointment.patientName.charAt(0)}</div>
                  <div><h3 className="text-white font-semibold text-lg">{selectedAppointment.patientName}</h3><p className="text-white/35 text-sm">{selectedAppointment.patientAge} yrs • {selectedAppointment.patientGender} • Blood: {selectedAppointment.patientBloodGroup} • ID: {selectedAppointment.patientId}</p></div>
                </div>
                <div className="flex items-center gap-2">{getPaymentBadge(selectedAppointment.paymentStatus)}{getStatusBadge(selectedAppointment.status)}</div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[{ icon: Stethoscope, label: 'Doctor', value: selectedAppointment.doctorName, sub: selectedAppointment.doctorSpecialty }, { icon: Calendar, label: 'Date & Time', value: `${selectedAppointment.date} at ${selectedAppointment.time}`, sub: selectedAppointment.duration }, { icon: Activity, label: 'Type & Priority', value: selectedAppointment.type, sub: `Priority: ${selectedAppointment.priority}` }, { icon: MapPin, label: 'Location', value: selectedAppointment.location, sub: selectedAppointment.room ? `${selectedAppointment.building || ''} • Room ${selectedAppointment.room}` : 'N/A' }, { icon: Phone, label: 'Contact', value: selectedAppointment.contact || 'N/A', sub: selectedAppointment.email || '' }, { icon: Shield, label: 'Insurance', value: selectedAppointment.insuranceProvider || 'N/A', sub: `Policy: ${selectedAppointment.policyNumber || 'N/A'}` }, { icon: DollarSign, label: 'Billing', value: selectedAppointment.amount || 'N/A', sub: `Copay: ${selectedAppointment.copay || 'N/A'} • ${selectedAppointment.paymentStatus || ''}` }, { icon: FileText, label: 'Notes', value: selectedAppointment.notes || 'No notes', sub: selectedAppointment.diagnosis || '' }].map((item, i) => { const Icon = item.icon; return (
                  <div key={i} className="p-3 bg-white/[0.02] rounded-xl border border-white/[0.04]"><div className="flex items-center gap-2 text-white/30 text-xs mb-1"><Icon className="w-3.5 h-3.5" />{item.label}</div><p className="text-white text-sm font-medium">{item.value}</p>{item.sub && <p className="text-white/25 text-[10px] mt-0.5 truncate">{item.sub}</p>}</div>
                );})}
              </div>
              {selectedAppointment.labTests && selectedAppointment.labTests.length > 0 && (
                <div className="p-4 bg-white/[0.02] rounded-xl border border-white/[0.04]"><p className="text-white/40 text-xs uppercase tracking-wider mb-2">Lab Tests</p><div className="flex flex-wrap gap-2">{selectedAppointment.labTests.map((t, i) => <span key={i} className="px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-medium border border-amber-500/20">{t}</span>)}</div></div>
              )}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-white/[0.04]">
                <Button variant="glass" size="sm" className="gap-2"><Edit2 className="w-4 h-4" />Edit</Button>
                <Button variant="glass" size="sm" className="gap-2"><Share2 className="w-4 h-4" />Share</Button>
                <Button variant="glass" size="sm" className="gap-2"><Printer className="w-4 h-4" />Print</Button>
                <Button variant="glass" size="sm" className="gap-2"><Send className="w-4 h-4" />Remind</Button>
                <div className="flex-1" />
                <Button variant="glass" size="sm" onClick={() => setIsDetailModalOpen(false)}>Close</Button>
                <Button variant="gradient" size="sm" className="gap-2"><Calendar className="w-4 h-4" />Reschedule</Button>
              </div>
            </div>
          )}
        </Modal>

        {/* NEW APPOINTMENT MODAL */}
        <Modal isOpen={isNewAppointmentModal} onClose={() => setIsNewAppointmentModal(false)} title="Book New Appointment" size="lg">
          <div className="space-y-4">
            <p className="text-white/40 text-sm">Complete the form below to schedule a new appointment.</p>
            <div className="grid grid-cols-2 gap-3">
              {[{ label: 'Patient Name', icon: User }, { label: 'Doctor', icon: Stethoscope }, { label: 'Date', icon: Calendar }, { label: 'Time', icon: Clock }, { label: 'Type', icon: Activity }, { label: 'Location', icon: MapPin }].map((f) => {
                const Icon = f.icon;
                return <div key={f.label} className="relative"><Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" /><Input placeholder={f.label} className="w-full pl-9" /></div>;
              })}
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="glass" onClick={() => setIsNewAppointmentModal(false)} className="flex-1 justify-center">Cancel</Button>
              <Button variant="gradient" className="flex-1 justify-center"><Plus className="w-4 h-4 mr-1.5" />Book</Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Appointments;