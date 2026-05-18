// src/types/womenCare.ts

export interface PregnancyRecord {
  id: string;
  userId: string;
  
  // Basic Info
  motherName: string;
  motherAge: number;
  bloodGroup: string;
  
  // Pregnancy Details
  lastMenstrualDate: string;
  expectedDeliveryDate: string;
  currentWeek: number;
  currentTrimester: 'first' | 'second' | 'third';
  isFirstPregnancy: boolean;
  previousPregnancies: number;
  
  // Health Metrics
  weightGain: WeightRecord[];
  bloodPressure: BloodPressureRecord[];
  bloodSugar: BloodSugarRecord[];
  hemoglobin: HemoglobinRecord[];
  
  // Symptoms
  symptoms: PregnancySymptom[];
  
  // Appointments
  appointments: PregnancyAppointment[];
  
  // Medications
  medications: PregnancyMedication[];
  
  // Ultrasound Records
  ultrasounds: UltrasoundRecord[];
  
  // Baby Info
  babyGender?: 'boy' | 'girl' | 'unknown';
  babyName?: string;
  fetalMovement: FetalMovementRecord[];
  
  // Status
  status: 'ongoing' | 'completed' | 'high-risk';
  complications: string[];
  notes: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface WeightRecord {
  date: string;
  weight: number; // kg
  week: number;
  notes?: string;
}

export interface BloodPressureRecord {
  date: string;
  systolic: number;
  diastolic: number;
  week: number;
}

export interface BloodSugarRecord {
  date: string;
  value: number;
  type: 'fasting' | 'post-meal' | 'random';
  week: number;
}

export interface HemoglobinRecord {
  date: string;
  value: number;
  week: number;
}

export interface PregnancySymptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  startDate: string;
  endDate?: string;
  notes?: string;
}

export interface PregnancyAppointment {
  id: string;
  date: string;
  time: string;
  doctorName: string;
  doctorSpecialization: string;
  hospitalName: string;
  type: 'regular-checkup' | 'ultrasound' | 'blood-test' | 'vaccination' | 'emergency';
  status: 'scheduled' | 'completed' | 'cancelled' | 'missed';
  notes?: string;
  reminders: boolean;
}

export interface PregnancyMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  prescribedBy: string;
  purpose: string;
  isSafe: boolean;
  reminders: boolean;
  reminderTimes: string[];
}

export interface UltrasoundRecord {
  id: string;
  date: string;
  week: number;
  type: string;
  findings: string;
  images: string[];
  reportUrl: string;
  performedBy: string;
}

export interface FetalMovementRecord {
  date: string;
  week: number;
  kickCount: number;
  duration: number; // minutes
  notes?: string;
}

export interface BabyVaccine {
  id: string;
  babyId: string;
  babyName: string;
  dateOfBirth: string;
  
  // Vaccine Schedule
  vaccines: VaccineRecord[];
  
  // Growth Records
  growthRecords: GrowthRecord[];
  
  // Health Records
  healthRecords: BabyHealthRecord[];
}

export interface VaccineRecord {
  id: string;
  vaccineName: string;
  disease: string;
  dose: number;
  scheduledDate: string;
  administeredDate?: string;
  administeredBy?: string;
  hospitalName?: string;
  status: 'scheduled' | 'completed' | 'missed' | 'delayed';
  nextDoseDate?: string;
  batchNumber?: string;
  sideEffects?: string;
  certificateUrl?: string;
}

export interface GrowthRecord {
  date: string;
  age: number; // months
  weight: number; // kg
  height: number; // cm
  headCircumference: number; // cm
  bmi: number;
  percentile: number;
  notes?: string;
}

export interface BabyHealthRecord {
  id: string;
  date: string;
  age: number;
  type: 'checkup' | 'illness' | 'vaccination' | 'emergency';
  description: string;
  diagnosis?: string;
  treatment?: string;
  doctorName: string;
  hospitalName: string;
  attachments?: string[];
}

export interface GynecologistConsultation {
  id: string;
  userId: string;
  doctorName: string;
  doctorSpecialization: string;
  hospitalName: string;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  reason: string;
  diagnosis?: string;
  prescription?: string;
  reports?: string[];
  followUpDate?: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface MenstrualCycle {
  id: string;
  userId: string;
  
  // Cycle Info
  lastPeriodDate: string;
  cycleLength: number; // days
  periodDuration: number; // days
  isRegular: boolean;
  
  // Predicted
  nextPeriodDate: string;
  ovulationDate: string;
  fertileWindow: {
    start: string;
    end: string;
  };
  
  // History
  cycleHistory: CycleRecord[];
  
  // Symptoms
  symptoms: MenstrualSymptom[];
  
  // Settings
  reminderEnabled: boolean;
  reminderDays: number;
}

export interface CycleRecord {
  id: string;
  startDate: string;
  endDate: string;
  duration: number;
  flow: 'light' | 'medium' | 'heavy';
  symptoms: string[];
  notes?: string;
}

export interface MenstrualSymptom {
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  date: string;
}

export interface ChildGrowth {
  id: string;
  childName: string;
  dateOfBirth: string;
  gender: 'boy' | 'girl';
  
  // Growth Records
  growthRecords: GrowthRecord[];
  
  // Milestones
  milestones: DevelopmentMilestone[];
  
  // Nutrition
  nutritionPlan: NutritionPlan;
  
  // Vaccination Schedule
  vaccinationSchedule: VaccineRecord[];
}

export interface DevelopmentMilestone {
  id: string;
  category: 'physical' | 'cognitive' | 'social' | 'language';
  name: string;
  expectedAge: number; // months
  achievedAge?: number;
  status: 'pending' | 'achieved' | 'delayed';
  notes?: string;
}

export interface NutritionPlan {
  age: number; // months
  breastfeeding: boolean;
  formulaMilk: boolean;
  solidFoods: string[];
  allergies: string[];
  recommendations: string[];
}

export interface WomenHealthNotification {
  id: string;
  type: 'pregnancy' | 'cycle' | 'vaccine' | 'appointment' | 'health-tip' | 'emergency';
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface EmergencyPregnancySupport {
  id: string;
  userId: string;
  userName: string;
  
  // Emergency Contacts
  emergencyContacts: EmergencyContact[];
  
  // Nearest Hospitals
  nearestHospitals: PregnancyHospital[];
  
  // Emergency Kit
  emergencyKit: EmergencyKitItem[];
  
  // Quick Actions
  quickActions: QuickAction[];
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  isAvailable: boolean;
}

export interface PregnancyHospital {
  id: string;
  name: string;
  distance: number;
  estimatedTime: string;
  hasEmergencyWard: boolean;
  hasNICU: boolean;
  phone: string;
  address: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

export interface EmergencyKitItem {
  name: string;
  isReady: boolean;
  quantity: number;
  notes?: string;
}

export interface QuickAction {
  id: string;
  name: string;
  icon: string;
  action: string;
  phoneNumber?: string;
}

export interface WomenCareDashboardData {
  pregnancy: PregnancyRecord | null;
  upcomingAppointments: PregnancyAppointment[];
  todayMedications: PregnancyMedication[];
  babyVaccines: VaccineRecord[];
  cycleInfo: MenstrualCycle | null;
  notifications: WomenHealthNotification[];
  healthTips: string[];
  emergencyInfo: EmergencyPregnancySupport;
}