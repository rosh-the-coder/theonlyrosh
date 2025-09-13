'use client'

import { useEffect, useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const cursorRef = useRef<HTMLDivElement>(null)
  
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)
  
  const scale = useTransform(cursorX, [0, 1000], [1, 1.5])
  const rotate = useTransform(cursorY, [0, 1000], [0, 360])

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      const { clientX, clientY } = e
      setMousePosition({ x: clientX, y: clientY })
      mouseX.set(clientX)
      mouseY.set(clientY)
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    // Add magnetic effect to interactive elements
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (target.closest('.magnetic, .interactive, button, a')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', updateMousePosition)
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [mouseX, mouseY])

  // Hide cursor on mobile
  if (typeof window !== 'undefined' && window.innerWidth <= 768) {
    return null
  }

  return (
    <motion.div
      ref={cursorRef}
      className="custom-cursor fixed pointer-events-none z-[9999] mix-blend-difference"
      style={{
        x: cursorX,
        y: cursorY,
        scale: isHovering ? scale : 1,
        rotate: isHovering ? rotate : 0,
      }}
      animate={{
        scale: isClicking ? 0.8 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
    >
      {/* Main cursor dot */}
      <motion.div
        className="cursor-dot w-2 h-2 bg-accent rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 1 : 0.8,
        }}
      />
      
      {/* Outer ring */}
      <motion.div
        className="cursor-ring w-10 h-10 border-2 border-accent rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        animate={{
          scale: isHovering ? 1.8 : 1,
          opacity: isHovering ? 0.6 : 0.3,
          borderWidth: isHovering ? "3px" : "2px",
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 25,
        }}
      />
      
      {/* Glow effect */}
      <motion.div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-accent/20 blur-xl"
        animate={{
          scale: isHovering ? 1.5 : 0.8,
          opacity: isHovering ? 0.4 : 0.1,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
      />
      
      {/* Text indicator for interactive elements */}
      {isHovering && (
        <motion.div
          className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-1 bg-white text-black text-xs rounded-full whitespace-nowrap"
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
          }}
        >
          {isClicking ? 'Click!' : 'Hover'}
        </motion.div>
      )}
    </motion.div>
  )
}
