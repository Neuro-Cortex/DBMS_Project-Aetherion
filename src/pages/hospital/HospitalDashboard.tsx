import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { Building2, Bed, Users, Truck, LogOut, Activity } from 'lucide-react';

const HospitalDashboard = () => {
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
            <h1 className="text-3xl font-bold text-white">Hospital Dashboard</h1>
            <p className="text-white/40">{user?.user?.fullName || user?.user?.name}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2">
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <Bed className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">250</h3>
            <p className="text-white/40">Total Beds</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <Activity className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">45</h3>
            <p className="text-white/40">ICU Occupied</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <Users className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">120</h3>
            <p className="text-white/40">Staff On Duty</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <Truck className="w-8 h-8 text-purple-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">8</h3>
            <p className="text-white/40">Ambulances</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Bed Availability</h2>
            <div className="space-y-3">
              {[{ ward: 'General Ward', available: 45, total: 100 }, { ward: 'ICU', available: 5, total: 20 }, { ward: 'Emergency', available: 8, total: 15 }].map((b, i) => (
                <div key={i} className="p-3 bg-white/[0.01] rounded-lg">
                  <div className="flex justify-between mb-1">
                    <p className="text-white text-sm">{b.ward}</p>
                    <p className="text-white/40 text-sm">{b.available}/{b.total}</p>
                  </div>
                  <div className="h-2 bg-white/[0.04] rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(b.available / b.total) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Admissions</h2>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/[0.01] rounded-lg">
                  <div>
                    <p className="text-white font-medium">Patient #{i}</p>
                    <p className="text-white/40 text-sm">Ward {i} • Today</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 text-xs">Admitted</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;