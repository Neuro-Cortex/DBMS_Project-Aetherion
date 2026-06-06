import { getAuthToken } from '../../services/api';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ClipboardList, Search, 
  Clock, 
  Download,
} from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Input } from 'src/ui/Input';

const AuditLogs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        const res = await fetch(
          `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/admin/audit-logs`,
          { headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' } }
        );
        const result = await res.json();
        setAuditLogs(Array.isArray(result) ? result : []);
      } catch (err) {
        console.error('Failed to fetch audit logs:', err);
        setAuditLogs([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = auditLogs.filter(log => {
    const matchSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) || log.action.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = filterType === 'all' || log.type === filterType;
    return matchSearch && matchType;
  });

  const severityColor = (severity: string) => {
    switch(severity) {
      case 'critical': return 'border-l-red-500 bg-red-500/5';
      case 'warning': return 'border-l-amber-500 bg-amber-500/5';
      default: return 'border-l-cyan-500 bg-cyan-500/5';
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
                  <ClipboardList className="w-8 h-8 text-cyan-400" /> Audit Logs
                </h1>
                <p className="text-slate-400 text-sm mt-1">Track who logged in, edited data, changed prescriptions & more</p>
              </div>
              <Button variant="primary" className="bg-cyan-500"><Download className="w-4 h-4 mr-2" /> Export Logs</Button>
            </div>

            <GlassmorphicCard className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <Input placeholder="Search by user or action..." leftIcon={Search} value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)} className="flex-1" />
                <div className="flex gap-2 flex-wrap">
                  {['all', 'auth', 'medical', 'inventory', 'admin', 'system', 'user'].map(type => (
                    <Button key={type} variant={filterType === type ? 'primary' : 'ghost'} size="sm"
                      onClick={() => setFilterType(type)} className={filterType === type ? 'bg-cyan-500' : 'text-slate-400'}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                {filtered.map((log, i) => (
                  <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-l-4 ${severityColor(log.severity)}`}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm">{log.user}</span>
                        <Badge variant={log.severity === 'critical' ? 'danger' : log.severity === 'warning' ? 'warning' : 'info'} className="text-[8px]">{log.severity}</Badge>
                        <Badge variant="default" className="text-[8px]">{log.type}</Badge>
                      </div>
                      <p className="text-slate-300 text-sm mt-0.5">{log.action}</p>
                      <p className="text-slate-500 text-xs mt-0.5">{log.details}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-500 flex items-center gap-1"><Clock className="w-3 h-3" /> {log.time}</p>
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

export default AuditLogs;