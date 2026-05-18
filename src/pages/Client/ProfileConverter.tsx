// src/components/client/ProfileConverter.tsx
// COMPLETE PROFILE CONVERTER
// Patient → Client (Upgrade) | Client stays Client
// Blood Donation: Only for Client, NOT for Patient

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, ArrowRight, Sparkles, CheckCircle2,
  Shield, Clock, AlertCircle, ChevronRight,
  Droplets, Pill, Siren, Heart, Stethoscope,
  Lock, Unlock, Star, Zap
} from 'lucide-react';

interface ProfileConverterProps {
  currentType: 'patient' | 'client';
  onConvert: (type: string) => void;
}

const ProfileConverter: React.FC<ProfileConverterProps> = ({ currentType, onConvert }) => {
  const [showOptions, setShowOptions] = useState(false);
  const [selectedUpgrade, setSelectedUpgrade] = useState<string | null>(null);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionSuccess, setConversionSuccess] = useState(false);

  const upgradeOptions = [
    {
      id: 'client_patient',
      title: 'Client/Patient Profile',
      description: 'Full healthcare management with appointments, records & prescriptions',
      icon: Heart,
      color: 'from-cyan-500 to-blue-500',
      features: ['Doctor Appointments', 'Health Records', 'Prescriptions', 'Reports'],
      availableFor: 'all', // Both patient and client can have this
    },
    {
      id: 'blood_donor',
      title: 'Blood Donor Profile',
      description: 'Become a life-saving donor with tracking & notifications',
      icon: Droplets,
      color: 'from-red-500 to-rose-500',
      features: ['Donation History', 'Eligibility Tracking', 'Nearby Requests', 'Certificates'],
      availableFor: 'client', // ONLY client can access blood donation
      requiresClient: true,
    },
    {
      id: 'pharmacy_user',
      title: 'Pharmacy User',
      description: 'Access pharmacy services, order medicines & set reminders',
      icon: Pill,
      color: 'from-emerald-500 to-teal-500',
      features: ['Medicine Orders', 'Refill Reminders', 'Price Compare', 'Delivery'],
      availableFor: 'all',
    },
    {
      id: 'emergency_volunteer',
      title: 'Emergency Volunteer',
      description: 'Help in emergencies, donate blood, assist in crisis situations',
      icon: Siren,
      color: 'from-amber-500 to-orange-500',
      features: ['Emergency Alerts', 'Quick Response', 'Blood Donation', 'First Aid'],
      availableFor: 'client', // ONLY client
      requiresClient: true,
    },
  ];

  const handleConvert = async (upgradeId: string) => {
    const option = upgradeOptions.find(o => o.id === upgradeId);
    
    // If patient tries to access blood donor or emergency volunteer
    if (currentType === 'patient' && option?.requiresClient) {
      alert('⚠️ You need to upgrade to Client Profile first to access this feature!');
      return;
    }

    setIsConverting(true);
    setSelectedUpgrade(upgradeId);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // If patient is converting to client
    if (currentType === 'patient' && upgradeId === 'client_patient') {
      setConversionSuccess(true);
      setTimeout(() => {
        onConvert('client');
        setConversionSuccess(false);
      }, 1500);
    } else {
      onConvert(upgradeId);
    }
    
    setIsConverting(false);
    setShowOptions(false);
  };

  const isOptionLocked = (option: typeof upgradeOptions[0]) => {
    return currentType === 'patient' && option.requiresClient;
  };

  // ============================================
  // IF USER IS ALREADY A CLIENT
  // ============================================
  if (currentType === 'client') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20"
      >
        {/* Active Client Badge */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-lg">Client Profile Active</h3>
              <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 text-xs rounded-full">ACTIVE</span>
            </div>
            <p className="text-white/50 text-sm mt-0.5">Full access to all healthcare features unlocked</p>
          </div>
        </div>
        
        {/* Available Upgrades */}
        <p className="text-white/60 text-xs font-medium mb-3 uppercase tracking-wider">Available Profile Upgrades</p>
        <div className="grid grid-cols-1 gap-3">
          {upgradeOptions.map((option) => {
            const Icon = option.icon;
            const isBloodDonor = option.id === 'blood_donor';
            
            return (
              <motion.button
                key={option.id}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleConvert(option.id)}
                className={`w-full p-4 rounded-xl border transition-all text-left ${
                  isBloodDonor
                    ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40 hover:bg-red-500/10'
                    : 'bg-white/[0.02] border-white/[0.04] hover:border-white/[0.1]'
                } group`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-white font-medium text-sm">{option.title}</h4>
                      {isBloodDonor && (
                        <span className="px-2 py-0.5 bg-red-500/20 text-red-300 text-[10px] rounded-full flex items-center gap-1">
                          <Droplets className="w-3 h-3" /> Donor
                        </span>
                      )}
                    </div>
                    <p className="text-white/40 text-xs mt-0.5">{option.description}</p>
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {option.features.map((feature, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.03] text-white/30 text-[10px] border border-white/[0.04]">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isBloodDonor && (
                      <span className="text-[10px] text-green-400 flex items-center gap-1">
                        <Unlock className="w-3 h-3" /> Available
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-white/50 transition-colors" />
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  // ============================================
  // IF USER IS A PATIENT (Can upgrade to Client)
  // ============================================
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20"
    >
      {/* Patient Status */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
          <AlertCircle className="w-7 h-7 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-white font-bold text-lg">Patient Profile</h3>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 text-xs rounded-full">LIMITED</span>
          </div>
          <p className="text-white/50 text-sm mt-0.5">Upgrade to Client for full access</p>
        </div>
      </div>

      {/* Conversion Success Animation */}
      <AnimatePresence>
        {conversionSuccess && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-4 p-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-center"
          >
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            <p className="text-emerald-300 font-semibold">Upgrade Successful! 🎉</p>
            <p className="text-emerald-400/70 text-sm">You now have full Client access!</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!showOptions ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Locked Features Info */}
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <p className="text-red-300 text-xs flex items-center gap-2">
                <Lock className="w-3 h-3" />
                Blood Donation & Emergency features are locked for Patient profiles
              </p>
            </div>

            {/* Upgrade Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowOptions(true)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Upgrade to Client Profile
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <p className="text-white/30 text-[10px] text-center mt-3">
              Unlock: Blood Donation • Emergency Access • Full Features
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <p className="text-white/60 text-sm text-center">
              Choose your upgrade path:
            </p>
            
            {upgradeOptions.map((option) => {
              const Icon = option.icon;
              const isLocked = isOptionLocked(option);
              
              return (
                <motion.button
                  key={option.id}
                  whileHover={!isLocked ? { scale: 1.02 } : {}}
                  whileTap={!isLocked ? { scale: 0.98 } : {}}
                  onClick={() => handleConvert(option.id)}
                  disabled={isConverting}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    isLocked
                      ? 'bg-white/[0.01] border-white/[0.02] opacity-50 cursor-not-allowed'
                      : selectedUpgrade === option.id && isConverting
                      ? 'bg-cyan-500/10 border-cyan-500/30'
                      : 'bg-white/[0.02] border-white/[0.04] hover:border-white/[0.1]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center ${isLocked ? 'opacity-50' : ''}`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="text-white font-medium text-sm">{option.title}</h4>
                        {isLocked && (
                          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500/20 text-red-400 text-[10px] rounded-full">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        )}
                        {!isLocked && option.id === 'client_patient' && (
                          <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-[10px] rounded-full">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-white/40 text-xs mt-0.5">{option.description}</p>
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {option.features.map((feature, i) => (
                          <span key={i} className={`px-2 py-0.5 rounded-md text-[10px] border ${
                            isLocked 
                              ? 'bg-white/[0.01] text-white/15 border-white/[0.02]' 
                              : 'bg-white/[0.03] text-white/30 border-white/[0.04]'
                          }`}>
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isConverting && selectedUpgrade === option.id ? (
                      <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    ) : isLocked ? (
                      <Lock className="w-5 h-5 text-white/10" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-white/20" />
                    )}
                  </div>
                </motion.button>
              );
            })}

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
};

export default ProfileConverter;