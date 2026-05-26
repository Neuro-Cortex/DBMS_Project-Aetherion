import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, Server, Users, Stethoscope, UserCheck, Pill,
  Building2, AlertCircle, Calendar, Zap, Wifi, Cpu,
  HardDrive, Globe, Clock, ArrowUp, ArrowDown, Shield,
  Monitor,  Brain, Bell, Mail,
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Badge } from 'src/ui/Badge';

const LiveMonitor: React.FC = () => {
  const [systemTime, setSystemTime] = useState(new Date());
  const [onlineUsers] = useState(1247);
  const [activeConsultations] = useState(89);


  useEffect(() => {
    const timer = setInterval(() => setSystemTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const systemMetrics = [
    { label: 'CPU Usage', value: 35, icon: Cpu, color: 'text-emerald-400', bg: 'bg-emerald-500/10', max: 100 },
    { label: 'Memory', value: 62, icon: HardDrive, color: 'text-amber-400', bg: 'bg-amber-500/10', max: 100 },
    { label: 'Network', value: 78, icon: Globe, color: 'text-blue-400', bg: 'bg-blue-500/10', max: 100 },
    { label: 'Response Time', value: 45, icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500/10', unit: 'ms', max: 500 },
  ];

  const onlineEntities = [
    { label: 'Total Users', value: '15,234', icon: Users, status: 'online', change: '+12%' },
    { label: 'Active Doctors', value: '187', icon: Stethoscope, status: 'online', change: '+5%' },
    { label: 'Active Patients', value: '1,247', icon: UserCheck, status: 'online', change: '+8%' },
    { label: 'Online Pharmacies', value: '89', icon: Pill, status: 'online', change: '+3%' },
    { label: 'Active Hospitals', value: '45', icon: Building2, status: 'online', change: '+2%' },
    { label: 'Live Consultations', value: '23', icon: Calendar, status: 'active', change: '+15%' },
    { label: 'Emergency Alerts', value: '3', icon: AlertCircle, status: 'critical', change: '-10%' },
    { label: 'Server Uptime', value: '99.99%', icon: Shield, status: 'success', change: '99.99%' },
  ];

  const recentActivities = [
    { id: '1', user: 'Dr. Sarah Wilson', action: 'Started consultation with patient #1247', time: '2 sec ago', type: 'consultation' },
    { id: '2', user: 'MediPlus Pharmacy', action: 'New medicine order #ORD-8921', time: '15 sec ago', type: 'order' },
    { id: '3', user: 'Patient Rahman', action: 'Emergency SOS activated from Dhaka', time: '45 sec ago', type: 'emergency' },
    { id: '4', user: 'System', action: 'Auto backup completed - 2.4GB', time: '1 min ago', type: 'system' },
    { id: '5', user: 'City Hospital', action: 'ICU bed #12 status changed to available', time: '2 min ago', type: 'hospital' },
  ];

  return (
    <div className="min-h-screen bg-[#020408] flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <Activity className="w-8 h-8 text-emerald-400 animate-pulse" /> Live Monitoring
                  <Badge variant="success" className="text-xs animate-pulse">● LIVE</Badge>
                </h1>
                <p className="text-slate-400 text-sm mt-1">Real-time system monitoring & activity tracking</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Wifi className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">All Systems Online</span>
                </div>
                <Badge variant="info" className="text-xs">{systemTime.toLocaleTimeString()}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
              {onlineEntities.map((entity, i) => {
                const Icon = entity.icon;
                const statusColor = entity.status === 'critical' ? 'text-red-400' : entity.status === 'active' ? 'text-cyan-400' : 'text-emerald-400';
                const statusBg = entity.status === 'critical' ? 'bg-red-500/10' : entity.status === 'active' ? 'bg-cyan-500/10' : 'bg-emerald-500/10';
                return (
                  <Card key={i} className="p-3 text-center hover:shadow-lg transition-all">
                    <div className={`inline-flex p-2 rounded-xl ${statusBg} mb-2`}>
                      <Icon className={`w-4 h-4 ${statusColor}`} />
                    </div>
                    <p className="text-lg font-black text-white">{entity.value}</p>
                    <p className="text-[10px] text-slate-400">{entity.label}</p>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <GlassmorphicCard className="p-6 lg:col-span-2">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-cyan-400" /> Real-Time Activity
                  <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400">
                    <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Live
                  </span>
                </h3>
                <div className="space-y-2">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                      <div className={`p-2 rounded-xl ${
                        activity.type === 'emergency' ? 'bg-red-500/10' :
                        activity.type === 'consultation' ? 'bg-blue-500/10' :
                        activity.type === 'order' ? 'bg-amber-500/10' : 'bg-slate-500/10'
                      }`}>
                        <Activity className={`w-4 h-4 ${
                          activity.type === 'emergency' ? 'text-red-400' :
                          activity.type === 'consultation' ? 'text-blue-400' :
                          activity.type === 'order' ? 'text-amber-400' : 'text-cyan-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white text-sm font-bold truncate">{activity.user}</h4>
                        <p className="text-xs text-slate-400">{activity.action}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>

              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Server className="w-5 h-5 text-purple-400" /> Server Health
                </h3>
                <div className="space-y-4">
                  {systemMetrics.map((metric) => {
                    const Icon = metric.icon;
                    const percentage = Math.round((metric.value / metric.max) * 100);
                    const barColor = percentage > 80 ? 'from-red-500 to-rose-500' : percentage > 60 ? 'from-amber-500 to-orange-500' : 'from-emerald-500 to-cyan-500';
                    return (
                      <div key={metric.label}>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${metric.color}`} />
                            <span className="text-slate-400 text-xs">{metric.label}</span>
                          </div>
                          <span className="text-white text-sm font-bold">
                            {metric.value}{metric.unit || '%'}
                          </span>
                        </div>
                        <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            className={`h-full bg-gradient-to-r ${barColor} rounded-full`}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-white/[0.06]">
                  <div className="text-center p-3 rounded-2xl bg-white/[0.02]">
                    <p className="text-slate-400 text-xs">Online Users</p>
                    <p className="text-white text-lg font-black">{onlineUsers}</p>
                  </div>
                  <div className="text-center p-3 rounded-2xl bg-white/[0.02]">
                    <p className="text-slate-400 text-xs">Active Sessions</p>
                    <p className="text-white text-lg font-black">{activeConsultations}</p>
                  </div>
                </div>
              </GlassmorphicCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-cyan-400" /> System Status Overview
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Database', status: 'Operational', icon: Server, color: 'emerald' },
                    { label: 'API Server', status: 'Operational', icon: Globe, color: 'emerald' },
                    { label: 'AI Engine', status: 'Operational', icon: Brain, color: 'emerald' },
                    { label: 'Notification', status: 'Degraded', icon: Bell, color: 'amber' },
                    { label: 'File Storage', status: 'Operational', icon: HardDrive, color: 'emerald' },
                    { label: 'Email Service', status: 'Operational', icon: Mail, color: 'emerald' },
                  ].map((service) => (
                    <div key={service.label} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02]">
                      <div className={`p-2 rounded-xl bg-${service.color}-500/10`}>
                        <service.icon className={`w-4 h-4 text-${service.color}-400`} />
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold">{service.label}</p>
                        <p className={`text-xs text-${service.color}-400`}>{service.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>

              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" /> Quick System Stats
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'Requests/min', value: '2,847', trend: 'up', change: '+15%' },
                    { label: 'Avg Response', value: '45ms', trend: 'down', change: '-5%' },
                    { label: 'Error Rate', value: '0.02%', trend: 'down', change: '-8%' },
                    { label: 'Cache Hit Rate', value: '94.5%', trend: 'up', change: '+3%' },
                  ].map((stat) => (
                    <div key={stat.label} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02]">
                      <span className="text-slate-400 text-sm">{stat.label}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold">{stat.value}</span>
                        <span className={`flex items-center text-xs ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {stat.trend === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                          {stat.change}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LiveMonitor;