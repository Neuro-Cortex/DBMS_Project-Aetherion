// src/services/adminService.ts

import {
  Admin, SystemStats, User, DoctorVerification,
  HospitalVerification, PharmacyVerification,
  SystemAnalytics, BloodStockAnalytics,
  Report, Feedback, EmergencyAlert,
  SecurityLog, AdminDashboardData,
  SystemHealth
} from '../types/admin';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1/admin';

class AdminService {
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

  // Authentication
  async login(username: string, password: string): Promise<{ token: string; admin: Admin }> {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return response.json();
  }

  async logout(): Promise<void> {
    await fetch(`${API_BASE_URL}/logout`, {
      method: 'POST',
      headers: this.getHeaders()
    });
  }

  // Dashboard
  async getDashboardData(): Promise<AdminDashboardData> {
    const response = await fetch(`${API_BASE_URL}/dashboard`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // User Management
  async getUsers(filters?: any): Promise<User[]> {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/users?${params}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getUserDetails(userId: string): Promise<User> {
    const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updateUser(userId: string, data: Partial<User>): Promise<void> {
    await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  async blockUser(userId: string, reason: string): Promise<void> {
    await fetch(`${API_BASE_URL}/users/${userId}/block`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ reason })
    });
  }

  async deleteUser(userId: string): Promise<void> {
    await fetch(`${API_BASE_URL}/users/${userId}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
  }

  async unblockUser(userId: string): Promise<void> {
    await fetch(`${API_BASE_URL}/users/${userId}/unblock`, {
      method: 'POST',
      headers: this.getHeaders()
    });
  }

  // Doctor Verification
  async getPendingDoctorVerifications(): Promise<DoctorVerification[]> {
    const response = await fetch(`${API_BASE_URL}/verifications/doctors/pending`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async verifyDoctor(verificationId: string, status: string, notes?: string): Promise<void> {
    await fetch(`${API_BASE_URL}/verifications/doctors/${verificationId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status, notes })
    });
  }

  // Hospital Verification
  async getPendingHospitalVerifications(): Promise<HospitalVerification[]> {
    const response = await fetch(`${API_BASE_URL}/verifications/hospitals/pending`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async verifyHospital(verificationId: string, status: string): Promise<void> {
    await fetch(`${API_BASE_URL}/verifications/hospitals/${verificationId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
  }

  // Pharmacy Verification
  async getPendingPharmacyVerifications(): Promise<PharmacyVerification[]> {
    const response = await fetch(`${API_BASE_URL}/verifications/pharmacies/pending`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async verifyPharmacy(verificationId: string, status: string): Promise<void> {
    await fetch(`${API_BASE_URL}/verifications/pharmacies/${verificationId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
  }

  // Analytics
  async getSystemAnalytics(period: string): Promise<SystemAnalytics> {
    const response = await fetch(`${API_BASE_URL}/analytics?period=${period}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getSystemStats(): Promise<SystemStats> {
    const response = await fetch(`${API_BASE_URL}/stats`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Blood Stock Analytics
  async getBloodStockAnalytics(): Promise<BloodStockAnalytics> {
    const response = await fetch(`${API_BASE_URL}/blood-analytics`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Reports
  async generateReport(data: Partial<Report>): Promise<Report> {
    const response = await fetch(`${API_BASE_URL}/reports/generate`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async getReports(): Promise<Report[]> {
    const response = await fetch(`${API_BASE_URL}/reports`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async downloadReport(reportId: string): Promise<Blob> {
    const response = await fetch(`${API_BASE_URL}/reports/${reportId}/download`, {
      headers: this.getHeaders()
    });
    return response.blob();
  }

  // Feedback Management
  async getFeedbacks(filters?: any): Promise<Feedback[]> {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/feedbacks?${params}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async respondToFeedback(feedbackId: string, response: string): Promise<void> {
    await fetch(`${API_BASE_URL}/feedbacks/${feedbackId}/respond`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ response })
    });
  }

  async updateFeedbackStatus(feedbackId: string, status: string): Promise<void> {
    await fetch(`${API_BASE_URL}/feedbacks/${feedbackId}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
  }

  // Emergency Monitoring
  async getActiveEmergencies(): Promise<EmergencyAlert[]> {
    const response = await fetch(`${API_BASE_URL}/emergencies/active`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updateEmergencyStatus(emergencyId: string, status: string): Promise<void> {
    await fetch(`${API_BASE_URL}/emergencies/${emergencyId}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
  }

  async dispatchResponder(emergencyId: string, responderData: any): Promise<void> {
    await fetch(`${API_BASE_URL}/emergencies/${emergencyId}/dispatch`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(responderData)
    });
  }

  // Security
  async getSecurityLogs(): Promise<SecurityLog[]> {
    const response = await fetch(`${API_BASE_URL}/security/logs`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getSystemHealth(): Promise<SystemHealth> {
    const response = await fetch(`${API_BASE_URL}/security/health`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Notifications
  async sendSystemNotification(data: any): Promise<void> {
    await fetch(`${API_BASE_URL}/notifications/send`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  async sendSMS(phone: string, message: string): Promise<void> {
    await fetch(`${API_BASE_URL}/notifications/sms`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ phone, message })
    });
  }

  async sendEmail(email: string, subject: string, message: string): Promise<void> {
    await fetch(`${API_BASE_URL}/notifications/email`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ email, subject, message })
    });
  }
}

export const adminService = new AdminService();