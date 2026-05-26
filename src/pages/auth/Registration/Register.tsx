// src/pages/Register.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '@/store/slices/authSlice';
import toast from 'react-hot-toast';
import { Sparkles, Shield, Pause, Play, Volume2, VolumeX } from 'lucide-react';
import { AccountRole } from '@/types/auth';
import RoleSelector from './RoleSelector';
import RegistrationForm from './RegistratinForm';

const Register: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<AccountRole | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRoleSelect = (role: AccountRole) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      setShowForm(true);
    }
  };

  const handleBack = () => {
    setShowForm(false);
  };

  const handleSubmit = async (data: any) => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create user profile based on role
      const userProfile = {
        id: Date.now().toString(),
        email: data.email,
        fullName: data.fullName,
        gender: data.gender,
        primaryRole: selectedRole!,
        roles: [selectedRole!],
        upgrades: [],
        isAdminApproved: selectedRole === 'admin_applicant' ? false : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...(selectedRole === 'doctor' && {
          specialization: data.specialization,
          licenseNumber: data.licenseNumber,
          experience: parseInt(data.experience),
          qualifications: data.qualifications?.split(','),
          consultationFee: parseFloat(data.consultationFee),
        }),
        ...(selectedRole === 'hospital_authority' && {
          hospitalName: data.hospitalName,
          registrationNumber: data.registrationNumber,
          bedCapacity: parseInt(data.bedCapacity),
          icuCapacity: parseInt(data.icuCapacity),
          emergencyServices: data.emergencyServices,
        }),
        ...(selectedRole === 'blood_donor' && {
          bloodGroup: data.bloodGroup,
          lastDonationDate: data.lastDonationDate,
          donationCount: 0,
          isAvailable: true,
        }),
        ...(selectedRole === 'pharmacy' && {
          pharmacyName: data.pharmacyName,
          licenseNumber: data.licenseNumber,
          deliveryAvailable: data.deliveryAvailable,
        }),
      };

      dispatch(login(userProfile));
      
      toast.success('Account created successfully! Welcome aboard! 🎉', {
        style: {
          borderRadius: '12px',
          background: '#1a1a2e',
          color: '#fff',
          border: '1px solid rgba(6, 182, 212, 0.3)',
        },
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 1000);
    } catch (error) {
      toast.error('Registration failed. Please try again.', {
        style: {
          borderRadius: '12px',
          background: '#1a1a2e',
          color: '#fff',
          border: '1px solid rgba(239, 68, 68, 0.3)',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/medical-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-[#050508]/95 via-[#050508]/85 to-[#050508]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
        
        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '60px 60px',
          }}
        />

        {/* Glow orbs */}
        <motion.div
          className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.06] blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-purple-500/[0.06] blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
        />
      </div>

      {/* Video Controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button onClick={togglePlay} className="p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={toggleMute} className="p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all">
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#8b5cf6' : '#ec4899',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: `0 0 ${4 + Math.random() * 6}px currentColor`,
            }}
            animate={{
              y: [0, -80 - Math.random() * 40, 0],
              opacity: [0, 0.7, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 6,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        {!showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              className="inline-flex items-center justify-center w-16 h-16 mb-4"
            >
              <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-2xl shadow-2xl shadow-indigo-500/30 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold text-white">Create Account</h1>
          </motion.div>
        )}

        {/* Card Container */}
        <motion.div
          layout
          className="relative p-8 rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/20 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] via-transparent to-purple-500/[0.02] pointer-events-none" />
          
          <div className="relative z-10">
            <AnimatePresence mode="wait">
              {!showForm ? (
                <motion.div
                  key="role-selector"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <RoleSelector
                    selectedRole={selectedRole}
                    onSelectRole={handleRoleSelect}
                    onContinue={handleContinue}
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="registration-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <RegistrationForm
                    selectedRole={selectedRole!}
                    onBack={handleBack}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.04]">
            <Shield className="w-3.5 h-3.5 text-emerald-400/60" />
            <span className="text-white/15 text-[11px] font-medium tracking-wider">
              HIPAA Compliant • Secure Registration
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;