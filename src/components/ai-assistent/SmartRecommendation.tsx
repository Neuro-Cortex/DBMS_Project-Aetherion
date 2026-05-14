// src/pages/EmergencyMode.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Siren, Phone, MapPin, Navigation, TruckIcon, Heart, Users,
  Clock, Shield, Zap, AlertTriangle, CheckCircle2, X, ChevronRight
} from 'lucide-react';

interface EmergencyContact {
  id: string;
  name: string;
  relation: string;
  phone: string;
  type: 'family' | 'doctor' | 'ambulance' | 'hospital';
}

interface NearbyFacility {
  id: string;
  name: string;
  type: string;
  distance: string;
  eta: string;
  beds: number;
  phone: string;
}

const emergencyContacts: EmergencyContact[] = [
  { id: '1', name: 'John Doe', relation: 'Husband', phone: '+1 (555) 111-2222', type: 'family' },
  { id: '2', name: 'Dr. Sarah Johnson', relation: 'Cardiologist', phone: '+1 (555) 333-4444', type: 'doctor' },
  { id: '3', name: 'City Ambulance', relation: 'Emergency', phone: '911', type: 'ambulance' },
];

const nearbyFacilities: NearbyFacility[] = [
  { id: '1', name: 'City General Hospital', type: 'Emergency Center', distance: '2.5 km', eta: '8 min', beds: 45, phone: '+1 (555) 010-1001' },
  { id: '2', name: 'Metro Medical Center', type: 'Trauma Center', distance: '4.0 km', eta: '15 min', beds: 30, phone: '+1 (555) 020-2002' },
];

export const EmergencyMode: React.FC = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isCalling, setIsCalling] = useState(false);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const [location] = useState({ lat: 40.7128, lng: -74.006, address: '123 Main St, New York, NY' });

  // Emergency mode activation
  const activateEmergency = useCallback(() => {
    setIsActive(true);
    let count = 5;
    const timer = setInterval(() => {
      count--;
      setCountdown(count);
      if (count === 0) {
        clearInterval(timer);
        setIsCalling(true);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Cancel emergency
  const cancelEmergency = () => {
    setIsActive(false);
    setIsCalling(false);
    setCountdown(5);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isActive ? 'bg-red-950' : 'bg-[#050508]'}`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="p-2 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/50 hover:text-white/70 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
        {!isActive && (
          <span className="text-white/30 text-sm">Emergency Mode</span>
        )}
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        {!isActive ? (
          /* Inactive State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center">
              <Siren className="w-12 h-12 text-red-400" />
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-3">Emergency Mode</h1>
            <p className="text-white/35 mb-10">
              One-tap access to emergency services. Your location will be shared automatically.
            </p>

            {/* SOS Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={activateEmergency}
              className="w-full py-6 bg-red-500 hover:bg-red-600 text-white font-bold text-xl rounded-3xl shadow-2xl shadow-red-500/25 transition-all mb-8"
            >
              <Siren className="inline w-6 h-6 mr-2" />
              ACTIVATE EMERGENCY MODE
            </motion.button>

            {/* Quick Contacts */}
            <div className="space-y-3 text-left">
              <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider mb-3">Emergency Contacts</h3>
              {emergencyContacts.map((contact) => (
                <button
                  key={contact.id}
                  type="button"
                  onClick={() => window.open(`tel:${contact.phone}`)}
                  className="w-full flex items-center gap-4 p-4 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.04] transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                    <Phone className="w-5 h-5 text-white/50 group-hover:text-white/70" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-white font-medium">{contact.name}</p>
                    <p className="text-white/30 text-xs">{contact.relation} • {contact.phone}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-white/20" />
                </button>
              ))}
            </div>
          </motion.div>
        ) : (
          /* Active Emergency State */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            {!isCalling ? (
              /* Countdown */
              <div>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="w-32 h-32 mx-auto mb-8 rounded-full bg-red-500/20 border-4 border-red-500 flex items-center justify-center"
                >
                  <span className="text-5xl font-black text-white">{countdown}</span>
                </motion.div>
                
                <h2 className="text-2xl font-bold text-white mb-3">Emergency Activated</h2>
                <p className="text-white/50 mb-8">
                  Connecting to emergency services in {countdown} seconds...
                </p>

                <button
                  type="button"
                  onClick={cancelEmergency}
                  className="px-8 py-3 bg-white/10 text-white/70 rounded-xl hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
              </div>
            ) : (
              /* Connected State */
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-10 h-10 text-emerald-400" />
                </motion.div>

                <h2 className="text-2xl font-bold text-white mb-2">Help is on the way!</h2>
                <p className="text-white/50 mb-2">Emergency services have been notified</p>
                <p className="text-white/30 text-sm mb-8">
                  Estimated arrival: <span className="text-white/60 font-bold">8 minutes</span>
                </p>

                {/* Location Info */}
                <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-4 mb-6 text-left">
                  <div className="flex items-center gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-red-400" />
                    <span className="text-white/70 text-sm">Your Location</span>
                  </div>
                  <p className="text-white text-sm ml-8">{location.address}</p>
                </div>

                {/* Nearby Facilities */}
                <div className="space-y-3">
                  <h3 className="text-white/50 text-xs font-medium uppercase tracking-wider text-left">Nearby Facilities</h3>
                  {nearbyFacilities.map((facility) => (
                    <div
                      key={facility.id}
                      className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-4 text-left"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium">{facility.name}</span>
                        <span className="text-emerald-400 text-xs">{facility.eta}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-white/35">
                        <span>{facility.distance}</span>
                        <span>•</span>
                        <span>{facility.beds} beds available</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EmergencyMode;