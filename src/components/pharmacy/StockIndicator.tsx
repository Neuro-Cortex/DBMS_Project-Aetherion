import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
  Clock,
  RefreshCw,
  BarChart3,
  Filter,
  Bell,
  MessageSquare,
  Plus,
  Minus,
  Activity,
  Database
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { ActivityChart } from '../dashboard/ActivityChart';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface StockItem {
  id: string;
  medicineId: string;
  medicineName: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  lastRestocked: string;
  nextDelivery: string;
  consumptionRate: number; // per day
  status: 'optimal' | 'low' | 'critical' | 'overstocked';
  supplier: string;
  unitPrice: number;
  totalValue: number;
  expiryDate: string;
  batchNumber: string;
}

export interface StockIndicatorProps {
  stock: StockItem[];
  variant?: 'glass' | 'gradient' | 'neon';
  realTime?: boolean;
  updateInterval?: number;
  onReorder?: (itemId: string, quantity: number) => void;
  onAlert?: (message: string) => void;
  className?: string;
}

// ============================================
// STOCK INDICATOR COMPONENT
// ============================================
export const StockIndicator: React.FC<StockIndicatorProps> = ({
  stock: initialStock,
  variant = 'glass',
  realTime = false,
  updateInterval = 5000,
  onReorder,
  onAlert,
  className,
}) => {
  const [stock, setStock] = useState(initialStock);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'critical' | 'low' | 'optimal'>('all');

  // Simulate real-time stock changes
  useEffect(() => {
    if (!realTime) return;

    const interval = setInterval(() => {
      setStock(prev => prev.map(item => {
        const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? -1 : 1) : 0;
        const newStock = Math.max(0, item.currentStock + change);
        
        // Update status based on new stock level
        let newStatus: StockItem['status'] = 'optimal';
        if (newStock <= item.reorderLevel) {
          newStatus = newStock <= item.minimumStock ? 'critical' : 'low';
        }

        // Generate alerts for critical stock
        if (newStatus === 'critical' && !alerts.includes(item.id)) {
          const alert = `CRITICAL: ${item.medicineName} is critically low (Current: ${newStock}, Minimum: ${item.minimumStock})`;
          setAlerts(prev => [...prev, alert]);
          onAlert?.(alert);
        }

        return {
          ...item,
          currentStock: newStock,
          status: newStatus,
          totalValue: newStock * item.unitPrice,
        };
      }));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [realTime, updateInterval, alerts, onAlert]);

  // Clear old alerts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts(prev => prev.filter(alert => !alert.includes('CRITICAL')));
    }, 30000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const filteredStock = stock.filter(item => {
    if (viewMode === 'critical') return item.status === 'critical';
    if (viewMode === 'low') return item.status === 'low';
    if (viewMode === 'optimal') return item.status === 'optimal';
    return true;
  });

  const stockStats = {
    totalItems: stock.length,
    totalValue: stock.reduce((sum, item) => sum + item.totalValue, 0),
    criticalCount: stock.filter(item => item.status === 'critical').length,
    lowCount: stock.filter(item => item.status === 'low').length,
    optimalCount: stock.filter(item => item.status === 'optimal').length,
    overstockedCount: stock.filter(item => item.status === 'overstocked').length,
  };

  const handleReorder = (item: StockItem) => {
    const reorderQuantity = item.maximumStock - item.currentStock;
    onReorder?.(item.id, reorderQuantity);
    
    // Simulate reorder process
    setTimeout(() => {
      setStock(prev => prev.map(stockItem => 
        stockItem.id === item.id 
          ? { ...stockItem, currentStock: item.maximumStock, status: 'optimal' }
          : stockItem
      ));
    }, 2000);
  };

  const statusColors = {
    optimal: 'bg-green-500/10 text-green-300 border-green-500/30',
    low: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    critical: 'bg-red-500/10 text-red-300 border-red-500/30 shadow-lg shadow-red-500/20',
    overstocked: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  } as const;

  return (
    <motion.div
      className={twMerge(
        clsx(
          'space-y-6',
          className
        )
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Stock Management</h2>
          <p className="text-white/60">Real-time inventory tracking and alerts</p>
        </div>

        <Badge variant="info" size="lg">
          <Database className="w-5 h-5 mr-2" />
          LIVE TRACKING
        </Badge>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Items"
          value={stockStats.totalItems}
          icon={Package}
          variant="neon"
          color="blue"
        />
        <StatCard
          title="Total Value"
          value={`$${(stockStats.totalValue / 1000).toFixed(1)}k`}
          icon={DollarSign}
          variant="neon"
          color="green"
        />
        <StatCard
          title="Critical Items"
          value={stockStats.criticalCount}
          icon={AlertTriangle}
          variant="neon"
          color="red"
        />
        <StatCard
          title="Low Stock"
          value={stockStats.lowCount}
          icon={TrendingDown}
          variant="neon"
          color="yellow"
        />
      </div>

      {/* Alerts */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            {alerts.map((alert, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/30"
              >
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <p className="text-white font-medium">{alert}</p>
                </div>
                <Button
                  variant="glassmorphic"
                  size="xs"
                  onClick={() => setAlerts(prev => prev.filter(a => a !== alert))}
                >
                  Dismiss
                </Button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 p-2 bg-white/10 rounded-xl">
        {[
          { id: 'all', label: 'All Items', count: stock.length },
          { id: 'critical', label: 'Critical', count: stockStats.criticalCount },
          { id: 'low', label: 'Low Stock', count: stockStats.lowCount },
          { id: 'optimal', label: 'Optimal', count: stockStats.optimalCount },
        ].map(tab => (
          <Button
            key={tab.id}
            variant={viewMode === tab.id ? 'glass' : 'ghost'}
            size="sm"
            onClick={() => setViewMode(tab.id as any)}
          >
            {tab.label} ({tab.count})
          </Button>
        ))}
      </div>

      {/* Stock List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredStock.map((item, index) => {
            const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            const isExpiringSoon = daysUntilExpiry <= 30;

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                whileHover={{ scale: 1.01 }}
              >
                <GlassmorphicCard
                  variant={variant}
                  className={clsx(
                    'p-0 overflow-hidden cursor-pointer',
                    item.status === 'critical' && 'border-2 border-red-500/50 shadow-lg shadow-red-500/20'
                  )}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={clsx(
                            'p-3 rounded-xl',
                            item.status === 'critical' && 'bg-red-500/10 text-red-300',
                            item.status === 'low' && 'bg-yellow-500/10 text-yellow-300',
                            item.status === 'optimal' && 'bg-green-500/10 text-green-300',
                            item.status === 'overstocked' && 'bg-blue-500/10 text-blue-300'
                          )}
                        >
                          <Package className="w-5 h-5" />
                        </motion.div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-white font-medium truncate">{item.medicineName}</p>
                            <Badge className={statusColors[item.status]} size="xs">
                              {item.status}
                            </Badge>
                            {isExpiringSoon && (
                              <Badge variant="warning" size="xs">
                                <Clock className="w-3 h-3 mr-1" />
                                Expires in {daysUntilExpiry}d
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-white/60">
                            Batch: {item.batchNumber} • Exp: {new Date(item.expiryDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-black text-white">${item.unitPrice}</p>
                        <p className="text-xs text-white/60">Value: ${item.totalValue.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-white/5 rounded-xl">
                        <p className="text-sm text-white/60 mb-1">Current Stock</p>
                        <motion.p 
                          className="text-xl font-bold text-white"
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          {item.currentStock}
                        </motion.p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl">
                        <p className="text-sm text-white/60 mb-1">Reorder Level</p>
                        <p className="text-white font-medium">{item.reorderLevel}</p>
                      </div>
                      <div className="p-3 bg-white/5 rounded-xl">
                        <p className="text-sm text-white/60 mb-1">Daily Use</p>
                        <p className="text-white font-medium">{item.consumptionRate}/day</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-white/60">Supplier: {item.supplier}</p>
                        <Badge variant="outline" size="xs">
                          Next: {new Date(item.nextDelivery).toLocaleDateString()}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="glassmorphic"
                          size="xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            // View history
                          }}
                        >
                          History
                        </Button>
                        {item.status === 'critical' && (
                          <Button
                            variant="danger"
                            size="xs"
                            leftIcon={Plus}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReorder(item);
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            Emergency Reorder
                          </Button>
                        )}
                        {item.status === 'low' && (
                          <Button
                            variant="warning"
                            size="xs"
                            leftIcon={Plus}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleReorder(item);
                            }}
                          >
                            Reorder
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Stock Details Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900/90 border border-white/20 rounded-2xl shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white">{selectedItem.medicineName}</h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedItem(null)}
                    className="p-2 text-white/40 hover:text-white/70"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Stock Levels */}
                <GlassmorphicCard variant="glass">
                  <h3 className="text-lg font-bold text-white mb-4">Stock Levels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-sm text-white/60 mb-1">Current Stock</p>
                      <p className="text-3xl font-black text-white">{selectedItem.currentStock}</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-sm text-white/60 mb-1">Total Value</p>
                      <p className="text-2xl font-bold text-green-400">${selectedItem.totalValue.toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="mt-4 w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${(selectedItem.currentStock / selectedItem.maximumStock) * 100}%` }}
                      transition={{ duration: 1, type: 'spring' }}
                    />
                  </div>

                  <div className="flex justify-between mt-2 text-xs text-white/60">
                    <span>Min: {selectedItem.minimumStock}</span>
                    <span>Reorder: {selectedItem.reorderLevel}</span>
                    <span>Max: {selectedItem.maximumStock}</span>
                  </div>
                </GlassmorphicCard>

                {/* Supply Chain */}
                <GlassmorphicCard variant="glass">
                  <h3 className="text-lg font-bold text-white mb-4">Supply Chain</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-white/70">Supplier:</span>
                      <span className="text-white font-medium">{selectedItem.supplier}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Last Restocked:</span>
                      <span className="text-white">{new Date(selectedItem.lastRestocked).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Next Delivery:</span>
                      <span className="text-white">{new Date(selectedItem.nextDelivery).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Daily Consumption:</span>
                      <span className="text-white">{selectedItem.consumptionRate} units/day</span>
                    </div>
                  </div>
                </GlassmorphicCard>

                {/* Batch & Expiry */}
                <GlassmorphicCard variant="glass">
                  <h3 className="text-lg font-bold text-white mb-4">Batch Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-white/60 mb-1">Batch Number</p>
                      <p className="text-white font-mono">{selectedItem.batchNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-white/60 mb-1">Expiry Date</p>
                      <p className="text-white">{new Date(selectedItem.expiryDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </GlassmorphicCard>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <Button
                    variant="glassmorphic"
                    size="lg"
                    onClick={() => setSelectedItem(null)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="gradient"
                    size="lg"
                    leftIcon={Plus}
                    onClick={() => {
                      handleReorder(selectedItem);
                      setSelectedItem(null);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Reorder Stock
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stock Chart */}
      <ActivityChart
        variant="bar"
        title="Stock Value Trend (7 Days)"
        realTime={true}
        height={250}
      />

      {/* Reorder Suggestions */}
      <GlassmorphicCard variant={variant}>
        <h3 className="text-xl font-bold text-white mb-4">Reorder Suggestions</h3>
        <div className="space-y-3">
          {stock.filter(item => item.status === 'critical' || item.status === 'low').map(item => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all"
            >
              <div>
                <p className="text-white font-medium">{item.medicineName}</p>
                <p className="text-sm text-white/60">
                  Current: {item.currentStock} | Reorder: {item.maximumStock - item.currentStock}
                </p>
              </div>
              <Button
                variant="gradient"
                size="sm"
                onClick={() => handleReorder(item)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Reorder {item.maximumStock - item.currentStock}
              </Button>
            </motion.div>
          ))}
          {stock.filter(item => item.status === 'critical' || item.status === 'low').length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
              <p className="text-white/60">All stock levels are optimal!</p>
            </div>
          )}
        </div>
      </GlassmorphicCard>
    </motion.div>
  );
};