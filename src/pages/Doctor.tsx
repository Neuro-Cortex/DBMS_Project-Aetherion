// src/pages/Doctors.tsx
// ALL EXISTING UI COMPONENTS USED + ALL FEATURES PRESERVED
import React, { useState, useEffect,  useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, MapPin, Star, Clock, Calendar, Phone, Video,
  Building2, Award, GraduationCap, Languages,
   CheckCircle, Eye, MessageCircle,
  Users, DollarSign, ThumbsUp, AlertCircle, 
  Sparkles, BadgeCheck,  Crown
} from 'lucide-react';
import { useAppSelector } from '../store';

// ============================================
// ✅ ALL EXISTING UI COMPONENTS
// ============================================
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
interface Doctor {
  id: string; name: string; title: string; image: string;
  specialization: string; rating: number; reviews: number;
  experience: number; location: string; distance: string;
  availability: 'available' | 'busy' | 'offline'; nextAvailable: string;
  fee: string; hospital: string; hospitalAddress: string;
  clinic: string; clinicAddress: string; education: string;
  languages: string[]; awards: string[]; totalPatients: number;
  successRate: number; isVerified: boolean;
  schedule: { day: string; time: string; hospital: string }[];
  phone: string; videoConsult: boolean;
  onlineConsult: boolean; chatAvailable: boolean;
  waitTime: string; acceptingNewPatients: boolean;
  achievements: string[];
  consultationModes: ('in-person' | 'video' | 'phone' | 'chat')[];
  about: string;
}

// ============================================
// GENERATE 65 DOCTORS
// ============================================
const generateDoctors = (): Doctor[] => {
  const firstNames = ['Sarah','James','Emily','Michael','Lisa','Robert','Maria','David','Jennifer','William','Patricia','Richard','Barbara','Joseph','Susan','Charles','Margaret','Thomas','Dorothy','Christopher','Amanda','Daniel','Melissa','Matthew','Stephanie','Anthony','Rebecca','Mark','Laura','Donald','Helen','Steven','Nicole','Paul','Jessica','Andrew','Elizabeth','Joshua','Sandra','Kenneth','Ashley','Kevin','Kimberly','Brian','Deborah','George','Nancy','Edward','Karen','Ronald','Betty','Timothy','Linda','Jason','Carol','Jeffrey','Shirley','Ryan','Cynthia','Jacob','Angela','Gary','Emma','Nicholas','Brenda','Eric'];
  const lastNames = ['Wilson','Lee','Chen','Park','Anderson','Kim','Garcia','Thompson','Martinez','Robinson','Clark','Rodriguez','Lewis','Walker','Hall','Allen','Young','Hernandez','King','Wright','Lopez','Hill','Scott','Green','Adams','Baker','Gonzalez','Nelson','Carter','Mitchell','Perez','Roberts','Turner','Phillips','Campbell','Parker','Evans','Edwards','Collins','Stewart','Sanchez','Morris','Rogers','Reed','Cook','Morgan','Bell','Murphy','Bailey','Rivera','Cooper','Richardson','Cox','Howard','Ward','Torres','Peterson','Gray','Ramirez','James','Watson','Brooks','Kelly','Sanders','Price'];
  const specializations = ['Cardiologist','Neurologist','Pediatrician','Dermatologist','Orthopedic Surgeon','Oncologist','Psychiatrist','Ophthalmologist','ENT Specialist','Gastroenterologist','Pulmonologist','Endocrinologist','Rheumatologist','Nephrologist','Urologist'];
  const cities = ['New York, NY','Chicago, IL','Houston, TX','San Francisco, CA','Miami, FL','Boston, MA','Seattle, WA','Austin, TX','Denver, CO','Atlanta, GA','Los Angeles, CA','Phoenix, AZ','Philadelphia, PA','Dallas, TX','Portland, OR'];
  const hospitals = ['Aetherion Main Hospital','City Medical Center','Health First Hospital','Mercy General','St. Mary Medical','Community Health','Regional Medical Center','University Hospital','Memorial Hospital','Valley Health'];
  const educations = ['Harvard Medical School','Stanford University','Johns Hopkins University','Yale University','UCLA Medical School','MIT Medical','Columbia University','Duke University','University of Chicago','Northwestern University'];
  const allLanguages = ['English','Spanish','French','Mandarin','Korean','Japanese','German','Arabic','Hindi','Portuguese','Russian','Italian'];
  const awards = ['Best Doctor Award','Research Excellence','Patient Choice Award','Top Surgeon','Rising Star','Lifetime Achievement','Community Service','Clinical Excellence','Teaching Award','Innovation Award'];
  const achievements = ['Published 20+ papers','5000+ surgeries','Fellow of ACC','Research Pioneer','Community Leader','International Speaker','Award Winner','Medical Innovator'];
  const doctors: Doctor[] = [];
  for (let i = 0; i < 65; i++) {
    const firstName = firstNames[i % firstNames.length]; const lastName = lastNames[i % lastNames.length];
    const specialization = specializations[i % specializations.length]; const city = cities[i % cities.length];
    const hospital = hospitals[i % hospitals.length]; const education = educations[i % educations.length];
    const numLanguages = 1 + Math.floor(Math.random() * 3);
    const shuffledLangs = [...allLanguages].sort(() => Math.random() - 0.5);
    const docLanguages = ['English', ...shuffledLangs.slice(0, numLanguages - 1)];
    const numAwards = 1 + Math.floor(Math.random() * 3);
    const shuffledAwards = [...awards].sort(() => Math.random() - 0.5);
    const docAwards = shuffledAwards.slice(0, numAwards);
    const rating = (3.5 + Math.random() * 1.5); const experience = 3 + Math.floor(Math.random() * 22);
    const distance = (0.5 + Math.random() * 15).toFixed(1); const fee = 100 + Math.floor(Math.random() * 300);
    const availabilities: Array<'available'|'busy'|'offline'> = ['available','available','available','busy','busy','offline'];
    const availability = availabilities[Math.floor(Math.random() * availabilities.length)];
    const nextTimes = ['Today 1:00 PM','Today 2:00 PM','Today 3:30 PM','Today 4:00 PM','Tomorrow 9:00 AM','Tomorrow 10:00 AM','Tomorrow 11:30 AM','Mon 9:00 AM','Mon 10:00 AM','Wed 2:00 PM'];
    const days = ['Mon','Tue','Wed','Thu','Fri','Sat']; const schedule = [];
    const numDays = 2 + Math.floor(Math.random() * 3);
    for (let d = 0; d < numDays; d++) { schedule.push({ day: days[d], time: '9:00 AM - 5:00 PM', hospital: hospitals[Math.floor(Math.random() * hospitals.length)] }); }
    const allModes: ('in-person'|'video'|'phone'|'chat')[] = ['in-person','video','phone','chat'];
    const numModes = 2 + Math.floor(Math.random() * 3); const modes = allModes.slice(0, numModes);
    doctors.push({
      id: `doc-${i+1}`, name: `Dr. ${firstName} ${lastName}`, title: `Dr. ${firstName} ${lastName}`,
      image: `https://randomuser.me/api/portraits/${i%2===0?'women':'men'}/${(i%70)+1}.jpg`,
      specialization, rating: Math.round(rating*10)/10, reviews: 50+Math.floor(Math.random()*450),
      experience, location: city, distance: `${distance} km`, availability,
      nextAvailable: availability==='available'?nextTimes[Math.floor(Math.random()*nextTimes.length)]:(availability==='busy'?'Tomorrow 9:00 AM':'Mon 10:00 AM'),
      fee: `$${fee}`, hospital,
      hospitalAddress: `${100+Math.floor(Math.random()*900)} ${['Main St','Health Ave','Medical Blvd','Wellness Dr','Care Lane'][Math.floor(Math.random()*5)]}, ${city}`,
      clinic: `${lastName} Clinic`,
      clinicAddress: `${100+Math.floor(Math.random()*900)} ${['Oak St','Pine Ave','Cedar Blvd','Maple Dr','Elm Lane'][Math.floor(Math.random()*5)]}, ${city}`,
      education, languages: [...new Set(docLanguages)], awards: docAwards,
      totalPatients: 500+Math.floor(Math.random()*2000), successRate: 90+Math.floor(Math.random()*10),
      isVerified: Math.random()>0.1, schedule,
      phone: `+1 (555) ${String(100+Math.floor(Math.random()*900))}-${String(1000+Math.floor(Math.random()*9000))}`,
      videoConsult: Math.random()>0.2, onlineConsult: Math.random()>0.3,
      chatAvailable: Math.random()>0.4, waitTime: `${5+Math.floor(Math.random()*30)} min`,
      acceptingNewPatients: Math.random()>0.15,
      achievements: [...achievements].sort(()=>Math.random()-0.5).slice(0,2+Math.floor(Math.random()*3)),
      consultationModes: modes,
      about: `Dr. ${firstName} ${lastName} is an experienced ${specialization} with ${experience} years of practice.`,
    });
  }
  return doctors;
};

const mockDoctors = generateDoctors();
const specialties = ['all','Cardiologist','Neurologist','Pediatrician','Dermatologist','Orthopedic Surgeon','Oncologist','Psychiatrist','Ophthalmologist','ENT Specialist','Gastroenterologist','Pulmonologist','Endocrinologist','Rheumatologist','Nephrologist','Urologist'];

// ============================================
// DOCTOR DETAIL MODAL - Uses Modal + Badge + Button + Avatar
// ============================================
const DoctorDetailModal: React.FC<{ doctor: Doctor; onClose: () => void; onBook: (doctor: Doctor) => void }> = ({ doctor, onClose, onBook }) => {
  return (
    <Modal isOpen={true} onClose={onClose} size="xl" className="max-h-[90vh] overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start gap-5 mb-6">
          <div className="relative">
            <img src={doctor.image} alt={doctor.name} className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-700" />
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-slate-900 ${
              doctor.availability === 'available' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' :
              doctor.availability === 'busy' ? 'bg-amber-400' : 'bg-slate-500'
            }`} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-black text-white">{doctor.name}</h2>
            <p className="text-cyan-400 font-bold">{doctor.specialization}</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="warning" className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> {doctor.rating}
              </Badge>
              <span className="text-sm text-slate-400">({doctor.reviews} reviews)</span>
              {doctor.isVerified && <Badge variant="info"><BadgeCheck className="w-4 h-4 mr-1" /> Verified</Badge>}
            </div>
            {/* Consultation Modes */}
            <div className="flex gap-1.5 mt-2">
              {doctor.consultationModes.includes('in-person') && <Badge variant="default" className="text-[10px]">🏥 In-Person</Badge>}
              {doctor.consultationModes.includes('video') && <Badge variant="success" className="text-[10px]">📹 Video</Badge>}
              {doctor.consultationModes.includes('phone') && <Badge variant="warning" className="text-[10px]">📞 Phone</Badge>}
              {doctor.consultationModes.includes('chat') && <Badge variant="info" className="text-[10px]">💬 Chat</Badge>}
            </div>
          </div>
        </div>

        {/* About - GlassmorphicCard */}
        <GlassmorphicCard className="p-4 mb-4">
          <p className="text-slate-300 text-sm">{doctor.about}</p>
        </GlassmorphicCard>

        {/* Quick Stats - Card */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="p-3 text-center"><Users className="w-5 h-5 text-blue-400 mx-auto mb-1" /><p className="text-lg font-black text-white">{doctor.totalPatients.toLocaleString()}</p><p className="text-xs text-slate-500">Patients</p></Card>
          <Card className="p-3 text-center"><Award className="w-5 h-5 text-green-400 mx-auto mb-1" /><p className="text-lg font-black text-white">{doctor.experience} yrs</p><p className="text-xs text-slate-500">Experience</p></Card>
          <Card className="p-3 text-center"><ThumbsUp className="w-5 h-5 text-purple-400 mx-auto mb-1" /><p className="text-lg font-black text-white">{doctor.successRate}%</p><p className="text-xs text-slate-500">Success</p></Card>
        </div>

        {/* Wait Time + Accepting */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-3 text-center"><Clock className="w-5 h-5 text-cyan-400 mx-auto mb-1" /><p className="text-white font-black">{doctor.waitTime}</p><p className="text-xs text-slate-500">Wait Time</p></Card>
          <Card className="p-3 text-center"><CheckCircle className={`w-5 h-5 mx-auto mb-1 ${doctor.acceptingNewPatients?'text-emerald-400':'text-red-400'}`} /><p className={`font-black ${doctor.acceptingNewPatients?'text-emerald-400':'text-red-400'}`}>{doctor.acceptingNewPatients?'Accepting':'Full'}</p><p className="text-xs text-slate-500">New Patients</p></Card>
        </div>

        {/* Locations - GlassmorphicCard */}
        <div className="space-y-2 mb-4">
          <p className="text-white font-bold text-sm flex items-center gap-2"><Building2 className="w-4 h-4 text-blue-400" /> Locations</p>
          <GlassmorphicCard className="p-3"><p className="text-white font-bold text-sm">{doctor.hospital}</p><p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {doctor.hospitalAddress}</p></GlassmorphicCard>
          <GlassmorphicCard className="p-3"><p className="text-white font-bold text-sm">{doctor.clinic}</p><p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {doctor.clinicAddress}</p></GlassmorphicCard>
        </div>

        {/* Schedule */}
        <div className="mb-4">
          <p className="text-white font-bold text-sm mb-2 flex items-center gap-2"><Calendar className="w-4 h-4 text-green-400" /> Weekly Schedule</p>
          <div className="space-y-1.5">
            {doctor.schedule.map((s, i) => (
              <Card key={i} className="p-2.5 flex items-center justify-between">
                <span className="text-white font-bold text-sm w-12">{s.day}</span>
                <span className="text-xs text-slate-400">{s.time}</span>
                <Badge variant="info" className="text-[10px]">{s.hospital}</Badge>
              </Card>
            ))}
          </div>
        </div>

        {/* Languages & Education */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Card className="p-3">
            <p className="text-white font-bold text-sm mb-1 flex items-center gap-1"><Languages className="w-4 h-4 text-blue-400" /> Languages</p>
            <div className="flex flex-wrap gap-1">{doctor.languages.map(l => <Badge key={l} variant="info" className="text-[10px]">{l}</Badge>)}</div>
          </Card>
          <Card className="p-3">
            <p className="text-white font-bold text-sm mb-1 flex items-center gap-1"><GraduationCap className="w-4 h-4 text-purple-400" /> Education</p>
            <p className="text-xs text-slate-400">{doctor.education}</p>
          </Card>
        </div>

        {/* Awards */}
        <div className="mb-4">
          <p className="text-white font-bold text-sm mb-2 flex items-center gap-1"><Award className="w-4 h-4 text-amber-400" /> Awards</p>
          <div className="flex flex-wrap gap-1.5">{doctor.awards.map(a => <Badge key={a} variant="warning" className="text-[10px]">{a}</Badge>)}</div>
        </div>

        {/* Achievements */}
        <div className="mb-4">
          <p className="text-white font-bold text-sm mb-2 flex items-center gap-1"><Crown className="w-4 h-4 text-yellow-400" /> Achievements</p>
          <div className="space-y-1">{doctor.achievements.map((ach, i) => <p key={i} className="text-slate-400 text-xs flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> {ach}</p>)}</div>
        </div>

        {/* Reviews */}
        <div className="mb-4">
          <p className="text-white font-bold text-sm mb-2 flex items-center gap-1"><Star className="w-4 h-4 text-yellow-500 fill-yellow-500" /> Reviews</p>
          <Card className="p-3">
            <div className="flex items-center gap-2 mb-1"><span className="text-2xl font-black text-white">{doctor.rating}</span>
              <div className="flex">{[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s<=Math.round(doctor.rating)?'text-yellow-500 fill-yellow-500':'text-slate-700'}`} />)}</div>
            </div>
            <p className="text-xs text-slate-500">{doctor.reviews} total reviews</p>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-3 border-t border-white/[0.06]">
          <Button variant="primary" className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 py-3" onClick={() => onBook(doctor)}>
            <Calendar className="w-4 h-4 mr-1" /> Book Appointment
          </Button>
          {doctor.videoConsult && <Button variant="outline" className="border-green-500/30 text-green-400"><Video className="w-4 h-4" /></Button>}
          {doctor.chatAvailable && <Button variant="outline" className="border-purple-500/30 text-purple-400"><MessageCircle className="w-4 h-4" /></Button>}
          <Button variant="outline" className="border-blue-500/30 text-blue-400"><Phone className="w-4 h-4" /></Button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
const Doctors: React.FC = () => {
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>(mockDoctors);
  const [loading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'rating'|'distance'|'experience'>('rating');
  const [filterSpecialty, setFilterSpecialty] = useState('all');
  const [filterAvailability, setFilterAvailability] = useState('all');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor|null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [loginDoctor, setLoginDoctor] = useState<Doctor|null>(null);

  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

  useEffect(() => {
    let results = [...doctors];
    if (searchQuery) { results = results.filter(doc => doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || doc.specialization.toLowerCase().includes(searchQuery.toLowerCase()) || doc.hospital.toLowerCase().includes(searchQuery.toLowerCase())); }
    if (filterSpecialty !== 'all') results = results.filter(doc => doc.specialization === filterSpecialty);
    if (filterAvailability === 'available') results = results.filter(doc => doc.availability === 'available');
    if (filterAvailability === 'video') results = results.filter(doc => doc.videoConsult);
    if (sortBy === 'rating') results.sort((a,b) => b.rating - a.rating);
    else if (sortBy === 'experience') results.sort((a,b) => b.experience - a.experience);
    setFilteredDoctors(results);
  }, [searchQuery, sortBy, filterSpecialty, filterAvailability, doctors]);

  const handleBookAppointment = useCallback((doctor: Doctor) => {
    if (!isAuthenticated) { setLoginDoctor(doctor); setShowLoginPrompt(true); return; }
    navigate(`/appointments/book?doctor=${doctor.id}`);
  }, [isAuthenticated, navigate]);

  const availabilityLabels = { available: 'Available', busy: 'Busy', offline: 'Offline' };

  return (
    <div className="min-h-screen bg-[#030508]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <Badge variant="info" className="mb-3 px-5 py-2"><Sparkles className="w-4 h-4 mr-1.5" /> 65 Verified Doctors</Badge>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Find the <span className="bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-500 bg-clip-text text-transparent">Best Doctors</span>
          </h1>
          <p className="text-slate-400 text-lg">Search, compare, and book appointments with top-rated specialists near you</p>
        </motion.div>

        {/* Search + Filters - GlassmorphicCard + Input */}
        <GlassmorphicCard className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <Input placeholder="Search by doctor name, specialty, or hospital..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} leftIcon={Search} className="flex-1" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'rating' | 'distance' | 'experience')} className="px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white font-bold text-sm cursor-pointer">
              <option value="rating">⭐ Sort by Rating</option><option value="experience">🎓 Sort by Experience</option>
            </select>
            <select value={filterSpecialty} onChange={(e) => setFilterSpecialty(e.target.value)} className="px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white font-bold text-sm cursor-pointer">
              {specialties.map(spec => <option key={spec} value={spec}>{spec === 'all' ? '🔬 All Specialties' : spec}</option>)}
            </select>
            <select value={filterAvailability} onChange={(e) => setFilterAvailability(e.target.value)} className="px-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-white font-bold text-sm cursor-pointer">
              <option value="all">📋 All</option><option value="available">🟢 Available Now</option><option value="video">📹 Video Consult</option>
            </select>
          </div>
        </GlassmorphicCard>

        <p className="mb-4 text-sm text-slate-400">Found <span className="font-bold text-white">{filteredDoctors.length}</span> doctors</p>

        {/* Doctors Grid - Card Component */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDoctors.map((doctor, index) => (
            <motion.div key={doctor.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }}
              whileHover={{ y: -5 }} onClick={() => setSelectedDoctor(doctor)} className="cursor-pointer">
              <Card className="overflow-hidden p-0 hover:border-cyan-500/30 hover:shadow-2xl transition-all duration-300 rounded-[2rem]">
                
                {/* Image + Header */}
                <div className="relative p-5 pb-3">
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      <Avatar name={doctor.name} src={doctor.image} size="lg" className="ring-4 ring-slate-800" />
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900 ${
                        doctor.availability === 'available' ? 'bg-emerald-400 shadow-lg shadow-emerald-400/50' :
                        doctor.availability === 'busy' ? 'bg-amber-400' : 'bg-slate-500'
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-black text-lg truncate">{doctor.name}</h3>
                      <p className="text-cyan-400 text-sm font-bold">{doctor.specialization}</p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <Badge variant="warning" className="flex items-center gap-1 text-[10px]">
                          <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> {doctor.rating}
                        </Badge>
                        <span className="text-xs text-slate-500">({doctor.reviews})</span>
                        {doctor.isVerified && <BadgeCheck className="w-4 h-4 text-blue-400 fill-blue-400" />}
                      </div>
                    </div>
                    <Badge variant={doctor.availability === 'available' ? 'success' : doctor.availability === 'busy' ? 'warning' : 'default'} className="text-[10px]">
                      {availabilityLabels[doctor.availability]}
                    </Badge>
                  </div>
                </div>

                {/* Details */}
                <div className="px-5 pb-3 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs text-slate-400"><Building2 className="w-3.5 h-3.5 text-purple-400" /><span className="truncate">{doctor.hospital}</span></div>
                  <div className="flex items-center gap-2 text-xs text-slate-400"><MapPin className="w-3.5 h-3.5 text-red-400" /><span>{doctor.location} • {doctor.distance}</span></div>
                  <div className="flex items-center gap-2 text-xs"><Clock className="w-3.5 h-3.5 text-cyan-400" /><span className="text-emerald-400 font-bold">{doctor.nextAvailable}</span></div>
                  <div className="flex items-center gap-2 text-sm"><DollarSign className="w-4 h-4 text-amber-400" /><span className="text-white font-black text-lg">{doctor.fee}</span><span className="text-slate-500 text-xs">/ consultation</span></div>
                </div>

                {/* Consultation Modes - Badge */}
                <div className="px-5 pb-3 flex gap-1.5 flex-wrap">
                  {doctor.consultationModes.includes('in-person') && <Badge variant="default" className="text-[9px]">🏥 In-Person</Badge>}
                  {doctor.consultationModes.includes('video') && <Badge variant="success" className="text-[9px]">📹 Video</Badge>}
                  {doctor.consultationModes.includes('phone') && <Badge variant="warning" className="text-[9px]">📞 Phone</Badge>}
                  {doctor.consultationModes.includes('chat') && <Badge variant="info" className="text-[9px]">💬 Chat</Badge>}
                </div>

                {/* Schedule Preview */}
                <div className="px-5 pb-3">
                  <p className="text-xs font-medium text-slate-500 mb-1.5">SCHEDULE</p>
                  <div className="flex gap-1 flex-wrap">
                    {doctor.schedule.slice(0, 3).map((s, i) => <Badge key={i} variant="default" className="text-[9px]">{s.day}</Badge>)}
                    {doctor.schedule.length > 3 && <Badge variant="info" className="text-[9px]">+{doctor.schedule.length - 3} more</Badge>}
                  </div>
                </div>

                {/* Actions - Button */}
                <div className="px-5 pb-5 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 border-cyan-500/30 text-cyan-400" onClick={(e) => { e.stopPropagation(); setSelectedDoctor(doctor); }}>
                    <Eye className="w-3.5 h-3.5 mr-1" /> View Profile
                  </Button>
                  <Button variant="primary" size="sm" className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500" onClick={(e) => { e.stopPropagation(); handleBookAppointment(doctor); }}>
                    <Calendar className="w-3.5 h-3.5 mr-1" /> Book Now
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {!loading && filteredDoctors.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
            <Search className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">No doctors found</h3>
            <p className="text-slate-500">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </div>

      {/* Detail Modal - Modal Component */}
      <AnimatePresence>{selectedDoctor && <DoctorDetailModal doctor={selectedDoctor} onClose={() => setSelectedDoctor(null)} onBook={handleBookAppointment} />}</AnimatePresence>

      {/* Login Prompt - Modal Component */}
      <AnimatePresence>
        {showLoginPrompt && loginDoctor && (
          <Modal isOpen={true} onClose={() => setShowLoginPrompt(false)} size="sm">
            <div className="text-center p-6">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 flex items-center justify-center"><AlertCircle className="w-8 h-8 text-amber-400" /></div>
              <h3 className="text-xl font-black text-white mb-2">Login Required</h3>
              <p className="text-slate-400 text-sm mb-4">Login to book appointment with <span className="font-bold text-white">{loginDoctor.name}</span></p>
              <div className="flex items-center gap-3 mb-4 p-3 rounded-2xl bg-white/[0.03]">
                <Avatar name={loginDoctor.name} src={loginDoctor.image} size="md" />
                <div className="text-left"><p className="font-bold text-white text-sm">{loginDoctor.name}</p><p className="text-xs text-slate-400">{loginDoctor.specialization}</p><p className="text-xs font-bold text-cyan-400">{loginDoctor.fee}</p></div>
              </div>
              <div className="space-y-2">
                <Button variant="primary" onClick={() => navigate('/login')} className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 py-3">Login to Continue</Button>
                <Button variant="outline" onClick={() => navigate('/register')} className="w-full py-3">Create New Account</Button>
                <Button variant="ghost" onClick={() => setShowLoginPrompt(false)} className="w-full">Maybe Later</Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Doctors;