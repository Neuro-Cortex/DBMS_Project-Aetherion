// src/services/oxygenService.ts

import {
  OxygenStock, OxygenRequest, OxygenEmergencyAlert,
  OxygenCenter, OxygenDashboardData, OxygenSearchParams
} from '../types/oxygenNetwork';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

class OxygenService {
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
  async getDashboardData(): Promise<OxygenDashboardData> {
    const response = await fetch(`${API_BASE_URL}/oxygen/dashboard`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Stock Monitoring
  async getAllStocks(): Promise<OxygenStock[]> {
    const response = await fetch(`${API_BASE_URL}/oxygen/stocks`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getHospitalStock(hospitalId: string): Promise<OxygenStock> {
    const response = await fetch(`${API_BASE_URL}/oxygen/stocks/${hospitalId}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updateStock(stockId: string, data: Partial<OxygenStock>): Promise<void> {
    await fetch(`${API_BASE_URL}/oxygen/stocks/${stockId}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
  }

  // Oxygen Centers
  async getNearbyCenters(lat: number, lng: number, radius: number): Promise<OxygenCenter[]> {
    const response = await fetch(
      `${API_BASE_URL}/oxygen/centers/nearby?lat=${lat}&lng=${lng}&radius=${radius}`,
      { headers: this.getHeaders() }
    );
    return response.json();
  }

  async searchCenters(params: OxygenSearchParams): Promise<OxygenCenter[]> {
    const queryParams = new URLSearchParams();
    if (params.location) queryParams.append('location', params.location);
    queryParams.append('radius', params.radius.toString());
    if (params.cylinderType) queryParams.append('cylinderType', params.cylinderType);
    queryParams.append('availability', params.availability);
    queryParams.append('sortBy', params.sortBy);

    const response = await fetch(`${API_BASE_URL}/oxygen/centers/search?${queryParams}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async getNearestCenter(lat: number, lng: number): Promise<OxygenCenter> {
    const response = await fetch(
      `${API_BASE_URL}/oxygen/centers/nearest?lat=${lat}&lng=${lng}`,
      { headers: this.getHeaders() }
    );
    return response.json();
  }

  // Oxygen Requests
  async createRequest(data: Partial<OxygenRequest>): Promise<OxygenRequest> {
    const response = await fetch(`${API_BASE_URL}/oxygen/requests`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async getRequests(): Promise<OxygenRequest[]> {
    const response = await fetch(`${API_BASE_URL}/oxygen/requests`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async updateRequestStatus(id: string, status: string): Promise<void> {
    await fetch(`${API_BASE_URL}/oxygen/requests/${id}/status`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify({ status })
    });
  }

  // Emergency Alerts
  async getEmergencyAlerts(): Promise<OxygenEmergencyAlert[]> {
    const response = await fetch(`${API_BASE_URL}/oxygen/emergency-alerts`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async createEmergencyAlert(data: Partial<OxygenEmergencyAlert>): Promise<OxygenEmergencyAlert> {
    const response = await fetch(`${API_BASE_URL}/oxygen/emergency-alerts`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data)
    });
    return response.json();
  }

  async resolveEmergencyAlert(alertId: string): Promise<void> {
    await fetch(`${API_BASE_URL}/oxygen/emergency-alerts/${alertId}/resolve`, {
      method: 'POST',
      headers: this.getHeaders()
    });
  }

  // Cylinder Tracking
  async getCylinderStatus(cylinderId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/oxygen/cylinders/${cylinderId}`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  async trackCylinder(cylinderId: string): Promise<{
    location: string;
    status: string;
    lastUpdated: string;
  }> {
    const response = await fetch(`${API_BASE_URL}/oxygen/cylinders/${cylinderId}/track`, {
      headers: this.getHeaders()
    });
    return response.json();
  }

  // Real-time Updates (WebSocket)
  subscribeToStockUpdates(hospitalId: string, callback: (data: any) => void): () => void {
    const ws = new WebSocket(`ws://localhost:5000/ws/oxygen/${hospitalId}`);
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data);
    };

    return () => ws.close();
  }

  // Notifications
  async sendEmergencyNotification(message: string): Promise<void> {
    await fetch(`${API_BASE_URL}/notifications/oxygen-emergency`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ message })
    });
  }
}

export const oxygenService = new OxygenService();