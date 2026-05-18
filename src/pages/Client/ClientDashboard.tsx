// src/pages/client/Profile.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ClientSidebar from 'src/pages/Client/ClientSidebar';
import {
  User, Mail, Phone, MapPin, Calendar, Heart,
  Droplets, Shield, Edit, Camera, Save,
  ChevronRight, Clock, Activity, AlertCircle,
  FileText, Download, Upload
} from 'lucide-react';

const ClientProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    fullName: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1 (555) 123-4567',
    dateOfBirth: '1990-05-15',
    gender: 'male',
    bloodGroup: 'O+',
    address: '123 Healthcare Ave, Medical District, NY 10001',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '+1 (555) 987-6543',
      relation: 'Spouse',
    },
    allergies: ['Penicillin', 'Peanuts'],
    chronicDiseases: ['Hypertension'],
    height: '175 cm',
    weight: '72 kg',
    bmi: 23.5,
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save to backend
  };

  return (
    <div className="min-h-screen bg-[#050508]">
      <ClientSidebar />
      
      <div className="ml-64 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="text-white/40 text-sm mt-1">Manage your personal information</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
              isEditing
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20'
            }`}
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            ) : (
              <>
                <Edit className="w-4 h-4" /> Edit Profile
              </>
            )}
          </motion.button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Profile Card */}
          <div className="col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center"
            >
              <div className="relative inline-block">
                <img
                  src="https://randomuser.me/api/portraits/men/32.jpg"
                  alt="Profile"
                  className="w-32 h-32 rounded-2xl object-cover border-2 border-white/[0.08] mx-auto"
                />
                <button className="absolute bottom-0 right-0 p-2 rounded-lg bg-cyan-500 text-white hover:bg-cyan-600 transition-all">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-white mt-4">{profile.fullName}</h2>
              <p className="text-cyan-400 text-sm">Client Profile</p>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                  <span className="text-white/40 text-sm">Health Score</span>
                  <span className="text-emerald-400 font-bold">85/100</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                  <span className="text-white/40 text-sm">BMI</span>
                  <span className="text-white font-medium">{profile.bmi}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
                  <span className="text-white/40 text-sm">Blood Group</span>
                  <span className="text-red-400 font-bold">{profile.bloodGroup}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Profile Details */}
          <div className="col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
            >
              <h3 className="text-white font-semibold text-lg mb-6">Personal Information</h3>
              
              <div className="grid grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    <User className="w-3 h-3 inline mr-1" /> Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:border-cyan-400/50 transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    <Mail className="w-3 h-3 inline mr-1" /> Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:border-cyan-400/50 transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    <Phone className="w-3 h-3 inline mr-1" /> Phone
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:border-cyan-400/50 transition-all"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    <Calendar className="w-3 h-3 inline mr-1" /> Date of Birth
                  </label>
                  <input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:border-cyan-400/50 transition-all"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    <User className="w-3 h-3 inline mr-1" /> Gender
                  </label>
                  <div className="flex gap-2">
                    {['male', 'female'].map(gender => (
                      <button
                        key={gender}
                        disabled={!isEditing}
                        onClick={() => setProfile({ ...profile, gender })}
                        className={`flex-1 py-3 rounded-xl text-sm font-medium capitalize transition-all ${
                          profile.gender === gender
                            ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                            : 'bg-white/[0.03] text-white/40 border border-white/[0.06]'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Blood Group */}
                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    <Droplets className="w-3 h-3 inline mr-1" /> Blood Group
                  </label>
                  <input
                    type="text"
                    value={profile.bloodGroup}
                    disabled
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-red-400 font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed outline-none"
                  />
                </div>

                {/* Address */}
                <div className="col-span-2">
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    <MapPin className="w-3 h-3 inline mr-1" /> Address
                  </label>
                  <input
                    type="text"
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm disabled:opacity-50 disabled:cursor-not-allowed outline-none focus:border-cyan-400/50 transition-all"
                  />
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mt-8 pt-6 border-t border-white/[0.04]">
                <h3 className="text-white font-semibold text-lg mb-4 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  Emergency Contact
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-white/40 text-xs font-medium mb-2 block">Name</label>
                    <input
                      type="text"
                      value={profile.emergencyContact.name}
                      onChange={(e) => setProfile({
                        ...profile,
                        emergencyContact: { ...profile.emergencyContact, name: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm disabled:opacity-50 outline-none focus:border-cyan-400/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-medium mb-2 block">Phone</label>
                    <input
                      type="tel"
                      value={profile.emergencyContact.phone}
                      onChange={(e) => setProfile({
                        ...profile,
                        emergencyContact: { ...profile.emergencyContact, phone: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm disabled:opacity-50 outline-none focus:border-cyan-400/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-medium mb-2 block">Relation</label>
                    <input
                      type="text"
                      value={profile.emergencyContact.relation}
                      onChange={(e) => setProfile({
                        ...profile,
                        emergencyContact: { ...profile.emergencyContact, relation: e.target.value }
                      })}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm disabled:opacity-50 outline-none focus:border-cyan-400/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Allergies & Conditions */}
              <div className="mt-8 pt-6 border-t border-white/[0.04]">
                <h3 className="text-white font-semibold text-lg mb-4">Medical Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs font-medium mb-2 block">Allergies</label>
                    <div className="flex flex-wrap gap-2">
                      {profile.allergies.map((allergy, index) => (
                        <span key={index} className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-xs font-medium border border-red-500/20">
                          {allergy}
                        </span>
                      ))}
                      {isEditing && (
                        <button className="px-3 py-1.5 rounded-lg bg-white/[0.03] text-white/40 text-xs border border-dashed border-white/[0.1] hover:border-cyan-400/30 transition-all">
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-medium mb-2 block">Chronic Diseases</label>
                    <div className="flex flex-wrap gap-2">
                      {profile.chronicDiseases.map((disease, index) => (
                        <span key={index} className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-xs font-medium border border-amber-500/20">
                          {disease}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Medical Reports Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.04]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Medical Reports
                </h3>
                <button className="px-4 py-2 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-medium hover:bg-emerald-500/20 transition-all flex items-center gap-2">
                  <Upload className="w-4 h-4" /> Upload Report
                </button>
              </div>
              
              <div className="space-y-3">
                {[
                  { name: 'Blood Test Report', date: '2024-11-05', type: 'Lab', size: '2.4 MB' },
                  { name: 'Chest X-Ray', date: '2024-10-20', type: 'Imaging', size: '5.1 MB' },
                  { name: 'Lipid Panel Results', date: '2024-10-15', type: 'Lab', size: '1.8 MB' },
                  { name: 'ECG Report', date: '2024-09-28', type: 'Cardiac', size: '3.2 MB' },
                ].map((report, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-emerald-500/20 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">{report.name}</p>
                        <p className="text-white/40 text-xs">{report.date} • {report.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/30 text-xs">{report.size}</span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-2 rounded-lg bg-white/[0.03] text-white/40 hover:text-emerald-400 transition-all"
                      >
                        <Download className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientProfile;