import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  List,
  Filter,
  Search,
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Phone,
  Video,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  ClockIcon,
  ChevronDown,
  ChevronUp,
  Edit2,
  Trash2,
  Plus,
  MoreVertical,
  Activity,
  TrendingUp,
  FileText,
  Share2,
  Printer
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { Avatar } from '../../ui/Avatar';
import { DoctorCard } from '../doctor/DoctorCard';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface AppointmentListProps {
  appointments: Appointment[];
  doctors?: Doctor[];
  variant?: 'glass' | 'gradient' | 'neon';
  showFilters?: boolean;
  showActions?: boolean;
  realTime?: boolean;
  updateInterval?: number;
  onStatusChange?: (id: string, status: Appointment['status']) => void;
  onAppointmentEdit?: (appointment: Appointment) => void;
  onAppointmentDelete?: (id: string) => void;
  onAppointmentShare?: (appointment: Appointment) => void;
  className?: string;
}

// ============================================
// APPOINTMENT LIST COMPONENT
// ============================================
export const AppointmentList: React.FC<AppointmentListProps> = ({
  appointments: initialAppointments,
  doctors = [],
  variant = 'glass',
  showFilters = true,
  showActions = true,
  realTime = false,
  updateInterval = 5000,
  onStatusChange,
  onAppointmentEdit,
  onAppointmentDelete,
  onAppointmentShare,
  className,
}) => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<Appointment['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<Appointment['type'] | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [sortBy, setSortBy] = useState<'date' | 'time' | 'status' | 'priority'>('date');

  // Real-time updates
  useEffect(() => {
    if (!realTime) return;

    const interval = setInterval(() => {
      setAppointments(prev => prev.map(apt => {
        // Randomly update status for demo
        if (Math.random() > 0.95) {
          const statuses: Appointment['status'][] = ['confirmed', 'in-progress', 'completed'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          return { ...apt, status: newStatus };
        }
        return apt;
      }));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [realTime, updateInterval]);

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = !searchQuery || 
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    const matchesType = typeFilter === 'all' || apt.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Sort appointments
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case 'time':
        return a.time.localeCompare(b.time);
      case 'status':
        return a.status.localeCompare(b.status);
      case 'priority':
        return (a.priority || 'low').localeCompare(b.priority || 'low');
      default:
        return 0;
    }
  });

  // Group appointments by date
  const groupedAppointments = sortedAppointments.reduce((acc, apt) => {
    if (!acc[apt.date]) acc[apt.date] = [];
    acc[apt.date].push(apt);
    return acc;
  }, {} as Record<string, Appointment[]>);

  const handleStatusUpdate = (id: string, newStatus: Appointment['status']) => {
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
    onStatusChange?.(id, newStatus);
  };

  const getStatusIcon = (status: Appointment['status']) => {
    const icons = {
      scheduled: ClockIcon,
      confirmed: CheckCircle,
      'in-progress': Activity,
      completed: CheckCircle,
      cancelled: XCircle,
      'no-show': AlertCircle,
    } as const;
    return icons[status];
  };

  const getLocationIcon = (location: Appointment['location']) => {
    const icons = {
      'in-person': MapPin,
      video: Video,
      phone: Phone,
    } as const;
    return icons[location];
  };

  return (
    <motion.div
      className={twMerge(
        clsx(
          'space-y-6',
          className
        )
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Appointment Management</h2>
          <p className="text-white/60">Manage all patient appointments efficiently</p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-white/10 rounded-xl">
            <Button
              variant={viewMode === 'list' ? 'glass' : 'ghost'}
              size="sm"
              iconOnly
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'glass' : 'ghost'}
              size="sm"
              iconOnly
              onClick={() => setViewMode('grid')}
            >
              <Calendar className="w-4 h-4" />
            </Button>
          </div>

          <Button
            variant="gradient"
            size="sm"
            leftIcon={Plus}
            onClick={() => {
              // Create new appointment
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            New Appointment
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <GlassmorphicCard variant={variant} className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              variant="glass"
              placeholder="Search patients or doctors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={Search}
            />

            <Select
              variant="glass"
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'in-progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' },
                { value: 'no-show', label: 'No Show' },
              ]}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as any)}
            />

            <Select
              variant="glass"
              options={[
                { value: 'all', label: 'All Types' },
                { value: 'consultation', label: 'Consultation' },
                { value: 'follow-up', label: 'Follow-up' },
                { value: 'emergency', label: 'Emergency' },
                { value: 'checkup', label: 'Checkup' },
              ]}
              value={typeFilter}
              onChange={(value) => setTypeFilter(value as any)}
            />

            <Select
              variant="glass"
              options={[
                { value: 'date', label: 'Sort by Date' },
                { value: 'time', label: 'Sort by Time' },
                { value: 'status', label: 'Sort by Status' },
                { value: 'priority', label: 'Sort by Priority' },
              ]}
              value={sortBy}
              onChange={(value) => setSortBy(value as any)}
            />
          </div>
        </GlassmorphicCard>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: appointments.length, color: 'blue', icon: Calendar },
          { label: 'Today', value: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length, color: 'green', icon: ClockIcon },
          { label: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length, color: 'cyan', icon: CheckCircle },
          { label: 'Pending', value: appointments.filter(a => a.status === 'scheduled').length, color: 'yellow', icon: AlertCircle },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1, type: 'spring' }}
            whileHover={{ scale: 1.05 }}
          >
            <GlassmorphicCard variant={variant} className="text-center p-4">
              <stat.icon className={clsx('w-6 h-6 mx-auto mb-2', `text-${stat.color}-400`)} />
              <p className="text-2xl font-black text-white mb-1">{stat.value}</p>
              <p className="text-xs text-white/60">{stat.label}</p>
            </GlassmorphicCard>
          </motion.div>
        ))}
      </div>

      {/* Appointments List/Grid */}
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Grouped by Date */}
            {Object.entries(groupedAppointments).map(([date, dateAppointments]) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: 'spring' }}
              >
                <GlassmorphicCard variant={variant}>
                  <div className="p-4 border-b border-white/10">
                    <h3 className="text-lg font-bold text-white">
                      {new Date(date).toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h3>
                    <p className="text-sm text-white/60">
                      {dateAppointments.length} appointment{dateAppointments.length !== 1 ? 's' : ''}
                    </p>
                  </div>

                  <div className="divide-y divide-white/10">
                    {dateAppointments.map((appointment, index) => {
                      const StatusIcon = getStatusIcon(appointment.status);
                      const LocationIcon = getLocationIcon(appointment.location);
                      const doctor = doctors.find(d => d.id === appointment.doctorId);

                      return (
                        <motion.div
                          key={appointment.id}
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.05, type: 'spring' }}
                          className="p-4 hover:bg-white/5 transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4 flex-1">
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                className="flex-shrink-0"
                              >
                                <Avatar
                                  name={appointment.patientName}
                                  size="md"
                                />
                              </motion.div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2">
                                  <p className="text-white font-medium">{appointment.patientName}</p>
                                  {appointment.priority && (
                                    <Badge className={priorityColors[appointment.priority]} size="xs">
                                      {appointment.priority}
                                    </Badge>
                                  )}
                                  <Badge className={statusColors[appointment.status]} size="xs">
                                    <StatusIcon className="w-3 h-3 mr-1" />
                                    {appointment.status}
                                  </Badge>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-white/60 mb-2">
                                  <div className="flex items-center gap-1">
                                    <ClockIcon className="w-3 h-3" />
                                    {appointment.time}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <LocationIcon className="w-3 h-3" />
                                    {appointment.location}
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <Stethoscope className="w-3 h-3" />
                                    {appointment.type}
                                  </div>
                                  {doctor && (
                                    <div className="flex items-center gap-1">
                                      <User className="w-3 h-3" />
                                      {doctor.name}
                                    </div>
                                  )}
                                </div>

                                {appointment.notes && (
                                  <p className="text-xs text-white/70 line-clamp-2">{appointment.notes}</p>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Actions */}
                              {showActions && (
                                <div className="flex items-center gap-1">
                                  <Button
                                    variant="glassmorphic"
                                    size="xs"
                                    iconOnly
                                    onClick={() => onAppointmentEdit?.(appointment)}
                                  >
                                    <Edit2 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="glassmorphic"
                                    size="xs"
                                    iconOnly
                                    onClick={() => onAppointmentShare?.(appointment)}
                                  >
                                    <Share2 className="w-3 h-3" />
                                  </Button>
                                  <Button
                                    variant="danger"
                                    size="xs"
                                    iconOnly
                                    onClick={() => onAppointmentDelete?.(appointment.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}

                              {/* Status Actions */}
                              <div className="flex items-center gap-1">
                                {appointment.status === 'scheduled' && (
                                  <Button
                                    variant="success"
                                    size="xs"
                                    onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                                  >
                                    Confirm
                                  </Button>
                                )}
                                {appointment.status === 'confirmed' && (
                                  <Button
                                    variant="warning"
                                    size="xs"
                                    onClick={() => handleStatusUpdate(appointment.id, 'in-progress')}
                                  >
                                    Start
                                  </Button>
                                )}
                                {appointment.status === 'in-progress' && (
                                  <Button
                                    variant="primary"
                                    size="xs"
                                    onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                                  >
                                    Complete
                                  </Button>
                                )}
                              </div>

                              <Button
                                variant="ghost"
                                size="xs"
                                iconOnly
                                onClick={() => setExpandedId(expandedId === appointment.id ? null : appointment.id)}
                              >
                                <motion.div
                                  animate={{ rotate: expandedId === appointment.id ? 180 : 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </motion.div>
                              </Button>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {expandedId === appointment.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                                className="mt-4 pt-4 border-t border-white/10"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <h5 className="text-white font-medium mb-2">Patient Details</h5>
                                    <div className="space-y-1 text-white/70">
                                      <p>Contact: {appointment.contact || 'Not provided'}</p>
                                      <p>Insurance: Active</p>
                                      <p>Last Visit: 2 weeks ago</p>
                                    </div>
                                  </div>
                                  <div>
                                    <h5 className="text-white font-medium mb-2">Appointment Details</h5>
                                    <div className="space-y-1 text-white/70">
                                      <p>Duration: 30 minutes</p>
                                      <p>Room: 302</p>
                                      <p>Equipment: Standard</p>
                                    </div>
                                  </div>
                                </div>

                                {appointment.notes && (
                                  <div className="mt-4">
                                    <h5 className="text-white font-medium mb-2">Notes</h5>
                                    <p className="text-sm text-white/70">{appointment.notes}</p>
                                  </div>
                                )}

                                <div className="mt-4 flex justify-end gap-2">
                                  <Button
                                    variant="glassmorphic"
                                    size="xs"
                                    leftIcon={Printer}
                                    onClick={() => {
                                      // Print appointment details
                                    }}
                                  >
                                    Print
                                  </Button>
                                  <Button
                                    variant="neon"
                                    size="xs"
                                    leftIcon={Activity}
                                    onClick={() => {
                                      // View medical history
                                    }}
                                  >
                                    Medical History
                                  </Button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </GlassmorphicCard>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {sortedAppointments.map((appointment, index) => {
              const doctor = doctors.find(d => d.id === appointment.doctorId);
              const StatusIcon = getStatusIcon(appointment.status);

              return (
                <motion.div
                  key={appointment.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.05, type: 'spring' }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  <GlassmorphicCard
                    variant={variant}
                    className="p-0 overflow-hidden cursor-pointer"
                    onClick={() => onAppointmentClick?.(appointment)}
                  >
                    {/* Header */}
                    <div className="p-4 bg-gradient-to-r from-white/10 to-transparent border-b border-white/10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Avatar name={appointment.patientName} size="md" />
                          <div>
                            <p className="text-white font-medium">{appointment.patientName}</p>
                            <p className="text-xs text-white/60">{appointment.date} at {appointment.time}</p>
                          </div>
                        </div>
                        <Badge className={statusColors[appointment.status]} size="xs">
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {appointment.status}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="outline" size="xs">
                          {appointment.type}
                        </Badge>
                        {appointment.priority && (
                          <Badge className={priorityColors[appointment.priority]} size="xs">
                            {appointment.priority}
                          </Badge>
                        )}
                        {React.createElement(locationIcons[appointment.location as keyof typeof locationIcons], {
                          className: 'w-3 h-3 text-white/60 ml-auto'
                        })}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {doctor && (
                        <div className="flex items-center gap-2 mb-3">
                          <Avatar name={doctor.name} size="sm" />
                          <div>
                            <p className="text-sm text-white font-medium">{doctor.name}</p>
                            <p className="text-xs text-white/60">{doctor.specialty}</p>
                          </div>
                        </div>
                      )}

                      {appointment.notes && (
                        <p className="text-sm text-white/70 mb-4 line-clamp-2">{appointment.notes}</p>
                      )}

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-white/10">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="glassmorphic"
                            size="xs"
                            iconOnly
                            onClick={(e) => {
                              e.stopPropagation();
                              onAppointmentEdit?.(appointment);
                            }}
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="glassmorphic"
                            size="xs"
                            iconOnly
                            onClick={(e) => {
                              e.stopPropagation();
                              onAppointmentShare?.(appointment);
                            }}
                          >
                            <Share2 className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="flex items-center gap-2">
                          {appointment.status === 'scheduled' && (
                            <Button
                              variant="success"
                              size="xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusUpdate(appointment.id, 'confirmed');
                              }}
                            >
                              Confirm
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="xs"
                            iconOnly
                            onClick={(e) => {
                              e.stopPropagation();
                              onAppointmentDelete?.(appointment.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3 text-red-400" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </GlassmorphicCard>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {sortedAppointments.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-white mb-2">No Appointments Found</h3>
          <p className="text-white/60 mb-6">
            {searchQuery || statusFilter !== 'all' || typeFilter !== 'all' 
              ? 'No appointments match your filters' 
              : 'No appointments scheduled yet'}
          </p>
          <Button
            variant="gradient"
            size="lg"
            leftIcon={Plus}
            onClick={() => {
              // Create first appointment
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Schedule First Appointment
          </Button>
        </motion.div>
      )}
    </motion.div>
  );
};