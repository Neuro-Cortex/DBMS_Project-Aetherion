// src/pages/Pharmacy.tsx
// COMPLETE PHARMACY SYSTEM - CLIENT CAN USE ALL FEATURES
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Search, MapPin, ShoppingCart, Pill, AlertCircle, Building2,
  Star, Clock, Truck, FileText, Camera, Brain, Heart,
   Shield,  Plus, Minus, X,
 Mic, CreditCard, Wallet, Bell,

} from 'lucide-react';
import { useAppSelector } from '../store';

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
  status: 'available' | 'low-stock' | 'out-of-stock' | 'expiring';
  expiryDate: string;
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
  pharmacies: { name: string; price: number; distance: string; inStock: boolean }[];
  substitutes: string[];
}

interface CartItem {
  medicine: Medicine;
  quantity: number;
}

// ============================================
// MOCK DATA
// ============================================
const medicinesData: Medicine[] = [
  {
    id: '1', name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Pain Relief',
    manufacturer: 'Square Pharma', type: 'otc', price: 15, originalPrice: 20, discount: '25%',
    stock: 450, status: 'available', expiryDate: '2027-12-31', rating: 4.5, reviews: 234,
    image: '💊', dosage: '1-2 tablets every 6 hours', sideEffects: ['Nausea', 'Headache'],
    usageInstructions: 'Take with food', pregnancySafe: true, breastfeedingSafe: true,
    requiresPrescription: false, drugInteractions: ['Warfarin'],
    pharmacies: [
      { name: 'Lazz Pharma', price: 15, distance: '1.2 km', inStock: true },
      { name: 'Wellness Pharmacy', price: 18, distance: '2.5 km', inStock: true },
    ],
    substitutes: ['Napa', 'Ace', 'Xcel'],
  },
  {
    id: '2', name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', category: 'Antibiotic',
    manufacturer: 'Beximco', type: 'prescription', price: 45, originalPrice: 60, discount: '25%',
    stock: 80, status: 'low-stock', expiryDate: '2026-06-15', rating: 4.3, reviews: 156,
    image: '💊', dosage: '1 capsule 3 times daily', sideEffects: ['Diarrhea', 'Rash'],
    usageInstructions: 'Complete full course', pregnancySafe: false, breastfeedingSafe: true,
    requiresPrescription: true, drugInteractions: ['Methotrexate'],
    pharmacies: [
      { name: 'MediPlus Pharmacy', price: 45, distance: '3.1 km', inStock: true },
      { name: 'Lazz Pharma', price: 50, distance: '1.2 km', inStock: false },
    ],
    substitutes: ['Amoxil', 'Moxilin'],
  },
  {
    id: '3', name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'Gastro',
    manufacturer: 'Incepta', type: 'prescription', price: 35, originalPrice: 50, discount: '30%',
    stock: 300, status: 'available', expiryDate: '2026-09-10', rating: 4.4, reviews: 189,
    image: '💊', dosage: '1 capsule before breakfast', sideEffects: ['Headache', 'Stomach pain'],
    usageInstructions: 'Take on empty stomach', pregnancySafe: false, breastfeedingSafe: false,
    requiresPrescription: true, drugInteractions: ['Clopidogrel'],
    pharmacies: [
      { name: 'Wellness Pharmacy', price: 35, distance: '2.5 km', inStock: true },
      { name: 'Lazz Pharma', price: 38, distance: '1.2 km', inStock: true },
    ],
    substitutes: ['Omez', 'Proceptin'],
  },
  {
    id: '4', name: 'Vitamin C 1000mg', genericName: 'Ascorbic Acid', category: 'Vitamin',
    manufacturer: 'Square Pharma', type: 'otc', price: 25, originalPrice: 35, discount: '28%',
    stock: 15, status: 'expiring', expiryDate: '2026-03-15', rating: 4.6, reviews: 312,
    image: '💊', dosage: '1 tablet daily', sideEffects: ['Stomach upset'],
    usageInstructions: 'Take after meal', pregnancySafe: true, breastfeedingSafe: true,
    requiresPrescription: false, drugInteractions: [],
    pharmacies: [
      { name: 'Lazz Pharma', price: 25, distance: '1.2 km', inStock: true },
    ],
    substitutes: ['Ceevit', 'Ascor'],
  },
  {
    id: '5', name: 'Insulin Glargine', genericName: 'Insulin', category: 'Diabetes',
    manufacturer: 'Novo Nordisk', type: 'prescription', price: 890, originalPrice: 1200, discount: '26%',
    stock: 0, status: 'out-of-stock', expiryDate: '2026-11-20', rating: 4.8, reviews: 89,
    image: '💉', dosage: 'As prescribed by doctor', sideEffects: ['Hypoglycemia'],
    usageInstructions: 'Inject subcutaneously', pregnancySafe: true, breastfeedingSafe: true,
    requiresPrescription: true, drugInteractions: ['Beta blockers'],
    pharmacies: [],
    substitutes: ['Lantus', 'Basaglar'],
  },
  {
    id: '6', name: 'Iron Supplement', genericName: 'Ferrous Sulfate', category: 'Women Care',
    manufacturer: 'Renata', type: 'otc', price: 18, originalPrice: 25, discount: '28%',
    stock: 500, status: 'available', expiryDate: '2027-08-20', rating: 4.2, reviews: 145,
    image: '💊', dosage: '1 tablet daily', sideEffects: ['Constipation'],
    usageInstructions: 'Take with vitamin C', pregnancySafe: true, breastfeedingSafe: true,
    requiresPrescription: false, drugInteractions: ['Antacids'],
    pharmacies: [
      { name: 'Lazz Pharma', price: 18, distance: '1.2 km', inStock: true },
      { name: 'Wellness Pharmacy', price: 20, distance: '2.5 km', inStock: true },
    ],
    substitutes: ['Ferocit', 'Iron Plus'],
  },
];

const categories = ['All', 'Pain Relief', 'Antibiotic', 'Gastro', 'Vitamin', 'Diabetes', 'Women Care'];

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/10 text-blue-400', red: 'bg-red-500/10 text-red-400',
  green: 'bg-green-500/10 text-green-400', amber: 'bg-amber-500/10 text-amber-400',
  purple: 'bg-purple-500/10 text-purple-400', cyan: 'bg-cyan-500/10 text-cyan-400',
  pink: 'bg-pink-500/10 text-pink-400', teal: 'bg-teal-500/10 text-teal-400',
};

// ============================================
// MAIN COMPONENT
// ============================================
const Pharmacy: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const user = useAppSelector((state: any) => state?.auth?.user) || { name: 'User' };

  const [medicines] = useState<Medicine[]>(medicinesData);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pendingMedicine, setPendingMedicine] = useState<Medicine | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showPrescriptionUpload, setShowPrescriptionUpload] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening');
  }, []);

  // Filter medicines
  const filteredMedicines = useMemo(() => {
    let result = [...medicines];
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
  }, [searchQuery, categoryFilter, medicines]);

  // Cart functions
  const addToCart = useCallback((medicine: Medicine) => {
    if (!isAuthenticated) {
      setPendingMedicine(medicine);
      setShowLoginPrompt(true);
      return;
    }
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
  }, [isAuthenticated]);

  const removeFromCart = useCallback((medicineId: string) => {
    setCart(prev => prev.filter(item => item.medicine.id !== medicineId));
  }, []);

  const updateQuantity = useCallback((medicineId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.medicine.id !== medicineId) return item;
      const newQty = item.quantity + delta;
      if (newQty < 1 || newQty > item.medicine.stock) return item;
      return { ...item, quantity: newQty };
    }));
  }, []);

  const cartTotal = useMemo(() =>
    cart.reduce((sum, item) => sum + (item.medicine.price * item.quantity), 0),
    [cart]
  );

  const cartCount = useMemo(() =>
    cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  return (
    <div className="min-h-screen bg-[#030508]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ============================================ */}
        {/* TOP HEADER */}
        {/* ============================================ */}
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
            <Button variant="danger" size="sm" onClick={() => navigate('/emergency')}
              className="animate-pulse bg-gradient-to-r from-red-500 to-rose-500 shadow-lg">
              <AlertCircle className="w-4 h-4 mr-1.5" /> SOS
            </Button>
          </div>
        </motion.div>

        {/* ============================================ */}
        {/* SEARCH + CART + PRESCRIPTION BAR */}
        {/* ============================================ */}
        <GlassmorphicCard className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search medicines, generic names, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500/30 transition-all"
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-all">
                <Mic className="w-4 h-4" />
              </button>
            </div>
            <button onClick={() => setShowPrescriptionUpload(true)}
              className="flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold hover:bg-blue-500/20 transition-all">
              <Camera className="w-5 h-5" />
              <span className="hidden sm:inline">Upload Rx</span>
            </button>
            <button onClick={() => setShowCart(true)}
              className="relative flex items-center gap-2 px-5 py-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold hover:bg-amber-500/20 transition-all">
              <ShoppingCart className="w-5 h-5" />
              <span className="hidden sm:inline">Cart</span>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full text-xs flex items-center justify-center text-white font-bold">{cartCount}</span>
              )}
            </button>
          </div>
        </GlassmorphicCard>

        {/* ============================================ */}
        {/* QUICK ACTIONS */}
        {/* ============================================ */}
        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 gap-3">
          {[
            { icon: Pill, label: 'All Meds', color: 'amber', action: () => setCategoryFilter('All') },
            { icon: FileText, label: 'Upload Rx', color: 'blue', action: () => setShowPrescriptionUpload(true) },
            { icon: Clock, label: 'Reminders', color: 'purple', action: () => navigate('/patient/prescriptions') },
            { icon: Truck, label: 'Delivery', color: 'green', action: () => setShowCart(true) },
            { icon: MapPin, label: 'Nearby', color: 'red', action: () => navigate('/pharmacy') },
            { icon: Brain, label: 'AI Help', color: 'indigo', action: () => navigate('/ai-assistant') },
            { icon: Heart, label: 'Women Care', color: 'pink', action: () => navigate('/women-care') },
            { icon: Shield, label: 'Emergency', color: 'rose', action: () => navigate('/emergency') },
          ].map((action, i) => {
            const Icon = action.icon;
            const colors = colorMap[action.color] || '';
            const [bg, text] = colors.split(' ');
            return (
              <motion.button key={i} whileHover={{ scale: 1.06, y: -3 }} whileTap={{ scale: 0.95 }}
                onClick={action.action}
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

        {/* ============================================ */}
        {/* CATEGORIES */}
        {/* ============================================ */}
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

        {/* ============================================ */}
        {/* MEDICINES GRID */}
        {/* ============================================ */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-bold text-lg">
              {categoryFilter === 'All' ? 'All Medicines' : categoryFilter} ({filteredMedicines.length})
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredMedicines.map((med) => (
              <motion.div key={med.id} whileHover={{ y: -4 }} className="group">
                <Card className="p-5 h-full hover:border-amber-500/20 transition-all cursor-pointer"
                  onClick={() => setSelectedMedicine(med)}>
                  {/* Image + Badges */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-3xl">{med.image}</div>
                    <div className="flex flex-col items-end gap-1.5">
                      <Badge variant={med.status === 'available' ? 'success' : med.status === 'low-stock' ? 'warning' : med.status === 'expiring' ? 'danger' : 'default'} className="text-[10px]">
                        {med.status === 'available' ? 'In Stock' : med.status === 'low-stock' ? 'Low Stock' : med.status === 'expiring' ? 'Expiring' : 'Out of Stock'}
                      </Badge>
                      {med.requiresPrescription && (
                        <Badge variant="info" className="text-[10px] flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Rx Required
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
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
                      <span>{med.rating} ({med.reviews})</span>
                    </div>
                    <span>Stock: {med.stock}</span>
                  </div>

                  {/* Safety Badges */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {med.pregnancySafe && <Badge variant="success" className="text-[9px]">🤰 Safe</Badge>}
                    {med.breastfeedingSafe && <Badge variant="info" className="text-[9px]">🤱 Safe</Badge>}
                  </div>

                  {/* Add to Cart Button */}
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
      </div>

      {/* ============================================ */}
      {/* MEDICINE DETAIL MODAL */}
      {/* ============================================ */}
      <AnimatePresence>
        {selectedMedicine && (
          <Modal isOpen={true} onClose={() => setSelectedMedicine(null)} size="lg">
            <div className="p-6">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 rounded-2xl bg-amber-500/10 flex items-center justify-center text-5xl">{selectedMedicine.image}</div>
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

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 mb-4">
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

              {/* Safety Badges */}
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

              {/* Substitutes */}
              {selectedMedicine.substitutes.length > 0 && (
                <div className="mb-4 p-3 rounded-2xl bg-blue-500/5 border border-blue-500/10">
                  <p className="text-blue-400 text-xs font-bold mb-1">💡 Substitutes Available:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedMedicine.substitutes.map(sub => (
                      <Badge key={sub} variant="info" className="text-[10px]">{sub}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Pharmacies */}
              {selectedMedicine.pharmacies.length > 0 && (
                <div className="mb-4">
                  <p className="text-white font-bold text-sm mb-2 flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-cyan-400" /> Available at:
                  </p>
                  <div className="space-y-2">
                    {selectedMedicine.pharmacies.map((pharmacy, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03]">
                        <div>
                          <p className="text-white text-sm font-bold">{pharmacy.name}</p>
                          <p className="text-xs text-slate-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {pharmacy.distance}
                            {pharmacy.inStock ? (
                              <span className="text-emerald-400">• In Stock</span>
                            ) : (
                              <span className="text-red-400">• Out of Stock</span>
                            )}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-amber-400 font-bold">৳{pharmacy.price}</p>
                          {pharmacy.inStock && (
                            <button className="text-xs text-cyan-400 hover:underline mt-0.5">
                              Order Now →
                            </button>
                          )}
                        </div>
                      </div>
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
                    <Button variant="primary" className="mt-4 bg-amber-500" onClick={() => setShowCart(false)}>
                      Browse Medicines
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6">
                      {cart.map((item) => (
                        <div key={item.medicine.id} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.03]">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-xl">{item.medicine.image}</div>
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
                <p className="text-white text-sm font-bold mb-1">🤖 AI Prescription Scanner</p>
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
      {/* LOGIN PROMPT MODAL */}
      {/* ============================================ */}
      <AnimatePresence>
        {showLoginPrompt && pendingMedicine && (
          <Modal isOpen={true} onClose={() => setShowLoginPrompt(false)} size="sm">
            <div className="p-6 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <ShoppingCart className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="text-xl font-black text-white mb-2">Login Required</h3>
              <p className="text-slate-400 text-sm mb-4">Please login to order {pendingMedicine.name}</p>
              <div className="space-y-3">
                <Button variant="primary" onClick={() => navigate('/login')} className="w-full bg-gradient-to-r from-amber-500 to-orange-500 py-3">
                  Login to Continue
                </Button>
                <Button variant="outline" onClick={() => navigate('/register')} className="w-full py-3">
                  Create New Account
                </Button>
                <Button variant="ghost" onClick={() => setShowLoginPrompt(false)} className="w-full">
                  Continue Browsing
                </Button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Pharmacy;