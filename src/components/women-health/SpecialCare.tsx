import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart,
  Baby,
  Sparkles,
  Shield,
  ArrowRight,
  CheckCircle,
  Flower2,
  Moon,
  Sun,
  Activity,
  Droplet,
  X,
  Calendar
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface CarePackage {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  recommendedFor: string;
  testsIncluded: string[];
  price: number;
  discount?: number;
  duration: string;
  tips: string[];
}

export interface SpecialCareProps {
  packages?: CarePackage[];
  variant?: 'glass' | 'gradient' | 'neon';
  onBookPackage?: (packageId: string) => void;
  className?: string;
}

// ============================================
// DEFAULT PACKAGES
// ============================================
const defaultPackages: CarePackage[] = [
  {
    id: 'pcos',
    title: 'PCOS/PCOD Care',
    description: 'Comprehensive management for Polycystic Ovary Syndrome',
    icon: Flower2,
    color: 'purple',
    recommendedFor: 'Women aged 18-45 with irregular periods',
    testsIncluded: ['Hormonal Panel', 'Ultrasound', 'Glucose Tolerance', 'Thyroid Panel', 'Lipid Profile'],
    price: 149,
    discount: 20,
    duration: '3 months program',
    tips: ['Maintain a balanced diet', 'Regular exercise', 'Manage stress levels', 'Track your menstrual cycle'],
  },
  {
    id: 'prenatal',
    title: 'Prenatal Wellness',
    description: 'Complete care for a healthy pregnancy journey',
    icon: Baby,
    color: 'pink',
    recommendedFor: 'Pregnant women at any stage',
    testsIncluded: ['CBC', 'Blood Type & Rh', 'Glucose Screening', 'Ultrasound', 'Blood Pressure Monitoring', 'Urine Analysis'],
    price: 199,
    discount: 15,
    duration: 'Throughout pregnancy',
    tips: ['Take prenatal vitamins daily', 'Stay hydrated', 'Attend all checkups', 'Practice gentle exercise'],
  },
  {
    id: 'fertility',
    title: 'Fertility Check',
    description: 'Advanced fertility assessment and guidance',
    icon: Sparkles,
    color: 'cyan',
    recommendedFor: 'Women planning pregnancy or facing conception issues',
    testsIncluded: ['AMH Test', 'FSH/LH Levels', 'Progesterone', 'Ultrasound', 'HSG Test', 'Genetic Screening'],
    price: 299,
    duration: '1-time assessment',
    tips: ['Track ovulation cycle', 'Maintain healthy weight', 'Reduce caffeine intake', 'Consult a specialist early'],
  },
  {
    id: 'menopause',
    title: 'Menopause Support',
    description: 'Navigate menopause with confidence and care',
    icon: Moon,
    color: 'orange',
    recommendedFor: 'Women aged 40+ experiencing menopausal symptoms',
    testsIncluded: ['Hormone Panel', 'Bone Density Scan', 'Thyroid Function', 'Cardiac Risk Assessment', 'Vitamin D & Calcium'],
    price: 179,
    discount: 10,
    duration: '6 months program',
    tips: ['Calcium-rich diet', 'Weight-bearing exercises', 'Quality sleep', 'Stress management techniques'],
  },
  {
    id: 'breast',
    title: 'Breast Health',
    description: 'Preventive breast health screening and awareness',
    icon: Shield,
    color: 'rose',
    recommendedFor: 'All women aged 20+',
    testsIncluded: ['Clinical Breast Exam', 'Mammogram', 'Breast Ultrasound', 'BRCA Gene Test (if indicated)', 'Risk Assessment'],
    price: 129,
    duration: 'Annual checkup',
    tips: ['Monthly self-examination', 'Know your family history', 'Maintain healthy weight', 'Limit alcohol intake'],
  },
  {
    id: 'wellness',
    title: 'Women's Wellness',
    description: 'Complete annual health checkup for women',
    icon: Heart,
    color: 'green',
    recommendedFor: 'All women for preventive care',
    testsIncluded: ['Complete Blood Count', 'Thyroid Panel', 'Iron Studies', 'Vitamin B12 & D', 'Pap Smear', 'STI Screening'],
    price: 99,
    discount: 25,
    duration: 'Annual',
    tips: ['Annual checkups are essential', 'Stay up-to-date on vaccines', 'Practice safe habits', 'Mental health matters too'],
  },
];

// ============================================
// SPECIAL CARE COMPONENT
// ============================================
export const SpecialCare: React.FC<SpecialCareProps> = ({
  packages = defaultPackages,
  variant = 'glass',
  onBookPackage,
  className,
}) => {
  const [selectedPackage, setSelectedPackage] = useState<CarePackage | null>(null);

  return (
    <motion.div
      className={twMerge(clsx('space-y-6', className))}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="inline-block mb-4"
        >
          <Heart className="w-12 h-12 text-pink-400" />
        </motion.div>
        <h2 className="text-3xl font-black text-white mb-2">Women's Special Care</h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Tailored health packages designed for every stage of a woman's life
        </p>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg, index) => {
          const Icon = pkg.icon;
          return (
            <motion.div
              key={pkg.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, type: 'spring' }}
              whileHover={{ scale: 1.03, y: -5 }}
              onClick={() => setSelectedPackage(pkg)}
              className="cursor-pointer"
            >
              <GlassmorphicCard
                variant={variant}
                className="p-0 overflow-hidden h-full flex flex-col"
              >
                {/* Top Color Bar */}
                <div className={clsx('h-1.5', `bg-gradient-to-r from-${pkg.color}-500 to-${pkg.color}-400`)} />

                <div className="p-6 flex-1 flex flex-col">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={clsx('p-3 rounded-xl bg-${pkg.color}-500/10')}>
                      <Icon className={clsx('w-6 h-6', `text-${pkg.color}-400`)} />
                    </div>
                    {pkg.discount && (
                      <Badge variant="danger" size="xs" className="animate-pulse">
                        {pkg.discount}% OFF
                      </Badge>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">{pkg.title}</h3>
                  <p className="text-sm text-white/60 mb-4 flex-1">{pkg.description}</p>

                  {/* Tests Included */}
                  <div className="mb-4">
                    <p className="text-xs text-white/50 mb-2">Includes:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.testsIncluded.slice(0, 3).map((test, i) => (
                        <Badge key={i} variant="outline" size="xs">
                          <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                          {test}
                        </Badge>
                      ))}
                      {pkg.testsIncluded.length > 3 && (
                        <span className="text-xs text-white/40 px-2 py-0.5">
                          +{pkg.testsIncluded.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        {pkg.discount && (
                          <span className="text-sm text-white/40 line-through mr-2">
                            ${(pkg.price / (1 - pkg.discount / 100)).toFixed(0)}
                          </span>
                        )}
                        <span className="text-2xl font-black text-white">${pkg.price}</span>
                      </div>
                      <Badge variant="secondary" size="xs">{pkg.duration}</Badge>
                    </div>

                    <Button
                      variant="gradient"
                      size="sm"
                      fullWidth
                      rightIcon={ArrowRight}
                      className={clsx(`from-${pkg.color}-600 to-${pkg.color}-500`)}
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookPackage?.(pkg.id);
                      }}
                    >
                      Book Package
                    </Button>
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          );
        })}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedPackage(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25 }}
              className="w-full max-w-lg bg-gray-900/95 border border-white/20 rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={clsx('h-2', `bg-gradient-to-r from-${selectedPackage.color}-500 to-${selectedPackage.color}-400`)} />

              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className={clsx('p-3 rounded-xl bg-${selectedPackage.color}-500/10')}>
                      <selectedPackage.icon className={clsx('w-6 h-6', `text-${selectedPackage.color}-400`)} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{selectedPackage.title}</h3>
                      <p className="text-sm text-white/60">{selectedPackage.duration}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setSelectedPackage(null)}
                    className="p-2 text-white/40 hover:text-white/70"
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <p className="text-white/80 mb-4">{selectedPackage.description}</p>

                <div className="p-3 bg-white/5 rounded-xl mb-4">
                  <p className="text-xs text-white/60 mb-1">Recommended for:</p>
                  <p className="text-sm text-white">{selectedPackage.recommendedFor}</p>
                </div>

                <div className="mb-6">
                  <h4 className="text-white font-bold mb-3">Tests Included</h4>
                  <div className="space-y-2">
                    {selectedPackage.testsIncluded.map((test, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-2 text-sm"
                      >
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-white/80">{test}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="text-white font-bold mb-3">Health Tips</h4>
                  <div className="space-y-2">
                    {selectedPackage.tips.map((tip, i) => (
                      <div key={i} className="flex items-start gap-2 text-sm text-white/70">
                        <Sparkles className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                        {tip}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl mb-6">
                  <div>
                    <p className="text-xs text-white/60">Package Price</p>
                    <div className="flex items-center gap-2">
                      {selectedPackage.discount && (
                        <span className="text-sm text-white/40 line-through">
                          ${(selectedPackage.price / (1 - selectedPackage.discount / 100)).toFixed(0)}
                        </span>
                      )}
                      <span className="text-3xl font-black text-white">${selectedPackage.price}</span>
                    </div>
                  </div>
                  {selectedPackage.discount && (
                    <Badge variant="danger" size="lg">Save {selectedPackage.discount}%</Badge>
                  )}
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  fullWidth
                  leftIcon={Calendar}
                  onClick={() => {
                    onBookPackage?.(selectedPackage.id);
                    setSelectedPackage(null);
                  }}
                  className={clsx(`from-${selectedPackage.color}-600 to-${selectedPackage.color}-500`)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Book {selectedPackage.title}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};