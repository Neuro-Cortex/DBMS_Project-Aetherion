// src/components/Registration/RegistrationForm.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Mail, Lock, Eye, EyeOff, User, Phone, MapPin,
  ArrowRight, ChevronLeft, AlertCircle, CheckCircle2
} from 'lucide-react';
import { AccountRole, Gender } from '../../types/auth';

interface RegistrationFormProps {
  selectedRole: AccountRole;
  onBack: () => void;
  onSubmit: (data: any) => void;
  isLoading: boolean;
}

const baseSchema = z.object({
  fullName: z.string().min(3, 'Name must be at least 3 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  gender: z.enum(['male', 'female']),
  address: z.string().min(5, 'Address must be at least 5 characters'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const doctorSchema = baseSchema.extend({
  specialization: z.string().min(3, 'Specialization is required'),
  licenseNumber: z.string().min(5, 'License number is required'),
  experience: z.string().min(1, 'Experience is required'),
  qualifications: z.string().min(3, 'Qualifications are required'),
  consultationFee: z.string().min(1, 'Consultation fee is required'),
});

const hospitalSchema = baseSchema.extend({
  hospitalName: z.string().min(3, 'Hospital name is required'),
  registrationNumber: z.string().min(5, 'Registration number is required'),
  bedCapacity: z.string().min(1, 'Bed capacity is required'),
  icuCapacity: z.string().min(1, 'ICU capacity is required'),
  emergencyServices: z.boolean(),
});

const bloodDonorSchema = baseSchema.extend({
  bloodGroup: z.string().min(1, 'Blood group is required'),
  lastDonationDate: z.string().optional(),
  medicalConditions: z.string().optional(),
});

const pharmacySchema = baseSchema.extend({
  pharmacyName: z.string().min(3, 'Pharmacy name is required'),
  licenseNumber: z.string().min(5, 'License number is required'),
  deliveryAvailable: z.boolean(),
});

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  selectedRole,
  onBack,
  onSubmit,
  isLoading,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);

  const getSchema = () => {
    switch (selectedRole) {
      case 'doctor': return doctorSchema;
      case 'hospital_authority': return hospitalSchema;
      case 'blood_donor': return bloodDonorSchema;
      case 'pharmacy': return pharmacySchema;
      default: return baseSchema;
    }
  };

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(getSchema()),
  });

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const specializations = [
    'Cardiology', 'Dermatology', 'Neurology', 'Pediatrics',
    'Orthopedics', 'Psychiatry', 'Radiology', 'Surgery',
    'Oncology', 'Gynecology', 'Urology', 'ENT'
  ];

  const inputClass = (hasError: boolean) => `
    w-full pl-12 pr-4 py-3.5 bg-white/[0.03] border rounded-xl text-white text-sm
    placeholder-white/20 outline-none transition-all duration-300
    ${hasError ? 'border-red-500/50 bg-red-500/[0.03]' : 'border-white/[0.06] hover:border-white/[0.1] focus:border-cyan-400/50 focus:bg-white/[0.06]'}
  `;

  return (
    <div className="space-y-6">
      {/* Header with back button */}
      <div className="flex items-center gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onBack}
          className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06] text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <div>
          <h2 className="text-2xl font-bold text-white">Create Your Account</h2>
          <p className="text-white/30 text-xs capitalize">{selectedRole.replace('_', ' ')}</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-white/20 text-xs">Step {step}/2</span>
          <div className="flex gap-1.5">
            <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-cyan-400' : 'bg-white/[0.1]'}`} />
            <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-cyan-400' : 'bg-white/[0.1]'}`} />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {step === 1 ? (
          <>
            {/* Basic Information */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input
                    {...register('fullName')}
                    type="text"
                    placeholder="John Doe"
                    className={inputClass(!!errors.fullName)}
                  />
                </div>
                {errors.fullName && (
                  <p className="text-red-400 text-[11px] mt-1.5 ml-1">{errors.fullName.message as string}</p>
                )}
              </div>

              {/* Email */}
              <div className="sm:col-span-2">
                <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input
                    {...register('email')}
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass(!!errors.email)}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-[11px] mt-1.5 ml-1">{errors.email.message as string}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input
                    {...register('phone')}
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className={inputClass(!!errors.phone)}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-[11px] mt-1.5 ml-1">{errors.phone.message as string}</p>
                )}
              </div>

              {/* Gender */}
              <div>
                <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                  Gender
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['male', 'female'].map((gender) => (
                    <label
                      key={gender}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-300 cursor-pointer ${
                        watch('gender') === gender
                          ? 'border-cyan-400/50 bg-cyan-500/[0.08] text-white'
                          : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/[0.1]'
                      }`}
                    >
                      <input
                        {...register('gender')}
                        type="radio"
                        value={gender}
                        className="sr-only"
                      />
                      <span className="text-sm font-medium capitalize">{gender}</span>
                      {watch('gender') === gender && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      )}
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="text-red-400 text-[11px] mt-1.5 ml-1">{errors.gender.message as string}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Min. 8 characters"
                    className={inputClass(!!errors.password)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-white/30" />
                    ) : (
                      <Eye className="w-4 h-4 text-white/30" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-400 text-[11px] mt-1.5 ml-1">{errors.password.message as string}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                  <input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder="Re-enter password"
                    className={inputClass(!!errors.confirmPassword)}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-400 text-[11px] mt-1.5 ml-1">{errors.confirmPassword.message as string}</p>
                )}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Role-specific fields */}
            {/* Address (common) */}
            <div>
              <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                <input
                  {...register('address')}
                  type="text"
                  placeholder="Your address"
                  className={inputClass(!!errors.address)}
                />
              </div>
              {errors.address && (
                <p className="text-red-400 text-[11px] mt-1.5 ml-1">{errors.address.message as string}</p>
              )}
            </div>

            {/* Doctor-specific fields */}
            {selectedRole === 'doctor' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                      Specialization
                    </label>
                    <select
                      {...register('specialization')}
                      className={inputClass(!!errors.specialization)}
                    >
                      <option value="" className="bg-gray-900">Select specialization</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec} className="bg-gray-900">{spec}</option>
                      ))}
                    </select>
                    {errors.specialization && (
                      <p className="text-red-400 text-[11px] mt-1.5">{errors.specialization.message as string}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                      License Number
                    </label>
                    <input
                      {...register('licenseNumber')}
                      type="text"
                      placeholder="MED-12345"
                      className={inputClass(!!errors.licenseNumber)}
                    />
                    {errors.licenseNumber && (
                      <p className="text-red-400 text-[11px] mt-1.5">{errors.licenseNumber.message as string}</p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                      Experience (years)
                    </label>
                    <input
                      {...register('experience')}
                      type="number"
                      placeholder="5"
                      className={inputClass(!!errors.experience)}
                    />
                    {errors.experience && (
                      <p className="text-red-400 text-[11px] mt-1.5">{errors.experience.message as string}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                      Consultation Fee ($)
                    </label>
                    <input
                      {...register('consultationFee')}
                      type="number"
                      placeholder="100"
                      className={inputClass(!!errors.consultationFee)}
                    />
                    {errors.consultationFee && (
                      <p className="text-red-400 text-[11px] mt-1.5">{errors.consultationFee.message as string}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Hospital-specific fields */}
            {selectedRole === 'hospital_authority' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                      Hospital Name
                    </label>
                    <input
                      {...register('hospitalName')}
                      type="text"
                      placeholder="City General Hospital"
                      className={inputClass(!!errors.hospitalName)}
                    />
                    {errors.hospitalName && (
                      <p className="text-red-400 text-[11px] mt-1.5">{errors.hospitalName.message as string}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                      Registration Number
                    </label>
                    <input
                      {...register('registrationNumber')}
                      type="text"
                      placeholder="HOSP-12345"
                      className={inputClass(!!errors.registrationNumber)}
                    />
                    {errors.registrationNumber && (
                      <p className="text-red-400 text-[11px] mt-1.5">{errors.registrationNumber.message as string}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                      Bed Capacity
                    </label>
                    <input
                      {...register('bedCapacity')}
                      type="number"
                      placeholder="100"
                      className={inputClass(!!errors.bedCapacity)}
                    />
                    {errors.bedCapacity && (
                      <p className="text-red-400 text-[11px] mt-1.5">{errors.bedCapacity.message as string}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                      ICU Capacity
                    </label>
                    <input
                      {...register('icuCapacity')}
                      type="number"
                      placeholder="20"
                      className={inputClass(!!errors.icuCapacity)}
                    />
                    {errors.icuCapacity && (
                      <p className="text-red-400 text-[11px] mt-1.5">{errors.icuCapacity.message as string}</p>
                    )}
                  </div>
                  <div>
                    <label className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] cursor-pointer">
                      <input
                        {...register('emergencyServices')}
                        type="checkbox"
                        className="w-4 h-4 rounded border-white/[0.1] bg-white/[0.05] text-cyan-500 focus:ring-cyan-500/30"
                      />
                      <span className="text-white/60 text-sm">24/7 Emergency Services</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Blood Donor-specific fields */}
            {selectedRole === 'blood_donor' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    Blood Group
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {bloodGroups.map(group => (
                      <label
                        key={group}
                        className={`flex items-center justify-center p-3 rounded-xl border transition-all cursor-pointer ${
                          watch('bloodGroup') === group
                            ? 'border-red-400/50 bg-red-500/[0.08] text-white'
                            : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:border-white/[0.1]'
                        }`}
                      >
                        <input
                          {...register('bloodGroup')}
                          type="radio"
                          value={group}
                          className="sr-only"
                        />
                        <span className="text-sm font-bold">{group}</span>
                      </label>
                    ))}
                  </div>
                  {errors.bloodGroup && (
                    <p className="text-red-400 text-[11px] mt-1.5">{errors.bloodGroup.message as string}</p>
                  )}
                </div>
                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    Last Donation Date (Optional)
                  </label>
                  <input
                    {...register('lastDonationDate')}
                    type="date"
                    className={inputClass(false)}
                  />
                </div>
              </motion.div>
            )}

            {/* Pharmacy-specific fields */}
            {selectedRole === 'pharmacy' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    Pharmacy Name
                  </label>
                  <input
                    {...register('pharmacyName')}
                    type="text"
                    placeholder="City Pharmacy"
                    className={inputClass(!!errors.pharmacyName)}
                  />
                  {errors.pharmacyName && (
                    <p className="text-red-400 text-[11px] mt-1.5">{errors.pharmacyName.message as string}</p>
                  )}
                </div>
                <div>
                  <label className="text-white/40 text-xs font-medium uppercase tracking-wider mb-2 block">
                    License Number
                  </label>
                  <input
                    {...register('licenseNumber')}
                    type="text"
                    placeholder="PHARM-12345"
                    className={inputClass(!!errors.licenseNumber)}
                  />
                  {errors.licenseNumber && (
                    <p className="text-red-400 text-[11px] mt-1.5">{errors.licenseNumber.message as string}</p>
                  )}
                </div>
                <label className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] cursor-pointer">
                  <input
                    {...register('deliveryAvailable')}
                    type="checkbox"
                    className="w-4 h-4 rounded border-white/[0.1] bg-white/[0.05] text-cyan-500 focus:ring-cyan-500/30"
                  />
                  <span className="text-white/60 text-sm">Delivery Service Available</span>
                </label>
              </motion.div>
            )}
          </>
        )}

        {/* Navigation Buttons */}
        <div className="flex gap-3 mt-6">
          {step === 2 && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              type="button"
              onClick={() => setStep(1)}
              className="px-6 py-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] text-white/60 text-sm font-medium hover:bg-white/[0.04] hover:text-white transition-all"
            >
              Previous
            </motion.button>
          )}
          
          {step === 1 ? (
            <motion.button
              type="button"
              onClick={() => setStep(2)}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold text-sm hover:shadow-lg hover:shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              type="submit"
              disabled={isLoading}
              className={`flex-1 py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-white/[0.05] text-white/30 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg hover:shadow-blue-500/25'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <CheckCircle2 className="w-4 h-4" />
                </>
              )}
            </motion.button>
          )}
        </div>
      </form>
    </div>
  );

// ✅ Male/Female selection with visual radio buttons
/*
{['male', 'female'].map((gender) => (
  <label>
    <input {...register('gender')} type="radio" value={gender} />
    {gender}
  </label>
))}

// ✅ Dynamic forms based on selected role
{selectedRole === 'doctor' && (
  // Doctor-specific fields: specialization, license, experience, fee
)}
{selectedRole === 'hospital_authority' && (
  // Hospital-specific fields: name, registration, beds, ICU, emergency
)}
{selectedRole === 'blood_donor' && (
  // Donor-specific fields: blood group, last donation date
)}
{selectedRole === 'pharmacy' && (
  // Pharmacy-specific fields: pharmacy name, license, delivery
)}
*/


};

export default RegistrationForm;
