// src/components/doctors/DoctorSchedule.tsx
// ALL EXPORTS ADDED - NO CODE DELETED

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Video,
  Phone,
  User,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================
// TYPES & INTERFACES (EXPORTED)
// ============================================

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
  type: 'consultation' | 'follow-up' | 'emergency';
  duration: number;
  price?: number;
}

export interface Doctor {
  id: string;
  name: string;
  specialization?: string;
  price?: number;
  rating?: number;
  availableSlots?: number;
}

export interface DoctorScheduleProps {
  doctor?: Doctor;
  variant?: 'glass' | 'gradient' | 'neon';
  onSlotSelect?: (slot: TimeSlot) => void;
  onDateSelect?: (date: Date) => void;
  className?: string;
}

// ============================================
// SCHEDULE COMPONENT (EXPORTED)
// ============================================

export const DoctorSchedule: React.FC<DoctorScheduleProps> = ({
  doctor = { id: 'default', name: 'Dr. Smith', specialization: 'General', price: 100, rating: 4.5, availableSlots: 10 },
  variant = 'glass',
  onSlotSelect,
  onDateSelect,
  className,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [view, setView] = useState<'week' | 'day'>('week');

  // Generate time slots
  const generateTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const startHour = 8;
    const endHour = 18;
    const slotDuration = 30;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const available = Math.random() > 0.3;
        slots.push({
          id: time,
          time,
          available,
          type: ['consultation', 'follow-up', 'emergency'][Math.floor(Math.random() * 3)] as TimeSlot['type'],
          duration: slotDuration,
          price: doctor.price,
        });
      }
    }
    return slots;
  };

  const [timeSlots] = useState<TimeSlot[]>(generateTimeSlots());

  // Generate week days
  const getWeekDays = () => {
    const days = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const weekDays = getWeekDays();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot.id);
    onSlotSelect?.(slot);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    onDateSelect?.(date);
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const slotTypeStyles: Record<string, string> = {
    consultation: 'border-blue-500/30 bg-blue-500/10',
    'follow-up': 'border-green-500/30 bg-green-500/10',
    emergency: 'border-red-500/30 bg-red-500/10',
  };

  const slotTypeColors: Record<string, string> = {
    consultation: 'text-blue-300',
    'follow-up': 'text-green-300',
    emergency: 'text-red-300',
  };

  return (
    <div className={twMerge('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Schedule & Availability</h3>
          <p className="text-sm text-white/60">Book your preferred time slot</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView(view === 'week' ? 'day' : 'week')}
            className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition-all"
          >
            {view === 'week' ? <Sun className="w-4 h-4 inline mr-1" /> : <Calendar className="w-4 h-4 inline mr-1" />}
            {view === 'week' ? 'Week View' : 'Day View'}
          </button>
        </div>
      </div>

      {/* Week Navigator */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h4 className="text-lg font-bold text-white">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </h4>
          <button
            onClick={() => navigateWeek('next')}
            className="p-2 rounded-lg bg-white/5 border border-white/10 text-white hover:bg-white/10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((date, i) => {
            const isSelected = selectedDate?.toDateString() === date.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            const hasAvailability = Math.random() > 0.3;

            return (
              <motion.button
                key={i}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateSelect(date)}
                className={clsx(
                  'p-3 rounded-xl text-center transition-all',
                  'bg-white/5 hover:bg-white/10 border border-white/10',
                  isToday && 'border-cyan-500/50',
                  isSelected && 'bg-cyan-500/20 border-cyan-500',
                  !hasAvailability && 'opacity-50'
                )}
              >
                <p className="text-xs text-white/60 mb-1">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </p>
                <p className={clsx(
                  'text-lg font-bold',
                  isSelected ? 'text-cyan-300' : 'text-white'
                )}>
                  {date.getDate()}
                </p>
                {hasAvailability && (
                  <motion.div
                    className="w-1.5 h-1.5 bg-green-400 rounded-full mx-auto mt-1"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Time Slots */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-bold text-white">
            {selectedDate ? formatDate(selectedDate) : 'Select a date'}
          </h4>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-white/60">
              <Sun className="w-3 h-3 text-yellow-400" /> Morning
            </div>
            <div className="flex items-center gap-1 text-xs text-white/60">
              <Clock className="w-3 h-3 text-blue-400" /> Afternoon
            </div>
            <div className="flex items-center gap-1 text-xs text-white/60">
              <Moon className="w-3 h-3 text-purple-400" /> Evening
            </div>
          </div>
        </div>

        {/* Slots Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
          <AnimatePresence>
            {timeSlots.map((slot, i) => {
              const hour = parseInt(slot.time.split(':')[0]);
              const isMorning = hour < 12;
              const isAfternoon = hour >= 12 && hour < 17;
              const isEvening = hour >= 17;

              return (
                <motion.button
                  key={slot.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: i * 0.02, type: 'spring' }}
                  whileHover={{ scale: slot.available ? 1.05 : 1 }}
                  whileTap={{ scale: slot.available ? 0.95 : 1 }}
                  onClick={() => handleSlotSelect(slot)}
                  disabled={!slot.available}
                  className={clsx(
                    'relative p-3 rounded-xl text-center transition-all border',
                    slot.available
                      ? clsx(
                          'bg-white/5 hover:bg-white/10',
                          slotTypeStyles[slot.type],
                          selectedSlot === slot.id && 'bg-cyan-500/20 border-cyan-500 shadow-lg'
                        )
                      : 'bg-white/5 opacity-50 cursor-not-allowed border-white/10'
                  )}
                >
                  <div className="flex items-center justify-center gap-1 mb-2">
                    {isMorning && <Sun className="w-3 h-3 text-yellow-400" />}
                    {isAfternoon && <Clock className="w-3 h-3 text-blue-400" />}
                    {isEvening && <Moon className="w-3 h-3 text-purple-400" />}
                    <p className={clsx(
                      'text-sm font-bold',
                      slot.available ? slotTypeColors[slot.type] : 'text-white/40'
                    )}>
                      {slot.time}
                    </p>
                  </div>
                  {slot.available && (
                    <>
                      <p className={clsx('text-xs font-medium mb-1', slotTypeColors[slot.type])}>
                        {slot.type}
                      </p>
                      <p className="text-xs text-white/60">${slot.price}</p>
                    </>
                  )}
                  {!slot.available && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <XCircle className="w-6 h-6 text-red-400/50" />
                    </div>
                  )}
                  {selectedSlot === slot.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500/20 border border-blue-500/30 rounded" />
            <span className="text-white/60">Consultation</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500/20 border border-green-500/30 rounded" />
            <span className="text-white/60">Follow-up</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500/20 border border-red-500/30 rounded" />
            <span className="text-white/60">Emergency</span>
          </div>
        </div>
      </div>

      {/* Selected Slot Summary */}
      <AnimatePresence>
        {selectedSlot && selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-4 rounded-xl bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30"
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-bold text-white">Selected Slot</h4>
              <span className="px-2 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Ready to Book
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="text-white/80">{formatDate(selectedDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-white/80">{selectedSlot}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span className="text-white/80">Dr. {doctor.name}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button
                className="flex-1 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium hover:from-cyan-600 hover:to-blue-600"
                onClick={() => {
                  const slot = timeSlots.find(s => s.id === selectedSlot);
                  if (slot) onSlotSelect?.(slot);
                }}
              >
                Confirm Booking
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10"
                onClick={() => setSelectedSlot(null)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default DoctorSchedule;