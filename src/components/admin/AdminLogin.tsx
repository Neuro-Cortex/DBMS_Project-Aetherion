// src/components/admin/AdminLogin.tsx

import React, { useState, useEffect } from 'react';
import {
  Shield, Eye, EyeOff, Lock, Mail, User,
  AlertCircle, CheckCircle, ArrowRight,
  Fingerprint, Smartphone, Key, LogIn,
  Moon, Sun, Globe
} from 'lucide-react';

interface AdminLoginProps {
  onLogin?: (credentials: AdminCredentials) => void;
  onForgotPassword?: () => void;
}

interface AdminCredentials {
  username: string;
  password: string;
  twoFactorCode?: string;
  rememberMe?: boolean;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLogin = () => {},
  onForgotPassword = () => {}
}) => {
  const [credentials, setCredentials] = useState<AdminCredentials>({
    username: '',
    password: '',
    twoFactorCode: '',
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'login' | '2fa'>('login');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [capsLockOn, setCapsLockOn] = useState(false);

  // Lock timer countdown
  useEffect(() => {
    if (isLocked && lockTimer > 0) {
      const timer = setInterval(() => {
        setLockTimer(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    return undefined;
  }, [isLocked, lockTimer]);

  // Check Caps Lock
  const handleKeyPress = (e: React.KeyboardEvent) => {
    setCapsLockOn(e.getModifierState('CapsLock'));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check if locked
    if (isLocked) {
      setError(`Account temporarily locked. Please wait ${lockTimer} seconds.`);
      return;
    }

    // Validate
    if (!credentials.username.trim()) {
      setError('Username is required');
      return;
    }
    if (!credentials.password) {
      setError('Password is required');
      return;
    }
    if (credentials.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // If 2FA is enabled, show 2FA step
      if (step === 'login') {
        setStep('2fa');
        setIsLoading(false);
        return;
      }

      // Validate 2FA code
      if (step === '2fa' && (!credentials.twoFactorCode || credentials.twoFactorCode.length !== 6)) {
        setError('Please enter a valid 6-digit code');
        setIsLoading(false);
        return;
      }

      // Successful login
      onLogin(credentials);
      
    } catch (err: any) {
      setFailedAttempts(prev => {
        const newAttempts = prev + 1;
        // Lock after 5 failed attempts
        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockTimer(300); // 5 minutes lock
          setError('Too many failed attempts. Account locked for 5 minutes.');
        }
        return newAttempts;
      });
      setError(err.message || 'Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setStep('login');
    setCredentials({ ...credentials, twoFactorCode: '' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center p-4 relative">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
        </div>
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }}></div>

      {/* Login Container */}
      <div className="relative w-full max-w-md">
        {/* Logo & Header Section */}
        <div className="text-center mb-8">
          {/* Logo with Animation */}
          <div className="relative inline-flex items-center justify-center mb-6">
            <div className="absolute inset-0 bg-blue-500 rounded-2xl animate-ping opacity-20"></div>
            <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-2xl transform hover:scale-105 transition-transform">
              <Shield className="w-10 h-10 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
            Admin Portal
          </h1>
          <p className="text-blue-300 text-sm">
            Secure administrative access
          </p>
          
          {/* Status Indicator */}
          <div className="flex items-center justify-center mt-3 space-x-2">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
              <span className="text-xs text-green-400">System Online</span>
            </div>
            <span className="text-gray-600">|</span>
            <div className="flex items-center">
              <Lock className="w-3 h-3 text-blue-400 mr-1" />
              <span className="text-xs text-blue-400">SSL Encrypted</span>
            </div>
          </div>
        </div>

        {/* Login Form Card */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step === 'login' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'bg-green-600 text-white'
                }`}>
                  {step === '2fa' ? <CheckCircle className="w-5 h-5" /> : '1'}
                </div>
                <span className="text-xs text-blue-300 mt-1">Login</span>
              </div>
              
              {/* Connector */}
              <div className={`w-16 h-1 mx-2 transition-all duration-300 ${
                step === '2fa' ? 'bg-green-600' : 'bg-gray-600'
              }`}></div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                  step === '2fa' 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'bg-gray-600 text-gray-400'
                }`}>
                  2
                </div>
                <span className="text-xs text-blue-300 mt-1">2FA Verify</span>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl backdrop-blur-sm animate-shake">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-200">{error}</p>
                  {isLocked && (
                    <p className="text-xs text-red-300 mt-1">
                      Time remaining: {Math.floor(lockTimer / 60)}:{(lockTimer % 60).toString().padStart(2, '0')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Caps Lock Warning */}
          {capsLockOn && (
            <div className="mb-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-yellow-400" />
              <p className="text-xs text-yellow-200">Caps Lock is ON</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {step === 'login' ? (
              <>
                {/* Username Field */}
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Username or Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-blue-400 group-focus-within:text-blue-300 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={credentials.username}
                      onChange={(e) => {
                        setCredentials({ ...credentials, username: e.target.value });
                        setError('');
                      }}
                      onKeyUp={handleKeyPress}
                      className="block w-full pl-10 pr-3 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/10 transition-all duration-200"
                      placeholder="Enter your username or email"
                      autoComplete="username"
                      disabled={isLocked}
                      autoFocus
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    Password
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-400 group-focus-within:text-blue-300 transition-colors" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={credentials.password}
                      onChange={(e) => {
                        setCredentials({ ...credentials, password: e.target.value });
                        setError('');
                      }}
                      onKeyUp={handleKeyPress}
                      className="block w-full pl-10 pr-12 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/10 transition-all duration-200"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      disabled={isLocked}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-blue-400 hover:text-white transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-blue-400 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={credentials.rememberMe}
                      onChange={(e) => setCredentials({ ...credentials, rememberMe: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-600 bg-white/5 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                    />
                    <span className="text-sm text-blue-200 group-hover:text-blue-100 transition-colors">
                      Remember me
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={onForgotPassword}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Two-Factor Authentication */}
                <div>
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500/20 rounded-full mb-4">
                      <Smartphone className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Two-Factor Authentication
                    </h3>
                    <p className="text-sm text-blue-300 mt-2">
                      Enter the 6-digit code from your authenticator app
                    </p>
                  </div>
                  
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Key className="h-5 w-5 text-blue-400 group-focus-within:text-blue-300 transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={credentials.twoFactorCode}
                      onChange={(e) => {
                        const code = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setCredentials({ ...credentials, twoFactorCode: code });
                        setError('');
                      }}
                      className="block w-full pl-10 pr-3 py-3.5 bg-white/5 border border-white/20 rounded-xl text-white text-center text-2xl tracking-[0.5em] placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white/10 transition-all duration-200 font-mono"
                      placeholder="000000"
                      maxLength={6}
                      pattern="\d{6}"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      disabled={isLocked}
                      autoFocus
                    />
                  </div>
                  
                  <div className="mt-4 text-center space-y-2">
                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      ← Back to login
                    </button>
                    <p className="text-xs text-gray-500">
                      Didn't receive code? <button type="button" className="text-blue-400 hover:text-blue-300">Resend</button>
                    </p>
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full flex items-center justify-center px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-600/20 hover:shadow-blue-600/40 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/30 border-t-white mr-3"></div>
                  {step === 'login' ? 'Authenticating...' : 'Verifying...'}
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  {step === 'login' ? 'Sign In' : 'Verify & Sign In'}
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-transparent text-gray-500">
                or continue with
              </span>
            </div>
          </div>

          {/* Alternative Login Methods */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2.5 border border-white/20 rounded-xl text-sm text-blue-300 hover:bg-white/5 transition-colors"
            >
              <Fingerprint className="w-4 h-4 mr-2" />
              Biometric
            </button>
            <button
              type="button"
              className="flex items-center justify-center px-4 py-2.5 border border-white/20 rounded-xl text-sm text-blue-300 hover:bg-white/5 transition-colors"
            >
              <Smartphone className="w-4 h-4 mr-2" />
              Mobile Key
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center space-y-2">
          <div className="inline-flex items-center space-x-2 text-blue-300 text-sm">
            <Shield className="w-4 h-4" />
            <span>Secured with 256-bit encryption</span>
          </div>
          <p className="text-blue-400/60 text-xs">
            Authorized personnel only • All activities are monitored and logged
          </p>
          <p className="text-blue-400/40 text-xs">
            © 2024 Healthcare Management System v2.1.0
          </p>
        </div>
      </div>

      {/* Add custom animation */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;