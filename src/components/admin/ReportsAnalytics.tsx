import { getAuthToken } from '../../services/api';
// src/components/admin/ReportsAnalytics.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FileText, BarChart3, Search, Download,
  Users, Shield, Settings, LogOut,  Bell,
  LayoutDashboard, UserCheck, Building2, Pill,
  AlertCircle, Calendar, Brain, Stethoscope, Baby,
  DollarSign,  TrendingUp, Activity,
  DownloadCloud, 
} from 'lucide-react';
import {
   BarChart, Bar, PieChart as RePieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart as ReLineChart, Line
} from 'recharts';
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Input } from 'src/ui/Input';

const reportTypes = [
  { id: 'financial', label: 'Financial Reports', icon: DollarSign, color: 'emerald' },
  { id: 'clinical', label: 'Clinical Reports', icon: Activity, color: 'blue' },
  { id: 'operational', label: 'Operational', icon: TrendingUp, color: 'purple' },
  { id: 'compliance', label: 'Compliance', icon: Shield, color: 'amber' },
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
  { icon: FileText, label: 'Reports', path: '/admin/reports', active: true },
  { icon: DollarSign, label: 'Payments', path: '/admin/payments' },
  { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
  { icon: Shield, label: 'Security', path: '/admin/security' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const ReportsAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [serviceData, setServiceData] = useState<any[]>([]);
  const [generatedReports, setGeneratedReports] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/admin/analytics`,
          { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        const result = await res.json();
        if (Array.isArray(result)) {
          setRevenueData(result);
        } else {
          setRevenueData(result.revenueData || []);
          setServiceData(result.serviceData || []);
          setGeneratedReports(result.generatedReports || []);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
        setRevenueData([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#020408] flex">
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950/80 backdrop-blur-xl border-r border-white/[0.04] h-screen sticky top-0">
        <div className="p-6 border-b border-white/[0.04]">
          <div className="flex items-center gap-3 mb-4">
            <Avatar name="AD" size="lg" className="ring-2 ring-amber-500/30" />
            <div><h3 className="text-white font-bold text-sm">Admin</h3><p className="text-amber-400 text-xs">Super Admin</p></div>
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
          <Button variant="ghost" className="w-full text-slate-400 hover:text-red-400 justify-start"><LogOut className="w-4 h-4 mr-2" /> Sign Out</Button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <FileText className="w-8 h-8 text-cyan-400" /> Reports & Analytics
                </h1>
                <p className="text-slate-400 text-sm mt-1">Generate and view detailed system reports</p>
              </div>
              <div className="flex items-center gap-3">
                <Input placeholder="Search reports..." leftIcon={Search} className="w-56" />
                <Button variant="primary" className="bg-gradient-to-r from-cyan-500 to-blue-500">
                  <DownloadCloud className="w-4 h-4 mr-1" /> Export All
                </Button>
              </div>
            </div>

            {/* Report Types */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {reportTypes.map((rt) => {
                const Icon = rt.icon;
                return (
                  <Card key={rt.id} className="p-4 text-center hover:border-cyan-500/30 cursor-pointer">
                    <Icon className="w-6 h-6 mx-auto mb-2 text-cyan-400" />
                    <p className="text-white font-bold">{rt.label}</p>
                  </Card>
                );
              })}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-bold mb-4">Revenue vs Expenses</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="month" stroke="#ffffff40" />
                    <YAxis stroke="#ffffff40" />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20' }} />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3B82F6" radius={[4,4,0,0]} />
                    <Bar dataKey="expenses" fill="#EF4444" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </GlassmorphicCard>

              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-bold mb-4">Revenue Breakdown</h3>
                <ResponsiveContainer width="100%" height={280}>
                  <RePieChart>
                    <Pie data={serviceData} cx="50%" cy="50%" outerRadius={90} paddingAngle={5} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                      {serviceData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20' }} />
                  </RePieChart>
                </ResponsiveContainer>
              </GlassmorphicCard>
            </div>

            {/* Monthly Trend */}
            <GlassmorphicCard className="p-6 mb-6">
              <h3 className="text-white font-bold mb-4">Profit Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <ReLineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="month" stroke="#ffffff40" />
                  <YAxis stroke="#ffffff40" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20' }} />
                  <Line type="monotone" dataKey="profit" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981' }} />
                  <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6' }} />
                </ReLineChart>
              </ResponsiveContainer>
            </GlassmorphicCard>

            {/* Report List */}
            <GlassmorphicCard className="p-6">
              <h3 className="text-white font-bold mb-4">Generated Reports</h3>
              <div className="space-y-3">
                {generatedReports.length > 0 ? generatedReports.map((report: any, i: number) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04]">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-cyan-400" />
                      <div>
                        <p className="text-white text-sm font-medium">{report.name}</p>
                        <p className="text-xs text-slate-500">{report.type} • {report.date} • {report.size}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={report.status === 'ready' ? 'success' : 'warning'} className="text-[10px]">{report.status}</Badge>
                      {report.status === 'ready' && (
                        <Button variant="ghost" size="xs"><Download className="w-4 h-4" /></Button>
                      )}
                    </div>
                  </div>
                )) : (
                  <p className="text-slate-500 text-sm text-center py-4">No reports generated yet.</p>
                )}
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReportsAnalytics;