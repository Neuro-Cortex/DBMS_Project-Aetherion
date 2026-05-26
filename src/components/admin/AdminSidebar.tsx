import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Activity, Users, Stethoscope, UserCheck,
  Pill, Building2, Baby, Calendar, AlertCircle,
  MessageSquare, FileText, DollarSign, BarChart3, Brain,
  Shield, Bell, Settings, LogOut, CheckCircle, ClipboardList,
} from 'lucide-react';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';

interface SidebarLink {
  icon: React.ElementType;
  label: string;
  path: string;
  badge?: string | number;
}

const sidebarLinks: SidebarLink[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
  { icon: Activity, label: 'Live Monitoring', path: '/admin/live-monitor' },
  { icon: Users, label: 'Users', path: '/admin/users' },
  { icon: Stethoscope, label: 'Doctors', path: '/admin/doctor-verification' },
  { icon: UserCheck, label: 'Patients', path: '/admin/patients' },
  { icon: Pill, label: 'Pharmacy', path: '/admin/pharmacy' },
  { icon: Building2, label: 'Hospitals', path: '/admin/hospitals' },
  { icon: Baby, label: 'Women Care', path: '/admin/women-care-management' },
  { icon: Calendar, label: 'Appointments', path: '/admin/appointments' },
  { icon: AlertCircle, label: 'Emergency Center', path: '/admin/emergency' },
  { icon: MessageSquare, label: 'Messages', path: '/admin/messages' },
  { icon: FileText, label: 'Complaints', path: '/admin/complaints' },
  { icon: DollarSign, label: 'Revenue', path: '/admin/revenue' },
  { icon: BarChart3, label: 'Reports', path: '/admin/reports' },
  { icon: Brain, label: 'AI Analytics', path: '/admin/ai-system' },
  { icon: CheckCircle, label: 'Verification', path: '/admin/verification' },
  { icon: Bell, label: 'Notifications', path: '/admin/notifications' },
  { icon: Shield, label: 'Security', path: '/admin/security' },
  { icon: ClipboardList, label: 'Audit Logs', path: '/admin/audit-logs' },
  { icon: Settings, label: 'Settings', path: '/admin/settings' },
];

const AdminSidebar: React.FC<{ unreadCount?: number }> = ({ unreadCount = 0 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-slate-950/80 backdrop-blur-xl border-r border-white/[0.04] h-screen sticky top-0">
      <div className="p-6 border-b border-white/[0.04]">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-xl" />
            <Avatar name="AD" size="lg" className="relative ring-2 ring-amber-500/30" />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-950 shadow-lg shadow-emerald-400/50" />
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Admin</h3>
            <p className="text-amber-400 text-xs">Super Admin</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Badge variant="success" className="text-[10px] justify-center">🟢 Online</Badge>
          <Badge variant="info" className="text-[10px] justify-center">👑 Super Admin</Badge>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path || 
            (link.path === '/admin/doctor-verification' && location.pathname.startsWith('/admin/doctors')) ||
            (link.path === '/admin/reports' && location.pathname === '/admin/analytics');
          return (
            <motion.button
              key={link.path}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(link.path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 border border-amber-500/20 shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/[0.02]'
              }`}>
              <Icon className="w-5 h-5 shrink-0" /> 
              <span className="truncate">{link.label}</span>
              {(link.badge || (link.path === '/admin/notifications' && unreadCount > 0)) && (
                <Badge variant="danger" className="text-[9px] ml-auto">
                  {link.path === '/admin/notifications' ? unreadCount : link.badge}
                </Badge>
              )}
            </motion.button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <Activity className="w-3.5 h-3.5 text-emerald-400" />
          <span>System Online</span>
          <span className="ml-auto text-emerald-400">99.99%</span>
        </div>
        <Button variant="ghost" className="w-full text-slate-400 hover:text-red-400 justify-start">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;