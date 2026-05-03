// src/pages/Register.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  User, Mail, Lock, Phone, Building2, Eye, EyeOff,
  CheckCircle, ArrowRight, Sparkles, Shield, ChevronRight
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';

// ============================================
// REGISTER PAGE
// ============================================
const Register: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '', role: 'patient'
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
    navigate('/dashboard');
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

      <div className="relative z-10 w-full max-w-md">
        
        {/* LOGO + HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-8">
          <motion.div whileHover={{ scale: 1.05, rotate: 5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl shadow-2xl shadow-indigo-500/20 mb-5">
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-[-0.02em] mb-2">Create Account</h1>
          <p className="text-white/35 text-sm">Join Aetherion Health today</p>
        </motion.div>

        {/* FORM */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}>
          <GlassmorphicCard variant="premium" padding="lg" rounded="3xl" hover="none">
            
            {/* Error */}
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <Shield className="w-4 h-4 shrink-0" />{error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
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

              {/* Role Selection */}
              <div>
                <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">I am a</label>
                <div className="grid grid-cols-2 gap-3">
                  {['patient', 'doctor'].map((role) => (
                    <button key={role} type="button" onClick={() => setFormData(prev => ({ ...prev, role }))}
                      className={`p-3 rounded-xl border text-sm font-medium capitalize transition-all ${
                        formData.role === role
                          ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                          : 'bg-white/[0.02] text-white/40 border-white/[0.04] hover:border-white/[0.1]'
                      }`}>
                      {role === 'patient' ? '👤 Patient' : '🩺 Doctor'} — {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" required className="w-4 h-4 rounded-md border-white/15 bg-white/[0.03] text-indigo-500 focus:ring-indigo-500/30 cursor-pointer" />
                <span className="text-white/40 text-xs group-hover:text-white/60 transition-colors">
                  I agree to the{' '}
                  <Link to="/terms" className="text-cyan-400 hover:text-cyan-300">Terms</Link> &{' '}
                  <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300">Privacy Policy</Link>
                </span>
              </label>

              {/* Submit */}
              <Button type="submit" variant="gradient" size="lg" className="w-full py-4 text-base font-semibold gap-2">
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
              </Button>
            </form>

            {/* Login Link */}
            <p className="text-center mt-6 text-white/30 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Sign in <ChevronRight className="w-3.5 h-3.5 inline" />
              </Link>
            </p>
          </GlassmorphicCard>
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