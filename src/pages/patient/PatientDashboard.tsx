import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { Heart, Calendar, FileText, Pill, LogOut } from 'lucide-react';

const PatientDashboard = () => {
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
            <h1 className="text-3xl font-bold text-white">Patient Dashboard</h1>
            <p className="text-white/40">Welcome back, {user?.user?.fullName || user?.user?.name}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2">
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <Heart className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">8</h3>
            <p className="text-white/40">Upcoming Appointments</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <FileText className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">12</h3>
            <p className="text-white/40">Medical Records</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <Pill className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">3</h3>
            <p className="text-white/40">Active Prescriptions</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <Calendar className="w-8 h-8 text-cyan-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">5</h3>
            <p className="text-white/40">This Month</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Appointments</h2>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/[0.01] rounded-lg">
                  <div>
                    <p className="text-white font-medium">Dr. Sarah Johnson</p>
                    <p className="text-white/40 text-sm">Cardiology • Today 2:30 PM</p>
                  </div>
                  <button className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-400 text-sm">View</button>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Prescriptions</h2>
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/[0.01] rounded-lg">
                  <div>
                    <p className="text-white font-medium">Amoxicillin 500mg</p>
                    <p className="text-white/40 text-sm">Twice daily • 10 days</p>
                  </div>
                  <button className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-sm">Refill</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;