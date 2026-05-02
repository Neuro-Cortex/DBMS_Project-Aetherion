// src/components/layout/Navbar.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Search, Bell, User, Settings, LogOut, Activity, Calendar, Users,
  Building2 as Hospital, Stethoscope, Home, Pill, Siren, MessageCircle,
  ChevronDown, Shield, Heart, Brain, Sparkles, Clock, BadgeCheck, ArrowRight,
  Command, Zap, Star, Moon, Sun, Globe, Layers, Grid, BarChart3, TrendingUp,
  CreditCard, Headphones, Video, Phone, MapPin, Navigation, Wifi, Bluetooth,
  Battery, Signal, Antenna, Satellite,  Radio, Tv, Cast, Airplay,
  Monitor, Tablet, Smartphone, Laptop, Camera, Mic, MicOff, Volume2, VolumeX,
  Play, Pause, SkipForward, SkipBack, RefreshCw, RotateCw, Maximize, Minimize,
  Fullscreen, Scan, ScanLine, QrCode, Barcode, Fingerprint, Key, Lock, Unlock,
  Eye, EyeOff, AlertTriangle, CheckCircle2, XCircle, HelpCircle, Info,
  FileText, Clipboard, Edit3, Trash2, Plus, Minus, ExternalLink, Link2,
  Share2, Bookmark, Flag, ThumbsUp, ThumbsDown, Smile, Frown, Meh
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Badge } from '@/components/ui/Badge';

// ============================================
// TYPES
// ============================================
export interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type?: 'appointment' | 'message' | 'alert' | 'system' | 'emergency';
  icon?: React.ElementType;
  action?: { label: string; href: string };
}

export interface UserType {
  name: string;
  email: string;
  role: string;
  department?: string;
  status?: 'online' | 'offline' | 'busy';
}

export interface NavbarProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
  user?: UserType;
}

// ============================================
// DEFAULT DATA
// ============================================
const defaultNotifications: Notification[] = [
  { id: '1', title: 'New Appointment', description: 'John Doe - Cardiology', time: '2m ago', unread: true, type: 'appointment', icon: Calendar, action: { label: 'View', href: '/appointments' } },
  { id: '2', title: 'Emergency: Code Blue', description: 'ICU Room 302', time: '5m ago', unread: true, type: 'emergency', icon: Siren, action: { label: 'Respond', href: '/emergency' } },
  { id: '3', title: 'Lab Results Ready', description: 'Sarah Connor - Blood work', time: '15m ago', unread: false, type: 'system', icon: Activity },
  { id: '4', title: 'AI Diagnosis Complete', description: 'Chest X-ray #45892', time: '30m ago', unread: false, type: 'system', icon: Brain },
];

const defaultUser: UserType = {
  name: 'Dr. Sarah Johnson',
  email: 'sarah@aetherion.com',
  role: 'Administrator',
  department: 'Cardiology',
  status: 'online',
};

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
  { name: 'Doctors', href: '/doctors', icon: Stethoscope },
  { name: 'Hospitals', href: '/hospitals', icon: Hospital },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Emergency', href: '/emergency', icon: Siren },
];

// ============================================
// SUB-COMPONENTS
// ============================================

const NotificationBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;
  return (
    <motion.span
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-black text-white bg-red-500 rounded-full border-2 border-[#050508] shadow-lg"
    >
      {count > 99 ? '99+' : count}
    </motion.span>
  );
};

const StatusDot: React.FC<{ status?: string }> = ({ status = 'online' }) => {
  const colors: Record<string, string> = {
    online: 'bg-emerald-400',
    offline: 'bg-gray-500',
    busy: 'bg-amber-400',
  };
  return (
    <span className="relative flex h-2.5 w-2.5">
      {status === 'online' && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors[status] || colors.online}`} />
    </span>
  );
};

// ============================================
// MAIN NAVBAR
// ============================================
export const Navbar: React.FC<NavbarProps> = ({
  onMenuClick,
  sidebarOpen = false,
  user = defaultUser,
}) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [time, setTime] = useState(new Date());

  const searchRef = useRef<HTMLInputElement>(null);
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = defaultNotifications.filter(n => n.unread).length;

  // Scroll effect
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 15);
  });

  // Clock
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setSearchOpen(true); }
      if (e.key === 'Escape') { setSearchOpen(false); setNotificationOpen(false); setProfileOpen(false); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.notification-area')) setNotificationOpen(false);
      if (!target.closest('.profile-area')) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const isActive = useCallback((path: string) => location.pathname === path || location.pathname.startsWith(path + '/'), [location.pathname]);

  const handleLogout = () => { setProfileOpen(false); navigate('/login'); };

  const getNotifColor = (type?: string) => {
    const c: Record<string, string> = {
      emergency: 'bg-red-500/10 text-red-400 border-red-500/20',
      alert: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      appointment: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      message: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      system: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    };
    return c[type || 'system'] || c.system;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#050508]/90 backdrop-blur-2xl border-b border-white/[0.04] shadow-2xl shadow-black/20 py-2'
            : 'bg-transparent py-4'
        }`}
      >
        {/* Ambient glow line */}
        <div className={`absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent transition-opacity duration-500 ${scrolled ? 'opacity-100' : 'opacity-0'}`} />

        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 flex items-center justify-between">
          
          {/* ============================================ */}
          {/* LEFT — Logo + Links */}
          {/* ============================================ */}
          <div className="flex items-center gap-6">
            {/* Mobile Toggle */}
            <button type="button" onClick={onMenuClick} className="lg:hidden p-2 -ml-2 text-white/60 hover:text-white transition-colors">
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group shrink-0">
              <motion.div whileHover={{ rotate: -10, scale: 1.1 }} className="relative w-9 h-9">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl rotate-45 group-hover:rotate-[135deg] transition-transform duration-700 shadow-lg shadow-cyan-500/20" />
                <Sparkles className="absolute inset-0 m-auto w-4.5 h-4.5 text-white" />
              </motion.div>
              <div className="hidden sm:block">
                <span className="text-lg font-bold text-white tracking-[-0.02em]">Aetherion</span>
                <span className="text-xs text-cyan-400 font-medium -mt-1 block">Health</span>
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden lg:flex items-center gap-0.5 ml-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = isActive(link.href);
                const isHovered = hoveredLink === link.href;
                return (
                  <Link
                    key={link.href}
                    to={link.href}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      active ? 'text-white bg-white/[0.06]' : 'text-white/45 hover:text-white/80 hover:bg-white/[0.03]'
                    }`}
                  >
                    <Icon className={`w-4 h-4 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`} />
                    <span>{link.name}</span>
                    {active && (
                      <motion.div layoutId="nav-active" className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }} />
                    )}
                    {link.name === 'Emergency' && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* ============================================ */}
          {/* RIGHT — Actions */}
          {/* ============================================ */}
          <div className="flex items-center gap-1.5">
            {/* Time */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-2 text-white/25 text-xs font-mono">
              <Clock className="w-3.5 h-3.5" />
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
            </div>

            {/* Search */}
            <button type="button" onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-2 text-white/35 hover:text-white/70 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl text-xs transition-all border border-white/[0.04] hover:border-white/[0.08]">
              <Search className="w-4 h-4" />
              <span className="hidden lg:inline">Search...</span>
              <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-white/20 bg-white/[0.04] rounded-md font-mono border border-white/[0.04]">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </button>

            {/* Emergency SOS */}
            <Link to="/emergency"
              className="relative flex items-center gap-1.5 px-3 py-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 hover:border-red-500/25 rounded-xl text-red-400 text-xs font-bold transition-all group">
              <Siren className="w-4 h-4 animate-pulse" />
              <span className="hidden md:inline">SOS</span>
            </Link>

            {/* Notifications */}
            <div className="relative notification-area">
              <button type="button" onClick={() => { setNotificationOpen(!notificationOpen); setProfileOpen(false); }}
                className="relative p-2.5 text-white/40 hover:text-white bg-white/[0.01] hover:bg-white/[0.05] rounded-xl transition-all">
                <Bell className="w-4.5 h-4.5" />
                <NotificationBadge count={unreadCount} />
              </button>

              <AnimatePresence>
                {notificationOpen && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-[#0a0a10]/98 backdrop-blur-2xl rounded-2xl border border-white/[0.06] shadow-2xl shadow-black/40 overflow-hidden z-50">
                    <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-semibold text-sm">Notifications</h3>
                        <p className="text-white/30 text-[10px] mt-0.5">{unreadCount} unread</p>
                      </div>
                      <Badge variant="info" size="xs">New</Badge>
                    </div>
                    <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                      {defaultNotifications.map((n) => {
                        const Icon = n.icon || Bell;
                        return (
                          <button key={n.id} type="button" onClick={() => { if (n.action) navigate(n.action.href); setNotificationOpen(false); }}
                            className={`w-full text-left p-3.5 flex items-start gap-3 hover:bg-white/[0.03] transition-colors ${n.unread ? 'bg-cyan-500/[0.03]' : ''}`}>
                            <div className={`p-2 rounded-lg border shrink-0 ${getNotifColor(n.type)}`}><Icon className="w-3.5 h-3.5" /></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-xs font-medium truncate">{n.title}</p>
                              <p className="text-white/35 text-[10px] mt-0.5 line-clamp-1">{n.description}</p>
                              <span className="text-white/15 text-[10px] mt-1.5 flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{n.time}</span>
                            </div>
                            {n.unread && <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full shrink-0 mt-1.5" />}
                          </button>
                        );
                      })}
                    </div>
                    <Link to="/notifications" onClick={() => setNotificationOpen(false)} className="block text-center py-3 text-cyan-400 text-xs font-medium hover:bg-white/[0.02] transition-colors border-t border-white/[0.04]">
                      View all notifications
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile */}
            <div className="relative profile-area">
              <button type="button" onClick={() => { setProfileOpen(!profileOpen); setNotificationOpen(false); }}
                className="flex items-center gap-2 p-1.5 hover:bg-white/[0.04] rounded-xl transition-all">
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5"><StatusDot status={user.status} /></div>
                </div>
                <ChevronDown className={`hidden md:block w-3.5 h-3.5 text-white/30 transition-transform duration-300 ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div initial={{ opacity: 0, y: 8, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.2 }}
                    className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a10]/98 backdrop-blur-2xl rounded-2xl border border-white/[0.06] shadow-2xl shadow-black/40 overflow-hidden z-50">
                    <div className="p-4 border-b border-white/[0.04]">
                      <p className="text-white text-sm font-semibold">{user.name}</p>
                      <p className="text-white/30 text-[10px] mt-0.5">{user.email}</p>
                      <p className="text-cyan-400 text-[10px] mt-1">{user.role}</p>
                    </div>
                    <div className="p-1.5">
                      {[{ icon: User, label: 'Profile' }, { icon: Settings, label: 'Settings' }, { icon: Activity, label: 'Activity' }, { icon: Shield, label: 'Security' }].map((item) => {
                        const Icon = item.icon;
                        return (
                          <button key={item.label} type="button" onClick={() => setProfileOpen(false)} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-white/50 hover:text-white hover:bg-white/[0.04] rounded-lg text-xs transition-all">
                            <Icon className="w-3.5 h-3.5" />{item.label}
                          </button>
                        );
                      })}
                    </div>
                    <div className="p-1.5 border-t border-white/[0.04]">
                      <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg text-xs transition-all">
                        <LogOut className="w-3.5 h-3.5" />Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ============================================ */}
      {/* SEARCH OVERLAY */}
      {/* ============================================ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-start justify-center pt-28 px-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setSearchOpen(false)} />
            <motion.div initial={{ opacity: 0, y: -15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -15, scale: 0.95 }} transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-xl bg-[#0a0a10]/98 backdrop-blur-2xl rounded-2xl border border-white/[0.06] shadow-2xl shadow-black/40 overflow-hidden">
              <div className="flex items-center gap-3 p-5">
                <Search className="w-5 h-5 text-white/30 shrink-0" />
                <input ref={searchRef} type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anything... (doctors, hospitals, appointments)"
                  className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none" autoFocus />
                <kbd className="text-[10px] text-white/20 bg-white/[0.04] px-2 py-1 rounded-md font-mono border border-white/[0.04]">ESC</kbd>
              </div>
              {searchQuery && (
                <div className="border-t border-white/[0.04] p-3 max-h-64 overflow-y-auto">
                  <p className="text-white/20 text-xs px-3 py-4 text-center">Type to search across the platform...</p>
                </div>
              )}
              <div className="border-t border-white/[0.04] p-3 flex items-center gap-4 text-[10px] text-white/15">
                <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> to navigate</span>
                <span className="flex items-center gap-1"><Command className="w-3 h-3" />K to open</span>
                <span>ESC to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer */}
      <div className={scrolled ? 'h-14' : 'h-[4.5rem]'} />
    </>
  );
};

export default Navbar;