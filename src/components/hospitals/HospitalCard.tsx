import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Hospital,
  MapPin,
  Phone,
  Star,
  Bed,
  Activity,
  Shield,
  Heart,
  Ambulance,
  Users,
  Clock,
  ChevronRight,
  PhoneCall,
  Calendar,
  Navigation
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Avatar } from '../../ui/Avatar';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface Hospital {
  id: string;
  name: string;
  type: 'general' | 'specialized' | 'multispecialty' | 'clinic';
  location: {
    address: string;
    city: string;
    state: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    emergency: string;
    email: string;
  };
  rating: number;
  reviewCount: number;
  beds: {
    total: number;
    available: number;
    icu: {
      total: number;
      available: number;
    };
    emergency: number;
  };
  services: string[];
  specialties: string[];
  emergency: boolean;
  ambulance: boolean;
  bloodBank: boolean;
  oxygen: boolean;
  verified: boolean;
  premium?: boolean;
  distance?: number;
  eta?: number;
  images?: string[];
  doctorsCount: number;
  established: number;
}

export interface HospitalCardProps {
  hospital: Hospital;
  variant?: 'glass' | 'gradient' | 'neon' | 'minimal';
  showActions?: boolean;
  showStats?: boolean;
  compact?: boolean;
  onViewDetails?: (hospital: Hospital) => void;
  onEmergencyCall?: (hospital: Hospital) => void;
  onBookAppointment?: (hospital: Hospital) => void;
  className?: string;
}

// ============================================
// HOSPITAL CARD COMPONENT
// ============================================
export const HospitalCard: React.FC<HospitalCardProps> = ({
  hospital,
  variant = 'glass',
  showActions = true,
  showStats = true,
  compact = false,
  onViewDetails,
  onEmergencyCall,
  onBookAppointment,
  className,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const bedUtilization = Math.round(((hospital.beds.total - hospital.beds.available) / hospital.beds.total) * 100);
  const icuUtilization = Math.round(((hospital.beds.icu.total - hospital.beds.icu.available) / hospital.beds.icu.total) * 100);

  return (
    <motion.div
      whileHover={{ scale: compact ? 1 : 1.02, y: compact ? 0 : -5 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <GlassmorphicCard
        variant={variant === 'glass' ? 'glass' : variant === 'gradient' ? 'gradient' : 'neon'}
        className={twMerge(
          clsx(
            'p-6 transition-all duration-300 cursor-pointer overflow-hidden',
            compact ? 'p-4' : '',
            className
          )
        )}
        onClick={() => onViewDetails?.(hospital)}
      >
        {/* Premium Badge */}
        <AnimatePresence>
          {hospital.premium && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="absolute top-4 right-4 z-10"
            >
              <Badge variant="gradient" size="xs" className="shadow-lg shadow-purple-500/50">
                PREMIUM
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start gap-4 flex-1">
            {/* Hospital Avatar */}
            <motion.div
              whileHover={{ scale: 1.1, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Avatar
                src={!imageError ? hospital.images?.[0] : undefined}
                name={hospital.name}
                size={compact ? 'md' : 'lg'}
                onError={() => setImageError(true)}
                className={clsx(
                  'border-2',
                  hospital.verified ? 'border-cyan-400' : 'border-white/20'
                )}
              />
              {/* Verification Badge */}
              {hospital.verified && (
                <motion.div
                  className="absolute -bottom-1 -right-1"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                >
                  <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                    <Shield className="w-3 h-3 text-white" />
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Basic Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <motion.h3 
                    className="text-xl font-bold text-white mb-1 truncate"
                    animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
                  >
                    {hospital.name}
                  </motion.h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="secondary" size="xs">
                      {hospital.type}
                    </Badge>
                    {hospital.emergency && (
                      <Badge variant="danger" size="xs" className="animate-pulse">
                        <Ambulance className="w-3 h-3 mr-1" />
                        24/7 Emergency
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Rating */}
                <motion.div 
                  className="flex items-center gap-1"
                  whileHover={{ scale: 1.05 }}
                >
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-sm font-bold text-white">{hospital.rating}</span>
                  <span className="text-xs text-white/60">({hospital.reviewCount})</span>
                </motion.div>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
                <MapPin className="w-4 h-4" />
                <span className="truncate">
                  {hospital.location.address}, {hospital.location.city}
                </span>
                {hospital.distance && (
                  <Badge variant="outline" size="xs">
                    {hospital.distance} km
                  </Badge>
                )}
                {hospital.eta && (
                  <Badge variant="info" size="xs">
                    ETA {hospital.eta} min
                  </Badge>
                )}
              </div>

              {/* Quick Stats */}
              {!compact && showStats && (
                <motion.div 
                  className="flex items-center gap-4 text-xs text-white/60"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {hospital.doctorsCount} doctors
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Since {hospital.established}
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="w-3 h-3" />
                    {hospital.specialties.length} specialties
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Services */}
          {!compact && (
            <motion.div 
              className="mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex flex-wrap gap-2">
                {hospital.services.slice(0, 4).map((service, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1, type: 'spring' }}
                    className="text-xs px-2 py-1 bg-white/10 rounded-lg text-white/80"
                  >
                    {service}
                  </motion.span>
                ))}
                {hospital.services.length > 4 && (
                  <span className="text-xs px-2 py-1 text-white/60">
                    +{hospital.services.length - 4} more
                  </span>
                )}
              </div>
            </motion.div>
          )}

          {/* Bed Availability */}
          <motion.div 
            className="mb-5 p-4 rounded-xl bg-white/5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Bed className="w-4 h-4 text-blue-400" />
                Bed Availability
              </h4>
              <Badge 
                variant={bedUtilization > 80 ? 'danger' : bedUtilization > 50 ? 'warning' : 'success'} 
                size="xs"
              >
                {bedUtilization}% Full
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="text-center">
                <motion.p 
                  className="text-2xl font-black text-white"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {hospital.beds.available}
                </motion.p>
                <p className="text-xs text-white/60">General Beds</p>
                <div className="w-full h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-green-500 to-cyan-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - bedUtilization}%` }}
                    transition={{ duration: 1, type: 'spring' }}
                  />
                </div>
              </div>
              <div className="text-center">
                <motion.p 
                  className="text-2xl font-black text-white"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                >
                  {hospital.beds.icu.available}
                </motion.p>
                <p className="text-xs text-white/60">ICU Beds</p>
                <div className="w-full h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-red-500 to-orange-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${100 - icuUtilization}%` }}
                    transition={{ duration: 1, type: 'spring' }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Emergency Features */}
          <motion.div 
            className="mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex flex-wrap gap-2">
              {hospital.ambulance && (
                <Badge variant="danger" size="xs" className="animate-pulse">
                  <Ambulance className="w-3 h-3 mr-1" />
                  Ambulance Available
                </Badge>
              )}
              {hospital.bloodBank && (
                <Badge variant="secondary" size="xs">
                  <Heart className="w-3 h-3 mr-1" />
                  Blood Bank
                </Badge>
              )}
              {hospital.oxygen && (
                <Badge variant="info" size="xs">
                  <Activity className="w-3 h-3 mr-1" />
                  Oxygen Supply
                </Badge>
              )}
            </div>
          </motion.div>

          {/* Actions */}
          {showActions && (
            <motion.div 
              className="flex gap-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                variant="gradient"
                size="sm"
                fullWidth
                leftIcon={Calendar}
                onClick={(e) => {
                  e.stopPropagation();
                  onBookAppointment?.(hospital);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Book Appointment
              </Button>
              <Button
                variant="neon"
                size="sm"
                leftIcon={PhoneCall}
                onClick={(e) => {
                  e.stopPropagation();
                  onEmergencyCall?.(hospital);
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Emergency Call
              </Button>
              <Button
                variant="glassmorphic"
                size="sm"
                iconOnly
                onClick={(e) => {
                  e.stopPropagation();
                  // Open navigation
                }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
              >
                <Navigation className="w-4 h-4" />
              </Button>
            </motion.div>
          )}
        </div>

        {/* Glow Effect on Hover */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 rounded-2xl opacity-0 blur-xl -z-10"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </GlassmorphicCard>
    </motion.div>
  );
};