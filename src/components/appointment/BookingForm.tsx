import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar,
  Clock,
  User,
  Stethoscope,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Shield,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Plus,
  X,
  AlertCircle,
  FileText,
  MessageSquare
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';
import { Input } from '../../ui/Input';
import { Select } from '../../ui/Select';
import { DoctorCard } from '../doctors/DoctorCard';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  phone?: string;
  email?: string;
  avatar?: string;
  experience?: number;
  rating?: number;
  reviewCount?: number;
  price?: number;
  location?: string;
  hospital?: string;
}

export interface Patient {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  emergencyContacts?: Array<{ name?: string; phone?: string; relationship?: string }>;
}
export interface BookingData {
  doctorId: string;
  patientId: string;
  date: string;
  time: string;
  type: 'consultation' | 'follow-up' | 'emergency' | 'checkup';
  symptoms: string[];
  notes: string;
  paymentMethod: 'insurance' | 'cash' | 'card';
  insuranceDetails?: {
    provider: string;
    policyNumber: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    emergencyContact: string;
  };
}

export interface BookingFormProps {
  doctor?: Doctor;
  patient?: Patient;
  variant?: 'glass' | 'gradient' | 'neon';
  onSubmit?: (data: BookingData) => void;
  onCancel?: () => void;
  className?: string;
}

// ============================================
// BOOKING FORM COMPONENT
// ============================================
export const BookingForm: React.FC<BookingFormProps> = ({
  doctor,
  patient,
  variant = 'glass',
  onSubmit,
  onCancel,
  className,
}) => {
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState<Partial<BookingData>>({
    type: 'consultation',
    paymentMethod: 'cash',
    symptoms: [],
    contactInfo: patient ? {
      phone: patient.phone,
      email: patient.email,
      emergencyContact: patient.emergencyContacts?.[0]?.phone || '',
    } : {},
  });
  const [selectedSymptom, setSelectedSymptom] = useState('');
  const [loading, setLoading] = useState(false);

  // Available time slots
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  ];

  // Available appointment types
  const appointmentTypes = [
    { value: 'consultation', label: 'Consultation', price: 50 },
    { value: 'follow-up', label: 'Follow-up', price: 30 },
    { value: 'emergency', label: 'Emergency', price: 100 },
    { value: 'checkup', label: 'Checkup', price: 40 },
  ];

  // Common symptoms
  const commonSymptoms = [
    'Fever', 'Headache', 'Cough', 'Chest Pain', 'Shortness of Breath',
    'Fatigue', 'Nausea', 'Dizziness', 'Back Pain', 'Joint Pain',
  ];

  const handleNextStep = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    onSubmit?.(bookingData as BookingData);
    setLoading(false);
    setStep(5); // Success step
  };

  const addSymptom = () => {
    if (selectedSymptom.trim() && !bookingData.symptoms?.includes(selectedSymptom)) {
      setBookingData(prev => ({
        ...prev,
        symptoms: [...(prev.symptoms || []), selectedSymptom],
      }));
      setSelectedSymptom('');
    }
  };

  const removeSymptom = (symptom: string) => {
    setBookingData(prev => ({
      ...prev,
      symptoms: prev.symptoms?.filter(s => s !== symptom) || [],
    }));
  };

  // Step 1: Doctor & Date Selection
  const Step1 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {doctor && (
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring' }}
        >
          <DoctorCard
            doctor={doctor}
            variant="glass"
            compact
            showActions={false}
            className="mb-6"
          />
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Appointment Type</label>
          <div className="grid grid-cols-2 gap-3">
            {appointmentTypes.map(type => (
              <motion.button
                key={type.value}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setBookingData(prev => ({ ...prev, type: type.value as any }))}
                className={clsx(
                  'p-4 rounded-xl text-left transition-all',
                  bookingData.type === type.value
                    ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg'
                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                )}
              >
                <p className="font-medium">{type.label}</p>
                <p className="text-sm">${type.price}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Preferred Date</label>
          <Input
            variant="glass"
            type="date"
            value={bookingData.date || ''}
            onChange={(e) => setBookingData(prev => ({ ...prev, date: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            leftIcon={Calendar}
          />
        </div>
      </div>

      {/* Time Slots */}
      <div>
        <label className="block text-sm font-medium text-white mb-3">Available Time Slots</label>
        <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
          {timeSlots.map(time => (
            <motion.button
              key={time}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setBookingData(prev => ({ ...prev, time }))}
              className={clsx(
                'p-3 rounded-xl text-sm font-medium transition-all',
                bookingData.time === time
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white/5 text-white/80 hover:bg-white/10'
              )}
            >
              {time}
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  // Step 2: Symptoms & Notes
  const Step2 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <label className="block text-sm font-medium text-white mb-3">Symptoms</label>
        <div className="flex gap-2 mb-4">
          <Input
            variant="glass"
            placeholder="Add symptom"
            value={selectedSymptom}
            onChange={(e) => setSelectedSymptom(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addSymptom()}
            className="flex-1"
          />
          <Button
            variant="neon"
            size="sm"
            iconOnly
            onClick={addSymptom}
            disabled={!selectedSymptom.trim()}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {bookingData.symptoms?.map((symptom, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="flex items-center gap-2 px-3 py-2 bg-white/10 rounded-lg"
            >
              <span className="text-sm text-white">{symptom}</span>
              <Button
                variant="ghost"
                size="xs"
                iconOnly
                onClick={() => removeSymptom(symptom)}
              >
                <X className="w-3 h-3" />
              </Button>
            </motion.div>
          ))}
          {commonSymptoms.filter(s => !bookingData.symptoms?.includes(s)).map(symptom => (
            <Button
              key={symptom}
              variant="outline"
              size="xs"
              onClick={() => setSelectedSymptom(symptom)}
            >
              {symptom}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Additional Notes</label>
        <textarea
          value={bookingData.notes || ''}
          onChange={(e) => setBookingData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Describe your condition or concerns..."
          className="w-full min-h-[120px] px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
        />
      </div>
    </motion.div>
  );

  // Step 3: Contact & Insurance
  const Step3 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          variant="glass"
          label="Phone Number"
          type="tel"
          value={bookingData.contactInfo?.phone || ''}
          onChange={(e) => setBookingData(prev => ({ 
            ...prev, 
            contactInfo: { ...(prev.contactInfo || {}), phone: e.target.value }
          }))}
          leftIcon={Phone}
          placeholder="+1 (555) 123-4567"
        />

        <Input
          variant="glass"
          label="Email Address"
          type="email"
          value={bookingData.contactInfo?.email || ''}
          onChange={(e) => setBookingData(prev => ({ 
            ...prev, 
            contactInfo: { ...(prev.contactInfo || {}), email: e.target.value }
          }))}
          leftIcon={Mail}
        />
      </div>

      <Input
        variant="glass"
        label="Emergency Contact"
        type="tel"
        value={bookingData.contactInfo?.emergencyContact || ''}
        onChange={(e) => setBookingData(prev => ({ 
          ...prev, 
          contactInfo: { ...(prev.contactInfo || {}), emergencyContact: e.target.value }
        }))}
        leftIcon={Phone}
        placeholder="Emergency contact number"
      />

      <div>
        <label className="block text-sm font-medium text-white mb-3">Payment Method</label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['insurance', 'cash', 'card'].map(method => (
            <motion.button
              key={method}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setBookingData(prev => ({ ...prev, paymentMethod: method as any }))}
              className={clsx(
                'p-4 rounded-xl text-center transition-all',
                bookingData.paymentMethod === method
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-white/5 text-white/80 hover:bg-white/10'
              )}
            >
              <Shield className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium capitalize">{method}</p>
            </motion.button>
          ))}
        </div>
      </div>

      {bookingData.paymentMethod === 'insurance' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 p-4 bg-white/5 rounded-xl"
        >
          <Input
            variant="glass"
            label="Insurance Provider"
            placeholder="e.g., Blue Cross Blue Shield"
            value={bookingData.insuranceDetails?.provider || ''}
            onChange={(e) => setBookingData(prev => ({ 
              ...prev, 
              insuranceDetails: { ...(prev.insuranceDetails || {}), provider: e.target.value }
            }))}
          />
          <Input
            variant="glass"
            label="Policy Number"
            placeholder="Enter policy number"
            value={bookingData.insuranceDetails?.policyNumber || ''}
            onChange={(e) => setBookingData(prev => ({ 
              ...prev, 
              insuranceDetails: { ...(prev.insuranceDetails || {}), policyNumber: e.target.value }
            }))}
          />
        </motion.div>
      )}
    </motion.div>
  );

  // Step 4: Confirmation
  const Step4 = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-6">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="w-20 h-20 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="w-10 h-10 text-white" />
        </motion.div>
        <h3 className="text-2xl font-bold text-white mb-2">Confirm Your Appointment</h3>
        <p className="text-white/60">Please review your booking details</p>
      </div>

      <GlassmorphicCard variant="glass" className="p-6">
        <h4 className="text-lg font-bold text-white mb-4">Booking Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-white/70">Doctor:</span>
            <span className="text-white font-medium">{doctor?.name || 'Dr. Selected'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Date:</span>
            <span className="text-white font-medium">{bookingData.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Time:</span>
            <span className="text-white font-medium">{bookingData.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Type:</span>
            <Badge variant="gradient" size="sm">
              {bookingData.type}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Symptoms:</span>
            <span className="text-white text-sm">{bookingData.symptoms?.join(', ') || 'None reported'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/70">Contact:</span>
            <span className="text-white text-sm">{bookingData.contactInfo?.phone}</span>
          </div>
          <div className="flex justify-between pt-4 border-t border-white/10">
            <span className="text-lg font-bold text-white">Total:</span>
            <span className="text-2xl font-black text-green-400">
              ${appointmentTypes.find(t => t.value === bookingData.type)?.price || 0}
            </span>
          </div>
        </div>
      </GlassmorphicCard>

      {/* Terms & Conditions */}
      <div className="flex items-start gap-3 p-4 bg-white/5 rounded-xl">
        <input
          type="checkbox"
          className="w-5 h-5 text-cyan-500 bg-transparent border-white/20 rounded focus:ring-cyan-500 mt-1"
          defaultChecked
          required
        />
        <label className="text-sm text-white/80">
          I agree to the <span className="text-cyan-400 hover:underline cursor-pointer">Terms of Service</span> and 
          <span className="text-cyan-400 hover:underline cursor-pointer ml-1">Privacy Policy</span>
        </label>
      </div>
    </motion.div>
  );

  // Step 5: Success
  const Step5 = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className="text-center py-12"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, ease: 'easeInOut' }}
        className="w-24 h-24 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6"
      >
        <CheckCircle className="w-12 h-12 text-white" />
      </motion.div>
      <h3 className="text-3xl font-black text-white mb-4">Appointment Confirmed!</h3>
      <p className="text-white/60 mb-6 max-w-md mx-auto">
        Your appointment has been successfully booked. You will receive a confirmation email and SMS shortly.
      </p>
      <div className="flex justify-center gap-3">
        <Button
          variant="glassmorphic"
          size="lg"
          leftIcon={FileText}
          onClick={() => {
            // Download appointment slip
          }}
        >
          Download Slip
        </Button>
        <Button
          variant="gradient"
          size="lg"
          leftIcon={Calendar}
          onClick={() => {
            // Add to calendar
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add to Calendar
        </Button>
      </div>
    </motion.div>
  );

  return (
    <div className={twMerge('max-w-4xl mx-auto', className)}>
      {/* Progress Indicator */}
      {step < 5 && (
        <GlassmorphicCard variant={variant} className="mb-6 p-4">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <motion.div
                  className={clsx(
                    'w-10 h-10 rounded-full flex items-center justify-center font-bold',
                    step >= s
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                      : 'bg-white/10 text-white/40'
                  )}
                  animate={step >= s ? { scale: [1, 1.1, 1] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {s}
                </motion.div>
                {s < 4 && (
                  <div className={clsx(
                    'flex-1 h-1 mx-2',
                    step > s ? 'bg-gradient-to-r from-cyan-600 to-blue-600' : 'bg-white/10'
                  )} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-white/60">
            <span>Details</span>
            <span>Symptoms</span>
            <span>Contact</span>
            <span>Confirm</span>
          </div>
        </GlassmorphicCard>
      )}

      {/* Form Content */}
      <GlassmorphicCard variant={variant} className="p-6">
        <AnimatePresence mode="wait">
          {step === 1 && <Step1 />}
          {step === 2 && <Step2 />}
          {step === 3 && <Step3 />}
          {step === 4 && <Step4 />}
          {step === 5 && <Step5 />}
        </AnimatePresence>
      </GlassmorphicCard>

      {/* Navigation */}
      {step < 5 && (
        <motion.div
          className="flex justify-between mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Button
            variant="glassmorphic"
            size="lg"
            leftIcon={ArrowLeft}
            onClick={handlePrevStep}
            disabled={step === 1}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Previous
          </Button>

          {step < 4 ? (
            <Button
              variant="gradient"
              size="lg"
              rightIcon={ArrowRight}
              onClick={handleNextStep}
              disabled={
                (step === 1 && (!bookingData.date || !bookingData.time)) ||
                (step === 3 && !bookingData.contactInfo?.phone)
              }
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Next Step
            </Button>
          ) : (
            <Button
              variant="success"
              size="lg"
              rightIcon={CheckCircle}
              onClick={handleSubmit}
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2" />
                  Confirming...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
          )}
        </motion.div>
      )}

      {/* Cancel Button */}
      {step < 5 && onCancel && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-4"
        >
          <Button
            variant="ghost"
            size="sm"
            leftIcon={X}
            onClick={onCancel}
          >
            Cancel Booking
          </Button>
        </motion.div>
      )}
    </div>
  );
};