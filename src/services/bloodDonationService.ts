// src/services/bloodDonationService.ts

import {
  BloodDonor, Donation, BloodStock, BloodRequest,
  EmergencyAlert, BloodDonationCamp, DonorStats,
  DonationCertificate, BloodDonorSearch, DonationReminder,
  DonorReward
} from '../types/BloodDonation';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class BloodDonationService {
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

  // Donor Registration
  async registerDonor(data: Partial<BloodDonor>): Promise<BloodDonor> {
    const response = await fetch(`${API_BASE_URL}/blood-donor/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async getDonorProfile(): Promise<BloodDonor> {
    const response = await fetch(`${API_BASE_URL}/blood-donor/profile`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updateDonorProfile(data: Partial<BloodDonor>): Promise<BloodDonor> {
    const response = await fetch(`${API_BASE_URL}/blood-donor/profile`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Donation Management
  async recordDonation(data: Partial<Donation>): Promise<Donation> {
    const response = await fetch(`${API_BASE_URL}/blood-donor/donations`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async getDonationHistory(): Promise<Donation[]> {
    const response = await fetch(`${API_BASE_URL}/blood-donor/donations`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getDonationCertificate(donationId: string): Promise<DonationCertificate> {
    const response = await fetch(`${API_BASE_URL}/blood-donor/donations/${donationId}/certificate`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Eligibility
  async checkEligibility(): Promise<{
    isEligible: boolean;
    nextEligibleDate: string;
    reason?: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/blood-donor/check-eligibility`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  calculateNextEligibleDate(lastDonationDate: string): string {
    const lastDate = new Date(lastDonationDate);
    const nextDate = new Date(lastDate);
    nextDate.setMonth(nextDate.getMonth() + 3); // 3 months deferral period
    return nextDate.toISOString().split('T')[0];
  }

  // Donor Search
  async searchDonors(search: BloodDonorSearch): Promise<BloodDonor[]> {
    const params = new URLSearchParams();
    if (search.bloodGroup) params.append('bloodGroup', search.bloodGroup);
    if (search.location) params.append('location', search.location);
    params.append('radius', search.radius.toString());
    params.append('availability', search.availability);
    params.append('sortBy', search.sortBy);
    
    const response = await fetch(`${API_BASE_URL}/blood-donor/search?${params}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getNearbyDonors(lat: number, lng: number, radius: number): Promise<BloodDonor[]> {
    const response = await fetch(
      `${API_BASE_URL}/blood-donor/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
      { headers: this.getHeaders() }
    );
    return response.json();
  }

  // Blood Stock
  async getBloodStock(): Promise<BloodStock[]> {
    const response = await fetch(`${API_BASE_URL}/blood-stock`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getBloodStockByGroup(bloodGroup: string): Promise<BloodStock> {
    const response = await fetch(`${API_BASE_URL}/blood-stock/${bloodGroup}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Emergency
  async createEmergencyAlert(data: Partial<EmergencyAlert>): Promise<EmergencyAlert> {
    const response = await fetch(`${API_BASE_URL}/emergency-alert`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async getActiveEmergencies(): Promise<EmergencyAlert[]> {
    const response = await fetch(`${API_BASE_URL}/emergency-alert/active`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async respondToEmergency(alertId: string): Promise<void> {
    await fetch(`${API_BASE_URL}/emergency-alert/${alertId}/respond`, {
      method: 'POST',
      headers: this.getHeaders()
    });
  }

  // Blood Requests
  async createBloodRequest(data: Partial<BloodRequest>): Promise<BloodRequest> {
    const response = await fetch(`${API_BASE_URL}/blood-request`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async getBloodRequests(): Promise<BloodRequest[]> {
    const response = await fetch(`${API_BASE_URL}/blood-request`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Donation Camps
  async getDonationCamps(): Promise<BloodDonationCamp[]> {
    const response = await fetch(`${API_BASE_URL}/donation-camps`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async registerForCamp(campId: string): Promise<void> {
    await fetch(`${API_BASE_URL}/donation-camps/${campId}/register`, {
      method: 'POST',
      headers: this.getHeaders()
    });
  }

  // Rewards
  async getRewardPoints(): Promise<{
    total: number;
    history: DonorReward[];
  }> {
    const response = await fetch(`${API_BASE_URL}/blood-donor/rewards`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async redeemReward(rewardId: string): Promise<void> {
    await fetch(`${API_BASE_URL}/blood-donor/rewards/${rewardId}/redeem`, {
      method: 'POST',
      headers: this.getHeaders()
    });
  }

  // Reminders
  async setDonationReminder(data: Partial<DonationReminder>): Promise<DonationReminder> {
    const response = await fetch(`${API_BASE_URL}/blood-donor/reminders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async getReminders(): Promise<DonationReminder[]> {
    const response = await fetch(`${API_BASE_URL}/blood-donor/reminders`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Stats
  async getDonorStats(): Promise<DonorStats> {
    const response = await fetch(`${API_BASE_URL}/blood-donor/stats`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Notifications
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

export const bloodDonationService = new BloodDonationService();