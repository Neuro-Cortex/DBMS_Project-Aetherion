// src/components/blood/BloodDonorDashboard.tsx

import React, { useState, useEffect } from 'react';
import {
  Droplet, Heart, Calendar, Award, TrendingUp,
  Users, MapPin, Bell, AlertCircle, Gift,
  Star, Clock, CheckCircle, Activity
} from 'lucide-react';
import { BloodDonor, Donation } from '../../types/bloodDonation';

interface BloodDonorDashboardProps {
  donorId: string;
  onNavigate: (page: string) => void;
}

export const BloodDonorDashboard: React.FC<BloodDonorDashboardProps> = ({
  donorId,
  onNavigate
}) => {
  const [donorData, setDonorData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDonorData();
  }, [donorId]);

  const fetchDonorData = async () => {
    setTimeout(() => {
      setDonorData({
        donor: {
          firstName: 'John',
          lastName: 'Doe',
          bloodGroup: 'O+',
          totalDonations: 8,
          donatedUnits: 8,
          livesSaved: 24,
          rewardPoints: 850,
          lastDonationDate: '2024-01-15',
          nextEligibleDate: '2024-04-15',
          isEligible: true,
          isAvailable: true,
          isEmergencyDonor: true
        },
        recentDonations: [
          {
            id: '1',
            date: '2024-01-15',
            bloodGroup: 'O+',
            units: 1,
            hospitalName: 'City General Hospital',
            rewardPointsEarned: 100,
            certificateUrl: '#'
          },
          {
            id: '2',
            date: '2023-10-10',
            bloodGroup: 'O+',
            units: 1,
            hospitalName: 'Red Cross Center',
            rewardPointsEarned: 100,
            certificateUrl: '#'
          }
        ],
        rewards: [
          { id: '1', name: 'First Donation Badge', type: 'badge', earnedDate: '2023-01-01' },
          { id: '2', name: '5 Donations Milestone', type: 'badge', earnedDate: '2023-07-15' },
          { id: '3', name: '100 Points Bonus', type: 'points', points: 100, earnedDate: '2024-01-01' }
        ],
        upcomingCamps: [
          {
            id: '1',
            name: 'Community Blood Drive',
            date: '2024-03-01',
            location: 'Community Center',
            distance: '2.5 km'
          }
        ],
        activeEmergencies: [
          {
            id: '1',
            bloodGroup: 'O-',
            hospitalName: 'Emergency Hospital',
            urgency: 'emergency',
            createdAt: '2024-02-15T10:00:00'
          }
        ],
        stats: {
          totalDonors: 5000,
          todayDonations: 25,
          thisMonthDonations: 350
        }
      });
      setIsLoading(false);
    }, 1500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white rounded-lg p-8 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome, {donorData.donor.firstName}! 🩸
            </h1>
            <p className="text-red-100">Your donation can save up to 3 lives!</p>
          </div>
          <div className="text-center">
            <div className="text-5xl font-bold">{donorData.donor.bloodGroup}</div>
            <p className="text-red-200 mt-1">Blood Group</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatsCard
          icon={<Droplet className="w-6 h-6 text-red-500" />}
          value={donorData.donor.totalDonations.toString()}
          label="Total Donations"
          color="red"
        />
        <StatsCard
          icon={<Heart className="w-6 h-6 text-pink-500" />}
          value={donorData.donor.livesSaved.toString()}
          label="Lives Saved"
          color="pink"
        />
        <StatsCard
          icon={<Award className="w-6 h-6 text-yellow-500" />}
          value={donorData.donor.rewardPoints.toString()}
          label="Reward Points"
          color="yellow"
        />
        <StatsCard
          icon={<Calendar className="w-6 h-6 text-green-500" />}
          value={donorData.donor.nextEligibleDate}
          label="Next Eligible Date"
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Eligibility Status */}
          <div className={`rounded-lg shadow p-6 ${
            donorData.donor.isEligible 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-yellow-50 border border-yellow-200'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {donorData.donor.isEligible ? (
                  <CheckCircle className="w-8 h-8 text-green-600" />
                ) : (
                  <Clock className="w-8 h-8 text-yellow-600" />
                )}
                <div>
                  <h3 className="font-semibold text-lg">
                    {donorData.donor.isEligible 
                      ? 'You are eligible to donate!' 
                      : 'Not yet eligible'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Last donation: {donorData.donor.lastDonationDate}
                  </p>
                </div>
              </div>
              {donorData.donor.isEligible && (
                <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
                  Donate Now
                </button>
              )}
            </div>
          </div>

          {/* Donation History */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-red-500" />
                Donation History
              </h2>
              <button className="text-red-600 hover:text-red-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-3">
              {donorData.recentDonations.map((donation: any) => (
                <div key={donation.id} className="flex items-center justify-between border rounded-lg p-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                      <Droplet className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <p className="font-medium">{donation.hospitalName}</p>
                      <p className="text-sm text-gray-600">{donation.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-green-600">+{donation.rewardPointsEarned} pts</p>
                    <button className="text-sm text-red-600 hover:text-red-700">
                      Certificate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Camps */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-red-500" />
              Upcoming Donation Camps
            </h2>
            {donorData.upcomingCamps.map((camp: any) => (
              <div key={camp.id} className="flex items-center justify-between border rounded-lg p-4">
                <div>
                  <p className="font-medium">{camp.name}</p>
                  <p className="text-sm text-gray-600">
                    {camp.date} • {camp.location}
                  </p>
                  <p className="text-xs text-gray-500">{camp.distance} away</p>
                </div>
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm">
                  Register
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Emergency Alerts */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center">
                <Bell className="w-5 h-5 mr-2" />
                Emergency Alerts
              </h3>
              <span className="bg-white text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                {donorData.activeEmergencies.length} Active
              </span>
            </div>
            {donorData.activeEmergencies.map((emergency: any) => (
              <div key={emergency.id} className="bg-red-400/30 rounded-lg p-3 mb-3">
                <div className="flex justify-between mb-2">
                  <span className="font-bold text-lg">{emergency.bloodGroup}</span>
                  <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded">
                    {emergency.urgency}
                  </span>
                </div>
                <p className="text-sm">{emergency.hospitalName}</p>
                <button className="mt-2 w-full bg-white text-red-600 px-3 py-1 rounded text-sm font-medium hover:bg-red-50">
                  Respond Now
                </button>
              </div>
            ))}
          </div>

          {/* Rewards */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Gift className="w-5 h-5 mr-2 text-yellow-500" />
              Your Rewards
            </h3>
            <div className="space-y-3">
              {donorData.rewards.map((reward: any) => (
                <div key={reward.id} className="flex items-center space-x-3 p-3 bg-yellow-50 rounded-lg">
                  {reward.type === 'badge' ? (
                    <Award className="w-8 h-8 text-yellow-600" />
                  ) : (
                    <Star className="w-8 h-8 text-yellow-600" />
                  )}
                  <div>
                    <p className="font-medium text-sm">{reward.name}</p>
                    <p className="text-xs text-gray-600">{reward.earnedDate}</p>
                  </div>
                </div>
              ))}
              <div className="text-center pt-3 border-t">
                <p className="text-2xl font-bold text-yellow-600">
                  {donorData.donor.rewardPoints}
                </p>
                <p className="text-sm text-gray-600">Total Points</p>
                <button className="mt-2 w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 text-sm">
                  Redeem Points
                </button>
              </div>
            </div>
          </div>

          {/* Live Stats */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4 flex items-center">
              <Activity className="w-5 h-5 mr-2 text-blue-500" />
              Live Donation Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Donors</span>
                <span className="font-medium">{donorData.stats.totalDonors}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Today's Donations</span>
                <span className="font-medium text-green-600">{donorData.stats.todayDonations}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-medium">{donorData.stats.thisMonthDonations}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button 
                onClick={() => onNavigate('search-donors')}
                className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-red-50"
              >
                <Users className="w-5 h-5 mr-3 text-red-500" />
                Search Blood Donors
              </button>
              <button 
                onClick={() => onNavigate('emergency')}
                className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-red-50"
              >
                <AlertCircle className="w-5 h-5 mr-3 text-red-500" />
                Emergency Request
              </button>
              <button 
                onClick={() => onNavigate('stock')}
                className="w-full flex items-center p-3 bg-gray-50 rounded-lg hover:bg-red-50"
              >
                <Droplet className="w-5 h-5 mr-3 text-red-500" />
                Blood Stock Monitor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatsCard: React.FC<{
  icon: React.ReactNode;
  value: string;
  label: string;
  color: string;
}> = ({ icon, value, label, color }) => (
  <div className="bg-white rounded-lg shadow p-4">
    <div className="flex items-center justify-between mb-2">
      <div className={`p-2 bg-${color}-100 rounded-lg`}>
        {icon}
      </div>
    </div>
    <p className="text-2xl font-bold">{value}</p>
    <p className="text-sm text-gray-600">{label}</p>
  </div>
);