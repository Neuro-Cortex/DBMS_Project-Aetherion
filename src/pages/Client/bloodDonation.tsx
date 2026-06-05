// src/pages/client/BloodDonation.tsx

import React, { useState, useEffect } from 'react';
import {
  Droplet, Heart, Calendar, Clock, MapPin,
  Award, Star, Gift, ChevronRight, AlertCircle,
  CheckCircle, XCircle, TrendingUp, Users,
  Bell, Shield, Activity, Info, Lock
} from 'lucide-react';

// Types
interface BloodDonation {
  id: string;
  date: string;
  bloodGroup: string;
  units: number;
  hospitalName: string;
  bloodBankName: string;
  location: string;
  donationType: 'whole-blood' | 'plasma' | 'platelets' | 'double-red-cells';
  certificateId: string;
  certificateUrl: string;
  rewardPointsEarned: number;
  verifiedBy: string;
  notes?: string;
  recipientInfo?: string;
}

interface DonorProfile {
  isDonor: boolean;
  isEligible: boolean;
  firstName: string;
  lastName: string;
  bloodGroup: string;
  totalDonations: number;
  donatedUnits: number;
  livesSaved: number;
  rewardPoints: number;
  lastDonationDate: string;
  nextEligibleDate: string;
  isEmergencyDonor: boolean;
  donationHistory: BloodDonation[];
  achievements: Achievement[];
  badges: Badge[];
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
}

interface Badge {
  id: string;
  name: string;
  icon: string;
  level: 'bronze' | 'silver' | 'gold' | 'platinum';
  earnedDate: string;
}

export const ClientBloodDonation: React.FC = () => {
  const [donorProfile, setDonorProfile] = useState<DonorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDonation, setSelectedDonation] = useState<BloodDonation | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'achievements'>('overview');
  const [showConvertModal, setShowConvertModal] = useState(false);

  // Check if user is a blood donor
  const [isBloodDonor, setIsBloodDonor] = useState(false);
  const [userProfileType, setUserProfileType] = useState<'client' | 'blood-donor'>('client');

  useEffect(() => {
    checkUserProfile();
    fetchDonorProfile();
  }, []);

  const checkUserProfile = () => {
    // API call to check if user has blood donor profile
    const profileType = localStorage.getItem('profileType') || 'client';
    setUserProfileType(profileType as 'client' | 'blood-donor');
    setIsBloodDonor(profileType === 'blood-donor');
  };

  const fetchDonorProfile = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockProfile: DonorProfile = {
        isDonor: true,
        isEligible: true,
        firstName: 'John',
        lastName: 'Doe',
        bloodGroup: 'O+',
        totalDonations: 8,
        donatedUnits: 8,
        livesSaved: 24,
        rewardPoints: 850,
        lastDonationDate: '2025-01-15',
        nextEligibleDate: '2025-04-15',
        isEmergencyDonor: true,
        donationHistory: [
          {
            id: 'd1',
            date: '2025-01-15',
            bloodGroup: 'O+',
            units: 1,
            hospitalName: 'City General Hospital',
            bloodBankName: 'City Blood Bank',
            location: '123 Medical Center Dr, New York',
            donationType: 'whole-blood',
            certificateId: 'CERT-2025-001',
            certificateUrl: '#',
            rewardPointsEarned: 100,
            verifiedBy: 'Dr. Sarah Wilson',
            notes: 'All vitals normal. Successful donation.',
            recipientInfo: 'Emergency surgery patient - Critical condition'
          },
          {
            id: 'd2',
            date: '2024-10-10',
            bloodGroup: 'O+',
            units: 1,
            hospitalName: 'Metro Hospital',
            bloodBankName: 'Metro Blood Center',
            location: '456 Health Blvd, New York',
            donationType: 'whole-blood',
            certificateId: 'CERT-2024-045',
            certificateUrl: '#',
            rewardPointsEarned: 100,
            verifiedBy: 'Dr. James Brown',
            recipientInfo: 'Child with thalassemia - 8 years old'
          },
          {
            id: 'd3',
            date: '2024-07-05',
            bloodGroup: 'O+',
            units: 1,
            hospitalName: 'Red Cross Center',
            bloodBankName: 'Red Cross Blood Bank',
            location: '789 Charity Rd, New York',
            donationType: 'plasma',
            certificateId: 'CERT-2024-089',
            certificateUrl: '#',
            rewardPointsEarned: 150,
            verifiedBy: 'Dr. Emily White',
            notes: 'Plasma donation for COVID-19 treatment'
          },
          {
            id: 'd4',
            date: '2024-04-01',
            bloodGroup: 'O+',
            units: 1,
            hospitalName: 'City General Hospital',
            bloodBankName: 'City Blood Bank',
            location: '123 Medical Center Dr, New York',
            donationType: 'whole-blood',
            certificateId: 'CERT-2024-023',
            certificateUrl: '#',
            rewardPointsEarned: 100,
            verifiedBy: 'Dr. Sarah Wilson'
          },
          {
            id: 'd5',
            date: '2024-01-10',
            bloodGroup: 'O+',
            units: 1,
            hospitalName: 'Women Care Hospital',
            bloodBankName: 'Women Care Blood Bank',
            location: '321 Care Ave, New York',
            donationType: 'whole-blood',
            certificateId: 'CERT-2024-001',
            certificateUrl: '#',
            rewardPointsEarned: 100,
            verifiedBy: 'Dr. Lisa Anderson'
          }
        ],
        achievements: [
          {
            id: 'a1',
            name: 'First Donation',
            description: 'Completed your first blood donation',
            icon: '🩸',
            earnedDate: '2024-01-10'
          },
          {
            id: 'a2',
            name: '5 Donations Milestone',
            description: 'Donated blood 5 times',
            icon: '⭐',
            earnedDate: '2025-01-15'
          },
          {
            id: 'a3',
            name: 'Life Saver',
            description: 'Saved 15+ lives through donations',
            icon: '💖',
            earnedDate: '2024-10-10'
          },
          {
            id: 'a4',
            name: 'Plasma Hero',
            description: 'Donated plasma for special treatment',
            icon: '🏆',
            earnedDate: '2024-07-05'
          }
        ],
        badges: [
          {
            id: 'b1',
            name: 'Bronze Donor',
            icon: '🥉',
            level: 'bronze',
            earnedDate: '2024-04-01'
          },
          {
            id: 'b2',
            name: 'Silver Donor',
            icon: '🥈',
            level: 'silver',
            earnedDate: '2024-10-10'
          },
          {
            id: 'b3',
            name: 'Emergency Responder',
            icon: '🚨',
            level: 'gold',
            earnedDate: '2024-07-05'
          }
        ]
      };

      setDonorProfile(mockProfile);
      setIsLoading(false);
    }, 1500);
  };

  const handleConvertToDonor = () => {
    setShowConvertModal(true);
  };

  const confirmConversion = () => {
    localStorage.setItem('profileType', 'blood-donor');
    setUserProfileType('blood-donor');
    setIsBloodDonor(true);
    setShowConvertModal(false);
    fetchDonorProfile();
  };

  const handleViewDetails = (donation: BloodDonation) => {
    setSelectedDonation(donation);
    setShowDetails(true);
  };

  const getDonationTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'whole-blood': 'Whole Blood',
      'plasma': 'Plasma',
      'platelets': 'Platelets',
      'double-red-cells': 'Double Red Cells'
    };
    return labels[type] || type;
  };

  const getDonationTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'whole-blood': 'bg-red-100 text-red-700',
      'plasma': 'bg-yellow-100 text-yellow-700',
      'platelets': 'bg-orange-100 text-orange-700',
      'double-red-cells': 'bg-purple-100 text-purple-700'
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  const getBadgeColor = (level: string) => {
    const colors: Record<string, string> = {
      'bronze': 'from-amber-600 to-amber-800',
      'silver': 'from-gray-400 to-gray-600',
      'gold': 'from-yellow-400 to-yellow-600',
      'platinum': 'from-purple-400 to-purple-600'
    };
    return colors[level] || 'from-gray-400 to-gray-600';
  };

  // If not a blood donor, show conversion page
  if (!isBloodDonor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="max-w-lg w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-12 h-12 text-red-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-3">
              Blood Donation Access Restricted
            </h1>
            <p className="text-gray-600 mb-6">
              This feature is only available for registered blood donors. 
              Convert your profile to a Blood Donor to access blood donation features.
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
              <h3 className="font-semibold mb-3 flex items-center">
                <Info className="w-5 h-5 mr-2 text-blue-500" />
                Benefits of Becoming a Blood Donor
              </h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Save up to 3 lives with each donation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Earn reward points and badges
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Get donation certificates
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Free health checkup with each donation
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                  Emergency donor alerts
                </li>
              </ul>
            </div>

            <button
              onClick={handleConvertToDonor}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center"
            >
              <Droplet className="w-5 h-5 mr-2" />
              Convert to Blood Donor Profile
            </button>

            <p className="text-xs text-gray-500 mt-4">
              You can still use all other features as a normal client.
            </p>
          </div>
        </div>

        {/* Conversion Modal */}
        {showConvertModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplet className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-bold">Convert to Blood Donor?</h3>
                <p className="text-gray-600 mt-2">
                  This will add blood donation features to your profile. 
                  You can still use all client features.
                </p>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Requirements:</strong> You must be 18-65 years old, 
                  weigh at least 50 kg, and be in good health.
                </p>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConvertModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmConversion}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Confirm Conversion
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Main Blood Donation Page
  if (isLoading || !donorProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-2xl p-8 mb-8 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold flex items-center">
                <Droplet className="w-8 h-8 mr-3" />
                Blood Donation
              </h1>
              <p className="text-red-100 mt-2">Your donation history & achievements</p>
            </div>
            <div className="text-center">
              <p className="text-5xl font-bold">{donorProfile.bloodGroup}</p>
              <p className="text-red-200 text-sm mt-1">Blood Group</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard
            icon={<Droplet className="w-6 h-6 text-red-500" />}
            label="Total Donations"
            value={donorProfile.totalDonations.toString()}
            color="red"
          />
          <StatCard
            icon={<Heart className="w-6 h-6 text-pink-500" />}
            label="Lives Saved"
            value={donorProfile.livesSaved.toString()}
            color="pink"
          />
          <StatCard
            icon={<Award className="w-6 h-6 text-yellow-500" />}
            label="Reward Points"
            value={donorProfile.rewardPoints.toString()}
            color="yellow"
          />
          <StatCard
            icon={<Calendar className="w-6 h-6 text-green-500" />}
            label="Next Eligible"
            value={donorProfile.nextEligibleDate}
            color="green"
          />
        </div>

        {/* Eligibility Banner */}
        <div className={`rounded-xl p-4 mb-6 ${
          donorProfile.isEligible 
            ? 'bg-green-50 border border-green-200' 
            : 'bg-yellow-50 border border-yellow-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {donorProfile.isEligible ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Clock className="w-8 h-8 text-yellow-600" />
              )}
              <div>
                <p className="font-semibold">
                  {donorProfile.isEligible ? 'You are eligible to donate!' : 'Not yet eligible'}
                </p>
                <p className="text-sm text-gray-600">
                  Last donation: {donorProfile.lastDonationDate} • 
                  Next eligible: {donorProfile.nextEligibleDate}
                </p>
              </div>
            </div>
            {donorProfile.isEligible && (
              <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                Donate Now
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Activity },
                { id: 'history', label: 'Donation History', icon: Calendar },
                { id: 'achievements', label: 'Achievements', icon: Award }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-red-600 text-red-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Donation Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Donation Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <p className="text-3xl font-bold text-red-600">{donorProfile.totalDonations}</p>
                  <p className="text-sm text-gray-600">Total Donations</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-xl">
                  <p className="text-3xl font-bold text-blue-600">{donorProfile.donatedUnits}</p>
                  <p className="text-sm text-gray-600">Units Donated</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <p className="text-3xl font-bold text-green-600">{donorProfile.livesSaved}</p>
                  <p className="text-sm text-gray-600">Lives Saved</p>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <p className="text-3xl font-bold text-yellow-600">{donorProfile.rewardPoints}</p>
                  <p className="text-sm text-gray-600">Reward Points</p>
                </div>
              </div>
            </div>

            {/* Recent Donations Preview */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Recent Donations</h2>
                <button
                  onClick={() => setActiveTab('history')}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {donorProfile.donationHistory.slice(0, 3).map((donation) => (
                  <div
                    key={donation.id}
                    onClick={() => handleViewDetails(donation)}
                    className="flex items-center justify-between border rounded-xl p-4 hover:bg-red-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <Droplet className="w-6 h-6 text-red-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{donation.hospitalName}</p>
                        <p className="text-sm text-gray-600">{donation.date}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getDonationTypeColor(donation.donationType)}`}>
                          {getDonationTypeLabel(donation.donationType)}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-green-600">+{donation.rewardPointsEarned} pts</p>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Your Badges</h2>
              <div className="flex space-x-4">
                {donorProfile.badges.map((badge) => (
                  <div key={badge.id} className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getBadgeColor(badge.level)} rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                      <span className="text-2xl">{badge.icon}</span>
                    </div>
                    <p className="text-xs font-medium">{badge.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{badge.level}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Donation History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Complete Donation History</h2>
              <div className="space-y-4">
                {donorProfile.donationHistory.map((donation) => (
                  <div
                    key={donation.id}
                    onClick={() => handleViewDetails(donation)}
                    className="border rounded-xl p-5 hover:bg-red-50 cursor-pointer transition-all hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <Droplet className="w-6 h-6 text-red-600" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold">{donation.hospitalName}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${getDonationTypeColor(donation.donationType)}`}>
                              {getDonationTypeLabel(donation.donationType)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {donation.date}
                            </span>
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {donation.bloodBankName}
                            </span>
                          </div>
                          <div className="flex items-center space-x-3 mt-2">
                            <span className="text-sm text-gray-600">
                              Blood Group: <strong className="text-red-600">{donation.bloodGroup}</strong>
                            </span>
                            <span className="text-sm text-gray-600">
                              Units: <strong>{donation.units}</strong>
                            </span>
                            <span className="text-sm text-green-600">
                              +{donation.rewardPointsEarned} points
                            </span>
                          </div>
                          {donation.recipientInfo && (
                            <p className="text-xs text-blue-600 mt-2">
                              🏥 Recipient: {donation.recipientInfo}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500">Cert: {donation.certificateId}</p>
                        <button className="text-red-600 hover:text-red-700 text-sm mt-2">
                          View Certificate
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Achievements</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {donorProfile.achievements.map((achievement) => (
                  <div key={achievement.id} className="border rounded-xl p-4 flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center text-2xl">
                      {achievement.icon}
                    </div>
                    <div>
                      <p className="font-semibold">{achievement.name}</p>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-1">Earned: {achievement.earnedDate}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Badges */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Badges</h2>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {donorProfile.badges.map((badge) => (
                  <div key={badge.id} className="text-center p-4 border rounded-xl">
                    <div className={`w-16 h-16 bg-gradient-to-br ${getBadgeColor(badge.level)} rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg`}>
                      <span className="text-2xl">{badge.icon}</span>
                    </div>
                    <p className="text-sm font-medium">{badge.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{badge.level}</p>
                    <p className="text-xs text-gray-400 mt-1">{badge.earnedDate}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Donation Details Modal */}
      {showDetails && selectedDonation && (
        <DonationDetailsModal
          donation={selectedDonation}
          onClose={() => setShowDetails(false)}
          getDonationTypeLabel={getDonationTypeLabel}
          getDonationTypeColor={getDonationTypeColor}
        />
      )}
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}> = ({ icon, label, value, color }) => (
  <div className="bg-white rounded-xl shadow-lg p-4">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 bg-${color}-100 rounded-lg`}>{icon}</div>
      <TrendingUp className="w-4 h-4 text-green-500" />
    </div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);

// Donation Details Modal
const DonationDetailsModal: React.FC<{
  donation: BloodDonation;
  onClose: () => void;
  getDonationTypeLabel: (type: string) => string;
  getDonationTypeColor: (type: string) => string;
}> = ({ donation, onClose, getDonationTypeLabel, getDonationTypeColor }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
                <Droplet className="w-7 h-7" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Donation Details</h2>
                <p className="text-red-100 text-sm">{donation.certificateId}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-full">
              <XCircle className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <DetailItem label="Date" value={donation.date} icon={<Calendar className="w-4 h-4" />} />
            <DetailItem label="Blood Group" value={donation.bloodGroup} icon={<Droplet className="w-4 h-4 text-red-500" />} />
            <DetailItem label="Units Donated" value={donation.units.toString()} icon={<Activity className="w-4 h-4" />} />
            <DetailItem
              label="Donation Type"
              value={getDonationTypeLabel(donation.donationType)}
              icon={<Info className="w-4 h-4" />}
            />
          </div>

          {/* Hospital Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Hospital Information</h3>
            <div className="space-y-2">
              <DetailItem label="Hospital" value={donation.hospitalName} icon={<MapPin className="w-4 h-4" />} />
              <DetailItem label="Blood Bank" value={donation.bloodBankName} icon={<Shield className="w-4 h-4" />} />
              <DetailItem label="Location" value={donation.location} icon={<MapPin className="w-4 h-4" />} />
            </div>
          </div>

          {/* Verification */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold mb-3">Verification</h3>
            <DetailItem label="Verified By" value={donation.verifiedBy} icon={<CheckCircle className="w-4 h-4 text-green-500" />} />
          </div>

          {/* Recipient Info */}
          {donation.recipientInfo && (
            <div className="bg-green-50 rounded-xl p-4">
              <h3 className="font-semibold mb-3 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-pink-500" />
                Recipient Information
              </h3>
              <p className="text-sm">{donation.recipientInfo}</p>
            </div>
          )}

          {/* Notes */}
          {donation.notes && (
            <div className="bg-yellow-50 rounded-xl p-4">
              <h3 className="font-semibold mb-2">Notes</h3>
              <p className="text-sm text-gray-700">{donation.notes}</p>
            </div>
          )}

          {/* Rewards */}
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="font-semibold mb-2 flex items-center">
              <Gift className="w-5 h-5 mr-2 text-purple-500" />
              Rewards Earned
            </h3>
            <p className="text-2xl font-bold text-purple-600">+{donation.rewardPointsEarned} Points</p>
          </div>

          {/* Certificate */}
          <button className="w-full bg-red-600 text-white py-3 rounded-xl hover:bg-red-700 font-medium flex items-center justify-center">
            <Award className="w-5 h-5 mr-2" />
            Download Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

// Detail Item Component
const DetailItem: React.FC<{
  label: string;
  value: string;
  icon: React.ReactNode;
}> = ({ label, value, icon }) => (
  <div className="flex items-center space-x-2">
    <div className="text-gray-400">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  </div>
);

export default ClientBloodDonation;