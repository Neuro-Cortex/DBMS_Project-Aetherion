// src/pages/BloodDonors.tsx
// COMPLETE BLOOD DONOR LISTING SYSTEM
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Star, Phone,  X, CheckCircle2,
   Droplets, Shield,  Users, 
   LogIn, 
  BadgeCheck, AlertCircle, Activity, Timer, ThumbsUp,
  Smartphone,
} from 'lucide-react';
import { useAppSelector } from '../store';

// ✅ ALL EXISTING UI COMPONENTS
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Input } from 'src/ui/Input';
import { Modal } from 'src/ui/Modal';
// ============================================
// TYPES
// ============================================
type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
type AvailabilityStatus = 'available' | 'busy' | 'not-available';
type ContactMethod = 'Call' | 'SMS' | 'WhatsApp';

interface BloodDonor {
  id: string;
  // Basic Information
  fullName: string;
  profilePhoto: string;
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  bloodGroup: BloodGroup;
  weight?: number;
  // Contact Information
  phoneNumber: string;
  email?: string;
  preferredContact: ContactMethod;
  // Location Information
  division: string;
  district: string;
  area: string;
  currentLocation: string;
  distance?: string;
  // Donation Information
  lastDonationDate?: string;
  totalDonationCount: number;
  availabilityStatus: AvailabilityStatus;
  canDonateNow: boolean;
  nextEligibleDate?: string;
  // Health Information
  medicalCondition?: string;
  smokingStatus?: 'Non-smoker' | 'Occasional' | 'Regular';
  recentSurgery: boolean;
  eligibleForDonation: boolean;
  // Verification & Trust
  isVerified: boolean;
  nidVerified?: boolean;
  accountCreatedDate: string;
  rating: number;
  thankYouCount: number;
  // Extra Information
  bio?: string;
  preferredDonationArea?: string;
  emergencyContact?: string;
  totalRequestsResponded: number;
  responseTime?: string;
}

// ============================================
// MOCK DATA - 30+ BLOOD DONORS
// ============================================
const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const divisions = ['Dhaka', 'Chittagong', 'Khulna', 'Rajshahi', 'Sylhet', 'Barisal', 'Rangpur', 'Mymensingh'];
const districts = ['Dhaka', 'Gazipur', 'Narayanganj', 'Savar', 'Gulshan', 'Banani', 'Dhanmondi', 'Mirpur', 'Uttara', 'Bashundhara', 'Mohammadpur', 'Motijheel'];
const areas = ['Block A', 'Block B', 'Road 1', 'Road 2', 'Main Road', 'New Market', 'Old Town', 'Cantonment'];

const firstNames = ['Rahima', 'Fatema', 'Nasrin', 'Sharmin', 'Tania', 'Sadia', 'Nusrat', 'Farzana', 'Moushumi', 'Selina', 'Abdul', 'Mohammad', 'Hasan', 'Rafiqul', 'Shahidul', 'Kamrul', 'Zahid', 'Moniruzzaman', 'Habibur', 'Shafiqul'];
const lastNames = ['Akter', 'Khatun', 'Sultana', 'Begum', 'Islam', 'Haque', 'Rahman', 'Jahan', 'Parvin', 'Yasmin', 'Karim', 'Ali', 'Mahmud', 'Alam', 'Hossain'];

const bios = [
  'Ready to help emergency patients anytime.',
  'Regular blood donor, happy to save lives.',
  'Available for emergency blood donation 24/7.',
  'Donating blood since 2018. Feel free to contact.',
  'O-negative universal donor. Always ready to help.',
  'Your small donation can save someone\'s life.',
  'Blood donation is the greatest donation.',
  'Proud to be a regular blood donor.',
];

const generateDonors = (): BloodDonor[] => {
  const donors: BloodDonor[] = [];
  for (let i = 0; i < 35; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    const bloodGroup = bloodGroups[i % 8];
    const availability: AvailabilityStatus = i % 3 === 0 ? 'available' : i % 3 === 1 ? 'busy' : 'not-available';
    const canDonate = availability === 'available' && (i % 4 !== 0);
    const totalDonations = i < 5 ? 0 : Math.floor(Math.random() * 25) + 1;
    const lastDonation = totalDonations > 0 ? `2026-0${Math.floor(Math.random() * 5) + 1}-${Math.floor(Math.random() * 28) + 1}` : undefined;
    
    donors.push({
      id: `donor-${i + 1}`,
      fullName: `${firstName} ${lastName}`,
      profilePhoto: `https://randomuser.me/api/portraits/${i % 2 === 0 ? 'women' : 'men'}/${(i % 70) + 1}.jpg`,
      gender: i % 3 === 0 ? 'Female' : 'Male',
      age: 18 + Math.floor(Math.random() * 40),
      bloodGroup,
      weight: 50 + Math.floor(Math.random() * 40),
      phoneNumber: `+880-1${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 900000) + 100000}`,
      email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@gmail.com`,
      preferredContact: ['Call', 'WhatsApp', 'SMS'][Math.floor(Math.random() * 3)] as ContactMethod,
      division: divisions[i % 8],
      district: districts[i % districts.length],
      area: areas[i % areas.length],
      currentLocation: `${districts[i % districts.length]}, ${divisions[i % 8]}`,
      distance: `${(0.5 + Math.random() * 15).toFixed(1)} km`,
      lastDonationDate: lastDonation,
      totalDonationCount: totalDonations,
      availabilityStatus: availability,
      canDonateNow: canDonate,
      nextEligibleDate: lastDonation ? `2026-0${Math.floor(Math.random() * 5) + 4}-${Math.floor(Math.random() * 28) + 1}` : 'Anytime',
      medicalCondition: i % 5 === 0 ? 'None' : undefined,
      smokingStatus: i % 4 === 0 ? 'Non-smoker' : i % 4 === 1 ? 'Occasional' : undefined,
      recentSurgery: i % 10 === 0,
      eligibleForDonation: i % 10 !== 0,
      isVerified: i % 3 !== 0,
      nidVerified: i % 2 === 0,
      accountCreatedDate: `202${Math.floor(Math.random() * 6)}-0${Math.floor(Math.random() * 9) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
      thankYouCount: Math.floor(Math.random() * 100),
      bio: bios[i % bios.length],
      preferredDonationArea: `${districts[(i + 1) % districts.length]}, ${divisions[(i + 1) % 8]}`,
      emergencyContact: i % 2 === 0 ? `+880-1${Math.floor(Math.random() * 9000) + 1000}-${Math.floor(Math.random() * 900000) + 100000}` : undefined,
      totalRequestsResponded: Math.floor(Math.random() * 30),
      responseTime: `${Math.floor(Math.random() * 30) + 1} min`,
    });
  }
  return donors;
};

const allDonors = generateDonors();

// ============================================
// COLOR MAPS
// ============================================
const bloodGroupColors: Record<BloodGroup, string> = {
  'A+': 'bg-red-500/20 text-red-400 border-red-500/30',
  'A-': 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  'B+': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  'B-': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
  'AB+': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'AB-': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
  'O+': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'O-': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
};

const availabilityColors: Record<AvailabilityStatus, string> = {
  'available': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  'busy': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  'not-available': 'bg-slate-500/20 text-slate-400 border-slate-500/30',
};

const availabilityLabels: Record<AvailabilityStatus, string> = {
  'available': 'Available',
  'busy': 'Busy',
  'not-available': 'Not Available',
};

// ============================================
// DONOR CARD
// ============================================
const DonorCard: React.FC<{ donor: BloodDonor; onSelect: (d: BloodDonor) => void }> = React.memo(({ donor, onSelect }) => (
  <motion.div whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => onSelect(donor)} className="cursor-pointer">
    <Card className="overflow-hidden p-0 group hover:border-cyan-600 hover:shadow-2xl transition-all duration-300 rounded-[2rem] border-slate-800 bg-slate-900">
      {/* Header with Blood Group */}
      <div className="relative p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar name={donor.fullName} src={donor.profilePhoto} size="lg" className="ring-4 ring-slate-800 shadow-xl" />
              {donor.canDonateNow && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-400 border-3 border-slate-900 animate-pulse shadow-lg shadow-emerald-400/50" />
              )}
            </div>
            <div>
              <h3 className="font-black text-xl text-white flex items-center gap-2">
                {donor.fullName}
                {donor.isVerified && <BadgeCheck className="w-5 h-5 text-blue-400 fill-blue-400" />}
              </h3>
              <p className="text-sm text-slate-400 flex items-center gap-2 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-red-400" />
                {donor.currentLocation}
                {donor.distance && <span className="text-cyan-400">• {donor.distance}</span>}
              </p>
            </div>
          </div>
          {/* Blood Group Badge */}
          <div className={`px-4 py-2.5 rounded-2xl border-2 font-black text-2xl ${bloodGroupColors[donor.bloodGroup]}`}>
            {donor.bloodGroup}
          </div>
        </div>
        
        {/* Availability & Can Donate */}
        <div className="flex items-center gap-2 mb-4">
          <Badge variant={donor.availabilityStatus === 'available' ? 'success' : donor.availabilityStatus === 'busy' ? 'warning' : 'default'}
            className={`flex items-center gap-1.5 ${availabilityColors[donor.availabilityStatus]}`}>
            <span className={`w-2 h-2 rounded-full ${donor.availabilityStatus === 'available' ? 'bg-emerald-400 animate-pulse' : donor.availabilityStatus === 'busy' ? 'bg-amber-400' : 'bg-slate-400'}`} />
            {availabilityLabels[donor.availabilityStatus]}
          </Badge>
          {donor.canDonateNow && (
            <Badge variant="success" className="flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" /> Can Donate Now
            </Badge>
          )}
          {!donor.eligibleForDonation && (
            <Badge variant="danger" className="flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Not Eligible
            </Badge>
          )}
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          <div className="text-center p-2.5 rounded-2xl bg-red-500/10">
            <Droplets className="w-4 h-4 text-red-400 mx-auto mb-0.5" />
            <p className="text-sm font-black text-white">{donor.totalDonationCount}</p>
            <p className="text-[10px] text-slate-500">Donations</p>
          </div>
          <div className="text-center p-2.5 rounded-2xl bg-amber-500/10">
            <Star className="w-4 h-4 text-amber-400 mx-auto mb-0.5" />
            <p className="text-sm font-black text-white">{donor.rating}</p>
            <p className="text-[10px] text-slate-500">Rating</p>
          </div>
          <div className="text-center p-2.5 rounded-2xl bg-green-500/10">
            <ThumbsUp className="w-4 h-4 text-green-400 mx-auto mb-0.5" />
            <p className="text-sm font-black text-white">{donor.thankYouCount}</p>
            <p className="text-[10px] text-slate-500">Thanks</p>
          </div>
          <div className="text-center p-2.5 rounded-2xl bg-blue-500/10">
            <Timer className="w-4 h-4 text-blue-400 mx-auto mb-0.5" />
            <p className="text-sm font-black text-white">{donor.responseTime || 'N/A'}</p>
            <p className="text-[10px] text-slate-500">Response</p>
          </div>
        </div>
        
        {/* Contact Icons */}
        <div className="flex items-center gap-3 flex-wrap mb-4">
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Phone className="w-3.5 h-3.5 text-green-400" /> {donor.phoneNumber}
          </span>
          <span className="flex items-center gap-1.5 text-xs text-slate-400">
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" /> {donor.preferredContact}
          </span>
        </div>
        
        {/* CTA */}
        <Button variant="primary" className="w-full bg-gradient-to-r from-red-500 to-rose-500 text-white font-black shadow-lg hover:shadow-xl transition-all py-3 text-base">
          <Droplets className="w-5 h-5 mr-2" /> Request Blood
        </Button>
      </div>
    </Card>
  </motion.div>
));
DonorCard.displayName = 'DonorCard';

// ============================================
// DONOR DETAIL MODAL
// ============================================
const DonorDetailModal: React.FC<{ donor: BloodDonor; onClose: () => void }> = ({ donor, onClose }) => {
  const navigate = useNavigate();
  const isAuth = useAppSelector((s: any) => s.auth?.isAuthenticated);

  const handleRequest = () => {
    if (!isAuth) { navigate('/login'); return; }
    // Request blood logic
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="lg" className="max-h-[93vh] overflow-y-auto rounded-[2.5rem] bg-slate-950">
      {/* Cover */}
      <div className="relative h-48 overflow-hidden rounded-t-[2.5rem] bg-gradient-to-br from-red-900 via-slate-900 to-rose-900">
        <div className="absolute inset-0 flex items-center justify-center">
          <Droplets className="w-32 h-32 text-red-500/20" />
        </div>
        <button onClick={onClose} className="absolute top-5 right-5 w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-xl hover:bg-white/20 flex items-center justify-center transition-all border border-white/20">
          <X className="w-6 h-6 text-white" />
        </button>
        
        {/* Blood Group Hero */}
        <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
          <div className="flex items-center gap-5">
            <div className="relative">
              <Avatar name={donor.fullName} src={donor.profilePhoto} size="xl" className="ring-4 ring-slate-900 shadow-2xl" />
              {donor.canDonateNow && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-4 border-slate-950 animate-pulse shadow-lg shadow-emerald-400/50" />
              )}
            </div>
            <div>
              <h2 className="text-3xl font-black text-white">{donor.fullName}</h2>
              <p className="text-sm text-slate-400 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-red-400" /> {donor.currentLocation}
              </p>
            </div>
          </div>
          <div className={`px-6 py-3 rounded-2xl border-3 font-black text-4xl ${bloodGroupColors[donor.bloodGroup]}`}>
            {donor.bloodGroup}
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="p-8 space-y-6">
        {/* Status Badges */}
        <div className="flex items-center gap-3 flex-wrap">
          <Badge variant={donor.availabilityStatus === 'available' ? 'success' : donor.availabilityStatus === 'busy' ? 'warning' : 'default'}
            className={`flex items-center gap-2 px-4 py-2 text-sm ${availabilityColors[donor.availabilityStatus]}`}>
            <span className={`w-2.5 h-2.5 rounded-full ${donor.availabilityStatus === 'available' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            {availabilityLabels[donor.availabilityStatus]}
          </Badge>
          {donor.canDonateNow && (
            <Badge variant="success" className="flex items-center gap-2 px-4 py-2 text-sm bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" /> Can Donate Now
            </Badge>
          )}
          {donor.isVerified && (
            <Badge variant="info" className="flex items-center gap-2 px-4 py-2 text-sm">
              <BadgeCheck className="w-4 h-4" /> Verified Donor
            </Badge>
          )}
        </div>
        
        {/* Bio */}
        {donor.bio && (
          <GlassmorphicCard className="p-5">
            <p className="text-base text-slate-300 italic">"{donor.bio}"</p>
          </GlassmorphicCard>
        )}
        
        {/* Basic Info */}
        <div>
          <h3 className="font-black text-lg text-white mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-cyan-400" /> Basic Information
          </h3>
          <div className="grid grid-cols-4 gap-3">
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Gender</p><p className="font-bold text-white">{donor.gender}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Age</p><p className="font-bold text-white">{donor.age} years</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Blood Group</p><p className="font-bold text-white">{donor.bloodGroup}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Weight</p><p className="font-bold text-white">{donor.weight || 'N/A'} kg</p></Card>
          </div>
        </div>
        
        {/* Contact Info */}
        <div>
          <h3 className="font-black text-lg text-white mb-3 flex items-center gap-2">
            <Phone className="w-5 h-5 text-green-400" /> Contact Information
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <Card className="p-4"><p className="text-xs text-slate-400">Phone</p><p className="font-bold text-white">{donor.phoneNumber}</p></Card>
            <Card className="p-4"><p className="text-xs text-slate-400">Email</p><p className="font-bold text-white">{donor.email || 'N/A'}</p></Card>
            <Card className="p-4"><p className="text-xs text-slate-400">Preferred Contact</p><p className="font-bold text-white">{donor.preferredContact}</p></Card>
            <Card className="p-4"><p className="text-xs text-slate-400">Emergency Contact</p><p className="font-bold text-white">{donor.emergencyContact || 'N/A'}</p></Card>
          </div>
        </div>
        
        {/* Location */}
        <div>
          <h3 className="font-black text-lg text-white mb-3 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-red-400" /> Location
          </h3>
          <div className="grid grid-cols-4 gap-3">
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Division</p><p className="font-bold text-white">{donor.division}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">District</p><p className="font-bold text-white">{donor.district}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Area</p><p className="font-bold text-white">{donor.area}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Distance</p><p className="font-bold text-white">{donor.distance || 'N/A'}</p></Card>
          </div>
        </div>
        
        {/* Donation Stats */}
        <div>
          <h3 className="font-black text-lg text-white mb-3 flex items-center gap-2">
            <Droplets className="w-5 h-5 text-red-400" /> Donation Information
          </h3>
          <div className="grid grid-cols-4 gap-3">
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Total Donations</p><p className="font-bold text-white text-2xl">{donor.totalDonationCount}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Last Donation</p><p className="font-bold text-white">{donor.lastDonationDate || 'Never'}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Next Eligible</p><p className="font-bold text-white">{donor.nextEligibleDate || 'Anytime'}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Requests Responded</p><p className="font-bold text-white text-2xl">{donor.totalRequestsResponded}</p></Card>
          </div>
        </div>
        
        {/* Health Info */}
        <div>
          <h3 className="font-black text-lg text-white mb-3 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" /> Health Information
          </h3>
          <div className="grid grid-cols-4 gap-3">
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Medical Condition</p><p className="font-bold text-white">{donor.medicalCondition || 'None'}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Smoking</p><p className="font-bold text-white">{donor.smokingStatus || 'N/A'}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Recent Surgery</p><p className="font-bold text-white">{donor.recentSurgery ? 'Yes' : 'No'}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Eligible</p><p className={`font-bold ${donor.eligibleForDonation ? 'text-emerald-400' : 'text-red-400'}`}>{donor.eligibleForDonation ? 'Yes ✅' : 'No ❌'}</p></Card>
          </div>
        </div>
        
        {/* Verification */}
        <div>
          <h3 className="font-black text-lg text-white mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-400" /> Verification & Trust
          </h3>
          <div className="grid grid-cols-4 gap-3">
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Verified</p><p className="font-bold text-white">{donor.isVerified ? '✅ Yes' : '❌ No'}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">NID Verified</p><p className="font-bold text-white">{donor.nidVerified ? '✅ Yes' : '❌ No'}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Account Created</p><p className="font-bold text-white">{donor.accountCreatedDate}</p></Card>
            <Card className="p-3 text-center"><p className="text-xs text-slate-400">Thanks Count</p><p className="font-bold text-white text-2xl">{donor.thankYouCount}</p></Card>
          </div>
        </div>
        
        {/* Rating */}
        <div>
          <h3 className="font-black text-lg text-white mb-3 flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400" /> Rating & Response
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center">
              <p className="text-xs text-slate-400">Rating</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <span className="text-2xl font-black text-white">{donor.rating}</span>
              </div>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-xs text-slate-400">Response Time</p>
              <div className="flex items-center justify-center gap-1 mt-1">
                <Timer className="w-5 h-5 text-cyan-400" />
                <span className="text-xl font-black text-white">{donor.responseTime || 'N/A'}</span>
              </div>
            </Card>
            <Card className="p-4 text-center">
              <p className="text-xs text-slate-400">Preferred Area</p>
              <p className="text-sm font-bold text-white mt-2">{donor.preferredDonationArea || 'Any'}</p>
            </Card>
          </div>
        </div>
        
        {/* CTA Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-800">
          <Button variant="primary" onClick={handleRequest} className="flex-1 bg-gradient-to-r from-red-500 to-rose-500 text-white font-black py-4 text-lg shadow-xl">
            <Droplets className="w-5 h-5 mr-2" /> Request Blood
          </Button>
          <a href={`tel:${donor.phoneNumber}`} className="flex-1">
            <Button variant="outline" className="w-full py-4 text-lg border-green-500/30 text-green-400">
              <Phone className="w-5 h-5 mr-2" /> Call Now
            </Button>
          </a>
        </div>
      </div>
    </Modal>
  );
};

// ============================================
// LOGIN MODAL
// ============================================
const LoginModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const nav = useNavigate();
  return (
    <Modal isOpen={true} onClose={onClose} size="sm">
      <div className="text-center p-8 bg-slate-900">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 flex items-center justify-center">
          <LogIn className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">Login Required</h3>
        <p className="text-sm text-slate-400 mb-6">Please login to request blood</p>
        <div className="space-y-3">
          <Button variant="primary" onClick={() => nav('/login')} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-3">Login</Button>
          <Button variant="outline" onClick={() => nav('/register')} className="w-full py-3">Register</Button>
          <Button variant="ghost" onClick={onClose} className="w-full">Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================
// MAIN
// ============================================
const BloodDonors: React.FC = () => {
  const donors = useMemo(() => allDonors, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('all');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [selectedDonor, setSelectedDonor] = useState<BloodDonor | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  const filteredDonors = useMemo(() => {
    let result = [...donors];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => d.fullName.toLowerCase().includes(q) || d.currentLocation.toLowerCase().includes(q) || d.bloodGroup.toLowerCase().includes(q));
    }
    if (bloodGroupFilter !== 'all') result = result.filter(d => d.bloodGroup === bloodGroupFilter);
    if (availabilityFilter !== 'all') {
      if (availabilityFilter === 'can-donate') result = result.filter(d => d.canDonateNow);
      else result = result.filter(d => d.availabilityStatus === availabilityFilter);
    }
    return result;
  }, [searchQuery, bloodGroupFilter, availabilityFilter, donors]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-red-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <Badge variant="danger" className="mb-3 px-5 py-2 text-sm shadow-lg flex items-center gap-2">
            <Droplets className="w-4 h-4" /> {donors.length} Blood Donors Available
          </Badge>
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-4 tracking-tight">
            Find <span className="bg-gradient-to-r from-red-500 via-rose-500 to-pink-500 bg-clip-text text-transparent">Blood Donors</span> Near You
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Search for blood donors by name, location, or blood group. Every donation saves lives.
          </p>
        </motion.div>

        {/* Filters */}
        <GlassmorphicCard className="p-5 mb-8 shadow-xl bg-slate-900/80 border-slate-700/50">
          <div className="flex flex-col md:flex-row gap-3">
            <Input placeholder="Search by name, location, or blood group..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} icon={<Search className="w-5 h-5" />} className="flex-1" />
            <select value={bloodGroupFilter} onChange={(e) => setBloodGroupFilter(e.target.value)} className="px-5 py-3.5 rounded-xl border border-slate-700 bg-slate-900 font-bold text-sm cursor-pointer text-white">
              <option value="all">🩸 All Blood Groups</option>
              {bloodGroups.map(bg => <option key={bg} value={bg}>{bg}</option>)}
            </select>
            <select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)} className="px-5 py-3.5 rounded-xl border border-slate-700 bg-slate-900 font-bold text-sm cursor-pointer text-white">
              <option value="all">📋 All Status</option>
              <option value="available">🟢 Available</option>
              <option value="busy">🟡 Busy</option>
              <option value="not-available">⚫ Not Available</option>
              <option value="can-donate">✅ Can Donate Now</option>
            </select>
          </div>
        </GlassmorphicCard>

        <p className="mb-6 text-sm text-slate-400 font-medium">Found <span className="font-black text-white">{filteredDonors.length}</span> donors</p>

        {/* Donors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map((donor) => <DonorCard key={donor.id} donor={donor} onSelect={setSelectedDonor} />)}
        </div>
      </div>

      <AnimatePresence>{selectedDonor && <DonorDetailModal donor={selectedDonor} onClose={() => setSelectedDonor(null)} />}</AnimatePresence>
      <AnimatePresence>{loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}</AnimatePresence>
    </div>
  );
};

export default BloodDonors;