import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

// ============================================
// TYPES
// ============================================
interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse' | 'progress';
  color?: 'primary' | 'secondary' | 'white';
  text?: string;
  fullScreen?: boolean;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================
export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  variant = 'spinner',
  color = 'primary',
  text,
  fullScreen = false,
  className,
}) => {
  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const colors = {
    primary: 'border-blue-600',
    secondary: 'border-gray-600',
    white: 'border-white',
  };

  const ringColors = {
    primary: 'border-t-blue-600',
    secondary: 'border-t-gray-600',
    white: 'border-t-white',
  };

  const Spinner = () => (
    <div
      className={clsx(
        'rounded-full border-2 border-gray-200 animate-spin',
        sizes[size],
        ringColors[color]
      )}
    />
  );

  const Dots = () => (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className={clsx(
            'rounded-full',
            size === 'sm' ? 'w-2 h-2' : size === 'md' ? 'w-3 h-3' : 'w-4 h-4',
            color === 'primary' ? 'bg-blue-600' : color === 'secondary' ? 'bg-gray-600' : 'bg-white'
          )}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );

  const Pulse = () => (
    <motion.div
      className={clsx(
        'rounded-full',
        sizes[size],
        color === 'primary' ? 'bg-blue-600' : color === 'secondary' ? 'bg-gray-600' : 'bg-white'
      )}
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );

  const Progress = () => (
    <div className={clsx('w-full max-w-xs bg-gray-200 rounded-full overflow-hidden', size === 'sm' ? 'h-1' : size === 'md' ? 'h-2' : 'h-3')}>
      <motion.div
        className={clsx(
          'rounded-full',
          color === 'primary' ? 'bg-blue-600' : color === 'secondary' ? 'bg-gray-600' : 'bg-white'
        )}
        initial={{ width: '0%' }}
        animate={{ width: '100%' }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ height: '100%' }}
      />
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case 'spinner': return <Spinner />;
      case 'dots': return <Dots />;
      case 'pulse': return <Pulse />;
      case 'progress': return <Progress />;
      default: return <Spinner />;
    }
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="flex flex-col items-center gap-4">
          {renderLoader()}
          {text && <p className="text-gray-600 dark:text-gray-400">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={clsx('flex flex-col items-center gap-2', className)}>
      {renderLoader()}
      {text && <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>}
    </div>
  );
};