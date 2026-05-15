// components/client/ClientDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, Activity, Droplet, FileText,
  Bell, TrendingUp, AlertTriangle, Heart,
  Pill, ChevronRight, Video, MessageCircle
} from 'lucide-react';
import { DashboardData } from '../../types/client';

interface ClientDashboardProps {
  clientId: string;
}

export const ClientDashboard: React.FC<ClientDashboardProps> = ({ clientId }) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [clientId]);

  const fetchDashboardData = async () => {
    // Simulate API call
    setTimeout(() => {
      const mockData: DashboardData = {
        upcomingAppointments: [
          {
            id: '1',
            doctorId: 'd1',
            doctorName: 'Dr. Sarah Wilson',
            specialization: 'Cardiologist',
            date: '2024-02-15',
            time: '10:00 AM',
            type: 'in-person',
            status: 'scheduled',
            reason: 'Regular checkup',
          },
          {
            id: '2',
            doctorId: 'd2',
            doctorName: 'Dr. James Brown',
            specialization: 'Dermatologist',
            date: '2024-02-20',
            time: '2:30 PM',
            type: 'video',
            status: 'scheduled',
            reason: 'Skin consultation',
          }
        ],
        bloodDonationStatus: {
          lastDonation: {
            id: 'bd1',
            date: '2023-11-15',
            location: 'City Blood Bank',
            bloodBank: 'City Blood Bank',
            units: 1,
            nextEligibleDate: '2024-02-15'
          },
          nextEligibleDate: '2024-02-15',
          totalDonations: 8,
          livesSaved: 24
        },
        healthReports: {
          recent: [
            {
              id: 'r1',
              type: 'Blood Test',
              date: '2024-01-10',
              doctor: 'Dr. Sarah Wilson',
              status: 'completed',
              summary: 'All parameters normal'
            }
          ],
          pending: [
            {
              id: 'r2',
              type: 'X-Ray',
              date: '2024-02-01',
              doctor: 'Dr. James Brown',
              status: 'pending'
            }
          ]
        },
        emergencyRequests: [],
        connectedDoctors: [
          {
            id: 'd1',
            name: 'Dr. Sarah Wilson',
            specialization: 'Cardiologist',
            qualifications: ['MD', 'FACC'],
            experience: 15,
            rating: 4.8,
            reviewCount: 245,
            consultationFee: 150,
            availability: [],
            languages: ['English', 'Spanish'],
            hospital: 'City General Hospital',
            address: '123 Medical Center Dr',
            about: 'Experienced cardiologist',
            education: [],
            awards: [],
            publications: 45,
            profileImage: '',
            consultationModes: ['in-person', 'video'],
            successRate: 98,
            patientCount: 5000
          }
        ],
        connectedHospitals: [
          {
            id: 'h1',
            name: 'City General Hospital',
            address: '123 Medical Center Dr',
            contact: '+1 (555) 999-8888',
            services: ['Emergency', 'Cardiology', 'Surgery'],
            rating: 4.5
          }
        ],
        medicineReminders: [
          {
            medicineName: 'Lisinopril',
            dosage: '10mg',
            time: '08:00 AM',
            withFood: false,
            duration: 'Daily'
          }
        ],
        healthActivity: [
          {
            id: 'a1',
            type: 'appointment',
            date: '2024-01-10',
            description: 'Cardiology checkup with Dr. Wilson',
            status: 'completed'
          },
          {
            id: 'a2',
            type: 'medication',
            date: '2024-01-10',
            description: 'Started new medication: Lisinopril',
            status: 'completed'
          },
          {
            id: 'a3',
            type: 'report',
            date: '2024-01-12',
            description: 'Blood test results received',
            status: 'completed'
          }
        ]
      };
      
      setDashboardData(mockData);
      setIsLoading(false);
    }, 1500);
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Welcome Back!</h1>
        <p className="text-gray-600 mt-2">Here's your health overview</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Calendar className="w-6 h-6 text-blue-500" />}
          label="Upcoming Appointments"
          value={dashboardData.upcomingAppointments.length.toString()}
          trend="Next: Feb 15"
        />
        <StatCard
          icon={<Droplet className="w-6 h-6 text-red-500" />}
          label="Blood Donations"
          value={dashboardData.bloodDonationStatus.totalDonations.toString()}
          trend={`${dashboardData.bloodDonationStatus.livesSaved} lives saved`}
        />
        <StatCard
          icon={<FileText className="w-6 h-6 text-green-500" />}
          label="Health Reports"
          value={dashboardData.healthReports.recent.length.toString()}
          trend={`${dashboardData.healthReports.pending.length} pending`}
        />
        <StatCard
          icon={<Pill className="w-6 h-6 text-purple-500" />}
          label="Medicine Reminders"
          value={dashboardData.medicineReminders.length.toString()}
          trend="Active reminders"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upcoming Appointments</h2>
              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData.upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
            </div>
          </div>

          {/* Health Activity Timeline */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Health Activity</h2>
            <div className="space-y-4">
              {dashboardData.healthActivity.map((activity) => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Blood Donation Status */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Blood Donation Status</h3>
              <Droplet className="w-6 h-6" />
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-sm opacity-90">Next Eligible Date</p>
                <p className="text-2xl font-bold">{dashboardData.bloodDonationStatus.nextEligibleDate}</p>
              </div>
              <div className="border-t border-red-400 pt-3">
                <p className="text-sm opacity-90">Lives Saved</p>
                <p className="text-2xl font-bold">{dashboardData.bloodDonationStatus.livesSaved}</p>
              </div>
            </div>
            <button className="mt-4 w-full bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50">
              Schedule Donation
            </button>
          </div>

          {/* Medicine Reminders */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-purple-500" />
              Medicine Reminders
            </h3>
            <div className="space-y-3">
              {dashboardData.medicineReminders.map((reminder, index) => (
                <div key={index} className="flex items-center justify-between bg-purple-50 p-3 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{reminder.medicineName}</p>
                    <p className="text-xs text-gray-600">{reminder.dosage} at {reminder.time}</p>
                  </div>
                  <button className="text-purple-600 text-sm font-medium">
                    Take
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Requests */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
              Emergency
            </h3>
            <button className="w-full bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 mb-3">
              Request Blood
            </button>
            <button className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-700">
              Medical Emergency
            </button>
          </div>

          {/* Connected Doctors */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Your Doctors</h3>
            <div className="space-y-3">
              {dashboardData.connectedDoctors.map((doctor) => (
                <div key={doctor.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{doctor.name}</p>
                    <p className="text-xs text-gray-600">{doctor.specialization}</p>
                  </div>
                  <button className="text-blue-600">
                    <Video className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  trend: string;
}> = ({ icon, label, value, trend }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      {icon}
      <span className="text-xs text-gray-500">{trend}</span>
    </div>
    <p className="text-3xl font-bold">{value}</p>
    <p className="text-sm text-gray-600 mt-1">{label}</p>
  </div>
);

const AppointmentCard: React.FC<{ appointment: any }> = ({ appointment }) => (
  <div className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50">
    <div className="flex items-center space-x-4">
      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
        appointment.type === 'video' ? 'bg-blue-100' : 'bg-green-100'
      }`}>
        {appointment.type === 'video' ? (
          <Video className="w-6 h-6 text-blue-600" />
        ) : (
          <Calendar className="w-6 h-6 text-green-600" />
        )}
      </div>
      <div>
        <p className="font-semibold">{appointment.doctorName}</p>
        <p className="text-sm text-gray-600">{appointment.specialization}</p>
        <p className="text-sm text-gray-500">{appointment.reason}</p>
      </div>
    </div>
    <div className="text-right">
      <p className="font-medium">{appointment.date}</p>
      <p className="text-sm text-gray-600">{appointment.time}</p>
      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded mt-1 capitalize">
        {appointment.type}
      </span>
    </div>
  </div>
);

const ActivityItem: React.FC<{ activity: any }> = ({ activity }) => (
  <div className="flex items-start space-x-3">
    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
      activity.status === 'completed' ? 'bg-green-100' : 'bg-yellow-100'
    }`}>
      <Activity className={`w-4 h-4 ${
        activity.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
      }`} />
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium">{activity.description}</p>
      <p className="text-xs text-gray-500">{activity.date}</p>
    </div>
    <span className={`text-xs px-2 py-1 rounded-full ${
      activity.status === 'completed' 
        ? 'bg-green-100 text-green-700' 
        : 'bg-yellow-100 text-yellow-700'
    }`}>
      {activity.status}
    </span>
  </div>
);