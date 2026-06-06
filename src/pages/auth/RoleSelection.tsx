// src/pages/auth/RoleSelection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  User, Stethoscope, Shield, Sparkles,
  ChevronRight, Heart, ArrowRight, Star
} from 'lucide-react';

const RoleSelection: React.FC = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'client',
      title: 'Client / Patient',
      subtitle: 'Healthcare Access Portal',
      description: 'Register as a client to access healthcare services. You can upgrade to a full Patient profile anytime for complete medical features.',
      icon: User,
      color: 'from-cyan-500 to-blue-500',
      badge: 'Most Common',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      path: '/register/client',
      features: [
        'Book Doctor Appointments',
        'View Health Records',
        'Manage Prescriptions',
        'Blood Donation Access',
        'Upgrade to Patient Profile',
        'Emergency Services',
      ],
      note: 'Starts as Client → Can upgrade to Patient later',
    },
    {
      id: 'doctor',
      title: 'Doctor / Physician',
      subtitle: 'Medical Professional Portal',
      description: 'Join as a verified medical professional to manage patients, conduct consultations, and grow your practice.',
      icon: Stethoscope,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Professional',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      path: '/register/doctor',
      features: [
        'Patient Management Dashboard',
        'Video Consultations',
        'E-Prescription System',
        'Earnings Analytics',
        'Schedule Management',
        'Professional Profile',
      ],
      note: 'Requires medical license verification',
    },
    {
      id: 'admin',
      title: 'Admin / Authority',
      subtitle: 'Platform Management Portal',
      description: 'Apply for administrative access to manage the platform, verify doctors, oversee hospitals, and control operations.',
      icon: Shield,
      color: 'from-purple-500 to-violet-500',
      badge: 'Restricted',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      path: '/register/admin',
      features: [
        'User Management System',
        'Doctor Verification',
        'Hospital Oversight',
        'Platform Analytics',
        'Emergency Control',
        'System Settings',
      ],
      note: 'Requires approval from existing admins',
    },
  ];

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050508] via-[#08080d] to-[#050508]" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
        backgroundSize: '50px 50px',
      }} />
      
      {/* Animated Orbs */}
      <motion.div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-cyan-500/[0.04] blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 10, repeat: Infinity }}
      />
      <motion.div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-purple-500/[0.04] blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 8, repeat: Infinity, delay: 3 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-500/[0.03] blur-3xl"
        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 12, repeat: Infinity, delay: 5 }}
      />

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          {/* Animated Logo */}
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="inline-flex items-center justify-center w-24 h-24 mb-8 perspective-1000"
          >
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-[2rem] shadow-2xl shadow-indigo-500/20 flex items-center justify-center">
              <Heart className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 tracking-[-0.03em]">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Aetherion Health
            </span>
          </h1>
          <p className="text-white/40 text-xl max-w-2xl mx-auto">
            Choose your account type to get started. All clients start with basic access and can upgrade anytime.
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group cursor-pointer"
                onClick={() => navigate(role.path)}
              >
                {/* Card */}
                <div className="relative p-8 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/[0.06] hover:border-white/[0.15] transition-all duration-500 overflow-hidden h-full">
                  {/* Hover Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${role.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                  
                  {/* Badge */}
                  <div className="absolute top-6 right-6">
                    <span className={`px-3 py-1.5 rounded-full text-[11px] font-bold ${role.badgeColor}`}>
                      {role.badge}
                    </span>
                  </div>

                  <div className="relative z-10">
                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${role.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <Icon className="w-10 h-10 text-white" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-2xl font-bold text-white mb-1">{role.title}</h3>
                    <p className={`text-sm font-medium bg-gradient-to-r ${role.color} bg-clip-text text-transparent mb-4`}>
                      {role.subtitle}
                    </p>
                    <p className="text-white/40 text-sm leading-relaxed mb-6">
                      {role.description}
                    </p>

                    {/* Features */}
                    <div className="space-y-2.5 mb-8">
                      {role.features.map((feature, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + i * 0.1 }}
                          className="flex items-center gap-3 text-white/50 text-sm"
                        >
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${role.color}`} />
                          {feature}
                        </motion.div>
                      ))}
                    </div>

                    {/* Note */}
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${role.color.replace('500', '500/5')} border border-white/[0.04] mb-6`}>
                      <p className="text-white/30 text-xs text-center">{role.note}</p>
                    </div>

                    {/* Action Button */}
                    <motion.div
                      whileHover={{ x: 5 }}
                      className={`flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r ${role.color} text-white font-semibold text-sm group-hover:shadow-lg transition-all duration-300`}
                    >
                      {role.id === 'client' ? 'Register as Client' : role.id === 'doctor' ? 'Join as Doctor' : 'Apply for Access'}
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-12 space-y-3"
        >
          <p className="text-white/25 text-sm">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
            >
              Sign In to Your Account
            </button>
          </p>
          <div className="flex items-center justify-center gap-4 text-white/15 text-xs">
            <span className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5" /> HIPAA Compliant
            </span>
            <span>•</span>
            <span>256-bit Encrypted</span>
            <span>•</span>
            <span>Secure Platform</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RoleSelection;