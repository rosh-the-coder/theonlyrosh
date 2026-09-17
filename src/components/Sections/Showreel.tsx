'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Volume2, VolumeX } from 'lucide-react'
import { useAudioManager } from '@/contexts/AudioContext'

export default function Showreel() {
  const [isVisible, setIsVisible] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(false)
  const [isInViewport, setIsInViewport] = useState(false)
  // Initialize isMobile synchronously to prevent source switching
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768;
    }
    return false;
  })
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const audioManager = useAudioManager()
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
  
  // OPACITY: Fully visible during entry, stay visible during static, fade out during exit
  const opacity = useTransform(scrollYProgress, 
    [0, entryStart, entryEnd, staticStart, staticEnd, exitStart, exitEnd], 
    [1, 1, 1, 1, 1, 1, 0] // Start fully visible, stay visible, fade out
  )
  
  // SCALE: Grow during entry, stay full size during static and exit
  const scale = useTransform(scrollYProgress, 
    [entryStart, entryEnd, staticStart, staticEnd, exitStart, exitEnd], 
    [0.3, 1, 1, 1, 1, 1] // Grow, stay full size, NO shrinking during exit
  )
  
  // POINTER EVENTS: Auto when visible, none when exited
  const pointerEvents = useTransform(scrollYProgress,
    [0, exitStart - 0.01, exitStart],
    ['auto', 'auto', 'none']
  )
  
  // Update mobile state on resize only
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate when Showreel fully covers the screen
  const showreelCoverageThreshold = staticStart
  const isShowreelFullyCovered = scrollYProgress.get() > showreelCoverageThreshold

  // Sound toggle function - ALWAYS works when showreel is visible
  const toggleSound = () => {
    const progress = scrollYProgress.get();
    // Allow toggle whenever showreel is in viewing area
    const isInViewingArea = progress >= entryStart && progress < exitEnd;
    
    if (!isInViewingArea) {
      console.log('Cannot toggle - showreel not in viewing area');
      return;
    }
    
    if (videoRef.current) {
      const newAudioEnabled = !audioEnabled;
      console.log('Toggle audio:', newAudioEnabled);
      
      if (newAudioEnabled) {
        // Request audio from manager
        if (audioManager.requestAudioPlay('showreel')) {
          setAudioEnabled(true);
          videoRef.current.muted = false;
          videoRef.current.volume = 0.8;
          setIsMuted(false);
          console.log('Audio enabled');
        }
      } else {
        // Release audio
        audioManager.releaseAudio('showreel');
        setAudioEnabled(false);
        videoRef.current.muted = true;
        setIsMuted(true);
        console.log('Audio disabled');
      }
    }
  }

  // FORCE PAUSE audio when not visible - THIS ACTUALLY STOPS THE AUDIO
  useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', (latest) => {
      if (!videoRef.current) return;
      
      const isVisible = latest >= entryStart && latest < exitEnd;
      
      if (!isVisible) {
        // PAUSE THE VIDEO - this actually stops audio from playing
        if (!videoRef.current.paused) {
          videoRef.current.pause();
        }
        videoRef.current.muted = true;
        videoRef.current.volume = 0;
        setIsMuted(true);
        return;
      }
      
      // Resume playing when visible
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
      
      // Control volume based on audioEnabled
      if (audioEnabled) {
        let volume = 0.8;
        
        if (latest >= entryStart && latest < staticStart) {
          const progress = (latest - entryStart) / (staticStart - entryStart);
          volume = 0.8 * progress;
        } else if (latest >= staticStart && latest < exitStart) {
          volume = 0.8;
        } else if (latest >= exitStart) {
          const progress = (latest - exitStart) / (exitEnd - exitStart);
          volume = 0.8 * (1 - progress);
        }
        
        videoRef.current.muted = false;
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    });
    
    return unsubscribe;
  }, [scrollYProgress, entryStart, staticStart, exitStart, exitEnd, audioEnabled])

  // Initialize video when component mounts
  useEffect(() => {
    const initializeVideo = () => {
      if (videoRef.current) {
        const video = videoRef.current;
        // Ensure video starts muted and with proper settings
        video.muted = true;
        video.volume = 0.8;
        video.loop = true;
        video.setAttribute('loop', 'loop'); // Force loop attribute
        video.playsInline = true;
        
        // Try to play muted video
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay might be blocked, that's okay
          });
        }
      }
    }

    // Try to initialize immediately
    initializeVideo()
    
    // Also try after a short delay to handle loading issues
    const timeoutId = setTimeout(initializeVideo, 1000)
    
    return () => clearTimeout(timeoutId)
  }, [])

  // AGGRESSIVE LOOP MONITORING - ensures video always loops
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      // When video is near the end, restart it
      if (video.duration > 0 && video.currentTime >= video.duration - 0.5) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    };

    const handleEnded = () => {
      // Backup: manually restart if loop somehow fails
      video.loop = true;
      video.setAttribute('loop', 'loop');
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    const handlePause = () => {
      // If video pauses unexpectedly and we're in the viewing area, restart it
      const progress = scrollYProgress.get();
      const isInViewingArea = progress >= entryStart && progress < exitEnd;
      
      if (isInViewingArea && video.currentTime > 0 && video.currentTime < video.duration) {
        setTimeout(() => {
          if (video.paused) {
            video.play().catch(() => {});
          }
        }, 100);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('pause', handlePause);
    };
  }, [scrollYProgress, entryStart, exitEnd])


  // DELETED ALL AGGRESSIVE AUTO-RESUME LOGIC

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
  
  
  
  useEffect(() => {
    // Use IntersectionObserver for more reliable visibility detection
    const el = containerRef.current
    if (!el || typeof window === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting && entry.intersectionRatio > 0.25
        setIsVisible(visible)
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] }
    )
    observer.observe(el)
    return () => observer.unobserve(el)
  }, [])

  // (Removed redundant ensure-playback effect; handled in the main resume effect above)

  return (
    <section 
      ref={containerRef}
      className="relative h-screen bg-transparent"
      id="showreel"
      style={{ 
        paddingTop: '300px', 
        paddingBottom: '1200px' 
      }}
    >
      {/* Fixed overlay that enters from right - Desktop only */}
      {!isMobile && (
        <motion.div
          className={`fixed inset-0 z-20`}
          style={{ 
            x, 
            opacity,
            scale,
            y: y,
            transformOrigin: 'center center',
            pointerEvents
          }}
          transition={{
            type: "tween",
            ease: "easeInOut",
            duration: 0.5
          }}
        >
        {/* Video container with sound toggle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative rounded-xl md:rounded-2xl overflow-hidden border border-gray-700 bg-black sm:!w-[calc(100vw-40px)] sm:!h-[calc(100vh-40px)] md:!w-[calc(100vw-80px)] md:!h-[calc(100vh-80px)]"
               onClick={scrollYProgress.get() < exitEnd ? toggleSound : undefined}
               style={{
                 width: 'calc(100vw - 16px)', // 8px padding on each side for mobile
                 height: 'calc(100vh - 16px)', // 8px padding top/bottom for mobile
                 boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
                 cursor: scrollYProgress.get() < exitEnd ? 'pointer' : 'default',
               }}
               >
            {/* Video element */}
            <video
              ref={videoRef}
              className={`w-full h-full ${isMobile ? 'object-contain' : 'object-cover'}`}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              preload="auto"
              webkit-playsinline="true"
              x5-playsinline="true"
              src={isMobile ? "/videos/theonlyrosh-showreel 9-16.mp4" : "/videos/theonlyrosh-showreel-fixed.mp4"}
            >
              Your browser does not support the video tag.
            </video>
            
            
            {/* Removed video title/description overlay per request */}
          </div>
        </div>
      </motion.div>
      )}
    </section>
  )
}
