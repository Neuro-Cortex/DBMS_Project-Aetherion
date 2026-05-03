// src/pages/Hospitals.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Building2, X, SlidersHorizontal, Grid, List, RefreshCw
} from 'lucide-react';
import { HospitalCard } from '@/pages/HospitalCard';
import { BedAvailability } from 'src/pages/BedAvailability';
import { Modal } from '@/components/ui/Modal';
import { hospitalsData } from 'src/data/hospital';
import type { Hospital } from '@/types/hospital';

// ============================================
// MOCK BEDS DATA (for modal)
// ============================================
import { Heart, Zap, Activity, Users, Bed } from 'lucide-react';

const mockBedsData = [
  { id: 'icu', type: 'Intensive Care Unit', icon: Heart, total: 50, occupied: 45, available: 5, price: 2500, features: ['Ventilator', 'Cardiac Monitor', '24/7 Specialist'], color: 'from-red-500 to-rose-600', priority: 'critical' as const },
  { id: 'emergency', type: 'Emergency Ward', icon: Zap, total: 30, occupied: 22, available: 8, price: 1800, features: ['Trauma Care', 'Rapid Response'], color: 'from-orange-500 to-amber-600', priority: 'critical' as const },
  { id: 'cardiac', type: 'Cardiac Care', icon: Activity, total: 25, occupied: 18, available: 7, price: 2000, features: ['ECG', 'Echo Lab', 'Cardiologist'], color: 'from-pink-500 to-rose-600', priority: 'high' as const },
  { id: 'maternity', type: 'Maternity Ward', icon: Users, total: 20, occupied: 14, available: 6, price: 1500, features: ['Delivery Suite', 'NICU', 'Family Room'], color: 'from-purple-500 to-violet-600', priority: 'high' as const },
  { id: 'general', type: 'General Ward', icon: Bed, total: 150, occupied: 110, available: 40, price: 800, features: ['Bathroom', 'TV', 'WiFi'], color: 'from-emerald-500 to-teal-600', priority: 'low' as const },
];

// ============================================
// FILTER INTERFACE
// ============================================
interface FilterState {
  search: string;
  type: string;
  specialty: string;
  city: string;
  emergency: boolean;
  ambulance: boolean;
  sortBy: 'rating' | 'distance' | 'beds';
}

// ============================================
// CONSTANTS
// ============================================
const HOSPITAL_TYPES = ['All', 'General', 'Multispecialty', 'Teaching', 'Community', 'Specialty', 'Clinic', 'Trauma'];
const SPECIALTIES = [
  'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Oncology',
  'Dermatology', 'Gynecology', 'Urology', 'Internal Medicine', 'Family Medicine',
  'Obstetrics', 'Emergency Medicine', 'Transplant', 'Psychiatry'
];
const CITIES = ['All', 'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Miami', 'San Francisco', 'Brooklyn', 'Queens', 'Bronx', 'Staten Island', 'Santa Monica', 'Beverly Hills', 'Long Beach', 'Pasadena', 'Scottsdale', 'Chandler', 'Tempe', 'Mesa', 'Miami Beach', 'Aventura', 'South Miami', 'Coral Gables', 'Stanford'];
const SORT_OPTIONS = [
  { value: 'rating' as const, label: 'Top Rated' },
  { value: 'distance' as const, label: 'Nearest' },
  { value: 'beds' as const, label: 'Most Beds Available' },
];

// ============================================
// MAIN COMPONENT
// ============================================
export const Hospitals: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    type: 'All',
    specialty: '',
    city: 'All',
    emergency: false,
    ambulance: false,
    sortBy: 'rating',
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [showBedModal, setShowBedModal] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // ============================================
  // FILTER & SORT
  // ============================================
  const filteredHospitals = useMemo(() => {
    return hospitalsData.filter(hospital => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = !filters.search ||
        hospital.name.toLowerCase().includes(searchTerm) ||
        (hospital.location?.city || hospital.address?.city || '').toLowerCase().includes(searchTerm) ||
        (hospital.specialties || []).some(s => s.toLowerCase().includes(searchTerm));

      const matchesType = filters.type === 'All' || hospital.type === filters.type.toLowerCase();
      const matchesSpecialty = !filters.specialty || (hospital.specialties || []).includes(filters.specialty);
      const matchesCity = filters.city === 'All' || (hospital.location?.city || hospital.address?.city || '') === filters.city;
      const matchesEmergency = !filters.emergency || !!(hospital.emergency ?? hospital.emergencyAvailable);
      const matchesAmbulance = !filters.ambulance || !!(hospital.ambulance ?? hospital.ambulanceAvailable);

      return matchesSearch && matchesType && matchesSpecialty && matchesCity && matchesEmergency && matchesAmbulance;
    });
  }, [filters]);

  const sortedHospitals = useMemo(() => {
    return [...filteredHospitals].sort((a, b) => {
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      if (filters.sortBy === 'distance') return (a.distance ?? 99) - (b.distance ?? 99);
      const aBeds = Array.isArray(a.beds) ? a.beds.reduce((s, b) => s + b.available, 0) : (a.beds?.available ?? 0);
      const bBeds = Array.isArray(b.beds) ? b.beds.reduce((s, b) => s + b.available, 0) : (b.beds?.available ?? 0);
      return bBeds - aBeds;
    });
  }, [filteredHospitals, filters.sortBy]);

  // ============================================
  // PAGINATION
  // ============================================
  const totalPages = Math.ceil(sortedHospitals.length / itemsPerPage);
  const paginatedHospitals = sortedHospitals.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const updateFilters = useCallback((newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1);
  }, []);

  const handleViewBeds = useCallback((hospital: Hospital) => {
    setSelectedHospital(hospital);
    setShowBedModal(true);
  }, []);

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({ search: '', type: 'All', specialty: '', city: 'All', emergency: false, ambulance: false, sortBy: 'rating' });
    setCurrentPage(1);
  }, []);

  const activeFiltersCount = [filters.type !== 'All', filters.specialty, filters.city !== 'All', filters.emergency, filters.ambulance].filter(Boolean).length;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 text-xs font-medium mb-4">
            <Building2 className="w-3.5 h-3.5" /> Find Healthcare
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-[-0.02em] mb-3">
            Hospitals <span className="text-white/50">Near You</span>
          </h1>
          <p className="text-white/35 text-lg">Discover {hospitalsData.length}+ hospitals with real-time bed availability.</p>
        </motion.div>

        {/* SEARCH & FILTERS */}
        <div className="sticky top-20 z-30 bg-[#050508]/80 backdrop-blur-xl pb-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" />
              <input id="hospital-search" name="hospital-search" type="text" value={filters.search}
                onChange={(e) => updateFilters({ search: e.target.value })}
                placeholder="Search hospitals, specialties, or city..."
                className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:border-white/20 focus:bg-white/[0.05] transition-all"
                autoComplete="off" aria-label="Search hospitals" />
              {filters.search && (
                <button type="button" onClick={() => updateFilters({ search: '' })} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/[0.06] rounded-lg">
                  <X className="w-3.5 h-3.5 text-white/30" /></button>
              )}
            </div>

            {/* Filter Toggle */}
            <button type="button" onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${showFilters || activeFiltersCount > 0 ? 'bg-white/[0.08] text-white border border-white/[0.15]' : 'bg-white/[0.02] text-white/50 border border-white/[0.06] hover:bg-white/[0.04] hover:text-white/70'}`}>
              <SlidersHorizontal className="w-4 h-4" /> Filters
              {activeFiltersCount > 0 && <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-bold flex items-center justify-center">{activeFiltersCount}</span>}
            </button>

            {/* Sort */}
            <select id="hospital-sort" name="hospital-sort" value={filters.sortBy}
              onChange={(e) => updateFilters({ sortBy: e.target.value as any })}
              className="px-4 py-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white/70 text-sm focus:outline-none focus:border-white/20 cursor-pointer">
              {SORT_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-[#1a1a2e] text-white">{opt.label}</option>)}
            </select>

            {/* View Toggle */}
            <div className="hidden sm:flex bg-white/[0.02] rounded-xl border border-white/[0.06] p-1">
              <button type="button" onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/60'}`} aria-label="Grid view"><Grid className="w-4 h-4" /></button>
              <button type="button" onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/60'}`} aria-label="List view"><List className="w-4 h-4" /></button>
            </div>

            {/* Refresh */}
            <button type="button" onClick={handleRefresh} className="p-3 bg-white/[0.02] border border-white/[0.06] rounded-xl text-white/40 hover:text-white/70 transition-all" aria-label="Refresh">
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /></button>
          </div>

          {/* Filters Panel */}
          <AnimatePresence>
            {showFilters && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <div className="mt-3 p-5 bg-white/[0.015] backdrop-blur-sm rounded-xl border border-white/[0.06]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label htmlFor="filter-type" className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Type</label>
                      <select id="filter-type" name="filter-type" value={filters.type} onChange={(e) => updateFilters({ type: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white text-sm">
                        {HOSPITAL_TYPES.map(t => <option key={t} value={t} className="bg-[#1a1a2e]">{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="filter-specialty" className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Specialty</label>
                      <select id="filter-specialty" name="filter-specialty" value={filters.specialty} onChange={(e) => updateFilters({ specialty: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white text-sm">
                        <option value="" className="bg-[#1a1a2e]">All Specialties</option>
                        {SPECIALTIES.map(s => <option key={s} value={s} className="bg-[#1a1a2e]">{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="filter-city" className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">City</label>
                      <select id="filter-city" name="filter-city" value={filters.city} onChange={(e) => updateFilters({ city: e.target.value })}
                        className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-lg text-white text-sm">
                        {CITIES.map(c => <option key={c} value={c} className="bg-[#1a1a2e]">{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Services</label>
                      <label className="flex items-center gap-2.5 cursor-pointer mb-2">
                        <input type="checkbox" checked={filters.emergency} onChange={(e) => updateFilters({ emergency: e.target.checked })} className="w-4 h-4 rounded border-white/15" />
                        <span className="text-white/50 text-sm">Emergency Available</span>
                      </label>
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={filters.ambulance} onChange={(e) => updateFilters({ ambulance: e.target.checked })} className="w-4 h-4 rounded border-white/15" />
                        <span className="text-white/50 text-sm">Ambulance Service</span>
                      </label>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button type="button" onClick={handleClearFilters} className="px-4 py-2 bg-white/[0.03] border border-white/[0.08] rounded-lg text-white/50 text-sm hover:bg-white/[0.06] hover:text-white/80 transition-all">Clear All Filters</button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RESULTS COUNT & PAGINATION */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-white/35 text-sm">
            Showing <span className="text-white/60 font-medium">{paginatedHospitals.length}</span> of <span className="text-white/60 font-medium">{sortedHospitals.length}</span> hospitals
            {filters.search && <> for "<span className="text-white/50">{filters.search}</span>"</>}
          </p>
          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-8 h-8 rounded-lg text-xs text-white/30 hover:text-white/60 disabled:opacity-20 transition-all">‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} type="button" onClick={() => setCurrentPage(page)} className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${currentPage === page ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/60'}`}>{page}</button>
              ))}
              <button type="button" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-8 h-8 rounded-lg text-xs text-white/30 hover:text-white/60 disabled:opacity-20 transition-all">›</button>
            </div>
          )}
        </div>

        {/* HOSPITALS GRID — 20 CARDS PER PAGE */}
        {paginatedHospitals.length > 0 ? (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5' : 'space-y-3'}>
            {paginatedHospitals.map((hospital, index) => (
              <motion.div key={hospital.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (index % itemsPerPage) * 0.03, duration: 0.4 }}>
                <HospitalCard hospital={hospital} onViewBeds={handleViewBeds} variant={viewMode === 'list' ? 'compact' : 'default'} />
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex items-center justify-center"><Building2 className="w-10 h-10 text-white/10" /></div>
            <h3 className="text-xl font-semibold text-white mb-2">No hospitals found</h3>
            <p className="text-white/35 text-sm max-w-md mx-auto mb-6">We couldn't find any hospitals matching your criteria. Try adjusting your filters.</p>
            <button type="button" onClick={handleClearFilters} className="px-5 py-2.5 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/60 text-sm font-medium hover:bg-white/[0.08] hover:text-white transition-all">Clear all filters</button>
          </motion.div>
        )}

        {/* Bottom Pagination */}
        {totalPages > 1 && paginatedHospitals.length > 0 && (
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-1">
              <button type="button" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} className="w-10 h-10 rounded-xl text-white/30 hover:text-white/60 disabled:opacity-20 transition-all text-lg">‹</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button key={page} type="button" onClick={() => setCurrentPage(page)} className={`w-10 h-10 rounded-xl text-sm font-medium transition-all ${currentPage === page ? 'bg-white/[0.08] text-white' : 'text-white/30 hover:text-white/60'}`}>{page}</button>
              ))}
              <button type="button" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="w-10 h-10 rounded-xl text-white/30 hover:text-white/60 disabled:opacity-20 transition-all text-lg">›</button>
            </div>
          </div>
        )}
      </div>

      {/* BED AVAILABILITY MODAL */}
      <Modal isOpen={showBedModal} onClose={() => setShowBedModal(false)} title={`Bed Availability — ${selectedHospital?.name || ''}`} size="lg">
        {selectedHospital && <BedAvailability beds={mockBedsData} hospitalId={selectedHospital.id} hospitalName={selectedHospital.name} realTime />}
      </Modal>
    </div>
  );
};

export default Hospitals;