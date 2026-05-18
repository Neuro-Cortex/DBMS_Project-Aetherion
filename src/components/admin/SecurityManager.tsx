// src/components/admin/SecurityManager.tsx
// SUPER NICE UI - Using All Common Components
// Realistic Security Dashboard

import React, { useState, useEffect } from 'react';
import {
  Shield, Lock, Key, AlertTriangle, Activity,
  Server, Wifi, UserX, Eye, Download,
  Filter, RefreshCw, Globe,
  Clock, Zap, CheckCircle, XCircle,
  Smartphone, Monitor, MapPin
} from 'lucide-react';

// ============================================
// COMMON COMPONENTS
// ============================================
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Badge } from 'src/ui/Badge';
import { Button } from 'src/ui/Button';
import { Input } from 'src/ui/Input';
import { Select } from 'src/ui/Select';
import { Table } from 'src/ui/Table';
import { Loader } from 'src/ui/Loader';
import { Tabs } from 'src/ui/Tab';

// ============================================
// TYPES
// ============================================

export interface SecurityLog {
  id: string;
  event: string;
  userId?: string;
  userName?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  status: 'success' | 'failed' | 'blocked';
  details: string;
  location?: string;
  device?: string;
}

export interface SecurityStats {
  securityScore: number;
  activeThreats: number;
  sslValid: boolean;
  firewallActive: boolean;
  totalLogs: number;
  blockedIPs: number;
  lastScanDate: string;
}

// ============================================
// TABLE COLUMNS
// ============================================

const securityColumns = [
  {
    key: 'event',
    header: 'Event',
    render: (log: SecurityLog) => (
      <div className="flex items-center gap-2">
        <div className={`w-2 h-2 rounded-full ${
          log.status === 'success' ? 'bg-green-500' :
          log.status === 'failed' ? 'bg-red-500' : 'bg-yellow-500'
        }`} />
        <span className="font-medium text-sm">{log.event}</span>
      </div>
    )
  },
  {
    key: 'userName',
    header: 'User',
    render: (log: SecurityLog) => (
      <span className="text-sm">{log.userName || 'Unknown'}</span>
    )
  },
  {
    key: 'ipAddress',
    header: 'IP Address',
    render: (log: SecurityLog) => (
      <span className="text-sm font-mono text-gray-600">{log.ipAddress}</span>
    )
  },
  {
    key: 'status',
    header: 'Status',
    render: (log: SecurityLog) => (
      <Badge 
        variant={log.status === 'success' ? 'success' : log.status === 'failed' ? 'danger' : 'warning'}
        size="sm"
      >
        {log.status}
      </Badge>
    )
  },
  {
    key: 'timestamp',
    header: 'Timestamp',
    render: (log: SecurityLog) => (
      <span className="text-sm text-gray-500">{new Date(log.timestamp).toLocaleString()}</span>
    )
  },
  {
    key: 'details',
    header: 'Details',
    render: (log: SecurityLog) => (
      <span className="text-sm text-gray-600">{log.details}</span>
    )
  },
  {
    key: 'actions',
    header: '',
    render: (log: SecurityLog) => (
      <div className="flex gap-1">
        <Button variant="ghost" size="xs" iconOnly>
          <Eye className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="xs" iconOnly>
          <Download className="w-4 h-4" />
        </Button>
      </div>
    )
  }
];

// ============================================
// MAIN COMPONENT
// ============================================

export const SecurityManager: React.FC = () => {
  const [securityLogs, setSecurityLogs] = useState<SecurityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('logs');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const stats: SecurityStats = {
    securityScore: 98,
    activeThreats: 0,
    sslValid: true,
    firewallActive: true,
    totalLogs: 12450,
    blockedIPs: 23,
    lastScanDate: '2025-01-18T06:00:00'
  };

  useEffect(() => {
    fetchSecurityLogs();
    
    if (autoRefresh) {
      const interval = setInterval(fetchSecurityLogs, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const fetchSecurityLogs = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockLogs: SecurityLog[] = [
      {
        id: '1', event: 'Failed Login Attempt', userId: 'u1', userName: 'Unknown',
        ipAddress: '192.168.1.100', userAgent: 'Mozilla/5.0 (Windows NT 10.0)',
        timestamp: '2024-02-16T10:15:00', status: 'blocked',
        details: '5 failed attempts - IP temporarily blocked',
        location: 'New York, USA', device: 'Desktop'
      },
      {
        id: '2', event: 'Admin Login', userId: 'admin1', userName: 'Super Admin',
        ipAddress: '10.0.0.1', userAgent: 'Chrome/120.0',
        timestamp: '2024-02-16T09:00:00', status: 'success',
        details: 'Successful admin login with 2FA',
        location: 'San Francisco, USA', device: 'Desktop'
      },
      {
        id: '3', event: 'User Blocked', userId: 'u2', userName: 'Mike Wilson',
        ipAddress: '10.0.0.2', userAgent: 'Admin Panel',
        timestamp: '2024-02-16T08:30:00', status: 'success',
        details: 'User blocked due to multiple policy violations',
        location: 'Chicago, USA', device: 'Mobile'
      },
      {
        id: '4', event: 'SSL Certificate Renewed', userName: 'System',
        ipAddress: '127.0.0.1', userAgent: 'System Cron',
        timestamp: '2024-02-16T07:00:00', status: 'success',
        details: 'SSL certificate auto-renewed for next 90 days',
        location: 'Server', device: 'Server'
      },
      {
        id: '5', event: 'Firewall Rule Updated', userName: 'Security Bot',
        ipAddress: '127.0.0.1', userAgent: 'AI Security',
        timestamp: '2024-02-16T06:30:00', status: 'success',
        details: 'Blocked 3 suspicious IP ranges',
        location: 'Server', device: 'Server'
      },
      {
        id: '6', event: 'Unauthorized API Access', userId: 'u5', userName: 'Unknown',
        ipAddress: '45.33.32.156', userAgent: 'Python/3.9',
        timestamp: '2024-02-16T05:45:00', status: 'blocked',
        details: 'Attempted to access restricted endpoint',
        location: 'Russia', device: 'Bot'
      },
      {
        id: '7', event: 'Password Changed', userId: 'u3', userName: 'Sarah Johnson',
        ipAddress: '192.168.1.50', userAgent: 'Chrome/121.0',
        timestamp: '2024-02-16T04:20:00', status: 'success',
        details: 'Password changed successfully with email verification',
        location: 'Boston, USA', device: 'Desktop'
      }
    ];
    
    setSecurityLogs(mockLogs);
    setIsLoading(false);
  };

  const filteredLogs = securityLogs.filter(log => {
    const matchesFilter = filter === 'all' || log.status === filter;
    const matchesSearch = !searchTerm || 
      log.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ipAddress.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  const tabs = [
    { id: 'logs', label: 'Security Logs', count: securityLogs.length },
    { id: 'blocked', label: 'Blocked IPs', count: stats.blockedIPs },
    { id: 'alerts', label: 'Alerts', count: 3 }
  ];

  if (isLoading && securityLogs.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader type="spinner" message="Loading security data..." />
      </div>
    );
  }



  return (
    <div className="p-6 space-y-6">
      {/* ============================================ */}
      {/* HEADER */}
      {/* ============================================ */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            Security Management
          </h1>
          <p className="text-gray-500 mt-1 ml-13">Real-time security monitoring & threat detection</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="w-4 h-4 rounded text-blue-600"
            />
            Auto-refresh
          </label>
          <Button variant="primary" onClick={fetchSecurityLogs}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Now
          </Button>
        </div>
      </div>

      {/* ============================================ */}
      {/* SECURITY SCORE CARD */}
      {/* ============================================ */}
      <GlassmorphicCard className="p-6 bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Score Circle */}
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 -rotate-90">
                <circle cx="48" cy="48" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="6" />
                <circle
                  cx="48" cy="48" r="42" fill="none" stroke="#10B981"
                  strokeWidth="6" strokeDasharray={`${(stats.securityScore / 100) * 264} 264`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold">{stats.securityScore}</span>
                <span className="text-xs text-white/60">Score</span>
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-bold">System Secure</h3>
              <p className="text-sm text-white/60 mt-1">
                Last scan: {new Date(stats.lastScanDate).toLocaleString()}
              </p>
              <div className="flex gap-2 mt-3">
                <Badge variant="success">SSL Valid</Badge>
                <Badge variant="success">Firewall Active</Badge>
                <Badge variant="success">No Threats</Badge>
              </div>
            </div>
          </div>
        </div>
      </GlassmorphicCard>

      {/* ============================================ */}
      {/* STATS GRID */}
      {/* ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-green-100 rounded-xl">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <Badge variant="success">+2%</Badge>
          </div>
          <p className="text-2xl font-bold mt-3">{stats.securityScore}%</p>
          <p className="text-sm text-gray-500 mt-1">Security Score</p>
        </Card>

        <Card className="p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-red-100 rounded-xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <Badge variant="success">Clean</Badge>
          </div>
          <p className="text-2xl font-bold mt-3">{stats.activeThreats}</p>
          <p className="text-sm text-gray-500 mt-1">Active Threats</p>
        </Card>

        <Card className="p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Wifi className="w-6 h-6 text-blue-600" />
            </div>
            <Badge variant="info">Active</Badge>
          </div>
          <p className="text-2xl font-bold mt-3">{stats.blockedIPs}</p>
          <p className="text-sm text-gray-500 mt-1">Blocked IPs</p>
        </Card>

        <Card className="p-5 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="p-3 bg-purple-100 rounded-xl">
              <Server className="w-6 h-6 text-purple-600" />
            </div>
            <Badge variant="info">Monitored</Badge>
          </div>
          <p className="text-2xl font-bold mt-3">{stats.totalLogs.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Total Logs</p>
        </Card>
      </div>

      {/* ============================================ */}
      {/* TABS */}
      {/* ============================================ */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* ============================================ */}
      {/* FILTERS */}
      {/* ============================================ */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-3 items-center">
          <Input
            placeholder="Search events, users, IPs..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            
            icon={<Search className="w-5 h-5" />}
            className="flex-1 min-w-[200px]"
          />
          <Select
            value={filter}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Events' },
              { value: 'success', label: 'Success' },
              { value: 'failed', label: 'Failed' },
              { value: 'blocked', label: 'Blocked' },
            ]}
          />
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* ============================================ */}
      {/* SECURITY LOGS TABLE */}
      {/* ============================================ */}
      <Card className="overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-lg">Security Logs</h2>
          <span className="text-sm text-gray-500">{filteredLogs.length} entries</span>
        </div>
        <Table
          columns={securityColumns}
          data={filteredLogs}
          keyExtractor={(log: SecurityLog) => log.id}
          onRowClick={(log: SecurityLog) => console.log('View log:', log)}
          emptyMessage="No security logs found"
        />
      </Card>

      {/* ============================================ */}
      {/* LIVE MONITORING INDICATOR */}
      {/* ============================================ */}
      <Card className="p-4 bg-gray-900 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">Live Monitoring Active</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> 45 Countries Monitored</span>
            <span className="flex items-center gap-1"><Server className="w-3 h-3" /> 12 Servers Protected</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Uptime: 99.9%</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SecurityManager;