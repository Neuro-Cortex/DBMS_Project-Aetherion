// src/services/pharmacyService.ts

import {
  Pharmacy, Medicine, MedicineOrder, Prescription,
  PharmacySearchParams, PharmacyDashboardData,
  ClientPharmacyData, DeliveryTracking, StockAlert,
  MedicineReminder, SalesData
} from '../types/pharmacy';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class PharmacyService {
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

  // Pharmacy Auth
  async pharmacyLogin(email: string, password: string): Promise<{ token: string; pharmacy: Pharmacy }> {
    const response = await fetch(`${API_BASE_URL}/pharmacy/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return response.json();
  }

  async pharmacyRegister(data: Partial<Pharmacy>): Promise<Pharmacy> {
    const response = await fetch(`${API_BASE_URL}/pharmacy/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Dashboard
  async getPharmacyDashboard(): Promise<PharmacyDashboardData> {
    const response = await fetch(`${API_BASE_URL}/pharmacy/dashboard`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getClientPharmacyDashboard(): Promise<ClientPharmacyData> {
    const response = await fetch(`${API_BASE_URL}/pharmacy/client-dashboard`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Medicine Management
  async getMedicines(filters?: any): Promise<Medicine[]> {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/pharmacy/medicines?${params}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async addMedicine(data: Partial<Medicine>): Promise<Medicine> {
    const response = await fetch(`${API_BASE_URL}/pharmacy/medicines`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async updateMedicine(id: string, data: Partial<Medicine>): Promise<void> {
    await fetch(`${API_BASE_URL}/pharmacy/medicines/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  async deleteMedicine(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/pharmacy/medicines/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders()
    });
  }

  // Stock Management
  async updateStock(medicineId: string, quantity: number): Promise<void> {
    await fetch(`${API_BASE_URL}/pharmacy/medicines/${medicineId}/stock`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ quantity })
    });
  }

  async getStockAlerts(): Promise<StockAlert[]> {
    const response = await fetch(`${API_BASE_URL}/pharmacy/stock-alerts`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getExpiringMedicines(days: number): Promise<Medicine[]> {
    const response = await fetch(`${API_BASE_URL}/pharmacy/medicines/expiring?days=${days}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Medicine Search
  async searchMedicines(params: PharmacySearchParams): Promise<{
    medicines: Medicine[];
    pharmacies: Pharmacy[];
  }> {
    const queryParams = new URLSearchParams();
    if (params.medicineName) queryParams.append('name', params.medicineName);
    if (params.location) queryParams.append('location', params.location);
    queryParams.append('radius', params.radius.toString());
    if (params.category) queryParams.append('category', params.category);
    queryParams.append('sortBy', params.sortBy);

    const response = await fetch(`${API_BASE_URL}/pharmacy/search?${queryParams}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getNearbyPharmacies(lat: number, lng: number, radius: number): Promise<Pharmacy[]> {
    const response = await fetch(
      `${API_BASE_URL}/pharmacy/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
      { headers: this.getHeaders() }
    );
    return response.json();
  }

  async compareMedicinePrices(medicineName: string): Promise<{
    pharmacy: Pharmacy;
    price: number;
    available: boolean;
  }[]> {
    const response = await fetch(
      `${API_BASE_URL}/pharmacy/compare-prices?name=${medicineName}`,
      { headers: this.getHeaders() }
    );
    return response.json();
  }

  async getMedicineAlternatives(medicineId: string): Promise<Medicine[]> {
    const response = await fetch(
      `${API_BASE_URL}/pharmacy/medicines/${medicineId}/alternatives`,
      { headers: this.getHeaders() }
    );
    return response.json();
  }

  // Orders
  async createOrder(data: Partial<MedicineOrder>): Promise<MedicineOrder> {
    const response = await fetch(`${API_BASE_URL}/pharmacy/orders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async getOrders(filters?: any): Promise<MedicineOrder[]> {
    const params = new URLSearchParams(filters).toString();
    const response = await fetch(`${API_BASE_URL}/pharmacy/orders?${params}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updateOrderStatus(orderId: string, status: string): Promise<void> {
    await fetch(`${API_BASE_URL}/pharmacy/orders/${orderId}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
  }

  // Prescriptions
  async uploadPrescription(data: FormData): Promise<Prescription> {
    const response = await fetch(`${API_BASE_URL}/pharmacy/prescriptions/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${this.token}` },
      body: data
    });
    return response.json();
  }

  async getPrescriptions(): Promise<Prescription[]> {
    const response = await fetch(`${API_BASE_URL}/pharmacy/prescriptions`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async verifyPrescription(id: string): Promise<void> {
    await fetch(`${API_BASE_URL}/pharmacy/prescriptions/${id}/verify`, {
      method: 'POST',
      headers: this.getHeaders()
    });
  }

  // Delivery Tracking
  async trackDelivery(orderId: string): Promise<DeliveryTracking> {
    const response = await fetch(`${API_BASE_URL}/pharmacy/delivery/${orderId}/track`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Reminders
  async setMedicineReminder(data: Partial<MedicineReminder>): Promise<void> {
    await fetch(`${API_BASE_URL}/pharmacy/reminders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  async getMedicineReminders(): Promise<MedicineReminder[]> {
    const response = await fetch(`${API_BASE_URL}/pharmacy/reminders`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Sales Analytics
  async getSalesAnalytics(period: string): Promise<SalesData> {
    const response = await fetch(`${API_BASE_URL}/pharmacy/analytics/sales?period=${period}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Emergency Support
  async getEmergencyPharmacies(): Promise<Pharmacy[]> {
    const response = await fetch(`${API_BASE_URL}/pharmacy/emergency`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async requestEmergencyMedicine(data: any): Promise<void> {
    await fetch(`${API_BASE_URL}/pharmacy/emergency/request`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }
}

export const pharmacyService = new PharmacyService();