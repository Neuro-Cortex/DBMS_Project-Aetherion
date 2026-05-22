// src/components/oxygen/OxygenDashboard.tsx

import React, { useState, useEffect, useCallback } from 'react';
import {
  Wind, AlertCircle, MapPin, Phone, Clock,
  TrendingUp, TrendingDown, Activity, Users,
  Bell, Search, Filter, Navigation, Droplet,
  Thermometer, Shield, Zap, Truck, Layers
} from 'lucide-react';
import { GoogleMap, LoadScript, Marker, InfoWindow, Circle } from '@/shims/googleMapsApi';
import { OxygenDashboardData, OxygenCenter } from '../../types/oxygenNetwork';

// Google Maps container style
const mapContainerStyle = {
  width: '100%',
  height: '500px',
  borderRadius: '12px'
};

// Default center (New York)
const defaultCenter = {
  lat: 40.7128,
  lng: -74.006
};

// Google Maps options
const mapOptions = {
  styles: [
    {
      featureType: 'poi.medical',
      elementType: 'geometry',
      stylers: [{ color: '#ff0000' }]
    }
  ],
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: true,
  streetViewControl: true,
  fullscreenControl: true
};

interface OxygenDashboardProps {
  onNavigate?: (page: string) => void;
  googleMapsApiKey?: string; // Your Google Maps API Key
}

export const OxygenDashboard: React.FC<OxygenDashboardProps> = ({ 
  onNavigate = () => {}, 
  googleMapsApiKey = '' 
}) => {
  const [dashboardData, setDashboardData] = useState<OxygenDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchRadius, setSearchRadius] = useState(10);
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [selectedCenter, setSelectedCenter] = useState<OxygenCenter | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [showEmergencyOnly, setShowEmergencyOnly] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Map icons based on stock status
  const getMarkerIcon = (status: string) => {
    const colors: Record<string, string> = {
      'sufficient': 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
      'low': 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
      'critical': 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
      'out-of-stock': 'http://maps.google.com/mapfiles/ms/icons/grey-dot.png'
    };
    return colors[status] || colors['sufficient'];
  };

  useEffect(() => {
    fetchDashboardData();
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setUserLocation(userPos);
          setMapCenter(userPos);
        },
        () => {
          console.log('Using default location');
        }
      );
    }
  };

  const fetchDashboardData = async () => {
    setTimeout(() => {
      const mockData: OxygenDashboardData = {
        totalCenters: 25,
        centersWithStock: 20,
        totalCylinders: 1500,
        availableCylinders: 850,
        emergencyRequests: 5,
        activeAlerts: 3,
        stockDistribution: {
          labels: ['Sufficient', 'Low', 'Critical', 'Out of Stock'],
          values: [12, 5, 5, 3]
        },
        cylinderUsage: {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          inUse: [200, 250, 230, 280, 260, 220, 240],
          available: [800, 750, 770, 720, 740, 780, 760]
        },
        recentRequests: [
          {
            id: '1',
            requestNumber: 'OXY-001',
            patientName: 'John Smith',
            patientAge: 65,
            patientCondition: 'Respiratory distress',
            oxygenType: 'D-type',
            cylindersNeeded: 3,
            urgency: 'emergency',
            hospitalName: 'City General Hospital',
            doctorName: 'Dr. Wilson',
            status: 'pending',
            deliveryAddress: '123 Patient St',
            coordinates: { latitude: 40.7128, longitude: -74.006 },
            contactPhone: '+1 (555) 111-2222',
            contactEmail: 'emergency@email.com',
            requestDate: '2024-02-15T10:00:00',
            requiredDate: '2024-02-15T11:00:00'
          },
          {
            id: '2',
            requestNumber: 'OXY-002',
            patientName: 'Sarah Johnson',
            patientAge: 45,
            patientCondition: 'COVID-19 complications',
            oxygenType: 'J-type',
            cylindersNeeded: 5,
            urgency: 'emergency',
            hospitalName: 'Metro Hospital',
            doctorName: 'Dr. Brown',
            status: 'pending',
            deliveryAddress: '456 Health Ave',
            coordinates: { latitude: 40.7580, longitude: -73.9855 },
            contactPhone: '+1 (555) 333-4444',
            contactEmail: 'sarah@email.com',
            requestDate: '2024-02-15T10:30:00',
            requiredDate: '2024-02-15T11:30:00'
          }
        ],
        activeEmergencies: [
          {
            id: '1',
            alertType: 'low-stock',
            hospitalName: 'Metro Hospital',
            message: 'Oxygen stock below 20% - Urgent refill needed',
            priority: 'critical',
            status: 'active',
            coordinates: { latitude: 40.7580, longitude: -73.9855 },
            createdAt: '2024-02-15T09:30:00'
          }
        ],
        nearbyCenters: [
          {
            id: '1',
            name: 'City General Hospital',
            type: 'hospital',
            oxygenStock: {
              id: 's1',
              hospitalId: 'h1',
              hospitalName: 'City General Hospital',
              totalCylinders: 100,
              availableCylinders: 65,
              inUseCylinders: 30,
              reservedCylinders: 5,
              cylinders: [],
              status: 'sufficient',
              emergencySupport: true,
              address: {
                street: '123 Medical Dr',
                city: 'New York',
                state: 'NY',
                zipCode: '10001',
                country: 'USA'
              },
              coordinates: { latitude: 40.7128, longitude: -74.006 },
              phone: '+1 (555) 999-8888',
              emergencyPhone: '911',
              lastUpdated: '2024-02-15',
              lastRefilled: '2024-02-10',
              nextRefillDate: '2024-02-20',
              supplier: 'MedOxy Supplies',
              supplierContact: '+1 (555) 777-6666'
            },
            address: {
              street: '123 Medical Dr',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'USA'
            },
            coordinates: { latitude: 40.7128, longitude: -74.006 },
            distance: 2.5,
            estimatedTime: '8 min',
            isOpen: true,
            isEmergencyReady: true,
            operatingHours: '24/7',
            phone: '+1 (555) 999-8888',
            emergencyPhone: '911',
            rating: 4.5,
            totalReviews: 250
          },
          {
            id: '2',
            name: 'Metro Hospital',
            type: 'hospital',
            oxygenStock: {
              id: 's2',
              hospitalId: 'h2',
              hospitalName: 'Metro Hospital',
              totalCylinders: 50,
              availableCylinders: 10,
              inUseCylinders: 35,
              reservedCylinders: 5,
              cylinders: [],
              status: 'critical',
              emergencySupport: true,
              address: {
                street: '789 Health Blvd',
                city: 'New York',
                state: 'NY',
                zipCode: '10019',
                country: 'USA'
              },
              coordinates: { latitude: 40.7580, longitude: -73.9855 },
              phone: '+1 (555) 444-5555',
              emergencyPhone: '911',
              lastUpdated: '2024-02-15',
              lastRefilled: '2024-02-05',
              nextRefillDate: '2024-02-16',
              supplier: 'OxyCare Inc',
              supplierContact: '+1 (555) 888-9999'
            },
            address: {
              street: '789 Health Blvd',
              city: 'New York',
              state: 'NY',
              zipCode: '10019',
              country: 'USA'
            },
            coordinates: { latitude: 40.7580, longitude: -73.9855 },
            distance: 5.2,
            estimatedTime: '15 min',
            isOpen: true,
            isEmergencyReady: true,
            operatingHours: '24/7',
            phone: '+1 (555) 444-5555',
            emergencyPhone: '911',
            rating: 4.2,
            totalReviews: 180
          },
          {
            id: '3',
            name: 'Central Oxygen Bank',
            type: 'oxygen-bank',
            oxygenStock: {
              id: 's3',
              hospitalId: 'o1',
              hospitalName: 'Central Oxygen Bank',
              totalCylinders: 200,
              availableCylinders: 150,
              inUseCylinders: 40,
              reservedCylinders: 10,
              cylinders: [],
              status: 'sufficient',
              emergencySupport: true,
              address: {
                street: '456 Supply Rd',
                city: 'New York',
                state: 'NY',
                zipCode: '10011',
                country: 'USA'
              },
              coordinates: { latitude: 40.7420, longitude: -73.9890 },
              phone: '+1 (555) 222-3333',
              emergencyPhone: '911',
              lastUpdated: '2024-02-15',
              lastRefilled: '2024-02-14',
              nextRefillDate: '2024-02-21',
              supplier: 'OxygenCorp',
              supplierContact: '+1 (555) 111-0000'
            },
            address: {
              street: '456 Supply Rd',
              city: 'New York',
              state: 'NY',
              zipCode: '10011',
              country: 'USA'
            },
            coordinates: { latitude: 40.7420, longitude: -73.9890 },
            distance: 3.8,
            estimatedTime: '12 min',
            isOpen: true,
            isEmergencyReady: true,
            operatingHours: '8 AM - 10 PM',
            phone: '+1 (555) 222-3333',
            emergencyPhone: '911',
            rating: 4.8,
            totalReviews: 320
          }
        ],
        alerts: [
          {
            id: '1',
            type: 'stock-low',
            title: 'Low Oxygen Stock',
            message: 'Metro Hospital oxygen stock below 20%',
            hospitalName: 'Metro Hospital',
            priority: 'critical',
            createdAt: '2024-02-15T09:30:00',
            isRead: false
          }
        ]
      };

      setDashboardData(mockData);
      setIsLoading(false);
    }, 1500);
  };

  // Handle map load
  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  // Handle map unmount
  const onMapUnmount = useCallback(() => {
    setMap(null);
  }, []);

  // Handle marker click
  const handleMarkerClick = (center: OxygenCenter) => {
    setSelectedCenter(center);
  };

  // Get directions to center
  const getDirections = (center: OxygenCenter) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${center.coordinates.latitude},${center.coordinates.longitude}`;
    window.open(url, '_blank');
  };

  if (isLoading || !dashboardData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading Oxygen Network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-lg p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center">
              <Wind className="w-8 h-8 mr-3" />
              Oxygen Network System
            </h1>
            <p className="text-blue-100 mt-2">
              Real-time oxygen availability monitoring & emergency support
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm">Live Monitoring</p>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                <span className="font-medium">Active</span>
              </div>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <p className="text-sm">Centers Tracking</p>
              <p className="font-medium">{dashboardData.totalCenters} centers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <StatCard
          icon={<Wind className="w-6 h-6 text-blue-500" />}
          label="Total Cylinders"
          value={dashboardData.totalCylinders.toString()}
          subtitle={`${dashboardData.availableCylinders} available`}
          color="blue"
        />
        <StatCard
          icon={<Shield className="w-6 h-6 text-green-500" />}
          label="Available"
          value={dashboardData.availableCylinders.toString()}
          subtitle="Ready to use"
          color="green"
        />
        <StatCard
          icon={<AlertCircle className="w-6 h-6 text-red-500" />}
          label="Emergency Requests"
          value={dashboardData.emergencyRequests.toString()}
          subtitle="Pending"
          color="red"
        />
        <StatCard
          icon={<Bell className="w-6 h-6 text-yellow-500" />}
          label="Active Alerts"
          value={dashboardData.activeAlerts.toString()}
          subtitle="Need attention"
          color="yellow"
        />
        <StatCard
          icon={<Activity className="w-6 h-6 text-purple-500" />}
          label="Centers Online"
          value={dashboardData.centersWithStock.toString()}
          subtitle={`/${dashboardData.totalCenters} total`}
          color="purple"
        />
        <StatCard
          icon={<Truck className="w-6 h-6 text-orange-500" />}
          label="In Transit"
          value="12"
          subtitle="Deliveries active"
          color="orange"
        />
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* GOOGLE MAPS SECTION */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-4 border-b flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h2 className="text-xl font-semibold flex items-center">
                <MapPin className="w-6 h-6 mr-2 text-red-500" />
                Live Oxygen Center Map
              </h2>
              <div className="flex items-center space-x-2">
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                  <span className="text-xs">Sufficient</span>
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-1"></div>
                  <span className="text-xs">Low</span>
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-1"></div>
                  <span className="text-xs">Critical</span>
                </span>
                <span className="flex items-center">
                  <div className="w-3 h-3 bg-gray-500 rounded-full mr-1"></div>
                  <span className="text-xs">Out</span>
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  checked={showEmergencyOnly}
                  onChange={(e) => setShowEmergencyOnly(e.target.checked)}
                  className="w-4 h-4 text-red-600"
                />
                <span>Emergency Centers Only</span>
              </label>
              <select
                value={searchRadius}
                onChange={(e) => setSearchRadius(Number(e.target.value))}
                className="border rounded-lg px-3 py-1 text-sm"
              >
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="25">25 km</option>
                <option value="50">50 km</option>
              </select>
              <button 
                onClick={() => {
                  if (map) {
                    map.panTo(userLocation);
                    map.setZoom(13);
                  }
                }}
                className="bg-blue-600 text-white px-4 py-1 rounded-lg text-sm hover:bg-blue-700 flex items-center"
              >
                <Navigation className="w-4 h-4 mr-1" />
                My Location
              </button>
            </div>
          </div>
          
          {/* Google Maps Component */}
          <LoadScript googleMapsApiKey={googleMapsApiKey}>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={mapCenter}
              zoom={13}
              options={mapOptions}
              onLoad={onMapLoad}
              onUnmount={onMapUnmount}
            >
              {/* User Location Marker */}
              <Marker
                position={userLocation}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                  scaledSize: new google.maps.Size(40, 40)
                }}
                title="Your Location"
              />

              {/* Search Radius Circle */}
              <Circle
                center={userLocation}
                radius={searchRadius * 1000} // Convert km to meters
                options={{
                  fillColor: '#4285F4',
                  fillOpacity: 0.1,
                  strokeColor: '#4285F4',
                  strokeOpacity: 0.3,
                  strokeWeight: 2
                }}
              />

              {/* Oxygen Center Markers */}
              {dashboardData.nearbyCenters
                .filter(center => !showEmergencyOnly || center.oxygenStock.status === 'critical')
                .map((center) => (
                  <Marker
                    key={center.id}
                    position={center.coordinates}
                    icon={{
                      url: getMarkerIcon(center.oxygenStock.status),
                      scaledSize: new google.maps.Size(32, 32)
                    }}
                    title={center.name}
                    onClick={() => handleMarkerClick(center)}
                    animation={center.oxygenStock.status === 'critical' ? google.maps.Animation.BOUNCE : undefined}
                  />
                ))}

              {/* Info Window for Selected Center */}
              {selectedCenter && (
                <InfoWindow
                  position={selectedCenter.coordinates}
                  onCloseClick={() => setSelectedCenter(null)}
                >
                  <div className="p-2 max-w-xs">
                    <h3 className="font-bold text-lg mb-2">{selectedCenter.name}</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <span className={`font-semibold ${
                          selectedCenter.oxygenStock.status === 'sufficient' ? 'text-green-600' :
                          selectedCenter.oxygenStock.status === 'low' ? 'text-yellow-600' :
                          selectedCenter.oxygenStock.status === 'critical' ? 'text-red-600' :
                          'text-gray-600'
                        }`}>
                          {selectedCenter.oxygenStock.status.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Available:</span>
                        <span className="font-semibold">{selectedCenter.oxygenStock.availableCylinders} cylinders</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Distance:</span>
                        <span className="font-semibold">{selectedCenter.distance} km</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ETA:</span>
                        <span className="font-semibold">{selectedCenter.estimatedTime}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <span className="font-semibold">⭐ {selectedCenter.rating}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-3">
                      <button
                        onClick={() => getDirections(selectedCenter)}
                        className="flex-1 bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700"
                      >
                        Get Directions
                      </button>
                      <button
                        onClick={() => window.open(`tel:${selectedCenter.phone}`)}
                        className="flex-1 bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                      >
                        Call Now
                      </button>
                    </div>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </LoadScript>
        </div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Oxygen Centers List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Layers className="w-5 h-5 mr-2 text-blue-500" />
              Nearby Oxygen Centers
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {dashboardData.nearbyCenters
                .filter(center => !showEmergencyOnly || center.oxygenStock.status === 'critical')
                .map((center) => (
                  <OxygenCenterCard 
                    key={center.id} 
                    center={center}
                    onGetDirections={() => getDirections(center)}
                    onSelect={() => {
                      setSelectedCenter(center);
                      if (map) {
                        map.panTo(center.coordinates);
                        map.setZoom(15);
                      }
                    }}
                  />
                ))}
            </div>
          </div>

          {/* Emergency Requests */}
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-4 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Emergency Oxygen Requests
              </h3>
              <div className="space-y-3">
                {dashboardData.recentRequests.map((request) => (
                  <div key={request.id} className="bg-red-400/30 rounded-lg p-4">
                    <p className="font-medium">{request.patientName}</p>
                    <p className="text-sm opacity-90">{request.patientCondition}</p>
                    <div className="flex items-center space-x-2 mt-2 text-sm">
                      <Wind className="w-4 h-4" />
                      <span>{request.cylindersNeeded} cylinders</span>
                    </div>
                    <p className="text-xs opacity-80 mt-2">
                      Required by: {request.requiredDate}
                    </p>
                    <button className="mt-2 w-full bg-white text-red-600 px-3 py-1 rounded text-sm font-medium hover:bg-red-50">
                      Respond Now
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Emergency Helpline */}
            <div className="bg-blue-600 text-white rounded-lg shadow p-6">
              <h3 className="font-semibold mb-3 flex items-center">
                <Phone className="w-5 h-5 mr-2" />
                Emergency Oxygen Helpline
              </h3>
              <p className="text-3xl font-bold mb-2">1-800-OXYGEN</p>
              <p className="text-sm text-blue-100 mb-4">
                24/7 Emergency Oxygen Support
              </p>
              <button 
                onClick={() => window.open('tel:1-800-699-4366')}
                className="w-full bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50"
              >
                Call Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Updated StatCard with better styling
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  color: string;
}> = ({ icon, label, value, subtitle, color }) => (
  <div className="bg-white rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 bg-${color}-100 rounded-lg`}>
        {icon}
      </div>
      <TrendingUp className="w-4 h-4 text-green-500" />
    </div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-xs text-gray-600">{label}</p>
    <p className="text-xs text-gray-400 mt-1">{subtitle}</p>
  </div>
);

// Updated OxygenCenterCard with directions
const OxygenCenterCard: React.FC<{ 
  center: OxygenCenter;
  onGetDirections: () => void;
  onSelect: () => void;
}> = ({ center, onGetDirections, onSelect }) => {
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'sufficient': return 'bg-green-100 text-green-700 border-green-300';
      case 'low': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      case 'out-of-stock': return 'bg-gray-100 text-gray-700 border-gray-300';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div 
      className="border-2 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-all hover:shadow-md"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-lg">{center.name}</h3>
          <div className="flex items-center space-x-3 mt-1 text-sm text-gray-600">
            <span className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              {center.distance} km
            </span>
            <span className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {center.estimatedTime}
            </span>
            <span className="flex items-center">
              <Star className="w-4 h-4 mr-1 text-yellow-500" />
              {center.rating}
            </span>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(center.oxygenStock.status)}`}>
          {center.oxygenStock.status.toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600">Total</p>
          <p className="font-bold text-xl">{center.oxygenStock.totalCylinders}</p>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600">Available</p>
          <p className="font-bold text-xl text-green-600">{center.oxygenStock.availableCylinders}</p>
        </div>
        <div className="bg-orange-50 rounded-lg p-3 text-center">
          <p className="text-xs text-gray-600">In Use</p>
          <p className="font-bold text-xl text-orange-600">{center.oxygenStock.inUseCylinders}</p>
        </div>
      </div>

      {/* Progress Bar for Availability */}
      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-gray-600">Availability</span>
          <span className="font-medium">
            {Math.round((center.oxygenStock.availableCylinders / center.oxygenStock.totalCylinders) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full ${
              center.oxygenStock.status === 'sufficient' ? 'bg-green-500' :
              center.oxygenStock.status === 'low' ? 'bg-yellow-500' :
              center.oxygenStock.status === 'critical' ? 'bg-red-500' :
              'bg-gray-500'
            }`}
            style={{ 
              width: `${(center.oxygenStock.availableCylinders / center.oxygenStock.totalCylinders) * 100}%` 
            }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{center.phone}</span>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onGetDirections(); }}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 flex items-center"
          >
            <Navigation className="w-3 h-3 mr-1" />
            Directions
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); window.open(`tel:${center.phone}`); }}
            className="px-3 py-1 border-2 border-blue-600 text-blue-600 text-sm rounded hover:bg-blue-50 flex items-center"
          >
            <Phone className="w-3 h-3 mr-1" />
            Call
          </button>
        </div>
      </div>

      {!center.isOpen && (
        <div className="mt-3 p-2 bg-red-50 rounded text-center border border-red-200">
          <p className="text-xs text-red-600 font-medium">Currently Closed - {center.operatingHours}</p>
        </div>
      )}
    </div>
  );
};

// Star component
const Star: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

export default OxygenDashboard;
