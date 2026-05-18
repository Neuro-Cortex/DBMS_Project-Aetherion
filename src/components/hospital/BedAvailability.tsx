// src/components/hospital/BedAvailability.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bed, Activity, TrendingUp, TrendingDown, Clock, AlertTriangle,
  CheckCircle2, Minus, Plus, Users, Heart, Shield, Zap,
  ChevronRight, RefreshCw, Wifi, WifiOff, Calendar, Info
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface BedType {
  id: string;
  type: string;
  icon: React.ElementType;
  total: number;
  occupied: number;
  available: number;
  price: number;
  features: string[];
  color: string;
  priority: 'critical' | 'high' | 'normal' | 'low';
}

interface BedStats {
  totalBeds: number;
  totalOccupied: number;
  totalAvailable: number;
  occupancyRate: number;
  lastUpdated: Date;
}

// ============================================
// MOCK DATA
// ============================================

const initialBeds: BedType[] = [
  {
    id: 'icu',
    type: 'Intensive Care Unit',
    icon: Heart,
    total: 50,
    occupied: 45,
    available: 5,
    price: 2500,
    features: ['Ventilator Support', 'Cardiac Monitor', '24/7 Specialist', 'Isolation Ready'],
    color: 'from-red-500 to-rose-600',
    priority: 'critical',
  },
  {
    id: 'emergency',
    type: 'Emergency Ward',
    icon: Zap,
    total: 30,
    occupied: 22,
    available: 8,
    price: 1800,
    features: ['Trauma Care', 'Rapid Response', 'Lab Access', 'Pharmacy Nearby'],
    color: 'from-orange-500 to-amber-600',
    priority: 'critical',
  },
  {
    id: 'cardiac',
    type: 'Cardiac Care',
    icon: Activity,
    total: 25,
    occupied: 18,
    available: 7,
    price: 2000,
    features: ['ECG Monitoring', 'Echo Lab', 'Cardiologist 24/7', 'Cath Lab Access'],
    color: 'from-pink-500 to-rose-600',
    priority: 'high',
  },
  {
    id: 'maternity',
    type: 'Maternity Ward',
    icon: Users,
    total: 20,
    occupied: 14,
    available: 6,
    price: 1500,
    features: ['Delivery Suite', 'NICU Access', 'Lactation Support', 'Family Room'],
    color: 'from-purple-500 to-violet-600',
    priority: 'high',
  },
  {
    id: 'pediatric',
    type: 'Pediatric Ward',
    icon: Heart,
    total: 25,
    occupied: 15,
    available: 10,
    price: 1200,
    features: ['Child-Friendly', 'Play Area', 'Parent Accommodation', 'Pediatric Specialist'],
    color: 'from-blue-500 to-cyan-600',
    priority: 'normal',
  },
  {
    id: 'general',
    type: 'General Ward',
    icon: Bed,
    total: 150,
    occupied: 110,
    available: 40,
    price: 800,
    features: ['Attached Bathroom', 'TV', 'WiFi', 'Room Service'],
    color: 'from-emerald-500 to-teal-600',
    priority: 'low',
  },
];

// ============================================
// SUB-COMPONENTS
// ============================================

// Status Indicator
const StatusBadge: React.FC<{ available: number; total: number }> = ({ available, total }) => {
  const percentage = (available / total) * 100;
  
  if (percentage <= 10) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-medium">
        <AlertTriangle className="w-3 h-3" />
        Critical
      </span>
    );
  }
  if (percentage <= 25) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-medium">
        <TrendingDown className="w-3 h-3" />
        Limited
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-medium">
      <CheckCircle2 className="w-3 h-3" />
      Available
    </span>
  );
};

// Progress Bar
const ProgressBar: React.FC<{
  value: number;
  max: number;
  color: string;
  showLabel?: boolean;
}> = ({ value, max, color, showLabel = true }) => {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className="space-y-1.5">
      {showLabel && (
        <div className="flex justify-between items-center">
          <span className="text-white/40 text-xs font-medium">{value} of {max} beds</span>
          <span className="text-white/30 text-[10px] font-mono">{percentage}%</span>
        </div>
      )}
      <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full bg-gradient-to-r ${color} rounded-full relative`}
        >
          {/* Shine effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer" />
        </motion.div>
      </div>
    </div>
  );
};

// Live Indicator
const LiveIndicator: React.FC<{ isLive: boolean; lastUpdated: Date }> = ({ isLive, lastUpdated }) => (
  <div className="flex items-center gap-2">
    <span className="relative flex h-2 w-2">
      {isLive && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      )}
      <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? 'bg-emerald-400' : 'bg-red-400'}`} />
    </span>
    <span className="text-white/30 text-xs">
      {isLive ? 'Live' : 'Offline'} • Updated {lastUpdated.toLocaleTimeString()}
    </span>
  </div>
);

// ============================================
// MAIN COMPONENT
// ============================================

export const BedAvailability: React.FC<{
  beds?: BedType[];
  hospitalId?: string;
  hospitalName?: string;
  realTime?: boolean;
  compact?: boolean;
}> = ({
  beds: initialBedData,
  hospitalId,
  hospitalName = 'Selected Hospital',
  realTime = true,
  compact = false,
}) => {
  // State
  const [beds, setBeds] = useState<BedType[]>(initialBedData || initialBeds);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [selectedBed, setSelectedBed] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Calculate overall stats
  const stats: BedStats = useMemo(() => {
    const totalBeds = beds.reduce((sum, bed) => sum + bed.total, 0);
    const totalOccupied = beds.reduce((sum, bed) => sum + bed.occupied, 0);
    const totalAvailable = beds.reduce((sum, bed) => sum + bed.available, 0);
    return {
      totalBeds,
      totalOccupied,
      totalAvailable,
      occupancyRate: Math.round((totalOccupied / totalBeds) * 100),
      lastUpdated,
    };
  }, [beds, lastUpdated]);

  // Real-time simulation
  useEffect(() => {
    if (!realTime) return;

    const interval = setInterval(() => {
      setBeds(prev =>
        prev.map(bed => {
          const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or +1
          const newOccupied = Math.max(0, Math.min(bed.total, bed.occupied + change));
          return {
            ...bed,
            occupied: newOccupied,
            available: bed.total - newOccupied,
          };
        })
      );
      setLastUpdated(new Date());
    }, 10000);

    return () => clearInterval(interval);
  }, [realTime]);

  // Simulate connection loss
  useEffect(() => {
    if (!realTime) return;
    
    const connectionCheck = setInterval(() => {
      setIsLive(Math.random() > 0.15);
    }, 30000);

    return () => clearInterval(connectionCheck);
  }, [realTime]);

  // Refresh handler
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setIsRefreshing(false);
    }, 1500);
  };

  // Get occupancy color
  const getOccupancyColor = (rate: number) => {
    if (rate > 85) return 'text-red-400';
    if (rate > 70) return 'text-amber-400';
    return 'text-emerald-400';
  };

  // Format currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className={`space-y-6 ${compact ? '' : 'p-6'}`}>
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white tracking-[-0.01em]">
            Bed Availability
          </h2>
          {hospitalName && (
            <p className="text-white/40 text-sm mt-0.5">{hospitalName}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          {!compact && (
            <div className="flex bg-white/[0.03] rounded-lg border border-white/[0.06] p-0.5">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'grid' ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  viewMode === 'list' ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                List
              </button>
            </div>
          )}

          {/* Refresh */}
          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 bg-white/[0.03] hover:bg-white/[0.06] rounded-lg border border-white/[0.06] transition-all disabled:opacity-50"
            aria-label="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 text-white/50 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          {/* Live Status */}
          <LiveIndicator isLive={isLive} lastUpdated={lastUpdated} />
        </div>
      </div>

      {/* ============================================ */}
      {/* OVERVIEW STATS */}
      {/* ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          {
            label: 'Total Beds',
            value: stats.totalBeds,
            icon: Bed,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10',
          },
          {
            label: 'Available Now',
            value: stats.totalAvailable,
            icon: CheckCircle2,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Currently Occupied',
            value: stats.totalOccupied,
            icon: Users,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
          },
          {
            label: 'Occupancy Rate',
            value: `${stats.occupancyRate}%`,
            icon: Activity,
            color: getOccupancyColor(stats.occupancyRate),
            bg: 'bg-purple-500/10',
          },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={`stat-${idx}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${stat.bg} backdrop-blur-sm rounded-xl p-4 border border-white/[0.06]`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-xl md:text-2xl font-bold text-white tracking-tight">
                {stat.value}
              </div>
              <div className="text-white/30 text-xs mt-0.5">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* ============================================ */}
      {/* OCCUPANCY BAR */}
      {/* ============================================ */}
      <div className="bg-white/[0.015] backdrop-blur-sm rounded-xl p-5 border border-white/[0.06]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/50 text-sm font-medium">Overall Occupancy</span>
          <span className={`text-sm font-bold ${getOccupancyColor(stats.occupancyRate)}`}>
            {stats.occupancyRate}%
          </span>
        </div>
        <div className="h-3 bg-white/[0.04] rounded-full overflow-hidden flex">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.occupancyRate}%` }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 animate-shimmer" />
          </motion.div>
          <div
            className="h-full bg-white/[0.03] rounded-r-full"
            style={{ width: `${100 - stats.occupancyRate}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-white/25 text-[10px]">
            {stats.totalOccupied} occupied
          </span>
          <span className="text-white/25 text-[10px]">
            {stats.totalAvailable} available
          </span>
        </div>
      </div>

      {/* ============================================ */}
      {/* BED TYPE CARDS */}
      {/* ============================================ */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
        {beds.map((bed, idx) => {
          const Icon = bed.icon;
          const percentage = Math.round((bed.available / bed.total) * 100);
          const isSelected = selectedBed === bed.id;

          return (
            <motion.div
              key={bed.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedBed(isSelected ? null : bed.id)}
              className={`cursor-pointer bg-white/[0.015] backdrop-blur-sm rounded-xl border transition-all duration-300 ${
                isSelected
                  ? 'border-white/20 bg-white/[0.03]'
                  : 'border-white/[0.06] hover:border-white/[0.12]'
              } overflow-hidden`}
            >
              {/* Card Header */}
              <div className="p-4 md:p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${bed.color} bg-opacity-20 flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-sm md:text-base">
                        {bed.type}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <StatusBadge available={bed.available} total={bed.total} />
                        <span className="text-white/20 text-[10px]">
                          {formatPrice(bed.price)}/day
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 text-white/20 transition-transform duration-300 ${isSelected ? 'rotate-90' : ''}`} />
                </div>

                {/* Bed Count */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1">
                    <ProgressBar value={bed.available} max={bed.total} color={bed.color} showLabel={false} />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/30">
                    <span className="text-emerald-400 font-semibold">{bed.available}</span> available
                  </span>
                  <span className="text-white/30">
                    <span className="text-white/50 font-semibold">{bed.occupied}</span> occupied
                  </span>
                </div>

                {/* Expanded Details */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
                        {/* Features */}
                        <div>
                          <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Features</p>
                          <div className="flex flex-wrap gap-1.5">
                            {bed.features.map((feature, i) => (
                              <span
                                key={i}
                                className="px-2 py-1 rounded-md bg-white/[0.03] border border-white/[0.06] text-white/50 text-[10px]"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center p-2 bg-white/[0.02] rounded-lg">
                            <div className="text-white text-sm font-bold">{bed.total}</div>
                            <div className="text-white/30 text-[10px]">Total</div>
                          </div>
                          <div className="text-center p-2 bg-white/[0.02] rounded-lg">
                            <div className="text-amber-400 text-sm font-bold">{bed.occupied}</div>
                            <div className="text-white/30 text-[10px]">Occupied</div>
                          </div>
                          <div className="text-center p-2 bg-white/[0.02] rounded-lg">
                            <div className="text-emerald-400 text-sm font-bold">{bed.available}</div>
                            <div className="text-white/30 text-[10px]">Available</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Indicator */}
              <div className={`h-0.5 bg-gradient-to-r ${bed.color}`} style={{ width: `${percentage}%` }} />
            </motion.div>
          );
        })}
      </div>

      {/* ============================================ */}
      {/* LEGEND */}
      {/* ============================================ */}
      <div className="flex flex-wrap gap-4 pt-2">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-white/30 text-xs">Critical (&lt;10%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-white/30 text-xs">Limited (&lt;25%)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-white/30 text-xs">Available (&gt;25%)</span>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Info className="w-3 h-3 text-white/20" />
          <span className="text-white/20 text-[10px]">
            Real-time updates every 10 seconds
          </span>
        </div>
      </div>
    </div>
  );
};

export default BedAvailability;