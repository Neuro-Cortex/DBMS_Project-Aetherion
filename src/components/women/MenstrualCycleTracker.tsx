// src/components/women/MenstrualCycleTracker.tsx

import React, { useState } from 'react';
import {
  Droplet, Calendar, TrendingUp, Bell,
  Plus, Activity, Heart
} from 'lucide-react';
import { MenstrualCycle } from '../../types/womenCare';

export const MenstrualCycleTracker: React.FC = () => {
  const [cycleData, setCycleData] = useState<MenstrualCycle>({
    id: '1',
    userId: 'u1',
    lastPeriodDate: '2025-01-01',
    cycleLength: 28,
    periodDuration: 5,
    isRegular: true,
    nextPeriodDate: '2025-01-29',
    ovulationDate: '2025-01-15',
    fertileWindow: {
      start: '2025-01-12',
      end: '2025-01-17'
    },
    cycleHistory: [
      { id: '1', startDate: '2024-12-04', endDate: '2024-12-09', duration: 5, flow: 'medium', symptoms: ['Cramps'] },
      { id: '2', startDate: '2025-01-01', endDate: '2025-01-06', duration: 5, flow: 'medium', symptoms: ['Cramps', 'Headache'] }
    ],
    symptoms: [
      { name: 'Cramps', severity: 'moderate', date: '2025-01-01' },
      { name: 'Headache', severity: 'mild', date: '2025-01-02' }
    ],
    reminderEnabled: true,
    reminderDays: 2
  });

  const [showLogForm, setShowLogForm] = useState(false);
  const [newLog, setNewLog] = useState({
    startDate: '',
    endDate: '',
    flow: 'medium' as 'light' | 'medium' | 'heavy',
    symptoms: [] as string[]
  });

  const handleLogPeriod = () => {
    const newRecord = {
      id: Date.now().toString(),
      startDate: newLog.startDate,
      endDate: newLog.endDate,
      duration: Math.ceil(
        (new Date(newLog.endDate).getTime() - new Date(newLog.startDate).getTime()) / 
        (1000 * 60 * 60 * 24)
      ) + 1,
      flow: newLog.flow,
      symptoms: newLog.symptoms,
    };

    setCycleData({
      ...cycleData,
      cycleHistory: [newRecord, ...cycleData.cycleHistory],
      lastPeriodDate: newLog.startDate
    });
    
    setShowLogForm(false);
  };

  const daysUntilNextPeriod = Math.ceil(
    (new Date(cycleData.nextPeriodDate).getTime() - new Date().getTime()) / 
    (1000 * 60 * 60 * 24)
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Droplet className="w-6 h-6 mr-2 text-red-500" />
            Cycle Tracker
          </h1>
          <p className="text-gray-600 mt-1">Track your menstrual cycle</p>
        </div>
        <button
          onClick={() => setShowLogForm(!showLogForm)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Log Period
        </button>
      </div>

      {/* Cycle Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <CycleStatCard
          icon={<Calendar className="w-6 h-6 text-pink-500" />}
          label="Next Period"
          value={cycleData.nextPeriodDate}
          subtitle={`${daysUntilNextPeriod} days away`}
          color="pink"
        />
        <CycleStatCard
          icon={<Activity className="w-6 h-6 text-purple-500" />}
          label="Ovulation"
          value={cycleData.ovulationDate}
          subtitle="Predicted"
          color="purple"
        />
        <CycleStatCard
          icon={<Heart className="w-6 h-6 text-red-500" />}
          label="Fertile Window"
          value={`${cycleData.fertileWindow.start} - ${cycleData.fertileWindow.end}`}
          subtitle="6 days"
          color="red"
        />
        <CycleStatCard
          icon={<TrendingUp className="w-6 h-6 text-green-500" />}
          label="Cycle Length"
          value={`${cycleData.cycleLength} days`}
          subtitle={cycleData.isRegular ? 'Regular' : 'Irregular'}
          color="green"
        />
      </div>

      {/* Cycle Visual */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Cycle Calendar</h2>
        <div className="flex items-center space-x-2 mb-4">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-400 rounded-full mr-1"></div>
            <span className="text-xs">Period</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-pink-300 rounded-full mr-1"></div>
            <span className="text-xs">Fertile</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-purple-300 rounded-full mr-1"></div>
            <span className="text-xs">Ovulation</span>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-1">
              {day}
            </div>
          ))}
          {Array.from({ length: 35 }).map((_, i) => {
            const day = i - 3; // Offset for month start
            const isPeriod = day >= 1 && day <= 5;
            const isFertile = day >= 12 && day <= 17;
            const isOvulation = day === 15;
            
            return (
              <div
                key={i}
                className={`text-center py-2 rounded-lg text-sm ${
                  isPeriod ? 'bg-red-100 text-red-700 font-medium' :
                  isOvulation ? 'bg-purple-200 text-purple-700 font-medium' :
                  isFertile ? 'bg-pink-100 text-pink-700' :
                  'text-gray-600'
                }`}
              >
                {day > 0 && day <= 31 ? day : ''}
              </div>
            );
          })}
        </div>
      </div>

      {/* Log Period Form */}
      {showLogForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="font-semibold mb-4">Log New Period</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={newLog.startDate}
                onChange={(e) => setNewLog({ ...newLog, startDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">End Date</label>
              <input
                type="date"
                value={newLog.endDate}
                onChange={(e) => setNewLog({ ...newLog, endDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Flow</label>
              <select
                value={newLog.flow}
                onChange={(e) => setNewLog({ ...newLog, flow: e.target.value as any })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="light">Light</option>
                <option value="medium">Medium</option>
                <option value="heavy">Heavy</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowLogForm(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleLogPeriod}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* History */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Cycle History</h2>
        <div className="space-y-3">
          {cycleData.cycleHistory.map((record) => (
            <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-sm">
                  {record.startDate} - {record.endDate}
                </p>
                <p className="text-xs text-gray-500">
                  {record.duration} days • {record.flow} flow
                </p>
              </div>
              <span className={`px-2 py-1 rounded text-xs ${
                record.flow === 'heavy' ? 'bg-red-100 text-red-700' :
                record.flow === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-green-100 text-green-700'
              }`}>
                {record.flow}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const CycleStatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  subtitle: string;
  color: string;
}> = ({ icon, label, value, subtitle, color }) => (
  <div className={`bg-white rounded-xl shadow-lg p-4 border-l-4 border-${color}-500`}>
    <div className="flex items-center space-x-3 mb-2">
      {icon}
      <span className="text-xs text-gray-600">{label}</span>
    </div>
    <p className="text-lg font-bold">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
  </div>
);


export default MenstrualCycleTracker;


