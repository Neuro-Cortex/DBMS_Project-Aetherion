import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';







import authReducer from './slices/authSlice';
// Client/Patient Profile & Appointments
import clientReducer from './slices/clientSlice';

// Doctor Profile, Schedule, Patients
import doctorReducer from './slices/DoctorSlice';

// Hospital Profile, Beds, ICU, Blood Bank
import hospitalReducer from './slices/hospitalSlice';

// Appointment Booking & Management
import appointmentReducer from './slices/DoctorSlice';

// Emergency SOS, Ambulance, Blood Request
import emergencyReducer from './slices/DoctorSlice';

// Pharmacy Medicines, Orders, Stock
import pharmacyReducer from './slices/pharmacySlice';

// Admin Dashboard, User Management, Verifications
import adminReducer from './slices/adminSlice';

// UI State - Dark Mode, Sidebar, Language
import uiReducer from './slices/uiSlice';



































const rootReducer = combineReducers({

  // Authentication state (user, roles, token)
  auth: authReducer,

  // Client profile & appointments
  client: clientReducer,

  // Doctor data (profile, patients, earnings)
  doctor: doctorReducer,

  // Hospital data (beds, ICU, blood, staff)
  hospital: hospitalReducer,

  // Appointment bookings & schedule
  appointment: appointmentReducer,

  // Emergency requests & SOS alerts
  emergency: emergencyReducer,

  // Pharmacy inventory & orders
  pharmacy: pharmacyReducer,

  // Admin panel (verifications, users, reports)
  admin: adminReducer,

  // UI preferences (theme, language, sidebar)
  ui: uiReducer,
});































const legacyPersistConfig = {

  // Key for localStorage
  key: 'aetherion-hms',

  // Schema version (increment when structure changes)
  version: 1,

  // Use localStorage as storage engine
  storage: 'localStorage',

  // ✅ PERSIST these slices (data survives page refresh)
  whitelist: [
    'auth',  // Keep user logged in
    'ui',    // Keep theme & language preferences
  ],

  // ❌ DO NOT PERSIST these slices (fresh data each session)
  blacklist: [
    'client',
    'doctor',
    'hospital',
    'appointment',
    'emergency',
    'pharmacy',
    'admin',
  ],
};



























// Redux-persist is intentionally not wired here because it is not installed in
// this workspace. The legacy config above documents the intended persisted
// slices without making the app depend on a missing package.

// ============================================
// STORE CONFIGURATION
// ============================================

export const store = configureStore({

  reducer: rootReducer,

  // Custom middleware configuration
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({

      serializableCheck: false,
    }),

  // Enable Redux DevTools only in development
  devTools: process.env.NODE_ENV !== 'production',
});





export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;




export const useAppDispatch = (): AppDispatch => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


export default store;

