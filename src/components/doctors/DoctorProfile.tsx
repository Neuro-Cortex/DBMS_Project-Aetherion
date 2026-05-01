import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Star, 
  MapPin, 
  DollarSign, 
  Calendar,
  Clock,
  Phone,
  Video,
  MessageSquare,
  Award,
  BookOpen,
  Briefcase,
  Heart,
  Shield,
  Globe,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Printer,
  Edit2
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Avatar } from '../../ui/Avatar';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Tabs } from '../../ui/Tabs';
import { ActivityChart } from '../dashboard/ActivityChart';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface DoctorProfileProps {
  doctor: Doctor;
  variant?: 'glass' | 'gradient' | 'neon';
  onBookAppointment?: () => void;
  onContact?: (method: 'call' | 'video' | 'message') => void;
  onShare?: () => void;
  onPrint?: () => void;
  className?: string;
}

// ============================================
// REVIEW INTERFACE
// ============================================
interface Review {
  id: string;
  patient: {
    name: string;
    avatar?: string;
  };
  rating: number;
  date: string;
  comment: string;
  helpful: number;
}

// ============================================
// DOCTOR PROFILE COMPONENT
// ============================================
export const DoctorProfile: React.FC<DoctorProfileProps> = ({
  doctor,
  variant = 'glass',
  onBookAppointment,
  onContact,
  onShare,
  onPrint,
  className,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Sample reviews
  const reviews: Review[] = [
    {
      id: '1',
      patient: { name: 'Sarah Johnson' },
      rating: 5,
      date: '2024-01-15',
      comment: 'Dr. Johnson is an exceptional cardiologist. He explained my condition in detail and provided a comprehensive treatment plan.',
      helpful: 24,
    },
    {
      id: '2',
      patient: { name: 'Mike Chen' },
      rating: 5,
      date: '2024-01-10',
      comment: 'Very professional and caring. The staff was also very helpful.',
      helpful: 18,
    },
    {
      id: '3',
      patient: { name: 'Emily Davis' },
      rating: 4,
      date: '2024-01-05',
      comment: 'Good experience overall. Waiting time was a bit long but the consultation was thorough.',
      helpful: 12,
    },
  ];

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'availability', label: 'Availability', icon: Calendar },
  ];

  return (
    <motion.div
      className={twMerge(
        clsx(
          'max-w-6xl mx-auto p-6 space-y-6',
          className
        )
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header Card */}
      <GlassmorphicCard variant={variant}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Doctor Info */}
          <div className="flex items-start gap-6 flex-1">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 3 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Avatar
                src={!imageError ? doctor.avatar : undefined}
                name={doctor.name}
                size="xl"
                onError={() => setImageError(true)}
                className="border-4 border-cyan-400 shadow-lg shadow-cyan-500/30"
              />
              {doctor.verified && (
                <motion.div
                  className="absolute -bottom-2 -right-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                >
                  <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800">
                    <Shield className="w-4 h-4 text-white" />
                  </div>
                </motion.div>
              )}
            </motion.div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <motion.h1 
                    className="text-3xl font-black text-white mb-2"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {doctor.name}
                  </motion.h1>
                  <p className="text-lg text-white/80 mb-2">{doctor.title}</p>
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="gradient" size="sm">
                      {doctor.specialty}
                    </Badge>
                    {doctor.premium && (
                      <Badge variant="gradient" size="xs">
                        PREMIUM
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="glassmorphic"
                    size="sm"
                    iconOnly
                    onClick={onShare}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="glassmorphic"
                    size="sm"
                    iconOnly
                    onClick={onPrint}
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <Printer className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="glassmorphic"
                    size="sm"
                    iconOnly
                    whileHover={{ scale: 1.1, rotate: 180 }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="text-center p-3 bg-white/5 rounded-xl"
                >
                  <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{doctor.rating}</p>
                  <p className="text-xs text-white/60">Rating</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="text-center p-3 bg-white/5 rounded-xl"
                >
                  <Users className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{doctor.reviewCount}</p>
                  <p className="text-xs text-white/60">Reviews</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="text-center p-3 bg-white/5 rounded-xl"
                >
                  <Award className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">{doctor.experience}</p>
                  <p className="text-xs text-white/60">Years Exp.</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="text-center p-3 bg-white/5 rounded-xl"
                >
                  <DollarSign className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-white">${doctor.price}</p>
                  <p className="text-xs text-white/60">Per Visit</p>
                </motion.div>
              </div>

              {/* Contact Actions */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="gradient"
                  size="lg"
                  leftIcon={Calendar}
                  onClick={onBookAppointment}
                  className="flex-1"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Book Appointment
                </Button>
                <Button
                  variant="neon"
                  size="lg"
                  leftIcon={Phone}
                  onClick={() => onContact?.('call')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Call Now
                </Button>
                <Button
                  variant="glassmorphic"
                  size="lg"
                  leftIcon={Video}
                  onClick={() => onContact?.('video')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Video Call
                </Button>
                <Button
                  variant="glassmorphic"
                  size="lg"
                  leftIcon={MessageSquare}
                  onClick={() => onContact?.('message')}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Message
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="lg:w-80 space-y-4">
            {/* Availability */}
            <GlassmorphicCard variant="glass">
              <h3 className="text-lg font-bold text-white mb-3">Next Available</h3>
              <p className="text-2xl font-black text-cyan-400 mb-2">{doctor.nextAvailable}</p>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/60">Available Slots</span>
                <Badge variant="success" size="sm">
                  {doctor.availableSlots} slots
                </Badge>
              </div>
              <Button variant="glassmorphic" size="sm" fullWidth>
                View Full Schedule
              </Button>
            </GlassmorphicCard>

            {/* Languages */}
            <GlassmorphicCard variant="glass">
              <h3 className="text-lg 