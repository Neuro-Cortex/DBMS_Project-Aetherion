import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// ============================================
// SLICES
// ============================================
import authReducer from "./slices/authSlice";
import clientReducer from "./slices/clientSlice";
import doctorReducer from "src/store/slices/DoctorSlice";
import hospitalReducer from "./slices/hospitalSlice";
import appointmentReducer from "src/store/slices/appointmentSlice";
import emergencyReducer from "src/store/emergencySlice";
import pharmacyReducer from "./slices/pharmacySlice";
import adminReducer from "./slices/adminSlice";
import uiReducer from "./slices/uiSlice";

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

// ============================================
// STORE
// ============================================
export const store = configureStore({
  reducer: rootReducer,

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),

  devTools: process.env.NODE_ENV !== "production",
});

// ============================================
// TYPES
// ============================================
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

// ============================================
// HOOKS
// ============================================
export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// Default export
export default store;