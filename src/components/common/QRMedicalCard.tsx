// src/components/common/QRMedicalCard.tsx
import React from 'react';
import QRCode from '@/shims/QRCode';

interface MedicalCardProps {
  userData: {
    name: string;
    bloodGroup: string;
    allergies: string[];
    emergencyContact: string;
    medicalConditions: string[];
  };
}

export const QRMedicalCard: React.FC<MedicalCardProps> = ({ userData }) => {
  const medicalData = JSON.stringify({
    name: userData.name,
    blood: userData.bloodGroup,
    allergies: userData.allergies.join(', '),
    contact: userData.emergencyContact,
    conditions: userData.medicalConditions.join(', ')
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 max-w-sm">
      <div className="text-center mb-4">
        <h3 className="text-lg font-bold text-red-600">🩺 Medical ID Card</h3>
      </div>
      
      {/* QR Code */}
      <div className="flex justify-center mb-4">
        <QRCode
          value={medicalData}
          size={150}
          level="H"
          includeMargin={true}
          imageSettings={{
            src: "/medical-icon.png",
            height: 30,
            width: 30,
            excavate: true
          }}
        />
      </div>

      {/* User Info */}
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Name:</span>
          <span className="font-medium">{userData.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Blood Group:</span>
          <span className="font-bold text-red-600">{userData.bloodGroup}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Allergies:</span>
          <span className="text-yellow-600">{userData.allergies.join(', ') || 'None'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600 dark:text-gray-400">Emergency:</span>
          <span className="font-medium">{userData.emergencyContact}</span>
        </div>
      </div>

      {/* Download Button */}
      <button
        onClick={() => window.print()}
        className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
      >
        Download Card
      </button>
    </div>
  );
};

export default QRMedicalCard;