// src/pages/client/NearbyDonors.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientSidebar from '../../components/client/ClientSidebar';
import {
  Droplets, Search, MapPin, Phone, Filter,
  Clock, CheckCircle2, Star, Award, Heart,
  AlertCircle, ChevronRight, Navigation2
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

const donors: BloodDonor[] = [
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
];

const bloodGroups = ['All', 'O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

const ClientNearbyDonors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('All');
  const [selectedDonor, setSelectedDonor] = useState<BloodDonor | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'donations'>('distance');

  const filteredDonors = donors
    .filter(d => {
      const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchBlood = bloodGroupFilter === 'All' || d.bloodGroup === bloodGroupFilter;
      return matchSearch && matchBlood;
    })
    .sort((a, b) => {
      if (sortBy === 'distance') return a.distance - b.distance;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.donationCount - a.donationCount;
    });

  return (
    <div className="min-h-screen bg-[#050508]">
      <ClientSidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Droplets className="w-8 h-8 text-red-400" />
            Nearby Blood Donors
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Find blood donors near your location ({donors.filter(d => d.isAvailable).length} available now)
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <input
              type="text"
              placeholder="Search by name or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm outline-none focus:border-red-400/50 transition-all"
            />
          </div>
          <select
            value={bloodGroupFilter}
            onChange={(e) => setBloodGroupFilter(e.target.value)}
            className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/60 text-sm outline-none"
          >
            {bloodGroups.map(bg => (
              <option key={bg} value={bg} className="bg-gray-900">{bg === 'All' ? 'All Blood Groups' : bg}</option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex gap-2 mb-6">
          {([
            { id: 'distance', label: '📍 Nearest' },
            { id: 'rating', label: '⭐ Top Rated' },
            { id: 'donations', label: '🏆 Most Donations' },
          ] as const).map(sort => (
            <button
              key={sort.id}
              onClick={() => setSortBy(sort.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === sort.id
                  ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                  : 'bg-white/[0.02] text-white/40 border border-white/[0.04]'
              }`}
            >
              {sort.label}
            </button>
          ))}
        </div>

        {/* Donors Grid */}
        <div className="grid grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredDonors.map((donor, index) => (
              <motion.div
                key={donor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedDonor(donor)}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-red-500/20 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative">
                      <img
                        src={donor.avatar}
                        alt={donor.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-white/[0.08]"
                      />
                      <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#050508] ${
                        donor.isAvailable ? 'bg-emerald-400' : 'bg-slate-500'
                      }`} />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold">{donor.name}</h3>
                        {donor.verified && (
                          <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-xs font-bold">
                          {donor.bloodGroup}
                        </span>
                        <span className="text-white/40 text-xs">{donor.age} yrs</span>
                        <span className="text-white/20">•</span>
                        <span className="text-white/40 text-xs">{donor.gender}</span>
                      </div>
                    </div>
                  </div>

                  {/* Distance */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-white/60">
                      <MapPin className="w-4 h-4" />
                      <span className="font-medium">{donor.distance} km</span>
                    </div>
                    <p className="text-white/30 text-[10px] mt-1">{donor.responseTime}</p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.04]">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-amber-400" />
                      <span className="text-white/40 text-xs">{donor.donationCount} donations</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-white/40 text-xs">{donor.rating}</span>
                    </div>
                  </div>
                  {donor.isAvailable ? (
                    <span className="text-emerald-400 text-xs font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Available
                    </span>
                  ) : (
                    <span className="text-amber-400 text-xs">Available {donor.nextAvailable}</span>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex-1 py-2.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                    <Phone className="w-4 h-4" /> Call Now
                  </button>
                  <button className="flex-1 py-2.5 rounded-lg bg-white/[0.03] text-white/40 text-sm font-medium hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2">
                    <Navigation2 className="w-4 h-4" /> Navigate
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Donor Detail Modal */}
        <AnimatePresence>
          {selectedDonor && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedDonor(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md p-6 rounded-2xl bg-[#0a0a10] border border-white/[0.08]"
              >
                <div className="text-center mb-6">
                  <img
                    src={selectedDonor.avatar}
                    alt={selectedDonor.name}
                    className="w-24 h-24 rounded-3xl object-cover mx-auto border-2 border-white/[0.08] mb-4"
                  />
                  <h3 className="text-white font-semibold text-xl">{selectedDonor.name}</h3>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <span className="px-3 py-1 rounded-lg bg-red-500/10 text-red-400 text-sm font-bold">
                      {selectedDonor.bloodGroup}
                    </span>
                    {selectedDonor.verified && (
                      <span className="px-3 py-1 rounded-lg bg-cyan-500/10 text-cyan-400 text-sm">
                        Verified Donor
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between p-3 rounded-xl bg-white/[0.02]">
                    <span className="text-white/40">Distance</span>
                    <span className="text-white font-medium">{selectedDonor.distance} km</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/[0.02]">
                    <span className="text-white/40">Total Donations</span>
                    <span className="text-white font-medium">{selectedDonor.donationCount}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/[0.02]">
                    <span className="text-white/40">Last Donation</span>
                    <span className="text-white font-medium">{selectedDonor.lastDonation}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/[0.02]">
                    <span className="text-white/40">Response Time</span>
                    <span className="text-emerald-400 font-medium">{selectedDonor.responseTime}</span>
                  </div>
                  <div className="flex justify-between p-3 rounded-xl bg-white/[0.02]">
                    <span className="text-white/40">Address</span>
                    <span className="text-white text-right max-w-[200px]">{selectedDonor.address}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <a
                    href={`tel:${selectedDonor.phone}`}
                    className="py-3 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" /> Call Now
                  </a>
                  <button className="py-3 rounded-xl bg-white/[0.03] text-white/60 font-semibold text-sm hover:bg-white/[0.06] transition-all flex items-center justify-center gap-2">
                    <Navigation2 className="w-4 h-4" /> Navigate
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClientNearbyDonors;