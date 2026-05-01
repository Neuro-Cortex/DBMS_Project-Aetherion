import { Variants, Transition } from 'framer-motion';

// ============================================
// TRANSITION PRESETS
// ============================================
export const transitions = {
  spring: { type: 'spring', stiffness: 300, damping: 25 } as Transition,
  springBouncy: { type: 'spring', stiffness: 400, damping: 15 } as Transition,
  springGentle: { type: 'spring', stiffness: 200, damping: 30 } as Transition,
  springStiff: { type: 'spring', stiffness: 500, damping: 30 } as Transition,
  smooth: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } as Transition,
  smoothSlow: { duration: 0.8, ease: [0.4, 0, 0.2, 1] } as Transition,
  smoothFast: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } as Transition,
  easeIn: { duration: 0.4, ease: 'easeIn' } as Transition,
  easeOut: { duration: 0.4, ease: 'easeOut' } as Transition,
  easeInOut: { duration: 0.5, ease: 'easeInOut' } as Transition,
} as const;

// ============================================
// FADE ANIMATIONS
// ============================================
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.smooth },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transitions.spring },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: transitions.spring },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: transitions.spring },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: transitions.spring },
};

// ============================================
// SCALE ANIMATIONS
// ============================================
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: transitions.springBouncy },
};

export const scaleInUp: Variants = {
  hidden: { opacity: 0, scale: 0.8, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: transitions.spring },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { opacity: 1, scale: 1, transition: transitions.springBouncy },
};

// ============================================
// SLIDE ANIMATIONS
// ============================================
export const slideInLeft: Variants = {
  hidden: { x: '-100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: transitions.smooth },
};

export const slideInRight: Variants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1, transition: transitions.smooth },
};

export const slideInUp: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: transitions.smooth },
};

export const slideInDown: Variants = {
  hidden: { y: '-100%', opacity: 0 },
  visible: { y: 0, opacity: 1, transition: transitions.smooth },
};

// ============================================
// ROTATE ANIMATIONS
// ============================================
export const rotateIn: Variants = {
  hidden: { opacity: 0, rotate: -180, scale: 0 },
  visible: { opacity: 1, rotate: 0, scale: 1, transition: transitions.springBouncy },
};

export const flipIn: Variants = {
  hidden: { opacity: 0, rotateY: 90 },
  visible: { opacity: 1, rotateY: 0, transition: transitions.smooth },
};

// ============================================
// STAGGER CONTAINERS
// ============================================
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.05,
    },
  },
};

// ============================================
// STAGGER ITEMS (Use inside staggerContainer)
// ============================================
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: transitions.spring },
};

export const staggerItemScale: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: transitions.springBouncy },
};

export const staggerItemLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: transitions.spring },
};

export const staggerItemRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { opacity: 1, x: 0, transition: transitions.spring },
};

// ============================================
// PAGE TRANSITIONS
// ============================================
export const pageTransition: Variants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: transitions.smoothFast },
  exit: { opacity: 0, y: -8, transition: transitions.smoothFast },
};

export const pageTransitionScale: Variants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: transitions.smooth },
  exit: { opacity: 0, scale: 0.98, transition: transitions.smoothFast },
};

// ============================================
// MODAL / OVERLAY ANIMATIONS
// ============================================
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.smoothFast },
  exit: { opacity: 0, transition: transitions.smoothFast },
};

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: transitions.spring },
  exit: { opacity: 0, scale: 0.9, y: 20, transition: transitions.smoothFast },
};

export const modalSlideUp: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0, transition: transitions.smooth },
  exit: { opacity: 0, y: '100%', transition: transitions.smoothFast },
};

// ============================================
// TOOLTIP / POPOVER
// ============================================
export const tooltip: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 5 },
  visible: { opacity: 1, scale: 1, y: 0, transition: transitions.smoothFast },
  exit: { opacity: 0, scale: 0.9, y: 5, transition: transitions.smoothFast },
};

// ============================================
// CARD HOVER EFFECTS
// ============================================
export const cardHover = {
  rest: { scale: 1, y: 0 },
  hover: { scale: 1.02, y: -5, transition: transitions.spring },
};

export const cardHoverLift = {
  rest: { scale: 1, y: 0, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' },
  hover: {
    scale: 1.03,
    y: -8,
    boxShadow: '0 16px 48px rgba(0,0,0,0.4)',
    transition: transitions.spring,
  },
};

export const cardHoverGlow = {
  rest: { scale: 1, boxShadow: '0 0 0 rgba(6,182,212,0)' },
  hover: {
    scale: 1.02,
    boxShadow: '0 0 20px rgba(6,182,212,0.2), 0 0 40px rgba(6,182,212,0.1)',
    transition: transitions.spring,
  },
};

// ============================================
// BUTTON INTERACTIONS
// ============================================
export const buttonPress = {
  rest: { scale: 1 },
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export const buttonPressSubtle = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

// ============================================
// NOTIFICATION / TOAST
// ============================================
export const toastSlideIn: Variants = {
  hidden: { opacity: 0, x: 100, scale: 0.9 },
  visible: { opacity: 1, x: 0, scale: 1, transition: transitions.spring },
  exit: { opacity: 0, x: 100, scale: 0.9, transition: transitions.smoothFast },
};

// ============================================
// COUNTER / NUMBER ANIMATION
// ============================================
export const counter = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ...transitions.spring,
      delay: 0.2,
    },
  },
};

// ============================================
// ACCORDION / COLLAPSE
// ============================================
export const accordion: Variants = {
  open: { height: 'auto', opacity: 1, transition: transitions.smooth },
  closed: { height: 0, opacity: 0, transition: transitions.smoothFast },
};

// ============================================
// PULSE / BREATHING
// ============================================
export const pulse: Variants = {
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const breathe: Variants = {
  animate: {
    opacity: [1, 0.7, 1],
    scale: [1, 1.02, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================
// FLOATING ANIMATION
// ============================================
export const float: Variants = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const floatSlow: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================
// TYPING INDICATOR
// ============================================
export const typingDot = (index: number): Variants => ({
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      delay: index * 0.2,
    },
  },
});

// ============================================
// PROGRESS BAR
// ============================================
export const progressFill = (width: number): Variants => ({
  hidden: { width: '0%' },
  visible: {
    width: `${width}%`,
    transition: {
      duration: 1,
      ease: 'easeOut',
    },
  },
});

// ============================================
// ORBIT / SPIN
// ============================================
export const orbit: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const spin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// ============================================
// COMBO: LIST WITH STAGGER + FADE UP
// ============================================
export const listAnimation = {
  container: staggerContainer,
  item: staggerItem,
} as const;

export const gridAnimation = {
  container: staggerContainerFast,
  item: staggerItemScale,
} as const;

// ============================================
// COMBO: MODAL WITH OVERLAY
// ============================================
export const modalAnimation = {
  overlay: modalOverlay,
  content: modalContent,
} as const;