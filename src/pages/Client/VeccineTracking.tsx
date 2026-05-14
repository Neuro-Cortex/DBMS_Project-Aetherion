// src/pages/client/VaccineTracking.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientSidebar from '../../components/client/ClientSidebar';
import {
  Syringe, Calendar, Clock, CheckCircle2, AlertCircle,
  ChevronRight, Plus, Shield, Baby, Activity,
  Bell, FileText, Download, TrendingUp, Search,
  Filter, ArrowRight, Info, Star
} from 'lucide-react';

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

const upcomingVaccines = [
  { name: 'HPV Vaccine - Dose 2', dueDate: '2025-06-01', priority: 'medium' },
  { name: 'COVID-19 Booster', dueDate: '2025-04-15', priority: 'low' },
  { name: 'Shingles - Dose 2', dueDate: '2025-01-01', priority: 'high' },
];

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

  const stats = {
    total: vaccines.length,
    completed: vaccines.filter(v => v.status === 'completed').length,
    upcoming: vaccines.filter(v => v.status === 'upcoming').length,
    overdue: vaccines.filter(v => v.status === 'overdue').length,
    protectionCoverage: 85,
  };

  return (
    <div className="min-h-screen bg-[#050508]">
      <ClientSidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Syringe className="w-8 h-8 text-purple-400" />
              Vaccine Tracking
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Track your immunization history and upcoming vaccinations
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Vaccine Record
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Vaccines', value: stats.total, icon: Syringe, color: 'from-cyan-500 to-blue-500', bgColor: 'bg-cyan-500/10', textColor: 'text-cyan-400' },
            { label: 'Completed', value: stats.completed, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500', bgColor: 'bg-emerald-500/10', textColor: 'text-emerald-400' },
            { label: 'Upcoming', value: stats.upcoming, icon: Calendar, color: 'from-amber-500 to-orange-500', bgColor: 'bg-amber-500/10', textColor: 'text-amber-400' },
            { label: 'Overdue', value: stats.overdue, icon: AlertCircle, color: 'from-red-500 to-rose-500', bgColor: 'bg-red-500/10', textColor: 'text-red-400' },
            { label: 'Protection', value: `${stats.protectionCoverage}%`, icon: Shield, color: 'from-purple-500 to-violet-500', bgColor: 'bg-purple-500/10', textColor: 'text-purple-400' },
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className={`p-4 rounded-xl ${stat.bgColor} border border-white/[0.04] cursor-default`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</div>
                <p className="text-white/40 text-xs mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Upcoming Alerts */}
        {upcomingVaccines.filter(v => v.priority === 'high').length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-red-400 animate-pulse" />
              <div>
                <p className="text-red-400 font-medium text-sm">Overdue Vaccination Alert</p>
                <p className="text-white/40 text-xs">You have {stats.overdue} overdue vaccine(s). Schedule now!</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              className="px-4 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/30 transition-all"
            >
              Schedule Now
            </motion.button>
          </motion.div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          {/* Tabs */}
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Records' },
              { id: 'completed', label: 'Completed' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'overdue', label: 'Overdue' },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                    : 'bg-white/[0.02] text-white/40 border border-white/[0.04] hover:text-white/60'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              placeholder="Search vaccines..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm outline-none focus:border-purple-400/50 transition-all"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/60 text-sm outline-none focus:border-purple-400/50"
          >
            <option value="all" className="bg-gray-900">All Categories</option>
            <option value="adult" className="bg-gray-900">Adult</option>
            <option value="child" className="bg-gray-900">Child</option>
            <option value="travel" className="bg-gray-900">Travel</option>
            <option value="seasonal" className="bg-gray-900">Seasonal</option>
          </select>
        </div>

        {/* Vaccine List */}
        <div className="grid gap-4">
          <AnimatePresence>
            {filteredVaccines.map((vaccine, index) => (
              <motion.div
                key={vaccine.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedVaccine(vaccine)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  vaccine.status === 'overdue'
                    ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/30'
                    : vaccine.status === 'upcoming'
                    ? 'bg-amber-500/5 border-amber-500/10 hover:border-amber-500/20'
                    : 'bg-white/[0.02] border-white/[0.04] hover:border-purple-500/20'
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Status Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    vaccine.status === 'completed'
                      ? 'bg-emerald-500/10'
                      : vaccine.status === 'upcoming'
                      ? 'bg-amber-500/10'
                      : 'bg-red-500/10'
                  }`}>
                    {vaccine.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : vaccine.status === 'upcoming' ? (
                      <Calendar className="w-6 h-6 text-amber-400" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-400" />
                    )}
                  </div>

                  {/* Vaccine Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-semibold">{vaccine.name}</h3>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                        vaccine.status === 'completed'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : vaccine.status === 'upcoming'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-red-500/10 text-red-400'
                      }`}>
                        {vaccine.status}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-white/[0.03] text-white/30 text-[10px] capitalize">
                        {vaccine.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 mt-1.5">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-white/30" />
                        <span className="text-white/40 text-xs">{vaccine.date}</span>
                      </div>
                      <span className="text-white/20">•</span>
                      <span className="text-white/40 text-xs">{vaccine.dose}</span>
                      <span className="text-white/20">•</span>
                      <span className="text-white/40 text-xs">{vaccine.location}</span>
                    </div>

                    {vaccine.nextDueDate && (
                      <div className="flex items-center gap-1 mt-2">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span className={`text-xs ${
                          vaccine.status === 'overdue' ? 'text-red-400 font-medium' : 'text-amber-400'
                        }`}>
                          Next dose: {vaccine.nextDueDate}
                        </span>
                      </div>
                    )}

                    {/* Protection Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {vaccine.protection.map((item, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400 text-[10px] font-medium border border-purple-500/20">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {vaccine.certificateUrl && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.04] text-white/40 hover:text-emerald-400 hover:border-emerald-400/30 transition-all"
                        title="Download Certificate"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                    )}
                    <ChevronRight className="w-5 h-5 text-white/20" />
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredVaccines.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Syringe className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-lg">No vaccine records found</p>
            <p className="text-white/20 text-sm mt-1">Add your first vaccine record to start tracking</p>
            <button className="mt-4 px-6 py-3 rounded-xl bg-purple-500/10 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-all">
              Add Vaccine Record
            </button>
          </motion.div>
        )}

        {/* Upcoming Vaccines Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
        >
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-amber-400" />
            Upcoming Vaccinations
          </h3>
          
          <div className="space-y-3">
            {upcomingVaccines.map((vaccine, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    vaccine.priority === 'high'
                      ? 'bg-red-500/10'
                      : vaccine.priority === 'medium'
                      ? 'bg-amber-500/10'
                      : 'bg-blue-500/10'
                  }`}>
                    <Syringe className={`w-5 h-5 ${
                      vaccine.priority === 'high'
                        ? 'text-red-400'
                        : vaccine.priority === 'medium'
                        ? 'text-amber-400'
                        : 'text-blue-400'
                    }`} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{vaccine.name}</p>
                    <p className="text-white/40 text-xs">Due: {vaccine.dueDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                    vaccine.priority === 'high'
                      ? 'bg-red-500/10 text-red-400'
                      : vaccine.priority === 'medium'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-blue-500/10 text-blue-400'
                  }`}>
                    {vaccine.priority}
                  </span>
                  <button className="px-3 py-1.5 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-medium hover:bg-purple-500/20 transition-all">
                    Schedule
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Vaccine Detail Modal */}
        <AnimatePresence>
          {selectedVaccine && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedVaccine(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-lg p-6 rounded-2xl bg-[#0a0a10] border border-white/[0.08]"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold text-xl">{selectedVaccine.name}</h3>
                  <button
                    onClick={() => setSelectedVaccine(null)}
                    className="p-2 rounded-lg bg-white/[0.03] text-white/40 hover:text-white/70 transition-all"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Dose</label>
                      <p className="text-white text-sm">{selectedVaccine.dose}</p>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Date</label>
                      <p className="text-white text-sm">{selectedVaccine.date}</p>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Administered By</label>
                      <p className="text-white text-sm">{selectedVaccine.administeredBy}</p>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs mb-1 block">Location</label>
                      <p className="text-white text-sm">{selectedVaccine.location}</p>
                    </div>
                  </div>

                  <div>
                    <label className="text-white/40 text-xs mb-2 block">Protection Against</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedVaccine.protection.map((item, i) => (
                        <span key={i} className="px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-medium border border-purple-500/20">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedVaccine.certificateUrl && (
                    <button className="w-full py-3 rounded-xl bg-emerald-500/10 text-emerald-400 font-medium text-sm hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2">
                      <Download className="w-4 h-4" />
                      Download Certificate
                    </button>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClientVaccineTracking;