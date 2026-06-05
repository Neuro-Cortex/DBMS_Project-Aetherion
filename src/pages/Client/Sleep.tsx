// src/pages/Client/Sleep.tsx
import React from 'react';
import { Moon, Clock, Activity, TrendingUp, AlertCircle, Bell, Sun, Star } from 'lucide-react';

const Sleep: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Moon className="w-8 h-8 text-indigo-400" />
            Sleep Tracker
          </h1>
          <p className="text-slate-400 mt-2">Monitor your sleep quality and improve your rest.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Clock, title: 'Sleep Schedule', desc: 'Set and track sleep hours', color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
            { icon: Activity, title: 'Sleep Quality', desc: 'Analyze your sleep patterns', color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
            { icon: TrendingUp, title: 'Sleep Trends', desc: 'Weekly & monthly sleep stats', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
            { icon: AlertCircle, title: 'Sleep Disorders', desc: 'Identify sleep issues', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
            { icon: Bell, title: 'Bedtime Reminder', desc: 'Set sleep reminders', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
            { icon: Sun, title: 'Wake-up Light', desc: 'Smart alarm features', color: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
            { icon: Star, title: 'Sleep Tips', desc: 'Improve your sleep hygiene', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
            { icon: Moon, title: 'Dream Journal', desc: 'Record your dreams', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
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

export default Sleep;