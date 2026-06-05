// src/pages/NotFound.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, ArrowLeft, Search, AlertCircle, 
  Heart,  Calendar,
  Sparkles, Zap, ArrowRight, HelpCircle,
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassmorphicCard } from '../components/ui/GlassmorphicCard';

// ============================================
// QUICK LINKS DATA
// ============================================

const quickLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: Home, color: 'from-cyan-500 to-blue-500' },
  { name: 'Find Doctors', path: '/doctors', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { name: 'Emergency', path: '/emergency', icon: AlertCircle, color: 'from-red-500 to-orange-500' },
  { name: 'Appointments', path: '/appointments', icon: Calendar, color: 'from-green-500 to-emerald-500' },
];

const suggestions = [
  "Check your spelling",
  "Try using fewer keywords",
  "Navigate using the menu above",
  "Return to homepage",
];

// ============================================
// MAIN COMPONENT
// ============================================

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const [seconds, setSeconds] = useState(10);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Floating particles
  const particles = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 5,
    duration: Math.random() * 10 + 5,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-cyan-400/30 rounded-full"
            initial={{ x: `${particle.x}%`, y: `${particle.y}%`, opacity: 0 }}
            animate={{ 
              y: [`${particle.y}%`, `${particle.y - 50}%`, `${particle.y}%`],
              x: [`${particle.x}%`, `${particle.x + 30}%`, `${particle.x}%`],
              opacity: [0, 0.5, 0],
            }}
            transition={{ 
              duration: particle.duration, 
              repeat: Infinity, 
              delay: particle.delay,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-20 left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 6, repeat: Infinity, delay: 4 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="max-w-4xl w-full"
        >
          <GlassmorphicCard variant="glass" className="p-8 md:p-12 text-center">
            {/* 404 Number with Animation */}
            <div className="relative mb-8">
              <motion.div
                animate={{ 
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  scale: [1, 1.05, 1],
                }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="text-[120px] md:text-[180px] lg:text-[220px] font-black leading-none"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #06b6d4, #a855f7, #ec4899, #f59e0b, #06b6d4)',
                  backgroundSize: '300% auto',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                404
              </motion.div>
              
              {/* Floating Elements around 404 */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute top-0 right-10 md:right-20"
              >
                <Sparkles className="w-8 h-8 text-yellow-400" />
              </motion.div>
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute bottom-10 left-10 md:left-20"
              >
                <Zap className="w-6 h-6 text-cyan-400" />
              </motion.div>
            </div>

            {/* Error Message */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl md:text-3xl font-bold text-white mb-3"
            >
              Oops! Page Not Found
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-white/60 mb-6 max-w-md mx-auto"
            >
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </motion.p>

            {/* Auto Redirect Timer */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-8"
            >
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-white/80 text-sm">
                Redirecting to homepage in {seconds} seconds
              </span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mb-12"
            >
              <Button 
                variant="gradient" 
                size="lg" 
                icon={ArrowLeft} 
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>
              <Button 
                variant="glass" 
                size="lg" 
                icon={Home} 
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                icon={HelpCircle} 
                onClick={() => setShowSuggestions(!showSuggestions)}
              >
                Need Help?
              </Button>
            </motion.div>

            {/* Suggestions */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-12 overflow-hidden"
                >
                  <GlassmorphicCard variant="glass" className="p-6">
                    <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-400" />
                      Suggestions:
                    </h3>
                    <ul className="space-y-2">
                      {suggestions.map((suggestion, i) => (
                        <motion.li
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-2 text-white/60"
                        >
                          <ArrowRight className="w-3 h-3 text-cyan-400" />
                          {suggestion}
                        </motion.li>
                      ))}
                    </ul>
                  </GlassmorphicCard>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <p className="text-white/50 text-sm mb-4">You might want to try these pages:</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {quickLinks.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <motion.button
                      key={link.name}
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(link.path)}
                      className={`bg-gradient-to-r ${link.color} rounded-xl p-3 text-center transition shadow-lg`}
                    >
                      <Icon className="w-5 h-5 text-white mx-auto mb-1" />
                      <span className="text-white text-xs font-medium">{link.name}</span>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          </GlassmorphicCard>

          {/* Decorative Footer */}
          <div className="text-center mt-8">
            <p className="text-white/30 text-xs">
              &copy; {new Date().getFullYear()} MediCare HMS. All rights reserved.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Custom Cursor Glow (Desktop only) */}
      <motion.div
        className="fixed w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none hidden lg:block"
        animate={{ x: mousePosition.x - 64, y: mousePosition.y - 64 }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
      />
    </div>
  );
};

export default NotFound;