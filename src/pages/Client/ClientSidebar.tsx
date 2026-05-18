// src/components/client/ClientSidebar.tsx
// PROFESSIONAL INDUSTRY-STANDARD CLIENT SIDEBAR
// All Common Components Used | Glassmorphic | Animated

import React, { useState } from 'react';
import {
  Layout, User, Calendar, Pill, Droplet,
  AlertCircle, FileText, Activity, Syringe,
  Stethoscope, Search, MapPin, ShoppingBag,
  Heart, Star, Settings, LogOut, ChevronRight,
  ChevronLeft, Bell, MessageCircle, Video,
  ClipboardList, TrendingUp, Award,
  Home, CreditCard, Gift, HelpCircle,
  Moon, Sun, Zap, Shield
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';















// ============================================
// COMMON COMPONENTS
// ============================================
import { Avatar } from 'src/ui/Avatar';
import { Badge } from 'src/ui/Badge';
import { Button } from 'src/ui/Button';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';















// ============================================
// TYPES
// ============================================

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: number;
  badgeVariant?: 'danger' | 'warning' | 'info' | 'success';
  section?: string;
  isActive?: boolean;
  isNew?: boolean;
}

interface UserInfo {
  name: string;
  email: string;
  avatar?: string;
  role: string;
  isOnline: boolean;
  isVerified: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const ClientSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const user: UserInfo = {
    name: 'John Doe',
    email: 'john.doe@email.com',
    role: 'Client',
    isOnline: true,
    isVerified: true
  };

  const navItems: NavItem[] = [
    // MAIN
    { id: 'dashboard', label: 'Dashboard', icon: <Home className="w-5 h-5" />, path: '/client/dashboard', section: 'MAIN', isActive: true },
    { id: 'profile', label: 'My Profile', icon: <User className="w-5 h-5" />, path: '/client/profile', section: 'MAIN' },
    
    // HEALTHCARE
    { id: 'appointments', label: 'Appointments', icon: <Calendar className="w-5 h-5" />, path: '/client/appointments', badge: 2, badgeVariant: 'info', section: 'HEALTHCARE' },
    { id: 'prescriptions', label: 'Prescriptions', icon: <Pill className="w-5 h-5" />, path: '/client/prescriptions', badge: 3, badgeVariant: 'warning', section: 'HEALTHCARE' },
    { id: 'health-records', label: 'Health Records', icon: <FileText className="w-5 h-5" />, path: '/client/health-records', section: 'HEALTHCARE' },
    { id: 'reports', label: 'Medical Reports', icon: <ClipboardList className="w-5 h-5" />, path: '/client/reports', section: 'HEALTHCARE', isNew: true },
    { id: 'vaccines', label: 'Vaccine Records', icon: <Syringe className="w-5 h-5" />, path: '/client/vaccines', section: 'HEALTHCARE' },
    { id: 'physiotherapy', label: 'Physiotherapy', icon: <Activity className="w-5 h-5" />, path: '/client/physiotherapy', section: 'HEALTHCARE' },
    
    // SERVICES
    { id: 'doctors', label: 'Find Doctors', icon: <Search className="w-5 h-5" />, path: '/client/doctor-comparison', section: 'SERVICES' },
    { id: 'nearby-donors', label: 'Nearby Donors', icon: <MapPin className="w-5 h-5" />, path: '/client/nearby-donors', section: 'SERVICES' },
    { id: 'blood-donation', label: 'Blood Donation', icon: <Droplet className="w-5 h-5" />, path: '/client/blood-donation', section: 'SERVICES' },
    { id: 'orders', label: 'My Orders', icon: <ShoppingBag className="w-5 h-5" />, path: '/client/orders', badge: 1, badgeVariant: 'success', section: 'SERVICES' },
    { id: 'emergency', label: 'Emergency', icon: <AlertCircle className="w-5 h-5" />, path: '/client/emergency', section: 'SERVICES' },
    
    // WELLNESS
    { id: 'recommendations', label: 'Health Tips', icon: <Award className="w-5 h-5" />, path: '/client/recommendations', section: 'WELLNESS' },
    { id: 'women-care', label: 'Women Care', icon: <Heart className="w-5 h-5" />, path: '/women-care', section: 'WELLNESS' },
  ];

  const isActive = (path: string) => location.pathname === path;

  const groupedItems = navItems.reduce((acc, item) => {
    const section = item.section || 'OTHER';
    if (!acc[section]) acc[section] = [];
    acc[section].push(item);
    return acc;
  }, {} as Record<string, NavItem[]>);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`relative h-screen flex flex-col transition-all duration-500 ease-in-out ${
        isExpanded ? 'w-72' : 'w-20'
      } ${darkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'} border-r shadow-2xl z-40`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ============================================ */}
      {/* ANIMATED BACKGROUND GRADIENT */}
      {/* ============================================ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className={`absolute -right-4 top-24 w-8 h-8 rounded-full flex items-center justify-center shadow-lg z-20 border ${
          darkMode ? 'bg-gray-800 border-gray-700 text-gray-400' : 'bg-white border-gray-200 text-gray-600'
        } hover:shadow-xl transition-all`}
      >
        {isExpanded ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </motion.button>

      {/* ============================================ */}
      {/* LOGO SECTION */}
      {/* ============================================ */}
      <div className="p-5 border-b border-gray-100 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 10, scale: 1.1 }}
            className="w-11 h-11 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-purple-500/20"
          >
            <Heart className="w-6 h-6 text-white" />
          </motion.div>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Aetherion
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Healthcare Portal</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ============================================ */}
      {/* USER PROFILE CARD */}
      {/* ============================================ */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <GlassmorphicCard className="p-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar
                src={user.avatar}
                name={user.name}
                size="md"
                status={user.isOnline ? 'online' : 'offline'}
              />
              {user.isVerified && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white"
                >
                  <Shield className="w-2.5 h-2.5 text-white" />
                </motion.div>
              )}
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="flex-1 min-w-0"
                >
                  <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="success" size="xs">● Online</Badge>
                    <Badge variant="info" size="xs">{user.role}</Badge>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </GlassmorphicCard>
      </div>

      {/* ============================================ */}
      {/* NAVIGATION */}
      {/* ============================================ */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-4 space-y-5 custom-scrollbar">
        {Object.entries(groupedItems).map(([section, items]) => (
          <div key={section}>
            <AnimatePresence>
              {isExpanded && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-[0.15em] mb-2 px-3"
                >
                  {section}
                </motion.p>
              )}
            </AnimatePresence>
            
            <div className="space-y-1">
              {items.map((item) => {
                const active = isActive(item.path);
                
                return (
                  <motion.button
                    key={item.id}
                    whileHover={{ x: isExpanded ? 4 : 0, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group relative ${
                      active
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-purple-500/20 font-medium'
                        : darkMode
                          ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    title={!isExpanded ? item.label : ''}
                  >
                    {/* Active Indicator */}
                    {active && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}

                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                      <motion.div
                        animate={active ? { rotate: [0, -10, 10, 0] } : {}}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        {item.icon}
                      </motion.div>
                      
                      {/* Badge on Icon */}
                      {item.badge && item.badge > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg shadow-red-500/30 px-1"
                        >
                          {item.badge}
                        </motion.span>
                      )}
                    </div>

                    {/* Label */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, x: -5 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -5 }}
                          className="flex-1 flex items-center justify-between"
                        >
                          <span className="text-left">{item.label}</span>
                          
                          <div className="flex items-center gap-2">
                            {item.isNew && (
                              <Badge variant="info" size="xs">New</Badge>
                            )}
                            {item.badge && item.badge > 0 && (
                              <Badge variant={item.badgeVariant || 'danger'} size="xs">
                                {item.badge}
                              </Badge>
                            )}
                            {active && (
                              <motion.div
                                initial={{ x: -5, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                              >
                                <ChevronRight className="w-4 h-4" />
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tooltip for collapsed */}
                    {!isExpanded && isHovered && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="absolute left-full ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg shadow-xl whitespace-nowrap z-50"
                      >
                        {item.label}
                        {item.badge && (
                          <span className="ml-2 text-red-400">({item.badge})</span>
                        )}
                      </motion.div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* ============================================ */}
      {/* BOTTOM ACTIONS */}
      {/* ============================================ */}
      <div className={`p-3 border-t space-y-2 ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
        {/* Dark Mode Toggle */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setDarkMode(!darkMode)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
            darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          {darkMode ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
          {isExpanded && <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>}
        </motion.button>

        {/* Settings */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
            darkMode ? 'text-gray-400 hover:bg-gray-800 hover:text-white' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <Settings className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span>Settings</span>}
        </motion.button>

        {/* Logout */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
            darkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span>Logout</span>}
        </motion.button>

        {/* Help */}
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="pt-2 border-t border-gray-100 dark:border-gray-800"
          >
            <Button variant="ghost" size="sm" className="w-full justify-start text-gray-400 text-xs">
              <HelpCircle className="w-4 h-4 mr-2" /> Help & Support
            </Button>
          </motion.div>
        )}
      </div>

      {/* ============================================ */}
      {/* VERSION */}
      {/* ============================================ */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-4 py-2 text-center"
          >
            <p className="text-[10px] text-gray-400 dark:text-gray-600">v2.1.0 • © 2025 Aetherion</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ClientSidebar;