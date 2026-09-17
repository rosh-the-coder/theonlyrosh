'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import SimpleWordWeave from '../Effects/SimpleWordWeave'

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const videoElementRef = useRef<HTMLVideoElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  
  // Scroll progress for the entire section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  
  // Intersection Observer to detect when About section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.5;
        
        // Dispatch custom event for navigation bars
        const event = new CustomEvent('about-section-visibility', {
          detail: { isVisible }
        });
        window.dispatchEvent(event);
      },
      { threshold: [0, 0.5, 1] }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  // Ensure video volume is set when component mounts
  useEffect(() => {
    if (videoElementRef.current) {
      videoElementRef.current.volume = 1.0 // Set volume to maximum
    }
  }, [isClient])
  
  // Toggle audio on click
  const toggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (videoElementRef.current) {
      const video = videoElementRef.current
      const newMutedState = !video.muted
      
      console.log('=== ABOUT VIDEO AUDIO TOGGLE ===')
      console.log('Before toggle - Muted:', video.muted, 'Volume:', video.volume)
      console.log('Video source:', video.src)
      console.log('Video ready state:', video.readyState)
      console.log('Video paused:', video.paused)
      console.log('Video current time:', video.currentTime)
      
      video.muted = newMutedState
      setIsMuted(newMutedState)
      
      // Ensure video is playing
      video.play().catch(err => {
        console.error('Video play error:', err)
      })
      
      console.log('After toggle - Muted:', video.muted, 'Volume:', video.volume)
      console.log('================================')
    }
  }
  
  // Video parallax effect
  const videoY = useTransform(scrollYProgress, [0, 1], [0, -200]) // Parallax movement
  const videoOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])
  const videoScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 1.1]) // Scale effect

  return (
    <motion.section
      id="about"
      ref={containerRef}
      className="relative h-[1400px] bg-gray-100 overflow-hidden"
    >
      {/* Sticky Container */}
      <div className="sticky top-0 h-screen flex items-center justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-20 items-center pt-[570px]">
          
          {/* Left Column - Text Content with Word Weave */}
          <motion.div
            className="space-y-8 self-start -mt-10"
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-xl md:text-2xl font-bold text-black uppercase tracking-tight">
              MYSELF
            </h2>
            
            <div className="relative">
              <SimpleWordWeave
                text="I started as an architect, but I've always been drawn to the spaces where tech, design, and storytelling intersect. From designing and developing fun apps, playful 2D platformers to immersive virtual galleries, my work focuses on creating intuitive, engaging experiences"
              />
            </div>
          </motion.div>

          {/* Right Column - Interactive Video */}
          <motion.div
            ref={videoRef}
            className="relative"
            style={{ 
              y: videoY,
              opacity: videoOpacity,
              scale: videoScale
            }}
          >
            <div 
              className="relative w-full aspect-[9/16] max-w-[400px] mx-auto bg-gray-200 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
              data-cursor="hover"
              onClick={(e) => {
                console.log('DIV CLICKED!', e)
                toggleAudio(e)
              }}
              onMouseEnter={() => console.log('🖱️ Mouse entered video area')}
              onMouseLeave={() => console.log('🖱️ Mouse left video area')}
              style={{ zIndex: 50, position: 'relative' }}
            >
              {/* Video Element */}
              <video
                ref={videoElementRef}
                src="/videos/POV.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                onLoadedMetadata={(e) => {
                  const video = e.currentTarget
                  console.log('=== ABOUT VIDEO LOADED ===')
                  console.log('Duration:', video.duration, 'seconds')
                  console.log('Volume:', video.volume)
                  console.log('Muted:', video.muted)
                  console.log('Video dimensions:', video.videoWidth, 'x', video.videoHeight)
                  console.log('Has video:', video.videoWidth > 0)
                  console.log('Ready to play')
                  console.log('========================')
                }}
              />
              
              {/* Audio Indicator Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
                <motion.div 
                  className="bg-black/50 backdrop-blur-sm rounded-full p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  initial={false}
                  animate={{ scale: isMuted ? 1 : 1.1 }}
                >
                  {isMuted ? (
                    // Muted Icon
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                    </svg>
                  ) : (
                    // Unmuted Icon
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                  )}
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  )
}
