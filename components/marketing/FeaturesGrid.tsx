'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Brain, Shield, BarChart3, Globe, Zap, Users, Settings, Bell } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Matching',
    description:
      '510-question psychometric assessment covering personality, values, interests, and cognitive style.',
  },
  {
    icon: Shield,
    title: 'Privacy-First Design',
    description: 'Students control what data is shared. GDPR and PDPA compliant by design.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track impressions, clicks, conversions, and ROI in your dedicated dashboard.',
  },
  {
    icon: Globe,
    title: 'Regional Targeting',
    description: 'Focus on specific countries, regions, or demographics that matter to you.',
  },
  {
    icon: Zap,
    title: 'Instant Lead Delivery',
    description: 'Receive qualified leads in real-time via email and dashboard notifications.',
  },
  {
    icon: Users,
    title: 'Program Matching',
    description: 'Match students to specific programs based on interests and aptitude.',
  },
  {
    icon: Settings,
    title: 'Customizable Criteria',
    description: 'Set your own GPA, budget, test score, and personality fit requirements.',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Get alerted when high-quality matches are waiting for your response.',
  },
];

export default function FeaturesGrid() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Recruit Smarter
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful features designed for modern higher education recruitment.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-gray-50 hover:bg-gray-100 rounded-2xl p-6 transition-colors group"
              >
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-4 shadow-sm group-hover:shadow-md transition-shadow">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
