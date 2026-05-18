// src/components/doctors/DoctorDashboard.tsx
// ORIGINAL CODE PRESERVED - Only export fixed

import React, { useState, useEffect } from 'react';
import {
  Calendar, Users, Video,
  TrendingUp, DollarSign, Activity,
  Clock, AlertCircle, FileText, Pill,
  Star, Bell, CheckCircle,
  Phone, MessageCircle
} from 'lucide-react';

// ============================================
// TYPES (Local - No external dependency)
// ============================================

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  date: string;
  time: string;
  duration: number;
  type: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  reason: string;
  symptoms?: string[];
  isEmergency: boolean;
  isFirstVisit: boolean;
  notes?: string;
  prescriptionId?: string;
  followUpDate?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorActivity {
  id: string;
  type: 'appointment' | 'prescription' | 'consultation' | 'review' | 'emergency';
  description: string;
  patientName?: string;
  time: string;
  status: 'completed' | 'pending' | 'cancelled';
}

export interface DoctorDashboardData {
  todayAppointments: Appointment[];
  upcomingAppointments: Appointment[];
  emergencyRequests: EmergencyRequest[];
  pendingPrescriptions: any[];
  videoConsultations: VideoConsultation[];
  recentPatients: any[];
  earnings: EarningsData;
  stats: DoctorStats;
  activities: DoctorActivity[];
  notifications: DoctorNotification[];
}

export interface EmergencyRequest {
  id: string;
  patientId: string;
  patientName: string;
  bloodGroup: string;
  units: number;
  hospital: string;
  urgency: 'normal' | 'urgent' | 'emergency';
  status: 'pending' | 'approved' | 'rejected' | 'fulfilled';
  requestDate: string;
  requiredDate: string;
  reason: string;
  approvedBy?: string;
  approvalDate?: string;
}

export interface VideoConsultation {
  id: string;
  appointmentId: string;
  doctorId: string;
  patientId: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'waiting' | 'in-progress' | 'completed' | 'missed';
  roomId: string;
  recordingUrl?: string;
  notes?: string;
}

export interface EarningsData {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  breakdown: {
    consultations: number;
    videoConsultations: number;
    followUps: number;
  };
  chartData: {
    labels: string[];
    values: number[];
  };
}

export interface DoctorStats {
  totalPatients: number;
  todayPatients: number;
  completedAppointments: number;
  cancelledAppointments: number;
  averageRating: number;
  totalReviews: number;
  prescriptionCount: number;
  videoConsultCount: number;
}

export interface DoctorNotification {
  id: string;
  type: 'appointment' | 'emergency' | 'prescription' | 'review' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

// ============================================
// PROPS
// ============================================

interface DoctorDashboardProps {
  doctorId: string;
  onNavigate: (page: string) => void;
}

// ============================================
// CONSTANTS
// ============================================

const statsIconBg: Record<string, string> = {
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  yellow: 'bg-yellow-100',
  purple: 'bg-purple-100',
};

// ============================================
// MAIN COMPONENT
// ============================================

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ doctorId, onNavigate }) => {
  const [dashboardData, setDashboardData] = useState<DoctorDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [doctorId]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData: DoctorDashboardData = {
        todayAppointments: [
          {
            id: 'a1',
            patientId: 'p1',
            patientName: 'John Doe',
            patientPhone: '+1 (555) 123-4567',
            patientEmail: 'john@email.com',
            date: '2024-02-15',
            time: '10:00 AM',
            duration: 30,
            type: 'in-person',
            status: 'confirmed',
            reason: 'Regular checkup',
            symptoms: ['Headache', 'Fatigue'],
            isEmergency: false,
            isFirstVisit: false,
            createdAt: '2024-02-10',
            updatedAt: '2024-02-10',
          },
          {
            id: 'a2',
            patientId: 'p2',
            patientName: 'Sarah Johnson',
            patientPhone: '+1 (555) 987-6543',
            patientEmail: 'sarah@email.com',
            date: '2024-02-15',
            time: '11:00 AM',
            duration: 45,
            type: 'video',
            status: 'scheduled',
            reason: 'Skin rash consultation',
            isEmergency: false,
            isFirstVisit: true,
            createdAt: '2024-02-12',
            updatedAt: '2024-02-12',
          },
          {
            id: 'a3',
            patientId: 'p3',
            patientName: 'Mike Wilson',
            patientPhone: '+1 (555) 456-7890',
            patientEmail: 'mike@email.com',
            date: '2024-02-15',
            time: '2:30 PM',
            duration: 30,
            type: 'in-person',
            status: 'scheduled',
            reason: 'Blood pressure check',
            isEmergency: false,
            isFirstVisit: false,
            createdAt: '2024-02-11',
            updatedAt: '2024-02-11',
          },
        ],
        upcomingAppointments: [],
        emergencyRequests: [
          {
            id: 'er1',
            patientId: 'p4',
            patientName: 'Emma Davis',
            bloodGroup: 'O-',
            units: 2,
            hospital: 'City General Hospital',
            urgency: 'urgent',
            status: 'pending',
            requestDate: '2024-02-15',
            requiredDate: '2024-02-15',
            reason: 'Emergency surgery',
          },
        ],
        pendingPrescriptions: [],
        videoConsultations: [
          {
            id: 'vc1',
            appointmentId: 'a2',
            doctorId: doctorId,
            patientId: 'p2',
            patientName: 'Sarah Johnson',
            date: '2024-02-15',
            startTime: '11:00 AM',
            status: 'scheduled',
            roomId: 'room-123',
          },
        ],
        recentPatients: [],
        earnings: {
          today: 450,
          thisWeek: 2800,
          thisMonth: 12500,
          total: 156000,
          breakdown: {
            consultations: 350,
            videoConsultations: 100,
            followUps: 0,
          },
          chartData: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            values: [450, 600, 550, 700, 500, 0, 0],
          },
        },
        stats: {
          totalPatients: 1250,
          todayPatients: 15,
          completedAppointments: 8,
          cancelledAppointments: 2,
          averageRating: 4.8,
          totalReviews: 245,
          prescriptionCount: 890,
          videoConsultCount: 156,
        },
        activities: [
          {
            id: 'act1',
            type: 'appointment',
            description: 'Appointment completed with John Doe',
            patientName: 'John Doe',
            time: '09:30 AM',
            status: 'completed',
          },
          {
            id: 'act2',
            type: 'prescription',
            description: 'New prescription created for Sarah Johnson',
            patientName: 'Sarah Johnson',
            time: '10:45 AM',
            status: 'completed',
          },
        ],
        notifications: [
          {
            id: 'n1',
            type: 'emergency',
            title: 'Emergency Blood Request',
            message: 'Urgent blood request from Emma Davis - O- blood group needed',
            isRead: false,
            createdAt: '2024-02-15T08:30:00',
            priority: 'urgent',
          },
          {
            id: 'n2',
            type: 'appointment',
            title: 'New Appointment',
            message: 'New video consultation scheduled with Sarah Johnson at 11:00 AM',
            isRead: false,
            createdAt: '2024-02-15T07:00:00',
            priority: 'medium',
          },
        ],
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

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Doctor Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, Dr. Smith |
            <span className="text-green-600 font-medium"> Online</span>
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-gray-600 cursor-pointer" />
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {dashboardData.notifications.filter((n) => !n.isRead).length}
            </span>
          </div>
          <button
            onClick={() => onNavigate('profile')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            View Profile
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          icon={<Calendar className="w-6 h-6 text-blue-500" />}
          title="Today's Appointments"
          value={dashboardData.todayAppointments.length.toString()}
          subtitle={`${dashboardData.stats.completedAppointments} completed`}
          color="blue"
        />
        <StatsCard
          icon={<Users className="w-6 h-6 text-green-500" />}
          title="Total Patients"
          value={dashboardData.stats.totalPatients.toString()}
          subtitle={`${dashboardData.stats.todayPatients} today`}
          color="green"
        />
        <StatsCard
          icon={<DollarSign className="w-6 h-6 text-yellow-500" />}
          title="Today's Earnings"
          value={`$${dashboardData.earnings.today}`}
          subtitle={`$${dashboardData.earnings.thisWeek} this week`}
          color="yellow"
        />
        <StatsCard
          icon={<Star className="w-6 h-6 text-purple-500" />}
          title="Rating"
          value={dashboardData.stats.averageRating.toString()}
          subtitle={`${dashboardData.stats.totalReviews} reviews`}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-500" />
                Today's Appointments
              </h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>

            <div className="space-y-4">
              {dashboardData.todayAppointments.map((appointment) => (
                <AppointmentRow
                  key={appointment.id}
                  appointment={appointment}
                  onStartVideoConsultation={() => onNavigate('video-consultation')}
                  onCreatePrescription={() => onNavigate('prescription')}
                />
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-green-500" />
              Recent Activities
            </h2>
            <div className="space-y-4">
              {dashboardData.activities.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Emergency Requests
              </h3>
              <span className="bg-white text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                {dashboardData.emergencyRequests.length} Pending
              </span>
            </div>

            {dashboardData.emergencyRequests.map((request) => (
              <div key={request.id} className="bg-red-400/30 rounded-lg p-4 mb-3">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">{request.patientName}</p>
                    <p className="text-sm opacity-90">Blood Group: {request.bloodGroup}</p>
                  </div>
                  <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full">
                    {request.urgency}
                  </span>
                </div>
                <p className="text-sm mb-3">{request.reason}</p>
                <div className="flex space-x-2">
                  <button className="flex-1 bg-white text-red-600 px-3 py-1 rounded text-sm font-medium hover:bg-red-50">
                    Approve
                  </button>
                  <button className="flex-1 bg-red-400/50 px-3 py-1 rounded text-sm hover:bg-red-400/70">
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Video className="w-5 h-5 mr-2 text-blue-500" />
              Video Consultations
            </h3>
            {dashboardData.videoConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="flex items-center justify-between bg-blue-50 p-3 rounded-lg mb-3"
              >
                <div>
                  <p className="font-medium text-sm">{consultation.patientName}</p>
                  <p className="text-xs text-gray-600">{consultation.startTime}</p>
                </div>
                <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700">
                  Join
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <DollarSign className="w-5 h-5 mr-2 text-green-500" />
              Earnings Overview
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Consultations</span>
                <span className="font-medium">${dashboardData.earnings.breakdown.consultations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Video Consults</span>
                <span className="font-medium">
                  ${dashboardData.earnings.breakdown.videoConsultations}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Follow-ups</span>
                <span className="font-medium">${dashboardData.earnings.breakdown.followUps}</span>
              </div>
              <div className="border-t pt-3 flex justify-between">
                <span className="font-semibold">Total Today</span>
                <span className="font-bold text-green-600">${dashboardData.earnings.today}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onNavigate('patients')}
                className="flex flex-col items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100"
              >
                <Users className="w-6 h-6 text-blue-600 mb-1" />
                <span className="text-xs text-gray-700">Patient List</span>
              </button>
              <button
                onClick={() => onNavigate('prescription')}
                className="flex flex-col items-center p-3 bg-green-50 rounded-lg hover:bg-green-100"
              >
                <Pill className="w-6 h-6 text-green-600 mb-1" />
                <span className="text-xs text-gray-700">Prescription</span>
              </button>
              <button
                onClick={() => onNavigate('schedule')}
                className="flex flex-col items-center p-3 bg-purple-50 rounded-lg hover:bg-purple-100"
              >
                <Clock className="w-6 h-6 text-purple-600 mb-1" />
                <span className="text-xs text-gray-700">Schedule</span>
              </button>
              <button
                onClick={() => onNavigate('messages')}
                className="flex flex-col items-center p-3 bg-orange-50 rounded-lg hover:bg-orange-100"
              >
                <MessageCircle className="w-6 h-6 text-orange-600 mb-1" />
                <span className="text-xs text-gray-700">Messages</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENTS (Exported)
// ============================================

export const StatsCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
  color: string;
}> = ({ icon, title, value, subtitle, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-2 rounded-lg ${statsIconBg[color] ?? 'bg-gray-100'}`}>{icon}</div>
      <TrendingUp className="w-5 h-5 text-green-500" />
    </div>
    <h3 className="text-2xl font-bold">{value}</h3>
    <p className="text-sm text-gray-600 mt-1">{title}</p>
    <p className="text-xs text-gray-500 mt-2">{subtitle}</p>
  </div>
);

export const AppointmentRow: React.FC<{
  appointment: Appointment;
  onStartVideoConsultation: () => void;
  onCreatePrescription: () => void;
}> = ({ appointment, onStartVideoConsultation, onCreatePrescription }) => (
  <div className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50">
    <div className="flex items-center space-x-4">
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center ${
          appointment.type === 'video'
            ? 'bg-blue-100'
            : appointment.type === 'phone'
              ? 'bg-green-100'
              : 'bg-purple-100'
        }`}
      >
        {appointment.type === 'video' ? (
          <Video className="w-6 h-6 text-blue-600" />
        ) : appointment.type === 'phone' ? (
          <Phone className="w-6 h-6 text-green-600" />
        ) : (
          <Users className="w-6 h-6 text-purple-600" />
        )}
      </div>
      <div>
        <p className="font-semibold">{appointment.patientName}</p>
        <p className="text-sm text-gray-600">{appointment.reason}</p>
        <div className="flex items-center space-x-3 mt-1">
          <span className="text-xs text-gray-500">{appointment.time}</span>
          <span className="text-xs text-gray-500">•</span>
          <span className="text-xs text-gray-500 capitalize">{appointment.type}</span>
          {appointment.isEmergency && (
            <>
              <span className="text-xs text-gray-500">•</span>
              <span className="text-xs text-red-600 font-medium">Emergency</span>
            </>
          )}
        </div>
      </div>
    </div>
    <div className="flex items-center space-x-2">
      {appointment.type === 'video' && (
        <button
          onClick={onStartVideoConsultation}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          Start Call
        </button>
      )}
      <button
        onClick={onCreatePrescription}
        className="px-3 py-1 border border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50"
      >
        Prescription
      </button>
      <select className="border rounded px-2 py-1 text-sm">
        <option value="scheduled">Scheduled</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
  </div>
);

export const ActivityItem: React.FC<{ activity: DoctorActivity }> = ({ activity }) => (
  <div className="flex items-start space-x-3">
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center ${
        activity.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
      }`}
    >
      {activity.type === 'prescription' ? (
        <FileText className="w-4 h-4 text-green-600" />
      ) : activity.type === 'appointment' ? (
        <Calendar className="w-4 h-4 text-blue-600" />
      ) : (
        <CheckCircle className="w-4 h-4 text-purple-600" />
      )}
    </div>
    <div className="flex-1">
      <p className="text-sm">{activity.description}</p>
      <p className="text-xs text-gray-500">{activity.time}</p>
    </div>
  </div>
);

export default DoctorDashboard;