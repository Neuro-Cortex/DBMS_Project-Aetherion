// src/pages/client/Appointments.tsx

import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock,Video,   User,
  Search,  Star,  
  Plus,  CheckCircle, X,
  Stethoscope, Building2, DollarSign, } from 'lucide-react';

// Types
interface Doctor {
  id: string;
  name: string;
  specialization: string;
  hospital: string;
  experience: number;
  rating: number;
  reviewCount: number;
  consultationFee: number;
  videoConsultationFee: number;
  availableSlots: TimeSlot[];
  languages: string[];
  education: string;
  profileImage: string;
  isOnline: boolean;
  consultationModes: ('in-person' | 'video' | 'phone')[];
  nextAvailable: string;
}

interface TimeSlot {
  date: string;
  time: string;
  isAvailable: boolean;
}

interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorImage: string;
  specialization: string;
  hospital: string;
  date: string;
  time: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'upcoming' | 'completed' | 'cancelled';
  reason: string;
  fee: number;
  paymentStatus: 'paid' | 'pending';
  notes?: string;
}

export const ClientAppointments: React.FC = () => {
  // State
  const [activeTab, setActiveTab] = useState<'book' | 'upcoming' | 'history'>('book');
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [specializationFilter, setSpecializationFilter] = useState('all');
  const [consultationType, setConsultationType] = useState<'all' | 'in-person' | 'video' | 'phone'>('all');
  const [bookingData, setBookingData] = useState({
    reason: '',
    symptoms: '',
    notes: '',
    paymentMethod: 'card' as 'card' | 'cash' | 'insurance'
  });

  // Mock Data
  useEffect(() => {
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = () => {
    setTimeout(() => {
      const mockDoctors: Doctor[] = [
        {
          id: '1',
          name: 'Dr. Sarah Wilson',
          specialization: 'Cardiologist',
          hospital: 'City General Hospital',
          experience: 15,
          rating: 4.8,
          reviewCount: 245,
          consultationFee: 150,
          videoConsultationFee: 100,
          availableSlots: [
            { date: '2025-01-20', time: '09:00 AM', isAvailable: true },
            { date: '2025-01-20', time: '10:00 AM', isAvailable: true },
            { date: '2025-01-20', time: '11:00 AM', isAvailable: false },
            { date: '2025-01-21', time: '09:00 AM', isAvailable: true },
            { date: '2025-01-21', time: '02:00 PM', isAvailable: true },
            { date: '2025-01-22', time: '10:00 AM', isAvailable: true },
          ],
          languages: ['English', 'Spanish'],
          education: 'MD - Harvard Medical School',
          profileImage: '',
          isOnline: true,
          consultationModes: ['in-person', 'video', 'phone'],
          nextAvailable: '2025-01-20'
        },
        {
          id: '2',
          name: 'Dr. James Brown',
          specialization: 'Dermatologist',
          hospital: 'Metro Hospital',
          experience: 10,
          rating: 4.6,
          reviewCount: 180,
          consultationFee: 120,
          videoConsultationFee: 80,
          availableSlots: [
            { date: '2025-01-20', time: '09:30 AM', isAvailable: true },
            { date: '2025-01-20', time: '11:30 AM', isAvailable: true },
            { date: '2025-01-21', time: '10:00 AM', isAvailable: true },
          ],
          languages: ['English', 'French'],
          education: 'MD - Yale University',
          profileImage: '',
          isOnline: true,
          consultationModes: ['in-person', 'video'],
          nextAvailable: '2025-01-20'
        },
        {
          id: '3',
          name: 'Dr. Emily White',
          specialization: 'Gynecologist',
          hospital: 'Women Care Hospital',
          experience: 12,
          rating: 4.9,
          reviewCount: 320,
          consultationFee: 180,
          videoConsultationFee: 120,
          availableSlots: [
            { date: '2025-01-20', time: '10:00 AM', isAvailable: true },
            { date: '2025-01-21', time: '11:00 AM', isAvailable: true },
            { date: '2025-01-22', time: '09:00 AM', isAvailable: true },
          ],
          languages: ['English'],
          education: 'MD - Johns Hopkins University',
          profileImage: '',
          isOnline: false,
          consultationModes: ['in-person', 'video', 'phone'],
          nextAvailable: '2025-01-21'
        },
        {
          id: '4',
          name: 'Dr. Michael Chen',
          specialization: 'Neurologist',
          hospital: 'City General Hospital',
          experience: 20,
          rating: 4.7,
          reviewCount: 290,
          consultationFee: 200,
          videoConsultationFee: 150,
          availableSlots: [
            { date: '2025-01-22', time: '10:00 AM', isAvailable: true },
            { date: '2025-01-23', time: '11:00 AM', isAvailable: true },
          ],
          languages: ['English', 'Chinese'],
          education: 'MD - Stanford University',
          profileImage: '',
          isOnline: true,
          consultationModes: ['in-person', 'video'],
          nextAvailable: '2025-01-22'
        }
      ];
      setDoctors(mockDoctors);
      setIsLoading(false);
    }, 1000);
  };

  const fetchAppointments = () => {
    const mockAppointments: Appointment[] = [
      {
        id: 'a1',
        doctorId: '1',
        doctorName: 'Dr. Sarah Wilson',
        doctorImage: '',
        specialization: 'Cardiologist',
        hospital: 'City General Hospital',
        date: '2025-01-20',
        time: '10:00 AM',
        type: 'in-person',
        status: 'upcoming',
        reason: 'Regular heart checkup',
        fee: 150,
        paymentStatus: 'paid'
      },
      {
        id: 'a2',
        doctorId: '3',
        doctorName: 'Dr. Emily White',
        doctorImage: '',
        specialization: 'Gynecologist',
        hospital: 'Women Care Hospital',
        date: '2025-01-25',
        time: '11:00 AM',
        type: 'video',
        status: 'upcoming',
        reason: 'Pregnancy consultation',
        fee: 120,
        paymentStatus: 'pending'
      },
      {
        id: 'a3',
        doctorId: '2',
        doctorName: 'Dr. James Brown',
        doctorImage: '',
        specialization: 'Dermatologist',
        hospital: 'Metro Hospital',
        date: '2025-01-10',
        time: '09:30 AM',
        type: 'in-person',
        status: 'completed',
        reason: 'Skin rash treatment',
        fee: 120,
        paymentStatus: 'paid'
      }
    ];
    setAppointments(mockAppointments);
  };

  // Filters
  const specializations = ['all', ...new Set(doctors.map(d => d.specialization))];

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = 
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSpecialization = specializationFilter === 'all' || doctor.specialization === specializationFilter;
    const matchesType = consultationType === 'all' || doctor.consultationModes.includes(consultationType);
    
    return matchesSearch && matchesSpecialization && matchesType;
  });

  // Handlers
  const handleBookAppointment = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setSelectedSlot(null);
    setBookingStep(1);
    setBookingData({ reason: '', symptoms: '', notes: '', paymentMethod: 'card' });
    setShowBookingModal(true);
  };

  const handleSelectSlot = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setBookingStep(2);
  };

  const handleConfirmBooking = () => {
    if (!selectedDoctor || !selectedSlot) return;

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      doctorImage: selectedDoctor.profileImage,
      specialization: selectedDoctor.specialization,
      hospital: selectedDoctor.hospital,
      date: selectedSlot.date,
      time: selectedSlot.time,
      type: consultationType === 'all' ? 'in-person' : consultationType,
      status: 'upcoming',
      reason: bookingData.reason,
      fee: consultationType === 'video' ? selectedDoctor.videoConsultationFee : selectedDoctor.consultationFee,
      paymentStatus: 'pending',
      notes: bookingData.notes
    };

    setAppointments([newAppointment, ...appointments]);
    setShowBookingModal(false);
    setActiveTab('upcoming');
    alert('✅ Appointment booked successfully!');
  };

  const handleCancelAppointment = (id: string) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      setAppointments(appointments.map(a => 
        a.id === id ? { ...a, status: 'cancelled' as const } : a
      ));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Appointments</h1>
            <p className="text-gray-600 mt-2">Book and manage your doctor appointments</p>
          </div>
          <button
            onClick={() => setActiveTab('book')}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 flex items-center shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Book New Appointment
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'book', label: 'Book Appointment', icon: Calendar, count: null },
                { id: 'upcoming', label: 'Upcoming', icon: Clock, count: appointments.filter(a => a.status === 'upcoming').length },
                { id: 'history', label: 'History', icon: CheckCircle, count: appointments.filter(a => a.status !== 'upcoming').length }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                    {tab.count !== null && tab.count > 0 && (
                      <span className="ml-2 bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded-full">
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Book Appointment Tab */}
        {activeTab === 'book' && (
          <div>
            {/* Search & Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search doctors..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={specializationFilter}
                  onChange={(e) => setSpecializationFilter(e.target.value)}
                  className="border rounded-lg px-4 py-2"
                >
                  <option value="all">All Specializations</option>
                  {specializations.filter(s => s !== 'all').map(spec => (
                    <option key={spec} value={spec}>{spec}</option>
                  ))}
                </select>
                <select
                  value={consultationType}
                  onChange={(e) => setConsultationType(e.target.value as typeof consultationType)}
                  className="border rounded-lg px-4 py-2"
                >
                  <option value="all">All Types</option>
                  <option value="in-person">In-Person</option>
                  <option value="video">Video Call</option>
                  <option value="phone">Phone Call</option>
                </select>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                  Search
                </button>
              </div>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Doctor Card Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{doctor.name}</h3>
                          <p className="text-sm text-blue-600">{doctor.specialization}</p>
                          <div className="flex items-center mt-1">
                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                            <span className="text-sm ml-1">{doctor.rating}</span>
                            <span className="text-xs text-gray-500 ml-1">({doctor.reviewCount})</span>
                          </div>
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${doctor.isOnline ? 'bg-green-500' : 'bg-gray-300'}`} 
                        title={doctor.isOnline ? 'Online' : 'Offline'} 
                      />
                    </div>

                    {/* Doctor Info */}
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <Building2 className="w-4 h-4 mr-2" />
                        {doctor.hospital}
                      </div>
                      <div className="flex items-center">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        {doctor.experience} years experience
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-2" />
                        ${doctor.consultationFee} (In-person) • ${doctor.videoConsultationFee} (Video)
                      </div>
                    </div>

                    {/* Consultation Modes */}
                    <div className="flex space-x-2 mb-4">
                      {doctor.consultationModes.includes('in-person') && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">🏥 In-Person</span>
                      )}
                      {doctor.consultationModes.includes('video') && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">📹 Video</span>
                      )}
                      {doctor.consultationModes.includes('phone') && (
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">📞 Phone</span>
                      )}
                    </div>

                    {/* Available Slots */}
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">AVAILABLE SLOTS</p>
                      <div className="flex flex-wrap gap-2">
                        {doctor.availableSlots.slice(0, 3).map((slot, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2 py-1 rounded ${
                              slot.isAvailable
                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                : 'bg-gray-50 text-gray-400 border border-gray-200 line-through'
                            }`}
                          >
                            {slot.date} • {slot.time}
                          </span>
                        ))}
                        {doctor.availableSlots.length > 3 && (
                          <span className="text-xs text-blue-600">+{doctor.availableSlots.length - 3} more</span>
                        )}
                      </div>
                    </div>

                    {/* Book Button */}
                    <button
                      onClick={() => handleBookAppointment(doctor)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book Appointment
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No doctors found</p>
              </div>
            )}
          </div>
        )}

        {/* Upcoming Appointments Tab */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {appointments.filter(a => a.status === 'upcoming').map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                      <p className="text-sm text-gray-600">{appointment.specialization}</p>
                      <div className="flex items-center space-x-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {appointment.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {appointment.time}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${
                          appointment.type === 'video' ? 'bg-blue-100 text-blue-700' :
                          appointment.type === 'phone' ? 'bg-purple-100 text-purple-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {appointment.type}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {appointment.type === 'video' && (
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                        <Video className="w-4 h-4 inline mr-1" />
                        Join Call
                      </button>
                    )}
                    <button className="px-3 py-1 border rounded-lg text-sm hover:bg-gray-50">
                      Reschedule
                    </button>
                    <button
                      onClick={() => handleCancelAppointment(appointment.id)}
                      className="px-3 py-1 border border-red-300 text-red-600 rounded-lg text-sm hover:bg-red-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {appointments.filter(a => a.status === 'upcoming').length === 0 && (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No upcoming appointments</p>
                <button
                  onClick={() => setActiveTab('book')}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Book your first appointment
                </button>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            {appointments.filter(a => a.status !== 'upcoming').map((appointment) => (
              <div key={appointment.id} className="bg-white rounded-xl shadow p-6 opacity-75">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                      appointment.status === 'completed' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      {appointment.status === 'completed' ? (
                        <CheckCircle className="w-7 h-7 text-green-600" />
                      ) : (
                        <X className="w-7 h-7 text-red-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
                      <p className="text-sm text-gray-600">{appointment.specialization}</p>
                      <p className="text-sm text-gray-500">{appointment.date} • {appointment.time}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    appointment.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{selectedDoctor.name}</h2>
                  <p className="text-sm text-gray-600">{selectedDoctor.specialization}</p>
                </div>
              </div>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Booking Steps */}
            <div className="p-6">
              {/* Step Indicator */}
              <div className="flex items-center justify-center mb-8">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      bookingStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {bookingStep > step ? <CheckCircle className="w-5 h-5" /> : step}
                    </div>
                    {step < 3 && (
                      <div className={`w-16 h-1 ${bookingStep > step ? 'bg-blue-600' : 'bg-gray-200'}`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Select Slot */}
              {bookingStep === 1 && (
                <div>
                  <h3 className="font-semibold mb-4">Select Date & Time</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedDoctor.availableSlots.map((slot, index) => (
                      <button
                        key={index}
                        onClick={() => handleSelectSlot(slot)}
                        disabled={!slot.isAvailable}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          !slot.isAvailable
                            ? 'bg-gray-50 text-gray-400 cursor-not-allowed'
                            : selectedSlot === slot
                            ? 'border-blue-600 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <p className="text-sm font-medium">{slot.date}</p>
                        <p className="text-xs text-gray-500">{slot.time}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Booking Details */}
              {bookingStep === 2 && selectedSlot && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Appointment Details</h3>
                  
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm">
                      <span className="font-medium">Doctor:</span> {selectedDoctor.name}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Date:</span> {selectedSlot.date}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Time:</span> {selectedSlot.time}
                    </p>
                    <p className="text-sm">
                      <span className="font-medium">Fee:</span> ${selectedDoctor.consultationFee}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Reason for Visit *</label>
                    <input
                      type="text"
                      value={bookingData.reason}
                      onChange={(e) => setBookingData({ ...bookingData, reason: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2"
                      placeholder="e.g., Regular checkup, Headache, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Symptoms</label>
                    <textarea
                      value={bookingData.symptoms}
                      onChange={(e) => setBookingData({ ...bookingData, symptoms: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2"
                      rows={3}
                      placeholder="Describe your symptoms..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Additional Notes</label>
                    <textarea
                      value={bookingData.notes}
                      onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                      className="w-full border rounded-lg px-4 py-2"
                      rows={2}
                      placeholder="Any additional information..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Payment Method</label>
                    <select
                      value={bookingData.paymentMethod}
                      onChange={(e) => setBookingData({ ...bookingData, paymentMethod: e.target.value as typeof bookingData.paymentMethod })}
                      className="w-full border rounded-lg px-4 py-2"
                    >
                      <option value="card">Credit/Debit Card</option>
                      <option value="cash">Cash</option>
                      <option value="insurance">Insurance</option>
                    </select>
                  </div>

                  <button
                    onClick={() => setBookingStep(3)}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium"
                  >
                    Continue to Confirm
                  </button>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {bookingStep === 3 && (
                <div className="text-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">Confirm Your Appointment</h3>
                  
                  <div className="bg-gray-50 rounded-lg p-6 text-left space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doctor</span>
                      <span className="font-medium">{selectedDoctor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Specialization</span>
                      <span className="font-medium">{selectedDoctor.specialization}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hospital</span>
                      <span className="font-medium">{selectedDoctor.hospital}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date & Time</span>
                      <span className="font-medium">{selectedSlot?.date} at {selectedSlot?.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Consultation Fee</span>
                      <span className="font-bold text-blue-600">${selectedDoctor.consultationFee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Reason</span>
                      <span className="font-medium">{bookingData.reason}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => setBookingStep(2)}
                      className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirmBooking}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                    >
                      ✅ Confirm Booking
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientAppointments;