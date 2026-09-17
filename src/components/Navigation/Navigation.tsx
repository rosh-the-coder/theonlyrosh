'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [showreelCoverage, setShowreelCoverage] = useState(0)
  const [workSectionVisible, setWorkSectionVisible] = useState(false)
  const [aboutSectionVisible, setAboutSectionVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  })
  const [currentTime, setCurrentTime] = useState({
    day: '',
    time: '',
    timezone: ''
  })

  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const isScrolled = window.scrollY > 50
          setScrolled(isScrolled)
          ticking = false;
        });
        ticking = true;
      }
    }

    // Use passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Update mobile state on resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  // Listen for Showreel coverage updates
  useEffect(() => {
    const handleShowreelUpdate = (event: CustomEvent) => {
      setShowreelCoverage(event.detail.coverage)
    }

    window.addEventListener('showreel-coverage-update', handleShowreelUpdate as EventListener)
    return () => window.removeEventListener('showreel-coverage-update', handleShowreelUpdate as EventListener)
  }, [])

  // Listen for Work section visibility updates
  useEffect(() => {
    const handleWorkSectionUpdate = (event: CustomEvent) => {
      setWorkSectionVisible(event.detail.isVisible)
    }

    window.addEventListener('work-section-visibility', handleWorkSectionUpdate as EventListener)
    return () => window.removeEventListener('work-section-visibility', handleWorkSectionUpdate as EventListener)
  }, [])

  // Listen for About section visibility updates
  useEffect(() => {
    const handleAboutSectionUpdate = (event: CustomEvent) => {
      setAboutSectionVisible(event.detail.isVisible)
    }

    window.addEventListener('about-section-visibility', handleAboutSectionUpdate as EventListener)
    return () => window.removeEventListener('about-section-visibility', handleAboutSectionUpdate as EventListener)
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      
      // Get user's timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
      
      // Format day name
      const dayName = now.toLocaleDateString('en-US', { 
        weekday: 'long',
        timeZone: timezone 
      })
      
      // Format time
      const timeString = now.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
        timeZone: timezone
      })
      
      // Get timezone abbreviation
      const timezoneAbbr = new Intl.DateTimeFormat('en-US', {
        timeZoneName: 'short',
        timeZone: timezone
      }).formatToParts(now).find(part => part.type === 'timeZoneName')?.value || timezone.split('/')[1] || 'Local'
      
      setCurrentTime({
        day: dayName,
        time: `${timezoneAbbr}/ ${timeString}`,
        timezone: timezone
      })
    }

    // Update immediately
    updateTime()
    
    // Update every second
    const interval = setInterval(updateTime, 1000)
    
    return () => clearInterval(interval)
  }, [])

  const scrollToContact = () => {
    const element = document.querySelector('#contact')
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // Calculate navigation animation based on Showreel coverage
  const fadeStart = 0.2 // Start fading when Showreel coverage reaches 20%
  const fadeEnd = 0.4   // Complete fade by 40% coverage
  const returnStart = 0.8 // Start returning when Showreel coverage reaches 80%
  const returnEnd = 1.0   // Complete return by 100% coverage

  // Calculate opacity and y position
  let navOpacity = 1
  let navY = 0

  // SKIP showreel hiding logic on mobile - navigation stays visible
  if (!isMobile) {
    // Work section visibility overrides Showreel logic
    if (workSectionVisible) {
      navOpacity = 0
      navY = -100
    } else if (showreelCoverage >= fadeStart && showreelCoverage < fadeEnd) {
      // Fade out and move up
      const fadeProgress = (showreelCoverage - fadeStart) / (fadeEnd - fadeStart)
      navOpacity = 1 - fadeProgress
      navY = -fadeProgress * 100 // Move up by 100px
    } else if (showreelCoverage >= fadeEnd && showreelCoverage < returnStart) {
      // Completely hidden
      navOpacity = 0
      navY = -100
    } else if (showreelCoverage >= returnStart && showreelCoverage <= returnEnd) {
      // Fade back in and move down
      const returnProgress = (showreelCoverage - returnStart) / (returnEnd - returnStart)
      navOpacity = returnProgress
      navY = -100 + (returnProgress * 100) // Move back down
    }
  }

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        aboutSectionVisible
          ? 'bg-black/90 backdrop-blur-[20px] border-b border-white/20'
          : scrolled 
            ? 'backdrop-blur-[20px] border-b border-white/10' 
            : 'backdrop-blur-[20px]'
      }`}
      initial={{ y: -100 }}
      animate={{ 
        y: navY,
        opacity: navOpacity
      }}
      transition={{ 
        duration: 0.6,
        ease: "easeInOut"
      }}
    >
      <div className="w-full px-4 sm:px-6 md:px-10 pt-[15px] md:pt-[20px] pb-[8px] md:pb-[10px]">
        {/* Mobile Layout - ONLY Based in Dublin + Button */}
        <div className="flex md:hidden items-center justify-between gap-2">
          {/* Location block - Mobile */}
          <div className="text-white flex-shrink-0">
            <div 
              className="font-normal"
              style={{ 
                fontFamily: "'Teko', sans-serif",
                fontSize: '24px',
                lineHeight: 'normal',
                marginBottom: '-6px'
              }}
            >
              Based in Dublin
            </div>
            <div 
              className="text-white/70"
              style={{ 
                fontFamily: "'Teko', sans-serif",
                fontSize: '14px',
                lineHeight: 'normal'
              }}
            >
              Working Globally
            </div>
          </div>

          {/* Let's Talk Button - Mobile */}
          <motion.button
            className="bg-accent text-white hover:bg-accent/90 transition-colors flex-shrink-0"
            style={{
              fontFamily: "'Big Shoulders Stencil Text', sans-serif",
              fontSize: '18px',
              fontWeight: '800',
              padding: '8px 16px',
              borderRadius: '12px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '6px'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.location.href = 'mailto:theonlyroshn@gmail.com'
            }}
          >
            Let's Talk
          </motion.button>
        </div>

        {/* Desktop Layout - All info */}
        <div className="hidden md:flex items-center justify-between gap-4 lg:gap-8 xl:gap-12">
          {/* Time block */}
          <div className="text-white flex-shrink-0" style={{ width: '200px' }}>
            <div 
              className="font-normal"
              style={{ 
                fontFamily: "'Teko', sans-serif",
                fontSize: '40px',
                lineHeight: 'normal',
                marginBottom: '-10px'
              }}
            >
              {currentTime.day || 'Loading...'}
            </div>
            <div 
              className="text-white/70"
              style={{ 
                fontFamily: "'Teko', sans-serif",
                fontSize: '24px',
                lineHeight: 'normal'
              }}
            >
              {currentTime.time || 'Loading...'}
            </div>
          </div>

          {/* Location block */}
          <div className="text-white flex-shrink-0">
            <div 
              className="font-normal"
              style={{ 
                fontFamily: "'Teko', sans-serif",
                fontSize: '40px',
                lineHeight: 'normal',
                marginBottom: '-10px'
              }}
            >
              Based in Dublin
            </div>
            <div 
              className="text-white/70"
              style={{ 
                fontFamily: "'Teko', sans-serif",
                fontSize: '24px',
                lineHeight: 'normal'
              }}
            >
              Working Globally
            </div>
          </div>

          {/* Availability block */}
          <div className="text-white flex-shrink-0">
            <div 
              className="font-normal"
              style={{ 
                fontFamily: "'Teko', sans-serif",
                fontSize: '40px',
                lineHeight: 'normal',
                marginBottom: '-10px'
              }}
            >
              Availability
            </div>
            <div 
              className="text-white/70"
              style={{ 
                fontFamily: "'Teko', sans-serif",
                fontSize: '24px',
                lineHeight: 'normal'
              }}
            >
              Immediately
            </div>
          </div>

          {/* Let's Talk Button */}
          <motion.button
            className="bg-accent text-white hover:bg-accent/90 transition-colors flex-shrink-0"
            style={{
              fontFamily: "'Big Shoulders Stencil Text', sans-serif",
              fontSize: '30px',
              fontWeight: '800',
              padding: '10px',
              borderRadius: '16px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '10px',
              width: '152px'
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              window.location.href = 'mailto:theonlyroshn@gmail.com'
            }}
          >
            Let's Talk
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}
