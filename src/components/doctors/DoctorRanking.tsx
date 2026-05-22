// src/components/doctor/DoctorRanking.tsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, TrendingUp, Filter, ArrowUpDown, DollarSign, MapPin,
  Award, Users, Search, Shield, List, Grid, X
} from 'lucide-react';
import { DoctorCard } from 'src/components/doctors/DoctorCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// ============================================
// TYPES
// ============================================
export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  experience: number;
  price: number;
  location: string;
  hospital: string;
  availableSlots: number;
  nextAvailable: string;
  verified: boolean;
  premium?: boolean;
  languages: string[];
  services: string[];
  education: string[];
  achievements: string[];
}

export interface DoctorRankingProps {
  doctors?: Doctor[];
  filters?: {
    specialties: string[];
    locations: string[];
    priceRanges: { min: number; max: number }[];
  };
  onDoctorSelect?: (doctor: Doctor) => void;
  className?: string;
}

interface RankingFilters {
  specialty?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  verifiedOnly?: boolean;
}

// ============================================
// HELPERS
// ============================================
function calculateScore(doctor: Doctor): number {
  return (
    doctor.rating * 40 +
    doctor.experience * 2 +
    Math.min(doctor.reviewCount / 10, 20) +
    (doctor.verified ? 10 : 0) +
    (doctor.premium ? 5 : 0)
  );
}

// ============================================
// MAIN COMPONENT
// ============================================
export const DoctorRanking: React.FC<DoctorRankingProps> = ({
  doctors: initialDoctors = [],
  filters: filterOptions,
  onDoctorSelect,
  className = '',
}) => {
  const [doctors] = useState<Doctor[]>(initialDoctors);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price' | 'reviews'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<RankingFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Get unique specialties from doctors
  const specialties = useMemo(() => {
    return [...new Set(doctors.map(d => d.specialty))];
  }, [doctors]);

  // Filter and sort
  const filteredAndSortedDoctors = useMemo(() => {
    let filtered = doctors.filter(doctor => {
      if (searchQuery && !doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (activeFilters.specialty && doctor.specialty !== activeFilters.specialty) return false;
      if (activeFilters.location && !doctor.location.toLowerCase().includes(activeFilters.location.toLowerCase())) return false;
      if (activeFilters.minPrice && doctor.price < activeFilters.minPrice) return false;
      if (activeFilters.maxPrice && doctor.price > activeFilters.maxPrice) return false;
      if (activeFilters.minRating && doctor.rating < activeFilters.minRating) return false;
      if (activeFilters.verifiedOnly && !doctor.verified) return false;
      return true;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'rating': comparison = a.rating - b.rating; break;
        case 'experience': comparison = a.experience - b.experience; break;
        case 'price': comparison = a.price - b.price; break;
        case 'reviews': comparison = a.reviewCount - b.reviewCount; break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [doctors, searchQuery, activeFilters, sortBy, sortOrder]);

  const doctorsWithRank = useMemo(() => {
    return filteredAndSortedDoctors.map((doctor, index) => ({
      ...doctor,
      rank: index + 1,
      score: calculateScore(doctor),
    }));
  }, [filteredAndSortedDoctors]);

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    else { setSortBy(field); setSortOrder('desc'); }
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  const activeFilterCount = Object.values(activeFilters).filter(v => v !== undefined && v !== false).length;

  return (
    <div className={`space-y-6 ${className}`}>

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em]">Doctor Rankings</h2>
          <p className="text-white/35 text-sm mt-1">Find the best doctors based on ratings & experience</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 border border-white/[0.06]">
            <button type="button" onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/60'}`}>
              <List className="w-4 h-4" /></button>
            <button type="button" onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/60'}`}>
              <Grid className="w-4 h-4" /></button>
          </div>
          <Button variant="glass" size="sm" onClick={() => handleSort('rating')} className="gap-1.5">
            <Star className="w-3.5 h-3.5" /> Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
          <Button variant="glass" size="sm" onClick={() => handleSort('price')} className="gap-1.5">
            <DollarSign className="w-3.5 h-3.5" /> Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
          </Button>
          <Button variant="glass" size="sm" onClick={() => setFiltersOpen(!filtersOpen)} className="gap-1.5">
            <Filter className="w-3.5 h-3.5" /> Filters
            {activeFilterCount > 0 && <span className="w-4 h-4 rounded-full bg-indigo-500 text-white text-[9px] flex items-center justify-center">{activeFilterCount}</span>}
          </Button>
        </div>
      </motion.div>

      {/* SEARCH + FILTERS */}
      <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-4 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctors by name or specialty..."
              className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/15 transition-all" />
            {searchQuery && <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1"><X className="w-3.5 h-3.5 text-white/30" /></button>}
          </div>
        </div>

        <AnimatePresence>
          {filtersOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-white/[0.04]">
                <div>
                  <label className="text-white/40 text-[10px] font-medium uppercase tracking-wider mb-1.5 block">Specialty</label>
                  <select value={activeFilters.specialty || ''} onChange={(e) => setActiveFilters(prev => ({ ...prev, specialty: e.target.value || undefined }))}
                    className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white/70 text-xs focus:outline-none cursor-pointer">
                    <option value="" className="bg-[#1a1a2e]">All Specialties</option>
                    {specialties.map(spec => <option key={spec} value={spec} className="bg-[#1a1a2e]">{spec}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-white/40 text-[10px] font-medium uppercase tracking-wider mb-1.5 block">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25 pointer-events-none" />
                    <input type="text" value={activeFilters.location || ''} onChange={(e) => setActiveFilters(prev => ({ ...prev, location: e.target.value || undefined }))}
                      placeholder="Location" className="w-full pl-8 pr-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white/70 text-xs focus:outline-none focus:border-white/15" />
                  </div>
                </div>
                <div>
                  <label className="text-white/40 text-[10px] font-medium uppercase tracking-wider mb-1.5 block">Min Rating</label>
                  <select value={activeFilters.minRating || ''} onChange={(e) => setActiveFilters(prev => ({ ...prev, minRating: e.target.value ? Number(e.target.value) : undefined }))}
                    className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white/70 text-xs focus:outline-none cursor-pointer">
                    <option value="" className="bg-[#1a1a2e]">Any Rating</option>
                    <option value="4" className="bg-[#1a1a2e]">4+ Stars</option>
                    <option value="4.5" className="bg-[#1a1a2e]">4.5+ Stars</option>
                    <option value="5" className="bg-[#1a1a2e]">5 Stars</option>
                  </select>
                </div>
                <div className="flex items-end gap-2">
                  <label className="flex items-center gap-2 cursor-pointer flex-1 py-2">
                    <input type="checkbox" checked={activeFilters.verifiedOnly || false} onChange={(e) => setActiveFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                      className="w-4 h-4 rounded border-white/15 bg-white/[0.03] text-indigo-500" />
                    <span className="text-white/50 text-xs">Verified Only</span>
                  </label>
                  <button type="button" onClick={clearFilters} className="px-3 py-2 text-white/40 text-xs hover:text-white/70 transition-colors">Clear</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="pt-3 border-t border-white/[0.04] flex justify-between text-xs text-white/30">
          <span>Showing {doctorsWithRank.length} of {doctors.length} doctors</span>
          <span>Sorted by: {sortBy} ({sortOrder})</span>
        </div>
      </div>

      {/* DOCTORS LIST */}
      {doctorsWithRank.length > 0 ? (
        viewMode === 'list' ? (
          <div className="space-y-3">
            {doctorsWithRank.map((doctor, index) => (
              <motion.div key={doctor.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04 }}
                whileHover={{ y: -2 }} onClick={() => onDoctorSelect?.(doctor)}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.015] border border-white/[0.06] cursor-pointer hover:border-white/[0.12] transition-all">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${index < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-white/[0.04] text-white/50'}`}>
                  {doctor.rank}
                </div>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {doctor.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-sm font-medium truncate">{doctor.name}</p>
                    {doctor.verified && <Shield className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                    {doctor.premium && <Badge variant="warning" size="xs">PRO</Badge>}
                  </div>
                  <p className="text-white/35 text-xs truncate">{doctor.specialty} • {doctor.location}</p>
                </div>
                <div className="flex items-center gap-3 text-xs shrink-0">
                  <span className="flex items-center gap-1 text-amber-400"><Star className="w-3.5 h-3.5 fill-amber-400" />{doctor.rating}</span>
                  <span className="text-white/25">|</span>
                  <span className="text-white/50">{doctor.experience}y</span>
                  <span className="text-white/25">|</span>
                  <span className="text-emerald-400 font-bold">${doctor.price}</span>
                  <span className="text-white/25">|</span>
                  <span className="text-white/50 font-bold">{doctor.score.toFixed(0)} pts</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {doctorsWithRank.map((doctor, index) => (
              <div key={doctor.id} className="relative">
                <div className={`absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${index < 3 ? 'bg-gradient-to-br from-amber-400 to-orange-500 text-white' : 'bg-white/[0.08] text-white/50'}`}>
                  {doctor.rank}
                </div>
                <DoctorCard doctor={doctor} variant="default" showStats={false} onViewProfile={() => onDoctorSelect?.(doctor)} />
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="text-center py-20">
          <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No doctors found</h3>
          <p className="text-white/35 text-sm mb-6">Try adjusting your filters.</p>
          <Button variant="glass" size="sm" onClick={clearFilters}>Clear Filters</Button>
        </div>
      )}
    </div>
  );
};

export default DoctorRanking;