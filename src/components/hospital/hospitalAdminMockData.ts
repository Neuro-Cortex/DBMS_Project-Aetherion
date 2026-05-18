import type { BedData } from '@/components/hospital/BedAvailability';
import type { ICUTrackerProps } from '@/components/hospital/ICUTracker';

export const HOSPITAL_ID = '1';
export const HOSPITAL_NAME = 'City General Hospital';

export const mockAdminBeds: BedData[] = [
  { type: 'general', total: 200, occupied: 140, available: 60, price: 150, features: ['WiFi', 'TV'] },
  { type: 'icu', total: 50, occupied: 35, available: 15, price: 500, features: ['Monitor', 'Ventilator'] },
  { type: 'pediatric', total: 40, occupied: 28, available: 12, price: 200, features: ['Child-friendly'] },
  { type: 'maternity', total: 30, occupied: 22, available: 8, price: 250, features: ['Private bath'] },
  { type: 'emergency', total: 25, occupied: 18, available: 7, price: 300, features: ['24/7'] },
];

export const mockIcuTrackerData: Pick<ICUTrackerProps, 'icuBeds' | 'resources' | 'staff'> = {
  icuBeds: {
    total: 50,
    available: 15,
    occupied: 35,
    covid: 5,
    nonCovid: 30,
    emergency: 8,
    cardiac: 12,
    pediatric: 6,
    neonatal: 4,
  },
  resources: [
    { id: '1', type: 'ventilator', total: 20, available: 8, status: 'operational', lastServiced: '2024-02-10' },
    { id: '2', type: 'monitor', total: 50, available: 15, status: 'operational', lastServiced: '2024-02-12' },
    { id: '3', type: 'defibrillator', total: 10, available: 7, status: 'operational', lastServiced: '2024-02-08' },
  ],
  staff: [
    { role: 'ICU Nurses', count: 40, available: 32, onCall: 8, specialty: 'Critical Care' },
    { role: 'Intensivists', count: 12, available: 10, onCall: 2, specialty: 'Pulmonology' },
    { role: 'Respiratory Therapists', count: 8, available: 6, onCall: 2, specialty: 'Respiratory' },
  ],
};
