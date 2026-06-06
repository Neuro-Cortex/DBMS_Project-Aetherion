import { getAuthToken } from '../../services/api';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,  CheckCircle, 
  Search, 
  MessageSquare,  Flag, Trash2, Eye,

} from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Input } from 'src/ui/Input';

const mockComplaints = [
  { id: 1, from: 'Rahima Khatun', role: 'patient', against: 'Dr. Sarah Johnson', type: 'doctor', subject: 'Unprofessional Behavior', description: 'Doctor was rude during consultation', priority: 'high', status: 'pending', date: '2 hours ago' },
  { id: 2, from: 'Dr. Michael Chen', role: 'doctor', against: 'MediPlus Pharmacy', type: 'pharmacy', subject: 'Wrong Medicine Delivered', description: 'Patient received incorrect dosage', priority: 'urgent', status: 'investigating', date: '5 hours ago' },
  { id: 3, from: 'City Hospital', role: 'hospital', against: 'Patient Abdullah', type: 'patient', subject: 'False Emergency Claim', description: 'Patient misused emergency service', priority: 'medium', status: 'pending', date: '1 day ago' },
  { id: 4, from: 'HealthCare Pharmacy', role: 'pharmacy', against: 'Competitor Pharmacy', type: 'pharmacy', subject: 'Fraudulent Activity', description: 'Fake medicines being sold', priority: 'urgent', status: 'resolved', date: '2 days ago' },
  { id: 5, from: 'Fatima Begum', role: 'patient', against: 'Dr. James Lee', type: 'doctor', subject: 'Overcharging', description: 'Charged for unnecessary tests', priority: 'high', status: 'pending', date: '3 days ago' },
  { id: 6, from: 'Dr. Emily White', role: 'doctor', against: 'System Admin', type: 'system', subject: 'Technical Issue', description: 'EMR system not saving data', priority: 'low', status: 'resolved', date: '5 days ago' },
];

const ComplaintManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [complaints, setComplaints] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/admin/complaints`,
          { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        const data = await res.json();
        setComplaints(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch complaints:', err);
        setComplaints([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const filteredComplaints = complaints.filter((c: any) => {
    const subject = c.subject || '';
    const userName = c.user_name || '';
    const matchesSearch = subject.toLowerCase().includes(searchTerm.toLowerCase()) || userName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const roleBadge = (role: string) => {
    const colors: Record<string, string> = {
      patient: 'bg-blue-500/10 text-blue-400',
      doctor: 'bg-emerald-500/10 text-emerald-400',
      pharmacy: 'bg-amber-500/10 text-amber-400',
      hospital: 'bg-purple-500/10 text-purple-400',
    };
    return colors[role] || 'bg-slate-500/10 text-slate-400';
  };

  return (
    <div className="min-h-screen bg-[#020408] flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <FileText className="w-8 h-8 text-amber-400" /> Complaint Management
                </h1>
                <p className="text-slate-400 text-sm mt-1">Handle doctor, patient, pharmacy complaints & fraud reports</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 border-l-4 border-l-red-500">
                <p className="text-2xl font-black text-white">{complaints.length}</p>
                <p className="text-xs text-slate-400">Total Complaints</p>
              </Card>
              <Card className="p-4 border-l-4 border-l-amber-500">
                <p className="text-2xl font-black text-white">{complaints.filter((c: any) => c.priority === 'urgent' || c.priority === 'high').length}</p>
                <p className="text-xs text-slate-400">Urgent/High</p>
              </Card>
              <Card className="p-4 border-l-4 border-l-emerald-500">
                <p className="text-2xl font-black text-white">{complaints.filter((c: any) => c.status === 'resolved').length}</p>
                <p className="text-xs text-slate-400">Resolved</p>
              </Card>
              <Card className="p-4 border-l-4 border-l-blue-500">
                <p className="text-2xl font-black text-white">{complaints.filter((c: any) => c.status === 'pending').length}</p>
                <p className="text-xs text-slate-400">Pending</p>
              </Card>
            </div>

            <GlassmorphicCard className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input placeholder="Search complaints..." leftIcon={Search} value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {['all', 'pending', 'investigating', 'resolved'].map(status => (
                    <Button key={status} variant={filterStatus === status ? 'primary' : 'ghost'} size="sm"
                      onClick={() => setFilterStatus(status)}
                      className={filterStatus === status ? 'bg-cyan-500' : 'text-slate-400'}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filteredComplaints.map((complaint: any, i: number) => (
                  <motion.div key={complaint.id || i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:border-cyan-500/20 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl ${roleBadge(complaint.type || 'patient')}`}>
                          <Flag className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="text-white font-bold text-sm">{complaint.subject || 'No Subject'}</h4>
                          <p className="text-xs text-slate-400 mt-0.5">{complaint.message || complaint.description || ''}</p>
                        </div>
                      </div>
                      <Badge variant={complaint.priority === 'urgent' ? 'danger' : complaint.priority === 'high' ? 'warning' : 'info'}
                        className="text-[10px] shrink-0">{complaint.priority || 'medium'}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>From: <span className="text-white">{complaint.user_name || 'Unknown'}</span></span>
                      <Badge variant={complaint.status === 'resolved' ? 'success' : complaint.status === 'investigating' ? 'info' : 'warning'}
                        className="text-[8px]">{complaint.status || 'pending'}</Badge>
                      <span className="ml-auto">{complaint.created_at ? new Date(complaint.created_at).toLocaleDateString() : ''}</span>
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-white/[0.04]">
                      <Button variant="primary" size="xs" className="bg-cyan-500"><Eye className="w-3 h-3 mr-1" /> Review</Button>
                      <Button variant="ghost" size="xs" className="text-emerald-400"><CheckCircle className="w-3 h-3 mr-1" /> Resolve</Button>
                      <Button variant="ghost" size="xs" className="text-amber-400"><MessageSquare className="w-3 h-3 mr-1" /> Contact</Button>
                      <Button variant="ghost" size="xs" className="text-red-400 ml-auto"><Trash2 className="w-3 h-3" /></Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintManager;