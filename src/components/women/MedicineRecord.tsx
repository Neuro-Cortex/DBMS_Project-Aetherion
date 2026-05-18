// src/components/women/MedicineRecord.tsx

import React, { useState } from 'react';
import {
  Pill, Clock, AlertCircle, CheckCircle,
  Plus, Calendar, Bell, Trash2, Edit3
} from 'lucide-react';
import { PregnancyMedication } from '../../types/womenCare';

export const MedicineRecord: React.FC = () => {
  const [medications, setMedications] = useState<PregnancyMedication[]>([
    {
      id: '1',
      name: 'Prenatal Vitamins',
      dosage: '1 tablet',
      frequency: 'Once daily',
      startDate: '2024-09-01',
      prescribedBy: 'Dr. Emily White',
      purpose: 'Fetal development & maternal health',
      isSafe: true,
      reminders: true,
      reminderTimes: ['08:00']
    },
    {
      id: '2',
      name: 'Iron Supplement',
      dosage: '65mg',
      frequency: 'Once daily',
      startDate: '2024-10-15',
      prescribedBy: 'Dr. Emily White',
      purpose: 'Prevent anemia',
      isSafe: true,
      reminders: true,
      reminderTimes: ['09:00']
    },
    {
      id: '3',
      name: 'Calcium + Vitamin D',
      dosage: '500mg',
      frequency: 'Twice daily',
      startDate: '2024-11-01',
      prescribedBy: 'Dr. Sarah Wilson',
      purpose: 'Bone health',
      isSafe: true,
      reminders: true,
      reminderTimes: ['08:00', '20:00']
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState<Partial<PregnancyMedication>>({
    reminders: true,
    isSafe: true,
    reminderTimes: ['08:00']
  });

  const handleAddMedication = () => {
    const medication: PregnancyMedication = {
      id: Date.now().toString(),
      name: newMed.name || '',
      dosage: newMed.dosage || '',
      frequency: newMed.frequency || '',
      startDate: newMed.startDate || new Date().toISOString().split('T')[0],
      prescribedBy: newMed.prescribedBy || '',
      purpose: newMed.purpose || '',
      isSafe: true,
      reminders: newMed.reminders || true,
      reminderTimes: newMed.reminderTimes || ['08:00']
    };
    
    setMedications([...medications, medication]);
    setShowAddForm(false);
    setNewMed({ reminders: true, isSafe: true, reminderTimes: ['08:00'] });
  };

  const handleDelete = (id: string) => {
    setMedications(medications.filter(m => m.id !== id));
  };

  const handleToggleReminder = (id: string) => {
    setMedications(medications.map(m => 
      m.id === id ? { ...m, reminders: !m.reminders } : m
    ));
  };

  const getTimeStatus = (times: string[]) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    for (const time of times) {
      const [hour, minute] = time.split(':').map(Number);
      if (Math.abs(currentHour - hour) <= 1 && Math.abs(currentMinute - minute) <= 30) {
        return 'now';
      }
    }
    return 'later';
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Pill className="w-6 h-6 mr-2 text-pink-500" />
            Medicine Record
          </h1>
          <p className="text-gray-600 mt-1">Track your pregnancy medications</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Medicine
        </button>
      </div>

      {/* Add Medicine Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h3 className="font-semibold mb-4">Add New Medicine</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Medicine Name</label>
              <input
                type="text"
                value={newMed.name || ''}
                onChange={(e) => setNewMed({ ...newMed, name: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="e.g., Prenatal Vitamins"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Dosage</label>
              <input
                type="text"
                value={newMed.dosage || ''}
                onChange={(e) => setNewMed({ ...newMed, dosage: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="e.g., 1 tablet"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Frequency</label>
              <select
                value={newMed.frequency || ''}
                onChange={(e) => setNewMed({ ...newMed, frequency: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              >
                <option value="">Select frequency</option>
                <option value="Once daily">Once daily</option>
                <option value="Twice daily">Twice daily</option>
                <option value="Three times daily">Three times daily</option>
                <option value="Once weekly">Once weekly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Prescribed By</label>
              <input
                type="text"
                value={newMed.prescribedBy || ''}
                onChange={(e) => setNewMed({ ...newMed, prescribedBy: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Doctor name"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">Purpose</label>
              <input
                type="text"
                value={newMed.purpose || ''}
                onChange={(e) => setNewMed({ ...newMed, purpose: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Why this medicine is prescribed"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <input
                type="date"
                value={newMed.startDate || ''}
                onChange={(e) => setNewMed({ ...newMed, startDate: e.target.value })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Reminder Time</label>
              <input
                type="time"
                value={newMed.reminderTimes?.[0] || '08:00'}
                onChange={(e) => setNewMed({ ...newMed, reminderTimes: [e.target.value] })}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 mt-4">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleAddMedication}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
            >
              Add Medicine
            </button>
          </div>
        </div>
      )}

      {/* Medicine List */}
      <div className="space-y-4">
        {medications.map((med) => {
          const timeStatus = getTimeStatus(med.reminderTimes);
          
          return (
            <div key={med.id} className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
              timeStatus === 'now' ? 'border-pink-500 animate-pulse' : 'border-green-500'
            }`}>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    timeStatus === 'now' ? 'bg-pink-100' : 'bg-green-100'
                  }`}>
                    <Pill className={`w-6 h-6 ${
                      timeStatus === 'now' ? 'text-pink-600' : 'text-green-600'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{med.name}</h3>
                    <p className="text-sm text-gray-600">{med.dosage} • {med.frequency}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Prescribed by: {med.prescribedBy}
                    </p>
                    <p className="text-xs text-gray-500">{med.purpose}</p>
                    
                    <div className="flex items-center space-x-2 mt-2">
                      {med.reminderTimes.map((time) => (
                        <span key={time} className="inline-flex items-center px-2 py-1 bg-pink-50 text-pink-700 rounded text-xs">
                          <Clock className="w-3 h-3 mr-1" />
                          {time}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {timeStatus === 'now' && (
                    <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-medium animate-pulse">
                      Time to take!
                    </span>
                  )}
                  <button
                    onClick={() => handleToggleReminder(med.id)}
                    className={`p-2 rounded-lg ${
                      med.reminders ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-400'
                    }`}
                    title={med.reminders ? 'Reminder ON' : 'Reminder OFF'}
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(med.id)}
                    className="p-2 hover:bg-red-50 rounded-lg text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Safety Badge */}
              <div className="mt-3 flex items-center">
                <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Safe during pregnancy
                </span>
                <span className="text-xs text-gray-500 ml-3">
                  Started: {med.startDate}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {medications.length === 0 && (
        <div className="text-center py-12">
          <Pill className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No medications recorded</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="mt-4 text-pink-600 hover:text-pink-700"
          >
            Add your first medicine
          </button>
        </div>
      )}
    </div>
  );
};

export default MedicineRecord;
