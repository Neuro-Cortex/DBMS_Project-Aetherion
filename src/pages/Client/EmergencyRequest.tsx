// src/pages/client/EmergencyRequest.tsx
// EMERGENCY REQUEST PAGE - CLIENT/PATIENT
// SOS | Ambulance | Blood | Oxygen | Medical Emergency

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle, Phone, MapPin, Clock, Users,
  Droplet, Wind, Truck, Heart, Activity,
  Navigation, Shield, Bell, Send, CheckCircle,
  XCircle, ChevronRight, Star, Search,
  Building2, Stethoscope, Radio
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface EmergencyRequest {
  id: string;
  type: 'ambulance' | 'blood' | 'oxygen' | 'medical' | 'rescue';
  status: 'pending' | 'processing' | 'dispatched' | 'arrived' | 'completed' | 'cancelled';
  priority: 'critical' | 'high' | 'medium';
  location: string;
  coordinates: { lat: number; lng: number };
  patientName: string;
  patientAge: number;
  patientBloodGroup: string;
  description: string;
  requestedAt: string;
  estimatedArrival: string;
  assignedUnit?: string;
  contactPhone: string;
  updates: EmergencyUpdate[];
}

interface EmergencyUpdate {
  id: string;
  message: string;
  timestamp: string;
  status: string;
}

interface NearbyHospital {
  id: string;
  name: string;
  distance: string;
  eta: string;
  rating: number;
  isOpen: boolean;
  hasEmergency: boolean;
  hasICU: boolean;
  phone: string;
  address: string;
}

interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  isAvailable: boolean;
  type: 'family' | 'doctor' | 'hospital' | 'ambulance';
}

interface EmergencyHistory {
  id: string;
  type: string;
  date: string;
  status: string;
  description: string;
  responseTime: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const ClientEmergencyRequest: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'request' | 'tracking' | 'history' | 'contacts'>('request');
  const [emergencyType, setEmergencyType] = useState<string>('ambulance');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<EmergencyRequest | null>(null);
  const [userLocation, setUserLocation] = useState({ lat: 40.7128, lng: -74.006 });
  const [locationAddress, setLocationAddress] = useState('123 Health Street, New York, NY 10001');
  
  // Form State
  const [formData, setFormData] = useState({
    patientName: 'John Doe',
    patientAge: 28,
    patientBloodGroup: 'O+',
    description: '',
    contactPhone: '+1 (555) 123-4567',
    alternatePhone: '+1 (555) 987-6543',
    landmark: '',
    additionalInfo: ''
  });

  // Mock Data
  const [nearbyHospitals, setNearbyHospitals] = useState<NearbyHospital[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [emergencyHistory, setEmergencyHistory] = useState<EmergencyHistory[]>([]);

  useEffect(() => {
    getUserLocation();
    fetchNearbyHospitals();
    fetchEmergencyContacts();
    fetchEmergencyHistory();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          setLocationAddress('Current Location Detected');
        },
        () => {
          console.log('Using default location');
        }
      );
    }
  };

  const fetchNearbyHospitals = () => {
    const hospitals: NearbyHospital[] = [
      {
        id: 'h1',
        name: 'City General Hospital',
        distance: '2.5 km',
        eta: '8 min',
        rating: 4.5,
        isOpen: true,
        hasEmergency: true,
        hasICU: true,
        phone: '+1 (555) 999-8888',
        address: '123 Medical Center Dr, New York'
      },
      {
        id: 'h2',
        name: 'Metro Emergency Center',
        distance: '3.8 km',
        eta: '12 min',
        rating: 4.3,
        isOpen: true,
        hasEmergency: true,
        hasICU: true,
        phone: '+1 (555) 777-6666',
        address: '456 Emergency Blvd, New York'
      },
      {
        id: 'h3',
        name: 'St. Mary Hospital',
        distance: '5.2 km',
        eta: '15 min',
        rating: 4.7,
        isOpen: true,
        hasEmergency: true,
        hasICU: false,
        phone: '+1 (555) 444-3333',
        address: '789 Health Ave, New York'
      }
    ];
    setNearbyHospitals(hospitals);
  };

  const fetchEmergencyContacts = () => {
    const contacts: EmergencyContact[] = [
      {
        id: 'c1',
        name: 'Jane Doe',
        relationship: 'Spouse',
        phone: '+1 (555) 987-6543',
        isAvailable: true,
        type: 'family'
      },
      {
        id: 'c2',
        name: 'Dr. Sarah Wilson',
        relationship: 'Primary Doctor',
        phone: '+1 (555) 333-4444',
        isAvailable: true,
        type: 'doctor'
      },
      {
        id: 'c3',
        name: 'City General Hospital',
        relationship: 'Emergency Room',
        phone: '+1 (555) 999-8888',
        isAvailable: true,
        type: 'hospital'
      },
      {
        id: 'c4',
        name: 'Metro Ambulance Service',
        relationship: 'Ambulance',
        phone: '+1 (555) 111-9999',
        isAvailable: true,
        type: 'ambulance'
      }
    ];
    setEmergencyContacts(contacts);
  };

  const fetchEmergencyHistory = () => {
    const history: EmergencyHistory[] = [
      {
        id: 'h1',
        type: 'ambulance',
        date: '2025-01-10',
        status: 'completed',
        description: 'Emergency transport to City General Hospital',
        responseTime: '8 min'
      },
      {
        id: 'h2',
        type: 'blood',
        date: '2024-12-15',
        status: 'completed',
        description: 'Emergency blood request - O+ blood',
        responseTime: '25 min'
      },
      {
        id: 'h3',
        type: 'medical',
        date: '2024-11-20',
        status: 'completed',
        description: 'Chest pain emergency consultation',
        responseTime: '12 min'
      }
    ];
    setEmergencyHistory(history);
  };

  // Handlers
  const handleSubmitEmergency = async () => {
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newRequest: EmergencyRequest = {
      id: Date.now().toString(),
      type: emergencyType as any,
      status: 'processing',
      priority: 'critical',
      location: locationAddress,
      coordinates: userLocation,
      patientName: formData.patientName,
      patientAge: formData.patientAge,
      patientBloodGroup: formData.patientBloodGroup,
      description: formData.description,
      requestedAt: new Date().toISOString(),
      estimatedArrival: '5-8 minutes',
      assignedUnit: 'AMB-007',
      contactPhone: formData.contactPhone,
      updates: [
        {
          id: 'u1',
          message: 'Emergency request received',
          timestamp: new Date().toISOString(),
          status: 'received'
        },
        {
          id: 'u2',
          message: 'Nearest ambulance dispatched',
          timestamp: new Date(Date.now() + 30000).toISOString(),
          status: 'dispatched'
        }
      ]
    };
    
    setCurrentRequest(newRequest);
    setIsSubmitting(false);
    setShowSuccess(true);
    setActiveTab('tracking');
  };

  const handleSOSPress = () => {
    setEmergencyType('ambulance');
    handleSubmitEmergency();
  };

  const handleCallContact = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'ambulance': return <Truck className="w-6 h-6 text-red-500" />;
      case 'blood': return <Droplet className="w-6 h-6 text-red-600" />;
      case 'oxygen': return <Wind className="w-6 h-6 text-blue-500" />;
      case 'medical': return <Stethoscope className="w-6 h-6 text-purple-500" />;
      case 'rescue': return <Shield className="w-6 h-6 text-orange-500" />;
      default: return <AlertTriangle className="w-6 h-6 text-red-500" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'ambulance': return 'Ambulance';
      case 'blood': return 'Blood Request';
      case 'oxygen': return 'Oxygen Emergency';
      case 'medical': return 'Medical Emergency';
      case 'rescue': return 'Rescue';
      default: return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'processing': return 'bg-blue-100 text-blue-700';
      case 'dispatched': return 'bg-purple-100 text-purple-700';
      case 'arrived': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============================================ */}
      {/* EMERGENCY HEADER BANNER */}
      {/* ============================================ */}
      <div className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Radio className="w-8 h-8 mr-3 animate-pulse" />
                Emergency Services
              </h1>
              <p className="text-red-100 mt-2">24/7 Emergency Response System</p>
            </div>
            
            {/* SOS BUTTON */}
            <button
              onClick={handleSOSPress}
              className="bg-white text-red-600 px-8 py-4 rounded-2xl font-bold text-xl hover:bg-red-50 animate-pulse shadow-2xl flex items-center"
            >
              <AlertTriangle className="w-6 h-6 mr-2" />
              SOS
            </button>
          </div>

          {/* Emergency Hotline */}
          <div className="mt-6 flex items-center space-x-6 text-sm">
            <button onClick={() => handleCallContact('911')} className="flex items-center bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30">
              <Phone className="w-4 h-4 mr-2" /> 911
            </button>
            <button onClick={() => handleCallContact('+1-800-EMERGENCY')} className="flex items-center bg-white/20 px-4 py-2 rounded-lg hover:bg-white/30">
              <Phone className="w-4 h-4 mr-2" /> 1-800-EMERGENCY
            </button>
            <span className="text-red-200">
              <Clock className="w-4 h-4 inline mr-1" />
              Average Response: 5-8 min
            </span>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* TABS NAVIGATION */}
      {/* ============================================ */}
      <div className="bg-white shadow-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'request', label: 'New Request', icon: Send },
              { id: 'tracking', label: 'Live Tracking', icon: Navigation },
              { id: 'history', label: 'History', icon: Clock },
              { id: 'contacts', label: 'Contacts', icon: Users }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-red-600 text-red-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.label}
                  {tab.id === 'tracking' && currentRequest && (
                    <span className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* MAIN CONTENT */}
      {/* ============================================ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* ============================================ */}
        {/* NEW REQUEST TAB */}
        {/* ============================================ */}
        {activeTab === 'request' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left - Emergency Type Selection & Form */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Emergency Type Cards */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Select Emergency Type</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'ambulance', icon: <Truck className="w-8 h-8" />, label: 'Ambulance', color: 'red' },
                    { id: 'blood', icon: <Droplet className="w-8 h-8" />, label: 'Blood Request', color: 'red' },
                    { id: 'oxygen', icon: <Wind className="w-8 h-8" />, label: 'Oxygen', color: 'blue' },
                    { id: 'medical', icon: <Heart className="w-8 h-8" />, label: 'Medical', color: 'purple' }
                  ].map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setEmergencyType(type.id)}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        emergencyType === type.id
                          ? `border-${type.color}-500 bg-${type.color}-50`
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-center mb-2">{type.icon}</div>
                      <p className="text-sm font-medium">{type.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Patient Information Form */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Patient Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name *</label>
                    <input
                      type="text"
                      value={formData.patientName}
                      onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                    <input
                      type="number"
                      value={formData.patientAge}
                      onChange={(e) => setFormData({ ...formData, patientAge: Number(e.target.value) })}
                      className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group *</label>
                    <select
                      value={formData.patientBloodGroup}
                      onChange={(e) => setFormData({ ...formData, patientBloodGroup: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500"
                    >
                      {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => (
                        <option key={bg} value={bg}>{bg}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Contact Phone *</label>
                    <input
                      type="tel"
                      value={formData.contactPhone}
                      onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Alternate Phone</label>
                    <input
                      type="tel"
                      value={formData.alternatePhone}
                      onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Landmark</label>
                    <input
                      type="text"
                      value={formData.landmark}
                      onChange={(e) => setFormData({ ...formData, landmark: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500"
                      placeholder="Nearby landmark for easy location"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description of Emergency *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500"
                    rows={4}
                    placeholder="Describe the emergency situation, symptoms, or special requirements..."
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional Information</label>
                  <textarea
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-red-500"
                    rows={2}
                    placeholder="Any additional information for emergency responders..."
                  />
                </div>

                {/* Location */}
                <div className="mt-4 p-4 bg-blue-50 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm font-medium">Your Location</p>
                      <p className="text-xs text-gray-600">{locationAddress}</p>
                    </div>
                  </div>
                  <button className="text-blue-600 text-sm hover:text-blue-700">Change</button>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handleSubmitEmergency}
                  disabled={isSubmitting}
                  className="w-full mt-6 bg-red-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing Emergency Request...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      SEND EMERGENCY REQUEST
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Nearby Hospitals */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-blue-500" />
                  Nearest Hospitals
                </h3>
                <div className="space-y-3">
                  {nearbyHospitals.map((hospital) => (
                    <div key={hospital.id} className="border rounded-xl p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-sm">{hospital.name}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                            <span>{hospital.distance}</span>
                            <span>•</span>
                            <span>{hospital.eta}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                          <span className="text-xs">{hospital.rating}</span>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {hospital.hasEmergency && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">🚨 ER</span>
                        )}
                        {hospital.hasICU && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">🏥 ICU</span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${hospital.isOpen ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                          {hospital.isOpen ? 'Open' : 'Closed'}
                        </span>
                      </div>
                      <button
                        onClick={() => handleCallContact(hospital.phone)}
                        className="w-full mt-2 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        <Phone className="w-3 h-3 inline mr-1" /> Call
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-green-500" />
                  Emergency Contacts
                </h3>
                <div className="space-y-3">
                  {emergencyContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          contact.type === 'family' ? 'bg-blue-100' :
                          contact.type === 'doctor' ? 'bg-green-100' :
                          contact.type === 'hospital' ? 'bg-red-100' : 'bg-orange-100'
                        }`}>
                          <Users className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{contact.name}</p>
                          <p className="text-xs text-gray-500">{contact.relationship}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {contact.isAvailable && (
                          <span className="w-2 h-2 bg-green-500 rounded-full" title="Available" />
                        )}
                        <button
                          onClick={() => handleCallContact(contact.phone)}
                          className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700"
                        >
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Helpline */}
              <div className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold mb-2">24/7 Helpline</h3>
                <p className="text-3xl font-bold mb-4">1-800-HEALTH</p>
                <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-blue-50">
                  Call Now
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* LIVE TRACKING TAB */}
        {/* ============================================ */}
        {activeTab === 'tracking' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {currentRequest ? (
                <>
                  {/* Request Status */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold">Request Status</h2>
                      <span className={`px-4 py-1 rounded-full text-sm font-medium ${getStatusColor(currentRequest.status)}`}>
                        {currentRequest.status.toUpperCase()}
                      </span>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-between mb-8">
                      {['received', 'processing', 'dispatched', 'arrived', 'completed'].map((step, index) => (
                        <div key={step} className="flex items-center flex-1">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            currentRequest.status === step || 
                            (step === 'completed' && currentRequest.status === 'completed')
                              ? 'bg-green-600 text-white'
                              : currentRequest.updates.some(u => u.status === step)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            {index + 1}
                          </div>
                          {index < 4 && (
                            <div className={`flex-1 h-1 mx-2 ${
                              currentRequest.updates.some(u => u.status === step) ? 'bg-blue-600' : 'bg-gray-200'
                            }`} />
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Request Details */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-xs text-gray-500">Request Type</p>
                        <p className="font-medium">{getTypeLabel(currentRequest.type)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Estimated Arrival</p>
                        <p className="font-medium text-green-600">{currentRequest.estimatedArrival}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Assigned Unit</p>
                        <p className="font-medium">{currentRequest.assignedUnit || 'Assigning...'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Requested At</p>
                        <p className="font-medium">{new Date(currentRequest.requestedAt).toLocaleTimeString()}</p>
                      </div>
                    </div>

                    {/* Live Map Placeholder */}
                    <div className="mt-4 bg-gray-100 rounded-xl h-64 flex items-center justify-center">
                      <div className="text-center">
                        <Navigation className="w-12 h-12 text-gray-400 mx-auto mb-2 animate-pulse" />
                        <p className="text-gray-600">Live Tracking Map</p>
                        <p className="text-sm text-gray-500">Unit {currentRequest.assignedUnit} is on the way</p>
                      </div>
                    </div>
                  </div>

                  {/* Updates Timeline */}
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <h2 className="text-lg font-semibold mb-4">Live Updates</h2>
                    <div className="space-y-4">
                      {currentRequest.updates.map((update) => (
                        <div key={update.id} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="text-sm">{update.message}</p>
                            <p className="text-xs text-gray-500">{new Date(update.timestamp).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Cancel Button */}
                  <button className="w-full py-3 border-2 border-red-300 text-red-600 rounded-xl hover:bg-red-50 font-medium">
                    Cancel Emergency Request
                  </button>
                </>
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                  <AlertTriangle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600">No Active Emergency</h3>
                  <p className="text-gray-500 mt-2">You don't have any active emergency requests</p>
                  <button
                    onClick={() => setActiveTab('request')}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                  >
                    Create New Request
                  </button>
                </div>
              )}
            </div>

            {/* Right Sidebar - Same as request tab */}
            <div className="space-y-6">
              {/* Emergency Contacts */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="font-semibold mb-4">Quick Call</h3>
                <div className="space-y-2">
                  {emergencyContacts.slice(0, 3).map((contact) => (
                    <button
                      key={contact.id}
                      onClick={() => handleCallContact(contact.phone)}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-green-50"
                    >
                      <span className="text-sm font-medium">{contact.name}</span>
                      <Phone className="w-4 h-4 text-green-600" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* HISTORY TAB */}
        {/* ============================================ */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Emergency History</h2>
              {emergencyHistory.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b last:border-0 py-4">
                  <div className="flex items-center space-x-4">
                    {getTypeIcon(item.type)}
                    <div>
                      <p className="font-medium">{getTypeLabel(item.type)}</p>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <p className="text-xs text-gray-500">{item.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {item.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">Response: {item.responseTime}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ============================================ */}
        {/* CONTACTS TAB */}
        {/* ============================================ */}
        {activeTab === 'contacts' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Emergency Contacts</h2>
              <div className="space-y-4">
                {emergencyContacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-4 border rounded-xl">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        contact.type === 'family' ? 'bg-blue-100' :
                        contact.type === 'doctor' ? 'bg-green-100' :
                        contact.type === 'hospital' ? 'bg-red-100' : 'bg-orange-100'
                      }`}>
                        <Users className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-semibold">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.relationship}</p>
                        <p className="text-sm text-gray-500">{contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      {contact.isAvailable && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Available</span>
                      )}
                      <button
                        onClick={() => handleCallContact(contact.phone)}
                        className="p-3 bg-green-600 text-white rounded-full hover:bg-green-700"
                      >
                        <Phone className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add Contact Button */}
            <button className="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-blue-300 hover:text-blue-600 flex items-center justify-center">
              <span className="text-2xl mr-2">+</span> Add Emergency Contact
            </button>
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* SUCCESS MODAL */}
      {/* ============================================ */}
      {showSuccess && currentRequest && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-600">Emergency Request Sent!</h2>
            <p className="text-gray-600 mt-2">Help is on the way</p>
            
            <div className="bg-gray-50 rounded-xl p-4 mt-4 text-left space-y-2">
              <p><strong>Request ID:</strong> {currentRequest.id}</p>
              <p><strong>Type:</strong> {getTypeLabel(currentRequest.type)}</p>
              <p><strong>Estimated Arrival:</strong> {currentRequest.estimatedArrival}</p>
              <p><strong>Assigned Unit:</strong> {currentRequest.assignedUnit}</p>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowSuccess(false)}
                className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => { setShowSuccess(false); setActiveTab('tracking'); }}
                className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Track Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientEmergencyRequest;