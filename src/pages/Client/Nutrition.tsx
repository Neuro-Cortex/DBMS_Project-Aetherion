// src/pages/Client/Nutrition.tsx
import React from 'react';
import { Apple, Utensils, Droplets, Coffee, Heart, Activity, Clipboard, TrendingUp } from 'lucide-react';

const Nutrition: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-emerald-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Apple className="w-8 h-8 text-emerald-400" />
            Nutrition & Diet
          </h1>
          <p className="text-slate-400 mt-2">Track your nutrition, manage your diet, eat healthy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Utensils, title: 'Meal Planner', desc: 'Plan your daily meals', color: 'emerald' },
            { icon: Droplets, title: 'Water Intake', desc: 'Track daily water consumption', color: 'cyan' },
            { icon: Coffee, title: 'Calorie Counter', desc: 'Log your calorie intake', color: 'amber' },
            { icon: Heart, title: 'Heart Health', desc: 'Heart-healthy meal suggestions', color: 'rose' },
            { icon: Activity, title: 'Macros Tracker', desc: 'Track proteins, carbs & fats', color: 'blue' },
            { icon: Clipboard, title: 'Diet Plans', desc: 'Personalized diet plans', color: 'purple' },
            { icon: TrendingUp, title: 'Progress', desc: 'Track your nutrition goals', color: 'teal' },
            { icon: Apple, title: 'Healthy Recipes', desc: 'Browse healthy recipes', color: 'green' },
          ].map((item, i) => {
            const Icon = item.icon;
            const colorMap: Record<string, string> = {
              emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
              cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
              amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
              rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
              blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
              purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
              teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20',
              green: 'bg-green-500/10 text-green-400 border-green-500/20',
            };
            return (
              <div key={i} className={'p-6 rounded-2xl border ' + (colorMap[item.color] || colorMap.emerald) + ' backdrop-blur-sm hover:scale-[1.02] transition-all cursor-pointer'}>
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

export default Nutrition;