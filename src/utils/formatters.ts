import { APP_CONFIG } from './constants';

// ============================================
// DATE FORMATTERS
// ============================================
export const formatDate = (
  date: string | Date,
  format: 'short' | 'long' | 'relative' | 'time' | 'datetime' = 'short'
): string => {
  if (!date) return 'N/A';
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return 'Invalid Date';

  const locale = APP_CONFIG.defaultLocale;

  switch (format) {
    case 'short':
      return dateObj.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

    case 'long':
      return dateObj.toLocaleDateString(locale, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

    case 'relative':
      return formatTimeAgo(dateObj);

    case 'time':
      return dateObj.toLocaleTimeString(locale, {
        hour: '2-digit',
        minute: '2-digit',
      });

    case 'datetime':
      return dateObj.toLocaleDateString(locale, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });

    default:
      return dateObj.toLocaleDateString(locale);
  }
};

// ============================================
// TIME AGO FORMATTER
// ============================================
export const formatTimeAgo = (date: string | Date): string => {
  const dateObj = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
};

// ============================================
// CURRENCY FORMATTER
// ============================================
export const formatCurrency = (
  amount: number | string,
  currency: string = APP_CONFIG.currency,
  locale: string = APP_CONFIG.defaultLocale
): string => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(num)) return '$0.00';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

// ============================================
// NUMBER FORMATTER
// ============================================
export const formatNumber = (
  num: number | string,
  options?: { decimals?: number; compact?: boolean }
): string => {
  const value = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(value)) return '0';

  if (options?.compact) {
    return new Intl.NumberFormat('en', { notation: 'compact' }).format(value);
  }

  return new Intl.NumberFormat('en', {
    minimumFractionDigits: options?.decimals ?? 0,
    maximumFractionDigits: options?.decimals ?? 2,
  }).format(value);
};

// ============================================
// PHONE NUMBER FORMATTER
// ============================================
export const formatPhoneNumber = (phone: string): string => {
  if (!phone) return '';
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
  if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 11)}`;
  }
  
  // Return original if can't format
  return phone;
};

// ============================================
// FILE SIZE FORMATTER
// ============================================
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// ============================================
// DURATION FORMATTER
// ============================================
export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (mins === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${mins} min`;
};

// ============================================
// TEXT FORMATTERS
// ============================================
export const capitalize = (text: string): string => {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const titleCase = (text: string): string => {
  if (!text) return '';
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const camelCase = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase());
};

// ============================================
// BLOOD GROUP FORMATTER
// ============================================
export const formatBloodGroup = (bg: string): string => {
  if (!bg) return '';
  return bg.replace(/([+-])/, ' $1').trim();
};

// ============================================
// MEDICAL FORMATTERS
// ============================================
export const formatBMI = (weightKg: number, heightCm: number): string => {
  if (!weightKg || !heightCm) return 'N/A';
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return bmi.toFixed(1);
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const formatHeartRate = (bpm: number): string => {
  return `${bpm} BPM`;
};

export const formatBloodPressure = (systolic: number, diastolic: number): string => {
  return `${systolic}/${diastolic} mmHg`;
};

export const formatTemperature = (temp: number, unit: 'C' | 'F' = 'C'): string => {
  return `${temp.toFixed(1)}°${unit}`;
};

export const formatOxygenLevel = (spo2: number): string => {
  return `${spo2}% SpO₂`;
};

// ============================================
// ADDRESS FORMATTER
// ============================================
export const formatAddress = (address: {
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}): string => {
  const parts = [address.street, address.city, address.state, address.zip, address.country].filter(
    Boolean
  );
  return parts.join(', ');
};

// ============================================
// PERCENTAGE FORMATTER
// ============================================
export const formatPercentage = (value: number, decimals: number = 1): string => {
  if (value === null || value === undefined) return '0%';
  return `${value.toFixed(decimals)}%`;
};

// ============================================
// MASKING FORMATTERS (Privacy)
// ============================================
export const maskEmail = (email: string): string => {
  if (!email) return '';
  const [username, domain] = email.split('@');
  const masked = username.charAt(0) + '***' + username.charAt(username.length - 1);
  return `${masked}@${domain}`;
};

export const maskPhone = (phone: string): string => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length < 4) return phone;
  return '***-***-' + cleaned.slice(-4);
};

export const maskCreditCard = (cardNumber: string): string => {
  if (!cardNumber) return '';
  const cleaned = cardNumber.replace(/\D/g, '');
  return '**** **** **** ' + cleaned.slice(-4);
};