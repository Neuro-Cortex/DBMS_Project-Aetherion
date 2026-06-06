// src/components/common/NotificationCenter.tsx
import React, { useState, useEffect } from 'react';
import { Bell, X, Check } from 'lucide-react';
import { notificationService } from '../../services/notificationService';

export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Request permission
    if (Notification.permission === 'default') {
      Notification.requestPermission();
    }

    notificationService.connect('user-123');
    notificationService.on('notification', (data: any) => {
      setNotifications(prev => [data, ...prev]);
      setUnreadCount(prev => prev + 1);
    });

    return () => notificationService.disconnect();
  }, []);

  const markAllRead = () => {
    setUnreadCount(0);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border">
          <div className="p-3 border-b flex justify-between items-center">
            <h3 className="font-semibold">Notifications</h3>
            <button onClick={markAllRead} className="text-blue-600 text-sm">
              Mark all read
            </button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notif, index) => (
              <div key={index} className="p-3 border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                <p className="text-sm font-medium">{notif.title}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">{notif.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;