// src/components/blood/BloodDonorRegistration.tsx

import React, { useState } from 'react';
import {
  User, Droplet, Heart, Phone, Mail, MapPin,
  Calendar, Weight, AlertCircle, CheckCircle,
  ArrowRight, ArrowLeft, Shield, FileText
} from 'lucide-react';
import { BloodDonor, BloodGroup } from '../../types/bloodDonation';

interface BloodDonorRegistrationProps {
  onRegister: (data: Partial<BloodDonor>) => void;
  onCancel: () => void;
}

export const BloodDonorRegistration: React.FC<BloodDonorRegistrationProps> = ({
  onRegister,
  onCancel
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BloodDonor>>({
    bloodGroup: undefined,
    gender: 'male',
    isEmergencyDonor: false,
    notificationPreferences: {
      sms: true,
      email: true,
      pushNotification: true,
      emergencyAlerts: true,
      donationReminders: true
    }
  });

  const [eligibilityCheck, setEligibilityCheck] = useState<{
    passed: boolean;
    issues: string[];
  }>({ passed: false, issues: [] });

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const checkBasicEligibility = (data: Partial<BloodDonor>) => {
    const issues: string[] = [];
    
    if (data.age && (data.age < 18 || data.age > 65)) {
      issues.push('Age must be between 18-65 years');
    }
    
    if (data.weight && data.weight < 50) {
      issues.push('Weight must be at least 50 kg');
    }
    
    if (data.hasTattoo) {
      const tattooDate = data.tattooDate ? new Date(data.tattooDate) : null;
      if (tattooDate) {
        const monthsSinceTattoo = (new Date().getTime() - tattooDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
        if (monthsSinceTattoo < 6) {
          issues.push('Must wait 6 months after getting a tattoo');
        }
      }
    }
    
    return {
      passed: issues.length === 0,
      issues
    };
  };

  const handleNext = () => {
    if (step === 2) {
      const eligibility = checkBasicEligibility(formData);
      setEligibilityCheck(eligibility);
    }
    setStep(step + 1);
  };

  const handleSubmit = () => {
    onRegister(formData);
  };

  const updateField = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg p-8 mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
            <Droplet className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Blood Donor Registration</h1>
            <p className="text-red-100 mt-1">Join our life-saving community</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3, 4].map((s) => (
          <div key={s} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
              step >= s ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {step > s ? <CheckCircle className="w-5 h-5" /> : s}
            </div>
            {s < 4 && (
              <div className={`w-16 h-1 ${
                step > s ? 'bg-red-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center">
              <User className="w-6 h-6 mr-2 text-red-500" />
              Personal Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => updateField('firstName', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
                  placeholder="Enter first name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={(e) => updateField('lastName', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
                  placeholder="Enter last name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => updateField('email', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
                  placeholder="Enter email"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => updateField('phone', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
                  placeholder="Enter phone number"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  value={formData.dateOfBirth || ''}
                  onChange={(e) => updateField('dateOfBirth', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => updateField('gender', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg) *
                </label>
                <input
                  type="number"
                  value={formData.weight || ''}
                  onChange={(e) => updateField('weight', Number(e.target.value))}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
                  placeholder="Minimum 50 kg"
                  min="30"
                  max="200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Group *
                </label>
                <select
                  value={formData.bloodGroup || ''}
                  onChange={(e) => updateField('bloodGroup', e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500"
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Heart className="w-6 h-6 mr-2 text-red-500" />
              Medical History
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Do you have any medical conditions?</p>
                  <p className="text-sm text-gray-600">e.g., Diabetes, Hypertension, Heart disease</p>
                </div>
                <input
                  type="checkbox"
                  checked={(formData.medicalConditions?.length || 0) > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      updateField('medicalConditions', ['']);
                    } else {
                      updateField('medicalConditions', []);
                    }
                  }}
                  className="w-5 h-5 text-red-600"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Are you currently on medication?</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isOnMedication || false}
                  onChange={(e) => updateField('isOnMedication', e.target.checked)}
                  className="w-5 h-5 text-red-600"
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Do you have any tattoos?</p>
                  <p className="text-sm text-gray-600">Must wait 6 months after getting a tattoo</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.hasTattoo || false}
                  onChange={(e) => updateField('hasTattoo', e.target.checked)}
                  className="w-5 h-5 text-red-600"
                />
              </div>
              
              {formData.hasTattoo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of last tattoo
                  </label>
                  <input
                    type="date"
                    value={formData.tattooDate || ''}
                    onChange={(e) => updateField('tattooDate', e.target.value)}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              )}
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">Have you traveled abroad recently?</p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.hasTraveledAbroad || false}
                  onChange={(e) => updateField('hasTraveledAbroad', e.target.checked)}
                  className="w-5 h-5 text-red-600"
                />
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center">
              <Shield className="w-6 h-6 mr-2 text-red-500" />
              Eligibility Check
            </h2>
            
            {eligibilityCheck.passed ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold text-green-600 mb-2">
                  You're Eligible!
                </h3>
                <p className="text-gray-600">
                  Based on the information provided, you are eligible to donate blood.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-2 text-red-600 mb-4">
                  <AlertCircle className="w-6 h-6" />
                  <h3 className="font-semibold">Eligibility Issues Found:</h3>
                </div>
                {eligibilityCheck.issues.map((issue, index) => (
                  <div key={index} className="flex items-start space-x-2 p-3 bg-red-50 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                    <p className="text-red-700">{issue}</p>
                  </div>
                ))}
                <p className="text-sm text-gray-600 mt-4">
                  You can still register, but you may not be eligible to donate immediately.
                </p>
              </div>
            )}
            
            <div className="border-t pt-4 mt-6">
              <h3 className="font-semibold mb-3">Emergency Donor</h3>
              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium">Register as Emergency Donor</p>
                  <p className="text-sm text-gray-600">
                    You'll be notified for emergency blood requirements
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.isEmergencyDonor || false}
                  onChange={(e) => updateField('isEmergencyDonor', e.target.checked)}
                  className="w-5 h-5 text-red-600"
                />
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold flex items-center">
              <FileText className="w-6 h-6 mr-2 text-red-500" />
              Confirmation
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="font-semibold mb-4">Review Your Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Name</p>
                  <p className="font-medium">{formData.firstName} {formData.lastName}</p>
                </div>
                <div>
                  <p className="text-gray-600">Blood Group</p>
                  <p className="font-medium text-red-600">{formData.bloodGroup}</p>
                </div>
                <div>
                  <p className="text-gray-600">Email</p>
                  <p className="font-medium">{formData.email}</p>
                </div>
                <div>
                  <p className="text-gray-600">Phone</p>
                  <p className="font-medium">{formData.phone}</p>
                </div>
                <div>
                  <p className="text-gray-600">Weight</p>
                  <p className="font-medium">{formData.weight} kg</p>
                </div>
                <div>
                  <p className="text-gray-600">Emergency Donor</p>
                  <p className="font-medium">{formData.isEmergencyDonor ? 'Yes' : 'No'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm text-yellow-800">
                <strong>Declaration:</strong> I confirm that the information provided is true and 
                accurate. I understand that providing false information may have serious consequences.
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Previous
            </button>
          ) : (
            <button
              onClick={onCancel}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          )}
          
          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center px-8 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <Heart className="w-4 h-4 mr-2" />
              Register as Donor
            </button>
          )}
        </div>
      </div>
    </div>
  );
};