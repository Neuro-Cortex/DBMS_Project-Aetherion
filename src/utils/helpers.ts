// src/utils/helpers.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================
// CLASS NAME UTILITY (Tailwind Merge)
// ============================================
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// ============================================
// DELAY / SLEEP
// ============================================
export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============================================
// GENERATE UNIQUE ID
// ============================================
export const generateId = (prefix: string = 'id'): string =>
  `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

// ============================================
// GET INITIALS FROM NAME
// ============================================
export const getInitials = (name: string = ''): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// ============================================
// TRUNCATE TEXT
// ============================================
export const truncateText = (text: string, maxLength: number = 50): string => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
};

// ============================================
// CALCULATE AGE FROM DATE OF BIRTH
// ============================================
export const calculateAge = (dob: string | Date): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

// ============================================
// DEBOUNCE FUNCTION
// ============================================
export function debounce<T extends (...args: unknown[]) => void>(
  func: T,
  wait: number = 300
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// ============================================
// THROTTLE FUNCTION
// ============================================
export function throttle<T extends (...args: unknown[]) => void>(
  func: T,
  limit: number = 300
): (...args: Parameters<T>) => void {
  let inThrottle = false;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit);
    }
  };
}

// ============================================
// DEEP CLONE OBJECT
// ============================================
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj)) as T;
};

// ============================================
// CHECK IF OBJECT IS EMPTY
// ============================================
export const isEmpty = (obj: unknown): boolean => {
  if (obj === null || obj === undefined) return true;
  if (typeof obj === 'string') return obj.trim().length === 0;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj as object).length === 0;
  return false;
};

// ============================================
// PICK SPECIFIC KEYS FROM OBJECT
// ============================================
export const pick = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach((key) => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

// ============================================
// OMIT SPECIFIC KEYS FROM OBJECT
// ============================================
export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result as Omit<T, K>;
};

// ============================================
// RANDOM ITEM FROM ARRAY
// ============================================
export const randomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

// ============================================
// RANDOM NUMBER IN RANGE
// ============================================
export const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// ============================================
// SORT ARRAY BY KEY
// ============================================
export const sortBy = <T>(arr: T[], key: keyof T, order: 'asc' | 'desc' = 'asc'): T[] => {
  return [...arr].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA < valB) return order === 'asc' ? -1 : 1;
    if (valA > valB) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// ============================================
// GROUP ARRAY BY KEY
// ============================================
export const groupBy = <T>(arr: T[], key: keyof T): Record<string, T[]> => {
  return arr.reduce((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

// ============================================
// CONVERT FILE TO BASE64
// ============================================
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

// ============================================
// DOWNLOAD BLOB / FILE
// ============================================
export const downloadFile = (data: Blob | string, filename: string, type: string = 'text/plain'): void => {
  const blob = data instanceof Blob ? data : new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// ============================================
// COPY TEXT TO CLIPBOARD
// ============================================
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    return true;
  }
};

// ============================================
// GET COLOR BASED ON STATUS
// ============================================
export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    active: 'text-green-400',
    available: 'text-green-400',
    completed: 'text-green-400',
    confirmed: 'text-blue-400',
    scheduled: 'text-blue-400',
    'in-progress': 'text-amber-400',
    pending: 'text-amber-400',
    busy: 'text-orange-400',
    low: 'text-amber-400',
    medium: 'text-orange-400',
    high: 'text-red-400',
    critical: 'text-red-500',
    cancelled: 'text-gray-400',
    'no-show': 'text-gray-500',
    unavailable: 'text-gray-500',
  };
  return colors[status] || 'text-white/60';
};

// ============================================
// GET BACKGROUND COLOR BASED ON STATUS
// ============================================
export const getStatusBg = (status: string): string => {
  const bgColors: Record<string, string> = {
    active: 'bg-green-500/10',
    available: 'bg-green-500/10',
    completed: 'bg-green-500/10',
    confirmed: 'bg-blue-500/10',
    scheduled: 'bg-blue-500/10',
    'in-progress': 'bg-amber-500/10',
    pending: 'bg-amber-500/10',
    critical: 'bg-red-500/10',
    high: 'bg-red-500/10',
    cancelled: 'bg-gray-500/10',
  };
  return bgColors[status] || 'bg-white/[0.04]';
};