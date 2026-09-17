'use client'

import { ReactNode, useState, useEffect } from 'react'
import { MotionConfig } from 'framer-motion'
import { AudioProvider } from '@/contexts/AudioContext'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <AudioProvider>
      <MotionConfig
        transition={{
          type: "spring",
          mass: 0.5,
          stiffness: 400,
          damping: 50,
        }}
      >
        {children}
      </MotionConfig>
    </AudioProvider>
  )
}
