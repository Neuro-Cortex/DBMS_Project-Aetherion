// src/pages/Doctor/WomenCare.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Baby, Heart, Calendar, Activity, Brain, Shield } from 'lucide-react';




import { Card } from 'src/ui/Card';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';



const WomenCare: React.FC = () => {
  const features = [
    { icon: Baby, title: 'Pregnancy Monitoring', desc: 'Track pregnancy progress, fetal growth, and schedule checkups', color: 'pink', patients: 12 },
    { icon: Calendar, title: 'Menstrual Health', desc: 'Track cycles, ovulation, and menstrual disorders', color: 'rose', patients: 25 },
    { icon: Activity, title: 'PCOS Monitoring', desc: 'Monitor PCOS symptoms and treatment progress', color: 'purple', patients: 8 },
    { icon: Heart, title: 'Hormonal Health', desc: 'Track hormonal imbalances and thyroid conditions', color: 'red', patients: 15 },
    { icon: Shield, title: 'Breastfeeding Guidance', desc: 'Provide lactation support and safe medication advice', color: 'indigo', patients: 6 },
    { icon: Brain, title: 'Mental Health Notes', desc: 'Track postpartum depression and anxiety symptoms', color: 'teal', patients: 10 },
  ];

  return (
    <div className="min-h-screen bg-[#030508]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white flex items-center gap-3"><Baby className="w-8 h-8 text-pink-400" /> Women Care</h1>
          <p className="text-slate-400 text-sm mt-1">Comprehensive women health management</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Card key={i} className="p-6 hover:shadow-lg transition-all cursor-pointer">
                <div className={`inline-flex p-3 rounded-2xl bg-${feature.color}-500/10 mb-4`}>
                  <Icon className={`w-7 h-7 text-${feature.color}-400`} />
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{feature.title}</h3>
                <p className="text-slate-400 text-sm mb-3">{feature.desc}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="info">{feature.patients} patients</Badge>
                  <Button variant="ghost" size="xs" className="text-cyan-400">View All →</Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default WomenCare;