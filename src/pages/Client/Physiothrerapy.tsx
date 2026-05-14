// src/pages/client/Physiotherapy.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientSidebar from '../../components/client/ClientSidebar';
import {
  Activity, Calendar, Clock, CheckCircle2, TrendingUp,
  Play, Pause, ChevronRight, Plus, Target, Heart,
  Zap, Dumbbell, Brain, Timer, Award, Star,
  AlertCircle, ArrowRight
} from 'lucide-react';

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

const therapySessions: TherapySession[] = [
  {
    id: '1',
    name: 'Lower Back Rehabilitation',
    type: 'physical',
    therapist: 'Dr. Robert Wilson',
    therapistAvatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    date: '2024-11-20',
    time: '10:00 AM',
    duration: 45,
    status: 'upcoming',
    progress: 65,
    totalSessions: 12,
    completedSessions: 8,
    exercises: [
      {
        id: 'e1',
        name: 'Pelvic Tilts',
        description: 'Lie on back with knees bent, gently tilt pelvis',
        duration: '10 mins',
        sets: 3,
        reps: 15,
        completed: true,
      },
      {
        id: 'e2',
        name: 'Cat-Cow Stretch',
        description: 'On hands and knees, alternate arching and rounding back',
        duration: '10 mins',
        sets: 3,
        reps: 10,
        completed: true,
      },
      {
        id: 'e3',
        name: 'Bridge Exercise',
        description: 'Lie on back, lift hips while squeezing glutes',
        duration: '10 mins',
        sets: 3,
        reps: 12,
        completed: false,
      },
    ],
    notes: 'Patient showing significant improvement. Continue with current plan.',
  },
  {
    id: '2',
    name: 'Shoulder Mobility Therapy',
    type: 'occupational',
    therapist: 'Dr. Lisa Anderson',
    therapistAvatar: 'https://randomuser.me/api/portraits/women/5.jpg',
    date: '2024-11-18',
    time: '2:00 PM',
    duration: 60,
    status: 'completed',
    progress: 75,
    totalSessions: 8,
    completedSessions: 6,
    exercises: [
      {
        id: 'e4',
        name: 'Pendulum Exercise',
        description: 'Bend forward and let arm hang, make small circles',
        duration: '15 mins',
        sets: 3,
        reps: 20,
        completed: true,
      },
      {
        id: 'e5',
        name: 'Wall Slides',
        description: 'Stand against wall, slide arms up and down',
        duration: '15 mins',
        sets: 4,
        reps: 10,
        completed: true,
      },
    ],
    notes: 'Range of motion improved by 30%. Add resistance band next session.',
  },
  {
    id: '3',
    name: 'Knee Strengthening Program',
    type: 'physical',
    therapist: 'Dr. James Kim',
    therapistAvatar: 'https://randomuser.me/api/portraits/men/6.jpg',
    date: '2024-11-15',
    time: '11:00 AM',
    duration: 50,
    status: 'completed',
    progress: 83,
    totalSessions: 10,
    completedSessions: 8,
    exercises: [
      {
        id: 'e6',
        name: 'Quad Sets',
        description: 'Sit with leg extended, tighten thigh muscle',
        duration: '10 mins',
        sets: 4,
        reps: 15,
        completed: true,
      },
      {
        id: 'e7',
        name: 'Straight Leg Raises',
        description: 'Lie on back, lift leg while keeping knee straight',
        duration: '15 mins',
        sets: 3,
        reps: 12,
        completed: true,
      },
      {
        id: 'e8',
        name: 'Hamstring Curls',
        description: 'Stand holding support, bend knee backwards',
        duration: '10 mins',
        sets: 3,
        reps: 15,
        completed: true,
      },
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
      {
        id: 'e9',
        name: 'Tongue Exercises',
        description: 'Move tongue up, down, left, right repeatedly',
        duration: '10 mins',
        sets: 5,
        reps: 10,
        completed: true,
      },
      {
        id: 'e10',
        name: 'Word Repetition',
        description: 'Practice repeating common words and phrases',
        duration: '15 mins',
        sets: 4,
        reps: 20,
        completed: false,
      },
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
      {
        id: 'e11',
        name: 'Diaphragmatic Breathing',
        description: 'Deep breathing focusing on diaphragm movement',
        duration: '10 mins',
        sets: 3,
        reps: 10,
        completed: true,
      },
      {
        id: 'e12',
        name: 'Pursed Lip Breathing',
        description: 'Inhale through nose, exhale slowly through pursed lips',
        duration: '10 mins',
        sets: 3,
        reps: 10,
        completed: false,
      },
    ],
    notes: 'Lung capacity increased by 15%. Continue daily exercises.',
  },
];

const therapyTypes = [
  { id: 'all', label: 'All Therapies', icon: Activity, color: 'from-cyan-500 to-blue-500' },
  { id: 'physical', label: 'Physical', icon: Dumbbell, color: 'from-emerald-500 to-teal-500' },
  { id: 'occupational', label: 'Occupational', icon: Target, color: 'from-purple-500 to-violet-500' },
  { id: 'speech', label: 'Speech', icon: Brain, color: 'from-amber-500 to-orange-500' },
  { id: 'respiratory', label: 'Respiratory', icon: Zap, color: 'from-blue-500 to-cyan-500' },
];

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
    overallProgress: 65,
  };

  return (
    <div className="min-h-screen bg-[#050508]">
      <ClientSidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Activity className="w-8 h-8 text-emerald-400" />
              Physiotherapy & Therapy
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Track your therapy sessions, exercises, and recovery progress
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            <Plus className="w-4 h-4" />
            Book New Session
          </motion.button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Sessions', value: stats.totalSessions, icon: Activity, color: 'from-cyan-500 to-blue-500' },
            { label: 'Completed', value: stats.completedSessions, icon: CheckCircle2, color: 'from-emerald-500 to-teal-500' },
            { label: 'Upcoming', value: stats.upcomingSessions, icon: Calendar, color: 'from-amber-500 to-orange-500' },
            { label: 'Overall Progress', value: `${stats.overallProgress}%`, icon: TrendingUp, color: 'from-purple-500 to-violet-500' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color.replace('500', '500/10')} border border-white/[0.04]`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-white/40 text-xs mt-1">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Therapy Type Filters */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {therapyTypes.map((type) => {
            const Icon = type.icon;
            return (
              <motion.button
                key={type.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(type.id)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all flex items-center gap-2 ${
                  activeFilter === type.id
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-white/[0.02] text-white/40 border border-white/[0.04] hover:text-white/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                {type.label}
              </motion.button>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(['upcoming', 'completed'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-white/[0.02] text-white/40 border border-white/[0.04]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Therapy Sessions */}
        <div className="space-y-4">
          <AnimatePresence>
            {filteredSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedSession(session)}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-emerald-500/20 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {/* Type Icon */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      session.type === 'physical' ? 'bg-emerald-500/10' :
                      session.type === 'occupational' ? 'bg-purple-500/10' :
                      session.type === 'speech' ? 'bg-amber-500/10' :
                      'bg-blue-500/10'
                    }`}>
                      {session.type === 'physical' ? (
                        <Dumbbell className="w-7 h-7 text-emerald-400" />
                      ) : session.type === 'occupational' ? (
                        <Target className="w-7 h-7 text-purple-400" />
                      ) : session.type === 'speech' ? (
                        <Brain className="w-7 h-7 text-amber-400" />
                      ) : (
                        <Zap className="w-7 h-7 text-blue-400" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold text-lg group-hover:text-emerald-400 transition-colors">
                          {session.name}
                        </h3>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${
                          session.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-400'
                            : session.status === 'ongoing'
                            ? 'bg-amber-500/10 text-amber-400 animate-pulse'
                            : session.status === 'missed'
                            ? 'bg-red-500/10 text-red-400'
                            : 'bg-blue-500/10 text-blue-400'
                        }`}>
                          {session.status}
                        </span>
                      </div>
                      <p className="text-white/40 text-sm mt-1">{session.therapist}</p>
                      
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-white/40 text-xs flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {session.date}
                        </span>
                        <span className="text-white/40 text-xs flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {session.time}
                        </span>
                        <span className="text-white/40 text-xs flex items-center gap-1">
                          <Timer className="w-3.5 h-3.5" /> {session.duration} min
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Circle */}
                  <div className="text-right">
                    <div className="relative w-16 h-16">
                      <svg className="w-16 h-16 transform -rotate-90">
                        <circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke="rgba(255,255,255,0.05)"
                          strokeWidth="4"
                          fill="none"
                        />
                        <motion.circle
                          cx="32"
                          cy="32"
                          r="28"
                          stroke={session.progress >= 75 ? '#22c55e' : session.progress >= 50 ? '#f59e0b' : '#ef4444'}
                          strokeWidth="4"
                          fill="none"
                          strokeLinecap="round"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: session.progress / 100 }}
                          transition={{ duration: 1, delay: 0.5 }}
                          strokeDasharray={`${2 * Math.PI * 28}`}
                          strokeDashoffset={`${2 * Math.PI * 28 * (1 - session.progress / 100)}`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white font-bold text-sm">{session.progress}%</span>
                      </div>
                    </div>
                    <p className="text-white/30 text-xs mt-1">
                      {session.completedSessions}/{session.totalSessions} sessions
                    </p>
                  </div>
                </div>

                {/* Quick Actions */}
                {session.status === 'upcoming' && (
                  <div className="flex gap-3 mt-4 pt-4 border-t border-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all">
                      <Play className="w-4 h-4" /> Start Session
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.03] text-white/40 text-sm font-medium hover:bg-white/[0.06] transition-all">
                      Reschedule
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredSessions.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <Activity className="w-16 h-16 text-white/10 mx-auto mb-4" />
              <p className="text-white/30 text-lg">No therapy sessions found</p>
              <button className="mt-4 px-6 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all">
                Book a New Session
              </button>
            </motion.div>
          )}
        </div>

        {/* Session Detail Modal */}
        <AnimatePresence>
          {selectedSession && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setSelectedSession(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6 rounded-2xl bg-[#0a0a10] border border-white/[0.08]"
              >
                {/* Modal Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                      selectedSession.type === 'physical' ? 'bg-emerald-500/10' :
                      selectedSession.type === 'occupational' ? 'bg-purple-500/10' :
                      'bg-amber-500/10'
                    }`}>
                      <Activity className="w-7 h-7 text-emerald-400" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold text-xl">{selectedSession.name}</h3>
                      <p className="text-white/40 text-sm">{selectedSession.therapist}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedSession(null)}
                    className="p-2 rounded-lg bg-white/[0.03] text-white/40 hover:text-white/70 transition-all"
                  >
                    ✕
                  </button>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/60 text-sm">Overall Progress</span>
                    <span className="text-emerald-400 text-sm font-medium">{selectedSession.progress}%</span>
                  </div>
                  <div className="h-3 rounded-full bg-white/[0.05] overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedSession.progress}%` }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                    />
                  </div>
                  <p className="text-white/40 text-xs mt-1">
                    {selectedSession.completedSessions} of {selectedSession.totalSessions} sessions completed
                  </p>
                </div>

                {/* Exercises */}
                <div className="mb-6">
                  <h4 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-emerald-400" />
                    Exercises
                  </h4>
                  <div className="space-y-3">
                    {selectedSession.exercises.map((exercise, i) => (
                      <motion.div
                        key={exercise.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-4 rounded-xl border transition-all ${
                          exercise.completed
                            ? 'bg-emerald-500/5 border-emerald-500/20'
                            : 'bg-white/[0.02] border-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              exercise.completed ? 'bg-emerald-500/20' : 'bg-white/[0.05]'
                            }`}>
                              {exercise.completed ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                              ) : (
                                <Play className="w-5 h-5 text-white/30" />
                              )}
                            </div>
                            <div>
                              <h5 className="text-white font-medium text-sm">{exercise.name}</h5>
                              <p className="text-white/40 text-xs mt-0.5">{exercise.description}</p>
                              <div className="flex items-center gap-3 mt-2">
                                <span className="text-white/30 text-[10px] flex items-center gap-1">
                                  <Timer className="w-3 h-3" /> {exercise.duration}
                                </span>
                                <span className="text-white/30 text-[10px]">{exercise.sets} sets × {exercise.reps} reps</span>
                              </div>
                            </div>
                          </div>
                          {!exercise.completed && (
                            <button className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all">
                              Start
                            </button>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <h4 className="text-amber-400 font-medium text-sm mb-2">Therapist Notes</h4>
                  <p className="text-white/50 text-sm">{selectedSession.notes}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ClientPhysiotherapy;