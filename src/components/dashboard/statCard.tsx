// src/components/dashboard/StatCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown, MoreHorizontal } from 'lucide-react';

// ============================================
// TYPES
// ============================================
export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: React.ElementType;
  color?: string;
  variant?: 'default' | 'compact' | 'large' | 'glass';
  sparkline?: number[];
  onClick?: () => void;
  className?: string;
}

// ============================================
// SPARKLINE MINI CHART
// ============================================
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const height = 40;
  const width = 100;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-10" preserveAspectRatio="none">
      <defs>
        <linearGradient id={`spark-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,${height} ${points} ${width},${height}`} fill={`url(#spark-${color.replace('#', '')})`} />
      <motion.polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
  );
};

// ============================================
// CIRCULAR PROGRESS
// ============================================
const CircularProgress: React.FC<{ percentage: number; color: string; size?: number }> = ({ 
  percentage, color, size = 60 
}) => {
  const radius = (size - 6) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="3"
        strokeLinecap="round" strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
      <text x={size / 2} y={size / 2} textAnchor="middle" dy="0.35em" className="fill-white text-xs font-bold" transform={`rotate(90 ${size/2} ${size/2})`}>
        {percentage}%
      </text>
    </svg>
  );
};

// ============================================
// COLOR MAPS
// ============================================
const colorMap: Record<string, { gradient: string; bg: string; border: string; icon: string; sparkline: string }> = {
  blue:    { gradient: 'from-blue-500 to-cyan-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: 'text-blue-400', sparkline: '#3b82f6' },
  purple:  { gradient: 'from-purple-500 to-pink-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20', icon: 'text-purple-400', sparkline: '#8b5cf6' },
  green:   { gradient: 'from-emerald-500 to-teal-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: 'text-emerald-400', sparkline: '#22c55e' },
  amber:   { gradient: 'from-amber-500 to-orange-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: 'text-amber-400', sparkline: '#f59e0b' },
  red:     { gradient: 'from-red-500 to-rose-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: 'text-red-400', sparkline: '#ef4444' },
  cyan:    { gradient: 'from-cyan-500 to-sky-500', bg: 'bg-cyan-500/10', border: 'border-cyan-500/20', icon: 'text-cyan-400', sparkline: '#06b6d4' },
  indigo:  { gradient: 'from-indigo-500 to-violet-500', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20', icon: 'text-indigo-400', sparkline: '#6366f1' },
  pink:    { gradient: 'from-pink-500 to-rose-500', bg: 'bg-pink-500/10', border: 'border-pink-500/20', icon: 'text-pink-400', sparkline: '#ec4899' },
};

// ============================================
// MAIN COMPONENT
// ============================================
export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  trend = 'neutral',
  icon: Icon,
  color = 'blue',
  variant = 'default',
  sparkline,
  onClick,
  className = '',
}) => {
  const colors = colorMap[color] || colorMap.blue;
  const isClickable = !!onClick;

  // ============================================
  // COMPACT VARIANT
  // ============================================
  if (variant === 'compact') {
    return (
      <motion.div
        whileHover={isClickable ? { y: -2, scale: 1.01 } : undefined}
        onClick={onClick}
        className={`bg-white/[0.015] rounded-xl border border-white/[0.06] p-4 hover:border-white/[0.12] transition-all duration-200 ${isClickable ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className="flex items-center justify-between mb-3">
          {Icon && (
            <div className={`w-8 h-8 rounded-lg ${colors.bg} border ${colors.border} flex items-center justify-center`}>
              <Icon className={`w-4 h-4 ${colors.icon}`} />
            </div>
          )}
          {change && (
            <span className={`flex items-center gap-0.5 text-[10px] font-medium ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-white/30'}`}>
              {trend === 'up' ? <ArrowUp className="w-2.5 h-2.5" /> : trend === 'down' ? <ArrowDown className="w-2.5 h-2.5" /> : null}
              {change}
            </span>
          )}
        </div>
        <div className="text-lg font-bold text-white">{value}</div>
        <p className="text-white/30 text-xs mt-0.5">{title}</p>
      </motion.div>
    );
  }

  // ============================================
  // LARGE VARIANT
  // ============================================
  if (variant === 'large') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={isClickable ? { y: -4 } : undefined}
        onClick={onClick}
        className={`bg-white/[0.015] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-6 hover:border-white/[0.12] transition-all duration-300 ${isClickable ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-white/35 text-xs font-medium uppercase tracking-wider mb-1">{title}</p>
            <div className="text-4xl font-bold text-white tracking-tight">{value}</div>
            {subtitle && <p className="text-white/25 text-sm mt-1">{subtitle}</p>}
          </div>
          {Icon && (
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
              <Icon className="w-7 h-7 text-white" />
            </div>
          )}
        </div>

        {sparkline && <Sparkline data={sparkline} color={colors.sparkline} />}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.04]">
          {change && (
            <span className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-white/40'}`}>
              {trend === 'up' ? <TrendingUp className="w-4 h-4" /> : trend === 'down' ? <TrendingDown className="w-4 h-4" /> : null}
              {change}
              <span className="text-white/30 text-xs font-normal ml-1">vs last month</span>
            </span>
          )}
          <button type="button" className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors ml-auto">
            <MoreHorizontal className="w-4 h-4 text-white/20" />
          </button>
        </div>
      </motion.div>
    );
  }

  // ============================================
  // GLASS VARIANT (Premium)
  // ============================================
  if (variant === 'glass') {
    return (
      <motion.div
        whileHover={isClickable ? { y: -3, scale: 1.02 } : undefined}
        onClick={onClick}
        className={`relative overflow-hidden bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.08] p-5 hover:border-white/[0.15] transition-all duration-300 ${isClickable ? 'cursor-pointer' : ''} ${className}`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br from-white/[0.02] to-transparent -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            {Icon && (
              <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${colors.icon}`} />
              </div>
            )}
            {change && (
              <span className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold ${
                trend === 'up' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                trend === 'down' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 
                'bg-white/[0.03] text-white/30 border border-white/[0.06]'
              }`}>
                {trend === 'up' ? <ArrowUp className="w-2.5 h-2.5" /> : <ArrowDown className="w-2.5 h-2.5" />}
                {change}
              </span>
            )}
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
          <p className="text-white/35 text-sm mt-1">{title}</p>
          {sparkline && (
            <div className="mt-3">
              <Sparkline data={sparkline} color={colors.sparkline} />
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  // ============================================
  // DEFAULT VARIANT
  // ============================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={isClickable ? { y: -4 } : undefined}
      onClick={onClick}
      className={`bg-white/[0.015] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-5 hover:border-white/[0.12] transition-all duration-300 ${isClickable ? 'cursor-pointer' : ''} ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${colors.gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
        )}
        {change && (
          <span className={`flex items-center gap-1 text-xs font-medium ${trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-white/30'}`}>
            {trend === 'up' ? <ArrowUp className="w-3 h-3" /> : trend === 'down' ? <ArrowDown className="w-3 h-3" /> : null}
            {change}
          </span>
        )}
      </div>
      <div className="text-2xl font-bold text-white tracking-tight">{value}</div>
      <div className="flex items-center justify-between mt-2">
        <p className="text-white/35 text-xs">{title}</p>
        {subtitle && <p className="text-white/20 text-[10px]">{subtitle}</p>}
      </div>
      {sparkline && (
        <div className="mt-3">
          <Sparkline data={sparkline} color={colors.sparkline} />
        </div>
      )}
    </motion.div>
  );
};

export default StatCard;