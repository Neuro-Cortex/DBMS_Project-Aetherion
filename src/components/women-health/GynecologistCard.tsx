import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User,
  Star,
  Clock,
  MapPin,
  Phone,
  Video,
  Shield,
  Heart,
  Baby,
  Award,
  Calendar,
  MessageSquare,
  Globe
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlassmorphicCard } from 'src/components/ui/GlassmorphicCard';
import { Button } from 'src/components/ui/Button';
import { Badge } from 'src/components/ui/Badge';
import { Avatar } from 'src/components/ui/Avatar';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface Gynecologist {
  id: string;
  name: string;
  image?: string;
  specializations: string[];
  experience: number;
  rating: number;
  reviewCount: number;
  hospital: string;
  location: string;
  languages: string[];
  consultationFee: number;
  nextAvailable: string;
  isOnline: boolean;
  isVerified: boolean;
  treatsConditions: string[];
  degrees: string[];
}

export interface GynecologistCardProps {
  doctor: Gynecologist;
  variant?: 'glass' | 'gradient' | 'neon';
  onBookAppointment?: (doctorId: string) => void;
  onAskQuestion?: (doctorId: string) => void;
  className?: string;
}

// ============================================
// GYNECOLOGIST CARD COMPONENT
// ============================================
export const GynecologistCard: React.FC<GynecologistCardProps> = ({
  doctor,
  variant = 'glass',
  onBookAppointment,
  onAskQuestion,
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <GlassmorphicCard
        variant={variant}
        className={twMerge(clsx('p-0 overflow-hidden', className))}
      >
        {/* Top Gradient Bar */}
        <div className="h-2 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />

        <div className="p-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-5">
            <motion.div whileHover={{ scale: 1.05 }} className="relative">
              <Avatar
                src={!imageError ? doctor.image : undefined}
                name={doctor.name}
                size="lg"
                className="border-2 border-pink-400/50"
                onError={() => setImageError(true)}
              />
              {doctor.isOnline && (
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-900" />
              )}
              {doctor.isVerified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-gray-900"
                >
                  <Shield className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.div>

            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-white truncate">{doctor.name}</h3>
              <p className="text-sm text-white/60 mb-2">{doctor.degrees.join(', ')}</p>
              
              <div className="flex items-center gap-3 mb-3">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-bold text-white">{doctor.rating}</span>
                  <span className="text-xs text-white/50">({doctor.reviewCount})</span>
                </div>
                <Badge variant="secondary" size="xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {doctor.experience} yrs exp
                </Badge>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {doctor.specializations.map((spec, i) => (
                  <Badge key={i} variant="outline" size="xs" className="border-pink-500/30 text-pink-300">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            <div className="p-3 bg-white/5 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="w-3 h-3 text-white/40" />
                <span className="text-xs text-white/60">Hospital</span>
              </div>
              <p className="text-sm text-white truncate">{doctor.hospital}</p>
            </div>
            <div className="p-3 bg-white/5 rounded-xl">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="w-3 h-3 text-white/40" />
                <span className="text-xs text-white/60">Languages</span>
              </div>
              <p className="text-sm text-white truncate">{doctor.languages.join(', ')}</p>
            </div>
          </div>

          {/* Treats Conditions */}
          <div className="mb-5">
            <p className="text-xs text-white/60 mb-2">Treats Conditions:</p>
            <div className="flex flex-wrap gap-1.5">
              {doctor.treatsConditions.slice(0, 4).map((condition, i) => (
                <span key={i} className="text-xs px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded-md">
                  {condition}
                </span>
              ))}
              {doctor.treatsConditions.length > 4 && (
                <span className="text-xs px-2 py-0.5 text-white/40">
                  +{doctor.treatsConditions.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Fee & Availability */}
          <div className="flex items-center justify-between p-3 bg-gradient-to-r from-pink-600/10 to-purple-600/10 rounded-xl border border-pink-500/20 mb-5">
            <div>
              <p className="text-xs text-white/60">Consultation Fee</p>
              <p className="text-xl font-black text-white">${doctor.consultationFee}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-white/60">Next Available</p>
              <Badge variant="success" size="sm">{doctor.nextAvailable}</Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="gradient"
              size="sm"
              fullWidth
              leftIcon={Calendar}
              onClick={() => onBookAppointment?.(doctor.id)}
              className="bg-gradient-to-r from-pink-600 to-purple-600"
            >
              Book Visit
            </Button>
            <Button
              variant="neon"
              size="sm"
              leftIcon={Video}
              onClick={() => {}}
            >
              Video
            </Button>
            <Button
              variant="glassmorphic"
              size="sm"
              iconOnly
              onClick={() => onAskQuestion?.(doctor.id)}
            >
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GlassmorphicCard>
    </motion.div>
  );
};