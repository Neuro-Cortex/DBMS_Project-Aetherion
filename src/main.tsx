// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from 'src/app'; // ←注意: App (capital A) should be here
import './styles/globals.css';

// Remove BrowserRouter from here because it's already in App.tsx
// Remove AuthProvider because you're using Redux for auth

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);