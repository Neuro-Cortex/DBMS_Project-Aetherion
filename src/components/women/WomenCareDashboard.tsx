// src/pages/Client/WomenCareDashboard.tsx
// COMPLETE WOMEN CARE DASHBOARD - ALL FEATURES ACCESSIBLE + QUICK ACTIONS ADDED
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Bell, Calendar, Heart, ChevronRight, Plus,
  Baby, Droplets, Brain, Shield, Phone, AlertCircle,
  Activity, Pill, Thermometer,
  Siren, MapPin, Share2, Mic,
  MessageCircle, Users, ThumbsUp,
  CheckCircle2, FileText, Download,
  Syringe, Stethoscope, Dumbbell,
} from 'lucide-react';

// ============================================
// EXISTING UI COMPONENTS
// ============================================
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Modal } from 'src/ui/Modal';

// ============================================
// TYPES
// ============================================
interface PeriodData {
  lastPeriodDate: string; cycleLength: number; periodLength: number;
  nextPeriodDate: string; ovulationDate: string;
  fertileWindow: { start: string; end: string }; currentDay: number;
}
interface PregnancyData {
  week: number; trimester: number; dueDate: string;
  babySize: string; babyWeight: string; symptoms: string[]; nextCheckup: string;
}
interface MedicineSchedule {
  id: string; name: string; dosage: string; time: string;
  taken: boolean; type: 'daily' | 'weekly' | 'monthly'; color: string;
}
interface SafetyFeature {
  icon: React.ElementType; title: string; desc: string; color: string; action: string;
}
interface DiseaseInfo {
  icon: React.ElementType; name: string; desc: string; symptoms: string[]; color: string;
}
interface CommunityPost {
  id: string; author: string; avatar: string; topic: string; content: string;
  likes: number; comments: number; time: string; anonymous: boolean;
}
interface HealthRecord {
  id: string; title: string; type: string; date: string; doctor: string; fileType: string;
}
interface QuickActionItem {
  icon: React.ElementType; label: string; color: string; path: string;
}

// ============================================
// ✅ QUICK ACTIONS - ALL 8 ROUTES
// ============================================
const quickActions: QuickActionItem[] = [
  { icon: Baby, label: 'Pregnancy', color: 'pink', path: '/women-care/pregnancy' },
  { icon: Calendar, label: 'Period', color: 'rose', path: '/women-care/menstrual-cycle' },
  { icon: Stethoscope, label: 'Gynecologist', color: 'purple', path: '/women-care/gynecologist' },
  { icon: Heart, label: 'Mother Health', color: 'red', path: '/women-care/mother-health' },
  { icon: Shield, label: 'Special Care', color: 'indigo', path: '/women-care/special-care' },
  { icon: Syringe, label: 'Vaccines', color: 'green', path: '/women-care/vaccine-schedule' },
  { icon: Pill, label: 'Medicines', color: 'amber', path: '/women-care/medicine-record' },
  { icon: FileText, label: 'Health Info', color: 'teal', path: '/women-care/health' },
];

// ============================================
// MOCK DATA
// ============================================
const periodData: PeriodData = {
  lastPeriodDate: '2026-05-01', cycleLength: 28, periodLength: 5,
  nextPeriodDate: '2026-05-29', ovulationDate: '2026-05-15',
  fertileWindow: { start: '2026-05-13', end: '2026-05-17' }, currentDay: 25,
};
const pregnancyData: PregnancyData = {
  week: 24, trimester: 2, dueDate: '2026-09-15',
  babySize: '30 cm (Cantaloupe)', babyWeight: '600 grams',
  symptoms: ['Back pain', 'Braxton Hicks', 'Heartburn'], nextCheckup: '2026-06-10',
};
const medicineSchedules: MedicineSchedule[] = [
  { id: '1', name: 'Iron Supplement', dosage: '65mg - 1 tablet', time: '8:00 AM', taken: true, type: 'daily', color: 'red' },
  { id: '2', name: 'Calcium + Vitamin D', dosage: '500mg - 1 tablet', time: '2:00 PM', taken: false, type: 'daily', color: 'blue' },
  { id: '3', name: 'Folic Acid', dosage: '400mcg - 1 tablet', time: '8:00 PM', taken: false, type: 'daily', color: 'green' },
  { id: '4', name: 'Vitamin B12', dosage: '1000mcg - weekly', time: 'Sun 10AM', taken: false, type: 'weekly', color: 'purple' },
];
const safetyFeatures: SafetyFeature[] = [
  { icon: Siren, title: 'Emergency SOS', desc: 'One-tap emergency alert to trusted contacts', color: 'red', action: '/emergency' },
  { icon: MapPin, title: 'Live Location Share', desc: 'Share real-time location with family', color: 'blue', action: '/share-location' },
  { icon: Mic, title: 'Audio Recording', desc: 'Record emergency audio secretly', color: 'amber', action: '/record' },
  { icon: Phone, title: 'Fake Call', desc: 'Simulate incoming call to escape unsafe situation', color: 'purple', action: '/fake-call' },
];
const diseaseInfo: DiseaseInfo[] = [
  { icon: Activity, name: 'PCOS', color: 'rose', desc: 'Polycystic Ovary Syndrome - hormonal disorder common among women of reproductive age.', symptoms: ['Irregular periods', 'Excess hair growth', 'Acne', 'Weight gain'] },
  { icon: Droplets, name: 'Anemia', color: 'red', desc: 'Iron deficiency - condition where blood lacks enough healthy red blood cells.', symptoms: ['Fatigue', 'Weakness', 'Pale skin', 'Shortness of breath'] },
  { icon: Shield, name: 'Breast Cancer', color: 'pink', desc: 'Cancer that forms in the cells of the breasts - early detection saves lives.', symptoms: ['Lump in breast', 'Change in shape', 'Nipple discharge', 'Skin dimpling'] },
  { icon: Thermometer, name: 'Thyroid', color: 'amber', desc: 'Thyroid disorders affect metabolism - can cause weight changes and fatigue.', symptoms: ['Weight changes', 'Fatigue', 'Hair loss', 'Temperature sensitivity'] },
];
const communityPosts: CommunityPost[] = [
  { id: '1', author: 'Anonymous', avatar: '', topic: 'Pregnancy', content: 'Has anyone experienced severe back pain during the second trimester? Any remedies that worked?', likes: 24, comments: 8, time: '2 hours ago', anonymous: true },
  { id: '2', author: 'Nusrat J.', avatar: 'NJ', topic: 'PCOS', content: 'After 6 months of lifestyle changes, my PCOS symptoms have improved significantly! Sharing my routine.', likes: 56, comments: 15, time: '5 hours ago', anonymous: false },
  { id: '3', author: 'Anonymous', avatar: '', topic: 'Mental Health', content: 'Dealing with postpartum anxiety. Looking for counseling recommendations in Dhaka.', likes: 18, comments: 6, time: '8 hours ago', anonymous: true },
];
const healthRecords: HealthRecord[] = [
  { id: '1', title: 'Blood Test Report', type: 'Lab Report', date: '2026-05-10', doctor: 'Dr. Fatema Akter', fileType: 'PDF' },
  { id: '2', title: 'Ultrasound Scan', type: 'Imaging', date: '2026-04-28', doctor: 'Dr. Nasrin Sultana', fileType: 'Image' },
  { id: '3', title: 'Prescription', type: 'Prescription', date: '2026-04-15', doctor: 'Dr. Tania Begum', fileType: 'PDF' },
];
const quickStats = [
  { icon: Calendar, label: 'Cycle Day', value: '25', color: 'rose', sub: 'Next: May 29' },
  { icon: Baby, label: 'Pregnancy Week', value: '24', color: 'pink', sub: '2nd Trimester' },
  { icon: Pill, label: 'Meds Today', value: '2/4', color: 'amber', sub: 'Pending' },
  { icon: Heart, label: 'Health Score', value: '88', color: 'emerald', sub: 'Good' },
];
const colorMap: Record<string, string> = {
  rose: 'bg-rose-500/10 text-rose-400', pink: 'bg-pink-500/10 text-pink-400',
  red: 'bg-red-500/10 text-red-400', amber: 'bg-amber-500/10 text-amber-400',
  emerald: 'bg-emerald-500/10 text-emerald-400', blue: 'bg-blue-500/10 text-blue-400',
  green: 'bg-green-500/10 text-green-400', purple: 'bg-purple-500/10 text-purple-400',
  indigo: 'bg-indigo-500/10 text-indigo-400', cyan: 'bg-cyan-500/10 text-cyan-400',
  teal: 'bg-teal-500/10 text-teal-400',
};

// ============================================
// MAIN COMPONENT
// ============================================
const WomenCareDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [greeting, setGreeting] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [medicines, setMedicines] = useState(medicineSchedules);
  const [mood, setMood] = useState<string | null>(null);
  const user = useSelector((state: any) => state?.auth?.user) || { name: 'John Doe' };

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');
  }, []);

  const toggleMedicine = useCallback((id: string) => {
    setMedicines(prev => prev.map(m => m.id === id ? { ...m, taken: !m.taken } : m));
  }, []);

  const tabs = [
    { id: 'overview', label: '🏠 Overview' }, { id: 'period', label: '📅 Period' },
    { id: 'pregnancy', label: '🤰 Pregnancy' }, { id: 'medicines', label: '💊 Medicines' },
    { id: 'safety', label: '🛡️ Safety' }, { id: 'diseases', label: '🏥 Diseases' },
    { id: 'fitness', label: '🏃 Fitness' }, { id: 'records', label: '📄 Records' },
    { id: 'community', label: '👥 Community' }, { id: 'ai', label: '🤖 AI Help' },
  ];

  const pendingMeds = medicines.filter(m => !m.taken).length;

  return (
    <div className="min-h-screen bg-[#030508]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* TOP HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-xl" />
              <Avatar name={user?.name || 'JD'} size="lg" className="relative ring-2 ring-pink-500/20" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#030508] shadow-lg shadow-emerald-400/50" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {greeting}, <span className="bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0] || 'User'}</span> 🌸
              </h1>
              <p className="text-slate-400 text-sm">Women Care Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold shadow-lg">2</span>
            </button>
            <Button variant="danger" size="sm" onClick={() => setSosModalOpen(true)}
              className="animate-pulse bg-gradient-to-r from-red-500 to-rose-500 shadow-lg shadow-red-500/20">
              <AlertCircle className="w-4 h-4 mr-1.5" /> SOS
            </Button>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* ✅ QUICK ACTIONS - ALL 8 WOMEN CARE ROUTES */}
        {/* ============================================ */}
        <div>
          <h2 className="text-white font-semibold text-lg mb-4">Quick Access</h2>
          <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              const colors = colorMap[action.color] || '';
              const [bg, text] = colors.split(' ');
              return (
                <motion.button key={i} whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all group">
                  <div className={`p-2.5 rounded-xl ${bg} group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-5 h-5 ${text}`} />
                  </div>
                  <span className="text-white/40 text-[11px] font-medium group-hover:text-white/60 transition-colors text-center leading-tight">
                    {action.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            const colors = colorMap[stat.color] || '';
            const [bg, text] = colors.split(' ');
            return (
              <Card key={i} className="p-4 text-center hover:shadow-lg transition-all group">
                <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${text}`} />
                </div>
                <p className="text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
                <p className="text-[10px] text-slate-500 mt-0.5">{stat.sub}</p>
              </Card>
            );
          })}
        </div>

        {/* TABS */}
        <div className="border-b border-white/[0.06] pb-0 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border-b-2 border-pink-500 shadow-lg'
                    : 'text-slate-500 hover:text-white hover:bg-white/[0.02]'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          
          {/* OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Period + Pregnancy Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <GlassmorphicCard className="p-6 bg-gradient-to-br from-rose-500/5 to-transparent border-rose-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-rose-400" /> Period Tracker
                    </h3>
                    <Badge variant="info" className="text-[10px]">Day {periodData.currentDay}</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Last Period', value: periodData.lastPeriodDate },
                      { label: 'Next Period', value: periodData.nextPeriodDate, color: 'text-rose-400' },
                      { label: 'Ovulation', value: periodData.ovulationDate, color: 'text-purple-400' },
                    ].map((item) => (
                      <div key={item.label} className="text-center p-3 rounded-2xl bg-white/[0.03]">
                        <p className="text-xs text-slate-400">{item.label}</p>
                        <p className={`font-bold text-sm ${item.color || 'text-white'}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden mb-2">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(periodData.currentDay / periodData.cycleLength) * 100}%` }}
                      className="h-full bg-gradient-to-r from-rose-500 to-purple-500 rounded-full" />
                  </div>
                  <p className="text-xs text-slate-500">{periodData.cycleLength - periodData.currentDay} days until next period</p>
                  <Button variant="ghost" size="xs" className="mt-3 text-rose-400" onClick={() => navigate('/women-care/menstrual-cycle')}>
                    View Full Tracker <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </GlassmorphicCard>

                <GlassmorphicCard className="p-6 bg-gradient-to-br from-pink-500/5 to-transparent border-pink-500/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                      <Baby className="w-5 h-5 text-pink-400" /> Pregnancy Tracker
                    </h3>
                    <Badge variant="success" className="text-[10px]">Week {pregnancyData.week}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {[
                      { label: 'Baby Size', value: pregnancyData.babySize },
                      { label: 'Weight', value: pregnancyData.babyWeight },
                      { label: 'Due Date', value: pregnancyData.dueDate, color: 'text-pink-400' },
                      { label: 'Next Checkup', value: pregnancyData.nextCheckup, color: 'text-cyan-400' },
                    ].map((item) => (
                      <div key={item.label} className="text-center p-3 rounded-2xl bg-white/[0.03]">
                        <p className="text-xs text-slate-400">{item.label}</p>
                        <p className={`font-bold text-sm ${item.color || 'text-white'}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {pregnancyData.symptoms.map(s => <Badge key={s} variant="warning" className="text-[10px]">{s}</Badge>)}
                  </div>
                  <Button variant="ghost" size="xs" className="mt-3 text-pink-400" onClick={() => navigate('/women-care/pregnancy')}>
                    View Full Tracker <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </GlassmorphicCard>
              </div>

              {/* Medicine Reminders */}
              <GlassmorphicCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Pill className="w-5 h-5 text-amber-400" /> Medicine Reminders
                  </h3>
                  <Badge variant="warning">{pendingMeds} Pending</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {medicines.map((med) => (
                    <motion.div key={med.id} whileHover={{ x: 2 }} onClick={() => toggleMedicine(med.id)}
                      className={`flex items-center gap-3 p-3 rounded-2xl transition-all cursor-pointer ${med.taken ? 'bg-white/[0.01]' : 'bg-white/[0.03] border border-white/[0.06]'}`}>
                      <div className={`w-8 h-8 rounded-lg ${colorMap[med.color]?.split(' ')[0] || 'bg-blue-500/10'} flex items-center justify-center`}>
                        <Pill className={`w-4 h-4 ${colorMap[med.color]?.split(' ')[1] || 'text-blue-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-xs font-bold ${med.taken ? 'text-slate-500 line-through' : 'text-white'}`}>{med.name}</h4>
                        <p className="text-slate-500 text-[10px]">{med.time} • {med.type}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${med.taken ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                        {med.taken && <CheckCircle2 className="w-3 h-3 text-white" />}
                      </div>
                    </motion.div>
                  ))}
                </div>
                <Button variant="ghost" size="xs" className="mt-3 text-amber-400" onClick={() => navigate('/women-care/medicine-record')}>
                  View All Medicines <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </GlassmorphicCard>

              {/* Mood Tracker + Safety */}
              <div className="grid grid-cols-2 gap-6">
                <GlassmorphicCard className="p-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-purple-400" /> How are you feeling?
                  </h3>
                  <div className="flex items-center justify-around">
                    {[
                      { emoji: '😊', label: 'Happy', value: 'happy' },
                      { emoji: '😐', label: 'Okay', value: 'okay' },
                      { emoji: '😢', label: 'Sad', value: 'sad' },
                      { emoji: '😤', label: 'Stressed', value: 'stressed' },
                      { emoji: '😴', label: 'Tired', value: 'tired' },
                    ].map((m) => (
                      <button key={m.value} onClick={() => setMood(m.value)}
                        className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all ${mood === m.value ? 'bg-purple-500/20 border border-purple-500/30 scale-110' : 'hover:bg-white/[0.03]'}`}>
                        <span className="text-3xl">{m.emoji}</span>
                        <span className="text-[10px] text-slate-400">{m.label}</span>
                      </button>
                    ))}
                  </div>
                  {mood && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-emerald-400 text-xs mt-3">
                      ✅ Mood logged! Take care of yourself 💜
                    </motion.p>
                  )}
                </GlassmorphicCard>

                <GlassmorphicCard className="p-6">
                  <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400" /> Safety Features
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {safetyFeatures.map((feature) => {
                      const Icon = feature.icon;
                      return (
                        <motion.button key={feature.title} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          onClick={() => navigate(feature.action)}
                          className={`flex flex-col items-center gap-2 p-3 rounded-2xl ${colorMap[feature.color]?.split(' ')[0] || 'bg-slate-800'} hover:shadow-lg transition-all text-center`}>
                          <Icon className={`w-5 h-5 ${colorMap[feature.color]?.split(' ')[1] || 'text-slate-400'}`} />
                          <span className="text-white text-xs font-bold">{feature.title}</span>
                          <span className="text-slate-500 text-[10px] leading-tight">{feature.desc}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </GlassmorphicCard>
              </div>

              {/* Disease Awareness */}
              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Activity className="w-5 h-5 text-amber-400" /> Health Awareness
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {diseaseInfo.map((disease) => {
                    const Icon = disease.icon;
                    return (
                      <div key={disease.name} className={`p-4 rounded-2xl ${colorMap[disease.color]?.split(' ')[0] || 'bg-slate-800'} border border-white/[0.04] hover:shadow-lg transition-all`}>
                        <Icon className={`w-6 h-6 ${colorMap[disease.color]?.split(' ')[1] || 'text-slate-400'} mb-2`} />
                        <h4 className="text-white font-bold text-sm">{disease.name}</h4>
                        <p className="text-slate-500 text-[10px] mt-1 line-clamp-2">{disease.desc}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {disease.symptoms.slice(0, 2).map(s => (
                            <span key={s} className="px-1.5 py-0.5 rounded bg-white/[0.05] text-[9px] text-slate-400">{s}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassmorphicCard>

              {/* Community Preview */}
              <GlassmorphicCard className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-cyan-400" /> Community Support
                  </h3>
                  <Button variant="ghost" size="xs" onClick={() => setActiveTab('community')} className="text-cyan-400">
                    View All <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {communityPosts.slice(0, 2).map((post) => (
                    <div key={post.id} className="p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                          post.topic === 'Pregnancy' ? 'bg-pink-500/10 text-pink-400' :
                          post.topic === 'PCOS' ? 'bg-rose-500/10 text-rose-400' : 'bg-purple-500/10 text-purple-400'
                        }`}>{post.topic}</span>
                        <span className="text-slate-500 text-[10px]">{post.time}</span>
                        {post.anonymous && <Badge variant="default" className="text-[9px]">Anonymous</Badge>}
                      </div>
                      <p className="text-sm text-slate-300 line-clamp-2">{post.content}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {post.likes}</span>
                        <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.comments}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* PERIOD TAB */}
          {activeTab === 'period' && (
            <motion.div key="period" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <GlassmorphicCard className="p-8 text-center">
                <Calendar className="w-16 h-16 text-rose-400 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-white mb-2">Period Tracker</h2>
                <p className="text-slate-400 mb-6">Detailed cycle tracking and predictions</p>
                <div className="grid grid-cols-4 gap-4 max-w-2xl mx-auto">
                  {[
                    { label: 'Cycle Length', value: '28 days' }, { label: 'Period Length', value: '5 days' },
                    { label: 'Next Period', value: 'May 29' }, { label: 'Ovulation', value: 'May 15' },
                    { label: 'Fertile Start', value: 'May 13' }, { label: 'Fertile End', value: 'May 17' },
                    { label: 'Current Day', value: '25' }, { label: 'Days Left', value: '4' },
                  ].map((item) => (
                    <Card key={item.label} className="p-4 text-center">
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <p className="text-lg font-black text-white">{item.value}</p>
                    </Card>
                  ))}
                </div>
                <Button variant="primary" className="mt-6 bg-gradient-to-r from-rose-500 to-purple-500" onClick={() => navigate('/women-care/menstrual-cycle')}>
                  View Full Tracker
                </Button>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* PREGNANCY TAB */}
          {activeTab === 'pregnancy' && (
            <motion.div key="pregnancy" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              <GlassmorphicCard className="p-8 text-center">
                <Baby className="w-16 h-16 text-pink-400 mx-auto mb-4" />
                <h2 className="text-2xl font-black text-white mb-2">Pregnancy Tracker</h2>
                <p className="text-slate-400 mb-6">Week {pregnancyData.week} • {pregnancyData.trimester}nd Trimester</p>
                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto">
                  {[
                    { label: 'Baby Size', value: pregnancyData.babySize }, { label: 'Weight', value: pregnancyData.babyWeight },
                    { label: 'Due Date', value: pregnancyData.dueDate }, { label: 'Next Checkup', value: pregnancyData.nextCheckup },
                    { label: 'Week', value: pregnancyData.week }, { label: 'Trimester', value: pregnancyData.trimester },
                  ].map((item) => (
                    <Card key={item.label} className="p-4 text-center">
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <p className="text-lg font-black text-white">{item.value}</p>
                    </Card>
                  ))}
                </div>
                <Button variant="primary" className="mt-6 bg-gradient-to-r from-pink-500 to-rose-500" onClick={() => navigate('/women-care/pregnancy')}>
                  View Full Pregnancy Tracker
                </Button>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* MEDICINES TAB */}
          {activeTab === 'medicines' && (
            <motion.div key="medicines" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-bold text-lg mb-4">All Medicine Schedules</h3>
                <div className="space-y-3">
                  {medicines.map((med) => (
                    <div key={med.id} onClick={() => toggleMedicine(med.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl transition-all cursor-pointer ${med.taken ? 'bg-white/[0.01]' : 'bg-white/[0.03] border border-white/[0.06]'}`}>
                      <div className={`w-10 h-10 rounded-xl ${colorMap[med.color]?.split(' ')[0] || 'bg-blue-500/10'} flex items-center justify-center`}>
                        <Pill className={`w-5 h-5 ${colorMap[med.color]?.split(' ')[1] || 'text-blue-400'}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-bold ${med.taken ? 'text-slate-500 line-through' : 'text-white'}`}>{med.name}</h4>
                        <p className="text-xs text-slate-500">{med.dosage} • {med.time}</p>
                        <Badge variant="default" className="text-[9px] mt-1">{med.type}</Badge>
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${med.taken ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600'}`}>
                        {med.taken && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="xs" className="mt-4 text-amber-400" onClick={() => navigate('/women-care/medicine-record')}>
                  View All Medicines <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* SAFETY TAB */}
          {activeTab === 'safety' && (
            <motion.div key="safety" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <GlassmorphicCard className="p-6">
                <h3 className="text-white font-bold text-lg mb-4">Emergency Safety Features</h3>
                <div className="grid grid-cols-2 gap-4">
                  {safetyFeatures.map((feature) => {
                    const Icon = feature.icon;
                    return (
                      <motion.button key={feature.title} whileHover={{ scale: 1.02 }}
                        onClick={() => navigate(feature.action)}
                        className={`p-6 rounded-2xl ${colorMap[feature.color]?.split(' ')[0] || 'bg-slate-800'} border border-white/[0.04] hover:shadow-xl transition-all text-left`}>
                        <Icon className={`w-8 h-8 ${colorMap[feature.color]?.split(' ')[1] || 'text-slate-400'} mb-3`} />
                        <h4 className="text-white font-bold text-lg mb-1">{feature.title}</h4>
                        <p className="text-slate-400 text-sm">{feature.desc}</p>
                        <Button variant="primary" size="xs" className={`mt-3 bg-gradient-to-r ${feature.color === 'red' ? 'from-red-500 to-rose-500' : 'from-blue-500 to-cyan-500'}`}>
                          Activate
                        </Button>
                      </motion.button>
                    );
                  })}
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* DISEASES TAB */}
          {activeTab === 'diseases' && (
            <motion.div key="diseases" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="grid grid-cols-2 gap-4">
              {diseaseInfo.map((disease) => {
                const Icon = disease.icon;
                return (
                  <Card key={disease.name} className="p-6">
                    <Icon className={`w-8 h-8 ${colorMap[disease.color]?.split(' ')[1] || 'text-slate-400'} mb-3`} />
                    <h4 className="text-white font-bold text-lg mb-1">{disease.name}</h4>
                    <p className="text-slate-400 text-sm mb-3">{disease.desc}</p>
                    <h5 className="text-white text-xs font-bold mb-2">Common Symptoms:</h5>
                    <div className="flex flex-wrap gap-1.5">
                      {disease.symptoms.map(s => <Badge key={s} variant="warning" className="text-[10px]">{s}</Badge>)}
                    </div>
                  </Card>
                );
              })}
            </motion.div>
          )}

          {/* FITNESS TAB */}
          {activeTab === 'fitness' && (
            <motion.div key="fitness" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-12">
              <Dumbbell className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-2">Nutrition & Fitness</h2>
              <p className="text-slate-400 mb-6">BMI Calculator • Diet Plan • Water Reminder • Exercise Routine</p>
              <Button variant="primary" className="bg-gradient-to-r from-cyan-500 to-blue-500" onClick={() => navigate('/women-care/fitness')}>
                Open Fitness Module
              </Button>
            </motion.div>
          )}

          {/* RECORDS TAB */}
          {activeTab === 'records' && (
            <motion.div key="records" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <h3 className="text-white font-bold text-lg">Health Records</h3>
              {healthRecords.map((record) => (
                <Card key={record.id} className="p-4 flex items-center gap-4">
                  <FileText className="w-6 h-6 text-cyan-400" />
                  <div className="flex-1">
                    <h4 className="text-white font-bold">{record.title}</h4>
                    <p className="text-xs text-slate-500">{record.doctor} • {record.date} • {record.fileType}</p>
                  </div>
                  <Button variant="ghost" size="xs"><Download className="w-4 h-4" /></Button>
                </Card>
              ))}
            </motion.div>
          )}

          {/* COMMUNITY TAB */}
          {activeTab === 'community' && (
            <motion.div key="community" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <h3 className="text-white font-bold text-lg">Community Support</h3>
              {communityPosts.map((post) => (
                <Card key={post.id} className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${post.topic === 'Pregnancy' ? 'bg-pink-500/10 text-pink-400' : 'bg-purple-500/10 text-purple-400'}`}>{post.topic}</span>
                    <span className="text-slate-500 text-[10px]">{post.time}</span>
                    {post.anonymous && <Badge variant="default" className="text-[9px]">Anonymous</Badge>}
                  </div>
                  <p className="text-sm text-slate-300">{post.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3" /> {post.likes}</span>
                    <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" /> {post.comments}</span>
                  </div>
                </Card>
              ))}
              <Button variant="primary" className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                <Plus className="w-4 h-4 mr-2" /> New Post
              </Button>
            </motion.div>
          )}

          {/* AI TAB */}
          {activeTab === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-12">
              <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-2">AI Health Assistant</h2>
              <p className="text-slate-400 mb-6">Symptom Check • Health Q&A • Diet Suggestions • Medical Guidance</p>
              <Button variant="primary" className="bg-gradient-to-r from-purple-500 to-pink-500" onClick={() => navigate('/ai-assistant')}>
                Start AI Chat
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* SOS MODAL */}
      <AnimatePresence>
        {sosModalOpen && (
          <Modal isOpen={true} onClose={() => setSosModalOpen(false)} size="sm">
            <div className="text-center p-8 bg-gradient-to-b from-slate-900 to-slate-950">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </motion.div>
              <h2 className="text-2xl font-black text-white mb-2">Women Emergency SOS</h2>
              <p className="text-slate-400 text-sm mb-8">This will alert trusted contacts and emergency services</p>
              <div className="space-y-3">
                <Button variant="danger" size="lg" className="w-full bg-gradient-to-r from-red-500 to-rose-500"
                  onClick={() => { setSosModalOpen(false); navigate('/emergency'); }}>
                  <Phone className="w-5 h-5 mr-2" /> Call Emergency (911)
                </Button>
                <Button variant="outline" size="lg" className="w-full border-amber-500/30 text-amber-400"
                  onClick={() => { setSosModalOpen(false); }}>
                  <Share2 className="w-5 h-5 mr-2" /> Alert Trusted Contacts
                </Button>
                <Button variant="outline" size="lg" className="w-full border-blue-500/30 text-blue-400"
                  onClick={() => { setSosModalOpen(false); }}>
                  <MapPin className="w-5 h-5 mr-2" /> Share Live Location
                </Button>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setSosModalOpen(false)}>Cancel</Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default WomenCareDashboard;