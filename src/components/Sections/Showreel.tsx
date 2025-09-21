'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'

export default function Showreel() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMuted, setIsMuted] = useState(true) // Default: no sound
  const [userToggledAudio, setUserToggledAudio] = useState(false) // Track if user manually toggled audio
  const [audioEnabled, setAudioEnabled] = useState(false) // Track if audio should be enabled
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.3", "end 0.1"]
  })

  // ===== ANIMATION STATE PARAMETERS =====
  // You can easily tweak these values to control the animation behavior
  
  // ENTRY STATE: When section enters from right edge
  const entryStart = 0.2    // When entry animation starts (0-1) - starts later
  const entryEnd = 0.6      // When entry animation completes (0-1)
  
  // STATIC STATE: When section stays on screen
  const staticStart = 0.6   // When static state begins (0-1)
  const staticEnd = 0.8     // When static state ends (0-1)
  const staticScrollHeight = 500 // Height in pixels for static state (adjust this!)
  
  // EXIT STATE: When section moves upwards
  const exitStart = 0.8     // When exit animation starts (0-1)
  const exitEnd = 1.0       // When exit animation completes (0-1)
  const exitDistance = -120 // How far up it moves in pixels (negative = up)
  
  // ===== ANIMATION TRANSFORMS =====
  
  // ENTRY: Horizontal movement from right edge, stays centered during exit
  const x = useTransform(scrollYProgress, 
    [0, entryStart, entryEnd, exitStart, exitEnd], 
    ['100%', '100%', '0%', '0%', '0%'] // Stays off-screen, moves to center, stays centered during exit
  )
  
  // STATIC: No movement, stays in place
  const staticY = useTransform(scrollYProgress, 
    [staticStart, staticEnd], 
    [0, 0] // Stays at y: 0 during static state
  )
  
  // EXIT: Upward movement
  const exitY = useTransform(scrollYProgress, 
    [exitStart, exitEnd], 
    [0, exitDistance] // Moves up during exit
  )
  
  // COMBINED Y TRANSFORM: Combines static and exit states
  const y = useTransform(scrollYProgress, 
    [0, staticStart, staticEnd, exitStart, exitEnd], 
    [0, 0, 0, 0, exitDistance]
  )
  
  // OPACITY: Fade in during entry, stay visible during static, fade out during exit
  const opacity = useTransform(scrollYProgress, 
    [0, entryStart, entryEnd, staticStart, staticEnd, exitStart, exitEnd], 
    [0, 0, 1, 1, 1, 1, 0] // Start invisible, fade in, stay visible, fade out
  )
  
  // SCALE: Grow during entry, stay full size during static and exit
  const scale = useTransform(scrollYProgress, 
    [entryStart, entryEnd, staticStart, staticEnd, exitStart, exitEnd], 
    [0.3, 1, 1, 1, 1, 1] // Grow, stay full size, NO shrinking during exit
  )
  
  // Calculate when Showreel fully covers the screen
  const showreelCoverageThreshold = staticStart
  const isShowreelFullyCovered = scrollYProgress.get() > showreelCoverageThreshold

  // Sound toggle function - only works when showreel is visible
  const toggleSound = () => {
    // Don't allow toggle when showreel is off-screen
    if (scrollYProgress.get() >= exitEnd) {
      console.log('🔇 Audio toggle disabled - showreel section is off-screen')
      return
    }
    
    if (videoRef.current) {
      const newAudioEnabled = !audioEnabled
      setAudioEnabled(newAudioEnabled)
      setUserToggledAudio(true) // Mark that user manually toggled
      setHasAutoEnabled(false) // Reset auto-enabled state
      
      if (newAudioEnabled) {
        // Enabling audio
        console.log('🎵 User enabled audio')
        videoRef.current.muted = false
        videoRef.current.volume = 0.8
        setIsMuted(false)
        
        // Ensure video is playing
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Video play failed:', error)
          })
        }
      } else {
        // Disabling audio
        console.log('🔇 User disabled audio')
        videoRef.current.muted = true
        setIsMuted(true)
      }
    }
  }

  // Auto-enable audio when showreel becomes visible (only once on first reveal)
  const [hasAutoEnabled, setHasAutoEnabled] = useState(false)
  
  useEffect(() => {
    if (isVisible && !userToggledAudio && !hasAutoEnabled && videoRef.current) {
      // Only auto-enable once on first reveal
      setTimeout(() => {
        if (videoRef.current && isVisible && !userToggledAudio && !hasAutoEnabled) {
          setAudioEnabled(true)
          videoRef.current.muted = false
          videoRef.current.volume = 0.8
          setIsMuted(false)
          setHasAutoEnabled(true) // Mark as auto-enabled to prevent future auto-enabling
          console.log('🎵 Auto-enabled audio for showreel visibility (first time only)')
        }
      }, 500) // Small delay to ensure smooth transition
    }
  }, [isVisible, userToggledAudio, hasAutoEnabled])

  // Scroll-based volume control
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (videoRef.current) {
        // Only control audio if user has enabled it
        if (audioEnabled) {
          // Calculate volume based on section visibility
          let volume = 0.8 // Base volume
          
          if (latest < entryStart) {
            // Before entry - no audio
            volume = 0
          } else if (latest >= entryStart && latest < staticStart) {
            // During entry - fade in audio
            const entryProgress = (latest - entryStart) / (staticStart - entryStart)
            volume = 0.8 * entryProgress
          } else if (latest >= staticStart && latest < exitStart) {
            // During static - full volume
            volume = 0.8
          } else if (latest >= exitStart) {
            // During exit - fade out audio
            const exitProgress = (latest - exitStart) / (exitEnd - exitStart)
            volume = 0.8 * (1 - exitProgress)
          }
          
          // Apply volume and unmute if needed
          if (volume > 0) {
            videoRef.current.muted = false
            videoRef.current.volume = Math.max(0, Math.min(0.8, volume))
            setIsMuted(false)
          } else {
            // Fade out complete - mute but keep audioEnabled true for restoration
            videoRef.current.muted = true
            setIsMuted(true)
          }
        } else {
          // User has disabled audio - keep it muted
          videoRef.current.muted = true
          setIsMuted(true)
        }
      }
    })
    return unsubscribe
  }, [scrollYProgress, entryStart, staticStart, exitStart, exitEnd, audioEnabled])

  // Initialize video when component mounts
  useEffect(() => {
    const initializeVideo = () => {
      if (videoRef.current) {
        // Ensure video starts muted and with proper settings
        videoRef.current.muted = true
        videoRef.current.volume = 0.8
        videoRef.current.loop = true
        videoRef.current.playsInline = true
        
        // Try to play muted video
        const playPromise = videoRef.current.play()
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Video autoplay failed (this is normal):', error)
          })
        }
      }
    }

    // Try to initialize immediately
    initializeVideo()
    
    // Also try after a short delay to handle loading issues
    const timeoutId = setTimeout(initializeVideo, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [])

  // Broadcast coverage updates to Hero section
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      const event = new CustomEvent('showreel-coverage-update', {
        detail: { coverage: latest }
      });
      window.dispatchEvent(event);
    });
    return unsubscribe;
  }, [scrollYProgress]);
  
  
  const rotate = useTransform(scrollYProgress, 
    [0, 0.3, 0.6, 0.8, 1], 
    [2, 1, 0, -0.5, 0]
  )

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const isInView = rect.top < window.innerHeight && rect.bottom > 0
        setIsVisible(isInView)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Check initial state
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section 
      ref={containerRef}
      className="relative h-screen bg-transparent"
      id="showreel"
      style={{ 
        paddingTop: '500px', 
        paddingBottom: '1500px' 
      }}
    >
      {/* Fixed overlay that enters from right */}
      <motion.div
        className={`fixed inset-0 ${isShowreelFullyCovered ? 'pointer-events-auto z-20' : 'pointer-events-auto z-20'}`}
        style={{ 
          x, 
          opacity,
          scale,
          rotate,
          y: y,
          transformOrigin: 'center center'
        }}
        transition={{
          type: "tween",
          ease: "easeInOut",
          duration: 0.5
        }}
      >
        {/* Video container with sound toggle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative rounded-2xl overflow-hidden border border-gray-700"
               onClick={scrollYProgress.get() < exitEnd ? toggleSound : undefined}
               style={{
                 width: 'calc(100vw - 80px)', // 40px padding on each side
                 height: 'calc(100vh - 80px)', // 40px padding top/bottom
                 boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                 cursor: scrollYProgress.get() < exitEnd ? 'pointer' : 'default',
               }}>
            {/* Video element */}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted={true}
              playsInline
              preload="auto"
            >
              <source src="/videos/showreel-sample.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            
            {/* Sound toggle button */}
            <button
              onClick={scrollYProgress.get() < exitEnd ? toggleSound : undefined}
              disabled={scrollYProgress.get() >= exitEnd}
              className={`absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white transition-all duration-300 backdrop-blur-sm border border-white/20 ${
                scrollYProgress.get() < exitEnd 
                  ? 'bg-black/70 hover:bg-black/90 cursor-pointer' 
                  : 'bg-black/30 cursor-not-allowed opacity-50'
              }`}
            >
              {!audioEnabled ? (
                <VolumeX className="w-6 h-6" />
              ) : (
                <Volume2 className="w-6 h-6" />
              )}
            </button>
            
            {/* Video title overlay */}
            <div className="absolute bottom-4 left-4 bg-black/70 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
              <h3 className="text-white font-semibold text-lg">Showreel</h3>
              <p className="text-white/70 text-sm">Click sound icon to toggle audio</p>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
