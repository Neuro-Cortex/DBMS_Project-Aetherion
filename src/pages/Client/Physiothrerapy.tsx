// src/pages/client/Physiotherapy.tsx
// COMPLETE PHYSIOTHERAPY PAGE - SIDEBAR REMOVED
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Calendar, Clock, CheckCircle2, TrendingUp,
  Play, Plus, Target, Zap, Dumbbell, Brain, Timer,
  
} from 'lucide-react';

// ============================================
// UI COMPONENTS
// ============================================
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Modal } from 'src/ui/Modal';

// ============================================
// TYPES
// ============================================
interface TherapySession {
  id: string;
  name: string;
  type: 'physical' | 'occupational' | 'speech' | 'respiratory';
  therapist: string;
  therapistAvatar?: string;
  date: string;
  time: string;
  duration: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'missed';
  progress: number;
  totalSessions: number;
  completedSessions: number;
  exercises: TherapyExercise[];
  notes: string;
}

interface TherapyExercise {
  id: string;
  name: string;
  description: string;
  duration: string;
  sets: number;
  reps: number;
  videoUrl?: string;
  completed: boolean;
}

// ============================================
// MOCK DATA
// ============================================
const therapySessions: TherapySession[] = [
  {
    id: '1',
    name: 'Lower Back Rehabilitation',
    type: 'physical',
    therapist: 'Dr. Robert Wilson',
    date: '2024-11-20',
    time: '10:00 AM',
    duration: 45,
    status: 'upcoming',
    progress: 65,
    totalSessions: 12,
    completedSessions: 8,
    exercises: [
      { id: 'e1', name: 'Pelvic Tilts', description: 'Lie on back with knees bent, gently tilt pelvis', duration: '10 mins', sets: 3, reps: 15, completed: true },
      { id: 'e2', name: 'Cat-Cow Stretch', description: 'On hands and knees, alternate arching and rounding back', duration: '10 mins', sets: 3, reps: 10, completed: true },
      { id: 'e3', name: 'Bridge Exercise', description: 'Lie on back, lift hips while squeezing glutes', duration: '10 mins', sets: 3, reps: 12, completed: false },
    ],
    notes: 'Patient showing significant improvement. Continue with current plan.',
  },
  {
    id: '2',
    name: 'Shoulder Mobility Therapy',
    type: 'occupational',
    therapist: 'Dr. Lisa Anderson',
    date: '2024-11-18',
    time: '2:00 PM',
    duration: 60,
    status: 'completed',
    progress: 75,
    totalSessions: 8,
    completedSessions: 6,
    exercises: [
      { id: 'e4', name: 'Pendulum Exercise', description: 'Bend forward and let arm hang, make small circles', duration: '15 mins', sets: 3, reps: 20, completed: true },
      { id: 'e5', name: 'Wall Slides', description: 'Stand against wall, slide arms up and down', duration: '15 mins', sets: 4, reps: 10, completed: true },
    ],
    notes: 'Range of motion improved by 30%. Add resistance band next session.',
  },
  {
    id: '3',
    name: 'Knee Strengthening Program',
    type: 'physical',
    therapist: 'Dr. James Kim',
    date: '2024-11-15',
    time: '11:00 AM',
    duration: 50,
    status: 'completed',
    progress: 83,
    totalSessions: 10,
    completedSessions: 8,
    exercises: [
      { id: 'e6', name: 'Quad Sets', description: 'Sit with leg extended, tighten thigh muscle', duration: '10 mins', sets: 4, reps: 15, completed: true },
      { id: 'e7', name: 'Straight Leg Raises', description: 'Lie on back, lift leg while keeping knee straight', duration: '15 mins', sets: 3, reps: 12, completed: true },
      { id: 'e8', name: 'Hamstring Curls', description: 'Stand holding support, bend knee backwards', duration: '10 mins', sets: 3, reps: 15, completed: true },
    ],
    notes: 'Excellent progress. Patient can now walk without support.',
  },
  {
    id: '4',
    name: 'Post-Stroke Speech Therapy',
    type: 'speech',
    therapist: 'Dr. Maria Garcia',
    date: '2024-11-22',
    time: '3:00 PM',
    duration: 45,
    status: 'upcoming',
    progress: 40,
    totalSessions: 20,
    completedSessions: 8,
    exercises: [
      { id: 'e9', name: 'Tongue Exercises', description: 'Move tongue up, down, left, right repeatedly', duration: '10 mins', sets: 5, reps: 10, completed: true },
      { id: 'e10', name: 'Word Repetition', description: 'Practice repeating common words and phrases', duration: '15 mins', sets: 4, reps: 20, completed: false },
    ],
    notes: 'Speech clarity improving. Focus on consonant sounds.',
  },
  {
    id: '5',
    name: 'Breathing Exercises',
    type: 'respiratory',
    therapist: 'Dr. David Brown',
    date: '2024-11-25',
    time: '9:00 AM',
    duration: 30,
    status: 'upcoming',
    progress: 55,
    totalSessions: 6,
    completedSessions: 3,
    exercises: [
      { id: 'e11', name: 'Diaphragmatic Breathing', description: 'Deep breathing focusing on diaphragm movement', duration: '10 mins', sets: 3, reps: 10, completed: true },
      { id: 'e12', name: 'Pursed Lip Breathing', description: 'Inhale through nose, exhale slowly through pursed lips', duration: '10 mins', sets: 3, reps: 10, completed: false },
    ],
    notes: 'Lung capacity increased by 15%. Continue daily exercises.',
  },
];

// ============================================
// CONFIGURATIONS
// ============================================
const therapyTypes = [
  { id: 'all', label: 'All Therapies', icon: Activity, color: 'cyan' },
  { id: 'physical', label: 'Physical', icon: Dumbbell, color: 'emerald' },
  { id: 'occupational', label: 'Occupational', icon: Target, color: 'purple' },
  { id: 'speech', label: 'Speech', icon: Brain, color: 'amber' },
  { id: 'respiratory', label: 'Respiratory', icon: Zap, color: 'blue' },
];

const typeColorMap: Record<string, { bg: string; text: string }> = {
  physical: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  occupational: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  speech: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  respiratory: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
};

const statColorMap: Record<string, { bg: string; text: string }> = {
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
};

// ============================================
// SESSION DETAIL MODAL
// ============================================
const SessionDetailModal: React.FC<{
  session: TherapySession;
  onClose: () => void;
}> = ({ session, onClose }) => {
  const typeStyle = typeColorMap[session.type] || typeColorMap.physical;

  return (
    <Modal isOpen={true} onClose={onClose} title={session.name}>
      <div className="space-y-5 p-2">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${typeStyle.bg}`}>
            <Activity className={`w-6 h-6 ${typeStyle.text}`} />
          </div>
          <div>
            <p className="text-white font-bold">{session.therapist}</p>
            <Badge className={session.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}>
              {session.status}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-slate-400 text-sm">Progress</span>
            <span className="text-emerald-400 text-sm font-bold">{session.progress}%</span>
          </div>
          <div className="h-2.5 bg-white/[0.03] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${session.progress}%` }}
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
            />
          </div>
          <p className="text-slate-500 text-xs mt-1">
            {session.completedSessions} of {session.totalSessions} sessions completed
          </p>
        </div>

        {/* Session Info */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <label className="text-slate-400 text-xs">Date</label>
            <p className="text-white font-bold">{session.date}</p>
          </div>
          <div>
            <label className="text-slate-400 text-xs">Time</label>
            <p className="text-white font-bold">{session.time}</p>
          </div>
          <div>
            <label className="text-slate-400 text-xs">Duration</label>
            <p className="text-white font-bold">{session.duration} min</p>
          </div>
          <div>
            <label className="text-slate-400 text-xs">Type</label>
            <Badge className={`${typeStyle.bg} ${typeStyle.text} capitalize`}>{session.type}</Badge>
          </div>
        </div>

        {/* Exercises */}
        <div>
          <h4 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
            <Dumbbell className="w-4 h-4 text-emerald-400" /> Exercises
          </h4>
          <div className="space-y-2">
            {session.exercises.map((exercise) => (
              <div
                key={exercise.id}
                className={`p-3 rounded-xl border transition-all ${
                  exercise.completed
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-white/[0.02] border-white/[0.04]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      exercise.completed ? 'bg-emerald-500/20' : 'bg-white/[0.05]'
                    }`}>
                      {exercise.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Play className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <p className="text-white text-xs font-bold">{exercise.name}</p>
                      <p className="text-slate-500 text-[10px]">{exercise.description}</p>
                      <p className="text-slate-600 text-[10px] mt-1">
                        {exercise.duration} • {exercise.sets} sets × {exercise.reps} reps
                      </p>
                    </div>
                  </div>
                  {!exercise.completed && (
                    <Button variant="outline" size="xs" className="text-emerald-400 border-emerald-500/20">
                      <Play className="w-3 h-3 mr-1" /> Start
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
          <h4 className="text-amber-400 font-bold text-sm mb-1">Therapist Notes</h4>
          <p className="text-slate-400 text-xs">{session.notes}</p>
        </div>
      </div>
    </Modal>
  );
};

// ============================================
// MAIN PHYSIOTHERAPY PAGE
// ============================================
const ClientPhysiotherapy: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedSession, setSelectedSession] = useState<TherapySession | null>(null);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');

  const filteredSessions = therapySessions.filter(session => {
    const matchType = activeFilter === 'all' ? true : session.type === activeFilter;
    const matchTab = activeTab === 'upcoming'
      ? (session.status === 'upcoming' || session.status === 'ongoing')
      : (session.status === 'completed' || session.status === 'missed');
    return matchType && matchTab;
  });

  const stats = {
    totalSessions: therapySessions.length,
    completedSessions: therapySessions.filter(s => s.status === 'completed').length,
    upcomingSessions: therapySessions.filter(s => s.status === 'upcoming').length,
    overallProgress: Math.round(
      therapySessions.reduce((acc, s) => acc + s.progress, 0) / therapySessions.length
    ),
  };

  return (
    <div className="min-h-screen bg-[#020408] p-4 lg:p-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            Physiotherapy & Therapy
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Track your therapy sessions, exercises, and recovery progress
          </p>
        </div>
        <Button
          variant="primary"
          className="bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20"
        >
          <Plus className="w-4 h-4 mr-2" /> Book New Session
        </Button>
      </motion.div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Sessions', value: stats.totalSessions, icon: Activity, color: 'cyan' },
          { label: 'Completed', value: stats.completedSessions, icon: CheckCircle2, color: 'emerald' },
          { label: 'Upcoming', value: stats.upcomingSessions, icon: Calendar, color: 'amber' },
          { label: 'Progress', value: `${stats.overallProgress}%`, icon: TrendingUp, color: 'purple' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const colors = statColorMap[stat.color] || statColorMap.cyan;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="p-4 cursor-default">
                <div className={`inline-flex p-2.5 rounded-xl ${colors.bg} mb-3`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <p className={`text-2xl font-black ${colors.text}`}>{stat.value}</p>
                <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* FILTERS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        {/* Therapy Type Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {therapyTypes.map((type) => {
            const Icon = type.icon;
            const colors = statColorMap[type.color] || statColorMap.cyan;
            return (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveFilter(type.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeFilter === type.id
                    ? `${colors.bg} ${colors.text} border border-white/10`
                    : 'bg-white/[0.02] text-slate-400 border border-white/[0.06] hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </motion.button>
            );
          })}
        </div>

        {/* Status Tabs */}
        <div className="flex gap-2">
          {(['upcoming', 'completed'] as const).map(tab => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all ${
                activeTab === tab
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/[0.02] text-slate-400 border border-white/[0.06] hover:text-white'
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>
      </div>

      {/* THERAPY SESSIONS */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredSessions.map((session, index) => {
            const typeStyle = typeColorMap[session.type] || typeColorMap.physical;
            const TypeIcon = session.type === 'physical' ? Dumbbell
              : session.type === 'occupational' ? Target
              : session.type === 'speech' ? Brain : Zap;

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedSession(session)}
              >
                <GlassmorphicCard className="p-5 cursor-pointer group">
                  <div className="flex items-start gap-4">
                    {/* Type Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${typeStyle.bg}`}>
                      <TypeIcon className={`w-6 h-6 ${typeStyle.text}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        <h3 className="text-white font-bold text-sm lg:text-base group-hover:text-emerald-400 transition-colors">
                          {session.name}
                        </h3>
                        <Badge className={
                          session.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400'
                          : session.status === 'ongoing' ? 'bg-amber-500/10 text-amber-400'
                          : session.status === 'missed' ? 'bg-red-500/10 text-red-400'
                          : 'bg-blue-500/10 text-blue-400'
                        }>
                          {session.status}
                        </Badge>
                      </div>
                      <p className="text-slate-500 text-xs">{session.therapist}</p>
                      
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {session.date}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {session.time}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-1">
                          <Timer className="w-3.5 h-3.5" /> {session.duration} min
                        </span>
                      </div>
                    </div>

                    {/* Progress Circle */}
                    <div className="text-center flex-shrink-0">
                      <div className="relative w-14 h-14">
                        <svg className="w-14 h-14 transform -rotate-90">
                          <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.05)" strokeWidth="3" fill="none" />
                          <motion.circle
                            cx="28" cy="28" r="24"
                            stroke={session.progress >= 75 ? '#22c55e' : session.progress >= 50 ? '#f59e0b' : '#ef4444'}
                            strokeWidth="3" fill="none" strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: session.progress / 100 }}
                            transition={{ duration: 1, delay: 0.3 }}
                            strokeDasharray={`${2 * Math.PI * 24}`}
                            strokeDashoffset={`${2 * Math.PI * 24 * (1 - session.progress / 100)}`}
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white font-bold text-xs">{session.progress}%</span>
                        </div>
                      </div>
                      <p className="text-slate-600 text-[10px] mt-1">
                        {session.completedSessions}/{session.totalSessions}
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  {session.status === 'upcoming' && (
                    <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.04] opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <Button variant="outline" size="xs" className="text-emerald-400 border-emerald-500/20">
                        <Play className="w-3.5 h-3.5 mr-1.5" /> Start Session
                      </Button>
                      <Button variant="outline" size="xs" className="text-slate-400">
                        Reschedule
                      </Button>
                    </div>
                  )}
                </GlassmorphicCard>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Empty State */}
        {filteredSessions.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <Activity className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-bold">No therapy sessions found</p>
            <p className="text-slate-600 text-sm mt-1">Book a new session to get started</p>
            <Button variant="primary" className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-500">
              <Plus className="w-4 h-4 mr-2" /> Book New Session
            </Button>
          </motion.div>
        )}
      </div>

      {/* SESSION DETAIL MODAL */}
      <AnimatePresence>
        {selectedSession && (
          <SessionDetailModal
            session={selectedSession}
            onClose={() => setSelectedSession(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientPhysiotherapy;