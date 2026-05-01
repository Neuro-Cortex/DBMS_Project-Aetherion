// src/pages/MedicalRecords.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Calendar, Phone, Mail, MapPin, Heart, 
  Droplet, AlertCircle, FileText, Activity, 
  Pill, Syringe, Microscope, Stethoscope,
  Download, Share2, Printer, Lock, Shield,
  Clock, TrendingUp, Award, CheckCircle,
  ChevronRight, Plus, Search, Filter
} from 'lucide-react';
import { PatientProfile } from '../components/patient/PatientProfile';
import { MedicalHistory } from '../components/patient/MedicalHistory';
import { MedicineTracker } from '../components/patient/MedicineTracker';
import { GlassmorphicCard } from '../components/ui/GlassmorphicCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Tabs } from '../components/ui/Tabs';

// ============================================
// TYPES
// ============================================

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  emergencyContacts: Array<{ name: string; phone: string; relation: string }>;
  allergies: string[];
  conditions: string[];
  avatar?: string;
  height?: number;
  weight?: number;
  lastVisit?: string;
  insuranceProvider?: string;
  insuranceNumber?: string;
}

interface VitalStat {
  date: string;
  bloodPressure: string;
  heartRate: number;
  temperature: number;
  oxygenLevel: number;
}

interface UpcomingAppointment {
  id: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  location: string;
}

// ============================================
// MOCK DATA
// ============================================

const patientData: Patient = {
  id: '1',
  name: 'John Doe',
  age: 35,
  gender: 'Male',
  bloodGroup: 'O+',
  phone: '+1 (555) 123-4567',
  email: 'john.doe@example.com',
  address: '123 Main Street, New York, NY 10001',
  emergencyContacts: [
    { name: 'Jane Doe', phone: '+1 (555) 000-1234', relation: 'Spouse' },
    { name: 'Bob Smith', phone: '+1 (555) 000-5678', relation: 'Brother' },
  ],
  allergies: ['Penicillin', 'Pollen', 'Dust Mites'],
  conditions: ['Hypertension', 'Type 2 Diabetes'],
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
  height: 175,
  weight: 78,
  lastVisit: '2024-03-10',
  insuranceProvider: 'Blue Cross Blue Shield',
  insuranceNumber: 'BCBS-123456789',
};

const vitalStats: VitalStat[] = [
  { date: '2024-03-10', bloodPressure: '120/80', heartRate: 72, temperature: 98.6, oxygenLevel: 98 },
  { date: '2024-02-15', bloodPressure: '118/78', heartRate: 70, temperature: 98.4, oxygenLevel: 97 },
  { date: '2024-01-20', bloodPressure: '122/82', heartRate: 75, temperature: 98.7, oxygenLevel: 98 },
  { date: '2023-12-10', bloodPressure: '125/85', heartRate: 78, temperature: 98.8, oxygenLevel: 97 },
];

const upcomingAppointments: UpcomingAppointment[] = [
  { id: '1', doctorName: 'Dr. Sarah Wilson', specialty: 'Cardiology', date: '2024-03-20', time: '10:00 AM', location: 'City Hospital, Room 304' },
  { id: '2', doctorName: 'Dr. Michael Lee', specialty: 'Endocrinology', date: '2024-03-25', time: '02:30 PM', location: 'Metro Medical Center, Floor 5' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const MedicalRecords: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'history', label: 'Medical History', icon: FileText },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
  ];

  // Get blood group color
  const getBloodGroupColor = (group: string) => {
    const colors: Record<string, string> = {
      'A+': 'from-green-500 to-emerald-500',
      'A-': 'from-green-600 to-emerald-600',
      'B+': 'from-blue-500 to-cyan-500',
      'B-': 'from-blue-600 to-cyan-600',
      'AB+': 'from-purple-500 to-pink-500',
      'AB-': 'from-purple-600 to-pink-600',
      'O+': 'from-red-500 to-rose-500',
      'O-': 'from-red-600 to-rose-600',
    };
    return colors[group] || 'from-gray-500 to-gray-600';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Medical Records
            </h1>
            <p className="text-white/60">View and manage your complete health history</p>
          </div>
          <div className="flex gap-3">
            <Button variant="glass" size="sm" icon={Download}>
              Download Records
            </Button>
            <Button variant="glass" size="sm" icon={Share2}>
              Share
            </Button>
            <Button variant="glass" size="sm" icon={Printer}>
              Print
            </Button>
          </div>
        </div>

        {/* Patient Profile */}
        <PatientProfile patient={patientData} />

        {/* Health Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Blood Group', value: patientData.bloodGroup, icon: Droplet, color: getBloodGroupColor(patientData.bloodGroup) },
            { label: 'Age', value: `${patientData.age} years`, icon: Calendar, color: 'from-cyan-500 to-blue-500' },
            { label: 'Height/Weight', value: `${patientData.height}cm / ${patientData.weight}kg`, icon: Activity, color: 'from-green-500 to-emerald-500' },
            { label: 'Last Visit', value: new Date(patientData.lastVisit || '').toLocaleDateString(), icon: Clock, color: 'from-purple-500 to-pink-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
              <div className={`w-10 h-10 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-lg font-bold text-white">{stat.value}</div>
              <div className="text-white/60 text-xs">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Vital Signs */}
        <GlassmorphicCard variant="glass" className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" />
            Vital Signs History
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 text-white/60 text-sm">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Blood Pressure</th>
                  <th className="p-3 text-left">Heart Rate</th>
                  <th className="p-3 text-left">Temperature</th>
                  <th className="p-3 text-left">Oxygen Level</th>
                </tr>
              </thead>
              <tbody>
                {vitalStats.map((vital, i) => (
                  <motion.tr
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="border-b border-white/5 hover:bg-white/5 transition"
                  >
                    <td className="p-3 text-white">{new Date(vital.date).toLocaleDateString()}</td>
                    <td className="p-3 text-white/80">{vital.bloodPressure}</td>
                    <td className="p-3 text-white/80">{vital.heartRate} bpm</td>
                    <td className="p-3 text-white/80">{vital.temperature}°F</td>
                    <td className="p-3 text-white/80">{vital.oxygenLevel}%</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassmorphicCard>

        {/* Tabs Navigation */}
        <div className="flex gap-2 p-1 bg-white/10 rounded-xl w-fit">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6"
            >
              {/* Conditions & Allergies */}
              <GlassmorphicCard variant="glass" className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  Chronic Conditions
                </h3>
                <div className="space-y-2">
                  {patientData.conditions.map((condition, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-orange-400" />
                      <span className="text-white">{condition}</span>
                    </div>
                  ))}
                </div>
                
                <h3 className="text-lg font-semibold text-white mt-6 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                  Allergies
                </h3>
                <div className="space-y-2">
                  {patientData.allergies.map((allergy, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 bg-white/5 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-red-400" />
                      <span className="text-white">{allergy}</span>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>

              {/* Insurance & Emergency Contacts */}
              <div className="space-y-6">
                <GlassmorphicCard variant="glass" className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-400" />
                    Insurance Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                      <span className="text-white/60">Provider:</span>
                      <span className="text-white">{patientData.insuranceProvider}</span>
                    </div>
                    <div className="flex justify-between p-2 bg-white/5 rounded-lg">
                      <span className="text-white/60">Policy Number:</span>
                      <span className="text-white">{patientData.insuranceNumber}</span>
                    </div>
                  </div>
                </GlassmorphicCard>

                <GlassmorphicCard variant="glass" className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-green-400" />
                    Emergency Contacts
                  </h3>
                  <div className="space-y-3">
                    {patientData.emergencyContacts.map((contact, i) => (
                      <div key={i} className="p-3 bg-white/5 rounded-lg">
                        <p className="text-white font-medium">{contact.name}</p>
                        <p className="text-white/60 text-sm">{contact.relation}</p>
                        <p className="text-cyan-400 text-sm">{contact.phone}</p>
                      </div>
                    ))}
                  </div>
                </GlassmorphicCard>
              </div>
            </motion.div>
          )}

          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MedicalHistory />
            </motion.div>
          )}

          {activeTab === 'medications' && (
            <motion.div
              key="medications"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MedicineTracker />
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div
              key="appointments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <GlassmorphicCard variant="glass" className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Upcoming Appointments</h3>
                <div className="space-y-3">
                  {upcomingAppointments.map((apt, i) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white font-medium">{apt.doctorName}</p>
                        <p className="text-white/60 text-sm">{apt.specialty}</p>
                        <p className="text-white/40 text-xs mt-1">{apt.location}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-cyan-400 font-medium">{apt.date}</p>
                        <p className="text-white/60 text-sm">{apt.time}</p>
                        <Badge variant="info" size="xs" className="mt-1">Confirmed</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MedicalRecords;