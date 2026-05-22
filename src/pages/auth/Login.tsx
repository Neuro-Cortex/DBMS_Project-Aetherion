// src/pages/auth/Login.tsx
import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from 'src/store/slices/authSlice';
import toast from 'react-hot-toast';
import {
  Eye, EyeOff, Mail, Lock, ArrowRight, UserPlus,
  Sparkles, Shield, AlertCircle, CheckCircle,
  Heart, Stethoscope, Building2, Pill, Droplets, UserCog,
  Pause, Play, Volume2, VolumeX, ChevronRight, Fingerprint,
  Github, Twitter, Chrome, Phone, Calendar, FileText
} from 'lucide-react';











// ============================================
// TYPES
// ============================================
type UserRole = 'patient' | 'doctor' | 'hospital' | 'pharmacy' | 'admin';

interface LoginFormData {
  email: string;
  password: string;
  role: UserRole;
  rememberMe?: boolean;
}






interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  role: UserRole;
  agreeToTerms: boolean;
}

// ============================================
// ROLE CONFIGURATION
// ============================================
const roleConfig: Record<UserRole, {
  label: string;
  icon: any;
  color: string;
  gradient: string;
  description: string;
  demoEmail: string;
  demoPassword: string;
  dashboardPath: string;
  registerFields?: string[];
}> = {
  patient: {
    label: 'Patient',
    icon: UserPlus,
    color: 'cyan',
    gradient: 'from-cyan-500 via-blue-500 to-indigo-500',
    description: 'Access health records, appointments, and prescriptions',
    demoEmail: 'patient@aetherion.com',
    demoPassword: 'patient123',
    dashboardPath: '/patient/dashboard',
    registerFields: ['fullName', 'email', 'phone', 'password']
  },


  doctor: {
    label: 'Doctor',
    icon: Stethoscope,
    color: 'emerald',
    gradient: 'from-emerald-500 via-teal-500 to-green-500',
    description: 'Manage patients, write prescriptions, track schedules',
    demoEmail: 'doctor@aetherion.com',
    demoPassword: 'doctor123',
    dashboardPath: '/doctor/dashboard',
    registerFields: ['fullName', 'email', 'phone', 'specialization', 'licenseNumber', 'password']
  },



  hospital: {
    label: 'Hospital',
    icon: Building2,
    color: 'purple',
    gradient: 'from-purple-500 via-violet-500 to-indigo-500',
    description: 'Manage beds, ICU, staff, and patient admissions',
    demoEmail: 'hospital@aetherion.com',
    demoPassword: 'hospital123',
    dashboardPath: 'src/components/hospital/HospitalDashboard.tsx',
    registerFields: ['hospitalName', 'email', 'phone', 'registrationNumber', 'password']
  },


  pharmacy: {
    label: 'Pharmacy',
    icon: Pill,
    color: 'amber',
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    description: 'Manage inventory, process orders, track medicines',
    demoEmail: 'pharmacy@aetherion.com',
    demoPassword: 'pharmacy123',
    dashboardPath: '/pharmacy/dashboard',
    registerFields: ['pharmacyName', 'email', 'phone', 'licenseNumber', 'password']
  },


  admin: {
    label: 'Admin',
    icon: Shield,
    color: 'slate',
    gradient: 'from-slate-500 via-gray-500 to-zinc-500',
    description: 'Platform oversight, user management, analytics',
    demoEmail: 'admin@aetherion.com',
    demoPassword: 'admin123',
    dashboardPath: '/admin/dashboard',
    registerFields: ['fullName', 'email', 'phone', 'adminCode', 'password']
  }
};

// ============================================
// MOCK DATABASE (In production, replace with API)
// ============================================
interface StoredUser {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  phone: string;
  isApproved: boolean;
  createdAt: string;
  additionalData?: any;
}

class AuthService {
  private users: StoredUser[] = [];

  constructor() {
    this.loadUsers();
    this.initializeDemoUsers();
  }

  private loadUsers() {
    const stored = localStorage.getItem('aetherion_users');
    if (stored) {
      this.users = JSON.parse(stored);
    }
  }

  private saveUsers() {
    localStorage.setItem('aetherion_users', JSON.stringify(this.users));
  }

  private initializeDemoUsers() {
    if (this.users.length === 0) {
      this.users = [
        {
          id: '1',
          email: 'patient@aetherion.com',
          password: 'patient123',
          fullName: 'John Patient',
          role: 'patient',
          phone: '+1 (555) 123-4567',
          isApproved: true,
          createdAt: new Date().toISOString(),
          additionalData: { dateOfBirth: '1990-01-01', bloodGroup: 'O+' }
        },
        {
          id: '2',
          email: 'doctor@aetherion.com',
          password: 'doctor123',
          fullName: 'Dr. Sarah Johnson',
          role: 'doctor',
          phone: '+1 (555) 234-5678',
          isApproved: true,
          createdAt: new Date().toISOString(),
          additionalData: { specialization: 'Cardiology', licenseNumber: 'MED-12345' }
        },
        {
          id: '3',
          email: 'hospital@aetherion.com',
          password: 'hospital123',
          fullName: 'City General Hospital',
          role: 'hospital',
          phone: '+1 (555) 345-6789',
          isApproved: true,
          createdAt: new Date().toISOString(),
          additionalData: { registrationNumber: 'HOSP-001', bedCapacity: 500 }
        },
        {
          id: '4',
          email: 'pharmacy@aetherion.com',
          password: 'pharmacy123',
          fullName: 'MediCare Pharmacy',
          role: 'pharmacy',
          phone: '+1 (555) 456-7890',
          isApproved: true,
          createdAt: new Date().toISOString(),
          additionalData: { licenseNumber: 'PHARM-001', gstNumber: 'GST123456' }
        },
        {
          id: '5',
          email: 'admin@aetherion.com',
          password: 'admin123',
          fullName: 'System Admin',
          role: 'admin',
          phone: '+1 (555) 567-8901',
          isApproved: true,
          createdAt: new Date().toISOString(),
          additionalData: { adminLevel: 'super' }
        }
      ];
      this.saveUsers();
    }
  }

  async login(email: string, password: string, role: UserRole): Promise<StoredUser | null> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = this.users.find(u => u.email === email && u.password === password && u.role === role);
    if (user && user.isApproved) {
      return user;
    }
    if (user && !user.isApproved) {
      throw new Error('Your account is pending admin approval');
    }
    return null;
  }

  async register(userData: Omit<StoredUser, 'id' | 'createdAt' | 'isApproved'> & { confirmPassword: string }): Promise<StoredUser> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    
    if (userData.password !== userData.confirmPassword) {
      throw new Error('Passwords do not match');
    }
    
    const newUser: StoredUser = {
      id: `${userData.role}-${Date.now()}`,
      email: userData.email,
      password: userData.password,
      fullName: userData.fullName,
      role: userData.role,
      phone: userData.phone,
      isApproved: userData.role === 'patient' ? true : false, // Patients auto-approved, others need admin approval
      createdAt: new Date().toISOString(),
      additionalData: {}
    };
    
    this.users.push(newUser);
    this.saveUsers();
    return newUser;
  }

  async requestPasswordReset(email: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 800));
    const user = this.users.find(u => u.email === email);
    if (user) {
      // In production, send email with reset link
      console.log(`Password reset requested for ${email}`);
      return true;
    }
    return false;
  }
}

const authService = new AuthService();

// ============================================
// LOGIN COMPONENT
// ============================================
const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('patient');
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
    role: 'patient',
    rememberMe: false
  });
  const [registerData, setRegisterData] = useState<RegisterFormData>({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'patient',
    agreeToTerms: false
  });
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormData | keyof RegisterFormData, string>>>({});
  const videoRef = useRef<HTMLVideoElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check for saved session
    const savedSession = localStorage.getItem('aetherion_session');
    if (savedSession) {
      try {
        const session = JSON.parse(savedSession);
        if (session.expiresAt > Date.now()) {
          // Auto-login with saved session
          handleAutoLogin(session.user);
        }
      } catch (e) {
        console.error('Invalid session');
      }
    }
  }, []);

  const handleAutoLogin = async (user: any) => {
    dispatch(login(user));
    const roleConfigItem = roleConfig[user.role as UserRole];
    navigate(roleConfigItem.dashboardPath);
  };

  const validateLogin = (): boolean => {
    const errors: Partial<Record<keyof LoginFormData, string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegister = (): boolean => {
    const errors: Partial<Record<keyof RegisterFormData, string>> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/;
    
    if (!registerData.fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    if (!emailRegex.test(registerData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (registerData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    if (!phoneRegex.test(registerData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }
    if (!registerData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      const user = await authService.login(formData.email, formData.password, selectedRole);
      
      if (user) {
        const userForRedux = {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          phone: user.phone,
          isAuthenticated: true,
          ...user.additionalData
        };
        
        dispatch(login(userForRedux));
        
        if (formData.rememberMe) {
          localStorage.setItem('aetherion_session', JSON.stringify({
            user: userForRedux,
            expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 days
          }));
        }
        
        toast.success(`Welcome back, ${user.fullName}!`, {
          icon: '🎉',
          style: { background: '#1a1a2e', color: '#fff', border: '1px solid rgba(6,182,212,0.3)' }
        });
        
        setTimeout(() => navigate(roleConfig[selectedRole].dashboardPath), 500);
      } else {
        setError('Invalid email or password for the selected role');
        toast.error('Login failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      const newUser = await authService.register({
        fullName: registerData.fullName,
        email: registerData.email,
        password: registerData.password,
        confirmPassword: registerData.confirmPassword,
        phone: registerData.phone,
        role: registerData.role
      });
      
      if (newUser.isApproved) {
        toast.success('Registration successful! Please login.', {
          icon: '✅',
          style: { background: '#1a1a2e', color: '#fff' }
        });
        setIsRegistering(false);
        setFormData({ ...formData, email: registerData.email, role: registerData.role });
      } else {
        toast.success('Registration submitted! Awaiting admin approval.', {
          icon: '⏳',
          style: { background: '#1a1a2e', color: '#fff' }
        });
        setIsRegistering(false);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (role: UserRole) => {
    const config = roleConfig[role];
    setFormData({
      email: config.demoEmail,
      password: config.demoPassword,
      role: role,
      rememberMe: false
    });
    setSelectedRole(role);
    
    // Auto-submit after a short delay
    setTimeout(() => {
      handleLogin(new Event('submit') as any);
    }, 100);
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050508] via-[#0a0a14] to-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="/videos/medical-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-[#050508]/95 via-[#050508]/85 to-[#050508]/95" />
        
        {/* Animated gradients */}
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Video Controls */}
      <div className="absolute top-6 right-6 z-20 flex items-center gap-3">
        <button onClick={togglePlay} className="p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-white/40 hover:text-white/70 transition-all">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>
        <button onClick={toggleMute} className="p-2.5 rounded-xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] text-white/40 hover:text-white/70 transition-all">
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <motion.div
            animate={{ rotateY: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6"
          >
            <div className="w-full h-full bg-gradient-to-br from-cyan-500 via-blue-500 to-purple-500 rounded-3xl shadow-2xl shadow-cyan-500/30 flex items-center justify-center">
              <Heart className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            {isRegistering ? 'Create Account' : 'Welcome Back'}
          </h1>
          <p className="text-white/35 text-sm mt-1">
            {isRegistering ? 'Join the Aetherion healthcare ecosystem' : 'Sign in to access your dashboard'}
          </p>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.06] shadow-2xl overflow-hidden"
        >
          <div className="relative p-6 sm:p-8">
            {/* Role Selection (Login Mode Only) */}
            {!isRegistering && (
              <div className="mb-6">
                <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3 block">
                  Select Role
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(Object.keys(roleConfig) as UserRole[]).map(role => {
                    const Icon = roleConfig[role].icon;
                    const isSelected = selectedRole === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`py-2 rounded-lg text-center transition-all ${
                          isSelected
                            ? `bg-gradient-to-r ${roleConfig[role].gradient} shadow-lg`
                            : 'bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-white' : 'text-white/40'}`} />
                        <span className="text-[9px] font-medium block text-white/60">
                          {roleConfig[role].label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Role Selection (Register Mode) */}
            {isRegistering && (
              <div className="mb-6">
                <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3 block">
                  Register As
                </label>
                <div className="grid grid-cols-5 gap-1.5">
                  {(Object.keys(roleConfig) as UserRole[]).map(role => {
                    const Icon = roleConfig[role].icon;
                    const isSelected = registerData.role === role;
                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setRegisterData(prev => ({ ...prev, role }))}
                        className={`py-2 rounded-lg text-center transition-all ${
                          isSelected
                            ? `bg-gradient-to-r ${roleConfig[role].gradient} shadow-lg`
                            : 'bg-white/[0.03] border border-white/[0.04] hover:bg-white/[0.06]'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mx-auto mb-1 ${isSelected ? 'text-white' : 'text-white/40'}`} />
                        <span className="text-[9px] font-medium block text-white/60">
                          {roleConfig[role].label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Error Display */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                  <span className="text-red-400 text-xs">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Demo Login Buttons */}
            {!isRegistering && (
              <div className="mb-6">
                <p className="text-white/25 text-[10px] text-center mb-3">Quick Demo Access</p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {(Object.keys(roleConfig) as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => handleDemoLogin(role)}
                      className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 text-xs transition-all"
                    >
                      {roleConfig[role].label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Login Form */}
            {!isRegistering ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      onFocus={() => setActiveField('email')}
                      onBlur={() => setActiveField(null)}
                      placeholder="Enter your email"
                      className={`w-full pl-12 pr-4 py-4 bg-white/[0.03] border rounded-2xl text-white text-sm placeholder-white/20 outline-none transition-all ${
                        fieldErrors.email ? 'border-red-500/50' : activeField === 'email' ? 'border-cyan-400/50' : 'border-white/[0.06] hover:border-white/[0.1]'
                      }`}
                    />
                  </div>
                  {fieldErrors.email && <p className="text-red-400 text-[11px] mt-1.5">{fieldErrors.email}</p>}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white/40 text-xs font-medium uppercase tracking-wider">Password</label>
                    <button
                      type="button"
                      onClick={async () => {
                        if (formData.email) {
                          const success = await authService.requestPasswordReset(formData.email);
                          if (success) {
                            toast.success('Password reset link sent to your email');
                          } else {
                            toast.error('Email not found');
                          }
                        } else {
                          toast.error('Please enter your email first');
                        }
                      }}
                      className="text-cyan-400 text-[10px] hover:text-cyan-300 transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      onFocus={() => setActiveField('password')}
                      onBlur={() => setActiveField(null)}
                      placeholder="Enter your password"
                      className={`w-full pl-12 pr-12 py-4 bg-white/[0.03] border rounded-2xl text-white text-sm placeholder-white/20 outline-none transition-all ${
                        fieldErrors.password ? 'border-red-500/50' : activeField === 'password' ? 'border-cyan-400/50' : 'border-white/[0.06] hover:border-white/[0.1]'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4 text-white/30" /> : <Eye className="w-4 h-4 text-white/30" />}
                    </button>
                  </div>
                  {fieldErrors.password && <p className="text-red-400 text-[11px] mt-1.5">{fieldErrors.password}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={formData.rememberMe}
                    onChange={(e) => setFormData(prev => ({ ...prev, rememberMe: e.target.checked }))}
                    className="w-4 h-4 rounded border-white/[0.1] bg-white/[0.02] text-cyan-500 focus:ring-cyan-500 focus:ring-offset-0"
                  />
                  <label htmlFor="rememberMe" className="text-white/40 text-xs cursor-pointer">
                    Remember me for 30 days
                  </label>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
                    isLoading
                      ? 'bg-white/[0.05] text-white/30 cursor-not-allowed'
                      : `bg-gradient-to-r ${roleConfig[selectedRole].gradient} text-white shadow-lg`
                  }`}
                >
                  {isLoading ? (
                    <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Signing in...</>
                  ) : (
                    <>Sign In as {roleConfig[selectedRole].label} <ArrowRight className="w-5 h-5" /></>
                  )}
                </motion.button>
              </form>
            ) : (
              // Registration Form
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserCog className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input
                      type="text"
                      value={registerData.fullName}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, fullName: e.target.value }))}
                      placeholder="Enter your full name"
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-white text-sm placeholder-white/20 outline-none focus:border-cyan-400/50 transition-all"
                    />
                  </div>
                  {fieldErrors.fullName && <p className="text-red-400 text-[11px] mt-1.5">{fieldErrors.fullName}</p>}
                </div>

                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input
                      type="email"
                      value={registerData.email}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-white text-sm placeholder-white/20 outline-none focus:border-cyan-400/50 transition-all"
                    />
                  </div>
                  {fieldErrors.email && <p className="text-red-400 text-[11px] mt-1.5">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input
                      type="tel"
                      value={registerData.phone}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="+1 (555) 000-0000"
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-white text-sm placeholder-white/20 outline-none focus:border-cyan-400/50 transition-all"
                    />
                  </div>
                  {fieldErrors.phone && <p className="text-red-400 text-[11px] mt-1.5">{fieldErrors.phone}</p>}
                </div>

                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input
                      type="password"
                      value={registerData.password}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Create a password"
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-white text-sm placeholder-white/20 outline-none focus:border-cyan-400/50 transition-all"
                    />
                  </div>
                  {fieldErrors.password && <p className="text-red-400 text-[11px] mt-1.5">{fieldErrors.password}</p>}
                </div>

                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input
                      type="password"
                      value={registerData.confirmPassword}
                      onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Confirm your password"
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.06] rounded-2xl text-white text-sm placeholder-white/20 outline-none focus:border-cyan-400/50 transition-all"
                    />
                  </div>
                  {fieldErrors.confirmPassword && <p className="text-red-400 text-[11px] mt-1.5">{fieldErrors.confirmPassword}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="agreeTerms"
                    checked={registerData.agreeToTerms}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                    className="w-4 h-4 rounded border-white/[0.1] bg-white/[0.02] text-cyan-500 focus:ring-cyan-500"
                  />
                  <label htmlFor="agreeTerms" className="text-white/40 text-xs cursor-pointer">
                    I agree to the{' '}
                    <Link to="/terms" className="text-cyan-400 hover:text-cyan-300">Terms of Service</Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</Link>
                  </label>
                </div>
                {fieldErrors.agreeToTerms && <p className="text-red-400 text-[11px]">{fieldErrors.agreeToTerms}</p>}

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-2xl font-semibold text-base transition-all flex items-center justify-center gap-2 ${
                    isLoading
                      ? 'bg-white/[0.05] text-white/30 cursor-not-allowed'
                      : `bg-gradient-to-r ${roleConfig[registerData.role].gradient} text-white shadow-lg`
                  }`}
                >
                  {isLoading ? (
                    <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Creating Account...</>
                  ) : (
                    <>Create Account <UserPlus className="w-5 h-5" /></>
                  )}
                </motion.button>
              </form>
            )}

            {/* Toggle between Login/Register */}
            <div className="text-center mt-6 pt-4 border-t border-white/[0.04]">
              <p className="text-white/30 text-sm">
                {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError('');
                    setFieldErrors({});
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors inline-flex items-center gap-1 group"
                >
                  {isRegistering ? 'Sign In' : 'Create Account'}
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
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