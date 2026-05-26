// src/pages/Doctor/Patients.tsx
// COMPLETE PATIENT MANAGEMENT - DOCTOR CAN VIEW PATIENT DETAILS
import React, { useState, useMemo  } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,  ChevronDown,
  Users,  Phone, MapPin, Calendar, 
  Heart, Activity, Pill, FileText, Download,
  AlertCircle, CheckCircle2,  TrendingUp,
  Microscope, Thermometer, Shield, 
  MessageCircle,  Plus,  Eye
} from 'lucide-react';



import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Input } from 'src/ui/Input';
import { Modal } from 'src/ui/Modal';


// ============================================
// TYPES
// ============================================
interface MedicalHistory {
  date: string;
  condition: string;
  treatment: string;
  doctor: string;
  notes: string;
}

interface PrescriptionHistory {
  id: string;
  date: string;
  medicines: { name: string; dosage: string; duration: string }[];
  diagnosis: string;
}

interface LabReport {
  id: string;
  type: string;
  date: string;
  result: string;
  status: 'normal' | 'abnormal' | 'critical';
}

interface PatientFullData {
  [x: string]: unknown;
  id: string;
  name: string;
  age: number;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
  avatar: string;
  // Medical
  height: string;
  weight: string;
  bmi: number;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
  allergies: string[];
  chronicDiseases: string[];
  currentMedications: string[];
  // History
  medicalHistory: MedicalHistory[];
  prescriptionHistory: PrescriptionHistory[];
  labReports: LabReport[];
  // Status
  lastVisit: string;
  nextAppointment: string;
  totalVisits: number;
  priority: 'normal' | 'urgent' | 'emergency';
  isActive: boolean;
}

// ============================================
// MOCK DATA - 10 PATIENTS
// ============================================
const patientsData: PatientFullData[] = [
  {
    id: 'P001', name: 'Rahima Khatun', age: 32, gender: 'Female', bloodGroup: 'A+',
    phone: '+880-1712-345678', email: 'rahima@gmail.com', address: 'Dhanmondi, Dhaka',
    avatar: 'RK', height: '162 cm', weight: '68 kg', bmi: 25.9,
    bloodPressure: '130/85', heartRate: '78 bpm', temperature: '98.6°F',
    allergies: ['Penicillin', 'Dust'],
    chronicDiseases: ['Hypertension'],
    currentMedications: ['Losartan 50mg', 'Amlodipine 5mg'],
    medicalHistory: [
      { date: '2026-05-20', condition: 'Hypertension Stage 1', treatment: 'Medication prescribed', doctor: 'Dr. Self', notes: 'Blood pressure elevated, stress related' },
      { date: '2025-11-15', condition: 'Migraine', treatment: 'Pain management', doctor: 'Dr. Fatema', notes: 'Stress induced migraine' },
    ],
    prescriptionHistory: [
      { id: 'RX001', date: '2026-05-20', medicines: [{ name: 'Losartan 50mg', dosage: '1 tablet daily', duration: '30 days' }, { name: 'Amlodipine 5mg', dosage: '1 tablet daily', duration: '30 days' }], diagnosis: 'Hypertension Stage 1' },
    ],
    labReports: [
      { id: 'LAB001', type: 'Blood Test', date: '2026-05-21', result: 'Cholesterol borderline high', status: 'abnormal' },
      { id: 'LAB002', type: 'ECG', date: '2026-05-21', result: 'Normal sinus rhythm', status: 'normal' },
    ],
    lastVisit: '2026-05-20', nextAppointment: '2026-06-05', totalVisits: 8,
    priority: 'normal', isActive: true,
  },
  {
    id: 'P002', name: 'Kamal Hossain', age: 45, gender: 'Male', bloodGroup: 'O+',
    phone: '+880-1712-456789', email: 'kamal@gmail.com', address: 'Gulshan, Dhaka',
    avatar: 'KH', height: '175 cm', weight: '85 kg', bmi: 27.8,
    bloodPressure: '145/95', heartRate: '82 bpm', temperature: '98.2°F',
    allergies: [],
    chronicDiseases: ['Diabetes Type 2', 'Hypertension'],
    currentMedications: ['Metformin 500mg', 'Insulin Glargine'],
    medicalHistory: [
      { date: '2026-05-18', condition: 'Diabetes uncontrolled', treatment: 'Insulin started', doctor: 'Dr. Self', notes: 'HbA1c elevated, lifestyle changes needed' },
      { date: '2025-08-10', condition: 'Diabetic Neuropathy', treatment: 'Gabapentin prescribed', doctor: 'Dr. Nasrin', notes: 'Mild neuropathy in feet' },
    ],
    prescriptionHistory: [
      { id: 'RX002', date: '2026-05-18', medicines: [{ name: 'Metformin 500mg', dosage: '1 tablet twice daily', duration: '30 days' }, { name: 'Insulin Glargine', dosage: '10 units at bedtime', duration: '90 days' }], diagnosis: 'Diabetes Type 2 - Uncontrolled' },
    ],
    labReports: [
      { id: 'LAB003', type: 'Blood Sugar', date: '2026-05-19', result: 'Fasting: 180 mg/dL', status: 'critical' },
      { id: 'LAB004', type: 'HbA1c', date: '2026-05-19', result: '8.5%', status: 'abnormal' },
    ],
    lastVisit: '2026-05-18', nextAppointment: '2026-06-02', totalVisits: 15,
    priority: 'urgent', isActive: true,
  },
  {
    id: 'P003', name: 'Nasrin Sultana', age: 28, gender: 'Female', bloodGroup: 'B+',
    phone: '+880-1712-567890', email: 'nasrin@gmail.com', address: 'Bashundhara, Dhaka',
    avatar: 'NS', height: '158 cm', weight: '72 kg', bmi: 28.8,
    bloodPressure: '120/80', heartRate: '76 bpm', temperature: '98.8°F',
    allergies: [],
    chronicDiseases: [],
    currentMedications: ['Iron Supplement', 'Calcium + Vitamin D', 'Folic Acid'],
    medicalHistory: [
      { date: '2026-05-22', condition: 'Pregnancy - Week 24', treatment: 'Routine checkup', doctor: 'Dr. Self', notes: 'Normal progression, fetal heartbeat strong' },
    ],
    prescriptionHistory: [
      { id: 'RX003', date: '2026-05-22', medicines: [{ name: 'Iron Supplement', dosage: '1 tablet daily', duration: '90 days' }, { name: 'Folic Acid', dosage: '400mcg daily', duration: '90 days' }], diagnosis: 'Pregnancy - Routine Care' },
    ],
    labReports: [
      { id: 'LAB005', type: 'Ultrasound', date: '2026-05-20', result: 'Normal fetal growth', status: 'normal' },
      { id: 'LAB006', type: 'Blood Test', date: '2026-05-20', result: 'Hemoglobin: 11.5 g/dL', status: 'normal' },
    ],
    lastVisit: '2026-05-22', nextAppointment: '2026-06-10', totalVisits: 6,
    priority: 'normal', isActive: true,
  },
  {
    id: 'P004', name: 'Rafiqul Islam', age: 58, gender: 'Male', bloodGroup: 'AB+',
    phone: '+880-1712-678901', email: 'rafiqul@gmail.com', address: 'Mirpur, Dhaka',
    avatar: 'RI', height: '170 cm', weight: '78 kg', bmi: 27.0,
    bloodPressure: '160/100', heartRate: '92 bpm', temperature: '99.1°F',
    allergies: ['Aspirin', 'Ibuprofen'],
    chronicDiseases: ['Heart Disease', 'Diabetes Type 2', 'Hypertension'],
    currentMedications: ['Aspirin 75mg (discontinued)', 'Clopidogrel 75mg', 'Metformin 500mg', 'Atorvastatin 20mg'],
    medicalHistory: [
      { date: '2026-05-15', condition: 'Angina attack', treatment: 'Emergency admission', doctor: 'Dr. Self', notes: 'Chest pain, ECG abnormal, admitted for observation' },
      { date: '2025-12-01', condition: 'Myocardial Infarction', treatment: 'Stent placed', doctor: 'Dr. Sharmin', notes: 'LAD stent, successful procedure' },
    ],
    prescriptionHistory: [
      { id: 'RX004', date: '2026-05-15', medicines: [{ name: 'Clopidogrel 75mg', dosage: '1 tablet daily', duration: '90 days' }, { name: 'Atorvastatin 20mg', dosage: '1 tablet at night', duration: '90 days' }], diagnosis: 'Post-Stent Care' },
    ],
    labReports: [
      { id: 'LAB007', type: 'ECG', date: '2026-05-22', result: 'ST segment depression', status: 'abnormal' },
      { id: 'LAB008', type: 'Troponin', date: '2026-05-15', result: 'Elevated', status: 'critical' },
      { id: 'LAB009', type: 'Echocardiogram', date: '2026-05-16', result: 'EF: 45%', status: 'abnormal' },
    ],
    lastVisit: '2026-05-15', nextAppointment: '2026-05-28', totalVisits: 22,
    priority: 'emergency', isActive: true,
  },
  {
    id: 'P005', name: 'Sharmin Akter', age: 35, gender: 'Female', bloodGroup: 'A-',
    phone: '+880-1712-789012', email: 'sharmin@gmail.com', address: 'Uttara, Dhaka',
    avatar: 'SA', height: '160 cm', weight: '55 kg', bmi: 21.5,
    bloodPressure: '110/70', heartRate: '72 bpm', temperature: '98.4°F',
    allergies: ['Sulfa drugs'],
    chronicDiseases: ['PCOS', 'Hypothyroidism'],
    currentMedications: ['Levothyroxine 50mcg', 'Metformin 500mg'],
    medicalHistory: [
      { date: '2026-04-10', condition: 'PCOS follow-up', treatment: 'Continued medication', doctor: 'Dr. Self', notes: 'Cycle regulating, weight stable' },
    ],
    prescriptionHistory: [
      { id: 'RX005', date: '2026-04-10', medicines: [{ name: 'Levothyroxine 50mcg', dosage: '1 tablet morning', duration: '90 days' }, { name: 'Metformin 500mg', dosage: '1 tablet twice daily', duration: '90 days' }], diagnosis: 'PCOS with Hypothyroidism' },
    ],
    labReports: [
      { id: 'LAB010', type: 'TSH', date: '2026-04-08', result: '3.2 mIU/L', status: 'normal' },
      { id: 'LAB011', type: 'Ultrasound', date: '2026-04-05', result: 'Multiple follicles', status: 'abnormal' },
    ],
    lastVisit: '2026-04-10', nextAppointment: '2026-07-10', totalVisits: 5,
    priority: 'normal', isActive: true,
  },
  {
    id: 'P006', name: 'Abdul Karim', age: 52, gender: 'Male', bloodGroup: 'B-',
    phone: '+880-1712-890123', email: 'abdul@gmail.com', address: 'Motijheel, Dhaka',
    avatar: 'AK', height: '168 cm', weight: '90 kg', bmi: 31.9,
    bloodPressure: '150/95', heartRate: '85 bpm', temperature: '98.9°F',
    allergies: [],
    chronicDiseases: ['Obesity', 'Sleep Apnea', 'Diabetes Type 2'],
    currentMedications: ['Metformin 1000mg', 'CPAP Therapy'],
    medicalHistory: [
      { date: '2026-03-20', condition: 'Diabetes review', treatment: 'Dose increased', doctor: 'Dr. Self', notes: 'Weight gain, poor diet compliance' },
    ],
    prescriptionHistory: [],
    labReports: [],
    lastVisit: '2026-03-20', nextAppointment: '2026-06-20', totalVisits: 3,
    priority: 'normal', isActive: true,
  },
];

// ============================================
// COLOR MAP
// ============================================
const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400', red: 'bg-red-500/10 text-red-400',
  green: 'bg-green-500/10 text-green-400', amber: 'bg-amber-500/10 text-amber-400',
  purple: 'bg-purple-500/10 text-purple-400', cyan: 'bg-cyan-500/10 text-cyan-400',
  emerald: 'bg-emerald-500/10 text-emerald-400', rose: 'bg-rose-500/10 text-rose-400',
  pink: 'bg-pink-500/10 text-pink-400', indigo: 'bg-indigo-500/10 text-indigo-400',
};

// ============================================
// MAIN COMPONENT
// ============================================
const Patients: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<PatientFullData | null>(null);
  const [expandedPatient, setExpandedPatient] = useState<string | null>(null);

  const filteredPatients = useMemo(() => {
    let result = [...patientsData];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.condition.toLowerCase().includes(q)
      );
    }
    if (priorityFilter !== 'all') {
      result = result.filter(p => p.priority === priorityFilter);
    }
    return result;
  }, [searchQuery, priorityFilter]);

  const getPatientCondition = (patient: PatientFullData): string => {
    if (patient.chronicDiseases.length > 0) return patient.chronicDiseases[0];
    if (patient.medicalHistory.length > 0) return patient.medicalHistory[0].condition;
    return 'General Checkup';
  };

  return (
    <div className="min-h-screen bg-[#030508]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <Users className="w-8 h-8 text-cyan-400" />
              Patient Management
            </h1>
            <p className="text-slate-400 text-sm mt-1">{patientsData.length} total patients • {patientsData.filter(p => p.isActive).length} active</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" className="bg-gradient-to-r from-cyan-500 to-blue-500">
              <Plus className="w-4 h-4 mr-2" /> Add Patient
            </Button>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Patients', value: patientsData.length, color: 'blue', icon: Users },
            { label: 'Active', value: patientsData.filter(p => p.isActive).length, color: 'emerald', icon: CheckCircle2 },
            { label: 'Emergency', value: patientsData.filter(p => p.priority === 'emergency').length, color: 'red', icon: AlertCircle },
            { label: 'Today\'s Appointments', value: '8', color: 'purple', icon: Calendar },
          ].map((stat, i) => {
            const Icon = stat.icon;
            const colors = colorMap[stat.color] || '';
            const [bg, text] = colors.split(' ');
            return (
              <Card key={i} className="p-4 text-center">
                <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3`}>
                  <Icon className={`w-5 h-5 ${text}`} />
                </div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        {/* SEARCH + FILTERS */}
        <GlassmorphicCard className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <Input
                placeholder="Search by name, ID, phone, or condition..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="w-5 h-5" />}
              />
            </div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-5 py-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-white font-bold text-sm cursor-pointer">
              <option value="all">📋 All Priority</option>
              <option value="normal">🟢 Normal</option>
              <option value="urgent">🟡 Urgent</option>
              <option value="emergency">🔴 Emergency</option>
            </select>
          </div>
        </GlassmorphicCard>

        {/* RESULTS COUNT */}
        <p className="text-sm text-slate-400">
          Showing <span className="text-white font-bold">{filteredPatients.length}</span> patients
        </p>

        {/* PATIENTS LIST */}
        <div className="space-y-3">
          {filteredPatients.map((patient) => {
            const condition = getPatientCondition(patient);
            const isExpanded = expandedPatient === patient.id;

            return (
              <motion.div key={patient.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="relative group">
                <Card className="p-5 hover:border-cyan-500/20 transition-all cursor-pointer overflow-hidden">
                  
                  {/* Main Row */}
                  <div onClick={() => setExpandedPatient(isExpanded ? null : patient.id)}
                    className="flex items-center gap-4">
                    <div className="relative">
                      <Avatar name={patient.avatar} size="lg" className="ring-2 ring-white/5" />
                      <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-[#030508] ${
                        patient.priority === 'emergency' ? 'bg-red-400 animate-pulse shadow-lg shadow-red-400/50' :
                        patient.priority === 'urgent' ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-lg">{patient.name}</h3>
                        <Badge variant={patient.priority === 'emergency' ? 'danger' : patient.priority === 'urgent' ? 'warning' : 'info'} className="text-[10px]">
                          {patient.priority}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500">
                        <span>{patient.age}y • {patient.gender}</span>
                        <span>•</span>
                        <span className="text-red-400 font-bold">{patient.bloodGroup}</span>
                        <span>•</span>
                        <span>{patient.phone}</span>
                      </div>
                      <p className="text-xs text-cyan-400 mt-1">{condition}</p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Button variant="primary" size="xs" className="bg-cyan-500" onClick={(e) => { e.stopPropagation(); setSelectedPatient(patient); }}>
                          <Eye className="w-3.5 h-3.5 mr-1" /> View Details
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500">
                        Last Visit: <span className="text-slate-400">{patient.lastVisit}</span>
                      </p>
                      <p className="text-xs text-slate-500">
                        Next: <span className="text-cyan-400">{patient.nextAppointment}</span>
                      </p>
                    </div>

                    <ChevronDown className={`w-5 h-5 text-slate-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>

                  {/* Expanded Details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="mt-4 pt-4 border-t border-white/[0.06] grid grid-cols-4 gap-3">
                          <div className="p-3 rounded-2xl bg-white/[0.02]">
                            <p className="text-xs text-slate-400">Height</p>
                            <p className="text-white font-bold">{patient.height}</p>
                          </div>
                          <div className="p-3 rounded-2xl bg-white/[0.02]">
                            <p className="text-xs text-slate-400">Weight</p>
                            <p className="text-white font-bold">{patient.weight}</p>
                          </div>
                          <div className="p-3 rounded-2xl bg-white/[0.02]">
                            <p className="text-xs text-slate-400">BMI</p>
                            <p className="text-white font-bold">{patient.bmi}</p>
                          </div>
                          <div className="p-3 rounded-2xl bg-white/[0.02]">
                            <p className="text-xs text-slate-400">BP</p>
                            <p className="text-white font-bold">{patient.bloodPressure}</p>
                          </div>
                          {/* Allergies */}
                          <div className="col-span-2 p-3 rounded-2xl bg-white/[0.02]">
                            <p className="text-xs text-slate-400 mb-1">Allergies</p>
                            <div className="flex flex-wrap gap-1">
                              {patient.allergies.length > 0 ? patient.allergies.map(a => (
                                <Badge key={a} variant="danger" className="text-[10px]">{a}</Badge>
                              )) : <span className="text-slate-500 text-xs">None</span>}
                            </div>
                          </div>
                          {/* Chronic Diseases */}
                          <div className="col-span-2 p-3 rounded-2xl bg-white/[0.02]">
                            <p className="text-xs text-slate-400 mb-1">Chronic Diseases</p>
                            <div className="flex flex-wrap gap-1">
                              {patient.chronicDiseases.map(d => (
                                <Badge key={d} variant="warning" className="text-[10px]">{d}</Badge>
                              ))}
                            </div>
                          </div>
                          {/* Current Medications */}
                          <div className="col-span-4 p-3 rounded-2xl bg-white/[0.02]">
                            <p className="text-xs text-slate-400 mb-1">Current Medications</p>
                            <div className="flex flex-wrap gap-1">
                              {patient.currentMedications.map(m => (
                                <Badge key={m} variant="info" className="text-[10px]">{m}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3 mt-3">
                          <Button variant="primary" size="sm" className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500"
                            onClick={(e) => { e.stopPropagation(); setSelectedPatient(patient); }}>
                            <Eye className="w-4 h-4 mr-2" /> View Full Profile
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1">
                            <FileText className="w-4 h-4 mr-2" /> Write Prescription
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ============================================ */}
      {/* PATIENT DETAIL MODAL */}
      {/* ============================================ */}
      <AnimatePresence>
        {selectedPatient && (
          <Modal isOpen={true} onClose={() => setSelectedPatient(null)} size="xl" className="max-h-[93vh] overflow-y-auto">
            <div className="p-8">
              
              {/* Header */}
              <div className="flex items-center gap-5 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-full blur-xl" />
                  <Avatar name={selectedPatient.avatar} size="xl" className="relative ring-3 ring-cyan-500/20" />
                </div>
                <div className="flex-1">
                  <h2 className="text-3xl font-black text-white">{selectedPatient.name}</h2>
                  <p className="text-slate-400">{selectedPatient.age}y • {selectedPatient.gender} • <span className="text-red-400 font-bold">{selectedPatient.bloodGroup}</span></p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-slate-500 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {selectedPatient.phone}</span>
                    <span className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedPatient.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={selectedPatient.priority === 'emergency' ? 'danger' : selectedPatient.priority === 'urgent' ? 'warning' : 'info'}>
                    {selectedPatient.priority}
                  </Badge>
                  <Badge variant="success">Active</Badge>
                </div>
              </div>

              {/* Vitals */}
              <div className="grid grid-cols-5 gap-3 mb-6">
                {[
                  { label: 'BP', value: selectedPatient.bloodPressure, icon: Heart },
                  { label: 'Heart Rate', value: selectedPatient.heartRate, icon: Activity },
                  { label: 'Temp', value: selectedPatient.temperature, icon: Thermometer },
                  { label: 'BMI', value: selectedPatient.bmi, icon: TrendingUp },
                  { label: 'Visits', value: selectedPatient.totalVisits, icon: Calendar },
                ].map((vital) => {
                  const Icon = vital.icon;
                  return (
                    <GlassmorphicCard key={vital.label} className="p-3 text-center">
                      <Icon className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                      <p className="text-white font-bold text-sm">{vital.value}</p>
                      <p className="text-[10px] text-slate-500">{vital.label}</p>
                    </GlassmorphicCard>
                  );
                })}
              </div>

              {/* Medical Info */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-red-400" /> Allergies
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPatient.allergies.length > 0 ? selectedPatient.allergies.map(a => (
                      <Badge key={a} variant="danger">{a}</Badge>
                    )) : <span className="text-slate-500 text-sm">No known allergies</span>}
                  </div>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-amber-400" /> Chronic Diseases
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPatient.chronicDiseases.map(d => (
                      <Badge key={d} variant="warning">{d}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Current Medications */}
              <div className="mb-6">
                <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-cyan-400" /> Current Medications
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedPatient.currentMedications.map(m => (
                    <Badge key={m} variant="info">{m}</Badge>
                  ))}
                </div>
              </div>

              {/* Medical History */}
              <div className="mb-6">
                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" /> Medical History
                </h3>
                <div className="space-y-2">
                  {selectedPatient.medicalHistory.map((h, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-white font-bold">{h.condition}</h4>
                        <span className="text-xs text-slate-500">{h.date}</span>
                      </div>
                      <p className="text-sm text-slate-400">{h.treatment}</p>
                      <p className="text-xs text-slate-500 mt-1">Doctor: {h.doctor} • {h.notes}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prescription History */}
              <div className="mb-6">
                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                  <Download className="w-5 h-5 text-amber-400" /> Prescription History
                </h3>
                <div className="space-y-2">
                  {selectedPatient.prescriptionHistory.map((pres) => (
                    <div key={pres.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-bold">{pres.id}</h4>
                        <span className="text-xs text-slate-500">{pres.date}</span>
                      </div>
                      <p className="text-sm text-slate-400 mb-2">Diagnosis: {pres.diagnosis}</p>
                      <div className="space-y-1">
                        {pres.medicines.map((med, j) => (
                          <p key={j} className="text-xs text-slate-500">• {med.name} - {med.dosage} ({med.duration})</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Reports */}
              <div className="mb-6">
                <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
                  <Microscope className="w-5 h-5 text-teal-400" /> Lab Reports
                </h3>
                <div className="space-y-2">
                  {selectedPatient.labReports.map((lab) => (
                    <div key={lab.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer">
                      <FileText className="w-5 h-5 text-cyan-400" />
                      <div className="flex-1">
                        <h4 className="text-white text-sm font-bold">{lab.type}</h4>
                        <p className="text-xs text-slate-500">{lab.date} • {lab.result}</p>
                      </div>
                      <Badge variant={lab.status === 'normal' ? 'success' : lab.status === 'abnormal' ? 'warning' : 'danger'} className="text-[10px]">
                        {lab.status}
                      </Badge>
                      <Button variant="ghost" size="xs"><Download className="w-4 h-4" /></Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-white/[0.06]">
                <Button variant="primary" className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 py-4 text-lg">
                  <FileText className="w-5 h-5 mr-2" /> Write Prescription
                </Button>
                <Button variant="outline" className="flex-1 py-4 text-lg">
                  <Calendar className="w-5 h-5 mr-2" /> Schedule Appointment
                </Button>
                <Button variant="outline" className="flex-1 py-4 text-lg">
                  <MessageCircle className="w-5 h-5 mr-2" /> Send Message
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Patients