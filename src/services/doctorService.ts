// src/services/doctorService.ts

import api, { simulateDelay } from './api';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  experience: number;
  image?: string;
  availability: 'Available Today' | 'Available Tomorrow' | 'Available This Week' | 'Fully Booked';
  fee: number;
  languages: string[];
  location: string;
  hospital: string;
  clinic: string;
  verified: boolean;
  specialties: string[];
  education: string[];
  certifications: string[];
  reviewsCount: number;
  nextSlot: string;
  consultationType: ('in-person' | 'video' | 'phone')[];
  waitingTime: string;
  insuranceAccepted: string[];
  bio: string;
  achievements: string[];
}

export interface DoctorFilters {
  specialty?: string;
  minRating?: number;
  maxFee?: number;
  searchQuery?: string;
  location?: string;
  hospital?: string;
  language?: string;
  consultationType?: 'in-person' | 'video' | 'phone';
  availability?: 'Today' | 'Tomorrow' | 'This Week';
  sortBy?: 'rating' | 'fee' | 'experience' | 'reviews';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface DoctorReview {
  id: string;
  patientId: string;
  patientName: string;
  patientAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
  response?: {
    text: string;
    date: string;
  };
}

export interface TimeSlot {
  time: string;
  available: boolean;
  appointmentId?: string;
}

export interface DoctorSchedule {
  doctorId: string;
  days: {
    monday: TimeSlot[];
    tuesday: TimeSlot[];
    wednesday: TimeSlot[];
    thursday: TimeSlot[];
    friday: TimeSlot[];
    saturday: TimeSlot[];
    sunday: TimeSlot[];
  };
  breakTime?: {
    start: string;
    end: string;
  };
}

export interface AppointmentRequest {
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  symptoms?: string;
  reason: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  patientId: string;
  patientName: string;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  symptoms?: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export interface DoctorStats {
  totalPatients: number;
  totalAppointments: number;
  averageRating: number;
  responseTime: string;
  completionRate: number;
}

// ============================================
// ENHANCED MOCK DATA WITH CORRECT IDs
// ============================================

const mockDoctors: Doctor[] = [
  {
    id: 'doc_cardiology_001',
    name: 'Dr. Sarah Wilson',
    specialty: 'Cardiologist',
    rating: 4.9,
    experience: 15,
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    availability: 'Available Today',
    fee: 120,
    languages: ['English', 'Spanish'],
    location: 'New York, NY',
    hospital: 'Mount Sinai Hospital',
    clinic: 'Heart Care Center',
    verified: true,
    specialties: ['Cardiology', 'Interventional Cardiology', 'Heart Failure'],
    education: ['MD - Harvard Medical School', 'Fellowship in Cardiology - Mayo Clinic'],
    certifications: ['American Board of Internal Medicine', 'Board Certified in Cardiology'],
    reviewsCount: 524,
    nextSlot: '10:00 AM',
    consultationType: ['in-person', 'video'],
    waitingTime: '15-20 min',
    insuranceAccepted: ['Blue Cross', 'Aetna', 'Cigna', 'Medicare'],
    bio: 'Dr. Sarah Wilson is a board-certified cardiologist with over 15 years of experience.',
    achievements: ['Top Cardiologist Award 2023', 'Patient Choice Award 2022']
  },
  {
    id: 'doc_neurology_002',
    name: 'Dr. James Lee',
    specialty: 'Neurologist',
    rating: 4.8,
    experience: 12,
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    availability: 'Available Tomorrow',
    fee: 100,
    languages: ['English'],
    location: 'Los Angeles, CA',
    hospital: 'UCLA Medical Center',
    clinic: 'Neurology Institute',
    verified: true,
    specialties: ['Neurology', 'Stroke Medicine', 'Movement Disorders'],
    education: ['MD - Stanford University', 'Residency in Neurology - UCSF'],
    certifications: ['American Board of Psychiatry and Neurology'],
    reviewsCount: 387,
    nextSlot: '11:30 AM',
    consultationType: ['in-person', 'video', 'phone'],
    waitingTime: '10-15 min',
    insuranceAccepted: ['Blue Cross', 'Aetna', 'UnitedHealthcare'],
    bio: 'Dr. James Lee is an experienced neurologist specializing in stroke prevention.',
    achievements: ['Stroke Research Excellence Award', 'Neurology Teaching Award 2021']
  },
  {
    id: 'doc_pediatrics_003',
    name: 'Dr. Emily Chen',
    specialty: 'Pediatrician',
    rating: 4.7,
    experience: 10,
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
    availability: 'Available Today',
    fee: 90,
    languages: ['English', 'Mandarin'],
    location: 'San Francisco, CA',
    hospital: 'UCSF Benioff Children Hospital',
    clinic: "Children's Wellness Center",
    verified: true,
    specialties: ['Pediatrics', 'Adolescent Medicine', 'Developmental Pediatrics'],
    education: ['MD - Johns Hopkins University', 'Pediatrics Residency - Children\'s Hospital of Philadelphia'],
    certifications: ['American Board of Pediatrics'],
    reviewsCount: 612,
    nextSlot: '02:00 PM',
    consultationType: ['in-person', 'video'],
    waitingTime: '5-10 min',
    insuranceAccepted: ['Blue Cross', 'Aetna', 'Cigna', 'Kaiser'],
    bio: 'Dr. Emily Chen provides comprehensive care for children from birth through adolescence.',
    achievements: ['Best Pediatrician Award 2023', 'Patient Satisfaction Excellence']
  },
  {
    id: 'doc_orthopedic_004',
    name: 'Dr. Michael Brown',
    specialty: 'Orthopedic',
    rating: 4.6,
    experience: 18,
    image: 'https://randomuser.me/api/portraits/men/4.jpg',
    availability: 'Available This Week',
    fee: 150,
    languages: ['English'],
    location: 'Chicago, IL',
    hospital: 'Northwestern Memorial Hospital',
    clinic: 'Orthopedic & Sports Medicine',
    verified: true,
    specialties: ['Orthopedics', 'Sports Medicine', 'Joint Replacement'],
    education: ['MD - Mayo Clinic', 'Fellowship in Sports Medicine - Hospital for Special Surgery'],
    certifications: ['American Board of Orthopedic Surgery'],
    reviewsCount: 856,
    nextSlot: '09:00 AM',
    consultationType: ['in-person', 'video'],
    waitingTime: '20-25 min',
    insuranceAccepted: ['Blue Cross', 'Aetna', 'Cigna', 'UnitedHealthcare'],
    bio: 'Dr. Michael Brown specializes in sports injuries and joint replacement.',
    achievements: ['Top Orthopedic Surgeon 2022', 'Sports Medicine Excellence Award']
  },
  {
    id: 'doc_dermatology_005',
    name: 'Dr. Lisa Park',
    specialty: 'Dermatologist',
    rating: 4.9,
    experience: 8,
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    availability: 'Available Today',
    fee: 110,
    languages: ['English', 'Korean'],
    location: 'Seattle, WA',
    hospital: 'Swedish Medical Center',
    clinic: 'Skin Care & Dermatology',
    verified: true,
    specialties: ['Dermatology', 'Cosmetic Dermatology', 'Skin Cancer Screening'],
    education: ['MD - University of Washington', 'Dermatology Residency - Stanford'],
    certifications: ['American Board of Dermatology'],
    reviewsCount: 423,
    nextSlot: '03:00 PM',
    consultationType: ['in-person', 'video', 'phone'],
    waitingTime: '10-15 min',
    insuranceAccepted: ['Blue Cross', 'Aetna', 'Cigna'],
    bio: 'Dr. Lisa Park specializes in medical and cosmetic dermatology.',
    achievements: ['Rising Star in Dermatology 2023', 'Patient Choice Award']
  },
  {
    id: 'doc_gynecology_006',
    name: 'Dr. Robert Taylor',
    specialty: 'Gynecologist',
    rating: 4.8,
    experience: 14,
    image: 'https://randomuser.me/api/portraits/men/6.jpg',
    availability: 'Available Tomorrow',
    fee: 130,
    languages: ['English'],
    location: 'Boston, MA',
    hospital: 'Massachusetts General Hospital',
    clinic: "Women's Health Center",
    verified: true,
    specialties: ['Obstetrics', 'Gynecology', 'Reproductive Medicine'],
    education: ['MD - Columbia University', 'Residency in OB/GYN - Brigham and Women\'s Hospital'],
    certifications: ['American Board of Obstetrics and Gynecology'],
    reviewsCount: 678,
    nextSlot: '01:00 PM',
    consultationType: ['in-person', 'video'],
    waitingTime: '15-20 min',
    insuranceAccepted: ['Blue Cross', 'Aetna', 'Cigna', 'Medicare', 'Tufts'],
    bio: 'Dr. Robert Taylor provides comprehensive women\'s health services.',
    achievements: ['Women\'s Health Advocate Award', 'Excellence in Patient Care 2022']
  }
];

// Mock reviews data with correct doctor IDs
const mockReviewsMap: Record<string, DoctorReview[]> = {
  'doc_cardiology_001': [
    {
      id: 'rev_001',
      patientId: 'pat_001',
      patientName: 'John Doe',
      patientAvatar: 'https://randomuser.me/api/portraits/men/1.jpg',
      rating: 5,
      comment: 'Excellent doctor! Very knowledgeable and caring. Explained everything clearly.',
      date: '2024-03-15',
      helpful: 45,
      verified: true,
      response: {
        text: 'Thank you for your kind words, John! Glad I could help.',
        date: '2024-03-16'
      }
    },
    {
      id: 'rev_002',
      patientId: 'pat_002',
      patientName: 'Jane Smith',
      patientAvatar: 'https://randomuser.me/api/portraits/women/2.jpg',
      rating: 5,
      comment: 'Best cardiologist in the city! Very compassionate.',
      date: '2024-03-10',
      helpful: 32,
      verified: true
    }
  ],
  'doc_neurology_002': [
    {
      id: 'rev_003',
      patientId: 'pat_003',
      patientName: 'Robert Johnson',
      patientAvatar: 'https://randomuser.me/api/portraits/men/3.jpg',
      rating: 4,
      comment: 'Very thorough and professional. Helped me recover from my stroke.',
      date: '2024-03-05',
      helpful: 28,
      verified: true
    }
  ],
  'doc_pediatrics_003': [
    {
      id: 'rev_004',
      patientId: 'pat_004',
      patientName: 'Maria Garcia',
      patientAvatar: 'https://randomuser.me/api/portraits/women/4.jpg',
      rating: 5,
      comment: 'Dr. Chen is wonderful with my children! Highly recommend.',
      date: '2024-02-28',
      helpful: 52,
      verified: true
    }
  ]
};

// Mock schedules
const mockSchedules: Record<string, DoctorSchedule> = {};

// Generate schedule for each doctor
mockDoctors.forEach(doctor => {
  const timeSlots: TimeSlot[] = [
    { time: '09:00 AM', available: true },
    { time: '09:30 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: doctor.id !== 'doc_cardiology_001' },
    { time: '11:00 AM', available: true },
    { time: '11:30 AM', available: true },
    { time: '12:00 PM', available: false },
    { time: '02:00 PM', available: true },
    { time: '02:30 PM', available: true },
    { time: '03:00 PM', available: true },
    { time: '03:30 PM', available: doctor.id !== 'doc_cardiology_001' },
    { time: '04:00 PM', available: true }
  ];

  mockSchedules[doctor.id] = {
    doctorId: doctor.id,
    days: {
      monday: [...timeSlots],
      tuesday: [...timeSlots],
      wednesday: [...timeSlots],
      thursday: [...timeSlots],
      friday: [...timeSlots],
      saturday: timeSlots.slice(0, 5),
      sunday: []
    },
    breakTime: {
      start: '12:00 PM',
      end: '02:00 PM'
    }
  };
});

// ============================================
// HELPER FUNCTIONS
// ============================================

const filterDoctors = (doctors: Doctor[], filters: DoctorFilters): Doctor[] => {
  let filtered = [...doctors];

  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    filtered = filtered.filter(doctor =>
      doctor.name.toLowerCase().includes(query) ||
      doctor.specialty.toLowerCase().includes(query) ||
      doctor.location.toLowerCase().includes(query) ||
      doctor.hospital.toLowerCase().includes(query) ||
      doctor.specialties.some(s => s.toLowerCase().includes(query))
    );
  }

  if (filters.specialty && filters.specialty !== 'all') {
    filtered = filtered.filter(doctor =>
      doctor.specialty === filters.specialty ||
      doctor.specialties.includes(filters.specialty!)
    );
  }

  if (filters.minRating && filters.minRating > 0) {
    filtered = filtered.filter(doctor => doctor.rating >= filters.minRating!);
  }

  if (filters.maxFee && filters.maxFee > 0) {
    filtered = filtered.filter(doctor => doctor.fee <= filters.maxFee!);
  }

  if (filters.location && filters.location !== 'all') {
    filtered = filtered.filter(doctor => doctor.location === filters.location);
  }

  if (filters.hospital && filters.hospital !== 'all') {
    filtered = filtered.filter(doctor => doctor.hospital === filters.hospital);
  }

  if (filters.language && filters.language !== 'all') {
    filtered = filtered.filter(doctor =>
      doctor.languages.includes(filters.language!)
    );
  }

  if (filters.consultationType) {
    filtered = filtered.filter(doctor =>
      doctor.consultationType.includes(filters.consultationType!)
    );
  }

  if (filters.availability) {
    const availabilityMap = {
      'Today': 'Available Today',
      'Tomorrow': 'Available Tomorrow',
      'This Week': 'Available This Week'
    };
    const availabilityValue = availabilityMap[filters.availability];
    filtered = filtered.filter(doctor => doctor.availability === availabilityValue);
  }

  if (filters.sortBy) {
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'rating':
          comparison = a.rating - b.rating;
          break;
        case 'fee':
          comparison = a.fee - b.fee;
          break;
        case 'experience':
          comparison = a.experience - b.experience;
          break;
        case 'reviews':
          comparison = a.reviewsCount - b.reviewsCount;
          break;
        default:
          comparison = 0;
      }
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });
  }

  return filtered;
};

// ============================================
// DOCTOR SERVICE
// ============================================

export const doctorService = {
  /**
   * Get all doctors with optional filters and pagination
   */
  getDoctors: async (filters?: DoctorFilters): Promise<{
    doctors: Doctor[];
    total: number;
    page: number;
    totalPages: number;
  }> => {
    await simulateDelay(800);

    let filtered = filterDoctors(mockDoctors, filters || {});
    
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedDoctors = filtered.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filtered.length / limit);

    return {
      doctors: paginatedDoctors,
      total: filtered.length,
      page,
      totalPages
    };
  },

  /**
   * Get doctor by ID - FIXED ERROR HANDLING
   */
  getDoctorById: async (id: string): Promise<Doctor> => {
    await simulateDelay(500);

    console.log('Fetching doctor with ID:', id); // Debug log

    // Find doctor by ID
    const doctor = mockDoctors.find(d => d.id === id);
    
    if (!doctor) {
      console.error('Doctor not found for ID:', id);
      console.log('Available doctor IDs:', mockDoctors.map(d => d.id));
      throw new Error(`Doctor not found with ID: ${id}`);
    }
    
    return doctor;
  },

  /**
   * Get all available specialties
   */
  getSpecialties: async (): Promise<string[]> => {
    await simulateDelay(300);
    return [...new Set(mockDoctors.map(d => d.specialty))];
  },

  /**
   * Get all locations
   */
  getLocations: async (): Promise<string[]> => {
    await simulateDelay(300);
    return [...new Set(mockDoctors.map(d => d.location))];
  },

  /**
   * Get all hospitals
   */
  getHospitals: async (): Promise<string[]> => {
    await simulateDelay(300);
    return [...new Set(mockDoctors.map(d => d.hospital))];
  },

  /**
   * Get available languages
   */
  getLanguages: async (): Promise<string[]> => {
    await simulateDelay(300);
    const languages = new Set<string>();
    mockDoctors.forEach(doctor => {
      doctor.languages.forEach(lang => languages.add(lang));
    });
    return Array.from(languages).sort();
  },

  /**
   * Get doctor schedule
   */
  getSchedule: async (doctorId: string, date?: string): Promise<DoctorSchedule> => {
    await simulateDelay(600);
    
    // First verify doctor exists
    await doctorService.getDoctorById(doctorId);
    
    const schedule = mockSchedules[doctorId];
    if (!schedule) {
      throw new Error(`Schedule not found for doctor: ${doctorId}`);
    }
    
    return schedule;
  },

  /**
   * Get doctor reviews
   */
  getReviews: async (
    doctorId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    reviews: DoctorReview[];
    total: number;
    averageRating: number;
    page: number;
    totalPages: number;
  }> => {
    await simulateDelay(600);
    
    // First verify doctor exists
    await doctorService.getDoctorById(doctorId);
    
    const reviews = mockReviewsMap[doctorId] || [];
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedReviews = reviews.slice(startIndex, endIndex);
    const totalPages = Math.ceil(reviews.length / limit);
    const averageRating = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length 
      : 0;

    return {
      reviews: paginatedReviews,
      total: reviews.length,
      averageRating,
      page,
      totalPages
    };
  },

  /**
   * Get doctor statistics
   */
  getDoctorStats: async (doctorId: string): Promise<DoctorStats> => {
    await simulateDelay(400);
    
    // First verify doctor exists
    const doctor = await doctorService.getDoctorById(doctorId);
    
    return {
      totalPatients: Math.floor(Math.random() * 1000) + 500,
      totalAppointments: Math.floor(Math.random() * 5000) + 1000,
      averageRating: doctor.rating,
      responseTime: `${Math.floor(Math.random() * 5) + 1} hours`,
      completionRate: 95 + Math.random() * 4
    };
  },

  /**
   * Book an appointment
   */
  bookAppointment: async (request: AppointmentRequest): Promise<Appointment> => {
    await simulateDelay(1000);
    
    // First verify doctor exists
    const doctor = await doctorService.getDoctorById(request.doctorId);
    
    const appointment: Appointment = {
      id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      doctorId: request.doctorId,
      doctorName: doctor.name,
      patientId: request.patientId,
      patientName: 'Current Patient',
      date: request.date,
      time: request.time,
      type: request.type,
      status: 'pending',
      symptoms: request.symptoms,
      reason: request.reason,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    return appointment;
  },

  /**
   * Get recommended doctors
   */
  getRecommendedDoctors: async (doctorId: string, limit: number = 3): Promise<Doctor[]> => {
    await simulateDelay(500);
    
    const currentDoctor = await doctorService.getDoctorById(doctorId);
    const allDoctors = mockDoctors.filter(d => d.id !== doctorId);
    
    const similar = allDoctors
      .filter(d => d.specialty === currentDoctor.specialty)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, limit);
    
    if (similar.length < limit) {
      const others = allDoctors
        .filter(d => !similar.includes(d) && d.specialty !== currentDoctor.specialty)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, limit - similar.length);
      similar.push(...others);
    }
    
    return similar;
  },

  /**
   * Search doctors
   */
  searchDoctors: async (query: string, filters?: DoctorFilters): Promise<Doctor[]> => {
    await simulateDelay(600);
    
    const searchFilters: DoctorFilters = {
      ...filters,
      searchQuery: query
    };
    
    const result = await doctorService.getDoctors(searchFilters);
    return result.doctors;
  },

  /**
   * Get top rated doctors
   */
  getTopRatedDoctors: async (limit: number = 5): Promise<Doctor[]> => {
    await simulateDelay(400);
    
    const result = await doctorService.getDoctors({
      sortBy: 'rating',
      sortOrder: 'desc',
      limit
    });
    
    return result.doctors;
  },

  /**
   * Get fee range
   */
  getFeeRange: async (): Promise<{ min: number; max: number }> => {
    await simulateDelay(200);
    
    const fees = mockDoctors.map(d => d.fee);
    return {
      min: Math.min(...fees),
      max: Math.max(...fees)
    };
  },

  /**
   * Validate doctor ID - NEW HELPER FUNCTION
   */
  isValidDoctorId: (id: string): boolean => {
    return mockDoctors.some(d => d.id === id);
  },

  /**
   * Get all doctor IDs - NEW HELPER FUNCTION
   */
  getAllDoctorIds: (): string[] => {
    return mockDoctors.map(d => d.id);
  }
};

// ============================================
// REACT HOOK
// ============================================

export const useDoctorService = () => {
  return {
    getDoctors: doctorService.getDoctors,
    getDoctorById: doctorService.getDoctorById,
    getSpecialties: doctorService.getSpecialties,
    getLocations: doctorService.getLocations,
    getHospitals: doctorService.getHospitals,
    getLanguages: doctorService.getLanguages,
    getSchedule: doctorService.getSchedule,
    getReviews: doctorService.getReviews,
    getDoctorStats: doctorService.getDoctorStats,
    bookAppointment: doctorService.bookAppointment,
    getRecommendedDoctors: doctorService.getRecommendedDoctors,
    searchDoctors: doctorService.searchDoctors,
    getTopRatedDoctors: doctorService.getTopRatedDoctors,
    isValidDoctorId: doctorService.isValidDoctorId,
    getAllDoctorIds: doctorService.getAllDoctorIds
  };
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default doctorService;