// src/services/womenCareService.ts

import {
  PregnancyRecord, BabyVaccine, GynecologistConsultation,
  MenstrualCycle, ChildGrowth, WomenHealthNotification,
  EmergencyPregnancySupport, WomenCareDashboardData,
  PregnancyAppointment, VaccineRecord
} from '../types/womenCare';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class WomenCareService {
  private token: string = '';

  setToken(token: string) {
    this.token = token;
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.token}`
    };
  }

  // Dashboard
  async getDashboardData(): Promise<WomenCareDashboardData> {
    const response = await fetch(`${API_BASE_URL}/women-care/dashboard`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Pregnancy Tracking
  async getPregnancyRecord(): Promise<PregnancyRecord> {
    const response = await fetch(`${API_BASE_URL}/women-care/pregnancy`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updatePregnancyRecord(data: Partial<PregnancyRecord>): Promise<void> {
    await fetch(`${API_BASE_URL}/women-care/pregnancy`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  async addWeightRecord(data: any): Promise<void> {
    await fetch(`${API_BASE_URL}/women-care/pregnancy/weight`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  async addBloodPressureRecord(data: any): Promise<void> {
    await fetch(`${API_BASE_URL}/women-care/pregnancy/blood-pressure`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  async addFetalMovement(data: any): Promise<void> {
    await fetch(`${API_BASE_URL}/women-care/pregnancy/fetal-movement`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  // Appointments
  async getAppointments(): Promise<PregnancyAppointment[]> {
    const response = await fetch(`${API_BASE_URL}/women-care/appointments`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async scheduleAppointment(data: any): Promise<void> {
    await fetch(`${API_BASE_URL}/women-care/appointments`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  // Medications
  async getMedications(): Promise<any[]> {
    const response = await fetch(`${API_BASE_URL}/women-care/medications`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async addMedication(data: any): Promise<void> {
    await fetch(`${API_BASE_URL}/women-care/medications`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  // Baby Vaccines
  async getBabyVaccines(babyId: string): Promise<VaccineRecord[]> {
    const response = await fetch(`${API_BASE_URL}/women-care/baby/${babyId}/vaccines`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updateVaccineStatus(vaccineId: string, status: string): Promise<void> {
    await fetch(`${API_BASE_URL}/women-care/vaccines/${vaccineId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
  }

  // Child Growth
  async getChildGrowth(childId: string): Promise<ChildGrowth> {
    const response = await fetch(`${API_BASE_URL}/women-care/child/${childId}/growth`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async addGrowthRecord(childId: string, data: any): Promise<void> {
    await fetch(`${API_BASE_URL}/women-care/child/${childId}/growth`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  // Menstrual Cycle
  async getMenstrualCycle(): Promise<MenstrualCycle> {
    const response = await fetch(`${API_BASE_URL}/women-care/menstrual-cycle`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updateCycleData(data: any): Promise<void> {
    await fetch(`${API_BASE_URL}/women-care/menstrual-cycle`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  async addCycleRecord(data: any): Promise<void> {
    await fetch(`${API_BASE_URL}/women-care/menstrual-cycle/record`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  // Gynecologist Consultations
  async getConsultations(): Promise<GynecologistConsultation[]> {
    const response = await fetch(`${API_BASE_URL}/women-care/consultations`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async bookConsultation(data: any): Promise<void> {
    await fetch(`${API_BASE_URL}/women-care/consultations`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  // Notifications
  async getNotifications(): Promise<WomenHealthNotification[]> {
    const response = await fetch(`${API_BASE_URL}/women-care/notifications`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async markNotificationRead(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/women-care/notifications/${id}/read`, {
      method: 'PUT',
      headers: this.getHeaders()
    });
  }

  // Emergency Support
  async getEmergencyInfo(): Promise<EmergencyPregnancySupport> {
    const response = await fetch(`${API_BASE_URL}/women-care/emergency`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async triggerEmergencyAlert(type: string): Promise<void> {
    await fetch(`${API_BASE_URL}/women-care/emergency/alert`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ type })
    });
  }

  // Health Tips
  async getHealthTips(week: number): Promise<string[]> {
    const response = await fetch(`${API_BASE_URL}/women-care/health-tips?week=${week}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Calculate due date
  calculateDueDate(lastMenstrualDate: string): string {
    const lmp = new Date(lastMenstrualDate);
    const dueDate = new Date(lmp);
    dueDate.setDate(dueDate.getDate() + 280); // 40 weeks
    return dueDate.toISOString().split('T')[0];
  }

  // Calculate current week
  calculateCurrentWeek(lastMenstrualDate: string): number {
    const lmp = new Date(lastMenstrualDate);
    const today = new Date();
    const diffTime = today.getTime() - lmp.getTime();
    const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7));
    return Math.min(Math.max(diffWeeks, 1), 42);
  }

  // Predict next period
  predictNextPeriod(lastPeriodDate: string, cycleLength: number): string {
    const lastPeriod = new Date(lastPeriodDate);
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(nextPeriod.getDate() + cycleLength);
    return nextPeriod.toISOString().split('T')[0];
  }

  // Predict ovulation
  predictOvulation(lastPeriodDate: string, cycleLength: number): string {
    const lastPeriod = new Date(lastPeriodDate);
    const ovulation = new Date(lastPeriod);
    ovulation.setDate(ovulation.getDate() + cycleLength - 14);
    return ovulation.toISOString().split('T')[0];
  }
}

export const womenCareService = new WomenCareService();