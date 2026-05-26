// src/components/admin/AdminAppointments.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Calendar, Users, Shield, Settings, LogOut,  Bell,
  LayoutDashboard, UserCheck, Building2, Pill,
  AlertCircle, Brain, BarChart3, FileText, DollarSign,
  Stethoscope, Baby, Eye,  Clock, Phone, Video, MapPin
} from 'lucide-react';
import { Card } from 'src/ui/Card';

import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';

const mockAppointments = Array.from({ length: 12 }, (_, i) => ({
  id: `apt-${i + 1}`,
  patient: `Patient ${i + 1}`,
  doctor: `Dr. ${['Sarah Wilson', 'James Lee', 'Emily Chen', 'Michael Park', 'Lisa Anderson'][i % 5]}`,
  specialization: ['Cardiology', 'Neurology', 'Pediatrics', 'Dermatology', 'Orthopedics'][i % 5],
  date: `2024-${String(Math.floor(i / 4) + 1).padStart(2, '0')}-${String(10 + i).padStart(2, '0')}`,
  time: `${8 + (i % 8)}:00 ${i % 2 === 0 ? 'AM' : 'PM'}`,
  status: ['confirmed', 'pending', 'completed', 'cancelled'][i % 4] as 'confirmed' | 'pending' | 'completed' | 'cancelled',
  mode: (['in-person', 'video', 'phone'] as const)[i % 3],
  fee: `${150 + i * 10}`,
}));

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Stethoscope, label: 'Doctors', path: '/admin/doctor-verification' },
  { icon: UserCheck, label: 'Patients', path: '/admin/users' },
  { icon: Pill, label: 'Pharmacy', path: '/admin/pharmacy' },
  { icon: Building2, label: 'Hospitals', path: '/admin/hospitals' },
  { icon: Baby, label: 'Women Care', path: '/admin/women-care' },
  { icon: Calendar, label: 'Appointments', path: '/admin/appointments', active: true },
  { icon: AlertCircle, label: 'Emergency', path: '/admin/emergency' },
  { icon: Brain, label: 'AI System', path: '/admin/ai-system' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: FileText, label: 'Reports', path: '/admin/reports' },
  { icon: DollarSign, label: 'Payments', path: '/admin/payments' },
  { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
  { icon: Shield, label: 'Security', path: '/admin/security' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const statusVariants: Record<string, 'success' | 'warning' | 'info' | 'danger'> = {
  confirmed: 'success', pending: 'warning', completed: 'info', cancelled: 'danger',
};

const AdminAppointments: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? mockAppointments : mockAppointments.filter(a => a.status === filter);

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
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3 mb-2">
              <Calendar className="w-8 h-8 text-cyan-400" /> Appointment Management
            </h1>
            <p className="text-slate-400 text-sm mb-6">View and manage all appointments across the system</p>

            <div className="flex gap-3 mb-6 flex-wrap">
              {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map(s => (
                <Button key={s} variant={filter === s ? 'primary' : 'ghost'} size="sm"
                  onClick={() => setFilter(s)} className={filter === s ? 'bg-cyan-500' : 'text-slate-400'}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-3">
              {filtered.map((apt, i) => (
                <motion.div key={apt.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card className="p-4 hover:border-cyan-500/30 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar name={apt.patient} size="md" />
                        <div>
                          <p className="text-white font-bold">{apt.patient}</p>
                          <p className="text-xs text-cyan-400">{apt.doctor} • {apt.specialization}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {apt.date}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {apt.time}</span>
                            <span className="flex items-center gap-1">{apt.mode === 'video' ? <Video className="w-3 h-3" /> : apt.mode === 'phone' ? <Phone className="w-3 h-3" /> : <MapPin className="w-3 h-3" />} {apt.mode}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={statusVariants[apt.status]} className="text-[10px]">{apt.status}</Badge>
                        <span className="text-white font-bold">${apt.fee}</span>
                        <Button variant="outline" size="xs" className="border-cyan-500/30"><Eye className="w-3.5 h-3.5" /></Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminAppointments;