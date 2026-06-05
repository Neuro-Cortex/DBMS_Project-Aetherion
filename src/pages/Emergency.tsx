// src/pages/Emergency.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Truck, Heart, AlertCircle, Activity,
  Users, Clock, Bell, TrendingUp,
  Download, RefreshCw, MapPin, Stethoscope,
  Phone, Droplet, Syringe, Shield, Award,
  Search, Filter, Plus
} from 'lucide-react';
import  EmergencyServices  from 'src/components/emergency/EmergencyServices';

import { ICUTracker } from '@/components/emergency/ICUTracker';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from 'src/components/dashboard/statCard';

// ============================================
// TYPES
// ============================================
interface EmergencyStats {
  totalEmergencies: number;
  activeEmergencies: number;
  avgResponseTime: number;
  criticalPatients: number;
}

interface EmergencyAlert {
  id: string;
  type: 'cardiac' | 'trauma' | 'stroke' | 'respiratory';
  severity: 'critical' | 'high' | 'medium' | 'low';
  location: string;
  time: string;
  status: 'pending' | 'dispatched' | 'arrived' | 'completed';
}

// ✅ Match EmergencyServices types
interface AmbulanceService {
  id: string;
  name: string;
  type: 'ambulance' | 'emergency-room' | 'doctor' | 'blood' | 'oxygen';
  status: 'available' | 'dispatched' | 'busy';
  location: { lat: number; lng: number; address: string };
  eta: number;
  provider: string;
  phone: string;
  capacity: number;
  currentLoad: number;
  rating: number;
}

// ✅ Match ICUTracker types
interface ICUResource {
  id: string;
  type: 'ventilator' | 'monitor' | 'defibrillator' | 'infusion' | 'dialysis' | 'ecmo';
  total: number;
  available: number;
  status: string;
  lastServiced: string;
}

interface ICUStaff {
  role: 'doctor' | 'nurse' | 'respiratory' | 'specialist';
  count: number;
  available: number;
  onCall: number;
  specialty: string;
}

// ============================================
// MOCK DATA (Typed correctly)
// ============================================
const services: AmbulanceService[] = [
  { id: '1', name: 'Ambulance Unit Alpha', type: 'ambulance', status: 'available', location: { lat: 40.7, lng: -74, address: 'Downtown' }, eta: 8, provider: 'City EMS', phone: '+1 (555) 100-1001', capacity: 2, currentLoad: 0, rating: 4.8 },
  { id: '2', name: 'Ambulance Unit Bravo', type: 'ambulance', status: 'dispatched', location: { lat: 40.7, lng: -74, address: 'Midtown' }, eta: 12, provider: 'Metro Ambulance', phone: '+1 (555) 100-1002', capacity: 2, currentLoad: 1, rating: 4.6 },
  { id: '3', name: 'Ambulance Unit Charlie', type: 'ambulance', status: 'available', location: { lat: 40.7, lng: -74, address: 'Brooklyn' }, eta: 15, provider: 'Life Support', phone: '+1 (555) 100-1003', capacity: 2, currentLoad: 0, rating: 4.9 },
  { id: '4', name: 'Emergency Room - City Hospital', type: 'emergency-room', status: 'busy', location: { lat: 40.7, lng: -74, address: 'City Hospital' }, eta: 0, provider: 'City Hospital', phone: '+1 (555) 911-0001', capacity: 10, currentLoad: 7, rating: 4.7 },
  { id: '5', name: 'Emergency Room - Metro Medical', type: 'emergency-room', status: 'available', location: { lat: 40.7, lng: -74, address: 'Metro Medical Center' }, eta: 0, provider: 'Metro Medical', phone: '+1 (555) 911-0002', capacity: 8, currentLoad: 4, rating: 4.5 },
  { id: '6', name: 'Dr. Robert Kim - On Call', type: 'doctor', status: 'available', location: { lat: 40.7, lng: -74, address: 'City Hospital' }, eta: 5, provider: 'City Hospital', phone: '+1 (555) 200-3001', capacity: 1, currentLoad: 0, rating: 4.9 },
  { id: '7', name: 'Blood Bank - Central', type: 'blood', status: 'available', location: { lat: 40.7, lng: -74, address: 'Central Blood Bank' }, eta: 20, provider: 'Red Cross', phone: '+1 (555) 400-5001', capacity: 100, currentLoad: 45, rating: 4.8 },
  { id: '8', name: 'Oxygen Supply - Main', type: 'oxygen', status: 'available', location: { lat: 40.7, lng: -74, address: 'Medical Supply Depot' }, eta: 15, provider: 'OxyMed', phone: '+1 (555) 600-7001', capacity: 200, currentLoad: 80, rating: 4.6 },
];

const resources: ICUResource[] = [
  { id: '1', type: 'ventilator', total: 30, available: 5, status: 'critical', lastServiced: '2024-01-01' },
  { id: '2', type: 'monitor', total: 50, available: 20, status: 'operational', lastServiced: '2024-02-01' },
  { id: '3', type: 'defibrillator', total: 15, available: 8, status: 'operational', lastServiced: '2024-02-15' },
  { id: '4', type: 'infusion', total: 40, available: 12, status: 'low', lastServiced: '2024-01-20' },
  { id: '5', type: 'dialysis', total: 10, available: 3, status: 'critical', lastServiced: '2024-03-01' },
];

const staff: ICUStaff[] = [
  { role: 'doctor', count: 10, available: 6, onCall: 2, specialty: 'Emergency Medicine' },
  { role: 'nurse', count: 20, available: 15, onCall: 5, specialty: 'Critical Care' },
  { role: 'respiratory', count: 8, available: 4, onCall: 2, specialty: 'Respiratory Therapy' },
  { role: 'specialist', count: 5, available: 2, onCall: 1, specialty: 'Cardiology' },
];

const activeAlerts: EmergencyAlert[] = [
  { id: '1', type: 'cardiac', severity: 'critical', location: '123 Main St', time: '2 min ago', status: 'dispatched' },
  { id: '2', type: 'trauma', severity: 'high', location: 'Highway 101', time: '5 min ago', status: 'pending' },
  { id: '3', type: 'stroke', severity: 'critical', location: '456 Oak Ave', time: '10 min ago', status: 'dispatched' },
  { id: '4', type: 'respiratory', severity: 'medium', location: '789 Pine Rd', time: '15 min ago', status: 'arrived' },
];

// ============================================
// MAIN COMPONENT
// ============================================
export const Emergency: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'services' | 'icu' | 'alerts'>('overview');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [stats] = useState<EmergencyStats>({
    totalEmergencies: 156, activeEmergencies: 12, avgResponseTime: 8.5, criticalPatients: 5,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getSeverityColor = (severity: EmergencyAlert['severity']) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-500/10 text-red-400 border-red-500/20',
      high: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      medium: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      low: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };
    return colors[severity] || '';
  };

  const getAlertIcon = (type: EmergencyAlert['type']) => {
    const icons: Record<string, React.ElementType> = {
      cardiac: Heart, trauma: AlertCircle, stroke: Activity, respiratory: Users,
    };
    return icons[type] || AlertCircle;
  };

  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-white/[0.04]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center shadow-xl shadow-red-500/20">
              <Truck className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em]">Emergency Response Center</h1>
                <Badge variant="danger" size="xs" className="animate-pulse">LIVE</Badge>
              </div>
              <p className="text-white/35 text-sm mt-1">Real-time emergency monitoring and response coordination</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="glass" size="sm"><Download className="w-4 h-4 mr-1.5" />Export Report</Button>
            <Button variant="gradient" size="sm" onClick={handleRefresh}><RefreshCw className={`w-4 h-4 mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />Refresh</Button>
          </div>
        </motion.div>

        {/* ✅ STATCARDS — Using StatCard component */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Emergencies" value={stats.totalEmergencies} icon={AlertCircle} color="red" change="+15%" trend="up" />
          <StatCard title="Active Emergencies" value={stats.activeEmergencies} icon={Truck} color="orange" change="+3" trend="up" />
          <StatCard title="Avg Response Time" value={`${stats.avgResponseTime}min`} icon={Clock} color="cyan" change="-1.2min" trend="down" />
          <StatCard title="Critical Patients" value={stats.criticalPatients} icon={Heart} color="purple" change="+2" trend="up" />
        </div>

        {/* ✅ ACTIVE BANNER — Using GlassmorphicCard + Badge */}
        <GlassmorphicCard className="p-6 border border-red-500/20 bg-gradient-to-r from-red-600/5 via-orange-600/5 to-amber-600/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Active Emergency Alerts</h3>
                <p className="text-white/40 text-sm">{activeAlerts.length} emergencies currently being handled</p>
              </div>
            </div>
            <Badge variant="danger" size="md" className="gap-2"><Bell className="w-4 h-4" />4 Active</Badge>
          </div>
        </GlassmorphicCard>

        {/* ✅ TABS — Using Button */}
        <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'services', label: 'Services', icon: Truck },
            { id: 'icu', label: 'ICU Tracker', icon: Heart },
            { id: 'alerts', label: 'Active Alerts', icon: Bell },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <Button key={tab.id} variant={activeTab === tab.id ? 'gradient' : 'glass'} size="sm"
                onClick={() => setActiveTab(tab.id as any)} className="gap-2">
                <Icon className="w-4 h-4" />{tab.label}
              </Button>
            );
          })}
        </div>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassmorphicCard className="p-6">
                  <h3 className="text-white font-semibold text-sm mb-6">Emergency Trends (12 Months)</h3>
                  <div className="flex items-end justify-between gap-2 h-48">
                    {[12, 15, 18, 14, 22, 19, 25, 23, 28, 26, 31, 29].map((value, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <motion.div initial={{ height: 0 }} animate={{ height: `${value * 2}px` }} transition={{ duration: 0.5, delay: i * 0.05 }}
                          className="w-full bg-gradient-to-t from-red-500/70 to-orange-400/70 rounded-t-sm" />
                        <span className="text-white/30 text-[10px]">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                      </div>
                    ))}
                  </div>
                </GlassmorphicCard>
                <GlassmorphicCard className="p-6">
                  <h3 className="text-white font-semibold text-sm mb-6">Emergency by Type</h3>
                  <div className="space-y-4">
                    {[{ label: 'Cardiac', value: 35, color: 'bg-red-500' }, { label: 'Trauma', value: 28, color: 'bg-orange-500' }, { label: 'Respiratory', value: 22, color: 'bg-cyan-500' }, { label: 'Stroke', value: 15, color: 'bg-purple-500' }].map(item => (
                      <div key={item.label}>
                        <div className="flex justify-between text-xs mb-1.5"><span className="text-white/50">{item.label}</span><span className="text-white/30">{item.value}%</span></div>
                        <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${item.value}%` }} transition={{ duration: 0.8 }} className={`h-full ${item.color} rounded-full`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassmorphicCard>
              </div>
              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-semibold text-sm mb-4">Recent Alerts</h3>
                <div className="space-y-2">
                  {activeAlerts.slice(0, 3).map(alert => {
                    const Icon = getAlertIcon(alert.type);
                    return (
                      <div key={alert.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${getSeverityColor(alert.severity)}`}><Icon className="w-4 h-4" /></div>
                          <div><p className="text-white text-sm font-medium capitalize">{alert.type} Emergency</p><p className="text-white/30 text-xs">{alert.location}</p></div>
                        </div>
                        <Badge variant={alert.severity === 'critical' ? 'danger' : alert.severity === 'high' ? 'warning' : 'info'} size="xs">{alert.severity}</Badge>
                      </div>
                    );
                  })}
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}


<AnimatePresence mode="wait" initial={false}>
  {activeTab === "services" ? (
    <motion.div
      key="services"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
    >
      
    </motion.div>
  ) : null}
</AnimatePresence>











          {activeTab === 'alerts' && (
            <motion.div key="alerts" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-4">
              {activeAlerts.map(alert => {
                const Icon = getAlertIcon(alert.type);
                return (
                  <GlassmorphicCard key={alert.id} className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${getSeverityColor(alert.severity)}`}><Icon className="w-6 h-6" /></div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-lg font-semibold text-white capitalize">{alert.type} Emergency</h3>
                            <Badge variant={alert.severity === 'critical' ? 'danger' : alert.severity === 'high' ? 'warning' : 'info'} size="xs">{alert.severity}</Badge>
                          </div>
                          <p className="text-white/40 text-sm">{alert.location}</p>
                          <p className="text-white/25 text-xs mt-1">Reported {alert.time}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="glass" size="sm"><MapPin className="w-4 h-4 mr-1.5" />Track</Button>
                        <Button variant="gradient" size="sm"><Truck className="w-4 h-4 mr-1.5" />Dispatch</Button>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/[0.04] flex items-center gap-6 text-sm">
                      <span className="text-white/40">Status: <span className="text-amber-400 capitalize">{alert.status}</span></span>
                      <span className="text-white/40">ETA: <span className="text-cyan-400">8 minutes</span></span>
                    </div>
                  </GlassmorphicCard>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Emergency;