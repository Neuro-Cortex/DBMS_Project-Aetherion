// src/pages/auth/Register.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, MapPin,
  ArrowRight, Sparkles, Shield, AlertCircle,
  Heart, Stethoscope, ChevronLeft, CheckCircle2,
  Calendar, Droplets, Building2, Pill, Camera,
  Pause, Play, Volume2, VolumeX, ChevronRight
} from 'lucide-react';

// Base object schema (no refine)
const baseObj = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  gender: z.enum(['male', 'female'], { required_error: 'Please select gender' }),
  address: z.string().min(5, 'Address is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
});

// Base schema with password match check
const baseSchema = baseObj.refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Doctor-specific schema
const doctorSchema = baseObj.extend({
  specialization: z.string().min(3, 'Specialization is required'),
  licenseNumber: z.string().min(5, 'License number is required'),
  experience: z.string().min(1, 'Experience is required'),
  qualifications: z.string().min(3, 'Qualifications are required'),
  consultationFee: z.string().min(1, 'Consultation fee is required'),
  hospitalAffiliation: z.string().min(3, 'Hospital affiliation is required'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Admin-specific schema
const adminSchema = baseObj.extend({
  organization: z.string().min(3, 'Organization is required'),
  designation: z.string().min(2, 'Designation is required'),
  reasonForAccess: z.string().min(20, 'Please provide detailed reason (min 20 chars)'),
  adminCode: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface RegisterFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: 'male' | 'female';
  address: string;
  dateOfBirth: string;
  // Doctor fields
  specialization?: string;
  licenseNumber?: string;
  experience?: string;
  qualifications?: string;
  consultationFee?: string;
  hospitalAffiliation?: string;
  // Admin fields
  organization?: string;
  designation?: string;
  reasonForAccess?: string;
  adminCode?: string;
}

const Register: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentRole = role || 'client';

  const getSchema = () => {
    switch (currentRole) {
      case 'doctor': return doctorSchema;
      case 'admin': return adminSchema;
      default: return baseSchema;
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(getSchema()),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      gender: undefined,
      address: '',
      dateOfBirth: '',
      specialization: '',
      licenseNumber: '',
      experience: '',
      qualifications: '',
      consultationFee: '',
      hospitalAffiliation: '',
      organization: '',
      designation: '',
      reasonForAccess: '',
      adminCode: '',
    },
  });

  const togglePlay = () => {
    if (videoRef.current) {
      isPlaying ? videoRef.current.pause() : videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfileImage(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: any) => {
    setError('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const userProfile = {
        id: Date.now().toString(),
        email: data.email,
        fullName: data.fullName,
        gender: data.gender,
        primaryRole: currentRole === 'doctor' ? 'doctor' : currentRole === 'admin' ? 'admin_applicant' : 'normal_user',
        roles: [currentRole === 'doctor' ? 'doctor' : currentRole === 'admin' ? 'admin_applicant' : 'normal_user'],
        upgrades: currentRole === 'client' ? ['client_patient'] : [],
        isAdminApproved: currentRole === 'admin' ? false : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        phone: data.phone,
        address: data.address,
        dateOfBirth: data.dateOfBirth,
        ...(currentRole === 'doctor' && {
          specialization: data.specialization,
          licenseNumber: data.licenseNumber,
          experience: parseInt(data.experience),
          qualifications: data.qualifications.split(',').map((q: string) => q.trim()),
          consultationFee: parseFloat(data.consultationFee),
          hospitalAffiliation: data.hospitalAffiliation,
        }),
      };

      dispatch(login(userProfile as any));

      toast.success('Account created successfully! 🎉', {
        style: {
          borderRadius: '12px',
          background: '#1a1a2e',
          color: '#fff',
          border: '1px solid rgba(6, 182, 212, 0.3)',
        },
      });

      setTimeout(() => {
        if (currentRole === 'doctor') navigate('/doctor/dashboard');
        else if (currentRole === 'admin') navigate('/admin/dashboard');
        else navigate('/client/dashboard');
      }, 1000);
    } catch (err) {
      setError('Registration failed. Please try again.');
      toast.error('Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const getInputClasses = (hasError: boolean) => `
    w-full pl-12 pr-4 py-4 bg-white/[0.03] border rounded-2xl text-white text-sm
    placeholder-white/20 outline-none transition-all duration-300
    ${hasError ? 'border-red-500/50 bg-red-500/[0.03]' : 'border-white/[0.06] hover:border-white/[0.1] focus:border-cyan-400/50 focus:bg-white/[0.06]'}
  `;

  const roleInfo = {
    client: {
      title: 'Create Client Account',
      subtitle: 'Start as a client, upgrade to patient anytime',
      icon: User,
      color: 'from-cyan-500 to-blue-500',
      badge: 'Starts as Client',
      badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    },
    doctor: {
      title: 'Register as Doctor',
      subtitle: 'Join our network of medical professionals',
      icon: Stethoscope,
      color: 'from-emerald-500 to-teal-500',
      badge: 'Professional',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    admin: {
      title: 'Apply for Admin Access',
      subtitle: 'Request administrative privileges',
      icon: Shield,
      color: 'from-purple-500 to-violet-500',
      badge: 'Restricted',
      badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    },
  };

  const currentRoleInfo = roleInfo[currentRole as keyof typeof roleInfo] || roleInfo.client;
  const RoleIcon = currentRoleInfo.icon;

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video ref={videoRef} autoPlay loop muted={isMuted} playsInline className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=1080&fit=crop">
          <source src="/videos/medical-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-[#050508]/95 via-[#050508]/85 to-[#050508]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '60px 60px',
        }} />
        <motion.div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.06] blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-purple-500/[0.06] blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} />
      </div>

      {/* Video Controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button onClick={togglePlay}
          className="p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-white/40 hover:text-white/70 transition-all">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={toggleMute}
          className="p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-white/40 hover:text-white/70 transition-all">
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div key={i} className="absolute w-1.5 h-1.5 rounded-full"
            style={{
              background: i % 3 === 0 ? '#06b6d4' : i % 3 === 1 ? '#8b5cf6' : '#ec4899',
              left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
              boxShadow: '0 0 6px currentColor',
            }}
            animate={{ y: [0, -80, 0], opacity: [0, 0.7, 0], scale: [0, 1.5, 0] }}
            transition={{ duration: 4 + Math.random() * 6, repeat: Infinity, delay: Math.random() * 4 }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          {/* Back Button */}
          <button onClick={() => navigate('/register')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 transition-all mb-6">
            <ChevronLeft className="w-4 h-4" /> Back to Role Selection
          </button>

          {/* Role Badge */}
          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${currentRoleInfo.badgeColor} text-xs font-medium mb-4`}>
            <RoleIcon className="w-3.5 h-3.5" />
            {currentRoleInfo.badge}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{currentRoleInfo.title}</h1>
          <p className="text-white/40 text-sm">{currentRoleInfo.subtitle}</p>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-3 mt-4">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 1 ? 'bg-cyan-500 text-white' : 'bg-emerald-500 text-white'
              }`}>
                {step > 1 ? <CheckCircle2 className="w-4 h-4" /> : '1'}
              </div>
              <span className={`text-xs ${step === 1 ? 'text-cyan-400' : 'text-white/30'}`}>Basic Info</span>
            </div>
            <div className={`w-8 h-px ${step === 2 ? 'bg-cyan-500' : 'bg-white/[0.1]'}`} />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step === 2 ? 'bg-cyan-500 text-white' : 'bg-white/[0.05] text-white/30'
              }`}>2</div>
              <span className={`text-xs ${step === 2 ? 'text-cyan-400' : 'text-white/30'}`}>
                {currentRole === 'doctor' ? 'Professional Details' : currentRole === 'admin' ? 'Access Details' : 'Additional Info'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Registration Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="relative p-8 rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.06] shadow-2xl overflow-hidden mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] via-transparent to-purple-500/[0.02] pointer-events-none" />
          
          <div className="relative z-10">
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-red-400 text-xs">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Profile Image Upload */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-2 border-dashed border-white/[0.08] flex items-center justify-center overflow-hidden cursor-pointer hover:border-cyan-400/30 transition-all"
                    onClick={() => fileInputRef.current?.click()}>
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-white/20" />
                    )}
                  </div>
                  <button type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-all shadow-lg">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </div>
              </div>

              <AnimatePresence mode="wait">
                {step === 1 ? (
                  <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-5">
                    {/* Full Name */}
                    <div>
                      <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                        <User className="w-3 h-3 inline mr-1" /> Full Name
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input type="text" {...register('fullName')}
                          onFocus={() => setActiveField('fullName')} onBlur={() => setActiveField(null)}
                          placeholder="Enter your full name" className={getInputClasses(!!errors.fullName)} />
                      </div>
                      {errors.fullName && <p className="text-red-400 text-[11px] mt-1.5 ml-1">{errors.fullName.message as string}</p>}
                    </div>

                    {/* Email & Phone */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                          <Mail className="w-3 h-3 inline mr-1" /> Email
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                          <input type="email" {...register('email')}
                            onFocus={() => setActiveField('email')} onBlur={() => setActiveField(null)}
                            placeholder="you@example.com" className={getInputClasses(!!errors.email)} />
                        </div>
                        {errors.email && <p className="text-red-400 text-[11px] mt-1.5">{errors.email.message as string}</p>}
                      </div>
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                          <Phone className="w-3 h-3 inline mr-1" /> Phone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                          <input type="tel" {...register('phone')}
                            onFocus={() => setActiveField('phone')} onBlur={() => setActiveField(null)}
                            placeholder="+1 (555) 000-0000" className={getInputClasses(!!errors.phone)} />
                        </div>
                        {errors.phone && <p className="text-red-400 text-[11px] mt-1.5">{errors.phone.message as string}</p>}
                      </div>
                    </div>

                    {/* Date of Birth & Gender */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                          <Calendar className="w-3 h-3 inline mr-1" /> Date of Birth
                        </label>
                        <div className="relative">
                          <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                          <input type="date" {...register('dateOfBirth')} className={getInputClasses(!!errors.dateOfBirth)} />
                        </div>
                        {errors.dateOfBirth && <p className="text-red-400 text-[11px] mt-1.5">{errors.dateOfBirth.message as string}</p>}
                      </div>
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Gender</label>
                        <div className="grid grid-cols-2 gap-2">
                          {['male', 'female'].map(gender => (
                            <label key={gender}
                              className={`flex items-center justify-center gap-2 p-3.5 rounded-xl border transition-all cursor-pointer ${
                                watch('gender') === gender
                                  ? 'border-cyan-400/50 bg-cyan-500/[0.08] text-white'
                                  : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/[0.1]'
                              }`}>
                              <input {...register('gender')} type="radio" value={gender} className="sr-only" />
                              <span className="text-sm font-medium capitalize">{gender}</span>
                              {watch('gender') === gender && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                            </label>
                          ))}
                        </div>
                        {errors.gender && <p className="text-red-400 text-[11px] mt-1.5">{errors.gender.message as string}</p>}
                      </div>
                    </div>

                    {/* Password & Confirm */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                          <Lock className="w-3 h-3 inline mr-1" /> Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                          <input type={showPassword ? 'text' : 'password'} {...register('password')}
                            placeholder="Min. 8 characters" className={getInputClasses(!!errors.password)} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5">
                            {showPassword ? <EyeOff className="w-4 h-4 text-white/30" /> : <Eye className="w-4 h-4 text-white/30" />}
                          </button>
                        </div>
                        {errors.password && <p className="text-red-400 text-[11px] mt-1.5">{errors.password.message as string}</p>}
                      </div>
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                          <Lock className="w-3 h-3 inline mr-1" /> Confirm Password
                        </label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                          <input type={showConfirmPassword ? 'text' : 'password'} {...register('confirmPassword')}
                            placeholder="Re-enter password" className={getInputClasses(!!errors.confirmPassword)} />
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5">
                            {showConfirmPassword ? <EyeOff className="w-4 h-4 text-white/30" /> : <Eye className="w-4 h-4 text-white/30" />}
                          </button>
                        </div>
                        {errors.confirmPassword && <p className="text-red-400 text-[11px] mt-1.5">{errors.confirmPassword.message as string}</p>}
                      </div>
                    </div>

                    {/* Address */}
                    <div>
                      <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                        <MapPin className="w-3 h-3 inline mr-1" /> Address
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input type="text" {...register('address')}
                          placeholder="Your full address" className={getInputClasses(!!errors.address)} />
                      </div>
                      {errors.address && <p className="text-red-400 text-[11px] mt-1.5">{errors.address.message as string}</p>}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    {/* Doctor-specific fields */}
                    {currentRole === 'doctor' && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Specialization</label>
                            <select {...register('specialization')} className={getInputClasses(!!errors.specialization)}>
                              <option value="" className="bg-gray-900">Select specialization</option>
                              {['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Psychiatry', 'Oncology', 'Radiology'].map(s => (
                                <option key={s} value={s} className="bg-gray-900">{s}</option>
                              ))}
                            </select>
                            {errors.specialization && <p className="text-red-400 text-[11px] mt-1.5">{(errors as any).specialization?.message}</p>}
                          </div>
                          <div>
                            <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">License Number</label>
                            <input {...register('licenseNumber')} placeholder="MED-12345" className={getInputClasses(!!(errors as any).licenseNumber)} />
                            {(errors as any).licenseNumber && <p className="text-red-400 text-[11px] mt-1.5">{(errors as any).licenseNumber?.message}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Experience (years)</label>
                            <input {...register('experience')} type="number" placeholder="5" className={getInputClasses(!!(errors as any).experience)} />
                            {(errors as any).experience && <p className="text-red-400 text-[11px] mt-1.5">{(errors as any).experience?.message}</p>}
                          </div>
                          <div>
                            <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Consultation Fee ($)</label>
                            <input {...register('consultationFee')} type="number" placeholder="150" className={getInputClasses(!!(errors as any).consultationFee)} />
                            {(errors as any).consultationFee && <p className="text-red-400 text-[11px] mt-1.5">{(errors as any).consultationFee?.message}</p>}
                          </div>
                        </div>
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Qualifications (comma separated)</label>
                          <input {...register('qualifications')} placeholder="MD, FACC, PhD" className={getInputClasses(!!(errors as any).qualifications)} />
                          {(errors as any).qualifications && <p className="text-red-400 text-[11px] mt-1.5">{(errors as any).qualifications?.message}</p>}
                        </div>
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Hospital Affiliation</label>
                          <input {...register('hospitalAffiliation')} placeholder="City General Hospital" className={getInputClasses(!!(errors as any).hospitalAffiliation)} />
                          {(errors as any).hospitalAffiliation && <p className="text-red-400 text-[11px] mt-1.5">{(errors as any).hospitalAffiliation?.message}</p>}
                        </div>
                      </>
                    )}

                    {/* Admin-specific fields */}
                    {currentRole === 'admin' && (
                      <>
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Organization</label>
                          <input {...register('organization')} placeholder="Your organization name" className={getInputClasses(!!(errors as any).organization)} />
                          {(errors as any).organization && <p className="text-red-400 text-[11px] mt-1.5">{(errors as any).organization?.message}</p>}
                        </div>
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Designation</label>
                          <input {...register('designation')} placeholder="Your role/designation" className={getInputClasses(!!(errors as any).designation)} />
                          {(errors as any).designation && <p className="text-red-400 text-[11px] mt-1.5">{(errors as any).designation?.message}</p>}
                        </div>
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Reason for Admin Access</label>
                          <textarea {...register('reasonForAccess')} rows={3} placeholder="Explain why you need admin access (min 20 characters)"
                            className={getInputClasses(!!(errors as any).reasonForAccess)} />
                          {(errors as any).reasonForAccess && <p className="text-red-400 text-[11px] mt-1.5">{(errors as any).reasonForAccess?.message}</p>}
                        </div>
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Admin Code (Optional)</label>
                          <input {...register('adminCode')} placeholder="Enter admin invitation code" className={getInputClasses(false)} />
                        </div>
                      </>
                    )}

                    {/* Client additional info */}
                    {currentRole === 'client' && (
                      <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                        <p className="text-cyan-400 text-sm font-medium mb-2">✨ Client Account Benefits</p>
                        <ul className="space-y-2 text-white/50 text-xs">
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Book appointments with 500+ specialists</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Access health records & prescriptions</li>
                          <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Upgrade to full Patient profile anytime</li>
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-4">
                {step === 2 && (
                  <motion.button type="button" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    onClick={() => setStep(1)}
                    className="px-6 py-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] text-white/60 text-sm font-medium hover:bg-white/[0.04] hover:text-white transition-all">
                    <ChevronLeft className="w-4 h-4 inline mr-1" /> Previous
                  </motion.button>
                )}
                
                {step === 1 ? (
                  <motion.button type="button" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2">
                    Continue <ArrowRight className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button type="submit" disabled={isLoading}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className={`flex-1 py-4 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                      isLoading ? 'bg-white/[0.05] text-white/30 cursor-not-allowed'
                        : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
                    }`}>
                    {isLoading ? (
                      <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account...</>
                    ) : (
                      <>Create Account <CheckCircle2 className="w-4 h-4" /></>
                    )}
                  </motion.button>
                )}
              </div>
            </form>

            {/* Login Link */}
            <p className="text-center mt-6 text-white/30 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Sign In <ChevronRight className="w-3.5 h-3.5 inline" />
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-center text-white/15 text-xs pb-4">
          <Shield className="w-3 h-3 inline mr-1" />
          HIPAA Compliant • 256-bit Encrypted • Secure Registration
        </motion.p>
      </div>
    </div>
  );
};

export default Register;