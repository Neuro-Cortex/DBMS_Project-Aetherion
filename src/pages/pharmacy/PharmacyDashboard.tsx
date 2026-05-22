import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { Pill, Package, AlertTriangle, TrendingUp, LogOut, ShoppingCart } from 'lucide-react';

const PharmacyDashboard = () => {
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
            <h1 className="text-3xl font-bold text-white">Pharmacy Dashboard</h1>
            <p className="text-white/40">{user?.user?.fullName || user?.user?.name}</p>
          </div>
          <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all flex items-center gap-2">
            <LogOut className="w-4 h-4" />Logout
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <Package className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">1,250</h3>
            <p className="text-white/40">Total Items</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <AlertTriangle className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">23</h3>
            <p className="text-white/40">Low Stock</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <ShoppingCart className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">18</h3>
            <p className="text-white/40">Pending Orders</p>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <TrendingUp className="w-8 h-8 text-amber-400 mb-3" />
            <h3 className="text-2xl font-bold text-white">$12.5k</h3>
            <p className="text-white/40">Today's Revenue</p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Low Stock Alerts</h2>
            <div className="space-y-3">
              {[{ med: 'Amoxicillin 500mg', stock: 5 }, { med: 'Ibuprofen 200mg', stock: 3 }, { med: 'Paracetamol 500mg', stock: 8 }].map((m, i) => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/[0.01] rounded-lg">
                  <p className="text-white text-sm">{m.med}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-red-400 text-sm font-medium">{m.stock} left</span>
                    <button className="px-3 py-1 rounded bg-red-500/20 text-red-400 text-xs">Reorder</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Orders</h2>
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex justify-between items-center p-3 bg-white/[0.01] rounded-lg">
                  <div>
                    <p className="text-white font-medium">Order #{1000 + i}</p>
                    <p className="text-white/40 text-sm">${(i * 45).toFixed(2)} • Today</p>
                  </div>
                  <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 text-xs">Processing</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;