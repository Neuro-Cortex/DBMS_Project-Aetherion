import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Pill,
  Plus,
  X,
  ShoppingCart,
  MapPin,
  DollarSign,
  Clock,
  Shield,
  AlertCircle,
  TrendingUp,
  Filter,
  SortAsc,
  Barcode,
  Prescription,
  Heart,
  Activity
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: 'prescription' | 'otc' | 'supplement' | 'medical-device';
  manufacturer: string;
  strength: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'inhaler';
  price: number;
  prescriptionRequired: boolean;
  stock: {
    available: number;
    status: 'in-stock' | 'low-stock' | 'out-of-stock';
    nextDelivery?: string;
  };
  pharmacies: Array<{
    id: string;
    name: string;
    distance: number;
    price: number;
    stock: number;
  }>;
  alternatives?: string[];
  sideEffects: string[];
  dosage: string;
  warnings: string[];
}

export interface MedicineSearchProps {
  medicines?: Medicine[];
  variant?: 'glass' | 'gradient' | 'neon';
  onMedicineSelect?: (medicine: Medicine) => void;
  onAddToCart?: (medicine: Medicine, pharmacyId: string) => void;
  onPrescriptionUpload?: (file: File) => void;
  className?: string;
}

// ============================================
// MEDICINE SEARCH COMPONENT
// ============================================
export const MedicineSearch: React.FC<MedicineSearchProps> = ({
  medicines: initialMedicines = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      category: 'otc',
      manufacturer: 'HealthCare Pharma',
      strength: '500mg',
      form: 'tablet',
      price: 5.99,
      prescriptionRequired: false,
      stock: {
        available: 150,
        status: 'in-stock',
        nextDelivery: '2024-03-20',
      },
      pharmacies: [
        { id: 'p1', name: 'HealthPlus Pharmacy', distance: 0.5, price: 5.99, stock: 150 },
        { id: 'p2', name: 'City Drug Store', distance: 1.2, price: 6.49, stock: 80 },
        { id: 'p3', name: '24/7 Medico', distance: 2.0, price: 5.79, stock: 200 },
      ],
      alternatives: ['Ibuprofen 400mg', 'Aspirin 300mg'],
      sideEffects: ['Nausea', 'Stomach upset'],
      dosage: '1-2 tablets every 4-6 hours as needed',
      warnings: ['Do not exceed 8 tablets in 24 hours', 'Avoid alcohol'],
    },
    {
      id: '2',
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin',
      category: 'prescription',
      manufacturer: 'MediCore Labs',
      strength: '500mg',
      form: 'capsule',
      price: 15.99,
      prescriptionRequired: true,
      stock: {
        available: 25,
        status: 'low-stock',
        nextDelivery: '2024-03-18',
      },
      pharmacies: [
        { id: 'p1', name: 'HealthPlus Pharmacy', distance: 0.5, price: 15.99, stock: 25 },
        { id: 'p4', name: 'Metro Medical', distance: 1.8, price: 14.99, stock: 10 },
      ],
      alternatives: ['Cephalexin 500mg'],
      sideEffects: ['Diarrhea', 'Nausea', 'Rash'],
      dosage: '1 capsule every 8 hours for 7-10 days',
      warnings: ['Complete full course', 'May cause allergic reaction'],
    },
    {
      id: '3',
      name: 'Vitamin D3 1000IU',
      genericName: 'Cholecalciferol',
      category: 'supplement',
      manufacturer: 'NutriWell',
      strength: '1000IU',
      form: 'tablet',
      price: 12.99,
      prescriptionRequired: false,
      stock: {
        available: 0,
        status: 'out-of-stock',
        nextDelivery: '2024-03-25',
      },
      pharmacies: [
        { id: 'p2', name: 'City Drug Store', distance: 1.2, price: 12.99, stock: 0 },
        { id: 'p5', name: 'Wellness Center', distance: 2.5, price: 11.99, stock: 0 },
      ],
      alternatives: ['Vitamin D2 1000IU', 'Multivitamin'],
      sideEffects: ['Rarely causes side effects'],
      dosage: '1 tablet daily with meal',
      warnings: ['Store in cool, dry place'],
    },
  ],
  variant = 'glass',
  onMedicineSelect,
  onAddToCart,
  onPrescriptionUpload,
  className,
}) => {
  const [medicines] = useState(initialMedicines);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | Medicine['category']>('all');
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'stock' | 'popularity'>('price');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [cart, setCart] = useState<Array<{ medicine: Medicine; pharmacyId: string; quantity: number }>>([]);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);

  // Filter and sort medicines
  const filteredMedicines = useMemo(() => {
    let filtered = medicines.filter(med => {
      const matchesSearch = !searchQuery || 
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'distance':
          return (a.pharmacies[0]?.distance || 0) - (b.pharmacies[0]?.distance || 0);
        case 'stock':
          return b.stock.available - a.stock.available;
        case 'popularity':
          return b.pharmacies.length - a.pharmacies.length;
        default:
          return 0;
      }
    });

    return filtered;
  }, [medicines, searchQuery, selectedCategory, sortBy]);

  const handleAddToCart = (medicine: Medicine, pharmacyId: string) => {
    const existingItem = cart.find(item => 
      item.medicine.id === medicine.id && item.pharmacyId === pharmacyId
    );

    if (existingItem) {
      setCart(prev => prev.map(item => 
        item === existingItem 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart(prev => [...prev, { medicine, pharmacyId, quantity: 1 }]);
    }
    onAddToCart?.(medicine, pharmacyId);
  };

  const handlePrescriptionUpload = (file: File) => {
    setPrescriptionFile(file);
    onPrescriptionUpload?.(file);
  };

  const stockStatusColors = {
    'in-stock': 'bg-green-500/10 text-green-300 border-green-500/30',
    'low-stock': 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    'out-of-stock': 'bg-red-500/10 text-red-300 border-red-500/30',
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
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Medicine Search</h2>
          <p className="text-white/60">Find medicines from pharmacies near you</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Cart Badge */}
          {cart.length > 0 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Button
                variant="neon"
                size="sm"
                iconOnly
                className="relative"
              >
                <ShoppingCart className="w-4 h-4" />
                <Badge
                  variant="danger"
                  size="xs"
                  className="absolute -top-2 -right-2"
                >
                  {cart.length}
                </Badge>
              </Button>
            </motion.div>
          )}

          <Button
            variant="gradient"
            size="sm"
            leftIcon={Plus}
            onClick={() => {
              // Upload prescription
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.pdf,.jpg,.png';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handlePrescriptionUpload(file);
              };
              input.click();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Upload Prescription
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <GlassmorphicCard variant={variant} className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <Input
            variant="glass"
            placeholder="Search medicines, generics, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={Search}
            className="flex-1"
          />

          <Button
            variant="glassmorphic"
            size="sm"
            leftIcon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>

          <Select
            variant="glass"
            options={[
              { value: 'price', label: 'Sort by Price' },
              { value: 'distance', label: 'Sort by Distance' },
              { value: 'stock', label: 'Sort by Stock' },
              { value: 'popularity', label: 'Sort by Popularity' },
            ]}
            value={sortBy}
            onChange={(value) => setSortBy(value as any)}
          />
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  variant="glass"
                  options={[
                    { value: 'all', label: 'All Categories' },
                    { value: 'prescription', label: 'Prescription' },
                    { value: 'otc', label: 'Over-the-Counter' },
                    { value: 'supplement', label: 'Supplements' },
                    { value: 'medical-device', label: 'Medical Devices' },
                  ]}
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value as any)}
                />

                <Select
                  variant="glass"
                  options={[
                    { value: 'all', label: 'All Stock' },
                    { value: 'in-stock', label: 'In Stock' },
                    { value: 'low-stock', label: 'Low Stock' },
                    { value: 'out-of-stock', label: 'Out of Stock' },
                  ]}
                  value="all"
                  onChange={() => {}}
                />

                <Select
                  variant="glass"
                  options={[
                    { value: 'all', label: 'All Forms' },
                    { value: 'tablet', label: 'Tablet' },
                    { value: 'capsule', label: 'Capsule' },
                    { value: 'syrup', label: 'Syrup' },
                    { value: 'injection', label: 'Injection' },
                  ]}
                  value="all"
                  onChange={() => {}}
                />

                <Button
                  variant="neon"
                  size="sm"
                  onClick={() => {
                    // Apply advanced filters
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prescription Upload Status */}
        {prescriptionFile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/30"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <p className="text-sm text-green-300">
                Prescription uploaded: {prescriptionFile.name}
              </p>
              <Button
                variant="ghost"
                size="xs"
                iconOnly
                onClick={() => setPrescriptionFile(null)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </GlassmorphicCard>

      {/* Medicine Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredMedicines.map((medicine, index) => {
            const Icon = medicine.category === 'prescription' ? Prescription : 
                        medicine.category === 'supplement' ? Heart : 
                        medicine.category === 'medical-device' ? Activity : Pill;

            return (
              <motion.div
                key={medicine.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <GlassmorphicCard
                  variant={variant}
                  className="p-0 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedMedicine(medicine)}
                >
                  {/* Header */}
                  <div className="p-4 bg-gradient-to-r from-white/10 to-transparent border-b border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={clsx(
                            'p-2 rounded-xl',
                            medicine.prescriptionRequired && 'bg-red-500/10 text-red-300',
                            !medicine.prescriptionRequired && 'bg-green-500/10 text-green-300'
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{medicine.name}</h3>
                          <p className="text-sm text-white/60">{medicine.genericName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {medicine.prescriptionRequired && (
                          <Badge variant="danger" size="xs">
                            <Prescription className="w-3 h-3 mr-1" />
                            Rx
                          </Badge>
                        )}
                        <Badge className={stockStatusColors[medicine.stock.status]} size="xs">
                          {medicine.stock.available} in stock
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" size="xs">{medicine.form}</Badge>
                      <Badge variant="outline" size="xs">{medicine.strength}</Badge>
                      <Badge variant="outline" size="xs">{medicine.category}</Badge>
                      <span className="text-sm text-white/60 ml-auto">{medicine.manufacturer}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Price & Pharmacies */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-black text-green-400">${medicine.price}</p>
                        <p className="text-xs text-white/60">Lowest price</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/70">{medicine.pharmacies.length} pharmacies</p>
                        <p className="text-xs text-white/60">Nearest: {medicine.pharmacies[0]?.distance}km</p>
                      </div>
                    </div>

                    {/* Alternatives */}
                    {medicine.alternatives && medicine.alternatives.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-white/60 mb-1">Alternatives:</p>
                        <div className="flex flex-wrap gap-1">
                          {medicine.alternatives.map((alt, i) => (
                            <Badge key={i} variant="secondary" size="xs">
                              {alt}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <Button
                        variant="glassmorphic"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMedicineSelect?.(medicine);
                        }}
                      >
                        View Details
                      </Button>

                      {medicine.stock.status !== 'out-of-stock' ? (
                        <Button
                          variant="gradient"
                          size="xs"
                          leftIcon={ShoppingCart}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(medicine, medicine.pharmacies[0].id);
                          }}
                          disabled={medicine.prescriptionRequired && !prescriptionFile}
                          title={medicine.prescriptionRequired && !prescriptionFile ? 'Prescription required' : ''}
                        >
                          Add to Cart
                        </Button>
                      ) : (
                        <Badge variant="danger" size="xs">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Selected Medicine Modal */}
      <AnimatePresence>
        {selectedMedicine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedMedicine(null)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/90 border border-white/20 rounded-2xl shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Pill className="w-8 h-8 text-cyan-400" />
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedMedicine.name}</h2>
                      <p className="text-white/60">{selectedMedicine.genericName}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedMedicine(null)}
                    className="p-2 text-white/40 hover:text-white/70"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-white/60 mb-1">Category</p>
                    <p className="text-white font-medium capitalize">{selectedMedicine.category}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-white/60 mb-1">Strength</p>
                    <p className="text-white font-medium">{selectedMedicine.strength}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-white/60 mb-1">Form</p>
                    <p className="text-white font-medium capitalize">{selectedMedicine.form}</p>
                  </div>
                </div>

                {/* Dosage & Warnings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      Dosage
                    </h3>
                    <p className="text-white/80">{selectedMedicine.dosage}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      Warnings
                    </h3>
                    <ul className="space-y-1">
                      {selectedMedicine.warnings.map((warning, i) => (
                        <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Side Effects */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-400" />
                    Side Effects
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMedicine.sideEffects.map((effect, i) => (
                      <Badge key={i} variant="warning" size="sm">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pharmacy Options */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Available at Pharmacies</h3>
                  <div className="space-y-3">
                    {selectedMedicine.pharmacies.map((pharmacy) => (
                      <motion.div
                        key={pharmacy.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-cyan-400" />
                          <div>
                            <p className="text-white font-medium">{pharmacy.name}</p>
                            <p className="text-sm text-white/60">{pharmacy.distance} km away</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-400">${pharmacy.price}</p>
                            <Badge 
                              variant={pharmacy.stock > 50 ? 'success' : pharmacy.stock > 10 ? 'warning' : 'danger'} 
                              size="xs"
                            >
                              {pharmacy.stock} available
                            </Badge>
                          </div>

                          <Button
                            variant="gradient"
                            size="sm"
                            leftIcon={ShoppingCart}
                            onClick={() => handleAddToCart(selectedMedicine, pharmacy.id)}
                            disabled={selectedMedicine.prescriptionRequired && !prescriptionFile}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Alternatives */}
                {selectedMedicine.alternatives && selectedMedicine.alternatives.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      Alternative Medicines
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedMedicine.alternatives.map((alt, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-left"
                          onClick={() => {
                            // Find alternative medicine
                            const altMed = medicines.find(m => 
                              m.name.toLowerCase().includes(alt.toLowerCase())
                            );
                            if (altMed) setSelectedMedicine(altMed);
                          }}
                        >
                          <p className="text-white font-medium">{alt}</p>
                          <p className="text-xs text-white/60">Alternative option</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-white/10 flex justify-between items-center">
                <Button
                  variant="glassmorphic"
                  size="lg"
                  onClick={() => setSelectedMedicine(null)}
                >
                  Close
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    variant="glassmorphic"
                    size="lg"
                    leftIcon={FileText}
                    onClick={() => {
                      // View detailed info
                    }}
                  >
                    More Info
                  </Button>

                  {selectedMedicine.stock.status !== 'out-of-stock' && (
                    <Button
                      variant="gradient"
                      size="lg"
                      leftIcon={ShoppingCart}
                      onClick={() => {
                        // Add to cart with best pharmacy
                        const bestPharmacy = selectedMedicine.pharmacies.reduce((prev, curr) => 
                          curr.price < prev.price ? curr : prev
                        );
                        handleAddToCart(selectedMedicine, bestPharmacy.id);
                        setSelectedMedicine(null);
                      }}
                      disabled={selectedMedicine.prescriptionRequired && !prescriptionFile}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {selectedMedicine.prescriptionRequired && !prescriptionFile 
                        ? 'Prescription Required' 
                        : 'Add to Cart'}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search,
  Pill,
  Plus,
  X,
  ShoppingCart,
  MapPin,
  DollarSign,
  Clock,
  Shield,
  AlertCircle,
  TrendingUp,
  Filter,
  SortAsc,
  Barcode,
  Prescription,
  Heart,
  Activity
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: 'prescription' | 'otc' | 'supplement' | 'medical-device';
  manufacturer: string;
  strength: string;
  form: 'tablet' | 'capsule' | 'syrup' | 'injection' | 'cream' | 'inhaler';
  price: number;
  prescriptionRequired: boolean;
  stock: {
    available: number;
    status: 'in-stock' | 'low-stock' | 'out-of-stock';
    nextDelivery?: string;
  };
  pharmacies: Array<{
    id: string;
    name: string;
    distance: number;
    price: number;
    stock: number;
  }>;
  alternatives?: string[];
  sideEffects: string[];
  dosage: string;
  warnings: string[];
}

export interface MedicineSearchProps {
  medicines?: Medicine[];
  variant?: 'glass' | 'gradient' | 'neon';
  onMedicineSelect?: (medicine: Medicine) => void;
  onAddToCart?: (medicine: Medicine, pharmacyId: string) => void;
  onPrescriptionUpload?: (file: File) => void;
  className?: string;
}

// ============================================
// MEDICINE SEARCH COMPONENT
// ============================================
export const MedicineSearch: React.FC<MedicineSearchProps> = ({
  medicines: initialMedicines = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      genericName: 'Acetaminophen',
      category: 'otc',
      manufacturer: 'HealthCare Pharma',
      strength: '500mg',
      form: 'tablet',
      price: 5.99,
      prescriptionRequired: false,
      stock: {
        available: 150,
        status: 'in-stock',
        nextDelivery: '2024-03-20',
      },
      pharmacies: [
        { id: 'p1', name: 'HealthPlus Pharmacy', distance: 0.5, price: 5.99, stock: 150 },
        { id: 'p2', name: 'City Drug Store', distance: 1.2, price: 6.49, stock: 80 },
        { id: 'p3', name: '24/7 Medico', distance: 2.0, price: 5.79, stock: 200 },
      ],
      alternatives: ['Ibuprofen 400mg', 'Aspirin 300mg'],
      sideEffects: ['Nausea', 'Stomach upset'],
      dosage: '1-2 tablets every 4-6 hours as needed',
      warnings: ['Do not exceed 8 tablets in 24 hours', 'Avoid alcohol'],
    },
    {
      id: '2',
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin',
      category: 'prescription',
      manufacturer: 'MediCore Labs',
      strength: '500mg',
      form: 'capsule',
      price: 15.99,
      prescriptionRequired: true,
      stock: {
        available: 25,
        status: 'low-stock',
        nextDelivery: '2024-03-18',
      },
      pharmacies: [
        { id: 'p1', name: 'HealthPlus Pharmacy', distance: 0.5, price: 15.99, stock: 25 },
        { id: 'p4', name: 'Metro Medical', distance: 1.8, price: 14.99, stock: 10 },
      ],
      alternatives: ['Cephalexin 500mg'],
      sideEffects: ['Diarrhea', 'Nausea', 'Rash'],
      dosage: '1 capsule every 8 hours for 7-10 days',
      warnings: ['Complete full course', 'May cause allergic reaction'],
    },
    {
      id: '3',
      name: 'Vitamin D3 1000IU',
      genericName: 'Cholecalciferol',
      category: 'supplement',
      manufacturer: 'NutriWell',
      strength: '1000IU',
      form: 'tablet',
      price: 12.99,
      prescriptionRequired: false,
      stock: {
        available: 0,
        status: 'out-of-stock',
        nextDelivery: '2024-03-25',
      },
      pharmacies: [
        { id: 'p2', name: 'City Drug Store', distance: 1.2, price: 12.99, stock: 0 },
        { id: 'p5', name: 'Wellness Center', distance: 2.5, price: 11.99, stock: 0 },
      ],
      alternatives: ['Vitamin D2 1000IU', 'Multivitamin'],
      sideEffects: ['Rarely causes side effects'],
      dosage: '1 tablet daily with meal',
      warnings: ['Store in cool, dry place'],
    },
  ],
  variant = 'glass',
  onMedicineSelect,
  onAddToCart,
  onPrescriptionUpload,
  className,
}) => {
  const [medicines] = useState(initialMedicines);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | Medicine['category']>('all');
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'stock' | 'popularity'>('price');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);
  const [cart, setCart] = useState<Array<{ medicine: Medicine; pharmacyId: string; quantity: number }>>([]);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);

  // Filter and sort medicines
  const filteredMedicines = useMemo(() => {
    let filtered = medicines.filter(med => {
      const matchesSearch = !searchQuery || 
        med.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        med.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || med.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    // Sort by selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.price - b.price;
        case 'distance':
          return (a.pharmacies[0]?.distance || 0) - (b.pharmacies[0]?.distance || 0);
        case 'stock':
          return b.stock.available - a.stock.available;
        case 'popularity':
          return b.pharmacies.length - a.pharmacies.length;
        default:
          return 0;
      }
    });

    return filtered;
  }, [medicines, searchQuery, selectedCategory, sortBy]);

  const handleAddToCart = (medicine: Medicine, pharmacyId: string) => {
    const existingItem = cart.find(item => 
      item.medicine.id === medicine.id && item.pharmacyId === pharmacyId
    );

    if (existingItem) {
      setCart(prev => prev.map(item => 
        item === existingItem 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart(prev => [...prev, { medicine, pharmacyId, quantity: 1 }]);
    }
    onAddToCart?.(medicine, pharmacyId);
  };

  const handlePrescriptionUpload = (file: File) => {
    setPrescriptionFile(file);
    onPrescriptionUpload?.(file);
  };

  const stockStatusColors = {
    'in-stock': 'bg-green-500/10 text-green-300 border-green-500/30',
    'low-stock': 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    'out-of-stock': 'bg-red-500/10 text-red-300 border-red-500/30',
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
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-white mb-2">Medicine Search</h2>
          <p className="text-white/60">Find medicines from pharmacies near you</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Cart Badge */}
          {cart.length > 0 && (
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <Button
                variant="neon"
                size="sm"
                iconOnly
                className="relative"
              >
                <ShoppingCart className="w-4 h-4" />
                <Badge
                  variant="danger"
                  size="xs"
                  className="absolute -top-2 -right-2"
                >
                  {cart.length}
                </Badge>
              </Button>
            </motion.div>
          )}

          <Button
            variant="gradient"
            size="sm"
            leftIcon={Plus}
            onClick={() => {
              // Upload prescription
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.pdf,.jpg,.png';
              input.onchange = (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) handlePrescriptionUpload(file);
              };
              input.click();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Upload Prescription
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <GlassmorphicCard variant={variant} className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <Input
            variant="glass"
            placeholder="Search medicines, generics, or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={Search}
            className="flex-1"
          />

          <Button
            variant="glassmorphic"
            size="sm"
            leftIcon={Filter}
            onClick={() => setShowFilters(!showFilters)}
          >
            Filters
          </Button>

          <Select
            variant="glass"
            options={[
              { value: 'price', label: 'Sort by Price' },
              { value: 'distance', label: 'Sort by Distance' },
              { value: 'stock', label: 'Sort by Stock' },
              { value: 'popularity', label: 'Sort by Popularity' },
            ]}
            value={sortBy}
            onChange={(value) => setSortBy(value as any)}
          />
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Select
                  variant="glass"
                  options={[
                    { value: 'all', label: 'All Categories' },
                    { value: 'prescription', label: 'Prescription' },
                    { value: 'otc', label: 'Over-the-Counter' },
                    { value: 'supplement', label: 'Supplements' },
                    { value: 'medical-device', label: 'Medical Devices' },
                  ]}
                  value={selectedCategory}
                  onChange={(value) => setSelectedCategory(value as any)}
                />

                <Select
                  variant="glass"
                  options={[
                    { value: 'all', label: 'All Stock' },
                    { value: 'in-stock', label: 'In Stock' },
                    { value: 'low-stock', label: 'Low Stock' },
                    { value: 'out-of-stock', label: 'Out of Stock' },
                  ]}
                  value="all"
                  onChange={() => {}}
                />

                <Select
                  variant="glass"
                  options={[
                    { value: 'all', label: 'All Forms' },
                    { value: 'tablet', label: 'Tablet' },
                    { value: 'capsule', label: 'Capsule' },
                    { value: 'syrup', label: 'Syrup' },
                    { value: 'injection', label: 'Injection' },
                  ]}
                  value="all"
                  onChange={() => {}}
                />

                <Button
                  variant="neon"
                  size="sm"
                  onClick={() => {
                    // Apply advanced filters
                  }}
                >
                  Apply Filters
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prescription Upload Status */}
        {prescriptionFile && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-green-500/10 rounded-lg border border-green-500/30"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <p className="text-sm text-green-300">
                Prescription uploaded: {prescriptionFile.name}
              </p>
              <Button
                variant="ghost"
                size="xs"
                iconOnly
                onClick={() => setPrescriptionFile(null)}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </motion.div>
        )}
      </GlassmorphicCard>

      {/* Medicine Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredMedicines.map((medicine, index) => {
            const Icon = medicine.category === 'prescription' ? Prescription : 
                        medicine.category === 'supplement' ? Heart : 
                        medicine.category === 'medical-device' ? Activity : Pill;

            return (
              <motion.div
                key={medicine.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05, type: 'spring' }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <GlassmorphicCard
                  variant={variant}
                  className="p-0 overflow-hidden cursor-pointer"
                  onClick={() => setSelectedMedicine(medicine)}
                >
                  {/* Header */}
                  <div className="p-4 bg-gradient-to-r from-white/10 to-transparent border-b border-white/10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <motion.div
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          className={clsx(
                            'p-2 rounded-xl',
                            medicine.prescriptionRequired && 'bg-red-500/10 text-red-300',
                            !medicine.prescriptionRequired && 'bg-green-500/10 text-green-300'
                          )}
                        >
                          <Icon className="w-5 h-5" />
                        </motion.div>
                        <div>
                          <h3 className="text-lg font-bold text-white">{medicine.name}</h3>
                          <p className="text-sm text-white/60">{medicine.genericName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {medicine.prescriptionRequired && (
                          <Badge variant="danger" size="xs">
                            <Prescription className="w-3 h-3 mr-1" />
                            Rx
                          </Badge>
                        )}
                        <Badge className={stockStatusColors[medicine.stock.status]} size="xs">
                          {medicine.stock.available} in stock
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge variant="outline" size="xs">{medicine.form}</Badge>
                      <Badge variant="outline" size="xs">{medicine.strength}</Badge>
                      <Badge variant="outline" size="xs">{medicine.category}</Badge>
                      <span className="text-sm text-white/60 ml-auto">{medicine.manufacturer}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    {/* Price & Pharmacies */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-2xl font-black text-green-400">${medicine.price}</p>
                        <p className="text-xs text-white/60">Lowest price</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-white/70">{medicine.pharmacies.length} pharmacies</p>
                        <p className="text-xs text-white/60">Nearest: {medicine.pharmacies[0]?.distance}km</p>
                      </div>
                    </div>

                    {/* Alternatives */}
                    {medicine.alternatives && medicine.alternatives.length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs text-white/60 mb-1">Alternatives:</p>
                        <div className="flex flex-wrap gap-1">
                          {medicine.alternatives.map((alt, i) => (
                            <Badge key={i} variant="secondary" size="xs">
                              {alt}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <Button
                        variant="glassmorphic"
                        size="xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onMedicineSelect?.(medicine);
                        }}
                      >
                        View Details
                      </Button>

                      {medicine.stock.status !== 'out-of-stock' ? (
                        <Button
                          variant="gradient"
                          size="xs"
                          leftIcon={ShoppingCart}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(medicine, medicine.pharmacies[0].id);
                          }}
                          disabled={medicine.prescriptionRequired && !prescriptionFile}
                          title={medicine.prescriptionRequired && !prescriptionFile ? 'Prescription required' : ''}
                        >
                          Add to Cart
                        </Button>
                      ) : (
                        <Badge variant="danger" size="xs">
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Selected Medicine Modal */}
      <AnimatePresence>
        {selectedMedicine && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div 
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setSelectedMedicine(null)}
            />
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900/90 border border-white/20 rounded-2xl shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Pill className="w-8 h-8 text-cyan-400" />
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedMedicine.name}</h2>
                      <p className="text-white/60">{selectedMedicine.genericName}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedMedicine(null)}
                    className="p-2 text-white/40 hover:text-white/70"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-white/60 mb-1">Category</p>
                    <p className="text-white font-medium capitalize">{selectedMedicine.category}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-white/60 mb-1">Strength</p>
                    <p className="text-white font-medium">{selectedMedicine.strength}</p>
                  </div>
                  <div className="p-4 bg-white/5 rounded-xl">
                    <p className="text-sm text-white/60 mb-1">Form</p>
                    <p className="text-white font-medium capitalize">{selectedMedicine.form}</p>
                  </div>
                </div>

                {/* Dosage & Warnings */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <Heart className="w-5 h-5 text-red-400" />
                      Dosage
                    </h3>
                    <p className="text-white/80">{selectedMedicine.dosage}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      Warnings
                    </h3>
                    <ul className="space-y-1">
                      {selectedMedicine.warnings.map((warning, i) => (
                        <li key={i} className="text-sm text-white/70 flex items-start gap-2">
                          <span className="text-yellow-400 mt-1">•</span>
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Side Effects */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-orange-400" />
                    Side Effects
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedMedicine.sideEffects.map((effect, i) => (
                      <Badge key={i} variant="warning" size="sm">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Pharmacy Options */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4">Available at Pharmacies</h3>
                  <div className="space-y-3">
                    {selectedMedicine.pharmacies.map((pharmacy) => (
                      <motion.div
                        key={pharmacy.id}
                        whileHover={{ scale: 1.02 }}
                        className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 hover:border-white/20"
                      >
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-cyan-400" />
                          <div>
                            <p className="text-white font-medium">{pharmacy.name}</p>
                            <p className="text-sm text-white/60">{pharmacy.distance} km away</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-lg font-bold text-green-400">${pharmacy.price}</p>
                            <Badge 
                              variant={pharmacy.stock > 50 ? 'success' : pharmacy.stock > 10 ? 'warning' : 'danger'} 
                              size="xs"
                            >
                              {pharmacy.stock} available
                            </Badge>
                          </div>

                          <Button
                            variant="gradient"
                            size="sm"
                            leftIcon={ShoppingCart}
                            onClick={() => handleAddToCart(selectedMedicine, pharmacy.id)}
                            disabled={selectedMedicine.prescriptionRequired && !prescriptionFile}
                          >
                            Add to Cart
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Alternatives */}
                {selectedMedicine.alternatives && selectedMedicine.alternatives.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-purple-400" />
                      Alternative Medicines
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {selectedMedicine.alternatives.map((alt, i) => (
                        <motion.button
                          key={i}
                          whileHover={{ scale: 1.02 }}
                          className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all text-left"
                          onClick={() => {
                            // Find alternative medicine
                            const altMed = medicines.find(m => 
                              m.name.toLowerCase().includes(alt.toLowerCase())
                            );
                            if (altMed) setSelectedMedicine(altMed);
                          }}
                        >
                          <p className="text-white font-medium">{alt}</p>
                          <p className="text-xs text-white/60">Alternative option</p>
                        </motion.button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Footer Actions */}
              <div className="p-6 border-t border-white/10 flex justify-between items-center">
                <Button
                  variant="glassmorphic"
                  size="lg"
                  onClick={() => setSelectedMedicine(null)}
                >
                  Close
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    variant="glassmorphic"
                    size="lg"
                    leftIcon={FileText}
                    onClick={() => {
                      // View detailed info
                    }}
                  >
                    More Info
                  </Button>

                  {selectedMedicine.stock.status !== 'out-of-stock' && (
                    <Button
                      variant="gradient"
                      size="lg"
                      leftIcon={ShoppingCart}
                      onClick={() => {
                        // Add to cart with best pharmacy
                        const bestPharmacy = selectedMedicine.pharmacies.reduce((prev, curr) => 
                          curr.price < prev.price ? curr : prev
                        );
                        handleAddToCart(selectedMedicine, bestPharmacy.id);
                        setSelectedMedicine(null);
                      }}
                      disabled={selectedMedicine.prescriptionRequired && !prescriptionFile}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {selectedMedicine.prescriptionRequired && !prescriptionFile 
                        ? 'Prescription Required' 
                        : 'Add to Cart'}
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};