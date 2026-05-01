import React from 'react';
import { motion } from 'framer-motion';
import { 
  Heart,
  Facebook,
  Twitter,
  Linkedin,
  Github,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from '../ui/Button';

// ============================================
// TYPES & INTERFACES
// ============================================
export interface FooterProps {
  variant?: 'glass' | 'gradient' | 'neon' | 'solid';
  links?: Array<{
    title: string;
    items: Array<{
      label: string;
      href: string;
    }>;
  }>;
  socialLinks?: Array<{
    icon: React.ElementType;
    href: string;
    label: string;
  }>;
}

// ============================================
// VARIANT STYLES
// ============================================
const variantStyles = {
  glass: `
    bg-white/10 dark:bg-gray-900/10
    backdrop-blur-2xl backdrop-saturate-150
    border-t border-white/20 dark:border-gray-700/20
  `,
  gradient: `
    bg-gradient-to-r from-purple-600/90 via-pink-600/90 to-red-600/90
    backdrop-blur-xl
    border-t border-white/30
  `,
  neon: `
    bg-gray-900/95 dark:bg-black/95
    border-t-2 border-cyan-500/50
    shadow-[0_-30px_60px_rgba(6,182,212,0.3)]
  `,
  solid: `
    bg-white dark:bg-gray-800
    border-t border-gray-200 dark:border-gray-700
  `,
};

// ============================================
// FOOTER COMPONENT
// ============================================
export const Footer: React.FC<FooterProps> = ({
  variant = 'glass',
  links = [
    {
      title: 'HospitalHub',
      items: [
        { label: 'About Us', href: '/about' },
        { label: 'Features', href: '/features' },
        { label: 'Pricing', href: '/pricing' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    {
      title: 'Services',
      items: [
        { label: 'Hospitals', href: '/hospitals' },
        { label: 'Doctors', href: '/doctors' },
        { label: 'Appointments', href: '/appointments' },
        { label: 'Emergency', href: '/emergency' },
      ],
    },
    {
      title: 'Support',
      items: [
        { label: 'Help Center', href: '/help' },
        { label: 'Documentation', href: '/docs' },
        { label: 'API Reference', href: '/api' },
        { label: 'Status', href: '/status' },
      ],
    },
    {
      title: 'Legal',
      items: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
        { label: 'GDPR', href: '/gdpr' },
      ],
    },
  ],
  socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com', label: 'GitHub' },
  ]
}) => {
  return (
    <motion.footer
      className={twMerge(
        clsx(
          'mt-20 px-6 py-12',
          variantStyles[variant]
        )
      )}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 mb-4"
            >
              <div className="p-2 bg-white/20 rounded-2xl backdrop-blur-sm">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">HospitalHub</h3>
                <p className="text-white/70">Premium Healthcare Management</p>
              </div>
            </motion.div>

            <p className="text-white/80 mb-6 max-w-md">
              Transforming healthcare with cutting-edge technology. 
              Connecting patients, doctors, and hospitals in one seamless platform.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 mb-6">
              <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 text-white/80">
                <Mail className="w-5 h-5" />
                <span className="text-sm">support@hospitalhub.com</span>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 text-white/80">
                <Phone className="w-5 h-5" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </motion.div>
              <motion.div whileHover={{ x: 5 }} className="flex items-center gap-3 text-white/80">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">123 Healthcare Ave, NY</span>
              </motion.div>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((link, i) => {
                const Icon = link.icon;
                return (
                  <motion.a
                    key={i}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-white/10 rounded-xl hover:bg-white/20 transition-colors backdrop-blur-sm"
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.a>
                );
              })}
            </div>
          </div>

          {/* Links Columns */}
          {links.map((column, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <h4 className="text-lg font-bold text-white mb-4">{column.title}</h4>
              <ul className="space-y-2">
                {column.items.map((link, j) => (
                  <motion.li
                    key={j}
                    whileHover={{ x: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <a
                      href={link.href}
                      className="text-white/70 hover:text-white transition-colors text-sm font-medium flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 bg-white/50 rounded-full" />
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="pt-8 border-t border-white/20"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm">
              © 2024 HospitalHub. Made with <Heart className="w-4 h-4 inline text-red-500" /> for better healthcare.
            </p>
            
            <div className="flex items-center gap-4">
              <Button variant="glassmorphic" size="sm">
                Upgrade to Pro
              </Button>
              <Button variant="neon" size="sm">
                Get Support
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};