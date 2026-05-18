import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx } from 'clsx';

// ============================================
// TYPES
// ============================================
interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'underline' | 'pill' | 'box';
  children?: React.ReactNode;
  className?: string;
}

// ============================================
// COMPONENT
// ============================================
export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  onChange,
  variant = 'underline',
  children,
  className,
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  const variants = {
    underline: {
      container: 'border-b border-gray-200 dark:border-gray-700',
      tab: 'px-4 py-3 text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200',
      active: 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400',
    },
    pill: {
      container: 'bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl',
      tab: 'px-5 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl',
      active: 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg shadow-blue-500/10',
    },
    box: {
      container: 'border border-gray-200 dark:border-gray-700 rounded-2xl p-1',
      tab: 'px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 rounded-xl',
      active: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25',
    },
  };

  const currentVariant = variants[variant];

  return (
    <div className={className}>
      <div className={clsx('flex items-center gap-1', currentVariant.container)}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleTabChange(tab.id)}
            disabled={tab.disabled}
            className={clsx(
              'relative flex items-center gap-2 transition-all duration-200',
              currentVariant.tab,
              activeTab === tab.id ? currentVariant.active : '',
              tab.disabled && 'opacity-50 cursor-not-allowed'
            )}
          >
            {tab.icon && <span className="w-4 h-4">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && (
              <span className={clsx(
                'px-2 py-0.5 text-xs rounded-full',
                activeTab === tab.id
                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              )}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="mt-6"
        >
          {children || <p>Content for tab: {activeTab}</p>}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export const Tab = Tabs;
export default Tabs;
