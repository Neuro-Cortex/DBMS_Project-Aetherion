// src/pages/auth/ForgotPassword.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import {
  Mail, ArrowRight, Sparkles, Shield, AlertCircle,
  Heart, ChevronLeft, CheckCircle2, Send, Lock,
  Eye, EyeOff, RefreshCw, Clock, ArrowLeft
} from 'lucide-react';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const resetSchema = z.object({
  code: z.string().min(6, 'Code must be 6 characters').max(6, 'Code must be 6 characters'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'code' | 'success'>('email');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();

  const emailForm = useForm({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const resetForm = useForm({
    resolver: zodResolver(resetSchema),
    defaultValues: { code: '', newPassword: '', confirmPassword: '' },
  });

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSendCode = async (data: { email: string }) => {
    setError('');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Verification code sent to your email!');
      setStep('code');
      startCountdown();
    } catch (err) {
      setError('Failed to send code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (data: any) => {
    setError('');
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Password reset successful!');
      setStep('success');
    } catch (err) {
      setError('Invalid code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (countdown > 0) return;
    const email = emailForm.getValues('email');
    if (email) {
      await handleSendCode({ email });
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#050508] via-[#08080d] to-[#050508]" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
        backgroundSize: '60px 60px',
      }} />
      
      <motion.div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-cyan-500/[0.04] blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute -bottom-40 -left-40 w-[400px] h-[400px] rounded-full bg-purple-500/[0.04] blur-3xl"
        animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.5, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 2 }} />

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="inline-flex items-center justify-center w-20 h-20 mb-6">
            <div className="w-full h-full bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-500 rounded-3xl shadow-2xl shadow-indigo-500/30 flex items-center justify-center">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-white">
            {step === 'success' ? 'Password Reset!' : 'Reset Password'}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {step === 'email' && "Enter your email to receive a reset code"}
            {step === 'code' && "Enter the 6-digit code sent to your email"}
            {step === 'success' && "Your password has been successfully reset"}
          </p>
        </motion.div>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="relative p-8 rounded-3xl bg-white/[0.02] backdrop-blur-2xl border border-white/[0.06] shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.02] via-transparent to-purple-500/[0.02] pointer-events-none" />
          
          <div className="relative z-10">
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <span className="text-red-400 text-xs">{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              {/* Step 1: Email */}
              {step === 'email' && (
                <motion.div key="email" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                  <form onSubmit={emailForm.handleSubmit(handleSendCode)} className="space-y-6">
                    <div>
                      <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                        <Mail className="w-3 h-3 inline mr-1" /> Email Address
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                        <input type="email" {...emailForm.register('email')}
                          placeholder="Enter your registered email"
                          className={`w-full pl-12 pr-4 py-4 bg-white/[0.03] border rounded-2xl text-white text-sm placeholder-white/20 outline-none transition-all ${
                            emailForm.formState.errors.email ? 'border-red-500/50' : 'border-white/[0.06] hover:border-white/[0.1] focus:border-cyan-400/50'
                          }`} />
                      </div>
                      {emailForm.formState.errors.email && (
                        <p className="text-red-400 text-[11px] mt-1.5 ml-1">{emailForm.formState.errors.email.message}</p>
                      )}
                    </div>

                    <motion.button type="submit" disabled={isLoading}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                        isLoading ? 'bg-white/[0.05] text-white/30 cursor-not-allowed'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                      }`}>
                      {isLoading ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> Sending Code...</>
                      ) : (
                        <>Send Reset Code <Send className="w-4 h-4" /></>
                      )}
                    </motion.button>
                  </form>
                </motion.div>
              )}

              {/* Step 2: Verification Code */}
              {step === 'code' && (
                <motion.div key="code" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <form onSubmit={resetForm.handleSubmit(handleResetPassword)} className="space-y-6">
                    <div>
                      <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                        Verification Code
                      </label>
                      <input type="text" {...resetForm.register('code')} maxLength={6}
                        placeholder="Enter 6-digit code"
                        className={`w-full px-4 py-4 bg-white/[0.03] border rounded-2xl text-white text-center text-2xl tracking-[0.5em] font-bold placeholder-white/10 outline-none transition-all ${
                          resetForm.formState.errors.code ? 'border-red-500/50' : 'border-white/[0.06] hover:border-white/[0.1] focus:border-cyan-400/50'
                        }`} />
                      {resetForm.formState.errors.code && (
                        <p className="text-red-400 text-[11px] mt-1.5 ml-1">{resetForm.formState.errors.code.message}</p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">New Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                          <input type={showPassword ? 'text' : 'password'} {...resetForm.register('newPassword')}
                            placeholder="Min. 8 characters"
                            className={`w-full pl-12 pr-12 py-4 bg-white/[0.03] border rounded-2xl text-white text-sm placeholder-white/20 outline-none transition-all ${
                              resetForm.formState.errors.newPassword ? 'border-red-500/50' : 'border-white/[0.06] hover:border-white/[0.1] focus:border-cyan-400/50'
                            }`} />
                          <button type="button" onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5">
                            {showPassword ? <EyeOff className="w-4 h-4 text-white/30" /> : <Eye className="w-4 h-4 text-white/30" />}
                          </button>
                        </div>
                        {resetForm.formState.errors.newPassword && (
                          <p className="text-red-400 text-[11px] mt-1.5">{resetForm.formState.errors.newPassword.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">Confirm Password</label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                          <input type="password" {...resetForm.register('confirmPassword')}
                            placeholder="Re-enter password"
                            className={`w-full pl-12 pr-4 py-4 bg-white/[0.03] border rounded-2xl text-white text-sm placeholder-white/20 outline-none transition-all ${
                              resetForm.formState.errors.confirmPassword ? 'border-red-500/50' : 'border-white/[0.06] hover:border-white/[0.1] focus:border-cyan-400/50'
                            }`} />
                        </div>
                        {resetForm.formState.errors.confirmPassword && (
                          <p className="text-red-400 text-[11px] mt-1.5">{resetForm.formState.errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>

                    <motion.button type="submit" disabled={isLoading}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                      className={`w-full py-4 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                        isLoading ? 'bg-white/[0.05] text-white/30 cursor-not-allowed'
                          : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40'
                      }`}>
                      {isLoading ? (
                        <><RefreshCw className="w-4 h-4 animate-spin" /> Resetting...</>
                      ) : (
                        <>Reset Password <ArrowRight className="w-4 h-4" /></>
                      )}
                    </motion.button>

                    {/* Resend Code */}
                    <div className="text-center">
                      <p className="text-white/30 text-xs mb-2">Didn't receive the code?</p>
                      <button type="button" onClick={handleResendCode} disabled={countdown > 0}
                        className={`text-sm font-medium transition-all ${
                          countdown > 0 ? 'text-white/20 cursor-not-allowed' : 'text-cyan-400 hover:text-cyan-300'
                        }`}>
                        {countdown > 0 ? (
                          <span className="flex items-center justify-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Resend in {countdown}s
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-1">
                            <RefreshCw className="w-3.5 h-3.5" /> Resend Code
                          </span>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* Step 3: Success */}
              {step === 'success' && (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                  className="text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }}
                    className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                  <h3 className="text-white font-semibold text-xl mb-2">Password Reset Successful!</h3>
                  <p className="text-white/40 text-sm mb-8">Your password has been changed. You can now login with your new password.</p>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    onClick={() => navigate('/login')}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2">
                    Go to Login <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Back to Login */}
        {step !== 'success' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-center mt-6">
            <Link to="/login"
              className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-sm transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </Link>
          </motion.div>
        )}

        {/* Footer */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
          className="text-center mt-6 text-white/15 text-xs">
          <Shield className="w-3 h-3 inline mr-1" />
          Secure Password Reset • HIPAA Compliant
        </motion.p>
      </div>
    </div>
  );
};

export default ForgotPassword;