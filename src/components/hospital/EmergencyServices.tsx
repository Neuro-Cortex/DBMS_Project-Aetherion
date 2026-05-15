// src/components/emergency/ICUTracker.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Heart, Activity, Users, Clock, AlertCircle, Bed,
  Thermometer, Zap, Droplet, TrendingUp, TrendingDown
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// ============================================
// TYPES
// ============================================
interface ICUResource {
  id: string;
  type: string;
  total: number;
  available: number;
  status: string;
  lastServiced: string;
}

interface ICUStaff {
  role: string;
  count: number;
  available: number;
  onCall: number;
  specialty: string;
}

interface ICUBeds {
  total: number;
  available: number;
  occupied: number;
  covid: number;
  nonCovid: number;
  emergency: number;
  cardiac: number;
  pediatric: number;
  neonatal: number;
}

interface ICUTrackerProps {
  icuBeds: ICUBeds;
  resources: ICUResource[];
  staff: ICUStaff[];
  realTime?: boolean;
  className?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================
export const ICUTracker: React.FC<ICUTrackerProps> = ({
  icuBeds,
  resources,
  staff,
  realTime = false,
  className = '',
}) => {
  const [beds, setBeds] = useState(icuBeds);
  const [res, setRes] = useState(resources);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Real-time simulation
  useEffect(() => {
    if (!realTime) return;
    const interval = setInterval(() => {
      setBeds(prev => ({
        ...prev,
        available: Math.max(0, prev.available + Math.floor(Math.random() * 3) - 1),
        occupied: prev.total - Math.max(0, prev.available + Math.floor(Math.random() * 3) - 1),
      }));
      setRes(prev => prev.map(r => ({
        ...r,
        available: Math.max(0, Math.min(r.total, r.available + Math.floor(Math.random() * 3) - 1)),
      })));
      setLastUpdated(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, [realTime]);

  const occupancyRate = Math.round((beds.occupied / beds.total) * 100);

  const getStatusColor = (available: number, total: number) => {
    const pct = (available / total) * 100;
    if (pct < 15) return 'text-red-400';
    if (pct < 30) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const getProgressColor = (available: number, total: number) => {
    const pct = (available / total) * 100;
    if (pct < 15) return 'bg-red-500';
    if (pct < 30) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <div className={`space-y-6 ${className}`}>

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-[-0.02em]">ICU Tracker</h2>
          <p className="text-white/35 text-sm mt-1">Real-time intensive care unit monitoring</p>
        </div>
        {realTime && (
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-white/30 text-xs">Live • Updated {lastUpdated.toLocaleTimeString()}</span>
          </div>
        )}
      </div>

      {/* OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Beds', value: beds.total, icon: Bed, color: 'text-blue-400', bg: 'bg-blue-500/10' },
          { label: 'Available', value: beds.available, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Occupied', value: beds.occupied, icon: AlertCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Occupancy Rate', value: `${occupancyRate}%`, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        ].map((item, i) => {
          const Icon = item.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }} className={`${item.bg} rounded-xl border border-white/[0.06] p-4 text-center hover:border-white/[0.15] transition-all`}>
              <Icon className={`w-5 h-5 mx-auto mb-2 ${item.color}`} />
              <div className="text-xl font-bold text-white">{item.value}</div>
              <div className="text-white/35 text-[11px] font-medium">{item.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* OCCUPANCY BAR */}
      <GlassmorphicCard className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/50 text-sm font-medium">Overall Occupancy</span>
          <span className={`text-sm font-bold ${occupancyRate > 85 ? 'text-red-400' : occupancyRate > 70 ? 'text-amber-400' : 'text-emerald-400'}`}>{occupancyRate}%</span>
        </div>
        <div className="h-3 bg-white/[0.04] rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${occupancyRate}%` }} transition={{ duration: 1 }}
            className={`h-full rounded-full ${occupancyRate > 85 ? 'bg-gradient-to-r from-red-500 to-rose-500' : occupancyRate > 70 ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-emerald-500 to-teal-500'}`} />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-white/25">
          <span>{beds.occupied} occupied</span><span>{beds.available} available</span>
        </div>
      </GlassmorphicCard>

      {/* BED BREAKDOWN + RESOURCES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Bed Breakdown */}
        <GlassmorphicCard className="p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Bed Breakdown</h3>
          <div className="space-y-3">
            {[
              { label: 'COVID-19', value: beds.covid, total: beds.total },
              { label: 'Non-COVID', value: beds.nonCovid, total: beds.total },
              { label: 'Emergency', value: beds.emergency, total: beds.total },
              { label: 'Cardiac', value: beds.cardiac, total: beds.total },
              { label: 'Pediatric', value: beds.pediatric, total: beds.total },
              { label: 'Neonatal', value: beds.neonatal, total: beds.total },
            ].map((item) => (
              <div key={item.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-white/50">{item.label}</span>
                  <span className={getStatusColor(item.total - item.value, item.total)}>{item.value}</span>
                </div>
                <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${getProgressColor(item.total - item.value, item.total)}`}
                    style={{ width: `${(item.value / (item.total || 1)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </GlassmorphicCard>

        {/* Resources */}
        <GlassmorphicCard className="p-5">
          <h3 className="text-white font-semibold text-sm mb-4">Equipment & Resources</h3>
          <div className="space-y-3">
            {res.map((resource) => {
              const pct = Math.round((resource.available / resource.total) * 100);
              return (
                <div key={resource.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/50">{resource.type}</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${pct < 25 ? 'text-red-400' : pct < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {resource.available}/{resource.total}
                      </span>
                      <Badge variant={pct < 25 ? 'danger' : pct < 50 ? 'warning' : 'success'} size="xs">{resource.status}</Badge>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct < 25 ? 'bg-red-500' : pct < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassmorphicCard>
      </div>

      {/* STAFF */}
      <GlassmorphicCard className="p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Staff on Duty</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {staff.map((s) => (
            <div key={s.role} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
              <Users className="w-5 h-5 text-white/40 mx-auto mb-2" />
              <p className="text-white text-sm font-semibold capitalize">{s.role}</p>
              <p className="text-white/30 text-xs mt-1">{s.specialty}</p>
              <div className="flex items-center justify-center gap-3 mt-3 text-xs">
                <span className="text-emerald-400 font-bold">{s.available} available</span>
                <span className="text-white/15">•</span>
                <span className="text-white/40">{s.onCall} on call</span>
              </div>
              <div className="mt-2 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(s.available / s.count) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </GlassmorphicCard>

      {/* QUICK ACTIONS */}
      <div className="flex gap-3">
        <Button variant="glass" size="sm" className="gap-2"><RefreshCw className="w-4 h-4" /> Refresh Data</Button>
        <Button variant="glass" size="sm" className="gap-2"><Download className="w-4 h-4" /> Export Report</Button>
      </div>
    </div>
  );
};

// Need these imports too
import { CheckCircle, RefreshCw, Download } from 'lucide-react';

export default ICUTracker;