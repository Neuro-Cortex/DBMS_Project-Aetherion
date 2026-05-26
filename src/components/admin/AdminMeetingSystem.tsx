import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar, Clock, Video,
  Search, 
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Input } from 'src/ui/Input';

const mockMeetings = [
  { id: 1, with: 'Dr. Sarah Johnson', role: 'doctor', subject: 'Platform Feature Discussion', date: '2026-05-27', time: '10:00 AM', duration: '30 min', status: 'scheduled', type: 'video' },
  { id: 2, with: 'MediPlus Pharmacy', role: 'pharmacy', subject: 'New Partnership Proposal', date: '2026-05-28', time: '2:00 PM', duration: '45 min', status: 'scheduled', type: 'video' },
  { id: 3, with: 'Rahima Khatun', role: 'patient', subject: 'Complaint Resolution', date: '2026-05-25', time: '11:00 AM', duration: '20 min', status: 'completed', type: 'phone' },
  { id: 4, with: 'City General Hospital', role: 'hospital', subject: 'Integration Update', date: '2026-05-29', time: '3:30 PM', duration: '60 min', status: 'pending', type: 'video' },
  { id: 5, with: 'Dr. Michael Chen', role: 'doctor', subject: 'Performance Review', date: '2026-05-24', time: '9:00 AM', duration: '30 min', status: 'completed', type: 'video' },
];

const AdminMeetingSystem: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filtered = mockMeetings.filter(m => {
    const matchSearch = m.with.toLowerCase().includes(searchTerm.toLowerCase()) || m.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === 'all' || m.status === filterStatus;
    return matchSearch && matchStatus;
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
                  <Video className="w-8 h-8 text-cyan-400" /> Admin Meetings
                </h1>
                <p className="text-slate-400 text-sm mt-1">Schedule, approve & manage meetings with users</p>
              </div>
              <Button variant="primary" className="bg-cyan-500"><Calendar className="w-4 h-4 mr-2" /> Schedule Meeting</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <Card className="p-4"><p className="text-2xl font-black text-white">{mockMeetings.length}</p><p className="text-xs text-slate-400">Total Meetings</p></Card>
              <Card className="p-4"><p className="text-2xl font-black text-white">{mockMeetings.filter(m => m.status === 'scheduled').length}</p><p className="text-xs text-slate-400">Scheduled</p></Card>
              <Card className="p-4"><p className="text-2xl font-black text-white">{mockMeetings.filter(m => m.status === 'completed').length}</p><p className="text-xs text-slate-400">Completed</p></Card>
              <Card className="p-4"><p className="text-2xl font-black text-white">{mockMeetings.filter(m => m.status === 'pending').length}</p><p className="text-xs text-slate-400">Pending Approval</p></Card>
            </div>

            <GlassmorphicCard className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Input placeholder="Search meetings..." leftIcon={Search} value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} className="flex-1" />
                <div className="flex gap-2">
                  {['all', 'scheduled', 'completed', 'pending'].map(status => (
                    <Button key={status} variant={filterStatus === status ? 'primary' : 'ghost'} size="sm"
                      onClick={() => setFilterStatus(status)} className={filterStatus === status ? 'bg-cyan-500' : 'text-slate-400'}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {filtered.map((meeting, i) => (
                  <motion.div key={meeting.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar name={meeting.with.split(' ').map(n => n[0]).join('')} size="md" />
                        <div>
                          <h4 className="text-white font-bold text-sm">{meeting.with}</h4>
                          <p className="text-xs text-slate-400">{meeting.subject}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {meeting.date}</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {meeting.time}</span>
                            <span>{meeting.duration}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={meeting.type === 'video' ? 'info' : 'default'} className="text-[10px]">{meeting.type}</Badge>
                        <Badge variant={meeting.status === 'completed' ? 'success' : meeting.status === 'scheduled' ? 'info' : 'warning'} className="text-[10px]">{meeting.status}</Badge>
                        {meeting.status === 'scheduled' && (
                          <Button variant="primary" size="xs" className="bg-emerald-500"><Video className="w-3 h-3 mr-1" /> Join</Button>
                        )}
                        {meeting.status === 'pending' && (
                          <div className="flex gap-1">
                            <Button variant="primary" size="xs" className="bg-emerald-500 text-[10px]">Approve</Button>
                            <Button variant="danger" size="xs" className="text-[10px]">Reject</Button>
                          </div>
                        )}
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

export default AdminMeetingSystem;