import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Phone,
  Video,
  MessageSquare,
  MoreVertical,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Avatar } from '../ui/Avatar';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface Appointment {
  id: string;
  patient: {
    name: string;
    avatar?: string;
    phone: string;
  };
  doctor: {
    name: string;
    specialty: string;
    avatar?: string;
  };
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
  location?: string;
  notes?: string;
  urgent?: boolean;
}

export interface RecentAppointmentsProps {
  appointments?: Appointment[];
  limit?: number;
  realTime?: boolean;
  updateInterval?: number;
  showActions?: boolean;
  onStatusChange?: (id: string, status: Appointment['status']) => void;
  className?: string;
}

// ============================================
// STATUS STYLES
// ============================================
const statusStyles = {
  scheduled: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  confirmed: 'bg-green-500/10 text-green-300 border-green-500/30',
  'in-progress': 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
  completed: 'bg-gray-500/10 text-gray-300 border-gray-500/30',
  cancelled: 'bg-red-500/10 text-red-300 border-red-500/30',
};

const statusIcons = {
  scheduled: Calendar,
  confirmed: CheckCircle,
  'in-progress': AlertCircle,
  completed: CheckCircle,
  cancelled: XCircle,
};

// ============================================
// RECENT APPOINTMENTS COMPONENT
// ============================================
export const RecentAppointments: React.FC<RecentAppointmentsProps> = ({
  appointments: initialAppointments = [],
  limit = 5,
  realTime = false,
  updateInterval = 10000,
  showActions = true,
  onStatusChange,
  className,
}) => {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [loading, setLoading] = useState(false);

  // Simulate real-time updates
  useEffect(() => {
    if (!realTime) return;

    const interval = setInterval(() => {
      // Add new appointment
      if (Math.random() > 0.7) {
        const newAppointment: Appointment = {
          id: Date.now().toString(),
          patient: {
            name: `Patient ${Math.floor(Math.random() * 1000)}`,
            phone: `+1 (555) ${Math.floor(Math.random() * 9000) + 1000}`,
          },
          doctor: {
            name: `Dr. ${['Smith', 'Johnson', 'Williams', 'Brown'][Math.floor(Math.random() * 4)]}`,
            specialty: ['Cardiology', 'Neurology', 'Pediatrics', 'Surgery'][Math.floor(Math.random() * 4)],
          },
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: ['in-person', 'video', 'phone'][Math.floor(Math.random() * 3)] as Appointment['type'],
          status: 'scheduled',
          urgent: Math.random() > 0.8,
        };
        
        setAppointments(prev => [newAppointment, ...prev].slice(0, limit));
      }

      // Update existing appointment status
      setAppointments(prev => prev.map(apt => {
        if (Math.random() > 0.95 && apt.status === 'scheduled') {
          return { ...apt, status: 'confirmed' };
        }
        return apt;
      }));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [realTime, updateInterval, limit]);

  // Handle status change
  const handleStatusChange = (id: string, status: Appointment['status']) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    ));
    onStatusChange?.(id, status);
  };

  // Format time
  const formatTime = (time: string) => {
    const date = new Date(`2024-01-01 ${time}`);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <motion.div
      className={twMerge(
        clsx(
          'p-6 rounded-2xl',
          'bg-white/10 dark:bg-gray-900/10',
          'backdrop-blur-xl backdrop-saturate-150',
          'border border-white/20 dark:border-gray-700/20',
          'shadow-2xl',
          className
        )
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">Recent Appointments</h3>
          <p className="text-sm text-white/60">Latest patient appointments</p>
        </div>
        <Button variant="glassmorphic" size="sm">
          View All
        </Button>
      </div>

      {/* List */}
      <div className="space-y-3">
        <AnimatePresence>
          {appointments.slice(0, limit).map((appointment, index) => {
            const StatusIcon = statusIcons[appointment.status];
            
            return (
              <motion.div
                key={appointment.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ 
                  delay: index * 0.05,
                  type: 'spring',
                  stiffness: 300,
                  damping: 25
                }}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                }}
                className={clsx(
                  'relative p-4 rounded-xl',
                  'bg-white/5 hover:bg-white/10 transition-all',
                  'border border-white/10 hover:border-white/20',
                  appointment.urgent && 'border-l-4 border-l-red-500'
                )}
              >
                {/* Urgent Badge */}
                {appointment.urgent && (
                  <Badge 
                    variant="danger" 
                    size="xs" 
                    className="absolute top-2 right-2 animate-pulse"
                  >
                    Urgent
                  </Badge>
                )}

                <div className="flex items-start gap-4">
                  {/* Patient Avatar */}
                  <Avatar 
                    name={appointment.patient.name} 
                    size="md"
                    className="flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold text-white truncate">
                          {appointment.patient.name}
                        </p>
                        <p className="text-xs text-white/60">
                          {appointment.doctor.name} • {appointment.doctor.specialty}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Status */}
                        <Badge 
                          variant="outline" 
                          size="xs" 
                          className={statusStyles[appointment.status]}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {appointment.status}
                        </Badge>
                        
                        {/* Type Icon */}
                        {appointment.type === 'video' && <Video className="w-4 h-4 text-blue-400" />}
                        {appointment.type === 'phone' && <Phone className="w-4 h-4 text-green-400" />}
                        {appointment.type === 'in-person' && <MapPin className="w-4 h-4 text-purple-400" />}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex items-center gap-4 text-xs text-white/60">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {appointment.date}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatTime(appointment.time)}
                      </div>
                      {appointment.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {appointment.location}
                        </div>
                      )}
                    </div>

                    {/* Notes */}
                    {appointment.notes && (
                      <p className="text-xs text-white/50 mt-2 italic">
                        {appointment.notes}
                      </p>
                    )}

                    {/* Actions */}
                    {showActions && appointment.status === 'scheduled' && (
                      <div className="flex items-center gap-2 mt-3">
                        <Button
                          variant="success"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(appointment.id, 'confirmed');
                          }}
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Confirm
                        </Button>
                        <Button
                          variant="danger"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(appointment.id, 'cancelled');
                          }}
                        >
                          <XCircle className="w-3 h-3 mr-1" />
                          Cancel
                        </Button>
                        <Button
                          variant="glassmorphic"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            // Open details modal
                          }}
                        >
                          <MoreVertical className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Loading */}
      {loading && (
        <div className="mt-6 text-center">
          <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-2" />
          <p className="text-white/60">Loading appointments...</p>
        </div>
      )}
    </motion.div>
  );
};