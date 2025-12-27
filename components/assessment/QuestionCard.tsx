'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence, Variants } from 'framer-motion'
import { ReactNode } from 'react'

interface QuestionCardProps {
  questionId: number
  questionText: string
  direction: 'forward' | 'backward'
  children: ReactNode
  sectionNumber?: number // Used to determine animation style per section
}

// Different animation styles that cycle through sections
const ANIMATION_STYLES = [
  // Style 0: Horizontal page flip (original)
  {
    enter: (dir: 'forward' | 'backward') => ({
      rotateY: dir === 'forward' ? 90 : -90,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: 'forward' | 'backward') => ({
      rotateY: dir === 'forward' ? -90 : 90,
      opacity: 0,
      scale: 0.9,
    }),
  },
  // Style 1: Vertical flip
  {
    enter: (dir: 'forward' | 'backward') => ({
      rotateX: dir === 'forward' ? 90 : -90,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      rotateX: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: 'forward' | 'backward') => ({
      rotateX: dir === 'forward' ? -90 : 90,
      opacity: 0,
      scale: 0.9,
    }),
  },
  // Style 2: Dissolve/Fade with scale
  {
    enter: () => ({
      scale: 0.85,
      opacity: 0,
    }),
    center: {
      scale: 1,
      opacity: 1,
    },
    exit: () => ({
      scale: 1.1,
      opacity: 0,
    }),
  },
  // Style 3: Slide from right/left
  {
    enter: (dir: 'forward' | 'backward') => ({
      x: dir === 'forward' ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: 'forward' | 'backward') => ({
      x: dir === 'forward' ? -300 : 300,
      opacity: 0,
    }),
  },
  // Style 4: Slide from bottom with spring
  {
    enter: () => ({
      y: 100,
      opacity: 0,
    }),
    center: {
      y: 0,
      opacity: 1,
    },
    exit: () => ({
      y: -50,
      opacity: 0,
    }),
  },
  // Style 5: Zoom from center
  {
    enter: () => ({
      scale: 0,
      opacity: 0,
    }),
    center: {
      scale: 1,
      opacity: 1,
    },
    exit: () => ({
      scale: 0,
      opacity: 0,
    }),
  },
  // Style 6: Rotate and fade
  {
    enter: (dir: 'forward' | 'backward') => ({
      rotate: dir === 'forward' ? 10 : -10,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      rotate: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: 'forward' | 'backward') => ({
      rotate: dir === 'forward' ? -10 : 10,
      opacity: 0,
      scale: 0.9,
    }),
  },
  // Style 7: 3D Card flip (full rotation)
  {
    enter: (dir: 'forward' | 'backward') => ({
      rotateY: dir === 'forward' ? 180 : -180,
      opacity: 0,
    }),
    center: {
      rotateY: 0,
      opacity: 1,
    },
    exit: (dir: 'forward' | 'backward') => ({
      rotateY: dir === 'forward' ? -180 : 180,
      opacity: 0,
    }),
  },
]

// Background colors that cycle with questions for subtle variety
const CARD_COLORS = [
  'bg-white',
  'bg-gradient-to-br from-blue-50 to-white',
  'bg-gradient-to-br from-purple-50 to-white',
  'bg-gradient-to-br from-green-50 to-white',
  'bg-gradient-to-br from-orange-50 to-white',
  'bg-gradient-to-br from-pink-50 to-white',
  'bg-gradient-to-br from-cyan-50 to-white',
  'bg-gradient-to-br from-amber-50 to-white',
]

export default function QuestionCard({
  questionId,
  questionText,
  direction,
  children,
  sectionNumber = 0,
}: QuestionCardProps) {
  // Pick animation style based on section number (changes per assessment section)
  const animationStyle = useMemo(() => {
    return ANIMATION_STYLES[sectionNumber % ANIMATION_STYLES.length]
  }, [sectionNumber])

  // Pick card color based on question number for subtle variety
  const cardColor = useMemo(() => {
    return CARD_COLORS[questionId % CARD_COLORS.length]
  }, [questionId])

  // Create variants with proper typing
  const pageVariants: Variants = useMemo(() => ({
    enter: (dir: 'forward' | 'backward') => ({
      ...animationStyle.enter(dir),
      transition: { duration: 0.4, ease: 'easeOut' },
    }),
    center: {
      ...animationStyle.center,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
      },
    },
    exit: (dir: 'forward' | 'backward') => ({
      ...animationStyle.exit(dir),
      transition: { duration: 0.3, ease: 'easeIn' },
    }),
  }), [animationStyle])

  return (
    <div className="perspective-1000">
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={questionId}
          custom={direction}
          variants={pageVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className={`${cardColor} rounded-2xl shadow-lg p-8 preserve-3d`}
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="mb-8">
            <p className="text-2xl text-gray-800 font-medium leading-relaxed">
              {questionText}
            </p>
          </div>
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
