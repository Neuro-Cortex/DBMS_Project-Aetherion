// src/components/layout/DashboardLayout.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Activity, Calendar, Users, Building2, Stethoscope,
  Pill, Baby, FileText, Sparkles
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// ============================================
// TYPES
// ============================================
export interface DashboardLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; path: string }>;
  actions?: React.ReactNode;
  className?: string;
}

// ============================================
// PARTICLE EFFECT
// ============================================
const ParticleEffect: React.FC = () => {
  const particles = Array.from({ length: 15 }, (_, i) => ({
    id: i,
    size: Math.random() * 6 + 2,
    x: Math.random() * 100,
    duration: Math.random() * 15 + 8,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/5"
          style={{ width: particle.size, height: particle.size, left: `${particle.x}%`, top: '100%' }}
          animate={{ y: ['0%', '-120%'], opacity: [0, 0.4, 0] }}
          transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: 'linear' }}
        />
      ))}
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  title,
  breadcrumbs = [],
  actions,
  className = '',
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const stats = [
    { icon: Building2, label: 'Hospitals', value: '250', color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { icon: Stethoscope, label: 'Doctors', value: '1.5K', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { icon: Users, label: 'Patients', value: '50K', color: 'text-purple-400', bg: 'bg-purple-500/10' },
    { icon: Activity, label: 'Emergency', value: '24/7', color: 'text-red-400', bg: 'bg-red-500/10' },
    { icon: Calendar, label: 'Appointments', value: '88', color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { icon: Pill, label: 'Pharmacy', value: '1.2K', color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
    { icon: Baby, label: 'Maternal', value: '450', color: 'text-pink-400', bg: 'bg-pink-500/10' },
    { icon: FileText, label: 'Reports', value: '340', color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  ];

  return (
    <div className="min-h-screen bg-[#050508] relative">
      {/* Background */}
      <div className="fixed inset-0 bg-[#050508] -z-10" />
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/[0.02] via-transparent to-purple-500/[0.02] -z-10" />
      
      {/* Particles */}
      <ParticleEffect />

      {/* Navbar */}
      <Navbar sidebarOpen={sidebarOpen} onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main */}
      <main className={`pt-20 min-h-screen ${className}`}>
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
              className="mb-4 flex items-center gap-2 text-sm">
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  <button type="button" onClick={() => navigate(crumb.path)}
                    className="text-white/40 hover:text-white/70 transition-colors">
                    {crumb.label}
                  </button>
                  {i < breadcrumbs.length - 1 && <span className="text-white/15">/</span>}
                </React.Fragment>
              ))}
            </motion.div>
          )}

          {/* Title + Actions */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', stiffness: 200 }}
            className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em]">
                {title || 'Dashboard'}
              </h1>
              <p className="text-white/30 text-sm mt-1">Welcome back! Here's what's happening today.</p>
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </motion.div>

          {/* Stats Grid */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.04 }} whileHover={{ y: -3, scale: 1.03 }}
                  onClick={() => navigate(`/${stat.label.toLowerCase()}`)}
                  className={`${stat.bg} rounded-xl border border-white/[0.06] p-4 text-center cursor-pointer hover:border-white/[0.12] transition-all`}>
                  <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-lg font-bold text-white">{stat.value}</div>
                  <div className="text-white/35 text-[11px] font-medium">{stat.label}</div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Content Area */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="bg-white/[0.015] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-6 mb-8">
            {children}
          </motion.div>
        </div>

        {/* Footer */}
        <Footer />
      </main>
    </div>
  );
};

export default DashboardLayout;