import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LucideIcon } from 'lucide-react';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  icon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      icon,
      rightElement,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </label>
        )}

        <div className="relative">
          {LeftIcon && (
            <LeftIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}

          {!LeftIcon && icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 flex items-center justify-center">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            className={twMerge(
              clsx(
                'w-full px-4 py-2.5 rounded-xl border',
                'bg-white dark:bg-gray-800',
                'text-gray-900 dark:text-white',
                'focus:outline-none focus:ring-2 focus:ring-blue-500',
                error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 dark:border-gray-600',
                (LeftIcon || icon) && 'pl-10',
                (RightIcon || rightElement) && 'pr-10'
              ),
              className
            )}
            {...props}
          />

          {RightIcon && (
            <RightIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          )}

          {!RightIcon && rightElement && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {rightElement}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {!error && helperText && (
          <p className="text-sm text-gray-500">{helperText}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;