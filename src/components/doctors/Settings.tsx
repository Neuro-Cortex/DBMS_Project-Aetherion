// src/components/doctors/Settings.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Eye, Globe,  Save } from 'lucide-react';
import { Card } from 'src/ui/Card';
import { Button } from 'src/ui/Button';

const Settings: React.FC = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  return (
    <div className="min-h-screen bg-[#030508]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-slate-400" /> Settings
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage your preferences</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <h2 className="text-white font-bold flex items-center gap-2"><Bell className="w-5 h-5 text-amber-400" /> Notifications</h2>
            <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
              <span className="text-slate-300 text-sm">Email Notifications</span>
              <button onClick={() => setNotifications(!notifications)} className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
              <span className="text-slate-300 text-sm">Dark Mode</span>
              <button onClick={() => setDarkMode(!darkMode)} className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-white font-bold flex items-center gap-2"><Shield className="w-5 h-5 text-red-400" /> Security</h2>
            <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
              <span className="text-slate-300 text-sm">Two-Factor Authentication</span>
              <button onClick={() => setTwoFactor(!twoFactor)} className={`w-12 h-6 rounded-full transition-colors ${twoFactor ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${twoFactor ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
              <span className="text-slate-300 text-sm">Login Alerts</span>
              <span className="text-emerald-400 text-xs font-medium">Active</span>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-white font-bold flex items-center gap-2"><Globe className="w-5 h-5 text-blue-400" /> Language & Region</h2>
            <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
              <span className="text-slate-300 text-sm">Language</span>
              <span className="text-white text-sm">English (US)</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
              <span className="text-slate-300 text-sm">Time Zone</span>
              <span className="text-white text-sm">Asia/Dhaka (UTC+6)</span>
            </div>
          </Card>

          <Card className="p-6 space-y-4">
            <h2 className="text-white font-bold flex items-center gap-2"><Eye className="w-5 h-5 text-purple-400" /> Privacy</h2>
            <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
              <span className="text-slate-300 text-sm">Profile Visibility</span>
              <span className="text-emerald-400 text-xs font-medium">Public</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-white/[0.06]">
              <span className="text-slate-300 text-sm">Show Online Status</span>
              <span className="text-emerald-400 text-xs font-medium">Yes</span>
            </div>
          </Card>
        </div>

        <div className="flex justify-end">
          <Button variant="primary" className="bg-emerald-500 hover:bg-emerald-600 gap-2">
            <Save className="w-4 h-4" /> Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;