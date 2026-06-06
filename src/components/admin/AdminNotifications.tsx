import { getAuthToken } from '../../services/api';
// src/components/admin/AdminNotifications.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Bell, Shield, Settings, LogOut,
  LayoutDashboard, UserCheck, Building2, Pill, Stethoscope,
  AlertCircle, Calendar, Brain, BarChart3, FileText, DollarSign,
  Baby, Users, CheckCircle, XCircle,  Eye, Trash2,
  Info, AlertTriangle, Check, 
} from 'lucide-react';
import { Card } from 'src/ui/Card';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';

const mockNotifications = [
  { id: '1', type: 'info', title: 'New User Registration', message: 'John Doe registered as a patient', time: '5 min ago', read: false },
  { id: '2', type: 'warning', title: 'Doctor Verification', message: 'Dr. Smith needs license verification', time: '30 min ago', read: false },
  { id: '3', type: 'success', title: 'System Update Complete', message: 'Version 2.1.0 deployed successfully', time: '2 hours ago', read: true },
  { id: '4', type: 'error', title: 'Security Alert', message: 'Multiple failed login attempts detected', time: '3 hours ago', read: false },
  { id: '5', type: 'info', title: 'Appointment Reminder', message: '15 appointments scheduled for tomorrow', time: '4 hours ago', read: true },
  { id: '6', type: 'warning', title: 'Blood Bank Low', message: 'O- blood type running critically low', time: '5 hours ago', read: true },
  { id: '7', type: 'success', title: 'Payment Received', message: 'Payment of $450 confirmed from City Hospital', time: '6 hours ago', read: true },
  { id: '8', type: 'error', title: 'Server Warning', message: 'CPU usage exceeded 85% threshold', time: '8 hours ago', read: false },
];

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Stethoscope, label: 'Doctors', path: '/admin/doctor-verification' },
  { icon: UserCheck, label: 'Patients', path: '/admin/users' },
  { icon: Pill, label: 'Pharmacy', path: '/admin/pharmacy' },
  { icon: Building2, label: 'Hospitals', path: '/admin/hospitals' },
  { icon: Baby, label: 'Women Care', path: '/admin/women-care' },
  { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
  { icon: AlertCircle, label: 'Emergency', path: '/admin/emergency' },
  { icon: Brain, label: 'AI System', path: '/admin/ai-system' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: FileText, label: 'Reports', path: '/admin/reports' },
  { icon: DollarSign, label: 'Payments', path: '/admin/payments' },
  { icon: Bell, label: 'Notifications', path: '/admin/notifications', active: true },
  { icon: Shield, label: 'Security', path: '/admin/security' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const typeConfig: Record<string, { icon: any; color: string; bg: string }> = {
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
};

const AdminNotifications: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/admin/notifications`,
          { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch notifications:', err);
        setNotifications([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const filtered = filter === 'all' ? notifications : filter === 'unread' ? notifications.filter((n: any) => !n.is_read) : notifications.filter((n: any) => n.type === filter);
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  const markAllRead = () => setNotifications((prev: any[]) => prev.map((n: any) => ({ ...n, is_read: true })));

  return (
    <div className="min-h-screen bg-[#020408] flex">
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950/80 backdrop-blur-xl border-r border-white/[0.04] h-screen sticky top-0">
        <div className="p-6 border-b border-white/[0.04]">
          <Avatar name="AD" size="lg" className="ring-2 ring-amber-500/30" />
          <div className="mt-2"><h3 className="text-white font-bold text-sm">Admin</h3><p className="text-amber-400 text-xs">Super Admin</p></div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <motion.button key={link.path} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate(link.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${isActive ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'}`}>
                <Icon className="w-5 h-5" /> {link.label}
                {link.path === '/admin/notifications' && <Badge variant="danger" className="text-[9px] ml-auto">{unreadCount}</Badge>}
              </motion.button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/[0.04]">
          <Button variant="ghost" className="w-full text-slate-400 hover:text-red-400 justify-start"><LogOut className="w-4 h-4 mr-2" /> Sign Out</Button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <Bell className="w-8 h-8 text-cyan-400" /> Notifications
                  <Badge variant="danger" className="text-xs">{unreadCount} Unread</Badge>
                </h1>
                <p className="text-slate-400 text-sm mt-1">Manage system notifications and alerts</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" className="text-cyan-400" onClick={markAllRead}><Check className="w-4 h-4 mr-1" /> Mark All Read</Button>
              </div>
            </div>

            <div className="flex gap-3 mb-6 flex-wrap">
              {['all', 'unread', 'info', 'warning', 'success', 'error'].map(s => (
                <Button key={s} variant={filter === s ? 'primary' : 'ghost'} size="sm"
                  onClick={() => setFilter(s)} className={filter === s ? 'bg-cyan-500' : 'text-slate-400'}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              {filtered.map((n: any, i: number) => {
                const nType = n.type || 'info';
                const config = typeConfig[nType] || typeConfig.info;
                const Icon = config.icon;
                return (
                  <motion.div key={n.id || i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
                    <Card className={`p-4 hover:border-cyan-500/30 transition-all ${n.is_read ? '' : 'border-l-2 border-l-cyan-500 bg-cyan-500/3'}`}>
                      <div className="flex items-start gap-4">
                        <div className={`p-2.5 rounded-xl ${config.bg}`}><Icon className={`w-5 h-5 ${config.color}`} /></div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-white font-bold text-sm">{n.title || 'Notification'}</h4>
                              <p className="text-slate-400 text-xs mt-0.5">{n.body || n.message || ''}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-500">{n.created_at ? new Date(n.created_at).toLocaleTimeString() : ''}</span>
                              {!n.is_read && <div className="w-2 h-2 rounded-full bg-cyan-400" />}
                            </div>
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button variant="outline" size="xs" className="border-cyan-500/30 text-cyan-400"><Eye className="w-3 h-3 mr-1" /> View</Button>
                            <Button variant="ghost" size="xs" className="text-slate-500"><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminNotifications;