// src/components/women/GynecologistCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Star, Clock, MapPin, Video, Shield, Award, Calendar, MessageSquare, Globe
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// ============================================
// TYPES
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
  onBookAppointment?: (doctorId: string) => void;
  onAskQuestion?: (doctorId: string) => void;
  className?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================
export const GynecologistCard: React.FC<GynecologistCardProps> = ({
  doctor,
  onBookAppointment,
  onAskQuestion,
  className = '',
}) => {
  const [imageError] = useState(false);

  return (
    <motion.div whileHover={{ y: -4 }} className={className}>
      <GlassmorphicCard variant="elevated" padding="none" hover="glow">
        
        {/* Top accent bar */}
        <div className="h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500" />

        <div className="p-5">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                {doctor.name.charAt(0)}
              </div>
              {doctor.isOnline && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#050508]" />
              )}
              {doctor.isVerified && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-[#050508]">
                  <Shield className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-base truncate">{doctor.name}</h3>
              <p className="text-white/35 text-xs mt-0.5">{doctor.degrees.join(', ')}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-white text-sm font-bold">{doctor.rating}</span>
                  <span className="text-white/30 text-[10px]">({doctor.reviewCount})</span>
                </div>
                <span className="text-white/15">•</span>
                <span className="text-white/35 text-xs">{doctor.experience}y exp</span>
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {doctor.specializations.map((spec) => (
              <Badge key={spec} variant="info" size="xs">{spec}</Badge>
            ))}
          </div>

          {/* Info */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-white/30 text-[10px] mb-0.5"><MapPin className="w-3 h-3" />Hospital</div>
              <p className="text-white/60 text-xs truncate">{doctor.hospital}</p>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-1.5 text-white/30 text-[10px] mb-0.5"><Globe className="w-3 h-3" />Languages</div>
              <p className="text-white/60 text-xs truncate">{doctor.languages.join(', ')}</p>
            </div>
          </div>

          {/* Conditions */}
          <div className="mb-4">
            <p className="text-white/30 text-[10px] uppercase tracking-wider mb-2">Treats</p>
            <div className="flex flex-wrap gap-1.5">
              {doctor.treatsConditions.slice(0, 4).map((c) => (
                <span key={c} className="px-2 py-0.5 rounded-full bg-white/[0.02] text-white/40 text-[10px] border border-white/[0.04]">{c}</span>
              ))}
              {doctor.treatsConditions.length > 4 && (
                <span className="text-white/25 text-[10px]">+{doctor.treatsConditions.length - 4} more</span>
              )}
            </div>
          </div>

          {/* Fee + Availability */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-pink-500/5 border border-pink-500/10 mb-4">
            <div>
              <p className="text-white/40 text-[10px]">Fee</p>
              <p className="text-white font-bold">${doctor.consultationFee}</p>
            </div>
            <div className="text-right">
              <p className="text-white/40 text-[10px]">Available</p>
              <Badge variant="success" size="xs">{doctor.nextAvailable}</Badge>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="gradient" size="sm" onClick={() => onBookAppointment?.(doctor.id)} className="flex-1 gap-1.5">
              <Calendar className="w-4 h-4" /> Book
            </Button>
            <Button variant="glass" size="sm" className="gap-1.5">
              <Video className="w-4 h-4" /> Video
            </Button>
            <Button variant="glass" size="sm" onClick={() => onAskQuestion?.(doctor.id)}>
              <MessageSquare className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </GlassmorphicCard>
    </motion.div>
  );
};

export default GynecologistCard;