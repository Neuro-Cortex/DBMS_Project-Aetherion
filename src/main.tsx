// ============================================
// src/main.tsx
// ============================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import App from './app';
import { store } from './store';

import './styles/globals.css';

// ============================================
// LOADING FALLBACK COMPONENT
// ============================================

const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center">
      <div className="text-center">

        {/* Animated Loader */}
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />

          <div
            className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-400 animate-spin"
            style={{
              animationDirection: 'reverse',
              animationDuration: '0.8s',
            }}
          />
        </div>

        {/* Loading Text */}
        <p className="text-sm font-medium text-white/60 tracking-wide">
          Loading Aetherion Health...
        </p>

      </div>
    </div>
  );
};

// ============================================
// ROOT ELEMENT CHECK
// ============================================

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element with id "root" not found.');
}

// ============================================
// CREATE ROOT
// ============================================

const root = ReactDOM.createRoot(rootElement);

// ============================================
// RENDER APPLICATION
// ============================================

root.render(
  <React.StrictMode>

    {/* Redux Store Provider */}
    <Provider store={store}>

      {/* React Router */}
      <BrowserRouter>

          {/* Main App */}
          <App />

          {/* Global Toast Notifications */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={12}
            containerStyle={{
              top: 20,
              right: 20,
            }}
            toastOptions={{
              duration: 3000,

              style: {
                background: '#111827',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '14px 16px',
                borderRadius: '14px',
                fontSize: '14px',
              },

              success: {
                duration: 2500,
              },

              error: {
                duration: 4000,
              },
            }}
          />

      </BrowserRouter>

    </Provider>

  </React.StrictMode>
);
