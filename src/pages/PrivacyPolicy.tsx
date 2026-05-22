import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Eye, Database, Shield, UserCheck } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050508] via-[#0a0a14] to-[#050508] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <Link to="/login" className="inline-flex items-center gap-2 text-white/40 hover:text-white/70 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-purple-500 rounded-2xl mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-white/40">Last updated: {new Date().toLocaleDateString()}</p>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-8"
        >
          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-cyan-400" />
              Information We Collect
            </h2>
            <p className="text-white/60 leading-relaxed mb-3">
              We collect information to provide better healthcare services:
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
              <li>Personal identification information (name, email, phone number)</li>
              <li>Health records and medical history (with your consent)</li>
              <li>Appointment and prescription data</li>
              <li>Payment and billing information</li>
              <li>Usage data and platform interactions</li>
            </ul>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-cyan-400" />
              How We Use Your Information
            </h2>
            <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
              <li>Facilitate healthcare services and appointments</li>
              <li>Process prescriptions and medication orders</li>
              <li>Improve and personalize your healthcare experience</li>
              <li>Communicate important health-related updates</li>
              <li>Comply with legal and regulatory requirements</li>
            </ul>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-cyan-400" />
              HIPAA Compliance
            </h2>
            <p className="text-white/60 leading-relaxed">
              Aetherion is fully HIPAA compliant. We implement strict administrative, physical, 
              and technical safeguards to protect your protected health information (PHI). 
              All data is encrypted both in transit and at rest.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" />
              Data Sharing
            </h2>
            <p className="text-white/60 leading-relaxed mb-3">
              We do not sell your personal information. We may share your data:
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
              <li>With your explicit consent</li>
              <li>With healthcare providers involved in your care</li>
              <li>To comply with legal obligations</li>
              <li>With third-party service providers (under strict confidentiality)</li>
            </ul>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Your Rights</h2>
            <p className="text-white/60 leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
              <li>Access your personal and health data</li>
              <li>Request corrections to your information</li>
              <li>Download or delete your data</li>
              <li>Opt-out of non-essential communications</li>
              <li>File a complaint with relevant authorities</li>
            </ul>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Data Security</h2>
            <p className="text-white/60 leading-relaxed">
              We employ industry-standard security measures including:
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-2 ml-4 mt-2">
              <li>256-bit AES encryption for all sensitive data</li>
              <li>Regular security audits and penetration testing</li>
              <li>Multi-factor authentication options</li>
              <li>Secure data centers with 24/7 monitoring</li>
              <li>Automated backup and disaster recovery systems</li>
            </ul>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Cookies and Tracking</h2>
            <p className="text-white/60 leading-relaxed">
              We use essential cookies to provide core functionality. You can control cookie 
              preferences through your browser settings. We do not use tracking cookies for 
              advertising purposes.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Children's Privacy</h2>
            <p className="text-white/60 leading-relaxed">
              Our services are not directed to children under 13. We do not knowingly collect 
              personal information from children. Parents or guardians may manage accounts for 
              minor children with appropriate consent.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">Contact Us</h2>
            <p className="text-white/60 leading-relaxed">
              For privacy-related inquiries or to exercise your rights:<br />
              <span className="text-cyan-400">privacy@aetherion.com</span><br />
              <span className="text-white/40 text-sm">+1 (555) 123-4567</span>
            </p>
          </div>
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-8 text-white/30 text-sm">
          <p>© 2024 Aetherion Healthcare. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;