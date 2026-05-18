// src/components/women/WomenCareDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  Heart, Baby, Calendar, Pill, Syringe,
  Activity, Bell, Phone, MapPin, Clock,
  TrendingUp, Droplet, Thermometer, Weight,
  Ruler, AlertCircle, CheckCircle, ChevronRight,
  Stethoscope, Users, FileText, Shield
} from 'lucide-react';
import { WomenCareDashboardData } from '../../types/womenCare';

interface WomenCareDashboardProps {
  userId: string;
  onNavigate: (page: string) => void;
}

export const WomenCareDashboard: React.FC<WomenCareDashboardProps> = ({
  userId,
  onNavigate
}) => {
  const [dashboardData, setDashboardData] = useState<WomenCareDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData: WomenCareDashboardData = {
        pregnancy: {
          id: 'p1',
          userId: userId,
          motherName: 'Sarah Johnson',
          motherAge: 28,
          bloodGroup: 'B+',
          lastMenstrualDate: '2024-08-01',
          expectedDeliveryDate: '2025-05-08',
          currentWeek: 24,
          currentTrimester: 'second',
          isFirstPregnancy: true,
          previousPregnancies: 0,
          weightGain: [
            { date: '2025-01-15', weight: 65, week: 24, notes: 'Normal gain' }
          ],
          bloodPressure: [
            { date: '2025-01-15', systolic: 120, diastolic: 80, week: 24 }
          ],
          bloodSugar: [
            { date: '2025-01-15', value: 95, type: 'fasting', week: 24 }
          ],
          hemoglobin: [
            { date: '2025-01-15', value: 11.5, week: 24 }
          ],
          symptoms: [
            { id: 's1', name: 'Back pain', severity: 'mild', startDate: '2025-01-10' },
            { id: 's2', name: 'Heartburn', severity: 'moderate', startDate: '2025-01-12' }
          ],
          appointments: [
            {
              id: 'a1',
              date: '2025-01-20',
              time: '10:00 AM',
              doctorName: 'Dr. Emily White',
              doctorSpecialization: 'Gynecologist',
              hospitalName: 'Women Care Hospital',
              type: 'regular-checkup',
              status: 'scheduled',
              reminders: true
            }
          ],
          medications: [
            {
              id: 'm1',
              name: 'Prenatal Vitamins',
              dosage: '1 tablet',
              frequency: 'Once daily',
              startDate: '2024-09-01',
              prescribedBy: 'Dr. Emily White',
              purpose: 'Fetal development',
              isSafe: true,
              reminders: true,
              reminderTimes: ['08:00']
            }
          ],
          ultrasounds: [],
          babyGender: 'girl',
          babyName: 'Emma',
          fetalMovement: [
            { date: '2025-01-15', week: 24, kickCount: 15, duration: 30 }
          ],
          status: 'ongoing',
          complications: [],
          notes: '',
          createdAt: '2024-09-01',
          updatedAt: '2025-01-15'
        },
        upcomingAppointments: [
          {
            id: 'a1',
            date: '2025-01-20',
            time: '10:00 AM',
            doctorName: 'Dr. Emily White',
            doctorSpecialization: 'Gynecologist',
            hospitalName: 'Women Care Hospital',
            type: 'regular-checkup',
            status: 'scheduled',
            reminders: true
          }
        ],
        todayMedications: [
          {
            id: 'm1',
            name: 'Prenatal Vitamins',
            dosage: '1 tablet',
            frequency: 'Once daily',
            startDate: '2024-09-01',
            prescribedBy: 'Dr. Emily White',
            purpose: 'Fetal development',
            isSafe: true,
            reminders: true,
            reminderTimes: ['08:00']
          }
        ],
        babyVaccines: [
          {
            id: 'v1',
            vaccineName: 'Hepatitis B',
            disease: 'Hepatitis B',
            dose: 1,
            scheduledDate: '2025-06-08',
            status: 'scheduled'
          }
        ],
        cycleInfo: {
          id: 'c1',
          userId: userId,
          lastPeriodDate: '2024-08-01',
          cycleLength: 28,
          periodDuration: 5,
          isRegular: true,
          nextPeriodDate: '2025-06-15',
          ovulationDate: '2025-06-01',
          fertileWindow: { start: '2025-05-28', end: '2025-06-03' },
          cycleHistory: [],
          symptoms: [],
          reminderEnabled: true,
          reminderDays: 2
        },
        notifications: [
          {
            id: 'n1',
            type: 'appointment',
            title: 'Upcoming Checkup',
            message: 'Your prenatal checkup is scheduled for January 20',
            priority: 'high',
            isRead: false,
            createdAt: '2025-01-15T08:00:00'
          }
        ],
        healthTips: [
          'Stay hydrated - drink at least 8-10 glasses of water daily',
          'Take your prenatal vitamins regularly',
          'Practice gentle exercises like walking or prenatal yoga',
          'Monitor your baby\'s movements daily',
          'Eat a balanced diet rich in iron and calcium'
        ],
        emergencyInfo: {
          id: 'e1',
          userId: userId,
          userName: 'Sarah Johnson',
          emergencyContacts: [
            { name: 'John Johnson', relationship: 'Husband', phone: '+1 (555) 111-2222', isAvailable: true },
            { name: 'Dr. Emily White', relationship: 'Doctor', phone: '+1 (555) 333-4444', isAvailable: true }
          ],
          nearestHospitals: [
            {
              id: 'h1',
              name: 'Women Care Hospital',
              distance: 2.5,
              estimatedTime: '8 min',
              hasEmergencyWard: true,
              hasNICU: true,
              phone: '+1 (555) 999-8888',
              address: '123 Health Ave',
              coordinates: { latitude: 40.7128, longitude: -74.006 }
            }
          ],
          emergencyKit: [
            { name: 'Hospital bag packed', isReady: true, quantity: 1 },
            { name: 'Important documents', isReady: true, quantity: 1 },
            { name: 'Baby clothes', isReady: true, quantity: 5 }
          ],
          quickActions: [
            { id: 'q1', name: 'Call Ambulance', icon: 'ambulance', action: 'call', phoneNumber: '911' },
            { id: 'q2', name: 'Call Doctor', icon: 'doctor', action: 'call', phoneNumber: '+1 (555) 333-4444' }
          ]
        }
      };

      setDashboardData(mockData);
      setIsLoading(false);
    }, 1500);
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen bg-pink-50">
        <div className="text-center">
          <Heart className="w-16 h-16 text-pink-500 mx-auto animate-pulse" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mt-4"></div>
          <p className="mt-4 text-gray-600">Loading Women Care Dashboard...</p>
        </div>
      </div>
    );
  }

  const pregnancy = dashboardData.pregnancy;

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-purple-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl p-8 mb-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Heart className="w-8 h-8 mr-3" />
              Women Extra Care
            </h1>
            <p className="text-pink-100 mt-2">
              Complete pregnancy & women health support
            </p>
          </div>
          {pregnancy && (
            <div className="text-center bg-white/20 rounded-xl p-4">
              <p className="text-4xl font-bold">{pregnancy.currentWeek}</p>
              <p className="text-sm">Weeks Pregnant</p>
            </div>
          )}
        </div>
      </div>

      {/* Pregnancy Progress */}
      {pregnancy && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <Baby className="w-6 h-6 mr-2 text-pink-500" />
            Pregnancy Progress
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <ProgressCard
              icon={<Calendar className="w-6 h-6 text-pink-500" />}
              label="Due Date"
              value={pregnancy.expectedDeliveryDate}
              color="pink"
            />
            <ProgressCard
              icon={<Activity className="w-6 h-6 text-purple-500" />}
              label="Trimester"
              value={pregnancy.currentTrimester}
              color="purple"
            />
            <ProgressCard
              icon={<Heart className="w-6 h-6 text-red-500" />}
              label="Baby Gender"
              value={pregnancy.babyGender || 'Unknown'}
              color="red"
            />
            <ProgressCard
              icon={<Shield className="w-6 h-6 text-green-500" />}
              label="Status"
              value={pregnancy.status}
              color="green"
            />
          </div>

          {/* Week Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Week 1</span>
              <span className="font-semibold">Week {pregnancy.currentWeek}</span>
              <span>Week 40</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-gradient-to-r from-pink-400 to-purple-500 h-4 rounded-full transition-all duration-500"
                style={{ width: `${(pregnancy.currentWeek / 40) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Access Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <QuickAccessCard
              icon={<Calendar className="w-8 h-8 text-pink-500" />}
              label="Pregnancy Tracker"
              onClick={() => onNavigate('pregnancy-tracker')}
              color="pink"
            />
            <QuickAccessCard
              icon={<Pill className="w-8 h-8 text-purple-500" />}
              label="Medicine Record"
              onClick={() => onNavigate('medicine-record')}
              color="purple"
            />
            <QuickAccessCard
              icon={<Stethoscope className="w-8 h-8 text-blue-500" />}
              label="Gynecologist"
              onClick={() => onNavigate('gynecologist')}
              color="blue"
            />
            <QuickAccessCard
              icon={<Syringe className="w-8 h-8 text-green-500" />}
              label="Baby Vaccines"
              onClick={() => onNavigate('baby-vaccines')}
              color="green"
            />
            <QuickAccessCard
              icon={<Activity className="w-8 h-8 text-orange-500" />}
              label="Health Monitor"
              onClick={() => onNavigate('health-monitor')}
              color="orange"
            />
            <QuickAccessCard
              icon={<Users className="w-8 h-8 text-indigo-500" />}
              label="Child Growth"
              onClick={() => onNavigate('child-growth')}
              color="indigo"
            />
            <QuickAccessCard
              icon={<Droplet className="w-8 h-8 text-red-500" />}
              label="Cycle Tracker"
              onClick={() => onNavigate('cycle-tracker')}
              color="red"
            />
            <QuickAccessCard
              icon={<Phone className="w-8 h-8 text-red-600" />}
              label="Emergency"
              onClick={() => onNavigate('emergency')}
              color="red"
            />
          </div>

          {/* Health Tips */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Heart className="w-6 h-6 mr-2 text-pink-500" />
              Health Tips for You
            </h2>
            <div className="space-y-3">
              {dashboardData.healthTips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-pink-50 rounded-xl">
                  <CheckCircle className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{tip}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Appointments */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-purple-500" />
              Upcoming Appointments
            </h2>
            {dashboardData.upcomingAppointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between border rounded-xl p-4 hover:bg-purple-50">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{appointment.doctorName}</p>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                    <p className="text-sm text-gray-500">{appointment.date} at {appointment.time}</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Today's Medications */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Pill className="w-5 h-5 mr-2 text-pink-500" />
              Today's Medications
            </h3>
            {dashboardData.todayMedications.map((med) => (
              <div key={med.id} className="flex items-center justify-between p-3 bg-pink-50 rounded-xl mb-3">
                <div>
                  <p className="font-medium text-sm">{med.name}</p>
                  <p className="text-xs text-gray-600">{med.dosage} - {med.frequency}</p>
                </div>
                <button className="px-3 py-1 bg-pink-600 text-white text-xs rounded-lg hover:bg-pink-700">
                  Take
                </button>
              </div>
            ))}
          </div>

          {/* Baby Vaccines */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Syringe className="w-5 h-5 mr-2 text-green-500" />
              Upcoming Vaccines
            </h3>
            {dashboardData.babyVaccines.map((vaccine) => (
              <div key={vaccine.id} className="flex items-center justify-between p-3 bg-green-50 rounded-xl mb-3">
                <div>
                  <p className="font-medium text-sm">{vaccine.vaccineName}</p>
                  <p className="text-xs text-gray-600">Dose {vaccine.dose} • {vaccine.scheduledDate}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  vaccine.status === 'completed' ? 'bg-green-200 text-green-700' : 'bg-yellow-200 text-yellow-700'
                }`}>
                  {vaccine.status}
                </span>
              </div>
            ))}
          </div>

          {/* Emergency Support */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Emergency Support
            </h3>
            
            <div className="space-y-3 mb-4">
              {dashboardData.emergencyInfo.emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-center justify-between bg-red-400/30 rounded-lg p-3">
                  <div>
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs opacity-90">{contact.relationship}</p>
                  </div>
                  <button className="px-3 py-1 bg-white text-red-600 text-xs rounded-lg font-medium hover:bg-red-50">
                    Call
                  </button>
                </div>
              ))}
            </div>

            <button className="w-full bg-white text-red-600 px-4 py-3 rounded-xl font-semibold hover:bg-red-50 mb-3">
              🚨 Emergency SOS
            </button>

            <div className="text-sm">
              <p className="font-medium mb-2">Nearest Hospital:</p>
              {dashboardData.emergencyInfo.nearestHospitals.map((hospital) => (
                <div key={hospital.id} className="bg-red-400/30 rounded-lg p-3">
                  <p className="font-medium">{hospital.name}</p>
                  <p className="text-xs opacity-90">{hospital.distance} km • {hospital.estimatedTime}</p>
                  <p className="text-xs opacity-90">NICU: {hospital.hasNICU ? '✅' : '❌'}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Menstrual Cycle Info */}
          {dashboardData.cycleInfo && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Droplet className="w-5 h-5 mr-2 text-red-500" />
                Cycle Tracker
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Next Period</span>
                  <span className="font-medium">{dashboardData.cycleInfo.nextPeriodDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Ovulation</span>
                  <span className="font-medium">{dashboardData.cycleInfo.ovulationDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cycle Length</span>
                  <span className="font-medium">{dashboardData.cycleInfo.cycleLength} days</span>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Bell className="w-5 h-5 mr-2 text-pink-500" />
              Notifications
            </h3>
            {dashboardData.notifications.map((notification) => (
              <div key={notification.id} className={`p-3 rounded-lg mb-3 ${
                notification.priority === 'urgent' ? 'bg-red-50 border border-red-200' :
                notification.priority === 'high' ? 'bg-orange-50 border border-orange-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                <p className="text-sm font-medium">{notification.title}</p>
                <p className="text-xs text-gray-600">{notification.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Sub-components
const ProgressCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className={`bg-${color}-50 rounded-xl p-4 text-center`}>
    <div className="flex justify-center mb-2">{icon}</div>
    <p className="text-lg font-bold capitalize">{value}</p>
    <p className="text-xs text-gray-600">{label}</p>
  </div>
);

const QuickAccessCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}> = ({ icon, label, onClick, color }) => (
  <button
    onClick={onClick}
    className={`bg-white rounded-xl shadow p-4 hover:shadow-lg transition-all hover:bg-${color}-50 flex flex-col items-center`}
  >
    {icon}
    <span className="text-xs font-medium mt-2 text-center">{label}</span>
  </button>
);


export default WomenCareDashboard;
