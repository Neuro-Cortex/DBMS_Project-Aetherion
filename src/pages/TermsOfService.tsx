import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Heart, FileText } from 'lucide-react';

const TermsOfService: React.FC = () => {
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
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Terms of Service</h1>
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
              <Shield className="w-5 h-5 text-cyan-400" />
              1. Acceptance of Terms
            </h2>
            <p className="text-white/60 leading-relaxed">
              By accessing and using Aetherion Healthcare Platform, you agree to be bound by these Terms of Service. 
              If you do not agree to these terms, please do not use our services.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-cyan-400" />
              2. Healthcare Services
            </h2>
            <p className="text-white/60 leading-relaxed mb-3">
              Aetherion provides a platform for healthcare management including but not limited to:
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
              <li>Patient health record management</li>
              <li>Appointment scheduling and management</li>
              <li>Prescription management and tracking</li>
              <li>Hospital and pharmacy coordination</li>
              <li>Telemedicine services</li>
            </ul>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">3. User Accounts</h2>
            <p className="text-white/60 leading-relaxed mb-3">
              You are responsible for maintaining the confidentiality of your account credentials. 
              You agree to:
            </p>
            <ul className="list-disc list-inside text-white/60 space-y-2 ml-4">
              <li>Provide accurate and complete registration information</li>
              <li>Notify us immediately of any unauthorized account access</li>
              <li>Not share your account credentials with others</li>
              <li>Be fully responsible for all activities under your account</li>
            </ul>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">4. Medical Disclaimer</h2>
            <p className="text-white/60 leading-relaxed">
              Aetherion is a healthcare management platform and does not provide medical advice, 
              diagnosis, or treatment. Always seek the advice of qualified healthcare providers 
              with any questions regarding medical conditions. In case of emergency, contact your 
              local emergency services immediately.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">5. Data Privacy</h2>
            <p className="text-white/60 leading-relaxed">
              Your data privacy is governed by our Privacy Policy. By using our services, you 
              consent to the collection and use of your information as described in the 
              <Link to="/privacy" className="text-cyan-400 hover:text-cyan-300 mx-1">Privacy Policy</Link>.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">6. Termination</h2>
            <p className="text-white/60 leading-relaxed">
              We reserve the right to suspend or terminate accounts that violate these terms, 
              engage in fraudulent activities, or misuse the platform in any way.
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 backdrop-blur-xl">
            <h2 className="text-xl font-semibold text-white mb-4">7. Contact Information</h2>
            <p className="text-white/60 leading-relaxed">
              For questions about these Terms of Service, please contact us at:<br />
              <span className="text-cyan-400">legal@aetherion.com</span>
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

export default TermsOfService;