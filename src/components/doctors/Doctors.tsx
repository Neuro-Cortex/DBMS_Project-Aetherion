// src/pages/DoctorProfile.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Star, MapPin, Phone, Mail, Calendar, Clock, Award, 
  Shield, BookOpen, Users, Heart, Share2, Flag, 
  ChevronLeft, ChevronRight, CheckCircle, AlertCircle,
  Video, MessageCircle, ThumbsUp, TrendingUp, Activity
} from 'lucide-react';
import { DoctorCard } from 'src/components/doctors/DoctorCard';
import { DoctorSchedule } from 'src/components/doctors/DoctorSchdule';
import { BookingForm } from 'src/components/doctors/BookingForm';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { GlassmorphicCard } from '../components/ui/GlassmorphicCard';
import { Avatar } from '../components/ui/Avatar';
import { Tabs } from 'src/components/ui/Tab';

// ============================================
// TYPES
// ============================================

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  image?: string;
  availability: string;
  fee: number;
  languages: string[];
  location: string;
  hospital: string;
  verified: boolean;
  specialties: string[];
  education: string;
  reviewsCount: number;
  nextSlot: string;
  bio: string;
  achievements?: string[];
  certifications?: string[];
  consultationModes?: ('in-person' | 'video' | 'phone')[];
}

interface Review {
  id: string;
  patientName: string;
  patientAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
}

// ============================================
// MOCK DATA
// ============================================

const doctorData: Doctor = {
  id: '1',
  name: 'Dr. Sarah Wilson',
  specialty: 'Cardiologist',
  rating: 4.9,
  experience: 15,
  image: 'https://randomuser.me/api/portraits/women/1.jpg',
  availability: 'Available Today',
  fee: 120,
  languages: ['English', 'Spanish'],
  location: 'New York, NY',
  hospital: 'Mount Sinai Hospital',
  verified: true,
  specialties: ['Cardiology', 'Interventional Cardiology', 'Heart Failure'],
  education: 'MD - Harvard Medical School, Fellowship in Cardiology - Mayo Clinic',
  reviewsCount: 524,
  nextSlot: '10:00 AM',
  bio: 'Dr. Sarah Wilson is a board-certified cardiologist with over 15 years of experience in treating complex heart conditions. She specializes in preventive cardiology, heart failure management, and interventional procedures. Dr. Wilson is known for her compassionate approach and dedication to patient education.',
  achievements: [
    'Top Cardiologist Award 2023',
    'Patient Choice Award 2022',
    'Research Excellence in Cardiology'
  ],
  certifications: [
    'American Board of Internal Medicine',
    'Board Certified in Cardiovascular Disease',
    'Advanced Cardiac Life Support'
  ],
  consultationModes: ['in-person', 'video', 'phone'],
};

const reviews: Review[] = [
  {
    id: '1',
    patientName: 'John Doe',
    patientAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    rating: 5,
    comment: 'Excellent doctor! Very knowledgeable and caring. She explained everything clearly and took time to answer all my questions.',
    date: '2024-03-15',
    helpful: 45,
    verified: true,
  },
  {
    id: '2',
    patientName: 'Jane Smith',
    patientAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    rating: 5,
    comment: 'Dr. Wilson saved my life! She diagnosed my heart condition early and provided excellent treatment. Highly recommend!',
    date: '2024-03-10',
    helpful: 32,
    verified: true,
  },
  {
    id: '3',
    patientName: 'Robert Johnson',
    patientAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
    rating: 4,
    comment: 'Very professional and thorough. Wait time was a bit long but worth it.',
    date: '2024-03-05',
    helpful: 28,
    verified: true,
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const DoctorProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState<Doctor>(doctorData);
  const [activeTab, setActiveTab] = useState('about');
  const [showBooking, setShowBooking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch doctor data based on id
    window.scrollTo(0, 0);
  }, [id]);

  const tabs = [
    { id: 'about', label: 'About', icon: BookOpen },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'reviews', label: 'Reviews', icon: Star },
    { id: 'location', label: 'Location', icon: MapPin },
  ];

  const getConsultationModeIcon = (mode: string) => {
    switch (mode) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'phone': return <MessageCircle className="w-4 h-4" />;
      default: return <MapPin className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => navigate('/doctors')}
          className="flex items-center gap-2 text-white/60 hover:text-white transition mb-4"
        >
          <ChevronLeft className="w-5 h-5" />
          Back to Doctors
        </button>

        {/* Doctor Profile Header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Doctor Info */}
          <div className="lg:col-span-2 space-y-6">
           

          <GlassmorphicCard variant="glass" className="overflow-hidden">
              {/* Doctor Info */}
              
              
              <div className="p-6">
                <AnimatePresence mode="wait">
                  {activeTab === 'about' && (
                    <motion.div
                      key="about"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Bio */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Biography</h3>
                        <p className="text-white/70 leading-relaxed">{doctor.bio}</p>
                      </div>

                      {/* Specialties */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                          {doctor.specialties.map((specialty, i) => (
                            <Badge key={i} variant="primary" size="sm">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-3">Education & Training</h3>
                        <p className="text-white/70">{doctor.education}</p>
                      </div>

                      {/* Achievements */}
                      {doctor.achievements && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Achievements</h3>
                          <div className="space-y-2">
                            {doctor.achievements.map((achievement, i) => (
                              <div key={i} className="flex items-center gap-2 text-white/70">
                                <Award className="w-4 h-4 text-yellow-400" />
                                <span>{achievement}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Certifications */}
                      {doctor.certifications && (
                        <div>
                          <h3 className="text-lg font-semibold text-white mb-3">Certifications</h3>
                          <div className="space-y-2">
                            {doctor.certifications.map((cert, i) => (
                              <div key={i} className="flex items-center gap-2 text-white/70">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span>{cert}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'schedule' && (
                    <motion.div
                      key="schedule"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                    </motion.div>
                  )}

                  {activeTab === 'reviews' && (
                    <motion.div
                      key="reviews"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-6"
                    >
                      {/* Rating Summary */}
                      <div className="flex items-center gap-6 p-4 bg-white/5 rounded-xl">
                        <div className="text-center">
                          <div className="text-4xl font-bold text-white">{doctor.rating}</div>
                          <div className="flex gap-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < Math.floor(doctor.rating) ? 'text-yellow-400 fill-current' : 'text-white/20'}`} />
                            ))}
                          </div>
                          <p className="text-white/60 text-sm mt-1">{doctor.reviewsCount} reviews</p>
                        </div>
                        <div className="flex-1 space-y-2">
                          {[5, 4, 3, 2, 1].map(rating => {
                            const count = reviews.filter(r => r.rating === rating).length;
                            const percentage = (count / reviews.length) * 100;
                            return (
                              <div key={rating} className="flex items-center gap-2">
                                <span className="text-white/60 text-sm w-8">{rating}★</span>
                                <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden">
                                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${percentage}%` }} />
                                </div>
                                <span className="text-white/40 text-xs">{count}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Reviews List */}
                      <div className="space-y-4">
                        {reviews.map((review, i) => (
                          <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-4 bg-white/5 rounded-xl"
                          >
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <Avatar name={review.patientName} size="sm" />
                                <div>
                                  <p className="text-white font-medium">{review.patientName}</p>
                                  <div className="flex items-center gap-2">
                                    <div className="flex gap-0.5">
                                      {[...Array(5)].map((_, j) => (
                                        <Star key={j} className={`w-3 h-3 ${j < review.rating ? 'text-yellow-400 fill-current' : 'text-white/20'}`} />
                                      ))}
                                    </div>
                                    <span className="text-white/40 text-xs">{new Date(review.date).toLocaleDateString()}</span>
                                  </div>
                                </div>
                              </div>
                              {review.verified && (
                                <Badge variant="success" size="xs">Verified Patient</Badge>
                              )}
                            </div>
                            <p className="text-white/70 text-sm mb-3">{review.comment}</p>
                            <button className="flex items-center gap-1 text-white/40 text-xs hover:text-white/60 transition">
                              <ThumbsUp className="w-3 h-3" />
                              Helpful ({review.helpful})
                            </button>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'location' && (
                    <motion.div
                      key="location"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="space-y-4"
                    >
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-5 h-5 text-cyan-400" />
                          <h3 className="text-white font-semibold">Hospital Location</h3>
                        </div>
                        <p className="text-white/70">{doctor.hospital}</p>
                        <p className="text-white/50 text-sm mt-1">{doctor.location}</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Phone className="w-5 h-5 text-cyan-400" />
                          <h3 className="text-white font-semibold">Contact Information</h3>
                        </div>
                        <p className="text-white/70">+1 (555) 123-4567</p>
                        <p className="text-white/50 text-sm">appointments@medicare.com</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Clock className="w-5 h-5 text-cyan-400" />
                          <h3 className="text-white font-semibold">Office Hours</h3>
                        </div>
                        <div className="space-y-1">
                          <p className="text-white/70">Monday - Friday: 9:00 AM - 6:00 PM</p>
                          <p className="text-white/70">Saturday: 10:00 AM - 2:00 PM</p>
                          <p className="text-white/70">Sunday: Closed</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </GlassmorphicCard>
          </div>

          {/* Right Column - Booking & Quick Info */}
          <div className="space-y-6">
            {/* Consultation Modes */}
            {doctor.consultationModes && (
              <GlassmorphicCard variant="glass" className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Consultation Modes</h3>
                <div className="space-y-3">
                  {doctor.consultationModes.map((mode, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div className="flex items-center gap-3">
                        {getConsultationModeIcon(mode)}
                        <span className="text-white capitalize">{mode}</span>
                      </div>
                      <Badge variant={mode === 'video' ? 'gradient' : 'secondary'} size="xs">
                        {mode === 'video' ? 'Recommended' : 'Available'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            )}

            {/* Fee Information */}
            <GlassmorphicCard variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Consultation Fee</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-white">${doctor.fee}</div>
                <p className="text-white/60 text-sm">per consultation</p>
                <div className="mt-3 text-white/50 text-xs">
                  <p>✓ Insurance accepted</p>
                  <p>✓ Online payment available</p>
                  <p>✓ Free follow-up within 7 days</p>
                </div>
              </div>
            </GlassmorphicCard>

            {/* Next Available Slot */}
            <GlassmorphicCard variant="glass" className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Next Available</h3>
              <div className="flex items-center gap-3 p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20">
                <Calendar className="w-8 h-8 text-cyan-400" />
                <div>
                  <p className="text-white font-semibold">{doctor.nextSlot}</p>
                  <p className="text-white/50 text-sm">Today</p>
                </div>
              </div>
            </GlassmorphicCard>

            {/* Book Appointment Button */}
            <Button
              variant="gradient"
              size="lg"
              fullWidth
              onClick={() => setShowBooking(true)}
              className="py-4 text-lg"
            >
              Book Appointment
            </Button>

            {/* Share */}
            <div className="flex gap-3">
              <Button variant="glass" size="sm" fullWidth icon={Share2}>
                Share Profile
              </Button>
              <Button variant="glass" size="sm" fullWidth icon={Flag}>
                Report
              </Button>
            </div>
          </div>
        </div>

        {/* Booking Modal */}
        <AnimatePresence>
          {showBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowBooking(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DoctorProfile;