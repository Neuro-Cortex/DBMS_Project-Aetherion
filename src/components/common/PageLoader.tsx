// ============================================
// src/components/common/PageLoader.tsx
// Aetherion Health - Page Loader Component
// ============================================

import React from 'react';

interface PageLoaderProps {
  message?: string;
  fullScreen?: boolean;
}

const PageLoader: React.FC<PageLoaderProps> = ({ 
  message = 'Loading...', 
  fullScreen = true 
}) => {
  return (
    <div className={`
      flex items-center justify-center
      ${fullScreen ? 'min-h-screen' : 'min-h-[200px]'}
      bg-gradient-to-br from-[#050508] to-[#0a0a14]
    `}>
      <div className="text-center">
        {/* Animated Loader */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          {/* Outer Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          
          {/* Spinning Gradient Ring */}
          <div 
            className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin"
            style={{ animationDuration: '1.2s' }}
          />
          
          {/* Reverse Spinning Ring */}
          <div
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-400 animate-spin"
            style={{
              animationDirection: 'reverse',
              animationDuration: '0.8s',
            }}
          />

          {/* Center Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg 
              className="w-6 h-6 text-cyan-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-sm font-medium bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {message}
          <span className="inline-flex ml-1">
            <span className="animate-bounce [animation-delay:-0.3s]">.</span>
            <span className="animate-bounce [animation-delay:-0.15s]">.</span>
            <span className="animate-bounce">.</span>
          </span>
        </p>
      </div>
    </div>
  );
};

export default PageLoader;