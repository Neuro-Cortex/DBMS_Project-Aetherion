// src/hooks/useEmergency.ts

import { useState, useCallback, useEffect } from 'react';
import { emergencyService, type EmergencyServiceType, type EmergencyRequest, type CreateEmergencyRequest, type BloodDonor, type OxygenSupplier, type EmergencyContact, type EmergencyAlert } from '../services/emergencyService';

// Re-export service types for consumers
export type { EmergencyServiceType as EmergencyService, EmergencyRequest, CreateEmergencyRequest, BloodDonor, OxygenSupplier, EmergencyContact, EmergencyAlert };

export interface EmergencyStats {
  averageResponseTime: number;
  totalRequests: number;
  completedRequests: number;
  criticalResponseTime: number;
}

interface UseEmergencyReturn {
  // State
  services: EmergencyServiceType[];
  requests: EmergencyRequest[];
  bloodDonors: BloodDonor[];
  oxygenSuppliers: OxygenSupplier[];
  emergencyContacts: EmergencyContact[];
  activeEmergencies: EmergencyAlert[];
  isLoading: boolean;
  error: string | null;
  stats: EmergencyStats | null;
  
  // Load Methods
  loadServices: (type?: EmergencyServiceType['type']) => Promise<void>;
  loadRequests: (status?: EmergencyRequest['status']) => Promise<void>;
  loadBloodDonors: (bloodGroup?: string) => Promise<void>;
  loadOxygenSuppliers: () => Promise<void>;
  loadEmergencyContacts: () => Promise<void>;
  loadActiveEmergencies: () => Promise<void>;
  loadStats: () => Promise<void>;
  
  // Actions
  createEmergencyRequest: (data: CreateEmergencyRequest) => Promise<EmergencyRequest | null>;
  updateRequestStatus: (id: string, status: EmergencyRequest['status']) => Promise<EmergencyRequest | null>;
  cancelRequest: (id: string, reason?: string) => Promise<EmergencyRequest | null>;
  searchBloodDonors: (bloodGroup: string, location: string, maxDistance?: number) => Promise<BloodDonor[]>;
  getNearbyOxygenSuppliers: (location: string, maxDistance?: number) => Promise<OxygenSupplier[]>;
  getServiceById: (id: string) => Promise<EmergencyServiceType | null>;
  getAvailableAmbulances: () => Promise<EmergencyServiceType[]>;
  
  // Utilities
  subscribeToAlerts: (callback: (alert: EmergencyAlert) => void) => () => void;
  clearError: () => void;
  resetState: () => void;
}

// ============================================
// HOOK IMPLEMENTATION
// ============================================

export const useEmergency = (): UseEmergencyReturn => {
  // State
  const [services, setServices] = useState<EmergencyServiceType[]>([]);
  const [requests, setRequests] = useState<EmergencyRequest[]>([]);
  const [bloodDonors, setBloodDonors] = useState<BloodDonor[]>([]);
  const [oxygenSuppliers, setOxygenSuppliers] = useState<OxygenSupplier[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [activeEmergencies, setActiveEmergencies] = useState<EmergencyAlert[]>([]);
  const [stats, setStats] = useState<EmergencyStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Auto-load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        loadServices(),
        loadRequests(),
        loadEmergencyContacts(),
        loadStats(),
      ]);
    };
    
    loadInitialData();
  }, []);
  
  // Load emergency services
  const loadServices = useCallback(async (type?: EmergencyServiceType['type']): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await emergencyService.getServices(type);
      setServices(data);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load emergency services';
      setError(errorMessage);
      console.error('Load services error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load emergency requests
  const loadRequests = useCallback(async (status?: EmergencyRequest['status']): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await emergencyService.getRequests(status);
      setRequests(data);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load emergency requests';
      setError(errorMessage);
      console.error('Load requests error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load blood donors
  const loadBloodDonors = useCallback(async (bloodGroup?: string): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await emergencyService.getBloodDonors(bloodGroup);
      setBloodDonors(data);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load blood donors';
      setError(errorMessage);
      console.error('Load blood donors error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load oxygen suppliers
  const loadOxygenSuppliers = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await emergencyService.getOxygenSuppliers();
      setOxygenSuppliers(data);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load oxygen suppliers';
      setError(errorMessage);
      console.error('Load oxygen suppliers error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load emergency contacts
  const loadEmergencyContacts = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await emergencyService.getEmergencyContacts();
      setEmergencyContacts(data);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load emergency contacts';
      setError(errorMessage);
      console.error('Load contacts error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load active emergencies
  const loadActiveEmergencies = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await emergencyService.getActiveEmergencies();
      setActiveEmergencies(data);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load active emergencies';
      setError(errorMessage);
      console.error('Load emergencies error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Load stats
  const loadStats = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const data = await emergencyService.getResponseStats();
      setStats(data);
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load statistics';
      setError(errorMessage);
      console.error('Load stats error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Create emergency request
  const createEmergencyRequest = useCallback(async (data: CreateEmergencyRequest): Promise<EmergencyRequest | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const request = await emergencyService.createRequest(data);
      setRequests(prev => [request, ...prev]);
      return request;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to create emergency request';
      setError(errorMessage);
      console.error('Create request error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Update request status
  const updateRequestStatus = useCallback(async (id: string, status: EmergencyRequest['status']): Promise<EmergencyRequest | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updated = await emergencyService.updateRequestStatus(id, status);
      setRequests(prev => prev.map(r => r.id === id ? updated : r));
      return updated;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to update request status';
      setError(errorMessage);
      console.error('Update status error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Cancel request
  const cancelRequest = useCallback(async (id: string, reason?: string): Promise<EmergencyRequest | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const cancelled = await emergencyService.cancelRequest(id, reason);
      setRequests(prev => prev.map(r => r.id === id ? cancelled : r));
      return cancelled;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to cancel request';
      setError(errorMessage);
      console.error('Cancel request error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Search blood donors
  const searchBloodDonors = useCallback(async (
    bloodGroup: string, 
    location: string, 
    maxDistance: number = 5
  ): Promise<BloodDonor[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const donors = await emergencyService.searchBloodDonors(bloodGroup, location, maxDistance);
      return donors;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to search blood donors';
      setError(errorMessage);
      console.error('Search donors error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Get nearby oxygen suppliers
  const getNearbyOxygenSuppliers = useCallback(async (
    location: string, 
    maxDistance: number = 5
  ): Promise<OxygenSupplier[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const suppliers = await emergencyService.getNearbyOxygenSuppliers(location, maxDistance);
      return suppliers;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to find oxygen suppliers';
      setError(errorMessage);
      console.error('Find suppliers error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Get service by ID
  const getServiceById = useCallback(async (id: string): Promise<EmergencyServiceType | null> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const service = await emergencyService.getServiceById(id);
      return service;
    } catch (err: any) {
      const errorMessage = err?.message || 'Service not found';
      setError(errorMessage);
      console.error('Get service error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Get available ambulances
  const getAvailableAmbulances = useCallback(async (): Promise<EmergencyServiceType[]> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const ambulances = await emergencyService.getAvailableAmbulances();
      return ambulances;
    } catch (err: any) {
      const errorMessage = err?.message || 'Failed to load ambulances';
      setError(errorMessage);
      console.error('Load ambulances error:', err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  // Subscribe to alerts
  const subscribeToAlerts = useCallback((callback: (alert: EmergencyAlert) => void): (() => void) => {
    return emergencyService.subscribeToAlerts(callback);
  }, []);
  
  // Clear error
  const clearError = useCallback((): void => {
    setError(null);
  }, []);
  
  // Reset state
  const resetState = useCallback((): void => {
    setServices([]);
    setRequests([]);
    setBloodDonors([]);
    setOxygenSuppliers([]);
    setEmergencyContacts([]);
    setActiveEmergencies([]);
    setStats(null);
    setError(null);
  }, []);
  
  return {
    // State
    services,
    requests,
    bloodDonors,
    oxygenSuppliers,
    emergencyContacts,
    activeEmergencies,
    isLoading,
    error,
    stats,
    
    // Load Methods
    loadServices,
    loadRequests,
    loadBloodDonors,
    loadOxygenSuppliers,
    loadEmergencyContacts,
    loadActiveEmergencies,
    loadStats,
    
    // Actions
    createEmergencyRequest,
    updateRequestStatus,
    cancelRequest,
    searchBloodDonors,
    getNearbyOxygenSuppliers,
    getServiceById,
    getAvailableAmbulances,
    
    // Utilities
    subscribeToAlerts,
    clearError,
    resetState,
  };
};

export default useEmergency;

export type { UseEmergencyReturn };