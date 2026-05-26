// src/store/index.ts
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// ============================================
// SLICES
// ============================================
import authReducer from "./slices/authSlice";
import clientReducer from "./slices/clientSlice";
import doctorReducer from "./slices/DoctorSlice";
import hospitalReducer from "./slices/hospitalSlice";
import appointmentReducer from "./slices/appointmentSlice";
import emergencyReducer from "./slices/emergencySlice";
import pharmacyReducer from "./slices/pharmacySlice";
import adminReducer from "./slices/adminSlice";
import uiReducer from "./slices/uiSlice";

// ============================================
// PERSIST CONFIG
// ============================================
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["client", "doctor", "hospital", "appointment", "emergency", "pharmacy", "admin", "ui"],
};

// ============================================
// ROOT REDUCER
// ============================================
const rootReducer = combineReducers({
  auth: authReducer,
  client: clientReducer,
  doctor: doctorReducer,
  hospital: hospitalReducer,
  appointment: appointmentReducer,
  emergency: emergencyReducer,
  pharmacy: pharmacyReducer,
  admin: adminReducer,
  ui: uiReducer,
});

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

export const persistor = persistStore(store);

// ============================================
// TYPES
// ============================================
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// ============================================
// HOOKS - FIXED
// ============================================
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Default export
export default store;
