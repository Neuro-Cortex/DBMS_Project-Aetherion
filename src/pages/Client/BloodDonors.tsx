// src/pages/BloodDonors.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Droplet, Search, MapPin, Phone, Heart, User, 
  Calendar, Clock, Filter, X, CheckCircle, AlertCircle,
  Activity, TrendingUp, Award, Shield, Globe, Mail,
  MessageCircle, Share2, Download, Plus, Star
} from 'lucide-react';
import { GlassmorphicCard } from 'src/pages/GlassmorphicCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';

// ============================================
// TYPES
// ============================================

interface BloodDonor {
  id: string;
  name: string;
  bloodGroup: string;
  location: string;
  phone: string;
  lastDonated: string;
  available: boolean;
  email?: string;
  avatar?: string;
  donationCount?: number;
  verified?: boolean;
  rating?: number;
  distance?: number;
}

interface BloodRequest {
  id: string;
  bloodGroup: string;
  location: string;
  patientName: string;
  hospital: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  date: string;
  contact: string;
}

// ============================================
// MOCK DATA
// ============================================

const donorsData: BloodDonor[] = [
  { id: '1', name: 'Alex Johnson', bloodGroup: 'O+', location: 'Gulshan, Dhaka', phone: '+8801712345678', lastDonated: '2024-01-15', available: true, email: 'alex@email.com', donationCount: 12, verified: true, rating: 4.8, distance: 2.5 },
  { id: '2', name: 'Maria Garcia', bloodGroup: 'A-', location: 'Banani, Dhaka', phone: '+8801712345679', lastDonated: '2024-02-20', available: true, email: 'maria@email.com', donationCount: 8, verified: true, rating: 4.9, distance: 3.2 },
  { id: '3', name: 'David Kim', bloodGroup: 'B+', location: 'Dhanmondi, Dhaka', phone: '+8801712345680', lastDonated: '2023-12-10', available: false, email: 'david@email.com', donationCount: 5, verified: false, rating: 4.5, distance: 1.8 },
  { id: '4', name: 'Sarah Ahmed', bloodGroup: 'AB-', location: 'Uttara, Dhaka', phone: '+8801712345681', lastDonated: '2024-03-01', available: true, email: 'sarah@email.com', donationCount: 15, verified: true, rating: 5.0, distance: 5.5 },
  { id: '5', name: 'Rahman Hossain', bloodGroup: 'O-', location: 'Mirpur, Dhaka', phone: '+8801712345682', lastDonated: '2024-02-25', available: true, email: 'rahman@email.com', donationCount: 20, verified: true, rating: 4.9, distance: 4.0 },
  { id: '6', name: 'Fatima Begum', bloodGroup: 'A+', location: 'Mohakhali, Dhaka', phone: '+8801712345683', lastDonated: '2023-11-30', available: false, email: 'fatima@email.com', donationCount: 3, verified: false, rating: 4.2, distance: 2.0 },
];

const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const locations = ['All Locations', 'Gulshan', 'Banani', 'Dhanmondi', 'Uttara', 'Mirpur', 'Mohakhali'];

// ============================================
// MAIN COMPONENT
// ============================================

export const BloodDonors: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState<BloodDonor | null>(null);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [isDonorModalOpen, setIsDonorModalOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'donations'>('distance');

  // Filter donors
  const filteredDonors = donorsData.filter(donor => {
    const matchesGroup = !selectedGroup || donor.bloodGroup === selectedGroup;
    const matchesLocation = !searchLocation || donor.location.toLowerCase().includes(searchLocation.toLowerCase());
    const matchesAvailability = !showAvailableOnly || donor.available;
    return matchesGroup && matchesLocation && matchesAvailability;
  });

  // Sort donors
  const sortedDonors = [...filteredDonors].sort((a, b) => {
    if (sortBy === 'distance') return (a.distance || 0) - (b.distance || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return (b.donationCount || 0) - (a.donationCount || 0);
  });

  const getBloodGroupColor = (group: string) => {
    const colors: Record<string, string> = {
      'A+': 'from-green-500 to-emerald-500',
      'A-': 'from-green-600 to-emerald-600',
      'B+': 'from-blue-500 to-cyan-500',
      'B-': 'from-blue-600 to-cyan-600',
      'AB+': 'from-purple-500 to-pink-500',
      'AB-': 'from-purple-600 to-pink-600',
      'O+': 'from-red-500 to-rose-500',
      'O-': 'from-red-600 to-rose-600',
    };
    return colors[group] || 'from-gray-500 to-gray-600';
  };

  const stats = {
    totalDonors: donorsData.length,
    availableDonors: donorsData.filter(d => d.available).length,
    bloodRequests: 23,
    livesSaved: 1247,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Blood Donors Network
            </h1>
            <p className="text-white/60">Connect with blood donors in your area</p>
          </div>
          <div className="flex gap-3">
            <Button variant="glass" size="sm" icon={Download}>
              Download List
            </Button>
            <Button variant="gradient" size="sm" icon={Plus} onClick={() => setIsDonorModalOpen(true)}>
              Register as Donor
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Donors', value: stats.totalDonors, icon: Heart, color: 'red', trend: '+12%' },
            { label: 'Available Now', value: stats.availableDonors, icon: CheckCircle, color: 'green', trend: '+5%' },
            { label: 'Active Requests', value: stats.bloodRequests, icon: Activity, color: 'orange', trend: '+8%' },
            { label: 'Lives Saved', value: stats.livesSaved, icon: Award, color: 'purple', trend: '+23%' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <stat.icon className={`w-6 h-6 text-${stat.color}-400 mx-auto mb-2`} />
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <div className="text-white/60 text-sm">{stat.label}</div>
              <Badge variant="success" size="xs" className="mt-1">{stat.trend}</Badge>
            </div>
          ))}
        </div>

        {/* Emergency Banner */}
        <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-2xl p-6 border border-red-500/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
                <Droplet className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Emergency Blood Request</h3>
                <p className="text-white/60 text-sm">Urgent need for O- blood at City Hospital</p>
              </div>
            </div>
            <Button variant="danger" size="sm">
              View Request
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search by location..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none"
              >
                <option value="distance">Sort by Distance</option>
                <option value="rating">Sort by Rating</option>
                <option value="donations">Sort by Donations</option>
              </select>
              <button
                onClick={() => setShowAvailableOnly(!showAvailableOnly)}
                className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
                  showAvailableOnly 
                    ? 'bg-cyan-500 text-white' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Available Only
              </button>
            </div>
          </div>

          {/* Blood Group Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedGroup(null)}
              className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${
                !selectedGroup 
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white' 
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
            >
              All
            </button>
            {bloodGroups.map(bg => (
              <motion.button
                key={bg}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedGroup(selectedGroup === bg ? null : bg)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition ${
                  selectedGroup === bg 
                    ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg' 
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {bg}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center">
          <p className="text-white/60">
            Found <span className="text-cyan-400 font-semibold">{sortedDonors.length}</span> donors
          </p>
          <div className="flex gap-1">
            {[1, 2, 3].map(page => (
              <button key={page} className="w-8 h-8 rounded-lg bg-white/10 text-white/70 hover:bg-white/20 transition">
                {page}
              </button>
            ))}
          </div>
        </div>

        {/* Donors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {sortedDonors.map((donor, index) => (
              <motion.div
                key={donor.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
              >
                <GlassmorphicCard variant="glass" className="p-6 hover:border-cyan-500/50 transition-all">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-14 h-14 bg-gradient-to-r ${getBloodGroupColor(donor.bloodGroup)} rounded-xl flex items-center justify-center shadow-lg`}>
                        <Droplet className="w-7 h-7 text-white" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold text-white">{donor.name}</h3>
                          {donor.verified && (
                            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="danger" size="sm" className="font-mono">
                            {donor.bloodGroup}
                          </Badge>
                          <Badge variant={donor.available ? 'success' : 'secondary'} size="xs">
                            {donor.available ? 'Available' : 'Not Available'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" />
                      <span className="text-white text-sm">{donor.rating}</span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-white/60 mb-4">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      {donor.location} • {donor.distance}km away
                    </p>
                    <p className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-cyan-400" />
                      {donor.phone}
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-cyan-400" />
                      Last donated: {new Date(donor.lastDonated).toLocaleDateString()}
                    </p>
                    <p className="flex items-center gap-2">
                      <Heart className="w-4 h-4 text-cyan-400" />
                      {donor.donationCount} donations • 12 lives saved
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      variant={donor.available ? 'gradient' : 'glass'} 
                      size="sm" 
                      fullWidth 
                      disabled={!donor.available}
                      onClick={() => {
                        setSelectedDonor(donor);
                        setIsRequestModalOpen(true);
                      }}
                    >
                      Request Contact
                    </Button>
                    <Button variant="glass" size="sm" iconOnly>
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {sortedDonors.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
              <Droplet className="w-10 h-10 text-white/30" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No donors found</h3>
            <p className="text-white/60">Try adjusting your filters or register as a donor</p>
            <Button variant="gradient" className="mt-6" onClick={() => setIsDonorModalOpen(true)}>
              Register as Donor
            </Button>
          </div>
        )}
      </div>

      {/* Request Modal */}
      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Request Blood"
        size="md"
      >
        {selectedDonor && (
          <div className="space-y-4">
            <div className="bg-white/5 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${getBloodGroupColor(selectedDonor.bloodGroup)} rounded-lg flex items-center justify-center`}>
                  <Droplet className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{selectedDonor.name}</h4>
                  <p className="text-white/50 text-sm">{selectedDonor.bloodGroup} • {selectedDonor.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Phone className="w-4 h-4" />
                {selectedDonor.phone}
              </div>
            </div>
            <Input label="Your Name" placeholder="Enter your name" />
            <Input label="Patient Name" placeholder="Enter patient name" />
            <Input label="Hospital Name" placeholder="Enter hospital name" />
            <Input label="Contact Number" placeholder="Your phone number" />
            <div className="flex gap-3 pt-4">
              <Button variant="glass" fullWidth onClick={() => setIsRequestModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="gradient" fullWidth>
                Send Request
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Register Donor Modal */}
      <Modal
        isOpen={isDonorModalOpen}
        onClose={() => setIsDonorModalOpen(false)}
        title="Register as Blood Donor"
        size="md"
      >
        <div className="space-y-4">
          <Input label="Full Name" placeholder="Enter your full name" />
          <Input label="Email" type="email" placeholder="Enter your email" />
          <Input label="Phone Number" placeholder="Enter your phone number" />
          <Input label="Location" placeholder="Enter your location" />
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">Blood Group</label>
            <div className="grid grid-cols-4 gap-2">
              {bloodGroups.map(bg => (
                <button key={bg} className="px-3 py-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition">
                  {bg}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="glass" fullWidth onClick={() => setIsDonorModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gradient" fullWidth>
              Register
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BloodDonors;