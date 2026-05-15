// src/components/admin/DoctorVerification.tsx

import React, { useState, useEffect } from 'react';
import {
  UserCheck, Search, FileText, CheckCircle,
  XCircle, Eye, Clock, AlertCircle, Download,
  MessageSquare, Shield
} from 'lucide-react';
import { DoctorVerification, VerificationDocument } from '../../types/admin';

export const DoctorVerificationComponent: React.FC = () => {
  const [verifications, setVerifications] = useState<DoctorVerification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<DoctorVerification | null>(null);
  const [filter, setFilter] = useState('pending');

  useEffect(() => {
    fetchVerifications();
  }, [filter]);

  const fetchVerifications = async () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockData: DoctorVerification[] = [
        {
          id: '1',
          doctorId: 'd1',
          doctorName: 'Dr. Sarah Wilson',
          email: 'sarah.wilson@email.com',
          phone: '+1 (555) 111-2233',
          specialization: 'Cardiology',
          qualification: 'MD, FACC',
          licenseNumber: 'MED-2020-12345',
          documents: [
            {
              id: 'doc1',
              type: 'license',
              name: 'Medical License',
              fileUrl: '#',
              uploadDate: '2024-01-15',
              verified: false
            },
            {
              id: 'doc2',
              type: 'degree',
              name: 'MD Degree Certificate',
              fileUrl: '#',
              uploadDate: '2024-01-15',
              verified: false
            }
          ],
          status: 'pending',
          submittedDate: '2024-01-15'
        },
        {
          id: '2',
          doctorId: 'd2',
          doctorName: 'Dr. James Brown',
          email: 'james.brown@email.com',
          phone: '+1 (555) 444-5566',
          specialization: 'Dermatology',
          qualification: 'MD, FAAD',
          licenseNumber: 'MED-2019-67890',
          documents: [
            {
              id: 'doc3',
              type: 'license',
              name: 'Medical License',
              fileUrl: '#',
              uploadDate: '2024-01-20',
              verified: false
            }
          ],
          status: 'pending',
          submittedDate: '2024-01-20'
        }
      ];
      setVerifications(mockData);
      setIsLoading(false);
    }, 1000);
  };

  const handleApprove = (id: string) => {
    setVerifications(verifications.map(v => 
      v.id === id ? { ...v, status: 'approved' as const } : v
    ));
  };

  const handleReject = (id: string) => {
    const reason = window.prompt('Rejection reason:');
    if (reason) {
      setVerifications(verifications.map(v => 
        v.id === id ? { ...v, status: 'rejected' as const, rejectionReason: reason } : v
      ));
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Doctor Verification</h1>
          <p className="text-gray-600 mt-1">Approve or reject doctor registrations</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setFilter('pending')}
            className={`px-4 py-2 rounded-lg ${filter === 'pending' ? 'bg-yellow-600 text-white' : 'bg-gray-100'}`}
          >
            Pending (35)
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={`px-4 py-2 rounded-lg ${filter === 'approved' ? 'bg-green-600 text-white' : 'bg-gray-100'}`}
          >
            Approved (780)
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`px-4 py-2 rounded-lg ${filter === 'rejected' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}
          >
            Rejected (12)
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {verifications
          .filter(v => filter === 'all' || v.status === filter)
          .map((verification) => (
            <div key={verification.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{verification.doctorName}</h3>
                    <p className="text-sm text-gray-600">{verification.specialization}</p>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span>📧 {verification.email}</span>
                      <span>📱 {verification.phone}</span>
                      <span>🎓 {verification.qualification}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      License: {verification.licenseNumber}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  verification.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  verification.status === 'approved' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {verification.status.toUpperCase()}
                </span>
              </div>

              {/* Documents */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-3 flex items-center">
                  <FileText className="w-4 h-4 mr-2" />
                  Verification Documents
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {verification.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-white rounded border">
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium">{doc.name}</p>
                          <p className="text-xs text-gray-500">
                            {doc.type} • Uploaded: {doc.uploadDate}
                          </p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700">
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              {verification.status === 'pending' && (
                <div className="mt-4 flex justify-end space-x-3">
                  <button
                    onClick={() => handleReject(verification.id)}
                    className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 flex items-center"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(verification.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};