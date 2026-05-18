// src/components/hospital/HospitalAccount.tsx
// HOSPITAL AUTHORITY ACCOUNT PAGE
// Profile | Departments | Doctors | Beds | Settings

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, User, Phone, Mail, MapPin, Globe,
  Calendar, Clock, Star, Shield, Award,
  Bed, Activity, Thermometer, Truck, Droplet,
  Wind, Users, Stethoscope, Settings, LogOut,
  Camera, Edit3, Save, X, Plus, Trash2,
  CheckCircle, AlertCircle, TrendingUp, TrendingDown
} from 'lucide-react';

// ============================================
// COMMON COMPONENTS
// ============================================
import { Avatar } from '../common/Avatar';
import { Badge } from '../common/Badge';
import { Button } from 'src/ui/Button';
import { Card } from 'src/ui/Card';
import { GlassmorphicCard } from 'src/ui/GlassmorphicCard';
import { Input } from 'src/ui/Input';
import { Select } from 'src/ui/Select';
import { Tabs } from 'src/ui/Tab';
import { Table } from 'src/ui/Table';
import { Modal } from 'src/ui/Modal';
import { Loader } from 'src/ui/Loader';

// ============================================
// TYPES
// ============================================

export interface HospitalProfile {
  id: string;
  name: string;
  registrationNumber: string;
  type: 'government' | 'private' | 'charitable';
  phone: string;
  emergencyPhone: string;
  email: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  totalBeds: number;
  availableBeds: number;
  icuBeds: number;
  icuAvailable: number;
  emergencyStatus: 'active' | 'busy' | 'unavailable';
  ambulanceCount: number;
  oxygenAvailable: boolean;
  bloodBankAvailable: boolean;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  is24x7: boolean;
  openingTime: string;
  closingTime: string;
  services: string[];
  departments: Department[];
  profileImage: string;
  coverImage: string;
  establishedYear: number;
  totalDoctors: number;
  totalNurses: number;
  totalStaff: number;
}

export interface Department {
  id: string;
  name: string;
  headDoctor: string;
  totalBeds: number;
  availableBeds: number;
  doctors: number;
  nurses: number;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const HospitalAccount: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [showSuccess, setShowSuccess] = useState(false);

  const [profile, setProfile] = useState<HospitalProfile>({
    id: 'hosp-001',
    name: 'City General Hospital',
    registrationNumber: 'HOSP-2020-001',
    type: 'private',
    phone: '+1 (555) 999-8888',
    emergencyPhone: '911',
    email: 'info@citygeneral.com',
    website: 'www.citygeneral.com',
    address: {
      street: '123 Medical Center Dr',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'USA'
    },
    totalBeds: 500,
    availableBeds: 150,
    icuBeds: 50,
    icuAvailable: 15,
    emergencyStatus: 'active',
    ambulanceCount: 15,
    oxygenAvailable: true,
    bloodBankAvailable: true,
    rating: 4.5,
    reviewCount: 1250,
    isVerified: true,
    is24x7: true,
    openingTime: '00:00',
    closingTime: '23:59',
    services: ['Emergency', 'Cardiology', 'Neurology', 'Surgery', 'Pediatrics', 'Orthopedics'],
    departments: [
      { id: 'd1', name: 'Cardiology', headDoctor: 'Dr. Sarah Wilson', totalBeds: 50, availableBeds: 15, doctors: 12, nurses: 25 },
      { id: 'd2', name: 'Neurology', headDoctor: 'Dr. Michael Chen', totalBeds: 40, availableBeds: 10, doctors: 8, nurses: 20 },
      { id: 'd3', name: 'Pediatrics', headDoctor: 'Dr. Lisa Anderson', totalBeds: 30, availableBeds: 12, doctors: 10, nurses: 18 },
    ],
    profileImage: '',
    coverImage: '',
    establishedYear: 1995,
    totalDoctors: 150,
    totalNurses: 300,
    totalStaff: 500
  });

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsEditing(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <Building2 className="w-4 h-4" /> },
    { id: 'departments', label: 'Departments', icon: <Users className="w-4 h-4" /> },
    { id: 'services', label: 'Services', icon: <Award className="w-4 h-4" /> },
    { id: 'stats', label: 'Statistics', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const departmentColumns = [
    { key: 'name', header: 'Department' },
    { 
      key: 'headDoctor', 
      header: 'Head Doctor',
      render: (dept: Department) => <span className="text-sm">{dept.headDoctor}</span>
    },
    { 
      key: 'beds', 
      header: 'Beds',
      render: (dept: Department) => (
        <span className="text-sm">{dept.availableBeds} / {dept.totalBeds}</span>
      )
    },
    { 
      key: 'staff', 
      header: 'Staff',
      render: (dept: Department) => (
        <span className="text-sm">{dept.doctors} Dr • {dept.nurses} Ns</span>
      )
    },
    { 
      key: 'status', 
      header: 'Status',
      render: (dept: Department) => (
        <Badge variant={dept.availableBeds > 5 ? 'success' : 'warning'} size="xs">
          {dept.availableBeds > 5 ? 'Available' : 'Limited'}
        </Badge>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ============================================ */}
      {/* COVER IMAGE */}
      {/* ============================================ */}
      <div className="relative h-56 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500">
        {profile.coverImage && (
          <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/20" />
        
        {/* Edit Cover Button */}
        {isEditing && (
          <Button
            variant="glassmorphic"
            size="sm"
            className="absolute bottom-4 right-4 text-white"
          >
            <Camera className="w-4 h-4 mr-2" /> Change Cover
          </Button>
        )}
      </div>

      {/* ============================================ */}
      {/* PROFILE HEADER */}
      {/* ============================================ */}
      <div className="max-w-6xl mx-auto px-6 -mt-20 relative z-10">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl border-4 border-white shadow-xl flex items-center justify-center">
              <Building2 className="w-16 h-16 text-white" />
            </div>
            {isEditing && (
              <button className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-2 shadow-lg">
                <Camera className="w-4 h-4 text-white" />
              </button>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 pt-4">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{profile.name}</h1>
              {profile.isVerified && (
                <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" /> Verified</Badge>
              )}
              <Badge variant={profile.emergencyStatus === 'active' ? 'success' : 'warning'}>
                ER: {profile.emergencyStatus}
              </Badge>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {profile.address.city}, {profile.address.state}</span>
              <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {profile.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {profile.email}</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4 text-yellow-400" /> {profile.rating} ({profile.reviewCount})</span>
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Est. {profile.establishedYear}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}><X className="w-4 h-4 mr-1" /> Cancel</Button>
                <Button variant="primary" onClick={handleSave} loading={isLoading}><Save className="w-4 h-4 mr-1" /> Save</Button>
              </>
            ) : (
              <Button variant="primary" onClick={() => setIsEditing(true)}><Edit3 className="w-4 h-4 mr-1" /> Edit Profile</Button>
            )}
          </div>
        </div>

        {/* Success Alert */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-green-700">Profile updated successfully!</span>
          </motion.div>
        )}

        {/* ============================================ */}
        {/* QUICK STATS */}
        {/* ============================================ */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 mb-8">
          <QuickStat icon={<Bed />} label="Total Beds" value={profile.totalBeds.toString()} sub={`${profile.availableBeds} available`} color="blue" />
          <QuickStat icon={<Thermometer />} label="ICU Beds" value={profile.icuBeds.toString()} sub={`${profile.icuAvailable} available`} color="red" />
          <QuickStat icon={<Truck />} label="Ambulances" value={profile.ambulanceCount.toString()} sub="Active" color="orange" />
          <QuickStat icon={<Users />} label="Doctors" value={profile.totalDoctors.toString()} sub={`${profile.totalNurses} nurses`} color="green" />
          <QuickStat icon={<Droplet />} label="Blood Bank" value={profile.bloodBankAvailable ? 'Yes' : 'No'} sub="Available" color="red" />
          <QuickStat icon={<Wind />} label="Oxygen" value={profile.oxygenAvailable ? 'Yes' : 'No'} sub="Available" color="cyan" />
          <QuickStat icon={<Star />} label="Rating" value={profile.rating.toString()} sub={`${profile.reviewCount} reviews`} color="yellow" />
          <QuickStat icon={<Shield />} label="Type" value={profile.type} sub="Hospital" color="purple" />
        </div>

        {/* ============================================ */}
        {/* TABS */}
        {/* ============================================ */}
        <Tab tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

        {/* ============================================ */}
        {/* TAB CONTENT */}
        {/* ============================================ */}
        <div className="mt-6">
          {/* PROFILE TAB */}
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Hospital Information</h3>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <Input label="Hospital Name" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                      <Input label="Registration Number" value={profile.registrationNumber} onChange={(e) => setProfile({...profile, registrationNumber: e.target.value})} />
                      <Input label="Phone" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
                      <Input label="Emergency Phone" value={profile.emergencyPhone} onChange={(e) => setProfile({...profile, emergencyPhone: e.target.value})} />
                      <Input label="Email" type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
                      <Input label="Website" value={profile.website} onChange={(e) => setProfile({...profile, website: e.target.value})} />
                      <Select
                        label="Type"
                        value={profile.type}
                        onChange={(e) => setProfile({...profile, type: e.target.value as any})}
                        options={[
                          { value: 'government', label: 'Government' },
                          { value: 'private', label: 'Private' },
                          { value: 'charitable', label: 'Charitable' }
                        ]}
                      />
                    </>
                  ) : (
                    <>
                      <InfoRow label="Registration" value={profile.registrationNumber} />
                      <InfoRow label="Phone" value={profile.phone} />
                      <InfoRow label="Emergency" value={profile.emergencyPhone} />
                      <InfoRow label="Email" value={profile.email} />
                      <InfoRow label="Website" value={profile.website} />
                      <InfoRow label="Type" value={profile.type} />
                    </>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Address</h3>
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <Input label="Street" value={profile.address.street} onChange={(e) => setProfile({...profile, address: {...profile.address, street: e.target.value}})} />
                      <Input label="City" value={profile.address.city} onChange={(e) => setProfile({...profile, address: {...profile.address, city: e.target.value}})} />
                      <Input label="State" value={profile.address.state} onChange={(e) => setProfile({...profile, address: {...profile.address, state: e.target.value}})} />
                      <Input label="Zip Code" value={profile.address.zipCode} onChange={(e) => setProfile({...profile, address: {...profile.address, zipCode: e.target.value}})} />
                    </>
                  ) : (
                    <>
                      <InfoRow label="Street" value={profile.address.street} />
                      <InfoRow label="City" value={profile.address.city} />
                      <InfoRow label="State" value={profile.address.state} />
                      <InfoRow label="Zip Code" value={profile.address.zipCode} />
                      <InfoRow label="Country" value={profile.address.country} />
                    </>
                  )}
                </div>
              </Card>
            </div>
          )}

          {/* DEPARTMENTS TAB */}
          {activeTab === 'departments' && (
            <Card className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg">Departments</h3>
                <Button variant="primary" size="sm"><Plus className="w-4 h-4 mr-1" /> Add Department</Button>
              </div>
              <Table
                columns={departmentColumns}
                data={profile.departments}
                keyExtractor={(dept) => dept.id}
              />
            </Card>
          )}

          {/* SERVICES TAB */}
          {activeTab === 'services' && (
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Services Offered</h3>
              <div className="flex flex-wrap gap-3">
                {profile.services.map((service) => (
                  <Badge key={service} variant="info" size="lg">{service}</Badge>
                ))}
              </div>
            </Card>
          )}

          {/* STATS TAB */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Capacity</h3>
                <div className="space-y-3">
                  <StatBar label="Bed Occupancy" value={(profile.totalBeds - profile.availableBeds)} max={profile.totalBeds} color="blue" />
                  <StatBar label="ICU Occupancy" value={(profile.icuBeds - profile.icuAvailable)} max={profile.icuBeds} color="red" />
                </div>
              </Card>
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-4">Staff Overview</h3>
                <div className="space-y-4">
                  <InfoRow label="Total Doctors" value={profile.totalDoctors.toString()} />
                  <InfoRow label="Total Nurses" value={profile.totalNurses.toString()} />
                  <InfoRow label="Total Staff" value={profile.totalStaff.toString()} />
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

const QuickStat: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: string;
  color: string;
}> = ({ icon, label, value, sub, color }) => (
  <Card className="p-3 text-center hover:shadow-md transition-all">
    <div className={`p-2 bg-${color}-100 rounded-xl inline-flex mb-2`}>{icon}</div>
    <p className="text-lg font-bold">{value}</p>
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-[10px] text-gray-400">{sub}</p>
  </Card>
);

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b border-gray-100">
    <span className="text-sm text-gray-500">{label}</span>
    <span className="text-sm font-medium">{value}</span>
  </div>
);

const StatBar: React.FC<{ label: string; value: number; max: number; color: string }> = ({ label, value, max, color }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}/{max} ({Math.round((value/max)*100)}%)</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div className={`bg-${color}-500 h-2 rounded-full`} style={{ width: `${(value/max)*100}%` }} />
    </div>
  </div>
);

export default HospitalAccount;