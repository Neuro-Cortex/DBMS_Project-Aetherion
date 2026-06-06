import { getAuthToken } from '../../services/api';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search, UserCheck,
   Trash2, Eye,  MessageSquare, } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Input } from 'src/ui/Input';

const mockPatients = [
  { id: 1, name: 'Rahima Khatun', age: 32, gender: 'Female', bloodGroup: 'A+', doctor: 'Dr. Sarah Johnson', status: 'active', treatment: 'Ongoing', lastVisit: '2 days ago', emergency: false, phone: '+880-17XX-XXXXXX', area: 'Dhaka' },
  { id: 2, name: 'Mohammad Ali', age: 45, gender: 'Male', bloodGroup: 'O-', doctor: 'Dr. Michael Chen', status: 'active', treatment: 'Completed', lastVisit: '1 week ago', emergency: false, phone: '+880-18XX-XXXXXX', area: 'Chattogram' },
  { id: 3, name: 'Fatima Begum', age: 28, gender: 'Female', bloodGroup: 'B+', doctor: 'Dr. Sarah Johnson', status: 'active', treatment: 'Follow-up', lastVisit: '3 days ago', emergency: true, phone: '+880-19XX-XXXXXX', area: 'Sylhet' },
  { id: 4, name: 'Abdul Karim', age: 55, gender: 'Male', bloodGroup: 'AB+', doctor: 'Dr. James Lee', status: 'suspended', treatment: 'None', lastVisit: '1 month ago', emergency: false, phone: '+880-16XX-XXXXXX', area: 'Rajshahi' },
  { id: 5, name: 'Jahanara Begum', age: 35, gender: 'Female', bloodGroup: 'O+', doctor: 'Dr. Emily White', status: 'active', treatment: 'Ongoing', lastVisit: '1 day ago', emergency: false, phone: '+880-15XX-XXXXXX', area: 'Khulna' },
  { id: 6, name: 'Shahidul Islam', age: 60, gender: 'Male', bloodGroup: 'A-', doctor: 'Not Assigned', status: 'pending', treatment: 'New', lastVisit: 'Never', emergency: false, phone: '+880-14XX-XXXXXX', area: 'Barishal' },
];

const PatientManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [patients, setPatients] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/admin/patients`,
          { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        const data = await res.json();
        setPatients(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch patients:', err);
        setPatients([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = patients.filter(p => {
    const name = p.full_name || '';
    const matchesSearch = name.toLowerCase().includes(searchTerm.toLowerCase()) || (p.email || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'active' ? p.is_active : !p.is_active);
    return matchesSearch && matchesStatus;
  });

  const activePatients = patients.filter(p => p.is_active);
  const emergencyPatients: any[] = [];

  return (
    <div className="min-h-screen bg-[#020408] flex">
      <AdminSidebar />
      <div className="flex-1 min-w-0">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
                  <UserCheck className="w-8 h-8 text-cyan-400" /> Patient Management
                </h1>
                <p className="text-slate-400 text-sm mt-1">Monitor, verify & manage all patients</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4 border-l-4 border-l-blue-500">
                <p className="text-2xl font-black text-white">{patients.length}</p>
                <p className="text-xs text-slate-400">Total Patients</p>
              </Card>
              <Card className="p-4 border-l-4 border-l-emerald-500">
                <p className="text-2xl font-black text-white">{activePatients.length}</p>
                <p className="text-xs text-slate-400">Active</p>
              </Card>
              <Card className="p-4 border-l-4 border-l-red-500">
                <p className="text-2xl font-black text-white">{emergencyPatients.length}</p>
                <p className="text-xs text-slate-400">Emergency Detected</p>
              </Card>
              <Card className="p-4 border-l-4 border-l-amber-500">
                <p className="text-2xl font-black text-white">{patients.filter(p => !p.is_active).length}</p>
                <p className="text-xs text-slate-400">Inactive</p>
              </Card>
            </div>

            <GlassmorphicCard className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <Input
                    placeholder="Search patients by name or doctor..."
                    leftIcon={Search}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  {['all', 'active', 'pending', 'suspended'].map(status => (
                    <Button
                      key={status}
                      variant={statusFilter === status ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setStatusFilter(status)}
                      className={statusFilter === status ? 'bg-cyan-500' : 'text-slate-400'}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs text-slate-500 uppercase tracking-wider">
                      <th className="pb-3 px-2">Patient</th>
                      <th className="pb-3 px-2">Doctor</th>
                      <th className="pb-3 px-2">Status</th>
                      <th className="pb-3 px-2">Treatment</th>
                      <th className="pb-3 px-2">Last Visit</th>
                      <th className="pb-3 px-2">Area</th>
                      <th className="pb-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map((patient: any, i: number) => (
                      <motion.tr
                        key={patient.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="border-t border-white/[0.04] hover:bg-white/[0.02] transition-all"
                      >
                        <td className="py-3 px-2">
                          <div className="flex items-center gap-3">
                            <Avatar name={(patient.full_name || '').split(' ').map((n: string) => n[0]).join('')} size="sm" />
                            <div>
                              <p className="text-white text-sm font-bold">{patient.full_name || 'Unknown'}</p>
                              <p className="text-xs text-slate-500">{patient.blood_group || 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <p className="text-white text-sm">{patient.email || 'N/A'}</p>
                        </td>
                        <td className="py-3 px-2">
                          <Badge
                            variant={patient.is_active ? 'success' : 'danger'}
                            className="text-[10px]"
                          >
                            {patient.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </td>
                        <td className="py-3 px-2">
                          <p className="text-white text-sm">{patient.is_verified ? 'Verified' : 'Unverified'}</p>
                        </td>
                        <td className="py-3 px-2">
                          <p className="text-slate-400 text-sm">{patient.created_at ? new Date(patient.created_at).toLocaleDateString() : 'N/A'}</p>
                        </td>
                        <td className="py-3 px-2">
                          <p className="text-slate-400 text-sm">{patient.phone || 'N/A'}</p>
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex gap-1">
                            <Button variant="ghost" size="xs" className="text-cyan-400"><Eye className="w-3 h-3" /></Button>
                            <Button variant="ghost" size="xs" className="text-amber-400"><MessageSquare className="w-3 h-3" /></Button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassmorphicCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PatientManagement;