import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from framer-motion';
import { 
  Heart,
  Baby,
  Calendar,
  Shield,
  AlertTriangle,
  CheckCircle,
  Activity,
  TrendingUp,
  TrendingDown,
  FileText,
  Plus,
  Minus,
  Users,
  MapPin,
  Phone,
  MessageSquare,
  Edit2,
  RefreshCw,
  File,
  ChartBar
} from lucide-react';
import { clsx } from 'clsx';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface PregnancyData {
  id: string;
  name: string;
  dueDate: string;
  pregnancyWeek: number;
  weight: string;
  bloodPressure: string;
  symptoms: string[];
  medications: string[];
  medicalHistory: string[];
  appointments: Array<{
    date: string;
    time: string;
    type: string;
    location: string;
    notes: string;
  }>;
  notes: string;
  babyName?: string;
  babyGender?: 'male' | 'female' | 'unknown';
  isHighRisk: boolean;
  bmi: string;
  createdAt: string;
}

export interface PregnancyTrackerProps {
  pregnancyData?: PregnancyData;
  variant?: 'glass' | 'gradient' | 'neon';
  onAddAppointment?: (appointment: any) => void;
  onAddNote?: (note: string) => void;
  onUpdatePregnancy?: (updates: Partial<PregnancyData>) => void;
  className?: string;
}

// ============================================
// PREGNANCY TRACKER COMPONENT
// ============================================
export const PregnancyTracker: React.FC<PregnancyTrackerProps> = ({
  pregnancyData = {
    id: '1',
    name: 'Sarah Johnson',
    dueDate: '2024-10-15',
    pregnancyWeek: 24,
    weight: '65kg',
    bloodPressure: '120/80',
    symptoms: ['Morning sickness', 'Fatigue', 'Breast tenderness'],
    medications: ['Prenatal vitamins'],
    medicalHistory: ['Previous C-section'],
    appointments: [
      {
        date: '2024-01-15',
        time: '10:00',
        type: 'First Trimester Checkup',
        location: 'City General Hospital',
        notes: 'Initial consultation and ultrasound',
      },
      {
        date: '2024-02-12',
        time: '14:00',
        type: 'Second Trimester Checkup',
        location: 'City General Hospital',
        notes: 'Anatomy scan',
      },
    ],
    notes: 'Taking prenatal vitamins daily, staying hydrated, getting enough rest',
    babyName: 'Emma',
    babyGender: 'female',
    isHighRisk: false,
    bmi: '22.5',
    createdAt: '2023-12-15',
  },
  variant = 'glass',
  onAddAppointment,
  onAddNote,
  onUpdatePregnancy,
  className,
}) => {
  const [pregnancy, setPregnancy] = useState<PregnancyData>(pregnancyData);
  const [selectedWeek, setSelectedWeek] = useState<number>(pregnancyData.week);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    date: '',
    time: '',
    type: '',
    location: '',
    notes: '',
  });
  const [newNote, setNewNote] = useState('');

  // Calculate due date
  const calculateDueDate = (weeks: number) => {
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + (weeks * 7));
    return dueDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  // Get week information
  const getWeekInfo = (week: number) => {
    const trimester = Math.floor((week - 1) / 13) + 1;
    const trimesterLabel = ['First', 'Second', 'Third'][trimester - 1];
    const weekInTrimester = (week - 1) % 13 + 1;

    return {
      trimester,
      trimesterLabel,
      weekInTrimester,
    };
  };

  const currentWeekInfo = getWeekInfo(selectedWeek);

  // Get baby size
  const getBabySize = (week: number) => {
    const sizes = {
      1: 'a poppy seed',
      4: 'a sesame seed',
      8: 'a raspberry',
      12: 'a lime',
      16: 'an avocado',
      20: 'a banana',
      24: 'an eggplant',
      28: 'an eggplant',
      32: 'a butternut squash',
      36: 'a honeydew melon',
      40: 'a watermelon',
    };
    return sizes[week] || 'a baby';
  };

  // Handle add appointment
  const handleAddAppointment = () => {
    if (newAppointment.date && newAppointment.time && newAppointment.type && newAppointment.location) {
      const appointment = {
        id: Date.now().toString(),
        date: newAppointment.date,
        time: newAppointment.time,
        type: newAppointment.type,
        location: newAppointment.location,
        notes: newAppointment.notes,
      };
      onAddAppointment?.(appointment);
      setPregnancy(prev => ({
        ...prev,
        appointments: [...prev.appointments, appointment],
      }));
      setShowAddAppointment(false);
      setNewAppointment({ date: '', time: '', type: '', location: '', notes: '' });
    }
  };

  // Handle add note
  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote?.(newNote);
      setPregnancy(prev => ({
        ...prev,
        notes: `${prev.notes}\n${newNote}`,
      }));
      setNewNote('');
    }
  };

  // Get trimester information
  const trimesterInfo = getTrimesterInfo(selectedWeek);

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
      <GlassmorphicCard variant={variant}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl"
              >
                <Baby className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-black text-white">
                  🤰 Pregnancy Tracker
                </h1>
                <p className="text-white/70">Week {selectedWeek} of 40</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Badge variant="success" size="sm">
                {pregnancy.isHighRisk ? 'High Risk' : 'Low Risk'}
              </Badge>
              <Button
                variant="gradient"
                size="sm"
                leftIcon={Calendar}
                onClick={() => {
                  // Open timeline
                }}
              >
                Timeline
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Due Date</span>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Calendar className="w-5 h-5 text-pink-400" />
                </motion.div>
              </div>
              <p className="text-2xl font-black text-white">
                {pregnancy.dueDate}
              </p>
            </div>

            <div className="p-4 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Current Week</span>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Heart className="w-5 h-5 text-green-400" />
                </motion.div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-black text-white">{selectedWeek}</p>
                <span className="text-sm text-white/70">
                  Week {trimesterInfo.weekInTrimester} of {trimesterInfo.trimesterLabel}
                </span>
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/70">Baby Size</span>
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Baby className="w-5 h-5 text-purple-400" />
                </motion.div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xl font-black text-white">{getBabySize(selectedWeek)}</p>
                <span className="text-sm text-white/70">{selectedWeek} weeks</span>
              </div>
            </div>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassmorphicCard variant={variant}>
          <div className="p-6">
            <h3 className="text-lg font-bold text-white mb-4">Health Metrics</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white/10 rounded-xl">
                <p className="text-sm text-white/70 mb-2">Weight</p>
                <p className="text-lg font-black text-green-400">{pregnancy.weight}</p>
                <p className="text-xs text-white/70">Healthy range</p>
              </div>

              <div className="p-4 bg-white/10 rounded-xl">
                <p className="text-sm text-white/70 mb-2">Blood Pressure</p>
                <p className="text-lg font-black text-green-400">{pregnancy.bloodPressure}</p>
                <p className="text-xs text-white/70">Normal</p>
              </div>

              <div className="p-4 bg-white/10 rounded-xl">
                <p className="text-sm text-white/70 mb-2">BMI</p>
                <p className="text-lg font-black text-blue-400">{pregnancy.bmi}</p>
                <p className="text-xs text-white/70">Normal range</p>
              </div>

              <div className="p-4 bg-white/10 rounded-xl">
                <p className="text-sm text-white/70 mb-2">Trimester</p>
                <p className="text-lg font-black text-purple-400">{trimesterInfo.trimesterLabel}</p>
                <p className="text-xs text-white/70">Week {trimesterInfo.weekInTrimester}</p>
              </div>
            </div>

            {/* Medical History */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-400" />
                Medical History
              </h4>
              <div className="space-y-2">
                {pregnancy.medicalHistory.length > 0 ? (
                  pregnancy.medicalHistory.map((condition, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-white/10 rounded-lg flex items-center justify-between"
                    >
                      <span className="text-sm text-white">{condition}</span>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/60">
                    No medical history recorded
                  </p>
                )}
              </div>
            </motion.div>

            {/* Medications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            >
              <h4 className="text-sm font-bold text-white mb-3 mt-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                Current Medications
              </h4>
              <div className="space-y-2">
                {pregnancy.medications.length > 0 ? (
                  pregnancy.medications.map((medication, i) => (
                    <div
                      key={i}
                      className="p-2.5 bg-white/10 rounded-lg flex items-center justify-between"
                    >
                      <span className="text-sm text-white">{medication}</span>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/60">
                    No medications currently
                  </p>
                )}
              </div>
            </motion.div>
          </div>
        </GlassmorphicCard>

        {/* Symptoms Tracker */}
        <GlassmorphicCard variant={variant}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Symptoms Tracker</h3>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                onClick={() => setShowNotes(!showNotes)}
              >
                <Plus className="w-4 h-4 text-white" />
              </motion.div>
            </div>

            {/* Symptoms Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                'Morning sickness',
                'Fatigue',
                'Breast tenderness',
                'Heartburn',
                'Back pain',
                'Swelling',
                'Headaches',
                'Constipation',
              ].map((symptom, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                  className={clsx(
                    'p-3 rounded-xl',
                    pregnancy.symptoms.includes(symptom)
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-2 border-cyan-500/50'
                      : 'bg-white/10 border border-white/20 hover:border-white/30'
                  )}
                  onClick={() => {
                    if (pregnancy.symptoms.includes(symptom)) {
                      setPregnancy(prev => ({
                        ...prev,
                        symptoms: prev.symptoms.filter(s => s !== symptom),
                      }));
                    } else {
                      setPregnancy(prev => ({
                        ...prev,
                        symptoms: [...prev.symptoms, symptom],
                      }));
                    }
                  }}
                >
                  <div className={clsx(
                    'w-2 h-2 rounded-full',
                    pregnancy.symptoms.includes(symptom) ? 'bg-cyan-500' : 'bg-white/30'
                  )} />
                  <p className="text-xs text-white/70 mt-1">{symptom}</p>
                </motion.div>
              ))}
            </div>

            {/* Notes */}
            <AnimatePresence>
              {showNotes && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mt-4 p-4 bg-white/10 rounded-lg"
                >
                  <input
                    type="text"
                    placeholder="Add new symptom..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddNote(newNote)}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={() => handleAddNote(newNote)}
                    className="mt-2"
                  >
                    Add Symptom
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Appointments & Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments */}
        <GlassmorphicCard variant={variant}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Appointments</h3>
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
                onClick={() => setShowAppointmentForm(!showAppointmentForm)}
              >
                <Plus className="w-4 h-4 text-white" />
              </motion.div>
            </div>

            {/* Appointment Form */}
            <AnimatePresence>
              {showAppointmentForm && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="mb-6 p-4 bg-white/10 rounded-lg"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="Type (e.g., Checkup)"
                      value={newAppointment.type || ''}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, type: e.target.value }))}
                      className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      value={newAppointment.location || ''}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, location: e.target.value }))}
                      className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <input
                      type="date"
                      value={newAppointment.date || ''}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                      className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                    <input
                      type="time"
                      value={newAppointment.time || ''}
                      onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                      className="px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                  </div>
                  <textarea
                    placeholder="Notes (e.g., questions for doctor)"
                    value={newAppointment.notes || ''}
                    onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    rows={3}
                  />
                  <Button
                    variant="gradient"
                    size="sm"
                    onClick={handleAddAppointment}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Add Appointment
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Appointments List */}
            {pregnancy.appointments.length > 0 ? (
              <div className="space-y-4">
                {pregnancy.appointments.map((appointment, i) => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, type: 'spring' }}
                    className="p-4 bg-white/10 rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-white">{appointment.type}</h4>
                        <p className="text-xs text-white/70">
                          {appointment.date} at {appointment.time}
                        </p>
                        <p className="text-xs text-white/70">{appointment.location}</p>
                        {appointment.notes && (
                          <p className="text-xs text-white/60 mt-1">"{appointment.notes}"</p>
                        )}
                      </div>
                      <Button
                        variant="glassmorphic"
                        size="xs"
                        iconOnly
                        onClick={() => {
                          // Edit appointment
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-white/70">
                        {i === 0 ? 'Today' : `In ${i} days`}
                      </p>
                      <Badge variant="info" size="xs">
                        Upcoming
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-white/30 mx-auto mb-4" />
                <p className="text-white/60">No appointments scheduled yet</p>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={() => setShowAppointmentForm(true)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Schedule First Appointment
                </Button>
              </div>
            )}
          </div>
        </GlassmorphicCard>

        {/* Timeline */}
        <GlassmorphicCard variant={variant}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-white">Timeline</h3>
              <Button
                variant="gradient"
                size="sm"
                onClick={() => {
                  // Open timeline
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View Timeline
              </Button>
            </div>

            {/* Timeline Progress */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center">
                <div className="mb-3">
                  <div className="relative w-20 h-20 mx-auto">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center">
                        <span className="text-2xl font-black text-white">{selectedWeek}</span>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
                        <span className="text-3xl font-black text-white/30">🤰</span>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-bold text-white">Week {selectedWeek}</p>
                <p className="text-xs text-white/60">
                  {trimesterInfo.trimesterLabel} - Week {trimesterInfo.weekInTrimester}
                </p>
              </div>

              <div className="text-center">
                <div className="mb-3">
                  <div className="w-20 h-20 mx-auto relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                        <span className="text-2xl font-black text-white">
                          {calculateDueDate(40 - selectedWeek).split(' ')[1]}
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-white/30" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-bold text-white">Due Date</p>
                <p className="text-xs text-white/60">
                  {calculateDueDate(40 - selectedWeek)}
                </p>
              </div>

              <div className="text-center">
                <div className="mb-3">
                  <div className="w-20 h-20 mx-auto relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-2xl font-black text-white">
                          {getBabySize(selectedWeek)}
                        </span>
                      </div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
                        <Baby className="w-8 h-8 text-white/30" />
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-sm font-bold text-white">Baby Size</p>
                <p className="text-xs text-white/60">
                  {getBabySize(selectedWeek)} at {selectedWeek} weeks
                </p>
              </div>
            </div>

            {/* Trimester Progress */}
            <div className="mb-6">
              <h4 className="text-sm font-bold text-white mb-2">Trimester Progress</h4>
              <div className="space-y-2">
                {[1, 2, 3].map((trimester) => {
                  const info = getTrimesterInfo(trimester);
                  const isCurrent = trimester === trimesterInfo.trimester;
                  const progress = Math.min(1, (selectedWeek - (trimester - 1) * 13) / 13);

                  return (
                    <motion.div
                      key={trimester}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: trimester * 0.1, type: 'spring' }}
                      className="p-3 rounded-xl"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-white">
                          {info.trimesterLabel}
                        </span>
                        <Badge 
                          variant={isCurrent ? 'gradient' : 'outline'} 
                          size="sm"
                        >
                          Week {Math.floor(progress * 13)}
                        </Badge>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-2">
                        <motion.div
                          className={clsx(
                            'h-full rounded-full',
                            isCurrent ? 'bg-gradient-to-r from-cyan-500 to-blue-500' : 'bg-white/40'
                          )}
                          initial={{ width: 0 }}
                          animate={{ width: `${progress * 100}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Important Dates */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-white mb-2">Important Dates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, type: 'spring' }}
                  className="p-3 bg-white/10 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-white">Next Appointment</p>
                    <Badge variant="gradient" size="sm">
                      {pregnancy.appointments[0]?.date || 'TBD'}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/70">
                    {pregnancy.appointments[0]?.type || 'No appointments scheduled'}
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="p-3 bg-white/10 rounded-xl"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-bold text-white">Due Date</p>
                    <Badge variant="danger" size="sm">
                      {calculateDueDate(40 - selectedWeek)}
                    </Badge>
                  </div>
                  <p className="text-xs text-white/70">
                    {40 - selectedWeek} weeks to go
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Quick Tips */}
      <GlassmorphicCard variant={variant} className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">Quick Tips for Week {selectedWeek}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0, type: 'spring' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-white/10 rounded-xl cursor-pointer hover:bg-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-6 h-6 text-pink-400" />
              <Badge variant="success" size="sm">
                Tip
              </Badge>
            </div>
            <p className="text-sm text-white/70 mb-2">
              Stay hydrated! Drink at least 8-10 glasses of water daily.
            </p>
            <p className="text-xs text-white/60">
              Proper hydration is crucial for your baby's development and your health.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-white/10 rounded-xl cursor-pointer hover:bg-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-6 h-6 text-green-400" />
              <Badge variant="info" size="sm">
                Exercise
              </Badge>
            </div>
            <p className="text-sm text-white/70 mb-2">
              Gentle exercise like walking or swimming is beneficial.
            </p>
            <p className="text-xs text-white/60">
              Aim for 30 minutes of moderate activity most days of the week.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: 'spring' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-4 bg-white/10 rounded-xl cursor-pointer hover:bg-white/20"
          >
            <div className="flex items-center justify-between mb-4">
              <Shield className="w-6 h-6 text-purple-400" />
              <Badge variant="warning" size="sm">
                Safety
              </Badge>
            </div>
            <p className="text-sm text-white/70 mb-2">
              Avoid harmful substances like alcohol and tobacco.
            </p>
            <p className="text-xs text-white/60">
              These can harm your baby's development.
            </p>
          </motion.div>
        </div>
      </GlassmorphicCard>
    </motion.div>
  );
};