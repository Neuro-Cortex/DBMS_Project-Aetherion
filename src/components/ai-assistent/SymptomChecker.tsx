import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Stethoscope,
  ArrowRight,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Heart,
  Brain,
  Eye,
  Ear,
  Nose,
  Lung,
  Bone,
  Skin,
  Activity,
  Thermometer,
  Shield,
  User,
  Sparkles,
  RotateCcw
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { GlassmorphicCard } from '../../ui/GlassmorphicCard';
import { Button } from '../../ui/Button';
import { Badge } from '../../ui/Badge';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface SymptomCheckerProps {
  variant?: 'glass' | 'gradient' | 'neon';
  onComplete?: (result: SymptomResult) => void;
  className?: string;
}

export interface SymptomResult {
  severity: 'low' | 'medium' | 'high' | 'critical';
  possibleConditions: string[];
  recommendation: string;
  departmentSuggestion: string;
}

const bodyParts = [
  { id: 'head', label: 'Head', icon: Brain, color: 'purple' },
  { id: 'eyes', label: 'Eyes', icon: Eye, color: 'blue' },
  { id: 'ears', label: 'Ears', icon: Ear, color: 'cyan' },
  { id: 'nose', label: 'Nose', icon: Nose, color: 'green' },
  { id: 'chest', label: 'Chest', icon: Heart, color: 'red' },
  { id: 'lungs', label: 'Lungs', icon: Lung, color: 'blue' },
  { id: 'stomach', label: 'Stomach', icon: Activity, color: 'yellow' },
  { id: 'bones', label: 'Bones', icon: Bone, color: 'gray' },
  { id: 'skin', label: 'Skin', icon: Skin, color: 'pink' },
];

const symptomsByPart: Record<string, string[]> = {
  head: ['Headache', 'Dizziness', 'Migraine', 'Confusion', 'Memory loss'],
  eyes: ['Blurred vision', 'Redness', 'Pain', 'Dry eyes', 'Watery eyes'],
  ears: ['Earache', 'Hearing loss', 'Ringing', 'Discharge', 'Itching'],
  nose: ['Runny nose', 'Congestion', 'Bleeding', 'Sneezing', 'Loss of smell'],
  chest: ['Chest pain', 'Palpitations', 'Tightness', 'Shortness of breath'],
  lungs: ['Cough', 'Wheezing', 'Breathing difficulty', 'Sputum', 'Chest congestion'],
  stomach: ['Nausea', 'Vomiting', 'Bloating', 'Pain', 'Indigestion', 'Diarrhea'],
  bones: ['Joint pain', 'Stiffness', 'Swelling', 'Fracture', 'Back pain'],
  skin: ['Rash', 'Itching', 'Redness', 'Dryness', 'Bumps', 'Burn'],
};

// ============================================
// SYMPTOM CHECKER COMPONENT
// ============================================
export const SymptomChecker: React.FC<SymptomCheckerProps> = ({
  variant = 'glass',
  onComplete,
  className,
}) => {
  const [step, setStep] = useState(1);
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [duration, setDuration] = useState<string>('');
  const [severity, setSeverity] = useState(5);
  const [result, setResult] = useState<SymptomResult | null>(null);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const analyzeSymptoms = () => {
    let severityLevel: SymptomResult['severity'] = 'low';
    let conditions: string[] = [];
    let department = 'General Medicine';

    if (selectedPart === 'chest' || selectedPart === 'lungs') {
      severityLevel = severity > 7 ? 'critical' : severity > 4 ? 'high' : 'medium';
      conditions = ['Possible Cardiac Issue', 'Respiratory Infection', 'Asthma'];
      department = 'Cardiology';
    } else if (selectedPart === 'head') {
      severityLevel = severity > 7 ? 'high' : severity > 4 ? 'medium' : 'low';
      conditions = ['Migraine', 'Tension Headache', 'Sinusitis'];
      department = 'Neurology';
    } else if (selectedPart === 'stomach') {
      severityLevel = severity > 7 ? 'high' : 'medium';
      conditions = ['Gastritis', 'Food Poisoning', 'IBS'];
      department = 'Gastroenterology';
    } else {
      conditions = ['Infection', 'Inflammation', 'Allergic Reaction'];
    }

    const recommendation = severityLevel === 'critical'
      ? 'Seek immediate medical attention. Call emergency services.'
      : severityLevel === 'high'
      ? 'Consult a doctor within 24 hours.'
      : severityLevel === 'medium'
      ? 'Monitor symptoms and consult a doctor if they persist.'
      : 'Rest and home care should help. Consult if symptoms worsen.';

    const analysisResult: SymptomResult = {
      severity: severityLevel,
      possibleConditions: conditions,
      recommendation,
      departmentSuggestion: department,
    };

    setResult(analysisResult);
    onComplete?.(analysisResult);
    setStep(4);
  };

  const handleReset = () => {
    setStep(1);
    setSelectedPart(null);
    setSelectedSymptoms([]);
    setDuration('');
    setSeverity(5);
    setResult(null);
  };

  const severityColors = {
    low: 'bg-green-500/10 text-green-300 border-green-500/30',
    medium: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30',
    high: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
    critical: 'bg-red-500/10 text-red-300 border-red-500/30',
  } as const;

  return (
    <motion.div
      className={twMerge(clsx('max-w-4xl mx-auto', className))}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <GlassmorphicCard variant={variant} className="p-0 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-cyan-600/10 to-purple-600/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Stethoscope className="w-8 h-8 text-cyan-400" />
              </motion.div>
              <div>
                <h2 className="text-2xl font-bold text-white">AI Symptom Checker</h2>
                <p className="text-sm text-white/60">Get instant health insights</p>
              </div>
            </div>
            <Button variant="glassmorphic" size="sm" leftIcon={RotateCcw} onClick={handleReset}>
              Start Over
            </Button>
          </div>

          {/* Progress Bar */}
          {step < 4 && (
            <div className="mt-4 flex gap-2">
              {[1, 2, 3].map((s) => (
                <motion.div
                  key={s}
                  className="flex-1 h-2 rounded-full"
                  initial={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                  animate={{
                    backgroundColor: step >= s ? '#06b6d4' : 'rgba(255,255,255,0.1)',
                  }}
                  transition={{ duration: 0.5 }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {/* Step 1: Body Part */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Where are you experiencing discomfort?</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                  {bodyParts.map((part) => (
                    <motion.button
                      key={part.id}
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedPart(part.id)}
                      className={clsx(
                        'p-4 rounded-xl flex flex-col items-center gap-2 transition-all',
                        selectedPart === part.id
                          ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/20 border-2 border-cyan-500/50'
                          : 'bg-white/5 border border-white/10 hover:bg-white/10'
                      )}
                    >
                      <part.icon className={clsx('w-8 h-8', `text-${part.color}-400`)} />
                      <span className="text-xs text-white font-medium">{part.label}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button
                    variant="gradient"
                    size="lg"
                    rightIcon={ArrowRight}
                    onClick={() => setStep(2)}
                    disabled={!selectedPart}
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Symptoms */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">Select your symptoms</h3>
                <div className="flex flex-wrap gap-3">
                  {symptomsByPart[selectedPart || 'head'].map((symptom) => (
                    <motion.button
                      key={symptom}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleSymptom(symptom)}
                      className={clsx(
                        'px-4 py-2 rounded-xl text-sm font-medium transition-all',
                        selectedSymptoms.includes(symptom)
                          ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                          : 'bg-white/10 text-white/80 hover:bg-white/20'
                      )}
                    >
                      {selectedSymptoms.includes(symptom) && '✓ '}
                      {symptom}
                    </motion.button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button variant="glassmorphic" size="lg" leftIcon={ArrowLeft} onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button
                    variant="gradient"
                    size="lg"
                    rightIcon={ArrowRight}
                    onClick={() => setStep(3)}
                    disabled={selectedSymptoms.length === 0}
                  >
                    Next
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Severity */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">How severe is your discomfort?</h3>

                <div className="p-6 bg-white/5 rounded-xl">
                  <div className="flex justify-between mb-3">
                    <span className="text-sm text-white/60">Mild</span>
                    <span className="text-2xl font-black text-white">{severity}/10</span>
                    <span className="text-sm text-white/60">Severe</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={severity}
                    onChange={(e) => setSeverity(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-cyan-500 [&::-webkit-slider-thumb]:to-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-white/70 mb-2">How long have you had these symptoms?</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['Today', '1-3 Days', '1 Week', '1 Week+'].map((d) => (
                      <Button
                        key={d}
                        variant={duration === d ? 'gradient' : 'glassmorphic'}
                        size="sm"
                        onClick={() => setDuration(d)}
                      >
                        {d}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button variant="glassmorphic" size="lg" leftIcon={ArrowLeft} onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button
                    variant="gradient"
                    size="lg"
                    leftIcon={Sparkles}
                    onClick={analyzeSymptoms}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Analyze Symptoms
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Results */}
            {step === 4 && result && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-6"
              >
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={clsx(
                      'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4',
                      result.severity === 'low' && 'bg-green-500/20',
                      result.severity === 'medium' && 'bg-yellow-500/20',
                      result.severity === 'high' && 'bg-orange-500/20',
                      result.severity === 'critical' && 'bg-red-500/20'
                    )}
                  >
                    {result.severity === 'critical' || result.severity === 'high' ? (
                      <AlertTriangle className={clsx('w-10 h-10', result.severity === 'critical' ? 'text-red-400' : 'text-orange-400')} />
                    ) : (
                      <CheckCircle className={clsx('w-10 h-10', result.severity === 'low' ? 'text-green-400' : 'text-yellow-400')} />
                    )}
                  </motion.div>
                  <Badge className={severityColors[result.severity]} size="lg">
                    {result.severity.toUpperCase()} SEVERITY
                  </Badge>
                </div>

                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="text-white font-bold mb-2">Recommendation</h4>
                  <p className="text-white/80">{result.recommendation}</p>
                </div>

                <div className="p-4 bg-white/5 rounded-xl">
                  <h4 className="text-white font-bold mb-3">Possible Conditions</h4>
                  <div className="flex flex-wrap gap-2">
                    {result.possibleConditions.map((condition, i) => (
                      <Badge key={i} variant="outline" size="sm">{condition}</Badge>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-xl border border-cyan-500/20">
                  <h4 className="text-white font-bold mb-2">Suggested Department</h4>
                  <p className="text-cyan-300 text-lg font-medium">{result.departmentSuggestion}</p>
                </div>

                <div className="flex gap-3 justify-center">
                  <Button variant="gradient" size="lg" leftIcon={Stethoscope} onClick={handleReset}>
                    Check Again
                  </Button>
                  <Button variant="neon" size="lg" leftIcon={User}>
                    Book Doctor
                  </Button>
                </div>

                <p className="text-center text-xs text-white/40 mt-4">
                  ⚠️ This is an AI-based assessment. Please consult a healthcare professional for accurate diagnosis.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </GlassmorphicCard>
    </motion.div>
  );
};