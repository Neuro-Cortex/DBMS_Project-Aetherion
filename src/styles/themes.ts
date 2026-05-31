// ============================================
// THEME TYPES
// ============================================
export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  secondary: string;
  secondaryLight: string;
  secondaryDark: string;
  accent: string;
  accentLight: string;
  accentDark: string;
  success: string;
  warning: string;
  error: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  border: string;
}

export interface ThemeGradients {
  primary: string;
  secondary: string;
  accent: string;
  success: string;
  warning: string;
  mesh: string;
  card: string;
  hero: string;
}

export interface ThemeGlass {
  background: string;
  border: string;
  shadow: string;
  blur: string;
}

export interface ThemeNeon {
  cyan: string;
  purple: string;
  pink: string;
  green: string;
  orange: string;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  gradients: ThemeGradients;
  glass: ThemeGlass;
  neon: ThemeNeon;
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  fontFamily: {
    sans: string;
    mono: string;
  };
}

// ============================================
// DARK THEME (DEFAULT)
// ============================================
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    primary: '#06b6d4',
    primaryLight: '#22d3ee',
    primaryDark: '#0891b2',
    secondary: '#a855f7',
    secondaryLight: '#c084fc',
    secondaryDark: '#9333ea',
    accent: '#f43f5e',
    accentLight: '#fb7185',
    accentDark: '#e11d48',
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    background: '#000000',
    surface: '#0a0a0a',
    text: '#ffffff',
    textSecondary: 'rgba(255, 255, 255, 0.6)',
    border: 'rgba(255, 255, 255, 0.1)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    secondary: 'linear-gradient(135deg, #a855f7, #6366f1)',
    accent: 'linear-gradient(135deg, #f43f5e, #ec4899)',
    success: 'linear-gradient(135deg, #22c55e, #10b981)',
    warning: 'linear-gradient(135deg, #f59e0b, #f97316)',
    mesh: 'radial-gradient(at 20% 20%, rgba(6,182,212,0.15) 0%, transparent 50%), radial-gradient(at 80% 80%, rgba(168,85,247,0.15) 0%, transparent 50%)',
    card: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
    hero: 'linear-gradient(135deg, rgba(6,182,212,0.1), transparent, rgba(168,85,247,0.1))',
  },
  glass: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: 'rgba(255, 255, 255, 0.1)',
    shadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    blur: '16px',
  },
  neon: {
    cyan: '0 0 5px #06b6d4, 0 0 20px rgba(6,182,212,0.3), 0 0 40px rgba(6,182,212,0.1)',
    purple: '0 0 5px #a855f7, 0 0 20px rgba(168,85,247,0.3), 0 0 40px rgba(168,85,247,0.1)',
    pink: '0 0 5px #f43f5e, 0 0 20px rgba(244,63,94,0.3), 0 0 40px rgba(244,63,94,0.1)',
    green: '0 0 5px #22c55e, 0 0 20px rgba(34,197,94,0.3), 0 0 40px rgba(34,197,94,0.1)',
    orange: '0 0 5px #f97316, 0 0 20px rgba(249,115,22,0.3), 0 0 40px rgba(249,115,22,0.1)',
  },
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
};

// ============================================
// MIDNIGHT THEME
// ============================================
export const midnightTheme: Theme = {
  name: 'midnight',
  colors: {
    primary: '#818cf8',
    primaryLight: '#a5b4fc',
    primaryDark: '#6366f1',
    secondary: '#c084fc',
    secondaryLight: '#d8b4fe',
    secondaryDark: '#a855f7',
    accent: '#fb923c',
    accentLight: '#fdba74',
    accentDark: '#f97316',
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    background: '#0c0a1a',
    surface: '#130f2a',
    text: '#f1f5f9',
    textSecondary: 'rgba(241, 245, 249, 0.6)',
    border: 'rgba(129, 140, 248, 0.15)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #818cf8, #6366f1)',
    secondary: 'linear-gradient(135deg, #c084fc, #a855f7)',
    accent: 'linear-gradient(135deg, #fb923c, #f97316)',
    success: 'linear-gradient(135deg, #4ade80, #22c55e)',
    warning: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
    mesh: 'radial-gradient(at 30% 30%, rgba(129,140,248,0.12) 0%, transparent 50%), radial-gradient(at 70% 70%, rgba(192,132,252,0.12) 0%, transparent 50%)',
    card: 'linear-gradient(135deg, rgba(129,140,248,0.06) 0%, rgba(129,140,248,0.01) 100%)',
    hero: 'linear-gradient(135deg, rgba(129,140,248,0.1), transparent, rgba(192,132,252,0.1))',
  },
  glass: {
    background: 'rgba(129, 140, 248, 0.05)',
    border: 'rgba(129, 140, 248, 0.12)',
    shadow: '0 8px 32px rgba(12, 10, 26, 0.4)',
    blur: '20px',
  },
  neon: {
    cyan: '0 0 5px #818cf8, 0 0 20px rgba(129,140,248,0.3), 0 0 40px rgba(129,140,248,0.1)',
    purple: '0 0 5px #c084fc, 0 0 20px rgba(192,132,252,0.3), 0 0 40px rgba(192,132,252,0.1)',
    pink: '0 0 5px #fb923c, 0 0 20px rgba(251,146,60,0.3), 0 0 40px rgba(251,146,60,0.1)',
    green: '0 0 5px #4ade80, 0 0 20px rgba(74,222,128,0.3), 0 0 40px rgba(74,222,128,0.1)',
    orange: '0 0 5px #fbbf24, 0 0 20px rgba(251,191,36,0.3), 0 0 40px rgba(251,191,36,0.1)',
  },
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
};

// ============================================
// OCEAN THEME
// ============================================
export const oceanTheme: Theme = {
  name: 'ocean',
  colors: {
    primary: '#0ea5e9',
    primaryLight: '#38bdf8',
    primaryDark: '#0284c7',
    secondary: '#06b6d4',
    secondaryLight: '#22d3ee',
    secondaryDark: '#0891b2',
    accent: '#14b8a6',
    accentLight: '#2dd4bf',
    accentDark: '#0d9488',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    background: '#020617',
    surface: '#0f172a',
    text: '#e2e8f0',
    textSecondary: 'rgba(226, 232, 240, 0.6)',
    border: 'rgba(14, 165, 233, 0.15)',
  },
  gradients: {
    primary: 'linear-gradient(135deg, #0ea5e9, #06b6d4)',
    secondary: 'linear-gradient(135deg, #06b6d4, #14b8a6)',
    accent: 'linear-gradient(135deg, #14b8a6, #10b981)',
    success: 'linear-gradient(135deg, #10b981, #22c55e)',
    warning: 'linear-gradient(135deg, #f59e0b, #f97316)',
    mesh: 'radial-gradient(at 25% 25%, rgba(14,165,233,0.15) 0%, transparent 50%), radial-gradient(at 75% 75%, rgba(6,182,212,0.15) 0%, transparent 50%)',
    card: 'linear-gradient(135deg, rgba(14,165,233,0.06) 0%, rgba(14,165,233,0.01) 100%)',
    hero: 'linear-gradient(135deg, rgba(14,165,233,0.1), transparent, rgba(20,184,166,0.1))',
  },
  glass: {
    background: 'rgba(14, 165, 233, 0.05)',
    border: 'rgba(14, 165, 233, 0.12)',
    shadow: '0 8px 32px rgba(2, 6, 23, 0.4)',
    blur: '18px',
  },
  neon: {
    cyan: '0 0 5px #0ea5e9, 0 0 20px rgba(14,165,233,0.3), 0 0 40px rgba(14,165,233,0.1)',
    purple: '0 0 5px #06b6d4, 0 0 20px rgba(6,182,212,0.3), 0 0 40px rgba(6,182,212,0.1)',
    pink: '0 0 5px #14b8a6, 0 0 20px rgba(20,184,166,0.3), 0 0 40px rgba(20,184,166,0.1)',
    green: '0 0 5px #10b981, 0 0 20px rgba(16,185,129,0.3), 0 0 40px rgba(16,185,129,0.1)',
    orange: '0 0 5px #f59e0b, 0 0 20px rgba(245,158,11,0.3), 0 0 40px rgba(245,158,11,0.1)',
  },
  borderRadius: {
    sm: '0.5rem',
    md: '0.75rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  fontFamily: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', 'Fira Code', monospace",
  },
};

// ============================================
// THEME MAP
// ============================================
export const themes: Record<string, Theme> = {
  dark: darkTheme,
  midnight: midnightTheme,
  ocean: oceanTheme,
};

// ============================================
// DEFAULT EXPORT
// ============================================
export default darkTheme;