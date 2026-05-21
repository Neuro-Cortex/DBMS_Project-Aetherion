// src/components/layout/Navbar.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Menu, X, ChevronDown, Bell, Settings, User, LogOut,
  LayoutDashboard, Heart, Activity, Home, Phone, Info,
  Building2, Pill, Brain, Search
} from 'lucide-react';

import { Button } from 'src/ui/Button';


import  Badge  from 'src/ui/Badge';


import { Avatar } from 'src/ui/Avatar';

interface NavbarProps {
  transparent?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ transparent = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // SAFE Redux access
  const authState = useSelector((state: any) => state.auth || null);
  const user = authState?.user || null;
  const isAuthenticated = authState?.isAuthenticated || false;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'About', path: '/about', icon: Info },
    { label: 'Contact', path: '/contact', icon: Phone },
    { label: 'Pharmacy', path: '/pharmacy', icon: Pill },
    { label: 'Hospitals', path: '/hospitals', icon: Building2 },
    { label: 'AI Assistant', path: '/ai-assistant', icon: Brain },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`
        fixed top-0 left-0 right-0 z-[999]
        transition-all duration-500
        ${transparent && !isScrolled
          ? 'bg-transparent'
          : 'bg-slate-900/80 backdrop-blur-xl border-b border-white/10 text-white'
        }
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
          </Link>

          {/* DESKTOP MENU */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all
                    ${isActive
                      ? 'bg-white/10 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3 relative">

            {/* SEARCH */}
            <button onClick={() => setSearchOpen(!searchOpen)}>
              <Search className="w-5 h-5 text-slate-300" />
            </button>

            {isAuthenticated ? (
              <>
                {/* NOTIFICATIONS */}
                <div className="relative">
                  <button onClick={() => setNotificationOpen(!notificationOpen)}>
                    <Bell className="w-5 h-5 text-slate-300" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white">
                      6
                    </span>
                  </button>

                  <AnimatePresence>
                    {notificationOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-12 w-80 bg-slate-900 border border-white/10 rounded-2xl p-4"
                      >
                        <h3 className="text-white font-semibold mb-3">Notifications</h3>
                        <p className="text-slate-400 text-sm">No new notifications</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* DASHBOARD */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="hidden md:flex"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>

                {/* PROFILE */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center gap-2"
                  >
                    <Avatar name={user?.name || 'User'} size="sm" />
                    <ChevronDown className="w-4 h-4 text-slate-300" />
                  </button>

                  <AnimatePresence>
                    {profileDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 top-12 w-56 bg-slate-900 border border-white/10 rounded-2xl p-2"
                      >
                        <button className="w-full text-left px-4 py-2 text-slate-300 hover:bg-white/5">
                          Profile
                        </button>
                        <button className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10">
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
                  Sign In
                </Button>
                <Button variant="primary" size="sm" onClick={() => navigate('/register')}>
                  Get Started
                </Button>
              </>
            )}

            {/* MOBILE MENU */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
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
            className="lg:hidden bg-slate-900 border-t border-white/10"
          >
            <div className="p-4 space-y-2">
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-slate-300 hover:bg-white/5 rounded-xl"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};