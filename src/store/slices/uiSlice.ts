// src/store/slices/uiSlice.ts
// UI STATE - Dark Mode, Sidebar, Notifications

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UIState {
  darkMode: boolean;
  sidebarExpanded: boolean;
  sidebarOpen: boolean;
  notifications: number;
  language: string;
  fontSize: 'small' | 'medium' | 'large';
}

const initialState: UIState = {
  darkMode: localStorage.getItem('darkMode') === 'true',
  sidebarExpanded: true,
  sidebarOpen: false,
  notifications: 0,
  language: localStorage.getItem('language') || 'en',
  fontSize: 'medium',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('darkMode', state.darkMode.toString());
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    toggleSidebar: (state) => {
      state.sidebarExpanded = !state.sidebarExpanded;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    setNotifications: (state, action: PayloadAction<number>) => {
      state.notifications = action.payload;
    },
    incrementNotifications: (state) => {
      state.notifications += 1;
    },
    clearNotifications: (state) => {
      state.notifications = 0;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
      localStorage.setItem('language', action.payload);
    },
    setFontSize: (state, action: PayloadAction<'small' | 'medium' | 'large'>) => {
      state.fontSize = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  toggleSidebar,
  setSidebarOpen,
  setNotifications,
  incrementNotifications,
  clearNotifications,
  setLanguage,
  setFontSize,
} = uiSlice.actions;

export default uiSlice.reducer;