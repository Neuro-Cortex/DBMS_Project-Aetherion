// src/components/women/SpecialCare.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart, Baby, Sparkles, Shield, ArrowRight, CheckCircle,
  Flower2, Moon, Sun, Activity, Droplet, X, Calendar, Star
} from 'lucide-react';
import { GlassmorphicCard } from '@/components/ui/GlassmorphicCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

// ============================================
// TYPES
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
  onBookPackage?: (packageId: string) => void;
  className?: string;
}

// ============================================
// DEFAULT PACKAGES
// ============================================
const defaultPackages: CarePackage[] = [
  {
    id: 'pcos', title: 'PCOS/PCOD Care',
    description: 'Comprehensive management for Polycystic Ovary Syndrome',
    icon: Flower2, color: 'purple',
    recommendedFor: 'Women aged 18-45 with irregular periods',
    testsIncluded: ['Hormonal Panel', 'Ultrasound', 'Glucose Tolerance', 'Thyroid Panel', 'Lipid Profile'],
    price: 149, discount: 20, duration: '3 months program',
    tips: ['Maintain a balanced diet', 'Regular exercise', 'Manage stress levels', 'Track your menstrual cycle'],
  },
  {
    id: 'prenatal', title: 'Prenatal Wellness',
    description: 'Complete care for a healthy pregnancy journey',
    icon: Baby, color: 'pink',
    recommendedFor: 'Pregnant women at any stage',
    testsIncluded: ['CBC', 'Blood Type & Rh', 'Glucose Screening', 'Ultrasound', 'BP Monitoring', 'Urine Analysis'],
    price: 199, discount: 15, duration: 'Throughout pregnancy',
    tips: ['Take prenatal vitamins daily', 'Stay hydrated', 'Attend all checkups', 'Practice gentle exercise'],
  },
  {
    id: 'fertility', title: 'Fertility Check',
    description: 'Advanced fertility assessment and guidance',
    icon: Sparkles, color: 'cyan',
    recommendedFor: 'Women planning pregnancy or facing conception issues',
    testsIncluded: ['AMH Test', 'FSH/LH Levels', 'Progesterone', 'Ultrasound', 'HSG Test', 'Genetic Screening'],
    price: 299, duration: '1-time assessment',
    tips: ['Track ovulation cycle', 'Maintain healthy weight', 'Reduce caffeine intake', 'Consult specialist early'],
  },
  {
    id: 'menopause', title: 'Menopause Support',
    description: 'Navigate menopause with confidence and care',
    icon: Moon, color: 'orange',
    recommendedFor: 'Women aged 40+ experiencing menopausal symptoms',
    testsIncluded: ['Hormone Panel', 'Bone Density Scan', 'Thyroid Function', 'Cardiac Risk', 'Vitamin D & Calcium'],
    price: 179, discount: 10, duration: '6 months program',
    tips: ['Calcium-rich diet', 'Weight-bearing exercises', 'Quality sleep', 'Stress management techniques'],
  },
  {
    id: 'breast', title: 'Breast Health',
    description: 'Preventive breast health screening and awareness',
    icon: Shield, color: 'rose',
    recommendedFor: 'All women aged 20+',
    testsIncluded: ['Clinical Exam', 'Mammogram', 'Ultrasound', 'BRCA Test', 'Risk Assessment'],
    price: 129, duration: 'Annual checkup',
    tips: ['Monthly self-examination', 'Know family history', 'Maintain healthy weight', 'Limit alcohol intake'],
  },
  {
    id: 'wellness', title: "Women's Wellness",
    description: 'Complete annual health checkup for women',
    icon: Heart, color: 'emerald',
    recommendedFor: 'All women for preventive care',
    testsIncluded: ['CBC', 'Thyroid Panel', 'Iron Studies', 'Vitamin B12 & D', 'Pap Smear', 'STI Screening'],
    price: 99, discount: 25, duration: 'Annual',
    tips: ['Annual checkups are essential', 'Stay up-to-date on vaccines', 'Practice safe habits', 'Mental health matters'],
  },
];

// Color mapping for Tailwind
const colorMap: Record<string, { bg: string; text: string; border: string; gradient: string; light: string }> = {
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', gradient: 'from-purple-500 to-purple-400', light: 'bg-purple-500/5' },
  pink: { bg: 'bg-pink-500/10', text: 'text-pink-400', border: 'border-pink-500/20', gradient: 'from-pink-500 to-pink-400', light: 'bg-pink-500/5' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', gradient: 'from-cyan-500 to-cyan-400', light: 'bg-cyan-500/5' },
  orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/20', gradient: 'from-orange-500 to-orange-400', light: 'bg-orange-500/5' },
  rose: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20', gradient: 'from-rose-500 to-rose-400', light: 'bg-rose-500/5' },
  emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', gradient: 'from-emerald-500 to-emerald-400', light: 'bg-emerald-500/5' },
  red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/20', gradient: 'from-red-500 to-red-400', light: 'bg-red-500/5' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', gradient: 'from-green-500 to-green-400', light: 'bg-green-500/5' },
};

// ============================================
// MAIN COMPONENT
// ============================================
export const SpecialCare: React.FC<SpecialCareProps> = ({
  packages = defaultPackages,
  onBookPackage,
  className = '',
}) => {
  const [selectedPackage, setSelectedPackage] = useState<CarePackage | null>(null);

  return (
    <div className={`space-y-6 ${className}`}>

      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 2, repeat: Infinity }}
          className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/20 mb-4">
          <Heart className="w-8 h-8 text-pink-400" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Women's Special Care</h2>
        <p className="text-white/35 text-sm max-w-lg mx-auto">
          Tailored health packages designed for every stage of a woman's life
        </p>
      </motion.div>

      {/* PACKAGES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {packages.map((pkg, index) => {
          const Icon = pkg.icon;
          const colors = colorMap[pkg.color] || colorMap.purple;

          return (
            <motion.div key={pkg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.06 }}
              whileHover={{ y: -5 }} onClick={() => setSelectedPackage(pkg)} className="cursor-pointer">
              <GlassmorphicCard variant="elevated" padding="none" hover="glow">
                {/* Top accent bar */}
                <div className={`h-1 bg-gradient-to-r ${colors.gradient}`} />

                <div className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${colors.bg} ${colors.border} border`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>
                    {pkg.discount && (
                      <Badge variant="danger" size="xs" className="animate-pulse">{pkg.discount}% OFF</Badge>
                    )}
                  </div>

                  <h3 className="text-white font-semibold text-base mb-1.5">{pkg.title}</h3>
                  <p className="text-white/35 text-xs leading-relaxed mb-4">{pkg.description}</p>

                  {/* Tests */}
                  <div className="mb-4">
                    <p className="text-white/25 text-[10px] uppercase tracking-wider mb-2">Includes</p>
                    <div className="flex flex-wrap gap-1.5">
                      {pkg.testsIncluded.slice(0, 3).map((test) => (
                        <span key={test} className="px-2 py-0.5 rounded-md bg-white/[0.02] text-white/40 text-[10px] border border-white/[0.04] flex items-center gap-1">
                          <CheckCircle className="w-2.5 h-2.5 text-emerald-400" />{test}
                        </span>
                      ))}
                      {pkg.testsIncluded.length > 3 && (
                        <span className="text-white/25 text-[10px] px-1">+{pkg.testsIncluded.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="pt-4 border-t border-white/[0.04] flex items-center justify-between">
                    <div>
                      {pkg.discount && (
                        <span className="text-white/25 text-xs line-through mr-2">
                          ${Math.round(pkg.price / (1 - pkg.discount / 100))}
                        </span>
                      )}
                      <span className="text-white font-bold text-lg">${pkg.price}</span>
                      <span className="text-white/25 text-[10px] ml-1">/{pkg.duration.split(' ')[0]}</span>
                    </div>
                    <Button variant="gradient" size="xs" onClick={(e) => { e.stopPropagation(); onBookPackage?.(pkg.id); }} className="gap-1">
                      Book <ArrowRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </GlassmorphicCard>
            </motion.div>
          );
        })}
      </div>

      {/* DETAIL MODAL */}
      <AnimatePresence>
        {selectedPackage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedPackage(null)}>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative z-10 w-full max-w-lg bg-[#0a0a10] border border-white/[0.08] rounded-2xl shadow-2xl max-h-[85vh] overflow-y-auto">
              
              {(() => {
                const colors = colorMap[selectedPackage.color] || colorMap.purple;
                const Icon = selectedPackage.icon;
                return (
                  <>
                    <div className={`h-1.5 bg-gradient-to-r ${colors.gradient}`} />
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                          <div className={`p-2.5 rounded-xl ${colors.bg} border ${colors.border}`}>
                            <Icon className={`w-5 h-5 ${colors.text}`} />
                          </div>
                          <div>
                            <h3 className="text-white font-semibold text-lg">{selectedPackage.title}</h3>
                            <p className="text-white/30 text-xs">{selectedPackage.duration}</p>
                          </div>
                        </div>
                        <button type="button" onClick={() => setSelectedPackage(null)} className="p-1.5 hover:bg-white/[0.06] rounded-lg">
                          <X className="w-5 h-5 text-white/40" />
                        </button>
                      </div>

                      <p className="text-white/50 text-sm mb-4">{selectedPackage.description}</p>

                      <div className={`p-3 rounded-xl ${colors.light} border ${colors.border} mb-4`}>
                        <p className="text-white/30 text-[10px] uppercase tracking-wider mb-1">Recommended For</p>
                        <p className="text-white/70 text-xs">{selectedPackage.recommendedFor}</p>
                      </div>

                      <div className="mb-5">
                        <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Tests Included</p>
                        <div className="space-y-1.5">
                          {selectedPackage.testsIncluded.map((test, i) => (
                            <div key={i} className="flex items-center gap-2 text-white/50 text-xs">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />{test}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mb-5">
                        <p className="text-white/40 text-xs font-medium uppercase tracking-wider mb-3">Health Tips</p>
                        <div className="space-y-1.5">
                          {selectedPackage.tips.map((tip, i) => (
                            <div key={i} className="flex items-start gap-2 text-white/45 text-xs">
                              <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />{tip}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] mb-5">
                        <div>
                          <p className="text-white/30 text-[10px] uppercase tracking-wider">Price</p>
                          <div className="flex items-baseline gap-2">
                            {selectedPackage.discount && (
                              <span className="text-white/25 text-sm line-through">
                                ${Math.round(selectedPackage.price / (1 - selectedPackage.discount / 100))}
                              </span>
                            )}
                            <span className="text-white font-bold text-2xl">${selectedPackage.price}</span>
                          </div>
                        </div>
                        {selectedPackage.discount && (
                          <Badge variant="danger" size="sm">Save {selectedPackage.discount}%</Badge>
                        )}
                      </div>

                      <Button variant="gradient" size="sm" onClick={() => { onBookPackage?.(selectedPackage.id); setSelectedPackage(null); }} className="w-full gap-2">
                        <Calendar className="w-4 h-4" /> Book {selectedPackage.title}
                      </Button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SpecialCare;