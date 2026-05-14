// src/components/client/BloodDonorSearch.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Phone, Filter, Droplets,
  Star, Award, CheckCircle2, Clock, Navigation2,
  ChevronRight, Heart, AlertCircle, X
} from 'lucide-react';

interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: string;
  age: number;
  gender: 'male' | 'female';
  distance: number;
  address: string;
  phone: string;
  lastDonation: string;
  donationCount: number;
  isAvailable: boolean;
  nextAvailable: string;
  avatar: string;
  verified: boolean;
  responseTime: string;
  rating: number;
}

interface BloodDonorSearchProps {
  onSelectDonor?: (donor: BloodDonor) => void;
  onRequestBlood?: (donor: BloodDonor) => void;
}

const mockDonors: BloodDonor[] = [
  {
    id: '1',
    name: 'Alex Thompson',
    bloodGroup: 'O+',
    age: 28,
    gender: 'male',
    distance: 0.8,
    address: '123 Healthcare Ave, Medical District',
    phone: '+1 (555) 234-5678',
    lastDonation: '2024-10-15',
    donationCount: 12,
    isAvailable: true,
    nextAvailable: 'Immediate',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    verified: true,
    responseTime: '5 mins',
    rating: 4.9,
  },
  {
    id: '2',
    name: 'Maria Garcia',
    bloodGroup: 'O+',
    age: 25,
    gender: 'female',
    distance: 1.5,
    address: '456 Medical Park, Downtown',
    phone: '+1 (555) 345-6789',
    lastDonation: '2024-11-01',
    donationCount: 8,
    isAvailable: true,
    nextAvailable: 'Immediate',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    verified: true,
    responseTime: '10 mins',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'David Kim',
    bloodGroup: 'O-',
    age: 30,
    gender: 'male',
    distance: 2.1,
    address: '789 Health Blvd, West Side',
    phone: '+1 (555) 456-7890',
    lastDonation: '2024-09-20',
    donationCount: 15,
    isAvailable: true,
    nextAvailable: 'Immediate',
    avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
    verified: true,
    responseTime: '8 mins',
    rating: 5.0,
  },
  {
    id: '4',
    name: 'Sarah Williams',
    bloodGroup: 'A+',
    age: 27,
    gender: 'female',
    distance: 2.8,
    address: '321 Care Street, North Side',
    phone: '+1 (555) 567-8901',
    lastDonation: '2024-10-28',
    donationCount: 6,
    isAvailable: false,
    nextAvailable: '2024-12-28',
    avatar: 'https://randomuser.me/api/portraits/women/33.jpg',
    verified: true,
    responseTime: '15 mins',
    rating: 4.7,
  },
  {
    id: '5',
    name: 'James Wilson',
    bloodGroup: 'O+',
    age: 35,
    gender: 'male',
    distance: 3.2,
    address: '654 Hospital Road, East End',
    phone: '+1 (555) 678-9012',
    lastDonation: '2024-11-05',
    donationCount: 20,
    isAvailable: true,
    nextAvailable: 'Immediate',
    avatar: 'https://randomuser.me/api/portraits/men/15.jpg',
    verified: true,
    responseTime: '12 mins',
    rating: 4.9,
  },
  {
    id: '6',
    name: 'Emily Chen',
    bloodGroup: 'B+',
    age: 23,
    gender: 'female',
    distance: 4.0,
    address: '987 Medical Lane, South District',
    phone: '+1 (555) 789-0123',
    lastDonation: '2024-10-10',
    donationCount: 4,
    isAvailable: true,
    nextAvailable: 'Immediate',
    avatar: 'https://randomuser.me/api/portraits/women/21.jpg',
    verified: false,
    responseTime: '20 mins',
    rating: 4.5,
  },
  {
    id: '7',
    name: 'Robert Martinez',
    bloodGroup: 'AB+',
    age: 32,
    gender: 'male',
    distance: 5.5,
    address: '456 Wellness Ave, Green Zone',
    phone: '+1 (555) 890-1234',
    lastDonation: '2024-09-15',
    donationCount: 10,
    isAvailable: true,
    nextAvailable: 'Immediate',
    avatar: 'https://randomuser.me/api/portraits/men/42.jpg',
    verified: true,
    responseTime: '18 mins',
    rating: 4.6,
  },
  {
    id: '8',
    name: 'Lisa Anderson',
    bloodGroup: 'O-',
    age: 29,
    gender: 'female',
    distance: 6.1,
    address: '789 Health Street, Riverside',
    phone: '+1 (555) 901-2345',
    lastDonation: '2024-11-10',
    donationCount: 7,
    isAvailable: true,
    nextAvailable: 'Immediate',
    avatar: 'https://randomuser.me/api/portraits/women/55.jpg',
    verified: true,
    responseTime: '25 mins',
    rating: 4.8,
  },
];

const bloodGroups = ['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const BloodDonorSearch: React.FC<BloodDonorSearchProps> = ({ onSelectDonor, onRequestBlood }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All');
  const [selectedDonor, setSelectedDonor] = useState<BloodDonor | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'donations'>('distance');
  const [showFilters, setShowFilters] = useState(false);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(true);
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);

  const filteredDonors = mockDonors
    .filter(d => {
      const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBlood = bloodGroupFilter === 'All' || d.bloodGroup === bloodGroupFilter;
      const matchAvailable = showOnlyAvailable ? d.isAvailable : true;
      const matchVerified = showOnlyVerified ? d.verified : true;
      return matchSearch && matchBlood && matchAvailable && matchVerified;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.donationCount - a.donationCount;
    });

  const handleRequestBlood = (donor: BloodDonor) => {
    if (onRequestBlood) {
      onRequestBlood(donor);
    } else {
      alert(`Blood request sent to ${donor.name} (${donor.bloodGroup})`);
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleNavigate = (address: string) => {
    window.open(`https://maps.google.com/?q=${encodeURIComponent(address)}`);
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, blood group, or location..."
          className="w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/20 outline-none focus:border-red-400/50 transition-all"
        />
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg transition-all ${
            showFilters ? 'bg-red-500/20 text-red-400' : 'text-white/30 hover:text-white/60'
          }`}
        >
          <Filter className="w-4 h-4" />
        </button>
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-4">
              {/* Blood Group Filter */}
              <div>
                <label className="text-white/40 text-xs font-medium mb-2 block">Blood Group</label>
                <div className="flex flex-wrap gap-2">
                  {bloodGroups.map(bg => (
                    <motion.button
                      key={bg}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setBloodGroupFilter(bg)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        bloodGroupFilter === bg
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : bg === 'All'
                          ? 'bg-white/[0.03] text-white/40 border border-white/[0.04] hover:text-white/60'
                          : 'bg-red-500/5 text-red-400/60 border border-red-500/10 hover:bg-red-500/10'
                      }`}
                    >
                      {bg === 'All' ? 'All Groups' : bg}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Toggle Filters */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyAvailable}
                    onChange={(e) => setShowOnlyAvailable(e.target.checked)}
                    className="w-4 h-4 rounded border-white/[0.1] bg-white/[0.05] text-emerald-500 focus:ring-emerald-500/30"
                  />
                  <span className="text-white/50 text-sm">Available Now</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showOnlyVerified}
                    onChange={(e) => setShowOnlyVerified(e.target.checked)}
                    className="w-4 h-4 rounded border-white/[0.1] bg-white/[0.05] text-cyan-500 focus:ring-cyan-500/30"
                  />
                  <span className="text-white/50 text-sm">Verified Only</span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sort Buttons */}
      <div className="flex gap-2 overflow-x-auto">
        {([
          { id: 'distance', label: '📍 Nearest', icon: MapPin },
          { id: 'rating', label: '⭐ Top Rated', icon: Star },
          { id: 'donations', label: '🏆 Most Donations', icon: Award },
        ] as const).map(sort => {
          const Icon = sort.icon;
          return (
            <motion.button
              key={sort.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortBy(sort.id)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                sortBy === sort.id
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-white/[0.02] text-white/40 border border-white/[0.04] hover:text-white/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {sort.label}
            </motion.button>
          );
        })}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <span className="text-white/30 text-xs">
          {filteredDonors.length} donor{filteredDonors.length !== 1 ? 's' : ''} found
          {filteredDonors.filter(d => d.isAvailable).length > 0 && (
            <span className="text-emerald-400 ml-1">
              ({filteredDonors.filter(d => d.isAvailable).length} available)
            </span>
          )}
        </span>
        {selectedDonor && (
          <button
            onClick={() => setSelectedDonor(null)}
            className="text-white/30 text-xs hover:text-white/50 flex items-center gap-1"
          >
            <X className="w-3 h-3" /> Clear selection
          </button>
        )}
      </div>

      {/* Donor List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredDonors.map((donor, index) => (
            <motion.div
              key={donor.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -2 }}
              onClick={() => {
                setSelectedDonor(donor);
                if (onSelectDonor) onSelectDonor(donor);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                selectedDonor?.id === donor.id
                  ? 'bg-red-500/5 border-red-500/30 ring-1 ring-red-500/20'
                  : 'bg-white/[0.02] border-white/[0.04] hover:border-red-500/20'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Avatar with Status */}
                <div className="relative shrink-0">
                  <img
                    src={donor.avatar}
                    alt={donor.name}
                    className="w-12 h-12 rounded-xl object-cover border border-white/[0.08]"
                  />
                  <span
                    className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#050508] ${
                      donor.isAvailable ? 'bg-emerald-400' : 'bg-slate-500'
                    }`}
                    title={donor.isAvailable ? 'Available' : 'Not Available'}
                  />
                </div>

                {/* Donor Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-semibold text-sm truncate">
                      {donor.name}
                    </h3>
                    {donor.verified && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" title="Verified Donor" />
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-[10px] font-bold shrink-0">
                      {donor.bloodGroup}
                    </span>
                    <span className="text-white/40 text-xs">{donor.age} yrs</span>
                    <span className="text-white/20">•</span>
                    <span className="text-white/40 text-xs">{donor.gender}</span>
                    <span className="text-white/20">•</span>
                    <span className="text-white/40 text-xs flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {donor.distance} km
                    </span>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-400" />
                      <span className="text-white/40 text-[10px]">{donor.donationCount} donations</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span className="text-white/40 text-[10px]">{donor.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-white/30" />
                      <span className="text-white/40 text-[10px]">{donor.responseTime}</span>
                    </div>
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="text-right shrink-0">
                  {donor.isAvailable ? (
                    <span className="text-emerald-400 text-[10px] font-medium flex items-center gap-1 justify-end">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Available
                    </span>
                  ) : (
                    <span className="text-amber-400 text-[10px]">Next: {donor.nextAvailable}</span>
                  )}
                  
                  <div className="flex gap-1.5 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); handleCall(donor.phone); }}
                      className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all"
                      title="Call"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); handleNavigate(donor.address); }}
                      className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                      title="Navigate"
                    >
                      <Navigation2 className="w-3.5 h-3.5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => { e.stopPropagation(); handleRequestBlood(donor); }}
                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                      title="Request Blood"
                    >
                      <Heart className="w-3.5 h-3.5" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {/* Expanded Info */}
              <AnimatePresence>
                {selectedDonor?.id === donor.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 pt-3 border-t border-white/[0.04] space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40">Address</span>
                        <span className="text-white/70 text-right max-w-[200px]">{donor.address}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40">Phone</span>
                        <span className="text-white/70">{donor.phone}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/40">Last Donation</span>
                        <span className="text-white/70">{donor.lastDonation}</span>
                      </div>
                      
                      <div className="flex gap-2 mt-3">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => { e.stopPropagation(); handleRequestBlood(donor); }}
                          className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-semibold text-xs hover:bg-red-600 transition-all flex items-center justify-center gap-1.5"
                        >
                          <Droplets className="w-3.5 h-3.5" />
                          Request Blood
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => { e.stopPropagation(); handleCall(donor.phone); }}
                          className="flex-1 py-2.5 rounded-lg bg-white/[0.03] text-white/60 font-semibold text-xs border border-white/[0.06] hover:bg-white/[0.06] transition-all flex items-center justify-center gap-1.5"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          Call Now
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty State */}
        {filteredDonors.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
              <Droplets className="w-8 h-8 text-red-400" />
            </div>
            <p className="text-white/30 text-lg font-medium">No donors found</p>
            <p className="text-white/20 text-sm mt-1">
              Try adjusting your filters or search terms
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setBloodGroupFilter('All');
                setShowOnlyAvailable(false);
                setShowOnlyVerified(false);
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-white/[0.03] text-white/40 text-sm hover:text-white/60 hover:bg-white/[0.06] transition-all"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>

      {/* Quick Stats */}
      {filteredDonors.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 rounded-xl bg-gradient-to-r from-red-500/5 to-rose-500/5 border border-red-500/10"
        >
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-white/40 text-[10px]">Total Donors</p>
              <p className="text-white font-bold text-lg">{filteredDonors.length}</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px]">Available Now</p>
              <p className="text-emerald-400 font-bold text-lg">
                {filteredDonors.filter(d => d.isAvailable).length}
              </p>
            </div>
            <div>
              <p className="text-white/40 text-[10px]">Nearest</p>
              <p className="text-white font-bold text-lg">
                {filteredDonors.length > 0 ? Math.min(...filteredDonors.map(d => d.distance)) : 0} km
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BloodDonorSearch;