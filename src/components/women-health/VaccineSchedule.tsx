import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from framer-motion';
import { 
  Syringe,
  CheckCircle,
  AlertTriangle,
  Plus,
  Clock,
  Users,
  Heart,
  Shield,
  TrendingUp,
  FileText,
  Edit2,
  Trash2
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
export interface Vaccine {
  id: string;
  name: string;
  disease: string;
  ageGroup: string;
  doseNumber: number;
  totalDoses: number;
  status: 'scheduled' | 'completed' | 'overdue' | 'missed';
  dateAdministered?: string;
  nextDue?: string;
  location?: string;
  provider?: string;
  sideEffects?: string[];
}

export interface VaccineScheduleProps {
  vaccines: Vaccine[];
  variant?: 'glass' | 'gradient' | 'neon';
  onAddVaccine?: (vaccine: Omit<Vaccine, 'id'>) => void;
  onUpdateVaccine?: (id: string, updates: Partial<Vaccine>) => void;
  onDeleteVaccine?: (id: string) => void;
  className?: string;
}

// ============================================
// VACCINE SCHEDULE COMPONENT
// ============================================
export const VaccineSchedule: React.FC<VaccineScheduleProps> = ({
  vaccines = [
    {
      id: '1',
      name: 'COVID-19 (Pfizer)',
      disease: 'COVID-19',
      ageGroup: 'adult',
      doseNumber: 1,
      totalDoses: 2,
      status: 'completed',
      dateAdministered: '2024-01-15',
      nextDue: '2024-07-15',
      location: 'City General Hospital',
      provider: 'Dr. Sarah Johnson',
      sideEffects: ['Mild fatigue', 'Sore arm'],
    },
    {
      id: '2',
      name: 'Influenza',
      disease: 'Flu',
      ageGroup: 'adult',
      doseNumber: 1,
      totalDoses: 1,
      status: 'due',
      nextDue: '2024-10-01',
      location: 'Metro Medical Center',
      provider: 'Dr. Michael Chen',
      sideEffects: [],
    },
    {
      id: '3',
      name: 'Tetanus Booster',
      disease: 'Tetanus',
      ageGroup: 'adult',
      doseNumber: 1,
      totalDoses: 1,
      status: 'overdue',
      nextDue: '2027-03-10',
      location: 'Community Health Center',
      provider: 'Dr. Emily Davis',
      sideEffects: ['Pain at injection site'],
    },
    {
      id: '4',
      name: 'Hepatitis B',
      disease: 'Hepatitis B',
      ageGroup: 'adult',
      doseNumber: 3,
      totalDoses: 3,
      status: 'scheduled',
      nextDue: '2024-02-20',
      location: 'City General Hospital',
      provider: 'Dr. Sarah Johnson',
      sideEffects: [],
    },
  ],
  variant = 'glass',
  onAddVaccine,
  onUpdateVaccine,
  onDeleteVaccine,
  className,
}) => {
  const [showAddVaccine, setShowAddVaccine] = useState(false);
  const [newVaccine, setNewVaccine] = useState({
    name: '',
    disease: '',
    ageGroup: 'adult',
    doseNumber: 1,
    totalDoses: 1,
    dateAdministered: '',
    nextDue: '',
    location: '',
    provider: '',
    sideEffects: '',
  });
  const [expandedVaccine, setExpandedVaccine] = useState<string | null>(null);

  // Filter vaccines by status
  const statusCounts = {
    completed: vaccines.filter(v => v.status === 'completed').length,
    due: vaccines.filter(v => v.status === 'due').length,
    overdue: vaccines.filter(v => v.status === 'overdue').length,
    scheduled: vaccines.filter(v => v.status === 'scheduled').length,
  };

  // Handle add vaccine
  const handleAddVaccine = () => {
    if (newVaccine.name && newVaccine.disease && newVaccine.ageGroup) {
      const vaccine: Vaccine = {
        id: Date.now().toString(),
        name: newVaccine.name,
        disease: newVaccine.disease,
        ageGroup: newVaccine.ageGroup,
        doseNumber: Number(newVaccine.doseNumber),
        totalDoses: Number(newVaccine.totalDoses),
        status: newVaccine.dateAdministered ? 'completed' : 'scheduled',
        dateAdministered: newVaccine.dateAdministered,
        nextDue: newVaccine.nextDue,
        location: newVaccine.location,
        provider: newVaccine.provider,
        sideEffects: newVaccine.sideEffects ? newVaccine.sideEffects.split(',').map(s => s.trim()) : [],
      };
      onAddVaccine?.(vaccine);
      setVaccines(prev => [...prev, vaccine]);
      setShowAddVaccine(false);
      setNewVaccine({
        name: '',
        disease: '',
        ageGroup: 'adult',
        doseNumber: 1,
        totalDoses: 1,
        dateAdministered: '',
        nextDue: '',
        location: '',
        provider: '',
        sideEffects: '',
      });
    }
  };

  // Handle update vaccine
  const handleUpdateVaccine = (id: string, updates: Partial<Vaccine>) => {
    onUpdateVaccine?.(id, updates);
    setVaccines(prev => prev.map(vaccine => 
      vaccine.id === id ? { ...vaccine, ...updates } : vaccine
    ));
  };

  // Handle delete vaccine
  const handleDeleteVaccine = (id: string) => {
    onDeleteVaccine?.(id);
    setVaccines(prev => prev.filter(vaccine => vaccine.id !== id));
  };

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl"
              >
                <Syringe className="w-6 h-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-black text-white">
                  💉 Vaccination Tracker
                </h1>
                <p className="text-white/70">Keep track of your immunizations</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="info" size="sm">
                {vaccines.length} vaccinations
              </Badge>
              <Button
                variant="gradient"
                size="sm"
                leftIcon={Plus}
                onClick={() => setShowAddVaccine(!showAddVaccine)}
              >
                Add Vaccination
              </Button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-white/10 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">Completed</p>
                <Badge variant="success" size="sm">
                  {statusCounts.completed}
                </Badge>
              </div>
              <p className="text-lg font-black text-green-400">{((statusCounts.completed / vaccines.length) * 100).toFixed(0)}%</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-white/10 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">Due</p>
                <Badge variant="warning" size="sm">
                  {statusCounts.due}
                </Badge>
              </div>
              <p className="text-lg font-black text-yellow-400">
                {statusCounts.due}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-white/10 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">Overdue</p>
                <Badge variant="danger" size="sm">
                  {statusCounts.overdue}
                </Badge>
              </div>
              <p className="text-lg font-black text-red-400">
                {statusCounts.overdue}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-4 bg-white/10 rounded-xl"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-bold text-white">Scheduled</p>
                <Badge variant="info" size="sm">
                  {statusCounts.scheduled}
                </Badge>
              </div>
              <p className="text-lg font-black text-cyan-400">
                {statusCounts.scheduled}
              </p>
            </div>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Add Vaccination Form */}
      <AnimatePresence>
        {showAddVaccine && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-6"
          >
            <GlassmorphicCard variant={variant} className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Add New Vaccination
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddVaccine(false)}
                  className="float-right p-2 text-white/40 hover:text-white/70"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Vaccine name"
                  value={newVaccine.name}
                  onChange={(e) => setNewVaccine(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Disease"
                  value={newVaccine.disease}
                  onChange={(e) => setNewVaccine(prev => ({ ...prev, disease: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <select
                  value={newVaccine.ageGroup}
                  onChange={(e) => setNewVaccine(prev => ({ ...prev, ageGroup: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="infant">Infant (0-2 years)</option>
                  <option value="child">Child (2-12 years)</option>
                  <option value="adult">Adult (12+ years)</option>
                  <option value="senior">Senior (65+ years)</option>
                </select>
                <input
                  type="number"
                  placeholder="Dose number"
                  value={newVaccine.doseNumber}
                  onChange={(e) => setNewVaccine(prev => ({ ...prev, doseNumber: Number(e.target.value) }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="number"
                  placeholder="Total doses"
                  value={newVaccine.totalDoses}
                  onChange={(e) => setNewVaccine(prev => ({ ...prev, totalDoses: Number(e.target.value) }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="date"
                  placeholder="Date administered"
                  value={newVaccine.dateAdministered}
                  onChange={(e) => setNewVaccine(prev => ({ ...prev, dateAdministered: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newVaccine.location}
                  onChange={(e) => setNewVaccine(prev => ({ ...prev, location: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Healthcare provider"
                  value={newVaccine.provider}
                  onChange={(e) => setNewVaccine(prev => ({ ...prev, provider: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <textarea
                  placeholder="Side effects (comma-separated)"
                  value={newVaccine.sideEffects}
                  onChange={(e) => setNewVaccine(prev => ({ ...prev, sideEffects: e.target.value }))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  rows={3}
                />
              </div>

              <div className="flex gap-3 mt-4">
                <Button
                  variant="glassmorphic"
                  size="sm"
                  onClick={() => setShowAddVaccine(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  onClick={handleAddVaccination}
                  disabled={!newVaccine.name || !newVaccine.disease}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add Vaccination
                </Button>
              </div>
            </GlassmorphicCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vaccinations List */}
      <div className="space-y-4">
        {vaccines.length > 0 ? (
          <div className="space-y-4">
            {vaccines.map((vaccine, i) => {
              const isExpanded = expandedVaccine === vaccine.id;
              const Icon = vaccine.ageGroup === 'adult' ? Syringe : Baby;

              return (
                <motion.div
                  key={vaccine.id}
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                  className="p-4 bg-white/10 rounded-xl"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Icon className={clsx(
                            'w-6 h-6',
                            vaccine.status === 'completed' ? 'text-green-400' : 
                            vaccine.status === 'due' ? 'text-blue-400' : 
                            vaccine.status === 'overdue' ? 'text-red-400' : 'text-yellow-400'
                          )} />
                          <div>
                            <p className="text-sm font-bold text-white">{vaccine.name}</p>
                            <p className="text-xs text-white/70">{vaccine.disease}</p>
                          </div>
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-xl hover:bg-white/20 transition-all cursor-pointer"
                          onClick={() => {
                            if (isExpanded) {
                              setExpandedVaccine(null);
                            } else {
                              setExpandedVaccine(vaccine.id);
                            }
                          }}
                        >
                          <ChevronDown className={clsx(
                            'w-4 h-4',
                            isExpanded ? 'rotate-180' : ''
                          )} />
                        </motion.div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={vaccine.status === 'completed' ? 'success' : 
                                 vaccine.status === 'due' ? 'info' : 
                                 vaccine.status === 'overdue' ? 'danger' : 'warning'} 
                        size="sm"
                      >
                        {vaccine.status}
                      </Badge>
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={clsx(
                      'p-4 bg-white/10 rounded-xl mt-3',
                      isExpanded && 'border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                    )}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-bold text-white mb-2">Age Group</h4>
                        <p className="text-sm text-white/70 capitalize">
                          {vaccine.ageGroup}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-2">Dose Information</h4>
                        <p className="text-sm text-white/70">
                          Dose {vaccine.doseNumber} of {vaccine.totalDoses}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-2">Date Administered</h4>
                        <p className="text-sm text-white/70">
                          {vaccine.dateAdministered ? new Date(vaccine.dateAdministered).toLocaleDateString() : 'Not yet administered'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white mb-2">Next Due</h4>
                        <p className="text-sm text-white/70">
                          {vaccine.nextDue ? new Date(vaccine.nextDue).toLocaleDateString() : 'TBD'}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-bold text-white mb-2">Location</h4>
                      <p className="text-sm text-white/70">{vaccine.location}</p>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-bold text-white mb-2">Healthcare Provider</h4>
                      <p className="text-sm text-white/70">{vaccine.provider}</p>
                    </div>

                    <div className="mt-4">
                      <h4 className="text-sm font-bold text-white mb-2">Side Effects</h4>
                      {vaccine.sideEffects && vaccine.sideEffects.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {vaccine.sideEffects.map((effect, i) => (
                            <Badge key={i} variant="outline" size="xs">
                              {effect}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-white/70">No side effects reported</p>
                      )}
                    </div>

                    <div className="mt-6 flex items-center justify-between pt-4 border-t border-white/20">
                      <Button
                        variant="glassmorphic"
                        size="sm"
                        leftIcon={Edit2}
                        onClick={() => {
                          // Edit vaccination
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this vaccination?')) {
                            onDeleteVaccine?.(vaccine.id);
                          }
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <Syringe className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No vaccinations found</h3>
            <p className="text-white/70 mb-4">
              Start tracking your immunizations to stay up-to-date with your health.
            </p>
            <Button
              variant="gradient"
              size="sm"
              onClick={() => setShowAddVaccine(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add First Vaccination
            </Button>
          </div>
        )}
      </div>

      {/* Quick Tips */}
      <GlassmorphicCard variant={variant} className="p-6">
        <h3 className="text-lg font-bold text-white mb-4">Vaccination Tips</h3>
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
              <CheckCircle className="w-6 h-6 text-green-400" />
              <Badge variant="success" size="sm">
                Important
              </Badge>
            </div>
            <p className="text-sm text-white/70 mb-2">
              Keep track of vaccination schedules
            </p>
            <p className="text-xs text-white/60">
              Staying up-to-date with immunizations is crucial for your health
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
              <AlertCircle className="w-6 h-6 text-orange-400" />
              <Badge variant="warning" size="sm">
                Warning
              </Badge>
            </div>
            <p className="text-sm text-white/70 mb-2">
              Don't miss booster shots
            </p>
            <p className="text-xs text-white/60">
              Some vaccines require booster shots to maintain immunity
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
              <FileText className="w-6 h-6 text-cyan-400" />
              <Badge variant="info" size="sm">
                Records
              </Badge>
            </div>
            <p className="text-sm text-white/70 mb-2">
              Keep vaccination records updated
            </p>
            <p className="text-xs text-white/60">
              Having accurate records is important for travel and medical care
            </p>
          </motion.div>
        </div>
      </GlassmorphicCard>
    </motion.div>
  );
};