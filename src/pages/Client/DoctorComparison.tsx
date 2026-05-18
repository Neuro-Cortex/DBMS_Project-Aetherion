// src/pages/client/DoctorComparison.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientSidebar from 'src/components/client/clientSidebar';
import {
  Stethoscope, Star, DollarSign, MapPin, Clock,
  Award, GraduationCap, Search, Filter, ChevronRight,
  CheckCircle2, XCircle, TrendingUp, ArrowRight,
  Users, ThumbsUp, MessageCircle, Shield, Heart
} from 'lucide-react';

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  availability: 'available' | 'busy' | 'offline';
  nextAvailable: string;
  hospital: string;
  location: string;
  distance: number;
  education: string[];
  languages: string[];
  avatar: string;
  patientsServed: number;
  successRate: number;
  waitTime: string;
  onlineConsultation: boolean;
  insuranceAccepted: string[];
  awards: string[];
  reviews: { rating: number; comment: string; patient: string }[];
}

const doctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    experience: 15,
    rating: 4.9,
    reviewCount: 234,
    consultationFee: 150,
    availability: 'available',
    nextAvailable: 'Today, 10:00 AM',
    hospital: 'City General Hospital',
    location: 'Downtown Medical District',
    distance: 2.5,
    education: ['Harvard Medical School', 'Johns Hopkins Residency'],
    languages: ['English', 'Spanish'],
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    patientsServed: 5000,
    successRate: 98,
    waitTime: '10 mins',
    onlineConsultation: true,
    insuranceAccepted: ['Blue Cross', 'Aetna', 'Cigna'],
    awards: ['Best Cardiologist 2023', 'Patient Choice Award'],
    reviews: [
      { rating: 5, comment: 'Excellent doctor! Very thorough and caring.', patient: 'John D.' },
      { rating: 5, comment: 'Saved my fathers life. Forever grateful.', patient: 'Maria G.' },
    ],
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Cardiology',
    experience: 12,
    rating: 4.8,
    reviewCount: 189,
    consultationFee: 200,
    availability: 'busy',
    nextAvailable: 'Tomorrow, 2:00 PM',
    hospital: 'Metro Medical Center',
    location: 'North Medical Hub',
    distance: 5.1,
    education: ['Stanford Medical School', 'Mayo Clinic Fellowship'],
    languages: ['English', 'Mandarin'],
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    patientsServed: 3800,
    successRate: 96,
    waitTime: '15 mins',
    onlineConsultation: true,
    insuranceAccepted: ['United Health', 'Aetna', 'Humana'],
    awards: ['Top Doctor 2024', 'Research Excellence'],
    reviews: [
      { rating: 5, comment: 'Very knowledgeable and professional.', patient: 'Robert K.' },
      { rating: 4, comment: 'Good doctor but long wait times.', patient: 'Lisa M.' },
    ],
  },
  {
    id: '3',
    name: 'Dr. Emily Davis',
    specialty: 'Cardiology',
    experience: 10,
    rating: 4.9,
    reviewCount: 312,
    consultationFee: 120,
    availability: 'available',
    nextAvailable: 'Today, 3:30 PM',
    hospital: 'Sunshine Clinic',
    location: 'East Side Medical',
    distance: 3.8,
    education: ['Johns Hopkins University', 'Cleveland Clinic Fellowship'],
    languages: ['English', 'French'],
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    patientsServed: 4200,
    successRate: 97,
    waitTime: '5 mins',
    onlineConsultation: true,
    insuranceAccepted: ['Blue Cross', 'Cigna', 'Medicare'],
    awards: ['Rising Star Award', 'Patient Satisfaction'],
    reviews: [
      { rating: 5, comment: 'Amazing bedside manner. Highly recommend!', patient: 'Sarah W.' },
      { rating: 5, comment: 'Explains everything clearly. Great doctor.', patient: 'Tom H.' },
    ],
  },
];

const specialties = ['All', 'Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'];

const ClientDoctorComparison: React.FC = () => {
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);
  const [specialtyFilter, setSpecialtyFilter] = useState('All');
  const [sortBy, setSortBy] = useState<'rating' | 'fee' | 'experience'>('rating');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDoctors = doctors
    .filter(d => {
      const matchSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchSpecialty = specialtyFilter === 'All' || d.specialty === specialtyFilter;
      return matchSearch && matchSpecialty;
    })
    .sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'fee') return a.consultationFee - b.consultationFee;
      return b.experience - a.experience;
    });

  const toggleDoctor = (id: string) => {
    if (selectedDoctors.includes(id)) {
      setSelectedDoctors(selectedDoctors.filter(d => d !== id));
    } else if (selectedDoctors.length < 3) {
      setSelectedDoctors([...selectedDoctors, id]);
    }
  };

  const comparedDoctors = doctors.filter(d => selectedDoctors.includes(d.id));

  return (
    <div className="min-h-screen bg-[#050508]">
      <ClientSidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Stethoscope className="w-8 h-8 text-cyan-400" />
            Doctor Comparison
          </h1>
          <p className="text-white/40 text-sm mt-1">
            Compare doctors by ratings, fees, experience & more
          </p>
        </div>

        {/* Search & Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm outline-none focus:border-cyan-400/50 transition-all"
            />
          </div>
          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/60 text-sm outline-none"
          >
            {specialties.map(s => (
              <option key={s} value={s} className="bg-gray-900">{s}</option>
            ))}
          </select>
        </div>

        {/* Sort Buttons */}
        <div className="flex gap-2 mb-6">
          {([
            { id: 'rating', label: '⭐ Rating' },
            { id: 'fee', label: '💰 Fee' },
            { id: 'experience', label: '📚 Experience' },
          ] as const).map(sort => (
            <button
              key={sort.id}
              onClick={() => setSortBy(sort.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                sortBy === sort.id
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                  : 'bg-white/[0.02] text-white/40 border border-white/[0.04]'
              }`}
            >
              {sort.label}
            </button>
          ))}
        </div>

        {/* Selected Doctors Count */}
        <div className="mb-4 text-white/40 text-sm">
          Selected: {selectedDoctors.length}/3 doctors to compare
        </div>

        {/* Doctor Cards */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {filteredDoctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => toggleDoctor(doctor.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                selectedDoctors.includes(doctor.id)
                  ? 'bg-cyan-500/5 border-cyan-500/30 ring-1 ring-cyan-500/20'
                  : 'bg-white/[0.02] border-white/[0.04] hover:border-white/[0.1]'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={doctor.avatar}
                  alt={doctor.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-white/[0.08]"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold">{doctor.name}</h3>
                  <p className="text-cyan-400 text-sm">{doctor.specialty}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-white/50 text-sm">{doctor.rating}</span>
                    <span className="text-white/30 text-xs">({doctor.reviewCount})</span>
                  </div>
                </div>
                {selectedDoctors.includes(doctor.id) && (
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/40">Experience</span>
                  <span className="text-white">{doctor.experience} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Fee</span>
                  <span className="text-emerald-400 font-medium">${doctor.consultationFee}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Distance</span>
                  <span className="text-white">{doctor.distance} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">Status</span>
                  <span className={`${
                    doctor.availability === 'available' ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {doctor.availability}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Comparison Table */}
        {selectedDoctors.length >= 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-cyan-500/20 overflow-x-auto"
          >
            <h3 className="text-white font-semibold text-lg mb-6">Detailed Comparison</h3>
            
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.04]">
                  <th className="text-left py-3 text-white/40 font-medium">Feature</th>
                  {comparedDoctors.map(d => (
                    <th key={d.id} className="text-center py-3 text-white font-medium">{d.name.split(' ')[1]}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Rating', key: 'rating', suffix: '⭐' },
                  { label: 'Reviews', key: 'reviewCount', suffix: '' },
                  { label: 'Experience', key: 'experience', suffix: ' years' },
                  { label: 'Consultation Fee', key: 'consultationFee', prefix: '$' },
                  { label: 'Distance', key: 'distance', suffix: ' km' },
                  { label: 'Wait Time', key: 'waitTime', suffix: '' },
                  { label: 'Success Rate', key: 'successRate', suffix: '%' },
                  { label: 'Patients Served', key: 'patientsServed', suffix: '+' },
                  { label: 'Online Consultation', key: 'onlineConsultation', isBoolean: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/[0.02]">
                    <td className="py-3 text-white/50">{row.label}</td>








                    {comparedDoctors.map(d => (
                      <td key={d.id} className="py-3 text-center text-white">
                        {row.isBoolean ? (
                          d[row.key as keyof Doctor] ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 mx-auto" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400 mx-auto" />
                          )
                        ) :
                        
                        
                        
                        (
                          <span className={row.key === 'consultationFee' ? 'text-emerald-400 font-medium' : ''}>
                            {row.prefix || ''}{d[row.key as keyof Doctor]}{row.suffix || ''}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>




















            {/* Book Button */}
            <div className="mt-6 text-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center gap-2 mx-auto"
              >
                Book with Selected Doctor
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ClientDoctorComparison;