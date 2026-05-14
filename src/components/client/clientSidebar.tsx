// src/components/client/ClientSidebar.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Calendar, FileText, Droplets,
  AlertCircle, Pill, Activity, Heart, Bell,
  Settings, LogOut, ChevronRight, Stethoscope,
  TrendingUp, Clock
} from 'lucide-react';

const menuItems = [
  { path: '/client/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/client/appointments', icon: Calendar, label: 'Appointments' },
  { path: '/client/health-records', icon: FileText, label: 'Health Records' },
  { path: '/client/blood-donation', icon: Droplets, label: 'Blood Donation' },
  { path: '/client/prescriptions', icon: Pill, label: 'Prescriptions' },
  { path: '/client/emergency', icon: AlertCircle, label: 'Emergency' },
  { path: '/client/recommendations', icon: Activity, label: 'Recommendations' },
  { path: '/client/profile', icon: Heart, label: 'My Profile' },
];

const ClientSidebar: React.FC = () => {
  const location = useLocation();

  return (
    <div className="w-64 h-screen bg-[#08080d] border-r border-white/[0.04] fixed left-0 top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.04]">
        <Link to="/client/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Client Panel</h1>
            <p className="text-white/30 text-xs">Healthcare Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          return (
            <Link key={item.path} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-cyan-500/10 border border-cyan-500/20 text-cyan-400'
                    : 'text-white/40 hover:text-white/70 hover:bg-white/[0.03] border border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-cyan-400' : ''}`} />
                <span className="text-sm font-medium flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-4 h-4" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Notifications */}
      <div className="p-4 border-t border-white/[0.04]">
        <motion.button
          whileHover={{ scale: 1.02 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-white/50 hover:text-white/70 hover:bg-white/[0.04] transition-all"
        >
          <Bell className="w-5 h-5" />
          <span className="text-sm font-medium">Notifications</span>
          <span className="ml-auto w-5 h-5 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
            3
          </span>
        </motion.button>

        <Link to="/settings">
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 px-4 py-3 text-white/30 hover:text-white/60 transition-all mt-1"
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </motion.div>
        </Link>

        <Link to="/logout">
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-3 px-4 py-3 text-red-400/50 hover:text-red-400 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">Logout</span>
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default ClientSidebar;