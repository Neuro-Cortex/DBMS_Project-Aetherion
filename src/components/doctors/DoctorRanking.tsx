import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star,
  TrendingUp,
  Filter,
  SortAsc,
  DollarSign,
  MapPin,
  Award,
  Users,
  Calendar,
  ChevronDown,
  ChevronUp,
  Search,
  Heart,
  Shield
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { DoctorCard } from './DoctorCard';
import { Avatar } from '../../ui/Avatar';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface DoctorRankingProps {
  doctors: Doctor[];
  variant?: 'glass' | 'gradient' | 'neon';
  filters?: {
    specialties: string[];
    locations: string[];
    priceRanges: { min: number; max: number }[];
  };
  onDoctorSelect?: (doctor: Doctor) => void;
  className?: string;
}

export interface RankingFilters {
  specialty?: string;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  availableToday?: boolean;
  verifiedOnly?: boolean;
}

// ============================================
// DOCTOR RANKING COMPONENT
// ============================================
export const DoctorRanking: React.FC<DoctorRankingProps> = ({
  doctors: initialDoctors,
  variant = 'glass',
  filters,
  onDoctorSelect,
  className,
}) => {
  const [doctors] = useState(initialDoctors);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'experience' | 'price' | 'reviews'>('rating');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<RankingFilters>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  // Apply filters and sorting
  const filteredAndSortedDoctors = useMemo(() => {
    let filtered = doctors.filter(doctor => {
      // Search query
      if (searchQuery && !doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Specialty filter
      if (activeFilters.specialty && doctor.specialty !== activeFilters.specialty) {
        return false;
      }

      // Location filter
      if (activeFilters.location && !doctor.location.toLowerCase().includes(activeFilters.location.toLowerCase())) {
        return false;
      }

      // Price filter
      if (activeFilters.minPrice && doctor.price < activeFilters.minPrice) {
        return false;
      }
      if (activeFilters.maxPrice && doctor.price > activeFilters.maxPrice) {
        return false;
      }

      // Rating filter
      if (activeFilters.minRating && doctor.rating < activeFilters.minRating) {
        return false;
      }

      // Verified filter
      if (activeFilters.verifiedOnly && !doctor.verified) {
        return false;
      }

      return true;
    });

    // Sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'experience':
          comparison = a.experience - b.experience;
          break;
        case 'price':
          comparison = a.price - b.price;
          break;
        case 'reviews':
          comparison = a.reviewCount - b.reviewCount;
          break;
      }
      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [doctors, searchQuery, activeFilters, sortBy, sortOrder]);

  // Ranking calculation
  const doctorsWithRank = useMemo(() => {
    return filteredAndSortedDoctors.map((doctor, index) => ({
      ...doctor,
      rank: index + 1,
      score: calculateScore(doctor),
    }));
  }, [filteredAndSortedDoctors]);

  function calculateScore(doctor: Doctor) {
    return (
      doctor.rating * 40 +
      doctor.experience * 2 +
      Math.min(doctor.reviewCount / 10, 20) +
      (doctor.verified ? 10 : 0) +
      (doctor.premium ? 5 : 0)
    );
  }

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const clearFilters = () => {
    setActiveFilters({});
    setSearchQuery('');
  };

  return (
    <motion.div
      className={twMerge(
        clsx(
          'space-y-6',
          className
        )
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Doctor Rankings</h2>
          <p className="text-white/60">
            Find the best doctor based on ratings, experience, and patient reviews
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode */}
          <div className="flex items-center gap-1 p-1 bg-white/10 rounded-xl">
            <Button
              variant={viewMode === 'list' ? 'glass' : 'ghost'}
              size="sm"
              iconOnly
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'glass' : 'ghost'}
              size="sm"
              iconOnly
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
          </div>

          {/* Sort Options */}
          <div className="flex items-center gap-2">
            <Button
              variant="glassmorphic"
              size="sm"
              leftIcon={SortAsc}
              onClick={() => handleSort('rating')}
              className={sortBy === 'rating' ? 'bg-white/20' : ''}
            >
              Rating {sortBy === 'rating' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
            <Button
              variant="glassmorphic"
              size="sm"
              onClick={() => handleSort('price')}
              className={sortBy === 'price' ? 'bg-white/20' : ''}
            >
              Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
            </Button>
          </div>

          {/* Filters Toggle */}
          <Button
            variant="neon"
            size="sm"
            leftIcon={Filter}
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={Object.keys(activeFilters).length > 0 ? 'shadow-lg shadow-cyan-500/30' : ''}
          >
            Filters {Object.keys(activeFilters).length > 0 && `(${Object.keys(activeFilters).length})`}
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <GlassmorphicCard variant={variant} className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <Input
            variant="glass"
            size="sm"
            placeholder="Search doctors by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={Search}
            className="flex-1"
          />

          {/* Filters Panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="w-full lg:w-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {/* Specialty Filter */}
                  <select
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white"
                    value={activeFilters.specialty || ''}
                    onChange={(e) => setActiveFilters(prev => ({ ...prev, specialty: e.target.value || undefined }))}
                  >
                    <option value="">All Specialties</option>
                    {filters?.specialties.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>

                  {/* Location Filter */}
                  <Input
                    variant="glass"
                    size="sm"
                    placeholder="Location"
                    value={activeFilters.location || ''}
                    onChange={(e) => setActiveFilters(prev => ({ ...prev, location: e.target.value || undefined }))}
                    leftIcon={MapPin}
                  />

                  {/* Price Range */}
                  <Input
                    variant="glass"
                    size="sm"
                    type="number"
                    placeholder="Min Price"
                    value={activeFilters.minPrice || ''}
                    onChange={(e) => setActiveFilters(prev => ({ ...prev, minPrice: e.target.value ? Number(e.target.value) : undefined }))}
                    leftIcon={DollarSign}
                  />

                  {/* Rating Filter */}
                  <select
                    className="px-3 py-2 bg-white/10 border border-white/20 rounded-xl text-white"
                    value={activeFilters.minRating || ''}
                    onChange={(e) => setActiveFilters(prev => ({ ...prev, minRating: e.target.value ? Number(e.target.value) : undefined }))}
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="5">5 Stars</option>
                  </select>
                </div>

                {/* Filter Actions */}
                <div className="flex items-center justify-between mt-4">
                  <label className="flex items-center gap-2 text-white/80">
                    <input
                      type="checkbox"
                      checked={activeFilters.verifiedOnly || false}
                      onChange={(e) => setActiveFilters(prev => ({ ...prev, verifiedOnly: e.target.checked }))}
                      className="w-4 h-4 text-cyan-500 bg-transparent border-white/20 rounded focus:ring-cyan-500"
                    />
                    Verified Only
                  </label>
                  <Button
                    variant="danger"
                    size="xs"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Results Count */}
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-sm text-white/60">
            Showing {doctorsWithRank.length} of {doctors.length} doctors
            {Object.keys(activeFilters).length > 0 && ' (filtered)'}
          </p>
        </div>
      </GlassmorphicCard>

      {/* Doctors List/Grid */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {doctorsWithRank.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                whileHover={{ scale: 1.01 }}
              >
                <GlassmorphicCard
                  variant={variant}
                  className="p-4 hover:shadow-2xl transition-all"
                >
                  <div className="flex items-start gap-4">
                    {/* Rank */}
                    <motion.div
                      className="flex-shrink-0"
                      whileHover={{ scale: 1.1 }}
                    >
                      <div className={clsx(
                        'w-12 h-12 rounded-full flex items-center justify-center font-black text-lg',
                        index < 3
                          ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900'
                          : 'bg-gradient-to-br from-gray-600 to-gray-800 text-white'
                      )}>
                        {doctor.rank}
                      </div>
                    </motion.div>

                    {/* Doctor Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <Avatar name={doctor.name} size="md" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-bold text-white truncate">{doctor.name}</h3>
                              {doctor.verified && (
                                <Shield className="w-4 h-4 text-cyan-400" />
                              )}
                              {doctor.premium && (
                                <Badge variant="gradient" size="xs">
                                  PRO
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-white/70">{doctor.specialty}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              <span className="text-sm font-bold text-white">{doctor.rating}</span>
                              <span className="text-xs text-white/60">({doctor.reviewCount} reviews)</span>
                            </div>
                          </div>
                        </div>

                        {/* Score */}
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          className="text-right"
                        >
                          <p className="text-2xl font-black text-white">{doctor.score.toFixed(0)}</p>
                          <p className="text-xs text-white/60">Score</p>
                        </motion.div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <Award className="w-4 h-4" />
                          {doctor.experience} years
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <MapPin className="w-4 h-4" />
                          {doctor.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <DollarSign className="w-4 h-4" />
                          ${doctor.price}/visit
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <Users className="w-4 h-4" />
                          {doctor.reviewCount} reviews
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant="success" 
                            size="xs"
                            className={doctor.availableSlots > 0 ? 'animate-pulse' : ''}
                          >
                            {doctor.availableSlots} slots available
                          </Badge>
                          {doctor.nextAvailable && (
                            <span className="text-xs text-white/60">
                              Next: {doctor.nextAvailable}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="glassmorphic"
                            size="sm"
                            onClick={() => onDoctorSelect?.(doctor)}
                          >
                            View Profile
                          </Button>
                          <Button
                            variant="gradient"
                            size="sm"
                            onClick={() => {
                              // Book appointment
                            }}
                          >
                            Book Now
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {doctorsWithRank.map((doctor, index) => (
              <motion.div
                key={doctor.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
              >
                <DoctorCard
                  doctor={doctor}
                  variant={variant}
                  compact={true}
                  showStats={false}
                  onViewProfile={() => onDoctorSelect?.(doctor)}
                  className="h-full"
                />
                {/* Rank Badge */}
                <motion.div
                  className="absolute -top-2 -left-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                >
                  <div className={clsx(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-black',
                    index < 3
                      ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-gray-900'
                      : 'bg-gradient-to-br from-gray-600 to-gray-800 text-white'
                  )}>
                    {doctor.rank}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* No Results */}
      <AnimatePresence>
        {doctorsWithRank.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <Search className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No doctors found</h3>
            <p className="text-white/60 mb-4">Try adjusting your filters or search query</p>
            <Button variant="gradient" onClick={clearFilters}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};