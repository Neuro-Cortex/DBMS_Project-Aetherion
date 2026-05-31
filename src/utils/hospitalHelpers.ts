// src/utils/hospitalHelpers.ts
import type { HospitalListItem, BedSummary, BedInfo } from '@/types/hospital';

// ============================================
// Get bed summary regardless of format
// ============================================
export function getBedSummary(hospital: HospitalListItem): BedSummary {
  const beds = hospital.beds;
  
  if (!beds) {
    return { total: 0, available: 0, icu: { total: 0, available: 0 }, emergency: 0 };
  }

  if (Array.isArray(beds)) {
    const total = beds.reduce((sum, b) => sum + b.total, 0);
    const available = beds.reduce((sum, b) => sum + b.available, 0);
    const icuBeds = beds.filter(b => b.type?.includes('icu'));
    const icuTotal = icuBeds.reduce((sum, b) => sum + b.total, 0);
    const icuAvailable = icuBeds.reduce((sum, b) => sum + b.available, 0);
    const emergencyBed = beds.find(b => b.type === 'general');
    return {
      total,
      available,
      icu: { total: icuTotal, available: icuAvailable },
      emergency: emergencyBed?.available ?? 0,
    };
  }
  
  return beds;
}

// ============================================
// Boolean helpers
// ============================================
export function hasEmergency(hospital: HospitalListItem): boolean {
  return !!(hospital.emergencyAvailable ?? hospital.emergency ?? false);
}

export function hasAmbulance(hospital: HospitalListItem): boolean {
  return !!(hospital.ambulanceAvailable ?? hospital.ambulance ?? false);
}

export function hasBloodBank(hospital: HospitalListItem): boolean {
  return !!(hospital.bloodBankAvailable ?? hospital.bloodBank ?? false);
}

export function hasOxygen(hospital: HospitalListItem): boolean {
  return !!(hospital.oxygenAvailable ?? hospital.oxygen ?? false);
}

export function isVerified(hospital: HospitalListItem): boolean {
  return !!(hospital.isVerified ?? hospital.verified ?? false);
}

export function isPremium(hospital: HospitalListItem): boolean {
  return !!(hospital.isPremium ?? hospital.premium ?? false);
}

// ============================================
// Location helpers
// ============================================
export function getCity(hospital: HospitalListItem): string {
  return hospital.location?.city ?? hospital.address?.city ?? 'Unknown';
}

export function getState(hospital: HospitalListItem): string {
  return hospital.location?.state ?? hospital.address?.state ?? '';
}

export function getPhone(hospital: HospitalListItem): string {
  return hospital.contact?.phone ?? '';
}

export function getEmergencyPhone(hospital: HospitalListItem): string {
  return hospital.contact?.emergencyPhone ?? '';
}

export function getEmail(hospital: HospitalListItem): string {
  return hospital.contact?.email ?? '';
}

export function getEstablished(hospital: HospitalListItem): number {
  return hospital.establishedYear ?? hospital.established ?? 0;
}