import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  Heart, Shield, Globe, Award, Users, TrendingUp, Clock, Star, 
  Quote, Zap, Target, Sparkles, ArrowRight, Play, Pause,
  ChevronRight, Building2, Stethoscope, Microscope, Activity,
  Brain, Cpu, LineChart, MessageSquare, ThumbsUp, Verified, Twitter, Linkedin
} from 'lucide-react';

// Types
interface StatItem {
  value: string;
  label: string;
  icon: React.ElementType;
  suffix?: string;
}

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
  expertise: string[];
  social: {
    twitter?: string;
    linkedin?: string;
  };
}

// Data
const stats: StatItem[] = [
  { value: '1M+', label: 'Lives Impacted', icon: Heart, suffix: '+' },
  { value: '99.9', label: 'Uptime', icon: Activity, suffix: '%' },
  { value: '45', label: 'Countries Reached', icon: Globe },
  { value: '24/7', label: 'AI-Powered Support', icon: Cpu },
];

const teamMembers: TeamMember[] = [
  {
    name: 'Dr. Sarah Johnson',
    role: 'CEO & Founder',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    bio: 'Harvard MD, 20+ years transforming healthcare through technology',
    expertise: ['Healthcare Innovation', 'AI Strategy', 'Public Health'],
    social: { twitter: '#', linkedin: '#' }
  },
  {
    name: 'Dr. Michael Chen',
    role: 'Chief Medical Officer',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    bio: 'Cardiologist & pioneer in AI-assisted diagnostics',
    expertise: ['Cardiology', 'Medical AI', 'Clinical Research'],
    social: { twitter: '#', linkedin: '#' }
  },
  {
    name: 'Emily Davis',
    role: 'Chief AI Officer',
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    bio: 'MIT PhD, leading development of medical AI systems',
    expertise: ['Deep Learning', 'NLP', 'Computer Vision'],
    social: { linkedin: '#' }
  },
  {
    name: 'Robert Wilson',
    role: 'Chief Technology Officer',
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    bio: 'Ex-Google engineer, architect of scalable health platforms',
    expertise: ['Cloud Architecture', 'Security', 'Scale'],
    social: { twitter: '#', linkedin: '#' }
  },
];

const milestones = [
  { year: '2018', title: 'Founded', description: 'Started with a vision to revolutionize healthcare' },
  { year: '2019', title: 'First AI Model', description: 'Launched our proprietary AI diagnostic system' },
  { year: '2020', title: 'Global Expansion', description: 'Expanded operations to 15 countries' },
  { year: '2021', title: '1M Patients', description: 'Reached milestone of 1 million patients served' },
  { year: '2022', title: 'FDA Approval', description: 'Received FDA clearance for AI diagnostics' },
  { year: '2023', title: 'Series C', description: 'Raised $200M to accelerate innovation' },
  { year: '2024', title: '45 Countries', description: 'Now serving patients across 45 countries' },
];

// Components
const AnimatedCounter: React.FC<{ value: string; suffix?: string }> = ({ value, suffix = '' }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (isInView) {
      const numericValue = parseFloat(value.replace(/[^0-9.]/g, ''));
      const duration = 2000;
      const steps = 60;
      const increment = numericValue / steps;
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= numericValue) {
          setDisplayValue(value);
          clearInterval(timer);
        } else {
          const formatted = current.toFixed(value.includes('.') ? 1 : 0);
          setDisplayValue(value.replace(/[0-9.]+/, formatted) + suffix);
        }
      }, duration / steps);
      
      return () => clearInterval(timer);
    }
  }, [isInView, value, suffix]);

  return <span ref={ref}>{displayValue}</span>;
};

const FloatingOrbs: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-64 h-64 rounded-full opacity-20"
          style={{
            background: `radial-gradient(circle, ${
              ['#06b6d4', '#8b5cf6', '#ec4899', '#3b82f6', '#10b981'][i]
            } 0%, transparent 70%)`,
            left: `${20 * i}%`,
            top: `${Math.random() * 60}%`,
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.5,
          }}
        />
      ))}
    </div>
  );
};

const GlitchText: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => {
  return (
    <motion.div
      className={`relative ${className}`}
      whileHover={{ scale: 1.02 }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-50 blur-xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
        }}
      />
      {children}
    </motion.div>
  );
};

const TeamMemberCard: React.FC<{ member: TeamMember; index: number }> = ({ member, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      <div className="relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 backdrop-blur-sm transition-all duration-500 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/20">
        {/* Glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20" />
        </div>

        {/* Image container */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          {/* Hover overlay */}
          <motion.div
            initial={false}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 flex items-center justify-center gap-3"
          >
            {member.social.twitter && (
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition"
              >
                <Twitter className="w-5 h-5 text-white" />
              </motion.button>
            )}
            {member.social.linkedin && (
              <motion.button
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition"
              >
                <Linkedin className="w-5 h-5 text-white" />
              </motion.button>
            )}
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative p-6">
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-cyan-400 transition-colors">
            {member.name}
          </h3>
          <p className="text-cyan-400 text-sm font-medium mb-3">{member.role}</p>
          <p className="text-white/60 text-sm mb-4">{member.bio}</p>
          
          {/* Expertise tags */}
          <div className="flex flex-wrap gap-2">
            {member.expertise.map((exp, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full border border-cyan-500/20"
              >
                {exp}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const TimelineNode: React.FC<{ milestone: typeof milestones[0]; index: number; total: number }> = ({
  milestone,
  index,
  total
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`flex items-center gap-8 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}
    >
      {/* Content */}
      <div className={`flex-1 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="inline-block bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-cyan-500/30 transition-colors"
        >
          <span className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            {milestone.year}
          </span>
          <h3 className="text-xl font-bold text-white mt-2 mb-1">{milestone.title}</h3>
          <p className="text-white/60">{milestone.description}</p>
        </motion.div>
      </div>

      {/* Timeline dot */}
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{
            boxShadow: [
              '0 0 20px rgba(6, 182, 212, 0.3)',
              '0 0 40px rgba(6, 182, 212, 0.6)',
              '0 0 20px rgba(6, 182, 212, 0.3)',
            ],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-4 h-4 bg-cyan-400 rounded-full"
        />
        {index < total - 1 && (
          <div className="absolute top-full w-px h-16 bg-gradient-to-b from-cyan-400 to-transparent" />
        )}
      </div>

      {/* Empty space for alignment */}
      <div className="flex-1" />
    </motion.div>
  );
};

// Main Component
export const About: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#0a0a1a] overflow-x-hidden">
      <FloatingOrbs />
      
      {/* Hero Section - Parallax */}
      <motion.section 
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Animated background grid */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.1) 1px, transparent 0)',
          backgroundSize: '50px 50px'
        }} />
        
        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2 + Math.random() * 3,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-8 hover:border-cyan-500/30 transition-colors cursor-default"
          >
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-white/80 text-sm font-medium">Redefining Healthcare Since 2018</span>
            <Verified className="w-4 h-4 text-green-400" />
          </motion.div>

          {/* Main title */}
          <GlitchText className="mb-6">
            <h1 className="text-6xl md:text-8xl font-black text-white leading-tight">
              Healthcare
              <br />
              <span className="relative">
                <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Reimagined
                </span>
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
            </h1>
          </GlitchText>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto mb-12"
          >
            We're not just building software. We're architecting the future of healthcare delivery,
            powered by artificial intelligence and driven by human compassion.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl font-semibold text-white relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Explore Our Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 border-2 border-white/20 rounded-2xl font-semibold text-white hover:bg-white/10 transition-colors flex items-center gap-2 justify-center"
            >
              <Play className="w-5 h-5" />
              Watch Our Story
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-1">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-2 h-2 bg-cyan-400 rounded-full"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Stats Section - Animated Counters */}
      <section className="relative py-32 px-4 -mt-20">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="relative group"
              >
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 text-center border border-white/10 hover:border-cyan-500/30 transition-all duration-300">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                  />
                  <stat.icon className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
                  <div className="text-4xl md:text-5xl font-black text-white mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-white/60 font-medium">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision - Split Screen */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-3xl p-10 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <Target className="w-16 h-16 text-cyan-400 mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Mission</h2>
              <p className="text-lg text-white/70 leading-relaxed">
                To democratize healthcare access through innovative technology, ensuring every person,
                regardless of location or economic status, receives world-class medical care and attention.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="relative overflow-hidden rounded-3xl p-10 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 group"
            >
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
              <Zap className="w-16 h-16 text-purple-400 mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Our Vision</h2>
              <p className="text-lg text-white/70 leading-relaxed">
                To create a world where healthcare is proactive, personalized, and accessible 24/7,
                powered by artificial intelligence that augments human expertise.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values - Interactive Cards */}
      <section className="py-32 px-4 bg-white/[0.02]">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Our DNA
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              The core principles that drive every decision we make
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Heart, title: 'Patient-First', desc: 'Every feature, every line of code, every decision starts with the patient in mind.', color: 'from-red-500/20 to-pink-500/20' },
              { icon: Brain, title: 'AI-First', desc: 'Leveraging cutting-edge artificial intelligence to provide smarter, faster healthcare solutions.', color: 'from-blue-500/20 to-cyan-500/20' },
              { icon: Shield, title: 'Security-First', desc: 'Enterprise-grade security protecting patient data with military-grade encryption.', color: 'from-green-500/20 to-emerald-500/20' },
              { icon: TrendingUp, title: 'Innovation-First', desc: 'Constantly pushing boundaries to deliver tomorrow\'s healthcare solutions today.', color: 'from-purple-500/20 to-pink-500/20' },
            ].map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.02, rotate: -1 }}
                className={`relative overflow-hidden rounded-3xl p-8 bg-gradient-to-br ${value.color} border border-white/10 group cursor-default`}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full"
                />
                <value.icon className="w-12 h-12 text-cyan-400 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-white/70 leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline - Company Journey */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Our Journey
            </h2>
            <p className="text-xl text-white/60">From startup to global healthcare platform</p>
          </motion.div>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-400 via-purple-400 to-pink-400 hidden md:block" />
            
            <div className="space-y-16">
              {milestones.map((milestone, i) => (
                <TimelineNode key={i} milestone={milestone} index={i} total={milestones.length} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section - Staggered Grid */}
      <section className="py-32 px-4 bg-white/[0.02]">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6">
              Meet the <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">Visionaries</span>
            </h2>
            <p className="text-xl text-white/60 max-w-2xl mx-auto">
              A team of healthcare professionals, technologists, and innovators united by a common mission
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, i) => (
              <TeamMemberCard key={i} member={member} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial - Carousel style */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
            <div className="relative bg-white/5 backdrop-blur-xl rounded-3xl p-12 border border-white/10">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                className="absolute -top-6 -left-6 w-20 h-20 bg-cyan-500/20 rounded-full blur-xl"
              />
              <motion.div
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-6 -right-6 w-20 h-20 bg-purple-500/20 rounded-full blur-xl"
              />
              
              <Quote className="w-16 h-16 text-cyan-400 mx-auto mb-8 opacity-50" />
              <p className="text-2xl md:text-3xl text-white text-center italic leading-relaxed mb-8">
                "Aetherion Health has fundamentally transformed how we deliver care. Their AI platform caught 
                conditions we would have missed, literally saving lives. This isn't just technology—it's the 
                future of medicine."
              </p>
              <div className="text-center">
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-white font-bold text-lg">Dr. James Wilson</p>
                <p className="text-white/50">Chief of Medicine, Massachusetts General Hospital</p>
                <p className="text-cyan-400 text-sm mt-1">Using Aetherion Health since 2020</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA - Animated Gradient */}
      <section className="py-32 px-4">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-3xl p-16 text-center"
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(45deg, #06b6d4, #8b5cf6, #ec4899, #06b6d4)',
                backgroundSize: '400% 400%',
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
              }}
              transition={{
                duration: 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
            
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
            
            <div className="relative z-10">
              <motion.h2
                initial={{ scale: 0.9 }}
                whileInView={{ scale: 1 }}
                className="text-4xl md:text-5xl font-black text-white mb-6"
              >
                Ready to Transform Healthcare?
              </motion.h2>
              <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                Join thousands of healthcare providers who are already using our platform to deliver 
                better patient outcomes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-white text-gray-900 rounded-2xl font-bold text-lg hover:shadow-2xl transition-shadow"
                >
                  Schedule a Demo
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 border-2 border-white rounded-2xl font-bold text-white text-lg hover:bg-white/10 transition-colors"
                >
                  Contact Sales
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default About;