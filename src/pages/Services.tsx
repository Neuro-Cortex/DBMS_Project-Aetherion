// src/pages/Services.tsx

import React, { useEffect } from 'react'; // ✅ useEffect add করা হয়েছে
import { motion } from 'framer-motion';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { 
  Stethoscope, Heart, Brain, Activity, 
  Pill, Microscope, Baby, MessageCircle,
  ArrowRight, CheckCircle 
} from 'lucide-react';

const services = [
  { 
    icon: Stethoscope, 
    title: 'Online Consultation', 
    description: 'Connect with specialist doctors via high-quality video calls',
    features: ['24/7 Access', 'Prescription', 'Follow-up'],
    color: 'from-cyan-500 to-blue-500'
  },
  { 
    icon: Heart, 
    title: 'Cardiology Care', 
    description: 'Expert heart care with advanced diagnostic tools',
    features: ['ECG Monitoring', 'Risk Assessment', 'Treatment Plan'],
    color: 'from-pink-500 to-rose-500'
  },
  { 
    icon: Brain, 
    title: 'Neurology', 
    description: 'Specialized care for brain and nervous system',
    features: ['Stroke Care', 'Migraine Treatment', 'Memory Clinic'],
    color: 'from-purple-500 to-indigo-500'
  },
  { 
    icon: Pill, 
    title: 'Pharmacy Delivery', 
    description: 'Get medicines delivered to your doorstep',
    features: ['24/7 Delivery', 'Prescription Upload', 'Discounts'],
    color: 'from-teal-500 to-cyan-500'
  },
  { 
    icon: Microscope, 
    title: 'Lab Tests', 
    description: 'Diagnostic tests with home collection',
    features: ['100+ Tests', 'Digital Reports', 'Expert Review'],
    color: 'from-orange-500 to-red-500'
  },
  { 
    icon: Baby, 
    title: 'Pediatrics', 
    description: 'Specialized care for children and infants',
    features: ['Vaccination', 'Growth Tracking', '24/7 Support'],
    color: 'from-pink-500 to-purple-500'
  },
  { 
    icon: Activity, 
    title: 'Emergency Care', 
    description: '24/7 emergency response and ambulance services',
    features: ['Fast Response', 'ICU Support', 'Critical Care'],
    color: 'from-red-500 to-orange-500'
  },
  { 
    icon: MessageCircle, 
    title: 'AI Assistant', 
    description: '24/7 health guidance and symptom checker',
    features: ['Symptom Check', 'Health Tips', 'Medication Reminder'],
    color: 'from-blue-500 to-purple-500'
  },
];

export const Services: React.FC = () => {

  // ✅ FIX: useEffect import missing ছিল
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <Navbar />
      
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-2 mb-6"
          >
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-white/80 text-sm">Our Services</span>
          </motion.div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Comprehensive Healthcare
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Solutions
            </span>
          </h1>

          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            We provide world-class medical services with state-of-the-art technology 
            and compassionate care tailored to your needs.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, i) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -8 }}
                  className="group cursor-pointer"
                >
                  <div className="bg-gradient-to-br from-white/5 to-transparent backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-cyan-500/50 transition-all h-full">

                    <div className={`w-14 h-14 bg-gradient-to-r ${service.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    <h3 className="text-xl font-bold text-white mb-2">
                      {service.title}
                    </h3>

                    <p className="text-white/60 text-sm mb-4">
                      {service.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {service.features.map((feature, idx) => (
                        <span 
                          key={idx} 
                          className="text-xs bg-white/10 text-white/60 px-2 py-1 rounded-full"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-cyan-400 text-sm opacity-0 group-hover:opacity-100 transition">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white/5">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Choose Aetherion Health?
              </h2>

              <p className="text-white/60 mb-6">
                We combine cutting-edge technology with compassionate care
              </p>

              <div className="space-y-4">
                {[
                  { title: '100% Secure', desc: 'Your health data is protected with enterprise-grade security' },
                  { title: '24/7 Availability', desc: 'Round-the-clock medical assistance and emergency support' },
                  { title: 'Top Doctors', desc: 'Access to highly qualified and experienced physicians' },
                  { title: 'Global Network', desc: 'Connected with top hospitals and clinics worldwide' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      <p className="text-white/60 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop"
                  alt="Doctor with patient"
                  className="w-full h-auto rounded-2xl"
                />
              </div>

              <div className="absolute -bottom-5 -left-5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl p-4 shadow-xl">
                <div className="text-white text-center">
                  <div className="text-2xl font-bold">98%</div>
                  <div className="text-sm">Satisfaction</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

// ✅ IMPORTANT: default export add না থাকলে lazy() error দিবে
export default Services;