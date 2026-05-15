// src/pages/Login.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch } from 'react-redux';
import { setUser } from '../components/slices/slices/authSlice';
import type { User } from '../components/slices/slices/authSlice';
import toast from 'react-hot-toast';
import {
  Eye, EyeOff, Mail, Lock, ArrowRight, Fingerprint,
  Sparkles, Shield, AlertCircle, ChevronRight,
  Github, Twitter, Chrome, Pause, Play, Volume2, VolumeX,
  Heart
} from 'lucide-react';

// ============================================
// FORM VALIDATION SCHEMA
// ============================================
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

// ============================================
// ANIMATED BACKGROUND COMPONENT
// ============================================
const AnimatedVideoBackground: React.FC<{
  isPlaying: boolean;
  isMuted: boolean;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  videoRef: React.RefObject<HTMLVideoElement>;
}> = ({ isPlaying, isMuted, onTogglePlay, onToggleMute, videoRef }) => (
  <div className="absolute inset-0 z-0">
    {/* Video */}
    <video
      ref={videoRef}
      autoPlay
      loop
      muted={isMuted}
      playsInline
      className="w-full h-full object-cover"
      poster="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1920&h=1080&fit=crop"
    >
      <source src="/videos/medical-background.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>

    {/* Depth Layers */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#050508]/95 via-[#050508]/80 to-[#050508]/90" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#050508] via-transparent to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-r from-[#050508]/60 via-transparent to-[#050508]/60" />

    {/* Grid Pattern Overlay */}
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
        backgroundSize: '60px 60px',
      }}
    />

    {/* Floating Glow Orbs */}
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
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-500/[0.04] blur-3xl"
      animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.2, 0.4, 0.2] }}
      transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
    />

    {/* Video Controls */}
    <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
      <motion.button
        type="button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onTogglePlay}
        className="p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
        aria-label={isPlaying ? 'Pause video' : 'Play video'}
      >
        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </motion.button>
      <motion.button
        type="button"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggleMute}
        className="p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
      </motion.button>
    </div>
  </div>
);

// ============================================
// FLOATING PARTICLES COMPONENT
// ============================================
const FloatingParticles: React.FC = () => (
  <div className="absolute inset-0 z-0 pointer-events-none">
    {[...Array(50)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full"
        style={{
          width: `${2 + Math.random() * 4}px`,
          height: `${2 + Math.random() * 4}px`,
          background: i % 5 === 0 ? '#06b6d4' : i % 5 === 1 ? '#8b5cf6' : i % 5 === 2 ? '#ec4899' : i % 5 === 3 ? '#22c55e' : '#f59e0b',
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          boxShadow: `0 0 ${4 + Math.random() * 8}px currentColor`,
        }}
        animate={{
          y: [0, -100 - Math.random() * 80, 0],
          x: [0, (Math.random() - 0.5) * 80, 0],
          opacity: [0, 0.9, 0],
          scale: [0, 1.8, 0],
        }}
        transition={{
          duration: 5 + Math.random() * 8,
          repeat: Infinity,
          delay: Math.random() * 6,
          ease: 'easeInOut',
        }}
      />
    ))}
  </div>
);

// ============================================
// LOGO COMPONENT
// ============================================
const AnimatedLogo: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="text-center mb-10"
  >
    {/* 3D Rotating Logo */}
    <motion.div
      animate={{ rotateY: [0, 360] }}
      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      className="perspective-1000 inline-flex items-center justify-center w-24 h-24 mb-6"
    >
      <motion.div
        whileHover={{ scale: 1.1, rotateZ: 5 }}
        className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl shadow-2xl shadow-indigo-500/30 flex items-center justify-center relative overflow-hidden"
      >
        {/* Inner glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/5" />
        <Heart className="w-12 h-12 text-white relative z-10 drop-shadow-lg" />
      </motion.div>
    </motion.div>

    <motion.h1
      className="text-4xl sm:text-5xl font-bold text-white tracking-[-0.03em] mb-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      Welcome Back
    </motion.h1>
    <motion.p
      className="text-white/35 text-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      Sign in to access your healthcare dashboard
    </motion.p>
  </motion.div>
);

// ============================================
// SOCIAL AUTH BUTTONS COMPONENT
// ============================================
const SocialAuthButtons: React.FC = () => {
  const socialButtons = [
    {
      icon: Chrome,
      label: 'Google',
      iconColor: 'text-blue-400',
      onClick: () => toast.success('Google login coming soon!'),
    },
    {
      icon: Github,
      label: 'GitHub',
      iconColor: 'text-purple-400',
      onClick: () => toast.success('GitHub login coming soon!'),
    },
    {
      icon: Twitter,
      label: 'Twitter',
      iconColor: 'text-sky-400',
      onClick: () => toast.success('Twitter login coming soon!'),
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {socialButtons.map((social) => {
        const Icon = social.icon;
        return (
          <motion.button
            key={social.label}
            type="button"
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={social.onClick}
            className="flex items-center justify-center gap-2 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all group"
          >
            <Icon className={`w-5 h-5 ${social.iconColor} group-hover:scale-110 transition-transform`} />
            <span className="text-white/40 text-xs font-medium hidden sm:inline group-hover:text-white/60 transition-colors">
              {social.label}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
};

// ============================================
// MAIN LOGIN COMPONENT
// ============================================
const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  // Video controls
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

  // Form submission
  const onSubmit = async (data: LoginFormData) => {
    setError('');
    setIsLoading(true);

    try {
      // Simulate API call with realistic delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const isHospitalLogin =
        data.email.toLowerCase().includes('hospital') || data.email === 'hospital@aetherion.com';

      const user: User = isHospitalLogin
        ? {
            id: 'hospital-1',
            name: 'City General Hospital',
            email: data.email,
            phone: '+1 (555) 999-8888',
            role: 'hospital',
          }
        : {
            id: '1',
            name: 'John Doe',
            email: data.email,
            phone: '+1 (555) 000-0000',
            role: 'patient',
          };

      dispatch(setUser(user));

      toast.success(
        isHospitalLogin ? 'Welcome, Hospital Admin!' : 'Welcome back! Login successful.',
        {
          icon: '🎉',
          style: {
            borderRadius: '12px',
            background: '#1a1a2e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
          },
        }
      );

      setTimeout(() => {
        navigate(isHospitalLogin ? '/hospital/dashboard' : '/dashboard');
      }, 500);
    } catch (err) {
      setError('Invalid email or password. Please try again.');
      toast.error('Login failed. Please check your credentials.', {
        style: {
          borderRadius: '12px',
          background: '#1a1a2e',
          color: '#fff',
          border: '1px solid rgba(255,255,255,0.1)',
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic input classes
  const getInputClasses = (field: string, hasError: boolean) => `
    w-full pl-12 pr-4 py-4 bg-white/[0.03] border rounded-2xl text-white text-sm
    placeholder-white/20 outline-none transition-all duration-300
    ${
      hasError
        ? 'border-red-500/50 bg-red-500/[0.03] focus:border-red-400'
        : activeField === field
        ? 'border-cyan-400/50 bg-white/[0.06] shadow-[0_0_20px_rgba(6,182,212,0.15)]'
        : 'border-white/[0.06] hover:border-white/[0.1]'
    }
  `;

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Video Background */}
      <AnimatedVideoBackground
        isPlaying={isPlaying}
        isMuted={isMuted}
        onTogglePlay={togglePlay}
        onToggleMute={toggleMute}
        videoRef={videoRef}
      />

      {/* Floating Particles */}
      <FloatingParticles />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo + Header */}
        <AnimatedLogo />

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative p-8 rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/20 overflow-hidden">
            {/* Card inner glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] via-transparent to-purple-500/[0.02] pointer-events-none" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/[0.03] blur-3xl rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/[0.03] blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10">
              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, scale: 0.95 }}
                    animate={{ opacity: 1, height: 'auto', scale: 1 }}
                    exit={{ opacity: 0, height: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                    <span className="text-red-400 text-xs font-medium">{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                        activeField === 'email'
                          ? 'text-cyan-400'
                          : errors.email
                          ? 'text-red-400'
                          : 'text-white/20'
                      }`}
                    />
                    <input
                      type="email"
                      {...register('email')}
                      onFocus={() => setActiveField('email')}
                      onBlur={() => setActiveField(null)}
                      placeholder="Enter your email"
                      className={getInputClasses('email', !!errors.email)}
                      autoComplete="email"
                    />
                  </div>
                  {errors.email && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-[11px] mt-1.5 ml-1 font-medium"
                    >
                      {errors.email.message}
                    </motion.p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white/40 text-xs font-medium uppercase tracking-wider">
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-cyan-400 text-[10px] font-medium hover:text-cyan-300 transition-colors"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock
                      className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                        activeField === 'password'
                          ? 'text-cyan-400'
                          : errors.password
                          ? 'text-red-400'
                          : 'text-white/20'
                      }`}
                    />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      onFocus={() => setActiveField('password')}
                      onBlur={() => setActiveField(null)}
                      placeholder="Enter your password"
                      className={getInputClasses('password', !!errors.password)}
                      autoComplete="current-password"
                    />
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-white/30 hover:text-white/60 transition-colors" />
                      ) : (
                        <Eye className="w-4 h-4 text-white/30 hover:text-white/60 transition-colors" />
                      )}
                    </motion.button>
                  </div>
                  {errors.password && (
                    <motion.p
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-[11px] mt-1.5 ml-1 font-medium"
                    >
                      {errors.password.message}
                    </motion.p>
                  )}
                </div>

                {/* Remember Me */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-5 h-5 rounded-lg border-2 border-white/[0.1] bg-white/[0.02] peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-all duration-200 group-hover:border-white/[0.2] flex items-center justify-center">
                      <motion.svg
                        initial={false}
                        animate={rememberMe ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </motion.svg>
                    </div>
                  </div>
                  <span className="text-white/40 text-xs group-hover:text-white/60 transition-colors">
                    Remember me for 30 days
                  </span>
                </label>

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-2xl font-semibold text-base transition-all duration-300 flex items-center justify-center gap-2 ${
                    isLoading
                      ? 'bg-white/[0.05] text-white/30 cursor-not-allowed'
                      : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-3">
                      <svg
                        className="animate-spin w-5 h-5"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      <span className="animate-pulse">Signing in...</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </motion.button>

                {/* Divider */}
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/[0.06]" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 bg-[#0a0a10] text-white/20 text-[10px] font-medium tracking-widest uppercase">
                      Or continue with
                    </span>
                  </div>
                </div>

                {/* Social Auth Buttons */}
                <SocialAuthButtons />

                {/* Biometric Button */}
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toast.success('Biometric login coming soon!')}
                  className="w-full flex items-center justify-center gap-3 py-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.12] transition-all mt-3 group"
                >
                  <Fingerprint className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                  <span className="text-white/50 text-sm font-medium group-hover:text-white/70 transition-colors">
                    Sign in with Biometrics
                  </span>
                  <Sparkles className="w-4 h-4 text-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.button>
              </form>

              {/* Sign Up Link */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-8 text-white/30 text-sm"
              >
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors inline-flex items-center gap-1 group"
                >
                  Create Account
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.p>
            </div>
          </div>
        </motion.div>

        {/* Security Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm">
            <Shield className="w-3.5 h-3.5 text-emerald-400/60" />
            <span className="text-white/15 text-[11px] font-medium tracking-wider">
              HIPAA Compliant • 256-bit Encrypted • Secure Login
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;