// src/components/hospital/HospitalCard.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Star, MapPin, Phone, Clock, Award, Bed,
  Heart, ChevronRight, Building2, Users,
  Navigation, BadgeCheck, Wifi, Car, ChevronDown, Truck
} from 'lucide-react';
import type { HospitalListItem, HospitalCardProps } from '@/types/hospital';
import {
  getBedSummary, hasEmergency, hasAmbulance, hasBloodBank,
  hasOxygen, isVerified, isPremium, getCity, getState,
  getPhone, getEmergencyPhone, getEmail, getEstablished
} from '@/utils/hospitalHelpers';

// ============================================
// SUB-COMPONENTS
// ============================================

const StarRating: React.FC<{ rating: number; count: number; size?: 'sm' | 'md' }> = ({ rating, count, size = 'sm' }) => (
  <div className="flex items-center gap-1.5">
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star key={star} className={`${size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} ${star <= Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />
      ))}
    </div>
    <span className="text-white/50 text-xs font-medium">{rating}</span>
    <span className="text-white/20 text-xs">({count})</span>
  </div>
);

const BedIndicator: React.FC<{ available: number; total: number; type: string }> = ({ available, total, type }) => {
  const percentage = total > 0 ? (available / total) * 100 : 0;
  const getColor = () => percentage <= 10 ? 'bg-red-500' : percentage <= 25 ? 'bg-amber-500' : 'bg-emerald-500';
  const getText = () => percentage <= 10 ? 'text-red-400' : percentage <= 25 ? 'text-amber-400' : 'text-emerald-400';
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-white/30 text-[10px] font-medium uppercase tracking-wider">{type}</span>
        <span className={`${getText()} text-[10px] font-bold`}>{available}/{total}</span>
      </div>
      <div className="h-1 bg-white/[0.04] rounded-full overflow-hidden">
        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} transition={{ duration: 0.8 }} className={`h-full ${getColor()} rounded-full`} />
      </div>
    </div>
  );
};

const ServiceTag: React.FC<{ label: string; icon?: React.ElementType }> = ({ label, icon: Icon }) => (
  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
    {Icon && <Icon className="w-3 h-3" />}{label}
  </span>
);

const typeColors: Record<string, { gradient: string; border: string; badge: string; accent: string }> = {
  general: { gradient: 'from-blue-500/5 to-cyan-500/5', border: 'border-blue-500/10 hover:border-blue-500/20', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20', accent: 'from-blue-500 to-cyan-500' },
  multispecialty: { gradient: 'from-purple-500/5 to-pink-500/5', border: 'border-purple-500/10 hover:border-purple-500/20', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20', accent: 'from-purple-500 to-pink-500' },
  teaching: { gradient: 'from-emerald-500/5 to-teal-500/5', border: 'border-emerald-500/10 hover:border-emerald-500/20', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', accent: 'from-emerald-500 to-teal-500' },
  community: { gradient: 'from-amber-500/5 to-orange-500/5', border: 'border-amber-500/10 hover:border-amber-500/20', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20', accent: 'from-amber-500 to-orange-500' },
  specialty: { gradient: 'from-rose-500/5 to-red-500/5', border: 'border-rose-500/10 hover:border-rose-500/20', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20', accent: 'from-rose-500 to-red-500' },
  clinic: { gradient: 'from-sky-500/5 to-blue-500/5', border: 'border-sky-500/10 hover:border-sky-500/20', badge: 'bg-sky-500/10 text-sky-400 border-sky-500/20', accent: 'from-sky-500 to-blue-500' },
  trauma: { gradient: 'from-red-500/5 to-orange-500/5', border: 'border-red-500/10 hover:border-red-500/20', badge: 'bg-red-500/10 text-red-400 border-red-500/20', accent: 'from-red-500 to-orange-500' },
};

// ============================================
// MAIN COMPONENT
// ============================================
export const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, onViewBeds, variant = 'default' }) => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  // Safe data extraction
  const colors = typeColors[hospital.type] || typeColors.general;
  const beds = getBedSummary(hospital);
  const emergency = hasEmergency(hospital);
  const ambulance = hasAmbulance(hospital);
  const bloodBank = hasBloodBank(hospital);
  const oxygen = hasOxygen(hospital);
  const verified = isVerified(hospital);
  const premium = isPremium(hospital);
  const city = getCity(hospital);
  const state = getState(hospital);
  const phone = getPhone(hospital);
  const emergencyPhone = getEmergencyPhone(hospital);
  const email = getEmail(hospital);
  const established = getEstablished(hospital);
  const specialties = Array.isArray(hospital.specialties) ? hospital.specialties : [];

  // COMPACT VARIANT
  if (variant === 'compact') {
    return (
      <motion.div whileHover={{ y: -1 }} onClick={() => navigate(`/hospitals/${hospital.id}`)} className={`bg-white/[0.015] rounded-xl border ${colors.border} p-4 cursor-pointer transition-all duration-200`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-white/40 font-bold text-sm">{hospital.name.charAt(0)}</div>
            <div>
              <h3 className="text-white text-sm font-medium">{hospital.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <StarRating rating={hospital.rating} count={hospital.reviewCount} />
                <span className="text-white/15">•</span>
                <span className="text-white/30 text-xs">{hospital.distance ?? '?'} km</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {emergency && <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-400 text-[10px] font-medium border border-red-500/20">ER</span>}
            <ChevronRight className="w-4 h-4 text-white/15" />
          </div>
        </div>
      </motion.div>
    );
  }

  // FEATURED VARIANT
  if (variant === 'featured') {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -4 }} className={`relative bg-gradient-to-br ${colors.gradient} rounded-2xl border ${colors.border} overflow-hidden`}>
        {premium && <div className="absolute top-4 left-4 z-10"><span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold ${colors.badge}`}><Award className="w-3 h-3" />Featured</span></div>}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-48 h-48 md:h-auto rounded-xl bg-white/[0.03] border border-white/[0.06] overflow-hidden shrink-0 flex items-center justify-center">
              {hospital.image ? <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" /> : <Building2 className="w-16 h-16 text-white/10" />}
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white">{hospital.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <StarRating rating={hospital.rating} count={hospital.reviewCount} size="md" />
                  {verified && <BadgeCheck className="w-4 h-4 text-sky-400" />}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <span className="flex items-center gap-1.5 text-white/40"><MapPin className="w-4 h-4" />{city}, {state}</span>
                <span className="text-white/15">•</span>
                <span className="flex items-center gap-1.5 text-white/40"><Navigation className="w-4 h-4" />{hospital.distance ?? '?'} km</span>
                <span className="text-white/15">•</span>
                <span className="flex items-center gap-1.5 text-white/40"><Clock className="w-4 h-4" />~{hospital.eta ?? '?'} min</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <BedIndicator available={beds.available} total={beds.total} type="General" />
                <BedIndicator available={beds.icu.available} total={beds.icu.total} type="ICU" />
                <BedIndicator available={beds.emergency} total={beds.emergency || beds.total} type="ER" />
                <div className="flex items-center justify-center">
                  <button type="button" onClick={(e) => { e.stopPropagation(); onViewBeds?.(hospital); }} className="text-xs text-cyan-400 hover:text-cyan-300 font-medium">View all beds →</button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 pt-2">
                <button type="button" onClick={() => navigate(`/hospitals/${hospital.id}`)} className="px-5 py-2.5 bg-white text-black font-medium rounded-lg text-sm hover:bg-white/90">View Details</button>
                <button type="button" onClick={() => navigate('/appointments')} className="px-5 py-2.5 bg-white/[0.03] text-white/70 font-medium rounded-lg text-sm border border-white/[0.08] hover:bg-white/[0.06] hover:text-white">Book</button>
                {emergency && <button type="button" onClick={() => navigate('/emergency')} className="px-5 py-2.5 bg-red-500/10 text-red-400 font-medium rounded-lg text-sm border border-red-500/20"><Truck className="w-4 h-4 inline mr-1" />Emergency</button>}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // DEFAULT VARIANT
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} whileHover={{ y: -3 }} className={`relative bg-white/[0.015] rounded-2xl border ${colors.border} overflow-hidden transition-all duration-300`}>
      <div className={`h-0.5 bg-gradient-to-r ${colors.accent}`} />
      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-center overflow-hidden shrink-0">
              {hospital.image ? <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" /> : <span className="text-white/30 font-bold text-lg">{hospital.name.charAt(0)}</span>}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-white font-semibold text-base truncate">{hospital.name}</h3>
                {verified && <BadgeCheck className="w-4 h-4 text-sky-400 shrink-0" />}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={`inline-flex px-2 py-0.5 rounded-md text-[10px] font-medium ${colors.badge}`}>{hospital.type}</span>
                {premium && <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-medium border border-amber-500/20"><Award className="w-2.5 h-2.5" />Premium</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 bg-white/[0.03] rounded-lg px-2.5 py-1.5 border border-white/[0.06]">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-white text-sm font-bold">{hospital.rating}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4 text-xs">
          <span className="flex items-center gap-1.5 text-white/40"><MapPin className="w-3.5 h-3.5" />{city}, {state}</span>
          <span className="text-white/15">•</span>
          <span className="flex items-center gap-1.5 text-white/40"><Navigation className="w-3.5 h-3.5" />{hospital.distance ?? '?'} km</span>
          <span className="text-white/15">•</span>
          <span className="flex items-center gap-1.5 text-white/40"><Clock className="w-3.5 h-3.5" />ETA {hospital.eta ?? '?'} min</span>
          <span className="text-white/15">•</span>
          <span className="flex items-center gap-1.5 text-white/40"><Users className="w-3.5 h-3.5" />{hospital.doctorsCount ?? 0} doctors</span>
        </div>
        <div className="space-y-2 mb-4">
          <BedIndicator available={beds.available} total={beds.total} type="General Beds" />
          <BedIndicator available={beds.icu.available} total={beds.icu.total} type="ICU Beds" />
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {emergency && <ServiceTag label="Emergency" icon={Truck} />}
          {ambulance && <ServiceTag label="Ambulance" icon={Truck} />}
          {bloodBank && <ServiceTag label="Blood Bank" icon={Heart} />}
          {oxygen && <ServiceTag label="Oxygen" />}
          <ServiceTag label="WiFi" icon={Wifi} />
          <ServiceTag label="Parking" icon={Car} />
        </div>
        <div className="flex flex-wrap gap-1.5 mb-5">
          {specialties.slice(0, 4).map((s) => <span key={s} className="px-2.5 py-1 rounded-full bg-white/[0.02] text-white/40 text-[10px] font-medium border border-white/[0.04]">{s}</span>)}
          {specialties.length > 4 && <span className="px-2.5 py-1 rounded-full bg-white/[0.02] text-white/25 text-[10px] border border-white/[0.04]">+{specialties.length - 4} more</span>}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => navigate(`/hospitals/${hospital.id}`)} className="flex-1 px-4 py-2.5 bg-white text-black font-medium rounded-lg text-sm hover:bg-white/90 text-center">View</button>
          <button type="button" onClick={(e) => { e.stopPropagation(); onViewBeds?.(hospital); }} className="px-4 py-2.5 bg-white/[0.03] text-white/60 hover:text-white rounded-lg text-sm border border-white/[0.08]"><Bed className="w-4 h-4" /></button>
          <button type="button" onClick={() => phone && window.open(`tel:${phone}`)} className="px-4 py-2.5 bg-white/[0.03] text-white/60 hover:text-white rounded-lg text-sm border border-white/[0.08]" aria-label={`Call ${hospital.name}`}><Phone className="w-4 h-4" /></button>
        </div>
      </div>
      <AnimatePresence>
        {isExpanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden border-t border-white/[0.06]">
            <div className="p-5 md:p-6 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[{ label: 'Established', value: String(established) }, { label: 'Contact', value: phone }, { label: 'Emergency', value: emergencyPhone }, { label: 'Email', value: email }].map((item, i) => (
                  <div key={i}><span className="text-white/30">{item.label}</span><p className="text-white/60 font-medium mt-0.5 truncate">{item.value || 'N/A'}</p></div>
                ))}
              </div>
              {hospital.accreditation && hospital.accreditation.length > 0 && (
                <div><span className="text-white/30 text-xs">Accreditations</span><div className="flex gap-1.5 mt-1.5">{hospital.accreditation.map((acc) => <span key={acc} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20">{acc}</span>)}</div></div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button type="button" onClick={() => setIsExpanded(!isExpanded)} className="w-full flex items-center justify-center gap-1 py-2 border-t border-white/[0.04] text-white/20 hover:text-white/40 text-xs transition-colors">
        {isExpanded ? 'Show less' : 'Show more'}
        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
      </button>
    </motion.div>
  );
};

export default HospitalCard;