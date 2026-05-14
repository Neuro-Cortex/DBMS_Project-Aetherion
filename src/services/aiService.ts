// src/services/aiService.ts

import api, { simulateDelay } from './api';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  timestamp: string;
  metadata?: {
    quickReplies?: string[];
    actions?: MessageAction[];
    severity?: 'low' | 'medium' | 'high' | 'emergency';
    suggestions?: string[];
  };
}

export interface MessageAction {
  id: string;
  label: string;
  type: 'appointment' | 'prescription' | 'referral' | 'emergency';
  data?: any;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  context?: string;
}

export interface SymptomAnalysis {
  severity: 'low' | 'medium' | 'high' | 'critical';
  possibleConditions: string[];
  recommendation: string;
  departmentSuggestion: string;
  confidenceScore: number;
  emergencyLevel?: number;
  homeRemedies?: string[];
  warningSigns?: string[];
  medications?: string[];
}

export interface SymptomRequest {
  symptoms: string[];
  bodyPart: string;
  severity: number;
  duration: string;
  age?: number;
  gender?: string;
  medicalHistory?: string[];
  fever?: boolean;
  temperature?: number;
}

export interface PregnancyData {
  week: number;
  trimester: 1 | 2 | 3;
  babySize: string;
  babyWeight: string;
  babyLength?: string;
  development: string[];
  symptoms: string[];
  tips: string[];
  aiAdvice: string;
  nextCheckup?: string;
  medications?: string[];
  warningSigns?: string[];
  nutrition?: string[];
}

export interface BabyCareData {
  month: number;
  milestones: string[];
  feeding: string;
  sleep: string;
  tips: string[];
  aiTip: string;
  vaccinations?: string[];
  weightRange?: string;
  heightRange?: string;
  emergencySigns?: string[];
}

export interface MedicineInfo {
  name: string;
  genericName: string;
  dosage: string;
  price: number;
  pharmacy: string;
  location: string;
  distance: number;
  stock: 'in-stock' | 'limited' | 'out-of-stock';
  deliveryTime: string;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

const generateId = (): string => {
  return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const getCurrentTimestamp = (): string => {
  return new Date().toISOString();
};

// ============================================
// ENHANCED BOT RESPONSE GENERATOR
// ============================================

const generateBotResponse = (message: string): ChatMessage => {
  const text = message.toLowerCase();
  
  // Emergency detection (Priority 1)
  if (text.includes('emergency') || text.includes('heart attack') || text.includes('stroke') || 
      text.includes('chest pain') || text.includes('difficulty breathing') || 
      text.includes('severe bleeding') || text.includes('unconscious')) {
    return {
      id: generateId(),
      sender: 'bot',
      text: `🚨 **EMERGENCY ASSISTANCE ACTIVATED** 🚨\n\n**📞 Call Emergency Services Immediately:**\n• Ambulance: **999**\n• Police: **999**\n• Fire Service: **999**\n\n**📍 Share your location**\n**🆘 Help is on the way!**\n\n**⚠️ While waiting:**\n• Stay calm\n• Do not move patient unnecessarily\n• Loosen tight clothing\n• Monitor breathing\n\nDo you want me to find the nearest hospital?`,
      timestamp: getCurrentTimestamp(),
      metadata: {
        severity: 'emergency',
        quickReplies: ['Call 999', 'Find Nearest Hospital', 'First Aid Guide'],
        suggestions: ['Emergency Services', 'Ambulance', 'ER']
      }
    };
  }
  
  // Headache/Migraine (Priority 2)
  if (text.includes('headache') || text.includes('migraine') || text.includes('head pain')) {
    return {
      id: generateId(),
      sender: 'bot',
      text: `🤕 **Symptom Analysis: Headache**\n\n**Severity:** Mild to Moderate\n\n**Possible Causes:**\n• Dehydration 💧\n• Eye strain 👁️\n• Stress and tension 😰\n• Lack of sleep 😴\n• Sinus pressure 👃\n\n**💊 Immediate Relief:**\n1. Drink 2-3 glasses of water\n2. Rest in a dark, quiet room\n3. Apply cold compress to forehead\n4. Gentle neck and shoulder massage\n5. Take paracetamol (500mg) if needed\n\n**🌿 Home Remedies:**\n• Peppermint or lavender essential oil\n• Ginger tea\n• Magnesium-rich foods (nuts, seeds)\n\n**⚠️ When to See a Doctor:**\n• Headache lasts more than 48 hours\n• Accompanied by fever >101°F\n• Sudden severe "thunderclap" headache\n• Vision changes or confusion\n• Headache after head injury\n\nWould you like me to find a nearby neurologist or book a telehealth consultation?`,
      timestamp: getCurrentTimestamp(),
      metadata: {
        severity: 'medium',
        quickReplies: ['Find Neurologist', 'Home Remedies', 'Book Telehealth', 'Track Symptoms'],
        suggestions: ['Dr. Rahman - Neurologist', 'Dr. Sultana - General Physician']
      }
    };
  }
  
  // Fever (Priority 2)
  if (text.includes('fever') || text.includes('temperature') || text.includes('high temp')) {
    return {
      id: generateId(),
      sender: 'bot',
      text: `🌡️ **Fever Assessment**\n\n**Temperature Analysis:**\n• Low-grade: 99-101°F → Monitor at home\n• Moderate: 101-103°F → Take medication\n• High: 103-104°F → Seek medical advice\n• Very High: 104°F+ → **Emergency!**\n\n**💊 Recommended Treatment:**\n1. Take paracetamol (500mg) or ibuprofen (400mg)\n2. Stay hydrated with water/ORS solution\n3. Use lukewarm compress (not cold!)\n4. Rest and monitor every 4 hours\n5. Remove excess clothing\n\n**🚨 Emergency Signs (Go to ER):**\n• Fever >104°F\n• Difficulty breathing\n• Severe headache with stiff neck\n• Confusion or seizures\n• Persistent vomiting\n• Children: Fever with rash\n\n**📊 Age-Specific Advice:**\n• **Adults:** Seek care if fever >103°F for 3+ days\n• **Children (2-17):** Monitor closely\n• **Infants (<3 months):** Any fever >100.4°F = Emergency\n\nWould you like to book a telehealth consultation or find nearby hospitals?`,
      timestamp: getCurrentTimestamp(),
      metadata: {
        severity: 'high',
        quickReplies: ['Book Telehealth', 'Find Nearest ER', 'Fever in Children', 'Set Reminder'],
        suggestions: ['Emergency Room', 'Telehealth Consultation', 'Home Care']
      }
    };
  }
  
  // Doctor recommendation (Priority 3)
  if (text.includes('doctor') || text.includes('physician') || text.includes('specialist') || text.includes('find doctor')) {
    return {
      id: generateId(),
      sender: 'bot',
      text: `👨‍⚕️ **Top Doctors Near You**\n\n**🏆 AI Recommended:**\n\n**1. Dr. Md. Rahman** (Cardiology)\n⭐ 4.8 | 15 years exp | $50/visit\n🏥 Dhaka Medical College\n📍 2.5km away | Available Today\n\n**2. Dr. Fatema Sultana** (Pediatrics)\n⭐ 4.7 | 12 years exp | $30/visit\n🏥 City General Hospital\n📍 1.8km away | Available Tomorrow\n\n**3. Dr. Kabir Hossain** (Orthopedics)\n⭐ 4.9 | 20 years exp | $80/visit\n🏥 Metro Medical Hospital\n📍 3.2km away | Available Friday\n\n**4. Dr. Hasan Ahmed** (General Medicine)\n⭐ 4.6 | 8 years exp | $20/visit\n📍 0.5km away | Available Now\n\n**💡 Budget Recommendation:**\n• Under $30: Dr. Hasan Ahmed ($20)\n• Under $50: Dr. Fatema Sultana ($30)\n• Premium: Dr. Kabir Hossain ($80)\n\n**✅ Free Services:**\n• Online appointment booking\n• Prescription delivery\n• Follow-up consultation (50% off)\n\nWhich doctor would you like to book an appointment with?`,
      timestamp: getCurrentTimestamp(),
      metadata: {
        quickReplies: ['Book Dr. Hasan ($20)', 'Book Dr. Sultana ($30)', 'Compare All', 'Telehealth'],
        suggestions: ['Dr. Hasan Ahmed - $20', 'Dr. Fatema Sultana - $30', 'Video Consultation']
      }
    };
  }
  
  // Medicine/Pharmacy (Priority 3)
  if (text.includes('medicine') || text.includes('pharmacy') || text.includes('drug') || 
      text.includes('medication') || text.includes('tablet') || text.includes('capsule')) {
    return {
      id: generateId(),
      sender: 'bot',
      text: `💊 **Medicine Information & Pharmacy Locator**\n\n**🔍 Searching: Paracetamol 500mg**\n\n**📍 Nearby Pharmacies:**\n\n**1. Health Plus Pharmacy** 🏪\n• Price: $2.50 (In Stock ✅)\n• Distance: 300m | Open 24/7\n• Delivery: 20-30 mins\n\n**2. City Drug Store** 🏪\n• Price: $2.00 (Limited Stock ⚠️)\n• Distance: 800m | Open until 10 PM\n• Delivery: 30-45 mins\n\n**3. 24/7 Medico** 🏪\n• Price: $3.00 (In Stock ✅)\n• Distance: 1.5km | Open 24/7\n• Delivery: 15-20 mins\n\n**💊 Medicine Details:**\n• Generic Name: Acetaminophen\n• Uses: Fever, mild to moderate pain\n• Dosage: 500mg every 4-6 hours\n• Max: 3000mg per day\n\n**⚠️ Important:**\n• Do not exceed recommended dosage\n• Avoid alcohol\n• Can cause liver damage if overused\n\n**💰 Price Comparison:**\n• Lowest: $2.00 (City Drug Store)\n• Average: $2.50\n• Highest: $3.00\n\nWould you like to order from any of these pharmacies?`,
      timestamp: getCurrentTimestamp(),
      metadata: {
        quickReplies: ['Order Now', 'Compare Prices', 'Upload Prescription', 'Medicine Interactions'],
        suggestions: ['Paracetamol 500mg', 'Ibuprofen 400mg', 'Vitamin C']
      }
    };
  }
  
  // Pregnancy care (Priority 3)
  if (text.includes('pregnancy') || text.includes('pregnant') || text.includes('expecting') || text.includes('antenatal')) {
    return {
      id: generateId(),
      sender: 'bot',
      text: `🤰 **Pregnancy Care Guide (Week 24 - Second Trimester)**\n\n**📊 Your Baby's Development:**\n• Size: 🍆 Eggplant (12 inches / 30cm)\n• Weight: 1.3 lbs (600g)\n• Development: Lungs developing, hearing fully developed\n\n**✅ This Week's Checklist:**\n- [ ] Schedule glucose screening test (24-28 weeks)\n- [ ] Monitor fetal kicks (10+ per 2 hours)\n- [ ] Continue prenatal vitamins\n- [ ] Practice pelvic floor exercises\n\n**💊 Current Medications:**\n• Folic Acid - 5mg daily (Morning)\n• Iron Supplement - 200mg daily (Evening)\n• Calcium - 500mg daily (Night)\n\n**📅 Upcoming Appointments:**\n• Glucose Tolerance Test - Next week\n• Regular Checkup + Ultrasound - April 5\n• 3D/4D Ultrasound - April 20 (optional)\n\n**🥗 Today's Meal Plan:**\n• Breakfast: Oatmeal with berries + milk\n• Lunch: Grilled chicken + brown rice + vegetables\n• Dinner: Salmon + quinoa + roasted vegetables\n\n**⚠️ Contact Doctor Immediately If:**\n• Severe abdominal pain\n• Vaginal bleeding\n• Decreased fetal movement (<10 kicks/2 hours)\n• Severe headache with vision changes\n• Chest pain or difficulty breathing\n\nWould you like to track your daily symptoms or set medication reminders?`,
      timestamp: getCurrentTimestamp(),
      metadata: {
        quickReplies: ['Track Kicks', 'Set Reminder', 'Hospital Bag Checklist', 'Birth Plan'],
        suggestions: ['Baby Development', 'Pregnancy Exercises', 'Nutrition Guide']
      }
    };
  }
  
  // Baby care (Priority 3)
  if (text.includes('baby') || text.includes('newborn') || text.includes('infant') || text.includes('toddler')) {
    return {
      id: generateId(),
      sender: 'bot',
      text: `👶 **Baby Care Guide (2-3 months old)**\n\n**📊 Development Milestones:**\n• ✅ Lifts head during tummy time\n• ✅ Follows objects with eyes\n• ✅ Smiles socially\n• 🔄 Pushes up on forearms (in progress)\n\n**🍼 Feeding Schedule:**\n• Breastfeeding: Every 2-3 hours (8-10x/day)\n• Formula: 4-5 oz every 3-4 hours\n• Signs of hunger: Rooting, sucking hands\n• Wet diapers: 6-8 per day (normal)\n\n**😴 Sleep Pattern:**\n• Total sleep: 14-17 hours/day\n• Night sleep: 8-10 hours (with wake-ups)\n• Naps: 3-4 naps (30 mins - 2 hours)\n\n**💉 Upcoming Vaccinations (4 months):**\n• DTaP, Hib, Polio, PCV13, Rotavirus\n\n**🚨 Emergency Signs (Call Doctor):**\n• Fever >100.4°F (38°C)\n• Difficulty breathing\n• Poor feeding (refusing 2+ feeds)\n• Lethargy or unresponsiveness\n• Dehydration (dry mouth, no tears)\n\nWould you like to track feeding or set vaccination reminders?`,
      timestamp: getCurrentTimestamp(),
      metadata: {
        quickReplies: ['Track Feeding', 'Vaccination Reminder', 'Growth Chart', 'Teething Relief'],
        suggestions: ['Feeding Tips', 'Sleep Training', 'Baby Products']
      }
    };
  }
  
  // Default response
  return {
    id: generateId(),
    sender: 'bot',
    text: `🩺 **AI Health Assistant - How can I help you?**\n\nI can assist you with:\n\n**🩺 Symptom Checking**\n• "I have a headache"\n• "I have a fever"\n• "Chest pain"\n\n**👨‍⚕️ Doctor Recommendations**\n• "Find a doctor"\n• "Best cardiologist near me"\n• "Doctor under $30"\n\n**💊 Medicine Information**\n• "Paracetamol price"\n• "Nearby pharmacy"\n• "Medicine delivery"\n\n**🤰 Pregnancy Care**\n• "Pregnancy week 24"\n• "Pregnancy symptoms"\n• "Baby development"\n\n**👶 Baby Care**\n• "Newborn care"\n• "Baby feeding"\n• "Vaccination schedule"\n\n**🚑 Emergency Help**\n• "Emergency"\n• "Ambulance"\n\n**What would you like to know?**`,
    timestamp: getCurrentTimestamp(),
    metadata: {
      quickReplies: ['Check Symptoms', 'Find Doctor', 'Medicine Info', 'Pregnancy Care', 'Baby Care', 'Emergency Help'],
      suggestions: ['Headache relief', 'Fever treatment', 'Doctor appointment', 'Medicine price']
    }
  };
};

// ============================================
// ENHANCED SYMPTOM ANALYSIS ENGINE
// ============================================

const analyzeSymptomsEngine = (data: SymptomRequest): SymptomAnalysis => {
  let severity: SymptomAnalysis['severity'] = 'low';
  let conditions: string[] = [];
  let department = 'General Medicine';
  let homeRemedies: string[] = [];
  let warningSigns: string[] = [];
  let medications: string[] = [];
  
  // Severity calculation
  if (data.severity >= 9) severity = 'critical';
  else if (data.severity >= 7) severity = 'high';
  else if (data.severity >= 4) severity = 'medium';
  
  // Check for fever
  if (data.fever || (data.temperature && data.temperature > 100.4)) {
    severity = severity === 'critical' ? 'critical' : 'high';
    medications.push('Paracetamol 500mg every 6 hours');
    homeRemedies.push('Stay hydrated with ORS solution');
    homeRemedies.push('Use lukewarm compress');
  }
  
  const bodyPart = data.bodyPart.toLowerCase();
  
  // Body part specific analysis
  if (bodyPart === 'chest') {
    conditions = ['Acid Reflux', 'Musculoskeletal Pain', 'Anxiety', 'Cardiac Issue (rare)'];
    department = 'Cardiology';
    homeRemedies = ['Sit upright', 'Practice deep breathing', 'Avoid lying down after eating'];
    warningSigns = ['Pain radiating to arm/jaw', 'Shortness of breath', 'Cold sweat', 'Nausea'];
    if (data.severity >= 6) {
      severity = 'high';
      warningSigns.push('Seek immediate medical attention');
    }
  } 
  else if (bodyPart === 'head') {
    conditions = ['Tension Headache', 'Migraine', 'Sinusitis', 'Eye Strain'];
    department = 'Neurology';
    homeRemedies = ['Rest in dark room', 'Apply cold compress', 'Stay hydrated', 'Avoid screens'];
    warningSigns = ['Sudden severe pain', 'Vision changes', 'Confusion', 'Speech difficulty'];
    medications.push('Paracetamol 500mg if needed');
  } 
  else if (bodyPart === 'stomach' || bodyPart === 'abdomen') {
    conditions = ['Gastritis', 'Food Poisoning', 'IBS', 'Indigestion'];
    department = 'Gastroenterology';
    homeRemedies = ['Rest stomach', 'BRAT diet (Banana, Rice, Apple, Toast)', 'Stay hydrated', 'Avoid spicy/oily food'];
    warningSigns = ['Severe pain', 'Blood in stool', 'Persistent vomiting', 'High fever'];
    medications.push('Antacid if needed');
  } 
  else if (bodyPart === 'throat') {
    conditions = ['Viral Pharyngitis', 'Tonsillitis', 'Allergies', 'Strep Throat'];
    department = 'ENT';
    homeRemedies = ['Salt water gargle', 'Warm tea with honey', 'Rest voice', 'Use humidifier'];
    warningSigns = ['Difficulty swallowing', 'Difficulty breathing', 'High fever', 'White patches'];
  } 
  else if (bodyPart === 'back') {
    conditions = ['Muscle Strain', 'Poor Posture', 'Herniated Disc', 'Sciatica'];
    department = 'Orthopedics';
    homeRemedies = ['Rest', 'Heat/cold therapy', 'Gentle stretching', 'Proper posture'];
    warningSigns = ['Numbness in legs', 'Loss of bladder control', 'Severe trauma'];
  } 
  else if (bodyPart === 'skin') {
    conditions = ['Allergic Reaction', 'Eczema', 'Contact Dermatitis', 'Fungal Infection'];
    department = 'Dermatology';
    homeRemedies = ['Apply cold compress', 'Use fragrance-free lotion', 'Avoid scratching', 'Oatmeal bath'];
    warningSigns = ['Spreading rapidly', 'Signs of infection', 'Accompanied by fever'];
  }
  
  // Add duration-based recommendations
  if (data.duration.includes('week') || parseInt(data.duration) > 7) {
    recommendation += ' Since symptoms persist for over a week, please consult a doctor.';
  }
  
  // Generate recommendation based on severity
  let recommendation = '';
  if (severity === 'critical') {
    recommendation = '⚠️ **URGENT:** Seek immediate medical attention. Call emergency services or go to nearest ER. Do not wait.';
  } else if (severity === 'high') {
    recommendation = '📅 **Schedule an appointment within 24 hours.** Monitor symptoms closely. Seek emergency care if symptoms worsen.';
  } else if (severity === 'medium') {
    recommendation = '💡 **Monitor symptoms for 24-48 hours.** Try home remedies. Consult doctor if symptoms persist or worsen.';
  } else {
    recommendation = '✅ **Rest at home.** Use home remedies. Follow up with doctor if symptoms last more than 3-5 days.';
  }
  
  return {
    severity,
    possibleConditions: [...new Set(conditions)],
    recommendation,
    departmentSuggestion: department,
    confidenceScore: parseFloat((0.7 + Math.random() * 0.25).toFixed(2)),
    emergencyLevel: severity === 'critical' ? 10 : severity === 'high' ? 7 : severity === 'medium' ? 4 : 2,
    homeRemedies: homeRemedies.slice(0, 4),
    warningSigns: warningSigns.slice(0, 4),
    medications: medications.length > 0 ? medications : undefined
  };
};

// ============================================
// PREGNANCY DATA (Enhanced)
// ============================================

const getPregnancyDataByWeek = (week: number): PregnancyData => {
  const trimester: 1 | 2 | 3 = week <= 12 ? 1 : week <= 28 ? 2 : 3;
  
  const pregnancyDataMap: Record<number, Partial<PregnancyData>> = {
    8: {
      babySize: 'Raspberry',
      babyWeight: '~1g',
      babyLength: '0.6 inches',
      development: ['Heart beating', 'Brain developing', 'Fingers forming'],
      symptoms: ['Morning sickness', 'Fatigue', 'Breast tenderness', 'Frequent urination'],
      tips: ['Take folic acid', 'Stay hydrated', 'Avoid alcohol and smoking'],
      medications: ['Folic Acid 5mg'],
      nutrition: ['Leafy greens', 'Citrus fruits', 'Whole grains']
    },
    12: {
      babySize: 'Plum',
      babyWeight: '~14g',
      babyLength: '2.1 inches',
      development: ['Reflexes develop', 'Fingers and toes separate', 'Nails form'],
      symptoms: ['Nausea decreasing', 'Energy returning', 'Visible bump'],
      tips: ['Schedule NT scan', 'Start gentle exercise', 'Eat balanced diet'],
      medications: ['Folic Acid 5mg', 'Iron supplement'],
      nextCheckup: 'Week 16',
      nutrition: ['Protein-rich foods', 'Calcium sources', 'Iron-rich foods']
    },
    20: {
      babySize: 'Banana',
      babyWeight: '~300g',
      babyLength: '6.5 inches',
      development: ['Baby moving', 'Senses developing', 'Skin thickening'],
      symptoms: ['Feeling kicks', 'Backache', 'Heartburn', 'Leg cramps'],
      tips: ['Sleep on left side', 'Light exercise', 'Kick counting start'],
      medications: ['Prenatal vitamins', 'Iron', 'Calcium'],
      nextCheckup: 'Week 24 - Glucose test',
      nutrition: ['Iron-rich foods', 'Vitamin C', 'Fiber-rich foods'],
      warningSigns: ['Severe abdominal pain', 'Vaginal bleeding', 'Decreased fetal movement']
    },
    24: {
      babySize: 'Eggplant',
      babyWeight: '~600g',
      babyLength: '12 inches',
      development: ['Lungs developing', 'Responds to sound', 'Sleep cycles'],
      symptoms: ['Braxton Hicks', 'Shortness of breath', 'Swelling feet'],
      tips: ['Prepare hospital bag', 'Birth classes', 'Stay hydrated'],
      medications: ['Prenatal vitamins', 'Iron', 'Calcium'],
      nextCheckup: 'Week 28',
      nutrition: ['Omega-3 fatty acids', 'Lean protein', 'Complex carbs']
    },
    28: {
      babySize: 'Eggplant',
      babyWeight: '~1kg',
      babyLength: '14.8 inches',
      development: ['Brain growing rapidly', 'Can open eyes', 'Rhythmic breathing'],
      symptoms: ['Pelvic pressure', 'Leaking colostrum', 'Leg swelling'],
      tips: ['Monitor blood pressure', 'Reduce sodium', 'Rest with feet up'],
      medications: ['Prenatal vitamins', 'Iron', 'Calcium'],
      nextCheckup: 'Week 32'
    },
    32: {
      babySize: 'Coconut',
      babyWeight: '~1.8kg',
      babyLength: '16.7 inches',
      development: ['Lungs maturing', 'Fat forming', 'Bones hardening'],
      symptoms: ['Frequent urination', 'Pelvic pressure', 'Back pain'],
      tips: ['Prepare hospital bag', 'Breathing practice', 'Rest well'],
      medications: ['Prenatal vitamins', 'Iron', 'Calcium'],
      nextCheckup: 'Week 36',
      warningSigns: ['Severe headache', 'Vision changes', 'Decreased fetal movement']
    },
    36: {
      babySize: 'Romaine Lettuce',
      babyWeight: '~2.6kg',
      babyLength: '18.5 inches',
      development: ['Positioning for birth', 'Lungs almost mature', 'Immune system developing'],
      symptoms: ['Braxton Hicks increases', 'Pelvic pressure', 'Nesting instinct'],
      tips: ['Final preparations', 'Monitor contractions', 'Stay active'],
      medications: ['Prenatal vitamins', 'Iron', 'Calcium'],
      nextCheckup: 'Weekly from now'
    },
    40: {
      babySize: 'Watermelon',
      babyWeight: '~3.4kg',
      babyLength: '20 inches',
      development: ['Full term', 'Ready for birth', 'Lungs mature'],
      symptoms: ['Possible contractions', 'Bloody show', 'Water breaking'],
      tips: ['Stay calm', 'Time contractions', 'Call doctor when ready'],
      medications: ['Prenatal vitamins'],
      nextCheckup: 'Any day now!'
    }
  };
  
  const data = pregnancyDataMap[week] || pregnancyDataMap[20];
  
  return {
    week,
    trimester,
    babySize: data.babySize || 'Growing',
    babyWeight: data.babyWeight || 'Varies',
    babyLength: data.babyLength,
    development: data.development || ['Normal fetal development'],
    symptoms: data.symptoms || ['Consult your doctor for specific symptoms'],
    tips: data.tips || ['Regular prenatal care', 'Healthy diet', 'Stay active'],
    aiAdvice: `${trimester === 1 ? 'First trimester' : trimester === 2 ? 'Second trimester' : 'Third trimester'} - ${trimester === 1 ? 'Focus on nutrition and rest' : trimester === 2 ? 'Monitor movements and stay active' : 'Final preparations and monitoring'}`,
    nextCheckup: data.nextCheckup,
    medications: data.medications,
    warningSigns: data.warningSigns,
    nutrition: data.nutrition
  };
};

// ============================================
// BABY CARE DATA (Enhanced)
// ============================================

const getBabyCareDataByMonth = (month: number): BabyCareData => {
  const babyDataMap: Record<number, Partial<BabyCareData>> = {
    0: {
      milestones: ['Breathing on own', 'Crying', 'Rooting reflex'],
      feeding: 'Every 2-3 hours (8-12x/day)',
      sleep: '16-18 hours/day',
      tips: ['Skin-to-skin contact', 'Breastfeeding on demand', 'Keep baby warm', 'Support head always'],
      vaccinations: ['Hepatitis B (birth)'],
      weightRange: '5.5-8.5 lbs',
      heightRange: '18-21 inches',
      emergencySigns: ['Fever >100.4°F', 'Difficulty breathing', 'Poor feeding', 'Lethargy']
    },
    1: {
      milestones: ['Responds to sound', 'Focuses on faces', 'Lifts head briefly'],
      feeding: 'Every 2-3 hours (8-10x/day)',
      sleep: '14-17 hours/day',
      tips: ['Talk often', 'Tummy time (30 sec)', 'Respond to cries', 'Track diapers'],
      vaccinations: ['Hepatitis B (1-2 months)'],
      weightRange: '8-12 lbs',
      heightRange: '20-23 inches',
      emergencySigns: ['Fever', 'Dehydration (<4 wet diapers/day)', 'Excessive crying']
    },
    2: {
      milestones: ['Coos', 'Follows movement', 'Social smile', 'Pushes up on arms'],
      feeding: 'Every 3-4 hours (7-9x/day)',
      sleep: '14-17 hours/day',
      tips: ['More tummy time', 'Read books', 'Sing songs', 'Introduce rattle'],
      vaccinations: ['DTaP, Hib, Polio, PCV13, Rotavirus (2 months)'],
      weightRange: '10-14 lbs',
      heightRange: '22-25 inches',
      emergencySigns: ['Fever', 'Poor weight gain', 'Not smiling']
    },
    4: {
      milestones: ['Rolls over', 'Babbles', 'Laughs', 'Reaches for objects'],
      feeding: 'Every 3-4 hours (6-8x/day)',
      sleep: '12-15 hours/day',
      tips: ['Introduce toys', 'Practice sitting', 'Baby-proof home', 'Start routine'],
      vaccinations: ['DTaP, Hib, Polio, PCV13, Rotavirus (4 months)'],
      weightRange: '13-17 lbs',
      heightRange: '24-27 inches'
    },
    6: {
      milestones: ['Sits with support', 'Babbles chains', 'Passes objects', 'Stranger anxiety'],
      feeding: 'Solids introduction + 4-6 bottles',
      sleep: '12-15 hours/day',
      tips: ['Introduce pureed foods slowly', 'Watch allergies', 'Teething comfort', 'Baby gates'],
      vaccinations: ['DTaP, Hib, Polio, PCV13, Rotavirus (6 months)', 'Flu shot (seasonal)'],
      weightRange: '15-20 lbs',
      heightRange: '26-28 inches',
      emergencySigns: ['Choking', 'Allergic reaction', 'High fever']
    },
    9: {
      milestones: ['Crawls', 'Pulls to stand', 'Object permanence', 'Waves bye-bye'],
      feeding: 'Solids + 3-4 bottles',
      sleep: '12-14 hours/day',
      tips: ['Baby-proof thoroughly', 'Encourage crawling', 'Read daily', 'Introduce sippy cup'],
      vaccinations: ['Flu shot if due'],
      weightRange: '17-22 lbs',
      heightRange: '27-30 inches'
    },
    12: {
      milestones: ['Walks with support', 'First words', 'Points', 'Plays peek-a-boo'],
      feeding: 'Family foods + 2-3 milk feeds',
      sleep: '12-14 hours/day',
      tips: ['Celebrate first birthday!', 'Transition to cow milk', 'Encourage walking', 'Child-proof cabinets'],
      vaccinations: ['MMR, Chickenpox, Hepatitis A (12 months)', 'Flu shot'],
      weightRange: '19-24 lbs',
      heightRange: '28-31 inches',
      emergencySigns: ['Difficulty walking', 'No words', 'Loss of skills']
    }
  };
  
  const data = babyDataMap[month] || babyDataMap[6];
  
  return {
    month,
    milestones: data.milestones || ['Developing normally', 'Meeting milestones'],
    feeding: data.feeding || 'Regular feeding schedule',
    sleep: data.sleep || 'Age-appropriate sleep pattern',
    tips: data.tips || ['Regular pediatric checkups', 'Follow vaccination schedule', 'Monitor development'],
    aiTip: month <= 2 ? 'Focus on bonding and responsive care' : month <= 6 ? 'Encourage tummy time and interaction' : 'Support mobility and language development',
    vaccinations: data.vaccinations,
    weightRange: data.weightRange,
    heightRange: data.heightRange,
    emergencySigns: data.emergencySigns
  };
};

// ============================================
// AI SERVICE EXPORT
// ============================================

export const aiService = {
  /**
   * Send a message to AI chat assistant
   */
  async sendMessage(request: ChatRequest): Promise<ChatMessage> {
    await simulateDelay(800);
    
    // TODO: Replace with real API call
    // try {
    //   const response = await api.post<ChatMessage>('/ai/chat', request);
    //   return response.data!;
    // } catch (error) {
    //   console.error('AI chat error:', error);
    //   return generateBotResponse(request.message);
    // }
    
    return generateBotResponse(request.message);
  },
  
  /**
   * Analyze symptoms and provide medical insights
   */
  async analyzeSymptoms(data: SymptomRequest): Promise<SymptomAnalysis> {
    await simulateDelay(1200);
    
    // TODO: Replace with real API call
    // try {
    //   const response = await api.post<SymptomAnalysis>('/ai/symptoms/analyze', data);
    //   return response.data!;
    // } catch (error) {
    //   console.error('Symptom analysis error:', error);
    //   return analyzeSymptomsEngine(data);
    // }
    
    return analyzeSymptomsEngine(data);
  },
  
  /**
   * Get pregnancy information by week
   */
  async getPregnancyData(week: number): Promise<PregnancyData> {
    await simulateDelay(600);
    
    // TODO: Replace with real API call
    // try {
    //   const response = await api.get<PregnancyData>(`/ai/pregnancy/${week}`);
    //   return response.data!;
    // } catch (error) {
    //   console.error('Pregnancy data error:', error);
    //   return getPregnancyDataByWeek(week);
    // }
    
    // Validate week range
    const validWeek = Math.min(Math.max(week, 1), 42);
    return getPregnancyDataByWeek(validWeek);
  },
  
  /**
   * Get baby care information by month
   */
  async getBabyCareData(month: number): Promise<BabyCareData> {
    await simulateDelay(600);
    
    // TODO: Replace with real API call
    // try {
    //   const response = await api.get<BabyCareData>(`/ai/baby-care/${month}`);
    //   return response.data!;
    // } catch (error) {
    //   console.error('Baby care data error:', error);
    //   return getBabyCareDataByMonth(month);
    // }
    
    // Validate month range
    const validMonth = Math.min(Math.max(month, 0), 24);
    return getBabyCareDataByMonth(validMonth);
  },
  
  /**
   * Get general health tips
   */
  async getHealthTips(category?: 'general' | 'nutrition' | 'exercise' | 'mental'): Promise<string[]> {
    await simulateDelay(400);
    
    const tips = {
      general: [
        '💧 Drink 8-10 glasses of water daily',
        '😴 Get 7-8 hours of quality sleep',
        '🥦 Eat colorful vegetables daily',
        '🚶 Walk 30 minutes daily',
        '🧘 Practice stress management'
      ],
      nutrition: [
        '🥗 Eat a balanced diet with fruits and vegetables',
        '🍗 Choose lean proteins like chicken and fish',
        '🌾 Opt for whole grains over refined',
        '🥑 Include healthy fats from nuts, seeds, avocado',
        '🍎 Limit processed foods and added sugar'
      ],
      exercise: [
        '🏃 Aim for 150 minutes of moderate exercise weekly',
        '💪 Include strength training 2-3 times per week',
        '🧘 Stretch daily for flexibility',
        '🚶 Take movement breaks every hour',
        '🏊 Try low-impact activities like swimming'
      ],
      mental: [
        '🧘 Practice mindfulness or meditation daily',
        '📝 Journal your thoughts and feelings',
        '👥 Stay connected with friends and family',
        '🎯 Set realistic goals and celebrate small wins',
        '😴 Prioritize sleep and rest'
      ]
    };
    
    return tips[category || 'general'];
  },
  
  /**
   * Get medicine information and nearby pharmacies
   */
  async getMedicineInfo(medicineName: string, location?: string): Promise<MedicineInfo[]> {
    await simulateDelay(800);
    
    // Mock data for medicine search
    const mockMedicines: MedicineInfo[] = [
      {
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        dosage: '500mg every 4-6 hours',
        price: 2.50,
        pharmacy: 'Health Plus Pharmacy',
        location: 'Gulshan, Dhaka',
        distance: 0.3,
        stock: 'in-stock',
        deliveryTime: '20-30 mins'
      },
      {
        name: 'Paracetamol 500mg',
        genericName: 'Acetaminophen',
        dosage: '500mg every 4-6 hours',
        price: 2.00,
        pharmacy: 'City Drug Store',
        location: 'Banani, Dhaka',
        distance: 0.8,
        stock: 'limited',
        deliveryTime: '30-45 mins'
      }
    ];
    
    return mockMedicines;
  }
};

// ============================================
// REACT HOOK
// ============================================

export const useAiService = () => {
  return {
    sendMessage: aiService.sendMessage,
    analyzeSymptoms: aiService.analyzeSymptoms,
    getPregnancyData: aiService.getPregnancyData,
    getBabyCareData: aiService.getBabyCareData,
    getHealthTips: aiService.getHealthTips,
    getMedicineInfo: aiService.getMedicineInfo
  };
};

// ============================================
// DEFAULT EXPORT
// ============================================

export default aiService;