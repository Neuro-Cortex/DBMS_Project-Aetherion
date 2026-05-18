import React, { forwardRef, HTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated' | 'glass' | 'gradient' | 'neon' | 'neumorphic';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'glow';
  hover?: boolean;
  interactive?: boolean;
  blur?: boolean;
  glow?: boolean;
}

// ============================================
// VARIANT STYLES
// ============================================
const variantStyles = {
  default: `
    bg-white dark:bg-gray-800
    border border-gray-200 dark:border-gray-700
  `,
  bordered: `
    bg-white dark:bg-gray-800
    border-2 border-gray-300 dark:border-gray-600
  `,
  elevated: `
    bg-white dark:bg-gray-800
    shadow-xl
  `,
  glass: `
    bg-white/10 dark:bg-gray-900/10
    backdrop-blur-xl backdrop-saturate-150
    border border-white/20 dark:border-gray-700/20
  `,
  gradient: `
    bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-red-500/10
    dark:from-purple-500/20 dark:via-pink-500/20 dark:to-red-500/20
    border border-purple-500/20
  `,
  neon: `
    bg-gray-900/90 dark:bg-black/90
    border-2 border-cyan-500/50
    shadow-[0_0_30px_rgba(6,182,212,0.3)]
  `,
  neumorphic: `
    bg-gray-100 dark:bg-gray-800
    shadow-[8px_8px_16px_rgba(0,0,0,0.1),-8px_-8px_16px_rgba(255,255,255,0.7)]
    dark:shadow-[8px_8px_16px_rgba(0,0,0,0.4),-8px_-8px_16px_rgba(255,255,255,0.05)]
  `,
};

// ============================================
// PADDING STYLES
// ============================================
const paddingStyles = {
  none: 'p-0',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
  xl: 'p-10',
};

// ============================================
// ROUNDED STYLES
// ============================================
const roundedStyles = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  '3xl': 'rounded-3xl',
};

// ============================================
// SHADOW STYLES
// ============================================
const shadowStyles = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
  glow: 'shadow-[0_0_40px_rgba(168,85,247,0.4)]',
};

// ============================================
// CARD COMPONENT
// ============================================
export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant = 'default',
      padding = 'md',
      rounded = '2xl',
      shadow = 'md',
      hover = false,
      interactive = false,
      blur = false,
      glow = false,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={twMerge(
          clsx(
            // Base styles
            'relative transition-all duration-300',
            'transform-gpu',

            // Variant
            variantStyles[variant],

            // Padding
            paddingStyles[padding],

            // Rounded
            roundedStyles[rounded],

            // Shadow
            shadowStyles[shadow],

            // Hover effects
            hover && 'hover:shadow-xl hover:-translate-y-1',

            // Interactive
            interactive && 'cursor-pointer hover:scale-[1.02]',

            // Blur
            blur && 'backdrop-blur-2xl',

            // Glow
            glow && 'shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.5)]',

            className
          )
        )}
        whileHover={interactive ? { scale: 1.02 } : undefined}
        whileTap={interactive ? { scale: 0.98 } : undefined}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

// ============================================
// CARD HEADER COMPONENT
// ============================================
export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, bordered = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(
            'flex flex-col space-y-1.5',
            bordered && 'pb-4 border-b border-gray-200 dark:border-gray-700'
          ),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

// ============================================
// CARD TITLE COMPONENT
// ============================================
export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, as: Component = 'h3', children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={twMerge(
          clsx('text-2xl font-bold tracking-tight text-gray-900 dark:text-white'),
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

CardTitle.displayName = 'CardTitle';

// ============================================
// CARD DESCRIPTION COMPONENT
// ============================================
export const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={twMerge(clsx('text-sm text-gray-500 dark:text-gray-400'), className)}
        {...props}
      >
        {children}
      </p>
    );
  }
);

CardDescription.displayName = 'CardDescription';

// ============================================
// CARD CONTENT COMPONENT
// ============================================
export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={twMerge(clsx('pt-0'), className)} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

// ============================================
// CARD FOOTER COMPONENT
// ============================================
export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, bordered = false, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          clsx(
            'flex items-center',
            bordered && 'pt-4 border-t border-gray-200 dark:border-gray-700'
          ),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CardFooter.displayName = 'CardFooter';