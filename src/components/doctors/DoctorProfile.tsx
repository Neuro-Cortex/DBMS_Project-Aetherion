// src/components/doctor/DoctorProfile.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User, Star, MapPin, DollarSign, Calendar, Clock, Phone,
  Video, MessageSquare, Award, BookOpen, Briefcase, Heart,
  Shield, Globe, ChevronDown, ChevronUp, ThumbsUp, Share2,
  Printer, Users
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// 
// src/pages/doctor/DoctorProfile.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Stethoscope, Star, MapPin, Clock, Award,
  GraduationCap, DollarSign, Edit, Camera,
  CheckCircle2, ChevronRight, Calendar, Users,
  ThumbsUp, MessageCircle, Activity, Building2,
  Phone, Mail, Globe, Heart, Shield, Plus
} from 'lucide-react';

const DoctorProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const doctorInfo = {
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    licenseNumber: 'MED-12345',
    experience: 15,
    rating: 4.9,
    reviewCount: 234,
    consultationFee: 150,
    hospitalAffiliation: 'City General Hospital',
    hospitalAddress: '123 Healthcare Ave, Medical District, NY',
    email: 'dr.sarah@aetherion.com',
    phone: '+1 (555) 234-5678',
    bio: 'Board-certified cardiologist with 15 years of experience in treating complex cardiovascular conditions. Specializing in interventional cardiology and preventive cardiac care.',
    languages: ['English', 'Spanish', 'French'],
    education: [
      { degree: 'MD - Cardiology', institution: 'Harvard Medical School', year: 2009 },
      { degree: 'Residency - Internal Medicine', institution: 'Johns Hopkins Hospital', year: 2012 },
      { degree: 'Fellowship - Interventional Cardiology', institution: 'Mayo Clinic', year: 2015 },
    ],
    awards: [
      { title: 'Best Cardiologist 2023', organization: 'Medical Excellence Awards', year: 2023 },
      { title: 'Patient Choice Award', organization: 'HealthCare Ratings', year: 2022 },
      { title: 'Research Excellence', organization: 'American Heart Association', year: 2021 },
    ],
  };

  return (
    <div className="min-h-screen bg-[#050508] flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-[#08080d] border-r border-white/[0.04] fixed left-0 top-0 p-6">
        <Link to="/doctor/dashboard" className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Doctor Panel</h1>
            <p className="text-white/30 text-xs">Profile Settings</p>
          </div>
        </Link>
        <nav className="space-y-1">
          {['Dashboard', 'Appointments', 'Patients', 'Prescriptions', 'Video Calls', 'Profile'].map(item => (
            <Link key={item} to={item === 'Dashboard' ? '/doctor/dashboard' : '#'}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                item === 'Profile' ? 'bg-emerald-500/10 text-emerald-400' : 'text-white/40 hover:text-white/70'
              }`}>{item}</Link>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Doctor Profile</h1>
          <button onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 ${
              isEditing ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20'
            } transition-all`}>
            <Edit className="w-4 h-4" /> {isEditing ? 'Save Changes' : 'Edit Profile'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="col-span-1">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center">
              <div className="relative inline-block mb-4">
                <img src="https://randomuser.me/api/portraits/women/1.jpg" alt="Doctor"
                  className="w-32 h-32 rounded-2xl object-cover mx-auto border-2 border-white/[0.08]" />
                <button className="absolute bottom-0 right-0 p-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <h2 className="text-2xl font-bold text-white">{doctorInfo.name}</h2>
              <p className="text-emerald-400 font-medium">{doctorInfo.specialization}</p>
              <div className="flex items-center justify-center gap-1 mt-2">
                <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                <span className="text-white font-bold">{doctorInfo.rating}</span>
                <span className="text-white/30 text-sm">({doctorInfo.reviewCount} reviews)</span>
              </div>
              
              <div className="mt-6 space-y-3 text-left">
                {[
                  { icon: Building2, label: 'Hospital', value: doctorInfo.hospitalAffiliation },
                  { icon: MapPin, label: 'Location', value: doctorInfo.hospitalAddress },
                  { icon: DollarSign, label: 'Consultation Fee', value: `$${doctorInfo.consultationFee}` },
                  { icon: Clock, label: 'Experience', value: `${doctorInfo.experience} years` },
                  { icon: Globe, label: 'Languages', value: doctorInfo.languages.join(', ') },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex items-center gap-3 text-sm">
                      <Icon className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className="text-white/40">{item.label}:</span>
                      <span className="text-white text-right flex-1">{item.value}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex gap-2 mt-6">
                <button className="flex-1 py-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 text-sm font-medium hover:bg-cyan-500/20 transition-all">
                  <Phone className="w-4 h-4 inline mr-1" /> Call
                </button>
                <button className="flex-1 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all">
                  <Mail className="w-4 h-4 inline mr-1" /> Email
                </button>
              </div>
            </motion.div>
          </div>

          {/* Details */}
          <div className="col-span-2 space-y-6">
            {/* Bio */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <h3 className="text-white font-semibold text-lg mb-3">About</h3>
              <p className="text-white/60 text-sm leading-relaxed">{doctorInfo.bio}</p>
            </motion.div>

            {/* Education */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-400" /> Education
              </h3>
              <div className="space-y-3">
                {doctorInfo.education.map((edu, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium">{edu.degree}</h4>
                      <p className="text-white/40 text-xs">{edu.institution}</p>
                    </div>
                    <span className="text-white/30 text-sm">{edu.year}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Awards */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-400" /> Awards & Recognition
              </h3>
              <div className="space-y-3">
                {doctorInfo.awards.map((award, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                    <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                      <Award className="w-5 h-5 text-amber-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white text-sm font-medium">{award.title}</h4>
                      <p className="text-white/40 text-xs">{award.organization}</p>
                    </div>
                    <span className="text-amber-400 text-sm font-medium">{award.year}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
// 
// /*
// Legacy prop-driven DoctorProfile variant preserved below for reference.
// It was pasted after the active page component and caused duplicate exports.
// ============================================
// // TYPES
// // ============================================
// export interface Doctor {
//   id: string;
//   name: string;
//   title: string;
//   specialty: string;
//   avatar?: string;
//   rating: number;
//   reviewCount: number;
//   experience: number;
//   price: number;
//   location: string;
//   hospital: string;
//   availableSlots: number;
//   nextAvailable: string;
//   verified: boolean;
//   premium?: boolean;
//   languages: string[];
//   services: string[];
//   education: string[];
//   achievements: string[];
// }
// 
// export interface DoctorProfileProps {
//   doctor: Doctor;
//   onBookAppointment?: () => void;
//   onContact?: (method: 'call' | 'video' | 'message') => void;
//   onShare?: () => void;
//   onPrint?: () => void;
//   className?: string;
// }
// 
// interface Review {
//   id: string;
//   patient: { name: string; avatar?: string };
//   rating: number;
//   date: string;
//   comment: string;
//   helpful: number;
// }
// 
// // ============================================
// // MOCK REVIEWS
// // ============================================
// const mockReviews: Review[] = [
//   { id: '1', patient: { name: 'Sarah Johnson' }, rating: 5, date: '2024-01-15', comment: 'Exceptional care! Dr. explained my condition in detail and provided a comprehensive treatment plan. Highly recommended.', helpful: 24 },
//   { id: '2', patient: { name: 'Mike Chen' }, rating: 5, date: '2024-01-10', comment: 'Very professional and caring. The staff was also very helpful. Great experience overall.', helpful: 18 },
//   { id: '3', patient: { name: 'Emily Davis' }, rating: 4, date: '2024-01-05', comment: 'Good experience overall. Waiting time was a bit long but the consultation was thorough and informative.', helpful: 12 },
//   { id: '4', patient: { name: 'Robert Wilson' }, rating: 5, date: '2024-01-02', comment: 'Dr. saved my life! Incredible cardiologist with amazing bedside manner.', helpful: 35 },
// ];
// 
// // ============================================
// // MAIN COMPONENT
// // ============================================
// export const DoctorProfile: React.FC<DoctorProfileProps> = ({
//   doctor,
//   onBookAppointment,
//   onContact,
//   onShare,
//   onPrint,
//   className = '',
// }) => {
//   const [activeTab, setActiveTab] = useState<'overview' | 'experience' | 'reviews' | 'availability'>('overview');
//   const [showAllReviews, setShowAllReviews] = useState(false);
// 
//   const tabs = [
//     { id: 'overview' as const, label: 'Overview', icon: User },
//     { id: 'experience' as const, label: 'Experience', icon: Briefcase },
//     { id: 'reviews' as const, label: 'Reviews', icon: Star },
//     { id: 'availability' as const, label: 'Availability', icon: Calendar },
//   ];
// 
//   const displayedReviews = showAllReviews ? mockReviews : mockReviews.slice(0, 3);
// 
//   return (
//     <div className={`max-w-6xl mx-auto p-6 space-y-6 ${className}`}>
// 
//       {/* ============================================ */}
//       {/* HEADER CARD */}
//       {/* ============================================ */}
//       <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
//         className="bg-white/[0.015] backdrop-blur-sm rounded-2xl border border-white/[0.06] p-6 md:p-8">
//         
//         <div className="flex flex-col lg:flex-row gap-8">
//           
//           {/* LEFT — Doctor Info */}
//           <div className="flex-1">
//             <div className="flex items-start gap-5 mb-6">
//               {/* Avatar */}
//               <div className="relative shrink-0">
//                 <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl shadow-xl">
//                   {doctor.name.charAt(0)}
//                 </div>
//                 {doctor.verified && (
//                   <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 bg-cyan-500 rounded-full flex items-center justify-center border-2 border-[#050508]">
//                     <Shield className="w-3.5 h-3.5 text-white" />
//                   </div>
//                 )}
//               </div>
// 
//               <div>
//                 <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">{doctor.name}</h1>
//                 <p className="text-white/50 text-sm mb-2">{doctor.title}</p>
//                 <div className="flex flex-wrap items-center gap-2">
//                   <Badge variant="info" size="xs">{doctor.specialty}</Badge>
//                   {doctor.premium && <Badge variant="warning" size="xs">PREMIUM</Badge>}
//                   <span className="flex items-center gap-1 text-white/30 text-xs"><MapPin className="w-3 h-3" />{doctor.location}</span>
//                 </div>
//               </div>
//             </div>
// 
//             {/* Quick Stats */}
//             <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
//               {[
//                 { label: 'Rating', value: doctor.rating, icon: Star, color: 'text-amber-400', suffix: `/5` },
//                 { label: 'Reviews', value: doctor.reviewCount, icon: Users, color: 'text-blue-400', suffix: '+' },
//                 { label: 'Experience', value: doctor.experience, icon: Award, color: 'text-purple-400', suffix: ' yrs' },
//                 { label: 'Price', value: `$${doctor.price}`, icon: DollarSign, color: 'text-emerald-400', suffix: '' },
//               ].map((stat, i) => {
//                 const Icon = stat.icon;
//                 return (
//                   <div key={i} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.04] text-center">
//                     <Icon className={`w-5 h-5 mx-auto mb-1.5 ${stat.color}`} />
//                     <p className="text-lg font-bold text-white">{stat.value}<span className="text-sm font-normal text-white/40">{stat.suffix}</span></p>
//                     <p className="text-white/30 text-[10px]">{stat.label}</p>
//                   </div>
//                 );
//               })}
//             </div>
// 
//             {/* Action Buttons */}
//             <div className="flex flex-wrap gap-3">
//               <Button variant="gradient" size="sm" onClick={onBookAppointment} className="gap-2">
//                 <Calendar className="w-4 h-4" /> Book Appointment
//               </Button>
//               <Button variant="glass" size="sm" onClick={() => onContact?.('call')} className="gap-2">
//                 <Phone className="w-4 h-4" /> Call
//               </Button>
//               <Button variant="glass" size="sm" onClick={() => onContact?.('video')} className="gap-2">
//                 <Video className="w-4 h-4" /> Video
//               </Button>
//               <Button variant="glass" size="sm" onClick={() => onContact?.('message')} className="gap-2">
//                 <MessageSquare className="w-4 h-4" /> Message
//               </Button>
//               <Button variant="glass" size="sm" onClick={onShare} className="gap-2">
//                 <Share2 className="w-4 h-4" /> Share
//               </Button>
//             </div>
//           </div>
// 
//           {/* RIGHT — Quick Info Cards */}
//           <div className="lg:w-72 space-y-4">
//             {/* Availability */}
//             <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
//               <h3 className="text-white font-semibold text-sm mb-3">Next Available</h3>
//               <p className="text-xl font-bold text-cyan-400 mb-2">{doctor.nextAvailable}</p>
//               <div className="flex items-center justify-between mb-3">
//                 <span className="text-white/40 text-xs">Available Slots</span>
//                 <Badge variant={doctor.availableSlots > 0 ? 'success' : 'danger'} size="xs">{doctor.availableSlots} slots</Badge>
//               </div>
//             </div>
// 
//             {/* Languages */}
//             <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
//               <h3 className="text-white font-semibold text-sm mb-3">Languages</h3>
//               <div className="flex flex-wrap gap-1.5">
//                 {doctor.languages.map((lang) => (
//                   <span key={lang} className="px-2 py-0.5 rounded-md bg-white/[0.03] text-white/50 text-[10px] border border-white/[0.04]">{lang}</span>
//                 ))}
//               </div>
//             </div>
// 
//             {/* Hospital */}
//             <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
//               <h3 className="text-white font-semibold text-sm mb-3">Hospital</h3>
//               <p className="text-white/50 text-xs">{doctor.hospital}</p>
//             </div>
//           </div>
//         </div>
//       </motion.div>
// 
//       {/* ============================================ */}
//       {/* TAB NAVIGATION */}
//       {/* ============================================ */}
//       <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 w-fit">
//         {tabs.map(tab => {
//           const Icon = tab.icon;
//           return (
//             <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
//               className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white/[0.08] text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}>
//               <Icon className="w-4 h-4" />{tab.label}
//             </button>
//           );
//         })}
//       </div>
// 
//       {/* ============================================ */}
//       {/* TAB CONTENT */}
//       {/* ============================================ */}
//       <div className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-6">
//         
//         {activeTab === 'overview' && (
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-white font-semibold text-lg mb-3">About</h3>
//               <p className="text-white/50 text-sm leading-relaxed">
//                 Dr. {doctor.name.split(' ').slice(-1)[0]} is a highly skilled {doctor.specialty.toLowerCase()} with over {doctor.experience} years of experience. 
//                 Board-certified and dedicated to providing exceptional patient care through evidence-based medicine and compassionate approach.
//               </p>
//             </div>
//             <div>
//               <h3 className="text-white font-semibold text-lg mb-3">Services</h3>
//               <div className="flex flex-wrap gap-2">
//                 {doctor.services.map((service) => (
//                   <span key={service} className="px-3 py-1.5 rounded-lg bg-white/[0.03] text-white/50 text-xs border border-white/[0.04]">{service}</span>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <h3 className="text-white font-semibold text-lg mb-3">Achievements</h3>
//               <div className="space-y-2">
//                 {doctor.achievements.map((achievement) => (
//                   <div key={achievement} className="flex items-center gap-2 text-white/40 text-sm">
//                     <Award className="w-4 h-4 text-amber-400 shrink-0" />{achievement}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
// 
//         {activeTab === 'experience' && (
//           <div className="space-y-6">
//             <div>
//               <h3 className="text-white font-semibold text-lg mb-3">Education</h3>
//               <div className="space-y-3">
//                 {doctor.education.map((edu) => (
//                   <div key={edu} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
//                     <BookOpen className="w-4 h-4 text-cyan-400 shrink-0" />
//                     <span className="text-white/60 text-sm">{edu}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div>
//               <h3 className="text-white font-semibold text-lg mb-3">Languages</h3>
//               <div className="flex flex-wrap gap-2">
//                 {doctor.languages.map((lang) => (
//                   <span key={lang} className="px-3 py-1.5 rounded-lg bg-white/[0.03] text-white/50 text-xs border border-white/[0.04] flex items-center gap-1.5">
//                     <Globe className="w-3 h-3" />{lang}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}
// 
//         {activeTab === 'reviews' && (
//           <div className="space-y-4">
//             <div className="flex items-center justify-between">
//               <h3 className="text-white font-semibold text-lg">Patient Reviews ({mockReviews.length})</h3>
//               <div className="flex items-center gap-2">
//                 <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
//                 <span className="text-white font-bold text-lg">{doctor.rating}</span>
//                 <span className="text-white/30 text-sm">({doctor.reviewCount} reviews)</span>
//               </div>
//             </div>
//             {displayedReviews.map((review) => (
//               <div key={review.id} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
//                 <div className="flex items-center justify-between mb-2">
//                   <div className="flex items-center gap-3">
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
//                       {review.patient.name.charAt(0)}
//                     </div>
//                     <div>
//                       <p className="text-white text-sm font-medium">{review.patient.name}</p>
//                       <p className="text-white/25 text-[10px]">{review.date}</p>
//                     </div>
//                   </div>
//                   <div className="flex items-center gap-0.5">
//                     {Array.from({ length: 5 }).map((_, i) => (
//                       <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-white/10'}`} />
//                     ))}
//                   </div>
//                 </div>
//                 <p className="text-white/50 text-sm">{review.comment}</p>
//                 <div className="flex items-center gap-3 mt-3">
//                   <button type="button" className="flex items-center gap-1 text-white/30 text-xs hover:text-white/50 transition-colors">
//                     <ThumbsUp className="w-3 h-3" /> Helpful ({review.helpful})
//                   </button>
//                 </div>
//               </div>
//             ))}
//             {mockReviews.length > 3 && (
//               <button type="button" onClick={() => setShowAllReviews(!showAllReviews)}
//                 className="w-full py-2 text-white/40 text-xs hover:text-white/70 transition-colors">
//                 {showAllReviews ? 'Show less' : `Show all ${mockReviews.length} reviews`}
//               </button>
//             )}
//           </div>
//         )}
// 
//         {activeTab === 'availability' && (
//           <div className="space-y-4">
//             <h3 className="text-white font-semibold text-lg mb-3">Availability</h3>
//             <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
//               <div className="flex items-center justify-between mb-4">
//                 <span className="text-white/50 text-sm">Next Available</span>
//                 <span className="text-cyan-400 font-bold">{doctor.nextAvailable}</span>
//               </div>
//               <div className="flex items-center justify-between">
//                 <span className="text-white/50 text-sm">Available Slots Today</span>
//                 <Badge variant={doctor.availableSlots > 0 ? 'success' : 'danger'} size="xs">{doctor.availableSlots}</Badge>
//               </div>
//             </div>
//             <Button variant="gradient" size="sm" onClick={onBookAppointment} className="w-full gap-2">
//               <Calendar className="w-4 h-4" /> Book Appointment
//             </Button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };
// 
// export default DoctorProfile;
// */
