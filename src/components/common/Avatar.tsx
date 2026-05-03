// src/components/ui/Avatar.tsx

import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: string;
  shape?: 'circle' | 'square' | 'rounded';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
  onClick?: () => void;
  onError?: () => void;
  children?: React.ReactNode;
}

const sizeClasses = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};

const shapeClasses = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-xl',
};

const statusClasses = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
  busy: 'bg-red-500',
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  variant = 'default',
  shape = 'circle',
  status,
  className,
  onClick,
  onError,
  children,
}) => {
  const [imgError, setImgError] = React.useState(false);

  const getInitials = () => {
    if (!name) return '?';
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Variant classes based on string
  const getVariantClass = () => {
    switch (variant) {
      case 'glass': return 'bg-white/10 backdrop-blur-xl border border-white/20 text-white';
      case 'neon': return 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white';
      case 'gradient': return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white';
      default: return 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300';
    }
  };

  return (
    <div
      className={twMerge(
        'relative flex items-center justify-center overflow-hidden font-medium',
        sizeClasses[size],
        getVariantClass(),
        shapeClasses[shape],
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
      onClick={onClick}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          className="w-full h-full object-cover"
          onError={() => { setImgError(true); onError?.(); }}
        />
      ) : (
        <span className="font-semibold">{children || getInitials()}</span>
      )}
      
      {status && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${statusClasses[status]}`} />
      )}
    </div>
  );
};

export default Avatar;