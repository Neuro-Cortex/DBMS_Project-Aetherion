// src/components/ui/Loader.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Activity, Zap, Brain } from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface LoaderProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'spinner' | 'dots' | 'pulse' | 'progress' | 'heartbeat' | 'dna' | 'wave' | 'glitch' | 'aetherion';
  color?: 'cyan' | 'purple' | 'gradient' | 'white';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================
export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'aetherion',
  color = 'gradient',
  text,
  fullScreen = false,
  className = '',
}) => {
  const sizes: Record<string, string> = {
    xs: 'w-5 h-5', sm: 'w-8 h-8', md: 'w-12 h-12', lg: 'w-20 h-20', xl: 'w-28 h-28',
  };

  const dotSizes: Record<string, string> = {
    xs: 'w-1.5 h-1.5', sm: 'w-2 h-2', md: 'w-2.5 h-2.5', lg: 'w-3 h-3', xl: 'w-4 h-4',
  };

  const textSizes: Record<string, string> = {
    xs: 'text-[10px]', sm: 'text-xs', md: 'text-sm', lg: 'text-base', xl: 'text-lg',
  };

  // ============================================
  // 1. AETHERION — Brand Signature Loader
  // ============================================
  const Aetherion = () => (
    <div className={`relative ${sizes[size]}`}>
      {/* Outer glow ring */}
      <motion.div
        className="absolute -inset-3 rounded-full bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 blur-xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Spinning rings */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent"
        style={{ borderTopColor: '#06b6d4', borderRightColor: '#8b5cf6' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-2 rounded-full border-2 border-transparent"
        style={{ borderBottomColor: '#ec4899', borderLeftColor: '#06b6d4' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-4 rounded-full border border-white/10"
        animate={{ rotate: 360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Sparkles className={`${size === 'xs' ? 'w-3 h-3' : size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'} text-cyan-400`} />
        </motion.div>
      </div>
    </div>
  );

  // ============================================
  // 2. SPINNER — Refined Gradient
  // ============================================
  const Spinner = () => (
    <div className={`relative ${sizes[size]}`}>
      <div className="absolute inset-0 rounded-full border-2 border-white/[0.04]" />
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent"
        style={{ borderTopColor: '#06b6d4', borderRightColor: '#8b5cf6', borderBottomColor: 'transparent', borderLeftColor: 'transparent' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-[4px] rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 backdrop-blur-sm flex items-center justify-center">
        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
      </div>
    </div>
  );

  // ============================================
  // 3. DOTS — Bouncing Wave
  // ============================================
  const Dots = () => (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className={`${dotSizes[size]} rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_12px_rgba(6,182,212,0.3)]`}
          animate={{ y: [0, -14, 0], scale: [1, 1.4, 1] }}
          transition={{ duration: 0.7, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
        />
      ))}
    </div>
  );

  // ============================================
  // 4. PULSE — Concentric Rings
  // ============================================
  const Pulse = () => (
    <div className={`relative ${sizes[size]}`}>
      {[1, 2, 3, 4].map((ring) => (
        <motion.div
          key={ring}
          className="absolute inset-0 rounded-full border border-cyan-400/20"
          animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: ring * 0.5 }}
        />
      ))}
      <motion.div
        className="absolute inset-3 rounded-full bg-gradient-to-br from-cyan-400 to-purple-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]"
        animate={{ scale: [1, 0.9, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );

  // ============================================
  // 5. PROGRESS — Smooth Bar
  // ============================================
  const Progress = () => (
    <div className="w-full max-w-[240px] space-y-3">
      <div className={`w-full bg-white/[0.03] rounded-full overflow-hidden backdrop-blur-sm border border-white/[0.04] ${size === 'xs' ? 'h-1.5' : size === 'sm' ? 'h-2' : 'h-2.5'}`}>
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 relative overflow-hidden"
          animate={{ width: ['0%', '100%'] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
        </motion.div>
      </div>
      {text && <p className={`${textSizes[size]} text-white/30 text-center tracking-wider`}>{text}</p>}
    </div>
  );

  // ============================================
  // 6. HEARTBEAT — Medical Pulse
  // ============================================
  const Heartbeat = () => (
    <div className={`relative ${sizes[size]}`}>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        animate={{ scale: [1, 1.25, 1, 1.12, 1] }}
        transition={{ duration: 1.2, repeat: Infinity, times: [0, 0.08, 0.25, 0.35, 1] }}
      >
        <Heart className="w-full h-full text-transparent" style={{ fill: 'url(#hb-gradient)' }} />
      </motion.div>
      <svg width="0" height="0">
        <defs>
          <linearGradient id="hb-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  // ============================================
  // 7. DNA HELIX — Rotating Strands
  // ============================================
  const DNA = () => (
    <div className={`relative ${sizes[size]}`}>
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute left-1/2 flex items-center gap-1"
          style={{ top: `${i * 10}%`, transform: 'translateX(-50%)' }}
          animate={{ x: [0, 15, 0, -15, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        >
          <div className={`${size === 'xs' || size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5'} rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.5)]`} />
          <div className={`${size === 'xs' ? 'w-3' : size === 'sm' ? 'w-4' : 'w-6'} h-[1px] bg-gradient-to-r from-cyan-400 to-purple-500`} />
          <div className={`${size === 'xs' || size === 'sm' ? 'w-1 h-1' : 'w-1.5 h-1.5'} rounded-full bg-purple-500 shadow-[0_0_6px_rgba(139,92,246,0.5)]`} />
        </motion.div>
      ))}
    </div>
  );

  // ============================================
  // 8. WAVE — Audio Visualizer
  // ============================================
  const Wave = () => (
    <div className="flex items-end gap-[2px] h-8">
      {[3, 4, 6, 5, 8, 6, 4, 7, 5, 3, 6, 8, 5, 4, 3].map((h, i) => (
        <motion.div
          key={i}
          className={`${size === 'xs' || size === 'sm' ? 'w-[2px]' : 'w-[3px]'} rounded-full bg-gradient-to-t from-cyan-400 to-purple-500`}
          animate={{ height: [3, h * 3, 3] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.06, ease: "easeInOut" }}
        />
      ))}
    </div>
  );

  // ============================================
  // 9. GLITCH — Text Distortion
  // ============================================
  const Glitch = () => (
    <div className="relative">
      <motion.span
        className={`${textSizes[size]} font-mono font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent`}
        animate={{ x: [0, -2, 3, -1, 0], opacity: [1, 0.7, 1, 0.8, 1] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatType: "mirror" }}
      >
        {text || 'LOADING'}
      </motion.span>
      <motion.span
        className={`absolute inset-0 ${textSizes[size]} font-mono font-bold text-cyan-400/20`}
        animate={{ x: [0, 2, -3, 1, 0], opacity: [0.3, 0.6, 0.3, 0.5, 0.3] }}
        transition={{ duration: 0.4, repeat: Infinity, repeatType: "mirror", delay: 0.08 }}
      >
        {text || 'LOADING'}
      </motion.span>
    </div>
  );

  // ============================================
  // RENDER
  // ============================================
  const renderLoader = () => {
    const loaders: Record<string, React.ReactNode> = {
      aetherion: <Aetherion />,
      spinner: <Spinner />,
      dots: <Dots />,
      pulse: <Pulse />,
      progress: <Progress />,
      heartbeat: <Heartbeat />,
      dna: <DNA />,
      wave: <Wave />,
      glitch: <Glitch />,
    };
    return loaders[variant] || <Aetherion />;
  };

  const content = (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {renderLoader()}
      {text && variant !== 'glitch' && variant !== 'progress' && (
        <p className={`${textSizes[size]} text-white/25 font-medium tracking-wider`}>{text}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[#050508]/95 backdrop-blur-md"
      >
        {renderLoader()}
        {text && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={`${textSizes[size]} text-white/15 font-medium tracking-[0.25em] uppercase`}
          >
            {text}
          </motion.p>
        )}
        <motion.div
          className="absolute bottom-10 flex items-center gap-2 text-white/10 text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <Sparkles className="w-3 h-3" />
          <span>Aetherion Health</span>
        </motion.div>
      </motion.div>
    );
  }

  return content;
};

export default Loader;