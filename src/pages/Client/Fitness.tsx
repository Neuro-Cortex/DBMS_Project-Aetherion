// src/pages/Client/Fitness.tsx
import React from 'react';
import { Dumbbell, Heart, Activity, Flame, Target, Trophy, Zap, TrendingUp } from 'lucide-react';

const Fitness: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Dumbbell className="w-8 h-8 text-blue-400" />
            Fitness & Exercise
          </h1>
          <p className="text-slate-400 mt-2">Track your workouts, set goals, stay fit.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Heart, title: 'Workout Tracker', desc: 'Log your daily exercises', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
            { icon: Activity, title: 'Step Counter', desc: 'Track your daily steps', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
            { icon: Flame, title: 'Calories Burned', desc: 'Monitor calories burned', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
            { icon: Target, title: 'Goals', desc: 'Set fitness milestones', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
            { icon: Trophy, title: 'Achievements', desc: 'Unlock fitness badges', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
            { icon: Zap, title: 'HIIT Workouts', desc: 'High intensity training', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
            { icon: TrendingUp, title: 'Progress', desc: 'Track your fitness journey', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
            { icon: Dumbbell, title: 'Exercise Library', desc: 'Browse workout routines', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className={'p-6 rounded-2xl border ' + item.color + ' backdrop-blur-sm hover:scale-[1.02] transition-all cursor-pointer'}>
                <Icon className="w-10 h-10 mb-4" />
                <h3 className="text-white font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Fitness;