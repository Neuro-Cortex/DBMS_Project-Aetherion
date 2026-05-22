// src/components/hospital/HospitalDashboard.tsx
// NEXT-LEVEL UI - All Common Components Used
// Original code preserved + enhanced

import React, { useState, useEffect } from 'react';
import {
  Building2, Bed, Activity, Droplet, Wind,
  Truck, AlertCircle, TrendingUp, TrendingDown,
  Users, Stethoscope, Phone, MapPin, Star,
  Bell, Settings, Heart, Thermometer,
} from 'lucide-react';
import { motion } from 'framer-motion';

// ============================================
// COMMON COMPONENTS
// ============================================
import { Avatar } from 'src/ui/Avatar';
import { Badge } from '../common/Badge';
import { Button } from 'src/ui/Button';
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Input } from 'src/ui/Input';
import { Loader } from 'src/ui/Loader';
import { Select } from 'src/ui/Select';
import { Tabs } from 'src/ui/Tab';
import { Table } from 'src/ui/Table';

// ============================================
// TYPES (Preserved from original)
// ============================================

import {
  HospitalDashboardData,
  WorkingHours,
  VisitingHours,
  BloodGroup,
  HospitalActivity,
} from '../../types/hospital';

// ============================================
// PROPS (Preserved)
// ============================================

interface HospitalDashboardProps {
  hospitalId?: string;
  onNavigate?: (page: string) => void;
}

// ============================================
// DEFAULTS (Preserved)
// ============================================

const defaultDayHours = { open: '08:00', close: '20:00', isOpen: true };

const defaultWorkingHours: WorkingHours = {
  monday: defaultDayHours,
  tuesday: defaultDayHours,
  wednesday: defaultDayHours,
  thursday: defaultDayHours,
  friday: defaultDayHours,
  saturday: { open: '09:00', close: '14:00', isOpen: true },
  sunday: { open: '09:00', close: '12:00', isOpen: false },
};

const defaultVisitingHours: VisitingHours = {
  morning: { start: '10:00', end: '12:00' },
  evening: { start: '17:00', end: '19:00' },
};

// ============================================
// MAIN COMPONENT
// ============================================

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({
  hospitalId = 'default-hospital',
  onNavigate = () => {},
}) => {
  const [dashboardData, setDashboardData] = useState<HospitalDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    fetchDashboardData();
  }, [hospitalId, timeRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData: HospitalDashboardData = {
        hospital: {
          id: hospitalId,
          name: 'City General Hospital',
          registrationNumber: 'HOSP123456',
          type: 'private',
          phone: '+1 (555) 999-8888',
          emergencyPhone: '911',
          email: 'info@citygeneral.com',
          address: {
            street: '123 Medical Center Dr',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA',
          },
          rating: 4.5,
          reviewCount: 1250,
          totalBeds: 500,
          occupiedBeds: 350,
          availableBeds: 150,
          icuTotalBeds: 50,
          icuOccupiedBeds: 35,
          icuAvailableBeds: 15,
          icuWithVentilator: 20,
          icuWithoutVentilator: 30,
          emergencyServiceStatus: 'active',
          emergencyResponseTime: '8 min',
          ambulanceCount: 15,
          ambulanceAvailable: 10,
          oxygenCylinders: {
            total: 200, available: 150, inUse: 40, reserved: 10,
            lastRefilled: '2024-02-10', supplier: 'Oxygen Supply Co.', cylinderTypes: [],
          },
          bloodBank: {
            isAvailable: true, bloodStock: [], lastUpdated: '2024-02-15',
            totalUnits: 500, expiryAlerts: 5,
          },
          departments: [],
          totalDoctors: 150, totalNurses: 300, totalStaff: 500,
          services: [], facilities: [], insuranceAccepted: [],
          workingHours: defaultWorkingHours,
          visitingHours: defaultVisitingHours,
          coordinates: { latitude: 40.7128, longitude: -74.006 },
          isActive: true, isVerified: true,
          createdAt: '2020-01-01', updatedAt: '2024-02-15',
        },
        todayStats: { totalPatients: 250, newAdmissions: 25, discharges: 20, emergencies: 15, surgeries: 8, deaths: 1, births: 3 },
        bedStats: { total: 500, occupied: 350, available: 150, reserved: 25, occupancyRate: 70, byDepartment: [] },
        icuStats: { total: 50, occupied: 35, available: 15, onVentilator: 12, criticalPatients: 8, averageStay: '5 days' },
        bloodStats: { totalUnits: 500, expiringSoon: 25, criticalGroups: ['O-', 'AB-'] as BloodGroup[], todayRequests: 10, todayDonations: 15 },
        oxygenStats: { totalCylinders: 200, inUse: 40, available: 150, reserved: 10, daysLeft: 7 },
        emergencyStats: { todayEmergencies: 15, activeEmergencies: 3, averageResponseTime: '8 min', ambulancesDispatched: 8 },
        ambulanceStats: { total: 15, available: 10, onCall: 4, inMaintenance: 1 },
        recentActivities: [
          { id: '1', type: 'admission', description: 'Patient John Doe admitted to Cardiology', time: '10:30 AM', department: 'Cardiology' },
          { id: '2', type: 'emergency', description: 'Emergency surgery completed for Sarah Johnson', time: '11:00 AM', department: 'Surgery' },
          { id: '3', type: 'discharge', description: 'Patient Mike Wilson discharged from Orthopedics', time: '11:30 AM', department: 'Orthopedics' },
        ],
        pendingApprovals: [
          { id: '1', type: 'doctor', name: 'Dr. Emily White', details: 'Cardiologist - New application', requestDate: '2024-02-14', priority: 'normal' },
          { id: '2', type: 'blood-donor', name: 'Robert Brown', details: 'Blood donor registration - B+', requestDate: '2024-02-15', priority: 'normal' },
        ],
        alerts: [
          { id: '1', type: 'critical', message: 'O- blood stock below critical level', time: '09:00 AM', isRead: false },
          { id: '2', type: 'warning', message: 'ICU bed occupancy above 70%', time: '10:00 AM', isRead: false },
        ],
        analytics: {
          patientFlow: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], admissions: [25,30,28,35,32,20,15], discharges: [20,25,22,30,28,18,15] },
          bedOccupancy: { labels: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'], rates: [65,70,68,75,72,60,55] },
          bloodUsage: { labels: ['Jan','Feb','Mar'], used: [150,180,165], donated: [200,190,210] },
          revenue: { labels: ['Jan','Feb','Mar'], amount: [500000,520000,510000] },
        },
      };
      setDashboardData(mockData);
      setIsLoading(false);
    }, 1500);
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader type="spinner" message="Loading Hospital Dashboard..." />
      </div>
    );
  }

  const { hospital } = dashboardData;
  const icuOccupancy = dashboardData.icuStats.total > 0
    ? (dashboardData.icuStats.occupied / dashboardData.icuStats.total) * 100
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============================================ */}
      {/* HERO HEADER - Glassmorphic */}
      {/* ============================================ */}
      <GlassmorphicCard className="rounded-none border-0 bg-gradient-to-r from-blue-800 via-blue-900 to-indigo-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              <Avatar name={hospital.name} size="xl" className="bg-white text-blue-800 font-bold text-2xl" />
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-3xl font-bold">{hospital.name}</h1>
                  <Badge variant="success">{hospital.isVerified ? '✓ Verified' : 'Pending'}</Badge>
                  <Badge variant={hospital.emergencyServiceStatus === 'active' ? 'success' : 'warning'}>
                    ER: {hospital.emergencyServiceStatus}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 mt-2 text-blue-100 text-sm">
                  <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" />{hospital.address.city}, {hospital.address.state}</span>
                  <span className="flex items-center"><Phone className="w-4 h-4 mr-1" />{hospital.phone}</span>
                  <span className="flex items-center"><Star className="w-4 h-4 mr-1 text-yellow-400" />{hospital.rating} ({hospital.reviewCount})</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
                options={[
                  { value: 'today', label: 'Today' },
                  { value: 'week', label: 'This Week' },
                  { value: 'month', label: 'This Month' },
                ]}
                className="text-white"
              />
              <div className="relative">
                <Button variant="ghost" className="text-white">
                  <Bell className="w-6 h-6" />
                </Button>
                {dashboardData.alerts.filter((a) => !a.isRead).length > 0 && (
                  <Badge variant="danger" size="xs" className="absolute -top-1 -right-1">
                    {dashboardData.alerts.filter((a) => !a.isRead).length}
                  </Badge>
                )}
              </div>
              <Button variant="glassmorphic" onClick={() => onNavigate('settings')}>
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </GlassmorphicCard>

      {/* ============================================ */}
      {/* QUICK STATS - 8 Cards */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-6 -mt-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          {[
            { icon: <Bed className="w-5 h-5 text-blue-500" />, label: 'Beds', value: hospital.availableBeds.toString(), sub: `/${hospital.totalBeds}`, color: 'blue' },
            { icon: <Activity className="w-5 h-5 text-red-500" />, label: 'ICU', value: hospital.icuAvailableBeds.toString(), sub: `/${hospital.icuTotalBeds}`, color: 'red' },
            { icon: <Droplet className="w-5 h-5 text-red-600" />, label: 'Blood', value: dashboardData.bloodStats.totalUnits.toString(), sub: `${dashboardData.bloodStats.expiringSoon} exp`, color: 'red' },
            { icon: <Wind className="w-5 h-5 text-green-500" />, label: 'Oxygen', value: dashboardData.oxygenStats.available.toString(), sub: `/${dashboardData.oxygenStats.totalCylinders}`, color: 'green' },
            { icon: <Truck className="w-5 h-5 text-orange-500" />, label: 'Ambulance', value: dashboardData.ambulanceStats.available.toString(), sub: `/${dashboardData.ambulanceStats.total}`, color: 'orange' },
            { icon: <AlertCircle className="w-5 h-5 text-yellow-500" />, label: 'Emergency', value: dashboardData.emergencyStats.todayEmergencies.toString(), sub: 'Today', color: 'yellow' },
            { icon: <Users className="w-5 h-5 text-purple-500" />, label: 'Patients', value: dashboardData.todayStats.totalPatients.toString(), sub: `${dashboardData.todayStats.newAdmissions} new`, color: 'purple' },
            { icon: <Stethoscope className="w-5 h-5 text-teal-500" />, label: 'Surgeries', value: dashboardData.todayStats.surgeries.toString(), sub: 'Today', color: 'teal' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-3 text-center hover:shadow-lg transition-all">
                <div className={`p-2 bg-${stat.color}-100 rounded-xl inline-flex mb-2`}>{stat.icon}</div>
                <p className="text-xl font-bold">{stat.value}</p>
                <p className="text-[10px] text-gray-500">{stat.label}</p>
                <p className="text-[10px] text-gray-400">{stat.sub}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ============================================ */}
      {/* MAIN GRID */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-6 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Activity */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                Today's Hospital Activity
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'New Admissions', value: dashboardData.todayStats.newAdmissions, icon: <TrendingUp className="w-4 h-4 text-green-500" />, color: 'green' },
                  { label: 'Discharges', value: dashboardData.todayStats.discharges, icon: <TrendingDown className="w-4 h-4 text-orange-500" />, color: 'orange' },
                  { label: 'Emergencies', value: dashboardData.todayStats.emergencies, icon: <AlertCircle className="w-4 h-4 text-red-500" />, color: 'red' },
                  { label: 'Deaths', value: dashboardData.todayStats.deaths, icon: <Heart className="w-4 h-4 text-gray-500" />, color: 'gray' },
                ].map((item, i) => (
                  <div key={i} className="text-center p-4 bg-gray-50 rounded-xl">
                    <div className="flex justify-center mb-2">{item.icon}</div>
                    <p className="text-2xl font-bold">{item.value}</p>
                    <p className="text-xs text-gray-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Bed & ICU Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Bed className="w-5 h-5 mr-2 text-blue-500" /> Bed Status
                </h3>
                <div className="space-y-3">
                  <ProgressBar label="Occupancy Rate" value={dashboardData.bedStats.occupancyRate} color="blue" />
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Occupied</span><span className="font-medium">{dashboardData.bedStats.occupied}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Available</span><span className="font-medium text-green-600">{dashboardData.bedStats.available}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Reserved</span><span className="font-medium text-yellow-600">{dashboardData.bedStats.reserved}</span></div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Thermometer className="w-5 h-5 mr-2 text-red-500" /> ICU Status
                </h3>
                <div className="space-y-3">
                  <ProgressBar label="ICU Occupancy" value={icuOccupancy} color="red" />
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Available</span><span className="font-medium text-green-600">{dashboardData.icuStats.available}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">On Ventilator</span><span className="font-medium">{dashboardData.icuStats.onVentilator}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-gray-500">Critical</span><span className="font-medium text-red-600">{dashboardData.icuStats.criticalPatients}</span></div>
                </div>
              </Card>
            </div>

            {/* Recent Activities */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activities</h2>
              <div className="space-y-3">
                {dashboardData.recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-all">
                    <ActivityIcon type={activity.type} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{activity.time}{activity.department ? ` • ${activity.department}` : ''}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">
            {/* Emergency Status */}
            <Card className={`p-5 ${hospital.emergencyServiceStatus === 'active' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
              <div className="flex justify-between mb-3">
                <h3 className="font-semibold">Emergency Service</h3>
                <Badge variant={hospital.emergencyServiceStatus === 'active' ? 'success' : 'danger'}>
                  {hospital.emergencyServiceStatus === 'active' ? 'Active' : 'Busy'}
                </Badge>
              </div>
              <p className="text-sm">Response: <strong>{hospital.emergencyResponseTime}</strong></p>
              <p className="text-sm">Ambulances: <strong>{hospital.ambulanceAvailable}/{hospital.ambulanceCount}</strong></p>
            </Card>

            {/* Critical Alerts */}
            <Card className="p-5">
              <h3 className="font-semibold mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-500" /> Critical Alerts
              </h3>
              {dashboardData.alerts.map((alert) => (
                <div key={alert.id} className={`p-3 rounded-lg mb-2 ${alert.type === 'critical' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              ))}
            </Card>

            {/* Pending Approvals */}
            <Card className="p-5">
              <h3 className="font-semibold mb-4">Pending Approvals</h3>
              {dashboardData.pendingApprovals.map((approval) => (
                <div key={approval.id} className="flex items-center justify-between p-3 border rounded-lg mb-2">
                  <div>
                    <p className="text-sm font-medium">{approval.name}</p>
                    <p className="text-xs text-gray-500">{approval.details}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="success" size="xs">Approve</Button>
                    <Button variant="danger" size="xs">Reject</Button>
                  </div>
                </div>
              ))}
            </Card>

            {/* Quick Actions */}
            <Card className="p-5">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { icon: <Users className="w-5 h-5" />, label: 'Doctors', page: 'doctors' },
                  { icon: <Droplet className="w-5 h-5" />, label: 'Blood Bank', page: 'blood-stock' },
                  { icon: <Truck className="w-5 h-5" />, label: 'Ambulance', page: 'ambulance' },
                  { icon: <Wind className="w-5 h-5" />, label: 'Oxygen', page: 'oxygen' },
                  { icon: <Bed className="w-5 h-5" />, label: 'ICU Tracker', page: 'icu-tracker' },
                  { icon: <AlertCircle className="w-5 h-5" />, label: 'Emergency', page: 'emergency' },
                  { icon: <Building2 className="w-5 h-5" />, label: 'Departments', page: 'departments' },
                  { icon: <Bell className="w-5 h-5" />, label: 'Announcements', page: 'announcements' },
                ].map((btn, i) => (
                  <Button key={i} variant="ghost" className="flex-col p-3 h-auto" onClick={() => onNavigate(btn.page)}>
                    {btn.icon}
                    <span className="text-[10px] mt-1">{btn.label}</span>
                  </Button>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENTS (Preserved + Enhanced)
// ============================================

const ProgressBar: React.FC<{ label: string; value: number; color: string }> = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value.toFixed(1)}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(value, 100)}%` }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className={`h-2.5 rounded-full ${color === 'blue' ? 'bg-blue-500' : 'bg-red-500'}`}
      />
    </div>
  </div>
);

const ActivityIcon: React.FC<{ type: HospitalActivity['type'] }> = ({ type }) => {
  const icons: Record<HospitalActivity['type'], React.ReactNode> = {
    admission: <Users className="w-5 h-5 text-blue-500" />,
    discharge: <TrendingDown className="w-5 h-5 text-green-500" />,
    emergency: <AlertCircle className="w-5 h-5 text-red-500" />,
    surgery: <Stethoscope className="w-5 h-5 text-purple-500" />,
    blood: <Droplet className="w-5 h-5 text-red-600" />,
    ambulance: <Truck className="w-5 h-5 text-orange-500" />,
    other: <Activity className="w-5 h-5 text-gray-500" />,
  };
  return <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">{icons[type]}</div>;
};

export default HospitalDashboard;