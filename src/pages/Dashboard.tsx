
import React, { useState, useEffect, useRef, useMemo, lazy, Suspense } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Activity, AlertCircle, Baby, Brain, Building2,
  Calendar, CheckCircle2, ChevronRight, Droplets,
  Heart, Lock, Mic, Pill, Play, Shield,
  Sparkles, Star, Stethoscope, Syringe, Users,
  Video, Wind, Zap, ArrowRight, Bot, Send
} from 'lucide-react';




import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { GlassmorphicCard } from '../components/ui/GlassmorphicCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { Loader } from '../components/ui/Loader';
import { SearchBar } from '../components/common/SearchBar';




import { AIResponseCard } from '../components/ai/AIResponseCard';
import { AISuggestionChips } from '../components/ai/AISuggestionChips';
import { AIVoiceButton } from '../components/ai/AIVoiceButton';




import { useMediaQuery } from '../hooks/useMediaQuery';



const GoogleMap = lazy(() => import('../components/common/GoogleMap'));
const TestimonialsSection = lazy(() => import('../components/common/TestimonialsSection'));
const BackToTop = lazy(() => import('../components/layout/BackToTop'));




type ColorKey = 'blue' | 'teal' | 'purple' | 'red' | 'amber' | 'green' | 'indigo' | 'pink' | 'rose';
type MarkerType = 'hospital' | 'blood' | 'pharmacy' | 'icu' | 'ambulance';

interface StatData {
  icon: React.ElementType;
  value: string;
  label: string;
  color: ColorKey;
  change: string;
}

interface FeatureData {
  icon: React.ElementType;
  title: string;
  description: string;
  color: ColorKey;
  link: string;
}

interface DashboardPreviewData {
  title: string;
  description: string;
  color: ColorKey;
  icon: React.ElementType;
  gradient: string;
}

interface TechItem {
  name: string;
  icon: string;
  color: string;
}

interface FloatingIconProps {
  icon: React.ElementType;
  className?: string;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
}

// ============================================
// COLOR MAPPING (Fixes Tailwind dynamic class issue)
// ============================================
const colorClasses: Record<ColorKey, { bg: string; text: string; chart: string; gradient: string }> = {
  blue: {
    bg: 'bg-blue-500/20',
    text: 'text-blue-400',
    chart: 'bg-blue-400/60',
    gradient: 'from-blue-500/20 to-blue-600/20',
  },
  teal: {
    bg: 'bg-teal-500/20',
    text: 'text-teal-400',
    chart: 'bg-teal-400/60',
    gradient: 'from-teal-500/20 to-teal-600/20',
  },
  purple: {
    bg: 'bg-purple-500/20',
    text: 'text-purple-400',
    chart: 'bg-purple-400/60',
    gradient: 'from-purple-500/20 to-purple-600/20',
  },
  red: {
    bg: 'bg-red-500/20',
    text: 'text-red-400',
    chart: 'bg-red-400/60',
    gradient: 'from-red-500/20 to-red-600/20',
  },
  amber: {
    bg: 'bg-amber-500/20',
    text: 'text-amber-400',
    chart: 'bg-amber-400/60',
    gradient: 'from-amber-500/20 to-amber-600/20',
  },
  green: {
    bg: 'bg-green-500/20',
    text: 'text-green-400',
    chart: 'bg-green-400/60',
    gradient: 'from-green-500/20 to-green-600/20',
  },
  indigo: {
    bg: 'bg-indigo-500/20',
    text: 'text-indigo-400',
    chart: 'bg-indigo-400/60',
    gradient: 'from-indigo-500/20 to-indigo-600/20',
  },
  pink: {
    bg: 'bg-pink-500/20',
    text: 'text-pink-400',
    chart: 'bg-pink-400/60',
    gradient: 'from-pink-500/20 to-pink-600/20',
  },
  rose: {
    bg: 'bg-rose-500/20',
    text: 'text-rose-400',
    chart: 'bg-rose-400/60',
    gradient: 'from-rose-500/20 to-rose-600/20',
  },
};

// ============================================
// ANIMATED BACKGROUND ELEMENTS
// ============================================

const FloatingIcon: React.FC<FloatingIconProps> = React.memo(({ 
  icon: Icon, 
  className = '', 
  delay = 0, 
  duration = 20, 
  x = 0, 
  y = 0 
}) => (
  <motion.div
    className={`absolute ${className}`}
    animate={{
      y: [y, y - 30, y],
      x: [x, x + 15, x],
    }}
    transition={{
      duration,
      repeat: Infinity,
      delay,
      ease: 'easeInOut',
    }}
  >
    <Icon className="w-8 h-8 text-white/10" />
  </motion.div>
));

FloatingIcon.displayName = 'FloatingIcon';

const ParticleField: React.FC = React.memo(() => {
  const particles = useMemo(() => {
    return [...Array(20)].map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 5,
    }));
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
          }}
          animate={{
            y: [0, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
});

ParticleField.displayName = 'ParticleField';

// ============================================
// HERO SECTION
// ============================================

const HeroSection: React.FC = React.memo(() => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900/60 to-teal-900/40 z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent" />
        
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.1) 1px, transparent 0)`,
            backgroundSize: '60px 60px',
          }}
        />
        
        <FloatingIcon icon={Heart} className="top-1/4 left-[10%]" delay={0} />
        <FloatingIcon icon={Brain} className="top-1/3 right-[15%]" delay={2} />
        <FloatingIcon icon={Stethoscope} className="bottom-1/4 left-[20%]" delay={4} />
        <FloatingIcon icon={Pill} className="top-1/2 right-[25%]" delay={1} />
        <FloatingIcon icon={Droplets} className="bottom-1/3 right-[10%]" delay={3} />
        <FloatingIcon icon={Activity} className="top-[15%] left-[50%]" delay={5} />
        <FloatingIcon icon={Shield} className="bottom-[20%] left-[40%]" delay={2} />
        
        <ParticleField />
      </div>

      {/* Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-medium">AI-Powered Healthcare Platform</span>
            </motion.div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white leading-tight">
                Aetherion
                <br />
                <span className="bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">
                  Smart Healthcare
                </span>
                <br />
                Ecosystem
              </h1>
              <p className="text-lg sm:text-xl text-slate-300 max-w-xl leading-relaxed">
                AI-Powered Healthcare Platform Connecting Patients, Doctors, Hospitals, 
                Blood Donors and Emergency Systems in Real-Time
              </p>
            </div>

            {/* Search Bar */}
            <div className="max-w-md">
              <SearchBar placeholder="Search doctors, hospitals, medicines..." />
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 shadow-xl shadow-blue-500/25"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Demo
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="danger"
                  size="lg"
                  onClick={() => navigate('/emergency')}
                  className="animate-pulse bg-red-500 hover:bg-red-600"
                >
                  <AlertCircle className="w-5 h-5 mr-2" />
                  Emergency SOS
                </Button>
              </motion.div>
            </div>

            {/* Stats Row */}
            <div className="flex flex-wrap gap-8 pt-4">
              {[
                { value: '15K+', label: 'Active Users' },
                { value: '450+', label: 'Verified Doctors' },
                { value: '85+', label: 'Partner Hospitals' },
                { value: '2.3K+', label: 'Blood Donors' },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-slate-400">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="hidden lg:block"
          >
            <GlassmorphicCard className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="w-32 h-3 bg-white/20 rounded-full" />
                  <div className="w-20 h-2 bg-white/10 rounded-full mt-2" />
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded-full bg-blue-500/30" />
                  <div className="w-8 h-8 rounded-full bg-teal-500/30" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500/40 to-teal-500/40 mb-2" />
                    <div className="w-16 h-2 bg-white/20 rounded-full mb-1" />
                    <div className="w-12 h-3 bg-white/10 rounded-full" />
                  </div>
                ))}
              </div>

              <div className="h-32 bg-white/5 rounded-xl border border-white/10 p-3">
                <div className="flex items-end gap-2 h-full">
                  {[60, 80, 45, 90, 70, 85, 95].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="flex-1 bg-gradient-to-t from-blue-500/60 to-teal-500/60 rounded-t"
                    />
                  ))}
                </div>
              </div>





              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500/50 to-purple-500/50" />
                    <div className="flex-1">
                      <div className="w-24 h-2 bg-white/20 rounded-full" />
                      <div className="w-16 h-1.5 bg-white/10 rounded-full mt-1" />
                    </div>
                    <div className="w-16 h-6 rounded-full bg-green-500/20" />
                  </div>
                ))}
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>











      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
          <motion.div
            className="w-1.5 h-3 bg-white/50 rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
});

HeroSection.displayName = 'HeroSection';






const LiveStatsSection: React.FC = React.memo(() => {
  const statsRef = useRef(null);
  const isInView = useInView(statsRef, { once: true, margin: '-100px' });

  const liveStats: StatData[] = useMemo(() => [
    { icon: Users, value: '15,234', label: 'Total Patients', color: 'blue', change: '+12%' },
    { icon: Stethoscope, value: '450', label: 'Verified Doctors', color: 'teal', change: '+8%' },
    { icon: Building2, value: '85', label: 'Hospitals', color: 'purple', change: '+5%' },
    { icon: Droplets, value: '2,340', label: 'Blood Donors', color: 'red', change: '+15%' },
    { icon: AlertCircle, value: '2,347', label: 'Emergency Cases', color: 'amber', change: '-3%' },
    { icon: Pill, value: '320', label: 'Pharmacies', color: 'green', change: '+10%' },
  ], []);

  return (
    <section className="relative py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={statsRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="info" className="mb-4">Live Platform Statistics</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Real-Time Healthcare Network
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Connecting thousands of patients with healthcare providers across the nation
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {liveStats.map((stat, index) => {
            const Icon = stat.icon;
            const colors = colorClasses[stat.color];
            
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <GlassmorphicCard className="p-6 text-center hover:scale-105 transition-transform duration-300">
                  <div className={`inline-flex p-3 rounded-xl ${colors.bg} mb-4`}>
                    <Icon className={`w-6 h-6 ${colors.text}`} />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="text-2xl font-bold text-white mb-1"
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-slate-400 mb-2">{stat.label}</div>
                  <span className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.change} this month
                  </span>
                </GlassmorphicCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

LiveStatsSection.displayName = 'LiveStatsSection';

// ============================================
// FEATURES SECTION
// ============================================

const FeaturesSection: React.FC = React.memo(() => {
  const featuresRef = useRef(null);
  const isInView = useInView(featuresRef, { once: true, margin: '-100px' });

  const features: FeatureData[] = useMemo(() => [
    {
      icon: Users,
      title: 'Client System',
      description: 'Complete patient portal with health records, appointments, prescriptions, and AI health tips',
      color: 'blue',
      link: '/register?role=client',
    },
    {
      icon: Stethoscope,
      title: 'Doctor System',
      description: 'Advanced doctor dashboard with patient management, prescriptions, and telemedicine',
      color: 'teal',
      link: '/register?role=doctor',
    },
    {
      icon: Building2,
      title: 'Hospital System',
      description: 'Full hospital management with bed tracking, ICU monitoring, and emergency response',
      color: 'purple',
      link: '/register?role=hospital',
    },
    {
      icon: Droplets,
      title: 'Blood Donation',
      description: 'Real-time blood donor network with location-based search and emergency requests',
      color: 'red',
      link: '/register?role=donor',
    },
    {
      icon: Wind,
      title: 'Oxygen Network',
      description: 'Live oxygen supply tracking across hospitals with emergency alerts',
      color: 'amber',
      link: '/oxygen',
    },
    {
      icon: Pill,
      title: 'Pharmacy System',
      description: 'Complete pharmacy management with inventory tracking and order management',
      color: 'green',
      link: '/register?role=pharmacy',
    },
    {
      icon: Brain,
      title: 'AI Assistant',
      description: 'Smart symptom checker, health recommendations, and voice-powered medical queries',
      color: 'indigo',
      link: '/ai-assistant',
    },
    {
      icon: Baby,
      title: 'Women Care',
      description: 'Dedicated women health system with pregnancy tracking and specialized care',
      color: 'pink',
      link: '/women-care',
    },
    {
      icon: AlertCircle,
      title: 'Emergency System',
      description: 'Real-time emergency response with ambulance tracking and hospital routing',
      color: 'rose',
      link: '/emergency',
    },
  ], []);

  return (
    <section id="features" className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={featuresRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="info" className="mb-4">Complete Healthcare Suite</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Everything You Need in One Platform
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            A comprehensive healthcare ecosystem connecting all stakeholders 
            with AI-powered intelligence and real-time communication
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const colors = colorClasses[feature.color];
            
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8 }}
              >
                <Link to={feature.link}>
                  <Card className="p-6 h-full hover:border-white/20 transition-all duration-300 group cursor-pointer">
                    <div className={`inline-flex p-3 rounded-xl ${colors.bg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                    <div className="flex items-center gap-1 mt-4 text-blue-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = 'FeaturesSection';

// ============================================
// AI ASSISTANT PREVIEW SECTION
// ============================================

const AIPreviewSection: React.FC = React.memo(() => {
  const aiRef = useRef(null);
  const isInView = useInView(aiRef, { once: true, margin: '-100px' });

  return (
    <section className="relative py-20 bg-gradient-to-b from-slate-900/50 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Info */}
          <motion.div
            ref={aiRef}
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Badge variant="success" className="mb-4">AI-Powered</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Your Personal
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                AI Health Assistant
              </span>
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Get instant health insights, symptom analysis, medication information, 
              and personalized recommendations powered by advanced AI
            </p>

            <div className="space-y-4">
              {[
                { icon: Brain, text: 'Smart symptom checker with medical database' },
                { icon: Mic, text: 'Voice-powered health queries and responses' },
                { icon: Shield, text: 'HIPAA-compliant secure conversations' },
                { icon: Zap, text: 'Instant appointment booking and reminders' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <item.icon className="w-5 h-5 text-blue-400" />
                  </div>
                  <span className="text-slate-300">{item.text}</span>
                </div>
              ))}
            </div>

            <Button variant="primary" size="lg">
              Try AI Assistant
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>

          {/* Right - Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GlassmorphicCard className="p-6 space-y-4">
              {/* Chat Header */}
              <div className="flex items-center gap-3 pb-4 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">AI Health Assistant</h3>
                  <p className="text-green-400 text-xs">Online</p>
                </div>
              </div>

              {/* AI Responses */}
              <div className="space-y-3">
                <AIResponseCard
                  message="I can help you with symptom analysis. What symptoms are you experiencing?"
                  type="bot"
                />
                
                <AISuggestionChips
                  suggestions={[
                    'Headache & fever',
                    'Chest pain',
                    'Allergies',
                    'Check blood pressure',
                    'Find a doctor',
                    'Book appointment'
                  ]}
                  onSelect={() => {}}
                />
              </div>

              {/* Voice Button */}
              <div className="flex items-center gap-2 pt-3 border-t border-white/10">
                <AIVoiceButton onVoiceInput={() => {}} />
                <div className="flex-1 bg-white/5 rounded-xl px-4 py-2 text-slate-400 text-sm">
                  Type your health query...
                </div>
                <button className="p-2 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors">
                  <Send className="w-4 h-4 text-white" />
                </button>
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

AIPreviewSection.displayName = 'AIPreviewSection';

// ============================================
// DASHBOARD PREVIEW SECTION
// ============================================

const DashboardPreviewSection: React.FC = React.memo(() => {
  const previewRef = useRef(null);
  const isInView = useInView(previewRef, { once: true, margin: '-100px' });

  const dashboards: DashboardPreviewData[] = useMemo(() => [
    {
      title: 'Client Dashboard',
      description: 'Health score, appointments, prescriptions, AI tips',
      color: 'blue',
      icon: Users,
      gradient: 'from-blue-500/20 to-blue-600/20',
    },
    {
      title: 'Doctor Dashboard',
      description: 'Patient queue, schedule, earnings, telemedicine',
      color: 'teal',
      icon: Stethoscope,
      gradient: 'from-teal-500/20 to-teal-600/20',
    },
    {
      title: 'Hospital Dashboard',
      description: 'Beds, ICU, oxygen, ambulance, emergency',
      color: 'purple',
      icon: Building2,
      gradient: 'from-purple-500/20 to-purple-600/20',
    },
    {
      title: 'Admin Dashboard',
      description: 'User management, verification, analytics, security',
      color: 'indigo',
      icon: Shield,
      gradient: 'from-indigo-500/20 to-indigo-600/20',
    },
    {
      title: 'Pharmacy Dashboard',
      description: 'Inventory, orders, stock alerts, revenue',
      color: 'green',
      icon: Pill,
      gradient: 'from-green-500/20 to-green-600/20',
    },
    {
      title: 'Blood Donor Dashboard',
      description: 'Donations, rewards, emergency requests, history',
      color: 'red',
      icon: Droplets,
      gradient: 'from-red-500/20 to-red-600/20',
    },
  ], []);

  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={previewRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="warning" className="mb-4">Role-Based Dashboards</Badge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
            Powerful Dashboards for Every Role
          </h2>
          <p className="text-slate-400 text-lg max-w-3xl mx-auto">
            Each stakeholder gets a customized dashboard with real-time data, 
            analytics, and tools specific to their needs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((dashboard, index) => {
            const Icon = dashboard.icon;
            const colors = colorClasses[dashboard.color];
            
            return (
              <motion.div
                key={dashboard.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5 }}
              >
                <GlassmorphicCard className="p-6 h-full group cursor-pointer">
                  {/* Mock Dashboard UI */}
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${colors.gradient} mb-4`}>
                    <div className="flex items-center justify-between mb-3">
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    </div>
                    
                    {/* Mock Stats */}
                    <div className="grid grid-cols-2 gap-2">
                      {[...Array(4)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={isInView ? { opacity: 1, scale: 1 } : {}}
                          transition={{ delay: index * 0.1 + i * 0.1 }}
                          className="p-2 rounded-lg bg-white/10"
                        >
                          <div className="w-4 h-4 rounded bg-white/20 mb-1" />
                          <div className="w-12 h-2 bg-white/20 rounded-full" />
                        </motion.div>
                      ))}
                    </div>

                    {/* Mock Chart */}
                    <div className="mt-3 h-12 flex items-end gap-1">
                      {[40, 60, 30, 80, 50, 70, 90].map((h, i) => (
                        <motion.div
                          key={i}
                          initial={{ height: 0 }}
                          animate={isInView ? { height: `${h}%` } : {}}
                          transition={{ delay: index * 0.1 + i * 0.05 }}
                          className={`flex-1 ${colors.chart} rounded-t`}
                        />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-white font-semibold mb-1">{dashboard.title}</h3>
                  <p className="text-slate-400 text-sm">{dashboard.description}</p>
                </GlassmorphicCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

DashboardPreviewSection.displayName = 'DashboardPreviewSection';

// ============================================
// MAP & EMERGENCY NETWORK SECTION
// ============================================

const MapSection: React.FC = React.memo(() => {
  const mapRef = useRef(null);
  const isInView = useInView(mapRef, { once: true, margin: '-100px' });

  const mapMarkers = useMemo(() => [
    { lat: 23.8103, lng: 90.4125, title: 'Aetherion Main Hospital', type: 'hospital' as MarkerType },
    { lat: 23.8150, lng: 90.4200, title: 'Blood Donor Center', type: 'blood' as MarkerType },
    { lat: 23.8000, lng: 90.4050, title: 'Pharmacy', type: 'pharmacy' as MarkerType },
    { lat: 23.8200, lng: 90.4150, title: 'ICU Center', type: 'icu' as MarkerType },
    { lat: 23.8050, lng: 90.4250, title: 'Ambulance Station', type: 'ambulance' as MarkerType },
  ], []);

  return (
    <section className="relative py-20 bg-slate-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={mapRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="danger" className="mb-4">Live Emergency Network</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Real-Time Location Tracking
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Find hospitals, blood donors, pharmacies, and emergency services near you
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 rounded-2xl overflow-hidden border border-white/10 h-[500px]"
          >
            <Suspense fallback={
              <div className="w-full h-full flex items-center justify-center bg-slate-800">
                <Loader />
              </div>
            }>
              <GoogleMap
                center={{ lat: 23.8103, lng: 90.4125 }}
                zoom={12}
                markers={mapMarkers}
              />
            </Suspense>
          </motion.div>

          {/* Legend */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-4"
          >
            <GlassmorphicCard className="p-6 space-y-4">
              <h3 className="text-white font-semibold">Map Legend</h3>
              {[
                { color: 'bg-blue-500', label: 'Hospitals' },
                { color: 'bg-red-500', label: 'Blood Donors' },
                { color: 'bg-green-500', label: 'Pharmacies' },
                { color: 'bg-purple-500', label: 'ICU Locations' },
                { color: 'bg-amber-500', label: 'Ambulances' },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${item.color}`} />
                  <span className="text-slate-300 text-sm">{item.label}</span>
                </div>
              ))}
            </GlassmorphicCard>

            <GlassmorphicCard className="p-6">
              <h3 className="text-white font-semibold mb-3">Emergency Stats</h3>
              <div className="space-y-3">
                {[
                  { label: 'Active Emergencies', value: '12', color: 'text-red-400' },
                  { label: 'Available Ambulances', value: '8', color: 'text-amber-400' },
                  { label: 'Response Time', value: '3.2 min', color: 'text-green-400' },
                  { label: 'Nearby Hospitals', value: '15', color: 'text-blue-400' },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between">
                    <span className="text-slate-400 text-sm">{stat.label}</span>
                    <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
});

MapSection.displayName = 'MapSection';

// ============================================
// TECH STACK SECTION
// ============================================

const TechStackSection: React.FC = React.memo(() => {
  const techRef = useRef(null);
  const isInView = useInView(techRef, { once: true, margin: '-100px' });

  const technologies: Record<string, TechItem[]> = useMemo(() => ({
    frontend: [
      { name: 'React', icon: '⚛️', color: 'text-cyan-400' },
      { name: 'TypeScript', icon: '🔷', color: 'text-blue-400' },
      { name: 'Tailwind CSS', icon: '🎨', color: 'text-teal-400' },
      { name: 'Redux Toolkit', icon: '🔄', color: 'text-purple-400' },
      { name: 'Framer Motion', icon: '✨', color: 'text-pink-400' },
    ],
    backend: [
      { name: 'Python', icon: '🐍', color: 'text-yellow-400' },
      { name: 'Socket.io', icon: '🔌', color: 'text-white' },
      { name: 'Firebase', icon: '🔥', color: 'text-orange-400' },
      { name: 'JWT Auth', icon: '🔐', color: 'text-green-400' },
    ],
    database: [
      { name: 'MySQL', icon: '🗄️', color: 'text-blue-300' },
    ],
    infrastructure: [
      { name: 'Google Maps', icon: '🗺️', color: 'text-red-400' },
      { name: 'Vite', icon: '⚡', color: 'text-purple-300' },
      { name: 'Docker', icon: '🐳', color: 'text-blue-400' },
    ],
  }), []);

  return (
    <section className="relative py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={techRef}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge variant="info" className="mb-4">Technology Stack</Badge>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Built with Modern Technology
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Cutting-edge technologies ensuring reliability, security, and performance
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(technologies).map(([category, items]) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <GlassmorphicCard className="p-6 h-full">
                <h3 className="text-white font-semibold capitalize mb-4">{category}</h3>
                <div className="space-y-3">
                  {items.map((tech) => (
                    <div key={tech.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all">
                      <span className="text-xl">{tech.icon}</span>
                      <span className={`text-sm font-medium ${tech.color}`}>{tech.name}</span>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
});

TechStackSection.displayName = 'TechStackSection';

// ============================================
// CTA SECTION
// ============================================

const CTASection: React.FC = React.memo(() => {
  const navigate = useNavigate();

  return (
    <section className="relative py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <GlassmorphicCard className="p-12 bg-gradient-to-br from-blue-500/10 to-teal-500/10 border-blue-500/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <Badge variant="success" className="mb-4">Get Started Today</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
              Ready to Transform Your
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
                Healthcare Experience?
              </span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Join thousands of patients, doctors, and healthcare providers 
              already using Aetherion
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 pt-4">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="bg-gradient-to-r from-blue-500 to-teal-500"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" size="lg">
                  Schedule Demo
                  <Calendar className="w-5 h-5 ml-2" />
                </Button>
              </motion.div>
            </div>

            <div className="flex justify-center gap-8 pt-6">
              {[
                { icon: Shield, text: 'HIPAA Compliant' },
                { icon: Lock, text: '256-bit SSL' },
                { icon: CheckCircle2, text: '99.99% Uptime' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-2 text-slate-400 text-sm">
                  <item.icon className="w-4 h-4 text-green-400" />
                  {item.text}
                </div>
              ))}
            </div>
          </motion.div>
        </GlassmorphicCard>
      </div>
    </section>
  );
});

CTASection.displayName = 'CTASection';

// ============================================
// MAIN HOME COMPONENT
// ============================================

const Home: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-[#0F172A]">
      {/* Navbar - Transparent for Hero */}
      <Navbar transparent />

      {/* Sections */}
      <HeroSection />
      <LiveStatsSection />
      <FeaturesSection />
      <AIPreviewSection />
      <DashboardPreviewSection />
      <MapSection />
      
      {/* Testimonials (Lazy Loaded) */}
      <section className="relative py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="warning" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Trusted by Healthcare Professionals
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              See what our users say about Aetherion
            </p>
          </motion.div>
          <Suspense fallback={
            <div className="flex justify-center py-12">
              <Loader />
            </div>
          }>
            <TestimonialsSection />
          </Suspense>
        </div>
      </section>

      <TechStackSection />
      <CTASection />

      {/* Footer */}
      <Footer />

      {/* Back to Top (Lazy Loaded) */}
      <Suspense fallback={null}>
        <BackToTop />
      </Suspense>
    </div>
  );
};

export default Home;