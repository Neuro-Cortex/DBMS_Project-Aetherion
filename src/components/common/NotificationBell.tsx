// src/components/common/NotificationBell.tsx
// PROFESSIONAL NOTIFICATION BELL WITH DROPDOWN
// Glassmorphism | Animated | Real-time

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell, BellRing, X, Check, Settings,
  Calendar, Pill, FileText, AlertCircle,
  Heart, MessageCircle, Video, Clock,
  CheckCircle, MoreHorizontal, Trash2
} from 'lucide-react';

// ============================================
// COMMON COMPONENTS
// ============================================
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Button } from 'src/ui/Button';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';

// ============================================
// TYPES
// ============================================

export interface Notification {
  id: string;
  type: 'appointment' | 'medicine' | 'report' | 'emergency' | 'message' | 'system';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  avatar?: string;
  userName?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [isAnimating, setIsAnimating] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const hasUrgent = notifications.some(n => n.priority === 'urgent' && !n.isRead);

  useEffect(() => {
    // Mock notifications
    const mockNotifications: Notification[] = [
      {
        id: '1', type: 'appointment', title: 'Appointment Confirmed',
        message: 'Your appointment with Dr. Sarah Wilson is confirmed for Jan 20 at 10:00 AM',
        time: '5 min ago', isRead: false, priority: 'high',
        actionUrl: '/client/appointments', userName: 'Dr. Sarah Wilson'
      },
      {
        id: '2', type: 'medicine', title: 'Medicine Reminder',
        message: 'Time to take Lisinopril 10mg',
        time: '15 min ago', isRead: false, priority: 'high',
        actionUrl: '/client/prescriptions'
      },
      {
        id: '3', type: 'report', title: 'Report Ready',
        message: 'Your blood test results are now available',
        time: '1 hour ago', isRead: false, priority: 'medium',
        actionUrl: '/client/reports'
      },
      {
        id: '4', type: 'emergency', title: 'Emergency Blood Request',
        message: 'Urgent: O- blood needed at City General Hospital',
        time: '2 hours ago', isRead: false, priority: 'urgent',
        actionUrl: '/client/emergency'
      },
      {
        id: '5', type: 'message', title: 'New Message',
        message: 'Dr. James Brown sent you a message',
        time: '3 hours ago', isRead: true, priority: 'low',
        userName: 'Dr. James Brown'
      },
      {
        id: '6', type: 'system', title: 'System Update',
        message: 'Healthcare portal will be under maintenance tonight',
        time: '1 day ago', isRead: true, priority: 'low'
      },
      {
        id: '7', type: 'appointment', title: 'Follow-up Reminder',
        message: 'Schedule your follow-up appointment with Dr. Emily White',
        time: '2 days ago', isRead: true, priority: 'medium',
        userName: 'Dr. Emily White'
      }
    ];
    setNotifications(mockNotifications);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  const handleMarkAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, isRead: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 600);
    }
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'appointment': return <Calendar className="w-4 h-4 text-blue-500" />;
      case 'medicine': return <Pill className="w-4 h-4 text-green-500" />;
      case 'report': return <FileText className="w-4 h-4 text-purple-500" />;
      case 'emergency': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'message': return <MessageCircle className="w-4 h-4 text-orange-500" />;
      case 'system': return <Settings className="w-4 h-4 text-gray-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'appointment': return 'bg-blue-50 border-blue-200';
      case 'medicine': return 'bg-green-50 border-green-200';
      case 'report': return 'bg-purple-50 border-purple-200';
      case 'emergency': return 'bg-red-50 border-red-200';
      case 'message': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch(priority) {
      case 'urgent': return 'danger';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'info';
    }
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead) 
    : notifications;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* ============================================ */}
      {/* BELL ICON */}
      {/* ============================================ */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleBellClick}
        className={`relative p-2.5 rounded-xl transition-all duration-200 ${
          isOpen 
            ? 'bg-blue-50 text-blue-600' 
            : 'hover:bg-gray-100 text-gray-600'
        }`}
      >
        {/* Bell Icon with Animation */}
        <motion.div
          animate={isAnimating ? { rotate: [0, -15, 15, -10, 10, -5, 5, 0] } : {}}
          transition={{ duration: 0.6 }}
        >
          {hasUrgent ? (
            <BellRing className="w-6 h-6 text-red-500" />
          ) : (
            <Bell className="w-6 h-6" />
          )}
        </motion.div>

        {/* Unread Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 min-w-[22px] h-[22px] bg-gradient-to-r from-red-500 to-red-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-lg shadow-red-500/30 px-1.5"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Urgent Pulse Ring */}
        {hasUrgent && (
          <motion.span
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 rounded-xl border-2 border-red-400"
          />
        )}
      </motion.button>

      {/* ============================================ */}
      {/* DROPDOWN PANEL */}
      {/* ============================================ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute right-0 mt-3 w-[420px] max-w-[95vw] z-50"
          >
            <GlassmorphicCard className="overflow-hidden shadow-2xl border border-gray-200/50">
              {/* Header */}
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <Bell className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">Notifications</h3>
                    <p className="text-xs text-gray-500">
                      {unreadCount} unread • {notifications.length} total
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="xs" onClick={handleMarkAllRead}>
                    <Check className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="xs" onClick={() => setIsOpen(false)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="px-4 py-2 border-b border-gray-50 flex gap-2">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === 'all' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  onClick={() => setFilter('unread')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    filter === 'unread' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* Notification List */}
              <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                {filteredNotifications.length === 0 ? (
                  <div className="p-8 text-center">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3"
                    >
                      <Bell className="w-8 h-8 text-gray-400" />
                    </motion.div>
                    <p className="text-gray-500 font-medium">No notifications</p>
                    <p className="text-xs text-gray-400 mt-1">You're all caught up!</p>
                  </div>
                ) : (
                  filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`px-4 py-3.5 border-b border-gray-50 hover:bg-gray-50/50 transition-all cursor-pointer group relative ${
                        !notification.isRead ? 'bg-blue-50/30' : ''
                      }`}
                      onClick={() => {
                        handleMarkAsRead(notification.id);
                        if (notification.actionUrl) {
                          window.location.href = notification.actionUrl;
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Type Icon */}
                        <div className={`p-2 rounded-xl border ${getTypeColor(notification.type)} flex-shrink-0`}>
                          {getTypeIcon(notification.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold text-gray-800">
                                  {notification.title}
                                </p>
                                {!notification.isRead && (
                                  <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="w-2 h-2 bg-blue-500 rounded-full"
                                  />
                                )}
                                {notification.priority === 'urgent' && (
                                  <Badge variant="danger" size="xs">Urgent</Badge>
                                )}
                              </div>
                              <p className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[10px] text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {notification.time}
                                </span>
                                {notification.userName && (
                                  <span className="text-[10px] text-gray-400">
                                    • {notification.userName}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.isRead && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notification.id); }}
                                  className="p-1 hover:bg-blue-100 rounded-lg text-blue-500"
                                  title="Mark as read"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleDelete(notification.id); }}
                                className="p-1 hover:bg-red-100 rounded-lg text-red-400"
                                title="Delete"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-gray-100 bg-gray-50/50">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full text-gray-500 text-xs"
                  onClick={() => window.location.href = '/notifications'}
                >
                  View All Notifications
                </Button>
              </div>
            </GlassmorphicCard>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;