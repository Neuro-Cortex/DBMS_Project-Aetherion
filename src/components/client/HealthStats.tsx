// src/components/client/HealthStats.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import {
  Calendar, Pill, Droplets, FileText,
  TrendingUp, Clock, Activity, Heart
} from 'lucide-react';

interface HealthStatsProps {
  stats: {
    upcomingAppointments: number;
    activePrescriptions: number;
    bloodDonations: number;
    medicalReports: number;
    healthScore: number;
    nextDonationDate?: string;
    lastCheckup?: string;
  };
}

const AnimatedCounter = ({ value, duration = 2 }: { value: number; duration?: number }) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
};

const HealthStats: React.FC<HealthStatsProps> = ({ stats }) => {
  const statCards = [
    {
      label: 'Upcoming Appointments',
      value: stats.upcomingAppointments,
      icon: Calendar,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      iconColor: 'text-blue-400',
    },
    {
      label: 'Active Prescriptions',
      value: stats.activePrescriptions,
      icon: Pill,
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-500/10',
      borderColor: 'border-purple-500/20',
      iconColor: 'text-purple-400',
    },
    {
      label: 'Blood Donations',
      value: stats.bloodDonations,
      icon: Droplets,
      color: 'from-red-500 to-rose-500',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      iconColor: 'text-red-400',
    },
    {
      label: 'Medical Reports',
      value: stats.medicalReports,
      icon: FileText,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Health Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative p-6 rounded-2xl bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <p className="text-white/40 text-sm font-medium mb-1">Health Score</p>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-bold text-white">{stats.healthScore}</span>
              <span className="text-white/40 text-lg">/100</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Good</span>
            </div>
          </div>
          <div className="w-24 h-24 rounded-full border-4 border-cyan-500/30 flex items-center justify-center">
            <Heart className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-4 h-2 rounded-full bg-white/[0.05] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${stats.healthScore}%` }}
            transition={{ duration: 1, delay: 0.5 }}
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
          />
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
              className={`p-4 rounded-xl ${stat.bgColor} border ${stat.borderColor} group cursor-default`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mb-1">
                <AnimatedCounter value={stat.value} />
              </div>
              <p className="text-white/35 text-xs">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Additional Info */}
      {stats.nextDonationDate && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10">
          <Clock className="w-5 h-5 text-red-400" />
          <div>
            <p className="text-white/60 text-sm">Next Eligible Donation</p>
            <p className="text-red-400 text-sm font-semibold">{stats.nextDonationDate}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthStats;