import { motion } from 'framer-motion';
import {
  Baby, Heart, Activity, AlertTriangle,
 Eye,
  Shield,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import AdminSidebar from './AdminSidebar';
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';

const pregnancyData = [
  { month: 'Jan', registrations: 450, checkups: 380, highRisk: 45 },
  { month: 'Feb', registrations: 520, checkups: 410, highRisk: 52 },
  { month: 'Mar', registrations: 480, checkups: 430, highRisk: 38 },
  { month: 'Apr', registrations: 550, checkups: 460, highRisk: 48 },
  { month: 'May', registrations: 600, checkups: 510, highRisk: 42 },
  { month: 'Jun', registrations: 350, checkups: 490, highRisk: 35 },
];

const healthCategories = [
  { name: 'Pregnancy', value: 35, color: '#EC4899' },
  { name: 'Mother Health', value: 25, color: '#F59E0B' },
  { name: 'Vaccination', value: 20, color: '#10B981' },
  { name: 'Menstrual', value: 15, color: '#3B82F6' },
  { name: 'Special Care', value: 5, color: '#8B5CF6' },
];

const WomenCareManagement: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020408] flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <Baby className="w-8 h-8 text-pink-400" /> Women Care Management
                </h1>
                <p className="text-slate-400 text-sm mt-1">Women health analytics & care monitoring</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 border-l-4 border-l-pink-500">
                <p className="text-2xl font-black text-white">12,847</p>
                <p className="text-xs text-slate-400">Total Women Patients</p>
              </Card>
              <Card className="p-4 border-l-4 border-l-rose-500">
                <p className="text-2xl font-black text-white">3,450</p>
                <p className="text-xs text-slate-400">Active Pregnancies</p>
              </Card>
              <Card className="p-4 border-l-4 border-l-amber-500">
                <p className="text-2xl font-black text-white">260</p>
                <p className="text-xs text-slate-400">High Risk Cases</p>
              </Card>
              <Card className="p-4 border-l-4 border-l-emerald-500">
                <p className="text-2xl font-black text-white">2,847</p>
                <p className="text-xs text-slate-400">Vaccinations Done</p>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <GlassmorphicCard className="p-6 lg:col-span-2">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-pink-400" /> Pregnancy & Health Trends
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <AreaChart data={pregnancyData}>
                    <defs>
                      <linearGradient id="pregGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#EC4899" stopOpacity={0.8}/><stop offset="95%" stopColor="#EC4899" stopOpacity={0}/></linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                    <XAxis dataKey="month" stroke="#ffffff40" />
                    <YAxis stroke="#ffffff40" />
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                    <Area type="monotone" dataKey="registrations" stroke="#EC4899" fillOpacity={1} fill="url(#pregGrad)" />
                    <Area type="monotone" dataKey="checkups" stroke="#10B981" fillOpacity={0.5} />
                    <Area type="monotone" dataKey="highRisk" stroke="#EF4444" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </GlassmorphicCard>

              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-400" /> Health Categories
                </h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={healthCategories} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={5} dataKey="value">
                      {healthCategories.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-1 mt-2">
                  {healthCategories.map(cat => (
                    <div key={cat.name} className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                      <span className="text-slate-400">{cat.name}</span>
                      <span className="text-white ml-auto">{cat.value}%</span>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            </div>

            <GlassmorphicCard className="p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" /> High Risk Pregnancies - Monitor List
              </h3>
              <div className="space-y-3">
                {[
                  { name: 'Fatima Begum', age: 28, weeks: '32', risk: 'high', condition: 'Pre-eclampsia', doctor: 'Dr. Sarah Johnson', lastVisit: '2 days ago' },
                  { name: 'Jahanara Begum', age: 35, weeks: '28', risk: 'critical', condition: 'Gestational Diabetes', doctor: 'Dr. Emily White', lastVisit: '1 day ago' },
                  { name: 'Rahima Khatun', age: 32, weeks: '24', risk: 'high', condition: 'Placenta Previa', doctor: 'Dr. Sarah Johnson', lastVisit: '3 days ago' },
                ].map((patient, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${patient.risk === 'critical' ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                          <AlertTriangle className={`w-4 h-4 ${patient.risk === 'critical' ? 'text-red-400' : 'text-amber-400'}`} />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm">{patient.name}</h4>
                          <p className="text-xs text-slate-400">{patient.age}yrs • Week {patient.weeks} • {patient.condition}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={patient.risk === 'critical' ? 'danger' : 'warning'} className="text-[10px]">{patient.risk}</Badge>
                        <span className="text-xs text-slate-500">{patient.lastVisit}</span>
                        <Button variant="primary" size="xs" className="bg-cyan-500"><Eye className="w-3 h-3 mr-1" /> View</Button>
                      </div>
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

export default WomenCareManagement;