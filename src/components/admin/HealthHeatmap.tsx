import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,  AlertTriangle, TrendingUp, 
   Eye,  Thermometer,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import AdminSidebar from './AdminSidebar';
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';

const areaDiseaseData = [
  { area: 'Dhaka', diabetes: 450, heart: 380, respiratory: 320, dengue: 290, cancer: 180 },
  { area: 'Chattogram', diabetes: 380, heart: 310, respiratory: 280, dengue: 420, cancer: 150 },
  { area: 'Sylhet', diabetes: 280, heart: 220, respiratory: 190, dengue: 150, cancer: 120 },
  { area: 'Rajshahi', diabetes: 320, heart: 280, respiratory: 250, dengue: 200, cancer: 140 },
  { area: 'Khulna', diabetes: 290, heart: 240, respiratory: 310, dengue: 350, cancer: 130 },
  { area: 'Barishal', diabetes: 200, heart: 180, respiratory: 220, dengue: 280, cancer: 90 },
  { area: 'Rangpur', diabetes: 180, heart: 160, respiratory: 200, dengue: 120, cancer: 80 },
  { area: 'Mymensingh', diabetes: 160, heart: 140, respiratory: 170, dengue: 190, cancer: 70 },
];

const healthAlerts = [
  { area: 'Chattogram', disease: 'Dengue', cases: 420, trend: 'up', severity: 'critical', status: 'outbreak' },
  { area: 'Dhaka', disease: 'Diabetes', cases: 450, trend: 'up', severity: 'high', status: 'endemic' },
  { area: 'Khulna', disease: 'Respiratory', cases: 310, trend: 'up', severity: 'high', status: 'warning' },
  { area: 'Sylhet', disease: 'Heart Disease', cases: 220, trend: 'stable', severity: 'medium', status: 'monitor' },
];

const HealthHeatmap: React.FC = () => {
  const [selectedDisease, setSelectedDisease] = useState('diabetes');

  const getHeatColor = (value: number) => {
    if (value > 380) return 'bg-red-500/30 border-red-500/50';
    if (value > 280) return 'bg-amber-500/20 border-amber-500/30';
    if (value > 180) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-emerald-500/10 border-emerald-500/20';
  };

  const getHeatIntensity = (value: number) => {
    if (value > 380) return 'text-red-400 font-black';
    if (value > 280) return 'text-amber-400 font-bold';
    if (value > 180) return 'text-yellow-400';
    return 'text-emerald-400';
  };

  return (
    <div className="min-h-screen bg-[#020408] flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <MapPin className="w-8 h-8 text-emerald-400" /> Health Heatmap
                </h1>
                <p className="text-slate-400 text-sm mt-1">Disease distribution & health analytics by area</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <GlassmorphicCard className="p-6 lg:col-span-2">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Thermometer className="w-5 h-5 text-emerald-400" /> Disease Heatmap by Division
                  </h3>
                  <div className="flex gap-1">
                    {['diabetes', 'heart', 'respiratory', 'dengue', 'cancer'].map(d => (
                      <Button key={d} variant={selectedDisease === d ? 'primary' : 'ghost'} size="xs"
                        onClick={() => setSelectedDisease(d)} className={selectedDisease === d ? 'bg-cyan-500' : 'text-slate-400'}>
                        {d.charAt(0).toUpperCase() + d.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {areaDiseaseData.map((area) => {
                    const value = area[selectedDisease as keyof typeof area] as number;
                    const color = getHeatColor(value);
                    const textColor = getHeatIntensity(value);
                    return (
                      <Card key={area.area} className={`p-4 border ${color} hover:shadow-lg transition-all`}>
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          <span className="text-white font-bold text-sm">{area.area}</span>
                        </div>
                        <p className={`text-2xl ${textColor}`}>{value}</p>
                        <p className="text-xs text-slate-400">Cases</p>
                        <div className="mt-2 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(value / 500) * 100}%` }}
                            className={`h-full rounded-full ${
                              value > 380 ? 'bg-red-500' : value > 280 ? 'bg-amber-500' : value > 180 ? 'bg-yellow-500' : 'bg-emerald-500'
                            }`}
                          />
                        </div>
                      </Card>
                    );
                  })}
                </div>
              </GlassmorphicCard>

              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-400" /> Health Alerts
                </h3>
                <div className="space-y-3">
                  {healthAlerts.map((alert, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center justify-between">
                        <Badge variant={alert.severity === 'critical' ? 'danger' : alert.severity === 'high' ? 'warning' : 'info'} className="text-[10px]">{alert.severity}</Badge>
                        <Badge variant={alert.trend === 'up' ? 'danger' : 'info'} className="text-[10px]">{alert.trend}</Badge>
                      </div>
                      <h4 className="text-white font-bold text-sm mt-2">{alert.area}</h4>
                      <p className="text-xs text-slate-400">{alert.disease} • {alert.cases} cases</p>
                      <p className="text-xs text-slate-500 mt-1 capitalize">Status: {alert.status}</p>
                      <Button variant="primary" size="xs" className="w-full mt-2 bg-cyan-500"><Eye className="w-3 h-3 mr-1" /> View Details</Button>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            </div>

            <GlassmorphicCard className="p-6">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" /> Disease Comparison by Area
              </h3>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={areaDiseaseData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="area" stroke="#ffffff40" />
                  <YAxis stroke="#ffffff40" />
                  <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid #ffffff20', borderRadius: '8px' }} />
                  <Bar dataKey="diabetes" fill="#3B82F6" radius={[4,4,0,0]} />
                  <Bar dataKey="heart" fill="#EF4444" radius={[4,4,0,0]} />
                  <Bar dataKey="respiratory" fill="#10B981" radius={[4,4,0,0]} />
                  <Bar dataKey="dengue" fill="#F59E0B" radius={[4,4,0,0]} />
                  <Bar dataKey="cancer" fill="#8B5CF6" radius={[4,4,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HealthHeatmap;