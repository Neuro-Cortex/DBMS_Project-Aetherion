import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart,
  Baby,
  Calendar,
  Sparkles,
  TrendingUp,
  Clock,
  Apple,
  Activity,
  Shield,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface PregnancyWeekData {
  week: number;
  trimester: 1 | 2 | 3;
  babySize: string;
  babyWeight: string;
  development: string[];
  symptoms: string[];
  tips: string[];
  nutrition: string[];
  exercise: string[];
  aiAdvice: string;
}

export interface PregnancyGuideProps {
  currentWeek?: number;
  variant?: 'glass' | 'gradient' | 'neon';
  className?: string;
}

// ============================================
// MOCK DATA
// ============================================
const weekData: Record<number, PregnancyWeekData> = {
  8: {
    week: 8,
    trimester: 1,
    babySize: 'A Raspberry',
    babyWeight: '~1 gram',
    development: ['Fingers and toes forming', 'Brain developing rapidly', 'Heart beating strongly'],
    symptoms: ['Morning sickness', 'Fatigue', 'Breast tenderness', 'Frequent urination'],
    tips: ['Take prenatal vitamins', 'Stay hydrated', 'Get plenty of rest', 'Avoid caffeine'],
    nutrition: ['Folic acid', 'Iron-rich foods', 'Calcium', 'Protein'],
    exercise: ['Walking', 'Swimming', 'Prenatal yoga'],
    aiAdvice: 'Week 8 is crucial for baby\'s organ development. Focus on eating small, frequent meals to manage nausea. Ensure you\'re taking 400-800mcg of folic acid daily.',
  },
  20: {
    week: 20,
    trimester: 2,
    babySize: 'A Banana',
    babyWeight: '~300 grams',
    development: ['You may feel first kicks', 'Senses developing', 'Hair and nails growing'],
    symptoms: ['Growing belly', 'Back pain', 'Heartburn', 'Swollen ankles'],
    tips: ['Sleep on your side', 'Wear comfortable shoes', 'Practice kegel exercises', 'Start nursery planning'],
    nutrition: ['Vitamin D', 'Omega-3 fatty acids', 'Fiber', 'Lean protein'],
    exercise: ['Prenatal pilates', 'Stationary biking', 'Light stretching'],
    aiAdvice: 'Welcome to the halfway point! Your baby is about the size of a banana. This is a great time to schedule your anatomy scan. Keep tracking those kicks!',
  },
  32: {
    week: 32,
    trimester: 3,
    babySize: 'A Coconut',
    babyWeight: '~1.8 kg',
    development: ['Lungs maturing', 'Bones hardening', 'Fat accumulating'],
    symptoms: ['Shortness of breath', 'Braxton Hicks', 'Trouble sleeping', 'Frequent urination'],
    tips: ['Pack hospital bag', 'Practice breathing exercises', 'Finalize birth plan', 'Install car seat'],
    nutrition: ['Iron', 'Calcium', 'Vitamin K', 'Complex carbohydrates'],
    exercise: ['Gentle walking', 'Pelvic floor exercises', 'Stretching'],
    aiAdvice: 'You\'re in the home stretch! Baby is practicing breathing movements. Focus on resting and preparing for delivery. Contact your doctor if you notice any sudden swelling or vision changes.',
  },
};

// ============================================
// PREGNANCY GUIDE COMPONENT
// ============================================
export const PregnancyGuide: React.FC<PregnancyGuideProps> = ({
  currentWeek = 20,
  variant = 'glass',
  className,
}) => {
  const [activeWeek, setActiveWeek] = useState(currentWeek);
  const data = weekData[activeWeek] || weekData[20];

  const progress = (activeWeek / 40) * 100;
  const daysLeft = (40 - activeWeek) * 7;

  const trimesterColors = {
    1: 'from-green-500 to-emerald-500',
    2: 'from-blue-500 to-cyan-500',
    3: 'from-purple-500 to-pink-500',
  };

  return (
    <motion.div
      className={twMerge(clsx('max-w-6xl mx-auto space-y-6', className))}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <GlassmorphicCard variant={variant}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-4 rounded-2xl bg-pink-500/10"
            >
              <Baby className="w-12 h-12 text-pink-400" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-black text-white">Week {activeWeek}</h2>
              <p className="text-white/60">Trimester {data.trimester} • {daysLeft} days to go</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="glassmorphic" size="sm" iconOnly onClick={() => setActiveWeek(Math.max(8, activeWeek - 1))}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <div className="text-center min-w-[100px]">
              <p className="text-sm text-white/60">Progress</p>
              <p className="text-2xl font-black text-white">{progress.toFixed(0)}%</p>
            </div>
            <Button variant="glassmorphic" size="sm" iconOnly onClick={() => setActiveWeek(Math.min(40, activeWeek + 1))}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 pb-6">
          <div className="w-full h-4 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={clsx('h-full rounded-full bg-gradient-to-r', trimesterColors[data.trimester])}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, type: 'spring' }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/40">
            <span>Week 1</span>
            <span>Week 13</span>
            <span>Week 27</span>
            <span>Week 40</span>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Baby Info */}
        <GlassmorphicCard variant={variant}>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Baby className="w-6 h-6 text-pink-400" />
              Baby Development
            </h3>
            <div className="text-center mb-6">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-6xl mb-2"
              >
                🍌
              </motion.div>
              <p className="text-2xl font-bold text-white">{data.babySize}</p>
              <p className="text-white/60">{data.babyWeight}</p>
            </div>

            <div className="space-y-3">
              {data.development.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl"
                >
                  <div className="w-2 h-2 bg-pink-400 rounded-full" />
                  <span className="text-white text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassmorphicCard>

        {/* Symptoms & Tips */}
        <GlassmorphicCard variant={variant}>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Activity className="w-6 h-6 text-yellow-400" />
                Common Symptoms
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.symptoms.map((symptom, i) => (
                  <Badge key={i} variant="warning" size="sm">{symptom}</Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-cyan-400" />
                Tips for You
              </h3>
              <ul className="space-y-2">
                {data.tips.map((tip, i) => (
                  <li key={i} className="flex items-start gap-2 text-white/80 text-sm">
                    <span className="text-cyan-400">✓</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Nutrition & Exercise */}
        <GlassmorphicCard variant={variant}>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Apple className="w-6 h-6 text-green-400" />
                Nutrition Focus
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {data.nutrition.map((item, i) => (
                  <div key={i} className="p-2 bg-green-500/10 rounded-lg text-center text-sm text-green-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-blue-400" />
                Safe Exercises
              </h3>
              <div className="flex flex-wrap gap-2">
                {data.exercise.map((ex, i) => (
                  <Badge key={i} variant="info" size="sm">{ex}</Badge>
                ))}
              </div>
            </div>
          </div>
        </GlassmorphicCard>

        {/* AI Advice */}
        <GlassmorphicCard variant="gradient">
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              AI Health Advisor
            </h3>
            <div className="p-4 bg-white/10 rounded-xl">
              <p className="text-white/90 leading-relaxed">{data.aiAdvice}</p>
            </div>
            <div className="mt-4 flex gap-3">
              <Button variant="neon" size="sm" leftIcon={Calendar}>
                Schedule Checkup
              </Button>
              <Button variant="glassmorphic" size="sm" leftIcon={Shield}>
                Emergency Tips
              </Button>
            </div>
          </div>
        </GlassmorphicCard>
      </div>
    </motion.div>
  );
};