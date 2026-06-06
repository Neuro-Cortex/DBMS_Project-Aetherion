// src/components/layout/Navbar.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation, NavLink } from 'react-router-dom';
import { useAppSelector, useAppDispatch, RootState } from 'src/store';


import {
  Menu, X, ChevronDown, Bell, LogOut, User, Settings,
  LayoutDashboard, Activity, Building2, Pill, Search, Calendar, FileText, MessageCircle, Globe, Sun, Moon, CreditCardIcon, BellOff, AlertCircle,
  HelpCircle,
  Lock,
  Stethoscope,
  Bot,
  Heart,
  Droplet
} from 'lucide-react';

import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';
import { logout } from '../../store/slices/authSlice';
import { searchService, SearchResult } from '../../services/searchService';









interface NavbarProps {
  transparent?: boolean;
  variant?: 'default' | 'glass' | 'solid' | 'gradient';
  showSearch?: boolean;
  showNotifications?: boolean;
  showLanguageSelector?: boolean;
  showThemeToggle?: boolean;
  position?: 'fixed' | 'sticky' | 'relative';
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'emergency';
  timestamp: Date;
  read: boolean;
  link?: string;
  icon?: React.ReactNode;
}

type SearchCategory = 'all' | 'doctor' | 'hospital' | 'medicine';








export const Navbar: React.FC<NavbarProps> = ({ 
  transparent = false, 
  variant = 'default',
  showSearch = true,
  showNotifications = true,
  showThemeToggle = true,
  position = 'fixed'
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchCategory, setSearchCategory] = useState<SearchCategory>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'dark';
  });
  const [language, setLanguage] = useState('en');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const searchRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Safe Redux access
  const authState = useAppSelector((state: RootState) => state.auth);
  const user = authState?.user || null;
  const isAuthenticated = authState?.isAuthenticated || false;

  // Theme management
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);










  // Scroll handler
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // User location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }, []);

  // Click outside handlers
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
        setSearchQuery('');
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const fetchNotifications = async () => {
    // Mock notifications - replace with API call
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Emergency Alert',
        message: 'Code Blue - ICU Room 302',
        type: 'emergency',
        timestamp: new Date(),
        read: false,
        icon: <AlertCircle className="w-4 h-4" />
      },
      {
        id: '2',
        title: 'Appointment Reminder',
        message: 'You have a doctor appointment tomorrow at 10:00 AM',
        type: 'info',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        icon: <Calendar className="w-4 h-4" />
      },
      

    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  };

  // Search functionality
  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      let results: SearchResult[];

      switch (searchCategory) {
        case 'doctor':
          results = await searchService.searchDoctors(query, userLocation || undefined);
          break;
        case 'hospital':
          results = await searchService.searchHospitals(query, userLocation || undefined);
          break;
        case 'medicine':
          results = await searchService.searchMedicines(query);
          break;
        default:
          results = await searchService.globalSearch(query, userLocation || undefined);
      }

      setSearchResults(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchCategory, userLocation]);

  const navLinks = [
    { label: 'Doctors', path: '/doctor', icon: Stethoscope },
    { label: 'Hospital', path: '/hospital', icon: Building2 },
    { label: 'Medicine', path: '/pharmacy', icon: Pill },
    { label: 'Women Care', path: '/women-care', icon: Heart },
    { label: 'Blood Donor', path: '/blood-donors', icon: Droplet },
    { label: 'AI Assistant', path: '/ai-assistant', icon: Bot },
  ];

  const getAuthenticatedLinks = () => {
    const primaryRole = user?.role || user?.primaryRole || 'patient';
    
    const roleLinks: Record<string, { label: string; path: string; icon: React.ElementType }[]> = {
      patient: [
        { label: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
        { label: 'Appointments', path: '/patient/appointments', icon: Calendar },
        { label: 'Messages', path: '/patient/messages', icon: MessageCircle },
        { label: 'Health Records', path: '/patient/records', icon: FileText },
        { label: 'Billing', path: '/patient/billing', icon: CreditCardIcon }
      ],
      doctor: [
        { label: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
        { label: 'Appointments', path: '/doctor/appointments', icon: Calendar },
        { label: 'Patients', path: '/doctor/patients', icon: User },
        { label: 'Schedule', path: '/doctor/schedule', icon: Calendar },
        { label: 'Messages', path: '/doctor/messages', icon: MessageCircle },
      ],
      hospital: [
        { label: 'Dashboard', path: '/hospital/dashboard', icon: LayoutDashboard },
        { label: 'Account', path: '/hospital/account', icon: Settings },
        { label: 'Admin', path: '/hospital/admin', icon: Building2 },
      ],
      pharmacy: [
        { label: 'Dashboard', path: '/pharmacy/dashboard', icon: LayoutDashboard },
        { label: 'Account', path: '/pharmacy/account', icon: Settings },
        { label: 'Stock', path: '/pharmacy/stock', icon: FileText },
      ],
      admin: [
        { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Users', path: '/admin/users', icon: User },
        { label: 'Doctors', path: '/admin/doctor-verification', icon: Stethoscope },
        { label: 'Hospitals', path: '/admin/hospitals', icon: Building2 },
        { label: 'Analytics', path: '/admin/analytics', icon: FileText },
      ],
    };

    return roleLinks[primaryRole] || roleLinks['patient'];
  };

  const handleNavigate = (path: string) => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
    setNotificationOpen(false);
    setSearchOpen(false);
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      handleNavigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const getVariantClasses = () => {
    if (variant === 'glass') {
      return 'bg-white/10 dark:bg-slate-900/20 backdrop-blur-xl border border-white/20';
    }
    if (variant === 'solid') {
      return 'bg-white dark:bg-slate-900 shadow-lg';
    }
    if (variant === 'gradient') {
      return 'bg-gradient-to-r from-blue-600 to-teal-600';
    }
    if (transparent && !isScrolled) {
      return 'bg-transparent';
    }
    return 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-white/10';
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Sun className="w-4 h-4" />;
    return <Moon className="w-4 h-4" />;
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`
          ${position}
          top-0 left-0 right-0 z-[999]
          transition-all duration-500
          ${getVariantClasses()}
        `}
      >
        <div className="w-full px-0">
          <div className="flex items-center justify-between h-16 lg:h-20 2xl:h-24 pl-1 sm:pl-2 lg:pl-4 pr-4 sm:pr-6 lg:pr-8 2xl:pr-12">

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2 group" aria-label="Home">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6 text-white" />
              </div>
              <span className="hidden sm:inline text-2xl lg:text-3xl 2xl:text-4xl font-bold bg-gradient-to-r from-blue-500 to-teal-500 bg-clip-text text-transparent">
                HealthCare+
              </span>
            </Link>

            {/* DESKTOP MENU */}
            <div className="hidden md:flex items-center gap-4 lg:gap-6 2xl:gap-8">
              {navLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) => `
                      relative flex items-center gap-1.5 px-1.5 lg:px-2 py-1.5 rounded-lg text-[9px] lg:text-[11px] font-medium transition-all
                      ${isActive
                        ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10'
                        : 'text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/5'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </NavLink>
                );
              }              )}
            </div>

            {/* RIGHT SIDE */}
            <div className="flex items-center gap-4 sm:gap-5 lg:gap-6 2xl:gap-8">

              {/* SEARCH */}
              {showSearch && (
                <div className="relative" ref={searchRef}>
                  <button 
                    onClick={() => setSearchOpen(!searchOpen)}
                    className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5 text-gray-600 dark:text-slate-300" />
                  </button>









                  <AnimatePresence>
                    {searchOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 top-12 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 p-4 z-50"
                      >
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <input
                            type="text"
                            placeholder="Search doctors, hospitals, medicines..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-xl bg-gray-100 dark:bg-white/5 border-0 focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white placeholder-gray-500"
                            autoFocus
                          />
                          {searchQuery && (
                            <button
                              onClick={() => { setSearchQuery(''); setSearchResults([]); }}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                            </button>
                          )}
                        </div>

                        {/* Category Tabs */}
                        <div className="flex gap-1 mt-3">
                          {([
                            { key: 'all', label: 'All', icon: Search },
                            { key: 'doctor', label: 'Doctors', icon: Stethoscope },
                            { key: 'hospital', label: 'Hospitals', icon: Building2 },
                            { key: 'medicine', label: 'Medicine', icon: Pill },
                          ] as const).map(({ key, label, icon: TabIcon }) => (
                            <button
                              key={key}
                              onClick={() => { setSearchCategory(key); if (searchQuery) handleSearch(searchQuery); }}
                              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                searchCategory === key
                                  ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400'
                                  : 'text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-white/5'
                              }`}
                            >
                              <TabIcon className="w-3 h-3" />
                              {label}
                            </button>
                          ))}
                        </div>

                        {isSearching ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent" />
                          </div>
                        ) : searchResults.length > 0 ? (
                          <div className="mt-3 space-y-2 max-h-96 overflow-y-auto">
                            {searchResults.map((result) => {
                              const typeIcon = result.type === 'doctor' ? <Stethoscope className="w-4 h-4" />
                                : result.type === 'hospital' ? <Building2 className="w-4 h-4" />
                                : <Pill className="w-4 h-4" />;
                              const typeBg = result.type === 'doctor' ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : result.type === 'hospital' ? 'bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                : 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400';

                              return (
                                <button
                                  key={result.id}
                                  onClick={() => handleNavigate(result.link)}
                                  className="w-full flex items-start gap-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-left"
                                >
                                  <div className={`p-2 rounded-lg ${typeBg}`}>
                                    {typeIcon}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                      {result.title}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                                      {result.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${typeBg}`}>
                                        {result.type}
                                      </span>
                                      {result.rating && (
                                        <span className="text-[10px] text-yellow-600 dark:text-yellow-400">⭐ {result.rating}</span>
                                      )}
                                      {result.distance && (
                                        <span className="text-[10px] text-gray-400">📍 {result.distance}</span>
                                      )}
                                      {result.price && (
                                        <span className="text-[10px] text-green-600 dark:text-green-400">{result.price}</span>
                                      )}
                                    </div>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : searchQuery && (
                          <div className="text-center py-8">
                            <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-500 dark:text-slate-400">No results found</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}












              {/* Theme Toggle */}
              {showThemeToggle && (
                <button
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                  aria-label="Toggle theme"
                >
                  {getThemeIcon()}
                </button>
              )}























              {isAuthenticated ? (
                <>
                  {/* NOTIFICATIONS */}
                  {showNotifications && (
                    <div className="relative" ref={notificationRef}>
                      <button 
                        onClick={() => setNotificationOpen(!notificationOpen)}
                        className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all relative"
                        aria-label="Notifications"
                      >
                        <Bell className="w-5 h-5 text-gray-600 dark:text-slate-300" />
                        {unreadCount > 0 && (
                          <span className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold px-1">
                            {unreadCount > 9 ? '9+' : unreadCount}
                          </span>
                        )}
                      </button>

                      <AnimatePresence>
                        {notificationOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 top-12 w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden z-50"
                          >
                            <div className="p-4 border-b border-gray-200 dark:border-white/10">
                              <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                  Notifications
                                </h3>
                                {unreadCount > 0 && (
                                  <button
                                    onClick={markAllAsRead}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                                  >
                                    Mark all as read
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                              {notifications.length === 0 ? (
                                <div className="text-center py-8">
                                  <BellOff className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                  <p className="text-gray-500 dark:text-slate-400">
                                    No notifications
                                  </p>
                                </div>
                              ) : (
                                notifications.map((notification) => (
                                  <button
                                    key={notification.id}
                                    onClick={() => {
                                      markNotificationAsRead(notification.id);
                                      if (notification.link) {
                                        handleNavigate(notification.link);
                                      }
                                      setNotificationOpen(false);
                                    }}
                                    className={`w-full flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-all text-left border-b border-gray-200 dark:border-white/10
                                      ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-500/5' : ''}
                                    `}
                                  >
                                    <div className={`
                                      p-2 rounded-lg
                                      ${notification.type === 'emergency' ? 'bg-red-100 dark:bg-red-500/10' :
                                        notification.type === 'success' ? 'bg-green-100 dark:bg-green-500/10' :
                                        notification.type === 'warning' ? 'bg-yellow-100 dark:bg-yellow-500/10' :
                                        'bg-blue-100 dark:bg-blue-500/10'
                                      }
                                    `}>
                                      {notification.icon}
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {notification.title}
                                      </p>
                                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-0.5">
                                        {notification.message}
                                      </p>
                                      <p className="text-[10px] text-gray-400 mt-1">
                                        {new Date(notification.timestamp).toLocaleString()}
                                      </p>
                                    </div>
                                    {!notification.read && (
                                      <div className="w-2 h-2 rounded-full bg-blue-600" />
                                    )}
                                  </button>
                                ))
                              )}
                            </div>

                            <div className="p-4 border-t border-gray-200 dark:border-white/10">
                              <button
                                onClick={() => handleNavigate('/notifications')}
                                className="w-full py-2 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-slate-300 text-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                              >
                                View All Notifications
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}

                  {/* Authenticated Links - Desktop */}
                  <div className="hidden xl:flex items-center gap-1">
                    {getAuthenticatedLinks().map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.path}
                          onClick={() => handleNavigate(item.path)}
                          className="relative flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                        >
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* PROFILE DROPDOWN */}
                  <div className="relative" ref={profileRef}>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                    >
                      <Avatar 
                        name={user?.name || 'User'} 
                        size="sm"
                        src={user?.profileImage}
                      />
                      <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-slate-300 hidden sm:block transition-transform ${profileDropdownOpen ? 'rotate-180' : ''}`} />
                    </button>

                    <AnimatePresence>
                      {profileDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          className="absolute right-0 top-12 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-white/10 overflow-hidden z-50"
                        >
                          <div className="p-4 border-b border-gray-200 dark:border-white/10">
                            <div className="flex items-center gap-3">
                            <Avatar name={user?.name || 'User'} size="md" src={user?.profileImage} />
                              <div>
                                <p className="text-gray-900 dark:text-white font-semibold">
                                  {user?.name || 'User'}
                                </p>
                                <p className="text-gray-500 dark:text-slate-400 text-xs">
                                  {user?.email || 'user@email.com'}
                                </p>
                                {user?.role && (
                                  <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-medium bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-full">
                                    {user.role}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-2">
                            <div className="mb-2">
                              <p className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                                Account
                              </p>
                              <button 
                                onClick={() => handleNavigate('/profile')}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm"
                              >
                                <User className="w-4 h-4" /> Profile
                              </button>
                              <button 
                                onClick={() => handleNavigate('/settings')}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm"
                              >
                                <Settings className="w-4 h-4" /> Settings
                              </button>
                              <button 
                                onClick={() => handleNavigate('/security')}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm"
                              >
                                <Lock className="w-4 h-4" /> Security
                              </button>
                            </div>

                            <div className="mb-2 pt-2 border-t border-gray-200 dark:border-white/10">
                              <p className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                                Support
                              </p>
                              <button 
                                onClick={() => handleNavigate('/help')}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm"
                              >
                                <HelpCircle className="w-4 h-4" /> Help Center
                              </button>
                              <button 
                                onClick={() => handleNavigate('/feedback')}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-sm"
                              >
                                <MessageCircle className="w-4 h-4" /> Send Feedback
                              </button>
                            </div>
                            
                            <div className="pt-2 border-t border-gray-200 dark:border-white/10">
                              <button 
                                onClick={handleLogout}
                                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all text-sm font-medium"
                              >
                                <LogOut className="w-4 h-4" /> Sign Out
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              ) : (
                <>
               
               
               
               
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleNavigate('/login')}
                    className="hidden sm:flex text-gray-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400"
                  >
               
               
               
                    Sign In
                  </Button>
                  
                  <Button 
                    variant="primary" 
                    size="sm" 
                    onClick={() => handleNavigate('/register')}
                    className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white font-semibold"
                  >
                    Get Started
                  </Button>
                </>
              )}













































              {/* MOBILE MENU TOGGLE */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 transition-all"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5 text-gray-900 dark:text-white" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-900 dark:text-white" />
                )}
              </button>
            </div>
          </div>
        </div>














































        {/* MOBILE MENU */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
               className="md:hidden bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-white/10 overflow-hidden"
            >
              <div className="p-4 space-y-2 max-h-[calc(100vh-64px)] overflow-y-auto">
                {/* Main Navigation */}
                <div className="space-y-1">
                  <p className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Main Menu
                  </p>
                  {navLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all
                          ${isActive
                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5'
                          }`}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </Link>
                    );
                  })}
                </div>





























                {/* Authenticated Links for Mobile */}
                {isAuthenticated && (
                  <div className="space-y-1 pt-3">
                    <p className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                      Your Account
                    </p>
                    {getAuthenticatedLinks().map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 text-sm"
                        >
                          <Icon className="w-5 h-5" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                )}

































                {/* Mobile Auth Buttons */}
                <div className="border-t border-gray-200 dark:border-white/10 pt-4 mt-4 space-y-2">
                  {isAuthenticated ? (
                    <>
                      <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-white/5 rounded-xl">
                        <Avatar name={user?.name || 'User'} size="sm" src={user?.profileImage} />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-slate-400">
                            {user?.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-medium"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-3 rounded-xl text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 text-sm"
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full text-center px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 text-white text-sm font-semibold"
                      >
                        Get Started
                      </Link>
                    </>
                  )}
                </div>

                {/* Theme and Language Toggles for Mobile */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-white/10">
                  <button
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 text-sm"
                  >
                    {getThemeIcon()}
                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  
                  <button
                    onClick={() => setLanguage(lang => lang === 'en' ? 'es' : 'en')}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-white/5 text-sm"
                  >
                    <Globe className="w-4 h-4" />
                    {language === 'en' ? 'English' : 'Español'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/50 z-[998] md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
};