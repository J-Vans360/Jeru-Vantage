'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Brain,
  Heart,
  Compass,
  Lightbulb,
  BookOpen,
  Shield,
  Zap,
  Target,
  Users,
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Play,
  ChevronDown,
  Rocket,
  BarChart3,
  TrendingUp,
  AlertCircle,
  AlertTriangle,
  GraduationCap,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <TrustBar />
      <DimensionsSection />
      <SWOTSection />
      <HowItWorksSection />
      <ReportPreviewSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <FinalCTASection />
    </div>
  );
}

// ============ HERO SECTION ============
function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-20 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium mb-8"
        >
          <Sparkles className="w-4 h-4" />
          <span>Pilot Program Open - Limited Spots Available</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6"
        >
          Discover Your Ideal
          <br />
          <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
            Career Path
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl sm:text-2xl text-white/80 mb-8 max-w-3xl mx-auto"
        >
          Take our science-backed assessment and receive your personalized Jeru Report -
          a deep dive into your personality, values, interests, and ideal career directions.
        </motion.p>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap justify-center gap-6 mb-10 text-white/70"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            <span>25 min assessment</span>
          </div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            <span>Personal SWOT Analysis</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            <span>Instant results</span>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Start Free Assessment
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="inline-flex items-center justify-center gap-2 bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all">
            <Play className="w-5 h-5" />
            Watch Demo
          </button>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-8 h-8 text-white/50 animate-bounce" />
        </motion.div>
      </div>
    </section>
  );
}

// ============ TRUST BAR ============
function TrustBar() {
  const stats = [
    { value: '8', label: 'Dimensions Analyzed' },
    { value: '153', label: 'Assessment Questions' },
    { value: '100+', label: 'Career Paths Mapped' },
    { value: '25', label: 'Minutes to Complete' },
  ];

  return (
    <section className="bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl sm:text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-gray-400 text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ 8 DIMENSIONS SECTION ============
function DimensionsSection() {
  const dimensions = [
    {
      icon: Brain,
      title: 'Personality',
      description: 'Big 5 traits that shape how you work and interact',
      color: 'from-blue-500 to-indigo-500',
    },
    {
      icon: Heart,
      title: 'Values',
      description: 'What matters most to you in life and career',
      color: 'from-pink-500 to-rose-500',
    },
    {
      icon: Compass,
      title: 'Career Interests',
      description: 'Your Holland Code for career matching',
      color: 'from-green-500 to-emerald-500',
    },
    {
      icon: Lightbulb,
      title: 'Intelligences',
      description: '8 types of intelligence and your strengths',
      color: 'from-yellow-500 to-orange-500',
    },
    {
      icon: BookOpen,
      title: 'Learning Style',
      description: 'How you best absorb and process information',
      color: 'from-purple-500 to-violet-500',
    },
    {
      icon: Shield,
      title: 'Stress Response',
      description: 'How you handle pressure and challenges',
      color: 'from-red-500 to-pink-500',
    },
    {
      icon: Zap,
      title: '21st Century Skills',
      description: '12 essential skills for the modern world',
      color: 'from-cyan-500 to-blue-500',
    },
    {
      icon: Target,
      title: 'Execution & Grit',
      description: 'Your ability to persist and achieve goals',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Comprehensive Analysis
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            8 Dimensions of Your Potential
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Our comprehensive assessment analyzes you across 8 key areas to create
            a complete picture of your ideal career path.
          </motion.p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dimensions.map((dimension, index) => (
            <motion.div
              key={dimension.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${dimension.color} flex items-center justify-center mb-4`}>
                <dimension.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{dimension.title}</h3>
              <p className="text-gray-600 text-sm">{dimension.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ SWOT SECTION ============
function SWOTSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <TrendingUp className="w-4 h-4" />
            Strategic Self-Analysis
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Your Personal SWOT Analysis
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Go beyond &quot;what career suits me&quot; - understand HOW to leverage your unique profile for maximum success.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Strengths */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-green-800">Strengths</h3>
                <p className="text-sm text-green-600">What you&apos;re naturally good at</p>
              </div>
            </div>
            <ul className="space-y-2 text-green-700">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Your top intelligences & talents</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Personality traits that give you an edge</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                <span>Skills to highlight in applications</span>
              </li>
            </ul>
          </motion.div>

          {/* Weaknesses */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-amber-500 rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-amber-800">Weaknesses</h3>
                <p className="text-sm text-amber-600">Areas for growth</p>
              </div>
            </div>
            <ul className="space-y-2 text-amber-700">
              <li className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Skills to develop before university</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Potential blind spots to address</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Growth areas for your career path</span>
              </li>
            </ul>
          </motion.div>

          {/* Opportunities */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-800">Opportunities</h3>
                <p className="text-sm text-blue-600">Paths that match your profile</p>
              </div>
            </div>
            <ul className="space-y-2 text-blue-700">
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Career fields aligned with your strengths</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>University majors to explore</span>
              </li>
              <li className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-500 flex-shrink-0" />
                <span>Industries with high potential for you</span>
              </li>
            </ul>
          </motion.div>

          {/* Threats */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200 rounded-2xl p-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-800">Threats</h3>
                <p className="text-sm text-red-600">Challenges to prepare for</p>
              </div>
            </div>
            <ul className="space-y-2 text-red-700">
              <li className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>Career paths that may not suit you</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>Common pitfalls for your personality type</span>
              </li>
              <li className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>External factors to navigate</span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 mb-6">
            Most assessments tell you <strong>what</strong> career to pursue.<br />
            We help you understand <strong>how</strong> to get there strategically.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            Get Your SWOT Analysis
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

// ============ HOW IT WORKS ============
function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Create Free Account',
      description: 'Sign up in under a minute. No credit card required.',
      icon: Users,
      time: '1 min',
    },
    {
      number: '02',
      title: 'Complete Assessment',
      description: 'Answer 153 carefully designed questions across 8 dimensions.',
      icon: Brain,
      time: '25 min',
    },
    {
      number: '03',
      title: 'Get Your Jeru Report',
      description: 'Receive instant personalized insights, SWOT analysis, and career recommendations.',
      icon: BarChart3,
      time: 'Instant',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold mb-4"
          >
            How It Works
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-gray-400 max-w-2xl mx-auto"
          >
            Three simple steps to discover your ideal career path
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-gray-800 rounded-2xl p-8 h-full">
                <div className="text-5xl font-bold text-gray-700 mb-4">{step.number}</div>
                <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center mb-4">
                  <step.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-400 mb-4">{step.description}</p>
                <div className="inline-flex items-center gap-2 bg-gray-700 px-3 py-1 rounded-full text-sm">
                  <Clock className="w-4 h-4" />
                  {step.time}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-gray-600" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ REPORT PREVIEW ============
function ReportPreviewSection() {
  const features = [
    'Personality Profile (Big 5)',
    'Values Analysis',
    'Holland Code & Career Matches',
    'Multiple Intelligences Breakdown',
    'Learning Style Profile',
    'Stress Response Patterns',
    '21st Century Skills Assessment',
    'Personalized SWOT Analysis',
    'Career Recommendations',
    'University Major Suggestions',
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              Your Personalized Jeru Report
            </h2>
            <p className="text-xl text-white/80 mb-8">
              A comprehensive analysis that goes beyond simple career suggestions.
              Understand yourself deeply and make informed decisions about your future.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <span className="text-white/90">{feature}</span>
                </div>
              ))}
            </div>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-white text-indigo-900 px-8 py-4 rounded-full font-semibold mt-8 hover:bg-gray-100 transition-all"
            >
              Get Your Report
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="bg-gray-900 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">Jeru Report</div>
                    <div className="text-sm text-gray-400">Sample Preview</div>
                  </div>
                </div>
                {/* Mock Chart */}
                <div className="h-48 bg-gray-800 rounded-lg mb-4 flex items-center justify-center">
                  <div className="text-center">
                    <BarChart3 className="w-16 h-16 text-indigo-400 mx-auto mb-2" />
                    <span className="text-gray-400 text-sm">Your Profile Visualization</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-indigo-400">RIA</div>
                    <div className="text-xs text-gray-400">Holland Code</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-green-400">87%</div>
                    <div className="text-xs text-gray-400">Match Score</div>
                  </div>
                  <div className="bg-gray-800 rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-orange-400">12</div>
                    <div className="text-xs text-gray-400">Career Paths</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ============ TESTIMONIALS ============
function TestimonialsSection() {
  const testimonials = [
    {
      quote: "The assessment was incredibly accurate. It helped me understand why I was drawn to certain careers and gave me confidence in my choice to pursue engineering.",
      name: "Sarah Chen",
      role: "Grade 12 Student",
      school: "Singapore",
      rating: 5,
    },
    {
      quote: "I was confused between medicine and business. The Jeru Report showed me that my values and personality actually align better with healthcare management - a perfect blend!",
      name: "Arjun Patel",
      role: "Grade 11 Student",
      school: "Mumbai",
      rating: 5,
    },
    {
      quote: "As a counselor, I've used many assessment tools. Jeru Vantage is the most comprehensive and student-friendly one I've seen. My students love it!",
      name: "Ms. Rodriguez",
      role: "School Counselor",
      school: "Bangkok",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            What Students Say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600"
          >
            Join thousands of students who discovered their path
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-600 mb-6 italic">&quot;{testimonial.quote}&quot;</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-500">{testimonial.role} • {testimonial.school}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ PRICING ============
function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
          >
            <Sparkles className="w-4 h-4" />
            Pilot Program Special
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Free During Pilot
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-xl text-gray-600 max-w-2xl mx-auto"
          >
            Get full access to our comprehensive assessment and personalized report - completely free during our pilot program.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-lg mx-auto"
        >
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white text-center">
            <div className="text-sm font-medium text-white/80 mb-2">PILOT ACCESS</div>
            <div className="text-5xl font-bold mb-2">FREE</div>
            <div className="text-white/60 mb-8">Limited time offer</div>

            <ul className="text-left space-y-4 mb-8">
              {[
                'Full 153-question assessment',
                'Complete Jeru Report',
                'Personal SWOT Analysis',
                'Career recommendations',
                '8 dimension analysis',
                'Instant results',
              ].map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Link
              href="/signup"
              className="block w-full bg-white text-indigo-600 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all"
            >
              Start Free Assessment
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ============ FAQ ============
function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'How long does the assessment take?',
      answer: 'The full assessment takes approximately 25 minutes to complete. You can save your progress and continue later if needed.',
    },
    {
      question: 'Is the pilot really free?',
      answer: "Yes! During our pilot program, you get full access to the assessment and your personalized Jeru Report at no cost. We're gathering feedback to improve our platform.",
    },
    {
      question: 'How accurate is the assessment?',
      answer: "Our assessment is based on well-established psychological frameworks including the Big 5 personality model, Holland Codes, and Gardner's Multiple Intelligences. These are scientifically validated tools used by career counselors worldwide.",
    },
    {
      question: 'What do I get in the Jeru Report?',
      answer: 'Your report includes: personality analysis, values assessment, career interest profile (Holland Code), multiple intelligences breakdown, learning style, stress response patterns, 21st century skills assessment, personal SWOT analysis, and personalized career and major recommendations.',
    },
    {
      question: 'Can I share my results?',
      answer: 'Yes! You can download your report as a PDF and share it with parents, counselors, or mentors to help guide your career discussions.',
    },
    {
      question: 'Is my data private?',
      answer: 'Absolutely. We take privacy seriously. Your data is encrypted and never shared with third parties. You can request deletion of your data at any time.',
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            Frequently Asked Questions
          </motion.h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left"
              >
                <span className="font-semibold text-gray-900">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ============ FINAL CTA ============
function FinalCTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GraduationCap className="w-16 h-16 mx-auto mb-6 text-white/80" />
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Discover Your Path?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join our pilot program and get your personalized Jeru Report - completely free.
            Limited spots available.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all shadow-lg"
          >
            Start Free Assessment
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="mt-6 text-white/60 text-sm">
            No credit card required • Takes 25 minutes • Instant results
          </p>
        </motion.div>
      </div>
    </section>
  );
}
