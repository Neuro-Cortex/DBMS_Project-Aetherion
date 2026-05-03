// src/pages/Login.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, Mail, Lock, ArrowRight, Fingerprint, Building2,
  Sparkles, Shield, CheckCircle, AlertCircle, ChevronRight,
  Github, Twitter, Chrome
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';

// ============================================
// LOGIN PAGE
// ============================================
const Login: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeField, setActiveField] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsLoading(false);
    navigate('/dashboard');
  };

  const inputClasses = (field: string) => `
    w-full pl-12 pr-4 py-4 bg-white/[0.03] border rounded-2xl text-white text-sm
    placeholder-white/20 outline-none transition-all duration-300
    ${activeField === field ? 'border-cyan-400/50 bg-white/[0.05] shadow-[0_0_20px_rgba(6,182,212,0.1)]' : 'border-white/[0.06] hover:border-white/[0.1]'}
  `;

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* ============================================ */}
      {/* BACKGROUND */}
      {/* ============================================ */}
      <div className="absolute inset-0">
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }} />
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/[0.03] rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/[0.02] rounded-full blur-3xl" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/20 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2 }}
          />
        ))}
      </div>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Logo + Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl shadow-2xl shadow-indigo-500/20 mb-6"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-[-0.02em] mb-2">
            Welcome Back
          </h1>
          <p className="text-white/35 text-sm">
            Sign in to access your healthcare dashboard
          </p>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassmorphicCard variant="frosted" padding="lg" rounded="3xl" hover="none">

            
            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400 text-xs"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Email */}
              <div>
                <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${activeField === 'email' ? 'text-cyan-400' : 'text-white/20'}`} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setActiveField('email')}
                    onBlur={() => setActiveField(null)}
                    placeholder="Enter your email"
                    className={inputClasses('email')}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-cyan-400 text-[10px] font-medium hover:text-cyan-300 transition-colors">
                    Forgot?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${activeField === 'password' ? 'text-cyan-400' : 'text-white/20'}`} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setActiveField('password')}
                    onBlur={() => setActiveField(null)}
                    placeholder="Enter your password"
                    className={inputClasses('password')}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-white/30 hover:text-white/60" />
                    ) : (
                      <Eye className="w-4 h-4 text-white/30 hover:text-white/60" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded-md border-white/15 bg-white/[0.03] text-indigo-500 focus:ring-indigo-500/30 cursor-pointer"
                />
                <span className="text-white/40 text-xs group-hover:text-white/60 transition-colors">
                  Remember me for 30 days
                </span>
              </label>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full py-4 text-base font-semibold gap-2"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Sign In <ArrowRight className="w-5 h-5" />
                  </span>
                )}
              </Button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/[0.06]" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-[#0a0a10] text-white/20 text-xs font-medium tracking-wider">
                    OR CONTINUE WITH
                  </span>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Chrome, label: 'Google' },
                  { icon: Github, label: 'GitHub' },
                  { icon: Twitter, label: 'Twitter' },
                ].map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.button
                      key={social.label}
                      type="button"
                      whileHover={{ scale: 1.03, y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all"
                    >
                      <Icon className="w-5 h-5 text-white/50" />
                      <span className="text-white/40 text-xs font-medium hidden sm:inline">{social.label}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Biometric */}
              <motion.button
                type="button"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all mt-3"
              >
                <Fingerprint className="w-5 h-5 text-cyan-400" />
                <span className="text-white/50 text-sm font-medium">Sign in with Biometrics</span>
              </motion.button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center mt-8 text-white/30 text-sm">
              Don't have an account?{' '}
              <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                Create Account <ChevronRight className="w-3.5 h-3.5 inline" />
              </Link>
            </p>
          </GlassmorphicCard>
        </motion.div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-white/15 text-xs"
        >
          <Shield className="w-3 h-3 inline mr-1" />
          HIPAA Compliant • 256-bit Encrypted • Secure Login
        </motion.p>
      </div>
    </div>
  );
};

export default Login;