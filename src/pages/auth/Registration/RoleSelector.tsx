// src/components/Registration/RoleSelector.tsx
import React from 'react';
import { motion } from 'framer-motion';
import {
  User, Stethoscope, Building2, Droplets, Pill,
  Shield, ChevronRight, Sparkles, CheckCircle2
} from 'lucide-react';
import { AccountRole } from '../../types/auth';

interface RoleSelectorProps {
  selectedRole: AccountRole | null;
  onSelectRole: (role: AccountRole) => void;
  onContinue: () => void;
}

interface RoleOption {
  id: AccountRole;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  gradient: string;
  badge?: string;
  availableUpgrades?: string[];
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ selectedRole, onSelectRole, onContinue }) => {
  const roles: RoleOption[] = [
    {
      id: 'normal_user',
      title: 'Normal User / Client',
      description: 'Create a basic account that can be upgraded later to patient, donor, or pharmacy user',
      icon: User,
      color: 'from-blue-500 to-cyan-500',
      gradient: 'from-blue-500/20 to-cyan-500/20',
      badge: 'Flexible',
      availableUpgrades: ['Client/Patient', 'Blood Donor', 'Pharmacy User', 'Emergency Volunteer'],
    },
    {
      id: 'doctor',
      title: 'Doctor',
      description: 'Join as a medical professional to provide consultations and manage patients',
      icon: Stethoscope,
      color: 'from-emerald-500 to-teal-500',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      badge: 'Professional',
    },
    {
      id: 'hospital_authority',
      title: 'Hospital Authority',
      description: 'Register your hospital to manage beds, emergency services, and staff',
      icon: Building2,
      color: 'from-purple-500 to-violet-500',
      gradient: 'from-purple-500/20 to-violet-500/20',
      badge: 'Institution',
    },
    {
      id: 'blood_donor',
      title: 'Blood Donor',
      description: 'Register as a donor to help save lives through blood donation',
      icon: Droplets,
      color: 'from-red-500 to-rose-500',
      gradient: 'from-red-500/20 to-rose-500/20',
      badge: 'Lifesaver',
    },
    {
      id: 'pharmacy',
      title: 'Pharmacy',
      description: 'List your pharmacy to sell medicines and provide delivery services',
      icon: Pill,
      color: 'from-amber-500 to-orange-500',
      gradient: 'from-amber-500/20 to-orange-500/20',
      badge: 'Business',
    },
    {
      id: 'admin_applicant',
      title: 'Apply for Admin Access',
      description: 'Request administrative privileges to manage the platform',
      icon: Shield,
      color: 'from-slate-500 to-gray-500',
      gradient: 'from-slate-500/20 to-gray-500/20',
      badge: 'Advanced',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-white/40 text-xs font-medium mb-4"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          Choose Account Type
        </motion.div>
        <h2 className="text-3xl font-bold text-white mb-2">Select Your Role</h2>
        <p className="text-white/40 text-sm">You can add more roles after registration</p>
      </div>

      <div className="grid gap-3">
        {roles.map((role, index) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <motion.button
              key={role.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectRole(role.id)}
              className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden group ${
                isSelected
                  ? 'border-cyan-400/50 bg-cyan-500/[0.08] shadow-lg shadow-cyan-500/10'
                  : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1]'
              }`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-r ${role.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? 'opacity-100' : ''}`} />

              <div className="relative z-10 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-sm">{role.title}</h3>
                    {role.badge && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        role.badge === 'Flexible' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        role.badge === 'Professional' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        role.badge === 'Lifesaver' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                        role.badge === 'Business' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        role.badge === 'Institution' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        'bg-slate-500/20 text-slate-400 border border-slate-500/30'
                      }`}>
                        {role.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-white/35 text-xs leading-relaxed">{role.description}</p>
                  
                  {role.availableUpgrades && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {role.availableUpgrades.map((upgrade, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] text-white/25 text-[10px]">
                          {upgrade}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-400'
                    : 'border-white/[0.1] group-hover:border-white/[0.2]'
                }`}>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Continue Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: selectedRole ? 1 : 0.5 }}
        whileHover={{ scale: selectedRole ? 1.02 : 1 }}
        whileTap={{ scale: selectedRole ? 0.98 : 1 }}
        onClick={onContinue}
        disabled={!selectedRole}
        className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
          selectedRole
            ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 cursor-pointer'
            : 'bg-white/[0.03] text-white/20 cursor-not-allowed'
        }`}
      >
        {selectedRole ? (
          <>
            Continue with Registration
            <ChevronRight className="w-5 h-5" />
          </>
        ) : (
          'Select a role to continue'
        )}
      </motion.button>
    </div>
  );
};



// ✅ All 6 types defined
/*
AccountRole = 'normal_user' | 'doctor' | 'hospital_authority' | 'blood_donor' | 'pharmacy' | 'admin_applicant'

// ✅ All displayed with icons, badges, and descriptions
- Normal User / Client (Flexible badge)
- Doctor (Professional badge)
- Hospital Authority (Institution badge)
- Blood Donor (Lifesaver badge)
- Pharmacy (Business badge)
- Apply for Admin Access (Advanced badge)
*/

export default RoleSelector;
