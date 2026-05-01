import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Syringe,
  Plus,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
  Shield,
  Heart,
  Baby,
  User,
  TrendingUp,
  FileText,
  Download,
  Share2,
  Printer,
  Bell,
  Activity
} from 'lucide-react';
import { clsx } from 'clsx';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface Vaccination {
  id: string;
  name: string;
  disease: string;
  dateAdministered?: string;
  nextDue?: string;
  status: 'completed' | 'due' | 'overdue' | 'scheduled';
  ageGroup: 'infant' | 'child' | 'adult' | 'senior';
  doseNumber: number;
  totalDoses: number;
  provider: string;
  location: string;
  lotNumber?: string;
  sideEffects?: string[];
  certificateUrl?: string;
}

export interface VaccinationTrackerProps {
  vaccinations?: Vaccination[];
  variant?: 'glass' | 'gradient' | 'neon';
  onAddVaccination?: (vaccination: Omit<Vaccination, 'id'>) => void;
  onUpdateVaccination?: (id: string, updates: Partial<Vaccination>) => void;
  onDeleteVaccination?: (id: string) => void;
  onScheduleReminder?: (vaccination: Vaccination) => void;
  className?: string;
}

// ============================================
// VACCINATION TRACKER COMPONENT
// ============================================
export const VaccinationTracker: React.FC<VaccinationTrackerProps> = ({
  vaccinations: initialVaccinations = [
    {
      id: '1',
      name: 'COVID-19 (Pfizer)',
      disease: 'COVID-19',
      dateAdministered: '2024-01-15',
      nextDue: '2024-07-15',
      status: 'completed',
      ageGroup: 'adult',
      doseNumber: 2,
      totalDoses: 2,
      provider: 'City General Hospital',
      location: 'New York',
      lotNumber: 'ABC123',
      sideEffects: ['Mild fatigue', 'Sore arm'],
    },
    {
      id: '2',
      name: 'Influenza',
      disease: 'Flu',
      dateAdministered: '2023-10-01',
      nextDue: '2024-10-01',
      status: 'due',
      ageGroup: 'adult',
      doseNumber: 1,
      totalDoses: 1,
      provider: 'Metro Medical Center',
      location: 'New York',
    },
    {
      id: '3',
      name: 'Tetanus Booster',
      disease: 'Tetanus',
      dateAdministered: '2022-03-10',
      nextDue: '2027-03-10',
      status: 'overdue',
      ageGroup: 'adult',
      doseNumber: 1,
      totalDoses: 1,
      provider: 'Community Health Center',
      location: 'New York',
    },
  ],
  variant = 'glass',
  onAddVaccination,
  onUpdateVaccination,
  onDeleteVaccination,
  onScheduleReminder,
  className,
}) => {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(initialVaccinations);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newVaccination, setNewVaccination] = useState<Partial<Vaccination>>({
    name: '',
    disease: '',
    dateAdministered: '',
    ageGroup: 'adult',
    doseNumber: 1,
    totalDoses: 1,
    provider: '',
    location: '',
  });
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'due' | 'overdue'>('all');
  const [filterAgeGroup, setFilterAgeGroup] = useState<'all' | 'infant' | 'child' | 'adult' | 'senior'>('all');

  const statusColors = {
    completed: 'bg-green-500/10 text-green-300 border-green-500/30',
    due: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    overdue: 'bg-red-500/10 text-red-300 border-red-500/30',
    scheduled: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
  };

  const ageGroupIcons = {
    infant: Baby,
    child: User,
    adult: User,
    senior: User,
  };

  const ageGroupColors = {
    infant: 'text-pink-400',
    child: 'text-blue-400',
    adult: 'text-green-400',
    senior: 'text-gray-400',
  };

  const filteredVaccinations = vaccinations.filter(vacc => {
    if (filterStatus !== 'all' && v vacc.status !== filterStatus) return false;
    if (filterAgeGroup !== 'all' && vacc.ageGroup !== filterAgeGroup) return false;
    return true;
  });

  const vaccinationStats = {
    total: vaccinations.length,
    completed: vaccinations.filter(v => v.status === 'completed').length,
    due: vaccinations.filter(v => v.status === 'due').length,
    overdue: vaccinations.filter(v => v.status === 'overdue').length,
    coverage: Math.round((vaccinations.filter(v => v.status === 'completed').length / vaccinations.length) * 100),
  };

  const handleAddVaccination = () => {
    if (newVaccination.name && newVaccination.disease) {
      const vaccination: Vaccination = {
        id: Date.now().toString(),
        name: newVaccination.name,
        disease: newVaccination.disease,
        dateAdministered: newVaccination.dateAdministered,
        status: newVaccination.dateAdministered ? 'completed' : 'scheduled',
        ageGroup: newVaccination.ageGroup || 'adult',
        doseNumber: newVaccination.doseNumber || 1,
        totalDoses: newVaccination.totalDoses || 1,
        provider: newVaccination.provider || '',
        location: newVaccination.location || '',
        sideEffects: [],
      };
      onAddVaccination?.(vaccination);
      setVaccinations(prev => [...prev, vaccination]);
      setShowAddForm(false);
      setNewVaccination({});
    }
  };

  const generateCertificate = (vaccination: Vaccination) => {
    // Simulate certificate generation
    const certificateData = {
      ...vaccination,
      certificateUrl: `https://certificates.hospitalhub.com/${vaccination.id}`,
      generatedAt: new Date().toISOString(),
    };
    onUpdateVaccination?.(vaccination.id, certificateData);
    setVaccinations(prev => prev.map(v => v.id === vaccination.id ? { ...v, ...certificateData } : v));
  };

  return (
    <div className={twMerge('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white mb-2">Vaccination Tracker</h2>
          <p className="text-white/60">Keep track of your immunization records</p>
        </div>
        <Button
          variant="gradient"
          size="sm"
          leftIcon={Plus}
          onClick={() => setShowAddForm(!showAddForm)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Vaccination
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <GlassmorphicCard variant={variant}>
          <div className="text-center">
            <Syringe className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
            <p className="text-2xl font-black text-white">{vaccinationStats.total}</p>
            <p className="text-xs text-white/60">Total</p>
          </div>
        </GlassmorphicCard>
        <GlassmorphicCard variant={variant}>
          <div className="text-center">
            <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-black text-white">{vaccinationStats.completed}</p>
            <p className="text-xs text-white/60">Completed</p>
          </div>
        </GlassmorphicCard>
        <GlassmorphicCard variant={variant}>
          <div className="text-center">
            <Clock className="w-8 h-8 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-black text-white">{vaccinationStats.due}</p>
            <p className="text-xs text-white/60">Due</p>
          </div>
        </GlassmorphicCard>
        <GlassmorphicCard variant={variant}>
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-black text-white">{vaccinationStats.overdue}</p>
            <p className="text-xs text-white/60">Overdue</p>
          </div>
        </GlassmorphicCard>
        <GlassmorphicCard variant={variant}>
          <div className="text-center">
            <Shield className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <motion.p 
              className="text-2xl font-black text-white"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {vaccinationStats.coverage}%
            </motion.p>
            <p className="text-xs text-white/60">Coverage</p>
          </div>
        </GlassmorphicCard>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="due">Due</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-white/60">Age Group:</span>
          <select
            value={filterAgeGroup}
            onChange={(e) => setFilterAgeGroup(e.target.value as any)}
            className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
          >
            <option value="all">All Ages</option>
            <option value="infant">Infant</option>
            <option value="child">Child</option>
            <option value="adult">Adult</option>
            <option value="senior">Senior</option>
          </select>
        </div>
      </div>

      {/* Add Vaccination Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GlassmorphicCard variant={variant} className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Add Vaccination Record</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Vaccine Name"
                  value={newVaccination.name || ''}
                  onChange={(e) => setNewVaccination(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Disease"
                  value={newVaccination.disease || ''}
                  onChange={(e) => setNewVaccination(prev => ({ ...prev, disease: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="date"
                  placeholder="Date Administered"
                  value={newVaccination.dateAdministered || ''}
                  onChange={(e) => setNewVaccination(prev => ({ ...prev, dateAdministered: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <select
                  value={newVaccination.ageGroup || 'adult'}
                  onChange={(e) => setNewVaccination(prev => ({ ...prev, ageGroup: e.target.value as any }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="infant">Infant (0-2 years)</option>
                  <option value="child">Child (2-12 years)</option>
                  <option value="adult">Adult (12-65 years)</option>
                  <option value="senior">Senior (65+ years)</option>
                </select>
                <input
                  type="text"
                  placeholder="Healthcare Provider"
                  value={newVaccination.provider || ''}
                  onChange={(e) => setNewVaccination(prev => ({ ...prev, provider: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newVaccination.location || ''}
                  onChange={(e) => setNewVaccination(prev => ({ ...prev, location: e.target.value }))}
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
                  onClick={handleAddVaccination}
                  disabled={!newVaccination.name || !newVaccination.disease}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
        <AnimatePresence>
          {filteredVaccinations.map((vaccination, index) => {
            const Icon = ageGroupIcons[vaccination.ageGroup];
            
            return (
              <motion.div
                key={vaccination.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
              >
                <GlassmorphicCard variant={variant} className="p-0 overflow-hidden">
                  <motion.div
                    className="p-6 cursor-pointer"
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
                    onClick={() => setExpandedId(expandedId === vaccination.id ? null : vaccination.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={clsx(
                            'p-3 rounded-xl bg-white/10',
                            vaccination.status === 'completed' && 'bg-green-500/10',
                            vaccination.status === 'due' && 'bg-blue-500/10',
                            vaccination.status === 'overdue' && 'bg-red-500/10'
                          )}
                        >
                          <Icon className={clsx('w-6 h-6', ageGroupColors[vaccination.ageGroup])} />
                        </motion.div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <h4 className="text-lg font-bold text-white">{vaccination.name}</h4>
                              <p className="text-sm text-white/70">{vaccination.disease}</p>
                            </div>
                            <Badge className={statusColors[vaccination.status]} size="sm">
                              {vaccination.status}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-white/60 mb-3">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {vaccination.dateAdministered || 'Not administered'}
                            </div>
                            <div className="flex items-center gap-1">
                              <Syringe className="w-4 h-4" />
                              Dose {vaccination.doseNumber} of {vaccination.totalDoses}
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {vaccination.ageGroup}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Badge variant="outline" size="xs">
                              {vaccination.provider}
                            </Badge>
                            <span className="text-xs text-white/60">{vaccination.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Certificate Download */}
                        {vaccination.certificateUrl && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              window.open(vaccination.certificateUrl, '_blank');
                            }}
                            className="p-2 text-green-400 hover:text-green-300"
                          >
                            <Download className="w-5 h-5" />
                          </motion.button>
                        )}

                        {/* Expand Toggle */}
                        <motion.div
                          animate={{ rotate: expandedId === vaccination.id ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ChevronDown className="w-5 h-5 text-white/60" />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {expandedId === vaccination.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="border-t border-white/10"
                      >
                        <div className="p-6 space-y-4">
                          {/* Administration Details */}
                          <div>
                            <h5 className="text-sm font-bold text-white mb-3">Administration Details</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-white/60">Healthcare Provider:</span>
                                  <span className="text-white">{vaccination.provider}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white/60">Location:</span>
                                  <span className="text-white">{vaccination.location}</span>
                                </div>
                                {vaccination.lotNumber && (
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Lot Number:</span>
                                    <span className="text-white font-mono">{vaccination.lotNumber}</span>
                                  </div>
                                )}
                              </div>
                              <div className="space-y-2">
                                <div className="flex justify-between">
                                  <span className="text-white/60">Dose Number:</span>
                                  <Badge variant="gradient" size="xs">
                                    {vaccination.doseNumber} of {vaccination.totalDoses}
                                  </Badge>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-white/60">Age Group:</span>
                                  <Badge className={ageGroupColors[vaccination.ageGroup]} size="xs">
                                    {vaccination.ageGroup}
                                  </Badge>
                                </div>
                                {vaccination.nextDue && (
                                  <div className="flex justify-between">
                                    <span className="text-white/60">Next Dose Due:</span>
                                    <Badge variant="warning" size="xs">
                                      {vaccination.nextDue}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Side Effects */}
                          {vaccination.sideEffects && vaccination.sideEffects.length > 0 && (
                            <div>
                              <h5 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-yellow-400" />
                                Side Effects Reported
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {vaccination.sideEffects.map((effect, i) => (
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
                              {!vaccination.certificateUrl && vaccination.status === 'completed' && (
                                <Button
                                  variant="success"
                                  size="sm"
                                  leftIcon={FileText}
                                  onClick={() => generateCertificate(vaccination)}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                >
                                  Generate Certificate
                                </Button>
                              )}
                              <Button
                                variant="glassmorphic"
                                size="sm"
                                leftIcon={Bell}
                                onClick={() => onScheduleReminder?.(vaccination)}
                              >
                                Set Reminder
                              </Button>
                            </div>
                            <Button
                              variant="danger"
                              size="sm"
                              iconOnly
                              onClick={() => onDeleteVaccination?.(vaccination.id)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </GlassmorphicCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Upcoming Vaccinations */}
      <GlassmorphicCard variant={variant}>
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-cyan-400" />
          Upcoming Vaccinations
        </h3>
        <div className="space-y-3">
          {vaccinations.filter(v => v.status === 'due' || v.status === 'overdue').map((vaccination, i) => (
            <motion.div
              key={vaccination.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className={clsx(
                'flex items-center justify-between p-4 rounded-xl',
                'bg-white/5 hover:bg-white/10 transition-all',
                'border border-white/10 hover:border-white/20',
                vaccination.status === 'overdue' && 'border-l-4 border-l-red-500'
              )}
            >
              <div className="flex items-center gap-3">
                <AlertCircle className={clsx(
                  'w-5 h-5',
                  vaccination.status === 'overdue' ? 'text-red-400' : 'text-yellow-400'
                )} />
                <div>
                  <p className="text-white font-medium">{vaccination.name}</p>
                  <p className="text-sm text-white/60">
                    Due: {vaccination.nextDue || 'Schedule ASAP'}
                  </p>
                </div>
              </div>
              <Button
                variant="gradient"
                size="xs"
                onClick={() => {
                  // Navigate to booking
                }}
              >
                Schedule Now
              </Button>
            </motion.div>
          ))}
          {vaccinations.filter(v => v.status === 'due' || v.status === 'overdue').length === 0 && (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-white/60">All vaccinations up to date!</p>
            </div>
          )}
        </div>
      </GlassmorphicCard>

      {/* Immunization Schedule Preview */}
      <GlassmorphicCard variant={variant}>
        <h3 className="text-lg font-bold text-white mb-4">Recommended Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
              <Baby className="w-5 h-5 text-pink-400" />
              Infant (0-2 years)
            </h4>
            <ul className="space-y-1 text-sm text-white/70">
              <li>• Hepatitis B</li>
              <li>• DTaP (Diphtheria, Tetanus, Pertussis)</li>
              <li>• Polio (IPV)</li>
              <li>• Hib (Haemophilus influenzae type b)</li>
            </ul>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              Adult (18+ years)
            </h4>
            <ul className="space-y-1 text-sm text-white/70">
              <li>• Influenza (Yearly)</li>
              <li>• Tdap Booster</li>
              <li>• COVID-19</li>
              <li>• Shingles (50+ years)</li>
            </ul>
          </div>
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <h4 className="text-white font-bold mb-2 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-400" />
              Senior (65+ years)
            </h4>
            <ul className="space-y-1 text-sm text-white/70">
              <li>• Influenza (High-dose)</li>
              <li>• Pneumococcal</li>
              <li>• Shingles</li>
              <li>• COVID-19 Booster</li>
            </ul>
          </div>
        </div>
      </GlassmorphicCard>
    </div>
  );
};