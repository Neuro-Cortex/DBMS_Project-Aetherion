// src/pages/client/VaccineTracking.tsx
// COMPLETE VACCINE TRACKING PAGE - SIDEBAR REMOVED
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Syringe, Calendar, Clock, CheckCircle2, AlertCircle,
  ChevronRight, Plus, Shield,
  Bell, Download, Search, X,
  MapPin, User
} from 'lucide-react';

// ============================================
// UI COMPONENTS
// ============================================
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Modal } from 'src/ui/Modal';

// ============================================
// TYPES
// ============================================
interface Vaccine {
  id: string;
  name: string;
  date: string;
  dose: string;
  nextDueDate?: string;
  administeredBy: string;
  location: string;
  status: 'completed' | 'upcoming' | 'overdue';
  category: 'child' | 'adult' | 'travel' | 'seasonal';
  certificateUrl?: string;
  notes?: string;
  ageGroup: string;
  protection: string[];
}

interface UpcomingVaccine {
  name: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
}

interface VaccineStats {
  total: number;
  completed: number;
  upcoming: number;
  overdue: number;
  protectionCoverage: number;
}

// ============================================
// MOCK DATA
// ============================================
const vaccines: Vaccine[] = [
  {
    id: 'v1',
    name: 'COVID-19 (Moderna)',
    date: '2024-10-15',
    dose: 'Booster',
    nextDueDate: '2025-04-15',
    administeredBy: 'Dr. Sarah Johnson',
    location: 'City General Hospital',
    status: 'completed',
    category: 'adult',
    certificateUrl: '/certificates/covid-booster.pdf',
    ageGroup: '18+',
    protection: ['COVID-19', 'Variants'],
  },
  {
    id: 'v2',
    name: 'Influenza (Flu Shot)',
    date: '2024-11-10',
    dose: 'Annual',
    nextDueDate: '2025-11-10',
    administeredBy: 'Dr. Michael Chen',
    location: 'Metro Medical Center',
    status: 'completed',
    category: 'seasonal',
    certificateUrl: '/certificates/flu-2024.pdf',
    ageGroup: 'All ages',
    protection: ['Influenza A', 'Influenza B'],
  },
  {
    id: 'v3',
    name: 'Tetanus (Tdap)',
    date: '2023-06-20',
    dose: 'Booster',
    nextDueDate: '2033-06-20',
    administeredBy: 'Dr. Emily Davis',
    location: 'Sunshine Clinic',
    status: 'completed',
    category: 'adult',
    ageGroup: '18+',
    protection: ['Tetanus', 'Diphtheria', 'Pertussis'],
  },
  {
    id: 'v4',
    name: 'Hepatitis B',
    date: '2022-03-15',
    dose: 'Dose 3/3',
    administeredBy: 'Dr. Robert Wilson',
    location: 'Apex Hospital',
    status: 'completed',
    category: 'adult',
    ageGroup: 'All ages',
    protection: ['Hepatitis B'],
  },
  {
    id: 'v5',
    name: 'HPV Vaccine',
    date: '2024-12-01',
    dose: 'Dose 1/2',
    nextDueDate: '2025-06-01',
    administeredBy: 'Dr. Lisa Anderson',
    location: 'Wellness Hub',
    status: 'upcoming',
    category: 'adult',
    ageGroup: '9-45',
    protection: ['HPV Types 16, 18', 'Cervical Cancer'],
  },
  {
    id: 'v6',
    name: 'Shingles (Herpes Zoster)',
    date: '2024-09-01',
    dose: 'Dose 1/2',
    nextDueDate: '2025-01-01',
    administeredBy: 'Dr. James Kim',
    location: 'Prime Health Center',
    status: 'overdue',
    category: 'adult',
    ageGroup: '50+',
    protection: ['Shingles', 'Post-herpetic Neuralgia'],
  },
  {
    id: 'v7',
    name: 'MMR (Measles, Mumps, Rubella)',
    date: '2020-05-10',
    dose: 'Dose 2/2',
    administeredBy: 'Dr. Sarah Johnson',
    location: 'City General Hospital',
    status: 'completed',
    category: 'adult',
    ageGroup: 'All ages',
    protection: ['Measles', 'Mumps', 'Rubella'],
  },
  {
    id: 'v8',
    name: 'Polio (IPV)',
    date: '2019-08-20',
    dose: 'Booster',
    administeredBy: 'Dr. Michael Chen',
    location: 'Metro Medical Center',
    status: 'completed',
    category: 'travel',
    ageGroup: 'All ages',
    protection: ['Poliovirus'],
  },
];

const upcomingVaccines: UpcomingVaccine[] = [
  { name: 'HPV Vaccine - Dose 2', dueDate: '2025-06-01', priority: 'medium' },
  { name: 'COVID-19 Booster', dueDate: '2025-04-15', priority: 'low' },
  { name: 'Shingles - Dose 2', dueDate: '2025-01-01', priority: 'high' },
];

// ============================================
// STATUS & PRIORITY CONFIGS
// ============================================
const statusConfig: Record<string, { icon: React.ElementType; bg: string; text: string; border: string }> = {
  completed: { icon: CheckCircle2, bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  upcoming: { icon: Calendar, bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  overdue: { icon: AlertCircle, bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' },
};

const priorityConfig: Record<string, { bg: string; text: string }> = {
  high: { bg: 'bg-red-500/10', text: 'text-red-400' },
  medium: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  low: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
};

// ============================================
// VACCINE DETAIL MODAL
// ============================================
const VaccineDetailModal: React.FC<{
  vaccine: Vaccine;
  onClose: () => void;
}> = ({ vaccine, onClose }) => {
  const statusStyle = statusConfig[vaccine.status];
  const StatusIcon = statusStyle.icon;

  return (
    <Modal isOpen={true} onClose={onClose} title={vaccine.name}>
      <div className="space-y-5 p-2">
        <div className="flex items-center gap-2">
          <Badge className={`${statusStyle.bg} ${statusStyle.text}`}>
            <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
            {vaccine.status.charAt(0).toUpperCase() + vaccine.status.slice(1)}
          </Badge>
          <Badge variant="outline" className="capitalize">{vaccine.category}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Dose</label>
            <p className="text-white text-sm font-bold">{vaccine.dose}</p>
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Date Administered</label>
            <p className="text-white text-sm font-bold">{vaccine.date}</p>
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Administered By</label>
            <p className="text-white text-sm font-bold flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              {vaccine.administeredBy}
            </p>
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Location</label>
            <p className="text-white text-sm font-bold flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
              {vaccine.location}
            </p>
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Age Group</label>
            <p className="text-white text-sm font-bold">{vaccine.ageGroup}</p>
          </div>
          {vaccine.nextDueDate && (
            <div>
              <label className="text-slate-400 text-xs mb-1 block">Next Due Date</label>
              <p className={`text-sm font-bold ${vaccine.status === 'overdue' ? 'text-red-400' : 'text-amber-400'}`}>
                {vaccine.nextDueDate}
              </p>
            </div>
          )}
        </div>

        <div>
          <label className="text-slate-400 text-xs mb-2 block">Protection Against</label>
          <div className="flex flex-wrap gap-2">
            {vaccine.protection.map((item, i) => (
              <Badge key={i} variant="info" className="bg-purple-500/10 text-purple-400 border-purple-500/20">
                {item}
              </Badge>
            ))}
          </div>
        </div>

        {vaccine.certificateUrl && (
          <Button
            variant="primary"
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500"
            onClick={() => window.open(vaccine.certificateUrl, '_blank')}
          >
            <Download className="w-4 h-4 mr-2" />
            Download Certificate
          </Button>
        )}
      </div>
    </Modal>
  );
};

// ============================================
// MAIN VACCINE TRACKING PAGE
// ============================================
const ClientVaccineTracking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'completed' | 'upcoming' | 'overdue'>('all');
  const [selectedVaccine, setSelectedVaccine] = useState<Vaccine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredVaccines = vaccines.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchTab = activeTab === 'all' ? true : v.status === activeTab;
    const matchCategory = categoryFilter === 'all' ? true : v.category === categoryFilter;
    return matchSearch && matchTab && matchCategory;
  });

  const stats: VaccineStats = {
    total: vaccines.length,
    completed: vaccines.filter(v => v.status === 'completed').length,
    upcoming: vaccines.filter(v => v.status === 'upcoming').length,
    overdue: vaccines.filter(v => v.status === 'overdue').length,
    protectionCoverage: Math.round((vaccines.filter(v => v.status === 'completed').length / vaccines.length) * 100),
  };

  const statCards = [
    { label: 'Total Vaccines', value: stats.total, icon: Syringe, color: 'cyan' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'emerald' },
    { label: 'Upcoming', value: stats.upcoming, icon: Calendar, color: 'amber' },
    { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'red' },
    { label: 'Protection', value: `${stats.protectionCoverage}%`, icon: Shield, color: 'purple' },
  ];

  const tabFilters = [
    { id: 'all' as const, label: 'All Records' },
    { id: 'completed' as const, label: 'Completed' },
    { id: 'upcoming' as const, label: 'Upcoming' },
    { id: 'overdue' as const, label: 'Overdue' },
  ];

  const hasHighPriorityOverdue = upcomingVaccines.some(v => v.priority === 'high');

  return (
    <div className="min-h-screen bg-[#020408] p-4 lg:p-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
              <Syringe className="w-5 h-5 text-white" />
            </div>
            Vaccine Tracking
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track your immunization history and upcoming vaccinations
          </p>
        </div>
        <Button
          variant="primary"
          className="bg-gradient-to-r from-purple-500 to-violet-600 shadow-lg shadow-purple-500/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Vaccine Record
        </Button>
      </motion.div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          const colors: Record<string, string> = {
            cyan: 'bg-cyan-500/10 text-cyan-400',
            emerald: 'bg-emerald-500/10 text-emerald-400',
            amber: 'bg-amber-500/10 text-amber-400',
            red: 'bg-red-500/10 text-red-400',
            purple: 'bg-purple-500/10 text-purple-400',
          };
          const colorClass = colors[stat.color] || colors.cyan;
          const [bg, text] = colorClass.split(' ');

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="p-4 cursor-default">
                <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3`}>
                  <Icon className={`w-5 h-5 ${text}`} />
                </div>
                <p className={`text-2xl font-black ${text}`}>{stat.value}</p>
                <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* OVERDUE ALERT BANNER */}
      {hasHighPriorityOverdue && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        >
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-red-400 animate-pulse flex-shrink-0" />
            <div>
              <p className="text-red-400 font-bold text-sm">Overdue Vaccination Alert</p>
              <p className="text-slate-400 text-xs">
                You have {stats.overdue} overdue vaccine(s). Please schedule immediately!
              </p>
            </div>
          </div>
          <Button variant="danger" size="sm" className="bg-red-500/20 text-red-400 whitespace-nowrap">
            Schedule Now
          </Button>
        </motion.div>
      )}

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabFilters.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-white/[0.02] text-slate-400 border border-white/[0.06] hover:text-white'
              }`}
            >
              {tab.label}
            </motion.button>
          ))}
        </div>

        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search vaccines..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500/30 transition-all"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-slate-400 text-sm focus:outline-none focus:border-purple-500/30 cursor-pointer"
        >
          <option value="all">All Categories</option>
          <option value="adult">Adult</option>
          <option value="child">Child</option>
          <option value="travel">Travel</option>
          <option value="seasonal">Seasonal</option>
        </select>

        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* VACCINE LIST */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredVaccines.map((vaccine, index) => {
            const statusStyle = statusConfig[vaccine.status];
            const StatusIcon = statusStyle.icon;
            const cardBorder = vaccine.status === 'overdue'
              ? 'border-red-500/20 hover:border-red-500/30'
              : vaccine.status === 'upcoming'
              ? 'border-amber-500/10 hover:border-amber-500/20'
              : 'border-white/[0.04] hover:border-purple-500/20';

            return (
              <motion.div
                key={vaccine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedVaccine(vaccine)}
              >
                <GlassmorphicCard className={`p-5 cursor-pointer transition-all ${cardBorder}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${statusStyle.bg}`}>
                      <StatusIcon className={`w-6 h-6 ${statusStyle.text}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-white font-bold text-sm lg:text-base">{vaccine.name}</h3>
                        <Badge className={`${statusStyle.bg} ${statusStyle.text} text-[10px]`}>
                          {vaccine.status}
                        </Badge>
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {vaccine.category}
                        </Badge>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-slate-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {vaccine.date}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500">{vaccine.dose}</span>
                        <span className="text-slate-600">•</span>
                        <span className="text-slate-500 truncate">{vaccine.location}</span>
                      </div>

                      {vaccine.nextDueDate && (
                        <div className="flex items-center gap-1 mt-2">
                          <Clock className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                          <span className={`text-xs font-bold ${
                            vaccine.status === 'overdue' ? 'text-red-400' : 'text-amber-400'
                          }`}>
                            Next dose: {vaccine.nextDueDate}
                          </span>
                        </div>
                      )}

                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {vaccine.protection.slice(0, 4).map((item, i) => (
                          <Badge key={i} variant="info" className="text-[10px] bg-purple-500/10 text-purple-400 border-purple-500/20">
                            {item}
                          </Badge>
                        ))}
                        {vaccine.protection.length > 4 && (
                          <span className="text-[10px] text-slate-500">+{vaccine.protection.length - 4} more</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      {vaccine.certificateUrl && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(vaccine.certificateUrl, '_blank');
                          }}
                          className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-emerald-400 hover:border-emerald-400/30 transition-all"
                          title="Download Certificate"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      )}
                      <ChevronRight className="w-5 h-5 text-slate-600" />
                    </div>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredVaccines.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Syringe className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-bold">No vaccine records found</p>
            <p className="text-slate-600 text-sm mt-1">
              {searchTerm ? 'Try adjusting your search or filters' : 'Add your first vaccine record to start tracking'}
            </p>
            <Button variant="primary" className="mt-4">
              <Plus className="w-4 h-4 mr-2" /> Add Vaccine Record
            </Button>
          </motion.div>
        )}
      </div>

      {/* UPCOMING VACCINATIONS SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8"
      >
        <GlassmorphicCard className="p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            Upcoming Vaccinations
          </h3>
          
          <div className="space-y-3">
            {upcomingVaccines.map((vaccine, index) => {
              const priorityStyle = priorityConfig[vaccine.priority];
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.08] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${priorityStyle.bg}`}>
                      <Syringe className={`w-5 h-5 ${priorityStyle.text}`} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">{vaccine.name}</p>
                      <p className="text-slate-500 text-xs">Due: {vaccine.dueDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
                    <Badge className={`${priorityStyle.bg} ${priorityStyle.text} text-[10px] capitalize`}>
                      {vaccine.priority} priority
                    </Badge>
                    <Button variant="outline" size="xs" className="text-purple-400 border-purple-500/20 whitespace-nowrap">
                      Schedule
                    </Button>
                  </div>
                </motion.div>
              );
            })}

            {upcomingVaccines.length === 0 && (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <p className="text-slate-400">All vaccinations up to date!</p>
              </div>
            )}
          </div>
        </GlassmorphicCard>
      </motion.div>

      {/* VACCINE DETAIL MODAL */}
      <AnimatePresence>
        {selectedVaccine && (
          <VaccineDetailModal
            vaccine={selectedVaccine}
            onClose={() => setSelectedVaccine(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientVaccineTracking;