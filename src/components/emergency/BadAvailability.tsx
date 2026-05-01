import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bed,
  Activity,
  Heart,
  Baby,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  RefreshCw,
  Navigation,
  Phone
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { StatCard } from '../dashboard/StatCard';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface BedData {
  type: 'general' | 'icu' | 'pediatric' | 'maternity' | 'emergency' | 'isolation';
  total: number;
  occupied: number;
  available: number;
  price: number;
  features: string[];
}

export interface BedAvailabilityProps {
  beds: BedData[];
  hospitalId: string;
  variant?: 'glass' | 'gradient' | 'neon';
  realTime?: boolean;
  updateInterval?: number;
  onBedBooking?: (type: string, count: number) => void;
  onAlert?: (message: string) => void;
  className?: string;
}

// ============================================
// BED TYPE CONFIGURATION
// ============================================
const bedTypeConfig = {
  general: {
    icon: Bed,
    color: 'blue',
    label: 'General Beds',
    description: 'Standard inpatient care',
  },
  icu: {
    icon: Activity,
    color: 'red',
    label: 'ICU Beds',
    description: 'Critical care with monitoring',
  },
  pediatric: {
    icon: Baby,
    color: 'pink',
    label: 'Pediatric Beds',
    description: 'Specialized for children',
  },
  maternity: {
    icon: Heart,
    color: 'purple',
    label: 'Maternity Beds',
    description: 'Labor and delivery care',
  },
  emergency: {
    icon: Users,
    color: 'yellow',
    label: 'Emergency Beds',
    description: '24/7 emergency care',
  },
  isolation: {
    icon: Shield,
    color: 'green',
    label: 'Isolation Beds',
    description: 'Infectious disease control',
  },
} as const;

// ============================================
// BED AVAILABILITY COMPONENT
// ============================================
export const BedAvailability: React.FC<BedAvailabilityProps> = ({
  beds: initialBeds,
  hospitalId,
  variant = 'glass',
  realTime = false,
  updateInterval = 5000,
  onBedBooking,
  onAlert,
  className,
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
        
        // Check for critical levels
        if (newAvailable < 3 && !alerts.includes(bed.type)) {
          const alert = `${bedTypeConfig[bed.type as keyof typeof bedTypeConfig].label} critically low! Only ${newAvailable} beds left`;
          setAlerts(prev => [...prev, alert]);
          onAlert?.(alert);
        }
        
        return {
          ...bed,
          occupied: newOccupied,
          available: newAvailable,
        };
      }));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [realTime, updateInterval, alerts, onAlert]);

  // Clear old alerts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts(prev => prev.filter(alert => !alert.includes('critically low')));
    }, 30000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const handleBooking = (type: string) => {
    onBedBooking?.(type, bookingCount);
    setSelectedType(null);
  };

  const totalBeds = beds.reduce((acc, bed) => acc + bed.total, 0);
  const totalAvailable = beds.reduce((acc, bed) => acc + bed.available, 0);
  const overallUtilization = Math.round(((totalBeds - totalAvailable) / totalBeds) * 100);

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
      {/* Header with Stats */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Bed Availability</h2>
          <p className="text-white/60">Real-time bed tracking and management</p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" size="sm">
            <Activity className="w-3 h-3 mr-1" />
            {realTime ? 'Live Updates' : 'Static Data'}
          </Badge>
          <Button
            variant="neon"
            size="sm"
            leftIcon={RefreshCw}
            onClick={() => {
              // Force refresh
              setBeds([...beds]);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
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

      {/* Overall Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Beds"
          value={totalBeds}
          icon={Bed}
          variant="neon"
          color="blue"
        />
        <StatCard
          title="Available"
          value={totalAvailable}
          icon={CheckCircle}
          variant="neon"
          color="green"
        />
        <StatCard
          title="Utilization"
          value={`${overallUtilization}%`}
          icon={TrendingUp}
          variant="neon"
          color="purple"
        />
        <StatCard
          title="ICU Beds"
          value={beds.find(b => b.type === 'icu')?.available || 0}
          icon={Activity}
          variant="neon"
          color="red"
        />
      </div>

      {/* Bed Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beds.map((bed, index) => {
          const config = bedTypeConfig[bed.type as keyof typeof bedTypeConfig];
          const Icon = config.icon;
          const utilization = Math.round(((bed.total - bed.available) / bed.total) * 100);
          const isCritical = bed.available < 3;

          return (
            <motion.div
              key={bed.type}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.02, y: -5 }}
              onClick={() => setSelectedType(bed.type)}
            >
              <GlassmorphicCard
                variant={variant}
                className={clsx(
                  'p-6 cursor-pointer transition-all',
                  isCritical && 'border-2 border-red-500/50 shadow-lg shadow-red-500/20'
                )}
              >
                {/* Critical Alert */}
                <AnimatePresence>
                  {isCritical && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute top-4 right-4"
                    >
                      <Badge variant="danger" size="xs" pulse>
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Critical
                      </Badge>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={clsx(
                      'p-3 rounded-xl',
                      `bg-${config.color}-500/10`,
                      `text-${config.color}-300`
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <Badge 
                    variant={bed.available > 5 ? 'success' : bed.available > 0 ? 'warning' : 'danger'} 
                    size="sm"
                  >
                    {bed.available} free
                  </Badge>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-1">{config.label}</h3>
                <p className="text-xs text-white/60 mb-4">{config.description}</p>

                {/* Availability */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Available</span>
                    <motion.span 
                      className="text-2xl font-black text-white"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    >
                      {bed.available}
                    </motion.span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">Total</span>
                    <span className="text-sm font-medium text-white">{bed.total}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className={clsx(
                        'h-full rounded-full',
                        `bg-gradient-to-r from-${config.color}-500 to-${config.color}-400`,
                        'shadow-lg'
                      )}
                      initial={{ width: 0 }}
                      animate={{ width: `${utilization}%` }}
                      transition={{ duration: 1, type: 'spring' }}
                    />
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-xs text-white/60">Utilization</span>
                    <span className="text-xs font-medium text-white">{utilization}%</span>
                  </div>
                </div>

                {/* Price */}
                <motion.div 
                  className="mt-4 pt-4 border-t border-white/10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/70">Price per day</span>
                    <span className="text-lg font-bold text-green-400">${bed.price}</span>
                  </div>
                </motion.div>

                {/* Features */}
                <motion.div 
                  className="mt-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex flex-wrap gap-1">
                    {bed.features.slice(0, 3).map((feature, i) => (
                      <Badge key={i} variant="outline" size="xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              </GlassmorphicCard>
            </motion.div>
          );
        })}
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {selectedType && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedType(null)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-md bg-gray-900/90 border border-white/20 rounded-2xl shadow-2xl p-6"
            >
              <h3 className="text-xl font-bold text-white mb-4">
                Book {bedTypeConfig[selectedType as keyof typeof bedTypeConfig].label}
              </h3>
              
              <div className="mb-4 p-4 bg-white/5 rounded-xl">
                <p className="text-sm text-white/70 mb-2">Available beds: 
                  <span className="text-white font-bold ml-1">
                    {beds.find(b => b.type === selectedType)?.available}
                  </span>
                </p>
                <p className="text-sm text-white/70">Price per day: 
                  <span className="text-green-400 font-bold ml-1">
                    ${beds.find(b => b.type === selectedType)?.price}
                  </span>
                </p>
              </div>

              <div className="mb-4">
                <label className="block text-sm text-white/70 mb-2">Number of beds</label>
                <input
                  type="number"
                  min="1"
                  max={beds.find(b => b.type === selectedType)?.available || 1}
                  value={bookingCount}
                  onChange={(e) => setBookingCount(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="glassmorphic"
                  size="sm"
                  fullWidth
                  onClick={() => setSelectedType(null)}
                >
                  Cancel
                </Button>
                <Button
                  variant="gradient"
                  size="sm"
                  fullWidth
                  onClick={() => handleBooking(selectedType)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Confirm Booking
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};