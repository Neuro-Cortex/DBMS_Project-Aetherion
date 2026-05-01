import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Ambulance,
  Phone,
  Heart,
  Shield,
  AlertTriangle,
  Clock,
  MapPin,
  Navigation,
  Users,
  Activity,
  TrendingUp,
  Bell,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
  Send,
  MessageSquare,
  Camera,
  FileText
} from 'lucide-react';
import { clsx } from 'clsx';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { StatCard } from '../dashboard/StatCard';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface EmergencyService {
  id: string;
  name: string;
  type: 'ambulance' | 'blood' | 'oxygen' | 'doctor' | 'emergency-room';
  status: 'available' | 'busy' | 'critical' | 'dispatched';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  eta?: number;
  provider: string;
  phone: string;
  capacity?: number;
  currentLoad?: number;
}

export interface EmergencyRequest {
  id: string;
  type: 'ambulance' | 'blood' | 'oxygen' | 'doctor';
  priority: 'low' | 'medium' | 'high' | 'critical';
  location: string;
  patientCondition: string;
  contact: string;
  status: 'pending' | 'dispatched' | 'completed' | 'cancelled';
  timestamp: string;
  estimatedTime?: number;
}

export interface EmergencyServicesProps {
  services: EmergencyService[];
  variant?: 'glass' | 'gradient' | 'neon';
  onRequestService?: (request: Omit<EmergencyRequest, 'id' | 'timestamp' | 'status'>) => void;
  onTrackAmbulance?: (id: string) => void;
  onSendAlert?: (message: string) => void;
  className?: string;
}

// ============================================
// SERVICE TYPE CONFIG
// ============================================
const serviceConfig = {
  ambulance: {
    icon: Ambulance,
    color: 'red',
    label: 'Ambulance',
    critical: true,
  },
  blood: {
    icon: Heart,
    color: 'pink',
    label: 'Blood Bank',
    critical: true,
  },
  oxygen: {
    icon: Shield,
    color: 'cyan',
    label: 'Oxygen Supply',
    critical: true,
  },
  doctor: {
    icon: Users,
    color: 'blue',
    label: 'Emergency Doctor',
    critical: false,
  },
  'emergency-room': {
    icon: Activity,
    color: 'orange',
    label: 'Emergency Room',
    critical: true,
  },
} as const;

// ============================================
// EMERGENCY SERVICES COMPONENT
// ============================================
export const EmergencyServices: React.FC<EmergencyServicesProps> = ({
  services: initialServices,
  variant = 'glass',
  onRequestService,
  onTrackAmbulance,
  onSendAlert,
  className,
}) => {
  const [services, setServices] = useState(initialServices);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState<Partial<EmergencyRequest>>({
    type: 'ambulance',
    priority: 'medium',
    location: '',
    patientCondition: '',
    contact: '',
  });
  const [selectedService, setSelectedService] = useState<string | null>(null);

  // Simulate incoming requests
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.8) {
        const mockRequest: EmergencyRequest = {
          id: Date.now().toString(),
          type: ['ambulance', 'blood', 'oxygen', 'doctor'][Math.floor(Math.random() * 4)] as EmergencyRequest['type'],
          priority: ['low', 'medium', 'high', 'critical'][Math.floor(Math.random() * 4)] as EmergencyRequest['priority'],
          location: `Location ${Math.floor(Math.random() * 100)}`,
          patientCondition: 'Emergency case',
          contact: `+1 (555) ${Math.floor(Math.random() * 9000) + 1000}`,
          status: 'pending',
          timestamp: new Date().toISOString(),
          estimatedTime: Math.floor(Math.random() * 30) + 5,
        };
        setRequests(prev => [mockRequest, ...prev].slice(0, 10));
      }
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const statusColors = {
    available: 'bg-green-500/10 text-green-300 border-green-500/30',
    busy: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    critical: 'bg-red-500/10 text-red-300 border-red-500/30',
    dispatched: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  } as const;

  const priorityColors = {
    low: 'bg-gray-500/10 text-gray-300 border-gray-500/30',
    medium: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
    high: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    critical: 'bg-red-500/10 text-red-300 border-red-500/30',
  } as const;

  const handleSendRequest = () => {
    if (newRequest.type && newRequest.location && newRequest.contact) {
      const request: Omit<EmergencyRequest, 'id' | 'timestamp' | 'status'> = {
        type: newRequest.type as EmergencyRequest['type'],
        priority: newRequest.priority as EmergencyRequest['priority'],
        location: newRequest.location,
        patientCondition: newRequest.patientCondition || '',
        contact: newRequest.contact,
        estimatedTime: Math.floor(Math.random() * 20) + 5,
      };
      onRequestService?.(request);
      
      const fullRequest: EmergencyRequest = {
        ...request,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        status: 'pending',
      };
      setRequests(prev => [fullRequest, ...prev]);
      setShowRequestForm(false);
      setNewRequest({});
    }
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Emergency Services</h2>
          <p className="text-white/60">24/7 emergency response and management</p>
        </div>
        <Button
          variant="gradient"
          size="sm"
          leftIcon={Plus}
          onClick={() => setShowRequestForm(!showRequestForm)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Emergency Request
        </Button>
      </div>

      {/* Emergency Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Active Requests"
          value={requests.filter(r => r.status === 'pending' || r.status === 'dispatched').length}
          icon={AlertTriangle}
          variant="neon"
          color="red"
        />
        <StatCard
          title="Available Units"
          value={services.filter(s => s.status === 'available').length}
          icon={CheckCircle}
          variant="neon"
          color="green"
        />
        <StatCard
          title="Avg Response"
          value="8 min"
          icon={Clock}
          variant="neon"
          color="blue"
        />
        <StatCard
          title="Success Rate"
          value="98%"
          icon={TrendingUp}
          variant="neon"
          color="purple"
        />
      </div>

      {/* Emergency Request Form */}
      <AnimatePresence>
        {showRequestForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <GlassmorphicCard variant={variant} className="p-6">
              <h3 className="text-lg font-bold text-white mb-4">Emergency Service Request</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <select
                  value={newRequest.type || 'ambulance'}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, type: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="ambulance">Ambulance</option>
                  <option value="blood">Blood Bank</option>
                  <option value="oxygen">Oxygen Supply</option>
                  <option value="doctor">Emergency Doctor</option>
                </select>

                <select
                  value={newRequest.priority || 'medium'}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, priority: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="critical">Critical</option>
                </select>

                <input
                  type="text"
                  placeholder="Location/Address"
                  value={newRequest.location || ''}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, location: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <input
                  type="tel"
                  placeholder="Contact Number"
                  value={newRequest.contact || ''}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, contact: e.target.value }))}
                  className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500"
                />

                <textarea
                  placeholder="Patient Condition (Optional)"
                  value={newRequest.patientCondition || ''}
                  onChange={(e) => setNewRequest(prev => ({ ...prev, patientCondition: e.target.value }))}
                  className="md:col-span-2 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="glassmorphic"
                  size="sm"
                  onClick={() => setShowRequestForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={Send}
                  onClick={handleSendRequest}
                  disabled={!newRequest.location || !newRequest.contact}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Emergency Request
                </Button>
              </div>
            </GlassmorphicCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const config = serviceConfig[service.type as keyof typeof serviceConfig];
          const Icon = config.icon;
          
          return (
            <motion.div
              key={service.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <GlassmorphicCard
                variant={variant}
                className={clsx(
                  'p-6 cursor-pointer transition-all',
                  selectedService === service.id && 'border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/20'
                )}
                onClick={() => setSelectedService(service.id)}
              >
                {/* Status Indicator */}
                <motion.div
                  className="absolute top-4 right-4"
                  animate={
                    service.status === 'available'
                      ? { scale: [1, 1.2, 1] }
                      : service.status === 'critical'
                      ? { scale: [1, 0.8, 1] }
                      : {}
                  }
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Badge className={statusColors[service.status]} size="xs">
                    {service.status}
                  </Badge>
                </motion.div>

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={clsx(
                      'p-3 rounded-xl',
                      `bg-${config.color}-500/10`,
                      `text-${config.color}-300`
                    )}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.div>
                  <div className="text-right">
                    {service.capacity && service.currentLoad !== undefined && (
                      <Badge variant="outline" size="xs">
                        {service.currentLoad}/{service.capacity}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Info */}
                <h3 className="text-lg font-bold text-white mb-1">{service.name}</h3>
                <p className="text-xs text-white/60 mb-3">{config.label}</p>

                <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{service.location.address}</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-white/70 mb-3">
                  <Phone className="w-4 h-4" />
                  <span>{service.phone}</span>
                </div>

                {service.eta && (
                  <div className="flex items-center gap-2 text-sm text-cyan-400 mb-3">
                    <Clock className="w-4 h-4" />
                    <span>ETA: {service.eta} min</span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/60">Provider: {service.provider}</span>
                  {service.type === 'ambulance' && (
                    <Button
                      variant="neon"
                      size="xs"
                      leftIcon={Navigation}
                      onClick={(e) => {
                        e.stopPropagation();
                        onTrackAmbulance?.(service.id);
                      }}
                    >
                      Track
                    </Button>
                  )}
                </div>
              </GlassmorphicCard>
            </motion.div>
          );
        })}
      </div>

      {/* Active Emergency Requests */}
      {requests.length > 0 && (
        <GlassmorphicCard variant={variant}>
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-red-400" />
            Active Emergency Requests
          </h3>
          <div className="space-y-3">
            <AnimatePresence>
              {requests.map((request, i) => {
                const config = serviceConfig[request.type as keyof typeof serviceConfig];
                const Icon = config.icon;
                
                return (
                  <motion.div
                    key={request.id}
                    layout
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: i * 0.05, type: 'spring' }}
                    className={clsx(
                      'flex items-center justify-between p-4 rounded-xl',
                      'bg-white/5 hover:bg-white/10 transition-all',
                      'border border-white/10 hover:border-white/20',
                      request.priority === 'critical' && 'border-l-4 border-l-red-500'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <Icon className={clsx('w-5 h-5', `text-${config.color}-400`)} />
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-white font-medium capitalize">{request.type} Request</p>
                          <Badge className={priorityColors[request.priority]} size="xs">
                            {request.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-white/70">{request.location}</p>
                        <p className="text-xs text-white/60">Contact: {request.contact}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {request.estimatedTime && (
                        <Badge variant="outline" size="xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {request.estimatedTime} min
                        </Badge>
                      )}
                      <Button
                        variant="success"
                        size="xs"
                        onClick={() => {
                          setRequests(prev => prev.map(r => 
                            r.id === request.id ? { ...r, status: 'dispatched' } : r
                          ));
                        }}
                      >
                        Dispatch
                      </Button>
                      <Button
                        variant="danger"
                        size="xs"
                        iconOnly
                        onClick={() => {
                          setRequests(prev => prev.filter(r => r.id !== request.id));
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </GlassmorphicCard>
      )}

      {/* Emergency Alert System */}
      <div className="flex items-center gap-3">
        <Button
          variant="danger"
          size="lg"
          fullWidth
          leftIcon={Bell}
          onClick={() => {
            const alert = `🚨 HOSPITAL EMERGENCY ALERT: Code Red activated. All emergency personnel report to stations immediately.`;
            onSendAlert?.(alert);
          }}
          className="animate-pulse"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Hospital Emergency Alert
        </Button>
        <Button
          variant="warning"
          size="lg"
          fullWidth
          leftIcon={MessageSquare}
          onClick={() => {
            const alert = `📢 MASS CASUALTY INCIDENT: Prepare for multiple incoming patients. Activate triage protocol.`;
            onSendAlert?.(alert);
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Mass Casualty Alert
        </Button>
      </div>
    </motion.div>
  );
};