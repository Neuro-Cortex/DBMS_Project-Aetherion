// src/components/common/UserAvatar.tsx

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Settings, LogOut, X, CheckCircle, Star } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Badge } from 'src/ui/Badge';

// ============================================
// SIMPLE AVATAR COMPONENT
// ============================================

interface SimpleAvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onError?: () => void;
}

const SimpleAvatar: React.FC<SimpleAvatarProps> = ({ src, name, size = 'md', className, onError }) => {
  const [imgError, setImgError] = useState(false);
  
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };
  
  const getInitials = () => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };
  
  return (
    <div className={`relative flex items-center justify-center overflow-hidden font-medium rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white ${sizeClasses[size]} ${className || ''}`}>
      {src && !imgError ? (
        <img src={src} alt={name} className="w-full h-full object-cover" onError={() => { setImgError(true); onError?.(); }} />
      ) : (
        <span className="font-semibold">{getInitials()}</span>
      )}
    </div>
  );
};

// ============================================
// TYPES
// ============================================

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  role: string;
  status: 'online' | 'offline' | 'away' | 'busy';
  joinedAt: string;
  verified?: boolean;
  premium?: boolean;
}

export interface UserAvatarProps {
  user: User;
  variant?: 'default' | 'glass' | 'neon';
  showStatus?: boolean;
  showInfo?: boolean;
  interactive?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  avatarClassName?: string;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogout?: () => void;
}

// ============================================
// STATUS STYLES
// ============================================

const statusClasses = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

const statusLabels = {
  online: 'Online',
  offline: 'Offline',
  away: 'Away',
  busy: 'Busy',
};

// ============================================
// BADGE VARIANT FUNCTION - FIXED
// ============================================

const getBadgeVariant = (status: string): 'success' | 'danger' | 'warning' | 'secondary' => {
  switch (status) {
    case 'online': 
      return 'success';  // green
    case 'busy': 
      return 'danger';   // red
    case 'away': 
      return 'warning';  // yellow
    case 'offline': 
      return 'secondary'; // purple
    default: 
      return 'secondary';
  }
};

// ============================================
// USER AVATAR COMPONENT
// ============================================

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  variant = 'glass',
  showStatus = true,
  showInfo = true,
  interactive = true,
  size = 'md',
  className,
  avatarClassName,
  onProfileClick,
  onSettingsClick,
  onLogout,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
    } catch {
      return dateString;
    }
  };

  // Get badge variant based on user status
  const badgeVariant = getBadgeVariant(user.status);

  return (
    <div ref={containerRef} className={twMerge('relative inline-flex', className)}>
      {/* Avatar Button */}
      <motion.button
        whileHover={interactive ? { scale: 1.05 } : undefined}
        whileTap={interactive ? { scale: 0.95 } : undefined}
        onClick={() => interactive && setIsOpen(!isOpen)}
        className="relative group"
      >
        <SimpleAvatar
          src={!imageError ? user.avatar : undefined}
          name={user.name}
          size={size}
          className={avatarClassName}
          onError={() => setImageError(true)}
        />

        {/* Status Indicator */}
        {showStatus && (
          <span className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-gray-800 ${statusClasses[user.status]}`} />
        )}

        {/* Premium Badge */}
        {user.premium && (
          <div className="absolute -top-1 -right-1">
            <Badge variant="gradient" size="xs">PRO</Badge>
          </div>
        )}

        {/* Verified Badge */}
        {user.verified && (
          <div className="absolute -bottom-1 -left-1">
            <div className="bg-blue-500 rounded-full p-0.5">
              <CheckCircle className="w-3 h-3 text-white" />
            </div>
          </div>
        )}
      </motion.button>

      {/* User Info Popup */}
      <AnimatePresence>
        {isOpen && showInfo && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute top-full mt-2 right-0 w-80 bg-black/80 backdrop-blur-2xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/20">
              <div className="flex items-center gap-4">
                <SimpleAvatar src={user.avatar} name={user.name} size="md" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold text-white">{user.name}</p>
                    {user.verified && <CheckCircle className="w-4 h-4 text-blue-400" />}
                  </div>
                  <p className="text-sm text-white/70">{user.email}</p>
                  <Badge 
                    variant={badgeVariant}
                    size="xs" 
                    className="mt-1"
                  >
                    {statusLabels[user.status]}
                  </Badge>
                </div>
                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white/70">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* User Info */}
            <div className="px-6 py-4 space-y-3">
              {user.phone && (
                <div className="flex items-center gap-3 text-white/80">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{user.phone}</span>
                </div>
              )}
              {user.location && (
                <div className="flex items-center gap-3 text-white/80">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{user.location}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-white/80">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Joined {formatDate(user.joinedAt)}</span>
              </div>
              <div className="flex items-center gap-3 text-white/80">
                <Mail className="w-4 h-4" />
                <span className="text-sm">{user.email}</span>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2 border-t border-white/20">
              <button 
                onClick={() => { onProfileClick?.(); setIsOpen(false); }} 
                className="w-full px-6 py-3 flex items-center gap-3 text-white/70 hover:bg-white/10 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">View Profile</span>
              </button>
              <button 
                onClick={() => { onSettingsClick?.(); setIsOpen(false); }} 
                className="w-full px-6 py-3 flex items-center gap-3 text-white/70 hover:bg-white/10 transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span className="font-medium">Settings</span>
              </button>
              <button 
                onClick={() => { onLogout?.(); setIsOpen(false); }} 
                className="w-full px-6 py-3 flex items-center gap-3 text-red-300 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserAvatar;