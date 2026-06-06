// src/pages/client/Veccine Tracking.tsx
// COMPLETE VACCINATION TRACKER - SIDEBAR REMOVED, ALL ERRORS FIXED
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { 
  Syringe, Plus, CheckCircle, AlertCircle,
  Calendar, Clock, Shield, Baby, User,
  FileText, Download, Bell, ChevronDown,
  Search, RefreshCw, Star, Activity, 
  Edit, Trash2, Printer, Share2,
} from 'lucide-react';

// ============================================
// UI COMPONENTS
// ============================================
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Avatar } from 'src/ui/Avatar';
import { Input } from 'src/ui/Input';
import { Modal } from 'src/ui/Modal';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface Vaccination {
  id: string;
  name: string;
  disease: string;
  dateAdministered?: string;
  nextDue?: string;
  status: 'completed' | 'due' | 'overdue' | 'scheduled' | 'upcoming';
  ageGroup: 'infant' | 'child' | 'teen' | 'adult' | 'senior';
  doseNumber: number;
  totalDoses: number;
  provider: string;
  location: string;
  lotNumber?: string;
  sideEffects?: string[];
  certificateUrl?: string;
  notes?: string;
  administeredBy?: string;
  facilityType?: 'hospital' | 'clinic' | 'pharmacy' | 'school' | 'other';
  cost?: number;
  insuranceCovered?: boolean;
}

interface VaccinationStats {
  total: number;
  completed: number;
  due: number;
  overdue: number;
  upcoming: number;
  coverage: number;
  onTime: number;
}

interface FamilyMember {
  id: string;
  name: string;
  relation: string;
  age: number;
  avatar: string;
  vaccinationCount: number;
}

// ============================================
// MOCK DATA
// ============================================
const mockVaccinations: Vaccination[] = [
  {
    id: '1',
    name: 'COVID-19 (Pfizer)',
    disease: 'COVID-19',
    dateAdministered: '2024-01-15',
    nextDue: '2024-07-15',
    status: 'completed',
    ageGroup: 'adult',
    doseNumber: 2,
    totalDoses: 2,
    provider: 'City General Hospital',
    location: 'New York, NY',
    lotNumber: 'PF-2024-ABC123',
    sideEffects: ['Mild fatigue', 'Sore arm', 'Low-grade fever'],
    certificateUrl: 'https://cert.example.com/covid-123',
    administeredBy: 'Dr. Sarah Johnson',
    facilityType: 'hospital',
    cost: 0,
    insuranceCovered: true,
  },
  {
    id: '2',
    name: 'Influenza (Quadrivalent)',
    disease: 'Influenza',
    dateAdministered: '2023-10-01',
    nextDue: '2024-10-01',
    status: 'due',
    ageGroup: 'adult',
    doseNumber: 1,
    totalDoses: 1,
    provider: 'Metro Medical Center',
    location: 'Brooklyn, NY',
    lotNumber: 'FLU-2023-XYZ789',
    sideEffects: ['Soreness at injection site'],
    administeredBy: 'Dr. Michael Chen',
    facilityType: 'clinic',
    cost: 25,
    insuranceCovered: true,
  },
  {
    id: '3',
    name: 'Tetanus Booster (Tdap)',
    disease: 'Tetanus, Diphtheria, Pertussis',
    dateAdministered: '2021-03-10',
    nextDue: '2031-03-10',
    status: 'completed',
    ageGroup: 'adult',
    doseNumber: 1,
    totalDoses: 1,
    provider: 'Community Health Center',
    location: 'Queens, NY',
    lotNumber: 'TDAP-2021-DEF456',
    sideEffects: ['Arm swelling', 'Body ache'],
    administeredBy: 'Dr. Emily White',
    facilityType: 'clinic',
    cost: 45,
    insuranceCovered: false,
  },
  {
    id: '4',
    name: 'Hepatitis B',
    disease: 'Hepatitis B',
    dateAdministered: '2023-06-20',
    nextDue: '2023-12-20',
    status: 'overdue',
    ageGroup: 'adult',
    doseNumber: 2,
    totalDoses: 3,
    provider: 'City General Hospital',
    location: 'New York, NY',
    lotNumber: 'HEP-2023-GHI789',
    sideEffects: [],
    administeredBy: 'Dr. Robert Brown',
    facilityType: 'hospital',
    cost: 50,
    insuranceCovered: true,
  },
  {
    id: '5',
    name: 'MMR (Measles, Mumps, Rubella)',
    disease: 'Measles, Mumps, Rubella',
    status: 'upcoming',
    ageGroup: 'adult',
    doseNumber: 1,
    totalDoses: 2,
    provider: 'Scheduled',
    location: 'Manhattan Clinic',
    nextDue: '2026-06-15',
    facilityType: 'clinic',
    cost: 85,
    insuranceCovered: true,
  },
  {
    id: '6',
    name: 'Shingles (Shingrix)',
    disease: 'Herpes Zoster',
    dateAdministered: '2025-02-10',
    nextDue: '2025-08-10',
    status: 'completed',
    ageGroup: 'senior',
    doseNumber: 1,
    totalDoses: 2,
    provider: 'Senior Care Medical',
    location: 'Manhattan, NY',
    lotNumber: 'SHN-2025-JKL012',
    sideEffects: ['Fatigue', 'Headache', 'Muscle pain'],
    certificateUrl: 'https://cert.example.com/shingles-456',
    administeredBy: 'Dr. Lisa Anderson',
    facilityType: 'hospital',
    cost: 0,
    insuranceCovered: true,
  },
];

const familyMembers: FamilyMember[] = [
  { id: '1', name: 'John Doe', relation: 'Self', age: 34, avatar: 'JD', vaccinationCount: 12 },
  { id: '2', name: 'Sarah Doe', relation: 'Spouse', age: 32, avatar: 'SD', vaccinationCount: 10 },
  { id: '3', name: 'Emma Doe', relation: 'Daughter', age: 5, avatar: 'ED', vaccinationCount: 18 },
  { id: '4', name: 'Liam Doe', relation: 'Son', age: 2, avatar: 'LD', vaccinationCount: 15 },
];

// ============================================
// COLOR MAPS
// ============================================
const statusColors: Record<string, string> = {
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  due: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
  overdue: 'bg-red-500/10 text-red-400 border-red-500/30',
  scheduled: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  upcoming: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
};

const ageGroupIcons: Record<string, React.ElementType> = {
  infant: Baby,
  child: User,
  teen: User,
  adult: User,
  senior: User,
};

const ageGroupColors: Record<string, string> = {
  infant: 'text-pink-400',
  child: 'text-blue-400',
  teen: 'text-purple-400',
  adult: 'text-cyan-400',
  senior: 'text-amber-400',
};

const ageGroupLabels: Record<string, string> = {
  infant: 'Infant (0-2)',
  child: 'Child (2-12)',
  teen: 'Teen (12-18)',
  adult: 'Adult (18-65)',
  senior: 'Senior (65+)',
};

// Safe color config for Tailwind (no dynamic classes)
const statColorMap: Record<string, { bg: string; text: string }> = {
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
};

// ============================================
// VACCINATION CARD COMPONENT
// ============================================
const VaccinationCard: React.FC<{
  vaccination: Vaccination;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onGenerateCert: () => void;
  onSchedule: () => void;
}> = ({ vaccination, isExpanded, onToggle, onEdit, onDelete, onGenerateCert, onSchedule }) => {
  const Icon = ageGroupIcons[vaccination.ageGroup] || User;
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <GlassmorphicCard className="p-0 overflow-hidden border-white/[0.06]">
        <motion.div
          className="p-5 cursor-pointer"
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.03)' }}
          onClick={onToggle}
        >
          <div className="flex items-start gap-4">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 5 }}
              className={`p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] ${
                vaccination.status === 'completed' ? 'border-emerald-500/30' :
                vaccination.status === 'overdue' ? 'border-red-500/30' :
                vaccination.status === 'due' ? 'border-amber-500/30' : 'border-purple-500/30'
              }`}
            >
              <Icon className={`w-6 h-6 ${ageGroupColors[vaccination.ageGroup]}`} />
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="text-base font-bold text-white">{vaccination.name}</h4>
                  <p className="text-sm text-slate-400">{vaccination.disease}</p>
                </div>
                <Badge className={statusColors[vaccination.status]} size="sm">
                  {vaccination.status.charAt(0).toUpperCase() + vaccination.status.slice(1)}
                </Badge>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                {vaccination.dateAdministered && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {vaccination.dateAdministered}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Syringe className="w-3.5 h-3.5" />
                  Dose {vaccination.doseNumber}/{vaccination.totalDoses}
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5" />
                  {ageGroupLabels[vaccination.ageGroup]}
                </span>
                {vaccination.nextDue && (
                  <span className={`flex items-center gap-1 ${
                    vaccination.status === 'overdue' ? 'text-red-400' : 'text-amber-400'
                  }`}>
                    <Clock className="w-3.5 h-3.5" />
                    Next: {vaccination.nextDue}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" size="xs">{vaccination.provider}</Badge>
                <span className="text-xs text-slate-600">{vaccination.location}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {vaccination.certificateUrl && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => { e.stopPropagation(); window.open(vaccination.certificateUrl, '_blank'); }}
                  className="p-2 rounded-lg hover:bg-emerald-500/10 text-emerald-400 transition-colors"
                  title="Download Certificate"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
              )}
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="p-2"
              >
                <ChevronDown className="w-4 h-4 text-slate-500" />
              </motion.div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="border-t border-white/[0.06]"
            >
              <div className="p-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      Administration Details
                    </h5>
                    <div className="space-y-2 text-sm">
                      {vaccination.administeredBy && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Administered By:</span>
                          <span className="text-white">{vaccination.administeredBy}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-slate-500">Provider:</span>
                        <span className="text-white">{vaccination.provider}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Location:</span>
                        <span className="text-white">{vaccination.location}</span>
                      </div>
                      {vaccination.lotNumber && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Lot Number:</span>
                          <span className="text-white font-mono text-xs">{vaccination.lotNumber}</span>
                        </div>
                      )}
                      {vaccination.facilityType && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Facility Type:</span>
                          <Badge variant="info" size="xs">{vaccination.facilityType}</Badge>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h5 className="text-sm font-bold text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-400" />
                      Dose Information
                    </h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Dose Progress:</span>
                        <Badge variant="info" size="xs">
                          {vaccination.doseNumber} of {vaccination.totalDoses}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Age Group:</span>
                        <span className={ageGroupColors[vaccination.ageGroup]}>
                          {ageGroupLabels[vaccination.ageGroup]}
                        </span>
                      </div>
                      {vaccination.nextDue && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Next Due:</span>
                          <Badge variant={vaccination.status === 'overdue' ? 'error' : 'warning'} size="xs">
                            {vaccination.nextDue}
                          </Badge>
                        </div>
                      )}
                      {vaccination.cost !== undefined && (
                        <div className="flex justify-between">
                          <span className="text-slate-500">Cost:</span>
                          <span className="text-white">
                            {vaccination.cost === 0 ? 'Free' : `$${vaccination.cost}`}
                            {vaccination.insuranceCovered && (
                              <Badge variant="success" size="xs" className="ml-2">Insured</Badge>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {vaccination.sideEffects && vaccination.sideEffects.length > 0 && (
                  <div>
                    <h5 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-400" />
                      Reported Side Effects
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {vaccination.sideEffects.map((effect, i) => (
                        <Badge key={i} variant="warning" size="xs" className="bg-amber-500/10 text-amber-400">
                          {effect}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <div className="flex justify-between text-xs mb-2">
                    <span className="text-slate-500">Vaccination Progress</span>
                    <span className="text-white font-bold">
                      {Math.round((vaccination.doseNumber / vaccination.totalDoses) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-white/[0.03] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(vaccination.doseNumber / vaccination.totalDoses) * 100}%` }}
                      className={`h-full rounded-full ${
                        vaccination.status === 'completed' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                        vaccination.status === 'overdue' ? 'bg-gradient-to-r from-red-500 to-rose-500' :
                        'bg-gradient-to-r from-blue-500 to-cyan-500'
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    {vaccination.status === 'completed' && !vaccination.certificateUrl && (
                      <Button variant="success" size="sm" onClick={onGenerateCert}>
                        <FileText className="w-4 h-4 mr-2" /> Generate Certificate
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={onSchedule}>
                      <Bell className="w-4 h-4 mr-2" /> Set Reminder
                    </Button>
                    <Button variant="outline" size="sm" onClick={onEdit}>
                      <Edit className="w-4 h-4 mr-2" /> Edit
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Printer className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={onDelete} className="text-red-400 hover:text-red-300">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </GlassmorphicCard>
    </motion.div>
  );
};

// ============================================
// ADD VACCINATION MODAL
// ============================================
const AddVaccinationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (vaccination: Omit<Vaccination, 'id'>) => void;
}> = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState<Partial<Vaccination>>({
    name: '',
    disease: '',
    dateAdministered: '',
    nextDue: '',
    ageGroup: 'adult',
    doseNumber: 1,
    totalDoses: 1,
    provider: '',
    location: '',
    lotNumber: '',
    administeredBy: '',
    facilityType: 'clinic',
    cost: 0,
    insuranceCovered: true,
    notes: '',
  });

  const handleSubmit = () => {
    if (formData.name && formData.disease) {
      onAdd({
        ...formData as any,
        status: formData.dateAdministered ? 'completed' : 'upcoming',
        sideEffects: [],
      });
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Vaccination Record">
      <div className="space-y-4 p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Vaccine Name *</label>
            <Input
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., COVID-19 Pfizer"
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Disease *</label>
            <Input
              value={formData.disease || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, disease: e.target.value }))}
              placeholder="e.g., COVID-19"
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Date Administered</label>
            <Input
              type="date"
              value={formData.dateAdministered || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, dateAdministered: e.target.value }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Next Due Date</label>
            <Input
              type="date"
              value={formData.nextDue || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, nextDue: e.target.value }))}
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Age Group</label>
            <select
              value={formData.ageGroup}
              onChange={(e) => setFormData(prev => ({ ...prev, ageGroup: e.target.value as any }))}
              className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none focus:border-cyan-500/30"
            >
              <option value="infant">Infant (0-2)</option>
              <option value="child">Child (2-12)</option>
              <option value="teen">Teen (12-18)</option>
              <option value="adult">Adult (18-65)</option>
              <option value="senior">Senior (65+)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Dose Number</label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={formData.doseNumber || 1}
                onChange={(e) => setFormData(prev => ({ ...prev, doseNumber: parseInt(e.target.value) }))}
                className="w-20"
              />
              <span className="text-slate-500">of</span>
              <Input
                type="number"
                value={formData.totalDoses || 1}
                onChange={(e) => setFormData(prev => ({ ...prev, totalDoses: parseInt(e.target.value) }))}
                className="w-20"
              />
            </div>
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Provider</label>
            <Input
              value={formData.provider || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, provider: e.target.value }))}
              placeholder="e.g., City Hospital"
              className="w-full"
            />
          </div>
          <div>
            <label className="text-xs text-slate-400 mb-1 block">Location</label>
            <Input
              value={formData.location || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., New York, NY"
              className="w-full"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={!formData.name || !formData.disease}
            className="bg-gradient-to-r from-cyan-500 to-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Vaccination
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// ============================================
// MAIN VACCINATION TRACKER PAGE
// ============================================
const VaccinationTrackerPage: React.FC = () => {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>(mockVaccinations);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterAgeGroup, setFilterAgeGroup] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMember, setSelectedMember] = useState<string>('1');

  const stats: VaccinationStats = {
    total: vaccinations.length,
    completed: vaccinations.filter(v => v.status === 'completed').length,
    due: vaccinations.filter(v => v.status === 'due').length,
    overdue: vaccinations.filter(v => v.status === 'overdue').length,
    upcoming: vaccinations.filter(v => v.status === 'upcoming').length,
    coverage: vaccinations.length > 0 
      ? Math.round((vaccinations.filter(v => v.status === 'completed').length / vaccinations.length) * 100)
      : 0,
    onTime: vaccinations.filter(v => v.status === 'completed' || v.status === 'due').length,
  };

  const filteredVaccinations = vaccinations.filter(vacc => {
    if (filterStatus !== 'all' && vacc.status !== filterStatus) return false;
    if (filterAgeGroup !== 'all' && vacc.ageGroup !== filterAgeGroup) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        vacc.name.toLowerCase().includes(query) ||
        vacc.disease.toLowerCase().includes(query) ||
        vacc.provider.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const handleAddVaccination = (vaccination: Omit<Vaccination, 'id'>) => {
    const newVaccination: Vaccination = {
      ...vaccination,
      id: Date.now().toString(),
    };
    setVaccinations(prev => [...prev, newVaccination]);
  };

  const handleDeleteVaccination = (id: string) => {
    setVaccinations(prev => prev.filter(v => v.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const handleGenerateCertificate = (id: string) => {
    setVaccinations(prev => prev.map(v => 
      v.id === id ? { ...v, certificateUrl: `https://cert.medicare.com/${id}` } : v
    ));
  };

  return (
    <div className="min-h-screen bg-[#020408] p-4 lg:p-8 space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white flex items-center gap-3">
            <Syringe className="w-8 h-8 text-cyan-400" />
            Vaccination Tracker
          </h1>
          <p className="text-slate-400 text-sm mt-1">Manage your family's immunization records</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" /> Sync Records
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-500"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Vaccination
          </Button>
        </div>
      </motion.div>

      {/* Family Members */}
      <div className="flex gap-3 overflow-x-auto pb-2">
        {familyMembers.map((member) => (
          <motion.button
            key={member.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedMember(member.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl border transition-all whitespace-nowrap ${
              selectedMember === member.id
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border-cyan-500/30'
                : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04]'
            }`}
          >
            <Avatar name={member.avatar} size="sm" />
            <div className="text-left">
              <p className="text-white text-sm font-bold">{member.name}</p>
              <p className="text-slate-500 text-xs">{member.relation} • {member.vaccinationCount} vaccines</p>
            </div>
          </motion.button>
        ))}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed border-white/[0.08] text-slate-500 hover:text-white transition-all whitespace-nowrap"
        >
          <Plus className="w-4 h-4" /> Add Member
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { icon: Syringe, label: 'Total', value: stats.total, color: 'cyan' },
          { icon: CheckCircle, label: 'Completed', value: stats.completed, color: 'emerald' },
          { icon: Clock, label: 'Due Soon', value: stats.due, color: 'amber' },
          { icon: AlertCircle, label: 'Overdue', value: stats.overdue, color: 'red' },
          { icon: Calendar, label: 'Upcoming', value: stats.upcoming, color: 'purple' },
          { icon: Shield, label: 'Coverage', value: `${stats.coverage}%`, color: 'blue' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          const colors = statColorMap[stat.color] || statColorMap.cyan;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="p-4 text-center hover:shadow-lg transition-all group cursor-pointer">
                <div className={`inline-flex p-2.5 rounded-xl ${colors.bg} mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 ${colors.text}`} />
                </div>
                <p className="text-xl lg:text-2xl font-black text-white">{stat.value}</p>
                <p className="text-xs text-slate-400">{stat.label}</p>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vaccines..."
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-cyan-500/30"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="due">Due</option>
          <option value="overdue">Overdue</option>
          <option value="upcoming">Upcoming</option>
        </select>
        <select
          value={filterAgeGroup}
          onChange={(e) => setFilterAgeGroup(e.target.value)}
          className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white text-sm focus:outline-none"
        >
          <option value="all">All Ages</option>
          <option value="infant">Infant (0-2)</option>
          <option value="child">Child (2-12)</option>
          <option value="teen">Teen (12-18)</option>
          <option value="adult">Adult (18-65)</option>
          <option value="senior">Senior (65+)</option>
        </select>
      </div>

      {/* Vaccinations List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filteredVaccinations.map((vaccination) => (
            <VaccinationCard
              key={vaccination.id}
              vaccination={vaccination}
              isExpanded={expandedId === vaccination.id}
              onToggle={() => setExpandedId(expandedId === vaccination.id ? null : vaccination.id)}
              onEdit={() => {}}
              onDelete={() => handleDeleteVaccination(vaccination.id)}
              onGenerateCert={() => handleGenerateCertificate(vaccination.id)}
              onSchedule={() => {}}
            />
          ))}
        </AnimatePresence>

        {filteredVaccinations.length === 0 && (
          <div className="text-center py-16">
            <Syringe className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg">No vaccination records found</p>
            <Button variant="primary" className="mt-4" onClick={() => setShowAddModal(true)}>
              <Plus className="w-4 h-4 mr-2" /> Add Your First Vaccination
            </Button>
          </div>
        )}
      </div>

      {/* Recommended Schedule */}
      <GlassmorphicCard className="p-6">
        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" /> Recommended Immunization Schedule
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <Baby className="w-5 h-5 text-pink-400" /> Infant (0-2 years)
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {['Hepatitis B (Birth, 1-2m, 6-18m)', 'DTaP (2,4,6,15-18m)', 'Polio IPV (2,4,6-18m)', 'Hib (2,4,6,12-15m)', 'PCV13 (2,4,6,12-15m)', 'Rotavirus (2,4,6m)'].map((v, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 mt-0.5 flex-shrink-0" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <User className="w-5 h-5 text-cyan-400" /> Adult (18-65 years)
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {['Influenza (Yearly)', 'Tdap Booster (Every 10 years)', 'COVID-19 (Primary + Boosters)', 'HPV (Up to 26 years)', 'Shingles (50+ years)', 'Pneumococcal (65+ years)'].map((v, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400 mt-0.5 flex-shrink-0" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04]">
            <h4 className="text-white font-bold mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" /> Senior (65+ years)
            </h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {['Influenza (High-dose, Yearly)', 'Pneumococcal (PPSV23, PCV13)', 'Shingles (Shingrix, 2 doses)', 'COVID-19 Booster', 'Tdap (If not received)', 'RSV (60+ years)'].map((v, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-amber-400 mt-0.5 flex-shrink-0" />
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Add Vaccination Modal */}
      <AddVaccinationModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddVaccination}
      />
    </div>
  );
};

export default VaccinationTrackerPage;