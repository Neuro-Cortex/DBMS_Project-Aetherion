// src/pages/hospital/HospitalAdminSections.tsx

import React from 'react';
import { BedAvailability } from '@/components/hospital/BedAvailability';
import { ICUTracker } from '@/components/hospital/ICUTracker';
import {
  HOSPITAL_ID,
  HOSPITAL_NAME,
  mockAdminBeds,
  mockIcuTrackerData,
} from './hospitalAdminMockData';

const PageShell: React.FC<{ title: string; subtitle?: string; children: React.ReactNode }> = ({
  title,
  subtitle,
  children,
}) => (
  <div className="min-h-full bg-gray-50 p-6">
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      {subtitle && <p className="text-gray-600 mt-1">{subtitle}</p>}
    </div>
    {children}
  </div>
);

const PlaceholderTable: React.FC<{
  columns: string[];
  rows: Record<string, string>[];
}> = ({ columns, rows }) => (
  <div className="bg-white rounded-lg shadow overflow-hidden">
    <table className="w-full text-sm">
      <thead className="bg-gray-50 border-b">
        <tr>
          {columns.map((col) => (
            <th key={col} className="text-left px-4 py-3 font-semibold text-gray-700">
              {col}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-b last:border-0 hover:bg-gray-50">
            {columns.map((col) => (
              <td key={col} className="px-4 py-3 text-gray-600">
                {row[col]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export const HospitalBedsSection: React.FC = () => (
  <PageShell title="Bed Availability" subtitle={`Real-time beds — ${HOSPITAL_NAME}`}>
    <BedAvailability
      beds={mockAdminBeds}
      hospitalId={HOSPITAL_ID}
      hospitalName={HOSPITAL_NAME}
      realTime
    />
  </PageShell>
);

export const HospitalICUSection: React.FC = () => (
  <PageShell title="ICU Tracker" subtitle="Critical care capacity and equipment">
    <ICUTracker {...mockIcuTrackerData} realTime />
  </PageShell>
);

export const HospitalDoctorsSection: React.FC = () => (
  <PageShell title="Doctors" subtitle="Manage hospital physicians">
    <PlaceholderTable
      columns={['Name', 'Specialization', 'Department', 'Status', 'Fee']}
      rows={[
        { Name: 'Dr. Emily White', Specialization: 'Cardiology', Department: 'Cardiology', Status: 'Active', Fee: '$150' },
        { Name: 'Dr. James Chen', Specialization: 'Neurology', Department: 'Neurology', Status: 'Active', Fee: '$180' },
        { Name: 'Dr. Lisa Park', Specialization: 'Pediatrics', Department: 'Pediatrics', Status: 'On leave', Fee: '$120' },
      ]}
    />
  </PageShell>
);

export const HospitalDepartmentsSection: React.FC = () => (
  <PageShell title="Departments">
    <PlaceholderTable
      columns={['Department', 'Head Doctor', 'Beds', 'Available', 'Doctors']}
      rows={[
        { Department: 'Cardiology', 'Head Doctor': 'Dr. Emily White', Beds: '40', Available: '12', Doctors: '8' },
        { Department: 'Neurology', 'Head Doctor': 'Dr. James Chen', Beds: '35', Available: '10', Doctors: '6' },
        { Department: 'Orthopedics', 'Head Doctor': 'Dr. Mike Wilson', Beds: '30', Available: '15', Doctors: '5' },
      ]}
    />
  </PageShell>
);

export const HospitalBloodStockSection: React.FC = () => (
  <PageShell title="Blood Bank" subtitle="Current inventory">
    <PlaceholderTable
      columns={['Blood Group', 'Units', 'Status', 'Expiry']}
      rows={[
        { 'Blood Group': 'O+', Units: '120', Status: 'Sufficient', Expiry: '2024-03-15' },
        { 'Blood Group': 'O-', Units: '8', Status: 'Critical', Expiry: '2024-02-20' },
        { 'Blood Group': 'A+', Units: '85', Status: 'Sufficient', Expiry: '2024-03-10' },
        { 'Blood Group': 'AB-', Units: '12', Status: 'Low', Expiry: '2024-02-28' },
      ]}
    />
  </PageShell>
);

export const HospitalBloodDonorsSection: React.FC = () => (
  <PageShell title="Blood Donors" subtitle="Pending approvals">
    <PlaceholderTable
      columns={['Name', 'Blood Group', 'Phone', 'Status', 'Action']}
      rows={[
        { Name: 'Robert Brown', 'Blood Group': 'B+', Phone: '+1 555-0100', Status: 'Pending', Action: 'Review' },
        { Name: 'Anna Smith', 'Blood Group': 'A+', Phone: '+1 555-0101', Status: 'Approved', Action: '—' },
      ]}
    />
  </PageShell>
);

export const HospitalBloodRequestsSection: React.FC = () => (
  <PageShell title="Blood Requests">
    <PlaceholderTable
      columns={['Patient', 'Group', 'Units', 'Urgency', 'Status']}
      rows={[
        { Patient: 'Emma Davis', Group: 'O-', Units: '2', Urgency: 'Emergency', Status: 'Pending' },
        { Patient: 'John Doe', Group: 'A+', Units: '1', Urgency: 'Normal', Status: 'Approved' },
      ]}
    />
  </PageShell>
);

export const HospitalOxygenSection: React.FC = () => (
  <PageShell title="Oxygen Supply">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Total Cylinders', value: '200' },
        { label: 'Available', value: '150' },
        { label: 'In Use', value: '40' },
        { label: 'Days Left', value: '7' },
      ].map((item) => (
        <div key={item.label} className="bg-white rounded-lg shadow p-4">
          <p className="text-2xl font-bold text-gray-900">{item.value}</p>
          <p className="text-sm text-gray-600">{item.label}</p>
        </div>
      ))}
    </div>
  </PageShell>
);

export const HospitalAmbulanceSection: React.FC = () => (
  <PageShell title="Ambulance Fleet">
    <PlaceholderTable
      columns={['Vehicle', 'Type', 'Driver', 'Status']}
      rows={[
        { Vehicle: 'AMB-101', Type: 'Advanced', Driver: 'Mike R.', Status: 'Available' },
        { Vehicle: 'AMB-102', Type: 'Basic', Driver: 'Sarah L.', Status: 'On call' },
        { Vehicle: 'AMB-103', Type: 'Mobile ICU', Driver: 'Tom H.', Status: 'Maintenance' },
      ]}
    />
  </PageShell>
);

export const HospitalEmergencySection: React.FC = () => (
  <PageShell title="Emergency Services" subtitle="Active emergencies and response">
    <PlaceholderTable
      columns={['Type', 'Patient', 'Time', 'Status', 'Response']}
      rows={[
        { Type: 'Cardiac', Patient: 'Unknown', Time: '10:15 AM', Status: 'Active', Response: '6 min' },
        { Type: 'Trauma', Patient: 'J. Smith', Time: '09:45 AM', Status: 'Dispatched', Response: '8 min' },
      ]}
    />
  </PageShell>
);

export const HospitalAnnouncementsSection: React.FC = () => (
  <PageShell title="Announcements">
    <div className="space-y-3">
      {[
        { title: 'Blood donation camp', priority: 'Medium', date: '2024-02-16' },
        { title: 'ICU maintenance window', priority: 'High', date: '2024-02-17' },
      ].map((a) => (
        <div key={a.title} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
          <p className="font-medium">{a.title}</p>
          <p className="text-xs text-gray-500 mt-1">
            {a.priority} · {a.date}
          </p>
        </div>
      ))}
    </div>
  </PageShell>
);

export const HospitalAnalyticsSection: React.FC = () => (
  <PageShell title="Analytics" subtitle="Hospital performance overview">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-2">Bed occupancy (7 days)</h3>
        <p className="text-sm text-gray-500">65% → 75% weekly trend (mock)</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-semibold mb-2">Patient flow</h3>
        <p className="text-sm text-gray-500">Admissions vs discharges (mock)</p>
      </div>
    </div>
  </PageShell>
);

export const HospitalMessagesSection: React.FC = () => (
  <PageShell title="Messages" subtitle="Staff and patient communications">
    <p className="text-gray-600 bg-white rounded-lg shadow p-6">Messaging module — connect to backend when ready.</p>
  </PageShell>
);

export const HospitalReportsSection: React.FC = () => (
  <PageShell title="Reports">
    <p className="text-gray-600 bg-white rounded-lg shadow p-6">Export daily, weekly, and monthly hospital reports.</p>
  </PageShell>
);

export const HospitalSettingsSection: React.FC = () => (
  <PageShell title="Settings" subtitle="Hospital profile and preferences">
    <p className="text-gray-600 bg-white rounded-lg shadow p-6">Profile, notifications, and working hours configuration.</p>
  </PageShell>
);
