// src/hooks/index.ts

// ==============================
// Hooks Exports
// ==============================

export { useDebounce } from './useDebounce';
export { useLocalStorage } from './useLocalStorage';
export {
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
} from './useMediaQuery';

export { useAuth } from './useAuth';
export { useDoctor } from './useDoctor';
export { useAppointment } from './useAppointment';
export { useEmergency } from './useEmergency';
export { useHospital } from './useHospital';
export { useAIAssistant } from './useAIAssistant';

// ==============================
// Type Exports
// ==============================

export type { UseAuthReturn } from './useAuth';
export type { UseDoctorReturn } from './useDoctor';
export type { UseHospitalReturn } from './useHospital';
export type { UseEmergencyReturn } from './useEmergency';