// src/components/ui/GlassmorphicCard.tsx
import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

// ============================================
// TYPES
// ============================================
interface GlassmorphicCardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'gradient' | 'neon' | 'default' | 'premium' | 'elevated' | 'subtle' | 'frosted' | 'cyber' | 'holographic' | 'midnight' | 'aurora';
  className?: string;
  onClick?: () => void;
  hover?: 'lift' | 'glow' | 'scale' | 'tilt' | 'magnetic' | 'none';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';
  border?: 'none' | 'subtle' | 'visible' | 'glow' | 'animated';
  animate?: boolean;
  delay?: number;
  spotlight?: boolean;
  noise?: boolean;
  scanline?: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================
export const GlassmorphicCard: React.FC<GlassmorphicCardProps> = ({
  children,
  variant = 'default',
  className = '',
  onClick,
  hover = 'lift',
  padding = 'md',
  rounded = 'xl',
  border = 'subtle',
  animate = true,
  delay = 0,
  spotlight = false,
  noise = false,
  scanline = false,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Magnetic / Tilt
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const springY = useSpring(mouseY, { stiffness: 150, damping: 15 });
  const rotateX = useTransform(springY, [-0.5, 0.5], ['8deg', '-8deg']);
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-8deg', '8deg']);
  const glareX = useTransform(springX, [-0.5, 0.5], ['0%', '100%']);
  const glareY = useTransform(springY, [-0.5, 0.5], ['0%', '100%']);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (hover !== 'tilt' && hover !== 'magnetic') return;
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  // Variants
  const variantStyles: Record<string, string> = {
    glass: 'bg-white/[0.03] backdrop-blur-xl border-white/[0.06]',
    gradient: 'bg-gradient-to-br from-indigo-500/[0.05] via-purple-500/[0.05] to-pink-500/[0.05] backdrop-blur-xl border-white/[0.08]',
    neon: 'bg-cyan-500/[0.03] backdrop-blur-xl border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.1)]',
    default: 'bg-white/[0.02] backdrop-blur-lg border-white/[0.04]',
    premium: 'bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-white/[0.01] backdrop-blur-2xl border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.12)]',
    elevated: 'bg-white/[0.04] backdrop-blur-xl border-white/[0.06] shadow-[0_20px_60px_rgba(0,0,0,0.3)]',
    subtle: 'bg-white/[0.01] backdrop-blur-sm border-white/[0.02]',
    frosted: 'bg-white/[0.05] backdrop-blur-3xl border-white/[0.1] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]',
    cyber: 'bg-black/[0.4] backdrop-blur-xl border-cyan-400/20 shadow-[0_0_40px_rgba(6,182,212,0.15),inset_0_0_40px_rgba(6,182,212,0.05)]',
    holographic: 'bg-gradient-to-br from-cyan-500/[0.06] via-purple-500/[0.06] via-pink-500/[0.06] to-cyan-500/[0.06] backdrop-blur-2xl border-white/[0.1] shadow-[0_0_50px_rgba(139,92,246,0.15)]',
    midnight: 'bg-gradient-to-br from-slate-900/[0.6] via-indigo-950/[0.6] to-slate-900/[0.6] backdrop-blur-2xl border-white/[0.05] shadow-[0_0_60px_rgba(0,0,0,0.5)]',
    aurora: 'bg-gradient-to-br from-teal-500/[0.05] via-cyan-500/[0.05] via-indigo-500/[0.05] to-purple-500/[0.05] backdrop-blur-2xl border-white/[0.08] shadow-[0_0_40px_rgba(6,182,212,0.1)] animate-gradient bg-[length:200%_200%]',
  };

  const paddingStyles: Record<string, string> = {
    none: 'p-0', sm: 'p-3 sm:p-4', md: 'p-4 sm:p-5 md:p-6', lg: 'p-6 sm:p-8', xl: 'p-8 sm:p-10 md:p-12',
  };

  const roundedStyles: Record<string, string> = {
    sm: 'rounded-lg', md: 'rounded-xl', lg: 'rounded-2xl', xl: 'rounded-3xl', '2xl': 'rounded-[2rem]', '3xl': 'rounded-[2.5rem]', full: 'rounded-[3rem]',
  };

  const borderStyles: Record<string, string> = {
    none: 'border-0', subtle: 'border', visible: 'border-2', glow: 'border border-white/[0.08] hover:border-white/[0.15]', animated: 'border border-white/[0.06] hover:border-cyan-400/30',
  };

  const hoverStyles: Record<string, string> = {
    lift: 'hover:-translate-y-1.5 hover:shadow-2xl',
    glow: 'hover:shadow-[0_0_40px_rgba(6,182,212,0.2)] hover:border-cyan-500/30',
    scale: 'hover:scale-[1.03]',
    tilt: 'cursor-pointer',
    magnetic: 'cursor-pointer',
    none: '',
  };

  const combinedClassName = `
    relative overflow-hidden transition-all duration-500
    ${variantStyles[variant] || variantStyles.default}
    ${paddingStyles[padding]}
    ${roundedStyles[rounded]}
    ${borderStyles[border]}
    ${onClick ? 'cursor-pointer' : ''}
    ${hoverStyles[hover]}
    ${className}
  `.trim();

  const cardContent = (
    <div ref={cardRef} className={combinedClassName} onClick={onClick} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>

      {/* Premium top line */}
      {variant === 'premium' && <div className="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />}

      {/* Neon orbs */}
      {variant === 'neon' && (
        <>
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-purple-500/20 rounded-full blur-3xl" />
        </>
      )}

      {/* Cyber corners */}
      {variant === 'cyber' && (
        <>
          <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-400/40 rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-cyan-400/40 rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-cyan-400/40 rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-400/40 rounded-br-xl" />
        </>
      )}

      {/* Holographic shimmer */}
      {variant === 'holographic' && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer bg-[length:200%_100%]" />}

      {/* Midnight particles */}
      {variant === 'midnight' && (
        <div className="absolute inset-0">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="absolute w-0.5 h-0.5 bg-white/20 rounded-full"
              style={{ top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, animation: `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s` }} />
          ))}
        </div>
      )}

      {/* Noise */}
      {noise && (
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")` }} />
      )}

      {/* Scanline */}
      {scanline && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
          <div className="absolute inset-0" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)' }} />
        </div>
      )}

      {/* Spotlight */}
      {spotlight && (
        <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[inherit]"
          style={{ background: `radial-gradient(400px circle at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.05), transparent 40%)` }} />
      )}

      <div className="relative z-10">{children}</div>
    </div>
  );

  if (!animate) return cardContent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
      style={hover === 'tilt' || hover === 'magnetic' ? { rotateX, rotateY, transformPerspective: 1000 } : undefined}
    >
      {cardContent}
    </motion.div>
  );
};

export default GlassmorphicCard;