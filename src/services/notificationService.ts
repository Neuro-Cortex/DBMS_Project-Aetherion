// src/services/notificationService.ts
import { io, Socket } from 'socket.io-client';

class NotificationService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  connect(userId: string) {
    this.socket = io('http://localhost:5000', {
      query: { userId }
    });

    this.socket.on('notification', (data) => {
      this.notifyListeners('notification', data);
      
      // Browser notification
      if (Notification.permission === 'granted') {
        new Notification(data.title, {
          body: data.message,
          icon: '/logo.png'
        });
      }
    });

    this.socket.on('emergency', (data) => {
      this.notifyListeners('emergency', data);
    });
  }

  on(event: string, callback: Function) {
    const existing = this.listeners.get(event) || [];
    existing.push(callback);
    this.listeners.set(event, existing);
  }

  private notifyListeners(event: string, data: any) {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(callback => callback(data));
  }

  disconnect() {
    this.socket?.disconnect();
  }
}

export const notificationService = new NotificationService();