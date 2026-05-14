// src/components/layout/Navbar.tsx
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Menu, X, Search, Bell, User, Settings, LogOut, Activity, Calendar, Users,
  BarChart3, Stethoscope, Home, Siren, ChevronDown, Shield, 
  Clock, Command, Sparkles, ExternalLink
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
type NotificationType = 'appointment' | 'message' | 'alert' | 'system' | 'emergency';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  type: NotificationType;
  icon?: React.ElementType;
  action?: {
    label: string;
    href: string;
  };
}

interface User {
  name: string;
  email: string;
  role: string;
  department?: string;
  status: 'online' | 'offline' | 'busy';
  avatar?: string;
}

interface NavbarProps {
  onMenuClick?: () => void;
  sidebarOpen?: boolean;
  user?: User;
  notifications?: Notification[];
}

interface NavLink {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
  exact?: boolean;
}

// ============================================
// CONSTANTS
// ============================================
const NAV_LINKS: NavLink[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, exact: true },
  { name: 'Doctors', href: '/doctors', icon: Stethoscope },
  { name: 'Hospitals', href: '/hospitals', icon: BarChart3 },
  { name: 'Appointments', href: '/appointments', icon: Calendar },
  { name: 'Emergency', href: '/emergency', icon: Siren, badge: 2 },
];

const PROFILE_MENU_ITEMS = [
  { icon: User, label: 'Profile', href: '/profile' },
  { icon: Settings, label: 'Settings', href: '/settings' },
  { icon: Activity, label: 'Activity', href: '/activity' },
  { icon: Shield, label: 'Security', href: '/security' },
] as const;

const NOTIFICATION_COLORS: Record<NotificationType, string> = {
  emergency: 'bg-red-500/10 text-red-400 border-red-500/20',
  alert: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  appointment: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  message: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  system: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
};

const STATUS_COLORS = {
  online: 'bg-emerald-400',
  offline: 'bg-gray-500',
  busy: 'bg-amber-400',
} as const;

// ============================================
// ANIMATION VARIANTS
// ============================================
const dropdownVariants = {
  hidden: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    transition: { duration: 0.15, ease: 'easeIn' }
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] }
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.96,
    transition: { duration: 0.12, ease: 'easeIn' }
  }
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
const formatTime = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
};

const cn = (...classes: (string | boolean | undefined | null)[]): string => {
  return classes.filter(Boolean).join(' ');
};

// ============================================
// SUB-COMPONENTS
// ============================================
const NotificationBadge: React.FC<{ count: number }> = React.memo(({ count }) => {
  if (count === 0) return null;
  
  return (
    <motion.span
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[9px] font-black text-white bg-red-500 rounded-full border-2 border-[#050508] shadow-lg shadow-red-500/20"
      aria-label={`${count} unread notifications`}
    >
      {count > 99 ? '99+' : count}
    </motion.span>
  );
});

NotificationBadge.displayName = 'NotificationBadge';

const StatusDot: React.FC<{ status: User['status'] }> = React.memo(({ status }) => {
  return (
    <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5" role="status" aria-label={`User is ${status}`}>
      {status === 'online' && (
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
      )}
      <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${STATUS_COLORS[status]}`} />
    </span>
  );
});

StatusDot.displayName = 'StatusDot';

const NavItem: React.FC<{
  link: NavLink;
  isActive: boolean;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}> = React.memo(({ link, isActive, isHovered, onMouseEnter, onMouseLeave }) => {
  const Icon = link.icon;
  
  return (
    <Link
      to={link.href}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 group',
        isActive
          ? 'text-white bg-white/[0.06]'
          : 'text-white/45 hover:text-white/80 hover:bg-white/[0.03]'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon
        className={cn(
          'w-4 h-4 transition-transform duration-300',
          isHovered && 'scale-110',
          isActive && 'text-cyan-400'
        )}
      />
      <span className="hidden sm:inline">{link.name}</span>
      
      {isActive && (
        <motion.div
          layoutId="navbar-active-indicator"
          className="absolute bottom-0 left-3 right-3 h-[2px] bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full"
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
        />
      )}
      
      {link.badge && link.badge > 0 && (
        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
      )}
    </Link>
  );
});

NavItem.displayName = 'NavItem';

// ============================================
// MAIN NAVBAR COMPONENT
// ============================================
export const Navbar: React.FC<NavbarProps> = React.memo(({
  onMenuClick,
  sidebarOpen = false,
  user = {
    name: 'Dr. Sarah Johnson',
    email: 'sarah@aetherion.com',
    role: 'Administrator',
    department: 'Cardiology',
    status: 'online',
  },
  notifications = [],
}) => {
  // State management
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Refs
  const searchInputRef = useRef<HTMLInputElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Hooks
  const { scrollY } = useScroll();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Memoized values
  const unreadCount = useMemo(
    () => notifications.filter(n => n.unread).length,
    [notifications]
  );
  
  // Scroll effect
  useMotionValueEvent(scrollY, 'change', (latest) => {
    const isScrolled = latest > 15;
    if (isScrolled !== scrolled) {
      setScrolled(isScrolled);
    }
  });
  
  // Time update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyboard = (e: KeyboardEvent) => {
      const isMod = e.ctrlKey || e.metaKey;
      
      if (isMod && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 100);
      }
      
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setNotificationOpen(false);
        setProfileOpen(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, []);
  
  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (notificationRef.current && !notificationRef.current.contains(target)) {
        setNotificationOpen(false);
      }
      
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Route matching
  const isActiveRoute = useCallback(
    (path: string, exact?: boolean) => {
      if (exact) return location.pathname === path;
      return location.pathname === path || location.pathname.startsWith(path + '/');
    },
    [location.pathname]
  );
  
  // Handlers
  const handleLogout = useCallback(() => {
    setProfileOpen(false);
    navigate('/login');
  }, [navigate]);
  
  const handleNotificationClick = useCallback((notification: Notification) => {
    if (notification.action) {
      navigate(notification.action.href);
      setNotificationOpen(false);
    }
  }, [navigate]);
  
  const handleSearchClose = useCallback(() => {
    setSearchOpen(false);
    setSearchQuery('');
  }, []);
  
  const toggleNotifications = useCallback(() => {
    setNotificationOpen(prev => !prev);
    setProfileOpen(false);
  }, []);
  
  const toggleProfile = useCallback(() => {
    setProfileOpen(prev => !prev);
    setNotificationOpen(false);
  }, []);
  
  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-[#050508]/90 backdrop-blur-2xl border-b border-white/[0.04] shadow-2xl shadow-black/20 py-2'
            : 'bg-transparent py-4'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Ambient glow line */}
        <div
          className={cn(
            'absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent transition-opacity duration-500',
            scrolled ? 'opacity-100' : 'opacity-0'
          )}
        />
        
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-12">
            {/* LEFT SECTION */}
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={onMenuClick}
                className="lg:hidden p-2 -ml-2 text-white/60 hover:text-white transition-colors rounded-lg hover:bg-white/[0.05]"
                aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
                aria-expanded={sidebarOpen}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              
              {/* Logo */}
              <Link
                to="/"
                className="flex items-center gap-2.5 group shrink-0"
                aria-label="Aetherion Health - Home"
              >
                <motion.div
                  whileHover={{ rotate: -10, scale: 1.1 }}
                  className="relative w-9 h-9"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 via-purple-500 to-pink-500 rounded-xl rotate-45 group-hover:rotate-[135deg] transition-transform duration-700 shadow-lg shadow-cyan-500/20" />
                  <Sparkles className="absolute inset-0 m-auto w-[18px] h-[18px] text-white" />
                </motion.div>
                
                <div className="hidden sm:block">
                  <span className="text-lg font-bold text-white tracking-tight">
                    Aetherion
                  </span>
                  <span className="text-xs text-cyan-400 font-medium block -mt-0.5">
                    Health
                  </span>
                </div>
              </Link>
              
              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center gap-0.5 ml-6" role="menubar">
                {NAV_LINKS.map((link) => (
                  <NavItem
                    key={link.href}
                    link={link}
                    isActive={isActiveRoute(link.href, link.exact)}
                    isHovered={hoveredLink === link.href}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink(null)}
                  />
                ))}
              </nav>
            </div>
            
            {/* RIGHT SECTION */}
            <div className="flex items-center gap-1.5">
              {/* Clock */}
              <div className="hidden xl:flex items-center gap-2 px-3 py-2 text-white/25 text-xs font-mono select-none">
                <Clock className="w-3.5 h-3.5" aria-hidden="true" />
                <time dateTime={currentTime.toISOString()}>
                  {formatTime(currentTime)}
                </time>
              </div>
              
              {/* Search button */}
              <button
                type="button"
                onClick={() => {
                  setSearchOpen(true);
                  setTimeout(() => searchInputRef.current?.focus(), 100);
                }}
                className="hidden sm:flex items-center gap-2 px-3 py-2 text-white/35 hover:text-white/70 bg-white/[0.02] hover:bg-white/[0.05] rounded-xl text-xs transition-all border border-white/[0.04] hover:border-white/[0.08] focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                aria-label="Search (Command+K)"
              >
                <Search className="w-4 h-4" aria-hidden="true" />
                <span className="hidden lg:inline">Search...</span>
                <kbd className="hidden lg:flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] text-white/20 bg-white/[0.04] rounded-md font-mono border border-white/[0.04]">
                  <Command className="w-2.5 h-2.5" aria-hidden="true" />K
                </kbd>
              </button>
              
              {/* Emergency button */}
              <Link
                to="/emergency"
                className="relative flex items-center gap-1.5 px-3 py-2 bg-red-500/5 hover:bg-red-500/10 border border-red-500/15 hover:border-red-500/25 rounded-xl text-red-400 text-xs font-bold transition-all group focus:outline-none focus:ring-2 focus:ring-red-500/20"
                aria-label="Emergency services"
              >
                <Siren className="w-4 h-4 animate-pulse" aria-hidden="true" />
                <span className="hidden md:inline">SOS</span>
              </Link>
              
              {/* Notifications */}
              <div className="relative" ref={notificationRef}>
                <button
                  type="button"
                  onClick={toggleNotifications}
                  className="relative p-2.5 text-white/40 hover:text-white bg-white/[0.01] hover:bg-white/[0.05] rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  aria-label={`Notifications (${unreadCount} unread)`}
                  aria-expanded={notificationOpen}
                  aria-haspopup="true"
                >
                  <Bell className="w-[18px] h-[18px]" aria-hidden="true" />
                  <NotificationBadge count={unreadCount} />
                </button>
                
                <AnimatePresence>
                  {notificationOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 top-full mt-2 w-80 bg-[#0a0a10]/98 backdrop-blur-2xl rounded-2xl border border-white/[0.06] shadow-2xl shadow-black/40 overflow-hidden z-50"
                      role="menu"
                      aria-label="Notifications menu"
                    >
                      {/* Notification header */}
                      <div className="p-4 border-b border-white/[0.04]">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold text-sm">
                              Notifications
                            </h3>
                            <p className="text-white/30 text-[10px] mt-0.5">
                              {unreadCount} unread
                            </p>
                          </div>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[10px] font-medium rounded-full border border-cyan-500/20">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Notification list */}
                      <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center">
                            <Bell className="w-8 h-8 text-white/10 mx-auto mb-3" />
                            <p className="text-white/30 text-xs">No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notification) => {
                            const Icon = notification.icon || Bell;
                            return (
                              <button
                                key={notification.id}
                                type="button"
                                onClick={() => handleNotificationClick(notification)}
                                className={cn(
                                  'w-full text-left p-3.5 flex items-start gap-3 hover:bg-white/[0.03] transition-colors',
                                  notification.unread && 'bg-cyan-500/[0.03]'
                                )}
                                role="menuitem"
                              >
                                <div className={cn(
                                  'p-2 rounded-lg border shrink-0',
                                  NOTIFICATION_COLORS[notification.type]
                                )}>
                                  <Icon className="w-3.5 h-3.5" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-xs font-medium truncate">
                                    {notification.title}
                                  </p>
                                  <p className="text-white/35 text-[10px] mt-0.5 line-clamp-1">
                                    {notification.description}
                                  </p>
                                  <span className="text-white/15 text-[10px] mt-1.5 flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" aria-hidden="true" />
                                    {notification.time}
                                  </span>
                                </div>
                                
                                {notification.unread && (
                                  <span
                                    className="w-1.5 h-1.5 bg-cyan-400 rounded-full shrink-0 mt-1.5"
                                    aria-label="Unread"
                                  />
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                      
                      {/* View all link */}
                      {notifications.length > 0 && (
                        <Link
                          to="/notifications"
                          onClick={() => setNotificationOpen(false)}
                          className="block text-center py-3 text-cyan-400 text-xs font-medium hover:bg-white/[0.02] transition-colors border-t border-white/[0.04]"
                        >
                          View all notifications
                        </Link>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={toggleProfile}
                  className="flex items-center gap-2 p-1.5 hover:bg-white/[0.04] rounded-xl transition-all group focus:outline-none focus:ring-2 focus:ring-cyan-500/20"
                  aria-label={`User menu for ${user.name}`}
                  aria-expanded={profileOpen}
                  aria-haspopup="true"
                >
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-cyan-500/10">
                      {user.name.charAt(0)}
                    </div>
                    {/* ✅ Status Dot Added Here */}
                   
                  </div>
                  
                  <ChevronDown
                    className={cn(
                      'hidden md:block w-3.5 h-3.5 text-white/30 transition-transform duration-300',
                      profileOpen && 'rotate-180'
                    )}
                    aria-hidden="true"
                  />
                </button>
                
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      className="absolute right-0 top-full mt-2 w-56 bg-[#0a0a10]/98 backdrop-blur-2xl rounded-2xl border border-white/[0.06] shadow-2xl shadow-black/40 overflow-hidden z-50"
                      role="menu"
                      aria-label="User menu"
                    >
                      {/* User info */}
                      <div className="p-4 border-b border-white/[0.04]">
                        <p className="text-white text-sm font-semibold">
                          {user.name}
                        </p>
                        <p className="text-white/30 text-[10px] mt-0.5">
                          {user.email}
                        </p>
                        <p className="text-cyan-400 text-[10px] mt-1 font-medium">
                          {user.role}
                        </p>
                      </div>
                      
                      {/* Menu items */}
                      <div className="p-1.5">
                        {PROFILE_MENU_ITEMS.map(({ icon: Icon, label, href }) => (
                          <Link
                            key={label}
                            to={href}
                            onClick={() => setProfileOpen(false)}
                            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-white/50 hover:text-white hover:bg-white/[0.04] rounded-lg text-xs transition-all"
                            role="menuitem"
                          >
                            <Icon className="w-3.5 h-3.5" aria-hidden="true" />
                            {label}
                          </Link>
                        ))}
                      </div>
                      
                      {/* Logout */}
                      <div className="p-1.5 border-t border-white/[0.04]">
                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2.5 text-red-400 hover:bg-red-500/10 rounded-lg text-xs transition-all"
                          role="menuitem"
                        >
                          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>
      
      {/* SEARCH OVERLAY */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[70] flex items-start justify-center pt-28 px-4"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-md"
              onClick={handleSearchClose}
              aria-hidden="true"
            />
            
            {/* Search dialog */}
            <motion.div
              initial={{ opacity: 0, y: -15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -15, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="relative w-full max-w-xl bg-[#0a0a10]/98 backdrop-blur-2xl rounded-2xl border border-white/[0.06] shadow-2xl shadow-black/40 overflow-hidden"
              role="dialog"
              aria-label="Search"
            >
              {/* Search input */}
              <div className="flex items-center gap-3 p-5">
                <Search className="w-5 h-5 text-white/30 shrink-0" aria-hidden="true" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anything... (doctors, hospitals, appointments)"
                  className="w-full bg-transparent text-white text-sm placeholder-white/20 outline-none"
                  autoFocus
                  aria-label="Search input"
                />
                <kbd className="flex-shrink-0 text-[10px] text-white/20 bg-white/[0.04] px-2 py-1 rounded-md font-mono border border-white/[0.04]">
                  ESC
                </kbd>
              </div>
              
              {/* Search results */}
              {searchQuery && (
                <div className="border-t border-white/[0.04] max-h-64 overflow-y-auto">
                  <div className="p-8 text-center">
                    <Search className="w-8 h-8 text-white/10 mx-auto mb-3" />
                    <p className="text-white/30 text-xs">
                      Type to search across the platform...
                    </p>
                  </div>
                </div>
              )}
              
              {/* Keyboard shortcuts */}
              <div className="border-t border-white/[0.04] p-3 flex items-center gap-4 text-[10px] text-white/15">
                <span className="flex items-center gap-1">
                  <ExternalLink className="w-3 h-3" aria-hidden="true" /> to navigate
                </span>
                <span className="flex items-center gap-1">
                  <Command className="w-3 h-3" aria-hidden="true" />K to open
                </span>
                <span>ESC to close</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Spacer for fixed navbar */}
      <div className={cn('transition-all duration-500', scrolled ? 'h-14' : 'h-[4.5rem]')} />
    </>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;