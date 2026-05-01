// src/components/layout/Navbar.tsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  Search,
  Bell,
  User,
  Settings,
  LogOut,
  Activity,
  Calendar,
  Users,
  Building2 as Hospital,
  Stethoscope,
  Home,
  Pill,
  Siren,
  MessageCircle,
  ChevronDown,
  Zap,
  Shield,
  CreditCard,
  Heart,
  Brain,
  Sparkles,
  Clock,
  CheckCircle2,
  AlertTriangle,
  BadgeCheck,
  ArrowRight,
  Command,
} from 'lucide-react';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

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
  action?: {
    label: string;
    href: string;
  };
}

export interface UserType {
  id?: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'doctor' | 'patient' | 'staff';
  department?: string;
  hospital?: string;
  status?: 'online' | 'offline' | 'busy';
}

export interface NavbarProps {
  variant?: 'glass' | 'gradient' | 'neon' | 'solid' | 'premium';
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
  user?: UserType;
  notifications?: Notification[];
  className?: string;
}

// ============================================
// DEFAULT DATA
// ============================================

const defaultNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Appointment Request',
    description: 'Patient John Doe scheduled a cardiology consultation',
    time: '2 min ago',
    unread: true,
    type: 'appointment',
    icon: Calendar,
    action: { label: 'View', href: '/appointments' },
  },
  {
    id: '2',
    title: 'Emergency Alert - Code Blue',
    description: 'ICU Room 302 - Immediate attention required',
    time: '5 min ago',
    unread: true,
    type: 'emergency',
    icon: Siren,
    action: { label: 'Respond', href: '/emergency' },
  },
  {
    id: '3',
    title: 'Lab Results Ready',
    description: 'Patient Sarah Connor - Blood work analysis complete',
    time: '15 min ago',
    unread: false,
    type: 'system',
    icon: Activity,
    action: { label: 'Review', href: '/lab-results' },
  },
  {
    id: '4',
    title: 'AI Diagnosis Complete',
    description: 'Chest X-ray analysis for patient #45892',
    time: '30 min ago',
    unread: false,
    type: 'system',
    icon: Brain,
  },
  {
    id: '5',
    title: 'New Message from Dr. Chen',
    description: 'Regarding the telemedicine protocol update',
    time: '1 hour ago',
    unread: false,
    type: 'message',
    icon: MessageCircle,
  },
];

const defaultUser: UserType = {
  name: 'Dr. Sarah Johnson',
  email: 'sarah.johnson@aetherion.com',
  role: 'admin',
  department: 'Cardiology',
  hospital: 'Aetherion Medical Center',
  status: 'online',
};

// ============================================
// STYLES
// ============================================

const variantStyles: Record<string, string> = {
  glass: 'bg-white/5 backdrop-blur-2xl border-b border-white/10',
  gradient: 'bg-gradient-to-r from-purple-600/90 via-pink-600/90 to-red-600/90',
  neon: 'bg-black/90 border-b border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]',
  solid: 'bg-white border-b border-gray-200',
  premium:
    'bg-gradient-to-r from-[#0a0a1a]/98 via-purple-950/98 to-[#0a0a1a]/98 backdrop-blur-2xl border-b border-white/10 shadow-2xl',
};

// ============================================
// NAVIGATION LINKS
// ============================================

const navLinks = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, shortcut: '1' },
  { name: 'Doctors', href: '/doctors', icon: Stethoscope, shortcut: '2' },
  { name: 'Hospitals', href: '/hospitals', icon: Hospital, shortcut: '3' },
  { name: 'Appointments', href: '/appointments', icon: Calendar, shortcut: '4' },
  { name: 'Emergency', href: '/emergency', icon: Siren, shortcut: '5' },
];

// ============================================
// SUB-COMPONENTS
// ============================================

// Notification Icon Badge
const NotificationBadge: React.FC<{ count: number }> = ({ count }) => {
  if (count === 0) return null;
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full border-2 border-[#0a0a1a]"
    >
      {count > 99 ? '99+' : count}
    </motion.span>
  );
};

// Status Indicator
const StatusDot: React.FC<{ status?: string }> = ({ status = 'online' }) => {
  const colors: Record<string, string> = {
    online: 'bg-green-400 shadow-[0_0_6px_rgba(34,197,94,0.5)]',
    offline: 'bg-gray-500',
    busy: 'bg-yellow-400 shadow-[0_0_6px_rgba(245,158,11,0.5)]',
  };

  return (
    <span className="relative flex h-2.5 w-2.5">
      {status === 'online' && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${colors[status] || colors.online}`} />
    </span>
  );
};

// ============================================
// MAIN NAVBAR COMPONENT
// ============================================

export const Navbar: React.FC<NavbarProps> = ({
  variant = 'premium',
  onMenuClick,
  sidebarOpen = false,
  user = defaultUser,
  notifications = defaultNotifications,
  className,
}) => {
  // State
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // Refs
  const searchRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);

  // Hooks
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter((n) => n.unread).length;

  // ============================================
  // FIXED: Use useMotionValueEvent instead of onChange
  // ============================================
  useMotionValueEvent(scrollY, 'change', (latest) => {
    setScrolled(latest > 20);
  });

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdowns on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNotificationOpen(false);
        setProfileOpen(false);
        setSearchOpen(false);
        setActiveDropdown(null);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [searchOpen]);

  // Keyboard shortcut for search (Ctrl/Cmd + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper functions
  const isActive = useCallback(
    (path: string) => location.pathname === path || location.pathname.startsWith(path + '/'),
    [location.pathname]
  );

  const handleLogout = useCallback(() => {
    setProfileOpen(false);
    navigate('/login');
  }, [navigate]);

  const handleNotificationClick = useCallback(
    (notification: Notification) => {
      if (notification.action?.href) {
        setNotificationOpen(false);
        navigate(notification.action.href);
      }
    },
    [navigate]
  );

  const getNotificationIcon = (notification: Notification) => {
    if (notification.icon) return notification.icon;
    const icons: Record<string, React.ElementType> = {
      appointment: Calendar,
      message: MessageCircle,
      alert: AlertTriangle,
      system: Activity,
      emergency: Siren,
    };
    return icons[notification.type || 'system'] || Bell;
  };

  const getNotificationColor = (type?: string) => {
    const colors: Record<string, string> = {
      emergency: 'bg-red-500/20 text-red-400 border-red-500/30',
      alert: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      appointment: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      message: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      system: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    };
    return colors[type || 'system'] || colors.system;
  };

  return (
    <motion.nav
      ref={navbarRef}
      id="main-navbar"
      className={twMerge(
        clsx(
          'fixed top-0 left-0 right-0 z-50 flex items-center justify-between transition-all duration-300',
          variantStyles[variant] || variantStyles.premium,
          scrolled ? 'py-2.5 shadow-2xl' : 'py-4',
          className
        )
      )}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* ============================================ */}
      {/* LEFT SECTION */}
      {/* ============================================ */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Mobile Menu Toggle */}
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          aria-expanded={sidebarOpen}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Logo / Brand */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group"
          aria-label="Aetherion Health - Home"
        >
          {/* Logo Icon */}
          <div className="relative w-9 h-9">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500" />
            <div className="absolute inset-1 bg-[#0a0a1a] rounded-md rotate-45" />
            <Heart className="absolute inset-0 m-auto w-4 h-4 text-cyan-400" />
          </div>
          
          {/* Brand Text */}
          <div className="hidden sm:block">
            <span className="text-lg font-bold text-white tracking-tight">
              Aetherion
            </span>
            <span className="text-lg font-light text-cyan-400">Health</span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 ml-4" aria-label="Main navigation">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <Link
                key={link.name}
                to={link.href}
                className={clsx(
                  'relative flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 group',
                  active
                    ? 'text-cyan-400 bg-cyan-500/10'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{link.name}</span>
                
                {/* Active indicator */}
                {active && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* ============================================ */}
      {/* RIGHT SECTION */}
      {/* ============================================ */}
      <div className="flex items-center gap-2 md:gap-3">
        {/* Search Toggle Button */}
        <button
          type="button"
          onClick={() => setSearchOpen(!searchOpen)}
          className="hidden sm:flex items-center gap-2 px-3 py-2 text-white/40 hover:text-white/70 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-all"
          aria-label="Search (Ctrl+K)"
        >
          <Search className="w-4 h-4" />
          <span className="hidden lg:inline text-xs">Search...</span>
          <kbd className="hidden lg:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-white/30 bg-white/10 rounded font-mono">
            <Command className="w-2.5 h-2.5" />K
          </kbd>
        </button>

        {/* Emergency Quick Access */}
        <Link
          to="/emergency"
          className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium transition-all"
          aria-label="Emergency - Quick access"
        >
          <Siren className="w-4 h-4 animate-pulse-fast" />
          <span className="hidden lg:inline">SOS</span>
        </Link>

        {/* Notifications */}
        <div className="relative" ref={notificationRef}>
          <button
            type="button"
            onClick={() => {
              setNotificationOpen(!notificationOpen);
              setProfileOpen(false);
              setActiveDropdown(notificationOpen ? null : 'notifications');
            }}
            className="relative p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"
            aria-label={`Notifications (${unreadCount} unread)`}
            aria-expanded={notificationOpen}
            aria-haspopup="true"
          >
            <Bell className="w-5 h-5" />
            <NotificationBadge count={unreadCount} />
          </button>

          {/* Notifications Dropdown */}
          <AnimatePresence>
            {notificationOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-[#0a0a1a]/98 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50"
                role="menu"
                aria-label="Notifications"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-white/10">
                  <div>
                    <h3 className="text-white font-semibold text-sm">Notifications</h3>
                    <p className="text-white/40 text-xs mt-0.5">
                      {unreadCount} unread messages
                    </p>
                  </div>
                  <button
                    type="button"
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors"
                    onClick={() => {/* Mark all as read */}}
                  >
                    Mark all read
                  </button>
                </div>

                {/* Notification List */}
                <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="w-8 h-8 text-white/20 mx-auto mb-3" />
                      <p className="text-white/40 text-sm">No notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const Icon = getNotificationIcon(notification);
                      return (
                        <button
                          key={notification.id}
                          type="button"
                          onClick={() => handleNotificationClick(notification)}
                          className={clsx(
                            'w-full text-left p-4 flex items-start gap-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0',
                            notification.unread && 'bg-cyan-500/5'
                          )}
                        >
                          {/* Icon */}
                          <div className={`p-2 rounded-lg border shrink-0 ${getNotificationColor(notification.type)}`}>
                            <Icon className="w-4 h-4" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <p className="text-white text-sm font-medium truncate">
                                {notification.title}
                              </p>
                              {notification.unread && (
                                <span className="w-2 h-2 bg-cyan-400 rounded-full shrink-0 mt-1.5" />
                              )}
                            </div>
                            <p className="text-white/50 text-xs mt-0.5 line-clamp-2">
                              {notification.description}
                            </p>
                            <div className="flex items-center justify-between mt-2">
                              <span className="text-white/30 text-[10px] flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {notification.time}
                              </span>
                              {notification.action && (
                                <span className="text-cyan-400 text-xs font-medium flex items-center gap-0.5">
                                  {notification.action.label}
                                  <ArrowRight className="w-3 h-3" />
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="p-3 border-t border-white/10">
                  <Link
                    to="/notifications"
                    onClick={() => setNotificationOpen(false)}
                    className="block text-center text-cyan-400 text-xs font-medium hover:text-cyan-300 transition-colors py-1"
                  >
                    View all notifications
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button
            type="button"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotificationOpen(false);
              setActiveDropdown(profileOpen ? null : 'profile');
            }}
            className="flex items-center gap-2 p-1.5 hover:bg-white/10 rounded-xl transition-all group"
            aria-label={`User menu for ${user.name}`}
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            {/* Avatar */}
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5">
                <StatusDot status={user.status} />
              </div>
            </div>
            
            {/* Name (Desktop) */}
            <div className="hidden md:block text-left">
              <p className="text-white text-xs font-medium leading-tight">{user.name}</p>
              <p className="text-white/40 text-[10px] leading-tight">{user.role}</p>
            </div>
            
            <ChevronDown className={`hidden md:block w-4 h-4 text-white/40 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Profile Dropdown */}
          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 top-full mt-2 w-64 bg-[#0a0a1a]/98 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden z-50"
                role="menu"
                aria-label="User menu"
              >
                {/* User Info */}
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-white font-medium text-sm">{user.name}</p>
                      <p className="text-white/40 text-xs">{user.email}</p>
                    </div>
                  </div>
                  {user.department && (
                    <div className="flex items-center gap-2 mt-3">
                      <BadgeCheck className="w-3.5 h-3.5 text-cyan-400" />
                      <span className="text-white/50 text-xs">{user.department}</span>
                    </div>
                  )}
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  {[
                    { icon: User, label: 'My Profile', href: '/profile' },
                    { icon: Settings, label: 'Settings', href: '/settings' },
                    { icon: Activity, label: 'Activity Log', href: '/activity' },
                    { icon: Shield, label: 'Privacy & Security', href: '/privacy' },
                  ].map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-all text-sm"
                      role="menuitem"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  ))}
                </div>

                {/* Logout */}
                <div className="p-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg transition-all text-sm"
                    role="menuitem"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ============================================ */}
      {/* SEARCH OVERLAY */}
      {/* ============================================ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-start justify-center pt-24 px-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSearchOpen(false)}
            />

            {/* Search Modal */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-[#0a0a1a]/98 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 p-4">
                <Search className="w-5 h-5 text-white/40 shrink-0" />
                <input
                  ref={searchRef}
                  id="global-search"
                  name="global-search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search doctors, hospitals, appointments..."
                  className="w-full bg-transparent text-white placeholder-white/30 outline-none text-sm"
                  autoComplete="off"
                  aria-label="Global search"
                  role="searchbox"
                />
                <kbd className="text-xs text-white/30 bg-white/10 px-2 py-1 rounded font-mono">
                  ESC
                </kbd>
              </div>

              {searchQuery && (
                <div className="border-t border-white/10 p-2 max-h-64 overflow-y-auto">
                  <p className="text-white/30 text-xs px-3 py-2">
                    Start typing to search...
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;