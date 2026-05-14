// src/components/ui/Badge.tsx

import React from 'react';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'gradient' | 'neon' | 'glass';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  dot?: boolean;
  rounded?: boolean;
  pulse?: boolean;
  onClick?: () => void;
}

const sizeClasses = {
  xs: 'px-1.5 py-0.5 text-xs',
  sm: 'px-2 py-0.5 text-sm',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

const variantClasses = {
  default: 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300',
  primary: 'bg-blue-500 text-white',
  secondary: 'bg-purple-500 text-white',
  success: 'bg-green-500 text-white',
  danger: 'bg-red-500 text-white',
  warning: 'bg-yellow-800 text-white',
  info: 'bg-cyan-500 text-white',
  gradient: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
  neon: 'bg-cyan-500 text-white shadow-[0_0_10px_rgba(6,182,212,0.5)]',
  glass: 'bg-white/10 backdrop-blur-sm border border-white/20 text-white',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  dot = false,
  rounded = false,
  pulse = false,
  onClick,
}) => {
  const variantKey = variant as keyof typeof variantClasses;
  
  return (
    <span
      className={twMerge(
        'inline-flex items-center gap-1.5 font-medium',
        sizeClasses[size],
        variantClasses[variantKey] || variantClasses.default,
        rounded ? 'rounded-full' : 'rounded-md',
        onClick && 'cursor-pointer hover:opacity-80 transition-opacity',
        className
      )}
      onClick={onClick}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full bg-current ${pulse ? 'animate-pulse' : ''}`}
        />
      )}
      {children}
    </span>
  );
};

export default Badge;