import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity,
  Heart,
  Brain,
  Lungs,
  Monitor,
  Syringe,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Zap,
  Thermometer,
  Droplet,
  Eye,
  Ear
} from 'lucide-react';
import { clsx } from 'clsx';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ActivityChart } from '../dashboard/ActivityChart';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface ICUResource {
  id: string;
  type: 'ventilator' | 'monitor' | 'defibrillator' | 'infusion' | 'dialysis' | 'ecmo';
  total: number;
  available: number;
  status: 'operational' | 'maintenance' | 'critical';
  lastServiced: string;
}

export interface ICUStaff {
  role: 'doctor' | 'nurse' | 'respiratory' | 'specialist';
  count: number;
  available: number;
  onCall: number;
}

export interface ICUTrackerProps {
  icuBeds: {
    total: number;
    available: number;
    occupied: number;
    covid: number;
    nonCovid: number;
  };
  resources: ICUResource[];
  staff: ICUStaff[];
  variant?: 'glass' | 'gradient' | 'neon';
  realTime?: boolean;
  updateInterval?: number;
  onStaffRequest?: (role: string, count: number) => void;
  onEquipmentAlert?: (equipment: string) => void;
  className?: string;
}

// ============================================
// ICU EQUIPMENT CONFIG
// ============================================
const equipmentConfig = {
  ventilator: {
    icon: Lungs,
    color: 'red',
    label: 'Ventilators',
    critical: true,
  },
  monitor: {
    icon: Monitor,
    color: 'blue',
    label: 'Patient Monitors',
    critical: true,
  },
  defibrillator: {
    icon: Zap,
    color: 'yellow',
    label: 'Defibrillators',
    critical: true,
  },
  infusion: {
    icon: Droplet,
    color: 'cyan',
    label: 'Infusion Pumps',
    critical: false,
  },
  dialysis: {
    icon: Filter,
    color: 'purple',
    label: 'Dialysis Machines',
    critical: false,
  },
  ecmo: {
    icon: Heart,
    color: 'pink',
    label: 'ECMO Machines',
    critical: true,
  },
} as const;

// ============================================
// ICU TRACKER COMPONENT
// ============================================
export const ICUTracker: React.FC<ICUTrackerProps> = ({
  icuBeds: initialICUBeds,
  resources: initialResources,
  staff: initialStaff,
  variant = 'glass',
  realTime = false,
  updateInterval = 3000,
  onStaffRequest,
  onEquipmentAlert,
  className,
}) => {
  const [icuBeds, setICUBeds] = useState(initialICUBeds);
  const [resources, setResources] = useState(initialResources);
  const [staff, setStaff] = useState(initialStaff);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    if (!realTime) return;

    const interval = setInterval(() => {
      // Update ICU beds
      setICUBeds(prev => {
        const change = Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0;
        const newOccupied = Math.max(0, Math.min(prev.total, prev.occupied + change));
        const newAvailable = prev.total - newOccupied;
        
        return {
          ...prev,
          occupied: newOccupied,
          available: newAvailable,
          covid: Math.floor(newOccupied * 0.3),
          nonCovid: Math.floor(newOccupied * 0.7),
        };
      });

      // Update equipment
      setResources(prev => prev.map(resource => {
        if (Math.random() > 0.95) {
          const newAvailable = Math.max(0, Math.min(resource.total, resource.available + (Math.random() > 0.5 ? 1 : -1)));
          const newStatus = newAvailable < 2 ? 'critical' : newAvailable < resource.total * 0.5 ? 'maintenance' : 'operational';
          
          if (newStatus === 'critical' && equipmentConfig[resource.type as keyof typeof equipmentConfig].critical) {
            const alert = `${equipmentConfig[resource.type as keyof typeof equipmentConfig].label} critically low!`;
            setAlerts(prev => [...prev, alert]);
            onEquipmentAlert?.(resource.type);
          }
          
          return {
            ...resource,
            available: newAvailable,
            status: newStatus,
          };
        }
        return resource;
      }));

      // Update staff
      setStaff(prev => prev.map(s => {
        if (Math.random() > 0.9) {
          const change = Math.random() > 0.5 ? 1 : -1;
          return {
            ...s,
            available: Math.max(0, Math.min(s.count, s.available + change)),
          };
        }
        return s;
      }));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [realTime, updateInterval, onEquipmentAlert]);

  const icuUtilization = Math.round(((icuBeds.total - icuBeds.available) / icuBeds.total) * 100);
  const covidRatio = Math.round((icuBeds.covid / icuBeds.occupied) * 100);

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">ICU Resource Tracker</h2>
          <p className="text-white/60">Critical care monitoring and management</p>
        </div>
        <Badge variant="danger" size="lg" className="animate-pulse">
          <Activity className="w-5 h-5 mr-2" />
          CRITICAL CARE
        </Badge>
      </div>

      {/* ICU Bed Status */}
      <GlassmorphicCard variant={variant}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Activity className="w-6 h-6 text-red-400" />
            ICU Bed Status
          </h3>
          <Badge 
            variant={icuUtilization > 80 ? 'danger' : icuUtilization > 50 ? 'warning' : 'success'} 
            size="sm"
          >
            {icuUtilization}% Utilized
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="text-center p-4 bg-white/5 rounded-xl"
          >
            <motion.p 
              className="text-3xl font-black text-white mb-1"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {icuBeds.total}
            </motion.p>
            <p className="text-xs text-white/60">Total ICU Beds</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="text-center p-4 bg-green-500/10 rounded-xl"
          >
            <motion.p 
              className="text-3xl font-black text-green-400 mb-1"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            >
              {icuBeds.available}
            </motion.p>
            <p className="text-xs text-white/60">Available</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="text-center p-4 bg-yellow-500/10 rounded-xl"
          >
            <motion.p 
              className="text-3xl font-black text-yellow-400 mb-1"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            >
              {icuBeds.occupied}
            </motion.p>
            <p className="text-xs text-white/60">Occupied</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            className="text-center p-4 bg-blue-500/10 rounded-xl"
          >
            <motion.p 
              className="text-3xl font-black text-blue-400 mb-1"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
            >
              {icuBeds.emergency}
            </motion.p>
            <p className="text-xs text-white/60">Emergency</p>
          </motion.div>
        </div>

        {/* Patient Distribution */}
        <div className="mt-6 p-4 bg-white/5 rounded-xl">
          <h4 className="text-sm font-bold text-white mb-3">Patient Distribution</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-3 bg-red-500/10 rounded-lg border border-red-500/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <span className="text-sm text-white">COVID-19 Patients</span>
              </div>
              <span className="text-lg font-bold text-red-400">{icuBeds.covid}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-sm text-white">Non-COVID Patients</span>
              </div>
              <span className="text-lg font-bold text-blue-400">{icuBeds.nonCovid}</span>
            </div>
          </div>
          <div className="mt-3 text-center">
            <Badge variant="outline" size="sm">
              COVID Ratio: {covidRatio}%
            </Badge>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Equipment Status */}
      <GlassmorphicCard variant={variant}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Monitor className="w-6 h-6 text-blue-400" />
            Critical Equipment
          </h3>
          <Badge variant="info" size="sm">
            {resources.filter(r => r.status === 'operational').length} Operational
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {resources.map((resource, index) => {
            const config = equipmentConfig[resource.type as keyof typeof equipmentConfig];
            const Icon = config.icon;
            const utilization = Math.round(((resource.total - resource.available) / resource.total) * 100);

            return (
              <motion.div
                key={resource.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                whileHover={{ scale: 1.02 }}
              >
                <GlassmorphicCard
                  variant="glass"
                  className={clsx(
                    'p-4',
                    resource.status === 'critical' && 'border-2 border-red-500/50 shadow-lg shadow-red-500/20'
                  )}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Icon className={clsx('w-5 h-5', `text-${config.color}-400`)} />
                      <div>
                        <p className="text-white font-medium">{config.label}</p>
                        <p className="text-xs text-white/60">Status: {resource.status}</p>
                      </div>
                    </div>
                    <Badge className={statusColors[resource.status]} size="xs">
                      {resource.available}/{resource.total}
                    </Badge>
                  </div>

                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={clsx(
                        'h-full rounded-full',
                        `bg-gradient-to-r from-${config.color}-500 to-${config.color}-400`
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${utilization}%` }}
                      transition={{ duration: 0.8, type: 'spring' }}
                    />
                  </div>
                  <p className="text-xs text-white/60 mt-1">{utilization}% utilized</p>

                  {config.critical && resource.available < 2 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-red-400 mt-2 flex items-center gap-1"
                    >
                      <AlertTriangle className="w-3 h-3" />
                      Critical shortage!
                    </motion.p>
                  )}
                </GlassmorphicCard>
              </motion.div>
            );
          })}
        </div>
      </GlassmorphicCard>

      {/* Staff Availability */}
      <GlassmorphicCard variant={variant}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-green-400" />
            ICU Staff
          </h3>
          <Button
            variant="glassmorphic"
            size="sm"
            leftIcon={Plus}
            onClick={() => {
              // Request additional staff
            }}
          >
            Request Staff
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {staff.map((s, index) => {
            const roleColors = {
              doctor: 'text-blue-400',
              nurse: 'text-green-400',
              respiratory: 'text-cyan-400',
              specialist: 'text-purple-400',
            } as const;

            const roleIcons = {
              doctor: Shield,
              nurse: Heart,
              respiratory: Lungs,
              specialist: Brain,
            } as const;

            const Icon = roleIcons[s.role as keyof typeof roleIcons];

            return (
              <motion.div
                key={s.role}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.05, y: -2 }}
              >
                <GlassmorphicCard variant="glass" className="p-4 text-center">
                  <Icon className={clsx('w-6 h-6 mx-auto mb-3', roleColors[s.role as keyof typeof roleColors])} />
                  <p className="text-2xl font-black text-white mb-1">{s.available}</p>
                  <p className="text-xs text-white/60 uppercase tracking-wider mb-2">{s.role}s</p>
                  <div className="flex justify-between text-xs">
                    <span className="text-white/60">On Call:</span>
                    <span className="text-white">{s.onCall}</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                    <motion.div
                      className={clsx(
                        'h-full rounded-full',
                        `bg-gradient-to-r from-green-500 to-${roleColors[s.role as keyof typeof roleColors].split('-')[1]}-500`
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${(s.available / s.count) * 100}%` }}
                      transition={{ duration: 0.8 }}
                    />
                  </div>
                </GlassmorphicCard>
              </motion.div>
            );
          })}
        </div>
      </GlassmorphicCard>

      {/* Patient Severity Tracker */}
      <GlassmorphicCard variant={variant}>
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Thermometer className="w-6 h-6 text-orange-400" />
          Patient Severity Levels
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { level: 'Critical', count: 3, color: 'red', icon: AlertTriangle },
            { level: 'Severe', count: 8, color: 'orange', icon: Activity },
            { level: 'Moderate', count: 12, color: 'yellow', icon: Clock },
            { level: 'Stable', count: 5, color: 'green', icon: CheckCircle },
          ].map((severity, i) => (
            <motion.div
              key={severity.level}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.05 }}
            >
              <GlassmorphicCard
                variant="glass"
                className={clsx(
                  'p-4 text-center',
                  `border-${severity.color}-500/30`,
                  `bg-${severity.color}-500/10`
                )}
              >
                <severity.icon className={clsx('w-8 h-8 mx-auto mb-3', `text-${severity.color}-400`)} />
                <p className="text-3xl font-black text-white mb-1">{severity.count}</p>
                <p className="text-xs text-white/60 uppercase tracking-wider">{severity.level}</p>
              </GlassmorphicCard>
            </motion.div>
          ))}
        </div>
      </GlassmorphicCard>

      {/* Alerts & Notifications */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            {alerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/30"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <p className="text-white font-medium">{alert}</p>
                </div>
                <Button
                  variant="glassmorphic"
                  size="xs"
                  onClick={() => setAlerts(prev => prev.filter(a => a !== alert))}
                >
                  Dismiss
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Real-time Chart */}
      <ActivityChart
        variant="line"
        title="ICU Occupancy Trend (24h)"
        realTime={true}
        height={250}
      />
    </motion.div>
  );
};