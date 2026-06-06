// src/pages/client/MedicalReports.tsx
// PROFESSIONAL MEDICAL REPORTS PAGE - SIDEBAR REMOVED
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText, Upload, Download, Search,
  Calendar, Trash2, Eye, X, Activity,
  Stethoscope, Clock, CheckCircle2,
  AlertCircle, FileUp, FileType,
  Image, Printer, Share2,
  ChevronRight,
} from 'lucide-react';

// ============================================
// UI COMPONENTS
// ============================================
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Modal } from 'src/ui/Modal';

// ============================================
// TYPES
// ============================================
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
  fileName?: string;
}

interface ReportStats {
  total: number;
  normal: number;
  abnormal: number;
  pending: number;
  labReports: number;
  imagingReports: number;
}

// ============================================
// MOCK DATA
// ============================================
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
    notes: 'All values within normal range. Hemoglobin slightly elevated at 15.2 g/dL.',
    status: 'normal',
    fileName: 'cbc-report-nov-2024.pdf',
  },
  {
    id: '2',
    title: 'Chest X-Ray (PA View)',
    type: 'imaging',
    date: '2024-10-20',
    doctor: 'Dr. Michael Chen',
    hospital: 'Metro Medical Center',
    fileUrl: '/reports/chest-xray-2024.pdf',
    fileSize: '5.1 MB',
    notes: 'Clear lung fields. No pleural effusion or pneumothorax. Cardiac silhouette normal.',
    status: 'normal',
    fileName: 'chest-xray-oct-2024.pdf',
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
    notes: 'LDL cholesterol: 145 mg/dL (elevated). HDL: 45 mg/dL. Dietary and exercise recommendations provided.',
    status: 'abnormal',
    fileName: 'lipid-panel-oct-2024.pdf',
  },
  {
    id: '4',
    title: 'ECG Report (12-Lead)',
    type: 'imaging',
    date: '2024-09-28',
    doctor: 'Dr. Robert Wilson',
    hospital: 'Apex Hospital',
    fileUrl: '/reports/ecg-2024.pdf',
    fileSize: '3.2 MB',
    notes: 'Normal sinus rhythm at 72 bpm. No ST-T wave abnormalities. QTc interval within normal limits.',
    status: 'normal',
    fileName: 'ecg-sep-2024.pdf',
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
    notes: 'ALT: 28 U/L, AST: 32 U/L, ALP: 65 U/L. All enzymes within normal limits.',
    status: 'normal',
    fileName: 'lft-sep-2024.pdf',
  },
  {
    id: '6',
    title: 'MRI Brain (with Contrast)',
    type: 'imaging',
    date: '2024-08-15',
    doctor: 'Dr. Michael Chen',
    hospital: 'Metro Medical Center',
    fileUrl: '/reports/mri-brain-2024.pdf',
    fileSize: '8.7 MB',
    notes: 'No intracranial mass, hemorrhage or infarction. Ventricular system normal. Normal study.',
    status: 'normal',
    fileName: 'mri-brain-aug-2024.pdf',
  },
];

// ============================================
// CONFIGURATIONS
// ============================================
const typeConfig: Record<string, { icon: React.ElementType; label: string; bg: string; text: string; border: string }> = {
  lab: { icon: Activity, label: 'Lab Report', bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20' },
  imaging: { icon: Image, label: 'Imaging', bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20' },
  prescription: { icon: FileText, label: 'Prescription', bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20' },
  discharge: { icon: FileText, label: 'Discharge', bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
  other: { icon: FileText, label: 'Other', bg: 'bg-slate-500/10', text: 'text-slate-400', border: 'border-slate-500/20' },
};

const statusConfig: Record<string, { icon: React.ElementType; bg: string; text: string }> = {
  normal: { icon: CheckCircle2, bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  abnormal: { icon: AlertCircle, bg: 'bg-red-500/10', text: 'text-red-400' },
  pending: { icon: Clock, bg: 'bg-amber-500/10', text: 'text-amber-400' },
};

// ============================================
// REPORT DETAIL MODAL
// ============================================
const ReportDetailModal: React.FC<{
  report: MedicalReport;
  onClose: () => void;
}> = ({ report, onClose }) => {
  const typeStyle = typeConfig[report.type];
  const statusStyle = statusConfig[report.status];
  const TypeIcon = typeStyle.icon;
  const StatusIcon = statusStyle.icon;

  return (
    <Modal isOpen={true} onClose={onClose} title={report.title}>
      <div className="space-y-5 p-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={`${typeStyle.bg} ${typeStyle.text} ${typeStyle.border}`}>
            <TypeIcon className="w-3.5 h-3.5 mr-1.5" />
            {typeStyle.label}
          </Badge>
          <Badge className={`${statusStyle.bg} ${statusStyle.text}`}>
            <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Date</label>
            <p className="text-white text-sm font-bold flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              {report.date}
            </p>
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1 block">File Size</label>
            <p className="text-white text-sm font-bold">{report.fileSize}</p>
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Doctor</label>
            <p className="text-white text-sm font-bold flex items-center gap-1.5">
              <Stethoscope className="w-3.5 h-3.5 text-cyan-400" />
              {report.doctor}
            </p>
          </div>
          <div>
            <label className="text-slate-400 text-xs mb-1 block">Hospital</label>
            <p className="text-white text-sm font-bold">{report.hospital}</p>
          </div>
        </div>

        <div>
          <label className="text-slate-400 text-xs mb-2 block">Clinical Notes</label>
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
            <p className="text-slate-300 text-sm leading-relaxed">{report.notes}</p>
          </div>
        </div>

        {report.fileName && (
          <div>
            <label className="text-slate-400 text-xs mb-1 block">File Name</label>
            <p className="text-white text-sm font-mono">{report.fileName}</p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
          <Button variant="primary" className="bg-gradient-to-r from-emerald-500 to-teal-500">
            <Eye className="w-4 h-4 mr-2" /> View Report
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" /> Download
          </Button>
          <Button variant="ghost">
            <Printer className="w-4 h-4 mr-2" /> Print
          </Button>
          <Button variant="ghost" className="ml-auto">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================
// UPLOAD MODAL
// ============================================
const UploadModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setUploadComplete(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    setIsUploading(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setIsUploading(false);
        setUploadComplete(true);
      }
      setUploadProgress(Math.min(progress, 100));
    }, 300);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Medical Report">
      <div className="space-y-5 p-2">
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all cursor-pointer ${
            isDragging
              ? 'border-emerald-400/50 bg-emerald-500/5'
              : selectedFile
              ? 'border-emerald-500/30 bg-emerald-500/5'
              : 'border-white/[0.08] hover:border-emerald-400/30'
          }`}
        >
          {selectedFile ? (
            <div>
              <FileType className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-white font-bold text-sm">{selectedFile.name}</p>
              <p className="text-slate-400 text-xs mt-1">{formatFileSize(selectedFile.size)}</p>
            </div>
          ) : (
            <div>
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                <FileUp className="w-8 h-8 text-emerald-400" />
              </div>
              <p className="text-white font-bold text-sm">Click to upload or drag and drop</p>
              <p className="text-slate-400 text-xs mt-2">PDF, JPG, PNG, DICOM up to 25MB</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.dcm"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
            className="hidden"
          />
        </div>

        {isUploading && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400 text-sm">Uploading...</span>
              <span className="text-emerald-400 text-sm font-bold">{Math.round(uploadProgress)}%</span>
            </div>
            <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${uploadProgress}%` }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"
              />
            </div>
          </div>
        )}

        {uploadComplete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <p className="text-emerald-400 font-bold text-sm">Upload Complete!</p>
              <p className="text-slate-400 text-xs">Your report has been uploaded successfully.</p>
            </div>
          </motion.div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>
            {uploadComplete ? 'Close' : 'Cancel'}
          </Button>
          {!uploadComplete && (
            <Button
              variant="primary"
              className="bg-gradient-to-r from-emerald-500 to-teal-500"
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
            >
              <Upload className="w-4 h-4 mr-2" /> Upload Report
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

// ============================================
// MAIN MEDICAL REPORTS PAGE
// ============================================
const ClientMedicalReports: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState<MedicalReport | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'lab' | 'imaging' | 'other'>('all');

  const filteredReports = reports.filter(report => {
    const matchSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.hospital.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === 'all' ? true : report.type === typeFilter;
    const matchStatus = statusFilter === 'all' ? true : report.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const stats: ReportStats = {
    total: reports.length,
    normal: reports.filter(r => r.status === 'normal').length,
    abnormal: reports.filter(r => r.status === 'abnormal').length,
    pending: reports.filter(r => r.status === 'pending').length,
    labReports: reports.filter(r => r.type === 'lab').length,
    imagingReports: reports.filter(r => r.type === 'imaging').length,
  };

  const tabFilters = [
    { id: 'all' as const, label: 'All Reports', count: stats.total },
    { id: 'lab' as const, label: 'Lab Reports', count: stats.labReports },
    { id: 'imaging' as const, label: 'Imaging', count: stats.imagingReports },
    { id: 'other' as const, label: 'Other', count: stats.total - stats.labReports - stats.imagingReports },
  ];

  return (
    <div className="min-h-screen bg-[#020408] p-4 lg:p-8">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            Medical Reports
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Upload, view and manage your medical reports
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="info" className="text-xs">
            <FileText className="w-3.5 h-3.5 mr-1.5" />
            {stats.total} Reports
          </Badge>
          <Button
            variant="primary"
            className="bg-gradient-to-r from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20"
            onClick={() => setShowUpload(true)}
          >
            <Upload className="w-4 h-4 mr-2" /> Upload Report
          </Button>
        </div>
      </motion.div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total Reports', value: stats.total, icon: FileText, color: 'cyan' },
          { label: 'Normal', value: stats.normal, icon: CheckCircle2, color: 'emerald' },
          { label: 'Abnormal', value: stats.abnormal, icon: AlertCircle, color: 'red' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'amber' },
        ].map((stat, index) => {
          const Icon = stat.icon;
          const colorMap: Record<string, string> = {
            cyan: 'bg-cyan-500/10 text-cyan-400',
            emerald: 'bg-emerald-500/10 text-emerald-400',
            red: 'bg-red-500/10 text-red-400',
            amber: 'bg-amber-500/10 text-amber-400',
          };
          const colorClass = colorMap[stat.color];
          const [bg, text] = colorClass.split(' ');

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Card className="p-4 cursor-default">
                <div className={`inline-flex p-2.5 rounded-xl ${bg} mb-3`}>
                  <Icon className={`w-5 h-5 ${text}`} />
                </div>
                <p className={`text-2xl font-black ${text}`}>{stat.value}</p>
                <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* TABS + FILTERS */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabFilters.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setActiveTab(tab.id);
                setTypeFilter(tab.id === 'all' ? 'all' : tab.id);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-white/[0.02] text-slate-400 border border-white/[0.06] hover:text-white'
              }`}
            >
              {tab.label}
              <Badge variant="outline" className="text-[10px]">{tab.count}</Badge>
            </motion.button>
          ))}
        </div>

        <div className="relative flex-1 w-full sm:w-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search reports, doctors, hospitals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-emerald-500/30 transition-all"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-slate-400 text-sm focus:outline-none focus:border-emerald-500/30 cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="normal">Normal</option>
          <option value="abnormal">Abnormal</option>
          <option value="pending">Pending</option>
        </select>

        {(searchTerm || statusFilter !== 'all' || typeFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setTypeFilter('all');
              setActiveTab('all');
            }}
            className="p-2 rounded-lg text-slate-400 hover:text-white transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* REPORTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {filteredReports.map((report, index) => {
            const typeStyle = typeConfig[report.type];
            const statusStyle = statusConfig[report.status];
            const TypeIcon = typeStyle.icon;
            const StatusIcon = statusStyle.icon;

            return (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -2 }}
                onClick={() => setSelectedReport(report)}
              >
                <GlassmorphicCard className="p-5 cursor-pointer group border-white/[0.06] hover:border-emerald-500/20">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${typeStyle.bg} ${typeStyle.border}`}>
                      <TypeIcon className={`w-6 h-6 ${typeStyle.text}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h4 className="text-white font-bold text-sm group-hover:text-emerald-400 transition-colors truncate">
                          {report.title}
                        </h4>
                        <Badge className={`${statusStyle.bg} ${statusStyle.text} text-[10px] flex-shrink-0`}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {report.status}
                        </Badge>
                      </div>

                      <p className="text-slate-500 text-xs mb-2">{report.hospital}</p>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {report.date}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5" />
                          {report.doctor}
                        </span>
                        <span className="text-slate-600">•</span>
                        <span>{report.fileSize}</span>
                      </div>

                      <p className="text-slate-600 text-xs mt-2 line-clamp-1">{report.notes}</p>
                    </div>

                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-emerald-400 transition-colors" />
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.04] opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Button variant="outline" size="xs" className="text-emerald-400 border-emerald-500/20">
                      <Eye className="w-3.5 h-3.5 mr-1.5" /> View
                    </Button>
                    <Button variant="outline" size="xs" className="text-slate-400">
                      <Download className="w-3.5 h-3.5 mr-1.5" /> Download
                    </Button>
                    <Button variant="outline" size="xs" className="text-slate-400">
                      <Printer className="w-3.5 h-3.5 mr-1.5" /> Print
                    </Button>
                    <Button variant="ghost" size="xs" className="text-red-400 hover:text-red-300 ml-auto">
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </GlassmorphicCard>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredReports.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="col-span-2 text-center py-16"
          >
            <FileText className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-bold">No reports found</p>
            <p className="text-slate-600 text-sm mt-1">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? 'Try adjusting your search or filters'
                : 'Upload your first medical report to get started'}
            </p>
            {!searchTerm && statusFilter === 'all' && typeFilter === 'all' && (
              <Button
                variant="primary"
                className="mt-4 bg-gradient-to-r from-emerald-500 to-teal-500"
                onClick={() => setShowUpload(true)}
              >
                <Upload className="w-4 h-4 mr-2" /> Upload Report
              </Button>
            )}
          </motion.div>
        )}
      </div>

      {/* MODALS */}
      <AnimatePresence>
        {selectedReport && (
          <ReportDetailModal
            report={selectedReport}
            onClose={() => setSelectedReport(null)}
          />
        )}
      </AnimatePresence>

      <UploadModal
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
      />
    </div>
  );
};

export default ClientMedicalReports;