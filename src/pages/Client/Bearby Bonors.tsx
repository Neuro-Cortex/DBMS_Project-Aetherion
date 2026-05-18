// src/pages/client/NearbyDonors.tsx
// NEARBY BLOOD DONOR SEARCH WITH GOOGLE MAPS
// Search by blood group, location, distance

import React, { useState, useEffect } from 'react';
import {
  Search, MapPin, Droplet, Phone, Navigation,
  Clock, Star, Filter, Users, ChevronRight,
  AlertCircle, CheckCircle, XCircle, Heart,
  Bell, RefreshCw, Sliders, X
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface BloodDonor {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  distance: number; // km
  eta: string; // estimated time
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  lastDonation: string;
  totalDonations: number;
  isAvailable: boolean;
  isVerified: boolean;
  rating: number;
  responseTime: string;
  canDonateNow: boolean;
  nextEligibleDate: string;
  profileImage: string;
}

interface SearchFilters {
  bloodGroup: string;
  maxDistance: number;
  availability: 'all' | 'available' | 'emergency';
  sortBy: 'distance' | 'rating' | 'donations';
}

// ============================================
// MAIN COMPONENT
// ============================================

export const ClientNearbyDonors: React.FC = () => {
  const [donors, setDonors] = useState<BloodDonor[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<BloodDonor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDonor, setSelectedDonor] = useState<BloodDonor | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.006 });
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filters, setFilters] = useState<SearchFilters>({
    bloodGroup: 'all',
    maxDistance: 25,
    availability: 'all',
    sortBy: 'distance'
  });

  const bloodGroups = ['all', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  useEffect(() => {
    getUserLocation();
    fetchDonors();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, donors, searchTerm]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.log('Using default location')
      );
    }
  };

  const fetchDonors = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockDonors: BloodDonor[] = [
        {
          id: '1', name: 'Sarah Johnson', age: 28, gender: 'Female',
          bloodGroup: 'O+', phone: '+1 (555) 111-2233', email: 'sarah@email.com',
          distance: 2.3, eta: '8 min', address: '123 Main St, New York',
          coordinates: { lat: 40.7150, lng: -74.0080 },
          lastDonation: '2024-11-15', totalDonations: 12,
          isAvailable: true, isVerified: true, rating: 4.8,
          responseTime: '5 min', canDonateNow: true,
          nextEligibleDate: '2025-02-15', profileImage: ''
        },
        {
          id: '2', name: 'Michael Chen', age: 35, gender: 'Male',
          bloodGroup: 'A+', phone: '+1 (555) 444-5566', email: 'michael@email.com',
          distance: 4.1, eta: '12 min', address: '456 Oak Ave, New York',
          coordinates: { lat: 40.7200, lng: -74.0150 },
          lastDonation: '2024-10-20', totalDonations: 8,
          isAvailable: true, isVerified: true, rating: 4.6,
          responseTime: '10 min', canDonateNow: true,
          nextEligibleDate: '2025-01-20', profileImage: ''
        },
        {
          id: '3', name: 'Emily Davis', age: 24, gender: 'Female',
          bloodGroup: 'B+', phone: '+1 (555) 777-8899', email: 'emily@email.com',
          distance: 1.8, eta: '5 min', address: '789 Pine Rd, New York',
          coordinates: { lat: 40.7100, lng: -74.0050 },
          lastDonation: '2024-12-01', totalDonations: 5,
          isAvailable: false, isVerified: true, rating: 4.9,
          responseTime: '3 min', canDonateNow: false,
          nextEligibleDate: '2025-03-01', profileImage: ''
        },
        {
          id: '4', name: 'David Wilson', age: 42, gender: 'Male',
          bloodGroup: 'O-', phone: '+1 (555) 222-3344', email: 'david@email.com',
          distance: 3.5, eta: '10 min', address: '321 Elm St, New York',
          coordinates: { lat: 40.7180, lng: -74.0120 },
          lastDonation: '2024-09-10', totalDonations: 25,
          isAvailable: true, isVerified: true, rating: 5.0,
          responseTime: '7 min', canDonateNow: true,
          nextEligibleDate: '2024-12-10', profileImage: ''
        },
        {
          id: '5', name: 'Lisa Anderson', age: 31, gender: 'Female',
          bloodGroup: 'AB+', phone: '+1 (555) 888-9900', email: 'lisa@email.com',
          distance: 6.2, eta: '18 min', address: '654 Maple Dr, New York',
          coordinates: { lat: 40.7250, lng: -74.0200 },
          lastDonation: '2024-08-20', totalDonations: 15,
          isAvailable: true, isVerified: false, rating: 4.3,
          responseTime: '15 min', canDonateNow: true,
          nextEligibleDate: '2024-11-20', profileImage: ''
        },
        {
          id: '6', name: 'Robert Brown', age: 29, gender: 'Male',
          bloodGroup: 'O+', phone: '+1 (555) 333-4455', email: 'robert@email.com',
          distance: 0.9, eta: '3 min', address: '987 Cedar Ln, New York',
          coordinates: { lat: 40.7110, lng: -74.0040 },
          lastDonation: '2025-01-05', totalDonations: 3,
          isAvailable: true, isVerified: true, rating: 4.7,
          responseTime: '2 min', canDonateNow: false,
          nextEligibleDate: '2025-04-05', profileImage: ''
        },
        {
          id: '7', name: 'Jennifer Lee', age: 26, gender: 'Female',
          bloodGroup: 'A-', phone: '+1 (555) 666-7788', email: 'jennifer@email.com',
          distance: 5.0, eta: '15 min', address: '147 Birch St, New York',
          coordinates: { lat: 40.7220, lng: -74.0180 },
          lastDonation: '2024-11-30', totalDonations: 7,
          isAvailable: true, isVerified: true, rating: 4.5,
          responseTime: '12 min', canDonateNow: true,
          nextEligibleDate: '2025-02-28', profileImage: ''
        },
        {
          id: '8', name: 'James Taylor', age: 45, gender: 'Male',
          bloodGroup: 'B-', phone: '+1 (555) 999-0011', email: 'james@email.com',
          distance: 7.5, eta: '22 min', address: '258 Walnut Ave, New York',
          coordinates: { lat: 40.7300, lng: -74.0250 },
          lastDonation: '2024-07-15', totalDonations: 30,
          isAvailable: false, isVerified: true, rating: 4.9,
          responseTime: '20 min', canDonateNow: false,
          nextEligibleDate: '2024-10-15', profileImage: ''
        }
      ];
      setDonors(mockDonors);
      setFilteredDonors(mockDonors);
      setIsLoading(false);
    }, 1000);
  };

  const applyFilters = () => {
    let result = [...donors];

    // Blood group filter
    if (filters.bloodGroup !== 'all') {
      result = result.filter(d => d.bloodGroup === filters.bloodGroup);
    }

    // Distance filter
    result = result.filter(d => d.distance <= filters.maxDistance);

    // Availability filter
    if (filters.availability === 'available') {
      result = result.filter(d => d.isAvailable);
    } else if (filters.availability === 'emergency') {
      result = result.filter(d => d.canDonateNow && d.isAvailable);
    }

    // Search
    if (searchTerm) {
      result = result.filter(d => 
        d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort
    switch(filters.sortBy) {
      case 'distance':
        result.sort((a, b) => a.distance - b.distance);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'donations':
        result.sort((a, b) => b.totalDonations - a.totalDonations);
        break;
    }

    setFilteredDonors(result);
  };

  const handleRequestBlood = (donor: BloodDonor) => {
    setSelectedDonor(donor);
    setShowContactModal(true);
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleDirections = (donor: BloodDonor) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${donor.coordinates.lat},${donor.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const getBloodGroupColor = (bg: string) => {
    if (bg.includes('O')) return 'bg-red-100 text-red-700 border-red-200';
    if (bg.includes('A')) return 'bg-blue-100 text-blue-700 border-blue-200';
    if (bg.includes('B')) return 'bg-green-100 text-green-700 border-green-200';
    if (bg.includes('AB')) return 'bg-purple-100 text-purple-700 border-purple-200';
    return 'bg-gray-100 text-gray-700 border-gray-200';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-3 text-gray-500 text-sm">Searching nearby donors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold flex items-center">
            <Droplet className="w-7 h-7 mr-3" />
            Nearby Blood Donors
          </h1>
          <p className="text-red-100 text-sm mt-1">Find blood donors near your location</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, blood group, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-red-500 text-sm"
              />
            </div>
            
            {/* Blood Group Quick Filter */}
            <div className="flex gap-2 overflow-x-auto">
              {bloodGroups.map((bg) => (
                <button
                  key={bg}
                  onClick={() => setFilters({ ...filters, bloodGroup: bg })}
                  className={`px-3 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    filters.bloodGroup === bg
                      ? 'bg-red-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {bg === 'all' ? 'All' : bg}
                </button>
              ))}
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 transition-all ${
                showFilters ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Sliders className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Extended Filters */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max Distance</label>
                <select
                  value={filters.maxDistance}
                  onChange={(e) => setFilters({ ...filters, maxDistance: Number(e.target.value) })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value={5}>5 km</option>
                  <option value={10}>10 km</option>
                  <option value={25}>25 km</option>
                  <option value={50}>50 km</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Availability</label>
                <select
                  value={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.value as any })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Donors</option>
                  <option value="available">Available Now</option>
                  <option value="emergency">Emergency Only</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Sort By</label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                  className="w-full border rounded-lg px-3 py-2 text-sm"
                >
                  <option value="distance">Nearest First</option>
                  <option value="rating">Highest Rated</option>
                  <option value="donations">Most Donations</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-600">
            <span className="font-semibold">{filteredDonors.length}</span> donors found
            {filters.bloodGroup !== 'all' && <span> with blood group <span className="font-bold text-red-600">{filters.bloodGroup}</span></span>}
          </p>
          <button onClick={fetchDonors} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Map View Placeholder */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
          <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center relative overflow-hidden">
            {/* Map Grid Pattern */}
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'linear-gradient(#3b82f6 1px, transparent 1px), linear-gradient(90deg, #3b82f6 1px, transparent 1px)',
              backgroundSize: '40px 40px'
            }}></div>
            
            <div className="relative text-center">
              <MapPin className="w-10 h-10 text-red-500 mx-auto animate-bounce" />
              <p className="text-gray-600 font-medium mt-2">🗺️ Google Maps View</p>
              <p className="text-gray-400 text-xs mt-1">Showing {filteredDonors.length} donors within {filters.maxDistance} km</p>
              
              {/* Mini Donor Dots */}
              <div className="flex justify-center gap-2 mt-3">
                {filteredDonors.slice(0, 5).map((donor, i) => (
                  <div
                    key={donor.id}
                    className="w-3 h-3 bg-red-500 rounded-full animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                    title={`${donor.name} - ${donor.distance}km`}
                  />
                ))}
                {filteredDonors.length > 5 && (
                  <span className="text-xs text-gray-500">+{filteredDonors.length - 5} more</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Donors List */}
        <div className="space-y-3">
          {filteredDonors.map((donor) => (
            <div
              key={donor.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Profile */}
                <div className="relative">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold border-2 ${getBloodGroupColor(donor.bloodGroup)}`}>
                    {donor.name.charAt(0)}
                  </div>
                  {donor.isAvailable && (
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" title="Available" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">{donor.name}</h3>
                        {donor.isVerified && (
                          <CheckCircle className="w-4 h-4 text-blue-500" />
                        )}
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${getBloodGroupColor(donor.bloodGroup)}`}>
                          {donor.bloodGroup}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {donor.distance} km
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {donor.eta}
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" /> {donor.rating}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Donation Stats */}
                  <div className="flex items-center gap-4 mt-2 text-xs">
                    <span className="text-gray-500">
                      🩸 <span className="font-medium">{donor.totalDonations}</span> donations
                    </span>
                    <span className="text-gray-500">
                      📅 Last: {donor.lastDonation}
                    </span>
                    {donor.canDonateNow ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Can donate now
                      </span>
                    ) : (
                      <span className="text-red-500 flex items-center gap-1">
                        <XCircle className="w-3 h-3" /> Not eligible
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleCall(donor.phone)}
                      className="flex-1 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 flex items-center justify-center gap-1"
                    >
                      <Phone className="w-4 h-4" /> Call
                    </button>
                    <button
                      onClick={() => handleDirections(donor)}
                      className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-1"
                    >
                      <Navigation className="w-4 h-4" /> Directions
                    </button>
                    <button
                      onClick={() => handleRequestBlood(donor)}
                      disabled={!donor.canDonateNow}
                      className={`flex-1 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 ${
                        donor.canDonateNow
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <Droplet className="w-4 h-4" /> Request
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredDonors.length === 0 && (
          <div className="text-center py-16">
            <Droplet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No donors found</h3>
            <p className="text-gray-500 text-sm mt-1">Try adjusting your filters or search radius</p>
          </div>
        )}
      </div>

      {/* Contact Modal */}
      {showContactModal && selectedDonor && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowContactModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="text-center mb-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto border-2 ${getBloodGroupColor(selectedDonor.bloodGroup)}`}>
                {selectedDonor.name.charAt(0)}
              </div>
              <h3 className="font-bold text-lg mt-2">{selectedDonor.name}</h3>
              <p className="text-red-600 font-bold">{selectedDonor.bloodGroup}</p>
            </div>

            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Distance</span>
                <span className="font-medium">{selectedDonor.distance} km ({selectedDonor.eta})</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Donations</span>
                <span className="font-medium">{selectedDonor.totalDonations}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Last Donation</span>
                <span className="font-medium">{selectedDonor.lastDonation}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Response Time</span>
                <span className="font-medium">{selectedDonor.responseTime}</span>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <button
                onClick={() => handleCall(selectedDonor.phone)}
                className="w-full py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 flex items-center justify-center gap-2"
              >
                <Phone className="w-5 h-5" /> Call {selectedDonor.name}
              </button>
              <button
                onClick={() => handleRequestBlood(selectedDonor)}
                className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 flex items-center justify-center gap-2"
              >
                <Droplet className="w-5 h-5" /> Request Blood Donation
              </button>
              <button
                onClick={() => setShowContactModal(false)}
                className="w-full py-2.5 border border-gray-300 rounded-xl text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientNearbyDonors;