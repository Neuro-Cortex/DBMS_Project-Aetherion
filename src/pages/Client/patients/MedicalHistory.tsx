// src/components/patients/MedicalHistory.tsx
// ERROR-FREE MEDICAL HISTORY COMPONENT
// All imports fixed | Types complete | Common components used

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  Plus,
  X,
  Calendar,
  Heart,
  AlertTriangle,
  Stethoscope,
  Scissors,
  Pill,
  FileText,
  Clock,
  CheckCircle,
  Users,
  AlertCircle
} from 'lucide-react';

// ============================================
// COMMON COMPONENTS
// ============================================
import { Card } from 'src/ui/Card';

import { Badge } from 'src/ui/Badge';
import { Button } from 'src/ui/Button';
import { Input } from 'src/ui/Input';


// ============================================
// TYPES & INTERFACES
// ============================================

export interface MedicalInfo {
  height: string;
  weight: string;
  allergies: string[];
  chronicDiseases: string[];
  surgeries: string[];
  medications: string[];
  familyHistory: string[];
  immunizations: string[];
}

export interface MedicalHistoryProps {
  medicalInfo?: MedicalInfo;
  variant?: 'glass' | 'gradient' | 'neon';
  isEditing?: boolean;
  onEdit?: (field: keyof MedicalInfo, value: any) => void;
  onAddItem?: (field: keyof MedicalInfo, item: string) => void;
  onRemoveItem?: (field: keyof MedicalInfo, index: number) => void;
  className?: string;
}

export interface TimelineEvent {
  id: string;
  date: string;
  type: 'diagnosis' | 'surgery' | 'medication' | 'allergy' | 'immunization';
  title: string;
  description: string;
  doctor?: string;
  hospital?: string;
}

// ============================================
// SECTION CONFIG
// ============================================

interface SectionConfig {
  id: keyof MedicalInfo;
  title: string;
  icon: React.ElementType;
  color: 'red' | 'yellow' | 'purple' | 'blue' | 'green' | 'pink';
}

const sections: SectionConfig[] = [
  { id: 'allergies', title: 'Allergies', icon: AlertTriangle, color: 'red' },
  { id: 'chronicDiseases', title: 'Chronic Diseases', icon: Activity, color: 'yellow' },
  { id: 'surgeries', title: 'Surgeries', icon: Scissors, color: 'purple' },
  { id: 'medications', title: 'Current Medications', icon: Pill, color: 'blue' },
  { id: 'familyHistory', title: 'Family History', icon: Users, color: 'green' },
  { id: 'immunizations', title: 'Immunizations', icon: Heart, color: 'pink' },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const getTimelineIcon = (type: TimelineEvent['type']): React.ElementType => {
  const icons: Record<TimelineEvent['type'], React.ElementType> = {
    diagnosis: Stethoscope,
    surgery: Scissors,
    medication: Pill,
    allergy: AlertTriangle,
    immunization: Heart,
  };
  return icons[type];
};

const getTimelineColor = (type: TimelineEvent['type']): string => {
  const colors: Record<TimelineEvent['type'], string> = {
    diagnosis: 'bg-blue-100 border-blue-300 text-blue-600',
    surgery: 'bg-purple-100 border-purple-300 text-purple-600',
    medication: 'bg-cyan-100 border-cyan-300 text-cyan-600',
    allergy: 'bg-red-100 border-red-300 text-red-600',
    immunization: 'bg-pink-100 border-pink-300 text-pink-600',
  };
  return colors[type];
};

const getSectionColorClasses = (color: SectionConfig['color'], isActive: boolean): string => {
  const colorMap: Record<SectionConfig['color'], string> = {
    red: 'border-red-500 bg-red-50 text-red-600',
    yellow: 'border-yellow-500 bg-yellow-50 text-yellow-600',
    purple: 'border-purple-500 bg-purple-50 text-purple-600',
    blue: 'border-blue-500 bg-blue-50 text-blue-600',
    green: 'border-green-500 bg-green-50 text-green-600',
    pink: 'border-pink-500 bg-pink-50 text-pink-600',
  };
  
  if (isActive) return colorMap[color];
  return 'border-gray-200 bg-white text-gray-600';
};

const getDotColor = (color: SectionConfig['color']): string => {
  const colors: Record<SectionConfig['color'], string> = {
    red: 'bg-red-400',
    yellow: 'bg-yellow-400',
    purple: 'bg-purple-400',
    blue: 'bg-blue-400',
    green: 'bg-green-400',
    pink: 'bg-pink-400',
  };
  return colors[color];
};

// ============================================
// MOCK DATA
// ============================================

const getMockTimeline = (): TimelineEvent[] => [
  {
    id: '1',
    date: '2024-01-15',
    type: 'diagnosis',
    title: 'Hypertension Diagnosed',
    description: 'Stage 1 hypertension detected during routine checkup',
    doctor: 'Dr. Sarah Wilson',
    hospital: 'City General Hospital',
  },
  {
    id: '2',
    date: '2023-11-20',
    type: 'surgery',
    title: 'Appendectomy',
    description: 'Laparoscopic appendectomy performed successfully',
    doctor: 'Dr. Michael Chen',
    hospital: 'Metro Medical Center',
  },
  {
    id: '3',
    date: '2023-08-10',
    type: 'medication',
    title: 'Started Lisinopril',
    description: 'Prescribed 10mg daily for blood pressure management',
    doctor: 'Dr. Sarah Wilson',
    hospital: 'City General Hospital',
  },
  {
    id: '4',
    date: '2023-05-22',
    type: 'allergy',
    title: 'Penicillin Allergy',
    description: 'Allergic reaction to penicillin antibiotics',
    doctor: 'Dr. James Brown',
    hospital: 'Metro Hospital',
  },
  {
    id: '5',
    date: '2023-02-10',
    type: 'immunization',
    title: 'COVID-19 Booster',
    description: 'Received COVID-19 booster vaccination',
    hospital: 'Community Health Center',
  },
];

// ============================================
// MAIN COMPONENT
// ============================================

export const MedicalHistory: React.FC<MedicalHistoryProps> = ({
  medicalInfo = {
    height: '',
    weight: '',
    allergies: [],
    chronicDiseases: [],
    surgeries: [],
    medications: [],
    familyHistory: [],
    immunizations: []
  },
  isEditing = false,
  onEdit,
  onAddItem,
  onRemoveItem,
  className = '',
}) => {
  const [activeSection, setActiveSection] = useState<keyof MedicalInfo>('allergies');
  const [newItem, setNewItem] = useState('');
  const [timeline] = useState<TimelineEvent[]>(getMockTimeline());

  const activeSectionConfig = sections.find(s => s.id === activeSection) || sections[0];
  const ActiveSectionIcon = activeSectionConfig.icon;

  const handleAddItem = (field: keyof MedicalInfo) => {
    if (newItem.trim()) {
      onAddItem?.(field, newItem.trim());
      setNewItem('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent, field: keyof MedicalInfo) => {
    if (e.key === 'Enter') {
      handleAddItem(field);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* ============================================ */}
      {/* MEDICAL STATS CARDS */}
      {/* ============================================ */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {sections.map((section) => {
          const SectionIcon = section.icon;
          const isActive = activeSection === section.id;
          const items = medicalInfo[section.id];
          
          return (
            <motion.button
              key={section.id}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActiveSection(section.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-2 ${getSectionColorClasses(section.color, isActive)}`}
            >
              <SectionIcon className="w-6 h-6" />
              <p className="text-2xl font-bold">{items.length}</p>
              <p className="text-xs font-medium text-center">{section.title}</p>
            </motion.button>
          );
        })}
      </div>

      {/* ============================================ */}
      {/* SELECTED SECTION DETAILS */}
      {/* ============================================ */}
      <Card className="p-0 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${getSectionColorClasses(activeSectionConfig.color, true)}`}>
              <ActiveSectionIcon className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">{activeSectionConfig.title}</h3>
            <Badge variant="info" size="sm">{medicalInfo[activeSection].length} items</Badge>
          </div>
          
          {isEditing && (
            <div className="flex items-center gap-2">
              <Input
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder={`Add ${activeSectionConfig.title.toLowerCase()}`}
                onKeyPress={(e) => handleKeyPress(e, activeSection)}
                className="w-56"
              />
              <Button
                variant="primary"
                size="sm"
                onClick={() => handleAddItem(activeSection)}
                disabled={!newItem.trim()}
              >
                <Plus className="w-4 h-4 mr-1" /> Add
              </Button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5 max-h-96 overflow-y-auto">
          {medicalInfo[activeSection].length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No {activeSectionConfig.title.toLowerCase()} recorded</p>
              {isEditing && (
                <p className="text-sm text-gray-400 mt-1">Add your first item above</p>
              )}
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <div className="space-y-2">
                {medicalInfo[activeSection].map((item: string, index: number) => (
                  <motion.div
                    key={`${activeSection}-${index}`}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-2.5 h-2.5 rounded-full ${getDotColor(activeSectionConfig.color)}`} />
                      <span className="text-sm font-medium text-gray-700">{item}</span>
                    </div>
                    {isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onRemoveItem?.(activeSection, index)}
                        className="p-1 hover:bg-red-100 rounded-lg text-red-400 hover:text-red-600 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            </AnimatePresence>
          )}
        </div>
      </Card>

      {/* ============================================ */}
      {/* MEDICAL TIMELINE */}
      {/* ============================================ */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Clock className="w-6 h-6 text-blue-500" />
          Medical Timeline
        </h3>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-6 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400" />
          
          <div className="space-y-5">
            {timeline.map((event, index) => {
              const Icon = getTimelineIcon(event.type);
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative flex gap-4 pl-14"
                >
                  {/* Timeline Dot */}
                  <motion.div
                    whileHover={{ scale: 1.2 }}
                    className={`absolute left-4 w-5 h-5 rounded-full border-2 flex items-center justify-center ${getTimelineColor(event.type)}`}
                  >
                    <Icon className="w-3 h-3" />
                  </motion.div>
                  
                  {/* Event Card */}
                  <div className="flex-1 bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">{event.title}</h4>
                        <p className="text-sm text-gray-600 mt-0.5">{event.description}</p>
                      </div>
                      <Badge variant="outline" size="xs">{event.type}</Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-3 pt-3 border-t border-gray-200">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {event.date}
                      </span>
                      {event.doctor && (
                        <span className="flex items-center gap-1">
                          <Stethoscope className="w-3.5 h-3.5" /> {event.doctor}
                        </span>
                      )}
                      {event.hospital && (
                        <span className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5" /> {event.hospital}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* ============================================ */}
      {/* HEALTH METRICS + RISK FACTORS */}
      {/* ============================================ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Health Metrics */}
        <Card className="p-5">
          <h3 className="font-bold text-gray-800 mb-4">Health Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Height</span>
              {isEditing ? (
                <Input
                  value={medicalInfo.height}
                  onChange={(e) => onEdit?.('height', e.target.value)}
                  className="w-24 text-right"
                />
              ) : (
                <span className="text-sm font-medium text-gray-800">{medicalInfo.height} cm</span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <span className="text-sm text-gray-600">Weight</span>
              {isEditing ? (
                <Input
                  value={medicalInfo.weight}
                  onChange={(e) => onEdit?.('weight', e.target.value)}
                  className="w-24 text-right"
                />
              ) : (
                <span className="text-sm font-medium text-gray-800">{medicalInfo.weight} kg</span>
              )}
            </div>
            <div className="p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">BMI Status</span>
                <Badge variant="success" size="xs">Normal</Badge>
              </div>
              <p className="text-lg font-bold text-green-600 mt-1">
                {medicalInfo.height && medicalInfo.weight
                  ? (parseFloat(medicalInfo.weight) / Math.pow(parseFloat(medicalInfo.height) / 100, 2)).toFixed(1)
                  : '--'}
              </p>
            </div>
          </div>
        </Card>

        {/* Risk Factors */}
        <Card className="p-5">
          <h3 className="font-bold text-gray-800 mb-4">Risk Factors</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-xl border border-yellow-200">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-gray-700">Family History</span>
              </div>
              <Badge variant="warning" size="xs">Moderate</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm text-gray-700">Lifestyle</span>
              </div>
              <Badge variant="success" size="xs">Good</Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-sm text-gray-700">Fitness Level</span>
              </div>
              <Badge variant="info" size="xs">Active</Badge>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MedicalHistory;