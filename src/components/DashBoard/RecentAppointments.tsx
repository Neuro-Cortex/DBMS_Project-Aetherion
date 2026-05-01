// src/components/dashboard/RecentAppointments.tsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, Clock, User, Stethoscope, Video, Phone, MapPin,
  ChevronRight, Plus, Search, Filter, MoreHorizontal,
  CheckCircle2, XCircle, AlertCircle, ArrowUp, ArrowDown,
  CalendarDays, List, Grid, RefreshCw, Star
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
export interface Appointment {
  id: string;
  patientName: string;
  patientAvatar?: string;
  doctorName: string;
  doctorAvatar?: string;
  doctorSpecialty: string;
  type: 'in-person' | 'virtual' | 'phone';
  date: string;
  time: string;
  duration: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed' | 'in-progress';
  location?: string;
  notes?: string;
  isEmergency?: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface RecentAppointmentsProps {
  appointments?: Appointment[];
  maxItems?: number;
  showFilters?: boolean;
  variant?: 'card' | 'list' | 'compact';
  onViewAll?: () => void;
  onBookNew?: () => void;
}

// ============================================
// MOCK DATA
// ============================================
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'Sarah Johnson',
    patientAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    doctorName: 'Dr. Sarah Wilson',
    doctorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    doctorSpecialty: 'Cardiologist',
    type: 'in-person',
    date: '2024-12-20',
    time: '09:00 AM',
    duration: '30 min',
    status: 'confirmed',
    location: 'Room 302, Cardiac Wing',
    priority: 'high',
  },
  {
    id: '2',
    patientName: 'Michael Chen',
    patientAvatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    doctorName: 'Dr. Robert Williams',
    doctorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    doctorSpecialty: 'Neurologist',
    type: 'virtual',
    date: '2024-12-20',
    time: '10:30 AM',
    duration: '45 min',
    status: 'confirmed',
    priority: 'medium',
  },
  {
    id: '3',
    patientName: 'Emily Davis',
    patientAvatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    doctorName: 'Dr. Lisa Anderson',
    doctorAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    doctorSpecialty: 'Pediatrician',
    type: 'in-person',
    date: '2024-12-20',
    time: '11:00 AM',
    duration: '20 min',
    status: 'in-progress',
    location: 'Room 105, Pediatric Wing',
    isEmergency: true,
    priority: 'high',
  },
  {
    id: '4',
    patientName: 'James Wilson',
    patientAvatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    doctorName: 'Dr. Sarah Wilson',
    doctorAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    doctorSpecialty: 'Cardiologist',
    type: 'phone',
    date: '2024-12-20',
    time: '02:00 PM',
    duration: '15 min',
    status: 'pending',
    priority: 'low',
  },
  {
    id: '5',
    patientName: 'Maria Garcia',
    patientAvatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    doctorName: 'Dr. David Kim',
    doctorAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    doctorSpecialty: 'Dermatologist',
    type: 'in-person',
    date: '2024-12-21',
    time: '08:30 AM',
    duration: '30 min',
    status: 'confirmed',
    location: 'Room 201, Dermatology',
    priority: 'medium',
  },
  {
    id: '6',
    patientName: 'Robert Brown',
    patientAvatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    doctorName: 'Dr. Emily Chen',
    doctorAvatar: 'https://randomuser.me/api/portraits/women/32.jpg',
    doctorSpecialty: 'Orthopedic',
    type: 'in-person',
    date: '2024-12-21',
    time: '11:00 AM',
    duration: '45 min',
    status: 'cancelled',
    location: 'Room 405, Orthopedic Wing',
    priority: 'low',
  },
  {
    id: '7',
    patientName: 'Lisa Thompson',
    patientAvatar: 'https://randomuser.me/api/portraits/women/7.jpg',
    doctorName: 'Dr. Michael Park',
    doctorAvatar: 'https://randomuser.me/api/portraits/men/72.jpg',
    doctorSpecialty: 'Gynecologist',
    type: 'in-person',
    date: '2024-12-21',
    time: '02:30 PM',
    duration: '30 min',
    status: 'confirmed',
    location: 'Room 310, Maternity Wing',
    priority: 'high',
  },
  {
    id: '8',
    patientName: 'David Miller',
    patientAvatar: 'https://randomuser.me/api/portraits/men/8.jpg',
    doctorName: 'Dr. Robert Williams',
    doctorAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    doctorSpecialty: 'Neurologist',
    type: 'virtual',
    date: '2024-12-22',
    time: '09:00 AM',
    duration: '30 min',
    status: 'confirmed',
    priority: 'medium',
  },
];

// ============================================
// SUB-COMPONENTS
// ============================================

// Status Badge
const StatusBadge: React.FC<{ status: Appointment['status'] }> = ({ status }) => {
  const styles: Record<string, string> = {
    confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'in-progress': 'bg-blue-500/10 text-blue-400 border-blue-500/20 animate-pulse',
    completed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  };
  const icons: Record<string, React.ElementType> = {
    confirmed: CheckCircle2,
    pending: AlertCircle,
    'in-progress': Clock,
    completed: CheckCircle2,
    cancelled: XCircle,
  };
  const Icon = icons[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${styles[status]}`}>
      <Icon className="w-2.5 h-2.5" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Type Badge
const TypeBadge: React.FC<{ type: Appointment['type'] }> = ({ type }) => {
  const styles: Record<string, { icon: React.ElementType; label: string; style: string }> = {
    'in-person': { icon: User, label: 'In Person', style: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
    'virtual': { icon: Video, label: 'Virtual', style: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
    'phone': { icon: Phone, label: 'Phone', style: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  };
  const config = styles[type];
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${config.style}`}>
      <Icon className="w-2.5 h-2.5" />
      {config.label}
    </span>
  );
};

// Priority Indicator
const PriorityDot: React.FC<{ priority: Appointment['priority'] }> = ({ priority }) => {
  const colors: Record<string, string> = {
    high: 'bg-red-400 shadow-[0_0_6px_rgba(239,68,68,0.5)]',
    medium: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]',
    low: 'bg-slate-400',
  };
  return <span className={`w-2 h-2 rounded-full ${colors[priority]}`} />;
};

// ============================================
// MAIN COMPONENT
// ============================================
export const RecentAppointments: React.FC<RecentAppointmentsProps> = ({
  appointments = mockAppointments,
  maxItems = 5,
  showFilters = true,
  variant = 'card',
  onViewAll,
  onBookNew,
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'today' | 'upcoming' | 'past'>('today');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'card' | 'list'>('card');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    
    let filtered = appointments;
    
    if (filter === 'today') {
      filtered = filtered.filter(a => a.date === today);
    } else if (filter === 'upcoming') {
      filtered = filtered.filter(a => a.date > today && a.status !== 'cancelled');
    } else if (filter === 'past') {
      filtered = filtered.filter(a => a.date < today || a.status === 'completed');
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(a =>
        a.patientName.toLowerCase().includes(query) ||
        a.doctorName.toLowerCase().includes(query) ||
        a.doctorSpecialty.toLowerCase().includes(query)
      );
    }

    return filtered.slice(0, maxItems);
  }, [appointments, filter, searchQuery, maxItems]);

  // Today's count
  const todayCount = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length;
  const upcomingCount = appointments.filter(a => a.date > new Date().toISOString().split('T')[0] && a.status !== 'cancelled').length;

  // ============================================
  // COMPACT VARIANT
  // ============================================
  if (variant === 'compact') {
    return (
      <div className="space-y-2">
        {filteredAppointments.slice(0, 3).map((appointment, index) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ x: 3 }}
            className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.015] border border-white/[0.06] hover:border-white/[0.12] cursor-pointer transition-all"
            onClick={() => navigate(`/appointments/${appointment.id}`)}
          >
            <PriorityDot priority={appointment.priority} />
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{appointment.patientName}</p>
              <p className="text-white/30 text-[10px] truncate">{appointment.time} • {appointment.doctorName}</p>
            </div>
            <StatusBadge status={appointment.status} />
          </motion.div>
        ))}
        {onViewAll && (
          <button type="button" onClick={onViewAll} className="w-full text-center text-cyan-400 text-xs font-medium hover:text-cyan-300 transition-colors py-2">
            View all appointments →
          </button>
        )}
      </div>
    );
  }

  // ============================================
  // LIST VARIANT
  // ============================================
  if (variant === 'list') {
    return (
      <div className="space-y-1">
        {filteredAppointments.map((appointment, index) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-4 p-4 rounded-xl hover:bg-white/[0.03] cursor-pointer transition-all group"
            onClick={() => setExpandedId(expandedId === appointment.id ? null : appointment.id)}
          >
            <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] overflow-hidden shrink-0">
              {appointment.patientAvatar ? (
                <img src={appointment.patientAvatar} alt={appointment.patientName} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/40 font-bold text-sm">
                  {appointment.patientName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-white text-sm font-medium truncate">{appointment.patientName}</p>
                <PriorityDot priority={appointment.priority} />
              </div>
              <p className="text-white/35 text-xs truncate">{appointment.doctorName} • {appointment.doctorSpecialty}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-white/60 text-xs font-medium">{appointment.time}</p>
              <p className="text-white/25 text-[10px]">{appointment.duration}</p>
            </div>
            <div className="flex items-center gap-2">
              <TypeBadge type={appointment.type} />
              <StatusBadge status={appointment.status} />
            </div>
            <ChevronRight className={`w-4 h-4 text-white/15 transition-transform ${expandedId === appointment.id ? 'rotate-90' : ''}`} />
          </motion.div>
        ))}
      </div>
    );
  }

  // ============================================
  // CARD VARIANT (DEFAULT)
  // ============================================
  return (
    <div className="bg-white/[0.015] backdrop-blur-sm rounded-2xl border border-white/[0.06] overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
        <div>
          <h3 className="text-white font-semibold text-sm">Upcoming Appointments</h3>
          <p className="text-white/30 text-xs mt-0.5">
            {todayCount} today • {upcomingCount} upcoming
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onBookNew && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onBookNew}
              className="flex items-center gap-1.5 px-3 py-2 bg-white text-black rounded-lg text-xs font-medium hover:bg-white/90 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              Book New
            </motion.button>
          )}
          {onViewAll && (
            <button type="button" onClick={onViewAll} className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors">
              <MoreHorizontal className="w-4 h-4 text-white/30" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="flex items-center gap-2 p-3 border-b border-white/[0.04]">
          <div className="flex items-center gap-1 bg-white/[0.02] rounded-lg p-0.5">
            {[
              { value: 'today' as const, label: 'Today', count: todayCount },
              { value: 'upcoming' as const, label: 'Upcoming', count: upcomingCount },
              { value: 'all' as const, label: 'All', count: appointments.length },
              { value: 'past' as const, label: 'Past', count: appointments.filter(a => a.status === 'completed').length },
            ].map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setFilter(tab.value)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  filter === tab.value
                    ? 'bg-white/[0.08] text-white'
                    : 'text-white/40 hover:text-white/70'
                }`}
              >
                {tab.label}
                <span className="ml-1 text-white/20">({tab.count})</span>
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-40 pl-8 pr-3 py-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg text-white/70 text-xs placeholder-white/20 focus:outline-none focus:border-white/15 transition-all"
            />
          </div>
        </div>
      )}

      {/* Appointments List */}
      <div className="divide-y divide-white/[0.04]">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appointment, index) => (
            <motion.div
              key={appointment.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className="p-4 hover:bg-white/[0.02] cursor-pointer transition-all group"
                onClick={() => setExpandedId(expandedId === appointment.id ? null : appointment.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Patient Avatar */}
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-white/[0.03] border border-white/[0.08] overflow-hidden">
                      {appointment.patientAvatar ? (
                        <img src={appointment.patientAvatar} alt={appointment.patientName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/40 font-bold">
                          {appointment.patientName.charAt(0)}
                        </div>
                      )}
                    </div>
                    {appointment.isEmergency && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#050508] flex items-center justify-center">
                        <AlertCircle className="w-2.5 h-2.5 text-white" />
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-1">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-white text-sm font-medium">{appointment.patientName}</p>
                          <PriorityDot priority={appointment.priority} />
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <p className="text-white/40 text-xs">{appointment.doctorName}</p>
                          <span className="text-white/15">•</span>
                          <p className="text-white/30 text-xs">{appointment.doctorSpecialty}</p>
                        </div>
                      </div>
                      <StatusBadge status={appointment.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
                      <span className="flex items-center gap-1.5 text-white/40">
                        <Clock className="w-3.5 h-3.5" />
                        {appointment.time} ({appointment.duration})
                      </span>
                      <span className="text-white/15">•</span>
                      <TypeBadge type={appointment.type} />
                      {appointment.location && (
                        <>
                          <span className="text-white/15">•</span>
                          <span className="flex items-center gap-1.5 text-white/40">
                            <MapPin className="w-3.5 h-3.5" />
                            {appointment.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    {appointment.type === 'virtual' && appointment.status === 'confirmed' && (
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 text-xs font-medium hover:bg-emerald-500/20 transition-all"
                      >
                        <Video className="w-4 h-4" />
                      </motion.button>
                    )}
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 bg-white/[0.04] text-white/50 rounded-lg border border-white/[0.08] text-xs font-medium hover:bg-white/[0.08] hover:text-white/80 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/appointments/${appointment.id}`);
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedId === appointment.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-white/[0.04] grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="p-2.5 bg-white/[0.02] rounded-lg">
                          <p className="text-white/25 text-[10px] uppercase tracking-wider">Doctor</p>
                          <div className="flex items-center gap-2 mt-1">
                            {appointment.doctorAvatar && (
                              <img src={appointment.doctorAvatar} alt="" className="w-6 h-6 rounded-full" />
                            )}
                            <p className="text-white/60 text-xs">{appointment.doctorName}</p>
                          </div>
                        </div>
                        <div className="p-2.5 bg-white/[0.02] rounded-lg">
                          <p className="text-white/25 text-[10px] uppercase tracking-wider">Specialty</p>
                          <p className="text-white/60 text-xs mt-1">{appointment.doctorSpecialty}</p>
                        </div>
                        <div className="p-2.5 bg-white/[0.02] rounded-lg">
                          <p className="text-white/25 text-[10px] uppercase tracking-wider">Duration</p>
                          <p className="text-white/60 text-xs mt-1">{appointment.duration}</p>
                        </div>
                        {appointment.notes && (
                          <div className="col-span-full p-2.5 bg-white/[0.02] rounded-lg">
                            <p className="text-white/25 text-[10px] uppercase tracking-wider">Notes</p>
                            <p className="text-white/60 text-xs mt-1">{appointment.notes}</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <Calendar className="w-10 h-10 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No appointments found</p>
            {onBookNew && (
              <button type="button" onClick={onBookNew} className="mt-3 text-cyan-400 text-xs font-medium hover:text-cyan-300 transition-colors">
                Book a new appointment →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      {filteredAppointments.length > 0 && onViewAll && (
        <div className="p-4 border-t border-white/[0.04]">
          <button
            type="button"
            onClick={onViewAll}
            className="w-full py-2 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white/50 text-xs font-medium hover:bg-white/[0.04] hover:text-white/70 transition-all"
          >
            View All Appointments
          </button>
        </div>
      )}
    </div>
  );
};

export default RecentAppointments;