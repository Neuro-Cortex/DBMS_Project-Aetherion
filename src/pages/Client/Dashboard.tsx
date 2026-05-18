// src/pages/client/Dashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  // Navigation Icons
  Activity, Heart, Calendar, Clock, MapPin,
  Droplet, Pill, Syringe, FileText, AlertCircle,
  Bell, Search, User, ChevronRight, TrendingUp,
  TrendingDown, Star, Shield, Zap, Award,
  MessageCircle, Video, Phone, Settings,
  LogOut, Moon, Sun, Plus, RefreshCw,
  
  // Health Icons
  Thermometer, Weight, Ruler, Eye, Brain,
  Bone, Stethoscope, Building2,
  Users, CreditCard, Gift, BookOpen,
  
  // Emergency
  AlertTriangle, PhoneCall, Navigation,
  
  // Charts
  BarChart3, PieChart, LineChart,
  
  // Additional
  MoreHorizontal, CheckCircle, XCircle,
  ArrowUp, ArrowDown, Minus, Download,
  Upload, Filter, Sliders
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface DashboardData {
  user: UserInfo;
  vitals: VitalsData;
  appointments: AppointmentData[];
  medications: MedicationReminder[];
  healthMetrics: HealthMetric[];
  bloodDonation: BloodDonationInfo;
  reports: ReportSummary[];
  recommendations: HealthRecommendation[];
  activities: ActivityFeed[];
  notifications: Notification[];
  upcomingVaccines: VaccineReminder[];
  nearbyHospitals: Hospital[];
  emergencyContacts: EmergencyContact[];
  weeklyActivity: WeeklyActivity[];
  healthScore: number;
}

interface UserInfo {
  name: string;
  age: number;
  bloodGroup: string;
  gender: string;
  memberSince: string;
  profileImage: string;
  isVerified: boolean;
  accountType: string;
}

interface VitalsData {
  heartRate: number;
  bloodPressure: string;
  bloodSugar: number;
  temperature: number;
  oxygenLevel: number;
  weight: number;
  height: number;
  bmi: number;
  lastChecked: string;
}

interface AppointmentData {
  id: string;
  doctorName: string;
  specialization: string;
  hospital: string;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'upcoming' | 'today' | 'completed' | 'cancelled';
  roomNumber?: string;
  joinLink?: string;
}

interface MedicationReminder {
  id: string;
  name: string;
  dosage: string;
  time: string;
  taken: boolean;
  frequency: string;
  remaining: number;
}

interface HealthMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  normalRange: string;
  status: 'normal' | 'warning' | 'critical';
  trend: 'up' | 'down' | 'stable';
  history: number[];
}

interface BloodDonationInfo {
  isDonor: boolean;
  totalDonations: number;
  lastDonation: string;
  nextEligible: string;
  isEligible: boolean;
  livesSaved: number;
  points: number;
}

interface ReportSummary {
  id: string;
  type: string;
  date: string;
  doctor: string;
  result: string;
  status: 'completed' | 'pending' | 'processing';
  fileUrl?: string;
}

interface HealthRecommendation {
  id: string;
  title: string;
  description: string;
  category: 'diet' | 'exercise' | 'medication' | 'lifestyle';
  priority: 'high' | 'medium' | 'low';
  icon: string;
}

interface ActivityFeed {
  id: string;
  type: 'appointment' | 'medication' | 'report' | 'donation' | 'vaccine' | 'exercise';
  title: string;
  description: string;
  timestamp: string;
  icon: React.ReactNode;
}

interface Notification {
  id: string;
  type: 'alert' | 'reminder' | 'info' | 'success';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface VaccineReminder {
  id: string;
  name: string;
  dueDate: string;
  status: 'upcoming' | 'overdue' | 'completed';
  dose: string;
}

interface Hospital {
  id: string;
  name: string;
  distance: string;
  eta: string;
  rating: number;
  isOpen: boolean;
  hasEmergency: boolean;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isAvailable: boolean;
}

interface WeeklyActivity {
  day: string;
  steps: number;
  exercise: number;
  sleep: number;
}

// ============================================
// MAIN DASHBOARD COMPONENT
// ============================================

export const ClientDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [greeting, setGreeting] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    updateGreeting();
    
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 17) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  };

  const fetchDashboardData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData: DashboardData = {
        user: {
          name: 'John Doe',
          age: 28,
          bloodGroup: 'O+',
          gender: 'Male',
          memberSince: '2020',
          profileImage: '',
          isVerified: true,
          accountType: 'Client'
        },
        vitals: {
          heartRate: 72,
          bloodPressure: '120/80',
          bloodSugar: 95,
          temperature: 98.6,
          oxygenLevel: 98,
          weight: 70,
          height: 175,
          bmi: 22.9,
          lastChecked: '2025-01-16'
        },
        healthScore: 85,
        appointments: [
          {
            id: 'a1',
            doctorName: 'Dr. Sarah Wilson',
            specialization: 'Cardiologist',
            hospital: 'City General Hospital',
            date: '2025-01-20',
            time: '10:00 AM',
            type: 'in-person',
            status: 'upcoming',
            roomNumber: 'Room 305'
          },
          {
            id: 'a2',
            doctorName: 'Dr. James Brown',
            specialization: 'Dermatologist',
            hospital: 'Metro Hospital',
            date: '2025-01-16',
            time: '2:30 PM',
            type: 'video',
            status: 'today',
            joinLink: 'https://meet.healthcare.com/abc123'
          }
        ],
        medications: [
          {
            id: 'm1',
            name: 'Lisinopril',
            dosage: '10mg',
            time: '08:00 AM',
            taken: true,
            frequency: 'Once daily',
            remaining: 15
          },
          {
            id: 'm2',
            name: 'Vitamin D',
            dosage: '1000 IU',
            time: '09:00 AM',
            taken: false,
            frequency: 'Once daily',
            remaining: 30
          },
          {
            id: 'm3',
            name: 'Calcium',
            dosage: '500mg',
            time: '08:00 PM',
            taken: false,
            frequency: 'Twice daily',
            remaining: 20
          }
        ],
        healthMetrics: [
          {
            id: 'h1',
            name: 'Heart Rate',
            value: 72,
            unit: 'bpm',
            normalRange: '60-100',
            status: 'normal',
            trend: 'stable',
            history: [70, 72, 71, 73, 72]
          },
          {
            id: 'h2',
            name: 'Blood Pressure',
            value: 120,
            unit: 'mmHg',
            normalRange: '90-120',
            status: 'normal',
            trend: 'stable',
            history: [118, 120, 119, 121, 120]
          },
          {
            id: 'h3',
            name: 'Blood Sugar',
            value: 95,
            unit: 'mg/dL',
            normalRange: '70-100',
            status: 'normal',
            trend: 'up',
            history: [90, 92, 93, 94, 95]
          },
          {
            id: 'h4',
            name: 'SpO2',
            value: 98,
            unit: '%',
            normalRange: '95-100',
            status: 'normal',
            trend: 'stable',
            history: [97, 98, 98, 97, 98]
          }
        ],
        bloodDonation: {
          isDonor: true,
          totalDonations: 8,
          lastDonation: '2025-01-15',
          nextEligible: '2025-04-15',
          isEligible: false,
          livesSaved: 24,
          points: 850
        },
        reports: [
          {
            id: 'r1',
            type: 'Blood Test',
            date: '2025-01-10',
            doctor: 'Dr. Sarah Wilson',
            result: 'All parameters normal',
            status: 'completed',
            fileUrl: '#'
          },
          {
            id: 'r2',
            type: 'X-Ray Chest',
            date: '2025-01-05',
            doctor: 'Dr. Michael Chen',
            result: 'Clear',
            status: 'completed',
            fileUrl: '#'
          }
        ],
        recommendations: [
          {
            id: 'rec1',
            title: 'Increase Water Intake',
            description: 'Drink at least 8 glasses of water daily',
            category: 'diet',
            priority: 'high',
            icon: '💧'
          },
          {
            id: 'rec2',
            title: 'Daily Walking',
            description: 'Walk for 30 minutes every day',
            category: 'exercise',
            priority: 'medium',
            icon: '🚶'
          },
          {
            id: 'rec3',
            title: 'Medication Reminder',
            description: 'Take Lisinopril at 8:00 AM',
            category: 'medication',
            priority: 'high',
            icon: '💊'
          }
        ],
        activities: [
          {
            id: 'act1',
            type: 'appointment',
            title: 'Cardiology Checkup',
            description: 'Visited Dr. Sarah Wilson',
            timestamp: '2025-01-15T10:00:00',
            icon: <Stethoscope className="w-5 h-5 text-blue-500" />
          },
          {
            id: 'act2',
            type: 'medication',
            title: 'Medication Taken',
            description: 'Lisinopril 10mg',
            timestamp: '2025-01-16T08:00:00',
            icon: <Pill className="w-5 h-5 text-green-500" />
          },
          {
            id: 'act3',
            type: 'report',
            title: 'Report Uploaded',
            description: 'Blood Test Results',
            timestamp: '2025-01-10T14:00:00',
            icon: <FileText className="w-5 h-5 text-purple-500" />
          },
          {
            id: 'act4',
            type: 'donation',
            title: 'Blood Donation',
            description: 'Donated 1 unit at City Hospital',
            timestamp: '2025-01-15T09:00:00',
            icon: <Droplet className="w-5 h-5 text-red-500" />
          }
        ],
        notifications: [
          {
            id: 'n1',
            type: 'reminder',
            title: 'Appointment Tomorrow',
            message: 'You have an appointment with Dr. Sarah Wilson at 10:00 AM',
            time: '1 hour ago',
            isRead: false
          },
          {
            id: 'n2',
            type: 'alert',
            title: 'Medication Due',
            message: 'Time to take your Calcium supplement',
            time: '2 hours ago',
            isRead: false
          },
          {
            id: 'n3',
            type: 'success',
            title: 'Report Ready',
            message: 'Your blood test report is now available',
            time: '1 day ago',
            isRead: true
          }
        ],
        upcomingVaccines: [
          {
            id: 'v1',
            name: 'Flu Shot',
            dueDate: '2025-10-01',
            status: 'upcoming',
            dose: 'Annual'
          },
          {
            id: 'v2',
            name: 'COVID-19 Booster',
            dueDate: '2025-09-15',
            status: 'upcoming',
            dose: 'Booster'
          }
        ],
        nearbyHospitals: [
          {
            id: 'h1',
            name: 'City General Hospital',
            distance: '2.5 km',
            eta: '8 min',
            rating: 4.5,
            isOpen: true,
            hasEmergency: true
          },
          {
            id: 'h2',
            name: 'Metro Hospital',
            distance: '5.2 km',
            eta: '15 min',
            rating: 4.2,
            isOpen: true,
            hasEmergency: true
          }
        ],
        emergencyContacts: [
          {
            id: 'e1',
            name: 'Jane Doe',
            relationship: 'Spouse',
            phone: '+1 (555) 987-6543',
            isAvailable: true
          },
          {
            id: 'e2',
            name: 'Dr. Sarah Wilson',
            relationship: 'Primary Doctor',
            phone: '+1 (555) 333-4444',
            isAvailable: true
          }
        ],
        weeklyActivity: [
          { day: 'Mon', steps: 8500, exercise: 30, sleep: 7.5 },
          { day: 'Tue', steps: 7200, exercise: 25, sleep: 8 },
          { day: 'Wed', steps: 9100, exercise: 45, sleep: 7 },
          { day: 'Thu', steps: 6800, exercise: 20, sleep: 7.5 },
          { day: 'Fri', steps: 7800, exercise: 35, sleep: 8 },
          { day: 'Sat', steps: 5500, exercise: 15, sleep: 9 },
          { day: 'Sun', steps: 6200, exercise: 40, sleep: 8 }
        ]
      };

      setDashboardData(mockData);
      setIsLoading(false);
    }, 1500);
  };

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  const handleEmergencySOS = () => {
    setShowEmergencyModal(true);
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthScoreBg = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-24 h-24 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            <Heart className="absolute inset-0 m-auto w-8 h-8 text-blue-600 animate-pulse" />
          </div>
          <p className="mt-6 text-gray-600 font-medium">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* ============================================ */}
      {/* TOP HEADER */}
      {/* ============================================ */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo & Search */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg hidden sm:block">HealthCare</span>
              </div>
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <Search className="w-4 h-4 text-gray-400" />
                <input type="text" placeholder="Search doctors, hospitals..." className="bg-transparent border-none outline-none ml-2 text-sm w-48" />
              </div>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center space-x-3">
              {/* SOS Button */}
              <button onClick={handleEmergencySOS} className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-red-700 animate-pulse flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" /> SOS
              </button>

              {/* Notifications */}
              <div className="relative">
                <button onClick={() => setShowNotifications(!showNotifications)} className="p-2 hover:bg-gray-100 rounded-full relative">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">3</span>
                </button>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border z-50">
                    <div className="p-3 border-b flex justify-between items-center">
                      <h3 className="font-semibold">Notifications</h3>
                      <button className="text-sm text-blue-600">Mark all read</button>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {dashboardData.notifications.map((notif) => (
                        <div key={notif.id} className={`p-3 border-b hover:bg-gray-50 ${!notif.isRead ? 'bg-blue-50' : ''}`}>
                          <div className="flex items-start space-x-3">
                            <div className={`w-2 h-2 rounded-full mt-2 ${notif.type === 'alert' ? 'bg-red-500' : notif.type === 'reminder' ? 'bg-yellow-500' : notif.type === 'success' ? 'bg-green-500' : 'bg-blue-500'}`} />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{notif.title}</p>
                              <p className="text-xs text-gray-600">{notif.message}</p>
                              <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile */}
              <button onClick={() => navigateTo('/client/profile')} className="flex items-center space-x-2 p-1 hover:bg-gray-100 rounded-lg">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <span className="text-sm font-medium hidden sm:block">{dashboardData.user.name}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                {greeting}, <span className="text-blue-600">{dashboardData.user.name.split(' ')[0]}</span> 👋
              </h1>
              <p className="text-gray-600 mt-1">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <div className={`${getHealthScoreBg(dashboardData.healthScore)} rounded-xl p-4 text-center`}>
                <p className="text-sm text-gray-600">Health Score</p>
                <p className={`text-3xl font-bold ${getHealthScoreColor(dashboardData.healthScore)}`}>{dashboardData.healthScore}</p>
                <p className="text-xs text-gray-500">out of 100</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Banner */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-4 mb-6 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-8 h-8 animate-pulse" />
            <div>
              <p className="font-semibold">Emergency Support</p>
              <p className="text-sm text-red-100">Call 911 or use SOS button for immediate help</p>
            </div>
          </div>
          <div className="flex space-x-3">
            <button className="bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50 text-sm">Call Ambulance</button>
            <button onClick={handleEmergencySOS} className="bg-red-700 px-6 py-2 rounded-lg font-medium hover:bg-red-800 text-sm animate-pulse">SOS EMERGENCY</button>
          </div>
        </div>

        {/* Quick Stats Grid - 8 Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          <QuickStatCard icon={<Heart className="w-5 h-5 text-red-500" />} label="Heart Rate" value={`${dashboardData.vitals.heartRate}`} unit="bpm" status="normal" onClick={() => navigateTo('/client/health-records')} />
          <QuickStatCard icon={<Activity className="w-5 h-5 text-blue-500" />} label="Blood Pressure" value={dashboardData.vitals.bloodPressure} unit="" status="normal" onClick={() => navigateTo('/client/health-records')} />
          <QuickStatCard icon={<Droplet className="w-5 h-5 text-pink-500" />} label="Blood Sugar" value={dashboardData.vitals.bloodSugar.toString()} unit="mg/dL" status="normal" onClick={() => navigateTo('/client/reports')} />
          <QuickStatCard icon={<Thermometer className="w-5 h-5 text-orange-500" />} label="Temperature" value={dashboardData.vitals.temperature.toString()} unit="°F" status="normal" onClick={() => navigateTo('/client/health-records')} />
          <QuickStatCard icon={<Activity className="w-5 h-5 text-green-500" />} label="SpO2" value={dashboardData.vitals.oxygenLevel.toString()} unit="%" status="normal" onClick={() => navigateTo('/client/health-records')} />
          <QuickStatCard icon={<Weight className="w-5 h-5 text-purple-500" />} label="Weight" value={dashboardData.vitals.weight.toString()} unit="kg" status="normal" onClick={() => navigateTo('/client/health-records')} />
          <QuickStatCard icon={<Calendar className="w-5 h-5 text-indigo-500" />} label="Appointments" value={dashboardData.appointments.length.toString()} unit="" status="info" onClick={() => navigateTo('/client/appointments')} />
          <QuickStatCard icon={<Droplet className="w-5 h-5 text-red-600" />} label="Blood Group" value={dashboardData.user.bloodGroup} unit="" status="info" onClick={() => navigateTo('/client/blood-donation')} />
        </div>

        {/* Main Grid - Left Content + Right Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* ============================================ */}
          {/* LEFT COLUMN - Main Content */}
          {/* ============================================ */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. UPCOMING APPOINTMENTS */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-500" /> Appointments
                </h2>
                <button onClick={() => navigateTo('/client/appointments')} className="text-blue-600 text-sm hover:text-blue-700 flex items-center">
                  View All <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>
              <div className="space-y-3">
                {dashboardData.appointments.map((apt) => (
                  <div key={apt.id} className={`border-2 rounded-xl p-4 transition-all hover:shadow-md ${apt.status === 'today' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${apt.type === 'video' ? 'bg-blue-100' : apt.type === 'phone' ? 'bg-green-100' : 'bg-purple-100'}`}>
                          {apt.type === 'video' ? <Video className="w-6 h-6 text-blue-600" /> : apt.type === 'phone' ? <Phone className="w-6 h-6 text-green-600" /> : <User className="w-6 h-6 text-purple-600" />}
                        </div>
                        <div>
                          <p className="font-semibold">{apt.doctorName}</p>
                          <p className="text-sm text-gray-600">{apt.specialization}</p>
                          <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                            <span>{apt.date}</span><span>•</span><span>{apt.time}</span>
                            {apt.roomNumber && <span>• {apt.roomNumber}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {apt.status === 'today' && apt.type === 'video' && (
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700">Join Call</button>
                        )}
                        {apt.status === 'today' && apt.type === 'in-person' && (
                          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 flex items-center">
                            <Navigation className="w-4 h-4 mr-1" /> Directions
                          </button>
                        )}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${apt.status === 'today' ? 'bg-blue-100 text-blue-700' : apt.status === 'upcoming' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                          {apt.status === 'today' ? 'TODAY' : apt.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. HEALTH METRICS OVERVIEW */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2 text-purple-500" /> Health Metrics Overview
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {dashboardData.healthMetrics.map((metric) => (
                  <div key={metric.id} className="border rounded-xl p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm text-gray-600">{metric.name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${metric.status === 'normal' ? 'bg-green-100 text-green-700' : metric.status === 'warning' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{metric.status}</span>
                    </div>
                    <p className="text-2xl font-bold">{metric.value}<span className="text-sm text-gray-500 ml-1">{metric.unit}</span></p>
                    <p className="text-xs text-gray-500 mt-1">Normal: {metric.normalRange}</p>
                    <div className="flex items-end space-x-1 mt-2 h-8">
                      {metric.history.map((val, i) => (
                        <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${(val / Math.max(...metric.history)) * 100}%` }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. WEEKLY ACTIVITY */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-500" /> Weekly Activity
              </h2>
              <div className="grid grid-cols-7 gap-2">
                {dashboardData.weeklyActivity.map((day) => (
                  <div key={day.day} className="text-center">
                    <p className="text-xs text-gray-500 mb-2">{day.day}</p>
                    <div className="space-y-1">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${(day.steps / 10000) * 100}%` }} />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(day.exercise / 60) * 100}%` }} />
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(day.sleep / 10) * 100}%` }} />
                      </div>
                    </div>
                    <p className="text-xs font-medium mt-1">{day.steps}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center space-x-4 mt-4 text-xs text-gray-500">
                <span className="flex items-center"><div className="w-3 h-3 bg-blue-500 rounded mr-1"></div> Steps</span>
                <span className="flex items-center"><div className="w-3 h-3 bg-green-500 rounded mr-1"></div> Exercise</span>
                <span className="flex items-center"><div className="w-3 h-3 bg-purple-500 rounded mr-1"></div> Sleep</span>
              </div>
            </div>

            {/* 4. HEALTH ACTIVITY TIMELINE */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-orange-500" /> Recent Activity
              </h2>
              <div className="space-y-4">
                {dashboardData.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">{activity.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-600">{activity.description}</p>
                      <p className="text-xs text-gray-400 mt-1">{new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ============================================ */}
          {/* RIGHT COLUMN - Sidebar */}
          {/* ============================================ */}
          <div className="space-y-6">
            
            {/* 5. MEDICINE REMINDER ALERTS */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center">
                  <Pill className="w-5 h-5 mr-2 text-green-500" /> Medications
                </h2>
                <button onClick={() => navigateTo('/client/prescriptions')} className="text-blue-600 text-sm">View All</button>
              </div>
              <div className="space-y-3">
                {dashboardData.medications.map((med) => (
                  <div key={med.id} className={`border rounded-xl p-3 ${med.taken ? 'opacity-60' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${med.taken ? 'bg-green-100' : 'bg-orange-100'}`}>
                          {med.taken ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Pill className="w-5 h-5 text-orange-600" />}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{med.name}</p>
                          <p className="text-xs text-gray-500">{med.dosage}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{med.time}</p>
                        <p className="text-xs text-gray-500">{med.remaining} left</p>
                      </div>
                    </div>
                    {!med.taken && (
                      <button className="w-full mt-2 bg-green-600 text-white py-1.5 rounded-lg text-sm hover:bg-green-700">Mark as Taken</button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 6. BLOOD DONATION STATUS */}
            <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Droplet className="w-5 h-5 mr-2" /> Blood Donation
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between"><span>Total Donations</span><span className="font-bold">{dashboardData.bloodDonation.totalDonations}</span></div>
                <div className="flex justify-between"><span>Lives Saved</span><span className="font-bold">{dashboardData.bloodDonation.livesSaved}</span></div>
                <div className="flex justify-between"><span>Reward Points</span><span className="font-bold">{dashboardData.bloodDonation.points}</span></div>
                <div className="flex justify-between"><span>Next Eligible</span><span className="font-bold">{dashboardData.bloodDonation.nextEligible}</span></div>
              </div>
              <button onClick={() => navigateTo('/client/blood-donation')} className="w-full mt-4 bg-white text-red-600 py-2 rounded-lg font-medium hover:bg-red-50">View Details</button>
            </div>

            {/* 7. HEALTH RECOMMENDATIONS */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-yellow-500" /> Recommendations
              </h2>
              <div className="space-y-3">
                {dashboardData.recommendations.map((rec) => (
                  <div key={rec.id} className={`border rounded-xl p-3 ${rec.priority === 'high' ? 'border-orange-200 bg-orange-50' : rec.priority === 'medium' ? 'border-blue-200 bg-blue-50' : ''}`}>
                    <div className="flex items-start space-x-3">
                      <span className="text-2xl">{rec.icon}</span>
                      <div>
                        <p className="font-medium text-sm">{rec.title}</p>
                        <p className="text-xs text-gray-600">{rec.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. QUICK ACCESS NAVIGATION */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Quick Access</h2>
              <div className="grid grid-cols-2 gap-2">
                <NavButton icon={<Calendar />} label="Appointments" onClick={() => navigateTo('/client/appointments')} />
                <NavButton icon={<FileText />} label="Reports" onClick={() => navigateTo('/client/reports')} />
                <NavButton icon={<Pill />} label="Prescriptions" onClick={() => navigateTo('/client/prescriptions')} />
                <NavButton icon={<Syringe />} label="Vaccines" onClick={() => navigateTo('/client/vaccines')} />
                <NavButton icon={<Droplet />} label="Blood" onClick={() => navigateTo('/client/blood-donation')} />
                <NavButton icon={<Search />} label="Doctors" onClick={() => navigateTo('/client/doctor-comparison')} />
                <NavButton icon={<MapPin />} label="Nearby" onClick={() => navigateTo('/client/nearby-donors')} />
                <NavButton icon={<AlertTriangle />} label="Emergency" onClick={() => navigateTo('/client/emergency')} />
                <NavButton icon={<Activity />} label="Physio" onClick={() => navigateTo('/client/physiotherapy')} />
                <NavButton icon={<Award />} label="Health Tips" onClick={() => navigateTo('/client/recommendations')} />
              </div>
            </div>

            {/* 9. CONNECTED HOSPITALS */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Building2 className="w-5 h-5 mr-2 text-blue-500" /> Nearby Hospitals
              </h2>
              <div className="space-y-3">
                {dashboardData.nearbyHospitals.map((hospital) => (
                  <div key={hospital.id} className="border rounded-xl p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{hospital.name}</p>
                        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                          <span>{hospital.distance}</span><span>•</span><span>{hospital.eta}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs">{hospital.rating}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-2">
                      {hospital.hasEmergency && <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">🚨 ER</span>}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${hospital.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{hospital.isOpen ? 'Open' : 'Closed'}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ============================================ */}
      {/* EMERGENCY SOS MODAL */}
      {/* ============================================ */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <AlertTriangle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-red-600">EMERGENCY SOS</h2>
              <p className="text-gray-600 mt-2">This will send an immediate alert to emergency services</p>
            </div>
            <div className="space-y-3 mb-6">
              {dashboardData.emergencyContacts.map((contact) => (
                <button key={contact.id} className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-red-300">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{contact.name}</p>
                      <p className="text-sm text-gray-500">{contact.relationship}</p>
                    </div>
                  </div>
                  <Phone className="w-5 h-5 text-green-600" />
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <button className="w-full bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 animate-pulse">🚨 SEND EMERGENCY ALERT</button>
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700">📞 Call 911</button>
              <button onClick={() => setShowEmergencyModal(false)} className="w-full py-2 text-gray-500 hover:text-gray-700">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* MOBILE BOTTOM NAVIGATION */}
      {/* ============================================ */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t md:hidden z-30">
        <div className="flex justify-around p-2">
          <MobileNavItem icon={<Activity />} label="Dashboard" active onClick={() => navigateTo('/client/dashboard')} />
          <MobileNavItem icon={<Calendar />} label="Appointments" onClick={() => navigateTo('/client/appointments')} />
          <MobileNavItem icon={<Droplet />} label="Blood" onClick={() => navigateTo('/client/blood-donation')} />
          <MobileNavItem icon={<FileText />} label="Reports" onClick={() => navigateTo('/client/reports')} />
          <MobileNavItem icon={<User />} label="Profile" onClick={() => navigateTo('/client/profile')} />
        </div>
      </nav>
    </div>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

const QuickStatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  unit: string;
  status: 'normal' | 'warning' | 'critical' | 'info';
  onClick: () => void;
}> = ({ icon, label, value, unit, status, onClick }) => (
  <button onClick={onClick} className="bg-white rounded-xl shadow p-3 hover:shadow-md transition-all text-left">
    <div className="flex items-center justify-between mb-1">
      <div className={`p-1.5 rounded-lg ${status === 'normal' ? 'bg-green-100' : status === 'warning' ? 'bg-yellow-100' : status === 'critical' ? 'bg-red-100' : 'bg-blue-100'}`}>{icon}</div>
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'normal' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : status === 'critical' ? 'bg-red-500' : 'bg-blue-500'}`} />
    </div>
    <p className="text-lg font-bold">{value}{unit && <span className="text-xs text-gray-500 ml-0.5">{unit}</span>}</p>
    <p className="text-xs text-gray-600">{label}</p>
  </button>
);

const NavButton: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-colors">
    <div className="w-5 h-5 mb-1">{icon}</div>
    <span className="text-xs">{label}</span>
  </button>
);

const MobileNavItem: React.FC<{ icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }> = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} className={`flex flex-col items-center p-2 ${active ? 'text-blue-600' : 'text-gray-400'}`}>
    <div className="w-5 h-5">{icon}</div>
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export default ClientDashboard;