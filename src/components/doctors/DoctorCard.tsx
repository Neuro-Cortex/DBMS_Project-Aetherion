import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Star, 
  MapPin, 
  DollarSign, 
  Calendar,
  Clock,
  Phone,
  Video,
  MessageSquare,
  Heart,
  Award,
  Verified,
  TrendingUp
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
export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  avatar?: string;
  rating: number;
  reviewCount: number;
  experience: number;
  price: number;
  location: string;
  hospital: string;
  availableSlots: number;
  nextAvailable: string;
  verified: boolean;
  premium?: boolean;
  languages: string[];
  services: string[];
  education: string[];
  achievements: string[];
}

export interface DoctorCardProps {
  doctor: Doctor;
  variant?: 'glass' | 'gradient' | 'neon' | 'minimal';
  compact?: boolean;
  showActions?: boolean;
  showStats?: boolean;
  onBookAppointment?: (doctor: Doctor) => void;
  onViewProfile?: (doctor: Doctor) => void;
  className?: string;
}

// ============================================
// VARIANT STYLES
// ============================================
const variantStyles = {
  glass: `
    bg-white/10 dark:bg-gray-900/10
    backdrop-blur-xl backdrop-saturate-150
    border border-white/20 dark:border-gray-700/20
  `,
  gradient: `
    bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-red-500/20
    border border-purple-500/30
  `,
  neon: `
    bg-gray-900/90 dark:bg-black/90
    border-2 border-cyan-500/50
    shadow-[0_0_30px_rgba(6,182,212,0.3)]
  `,
  minimal: `
    bg-transparent border-0
  `,
};

// ============================================
// DOCTOR CARD COMPONENT
// ============================================
export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  variant = 'glass',
  compact = false,
  showActions = true,
  showStats = true,
  onBookAppointment,
  onViewProfile,
  className,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <GlassmorphicCard
        variant={variant === 'glass' ? 'glass' : variant === 'gradient' ? 'gradient' : 'neon'}
        className={twMerge(
          clsx(
            'p-6 transition-all duration-300',
            'cursor-pointer',
            className
          )
        )}
        onClick={() => onViewProfile?.(doctor)}
      >
        {/* Premium Badge */}
        <AnimatePresence>
          {doctor.premium && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="absolute top-4 right-4"
            >
              <Badge variant="gradient" size="xs" className="shadow-lg shadow-purple-500/50">
                PRO
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Avatar
              src={!imageError ? doctor.avatar : undefined}
              name={doctor.name}
              size={compact ? 'md' : 'lg'}
              onError={() => setImageError(true)}
              className={clsx(
                'border-2',
                doctor.verified ? 'border-cyan-400' : 'border-white/20'
              )}
            />
            {/* Verification Badge */}
            {doctor.verified && (
              <motion.div
                className="absolute -bottom-1 -right-1"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
              >
                <div className="w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                  <Verified className="w-3 h-3 text-white" />
                </div>
              </motion.div>
            )}
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <motion.h3 
                  className="text-lg font-bold text-white truncate"
                  animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
                >
                  {doctor.name}
                </motion.h3>
                <p className="text-sm text-white/70">{doctor.title}</p>
              </div>
              {/* Rating */}
              <motion.div 
                className="flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-bold text-white">{doctor.rating}</span>
                <span className="text-xs text-white/60">({doctor.reviewCount})</span>
              </motion.div>
            </div>

            {/* Specialty & Location */}
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="secondary" size="xs">
                {doctor.specialty}
              </Badge>
              <div className="flex items-center gap-1 text-xs text-white/60">
                <MapPin className="w-3 h-3" />
                <span className="truncate">{doctor.location}</span>
              </div>
            </div>

            {/* Quick Stats */}
            {showStats && (
              <motion.div 
                className="flex items-center gap-4 text-xs text-white/60"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <div className="flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  {doctor.experience} years
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {doctor.reviewCount} reviews
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="w-3 h-3" />
                  {doctor.languages.length} languages
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Availability Info */}
        <motion.div 
          className="mb-5 p-3 rounded-xl bg-white/5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-white/70">Next Available</span>
            <Badge 
              variant={doctor.availableSlots > 0 ? 'success' : 'danger'} 