// src/pages/client/ClientProfile.tsx
// COMPLETE CLIENT PROFILE WITH ALL FEATURES

import React, { useState, useEffect } from 'react';
import {
  User, Phone, Mail, MapPin, Heart, Activity,
  Calendar, FileText, AlertTriangle, Edit3,
  Droplet, Weight, Ruler, Thermometer, Camera,
  Save, X, Plus, Trash2, ChevronRight, Shield,
  Clock, Star, Building2, Stethoscope, Pill,
  Syringe, Download, Upload, CheckCircle, Lock,
  Bell, Settings, LogOut, Moon, Sun, Globe,
  CreditCard, Gift, TrendingUp, TrendingDown,
  Zap, Award, BookOpen, MessageCircle, Video,
  Search, Filter, MoreVertical, Eye, RefreshCw,
  Smartphone, Wifi, Bluetooth, Battery
} from 'lucide-react';

// Types
interface ClientProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  age: number;
  bloodGroup: string;
  gender: 'male' | 'female' | 'other';
  profileImage: string;
  coverImage: string;
  bio: string;
  
  address: Address;
  emergencyContact: EmergencyContact;
  medicalHistory: MedicalHistory;
  lifestyle: Lifestyle;
  vitals: Vitals;
  currentMedications: Medication[];
  vaccinations: Vaccination[];
  appointments: AppointmentSummary[];
  prescriptions: PrescriptionSummary[];
  reports: ReportSummary[];
  bloodDonations: BloodDonationSummary[];
  
  preferences: UserPreferences;
  security: SecuritySettings;
  
  accountType: string;
  memberSince: string;
  lastLogin: string;
  isVerified: boolean;
  isOnline: boolean;
  totalVisits: number;
  totalSpent: number;
}

interface Address {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email: string;
}

interface MedicalHistory {
  conditions: MedicalCondition[];
  surgeries: Surgery[];
  allergies: string[];
  familyHistory: string[];
}

interface MedicalCondition {
  id: string;
  name: string;
  diagnosedDate: string;
  status: 'active' | 'resolved' | 'managed';
  notes: string;
}

interface Surgery {
  id: string;
  name: string;
  date: string;
  hospital: string;
  notes: string;
}

interface Lifestyle {
  smoking: boolean;
  alcohol: boolean;
  exercise: 'none' | 'light' | 'moderate' | 'heavy';
  diet: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'other';
}

interface Vitals {
  height: number;
  weight: number;
  bloodPressure: string;
  bloodSugar: string;
  heartRate: number;
  temperature: number;
  oxygenSaturation: number;
  bmi: number;
  lastUpdated: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  prescribedBy: string;
  isActive: boolean;
}

interface Vaccination {
  id: string;
  name: string;
  date: string;
  dose: string;
  nextDueDate: string;
  certificateUrl: string;
}

interface AppointmentSummary {
  id: string;
  date: string;
  doctorName: string;
  type: string;
  status: string;
}

interface PrescriptionSummary {
  id: string;
  date: string;
  doctorName: string;
  medicine: string;
  status: string;
}

interface ReportSummary {
  id: string;
  date: string;
  type: string;
  result: string;
  status: string;
}

interface BloodDonationSummary {
  id: string;
  date: string;
  units: number;
  hospital: string;
  points: number;
}

interface UserPreferences {
  language: string;
  theme: 'light' | 'dark';
  fontSize: 'small' | 'medium' | 'large';
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
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  lastPasswordChange: string;
  loginHistory: LoginRecord[];
  connectedDevices: Device[];
}

interface LoginRecord {
  date: string;
  ip: string;
  device: string;
  location: string;
}

interface Device {
  id: string;
  name: string;
  type: string;
  lastActive: string;
  isCurrent: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const ClientProfile: React.FC = () => {
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<ClientProfile | null>(null);
  const [activeSection, setActiveSection] = useState<'overview' | 'medical' | 'appointments' | 'records' | 'settings'>('overview');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockProfile: ClientProfile = {
        id: 'user-123',
        firstName: 'John',
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
        
        address: {
          street: '123 Health Street',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'USA'
        },
        
        emergencyContact: {
          name: 'Jane Doe',
          relationship: 'Spouse',
          phone: '+1 (555) 987-6543',
          email: 'jane.doe@email.com'
        },
        
        medicalHistory: {
          conditions: [
            { id: 'c1', name: 'Hypertension', diagnosedDate: '2020-01-15', status: 'managed', notes: 'Controlled with medication' }
          ],
          surgeries: [
            { id: 's1', name: 'Appendectomy', date: '2018-06-20', hospital: 'City General Hospital', notes: 'Successful' }
          ],
          allergies: ['Penicillin', 'Peanuts', 'Dust'],
          familyHistory: ['Diabetes - Father', 'Heart Disease - Mother']
        },
        
        lifestyle: {
          smoking: false,
          alcohol: false,
          exercise: 'moderate',
          diet: 'non-vegetarian'
        },
        
        vitals: {
          height: 175,
          weight: 70,
          bloodPressure: '120/80',
          bloodSugar: '95',
          heartRate: 72,
          temperature: 98.6,
          oxygenSaturation: 98,
          bmi: 22.9,
          lastUpdated: '2025-01-15'
        },
        
        currentMedications: [
          { id: 'm1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily', startDate: '2020-01-20', endDate: '', prescribedBy: 'Dr. Sarah Wilson', isActive: true }
        ],
        
        vaccinations: [
          { id: 'v1', name: 'COVID-19 Vaccine', date: '2021-03-15', dose: '2nd Dose', nextDueDate: '2025-09-15', certificateUrl: '#' },
          { id: 'v2', name: 'Flu Vaccine', date: '2024-10-01', dose: 'Annual', nextDueDate: '2025-10-01', certificateUrl: '#' }
        ],
        
        appointments: [
          { id: 'a1', date: '2025-01-20', doctorName: 'Dr. Sarah Wilson', type: 'Cardiology', status: 'upcoming' },
          { id: 'a2', date: '2025-01-15', doctorName: 'Dr. James Brown', type: 'Dermatology', status: 'completed' }
        ],
        
        prescriptions: [
          { id: 'p1', date: '2025-01-15', doctorName: 'Dr. Sarah Wilson', medicine: 'Lisinopril 10mg', status: 'active' }
        ],
        
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
          theme: 'light',
          fontSize: 'medium',
          notifications: {
            email: true,
            sms: true,
            push: true,
            appointments: true,
            medications: true,
            reports: false
          },
          privacy: {
            showProfile: true,
            showMedicalHistory: false,
            showDonations: true
          }
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
      setEditedProfile(mockProfile);
      setIsLoading(false);
    }, 1000);
  };

  const handleSave = () => {
    if (editedProfile) {
      setProfile(editedProfile);
      setIsEditing(false);
      alert('✅ Profile updated successfully!');
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editedProfile) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setEditedProfile({
          ...editedProfile,
          profileImage: event.target?.result as string
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* COVER & PROFILE HEADER */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 relative">
          {profile.coverImage && (
            <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
          )}
          {isEditing && (
            <button className="absolute bottom-4 right-4 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg hover:bg-white/30 text-white text-sm">
              <Camera className="w-4 h-4 inline mr-2" />
              Change Cover
            </button>
          )}
        </div>

        {/* Profile Info Overlay */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="relative -mt-20 mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-end space-y-4 md:space-y-0 md:space-x-6">
              {/* Profile Image */}
              <div className="relative">
                {profile.profileImage ? (
                  <img
                    src={profile.profileImage}
                    alt="Profile"
                    className="w-32 h-32 rounded-full border-4 border-white shadow-xl object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 bg-blue-600 rounded-full border-4 border-white shadow-xl flex items-center justify-center">
                    <User className="w-16 h-16 text-white" />
                  </div>
                )}
                {isEditing && (
                  <label className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 cursor-pointer hover:bg-blue-600 shadow-lg">
                    <Camera className="w-5 h-5 text-white" />
                    <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
                  </label>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" 
                  title={profile.isOnline ? 'Online' : 'Offline'} 
                />
              </div>

              {/* Name & Info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-gray-900">
                    {isEditing ? (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={editedProfile?.firstName || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile!, firstName: e.target.value })}
                          className="border rounded-lg px-3 py-1 text-lg w-40"
                        />
                        <input
                          type="text"
                          value={editedProfile?.lastName || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile!, lastName: e.target.value })}
                          className="border rounded-lg px-3 py-1 text-lg w-40"
                        />
                      </div>
                    ) : (
                      `${profile.firstName} ${profile.lastName}`
                    )}
                  </h1>
                  {profile.isVerified && (
                    <CheckCircle className="w-6 h-6 text-blue-500" />
                  )}
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {profile.accountType}
                  </span>
                </div>
                
                <p className="text-gray-600 mt-1">{profile.bio}</p>
                
                <div className="flex flex-wrap items-center gap-3 mt-3 text-sm text-gray-500">
                  <span className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {profile.address.city}, {profile.address.state}
                  </span>
                  <span className="flex items-center">
                    <Droplet className="w-4 h-4 mr-1 text-red-500" />
                    {profile.bloodGroup}
                  </span>
                  <span className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Member since {profile.memberSince}
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    Last login: {new Date(profile.lastLogin).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                {isEditing ? (
                  <>
                    <button onClick={handleCancel} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                      Cancel
                    </button>
                    <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                      Save Changes
                    </button>
                  </>
                ) : (
                  <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Edit Profile
                  </button>
                )}
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
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold mb-4">Quick Overview</h3>
              <div className="space-y-4">
                <QuickInfo icon={<Calendar />} label="Total Visits" value={profile.totalVisits.toString()} />
                <QuickInfo icon={<CreditCard />} label="Total Spent" value={`$${profile.totalSpent}`} />
                <QuickInfo icon={<Heart />} label="Blood Group" value={profile.bloodGroup} />
                <QuickInfo icon={<Activity />} label="BMI" value={`${profile.vitals.bmi} (${profile.vitals.bmi < 25 ? 'Normal' : 'High'})`} />
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                Emergency Contact
              </h3>
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editedProfile?.emergencyContact.name || ''}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile!,
                      emergencyContact: { ...editedProfile!.emergencyContact, name: e.target.value }
                    })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="Contact Name"
                  />
                  <input
                    type="text"
                    value={editedProfile?.emergencyContact.phone || ''}
                    onChange={(e) => setEditedProfile({
                      ...editedProfile!,
                      emergencyContact: { ...editedProfile!.emergencyContact, phone: e.target.value }
                    })}
                    className="w-full border rounded-lg px-3 py-2 text-sm"
                    placeholder="Phone"
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="font-medium">{profile.emergencyContact.name}</p>
                  <p className="text-sm text-gray-600">{profile.emergencyContact.relationship}</p>
                  <p className="text-sm text-gray-600">{profile.emergencyContact.phone}</p>
                  <button className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700">
                    🚨 Emergency Call
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <QuickActionBtn icon={<Calendar />} label="Book Appointment" onClick={() => navigateTo('/client/appointments')} />
                <QuickActionBtn icon={<Droplet />} label="Blood Donation" onClick={() => navigateTo('/client/blood-donation')} />
                <QuickActionBtn icon={<FileText />} label="Medical Reports" onClick={() => navigateTo('/client/reports')} />
                <QuickActionBtn icon={<Pill />} label="Prescriptions" onClick={() => navigateTo('/client/prescriptions')} />
                <QuickActionBtn icon={<Syringe />} label="Vaccine Records" onClick={() => navigateTo('/client/vaccines')} />
                <QuickActionBtn icon={<Search />} label="Find Doctors" onClick={() => navigateTo('/client/doctor-comparison')} />
                <QuickActionBtn icon={<MapPin />} label="Nearby Donors" onClick={() => navigateTo('/client/nearby-donors')} />
                <QuickActionBtn icon={<AlertTriangle />} label="Emergency" onClick={() => navigateTo('/client/emergency')} />
              </div>
            </div>

            {/* Connected Devices */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <Smartphone className="w-5 h-5 mr-2" />
                Connected Devices
              </h3>
              <div className="space-y-3">
                {profile.security.connectedDevices.map((device) => (
                  <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      {device.type === 'Desktop' ? (
                        <Monitor className="w-5 h-5 text-blue-500" />
                      ) : (
                        <Smartphone className="w-5 h-5 text-green-500" />
                      )}
                      <div>
                        <p className="text-sm font-medium">{device.name}</p>
                        <p className="text-xs text-gray-500">Last active: {device.lastActive}</p>
                      </div>
                    </div>
                    {device.isCurrent && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Current</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT AREA */}
          <div className="lg:col-span-2 space-y-6">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b">
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
                      <button
                        key={tab.id}
                        onClick={() => setActiveSection(tab.id as any)}
                        className={`flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                          activeSection === tab.id
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>

            {/* OVERVIEW SECTION */}
            {activeSection === 'overview' && (
              <div className="space-y-6">
                {/* Vitals */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-6">Vitals & Health Metrics</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <VitalCard icon={<Heart />} label="Blood Pressure" value={profile.vitals.bloodPressure} color="red" />
                    <VitalCard icon={<Activity />} label="Heart Rate" value={`${profile.vitals.heartRate} bpm`} color="green" />
                    <VitalCard icon={<Weight />} label="Weight" value={`${profile.vitals.weight} kg`} color="blue" />
                    <VitalCard icon={<Ruler />} label="Height" value={`${profile.vitals.height} cm`} color="purple" />
                    <VitalCard icon={<Thermometer />} label="Temperature" value={`${profile.vitals.temperature}°F`} color="orange" />
                    <VitalCard icon={<Droplet />} label="Blood Sugar" value={`${profile.vitals.bloodSugar} mg/dL`} color="pink" />
                    <VitalCard icon={<Activity />} label="SpO2" value={`${profile.vitals.oxygenSaturation}%`} color="teal" />
                    <VitalCard icon={<Weight />} label="BMI" value={profile.vitals.bmi.toString()} color="indigo" />
                  </div>
                </div>

                {/* Lifestyle */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Lifestyle</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <LifestyleCard label="Smoking" value={profile.lifestyle.smoking ? 'Yes' : 'No'} />
                    <LifestyleCard label="Alcohol" value={profile.lifestyle.alcohol ? 'Yes' : 'No'} />
                    <LifestyleCard label="Exercise" value={profile.lifestyle.exercise} />
                    <LifestyleCard label="Diet" value={profile.lifestyle.diet} />
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
                  <div className="space-y-3">
                    <ActivityItem
                      icon={<Calendar className="w-5 h-5 text-blue-500" />}
                      title="Upcoming Appointment"
                      description="Dr. Sarah Wilson - Jan 20, 2025"
                      time="In 4 days"
                    />
                    <ActivityItem
                      icon={<Pill className="w-5 h-5 text-green-500" />}
                      title="Medication Reminder"
                      description="Lisinopril 10mg - Take at 8:00 AM"
                      time="Today"
                    />
                    <ActivityItem
                      icon={<FileText className="w-5 h-5 text-purple-500" />}
                      title="Report Available"
                      description="Blood Test Results - Normal"
                      time="2 days ago"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* MEDICAL HISTORY SECTION */}
            {activeSection === 'medical' && (
              <div className="space-y-6">
                {/* Conditions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Medical Conditions</h2>
                    {isEditing && (
                      <button className="text-blue-600 text-sm flex items-center">
                        <Plus className="w-4 h-4 mr-1" /> Add
                      </button>
                    )}
                  </div>
                  {profile.medicalHistory.conditions.map((condition) => (
                    <div key={condition.id} className="border rounded-lg p-4 mb-3">
                      <div className="flex justify-between">
                        <p className="font-medium">{condition.name}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          condition.status === 'active' ? 'bg-red-100 text-red-700' :
                          condition.status === 'managed' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {condition.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">Diagnosed: {condition.diagnosedDate}</p>
                      <p className="text-sm text-gray-500">{condition.notes}</p>
                    </div>
                  ))}
                </div>

                {/* Allergies */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Allergies</h2>
                  <div className="flex flex-wrap gap-2">
                    {profile.medicalHistory.allergies.map((allergy) => (
                      <span key={allergy} className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Vaccinations */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Vaccination Records</h2>
                  <div className="space-y-3">
                    {profile.vaccinations.map((vaccine) => (
                      <div key={vaccine.id} className="flex items-center justify-between border rounded-lg p-4">
                        <div className="flex items-center space-x-4">
                          <Syringe className="w-8 h-8 text-green-500" />
                          <div>
                            <p className="font-medium">{vaccine.name}</p>
                            <p className="text-sm text-gray-600">{vaccine.dose} • {vaccine.date}</p>
                          </div>
                        </div>
                        <button className="text-blue-600 text-sm hover:text-blue-700">
                          View Certificate
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* APPOINTMENTS SECTION */}
            {activeSection === 'appointments' && (
              <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Your Appointments</h2>
                    <button 
                      onClick={() => navigateTo('/client/appointments')}
                      className="text-blue-600 text-sm hover:text-blue-700"
                    >
                      View All
                    </button>
                  </div>
                  {profile.appointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between border rounded-lg p-4 mb-3">
                      <div className="flex items-center space-x-4">
                        <Calendar className="w-10 h-10 text-blue-500" />
                        <div>
                          <p className="font-medium">{apt.doctorName}</p>
                          <p className="text-sm text-gray-600">{apt.type}</p>
                          <p className="text-sm text-gray-500">{apt.date}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        apt.status === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* HEALTH RECORDS SECTION */}
            {activeSection === 'records' && (
              <div className="space-y-6">
                {/* Reports */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Medical Reports</h2>
                    <button 
                      onClick={() => navigateTo('/client/reports')}
                      className="text-blue-600 text-sm hover:text-blue-700"
                    >
                      View All
                    </button>
                  </div>
                  {profile.reports.map((report) => (
                    <div key={report.id} className="flex items-center justify-between border rounded-lg p-4 mb-3">
                      <div className="flex items-center space-x-4">
                        <FileText className="w-10 h-10 text-purple-500" />
                        <div>
                          <p className="font-medium">{report.type}</p>
                          <p className="text-sm text-gray-600">Result: {report.result}</p>
                          <p className="text-sm text-gray-500">{report.date}</p>
                        </div>
                      </div>
                      <button className="text-blue-600 text-sm">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Prescriptions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Prescriptions</h2>
                    <button 
                      onClick={() => navigateTo('/client/prescriptions')}
                      className="text-blue-600 text-sm hover:text-blue-700"
                    >
                      View All
                    </button>
                  </div>
                  {profile.prescriptions.map((pres) => (
                    <div key={pres.id} className="flex items-center justify-between border rounded-lg p-4 mb-3">
                      <div className="flex items-center space-x-4">
                        <Pill className="w-10 h-10 text-green-500" />
                        <div>
                          <p className="font-medium">{pres.medicine}</p>
                          <p className="text-sm text-gray-600">Dr. {pres.doctorName}</p>
                          <p className="text-sm text-gray-500">{pres.date}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                        {pres.status}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Blood Donations */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Blood Donations</h2>
                    <button 
                      onClick={() => navigateTo('/client/blood-donation')}
                      className="text-blue-600 text-sm hover:text-blue-700"
                    >
                      View All
                    </button>
                  </div>
                  {profile.bloodDonations.map((donation) => (
                    <div key={donation.id} className="flex items-center justify-between border rounded-lg p-4 mb-3">
                      <div className="flex items-center space-x-4">
                        <Droplet className="w-10 h-10 text-red-500" />
                        <div>
                          <p className="font-medium">{donation.hospital}</p>
                          <p className="text-sm text-gray-600">{donation.units} unit(s)</p>
                          <p className="text-sm text-gray-500">{donation.date}</p>
                        </div>
                      </div>
                      <span className="text-green-600 font-medium">+{donation.points} pts</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SETTINGS SECTION */}
            {activeSection === 'settings' && (
              <div className="space-y-6">
                {/* Preferences */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Preferences</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Dark Mode</span>
                      <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`w-12 h-6 rounded-full transition-colors ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full transform transition-transform ${isDarkMode ? 'translate-x-6' : 'translate-x-1'}`} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Email Notifications</span>
                      <input type="checkbox" checked={profile.preferences.notifications.email} className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>SMS Notifications</span>
                      <input type="checkbox" checked={profile.preferences.notifications.sms} className="w-5 h-5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Appointment Reminders</span>
                      <input type="checkbox" checked={profile.preferences.notifications.appointments} className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Security</h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Two-Factor Authentication</span>
                      <button className={`px-3 py-1 rounded text-sm ${profile.security.twoFactorEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {profile.security.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Last Password Change</span>
                      <span className="text-sm text-gray-600">{profile.security.lastPasswordChange}</span>
                    </div>
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                      Change Password
                    </button>
                  </div>
                </div>

                {/* Login History */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold mb-4">Login History</h2>
                  {profile.security.loginHistory.map((login, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div>
                        <p className="text-sm font-medium">{login.device}</p>
                        <p className="text-xs text-gray-500">{login.location} • IP: {login.ip}</p>
                      </div>
                      <span className="text-xs text-gray-500">{new Date(login.date).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

const QuickInfo: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center justify-between">
    <div className="flex items-center space-x-2 text-gray-600">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <span className="font-medium">{value}</span>
  </div>
);

const QuickActionBtn: React.FC<{ icon: React.ReactNode; label: string; onClick: () => void }> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
  >
    <div className="w-5 h-5 mr-3">{icon}</div>
    <span className="text-sm">{label}</span>
    <ChevronRight className="w-4 h-4 ml-auto" />
  </button>
);

const VitalCard: React.FC<{ icon: React.ReactNode; label: string; value: string; color: string }> = ({ icon, label, value, color }) => (
  <div className={`p-4 bg-${color}-50 rounded-xl text-center`}>
    <div className="flex justify-center mb-2">{icon}</div>
    <p className="text-lg font-bold">{value}</p>
    <p className="text-xs text-gray-600">{label}</p>
  </div>
);

const LifestyleCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="p-4 bg-gray-50 rounded-xl text-center">
    <p className="text-lg font-bold capitalize">{value}</p>
    <p className="text-xs text-gray-600">{label}</p>
  </div>
);

const ActivityItem: React.FC<{ icon: React.ReactNode; title: string; description: string; time: string }> = ({ icon, title, description, time }) => (
  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
    {icon}
    <div className="flex-1">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-gray-600">{description}</p>
    </div>
    <span className="text-xs text-gray-500">{time}</span>
  </div>
);

// Monitor icon (not in lucide-react, using a simple SVG)
const Monitor: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

export default ClientProfile;