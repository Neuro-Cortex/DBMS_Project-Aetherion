// src/components/emergency/ICUTracker.tsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Heart, Brain, Filter, Monitor, Syringe, Shield,
  AlertTriangle, CheckCircle, Clock, Users, TrendingUp,
  TrendingDown, Zap, Thermometer, Droplet, Eye, Ear,
   Plus, RefreshCw, Bed
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// ============================================
// TYPES
// ============================================
export interface ICUResource {
  id: string;
  type: string;
  total: number;
  available: number;
  status: string;
  lastServiced: string;
}

export interface ICUStaff {
  role: string;
  count: number;
  available: number;
  onCall: number;
  specialty?: string;
}

export interface ICUTrackerProps {
  icuBeds: {
    total: number;
    available: number;
    occupied: number;
    covid: number;
    nonCovid: number;
    emergency?: number;
    cardiac?: number;
    pediatric?: number;
    neonatal?: number;
  };
  resources: ICUResource[];
  staff: ICUStaff[];
  realTime?: boolean;
  updateInterval?: number;
  onStaffRequest?: (role: string, count: number) => void;
  onEquipmentAlert?: (equipment: string) => void;
  className?: string;
}

// ============================================
// EQUIPMENT CONFIG
// ============================================
const equipmentConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  ventilator: { icon: Syringe, color: 'red', label: 'Ventilators' },
  monitor: { icon: Monitor, color: 'blue', label: 'Monitors' },
  defibrillator: { icon: Zap, color: 'amber', label: 'Defibrillators' },
  infusion: { icon: Droplet, color: 'cyan', label: 'Infusion Pumps' },
  dialysis: { icon: Filter, color: 'purple', label: 'Dialysis' },
  ecmo: { icon: Heart, color: 'pink', label: 'ECMO' },
};

const roleConfig: Record<string, { icon: React.ElementType; color: string }> = {
  doctor: { icon: Shield, color: 'text-blue-400' },
  nurse: { icon: Heart, color: 'text-emerald-400' },
  respiratory: { icon: Activity, color: 'text-cyan-400' },
  specialist: { icon: Brain, color: 'text-purple-400' },
  paramedic: { icon: Users, color: 'text-amber-400' },
  technician: { icon: Monitor, color: 'text-indigo-400' },
};

// ============================================
// MAIN COMPONENT
// ============================================
export const ICUTracker: React.FC<ICUTrackerProps> = ({
  icuBeds: initialBeds,
  resources: initialResources,
  staff: initialStaff,
  realTime = false,
  updateInterval = 5000,
  onStaffRequest,
  onEquipmentAlert,
  className = '',
}) => {
  const [beds, setBeds] = useState(initialBeds);
  const [resources, setResources] = useState(initialResources);
  const [staff, setStaff] = useState(initialStaff);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Real-time simulation
  useEffect(() => {
    if (!realTime) return;
    const interval = setInterval(() => {
      setBeds(prev => {
        const change = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const newOccupied = Math.max(0, Math.min(prev.total, prev.occupied + change));
        return {
          ...prev,
          occupied: newOccupied,
          available: prev.total - newOccupied,
          covid: Math.floor(newOccupied * 0.3),
          nonCovid: Math.floor(newOccupied * 0.7),
        };
      });
      setResources(prev => prev.map(r => {
        const newAvail = Math.max(0, Math.min(r.total, r.available + (Math.random() > 0.5 ? 1 : -1)));
        return { ...r, available: newAvail, status: newAvail < 2 ? 'critical' : newAvail < r.total * 0.3 ? 'low' : 'operational' };
      }));
      setStaff(prev => prev.map(s => ({
        ...s, available: Math.max(0, Math.min(s.count, s.available + (Math.random() > 0.5 ? 1 : -1)))
      })));
      setLastUpdated(new Date());
    }, updateInterval);
    return () => clearInterval(interval);
  }, [realTime, updateInterval]);

  const occupancyRate = useMemo(() => beds.total > 0 ? Math.round((beds.occupied / beds.total) * 100) : 0, [beds]);
  const covidRatio = useMemo(() => beds.occupied > 0 ? Math.round((beds.covid / beds.occupied) * 100) : 0, [beds]);

  const getProgressColor = (pct: number): string => {
    if (pct > 85) return 'from-red-500 to-rose-500';
    if (pct > 60) return 'from-amber-500 to-orange-500';
    return 'from-emerald-500 to-teal-500';
  };

  const statCards = [
    { label: 'Total Beds', value: beds.total, icon: Bed, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Available', value: beds.available, icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Occupied', value: beds.occupied, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Occupancy', value: `${occupancyRate}%`, icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className={`space-y-6 ${className}`}>

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em]">ICU Resource Tracker</h2>
          <p className="text-white/35 text-sm mt-1">Critical care monitoring & management</p>
        </div>
        <div className="flex items-center gap-3">
          {realTime && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="text-emerald-400 text-[10px] font-medium">Live</span>
            </div>
          )}
          <Badge variant={occupancyRate > 85 ? 'danger' : occupancyRate > 60 ? 'warning' : 'success'} size="xs">
            {occupancyRate}% Occupied
          </Badge>
        </div>
      </motion.div>

      {/* STATS GRID */}
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

      {/* OCCUPANCY BAR */}
      <GlassmorphicCard className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/50 text-sm font-medium">ICU Occupancy</span>
          <span className={`text-sm font-bold ${occupancyRate > 85 ? 'text-red-400' : occupancyRate > 60 ? 'text-amber-400' : 'text-emerald-400'}`}>{occupancyRate}%</span>
        </div>
        <div className="h-3 bg-white/[0.04] rounded-full overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: `${occupancyRate}%` }} transition={{ duration: 1 }}
            className={`h-full bg-gradient-to-r ${getProgressColor(occupancyRate)} rounded-full`} />
        </div>
        <div className="flex justify-between mt-2 text-[10px] text-white/25">
          <span>{beds.occupied} occupied</span><span>{beds.available} available</span>
        </div>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
            <p className="text-red-400 text-lg font-bold">{beds.covid}</p>
            <p className="text-white/30 text-[10px]">COVID-19</p>
          </div>
          <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
            <p className="text-blue-400 text-lg font-bold">{beds.nonCovid}</p>
            <p className="text-white/30 text-[10px]">Non-COVID</p>
          </div>
        </div>
      </GlassmorphicCard>

      {/* EQUIPMENT + STAFF */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* EQUIPMENT */}
        <GlassmorphicCard className="p-5">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><Monitor className="w-4 h-4 text-blue-400" />Equipment</h3>
          <div className="space-y-3">
            {resources.map((resource) => {
              const config = equipmentConfig[resource.type] || { icon: Monitor, color: 'slate', label: resource.type };
              const Icon = config.icon;
              const pct = Math.round((resource.available / resource.total) * 100);
              return (
                <div key={resource.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-white/40" />
                      <span className="text-white/50">{config.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${pct < 25 ? 'text-red-400' : pct < 50 ? 'text-amber-400' : 'text-emerald-400'}`}>{resource.available}/{resource.total}</span>
                      <Badge variant={pct < 25 ? 'danger' : pct < 50 ? 'warning' : 'success'} size="xs">{resource.status}</Badge>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${pct < 25 ? 'bg-red-500' : pct < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassmorphicCard>

        {/* STAFF */}
        <GlassmorphicCard className="p-5">
          <h3 className="text-white font-semibold text-sm mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-emerald-400" />Staff</h3>
          <div className="grid grid-cols-2 gap-3">
            {staff.map((s) => {
              const config = roleConfig[s.role] || { icon: Users, color: 'text-slate-400' };
              const Icon = config.icon;
              return (
                <div key={s.role} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
                  <Icon className={`w-5 h-5 mx-auto mb-2 ${config.color}`} />
                  <p className="text-white text-sm font-semibold capitalize">{s.role}</p>
                  <p className="text-white/30 text-[10px] mt-0.5">{s.specialty || ''}</p>
                  <div className="flex items-center justify-center gap-2 mt-2 text-xs">
                    <span className="text-emerald-400 font-bold">{s.available} avail</span>
                    <span className="text-white/15">•</span>
                    <span className="text-white/40">{s.onCall} on call</span>
                  </div>
                  <div className="mt-2 h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(s.available / s.count) * 100}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
          <Button variant="glass" size="sm" onClick={() => onStaffRequest?.('doctor', 1)} className="w-full mt-4 gap-2">
            <Plus className="w-4 h-4" /> Request Staff
          </Button>
        </GlassmorphicCard>
      </div>

      {/* SEVERITY LEVELS */}
      <GlassmorphicCard className="p-5">
        <h3 className="text-white font-semibold text-sm mb-4">Patient Severity</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { level: 'Critical', count: 3, color: 'red', icon: AlertTriangle },
            { level: 'Severe', count: 8, color: 'orange', icon: Activity },
            { level: 'Moderate', count: 12, color: 'amber', icon: Clock },
            { level: 'Stable', count: 5, color: 'emerald', icon: CheckCircle },
          ].map((sev) => {
            const Icon = sev.icon;
            return (
              <div key={sev.level} className={`p-4 rounded-xl bg-${sev.color}-500/5 border border-${sev.color}-500/10 text-center`}>
                <Icon className={`w-6 h-6 mx-auto mb-2 text-${sev.color}-400`} />
                <p className="text-xl font-bold text-white">{sev.count}</p>
                <p className="text-white/30 text-[10px] uppercase tracking-wider">{sev.level}</p>
              </div>
            );
          })}
        </div>
      </GlassmorphicCard>

      {/* ALERTS */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-2">
            {alerts.map((alert, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-3"><AlertTriangle className="w-5 h-5 text-red-400" /><p className="text-white text-sm">{alert}</p></div>
                <button type="button" onClick={() => setAlerts(prev => prev.filter(a => a !== alert))} className="text-white/40 hover:text-white/70 text-xs">Dismiss</button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <div className="flex items-center justify-between text-xs text-white/20">
        <span>Last updated: {lastUpdated.toLocaleTimeString()}</span>
        <span>ICU Tracker v2.0</span>
      </div>
    </div>
  );
};

export default ICUTracker;