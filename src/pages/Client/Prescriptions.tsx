// src/pages/client/Prescriptions.tsx
// PRESCRIPTION PAGE - All details in compact design

import React, { useState, useEffect } from 'react';
import {
  Pill, Calendar, User, Stethoscope, Building2,
  Clock, DollarSign, FileText, AlertCircle,
  CheckCircle, Download, Eye, Search, ChevronRight,
  Printer, Share2, RefreshCw
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface Prescription {
  id: string;
  prescriptionNumber: string;
  date: string;
  validUntil: string;
  
  // Doctor Info
  doctorName: string;
  doctorSpecialization: string;
  doctorPhone: string;
  hospitalName: string;
  hospitalAddress: string;
  
  // Patient Info
  patientName: string;
  patientAge: number;
  patientBloodGroup: string;
  patientPhone: string;
  
  // Diagnosis
  diagnosis: string;
  symptoms: string[];
  testRecommended: TestInfo[];
  
  // Medicines
  medicines: PrescribedMedicine[];
  
  // Instructions
  instructions: string;
  dietAdvice: string;
  followUpDate: string;
  
  // Payment
  consultationFee: number;
  medicineCost: number;
  testCost: number;
  totalAmount: number;
  paymentStatus: 'paid' | 'pending' | 'partial';
  
  // Status
  status: 'active' | 'completed' | 'expired';
  
  // Attachments
  reportUrl?: string;
  digitalSignature: string;
}

interface TestInfo {
  name: string;
  type: string;
  date: string;
  status: 'done' | 'pending';
  reportUrl?: string;
  cost: number;
}

interface PrescribedMedicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  timing: 'before-food' | 'after-food' | 'with-food' | 'empty-stomach';
  duration: string;
  quantity: number;
  price: number;
  instructions: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const ClientPrescriptions: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData: Prescription[] = [
        {
          id: 'p1',
          prescriptionNumber: 'RX-2025-001',
          date: '2025-01-15',
          validUntil: '2025-03-15',
          
          doctorName: 'Dr. Sarah Wilson',
          doctorSpecialization: 'Cardiologist',
          doctorPhone: '+1 (555) 333-4444',
          hospitalName: 'City General Hospital',
          hospitalAddress: '123 Medical Center Dr, New York',
          
          patientName: 'John Doe',
          patientAge: 28,
          patientBloodGroup: 'O+',
          patientPhone: '+1 (555) 123-4567',
          
          diagnosis: 'Stage 1 Hypertension',
          symptoms: ['Headache', 'Dizziness', 'Fatigue'],
          testRecommended: [
            { name: 'Complete Blood Count (CBC)', type: 'Blood Test', date: '2025-01-15', status: 'done', reportUrl: '#', cost: 50 },
            { name: 'Lipid Profile', type: 'Blood Test', date: '2025-01-15', status: 'done', reportUrl: '#', cost: 75 },
            { name: 'ECG', type: 'Cardiac', date: '2025-01-20', status: 'pending', cost: 100 }
          ],
          
          medicines: [
            {
              id: 'm1', name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily',
              timing: 'after-food', duration: '3 months', quantity: 90, price: 45,
              instructions: 'Take in the morning after breakfast'
            },
            {
              id: 'm2', name: 'Amlodipine', dosage: '5mg', frequency: 'Once daily',
              timing: 'after-food', duration: '3 months', quantity: 90, price: 35,
              instructions: 'Take in the evening after dinner'
            }
          ],
          
          instructions: 'Monitor blood pressure daily. Reduce salt intake. Exercise regularly.',
          dietAdvice: 'Low sodium diet. Avoid fried foods. Increase fruits and vegetables.',
          followUpDate: '2025-04-15',
          
          consultationFee: 150,
          medicineCost: 80,
          testCost: 225,
          totalAmount: 455,
          paymentStatus: 'paid',
          
          status: 'active',
          digitalSignature: 'Dr. Sarah Wilson - Digital Signature Verified'
        },
        {
          id: 'p2',
          prescriptionNumber: 'RX-2025-002',
          date: '2025-01-10',
          validUntil: '2025-02-10',
          
          doctorName: 'Dr. James Brown',
          doctorSpecialization: 'Dermatologist',
          doctorPhone: '+1 (555) 555-6666',
          hospitalName: 'Metro Hospital',
          hospitalAddress: '456 Health Blvd, New York',
          
          patientName: 'John Doe',
          patientAge: 28,
          patientBloodGroup: 'O+',
          patientPhone: '+1 (555) 123-4567',
          
          diagnosis: 'Allergic Dermatitis',
          symptoms: ['Skin rash', 'Itching', 'Redness'],
          testRecommended: [
            { name: 'Allergy Panel', type: 'Skin Test', date: '2025-01-10', status: 'done', reportUrl: '#', cost: 120 }
          ],
          
          medicines: [
            {
              id: 'm3', name: 'Cetirizine', dosage: '10mg', frequency: 'Once daily',
              timing: 'after-food', duration: '2 weeks', quantity: 14, price: 15,
              instructions: 'Take at bedtime'
            },
            {
              id: 'm4', name: 'Hydrocortisone Cream', dosage: '1%', frequency: 'Twice daily',
              timing: 'with-food', duration: '1 week', quantity: 1, price: 25,
              instructions: 'Apply thin layer on affected area'
            }
          ],
          
          instructions: 'Avoid known allergens. Keep skin moisturized.',
          dietAdvice: 'Avoid spicy food. Drink plenty of water.',
          followUpDate: '2025-02-10',
          
          consultationFee: 120,
          medicineCost: 40,
          testCost: 120,
          totalAmount: 280,
          paymentStatus: 'paid',
          
          status: 'active',
          digitalSignature: 'Dr. James Brown - Digital Signature Verified'
        }
      ];
      
      setPrescriptions(mockData);
      setIsLoading(false);
    }, 1000);
  };

  const filteredPrescriptions = prescriptions.filter(p => {
    const matchesSearch = 
      p.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.diagnosis.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentBadge = (status: string) => {
    switch(status) {
      case 'paid': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'partial': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-500 text-sm">Loading prescriptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Pill className="w-7 h-7 mr-3 text-green-600" />
            My Prescriptions
          </h1>
          <p className="text-gray-500 mt-1 text-sm">All your prescriptions & medical records</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search & Filter */}
        <div className="flex gap-3 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by doctor, diagnosis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl focus:ring-2 focus:ring-green-500 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-xl px-4 py-2.5 text-sm bg-white"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {filteredPrescriptions.map((prescription) => (
            <div
              key={prescription.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all cursor-pointer"
              onClick={() => setSelectedPrescription(prescription)}
            >
              {/* Top Bar */}
              <div className="px-5 py-3 bg-gray-50 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono text-gray-500">{prescription.prescriptionNumber}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(prescription.status)}`}>
                    {prescription.status}
                  </span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentBadge(prescription.paymentStatus)}`}>
                  {prescription.paymentStatus}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Doctor Info */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Doctor</p>
                    <p className="font-semibold text-sm">{prescription.doctorName}</p>
                    <p className="text-xs text-gray-500">{prescription.doctorSpecialization}</p>
                    <p className="text-xs text-gray-500">{prescription.hospitalName}</p>
                  </div>

                  {/* Diagnosis & Medicines */}
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Diagnosis</p>
                    <p className="font-medium text-sm">{prescription.diagnosis}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {prescription.symptoms.map((s, i) => (
                        <span key={i} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      💊 {prescription.medicines.length} medicines prescribed
                    </p>
                  </div>

                  {/* Dates & Cost */}
                  <div className="text-right">
                    <p className="text-xs text-gray-500 mb-1">Date</p>
                    <p className="text-sm font-medium">{prescription.date}</p>
                    <p className="text-xs text-gray-500 mt-1">Total Cost</p>
                    <p className="text-lg font-bold text-green-600">${prescription.totalAmount}</p>
                  </div>
                </div>

                {/* Tests */}
                {prescription.testRecommended.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs text-gray-500 mb-2">📋 Tests Recommended:</p>
                    <div className="flex flex-wrap gap-2">
                      {prescription.testRecommended.map((test, i) => (
                        <span key={i} className={`text-xs px-2 py-1 rounded-full ${
                          test.status === 'done' ? 'bg-green-50 text-green-600' : 'bg-yellow-50 text-yellow-600'
                        }`}>
                          {test.name} - ${test.cost}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="px-5 py-3 bg-gray-50 border-t flex justify-between">
                <span className="text-xs text-gray-500">
                  🗓️ Follow-up: {prescription.followUpDate}
                </span>
                <div className="flex space-x-2">
                  <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
                    <Download className="w-3.5 h-3.5 mr-1" /> Download
                  </button>
                  <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center">
                    <Printer className="w-3.5 h-3.5 mr-1" /> Print
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredPrescriptions.length === 0 && (
          <div className="text-center py-16">
            <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No prescriptions found</p>
          </div>
        )}
      </div>

      {/* DETAIL MODAL */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPrescription(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-t-2xl p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{selectedPrescription.prescriptionNumber}</p>
                  <h2 className="text-xl font-bold">Prescription Details</h2>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium bg-white/20`}>
                  {selectedPrescription.status}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 space-y-5">
              {/* Patient & Doctor */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-xl p-3">
                  <p className="text-xs text-blue-600 font-medium mb-2">👤 Patient</p>
                  <p className="font-semibold text-sm">{selectedPrescription.patientName}</p>
                  <p className="text-xs text-gray-600">Age: {selectedPrescription.patientAge}</p>
                  <p className="text-xs text-gray-600">Blood: {selectedPrescription.patientBloodGroup}</p>
                  <p className="text-xs text-gray-600">{selectedPrescription.patientPhone}</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3">
                  <p className="text-xs text-green-600 font-medium mb-2">👨‍⚕️ Doctor</p>
                  <p className="font-semibold text-sm">{selectedPrescription.doctorName}</p>
                  <p className="text-xs text-gray-600">{selectedPrescription.doctorSpecialization}</p>
                  <p className="text-xs text-gray-600">{selectedPrescription.hospitalName}</p>
                  <p className="text-xs text-gray-600">{selectedPrescription.doctorPhone}</p>
                </div>
              </div>

              {/* Diagnosis */}
              <div className="bg-red-50 rounded-xl p-3">
                <p className="text-xs text-red-600 font-medium mb-2">🏥 Diagnosis</p>
                <p className="font-semibold">{selectedPrescription.diagnosis}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedPrescription.symptoms.map((s, i) => (
                    <span key={i} className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                </div>
              </div>

              {/* Medicines */}
              <div>
                <p className="text-sm font-semibold mb-3 flex items-center">
                  <Pill className="w-4 h-4 mr-2 text-green-600" />
                  Medicines Prescribed
                </p>
                <div className="space-y-2">
                  {selectedPrescription.medicines.map((med) => (
                    <div key={med.id} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-sm">{med.name}</p>
                          <p className="text-xs text-gray-600">{med.dosage} • {med.frequency} • {med.timing}</p>
                          <p className="text-xs text-gray-500 mt-1">{med.instructions}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">${med.price}</p>
                          <p className="text-xs text-gray-500">Qty: {med.quantity}</p>
                          <p className="text-xs text-gray-500">{med.duration}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tests */}
              {selectedPrescription.testRecommended.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-purple-600" />
                    Tests Recommended
                  </p>
                  <div className="space-y-2">
                    {selectedPrescription.testRecommended.map((test, i) => (
                      <div key={i} className="flex items-center justify-between bg-purple-50 rounded-xl p-3">
                        <div>
                          <p className="font-medium text-sm">{test.name}</p>
                          <p className="text-xs text-gray-600">{test.type} • {test.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${test.cost}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            test.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {test.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Cost Breakdown */}
              <div className="bg-yellow-50 rounded-xl p-3">
                <p className="text-sm font-semibold mb-2">💰 Cost Breakdown</p>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation Fee</span>
                    <span>${selectedPrescription.consultationFee}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Medicine Cost</span>
                    <span>${selectedPrescription.medicineCost}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Test Cost</span>
                    <span>${selectedPrescription.testCost}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total</span>
                    <span className="text-green-600">${selectedPrescription.totalAmount}</span>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-blue-50 rounded-xl p-3">
                <p className="text-sm font-semibold mb-1">📝 Instructions</p>
                <p className="text-sm text-gray-700">{selectedPrescription.instructions}</p>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Prescribed</p>
                  <p className="font-medium text-sm">{selectedPrescription.date}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Valid Until</p>
                  <p className="font-medium text-sm">{selectedPrescription.validUntil}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-500">Follow-up</p>
                  <p className="font-medium text-sm">{selectedPrescription.followUpDate}</p>
                </div>
              </div>

              {/* Digital Signature */}
              <div className="text-center text-xs text-gray-500 border-t pt-3">
                <p>{selectedPrescription.digitalSignature}</p>
              </div>

              {/* Actions */}
              <div className="flex space-x-3">
                <button className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-medium text-sm hover:bg-green-700 flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </button>
                <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 flex items-center justify-center">
                  <Printer className="w-4 h-4 mr-2" /> Print
                </button>
              </div>
              
              <button 
                onClick={() => setSelectedPrescription(null)}
                className="w-full py-2.5 border border-gray-300 rounded-xl text-sm hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientPrescriptions;