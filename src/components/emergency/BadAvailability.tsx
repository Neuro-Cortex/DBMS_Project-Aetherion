// src/components/hospital/BedAvailability.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bed, Activity, Heart, Baby, Users, TrendingUp,
  AlertTriangle, CheckCircle, RefreshCw, Shield
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// ============================================
// TYPES
// ============================================
export interface BedData {
  type: string;
  total: number;
  occupied: number;
  available: number;
  price: number;
  features: string[];
}

export interface BedAvailabilityProps {
  beds: BedData[];
  hospitalId: string;
  hospitalName?: string;
  realTime?: boolean;
  updateInterval?: number;
  onBedBooking?: (type: string, count: number) => void;
  onAlert?: (message: string) => void;
  className?: string;
}

// ============================================
// BED TYPE CONFIG
// ============================================
const bedTypeConfig: Record<string, { icon: React.ElementType; color: string; label: string; description: string }> = {
  general: { icon: Bed, color: 'blue', label: 'General Beds', description: 'Standard inpatient care' },
  icu: { icon: Activity, color: 'red', label: 'ICU Beds', description: 'Critical care with monitoring' },
  pediatric: { icon: Baby, color: 'pink', label: 'Pediatric Beds', description: 'Specialized for children' },
  maternity: { icon: Heart, color: 'purple', label: 'Maternity Beds', description: 'Labor and delivery care' },
  emergency: { icon: Users, color: 'amber', label: 'Emergency Beds', description: '24/7 emergency care' },
  isolation: { icon: Shield, color: 'emerald', label: 'Isolation Beds', description: 'Infectious disease control' },
  cardiac: { icon: Heart, color: 'rose', label: 'Cardiac Beds', description: 'Heart care unit' },
};

// ============================================
// MAIN COMPONENT
// ============================================
export const BedAvailability: React.FC<BedAvailabilityProps> = ({
  beds: initialBeds,
  hospitalId,
  hospitalName = '',
  realTime = false,
  updateInterval = 5000,
  onBedBooking,
  onAlert,
  className = '',
}) => {
  const [beds, setBeds] = useState<BedData[]>(initialBeds);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [bookingCount, setBookingCount] = useState(1);
  const [alerts, setAlerts] = useState<string[]>([]);

  // Real-time updates
  useEffect(() => {
    if (!realTime) return;
    const interval = setInterval(() => {
      setBeds(prev => prev.map(bed => {
        const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const newOccupied = Math.max(0, Math.min(bed.total, bed.occupied + change));
        const newAvailable = bed.total - newOccupied;
        if (newAvailable < 3 && !alerts.includes(bed.type)) {
          const config = bedTypeConfig[bed.type] || { label: bed.type };
          const alert = `${config.label} critically low! Only ${newAvailable} beds left`;
          setAlerts(prev => [...prev, alert]);
          onAlert?.(alert);
        }
        return { ...bed, occupied: newOccupied, available: newAvailable };
      }));
    }, updateInterval);
    return () => clearInterval(interval);
  }, [realTime, updateInterval, alerts, onAlert]);

  // Clear alerts after 30 seconds
  useEffect(() => {
    if (alerts.length === 0) return;
    const timer = setTimeout(() => setAlerts([]), 30000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const handleBooking = (type: string) => {
    onBedBooking?.(type, bookingCount);
    setSelectedType(null);
    setBookingCount(1);
  };

  const totalBeds = beds.reduce((acc, bed) => acc + bed.total, 0);
  const totalAvailable = beds.reduce((acc, bed) => acc + bed.available, 0);
  const overallUtilization = totalBeds > 0 ? Math.round(((totalBeds - totalAvailable) / totalBeds) * 100) : 0;

  // Mini stat cards data
  const statCards = [
    { label: 'Total Beds', value: totalBeds, icon: Bed, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Available', value: totalAvailable, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Utilization', value: `${overallUtilization}%`, icon: TrendingUp, color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { label: 'ICU Available', value: beds.find(b => b.type === 'icu')?.available || 0, icon: Activity, color: 'text-red-400', bg: 'bg-red-500/10' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className={`space-y-6 ${className}`}>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-[-0.02em]">Bed Availability</h2>
          <p className="text-white/35 text-sm mt-1">{hospitalName || `Hospital #${hospitalId}`} • Real-time bed tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant={realTime ? 'success' : 'info'} size="xs" className="gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${realTime ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`} />
            {realTime ? 'Live' : 'Static'}
          </Badge>
          <Button variant="glass" size="sm" onClick={() => setBeds([...beds])} className="gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh
          </Button>
        </div>
      </div>

      {/* ALERTS */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
            {alerts.map((alert, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <p className="text-white text-sm font-medium">{alert}</p>
                </div>
                <button type="button" onClick={() => setAlerts(prev => prev.filter(a => a !== alert))} className="text-white/40 hover:text-white/70 text-xs transition-colors">Dismiss</button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }} className={`${stat.bg} rounded-xl border border-white/[0.06] p-4 text-center hover:border-white/[0.15] transition-all`}>
              <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-white/35 text-[11px] font-medium">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* BED TYPE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {beds.map((bed, index) => {
          const config = bedTypeConfig[bed.type] || bedTypeConfig.general;
          const Icon = config.icon;
          const utilization = bed.total > 0 ? Math.round(((bed.total - bed.available) / bed.total) * 100) : 0;
          const isCritical = bed.available < 3;

          return (
            <motion.div key={bed.type} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}
              whileHover={{ y: -3 }} onClick={() => setSelectedType(bed.type)}
              className={`relative bg-white/[0.015] rounded-2xl border p-5 cursor-pointer transition-all duration-300 ${isCritical ? 'border-red-500/30 bg-red-500/[0.02]' : 'border-white/[0.06] hover:border-white/[0.12]'}`}>
              
              {isCritical && (
                <div className="absolute top-3 right-3">
                  <Badge variant="danger" size="xs" className="animate-pulse gap-1"><AlertTriangle className="w-3 h-3" />Critical</Badge>
                </div>
              )}

              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl bg-${config.color}-500/10 border border-white/[0.08] flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 text-${config.color}-400`} />
                </div>
                <Badge variant={bed.available > 5 ? 'success' : bed.available > 0 ? 'warning' : 'danger'} size="xs">{bed.available} free</Badge>
              </div>

              <h3 className="text-white font-semibold text-sm mb-1">{config.label}</h3>
              <p className="text-white/35 text-xs mb-4">{config.description}</p>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">Available</span>
                  <span className="text-white font-bold">{bed.available}/{bed.total}</span>
                </div>
                <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${utilization}%` }} transition={{ duration: 0.8, delay: index * 0.1 }}
                    className={`h-full rounded-full ${utilization > 85 ? 'bg-gradient-to-r from-red-500 to-rose-500' : utilization > 60 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`} />
                </div>
                <div className="flex justify-between text-[10px] text-white/30">
                  <span>Utilization</span><span>{utilization}%</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between">
                <span className="text-emerald-400 text-sm font-bold">${bed.price}/day</span>
                <div className="flex flex-wrap gap-1">
                  {bed.features.slice(0, 2).map((f, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded-md bg-white/[0.03] text-white/30 text-[10px] border border-white/[0.04]">{f}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* BOOKING MODAL */}
      <AnimatePresence>
        {selectedType && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedType(null)} />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-md bg-[#0a0a10] border border-white/[0.08] rounded-2xl shadow-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-4">
                Book {bedTypeConfig[selectedType]?.label || selectedType}
              </h3>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-4">
                <p className="text-white/50 text-xs mb-2">Available: <span className="text-white font-bold">{beds.find(b => b.type === selectedType)?.available || 0}</span></p>
                <p className="text-white/50 text-xs">Price: <span className="text-emerald-400 font-bold">${beds.find(b => b.type === selectedType)?.price || 0}/day</span></p>
              </div>
              <div className="mb-4">
                <label className="text-white/40 text-xs uppercase tracking-wider mb-2 block">Number of beds</label>
                <input type="number" min={1} max={beds.find(b => b.type === selectedType)?.available || 1} value={bookingCount}
                  onChange={(e) => setBookingCount(Math.max(1, Number(e.target.value)))}
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-white/20" />
              </div>
              <div className="flex gap-3">
                <Button variant="glass" size="sm" onClick={() => setSelectedType(null)} className="flex-1 justify-center">Cancel</Button>
                <Button variant="gradient" size="sm" onClick={() => handleBooking(selectedType)} className="flex-1 justify-center">Confirm Booking</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BedAvailability;