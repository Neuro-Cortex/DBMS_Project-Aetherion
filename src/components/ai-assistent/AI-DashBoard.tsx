// src/components/ai-assistent/AIAssistant.tsx
// ULTIMATE AI COMMAND CENTER DASHBOARD - JARVIS + CHATGPT + FUTURISTIC OS
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import {
 Activity, Settings, X, Plus, 
  RefreshCw,  Zap, Target, 
  Brain,  MessageCircle, Send, Mic, MicOff, 
  Camera,  Download, Upload,  Code, 
  BarChart3, TrendingUp, 
   Cpu, 
   AlertCircle, Timer, 
  BookOpen, GraduationCap, 
  Users, Stethoscope, Pill,  Megaphone,
  User, LogOut,  Siren, Workflow
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { useAppSelector } from '../../store';
import { selectUser } from '../../store/slices/authSlice';

// ============================================
// CUSTOM UI COMPONENTS (Built-in)
// ============================================
const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div onClick={onClick} className={`bg-slate-900/80 backdrop-blur-xl border border-white/[0.06] rounded-2xl ${className}`}>
    {children}
  </div>
);

const GlassmorphicCard: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-white/[0.02] backdrop-blur-2xl border border-white/[0.06] rounded-2xl ${className}`}>
    {children}
  </div>
);

const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
}> = ({ children, variant = 'primary', size = 'md', className = '', onClick }) => {
  const baseClasses = 'inline-flex items-center justify-center font-bold transition-all duration-200 rounded-xl';
  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-cyan-600 text-white hover:shadow-lg hover:shadow-purple-500/20',
    outline: 'border border-white/10 text-white hover:bg-white/5',
    ghost: 'text-slate-400 hover:text-white hover:bg-white/5'
  };
  const sizes = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  return (
    <button onClick={onClick} className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  );
};

const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'info' | 'error'; className?: string }> = ({ children, variant = 'info', className = '' }) => {
  const variants = {
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    info: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    error: 'bg-red-500/10 text-red-400 border-red-500/20'
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Avatar: React.FC<{ src?: string; alt?: string; size?: 'sm' | 'md' | 'lg'; className?: string }> = ({ src, alt = '', size = 'md', className = '' }) => {
  const sizes = { sm: 'w-8 h-8', md: 'w-10 h-10', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center ${className}`}>
      {src ? <img src={src} alt={alt} className="w-full h-full rounded-full object-cover" /> : <User className="w-1/2 h-1/2 text-white" />}
    </div>
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Input: React.FC<{
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  onKeyDown?: (e: React.KeyboardEvent) => void;


}> = ({ value, onChange, placeholder = '', className = '', onKeyDown }) => (
 
 
  <input
    type="text"
    value={value}
    onChange={onChange}
    onKeyDown={onKeyDown}
    placeholder={placeholder}
    className={`px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500/30 transition-all ${className}`}
  />
);


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const Tab: React.FC<{ label: string; active?: boolean; onClick?: () => void; icon?: React.ElementType }> = ({ label, active = false, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
      active ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'
    }`}
  >
    {Icon && <Icon className="w-4 h-4" />}
    {label}
  </button>
);

// ============================================
// TYPES
// ============================================
interface AIModel {
  id: string;
  name: string;
  provider: string;
  status: 'online' | 'offline' | 'training';
  latency: string;
  accuracy: number;
  tokensUsed: number;
  color: string;
}

interface AIAgent {
  id: string;
  name: string;
  icon: React.ElementType;
  task: string;
  progress: number;
  status: 'active' | 'idle' | 'completed' | 'error';
  color: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  model?: string;
}

interface AutomationRule {
  id: string;
  trigger: string;
  action: string;
  status: 'active' | 'paused';
  icon: React.ElementType;
}

interface Prediction {
  id: string;
  title: string;
  value: string;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  color: string;
}

interface ChartDataPoint {
  time: string;
  requests: number;
  tokens: number;
  latency: number;
}

interface AIStats {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
  change: string;
}

// ============================================
// MOCK DATA
// ============================================
const aiModels: AIModel[] = [
  { id: '1', name: 'GPT-4 Turbo', provider: 'OpenAI', status: 'online', latency: '320ms', accuracy: 95.5, tokensUsed: 2450000, color: 'emerald' },
  { id: '2', name: 'DeepSeek V3', provider: 'DeepSeek', status: 'online', latency: '180ms', accuracy: 94.8, tokensUsed: 1820000, color: 'blue' },
  { id: '3', name: 'Gemini Pro', provider: 'Google', status: 'online', latency: '250ms', accuracy: 93.2, tokensUsed: 3100000, color: 'purple' },
  { id: '4', name: 'Claude 3', provider: 'Anthropic', status: 'online', latency: '290ms', accuracy: 96.1, tokensUsed: 1560000, color: 'amber' },
  { id: '5', name: 'Local LLM', provider: 'Local', status: 'training', latency: '45ms', accuracy: 88.5, tokensUsed: 890000, color: 'cyan' },
];

const aiAgents: AIAgent[] = [
  { id: '1', name: 'Research Agent', icon: BookOpen, task: 'Analyzing medical journals', progress: 78, status: 'active', color: 'blue' },
  { id: '2', name: 'Medical Agent', icon: Stethoscope, task: 'Patient risk assessment', progress: 92, status: 'active', color: 'emerald' },
  { id: '3', name: 'Coding Agent', icon: Code, task: 'Generating API docs', progress: 45, status: 'idle', color: 'purple' },
  { id: '4', name: 'Marketing Agent', icon: Megaphone, task: 'Campaign analysis', progress: 100, status: 'completed', color: 'amber' },
  { id: '5', name: 'Pharmacy Agent', icon: Pill, task: 'Drug interaction check', progress: 60, status: 'active', color: 'rose' },
];

const automationRules: AutomationRule[] = [
  { id: '1', trigger: 'New user registers', action: 'Send welcome email + health tips', status: 'active', icon: User },
  { id: '2', trigger: 'High risk patient detected', action: 'Alert admin + schedule follow-up', status: 'active', icon: AlertCircle },
  { id: '3', trigger: 'Medicine stock low', action: 'Auto-order + notify pharmacy', status: 'paused', icon: Pill },
  { id: '4', trigger: 'Emergency SOS activated', action: 'Alert nearest hospital + ambulance', status: 'active', icon: Siren },
];

const predictions: Prediction[] = [
  { id: '1', title: 'Patient Admissions', value: '1,245', confidence: 94, trend: 'up', color: 'blue' },
  { id: '2', title: 'Disease Outbreak Risk', value: 'Low', confidence: 88, trend: 'stable', color: 'emerald' },
  { id: '3', title: 'Medicine Demand', value: '+23%', confidence: 91, trend: 'up', color: 'amber' },
  { id: '4', title: 'Emergency Cases', value: '-12%', confidence: 86, trend: 'down', color: 'red' },
];

const chartData: ChartDataPoint[] = [
  { time: '00:00', requests: 120, tokens: 45000, latency: 250 },
  { time: '04:00', requests: 80, tokens: 32000, latency: 220 },
  { time: '08:00', requests: 350, tokens: 120000, latency: 310 },
  { time: '12:00', requests: 520, tokens: 180000, latency: 380 },
  { time: '16:00', requests: 450, tokens: 160000, latency: 340 },
  { time: '20:00', requests: 280, tokens: 95000, latency: 280 },
];

const aiStatsData: AIStats[] = [
  { icon: Zap, label: 'AI Requests', value: '1.2M', color: 'purple', change: '+12%' },
  { icon: Cpu, label: 'Tokens Used', value: '4.5M', color: 'cyan', change: '+18%' },
  { icon: Timer, label: 'Response Time', value: '245ms', color: 'emerald', change: '-8%' },
  { icon: Target, label: 'Accuracy', value: '96.2%', color: 'blue', change: '+2%' },
  { icon: Users, label: 'Active Users', value: '1,247', color: 'amber', change: '+5%' },
  { icon: Activity, label: 'Model Health', value: '99.9%', color: 'green', change: 'Stable' },
];

const sidebarLinks = [
  { icon: MessageCircle, label: 'AI Chat', path: 'chat' },
  { icon: BarChart3, label: 'Analytics', path: 'analytics' },
  { icon: TrendingUp, label: 'Predictions', path: 'predictions' },
  { icon: Workflow, label: 'Automation', path: 'automation' },
  { icon: Users, label: 'Agents', path: 'agents' },
  { icon: BookOpen, label: 'Knowledge Base', path: 'knowledge' },
  { icon: GraduationCap, label: 'Training', path: 'training' },
  { icon: Settings, label: 'Settings', path: 'settings' },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400',
  teal: 'bg-teal-500/10 text-teal-400',
  purple: 'bg-purple-500/10 text-purple-400',
  amber: 'bg-amber-500/10 text-amber-400',
  green: 'bg-green-500/10 text-green-400',
  red: 'bg-red-500/10 text-red-400',
  cyan: 'bg-cyan-500/10 text-cyan-400',
  emerald: 'bg-emerald-500/10 text-emerald-400',
  indigo: 'bg-indigo-500/10 text-indigo-400',
  slate: 'bg-slate-500/10 text-slate-400',
  pink: 'bg-pink-500/10 text-pink-400',
  rose: 'bg-rose-500/10 text-rose-400',
};

const quickPrompts = [
  'Ask AI anything...',
  'Generate Report',
  'Analyze Patient Data',
  'Predict Outcomes',
  'Run Diagnostics',
];

const orbSuggestions = [
  'Check symptoms',
  'Medicine info',
  'Find doctor',
  'Health tips',
];

// ============================================
// FLOATING AI ORB
// ============================================
const FloatingAIOrb: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <motion.button
    onClick={onClick}
    className="fixed bottom-8 right-8 z-50 group"
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <div className="relative">
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 blur-2xl"
      />
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="relative w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 via-cyan-500 to-blue-600 flex items-center justify-center shadow-2xl shadow-purple-500/30 border-2 border-white/20"
      >
        <Brain className="w-8 h-8 text-white" />
      </motion.div>
      <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
    </div>
  </motion.button>
);

// ============================================
// AI STATUS HEADER
// ============================================
const AIStatusHeader: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-purple-900/30 via-slate-900 to-cyan-900/30 border border-purple-500/20 p-8"
  >
    <div className="absolute inset-0">
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
    </div>

    <div className="relative z-10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-2xl shadow-purple-500/20"
          >
            <Brain className="w-7 h-7 text-white" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              AI Command Center
              <Badge variant="success" className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Online
              </Badge>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Neural Network Active • All Systems Operational
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="border-purple-500/30 text-purple-400">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh
          </Button>
          <Button variant="primary" size="sm" className="bg-gradient-to-r from-purple-500 to-cyan-500">
            <Zap className="w-4 h-4 mr-2" /> New Task
          </Button>
        </div>
      </div>

      {/* Live Thinking Animation */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ height: [8, 24, 8], opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              className="w-1.5 bg-gradient-to-t from-purple-500 to-cyan-500 rounded-full"
            />
          ))}
        </div>
        <span className="text-cyan-400 text-sm font-mono">
          Processing 1,247 active tasks...
        </span>
      </div>

      {/* Quick Prompts */}
      <div className="flex gap-2 flex-wrap">
        {quickPrompts.map((prompt) => (
          <motion.button
            key={prompt}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-slate-400 text-sm hover:border-purple-500/30 hover:text-white transition-all"
          >
            {prompt}
          </motion.button>
        ))}
      </div>
    </div>
  </motion.div>
);

// ============================================
// MAIN AI DASHBOARD COMPONENT
// ============================================
const AIAssistant: React.FC = () => {
  const currentUser = useAppSelector(selectUser);
  const [activeTab, setActiveTab] = useState('chat');
  const [showOrbChat, setShowOrbChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I am Aetherion AI. How can I assist you today? I can help with medical diagnostics, data analysis, automation, and more.',
      timestamp: 'Just now',
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedModel, setSelectedModel] = useState('GPT-4 Turbo');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = useCallback(() => {
    if (!inputMessage.trim() || isLoading) return;

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: 'Just now',
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const replies = [
        'I understand your query. Let me analyze that for you...',
        'Based on my analysis, here are the key insights...',
        'I can help you with that. Here\'s what I found...',
        'Great question! Let me provide a comprehensive answer...',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];
      
      const reply: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomReply,
        timestamp: 'Just now',
        model: selectedModel,
      };
      setChatMessages((prev) => [...prev, reply]);
      setIsLoading(false);
    }, 1500);
  }, [inputMessage, isLoading, selectedModel]);

  const toggleListening = () => {
    setIsListening(!isListening);
    // Here you would integrate with Web Speech API
    if (!isListening) {
      // Start listening logic
      console.log('Started listening...');
    } else {
      // Stop listening logic
      console.log('Stopped listening...');
    }
  };

  const handleFileUpload = () => {
    // File upload logic
    console.log('File upload triggered');
  };

  const handleCameraCapture = () => {
    // Camera capture logic
    console.log('Camera capture triggered');
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-emerald-400';
      case 'down': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  const getTrendArrow = (trend: string) => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  return (
    <div className="min-h-screen bg-[#020408] flex">
      {/* ============================================ */}
      {/* SIDEBAR */}
      {/* ============================================ */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950/80 backdrop-blur-xl border-r border-purple-500/10 h-screen sticky top-0">
        <div className="p-6 border-b border-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/20"
              >
                <Brain className="w-6 h-6 text-white" />
              </motion.div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 animate-pulse" />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">Aetherion AI</h3>
              <p className="text-cyan-400 text-xs">Neural Core v4.2</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = activeTab === link.path;
            return (
              <motion.button
                key={link.path}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(link.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-purple-300 border border-purple-500/20 shadow-lg'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </motion.button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-purple-500/10">
          <div className="flex items-center gap-3 mb-4">
            <Avatar size="sm" src={currentUser?.profileImage} alt={currentUser?.name || currentUser?.fullName} />
            <div>
              <p className="text-white text-sm font-bold">{currentUser?.name || currentUser?.fullName || currentUser?.email || 'User'}</p>
              <p className="text-slate-500 text-xs capitalize">{currentUser?.primaryRole || 'User'} {(currentUser?.isOnline) ? '• Online' : ''}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full text-slate-400 hover:text-red-400 justify-start"
          >
            <LogOut className="w-4 h-4 mr-2" /> Disconnect
          </Button>
        </div>
      </aside>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="flex-1 min-w-0">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {/* AI STATUS HEADER */}
          <AIStatusHeader />

          {/* AI ANALYTICS CARDS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {aiStatsData.map((stat, i) => {
              const Icon = stat.icon;
              const colors = colorMap[stat.color] || 'bg-slate-500/10 text-slate-400';
              const [bg, text] = colors.split(' ');
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-4 text-center hover:shadow-lg transition-all group cursor-pointer">
                    <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-5 h-5 ${text}`} />
                    </div>
                    <p className="text-xl font-black text-white">{stat.value}</p>
                    <p className="text-xs text-slate-400">{stat.label}</p>
                    <p
                      className={`text-[10px] mt-1 font-bold ${
                        stat.change.startsWith('+')
                          ? 'text-emerald-400'
                          : stat.change === 'Stable'
                          ? 'text-slate-400'
                          : 'text-red-400'
                      }`}
                    >
                      {stat.change}
                    </p>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* AI CHAT PANEL + MODELS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* CHAT PANEL */}
            <div className="lg:col-span-2">
              <GlassmorphicCard className="h-[600px] flex flex-col p-0 overflow-hidden border-purple-500/10">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/[0.06] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center"
                    >
                      <Brain className="w-5 h-5 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-white font-bold">AI Assistant</h3>
                      <p className="text-emerald-400 text-xs flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Online
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedModel}
                      onChange={(e) => setSelectedModel(e.target.value)}
                      className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-xs focus:outline-none focus:border-purple-500/30"
                    >
                      {aiModels.map((m) => (
                        <option key={m.id} value={m.name} className="bg-slate-900">
                          {m.name}
                        </option>
                      ))}
                    </select>
                    <Button variant="ghost" size="xs">
                      <Code className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="xs">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-purple-500/20 scrollbar-track-transparent">
                  <AnimatePresence>
                    {chatMessages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] p-4 rounded-2xl ${
                            msg.role === 'user'
                              ? 'bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/20'
                              : 'bg-white/[0.03] border border-white/[0.06]'
                          }`}
                        >
                          {msg.role === 'assistant' && (
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="w-4 h-4 text-purple-400" />
                              <span className="text-purple-400 text-xs font-bold">AI Assistant</span>
                              {msg.model && (
                                <span className="text-slate-600 text-[10px]">• {msg.model}</span>
                              )}
                            </div>
                          )}
                          {msg.role === 'user' && (
                            <div className="flex items-center gap-2 mb-2">
                              <User className="w-4 h-4 text-cyan-400" />
                              <span className="text-cyan-400 text-xs font-bold">You</span>
                            </div>
                          )}
                          <p className="text-white text-sm leading-relaxed">{msg.content}</p>
                          <p className="text-slate-600 text-[10px] mt-2">{msg.timestamp}</p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="bg-white/[0.03] border border-white/[0.06] p-4 rounded-2xl">
                        <div className="flex items-center gap-2">
                          {[0, 1, 2].map((i) => (
                            <motion.div
                              key={i}
                              animate={{ opacity: [0.3, 1, 0.3] }}
                              transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={toggleListening}
                      className={`p-2.5 rounded-xl transition-all ${
                        isListening ? 'bg-red-500/20 text-red-400' : 'bg-white/[0.03] text-slate-400'
                      }`}
                    >
                      {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleCameraCapture}
                      className="p-2.5 rounded-xl bg-white/[0.03] text-slate-400 hover:text-white transition-all"
                    >
                      <Camera className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleFileUpload}
                      className="p-2.5 rounded-xl bg-white/[0.03] text-slate-400 hover:text-white transition-all"
                    >
                      <Upload className="w-5 h-5" />
                    </motion.button>
                    <input
                      type="text"
                      value={inputMessage}
                      onChange={(e) => setInputMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Ask AI anything..."
                      className="flex-1 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500/30 transition-all"
                    />
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="primary"
                        onClick={handleSendMessage}
                        className="bg-gradient-to-r from-purple-500 to-cyan-500"
                        size="md"
                      >
                        <Send className="w-5 h-5" />
                      </Button>
                    </motion.div>
                  </div>
                </div>
              </GlassmorphicCard>
            </div>

            {/* AI MODELS + AGENTS */}
            <div className="space-y-6">
              {/* Models */}
              <GlassmorphicCard className="p-6 border-purple-500/10">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-purple-400" /> AI Models
                </h3>
                <div className="space-y-3">
                  {aiModels.map((model) => (
                    <motion.div
                      key={model.id}
                      whileHover={{ x: 4 }}
                      className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${
                            model.status === 'online'
                              ? 'bg-emerald-400'
                              : model.status === 'training'
                              ? 'bg-amber-400 animate-pulse'
                              : 'bg-slate-500'
                          }`}
                        />
                        <div>
                          <h4 className="text-white text-sm font-bold">{model.name}</h4>
                          <p className="text-slate-500 text-[10px]">
                            {model.provider} • {model.latency}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-white text-sm font-bold">{model.accuracy}%</p>
                        <p className="text-slate-500 text-[10px]">
                          {(model.tokensUsed / 1000000).toFixed(1)}M tokens
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </GlassmorphicCard>

              {/* Active Agents */}
              <GlassmorphicCard className="p-6 border-purple-500/10">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-cyan-400" /> AI Agents
                </h3>
                <div className="space-y-3">
                  {aiAgents.map((agent) => {
                    const Icon = agent.icon;
                    return (
                      <motion.div
                        key={agent.id}
                        whileHover={{ x: 4 }}
                        className="p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`p-1.5 rounded-lg bg-${agent.color}-500/10`}>
                              <Icon className={`w-4 h-4 text-${agent.color}-400`} />
                            </div>
                            <span className="text-white text-sm font-bold">{agent.name}</span>
                          </div>
                          <Badge
                            variant={
                              agent.status === 'active'
                                ? 'success'
                                : agent.status === 'completed'
                                ? 'info'
                                : agent.status === 'error'
                                ? 'error'
                                : 'warning'
                            }
                            className="text-[10px]"
                          >
                            {agent.status}
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-xs mb-2">{agent.task}</p>
                        <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${agent.progress}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full bg-gradient-to-r from-${agent.color}-500 to-${agent.color}-400 rounded-full`}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </GlassmorphicCard>
            </div>
          </div>

          {/* PREDICTIONS + AUTOMATION */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Predictions */}
            <div className="lg:col-span-2">
              <GlassmorphicCard className="p-6 border-purple-500/10">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-400" /> Smart Predictions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {predictions.map((pred) => (
                    <motion.div
                      key={pred.id}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-xs">{pred.title}</span>
                        <Badge variant="info" className="text-[10px]">
                          {pred.confidence}% confidence
                        </Badge>
                      </div>
                      <p className="text-2xl font-black text-white">{pred.value}</p>
                      <p className={`text-xs mt-1 ${getTrendColor(pred.trend)}`}>
                        {getTrendArrow(pred.trend)} {pred.trend}
                      </p>
                    </motion.div>
                  ))}
                </div>
                {/* Chart */}
                <div className="mt-6 bg-white/[0.02] rounded-2xl p-4 border border-white/[0.04]">
                  <h4 className="text-white text-sm font-bold mb-4">Request Analytics</h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorTokens" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                      <XAxis dataKey="time" stroke="#ffffff40" fontSize={12} />
                      <YAxis stroke="#ffffff40" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1a1a2e',
                          border: '1px solid #ffffff20',
                          borderRadius: '8px',
                        }}
                      />
                      <Area type="monotone" dataKey="requests" stroke="#8B5CF6" fill="url(#colorAI)" />
                      <Area type="monotone" dataKey="tokens" stroke="#06B6D4" fill="url(#colorTokens)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlassmorphicCard>
            </div>

            {/* Automation Rules */}
            <GlassmorphicCard className="p-6 border-purple-500/10">
              <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <Workflow className="w-5 h-5 text-cyan-400" /> Automation
              </h3>
              <div className="space-y-3">
                {automationRules.map((rule) => {
                  const Icon = rule.icon;
                  return (
                    <motion.div
                      key={rule.id}
                      whileHover={{ x: 4 }}
                      className="p-3 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4 text-cyan-400" />
                          <span className="text-white text-sm font-bold">IF {rule.trigger}</span>
                        </div>
                        <Badge variant={rule.status === 'active' ? 'success' : 'warning'} className="text-[10px]">
                          {rule.status}
                        </Badge>
                      </div>
                      <p className="text-slate-400 text-xs">THEN {rule.action}</p>
                    </motion.div>
                  );
                })}
              </div>
              <Button variant="outline" size="sm" className="w-full mt-4 border-purple-500/30 text-purple-400">
                <Plus className="w-4 h-4 mr-2" /> Add Rule
              </Button>
            </GlassmorphicCard>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* FLOATING AI ORB */}
      {/* ============================================ */}
      <FloatingAIOrb onClick={() => setShowOrbChat(!showOrbChat)} />

      {/* Orb Chat Popup */}
      <AnimatePresence>
        {showOrbChat && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-24 right-8 w-96 h-[500px] bg-slate-950/95 backdrop-blur-2xl border border-purple-500/20 rounded-[2rem] shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Orb Chat Header */}
            <div className="p-4 border-b border-purple-500/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center"
                >
                  <Brain className="w-4 h-4 text-white" />
                </motion.div>
                <span className="text-white font-bold">AI Assistant</span>
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowOrbChat(false)}
                className="p-1 rounded-lg hover:bg-white/5"
              >
                <X className="w-5 h-5 text-slate-400" />
              </motion.button>
            </div>

            {/* Orb Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              <div className="bg-white/[0.03] rounded-2xl p-4 border border-white/[0.06] mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 text-xs font-bold">AI Assistant</span>
                </div>
                <p className="text-white text-sm">How can I help you today?</p>
              </div>

              <div className="flex flex-wrap gap-2">
                {orbSuggestions.map((s) => (
                  <motion.button
                    key={s}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 rounded-xl bg-purple-500/10 text-purple-400 text-xs hover:bg-purple-500/20 transition-all border border-purple-500/20"
                  >
                    {s}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Orb Chat Input */}
            <div className="p-4 border-t border-purple-500/10 flex gap-2">
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-white/[0.03] text-slate-400 hover:text-white"
              >
                <Mic className="w-4 h-4" />
              </motion.button>
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-purple-500/30"
                onKeyDown={(e) => e.key === 'Enter' && console.log('Send message')}
              />
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Custom Scrollbar Styles */}
      <style>{`
        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(139, 92, 246, 0.2);
          border-radius: 3px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(139, 92, 246, 0.4);
        }
      `}</style>
    </div>
  );
};

export default AIAssistant;
export { FloatingAIOrb, AIStatusHeader };