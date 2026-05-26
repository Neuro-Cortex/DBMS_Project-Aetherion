// src/services/searchService.ts

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
  // Doctor-specific fields used by Doctor.tsx
  fee?: string;
  // Hospital-specific fields used by Hospital.tsx
  reviews?: number;
  beds?: number;
  emergency?: string;
  // Medicine-specific fields used by Pharmacy.tsx
  manufacturer?: string;
  prescription?: boolean;
  pharmacies?: Array<{ name: string; price: string; distance: string; inStock: boolean }>;
  substitutes?: string[];
}

class SearchService {
  // Doctors search with location and ranking
  async searchDoctors(query: string, userLocation?: { lat: number; lng: number }): Promise<SearchResult[]> {
    const mockDoctors = [
      {
        id: 'doc1',
        title: 'Dr. Sarah Johnson',
        specialization: 'Cardiologist',
        experience: '15 years',
        rating: 4.9,
        reviews: 128,
        location: 'New York, NY',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        distance: '1.2 km',
        availability: 'Today, 2:00 PM',
        fee: '$200',
        description: '⭐ 4.9 (128 reviews) • 15 years exp • Cardiology specialist',
        type: 'doctor' as const,
        link: '/doctor/sarah-johnson',
        details: {
          education: 'Harvard Medical School',
          languages: ['English', 'Spanish'],
          hospital: 'City General Hospital'
        }
      },
      {
        id: 'doc2',
        title: 'Dr. Michael Chen',
        specialization: 'Neurologist',
        experience: '12 years',
        rating: 4.8,
        reviews: 95,
        location: 'Brooklyn, NY',
        coordinates: { lat: 40.6782, lng: -73.9442 },
        distance: '3.5 km',
        availability: 'Tomorrow, 10:00 AM',
        fee: '$250',
        description: '⭐ 4.8 (95 reviews) • 12 years exp • Neurology specialist',
        type: 'doctor' as const,
        link: '/doctor/michael-chen',
        details: {
          education: 'Johns Hopkins University',
          languages: ['English', 'Mandarin'],
          hospital: 'Memorial Medical Center'
        }
      },
      {
        id: 'doc3',
        title: 'Dr. Emily Rodriguez',
        specialization: 'Pediatrician',
        experience: '10 years',
        rating: 4.9,
        reviews: 156,
        location: 'Queens, NY',
        coordinates: { lat: 40.7282, lng: -73.7949 },
        distance: '2.8 km',
        availability: 'Wed, 9:00 AM',
        fee: '$180',
        description: '⭐ 4.9 (156 reviews) • 10 years exp • Child specialist',
        type: 'doctor' as const,
        link: '/doctor/emily-rodriguez',
        details: {
          education: 'Stanford University',
          languages: ['English', 'Spanish'],
          hospital: 'Children\'s Hospital'
        }
      }
    ];

    let results = mockDoctors.filter(doc => 
      doc.title.toLowerCase().includes(query.toLowerCase()) ||
      doc.specialization.toLowerCase().includes(query.toLowerCase())
    );

    // Add distance if location provided
    if (userLocation) {
      results = results.map(doc => ({
        ...doc,
        distance: this.calculateDistance(userLocation, doc.coordinates)
      })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }

    // Sort by rating
    results.sort((a, b) => b.rating - a.rating);
    
    return results;
  }

  // Hospitals search
  async searchHospitals(query: string, userLocation?: { lat: number; lng: number }): Promise<SearchResult[]> {
    const mockHospitals = [
      {
        id: 'hos1',
        title: 'City General Hospital',
        category: 'Multi-specialty',
        rating: 4.7,
        reviews: 1200,
        beds: 500,
        location: 'Downtown, NY',
        coordinates: { lat: 40.7128, lng: -74.0060 },
        distance: '1.5 km',
        emergency: '24/7',
        description: '🏥 4.7 (1.2k reviews) • 500+ beds • 24/7 Emergency',
        type: 'hospital' as const,
        link: '/hospital/city-general',
        details: {
          departments: ['Cardiology', 'Neurology', 'Pediatrics', 'Emergency'],
          visitingHours: '9:00 AM - 8:00 PM',
          parking: 'Available'
        }
      },
      {
        id: 'hos2',
        title: 'Memorial Medical Center',
        category: 'Teaching Hospital',
        rating: 4.6,
        reviews: 890,
        beds: 350,
        location: 'Uptown, NY',
        coordinates: { lat: 40.7831, lng: -73.9712 },
        distance: '4.2 km',
        emergency: '24/7',
        description: '🏥 4.6 (890 reviews) • 350+ beds • Advanced care',
        type: 'hospital' as const,
        link: '/hospital/memorial',
        details: {
          departments: ['Oncology', 'Orthopedics', 'Radiology'],
          visitingHours: '8:00 AM - 9:00 PM',
          parking: 'Valet available'
        }
      }
    ];

    let results = mockHospitals.filter(hospital => 
      hospital.title.toLowerCase().includes(query.toLowerCase())
    );

    if (userLocation) {
      results = results.map(h => ({
        ...h,
        distance: this.calculateDistance(userLocation, h.coordinates)
      })).sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    }

    return results;
  }

  // Medicines search with pharmacy info
  async searchMedicines(query: string): Promise<SearchResult[]> {
    const mockMedicines = [
      {
        id: 'med1',
        title: 'Aspirin 500mg',
        genericName: 'Acetylsalicylic Acid',
        manufacturer: 'Bayer',
        price: '$15.99',
        pharmacies: [
          { name: 'City Pharmacy', price: '$15.99', distance: '0.5 km', inStock: true },
          { name: 'Health Mart', price: '$16.50', distance: '1.2 km', inStock: true },
          { name: 'MediCare Pharmacy', price: '$14.99', distance: '2.0 km', inStock: false }
        ],
        substitutes: ['Disprin', 'Ecosprin'],
        prescription: false,
        description: 'Pain relief • Fever reducer • Blood thinner',
        type: 'medicine' as const,
        link: '/pharmacy/aspirin',
        details: {
          dosage: '500mg',
          form: 'Tablet',
          quantity: '100 tablets',
          sideEffects: ['Nausea', 'Heartburn', 'Stomach upset']
        }
      },
      {
        id: 'med2',
        title: 'Paracetamol 650mg',
        genericName: 'Acetaminophen',
        manufacturer: 'GSK',
        price: '$9.99',
        pharmacies: [
          { name: 'CVS Pharmacy', price: '$9.99', distance: '0.8 km', inStock: true },
          { name: 'Walgreens', price: '$10.49', distance: '1.5 km', inStock: true },
          { name: 'Rite Aid', price: '$9.49', distance: '2.3 km', inStock: true }
        ],
        substitutes: ['Tylenol', 'Crocin'],
        prescription: false,
        description: 'Fever reducer • Pain reliever',
        type: 'medicine' as const,
        link: '/pharmacy/paracetamol',
        details: {
          dosage: '650mg',
          form: 'Tablet',
          quantity: '50 tablets',
          sideEffects: ['Liver damage (overdose)']
        }
      },
      {
        id: 'med3',
        title: 'Amoxicillin 500mg',
        genericName: 'Amoxicillin',
        manufacturer: 'Pfizer',
        price: '$25.99',
        pharmacies: [
          { name: 'City Pharmacy', price: '$25.99', distance: '0.5 km', inStock: true },
          { name: 'Health Mart', price: '$26.50', distance: '1.2 km', inStock: true }
        ],
        substitutes: ['Augmentin', 'Mox'],
        prescription: true,
        description: 'Antibiotic • Treats bacterial infections',
        type: 'medicine' as const,
        link: '/pharmacy/amoxicillin',
        details: {
          dosage: '500mg',
          form: 'Capsule',
          quantity: '20 capsules',
          sideEffects: ['Diarrhea', 'Nausea', 'Rash']
        }
      }
    ];

    return mockMedicines.filter(medicine => 
      medicine.title.toLowerCase().includes(query.toLowerCase()) ||
      medicine.genericName.toLowerCase().includes(query.toLowerCase()) ||
      medicine.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Global search
  async globalSearch(query: string, userLocation?: { lat: number; lng: number }): Promise<SearchResult[]> {
    if (!query.trim()) return [];
    
    const [doctors, hospitals, medicines] = await Promise.all([
      this.searchDoctors(query, userLocation),
      this.searchHospitals(query, userLocation),
      this.searchMedicines(query)
    ]);
    
    return [...doctors, ...hospitals, ...medicines]
      .sort((a, b) => (b.rating || 0) - (a.rating || 0))
      .slice(0, 15);
  }

  private calculateDistance(point1: { lat: number; lng: number }, point2: { lat: number; lng: number }): string {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRad(point2.lat - point1.lat);
    const dLon = this.toRad(point2.lng - point1.lng);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this.toRad(point1.lat)) * Math.cos(this.toRad(point2.lat)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return distance.toFixed(1) + ' km';
  }

  private toRad(degrees: number): number {
    return degrees * (Math.PI/180);
  }
}

export const searchService = new SearchService();