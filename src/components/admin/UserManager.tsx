// src/components/admin/UserManager.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Filter, MoreVertical, Edit3,
  Trash2, UserCheck, UserX, Eye, Download,
  ChevronDown, AlertCircle, CheckCircle, XCircle,
  Shield, UserPlus, Mail, Phone, Calendar, Activity
} from 'lucide-react';
import { User } from '../../types/admin';

interface UserManagerProps {
  onViewUser: (userId: string) => void;
  onEditUser: (userId: string) => void;
  onBlockUser: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
}

export const UserManager: React.FC<UserManagerProps> = ({
  onViewUser,
  onEditUser,
  onBlockUser,
  onDeleteUser
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  const fetchUsers = async () => {
    setIsLoading(true);
    const mockUsers: User[] = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: 'john@email.com',
          phone: '+1 (555) 123-4567',
          role: 'client',
          status: 'active',
          isVerified: true,
          registeredDate: '2024-01-15',
          lastActive: '2024-02-15T10:30:00'
        },
        {
          id: '2',
          firstName: 'Sarah',
          lastName: 'Johnson',
          email: 'sarah@email.com',
          phone: '+1 (555) 987-6543',
          role: 'doctor',
          status: 'active',
          isVerified: true,
          registeredDate: '2024-01-20',
          lastActive: '2024-02-15T09:00:00'
        },
        {
          id: '3',
          firstName: 'Mike',
          lastName: 'Wilson',
          email: 'mike@email.com',
          phone: '+1 (555) 456-7890',
          role: 'client',
          status: 'blocked',
          isVerified: false,
          registeredDate: '2024-02-01',
          lastActive: '2024-02-10T15:00:00'
        },
        {
          id: '4',
          firstName: 'Emily',
          lastName: 'Brown',
          email: 'emily@email.com',
          phone: '+1 (555) 111-2222',
          role: 'blood-donor',
          status: 'active',
          isVerified: true,
          registeredDate: '2024-01-25',
          lastActive: '2024-02-14T12:00:00'
        },
        {
          id: '5',
          firstName: 'David',
          lastName: 'Clark',
          email: 'david@email.com',
          phone: '+1 (555) 333-4444',
          role: 'hospital',
          status: 'pending',
          isVerified: false,
          registeredDate: '2024-02-10',
          lastActive: '2024-02-10T08:00:00'
        }
      ];
    setUsers(mockUsers);
    setIsLoading(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: React.ReactNode }> = {
      active: { color: 'bg-emerald-500/10 text-emerald-400', icon: <CheckCircle className="w-3 h-3" /> },
      inactive: { color: 'bg-gray-500/10 text-gray-400', icon: <AlertCircle className="w-3 h-3" /> },
      blocked: { color: 'bg-red-500/10 text-red-400', icon: <XCircle className="w-3 h-3" /> },
      pending: { color: 'bg-amber-500/10 text-amber-400', icon: <AlertCircle className="w-3 h-3" /> }
    };
    return badges[status] || badges.inactive;
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      client: 'bg-blue-500/10 text-blue-400',
      doctor: 'bg-purple-500/10 text-purple-400',
      hospital: 'bg-emerald-500/10 text-emerald-400',
      pharmacy: 'bg-amber-500/10 text-amber-400',
      'blood-donor': 'bg-red-500/10 text-red-400'
    };
    return badges[role] || 'bg-gray-500/10 text-gray-400';
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(filteredUsers.map(u => u.id));
    } else {
      setSelectedUsers([]);
    }
  };

  const handleBulkAction = (action: 'block' | 'delete' | 'verify') => {
    if (window.confirm(`Are you sure you want to ${action} ${selectedUsers.length} users?`)) {
      console.log(`${action} users:`, selectedUsers);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-white/40 text-sm">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-white/40 text-sm mt-1">Manage all system users</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all"
        >
          <Download className="w-4 h-4" />
          Export Users
        </motion.button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatBox label="Total Users" value={users.length.toString()} color="cyan" icon={<Users className="w-4 h-4" />} />
        <StatBox label="Active" value={users.filter(u => u.status === 'active').length.toString()} color="emerald" icon={<UserCheck className="w-4 h-4" />} />
        <StatBox label="Pending" value={users.filter(u => u.status === 'pending').length.toString()} color="amber" icon={<AlertCircle className="w-4 h-4" />} />
        <StatBox label="Blocked" value={users.filter(u => u.status === 'blocked').length.toString()} color="red" icon={<UserX className="w-4 h-4" />} />
        <StatBox label="Verified" value={users.filter(u => u.isVerified).length.toString()} color="purple" icon={<Shield className="w-4 h-4" />} />
      </div>

      {/* Search & Filters */}
      <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.06] p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/20 outline-none focus:border-cyan-400/50 transition-all"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm outline-none focus:border-cyan-400/50 transition-all cursor-pointer"
          >
            <option value="all" className="bg-[#0a0a14]">All Roles</option>
            <option value="client" className="bg-[#0a0a14]">Client</option>
            <option value="doctor" className="bg-[#0a0a14]">Doctor</option>
            <option value="hospital" className="bg-[#0a0a14]">Hospital</option>
            <option value="pharmacy" className="bg-[#0a0a14]">Pharmacy</option>
            <option value="blood-donor" className="bg-[#0a0a14]">Blood Donor</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm outline-none focus:border-cyan-400/50 transition-all cursor-pointer"
          >
            <option value="all" className="bg-[#0a0a14]">All Status</option>
            <option value="active" className="bg-[#0a0a14]">Active</option>
            <option value="inactive" className="bg-[#0a0a14]">Inactive</option>
            <option value="blocked" className="bg-[#0a0a14]">Blocked</option>
            <option value="pending" className="bg-[#0a0a14]">Pending</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedUsers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl p-3 mb-4 flex items-center justify-between"
          >
            <span className="text-cyan-400 text-sm">
              {selectedUsers.length} user(s) selected
            </span>
            <div className="flex space-x-2">
              <button
                onClick={() => handleBulkAction('verify')}
                className="px-3 py-1.5 bg-emerald-500/20 text-emerald-400 text-sm rounded-lg hover:bg-emerald-500/30 transition-all"
              >
                Verify Selected
              </button>
              <button
                onClick={() => handleBulkAction('block')}
                className="px-3 py-1.5 bg-amber-500/20 text-amber-400 text-sm rounded-lg hover:bg-amber-500/30 transition-all"
              >
                Block Selected
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-1.5 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition-all"
              >
                Delete Selected
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Users Table */}
      <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl border border-white/[0.06] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.03] border-b border-white/[0.06]">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-white/[0.1] bg-white/[0.02] text-cyan-500 focus:ring-cyan-500"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Verified</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Registered</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white/40 uppercase tracking-wider">Last Active</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-white/40 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filteredUsers.map((user, index) => {
                const statusBadge = getStatusBadge(user.status);
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedUsers([...selectedUsers, user.id]);
                          } else {
                            setSelectedUsers(selectedUsers.filter(id => id !== user.id));
                          }
                        }}
                        className="w-4 h-4 rounded border-white/[0.1] bg-white/[0.02] text-cyan-500 focus:ring-cyan-500"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
                          <span className="text-white font-medium text-sm">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-white text-sm">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-white/40">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium capitalize ${getRoleBadge(user.role)}`}>
                        {user.role === 'blood-donor' ? 'Blood Donor' : user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.icon}
                        <span className="capitalize">{user.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.isVerified ? (
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-400" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-white/40">{user.registeredDate}</td>
                    <td className="px-4 py-3 text-sm text-white/40">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onViewUser(user.id)}
                          className="p-2 rounded-lg hover:bg-cyan-500/20 text-cyan-400 transition-all"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onEditUser(user.id)}
                          className="p-2 rounded-lg hover:bg-emerald-500/20 text-emerald-400 transition-all"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onBlockUser(user.id)}
                          className="p-2 rounded-lg hover:bg-amber-500/20 text-amber-400 transition-all"
                          title="Block"
                        >
                          <UserX className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => onDeleteUser(user.id)}
                          className="p-2 rounded-lg hover:bg-red-500/20 text-red-400 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <p className="text-white/40">No users found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-white/40">
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex space-x-2">
          <button className="px-3 py-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg text-white/40 text-sm hover:bg-white/[0.04] transition-all">
            Previous
          </button>
          <button className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg text-sm shadow-lg shadow-cyan-500/25">
            1
          </button>
          <button className="px-3 py-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg text-white/40 text-sm hover:bg-white/[0.04] transition-all">
            2
          </button>
          <button className="px-3 py-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg text-white/40 text-sm hover:bg-white/[0.04] transition-all">
            3
          </button>
          <button className="px-3 py-1.5 bg-white/[0.02] border border-white/[0.06] rounded-lg text-white/40 text-sm hover:bg-white/[0.04] transition-all">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: string; color: string; icon: React.ReactNode }> = ({ label, value, color, icon }) => {
  const colorClasses: Record<string, { bg: string; border: string; text: string }> = {
    cyan: { bg: 'from-cyan-500/10 to-cyan-600/5', border: 'border-cyan-500/20', text: 'text-cyan-400' },
    emerald: { bg: 'from-emerald-500/10 to-emerald-600/5', border: 'border-emerald-500/20', text: 'text-emerald-400' },
    amber: { bg: 'from-amber-500/10 to-amber-600/5', border: 'border-amber-500/20', text: 'text-amber-400' },
    red: { bg: 'from-red-500/10 to-red-600/5', border: 'border-red-500/20', text: 'text-red-400' },
    purple: { bg: 'from-purple-500/10 to-purple-600/5', border: 'border-purple-500/20', text: 'text-purple-400' }
  };
  
  const classes = colorClasses[color] || colorClasses.cyan;
  
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${classes.bg} border ${classes.border} p-4`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-2">
          <div className={`w-8 h-8 rounded-xl bg-gradient-to-br from-${color}-500 to-${color}-600 flex items-center justify-center`}>
            {icon}
          </div>
        </div>
        <p className={`text-2xl font-bold text-white`}>{value}</p>
        <p className={`text-xs ${classes.text} mt-1`}>{label}</p>
      </div>
    </motion.div>
  );
};

export default UserManager;