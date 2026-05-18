// src/components/women/VaccineSchedule.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Syringe, CheckCircle, AlertTriangle, Plus, Clock, Users,
  Heart, Shield, TrendingUp, FileText, Edit2, Trash2,
  ChevronDown, X, Baby
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// ============================================
// TYPES
// ============================================
export interface Vaccine {
  id: string;
  name: string;
  disease: string;
  ageGroup: string;
  doseNumber: number;
  totalDoses: number;
  status: 'scheduled' | 'completed' | 'overdue' | 'due' | 'upcoming' | 'missed';
  dateAdministered?: string;
  nextDue?: string;
  location?: string;
  provider?: string;
  sideEffects?: string[];
  notes?: string;
  isPregnancySafe?: boolean;
}

export interface VaccineScheduleProps {
  vaccines?: Vaccine[];
  onAddVaccine?: (vaccine: Omit<Vaccine, 'id'>) => void;
  onUpdateVaccine?: (id: string, updates: Partial<Vaccine>) => void;
  onDeleteVaccine?: (id: string) => void;
  className?: string;
}

// ============================================
// DEFAULT DATA
// ============================================
const defaultVaccines: Vaccine[] = [
  { id: '1', name: 'COVID-19 (Pfizer)', disease: 'COVID-19', ageGroup: 'adult', doseNumber: 1, totalDoses: 2, status: 'completed', dateAdministered: '2024-01-15', nextDue: '2024-07-15', location: 'City General Hospital', provider: 'Dr. Sarah Johnson', sideEffects: ['Mild fatigue', 'Sore arm'], isPregnancySafe: true },
  { id: '2', name: 'Influenza', disease: 'Flu', ageGroup: 'adult', doseNumber: 1, totalDoses: 1, status: 'due', nextDue: '2024-10-01', location: 'Metro Medical Center', provider: 'Dr. Michael Chen', isPregnancySafe: true },
  { id: '3', name: 'Tetanus Booster', disease: 'Tetanus', ageGroup: 'adult', doseNumber: 1, totalDoses: 1, status: 'overdue', nextDue: '2024-03-10', location: 'Community Health Center', provider: 'Dr. Emily Davis', sideEffects: ['Pain at injection site'], isPregnancySafe: true },
  { id: '4', name: 'Hepatitis B', disease: 'Hepatitis B', ageGroup: 'adult', doseNumber: 3, totalDoses: 3, status: 'scheduled', nextDue: '2024-04-20', location: 'City General Hospital', provider: 'Dr. Sarah Johnson', isPregnancySafe: true },
];

// ============================================
// MAIN COMPONENT
// ============================================
export const VaccineSchedule: React.FC<VaccineScheduleProps> = ({
  vaccines: initialVaccines,
  onAddVaccine,
  onUpdateVaccine,
  onDeleteVaccine,
  className = '',
}) => {
  const [vaccines, setVaccines] = useState<Vaccine[]>(initialVaccines || defaultVaccines);
  const [showAddForm, setShowAddForm] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [newVaccine, setNewVaccine] = useState({
    name: '', disease: '', ageGroup: 'adult', doseNumber: 1, totalDoses: 1,
    location: '', provider: '', nextDue: '', sideEffects: '',
  });

  const statusCounts = {
    completed: vaccines.filter(v => v.status === 'completed').length,
    due: vaccines.filter(v => v.status === 'due' || v.status === 'upcoming').length,
    overdue: vaccines.filter(v => v.status === 'overdue').length,
    scheduled: vaccines.filter(v => v.status === 'scheduled').length,
  };

  const completionRate = vaccines.length > 0
    ? Math.round((statusCounts.completed / vaccines.length) * 100)
    : 0;

  const handleAddVaccine = () => {
    if (!newVaccine.name || !newVaccine.disease) return;
    const vaccine: Vaccine = {
      id: Date.now().toString(),
      name: newVaccine.name,
      disease: newVaccine.disease,
      ageGroup: newVaccine.ageGroup,
      doseNumber: Number(newVaccine.doseNumber),
      totalDoses: Number(newVaccine.totalDoses),
      status: 'scheduled',
      location: newVaccine.location,
      provider: newVaccine.provider,
      nextDue: newVaccine.nextDue,
      sideEffects: newVaccine.sideEffects ? newVaccine.sideEffects.split(',').map(s => s.trim()) : [],
    };
    setVaccines(prev => [...prev, vaccine]);
    onAddVaccine?.(vaccine);
    setShowAddForm(false);
    setNewVaccine({ name: '', disease: '', ageGroup: 'adult', doseNumber: 1, totalDoses: 1, location: '', provider: '', nextDue: '', sideEffects: '' });
  };

  const handleDelete = (id: string) => {
    setVaccines(prev => prev.filter(v => v.id !== id));
    onDeleteVaccine?.(id);
  };

  const getStatusStyle = (status: string): string => {
    const styles: Record<string, string> = {
      completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      due: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      overdue: 'bg-red-500/10 text-red-400 border-red-500/20',
      scheduled: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      upcoming: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      missed: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
    return styles[status] || '';
  };

  const stats = [
    { label: 'Completed', value: statusCounts.completed, color: 'text-emerald-400', bg: 'bg-emerald-500/10', icon: CheckCircle },
    { label: 'Due', value: statusCounts.due, color: 'text-blue-400', bg: 'bg-blue-500/10', icon: Clock },
    { label: 'Overdue', value: statusCounts.overdue, color: 'text-red-400', bg: 'bg-red-500/10', icon: AlertTriangle },
    { label: 'Scheduled', value: statusCounts.scheduled, color: 'text-cyan-400', bg: 'bg-cyan-500/10', icon: Calendar },
  ];

  return (
    <div className={`space-y-6 ${className}`}>

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg">
            <Syringe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-[-0.02em]">Vaccination Tracker</h2>
            <p className="text-white/35 text-sm mt-1">{vaccines.length} vaccinations • {completionRate}% complete</p>
          </div>
        </div>
        <Button variant="gradient" size="sm" onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
          <Plus className="w-4 h-4" /> Add Vaccination
        </Button>
      </motion.div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }} className={`${stat.bg} rounded-xl border border-white/[0.06] p-4 text-center`}>
              <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-white/35 text-[11px] font-medium">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* ADD FORM */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <GlassmorphicCard variant="elevated" padding="lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold text-sm">Add New Vaccination</h3>
                <button type="button" onClick={() => setShowAddForm(false)} className="p-1.5 hover:bg-white/[0.06] rounded-lg">
                  <X className="w-4 h-4 text-white/40" />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input type="text" placeholder="Vaccine name" value={newVaccine.name} onChange={(e) => setNewVaccine(prev => ({ ...prev, name: e.target.value }))}
                  className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/15" />
                <input type="text" placeholder="Disease" value={newVaccine.disease} onChange={(e) => setNewVaccine(prev => ({ ...prev, disease: e.target.value }))}
                  className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/15" />
                <input type="text" placeholder="Location" value={newVaccine.location} onChange={(e) => setNewVaccine(prev => ({ ...prev, location: e.target.value }))}
                  className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/15" />
                <input type="text" placeholder="Provider" value={newVaccine.provider} onChange={(e) => setNewVaccine(prev => ({ ...prev, provider: e.target.value }))}
                  className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/15" />
                <input type="date" placeholder="Next due" value={newVaccine.nextDue} onChange={(e) => setNewVaccine(prev => ({ ...prev, nextDue: e.target.value }))}
                  className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/15" />
                <input type="text" placeholder="Side effects (comma-separated)" value={newVaccine.sideEffects} onChange={(e) => setNewVaccine(prev => ({ ...prev, sideEffects: e.target.value }))}
                  className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/15" />
              </div>
              <div className="flex gap-3 mt-4">
                <Button variant="glass" size="sm" onClick={() => setShowAddForm(false)} className="flex-1 justify-center">Cancel</Button>
                <Button variant="gradient" size="sm" onClick={handleAddVaccine} disabled={!newVaccine.name} className="flex-1 justify-center">Add Vaccine</Button>
              </div>
            </GlassmorphicCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VACCINE LIST */}
      <div className="space-y-3">
        {vaccines.map((vaccine) => {
          const isExpanded = expandedId === vaccine.id;
          return (
            <motion.div key={vaccine.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              <GlassmorphicCard variant="elevated" padding="lg">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className={`p-2 rounded-xl ${getStatusStyle(vaccine.status)}`}>
                      <Syringe className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold text-sm">{vaccine.name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusStyle(vaccine.status)}`}>{vaccine.status}</span>
                        {vaccine.isPregnancySafe && <Badge variant="success" size="xs">Safe</Badge>}
                      </div>
                      <p className="text-white/35 text-xs">{vaccine.disease} • Dose {vaccine.doseNumber}/{vaccine.totalDoses}</p>
                      <p className="text-white/25 text-[10px] mt-0.5">{vaccine.location} • {vaccine.provider}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button type="button" onClick={() => handleDelete(vaccine.id)} className="p-2 hover:bg-white/[0.06] rounded-lg">
                      <Trash2 className="w-4 h-4 text-red-400/50 hover:text-red-400" />
                    </button>
                    <button type="button" onClick={() => setExpandedId(isExpanded ? null : vaccine.id)} className="p-2 hover:bg-white/[0.06] rounded-lg">
                      <ChevronDown className={`w-4 h-4 text-white/30 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="mt-4 pt-4 border-t border-white/[0.04] grid grid-cols-2 gap-3">
                        <div className="p-2.5 bg-white/[0.02] rounded-lg">
                          <p className="text-white/30 text-[10px] uppercase tracking-wider">Next Due</p>
                          <p className="text-white/60 text-xs mt-0.5">{vaccine.nextDue ? new Date(vaccine.nextDue).toLocaleDateString() : 'N/A'}</p>
                        </div>
                        <div className="p-2.5 bg-white/[0.02] rounded-lg">
                          <p className="text-white/30 text-[10px] uppercase tracking-wider">Administered</p>
                          <p className="text-white/60 text-xs mt-0.5">{vaccine.dateAdministered ? new Date(vaccine.dateAdministered).toLocaleDateString() : 'Not yet'}</p>
                        </div>
                        {vaccine.sideEffects && vaccine.sideEffects.length > 0 && (
                          <div className="col-span-2 p-2.5 bg-white/[0.02] rounded-lg">
                            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1.5">Side Effects</p>
                            <div className="flex flex-wrap gap-1.5">
                              {vaccine.sideEffects.map((effect, i) => (
                                <span key={i} className="px-2 py-0.5 rounded-full bg-white/[0.03] text-white/40 text-[10px] border border-white/[0.04]">{effect}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassmorphicCard>
            </motion.div>
          );
        })}

        {vaccines.length === 0 && (
          <div className="text-center py-16">
            <Syringe className="w-12 h-12 text-white/10 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No vaccinations recorded</h3>
            <p className="text-white/35 text-sm mb-6">Start tracking your immunizations.</p>
            <Button variant="gradient" size="sm" onClick={() => setShowAddForm(true)} className="gap-2">
              <Plus className="w-4 h-4" /> Add First Vaccination
            </Button>
          </div>
        )}
      </div>

      {/* TIPS */}
      <GlassmorphicCard variant="subtle" padding="lg">
        <h3 className="text-white font-semibold text-sm mb-4">💡 Vaccination Tips</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: CheckCircle, title: 'Stay on Schedule', desc: 'Keep track of vaccination dates', color: 'text-emerald-400' },
            { icon: AlertTriangle, title: 'Don\'t Skip Boosters', desc: 'Some vaccines need booster doses', color: 'text-amber-400' },
            { icon: FileText, title: 'Keep Records', desc: 'Accurate records help medical care', color: 'text-cyan-400' },
          ].map((tip, i) => {
            const Icon = tip.icon;
            return (
              <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                <Icon className={`w-5 h-5 mx-auto mb-2 ${tip.color}`} />
                <p className="text-white text-xs font-medium">{tip.title}</p>
                <p className="text-white/30 text-[10px] mt-1">{tip.desc}</p>
              </div>
            );
          })}
        </div>
      </GlassmorphicCard>
    </div>
  );
};

// Missing imports
import { Calendar } from 'lucide-react';

export default VaccineSchedule;