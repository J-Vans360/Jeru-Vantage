'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    question: 'How does the matching algorithm work?',
    answer:
      "Our AI analyzes 510+ data points from each student's assessment, including personality traits (Big 5), career interests (Holland Code), values, cognitive style, and stated preferences. We compare this against your defined criteria to calculate a match percentage. Only students with 85%+ match scores see your institution as a recommendation.",
  },
  {
    question: "What makes a 'qualified lead'?",
    answer:
      "A qualified lead is a student who: (1) meets your academic criteria, (2) has budget capacity for your tuition, (3) has career interests aligned with your programs, and (4) has explicitly consented to share their information with you. You never pay for unqualified impressions.",
  },
  {
    question: 'How is this different from buying leads from other platforms?',
    answer:
      "Traditional lead gen gives you contact lists of students who clicked an ad. We give you students who have been psychometrically assessed, filtered against your specific criteria, and have proactively chosen to connect with you. The intent and fit quality is significantly higher.",
  },
  {
    question: 'What data do I receive about each student?',
    answer:
      'You receive what the student consents to share. This typically includes: name, email, country, degree level, match score, Holland Code, top values, and budget range. Students choose their sharing level, and we never share raw assessment responses or sensitive data.',
  },
  {
    question: 'How do you handle student privacy?',
    answer:
      "Privacy is foundational to our platform. Students preview exactly what data will be shared before consenting, can toggle off specific items, and can withdraw consent at any time. We're GDPR and PDPA compliant, and never sell student data to third parties.",
  },
  {
    question: 'Can I target specific countries or regions?',
    answer:
      'Yes. You can specify target countries, regions, and even cities. Our platform is particularly strong in Southeast Asia and India, with growing coverage in other regions.',
  },
  {
    question: "What if I'm not satisfied with the lead quality?",
    answer:
      'We offer a 30-day free trial so you can evaluate lead quality before committing. Our average partner sees 3x better conversion rates compared to traditional channels. If quality ever drops below expectations, our success team works with you to refine your matching criteria.',
  },
  {
    question: 'How quickly will I start receiving leads?',
    answer:
      'Most partners start receiving qualified leads within 2-4 weeks of onboarding, depending on your criteria specificity and target regions. High-demand programs in popular regions often see leads within days.',
  },
];

export default function FAQSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about partnering with Jeru Vantage.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                    openIndex === index ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  {openIndex === index ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-6 pb-5 text-gray-600">{faq.answer}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
