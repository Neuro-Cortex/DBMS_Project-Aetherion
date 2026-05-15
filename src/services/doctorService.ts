// src/services/doctorService.ts

import {
  Doctor,
  Patient,
  Appointment,
  Prescription,
  BloodRequest,
  VideoConsultation,
  DoctorDashboardData,
  WeeklySchedule,
  DoctorNotification,
  EarningsData,
} from '../types/doctor';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class DoctorService {
  private token: string = '';

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.token}`,
    };
  }

  // Auth
  async login(email: string, password: string): Promise<{ token: string; doctor: Doctor }> {
    const response = await fetch(`${API_BASE_URL}/doctor/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  }

  async register(data: Partial<Doctor>): Promise<Doctor> {
    const response = await fetch(`${API_BASE_URL}/doctor/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Profile
  async getProfile(): Promise<Doctor> {
    const response = await fetch(`${API_BASE_URL}/doctor/profile`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async updateProfile(data: Partial<Doctor>): Promise<Doctor> {
    const response = await fetch(`${API_BASE_URL}/doctor/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  // Dashboard
  async getDashboardData(): Promise<DoctorDashboardData> {
    const response = await fetch(`${API_BASE_URL}/doctor/dashboard`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Appointments
  async getAppointments(date?: string): Promise<Appointment[]> {
    const url = date
      ? `${API_BASE_URL}/doctor/appointments?date=${date}`
      : `${API_BASE_URL}/doctor/appointments`;
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async updateAppointmentStatus(
    id: string,
    status: Appointment['status']
  ): Promise<Appointment> {
    const response = await fetch(`${API_BASE_URL}/doctor/appointments/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status }),
    });
    return response.json();
  }

  // Patients
  async getPatients(): Promise<Patient[]> {
    const response = await fetch(`${API_BASE_URL}/doctor/patients`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async getPatientDetails(id: string): Promise<Patient> {
    const response = await fetch(`${API_BASE_URL}/doctor/patients/${id}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Prescriptions
  async createPrescription(data: Partial<Prescription>): Promise<Prescription> {
    const response = await fetch(`${API_BASE_URL}/doctor/prescriptions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });
    return response.json();
  }

  async getPrescriptions(patientId?: string): Promise<Prescription[]> {
    const url = patientId
      ? `${API_BASE_URL}/doctor/prescriptions?patientId=${patientId}`
      : `${API_BASE_URL}/doctor/prescriptions`;
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Blood Requests
  async getBloodRequests(): Promise<BloodRequest[]> {
    const response = await fetch(`${API_BASE_URL}/doctor/blood-requests`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async approveBloodRequest(id: string): Promise<BloodRequest> {
    const response = await fetch(`${API_BASE_URL}/doctor/blood-requests/${id}/approve`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Video Consultation
  async startVideoConsultation(appointmentId: string): Promise<VideoConsultation> {
    const response = await fetch(`${API_BASE_URL}/doctor/video-consultation/start`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ appointmentId }),
    });
    return response.json();
  }

  async endVideoConsultation(consultationId: string): Promise<void> {
    await fetch(`${API_BASE_URL}/doctor/video-consultation/${consultationId}/end`, {
      method: 'POST',
      headers: this.getHeaders(),
    });
  }

  // Schedule
  async updateSchedule(schedule: WeeklySchedule): Promise<void> {
    await fetch(`${API_BASE_URL}/doctor/schedule`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ schedule }),
    });
  }

  // Availability Status
  async toggleOnlineStatus(isOnline: boolean): Promise<void> {
    await fetch(`${API_BASE_URL}/doctor/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ isOnline }),
    });
  }

  // Notifications
  async getNotifications(): Promise<DoctorNotification[]> {
    const response = await fetch(`${API_BASE_URL}/doctor/notifications`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/doctor/notifications/${id}/read`, {
      method: 'PUT',
      headers: this.getHeaders(),
    });
  }

  // Reviews
  async getReviews(): Promise<unknown[]> {
    const response = await fetch(`${API_BASE_URL}/doctor/reviews`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }

  // Earnings
  async getEarnings(period: 'day' | 'week' | 'month' | 'year'): Promise<EarningsData> {
    const response = await fetch(`${API_BASE_URL}/doctor/earnings?period=${period}`, {
      headers: this.getHeaders(),
    });
    return response.json();
  }
}

export const doctorService = new DoctorService();
