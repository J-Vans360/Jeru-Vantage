'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Brain, Target, Sparkles, Clock, CheckCircle, Users,
  Star, ArrowRight, Play, Quote,
  GraduationCap, Briefcase, Heart, Zap, Shield,
  BookOpen, TrendingUp, Award, Globe, ChevronDown
} from 'lucide-react';

export default function PilotLandingPage() {
  const [timeLeft, setTimeLeft] = useState({
    days: 14,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [spotsLeft] = useState(247);
  const [isScrolled, setIsScrolled] = useState(false);

  // Countdown timer (set your pilot end date)
  useEffect(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 14); // 14 days from now

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = endDate.getTime() - now;

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000),
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Scroll detection for nav
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Nav */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className={`font-bold text-xl ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
              Jeru Vantage
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className={`hidden sm:block text-sm font-medium ${isScrolled ? 'text-gray-600 hover:text-gray-900' : 'text-white/80 hover:text-white'}`}
            >
              Sign In
            </Link>
            <Link
              href="/register?redirect=/pilot-assessment"
              className="bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/25"
            >
              Start Free Assessment
            </Link>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
            }}
            transition={{ duration: 20, repeat: Infinity }}
            className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-white/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
            }}
            transition={{ duration: 25, repeat: Infinity }}
            className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-orange-500/10 rounded-full blur-3xl"
          />

          {/* Floating Icons */}
          {[Brain, Target, Heart, Zap, GraduationCap, Briefcase].map((Icon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0.1, 0.3, 0.1],
                y: [0, -20, 0],
                x: [0, 10, 0],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                delay: i * 0.5,
              }}
              className="absolute text-white/10"
              style={{
                top: `${15 + (i * 12)}%`,
                left: `${5 + (i * 15)}%`,
              }}
            >
              <Icon className="w-12 h-12" />
            </motion.div>
          ))}
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-32 grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Urgency Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-white/90 text-sm font-medium">
                Pilot Program Open - {spotsLeft} spots remaining
              </span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Discover Your
              <br />
              <span className="bg-gradient-to-r from-yellow-300 via-orange-300 to-amber-300 bg-clip-text text-transparent">
                Ideal Career Path
              </span>
              <br />
              <span className="text-3xl sm:text-4xl lg:text-5xl">in 25 Minutes</span>
            </h1>

            <p className="text-xl text-white/80 mb-8 max-w-lg">
              Take our science-backed assessment and receive your personalized
              <strong className="text-white"> Jeru Report</strong> - a deep dive into your
              personality, values, interests, and ideal career directions.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href="/register?redirect=/pilot-assessment"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
              >
                Get Your Free Report
                <ArrowRight className="w-5 h-5" />
              </Link>
              <button
                className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/30 text-white px-6 py-4 rounded-full font-semibold hover:bg-white/20 transition-all"
              >
                <Play className="w-5 h-5" />
                Watch Demo
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center gap-6 text-white/70 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>25 min assessment</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>100% Free</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Instant results</span>
              </div>
            </div>
          </motion.div>

          {/* Right Content - Report Preview */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="bg-white rounded-3xl shadow-2xl p-6 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900">Your Jeru Report</div>
                    <div className="text-sm text-gray-500">Personalized for Sarah</div>
                  </div>
                </div>

                {/* Mini Chart Visualization */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[85, 72, 91, 68].map((value, i) => (
                    <div key={i} className="text-center">
                      <div className="h-20 bg-gray-100 rounded-lg relative overflow-hidden">
                        <motion.div
                          initial={{ height: 0 }}
                          animate={{ height: `${value}%` }}
                          transition={{ delay: 1 + i * 0.2, duration: 0.8 }}
                          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-purple-500 rounded-lg"
                        />
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {['Creative', 'Analytical', 'Social', 'Leadership'][i]}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Holland Code */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 mb-4">
                  <div className="text-sm text-gray-500 mb-1">Your Career Code</div>
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-green-600">IAS</span>
                    <span className="text-sm text-gray-600">Investigative - Artistic - Social</span>
                  </div>
                </div>

                {/* Top Careers */}
                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Top Career Matches</div>
                  {['UX Research', 'Data Journalism', 'Educational Technology'].map((career, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm text-gray-700">{career}</span>
                      <span className="text-sm font-medium text-green-600">{95 - i * 3}% match</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg p-4 flex items-center gap-3"
              >
                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">4.9/5 Rating</div>
                  <div className="text-xs text-gray-500">From 500+ students</div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-white/50"
          >
            <ChevronDown className="w-8 h-8" />
          </motion.div>
        </motion.div>
      </section>

      {/* Countdown Timer Section */}
      <section className="bg-gradient-to-r from-orange-500 to-amber-500 py-6">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Pilot ends in:</span>
            </div>
            <div className="flex gap-4">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Mins' },
                { value: timeLeft.seconds, label: 'Secs' },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 min-w-[60px]">
                    <div className="text-2xl font-bold">{item.value.toString().padStart(2, '0')}</div>
                  </div>
                  <div className="text-xs mt-1 opacity-80">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What You'll Discover Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Target className="w-4 h-4" />
              What You&apos;ll Discover
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              8 Dimensions of Your Potential
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our comprehensive assessment analyzes you across 8 key areas
              to create a complete picture of your ideal career path.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Brain,
                title: 'Personality',
                description: 'Big 5 traits that shape how you work and interact',
                color: 'from-blue-500 to-blue-600',
              },
              {
                icon: Heart,
                title: 'Values',
                description: 'What matters most to you in life and career',
                color: 'from-purple-500 to-purple-600',
              },
              {
                icon: Briefcase,
                title: 'Career Interests',
                description: 'Your Holland Code for career matching',
                color: 'from-green-500 to-green-600',
              },
              {
                icon: Sparkles,
                title: 'Intelligences',
                description: '8 types of intelligence and your strengths',
                color: 'from-yellow-500 to-orange-500',
              },
              {
                icon: BookOpen,
                title: 'Learning Style',
                description: 'How you best absorb and process information',
                color: 'from-pink-500 to-pink-600',
              },
              {
                icon: Shield,
                title: 'Stress Response',
                description: 'How you handle pressure and challenges',
                color: 'from-cyan-500 to-cyan-600',
              },
              {
                icon: TrendingUp,
                title: '21st Century Skills',
                description: '12 essential skills for the modern world',
                color: 'from-lime-500 to-green-500',
              },
              {
                icon: Zap,
                title: 'Execution & Grit',
                description: 'Your ability to persist and achieve goals',
                color: 'from-orange-500 to-red-500',
              },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all group"
              >
                <div className={`w-14 h-14 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <CheckCircle className="w-4 h-4" />
              Simple Process
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Get Your Report in 3 Easy Steps
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Free Account',
                description: 'Sign up in seconds with your email. No credit card required.',
                icon: Users,
              },
              {
                step: '02',
                title: 'Complete Assessment',
                description: '153 questions across 8 dimensions. Takes about 25 minutes.',
                icon: BookOpen,
              },
              {
                step: '03',
                title: 'Get Your Report',
                description: 'Instant personalized insights, career matches, and recommendations.',
                icon: Award,
              },
            ].map((item, idx) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="relative"
              >
                {idx < 2 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-transparent z-0" />
                )}
                <div className="relative z-10 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-2xl mb-6">
                    <item.icon className="w-8 h-8 text-gray-700" />
                  </div>
                  <div className="text-5xl font-bold text-gray-100 mb-2">{item.step}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 -mt-8">{item.title}</h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Report Section */}
      <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4 text-yellow-400" />
                Sample Report Preview
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                See What You&apos;ll Get
              </h2>
              <p className="text-xl text-white/70 mb-8">
                Your Jeru Report is packed with actionable insights to guide your
                career decisions. Here&apos;s a sneak peek of what&apos;s inside:
              </p>

              <ul className="space-y-4">
                {[
                  'Detailed personality breakdown with Big 5 traits',
                  'Your unique Holland Code with career matches',
                  'Top 3 intelligence types and learning strategies',
                  'Values hierarchy for career alignment',
                  'Stress response profile and coping strategies',
                  '21st century skills assessment',
                  'University program recommendations',
                ].map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-white/90">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              {/* Mock Report Preview */}
              <div className="bg-white rounded-2xl p-6 text-gray-900 shadow-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl" />
                    <div>
                      <div className="font-bold">Jeru Report</div>
                      <div className="text-sm text-gray-500">Alex Chen</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">Dec 2025</div>
                </div>

                {/* Radar Chart Placeholder */}
                <div className="aspect-square max-w-[250px] mx-auto mb-6 relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-full border-2 border-gray-100 rounded-full" />
                    <div className="absolute w-3/4 h-3/4 border-2 border-gray-100 rounded-full" />
                    <div className="absolute w-1/2 h-1/2 border-2 border-gray-100 rounded-full" />
                    <div className="absolute w-1/4 h-1/4 border-2 border-gray-100 rounded-full" />
                  </div>
                  <svg viewBox="0 0 100 100" className="absolute inset-0">
                    <polygon
                      points="50,15 80,35 75,70 25,70 20,35"
                      fill="rgba(59, 130, 246, 0.3)"
                      stroke="#3b82f6"
                      strokeWidth="2"
                    />
                  </svg>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-xl">
                    <div className="text-2xl font-bold text-blue-600">IAS</div>
                    <div className="text-xs text-gray-500">Holland Code</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-xl">
                    <div className="text-2xl font-bold text-purple-600">87%</div>
                    <div className="text-xs text-gray-500">Match Score</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">12</div>
                    <div className="text-xs text-gray-500">Career Paths</div>
                  </div>
                </div>

                <div className="text-center">
                  <Link
                    href="/register?redirect=/pilot-assessment"
                    className="inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700"
                  >
                    Get Your Own Report
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl -z-10 blur-2xl opacity-50" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl -z-10 blur-2xl opacity-50" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <Star className="w-4 h-4 fill-current" />
              Student Stories
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What Pilot Students Say
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "The Holland Code analysis was spot-on! I always knew I was creative, but now I understand exactly which careers align with my IAS profile.",
                name: "Sarah M.",
                role: "Grade 12, Singapore",
                avatar: "S",
                rating: 5,
              },
              {
                quote: "I was torn between engineering and design. This report showed me that UX Design combines both my analytical and artistic strengths perfectly.",
                name: "Raj P.",
                role: "Grade 11, India",
                avatar: "R",
                rating: 5,
              },
              {
                quote: "My parents wanted me to do medicine, but this report helped me explain why business suits my personality better. They finally understand!",
                name: "Anika T.",
                role: "Grade 12, Malaysia",
                avatar: "A",
                rating: 5,
              },
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <Quote className="w-8 h-8 text-gray-200 mb-3" />
                <p className="text-gray-700 mb-6">{testimonial.quote}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {[
              {
                q: "Is the pilot assessment really free?",
                a: "Yes, 100% free! We're gathering feedback to improve our platform. As a thank you, you get full access to your Jeru Report at no cost."
              },
              {
                q: "How long does the assessment take?",
                a: "About 25 minutes. There are 153 questions across 8 sections. You can save your progress and continue later if needed."
              },
              {
                q: "How accurate are the results?",
                a: "Our assessment is based on validated psychological frameworks including Big 5, Holland Codes, and Gardner's Multiple Intelligences. The pilot version provides ~85% directional accuracy."
              },
              {
                q: "What happens to my data?",
                a: "Your privacy is our priority. Your data is encrypted and never shared without your explicit consent. You can delete your account anytime."
              },
              {
                q: "Can I share my report with my school counselor?",
                a: "Absolutely! You can download a PDF of your report or share a link. Many students find it helpful for guidance discussions."
              },
              {
                q: "Will there be a full version later?",
                a: "Yes! The full version (510 questions) will offer deeper insights, AI-powered career recommendations, and university matching. Pilot participants get early access."
              },
            ].map((faq, idx) => (
              <FAQItem key={idx} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-sm font-medium">Limited Time Pilot Program</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              Ready to Discover Your Path?
            </h2>

            <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
              Join {spotsLeft}+ students who have already found clarity.
              Your personalized Jeru Report is waiting.
            </p>

            <Link
              href="/register?redirect=/pilot-assessment"
              className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-10 py-5 rounded-full font-semibold text-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-105"
            >
              Start Free Assessment
              <ArrowRight className="w-6 h-6" />
            </Link>

            <p className="mt-6 text-white/60 text-sm">
              No credit card required - Takes 25 minutes - Instant results
            </p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl">Jeru Vantage</span>
            </div>

            <div className="flex items-center gap-6 text-white/60 text-sm">
              <Link href="/privacy" className="hover:text-white">Privacy</Link>
              <Link href="/terms" className="hover:text-white">Terms</Link>
              <Link href="/contact" className="hover:text-white">Contact</Link>
            </div>

            <div className="flex items-center gap-4">
              <Globe className="w-4 h-4 text-white/40" />
              <span className="text-white/60 text-sm">Singapore - India - Southeast Asia</span>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/10 text-center text-white/40 text-sm">
            &copy; 2025 Jeru Vantage. Empowering students to find their path.
          </div>
        </div>
      </footer>
    </div>
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border border-gray-200 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-900">{question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="px-6 pb-4"
        >
          <p className="text-gray-600">{answer}</p>
        </motion.div>
      )}
    </motion.div>
  );
}
