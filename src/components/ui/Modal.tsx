import React, { useEffect, useRef, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  position?: 'center' | 'top' | 'bottom';
  closeButton?: boolean;
  closeOnOverlay?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
  variant?: 'default' | 'glass' | 'gradient' | 'neon';
  animation?: 'fade' | 'scale' | 'slide' | 'blur';
  blur?: boolean;
}

// ============================================
// SIZE STYLES
// ============================================
const sizeStyles = {
  xs: 'max-w-xs',
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full mx-4',
};

// ============================================
// POSITION STYLES
// ============================================
const positionStyles = {
  center: 'items-center justify-center',
  top: 'items-start justify-center pt-20',
  bottom: 'items-end justify-center pb-20',
};

// ============================================
// VARIANT STYLES
// ============================================
const variantStyles = {
  default: `
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
  `,
  glass: `
    bg-white/10 dark:bg-gray-900/10
    backdrop-blur-2xl backdrop-saturate-150
    border border-white/20 dark:border-gray-700/20
  `,
  gradient: `
    bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-red-500/10
    dark:from-purple-500/20 dark:via-pink-500/20 dark:to-red-500/20
    backdrop-blur-xl
    border border-purple-500/20
  `,
  neon: `
    bg-gray-900/95 dark:bg-black/95
    border-2 border-cyan-500/50
    shadow-[0_0_40px_rgba(6,182,212,0.4)]
  `,
};

// ============================================
// ANIMATION VARIANTS
// ============================================
const animationVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
  },
  slide: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -50 },
  },
  blur: {
    initial: { opacity: 0, filter: 'blur(10px)' },
    animate: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(10px)' },
  },
};

// ============================================
// MODAL COMPONENT
// ============================================
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  position = 'center',
  closeButton = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  footer,
  variant = 'default',
  animation = 'scale',
  blur = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, closeOnEscape, onClose]);

  // Handle click outside
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlay && e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex p-4" style={{ perspective: '1000px' }}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={clsx(
              'fixed inset-0',
              blur ? 'backdrop-blur-md' : 'backdrop-blur-sm',
              'bg-black/60'
            )}
            onClick={handleOverlayClick}
          />

          {/* Modal Container */}
          <div
            className={clsx('relative w-full', positionStyles[position])}
            style={{ display: 'flex' }}
            onClick={handleOverlayClick}
          >
            {/* Modal Content */}
            <motion.div
              ref={modalRef}
              {...animationVariants[animation]}
              transition={{
                type: 'spring',
                damping: 25,
                stiffness: 300,
              }}
              className={twMerge(
                clsx(
                  'relative w-full',
                  sizeStyles[size],
                  variantStyles[variant],
                  'rounded-3xl shadow-2xl overflow-hidden'
                )
              )}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              {(title || description || closeButton) && (
                <div className="px-8 pt-8 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {title && (
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                          {title}
                        </h2>
                      )}
                      {description && (
                        <p className="text-gray-500 dark:text-gray-400">{description}</p>
                      )}
                    </div>

                    {closeButton && (
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="ml-4 p-2 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    )}
                  </div>
                </div>
              )}

              {/* Body */}
              <div className="px-8 py-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                {children}
              </div>

              {/* Footer */}
              {footer && (
                <div className="px-8 py-4 bg-gray-50 dark:bg-gray-900/50 border-t border-gray-200/50 dark:border-gray-700/50">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

// ============================================
// CONFIRM MODAL COMPONENT
// ============================================
export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'info',
}) => {
  const variantColors = {
    danger: 'from-red-600 to-rose-600',
    warning: 'from-yellow-600 to-orange-600',
    info: 'from-blue-600 to-indigo-600',
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" animation="scale">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">{message}</p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={clsx(
              'flex-1 px-4 py-2 rounded-xl text-white font-semibold',
              `bg-gradient-to-r ${variantColors[variant]}`,
              'hover:shadow-lg transition-all'
            )}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};