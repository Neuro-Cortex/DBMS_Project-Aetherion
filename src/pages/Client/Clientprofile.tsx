// src/pages/Client/ClientProfile.tsx
// COMPLETE CLIENT PROFILE WITH ALL FEATURES - DARK MODE

import React, { useState, useEffect } from 'react';
import {
  User, MapPin, Heart, Activity, Calendar, FileText, AlertTriangle,
  Droplet, Weight, Thermometer, ChevronRight,
  Clock, Pill,  CheckCircle, Settings, LogOut,
   Search, Moon, Sun
  
} from 'lucide-react';

// Local ClientProfile interface matching the component's data structure
interface ClientProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  age: number;
  bloodGroup: string;
  gender: string;
  profileImage: string;
  coverImage: string;
  bio: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
    email: string;
  };
  medicalHistory: {
    conditions: Array<{ id: string; name: string; diagnosedDate: string; status: string; notes: string }>;
    surgeries: Array<{ id: string; name: string; date: string; hospital: string; notes: string }>;
    allergies: string[];
    familyHistory: string[];
  };
  lifestyle: {
    smoking: boolean;
    alcohol: boolean;
    exercise: string;
    diet: string;
  };
  vitals: {
    height: number;
    weight: number;
    bloodPressure: string;
    bloodSugar: string;
    heartRate: number;
    temperature: number;
    oxygenSaturation: number;
    bmi: number;
    lastUpdated: string;
  };
  currentMedications: Array<{
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    startDate: string;
    endDate: string;
    prescribedBy: string;
    isActive: boolean;
  }>;
  vaccinations: Array<{
    id: string;
    name: string;
    date: string;
    dose: string;
    nextDueDate: string;
    certificateUrl: string;
  }>;
  appointments: Array<{
    id: string;
    date: string;
    doctorName: string;
    type: string;
    status: string;
  }>;
  prescriptions: Array<{
    id: string;
    date: string;
    doctorName: string;
    medicine: string;
    status: string;
  }>;
  reports: Array<{
    id: string;
    date: string;
    type: string;
    result: string;
    status: string;
  }>;
  bloodDonations: Array<{
    id: string;
    date: string;
    units: number;
    hospital: string;
    points: number;
  }>;
  preferences: {
    language: string;
    theme: string;
    fontSize: string;
    notifications: {
      email: boolean;
      sms: boolean;
      push: boolean;
      appointments: boolean;
      medications: boolean;
      reports: boolean;
    };
    privacy: {
      showProfile: boolean;
      showMedicalHistory: boolean;
      showDonations: boolean;
    };
  };
  security: {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginHistory: Array<{ date: string; ip: string; device: string; location: string }>;
    connectedDevices: Array<{ id: string; name: string; type: string; lastActive: string; isCurrent: boolean }>;
  };
  accountType: string;
  memberSince: string;
  lastLogin: string;
  isVerified: boolean;
  isOnline: boolean;
  totalVisits: number;
  totalSpent: number;
}

export const ClientProfile: React.FC = () => {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState<'overview' | 'medical' | 'appointments' | 'records' | 'settings'>('overview');
  const [isDarkMode, setIsDarkMode] = useState(true); // ✅ Dark mode default true
  const activeModal = null;

  useEffect(() => {
    fetchProfile();
    // Apply dark mode class
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const fetchProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockProfile: ClientProfile = {
        // ... same mock data as before
        id: 'user-123',
        firstName: 'Shihab Rahman',
        lastName: 'Doe',
        email: 'john.doe@email.com',
        phone: '+1 (555) 123-4567',
        dateOfBirth: '1996-05-15',
        age: 28,
        bloodGroup: 'O+',
        gender: 'male',
        profileImage: '',
        coverImage: '',
        bio: 'Health-conscious individual focused on preventive care and wellness.',
        address: { street: '123 Health Street', city: 'New York', state: 'NY', zipCode: '10001', country: 'USA' },
        emergencyContact: { name: 'Jane Doe', relationship: 'Spouse', phone: '+1 (555) 987-6543', email: 'jane.doe@email.com' },
        medicalHistory: {
          conditions: [{ id: 'c1', name: 'Hypertension', diagnosedDate: '2020-01-15', status: 'managed', notes: 'Controlled with medication' }],
          surgeries: [{ id: 's1', name: 'Appendectomy', date: '2018-06-20', hospital: 'City General Hospital', notes: 'Successful' }],
          allergies: ['Penicillin', 'Peanuts', 'Dust'],
          familyHistory: ['Diabetes - Father', 'Heart Disease - Mother']
        },
        lifestyle: { smoking: false, alcohol: false, exercise: 'moderate', diet: 'non-vegetarian' },
        vitals: { height: 175, weight: 70, bloodPressure: '120/80', bloodSugar: '95', heartRate: 72, temperature: 98.6, oxygenSaturation: 98, bmi: 22.9, lastUpdated: '2025-01-15' },
        currentMedications: [{ id: 'm1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2020-01-20', endDate: '', prescribedBy: 'Dr. Sarah Wilson', isActive: true }],
        vaccinations: [
          { id: 'v1', name: 'COVID-19 Vaccine', date: '2021-03-15', dose: '2nd Dose', nextDueDate: '2025-09-15', certificateUrl: '#' },
          { id: 'v2', name: 'Flu Vaccine', date: '2024-10-01', dose: 'Annual', nextDueDate: '2025-10-01', certificateUrl: '#' }
        ],
        appointments: [
          { id: 'a1', date: '2025-01-20', doctorName: 'Dr. Sarah Wilson', type: 'Cardiology', status: 'upcoming' },
          { id: 'a2', date: '2025-01-15', doctorName: 'Dr. James Brown', type: 'Dermatology', status: 'completed' }
        ],
        prescriptions: [{ id: 'p1', date: '2025-01-15', doctorName: 'Dr. Sarah Wilson', medicine: 'Lisinopril 10mg', status: 'active' }],
        reports: [
          { id: 'r1', date: '2025-01-10', type: 'Blood Test', result: 'Normal', status: 'completed' },
          { id: 'r2', date: '2025-01-05', type: 'X-Ray', result: 'Normal', status: 'completed' }
        ],
        bloodDonations: [
          { id: 'b1', date: '2025-01-15', units: 1, hospital: 'City General Hospital', points: 100 },
          { id: 'b2', date: '2024-10-10', units: 1, hospital: 'Metro Hospital', points: 100 }
        ],
        preferences: {
          language: 'English',
          theme: 'dark',
          fontSize: 'medium',
          notifications: { email: true, sms: true, push: true, appointments: true, medications: true, reports: false },
          privacy: { showProfile: true, showMedicalHistory: false, showDonations: true }
        },
        security: {
          twoFactorEnabled: false,
          lastPasswordChange: '2024-12-01',
          loginHistory: [
            { date: '2025-01-16T10:30:00', ip: '192.168.1.1', device: 'Chrome - Windows', location: 'New York, USA' },
            { date: '2025-01-15T14:20:00', ip: '192.168.1.1', device: 'Mobile App - Android', location: 'New York, USA' }
          ],
          connectedDevices: [
            { id: 'd1', name: 'Chrome Browser', type: 'Desktop', lastActive: '2025-01-16', isCurrent: true },
            { id: 'd2', name: 'iPhone 15', type: 'Mobile', lastActive: '2025-01-15', isCurrent: false }
          ]
        },
        accountType: 'Client',
        memberSince: '2020-01-01',
        lastLogin: '2025-01-16T10:30:00',
        isVerified: true,
        isOnline: true,
        totalVisits: 24,
        totalSpent: 2850
      };
      setProfile(mockProfile);
      setIsLoading(false);
    }, 1000);
  };

  const handleLogout = () => {
    localStorage.removeItem('medicare_user');
    localStorage.removeItem('medicare_refresh_token');
    window.location.href = '/login';
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">
      {/* COVER & PROFILE HEADER */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-cyan-600 via-blue-600 to-emerald-500 relative">
          {profile.coverImage && (
            <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
          )}
        </div>

        {/* Profile Info Overlay */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative -mt-20 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Image */}
              <div className="relative">
                {profile.profileImage ? (
                  <img src={profile.profileImage} alt="Profile" className="w-32 h-32 rounded-full border-4 border-slate-800 shadow-xl object-cover" />
                ) : (
                  <div className="w-32 h-32 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full border-4 border-slate-800 shadow-xl flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-slate-800" />
              </div>

              {/* Name & Info */}
              <div className="flex-1">
                <div className="flex items-center flex-wrap gap-3">
                  <h1 className="text-3xl font-bold text-white">
                    {`${profile.firstName} ${profile.lastName}`}
                  </h1>
                  {profile.isVerified && <CheckCircle className="w-6 h-6 text-cyan-500" />}
                  <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full border border-cyan-500/30">
                    {profile.accountType}
                  </span>
                </div>
                <p className="text-slate-400 mt-1">{profile.bio}</p>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-400">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.address.city}, {profile.address.state}</span>
                  <span className="flex items-center gap-1"><Droplet className="w-4 h-4 text-red-400" /> {profile.bloodGroup}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Member since {profile.memberSince}</span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> Last login: {new Date(profile.lastLogin).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button onClick={() => setIsEditing(!isEditing)} className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all">
                  {isEditing ? 'Cancel' : 'Edit Profile'}
                </button>
                <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all flex items-center gap-2">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT SIDEBAR */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="font-semibold text-white mb-4">Quick Overview</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-700/50"><span className="text-slate-400 text-sm">Total Visits</span><span className="text-white font-medium">{profile.totalVisits}</span></div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-700/50"><span className="text-slate-400 text-sm">Total Spent</span><span className="text-white font-medium">${profile.totalSpent}</span></div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-700/50"><span className="text-slate-400 text-sm">Blood Group</span><span className="text-white font-medium">{profile.bloodGroup}</span></div>
                <div className="flex justify-between items-center p-2 rounded-lg bg-slate-700/50"><span className="text-slate-400 text-sm">BMI</span><span className="text-white font-medium">{profile.vitals.bmi} ({profile.vitals.bmi < 25 ? 'Normal' : 'High'})</span></div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { icon: Calendar, label: 'Book Appointment', path: '/client/appointments', color: 'cyan' },
                  { icon: Droplet, label: 'Blood Donation', path: '/client/blood-donation', color: 'red' },
                  { icon: FileText, label: 'Medical Reports', path: '/client/reports', color: 'blue' },
                  { icon: Pill, label: 'Prescriptions', path: '/client/prescriptions', color: 'green' },
                  { icon: Search, label: 'Find Doctors', path: '/client/doctor-comparison', color: 'purple' },
                  { icon: AlertTriangle, label: 'Emergency', path: '/client/emergency', color: 'red' }
                ].map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <button key={idx} onClick={() => window.location.href = action.path} className={`w-full flex items-center gap-3 p-3 bg-slate-700/30 rounded-lg hover:bg-${action.color}-500/20 transition-all text-left text-slate-300 hover:text-white`}>
                      <Icon className={`w-5 h-5 text-${action.color}-400`} />
                      <span className="text-sm">{action.label}</span>
                      <ChevronRight className="w-4 h-4 ml-auto" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Theme Toggle */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon className="w-5 h-5 text-cyan-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                  <span className="text-white">Dark Mode</span>
                </div>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className={`w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-cyan-600' : 'bg-slate-600'}`}>
                  <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
              <div className="border-b border-slate-700">
                <nav className="flex overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Overview', icon: User },
                    { id: 'medical', label: 'Medical History', icon: Heart },
                    { id: 'appointments', label: 'Appointments', icon: Calendar },
                    { id: 'records', label: 'Health Records', icon: FileText },
                    { id: 'settings', label: 'Settings', icon: Settings }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button key={tab.id} onClick={() => setActiveSection(tab.id as typeof activeSection)} className={`flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${activeSection === tab.id ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}>
                        <Icon className="w-4 h-4" /> {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* Vitals */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <h2 className="text-xl font-semibold text-white mb-6">Vitals & Health Metrics</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: Heart, label: 'Blood Pressure', value: profile.vitals.bloodPressure, color: 'red' },
                      { icon: Activity, label: 'Heart Rate', value: `${profile.vitals.heartRate} bpm`, color: 'green' },
                      { icon: Weight, label: 'Weight', value: `${profile.vitals.weight} kg`, color: 'blue' },
                      { icon: Thermometer, label: 'Temperature', value: `${profile.vitals.temperature}°F`, color: 'orange' },
                      { icon: Droplet, label: 'Blood Sugar', value: `${profile.vitals.bloodSugar} mg/dL`, color: 'pink' },
                      { icon: Activity, label: 'SpO2', value: `${profile.vitals.oxygenSaturation}%`, color: 'teal' }
                    ].map((v, idx) => {
                      const Icon = v.icon;
                      return (
                        <div key={idx} className={`p-4 bg-slate-700/30 rounded-xl text-center border border-slate-600`}>
                          <Icon className={`w-6 h-6 mx-auto mb-2 text-${v.color}-400`} />
                          <p className="text-lg font-bold text-white">{v.value}</p>
                          <p className="text-xs text-slate-400">{v.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Lifestyle */}
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Lifestyle</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Smoking', value: profile.lifestyle.smoking ? 'Yes' : 'No' },
                      { label: 'Alcohol', value: profile.lifestyle.alcohol ? 'Yes' : 'No' },
                      { label: 'Exercise', value: profile.lifestyle.exercise },
                      { label: 'Diet', value: profile.lifestyle.diet }
                    ].map((l, idx) => (
                      <div key={idx} className="p-4 bg-slate-700/30 rounded-xl text-center border border-slate-600">
                        <p className="text-lg font-bold text-white capitalize">{l.value}</p>
                        <p className="text-xs text-slate-400">{l.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Medical History Section */}
            {activeSection === 'medical' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Medical Conditions</h2>
                  {profile.medicalHistory.conditions.map((condition) => (
                    <div key={condition.id} className="border border-slate-700 rounded-lg p-4 mb-3 bg-slate-700/30">
                      <div className="flex justify-between">
                        <p className="font-medium text-white">{condition.name}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${condition.status === 'active' ? 'bg-red-500/20 text-red-400' : condition.status === 'managed' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>{condition.status}</span>
                      </div>
                      <p className="text-sm text-slate-400">Diagnosed: {condition.diagnosedDate}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Allergies</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.medicalHistory.allergies.map((allergy) => (
                      <span key={allergy} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm border border-red-500/30">{allergy}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Appointments Section */}
            {activeSection === 'appointments' && (
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Your Appointments</h2>
                {profile.appointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between border border-slate-700 rounded-lg p-4 mb-3 bg-slate-700/30">
                    <div className="flex items-center gap-4">
                      <Calendar className="w-10 h-10 text-cyan-400" />
                      <div>
                        <p className="font-medium text-white">{apt.doctorName}</p>
                        <p className="text-sm text-slate-400">{apt.type}</p>
                        <p className="text-sm text-slate-500">{apt.date}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${apt.status === 'upcoming' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-green-500/20 text-green-400'}`}>{apt.status}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Settings Section */}
            {activeSection === 'settings' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Notifications</h2>
                  <div className="space-y-3">
                    {Object.entries(profile.preferences.notifications).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2">
                        <span className="text-slate-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <input type="checkbox" checked={value as boolean} className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-cyan-500 focus:ring-cyan-500" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Security</h2>
                  <button className="w-full bg-cyan-600 text-white py-2 rounded-lg hover:bg-cyan-700 transition-all">Change Password</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {activeModal === 'success' && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-pulse">✅ Profile updated successfully!</div>
      )}
    </div>
  );
};

export default ClientProfile;