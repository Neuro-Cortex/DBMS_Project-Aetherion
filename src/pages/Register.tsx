// src/pages/Register.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, Phone, Eye, EyeOff,
  CheckCircle, ArrowRight, Sparkles, Shield, ChevronRight,
  Stethoscope, Building2, Pill, Droplets, UserCog, Heart
} from 'lucide-react';

// ============================================
// TYPES
// ============================================
type UserRole = 'patient' | 'doctor' | 'hospital' | 'pharmacy' | 'blood-donor' | 'admin';

interface RoleOption {
  role: UserRole;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  desc: string;
  emoji: string;
}

// ============================================
// ROLE OPTIONS
// ============================================
const roleOptions: RoleOption[] = [
  { role: 'patient', label: 'Patient / Client', icon: User, color: 'from-blue-500 to-cyan-500', desc: 'Book appointments, health records', emoji: '👤' },
  { role: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'from-emerald-500 to-teal-500', desc: 'Manage patients, prescriptions', emoji: '🩺' },
  { role: 'hospital', label: 'Hospital Authority', icon: Building2, color: 'from-purple-500 to-violet-500', desc: 'Bed management, ICU tracking', emoji: '🏥' },
  { role: 'pharmacy', label: 'Pharmacy', icon: Pill, color: 'from-amber-500 to-orange-500', desc: 'Medicine stock, orders', emoji: '💊' },
  { role: 'blood-donor', label: 'Blood Donor', icon: Droplets, color: 'from-red-500 to-rose-500', desc: 'Donation history, requests', emoji: '🩸' },
  { role: 'admin', label: 'Admin', icon: Shield, color: 'from-slate-500 to-gray-500', desc: 'User management, analytics', emoji: '🛡️' },
];

// ============================================
// REGISTER PAGE
// ============================================
const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'patient' as UserRole
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all required fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    
    // Route based on role
    const dashboardRoutes: Record<UserRole, string> = {
      'patient': '/client/dashboard',
      'doctor': '/doctor/dashboard',
      'hospital': '/hospital/dashboard',
      'pharmacy': '/pharmacy/dashboard',
      'blood-donor': '/client/dashboard',
      'admin': '/admin/dashboard',
    };
    
    navigate(dashboardRoutes[formData.role]);
  };

  const inputClasses = (field: string) => `
    w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-white text-sm
    placeholder-white/20 outline-none transition-all duration-300
    ${activeField === field ? 'border-cyan-400/50 bg-white/[0.05] shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-white/[0.06] hover:border-white/[0.1]'}
  `;

  const inputs = [
    { name: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Enter your full name' },
    { name: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'your@email.com' },
    { name: 'phone', label: 'Phone Number', icon: Phone, type: 'tel', placeholder: '+1 (555) 000-0000' },
    { name: 'password', label: 'Password', icon: Lock, type: showPassword ? 'text' : 'password', placeholder: 'Create a strong password' },
    { name: 'confirmPassword', label: 'Confirm Password', icon: CheckCircle, type: showPassword ? 'text' : 'password', placeholder: 'Confirm your password' },
  ];

  const selectedRoleData = roleOptions.find(r => r.role === formData.role);

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/[0.02] rounded-full blur-3xl" />
      </div>

      {/* FLOATING PARTICLES */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div key={i} className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2 }} />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg">
        
        {/* LOGO + HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-8">
          <motion.div whileHover={{ scale: 1.05, rotate: 5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl shadow-2xl shadow-indigo-500/20 mb-5">
            <Heart className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-[-0.02em] mb-2">Create Account</h1>
          <p className="text-white/35 text-sm">Join Aetherion Health today</p>
        </motion.div>

        {/* FORM */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <div className="relative p-6 sm:p-8 rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.06] shadow-2xl shadow-black/20 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] via-transparent to-purple-500/[0.02] pointer-events-none" />
            
            <div className="relative z-10">
              {/* Error */}
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                  <Shield className="w-4 h-4 shrink-0" />{error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* ============================================ */}
                {/* ROLE SELECTION - 6 ROLES (UPDATED!) */}
                {/* ============================================ */}
                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3 block">
                    Select Your Role
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {roleOptions.map((role) => {
                      const Icon = role.icon;
                      const isSelected = formData.role === role.role;
                      return (
                        <motion.button
                          key={role.role}
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setFormData(prev => ({ ...prev, role: role.role }))}
                          className={`relative p-3 rounded-xl border transition-all duration-300 text-left ${
                            isSelected
                              ? `bg-gradient-to-br ${role.color} border-transparent shadow-lg`
                              : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.12] hover:bg-white/[0.04]'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-white/40'}`} />
                            <span className={`text-[11px] font-semibold ${isSelected ? 'text-white' : 'text-white/60'}`}>
                              {role.label}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                  
                  {/* Selected Role Indicator */}
                  {selectedRoleData && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-3 p-3 rounded-xl bg-gradient-to-r ${selectedRoleData.color} flex items-center gap-3`}
                    >
                      <span className="text-2xl">{selectedRoleData.emoji}</span>
                      <div>
                        <p className="text-white text-sm font-semibold">{selectedRoleData.label}</p>
                        <p className="text-white/60 text-[11px]">{selectedRoleData.desc}</p>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Input Fields */}
                {inputs.map((input) => {
                  const Icon = input.icon;
                  return (
                    <div key={input.name}>
                      <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1.5 block">
                        {input.label}
                      </label>
                      <div className="relative">
                        <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${activeField === input.name ? 'text-cyan-400' : 'text-white/20'}`} />
                        <input
                          name={input.name}
                          type={input.type}
                          value={formData[input.name as keyof typeof formData]}
                          onChange={handleChange}
                          onFocus={() => setActiveField(input.name)}
                          onBlur={() => setActiveField(null)}
                          placeholder={input.placeholder}
                          className={inputClasses(input.name)}
                          required={['name', 'email', 'password', 'confirmPassword'].includes(input.name)}
                        />
                        {input.name === 'password' && (
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors">
                            {showPassword ? <EyeOff className="w-4 h-4 text-white/30" /> : <Eye className="w-4 h-4 text-white/30" />}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* Terms */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" required className="w-4 h-4 rounded-md border-white/15 bg-white/[0.03] text-indigo-500 focus:ring-indigo-500/30 cursor-pointer" />
                  <span className="text-white/40 text-xs group-hover:text-white/60 transition-colors">
                    I agree to the{' '}
                    <Link to="/terms" className="text-cyan-400 hover:text-cyan-300">Terms</Link> &{' '}
                    <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</Link>
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
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Creating account...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">Create Account <ArrowRight className="w-5 h-5" /></span>
                  )}
                </motion.button>
              </form>

              {/* Login Link */}
              <p className="text-center mt-6 text-white/30 text-sm">
                Already have an account?{' '}
                <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                  Sign in <ChevronRight className="w-3.5 h-3.5 inline" />
                </Link>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="text-center mt-6 text-white/15 text-xs">
          <Shield className="w-3 h-3 inline mr-1" />HIPAA Compliant • Your data is secure
        </motion.p>
      </div>
    </div>
  );
};

export default Register;