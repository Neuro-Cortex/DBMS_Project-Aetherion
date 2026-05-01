// src/components/ui/GlassmorphicCard.tsx

import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface GlassmorphicCardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'gradient' | 'neon' | 'default';
  className?: string;
  onClick?: () => void;
}

export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  variant = 'glass',
  className,
  onClick,
}) => {
  const variants = {
    glass: 'bg-white/10 backdrop-blur-md border border-white/20',
    gradient: 'bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-white/20',
    neon: 'bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]',
    default: 'bg-white/5 border border-white/10',
  };

  return (
    <div
      className={twMerge(
        'rounded-2xl transition-all duration-300',
        variants[variant],
        onClick && 'cursor-pointer hover:scale-[1.02]',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassmorphicCard;