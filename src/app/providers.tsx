'use client'

import { ReactNode } from 'react'
import { MotionConfig } from 'framer-motion'

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
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
  )
}
