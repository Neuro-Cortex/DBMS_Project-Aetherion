// src/components/admin/UserManager.tsx

import React, { useState, useEffect } from 'react';
import {
  Users, Search, Filter, MoreVertical, Edit3,
  Trash2, UserCheck, UserX, Eye, Download,
  ChevronDown, AlertCircle, CheckCircle, XCircle
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
    setTimeout(() => {
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
    }, 1000);
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
      active: { color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-4 h-4" /> },
      inactive: { color: 'bg-gray-100 text-gray-700', icon: <AlertCircle className="w-4 h-4" /> },
      blocked: { color: 'bg-red-100 text-red-700', icon: <XCircle className="w-4 h-4" /> },
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: <AlertCircle className="w-4 h-4" /> }
    };
    return badges[status] || badges.inactive;
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, string> = {
      client: 'bg-blue-100 text-blue-700',
      doctor: 'bg-purple-100 text-purple-700',
      hospital: 'bg-green-100 text-green-700',
      pharmacy: 'bg-orange-100 text-orange-700',
      'blood-donor': 'bg-red-100 text-red-700'
    };
    return badges[role] || 'bg-gray-100 text-gray-700';
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
      // Perform bulk action
      console.log(`${action} users:`, selectedUsers);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-gray-600 mt-1">Manage all system users</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
          <Download className="w-4 h-4 mr-2" />
          Export Users
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatBox label="Total Users" value={users.length.toString()} color="blue" />
        <StatBox label="Active" value={users.filter(u => u.status === 'active').length.toString()} color="green" />
        <StatBox label="Pending" value={users.filter(u => u.status === 'pending').length.toString()} color="yellow" />
        <StatBox label="Blocked" value={users.filter(u => u.status === 'blocked').length.toString()} color="red" />
        <StatBox label="Verified" value={users.filter(u => u.isVerified).length.toString()} color="purple" />
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">All Roles</option>
            <option value="client">Client</option>
            <option value="doctor">Doctor</option>
            <option value="hospital">Hospital</option>
            <option value="pharmacy">Pharmacy</option>
            <option value="blood-donor">Blood Donor</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="blocked">Blocked</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 flex items-center justify-between">
          <span className="text-blue-700">
            {selectedUsers.length} user(s) selected
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => handleBulkAction('verify')}
              className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
            >
              Verify Selected
            </button>
            <button
              onClick={() => handleBulkAction('block')}
              className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700"
            >
              Block Selected
            </button>
            <button
              onClick={() => handleBulkAction('delete')}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Delete Selected
            </button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === filteredUsers.length}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Verified</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Registered</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Active</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => {
                const statusBadge = getStatusBadge(user.status);
                return (
                  <tr key={user.id} className="hover:bg-gray-50">
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
                        className="w-4 h-4 rounded"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-sm font-medium text-blue-600">
                            {user.firstName[0]}{user.lastName[0]}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusBadge.color}`}>
                        {statusBadge.icon}
                        <span className="ml-1 capitalize">{user.status}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {user.isVerified ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{user.registeredDate}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(user.lastActive).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onViewUser(user.id)}
                          className="p-1 hover:bg-blue-100 rounded"
                          title="View"
                        >
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => onEditUser(user.id)}
                          className="p-1 hover:bg-green-100 rounded"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4 text-green-600" />
                        </button>
                        <button
                          onClick={() => onBlockUser(user.id)}
                          className="p-1 hover:bg-yellow-100 rounded"
                          title="Block"
                        >
                          <UserX className="w-4 h-4 text-yellow-600" />
                        </button>
                        <button
                          onClick={() => onDeleteUser(user.id)}
                          className="p-1 hover:bg-red-100 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No users found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </p>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm">Previous</button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm">2</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm">3</button>
          <button className="px-3 py-1 border rounded hover:bg-gray-50 text-sm">Next</button>
        </div>
      </div>
    </div>
  );
};

const StatBox: React.FC<{ label: string; value: string; color: string }> = ({ label, value, color }) => (
  <div className={`bg-white rounded-lg shadow p-4 border-l-4 border-${color}-500`}>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);


export default UserManager;
