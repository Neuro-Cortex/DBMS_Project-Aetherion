// src/components/admin/AdminSidebar.tsx

import React, { useState } from 'react';
import {
  Shield, Users, UserCheck, Building2, Pill,
  Droplet, Activity, FileText, MessageSquare,
  Radio, Settings, LogOut, ChevronRight,
  BarChart3, AlertTriangle, Key, Home
} from 'lucide-react';

interface AdminSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  adminName: string;
  adminRole: string;
  onLogout: () => void;
  alertCount: number;
  pendingVerifications: number;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activePage,
  onNavigate,
  adminName,
  adminRole,
  onLogout,
  alertCount,
  pendingVerifications
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems = [
    {
      section: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: Home, badge: null },
        { id: 'analytics', label: 'Analytics', icon: BarChart3, badge: null },
      ]
    },
    {
      section: 'USER MANAGEMENT',
      items: [
        { id: 'users', label: 'All Users', icon: Users, badge: null },
        { id: 'doctors', label: 'Doctors', icon: UserCheck, badge: pendingVerifications.toString() },
        { id: 'hospitals', label: 'Hospitals', icon: Building2, badge: '15' },
        { id: 'pharmacies', label: 'Pharmacies', icon: Pill, badge: '20' },
      ]
    },
    {
      section: 'VERIFICATIONS',
      items: [
        { id: 'doctor-verification', label: 'Doctor Verification', icon: UserCheck, badge: '35' },
        { id: 'hospital-verification', label: 'Hospital Verification', icon: Building2, badge: '15' },
        { id: 'pharmacy-verification', label: 'Pharmacy Verification', icon: Pill, badge: '20' },
      ]
    },
    {
      section: 'MONITORING',
      items: [
        { id: 'blood-stock', label: 'Blood Stock', icon: Droplet, badge: '3' },
        { id: 'emergency', label: 'Emergency', icon: Radio, badge: alertCount.toString() },
        { id: 'activity', label: 'User Activities', icon: Activity, badge: null },
      ]
    },
    {
      section: 'COMMUNICATION',
      items: [
        { id: 'feedback', label: 'Feedback', icon: MessageSquare, badge: '5' },
        { id: 'reports', label: 'Reports', icon: FileText, badge: null },
      ]
    },
    {
      section: 'SECURITY',
      items: [
        { id: 'security', label: 'Security', icon: Shield, badge: '2' },
        { id: 'settings', label: 'Settings', icon: Settings, badge: null },
      ]
    }
  ];

  return (
    <div className={`bg-gray-900 text-white h-screen shadow-2xl transition-all duration-300 relative ${
      isExpanded ? 'w-64' : 'w-20'
    }`}>
      {/* Admin Info */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          {isExpanded && (
            <div>
              <p className="font-semibold text-sm">{adminName}</p>
              <p className="text-xs text-gray-400 capitalize">{adminRole}</p>
              <div className="flex items-center mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <p className="text-xs text-green-400">Online</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 flex-1 overflow-y-auto h-[calc(100vh-200px)]">
        {menuItems.map((section) => (
          <div key={section.section} className="mb-6">
            {isExpanded && (
              <p className="text-xs font-semibold text-gray-500 mb-2 px-3 uppercase tracking-wider">
                {section.section}
              </p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center px-3 py-2.5 mb-1 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                  title={!isExpanded ? item.label : ''}
                >
                  <div className="relative">
                    <Icon className="w-5 h-5" />
                    {item.badge && (
                      <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {isExpanded && (
                    <div className="ml-3 flex-1 flex items-center justify-between">
                      <span className="text-sm">{item.label}</span>
                      {item.badge && (
                        <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2 text-gray-400 hover:bg-red-600/20 hover:text-red-400 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {isExpanded && <span className="ml-3">Logout</span>}
        </button>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute -right-3 top-1/2 bg-gray-800 border border-gray-700 rounded-full p-1 shadow-lg hover:bg-gray-700"
      >
        <ChevronRight className={`w-4 h-4 text-gray-400 transform transition-transform ${
          isExpanded ? 'rotate-180' : ''
        }`} />
      </button>
    </div>
  );
};


export default AdminSidebar;
