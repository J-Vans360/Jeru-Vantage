'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { XCircle, DollarSign, UserX, TrendingDown } from 'lucide-react';

const problems = [
  {
    icon: DollarSign,
    title: 'Wasted Ad Spend',
    description:
      "You spend thousands on college fairs and digital ads, filling your CRM with leads who can't afford your tuition.",
    stat: '$5,000+',
    statLabel: 'avg. cost per enrolled student',
  },
  {
    icon: UserX,
    title: 'Unqualified Leads',
    description:
      "80% of leads don't have the grades, budget, or genuine interest to actually enroll.",
    stat: '80%',
    statLabel: 'of leads never convert',
  },
  {
    icon: TrendingDown,
    title: 'Poor Retention',
    description:
      "Students drop out after Year 1 because the 'fit' was wrong. Wrong major, wrong culture, wrong expectations.",
    stat: '30%',
    statLabel: 'first-year dropout rate',
  },
];

export default function ProblemSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <XCircle className="w-4 h-4" />
            The Problem with Traditional Recruitment
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Cold Leads Are Killing Your ROI
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Traditional recruitment is broken. You're paying for quantity, not quality. And it's
            costing you more than just money.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <motion.div
                key={problem.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{problem.title}</h3>
                <p className="text-gray-600 mb-6">{problem.description}</p>
                <div className="pt-6 border-t border-gray-100">
                  <div className="text-3xl font-bold text-red-600">{problem.stat}</div>
                  <div className="text-sm text-gray-500">{problem.statLabel}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
