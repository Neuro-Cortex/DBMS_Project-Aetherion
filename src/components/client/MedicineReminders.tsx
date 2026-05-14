// src/components/client/MedicineReminders.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pill, Clock, Bell, CheckCircle2, AlertCircle } from 'lucide-react';
import { MedicineReminder } from '../../types/client';

interface MedicineRemindersProps {
  reminders: MedicineReminder[];
  onToggle: (id: string) => void;
}

const MedicineReminders: React.FC<MedicineRemindersProps> = ({ reminders, onToggle }) => {
  const activeReminders = reminders.filter(r => r.isActive);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          Medicine Reminders
        </h3>
        <span className="text-white/30 text-sm">{activeReminders.length} active</span>
      </div>

      {reminders.length === 0 ? (
        <div className="text-center py-6 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <Pill className="w-8 h-8 text-white/10 mx-auto mb-2" />
          <p className="text-white/30 text-sm">No medicine reminders</p>
        </div>
      ) : (
        <AnimatePresence>
          {reminders.map((reminder, index) => (
            <motion.div
              key={reminder.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.05 }}
              className={`p-4 rounded-xl border transition-all ${
                reminder.isActive
                  ? 'bg-amber-500/5 border-amber-500/10'
                  : 'bg-white/[0.02] border-white/[0.04] opacity-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    reminder.isActive ? 'bg-amber-500/20' : 'bg-white/[0.05]'
                  }`}>
                    <Pill className={`w-5 h-5 ${reminder.isActive ? 'text-amber-400' : 'text-white/20'}`} />
                  </div>
                  <div>
                    <h4 className="text-white font-medium text-sm">{reminder.medicineName}</h4>
                    <p className="text-white/40 text-xs">{reminder.dosage} - {reminder.frequency}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {reminder.times.map((time, i) => (
                        <span key={i} className="text-amber-400 text-[10px] flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {time}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => onToggle(reminder.id)}
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                    reminder.isActive
                      ? 'bg-amber-500/20 text-amber-400'
                      : 'bg-white/[0.05] text-white/20'
                  }`}
                >
                  {reminder.isActive ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <AlertCircle className="w-5 h-5" />
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};

export default MedicineReminders;