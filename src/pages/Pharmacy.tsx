// src/pages/Pharmacy.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Pill, Search, Filter, MapPin, Star, Phone, 
  Clock, Truck, CreditCard, Shield, AlertCircle,
  TrendingUp, TrendingDown, Package, DollarSign,
  Plus, Minus, ShoppingCart, CheckCircle, XCircle,
  Bell, Download, RefreshCw, ChevronRight
} from 'lucide-react';
import { MedicineSearch } from '../components/pharmacy/MedicineSearch';
import { PharmacyCard } from '../components/pharmacy/PharmacyCard';
import { StockIndicator } from '../components/pharmacy/StockIndicator';
import { GlassmorphicCard } from '../components/ui/GlassmorphicCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { StatCard } from '../components/dashboard/StatCard';

// ============================================
// TYPES
// ============================================

interface Pharmacy {
  id: string;
  name: string;
  type: '24x7' | 'regular' | 'hospital';
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: { lat: number; lng: number };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  rating: number;
  reviewCount: number;
  operatingHours: {
    open: string;
    close: string;
    is24x7: boolean;
  };
  services: string[];
  paymentMethods: string[];
  delivery: {
    available: boolean;
    radius: number;
    charge: number;
    estimatedTime: string;
  };
  verified: boolean;
  licensed: boolean;
  pharmacists: number;
  inventoryCount: number;
  specialties: string[];
  image?: string;
}

interface StockItem {
  id: string;
  medicineId: string;
  medicineName: string;
  currentStock: number;
  minimumStock: number;
  maximumStock: number;
  reorderLevel: number;
  lastRestocked: string;
  nextDelivery: string;
  consumptionRate: number;
  status: 'optimal' | 'low' | 'critical' | 'out-of-stock';
  supplier: string;
  unitPrice: number;
  totalValue: number;
  expiryDate: string;
  batchNumber: string;
}

interface OrderItem {
  id: string;
  medicineName: string;
  quantity: number;
  price: number;
}

// ============================================
// MOCK DATA
// ============================================

const pharmaciesData: Pharmacy[] = [
  { 
    id: '1', 
    name: 'HealthPlus Pharmacy', 
    type: '24x7', 
    location: { address: '123 Main St', city: 'New York', state: 'NY', coordinates: { lat: 40.7128, lng: -74.0060 } }, 
    contact: { phone: '+1 (555) 200-1001', email: 'info@healthplus.com', website: 'www.healthplus.com' }, 
    rating: 4.8, 
    reviewCount: 1250, 
    operatingHours: { open: '00:00', close: '23:59', is24x7: true }, 
    services: ['24/7 Delivery', 'Prescription Refill', 'Home Delivery', 'Online Consultation'], 
    paymentMethods: ['Credit Card', 'Debit Card', 'Cash', 'Insurance'], 
    delivery: { available: true, radius: 10, charge: 0, estimatedTime: '20-30 min' }, 
    verified: true, 
    licensed: true, 
    pharmacists: 8, 
    inventoryCount: 8500, 
    specialties: ['Chronic Care', 'Vaccines', 'Diabetes Care'],
    image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=200&h=150&fit=crop'
  },
  { 
    id: '2', 
    name: 'MediCare Pharmacy', 
    type: 'regular', 
    location: { address: '456 Oak Ave', city: 'New York', state: 'NY', coordinates: { lat: 40.7580, lng: -73.9855 } }, 
    contact: { phone: '+1 (555) 200-2002', email: 'care@medicare.com' }, 
    rating: 4.6, 
    reviewCount: 850, 
    operatingHours: { open: '08:00', close: '22:00', is24x7: false }, 
    services: ['Prescription Refill', 'Home Delivery'], 
    paymentMethods: ['Credit Card', 'Cash'], 
    delivery: { available: true, radius: 5, charge: 2, estimatedTime: '45-60 min' }, 
    verified: true, 
    licensed: true, 
    pharmacists: 5, 
    inventoryCount: 4200, 
    specialties: ['Pediatrics', 'General Medicine']
  },
  { 
    id: '3', 
    name: 'City Pharmacy', 
    type: 'hospital', 
    location: { address: '789 Pine Rd', city: 'Brooklyn', state: 'NY', coordinates: { lat: 40.6782, lng: -73.9442 } }, 
    contact: { phone: '+1 (555) 200-3003', email: 'info@citypharmacy.com' }, 
    rating: 4.5, 
    reviewCount: 620, 
    operatingHours: { open: '09:00', close: '21:00', is24x7: false }, 
    services: ['Prescription Refill'], 
    paymentMethods: ['Credit Card', 'Cash', 'Insurance'], 
    delivery: { available: false, radius: 0, charge: 0, estimatedTime: '' }, 
    verified: true, 
    licensed: true, 
    pharmacists: 4, 
    inventoryCount: 3100, 
    specialties: ['Emergency Medicine']
  },
];

const stockData: StockItem[] = [
  { id: '1', medicineId: 'm1', medicineName: 'Paracetamol 500mg', currentStock: 150, minimumStock: 30, maximumStock: 500, reorderLevel: 50, lastRestocked: '2024-03-01', nextDelivery: '2024-03-20', consumptionRate: 15, status: 'optimal', supplier: 'PharmaCo', unitPrice: 0.5, totalValue: 75, expiryDate: '2025-12-01', batchNumber: 'B2024-001' },
  { id: '2', medicineId: 'm2', medicineName: 'Amoxicillin 500mg', currentStock: 10, minimumStock: 20, maximumStock: 300, reorderLevel: 50, lastRestocked: '2024-02-01', nextDelivery: '2024-03-18', consumptionRate: 8, status: 'critical', supplier: 'MediSupply', unitPrice: 2.0, totalValue: 20, expiryDate: '2025-06-01', batchNumber: 'B2024-002' },
  { id: '3', medicineId: 'm3', medicineName: 'Ibuprofen 400mg', currentStock: 45, minimumStock: 25, maximumStock: 400, reorderLevel: 40, lastRestocked: '2024-03-05', nextDelivery: '2024-03-25', consumptionRate: 12, status: 'low', supplier: 'PharmaCo', unitPrice: 0.75, totalValue: 33.75, expiryDate: '2025-09-01', batchNumber: 'B2024-003' },
  { id: '4', medicineId: 'm4', medicineName: 'Cetirizine 10mg', currentStock: 5, minimumStock: 15, maximumStock: 200, reorderLevel: 25, lastRestocked: '2024-02-20', nextDelivery: '2024-03-22', consumptionRate: 10, status: 'critical', supplier: 'MediSupply', unitPrice: 0.3, totalValue: 1.5, expiryDate: '2025-08-01', batchNumber: 'B2024-004' },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const Pharmacy: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'search' | 'pharmacies' | 'stock'>('search');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [selectedPharmacy, setSelectedPharmacy] = useState<Pharmacy | null>(null);

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartValue = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const lowStockCount = stockData.filter(s => s.status === 'critical' || s.status === 'low').length;
  const totalStockValue = stockData.reduce((sum, s) => sum + s.totalValue, 0);

  const stats = [
    { title: 'Total Pharmacies', value: pharmaciesData.length, icon: Pill, color: 'cyan', trend: '+2' },
    { title: 'Low Stock Items', value: lowStockCount, icon: AlertCircle, color: 'red', trend: '+3' },
    { title: 'Inventory Value', value: `$${totalStockValue.toFixed(0)}K`, icon: DollarSign, color: 'green', trend: '+12%' },
    { title: 'Active Orders', value: '8', icon: Package, color: 'purple', trend: '+5' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Pill className="w-5 h-5 text-cyan-400" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">Pharmacy Hub</h1>
              <Badge variant="gradient" size="sm">Digital Pharmacy</Badge>
            </div>
            <p className="text-white/60">Order medicines, track prescriptions, and manage inventory</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <button
                onClick={() => setShowCart(!showCart)}
                className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
              >
                <ShoppingCart className="w-5 h-5 text-white" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                    {totalCartItems}
                  </span>
                )}
              </button>
              
              {/* Cart Dropdown */}
              <AnimatePresence>
                {showCart && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-black/90 backdrop-blur-xl rounded-xl border border-white/10 shadow-2xl z-50"
                  >
                    <div className="p-4 border-b border-white/10">
                      <h4 className="text-white font-semibold">Your Cart</h4>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {cart.length === 0 ? (
                        <div className="p-8 text-center">
                          <ShoppingCart className="w-12 h-12 text-white/20 mx-auto mb-2" />
                          <p className="text-white/40 text-sm">Cart is empty</p>
                        </div>
                      ) : (
                        cart.map((item, i) => (
                          <div key={i} className="p-3 border-b border-white/10 flex justify-between items-center">
                            <div>
                              <p className="text-white text-sm">{item.medicineName}</p>
                              <p className="text-white/40 text-xs">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-cyan-400 font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        ))
                      )}
                    </div>
                    {cart.length > 0 && (
                      <div className="p-4 border-t border-white/10">
                        <div className="flex justify-between mb-3">
                          <span className="text-white/60">Total:</span>
                          <span className="text-white font-bold">${totalCartValue.toFixed(2)}</span>
                        </div>
                        <Button variant="gradient" size="sm" fullWidth>
                          Checkout
                        </Button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button variant="glass" size="sm" icon={Download} onClick={() => window.print()}>
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <StatCard
              key={i}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              variant="neon"
              color={stat.color as any}
              trend={{ value: parseInt(stat.trend), isPositive: true }}
            />
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 p-1 bg-white/10 rounded-xl w-fit">
          {[
            { id: 'search', label: 'Search Medicines', icon: Search },
            { id: 'pharmacies', label: 'Nearby Pharmacies', icon: MapPin },
            { id: 'stock', label: 'Stock Management', icon: Package },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  activeTab === tab.id 
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg' 
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'search' && (
            <motion.div
              key="search"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <MedicineSearch />
            </motion.div>
          )}

          {activeTab === 'pharmacies' && (
            <motion.div
              key="pharmacies"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pharmaciesData.map((pharmacy, index) => (
                  <motion.div
                    key={pharmacy.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PharmacyCard 
                      pharmacy={pharmacy} 
                      onViewDetails={() => setSelectedPharmacy(pharmacy)}
                    />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'stock' && (
            <motion.div
              key="stock"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <StockIndicator stock={stockData} realTime />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Pharmacy;