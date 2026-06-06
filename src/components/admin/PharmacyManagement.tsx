import { getAuthToken } from '../../services/api';
// src/components/admin/PharmacyManagement.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Pill, Search, MapPin, Phone, Mail, 
  Users, Shield, Settings, LogOut, Server, Bell,
  LayoutDashboard, UserCheck, Building2, AlertCircle,
  Calendar, Brain, BarChart3, FileText, DollarSign,
  Stethoscope, Baby, 
    CheckCircle,  Eye, Edit3,
  Package, Clock, ShoppingCart
} from 'lucide-react';
import { Card } from 'src/ui/Card';

import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Input } from 'src/ui/Input';

interface Pharmacy {
  id: string; name: string; city: string; rating: number;
  phone: string; email: string; status: 'active' | 'inactive' | 'pending';
  verified: boolean; totalMedicines: number; totalOrders: number;
  deliveryTime: string; license: string;
}

const mockPharmacies: Pharmacy[] = [
  { id: '1', name: 'MediPlus Pharmacy', city: 'New York', rating: 4.8, phone: '+1 (555) 111-2233', email: 'info@mediplus.com', status: 'active', verified: true, totalMedicines: 1240, totalOrders: 456, deliveryTime: '30 min', license: 'PH-2024-001' },
  { id: '2', name: 'HealthFirst Drugs', city: 'Chicago', rating: 4.6, phone: '+1 (555) 222-3344', email: 'contact@healthfirst.com', status: 'active', verified: true, totalMedicines: 980, totalOrders: 312, deliveryTime: '25 min', license: 'PH-2024-002' },
  { id: '3', name: 'City Pharmacy', city: 'Houston', rating: 4.4, phone: '+1 (555) 333-4455', email: 'info@citypharm.com', status: 'active', verified: true, totalMedicines: 750, totalOrders: 234, deliveryTime: '40 min', license: 'PH-2024-003' },
  { id: '4', name: 'Wellness Mart', city: 'San Francisco', rating: 4.7, phone: '+1 (555) 444-5566', email: 'admin@wellnessmart.com', status: 'active', verified: false, totalMedicines: 1120, totalOrders: 389, deliveryTime: '20 min', license: 'PH-2024-004' },
  { id: '5', name: 'MediCare Pharmacy', city: 'Boston', rating: 4.9, phone: '+1 (555) 555-6677', email: 'info@medicarepharm.com', status: 'active', verified: true, totalMedicines: 1560, totalOrders: 567, deliveryTime: '15 min', license: 'PH-2024-005' },
  { id: '6', name: 'Green Cross Pharmacy', city: 'Denver', rating: 4.2, phone: '+1 (555) 666-7788', email: 'contact@greencross.com', status: 'inactive', verified: true, totalMedicines: 450, totalOrders: 89, deliveryTime: '45 min', license: 'PH-2024-006' },
];

const sidebarLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Stethoscope, label: 'Doctors', path: '/admin/doctor-verification' },
  { icon: UserCheck, label: 'Patients', path: '/admin/users' },
  { icon: Pill, label: 'Pharmacy', path: '/admin/pharmacy', active: true },
  { icon: Building2, label: 'Hospitals', path: '/admin/hospitals' },
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

const PharmacyManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pharmacies, setPharmacies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/admin/pharmacies`,
          { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        const data = await res.json();
        setPharmacies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch pharmacies:', err);
        setPharmacies([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPharmacies();
  }, []);

  const handleVerify = async (pharmacyId: string) => {
    try {
      const token = getAuthToken();
      await fetch(
        `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/admin/pharmacies/${pharmacyId}/verify`,
        { method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
      );
      setPharmacies(pharmacies.map(p => p.id === pharmacyId ? { ...p, is_verified: true } : p));
    } catch (err) {
      console.error('Failed to verify pharmacy:', err);
    }
  };

  const filteredPharmacies = pharmacies.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchQuery.toLowerCase()) || p.city?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? p.is_active : !p.is_active);
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-[#020408] flex">
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

      <div className="flex-1 min-w-0">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                <Pill className="w-8 h-8 text-amber-400" /> Pharmacy Management
              </h1>
              <p className="text-slate-400 text-sm mt-1">Manage all registered pharmacies and medicine suppliers</p>
            </div>
            <div className="flex items-center gap-3">
              <Input placeholder="Search pharmacies..." leftIcon={Search} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-56" />
              <Button variant="primary" className="bg-gradient-to-r from-amber-500 to-orange-500"><Pill className="w-4 h-4 mr-1" /> Add Pharmacy</Button>
            </div>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[ 
              { icon: Pill, label: 'Total Pharmacies', value: pharmacies.length, color: 'amber', change: '+5%' },
              { icon: Package, label: 'Total Orders', value: pharmacies.reduce((a: number, p: any) => a + (p.total_orders || 0), 0).toLocaleString(), color: 'teal', change: '+18%' },
              { icon: ShoppingCart, label: 'Active', value: pharmacies.filter((p: any) => p.is_active).length, color: 'blue', change: '+12%' },
              { icon: CheckCircle, label: 'Verified', value: pharmacies.filter((p: any) => p.is_verified).length, color: 'emerald', change: '+2%' },
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

          <div className="flex gap-3">
            {['all', 'active', 'inactive', 'pending'].map(status => (
              <Button key={status} variant={statusFilter === status ? 'primary' : 'ghost'} size="sm" onClick={() => setStatusFilter(status)}
                className={statusFilter === status ? 'bg-amber-500' : 'text-slate-400'}>
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredPharmacies.map((pharmacy: any, i: number) => (
              <motion.div key={pharmacy.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="p-5 hover:border-amber-500/30 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-xl bg-amber-500/10"><Pill className="w-6 h-6 text-amber-400" /></div>
                      <div>
                        <h3 className="text-white font-bold">{pharmacy.name}</h3>
                        <p className="text-xs text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {pharmacy.city || 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={pharmacy.is_verified ? 'success' : 'warning'} className="text-[10px]">{pharmacy.is_verified ? 'Verified' : 'Unverified'}</Badge>
                      <Badge variant={pharmacy.is_active !== false ? 'success' : 'default'} className="text-[10px]">{pharmacy.is_active !== false ? 'Active' : 'Inactive'}</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="text-center p-2 rounded-xl bg-white/[0.02]"><Package className="w-4 h-4 text-blue-400 mx-auto mb-1" /><p className="text-white font-bold text-sm">{pharmacy.pharmacist_name || 'N/A'}</p><p className="text-[10px] text-slate-500">Pharmacist</p></div>
                    <div className="text-center p-2 rounded-xl bg-white/[0.02]"><ShoppingCart className="w-4 h-4 text-cyan-400 mx-auto mb-1" /><p className="text-white font-bold text-sm">{pharmacy.total_orders || 0}</p><p className="text-[10px] text-slate-500">Orders</p></div>
                    <div className="text-center p-2 rounded-xl bg-white/[0.02]"><Clock className="w-4 h-4 text-green-400 mx-auto mb-1" /><p className="text-white font-bold text-sm">{pharmacy.rating || 0}</p><p className="text-[10px] text-slate-500">Rating</p></div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-3"><Phone className="w-3 h-3" /> {pharmacy.phone || 'N/A'}<span className="mx-1">•</span><Mail className="w-3 h-3" /> {pharmacy.email || 'N/A'}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 border-amber-500/30 text-amber-400"><Eye className="w-3.5 h-3.5 mr-1" /> View</Button>
                    {!pharmacy.is_verified && (
                      <Button variant="outline" size="sm" className="flex-1 border-emerald-500/30 text-emerald-400" onClick={() => handleVerify(pharmacy.id)}><CheckCircle className="w-3.5 h-3.5 mr-1" /> Verify</Button>
                    )}
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

export default PharmacyManagement;
