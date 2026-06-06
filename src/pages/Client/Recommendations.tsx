// src/pages/client/Recommendations.tsx
// SMART HEALTH RECOMMENDATIONS - SIDEBAR REMOVED
import React from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles, AlertTriangle,
  Clock, Pill, Apple, Brain,
  ThumbsUp,
} from 'lucide-react';

const recommendations = {
  recoveryTime: {
    condition: 'Post-surgery recovery',
    estimatedDays: 14,
    daysLeft: 7,
    progress: 50,
  },
  foods: {
    recommend: [
      { name: 'Leafy Green Vegetables', reason: 'Rich in iron and vitamins', icon: '🥬' },
      { name: 'Fatty Fish (Salmon)', reason: 'Omega-3 for heart health', icon: '🐟' },
      { name: 'Whole Grains', reason: 'Fiber for digestion', icon: '🌾' },
      { name: 'Fresh Fruits', reason: 'Antioxidants and vitamins', icon: '🍎' },
      { name: 'Lean Protein', reason: 'Muscle recovery', icon: '🍗' },
      { name: 'Nuts & Seeds', reason: 'Healthy fats and minerals', icon: '🥜' },
    ],
    avoid: [
      { name: 'Processed Foods', reason: 'High in sodium and preservatives', icon: '🍔' },
      { name: 'Sugary Drinks', reason: 'Empty calories, spikes blood sugar', icon: '🥤' },
      { name: 'Excessive Salt', reason: 'Increases blood pressure', icon: '🧂' },
      { name: 'Fried Foods', reason: 'Hard to digest, inflammatory', icon: '🍟' },
    ],
  },
  healthTips: [
    { title: 'Stay Hydrated', description: 'Drink at least 8 glasses of water daily', icon: '💧', priority: 'high' },
    { title: 'Regular Exercise', description: '30 minutes of walking, 5 days a week', icon: '🏃', priority: 'high' },
    { title: 'Adequate Sleep', description: 'Aim for 7-8 hours of quality sleep', icon: '😴', priority: 'medium' },
    { title: 'Stress Management', description: 'Practice meditation or deep breathing', icon: '🧘', priority: 'medium' },
    { title: 'Regular Checkups', description: 'Schedule quarterly health assessments', icon: '🏥', priority: 'low' },
  ],
};

const ClientRecommendations: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#020408] p-4 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-cyan-400" />
          Smart Health Recommendations
        </h1>
        <p className="text-slate-400 text-sm mt-1">AI-powered personalized health suggestions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recovery Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 p-6 rounded-2xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20"
        >
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Recovery Estimation
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-slate-400 text-sm">Condition</p>
              <p className="text-white font-bold mt-1">{recommendations.recoveryTime.condition}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Total Time</p>
              <p className="text-white font-bold mt-1">{recommendations.recoveryTime.estimatedDays} days</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Days Left</p>
              <p className="text-cyan-400 font-bold mt-1">{recommendations.recoveryTime.daysLeft} days</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Progress</p>
              <div className="mt-2 h-2 rounded-full bg-white/[0.05] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${recommendations.recoveryTime.progress}%` }}
                  className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
                />
              </div>
              <p className="text-emerald-400 text-sm mt-1">{recommendations.recoveryTime.progress}%</p>
            </div>
          </div>
        </motion.div>

        {/* Food Recommendations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recommended Foods */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
          >
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <Apple className="w-5 h-5 text-emerald-400" />
              Recommended Foods
              <span className="text-emerald-400 text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 ml-2">Eat More</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {recommendations.foods.recommend.map((food, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -4 }}
                  className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 hover:border-emerald-500/20 transition-all"
                >
                  <span className="text-3xl">{food.icon}</span>
                  <h4 className="text-white font-medium text-sm mt-2">{food.name}</h4>
                  <p className="text-slate-400 text-xs mt-1">{food.reason}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Foods to Avoid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/[0.02] border border-red-500/10"
          >
            <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              Foods to Avoid
              <span className="text-red-400 text-xs font-medium px-2 py-0.5 rounded-md bg-red-500/10 ml-2">Limit Intake</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {recommendations.foods.avoid.map((food, index) => (
                <motion.div
                  key={index}
                  whileHover={{ x: -4 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/10"
                >
                  <span className="text-2xl">{food.icon}</span>
                  <div>
                    <h4 className="text-white font-medium text-sm">{food.name}</h4>
                    <p className="text-red-400/60 text-xs">{food.reason}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Health Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
        >
          <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-400" />
            Health Tips
          </h3>
          <div className="space-y-3">
            {recommendations.healthTips.map((tip, index) => (
              <motion.div
                key={index}
                whileHover={{ x: 4 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-purple-500/20 transition-all"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-medium text-sm">{tip.title}</h4>
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-medium ${
                        tip.priority === 'high' 
                          ? 'bg-red-500/10 text-red-400'
                          : tip.priority === 'medium'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {tip.priority}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs mt-1">{tip.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Medicine Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
      >
        <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
          <Pill className="w-5 h-5 text-amber-400" />
          Today's Medicine Schedule
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { time: '08:00 AM', medicine: 'Amoxicillin 500mg', status: 'taken', instructions: 'After breakfast' },
            { time: '02:00 PM', medicine: 'Vitamin D3 1000 IU', status: 'upcoming', instructions: 'With water' },
            { time: '08:00 PM', medicine: 'Amoxicillin 500mg', status: 'upcoming', instructions: 'After dinner' },
            { time: '10:00 PM', medicine: 'Melatonin 5mg', status: 'upcoming', instructions: 'Before sleep' },
          ].map((med, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -4 }}
              className={`p-4 rounded-xl border transition-all ${
                med.status === 'taken'
                  ? 'bg-emerald-500/5 border-emerald-500/20'
                  : 'bg-amber-500/5 border-amber-500/10'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">{med.time}</span>
                {med.status === 'taken' ? (
                  <ThumbsUp className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Clock className="w-4 h-4 text-amber-400" />
                )}
              </div>
              <p className="text-white font-medium text-sm">{med.medicine}</p>
              <p className="text-slate-400 text-xs mt-1">{med.instructions}</p>
              {med.status === 'upcoming' && (
                <button className="mt-3 w-full py-2 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-all">
                  Take Now
                </button>
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ClientRecommendations;