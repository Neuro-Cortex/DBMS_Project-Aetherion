// src/pages/client/HealthRecords.tsx
// DARK THEME HEALTH RECORDS PAGE

import React, { useState, useEffect } from 'react';
import {
  FileText, Heart, Pill, Syringe,
  Calendar, Download,  Search,X,
   ChevronRight,
  
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
      case 'report': return <FileText className="w-5 h-5 text-purple-400" />;
      case 'prescription': return <Pill className="w-5 h-5 text-green-400" />;
      case 'vaccine': return <Syringe className="w-5 h-5 text-blue-400" />;
      case 'vitals': return <Heart className="w-5 h-5 text-red-400" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeColors = (type: string) => {
    switch(type) {
      case 'report': return { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' };
      case 'prescription': return { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20' };
      case 'vaccine': return { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' };
      case 'vitals': return { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20' };
      default: return { bg: 'bg-gray-500/10', text: 'text-gray-400', border: 'border-gray-500/20' };
    }
  };

  const getStatusColors = (status: string) => {
    switch(status) {
      case 'completed': return { bg: 'bg-emerald-500/10', text: 'text-emerald-400', dot: 'bg-emerald-400' };
      case 'pending': return { bg: 'bg-amber-500/10', text: 'text-amber-400', dot: 'bg-amber-400' };
      case 'active': return { bg: 'bg-cyan-500/10', text: 'text-cyan-400', dot: 'bg-cyan-400' };
      case 'expired': return { bg: 'bg-red-500/10', text: 'text-red-400', dot: 'bg-red-400' };
      default: return { bg: 'bg-gray-500/10', text: 'text-gray-400', dot: 'bg-gray-400' };
    }
  };

  const getResultColors = (result: string) => {
    if (result.includes('normal') || result.includes('Clear')) {
      return { bg: 'bg-emerald-500/5', text: 'text-emerald-400' };
    } else if (result.includes('Pending')) {
      return { bg: 'bg-amber-500/5', text: 'text-amber-400' };
    } else if (result.includes('elevated')) {
      return { bg: 'bg-amber-500/5', text: 'text-amber-300' };
    }
    return { bg: 'bg-cyan-500/5', text: 'text-cyan-400' };
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
      <div className="min-h-screen bg-[#020408] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-cyan-400 mx-auto"></div>
          <p className="mt-3 text-slate-400 text-sm">Loading records...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020408]">
      {/* Fixed background pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)', backgroundSize: '50px 50px' }} />
      
      <div className="relative max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-black text-white flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10">
              <FileText className="w-6 h-6 text-cyan-400" />
            </div>
            Health Records
          </h1>
          <p className="text-slate-400 mt-1 text-sm ml-14">All your medical records in one place</p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search records, doctors, hospitals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-3 pl-10 pr-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/30 transition-all"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-1 mb-6 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-white/[0.08] text-slate-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Records List */}
        <div className="space-y-3">
          {filteredRecords.map((record) => {
            const typeColors = getTypeColors(record.type);
            const statusColors = getStatusColors(record.status);
            const resultColors = getResultColors(record.result);
            return (
              <div
                key={record.id}
                onClick={() => setSelectedRecord(record)}
                className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-4 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all cursor-pointer group"
              >
                <div className="flex items-start gap-4">
                  {/* Type Icon */}
                  <div className={`p-2.5 rounded-xl ${typeColors.bg} ${typeColors.border} border group-hover:scale-105 transition-transform`}>
                    {getTypeIcon(record.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3 className="font-bold text-white text-sm truncate">{record.title}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">{record.doctor} • {record.hospital}</p>
                      </div>
                      <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}>
                        {record.status}
                      </span>
                    </div>

                    {/* Bottom Row */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {record.date}
                        </span>
                        <span className="px-2 py-0.5 bg-white/[0.05] rounded-full text-xs text-slate-400">
                          {getTypeLabel(record.type)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {record.fileUrl && (
                          <button className="p-1.5 hover:bg-cyan-500/10 rounded-lg text-cyan-400 transition-colors">
                            <Download className="w-4 h-4" />
                          </button>
                        )}
                        <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>

                    {/* Result Preview */}
                    {record.result && (
                      <p className={`text-xs mt-2 p-2 rounded-xl ${resultColors.bg} ${resultColors.text}`}>
                        {record.result}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredRecords.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-white/[0.03] flex items-center justify-center">
              <FileText className="w-8 h-8 text-slate-600" />
            </div>
            <h3 className="text-lg font-bold text-white">No records found</h3>
            <p className="text-slate-500 text-sm mt-1">
              {searchTerm ? 'Try a different search term' : 'No records in this category'}
            </p>
          </div>
        )}

        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
          <SummaryCard icon={<FileText className="w-5 h-5 text-purple-400" />} label="Total Reports" value={records.filter(r => r.type === 'report').length.toString()} color="purple" />
          <SummaryCard icon={<Pill className="w-5 h-5 text-green-400" />} label="Prescriptions" value={records.filter(r => r.type === 'prescription').length.toString()} color="green" />
          <SummaryCard icon={<Syringe className="w-5 h-5 text-blue-400" />} label="Vaccines" value={records.filter(r => r.type === 'vaccine').length.toString()} color="blue" />
          <SummaryCard icon={<Heart className="w-5 h-5 text-red-400" />} label="Vitals Records" value={records.filter(r => r.type === 'vitals').length.toString()} color="red" />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedRecord(null)}>
          <div className="bg-[#0a0e14] border border-white/[0.08] rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            {/* Close button */}
            <button onClick={() => setSelectedRecord(null)} className="float-right p-1.5 hover:bg-white/[0.05] rounded-lg transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-5">
              <div className={`p-3 rounded-xl ${getTypeColors(selectedRecord.type).bg} ${getTypeColors(selectedRecord.type).border} border`}>
                {getTypeIcon(selectedRecord.type)}
              </div>
              <div>
                <h3 className="font-bold text-white text-lg">{selectedRecord.title}</h3>
                <p className="text-sm text-slate-400">{getTypeLabel(selectedRecord.type)}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 bg-white/[0.02] border border-white/[0.06] rounded-xl p-4">
              <DetailRow label="Date" value={selectedRecord.date} />
              <DetailRow label="Doctor" value={selectedRecord.doctor} />
              <DetailRow label="Hospital" value={selectedRecord.hospital} />
              <DetailRow label="Result" value={selectedRecord.result} />
              <DetailRow 
                label="Status" 
                value={selectedRecord.status} 
                badge={getStatusColors(selectedRecord.status)} 
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              {selectedRecord.fileUrl && (
                <button className="flex-1 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium text-sm hover:shadow-lg hover:shadow-cyan-500/20 transition-all flex items-center justify-center">
                  <Download className="w-4 h-4 mr-2" /> Download
                </button>
              )}
              <button 
                onClick={() => setSelectedRecord(null)}
                className="flex-1 py-2.5 border border-white/[0.1] text-slate-300 rounded-xl text-sm hover:bg-white/[0.05] transition-all"
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
}> = ({ icon, label, value, color }) => {
  const borderColorMap: Record<string, string> = {
    purple: 'border-purple-500/30',
    green: 'border-green-500/30',
    blue: 'border-blue-500/30',
    red: 'border-red-500/30',
  };
  const dotColorMap: Record<string, string> = {
    purple: 'bg-purple-400',
    green: 'bg-green-400',
    blue: 'bg-blue-400',
    red: 'bg-red-400',
  };

  return (
    <div className={`bg-white/[0.02] border border-white/[0.06] border-l-4 ${borderColorMap[color] || 'border-white/10'} rounded-2xl p-4 hover:bg-white/[0.04] transition-all`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`w-2 h-2 rounded-full ${dotColorMap[color] || 'bg-gray-400'}`} />
        {icon}
      </div>
      <p className="text-xs text-slate-500 mb-1">{label}</p>
      <span className="text-2xl font-black text-white">{value}</span>
    </div>
  );
};

const DetailRow: React.FC<{
  label: string;
  value: string;
  badge?: { bg: string; text: string; dot: string };
}> = ({ label, value, badge }) => (
  <div className="flex justify-between items-center py-1">
    <span className="text-sm text-slate-500">{label}</span>
    {badge ? (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>{value}</span>
    ) : (
      <span className="text-sm font-medium text-white text-right ml-4">{value}</span>
    )}
  </div>
);

export default HealthRecords;