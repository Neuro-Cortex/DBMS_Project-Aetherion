// src/components/common/BreadCrumb.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ChevronRight, ChevronLeft } from 'lucide-react';
import { clsx } from 'clsx';

// ============================================
// TYPES
// ============================================

export interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
  active?: boolean;
  disabled?: boolean;
}

export interface BreadCrumbProps {
  items?: BreadcrumbItem[];
  variant?: 'default' | 'glass' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  separator?: React.ReactNode;
  showHome?: boolean;
  className?: string;
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
}

export interface DynamicBreadCrumbProps {
  pathMap?: Record<string, string>;
  variant?: BreadCrumbProps['variant'];
  size?: BreadCrumbProps['size'];
  className?: string;
  basePath?: string;
}

// ============================================
// BREADCRUMB ITEM COMPONENT
// ============================================

const BreadcrumbItemComponent: React.FC<{
  item: BreadcrumbItem;
  isLast: boolean;
  size: 'sm' | 'md' | 'lg';
  variant: 'default' | 'glass' | 'gradient';
  onItemClick?: (item: BreadcrumbItem, index: number) => void;
  index: number;
}> = ({ item, isLast, size, variant, onItemClick, index }) => {
  const sizeClasses = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-1.5 px-2.5',
    lg: 'text-base py-2 px-3',
  };

  const variantClasses = {
    default: 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
    glass: 'text-white/70 hover:text-white backdrop-blur-sm',
    gradient: 'text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400',
  };

  const activeClasses = 'font-semibold text-purple-600 dark:text-purple-400 cursor-default';
  const disabledClasses = 'opacity-50 cursor-not-allowed pointer-events-none';

  const combinedClasses = clsx(
    'rounded-lg transition-all duration-200 flex items-center gap-1.5',
    sizeClasses[size],
    item.active && activeClasses,
    item.disabled && disabledClasses,
    !item.active && !item.disabled && variantClasses[variant]
  );

  const handleClick = () => {
    if (!item.disabled && !item.active && onItemClick) {
      onItemClick(item, index);
    }
  };

  const Icon = item.icon;

  return (
    <div className="flex items-center">
      {!isLast && (
        <ChevronRight className={clsx(
          'w-3.5 h-3.5 mx-1',
          variant === 'glass' ? 'text-white/50' : 'text-gray-400'
        )} />
      )}
      
      {item.active ? (
        <span className={combinedClasses}>
          {Icon && <Icon className="w-3.5 h-3.5" />}
          <span>{item.label}</span>
        </span>
      ) : (
        <Link
          to={item.disabled ? '#' : item.path}
          className={combinedClasses}
          onClick={handleClick}
          aria-disabled={item.disabled}
          tabIndex={item.disabled ? -1 : 0}
        >
          {Icon && <Icon className="w-3.5 h-3.5" />}
          <span>{item.label}</span>
        </Link>
      )}
    </div>
  );
};

// ============================================
// MAIN BREADCRUMB COMPONENT
// ============================================

export const BreadCrumb: React.FC<BreadCrumbProps> = ({
  items = [],
  variant = 'default',
  size = 'md',
  separator,
  showHome = true,
  className,
  onItemClick,
}) => {
  const location = useLocation();
  
  // Generate default items from current path if no items provided
  const defaultItems = React.useMemo(() => {
    if (items.length > 0) return items;
    
    const pathnames = location.pathname.split('/').filter(x => x);
    
    return pathnames.map((pathname, index) => {
      const path = `/${pathnames.slice(0, index + 1).join('/')}`;
      const label = pathname.charAt(0).toUpperCase() + pathname.slice(1);
      return {
        label,
        path,
        active: index === pathnames.length - 1,
      };
    });
  }, [items, location.pathname]);

  return (
    <nav
      className={clsx(
        'flex items-center flex-wrap',
        variant === 'glass' && 'bg-white/10 backdrop-blur-sm rounded-lg p-2',
        variant === 'gradient' && 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg p-2',
        className
      )}
      aria-label="Breadcrumb"
    >
      <div className="flex items-center flex-wrap">
        {showHome && (
          <div className="flex items-center">
            <Link
              to="/"
              className={clsx(
                'rounded-lg transition-all duration-200 flex items-center gap-1.5',
                size === 'sm' && 'text-xs py-1 px-2',
                size === 'md' && 'text-sm py-1.5 px-2.5',
                size === 'lg' && 'text-base py-2 px-3',
                variant === 'default' && 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200',
                variant === 'glass' && 'text-white/70 hover:text-white',
                variant === 'gradient' && 'text-gray-600 hover:text-purple-600 dark:text-gray-400 dark:hover:text-purple-400'
              )}
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
            {defaultItems.length > 0 && (
              <>
                {separator || (
                  <ChevronRight className={clsx(
                    'w-3.5 h-3.5 mx-1',
                    variant === 'glass' ? 'text-white/50' : 'text-gray-400'
                  )} />
                )}
              </>
            )}
          </div>
        )}
        
        {defaultItems.map((item, index) => (
          <BreadcrumbItemComponent
            key={item.path}
            item={item}
            isLast={index === defaultItems.length - 1}
            size={size}
            variant={variant}
            onItemClick={onItemClick}
            index={index}
          />
        ))}
      </div>
    </nav>
  );
};

// ============================================
// DYNAMIC BREADCRUMB COMPONENT
// ============================================

export const DynamicBreadCrumb: React.FC<DynamicBreadCrumbProps> = ({
  pathMap = {},
  variant = 'default',
  size = 'md',
  className,
  basePath = '',
}) => {
  const location = useLocation();
  const path = location.pathname.replace(basePath, '');
  
  const defaultPathMap: Record<string, string> = {
    dashboard: 'Dashboard',
    doctors: 'Doctors',
    hospitals: 'Hospitals',
    appointments: 'Appointments',
    emergency: 'Emergency Services',
    pharmacy: 'Pharmacy',
    'ai-assistant': 'AI Assistant',
    'women-health': "Women's Health",
    'medical-records': 'Medical Records',
    admin: 'Admin Panel',
    profile: 'Profile',
    settings: 'Settings',
    ...pathMap,
  };

  const segments = path.split('/').filter(Boolean);

  const items: BreadcrumbItem[] = segments.map((segment, i) => {
    const itemPath = '/' + segments.slice(0, i + 1).join('/');
    const fullPath = basePath + itemPath;
    const label = defaultPathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1);
    const icon = i === 0 ? Home : undefined;

    return {
      label,
      path: fullPath,
      icon,
      active: i === segments.length - 1,
      disabled: false,
    };
  });

  // Add home item if not already there
  if (items.length > 0 && items[0].label !== 'Home') {
    items.unshift({
      label: 'Home',
      path: basePath || '/',
      icon: Home,
      active: false,
      disabled: false,
    });
  }

  return <BreadCrumb items={items} variant={variant} size={size} className={className} />;
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default BreadCrumb;