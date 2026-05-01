// src/components/ui/Badge.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { X } from 'lucide-react';

// ============================================
// TYPES
// ============================================

export interface BadgeProps {
  children: React.ReactNode;
  variant?:
    | 'default'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'gradient'
    | 'outline'
    | 'neon';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  dot?: boolean;
  pulse?: boolean;
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

// ============================================
// STYLES
// ============================================

const variantStyles: Record<string, string> = {
  default: 'bg-white/[0.06] text-white/70 border border-white/[0.08]',
  primary: 'bg-blue-500/15 text-blue-400 border border-blue-500/25',
  secondary: 'bg-purple-500/15 text-purple-400 border border-purple-500/25',
  success: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
  warning: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
  danger: 'bg-red-500/15 text-red-400 border border-red-500/25',
  info: 'bg-sky-500/15 text-sky-400 border border-sky-500/25',
  gradient: 'bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-lg shadow-indigo-500/20',
  outline: 'bg-transparent text-white/60 border border-white/20',
  neon: 'bg-transparent border border-cyan-400 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]',
};

const sizeStyles: Record<string, string> = {
  xs: 'px-2 py-0.5 text-[10px]',
  sm: 'px-2.5 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-sm',
};

const roundedStyles: Record<string, string> = {
  sm: 'rounded',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
};

// ============================================
// COMPONENT
// ============================================

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  rounded = 'full',
  dot = false,
  pulse = false,
  removable = false,
  onRemove,
  className,
}) => {
  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 font-medium transition-all duration-200',
          variantStyles[variant],
          sizeStyles[size],
          roundedStyles[rounded],
          pulse && 'animate-pulse'
        ),
        className
      )}
    >
      {/* Dot Indicator */}
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current shrink-0" />
      )}

      {/* Content */}
      <span className="leading-none">{children}</span>

      {/* Remove Button */}
      {removable && onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="ml-0.5 p-0.5 rounded-full hover:bg-white/10 transition-colors shrink-0"
          aria-label="Remove"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </motion.span>
  );
};

export default Badge;