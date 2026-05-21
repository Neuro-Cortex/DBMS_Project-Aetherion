// ============================================
// src/main.tsx
// Aetherion Health - Entry Point
// ============================================

import React, { Suspense, lazy } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './store/store';

// Styles
import './styles/globals.css';

// Lazy Load App
const App = lazy(() => import('./app'));

// Loading Fallback
const LoadingFallback: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-cyan-400 text-lg">⚕️</span>
          </div>
        </div>
        <p className="text-white/60 text-sm">Loading Aetherion Health...</p>
      </div>
    </div>
  );
};

// ============================================
// RENDER
// ============================================

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found!');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <App />
        </Suspense>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '12px',
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
