// src/components/client/HealthTimeline.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  Stethoscope, FileText, Syringe, Activity,
  Pill, Droplets, Heart, Calendar
} from 'lucide-react';
import { HealthTimelineEvent } from '../../types/client';

interface HealthTimelineProps {
  events: HealthTimelineEvent[];
}

const iconMap: Record<string, React.ElementType> = {
  appointment: Stethoscope,
  report: FileText,
  vaccine: Syringe,
  surgery: Activity,
  medication: Pill,
  donation: Droplets,
};

const HealthTimeline: React.FC<HealthTimelineProps> = ({ events }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-white font-semibold text-lg flex items-center gap-2">
        <Activity className="w-5 h-5 text-purple-400" />
        Health Activity Timeline
      </h3>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-cyan-500/50 via-purple-500/30 to-transparent" />

        <div className="space-y-4">
          {events.map((event, index) => {
            const Icon = iconMap[event.type] || Calendar;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 ml-2"
              >
                {/* Timeline dot */}
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-1`}
                  style={{ borderColor: event.color, backgroundColor: `${event.color}20` }}
                >
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: event.color }} />
                </div>

                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Icon className="w-4 h-4 text-white/40" />
                    <span className="text-white/30 text-xs">{event.date}</span>
                  </div>
                  <h4 className="text-white text-sm font-medium">{event.title}</h4>
                  <p className="text-white/40 text-xs mt-0.5">{event.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default HealthTimeline;