// src/components/timeline/HealthTimeline.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Activity, Heart, Pill, Stethoscope, Syringe,
  Baby, Clock, ChevronRight, Filter, Plus, Zap,
  Award, TrendingUp, AlertCircle, CheckCircle2
} from 'lucide-react';

// Types
interface TimelineEvent {
  id: string;
  date: string;
  time: string;
  title: string;
  description: string;
  type: 'appointment' | 'medication' | 'vaccination' | 'surgery' | 'lab' | 'milestone' | 'emergency';
  icon: React.ElementType;
  status: 'completed' | 'upcoming' | 'active' | 'cancelled';
  doctor?: string;
  hospital?: string;
  attachments?: number;
}

// Mock Data
const timelineEvents: TimelineEvent[] = [
  {
    id: '1',
    date: '2024-12-15',
    time: '10:30 AM',
    title: 'Cardiology Follow-up',
    description: 'Regular checkup with Dr. Sarah Johnson. ECG and blood pressure monitoring completed.',
    type: 'appointment',
    icon: Stethoscope,
    status: 'completed',
    doctor: 'Dr. Sarah Johnson',
    hospital: 'City General Hospital',
    attachments: 2,
  },
  {
    id: '2',
    date: '2024-12-10',
    time: '08:00 AM',
    title: 'Blood Test - Lipid Profile',
    description: 'Fasting blood test for cholesterol and triglycerides.',
    type: 'lab',
    icon: Activity,
    status: 'completed',
    hospital: 'Metro Medical Center',
    attachments: 1,
  },
  {
    id: '3',
    date: '2024-12-05',
    time: '02:00 PM',
    title: 'Influenza Vaccination',
    description: 'Annual flu shot administered.',
    type: 'vaccination',
    icon: Syringe,
    status: 'completed',
    doctor: 'Dr. Michael Chen',
  },
  {
    id: '4',
    date: '2024-11-28',
    time: '11:00 AM',
    title: 'Blood Pressure Medication Refill',
    description: 'Lisinopril 10mg - 30 day supply',
    type: 'medication',
    icon: Pill,
    status: 'completed',
  },
  {
    id: '5',
    date: '2024-12-20',
    time: '09:00 AM',
    title: 'MRI - Lower Back',
    description: 'Scheduled MRI for persistent lower back pain evaluation.',
    type: 'appointment',
    icon: Stethoscope,
    status: 'upcoming',
    doctor: 'Dr. Robert Wilson',
    hospital: 'Memorial Teaching Hospital',
  },
  {
    id: '6',
    date: '2024-12-18',
    time: '03:00 PM',
    title: 'Physical Therapy Session',
    description: 'Rehabilitation exercises for knee recovery.',
    type: 'appointment',
    icon: Activity,
    status: 'upcoming',
    doctor: 'Dr. Emily Davis',
  },
  {
    id: '7',
    date: '2024-11-15',
    time: '01:00 AM',
    title: 'Emergency - Chest Pain',
    description: 'Admitted to ER with acute chest pain. Diagnosed with angina.',
    type: 'emergency',
    icon: AlertCircle,
    status: 'completed',
    hospital: 'City General Hospital',
    attachments: 3,
  },
  {
    id: '8',
    date: '2024-10-01',
    time: 'All Day',
    title: 'Health Milestone: BMI Normal',
    description: 'Achieved target BMI of 24.5 through diet and exercise program.',
    type: 'milestone',
    icon: Award,
    status: 'completed',
  },
];

// Group by month
const groupByMonth = (events: TimelineEvent[]) => {
  const grouped: Record<string, TimelineEvent[]> = {};
  events.forEach(event => {
    const month = new Date(event.date).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(event);
  });
  return grouped;
};

const typeStyles: Record<string, { bg: string; border: string; icon: string; dot: string }> = {
  appointment: { bg: 'bg-blue-500/5', border: 'border-blue-500/20', icon: 'text-blue-400', dot: 'bg-blue-500' },
  medication: { bg: 'bg-emerald-500/5', border: 'border-emerald-500/20', icon: 'text-emerald-400', dot: 'bg-emerald-500' },
  vaccination: { bg: 'bg-purple-500/5', border: 'border-purple-500/20', icon: 'text-purple-400', dot: 'bg-purple-500' },
  surgery: { bg: 'bg-red-500/5', border: 'border-red-500/20', icon: 'text-red-400', dot: 'bg-red-500' },
  lab: { bg: 'bg-amber-500/5', border: 'border-amber-500/20', icon: 'text-amber-400', dot: 'bg-amber-500' },
  milestone: { bg: 'bg-cyan-500/5', border: 'border-cyan-500/20', icon: 'text-cyan-400', dot: 'bg-cyan-500' },
  emergency: { bg: 'bg-rose-500/5', border: 'border-rose-500/20', icon: 'text-rose-400', dot: 'bg-rose-500' },
};

const statusStyles: Record<string, string> = {
  completed: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  upcoming: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  active: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  cancelled: 'text-red-400 bg-red-500/10 border-red-500/20',
};

// ============================================
// MAIN COMPONENT
// ============================================

export const HealthTimeline: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const groupedEvents = groupByMonth(timelineEvents);

  const filteredEvents = filter === 'all' 
    ? timelineEvents 
    : timelineEvents.filter(e => e.type === filter);

  const filterOptions = [
    { value: 'all', label: 'All Events' },
    { value: 'appointment', label: 'Appointments' },
    { value: 'medication', label: 'Medications' },
    { value: 'lab', label: 'Lab Tests' },
    { value: 'vaccination', label: 'Vaccinations' },
    { value: 'emergency', label: 'Emergency' },
  ];

  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 text-xs font-medium mb-4">
            <Clock className="w-3.5 h-3.5" />
            Your Health Journey
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-[-0.02em] mb-2">
            Health Timeline
          </h1>
          <p className="text-white/35 text-lg">
            Your complete medical history, beautifully organized.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-8 overflow-x-auto pb-2"
        >
          {filterOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === option.value
                  ? 'bg-white/[0.08] text-white border border-white/[0.15]'
                  : 'bg-white/[0.02] text-white/40 border border-white/[0.06] hover:text-white/70 hover:bg-white/[0.04]'
              }`}
            >
              {option.label}
            </button>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-white/[0.06]" />

          <div className="space-y-12">
            {Object.entries(groupByMonth(filteredEvents)).map(([month, events], monthIdx) => (
              <motion.div
                key={month}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: monthIdx * 0.1 }}
              >
                {/* Month Header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center shrink-0">
                    <Calendar className="w-6 h-6 text-white/30" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{month}</h3>
                    <p className="text-white/30 text-sm">{events.length} events</p>
                  </div>
                </div>

                {/* Events */}
                <div className="space-y-4 ml-4">
                  {events.map((event, eventIdx) => {
                    const Icon = event.icon;
                    const styles = typeStyles[event.type] || typeStyles.appointment;
                    
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: eventIdx * 0.05 }}
                        whileHover={{ x: 4 }}
                        onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                        className={`relative pl-8 cursor-pointer group`}
                      >
                        {/* Timeline Dot */}
                        <div className={`absolute left-0 top-4 w-3 h-3 rounded-full ${styles.dot} ring-4 ring-[#050508] z-10`} />
                        
                        {/* Event Card */}
                        <div className={`p-4 md:p-5 rounded-xl border transition-all duration-300 ${
                          selectedEvent?.id === event.id
                            ? `${styles.bg} ${styles.border}`
                            : 'bg-white/[0.015] border-white/[0.06] hover:border-white/[0.12]'
                        }`}>
                          <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className={`w-10 h-10 rounded-xl ${styles.bg} border ${styles.border} flex items-center justify-center shrink-0`}>
                              <Icon className={`w-5 h-5 ${styles.icon}`} />
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1">
                                <h4 className="text-white font-medium text-sm md:text-base">
                                  {event.title}
                                </h4>
                                <div className="flex items-center gap-2">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusStyles[event.status]}`}>
                                    {event.status}
                                  </span>
                                  <span className="text-white/25 text-xs">{event.date} • {event.time}</span>
                                </div>
                              </div>
                              <p className="text-white/35 text-sm line-clamp-2 mb-2">
                                {event.description}
                              </p>
                              <div className="flex flex-wrap items-center gap-3 text-xs">
                                {event.doctor && (
                                  <span className="text-white/40 flex items-center gap-1">
                                    <Stethoscope className="w-3 h-3" />
                                    {event.doctor}
                                  </span>
                                )}
                                {event.hospital && (
                                  <span className="text-white/40 flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    {event.hospital}
                                  </span>
                                )}
                                {event.attachments && (
                                  <span className="text-cyan-400 flex items-center gap-1">
                                    📎 {event.attachments} attachment{event.attachments > 1 ? 's' : ''}
                                  </span>
                                )}
                              </div>
                            </div>

                            <ChevronRight className={`w-4 h-4 text-white/20 shrink-0 transition-transform ${
                              selectedEvent?.id === event.id ? 'rotate-90' : ''
                            }`} />
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {selectedEvent?.id === event.id && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-3">
                                  <div className="grid grid-cols-2 gap-3 text-xs">
                                    <div className="p-3 bg-white/[0.02] rounded-lg">
                                      <span className="text-white/30">Date</span>
                                      <p className="text-white/60 font-medium mt-0.5">{event.date}</p>
                                    </div>
                                    <div className="p-3 bg-white/[0.02] rounded-lg">
                                      <span className="text-white/30">Time</span>
                                      <p className="text-white/60 font-medium mt-0.5">{event.time}</p>
                                    </div>
                                    <div className="p-3 bg-white/[0.02] rounded-lg">
                                      <span className="text-white/30">Type</span>
                                      <p className="text-white/60 font-medium mt-0.5 capitalize">{event.type}</p>
                                    </div>
                                    <div className="p-3 bg-white/[0.02] rounded-lg">
                                      <span className="text-white/30">Status</span>
                                      <p className={`font-medium mt-0.5 capitalize ${
                                        event.status === 'completed' ? 'text-emerald-400' :
                                        event.status === 'upcoming' ? 'text-blue-400' : 'text-amber-400'
                                      }`}>{event.status}</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <Clock className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-white/40">No events found for this filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthTimeline;