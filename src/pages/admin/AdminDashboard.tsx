import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { Shield, Users, Building2, Activity, LogOut, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const user = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('aetherion_session');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050508] via-[#0a0a14] to-[#050508]">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-white/40">{user?.user?.fullName || user?.user?.name}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2">
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <Users className="w-8 h-8 text-slate-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">2,450</h3>
            <p className="text-white/40">Total Users</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <Building2 className="w-8 h-8 text-slate-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">25</h3>
            <p className="text-white/40">Hospitals</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <Activity className="w-8 h-8 text-slate-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">12</h3>
            <p className="text-white/40">Pending Verifications</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <BarChart3 className="w-8 h-8 text-slate-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">98.5%</h3>
            <p className="text-white/40">Uptime</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Users</h2>
            <div className="space-y-3">
              {[{ name: 'Dr. Sarah Johnson', role: 'Doctor' }, { name: 'City Hospital', role: 'Hospital' }, { name: 'MediCare Pharmacy', role: 'Pharmacy' }].map((u, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/[0.01] rounded-lg">
                  <div>
                    <p className="text-white text-sm">{u.name}</p>
                    <p className="text-white/40 text-xs">{u.role}</p>
                  </div>
                  <button className="px-3 py-1 rounded bg-blue-500/20 text-blue-400 text-xs">Verify</button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">System Health</h2>
            <div className="space-y-3">
              {[{ metric: 'Server Response', value: '45ms', color: 'text-emerald-400' }, { metric: 'Database', value: 'Healthy', color: 'text-emerald-400' }, { metric: 'API Status', value: 'All OK', color: 'text-emerald-400' }].map((m, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/[0.01] rounded-lg">
                  <p className="text-white text-sm">{m.metric}</p>
                  <span className={`${m.color} text-sm font-medium`}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;