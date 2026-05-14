import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  Shield,
  Edit2,
  Save,
  X,
  Camera,
  CreditCard,
  Activity,
  FileText,
  AlertCircle,
  Plus,
  Users,
  Globe,
  Lock,
  Unlock
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Avatar } from '../../ui/Avatar';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Tabs } from '../../ui/Tabs';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  bloodGroup: string;
  avatar?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  emergencyContacts: Array<{
    name: string;
    relationship: string;
    phone: string;
  }>;
  insurance: {
    provider: string;
    policyNumber: string;
    groupNumber: string;
    validUntil: string;
  };
  medicalInfo: {
    height: string;
    weight: string;
    allergies: string[];
    chronicDiseases: string[];
    surgeries: string[];
    medications: string[];
  };
  status: 'active' | 'inactive';
  privacyLevel: 'public' | 'private' | 'restricted';
  createdAt: string;
}

export interface PatientProfileProps {
  patient: Patient;
  variant?: 'glass' | 'gradient' | 'neon';
  onEdit?: (field: keyof Patient, value: any) => void;
  onEmergencyContactAdd?: () => void;
  onInsuranceUpdate?: () => void;
  className?: string;
}

// ============================================
// PATIENT PROFILE COMPONENT
// ============================================
export const PatientProfile: React.FC<PatientProfileProps> = ({
  patient,
  variant = 'glass',
  onEdit,
  onEmergencyContactAdd,
  onInsuranceUpdate,
  className,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [imageError, setImageError] = useState(false);
  const [editData, setEditData] = useState(patient);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    { id: 'medical', label: 'Medical Data', icon: Activity },
    { id: 'contacts', label: 'Emergency Contacts', icon: Users },
    { id: 'insurance', label: 'Insurance', icon: CreditCard },
    { id: 'privacy', label: 'Privacy', icon: Lock },
  ];

  const calculateAge = (dob: string) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleSave = () => {
    // Apply changes
    Object.keys(editData).forEach(key => {
      onEdit?.(key as keyof Patient, (editData as any)[key]);
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      className={twMerge(
        clsx(
          'max-w-7xl mx-auto space-y-6',
          className
        )
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header Card */}
      <GlassmorphicCard variant={variant}>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Patient Info */}
          <div className="flex items-start gap-6 flex-1">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Avatar
                src={!imageError ? patient.avatar : undefined}
                name={patient.name}
                size="xl"
                onError={() => setImageError(true)}
                className="border-4 border-cyan-400 shadow-lg shadow-cyan-500/30"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-800 shadow-lg"
                onClick={() => {
                  // Trigger image upload
                }}
              >
                <Camera className="w-5 h-5 text-white" />
              </motion.button>
            </motion.div>

            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <motion.h1 
                    className="text-3xl font-black text-white mb-2"
                    animate={{ scale: [1, 1.01, 1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {patient.name}
                  </motion.h1>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="gradient" size="sm">
                      {patient.bloodGroup} Blood
                    </Badge>
                    <Badge variant="outline" size="sm">
                      Age: {calculateAge(patient.dateOfBirth)} years
                    </Badge>
                    <Badge variant={patient.status === 'active' ? 'success' : 'danger'} size="sm">
                      {patient.status}
                    </Badge>
                  </div>
                </div>

                {/* Edit Toggle */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsEditing(!isEditing)}
                  className={clsx(
                    'p-3 rounded-2xl transition-all',
                    isEditing 
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  )}
                >
                  {isEditing ? (
                    <Save className="w-5 h-5" />
                  ) : (
                    <Edit2 className="w-5 h-5" />
                  )}
                </motion.button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="text-center p-3 bg-white/5 rounded-xl"
                >
                  <Calendar className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-white">
                    {new Date(patient.createdAt).getFullYear()}
                  </p>
                  <p className="text-xs text-white/60">Member Since</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="text-center p-3 bg-white/5 rounded-xl"
                >
                  <Activity className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-white">
                    {patient.medicalInfo.chronicDiseases.length}
                  </p>
                  <p className="text-xs text-white/60">Conditions</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="text-center p-3 bg-white/5 rounded-xl"
                >
                  <Shield className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-white">
                    {patient.privacyLevel}
                  </p>
                  <p className="text-xs text-white/60">Privacy</p>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="text-center p-3 bg-white/5 rounded-xl"
                >
                  <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
                  <p className="text-lg font-bold text-white">
                    {patient.medicalInfo.allergies.length}
                  </p>
                  <p className="text-xs text-white/60">Allergies</p>
                </motion.div>
              </div>

              {/* Contact Actions */}
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="gradient"
                  size="sm"
                  leftIcon={Phone}
                  className="flex-1 min-w-[120px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Call Patient
                </Button>
                <Button
                  variant="neon"
                  size="sm"
                  leftIcon={Mail}
                  className="flex-1 min-w-[120px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send Email
                </Button>
                <Button
                  variant="glassmorphic"
                  size="sm"
                  leftIcon={MessageSquare}
                  className="flex-1 min-w-[120px]"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Send SMS
                </Button>
              </div>
            </div>
          </div>

          {/* Quick Info */}
          <div className="lg:w-80 space-y-4">
            {/* QR Code Card */}
            <GlassmorphicCard variant="glass" className="p-4">
              <h3 className="text-lg font-bold text-white mb-3">Patient ID</h3>
              <div className="flex items-center justify-center mb-3">
                <div className="w-32 h-32 bg-white/10 rounded-xl flex items-center justify-center">
                  <div className="text-center">
                    <User className="w-8 h-8 text-white/40 mx-auto mb-2" />
                    <p className="text-xs text-white/60">QR Code</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/80 text-center font-mono">{patient.id}</p>
            </GlassmorphicCard>

            {/* Emergency Info */}
            <GlassmorphicCard variant="glass" className="p-4">
              <h3 className="text-lg font-bold text-white mb-3">Emergency Info</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Blood Group</span>
                  <Badge variant="danger" size="sm">
                    {patient.bloodGroup}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Gender</span>
                  <Badge variant="outline" size="sm">
                    {patient.gender}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/60">Privacy</span>
                  <Badge 
                    variant={patient.privacyLevel === 'public' ? 'success' : 'warning'} 
                    size="sm"
                  >
                    {patient.privacyLevel === 'public' ? (
                      <Unlock className="w-3 h-3 mr-1" />
                    ) : (
                      <Lock className="w-3 h-3 mr-1" />
                    )}
                    {patient.privacyLevel}
                  </Badge>
                </div>
              </div>
            </GlassmorphicCard>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="glassmorphic"
                size="sm"
                leftIcon={FileText}
                fullWidth
              >
                View Records
              </Button>
              <Button
                variant="glassmorphic"
                size="sm"
                leftIcon={Activity}
                fullWidth
              >
                Lab Reports
              </Button>
            </div>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Tabs Content */}
      <GlassmorphicCard variant={variant} className="p-0 overflow-hidden">
        <Tabs
          tabs={tabs}
          defaultTab="personal"
          onChange={setActiveTab}
          variant="glass"
        />

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Personal Info Tab */}
            {activeTab === 'personal' && (
              <motion.div
                key="personal"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ type: 'spring' }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Basic Information</h4>
                    <div className="space-y-4">
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                      >
                        <span className="text-sm text-white/60">Full Name</span>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                            className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                          />
                        ) : (
                          <span className="text-sm font-medium text-white">{patient.name}</span>
                        )}
                      </motion.div>

                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                      >
                        <span className="text-sm text-white/60">Email</span>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editData.email}
                            onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                            className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                          />
                        ) : (
                          <span className="text-sm font-medium text-white">{patient.email}</span>
                        )}
                      </motion.div>

                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                      >
                        <span className="text-sm text-white/60">Phone</span>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editData.phone}
                            onChange={(e) => setEditData(prev => ({ ...prev, phone: e.target.value }))}
                            className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                          />
                        ) : (
                          <span className="text-sm font-medium text-white">{patient.phone}</span>
                        )}
                      </motion.div>

                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                      >
                        <span className="text-sm text-white/60">Date of Birth</span>
                        <span className="text-sm font-medium text-white">
                          {new Date(patient.dateOfBirth).toLocaleDateString()} ({calculateAge(patient.dateOfBirth)} years)
                        </span>
                      </motion.div>

                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                      >
                        <span className="text-sm text-white/60">Gender</span>
                        <Badge variant="outline" size="sm">
                          {patient.gender}
                        </Badge>
                      </motion.div>

                      <motion.div
                        whileHover={{ x: 5 }}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                      >
                        <span className="text-sm text-white/60">Blood Group</span>
                        <Badge variant="danger" size="sm">
                          {patient.bloodGroup}
                        </Badge>
                      </motion.div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h4 className="text-lg font-bold text-white mb-4">Address</h4>
                    <div className="space-y-4">
                      {Object.entries(patient.address).map(([key, value], i) => (
                        <motion.div
                          key={key}
                          whileHover={{ x: 5 }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center justify-between p-3 bg-white/5 rounded-xl"
                        >
                          <span className="text-sm text-white/60 capitalize">{key}</span>
                          {isEditing ? (
                            <input
                              type="text"
                              value={(editData.address as any)[key]}
                              onChange={(e) => setEditData(prev => ({
                                ...prev,
                                address: { ...prev.address, [key]: e.target.value }
                              }))}
                              className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-white text-sm"
                            />
                          ) : (
                            <span className="text-sm font-medium text-white">{value}</span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Medical Info Preview */}
                <div className="mt-6 p-4 bg-gradient-to-r from-red-500/10 to-purple-500/10 rounded-xl border border-white/10">
                  <h5 className="text-white font-bold mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-400" />
                    Medical Information
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="text-center">
                      <p className="text-2xl font-black text-red-400">
                        {patient.medicalInfo.allergies.length}
                      </p>
                      <p className="text-xs text-white/60">Allergies</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-purple-400">
                        {patient.medicalInfo.chronicDiseases.length}
                      </p>
                      <p className="text-xs text-white/60">Conditions</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-black text-blue-400">
                        {patient.medicalInfo.medications.length}
                      </p>
                      <p className="text-xs text-white/60">Medications</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Medical Data Tab */}
            {activeTab === 'medical' && (
              <motion.div
                key="medical"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <MedicalHistory
                  medicalInfo={patient.medicalInfo}
                  variant={variant}
                  isEditing={isEditing}
                  onEdit={(field, value) => onEdit?.(`medicalInfo.${field}` as any, value)}
                />
              </motion.div>
            )}

            {/* Emergency Contacts Tab */}
            {activeTab === 'contacts' && (
              <motion.div
                key="contacts"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <EmergencyContacts
                  contacts={patient.emergencyContacts}
                  variant={variant}
                  isEditing={isEditing}
                  onAdd={onEmergencyContactAdd}
                  onEdit={(index, contact) => {
                    const updated = [...patient.emergencyContacts];
                    updated[index] = contact;
                    onEdit?.('emergencyContacts', updated);
                  }}
                />
              </motion.div>
            )}

            {/* Insurance Tab */}
            {activeTab === 'insurance' && (
              <motion.div
                key="insurance"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <InsuranceInfo
                  insurance={patient.insurance}
                  variant={variant}
                  isEditing={isEditing}
                  onUpdate={onInsuranceUpdate}
                />
              </motion.div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <motion.div
                key="privacy"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <PrivacySettings
                  privacyLevel={patient.privacyLevel}
                  variant={variant}
                  isEditing={isEditing}
                  onChange={(level) => onEdit?.('privacyLevel', level)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassmorphicCard>

      {/* Edit Actions */}
      <AnimatePresence>
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="flex justify-end gap-3"
          >
            <Button
              variant="glassmorphic"
              size="lg"
              leftIcon={X}
              onClick={() => {
                setIsEditing(false);
                setEditData(patient);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              size="lg"
              leftIcon={Save}
              onClick={handleSave}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Save Changes
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};