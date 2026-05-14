// src/components/client/DoctorSearch.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Star, MapPin, Clock, Filter,
  Stethoscope, DollarSign, ChevronRight
} from 'lucide-react';
import { Doctor } from '../../types/client';

interface DoctorSearchProps {
  doctors: Doctor[];
  onBook: (doctor: Doctor) => void;
}

const DoctorSearch: React.FC<DoctorSearchProps> = ({ doctors, onBook }) => {
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('all');
  const [sortBy, setSortBy] = useState<'rating' | 'fee' | 'experience'>('rating');

  const specialties = ['all', ...new Set(doctors.map(d => d.specialty))];

  const filteredDoctors = doctors
    .filter(d => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialty.toLowerCase().includes(search.toLowerCase());
      const matchSpecialty = specialty === 'all' || d.specialty === specialty;
      return matchSearch && matchSpecialty;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'fee') return a.consultationFee - b.consultationFee;
      return b.experience - a.experience;
    });

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search doctors by name or specialty..."
          className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/20 outline-none focus:border-cyan-400/50 transition-all"
        />
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        {specialties.map(spec => (
          <motion.button
            key={spec}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSpecialty(spec)}
            className={`px-4 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              specialty === spec
                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                : 'bg-white/[0.02] text-white/40 border border-white/[0.04] hover:text-white/60'
            }`}
          >
            {spec === 'all' ? 'All' : spec}
          </motion.button>
        ))}
      </div>

      {/* Sort */}
      <div className="flex gap-2">
        {(['rating', 'fee', 'experience'] as const).map(sort => (
          <button
            key={sort}
            onClick={() => setSortBy(sort)}
            className={`px-3 py-1.5 rounded-md text-[10px] font-medium transition-all ${
              sortBy === sort
                ? 'bg-white/[0.05] text-white/70'
                : 'text-white/30 hover:text-white/50'
            }`}
          >
            {sort === 'rating' ? '⭐ Rating' : sort === 'fee' ? '💰 Fee' : '📚 Experience'}
          </button>
        ))}
      </div>

      {/* Doctor List */}
      <AnimatePresence>
        <div className="space-y-3">
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-cyan-500/20 transition-all cursor-pointer group"
              onClick={() => onBook(doctor)}
            >
              <div className="flex items-center gap-4">
                <img
                  src={doctor.avatar || `https://ui-avatars.com/api/?name=${doctor.name}&background=06b6d4&color=fff`}
                  alt={doctor.name}
                  className="w-14 h-14 rounded-xl object-cover border border-white/[0.08]"
                />
                <div className="flex-1">
                  <h4 className="text-white font-medium text-sm">{doctor.name}</h4>
                  <p className="text-cyan-400 text-xs">{doctor.specialty}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-white/50 text-xs">{doctor.rating}</span>
                      <span className="text-white/20 text-xs">({doctor.reviewCount})</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3 text-emerald-400" />
                      <span className="text-white/50 text-xs">${doctor.consultationFee}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-medium ${
                    doctor.availability === 'available'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : doctor.availability === 'busy'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-slate-500/10 text-slate-400'
                  }`}>
                    {doctor.availability}
                  </span>
                  {doctor.distance && (
                    <div className="flex items-center gap-1 mt-2 justify-end">
                      <MapPin className="w-3 h-3 text-white/30" />
                      <span className="text-white/30 text-xs">{doctor.distance}km</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
};

export default DoctorSearch;