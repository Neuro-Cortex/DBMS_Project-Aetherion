import React, { useMemo, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FileText, Plus, Search, Download, Send, Pill } from 'lucide-react';

import { Card } from 'src/ui/Card';
import { Button } from 'src/ui/Button';
import { Badge } from 'src/ui/Badge';
import { Input } from 'src/ui/Input';
import { Modal } from 'src/ui/Modal';

interface Medicine {
  name: string;
  dosage: string;
  duration: string;
}

interface Prescription {
  id: string;
  patientName: string;
  date: string;
  medicines: Medicine[];
  diagnosis: string;
  status: 'draft' | 'issued';
}

const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'RX001',
    patientName: 'Rahima Khatun',
    date: '2026-05-20',
    medicines: [
      { name: 'Losartan 50mg', dosage: '1 tablet daily', duration: '30 days' },
      { name: 'Amlodipine 5mg', dosage: '1 tablet daily', duration: '30 days' },
    ],
    diagnosis: 'Hypertension Stage 1',
    status: 'issued',
  },
  {
    id: 'RX002',
    patientName: 'Kamal Hossain',
    date: '2026-05-18',
    medicines: [
      { name: 'Metformin 500mg', dosage: '1 tablet twice daily', duration: '30 days' },
      { name: 'Insulin Glargine', dosage: '10 units at bedtime', duration: '90 days' },
    ],
    diagnosis: 'Diabetes Type 2',
    status: 'issued',
  },
  {
    id: 'RX003',
    patientName: 'Nasrin Sultana',
    date: '2026-05-22',
    medicines: [
      { name: 'Iron Supplement', dosage: '1 tablet daily', duration: '90 days' },
      { name: 'Folic Acid', dosage: '400mcg daily', duration: '90 days' },
    ],
    diagnosis: 'Pregnancy - Routine Care',
    status: 'issued',
  },
  {
    id: 'RX004',
    patientName: 'Rafiqul Islam',
    date: '2026-05-15',
    medicines: [
      { name: 'Clopidogrel 75mg', dosage: '1 tablet daily', duration: '90 days' },
      { name: 'Atorvastatin 20mg', dosage: '1 tablet at night', duration: '90 days' },
    ],
    diagnosis: 'Post-Stent Care',
    status: 'issued',
  },
];

const Prescriptions: React.FC = () => {
  const [showNewPrescription, setShowNewPrescription] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [prescriptions] = useState<Prescription[]>(INITIAL_PRESCRIPTIONS);

  const filtered = useMemo(
    () =>
      prescriptions.filter((p) =>
        p.patientName.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [prescriptions, searchQuery],
  );

  const openNewPrescription = useCallback(
    () => setShowNewPrescription(true),
    [],
  );
  const closeNewPrescription = useCallback(
    () => setShowNewPrescription(false),
    [],
  );
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value),
    [],
  );

  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-16"
    >
      <Search className="w-16 h-16 text-slate-700 mx-auto mb-4" />
      <p className="text-slate-400 text-lg font-medium">
        {searchQuery
          ? 'No prescriptions found for your search.'
          : 'No prescriptions yet.'}
      </p>
      {searchQuery && (
        <Button
          variant="ghost"
          size="xs"
          className="mt-2 text-amber-400"
          onClick={() => setSearchQuery('')}
        >
          Clear search
        </Button>
      )}
    </motion.div>
  );

  const renderPrescriptionCard = (pres: Prescription) => (
    <Card
      key={pres.id}
      className="p-6 hover:border-amber-500/20 transition-all"
    >
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-white font-bold text-lg">{pres.patientName}</h3>
          <p className="text-slate-500 text-sm">{pres.date}</p>
        </div>
        <Badge variant={pres.status === 'issued' ? 'success' : 'warning'}>
          {pres.status}
        </Badge>
      </div>

      <p className="text-amber-400 text-sm font-bold mb-3">
        Diagnosis: {pres.diagnosis}
      </p>

      <div className="space-y-2 mb-4">
        {pres.medicines.map((med, i) => (
          <div
            key={`${pres.id}-${med.name}-${i}`}
            className="flex items-center gap-2 text-sm text-slate-400"
          >
            <Pill className="w-4 h-4 text-amber-400" />
            <span className="text-white font-bold">{med.name}</span>
            <span>- {med.dosage}</span>
            <span className="text-slate-600">({med.duration})</span>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="primary"
          size="xs"
          className="bg-amber-500"
        >
          <Download className="w-3.5 h-3.5 mr-1" />
          Download PDF
        </Button>
        <Button variant="outline" size="xs">
          <Send className="w-3.5 h-3.5 mr-1" />
          Send to Patient
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#030508]">
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-black text-white flex items-center gap-3">
              <FileText className="w-8 h-8 text-amber-400" />
              Prescriptions
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {prescriptions.length} prescriptions
            </p>
          </div>
          <Button
            variant="primary"
            className="bg-gradient-to-r from-amber-500 to-orange-500"
            onClick={openNewPrescription}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Prescription
          </Button>
        </motion.div>

        <Input
          placeholder="Search by patient name..."
          value={searchQuery}
          onChange={handleSearchChange}
          leftIcon={Search}
        />

        <div className="space-y-4">
          {filtered.length === 0
            ? renderEmptyState()
            : filtered.map(renderPrescriptionCard)}
        </div>
      </div>

      <AnimatePresence>
        {showNewPrescription && (
          <Modal
            isOpen
            onClose={closeNewPrescription}
            size="lg"
          >
            <div className="p-6">
              <h2 className="text-2xl font-black text-white mb-6">
                Write New Prescription
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-sm"
                      placeholder="Search patient..."
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">
                      Diagnosis
                    </label>
                    <input
                      type="text"
                      className="w-full p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-sm"
                      placeholder="Enter diagnosis..."
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-2 block">
                    Medicines
                  </label>
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="grid grid-cols-3 gap-3 mb-2"
                    >
                      <input
                        type="text"
                        className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-sm"
                        placeholder="Medicine name"
                      />
                      <input
                        type="text"
                        className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-sm"
                        placeholder="Dosage"
                      />
                      <input
                        type="text"
                        className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-white text-sm"
                        placeholder="Duration"
                      />
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    size="xs"
                    className="mt-1 text-amber-400"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Medicine
                  </Button>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="primary"
                    className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Issue Prescription
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Save as Draft
                  </Button>
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Prescriptions;