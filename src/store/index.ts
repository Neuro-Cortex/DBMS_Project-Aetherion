import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// ============================================
// SLICE IMPORTS
// ============================================
import authReducer from '../components/slices/slices/authSlice';
import doctorReducer from '../components/slices/slices/doctorSlice';
import hospitalReducer from '../components/slices/slices/hospitalSlice';
import appointmentReducer from '../components/slices/slices/appointmentSlice';
import emergencyReducer from '../components/slices/slices/emergencySlice';

// ============================================
// ROOT REDUCER
// ============================================
const rootReducer = combineReducers({
  auth: authReducer,
  doctor: doctorReducer,
  hospital: hospitalReducer,
  appointment: appointmentReducer,
  emergency: emergencyReducer,
});

// ============================================
// PERSIST CONFIG
// ============================================
const persistConfig = {
  key: 'medicare-hms',
  version: 1,
  storage,
  whitelist: ['auth'], // Only persist auth slice
  blacklist: ['doctor', 'hospital', 'appointment', 'emergency'],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ============================================
// STORE
// ============================================
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.DEV,
});

// ============================================
// PERSISTOR
// ============================================
export const persistor = persistStore(store);

// ============================================
// TYPES
// ============================================
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// ============================================
// TYPED HOOKS (use these in components)
// ============================================
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// ============================================
// EXPORT DEFAULT
// ============================================
export default store;