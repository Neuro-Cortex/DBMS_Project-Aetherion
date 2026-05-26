import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign, TrendingUp, Pill, Stethoscope,
   Download,  ArrowUp, 
   Receipt, Percent, Crown, Clock,
  CheckCircle,   
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts';
import AdminSidebar from './AdminSidebar';
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';

const revenueData = [
  { month: 'Jan', revenue: 45000, expense: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expense: 35000, profit: 17000 },
  { month: 'Mar', revenue: 48000, expense: 33000, profit: 15000 },
  { month: 'Apr', revenue: 58000, expense: 38000, profit: 20000 },
  { month: 'May', revenue: 65000, expense: 42000, profit: 23000 },
  { month: 'Jun', revenue: 72000, expense: 45000, profit: 27000 },
];

const revenueSources = [
  { name: 'Doctor Commission', value: 45, color: '#3B82F6' },
  { name: 'Pharmacy Sales', value: 30, color: '#10B981' },
  { name: 'Subscriptions', value: 15, color: '#F59E0B' },
  { name: 'Premium Users', value: 10, color: '#8B5CF6' },
];

const pendingPayments = [
  { id: 'PAY-001', doctor: 'Dr. Sarah Johnson', amount: 12500, status: 'pending', date: '2026-05-20', type: 'Commission' },
  { id: 'PAY-002', pharmacy: 'MediPlus Pharmacy', amount: 34200, status: 'pending', date: '2026-05-19', type: 'Sales' },
  { id: 'PAY-003', doctor: 'Dr. Michael Chen', amount: 9800, status: 'processing', date: '2026-05-18', type: 'Commission' },
  { id: 'PAY-004', pharmacy: 'HealthCare Pharmacy', amount: 28100, status: 'pending', date: '2026-05-17', type: 'Sales' },
];

const RevenueManager: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  return (
    <div className="min-h-screen bg-[#020408] flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-emerald-400" /> Revenue Management
                </h1>
                <p className="text-slate-400 text-sm mt-1">Track income, manage payments & commissions</p>
              </div>
              <Button variant="primary" className="bg-cyan-500"><Download className="w-4 h-4 mr-2" /> Export Report</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-emerald-500/10"><DollarSign className="w-5 h-5 text-emerald-400" /></div>
                  <p className="text-xs text-slate-400">Total Revenue</p>
                </div>
                <p className="text-2xl font-black text-white">$2,840,000</p>
                <p className="text-xs text-emerald-400 flex items-center gap-1 mt-1"><ArrowUp className="w-3 h-3" /> +18% from last month</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-blue-500/10"><Stethoscope className="w-5 h-5 text-blue-400" /></div>
                  <p className="text-xs text-slate-400">Doctor Income</p>
                </div>
                <p className="text-2xl font-black text-white">$1,420,000</p>
                <p className="text-xs text-blue-400 flex items-center gap-1 mt-1"><ArrowUp className="w-3 h-3" /> +12% from last month</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-amber-500/10"><Pill className="w-5 h-5 text-amber-400" /></div>
                  <p className="text-xs text-slate-400">Pharmacy Revenue</p>
                </div>
                <p className="text-2xl font-black text-white">$852,000</p>
                <p className="text-xs text-amber-400 flex items-center gap-1 mt-1"><ArrowUp className="w-3 h-3" /> +15% from last month</p>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-xl bg-purple-500/10"><Crown className="w-5 h-5 text-purple-400" /></div>
                  <p className="text-xs text-slate-400">Subscriptions</p>
                </div>
                <p className="text-2xl font-black text-white">$568,000</p>
                <p className="text-xs text-purple-400 flex items-center gap-1 mt-1"><ArrowUp className="w-3 h-3" /> +22% from last month</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <GlassmorphicCard className="p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-emerald-400" /> Revenue Trends
                  </h3>
                  <div className="flex gap-1">
                    {['weekly', 'monthly', 'yearly'].map(p => (
                      <Button key={p} variant={selectedPeriod === p ? 'primary' : 'ghost'} size="xs"
                        onClick={() => setSelectedPeriod(p)} className={selectedPeriod === p ? 'bg-cyan-500' : ''}>
                        {p.charAt(0).toUpperCase() + p.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={revenueData}>
                    <defs>
                      <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/><stop offset="95%" stopColor="#10B981" stopOpacity={0}/></linearGradient>
                      <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/><stop offset="95%" stopColor="#EF4444" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="month" stroke="#ffffff40" />
                    <YAxis stroke="#ffffff40" />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                    <Legend />
                    <Area type="monotone" dataKey="revenue" stroke="#10B981" fillOpacity={1} fill="url(#revGrad)" />
                    <Area type="monotone" dataKey="expense" stroke="#EF4444" fillOpacity={1} fill="url(#expGrad)" />
                    <Area type="monotone" dataKey="profit" stroke="#3B82F6" fillOpacity={0.3} strokeDasharray="5 5" />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassmorphicCard>

              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-purple-400" /> Revenue Sources
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={revenueSources} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value">
                      {revenueSources.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-3">
                  {revenueSources.map((src) => (
                    <div key={src.name} className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: src.color }} />
                      <span className="text-white/60 text-xs">{src.name}</span>
                      <span className="text-white text-xs ml-auto">{src.value}%</span>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            </div>

            <GlassmorphicCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-amber-400" /> Pending Payments
                </h3>
                <div className="flex gap-2">
                  <Button variant="ghost" size="xs" className="text-emerald-400"><CheckCircle className="w-3 h-3 mr-1" /> Release All</Button>
                  <Button variant="ghost" size="xs" className="text-cyan-400"><Percent className="w-3 h-3 mr-1" /> Set Commission</Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                      <th className="pb-3 px-2">ID</th>
                      <th className="pb-3 px-2">Entity</th>
                      <th className="pb-3 px-2">Amount</th>
                      <th className="pb-3 px-2">Type</th>
                      <th className="pb-3 px-2">Date</th>
                      <th className="pb-3 px-2">Status</th>
                      <th className="pb-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingPayments.map((pay, i) => (
                      <motion.tr key={pay.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-all">
                        <td className="py-3 px-2"><span className="text-cyan-400 text-sm font-mono">{pay.id}</span></td>
                        <td className="py-3 px-2"><span className="text-white text-sm">{pay.doctor || pay.pharmacy}</span></td>
                        <td className="py-3 px-2"><span className="text-white font-bold">${pay.amount.toLocaleString()}</span></td>
                        <td className="py-3 px-2"><Badge variant="info" className="text-[10px]">{pay.type}</Badge></td>
                        <td className="py-3 px-2"><span className="text-slate-400 text-sm">{pay.date}</span></td>
                        <td className="py-3 px-2">
                          <Badge variant={pay.status === 'pending' ? 'warning' : 'info'} className="text-[10px]">{pay.status}</Badge>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-1">
                            <Button variant="primary" size="xs" className="bg-emerald-500 text-[10px]">Release</Button>
                            <Button variant="ghost" size="xs" className="text-slate-400 text-[10px]">Hold</Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RevenueManager;