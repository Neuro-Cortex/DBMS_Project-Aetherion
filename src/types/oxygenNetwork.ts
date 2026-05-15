// src/types/oxygenNetwork.ts

export interface OxygenStock {
  id: string;
  hospitalId: string;
  hospitalName: string;
  
  // Stock Info
  totalCylinders: number;
  availableCylinders: number;
  inUseCylinders: number;
  reservedCylinders: number;
  
  // Cylinder Types
  cylinders: CylinderType[];
  
  // Status
  status: 'sufficient' | 'low' | 'critical' | 'out-of-stock';
  emergencySupport: boolean;
  
  // Location
  address: OxygenCenterAddress;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  
  // Contact
  phone: string;
  emergencyPhone: string;
  
  // Timestamps
  lastUpdated: string;
  lastRefilled: string;
  nextRefillDate: string;
  
  // Supplier
  supplier: string;
  supplierContact: string;
}

export interface CylinderType {
  type: 'A-type' | 'B-type' | 'D-type' | 'J-type';
  capacity: string; // '10L', '20L', '46.7L', '50L'
  total: number;
  available: number;
  inUse: number;
  reserved: number;
  pressure: string; // '150 bar', '200 bar'
}

export interface OxygenCenterAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  landmark?: string;
}

export interface OxygenRequest {
  id: string;
  requestNumber: string;
  
  // Patient Info
  patientName: string;
  patientAge: number;
  patientCondition: string;
  
  // Request Details
  oxygenType: string;
  cylindersNeeded: number;
  urgency: 'normal' | 'urgent' | 'emergency';
  
  // Hospital Info
  hospitalName: string;
  doctorName: string;
  
  // Status
  status: 'pending' | 'approved' | 'dispatched' | 'delivered' | 'cancelled';
  
  // Location
  deliveryAddress: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  
  // Contact
  contactPhone: string;
  contactEmail: string;
  
  // Timestamps
  requestDate: string;
  requiredDate: string;
  deliveryDate?: string;
}

export interface OxygenEmergencyAlert {
  id: string;
  alertType: 'low-stock' | 'no-stock' | 'emergency-request' | 'system-failure';
  hospitalName: string;
  message: string;
  priority: 'high' | 'critical';
  status: 'active' | 'resolved';
  
  // Location
  coordinates: {
    latitude: number;
    longitude: number;
  };
  
  // Timestamps
  createdAt: string;
  resolvedAt?: string;
}

export interface OxygenCenter {
  id: string;
  name: string;
  type: 'hospital' | 'oxygen-bank' | 'supplier' | 'emergency-center';
  
  // Stock
  oxygenStock: OxygenStock;
  
  // Location
  address: OxygenCenterAddress;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  distance?: number; // km from user
  estimatedTime?: string; // travel time
  
  // Status
  isOpen: boolean;
  isEmergencyReady: boolean;
  operatingHours: string;
  
  // Contact
  phone: string;
  emergencyPhone: string;
  
  // Rating
  rating: number;
  totalReviews: number;
}

export interface OxygenDashboardData {
  totalCenters: number;
  centersWithStock: number;
  totalCylinders: number;
  availableCylinders: number;
  emergencyRequests: number;
  activeAlerts: number;
  
  // Charts
  stockDistribution: {
    labels: string[];
    values: number[];
  };
  
  cylinderUsage: {
    labels: string[];
    inUse: number[];
    available: number[];
  };
  
  recentRequests: OxygenRequest[];
  activeEmergencies: OxygenEmergencyAlert[];
  nearbyCenters: OxygenCenter[];
  alerts: OxygenAlert[];
}

export interface OxygenAlert {
  id: string;
  type: 'stock-low' | 'stock-out' | 'request-pending' | 'delivery-delayed';
  title: string;
  message: string;
  hospitalName: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  createdAt: string;
  isRead: boolean;
}

export interface OxygenSearchParams {
  location?: string;
  radius: number; // km
  cylinderType?: string;
  availability: 'all' | 'available' | 'emergency';
  sortBy: 'distance' | 'availability' | 'rating';
}