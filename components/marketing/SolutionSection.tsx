'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Sparkles, Filter, Target, Gem } from 'lucide-react';

export default function SolutionSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4" />
              The Solution
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
              We're Your Digital
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admissions Officer
              </span>
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Jeru Vantage is not a banner ad network. We're an AI-driven assessment platform that{' '}
              <strong>pre-qualifies applicants</strong> before they ever see your brand.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Filter className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">The Veto Filter</h4>
                  <p className="text-gray-600">
                    Students who don't meet your criteria never see your brand. No wasted
                    impressions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Target className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Smart Matching</h4>
                  <p className="text-gray-600">
                    Our AI matches students based on grades, budget, career interests, and
                    psychological fit.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Gem className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Hidden Gem Placement</h4>
                  <p className="text-gray-600">
                    You appear as a "recommended opportunity" - not an ad. Students trust our
                    suggestions.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Filter Visualization */}
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl p-8">
              {/* Input */}
              <div className="text-center mb-6">
                <div className="text-sm text-gray-500 mb-2">Students taking assessment</div>
                <div className="text-4xl font-bold text-gray-400">10,000</div>
              </div>

              {/* Funnel */}
              <div className="relative">
                {/* Stage 1 */}
                <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-red-600 font-bold">1</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">GPA Filter</div>
                        <div className="text-sm text-gray-500">Minimum 3.0 GPA</div>
                      </div>
                    </div>
                    <div className="text-red-600 font-semibold">-4,000</div>
                  </div>
                </div>

                {/* Stage 2 */}
                <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-orange-600 font-bold">2</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Budget Filter</div>
                        <div className="text-sm text-gray-500">$20k+ annual</div>
                      </div>
                    </div>
                    <div className="text-orange-600 font-semibold">-3,500</div>
                  </div>
                </div>

                {/* Stage 3 */}
                <div className="bg-white rounded-xl p-4 mb-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                        <span className="text-purple-600 font-bold">3</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Program Fit</div>
                        <div className="text-sm text-gray-500">Holland Code match</div>
                      </div>
                    </div>
                    <div className="text-purple-600 font-semibold">-2,000</div>
                  </div>
                </div>

                {/* Output */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium opacity-90">Qualified Matches</div>
                      <div className="text-sm opacity-75">Ready to connect</div>
                    </div>
                    <div className="text-3xl font-bold">500</div>
                  </div>
                </div>
              </div>

              {/* Result */}
              <div className="text-center mt-6">
                <div className="text-sm text-gray-500">Your brand only shown to</div>
                <div className="text-2xl font-bold text-green-600">5% of students</div>
                <div className="text-sm text-gray-500">who actually qualify</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
