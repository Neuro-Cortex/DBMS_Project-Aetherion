// src/pages/auth/Login.tsx (Updated with role-based login)
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { login } from '../../store/slices/authSlice';
import toast from 'react-hot-toast';
import {
  Eye, EyeOff, Mail, Lock, ArrowRight,
  Sparkles, Shield, AlertCircle,
  Heart, Stethoscope, User, Pause, Play, Volume2, VolumeX,
  Chrome, Github, Twitter, ChevronRight
} from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['client', 'doctor', 'admin']),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedRole, setSelectedRole] = useState<'client' | 'doctor' | 'admin'>('client');
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', role: 'client', rememberMe: false },
  });

  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Client/Patient user
      if (data.role === 'client') {
        dispatch(login({
          id: '1',
          email: data.email,
          fullName: 'John Doe',
          gender: 'male',
          primaryRole: 'normal_user',
          roles: ['normal_user'],
          upgrades: ['client_patient'], // Already upgraded to patient
          isAdminApproved: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        toast.success('Welcome back! Redirecting to your dashboard...');
        setTimeout(() => navigate('/client/dashboard'), 500);
      }
      // Doctor
      else if (data.role === 'doctor') {
        dispatch(login({
          id: '2',
          email: data.email,
          fullName: 'Dr. Sarah Johnson',
          gender: 'female',
          primaryRole: 'doctor',
          roles: ['doctor'],
          upgrades: [],
          isAdminApproved: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          specialization: 'Cardiology',
          licenseNumber: 'MED-12345',
          experience: 15,
          qualifications: ['MD', 'FACC'],
          consultationFee: 150,
        } as any));
        toast.success('Welcome back, Doctor!');
        setTimeout(() => navigate('/doctor/dashboard'), 500);
      }
      // Admin
      else {
        dispatch(login({
          id: '3',
          email: data.email,
          fullName: 'Admin User',
          gender: 'male',
          primaryRole: 'admin_applicant',
          roles: ['admin_applicant'],
          upgrades: [],
          isAdminApproved: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }));
        toast.success('Welcome back, Admin!');
        setTimeout(() => navigate('/admin/dashboard'), 500);
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.');
      toast.error('Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleTabs = [
    { id: 'client' as const, label: 'Client / Patient', icon: User, desc: 'Healthcare access' },
    { id: 'doctor' as const, label: 'Doctor', icon: Stethoscope, desc: 'Medical professional' },
    { id: 'admin' as const, label: 'Admin', icon: Shield, desc: 'Platform management' },
  ];

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <video ref={videoRef} autoPlay loop muted={isMuted} playsInline className="w-full h-full object-cover">
          <source src="/videos/medical-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-[#050508]/95 via-[#050508]/85 to-[#050508]/95" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '60px 60px',
        }} />
      </div>

      {/* Video Controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button onClick={() => { if (videoRef.current) { isPlaying ? videoRef.current.pause() : videoRef.current.play(); setIsPlaying(!isPlaying); }}}
          className="p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-white/40 hover:text-white/70 transition-all">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={() => { if (videoRef.current) { videoRef.current.muted = !isMuted; setIsMuted(!isMuted); }}}
          className="p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-white/40 hover:text-white/70 transition-all">
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6">
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl shadow-2xl shadow-indigo-500/30 flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-white/35 text-sm mt-1">Sign in to continue</p>
        </motion.div>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="relative p-8 rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.06] shadow-2xl overflow-hidden">
          
          <div className="relative z-10">
            {/* Role Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1.5 rounded-xl bg-white/[0.03] border border-white/[0.04] mb-6">
              {roleTabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} type="button" onClick={() => { setSelectedRole(tab.id); }}
                    className={`py-3 rounded-lg text-center transition-all ${
                      selectedRole === tab.id
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'text-white/30 hover:text-white/50'
                    }`}>
                    <Icon className="w-5 h-5 mx-auto mb-1" />
                    <span className="text-[10px] font-medium block">{tab.label.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 text-xs">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <input type="hidden" {...register('role')} value={selectedRole} />

              {/* Email */}
              <div>
                <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input type="email" {...register('email')} onFocus={() => setActiveField('email')} onBlur={() => setActiveField(null)}
                    placeholder="Enter your email"
                    className={`w-full pl-12 pr-4 py-4 bg-white/[0.03] border rounded-2xl text-white text-sm placeholder-white/20 outline-none transition-all ${
                      errors.email ? 'border-red-500/50' : activeField === 'email' ? 'border-cyan-400/50' : 'border-white/[0.06] hover:border-white/[0.1]'
                    }`} />
                </div>
                {errors.email && <p className="text-red-400 text-[11px] mt-1.5">{errors.email.message}</p>}
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider">Password</label>
                  <Link to="/forgot-password" className="text-cyan-400 text-[10px] hover:text-cyan-300">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input type={showPassword ? 'text' : 'password'} {...register('password')}
                    onFocus={() => setActiveField('password')} onBlur={() => setActiveField(null)}
                    placeholder="Enter your password"
                    className={`w-full pl-12 pr-12 py-4 bg-white/[0.03] border rounded-2xl text-white text-sm placeholder-white/20 outline-none transition-all ${
                      errors.password ? 'border-red-500/50' : activeField === 'password' ? 'border-cyan-400/50' : 'border-white/[0.06] hover:border-white/[0.1]'
                    }`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/[0.06] rounded-lg">
                    {showPassword ? <EyeOff className="w-4 h-4 text-white/30" /> : <Eye className="w-4 h-4 text-white/30" />}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-[11px] mt-1.5">{errors.password.message}</p>}
              </div>

              {/* Submit */}
              <motion.button type="submit" disabled={isLoading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className={`w-full py-4 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
                  isLoading ? 'bg-white/[0.05] text-white/30 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                }`}>
                {isLoading ? (
                  <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Signing in...</>
                ) : (
                  <>Sign In as {selectedRole === 'client' ? 'Client' : selectedRole === 'doctor' ? 'Doctor' : 'Admin'} <ArrowRight className="w-5 h-5" /></>
                )}
              </motion.button>
            </form>

            {/* Register Link */}
            <p className="text-center mt-6 text-white/30 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Create Account
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center mt-6 text-white/15 text-xs">
          <Shield className="w-3 h-3 inline mr-1" />
          HIPAA Compliant • 256-bit Encrypted • Secure Login
        </p>
      </div>
    </div>
  );
};

export default Login;