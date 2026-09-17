
"use client";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Suspense, useState, useEffect, useRef } from "react";
import RippleReveal from "../RippleReveal";
import { useAudioManager } from "@/contexts/AudioContext";

export default function Hero() {
  const [revealEnabled, setRevealEnabled] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const [showreelCoverage, setShowreelCoverage] = useState(0);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showreelMuted, setShowreelMuted] = useState(true);
  const [showreelAudioEnabled, setShowreelAudioEnabled] = useState(false);
  const showreelVideoRef = useRef<HTMLVideoElement>(null);
  const audioManager = useAudioManager();

  useEffect(() => {
    setIsClient(true);
    
    // Check if mobile on mount and on resize
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768;
      setIsMobile(isMobileDevice);
    };
    
    // Detect if device might have performance issues (but less aggressive)
    const checkPerformance = () => {
      // Only enable low power mode for very weak devices
      const isLowEnd = !!(navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2);
      setLowPowerMode(isLowEnd);
    };
    
    checkMobile();
    checkPerformance();
    
    // Listen for window resize
    window.addEventListener('resize', checkMobile);
    
    // Canvas ready after a brief moment to prevent blank screen
    const timer = setTimeout(() => setCanvasReady(true), 100);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Canvas in RippleReveal is 1200x600, so center is always 600
  const CANVAS_CENTER_X = 600;
  const CANVAS_CENTER_Y = 300;

  // Listen for Showreel coverage updates
  useEffect(() => {
    const handleShowreelUpdate = (event: CustomEvent) => {
      setShowreelCoverage(event.detail.coverage);
    };

    window.addEventListener('showreel-coverage-update', handleShowreelUpdate as EventListener);
    return () => window.removeEventListener('showreel-coverage-update', handleShowreelUpdate as EventListener);
  }, []);

  // Calculate exit animation based on Showreel coverage
  const exitThreshold = 0.8; // Start exit animation at 80% coverage (when fully covered)
  const exitProgress = Math.max(0, (showreelCoverage - exitThreshold) / (1 - exitThreshold));
  const exitY = exitProgress * -120; // Move up by 120vh to ensure completely off-screen

  // Smooth exit animation with better easing
  const exitYValue = exitProgress > 0 ? exitY : 0;

  const handleCanvasClick = () => {
    // Only allow toggle if Showreel hasn't fully covered the screen
    const showreelCoverageThreshold = 0.8;
    if (showreelCoverage < showreelCoverageThreshold) {
      console.log('Canvas clicked! Current revealEnabled:', revealEnabled);
      setRevealEnabled(!revealEnabled);
    } else {
      console.log('Toggle disabled - Showreel fully covers screen');
    }
  };

  // Showreel audio toggle for mobile
  const toggleShowreelSound = () => {
    if (!showreelVideoRef.current) return;
    
    const newAudioEnabled = !showreelAudioEnabled;
    
    if (newAudioEnabled) {
      // Request audio from manager
      if (audioManager.requestAudioPlay('showreel')) {
        setShowreelAudioEnabled(true);
        showreelVideoRef.current.muted = false;
        showreelVideoRef.current.volume = 0.8;
        setShowreelMuted(false);
      }
    } else {
      // Release audio
      audioManager.releaseAudio('showreel');
      setShowreelAudioEnabled(false);
      showreelVideoRef.current.muted = true;
      setShowreelMuted(true);
    }
  };

  // Initialize showreel video on mobile
  useEffect(() => {
    if (isMobile && showreelVideoRef.current) {
      const video = showreelVideoRef.current;
      video.muted = true;
      video.volume = 0.8;
      video.loop = true;
      video.setAttribute('loop', 'loop');
      video.playsInline = true;
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay might be blocked, that's okay
        });
      }
    }
  }, [isMobile]);

  // Monitor showreel video loop on mobile
  useEffect(() => {
    if (!isMobile || !showreelVideoRef.current) return;
    
    const video = showreelVideoRef.current;
    
    const handleTimeUpdate = () => {
      if (video.duration > 0 && video.currentTime >= video.duration - 0.5) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    };

    const handleEnded = () => {
      video.loop = true;
      video.setAttribute('loop', 'loop');
      video.currentTime = 0;
      video.play().catch(() => {});
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isMobile]);

  // Pause showreel when another audio source becomes active
  useEffect(() => {
    if (isMobile && showreelVideoRef.current) {
      if (audioManager.activeAudio !== 'showreel' && audioManager.activeAudio !== null && showreelAudioEnabled) {
        setShowreelAudioEnabled(false);
        showreelVideoRef.current.muted = true;
        setShowreelMuted(true);
        audioManager.releaseAudio('showreel');
      }
    }
  }, [audioManager.activeAudio, isMobile, showreelAudioEnabled]);

  return (
    <section 
      className={`fixed inset-0 h-[100svh] bg-[#0B0B0B] overflow-hidden select-none hero-protection z-10 ${
        showreelCoverage > 0.2 ? 'pointer-events-none' : 'pointer-events-auto'
      }`}
      style={{
        transform: `translateY(${exitYValue}vh)`,
        transition: 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
      onClick={handleCanvasClick}
    >
      {/* Loading placeholder to prevent blank screen */}
      {!canvasReady && (
        <div className="absolute inset-0 bg-[#0B0B0B] flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#FE5454] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-white/50 text-sm font-teko">Loading Canvas...</p>
          </div>
        </div>
      )}
      
      {/* Mobile: CSS Text Only (no canvas) - Desktop-like layout */}
      {isClient && isMobile && (
        <div className="absolute inset-0 px-4 sm:px-5 md:px-6 flex flex-col justify-between" style={{ minHeight: '100svh', paddingTop: 'clamp(1.5rem, 6vh, 3rem)', paddingBottom: 'clamp(1.5rem, 6vh, 3rem)' }}>
          {/* Top Section: "i am", "ROSH", "a" */}
          <div className="relative w-full flex-shrink-0" style={{ height: 'clamp(50px, 10vh, 90px)', marginTop: 'clamp(10px, 2vh, 20px)' }}>
            {/* Top Left: "i am" */}
            <div 
              className="absolute text-white"
              style={{
                fontFamily: "'Teko', sans-serif",
                fontWeight: 100,
                letterSpacing: '0.05em',
                fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                top: '50%',
                left: '0',
                transform: 'translateY(-50%)'
              }}
            >
              i am
            </div>

            {/* Top Center: "ROSH" */}
            <div 
              className="absolute left-1/2 text-white"
              style={{
                fontFamily: "'Teko', sans-serif",
                fontWeight: 100,
                letterSpacing: '0.05em',
                fontSize: 'clamp(1.25rem, 5vw, 1.875rem)',
                top: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              ROSH
            </div>

            {/* Top Right: "a" */}
            <div 
              className="absolute text-white"
              style={{
                fontFamily: "'Teko', sans-serif",
                fontWeight: 100,
                letterSpacing: '0.05em',
                fontSize: 'clamp(1rem, 4vw, 1.5rem)',
                top: '50%',
                right: '0',
                transform: 'translateY(-50%)'
              }}
            >
              a
            </div>
          </div>

          {/* Showreel Video - Mobile only */}
          <div className="flex items-center justify-center w-full flex-shrink-0" style={{ maxHeight: '45vh', marginTop: 'clamp(-25vh, -30vh, -20vh)', marginBottom: 'clamp(0.5rem, 2vh, 1rem)' }}>
            <div 
              className="relative rounded-lg overflow-hidden border border-gray-700 bg-black cursor-pointer"
              onClick={toggleShowreelSound}
              style={{
                width: '100%',
                maxWidth: 'calc(100vw - 2rem)',
                aspectRatio: '16/9',
                maxHeight: '45vh',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
              }}
            >
              <video
                ref={showreelVideoRef}
                className="w-full h-full object-cover"
                autoPlay
                loop
                muted={showreelMuted}
                playsInline
                preload="auto"
                webkit-playsinline="true"
                x5-playsinline="true"
                src="/videos/theonlyrosh-showreel-fixed.mp4"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Center: "DESIGN ENGINEER" */}
          <div className="flex flex-col items-center justify-center gap-0.5 sm:gap-1 px-2 sm:px-4" style={{ flex: '0 1 auto', minHeight: '0' }}>
            <h1 
              className="text-[#FE5454] font-bold text-center w-full"
              style={{
                fontFamily: "'Teko', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(2.5rem, 16vw, 12rem)',
                letterSpacing: '0.05em',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                lineHeight: '0.85',
                textAlign: 'center',
                display: 'block',
                width: '100%',
                margin: '0 auto'
              }}
            >
              DESIGN
            </h1>
            <h1 
              className="text-[#FE5454] font-bold text-center w-full"
              style={{
                fontFamily: "'Teko', sans-serif",
                fontWeight: 700,
                fontSize: 'clamp(2.5rem, 16vw, 12rem)',
                letterSpacing: '0.05em',
                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
                lineHeight: '0.75'
              }}
            >
              ENGINEER
            </h1>
            
            {/* Quote */}
            <div 
              className="text-white text-center"
              style={{
                fontFamily: "'Teko', sans-serif",
                fontWeight: 50,
                letterSpacing: '0.05em',
                fontSize: 'clamp(0.7rem, 2.5vw, 1rem)',
                marginTop: 'clamp(0.75rem, 2.5vh, 2rem)'
              }}
            >
              " Think Globally. Act Locally. "
            </div>
          </div>
        </div>
      )}
      
      {/* Desktop: Canvas with RippleReveal */}
      {isClient && !isMobile && (
        <Canvas
          className="absolute inset-0 z-0 pointer-events-auto select-none"
          onContextMenu={(e) => e.preventDefault()}
          gl={(canvas) => {
            const renderer = new THREE.WebGLRenderer({
              canvas,
              antialias: !lowPowerMode,
              powerPreference: "high-performance",
              alpha: true,
              preserveDrawingBuffer: false,
              stencil: false,
              depth: true,
            });
            // Suppress WebGL deprecation warnings
            renderer.debug = { 
              checkShaderErrors: false,
              onShaderError: () => {}
            };
            // Balanced pixel ratio for performance
            const pixelRatio = lowPowerMode ? 1 : Math.min(window.devicePixelRatio, 1.5);
            renderer.setPixelRatio(pixelRatio);
            setCanvasReady(true); // Mark as ready when renderer is created
            return renderer;
          }}
          camera={{ position: [0, 0, 1], fov: 15, near: 0.1, far: 10 }}
          onClick={handleCanvasClick}
          onError={(error) => {
            console.warn('Canvas error:', error);
          }}
          frameloop="always" // Keep rendering for interactive effects
          performance={{
            current: 1,
            min: 0.5,
            max: 1,
            debounce: 200,
          }}
        >
          <Suspense fallback={<div className="absolute inset-0 bg-[#0B0B0B]" />}>
            <RippleReveal
              imageUrl="/rosh-placeholder.jpg"
              textElements={[
                // Desktop layout
                { text: "i am", x: 40, y: 200, size: 24, color: "#FFF", font: "Teko", fontWeight: 100 },
                { text: "ROSH", x: 600, y: 200, size: 30, color: "#FFF", font: "Teko", fontWeight: 100 },
                { text: "a", x: 1170, y: 200, size: 24, color: "#FFF", font: "Teko", fontWeight: 100 },
                { text: "DESIGN ENGINEER", x: 600, y: 300, size: 173, color: "#FE5454", font: "Teko", fontWeight: 700, letterSpacing: "1.04px" },
                { text: "\" A designer who isn't afraid of code. \"", x: 1080, y: 345, size: 16, color: "#FFF", font: "Teko", fontWeight: 50 },
                { text: "some crazy", x: 1125, y: 540, size: 24, color: "#FFF", font: "Big Shoulders Stencil Text", fontWeight: 100 },
                { text: "SHIT", x: 1096, y: 570, size: 24, color: "#FFF", font: "Big Shoulders Stencil Text", fontWeight: 700 },
              ]}
              iconElements={[{ icon: "/icons/down.png", x: 1165, y: 570, size: 24, color: "#FFF", isImage: true }]}
              chroma={0.002}
              decay={0.975}
              brushRadiusPxAt1440={lowPowerMode ? 80 : 140}
              rippleAmplitudePxAt1440={2.0}
              rippleFreq={26.0}
              rippleDamp={2.2}
              maxDPR={lowPowerMode ? 1 : 1.5}
              revealEnabled={revealEnabled}
              lowPowerMode={lowPowerMode}
              // Water ripple controls - adjust these values to tweak the effect
              waterRippleSensitivity={0.002}    // How sensitive to cursor movement (0.001 = very sensitive, 0.01 = less sensitive)
              waterRippleStrength={0.3}         // Maximum ripple strength (0.1 = very subtle, 1.0 = very strong)
              waterRippleRadius={0.08}          // Ripple size (0.05 = small, 0.2 = large)
              waterRippleLifetime={1500}        // How long ripples last in milliseconds (500 = quick, 3000 = long)
            />
          </Suspense>
        </Canvas>
      )}
    </section>
  );
}