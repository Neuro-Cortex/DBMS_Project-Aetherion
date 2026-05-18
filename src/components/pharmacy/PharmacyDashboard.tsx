// src/components/pharmacy/PharmacyDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  Pill, ShoppingBag, TrendingUp, AlertCircle,
  Package, DollarSign, Clock, CheckCircle,
  XCircle, Truck, Search, Bell, Settings,
  Activity, Users, Star, Calendar
} from 'lucide-react';
import { PharmacyDashboardData, GoogleMap, LoadScript, Marker } from '../../types/pharmacy';

interface PharmacyDashboardProps {
  pharmacyId: string;
  onNavigate: (page: string) => void;
  googleMapsApiKey?: string;
}

export const PharmacyDashboard: React.FC<PharmacyDashboardProps> = ({
  pharmacyId,
  onNavigate,
  googleMapsApiKey
}) => {
  const [dashboardData, setDashboardData] = useState<PharmacyDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    fetchDashboardData();
  }, [pharmacyId, timeRange]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData: PharmacyDashboardData = {
        pharmacy: {
          id: '1',
          name: 'MediCare Pharmacy',
          registrationNumber: 'PH123456',
          licenseNumber: 'LIC789012',
          phone: '+1 (555) 777-8888',
          emergencyPhone: '+1 (555) 999-0000',
          email: 'info@medicarepharmacy.com',
          address: {
            street: '456 Health Blvd',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'USA'
          },
          ownerName: 'Robert Wilson',
          pharmacistName: 'Dr. Lisa Anderson',
          pharmacistLicense: 'PHL12345',
          isVerified: true,
          isOpen: true,
          is24x7: true,
          status: 'active',
          openingTime: '08:00',
          closingTime: '22:00',
          services: ['prescription', 'otc', 'delivery', 'emergency'],
          deliveryAvailable: true,
          deliveryRadius: 10,
          emergencyService: true,
          rating: 4.7,
          reviewCount: 350,
          totalOrders: 12500,
          coordinates: {
            latitude: 40.7128,
            longitude: -74.006
          },
          createdAt: '2023-01-01',
          updatedAt: '2025-01-15'
        },
        todayOrders: 45,
        totalOrders: 12500,
        totalRevenue: 250000,
        todayRevenue: 1250,
        totalMedicines: 2500,
        lowStockItems: 15,
        expiredItems: 3,
        pendingOrders: [
          {
            id: 'o1',
            orderNumber: 'ORD-001',
            userId: 'u1',
            pharmacyId: '1',
            customerName: 'John Doe',
            customerPhone: '+1 (555) 111-2222',
            customerEmail: 'john@email.com',
            items: [
              { medicineId: 'm1', medicineName: 'Amoxicillin', quantity: 2, unitPrice: 15, totalPrice: 30 }
            ],
            totalAmount: 30,
            discount: 0,
            finalAmount: 30,
            paymentMethod: 'online',
            paymentStatus: 'paid',
            prescriptionRequired: true,
            prescriptionUrl: '#',
            prescriptionVerified: true,
            deliveryAddress: '123 Patient St',
            deliveryStatus: 'pending',
            estimatedDelivery: '2025-01-16T14:00:00',
            status: 'pending',
            orderDate: '2025-01-16T10:00:00'
          }
        ],
        stockAlerts: [
          {
            id: 's1',
            medicineId: 'm5',
            medicineName: 'Paracetamol 500mg',
            currentStock: 5,
            minStock: 20,
            status: 'critical',
            lastUpdated: '2025-01-16'
          },
          {
            id: 's2',
            medicineId: 'm8',
            medicineName: 'Insulin Injection',
            currentStock: 2,
            minStock: 10,
            status: 'critical',
            lastUpdated: '2025-01-16'
          }
        ],
        salesData: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          values: [1200, 1500, 1100, 1800, 1600, 900, 800],
          totalSales: 125000,
          averageOrderValue: 35,
          topSellingMedicines: [
            { name: 'Paracetamol', quantity: 500, revenue: 5000 },
            { name: 'Amoxicillin', quantity: 300, revenue: 4500 },
            { name: 'Vitamin C', quantity: 400, revenue: 3200 }
          ]
        },
        recentOrders: []
      };

      setDashboardData(mockData);
      setIsLoading(false);
    }, 1500);
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen bg-green-50">
        <div className="text-center">
          <Pill className="w-16 h-16 text-green-600 mx-auto animate-pulse" />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mt-4"></div>
        </div>
      </div>
    );
  }

  const pharmacy = dashboardData.pharmacy;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-2xl p-8 mb-8 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Pill className="w-8 h-8 mr-3" />
              {pharmacy.name}
            </h1>
            <div className="flex items-center space-x-4 mt-2 text-green-100">
              <span>⭐ {pharmacy.rating}</span>
              <span>📋 {pharmacy.totalOrders} orders</span>
              <span className={`px-2 py-1 rounded-full text-sm ${
                pharmacy.isOpen ? 'bg-green-400 text-green-900' : 'bg-red-400 text-red-900'
              }`}>
                {pharmacy.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="relative">
              <Bell className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {dashboardData.stockAlerts.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
        <QuickStat icon={<ShoppingBag />} label="Today Orders" value="45" color="blue" />
        <QuickStat icon={<DollarSign />} label="Today Revenue" value="$1,250" color="green" />
        <QuickStat icon={<Package />} label="Total Medicines" value="2,500" color="purple" />
        <QuickStat icon={<AlertCircle />} label="Low Stock" value="15" color="yellow" />
        <QuickStat icon={<XCircle />} label="Expired" value="3" color="red" />
        <QuickStat icon={<Star />} label="Rating" value="4.7" color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Pending Orders */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="w-6 h-6 mr-2 text-orange-500" />
              Pending Orders
            </h2>
            {dashboardData.pendingOrders.map((order) => (
              <div key={order.id} className="border rounded-xl p-4 mb-3 hover:bg-orange-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{order.orderNumber}</p>
                    <p className="text-sm text-gray-600">{order.customerName}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {order.items.map((item, i) => (
                        <span key={i} className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {item.medicineName} x{item.quantity}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${order.finalAmount}</p>
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full">
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-3">
                  <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                    Accept
                  </button>
                  <button className="px-3 py-1 border text-sm rounded hover:bg-gray-50">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Sales Analytics */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <TrendingUp className="w-6 h-6 mr-2 text-blue-500" />
              Sales Analytics
            </h2>
            <div className="h-48 bg-gray-50 rounded-lg flex items-center justify-center mb-4">
              <p className="text-gray-500">Sales Chart - ${dashboardData.salesData.totalSales} total</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Top Selling Medicines</h3>
              {dashboardData.salesData.topSellingMedicines.map((med, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm">{med.name}</span>
                  <span className="text-sm font-medium">{med.quantity} units • ${med.revenue}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Stock Alerts */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              Stock Alerts
            </h3>
            {dashboardData.stockAlerts.map((alert) => (
              <div key={alert.id} className="bg-red-400/30 rounded-lg p-3 mb-3">
                <p className="font-medium text-sm">{alert.medicineName}</p>
                <div className="flex justify-between text-sm mt-1">
                  <span>Stock: {alert.currentStock}</span>
                  <span>Min: {alert.minStock}</span>
                </div>
                <span className="text-xs bg-red-200 text-red-800 px-2 py-1 rounded-full">
                  {alert.status}
                </span>
              </div>
            ))}
            <button 
              onClick={() => onNavigate('stock-management')}
              className="w-full mt-2 bg-white text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-50"
            >
              Manage Stock
            </button>
          </div>

          {/* Delivery Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-blue-500" />
              Delivery Status
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Active Deliveries</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivered Today</span>
                <span className="font-medium text-green-600">25</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Radius</span>
                <span className="font-medium">{pharmacy.deliveryRadius} km</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <ActionBtn icon={<Pill />} label="Add Medicine" onClick={() => onNavigate('add-medicine')} />
              <ActionBtn icon={<Package />} label="View Stock" onClick={() => onNavigate('stock')} />
              <ActionBtn icon={<ShoppingBag />} label="Orders" onClick={() => onNavigate('orders')} />
              <ActionBtn icon={<Truck />} label="Delivery" onClick={() => onNavigate('delivery')} />
              <ActionBtn icon={<TrendingUp />} label="Analytics" onClick={() => onNavigate('analytics')} />
              <ActionBtn icon={<Bell />} label="Alerts" onClick={() => onNavigate('alerts')} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickStat: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl shadow p-4">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 bg-${color}-100 rounded-lg`}>{icon}</div>
    </div>
    <p className="text-xl font-bold">{value}</p>
    <p className="text-xs text-gray-600">{label}</p>
  </div>
);

const ActionBtn: React.FC<{
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}> = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center p-3 bg-gray-50 rounded-lg hover:bg-green-50 hover:text-green-600"
  >
    <div className="w-6 h-6 mb-1">{icon}</div>
    <span className="text-xs">{label}</span>
  </button>
);

export default PharmacyDashboard;