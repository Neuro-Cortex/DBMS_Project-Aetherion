// src/pages/Pharmacy.tsx
// COMPLETE PHARMACY SYSTEM - ALL FEATURES FOR CLIENT & PHARMACY ACCESS
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Search, ShoppingCart, Pill, Truck, Clock, MapPin, Star,
  Phone, AlertCircle, Shield, Brain, Heart, 
   FileText, CreditCard, Wallet, Navigation,
  Bell, ChevronRight, Plus, Minus, X, 
  Camera, Mic, 

} from 'lucide-react';

// ============================================
// EXISTING UI COMPONENTS
// ============================================
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Modal } from 'src/ui/Modal';



// ============================================
// TYPES
// ============================================
interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  type: 'prescription' | 'otc';
  price: number;
  originalPrice: number;
  discount: string;
  stock: number;
  threshold: number;
  expiryDate: string;
  status: 'available' | 'low-stock' | 'out-of-stock' | 'expiring';
  rating: number;
  reviews: number;
  image: string;
  dosage: string;
  sideEffects: string[];
  usageInstructions: string;
  pregnancySafe: boolean;
  breastfeedingSafe: boolean;
  requiresPrescription: boolean;
  drugInteractions: string[];
}

interface CartItem {
  medicine: Medicine;
  quantity: number;
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'cod' | 'online';
  trackingId?: string;
  estimatedDelivery?: string;
}

interface Prescription {
  id: string;
  doctorName: string;
  date: string;
  image: string;
  status: 'verified' | 'pending' | 'rejected';
  medicines: string[];
}

interface Pharmacy {
  id: string;
  name: string;
  location: string;
  distance: string;
  rating: number;
  open24x7: boolean;
  phone: string;
  image: string;
}

// ============================================
// MOCK DATA
// ============================================
const medicinesData: Medicine[] = [
  { id: '1', name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Pain Relief', manufacturer: 'Square Pharma', type: 'otc', price: 15, originalPrice: 20, discount: '25%', stock: 450, threshold: 100, expiryDate: '2027-12-31', status: 'available', rating: 4.5, reviews: 234, image: '💊', dosage: '1-2 tablets every 6 hours', sideEffects: ['Nausea', 'Headache'], usageInstructions: 'Take with food', pregnancySafe: true, breastfeedingSafe: true, requiresPrescription: false, drugInteractions: ['Warfarin'] },
  { id: '2', name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', category: 'Antibiotic', manufacturer: 'Beximco', type: 'prescription', price: 45, originalPrice: 60, discount: '25%', stock: 80, threshold: 200, expiryDate: '2026-06-15', status: 'low-stock', rating: 4.3, reviews: 156, image: '💊', dosage: '1 capsule 3 times daily', sideEffects: ['Diarrhea', 'Rash'], usageInstructions: 'Complete full course', pregnancySafe: false, breastfeedingSafe: true, requiresPrescription: true, drugInteractions: ['Methotrexate'] },
  { id: '3', name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'Gastro', manufacturer: 'Incepta', type: 'prescription', price: 35, originalPrice: 50, discount: '30%', stock: 300, threshold: 150, expiryDate: '2026-09-10', status: 'available', rating: 4.4, reviews: 189, image: '💊', dosage: '1 capsule before breakfast', sideEffects: ['Headache', 'Stomach pain'], usageInstructions: 'Take on empty stomach', pregnancySafe: false, breastfeedingSafe: false, requiresPrescription: true, drugInteractions: ['Clopidogrel'] },
  { id: '4', name: 'Vitamin C 1000mg', genericName: 'Ascorbic Acid', category: 'Vitamin', manufacturer: 'Square Pharma', type: 'otc', price: 25, originalPrice: 35, discount: '28%', stock: 15, threshold: 100, expiryDate: '2026-03-15', status: 'expiring', rating: 4.6, reviews: 312, image: '💊', dosage: '1 tablet daily', sideEffects: ['Stomach upset'], usageInstructions: 'Take after meal', pregnancySafe: true, breastfeedingSafe: true, requiresPrescription: false, drugInteractions: [] },
  { id: '5', name: 'Insulin Glargine', genericName: 'Insulin', category: 'Diabetes', manufacturer: 'Novo Nordisk', type: 'prescription', price: 890, originalPrice: 1200, discount: '26%', stock: 0, threshold: 50, expiryDate: '2026-11-20', status: 'out-of-stock', rating: 4.8, reviews: 89, image: '💉', dosage: 'As prescribed by doctor', sideEffects: ['Hypoglycemia'], usageInstructions: 'Inject subcutaneously', pregnancySafe: true, breastfeedingSafe: true, requiresPrescription: true, drugInteractions: ['Beta blockers'] },
  { id: '6', name: 'Iron Supplement', genericName: 'Ferrous Sulfate', category: 'Women Care', manufacturer: 'Renata', type: 'otc', price: 18, originalPrice: 25, discount: '28%', stock: 500, threshold: 150, expiryDate: '2027-08-20', status: 'available', rating: 4.2, reviews: 145, image: '💊', dosage: '1 tablet daily', sideEffects: ['Constipation'], usageInstructions: 'Take with vitamin C', pregnancySafe: true, breastfeedingSafe: true, requiresPrescription: false, drugInteractions: ['Antacids'] },
  { id: '7', name: 'Calcium + Vitamin D3', genericName: 'Calcium Carbonate', category: 'Women Care', manufacturer: 'Square Pharma', type: 'otc', price: 28, originalPrice: 40, discount: '30%', stock: 350, threshold: 120, expiryDate: '2027-05-15', status: 'available', rating: 4.4, reviews: 198, image: '💊', dosage: '1 tablet twice daily', sideEffects: ['Bloating'], usageInstructions: 'Take after meals', pregnancySafe: true, breastfeedingSafe: true, requiresPrescription: false, drugInteractions: ['Thyroid meds'] },
  { id: '8', name: 'Metformin 500mg', genericName: 'Metformin', category: 'Diabetes', manufacturer: 'ACI', type: 'prescription', price: 22, originalPrice: 30, discount: '27%', stock: 200, threshold: 80, expiryDate: '2027-01-10', status: 'available', rating: 4.5, reviews: 267, image: '💊', dosage: '1 tablet with meals', sideEffects: ['Nausea', 'Diarrhea'], usageInstructions: 'Take with food', pregnancySafe: false, breastfeedingSafe: true, requiresPrescription: true, drugInteractions: ['Contrast dye'] },
];

const categories = ['All', 'Pain Relief', 'Antibiotic', 'Gastro', 'Vitamin', 'Diabetes', 'Women Care', 'Antihistamine', 'Cardiac'];

const pharmaciesData: Pharmacy[] = [
  { id: '1', name: 'Lazz Pharma', location: 'Dhanmondi, Dhaka', distance: '1.2 km', rating: 4.5, open24x7: true, phone: '+880-2-9123456', image: '🏪' },
  { id: '2', name: 'Wellness Pharmacy', location: 'Gulshan, Dhaka', distance: '2.5 km', rating: 4.3, open24x7: false, phone: '+880-2-8834567', image: '🏪' },
  { id: '3', name: 'MediPlus Pharmacy', location: 'Bashundhara, Dhaka', distance: '3.1 km', rating: 4.6, open24x7: true, phone: '+880-2-5501234', image: '🏪' },
];

const mockOrders: Order[] = [
  { id: 'ORD-001', date: '2026-05-20', items: [], total: 380, status: 'delivered', paymentMethod: 'cod', trackingId: 'TRK123' },
  { id: 'ORD-002', date: '2026-05-22', items: [], total: 650, status: 'shipped', paymentMethod: 'online', trackingId: 'TRK456', estimatedDelivery: '2026-05-25' },
];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400', red: 'bg-red-500/10 text-red-400',
  green: 'bg-green-500/10 text-green-400', amber: 'bg-amber-500/10 text-amber-400',
  purple: 'bg-purple-500/10 text-purple-400', cyan: 'bg-cyan-500/10 text-cyan-400',
  emerald: 'bg-emerald-500/10 text-emerald-400', rose: 'bg-rose-500/10 text-rose-400',
  teal: 'bg-teal-500/10 text-teal-400', pink: 'bg-pink-500/10 text-pink-400',
};

// ============================================
// MAIN PHARMACY COMPONENT
// ============================================
const Pharmacy: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector((state: any) => state?.auth?.user) || { name: 'User' };
  
  const [greeting, setGreeting] = useState('');
  const [activeTab, setActiveTab] = useState('browse');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [sosModalOpen, setSosModalOpen] = useState(false);
  const [prescriptions] = useState<Prescription[]>([
    { id: '1', doctorName: 'Dr. Fatema Akter', date: '2026-05-18', image: '📄', status: 'verified', medicines: ['Paracetamol', 'Omeprazole'] },
  ]);
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');
  }, []);

  const filteredMedicines = useMemo(() => {
    let result = [...medicinesData];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.genericName.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.manufacturer.toLowerCase().includes(q)
      );
    }
    if (categoryFilter !== 'All') {
      result = result.filter(m => m.category === categoryFilter);
    }
    return result;
  }, [searchQuery, categoryFilter]);

  const addToCart = useCallback((medicine: Medicine) => {
    setCart(prev => {
      const existing = prev.find(item => item.medicine.id === medicine.id);
      if (existing) {
        return prev.map(item => 
          item.medicine.id === medicine.id 
            ? { ...item, quantity: Math.min(item.quantity + 1, medicine.stock) }
            : item
        );
      }
      return [...prev, { medicine, quantity: 1 }];
    });
  }, []);

  const removeFromCart = useCallback((medicineId: string) => {
    setCart(prev => prev.filter(item => item.medicine.id !== medicineId));
  }, []);

  const updateQuantity = useCallback((medicineId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.medicine.id !== medicineId) return item;
      const newQty = item.quantity + delta;
      if (newQty < 1) return item;
      if (newQty > item.medicine.stock) return item;
      return { ...item, quantity: newQty };
    }));
  }, []);

  const cartTotal = useMemo(() => 
    cart.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0)
  , [cart]);

  const cartCount = useMemo(() => 
    cart.reduce((sum, item) => sum + item.quantity, 0)
  , [cart]);

  const tabs = [
    { id: 'browse', label: '🔍 Browse' },
    { id: 'prescriptions', label: '📄 Prescriptions' },
    { id: 'orders', label: '📦 Orders' },
    { id: 'pharmacies', label: '🏪 Nearby' },
    { id: 'emergency', label: '🚨 Emergency' },
    { id: 'ai', label: '🤖 AI Help' },
    { id: 'women', label: '👩 Women Care' },
  ];

  return (
    <div className="min-h-screen bg-[#030508]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* TOP HEADER */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-xl" />
              <Avatar name={user?.name || 'U'} size="lg" className="relative ring-2 ring-amber-500/20" />
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#030508]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                {greeting}, <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0] || 'User'}</span>
              </h1>
              <p className="text-slate-400 text-sm">Online Pharmacy • Medicines at your doorstep</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] transition-all">
              <Bell className="w-5 h-5 text-slate-400" />
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-[10px] flex items-center justify-center text-white font-bold">3</span>
            </button>
            <Button variant="danger" size="sm" onClick={() => setSosModalOpen(true)}
              className="animate-pulse bg-gradient-to-r from-red-500 to-rose-500 shadow-lg">
              <AlertCircle className="w-4 h-4 mr-1.5" /> SOS
            </Button>
          </div>
        </motion.div>

        {/* SEARCH BAR */}
        <GlassmorphicCard className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search medicines, generic names, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/30 transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all">
                <Mic className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => setShowCart(true)} className="relative flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold hover:bg-amber-500/20 transition-all">
              <ShoppingCart className="w-5 h-5" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full text-xs flex items-center justify-center text-white font-bold">{cartCount}</span>
              )}
            </button>
          </div>
        </GlassmorphicCard>

        {/* TABS */}
        <div className="border-b border-white/[0.06] pb-0 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {tabs.map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-t-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border-b-2 border-amber-500 shadow-lg'
                    : 'text-slate-500 hover:text-white hover:bg-white/[0.02]'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* TAB CONTENT */}
        <AnimatePresence mode="wait">
          
          {/* BROWSE TAB */}
          {activeTab === 'browse' && (
            <motion.div key="browse" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
              
              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setCategoryFilter(cat)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      categoryFilter === cat
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-white/[0.02] text-slate-400 border border-white/[0.04] hover:border-white/[0.1]'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
                {[
                  { icon: Pill, label: 'All Meds', color: 'amber', path: '' },
                  { icon: FileText, label: 'Upload Rx', color: 'blue', path: '' },
                  { icon: Clock, label: 'Reminders', color: 'purple', path: '' },
                  { icon: Truck, label: 'Delivery', color: 'green', path: '' },
                  { icon: MapPin, label: 'Nearby', color: 'red', path: '' },
                  { icon: Brain, label: 'AI Help', color: 'indigo', path: '' },
                  { icon: Heart, label: 'Women Care', color: 'pink', path: '' },
                  { icon: Shield, label: 'Emergency', color: 'rose', path: '' },
                ].map((action, i) => {
                  const Icon = action.icon;
                  const colors = colorMap[action.color] || '';
                  const [bg, text] = colors.split(' ');
                  return (
                    <motion.button key={i} whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.95 }}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] hover:border-white/[0.1] transition-all group">
                      <div className={`p-2.5 rounded-xl ${bg} group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-5 h-5 ${text}`} />
                      </div>
                      <span className="text-white/40 text-[11px] font-medium group-hover:text-white/60 transition-colors text-center">
                        {action.label}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Medicines Grid */}
              <div>
                <h3 className="text-white font-bold text-lg mb-4">
                  {categoryFilter === 'All' ? 'All Medicines' : categoryFilter} ({filteredMedicines.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredMedicines.map((med) => (
                    <motion.div key={med.id} whileHover={{ y: -4 }} className="group">
                      <Card className="p-5 h-full hover:border-amber-500/20 transition-all cursor-pointer"
                        onClick={() => setSelectedMedicine(med)}>
                        {/* Image + Badge */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-3xl">
                            {med.image}
                          </div>
                          <div className="flex flex-col items-end gap-1.5">
                            <Badge variant={med.status === 'available' ? 'success' : med.status === 'low-stock' ? 'warning' : med.status === 'expiring' ? 'danger' : 'default'} className="text-[10px]">
                              {med.status === 'available' ? 'In Stock' : med.status === 'low-stock' ? 'Low Stock' : med.status === 'expiring' ? 'Expiring' : 'Out of Stock'}
                            </Badge>
                            {med.requiresPrescription && (
                              <Badge variant="info" className="text-[10px] flex items-center gap-1">
                                <FileText className="w-3 h-3" /> Rx
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Info */}
                        <h4 className="font-bold text-white text-sm mb-1">{med.name}</h4>
                        <p className="text-xs text-slate-500 mb-2">{med.genericName} • {med.manufacturer}</p>
                        
                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-3">
                          <span className="text-xl font-black text-amber-400">৳{med.price}</span>
                          <span className="text-xs line-through text-slate-600">৳{med.originalPrice}</span>
                          <Badge variant="danger" className="text-[10px]">{med.discount}</Badge>
                        </div>
                        
                        {/* Rating + Stock */}
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                            <span>{med.rating} ({med.reviews})</span>
                          </div>
                          <span>Stock: {med.stock}</span>
                        </div>
                        
                        {/* Add to Cart */}
                        <Button variant="primary" size="sm" disabled={med.status === 'out-of-stock'}
                          onClick={(e) => { e.stopPropagation(); addToCart(med); }}
                          className={`w-full ${med.status === 'out-of-stock' ? 'opacity-50' : 'bg-gradient-to-r from-amber-500 to-orange-500'}`}>
                          {med.status === 'out-of-stock' ? 'Out of Stock' : (
                            <><Plus className="w-4 h-4 mr-1" /> Add to Cart - ৳{med.price}</>
                          )}
                        </Button>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* PRESCRIPTIONS TAB */}
          {activeTab === 'prescriptions' && (
            <motion.div key="prescriptions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">My Prescriptions</h3>
                <Button variant="primary" size="sm" onClick={() => setShowPrescriptionUpload(true)}
                  className="bg-gradient-to-r from-amber-500 to-orange-500">
                  <Camera className="w-4 h-4 mr-2" /> Upload Prescription
                </Button>
              </div>
              {prescriptions.map((pres) => (
                <Card key={pres.id} className="p-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-xl">{pres.image}</div>
                  <div className="flex-1">
                    <h4 className="font-bold text-white">{pres.doctorName}</h4>
                    <p className="text-xs text-slate-500">{pres.date} • {pres.medicines.join(', ')}</p>
                  </div>
                  <Badge variant={pres.status === 'verified' ? 'success' : pres.status === 'pending' ? 'warning' : 'danger'} className="text-[10px]">
                    {pres.status}
                  </Badge>
                  {pres.status === 'verified' && (
                    <Button variant="primary" size="xs" className="bg-amber-500">
                      <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Order
                    </Button>
                  )}
                </Card>
              ))}
              {prescriptions.length === 0 && (
                <div className="text-center py-12">
                  <FileText className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                  <p className="text-slate-400">No prescriptions uploaded yet</p>
                </div>
              )}
            </motion.div>
          )}

          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <h3 className="text-white font-bold text-lg">Order History</h3>
              {mockOrders.map((order) => (
                <Card key={order.id} className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-white">{order.id}</h4>
                      <p className="text-xs text-slate-500">{order.date}</p>
                    </div>
                    <Badge variant={order.status === 'delivered' ? 'success' : order.status === 'shipped' ? 'info' : 'warning'} className="text-[10px]">
                      {order.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Total: <span className="text-white font-bold">৳{order.total}</span></span>
                    <span className="text-slate-400">Payment: {order.paymentMethod.toUpperCase()}</span>
                  </div>
                  {order.trackingId && (
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/[0.06]">
                      <Truck className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-cyan-400">Tracking: {order.trackingId}</span>
                      {order.estimatedDelivery && (
                        <span className="text-xs text-slate-500 ml-auto">ETA: {order.estimatedDelivery}</span>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </motion.div>
          )}

          {/* PHARMACIES TAB */}
          {activeTab === 'pharmacies' && (
            <motion.div key="pharmacies" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <h3 className="text-white font-bold text-lg">Nearby Pharmacies</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {pharmaciesData.map((pharmacy) => (
                  <Card key={pharmacy.id} className="p-5 text-center hover:shadow-lg transition-all">
                    <div className="text-5xl mb-3">{pharmacy.image}</div>
                    <h4 className="font-bold text-white">{pharmacy.name}</h4>
                    <p className="text-xs text-slate-400 flex items-center justify-center gap-1 mt-1">
                      <MapPin className="w-3 h-3 text-red-400" /> {pharmacy.location} • {pharmacy.distance}
                    </p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                      <span className="text-white font-bold">{pharmacy.rating}</span>
                      {pharmacy.open24x7 && (
                        <Badge variant="success" className="text-[10px]">24/7</Badge>
                      )}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="xs" className="flex-1 border-amber-500/30 text-amber-400">
                        <Phone className="w-3.5 h-3.5 mr-1" /> Call
                      </Button>
                      <Button variant="primary" size="xs" className="flex-1 bg-amber-500">
                        <Navigation className="w-3.5 h-3.5 mr-1" /> Directions
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* EMERGENCY TAB */}
          {activeTab === 'emergency' && (
            <motion.div key="emergency" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <GlassmorphicCard className="p-8 text-center bg-gradient-to-br from-red-500/5 to-transparent border-red-500/10">
                <AlertCircle className="w-20 h-20 text-red-400 mx-auto mb-4 animate-pulse" />
                <h2 className="text-2xl font-black text-white mb-2">Emergency Medicine Access</h2>
                <p className="text-slate-400 mb-6">Need urgent medicine? We'll connect you to the nearest 24/7 pharmacy</p>
                <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
                  {[
                    { icon: Phone, label: 'Call Pharmacy', color: 'green' },
                    { icon: Truck, label: 'Emergency Delivery', color: 'red' },
                    { icon: MapPin, label: 'Find Nearest', color: 'blue' },
                  ].map((item) => {
                    const Icon = item.icon;
                    const colors = colorMap[item.color] || '';
                    const [bg, text] = colors.split(' ');
                    return (
                      <button key={item.label} className={`flex flex-col items-center gap-2 p-4 rounded-2xl ${bg} hover:shadow-lg transition-all`}>
                        <Icon className={`w-6 h-6 ${text}`} />
                        <span className="text-white text-xs font-bold">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
                <Button variant="danger" size="lg" className="bg-gradient-to-r from-red-500 to-rose-500">
                  <Phone className="w-5 h-5 mr-2" /> Emergency Medicine Request
                </Button>
              </GlassmorphicCard>
            </motion.div>
          )}

          {/* AI HELP TAB */}
          {activeTab === 'ai' && (
            <motion.div key="ai" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center py-12">
              <Brain className="w-20 h-20 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-black text-white mb-2">AI Medicine Assistant</h2>
              <p className="text-slate-400 mb-2">Symptom Checker • Medicine Recommendations • Drug Interaction Warning</p>
              <p className="text-slate-500 text-sm mb-6">OCR Prescription Scanner • Voice Assistant • Smart Search</p>
              <Button variant="primary" className="bg-gradient-to-r from-purple-500 to-pink-500" onClick={() => navigate('/ai-assistant')}>
                <Brain className="w-5 h-5 mr-2" /> Start AI Chat
              </Button>
            </motion.div>
          )}

          {/* WOMEN CARE TAB */}
          {activeTab === 'women' && (
            <motion.div key="women" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-4">
              <h3 className="text-white font-bold text-lg">Women Health Medicines</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {medicinesData.filter(m => m.category === 'Women Care').map((med) => (
                  <Card key={med.id} className="p-5 text-center">
                    <div className="text-4xl mb-3">{med.image}</div>
                    <h4 className="font-bold text-white">{med.name}</h4>
                    <p className="text-xs text-slate-400">{med.genericName}</p>
                    <div className="flex items-center justify-center gap-2 mt-2">
                      {med.pregnancySafe && <Badge variant="success" className="text-[10px]">🤰 Safe</Badge>}
                      {med.breastfeedingSafe && <Badge variant="info" className="text-[10px]">🤱 Safe</Badge>}
                    </div>
                    <p className="text-lg font-black text-amber-400 mt-2">৳{med.price}</p>
                    <Button variant="primary" size="xs" className="mt-2 bg-amber-500 w-full">
                      <ShoppingCart className="w-3.5 h-3.5 mr-1" /> Add to Cart
                    </Button>
                  </Card>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4 border-pink-500/30 text-pink-400" onClick={() => navigate('/women-care')}>
                View Full Women Care Section <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ============================================ */}
      {/* CART SIDEBAR */}
      {/* ============================================ */}
      <AnimatePresence>
        {showCart && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end">
            <motion.div initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }}
              className="w-full max-w-md bg-slate-900 h-full overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-black text-white flex items-center gap-2">
                    <ShoppingCart className="w-6 h-6 text-amber-400" /> Cart ({cartCount} items)
                  </h2>
                  <button onClick={() => setShowCart(false)} className="p-2 rounded-xl hover:bg-white/[0.05]">
                    <X className="w-5 h-5 text-slate-400" />
                  </button>
                </div>
                
                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                    <p className="text-slate-400">Your cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {cart.map((item) => (
                        <div key={item.medicine.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03]">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-xl">
                            {item.medicine.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white text-sm font-bold truncate">{item.medicine.name}</h4>
                            <p className="text-amber-400 text-xs font-bold">৳{item.medicine.price} × {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <button onClick={() => updateQuantity(item.medicine.id, -1)} className="p-1 rounded-lg bg-white/[0.05] text-slate-400 hover:text-white">
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="text-white text-sm font-bold w-6 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.medicine.id, 1)} className="p-1 rounded-lg bg-white/[0.05] text-slate-400 hover:text-white">
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <button onClick={() => removeFromCart(item.medicine.id)} className="p-1 text-red-400 hover:bg-red-500/10 rounded-lg">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    
                    <div className="border-t border-white/[0.06] pt-4 space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Subtotal</span>
                        <span className="text-white font-bold">৳{cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Delivery Fee</span>
                        <span className="text-emerald-400">Free</span>
                      </div>
                      <div className="flex justify-between text-lg pt-2 border-t border-white/[0.06]">
                        <span className="text-white font-bold">Total</span>
                        <span className="text-amber-400 font-black">৳{cartTotal}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" className="border-amber-500/30 text-amber-400">
                          <Wallet className="w-4 h-4 mr-1" /> COD
                        </Button>
                        <Button variant="primary" className="bg-gradient-to-r from-amber-500 to-orange-500">
                          <CreditCard className="w-4 h-4 mr-1" /> Pay Online
                        </Button>
                      </div>
                      
                      <Button variant="primary" className="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-4 text-lg">
                        <Truck className="w-5 h-5 mr-2" /> Place Order
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* MEDICINE DETAIL MODAL */}
      {/* ============================================ */}
      <AnimatePresence>
        {selectedMedicine && (
          <Modal isOpen={true} onClose={() => setSelectedMedicine(null)} size="lg">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center text-5xl">
                  {selectedMedicine.image}
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-white">{selectedMedicine.name}</h2>
                  <p className="text-slate-400 text-sm">{selectedMedicine.genericName} • {selectedMedicine.manufacturer}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-white font-bold">{selectedMedicine.rating}</span>
                    <span className="text-slate-500 text-sm">({selectedMedicine.reviews} reviews)</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-amber-400">৳{selectedMedicine.price}</p>
                  <p className="text-sm line-through text-slate-600">৳{selectedMedicine.originalPrice}</p>
                  <Badge variant="danger" className="mt-1">{selectedMedicine.discount}</Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-2xl bg-white/[0.03]">
                  <p className="text-xs text-slate-400">Dosage</p>
                  <p className="text-white font-bold text-sm">{selectedMedicine.dosage}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03]">
                  <p className="text-xs text-slate-400">Usage</p>
                  <p className="text-white font-bold text-sm">{selectedMedicine.usageInstructions}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03]">
                  <p className="text-xs text-slate-400">Expiry</p>
                  <p className="text-white font-bold text-sm">{selectedMedicine.expiryDate}</p>
                </div>
                <div className="p-3 rounded-2xl bg-white/[0.03]">
                  <p className="text-xs text-slate-400">Stock</p>
                  <p className="text-white font-bold text-sm">{selectedMedicine.stock} units</p>
                </div>
              </div>
              
              {/* Safety Info */}
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedMedicine.pregnancySafe && <Badge variant="success">🤰 Pregnancy Safe</Badge>}
                {selectedMedicine.breastfeedingSafe && <Badge variant="info">🤱 Breastfeeding Safe</Badge>}
                {selectedMedicine.requiresPrescription && <Badge variant="warning">📄 Prescription Required</Badge>}
              </div>
              
              {/* Side Effects */}
              {selectedMedicine.sideEffects.length > 0 && (
                <div className="mb-4">
                  <p className="text-white font-bold text-sm mb-2">Side Effects:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMedicine.sideEffects.map(effect => (
                      <Badge key={effect} variant="warning" className="text-[10px]">{effect}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Drug Interactions */}
              {selectedMedicine.drugInteractions.length > 0 && (
                <div className="mb-4">
                  <p className="text-white font-bold text-sm mb-2">Drug Interactions:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMedicine.drugInteractions.map(drug => (
                      <Badge key={drug} variant="danger" className="text-[10px]">{drug}</Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <Button variant="primary" size="lg" className="w-full bg-gradient-to-r from-amber-500 to-orange-500"
                onClick={() => { addToCart(selectedMedicine); setSelectedMedicine(null); }}>
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart - ৳{selectedMedicine.price}
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* PRESCRIPTION UPLOAD MODAL */}
      {/* ============================================ */}
      <AnimatePresence>
        {showPrescriptionUpload && (
          <Modal isOpen={true} onClose={() => setShowPrescriptionUpload(false)} size="sm">
            <div className="p-6 text-center">
              <Camera className="w-16 h-16 text-blue-400 mx-auto mb-4" />
              <h2 className="text-xl font-black text-white mb-2">Upload Prescription</h2>
              <p className="text-slate-400 text-sm mb-4">Take a photo or upload your prescription</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <Button variant="outline" className="border-blue-500/30 text-blue-400">
                  <Camera className="w-4 h-4 mr-2" /> Take Photo
                </Button>
                <Button variant="outline" className="border-purple-500/30 text-purple-400">
                  <FileText className="w-4 h-4 mr-2" /> Upload File
                </Button>
              </div>
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 mb-4 text-left">
                <p className="text-white text-sm font-bold mb-1">AI Prescription Scanner</p>
                <p className="text-slate-400 text-xs">Our AI will automatically detect medicines from your prescription</p>
              </div>
              <Button variant="primary" className="w-full bg-gradient-to-r from-blue-500 to-cyan-500">
                <Brain className="w-4 h-4 mr-2" /> Scan & Upload
              </Button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* ============================================ */}
      {/* SOS MODAL */}
      {/* ============================================ */}
      <AnimatePresence>
        {sosModalOpen && (
          <Modal isOpen={true} onClose={() => setSosModalOpen(false)} size="sm">
            <div className="text-center p-8 bg-gradient-to-b from-slate-900 to-slate-950">
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center">
                <AlertCircle className="w-12 h-12 text-red-400" />
              </motion.div>
              <h2 className="text-2xl font-black text-white mb-2">Emergency Medicine</h2>
              <p className="text-slate-400 text-sm mb-8">Connect to nearest 24/7 pharmacy or request ambulance</p>
              <div className="space-y-3">
                <Button variant="danger" size="lg" className="w-full bg-gradient-to-r from-red-500 to-rose-500"
                  onClick={() => { setSosModalOpen(false); navigate('/emergency'); }}>
                  <Phone className="w-5 h-5 mr-2" /> Emergency Medicine Request
                </Button>
                <Button variant="outline" size="lg" className="w-full border-amber-500/30 text-amber-400">
                  <Truck className="w-5 h-5 mr-2" /> Emergency Delivery
                </Button>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setSosModalOpen(false)}>Cancel</Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pharmacy;