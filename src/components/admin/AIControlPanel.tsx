import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Brain, Activity, AlertTriangle,
  Search,  Eye, 
  Shield, 
  BarChart3, 
} from 'lucide-react';
import {
  AreaChart, Area,  XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import AdminSidebar from './AdminSidebar';
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Input } from 'src/ui/Input';

const aiPerformanceData = [
  { month: 'Jan', responses: 12500, accuracy: 94, flagged: 120 },
  { month: 'Feb', responses: 13800, accuracy: 95, flagged: 145 },
  { month: 'Mar', responses: 14200, accuracy: 96, flagged: 132 },
  { month: 'Apr', responses: 15100, accuracy: 95, flagged: 168 },
  { month: 'May', responses: 16300, accuracy: 97, flagged: 156 },
  { month: 'Jun', responses: 17200, accuracy: 96, flagged: 142 },
];

const riskCategories = [
  { name: 'Risky Patients', value: 23, color: '#EF4444' },
  { name: 'Fake Prescriptions', value: 12, color: '#F59E0B' },
  { name: 'Suspicious Pharmacies', value: 8, color: '#8B5CF6' },
  { name: 'Fraudulent Doctors', value: 5, color: '#3B82F6' },
];

const flaggedItems = [
  { id: 1, type: 'prescription', risk: 'high', patient: 'Rahima Khatun', doctor: 'Dr. Fake Name', reason: 'Suspicious prescription pattern - multiple opioids', time: '2 hours ago', status: 'investigating' },
  { id: 2, type: 'account', risk: 'critical', patient: 'Unknown User', doctor: 'N/A', reason: 'Fake medical license detected - AI verification failed', time: '5 hours ago', status: 'blocked' },
  { id: 3, type: 'pharmacy', risk: 'high', patient: 'N/A', doctor: 'N/A', reason: 'Unusual ordering pattern - bulk purchase of controlled substances', time: '1 day ago', status: 'flagged' },
  { id: 4, type: 'message', risk: 'medium', patient: 'Mohammad Ali', doctor: 'Dr. Sarah Johnson', reason: 'Mental health risk detected in chat - suicidal ideation', time: '2 days ago', status: 'alerted' },
];

const AIControlPanel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen bg-[#020408] flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <Brain className="w-8 h-8 text-purple-400" /> AI Analytics Control
                </h1>
                <p className="text-slate-400 text-sm mt-1">Monitor AI responses, fraud detection & smart suggestions</p>
              </div>
              <Badge variant="info" className="text-xs">AI Engine Active</Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 border-l-4 border-l-purple-500">
                <p className="text-2xl font-black text-white">17,200</p>
                <p className="text-xs text-slate-400">AI Responses Today</p>
              </Card>
              <Card className="p-4 border-l-4 border-l-emerald-500">
                <p className="text-2xl font-black text-white">96.2%</p>
                <p className="text-xs text-slate-400">Accuracy Rate</p>
              </Card>
              <Card className="p-4 border-l-4 border-l-red-500">
                <p className="text-2xl font-black text-white">{riskCategories.reduce((a, b) => a + b.value, 0)}</p>
                <p className="text-xs text-slate-400">Flagged Items</p>
              </Card>
              <Card className="p-4 border-l-4 border-l-amber-500">
                <p className="text-2xl font-black text-white">23</p>
                <p className="text-xs text-slate-400">Risky Patients</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <GlassmorphicCard className="p-6 lg:col-span-2">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" /> AI Performance Trends
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <AreaChart data={aiPerformanceData}>
                    <defs>
                      <linearGradient id="aiGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/><stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="month" stroke="#ffffff40" />
                    <YAxis stroke="#ffffff40" />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="responses" stroke="#8B5CF6" fillOpacity={1} fill="url(#aiGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassmorphicCard>

              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-amber-400" /> Risk Categories
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={riskCategories} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                      {riskCategories.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-2">
                  {riskCategories.map(cat => (
                    <div key={cat.name} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-slate-400">{cat.name}</span>
                      <span className="text-white ml-auto">{cat.value}</span>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            </div>

            <GlassmorphicCard className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" /> AI Flagged - Fraud & Risk Detection
                </h3>
                <Input placeholder="Search flagged items..." leftIcon={Search} value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} className="w-64" />
              </div>
              <div className="space-y-3">
                {flaggedItems.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl ${item.risk === 'critical' ? 'bg-red-500/10' : item.risk === 'high' ? 'bg-amber-500/10' : 'bg-blue-500/10'}`}>
                          <AlertTriangle className={`w-4 h-4 ${item.risk === 'critical' ? 'text-red-400' : item.risk === 'high' ? 'text-amber-400' : 'text-blue-400'}`} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-white font-bold text-sm">{item.reason}</h4>
                            <Badge variant={item.risk === 'critical' ? 'danger' : item.risk === 'high' ? 'warning' : 'info'} className="text-[8px]">{item.risk}</Badge>
                            <Badge variant={item.type === 'prescription' ? 'warning' : item.type === 'account' ? 'danger' : item.type === 'pharmacy' ? 'info' : 'default'} className="text-[8px]">{item.type}</Badge>
                          </div>
                          <p className="text-xs text-slate-400 mt-1">Patient: {item.patient} • Doctor: {item.doctor}</p>
                          <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                        </div>
                      </div>
                      <Badge variant={item.status === 'blocked' ? 'danger' : item.status === 'investigating' ? 'warning' : 'info'} className="text-[8px] shrink-0">{item.status}</Badge>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.04]">
                      <Button variant="primary" size="xs" className="bg-cyan-500"><Eye className="w-3 h-3 mr-1" /> Investigate</Button>
                      <Button variant="ghost" size="xs" className="text-red-400"><Shield className="w-3 h-3 mr-1" /> Block</Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIControlPanel;