// src/components/layout/Footer.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useInView, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Heart, Sparkles, Mail, Phone, MapPin, ArrowRight, Shield,
  Twitter, Linkedin, Github, Youtube, Instagram, Send,
  CheckCircle, ChevronRight, Zap, Globe, Award, Star,
  MessageCircle, Clock, Users, TrendingUp, BadgeCheck,
  Fingerprint, Lock, Cloud, Server, Command, ChevronUp,
  FileText, ExternalLink, Copy, Coffee, Gift, Rocket,
  Sun, Moon, ZapOff, Wifi, Bluetooth, Signal, Antenna,
  Eye, EyeOff, Volume2, Mic, Radio, Tv, Cast, Airplay,
  Layers, Grid, Layout, Columns, Split, PanelTop, PanelBottom
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// ============================================
// CONSTANTS
// ============================================
const currentYear = new Date().getFullYear();

// ============================================
// SUB-COMPONENTS
// ============================================

// 3D Tilt Card
const TiltCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });
  const springY = useSpring(y, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [-0.3, 0.3], ['8deg', '-8deg']);
  const rotateY = useTransform(springX, [-0.3, 0.3], ['-8deg', '8deg']);
  const glareOpacity = useTransform(springX, [-0.3, 0.3], [0, 0.15]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(cx);
    y.set(cy);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      style={{ rotateX, rotateY, transformPerspective: 1200 }}
      className={`relative ${className}`}
    >
      {children}
      <motion.div
        className="absolute inset-0 rounded-[inherit] pointer-events-none bg-gradient-to-br from-white/[0.08] via-transparent to-transparent"
        style={{ opacity: glareOpacity }}
      />
    </motion.div>
  );
};

// Glowing Border
const GlowingBorder: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative group">
    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500" />
    <div className="relative rounded-2xl bg-[#050508]">{children}</div>
  </div>
);

// Newsletter with animation
const PremiumNewsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status !== 'idle') return;
    setStatus('loading');
    await new Promise(r => setTimeout(r, 1200));
    setStatus('success');
    setTimeout(() => { setStatus('idle'); setEmail(''); }, 2500);
  };

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="flex items-center gap-2 p-1.5 bg-white/[0.03] rounded-2xl border border-white/[0.06] focus-within:border-cyan-500/30 transition-all duration-300">
        <Mail className="w-4 h-4 text-white/20 ml-3 shrink-0" />
        <input
          ref={inputRef}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          className="flex-1 bg-transparent text-white text-sm placeholder-white/20 outline-none py-2.5 min-w-0"
        />
        <motion.button
          type="submit"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={status !== 'idle'}
          className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            status === 'success'
              ? 'bg-emerald-500 text-white'
              : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-cyan-500/20'
          }`}
        >
          {status === 'loading' ? (
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
          ) : status === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </motion.button>
      </div>
      <AnimatePresence>
        {status === 'success' && (
          <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="absolute -bottom-6 left-0 text-emerald-400 text-xs">
            🎉 Welcome aboard! Check your inbox.
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  );
};

// ============================================
// MAIN FOOTER COMPONENT
// ============================================
export const Footer: React.FC = () => {
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => setShowBackToTop(window.scrollY > 600);
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    const handleMouseMove = (e: MouseEvent) => {
      if (footerRef.current) {
        const rect = footerRef.current.getBoundingClientRect();
        setCursorPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const socialLinks = [
    { icon: Twitter, href: '#', label: 'Twitter', gradient: 'hover:bg-sky-500/20 hover:text-sky-400 hover:border-sky-500/30' },
    { icon: Linkedin, href: '#', label: 'LinkedIn', gradient: 'hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/30' },
    { icon: Github, href: '#', label: 'GitHub', gradient: 'hover:bg-purple-500/20 hover:text-purple-400 hover:border-purple-500/30' },
    { icon: Youtube, href: '#', label: 'YouTube', gradient: 'hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30' },
    { icon: Instagram, href: '#', label: 'Instagram', gradient: 'hover:bg-pink-500/20 hover:text-pink-400 hover:border-pink-500/30' },
  ];

  const trustBadges = [
    { icon: Shield, text: 'HIPAA' },
    { icon: Fingerprint, text: 'SSL 256-bit' },
    { icon: BadgeCheck, text: 'SOC 2' },
    { icon: Lock, text: 'ISO 27001' },
    { icon: Cloud, text: 'GDPR' },
  ];

  const quickActions = [
    { icon: Calendar, label: 'Book Appointment', href: '/appointments' },
    { icon: Zap, label: 'Emergency', href: '/emergency' },
    { icon: Stethoscope, label: 'Find Doctor', href: '/doctors' },
    { icon: Pill, label: 'Order Medicine', href: '/pharmacy' },
  ];

  return (
    <footer ref={footerRef} className="relative bg-[#020205] border-t border-white/[0.03] overflow-hidden">
      
      {/* ============================================ */}
      {/* DYNAMIC BACKGROUND */}
      {/* ============================================ */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {/* Mouse-following glow */}
        <motion.div
          className="absolute w-[600px] h-[600px] rounded-full bg-gradient-to-r from-cyan-500/[0.03] to-purple-500/[0.03] blur-3xl"
          animate={{ x: cursorPos.x - 300, y: cursorPos.y - 300 }}
          transition={{ type: 'spring', stiffness: 50, damping: 30 }}
        />
        
        {/* Static orbs */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/[0.02] rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyan-500/[0.02] rounded-full blur-3xl" />

        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.01]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '60px 60px',
          }} />
      </div>

      {/* Top Divider */}
      <div className="relative">
        <div className="h-[1px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-40 h-[3px] bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full blur-sm" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-12">
        
        {/* ============================================ */}
        {/* QUICK ACTIONS ROW */}
        {/* ============================================ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-16"
        >
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link key={i} to={action.href}>
                <motion.div
                  whileHover={{ scale: 1.03, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-white/[0.06] flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 text-cyan-400" />
                  </div>
                  <span className="text-white/60 text-sm font-medium group-hover:text-white/80 transition-colors">
                    {action.label}
                  </span>
                  <ChevronRight className="w-4 h-4 text-white/15 ml-auto group-hover:text-white/40 group-hover:translate-x-1 transition-all" />
                </motion.div>
              </Link>
            );
          })}
        </motion.div>

        {/* ============================================ */}
        {/* MAIN GRID */}
        {/* ============================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          
          {/* BRAND + NEWSLETTER (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <TiltCard>
              <GlowingBorder>
                <div className="p-8">
                  <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: -10 }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 via-pink-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30"
                    >
                      <Sparkles className="w-8 h-8 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-3xl font-black text-white tracking-[-0.04em] leading-none">
                        Aetherion
                      </h3>
                      <p className="text-cyan-400 text-[11px] font-bold tracking-[0.3em] uppercase">
                        Health System
                      </p>
                    </div>
                  </Link>

                  <p className="text-white/25 text-sm leading-relaxed mb-6">
                    Redefining healthcare through artificial intelligence. 
                    Connecting patients, doctors, and hospitals in one intelligent ecosystem.
                  </p>

                  <div className="space-y-4">
                    <p className="text-white/40 text-xs font-bold uppercase tracking-widest">
                      Stay ahead of the curve
                    </p>
                    <PremiumNewsletter />
                    <p className="text-white/12 text-[10px]">
                      Join 10,000+ subscribers. Weekly insights. Zero spam.
                    </p>
                  </div>
                </div>
              </GlowingBorder>
            </TiltCard>

            {/* Social Proof */}
            <div className="flex items-center gap-4">
              {socialLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-11 h-11 rounded-xl bg-white/[0.02] border border-white/[0.05] flex items-center justify-center transition-all ${link.gradient}`}
                    aria-label={link.label}
                  >
                    <Icon className="w-4.5 h-4.5 text-white/30" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* LINKS (5 cols) */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-8">
            {[
              {
                title: 'Navigate',
                items: [
                  { label: 'Dashboard', href: '/dashboard' },
                  { label: 'Appointments', href: '/appointments' },
                  { label: 'Doctors', href: '/doctors' },
                  { label: 'Hospitals', href: '/hospitals' },
                  { label: 'Emergency', href: '/emergency' },
                  { label: 'Pharmacy', href: '/pharmacy' },
                ],
              },
              {
                title: 'Resources',
                items: [
                  { label: 'Help Center', href: '/help' },
                  { label: 'Documentation', href: '/docs' },
                  { label: 'API Reference', href: '/api' },
                  { label: 'System Status', href: '/status' },
                  { label: 'Community', href: '/community' },
                  { label: 'Blog', href: '/blog' },
                ],
              },
              {
                title: 'Company',
                items: [
                  { label: 'About', href: '/about' },
                  { label: 'Careers', href: '/careers', badge: 'Hiring' },
                  { label: 'Press', href: '/press' },
                  { label: 'Partners', href: '/partners' },
                  { label: 'Contact', href: '/contact' },
                  { label: 'Investors', href: '/investors' },
                ],
              },
              {
                title: 'Legal',
                items: [
                  { label: 'Privacy', href: '/privacy' },
                  { label: 'Terms', href: '/terms' },
                  { label: 'Cookies', href: '/cookies' },
                  { label: 'GDPR', href: '/gdpr' },
                  { label: 'HIPAA', href: '/hipaa' },
                  { label: 'Security', href: '/security' },
                ],
              },
            ].map((column, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <h4 className="text-white/80 text-xs font-bold uppercase tracking-widest mb-5">
                  {column.title}
                </h4>
                <ul className="space-y-2.5">
                  {column.items.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="group flex items-center gap-2 text-white/25 text-sm hover:text-white/70 transition-all duration-200"
                      >
                        <span className="w-1 h-1 rounded-full bg-white/10 group-hover:bg-cyan-400 group-hover:w-2 transition-all duration-300" />
                        {link.label}
                        {link.badge && (
                          <Badge variant="info" size="xs" className="scale-75 -ml-1">
                            {link.badge}
                          </Badge>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* CONTACT CARD (2 cols) */}
          <div className="lg:col-span-2">
            <TiltCard>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-500/[0.05] to-purple-500/[0.05] border border-white/[0.06]">
                <h4 className="text-white/80 text-xs font-bold uppercase tracking-widest mb-5">
                  Get in Touch
                </h4>
                <div className="space-y-4">
                  {[
                    { icon: Mail, label: 'Email', value: 'hello@aetherion.com' },
                    { icon: Phone, label: 'Phone', value: '+1 (555) 000-0000' },
                    { icon: MapPin, label: 'HQ', value: 'San Francisco, CA' },
                  ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                      <motion.a
                        key={i}
                        href="#"
                        whileHover={{ x: 4 }}
                        className="flex items-start gap-3 group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center shrink-0 group-hover:bg-cyan-500/10 group-hover:border-cyan-500/20 transition-all">
                          <Icon className="w-4 h-4 text-white/30 group-hover:text-cyan-400 transition-colors" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white/20 text-[10px] uppercase tracking-wider">{item.label}</p>
                          <p className="text-white/50 text-sm truncate">{item.value}</p>
                        </div>
                      </motion.a>
                    );
                  })}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/60 text-sm font-medium hover:bg-white/[0.06] hover:text-white hover:border-white/[0.1] transition-all flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  Live Chat Support
                  <ExternalLink className="w-3.5 h-3.5" />
                </motion.button>
              </div>
            </TiltCard>
          </div>
        </div>

        {/* ============================================ */}
        {/* BOTTOM BAR */}
        {/* ============================================ */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-white/[0.03]">
          
          <div className="flex items-center gap-3 text-white/15 text-xs">
            <Heart className="w-4 h-4 text-red-400 fill-red-400 animate-pulse" />
            <span>© {currentYear} Aetherion Health</span>
            <span className="text-white/05">|</span>
            <span className="flex items-center gap-1">
              Made with <Coffee className="w-3 h-3" /> in San Francisco
            </span>
          </div>

          <div className="flex items-center gap-4">
            {trustBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={i}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="flex items-center gap-1.5 text-white/12 text-[10px] cursor-default group"
                >
                  <Icon className="w-3 h-3 group-hover:text-cyan-400/50 transition-colors" />
                  <span className="group-hover:text-white/30 transition-colors">{badge.text}</span>
                </motion.div>
              );
            })}
          </div>

          <span className="text-white/05 text-[10px] font-mono">v4.0.0-beta</span>
        </div>
      </div>

      {/* ============================================ */}
      {/* BACK TO TOP BUTTON */}
      {/* ============================================ */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0, rotate: -90 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0, rotate: 90 }}
            whileHover={{ scale: 1.1, y: -3 }}
            whileTap={{ scale: 0.9 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl shadow-2xl shadow-indigo-500/30 flex items-center justify-center group"
            aria-label="Back to top"
          >
            <ChevronUp className="w-6 h-6 text-white group-hover:-translate-y-0.5 transition-transform" />
            <motion.div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              style={{ filter: 'blur(20px)' }}
            />
          </motion.button>
        )}
      </AnimatePresence>
    </footer>
  );
};

import { Calendar, Stethoscope, Pill } from 'lucide-react';

export default Footer;