import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  Edit2,
  Trash2,
  Users,
  Activity,
  AlertCircle,
  CheckCircle,
  ClockIcon,
  MapPin,
  Phone,
  Video,
  MessageSquare
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { DoctorCard } from '../doctor/DoctorCard';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  type: 'consultation' | 'follow-up' | 'emergency' | 'checkup';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  location: 'in-person' | 'video' | 'phone';
  notes?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
}

export interface AppointmentCalendarProps {
  appointments: Appointment[];
  doctors: Doctor[];
  variant?: 'glass' | 'gradient' | 'neon';
  onDateSelect?: (date: string) => void;
  onAppointmentClick?: (appointment: Appointment) => void;
  onNewAppointment?: (date: string) => void;
  onDragDrop?: (appointmentId: string, newDate: string, newTime: string) => void;
  className?: string;
}

// ============================================
// CALENDAR COMPONENT
// ============================================
export const AppointmentCalendar: React.FC<AppointmentCalendarProps> = ({
  appointments,
  doctors,
  variant = 'glass',
  onDateSelect,
  onAppointmentClick,
  onNewAppointment,
  onDragDrop,
  className,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [draggedAppointment, setDraggedAppointment] = useState<string | null>(null);

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: string) => {
    return appointments.filter(apt => apt.date === date);
  };

  // Check if date has appointments
  const hasAppointments = (date: string) => {
    return getAppointmentsForDate(date).length > 0;
  };

  // Get appointment count for date
  const getAppointmentCount = (date: string) => {
    return getAppointmentsForDate(date).length;
  };

  // Navigate to previous period
  const navigatePrev = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  // Navigate to next period
  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (viewMode === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Get days in month
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay();

    const days = [];
    // Add empty cells for days before month starts
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      days.push(dateStr);
    }
    return days;
  };

  // Handle drag start
  const handleDragStart = (appointmentId: string) => {
    setDraggedAppointment(appointmentId);
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, newDate: string, newTime?: string) => {
    e.preventDefault();
    if (draggedAppointment) {
      const appointment = appointments.find(a => a.id === draggedAppointment);
      if (appointment) {
        onDragDrop?.(draggedAppointment, newDate, newTime || appointment.time);
      }
      setDraggedAppointment(null);
    }
  };

  // Appointment status colors
  const statusColors = {
    scheduled: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    confirmed: 'bg-green-500/10 text-green-300 border-green-500/30',
    'in-progress': 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    completed: 'bg-gray-500/10 text-gray-300 border-gray-500/30',
    cancelled: 'bg-red-500/10 text-red-300 border-red-500/30',
    'no-show': 'bg-orange-500/10 text-orange-300 border-orange-500/30',
  } as const;

  // Location icons
  const locationIcons = {
    'in-person': MapPin,
    video: Video,
    phone: Phone,
  } as const;

  // Priority colors
  const priorityColors = {
    low: 'bg-gray-500/10 text-gray-300 border-gray-500/30',
    medium: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    high: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    urgent: 'bg-red-500/10 text-red-300 border-red-500/30',
  } as const;

  return (
    <motion.div
      className={twMerge(
        clsx(
          'space-y-6',
          className
        )
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Appointment Calendar</h2>
          <p className="text-white/60">Manage and track all appointments</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-white/10 rounded-xl">
            {(['month', 'week', 'day'] as const).map(mode => (
              <Button
                key={mode}
                variant={viewMode === mode ? 'glass' : 'ghost'}
                size="sm"
                onClick={() => setViewMode(mode)}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Button>
            ))}
          </div>

          <Button
            variant="gradient"
            size="sm"
            leftIcon={Plus}
            onClick={() => onNewAppointment?.(selectedDate || new Date().toISOString().split('T')[0])}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            New Appointment
          </Button>
        </div>
      </div>

      {/* Calendar Navigation */}
      <GlassmorphicCard variant={variant}>
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <Button
            variant="glassmorphic"
            size="sm"
            iconOnly
            onClick={navigatePrev}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <motion.h3 
            className="text-xl font-bold text-white"
            key={currentDate.toISOString()}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {formatDate(currentDate)}
          </motion.h3>

          <Button
            variant="glassmorphic"
            size="sm"
            iconOnly
            onClick={navigateNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Month View */}
        {viewMode === 'month' && (
          <div className="p-4">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-white/60 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-2">
              <AnimatePresence>
                {getDaysInMonth(currentDate).map((date, index) => (
                  <motion.div
                    key={`${date}-${index}`}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.01, type: 'spring' }}
                    className="aspect-square"
                  >
                    {date ? (
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setSelectedDate(date);
                          onDateSelect?.(date);
                        }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, date)}
                        className={clsx(
                          'w-full h-full p-2 rounded-xl text-sm transition-all relative',
                          'bg-white/5 hover:bg-white/10 border border-white/10',
                          selectedDate === date && 'bg-cyan-500/20 border-cyan-500 shadow-lg',
                          hasAppointments(date) && 'border-2 border-blue-500/50'
                        )}
                      >
                        <span className={clsx(
                          'font-medium',
                          selectedDate === date ? 'text-cyan-300' : 'text-white'
                        )}>
                          {new Date(date).getDate()}
                        </span>

                        {hasAppointments(date) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="absolute bottom-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                          >
                            <span className="text-xs text-white font-bold">
                              {getAppointmentCount(date)}
                            </span>
                          </motion.div>
                        )}
                      </motion.button>
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Week/Day View */}
        {(viewMode === 'week' || viewMode === 'day') && (
          <div className="p-4">
            <div className="space-y-3 max-h-96 overflow-y-auto custom-scrollbar">
              {timeSlots.map(time => {
                const appointmentsForTime = appointments.filter(apt => apt.time === time);
                return (
                  <motion.div
                    key={time}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: parseInt(time.split(':')[0]) * 0.01 }}
                    className="flex items-center gap-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, selectedDate || new Date().toISOString().split('T')[0], time)}
                  >
                    <div className="w-20 text-sm font-medium text-white/70">{time}</div>
                    <div className="flex-1">
                      {appointmentsForTime.length > 0 ? (
                        <div className="space-y-2">
                          {appointmentsForTime.map(appointment => (
                            <motion.div
                              key={appointment.id}
                              draggable
                              onDragStart={() => handleDragStart(appointment.id)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => onAppointmentClick?.(appointment)}
                              className={clsx(
                                'p-2 rounded-lg cursor-pointer transition-all',
                                'bg-white/10 hover:bg-white/20 border border-white/10',
                                'flex items-center justify-between'
                              )}
                            >
                              <div className="flex items-center gap-2">
                                <div className={clsx(
                                  'w-2 h-2 rounded-full',
                                  appointment.priority ? priorityColors[appointment.priority] : 'bg-white/30'
                                )} />
                                <span className="text-sm font-medium text-white">
                                  {appointment.patientName}
                                </span>
                                {React.createElement(locationIcons[appointment.location as keyof typeof locationIcons], {
                                  className: 'w-3 h-3 text-white/60 ml-2'
                                })}
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={statusColors[appointment.status]} size="xs">
                                  {appointment.status}
                                </Badge>
                                {appointment.doctorName && (
                                  <span className="text-xs text-white/60">
                                    {appointment.doctorName}
                                  </span>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <Button
                          variant="glassmorphic"
                          size="xs"
                          leftIcon={Plus}
                          onClick={() => onNewAppointment?.(selectedDate || new Date().toISOString().split('T')[0])}
                        >
                          Add Appointment
                        </Button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </GlassmorphicCard>

      {/* Selected Date Details */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <GlassmorphicCard variant={variant}>
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h3 className="text-xl font-bold text-white">
                Appointments for {new Date(selectedDate).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h3>
              <Badge variant="gradient" size="sm">
                {getAppointmentCount(selectedDate)} Appointments
              </Badge>
            </div>

            <div className="p-6 space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
              {getAppointmentsForDate(selectedDate).length > 0 ? (
                getAppointmentsForDate(selectedDate).map((appointment, i) => (
                  <motion.div
                    key={appointment.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, type: 'spring' }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => onAppointmentClick?.(appointment)}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all cursor-pointer border border-white/10 hover:border-white/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className={clsx(
                        'w-3 h-3 rounded-full',
                        appointment.priority ? priorityColors[appointment.priority] : 'bg-white/30'
                      )} />
                      <div>
                        <p className="text-white font-medium">{appointment.patientName}</p>
                        <div className="flex items-center gap-2 text-sm text-white/60">
                          <ClockIcon className="w-3 h-3" />
                          {appointment.time}
                          {React.createElement(locationIcons[appointment.location as keyof typeof locationIcons], {
                            className: 'w-3 h-3 ml-2'
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge className={statusColors[appointment.status]} size="xs">
                        {appointment.status}
                      </Badge>
                      <Button
                        variant="glassmorphic"
                        size="xs"
                        iconOnly
                        onClick={(e) => {
                          e.stopPropagation();
                          // Edit appointment
                        }}
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Calendar className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60">No appointments scheduled for this date</p>
                  <Button
                    variant="gradient"
                    size="sm"
                    className="mt-4"
                    onClick={() => onNewAppointment?.(selectedDate)}
                  >
                    Schedule First Appointment
                  </Button>
                </div>
              )}
            </div>
          </GlassmorphicCard>

          {/* Quick Stats for Selected Date */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total', value: getAppointmentCount(selectedDate), color: 'blue', icon: Calendar },
              { label: 'Confirmed', value: getAppointmentsForDate(selectedDate).filter(a => a.status === 'confirmed').length, color: 'green', icon: CheckCircle },
              { label: 'Pending', value: getAppointmentsForDate(selectedDate).filter(a => a.status === 'scheduled').length, color: 'yellow', icon: ClockIcon },
              { label: 'Cancelled', value: getAppointmentsForDate(selectedDate).filter(a => a.status === 'cancelled').length, color: 'red', icon: X },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
              >
                <GlassmorphicCard variant="glass" className="p-4 text-center">
                  <stat.icon className={clsx('w-6 h-6 mx-auto mb-2', `text-${stat.color}-400`)} />
                  <p className="text-2xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-xs text-white/60">{stat.label}</p>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};