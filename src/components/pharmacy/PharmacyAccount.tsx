// src/components/pharmacy/PharmacyAccount.tsx
// UPDATED: Medicine Search + Availability Filter + Unavailable List

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Phone, Mail, MapPin, Globe,
  Clock, Star, Shield, Award, Package,
  ShoppingBag, TrendingUp, DollarSign,
  AlertCircle, CheckCircle, XCircle,
  Camera, Edit3, Save, X, Plus, Trash2,
  Search, Filter, Download, RefreshCw,
  Pill, Truck, Users, Settings, LogOut,
  Activity, Bell, Calendar, Eye, EyeOff
} from 'lucide-react';

// ============================================
// COMMON COMPONENTS
// ============================================
import { Avatar } from 'src/ui/Avatar';
import { Badge } from 'src/ui/Badge';
import { Button } from 'src/ui/Button';
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Input } from 'src/ui/Input';
import { Select } from 'src/ui/Select';
import { Tabs } from 'src/ui/Tab';
import { Table } from 'src/ui/Table';
import { Modal } from 'src/ui/Modal';
import { Loader } from 'src/ui/Loader';

// ============================================
// TYPES (unchanged - same as before)
// ============================================
// ... (all types same as above)

// ============================================
// MAIN COMPONENT
// ============================================

export const PharmacyAccount: React.FC = () => {
  const [activeTab, setActiveTab] = useState('medicines');
  const [showAddMedicine, setShowAddMedicine] = useState(false);

  // ============================================
  // MEDICINES DATA
  // ============================================
  const [medicines] = useState([
    { id: '1', name: 'Paracetamol 500mg', genericName: 'Acetaminophen', category: 'Analgesic', manufacturer: 'PharmaCorp', type: 'otc' as const, stock: 250, minStock: 50, price: 5.99, expiryDate: '2026-06-15', isAvailable: true },
    { id: '2', name: 'Amoxicillin 250mg', genericName: 'Amoxicillin', category: 'Antibiotic', manufacturer: 'MediLab', type: 'prescription' as const, stock: 8, minStock: 30, price: 12.50, expiryDate: '2025-09-20', isAvailable: true },
    { id: '3', name: 'Ibuprofen 400mg', genericName: 'Ibuprofen', category: 'NSAID', manufacturer: 'HealthPlus', type: 'otc' as const, stock: 0, minStock: 40, price: 7.25, expiryDate: '2026-01-10', isAvailable: false },
    { id: '4', name: 'Omeprazole 20mg', genericName: 'Omeprazole', category: 'PPI', manufacturer: 'GastroMed', type: 'prescription' as const, stock: 120, minStock: 25, price: 15.00, expiryDate: '2025-04-01', isAvailable: true },
    { id: '5', name: 'Cetirizine 10mg', genericName: 'Cetirizine', category: 'Antihistamine', manufacturer: 'AllerCare', type: 'otc' as const, stock: 15, minStock: 60, price: 4.50, expiryDate: '2026-12-31', isAvailable: true },
  ]);

  const medicineColumns = [
    { key: 'name', title: 'Medicine Name', sortable: true },
    { key: 'category', title: 'Category', sortable: true },
    { key: 'stock', title: 'Stock', sortable: true },
    { key: 'price', title: 'Price', sortable: true },
    { key: 'expiryDate', title: 'Expiry' },
  ];

  // ============================================
  // NEW: SEARCH & FILTER STATE
  // ============================================
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'prescription' | 'otc'>('all');
  const [filterStock, setFilterStock] = useState<'all' | 'available' | 'low' | 'out'>('all');
  const [filterExpiry, setFilterExpiry] = useState<'all' | 'expiring' | 'expired'>('all');
  const [showUnavailable, setShowUnavailable] = useState(false);

  // ============================================
  // NEW: FILTERED MEDICINES
  // ============================================
  const filteredMedicines = useMemo(() => {
    return medicines.filter(med => {
      // Search by name, generic name, category, manufacturer
      const matchesSearch = 
        searchTerm === '' ||
        med.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.genericName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        med.manufacturer.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by type
      const matchesType = filterType === 'all' || med.type === filterType;

      // Filter by stock
      const matchesStock = 
        filterStock === 'all' ? true :
        filterStock === 'available' ? med.stock > med.minStock :
        filterStock === 'low' ? (med.stock > 0 && med.stock <= med.minStock) :
        filterStock === 'out' ? med.stock === 0 : true;

      // Filter by expiry
      const today = new Date();
      const expiryDate = new Date(med.expiryDate);
      const monthsUntilExpiry = (expiryDate.getFullYear() - today.getFullYear()) * 12 + (expiryDate.getMonth() - today.getMonth());
      
      const matchesExpiry = 
        filterExpiry === 'all' ? true :
        filterExpiry === 'expiring' ? (monthsUntilExpiry <= 3 && monthsUntilExpiry >= 0) :
        filterExpiry === 'expired' ? expiryDate < today : true;

      // Show unavailable toggle
      const matchesAvailability = showUnavailable ? true : med.isAvailable;

      return matchesSearch && matchesType && matchesStock && matchesExpiry && matchesAvailability;
    });
  }, [medicines, searchTerm, filterType, filterStock, filterExpiry, showUnavailable]);

  // ============================================
  // NEW: MEDICINE STATS
  // ============================================
  const medicineStats = useMemo(() => ({
    total: medicines.length,
    available: medicines.filter(m => m.isAvailable && m.stock > 0).length,
    lowStock: medicines.filter(m => m.stock > 0 && m.stock <= m.minStock).length,
    outOfStock: medicines.filter(m => m.stock === 0).length,
    expiringSoon: medicines.filter(m => {
      const expiryDate = new Date(m.expiryDate);
      const monthsUntilExpiry = (expiryDate.getFullYear() - new Date().getFullYear()) * 12 + (expiryDate.getMonth() - new Date().getMonth());
      return monthsUntilExpiry <= 3 && monthsUntilExpiry >= 0;
    }).length,
    expired: medicines.filter(m => new Date(m.expiryDate) < new Date()).length,
    prescription: medicines.filter(m => m.type === 'prescription').length,
    otc: medicines.filter(m => m.type === 'otc').length,
  }), [medicines]);

  // ... (rest of handlers same as before)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ... (cover, header, stats same as before) ... */}

      {/* ============================================ */}
      {/* MEDICINES TAB - UPDATED WITH SEARCH & FILTER */}
      {/* ============================================ */}
      {activeTab === 'medicines' && (
        <div className="space-y-6">
          {/* Medicine Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
            <MiniStat icon={<Package className="w-4 h-4 text-blue-500" />} label="Total" value={medicineStats.total.toString()} color="blue" />
            <MiniStat icon={<CheckCircle className="w-4 h-4 text-green-500" />} label="Available" value={medicineStats.available.toString()} color="green" />
            <MiniStat icon={<AlertCircle className="w-4 h-4 text-yellow-500" />} label="Low Stock" value={medicineStats.lowStock.toString()} color="yellow" />
            <MiniStat icon={<XCircle className="w-4 h-4 text-red-500" />} label="Out of Stock" value={medicineStats.outOfStock.toString()} color="red" />
            <MiniStat icon={<Clock className="w-4 h-4 text-orange-500" />} label="Expiring" value={medicineStats.expiringSoon.toString()} color="orange" />
            <MiniStat icon={<Shield className="w-4 h-4 text-gray-500" />} label="Expired" value={medicineStats.expired.toString()} color="gray" />
            <MiniStat icon={<Pill className="w-4 h-4 text-purple-500" />} label="Rx" value={medicineStats.prescription.toString()} color="purple" />
            <MiniStat icon={<Pill className="w-4 h-4 text-teal-500" />} label="OTC" value={medicineStats.otc.toString()} color="teal" />
          </div>

          {/* Search & Filter Bar */}
          <Card className="p-4">
            <div className="flex flex-wrap gap-3 items-center">
              {/* Search */}
              <Input
                placeholder="Search by name, generic, category, manufacturer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search className="w-4 h-4" />}
                className="flex-1 min-w-[250px]"
              />

              {/* Type Filter */}
              <Select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'prescription', label: '💊 Prescription' },
                  { value: 'otc', label: '🟢 OTC' },
                ]}
              />

              {/* Stock Filter */}
              <Select
                value={filterStock}
                onChange={(e) => setFilterStock(e.target.value as any)}
                options={[
                  { value: 'all', label: 'All Stock' },
                  { value: 'available', label: '✅ Available' },
                  { value: 'low', label: '⚠️ Low Stock' },
                  { value: 'out', label: '❌ Out of Stock' },
                ]}
              />

              {/* Expiry Filter */}
              <Select
                value={filterExpiry}
                onChange={(e) => setFilterExpiry(e.target.value as any)}
                options={[
                  { value: 'all', label: 'All Expiry' },
                  { value: 'expiring', label: '⏰ Expiring Soon' },
                  { value: 'expired', label: '🚫 Expired' },
                ]}
              />

              {/* Show Unavailable Toggle */}
              <Button
                variant={showUnavailable ? 'warning' : 'ghost'}
                size="sm"
                onClick={() => setShowUnavailable(!showUnavailable)}
                title="Show/Hide unavailable medicines"
              >
                {showUnavailable ? <Eye className="w-4 h-4 mr-1" /> : <EyeOff className="w-4 h-4 mr-1" />}
                {showUnavailable ? 'All' : 'Available'}
              </Button>

              {/* Add Medicine */}
              <Button variant="primary" size="sm" onClick={() => setShowAddMedicine(true)}>
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>

            {/* Active Filters Display */}
            {(searchTerm || filterType !== 'all' || filterStock !== 'all' || filterExpiry !== 'all' || showUnavailable) && (
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
                <span className="text-xs text-gray-500">Filters:</span>
                {searchTerm && (
                  <Badge variant="info" size="xs">
                    Search: "{searchTerm}"
                    <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSearchTerm('')} />
                  </Badge>
                )}
                {filterType !== 'all' && (
                  <Badge variant="info" size="xs">
                    Type: {filterType}
                    <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setFilterType('all')} />
                  </Badge>
                )}
                {filterStock !== 'all' && (
                  <Badge variant="info" size="xs">
                    Stock: {filterStock}
                    <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setFilterStock('all')} />
                  </Badge>
                )}
                {filterExpiry !== 'all' && (
                  <Badge variant="info" size="xs">
                    Expiry: {filterExpiry}
                    <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setFilterExpiry('all')} />
                  </Badge>
                )}
                <button
                  onClick={() => { setSearchTerm(''); setFilterType('all'); setFilterStock('all'); setFilterExpiry('all'); setShowUnavailable(false); }}
                  className="text-xs text-blue-600 hover:text-blue-700"
                >
                  Clear All
                </button>
              </div>
            )}
          </Card>

          {/* Medicine Table */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">
                Medicine Inventory
                <span className="text-sm text-gray-500 font-normal ml-2">
                  ({filteredMedicines.length} of {medicines.length} medicines)
                </span>
              </h3>
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-1" /> Export
              </Button>
            </div>

            <Table
              columns={medicineColumns}
              data={filteredMedicines}
              keyExtractor={(m) => m.id}
              emptyMessage={
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No medicines found</p>
                  <p className="text-sm text-gray-400 mt-1">Try adjusting your search or filters</p>
                </div>
              }
            />

            {/* Low Stock Alerts */}
            {medicines.filter(m => m.stock > 0 && m.stock <= m.minStock).length > 0 && (
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <h4 className="font-semibold text-yellow-700 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> Low Stock Alerts ({medicines.filter(m => m.stock > 0 && m.stock <= m.minStock).length})
                </h4>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {medicines.filter(m => m.stock > 0 && m.stock <= m.minStock).map(m => (
                    <div key={m.id} className="flex justify-between items-center p-2 bg-yellow-100 rounded-lg text-sm">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-yellow-700 font-bold">{m.stock} / {m.minStock}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Expired Medicines */}
            {medicines.filter(m => new Date(m.expiryDate) < new Date()).length > 0 && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                <h4 className="font-semibold text-red-700 flex items-center gap-2">
                  <XCircle className="w-5 h-5" /> Expired Medicines ({medicines.filter(m => new Date(m.expiryDate) < new Date()).length})
                </h4>
                <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {medicines.filter(m => new Date(m.expiryDate) < new Date()).map(m => (
                    <div key={m.id} className="flex justify-between items-center p-2 bg-red-100 rounded-lg text-sm">
                      <span className="font-medium">{m.name}</span>
                      <span className="text-red-700">Expired: {m.expiryDate}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ... (other tabs same as before) ... */}
    </div>
  );
};

// ============================================
// NEW SUB-COMPONENT
// ============================================

const MiniStat: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <Card className="p-3 text-center">
    <div className={`p-1.5 bg-${color}-100 rounded-lg inline-flex mb-1`}>{icon}</div>
    <p className="text-lg font-bold">{value}</p>
    <p className="text-[10px] text-gray-500">{label}</p>
  </Card>
);

// ... (StatCard, InfoRow, ToggleRow same as before)

export default PharmacyAccount;