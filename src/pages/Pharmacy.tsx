// src/pages/Pharmacy.tsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Pill, Search, MapPin, Star, Phone, Clock, Truck, CreditCard, Shield,
  AlertCircle, Package, DollarSign, ShoppingCart, Download, RefreshCw,
  ChevronRight, CheckCircle, XCircle, Plus, Minus, Heart, TrendingUp,
  Navigation, Users, Award, Filter, SlidersHorizontal, Zap
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatCard } from 'src/components/dashboard/statCard';

// ============================================
// TYPES
// ============================================
interface Pharmacy {
  id: string;
  name: string;
  type: string;
  location: { address: string; city: string; state: string; coordinates?: { lat: number; lng: number } };
  contact: { phone: string; email: string; website?: string };
  rating: number;
  reviewCount: number;
  operatingHours: { open: string; close: string; is24x7: boolean };
  services: string[];
  paymentMethods: string[];
  delivery: { available: boolean; radius: number; charge: number; estimatedTime: string };
  verified: boolean;
  licensed: boolean;
  pharmacists: number;
  inventoryCount: number;
  specialties: string[];
  image?: string;
}

interface StockItem {
  id: string;
  medicineName: string;
  currentStock: number;
  minimumStock: number;
  reorderLevel: number;
  status: string;
  unitPrice: number;
  totalValue: number;
  expiryDate: string;
  batchNumber: string;
}

interface CartItem {
  medicineName: string;
  quantity: number;
  price: number;
}

// ============================================
// MOCK DATA
// ============================================
const pharmaciesData: Pharmacy[] = [
  {
    id: '1', name: 'HealthPlus Pharmacy', type: '24x7',
    location: { address: '123 Main St', city: 'New York', state: 'NY' },
    contact: { phone: '+1 (555) 200-1001', email: 'info@healthplus.com', website: 'www.healthplus.com' },
    rating: 4.8, reviewCount: 1250,
    operatingHours: { open: '00:00', close: '23:59', is24x7: true },
    services: ['24/7 Delivery', 'Prescription Refill', 'Home Delivery', 'Online Consultation'],
    paymentMethods: ['Credit Card', 'Debit Card', 'Cash', 'Insurance'],
    delivery: { available: true, radius: 10, charge: 0, estimatedTime: '20-30 min' },
    verified: true, licensed: true, pharmacists: 8, inventoryCount: 8500,
    specialties: ['Chronic Care', 'Vaccines', 'Diabetes Care']
  },
  {
    id: '2', name: 'MediCare Pharmacy', type: 'regular',
    location: { address: '456 Oak Ave', city: 'New York', state: 'NY' },
    contact: { phone: '+1 (555) 200-2002', email: 'care@medicare.com' },
    rating: 4.6, reviewCount: 850,
    operatingHours: { open: '08:00', close: '22:00', is24x7: false },
    services: ['Prescription Refill', 'Home Delivery'],
    paymentMethods: ['Credit Card', 'Cash'],
    delivery: { available: true, radius: 5, charge: 2, estimatedTime: '45-60 min' },
    verified: true, licensed: true, pharmacists: 5, inventoryCount: 4200,
    specialties: ['Pediatrics', 'General Medicine']
  },
  {
    id: '3', name: 'City Pharmacy', type: 'hospital',
    location: { address: '789 Pine Rd', city: 'Brooklyn', state: 'NY' },
    contact: { phone: '+1 (555) 200-3003', email: 'info@citypharmacy.com' },
    rating: 4.5, reviewCount: 620,
    operatingHours: { open: '09:00', close: '21:00', is24x7: false },
    services: ['Prescription Refill'],
    paymentMethods: ['Credit Card', 'Cash', 'Insurance'],
    delivery: { available: false, radius: 0, charge: 0, estimatedTime: '' },
    verified: true, licensed: true, pharmacists: 4, inventoryCount: 3100,
    specialties: ['Emergency Medicine']
  },
  {
    id: '4', name: 'QuickMeds 24/7', type: '24x7',
    location: { address: '100 Broadway', city: 'New York', state: 'NY' },
    contact: { phone: '+1 (555) 200-4004', email: 'help@quickmeds.com' },
    rating: 4.9, reviewCount: 2100,
    operatingHours: { open: '00:00', close: '23:59', is24x7: true },
    services: ['24/7 Delivery', 'Prescription Refill', 'Online Consultation', 'Vaccination'],
    paymentMethods: ['Credit Card', 'Insurance', 'Apple Pay'],
    delivery: { available: true, radius: 15, charge: 0, estimatedTime: '15-25 min' },
    verified: true, licensed: true, pharmacists: 12, inventoryCount: 12000,
    specialties: ['Chronic Care', 'Pediatrics', 'Vaccines', 'Travel Medicine']
  },
  {
    id: '5', name: 'Green Cross Pharmacy', type: 'regular',
    location: { address: '555 Park Ave', city: 'New York', state: 'NY' },
    contact: { phone: '+1 (555) 200-5005', email: 'info@greencross.com' },
    rating: 4.7, reviewCount: 980,
    operatingHours: { open: '07:00', close: '23:00', is24x7: false },
    services: ['Prescription Refill', 'Home Delivery', 'Compounding'],
    paymentMethods: ['Credit Card', 'Cash', 'Insurance'],
    delivery: { available: true, radius: 8, charge: 1.5, estimatedTime: '30-45 min' },
    verified: true, licensed: true, pharmacists: 6, inventoryCount: 5500,
    specialties: ['Compounding', 'Geriatric Care']
  },
];

const stockData: StockItem[] = [
  { id: '1', medicineName: 'Paracetamol 500mg', currentStock: 150, minimumStock: 30, reorderLevel: 50, status: 'optimal', unitPrice: 0.5, totalValue: 75, expiryDate: '2025-12-01', batchNumber: 'B2024-001' },
  { id: '2', medicineName: 'Amoxicillin 500mg', currentStock: 10, minimumStock: 20, reorderLevel: 50, status: 'critical', unitPrice: 2.0, totalValue: 20, expiryDate: '2025-06-01', batchNumber: 'B2024-002' },
  { id: '3', medicineName: 'Ibuprofen 400mg', currentStock: 45, minimumStock: 25, reorderLevel: 40, status: 'low', unitPrice: 0.75, totalValue: 33.75, expiryDate: '2025-09-01', batchNumber: 'B2024-003' },
  { id: '4', medicineName: 'Cetirizine 10mg', currentStock: 5, minimumStock: 15, reorderLevel: 25, status: 'critical', unitPrice: 0.3, totalValue: 1.5, expiryDate: '2025-08-01', batchNumber: 'B2024-004' },
  { id: '5', medicineName: 'Omeprazole 20mg', currentStock: 200, minimumStock: 40, reorderLevel: 60, status: 'optimal', unitPrice: 1.5, totalValue: 300, expiryDate: '2026-01-01', batchNumber: 'B2024-005' },
  { id: '6', medicineName: 'Metformin 500mg', currentStock: 15, minimumStock: 30, reorderLevel: 45, status: 'low', unitPrice: 0.8, totalValue: 12, expiryDate: '2025-11-01', batchNumber: 'B2024-006' },
];

// ============================================
// SUB-COMPONENTS
// ============================================

// Pharmacy Card (Inline)
const PharmacyCard: React.FC<{ pharmacy: Pharmacy }> = ({ pharmacy }) => {
  const typeColors: Record<string, string> = {
    '24x7': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    regular: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    hospital: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  };

  return (
    <motion.div whileHover={{ y: -4 }}
      className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-5 hover:border-white/[0.12] transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-2xl">💊</div>
          <div>
            <h3 className="text-white font-semibold text-base">{pharmacy.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium border ${typeColors[pharmacy.type]}`}>
                {pharmacy.type === '24x7' ? '24/7 Open' : pharmacy.type}
              </span>
              {pharmacy.verified && <Badge variant="success" size="xs">Verified</Badge>}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1 bg-amber-500/10 rounded-lg px-2 py-1">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-white text-sm font-bold">{pharmacy.rating}</span>
          <span className="text-white/30 text-[10px]">({pharmacy.reviewCount})</span>
        </div>
      </div>

      {/* Info */}
      <div className="space-y-2 mb-4">
        <span className="flex items-center gap-1.5 text-white/40 text-xs"><MapPin className="w-3.5 h-3.5" />{pharmacy.location.address}</span>
        <span className="flex items-center gap-1.5 text-white/40 text-xs"><Phone className="w-3.5 h-3.5" />{pharmacy.contact.phone}</span>
        {pharmacy.delivery.available && (
          <span className="flex items-center gap-1.5 text-emerald-400 text-xs"><Truck className="w-3.5 h-3.5" />Delivery: {pharmacy.delivery.estimatedTime} • ${pharmacy.delivery.charge === 0 ? 'Free' : pharmacy.delivery.charge}</span>
        )}
      </div>

      {/* Specialties */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {pharmacy.specialties.map((s) => (
          <span key={s} className="px-2 py-0.5 rounded-full bg-white/[0.02] text-white/35 text-[10px] border border-white/[0.04]">{s}</span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-white/[0.04]">
        <span className="text-white/25 text-[10px]">{pharmacy.pharmacists} pharmacists • {pharmacy.inventoryCount.toLocaleString()} items</span>
        <Button variant="glass" size="xs" className="gap-1"><ShoppingCart className="w-3 h-3" />Order</Button>
      </div>
    </motion.div>
  );
};

// Stock Card (Inline)
const StockCard: React.FC<{ item: StockItem }> = ({ item }) => {
  const statusStyles: Record<string, string> = {
    optimal: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    low: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    critical: 'bg-red-500/10 text-red-400 border-red-500/20',
    'out-of-stock': 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  };

  const stockPct = Math.round((item.currentStock / item.reorderLevel) * 100);

  return (
    <motion.div whileHover={{ y: -2 }}
      className="bg-white/[0.015] rounded-xl border border-white/[0.06] p-4 hover:border-white/[0.12] transition-all">
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-white text-sm font-medium">{item.medicineName}</p>
          <p className="text-white/25 text-[10px] mt-0.5">Batch: {item.batchNumber} • Exp: {item.expiryDate}</p>
        </div>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusStyles[item.status]}`}>{item.status}</span>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className="text-white/30">Stock</span>
          <span className={`font-medium ${item.currentStock <= item.minimumStock ? 'text-red-400' : 'text-white/50'}`}>{item.currentStock} / {item.reorderLevel}</span>
        </div>
        <div className="h-1.5 bg-white/[0.04] rounded-full overflow-hidden">
          <div className={`h-full rounded-full ${stockPct < 50 ? 'bg-red-500' : stockPct < 80 ? 'bg-amber-500' : 'bg-emerald-500'}`} style={{ width: `${Math.min(stockPct, 100)}%` }} />
        </div>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
        <span className="text-white/30 text-[10px]">${item.unitPrice}/unit</span>
        <span className="text-white/50 text-xs font-bold">${item.totalValue}</span>
      </div>
    </motion.div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export const Pharmacy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'pharmacies' | 'stock'>('pharmacies');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const lowStockCount = stockData.filter(s => s.status === 'critical' || s.status === 'low').length;
  const totalStockValue = stockData.reduce((sum, s) => sum + s.totalValue, 0);

  const filteredPharmacies = useMemo(() => {
    if (!searchQuery) return pharmaciesData;
    const q = searchQuery.toLowerCase();
    return pharmaciesData.filter(p => p.name.toLowerCase().includes(q) || p.location.city.toLowerCase().includes(q));
  }, [searchQuery]);

  const statCards = [
    { title: 'Total Pharmacies', value: pharmaciesData.length, icon: Pill, color: 'cyan' as const, change: '+2', trend: 'up' as const },
    { title: 'Low Stock Items', value: lowStockCount, icon: AlertCircle, color: 'red' as const, change: '-3', trend: 'down' as const },
    { title: 'Inventory Value', value: `$${(totalStockValue / 1000).toFixed(1)}K`, icon: DollarSign, color: 'green' as const, change: '+12%', trend: 'up' as const },
    { title: 'Active Orders', value: '8', icon: Package, color: 'purple' as const, change: '+5', trend: 'up' as const },
  ];

  return (
    <div className="min-h-screen bg-[#050508]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-6 border-b border-white/[0.04]">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center shadow-xl shadow-cyan-500/20">
              <Pill className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-[-0.02em]">Pharmacy Hub</h1>
                <Badge variant="success" size="xs">Digital Pharmacy</Badge>
              </div>
              <p className="text-white/35 text-sm mt-1">Order medicines, track prescriptions & manage inventory</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <button type="button" onClick={() => setShowCart(!showCart)}
                className="relative p-2.5 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.06] transition-all">
                <ShoppingCart className="w-5 h-5 text-white/60" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">{totalCartItems}</span>
                )}
              </button>
              <AnimatePresence>
                {showCart && (
                  <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-[#0a0a10] border border-white/[0.08] rounded-2xl shadow-2xl z-50 overflow-hidden">
                    <div className="p-4 border-b border-white/[0.04] flex items-center justify-between">
                      <h4 className="text-white font-semibold text-sm">Shopping Cart</h4>
                      <span className="text-white/30 text-xs">{totalCartItems} items</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto custom-scrollbar">
                      {cart.length === 0 ? (
                        <div className="p-8 text-center">
                          <ShoppingCart className="w-10 h-10 text-white/10 mx-auto mb-2" />
                          <p className="text-white/30 text-sm">Your cart is empty</p>
                        </div>
                      ) : (
                        cart.map((item, i) => (
                          <div key={i} className="flex items-center justify-between p-3 border-b border-white/[0.04]">
                            <div className="min-w-0 flex-1">
                              <p className="text-white text-xs font-medium truncate">{item.medicineName}</p>
                              <p className="text-white/30 text-[10px]">Qty: {item.quantity} × ${item.price}</p>
                            </div>
                            <span className="text-cyan-400 text-sm font-bold ml-3">${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        ))
                      )}
                    </div>
                    {cart.length > 0 && (
                      <div className="p-4 border-t border-white/[0.04]">
                        <div className="flex justify-between mb-3 text-sm">
                          <span className="text-white/40">Total</span>
                          <span className="text-white font-bold">${totalCartValue.toFixed(2)}</span>
                        </div>
                        <Button variant="gradient" size="sm" className="w-full">Checkout</Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button variant="glass" size="sm"><Download className="w-4 h-4 mr-1.5" />Export</Button>
          </div>
        </motion.div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statCards.map((stat, i) => (
            <StatCard key={i} title={stat.title} value={stat.value} icon={stat.icon} color={stat.color} change={stat.change} trend={stat.trend} />
          ))}
        </div>

        {/* TABS + SEARCH */}
        <GlassmorphicCard variant="subtle" padding="sm">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex items-center gap-1 bg-white/[0.03] rounded-xl p-1">
              {[
                { id: 'pharmacies', label: 'Pharmacies', icon: MapPin },
                { id: 'stock', label: 'Stock', icon: Package },
                { id: 'search', label: 'Search', icon: Search },
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-white/[0.08] text-white shadow-lg' : 'text-white/40 hover:text-white/70'}`}>
                    <Icon className="w-4 h-4" />{tab.label}
                  </button>
                );
              })}
            </div>
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..." className="w-full pl-9 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/15 transition-all" />
            </div>
          </div>
        </GlassmorphicCard>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === 'pharmacies' && (
            <motion.div key="pharmacies" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPharmacies.map((pharmacy, index) => (
                  <motion.div key={pharmacy.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <PharmacyCard pharmacy={pharmacy} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'stock' && (
            <motion.div key="stock" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stockData.map((item, index) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                    <StockCard item={item} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'search' && (
            <motion.div key="search" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
              <GlassmorphicCard variant="elevated" padding="lg">
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-white/10 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Medicine Search</h3>
                  <p className="text-white/35 text-sm mb-6">Search thousands of medicines across all pharmacies</p>
                  <div className="relative max-w-md mx-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/25 pointer-events-none" />
                    <input type="text" placeholder="Search medicine name..."
                      className="w-full pl-12 pr-4 py-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl text-white text-base placeholder-white/25 focus:outline-none focus:border-cyan-400/30 transition-all" />
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Pharmacy;