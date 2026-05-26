// src/pages/Doctor/Appointments.tsx
import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,  Search, Plus,
  CheckCircle2,
  Video
} from 'lucide-react';



import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Input } from 'src/ui/Input';





interface Appointment {
  id: string; patientName: string; patientAvatar: string;
  type: 'in-person' | 'video' | 'phone'; date: string; time: string;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
  reason: string; priority: 'normal' | 'urgent';
}

const appointments: Appointment[] = [
  { id: '1', patientName: 'Rahima Khatun', patientAvatar: 'RK', type: 'in-person', date: '2026-05-25', time: '10:00 AM', status: 'confirmed', reason: 'Blood pressure checkup', priority: 'normal' },
  { id: '2', patientName: 'Kamal Hossain', patientAvatar: 'KH', type: 'video', date: '2026-05-25', time: '11:30 AM', status: 'pending', reason: 'Diabetes follow-up', priority: 'urgent' },
  { id: '3', patientName: 'Nasrin Sultana', patientAvatar: 'NS', type: 'in-person', date: '2026-05-25', time: '2:00 PM', status: 'confirmed', reason: 'Pregnancy checkup', priority: 'normal' },
  { id: '4', patientName: 'Rafiqul Islam', patientAvatar: 'RI', type: 'phone', date: '2026-05-25', time: '4:00 PM', status: 'confirmed', reason: 'Cardiac review', priority: 'urgent' },
  { id: '5', patientName: 'Sharmin Akter', patientAvatar: 'SA', type: 'in-person', date: '2026-05-26', time: '9:00 AM', status: 'pending', reason: 'PCOS consultation', priority: 'normal' },
  { id: '6', patientName: 'Abdul Karim', patientAvatar: 'AK', type: 'video', date: '2026-05-26', time: '3:00 PM', status: 'confirmed', reason: 'Diabetes review', priority: 'normal' },
];

const Appointments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [, setSelectedAppointment] = useState<Appointment | null>(null);

  const filtered = useMemo(() => {
    let result = [...appointments];
    if (searchQuery) { const q = searchQuery.toLowerCase(); result = result.filter(a => a.patientName.toLowerCase().includes(q) || a.reason.toLowerCase().includes(q)); }
    if (statusFilter !== 'all') result = result.filter(a => a.status === statusFilter);
    return result;
  }, [searchQuery, statusFilter]);

  return (
    <div className="min-h-screen bg-[#030508]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3"><Calendar className="w-8 h-8 text-purple-400" /> Appointments</h1>
            <p className="text-slate-400 text-sm mt-1">{appointments.length} appointments scheduled</p>
          </div>
          <Button variant="primary" className="bg-gradient-to-r from-purple-500 to-pink-500"><Plus className="w-4 h-4 mr-2" /> New Appointment</Button>
        </motion.div>

        <GlassmorphicCard className="p-4">
          <div className="flex flex-col md:flex-row gap-3">
            <Input placeholder="Search patient or reason..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} leftIcon={Search} className="flex-1" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-5 py-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] text-white font-bold text-sm cursor-pointer">
              <option value="all">📋 All Status</option><option value="confirmed">✅ Confirmed</option><option value="pending">⏳ Pending</option><option value="completed">✔️ Completed</option><option value="cancelled">❌ Cancelled</option>
            </select>
          </div>
        </GlassmorphicCard>

        <div className="space-y-3">
          {filtered.map((apt) => (
            <Card key={apt.id} className="p-5 hover:border-purple-500/20 transition-all cursor-pointer" onClick={() => setSelectedAppointment(apt)}>
              <div className="flex items-center gap-4">
                <Avatar name={apt.patientAvatar} size="lg" className="ring-2 ring-white/5" />
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{apt.patientName}</h3>
                  <p className="text-slate-400 text-sm">{apt.reason}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={apt.type === 'video' ? 'info' : apt.type === 'phone' ? 'warning' : 'default'} className="text-[10px]">{apt.type}</Badge>
                    <Badge variant={apt.priority === 'urgent' ? 'danger' : 'info'} className="text-[10px]">{apt.priority}</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold text-lg">{apt.time}</p>
                  <p className="text-slate-500 text-sm">{apt.date}</p>
                  <Badge variant={apt.status === 'confirmed' ? 'success' : apt.status === 'pending' ? 'warning' : 'default'} className="mt-1">{apt.status}</Badge>
                </div>
                <div className="flex gap-2">
                  {apt.status === 'pending' && <Button variant="success" size="xs"><CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Accept</Button>}
                  {apt.type === 'video' && <Button variant="primary" size="xs" className="bg-green-500"><Video className="w-3.5 h-3.5 mr-1" /> Join</Button>}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Appointments;