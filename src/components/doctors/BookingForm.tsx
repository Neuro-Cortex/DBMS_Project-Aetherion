// src/components/appointment/BookingForm.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar,  User, Stethoscope, MapPin, Video, Phone,
  CheckCircle, ChevronRight, ChevronLeft, AlertCircle,
  CreditCard, Shield,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// ============================================
// TYPES
// ============================================
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  price: number;
  location: string;
  hospital: string;
  nextAvailable: string;
  consultationModes?: string[];
}

interface BookingFormProps {
  doctor: Doctor;
  onClose?: () => void;
  onBooked?: (bookingData: BookingData) => void;
}

interface BookingData {
  doctorId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  date: string;
  time: string;
  mode: string;
  reason: string;
  paymentMethod: string;
}

// ============================================
// CONSTANTS
// ============================================
const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM'
];

const CONSULTATION_MODES = [
  { id: 'in-person', label: 'In Person', icon: MapPin, desc: 'Visit the hospital' },
  { id: 'video', label: 'Video Call', icon: Video, desc: 'HD video consultation' },
  { id: 'phone', label: 'Phone Call', icon: Phone, desc: 'Voice consultation' },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card', icon: CreditCard },
  { id: 'insurance', label: 'Insurance', icon: Shield },
  { id: 'cash', label: 'Pay at Hospital', icon: DollarSign },
];

// ============================================
// MAIN COMPONENT
// ============================================
export const BookingForm: React.FC<BookingFormProps> = ({ doctor, onClose, onBooked }) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<BookingData>({
    doctorId: doctor.id,
    patientName: '',
    patientEmail: '',
    patientPhone: '',
    date: '',
    time: '',
    mode: 'in-person',
    reason: '',
    paymentMethod: 'card',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  // Generate next 7 days
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    };
  });

  const updateData = (field: keyof BookingData, value: string) => {
    setBookingData(prev => ({ ...prev, [field]: value }));
  };

  const canProceedStep1 = bookingData.patientName && bookingData.patientEmail && bookingData.patientPhone;
  const canProceedStep2 = bookingData.date && bookingData.time && bookingData.mode;
  const canProceedStep3 = bookingData.paymentMethod;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsSubmitting(false);
    setIsBooked(true);
    onBooked?.(bookingData);
  };

  if (isBooked) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
        className="bg-[#0a0a10] border border-white/[0.08] rounded-3xl p-10 text-center max-w-lg mx-auto">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Appointment Booked!</h2>
        <p className="text-white/40 mb-6">Your appointment with {doctor.name} has been confirmed.</p>
        <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] text-left space-y-2 mb-6">
          <p className="text-white/50 text-sm"><Calendar className="w-4 h-4 inline mr-2 text-cyan-400" />{bookingData.date} at {bookingData.time}</p>
          <p className="text-white/50 text-sm"><Stethoscope className="w-4 h-4 inline mr-2 text-cyan-400" />{doctor.name} • {doctor.specialty}</p>
          <p className="text-white/50 text-sm"><MapPin className="w-4 h-4 inline mr-2 text-cyan-400" />{doctor.hospital}</p>
        </div>
        <Button variant="gradient" size="sm" onClick={onClose} className="w-full">Done</Button>
      </motion.div>
    );
  }

  return (
    <div className="bg-[#0a0a10] border border-white/[0.08] rounded-3xl overflow-hidden max-w-2xl mx-auto shadow-2xl">
      
      {/* HEADER */}
      <div className="p-6 border-b border-white/[0.04] bg-white/[0.01]">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Book Appointment</h2>
          <button type="button" onClick={onClose} className="p-1.5 hover:bg-white/[0.06] rounded-lg transition-colors">
            <AlertCircle className="w-5 h-5 text-white/30" />
          </button>
        </div>

        {/* Doctor Mini Info */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shrink-0">
            {doctor.name.charAt(0)}
          </div>
          <div>
            <p className="text-white font-semibold text-sm">{doctor.name}</p>
            <p className="text-white/35 text-xs">{doctor.specialty} • ⭐ {doctor.rating}</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-emerald-400 font-bold text-sm">${doctor.price}</p>
            <p className="text-white/30 text-[10px]">per visit</p>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-2 mt-4">
          {[1, 2, 3].map((s) => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step > s ? 'bg-emerald-500 text-white' : step === s ? 'bg-cyan-500 text-white' : 'bg-white/[0.04] text-white/30'
              }`}>
                {step > s ? <CheckCircle className="w-4 h-4" /> : s}
              </div>
              {s < 3 && <div className={`flex-1 h-0.5 rounded-full ${step > s ? 'bg-emerald-500' : 'bg-white/[0.04]'}`} />}
            </React.Fragment>
          ))}
        </div>
        <div className="flex justify-between mt-1.5 text-[10px] text-white/25 px-1">
          <span>Your Info</span><span>Date & Time</span><span>Payment</span>
        </div>
      </div>

      {/* BODY */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          
          {/* STEP 1: Patient Info */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <h3 className="text-white font-semibold text-sm">Patient Information</h3>
              {[
                { label: 'Full Name', field: 'patientName' as const, type: 'text', icon: User, placeholder: 'Enter your full name' },
                { label: 'Email Address', field: 'patientEmail' as const, type: 'email', icon: Mail, placeholder: 'your@email.com' },
                { label: 'Phone Number', field: 'patientPhone' as const, type: 'tel', icon: Phone, placeholder: '+1 (555) 000-0000' },
              ].map((input) => {
                const Icon = input.icon;
                return (
                  <div key={input.field}>
                    <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1.5 block">{input.label}</label>
                    <div className="relative">
                      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20 pointer-events-none" />
                      <input type={input.type} value={bookingData[input.field]} onChange={(e) => updateData(input.field, e.target.value)}
                        placeholder={input.placeholder}
                        className="w-full pl-9 pr-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/15 transition-all" />
                    </div>
                  </div>
                );
              })}
              <div>
                <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-1.5 block">Reason for Visit (Optional)</label>
                <textarea value={bookingData.reason} onChange={(e) => updateData('reason', e.target.value)}
                  placeholder="Describe your symptoms or reason for consultation..."
                  className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white text-sm placeholder-white/20 focus:outline-none focus:border-white/15 transition-all resize-none h-20" />
              </div>
            </motion.div>
          )}

          {/* STEP 2: Date & Time */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h3 className="text-white font-semibold text-sm">Select Date</h3>
              <div className="grid grid-cols-4 gap-2">
                {dates.map((d) => (
                  <button key={d.value} type="button" onClick={() => updateData('date', d.value)}
                    className={`p-3 rounded-xl text-xs font-medium transition-all ${
                      bookingData.date === d.value
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-white/[0.02] text-white/50 border border-white/[0.04] hover:border-white/[0.1]'
                    }`}>
                    <div className="text-[10px] opacity-60">{d.label.split(' ')[0]}</div>
                    <div className="text-base font-bold">{d.label.split(' ')[1]}</div>
                    <div className="text-[10px] opacity-60">{d.label.split(' ')[2]}</div>
                  </button>
                ))}
              </div>

              <h3 className="text-white font-semibold text-sm pt-2">Select Time</h3>
              <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                {TIME_SLOTS.map((time) => (
                  <button key={time} type="button" onClick={() => updateData('time', time)}
                    className={`p-2.5 rounded-xl text-xs font-medium transition-all ${
                      bookingData.time === time
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                        : 'bg-white/[0.02] text-white/50 border border-white/[0.04] hover:border-white/[0.1]'
                    }`}>
                    {time}
                  </button>
                ))}
              </div>

              <h3 className="text-white font-semibold text-sm pt-2">Consultation Mode</h3>
              <div className="grid grid-cols-3 gap-3">
                {CONSULTATION_MODES.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button key={mode.id} type="button" onClick={() => updateData('mode', mode.id)}
                      className={`p-4 rounded-xl text-center transition-all ${
                        bookingData.mode === mode.id
                          ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                          : 'bg-white/[0.02] text-white/40 border border-white/[0.04] hover:border-white/[0.1]'
                      }`}>
                      <Icon className="w-6 h-6 mx-auto mb-2" />
                      <p className="text-xs font-medium">{mode.label}</p>
                      <p className="text-[10px] opacity-50 mt-0.5">{mode.desc}</p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
              <h3 className="text-white font-semibold text-sm">Payment Method</h3>
              <div className="space-y-3">
                {PAYMENT_METHODS.map((method) => {
                  const Icon = method.icon;
                  return (
                    <button key={method.id} type="button" onClick={() => updateData('paymentMethod', method.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${
                        bookingData.paymentMethod === method.id
                          ? 'bg-cyan-500/10 border border-cyan-500/20'
                          : 'bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1]'
                      }`}>
                      <Icon className={`w-5 h-5 ${bookingData.paymentMethod === method.id ? 'text-cyan-400' : 'text-white/30'}`} />
                      <span className={`text-sm font-medium ${bookingData.paymentMethod === method.id ? 'text-white' : 'text-white/50'}`}>{method.label}</span>
                      {bookingData.paymentMethod === method.id && <CheckCircle className="w-4 h-4 text-cyan-400 ml-auto" />}
                    </button>
                  );
                })}
              </div>

              {/* Summary */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-2">
                <h3 className="text-white font-semibold text-sm mb-2">Booking Summary</h3>
                <p className="text-white/40 text-xs flex justify-between"><span>Doctor</span><span className="text-white/60">{doctor.name}</span></p>
                <p className="text-white/40 text-xs flex justify-between"><span>Date & Time</span><span className="text-white/60">{bookingData.date} at {bookingData.time}</span></p>
                <p className="text-white/40 text-xs flex justify-between"><span>Mode</span><span className="text-white/60 capitalize">{bookingData.mode}</span></p>
                <div className="border-t border-white/[0.04] pt-2 mt-2 flex justify-between">
                  <span className="text-white text-sm font-bold">Total</span>
                  <span className="text-emerald-400 text-sm font-bold">${doctor.price}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER */}
      <div className="p-6 border-t border-white/[0.04] flex items-center justify-between">
        {step > 1 ? (
          <Button variant="glass" size="sm" onClick={() => setStep(s => s - 1)}>
            <ChevronLeft className="w-4 h-4 mr-1.5" /> Back
          </Button>
        ) : <div />}

        {step < 3 ? (
          <Button variant="gradient" size="sm" onClick={() => setStep(s => s + 1)} disabled={step === 1 ? !canProceedStep1 : !canProceedStep2}>
            Continue <ChevronRight className="w-4 h-4 ml-1.5" />
          </Button>
        ) : (
          <Button variant="gradient" size="sm" onClick={handleSubmit} disabled={!canProceedStep3 || isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> Processing...</span>
            ) : (
              <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Confirm Booking</span>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

// Missing imports
import { DollarSign, Mail, RefreshCw } from 'lucide-react';

export default BookingForm;