import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Activity, TrendingUp, Users, Calendar } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { twMerge } from 'tailwind-merge';

// ============================================
// CHART REGISTRATION
// ============================================
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// ============================================
// TYPES & INTERFACES
// ============================================
export interface ActivityChartProps {
  variant?: 'line' | 'bar' | 'pie' | 'doughnut';
  title?: string;
  data?: any;
  realTime?: boolean;
  updateInterval?: number;
  height?: number;
  className?: string;
  showControls?: boolean;
}

// ============================================
// DEFAULT DATA
// ============================================
const defaultLineData = {
  labels: ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00'],
  datasets: [
    {
      label: 'Patient Visits',
      data: [12, 19, 15, 25, 22, 30, 28],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true,
    },
    {
      label: 'Emergency Cases',
      data: [5, 8, 6, 12, 10, 15, 13],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      fill: true,
    },
  ],
};

const defaultPieData = {
  labels: ['Cardiology', 'Neurology', 'Pediatrics', 'Emergency', 'Surgery'],
  datasets: [
    {
      data: [30, 25, 20, 15, 10],
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(236, 72, 153, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(34, 197, 94, 0.8)',
      ],
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 2,
    },
  ],
};

// ============================================
// ACTIVITY CHART COMPONENT
// ============================================
export const ActivityChart: React.FC<ActivityChartProps> = ({
  variant = 'line',
  title = 'Activity Overview',
  data,
  realTime = false,
  updateInterval = 3000,
  height = 300,
  className,
  showControls = true,
}) => {
  const [chartData, setChartData] = useState(data || defaultLineData);
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [loading, setLoading] = useState(false);

  // Real-time updates
  useEffect(() => {
    if (!realTime) return;

    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = { ...prev };
        newData.datasets = prev.datasets.map(dataset => ({
          ...dataset,
          data: dataset.data.map(value => {
            const change = Math.random() * 10 - 5;
            return Math.max(0, value + change);
          }),
        }));
        return newData;
      });
    }, updateInterval);

    return () => clearInterval(interval);
  }, [realTime, updateInterval]);

  // Chart options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'white',
        bodyColor: 'white',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
      },
    },
    scales: variant !== 'pie' && variant !== 'doughnut' ? {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.05)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.6)',
        },
      },
    } : {},
    animation: {
      duration: 1000,
      easing: 'easeInOutQuart',
    },
  };

  // Change time range
  const handleTimeRangeChange = async (range: '24h' | '7d' | '30d') => {
    setLoading(true);
    setTimeRange(range);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Update data based on range
    const multiplier = range === '7d' ? 7 : range === '30d' ? 30 : 1;
    setChartData(prev => ({
      ...prev,
      labels: range === '24h' 
        ? ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00', '24:00']
        : range === '7d'
        ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        : ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: prev.datasets.map(dataset => ({
        ...dataset,
        data: dataset.data.map(v => Math.floor(v * multiplier * (0.8 + Math.random() * 0.4))),
      })),
    }));
    
    setLoading(false);
  };

  // Chart component mapping
  const ChartComponent = {
    line: Line,
    bar: Bar,
    pie: Pie,
    doughnut: Pie,
  }[variant];

  const chartDataToUse = variant === 'pie' || variant === 'doughnut' ? defaultPieData : chartData;

  return (
    <motion.div
      className={twMerge(
        clsx(
          'relative p-6 rounded-2xl overflow-hidden',
          'bg-white/10 dark:bg-gray-900/10',
          'backdrop-blur-xl backdrop-saturate-150',
          'border border-white/20 dark:border-gray-700/20',
          'shadow-2xl',
          className
        )
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-sm text-white/60">Real-time data visualization</p>
        </div>

        {showControls && (
          <div className="flex items-center gap-2">
            <Button
              variant="glassmorphic"
              size="xs"
              onClick={() => handleTimeRangeChange('24h')}
              className={timeRange === '24h' ? 'bg-white/20' : ''}
            >
              24H
            </Button>
            <Button
              variant="glassmorphic"
              size="xs"
              onClick={() => handleTimeRangeChange('7d')}
              className={timeRange === '7d' ? 'bg-white/20' : ''}
            >
              7D
            </Button>
            <Button
              variant="glassmorphic"
              size="xs"
              onClick={() => handleTimeRangeChange('30d')}
              className={timeRange === '30d' ? 'bg-white/20' : ''}
            >
              30D
            </Button>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 rounded-2xl z-10 flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full mx-auto mb-4"
              />
              <p className="text-white">Loading data...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chart */}
      <div style={{ height: `${height}px` }}>
        <ChartComponent data={chartDataToUse} options={options as any} />
      </div>

      {/* Stats Overlay */}
      <motion.div
        className="absolute top-6 right-6 flex flex-col gap-2"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        {chartData.datasets?.map((dataset, i) => (
          <motion.div
            key={i}
            className="px-3 py-2 bg-black/30 rounded-xl backdrop-blur-sm"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.7 + i * 0.1, type: 'spring' }}
          >
            <p className="text-xs text-white/60">{dataset.label}</p>
            <p className="text-sm font-bold text-white">
              {dataset.data.reduce((a, b) => a + b, 0).toLocaleString()}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};