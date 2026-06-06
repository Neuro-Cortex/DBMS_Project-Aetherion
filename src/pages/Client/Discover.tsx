// src/pages/client/Discover.tsx
// CLIENT DISCOVERY PAGE - All Common Components Used
// Browse Hospitals | Doctors | Pharmacies | Blood | Updates

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Search, Filter, MapPin, Star, Clock,
  Building2, Stethoscope, Pill, Droplet,
  TrendingUp, Bell, Heart, Award,
  Zap, Calendar, Phone, Navigation,
  CheckCircle, AlertCircle, XCircle,
  ChevronRight, Eye, Sparkles, Sliders
} from 'lucide-react';

// ============================================
// COMMON COMPONENTS
// ============================================
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { GlassmorphicCard } from '../../components/common/GlassmorphicCard';
import { Input } from '../../components/common/Input';
import { Select } from '../../components/common/Select';
import { Tab } from '../../components/common/Tab';
import { Loader } from '../../components/common/Loader';
import { Modal } from '../../components/common/Modal';

// ============================================
// TYPES
// ============================================

interface DiscoverItem {
  id: string;
  type: 'hospital' | 'doctor' | 'pharmacy' | 'blood-donor' | 'update';
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  avatarName?: string;
  rating?: number;
  distance?: string;
  isNew?: boolean;
  isUpdated?: boolean;
  isTrending?: boolean;
  tags: string[];
  badge?: string;
  date: string;
  actionUrl: string;
}

interface DiscoveryStats {
  totalHospitals: number;
  totalDoctors: number;
  totalPharmacies: number;
  totalDonors: number;
  newThisWeek: number;
  updatedToday: number;
  trendingNow: number;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const Discover: React.FC = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBadge, setFilterBadge] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<DiscoverItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<DiscoverItem | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const stats: DiscoveryStats = {
    totalHospitals: 45, totalDoctors: 850, totalPharmacies: 120,
    totalDonors: 5000, newThisWeek: 23, updatedToday: 15, trendingNow: 8
  };

  useEffect(() => {
    fetchDiscoverItems();
  }, []);

  const fetchDiscoverItems = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1200));

    setItems([
      { id: 'h1', type: 'hospital', title: 'Apollo Medical Center', subtitle: 'New Multi-Specialty Hospital', description: 'State-of-the-art facility with 400 beds, advanced ICU, and 24/7 emergency services', avatarName: 'Apollo Medical Center', rating: 4.9, distance: '4.0 km', isNew: true, isTrending: true, tags: ['ICU', 'Emergency', 'Cardiology'], badge: 'NEW', date: '2025-01-15', actionUrl: '/hospitals/1' },
      { id: 'h2', type: 'hospital', title: 'City General Hospital', subtitle: 'Recently Renovated', description: 'Updated emergency wing with latest equipment', avatarName: 'City General Hospital', rating: 4.5, distance: '2.5 km', isUpdated: true, tags: ['Emergency', 'Surgery'], badge: 'UPDATED', date: '2025-01-10', actionUrl: '/hospitals/2' },
      { id: 'd1', type: 'doctor', title: 'Dr. Sarah Wilson', subtitle: 'Cardiologist - New to Platform', description: '15 years experience, Harvard Medical School graduate', avatarName: 'Dr. Sarah Wilson', rating: 4.8, isNew: true, isTrending: true, tags: ['Cardiology', 'Heart Surgery'], badge: 'NEW', date: '2025-01-18', actionUrl: '/doctors/1' },
      { id: 'd2', type: 'doctor', title: 'Dr. James Brown', subtitle: 'Dermatologist - Updated Profile', description: 'New laser treatment available', avatarName: 'Dr. James Brown', rating: 4.6, isUpdated: true, tags: ['Dermatology', 'Laser'], badge: 'UPDATED', date: '2025-01-16', actionUrl: '/doctors/2' },
      { id: 'd3', type: 'doctor', title: 'Dr. Emily White', subtitle: 'Gynecologist - Trending', description: 'Specialist in high-risk pregnancy care', avatarName: 'Dr. Emily White', rating: 4.9, isTrending: true, tags: ['Gynecology', 'Women Care'], badge: 'TRENDING', date: '2025-01-14', actionUrl: '/doctors/3' },
      { id: 'p1', type: 'pharmacy', title: 'MediCare Pharmacy', subtitle: 'New Stock Alert', description: 'Just received: COVID-19 test kits, Vitamin D supplements', avatarName: 'MediCare Pharmacy', rating: 4.7, distance: '1.8 km', isNew: true, tags: ['OTC', 'Delivery'], badge: 'NEW STOCK', date: '2025-01-18', actionUrl: '/pharmacy/1' },
      { id: 'p2', type: 'pharmacy', title: 'HealthPlus Pharmacy', subtitle: 'Price Drop Alert', description: '20% off on all vitamins and supplements', avatarName: 'HealthPlus Pharmacy', rating: 4.3, distance: '3.2 km', isUpdated: true, tags: ['Discount', '24/7'], badge: 'DISCOUNT', date: '2025-01-17', actionUrl: '/pharmacy/2' },
      { id: 'b1', type: 'blood-donor', title: 'Emergency Blood Camp', subtitle: 'This Weekend', description: 'Blood donation camp at Community Center - All blood groups needed', avatarName: 'Blood Camp', isNew: true, isTrending: true, tags: ['O+', 'Emergency'], badge: 'URGENT', date: '2025-01-20', actionUrl: '/blood-donors/1' },
      { id: 'u1', type: 'update', title: 'New ICU Beds Added', subtitle: 'Apollo Medical Center', description: '20 new ICU beds with ventilator support now available', avatarName: 'ICU Update', isNew: true, isTrending: true, tags: ['ICU', 'Ventilator'], badge: 'UPDATE', date: '2025-01-18', actionUrl: '/hospitals/1' },
      { id: 'u2', type: 'update', title: 'Vaccine Drive Announced', subtitle: 'City General Hospital', description: 'Free flu vaccination camp this Saturday', avatarName: 'Vaccine Drive', isNew: true, tags: ['Vaccine', 'Free'], badge: 'EVENT', date: '2025-01-17', actionUrl: '/events/1' },
    ]);
    setIsLoading(false);
  };

  const filteredItems = useMemo(() => items.filter(item => {
    const matchesSearch = !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase()) || item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) || item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTab = activeTab === 'all' || item.type === activeTab;
    const matchesBadge = filterBadge === 'all' || item.badge?.toLowerCase() === filterBadge.toLowerCase();
    return matchesSearch && matchesTab && matchesBadge;
  }), [items, searchTerm, activeTab, filterBadge]);

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      hospital: <Building2 className="w-5 h-5 text-blue-500" />,
      doctor: <Stethoscope className="w-5 h-5 text-purple-500" />,
      pharmacy: <Pill className="w-5 h-5 text-green-500" />,
      'blood-donor': <Droplet className="w-5 h-5 text-red-500" />,
      update: <Bell className="w-5 h-5 text-orange-500" />,
    };
    return icons[type] || <Sparkles className="w-5 h-5 text-yellow-500" />;
  };

  const getBadgeVariant = (badge: string): 'success' | 'danger' | 'warning' | 'info' => {
    const map: Record<string, 'success' | 'danger' | 'warning' | 'info'> = {
      NEW: 'success', UPDATED: 'info', TRENDING: 'warning',
      'NEW STOCK': 'success', DISCOUNT: 'warning', URGENT: 'danger', EVENT: 'info'
    };
    return map[badge] || 'info';
  };

  const getCardBorder = (type: string) => {
    const borders: Record<string, string> = {
      hospital: 'border-l-blue-500', doctor: 'border-l-purple-500',
      pharmacy: 'border-l-green-500', 'blood-donor': 'border-l-red-500',
      update: 'border-l-orange-500'
    };
    return borders[type] || 'border-l-gray-500';
  };

  const tabs = [
    { id: 'all', label: 'All', icon: <Sparkles className="w-4 h-4" />, count: items.length },
    { id: 'hospital', label: 'Hospitals', icon: <Building2 className="w-4 h-4" />, count: items.filter(i => i.type === 'hospital').length },
    { id: 'doctor', label: 'Doctors', icon: <Stethoscope className="w-4 h-4" />, count: items.filter(i => i.type === 'doctor').length },
    { id: 'pharmacy', label: 'Pharmacies', icon: <Pill className="w-4 h-4" />, count: items.filter(i => i.type === 'pharmacy').length },
    { id: 'blood-donor', label: 'Blood', icon: <Droplet className="w-4 h-4" />, count: items.filter(i => i.type === 'blood-donor').length },
    { id: 'update', label: 'Updates', icon: <Bell className="w-4 h-4" />, count: items.filter(i => i.type === 'update').length },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <Loader variant="spinner" text="Discovering healthcare updates..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 space-y-6">
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          Discover
        </h1>
        <p className="text-gray-500 mt-1 ml-13">Explore what's new and trending in healthcare</p>
      </div>

      {/* ============================================ */}
      {/* STATS OVERVIEW */}
      {/* ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <GlassmorphicCard className="p-4 text-center">
          <Badge variant="success" size="sm" className="mb-2">🆕 New</Badge>
          <p className="text-2xl font-bold text-gray-800">{stats.newThisWeek}</p>
          <p className="text-xs text-gray-500">New This Week</p>
        </GlassmorphicCard>
        <GlassmorphicCard className="p-4 text-center">
          <Badge variant="info" size="sm" className="mb-2">🔄 Updated</Badge>
          <p className="text-2xl font-bold text-gray-800">{stats.updatedToday}</p>
          <p className="text-xs text-gray-500">Updated Today</p>
        </GlassmorphicCard>
        <GlassmorphicCard className="p-4 text-center">
          <Badge variant="warning" size="sm" className="mb-2">🔥 Trending</Badge>
          <p className="text-2xl font-bold text-gray-800">{stats.trendingNow}</p>
          <p className="text-xs text-gray-500">Trending Now</p>
        </GlassmorphicCard>
        <GlassmorphicCard className="p-4 text-center">
          <Badge variant="info" size="sm" className="mb-2">📋 Total</Badge>
          <p className="text-2xl font-bold text-gray-800">{stats.totalHospitals + stats.totalDoctors + stats.totalPharmacies}</p>
          <p className="text-xs text-gray-500">Total Listings</p>
        </GlassmorphicCard>
      </div>

      {/* ============================================ */}
      {/* SEARCH & FILTERS */}
      {/* ============================================ */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder="Search hospitals, doctors, pharmacies..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={Search}
            className="flex-1 min-w-[250px]"
          />
          <Select
            value={filterBadge}
            onChange={(value) => setFilterBadge(value as string)}
            options={[
              { value: 'all', label: '🔍 All Items' },
              { value: 'new', label: '🆕 New' },
              { value: 'updated', label: '🔄 Updated' },
              { value: 'trending', label: '🔥 Trending' },
              { value: 'urgent', label: '🚨 Urgent' },
              { value: 'discount', label: '💰 Discount' },
            ]}
          />
          {(searchTerm || filterBadge !== 'all') && (
            <Button variant="ghost" size="sm" onClick={() => { setSearchTerm(''); setFilterBadge('all'); }}>
              Clear
            </Button>
          )}
        </div>
      </Card>

      {/* ============================================ */}
      {/* TABS */}
      {/* ============================================ */}
      <Tab tabs={tabs} defaultTab={activeTab} onChange={setActiveTab} />

      {/* ============================================ */}
      {/* DISCOVERY CARDS GRID */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            onClick={() => { setSelectedItem(item); setShowDetailModal(true); }}
          >
            <Card className={`p-5 border-l-4 ${getCardBorder(item.type)} hover:shadow-xl transition-all cursor-pointer`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Avatar name={item.avatarName || item.title} size="md" />
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{item.title}</h3>
                    <p className="text-xs text-gray-500">{item.subtitle}</p>
                  </div>
                </div>
                {item.badge && (
                  <Badge variant={getBadgeVariant(item.badge)} size="xs">
                    {item.badge}
                  </Badge>
                )}
              </div>

              {/* Description */}
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{item.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-3">
                {item.tags.map((tag, i) => (
                  <Badge key={i} variant="info" size="xs">{tag}</Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t">
                <div className="flex items-center gap-3">
                  {item.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-400 fill-current" /> {item.rating}
                    </span>
                  )}
                  {item.distance && (
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" /> {item.distance}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.date}
                  </span>
                </div>
                <Button variant="ghost" size="xs" onClick={() => window.location.href = item.actionUrl}>
                  View <ChevronRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* ============================================ */}
      {/* EMPTY STATE */}
      {/* ============================================ */}
      {filteredItems.length === 0 && (
        <Card className="p-12 text-center">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No discoveries found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearchTerm(''); setFilterBadge('all'); setActiveTab('all'); }}>
            Reset All Filters
          </Button>
        </Card>
      )}

      {/* ============================================ */}
      {/* DETAIL MODAL */}
      {/* ============================================ */}
      <Modal isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} title={selectedItem?.title || 'Details'} size="md">
        {selectedItem && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Avatar name={selectedItem.avatarName || selectedItem.title} size="lg" />
              <div>
                <h3 className="font-bold text-lg">{selectedItem.title}</h3>
                <p className="text-sm text-gray-500">{selectedItem.subtitle}</p>
              </div>
              {selectedItem.badge && <Badge variant={getBadgeVariant(selectedItem.badge)}>{selectedItem.badge}</Badge>}
            </div>
            <p className="text-gray-600">{selectedItem.description}</p>
            <div className="flex flex-wrap gap-2">
              {selectedItem.tags.map((tag, i) => (
                <Badge key={i} variant="info" size="sm">{tag}</Badge>
              ))}
            </div>
            <div className="flex gap-3 text-sm text-gray-500">
              {selectedItem.rating && <span>⭐ {selectedItem.rating}</span>}
              {selectedItem.distance && <span>📍 {selectedItem.distance}</span>}
              <span>📅 {selectedItem.date}</span>
            </div>
            <Button variant="primary" fullWidth onClick={() => window.location.href = selectedItem.actionUrl}>
              View Full Details
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Discover;