
import React from 'react';
import { twMerge } from 'tailwind-merge';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type AvatarShape = 'circle' | 'square' | 'rounded';
export type AvatarStatus = 'online' | 'offline' | 'away' | 'busy';
export type AvatarVariant = 'default' | 'glass' | 'neon' | 'gradient';

export interface AvatarProps {
  /** Image URL for the avatar */
  src?: string;
  /** Name used for generating initials and alt text */
  name?: string;
  /** Size of the avatar */
  size?: AvatarSize;
  /** Visual style variant */
  variant?: AvatarVariant;
  /** Shape of the avatar */
  shape?: AvatarShape;
  /** Status indicator */
  status?: AvatarStatus;
  /** Additional CSS classes */
  className?: string;
  /** Click handler */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /** Error handler for image loading failure */
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  /** Custom content to display instead of initials */
  children?: React.ReactNode;
  /** ARIA label for accessibility */
  ariaLabel?: string;
  /** Disabled state */
  disabled?: boolean;
}



const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl',
};


const shapeClasses: Record<AvatarShape, string> = {
  circle: 'rounded-full',
  square: 'rounded-none',
  rounded: 'rounded-xl',
};

const statusClasses: Record<AvatarStatus, string> = {
  online: 'bg-green-500 ring-2 ring-white dark:ring-gray-900',
  offline: 'bg-gray-400 ring-2 ring-white dark:ring-gray-900',
  away: 'bg-yellow-500 ring-2 ring-white dark:ring-gray-900',
  busy: 'bg-red-500 ring-2 ring-white dark:ring-gray-900',
};

const statusSizeMap: Record<AvatarSize, string> = {
  xs: 'w-1.5 h-1.5',
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
  xl: 'w-3.5 h-3.5',
};


const variantClasses: Record<AvatarVariant, string> = {
  default: 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
  glass: 'bg-white/10 backdrop-blur-xl border border-white/20 text-white',
  neon: 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg',
  gradient: 'bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 text-white',
};


export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  size = 'md',
  variant = 'default',
  shape = 'circle',
  status,
  className,
  onClick,
  onError,
  children,
  ariaLabel,
  disabled = false,
}) => {
  const [imgError, setImgError] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  // Reset error state when src changes
  React.useEffect(() => {
    setImgError(false);
    setIsLoading(true);
  }, [src]);

  const getInitials = (): string => {
    if (!name || name.trim().length === 0) return '?';
    
    const trimmedName = name.trim();
    const parts = trimmedName.split(/\s+/);
    
    if (parts.length === 1) {
      // Single name: take first character
      return parts[0].charAt(0).toUpperCase();
    }
    
    // Multiple names: take first character of first and last name
   
   
    const firstInitial = parts[0].charAt(0);
    const lastInitial = parts[parts.length - 1].charAt(0);
    return (firstInitial + lastInitial).toUpperCase();
  };

  
  
  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setImgError(true);
    setIsLoading(false);
    onError?.(event);
  };

  
  
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled && onClick) {
      onClick(event);
    }
  };

  const avatarContent = (
    <>
      {src && !imgError ? (
        <>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 animate-pulse">
              <svg
                className="w-1/3 h-1/3 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          )}
          <img
            src={src}
            alt={name || 'Avatar'}
            className={twMerge(
              'w-full h-full object-cover transition-opacity duration-200',
              isLoading ? 'opacity-0' : 'opacity-100'
            )}
            onError={handleImageError}
            onLoad={handleImageLoad}
            loading="lazy"
          />
        </>
      ) : (
        <span className="font-semibold select-none">
          {children || getInitials()}
        </span>
      )}
    </>
  );

  return (
    <div
      className={twMerge(
        'relative flex-shrink-0 flex items-center justify-center overflow-hidden font-medium',
        'transition-all duration-200 ease-in-out',
        sizeClasses[size],
        variantClasses[variant],
        shapeClasses[shape],
        onClick && !disabled && 'cursor-pointer hover:opacity-80 hover:scale-105 active:scale-95',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      onClick={handleClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      aria-label={ariaLabel || (name ? `Avatar for ${name}` : 'Avatar')}
      aria-disabled={disabled}
      data-testid="avatar"
    >
      {avatarContent}
      
      {status && (
        <span
          className={twMerge(
            'absolute bottom-0 right-0 rounded-full',
            statusClasses[status],
            statusSizeMap[size]
          )}
          aria-label={`Status: ${status}`}
        />
      )}
    </div>
  );
};

Avatar.displayName = 'Avatar';

export default Avatar;