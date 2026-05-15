// src/components/admin/SecurityManager.tsx

import React, { useState, useEffect } from 'react';
import {
  Shield, Lock, Key, AlertTriangle, Activity,
  Server, Wifi, UserX, Eye, Download,
  Search, Filter, RefreshCw
} from 'lucide-react';
import { SecurityLog } from '../../types/admin';

export const SecurityManager: React.FC = () => {
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSecurityLogs();
  }, []);

  const fetchSecurityLogs = async () => {
    setTimeout(() => {
      const mockLogs: SecurityLog[] = [
        {
          id: '1',
          event: 'Failed Login Attempt',
          userId: 'u1',
          userName: 'Unknown',
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
          timestamp: '2024-02-16T10:15:00',
          status: 'blocked',
          details: '5 failed attempts - IP temporarily blocked'
        },
        {
          id: '2',
          event: 'Admin Login',
          userId: 'admin1',
          userName: 'Super Admin',
          ipAddress: '10.0.0.1',
          userAgent: 'Chrome/120.0',
          timestamp: '2024-02-16T09:00:00',
          status: 'success',
          details: 'Successful admin login'
        },
        {
          id: '3',
          event: 'User Blocked',
          userId: 'u2',
          userName: 'Mike Wilson',
          ipAddress: '10.0.0.2',
          userAgent: 'Admin Panel',
          timestamp: '2024-02-16T08:30:00',
          status: 'success',
          details: 'User blocked due to multiple policy violations'
        }
      ];
      setSecurityLogs(mockLogs);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Shield className="w-6 h-6 mr-2 text-blue-600" />
            Security Management
          </h1>
          <p className="text-gray-600 mt-1">Monitor and manage system security</p>
        </div>
        <button
          onClick={fetchSecurityLogs}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <SecurityStat icon={<Shield />} label="Security Score" value="98%" color="green" />
        <SecurityStat icon={<AlertTriangle />} label="Active Threats" value="0" color="green" />
        <SecurityStat icon={<Lock />} label="SSL Certificate" value="Valid" color="green" />
        <SecurityStat icon={<Wifi />} label="Firewall" value="Active" color="green" />
      </div>

      {/* Security Logs */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-lg">Security Logs</h2>
            <div className="flex items-center space-x-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="border rounded-lg px-3 py-1 text-sm"
              >
                <option value="all">All Events</option>
                <option value="failed">Failed Attempts</option>
                <option value="success">Success</option>
                <option value="blocked">Blocked</option>
              </select>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Event</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {securityLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{log.event}</td>
                  <td className="px-4 py-3 text-sm">{log.userName || 'Unknown'}</td>
                  <td className="px-4 py-3 text-sm font-mono">{log.ipAddress}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.status === 'success' ? 'bg-green-100 text-green-700' :
                      log.status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{log.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const SecurityStat: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-lg shadow p-4 flex items-center space-x-4">
    <div className={`p-2 bg-${color}-100 rounded-lg`}>
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  </div>
);


// SecurityManager.tsx - Full Security Dashboard
<div className="grid grid-cols-4 gap-4">
  <SecurityStat icon={<Shield />} label="Security Score" value="98%" />
  <SecurityStat icon={<AlertTriangle />} label="Active Threats" value="0" />
  <SecurityStat icon={<Lock />} label="SSL Certificate" value="Valid" />
  <SecurityStat icon={<Wifi />} label="Firewall" value="Active" />
</div>

// Security logs table:
- Failed login attempts
- IP blocking
- User agent tracking
- Event timestamps
- Status monitoring

// Security in adminService.ts:
- getSecurityLogs()
- getSystemHealth()
- IP blocking
- Rate limiting