// src/components/doctor/DoctorCard.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Star, MapPin, Award, Clock, Phone, Video,
  MessageSquare, Heart, Verified, Users, TrendingUp
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// ============================================
// TYPES
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
  variant?: 'default' | 'compact' | 'featured';
  showActions?: boolean;
  showStats?: boolean;
  onBookAppointment?: (doctor: Doctor) => void;
  onViewProfile?: (doctor: Doctor) => void;
  className?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================
export const DoctorCard: React.FC<DoctorCardProps> = ({
  doctor,
  variant = 'default',
  showActions = true,
  showStats = true,
  onBookAppointment,
  onViewProfile,
  className = '',
}) => {
  const [imageError, setImageError] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // COMPACT VARIANT
  if (variant === 'compact') {
    return (
      <motion.div whileHover={{ y: -2 }} onClick={() => onViewProfile?.(doctor)}
        className={`bg-white/[0.015] rounded-xl border border-white/[0.06] p-4 cursor-pointer hover:border-white/[0.12] transition-all ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
            {doctor.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-white text-sm font-medium truncate">{doctor.name}</p>
              {doctor.verified && <Verified className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
            </div>
            <p className="text-white/35 text-xs truncate">{doctor.specialty}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-white/60 text-xs font-bold">{doctor.rating}</span>
          </div>
        </div>
      </motion.div>
    );
  }

  // FEATURED VARIANT
  if (variant === 'featured') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -5 }}
        onClick={() => onViewProfile?.(doctor)}
        className={`relative bg-gradient-to-br from-purple-500/5 to-pink-500/5 backdrop-blur-sm rounded-2xl border border-purple-500/10 overflow-hidden cursor-pointer hover:border-purple-500/20 transition-all ${className}`}>
        {doctor.premium && (
          <div className="absolute top-4 right-4 z-10">
            <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-bold shadow-lg">PREMIUM</span>
          </div>
        )}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl">
                {doctor.name.charAt(0)}
              </div>
              {doctor.verified && (
                <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-[#050508]">
                  <Verified className="w-3.5 h-3.5 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-bold text-white">{doctor.name}</h3>
              <p className="text-white/50 text-sm">{doctor.title}</p>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <Badge variant="success" size="xs" className="gap-1"><Star className="w-3 h-3 fill-amber-400 text-amber-400" />{doctor.rating}</Badge>
                <Badge variant="info" size="xs">{doctor.specialty}</Badge>
                <span className="text-white/30 text-xs">{doctor.experience} yrs exp</span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                <Button variant="gradient" size="sm" onClick={(e) => { e.stopPropagation(); onBookAppointment?.(doctor); }} className="gap-2">
                  <Calendar className="w-4 h-4" /> Book Appointment
                </Button>
                <Button variant="glass" size="sm" onClick={(e) => { e.stopPropagation(); onViewProfile?.(doctor); }} className="gap-2">
                  <User className="w-4 h-4" /> View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // DEFAULT VARIANT
  return (
    <motion.div whileHover={{ y: -4 }} onClick={() => onViewProfile?.(doctor)}
      className={`relative bg-white/[0.015] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-5 cursor-pointer hover:border-white/[0.12] transition-all duration-300 group ${className}`}>
      
      {/* Premium Badge */}
      {doctor.premium && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="warning" size="xs" className="shadow-lg">PREMIUM</Badge>
        </div>
      )}

      {/* Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
            {doctor.name.charAt(0)}
          </div>
          {doctor.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-[#050508]">
              <Verified className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-white font-semibold text-base truncate">{doctor.name}</h3>
              <p className="text-white/40 text-xs">{doctor.title}</p>
            </div>
            <div className="flex items-center gap-1 bg-amber-500/10 rounded-lg px-2 py-1 shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="text-white text-sm font-bold">{doctor.rating}</span>
              <span className="text-white/30 text-[10px]">({doctor.reviewCount})</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="info" size="xs">{doctor.specialty}</Badge>
            <span className="flex items-center gap-1 text-white/35 text-xs"><MapPin className="w-3 h-3" />{doctor.location}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      {showStats && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-white/[0.02]">
            <Award className="w-3.5 h-3.5 text-white/30 mx-auto mb-1" />
            <p className="text-white text-xs font-bold">{doctor.experience}y</p>
            <p className="text-white/25 text-[10px]">Experience</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/[0.02]">
            <MessageSquare className="w-3.5 h-3.5 text-white/30 mx-auto mb-1" />
            <p className="text-white text-xs font-bold">{doctor.reviewCount}</p>
            <p className="text-white/25 text-[10px]">Reviews</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/[0.02]">
            <Heart className="w-3.5 h-3.5 text-white/30 mx-auto mb-1" />
            <p className="text-white text-xs font-bold">{doctor.languages.length}</p>
            <p className="text-white/25 text-[10px]">Languages</p>
          </div>
        </div>
      )}

      {/* Availability */}
      <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/40 text-[10px] uppercase tracking-wider">Next Available</p>
            <p className="text-white text-sm font-medium">{doctor.nextAvailable}</p>
          </div>
          <Badge variant={doctor.availableSlots > 0 ? 'success' : 'danger'} size="xs">
            {doctor.availableSlots > 0 ? `${doctor.availableSlots} slots` : 'Full'}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      {showActions && (
        <div className="flex items-center gap-2">
          <Button variant="gradient" size="sm" onClick={(e) => { e.stopPropagation(); onBookAppointment?.(doctor); }} className="flex-1 gap-1.5">
            <Calendar className="w-4 h-4" /> Book
          </Button>
          <Button variant="glass" size="sm" onClick={(e) => { e.stopPropagation(); /* Video call */ }} className="gap-1.5">
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="glass" size="sm" onClick={(e) => { e.stopPropagation(); /* Message */ }} className="gap-1.5">
            <MessageSquare className="w-4 h-4" />
          </Button>
        </div>
      )}

      {/* Expanding Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="mt-4 pt-4 border-t border-white/[0.04] space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {doctor.services.map((s, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.03] text-white/40 text-[10px] border border-white/[0.04]">{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expand Toggle */}
      <button type="button" onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
        className="w-full mt-3 pt-2 border-t border-white/[0.04] text-white/20 hover:text-white/40 text-[10px] transition-colors">
        {isExpanded ? 'Show less' : 'Show more'}
      </button>
    </motion.div>
  );
};

// Missing import
import { Calendar } from 'lucide-react';

export default DoctorCard;