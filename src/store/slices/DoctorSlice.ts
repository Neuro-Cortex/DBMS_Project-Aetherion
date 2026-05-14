// src/store/slices/doctorSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DoctorProfile,
  DoctorAppointment,
  Patient,
  Prescription,
  EmergencyRequest,
  VideoConsultation,
  EarningsData,
  DoctorStats,
  PatientReport,
  TimeSlot,
} from '../../types/doctor';

interface DoctorState {
  profile: DoctorProfile | null;
  appointments: DoctorAppointment[];
  patients: Patient[];
  prescriptions: Prescription[];
  emergencies: EmergencyRequest[];
  videoConsultations: VideoConsultation[];
  earnings: EarningsData;
  schedule: TimeSlot[];
  reports: PatientReport[];
  stats: DoctorStats;
  isLoading: boolean;
  error: string | null;
}

const initialState: DoctorState = {
  profile: null,
  appointments: [],
  patients: [],
  prescriptions: [],
  emergencies: [],
  videoConsultations: [],
  earnings: {
    today: 0,
    yesterday: 0,
    weekly: 0,
    monthly: 0,
    yearly: 0,
    totalConsultations: 0,
    completedAppointments: 0,
    cancelledAppointments: 0,
    averageRating: 0,
    earningsByDay: [],
    earningsByMonth: [],
  },
  schedule: [],
  reports: [],
  stats: {
    totalPatients: 0,
    todayAppointments: 0,
    completedToday: 0,
    pendingEmergencies: 0,
    videoConsultations: 0,
    earningsToday: 0,
    onlineStatus: false,
    totalPrescriptions: 0,
    averageConsultationTime: '15 mins',
  },
  isLoading: false,
  error: null,
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<DoctorProfile>) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<DoctorProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      if (state.profile) {
        state.profile.isOnline = action.payload;
        state.stats.onlineStatus = action.payload;
      }
    },
    setAppointments: (state, action: PayloadAction<DoctorAppointment[]>) => {
      state.appointments = action.payload;
      state.stats.todayAppointments = action.payload.filter(
        a => a.status === 'upcoming' || a.status === 'ongoing'
      ).length;
      state.stats.completedToday = action.payload.filter(
        a => a.status === 'completed'
      ).length;
    },
    updateAppointment: (state, action: PayloadAction<DoctorAppointment>) => {
      const index = state.appointments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    setPatients: (state, action: PayloadAction<Patient[]>) => {
      state.patients = action.payload;
      state.stats.totalPatients = action.payload.length;
    },
    addPatient: (state, action: PayloadAction<Patient>) => {
      state.patients.unshift(action.payload);
      state.stats.totalPatients++;
    },
    setPrescriptions: (state, action: PayloadAction<Prescription[]>) => {
      state.prescriptions = action.payload;
      state.stats.totalPrescriptions = action.payload.length;
    },
    addPrescription: (state, action: PayloadAction<Prescription>) => {
      state.prescriptions.unshift(action.payload);
      state.stats.totalPrescriptions++;
    },
    setEmergencies: (state, action: PayloadAction<EmergencyRequest[]>) => {
      state.emergencies = action.payload;
      state.stats.pendingEmergencies = action.payload.filter(
        e => e.status === 'pending'
      ).length;
    },
    acceptEmergency: (state, action: PayloadAction<string>) => {
      const emergency = state.emergencies.find(e => e.id === action.payload);
      if (emergency) {
        emergency.status = 'accepted';
        state.stats.pendingEmergencies = state.emergencies.filter(
          e => e.status === 'pending'
        ).length;
      }
    },
    rejectEmergency: (state, action: PayloadAction<string>) => {
      const emergency = state.emergencies.find(e => e.id === action.payload);
      if (emergency) {
        emergency.status = 'rejected';
        state.stats.pendingEmergencies = state.emergencies.filter(
          e => e.status === 'pending'
        ).length;
      }
    },
    setVideoConsultations: (state, action: PayloadAction<VideoConsultation[]>) => {
      state.videoConsultations = action.payload;
      state.stats.videoConsultations = action.payload.filter(
        v => v.status === 'waiting'
      ).length;
    },
    setEarnings: (state, action: PayloadAction<EarningsData>) => {
      state.earnings = action.payload;
      state.stats.earningsToday = action.payload.today;
    },
    setSchedule: (state, action: PayloadAction<TimeSlot[]>) => {
      state.schedule = action.payload;
    },
    updateSchedule: (state, action: PayloadAction<TimeSlot>) => {
      const index = state.schedule.findIndex(s => s.day === action.payload.day);
      if (index !== -1) {
        state.schedule[index] = action.payload;
      }
    },
    setReports: (state, action: PayloadAction<PatientReport[]>) => {
      state.reports = action.payload;
    },
    setStats: (state, action: PayloadAction<DoctorStats>) => {
      state.stats = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setProfile, updateProfile, setOnlineStatus,
  setAppointments, updateAppointment,
  setPatients, addPatient,
  setPrescriptions, addPrescription,
  setEmergencies, acceptEmergency, rejectEmergency,
  setVideoConsultations, setEarnings,
  setSchedule, updateSchedule,
  setReports, setStats,
  setLoading, setError,
} = doctorSlice.actions;

export default doctorSlice.reducer;