import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill,
  Plus,
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Bell,
  Activity,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Trash2,
  Edit2,
  Save
} from 'lucide-react';
import { clsx } from 'clsx';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  instructions: string;
  prescribedBy: string;
  status: 'active' | 'paused' | 'completed' | 'discontinued';
  adherence: number;
  nextDose?: string;
  refillDate?: string;
  sideEffects: string[];
}

export interface MedicineTrackerProps {
  medications?: Medication[];
  variant?: 'glass' | 'gradient' | 'neon';
  onAddMedication?: (medication: Omit<Medication, 'id'>) => void;
  onUpdateMedication?: (id: string, updates: Partial<Medication>) => void;
  onDeleteMedication?: (id: string) => void;
  onMarkTaken?: (id: string, time: string) => void;
  className?: string;
}

// ============================================
// MEDICINE TRACKER COMPONENT
// ============================================
export const MedicineTracker: React.FC<MedicineTrackerProps> = ({
  medications: initialMedications = [
    {
      id: '1',
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      times: ['08:00'],
      startDate: '2024-01-01',
      instructions: 'Take with food',
      prescribedBy: 'Dr. Sarah Johnson',
      status: 'active',
      adherence: 95,
      nextDose: '08:00',
      refillDate: '2024-02-15',
      sideEffects: ['Mild dizziness'],
    },
    {
      id: '2',
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      times: ['08:00', '20:00'],
      startDate: '2024-01-01',
      instructions: 'Take after meals',
      prescribedBy: 'Dr. Michael Chen',
      status: 'active',
      adherence: 88,
      nextDose: '20:00',
      refillDate: '2024-02-20',
      sideEffects: [],
    },
  ],
  variant = 'glass',
  onAddMedication,
  onUpdateMedication,
  onDeleteMedication,
  onMarkTaken,
  className,
}) => {
  const [medications, setMedications] = useState<Medication[]>(initialMedications);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    name: '',
    dosage: '',
    frequency: '',
    times: [],
    instructions: '',
    prescribedBy: '',
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [adherenceData, setAdherenceData] = useState<number[]>([95, 88, 92, 85, 90, 94, 87]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMedications(prev => prev.map(med => {
        if (med.status === 'active') {
          const now = new Date();
          const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const nextDoseTime = med.times.find(time => time > currentTime) || med.times[0];
          
          return {
            ...med,
            nextDose: nextDoseTime,
            adherence: Math.max(80, Math.min(100, med.adherence + (Math.random() - 0.5) * 2)),
          };
        }
        return med;
      }));
      
      // Update adherence chart data
      setAdherenceData(prev => [...prev.slice(1), Math.floor(Math.random() * 20) + 80]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const calculateNextDose = (times: string[]) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    for (const time of times) {
      const [hours, minutes] = time.split(':').map(Number);
      const doseTime = hours * 60 + minutes;
      if (doseTime > currentTime) {
        return time;
      }
    }
    return times[0]; // Next day's first dose
  };

  const getTimeUntilNextDose = (time: string) => {
    const now = new Date();
    const [hours, minutes] = time.split(':').map(Number);
    const nextDose = new Date();
    nextDose.setHours(hours, minutes, 0, 0);
    
    if (nextDose < now) {
      nextDose.setDate(nextDose.getDate() + 1);
    }
    
    const diff = nextDose.getTime() - now.getTime();
    const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hoursLeft}h ${minutesLeft}m`;
  };

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      const medication: Medication = {
        id: Date.now().toString(),
        name: newMedication.name,
        dosage: newMedication.dosage,
        frequency: newMedication.frequency || 'Once daily',
        times: newMedication.times || ['08:00'],
        startDate: new Date().toISOString().split('T')[0],
        instructions: newMedication.instructions || '',
        prescribedBy: newMedication.prescribedBy || 'Self',
        status: 'active',
        adherence: 100,
        sideEffects: [],
      };
      onAddMedication?.(medication);
      setMedications(prev => [...prev, medication]);
      setShowAddForm(false);
      setNewMedication({});
    }
  };

  const handleMarkTaken = (id: string, time: string) => {
    onMarkTaken?.(id, time);
    // Update adherence
    setMedications(prev => prev.map(med => 
      med.id === id 
        ? { ...med, adherence: Math.min(100, med.adherence + 1) }
        : med
    ));
  };

  const getStatusColor = (status: Medication['status']) => {
    const colors = {
      active: 'bg-green-500/10 text-green-300 border-green-500/30',
      paused: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
      completed: 'bg-gray-500/10 text-gray-300 border-gray-500/30',
      discontinued: 'bg-red-500/10 text-red-300 border-red-500/30',
    };
    return colors[status];
  };

  return (
    <div className={twMerge('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white mb-2">Medicine Tracker</h2>
          <p className="text-white/60">Track your medications and adherence</p>
        </div>
        <Button
          variant="gradient"
          size="sm"
          leftIcon={Plus}
          onClick={() => setShowAddForm(!showAddForm)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Medication
        </Button>
      </div>

      {/* Adherence Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <GlassmorphicCard variant={variant}>
          <h3 className="text-lg font-bold text-white mb-3">Overall Adherence</h3>
          <div className="relative mb-4">
            <svg className="w-24 h-24 mx-auto transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
                fill="none"
              />
              <motion.circle
                cx="48"
                cy="48"
                r="40"
                stroke="url(#gradient)"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 40}`}
                strokeDashoffset={`${2 * Math.PI * 40 * (1 - 91 / 100)}`}
                initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - 91 / 100) }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.p 
                className="text-2xl font-black text-white"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                91%
              </motion.p>
            </div>
          </div>
          <p className="text-center text-sm text-white/60">Last 7 days</p>
        </GlassmorphicCard>

        <GlassmorphicCard variant={variant}>
          <h3 className="text-lg font-bold text-white mb-3">Active Medications</h3>
          <motion.p 
            className="text-3xl font-black text-white mb-2"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            {medications.filter(m => m.status === 'active').length}
          </motion.p>
          <p className="text-sm text-white/60">Currently taking</p>
        </GlassmorphicCard>

        <GlassmorphicCard variant={variant}>
          <h3 className="text-lg font-bold text-white mb-3">Next Refill</h3>
          <motion.p 
            className="text-2xl font-black text-cyan-400 mb-2"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            3 Days
          </motion.p>
          <p className="text-sm text-white/60">Lisinopril</p>
        </GlassmorphicCard>
      </div>

      {/* Add Medication Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GlassmorphicCard variant={variant} className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Add New Medication</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Medication Name"
                  value={newMedication.name || ''}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Dosage (e.g., 10mg)"
                  value={newMedication.dosage || ''}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, dosage: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Frequency (e.g., Once daily)"
                  value={newMedication.frequency || ''}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, frequency: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Time (e.g., 08:00)"
                  value={newMedication.times?.[0] || ''}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, times: [e.target.value] }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Prescribed By"
                  value={newMedication.prescribedBy || ''}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, prescribedBy: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Special Instructions"
                  value={newMedication.instructions || ''}
                  onChange={(e) => setNewMedication(prev => ({ ...prev, instructions: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="glassmorphic"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={handleAddMedication}
                  disabled={!newMedication.name || !newMedication.dosage}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Add Medication
                </Button>
              </div>
            </GlassmorphicCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Medications List */}
      <div className="space-y-4">
        <AnimatePresence>
          {medications.map((medication, index) => (
            <motion.div
              key={medication.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05, type: 'spring' }}
            >
              <GlassmorphicCard variant={variant} className="p-0 overflow-hidden">
                {/* Header */}
                <motion.div
                  className="p-4 cursor-pointer"
                  whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                  onClick={() => setExpandedId(expandedId === medication.id ? null : medication.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className="p-3 rounded-xl bg-white/10"
                      >
                        <Pill className="w-6 h-6 text-cyan-400" />
                      </motion.div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{medication.name}</h4>
                        <p className="text-sm text-white/70">
                          {medication.dosage} • {medication.frequency}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getStatusColor(medication.status)} size="xs">
                            {medication.status}
                          </Badge>
                          <span className="text-xs text-white/60">
                            Adherence: {medication.adherence.toFixed(0)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Next Dose */}
                      {medication.status === 'active' && (
                        <motion.div
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-right"
                        >
                          <p className="text-xs text-white/60">Next dose</p>
                          <p className="text-sm font-bold text-cyan-400">
                            {medication.nextDose} ({getTimeUntilNextDose(medication.nextDose || '')})
                          </p>
                        </motion.div>
                      )}

                      {/* Expand Toggle */}
                      <motion.div
                        animate={{ rotate: expandedId === medication.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="w-5 h-5 text-white/60" />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {expandedId === medication.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                      className="border-t border-white/10"
                    >
                      <div className="p-4 space-y-4">
                        {/* Dose Times */}
                        <div>
                          <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-cyan-400" />
                            Dose Times
                          </h5>
                          <div className="flex flex-wrap gap-2">
                            {medication.times.map((time, i) => (
                              <motion.button
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleMarkTaken(medication.id, time)}
                                className={clsx(
                                  'px-3 py-2 rounded-lg text-sm font-medium transition-all',
                                  'bg-white/10 hover:bg-cyan-500/20 border border-white/20',
                                  'flex items-center gap-2'
                                )}
                              >
                                <Bell className="w-3 h-3" />
                                {time}
                                <motion.div
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  <CheckCircle className="w-3 h-3 text-green-400" />
                                </motion.div>
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-bold text-white mb-2">Prescription Details</h5>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-white/60">Started:</span>
                                <span className="text-white">{medication.startDate}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-white/60">Prescribed by:</span>
                                <span className="text-white">{medication.prescribedBy}</span>
                              </div>
                              {medication.refillDate && (
                                <div className="flex justify-between">
                                  <span className="text-white/60">Refill due:</span>
                                  <Badge variant="warning" size="xs">
                                    {medication.refillDate}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <h5 className="text-sm font-bold text-white mb-2">Instructions</h5>
                            <p className="text-sm text-white/80">{medication.instructions || 'Take as directed'}</p>
                          </div>
                        </div>

                        {/* Side Effects */}
                        {medication.sideEffects.length > 0 && (
                          <div>
                            <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-yellow-400" />
                              Side Effects
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {medication.sideEffects.map((effect, i) => (
                                <Badge key={i} variant="warning" size="xs">
                                  {effect}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="glassmorphic"
                              size="xs"
                              leftIcon={RefreshCw}
                              onClick={() => {
                                // Trigger refill reminder
                              }}
                            >
                              Refill Reminder
                            </Button>
                            <Button
                              variant="glassmorphic"
                              size="xs"
                              leftIcon={Activity}
                              onClick={() => {
                                // View adherence details
                              }}
                            >
                              Adherence
                            </Button>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="danger"
                              size="xs"
                              iconOnly
                              onClick={() => onDeleteMedication?.(medication.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassmorphicCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Adherence Chart */}
      <GlassmorphicCard variant={variant}>
        <h3 className="text-lg font-bold text-white mb-4">Weekly Adherence Trend</h3>
        <div className="h-48 relative">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((y) => (
              <line
                key={y}
                x1="0"
                y1={100 - y}
                x2="100"
                y2={100 - y}
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="0.5"
              />
            ))}
            {/* Adherence line */}
            <motion.polyline
              points={adherenceData.map((value, i) => `${(i / (adherenceData.length - 1)) * 100},${100 - value}`).join(' ')}
              fill="none"
              stroke="url(#adherenceGradient)"
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
            <defs>
              <linearGradient id="adherenceGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            {/* Data points */}
            {adherenceData.map((value, i) => (
              <motion.circle
                key={i}
                cx={(i / (adherenceData.length - 1)) * 100}
                cy={100 - value}
                r="1.5"
                fill="#06b6d4"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 2 + i * 0.1 }}
              />
            ))}
          </svg>
          <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
              <span key={i} className="text-xs text-white/60">{day}</span>
            ))}
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
};

export default MedicineTracker;
