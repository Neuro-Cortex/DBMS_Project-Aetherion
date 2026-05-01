import { REGEX, BLOOD_GROUPS, BloodGroup } from './constants';

// ============================================
// VALIDATION RESULT TYPE
// ============================================
export type ValidationResult = { isValid: boolean; error?: string };

// ============================================
// EMAIL VALIDATOR
// ============================================
export const isValidEmail = (email: string): ValidationResult => {
  if (!email || email.trim().length === 0) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!REGEX.EMAIL.test(email)) {
    return { isValid: false, error: 'Invalid email format' };
  }
  return { isValid: true };
};

// ============================================
// PHONE VALIDATOR
// ============================================
export const isValidPhone = (phone: string): ValidationResult => {
  if (!phone || phone.trim().length === 0) {
    return { isValid: false, error: 'Phone number is required' };
  }
  if (!REGEX.PHONE.test(phone)) {
    return { isValid: false, error: 'Invalid phone number format' };
  }
  return { isValid: true };
};

// ============================================
// PASSWORD VALIDATOR
// ============================================
export const isValidPassword = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }
  if (!REGEX.STRONG_PASSWORD.test(password)) {
    return {
      isValid: false,
      error: 'Password must include uppercase, lowercase, number, and special character',
    };
  }
  return { isValid: true };
};

// ============================================
// NAME VALIDATOR
// ============================================
export const isValidName = (name: string): ValidationResult => {
  if (!name || name.trim().length === 0) {
    return { isValid: false, error: 'Name is required' };
  }
  if (name.trim().length < 2) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  if (!REGEX.ALPHA.test(name)) {
    return { isValid: false, error: 'Name should only contain letters' };
  }
  return { isValid: true };
};

// ============================================
// REQUIRED FIELD VALIDATOR
// ============================================
export const isRequired = (value: any, fieldName: string = 'This field'): ValidationResult => {
  if (value === null || value === undefined || (typeof value === 'string' && value.trim().length === 0)) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true };
};

// ============================================
// BLOOD GROUP VALIDATOR
// ============================================
export const isValidBloodGroup = (bg: string): ValidationResult => {
  if (!bg) {
    return { isValid: false, error: 'Blood group is required' };
  }
  if (!BLOOD_GROUPS.includes(bg as BloodGroup)) {
    return { isValid: false, error: 'Invalid blood group' };
  }
  return { isValid: true };
};

// ============================================
// DATE VALIDATORS
// ============================================
export const isValidDate = (date: string): ValidationResult => {
  if (!date) {
    return { isValid: false, error: 'Date is required' };
  }
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }
  return { isValid: true };
};

export const isFutureDate = (date: string): ValidationResult => {
  const dateValidation = isValidDate(date);
  if (!dateValidation.isValid) return dateValidation;

  const parsed = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (parsed <= today) {
    return { isValid: false, error: 'Date must be in the future' };
  }
  return { isValid: true };
};

export const isPastDate = (date: string): ValidationResult => {
  const dateValidation = isValidDate(date);
  if (!dateValidation.isValid) return dateValidation;

  const parsed = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (parsed >= today) {
    return { isValid: false, error: 'Date must be in the past' };
  }
  return { isValid: true };
};

// ============================================
// AGE VALIDATOR
// ============================================
export const isValidAge = (age: number, min: number = 0, max: number = 150): ValidationResult => {
  if (age === null || age === undefined) {
    return { isValid: false, error: 'Age is required' };
  }
  if (typeof age !== 'number' || isNaN(age)) {
    return { isValid: false, error: 'Age must be a number' };
  }
  if (age < min || age > max) {
    return { isValid: false, error: `Age must be between ${min} and ${max}` };
  }
  return { isValid: true };
};

// ============================================
// NUMBER VALIDATOR
// ============================================
export const isValidNumber = (value: any, min?: number, max?: number): ValidationResult => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: 'Value is required' };
  }
  const num = Number(value);
  if (isNaN(num)) {
    return { isValid: false, error: 'Must be a valid number' };
  }
  if (min !== undefined && num < min) {
    return { isValid: false, error: `Must be at least ${min}` };
  }
  if (max !== undefined && num > max) {
    return { isValid: false, error: `Must be at most ${max}` };
  }
  return { isValid: true };
};

// ============================================
// FILE VALIDATOR
// ============================================
export interface FileValidationOptions {
  maxSizeMB?: number;
  allowedTypes?: string[];
}

export const isValidFile = (
  file: File | null | undefined,
  options: FileValidationOptions = {}
): ValidationResult => {
  if (!file) {
    return { isValid: false, error: 'File is required' };
  }

  const { maxSizeMB = 5, allowedTypes } = options;

  // Size check
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { isValid: false, error: `File size must be less than ${maxSizeMB}MB` };
  }

  // Type check
  if (allowedTypes && allowedTypes.length > 0) {
    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: `Allowed file types: ${allowedTypes.join(', ')}` };
    }
  }

  return { isValid: true };
};

// ============================================
// FORM VALIDATOR (Run multiple validators)
// ============================================
export const validateForm = (
  fields: Record<string, () => ValidationResult>
): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};
  let isValid = true;

  Object.entries(fields).forEach(([fieldName, validator]) => {
    const result = validator();
    if (!result.isValid) {
      errors[fieldName] = result.error || 'Invalid';
      isValid = false;
    }
  });

  return { isValid, errors };
};