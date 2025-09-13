'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const duration = 3000 // 3 seconds total
    const interval = duration / 100 // 30ms per increment
    const increment = 100 / (duration / interval) // Calculate increment per step

    const timer = setInterval(() => {
      setCount((prevCount) => {
        const newCount = prevCount + increment
        if (newCount >= 100) {
          clearInterval(timer)
          return 100
        }
        return newCount
      })
    }, interval)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (count >= 100) {
      // Add a small delay before transitioning
      const timer = setTimeout(() => {
        setIsVisible(false)
        // Call onComplete after fade out animation
        setTimeout(onComplete, 500)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [count, onComplete])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              className="loading-countdown"
              animate={{ 
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                duration: 0.1,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              {Math.floor(count)}
            </motion.div>
            
            {/* Progress bar */}
            <motion.div 
              className="loading-progress mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="loading-progress-bar"
                initial={{ width: '0%' }}
                animate={{ width: `${count}%` }}
                transition={{ duration: 0.1 }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
