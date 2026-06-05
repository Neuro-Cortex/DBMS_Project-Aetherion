// src/pages/Settings.tsx
// USER SETTINGS PAGE
// Profile | Notifications | Privacy | Security | Appearance

import React, { useState } from 'react';
import {
  User, Bell, Shield, Moon, Sun, Globe,
  Lock, Eye,  Smartphone, Mail,
  Phone, MapPin, Calendar, Camera, Save,
  CheckCircle, AlertCircle, ChevronRight,
 Trash2, Download, 
  Settings as SettingsIcon,
  Activity, Pill, FileText, Heart, Fingerprint, Monitor
} from 'lucide-react';

// ============================================
// COMMON COMPONENTS
// ============================================
import { Card } from 'src/ui/Card';
import { Button } from 'src/ui/Button';
import { Input } from 'src/ui/Input';
import { Select } from 'src/ui/Select';

// ============================================
// TYPES
// ============================================

interface UserSettings {
  // Profile
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  bloodGroup: string;
  gender: string;
  language: string;
  timezone: string;
  
  // Notifications
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  appointmentReminders: boolean;
  medicationReminders: boolean;
  reportAlerts: boolean;
  newsletterSubscription: boolean;
  
  // Privacy
  showProfile: boolean;
  showMedicalHistory: boolean;
  showDonations: boolean;
  showOnlineStatus: boolean;
  
  // Security
  twoFactorEnabled: boolean;
  biometricEnabled: boolean;
  
  // Appearance
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
}

// ============================================
// MAIN COMPONENT
// ============================================

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [settings, setSettings] = useState<UserSettings>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1996-05-15',
    bloodGroup: 'O+',
    gender: 'male',
    language: 'en',
    timezone: 'America/New_York',
    
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    appointmentReminders: true,
    medicationReminders: true,
    reportAlerts: false,
    newsletterSubscription: false,
    
    showProfile: true,
    showMedicalHistory: false,
    showDonations: true,
    showOnlineStatus: true,
    
    twoFactorEnabled: false,
    biometricEnabled: true,
    
    theme: 'light',
    fontSize: 'medium'
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 3000);
  };

  const handleDeleteAccount = async () => {
    setShowDeleteConfirm(false);
    alert('Account deletion request sent. You will be contacted within 24 hours.');
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <User className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'privacy', label: 'Privacy', icon: <Eye className="w-4 h-4" /> },
    { id: 'security', label: 'Security', icon: <Shield className="w-4 h-4" /> },
    { id: 'appearance', label: 'Appearance', icon: <Moon className="w-4 h-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <SettingsIcon className="w-6 h-6 text-white" />
            </div>
            Settings
          </h1>
          <p className="text-gray-500 mt-1 ml-13">Manage your account preferences</p>
        </div>

        {/* Success Message */}
        {showSaved && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 animate-bounce">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700 font-medium">Settings saved successfully!</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* ============================================ */}
        {/* PROFILE SETTINGS */}
        {/* ============================================ */}
        {activeTab === 'profile' && (
          <Card className="p-6 space-y-5">
            {/* Profile Picture */}
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {settings.firstName[0]}{settings.lastName[0]}
              </div>
              <div>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" /> Change Photo
                </Button>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG or GIF. Max 2MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name"
                value={settings.firstName}
                onChange={(e) => setSettings({ ...settings, firstName: e.target.value })}
              />
              <Input
                label="Last Name"
                value={settings.lastName}
                onChange={(e) => setSettings({ ...settings, lastName: e.target.value })}
              />
              <Input
                label="Email Address"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                leftIcon={Mail}
              />
              <Input
                label="Phone Number"
                type="tel"
                value={settings.phone}
                onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                leftIcon={Phone}
              />
              <Input
                label="Date of Birth"
                type="date"
                value={settings.dateOfBirth}
                onChange={(e) => setSettings({ ...settings, dateOfBirth: e.target.value })}
              />
              <Select
                label="Blood Group"
                value={settings.bloodGroup}
                onChange={(value) => setSettings({ ...settings, bloodGroup: value as string })}
                options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => ({ value: bg, label: bg }))}
              />
              <Select
                label="Language"
                value={settings.language}
                onChange={(value) => setSettings({ ...settings, language: value as string })}
                options={[
                  { value: 'en', label: 'English' },
                  { value: 'bn', label: 'বাংলা' },
                  { value: 'es', label: 'Español' },
                  { value: 'fr', label: 'Français' }
                ]}
              />
              <Select
                label="Timezone"
                value={settings.timezone}
                onChange={(value) => setSettings({ ...settings, timezone: value as string })}
                options={[
                  { value: 'America/New_York', label: 'Eastern Time (US)' },
                  { value: 'America/Chicago', label: 'Central Time (US)' },
                  { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
                  { value: 'Asia/Dhaka', label: 'Dhaka (Bangladesh)' }
                ]}
              />
            </div>
          </Card>
        )}

        {/* ============================================ */}
        {/* NOTIFICATION SETTINGS */}
        {/* ============================================ */}
        {activeTab === 'notifications' && (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg pb-3 border-b">Notification Preferences</h3>
            
            <ToggleRow
              icon={<Mail className="w-5 h-5" />}
              label="Email Notifications"
              description="Receive updates via email"
              checked={settings.emailNotifications}
              onChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
            />
            <ToggleRow
              icon={<Phone className="w-5 h-5" />}
              label="SMS Notifications"
              description="Receive updates via text message"
              checked={settings.smsNotifications}
              onChange={(checked) => setSettings({ ...settings, smsNotifications: checked })}
            />
            <ToggleRow
              icon={<Smartphone className="w-5 h-5" />}
              label="Push Notifications"
              description="Receive updates on your device"
              checked={settings.pushNotifications}
              onChange={(checked) => setSettings({ ...settings, pushNotifications: checked })}
            />
            <ToggleRow
              icon={<Calendar className="w-5 h-5" />}
              label="Appointment Reminders"
              description="Get reminded before appointments"
              checked={settings.appointmentReminders}
              onChange={(checked) => setSettings({ ...settings, appointmentReminders: checked })}
            />
            <ToggleRow
              icon={<Pill className="w-5 h-5" />}
              label="Medication Reminders"
              description="Get reminded to take medicines"
              checked={settings.medicationReminders}
              onChange={(checked) => setSettings({ ...settings, medicationReminders: checked })}
            />
            <ToggleRow
              icon={<FileText className="w-5 h-5" />}
              label="Report Alerts"
              description="Get notified when reports are ready"
              checked={settings.reportAlerts}
              onChange={(checked) => setSettings({ ...settings, reportAlerts: checked })}
            />
            <ToggleRow
              icon={<Globe className="w-5 h-5" />}
              label="Newsletter"
              description="Receive health tips and updates"
              checked={settings.newsletterSubscription}
              onChange={(checked) => setSettings({ ...settings, newsletterSubscription: checked })}
            />
          </Card>
        )}

        {/* ============================================ */}
        {/* PRIVACY SETTINGS */}
        {/* ============================================ */}
        {activeTab === 'privacy' && (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg pb-3 border-b">Privacy Controls</h3>
            
            <ToggleRow
              icon={<User className="w-5 h-5" />}
              label="Show Profile Publicly"
              description="Allow others to see your profile"
              checked={settings.showProfile}
              onChange={(checked) => setSettings({ ...settings, showProfile: checked })}
            />
            <ToggleRow
              icon={<FileText className="w-5 h-5" />}
              label="Show Medical History"
              description="Share medical history with doctors"
              checked={settings.showMedicalHistory}
              onChange={(checked) => setSettings({ ...settings, showMedicalHistory: checked })}
            />
            <ToggleRow
              icon={<Heart className="w-5 h-5" />}
              label="Show Blood Donations"
              description="Display donation history on profile"
              checked={settings.showDonations}
              onChange={(checked) => setSettings({ ...settings, showDonations: checked })}
            />
            <ToggleRow
              icon={<Activity className="w-5 h-5" />}
              label="Show Online Status"
              description="Let others see when you're online"
              checked={settings.showOnlineStatus}
              onChange={(checked) => setSettings({ ...settings, showOnlineStatus: checked })}
            />

            <div className="pt-4 border-t">
              <Button variant="outline" className="text-blue-600">
                <Download className="w-4 h-4 mr-2" /> Download My Data
              </Button>
              <p className="text-xs text-gray-500 mt-2">Request a copy of all your data</p>
            </div>
          </Card>
        )}

        {/* ============================================ */}
        {/* SECURITY SETTINGS */}
        {/* ============================================ */}
        {activeTab === 'security' && (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg pb-3 border-b">Security Settings</h3>
            
            <ToggleRow
              icon={<Lock className="w-5 h-5" />}
              label="Two-Factor Authentication"
              description="Add extra security to your account"
              checked={settings.twoFactorEnabled}
              onChange={(checked) => setSettings({ ...settings, twoFactorEnabled: checked })}
            />
            <ToggleRow
              icon={<Fingerprint className="w-5 h-5" />}
              label="Biometric Login"
              description="Use fingerprint or face to login"
              checked={settings.biometricEnabled}
              onChange={(checked) => setSettings({ ...settings, biometricEnabled: checked })}
            />

            <div className="pt-4 border-t space-y-3">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" /> Change Password
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4" /> Connected Devices
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Login History
                </span>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ============================================ */}
        {/* APPEARANCE SETTINGS */}
        {/* ============================================ */}
        {activeTab === 'appearance' && (
          <Card className="p-6 space-y-4">
            <h3 className="font-semibold text-lg pb-3 border-b">Appearance</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'light' as const, icon: <Sun className="w-6 h-6" />, label: 'Light' },
                  { value: 'dark' as const, icon: <Moon className="w-6 h-6" />, label: 'Dark' },
                  { value: 'system' as const, icon: <Monitor className="w-6 h-6" />, label: 'System' }
                ].map((theme) => (
                  <button
                    key={theme.value}
                    onClick={() => setSettings({ ...settings, theme: theme.value })}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      settings.theme === theme.value
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-center mb-2">{theme.icon}</div>
                    <p className="text-sm font-medium">{theme.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Font Size</label>
              <div className="grid grid-cols-3 gap-3">
                {(['small', 'medium', 'large'] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setSettings({ ...settings, fontSize: size })}
                    className={`p-4 rounded-xl border-2 text-center transition-all ${
                      settings.fontSize === size
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className={`font-medium ${
                      size === 'small' ? 'text-sm' : size === 'medium' ? 'text-base' : 'text-lg'
                    }`}>Aa</p>
                    <p className="text-xs text-gray-500 mt-1 capitalize">{size}</p>
                  </button>
                ))}
              </div>
            </div>
          </Card>
        )}

        {/* ============================================ */}
        {/* SAVE BUTTON */}
        {/* ============================================ */}
        <div className="mt-6 flex justify-between">
          <Button
            variant="danger"
            onClick={() => setShowDeleteConfirm(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Account
          </Button>
          
          <Button
            variant="primary"
            size="lg"
            onClick={handleSave}
            isLoading={isSaving}
          >
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-4">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-2" />
                <h3 className="text-xl font-bold">Delete Account?</h3>
                <p className="text-gray-600 text-sm mt-2">
                  This action cannot be undone. All your data will be permanently deleted.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button variant="danger" className="flex-1" onClick={handleDeleteAccount}>
                  Yes, Delete
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

const ToggleRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = ({ icon, label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <div className="text-gray-400">{icon}</div>
      <div>
        <p className="font-medium text-sm">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors ${
        checked ? 'bg-blue-600' : 'bg-gray-300'
      }`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
        checked ? 'translate-x-6' : 'translate-x-0'
      }`} />
    </button>
  </div>
);

export default Settings;