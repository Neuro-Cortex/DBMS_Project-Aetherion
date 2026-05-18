// src/components/hospital/HospitalSidebar.tsx

import React, { useState } from 'react';
import {
  Building2,
  LayoutDashboard,
  Users,
  Bed,
  Droplet,
  Truck,
  Wind,
  AlertCircle,
  Bell,
  LogOut,
  ChevronRight,
  Activity,
  Thermometer,
  Heart,
  Syringe,
  ClipboardList,
  MessageCircle,
} from 'lucide-react';

interface HospitalSidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  hospitalName: string;
  onLogout: () => void;
  alertCount: number;
}

type MenuItem = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string | null;
};

export const HospitalSidebar: React.FC<HospitalSidebarProps> = ({
  activePage,
  onNavigate,
  hospitalName,
  onLogout,
  alertCount,
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const menuItems: { section: string; items: MenuItem[] }[] = [
    {
      section: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
        { id: 'analytics', label: 'Analytics', icon: Activity, badge: null },
      ],
    },
    {
      section: 'MANAGEMENT',
      items: [
        { id: 'doctors', label: 'Doctors', icon: Users, badge: null },
        { id: 'departments', label: 'Departments', icon: Building2, badge: null },
        { id: 'beds', label: 'Bed Availability', icon: Bed, badge: null },
        { id: 'icu-tracker', label: 'ICU Tracker', icon: Thermometer, badge: '5' },
      ],
    },
    {
      section: 'RESOURCES',
      items: [
        { id: 'blood-stock', label: 'Blood Bank', icon: Droplet, badge: '3' },
        { id: 'blood-donors', label: 'Blood Donors', icon: Heart, badge: '2' },
        { id: 'blood-requests', label: 'Blood Requests', icon: Syringe, badge: '4' },
        { id: 'oxygen', label: 'Oxygen', icon: Wind, badge: null },
      ],
    },
    {
      section: 'SERVICES',
      items: [
        { id: 'ambulance', label: 'Ambulance', icon: Truck, badge: '1' },
        {
          id: 'emergency',
          label: 'Emergency',
          icon: AlertCircle,
          badge: alertCount > 0 ? alertCount.toString() : null,
        },
        { id: 'announcements', label: 'Announcements', icon: Bell, badge: null },
      ],
    },
    {
      section: 'COMMUNICATION',
      items: [
        { id: 'messages', label: 'Messages', icon: MessageCircle, badge: null },
        { id: 'reports', label: 'Reports', icon: ClipboardList, badge: null },
      ],
    },
  ];

  return (
    <aside
      className={`bg-white h-screen shadow-lg transition-all duration-300 relative flex flex-col ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
    >
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
            <Building2 className="w-6 h-6 text-blue-600" />
          </div>
          {isExpanded && (
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">{hospitalName}</p>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                <p className="text-xs text-green-600">Active</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        {menuItems.map((section) => (
          <div key={section.section} className="mb-6">
            {isExpanded && (
              <p className="text-xs font-semibold text-gray-400 mb-2 px-3">{section.section}</p>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  title={!isExpanded ? item.label : undefined}
                  className={`w-full flex items-center px-3 py-2 mb-1 rounded-lg transition-colors ${
                    isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="relative shrink-0">
                    <Icon className="w-5 h-5" />
                    {item.badge && (
                      <span className="absolute -top-2 -right-2 min-w-[1rem] h-4 px-0.5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  {isExpanded && <span className="ml-3 text-sm text-left">{item.label}</span>}
                </button>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="p-4 border-t">
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {isExpanded && <span className="ml-3 text-sm">Logout</span>}
        </button>
      </div>

      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        aria-label={isExpanded ? 'Collapse sidebar' : 'Expand sidebar'}
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-white border rounded-full p-1 shadow-md hover:shadow-lg"
      >
        <ChevronRight
          className={`w-4 h-4 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>
    </aside>
  );
};
export default HospitalSidebar;
