"use client";
import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Draggable } from 'gsap/Draggable';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  gsap.registerPlugin(Draggable);
}

// Extend Window interface for linearCarousel
declare global {
  interface Window {
    linearCarousel?: {
      LOOP: gsap.core.Timeline;
      LOOP_HEAD: gsap.core.Timeline;
      SCRUB: gsap.core.Tween & { vars: { position: number } };
      TRIGGER: ScrollTrigger | null;
      NEXT: () => void;
      PREV: () => void;
      scrollToPosition: (position: number) => void;
    };
  }
}

// Video editing project covers - Videos hosted on Cloudflare R2 CDN
const R2_CDN = "https://pub-14e70177217f4d5481f61d1335a55a75.r2.dev";
const VIDEO_COVERS = [
  { src: encodeURI("/video editing/video covers/1. Film Grains.png"), name: "Film Grains", video: `${R2_CDN}/1.%20Film%20Grains.mp4` },
  { src: encodeURI("/video editing/video covers/2. Wake Up.png"), name: "Wake Up", video: `${R2_CDN}/2.%20Wake%20Up.mp4` },
  { src: encodeURI("/video editing/video covers/3. Flashback.png"), name: "Flashback", video: `${R2_CDN}/3.%20Flashback.mp4` },
  { src: encodeURI("/video editing/video covers/4. Vesper.png"), name: "Vesper", video: `${R2_CDN}/4.%20Vesper.mp4` },
  { src: encodeURI("/video editing/video covers/5. Chanel.png"), name: "Chanel", video: `${R2_CDN}/5.%20Chanel.mp4` },
  { src: encodeURI("/video editing/video covers/6. Mayhem.png"), name: "Mayhem", video: `${R2_CDN}/6.%20Mayhem.mp4` },
  { src: encodeURI("/video editing/video covers/7. Spacing Out.png"), name: "Spacing Out", video: `${R2_CDN}/7.%20Spacing%20Out.mp4` },
  { src: encodeURI("/video editing/video covers/8. Waves.png"), name: "Waves", video: `${R2_CDN}/8.%20Waves.mp4` },
  { src: encodeURI("/video editing/video covers/9. Skateboard P.PNG"), name: "Skateboard P", video: `${R2_CDN}/9.%20Skateboard%20P.mp4` },
  { src: encodeURI("/video editing/video covers/10. Self Control.png"), name: "Self Control", video: `${R2_CDN}/10.%20Self%20Control.MOV` },
  { src: encodeURI("/video editing/video covers/11. Vroom.png"), name: "Vroom", video: `${R2_CDN}/11.%20Vroom.mp4` },
  { src: encodeURI("/video editing/video covers/12. Sonic Boom.png"), name: "Sonic Boom", video: `${R2_CDN}/12.%20Sonic%20Boom.m4v` },
];

export default function VideoEditing() {
  const boxesRef = useRef<HTMLDivElement>(null);
  const dragProxyRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  
  // Video player state
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<{src: string, name: string, video: string} | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [imagesRevealed, setImagesRevealed] = useState(false);

  // Video player functions
  const openVideo = (video: {src: string, name: string, video: string}) => {
    console.log('Opening video:', video.name, video.video);
    setCurrentVideo(video);
    setIsVideoOpen(true);
    setIsPlaying(true); // Set to true immediately
    setCurrentTime(0);
    setVolume(1);
    setDuration(0);
    
    // Hide bottom nav when video opens
    const event = new CustomEvent('work-section-visibility', {
      detail: { isVisible: true }
    });
    window.dispatchEvent(event);
  };

  const closeVideo = () => {
    setIsVideoOpen(false);
    setCurrentVideo(null);
    setIsPlaying(false);
    
    // Show bottom nav when video closes
    const event = new CustomEvent('work-section-visibility', {
      detail: { isVisible: false }
    });
    window.dispatchEvent(event);
  };

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(err => console.error('Toggle play error:', err));
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (videoRef.current && progressRef.current) {
      const rect = progressRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      const newTime = (clickX / width) * duration;
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Auto-play video when it opens
  useEffect(() => {
    if (isVideoOpen && videoRef.current && isPlaying) {
      videoRef.current.muted = false; // Unmute the video
      videoRef.current.volume = volume; // Set the volume
      videoRef.current.play().catch(console.error);
    }
  }, [isVideoOpen, isPlaying, volume]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const boxes = gsap.utils.toArray('.video-box');
    const STAGGER = 0.1;
    const DURATION = 1;
    const OFFSET = 0;
    const TOTAL_BOXES = boxes.length;
    const RADIUS = 400; // Radius of the circular carousel
    const ANGLE_STEP = (Math.PI * 2) / TOTAL_BOXES;

    let isCircularPhase = true;
    let currentRotation = 0;

    // Set up initial positions - start closed and centered
    gsap.set(boxes, {
      x: 0,
      y: 0,
      z: 0,
      rotationY: 0,
      rotationX: 0,
      rotationZ: 0,
      transformOrigin: 'center center',
      opacity: 0,
      scale: 0,
      display: 'block',
      zIndex: 1,
    });

    // Phase 1: Circular Animation (3 seconds total)
    const CIRCULAR_PHASE = gsap.timeline();
    
    // Step 1: Open up into circular formation (1 second)
    CIRCULAR_PHASE.to(boxes, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power2.out',
    });

    // Step 2: Arrange into circle (0.5 seconds)
    CIRCULAR_PHASE.to(boxes, {
      x: (i: number) => Math.cos(i * ANGLE_STEP) * RADIUS,
      z: (i: number) => Math.sin(i * ANGLE_STEP) * RADIUS,
      rotationY: (i: number) => (i * ANGLE_STEP * 180) / Math.PI,
      duration: 0.5,
      ease: 'power2.inOut',
    }, 0.8);

    // Step 3: Continuous rotation for 1.5 seconds
    CIRCULAR_PHASE.to(boxes, {
      rotationY: '+=360',
      duration: 1.5,
      ease: 'none',
      transformOrigin: 'center center',
    }, 1.3);

    // Phase 2: Smooth Transition to Linear Layout (after 3 seconds)
    CIRCULAR_PHASE.call(() => {
      isCircularPhase = false;
      
      // Create a smooth flowing transition sequence
      const transitionSequence = gsap.timeline();
      
      // Step 1: Bring all boxes to center while maintaining visibility
      transitionSequence.to(boxes, {
        x: 0,
        y: 0,
        z: 0,
        rotationY: 0,
        rotationX: 0,
        rotationZ: 0,
        scale: 0.8, // Slightly smaller for smooth transition
        duration: 0.6,
        ease: 'power2.inOut',
      });
      
      // Step 2: Arrange them in a horizontal line (pre-CodePen state)
      transitionSequence.to(boxes, {
        x: (i: number) => (i - boxes.length / 2) * 320, // Spread horizontally
        y: 0,
        z: 0,
        scale: 0.9,
        opacity: 0.7,
        duration: 0.4,
        ease: 'power2.out',
      }, 0.6);
      
      // Step 3: Final preparation for CodePen (slight scale and opacity adjustment)
      transitionSequence.to(boxes, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power2.out',
      }, 1.0);

      // Set up linear carousel after smooth transition
      setTimeout(() => {
        setupLinearCarousel();
        // Reveal images after animations complete
        setTimeout(() => {
          setImagesRevealed(true);
        }, 500);
      }, 1300); // Wait for the full transition sequence
    }, [], 2.8);

    function setupLinearCarousel() {
      // Transition smoothly from horizontal line to CodePen layout
      gsap.to(boxes, {
        yPercent: -50,
        x: 0, // Reset x position for CodePen logic
        z: 0,
        transformOrigin: 'center center',
        duration: 0.5,
        ease: 'power2.inOut',
      });

      // Create the main loop timeline (original CodePen logic)
      const LOOP = gsap.timeline({
        paused: true,
        repeat: -1,
        ease: 'none',
      });

      const SHIFTS = [...boxes, ...boxes, ...boxes];

      SHIFTS.forEach((BOX: any, index: number) => {
        const BOX_TL = gsap
          .timeline()
          .set(BOX, {
            xPercent: 250,
            rotateY: -50,
            opacity: 0,
            scale: 0.5,
          })
          // Opacity && Scale
          .to(
            BOX,
            {
              opacity: 1,
              scale: 1,
              duration: 0.1,
            },
            0
          )
          .to(
            BOX,
            {
              opacity: 0,
              scale: 0.5,
              duration: 0.1,
            },
            0.9
          )
          // Panning
          .fromTo(
            BOX,
            {
              xPercent: 250,
            },
            {
              xPercent: -350,
              duration: 1,
              immediateRender: false,
              ease: 'power1.inOut',
            },
            0
          )
          // Rotations
          .fromTo(
            BOX,
            {
              rotateY: -50,
            },
            {
              rotateY: 50,
              immediateRender: false,
              duration: 1,
              ease: 'power4.inOut',
            },
            0
          )
          // Scale && Z
          .to(
            BOX,
            {
              z: 100,
              scale: 1.25,
              duration: 0.1,
              repeat: 1,
              yoyo: true,
            },
            0.4
          )
          .fromTo(
            BOX,
            {
              zIndex: 1,
            },
            {
              zIndex: boxes.length,
              repeat: 1,
              yoyo: true,
              ease: 'none',
              duration: 0.5,
              immediateRender: false,
            },
            0
          );
        LOOP.add(BOX_TL, index * STAGGER);
      });

      const CYCLE_DURATION = STAGGER * boxes.length;
      const START_TIME = CYCLE_DURATION + DURATION * 0.5 + OFFSET;

       const LOOP_HEAD = gsap.fromTo(
         LOOP,
         {
           totalTime: START_TIME,
         },
         {
           totalTime: `+=${CYCLE_DURATION}`,
           duration: 1,
           ease: 'none',
           repeat: -1,
           paused: true, // Keep paused - only user input will control this
         }
       ) as unknown as gsap.core.Timeline;

      const PLAYHEAD = {
        position: 0,
      };

      const POSITION_WRAP = gsap.utils.wrap(0, LOOP_HEAD.duration());

       const SCRUB = gsap.to(PLAYHEAD, {
         position: 0,
         onUpdate: () => {
           LOOP_HEAD.totalTime(POSITION_WRAP(PLAYHEAD.position));
         },
         paused: true, // Paused by default - only user input will trigger this
         duration: 0.25,
         ease: 'power3',
       }) as gsap.core.Tween & { vars: { position: number } };

       let iteration = 0;
       // Disabled scroll trigger - no mouse scroll functionality
       const TRIGGER = null;

      const WRAP = (iterationDelta: number, scrollTo: number) => {
        iteration += iterationDelta;
        // Scroll functionality disabled
      };

      const SNAP = gsap.utils.snap(1 / boxes.length);

      const progressToScroll = (progress: number) => {
        // Scroll functionality disabled
        return 0;
      };

      const scrollToPosition = (position: number) => {
        // Scroll functionality disabled - only manual controls work
        const SNAP_POS = SNAP(position);
        const NEW_POS = SNAP_POS;
        SCRUB.vars.position = NEW_POS;
        SCRUB.invalidate().restart();
      };

      // Scroll event listener removed - no scroll functionality

      const NEXT = () => scrollToPosition((Number(SCRUB.vars.position) || 0) - 1 / boxes.length);
      const PREV = () => scrollToPosition((Number(SCRUB.vars.position) || 0) + 1 / boxes.length);

      // Store references for cleanup
      window.linearCarousel = {
        LOOP,
        LOOP_HEAD,
        SCRUB,
        TRIGGER: null, // Scroll functionality disabled
        NEXT,
        PREV,
        scrollToPosition,
      };

       // Don't start automatic animation - CodePen state should be user-controlled only
       // LOOP_HEAD.play(); // Removed - now purely interactive
    }

    // Global event handlers that work for both phases
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isCircularPhase) return; // Don't handle during circular phase
      
      if (window.linearCarousel) {
        if (event.code === 'ArrowLeft' || event.code === 'KeyA') window.linearCarousel.NEXT();
        if (event.code === 'ArrowRight' || event.code === 'KeyD') window.linearCarousel.PREV();
      }
    };

    const handleBoxClick = (e: Event) => {
      if (isCircularPhase) return; // Don't handle during circular phase
      
      const target = e.target as HTMLElement;
      const BOX = target.closest('.video-box');
      if (BOX) {
        const index = boxes.indexOf(BOX);
        if (index !== -1 && VIDEO_COVERS[index]) {
          openVideo(VIDEO_COVERS[index]);
        }
      }
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    boxesRef.current?.addEventListener('click', handleBoxClick);

    // Dragging functionality (only for linear phase)
    if (dragProxyRef.current) {
      Draggable.create('.drag-proxy', {
        type: 'x',
        trigger: '.video-box',
        onPress() {
          if (isCircularPhase || !window.linearCarousel) return;
          (this as any).startOffset = window.linearCarousel.SCRUB.vars.position;
        },
        onDrag() {
          if (isCircularPhase || !window.linearCarousel) return;
          window.linearCarousel.SCRUB.vars.position = (this as any).startOffset + ((this as any).startX - (this as any).x) * 0.001;
          window.linearCarousel.SCRUB.invalidate().restart();
        },
        onDragEnd() {
          if (isCircularPhase || !window.linearCarousel) return;
          window.linearCarousel.scrollToPosition(Number(window.linearCarousel.SCRUB.vars.position) || 0);
        },
      });
    }


    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      boxesRef.current?.removeEventListener('click', handleBoxClick);
      
      if (window.linearCarousel) {
        if (window.linearCarousel.TRIGGER) {
          window.linearCarousel.TRIGGER.kill();
        }
        window.linearCarousel.LOOP.kill();
        window.linearCarousel.LOOP_HEAD.kill();
        window.linearCarousel.SCRUB.kill();
      }
      
      CIRCULAR_PHASE.kill();
    };
  }, []);

  return (
    <section className="relative h-[100svh] bg-[#0B0B0B] overflow-hidden">
      {/* Video Boxes Container */}
      <div 
        ref={boxesRef}
        className="video-boxes h-screen w-full overflow-hidden absolute transform-style-preserve-3d perspective-800 touch-none"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '800px',
          touchAction: 'none'
        }}
      >
        {VIDEO_COVERS.map((video, index) => (
          <div
            key={index}
            className="video-box h-80 w-80 min-h-[200px] min-w-[200px] rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 group relative overflow-hidden hover:border-2 hover:border-white hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.3)]"
            style={{
              backgroundColor: '#000000',
              borderRadius: '12px'
            }}
          >
            <Image 
              src={video.src} 
              alt={video.name}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              quality={85}
              priority={false}
              className={`object-cover rounded-xl transition-all duration-500 group-hover:blur-sm ${
                imagesRevealed ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ borderRadius: '12px' }}
            />
            
            {/* Video name overlay - appears on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
              <h3 className="text-white text-lg md:text-xl lg:text-2xl font-teko font-normal text-center px-2 md:px-4">
                {video.name}
              </h3>
            </div>
            
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 rounded-xl"></div>
          </div>
        ))}
      </div>



      {/* Drag Proxy */}
      <div 
        ref={dragProxyRef}
        className="drag-proxy invisible absolute"
      />

      {/* Video Editing Title */}
      <div className="absolute top-12 md:top-20 left-1/2 transform -translate-x-1/2 z-10 px-4 md:px-0 max-w-[90vw] md:max-w-none">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-teko tracking-wider text-center">
          VIDEO EDITING
        </h1>
         <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 text-center mt-2 md:mt-0 font-teko px-2 md:px-0 leading-tight">
          Creative Motion & Visual Storytelling. I love to travel, and document my experiences in unique and narrative formats to reflect my personality in my videos.
        </p>
      </div>

      {/* See My Work Button */}
      <div className="fixed bottom-4 md:bottom-6 right-4 md:right-6 z-[9999] pointer-events-auto">
        <button
          onClick={() => window.open('https://roshanedits.myportfolio.com/two-blokes-trading', '_blank')}
          className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-2 md:px-6 md:py-3 text-white font-teko font-normal text-base md:text-lg hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300 hover:scale-105"
        >
          See my work
        </button>
      </div>

       {/* Video Player Modal */}
       {isVideoOpen && currentVideo && (
         <div 
           className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md"
           onClick={closeVideo}
         >
           <div 
             className="relative w-full max-w-md mx-4"
             onClick={(e) => e.stopPropagation()}
           >
            {/* Close Button */}
            <button
              onClick={closeVideo}
              className="absolute -top-12 right-0 text-white text-2xl hover:text-gray-300 transition-colors"
            >
              ✕
            </button>
            
            {/* Video Container */}
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '9/16' }}>
              {currentVideo && (
                <video
                  ref={videoRef}
                  key={currentVideo.video}
                  src={currentVideo.video}
                  className="w-full h-full object-cover"
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                  playsInline
                  autoPlay
                  loop
                />
              )}
              
              {/* Video Controls Overlay */}
              <div className="absolute inset-0 flex flex-col justify-between p-3 md:p-4 bg-gradient-to-t from-black/60 via-transparent to-black/60">
                {/* Top - Video Title */}
                <div className="text-center">
                  <h3 className="text-white text-lg md:text-xl font-teko font-normal">
                    {currentVideo.name}
                  </h3>
                </div>
                
                {/* Bottom - Controls */}
                <div className="space-y-2 md:space-y-3">
                  {/* Progress Bar */}
                  <div
                    ref={progressRef}
                    onClick={handleProgressClick}
                    className="w-full h-2 bg-white/30 rounded-full cursor-pointer"
                  >
                    <div
                      className="h-full bg-white rounded-full transition-all duration-100"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                  
                  {/* Time Display */}
                  <div className="flex justify-between text-white text-xs md:text-sm">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  
                  {/* Control Buttons */}
                  <div className="flex items-center justify-between">
                    {/* Play/Pause Button */}
                    <button
                      onClick={togglePlayPause}
                      className="text-white hover:text-gray-300 transition-colors text-3xl md:text-4xl"
                    >
                      {isPlaying ? '⏸️' : '▶️'}
                    </button>
                    
                    {/* Volume Control */}
                    <div className="flex items-center space-x-2">
                      <span className="text-white text-xs md:text-sm">🔊</span>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-16 md:w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, white 0%, white ${volume * 100}%, rgba(255,255,255,0.3) ${volume * 100}%, rgba(255,255,255,0.3) 100%)`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
