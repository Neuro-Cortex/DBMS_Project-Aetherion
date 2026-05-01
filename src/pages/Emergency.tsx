// src/pages/Emergency.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ambulance, Heart, AlertCircle, Activity, 
  Users, Stethoscope, Clock, MapPin, Phone,
  Droplet, Lungs, Syringe, Shield, Award,
  TrendingUp, TrendingDown, Bell, Plus,
  Search, Filter, Download, RefreshCw
} from 'lucide-react';
import { EmergencyServices } from '../components/hospital/EmergencyServices';
import { ICUTracker } from '../components/hospital/ICUTracker';
import { GlassmorphicCard } from '../components/ui/GlassmorphicCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { StatCard } from '../components/dashboard/StatCard';

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

// ============================================
// MOCK DATA
// ============================================

const services = [
  { id: '1', name: 'Ambulance Unit Alpha', type: 'ambulance', status: 'available', location: { lat: 40.7, lng: -74, address: 'Downtown' }, eta: 8, provider: 'City EMS', phone: '+1 (555) 100-1001', capacity: 2, currentLoad: 0, rating: 4.8 },
  { id: '2', name: 'Ambulance Unit Bravo', type: 'ambulance', status: 'dispatched', location: { lat: 40.7, lng: -74, address: 'Midtown' }, eta: 12, provider: 'Metro Ambulance', phone: '+1 (555) 100-1002', capacity: 2, currentLoad: 1, rating: 4.6 },
  { id: '3', name: 'Ambulance Unit Charlie', type: 'ambulance', status: 'available', location: { lat: 40.7, lng: -74, address: 'Brooklyn' }, eta: 15, provider: 'Life Support', phone: '+1 (555) 100-1003', capacity: 2, currentLoad: 0, rating: 4.9 },
  { id: '4', name: 'Emergency Room - City Hospital', type: 'emergency-room', status: 'busy', location: { lat: 40.7, lng: -74, address: 'City Hospital' }, eta: 0, provider: 'City Hospital', phone: '+1 (555) 911-0001', capacity: 10, currentLoad: 7, rating: 4.7 },
  { id: '5', name: 'Emergency Room - Metro Medical', type: 'emergency-room', status: 'available', location: { lat: 40.7, lng: -74, address: 'Metro Medical Center' }, eta: 0, provider: 'Metro Medical', phone: '+1 (555) 911-0002', capacity: 8, currentLoad: 4, rating: 4.5 },
];

const icuBeds = { 
  total: 50, 
  available: 5, 
  occupied: 45, 
  covid: 15, 
  nonCovid: 30, 
  emergency: 8,
  cardiac: 10,
  pediatric: 5,
  neonatal: 3
};

const resources = [
  { id: '1', type: 'ventilator', total: 30, available: 5, status: 'critical', lastServiced: '2024-01-01' },
  { id: '2', type: 'monitor', total: 50, available: 20, status: 'operational', lastServiced: '2024-02-01' },
  { id: '3', type: 'defibrillator', total: 15, available: 8, status: 'operational', lastServiced: '2024-02-15' },
  { id: '4', type: 'infusion pump', total: 40, available: 12, status: 'low', lastServiced: '2024-01-20' },
  { id: '5', type: 'oxygen cylinder', total: 100, available: 35, status: 'critical', lastServiced: '2024-03-01' },
];

const staff = [
  { role: 'doctor', count: 10, available: 6, onCall: 2, specialty: 'Emergency Medicine' },
  { role: 'nurse', count: 20, available: 15, onCall: 5, specialty: 'Critical Care' },
  { role: 'paramedic', count: 15, available: 10, onCall: 3, specialty: 'Pre-hospital Care' },
  { role: 'technician', count: 8, available: 4, onCall: 2, specialty: 'Lab & Imaging' },
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
  const [stats, setStats] = useState<EmergencyStats>({
    totalEmergencies: 156,
    activeEmergencies: 12,
    avgResponseTime: 8.5,
    criticalPatients: 5,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const getSeverityColor = (severity: EmergencyAlert['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'high': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getAlertTypeIcon = (type: EmergencyAlert['type']) => {
    switch (type) {
      case 'cardiac': return Heart;
      case 'trauma': return AlertCircle;
      case 'stroke': return Activity;
      case 'respiratory': return Lungs;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-red-500/20 rounded-xl flex items-center justify-center">
                <Ambulance className="w-5 h-5 text-red-400 animate-pulse" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Emergency Response Center</h1>
              <Badge variant="danger" size="sm" pulse>Live</Badge>
            </div>
            <p className="text-white/60">Real-time emergency monitoring and response coordination</p>
          </div>
          <div className="flex gap-3">
            <Button variant="glass" size="sm" icon={Download} onClick={handleRefresh}>
              Export Report
            </Button>
            <Button variant="gradient" size="sm" icon={RefreshCw} isLoading={isRefreshing}>
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard title="Total Emergencies" value={stats.totalEmergencies} icon={AlertCircle} variant="neon" color="red" trend={{ value: 15, isPositive: false }} />
          <StatCard title="Active Emergencies" value={stats.activeEmergencies} icon={Ambulance} variant="neon" color="orange" trend={{ value: 3, isPositive: true }} />
          <StatCard title="Avg Response Time" value={`${stats.avgResponseTime}min`} icon={Clock} variant="neon" color="cyan" trend={{ value: 1.2, isPositive: false }} />
          <StatCard title="Critical Patients" value={stats.criticalPatients} icon={Heart} variant="neon" color="purple" trend={{ value: 2, isPositive: true }} />
        </div>

        {/* Active Emergency Alert Banner */}
        <div className="bg-gradient-to-r from-red-600/20 via-orange-600/20 to-yellow-600/20 rounded-2xl p-6 border border-red-500/30 animate-pulse">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center animate-ping">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Active Emergency Alerts</h3>
                <p className="text-white/60 text-sm">4 emergencies currently being handled</p>
              </div>
            </div>
            <Button variant="danger" size="sm" icon={Bell}>
              View All Alerts
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-white/10 rounded-xl w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'services', label: 'Services', icon: Ambulance },
            { id: 'icu', label: 'ICU Tracker', icon: Heart },
            { id: 'alerts', label: 'Active Alerts', icon: Bell },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Emergency Stats */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <GlassmorphicCard variant="glass" className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    Emergency Trends
                  </h3>
                  <div className="h-64 flex items-end justify-between gap-2">
                    {[12, 15, 18, 14, 22, 19, 25, 23, 28, 26, 31, 29].map((value, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div 
                          className="w-full bg-gradient-to-t from-red-500 to-orange-500 rounded-lg transition-all duration-500 hover:scale-105"
                          style={{ height: `${value * 2}px` }}
                        />
                        <span className="text-white/40 text-xs">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
                      </div>
                    ))}
                  </div>
                </GlassmorphicCard>

                <GlassmorphicCard variant="glass" className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-cyan-400" />
                    Emergency by Type
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Cardiac', value: 35, color: 'from-red-500 to-pink-500' },
                      { label: 'Trauma', value: 28, color: 'from-orange-500 to-yellow-500' },
                      { label: 'Respiratory', value: 22, color: 'from-cyan-500 to-blue-500' },
                      { label: 'Stroke', value: 15, color: 'from-purple-500 to-indigo-500' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-white/70">{item.label}</span>
                          <span className="text-white">{item.value}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <div 
                            className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-500`}
                            style={{ width: `${item.value}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassmorphicCard>
              </div>

              {/* Active Alerts Preview */}
              <GlassmorphicCard variant="glass" className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">Recent Emergency Alerts</h3>
                  <Button variant="ghost" size="xs">View All</Button>
                </div>
                <div className="space-y-3">
                  {activeAlerts.slice(0, 3).map((alert) => {
                    const Icon = getAlertTypeIcon(alert.type);
                    return (
                      <div key={alert.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${getSeverityColor(alert.severity)}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-white font-medium capitalize">{alert.type} Emergency</p>
                            <p className="text-white/40 text-xs">{alert.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getSeverityColor(alert.severity)} size="xs">
                            {alert.severity}
                          </Badge>
                          <p className="text-white/40 text-xs mt-1">{alert.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {activeTab === 'services' && (
            <motion.div
              key="services"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <EmergencyServices services={services} />
            </motion.div>
          )}

          {activeTab === 'icu' && (
            <motion.div
              key="icu"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <ICUTracker icuBeds={icuBeds} resources={resources} staff={staff} realTime />
            </motion.div>
          )}

          {activeTab === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {activeAlerts.map((alert) => {
                const Icon = getAlertTypeIcon(alert.type);
                return (
                  <GlassmorphicCard key={alert.id} variant="glass" className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${getSeverityColor(alert.severity)}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold text-white capitalize">{alert.type} Emergency</h3>
                            <Badge className={getSeverityColor(alert.severity)} size="sm">
                              {alert.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-white/60 text-sm">{alert.location}</p>
                          <p className="text-white/40 text-xs mt-1">Reported {alert.time}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button variant="glass" size="sm" icon={MapPin}>
                          Track
                        </Button>
                        <Button variant="gradient" size="sm" icon={Ambulance}>
                          Dispatch
                        </Button>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-white/60">Status: <span className="text-yellow-400 capitalize">{alert.status}</span></span>
                        <span className="text-white/60">ETA: <span className="text-cyan-400">8 minutes</span></span>
                      </div>
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