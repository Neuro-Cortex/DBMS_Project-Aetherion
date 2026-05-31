// ============================================
// src/types/pharmacy.ts
// COMPLETE ERROR-FREE PHARMACY TYPES
// ============================================

export type PharmacyService = 
  | 'prescription' | 'otc' | 'delivery' 
  | 'emergency' | 'consultation' | 'vaccination';

export interface Pharmacy {
  id: string;
  name: string;
  registrationNumber: string;
  licenseNumber: string;
  
  // Services with proper type
  services: PharmacyService[];
  
  // Contact
  phone: string;
  emergencyPhone: string;
  email: string;
  website?: string;
  
  // Address
  address: PharmacyAddress;
  
  // Owner Info
  ownerName: string;
  pharmacistName: string;
  pharmacistLicense: string;
  
  // Status
  isVerified: boolean;
  isOpen: boolean;
  is24x7: boolean;
  status: 'active' | 'inactive' | 'suspended';
  
  // Timings
  openingTime: string;
  closingTime: string;
  
  // Capabilities
  deliveryAvailable: boolean;
  deliveryRadius: number;
  emergencyService: boolean;
  
  // Ratings
  rating: number;
  reviewCount: number;
  totalOrders: number;
  
  // Coordinates
  coordinates: {
    latitude: number;
    longitude: number;
  };
  
  createdAt: string;
  updatedAt: string;
}

export interface PharmacyAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  landmark?: string;
}

export interface Medicine {
  id: string;
  pharmacyId: string;
  name: string;
  genericName: string;
  brandName: string;
  category: MedicineCategory;
  type: 'prescription' | 'otc';
  description: string;
  usage: string;
  dosage: string;
  sideEffects: string[];
  precautions: string[];
  contraindications: string[];
  manufacturer: string;
  manufacturedDate: string;
  expiryDate: string;
  batchNumber: string;
  stock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  price: number;
  discountedPrice?: number;
  currency: string;
  packSize: string;
  strength: string;
  form: MedicineForm;
  isAvailable: boolean;
  isExpired: boolean;
  requiresPrescription: boolean;
  rating: number;
  reviewCount: number;
  alternatives: string[];
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export type MedicineCategory = 
  | 'antibiotics' | 'pain-relief' | 'vitamins' 
  | 'cardiac' | 'diabetes' | 'respiratory'
  | 'dermatology' | 'pediatric' | 'gynecology'
  | 'neurology' | 'psychiatry' | 'other';

export type MedicineForm = 
  | 'tablet' | 'capsule' | 'syrup' | 'injection'
  | 'cream' | 'ointment' | 'drops' | 'inhaler'
  | 'spray' | 'powder' | 'gel' | 'other';

export interface MedicineOrder {
  id: string;
  orderNumber: string;
  userId: string;
  pharmacyId: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  items: OrderItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentMethod: 'cash' | 'card' | 'online' | 'insurance';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  prescriptionRequired: boolean;
  prescriptionUrl?: string;
  prescriptionVerified: boolean;
  deliveryAddress: string;
  deliveryStatus: DeliveryStatus;
  deliveryPartner?: string;
  trackingNumber?: string;
  estimatedDelivery: string;
  status: OrderStatus;
  orderDate: string;
  deliveryCoordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface OrderItem {
  medicineId: string;
  medicineName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export type OrderStatus = 
  | 'pending' | 'confirmed' | 'processing' 
  | 'packed' | 'shipped' | 'delivered' 
  | 'cancelled' | 'refunded';

export type DeliveryStatus = 
  | 'pending' | 'assigned' | 'picked-up' 
  | 'in-transit' | 'delivered' | 'failed';

export interface Prescription {
  id: string;
  userId: string;
  patientName: string;
  doctorName: string;
  hospitalName: string;
  date: string;
  validUntil: string;
  medicines: PrescribedMedicine[];
  fileUrl: string;
  status: 'active' | 'expired' | 'used';
  verifiedBy?: string;
}

export interface PrescribedMedicine {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  quantity: number;
}

export interface PharmacySearchParams {
  medicineName?: string;
  location?: string;
  radius: number;
  category?: MedicineCategory;
  prescriptionRequired?: boolean;
  sortBy: 'price' | 'distance' | 'rating';
}

export interface PharmacyDashboardData {
  pharmacy: Pharmacy;
  todayOrders: number;
  totalOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  totalMedicines: number;
  lowStockItems: number;
  expiredItems: number;
  pendingOrders: MedicineOrder[];
  stockAlerts: StockAlert[];
  salesData: SalesData;
  recentOrders: MedicineOrder[];
}

export interface StockAlert {
  id: string;
  medicineId: string;
  medicineName: string;
  currentStock: number;
  minStock: number;
  status: 'low' | 'critical' | 'out-of-stock' | 'expired';
  lastUpdated: string;
}

export interface SalesData {
  labels: string[];
  values: number[];
  totalSales: number;
  averageOrderValue: number;
  topSellingMedicines: {
    name: string;
    quantity: number;
    revenue: number;
  }[];
}

export interface ClientPharmacyData {
  recentOrders: MedicineOrder[];
  activePrescriptions: Prescription[];
  medicineReminders: MedicineReminder[];
  favoritePharmacies: Pharmacy[];
  orderHistory: MedicineOrder[];
}

export interface MedicineReminder {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  reminderTimes: string[];
  isActive: boolean;
}

export interface DeliveryTracking {
  orderId: string;
  status: DeliveryStatus;
  currentLocation?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  estimatedDelivery: string;
  deliveryPerson: string;
  deliveryPhone: string;
  updates: DeliveryUpdate[];
}

export interface DeliveryUpdate {
  id: string;
  status: string;
  message: string;
  timestamp: string;
  location: string;
}