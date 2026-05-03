// src/components/appointment/AppointmentList.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  List, Filter, Search, Calendar, Clock, User, Stethoscope,
  MapPin, Phone, Video, MessageSquare, CheckCircle, XCircle,
  AlertCircle, ClockIcon, ChevronDown, ChevronUp, Edit2, Trash2,
  Plus, MoreVertical, Activity, TrendingUp, FileText, Share2,
  Printer, Star, Users, Building2, ArrowRight, RefreshCw,
  SlidersHorizontal, Grid, Download, Mail, AlertTriangle
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
export interface Appointment {
  id: string;
  patientName: string;
  patientAvatar?: string;
  doctorName: string;
  doctorId?: string;
  doctorSpecialty?: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'checkup' | 'procedure';
  date: string;
  time: string;
  duration: string;
  location: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  priority?: 'high' | 'medium' | 'low';
  notes?: string;
  contact?: string;
  room?: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  avatar?: string;
  rating: number;
}

export interface AppointmentListProps {
  appointments: Appointment[];
  doctors?: Doctor[];
  variant?: 'glass' | 'default';
  showFilters?: boolean;
  showActions?: boolean;
  realTime?: boolean;
  updateInterval?: number;
  onStatusChange?: (id: string, status: Appointment['status']) => void;
  onAppointmentEdit?: (appointment: Appointment) => void;
  onAppointmentDelete?: (id: string) => void;
  onAppointmentShare?: (appointment: Appointment) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
  className?: string;
}

// ============================================
// STYLE MAPS
// ============================================
const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'in-progress': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  completed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  'no-show': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

const priorityColors: Record<string, string> = {
  high: 'bg-red-500/10 text-red-400 border-red-500/20',
  medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  low: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
};

const typeColors: Record<string, string> = {
  consultation: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'follow-up': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  emergency: 'bg-red-500/10 text-red-400 border-red-500/20',
  checkup: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  procedure: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
};

const statusIcons: Record<string, React.ElementType> = {
  scheduled: Clock,
  confirmed: CheckCircle,
  'in-progress': Activity,
  completed: CheckCircle,
  cancelled: XCircle,
  'no-show': AlertCircle,
};

const locationIcons: Record<string, React.ElementType> = {
  'in-person': MapPin,
  video: Video,
  phone: Phone,
};

// ============================================
// STAT CARD
// ============================================
const StatMiniCard: React.FC<{
  label: string; value: number; icon: React.ElementType; color: string; delay: number;
}> = ({ label, value, icon: Icon, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay, type: 'spring' }}
    whileHover={{ scale: 1.03, y: -2 }}
    className="bg-white/[0.015] backdrop-blur-sm rounded-xl border border-white/[0.06] p-4 text-center hover:border-white/[0.12] transition-all duration-300"
  >
    <Icon className={`w-5 h-5 mx-auto mb-2 ${color}`} />
    <p className="text-xl font-bold text-white mb-0.5">{value}</p>
    <p className="text-white/35 text-[11px] font-medium">{label}</p>
  </motion.div>
);

// ============================================
// MAIN COMPONENT
// ============================================
export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments: initialAppointments,
  doctors = [],
  showFilters = true,
  showActions = true,
  realTime = false,
  updateInterval = 5000,
  onStatusChange,
  onAppointmentEdit,
  onAppointmentDelete,
  onAppointmentShare,
  onAppointmentClick,
  className = '',
}) => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Appointment['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Appointment['type'] | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'time' | 'status' | 'priority'>('date');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Sync with props
  useEffect(() => {
    setAppointments(initialAppointments);
  }, [initialAppointments]);

  // Real-time updates
  useEffect(() => {
    if (!realTime) return;
    const interval = setInterval(() => {
      setAppointments(prev => prev.map(apt => {
        if (Math.random() > 0.95 && apt.status === 'confirmed') {
          return { ...apt, status: 'in-progress' as const };
        }
        return apt;
      }));
    }, updateInterval);
    return () => clearInterval(interval);
  }, [realTime, updateInterval]);

  // Filter
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || apt.patientName.toLowerCase().includes(q) || apt.doctorName.toLowerCase().includes(q);
      const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
      const matchesType = typeFilter === 'all' || apt.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [appointments, searchQuery, statusFilter, typeFilter]);

  // Sort
  const sortedAppointments = useMemo(() => {
    return [...filteredAppointments].sort((a, b) => {
      switch (sortBy) {
        case 'date': return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'time': return a.time.localeCompare(b.time);
        case 'status': return a.status.localeCompare(b.status);
        case 'priority': return (a.priority || 'low').localeCompare(b.priority || 'low');
        default: return 0;
      }
    });
  }, [filteredAppointments, sortBy]);

  // Group by date
  const groupedAppointments = useMemo(() => {
    return sortedAppointments.reduce((acc, apt) => {
      if (!acc[apt.date]) acc[apt.date] = [];
      acc[apt.date].push(apt);
      return acc;
    }, {} as Record<string, Appointment[]>);
  }, [sortedAppointments]);

  // Stats
  const stats = useMemo(() => ({
    total: appointments.length,
    today: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    inProgress: appointments.filter(a => a.status === 'in-progress').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
    emergency: appointments.filter(a => a.type === 'emergency').length,
  }), [appointments]);

  const handleStatusUpdate = useCallback((id: string, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt));
    onStatusChange?.(id, newStatus);
  }, [onStatusChange]);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1200);
  }, []);

  const activeFilterCount = [statusFilter !== 'all', typeFilter !== 'all'].filter(Boolean).length;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em]">Appointments</h2>
          <p className="text-white/35 text-sm mt-1">Manage all patient appointments efficiently</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex bg-white/[0.02] rounded-xl border border-white/[0.06] p-1">
            <button type="button" onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/60'}`}><List className="w-4 h-4" /></button>
            <button type="button" onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/60'}`}><Grid className="w-4 h-4" /></button>
          </div>
          <button type="button" onClick={handleRefresh} className="p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white/40 hover:text-white/70 transition-all"><RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /></button>
          <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => navigate('/appointments/book')} className="flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-sm font-medium hover:bg-white/90 transition-all"><Plus className="w-4 h-4" />New</motion.button>
        </div>
      </motion.div>

      {/* ============================================ */}
      {/* STATS ROW */}
      {/* ============================================ */}
      <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        <StatMiniCard label="Total" value={stats.total} icon={Calendar} color="text-blue-400" delay={0.05} />
        <StatMiniCard label="Today" value={stats.today} icon={Clock} color="text-cyan-400" delay={0.1} />
        <StatMiniCard label="Confirmed" value={stats.confirmed} icon={CheckCircle} color="text-emerald-400" delay={0.15} />
        <StatMiniCard label="Active" value={stats.inProgress} icon={Activity} color="text-amber-400" delay={0.2} />
        <StatMiniCard label="Done" value={stats.completed} icon={CheckCircle} color="text-gray-400" delay={0.25} />
        <StatMiniCard label="Cancelled" value={stats.cancelled} icon={XCircle} color="text-red-400" delay={0.3} />
        <StatMiniCard label="Emergency" value={stats.emergency} icon={AlertTriangle} color="text-orange-400" delay={0.35} />
      </div>

      {/* ============================================ */}
      {/* FILTERS */}
      {/* ============================================ */}
      {showFilters && (
        <div className="bg-white/[0.015] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search patients or doctors..." className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/15 transition-all" />
              {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/[0.06] rounded-lg"><XCircle className="w-3.5 h-3.5 text-white/30" /></button>}
            </div>
            <button type="button" onClick={() => setShowFilterPanel(!showFilterPanel)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${showFilterPanel || activeFilterCount > 0 ? 'bg-white/[0.08] text-white border border-white/[0.15]' : 'bg-white/[0.02] text-white/50 border border-white/[0.06] hover:bg-white/[0.04]'}`}>
              <SlidersHorizontal className="w-4 h-4" /> Filters {activeFilterCount > 0 && <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>}
            </button>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="px-4 py-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white/70 text-sm focus:outline-none cursor-pointer">
              <option value="date" className="bg-[#1a1a2e]">Sort by Date</option>
              <option value="time" className="bg-[#1a1a2e]">Sort by Time</option>
              <option value="status" className="bg-[#1a1a2e]">Sort by Status</option>
              <option value="priority" className="bg-[#1a1a2e]">Sort by Priority</option>
            </select>
          </div>
          <AnimatePresence>
            {showFilterPanel && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-white/[0.04]">
                  <div>
                    <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Status</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white text-sm">
                      <option value="all" className="bg-[#1a1a2e]">All Status</option>
                      <option value="scheduled" className="bg-[#1a1a2e]">Scheduled</option>
                      <option value="confirmed" className="bg-[#1a1a2e]">Confirmed</option>
                      <option value="in-progress" className="bg-[#1a1a2e]">In Progress</option>
                      <option value="completed" className="bg-[#1a1a2e]">Completed</option>
                      <option value="cancelled" className="bg-[#1a1a2e]">Cancelled</option>
                      <option value="no-show" className="bg-[#1a1a2e]">No Show</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Type</label>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value as any)} className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white text-sm">
                      <option value="all" className="bg-[#1a1a2e]">All Types</option>
                      <option value="consultation" className="bg-[#1a1a2e]">Consultation</option>
                      <option value="follow-up" className="bg-[#1a1a2e]">Follow-up</option>
                      <option value="emergency" className="bg-[#1a1a2e]">Emergency</option>
                      <option value="checkup" className="bg-[#1a1a2e]">Checkup</option>
                      <option value="procedure" className="bg-[#1a1a2e]">Procedure</option>
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <button type="button" onClick={() => { setStatusFilter('all'); setTypeFilter('all'); setSearchQuery(''); }} className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white/50 text-sm hover:bg-white/[0.06] hover:text-white/80 transition-all">Clear All</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ============================================ */}
      {/* APPOINTMENTS LIST */}
      {/* ============================================ */}
      {sortedAppointments.length > 0 ? (
        viewMode === 'list' ? (
          <div className="space-y-4">
            {Object.entries(groupedAppointments).map(([date, dateAppointments]) => (
              <motion.div key={date} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white/[0.015] backdrop-blur-sm rounded-2xl border border-white/[0.06] overflow-hidden">
                <div className="p-5 border-b border-white/[0.04] flex items-center justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-base">{new Date(date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                    <p className="text-white/30 text-xs mt-0.5">{dateAppointments.length} appointment{dateAppointments.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <div className="divide-y divide-white/[0.04]">
                  {dateAppointments.map((appointment, index) => {
                    const StatusIcon = statusIcons[appointment.status] || Clock;
                    const LocationIcon = locationIcons[appointment.location] || MapPin;
                    const doctor = doctors.find(d => d.id === appointment.doctorId);
                    const isExpanded = expandedId === appointment.id;

                    return (
                      <motion.div key={appointment.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.03 }} className={`p-4 hover:bg-white/[0.02] transition-all ${isExpanded ? 'bg-white/[0.02]' : ''}`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/40 font-bold text-sm shrink-0">{appointment.patientName.charAt(0)}</div>
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <p className="text-white text-sm font-medium">{appointment.patientName}</p>
                                {appointment.priority && <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${priorityColors[appointment.priority]}`}>{appointment.priority}</span>}
                                <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[appointment.status]}`}><StatusIcon className="w-2.5 h-2.5" />{appointment.status}</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-xs">
                                <span className="flex items-center gap-1 text-white/40"><Clock className="w-3 h-3" />{appointment.time} ({appointment.duration})</span>
                                <span className="text-white/15">•</span>
                                <span className="flex items-center gap-1 text-white/40"><LocationIcon className="w-3 h-3" />{appointment.location}</span>
                                <span className="text-white/15">•</span>
                                <span className="flex items-center gap-1 text-white/40"><Stethoscope className="w-3 h-3" />{appointment.type}</span>
                                {doctor && <><span className="text-white/15">•</span><span className="flex items-center gap-1 text-white/40"><User className="w-3 h-3" />{doctor.name}</span></>}
                              </div>
                              {appointment.notes && <p className="text-white/35 text-xs mt-1.5 line-clamp-1">{appointment.notes}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {showActions && (
                              <>
                                <button type="button" onClick={(e) => { e.stopPropagation(); onAppointmentEdit?.(appointment); }} className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors"><Edit2 className="w-3.5 h-3.5 text-white/40" /></button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); onAppointmentShare?.(appointment); }} className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors"><Share2 className="w-3.5 h-3.5 text-white/40" /></button>
                                <button type="button" onClick={(e) => { e.stopPropagation(); onAppointmentDelete?.(appointment.id); }} className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5 text-red-400" /></button>
                              </>
                            )}
                            {appointment.status === 'scheduled' && <button type="button" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(appointment.id, 'confirmed'); }} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-medium border border-emerald-500/20 hover:bg-emerald-500/20 transition-all">Confirm</button>}
                            {appointment.status === 'confirmed' && <button type="button" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(appointment.id, 'in-progress'); }} className="px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-medium border border-amber-500/20 hover:bg-amber-500/20 transition-all">Start</button>}
                            {appointment.status === 'in-progress' && <button type="button" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(appointment.id, 'completed'); }} className="px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-xs font-medium border border-blue-500/20 hover:bg-blue-500/20 transition-all">Complete</button>}
                            <button type="button" onClick={() => setExpandedId(isExpanded ? null : appointment.id)} className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors"><ChevronDown className={`w-4 h-4 text-white/30 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} /></button>
                          </div>
                        </div>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                              <div className="mt-4 pt-4 border-t border-white/[0.04] grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-3 bg-white/[0.02] rounded-xl"><p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Patient</p><p className="text-white/60 text-xs">{appointment.patientName}</p><p className="text-white/40 text-[10px] mt-0.5">{appointment.contact || 'N/A'}</p></div>
                                <div className="p-3 bg-white/[0.02] rounded-xl"><p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Doctor</p><p className="text-white/60 text-xs">{doctor?.name || appointment.doctorName}</p><p className="text-white/40 text-[10px] mt-0.5">{doctor?.specialty || appointment.doctorSpecialty || 'N/A'}</p></div>
                                <div className="p-3 bg-white/[0.02] rounded-xl"><p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Details</p><p className="text-white/60 text-xs">Duration: {appointment.duration}</p><p className="text-white/40 text-[10px] mt-0.5">Room: {appointment.room || 'TBD'}</p></div>
                              </div>
                              <div className="flex justify-end gap-2 mt-4">
                                <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white/50 text-xs hover:bg-white/[0.06] transition-all"><Printer className="w-3 h-3" />Print</button>
                                <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white/50 text-xs hover:bg-white/[0.06] transition-all"><Activity className="w-3 h-3" />History</button>
                                <button type="button" onClick={() => { setExpandedId(null); onAppointmentClick?.(appointment); }} className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-black rounded-lg text-xs font-medium hover:bg-white/90 transition-all">View Full <ArrowRight className="w-3 h-3" /></button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedAppointments.map((appointment, index) => {
              const StatusIcon = statusIcons[appointment.status] || Clock;
              const LocationIcon = locationIcons[appointment.location] || MapPin;
              const doctor = doctors.find(d => d.id === appointment.doctorId);

              return (
                <motion.div key={appointment.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -4 }} onClick={() => onAppointmentClick?.(appointment)}
                  className="bg-white/[0.015] rounded-2xl border border-white/[0.06] overflow-hidden cursor-pointer hover:border-white/[0.12] transition-all duration-300">
                  <div className="p-5 border-b border-white/[0.04]">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.08] flex items-center justify-center text-white/40 font-bold text-sm">{appointment.patientName.charAt(0)}</div>
                        <div>
                          <p className="text-white text-sm font-medium">{appointment.patientName}</p>
                          <p className="text-white/30 text-[10px]">{appointment.date} at {appointment.time}</p>
                        </div>
                      </div>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[appointment.status]}`}><StatusIcon className="w-2.5 h-2.5" />{appointment.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${typeColors[appointment.type]}`}>{appointment.type}</span>
                      {appointment.priority && <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${priorityColors[appointment.priority]}`}>{appointment.priority}</span>}
                      <span className="ml-auto text-white/30"><LocationIcon className="w-3 h-3" /></span>
                    </div>
                  </div>
                  <div className="p-5">
                    {doctor && (
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">{doctor.name.charAt(0)}</div>
                        <div>
                          <p className="text-white text-xs font-medium">{doctor.name}</p>
                          <p className="text-white/30 text-[10px]">{doctor.specialty}</p>
                        </div>
                        <div className="ml-auto flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-white/50 text-xs">{doctor.rating}</span>
                        </div>
                      </div>
                    )}
                    {appointment.notes && <p className="text-white/35 text-xs mb-4 line-clamp-2">{appointment.notes}</p>}
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                      <div className="flex items-center gap-1">
                        {showActions && (
                          <>
                            <button type="button" onClick={(e) => { e.stopPropagation(); onAppointmentEdit?.(appointment); }} className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"><Edit2 className="w-3 h-3 text-white/30" /></button>
                            <button type="button" onClick={(e) => { e.stopPropagation(); onAppointmentShare?.(appointment); }} className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"><Share2 className="w-3 h-3 text-white/30" /></button>
                          </>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {appointment.status === 'scheduled' && <button type="button" onClick={(e) => { e.stopPropagation(); handleStatusUpdate(appointment.id, 'confirmed'); }} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-medium border border-emerald-500/20">Confirm</button>}
                        <button type="button" onClick={(e) => { e.stopPropagation(); onAppointmentDelete?.(appointment.id); }} className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"><Trash2 className="w-3 h-3 text-red-400" /></button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )
      ) : (
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-20">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center"><Calendar className="w-10 h-10 text-white/10" /></div>
          <h3 className="text-xl font-semibold text-white mb-2">No Appointments Found</h3>
          <p className="text-white/35 text-sm max-w-md mx-auto mb-6">{searchQuery || statusFilter !== 'all' || typeFilter !== 'all' ? 'No appointments match your filters.' : 'No appointments scheduled yet.'}</p>
          <motion.button type="button" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/appointments/book')} className="px-6 py-3 bg-white text-black rounded-xl text-sm font-medium hover:bg-white/90 transition-all"><Plus className="inline w-4 h-4 mr-1.5" />Schedule First Appointment</motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default AppointmentList;