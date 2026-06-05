// src/pages/Hospitals.tsx - VIEW DETAILS CARD WITH SIDEBAR NAVIGATION
// INDUSTRY-LEVEL PRODUCTION DESIGN - ALL FEATURES PRESERVED

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, Star, Phone, Calendar, Building2, X,
  Bed, AlertCircle, Stethoscope, Heart, Brain, Bone,
  Baby, Microscope, Syringe, Truck, Droplets, Pill, Activity,
  Award, Shield,  Wifi, Car, Coffee, Accessibility,
  CheckCircle2,  ThumbsUp, CalendarDays,
  Sparkles, CreditCard, LogIn, FlaskConical,
   Clock, 
   ChevronRight, BadgeCheck,
   Share2, TrendingUp,
  ChevronDown,  ArrowUpRight,
  Info, ernalLink, Bookmark, LayoutDashboard,
  UserCheck, Building, Wrench, Package,
  Umbrella, MessageSquare, Image, FileText,
  HelpCircle, MapPinned, PhoneCall, Mail,
  Clock3, Timer, BedDouble,
  ActivitySquare, Globe2
} from 'lucide-react';
import { useAppSelector } from '../store';

// ✅ ALL EXISTING UI COMPONENTS
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Input } from 'src/ui/Input';
import { Modal } from 'src/ui/Modal';

// ============================================
// TYPES
// ============================================
type HospitalType = 'Government' | 'Private' | 'Specialized' | 'Medical College';
type TabId = 'overview' | 'doctors' | 'departments' | 'services' | 'packages' | 'insurance' | 'reviews' | 'gallery' | 'news' | 'faq';

interface Hospital {
  id: string; name: string; logo: string; coverImage: string;
  address: string; location: string; district: string;
  phone: string; emergencyPhone: string; email: string; website: string;
  googleMapsUrl: string; nearbyLandmark: string;
  rating: number; totalReviews: number;
  totalBeds: number; availableBeds: number;
  icuBeds: number; availableIcuBeds: number;
  cabinRooms: number; availableCabinRooms: number;
  operationTheaters: number; emergencyRooms: number;
  emergencyAvailable: boolean; workingHours: string; established: number;
  hospitalType: HospitalType; accreditation: string[];
  mission: string; vision: string; about: string;
  departments: Department[];
  doctors: Doctor[];
  services: Service[];
  reviews: Review[];
  healthPackages: HealthPackage[];
  insuranceProviders: InsuranceProvider[];
  gallery: GalleryItem[];
  events: Event[];
  news: NewsItem[];
  faqs: FAQ[];
  successStories: SuccessStory[];
  awards: Award[];
  branches: Branch[];
  totalDoctors: number; totalNurses: number; totalStaff: number;
  specialistCount: number; availableSpecialistsToday: number;
  amenities: string[];
  parkingAvailable: boolean; cafeteriaAvailable: boolean;
  atmAvailable: boolean; prayerRoom: boolean; wifiAvailable: boolean;
  wheelchairAccessible: boolean; homeSampleCollection: boolean;
  waitingArea: boolean;
}

interface Department {
  id: string; name: string; icon: React.ElementType; doctors: number;
  beds: number; availableToday: number; headOfDepartment: string;
  description: string;
}

interface Doctor {
  id: string; name: string; image: string; specialization: string;
  degree: string; experience: number; availableDays: string[];
  availableTime: string; fee: string; rating: number; reviews: number;
  languages: string[]; isAvailable: boolean; achievements: string[];
}

interface Service {
  id: string; name: string; icon: React.ElementType; available: boolean;
  description: string; price?: string; hours: string;
}

interface Review {
  id: string; patientName: string; rating: number; comment: string;
  date: string; treatment: string; avatar: string; verified: boolean;
  helpful: number;
}

interface HealthPackage {
  id: string; name: string; price: string; originalPrice: string;
  tests: string[]; description: string; discount: string; validityDays: number;
}

interface InsuranceProvider {
  id: string; name: string; coverage: string; type: string;
  contactNumber: string;
}

interface GalleryItem {
  id: string; url: string; caption: string; date: string;
}

interface Event {
  id: string; title: string; date: string; description: string;
  type: string; time: string; venue: string;
}

interface NewsItem {
  id: string; title: string; date: string; excerpt: string;
  image: string; category: string;
}

interface FAQ {
  id: string; question: string; answer: string;
}

interface SuccessStory {
  id: string; title: string; description: string; patientName: string;
  date: string; image: string;
}

interface Award {
  id: string; name: string; year: string; organization: string;
  icon: React.ElementType; description: string;
}

interface Branch {
  id: string; name: string; location: string; phone: string;
  distance: string;
}

// ============================================
// DATA GENERATOR
// ============================================
let seed = 2026;
const rng = () => { seed = (seed * 1664525 + 1013904223) & 0xFFFFFFFF; return (seed >>> 0) / 0xFFFFFFFF; };
const randInt = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
const pick = <T,>(arr: T[]): T => arr[Math.floor(rng() * arr.length)];

const HOSPITAL_IMAGES = [
  'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800',
  'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=800',
  'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=800',
  'https://images.unsplash.com/photo-1559757175-5700dde675bc?w=800',
  'https://images.unsplash.com/photo-1551076805-e1869033e561?w=800',
];

const TYPE_BADGE: Record<HospitalType, string> = {
  Government: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Private: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Specialized: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'Medical College': 'bg-green-500/20 text-green-400 border-green-500/30',
};

const generateHospitals = (): Hospital[] => {
  const names = ['Apollo Hospitals Dhaka', 'Square Hospitals Ltd', 'United Hospital Ltd', 'Evercare Hospital Dhaka', 'Ibn Sina Hospital', 'Labaid Specialized Hospital', 'BSMMU', 'Dhaka Medical College Hospital', 'BRB Hospitals Ltd', 'Central Hospital Dhaka'];
  return names.map((name, i) => ({
    id: `h${i + 1}`, name,
    logo: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" rx="16" fill="#${['1e40af', '059669', '7c3aed', '0891b2', 'dc2626', 'd97706', '0d9488', '2563eb', '4f46e5', 'f43f5e'][i]}"/><text x="40" y="52" text-anchor="middle" fill="white" font-size="36" font-weight="bold">${name[0]}</text></svg>`)}`,
    coverImage: HOSPITAL_IMAGES[i % 5],
    address: `${100 + i * 10} Dhaka Medical Road, Dhaka-${1000 + i}`,
    location: pick(['Bashundhara', 'Panthapath', 'Gulshan', 'Dhanmondi', 'Shahbagh']),
    district: 'Dhaka',
    phone: `+880-2-${1000000 + i}`, emergencyPhone: `106${60 + i}`,
    email: `info@${name.toLowerCase().replace(/\s/g, '')}.com`,
    website: `https://${name.toLowerCase().replace(/\s/g, '')}.com`,
    googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(name)}+Dhaka`,
    nearbyLandmark: pick(['City Center', 'Shopping Mall', 'Lake', 'University', 'Metro Station']),
    rating: Math.round((3.5 + rng() * 1.5) * 10) / 10,
    totalReviews: randInt(200, 3000),
    totalBeds: randInt(150, 800), availableBeds: randInt(20, 100),
    icuBeds: randInt(20, 90), availableIcuBeds: randInt(2, 20),
    cabinRooms: randInt(30, 150), availableCabinRooms: randInt(5, 30),
    operationTheaters: randInt(3, 20), emergencyRooms: randInt(5, 40),
    emergencyAvailable: true, workingHours: 'Open 24 Hours',
    established: 1980 + randInt(0, 40),
    hospitalType: pick(['Private', 'Government', 'Specialized', 'Medical College']),
    accreditation: [pick(['JCI', 'ISO 9001', 'NABH', 'Government Approved'])],
    mission: 'To provide quality healthcare for all.',
    vision: 'To be the leading healthcare provider.',
    about: `${name} is a leading healthcare provider in Dhaka, committed to excellence in patient care.`,
    departments: Array.from({ length: 6 }, (_, d) => ({
      id: `d${d}`, name: pick(['Cardiology', 'Neurology', 'Orthopedic', 'Pediatrics', 'ICU', 'Surgery', 'Oncology', 'Gynecology']),
      icon: pick([Heart, Brain, Bone, Baby, Activity, Syringe, FlaskConical]),
      doctors: randInt(5, 20), beds: randInt(10, 50),
      availableToday: randInt(1, 8),
      headOfDepartment: `Prof. ${pick(['Dr. Fatema', 'Dr. Rahima'])} ${pick(['Akter', 'Khatun'])}`,
      description: 'Expert department with modern facilities.'
    })),
    doctors: Array.from({ length: 4 }, (_, d) => ({
      id: `doc${d}`, name: `${pick(['Dr. Fatema', 'Dr. Rahima', 'Dr. Nasrin', 'Dr. Tania'])} ${pick(['Akter', 'Khatun', 'Sultana', 'Begum'])}`,
      image: `https://randomuser.me/api/portraits/${d % 2 === 0 ? 'women' : 'men'}/${d + 1}.jpg`,
      specialization: pick(['Cardiologist', 'Neurologist', 'Pediatrician', 'Dermatologist', 'Orthopedic Surgeon']),
      degree: pick(['MBBS, MD', 'MBBS, FCPS', 'MBBS, MS']),
      experience: randInt(5, 25),
      availableDays: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed'],
      availableTime: '9:00 AM - 5:00 PM',
      fee: `৳${randInt(500, 2000)}`,
      rating: Math.round((3.5 + rng() * 1.5) * 10) / 10,
      reviews: randInt(20, 150),
      languages: ['Bangla', 'English'],
      isAvailable: rng() > 0.3,
      achievements: ['Published Research']
    })),
    services: Array.from({ length: 6 }, (_, s) => ({
      id: `svc${s}`, name: pick(['Ambulance', 'Pharmacy', 'Blood Bank', 'Lab Test', 'Emergency', 'Vaccination', 'Health Checkup']),
      icon: pick([Truck, Pill, Droplets, Microscope, AlertCircle, Syringe, Stethoscope]),
      available: true,
      description: 'Available service',
      price: `৳${randInt(300, 3000)}`,
      hours: '8AM-10PM'
    })),
    reviews: Array.from({ length: 4 }, (_, r) => ({
      id: `rev${r}`, patientName: pick(['Rahima', 'Kamal', 'Nasrin', 'Rafiqul']),
      rating: randInt(3, 5), comment: pick(['Excellent care!', 'Good service.', 'Highly recommended!', 'Professional doctors.']),
      date: `2026-0${randInt(1, 5)}-${randInt(10, 25)}`,
      treatment: pick(['Cardiology', 'Neurology']),
      avatar: `https://randomuser.me/api/portraits/${r % 2 === 0 ? 'women' : 'men'}/${r + 10}.jpg`,
      verified: true, helpful: randInt(5, 50)
    })),
    healthPackages: Array.from({ length: 2 }, (_, p) => ({
      id: `pkg${p}`, name: pick(['Basic Checkup', 'Premium Checkup']),
      price: `৳${randInt(2000, 10000)}`, originalPrice: `৳${randInt(3000, 15000)}`,
      tests: ['CBC', 'Blood Sugar', 'Lipid', 'ECG', 'X-Ray'].slice(0, 3 + randInt(0, 2)),
      description: 'Comprehensive health screening', discount: '30% OFF', validityDays: randInt(30, 90)
    })),
    insuranceProviders: Array.from({ length: 2 }, (_, ii) => ({
      id: `ins${ii}`, name: pick(['Green Delta', 'Pragati', 'Reliance', 'MetLife']),
      coverage: `${randInt(30, 90)}%`, type: pick(['Inpatient', 'Outpatient']),
      contactNumber: `+880-2-${randInt(1000000, 9999999)}`
    })),
    gallery: Array.from({ length: 5 }, (_, g) => ({
      id: `gal${g}`, url: HOSPITAL_IMAGES[(i + g) % 5], caption: pick(['Main Building', 'Patient Room', 'OT', 'ICU', 'Lab']), date: '2025'
    })),
    events: [{ id: 'e1', title: 'Free Health Camp', date: '2026-06-15', description: 'Free checkup', type: 'Camp', time: '9AM-3PM', venue: 'Auditorium' }],
    news: [{ id: 'n1', title: 'New Wing Opened', date: '2026-05-01', excerpt: 'State-of-the-art facility...', image: HOSPITAL_IMAGES[0], category: 'Expansion' }],
    faqs: [{ id: 'f1', question: 'Visiting hours?', answer: '10AM-8PM' }, { id: 'f2', question: 'How to book?', answer: 'Online or phone.' }],
    successStories: [{ id: 'ss1', title: 'Life Saved', description: 'Successful surgery.', patientName: 'Rahima', date: '2026-03', image: HOSPITAL_IMAGES[2] }],
    awards: [{ id: 'a1', name: 'Excellence Award', year: '2024', organization: 'Healthcare Asia', icon: Award, description: 'Best care.' }],
    branches: i < 3 ? [{ id: 'b1', name: `${name} Clinic`, location: 'Gulshan', phone: `+880-2-${1000000 + i}`, distance: '3km' }] : [],
    totalDoctors: randInt(50, 300), totalNurses: randInt(100, 600), totalStaff: randInt(200, 1000),
    specialistCount: randInt(30, 150), availableSpecialistsToday: randInt(10, 50),
    amenities: ['WiFi', 'Parking', 'Cafeteria', 'Prayer Room', 'Wheelchair', 'ATM'],
    parkingAvailable: true, cafeteriaAvailable: true, atmAvailable: i % 2 === 0,
    prayerRoom: true, wifiAvailable: true, wheelchairAccessible: true,
    homeSampleCollection: i % 3 === 0, waitingArea: true,
  }));
};

let cached: Hospital[] | null = null;
const getHospitals = () => { if (!cached) cached = generateHospitals(); return cached; };

// ============================================
// COLOR SYSTEM
// ============================================
const STAT_COLORS: Record<string, { bg: string; text: string; border: string; gradient: string }> = {
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', gradient: 'from-blue-500/20 to-blue-600/5' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', gradient: 'from-red-500/20 to-red-600/5' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', gradient: 'from-green-500/20 to-green-600/5' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', gradient: 'from-purple-500/20 to-purple-600/5' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', gradient: 'from-cyan-500/20 to-cyan-600/5' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', gradient: 'from-amber-500/20 to-amber-600/5' },
  teal: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20', gradient: 'from-teal-500/20 to-teal-600/5' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', gradient: 'from-pink-500/20 to-pink-600/5' },
  indigo: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', border: 'border-indigo-500/20', gradient: 'from-indigo-500/20 to-indigo-600/5' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', gradient: 'from-orange-500/20 to-orange-600/5' },
  yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', gradient: 'from-yellow-500/20 to-yellow-600/5' },
};

// ============================================
// ANIMATION VARIANTS
// ============================================
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } }
};

// ============================================
// HOSPITAL CARD
// ============================================
const HospitalCard: React.FC<{ hospital: Hospital; onSelect: (h: Hospital) => void }> = React.memo(({ hospital, onSelect }) => (
  <motion.div
    whileHover={{ y: -8, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={() => onSelect(hospital)}
    className="cursor-pointer"
    layout
  >
    <Card className="overflow-hidden p-0 group hover:border-cyan-600 hover:shadow-2xl transition-all duration-500 rounded-[2rem] border-slate-800 bg-slate-900">
      <div className="relative h-72 overflow-hidden">
        <img
          src={hospital.coverImage}
          alt={hospital.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
          onError={(e) => { (e.target as HTMLImageElement).src = HOSPITAL_IMAGES[0]; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
        <div className="absolute top-5 left-5 flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-xl rounded-full px-4 py-2 border border-white/20 shadow-xl">
            <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 drop-shadow-lg" />
            <span className="text-white font-black text-base">{hospital.rating}</span>
          </div>
          <Badge variant="info" className={`shadow-xl px-4 py-2 font-black text-xs border ${TYPE_BADGE[hospital.hospitalType]}`}>
            {hospital.hospitalType}
          </Badge>
        </div>
        {hospital.emergencyAvailable && (
          <div className="absolute top-5 right-5">
            <Badge variant="danger" className="flex items-center gap-1.5 shadow-xl px-4 py-2 animate-pulse border-2 border-red-300/50">
              <AlertCircle className="w-4 h-4" />
              <span className="text-xs font-black">24/7 ER</span>
            </Badge>
          </div>
        )}
        <div className="absolute bottom-6 left-6 right-6 flex items-start gap-5">
          <div className="w-22 h-22 rounded-2xl bg-white/20 backdrop-blur-xl p-2.5 shadow-2xl border border-white/30 flex-shrink-0">
            <img src={hospital.logo} alt={hospital.name} className="w-full h-full object-contain rounded-xl" />
          </div>
          <div className="min-w-0 pt-1">
            <h3 className="text-white font-black text-2xl leading-tight line-clamp-2 drop-shadow-lg">{hospital.name}</h3>
            <p className="text-white/80 text-sm mt-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span className="truncate">{hospital.location}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="p-6 space-y-5 bg-gradient-to-b from-slate-800 to-slate-800/50">
        <div className="grid grid-cols-4 gap-3">
          {[
            { icon: Bed, value: hospital.availableBeds, max: hospital.totalBeds, label: 'Beds', color: 'blue' },
            { icon: Activity, value: hospital.availableIcuBeds, max: hospital.icuBeds, label: 'ICU', color: 'red' },
            { icon: Stethoscope, value: hospital.availableSpecialistsToday, label: 'Specialists', color: 'green' },
            { icon: ThumbsUp, value: hospital.totalReviews, label: 'Reviews', color: 'purple' }
          ].map(s => {
            const I = s.icon;
            const c = STAT_COLORS[s.color];
            return (
              <div key={s.label} className={`text-center p-4 rounded-2xl ${c.bg} hover:shadow-md transition-shadow`}>
                <I className={`w-6 h-6 ${c.text} mx-auto mb-1.5`} />
                <p className="text-lg font-black text-white">{s.value}</p>
                {s.max ? (
                  <p className="text-xs text-slate-400 font-medium">/{s.max} {s.label}</p>
                ) : (
                  <p className="text-xs text-slate-400 font-medium">{s.label}</p>
                )}
              </div>
            );
          })}
        </div>
        <Button
          variant="primary"
          className="w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 text-white font-black shadow-lg py-4 text-lg tracking-wide hover:shadow-2xl transition-shadow"
        >
          View Full Details <ChevronRight className="w-6 h-6 ml-1.5" />
        </Button>
      </div>
    </Card>
  </motion.div>
));
HospitalCard.displayName = 'HospitalCard';

// ============================================
// 🏥 HOSPITAL DETAIL MODAL - COMPACT SIDEBAR LAYOUT
// ============================================
const HospitalDetailModal: React.FC<{ hospital: Hospital; onClose: () => void }> = ({ hospital, onClose }) => {
  const navigate = useNavigate();
  const isAuth = useAppSelector((s: any) => s.auth?.isAuthenticated);
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareTooltip, setShowShareTooltip] = useState(false);

  const sidebarItems: { id: TabId; label: string; icon: React.ElementType; count?: number; color: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'cyan' },
    { id: 'doctors', label: 'Doctors', icon: UserCheck, count: hospital.doctors.length, color: 'blue' },
    { id: 'departments', label: 'Departments', icon: Building, count: hospital.departments.length, color: 'purple' },
    { id: 'services', label: 'Services', icon: Wrench, count: hospital.services.length, color: 'teal' },
    { id: 'packages', label: 'Packages', icon: Package, count: hospital.healthPackages.length, color: 'amber' },
    { id: 'insurance', label: 'Insurance', icon: Umbrella, count: hospital.insuranceProviders.length, color: 'green' },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare, count: hospital.totalReviews, color: 'yellow' },
    { id: 'gallery', label: 'Gallery', icon: Image, count: hospital.gallery.length, color: 'pink' },
    { id: 'news', label: 'News', icon: FileText, color: 'indigo' },
    { id: 'faq', label: 'FAQ', icon: HelpCircle, count: hospital.faqs.length, color: 'orange' },
  ];

  const handleBook = useCallback(() => {
    navigate(isAuth ? '/patient/appointments/book' : '/login');
  }, [isAuth, navigate]);

  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: hospital.name,
        text: `Check out ${hospital.name} - ${hospital.about}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShowShareTooltip(true);
      setTimeout(() => setShowShareTooltip(false), 2000);
    }
  }, [hospital]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab hospital={hospital} />;
      case 'doctors': return <DoctorsTab hospital={hospital} onBook={handleBook} />;
      case 'departments': return <DepartmentsTab hospital={hospital} />;
      case 'services': return <ServicesTab hospital={hospital} />;
      case 'packages': return <PackagesTab hospital={hospital} />;
      case 'insurance': return <InsuranceTab hospital={hospital} />;
      case 'reviews': return <ReviewsTab hospital={hospital} />;
      case 'gallery': return <GalleryTab hospital={hospital} />;
      case 'news': return <NewsTab hospital={hospital} />;
      case 'faq': return <FAQTab hospital={hospital} expandedFaq={expandedFaq} setExpandedFaq={setExpandedFaq} />;
      default: return null;
    }
  };

  const activeItem = sidebarItems.find(item => item.id === activeTab);

  return (
    <Modal isOpen={true} onClose={onClose} size="full" className="max-h-[95vh] overflow-hidden rounded-[2rem] p-0 bg-slate-950">
      <div className="flex h-full max-h-[95vh]">
        
        {/* ============ COMPACT SIDEBAR (220px) ============ */}
        <aside className="w-[220px] flex-shrink-0 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 flex flex-col">
          
          {/* Hospital Image + Info Header */}
          <div className="relative h-40 overflow-hidden">
            <img 
              src={hospital.coverImage} 
              alt={hospital.name} 
              className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).src = HOSPITAL_IMAGES[0]; }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
            
            {/* Logo Overlay */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
              <div className="w-16 h-16 rounded-2xl bg-slate-800 p-1.5 border-2 border-slate-700 shadow-xl">
                <img src={hospital.logo} alt={hospital.name} className="w-full h-full object-contain rounded-xl" />
              </div>
            </div>
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 w-8 h-8 rounded-xl bg-black/40 hover:bg-red-500/30 flex items-center justify-center transition-all border border-white/10"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Hospital Name & Rating */}
          <div className="px-4 pt-10 pb-3 text-center border-b border-slate-800">
            <h3 className="text-white font-black text-xs leading-tight line-clamp-2">{hospital.name}</h3>
            <div className="flex items-center justify-center gap-1.5 mt-1.5">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                <span className="text-yellow-400 text-xs font-bold">{hospital.rating}</span>
              </div>
              <span className={`px-2 py-0.5 rounded-lg text-xs font-bold border ${TYPE_BADGE[hospital.hospitalType]}`}>
                {hospital.hospitalType}
              </span>
            </div>
          </div>

          {/* Quick Contact Buttons */}
          <div className="px-3 py-2 grid grid-cols-2 gap-1.5 border-b border-slate-800">
            <a href={`tel:${hospital.emergencyPhone}`} 
              className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-bold hover:bg-red-500/20 transition-all">
              <PhoneCall className="w-3 h-3" /> ER
            </a>
            <a href={`tel:${hospital.phone}`}
              className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold hover:bg-green-500/20 transition-all">
              <Phone className="w-3 h-3" /> Call
            </a>
            <a href={`mailto:${hospital.email}`}
              className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold hover:bg-blue-500/20 transition-all">
              <Mail className="w-3 h-3" /> Mail
            </a>
            <a href={hospital.website} target="_blank" rel="noopener"
              className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-bold hover:bg-purple-500/20 transition-all">
              <Globe2 className="w-3 h-3" /> Web
            </a>
          </div>

          {/* Navigation Menu - Compact */}
          <nav className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
            {sidebarItems.map((item) => {
              const isActive = activeTab === item.id;
              const Icon = item.icon;
              const colors = STAT_COLORS[item.color];
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                    isActive
                      ? `bg-gradient-to-r ${colors.gradient} ${colors.text} border ${colors.border} shadow-md`
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                  }`}
                >
                  <div className={`p-1.5 rounded-lg transition-all flex-shrink-0 ${
                    isActive ? `${colors.bg}` : 'bg-slate-800/50 group-hover:bg-slate-800'
                  }`}>
                    <Icon className={`w-3.5 h-3.5 ${isActive ? colors.text : ''}`} />
                  </div>
                  <span className="flex-1 text-left truncate">{item.label}</span>
                  {item.count !== undefined && (
                    <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black flex-shrink-0 ${
                      isActive ? `${colors.bg} ${colors.text}` : 'bg-slate-800 text-slate-500'
                    }`}>
                      {item.count > 999 ? `${(item.count / 1000).toFixed(1)}k` : item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Book Button */}
          <div className="p-3 border-t border-slate-800">
            <Button
              variant="primary"
              onClick={handleBook}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black py-2.5 rounded-xl shadow-lg hover:scale-105 transition-transform text-xs"
            >
              <Calendar className="w-3.5 h-3.5 mr-1.5" /> Book Now
            </Button>
          </div>
        </aside>

        {/* ============ MAIN CONTENT ============ */}
        <main className="flex-1 flex flex-col overflow-hidden">
          
          {/* Top Bar */}
          <header className="flex-shrink-0 px-6 py-3 border-b border-slate-800 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${STAT_COLORS[activeItem?.color || 'cyan'].gradient} border ${STAT_COLORS[activeItem?.color || 'cyan'].border}`}>
                {activeItem && <activeItem.icon className={`w-4 h-4 ${STAT_COLORS[activeItem.color].text}`} />}
              </div>
              <div>
                <h2 className="text-sm font-black text-white">{activeItem?.label}</h2>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Quick Stats */}
              <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[10px]">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <BedDouble className="w-3 h-3 text-cyan-400" />
                  <span className="font-bold text-white">{hospital.availableBeds}</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <ActivitySquare className="w-3 h-3 text-red-400" />
                  <span className="font-bold text-white">{hospital.availableIcuBeds}</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Clock3 className="w-3 h-3 text-green-400" />
                  <span className="font-bold text-white">24/7</span>
                </span>
              </div>

              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-all border border-slate-700/50"
                aria-label="Bookmark"
              >
                <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'text-yellow-400 fill-yellow-400' : 'text-slate-400'}`} />
              </button>
              
              <div className="relative">
                <button
                  onClick={handleShare}
                  className="p-1.5 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-all border border-slate-700/50"
                  aria-label="Share"
                >
                  <Share2 className="w-3.5 h-3.5 text-slate-400" />
                </button>
                {showShareTooltip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-full mt-2 right-0 px-3 py-1.5 bg-green-500 text-white text-[10px] font-bold rounded-lg shadow-xl whitespace-nowrap z-50"
                  >
                    Copied!
                  </motion.div>
                )}
              </div>
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={fadeInUp}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.2 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </Modal>
  );
};

// ============================================
// SECTION HEADER COMPONENT
// ============================================
const SectionHeader: React.FC<{
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  color?: string;
}> = ({ icon: Icon, title, subtitle, action, color = 'cyan' }) => {
  const colors = STAT_COLORS[color];
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-gradient-to-br ${colors.gradient} border ${colors.border}`}>
          <Icon className={`w-4 h-4 ${colors.text}`} />
        </div>
        <div>
          <h3 className="text-lg font-black text-white">{title}</h3>
          {subtitle && <p className="text-[11px] text-slate-400 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
};

// ============================================
// OVERVIEW TAB
// ============================================
const OverviewTab: React.FC<{ hospital: Hospital }> = ({ hospital }) => (
  <div className="space-y-6">
    {/* Quick Stats */}
    <div className="grid grid-cols-4 gap-3">
      {[
        { icon: BedDouble, label: 'Beds', value: hospital.availableBeds, max: hospital.totalBeds, color: 'blue' },
        { icon: ActivitySquare, label: 'ICU', value: hospital.availableIcuBeds, max: hospital.icuBeds, color: 'red' },
        { icon: Timer, label: 'Emergency', value: '24/7', color: 'green' },
        { icon: TrendingUp, label: 'Rating', value: hospital.rating, sub: '/5', color: 'purple' },
      ].map((stat) => {
        const Icon = stat.icon;
        const colors = STAT_COLORS[stat.color];
        return (
          <div key={stat.label} className={`p-4 rounded-xl bg-gradient-to-br ${colors.gradient} border ${colors.border}`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${colors.text}`} />
              <span className="text-[10px] text-slate-400">{stat.label}</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black text-white">{stat.value}</span>
              {stat.max && <span className="text-xs text-slate-500">/ {stat.max}</span>}
              {stat.sub && <span className="text-xs text-slate-500">{stat.sub}</span>}
            </div>
          </div>
        );
      })}
    </div>

    {/* About & Mission */}
    <div className="grid grid-cols-2 gap-4">
      <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800">
        <SectionHeader icon={Building2} title="About" color="cyan" />
        <p className="text-sm text-slate-300 leading-relaxed">{hospital.about}</p>
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-800 text-[11px] text-slate-500">
          <span>Est. {hospital.established}</span>
          <span>•</span>
          <span>{hospital.workingHours}</span>
        </div>
      </div>
      
      <div className="p-5 rounded-xl bg-slate-900/50 border border-slate-800">
        <SectionHeader icon={Award} title="Mission & Vision" color="amber" />
        <div className="space-y-2.5">
          <div className="p-3 rounded-lg bg-cyan-500/5 border border-cyan-500/10">
            <p className="text-[10px] font-black text-cyan-400 uppercase mb-0.5">🎯 Mission</p>
            <p className="text-xs text-slate-300">{hospital.mission}</p>
          </div>
          <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
            <p className="text-[10px] font-black text-purple-400 uppercase mb-0.5">🔭 Vision</p>
            <p className="text-xs text-slate-300">{hospital.vision}</p>
          </div>
        </div>
      </div>
    </div>

    {/* Facilities */}
    <div>
      <SectionHeader icon={BedDouble} title="Facilities" color="green" />
      <div className="grid grid-cols-6 gap-2">
        {[
          { label: 'Total Beds', value: hospital.totalBeds },
          { label: 'Available', value: hospital.availableBeds },
          { label: 'ICU Beds', value: hospital.icuBeds },
          { label: 'ICU Avail', value: hospital.availableIcuBeds },
          { label: 'Cabins', value: hospital.cabinRooms },
          { label: 'Cabin Avail', value: hospital.availableCabinRooms },
          { label: 'OT Rooms', value: hospital.operationTheaters },
          { label: 'ER Rooms', value: hospital.emergencyRooms },
          { label: 'Staff', value: hospital.totalStaff },
          { label: 'Doctors', value: hospital.totalDoctors },
          { label: 'Nurses', value: hospital.totalNurses },
          { label: 'Specialists', value: hospital.availableSpecialistsToday },
        ].map((item) => (
          <div key={item.label} className="p-3 text-center rounded-lg bg-slate-800/30 border border-slate-700/30 hover:border-cyan-500/20 transition-all">
            <p className="text-xl font-black text-white">{item.value}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{item.label}</p>
          </div>
        ))}
      </div>
    </div>

    {/* Amenities */}
    <div>
      <SectionHeader icon={Coffee} title="Amenities" color="cyan" />
      <div className="grid grid-cols-4 gap-2">
        {[
          { available: hospital.wifiAvailable, label: 'WiFi', icon: Wifi },
          { available: hospital.parkingAvailable, label: 'Parking', icon: Car },
          { available: hospital.cafeteriaAvailable, label: 'Cafeteria', icon: Coffee },
          { available: hospital.prayerRoom, label: 'Prayer', icon: Building2 },
          { available: hospital.wheelchairAccessible, label: 'Wheelchair', icon: Accessibility },
          { available: hospital.atmAvailable, label: 'ATM', icon: CreditCard },
          { available: hospital.waitingArea, label: 'Waiting', icon: Clock },
          { available: hospital.homeSampleCollection, label: 'Home Collect', icon: Truck },
        ].map((amenity) => (
          <div key={amenity.label} className={`p-3 rounded-lg flex items-center gap-2 border ${
            amenity.available ? 'bg-slate-800/30 border-green-500/20' : 'bg-slate-800/10 border-slate-700/30 opacity-50'
          }`}>
            <amenity.icon className={`w-3.5 h-3.5 ${amenity.available ? 'text-green-400' : 'text-slate-600'}`} />
            <span className="text-[11px] font-bold text-white">{amenity.label}</span>
            {amenity.available && <CheckCircle2 className="w-3 h-3 text-green-400 ml-auto" />}
          </div>
        ))}
      </div>
    </div>

    {/* Awards */}
    {hospital.awards.length > 0 && (
      <div>
        <SectionHeader icon={Award} title="Awards" color="amber" />
        <div className="grid grid-cols-3 gap-3">
          {hospital.awards.map((award) => {
            const Icon = award.icon;
            return (
              <div key={award.id} className="p-4 text-center rounded-xl bg-slate-900/50 border border-slate-800 hover:border-amber-500/20 transition-all">
                <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-amber-400" />
                </div>
                <h4 className="font-black text-white text-xs">{award.name}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{award.organization}</p>
                <span className="inline-block mt-2 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[10px] font-bold">{award.year}</span>
              </div>
            );
          })}
        </div>
      </div>
    )}

    {/* Branches */}
    {hospital.branches.length > 0 && (
      <div>
        <SectionHeader icon={MapPinned} title="Branches" color="purple" />
        <div className="space-y-2">
          {hospital.branches.map((branch) => (
            <div key={branch.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-purple-400" />
                <div>
                  <h4 className="font-black text-white text-xs">{branch.name}</h4>
                  <p className="text-[10px] text-slate-500">{branch.location} • {branch.distance}</p>
                </div>
              </div>
              <a href={`tel:${branch.phone}`} className="text-[11px] font-bold text-green-400 hover:text-green-300">
                {branch.phone}
              </a>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// ============================================
// DOCTORS TAB
// ============================================
const DoctorsTab: React.FC<{ hospital: Hospital; onBook: () => void }> = ({ hospital, onBook }) => (
  <div className="space-y-3">
    <SectionHeader
      icon={UserCheck}
      title="Consultants"
      subtitle={`${hospital.totalDoctors} doctors • ${hospital.availableSpecialistsToday} available`}
      color="blue"
      action={
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          {hospital.availableSpecialistsToday} Available
        </span>
      }
    />
    <div className="space-y-3">
      {hospital.doctors.map((doctor) => (
        <div key={doctor.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/20 transition-all flex items-center gap-4">
          <div className="relative flex-shrink-0">
            <img src={doctor.image} alt={doctor.name} className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-700" />
            <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
              doctor.isAvailable ? 'bg-emerald-400' : 'bg-slate-500'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-black text-white text-sm">{doctor.name}</h4>
              {doctor.isAvailable && (
                <span className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Avail</span>
              )}
            </div>
            <p className="text-xs font-bold text-cyan-400">{doctor.specialization}</p>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
              <span>{doctor.degree}</span>
              <span>•</span>
              <span>{doctor.experience}y</span>
              <span>•</span>
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="text-white font-bold">{doctor.rating}</span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{doctor.fee}</p>
            <Button variant="primary" size="sm" onClick={onBook} className="mt-1 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg text-[10px] py-1.5 px-3">
              <Calendar className="w-3 h-3 mr-1" /> Book
            </Button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// DEPARTMENTS TAB
// ============================================
const DepartmentsTab: React.FC<{ hospital: Hospital }> = ({ hospital }) => (
  <div className="space-y-3">
    <SectionHeader icon={Building} title="Departments" color="purple" />
    <div className="grid grid-cols-3 gap-3">
      {hospital.departments.map((dept) => {
        const Icon = dept.icon;
        return (
          <div key={dept.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-purple-500/20 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                <Icon className="w-4 h-4 text-purple-400" />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">
                {dept.availableToday} avail
              </span>
            </div>
            <h4 className="font-black text-white text-xs">{dept.name}</h4>
            <p className="text-[10px] text-slate-500 mt-1">{dept.description}</p>
            <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-800 text-[10px] text-slate-500">
              <span>👨‍⚕️ {dept.doctors}</span>
              <span>🛏️ {dept.beds}</span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">Head: <span className="font-bold text-slate-300">{dept.headOfDepartment}</span></p>
          </div>
        );
      })}
    </div>
  </div>
);

// ============================================
// SERVICES TAB
// ============================================
const ServicesTab: React.FC<{ hospital: Hospital }> = ({ hospital }) => (
  <div className="space-y-3">
    <SectionHeader icon={Wrench} title="Services" color="teal" />
    <div className="grid grid-cols-3 gap-3">
      {hospital.services.map((service) => {
        const Icon = service.icon;
        return (
          <div key={service.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-teal-500/20 transition-all">
            <div className="flex items-start justify-between mb-2">
              <div className="p-2 rounded-lg bg-teal-500/10">
                <Icon className="w-4 h-4 text-teal-400" />
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold">Available</span>
            </div>
            <h4 className="font-black text-white text-xs">{service.name}</h4>
            <p className="text-[10px] text-slate-500 mt-1">{service.description}</p>
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {service.hours}</span>
              {service.price && <span className="text-xs font-black text-teal-400">{service.price}</span>}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

// ============================================
// PACKAGES TAB
// ============================================
const PackagesTab: React.FC<{ hospital: Hospital }> = ({ hospital }) => (
  <div className="space-y-3">
    <SectionHeader icon={Package} title="Health Packages" color="amber" />
    <div className="grid grid-cols-2 gap-4">
      {hospital.healthPackages.map((pkg) => (
        <div key={pkg.id} className="p-5 rounded-xl bg-gradient-to-br from-amber-500/5 via-slate-900/50 to-yellow-500/5 border-2 border-amber-500/20 hover:border-amber-500/30 transition-all">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-black text-white text-sm">{pkg.name}</h4>
            <span className="px-2.5 py-1 rounded-md bg-red-500/20 text-red-400 text-[10px] font-black">{pkg.discount}</span>
          </div>
          <div className="flex items-baseline gap-2 mb-1.5">
            <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-400">{pkg.price}</p>
            <p className="text-[10px] line-through text-slate-600">{pkg.originalPrice}</p>
          </div>
          <p className="text-[10px] text-slate-500 mb-1">Valid {pkg.validityDays} days</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            {pkg.tests.map((test) => (
              <span key={test} className="px-2 py-1 rounded-md bg-slate-800 text-[10px] text-slate-300 font-bold">✅ {test}</span>
            ))}
          </div>
          <Button variant="primary" size="sm" className="w-full mt-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-[10px] py-2">
            Book Package <ArrowUpRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// INSURANCE TAB
// ============================================
const InsuranceTab: React.FC<{ hospital: Hospital }> = ({ hospital }) => (
  <div className="space-y-3">
    <SectionHeader icon={Umbrella} title="Insurance Partners" color="green" />
    <div className="space-y-2">
      {hospital.insuranceProviders.map((provider) => (
        <div key={provider.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-green-500/10 border border-green-500/20">
            <Shield className="w-4 h-4 text-green-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-black text-white text-xs">{provider.name}</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Coverage: <span className="font-bold text-green-400">{provider.coverage}</span> • {provider.type}</p>
          </div>
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Accepted
          </span>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// REVIEWS TAB
// ============================================
const ReviewsTab: React.FC<{ hospital: Hospital }> = ({ hospital }) => (
  <div className="space-y-3">
    <SectionHeader
      icon={MessageSquare}
      title="Reviews"
      subtitle={`${hospital.totalReviews.toLocaleString()} reviews`}
      color="amber"
      action={
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
          <span className="font-black text-white text-xs">{hospital.rating}</span>
          <span className="text-[10px] text-slate-400">/5.0</span>
        </span>
      }
    />
    <div className="grid grid-cols-2 gap-3">
      {hospital.reviews.map((review) => (
        <div key={review.id} className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all">
          <div className="flex items-center gap-2.5 mb-2.5">
            <img src={review.avatar} alt={review.patientName} className="w-8 h-8 rounded-full ring-2 ring-slate-700 object-cover" />
            <div className="flex-1">
              <div className="flex items-center gap-1">
                <h4 className="font-black text-white text-xs">{review.patientName}</h4>
                {review.verified && <BadgeCheck className="w-3 h-3 text-blue-400" />}
              </div>
              <p className="text-[10px] text-slate-500">{review.treatment} • {review.date}</p>
            </div>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-600'}`} />
              ))}
            </div>
          </div>
          <p className="text-xs text-slate-300 italic">"{review.comment}"</p>
          <div className="flex items-center gap-3 mt-2.5 pt-2.5 border-t border-slate-800 text-[10px] text-slate-500">
            <button className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <ThumbsUp className="w-3 h-3" /> {review.helpful}
            </button>
            <button className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <Share2 className="w-3 h-3" /> Share
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// GALLERY TAB
// ============================================
const GalleryTab: React.FC<{ hospital: Hospital }> = ({ hospital }) => (
  <div className="space-y-3">
    <SectionHeader icon={Image} title="Gallery" color="pink" />
    <div className="grid grid-cols-3 gap-3">
      {hospital.gallery.map((item) => (
        <div key={item.id} className="relative rounded-xl overflow-hidden h-40 group cursor-pointer">
          <img src={item.url} alt={item.caption} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <p className="text-white font-bold text-xs">{item.caption}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// NEWS TAB
// ============================================
const NewsTab: React.FC<{ hospital: Hospital }> = ({ hospital }) => (
  <div className="space-y-6">
    {hospital.events.length > 0 && (
      <div>
        <SectionHeader icon={CalendarDays} title="Events" color="cyan" />
        <div className="space-y-2">
          {hospital.events.map((event) => (
            <div key={event.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <CalendarDays className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-white text-xs">{event.title}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">📅 {event.date} • ⏰ {event.time} • 📍 {event.venue}</p>
              </div>
              <Button variant="primary" size="sm" className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md text-[10px] py-1.5 px-3">Register</Button>
            </div>
          ))}
        </div>
      </div>
    )}
    
    {hospital.news.length > 0 && (
      <div>
        <SectionHeader icon={FileText} title="News" color="indigo" />
        <div className="space-y-2">
          {hospital.news.map((article) => (
            <div key={article.id} className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 flex gap-3">
              <img src={article.image} alt={article.title} className="w-20 h-20 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1">
                <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold">{article.category}</span>
                <h4 className="font-black text-white text-xs mt-1">{article.title}</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">{article.excerpt}</p>
                <p className="text-[10px] text-slate-500 mt-1">📅 {article.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// ============================================
// FAQ TAB
// ============================================
const FAQTab: React.FC<{
  hospital: Hospital;
  expandedFaq: string | null;
  setExpandedFaq: (id: string | null) => void;
}> = ({ hospital, expandedFaq, setExpandedFaq }) => (
  <div className="space-y-3">
    <SectionHeader icon={HelpCircle} title="FAQ" color="orange" />
    <div className="space-y-1.5">
      {hospital.faqs.map((faq) => (
        <div
          key={faq.id}
          onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
          className="p-3 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-orange-500/20 transition-all cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-3.5 h-3.5 text-orange-400" />
              <h4 className="font-black text-white text-xs">{faq.question}</h4>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-orange-400 transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''}`} />
          </div>
          {expandedFaq === faq.id && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="overflow-hidden"
            >
              <p className="text-xs text-slate-300 mt-2 pt-2 border-t border-slate-800 pl-5">{faq.answer}</p>
            </motion.div>
          )}
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// LOGIN MODAL
// ============================================
const LoginModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const nav = useNavigate();
  return (
    <Modal isOpen={true} onClose={onClose} size="sm">
      <div className="text-center p-8 bg-slate-900">
        <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 flex items-center justify-center border border-amber-500/20">
          <LogIn className="w-8 h-8 text-amber-400" />
        </div>
        <h3 className="text-xl font-black text-white mb-2">Login Required</h3>
        <p className="text-sm text-slate-400 mb-6">Please login to book an appointment</p>
        <div className="space-y-3">
          <Button variant="primary" onClick={() => nav('/login')} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-3 text-sm font-black rounded-xl">
            Login to Continue
          </Button>
          <Button variant="outline" onClick={() => nav('/register')} className="w-full py-3 text-sm rounded-xl">
            Create Account
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full text-slate-400 hover:text-white text-sm">
            Maybe Later
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================
// MAIN HOSPITALS PAGE
// ============================================
const Hospitals: React.FC = () => {
  const hospitals = useMemo(() => getHospitals(), []);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedHospital, setSelectedHospital] = useState<Hospital | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'rating' | 'beds' | 'reviews'>('rating');

  const filteredHospitals = useMemo(() => {
    let result = [...hospitals];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(h => h.name.toLowerCase().includes(q) || h.location.toLowerCase().includes(q));
    }
    if (typeFilter !== 'all') result = result.filter(h => h.hospitalType === typeFilter);
    if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'beds') result.sort((a, b) => b.totalBeds - a.totalBeds);
    else result.sort((a, b) => b.totalReviews - a.totalReviews);
    return result;
  }, [searchQuery, typeFilter, sortBy, hospitals]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <Badge variant="info" className="mb-4 px-6 py-2.5 text-sm shadow-xl font-bold">
            <Sparkles className="w-4 h-4 mr-2" /> {hospitals.length} Hospitals • Real-Time Data
          </Badge>
          <h1 className="text-5xl sm:text-7xl font-black text-white mb-4 tracking-tight">
            Top{' '}
            <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 bg-clip-text text-transparent">
              Hospitals
            </span>{' '}
            in Dhaka
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Find the best hospitals with real ratings, ICU beds, specialists & more
          </p>
        </motion.div>

        <GlassmorphicCard className="p-5 mb-8 shadow-xl bg-slate-900/80 border-slate-700/50">
          <div className="flex flex-col md:flex-row gap-3">
            <Input
              placeholder="Search hospitals by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<Search className="w-5 h-5" />}
              className="flex-1"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-5 py-3.5 rounded-xl border border-slate-700 bg-slate-900 font-bold text-sm cursor-pointer text-white focus:ring-2 focus:ring-cyan-500/50 transition-all"
            >
              <option value="rating">⭐ Sort by Rating</option>
              <option value="beds">🛏️ Sort by Beds</option>
              <option value="reviews">📝 Sort by Reviews</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-5 py-3.5 rounded-xl border border-slate-700 bg-slate-900 font-bold text-sm cursor-pointer text-white focus:ring-2 focus:ring-cyan-500/50 transition-all"
            >
              <option value="all">🏥 All Types</option>
              <option value="Private">💎 Private</option>
              <option value="Government">🏛️ Government</option>
              <option value="Specialized">🔬 Specialized</option>
              <option value="Medical College">🎓 Medical College</option>
            </select>
          </div>
        </GlassmorphicCard>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6 text-sm text-slate-400 font-medium">
          Found <span className="font-black text-white text-lg">{filteredHospitals.length}</span> hospitals
        </motion.p>

        <motion.div variants={staggerContainer} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHospitals.map((hospital) => (
            <HospitalCard key={hospital.id} hospital={hospital} onSelect={setSelectedHospital} />
          ))}
        </motion.div>

        {filteredHospitals.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Info className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-bold">No hospitals found</p>
            <p className="text-slate-500 text-sm mt-2">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {selectedHospital && <HospitalDetailModal hospital={selectedHospital} onClose={() => setSelectedHospital(null)} />}
      </AnimatePresence>
      <AnimatePresence>
        {loginOpen && <LoginModal onClose={() => setLoginOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default Hospitals;