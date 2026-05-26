// src/components/admin/HospitalManagement.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Building2, Search, MapPin, Phone, Mail, Star,
  Users, Bed,  Shield, Settings,
  LogOut, Server, Bell, LayoutDashboard, UserCheck,
  Pill, AlertCircle, Calendar, Brain, BarChart3,
  FileText, DollarSign, Stethoscope, Baby, 
   CheckCircle,
   Eye,
   Edit3
   
} from 'lucide-react';
import { Card } from 'src/ui/Card';

import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Input } from 'src/ui/Input';

interface Hospital {
  id: string; name: string; city: string; rating: number;
  totalBeds: number; availableBeds: number; totalDoctors: number;
  phone: string; email: string; status: 'active' | 'inactive' | 'pending';
  type: 'Government' | 'Private' | 'Teaching';
  verified: boolean;
}

const mockHospitals: Hospital[] = [
  { id: '1', name: 'City General Hospital', city: 'New York', rating: 4.8, totalBeds: 500, availableBeds: 45, totalDoctors: 120, phone: '+1 (555) 123-4567', email: 'contact@citygeneral.com', status: 'active', type: 'Government', verified: true },
  { id: '2', name: 'Mercy Medical Center', city: 'Chicago', rating: 4.6, totalBeds: 350, availableBeds: 28, totalDoctors: 85, phone: '+1 (555) 234-5678', email: 'info@mercymed.com', status: 'active', type: 'Private', verified: true },
  { id: '3', name: 'University Health System', city: 'Boston', rating: 4.9, totalBeds: 650, availableBeds: 72, totalDoctors: 200, phone: '+1 (555) 345-6789', email: 'admin@univhealth.edu', status: 'active', type: 'Teaching', verified: true },
  { id: '4', name: 'St. Mary Hospital', city: 'San Francisco', rating: 4.5, totalBeds: 280, availableBeds: 15, totalDoctors: 65, phone: '+1 (555) 456-7890', email: 'contact@stmary.com', status: 'active', type: 'Private', verified: false },
  { id: '5', name: 'Valley Health Center', city: 'Denver', rating: 4.3, totalBeds: 200, availableBeds: 0, totalDoctors: 45, phone: '+1 (555) 567-8901', email: 'info@valleyhealth.com', status: 'inactive', type: 'Government', verified: true },
  { id: '6', name: 'Pacific Medical Institute', city: 'Los Angeles', rating: 4.7, totalBeds: 420, availableBeds: 38, totalDoctors: 150, phone: '+1 (555) 678-9012', email: 'admin@pacificmed.com', status: 'active', type: 'Private', verified: true },
];

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Stethoscope, label: 'Doctors', path: '/admin/doctor-verification' },
  { icon: UserCheck, label: 'Patients', path: '/admin/users' },
  { icon: Pill, label: 'Pharmacy', path: '/admin/pharmacy' },
  { icon: Building2, label: 'Hospitals', path: '/admin/hospitals', active: true },
  { icon: Baby, label: 'Women Care', path: '/admin/women-care' },
  { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
  { icon: AlertCircle, label: 'Emergency', path: '/admin/emergency' },
  { icon: Brain, label: 'AI System', path: '/admin/ai-system' },
  { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  { icon: FileText, label: 'Reports', path: '/admin/reports' },
  { icon: DollarSign, label: 'Payments', path: '/admin/payments' },
  { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
  { icon: Shield, label: 'Security', path: '/admin/security' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400', teal: 'bg-teal-500/10 text-teal-400',
  purple: 'bg-purple-500/10 text-purple-400', amber: 'bg-amber-500/10 text-amber-400',
  green: 'bg-green-500/10 text-green-400', red: 'bg-red-500/10 text-red-400',
  cyan: 'bg-cyan-500/10 text-cyan-400', emerald: 'bg-emerald-500/10 text-emerald-400',
  indigo: 'bg-indigo-500/10 text-indigo-400', slate: 'bg-slate-500/10 text-slate-400',
};

const HospitalManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredHospitals = mockHospitals.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(searchQuery.toLowerCase()) || h.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || h.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#020408] flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950/80 backdrop-blur-xl border-r border-white/[0.04] h-screen sticky top-0">
        <div className="p-6 border-b border-white/[0.04]">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-xl" />
              <Avatar name="AD" size="lg" className="relative ring-2 ring-amber-500/30" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Admin</h3>
              <p className="text-amber-400 text-xs">Super Admin</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <Badge variant="success" className="text-[10px] justify-center">🟢 Online</Badge>
            <Badge variant="info" className="text-[10px] justify-center">👑 Super Admin</Badge>
          </div>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <motion.button key={link.path} whileHover={{ x: 4 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate(link.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/20' : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}>
                <Icon className="w-5 h-5" /> {link.label}
              </motion.button>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/[0.04]">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2"><Server className="w-3.5 h-3.5 text-emerald-400" /><span>Uptime: 99.99%</span></div>
          <Button variant="ghost" className="w-full text-slate-400 hover:text-red-400 justify-start"><LogOut className="w-4 h-4 mr-2" /> Sign Out</Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                <Building2 className="w-8 h-8 text-purple-400" /> Hospital Management
              </h1>
              <p className="text-slate-400 text-sm mt-1">Manage all registered hospitals and medical centers</p>
            </div>
            <div className="flex items-center gap-3">
              <Input placeholder="Search hospitals..." leftIcon={Search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-56" />
              <Button variant="primary" className="bg-gradient-to-r from-purple-500 to-pink-500"><Building2 className="w-4 h-4 mr-1" /> Add Hospital</Button>
            </div>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Building2, label: 'Total Hospitals', value: mockHospitals.length, color: 'purple', change: '+3%' },
              { icon: Bed, label: 'Total Beds', value: mockHospitals.reduce((a, h) => a + h.totalBeds, 0).toLocaleString(), color: 'blue', change: '+5%' },
              { icon: Users, label: 'Total Doctors', value: mockHospitals.reduce((a, h) => a + h.totalDoctors, 0).toLocaleString(), color: 'teal', change: '+8%' },
              { icon: CheckCircle, label: 'Verified', value: mockHospitals.filter(h => h.verified).length, color: 'emerald', change: '+2%' },
            ].map((stat, i) => {
              const Icon = stat.icon;
              const [bg, text] = (colorMap[stat.color] || '').split(' ');
              return (
                <Card key={i} className="p-4 text-center">
                  <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3`}><Icon className={`w-5 h-5 ${text}`} /></div>
                  <p className="text-2xl font-black text-white">{stat.value}</p>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="text-[10px] mt-1 font-bold text-emerald-400">↑ {stat.change}</p>
                </Card>
              );
            })}
          </div>

          {/* Filter */}
          <div className="flex gap-3">
            {['all', 'active', 'inactive', 'pending'].map(status => (
              <Button key={status} variant={statusFilter === status ? 'primary' : 'ghost'} size="sm" onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? 'bg-purple-500' : 'text-slate-400'}>
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          {/* Hospital List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHospitals.map((hospital, i) => (
              <motion.div key={hospital.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="p-5 hover:border-purple-500/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl ${hospital.type === 'Government' ? 'bg-blue-500/10' : hospital.type === 'Teaching' ? 'bg-purple-500/10' : 'bg-amber-500/10'}`}>
                        <Building2 className={`w-6 h-6 ${hospital.type === 'Government' ? 'text-blue-400' : hospital.type === 'Teaching' ? 'text-purple-400' : 'text-amber-400'}`} />
                      </div>
                      <div>
                        <h3 className="text-white font-bold">{hospital.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {hospital.city}</p>
                      </div>
                    </div>
                    <Badge variant={hospital.status === 'active' ? 'success' : hospital.status === 'inactive' ? 'default' : 'warning'} className="text-[10px]">{hospital.status}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center p-2 rounded-xl bg-white/[0.02]"><Bed className="w-4 h-4 text-blue-400 mx-auto mb-1" /><p className="text-white font-bold text-sm">{hospital.availableBeds}/{hospital.totalBeds}</p><p className="text-[10px] text-slate-500">Beds</p></div>
                    <div className="text-center p-2 rounded-xl bg-white/[0.02]"><Users className="w-4 h-4 text-cyan-400 mx-auto mb-1" /><p className="text-white font-bold text-sm">{hospital.totalDoctors}</p><p className="text-[10px] text-slate-500">Doctors</p></div>
                    <div className="text-center p-2 rounded-xl bg-white/[0.02]"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500 mx-auto mb-1" /><p className="text-white font-bold text-sm">{hospital.rating}</p><p className="text-[10px] text-slate-500">Rating</p></div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3"><Phone className="w-3 h-3" /> {hospital.phone}<span className="mx-1">•</span><Mail className="w-3 h-3" /> {hospital.email}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 border-purple-500/30 text-purple-400"><Eye className="w-3.5 h-3.5 mr-1" /> View</Button>
                    <Button variant="outline" size="sm" className="flex-1 border-blue-500/30 text-blue-400"><Edit3 className="w-3.5 h-3.5 mr-1" /> Edit</Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalManagement;