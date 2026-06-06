// src/pages/auth/Register.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { registerUser, User as AuthUser } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';

import { Avatar } from '../../ui/Avatar';
import { Input } from '../../ui/Input';
import {
  Eye, EyeOff, Mail, Lock, User, Phone, MapPin,
  ArrowRight, Shield, AlertCircle,
  Stethoscope, ChevronLeft, CheckCircle2,
  Calendar, Camera,
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

// Hospital-specific schema
const hospitalSchema = baseObj.extend({
  hospitalName: z.string().min(3, 'Hospital name is required'),
  registrationNumber: z.string().min(5, 'Registration number is required'),
  bedCapacity: z.string().min(1, 'Bed capacity is required'),
  departments: z.string().min(3, 'Departments are required'),
  emergencyContact: z.string().min(10, 'Emergency contact is required'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Pharmacy-specific schema
const pharmacySchema = baseObj.extend({
  pharmacyName: z.string().min(3, 'Pharmacy name is required'),
  licenseNumber: z.string().min(5, 'License number is required'),
  gstNumber: z.string().min(10, 'GST number is required'),
  pharmacistName: z.string().min(3, 'Pharmacist name is required'),
  operatingHours: z.string().min(3, 'Operating hours are required'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type UserRole = 'patient' | 'doctor' | 'hospital' | 'pharmacy' | 'admin';

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
  // Hospital fields
  hospitalName?: string;
  registrationNumber?: string;
  bedCapacity?: string;
  departments?: string;
  emergencyContact?: string;
  // Pharmacy fields
  pharmacyName?: string;
  gstNumber?: string;
  pharmacistName?: string;
  operatingHours?: string;
}

const roleConfig: Record<UserRole, {
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badge: string;
  badgeColor: string;
  schema: z.ZodType<RegisterFormData>;
  dashboardPath: string;
}> = {
  patient: {
    title: 'Create Patient Account',
    subtitle: 'Access your health records, appointments, and prescriptions',
    icon: User,
    color: 'from-cyan-500 to-blue-500',
    badge: 'Patient',
    badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    schema: baseSchema,
    dashboardPath: '/patient/dashboard'
  },
  doctor: {
    title: 'Register as Doctor',
    subtitle: 'Join our network of medical professionals',
    icon: Stethoscope,
    color: 'from-emerald-500 to-teal-500',
    badge: 'Professional',
    badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    schema: doctorSchema,
    dashboardPath: '/doctor/dashboard'
  },
  hospital: {
    title: 'Register Hospital',
    subtitle: 'List your hospital and manage facilities',
    icon: Shield,
    color: 'from-purple-500 to-violet-500',
    badge: 'Facility',
    badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    schema: hospitalSchema,
    dashboardPath: '/hospital/dashboard'
  },
  pharmacy: {
    title: 'Register Pharmacy',
    subtitle: 'Manage your pharmacy inventory and orders',
    icon: Shield,
    color: 'from-amber-500 to-orange-500',
    badge: 'Business',
    badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    schema: pharmacySchema,
    dashboardPath: '/pharmacy/dashboard'
  },
  admin: {
    title: 'Apply for Admin Access',
    subtitle: 'Request administrative privileges',
    icon: Shield,
    color: 'from-slate-500 to-gray-500',
    badge: 'Restricted',
    badgeColor: 'bg-slate-500/20 text-slate-400 border-slate-500/30',
    schema: adminSchema,
    dashboardPath: '/admin/dashboard'
  }
};

const Register: React.FC = () => {
  const { role } = useParams<{ role: string }>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentRole = (role as UserRole) || 'patient';
  const currentRoleConfig = roleConfig[currentRole];
  const RoleIcon = currentRoleConfig.icon;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(currentRoleConfig.schema),
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
      hospitalName: '',
      registrationNumber: '',
      bedCapacity: '',
      departments: '',
      emergencyContact: '',
      pharmacyName: '',
      gstNumber: '',
      pharmacistName: '',
      operatingHours: '',
    },
  });

  const typedErrors = errors as FieldErrors<RegisterFormData>;

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

  const handleNextStep = async () => {
    const fieldsToValidate: (keyof RegisterFormData)[] = [
      'fullName', 'email', 'phone', 'password', 
      'confirmPassword', 'gender', 'address', 'dateOfBirth'
    ];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setStep(2);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    setIsLoading(true);

    try {
      const roleMap: Record<string, string> = {
        patient: 'client',
        doctor: 'doctor',
        hospital: 'hospital_admin',
        pharmacy: 'pharmacy_admin',
        admin: 'admin',
      };
      const accountRole = roleMap[currentRole] || currentRole;

      await dispatch(registerUser({
        fullName: data.fullName,
        name: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        primaryRole: accountRole as any,
        role: accountRole as any,
        gender: data.gender,
      } as any)).unwrap();

      toast.success('Account created successfully! 🎉', {
        style: {
          borderRadius: '12px',
          background: '#1a1a2e',
          color: '#fff',
          border: '1px solid rgba(6, 182, 212, 0.3)',
        },
      });

      setTimeout(() => {
        navigate(currentRoleConfig.dashboardPath);
      }, 1000);
    } catch (err) {
      setError('Registration failed. Please try again.');
      toast.error('Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = (hasError: boolean) => `
    w-full pl-12 pr-4 py-4 bg-white/[0.03] border rounded-2xl text-white text-sm
    placeholder-white/20 outline-none transition-all duration-300
    ${hasError ? 'border-red-500/50 bg-red-500/[0.03]' : 'border-white/[0.06] hover:border-white/[0.1] focus:border-cyan-400/50 focus:bg-white/[0.06]'}
  `;

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video ref={videoRef} autoPlay loop muted={isMuted} playsInline className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=1080&fit=crop">
          <source src="/videos/medical-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-[#050508]/95 via-[#050508]/85 to-[#050508]/95" />
        
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

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-thin">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <button onClick={() => navigate('/register-role')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 transition-all mb-6">
            <ChevronLeft className="w-4 h-4" /> Back to Role Selection
          </button>

          <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full ${currentRoleConfig.badgeColor} text-xs font-medium mb-4`}>
            <RoleIcon className="w-3.5 h-3.5" />
            {currentRoleConfig.badge}
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{currentRoleConfig.title}</h1>
          <p className="text-white/40 text-sm">{currentRoleConfig.subtitle}</p>

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
                {currentRole === 'doctor' ? 'Professional Details' : 
                 currentRole === 'hospital' ? 'Hospital Details' :
                 currentRole === 'pharmacy' ? 'Pharmacy Details' :
                 currentRole === 'admin' ? 'Access Details' : 'Additional Info'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Registration Card */}
        <GlassmorphicCard className="p-8 mb-6">
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
                    <Avatar src={profileImage} alt="Profile" size="lg" />
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
                    <Input
                      {...register('fullName')}
                      icon={<User className="w-5 h-5" />}
                      placeholder="Enter your full name"
                      error={errors.fullName?.message as string}
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                        <Mail className="w-3 h-3 inline mr-1" /> Email
                      </label>
                      <Input
                        {...register('email')}
                        type="email"
                        icon={<Mail className="w-5 h-5" />}
                        placeholder="you@example.com"
                        error={errors.email?.message as string}
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                        <Phone className="w-3 h-3 inline mr-1" /> Phone
                      </label>
                      <Input
                        {...register('phone')}
                        type="tel"
                        icon={<Phone className="w-5 h-5" />}
                        placeholder="+1 (555) 000-0000"
                        error={errors.phone?.message as string}
                      />
                    </div>
                  </div>

                  {/* Date of Birth & Gender */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                        <Calendar className="w-3 h-3 inline mr-1" /> Date of Birth
                      </label>
                      <Input
                        {...register('dateOfBirth')}
                        type="date"
                        icon={<Calendar className="w-5 h-5" />}
                        error={errors.dateOfBirth?.message as string}
                      />
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
                      <Input
                        {...register('password')}
                        type={showPassword ? 'text' : 'password'}
                        icon={<Lock className="w-5 h-5" />}
                        placeholder="Min. 8 characters"
                        error={errors.password?.message as string}
                        rightElement={
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="p-1.5">
                            {showPassword ? <EyeOff className="w-4 h-4 text-white/30" /> : <Eye className="w-4 h-4 text-white/30" />}
                          </button>
                        }
                      />
                    </div>
                    <div>
                      <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                        <Lock className="w-3 h-3 inline mr-1" /> Confirm Password
                      </label>
                      <Input
                        {...register('confirmPassword')}
                        type={showConfirmPassword ? 'text' : 'password'}
                        icon={<Lock className="w-5 h-5" />}
                        placeholder="Re-enter password"
                        error={errors.confirmPassword?.message as string}
                        rightElement={
                          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="p-1.5">
                            {showConfirmPassword ? <EyeOff className="w-4 h-4 text-white/30" /> : <Eye className="w-4 h-4 text-white/30" />}
                          </button>
                        }
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                      <MapPin className="w-3 h-3 inline mr-1" /> Address
                    </label>
                    <Input
                      {...register('address')}
                      icon={<MapPin className="w-5 h-5" />}
                      placeholder="Your full address"
                      error={errors.address?.message as string}
                    />
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
                          <select {...register('specialization')} className={inputClasses(!!typedErrors.specialization)}>
                            <option value="" className="bg-gray-900">Select specialization</option>
                            {['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology', 'Psychiatry', 'Oncology', 'Radiology'].map(s => (
                              <option key={s} value={s} className="bg-gray-900">{s}</option>
                            ))}
                          </select>
                          {typedErrors.specialization && <p className="text-red-400 text-[11px] mt-1.5">{typedErrors.specialization?.message}</p>}
                        </div>
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">License Number</label>
                          <Input {...register('licenseNumber')} placeholder="MED-12345" error={typedErrors.licenseNumber?.message} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Experience (years)</label>
                          <Input {...register('experience')} type="number" placeholder="5" error={typedErrors.experience?.message} />
                        </div>
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Consultation Fee ($)</label>
                          <Input {...register('consultationFee')} type="number" placeholder="150" error={typedErrors.consultationFee?.message} />
                        </div>
                      </div>
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Qualifications (comma separated)</label>
                        <Input {...register('qualifications')} placeholder="MD, FACC, PhD" error={typedErrors.qualifications?.message} />
                      </div>
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Hospital Affiliation</label>
                        <Input {...register('hospitalAffiliation')} placeholder="City General Hospital" error={typedErrors.hospitalAffiliation?.message} />
                      </div>
                    </>
                  )}

                  {/* Hospital-specific fields */}
                  {currentRole === 'hospital' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Hospital Name</label>
                          <Input {...register('hospitalName')} placeholder="City General Hospital" error={typedErrors.hospitalName?.message} />
                        </div>
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Registration Number</label>
                          <Input {...register('registrationNumber')} placeholder="HOSP-001" error={typedErrors.registrationNumber?.message} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Bed Capacity</label>
                          <Input {...register('bedCapacity')} type="number" placeholder="500" error={typedErrors.bedCapacity?.message} />
                        </div>
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Emergency Contact</label>
                          <Input {...register('emergencyContact')} placeholder="+1 (555) 000-0000" error={typedErrors.emergencyContact?.message} />
                        </div>
                      </div>
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Departments (comma separated)</label>
                        <Input {...register('departments')} placeholder="Cardiology, Neurology, Emergency" error={typedErrors.departments?.message} />
                      </div>
                    </>
                  )}

                  {/* Pharmacy-specific fields */}
                  {currentRole === 'pharmacy' && (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Pharmacy Name</label>
                          <Input {...register('pharmacyName')} placeholder="MediCare Pharmacy" error={typedErrors.pharmacyName?.message} />
                        </div>
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">License Number</label>
                          <Input {...register('licenseNumber')} placeholder="PHARM-001" error={typedErrors.licenseNumber?.message} />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">GST Number</label>
                          <Input {...register('gstNumber')} placeholder="GST1234567890" error={typedErrors.gstNumber?.message} />
                        </div>
                        <div>
                          <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Pharmacist Name</label>
                          <Input {...register('pharmacistName')} placeholder="John Doe" error={typedErrors.pharmacistName?.message} />
                        </div>
                      </div>
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Operating Hours</label>
                        <Input {...register('operatingHours')} placeholder="9:00 AM - 10:00 PM" error={typedErrors.operatingHours?.message} />
                      </div>
                    </>
                  )}

                  {/* Admin-specific fields */}
                  {currentRole === 'admin' && (
                    <>
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Organization</label>
                        <Input {...register('organization')} placeholder="Your organization name" error={typedErrors.organization?.message} />
                      </div>
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Designation</label>
                        <Input {...register('designation')} placeholder="Your role/designation" error={typedErrors.designation?.message} />
                      </div>
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Reason for Admin Access</label>
                        <textarea {...register('reasonForAccess')} rows={3} placeholder="Explain why you need admin access (min 20 characters)"
                          className={inputClasses(!!typedErrors.reasonForAccess)} />
                        {typedErrors.reasonForAccess && <p className="text-red-400 text-[11px] mt-1.5">{typedErrors.reasonForAccess?.message}</p>}
                      </div>
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Admin Code (Optional)</label>
                        <Input {...register('adminCode')} placeholder="Enter admin invitation code" error={typedErrors.adminCode?.message} />
                      </div>
                    </>
                  )}

                  {/* Patient additional info */}
                  {currentRole === 'patient' && (
                    <div className="p-4 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                      <p className="text-cyan-400 text-sm font-medium mb-2">✨ Patient Account Benefits</p>
                      <ul className="space-y-2 text-white/50 text-xs">
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Book appointments with 500+ specialists</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Access health records & prescriptions</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Full patient profile with all features</li>
                        <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Women's health & specialized care</li>
                      </ul>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {step === 2 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="px-6 py-4"
                >
                  <ChevronLeft className="w-4 h-4 inline mr-1" /> Previous
                </Button>
              )}
              
              {step === 1 ? (
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 py-4"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-4"
                >
                  {isLoading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account...</>
                  ) : (
                    <>Create Account <CheckCircle2 className="w-4 h-4" /></>
                  )}
                </Button>
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
        </GlassmorphicCard>

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