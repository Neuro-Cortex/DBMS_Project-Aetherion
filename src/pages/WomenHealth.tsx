// src/pages/WomenHealth.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Baby, User, Shield, Heart, Calendar, 
  Stethoscope, Droplet, Activity, Clock,
  Star, MapPin, Phone, Video, MessageCircle,
  TrendingUp, Award, CheckCircle, AlertCircle,
  Plus, Search, Filter, Download, Bell
} from 'lucide-react';
import { PregnancyTracker } from '../components/women/PregnancyTracker';
import { GynecologistCard } from '../components/women/GynecologistCard';
import { VaccineSchedule } from '../components/women/VaccineSchedule';
import { SpecialCare } from '../components/women/SpecialCare';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { GlassmorphicCard } from '../components/ui/GlassmorphicCard';
import { StatCard } from '../components/dashboard/StatCard';

// ============================================
// TYPES
// ============================================

interface Gynecologist {
  id: string;
  name: string;
  image?: string;
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
  recommendedAge: string;
  doses: number;
  completedDoses: number;
  status: 'completed' | 'due' | 'upcoming' | 'overdue';
  nextDueDate: string;
  notes: string;
  isPregnancySafe: boolean;
}

// ============================================
// MOCK DATA
// ============================================

const gynecologistsData: Gynecologist[] = [
  { 
    id: '1', 
    name: 'Dr. Emily Parker', 
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    specializations: ['Obstetrics', 'Gynecology', 'Fertility'], 
    experience: 18, 
    rating: 4.9, 
    reviewCount: 650, 
    hospital: 'Women Care Center', 
    location: 'New York', 
    languages: ['English', 'Spanish'], 
    consultationFee: 150, 
    nextAvailable: 'Today', 
    isOnline: true, 
    isVerified: true, 
    treatsConditions: ['PCOS', 'Pregnancy', 'Fertility', 'Menopause'], 
    degrees: ['MD', 'FRCOG', 'MBBS']
  },
  { 
    id: '2', 
    name: 'Dr. Sarah Johnson', 
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
    specializations: ['Obstetrics', 'High-Risk Pregnancy'], 
    experience: 22, 
    rating: 4.8, 
    reviewCount: 520, 
    hospital: 'Metro Women\'s Hospital', 
    location: 'Los Angeles', 
    languages: ['English'], 
    consultationFee: 200, 
    nextAvailable: 'Tomorrow', 
    isOnline: false, 
    isVerified: true, 
    treatsConditions: ['High-Risk Pregnancy', 'Fertility', 'Endometriosis'], 
    degrees: ['MD', 'FACOG']
  },
  { 
    id: '3', 
    name: 'Dr. Lisa Chen', 
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    specializations: ['Gynecology', 'Adolescent Care'], 
    experience: 12, 
    rating: 4.7, 
    reviewCount: 380, 
    hospital: 'Youth Wellness Center', 
    location: 'Chicago', 
    languages: ['English', 'Mandarin'], 
    consultationFee: 120, 
    nextAvailable: 'Today', 
    isOnline: true, 
    isVerified: true, 
    treatsConditions: ['PCOS', 'Menstrual Disorders', 'Adolescent Care'], 
    degrees: ['MD', 'MPH']
  },
];

const vaccinesData: Vaccine[] = [
  { 
    id: '1', 
    name: 'HPV Vaccine', 
    targetDisease: 'Cervical Cancer', 
    recommendedAge: '11-26 years', 
    doses: 3, 
    completedDoses: 2, 
    status: 'due', 
    nextDueDate: '2024-04-15', 
    notes: 'Prevents HPV infection', 
    isPregnancySafe: false 
  },
  { 
    id: '2', 
    name: 'Tdap', 
    targetDisease: 'Tetanus, Diphtheria, Pertussis', 
    recommendedAge: 'During Pregnancy', 
    doses: 1, 
    completedDoses: 0, 
    status: 'upcoming', 
    nextDueDate: '2024-05-01', 
    notes: 'Recommended during 27-36 weeks', 
    isPregnancySafe: true 
  },
  { 
    id: '3', 
    name: 'Flu Shot', 
    targetDisease: 'Influenza', 
    recommendedAge: 'All ages', 
    doses: 1, 
    completedDoses: 1, 
    status: 'completed', 
    nextDueDate: '2025-10-01', 
    notes: 'Annual vaccination recommended', 
    isPregnancySafe: true 
  },
  { 
    id: '4', 
    name: 'Hepatitis B', 
    targetDisease: 'Hepatitis B', 
    recommendedAge: 'High-risk adults', 
    doses: 3, 
    completedDoses: 1, 
    status: 'upcoming', 
    nextDueDate: '2024-04-20', 
    notes: 'For healthcare workers and high-risk individuals', 
    isPregnancySafe: true 
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const WomenHealth: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tracker');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  const specializations = [...new Set(gynecologistsData.flatMap(d => d.specializations))];

  const filteredGynecologists = gynecologistsData.filter(g => {
    const matchesSearch = g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          g.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || g.specializations.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  const stats = [
    { title: 'Pregnancy Week', value: '24', icon: Baby, color: 'pink', trend: '+2' },
    { title: 'Upcoming Vaccines', value: vaccinesData.filter(v => v.status === 'upcoming' || v.status === 'due').length, icon: Shield, color: 'cyan', trend: '+1' },
    { title: 'Gynecologists', value: gynecologistsData.length, icon: User, color: 'purple', trend: '+5' },
    { title: 'Health Score', value: '92%', icon: Heart, color: 'red', trend: '+8%' },
  ];

  const getVaccineStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'due': return 'bg-red-500/20 text-red-400';
      case 'upcoming': return 'bg-yellow-500/20 text-yellow-400';
      case 'overdue': return 'bg-orange-500/20 text-orange-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-pink-500/20 rounded-xl flex items-center justify-center">
                <Heart className="w-5 h-5 text-pink-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Women's Health</h1>
              <Badge variant="gradient" size="sm">Complete Care</Badge>
            </div>
            <p className="text-white/60">Comprehensive healthcare for women of all ages</p>
          </div>
          <div className="flex gap-3">
            <Button variant="glass" size="sm" icon={Bell}>
              Reminders
            </Button>
            <Button variant="gradient" size="sm" icon={Plus}>
              Add Record
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              variant="neon"
              color={stat.color as any}
              trend={{ value: parseInt(stat.trend), isPositive: true }}
            />
          ))}
        </div>

        {/* Health Tip Banner */}
        <GlassmorphicCard variant="glass" className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
              <Activity className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-white text-sm">💡 Health Tip</p>
              <p className="text-white/60 text-xs">Regular prenatal checkups are essential for a healthy pregnancy. Schedule your next appointment today!</p>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 p-1 bg-white/10 rounded-xl w-fit">
          {[
            { id: 'tracker', label: 'Pregnancy Tracker', icon: Baby, color: 'pink' },
            { id: 'gyno', label: 'Gynecologists', icon: User, color: 'purple' },
            { id: 'vaccine', label: 'Vaccine Schedule', icon: Shield, color: 'cyan' },
            { id: 'care', label: 'Special Care', icon: Heart, color: 'red' },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  activeTab === tab.id 
                    ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color === 'pink' ? 'rose' : tab.color === 'purple' ? 'indigo' : tab.color === 'cyan' ? 'blue' : 'orange'}-500 text-white shadow-lg` 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'tracker' && (
            <motion.div
              key="tracker"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PregnancyTracker dueDate="2024-09-15" />
            </motion.div>
          )}

          {activeTab === 'gyno' && (
            <motion.div
              key="gyno"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Search and Filters */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search by name or location..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-white/10 rounded-lg text-white/70 hover:bg-white/20 transition flex items-center gap-2"
                >
                  <Filter className="w-4 h-4" />
                  Filter
                </button>
              </div>

              {/* Filters Panel */}
              <AnimatePresence>
                {showFilters && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <GlassmorphicCard variant="glass" className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-white/70 text-sm mb-2 block">Specialization</label>
                          <select
                            value={selectedSpecialty}
                            onChange={(e) => setSelectedSpecialty(e.target.value)}
                            className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                          >
                            <option value="">All Specializations</option>
                            {specializations.map(spec => (
                              <option key={spec} value={spec}>{spec}</option>
                            ))}
                          </select>
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="glass"
                            size="sm"
                            fullWidth
                            onClick={() => {
                              setSelectedSpecialty('');
                              setSearchQuery('');
                            }}
                          >
                            Clear Filters
                          </Button>
                        </div>
                      </div>
                    </GlassmorphicCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results Count */}
              <div className="flex justify-between items-center">
                <p className="text-white/60">
                  Found <span className="text-cyan-400 font-semibold">{filteredGynecologists.length}</span> gynecologists
                </p>
              </div>

              {/* Gynecologists Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGynecologists.map((doctor, index) => (
                  <motion.div
                    key={doctor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GynecologistCard doctor={doctor} />
                  </motion.div>
                ))}
              </div>

              {/* Empty State */}
              {filteredGynecologists.length === 0 && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                    <User className="w-10 h-10 text-white/30" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">No gynecologists found</h3>
                  <p className="text-white/60">Try adjusting your search or filters</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'vaccine' && (
            <motion.div
              key="vaccine"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <VaccineSchedule vaccines={vaccinesData} />
              
              {/* Vaccination Summary */}
              <GlassmorphicCard variant="glass" className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Vaccination Summary</h3>
                <div className="space-y-3">
                  {vaccinesData.map((vaccine, i) => (
                    <div key={vaccine.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-medium">{vaccine.name}</p>
                        <p className="text-white/40 text-xs">{vaccine.targetDisease}</p>
                      </div>
                      <div className="text-right">
                        <Badge className={getVaccineStatusColor(vaccine.status)} size="xs">
                          {vaccine.status}
                        </Badge>
                        <p className="text-white/40 text-xs mt-1">{vaccine.completedDoses}/{vaccine.doses} doses</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {activeTab === 'care' && (
            <motion.div
              key="care"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <SpecialCare />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WomenHealth;