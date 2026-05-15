// src/components/admin/EmergencyMonitor.tsx

import React, { useState, useEffect } from 'react';
import {
  Radio, AlertCircle, MapPin, Clock, Users,
  Phone, CheckCircle, XCircle, Truck, Droplet,
  Wind, Activity, RefreshCw
} from 'lucide-react';
import { EmergencyAlert } from '../../types/admin';

export const EmergencyMonitor: React.FC = () => {
  const [emergencies, setEmergencies] = useState<EmergencyAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchEmergencies();
    
    if (autoRefresh) {
      const interval = setInterval(fetchEmergencies, 30000); // Refresh every 30s
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchEmergencies = async () => {
    setTimeout(() => {
      const mockEmergencies: EmergencyAlert[] = [
        {
          id: '1',
          type: 'blood',
          title: 'Emergency Blood Required',
          description: 'O-negative blood needed for emergency surgery',
          location: 'City General Hospital',
          coordinates: { latitude: 40.7128, longitude: -74.006 },
          severity: 'critical',
          status: 'active',
          reportedBy: 'Dr. Wilson',
          reportedDate: '2024-02-16T10:00:00',
          responders: [
            {
              id: 'r1',
              name: 'Blood Bank Unit 1',
              type: 'hospital',
              status: 'dispatched',
              estimatedArrival: '15 min',
              contactPhone: '+1 (555) 111-2222'
            }
          ],
          updates: [
            {
              id: 'u1',
              message: 'Emergency declared - Critical patient needs O- blood',
              timestamp: '2024-02-16T10:00:00',
              updatedBy: 'System'
            }
          ]
        },
        {
          id: '2',
          type: 'oxygen',
          title: 'Oxygen Supply Critical',
          description: 'ICU oxygen supply running low - Need immediate refill',
          location: 'Metro Hospital',
          coordinates: { latitude: 40.7580, longitude: -73.9855 },
          severity: 'high',
          status: 'responding',
          reportedBy: 'Dr. Brown',
          reportedDate: '2024-02-16T09:30:00',
          responders: [],
          updates: []
        }
      ];
      setEmergencies(mockEmergencies);
      setIsLoading(false);
    }, 1000);
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'blood': return <Droplet className="w-6 h-6 text-red-500" />;
      case 'oxygen': return <Wind className="w-6 h-6 text-blue-500" />;
      case 'ambulance': return <Truck className="w-6 h-6 text-orange-500" />;
      case 'medical': return <Activity className="w-6 h-6 text-purple-500" />;
      default: return <AlertCircle className="w-6 h-6 text-yellow-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      default: return 'border-blue-500 bg-blue-50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Radio className="w-6 h-6 mr-2 text-red-500" />
            Emergency Monitor
          </h1>
          <p className="text-gray-600 mt-1">Real-time emergency response system</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4"
            />
            <span>Auto-refresh (30s)</span>
          </label>
          <button
            onClick={fetchEmergencies}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Now
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {emergencies.map((emergency) => (
          <div
            key={emergency.id}
            className={`bg-white rounded-lg shadow-lg border-l-4 ${getSeverityColor(emergency.severity)} p-6`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-4">
                {getTypeIcon(emergency.type)}
                <div>
                  <h3 className="font-semibold text-lg">{emergency.title}</h3>
                  <p className="text-gray-600 mt-1">{emergency.description}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {emergency.location}
                    </span>
                    <span className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {new Date(emergency.reportedDate).toLocaleString()}
                    </span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {emergency.responders.length} responder(s)
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  emergency.status === 'active' ? 'bg-red-100 text-red-700' :
                  emergency.status === 'responding' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-green-100 text-green-700'
                }`}>
                  {emergency.status.toUpperCase()}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  emergency.severity === 'critical' ? 'bg-red-100 text-red-700' :
                  emergency.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                  'bg-yellow-100 text-yellow-700'
                }`}>
                  {emergency.severity.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Responders */}
            {emergency.responders.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Responders</h4>
                <div className="space-y-2">
                  {emergency.responders.map((responder) => (
                    <div key={responder.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Truck className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{responder.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{responder.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          responder.status === 'dispatched' ? 'bg-yellow-100 text-yellow-700' :
                          responder.status === 'arrived' ? 'bg-green-100 text-green-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {responder.status}
                        </span>
                        <span className="text-xs text-gray-500">ETA: {responder.estimatedArrival}</span>
                        <button className="text-blue-600 hover:text-blue-700">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Updates Timeline */}
            {emergency.updates.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">Updates</h4>
                <div className="space-y-2">
                  {emergency.updates.map((update) => (
                    <div key={update.id} className="flex items-start space-x-2 text-sm">
                      <Activity className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div>
                        <p>{update.message}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(update.timestamp).toLocaleString()} by {update.updatedBy}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="mt-4 flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                Update Status
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Dispatch Responder
              </button>
              {emergency.status !== 'resolved' && (
                <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
                  Mark Resolved
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );










<div className="bg-gradient-to-r from-red-500 to-red-600">
  <h3>Emergency Alerts</h3>
  {activeEmergencies.map(emergency => (
    <EmergencyCard key={emergency.id} />
  ))}
</div>










};