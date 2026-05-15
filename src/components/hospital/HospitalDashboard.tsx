// src/components/hospital/HospitalDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  Building2, Bed, Activity, Droplet, Wind,
  Truck, AlertCircle, TrendingUp, TrendingDown,
  Users, Stethoscope, Phone, MapPin, Star,
  Bell, Settings, Heart, Thermometer,
} from 'lucide-react';
import {
  HospitalDashboardData,
  WorkingHours,
  VisitingHours,
  BloodGroup,
  HospitalActivity,
} from '../../types/hospital';

interface HospitalDashboardProps {
  hospitalId: string;
  onNavigate: (page: string) => void;
}

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

const statIconBg: Record<string, string> = {
  blue: 'bg-blue-100',
  red: 'bg-red-100',
  green: 'bg-green-100',
  orange: 'bg-orange-100',
  yellow: 'bg-yellow-100',
  purple: 'bg-purple-100',
  teal: 'bg-teal-100',
};

const progressBarFill: Record<string, string> = {
  blue: 'bg-blue-500',
  red: 'bg-red-500',
};

export const HospitalDashboard: React.FC<HospitalDashboardProps> = ({
  hospitalId,
  onNavigate,
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
            total: 200,
            available: 150,
            inUse: 40,
            reserved: 10,
            lastRefilled: '2024-02-10',
            supplier: 'Oxygen Supply Co.',
            cylinderTypes: [],
          },
          bloodBank: {
            isAvailable: true,
            bloodStock: [],
            lastUpdated: '2024-02-15',
            totalUnits: 500,
            expiryAlerts: 5,
          },
          departments: [],
          totalDoctors: 150,
          totalNurses: 300,
          totalStaff: 500,
          services: [],
          facilities: [],
          insuranceAccepted: [],
          workingHours: defaultWorkingHours,
          visitingHours: defaultVisitingHours,
          coordinates: {
            latitude: 40.7128,
            longitude: -74.006,
          },
          isActive: true,
          isVerified: true,
          createdAt: '2020-01-01',
          updatedAt: '2024-02-15',
        },
        todayStats: {
          totalPatients: 250,
          newAdmissions: 25,
          discharges: 20,
          emergencies: 15,
          surgeries: 8,
          deaths: 1,
          births: 3,
        },
        bedStats: {
          total: 500,
          occupied: 350,
          available: 150,
          reserved: 25,
          occupancyRate: 70,
          byDepartment: [],
        },
        icuStats: {
          total: 50,
          occupied: 35,
          available: 15,
          onVentilator: 12,
          criticalPatients: 8,
          averageStay: '5 days',
        },
        bloodStats: {
          totalUnits: 500,
          expiringSoon: 25,
          criticalGroups: ['O-', 'AB-'] as BloodGroup[],
          todayRequests: 10,
          todayDonations: 15,
        },
        oxygenStats: {
          totalCylinders: 200,
          inUse: 40,
          available: 150,
          reserved: 10,
          daysLeft: 7,
        },
        emergencyStats: {
          todayEmergencies: 15,
          activeEmergencies: 3,
          averageResponseTime: '8 min',
          ambulancesDispatched: 8,
        },
        ambulanceStats: {
          total: 15,
          available: 10,
          onCall: 4,
          inMaintenance: 1,
        },
        recentActivities: [
          {
            id: '1',
            type: 'admission',
            description: 'Patient John Doe admitted to Cardiology',
            time: '10:30 AM',
            department: 'Cardiology',
          },
          {
            id: '2',
            type: 'emergency',
            description: 'Emergency surgery completed for Sarah Johnson',
            time: '11:00 AM',
            department: 'Surgery',
          },
          {
            id: '3',
            type: 'discharge',
            description: 'Patient Mike Wilson discharged from Orthopedics',
            time: '11:30 AM',
            department: 'Orthopedics',
          },
        ],
        pendingApprovals: [
          {
            id: '1',
            type: 'doctor',
            name: 'Dr. Emily White',
            details: 'Cardiologist - New application',
            requestDate: '2024-02-14',
            priority: 'normal',
          },
          {
            id: '2',
            type: 'blood-donor',
            name: 'Robert Brown',
            details: 'Blood donor registration - B+',
            requestDate: '2024-02-15',
            priority: 'normal',
          },
        ],
        alerts: [
          {
            id: '1',
            type: 'critical',
            message: 'O- blood stock below critical level',
            time: '09:00 AM',
            isRead: false,
          },
          {
            id: '2',
            type: 'warning',
            message: 'ICU bed occupancy above 70%',
            time: '10:00 AM',
            isRead: false,
          },
        ],
        analytics: {
          patientFlow: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            admissions: [25, 30, 28, 35, 32, 20, 15],
            discharges: [20, 25, 22, 30, 28, 18, 15],
          },
          bedOccupancy: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            rates: [65, 70, 68, 75, 72, 60, 55],
          },
          bloodUsage: {
            labels: ['Jan', 'Feb', 'Mar'],
            used: [150, 180, 165],
            donated: [200, 190, 210],
          },
          revenue: {
            labels: ['Jan', 'Feb', 'Mar'],
            amount: [500000, 520000, 510000],
          },
        },
      };

      setDashboardData(mockData);
      setIsLoading(false);
    }, 1500);
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500" />
      </div>
    );
  }

  const { hospital } = dashboardData;
  const icuOccupancy =
    dashboardData.icuStats.total > 0
      ? (dashboardData.icuStats.occupied / dashboardData.icuStats.total) * 100
      : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <Building2 className="w-8 h-8 text-blue-800" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{hospital.name}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {hospital.address.city}, {hospital.address.state}
                  </span>
                  <span className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-1" />
                    {hospital.phone}
                  </span>
                  <span className="flex items-center text-sm">
                    <Star className="w-4 h-4 mr-1 text-yellow-400" />
                    {hospital.rating} ({hospital.reviewCount} reviews)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
                className="bg-white/20 text-white text-sm px-3 py-2 rounded-lg border border-white/30"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
              <div className="relative">
                <Bell className="w-6 h-6 cursor-pointer" />
                <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {dashboardData.alerts.filter((a) => !a.isRead).length}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('settings')}
                className="bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
          <QuickStatCard
            icon={<Bed className="w-6 h-6 text-blue-500" />}
            label="Available Beds"
            value={hospital.availableBeds.toString()}
            total={hospital.totalBeds.toString()}
            color="blue"
          />
          <QuickStatCard
            icon={<Activity className="w-6 h-6 text-red-500" />}
            label="ICU Available"
            value={hospital.icuAvailableBeds.toString()}
            total={hospital.icuTotalBeds.toString()}
            color="red"
          />
          <QuickStatCard
            icon={<Droplet className="w-6 h-6 text-red-600" />}
            label="Blood Units"
            value={dashboardData.bloodStats.totalUnits.toString()}
            subtitle={`${dashboardData.bloodStats.expiringSoon} expiring`}
            color="red"
          />
          <QuickStatCard
            icon={<Wind className="w-6 h-6 text-green-500" />}
            label="Oxygen"
            value={dashboardData.oxygenStats.available.toString()}
            total={dashboardData.oxygenStats.totalCylinders.toString()}
            color="green"
          />
          <QuickStatCard
            icon={<Truck className="w-6 h-6 text-orange-500" />}
            label="Ambulances"
            value={dashboardData.ambulanceStats.available.toString()}
            total={dashboardData.ambulanceStats.total.toString()}
            color="orange"
          />
          <QuickStatCard
            icon={<AlertCircle className="w-6 h-6 text-yellow-500" />}
            label="Emergencies"
            value={dashboardData.emergencyStats.todayEmergencies.toString()}
            subtitle="Today"
            color="yellow"
          />
          <QuickStatCard
            icon={<Users className="w-6 h-6 text-purple-500" />}
            label="Patients Today"
            value={dashboardData.todayStats.totalPatients.toString()}
            subtitle={`${dashboardData.todayStats.newAdmissions} new`}
            color="purple"
          />
          <QuickStatCard
            icon={<Stethoscope className="w-6 h-6 text-teal-500" />}
            label="Surgeries"
            value={dashboardData.todayStats.surgeries.toString()}
            subtitle="Today"
            color="teal"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-blue-500" />
                Today's Hospital Activity
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatsDetail
                  label="New Admissions"
                  value={dashboardData.todayStats.newAdmissions}
                  icon={<TrendingUp className="w-4 h-4 text-green-500" />}
                />
                <StatsDetail
                  label="Discharges"
                  value={dashboardData.todayStats.discharges}
                  icon={<TrendingDown className="w-4 h-4 text-orange-500" />}
                />
                <StatsDetail
                  label="Emergencies"
                  value={dashboardData.todayStats.emergencies}
                  icon={<AlertCircle className="w-4 h-4 text-red-500" />}
                />
                <StatsDetail
                  label="Deaths"
                  value={dashboardData.todayStats.deaths}
                  icon={<Heart className="w-4 h-4 text-gray-500" />}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Bed className="w-5 h-5 mr-2 text-blue-500" />
                  Bed Status
                </h3>
                <div className="space-y-3">
                  <ProgressBar
                    label="Occupancy Rate"
                    value={dashboardData.bedStats.occupancyRate}
                    color="blue"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Occupied</span>
                    <span className="font-medium">{dashboardData.bedStats.occupied}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available</span>
                    <span className="font-medium text-green-600">
                      {dashboardData.bedStats.available}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Reserved</span>
                    <span className="font-medium text-yellow-600">
                      {dashboardData.bedStats.reserved}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Thermometer className="w-5 h-5 mr-2 text-red-500" />
                  ICU Status
                </h3>
                <div className="space-y-3">
                  <ProgressBar label="ICU Occupancy" value={icuOccupancy} color="red" />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available</span>
                    <span className="font-medium text-green-600">
                      {dashboardData.icuStats.available}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">On Ventilator</span>
                    <span className="font-medium">{dashboardData.icuStats.onVentilator}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Critical Patients</span>
                    <span className="font-medium text-red-600">
                      {dashboardData.icuStats.criticalPatients}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
              <div className="space-y-3">
                {dashboardData.recentActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <ActivityIcon type={activity.type} />
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                        {activity.department ? ` • ${activity.department}` : ''}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div
              className={`rounded-lg shadow p-6 ${
                hospital.emergencyServiceStatus === 'active'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Emergency Service</h3>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    hospital.emergencyServiceStatus === 'active'
                      ? 'bg-green-200 text-green-800'
                      : 'bg-red-200 text-red-800'
                  }`}
                >
                  {hospital.emergencyServiceStatus === 'active' ? 'Active' : 'Busy'}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="text-gray-600">Response Time:</span>{' '}
                  <span className="font-medium">{hospital.emergencyResponseTime}</span>
                </p>
                <p className="text-sm">
                  <span className="text-gray-600">Ambulances Available:</span>{' '}
                  <span className="font-medium">
                    {hospital.ambulanceAvailable}/{hospital.ambulanceCount}
                  </span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                Critical Alerts
              </h3>
              <div className="space-y-3">
                {dashboardData.alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-lg ${
                      alert.type === 'critical'
                        ? 'bg-red-50 border border-red-200'
                        : alert.type === 'warning'
                          ? 'bg-yellow-50 border border-yellow-200'
                          : 'bg-blue-50 border border-blue-200'
                    }`}
                  >
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Pending Approvals</h3>
              <div className="space-y-3">
                {dashboardData.pendingApprovals.map((approval) => (
                  <div
                    key={approval.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="text-sm font-medium">{approval.name}</p>
                      <p className="text-xs text-gray-500">{approval.details}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        className="px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <QuickActionButton
                  icon={<Users className="w-6 h-6" />}
                  label="Doctors"
                  onClick={() => onNavigate('doctors')}
                />
                <QuickActionButton
                  icon={<Droplet className="w-6 h-6" />}
                  label="Blood Bank"
                  onClick={() => onNavigate('blood-stock')}
                />
                <QuickActionButton
                  icon={<Truck className="w-6 h-6" />}
                  label="Ambulance"
                  onClick={() => onNavigate('ambulance')}
                />
                <QuickActionButton
                  icon={<Wind className="w-6 h-6" />}
                  label="Oxygen"
                  onClick={() => onNavigate('oxygen')}
                />
                <QuickActionButton
                  icon={<Bed className="w-6 h-6" />}
                  label="ICU Tracker"
                  onClick={() => onNavigate('icu-tracker')}
                />
                <QuickActionButton
                  icon={<AlertCircle className="w-6 h-6" />}
                  label="Emergency"
                  onClick={() => onNavigate('emergency')}
                />
                <QuickActionButton
                  icon={<Building2 className="w-6 h-6" />}
                  label="Departments"
                  onClick={() => onNavigate('departments')}
                />
                <QuickActionButton
                  icon={<Bell className="w-6 h-6" />}
                  label="Announcements"
                  onClick={() => onNavigate('announcements')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickStatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  total?: string;
  subtitle?: string;
  color: string;
}> = ({ icon, label, value, total, subtitle, color }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 rounded-lg ${statIconBg[color] ?? 'bg-gray-100'}`}>{icon}</div>
    </div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs text-gray-600">{label}</p>
    {total && <p className="text-xs text-gray-400">/ {total}</p>}
    {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
  </div>
);

const StatsDetail: React.FC<{
  label: string;
  value: number;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="text-center p-4 bg-gray-50 rounded-lg">
    <div className="flex justify-center mb-2">{icon}</div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

const ProgressBar: React.FC<{
  label: string;
  value: number;
  color: string;
}> = ({ label, value, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value.toFixed(1)}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`h-2 rounded-full ${progressBarFill[color] ?? 'bg-blue-500'}`}
        style={{ width: `${Math.min(value, 100)}%` }}
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

  return (
    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
      {icons[type]}
    </div>
  );
};

const QuickActionButton: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
  >
    <div className="w-8 h-8 mb-1 flex items-center justify-center">{icon}</div>
    <span className="text-xs">{label}</span>
  </button>
);
