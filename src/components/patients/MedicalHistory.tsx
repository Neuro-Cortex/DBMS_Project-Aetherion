import React, { lazy, useState } from 'react';
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
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { clsx } from 'clsx';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

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
  medicalInfo: MedicalInfo;
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
// MEDICAL HISTORY COMPONENT
// ============================================
export const MedicalHistory: React.FC<MedicalHistoryProps> = ({
  medicalInfo,
  variant = 'glass',
  isEditing = false,
  onEdit,
  onAddItem,
  onRemoveItem,
  className,
}) => {
  const [activeSection, setActiveSection] = useState<string>('allergies');
  const [newItem, setNewItem] = useState('');
  const [timeline] = useState<TimelineEvent[]>([
    {
      id: '1',
      date: '2024-01-15',
      type: 'diagnosis',
      title: 'Hypertension Diagnosed',
      description: 'Stage 1 hypertension detected during routine checkup',
      doctor: 'Dr. Sarah Johnson',
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
      doctor: 'Dr. Sarah Johnson',
      hospital: 'City General Hospital',
    },
  ]);

  const sections = [
    { id: 'allergies', title: 'Allergies', icon: AlertTriangle, color: 'red' },
    { id: 'chronicDiseases', title: 'Chronic Diseases', icon: Activity, color: 'yellow' },
    { id: 'surgeries', title: 'Surgeries', icon: Scissors, color: 'purple' },
    { id: 'medications', title: 'Current Medications', icon: Pill, color: 'blue' },
    { id: 'familyHistory', title: 'Family History', icon: Users, color: 'green' },
    { id: 'immunizations', title: 'Immunizations', icon: Heart, color: 'pink' },
  ] as const;

  const getIcon = (type: TimelineEvent['type']) => {
    const icons = {
      diagnosis: Stethoscope,
      surgery: Scissors,
      medication: Pill,
      allergy: AlertTriangle,
      immunization: Heart,
    };
    return icons[type];
  };

  const getColor = (type: TimelineEvent['type']) => {
    const colors = {
      diagnosis: 'text-blue-400 bg-blue-500/10 border-blue-500/30',
      surgery: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
      medication: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
      allergy: 'text-red-400 bg-red-500/10 border-red-500/30',
      immunization: 'text-pink-400 bg-pink-500/10 border-pink-500/30',
    };
    return colors[type];
  };

  const handleAddItem = (field: keyof MedicalInfo) => {
    if (newItem.trim()) {
      onAddItem?.(field, newItem.trim());
      setNewItem('');
    }
  };

  const handleRemoveItem = (field: keyof MedicalInfo, index: number) => {
    onRemoveItem?.(field, index);
  };

  return (
    <div className={twMerge('space-y-6', className)}>
      {/* Medical Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {sections.map((section, i) => (
          <motion.button
            key={section.id}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveSection(section.id)}
            className={clsx(
              'p-4 rounded-xl text-center transition-all',
              'bg-white/5 hover:bg-white/10 border border-white/10',
              activeSection === section.id && clsx(
                'border-2',
                `border-${section.color}-500/50`,
                `bg-${section.color}-500/10`
              )
            )}
          >
            <section.icon className={clsx('w-6 h-6 mx-auto mb-2', `text-${section.color}-400`)} />
            <p className="text-2xl font-black text-white mb-1">
              {medicalInfo[section.id as keyof MedicalInfo].length}
            </p>
            <p className="text-xs text-white/60">{section.title}</p>
          </motion.button>
        ))}
      </div>

      {/* Selected Section Details */}
      <GlassmorphicCard variant={variant} className="p-0">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {sections.find(s => s.id === activeSection)?.icon && (
                React.createElement(sections.find(s => s.id === activeSection)!.icon, {
                  className: clsx('w-5 h-5', `text-${sections.find(s => s.id === activeSection)!.color}-400`)
                })
              )}
              <h3 className="text-xl font-bold text-white">
                {sections.find(s => s.id === activeSection)?.title}
              </h3>
            </div>
            {isEditing && (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newItem}
                  onChange={(e) => setNewItem(e.target.value)}
                  placeholder={`Add new ${sections.find(s => s.id === activeSection)?.title.toLowerCase().slice(0, -1)}`}
                  className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddItem(activeSection as keyof MedicalInfo)}
                />
                <Button
                  variant="neon"
                  size="xs"
                  iconOnly
                  onClick={() => handleAddItem(activeSection as keyof MedicalInfo)}
                  disabled={!newItem.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            {medicalInfo[activeSection as keyof MedicalInfo].length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <FileText className="w-12 h-12 text-white/20 mx-auto mb-4" />
                <p className="text-white/60">No {sections.find(s => s.id === activeSection)?.title.toLowerCase()} recorded</p>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {medicalInfo[activeSection as keyof MedicalInfo].map((item: string, index: number) => (
                  <motion.div
                    key={index}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05, type: 'spring' }}
                    className={clsx(
                      'flex items-center justify-between p-3 rounded-xl',
                      'bg-white/5 hover:bg-white/10 transition-all',
                      'border border-white/10 hover:border-white/20'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={clsx(
                        'w-2 h-2 rounded-full',
                        `bg-${sections.find(s => s.id === activeSection)!.color}-400`
                      )} />
                      <p className="text-sm text-white">{item}</p>
                    </div>
                    {isEditing && (
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRemoveItem(activeSection as keyof MedicalInfo, index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </GlassmorphicCard>

      {/* Timeline */}
      <GlassmorphicCard variant={variant}>
        <div className="p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-cyan-400" />
            Medical Timeline
          </h3>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-cyan-500 to-purple-500" />
            <div className="space-y-6">
              <AnimatePresence>
                {timeline.map((event, i) => {
                  const Icon = getIcon(event.type);
                  return (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative flex gap-4 pl-16"
                    >
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className={clsx(
                          'absolute left-3 w-6 h-6 rounded-full flex items-center justify-center',
                          'bg-gray-900/90 border-2 border-white/20',
                          getColor(event.type)
                        )}
                      >
                        <Icon className="w-3 h-3" />
                      </motion.div>
                      <GlassmorphicCard variant="glass" className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-white font-bold">{event.title}</h4>
                            <p className="text-white/70 text-sm">{event.description}</p>
                          </div>
                          <Badge variant="outline" size="xs">
                            {event.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/60">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {event.date}
                          </div>
                          {event.doctor && (
                            <div className="flex items-center gap-1">
                              <Stethoscope className="w-3 h-3" />
                              {event.doctor}
                            </div>
                          )}
                          {event.hospital && (
                            <div className="flex items-center gap-1">
                              <Activity className="w-3 h-3" />
                              {event.hospital}
                            </div>
                          )}
                        </div>
                      </GlassmorphicCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Health Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassmorphicCard variant={variant}>
          <h3 className="text-lg font-bold text-white mb-4">Health Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <span className="text-sm text-white/60">Height</span>
              {isEditing ? (
                <input
                  type="text"
                  value={medicalInfo.height}
                  onChange={(e) => onEdit?.('height', e.target.value)}
                  className="w-24 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-right"
                />
              ) : (
                <span className="text-sm font-medium text-white">{medicalInfo.height} cm</span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <span className="text-sm text-white/60">Weight</span>
              {isEditing ? (
                <input
                  type="text"
                  value={medicalInfo.weight}
                  onChange={(e) => onEdit?.('weight', e.target.value)}
                  className="w-24 px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-sm text-right"
                />
              ) : (
                <span className="text-sm font-medium text-white">{medicalInfo.weight} kg</span>
              )}
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-white/60">BMI Status</span>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <p className="text-lg font-bold text-white">Normal Range</p>
            </div>
          </div>
        </GlassmorphicCard>

        <GlassmorphicCard variant={variant}>
          <h3 className="text-lg font-bold text-white mb-4">Risk Factors</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-500/10 rounded-xl border border-yellow-500/20">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-white/80">Family History</span>
              </div>
              <Badge variant="warning" size="xs">
                Moderate
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-xl border border-green-500/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm text-white/80">Lifestyle</span>
              </div>
              <Badge variant="success" size="xs">
                Good
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-400" />
                <span className="text-sm text-white/80">Fitness Level</span>
              </div>
              <Badge variant="info" size="xs">
                Active
              </Badge>
            </div>
          </div>
        </GlassmorphicCard>
      </div>
    </div>
  );
};
export const MedicalHistory = lazy(() => import(' @src/components/patients/MedicalHistory'));
