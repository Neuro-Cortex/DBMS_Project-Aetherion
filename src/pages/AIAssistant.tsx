// src/pages/AIAssistant.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Stethoscope, Baby, Heart, 
  Sparkles, Brain, Microscope, Pill, Activity,
  Calendar, Clock, Star, TrendingUp, Shield,
  MessageCircle, HelpCircle, FileText, BookOpen,
  ChevronRight, Zap, Award, Globe, Users
} from 'lucide-react';
import { ChatBot } from 'src/components/ai-assistent/ChatBot';
import { SymptomChecker } from 'src/components/ai-assistent/SymptomChecker';
import { PregnancyGuide } from 'src/components/ai-assistent/PregnancyGuide';
import { BabyCareAdvice } from 'src/components/ai-assistent/BabyCareAdvice';
import { Button } from 'src/components/ui/Button';
import { Badge } from 'src/components/ui/Badge';
import { GlassmorphicCard } from 'src/components/ui/GlassmorphicCard';

// ============================================
// TYPES
// ============================================

interface AIFeature {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
  gradient: string;
  stats?: string;
  badge?: string;
}

interface AIStat {
  label: string;
  value: string;
  icon: React.ElementType;
  trend: string;
}

// ============================================
// FEATURES DATA
// ============================================

const AIFeatures: AIFeature[] = [
  { 
    id: 'symptom', 
    label: 'Symptom Checker', 
    icon: Stethoscope, 
    description: 'Analyze your symptoms and get possible conditions with AI-powered insights',
    color: 'from-cyan-500 to-blue-500',
    gradient: 'from-cyan-500/20 to-blue-500/20',
    stats: '95% Accuracy',
    badge: 'Most Used'
  },
  { 
    id: 'pregnancy', 
    label: 'Pregnancy Guide', 
    icon: Heart, 
    description: 'Personalized weekly pregnancy tracking and expert advice for expecting mothers',
    color: 'from-pink-500 to-rose-500',
    gradient: 'from-pink-500/20 to-rose-500/20',
    stats: '50K+ Users',
    badge: 'Trending'
  },
  { 
    id: 'baby', 
    label: 'Baby Care', 
    icon: Baby, 
    description: 'Comprehensive baby care tips, vaccination schedules, and developmental milestones',
    color: 'from-purple-500 to-indigo-500',
    gradient: 'from-purple-500/20 to-indigo-500/20',
    stats: '10K+ Guides',
    badge: 'New'
  },
  { 
    id: 'chat', 
    label: 'AI Chat Bot', 
    icon: MessageSquare, 
    description: '24/7 conversational AI assistant for instant health queries and guidance',
    color: 'from-green-500 to-emerald-500',
    gradient: 'from-green-500/20 to-emerald-500/20',
    stats: '24/7 Support',
    badge: 'Live'
  },
];

const AIStats: AIStat[] = [
  { label: 'AI Accuracy', value: '95%', icon: TrendingUp, trend: '+5%' },
  { label: 'Users Served', value: '100K+', icon: Users, trend: '+25%' },
  { label: 'Response Time', value: '< 2s', icon: Clock, trend: '-30%' },
  { label: 'Satisfaction', value: '4.8/5', icon: Star, trend: '+0.3' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const AIAssistant: React.FC = () => {
  const [activeTab, setActiveTab] = useState('symptom');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFeature, setSelectedFeature] = useState<AIFeature | null>(null);

  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const getFeatureById = (id: string) => AIFeatures.find(f => f.id === id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-20 pb-12 px-4">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-cyan-500/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-2000" />
        </div>

        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
            <Brain className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span className="text-white/80 text-sm">AI-Powered Health Assistant</span>
            <Sparkles className="w-4 h-4 text-yellow-400" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Your Personal{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Health Assistant
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Get instant medical insights, symptom analysis, pregnancy guidance, 
            and baby care tips powered by advanced artificial intelligence.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
            {AIStats.map((stat, i) => (
              <div key={i} className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
                <stat.icon className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                <div className="text-xl font-bold text-white">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
                <Badge variant="success" size="xs" className="mt-1">{stat.trend}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {AIFeatures.map((feature) => {
            const Icon = feature.icon;
            const isActive = activeTab === feature.id;
            return (
              <motion.button
                key={feature.id}
                whileHover={{ y: -5, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(feature.id)}
                className={`relative group text-left transition-all duration-300 ${
                  isActive ? 'ring-2 ring-cyan-500/50' : ''
                }`}
              >
                <div className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all h-full`}>
                  {feature.badge && (
                    <div className="absolute -top-2 -right-2">
                      <Badge variant={feature.badge === 'Live' ? 'danger' : 'gradient'} size="xs" pulse={feature.badge === 'Live'}>
                        {feature.badge}
                      </Badge>
                    </div>
                  )}
                  <div className={`w-12 h-12 bg-gradient-to-r ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.label}</h3>
                  <p className="text-white/60 text-sm leading-relaxed">{feature.description}</p>
                  {feature.stats && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                      <span className="text-xs text-cyan-400">{feature.stats}</span>
                    </div>
                  )}
                  {isActive && (
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-cyan-400 to-purple-400 rounded-full" />
                  )}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Active Feature Content */}
      <div className="container mx-auto px-4 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <GlassmorphicCard variant="glass" className="overflow-hidden">
              {/* Feature Header */}
              <div className="p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getFeatureById(activeTab)?.color} rounded-xl flex items-center justify-center`}>
                    {(() => {
                      const Icon = getFeatureById(activeTab)?.icon || MessageSquare;
                      return <Icon className="w-6 h-6 text-white" />;
                    })()}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      {getFeatureById(activeTab)?.label}
                    </h2>
                    <p className="text-white/60 text-sm">
                      {getFeatureById(activeTab)?.description}
                    </p>
                  </div>
                  {isLoading && (
                    <div className="ml-auto">
                      <div className="w-5 h-5 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>

              {/* Feature Content */}
              <div className="p-6">
                {activeTab === 'symptom' && <SymptomChecker />}
                {activeTab === 'pregnancy' && <PregnancyGuide currentWeek={24} />}
                {activeTab === 'baby' && <BabyCareAdvice babyAgeMonths={6} />}
                {activeTab === 'chat' && (
                  <div className="h-[600px]">
                    <ChatBot variant="glass" isOpen={true} />
                  </div>
                )}
              </div>
            </GlassmorphicCard>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Trust Section */}
      <div className="container mx-auto px-4 py-12 border-t border-white/10">
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-2">Trusted by Healthcare Professionals</h3>
          <p className="text-white/60">Join thousands of users who rely on our AI health assistant</p>
        </div>
        <div className="flex flex-wrap justify-center gap-8">
          {[
            { icon: Shield, text: 'HIPAA Compliant' },
            { icon: Award, text: 'Medically Reviewed' },
            { icon: Globe, text: 'Available 24/7' },
            { icon: Users, text: '100K+ Users' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-white/60">
              <item.icon className="w-5 h-5 text-cyan-400" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-cyan-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl p-8 text-center border border-white/10">
          <h3 className="text-2xl font-bold text-white mb-2">
            Need Professional Medical Advice?
          </h3>
          <p className="text-white/60 mb-6 max-w-md mx-auto">
            While our AI provides helpful insights, always consult with a healthcare professional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="gradient" size="lg">
              Find a Doctor
            </Button>
            <Button variant="glass" size="lg">
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;