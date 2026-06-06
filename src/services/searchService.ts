// src/services/searchService.ts

import api from './api';

export interface SearchResultDetails {
  specialization?: string;
  experience?: string;
  reviews?: number;
  education?: string;
  languages?: string[];
  hospital?: string;
  visitingHours?: string;
  departments?: string[];
  parking?: string;
  genericName?: string;
  dosage?: string;
  form?: string;
  quantity?: string;
  sideEffects?: string[];
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'doctor' | 'hospital' | 'medicine' | 'pharmacy';
  link: string;
  image?: string;
  rating?: number;
  location?: string;
  distance?: string;
  price?: string;
  availability?: string;
  details?: SearchResultDetails;
  fee?: string;
  reviews?: number;
  beds?: number;
  emergency?: string;
  manufacturer?: string;
  prescription?: boolean;
  pharmacies?: Array<{ name: string; price: string; distance: string; inStock: boolean }>;
  substitutes?: string[];
}

class SearchService {
  async searchDoctors(query: string, userLocation?: { lat: number; lng: number }): Promise<SearchResult[]> {
    const response = await api.get<any>('/doctors', { search: query, limit: 10 });
    if (response.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return items.map((doc: any) => ({
        id: String(doc.id),
        title: doc.full_name || doc.name || `Dr. ${doc.specialization}`,
        specialization: doc.specialization,
        description: `⭐ ${doc.rating || 0} (${doc.review_count || 0} reviews) • ${doc.experience_years || 0} years exp • ${doc.specialization || ''}`,
        type: 'doctor' as const,
        link: `/doctor/${doc.id}`,
        rating: doc.rating || 0,
        location: doc.hospital_affiliation || '',
        distance: '',
        availability: doc.status === 'online' ? 'Available Now' : 'Offline',
        fee: doc.consultation_fee ? `$${doc.consultation_fee}` : '',
        details: {
          specialization: doc.specialization,
          experience: `${doc.experience_years || 0} years`,
          reviews: doc.review_count,
          education: doc.qualifications ? JSON.parse(doc.qualifications)[0]?.institution : '',
          languages: doc.languages ? JSON.parse(doc.languages) : [],
          hospital: doc.hospital_affiliation || '',
        },
      }));
    }
    return [];
  }

  async searchHospitals(query: string, userLocation?: { lat: number; lng: number }): Promise<SearchResult[]> {
    const response = await api.get<any>('/hospitals', { search: query, limit: 10 });
    if (response.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data?.data || response.data?.hospitals || [];
      return items.map((h: any) => ({
        id: h.id,
        title: h.name,
        description: `🏥 ${h.rating || 0} (${h.review_count || 0} reviews) • ${h.total_beds || 0} beds • ${h.type || ''}`,
        type: 'hospital' as const,
        link: `/hospital/${h.id}`,
        rating: h.rating || 0,
        location: `${h.city || ''}, ${h.state || ''}`,
        distance: '',
        reviews: h.review_count,
        beds: h.total_beds,
        emergency: h.emergency_service || '',
        details: {
          departments: h.services ? JSON.parse(h.services) : [],
          visitingHours: '',
          parking: '',
        },
      }));
    }
    return [];
  }

  async searchMedicines(query: string): Promise<SearchResult[]> {
    const response = await api.get<any>('/pharmacy/medicines', { search: query, limit: 10 });
    if (response.success && response.data) {
      const items = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return items.map((m: any) => ({
        id: String(m.id),
        title: m.medicine_name || m.name || '',
        description: `${m.category || ''} • ${m.dosage || ''} • ${m.form || ''}`,
        type: 'medicine' as const,
        link: `/pharmacy/medicine/${m.id}`,
        rating: m.rating || 0,
        price: m.price ? `$${m.price}` : '',
        details: {
          genericName: m.generic_name || '',
          dosage: m.dosage || '',
          form: m.form || '',
          quantity: m.pack_size || '',
          sideEffects: m.side_effects ? JSON.parse(m.side_effects) : [],
        },
        manufacturer: m.manufacturer || '',
        prescription: m.requires_prescription || false,
      }));
    }
    return [];
  }

  async globalSearch(query: string, userLocation?: { lat: number; lng: number }): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    const [doctors, hospitals, medicines] = await Promise.all([
      this.searchDoctors(query, userLocation),
      this.searchHospitals(query, userLocation),
      this.searchMedicines(query),
    ]);

    return [...doctors, ...hospitals, ...medicines]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 15);
  }
}

export const searchService = new SearchService();
