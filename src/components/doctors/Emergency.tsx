// src/components/doctors/Emergency.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, User, MapPin, Activity, Phone, Search, Shield } from 'lucide-react';
import { Card } from 'src/ui/Card';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Input } from 'src/ui/Input';

interface EmergencyCase {
  id: string;
  patientName: string;
  condition: string;
  severity: 'critical' | 'severe' | 'moderate' | 'stable';
  location: string;
  contact: string;
  time: string;
  status: 'waiting' | 'in-treatment' | 'stabilized' | 'discharged';
}

const emergencyCases: EmergencyCase[] = [
  { id: 'E001', patientName: 'Abdul Karim', condition: 'Chest Pain - Suspected MI', severity: 'critical', location: 'Emergency Room 3', contact: '+880-1712-345678', time: '5 min ago', status: 'waiting' },
  { id: 'E002', patientName: 'Fatima Begum', condition: 'Severe Head Injury', severity: 'critical', location: 'Ambulance Bay', contact: '+880-1812-987654', time: '12 min ago', status: 'in-treatment' },
  { id: 'E003', patientName: 'Hasan Ali', condition: 'Acute Asthma Attack', severity: 'severe', location: 'ER Bed 7', contact: '+880-1912-456789', time: '25 min ago', status: 'in-treatment' },
  { id: 'E004', patientName: 'Nusrat Jahan', condition: 'Road Traffic Accident', severity: 'severe', location: 'Trauma Bay 2', contact: '+880-1612-789123', time: '40 min ago', status: 'waiting' },
  { id: 'E005', patientName: 'Rahim Uddin', condition: 'Food Poisoning', severity: 'moderate', location: 'Observation Room', contact: '+880-1512-321654', time: '1 hr ago', status: 'stabilized' },
  { id: 'E006', patientName: 'Sajeda Khatun', condition: 'Hypertensive Crisis', severity: 'critical', location: 'ICU Step-down', contact: '+880-1312-654987', time: '2 hr ago', status: 'in-treatment' },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const severityColors: Record<string, string> = {
  critical: 'text-red-400 bg-red-500/10 border-red-500/20',
  severe: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  moderate: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  stable: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

const statusColors: Record<string, string> = {
  waiting: 'text-red-400',
  'in-treatment': 'text-amber-400',
  stabilized: 'text-blue-400',
  discharged: 'text-emerald-400',
};

const Emergency: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null);

  const filtered = emergencyCases.filter(c => {
    const matchesSearch = c.patientName.toLowerCase().includes(searchQuery.toLowerCase()) || c.condition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSeverity = filterSeverity ? c.severity === filterSeverity : true;
    return matchesSearch && matchesSeverity;
  });

  const criticalCount = emergencyCases.filter(c => c.severity === 'critical').length;
  const waitingCount = emergencyCases.filter(c => c.status === 'waiting').length;
  const inTreatmentCount = emergencyCases.filter(c => c.status === 'in-treatment').length;

  return (
    <div className="min-h-screen bg-[#030508]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white flex items-center gap-3">
            <AlertCircle className="w-8 h-8 text-red-400" /> Emergency Cases
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time emergency case management</p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 text-center border-red-500/20">
            <p className="text-2xl font-black text-red-400">{criticalCount}</p>
            <p className="text-xs text-slate-400">Critical</p>
          </Card>
          <Card className="p-4 text-center border-amber-500/20">
            <p className="text-2xl font-black text-amber-400">{waitingCount}</p>
            <p className="text-xs text-slate-400">Waiting</p>
          </Card>
          <Card className="p-4 text-center border-blue-500/20">
            <p className="text-2xl font-black text-blue-400">{inTreatmentCount}</p>
            <p className="text-xs text-slate-400">In Treatment</p>
          </Card>
          <Card className="p-4 text-center border-emerald-500/20">
            <p className="text-2xl font-black text-emerald-400">{emergencyCases.length}</p>
            <p className="text-xs text-slate-400">Total Today</p>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Search patient or condition..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={Search}
            className="flex-1"
          />
          <div className="flex gap-2">
            {['critical', 'severe', 'moderate', 'stable'].map(s => (
              <Button
                key={s}
                variant={filterSeverity === s ? 'primary' : 'ghost'}
                size="xs"
                onClick={() => setFilterSeverity(filterSeverity === s ? null : s)}
                className="capitalize"
              >
                {s}
              </Button>
            ))}
          </div>
        </div>

        {/* Emergency Cases List */}
        <div className="space-y-3">
          {filtered.map((caseItem) => (
            <motion.div key={caseItem.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className={`p-4 hover:border-red-500/20 transition-all cursor-pointer border-l-4 ${caseItem.severity === 'critical' ? 'border-l-red-500' : caseItem.severity === 'severe' ? 'border-l-amber-500' : caseItem.severity === 'moderate' ? 'border-l-blue-500' : 'border-l-emerald-500'}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${caseItem.severity === 'critical' ? 'bg-red-500/10' : caseItem.severity === 'severe' ? 'bg-amber-500/10' : caseItem.severity === 'moderate' ? 'bg-blue-500/10' : 'bg-emerald-500/10'}`}>
                    <User className={`w-5 h-5 ${caseItem.severity === 'critical' ? 'text-red-400' : caseItem.severity === 'severe' ? 'text-amber-400' : caseItem.severity === 'moderate' ? 'text-blue-400' : 'text-emerald-400'}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-bold">{caseItem.patientName}</h4>
                      <Badge variant={caseItem.severity === 'critical' ? 'danger' : caseItem.severity === 'severe' ? 'warning' : caseItem.severity === 'moderate' ? 'info' : 'success'} size="xs" className="capitalize">
                        {caseItem.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-300 mt-1">{caseItem.condition}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {caseItem.location}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {caseItem.contact}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {caseItem.time}</span>
                      <span className={`flex items-center gap-1 font-medium capitalize ${statusColors[caseItem.status]}`}>
                        <Activity className="w-3 h-3" /> {caseItem.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="glass" size="xs"><Shield className="w-4 h-4 mr-1" /> Triage</Button>
                    <Button variant="glass" size="xs">View Details</Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Emergency;