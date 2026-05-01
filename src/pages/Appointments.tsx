// src/pages/Appointments.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  List, 
  Plus, 
  Search, 
  Filter, 
  Download,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Video,
  Phone,
  User,
  Stethoscope,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  AlertCircle,
  Calendar as CalendarIcon,
  TrendingUp,
  Activity
} from 'lucide-react';
import { AppointmentCalendar } from '../components/appointment/AppointmentCalendar';
import { AppointmentList } from '../components/appointment/AppointmentList';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { GlassmorphicCard } from '../components/ui/GlassmorphicCard';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

// ============================================
// TYPES
// ============================================

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'checkup';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  location: 'in-person' | 'video' | 'phone';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  notes?: string;
  symptoms?: string;
}

interface AppointmentStats {
  total: number;
  today: number;
  upcoming: number;
  completed: number;
  cancelled: number;
}

// ============================================
// MOCK DATA
// ============================================

const initialAppointments: Appointment[] = [
  { 
    id: '1', 
    doctorId: '1', 
    doctorName: 'Dr. Sarah Wilson', 
    patientId: 'p1', 
    patientName: 'John Doe', 
    date: '2024-03-15', 
    time: '10:00 AM', 
    type: 'consultation', 
    status: 'confirmed', 
    location: 'video', 
    priority: 'medium',
    symptoms: 'Chest pain and shortness of breath'
  },
  { 
    id: '2', 
    doctorId: '2', 
    doctorName: 'Dr. James Lee', 
    patientId: 'p2', 
    patientName: 'Jane Smith', 
    date: '2024-03-16', 
    time: '02:30 PM', 
    type: 'follow-up', 
    status: 'scheduled', 
    location: 'in-person', 
    priority: 'low',
    notes: 'Follow-up after previous consultation'
  },
  { 
    id: '3', 
    doctorId: '1', 
    doctorName: 'Dr. Sarah Wilson', 
    patientId: 'p3', 
    patientName: 'Robert Johnson', 
    date: '2024-03-15', 
    time: '11:30 AM', 
    type: 'emergency', 
    status: 'confirmed', 
    location: 'video', 
    priority: 'urgent',
    symptoms: 'Severe headache and dizziness'
  },
  { 
    id: '4', 
    doctorId: '3', 
    doctorName: 'Dr. Emily Chen', 
    patientId: 'p4', 
    patientName: 'Maria Garcia', 
    date: '2024-03-17', 
    time: '09:00 AM', 
    type: 'checkup', 
    status: 'scheduled', 
    location: 'in-person', 
    priority: 'low'
  },
];

const doctors = [
  { id: '1', name: 'Dr. Sarah Wilson', specialty: 'Cardiology' },
  { id: '2', name: 'Dr. James Lee', specialty: 'Neurology' },
  { id: '3', name: 'Dr. Emily Chen', specialty: 'Pediatrics' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const Appointments: React.FC = () => {
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    today: 0,
    upcoming: 0,
    completed: 0,
    cancelled: 0
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
    });
  }, [appointments]);

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesType = typeFilter === 'all' || apt.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleStatusChange = (id: string, newStatus: Appointment['status']) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === id ? { ...apt, status: newStatus } : apt)
    );
  };

  const getStatusBadge = (status: Appointment['status']) => {
    const config = {
      scheduled: { variant: 'warning', text: 'Scheduled', icon: ClockIcon },
      confirmed: { variant: 'success', text: 'Confirmed', icon: CheckCircle },
      completed: { variant: 'info', text: 'Completed', icon: CheckCircle },
      cancelled: { variant: 'danger', text: 'Cancelled', icon: XCircle },
      'no-show': { variant: 'danger', text: 'No Show', icon: AlertCircle },
    };
    const { variant, text, icon: Icon } = config[status];
    return <Badge variant={variant as any} size="xs">{text}</Badge>;
  };

  const getLocationIcon = (location: Appointment['location']) => {
    switch (location) {
      case 'video': return <Video className="w-3 h-3" />;
      case 'phone': return <Phone className="w-3 h-3" />;
      default: return <MapPin className="w-3 h-3" />;
    }
  };

  const getPriorityColor = (priority: Appointment['priority']) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/10';
      case 'high': return 'text-orange-400 bg-orange-500/10';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10';
      default: return 'text-green-400 bg-green-500/10';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Appointments
            </h1>
            <p className="text-white/60">Manage and track all patient appointments</p>
          </div>
          <div className="flex gap-3">
            <Button variant="glass" size="sm" icon={Download}>
              Export
            </Button>
            <Button variant="gradient" size="sm" icon={Plus}>
              New Appointment
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total', value: stats.total, icon: Calendar, color: 'blue' },
            { label: 'Today', value: stats.today, icon: Clock, color: 'cyan' },
            { label: 'Upcoming', value: stats.upcoming, icon: TrendingUp, color: 'green' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'purple' },
            { label: 'Cancelled', value: stats.cancelled, icon: XCircle, color: 'red' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <stat.icon className={`w-6 h-6 text-${stat.color}-400 mx-auto mb-2`} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* View Toggle & Filters */}
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="flex gap-2 p-1 bg-white/10 rounded-xl w-fit">
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                viewMode === 'calendar' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                viewMode === 'list' 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
              List View
            </button>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="consultation">Consultation</option>
              <option value="follow-up">Follow-up</option>
              <option value="emergency">Emergency</option>
              <option value="checkup">Checkup</option>
            </select>
          </div>
        </div>

        {/* Calendar or List View */}
        {viewMode === 'calendar' ? (
          <AppointmentCalendar 
            appointments={filteredAppointments} 
            doctors={doctors}
            onAppointmentClick={handleAppointmentClick}
          />
        ) : (
          <AppointmentList 
            appointments={filteredAppointments}
            realTime
            onAppointmentEdit={handleAppointmentClick}
            onStatusChange={handleStatusChange}
          />
        )}

        {/* Appointment Details Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Appointment Details"
          size="lg"
        >
          {selectedAppointment && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedAppointment.patientName}</h3>
                    <p className="text-white/50 text-sm">Patient ID: {selectedAppointment.patientId}</p>
                  </div>
                </div>
                {getStatusBadge(selectedAppointment.status)}
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                    <Stethoscope className="w-4 h-4" />
                    Doctor
                  </div>
                  <p className="text-white font-medium">{selectedAppointment.doctorName}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                    <CalendarIcon className="w-4 h-4" />
                    Date & Time
                  </div>
                  <p className="text-white font-medium">{selectedAppointment.date} at {selectedAppointment.time}</p>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                    <Activity className="w-4 h-4" />
                    Type & Priority
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white capitalize">{selectedAppointment.type}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${getPriorityColor(selectedAppointment.priority)}`}>
                      {selectedAppointment.priority}
                    </span>
                  </div>
                </div>
                <div className="bg-white/5 rounded-xl p-4">
                  <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                    {getLocationIcon(selectedAppointment.location)}
                    Location
                  </div>
                  <p className="text-white capitalize">{selectedAppointment.location}</p>
                </div>
              </div>

              {/* Notes & Symptoms */}
              {selectedAppointment.symptoms && (
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-white/60 mb-2">Symptoms</h4>
                  <p className="text-white">{selectedAppointment.symptoms}</p>
                </div>
              )}
              {selectedAppointment.notes && (
                <div className="bg-white/5 rounded-xl p-4">
                  <h4 className="text-sm font-medium text-white/60 mb-2">Notes</h4>
                  <p className="text-white">{selectedAppointment.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button variant="glass" fullWidth onClick={() => setIsModalOpen(false)}>
                  Close
                </Button>
                <Button variant="gradient" fullWidth>
                  Reschedule
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Appointments;