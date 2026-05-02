// src/components/pharmacy/StockIndicator.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, AlertTriangle, CheckCircle, Clock, TrendingDown, Plus, X, DollarSign
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// ============================================
// TYPES
// ============================================
export interface StockItem {
  id: string;
  medicineName: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  lastRestocked: string;
  nextDelivery: string;
  consumptionRate: number;
  status: string;
  supplier: string;
  unitPrice: number;
  totalValue: number;
  expiryDate: string;
  batchNumber: string;
}

export interface StockIndicatorProps {
  stock?: StockItem[];
  realTime?: boolean;
  onReorder?: (itemId: string, quantity: number) => void;
  onAlert?: (message: string) => void;
  className?: string;
}

// ============================================
// DEFAULT DATA
// ============================================
const defaultStock: StockItem[] = [
  { id: '1', medicineName: 'Paracetamol 500mg', currentStock: 150, minimumStock: 30, maximumStock: 500, reorderLevel: 50, lastRestocked: '2024-03-01', nextDelivery: '2024-03-20', consumptionRate: 15, status: 'optimal', supplier: 'PharmaCo', unitPrice: 0.5, totalValue: 75, expiryDate: '2025-12-01', batchNumber: 'B2024-001' },
  { id: '2', medicineName: 'Amoxicillin 500mg', currentStock: 10, minimumStock: 20, maximumStock: 300, reorderLevel: 50, lastRestocked: '2024-02-01', nextDelivery: '2024-03-18', consumptionRate: 8, status: 'critical', supplier: 'MediSupply', unitPrice: 2.0, totalValue: 20, expiryDate: '2025-06-01', batchNumber: 'B2024-002' },
  { id: '3', medicineName: 'Ibuprofen 400mg', currentStock: 45, minimumStock: 25, maximumStock: 400, reorderLevel: 40, lastRestocked: '2024-03-05', nextDelivery: '2024-03-25', consumptionRate: 12, status: 'low', supplier: 'PharmaCo', unitPrice: 0.75, totalValue: 33.75, expiryDate: '2025-09-01', batchNumber: 'B2024-003' },
  { id: '4', medicineName: 'Cetirizine 10mg', currentStock: 5, minimumStock: 15, maximumStock: 200, reorderLevel: 25, lastRestocked: '2024-02-20', nextDelivery: '2024-03-22', consumptionRate: 10, status: 'critical', supplier: 'MediSupply', unitPrice: 0.3, totalValue: 1.5, expiryDate: '2025-08-01', batchNumber: 'B2024-004' },
  { id: '5', medicineName: 'Omeprazole 20mg', currentStock: 200, minimumStock: 40, maximumStock: 400, reorderLevel: 60, lastRestocked: '2024-03-10', nextDelivery: '2024-04-01', consumptionRate: 20, status: 'optimal', supplier: 'HealthSupply', unitPrice: 1.5, totalValue: 300, expiryDate: '2026-01-01', batchNumber: 'B2024-005' },
];

// ============================================
// MAIN COMPONENT
// ============================================
export const StockIndicator: React.FC<StockIndicatorProps> = ({
  stock: initialStock,
  realTime = false,
  onReorder,
  onAlert,
  className = '',
}) => {
  const [stock, setStock] = useState<StockItem[]>(initialStock || defaultStock);
  const [alerts, setAlerts] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'critical' | 'low' | 'optimal'>('all');

  // Real-time simulation
  useEffect(() => {
    if (!realTime) return;
    const interval = setInterval(() => {
      setStock(prev => prev.map(item => {
        const change = Math.random() > 0.7 ? -1 : 0;
        const newStock = Math.max(0, item.currentStock + change);
        let newStatus = 'optimal';
        if (newStock <= item.reorderLevel) newStatus = newStock <= item.minimumStock ? 'critical' : 'low';
        if (newStatus === 'critical' && !alerts.includes(item.id)) {
          const alert = `⚠️ ${item.medicineName} is critically low (${newStock} remaining)`;
          setAlerts(prev => [...prev, alert]);
          onAlert?.(alert);
        }
        return { ...item, currentStock: newStock, status: newStatus, totalValue: newStock * item.unitPrice };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, [realTime, alerts, onAlert]);

  // Clear alerts
  useEffect(() => {
    if (alerts.length === 0) return;
    const timer = setTimeout(() => setAlerts([]), 30000);
    return () => clearTimeout(timer);
  }, [alerts]);

  const handleReorder = useCallback((item: StockItem) => {
    const quantity = item.maximumStock - item.currentStock;
    onReorder?.(item.id, quantity);
    setStock(prev => prev.map(s => s.id === item.id ? { ...s, currentStock: item.maximumStock, status: 'optimal' as const } : s));
  }, [onReorder]);

  const filteredStock = useMemo(() => {
    if (viewMode === 'critical') return stock.filter(s => s.status === 'critical');
    if (viewMode === 'low') return stock.filter(s => s.status === 'low');
    if (viewMode === 'optimal') return stock.filter(s => s.status === 'optimal');
    return stock;
  }, [stock, viewMode]);

  const stats = useMemo(() => ({
    totalItems: stock.length,
    totalValue: stock.reduce((sum, s) => sum + s.totalValue, 0),
    criticalCount: stock.filter(s => s.status === 'critical').length,
    lowCount: stock.filter(s => s.status === 'low').length,
  }), [stock]);

  const statusStyles: Record<string, string> = {
    optimal: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    low: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const statCards = [
    { label: 'Total Items', value: stats.totalItems, icon: Package, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Total Value', value: `$${(stats.totalValue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Critical', value: stats.criticalCount, icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10' },
    { label: 'Low Stock', value: stats.lowCount, icon: TrendingDown, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  ];

  return (
    <div className={`space-y-6 ${className}`}>

      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-[-0.02em]">Stock Management</h2>
          <p className="text-white/35 text-sm mt-1">Real-time inventory tracking & alerts</p>
        </div>
        {realTime && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span className="text-emerald-400 text-[10px] font-medium">Live</span>
          </div>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -2 }} className={`${stat.bg} rounded-xl border border-white/[0.06] p-4 text-center`}>
              <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.color}`} />
              <div className="text-xl font-bold text-white">{stat.value}</div>
              <div className="text-white/35 text-[11px] font-medium">{stat.label}</div>
            </motion.div>
          );
        })}
      </div>

      {/* ALERTS */}
      <AnimatePresence>
        {alerts.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-2 overflow-hidden">
            {alerts.map((alert, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                  <p className="text-white text-sm">{alert}</p>
                </div>
                <button type="button" onClick={() => setAlerts(prev => prev.filter(a => a !== alert))} className="text-white/40 hover:text-white/70 text-xs">Dismiss</button>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FILTER TABS */}
      <div className="flex items-center gap-1 bg-white/[0.02] rounded-xl p-1 w-fit">
        {[
          { id: 'all' as const, label: 'All', count: stock.length },
          { id: 'critical' as const, label: 'Critical', count: stats.criticalCount },
          { id: 'low' as const, label: 'Low', count: stats.lowCount },
          { id: 'optimal' as const, label: 'Optimal', count: stock.filter(s => s.status === 'optimal').length },
        ].map(tab => (
          <button key={tab.id} type="button" onClick={() => setViewMode(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === tab.id ? 'bg-white/[0.08] text-white' : 'text-white/40 hover:text-white/70'}`}>
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* STOCK LIST */}
      <div className="space-y-3">
        {filteredStock.map((item) => {
          const daysUntilExpiry = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / 86400000);
          const stockPct = Math.round((item.currentStock / item.reorderLevel) * 100);

          return (
            <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }} onClick={() => setSelectedItem(item)}
              className={`bg-white/[0.015] rounded-xl border p-4 cursor-pointer transition-all ${
                item.status === 'critical' ? 'border-red-500/20 bg-red-500/[0.02]' : 'border-white/[0.06] hover:border-white/[0.12]'
              }`}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${statusStyles[item.status]}`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">{item.medicineName}</p>
                      <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium border ${statusStyles[item.status]}`}>{item.status}</span>
                      {daysUntilExpiry <= 30 && <Badge variant="warning" size="xs">Exp: {daysUntilExpiry}d</Badge>}
                    </div>
                    <p className="text-white/25 text-[10px] mt-0.5">Batch: {item.batchNumber} • Supplier: {item.supplier}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${item.unitPrice}</p>
                  <p className="text-white/25 text-[10px]">Value: ${item.totalValue}</p>
                </div>
              </div>

              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-[10px]">
                  <span className="text-white/30">Stock</span>
                  <span className={`font-medium ${item.currentStock <= item.minimumStock ? 'text-red-400' : 'text-white/50'}`}>{item.currentStock} / {item.reorderLevel}</span>
                </div>
                <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${stockPct < 50 ? 'bg-red-500' : stockPct < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(stockPct, 100)}%` }} />
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
                <span className="text-white/25 text-[10px]">Daily: {item.consumptionRate} • Next: {item.nextDelivery}</span>
                {(item.status === 'critical' || item.status === 'low') && (
                  <Button variant="glass" size="xs" onClick={(e) => { e.stopPropagation(); handleReorder(item); }} className="gap-1">
                    <Plus className="w-3 h-3" /> Reorder
                  </Button>
                )}
              </div>
            </motion.div>
          );
        })}
        {filteredStock.length === 0 && (
          <div className="text-center py-12">
            <CheckCircle className="w-10 h-10 text-emerald-400/50 mx-auto mb-3" />
            <p className="text-white/40 text-sm">All stock levels are optimal!</p>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedItem(null)} />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-lg bg-[#0a0a10] border border-white/[0.08] rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="p-6 border-b border-white/[0.04] flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">{selectedItem.medicineName}</h3>
                <button type="button" onClick={() => setSelectedItem(null)} className="p-1.5 hover:bg-white/[0.06] rounded-lg">
                  <X className="w-5 h-5 text-white/40" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Current Stock', value: selectedItem.currentStock },
                    { label: 'Min Stock', value: selectedItem.minimumStock },
                    { label: 'Reorder Level', value: selectedItem.reorderLevel },
                    { label: 'Max Stock', value: selectedItem.maximumStock },
                    { label: 'Unit Price', value: `$${selectedItem.unitPrice}` },
                    { label: 'Total Value', value: `$${selectedItem.totalValue}` },
                    { label: 'Daily Use', value: `${selectedItem.consumptionRate}/day` },
                    { label: 'Supplier', value: selectedItem.supplier },
                  ].map((item) => (
                    <div key={item.label} className="p-2.5 bg-white/[0.02] rounded-lg">
                      <p className="text-white/30 text-[10px] uppercase tracking-wider">{item.label}</p>
                      <p className="text-white/60 text-xs mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] text-white/30"><span>Batch</span><span>{selectedItem.batchNumber}</span></div>
                  <div className="flex justify-between text-[10px] text-white/30"><span>Expiry</span><span>{selectedItem.expiryDate}</span></div>
                  <div className="flex justify-between text-[10px] text-white/30"><span>Last Restocked</span><span>{selectedItem.lastRestocked}</span></div>
                  <div className="flex justify-between text-[10px] text-white/30"><span>Next Delivery</span><span>{selectedItem.nextDelivery}</span></div>
                </div>
                <div className="flex gap-3 pt-2">
                  <Button variant="glass" size="sm" onClick={() => setSelectedItem(null)} className="flex-1 justify-center">Close</Button>
                  <Button variant="gradient" size="sm" onClick={() => { handleReorder(selectedItem); setSelectedItem(null); }} className="flex-1 justify-center gap-1"><Plus className="w-4 h-4" /> Reorder</Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StockIndicator;