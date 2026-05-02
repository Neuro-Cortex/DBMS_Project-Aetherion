// src/components/pharmacy/MedicineSearch.tsx
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Pill, Plus, X, ShoppingCart, MapPin, DollarSign,
  AlertCircle, TrendingUp, Filter, FileText, Heart, Activity, CheckCircle
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// ============================================
// TYPES
// ============================================
export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  manufacturer: string;
  strength: string;
  form: string;
  price: number;
  prescriptionRequired: boolean;
  stock: { available: number; status: string; nextDelivery?: string };
  pharmacies: Array<{ id: string; name: string; distance: number; price: number; stock: number }>;
  alternatives?: string[];
  sideEffects: string[];
  dosage: string;
  warnings: string[];
}

export interface MedicineSearchProps {
  medicines?: Medicine[];
  onMedicineSelect?: (medicine: Medicine) => void;
  onAddToCart?: (medicine: Medicine, pharmacyId: string) => void;
  className?: string;
}

// ============================================
// DEFAULT DATA
// ============================================
const defaultMedicines: Medicine[] = [
  {
    id: '1', name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'otc',
    manufacturer: 'HealthCare Pharma', strength: '500mg', form: 'tablet', price: 5.99,
    prescriptionRequired: false,
    stock: { available: 150, status: 'in-stock', nextDelivery: '2024-03-20' },
    pharmacies: [
      { id: 'p1', name: 'HealthPlus Pharmacy', distance: 0.5, price: 5.99, stock: 150 },
      { id: 'p2', name: 'City Drug Store', distance: 1.2, price: 6.49, stock: 80 },
    ],
    alternatives: ['Ibuprofen 400mg', 'Aspirin 300mg'],
    sideEffects: ['Nausea', 'Stomach upset'],
    dosage: '1-2 tablets every 4-6 hours as needed',
    warnings: ['Do not exceed 8 tablets in 24 hours', 'Avoid alcohol'],
  },
  {
    id: '2', name: 'Amoxicillin 500mg', genericName: 'Amoxicillin', category: 'prescription',
    manufacturer: 'MediCore Labs', strength: '500mg', form: 'capsule', price: 15.99,
    prescriptionRequired: true,
    stock: { available: 25, status: 'low-stock', nextDelivery: '2024-03-18' },
    pharmacies: [
      { id: 'p1', name: 'HealthPlus Pharmacy', distance: 0.5, price: 15.99, stock: 25 },
    ],
    alternatives: ['Cephalexin 500mg'],
    sideEffects: ['Diarrhea', 'Nausea', 'Rash'],
    dosage: '1 capsule every 8 hours for 7-10 days',
    warnings: ['Complete full course', 'May cause allergic reaction'],
  },
  {
    id: '3', name: 'Vitamin D3 1000IU', genericName: 'Cholecalciferol', category: 'supplement',
    manufacturer: 'NutriWell', strength: '1000IU', form: 'tablet', price: 12.99,
    prescriptionRequired: false,
    stock: { available: 0, status: 'out-of-stock', nextDelivery: '2024-03-25' },
    pharmacies: [
      { id: 'p2', name: 'City Drug Store', distance: 1.2, price: 12.99, stock: 0 },
    ],
    alternatives: ['Vitamin D2 1000IU'],
    sideEffects: ['Rarely causes side effects'],
    dosage: '1 tablet daily with meal',
    warnings: ['Store in cool, dry place'],
  },
];

// ============================================
// MAIN COMPONENT
// ============================================
export const MedicineSearch: React.FC<MedicineSearchProps> = ({
  medicines: initialMedicines,
  onMedicineSelect,
  onAddToCart,
  className = '',
}) => {
  const [medicines] = useState<Medicine[]>(initialMedicines || defaultMedicines);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'stock'>('price');
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [cart, setCart] = useState<Array<{ medicine: Medicine; pharmacyId: string; quantity: number }>>([]);

  const categories = ['all', 'otc', 'prescription', 'supplement', 'medical-device'];

  const filteredMedicines = useMemo(() => {
    let filtered = medicines.filter(med => {
      const q = searchQuery.toLowerCase();
      const matchesSearch = !q || med.name.toLowerCase().includes(q) || med.genericName.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'distance') return (a.pharmacies[0]?.distance || 99) - (b.pharmacies[0]?.distance || 99);
      return b.stock.available - a.stock.available;
    });

    return filtered;
  }, [medicines, searchQuery, selectedCategory, sortBy]);

  const handleAddToCart = (medicine: Medicine, pharmacyId: string) => {
    setCart(prev => [...prev, { medicine, pharmacyId, quantity: 1 }]);
    onAddToCart?.(medicine, pharmacyId);
  };

  const stockStatusStyles: Record<string, string> = {
    'in-stock': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'low-stock': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'out-of-stock': 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  return (
    <div className={`space-y-6 ${className}`}>

      {/* HEADER + SEARCH */}
      <GlassmorphicCard variant="subtle" padding="md">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25 pointer-events-none" />
            <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search medicines, generics, or categories..."
              className="w-full pl-9 pr-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/15 transition-all" />
          </div>
          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/70 text-sm focus:outline-none cursor-pointer">
            {categories.map(c => <option key={c} value={c} className="bg-[#1a1a2e] capitalize">{c === 'all' ? 'All Categories' : c}</option>)}
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
            className="px-3 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/70 text-sm focus:outline-none cursor-pointer">
            <option value="price" className="bg-[#1a1a2e]">Sort by Price</option>
            <option value="distance" className="bg-[#1a1a2e]">Sort by Distance</option>
            <option value="stock" className="bg-[#1a1a2e]">Sort by Stock</option>
          </select>
          {cart.length > 0 && (
            <Button variant="gradient" size="sm" className="gap-1.5">
              <ShoppingCart className="w-4 h-4" /> {cart.length}
            </Button>
          )}
        </div>
      </GlassmorphicCard>

      {/* MEDICINE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMedicines.map((medicine) => {
          const Icon = medicine.category === 'prescription' ? FileText : medicine.category === 'supplement' ? Heart : Pill;
          return (
            <motion.div key={medicine.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -3 }} onClick={() => { setSelectedMedicine(medicine); onMedicineSelect?.(medicine); }}
              className="bg-white/[0.015] rounded-2xl border border-white/[0.06] p-5 cursor-pointer hover:border-white/[0.12] transition-all">
              
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${medicine.prescriptionRequired ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
                    <Icon className={`w-4 h-4 ${medicine.prescriptionRequired ? 'text-red-400' : 'text-emerald-400'}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-sm">{medicine.name}</h3>
                    <p className="text-white/35 text-xs">{medicine.genericName}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${stockStatusStyles[medicine.stock.status]}`}>{medicine.stock.status}</span>
              </div>

              <div className="flex items-center gap-2 mb-3 text-xs">
                <span className="text-white/40">{medicine.strength}</span>
                <span className="text-white/15">•</span>
                <span className="text-white/40 capitalize">{medicine.form}</span>
                <span className="text-white/15">•</span>
                <span className="text-white/40">{medicine.manufacturer}</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-emerald-400 font-bold text-lg">${medicine.price}</span>
                <span className="text-white/30 text-[10px]">{medicine.pharmacies.length} pharmacies</span>
              </div>

              {medicine.alternatives && medicine.alternatives.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {medicine.alternatives.map((alt) => (
                    <span key={alt} className="px-2 py-0.5 rounded-full bg-white/[0.02] text-white/35 text-[10px] border border-white/[0.04]">{alt}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-white/[0.04]">
                {medicine.stock.status !== 'out-of-stock' ? (
                  <Button variant="gradient" size="xs" onClick={(e) => { e.stopPropagation(); handleAddToCart(medicine, medicine.pharmacies[0]?.id || ''); }}
                    className="flex-1 gap-1"><ShoppingCart className="w-3 h-3" /> Add to Cart</Button>
                ) : (
                  <span className="flex-1 text-center text-red-400 text-xs font-medium">Out of Stock</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedMedicine && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedMedicine(null)} />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-lg bg-[#0a0a10] border border-white/[0.08] rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="p-6 border-b border-white/[0.04] flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">{selectedMedicine.name}</h3>
                <button type="button" onClick={() => setSelectedMedicine(null)} className="p-1.5 hover:bg-white/[0.06] rounded-lg"><X className="w-5 h-5 text-white/40" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Category', value: selectedMedicine.category },
                    { label: 'Strength', value: selectedMedicine.strength },
                    { label: 'Form', value: selectedMedicine.form },
                    { label: 'Price', value: `$${selectedMedicine.price}` },
                    { label: 'Dosage', value: selectedMedicine.dosage },
                    { label: 'Stock', value: selectedMedicine.stock.available.toString() },
                  ].map((item) => (
                    <div key={item.label} className="p-2.5 bg-white/[0.02] rounded-lg">
                      <p className="text-white/30 text-[10px] uppercase">{item.label}</p>
                      <p className="text-white/60 text-xs mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1.5">Warnings</p>
                  <div className="space-y-1">
                    {selectedMedicine.warnings.map((w, i) => (
                      <p key={i} className="text-white/50 text-xs flex items-start gap-1.5"><AlertCircle className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />{w}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider mb-1.5">Available at</p>
                  <div className="space-y-2">
                    {selectedMedicine.pharmacies.map((ph) => (
                      <div key={ph.id} className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02]">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                          <span className="text-white/60 text-xs">{ph.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-white/40 text-[10px]">{ph.distance}km</span>
                          <span className="text-emerald-400 text-xs font-bold">${ph.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Button variant="gradient" size="sm" onClick={() => { handleAddToCart(selectedMedicine, selectedMedicine.pharmacies[0]?.id || ''); setSelectedMedicine(null); }} className="w-full gap-1.5">
                  <ShoppingCart className="w-4 h-4" /> Add to Cart
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MedicineSearch;