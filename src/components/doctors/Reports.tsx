// src/pages/Doctor/Reports.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Search, Microscope, Eye,  } from 'lucide-react';






import { Card } from 'src/ui/Card';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Input } from 'src/ui/Input';





interface LabReport {
  id: string; patientName: string; type: string; date: string;
  result: string; status: 'normal' | 'abnormal' | 'critical'; fileType: string;
}

const reports: LabReport[] = [
  { id: '1', patientName: 'Rafiqul Islam', type: 'ECG', date: '2026-05-22', result: 'ST segment depression', status: 'abnormal', fileType: 'PDF' },
  { id: '2', patientName: 'Nasrin Sultana', type: 'Ultrasound', date: '2026-05-20', result: 'Normal fetal growth', status: 'normal', fileType: 'Image' },
  { id: '3', patientName: 'Kamal Hossain', type: 'Blood Sugar', date: '2026-05-19', result: 'Fasting: 180 mg/dL', status: 'critical', fileType: 'PDF' },
  { id: '4', patientName: 'Rahima Khatun', type: 'Blood Test', date: '2026-05-21', result: 'Cholesterol borderline high', status: 'abnormal', fileType: 'PDF' },
  { id: '5', patientName: 'Sharmin Akter', type: 'TSH', date: '2026-04-08', result: '3.2 mIU/L', status: 'normal', fileType: 'PDF' },
];

const Reports: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = reports.filter(r => r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || r.type.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#030508]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white flex items-center gap-3"><Microscope className="w-8 h-8 text-teal-400" /> Medical Reports</h1>
          <p className="text-slate-400 text-sm mt-1">{reports.length} reports available</p>
        </motion.div>

        <div className="grid grid-cols-3 gap-4">
          {[{ label: 'Total Reports', value: reports.length, color: 'blue' },{ label: 'Normal', value: reports.filter(r=>r.status==='normal').length, color: 'emerald' },{ label: 'Abnormal/Critical', value: reports.filter(r=>r.status!=='normal').length, color: 'red' }].map((s,i)=>(<Card key={i} className="p-4 text-center"><p className="text-2xl font-black text-white">{s.value}</p><p className="text-xs text-slate-400">{s.label}</p></Card>))}
        </div>

        <Input placeholder="Search by patient or test type..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} icon={<Search className="w-5 h-5" />} />

        <div className="space-y-3">
          {filtered.map((report) => (
            <Card key={report.id} className="p-4 flex items-center gap-4 hover:border-teal-500/20 transition-all cursor-pointer">
              <FileText className="w-6 h-6 text-cyan-400" />
              <div className="flex-1">
                <h4 className="text-white font-bold">{report.type} - {report.patientName}</h4>
                <p className="text-xs text-slate-500">{report.date} • {report.result}</p>
              </div>
              <Badge variant={report.status === 'normal' ? 'success' : report.status === 'abnormal' ? 'warning' : 'danger'} className="text-[10px]">{report.status}</Badge>
              <Button variant="ghost" size="xs"><Eye className="w-4 h-4 mr-1" /> View</Button>
              <Button variant="ghost" size="xs"><Download className="w-4 h-4" /></Button>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports;