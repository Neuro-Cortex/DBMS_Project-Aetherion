// src/components/pharmacy/PharmacyCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin, Phone, Clock, Users, Shield, Star, Truck,
  Pill, Activity, Navigation, MessageSquare, Share2, Heart
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// ============================================
// TYPES
// ============================================
export interface Pharmacy {
  id: string;
  name: string;
  type: string;
  location: { address: string; city: string; state: string; coordinates?: { lat: number; lng: number } };
  contact: { phone: string; email: string; website?: string };
  rating: number;
  reviewCount: number;
  operatingHours: { open: string; close: string; is24x7: boolean };
  services: string[];
  paymentMethods: string[];
  delivery: { available: boolean; radius: number; charge: number; estimatedTime: string };
  verified: boolean;
  licensed: boolean;
  pharmacists: number;
  inventoryCount: number;
  specialties: string[];
  image?: string;
}

export interface PharmacyCardProps {
  pharmacy: Pharmacy;
  showActions?: boolean;
  showStats?: boolean;
  onContact?: (pharmacy: Pharmacy) => void;
  onNavigate?: (pharmacy: Pharmacy) => void;
  onViewInventory?: (pharmacy: Pharmacy) => void;
  className?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================
export const PharmacyCard: React.FC<PharmacyCardProps> = ({
  pharmacy,
  showActions = true,
  showStats = true,
  onContact,
  onNavigate,
  onViewInventory,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isOpen = pharmacy.operatingHours.is24x7;

  const typeColors: Record<string, string> = {
    '24x7': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    hospital: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    retail: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    online: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  };

  return (
    <motion.div whileHover={{ y: -4 }} onClick={() => onViewInventory?.(pharmacy)}
      className={`bg-white/[0.015] rounded-2xl border border-white/[0.06] p-5 cursor-pointer hover:border-white/[0.12] transition-all duration-300 ${className}`}>

      {/* HEADER */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-white text-2xl shadow-lg shrink-0">💊</div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-semibold text-base">{pharmacy.name}</h3>
              {pharmacy.verified && <Shield className="w-4 h-4 text-cyan-400" />}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${typeColors[pharmacy.type] || typeColors.retail}`}>
                {pharmacy.type === '24x7' ? '24/7 Open' : pharmacy.type}
              </span>
              {pharmacy.licensed && <Badge variant="success" size="xs">Licensed</Badge>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-amber-500/10 rounded-lg px-2 py-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-white text-sm font-bold">{pharmacy.rating}</span>
          <span className="text-white/30 text-[10px]">({pharmacy.reviewCount})</span>
        </div>
      </div>

      {/* INFO */}
      <div className="space-y-2 mb-4">
        <span className="flex items-center gap-1.5 text-white/40 text-xs"><MapPin className="w-3.5 h-3.5" />{pharmacy.location.address}, {pharmacy.location.city}</span>
        <span className="flex items-center gap-1.5 text-white/40 text-xs"><Phone className="w-3.5 h-3.5" />{pharmacy.contact.phone}</span>
        <span className="flex items-center gap-1.5 text-white/40 text-xs"><Clock className="w-3.5 h-3.5" />{isOpen ? 'Open 24/7' : `${pharmacy.operatingHours.open} - ${pharmacy.operatingHours.close}`}</span>
      </div>

      {/* STATS */}
      {showStats && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 rounded-lg bg-white/[0.02]">
            <Users className="w-3.5 h-3.5 text-white/30 mx-auto mb-1" />
            <p className="text-white text-xs font-bold">{pharmacy.pharmacists}</p>
            <p className="text-white/25 text-[10px]">Pharmacists</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/[0.02]">
            <Pill className="w-3.5 h-3.5 text-white/30 mx-auto mb-1" />
            <p className="text-white text-xs font-bold">{pharmacy.inventoryCount}</p>
            <p className="text-white/25 text-[10px]">Medicines</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-white/[0.02]">
            <Star className="w-3.5 h-3.5 text-white/30 mx-auto mb-1" />
            <p className="text-white text-xs font-bold">{pharmacy.specialties.length}</p>
            <p className="text-white/25 text-[10px]">Specialties</p>
          </div>
        </div>
      )}

      {/* SERVICES */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {pharmacy.services.slice(0, 3).map((s) => (
          <span key={s} className="px-2 py-0.5 rounded-full bg-white/[0.02] text-white/35 text-[10px] border border-white/[0.04]">{s}</span>
        ))}
        {pharmacy.services.length > 3 && <span className="text-white/25 text-[10px]">+{pharmacy.services.length - 3} more</span>}
      </div>

      {/* DELIVERY */}
      {pharmacy.delivery.available && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 mb-4">
          <span className="flex items-center gap-1.5 text-emerald-400 text-xs"><Truck className="w-3.5 h-3.5" />Delivery Available</span>
          <span className="text-white/50 text-[10px]">{pharmacy.delivery.estimatedTime} • {pharmacy.delivery.charge === 0 ? 'Free' : `$${pharmacy.delivery.charge}`}</span>
        </div>
      )}

      {/* ACTIONS */}
      {showActions && (
        <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
          <Button variant="gradient" size="sm" onClick={(e) => { e.stopPropagation(); onContact?.(pharmacy); }} className="flex-1 gap-1.5">
            <Phone className="w-3.5 h-3.5" /> Contact
          </Button>
          <Button variant="glass" size="sm" onClick={(e) => { e.stopPropagation(); onNavigate?.(pharmacy); }} className="gap-1.5">
            <Navigation className="w-3.5 h-3.5" /> Navigate
          </Button>
          <button type="button" onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            className="p-2 hover:bg-white/[0.06] rounded-lg transition-colors">
            <Share2 className="w-4 h-4 text-white/30" />
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default PharmacyCard;