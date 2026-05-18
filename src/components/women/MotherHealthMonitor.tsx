// src/components/women/MotherHealthMonitor.tsx

import React, { useState } from 'react';
import {
  Activity, Heart, Weight, Thermometer,
  TrendingUp, TrendingDown, Droplet,
  Plus, Calendar, Ruler
} from 'lucide-react';

export const MotherHealthMonitor: React.FC = () => {
  const [healthData, setHealthData] = useState({
    currentWeek: 24,
    weight: 65,
    weightGain: 8.5,
    bloodPressure: { systolic: 120, diastolic: 80 },
    bloodSugar: 95,
    hemoglobin: 11.5,
    heartRate: 78,
    temperature: 36.8,
    oxygenLevel: 98,
    weightHistory: [
      { week: 8, weight: 56.5 },
      { week: 12, weight: 58 },
      { week: 16, weight: 59.5 },
      { week: 20, weight: 61.5 },
      { week: 24, weight: 65 }
    ],
    bpHistory: [
      { week: 20, systolic: 118, diastolic: 78 },
      { week: 22, systolic: 122, diastolic: 82 },
      { week: 24, systolic: 120, diastolic: 80 }
    ]
  });

  const getBPCategory = (systolic: number, diastolic: number) => {
    if (systolic < 120 && diastolic < 80) return { label: 'Normal', color: 'green' };
    if (systolic < 130 && diastolic < 85) return { label: 'Elevated', color: 'yellow' };
    if (systolic < 140 || diastolic < 90) return { label: 'High', color: 'orange' };
    return { label: 'Alert', color: 'red' };
  };

  const bpCategory = getBPCategory(healthData.bloodPressure.systolic, healthData.bloodPressure.diastolic);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Activity className="w-6 h-6 mr-2 text-purple-500" />
        Mother Health Monitor
      </h1>

      {/* Current Week Banner */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-purple-100">Current Week</p>
            <p className="text-4xl font-bold">{healthData.currentWeek}</p>
          </div>
          <div className="text-right">
            <p className="text-purple-100">Weight Gain</p>
            <p className="text-2xl font-bold">{healthData.weightGain} kg</p>
            <p className="text-sm text-purple-200">Total gain</p>
          </div>
        </div>
      </div>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <HealthMetricCard
          icon={<Weight className="w-6 h-6 text-blue-500" />}
          label="Weight"
          value={`${healthData.weight} kg`}
          change="+0.5 kg/week"
          status="normal"
          color="blue"
        />
        <HealthMetricCard
          icon={<Heart className="w-6 h-6 text-red-500" />}
          label="Blood Pressure"
          value={`${healthData.bloodPressure.systolic}/${healthData.bloodPressure.diastolic}`}
          change={bpCategory.label}
          status={bpCategory.color}
          color="red"
        />
        <HealthMetricCard
          icon={<Droplet className="w-6 h-6 text-pink-500" />}
          label="Blood Sugar"
          value={`${healthData.bloodSugar} mg/dL`}
          change="Fasting"
          status="normal"
          color="pink"
        />
        <HealthMetricCard
          icon={<Activity className="w-6 h-6 text-green-500" />}
          label="Hemoglobin"
          value={`${healthData.hemoglobin} g/dL`}
          change="Normal"
          status="normal"
          color="green"
        />
      </div>

      {/* Weight Gain Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
          Weight Gain Progress
        </h2>
        <div className="space-y-3">
          {healthData.weightHistory.map((record) => (
            <div key={record.week} className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Week {record.week}</span>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(record.weight / 70) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-medium">{record.weight} kg</span>
            </div>
          ))}
        </div>
      </div>

      {/* Blood Pressure History */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <Heart className="w-5 h-5 mr-2 text-red-500" />
          Blood Pressure History
        </h2>
        <div className="space-y-3">
          {healthData.bpHistory.map((record) => (
            <div key={record.week} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm">Week {record.week}</span>
              <span className="font-medium">{record.systolic}/{record.diastolic}</span>
              <span className={`px-2 py-1 rounded text-xs ${
                record.systolic < 120 && record.diastolic < 80 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-yellow-100 text-yellow-700'
              }`}>
                {record.systolic < 120 && record.diastolic < 80 ? 'Normal' : 'Monitor'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Health Tips */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6">
        <h3 className="font-semibold mb-3">💡 Health Recommendations</h3>
        <ul className="space-y-2">
          <li className="flex items-start space-x-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
            <span>Monitor your blood pressure weekly</span>
          </li>
          <li className="flex items-start space-x-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
            <span>Track weight gain - aim for 0.5 kg per week</span>
          </li>
          <li className="flex items-start space-x-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
            <span>Stay hydrated - drink 8-10 glasses of water</span>
          </li>
          <li className="flex items-start space-x-2 text-sm">
            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
            <span>Continue prenatal vitamins daily</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const HealthMetricCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  status: string;
  color: string;
}> = ({ icon, label, value, change, status, color }) => (
  <div className="bg-white rounded-xl shadow-lg p-4">
    <div className="flex items-center justify-between mb-3">
      <div className={`p-2 bg-${color}-100 rounded-lg`}>
        {icon}
      </div>
      {status === 'normal' ? (
        <TrendingUp className="w-4 h-4 text-green-500" />
      ) : (
        <TrendingDown className="w-4 h-4 text-red-500" />
      )}
    </div>
    <p className="text-xl font-bold">{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
    <p className={`text-xs mt-1 ${
      status === 'normal' || status === 'green' ? 'text-green-600' :
      status === 'yellow' ? 'text-yellow-600' : 'text-red-600'
    }`}>
      {change}
    </p>
  </div>
);

const CheckCircle: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);


export default MotherHealthMonitor;
