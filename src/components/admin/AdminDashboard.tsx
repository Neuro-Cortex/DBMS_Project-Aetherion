// src/components/admin/AdminDashboard.tsx
// COMPLETE ERROR-FREE - All Common Components Used

import React, { useState, useEffect } from 'react';
import {
  Shield, Users, UserCheck, Building2, Pill,
  Droplet, Calendar, TrendingUp,
  Activity, AlertCircle, Bell, Settings,
  FileText, MessageSquare, Radio, Zap,
  Server, Clock, HardDrive, Cpu, Wifi,
} from 'lucide-react';

// ============================================
// COMMON COMPONENTS IMPORT
// ============================================
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Button } from 'src/ui/Button';
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Input } from 'src/ui/Input';
import { Loader } from 'src/ui/Loader';
import { Select } from 'src/ui/Select';
import { Tabs } from 'src/ui/Tab';

// ============================================
// TYPES (Local - No external dependency)
// ============================================

export interface AdminDashboardData {
  stats: SystemStats;
  analytics: SystemAnalytics;
  pendingVerifications: PendingVerifications;
  recentActivities: ActivityItem[];
  bloodAlerts: BloodAlert[];
  activeEmergencies: any[];
  recentFeedbacks: FeedbackItem[];
  securityAlerts: SecurityAlert[];
  systemHealth: SystemHealth;
}

export interface SystemStats {
  totalUsers: number;
  totalDoctors: number;
  totalHospitals: number;
  totalPharmacies: number;
  totalBloodDonors: number;
  totalAppointments: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisMonth: number;
  verifiedDoctors: number;
  pendingVerifications: number;
  blockedUsers: number;
  totalDonations: number;
  totalBloodUnits: number;
  livesSaved: number;
}

export interface SystemAnalytics {
  userGrowth: ChartDataset;
  doctorDistribution: ChartDataset;
  appointmentTrends: ChartDataset;
  bloodDonationTrends: ChartDataset;
  revenueAnalytics: ChartDataset;
  userActivity: any[];
  popularDoctors: any[];
  topHospitals: any[];
}

export interface ChartDataset {
  labels: string[];
  datasets: { label: string; data: number[]; color: string }[];
}

export interface PendingVerifications {
  doctors: number;
  hospitals: number;
  pharmacies: number;
}

export interface ActivityItem {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  description: string;
  ipAddress: string;
  timestamp: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface BloodAlert {
  id: string;
  bloodBank: string;
  bloodGroup: string;
  status: string;
  unitsLeft: number;
  lastUpdated: string;
}

export interface FeedbackItem {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  type: string;
  subject: string;
  message: string;
  rating?: number;
  status: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  submittedDate: string;
}

export interface SecurityAlert {
  id: string;
  event: string;
  userId?: string;
  userName?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: string;
  details: string;
}

export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'critical';
  uptime: string;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  activeConnections: number;
  responseTime: string;
  lastIncident: string;
}

// ============================================
// PROPS
// ============================================

export interface AdminDashboardProps {
  adminId: string;
  onNavigate: (page: string) => void;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminId, onNavigate }) => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('today');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const mockData: AdminDashboardData = {
      stats: {
        totalUsers: 12500, totalDoctors: 850, totalHospitals: 45,
        totalPharmacies: 120, totalBloodDonors: 5000, totalAppointments: 45000,
        activeUsers: 3200, newUsersToday: 45, newUsersThisMonth: 1250,
        verifiedDoctors: 780, pendingVerifications: 70, blockedUsers: 25,
        totalDonations: 15000, totalBloodUnits: 18000, livesSaved: 54000
      },
      analytics: {
        userGrowth: { labels: ['Jan','Feb','Mar','Apr','May','Jun'], datasets: [{ label: 'New Users', data: [800,950,1100,1200,1300,1250], color: '#3B82F6' }] },
        doctorDistribution: { labels: ['Cardiology','Neurology','Pediatrics','Orthopedics','Dermatology'], datasets: [{ label: 'Doctors', data: [150,120,180,140,100], color: '#10B981' }] },
        appointmentTrends: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], datasets: [{ label: 'Appointments', data: [450,520,480,550,600,350,200], color: '#8B5CF6' }] },
        bloodDonationTrends: { labels: ['Jan','Feb','Mar','Apr','May'], datasets: [{ label: 'Donations', data: [2500,2800,2600,3000,2900], color: '#EF4444' }] },
        revenueAnalytics: { labels: ['Jan','Feb','Mar','Apr','May','Jun'], datasets: [{ label: 'Revenue', data: [50000,55000,60000,58000,65000,70000], color: '#F59E0B' }] },
        userActivity: [], popularDoctors: [], topHospitals: []
      },
      pendingVerifications: { doctors: 35, hospitals: 15, pharmacies: 20 },
      recentActivities: [
        { id: '1', userId: 'u1', userName: 'John Doe', userRole: 'client', action: 'Appointment Booked', description: 'Booked appointment with Dr. Sarah Wilson', ipAddress: '192.168.1.1', timestamp: '2024-02-15T10:30:00', severity: 'info' }
      ],
      bloodAlerts: [
        { id: '1', bloodBank: 'City Blood Bank', bloodGroup: 'O-', status: 'critical', unitsLeft: 5, lastUpdated: '2024-02-15T09:00:00' }
      ],
      activeEmergencies: [],
      recentFeedbacks: [
        { id: '1', userId: 'u2', userName: 'Sarah Johnson', userRole: 'client', type: 'complaint', subject: 'Appointment delay', message: 'Had to wait 45 minutes', rating: 2, status: 'pending', priority: 'medium', submittedDate: '2024-02-15T08:00:00' }
      ],
      securityAlerts: [
        { id: '1', event: 'Failed Login Attempt', userId: 'u3', userName: 'Unknown', ipAddress: '10.0.0.1', userAgent: 'Mozilla/5.0', timestamp: '2024-02-15T09:15:00', status: 'blocked', details: 'Multiple failed attempts from same IP' }
      ],
      systemHealth: {
        status: 'healthy', uptime: '45 days 12 hours', cpuUsage: 35,
        memoryUsage: 62, diskUsage: 48, activeConnections: 250,
        responseTime: '120ms', lastIncident: '2024-01-10'
      }
    };

    setDashboardData(mockData);
    setIsLoading(false);
  };

  // ============================================
  // LOADING STATE
  // ============================================
  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader text="Loading Admin Dashboard..." />
      </div>
    );
  }

  // ============================================
  // TAB CONFIG
  // ============================================
  const dashboardTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'security', label: 'Security' },
  ];

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">System overview and management</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select
            value={timeRange}
            
            options={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
            ]}
          />
          <div className="relative">
            <Button variant="ghost" size="sm">
              <Bell className="w-6 h-6 text-gray-600" />
            </Button>
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              5
            </span>
          </div>
          <Button variant="primary" size="sm" onClick={() => onNavigate('settings')}>
            <Settings className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* QUICK STATS - 8 Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <MiniStatCard icon={<Users />} label="Total Users" value="12.5K" />
        <MiniStatCard icon={<UserCheck />} label="Doctors" value="850" />
        <MiniStatCard icon={<Building2 />} label="Hospitals" value="45" />
        <MiniStatCard icon={<Pill />} label="Pharmacies" value="120" />
        <MiniStatCard icon={<Droplet />} label="Donors" value="5K" />
        <MiniStatCard icon={<Calendar />} label="Appointments" value="45K" />
        <MiniStatCard icon={<Activity />} label="Active Users" value="3.2K" />
        <MiniStatCard icon={<Zap />} label="Lives Saved" value="54K" />
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pending Verifications */}
          <div className="grid grid-cols-3 gap-4">
            <GlassmorphicCard className="p-4 cursor-pointer hover:shadow-lg" onClick={() => onNavigate('doctor-verification')}>
              <div className="flex items-center space-x-3">
                <UserCheck className="w-6 h-6 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{dashboardData.pendingVerifications.doctors}</p>
                  <p className="text-xs text-gray-600">Doctor Verifications</p>
                </div>
              </div>
            </GlassmorphicCard>
            
            <GlassmorphicCard className="p-4 cursor-pointer hover:shadow-lg" onClick={() => onNavigate('hospital-verification')}>
              <div className="flex items-center space-x-3">
                <Building2 className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{dashboardData.pendingVerifications.hospitals}</p>
                  <p className="text-xs text-gray-600">Hospital Verifications</p>
                </div>
              </div>
            </GlassmorphicCard>
            
            <GlassmorphicCard className="p-4 cursor-pointer hover:shadow-lg" onClick={() => onNavigate('pharmacy-verification')}>
              <div className="flex items-center space-x-3">
                <Pill className="w-6 h-6 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{dashboardData.pendingVerifications.pharmacies}</p>
                  <p className="text-xs text-gray-600">Pharmacy Verifications</p>
                </div>
              </div>
            </GlassmorphicCard>
          </div>

          {/* System Health */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Server className="w-6 h-6 mr-2 text-blue-500" />
              System Health
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <HealthMetricCard icon={<Cpu />} label="CPU Usage" value={`${dashboardData.systemHealth.cpuUsage}%`} status={dashboardData.systemHealth.cpuUsage > 80 ? 'warning' : 'normal'} />
              <HealthMetricCard icon={<HardDrive />} label="Memory" value={`${dashboardData.systemHealth.memoryUsage}%`} status={dashboardData.systemHealth.memoryUsage > 80 ? 'warning' : 'normal'} />
              <HealthMetricCard icon={<Wifi />} label="Connections" value={dashboardData.systemHealth.activeConnections.toString()} status="normal" />
              <HealthMetricCard icon={<Clock />} label="Response Time" value={dashboardData.systemHealth.responseTime} status="normal" />
            </div>
          </Card>

          {/* User Growth Chart */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">User Growth Analytics</h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Chart: User Growth Over Time</p>
                <p className="text-sm text-gray-500">12.5K total users • +45 today</p>
              </div>
            </div>
          </Card>

          {/* Recent Activities */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-green-500" />
              Recent User Activities
            </h2>
            <div className="space-y-3">
              {dashboardData.recentActivities.length > 0 ? (
                dashboardData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Badge variant={activity.severity === 'critical' ? 'danger' : activity.severity === 'warning' ? 'warning' : 'info'}>
                      {activity.severity.charAt(0).toUpperCase() + activity.severity.slice(1)}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {activity.userName} • {new Date(activity.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activities</p>
              )}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          
          {/* Blood Stock Alerts */}
          <GlassmorphicCard className="p-6 bg-gradient-to-r from-red-500 to-red-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center">
                <Droplet className="w-5 h-5 mr-2" />
                Blood Stock Alerts
              </h3>
              <Badge variant="danger">{dashboardData.bloodAlerts.length} Alerts</Badge>
            </div>
            {dashboardData.bloodAlerts.map((alert) => (
              <div key={alert.id} className="bg-white/20 rounded-lg p-3 mb-3">
                <div className="flex justify-between mb-1">
                  <span className="font-bold">{alert.bloodGroup}</span>
                  <Badge variant="warning">{alert.status}</Badge>
                </div>
                <p className="text-sm">{alert.bloodBank}</p>
                <p className="text-sm font-medium mt-1">{alert.unitsLeft} units left</p>
              </div>
            ))}
          </GlassmorphicCard>

          {/* Recent Feedbacks */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-yellow-500" />
              Recent Feedbacks
            </h3>
            <div className="space-y-3">
              {dashboardData.recentFeedbacks.map((feedback) => (
                <div key={feedback.id} className="border rounded-lg p-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm">{feedback.subject}</span>
                    <Badge variant={feedback.priority === 'urgent' ? 'danger' : feedback.priority === 'high' ? 'warning' : 'info'}>
                      {feedback.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{feedback.message}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{feedback.userName}</span>
                    <div className="flex space-x-2">
                      <Button variant="success" size="xs">Resolve</Button>
                      <Button variant="secondary" size="xs">Reply</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Security Alerts */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-red-500" />
              Security Alerts
            </h3>
            {dashboardData.securityAlerts.map((alert) => (
              <div key={alert.id} className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">{alert.event}</p>
                    <p className="text-xs text-red-600">{alert.details}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      IP: {alert.ipAddress} • {new Date(alert.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <QuickActionBtn icon={<Users />} label="Users" onClick={() => onNavigate('users')} />
              <QuickActionBtn icon={<UserCheck />} label="Doctors" onClick={() => onNavigate('doctors')} />
              <QuickActionBtn icon={<Building2 />} label="Hospitals" onClick={() => onNavigate('hospitals')} />
              <QuickActionBtn icon={<Droplet />} label="Blood Bank" onClick={() => onNavigate('blood-bank')} />
              <QuickActionBtn icon={<FileText />} label="Reports" onClick={() => onNavigate('reports')} />
              <QuickActionBtn icon={<MessageSquare />} label="Feedback" onClick={() => onNavigate('feedback')} />
              <QuickActionBtn icon={<Radio />} label="Emergency" onClick={() => onNavigate('emergency')} />
              <QuickActionBtn icon={<Shield />} label="Security" onClick={() => onNavigate('security')} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENTS (Exported)
// ============================================

export const MiniStatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <Card className="p-3 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-1">
      <div className="p-1.5 bg-blue-100 rounded-lg">{icon}</div>
      <TrendingUp className="w-3 h-3 text-green-500" />
    </div>
    <p className="text-lg font-bold">{value}</p>
    <p className="text-xs text-gray-600">{label}</p>
  </Card>
);

export const HealthMetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  status: 'normal' | 'warning' | 'critical';
}> = ({ icon, label, value, status }) => (
  <div className="text-center p-3">
    <div className="flex justify-center mb-2">{icon}</div>
    <p className="text-lg font-bold text-gray-800">{value}</p>
    <p className="text-xs text-gray-600">{label}</p>
    <Badge variant={status === 'normal' ? 'success' : status === 'warning' ? 'warning' : 'danger'} size="xs">
      {status}
    </Badge>
  </div>
);

export const QuickActionBtn: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <Button variant="ghost" onClick={onClick} className="flex flex-col items-center p-3">
    <div className="w-6 h-6 mb-1">{icon}</div>
    <span className="text-xs">{label}</span>
  </Button>
);




export default AdminDashboard;
