// src/components/doctors/Analytics.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Activity } from 'lucide-react';
import { Card } from 'src/ui/Card';

const stats = [
  { label: 'Total Patients', value: '1,247', change: '+12%', icon: Users, color: 'blue' },
  { label: 'Appointments', value: '84', change: '+8%', icon: Calendar, color: 'indigo' },
  { label: 'Revenue', value: '৳4.2L', change: '+15%', icon: DollarSign, color: 'emerald' },
  { label: 'Procedures', value: '32', change: '+5%', icon: Activity, color: 'purple' },
];

const Analytics: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#030508]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-purple-400" /> Analytics
          </h1>
          <p className="text-slate-400 text-sm mt-1">Performance metrics and insights</p>
        </motion.div>

        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">{stat.label}</p>
                      <p className="text-2xl font-black text-white mt-1">{stat.value}</p>
                      <p className="text-xs text-emerald-400 mt-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" /> {stat.change}
                      </p>
                    </div>
                    <Icon className="w-10 h-10 text-purple-400/30" />
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <Card className="p-6">
          <h2 className="text-white font-bold text-lg mb-4">Analytics Dashboard</h2>
          <div className="h-[300px] flex items-center justify-center border border-dashed border-white/[0.06] rounded-xl">
            <div className="text-center text-slate-500">
              <BarChart3 className="w-16 h-16 mx-auto mb-3 text-slate-600" />
              <p>Charts and graphs will be displayed here</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;