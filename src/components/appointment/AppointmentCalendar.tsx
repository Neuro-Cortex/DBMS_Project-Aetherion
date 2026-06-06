// src/components/appointment/AppointmentCalendar.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Clock, ChevronLeft, ChevronRight, Plus, X,
  Edit2, Trash2, MapPin, Phone, Video, CheckCircle, ClockIcon
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// ============================================
// TYPES (UNIFIED — matches Appointments.tsx)
// ============================================
export interface Appointment {
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

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating?: number;
}

export interface AppointmentCalendarProps {
  appointments: Appointment[];
  doctors?: Doctor[];
  variant?: 'glass' | 'gradient' | 'neon';
  onDateSelect?: (date: string) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
  onNewAppointment?: (date: string) => void;
  onDragDrop?: (appointmentId: string, newDate: string, newTime: string) => void;
  className?: string;
}

// ============================================
// CONSTANTS
// ============================================
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const TIME_SLOTS = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM'
];

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  confirmed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'in-progress': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  completed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  cancelled: 'bg-red-500/10 text-red-400 border-red-500/20',
  'no-show': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
};

const statusDotColors: Record<string, string> = {
  scheduled: 'bg-blue-500',
  confirmed: 'bg-emerald-500',
  'in-progress': 'bg-amber-500',
  completed: 'bg-gray-500',
  cancelled: 'bg-red-500',
  'no-show': 'bg-orange-500',
};

const locationIcons: Record<string, React.ElementType> = {
  'in-person': MapPin,
  video: Video,
  phone: Phone,
};

// ============================================
// MAIN COMPONENT
// ============================================
export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  doctors = [],
  variant = 'glass',
  onDateSelect,
  onAppointmentClick,
  onNewAppointment,
  onDragDrop,
  className = '',
}) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const getAppointmentsForDate = (day: number): Appointment[] => {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(a => a.date === dateStr);
  };

  const todayStr = today.toISOString().split('T')[0];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`space-y-6 ${className}`}>
      
      {/* ============================================ */}
      {/* CALENDAR CARD */}
      {/* ============================================ */}
      <GlassmorphicCard variant={variant} className="overflow-hidden">
        
        {/* Header with Navigation */}
        <div className="flex items-center justify-between p-5 border-b border-white/[0.04]">
          <h3 className="text-white font-semibold text-lg">{MONTHS[currentMonth]} {currentYear}</h3>
          <div className="flex items-center gap-2">
            <Button variant="glass" size="xs" onClick={prevMonth}><ChevronLeft className="w-4 h-4" /></Button>
            <Button variant="glass" size="xs" onClick={goToToday} className="text-xs px-3">Today</Button>
            <Button variant="glass" size="xs" onClick={nextMonth}><ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>

        {/* Day Headers */}
        <div className="grid grid-cols-7 border-b border-white/[0.04]">
          {DAYS.map(day => (
            <div key={day} className="p-3 text-center text-white/30 text-xs font-medium uppercase tracking-wider">{day}</div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7">
          {Array.from({ length: firstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[100px] p-2 border border-white/[0.02]" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayAppointments = getAppointmentsForDate(day);
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === selectedDate;

            return (
              <motion.div key={day} whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
                onClick={() => {
                  const newSelected = isSelected ? null : dateStr;
                  setSelectedDate(newSelected);
                  if (newSelected) onDateSelect?.(newSelected);
                }}
                className={`min-h-[100px] p-2 border border-white/[0.02] cursor-pointer transition-colors ${isToday ? 'bg-indigo-500/[0.05]' : ''} ${isSelected ? 'bg-white/[0.04]' : ''}`}>
                <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium mb-1 ${isToday ? 'bg-indigo-500 text-white' : 'text-white/50'}`}>
                  {day}
                </span>
                <div className="space-y-0.5">
                  {dayAppointments.slice(0, 3).map(apt => (
                    <motion.button key={apt.id} type="button" whileHover={{ scale: 1.02 }}
                      onClick={(e) => { e.stopPropagation(); onAppointmentClick?.(apt); }}
                      className={`w-full text-left px-1.5 py-0.5 rounded text-[10px] font-medium truncate text-white bg-white/[0.04] border-l-2 ${statusDotColors[apt.status] || 'bg-gray-500'}`}>
                      {apt.time} - {apt.patientName.split(' ')[0]}
                    </motion.button>
                  ))}
                  {dayAppointments.length > 3 && (
                    <p className="text-white/20 text-[10px] px-1.5">+{dayAppointments.length - 3} more</p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Date Appointments List */}
        {selectedDate && (
          <div className="border-t border-white/[0.04] p-5">
            <h4 className="text-white font-semibold text-sm mb-3">
              {new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              <span className="text-white/30 font-normal ml-2">— {getAppointmentsForDate(parseInt(selectedDate.split('-')[2])).length} appointments</span>
            </h4>
            <div className="space-y-2">
              {getAppointmentsForDate(parseInt(selectedDate.split('-')[2])).map(apt => {
                const LocationIcon = locationIcons[apt.location] || MapPin;
                const doctor = doctors.find(d => d.id === apt.doctorId);
                return (
                  <motion.div key={apt.id} whileHover={{ x: 3 }}
                    onClick={() => onAppointmentClick?.(apt)}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-all border border-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${statusDotColors[apt.status] || 'bg-gray-500'}`} />
                      <div>
                        <p className="text-white text-sm font-medium">{apt.patientName}</p>
                        <p className="text-white/30 text-xs">{apt.doctorName} • {apt.type} • {apt.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/40 text-xs">{apt.time}</span>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${statusColors[apt.status] || ''}`}>{apt.status}</span>
                      <LocationIcon className="w-3.5 h-3.5 text-white/25" />
                    </div>
                  </motion.div>
                );
              })}
              {getAppointmentsForDate(parseInt(selectedDate.split('-')[2])).length === 0 && (
                <div className="text-center py-8">
                  <Calendar className="w-10 h-10 text-white/10 mx-auto mb-3" />
                  <p className="text-white/30 text-sm">No appointments for this date.</p>
                  <Button variant="glass" size="xs" className="mt-3" onClick={() => onNewAppointment?.(selectedDate)}>
                    <Plus className="w-3.5 h-3.5 mr-1" /> Schedule
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </GlassmorphicCard>
    </motion.div>
  );
};

export default AppointmentCalendar;