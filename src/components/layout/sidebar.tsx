import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight,
  ChevronLeft,
  LayoutDashboard,
  Hospital,
  Stethoscope,
  Users,
  Calendar,
  Activity,
  Pill,
  Baby,
  FileText,
  Settings,
  LogOut,
  Menu
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface SidebarProps {
  variant?: 'glass' | 'gradient' | 'neon' | 'solid';
  collapsed?: boolean;
  onToggle?: () => void;
  activePath?: string;
  onNavigate?: (path: string) => void;
}

export interface SidebarItem {
  title: string;
  path: string;
  icon: React.ElementType;
  badge?: string | number;
  children?: SidebarItem[];
  pro?: boolean;
}

// ============================================
// VARIANT STYLES
// ============================================
const variantStyles = {
  glass: `
    bg-white/10 dark:bg-gray-900/10
    backdrop-blur-2xl backdrop-saturate-150
    border-r border-white/20 dark:border-gray-700/20
  `,
  gradient: `
    bg-gradient-to-b from-purple-600/90 via-pink-600/90 to-red-600/90
    backdrop-blur-xl
    border-r border-white/30
  `,
  neon: `
    bg-gray-900/95 dark:bg-black/95
    border-r-2 border-cyan-500/50
    shadow-[0_0_30px_rgba(6,182,212,0.3)]
  `,
  solid: `
    bg-white dark:bg-gray-800
    border-r border-gray-200 dark:border-gray-700
  `,
};

// ============================================
// SIDEBAR ITEMS DATA
// ============================================
const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    path: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Hospitals',
    path: '/hospitals',
    icon: Hospital,
    badge: 12,
    pro: true,
  },
  {
    title: 'Doctors',
    path: '/doctors',
    icon: Stethoscope,
    badge: 45,
  },
  {
    title: 'Patients',
    path: '/patients',
    icon: Users,
  },
  {
    title: 'Appointments',
    path: '/appointments',
    icon: Calendar,
    badge: 8,
  },
  {
    title: 'Emergency',
    path: '/emergency',
    icon: Activity,
    badge: 'NEW',
  },
  {
    title: 'Pharmacy',
    path: '/pharmacy',
    icon: Pill,
  },
  {
    title: 'Maternal Care',
    path: '/maternal',
    icon: Baby,
    children: [
      {
        title: 'Pregnancy Tracker',
        path: '/maternal/pregnancy',
        icon: Baby,
      },
      {
        title: 'Vaccination',
        path: '/maternal/vaccination',
        icon: FileText,
      },
    ],
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: FileText,
  },
];

// ============================================
// SIDEBAR COMPONENT
// ============================================
export const Sidebar: React.FC<SidebarProps> = ({
  variant = 'glass',
  collapsed = false,
  onToggle,
  activePath = '/dashboard',
  onNavigate,
}) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleItemClick = (item: SidebarItem) => {
    if (item.children) {
      setOpenSubmenu(openSubmenu === item.path ? null : item.path);
    } else {
      onNavigate?.(item.path);
    }
  };

  return (
    <motion.aside
      className={twMerge(
        clsx(
          'fixed left-0 top-20 bottom-0 z-40',
          collapsed ? 'w-20' : 'w-72',
          'transition-all duration-300',
          variantStyles[variant],
          'transform-gpu'
        )
      )}
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className={clsx(
          'absolute -right-3 top-6 w-8 h-8',
          'bg-white/20 dark:bg-gray-700/50',
          'border border-white/30 dark:border-gray-600',
          'rounded-full flex items-center justify-center',
          'text-white backdrop-blur-sm',
          'hover:bg-white/30 transition-colors'
        )}
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </motion.button>

      {/* Sidebar Content */}
      <div className="h-full flex flex-col py-6 overflow-hidden">
        {/* Menu Items */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4">
          {sidebarItems.map((item, index) => {
            const isActive = activePath === item.path || activePath.startsWith(item.path + '/');
            const isOpen = openSubmenu === item.path;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                className="mb-2"
              >
                {/* Main Item */}
                <motion.button
                  whileHover={{ x: collapsed ? 0 : 5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleItemClick(item)}
                  className={clsx(
                    'w-full flex items-center gap-4 px-4 py-3 rounded-2xl',
                    'transition-all duration-300 relative overflow-hidden',
                    isActive
                      ? 'bg-white/20 dark:bg-gray-700/50 text-white'
                      : 'text-white/70 hover:bg-white/10 dark:hover:bg-gray-700/30',
                    'group'
                  )}
                >
                  {/* Icon */}
                  <Icon className={clsx(
                    'w-6 h-6 flex-shrink-0',
                    isActive && 'text-white',
                    !collapsed && 'text-white/70 group-hover:text-white'
                  )} />

                  {/* Title & Badge */}
                  {!collapsed && (
                    <div className="flex-1 flex items-center justify-between">
                      <span className="font-medium text-sm">{item.title}</span>
                      <div className="flex items-center gap-2">
                        {item.badge && (
                          <Badge size="xs" variant={isActive ? 'primary' : 'default'}>
                            {item.badge}
                          </Badge>
                        )}
                        {item.pro && (
                          <Badge size="xs" variant="gradient">
                            PRO
                          </Badge>
                        )}
                        {item.children && (
                          <ChevronRight className={clsx(
                            'w-4 h-4 transition-transform',
                            isOpen && 'rotate-90'
                          )} />
                        )}
                      </div>
                    </div>
                  )}

                  {/* Active Indicator */}
                  {isActive && !collapsed && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-400 rounded-r-full"
                    />
                  )}
                </motion.button>

                {/* Submenu */}
                <AnimatePresence>
                  {item.children && isOpen && !collapsed && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-10 mt-1 overflow-hidden"
                    >
                      {item.children.map((child, childIndex) => {
                        const ChildIcon = child.icon;
                        const isChildActive = activePath === child.path;

                        return (
                          <motion.button
                            key={child.path}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: childIndex * 0.05 }}
                            onClick={() => onNavigate?.(child.path)}
                            className={clsx(
                              'w-full flex items-center gap-3 px-4 py-2 rounded-xl mb-1',
                              'text-white/60 hover:text-white hover:bg-white/10',
                              'transition-all duration-300',
                              isChildActive && 'bg-white/10 text-white'
                            )}
                          >
                            <ChildIcon className="w-4 h-4 flex-shrink-0" />
                            <span className="text-sm font-medium">{child.title}</span>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Section */}
        <div className="px-4 border-t border-white/20 pt-4">
          {/* Settings */}
          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate?.('/settings')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-white/70 hover:bg-white/10 hover:text-white transition-all mb-2"
          >
            <Settings className="w-6 h-6 flex-shrink-0" />
            {!collapsed && <span className="font-medium text-sm">Settings</span>}
          </motion.button>

          {/* Logout */}
          <motion.button
            whileHover={{ x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate?.('/logout')}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl text-red-300 hover:bg-red-500/10 hover:text-red-200 transition-all"
          >
            <LogOut className="w-6 h-6 flex-shrink-0" />
            {!collapsed && <span className="font-medium text-sm">Logout</span>}
          </motion.button>
        </div>
      </div>
    </motion.aside>
  );
};