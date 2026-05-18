// src/store/slices/pharmacySlice.ts
// PHARMACY STATE MANAGEMENT

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ============================================
// TYPES
// ============================================

export interface PharmacyProfile {
  id: string;
  name: string;
  registrationNumber: string;
  licenseNumber: string;
  phone: string;
  email: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  isVerified: boolean;
  isOpen: boolean;
  is24x7: boolean;
  deliveryAvailable: boolean;
  rating: number;
  reviewCount: number;
}

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: string;
  type: 'prescription' | 'otc';
  stock: number;
  minStock: number;
  price: number;
  expiryDate: string;
  manufacturer: string;
  isAvailable: boolean;
}

export interface PharmacyOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  deliveryAddress: string;
}

export interface OrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  price: number;
}

export interface StockAlert {
  medicineId: string;
  medicineName: string;
  currentStock: number;
  minStock: number;
  status: 'low' | 'critical' | 'out-of-stock' | 'expired';
}

export interface PharmacyState {
  profile: PharmacyProfile | null;
  medicines: Medicine[];
  orders: PharmacyOrder[];
  stockAlerts: StockAlert[];
  totalOrders: number;
  totalRevenue: number;
  todayOrders: number;
  todayRevenue: number;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: PharmacyState = {
  profile: null,
  medicines: [],
  orders: [],
  stockAlerts: [],
  totalOrders: 0,
  totalRevenue: 0,
  todayOrders: 0,
  todayRevenue: 0,
  isLoading: false,
  error: null,
};

// ============================================
// SLICE
// ============================================

const pharmacySlice = createSlice({
  name: 'pharmacy',
  initialState,
  reducers: {
    // Profile
    setPharmacyProfile: (state, action: PayloadAction<PharmacyProfile>) => {
      state.profile = action.payload;
    },
    updatePharmacyProfile: (state, action: PayloadAction<Partial<PharmacyProfile>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },

    // Medicines
    setMedicines: (state, action: PayloadAction<Medicine[]>) => {
      state.medicines = action.payload;
    },
    addMedicine: (state, action: PayloadAction<Medicine>) => {
      state.medicines.push(action.payload);
    },
    updateMedicine: (state, action: PayloadAction<{ id: string; data: Partial<Medicine> }>) => {
      state.medicines = state.medicines.map(m =>
        m.id === action.payload.id ? { ...m, ...action.payload.data } : m
      );
    },
    updateMedicineStock: (state, action: PayloadAction<{ id: string; stock: number }>) => {
      state.medicines = state.medicines.map(m =>
        m.id === action.payload.id ? { ...m, stock: action.payload.stock } : m
      );
    },
    removeMedicine: (state, action: PayloadAction<string>) => {
      state.medicines = state.medicines.filter(m => m.id !== action.payload);
    },

    // Orders
    setOrders: (state, action: PayloadAction<PharmacyOrder[]>) => {
      state.orders = action.payload;
    },
    addOrder: (state, action: PayloadAction<PharmacyOrder>) => {
      state.orders.unshift(action.payload);
      state.totalOrders += 1;
      state.todayOrders += 1;
      state.totalRevenue += action.payload.totalAmount;
      state.todayRevenue += action.payload.totalAmount;
    },
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: PharmacyOrder['status'] }>) => {
      state.orders = state.orders.map(o =>
        o.id === action.payload.id ? { ...o, status: action.payload.status } : o
      );
    },

    // Stock Alerts
    setStockAlerts: (state, action: PayloadAction<StockAlert[]>) => {
      state.stockAlerts = action.payload;
    },

    // Stats
    setPharmacyStats: (state, action: PayloadAction<{
      totalOrders: number;
      totalRevenue: number;
      todayOrders: number;
      todayRevenue: number;
    }>) => {
      state.totalOrders = action.payload.totalOrders;
      state.totalRevenue = action.payload.totalRevenue;
      state.todayOrders = action.payload.todayOrders;
      state.todayRevenue = action.payload.todayRevenue;
    },

    // Loading & Error
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    // Reset
    clearPharmacy: () => initialState,
  },
});

export const {
  setPharmacyProfile, updatePharmacyProfile,
  setMedicines, addMedicine, updateMedicine, updateMedicineStock, removeMedicine,
  setOrders, addOrder, updateOrderStatus,
  setStockAlerts, setPharmacyStats,
  setLoading, setError, clearPharmacy,
} = pharmacySlice.actions;

export default pharmacySlice.reducer;