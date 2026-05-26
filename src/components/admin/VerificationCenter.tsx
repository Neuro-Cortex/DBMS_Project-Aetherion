import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
   XCircle,  Search, 
   Eye,
  Check, Shield, 
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Input } from 'src/ui/Input';

const mockVerifications = [
  { id: 1, name: 'Dr. Sarah Johnson', type: 'doctor', document: 'Medical License #ML-2024-001', submitted: '2 days ago', status: 'pending', risk: 'low' },
  { id: 2, name: 'MediPlus Pharmacy', type: 'pharmacy', document: 'Pharmacy License #PL-2024-045', submitted: '3 days ago', status: 'pending', risk: 'low' },
  { id: 3, name: 'City General Hospital', type: 'hospital', document: 'Hospital Registration #HR-2024-012', submitted: '1 week ago', status: 'approved', risk: 'low' },
  { id: 4, name: 'Dr. James Lee', type: 'doctor', document: 'Medical License #ML-2024-089', submitted: '5 days ago', status: 'rejected', risk: 'high' },
  { id: 5, name: 'Premium Health Club', type: 'premium', document: 'Premium Membership Application', submitted: '1 day ago', status: 'pending', risk: 'medium' },
  { id: 6, name: 'HealthCare Pharmacy', type: 'pharmacy', document: 'Medicine Import License #MIL-2024-023', submitted: '4 days ago', status: 'pending', risk: 'low' },
];

const VerificationCenter: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus] = useState('all');

  const filtered = mockVerifications.filter(v => {
    const matchSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || v.type === filterType;
    const matchStatus = filterStatus === 'all' || v.status === filterStatus;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="min-h-screen bg-[#020408] flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <Shield className="w-8 h-8 text-emerald-400" /> Verification Center
                </h1>
                <p className="text-slate-400 text-sm mt-1">Approve doctors, pharmacies, licenses & premium memberships</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4"><p className="text-2xl font-black text-white">{mockVerifications.filter(v => v.status === 'pending').length}</p><p className="text-xs text-slate-400">Pending Verifications</p></Card>
              <Card className="p-4"><p className="text-2xl font-black text-white">{mockVerifications.filter(v => v.status === 'approved').length}</p><p className="text-xs text-slate-400">Approved</p></Card>
              <Card className="p-4"><p className="text-2xl font-black text-white">{mockVerifications.filter(v => v.status === 'rejected').length}</p><p className="text-xs text-slate-400">Rejected</p></Card>
              <Card className="p-4"><p className="text-2xl font-black text-white">{mockVerifications.filter(v => v.risk === 'high').length}</p><p className="text-xs text-slate-400">High Risk</p></Card>
            </div>

            <GlassmorphicCard className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Input placeholder="Search..." leftIcon={Search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="flex-1" />
                <div className="flex gap-2 flex-wrap">
                  {['all', 'doctor', 'pharmacy', 'hospital', 'premium'].map(type => (
                    <Button key={type} variant={filterType === type ? 'primary' : 'ghost'} size="sm"
                      onClick={() => setFilterType(type)} className={filterType === type ? 'bg-cyan-500' : 'text-slate-400'}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filtered.map((item, i) => (
                  <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar name={item.name.split(' ').map(n => n[0]).join('')} size="md" />
                        <div>
                          <h4 className="text-white font-bold text-sm">{item.name}</h4>
                          <p className="text-xs text-slate-400">{item.document}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={item.type === 'doctor' ? 'info' : item.type === 'pharmacy' ? 'warning' : item.type === 'hospital' ? 'success' : 'default'} className="text-[10px]">{item.type}</Badge>
                        <Badge variant={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'danger' : 'warning'} className="text-[10px]">{item.status}</Badge>
                        <Badge variant={item.risk === 'high' ? 'danger' : item.risk === 'medium' ? 'warning' : 'info'} className="text-[10px]">{item.risk} risk</Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                      <span className="text-xs text-slate-500">Submitted {item.submitted}</span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="xs" className="text-cyan-400"><Eye className="w-3 h-3 mr-1" /> View Docs</Button>
                        <Button variant="primary" size="xs" className="bg-emerald-500"><Check className="w-3 h-3 mr-1" /> Approve</Button>
                        <Button variant="danger" size="xs"><XCircle className="w-3 h-3 mr-1" /> Reject</Button>
                      </div>
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

export default VerificationCenter;