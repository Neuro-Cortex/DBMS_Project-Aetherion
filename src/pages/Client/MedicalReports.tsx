// src/pages/client/MedicalReports.tsx
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClientSidebar from '../../components/client/ClientSidebar';
import {
  FileText, Upload, Download, Search, Filter,
  Calendar, ChevronRight, Trash2, Eye, Clock,
  Plus, X, CheckCircle2, AlertCircle, Activity,
  Stethoscope, Building2, ArrowRight, Shield
} from 'lucide-react';

interface MedicalReport {
  id: string;
  title: string;
  type: 'lab' | 'imaging' | 'prescription' | 'discharge' | 'other';
  date: string;
  doctor: string;
  hospital: string;
  fileUrl: string;
  fileSize: string;
  notes: string;
  status: 'normal' | 'abnormal' | 'pending';
}

const reports: MedicalReport[] = [
  {
    id: '1',
    title: 'Complete Blood Count (CBC)',
    type: 'lab',
    date: '2024-11-05',
    doctor: 'Dr. Sarah Johnson',
    hospital: 'City General Hospital',
    fileUrl: '/reports/cbc-2024.pdf',
    fileSize: '2.4 MB',
    notes: 'All values within normal range. Hemoglobin slightly elevated.',
    status: 'normal',
  },
  {
    id: '2',
    title: 'Chest X-Ray',
    type: 'imaging',
    date: '2024-10-20',
    doctor: 'Dr. Michael Chen',
    hospital: 'Metro Medical Center',
    fileUrl: '/reports/chest-xray-2024.pdf',
    fileSize: '5.1 MB',
    notes: 'Clear lung fields. No abnormalities detected.',
    status: 'normal',
  },
  {
    id: '3',
    title: 'Lipid Panel',
    type: 'lab',
    date: '2024-10-15',
    doctor: 'Dr. Sarah Johnson',
    hospital: 'City General Hospital',
    fileUrl: '/reports/lipid-2024.pdf',
    fileSize: '1.8 MB',
    notes: 'LDL cholesterol slightly elevated. Dietary recommendations provided.',
    status: 'abnormal',
  },
  {
    id: '4',
    title: 'ECG Report',
    type: 'imaging',
    date: '2024-09-28',
    doctor: 'Dr. Robert Wilson',
    hospital: 'Apex Hospital',
    fileUrl: '/reports/ecg-2024.pdf',
    fileSize: '3.2 MB',
    notes: 'Normal sinus rhythm. No ST-T wave changes.',
    status: 'normal',
  },
  {
    id: '5',
    title: 'Liver Function Test',
    type: 'lab',
    date: '2024-09-10',
    doctor: 'Dr. Emily Davis',
    hospital: 'Sunshine Clinic',
    fileUrl: '/reports/lft-2024.pdf',
    fileSize: '2.1 MB',
    notes: 'All enzymes within normal limits.',
    status: 'normal',
  },
  {
    id: '6',
    title: 'MRI Brain',
    type: 'imaging',
    date: '2024-08-15',
    doctor: 'Dr. Michael Chen',
    hospital: 'Metro Medical Center',
    fileUrl: '/reports/mri-brain-2024.pdf',
    fileSize: '8.7 MB',
    notes: 'No intracranial abnormalities. Normal study.',
    status: 'normal',
  },
];

const ClientMedicalReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredReports = reports.filter(report => {
    const matchSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.doctor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' ? true : report.type === typeFilter;
    const matchStatus = statusFilter === 'all' ? true : report.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadProgress(0);
          setShowUpload(false);
          // Add report to list
        }
      }, 300);
    }
  };

  const typeIcons: Record<string, React.ElementType> = {
    lab: Activity,
    imaging: FileText,
    prescription: FileText,
    discharge: FileText,
    other: FileText,
  };

  const typeColors: Record<string, string> = {
    lab: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    imaging: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    prescription: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    discharge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    other: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };

  return (
    <div className="min-h-screen bg-[#050508]">
      <ClientSidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-emerald-400" />
              Medical Reports
            </h1>
            <p className="text-white/40 text-sm mt-1">
              Upload, view and manage your medical reports ({reports.length} reports)
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowUpload(true)}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold text-sm flex items-center gap-2 hover:shadow-lg hover:shadow-emerald-500/25 transition-all"
          >
            <Upload className="w-4 h-4" />
            Upload Report
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm outline-none focus:border-emerald-400/50 transition-all"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/60 text-sm outline-none"
          >
            <option value="all" className="bg-gray-900">All Types</option>
            <option value="lab" className="bg-gray-900">Lab Reports</option>
            <option value="imaging" className="bg-gray-900">Imaging</option>
            <option value="prescription" className="bg-gray-900">Prescriptions</option>
            <option value="discharge" className="bg-gray-900">Discharge</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white/60 text-sm outline-none"
          >
            <option value="all" className="bg-gray-900">All Status</option>
            <option value="normal" className="bg-gray-900">Normal</option>
            <option value="abnormal" className="bg-gray-900">Abnormal</option>
            <option value="pending" className="bg-gray-900">Pending</option>
          </select>
        </div>

        {/* Upload Modal */}
        <AnimatePresence>
          {showUpload && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="w-full max-w-md p-6 rounded-2xl bg-[#0a0a10] border border-white/[0.08]"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold text-lg">Upload Medical Report</h3>
                  <button
                    onClick={() => setShowUpload(false)}
                    className="p-2 rounded-lg bg-white/[0.03] text-white/40 hover:text-white/70"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/[0.08] rounded-2xl p-12 text-center hover:border-emerald-400/30 transition-all cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-white/20 mx-auto mb-4" />
                  <p className="text-white/60 text-sm font-medium">Click to upload or drag and drop</p>
                  <p className="text-white/30 text-xs mt-1">PDF, JPG, PNG up to 10MB</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>

                {isUploading && (
                  <div className="mt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white/60 text-sm">Uploading...</span>
                      <span className="text-emerald-400 text-sm">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Reports Grid */}
        <div className="grid grid-cols-2 gap-4">
          <AnimatePresence>
            {filteredReports.map((report, index) => {
              const TypeIcon = typeIcons[report.type];
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-emerald-500/20 transition-all cursor-pointer group"
                  onClick={() => setSelectedReport(report)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${typeColors[report.type].split(' ')[0]} flex items-center justify-center`}>
                        <TypeIcon className={`w-6 h-6 ${report.type === 'lab' ? 'text-purple-400' : report.type === 'imaging' ? 'text-blue-400' : 'text-emerald-400'}`} />
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm group-hover:text-emerald-400 transition-colors">
                          {report.title}
                        </h4>
                        <p className="text-white/40 text-xs mt-0.5">{report.hospital}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="flex items-center gap-1 text-white/30 text-[10px]">
                            <Calendar className="w-3 h-3" /> {report.date}
                          </span>
                          <span className="flex items-center gap-1 text-white/30 text-[10px]">
                            <Stethoscope className="w-3 h-3" /> {report.doctor}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-medium ${
                        report.status === 'normal'
                          ? 'bg-emerald-500/10 text-emerald-400'
                          : report.status === 'abnormal'
                          ? 'bg-red-500/10 text-red-400'
                          : 'bg-amber-500/10 text-amber-400'
                      }`}>
                        {report.status}
                      </span>
                      <span className="text-white/20 text-[10px]">{report.fileSize}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all">
                      <Eye className="w-3.5 h-3.5" /> View
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] text-white/40 text-xs font-medium hover:bg-white/[0.06] transition-all">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all ml-auto">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <FileText className="w-16 h-16 text-white/10 mx-auto mb-4" />
            <p className="text-white/30 text-lg">No reports found</p>
            <p className="text-white/20 text-sm mt-1">Upload your first medical report</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ClientMedicalReports;