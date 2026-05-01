import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store';
import App from './App';

// ============================================
// GLOBAL STYLES
// ============================================
import '@/styles/globals.css';

// ============================================
// LOADING FALLBACK COMPONENT
// ============================================
const LoadingFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="text-center">
      <div className="relative w-16 h-16 mx-auto mb-4">
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
        <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-purple-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      <p className="text-white/60 text-sm font-medium">Loading MediCare...</p>
    </div>
  </div>
);

// ============================================
// RENDER APP
// ============================================
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={<LoadingFallback />} persistor={persistor}>
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);

