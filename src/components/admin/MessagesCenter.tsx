import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare, Send, Search, User, Stethoscope, Pill,
  Building2,  Inbox, 
   Trash2, Reply, 
   Users, 
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Input } from 'src/ui/Input';

interface Message {
  id: number;
  from: string;
  role: 'patient' | 'doctor' | 'pharmacy' | 'hospital';
  subject: string;
  preview: string;
  time: string;
  unread: boolean;
  urgent: boolean;
}

const mockMessages: Message[] = [
  { id: 1, from: 'Rahima Khatun', role: 'patient', subject: 'Emergency Help Needed', preview: 'I need immediate medical assistance...', time: '2 min ago', unread: true, urgent: true },
  { id: 2, from: 'Dr. Sarah Johnson', role: 'doctor', subject: 'License Verification', preview: 'I have uploaded my medical documents...', time: '15 min ago', unread: true, urgent: false },
  { id: 3, from: 'MediPlus Pharmacy', role: 'pharmacy', subject: 'Medicine Approval Request', preview: 'We want to add new medicines to our...', time: '30 min ago', unread: false, urgent: false },
  { id: 4, from: 'City General Hospital', role: 'hospital', subject: 'Bed Availability Update', preview: 'We have 5 ICU beds available now...', time: '1 hour ago', unread: true, urgent: false },
  { id: 5, from: 'Mohammad Ali', role: 'patient', subject: 'Appointment Issue', preview: 'I booked an appointment but the doctor...', time: '2 hours ago', unread: false, urgent: false },
  { id: 6, from: 'Dr. Michael Chen', role: 'doctor', subject: 'Patient Referral', preview: 'I am referring a critical patient to...', time: '3 hours ago', unread: true, urgent: true },
];

const MessagesCenter: React.FC = () => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMessages = mockMessages.filter(m => {
    if (filter !== 'all' && m.role !== filter) return false;
    if (searchTerm && !m.from.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const roleIcon = (role: string) => {
    switch(role) {
      case 'patient': return User;
      case 'doctor': return Stethoscope;
      case 'pharmacy': return Pill;
      case 'hospital': return Building2;
      default: return User;
    }
  };

  const roleColor = (role: string) => {
    switch(role) {
      case 'patient': return 'text-blue-400 bg-blue-500/10';
      case 'doctor': return 'text-emerald-400 bg-emerald-500/10';
      case 'pharmacy': return 'text-amber-400 bg-amber-500/10';
      case 'hospital': return 'text-purple-400 bg-purple-500/10';
      default: return 'text-slate-400 bg-slate-500/10';
    }
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
                  <MessageSquare className="w-8 h-8 text-cyan-400" /> Messages
                </h1>
                <p className="text-slate-400 text-sm mt-1">Manage all communications from patients, doctors & pharmacies</p>
              </div>
            </div>

            <div className="flex gap-3 mb-6 flex-wrap">
              {[
                { label: 'All', value: 'all', icon: Inbox },
                { label: 'Patients', value: 'patient', icon: Users },
                { label: 'Doctors', value: 'doctor', icon: Stethoscope },
                { label: 'Pharmacies', value: 'pharmacy', icon: Pill },
                { label: 'Hospitals', value: 'hospital', icon: Building2 },
              ].map(f => {
                const Icon = f.icon;
                return (
                  <Button key={f.value}
                    variant={filter === f.value ? 'primary' : 'ghost'} size="sm"
                    onClick={() => setFilter(f.value)}
                    className={filter === f.value ? 'bg-cyan-500' : 'text-slate-400'}>
                    <Icon className="w-4 h-4 mr-1.5" /> {f.label}
                  </Button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GlassmorphicCard className="p-4 lg:col-span-1">
                <Input placeholder="Search messages..." leftIcon={Search} value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} className="mb-4" />
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredMessages.map((msg) => {
                    const Icon = roleIcon(msg.role);
                    const colorClass = roleColor(msg.role);
                    return (
                      <div key={msg.id}
                        onClick={() => setSelectedMessage(msg)}
                        className={`p-3 rounded-2xl cursor-pointer transition-all ${
                          selectedMessage?.id === msg.id ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-white/[0.02] hover:bg-white/[0.04]'
                        } ${msg.unread ? 'border-l-2 border-l-cyan-500' : ''}`}>
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl ${colorClass}`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-white text-sm font-bold truncate">{msg.from}</h4>
                              <span className="text-xs text-slate-500 shrink-0">{msg.time}</span>
                            </div>
                            <p className="text-xs text-slate-400 truncate">{msg.subject}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="info" className="text-[8px]">{msg.role}</Badge>
                              {msg.urgent && <Badge variant="danger" className="text-[8px]">URGENT</Badge>}
                              {msg.unread && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </GlassmorphicCard>

              <GlassmorphicCard className="p-6 lg:col-span-2">
                {selectedMessage ? (
                  <div>
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <Avatar name={selectedMessage.from.split(' ').map(n => n[0]).join('')} size="md" />
                        <div>
                          <h3 className="text-white font-bold">{selectedMessage.from}</h3>
                          <p className="text-xs text-slate-400">{selectedMessage.role} • {selectedMessage.time}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="xs" className="text-cyan-400"><Reply className="w-4 h-4" /></Button>
                        <Button variant="ghost" size="xs" className="text-red-400"><Trash2 className="w-4 h-4" /></Button>
                      </div>
                    </div>
                    <div className="space-y-4 mb-6">
                      <div>
                        <h4 className="text-lg font-bold text-white">{selectedMessage.subject}</h4>
                        <p className="text-slate-400 mt-2">{selectedMessage.preview}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                        <p className="text-sm text-slate-300">
                          Thank you for contacting the admin panel. We have received your message and will respond shortly.
                          Please provide any additional details that might help us assist you better.
                        </p>
                        <p className="text-xs text-slate-500 mt-2">Admin • Just now</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Type your reply..." className="flex-1" />
                      <Button variant="primary" className="bg-cyan-500"><Send className="w-4 h-4" /></Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-96 text-center">
                    <MessageSquare className="w-16 h-16 text-slate-600 mb-4" />
                    <h3 className="text-white font-bold text-lg">Select a Message</h3>
                    <p className="text-slate-400 text-sm mt-1">Choose a message from the left to view and reply</p>
                  </div>
                )}
              </GlassmorphicCard>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MessagesCenter;