import React, { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { Loader2, type LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

// ================= TYPES =================

type Variant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'success'
  | 'gradient'
  | 'neon'
  | 'glass'
  | 'glassmorphic';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type Rounded = 'sm' | 'md' | 'lg' | 'xl' | 'full';
type Shadow = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'glow';

export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'ref'> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  icon?: LucideIcon;
  iconOnly?: boolean;
  fullWidth?: boolean;
  rounded?: Rounded;
  shadow?: Shadow;
  ripple?: boolean;
  pulse?: boolean;
  shine?: boolean;
}

// ================= STYLES =================

const variantStyles: Record<Variant, string> = {
  primary: 'bg-cyan-600 hover:bg-cyan-700 text-white',
  secondary: 'bg-purple-600 hover:bg-purple-700 text-white',
  outline: 'border border-cyan-500 text-cyan-400 hover:bg-cyan-500/10',
  ghost: 'text-white/70 hover:bg-white/10',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
  success: 'bg-green-600 hover:bg-green-700 text-white',
  gradient: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white',
  neon: 'border border-cyan-400 text-cyan-300 shadow-lg',
  glass: 'bg-white/10 backdrop-blur text-white',
  glassmorphic: 'bg-white/10 backdrop-blur-xl text-white',
};

const sizeStyles: Record<Size, string> = {
  xs: 'px-2 py-1 text-xs',
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
};

const roundedStyles: Record<Rounded, string> = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
};

const shadowStyles: Record<Shadow, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  glow: 'shadow-[0_0_20px_rgba(0,255,255,0.6)]',
};

// ================= COMPONENT =================

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText = 'Loading...',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      icon: Icon,
      iconOnly = false,
      fullWidth,
      rounded = 'xl',
      shadow = 'none',
      ripple = true,
      pulse,
      shine,
      children,
      disabled,
      onClick,
      ...props
    },
    ref
  ) => {
    const [ripples, setRipples] = React.useState<
      { x: number; y: number; id: number }[]
    >([]);

    const DisplayIcon = Icon || LeftIcon;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (ripple && !disabled && !isLoading) {
        const rect = e.currentTarget.getBoundingClientRect();
        const id = Date.now();

        setRipples((prev) => [
          ...prev,
          {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            id,
          },
        ]);

        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== id));
        }, 600);
      }

      onClick?.(e);
    };

    return (
      <motion.button
        ref={ref}
        onClick={handleClick}
        disabled={disabled || isLoading}
        whileHover={!disabled && !isLoading ? { scale: 1.05 } : undefined}
        whileTap={!disabled && !isLoading ? { scale: 0.95 } : undefined}
        className={twMerge(
          clsx(
            'relative inline-flex items-center justify-center font-medium transition-all overflow-hidden',
            variantStyles[variant],
            sizeStyles[size],
            roundedStyles[rounded],
            shadowStyles[shadow],
            fullWidth && 'w-full',
            pulse && 'animate-pulse',
            disabled && 'opacity-50 cursor-not-allowed',
            className
          )
        )}
        {...props}
      >
        {/* Shine effect */}
        {shine && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          />
        )}

        {/* Ripple */}
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute bg-white/30 rounded-full"
            style={{
              left: r.x,
              top: r.y,
              width: 100,
              height: 100,
              transform: 'translate(-50%, -50%)',
              opacity: 0.4,
            }}
          />
        ))}

        {/* Content */}
        <span className="relative flex items-center gap-2">
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {!iconOnly && loadingText}
            </>
          ) : (
            <>
              {DisplayIcon && <DisplayIcon className="w-4 h-4" />}
              {!iconOnly && children}
              {RightIcon && <RightIcon className="w-4 h-4" />}
            </>
          )}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';