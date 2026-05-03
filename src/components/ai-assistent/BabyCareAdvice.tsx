import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Baby,
  Moon,
  Utensils,
  Heart,
  Activity,
  CheckCircle,
  Clock,
  Sparkles,
  Star,
  Smile,
  AlertCircle,
  Droplet,
  Shield
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface BabyCareAdviceProps {
  babyAgeMonths?: number;
  variant?: 'glass' | 'gradient' | 'neon';
  className?: string;
}

interface MonthData {
  month: number;
  milestones: string[];
  feeding: string;
  sleep: string;
  tips: string[];
  vaccines: string[];
  aiTip: string;
}

// ============================================
// MOCK DATA
// ============================================
const monthDataMap: Record<number, MonthData> = {
  1: {
    month: 1,
    milestones: ['Responds to sounds', 'Focuses on faces', 'Moves head side to side'],
    feeding: 'Breast milk or formula every 2-3 hours (8-12 times/day)',
    sleep: '16-18 hours/day (short intervals)',
    tips: ['Tummy time for 1-2 minutes', 'Keep baby warm and clean', 'Talk and sing to your baby'],
    vaccines: ['Hepatitis B (2nd dose)'],
    aiTip: 'Your 1-month-old is adjusting to the world! Focus on bonding through skin-to-skin contact. Don\'t worry about strict schedules yet—feed on demand and let baby sleep when tired.',
  },
  6: {
    month: 6,
    milestones: ['Sits with support', 'Babbles', 'Reaches for objects', 'Rolls over'],
    feeding: 'Continue breast milk/formula + introduce pureed solids (1-2 times/day)',
    sleep: '12-15 hours/day (may start sleeping longer at night)',
    tips: ['Introduce one new food at a time', 'Use a high chair for feeding', 'Encourage sitting with support', 'Provide colorful toys'],
    vaccines: ['DTaP (3rd dose)', 'PCV13 (3rd dose)', 'RV (3rd dose)'],
    aiTip: '6 months is an exciting time! Your baby is becoming more interactive. Start solid foods slowly—iron-fortified cereals and pureed veggies are great first foods. Watch for allergic reactions.',
  },
  12: {
    month: 12,
    milestones: ['First steps possible', 'Says "mama" or "dada"', 'Waves bye-bye', 'Claps hands'],
    feeding: 'Transition to whole milk + 3 meals + 2 snacks. Avoid choking hazards.',
    sleep: '12-14 hours/day (including 1-2 naps)',
    tips: ['Baby-proof the house', 'Encourage walking with support', 'Read board books together', 'Use a sippy cup'],
    vaccines: ['MMR (1st dose)', 'Varicella (1st dose)', 'Hepatitis A (1st dose)'],
    aiTip: 'Happy first birthday! 🎉 Your baby is becoming a toddler. Encourage exploration in a safe environment. Transition from bottles to cups and celebrate every tiny achievement!',
  },
};

// ============================================
// BABY CARE ADVICE COMPONENT
// ============================================
export const BabyCareAdvice: React.FC<BabyCareAdviceProps> = ({
  babyAgeMonths = 6,
  variant = 'glass',
  className,
}) => {
  const [activeMonth, setActiveMonth] = useState(babyAgeMonths);
  const [checkedMilestones, setCheckedMilestones] = useState<string[]>([]);
  const data = monthDataMap[activeMonth] || monthDataMap[6];

  const toggleMilestone = (milestone: string) => {
    setCheckedMilestones(prev =>
      prev.includes(milestone) ? prev.filter(m => m !== milestone) : [...prev, milestone]
    );
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
        <div className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="p-4 rounded-2xl bg-pink-500/10"
            >
              <Baby className="w-12 h-12 text-pink-400" />
            </motion.div>
            <div>
              <h2 className="text-3xl font-black text-white">{activeMonth} Month Old</h2>
              <p className="text-white/60">Baby Care Guide & Milestones</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-white/60">Age:</label>
            <select
              value={activeMonth}
              onChange={(e) => {
                setActiveMonth(Number(e.target.value));
                setCheckedMilestones([]);
              }}
              className="px-4 py-2 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                <option key={m} value={m}>{m} Month{m > 1 ? 's' : ''}</option>
              ))}
            </select>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Milestones */}
        <GlassmorphicCard variant={variant}>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-400" />
              Developmental Milestones
            </h3>
            <div className="space-y-3">
              {data.milestones.map((milestone, i) => {
                const isChecked = checkedMilestones.includes(milestone);
                return (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => toggleMilestone(milestone)}
                    className={clsx(
                      'w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left',
                      isChecked ? 'bg-green-500/10 border border-green-500/30' : 'bg-white/5 border border-white/10'
                    )}
                  >
                    <motion.div
                      animate={isChecked ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <CheckCircle className={clsx('w-5 h-5', isChecked ? 'text-green-400' : 'text-white/30')} />
                    </motion.div>
                    <span className={clsx('text-sm', isChecked ? 'text-green-300 line-through' : 'text-white/80')}>
                      {milestone}
                    </span>
                  </motion.button>
                );
              })}
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-white/60">
                {checkedMilestones.length}/{data.milestones.length} achieved
              </p>
              <div className="w-full h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
                  animate={{ width: `${(checkedMilestones.length / data.milestones.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Feeding & Sleep */}
        <GlassmorphicCard variant={variant}>
          <div className="p-6 space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Utensils className="w-6 h-6 text-orange-400" />
                Feeding Guide
              </h3>
              <div className="p-4 bg-orange-500/10 rounded-xl border border-orange-500/20">
                <p className="text-white/80 text-sm">{data.feeding}</p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                <Moon className="w-6 h-6 text-blue-400" />
                Sleep Pattern
              </h3>
              <div className="p-4 bg-blue-500/10 rounded-xl border border-blue-500/20">
                <p className="text-white/80 text-sm">{data.sleep}</p>
              </div>
            </div>
          </div>
        </GlassmorphicCard>

        {/* Vaccines */}
        <GlassmorphicCard variant={variant}>
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-cyan-400" />
              Vaccinations Due
            </h3>
            <div className="space-y-3">
              {data.vaccines.map((vaccine, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20"
                >
                  <div className="flex items-center gap-2">
                    <Droplet className="w-4 h-4 text-cyan-400" />
                    <span className="text-white text-sm">{vaccine}</span>
                  </div>
                  <Button variant="neon" size="xs">Schedule</Button>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassmorphicCard>

        {/* AI Tip */}
        <GlassmorphicCard variant="gradient">
          <div className="p-6">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-400" />
              AI Parenting Tip
            </h3>
            <div className="p-4 bg-white/10 rounded-xl mb-4">
              <p className="text-white/90 leading-relaxed text-sm">{data.aiTip}</p>
            </div>

            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <Heart className="w-5 h-5 text-pink-400" />
              Quick Tips
            </h4>
            <ul className="space-y-2">
              {data.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-white/80">
                  <Smile className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  {tip}
                </li>
              ))}
            </ul>

            <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-yellow-300">
                  Always consult your pediatrician for personalized advice. Every baby is unique!
                </p>
              </div>
            </div>
          </div>
        </GlassmorphicCard>
      </div>
    </motion.div>
  );
};