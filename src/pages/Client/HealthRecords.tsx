// src/pages/client/HealthRecords.tsx
// SIMPLE & BEAUTIFUL HEALTH RECORDS PAGE

import React, { useState, useEffect } from 'react';
import {
  FileText, Heart, Activity, Pill, Syringe,
  Calendar, Download, Eye, Search,
  CheckCircle, AlertCircle, ChevronRight,
  TrendingUp, Clock, Droplet
} from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface HealthRecord {
  id: string;
  type: 'report' | 'prescription' | 'vaccine' | 'vitals';
  title: string;
  date: string;
  doctor: string;
  hospital: string;
  result: string;
  status: 'completed' | 'pending' | 'active' | 'expired';
  fileUrl?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const HealthRecords: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [records, setRecords] = useState<HealthRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<HealthRecord | null>(null);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockRecords: HealthRecord[] = [
        {
          id: '1', type: 'report', title: 'Complete Blood Count (CBC)',
          date: '2025-01-10', doctor: 'Dr. Sarah Wilson',
          hospital: 'City General Hospital',
          result: 'All parameters normal', status: 'completed', fileUrl: '#'
        },
        {
          id: '2', type: 'report', title: 'Chest X-Ray',
          date: '2025-01-05', doctor: 'Dr. Michael Chen',
          hospital: 'City General Hospital',
          result: 'Clear - No abnormalities', status: 'completed', fileUrl: '#'
        },
        {
          id: '3', type: 'report', title: 'Lipid Profile',
          date: '2024-12-20', doctor: 'Dr. Sarah Wilson',
          hospital: 'City General Hospital',
          result: 'Cholesterol slightly elevated', status: 'completed', fileUrl: '#'
        },
        {
          id: '4', type: 'report', title: 'Liver Function Test',
          date: '2025-01-18', doctor: 'Dr. Sarah Wilson',
          hospital: 'City General Hospital',
          result: 'Pending...', status: 'pending', fileUrl: '#'
        },
        {
          id: '5', type: 'prescription', title: 'Hypertension Treatment',
          date: '2025-01-15', doctor: 'Dr. Sarah Wilson',
          hospital: 'City General Hospital',
          result: 'Lisinopril 10mg - Once daily', status: 'active', fileUrl: '#'
        },
        {
          id: '6', type: 'prescription', title: 'Vitamin D Supplement',
          date: '2025-01-10', doctor: 'Dr. James Brown',
          hospital: 'Metro Hospital',
          result: 'Vitamin D 1000 IU - Once daily', status: 'active', fileUrl: '#'
        },
        {
          id: '7', type: 'vaccine', title: 'COVID-19 Vaccine',
          date: '2024-09-15', doctor: 'Dr. Emily White',
          hospital: 'Women Care Hospital',
          result: 'Booster Dose', status: 'completed', fileUrl: '#'
        },
        {
          id: '8', type: 'vaccine', title: 'Flu Shot',
          date: '2024-10-01', doctor: 'Dr. Lisa Anderson',
          hospital: 'Community Health Center',
          result: 'Annual Dose', status: 'completed', fileUrl: '#'
        },
        {
          id: '9', type: 'vitals', title: 'Regular Checkup Vitals',
          date: '2025-01-16', doctor: 'Dr. Sarah Wilson',
          hospital: 'City General Hospital',
          result: 'BP: 120/80 | HR: 72 | BMI: 22.9', status: 'completed', fileUrl: '#'
        },
        {
          id: '10', type: 'vitals', title: 'Monthly Health Check',
          date: '2025-01-01', doctor: 'Dr. Sarah Wilson',
          hospital: 'City General Hospital',
          result: 'BP: 122/82 | HR: 76 | BMI: 23.2', status: 'completed', fileUrl: '#'
        }
      ];
      setRecords(mockRecords);
      setIsLoading(false);
    }, 1000);
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'report': return <FileText className="w-5 h-5 text-purple-500" />;
      case 'prescription': return <Pill className="w-5 h-5 text-green-500" />;
      case 'vaccine': return <Syringe className="w-5 h-5 text-blue-500" />;
      case 'vitals': return <Heart className="w-5 h-5 text-red-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'report': return 'bg-purple-100 border-purple-200';
      case 'prescription': return 'bg-green-100 border-green-200';
      case 'vaccine': return 'bg-blue-100 border-blue-200';
      case 'vitals': return 'bg-red-100 border-red-200';
      default: return 'bg-gray-100 border-gray-200';
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'active': return 'bg-blue-100 text-blue-700';
      case 'expired': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'report': return 'Report';
      case 'prescription': return 'Prescription';
      case 'vaccine': return 'Vaccine';
      case 'vitals': return 'Vitals';
      default: return type;
    }
  };

  const filteredRecords = records.filter(record => {
    const matchesSearch = 
      record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesTab = activeTab === 'all' || record.type === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const tabs = [
    { id: 'all', label: 'All Records', icon: FileText, count: records.length },
    { id: 'report', label: 'Reports', icon: FileText, count: records.filter(r => r.type === 'report').length },
    { id: 'prescription', label: 'Prescriptions', icon: Pill, count: records.filter(r => r.type === 'prescription').length },
    { id: 'vaccine', label: 'Vaccines', icon: Syringe, count: records.filter(r => r.type === 'vaccine').length },
    { id: 'vitals', label: 'Vitals', icon: Heart, count: records.filter(r => r.type === 'vitals').length }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-3 text-gray-500 text-sm">Loading records...</p>
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
            <FileText className="w-7 h-7 mr-3 text-blue-600" />
            Health Records
          </h1>
          <p className="text-gray-500 mt-1 text-sm">All your medical records in one place</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search records, doctors, hospitals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white rounded-xl p-1 mb-6 shadow-sm overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Records List */}
        <div className="space-y-3">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              onClick={() => setSelectedRecord(record)}
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border border-gray-100"
            >
              <div className="flex items-start space-x-4">
                {/* Type Icon */}
                <div className={`p-2.5 rounded-xl border ${getTypeColor(record.type)}`}>
                  {getTypeIcon(record.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-800 text-sm">{record.title}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{record.doctor} • {record.hospital}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusBadge(record.status)}`}>
                      {record.status}
                    </span>
                  </div>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <span className="flex items-center">
                        <Calendar className="w-3.5 h-3.5 mr-1" />
                        {record.date}
                      </span>
                      <span className="px-2 py-0.5 bg-gray-100 rounded-full text-xs">
                        {getTypeLabel(record.type)}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      {record.fileUrl && (
                        <button className="p-1.5 hover:bg-blue-50 rounded-lg text-blue-600">
                          <Download className="w-4 h-4" />
                        </button>
                      )}
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Result Preview */}
                  {record.result && (
                    <p className={`text-xs mt-2 p-2 rounded-lg ${
                      record.result.includes('normal') || record.result.includes('Clear')
                        ? 'bg-green-50 text-green-700'
                        : record.result.includes('Pending')
                        ? 'bg-yellow-50 text-yellow-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {record.result}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRecords.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">No records found</h3>
            <p className="text-gray-500 text-sm mt-1">
              {searchTerm ? 'Try a different search term' : 'No records in this category'}
            </p>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
          <SummaryCard icon={<FileText className="w-5 h-5 text-purple-500" />} label="Total Reports" value={records.filter(r => r.type === 'report').length.toString()} color="purple" />
          <SummaryCard icon={<Pill className="w-5 h-5 text-green-500" />} label="Prescriptions" value={records.filter(r => r.type === 'prescription').length.toString()} color="green" />
          <SummaryCard icon={<Syringe className="w-5 h-5 text-blue-500" />} label="Vaccines" value={records.filter(r => r.type === 'vaccine').length.toString()} color="blue" />
          <SummaryCard icon={<Heart className="w-5 h-5 text-red-500" />} label="Vitals Records" value={records.filter(r => r.type === 'vitals').length.toString()} color="red" />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecord(null)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center space-x-4 mb-4">
              <div className={`p-3 rounded-xl border ${getTypeColor(selectedRecord.type)}`}>
                {getTypeIcon(selectedRecord.type)}
              </div>
              <div>
                <h3 className="font-bold text-lg">{selectedRecord.title}</h3>
                <p className="text-sm text-gray-500">{getTypeLabel(selectedRecord.type)}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 bg-gray-50 rounded-xl p-4">
              <DetailRow label="Date" value={selectedRecord.date} />
              <DetailRow label="Doctor" value={selectedRecord.doctor} />
              <DetailRow label="Hospital" value={selectedRecord.hospital} />
              <DetailRow label="Result" value={selectedRecord.result} />
              <DetailRow 
                label="Status" 
                value={selectedRecord.status} 
                badge={getStatusBadge(selectedRecord.status)} 
              />
            </div>

            {/* Actions */}
            <div className="flex space-x-3 mt-6">
              {selectedRecord.fileUrl && (
                <button className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" /> Download
                </button>
              )}
              <button 
                onClick={() => setSelectedRecord(null)}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm hover:bg-gray-50"
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

// ============================================
// SUB-COMPONENTS
// ============================================

const SummaryCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className={`bg-white rounded-xl p-4 shadow-sm border-l-4 border-${color}-500`}>
    <div className="flex items-center justify-between">
      {icon}
      <span className="text-2xl font-bold text-gray-800">{value}</span>
    </div>
    <p className="text-xs text-gray-500 mt-2">{label}</p>
  </div>
);

const DetailRow: React.FC<{
  label: string;
  value: string;
  badge?: string;
}> = ({ label, value, badge }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-500">{label}</span>
    {badge ? (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badge}`}>{value}</span>
    ) : (
      <span className="text-sm font-medium text-gray-800">{value}</span>
    )}
  </div>
);

export default HealthRecords;