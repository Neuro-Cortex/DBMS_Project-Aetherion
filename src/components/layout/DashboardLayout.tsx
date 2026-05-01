import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Activity,
  Calendar,
  Users,
  Hospital,
  Stethoscope,
  Pill,
  Baby,
  FileText
} from 'lucide-react';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface DashboardLayoutProps {
  children: React.ReactNode;
  variant?: 'glass' | 'gradient' | 'neon';
  title?: string;
  breadcrumbs?: Array<{
    label: string;
    path: string;
  }>;
  actions?: React.ReactNode;
}

// ============================================
// PARTICLE EFFECT COMPONENT
// ============================================
const ParticleEffect: React.FC = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 8 + 2,
    x: Math.random() * 100,
    y: Math.random() * 100,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white/10"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: ['0%', '-100%'],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
};

// ============================================
// DASHBOARD LAYOUT COMPONENT
// ============================================
export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  variant = 'glass',
  title,
  breadcrumbs = [],
  actions,
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Stats cards data
  const stats = [
    { icon: Hospital, label: 'Hospitals', value: 250, color: 'blue' },
    { icon: Stethoscope, label: 'Doctors', value: 1500, color: 'green' },
    { icon: Users, label: 'Patients', value: 50000, color: 'purple' },
    { icon: Activity, label: 'Emergency', value: '24/7', color: 'red' },
    { icon: Calendar, label: 'Appointments', value: 88, color: 'yellow' },
    { icon: Pill, label: 'Pharmacy', value: 1200, color: 'cyan' },
    { icon: Baby, label: 'Maternal Care', value: 450, color: 'pink' },
    { icon: FileText, label: 'Reports', value: 340, color: 'indigo' },
  ];

  return (
    <div className="min-h-screen relative">
      {/* Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 -z-10" />

      {/* Particle Effect */}
      <ParticleEffect />

      {/* Navbar */}
      <Navbar
        variant={variant}
        sidebarOpen={sidebarOpen}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Sidebar */}
      <Sidebar
        variant={variant}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        activePath={location.pathname}
        onNavigate={(path) => navigate(path)}
      />

      {/* Main Content */}
      <motion.main
        className={clsx(
          'pt-20 min-h-screen transition-all duration-300',
          sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72',
          sidebarOpen ? 'ml-72' : 'ml-0'
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <div className="p-6">
          {/* Breadcrumbs */}
          {breadcrumbs.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-2"
            >
              {breadcrumbs.map((crumb, i) => (
                <React.Fragment key={i}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigate(crumb.path)}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                  >
                    {crumb.label}
                  </motion.button>
                  {i < breadcrumbs.length - 1 && (
                    <span className="text-white/40">/</span>
                  )}
                </React.Fragment>
              ))}
            </motion.div>
          )}

          {/* Page Title & Actions */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="mb-8 flex items-center justify-between"
          >
            <div>
              <h1 className="text-4xl font-black text-white mb-2 drop-shadow-lg">
                {title || 'Dashboard'}
              </h1>
              <p className="text-white/70">
                Welcome back! Here's what's happening today.
              </p>
            </div>

            {actions && (
              <div className="flex items-center gap-3">
                {actions}
              </div>
            )}
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -5,
                    transition: { duration: 0.3 }
                  }}
                  className={clsx(
                    'relative p-6 rounded-2xl',
                    'bg-white/10 dark:bg-gray-900/10',
                    'backdrop-blur-xl backdrop-saturate-150',
                    'border border-white/20 dark:border-gray-700/20',
                    'shadow-lg hover:shadow-2xl transition-all duration-300',
                    'cursor-pointer overflow-hidden'
                  )}
                  onClick={() => navigate(`/${stat.label.toLowerCase().replace(' ', '-')}`)}
                >
                  {/* Glow Effect */}
                  <motion.div
                    className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-2xl opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  {/* Content */}
                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <motion.span 
                        className="text-2xl font-black text-white"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                      >
                        {stat.value}
                      </motion.span>
                    </div>
                    <p className="text-white/70 text-sm font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={clsx(
              'rounded-3xl p-6 mb-8',
              'bg-white/10 dark:bg-gray-900/10',
              'backdrop-blur-xl backdrop-saturate-150',
              'border border-white/20 dark:border-gray-700/20',
              'shadow-2xl'
            )}
          >
            {children}
          </motion.div>
        </div>

        {/* Footer */}
        <Footer variant={variant} />
      </motion.main>
    </div>
  );
};