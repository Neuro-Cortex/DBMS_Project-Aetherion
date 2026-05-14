// ============================================
// APP CONFIGURATION
// ============================================
export const APP_CONFIG = {
  name: 'MediCare HMS',
  version: '1.0.0',
  description: 'Hospital Management System',
  defaultLocale: 'en-US',
  currency: 'USD',
  supportEmail: 'support@medicare.com',
  supportPhone: '+1 (555) 000-0000',
} as const;

// ============================================
// API ROUTES
// ============================================
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    PROFILE: '/auth/profile',
    REFRESH: '/auth/refresh',
  },
  DOCTORS: {
    BASE: '/doctors',
    DETAIL: (id: string) => `/doctors/${id}`,
    SCHEDULE: (id: string) => `/doctors/${id}/schedule`,
    REVIEWS: (id: string) => `/doctors/${id}/reviews`,
  },
  HOSPITALS: {
    BASE: '/hospitals',
    DETAIL: (id: string) => `/hospitals/${id}`,
    BEDS: (id: string) => `/hospitals/${id}/beds`,
    BOOK_BED: (id: string) => `/hospitals/${id}/beds/book`,
    NEARBY: '/hospitals/nearby',
  },
  APPOINTMENTS: {
    BASE: '/appointments',
    DETAIL: (id: string) => `/appointments/${id}`,
    BOOK: '/appointments/book',
    CANCEL: (id: string) => `/appointments/${id}/cancel`,
    RESCHEDULE: (id: string) => `/appointments/${id}/reschedule`,
  },
  EMERGENCY: {
    SERVICES: '/emergency/services',
    REQUESTS: '/emergency/requests',
    REQUEST_DETAIL: (id: string) => `/emergency/requests/${id}`,
  },
  AI: {
    CHAT: '/ai/chat',
    SYMPTOMS: '/ai/analyze-symptoms',
    PREGNANCY: (week: number) => `/ai/pregnancy/${week}`,
    BABY_CARE: (months: number) => `/ai/baby-care/${months}`,
  },
} as const;

// ============================================
// USER ROLES
// ============================================
export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

// ============================================
// APPOINTMENT STATUSES
// ============================================
export const APPOINTMENT_STATUSES = {
  SCHEDULED: 'scheduled',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no-show',
} as const;

export type AppointmentStatus = (typeof APPOINTMENT_STATUSES)[keyof typeof APPOINTMENT_STATUSES];

// ============================================
// APPOINTMENT TYPES
// ============================================
export const APPOINTMENT_TYPES = {
  CONSULTATION: 'consultation',
  FOLLOW_UP: 'follow-up',
  EMERGENCY: 'emergency',
  CHECKUP: 'checkup',
} as const;

export type AppointmentType = (typeof APPOINTMENT_TYPES)[keyof typeof APPOINTMENT_TYPES];

// ============================================
// BLOOD GROUPS
// ============================================
export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodGroup = (typeof BLOOD_GROUPS)[number];

// ============================================
// MEDICAL SPECIALTIES
// ============================================
export const SPECIALTIES = [
  'Cardiologist',
  'Neurologist',
  'Pediatrician',
  'Orthopedic',
  'Dermatologist',
  'Gynecologist',
  'Oncologist',
  'Psychiatrist',
  'Urologist',
  'General Physician',
  'ENT Specialist',
  'Ophthalmologist',
  'Dentist',
  'Pulmonologist',
  'Endocrinologist',
  'Gastroenterologist',
] as const;

// ============================================
// EMERGENCY PRIORITIES
// ============================================
export const EMERGENCY_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export type EmergencyPriority = (typeof EMERGENCY_PRIORITIES)[keyof typeof EMERGENCY_PRIORITIES];

// ============================================
// DAYS OF WEEK
// ============================================
export const DAYS_OF_WEEK = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

// ============================================
// TIME SLOTS
// ============================================
export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00',
] as const;

// ============================================
// REGEX PATTERNS
// ============================================
export const REGEX = {
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  PHONE: /^\+?[\d\s\-()]{10,15}$/,
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  URL: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  NUMERIC: /^[0-9]+$/,
  ALPHA: /^[a-zA-Z\s]+$/,
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
} as const;

// ============================================
// LOCAL STORAGE KEYS
// ============================================
export const STORAGE_KEYS = {
  USER: 'medicare_user',
  TOKEN: 'medicare_token',
  THEME: 'medicare_theme',
  LANGUAGE: 'medicare_language',
  ONBOARDING: 'medicare_onboarding_done',
} as const;

// ============================================
// PAGINATION
// ============================================
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
} as const;

// ============================================
// ANIMATION DURATIONS (seconds)
// ============================================
export const ANIMATIONS = {
  FAST: 0.2,
  NORMAL: 0.3,
  SLOW: 0.5,
  PAGE_TRANSITION: 0.4,
} as const;