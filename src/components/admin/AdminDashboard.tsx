// src/components/admin/AdminDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  Shield, Users, UserCheck, Building2, Pill,
  Droplet, Calendar, TrendingUp, TrendingDown,
  Activity, AlertCircle, Bell, Settings,
  FileText, MessageSquare, Radio, Zap,
  Server, Clock, HardDrive, Cpu, Wifi,
  CheckCircle, XCircle, Eye, Download,
  ChevronRight, Search, Filter
} from 'lucide-react';
import { AdminDashboardData } from '../../types/admin';

interface AdminDashboardProps {
  adminId: string;
  onNavigate: (page: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  adminId,
  onNavigate
}) => {
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData: AdminDashboardData = {
        stats: {
          totalUsers: 12500,
          totalDoctors: 850,
          totalHospitals: 45,
          totalPharmacies: 120,
          totalBloodDonors: 5000,
          totalAppointments: 45000,
          activeUsers: 3200,
          newUsersToday: 45,
          newUsersThisMonth: 1250,
          verifiedDoctors: 780,
          pendingVerifications: 70,
          blockedUsers: 25,
          totalDonations: 15000,
          totalBloodUnits: 18000,
          livesSaved: 54000
        },
        analytics: {
          userGrowth: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'New Users',
              data: [800, 950, 1100, 1200, 1300, 1250],
              color: '#3B82F6'
            }]
          },
          doctorDistribution: {
            labels: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'],
            datasets: [{
              label: 'Doctors',
              data: [150, 120, 180, 140, 100],
              color: '#10B981'
            }]
          },
          appointmentTrends: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
              label: 'Appointments',
              data: [450, 520, 480, 550, 600, 350, 200],
              color: '#8B5CF6'
            }]
          },
          bloodDonationTrends: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
            datasets: [{
              label: 'Donations',
              data: [2500, 2800, 2600, 3000, 2900],
              color: '#EF4444'
            }]
          },
          revenueAnalytics: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
              label: 'Revenue',
              data: [50000, 55000, 60000, 58000, 65000, 70000],
              color: '#F59E0B'
            }]
          },
          userActivity: [],
          popularDoctors: [],
          topHospitals: []
        },
        pendingVerifications: {
          doctors: 35,
          hospitals: 15,
          pharmacies: 20
        },
        recentActivities: [
          {
            id: '1',
            userId: 'u1',
            userName: 'John Doe',
            userRole: 'client',
            action: 'Appointment Booked',
            description: 'Booked appointment with Dr. Sarah Wilson',
            ipAddress: '192.168.1.1',
            timestamp: '2024-02-15T10:30:00',
            severity: 'info'
          }
        ],
        bloodAlerts: [
          {
            id: '1',
            bloodBank: 'City Blood Bank',
            bloodGroup: 'O-',
            status: 'critical',
            unitsLeft: 5,
            lastUpdated: '2024-02-15T09:00:00'
          }
        ],
        activeEmergencies: [],
        recentFeedbacks: [
          {
            id: '1',
            userId: 'u2',
            userName: 'Sarah Johnson',
            userRole: 'client',
            type: 'complaint',
            subject: 'Appointment delay',
            message: 'Had to wait 45 minutes for my appointment',
            rating: 2,
            status: 'pending',
            priority: 'medium',
            submittedDate: '2024-02-15T08:00:00'
          }
        ],
        securityAlerts: [
          {
            id: '1',
            event: 'Failed Login Attempt',
            userId: 'u3',
            userName: 'Unknown',
            ipAddress: '10.0.0.1',
            userAgent: 'Mozilla/5.0',
            timestamp: '2024-02-15T09:15:00',
            status: 'blocked',
            details: 'Multiple failed attempts from same IP'
          }
        ],
        systemHealth: {
          status: 'healthy',
          uptime: '45 days 12 hours',
          cpuUsage: 35,
          memoryUsage: 62,
          diskUsage: 48,
          activeConnections: 250,
          responseTime: '120ms',
          lastIncident: '2024-01-10'
        }
      };

      setDashboardData(mockData);
      setIsLoading(false);
    }, 1500);
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <Shield className="w-16 h-16 text-blue-600 mx-auto animate-pulse" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mt-4"></div>
          <p className="mt-4 text-gray-600">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-blue-600" />
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">System overview and management</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button className="relative">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              5
            </span>
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
        <MiniStat icon={<Users />} label="Total Users" value="12.5K" color="blue" />
        <MiniStat icon={<UserCheck />} label="Doctors" value="850" color="green" />
        <MiniStat icon={<Building2 />} label="Hospitals" value="45" color="purple" />
        <MiniStat icon={<Pill />} label="Pharmacies" value="120" color="orange" />
        <MiniStat icon={<Droplet />} label="Donors" value="5K" color="red" />
        <MiniStat icon={<Calendar />} label="Appointments" value="45K" color="indigo" />
        <MiniStat icon={<Activity />} label="Active Users" value="3.2K" color="teal" />
        <MiniStat icon={<Zap />} label="Lives Saved" value="54K" color="pink" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left - Main Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Verifications */}
          <div className="grid grid-cols-3 gap-4">
            <VerificationCard
              icon={<UserCheck className="w-6 h-6 text-blue-500" />}
              label="Doctor Verifications"
              count={dashboardData.pendingVerifications.doctors}
              color="blue"
              onClick={() => onNavigate('doctor-verification')}
            />
            <VerificationCard
              icon={<Building2 className="w-6 h-6 text-green-500" />}
              label="Hospital Verifications"
              count={dashboardData.pendingVerifications.hospitals}
              color="green"
              onClick={() => onNavigate('hospital-verification')}
            />
            <VerificationCard
              icon={<Pill className="w-6 h-6 text-purple-500" />}
              label="Pharmacy Verifications"
              count={dashboardData.pendingVerifications.pharmacies}
              color="purple"
              onClick={() => onNavigate('pharmacy-verification')}
            />
          </div>

          {/* System Health */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Server className="w-6 h-6 mr-2 text-blue-500" />
              System Health
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <HealthMetric
                icon={<Cpu />}
                label="CPU Usage"
                value={`${dashboardData.systemHealth.cpuUsage}%`}
                color={dashboardData.systemHealth.cpuUsage > 80 ? 'red' : 'green'}
              />
              <HealthMetric
                icon={<HardDrive />}
                label="Memory"
                value={`${dashboardData.systemHealth.memoryUsage}%`}
                color={dashboardData.systemHealth.memoryUsage > 80 ? 'red' : 'green'}
              />
              <HealthMetric
                icon={<Wifi />}
                label="Connections"
                value={dashboardData.systemHealth.activeConnections.toString()}
                color="blue"
              />
              <HealthMetric
                icon={<Clock />}
                label="Response Time"
                value={dashboardData.systemHealth.responseTime}
                color="green"
              />
            </div>
          </div>

          {/* User Growth Chart Placeholder */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">User Growth Analytics</h2>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Chart: User Growth Over Time</p>
                <p className="text-sm text-gray-500">12.5K total users • +45 today</p>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Activity className="w-6 h-6 mr-2 text-green-500" />
              Recent User Activities
            </h2>
            <div className="space-y-3">
              {dashboardData.recentActivities.length > 0 ? (
                dashboardData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.severity === 'critical' ? 'bg-red-500' :
                      activity.severity === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
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
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Blood Stock Alerts */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center">
                <Droplet className="w-5 h-5 mr-2" />
                Blood Stock Alerts
              </h3>
              <span className="bg-white text-red-600 text-xs px-2 py-1 rounded-full">
                {dashboardData.bloodAlerts.length} Alerts
              </span>
            </div>
            {dashboardData.bloodAlerts.map((alert) => (
              <div key={alert.id} className="bg-red-400/30 rounded-lg p-3 mb-3">
                <div className="flex justify-between mb-1">
                  <span className="font-bold">{alert.bloodGroup}</span>
                  <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded">
                    {alert.status}
                  </span>
                </div>
                <p className="text-sm">{alert.bloodBank}</p>
                <p className="text-sm font-medium mt-1">{alert.unitsLeft} units left</p>
              </div>
            ))}
          </div>

          {/* Pending Feedbacks */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-yellow-500" />
              Recent Feedbacks
            </h3>
            <div className="space-y-3">
              {dashboardData.recentFeedbacks.map((feedback) => (
                <div key={feedback.id} className="border rounded-lg p-3">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium text-sm">{feedback.subject}</span>
                    <span className={`text-xs px-2 py-1 rounded ${
                      feedback.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                      feedback.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {feedback.priority}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{feedback.message}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500">{feedback.userName}</span>
                    <div className="flex space-x-2">
                      <button className="text-xs text-green-600 hover:text-green-700">Resolve</button>
                      <button className="text-xs text-blue-600 hover:text-blue-700">Reply</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Security Alerts */}
          <div className="bg-white rounded-lg shadow-lg p-6">
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
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
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
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const MiniStat: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-3 hover:shadow-lg transition-shadow">
    <div className="flex items-center justify-between mb-1">
      <div className={`p-1.5 bg-${color}-100 rounded-lg`}>
        {icon}
      </div>
      <TrendingUp className="w-3 h-3 text-green-500" />
    </div>
    <p className="text-lg font-bold">{value}</p>
    <p className="text-xs text-gray-600">{label}</p>
  </div>
);

const VerificationCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  count: number;
  color: string;
  onClick: () => void;
}> = ({ icon, label, count, color, onClick }) => (
  <button
    onClick={onClick}
    className={`bg-white rounded-lg shadow p-4 hover:shadow-lg transition-all hover:bg-${color}-50 text-left`}
  >
    <div className="flex items-center space-x-3">
      {icon}
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-xs text-gray-600">{label}</p>
      </div>
    </div>
  </button>
);

const HealthMetric: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className="text-center p-3">
    <div className="flex justify-center mb-2">{icon}</div>
    <p className="text-lg font-bold text-gray-800">{value}</p>
    <p className="text-xs text-gray-600">{label}</p>
  </div>
);

const QuickActionBtn: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
  >
    <div className="w-6 h-6 mb-1">{icon}</div>
    <span className="text-xs">{label}</span>
  </button>
);


// AdminDashboard.tsx - System Health Section
<div className="bg-white rounded-lg shadow-lg p-6">
  <h2>System Health</h2>
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <HealthMetric icon={<Cpu />} label="CPU Usage" value="35%" />
    <HealthMetric icon={<HardDrive />} label="Memory" value="62%" />
    <HealthMetric icon={<Wifi />} label="Connections" value="250" />
    <HealthMetric icon={<Clock />} label="Response Time" value="120ms" />
  </div>
</div>

// System stats in adminService.ts:
- getSystemHealth() → CPU, Memory, Disk, Uptime
- getSystemStats() → Total users, doctors, hospitals
- getSystemAnalytics() → Charts & trends


<div className="bg-white rounded-lg shadow-lg p-6">
  <h2>Recent User Activities</h2>
  <div className="space-y-3">
    {dashboardData.recentActivities.map((activity) => (
      <ActivityItem 
        key={activity.id}
        userName={activity.userName}
        description={activity.description}
        timestamp={activity.timestamp}
        severity={activity.severity}
      />
    ))}
  </div>
</div>


<div className="grid grid-cols-3 gap-4">
  <VerificationCard
    icon={<Building2 />}
    label="Hospital Verifications"
    count={dashboardData.pendingVerifications.hospitals}
  />
</div>


// AdminDashboard.tsx - Blood Stock Section
<div className="bg-gradient-to-r from-red-500 to-red-600">
  <h3>Blood Stock Alerts</h3>
  {bloodAlerts.map(alert => (
    <div>
      <span>{alert.bloodGroup}</span>
      <span>{alert.unitsLeft} units left</span>
      <span>{alert.status}</span>
    </div>
  ))}
</div>

// Donation analytics in adminService.ts:
- getBloodStockAnalytics() → Distribution, trends
- bloodDonationTrends chart
- bloodUsageTrends chart
- criticalAlerts monitoring


// AdminDashboard.tsx - Complete Layout Structure

<AdminDashboard>
  {/* HEADER */}
  <Header>
    <SystemStatus />        ✅ System Analytics
    <NotificationBell />    ✅ Emergency alerts
    <Settings />
  </Header>

  {/* QUICK STATS - 8 Cards */}
  <QuickStats>
    <TotalUsers />          ✅ System Analytics
    <TotalDoctors />        ✅ Hospital Analytics
    <TotalHospitals />      ✅ Hospital Analytics
    <TotalPharmacies />
    <TotalDonors />         ✅ Donation Analytics
    <TotalAppointments />
    <ActiveUsers />         ✅ User Activities
    <LivesSaved />          ✅ Donation Analytics
  </QuickStats>

  {/* MAIN GRID */}
  <MainGrid>
    {/* LEFT COLUMN */}
    <LeftColumn>
      <PendingVerifications />    ✅ Hospital Analytics
      <SystemHealth />            ✅ System Analytics
      <UserGrowthChart />         ✅ System Analytics
      <RecentActivities />        ✅ User Activities
    </LeftColumn>

    {/* RIGHT COLUMN */}
    <RightColumn>
      <BloodStockAlerts />        ✅ Donation Analytics
      <EmergencySection />        ✅ Emergency Monitoring
      <RecentFeedbacks />         ✅ User Activities
      <SecurityAlerts />          ✅ Security Management
      <QuickActions />
    </RightColumn>
  </MainGrid>
</AdminDashboard>