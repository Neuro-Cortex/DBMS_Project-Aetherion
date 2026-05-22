// src/pages/AdminPanel.tsx

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Building2, Pill, Activity, Settings, Shield, TrendingUp, Search,
  Plus, Edit2, Trash2, Eye, Download, Filter,
  Server, Database, RefreshCw,
  BarChart3, PieChart, Calendar, Clock, UserPlus
} from 'lucide-react';

import { GlassmorphicCard } from 'src/pages/GlassmorphicCard';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { StatCard } from '../components/dashboard/statCard';
import { Modal } from '../components/ui/Modal';

// ================= TYPES =================

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'doctor' | 'patient' | 'staff';
  status: 'active' | 'inactive' | 'pending';
  lastActive: string | null;
  createdAt: string;
}

// ================= MOCK DATA =================

const usersData: User[] = [
  { id: '1', name: 'Dr. Sarah Wilson', email: 'sarah@hospital.com', role: 'doctor', status: 'active', lastActive: '2024-03-15T10:30:00', createdAt: '2023-01-15' },
  { id: '2', name: 'John Doe', email: 'john@mail.com', role: 'patient', status: 'active', lastActive: '2024-03-14T15:45:00', createdAt: '2023-02-20' },
  { id: '3', name: 'Admin User', email: 'admin@system.com', role: 'admin', status: 'active', lastActive: '2024-03-15T09:00:00', createdAt: '2022-12-01' },
];

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const filteredUsers = usersData.filter(u =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-gray-500/20 text-gray-400';
      case 'pending': return 'bg-yellow-500/20 text-yellow-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-white font-bold">Admin Panel</h1>
        <Button variant="gradient" icon={RefreshCw}>Refresh</Button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Users" value="5230" icon={Users} variant="glass" color="cyan" trend="up" change="+12%" />
        <StatCard title="Hospitals" value="125" icon={Building2} variant="glass" color="blue" trend="up" change="+5%" />
        <StatCard title="Revenue" value="$45K" icon={TrendingUp} variant="glass" color="pink" trend="up" change="+18%" />
      </div>

      {/* TAB */}
      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveTab('users')} className="px-4 py-2 bg-white/10 text-white rounded-lg">Users</button>
        <button onClick={() => setActiveTab('system')} className="px-4 py-2 bg-white/10 text-white rounded-lg">System</button>
      </div>

      












            





                   {/* USERS TABLE */}
{activeTab === 'users' && (
  <GlassmorphicCard variant="glass">




    <div className="p-4 flex justify-between">
      
      {/* ❌ removed variant */}
      
         
           <Input
    placeholder="Search users..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
  />




    <Button
    variant="gradient"
    icon={Plus}
    onClick={() => setIsAddUserModalOpen(true)}
  >
       
       
       
        Add User
      </Button>
    </div>

    <table className="w-full text-white">
      <thead>
        <tr>
          <th className="p-3">Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        {filteredUsers.map((user) => (
          <tr key={user.id} className="border-t border-white/10">
            <td className="p-3">{user.name}</td>
            <td>{user.email}</td>

            {/* FIXED BADGE */}
            <td>
              <Badge variant="default">
                {user.role}
              </Badge>
            </td>

            <td>
              <Badge className={getStatusColor(user.status)}>
                {user.status}
              </Badge>
            </td>

            {/* FIXED ACTION CELL */}
            <td>
              <div className="flex gap-2 p-2">
                <Button size="xs" variant="ghost" icon={Eye} />
                <Button size="xs" variant="ghost" icon={Edit2} />
                <Button size="xs" variant="ghost" icon={Trash2} />
              </div>
            </td>

          </tr>
        ))}
      </tbody>
    </table>
  </GlassmorphicCard>
)}














      {/* MODAL */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Add User"
      >
        <div className="space-y-3">
          <Input label="Name" />
          <Input label="Email" />
          <Button variant="gradient" fullWidth>
            Save
          </Button>
        </div>
      </Modal>

    </div>
  );
};

export default AdminPanel;