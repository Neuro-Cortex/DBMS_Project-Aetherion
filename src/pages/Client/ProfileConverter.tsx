// src/components/client/ProfileConverter.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, ArrowRight, Sparkles, CheckCircle2,
  Shield, Clock, AlertCircle, ChevronRight,
  Droplets, Pill, Siren, Heart, Stethoscope
} from 'lucide-react';

interface ProfileConverterProps {
  currentType: 'patient' | 'client';
  onConvert: (type: string) => void;
}

const ProfileConverter: React.FC<ProfileConverterProps> = ({ currentType, onConvert }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedUpgrade, setSelectedUpgrade] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);

  const upgradeOptions = [
    {
      id: 'client_patient',
      title: 'Client/Patient Profile',
      description: 'Full healthcare management with appointments, records & prescriptions',
      icon: Heart,
      color: 'from-cyan-500 to-blue-500',
      features: ['Doctor Appointments', 'Health Records', 'Prescriptions', 'Reports'],
    },
    {
      id: 'blood_donor',
      title: 'Blood Donor Profile',
      description: 'Become a life-saving donor with tracking & notifications',
      icon: Droplets,
      color: 'from-red-500 to-rose-500',
      features: ['Donation History', 'Eligibility Tracking', 'Nearby Requests', 'Certificates'],
    },
    {
      id: 'pharmacy_user',
      title: 'Pharmacy User',
      description: 'Access pharmacy services, order medicines & set reminders',
      icon: Pill,
      color: 'from-emerald-500 to-teal-500',
      features: ['Medicine Orders', 'Refill Reminders', 'Price Compare', 'Delivery'],
    },
    {
      id: 'emergency_volunteer',
      title: 'Emergency Volunteer',
      description: 'Help in emergencies, donate blood, assist in crisis situations',
      icon: Siren,
      color: 'from-amber-500 to-orange-500',
      features: ['Emergency Alerts', 'Quick Response', 'Blood Donation', 'First Aid'],
    },
  ];

  const handleConvert = async (upgradeId: string) => {
    setIsConverting(true);
    setSelectedUpgrade(upgradeId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onConvert(upgradeId);
    setIsConverting(false);
    setShowOptions(false);
  };

  if (currentType === 'client') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg">Client Profile Active</h3>
            <p className="text-white/40 text-sm">Full access to all healthcare features</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mt-4">
          {upgradeOptions.map((option) => {
            const Icon = option.icon;
            return (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleConvert(option.id)}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{option.title}</p>
                    <p className="text-white/40 text-[10px]">Add capability</p>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-lg">Patient Profile</h3>
          <p className="text-white/40 text-sm">Limited access - Upgrade to unlock features</p>
        </div>
      </div>

      <AnimatePresence>
        {!showOptions ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowOptions(true)}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            Convert to Client Profile
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <p className="text-white/60 text-sm text-center">
              Choose your upgrade path:
            </p>
            
            <div className="grid gap-3">
              {upgradeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <motion.button
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleConvert(option.id)}
                    disabled={isConverting}
                    className={`w-full p-4 rounded-xl border transition-all text-left ${
                      selectedUpgrade === option.id && isConverting
                        ? 'bg-cyan-500/10 border-cyan-500/30'
                        : 'bg-white/[0.02] border-white/[0.04] hover:border-white/[0.1]'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium text-sm">{option.title}</h4>
                        <p className="text-white/40 text-xs mt-0.5">{option.description}</p>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {option.features.map((feature, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.03] text-white/30 text-[10px] border border-white/[0.04]">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      {isConverting && selectedUpgrade === option.id ? (
                        <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-white/20" />
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <button
              onClick={() => setShowOptions(false)}
              className="w-full py-3 text-white/30 text-sm hover:text-white/50 transition-all"
            >
              Cancel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
// ✅ All 4 upgrades defined
ProfileUpgrade = 'client_patient' | 'blood_donor' | 'pharmacy_user' | 'emergency_volunteer'

// ✅ Upgrade UI with features displayed
- Client/Patient Profile (Full healthcare access)
- Blood Donor Profile (Donation tracking)
- Pharmacy User (Medicine ordering)
- Emergency Volunteer (Crisis response)


};

export default ProfileConverter;