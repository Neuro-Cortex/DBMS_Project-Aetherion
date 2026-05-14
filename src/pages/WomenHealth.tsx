// src/pages/WomenHealth.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Baby, User, Shield, Heart, Calendar, Stethoscope, Clock,
  Star, MapPin, Phone, Video, MessageCircle, TrendingUp,
  Award, CheckCircle, AlertCircle, Plus, Search, Filter, Bell,
  Sparkles, Activity, Users, Zap
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from 'src/components/dashboard/statCard';

// ============================================
// TYPES
// ============================================
interface Gynecologist {
  id: string;
  name: string;
  specializations: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  hospital: string;
  location: string;
  languages: string[];
  consultationFee: number;
  nextAvailable: string;
  isOnline: boolean;
  isVerified: boolean;
  treatsConditions: string[];
  degrees: string[];
}

interface Vaccine {
  id: string;
  name: string;
  targetDisease: string;
  doses: number;
  completedDoses: number;
  status: string;
  nextDueDate: string;
  notes: string;
  isPregnancySafe: boolean;
}

// ============================================
// MOCK DATA
// ============================================
const gynecologistsData: Gynecologist[] = [
  { id: '1', name: 'Dr. Emily Parker', specializations: ['Obstetrics', 'Gynecology', 'Fertility'], experience: 18, rating: 4.9, reviewCount: 650, hospital: 'Women Care Center', location: 'New York', languages: ['English', 'Spanish'], consultationFee: 150, nextAvailable: 'Today', isOnline: true, isVerified: true, treatsConditions: ['PCOS', 'Pregnancy', 'Fertility'], degrees: ['MD', 'FRCOG'] },
  { id: '2', name: 'Dr. Sarah Johnson', specializations: ['Obstetrics', 'High-Risk Pregnancy'], experience: 22, rating: 4.8, reviewCount: 520, hospital: 'Metro Women\'s Hospital', location: 'Los Angeles', languages: ['English'], consultationFee: 200, nextAvailable: 'Tomorrow', isOnline: false, isVerified: true, treatsConditions: ['High-Risk Pregnancy', 'Endometriosis'], degrees: ['MD', 'FACOG'] },
  { id: '3', name: 'Dr. Lisa Chen', specializations: ['Gynecology', 'Adolescent Care'], experience: 12, rating: 4.7, reviewCount: 380, hospital: 'Youth Wellness Center', location: 'Chicago', languages: ['English', 'Mandarin'], consultationFee: 120, nextAvailable: 'Today', isOnline: true, isVerified: true, treatsConditions: ['PCOS', 'Menstrual Disorders'], degrees: ['MD', 'MPH'] },
  { id: '4', name: 'Dr. Maria Rodriguez', specializations: ['Fertility', 'Reproductive Health'], experience: 15, rating: 4.9, reviewCount: 480, hospital: 'Fertility First Clinic', location: 'Miami', languages: ['English', 'Spanish'], consultationFee: 180, nextAvailable: 'Today', isOnline: true, isVerified: true, treatsConditions: ['Infertility', 'IVF'], degrees: ['MD', 'PhD'] },
];

const vaccinesData: Vaccine[] = [
  { id: '1', name: 'HPV Vaccine', targetDisease: 'Cervical Cancer', doses: 3, completedDoses: 2, status: 'due', nextDueDate: '2024-04-15', notes: 'Prevents HPV infection', isPregnancySafe: false },
  { id: '2', name: 'Tdap', targetDisease: 'Tetanus, Pertussis', doses: 1, completedDoses: 0, status: 'upcoming', nextDueDate: '2024-05-01', notes: 'During 27-36 weeks', isPregnancySafe: true },
  { id: '3', name: 'Flu Shot', targetDisease: 'Influenza', doses: 1, completedDoses: 1, status: 'completed', nextDueDate: '2025-10-01', notes: 'Annual vaccination', isPregnancySafe: true },
  { id: '4', name: 'Hepatitis B', targetDisease: 'Hepatitis B', doses: 3, completedDoses: 1, status: 'upcoming', nextDueDate: '2024-04-20', notes: 'High-risk individuals', isPregnancySafe: true },
];

// ============================================
// SUB-COMPONENTS
// ============================================

// Gynecologist Card (Inline)
const GynecologistCard: React.FC<{ doctor: Gynecologist }> = ({ doctor }) => (
  <motion.div whileHover={{ y: -4 }}
    className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-5 hover:border-white/[0.12] transition-all duration-300">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
          {doctor.name.charAt(0)}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-semibold text-sm">{doctor.name}</h3>
            {doctor.isVerified && <Badge variant="success" size="xs">Verified</Badge>}
            {doctor.isOnline && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
          </div>
          <p className="text-white/35 text-xs">{doctor.specializations.join(' • ')}</p>
        </div>
      </div>
      <div className="flex items-center gap-1 bg-amber-500/10 rounded-lg px-2 py-1">
        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        <span className="text-white text-sm font-bold">{doctor.rating}</span>
        <span className="text-white/30 text-[10px]">({doctor.reviewCount})</span>
      </div>
    </div>
    <div className="flex flex-wrap items-center gap-2 mb-3 text-xs">
      <span className="flex items-center gap-1 text-white/40"><MapPin className="w-3 h-3" />{doctor.location}</span>
      <span className="text-white/15">•</span>
      <span className="flex items-center gap-1 text-white/40"><Award className="w-3 h-3" />{doctor.experience}y exp</span>
      <span className="text-white/15">•</span>
      <span className="flex items-center gap-1 text-white/40"><DollarSign className="w-3 h-3" />${doctor.consultationFee}</span>
    </div>
    <div className="flex flex-wrap gap-1.5 mb-4">
      {doctor.treatsConditions.map((c) => (
        <span key={c} className="px-2 py-0.5 rounded-full bg-white/[0.02] text-white/35 text-[10px] border border-white/[0.04]">{c}</span>
      ))}
    </div>
    <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
      <span className="text-emerald-400 text-[10px] font-medium">{doctor.nextAvailable}</span>
      <Button variant="glass" size="xs" className="gap-1"><Calendar className="w-3 h-3" />Book</Button>
    </div>
  </motion.div>
);

// Pregnancy Tracker (Inline)
const PregnancyTracker: React.FC<{ dueDate?: string }> = ({ dueDate = '2024-09-15' }) => {
  const today = new Date();
  const due = new Date(dueDate);
  const totalDays = 280;
  const daysPassed = Math.floor((today.getTime() - new Date(due.getTime() - totalDays * 86400000).getTime()) / 86400000);
  const currentWeek = Math.floor(daysPassed / 7);
  const currentDay = daysPassed % 7;
  const progress = Math.round((daysPassed / totalDays) * 100);
  const daysRemaining = totalDays - daysPassed;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Current Week', value: `Week ${currentWeek}`, icon: Baby, color: 'text-pink-400', bg: 'bg-pink-500/10' },
          { label: 'Days Remaining', value: daysRemaining, icon: Calendar, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
          { label: 'Progress', value: `${progress}%`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Due Date', value: dueDate, icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }} className={`${item.bg} rounded-xl border border-white/[0.06] p-4 text-center`}>
              <Icon className={`w-5 h-5 mx-auto mb-2 ${item.color}`} />
              <div className="text-lg font-bold text-white">{item.value}</div>
              <div className="text-white/30 text-[10px]">{item.label}</div>
            </motion.div>
          );
        })}
      </div>
      <GlassmorphicCard variant="elevated" padding="lg">
        <h3 className="text-white font-semibold text-sm mb-4">Pregnancy Progress</h3>
        <div className="h-3 bg-white/[0.04] rounded-full overflow-hidden mb-2">
          <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-pink-400 to-purple-500 rounded-full" />
        </div>
        <div className="flex justify-between text-[10px] text-white/25">
          <span>Week 1</span><span>{progress}% complete</span><span>Week 40</span>
        </div>
        <div className="grid grid-cols-3 gap-3 mt-6 text-center">
          {[
            { trimester: '1st', weeks: '1-13', status: 'completed', color: 'text-emerald-400' },
            { trimester: '2nd', weeks: '14-26', status: 'current', color: 'text-cyan-400' },
            { trimester: '3rd', weeks: '27-40', status: 'upcoming', color: 'text-purple-400' },
          ].map((t) => (
            <div key={t.trimester} className={`p-3 rounded-xl ${t.status === 'current' ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-white/[0.02]'}`}>
              <p className="text-white font-bold text-sm">{t.trimester}</p>
              <p className="text-white/30 text-[10px]">{t.weeks}</p>
              {t.status === 'current' && <Badge variant="info" size="xs" className="mt-1">Current</Badge>}
            </div>
          ))}
        </div>
      </GlassmorphicCard>
    </div>
  );
};

// Vaccine Schedule (Inline)
const VaccineSchedule: React.FC<{ vaccines: Vaccine[] }> = ({ vaccines }) => {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      due: 'bg-red-500/10 text-red-400 border-red-500/20',
      upcoming: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      overdue: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
    };
    return colors[status] || '';
  };

  return (
    <GlassmorphicCard variant="elevated" padding="lg">
      <h3 className="text-white font-semibold text-sm mb-4">Vaccine Schedule</h3>
      <div className="space-y-2">
        {vaccines.map((v) => (
          <div key={v.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-cyan-400" />
              <div>
                <p className="text-white text-xs font-medium">{v.name}</p>
                <p className="text-white/30 text-[10px]">{v.targetDisease} • {v.notes}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(v.status)}`}>{v.status}</span>
              <p className="text-white/25 text-[10px] mt-0.5">{v.completedDoses}/{v.doses} doses</p>
            </div>
          </div>
        ))}
      </div>
    </GlassmorphicCard>
  );
};

// Special Care (Inline)
const SpecialCare: React.FC = () => (
  <GlassmorphicCard variant="elevated" padding="lg">
    <h3 className="text-white font-semibold text-sm mb-4">Special Care Programs</h3>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[
        { icon: Heart, title: 'Cardiac Care', desc: 'Heart health during pregnancy', color: 'text-red-400' },
        { icon: Activity, title: 'Diabetes Management', desc: 'Gestational diabetes support', color: 'text-amber-400' },
        { icon: Brain, title: 'Mental Wellness', desc: 'Postpartum depression care', color: 'text-purple-400' },
        { icon: Users, title: 'Support Groups', desc: 'Connect with other mothers', color: 'text-cyan-400' },
      ].map((item, i) => {
        const Icon = item.icon;
        return (
          <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-all cursor-pointer">
            <Icon className={`w-5 h-5 ${item.color} mb-2`} />
            <p className="text-white text-sm font-medium">{item.title}</p>
            <p className="text-white/35 text-xs mt-0.5">{item.desc}</p>
          </div>
        );
      })}
    </div>
  </GlassmorphicCard>
);

// Missing imports
import { Brain, DollarSign } from 'lucide-react';

// ============================================
// MAIN COMPONENT
// ============================================
export const WomenHealth: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'tracker' | 'gyno' | 'vaccine' | 'care'>('tracker');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const specializations = useMemo(() => [...new Set(gynecologistsData.flatMap(d => d.specializations))], []);

  const filteredGynecologists = useMemo(() => {
    return gynecologistsData.filter(g => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || g.name.toLowerCase().includes(q) || g.location.toLowerCase().includes(q);
      const matchesSpecialty = !selectedSpecialty || g.specializations.includes(selectedSpecialty);
      return matchesSearch && matchesSpecialty;
    });
  }, [searchQuery, selectedSpecialty]);

  const statCards = [
    { title: 'Pregnancy Week', value: '24', icon: Baby, color: 'pink' as const, change: '+2', trend: 'up' as const },
    { title: 'Upcoming Vaccines', value: vaccinesData.filter(v => v.status === 'upcoming' || v.status === 'due').length, icon: Shield, color: 'cyan' as const, change: '+1', trend: 'up' as const },
    { title: 'Gynecologists', value: gynecologistsData.length, icon: User, color: 'purple' as const, change: '+5', trend: 'up' as const },
    { title: 'Health Score', value: '92%', icon: Heart, color: 'red' as const, change: '+8%', trend: 'up' as const },
  ];

  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-white/[0.04]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-xl shadow-pink-500/20">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em]">Women's Health</h1>
                <Badge variant="success" size="xs">Complete Care</Badge>
              </div>
              <p className="text-white/35 text-sm mt-1">Comprehensive healthcare for women of all ages</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="glass" size="sm"><Bell className="w-4 h-4 mr-1.5" />Reminders</Button>
            <Button variant="gradient" size="sm"><Plus className="w-4 h-4 mr-1.5" />Add Record</Button>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <StatCard key={i} title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} change={stat.change} trend={stat.trend} />
          ))}
        </div>

        {/* HEALTH TIP */}
        <GlassmorphicCard variant="subtle" padding="md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">💡 Health Tip</p>
              <p className="text-white/35 text-xs">Regular prenatal checkups are essential. Schedule your next appointment today!</p>
            </div>
          </div>
        </GlassmorphicCard>

        {/* TABS */}
        <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 w-fit flex-wrap">
          {[
            { id: 'tracker' as const, label: 'Pregnancy', icon: Baby },
            { id: 'gyno' as const, label: 'Gynecologists', icon: User },
            { id: 'vaccine' as const, label: 'Vaccines', icon: Shield },
            { id: 'care' as const, label: 'Special Care', icon: Heart },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <Button key={tab.id} variant={activeTab === tab.id ? 'gradient' : 'glass'} size="sm"
                onClick={() => setActiveTab(tab.id)} className="gap-2">
                <Icon className="w-4 h-4" />{tab.label}
              </Button>
            );
          })}
        </div>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === 'tracker' && (
            <motion.div key="tracker" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <PregnancyTracker />
            </motion.div>
          )}

          {activeTab === 'gyno' && (
            <motion.div key="gyno" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              <GlassmorphicCard variant="subtle" padding="sm">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
                    <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search by name or location..."
                      className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/15" />
                  </div>
                  <select value={selectedSpecialty} onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/70 text-sm focus:outline-none cursor-pointer">
                    <option value="" className="bg-[#1a1a2e]">All Specializations</option>
                    {specializations.map(s => <option key={s} value={s} className="bg-[#1a1a2e]">{s}</option>)}
                  </select>
                </div>
              </GlassmorphicCard>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredGynecologists.map((doctor, index) => (
                  <motion.div key={doctor.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <GynecologistCard doctor={doctor} />
                  </motion.div>
                ))}
              </div>
              {filteredGynecologists.length === 0 && (
                <div className="text-center py-16">
                  <User className="w-12 h-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/40 text-sm">No gynecologists found. Try adjusting your filters.</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'vaccine' && (
            <motion.div key="vaccine" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <VaccineSchedule vaccines={vaccinesData} />
            </motion.div>
          )}

          {activeTab === 'care' && (
            <motion.div key="care" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <SpecialCare />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WomenHealth;