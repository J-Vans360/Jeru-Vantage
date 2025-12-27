'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ClipboardList, Cpu, UserCheck, Handshake } from 'lucide-react';

const steps = [
  {
    number: '01',
    icon: ClipboardList,
    title: 'You Define the Profile',
    description:
      'Tell us your ideal student: minimum GPA, budget capacity, target programs, preferred regions. We save this as your matching criteria.',
    color: 'blue',
  },
  {
    number: '02',
    icon: Cpu,
    title: 'Students Take Our Assessment',
    description:
      'Students complete our comprehensive 510-question assessment covering personality, values, interests, skills, and goals.',
    color: 'purple',
  },
  {
    number: '03',
    icon: UserCheck,
    title: 'AI Runs the Match',
    description:
      'Our algorithm compares each student against your criteria. Only students with 85%+ match see your university as a recommendation.',
    color: 'green',
  },
  {
    number: '04',
    icon: Handshake,
    title: 'Qualified Leads Connect',
    description:
      'Students who match choose to share their profile with you. You receive pre-qualified leads ready for your admissions process.',
    color: 'orange',
  },
];

const colorClasses = {
  blue: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-200' },
  purple: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-200' },
  green: { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-200' },
  orange: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-200' },
};

export default function HowItWorksSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section id="how-it-works" className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Four simple steps to transform your recruitment from cold outreach to warm connections.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const colors = colorClasses[step.color as keyof typeof colorClasses];

            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative"
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-gray-200 -translate-x-4 z-0" />
                )}

                <div className="relative bg-white rounded-2xl p-6 shadow-sm border border-gray-200 h-full">
                  {/* Number Badge */}
                  <div
                    className={`absolute -top-4 -left-4 w-10 h-10 ${colors.bg} ${colors.border} border-2 rounded-full flex items-center justify-center`}
                  >
                    <span className={`font-bold ${colors.text}`}>{step.number}</span>
                  </div>

                  {/* Icon */}
                  <div
                    className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center mb-4 mt-2`}
                  >
                    <Icon className={`w-7 h-7 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm">{step.description}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
