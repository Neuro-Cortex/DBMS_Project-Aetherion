// src/store/slices/clientSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ClientProfile,
  Appointment,
  BloodDonation,
  HealthRecommendation,
  MedicineReminder,
  EmergencyRequest,
  HealthStats,
  Prescription,
  MedicalReport,
  HealthTimelineEvent,
} from '../../types/client';

interface ClientState {
  profile: ClientProfile | null;
  appointments: Appointment[];
  bloodDonations: BloodDonation[];
  recommendations: HealthRecommendation[];
  reminders: MedicineReminder[];
  emergencyRequests: EmergencyRequest[];
  prescriptions: Prescription[];
  reports: MedicalReport[];
  timeline: HealthTimelineEvent[];
  stats: HealthStats;
  isLoading: boolean;
}

const initialState: ClientState = {
  profile: null,
  appointments: [],
  bloodDonations: [],
  recommendations: [],
  reminders: [],
  emergencyRequests: [],
  prescriptions: [],
  reports: [],
  timeline: [],
  stats: {
    upcomingAppointments: 0,
    activePrescriptions: 0,
    bloodDonations: 0,
    medicalReports: 0,
    healthScore: 85,
  },
  isLoading: false,
};

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<ClientProfile>) => {
      state.profile = action.payload;
    },
    updateProfile: (state, action: PayloadAction<Partial<ClientProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setAppointments: (state, action: PayloadAction<Appointment[]>) => {
      state.appointments = action.payload;
      state.stats.upcomingAppointments = action.payload.filter(
        a => a.status === 'upcoming'
      ).length;
    },
    addAppointment: (state, action: PayloadAction<Appointment>) => {
      state.appointments.unshift(action.payload);
      state.stats.upcomingAppointments++;
    },
    updateAppointment: (state, action: PayloadAction<Appointment>) => {
      const index = state.appointments.findIndex(a => a.id === action.payload.id);
      if (index !== -1) {
        state.appointments[index] = action.payload;
      }
    },
    setBloodDonations: (state, action: PayloadAction<BloodDonation[]>) => {
      state.bloodDonations = action.payload;
      state.stats.bloodDonations = action.payload.length;
    },
    addBloodDonation: (state, action: PayloadAction<BloodDonation>) => {
      state.bloodDonations.unshift(action.payload);
      state.stats.bloodDonations++;
    },
    setRecommendations: (state, action: PayloadAction<HealthRecommendation[]>) => {
      state.recommendations = action.payload;
    },
    setReminders: (state, action: PayloadAction<MedicineReminder[]>) => {
      state.reminders = action.payload;
      state.stats.activePrescriptions = action.payload.filter(r => r.isActive).length;
    },
    addReminder: (state, action: PayloadAction<MedicineReminder>) => {
      state.reminders.push(action.payload);
      state.stats.activePrescriptions++;
    },
    toggleReminder: (state, action: PayloadAction<string>) => {
      const reminder = state.reminders.find(r => r.id === action.payload);
      if (reminder) {
        reminder.isActive = !reminder.isActive;
        state.stats.activePrescriptions = state.reminders.filter(r => r.isActive).length;
      }
    },
    setEmergencyRequests: (state, action: PayloadAction<EmergencyRequest[]>) => {
      state.emergencyRequests = action.payload;
    },
    addEmergencyRequest: (state, action: PayloadAction<EmergencyRequest>) => {
      state.emergencyRequests.unshift(action.payload);
    },
    setPrescriptions: (state, action: PayloadAction<Prescription[]>) => {
      state.prescriptions = action.payload;
    },
    setReports: (state, action: PayloadAction<MedicalReport[]>) => {
      state.reports = action.payload;
      state.stats.medicalReports = action.payload.length;
    },
    addReport: (state, action: PayloadAction<MedicalReport>) => {
      state.reports.unshift(action.payload);
      state.stats.medicalReports++;
    },
    setTimeline: (state, action: PayloadAction<HealthTimelineEvent[]>) => {
      state.timeline = action.payload;
    },
    setStats: (state, action: PayloadAction<HealthStats>) => {
      state.stats = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setProfile,
  updateProfile,
  setAppointments,
  addAppointment,
  updateAppointment,
  setBloodDonations,
  addBloodDonation,
  setRecommendations,
  setReminders,
  addReminder,
  toggleReminder,
  setEmergencyRequests,
  addEmergencyRequest,
  setPrescriptions,
  setReports,
  addReport,
  setTimeline,
  setStats,
  setLoading,
} = clientSlice.actions;

export default clientSlice.reducer;

