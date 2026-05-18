// src/components/common/LoadingScreen.tsx (ADVANCED VERSION)

import React, { useState, useEffect } from 'react';
import { 
  Activity, Heart, Stethoscope, Pill, 
  Syringe, Baby, Bone, Brain, Eye, 
  Smile, Wind, Shield 
} from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
  type?: 'pulse' | 'spinner' | 'heartbeat' | 'medical' | 'full';
  showProgress?: boolean;
  onComplete?: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  message = 'Loading Healthcare System...', 
  type = 'full',
  showProgress = true,
  onComplete
}) => {
  const [progress, setProgress] = useState(0);
  const [currentIcon, setCurrentIcon] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  const medicalIcons = [
    { icon: Heart, color: 'text-red-500', label: 'Cardiology' },
    { icon: Brain, color: 'text-purple-500', label: 'Neurology' },
    { icon: Wind, color: 'text-blue-500', label: 'Pulmonology' },
    { icon: Bone, color: 'text-orange-500', label: 'Orthopedics' },
    { icon: Eye, color: 'text-green-500', label: 'Ophthalmology' },
    { icon: Smile, color: 'text-yellow-500', label: 'Dentistry' },
    { icon: Baby, color: 'text-pink-500', label: 'Pediatrics' },
    { icon: Syringe, color: 'text-indigo-500', label: 'Vaccination' },
    { icon: Pill, color: 'text-teal-500', label: 'Pharmacy' },
    { icon: Stethoscope, color: 'text-cyan-500', label: 'Diagnostics' },
  ];

  const loadingMessages = [
    'Initializing system...',
    'Loading medical records...',
    'Connecting to hospital network...',
    'Syncing blood bank data...',
    'Loading pharmacy inventory...',
    'Preparing emergency services...',
    'Setting up oxygen network...',
    'Loading doctor profiles...',
    'Syncing appointments...',
    'Almost ready...'
  ];

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          onComplete?.();
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    const iconInterval = setInterval(() => {
      setCurrentIcon(prev => (prev + 1) % medicalIcons.length);
    }, 800);

    const textInterval = setInterval(() => {
      setLoadingText(loadingMessages[Math.floor(Math.random() * loadingMessages.length)]);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(iconInterval);
      clearInterval(textInterval);
    };
  }, []);

  const CurrentIcon = medicalIcons[currentIcon].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white/10 rounded-full animate-float"
            style={{
              width: `${Math.random() * 10 + 5}px`,
              height: `${Math.random() * 10 + 5}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 5}s`
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        {/* Logo Animation */}
        <div className="relative mb-8">
          {/* Outer rotating ring */}
          <div className="w-32 h-32 mx-auto relative">
            <div className="absolute inset-0 border-4 border-white/20 rounded-full animate-spin" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-2 border-4 border-transparent border-t-white/40 rounded-full animate-spin" style={{ animationDuration: '2s', animationDirection: 'reverse' }}></div>
            <div className="absolute inset-4 border-4 border-white/10 rounded-full animate-pulse"></div>
            
            {/* Center Icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CurrentIcon className={`w-12 h-12 ${medicalIcons[currentIcon].color} transition-all duration-500`} />
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
          Project Aetherion
        </h1>
        <p className="text-white/70 text-lg mb-4">
          Healthcare Management System
        </p>

        {/* Loading Text */}
        <p className="text-white/90 text-sm mb-6 animate-pulse">
          {loadingText}
        </p>

        {/* Progress Bar */}
        {showProgress && (
          <div className="max-w-xs mx-auto">
            <div className="flex justify-between text-white/70 text-xs mb-2">
              <span>{medicalIcons[currentIcon].label}</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-400 to-blue-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Medical Icons Grid */}
        <div className="mt-8 grid grid-cols-5 gap-4 max-w-md mx-auto">
          {medicalIcons.slice(0, 5).map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${
                  index === currentIcon % 5
                    ? 'bg-white/30 scale-110'
                    : 'bg-white/10 scale-90 opacity-50'
                }`}
              >
                <Icon className={`w-5 h-5 ${item.color}`} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Text */}
      <div className="absolute bottom-8 left-0 right-0 text-center">
        <p className="text-white/40 text-sm">
          © 2025 Project Aetherion • All Rights Reserved
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
          50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
        }
        .animate-float {
          animation: float linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
