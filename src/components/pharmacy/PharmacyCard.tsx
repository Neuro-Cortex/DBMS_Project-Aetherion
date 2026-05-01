import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-react';
import { 
  MapPin,
  Phone,
  Clock,
  Users,
  Shield,
  CheckCircle,
  Star,
  Truck,
  CreditCard,
  Pill,
  Heart,
  Activity,
  Navigation,
  MessageSquare,
  Camera,
  Plus,
  X
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Avatar } from '../../ui/Avatar';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface Pharmacy {
  id: string;
  name: string;
  type: 'retail' | 'hospital' | 'online' | '24x7';
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  rating: number;
  reviewCount: number;
  operatingHours: {
    open: string;
    close: string;
    is24x7: boolean;
  };
  services: string[];
  paymentMethods: string[];
  delivery: {
    available: boolean;
    radius: number;
    charge: number;
    estimatedTime: string;
  };
  verified: boolean;
  licensed: boolean;
  pharmacists: number;
  inventoryCount: number;
  specialties: string[];
  images?: string[];
}

export interface PharmacyCardProps {
  pharmacy: Pharmacy;
  variant?: 'glass' | 'gradient' | 'neon';
  showActions?: boolean;
  showStats?: boolean;
  onContact?: (pharmacy: Pharmacy) => void;
  onNavigate?: (pharmacy: Pharmacy) => void;
  onViewInventory?: (pharmacy: Pharmacy) => void;
  className?: string;
}

// ============================================
// PHARMACY CARD COMPONENT
// ============================================
export const PharmacyCard: React.FC<PharmacyCardProps> = ({
  pharmacy,
  variant = 'glass',
  showActions = true,
  showStats = true,
  onContact,
  onNavigate,
  onViewInventory,
  className,
}) => {
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const isOpen = pharmacy.operatingHours.is24x7 || 
    (new Date().getHours() >= parseInt(pharmacy.operatingHours.open.split(':')[0]) && 
     new Date().getHours() < parseInt(pharmacy.operatingHours.close.split(':')[0]));

  const Icon = pharmacy.type === '24x7' ? Clock : 
               pharmacy.type === 'hospital' ? Activity : 
               pharmacy.type === 'online' ? MessageSquare : MapPin;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <GlassmorphicCard
        variant={variant}
        className={twMerge(
          clsx(
            'p-6 transition-all duration-300 cursor-pointer overflow-hidden',
            className
          )
        )}
        onClick={() => onViewInventory?.(pharmacy)}
      >
        {/* Premium Badge */}
        <AnimatePresence>
          {pharmacy.verified && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              className="absolute top-4 right-4"
            >
              <Badge variant="gradient" size="xs" className="shadow-lg shadow-purple-500/50">
                <Shield className="w-3 h-3 mr-1" />
                VERIFIED
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex items-start gap-4 mb-5">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 3 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Avatar
              src={!imageError ? pharmacy.images?.[0] : undefined}
              name={pharmacy.name}
              size="lg"
              onError={() => setImageError(true)}
              className={clsx(
                'border-2',
                pharmacy.verified ? 'border-cyan-400' : 'border-white/20'
              )}
            />
            {/* Verification Badge */}
            {pharmacy.verified && (
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

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <motion.h3 
                  className="text-xl font-bold text-white mb-1 truncate"
                  animate={isHovered ? { scale: 1.02 } : { scale: 1 }}
                >
                  {pharmacy.name}
                </motion.h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" size="xs">
                    {pharmacy.type}
                  </Badge>
                  {pharmacy.operatingHours.is24x7 && (
                    <Badge variant="danger" size="xs" className="animate-pulse">
                      <Clock className="w-3 h-3 mr-1" />
                      24/7
                    </Badge>
                  )}
                </div>
              </div>

              {/* Rating */}
              <motion.div 
                className="flex items-center gap-1"
                whileHover={{ scale: 1.05 }}
              >
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="text-sm font-bold text-white">{pharmacy.rating}</span>
                <span className="text-xs text-white/60">({pharmacy.reviewCount})</span>
              </motion.div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
              <MapPin className="w-4 h-4" />
              <span className="truncate">
                {pharmacy.location.address}, {pharmacy.location.city}
              </span>
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
                  <Users className="w-3 h-3" />
                  {pharmacy.pharmacists} pharmacists
                </div>
                <div className="flex items-center gap-1">
                  <Pill className="w-3 h-3" />
                  {pharmacy.inventoryCount} medicines
                </div>
                <div className="flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {pharmacy.specialties.length} specialties
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Operating Hours */}
        <motion.div 
          className="mb-5 p-3 rounded-xl bg-white/5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-white flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Operating Hours
            </p>
            <Badge 
              variant={isOpen ? 'success' : 'danger'} 
              size="xs"
              className={isOpen ? 'animate-pulse' : ''}
            >
              {isOpen ? 'Open Now' : 'Closed'}
            </Badge>
          </div>
          <p className="text-sm text-white/70">
            {pharmacy.operatingHours.is24x7 
              ? '24 hours, 7 days a week' 
              : `${pharmacy.operatingHours.open} - ${pharmacy.operatingHours.close}`}
          </p>
        </motion.div>

        {/* Services */}
        <motion.div 
          className="mb-5"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-sm font-medium text-white mb-2">Services</p>
          <div className="flex flex-wrap gap-2">
            {pharmacy.services.slice(0, 4).map((service, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="text-xs px-2 py-1 bg-white/10 rounded-lg text-white/80"
              >
                {service}
              </motion.span>
            ))}
            {pharmacy.services.length > 4 && (
              <span className="text-xs px-2 py-1 text-white/60">
                +{pharmacy.services.length - 4} more
              </span>
            )}
          </div>
        </motion.div>

        {/* Delivery Info */}
        {pharmacy.delivery.available && (
          <motion.div 
            className="mb-5 p-3 rounded-xl bg-green-500/10 border border-green-500/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-green-300 flex items-center gap-2">
                <Truck className="w-4 h-4" />
                Home Delivery Available
              </p>
              <Badge variant="success" size="xs">
                {pharmacy.delivery.estimatedTime}
              </Badge>
            </div>
            <div className="flex justify-between text-sm text-white/70">
              <span>Radius: {pharmacy.delivery.radius}km</span>
              <span>Charge: ${pharmacy.delivery.charge}</span>
            </div>
          </motion.div>
        )}

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
              leftIcon={Phone}
              onClick={(e) => {
                e.stopPropagation();
                onContact?.(pharmacy);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Contact
            </Button>
            <Button
              variant="neon"
              size="sm"
              leftIcon={Navigation}
              onClick={(e) => {
                e.stopPropagation();
                onNavigate?.(pharmacy);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Navigate
            </Button>
            <Button
              variant="glassmorphic"
              size="sm"
              iconOnly
              onClick={(e) => {
                e.stopPropagation();
                // Share pharmacy details
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </motion.div>
        )}
      </GlassmorphicCard>
    </motion.div>
  );
};