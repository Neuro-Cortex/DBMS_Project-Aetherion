// src/components/women/PregnancyTracker.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Baby, Calendar, Shield, AlertTriangle, CheckCircle,
  Activity, TrendingUp, FileText, Plus, Edit2
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// ============================================
// TYPES
// ============================================
interface Appointment {
  id?: string;
  date: string;
  time: string;
  type: string;
  location: string;
  notes: string;
}

export interface PregnancyTrackerProps {
  dueDate?: string;
  className?: string;
}

// ============================================
// HELPERS
// ============================================
const getBabySize = (week: number): string => {
  const sizes: Record<number, string> = {
    1: 'poppy seed', 4: 'sesame seed', 8: 'raspberry', 12: 'lime',
    16: 'avocado', 20: 'banana', 24: 'eggplant', 28: 'coconut',
    32: 'butternut squash', 36: 'honeydew melon', 40: 'watermelon',
  };
  const keys = Object.keys(sizes).map(Number).sort((a, b) => a - b);
  for (const key of keys) { if (week <= key) return sizes[key]; }
  return 'watermelon';
};

const getTrimester = (week: number) => {
  if (week <= 13) return 'First Trimester';
  if (week <= 26) return 'Second Trimester';
  return 'Third Trimester';
};

// ============================================
// MAIN COMPONENT
// ============================================
export const PregnancyTracker: React.FC<PregnancyTrackerProps> = ({
  dueDate = '2024-10-15',
  className = '',
}) => {
  const today = new Date();
  const due = new Date(dueDate);
  const totalDays = 280;
  const daysPassed = Math.floor((today.getTime() - new Date(due.getTime() - totalDays * 86400000).getTime()) / 86400000);
  const currentWeek = Math.min(40, Math.max(1, Math.floor(daysPassed / 7)));
  const currentDay = daysPassed % 7;
  const progress = Math.round((daysPassed / totalDays) * 100);
  const daysRemaining = Math.max(0, totalDays - daysPassed);

  const [symptoms, setSymptoms] = useState<string[]>([
    'Morning sickness', 'Fatigue', 'Breast tenderness'
  ]);
  const [appointments, setAppointments] = useState<Appointment[]>([
    { id: '1', date: '2024-01-15', time: '10:00 AM', type: 'First Checkup', location: 'City General Hospital', notes: 'Initial ultrasound' },
    { id: '2', date: '2024-02-12', time: '2:00 PM', type: 'Anatomy Scan', location: 'City General Hospital', notes: '20-week scan' },
  ]);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [newAppointment, setNewAppointment] = useState<Appointment>({
    date: '', time: '', type: '', location: '', notes: ''
  });

  const allSymptoms = ['Morning sickness', 'Fatigue', 'Breast tenderness', 'Heartburn', 'Back pain', 'Swelling', 'Headaches', 'Constipation'];

  const toggleSymptom = (s: string) => {
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleAddAppointment = () => {
    if (!newAppointment.date || !newAppointment.type) return;
    setAppointments(prev => [...prev, { ...newAppointment, id: Date.now().toString() }]);
    setNewAppointment({ date: '', time: '', type: '', location: '', notes: '' });
    setShowAddAppointment(false);
  };

  const stats = [
    { label: 'Current Week', value: `Week ${currentWeek}`, icon: Baby, color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { label: 'Days Remaining', value: daysRemaining, icon: Calendar, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { label: 'Progress', value: `${progress}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Due Date', value: dueDate, icon: Heart, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  return (
    <div className={`space-y-6 ${className}`}>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }} className={`${stat.bg} rounded-xl border border-white/[0.06] p-4 text-center`}>
              <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-white/30 text-[10px]">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* PROGRESS + TRIMESTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Progress */}
        <GlassmorphicCard variant="elevated" padding="lg">
          <h3 className="text-white font-semibold text-sm mb-4">Pregnancy Progress</h3>
          <div className="h-3 bg-white/[0.04] rounded-full overflow-hidden mb-2">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full" />
          </div>
          <div className="flex justify-between text-[10px] text-white/25">
            <span>Week 1</span><span>{progress}%</span><span>Week 40</span>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-6 text-center">
            {[
              { trimester: '1st', weeks: '1-13', status: currentWeek <= 13 ? 'current' : 'completed' as const },
              { trimester: '2nd', weeks: '14-26', status: currentWeek > 13 && currentWeek <= 26 ? 'current' : currentWeek < 14 ? 'upcoming' as const : 'completed' as const },
              { trimester: '3rd', weeks: '27-40', status: currentWeek > 26 ? 'current' : 'upcoming' as const },
            ].map((t) => (
              <div key={t.trimester} className={`p-3 rounded-xl ${t.status === 'current' ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/[0.02]'}`}>
                <p className="text-white font-bold text-sm">{t.trimester} Trimester</p>
                <p className="text-white/30 text-[10px]">{t.weeks}</p>
                {t.status === 'current' && <Badge variant="info" size="xs" className="mt-1">Current</Badge>}
                {t.status === 'completed' && <Badge variant="success" size="xs" className="mt-1">Done</Badge>}
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-xl bg-white/[0.02] text-center">
            <p className="text-white/40 text-[10px] uppercase tracking-wider">Baby Size</p>
            <p className="text-white font-bold text-lg">📏 {getBabySize(currentWeek)}</p>
            <p className="text-white/30 text-[10px]">at {currentWeek} weeks</p>
          </div>
        </GlassmorphicCard>

        {/* Symptoms */}
        <GlassmorphicCard variant="elevated" padding="lg">
          <h3 className="text-white font-semibold text-sm mb-4">Symptoms</h3>
          <div className="grid grid-cols-2 gap-2">
            {allSymptoms.map((symptom) => {
              const active = symptoms.includes(symptom);
              return (
                <button key={symptom} type="button" onClick={() => toggleSymptom(symptom)}
                  className={`p-3 rounded-xl text-xs font-medium transition-all ${
                    active ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-white/[0.02] text-white/40 border border-white/[0.04] hover:border-white/[0.1]'
                  }`}>
                  {active && <CheckCircle className="w-3 h-3 inline mr-1" />}
                  {symptom}
                </button>
              );
            })}
          </div>
          <div className="mt-4 pt-4 border-t border-white/[0.04] text-white/25 text-[10px] text-center">
            {symptoms.length} of {allSymptoms.length} symptoms tracked
          </div>
        </GlassmorphicCard>
      </div>

      {/* APPOINTMENTS */}
      <GlassmorphicCard variant="elevated" padding="lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-semibold text-sm">Appointments</h3>
          <Button variant="glass" size="xs" onClick={() => setShowAddAppointment(!showAddAppointment)} className="gap-1">
            <Plus className="w-3.5 h-3.5" /> Add
          </Button>
        </div>

        <AnimatePresence>
          {showAddAppointment && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-2 gap-3 mb-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                <input type="date" value={newAppointment.date} onChange={(e) => setNewAppointment(prev => ({ ...prev, date: e.target.value }))}
                  className="px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm focus:outline-none" />
                <input type="time" value={newAppointment.time} onChange={(e) => setNewAppointment(prev => ({ ...prev, time: e.target.value }))}
                  className="px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm focus:outline-none" />
                <input type="text" placeholder="Type" value={newAppointment.type} onChange={(e) => setNewAppointment(prev => ({ ...prev, type: e.target.value }))}
                  className="px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none" />
                <input type="text" placeholder="Location" value={newAppointment.location} onChange={(e) => setNewAppointment(prev => ({ ...prev, location: e.target.value }))}
                  className="px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none" />
                <input type="text" placeholder="Notes" value={newAppointment.notes} onChange={(e) => setNewAppointment(prev => ({ ...prev, notes: e.target.value }))}
                  className="col-span-2 px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none" />
                <Button variant="gradient" size="xs" onClick={handleAddAppointment} className="col-span-2">Save Appointment</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="space-y-2">
          {appointments.map((apt) => (
            <div key={apt.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all">
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <div>
                  <p className="text-white text-xs font-medium">{apt.type}</p>
                  <p className="text-white/30 text-[10px]">{apt.date} at {apt.time} • {apt.location}</p>
                </div>
              </div>
              <button type="button" className="p-1.5 hover:bg-white/[0.06] rounded-lg">
                <Edit2 className="w-3.5 h-3.5 text-white/30" />
              </button>
            </div>
          ))}
          {appointments.length === 0 && (
            <p className="text-white/30 text-sm text-center py-6">No appointments yet.</p>
          )}
        </div>
      </GlassmorphicCard>

      {/* TIPS */}
      <GlassmorphicCard variant="subtle" padding="lg">
        <h3 className="text-white font-semibold text-sm mb-4">💡 Tips for Week {currentWeek}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: Heart, title: 'Stay Hydrated', desc: 'Drink 8-10 glasses of water daily', color: 'text-pink-400' },
            { icon: Activity, title: 'Gentle Exercise', desc: 'Walking or prenatal yoga helps', color: 'text-emerald-400' },
            { icon: Shield, title: 'Avoid Harmful Substances', desc: 'No alcohol, tobacco, or drugs', color: 'text-cyan-400' },
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

export default PregnancyTracker;