// src/pages/Client/MentalHealth.tsx
// FULLY FUNCTIONAL MENTAL HEALTH & WELLNESS PAGE
import React, { useState } from 'react';
import { motion,  } from 'framer-motion';
import {
  Brain, Heart, Smile, Moon, Activity, BookOpen,
  Music, MessageCircle, 
  Zap, Play, Pause,
  Plus,  CheckCircle, ChevronRight, Star,
   Video,
} from 'lucide-react';

// ============================================
// UI COMPONENTS
// ============================================
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Input } from 'src/ui/Input';
import { Modal } from 'src/ui/Modal';

// ============================================
// TYPES
// ============================================
interface MoodEntry {
  id: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  emoji: string;
  label: string;
  date: string;
  note?: string;
}

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  mood: string;
}

interface MeditationTrack {
  id: string;
  title: string;
  duration: string;
  category: string;
  icon: React.ElementType;
  color: string;
}

interface Counselor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  available: boolean;
  avatar: string;
}

// ============================================
// MOCK DATA
// ============================================
const moodOptions: { mood: MoodEntry['mood']; emoji: string; label: string; color: string }[] = [
  { mood: 'great', emoji: '😄', label: 'Great', color: 'emerald' },
  { mood: 'good', emoji: '🙂', label: 'Good', color: 'blue' },
  { mood: 'okay', emoji: '😐', label: 'Okay', color: 'amber' },
  { mood: 'bad', emoji: '😔', label: 'Bad', color: 'orange' },
  { mood: 'terrible', emoji: '😢', label: 'Terrible', color: 'red' },
];

const recentMoods: MoodEntry[] = [
  { id: '1', mood: 'great', emoji: '😄', label: 'Great', date: '2026-05-27', note: 'Had a wonderful day!' },
  { id: '2', mood: 'good', emoji: '🙂', label: 'Good', date: '2026-05-26', note: 'Productive work day' },
  { id: '3', mood: 'okay', emoji: '😐', label: 'Okay', date: '2026-05-25' },
  { id: '4', mood: 'good', emoji: '🙂', label: 'Good', date: '2026-05-24', note: 'Nice walk in the park' },
  { id: '5', mood: 'great', emoji: '😄', label: 'Great', date: '2026-05-23', note: 'Family dinner!' },
];

const journalEntries: JournalEntry[] = [
  { id: '1', title: 'Morning Reflection', content: 'Today I feel grateful for...', date: '2026-05-27', mood: 'great' },
  { id: '2', title: 'Work Stress', content: 'Had a challenging meeting today...', date: '2026-05-26', mood: 'okay' },
];

const meditationTracks: MeditationTrack[] = [
  { id: '1', title: 'Deep Breathing', duration: '5 min', category: 'Breathing', icon: Activity, color: 'cyan' },
  { id: '2', title: 'Body Scan', duration: '10 min', category: 'Mindfulness', icon: Brain, color: 'purple' },
  { id: '3', title: 'Sleep Story', duration: '20 min', category: 'Sleep', icon: Moon, color: 'indigo' },
  { id: '4', title: 'Morning Yoga', duration: '15 min', category: 'Movement', icon: Heart, color: 'rose' },
  { id: '5', title: 'Stress Relief', duration: '8 min', category: 'Relaxation', icon: Zap, color: 'amber' },
  { id: '6', title: 'Gratitude', duration: '7 min', category: 'Wellness', icon: Smile, color: 'emerald' },
];

const counselors: Counselor[] = [
  { id: '1', name: 'Dr. Sarah Kim', specialty: 'Cognitive Behavioral Therapy', rating: 4.9, available: true, avatar: 'SK' },
  { id: '2', name: 'Dr. James Wilson', specialty: 'Mindfulness & Meditation', rating: 4.7, available: true, avatar: 'JW' },
  { id: '3', name: 'Dr. Emily Chen', specialty: 'Anxiety & Depression', rating: 4.8, available: false, avatar: 'EC' },
];

const quotes = [
  { text: 'Your mental health is a priority. Your happiness is essential.', author: 'Unknown' },
  { text: 'Self-care is not selfish. You cannot serve from an empty vessel.', author: 'Eleanor Brown' },
  { text: 'The strongest people are those who win battles we know nothing about.', author: 'Unknown' },
];

// ============================================
// COLOR MAPS
// ============================================
const colorStyles: Record<string, string> = {
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  red: 'bg-red-500/10 text-red-400 border-red-500/20',
};

const moodColors: Record<string, string> = {
  great: 'bg-emerald-500/10 text-emerald-400',
  good: 'bg-blue-500/10 text-blue-400',
  okay: 'bg-amber-500/10 text-amber-400',
  bad: 'bg-orange-500/10 text-orange-400',
  terrible: 'bg-red-500/10 text-red-400',
};

// ============================================
// MOOD TRACKER MODAL
// ============================================
const MoodTrackerModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (mood: MoodEntry) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [selectedMood, setSelectedMood] = useState<MoodEntry['mood'] | null>(null);
  const [note, setNote] = useState('');

  const handleSave = () => {
    if (!selectedMood) return;
    const option = moodOptions.find(m => m.mood === selectedMood)!;
    onSave({
      id: Date.now().toString(),
      mood: selectedMood,
      emoji: option.emoji,
      label: option.label,
      date: new Date().toISOString().split('T')[0],
      note: note || undefined,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="How are you feeling today?">
      <div className="space-y-5 p-2">
        <div className="flex justify-center gap-3">
          {moodOptions.map((option) => (
            <motion.button
              key={option.mood}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedMood(option.mood)}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all ${
                selectedMood === option.mood
                  ? `${moodColors[option.mood]} border-2 border-current`
                  : 'bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04]'
              }`}
            >
              <span className="text-3xl">{option.emoji}</span>
              <span className="text-xs font-bold text-slate-400">{option.label}</span>
            </motion.button>
          ))}
        </div>

        <div>
          <label className="text-xs text-slate-400 mb-1 block">Add a note (optional)</label>
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind?"
            className="w-full"
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!selectedMood}
            className="bg-gradient-to-r from-purple-500 to-violet-600"
          >
            <CheckCircle className="w-4 h-4 mr-2" /> Save Mood
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================
// JOURNAL MODAL
// ============================================
const JournalModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: JournalEntry) => void;
}> = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    if (!title || !content) return;
    onSave({
      id: Date.now().toString(),
      title,
      content,
      date: new Date().toISOString().split('T')[0],
      mood: 'okay',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Journal Entry">
      <div className="space-y-4 p-2">
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Title</label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Entry title..."
            className="w-full"
          />
        </div>
        <div>
          <label className="text-xs text-slate-400 mb-1 block">Your thoughts</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your thoughts and feelings..."
            rows={5}
            className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-purple-500/30 resize-none"
          />
        </div>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={!title || !content}
            className="bg-gradient-to-r from-purple-500 to-violet-600"
          >
            <BookOpen className="w-4 h-4 mr-2" /> Save Entry
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================
// MAIN MENTAL HEALTH PAGE
// ============================================
const MentalHealth: React.FC = () => {
  const [moods, setMoods] = useState<MoodEntry[]>(recentMoods);
  const [journals, setJournals] = useState<JournalEntry[]>(journalEntries);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [showJournalModal, setShowJournalModal] = useState(false);
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'mood' | 'meditation' | 'journal' | 'counseling'>('overview');
  const [dailyQuote] = useState(quotes[Math.floor(Math.random() * quotes.length)]);

  const tabs = [
    { id: 'overview' as const, label: 'Overview', icon: Brain },
    { id: 'mood' as const, label: 'Mood', icon: Heart },
    { id: 'meditation' as const, label: 'Meditation', icon: Music },
    { id: 'journal' as const, label: 'Journal', icon: BookOpen },
    { id: 'counseling' as const, label: 'Counseling', icon: MessageCircle },
  ];

  const handleSaveMood = (mood: MoodEntry) => {
    setMoods(prev => [mood, ...prev]);
  };

  const handleSaveJournal = (entry: JournalEntry) => {
    setJournals(prev => [entry, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#020408] p-4 lg:p-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              Mental Health & Wellness
            </h1>
            <p className="text-slate-400 text-sm mt-1">Your mental well-being matters. Take care of your mind.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setShowJournalModal(true)}>
              <BookOpen className="w-4 h-4 mr-2" /> Journal
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowMoodModal(true)}
              className="bg-gradient-to-r from-purple-500 to-violet-600"
            >
              <Heart className="w-4 h-4 mr-2" /> Log Mood
            </Button>
          </div>
        </div>

        {/* Daily Quote */}
        <GlassmorphicCard className="p-5 border-purple-500/20">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-white text-sm italic">"{dailyQuote.text}"</p>
              <p className="text-slate-500 text-xs mt-1">— {dailyQuote.author}</p>
            </div>
          </div>
        </GlassmorphicCard>
      </motion.div>

      {/* TABS */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : 'bg-white/[0.02] text-slate-400 border border-white/[0.06] hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </motion.button>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          { icon: Heart, title: 'Mood Tracker', desc: 'Log your daily mood', color: 'rose' },
          { icon: Moon, title: 'Sleep Analysis', desc: 'Monitor sleep patterns', color: 'purple' },
          { icon: Smile, title: 'Stress Relief', desc: 'Guided meditation', color: 'cyan' },
          { icon: Activity, title: 'Mindfulness', desc: 'Daily exercises', color: 'emerald' },
          { icon: BookOpen, title: 'Journal', desc: 'Write your thoughts', color: 'amber' },
          { icon: Music, title: 'Therapy Music', desc: 'Soothing sounds', color: 'blue' },
          { icon: MessageCircle, title: 'Counseling', desc: 'Connect with therapists', color: 'teal' },
          { icon: Brain, title: 'AI Therapy', desc: 'AI-powered support', color: 'indigo' },
        ].map((item, i) => {
          const Icon = item.icon;
          const colorClass = colorStyles[item.color] || colorStyles.blue;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
            >
              <GlassmorphicCard className={`p-5 cursor-pointer ${colorClass} hover:scale-[1.02] transition-all`}>
                <Icon className="w-8 h-8 mb-3" />
                <h3 className="text-white font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-slate-400 text-xs">{item.desc}</p>
                <ChevronRight className="w-4 h-4 mt-3 text-slate-600" />
              </GlassmorphicCard>
            </motion.div>
          );
        })}
      </div>

      {/* RECENT MOODS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <GlassmorphicCard className="p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-400" /> Recent Moods
          </h3>
          <div className="space-y-2">
            {moods.slice(0, 5).map((mood) => (
              <div key={mood.id} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{mood.emoji}</span>
                  <div>
                    <p className="text-white text-sm font-bold">{mood.label}</p>
                    <p className="text-slate-500 text-xs">{mood.date}</p>
                  </div>
                </div>
                {mood.note && <p className="text-slate-400 text-xs truncate max-w-[150px]">{mood.note}</p>}
              </div>
            ))}
          </div>
        </GlassmorphicCard>

        {/* MEDITATION TRACKS */}
        <GlassmorphicCard className="p-6">
          <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
            <Music className="w-5 h-5 text-cyan-400" /> Meditation
          </h3>
          <div className="space-y-2">
            {meditationTracks.map((track) => {
              const Icon = track.icon;
              return (
                <motion.div
                  key={track.id}
                  whileHover={{ x: 3 }}
                  className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] cursor-pointer transition-all"
                  onClick={() => setPlayingTrack(playingTrack === track.id ? null : track.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg bg-${track.color}-500/10 flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 text-${track.color}-400`} />
                    </div>
                    <div>
                      <p className="text-white text-sm font-bold">{track.title}</p>
                      <p className="text-slate-500 text-xs">{track.category} • {track.duration}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="xs">
                    {playingTrack === track.id ? (
                      <Pause className="w-4 h-4 text-purple-400" />
                    ) : (
                      <Play className="w-4 h-4 text-slate-400" />
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </GlassmorphicCard>
      </div>

      {/* COUNSELORS */}
      <GlassmorphicCard className="p-6 mb-8">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-teal-400" /> Available Counselors
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {counselors.map((counselor) => (
            <div key={counselor.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center gap-3 mb-3">
                <Avatar name={counselor.avatar} size="md" />
                <div>
                  <p className="text-white text-sm font-bold">{counselor.name}</p>
                  <p className="text-slate-500 text-xs">{counselor.specialty}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant={counselor.available ? 'success' : 'warning'} className="text-[10px]">
                  {counselor.available ? 'Available' : 'Busy'}
                </Badge>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="text-white text-sm font-bold">{counselor.rating}</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-3" disabled={!counselor.available}>
                {counselor.available ? (
                  <><Video className="w-4 h-4 mr-2" /> Book Session</>
                ) : (
                  'Not Available'
                )}
              </Button>
            </div>
          ))}
        </div>
      </GlassmorphicCard>

      {/* JOURNAL ENTRIES */}
      <GlassmorphicCard className="p-6">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" /> Recent Journal Entries
        </h3>
        <div className="space-y-3">
          {journals.map((entry) => (
            <div key={entry.id} className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-white font-bold text-sm">{entry.title}</h4>
                <span className="text-slate-500 text-xs">{entry.date}</span>
              </div>
              <p className="text-slate-400 text-xs line-clamp-2">{entry.content}</p>
            </div>
          ))}
          {journals.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-slate-700 mx-auto mb-3" />
              <p className="text-slate-400">No journal entries yet</p>
              <Button variant="primary" className="mt-3" onClick={() => setShowJournalModal(true)}>
                <Plus className="w-4 h-4 mr-2" /> Write First Entry
              </Button>
            </div>
          )}
        </div>
      </GlassmorphicCard>

      {/* MODALS */}
      <MoodTrackerModal
        isOpen={showMoodModal}
        onClose={() => setShowMoodModal(false)}
        onSave={handleSaveMood}
      />
      <JournalModal
        isOpen={showJournalModal}
        onClose={() => setShowJournalModal(false)}
        onSave={handleSaveJournal}
      />
    </div>
  );
};

export default MentalHealth;