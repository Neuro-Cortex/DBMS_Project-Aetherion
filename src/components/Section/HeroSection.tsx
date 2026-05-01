// src/components/sections/HeroSection.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Activity, Brain, TrendingUp, Calendar, Video,
  User, Building2, ShieldCheck, Globe,
  ArrowRight, Search, Mic, Sparkles,
  AlertTriangle, Pill, Clock, ChevronRight,
  Siren, BadgeCheck, Fingerprint, CreditCard, Command,
  Stethoscope, ArrowUpRight
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
interface StatData {
  value: string;
  label: string;
  icon: React.ElementType;
}

interface TrustBadge {
  icon: React.ElementType;
  text: string;
}

interface AISuggestion {
  text: string;
  icon: React.ElementType;
  urgency: 'critical' | 'high' | 'normal';
  category: string;
}

interface CTAButton {
  icon: React.ElementType;
  label: string;
  sublabel: string;
  link: string;
  primary: boolean;
}

// ============================================
// CONSTANTS
// ============================================
const STATS_DATA: StatData[] = [
  { value: '50K+', label: 'Patients Served', icon: Heart },
  { value: '500+', label: 'Expert Physicians', icon: Stethoscope },
  { value: '250+', label: 'Partner Hospitals', icon: Building2 },
  { value: '99.9%', label: 'Uptime Guaranteed', icon: ShieldCheck },
];

const TRUST_BADGES: TrustBadge[] = [
  { icon: ShieldCheck, text: 'HIPAA Compliant' },
  { icon: Fingerprint, text: '256-bit Encryption' },
  { icon: BadgeCheck, text: 'ISO 27001 Certified' },
  { icon: Globe, text: '45+ Countries' },
];

const AI_SUGGESTIONS: AISuggestion[] = [
  { text: "I'm experiencing chest pain", icon: Heart, urgency: 'critical', category: 'Emergency' },
  { text: "Schedule cardiologist appointment", icon: Calendar, urgency: 'normal', category: 'Booking' },
  { text: "Emergency ambulance needed", icon: Siren, urgency: 'critical', category: 'Emergency' },
  { text: "Refill my prescription", icon: Pill, urgency: 'normal', category: 'Pharmacy' },
  { text: "Connect via video call", icon: Video, urgency: 'high', category: 'Telemedicine' },
];

const CTA_BUTTONS: CTAButton[] = [
  { icon: Calendar, label: 'Book Appointment', sublabel: 'Choose time & doctor', link: '/appointments', primary: true },
  { icon: Siren, label: 'Emergency', sublabel: '24/7 immediate help', link: '/emergency', primary: false },
  { icon: Video, label: 'Virtual Consult', sublabel: 'Talk to a doctor now', link: '/telemedicine', primary: false },
];

// ============================================
// SUB-COMPONENTS
// ============================================

// Animated counter with intersection observer
const AnimatedValue: React.FC<{ value: string }> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const ref = useRef<HTMLSpanElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const numericPart = parseFloat(value.replace(/[^0-9.]/g, ''));
          const suffix = value.replace(/[0-9.]/g, '');
          const duration = 1500;
          const startTime = Date.now();

          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * numericPart);
            setDisplayValue(`${current}${suffix}`);
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value, hasAnimated]);

  return <span ref={ref}>{displayValue}</span>;
};

// ============================================
// MAIN HERO SECTION
// ============================================
const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [liveStats, setLiveStats] = useState({
    activeDoctors: 847,
    aiQueries: 2340,
    emergencyCases: 23,
  });

  // Scroll animations
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, 100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.97]);
  const blurAmount = useTransform(scrollY, [0, 300], [0, 10]);

  // Mouse parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 30 });

  const showAIPreview = isSearchFocused || searchQuery.length > 0;

  // Clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Live stats
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        activeDoctors: Math.max(800, Math.min(900, prev.activeDoctors + Math.floor(Math.random() * 3) - 1)),
        aiQueries: prev.aiQueries + Math.floor(Math.random() * 8),
        emergencyCases: Math.max(0, Math.min(30, prev.emergencyCases + Math.floor(Math.random() * 2) - 1)),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Mouse move
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        mouseX.set((x - 0.5) * 20);
        mouseY.set((y - 0.5) * 20);
        setMousePosition({ x, y });
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setIsSearchFocused(false);
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getUrgencyStyles = useCallback((urgency: string): string => {
    const styles: Record<string, string> = {
      critical: 'text-red-400 border-red-500/30 bg-red-500/10',
      high: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      normal: 'text-slate-400 border-slate-500/30 bg-slate-500/10',
    };
    return styles[urgency] || styles.normal;
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050508]"
      aria-label="Hero section - Aetherion Health"
    >
      {/* ============================================ */}
      {/* BACKGROUND LAYER */}
      {/* ============================================ */}

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Subtle gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[800px] h-[800px] rounded-full opacity-[0.03]"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 70%)',
            left: '50%',
            top: '50%',
            x: springX,
            y: springY,
          }}
        />
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.02]"
          style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.3) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-[0.02]"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.3) 0%, transparent 70%)' }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
          maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 70%)',
        }}
      />

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <motion.div
        style={{ y, opacity, scale, filter: blurAmount }}
        className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full"
      >
        {/* Live Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex justify-center mb-10"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-white/40 text-xs font-medium tracking-wide">
              {liveStats.activeDoctors} doctors online now
            </span>
            <span className="text-white/15">•</span>
            <span className="text-white/40 text-xs font-medium tracking-wide">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5.5rem] font-bold text-white leading-[1.08] tracking-[-0.03em]">
            <span className="block">Healthcare that</span>
            <span className="block mt-1">
              <span className="text-white/90">thinks</span>{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-indigo-400 via-violet-400 to-sky-400 bg-clip-text text-transparent">
                  ahead
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3 text-violet-400/20"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                >
                  <motion.path
                    d="M0 6 Q 25 0, 50 6 T 100 6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 1, duration: 1.2, ease: 'easeOut' }}
                  />
                </svg>
              </span>
            </span>
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-base sm:text-lg lg:text-xl text-white/35 max-w-xl mx-auto leading-relaxed mb-12 font-normal"
        >
          AI-powered healthcare platform that connects you with the right doctor, at the right time — with
          intelligence built into every interaction.
        </motion.p>

        {/* Search + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="max-w-xl mx-auto mb-16"
        >
          {/* AI Smart Search */}
          <div className="relative mb-5">
            <div
              className={`relative flex items-center bg-white/[0.03] backdrop-blur-xl rounded-2xl border transition-all duration-300 ${
                isSearchFocused
                  ? 'border-white/20 bg-white/[0.05] shadow-lg shadow-black/20'
                  : 'border-white/[0.08] hover:border-white/[0.12]'
              }`}
            >
              <Search
                className={`absolute left-4 w-4 h-4 transition-colors duration-300 ${
                  isSearchFocused ? 'text-white/60' : 'text-white/25'
                }`}
              />

              <input
                ref={searchRef}
                id="hero-search"
                name="hero-search"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                placeholder="Describe your symptoms or ask anything..."
                className="w-full bg-transparent pl-11 pr-24 py-4 text-white placeholder-white/25 outline-none text-base"
                autoComplete="off"
                aria-label="AI healthcare search"
                role="searchbox"
              />

              <div className="absolute right-3 flex items-center gap-2">
                <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-[10px] text-white/20 bg-white/[0.04] rounded-md font-mono border border-white/[0.06]">
                  <Command className="w-3 h-3" />K
                </kbd>
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 bg-white/[0.06] hover:bg-white/[0.1] rounded-xl transition-colors"
                  aria-label="Voice search"
                >
                  <Mic className="w-4 h-4 text-white/50" />
                </motion.button>
              </div>
            </div>

            {/* AI Suggestions Dropdown */}
            <AnimatePresence>
              {showAIPreview && (
                <motion.div
                  initial={{ opacity: 0, y: 5, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 5, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#0a0a10] backdrop-blur-2xl rounded-2xl border border-white/[0.08] overflow-hidden z-50 shadow-2xl shadow-black/40"
                >
                  <div className="p-1.5">
                    {AI_SUGGESTIONS.map((suggestion, idx) => {
                      const Icon = suggestion.icon;
                      return (
                        <motion.button
                          key={`sug-${idx}`}
                          type="button"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.03 }}
                          onClick={() => setSearchQuery(suggestion.text)}
                          className="w-full text-left px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/[0.04] rounded-xl transition-all flex items-center gap-3 group"
                        >
                          <Icon className="w-4 h-4 text-white/30 group-hover:text-white/60 transition-colors shrink-0" />
                          <span className="flex-1 text-sm truncate">{suggestion.text}</span>
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${getUrgencyStyles(
                              suggestion.urgency
                            )}`}
                          >
                            {suggestion.urgency}
                          </span>
                          <ArrowUpRight className="w-3 h-3 text-white/15 opacity-0 group-hover:opacity-100 transition-all shrink-0" />
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
            {CTA_BUTTONS.map((btn, idx) => {
              const Icon = btn.icon;
              const isEmergency = btn.label === 'Emergency';
              return (
                <motion.button
                  key={`cta-${idx}`}
                  type="button"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(btn.link)}
                  className={`group relative flex items-center gap-3 px-5 py-3 rounded-xl font-medium text-sm transition-all duration-200 w-full sm:w-auto justify-center ${
                    btn.primary
                      ? 'bg-white text-black hover:bg-white/90 shadow-lg shadow-white/5'
                      : isEmergency
                      ? 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 hover:border-red-500/30'
                      : 'bg-white/[0.03] text-white/70 border border-white/[0.08] hover:bg-white/[0.06] hover:text-white hover:border-white/[0.15]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isEmergency ? 'text-red-400' : ''}`} />
                  <span>{btn.label}</span>
                  <ArrowRight
                    className={`w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 ${
                      btn.primary ? 'text-black/40' : 'text-white/30'
                    }`}
                  />
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12"
        >
          {STATS_DATA.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={`stat-${idx}`} className="text-center group cursor-default">
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight mb-1">
                  <AnimatedValue value={stat.value} />
                </div>
                <div className="flex items-center justify-center gap-1.5 text-white/30 group-hover:text-white/50 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">{stat.label}</span>
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          className="flex flex-wrap justify-center gap-3"
        >
          {TRUST_BADGES.map((badge, idx) => {
            const Icon = badge.icon;
            return (
              <div
                key={`badge-${idx}`}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.05]"
              >
                <Icon className="w-3 h-3 text-white/25" />
                <span className="text-white/30 text-xs font-medium">{badge.text}</span>
              </div>
            );
          })}
        </motion.div>
      </motion.div>

      {/* ============================================ */}
      {/* SCROLL INDICATOR */}
      {/* ============================================ */}
      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <button
          type="button"
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
          className="group flex flex-col items-center gap-2 cursor-pointer"
          aria-label="Scroll to explore"
        >
          <span className="text-white/15 text-[10px] font-medium uppercase tracking-[0.2em] group-hover:text-white/30 transition-colors">
            Explore
          </span>
          <div className="w-5 h-8 border border-white/10 rounded-full flex justify-center group-hover:border-white/25 transition-all">
            <motion.div
              animate={{ y: [2, 12, 2] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-1 h-1.5 bg-white/30 rounded-full mt-1.5 group-hover:bg-white/50 transition-colors"
            />
          </div>
        </button>
      </motion.div>
    </section>
  );
};

export default HeroSection;