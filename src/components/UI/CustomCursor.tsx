'use client'

import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [isMounted, setIsMounted] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [trailPos, setTrailPos] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [cursorColor, setCursorColor] = useState('#FE5454')

  useEffect(() => {
    setIsMounted(true)
    
    let animationId: number
    
    const updateMousePosition = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    const animateTrail = () => {
      setTrailPos(prev => {
        const dx = mousePos.x - prev.x
        const dy = mousePos.y - prev.y
        
        return {
          x: prev.x + dx * 0.12, // Smooth trailing (0.1 = very smooth, 0.2 = more responsive)
          y: prev.y + dy * 0.12
        }
      })
      
      animationId = requestAnimationFrame(animateTrail)
    }

    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)

    // Check for interactive elements and get color
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      
      // Check for interactive elements
      if (target.closest('button, a, [data-cursor="hover"]')) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
      
      // Get the actual visible background color by traversing up the DOM tree
      let backgroundColor = 'rgb(11, 11, 11)' // Default to your website's dark background
      const element = document.elementFromPoint(e.clientX, e.clientY)
      
      if (element) {
        // Walk up the DOM tree to find the first non-transparent background
        let currentElement = element as HTMLElement
        while (currentElement && currentElement !== document.body) {
          const computedStyle = window.getComputedStyle(currentElement)
          const bg = computedStyle.backgroundColor
          
          // Check if this element has a non-transparent background
          if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
            backgroundColor = bg
            break
          }
          
          currentElement = currentElement.parentElement as HTMLElement
        }
        
        // If no background found, check body
        if (backgroundColor === 'rgb(11, 11, 11)') {
          const bodyStyle = window.getComputedStyle(document.body)
          const bodyBg = bodyStyle.backgroundColor
          if (bodyBg && bodyBg !== 'transparent' && bodyBg !== 'rgba(0, 0, 0, 0)') {
            backgroundColor = bodyBg
          }
        }
        
        // Convert background color to RGB values
        let r = 11, g = 11, b = 11 // Default to your dark background
        
        // Handle RGB
        const rgbMatch = backgroundColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/)
        if (rgbMatch) {
          r = parseInt(rgbMatch[1])
          g = parseInt(rgbMatch[2])
          b = parseInt(rgbMatch[3])
        }
        // Handle RGBA
        else {
          const rgbaMatch = backgroundColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/)
          if (rgbaMatch) {
            r = parseInt(rgbaMatch[1])
            g = parseInt(rgbaMatch[2])
            b = parseInt(rgbaMatch[3])
          }
        }
        
        // Calculate exclusion color (opposite color)
        const exclusionR = 255 - r
        const exclusionG = 255 - g
        const exclusionB = 255 - b
        
        // Convert to hex
        const exclusionColor = `#${((1 << 24) + (exclusionR << 16) + (exclusionG << 8) + exclusionB).toString(16).slice(1)}`
        
        setCursorColor(exclusionColor)
      } else {
        // Default to brand red when no element found
        setCursorColor('#FE5454')
      }
    }

    window.addEventListener('mousemove', updateMousePosition)
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mouseup', handleMouseUp)
    
    // Start the trailing animation
    animationId = requestAnimationFrame(animateTrail)

    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('mouseup', handleMouseUp)
      cancelAnimationFrame(animationId)
    }
  }, [mousePos.x, mousePos.y])

  // Don't render until mounted (prevents hydration errors)
  if (!isMounted) {
    return null
  }

  return (
    <>
      {/* Trailing circle - smooth lag effect */}
      <div
        className="fixed pointer-events-none z-[9998]"
        style={{
          left: trailPos.x,
          top: trailPos.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`w-12 h-12 border-2 rounded-full transition-all duration-200 ease-out ${
            isHovering ? 'scale-150 opacity-80' : 'scale-100 opacity-60'
          }`}
          style={{
            borderColor: cursorColor,
          }}
        />
      </div>

      {/* Main cursor dot - immediate response */}
      <div
        className="fixed pointer-events-none z-[9999]"
        style={{
          left: mousePos.x,
          top: mousePos.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className={`w-2.5 h-2.5 rounded-full transition-all duration-100 ease-out ${
            isHovering ? 'scale-200' : isClicking ? 'scale-50' : 'scale-100'
          }`}
          style={{
            backgroundColor: cursorColor,
          }}
        />
      </div>
    </>
  )
}