// src/pages/Home.tsx
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Heart, Activity, Brain, Calendar, Video, User, Building2,
  ShieldCheck, Star, Sparkles, ArrowRight, Siren, Stethoscope,
  Zap, TrendingUp, Clock, AlertTriangle, Truck, Phone,
  Search, BarChart3, Pill, MessageCircle, Play, BadgeCheck,
  Fingerprint, Globe, Command, Mic, ArrowUpRight, ChevronRight,
  CheckCircle2, XCircle, Quote, ThumbsUp, Award, Crown, Gem,
  Rocket, Target, Eye, Layers, Wallet, Wand2,
  GraduationCap, Laptop, Smartphone, Headphones, Smile,
  Frown, Meh, Flame, Bolt, Cloud, Sun, Moon, Wind,
  Infinity, Sigma, Atom, Dna, Microscope, Syringe,
  Bone, Baby, Footprints, Accessibility, Monitor, Tablet,
  Bell, Settings, Users2, MapPin, Navigation2, Send,
  Share2, Download, Upload, RefreshCw, Trash2, Edit,
  Plus, Minus, Filter, SlidersHorizontal
} from 'lucide-react';
import HeroSection from 'src/components/Section/HeroSection';

// ============================================
// ANIMATED COUNTER HOOK
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

// ============================================
// SCROLL PROGRESS BAR
// ============================================
const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 z-[999] origin-left"
      style={{ scaleX }}
    />
  );
};

// ============================================
// 2️⃣ TRUST BAR — SCROLLING LOGOS
// ============================================
const TrustSection: React.FC = () => {
  const partners = Array.from({ length: 20 }, (_, i) => ({
    name: [
      'City General', 'Metro Medical', 'Memorial Hospital', 'Sunshine Clinic',
      'Health Plus', 'Care First', 'MediCare Center', 'Wellness Hub',
      'Prime Health', 'Elite Care', 'Nova Medical', 'Apex Hospital',
      'Unity Health', 'Pinnacle Care', 'Horizon Medical', 'Summit Clinic',
      'Vanguard Health', 'Beacon Hospital', 'Crest Medical', 'Zenith Care'
    ][i],
    logo: ['🏥', '🏨', '🩺', '💊', '🏪', '🔬', '💉', '🩻', '🧬', '🫀', '🧠', '🦴', '👁️', '🦷', '👂', '🫁', '💪', '🦶', '🤰', '👶'][i]
  }));

  return (
    <section className="py-20 bg-[#06060a] border-y border-white/[0.04] overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-[#06060a] via-transparent to-[#06060a] z-10 pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 text-center mb-12">
        <motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-white/20 text-sm font-medium tracking-widest uppercase mb-2">Trusted by</p>
          <div className="flex items-center justify-center gap-3">
            <span className="text-4xl font-bold text-white">10,000+</span>
            <span className="text-white/30 text-lg">patients across</span>
            <span className="text-4xl font-bold text-white">250+</span>
            <span className="text-white/30 text-lg">hospitals</span>
          </div>
        </motion.div>
      </div>
      <div className="flex gap-16 animate-scroll relative z-0">
        {[...partners, ...partners].map((p, i) => (
          <div key={i} className="flex items-center gap-3 text-white/15 text-lg font-semibold whitespace-nowrap shrink-0 group cursor-default">
            <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{p.logo}</span>
            <span className="group-hover:text-white/30 transition-colors">{p.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

// ============================================
// 3️⃣ PROBLEM/SOLUTION — EXPANDED
// ============================================
const ProblemSolutionSection: React.FC = () => {
  const problems = [
    { icon: Clock, title: 'Endless Waiting', text: 'Average wait time of 45+ minutes at traditional hospitals', stat: '45min', color: 'from-red-500/20 to-red-600/20' },
    { icon: Search, title: 'Finding Specialists', text: 'Difficulty finding the right doctor for specific conditions', stat: '60%', color: 'from-orange-500/20 to-orange-600/20' },
    { icon: Phone, title: 'Complex Booking', text: 'Multiple phone calls and paperwork just to get an appointment', stat: '5+ calls', color: 'from-amber-500/20 to-amber-600/20' },
    { icon: AlertTriangle, title: 'Slow Emergency', text: 'Delayed emergency response putting lives at risk', stat: '12min', color: 'from-rose-500/20 to-rose-600/20' },
  ];
  const solutions = [
    { icon: Zap, title: 'AI Triage', text: 'Instant AI-powered symptom analysis and priority routing', stat: '2sec', color: 'from-emerald-500/20 to-green-600/20' },
    { icon: User, title: 'Verified Network', text: '500+ board-certified specialists across 50+ fields', stat: '500+', color: 'from-blue-500/20 to-cyan-600/20' },
    { icon: Calendar, title: 'One-Tap Booking', text: 'Book, reschedule, or cancel appointments in seconds', stat: '30sec', color: 'from-purple-500/20 to-violet-600/20' },
    { icon: Truck, title: 'Rapid Response', text: '8-minute average ambulance dispatch with live tracking', stat: '8min', color: 'from-sky-500/20 to-indigo-600/20' },
  ];

  return (
    <section className="py-32 bg-[#050508] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.01%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
      
      <div className="max-w-6xl mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 text-xs font-medium mb-6">
            <Target className="w-3.5 h-3.5" />
            Why We Exist
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-[-0.03em]">
            Healthcare <span className="text-red-400/60">shouldn't</span> be this hard
          </h2>
          <p className="text-white/35 text-xl max-w-2xl mx-auto leading-relaxed">
            We're fixing the broken healthcare experience with technology that actually works.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Problems */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">The Problem</h3>
                <p className="text-white/30 text-sm">What patients struggle with daily</p>
              </div>
            </div>
            <div className="space-y-4">
              {problems.map((p, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  whileHover={{ x: 5 }} className={`relative p-5 rounded-2xl bg-gradient-to-br ${p.color} border border-red-500/[0.08] overflow-hidden group cursor-default`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0">
                      <p.icon className="w-6 h-6 text-red-400/60" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-semibold">{p.title}</h4>
                        <span className="text-red-400 text-xl font-bold">{p.stat}</span>
                      </div>
                      <p className="text-white/40 text-sm">{p.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Solutions */}
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-lg">Our Solution</h3>
                <p className="text-white/30 text-sm">How we make healthcare effortless</p>
              </div>
            </div>
            <div className="space-y-4">
              {solutions.map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                  whileHover={{ x: -5 }} className={`relative p-5 rounded-2xl bg-gradient-to-br ${s.color} border border-emerald-500/[0.08] overflow-hidden group cursor-default`}>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                      <s.icon className="w-6 h-6 text-emerald-400/60" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-semibold">{s.title}</h4>
                        <span className="text-emerald-400 text-xl font-bold">{s.stat}</span>
                      </div>
                      <p className="text-white/40 text-sm">{s.text}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// ============================================
// 4️⃣ FEATURES — EXPANDED 12 CARDS
// ============================================
const FeaturesSection: React.FC = () => {
  const features = [
    { icon: Brain, title: 'AI-Powered Diagnosis', desc: 'Advanced machine learning algorithms analyze symptoms, medical history, and vitals for accurate preliminary diagnoses in seconds.', color: 'from-indigo-500/20 to-violet-500/20', iconColor: 'text-indigo-400', badge: 'New' },
    { icon: ShieldCheck, title: 'HIPAA Compliant Security', desc: 'Enterprise-grade 256-bit encryption with zero-trust architecture ensuring your medical data stays private and protected.', color: 'from-emerald-500/20 to-teal-500/20', iconColor: 'text-emerald-400', badge: 'Secure' },
    { icon: Video, title: 'HD Virtual Consultations', desc: 'Crystal-clear video calls with board-certified specialists from the comfort of your home, available 24/7 worldwide.', color: 'from-sky-500/20 to-blue-500/20', iconColor: 'text-sky-400', badge: 'Popular' },
    { icon: Clock, title: '24/7 Emergency Response', desc: 'Round-the-clock emergency services with real-time ambulance GPS tracking and instant hospital ER notifications.', color: 'from-rose-500/20 to-pink-500/20', iconColor: 'text-rose-400' },
    { icon: Pill, title: 'Smart Pharmacy Network', desc: 'Order prescriptions online with automatic refill reminders, drug interaction checks, and real-time pharmacy availability.', color: 'from-amber-500/20 to-orange-500/20', iconColor: 'text-amber-400' },
    { icon: BarChart3, title: 'Advanced Health Analytics', desc: 'Comprehensive dashboards with predictive analytics, health trends, and personalized insights for proactive wellness.', color: 'from-purple-500/20 to-fuchsia-500/20', iconColor: 'text-purple-400' },
    { icon: MessageCircle, title: 'AI Health Assistant', desc: '24/7 intelligent chatbot that answers health questions, provides medication reminders, and guides through symptoms.', color: 'from-cyan-500/20 to-teal-500/20', iconColor: 'text-cyan-400', badge: 'AI' },
    { icon: Users2, title: 'Family Health Management', desc: 'Manage your entire family\'s health records, appointments, and medications from a single unified dashboard.', color: 'from-pink-500/20 to-rose-500/20', iconColor: 'text-pink-400' },
    { icon: GraduationCap, title: 'Medical Education Hub', desc: 'Access curated health articles, video tutorials, and wellness programs created by certified medical professionals.', color: 'from-blue-500/20 to-indigo-500/20', iconColor: 'text-blue-400' },
    { icon: Wallet, title: 'Insurance Integration', desc: 'Seamless integration with 200+ insurance providers for instant claim processing and coverage verification.', color: 'from-green-500/20 to-emerald-500/20', iconColor: 'text-green-400' },
    { icon: Microscope, title: 'Lab Results Portal', desc: 'Access your lab results in real-time with AI-powered interpretation and trend analysis.', color: 'from-red-500/20 to-orange-500/20', iconColor: 'text-red-400' },
    { icon: Smartphone, title: 'Cross-Platform Access', desc: 'Access your health dashboard from any device — web, iOS, Android — with seamless cloud synchronization.', color: 'from-violet-500/20 to-purple-500/20', iconColor: 'text-violet-400' },
  ];

  const { ref, count } = useAnimatedCounter(12);

  return (
    <section className="py-32 bg-[#08080d] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.02] blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-violet-500/[0.02] blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span ref={ref}>{count}</span> Powerful Features
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-[-0.03em]">
            Everything you need,{' '}
            <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
              all in one place
            </span>
          </h2>
          <p className="text-white/35 text-xl max-w-2xl mx-auto">
            From AI diagnostics to emergency response — our platform covers every aspect of modern healthcare.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true, margin: "-30px" }}
                whileHover={{ y: -6, scale: 1.02 }} className="relative group p-6 rounded-2xl bg-white/[0.015] border border-white/[0.06] hover:border-white/[0.15] transition-all duration-300 overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-br ${f.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} border border-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className={`w-6 h-6 ${f.iconColor}`} />
                    </div>
                    {f.badge && (
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        f.badge === 'New' ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' :
                        f.badge === 'Popular' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        f.badge === 'AI' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}>{f.badge}</span>
                    )}
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-3 group-hover:text-white/90 transition-colors">{f.title}</h3>
                  <p className="text-white/35 text-sm leading-relaxed group-hover:text-white/50 transition-colors">{f.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================
// 5️⃣ STATS — ANIMATED COUNTERS
// ============================================
const StatsSection: React.FC = () => {
  const stats = [
    { value: 50, suffix: 'K+', label: 'Lives Impacted', icon: Heart, color: 'from-pink-500 to-rose-500' },
    { value: 500, suffix: '+', label: 'Expert Physicians', icon: Stethoscope, color: 'from-blue-500 to-cyan-500' },
    { value: 250, suffix: '+', label: 'Partner Hospitals', icon: Building2, color: 'from-emerald-500 to-teal-500' },
    { value: 99.9, suffix: '%', label: 'Uptime SLA', icon: ShieldCheck, color: 'from-purple-500 to-violet-500' },
    { value: 24, suffix: '/7', label: 'Emergency Care', icon: Clock, color: 'from-amber-500 to-orange-500' },
    { value: 45, suffix: '+', label: 'Countries Served', icon: Globe, color: 'from-cyan-500 to-sky-500' },
    { value: 98, suffix: '%', label: 'Patient Satisfaction', icon: Smile, color: 'from-green-500 to-emerald-500' },
    { value: 12, suffix: 'min', label: 'Avg Response Time', icon: Zap, color: 'from-red-500 to-rose-500' },
  ];

  return (
    <section className="py-28 bg-[#050508] border-y border-white/[0.04] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.02] via-transparent to-violet-500/[0.02]" />
      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">By the Numbers</h2>
          <p className="text-white/35 text-lg">The impact we've made so far</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            const { count, ref } = useAnimatedCounter(s.value, 2500);
            return (
              <motion.div key={i} ref={ref} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05 }} className="text-center group cursor-default">
                <div className={`w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl sm:text-5xl font-black text-white mb-2 tracking-tight">
                  {count}{s.suffix}
                </div>
                <div className="text-white/35 text-sm font-medium">{s.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================
// 6️⃣ HOW IT WORKS
// ============================================
const HowItWorksSection: React.FC = () => {
  const steps = [
    { step: '01', icon: Search, title: 'Describe Your Symptoms', desc: 'Use our AI-powered search to describe what you\'re experiencing in plain English.' },
    { step: '02', icon: Brain, title: 'AI Analyzes & Suggests', desc: 'Our AI engine analyzes your symptoms and suggests the right specialist for your needs.' },
    { step: '03', icon: Calendar, title: 'Book Instantly', desc: 'Choose your preferred time slot and confirm your appointment in under 30 seconds.' },
    { step: '04', icon: Video, title: 'Get Treated', desc: 'Meet your doctor in-person or via HD video call. Prescriptions delivered to your door.' },
  ];

  return (
    <section className="py-32 bg-[#08080d]">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 text-xs font-medium mb-6">
            <Rocket className="w-3.5 h-3.5" />
            How It Works
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Get care in 4 simple steps</h2>
          <p className="text-white/35 text-xl">From symptoms to treatment — faster than ever before.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }} viewport={{ once: true }}
                className="relative text-center group">
                {i < 3 && <div className="hidden md:block absolute top-12 left-[60%] w-full h-px bg-gradient-to-r from-white/[0.08] to-transparent z-0" />}
                <div className="relative z-10">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-10 h-10 text-indigo-400" />
                  </div>
                  <span className="text-indigo-400/40 text-sm font-bold tracking-widest">{step.step}</span>
                  <h3 className="text-white font-semibold text-lg mt-2 mb-3">{step.title}</h3>
                  <p className="text-white/35 text-sm leading-relaxed">{step.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================
// 7️⃣ SERVICES SHOWCASE
// ============================================
const ServicesShowcase: React.FC = () => {
  const navigate = useNavigate();
  const services = [
    { icon: Stethoscope, title: 'Find Doctors', desc: '500+ verified specialists', link: '/doctors', color: 'from-indigo-500 to-violet-500', stats: '50+ Specialties' },
    { icon: Building2, title: 'Hospitals', desc: 'Real-time bed tracking', link: '/hospitals', color: 'from-emerald-500 to-teal-500', stats: '250+ Partners' },
    { icon: Calendar, title: 'Appointments', desc: 'Book in 30 seconds', link: '/appointments', color: 'from-sky-500 to-blue-500', stats: '50K+ Booked' },
    { icon: Siren, title: 'Emergency', desc: '8-min avg response', link: '/emergency', color: 'from-rose-500 to-red-500', stats: '24/7 Active' },
    { icon: Pill, title: 'Pharmacy', desc: 'Doorstep delivery', link: '/pharmacy', color: 'from-amber-500 to-orange-500', stats: '10K+ Products' },
    { icon: Baby, title: 'Women & Child', desc: 'Dedicated care', link: '/women-health', color: 'from-pink-500 to-rose-500', stats: 'Specialized' },
  ];

  return (
    <section className="py-32 bg-[#050508]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 text-xs font-medium mb-6">
            <Layers className="w-3.5 h-3.5" />
            Our Services
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Complete healthcare ecosystem</h2>
          <p className="text-white/35 text-xl max-w-xl mx-auto">Every service designed with one goal — making healthcare effortless.</p>
        </motion.div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
                whileHover={{ y: -8 }} onClick={() => navigate(s.link)}
                className="group cursor-pointer relative p-8 rounded-2xl bg-white/[0.015] border border-white/[0.06] hover:border-white/[0.15] transition-all duration-300 overflow-hidden">
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-full bg-gradient-to-br ${s.color} opacity-5 group-hover:opacity-10 transition-opacity duration-500 -translate-y-1/2 translate-x-1/2`} />
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-white font-semibold text-xl mb-2">{s.title}</h3>
                  <p className="text-white/35 text-sm mb-6">{s.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/20 text-xs font-medium">{s.stats}</span>
                    <ArrowRight className="w-5 h-5 text-white/15 group-hover:text-white/50 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

// ============================================
// 8️⃣ DOCTORS PREVIEW
// ============================================
const DoctorsPreviewSection: React.FC = () => {
  const navigate = useNavigate();
  const doctors = [
    { name: 'Dr. Sarah Johnson', specialty: 'Cardiologist', rating: 4.9, reviews: 234, experience: 15, image: 'https://randomuser.me/api/portraits/women/1.jpg', available: true },
    { name: 'Dr. Michael Chen', specialty: 'Neurologist', rating: 4.8, reviews: 189, experience: 12, image: 'https://randomuser.me/api/portraits/men/2.jpg', available: true },
    { name: 'Dr. Emily Davis', specialty: 'Pediatrician', rating: 4.9, reviews: 312, experience: 10, image: 'https://randomuser.me/api/portraits/women/3.jpg', available: false },
    { name: 'Dr. Robert Wilson', specialty: 'Orthopedic', rating: 4.7, reviews: 178, experience: 18, image: 'https://randomuser.me/api/portraits/men/4.jpg', available: true },
    { name: 'Dr. Lisa Anderson', specialty: 'Dermatologist', rating: 4.9, reviews: 156, experience: 8, image: 'https://randomuser.me/api/portraits/women/5.jpg', available: true },
    { name: 'Dr. James Kim', specialty: 'Oncologist', rating: 4.8, reviews: 289, experience: 20, image: 'https://randomuser.me/api/portraits/men/6.jpg', available: false },
  ];

  return (
    <section className="py-32 bg-[#08080d]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 text-xs font-medium mb-6">
            <Award className="w-3.5 h-3.5" />
            Top Specialists
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Meet our expert doctors</h2>
          <p className="text-white/35 text-xl">Board-certified specialists ready to help you.</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {doctors.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
              whileHover={{ y: -8 }} className="p-5 rounded-2xl bg-white/[0.015] border border-white/[0.06] text-center cursor-pointer hover:border-white/[0.15] transition-all duration-300 group"
              onClick={() => navigate('/doctors')}>
              <div className="relative inline-block mb-4">
                <img src={d.image} alt={d.name} className="w-20 h-20 rounded-full mx-auto object-cover border-2 border-white/[0.08] group-hover:border-white/[0.2] transition-all" />
                <span className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-[#08080d] ${d.available ? 'bg-emerald-400' : 'bg-slate-500'}`} />
              </div>
              <h4 className="text-white font-semibold text-sm">{d.name}</h4>
              <p className="text-white/35 text-xs mt-1">{d.specialty}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                <span className="text-white/50 text-xs font-medium">{d.rating}</span>
                <span className="text-white/15 text-xs">•</span>
                <span className="text-white/30 text-xs">{d.experience}y exp</span>
              </div>
              <p className="text-cyan-400 text-[10px] mt-2 font-medium">{d.available ? 'Available Today' : 'Next: Tomorrow'}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/doctors')}
            className="px-8 py-3 bg-white/[0.04] border border-white/[0.08] rounded-xl text-white/60 text-sm font-medium hover:bg-white/[0.08] hover:text-white transition-all">
            View All 500+ Doctors <ArrowRight className="inline w-4 h-4 ml-1.5" />
          </motion.button>
        </div>
      </div>
    </section>
  );
};

// ============================================
// 9️⃣ EMERGENCY HIGHLIGHT
// ============================================
const EmergencyHighlight: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="py-28 bg-gradient-to-r from-red-950/40 via-[#050508] to-red-950/20 border-y border-red-500/[0.05] relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ef4444%22%20fill-opacity%3D%220.02%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50" />
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-red-500/10 border border-red-500/20 mb-8">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
            </span>
            <span className="text-red-400 text-sm font-bold tracking-wider uppercase">24/7 Emergency Active</span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">Need urgent medical help?</h2>
          <p className="text-white/40 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            One tap connects you to the nearest emergency services with real-time ambulance GPS tracking, 
            instant hospital ER notification, and live ETA updates.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/emergency')}
              className="px-10 py-5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-2xl text-lg shadow-2xl shadow-red-500/30 transition-all flex items-center justify-center gap-3">
              <Siren className="w-6 h-6" />
              Activate Emergency Mode
            </motion.button>
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => window.open('tel:911')}
              className="px-10 py-5 bg-white/[0.05] border-2 border-white/20 rounded-2xl text-white font-bold text-lg hover:bg-white/[0.1] transition-all flex items-center justify-center gap-3">
              <Phone className="w-6 h-6" />
              Call 911 Now
            </motion.button>
          </div>
          <div className="flex items-center justify-center gap-8 mt-8 text-white/25 text-sm">
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400/50"/> Avg 8 min response</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400/50"/> 250+ partner ERs</span>
            <span className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400/50"/> Live GPS tracking</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// 🔟 TESTIMONIALS
// ============================================
const TestimonialsSection: React.FC = () => {
  const testimonials = [
    { quote: "This platform saved my father's life. The ambulance arrived in 8 minutes with real-time tracking that kept our family calm during the crisis.", author: "Sarah Chen", role: "Patient's Daughter", location: "New York", rating: 5, image: "https://randomuser.me/api/portraits/women/44.jpg" },
    { quote: "As a cardiologist, the AI assistant helps me make faster, more accurate decisions. The telemedicine integration is seamless and reliable.", author: "Dr. Maya Patel", role: "Cardiologist", location: "Chicago", rating: 5, image: "https://randomuser.me/api/portraits/women/68.jpg" },
    { quote: "Booking appointments has never been easier. The UI is beautiful, intuitive, and the entire process takes less than 30 seconds.", author: "James Wilson", role: "Patient", location: "Los Angeles", rating: 5, image: "https://randomuser.me/api/portraits/men/45.jpg" },
    { quote: "The pharmacy integration is game-changing. I order my prescriptions and they arrive at my doorstep the next day. Incredible service.", author: "Maria Garcia", role: "Patient", location: "Miami", rating: 5, image: "https://randomuser.me/api/portraits/women/22.jpg" },
    { quote: "Managing my entire family's health from one dashboard is incredible. Appointments, records, prescriptions — all in one place.", author: "David Thompson", role: "Father of 3", location: "Houston", rating: 5, image: "https://randomuser.me/api/portraits/men/55.jpg" },
    { quote: "The AI symptom checker correctly identified my condition and connected me with the right specialist within minutes. Truly life-changing.", author: "Emily Rodriguez", role: "Patient", location: "Phoenix", rating: 5, image: "https://randomuser.me/api/portraits/women/33.jpg" },
  ];

  return (
    <section className="py-32 bg-[#06060a]">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 text-xs font-medium mb-6">
            <MessageCircle className="w-3.5 h-3.5" />
            Testimonials
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Loved by thousands</h2>
          <p className="text-white/35 text-xl">Hear from patients and doctors who use Aetherion every day.</p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} viewport={{ once: true }}
              whileHover={{ y: -6 }} className="p-8 rounded-2xl bg-white/[0.015] border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300">
              <div className="flex gap-0.5 mb-5">
                {[...Array(t.rating)].map((_, j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
              </div>
              <Quote className="w-8 h-8 text-white/[0.06] mb-4" />
              <p className="text-white/50 text-sm leading-relaxed italic mb-6">"{t.quote}"</p>
              <div className="flex items-center gap-3 pt-4 border-t border-white/[0.04]">
                <img src={t.image} alt={t.author} className="w-10 h-10 rounded-full object-cover border border-white/[0.08]" />
                <div>
                  <p className="text-white text-sm font-medium">{t.author}</p>
                  <p className="text-white/25 text-xs">{t.role} • {t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// ============================================
// 1️⃣1️⃣ CTA SECTION
// ============================================
const CTASection: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="py-32 bg-[#08080d] relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-r from-indigo-500/[0.04] via-violet-500/[0.04] to-pink-500/[0.04] blur-3xl pointer-events-none" />
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative p-12 md:p-20 rounded-3xl bg-white/[0.015] border border-white/[0.06] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.03] to-violet-500/[0.03]" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 text-xs font-medium mb-8">
              <Rocket className="w-3.5 h-3.5" />
              Get Started Today
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 tracking-[-0.03em]">
              Ready for{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-pink-400 bg-clip-text text-transparent">
                better healthcare
              </span>
              ?
            </h2>
            <p className="text-white/35 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Join 50,000+ patients already using Aetherion Health. 
              Sign up in seconds — no credit card required. Free forever plan available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/register')}
                className="px-10 py-4 bg-white text-black font-semibold rounded-2xl text-base hover:bg-white/90 transition-all shadow-xl shadow-white/5 flex items-center justify-center gap-2">
                Get Started Free <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate('/about')}
                className="px-10 py-4 bg-white/[0.03] text-white/70 font-semibold rounded-2xl text-base border border-white/[0.1] hover:bg-white/[0.06] hover:text-white transition-all flex items-center justify-center gap-2">
                <Play className="w-5 h-5" /> Watch Demo
              </motion.button>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-6 mt-10">
              <span className="flex items-center gap-2 text-white/15 text-xs"><CheckCircle2 className="w-4 h-4 text-emerald-400/40"/> HIPAA Compliant</span>
              <span className="flex items-center gap-2 text-white/15 text-xs"><CheckCircle2 className="w-4 h-4 text-emerald-400/40"/> No Credit Card Required</span>
              <span className="flex items-center gap-2 text-white/15 text-xs"><CheckCircle2 className="w-4 h-4 text-emerald-400/40"/> Free Forever Plan</span>
              <span className="flex items-center gap-2 text-white/15 text-xs"><CheckCircle2 className="w-4 h-4 text-emerald-400/40"/> Cancel Anytime</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// ============================================
// 🏠 HOME PAGE — MASTER ASSEMBLY
// ============================================
export const Home: React.FC = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-[#050508]">
      <ScrollProgress />
      <HeroSection />
      <TrustSection />
      <ProblemSolutionSection />
      <FeaturesSection />
      <HowItWorksSection />
      <StatsSection />
      <ServicesShowcase />
      <DoctorsPreviewSection />
      <EmergencyHighlight />
      <TestimonialsSection />
      <CTASection />
    </div>
  );
};

export default Home;

