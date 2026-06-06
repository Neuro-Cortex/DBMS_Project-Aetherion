// src/components/common/PlaceholderPage.tsx
import React from 'react';
import { Brain, Cpu } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
    <Brain className="w-20 h-20 text-purple-400/40 mb-6 animate-pulse" />
    <h2 className="text-3xl font-black text-white mb-3">{title}</h2>
    <p className="text-slate-400 max-w-md mb-4">
      This section is under development. The AI is learning new capabilities every day.
    </p>
    <div className="flex items-center gap-2 text-cyan-400 text-sm">
      <Cpu className="w-4 h-4 animate-spin" />
      <span>Neural pathways expanding...</span>
    </div>
  </div>
);

export default PlaceholderPage;