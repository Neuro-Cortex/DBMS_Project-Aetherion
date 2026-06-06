// src/pages/client/ClientOrders.tsx
// CLIENT MEDICINE ORDERS PAGE
// Order Medicines | Track Orders | Order History

import React, { useState, useEffect } from 'react';
import {
  ShoppingBag, Package, Truck, CheckCircle, Clock,
  XCircle, MapPin, Search, Filter, ChevronRight,
  Download, Eye, RefreshCw, DollarSign, Pill,
  Calendar, Star, Building2, Phone
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface MedicineOrder {
  id: string;
  orderNumber: string;
  pharmacyName: string;
  pharmacyPhone: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentMethod: 'card' | 'cash' | 'online' | 'insurance';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  orderDate: string;
  deliveryDate: string;
  deliveryAddress: string;
  trackingNumber: string;
  prescriptionUrl?: string;
  notes?: string;
}

interface OrderItem {
  id: string;
  name: string;
  dosage: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderTracking {
  status: string;
  date: string;
  time: string;
  location: string;
  completed: boolean;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const ClientOrders: React.FC = () => {
  const [orders, setOrders] = useState<MedicineOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all');
  const [selectedOrder, setSelectedOrder] = useState<MedicineOrder | null>(null);
  const [showTracking, setShowTracking] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock tracking data
  const [trackingSteps, setTrackingSteps] = useState<OrderTracking[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockOrders: MedicineOrder[] = [
        {
          id: '1',
          orderNumber: 'ORD-2025-001',
          pharmacyName: 'MediCare Pharmacy',
          pharmacyPhone: '+1 (555) 777-8888',
          status: 'shipped',
          items: [
            { id: 'i1', name: 'Lisinopril 10mg', dosage: '10mg', quantity: 30, price: 15, image: '' },
            { id: 'i2', name: 'Amlodipine 5mg', dosage: '5mg', quantity: 30, price: 12, image: '' }
          ],
          totalAmount: 27,
          discount: 5,
          finalAmount: 22,
          paymentMethod: 'online',
          paymentStatus: 'paid',
          orderDate: '2025-01-16',
          deliveryDate: '2025-01-18',
          deliveryAddress: '123 Health Street, New York, NY 10001',
          trackingNumber: 'TRK-2025-001',
          prescriptionUrl: '#'
        },
        {
          id: '2',
          orderNumber: 'ORD-2025-002',
          pharmacyName: 'HealthPlus Pharmacy',
          pharmacyPhone: '+1 (555) 999-0000',
          status: 'delivered',
          items: [
            { id: 'i3', name: 'Vitamin D 1000 IU', dosage: '1000 IU', quantity: 60, price: 20, image: '' },
            { id: 'i4', name: 'Calcium 500mg', dosage: '500mg', quantity: 30, price: 10, image: '' }
          ],
          totalAmount: 30,
          discount: 0,
          finalAmount: 30,
          paymentMethod: 'card',
          paymentStatus: 'paid',
          orderDate: '2025-01-10',
          deliveryDate: '2025-01-12',
          deliveryAddress: '123 Health Street, New York, NY 10001',
          trackingNumber: 'TRK-2025-002'
        },
        {
          id: '3',
          orderNumber: 'ORD-2025-003',
          pharmacyName: 'City Pharmacy',
          pharmacyPhone: '+1 (555) 444-5555',
          status: 'pending',
          items: [
            { id: 'i5', name: 'Cetirizine 10mg', dosage: '10mg', quantity: 14, price: 8, image: '' }
          ],
          totalAmount: 8,
          discount: 0,
          finalAmount: 8,
          paymentMethod: 'cash',
          paymentStatus: 'pending',
          orderDate: '2025-01-17',
          deliveryDate: '2025-01-19',
          deliveryAddress: '123 Health Street, New York, NY 10001',
          trackingNumber: 'TRK-2025-003',
          prescriptionUrl: '#'
        },
        {
          id: '4',
          orderNumber: 'ORD-2024-045',
          pharmacyName: 'MediCare Pharmacy',
          pharmacyPhone: '+1 (555) 777-8888',
          status: 'cancelled',
          items: [
            { id: 'i6', name: 'Ibuprofen 400mg', dosage: '400mg', quantity: 20, price: 10, image: '' }
          ],
          totalAmount: 10,
          discount: 0,
          finalAmount: 10,
          paymentMethod: 'online',
          paymentStatus: 'refunded',
          orderDate: '2024-12-20',
          deliveryDate: '2024-12-22',
          deliveryAddress: '123 Health Street, New York, NY 10001',
          trackingNumber: 'TRK-2024-045',
          notes: 'Cancelled by customer'
        }
      ];
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
  };

  const handleTrackOrder = (order: MedicineOrder) => {
    setSelectedOrder(order);
    
    // Generate mock tracking
    const steps: OrderTracking[] = [
      { status: 'Order Placed', date: order.orderDate, time: '10:00 AM', location: 'Online', completed: true },
      { status: 'Confirmed', date: order.orderDate, time: '10:30 AM', location: order.pharmacyName, completed: true },
      { status: 'Processing', date: order.orderDate, time: '11:00 AM', location: order.pharmacyName, completed: order.status !== 'pending' },
      { status: 'Packed', date: order.orderDate, time: '2:00 PM', location: order.pharmacyName, completed: ['shipped', 'delivered'].includes(order.status) },
      { status: 'Shipped', date: order.deliveryDate, time: '9:00 AM', location: 'Courier Service', completed: order.status === 'delivered' },
      { status: 'Delivered', date: order.deliveryDate, time: '4:00 PM', location: order.deliveryAddress, completed: order.status === 'delivered' }
    ];
    
    setTrackingSteps(steps);
    setShowTracking(true);
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'processing': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'shipped': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'processing': return <Package className="w-4 h-4" />;
      case 'shipped': return <Truck className="w-4 h-4" />;
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.pharmacyName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = 
      activeTab === 'all' ? true :
      activeTab === 'active' ? ['pending', 'confirmed', 'processing', 'shipped'].includes(order.status) :
      activeTab === 'completed' ? order.status === 'delivered' :
      activeTab === 'cancelled' ? order.status === 'cancelled' :
      true;
    
    return matchesSearch && matchesTab;
  });

  const tabs = [
    { id: 'all', label: 'All Orders', count: orders.length },
    { id: 'active', label: 'Active', count: orders.filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).length },
    { id: 'completed', label: 'Completed', count: orders.filter(o => o.status === 'delivered').length },
    { id: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.status === 'cancelled').length }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-500 text-sm">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <ShoppingBag className="w-7 h-7 mr-3 text-blue-600" />
            My Orders
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Track your medicine orders & deliveries</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <StatCard icon={<ShoppingBag className="w-5 h-5 text-blue-500" />} label="Total Orders" value={orders.length.toString()} color="blue" />
          <StatCard icon={<Truck className="w-5 h-5 text-orange-500" />} label="Active" value={orders.filter(o => ['pending', 'confirmed', 'processing', 'shipped'].includes(o.status)).length.toString()} color="orange" />
          <StatCard icon={<CheckCircle className="w-5 h-5 text-green-500" />} label="Delivered" value={orders.filter(o => o.status === 'delivered').length.toString()} color="green" />
          <StatCard icon={<DollarSign className="w-5 h-5 text-purple-500" />} label="Total Spent" value={`$${orders.reduce((sum, o) => sum + o.finalAmount, 0)}`} color="purple" />
        </div>

        {/* Search & Tabs */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order number, pharmacy..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all"
            >
              {/* Order Header */}
              <div className="px-5 py-3 bg-gray-50 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-500">{order.orderNumber}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
                <span className="text-xs text-gray-500">{order.orderDate}</span>
              </div>

              {/* Order Content */}
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Pharmacy Info */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Pharmacy</p>
                    <p className="font-semibold text-sm">{order.pharmacyName}</p>
                    <button 
                      onClick={() => window.open(`tel:${order.pharmacyPhone}`, '_self')}
                      className="text-xs text-blue-600 flex items-center gap-1 mt-1"
                    >
                      <Phone className="w-3 h-3" /> {order.pharmacyPhone}
                    </button>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Items</p>
                    <div className="space-y-1">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-green-500" />
                          <span className="text-sm">{item.name}</span>
                          <span className="text-xs text-gray-500">x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Amount & Actions */}
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                    <p className="text-lg font-bold text-green-600">${order.finalAmount}</p>
                    {order.discount > 0 && (
                      <p className="text-xs text-gray-400 line-through">${order.totalAmount}</p>
                    )}
                    <div className="flex gap-2 mt-3 justify-end">
                      <button
                        onClick={() => handleTrackOrder(order)}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 flex items-center gap-1"
                      >
                        <Truck className="w-3.5 h-3.5" /> Track
                      </button>
                      <button className="px-3 py-1.5 border text-xs rounded-lg hover:bg-gray-50 flex items-center gap-1">
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                    </div>
                  </div>
                </div>

                {/* Delivery Address */}
                <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs text-gray-500">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{order.deliveryAddress}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No orders found</h3>
            <p className="text-gray-500 text-sm mt-1">Start ordering medicines from a pharmacy</p>
          </div>
        )}
      </div>

      {/* TRACKING MODAL */}
      {showTracking && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowTracking(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Truck className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg">Order Tracking</h3>
              <p className="text-sm text-gray-500">{selectedOrder.orderNumber}</p>
            </div>

            {/* Tracking Timeline */}
            <div className="space-y-0">
              {trackingSteps.map((step, index) => (
                <div key={index} className="flex gap-3">
                  {/* Line & Circle */}
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      step.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step.completed ? <CheckCircle className="w-5 h-5" /> : index + 1}
                    </div>
                    {index < trackingSteps.length - 1 && (
                      <div className={`w-0.5 h-10 ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className={`pb-6 ${!step.completed ? 'opacity-50' : ''}`}>
                    <p className="font-medium text-sm">{step.status}</p>
                    <p className="text-xs text-gray-500">{step.date} at {step.time}</p>
                    <p className="text-xs text-gray-400">{step.location}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-xl p-4 mt-4">
              <p className="text-xs text-gray-500 mb-2">Order Summary</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Tracking Number</span>
                  <span className="font-mono">{selectedOrder.trackingNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pharmacy</span>
                  <span>{selectedOrder.pharmacyName}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Amount</span>
                  <span className="font-bold text-green-600">${selectedOrder.finalAmount}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTracking(false)}
              className="w-full mt-4 py-2.5 border border-gray-300 rounded-xl text-sm hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 border-${color}-500`}>
    <div className="flex items-center justify-between">
      {icon}
      <span className="text-2xl font-bold text-gray-800">{value}</span>
    </div>
    <p className="text-xs text-gray-500 mt-2">{label}</p>
  </div>
);

export default ClientOrders;