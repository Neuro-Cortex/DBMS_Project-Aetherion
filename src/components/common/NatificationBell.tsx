// src/components/common/NotificationBell.tsx

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, Check, Clock, AlertCircle, MessageSquare, UserPlus, FileText, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Avatar } from '../ui/Avatar';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface Notification {
  id: string;
  type: 'appointment' | 'message' | 'alert' | 'system' | 'user';
  title: string;
  description: string;
  time: string;
  unread: boolean;
  avatar?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'ghost' | 'glassmorphic';
  }>;
}

export interface NotificationBellProps {
  notifications?: Notification[];
  variant?: 'default' | 'glass' | 'neon';
  maxVisible?: number;
  pollingInterval?: number;
  onMarkAllRead?: () => void;
  onNotificationClick?: (notification: Notification) => void;
  className?: string;
}

// ============================================
// NOTIFICATION ICONS
// ============================================

const notificationIcons: Record<Notification['type'], React.ComponentType<{ className?: string }>> = {
  appointment: Calendar,
  message: MessageSquare,
  alert: AlertCircle,
  system: FileText,
  user: UserPlus,
};

// ============================================
// VARIANT STYLES
// ============================================

const variantStyles = {
  default: `
    bg-white dark:bg-gray-800
    border border-gray-300 dark:border-gray-600
    text-gray-700 dark:text-gray-200
  `,
  glass: `
    bg-white/10 dark:bg-gray-900/10
    backdrop-blur-xl backdrop-saturate-150
    border border-white/20 dark:border-gray-700/20
    text-white
  `,
  neon: `
    bg-gray-900/90 dark:bg-black/90
    border-2 border-cyan-500/50
    text-cyan-100
    shadow-[0_0_20px_rgba(6,182,212,0.3)]
  `,
};

// ============================================
// NOTIFICATION BELL COMPONENT
// ============================================

export const NotificationBell: React.FC<NotificationBellProps> = ({
  notifications: initialNotifications = [],
  variant = 'glass',
  maxVisible = 5,
  pollingInterval,
  onMarkAllRead,
  onNotificationClick,
  className,
}) => {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [isOpen, setIsOpen] = useState(false);
  const [bellAnimating, setBellAnimating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Simulate real-time notifications
  useEffect(() => {
    if (!pollingInterval) return;
    
    const interval = setInterval(() => {
      const notificationTypes: Notification['type'][] = ['appointment', 'message', 'alert', 'system', 'user'];
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: notificationTypes[Math.floor(Math.random() * notificationTypes.length)],
        title: 'New notification',
        description: 'You have a new update',
        time: 'Just now',
        unread: true,
      };
      
      setNotifications(prev => [newNotification, ...prev].slice(0, 20));
      setBellAnimating(true);
      setTimeout(() => setBellAnimating(false), 500);
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [pollingInterval]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => n.unread).length;
  const visibleNotifications = notifications.slice(0, maxVisible);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, unread: false } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    onMarkAllRead?.();
  };

  return (
    <div ref={containerRef} className={twMerge('relative', className)}>
      {/* Bell Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={twMerge(
          clsx(
            'relative p-3 rounded-2xl transition-all duration-300',
            variantStyles[variant],
            'transform-gpu'
          )
        )}
        animate={bellAnimating ? { rotate: [0, -20, 20, -20, 0] } : {}}
        transition={{ duration: 0.5 }}
      >
        <Bell className="w-6 h-6" />

        {/* Notification Badge */}
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1"
            >
              <Badge 
                variant="danger" 
                size="xs" 
                className="shadow-lg shadow-red-500/50"
              >
                {unreadCount > 99 ? '99+' : unreadCount}
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={clsx(
              'absolute top-full mt-2 right-0 w-96',
              'bg-white/10 dark:bg-gray-900/10',
              'backdrop-blur-2xl backdrop-saturate-150',
              'border border-white/20 dark:border-gray-700/20',
              'rounded-2xl shadow-2xl overflow-hidden z-50'
            )}
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white">Notifications</h3>
                  <p className="text-sm text-white/70">
                    {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
                  </p>
                </div>
                {unreadCount > 0 && (
                  <Button
                    variant="glassmorphic"
                    size="xs"
                    onClick={markAllAsRead}
                  >
                    Mark all read
                  </Button>
                )}
              </div>
            </div>

            {/* Notifications List */}
            <div className="max-h-96 overflow-y-auto">
              {visibleNotifications.length === 0 ? (
                <div className="px-6 py-12 text-center">
                  <Bell className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60">No notifications yet</p>
                </div>
              ) : (
                <AnimatePresence>
                  {visibleNotifications.map((notification, i) => {
                    const Icon = notificationIcons[notification.type];
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ delay: i * 0.05 }}
                        className={clsx(
                          'px-6 py-4 border-b border-white/10',
                          'hover:bg-white/5 transition-colors cursor-pointer',
                          notification.unread && 'bg-cyan-500/5 border-l-4 border-l-cyan-500'
                        )}
                        onClick={() => {
                          onNotificationClick?.(notification);
                          markAsRead(notification.id);
                        }}
                      >
                        <div className="flex items-start gap-4">
                          {/* Avatar or Icon */}
                          {notification.avatar ? (
                            <Avatar 
                              src={notification.avatar} 
                              size="sm" 
                              className="mt-1 flex-shrink-0"
                            />
                          ) : (
                            <div className={clsx(
                              'p-2 rounded-xl flex-shrink-0 mt-1',
                              notification.unread ? 'bg-cyan-500/20' : 'bg-white/10'
                            )}>
                              <Icon className={clsx(
                                'w-4 h-4',
                                notification.unread ? 'text-cyan-400' : 'text-white/60'
                              )} />
                            </div>
                          )}

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-white/70 mt-1 line-clamp-2">
                              {notification.description}
                            </p>
                            <p className="text-xs text-white/50 mt-2 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {notification.time}
                            </p>
                          </div>

                          {/* Actions */}
                          {notification.actions && notification.actions.length > 0 && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {notification.actions.map((action, idx) => (
                                <Button
                                  key={idx}
                                  variant={action.variant || 'glassmorphic'}
                                  size="xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    action.onClick();
                                  }}
                                >
                                  {action.label}
                                </Button>
                              ))}
                            </div>
                          )}

                          {/* Mark as read */}
                          {notification.unread && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="flex-shrink-0 text-white/40 hover:text-white/70"
                            >
                              <Check className="w-4 h-4" />
                            </motion.button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/20">
              <Button variant="glassmorphic" size="sm" fullWidth>
                View All Notifications
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default NotificationBell;