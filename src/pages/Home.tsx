// src/pages/Home.tsx
// PROJECT AETHERION - Production Ready Landing Page
// All 145+ components preserved, all 9 systems accessible

import React, { useEffect, useRef, useState, useMemo, lazy, Suspense } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';

import { DotLottieReact } from "@lottiefiles/dotlottie-react";

import { useNavigate } from 'react-router-dom';
import {
  Activity, Calendar, Video, User, Building2,
  ShieldCheck, Sparkles, ArrowRight, Phone, Search,
  Pill, MessageCircle, Play, Globe, Mic,
  CheckCircle2, Smile, Layers,
  Wallet, Smartphone, Wind, Baby, Monitor, Bell,
  Users2, Send, Download, Droplets,
  ChevronDown, Bot, Network, FileCode, Thermometer,
  Apple, QrCode, Siren, Stethoscope, Zap,
  type LucideIcon
} from 'lucide-react';

// ============================================
// EXISTING COMPONENTS (Reused - No Duplication)
// ============================================
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { BackToTop } from '../components/layout/BackToTop';

// Lazy loaded for performance
const TestimonialsSection = lazy(() => import('../components/common/TestimonialsSection'));

// ============================================
// TYPES
// ============================================
interface StatItem {
  value: number;
  suffix: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

interface RoleItem {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  link: string;
  features: string[];
}

interface SystemModule {
  icon: LucideIcon;
  title: string;
  desc: string;
  color: string;
  files: number;
  features: string[];
  link: string;
}

// ============================================
// CUSTOM HOOKS
// ============================================
const useAnimatedCounter = (target: number, duration: number = 2000) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(Math.round(eased * target));
      if (progress < 1) animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [isInView, target, duration]);

  return { count, ref };
};

const useTypewriter = (text: string, speed: number = 50) => {
  const [displayText, setDisplayText] = useState('');
  
  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed]);
  
  return displayText;
};

// ============================================
// SCROLL PROGRESS BAR
// ============================================
const ScrollProgress: React.FC = React.memo(() => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-cyan-400 via-blue-500 to-emerald-400 z-[9999] origin-left shadow-lg shadow-cyan-500/30"
      style={{ scaleX }}
    />
  );
});

ScrollProgress.displayName = 'ScrollProgress';

// ============================================
// HERO SECTION
// ============================================
const HeroSection: React.FC = React.memo(() => {
  const navigate = useNavigate();
  const typedText = useTypewriter("Smart Healthcare Ecosystem", 60);

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-cyan-950 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full min-h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {/* Live Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }} 
              animate={{ opacity: 1, scale: 1 }} 
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-xs font-medium mb-8 shadow-sm"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              145+ Components • 9 Major Systems • AI-Powered
              <Sparkles className="w-3.5 h-3.5 text-cyan-500" />
            </motion.div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white tracking-[-0.04em] mb-6 leading-[0.9]">
              One{' '}
              <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                {typedText}
                <span className="animate-pulse">|</span>
              </span>
              <br />
              for Everyone
            </h1>

            {/* Subtitle */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.5 }}
              className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-10 leading-relaxed"
            >
              Connecting <strong>Patients</strong>, <strong>Doctors</strong>, <strong>Hospitals</strong>,{' '}
              <strong>Blood Donors</strong>, <strong>Pharmacies</strong>, and{' '}
              <strong>Emergency Services</strong> with AI-powered intelligence — all in one unified platform.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-2xl text-base hover:shadow-xl hover:shadow-cyan-500/25 transition-all flex items-center gap-2 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
                onClick={() => navigate('/client/doctor-comparison')}
                className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl text-base border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 transition-all flex items-center gap-2"
              >
                <Search className="w-5 h-5" /> Find Doctors
              </motion.button>
              
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} 
                onClick={() => navigate('/emergency')}
                className="px-8 py-4 bg-red-500 text-white font-bold rounded-2xl text-base hover:bg-red-600 shadow-lg shadow-red-500/25 transition-all flex items-center gap-2 animate-pulse"
              >
                <Siren className="w-5 h-5" /> Emergency SOS
              </motion.button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
              className="flex flex-wrap items-center gap-6 mt-10 text-slate-400 dark:text-slate-500 text-sm"
            >
              {['50K+ Patients', '500+ Doctors', '250+ Hospitals', '24/7 Support'].map((text) => (
                <span key={text} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500"/> {text}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Healthcare Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hidden lg:flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg">
              {/* Glow effect behind animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-emerald-400/20 rounded-full blur-3xl animate-pulse" />
              <div className="relative z-10">
                <DotLottieReact
                  src="https://lottie.host/5c5f8c5a-4e0e-4a3c-8c5a-4e0e4a3c8c5a/healthcare.json"
                  autoplay
                  loop
                  style={{ width: '100%', height: 'auto', maxHeight: '500px' }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div 
        animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-600">
          <span className="text-xs font-medium">Scroll to explore</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </div>
      </motion.div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';

// ============================================
// SYSTEM MODULES SECTION
// ============================================
const SystemModulesSection: React.FC = React.memo(() => {
  const navigate = useNavigate();
  
  const systems: SystemModule[] = useMemo(() => [
    { icon: User, title: 'Client Panel', desc: 'Smart patient dashboard with appointments, health records, prescriptions, and AI recommendations.', color: 'from-blue-500 to-cyan-500', files: 16, link: '/client/dashboard', features: ['Appointment Booking', 'Health Records', 'Prescriptions', 'Nearby Donors'] },
    { icon: Stethoscope, title: 'Doctor Panel', desc: 'Complete practice management with patient lists, scheduling, prescriptions, and video consultations.', color: 'from-emerald-500 to-teal-500', files: 6, link: '/doctor/dashboard', features: ['Patient Management', 'Schedule', 'Prescriptions', 'Video Calls'] },
    { icon: Building2, title: 'Hospital Panel', desc: 'Hospital administration with bed management, ICU tracking, ambulance, and emergency services.', color: 'from-purple-500 to-violet-500', files: 8, link: '/hospital/dashboard', features: ['Bed Tracking', 'ICU Monitor', 'Ambulance', 'ER Management'] },
    { icon: Droplets, title: 'Blood Donation', desc: 'Blood donor network with real-time availability, emergency requests, and donation history.', color: 'from-red-500 to-rose-500', files: 5, link: '/client/nearby-donors', features: ['Donor Search', 'Blood Stock', 'Emergency Alert', 'Donation History'] },
    { icon: Pill, title: 'Pharmacy System', desc: 'Online pharmacy with medicine search, price comparison, prescription upload, and home delivery.', color: 'from-amber-500 to-orange-500', files: 8, link: '/pharmacy', features: ['Medicine Search', 'Price Compare', 'Rx Upload', 'Delivery'] },
    { icon: Wind, title: 'Oxygen Network', desc: 'Real-time oxygen cylinder tracking, hospital availability, and emergency oxygen support.', color: 'from-sky-500 to-indigo-500', files: 5, link: '/oxygen-network', features: ['Stock Monitor', 'Hospital List', 'Emergency O2', 'Cylinder Track'] },
    { icon: ShieldCheck, title: 'Admin Panel', desc: 'Super admin dashboard with user management, verifications, analytics, and system monitoring.', color: 'from-slate-500 to-gray-500', files: 12, link: '/admin/login', features: ['User Management', 'Verification', 'Analytics', 'Security'] },
    { icon: Baby, title: 'Women Care', desc: 'Dedicated women health section with pregnancy tracking, menstrual cycle, and baby care.', color: 'from-pink-500 to-fuchsia-500', files: 9, link: '/women-care', features: ['Pregnancy Track', 'Cycle Monitor', 'Baby Care', 'Vaccines'] },
    { icon: Bot, title: 'AI Assistant', desc: 'Intelligent health chatbot with symptom checker, medicine recommendations, and voice support.', color: 'from-violet-500 to-purple-500', files: 8, link: '/ai-assistant', features: ['Symptom Check', 'Medicine Info', 'Voice Input', 'Smart Alerts'] },
  ], []);

  return (
    <section id="modules" className="py-32 bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-medium mb-6">
            <Layers className="w-3.5 h-3.5" /> 9 Major System Modules
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-[-0.03em]">
            Complete Healthcare{' '}
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent">Ecosystem</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xl max-w-3xl mx-auto">
            145+ production-ready components powering every aspect of modern healthcare — from patient care to emergency response.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {systems.map((sys, i) => {
            const Icon = sys.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                whileHover={{ y: -8 }} onClick={() => navigate(sys.link)}
                className="group cursor-pointer relative p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${sys.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${sys.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <span className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs font-medium">{sys.files} files</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{sys.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 leading-relaxed">{sys.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {sys.features.map((f, j) => (
                      <span key={j} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium">{f}</span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center text-cyan-500 text-sm font-medium group-hover:gap-2 transition-all">
                    Explore <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

SystemModulesSection.displayName = 'SystemModulesSection';

// ============================================
// STAT CARD COMPONENT
// ============================================
const StatCard: React.FC<{ stat: StatItem; index: number }> = React.memo(({ stat, index }) => {
  const Icon = stat.icon;
  const { count, ref } = useAnimatedCounter(stat.value, 2500);
  
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }}
      whileHover={{ scale: 1.05 }}
      className="text-center group cursor-default p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
    >
      <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mb-1">{count}{stat.suffix}</div>
      <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

// ============================================
// STATS SECTION
// ============================================
const StatsSection: React.FC = React.memo(() => {
  const stats: StatItem[] = useMemo(() => [
    { value: 50, suffix: 'K+', label: 'Active Patients', icon: Users2, color: 'from-blue-500 to-cyan-500' },
    { value: 500, suffix: '+', label: 'Verified Doctors', icon: Stethoscope, color: 'from-emerald-500 to-teal-500' },
    { value: 250, suffix: '+', label: 'Partner Hospitals', icon: Building2, color: 'from-purple-500 to-violet-500' },
    { value: 99.9, suffix: '%', label: 'Uptime SLA', icon: ShieldCheck, color: 'from-amber-500 to-orange-500' },
    { value: 45, suffix: '+', label: 'Countries', icon: Globe, color: 'from-cyan-500 to-sky-500' },
    { value: 10, suffix: 'K+', label: 'Blood Donors', icon: Droplets, color: 'from-red-500 to-rose-500' },
    { value: 98, suffix: '%', label: 'Satisfaction', icon: Smile, color: 'from-green-500 to-emerald-500' },
    { value: 12, suffix: 'min', label: 'Avg Response', icon: Zap, color: 'from-pink-500 to-fuchsia-500' },
  ], []);

  return (
    <section id="stats" className="py-28 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">Live Healthcare Network</h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg">Real-time statistics from our growing ecosystem</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => <StatCard key={i} stat={s} index={i} />)}
        </div>
      </div>
    </section>
  );
});

StatsSection.displayName = 'StatsSection';

// ============================================
// ROLE DASHBOARD SECTION
// ============================================
const RoleDashboardSection: React.FC = React.memo(() => {
  const navigate = useNavigate();
  
  const roles: RoleItem[] = useMemo(() => [
    { icon: User, title: 'Patient Dashboard', desc: 'Appointments, health records, prescriptions, nearby donors, and AI health tips.', color: 'from-blue-500 to-cyan-500', link: '/client/dashboard', features: ['Upcoming Appointments', 'Health Score', 'Medicine Reminders', 'Blood Donation Status'] },
    { icon: Stethoscope, title: 'Doctor Dashboard', desc: 'Patient management, scheduling, prescriptions, video calls, and earnings analytics.', color: 'from-emerald-500 to-teal-500', link: '/doctor/dashboard', features: ["Today's Patients", 'Appointments', 'Prescriptions', 'Video Consultations'] },
    { icon: Building2, title: 'Hospital Dashboard', desc: 'Bed availability, ICU monitoring, ambulance tracking, and emergency management.', color: 'from-purple-500 to-violet-500', link: '/hospital/dashboard', features: ['Bed Availability', 'ICU Status', 'Ambulance Fleet', 'ER Queue'] },
    { icon: Pill, title: 'Pharmacy Dashboard', desc: 'Medicine inventory, order management, prescription verification, and sales analytics.', color: 'from-amber-500 to-orange-500', link: '/pharmacy/dashboard', features: ['Total Orders', 'Stock Status', 'Low Stock Alerts', 'Sales Analytics'] },
    { icon: ShieldCheck, title: 'Admin Panel', desc: 'User management, verification system, analytics, security, and system monitoring.', color: 'from-slate-500 to-gray-500', link: '/admin/dashboard', features: ['User Management', 'Verification', 'Analytics', 'System Health'] },
    { icon: Bot, title: 'AI Assistant', desc: 'Smart symptom checker, voice input, medicine recommendations, and health insights.', color: 'from-violet-500 to-purple-500', link: '/ai-assistant', features: ['Symptom Checker', 'Voice Assistant', 'Medicine Info', 'Health Tips'] },
  ], []);

  return (
    <section id="dashboards" className="py-32 bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-medium mb-6">
            <Monitor className="w-3.5 h-3.5" /> Role-Based Dashboards
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
            One Platform,{' '}
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent">Multiple Roles</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xl max-w-2xl mx-auto">Each role gets a personalized dashboard tailored to their specific needs.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {roles.map((role, i) => {
            const Icon = role.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
                whileHover={{ y: -8 }} onClick={() => navigate(role.link)}
                className="group cursor-pointer relative p-6 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{role.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">{role.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {role.features.map((f, j) => (
                    <span key={j} className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-600">{f}</span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

RoleDashboardSection.displayName = 'RoleDashboardSection';

// ============================================
// FEATURES GRID SECTION
// ============================================
const FeaturesGridSection: React.FC = React.memo(() => {
  const features = useMemo(() => [
    { icon: Calendar, title: 'Online Booking', desc: 'Book appointments in 30 seconds', color: 'from-blue-500 to-cyan-500' },
    { icon: FileCode, title: 'Prescriptions', desc: 'Digital prescription management', color: 'from-emerald-500 to-teal-500' },
    { icon: Video, title: 'Video Consult', desc: 'HD video calls with specialists', color: 'from-purple-500 to-violet-500' },
    { icon: Bell, title: 'Reminders', desc: 'Medicine & appointment alerts', color: 'from-amber-500 to-orange-500' },
    { icon: Download, title: 'Reports', desc: 'Download medical reports', color: 'from-red-500 to-rose-500' },
    { icon: Wallet, title: 'Payments', desc: 'Secure payment integration', color: 'from-green-500 to-emerald-500' },
    { icon: QrCode, title: 'QR Medical Card', desc: 'Digital health identity card', color: 'from-cyan-500 to-sky-500' },
    { icon: MessageCircle, title: 'Live Chat', desc: '24/7 support system', color: 'from-pink-500 to-fuchsia-500' },
    { icon: Smartphone, title: 'Cross-Platform', desc: 'Web, iOS, Android access', color: 'from-violet-500 to-purple-500' },
    { icon: ShieldCheck, title: 'Security', desc: 'HIPAA compliant encryption', color: 'from-slate-500 to-gray-500' },
    { icon: Search, title: 'Smart Search', desc: 'Find doctors & medicines', color: 'from-indigo-500 to-blue-500' },
    { icon: Activity, title: 'Health Analytics', desc: 'Track your health trends', color: 'from-teal-500 to-green-500' },
  ], []);

  return (
    <section id="features" className="py-32 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">Everything You Need</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xl">12 powerful features for complete healthcare management</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} viewport={{ once: true }}
                whileHover={{ y: -4, scale: 1.03 }} className="p-5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-cyan-300 dark:hover:border-cyan-600 hover:shadow-lg transition-all text-center group"
              >
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">{f.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{f.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

FeaturesGridSection.displayName = 'FeaturesGridSection';

// ============================================
// AI ASSISTANT SECTION
// ============================================
const AIAssistantSection: React.FC = React.memo(() => {
  const navigate = useNavigate();
  
  const suggestions = useMemo(() => [
    { text: 'Fever symptoms & treatment', icon: Thermometer },
    { text: 'Medicine dosage guide', icon: Pill },
    { text: 'Healthy diet plan', icon: Apple },
    { text: 'Emergency help', icon: Siren },
    { text: 'Pregnancy advice', icon: Baby },
    { text: 'Exercise recommendations', icon: Activity },
  ], []);

  return (
    <section id="ai" className="py-32 bg-white dark:bg-slate-900 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-violet-500/[0.03] blur-3xl" />
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-medium mb-6">
              <Bot className="w-3.5 h-3.5" /> AI-Powered Assistant
            </div>
            <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6">
              Your 24/7 AI{' '}
              <span className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Health Companion</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-8 leading-relaxed">
              Ask anything about your health. Our AI assistant provides instant medical guidance, symptom analysis, medicine information, and personalized health recommendations.
            </p>
            <button onClick={() => navigate('/ai-assistant')} className="px-8 py-4 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-2xl hover:shadow-xl hover:shadow-violet-500/25 transition-all flex items-center gap-2">
              <Mic className="w-5 h-5" /> Try AI Assistant <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-slate-200 dark:border-slate-700">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-violet-500 to-purple-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900 dark:text-white">Aetherion AI</p>
                <p className="text-xs text-emerald-500">Online • Ready to help</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 mb-4">
              <p className="text-sm text-slate-600 dark:text-slate-300">Hello! I'm your AI health assistant. How can I help you today?</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {suggestions.map((s, i) => (
                <button key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-600 transition-all">
                  <s.icon className="w-3.5 h-3.5" /> {s.text}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input type="text" placeholder="Ask your health question..." className="flex-1 px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:border-violet-500 outline-none" />
              <button className="w-12 h-12 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white flex items-center justify-center hover:shadow-lg transition-all"><Send className="w-5 h-5" /></button>
              <button className="w-12 h-12 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center hover:border-violet-300 dark:hover:border-violet-600 transition-all"><Mic className="w-5 h-5" /></button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

AIAssistantSection.displayName = 'AIAssistantSection';

// ============================================
// EMERGENCY SECTION
// ============================================
const EmergencySection: React.FC = React.memo(() => {
  const navigate = useNavigate();
  
  return (
    <section id="emergency" className="py-28 bg-gradient-to-r from-red-50 via-white to-red-50 dark:from-red-950/20 dark:via-slate-900 dark:to-red-950/20 border-y border-red-200 dark:border-red-500/10 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/20 mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-red-600 dark:text-red-400 text-sm font-bold tracking-wider uppercase">Emergency System Active</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">Need Urgent Help?</h2>
          <p className="text-slate-500 dark:text-slate-400 text-xl mb-10 max-w-2xl mx-auto">
            One tap connects you to the nearest emergency services with real-time ambulance tracking, hospital notifications, and live ETA updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/emergency')}
              className="px-10 py-5 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl text-lg shadow-2xl shadow-red-500/30 transition-all flex items-center justify-center gap-3 animate-pulse">
              <Siren className="w-6 h-6" /> Activate Emergency Mode
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => window.open('tel:911')}
              className="px-10 py-5 bg-white dark:bg-slate-800 border-2 border-red-300 dark:border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 font-bold text-lg hover:bg-red-50 dark:hover:bg-red-500/10 transition-all flex items-center justify-center gap-3">
              <Phone className="w-6 h-6" /> Call 911 Now
            </motion.button>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-slate-400 dark:text-slate-500 text-sm">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Avg 8 min response</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> 250+ partner ERs</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500"/> Live GPS tracking</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

EmergencySection.displayName = 'EmergencySection';

// ============================================
// ECOSYSTEM FLOW SECTION
// ============================================
const EcosystemFlowSection: React.FC = React.memo(() => {
  const connections = useMemo(() => [
    { from: 'Doctors', to: 'Patients', icon: Stethoscope },
    { from: 'Hospitals', to: 'Emergency', icon: Building2 },
    { from: 'Blood Donors', to: 'Requests', icon: Droplets },
    { from: 'Pharmacies', to: 'Prescriptions', icon: Pill },
    { from: 'AI', to: 'All Systems', icon: Bot },
  ], []);

  return (
    <section id="ecosystem" className="py-32 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-xs font-medium mb-6">
            <Network className="w-3.5 h-3.5" /> Connected Ecosystem
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">
            How Everything{' '}
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500 bg-clip-text text-transparent">Connects</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xl">A unified network where every system works together seamlessly</p>
        </motion.div>
        <div className="flex flex-wrap justify-center gap-8">
          {connections.map((conn, i) => {
            const Icon = conn.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                whileHover={{ scale: 1.05 }} className="flex items-center gap-4 p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{conn.from}</p>
                  <ArrowRight className="w-4 h-4 text-cyan-500 mx-auto my-1" />
                  <p className="text-sm font-bold text-cyan-600 dark:text-cyan-400">{conn.to}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

EcosystemFlowSection.displayName = 'EcosystemFlowSection';

// ============================================
// CTA SECTION
// ============================================
const CTASection: React.FC = React.memo(() => {
  const navigate = useNavigate();
  
  return (
    <section id="cta" className="py-32 bg-gradient-to-br from-cyan-500 via-blue-500 to-emerald-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-[-0.03em]">Ready to Transform Healthcare?</h2>
          <p className="text-white/80 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Join 50,000+ patients, 500+ doctors, and 250+ hospitals already using Aetherion. Sign up in seconds — free forever plan available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/register')}
              className="px-10 py-4 bg-white text-cyan-600 font-black rounded-2xl text-base hover:shadow-2xl transition-all flex items-center justify-center gap-2">
              Get Started Free <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/client/dashboard')}
              className="px-10 py-4 bg-white/10 text-white font-bold rounded-2xl text-base border-2 border-white/30 hover:bg-white/20 transition-all flex items-center justify-center gap-2">
              View Demo <Play className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

CTASection.displayName = 'CTASection';

// ============================================
// 🏠 HOME PAGE — MASTER ASSEMBLY
// ============================================
const Home: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
      <ScrollProgress />
      <Navbar transparent />
      <BackToTop />
      
      <main>
        <HeroSection />
        <SystemModulesSection />
        <StatsSection />
        <RoleDashboardSection />
        <FeaturesGridSection />
        <AIAssistantSection />
        <EmergencySection />
        <EcosystemFlowSection />
        
        {/* Lazy Loaded Testimonials */}
        <section id="testimonials" className="py-32 bg-white dark:bg-slate-900">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
              <h2 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4">Loved by Thousands</h2>
              <p className="text-slate-500 dark:text-slate-400 text-xl">Hear from patients and doctors who use Aetherion every day</p>
            </motion.div>
            <Suspense fallback={<div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>}>
              <TestimonialsSection />
            </Suspense>
          </div>
        </section>
        
        <CTASection />
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;