"use client";
import { useEffect, useRef } from 'react';
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

// Video editing project covers - replace with your actual video thumbnails
const VIDEO_COVERS = [
  "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1594736797933-d0f37c4b47c3?w=400&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1594736797933-d0f37c4b47c3?w=400&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400&h=400&fit=crop&crop=center",
  "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=400&h=400&fit=crop&crop=center",
];

export default function VideoEditing() {
  const boxesRef = useRef<HTMLDivElement>(null);
  const dragProxyRef = useRef<HTMLDivElement>(null);

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
      if (BOX && window.linearCarousel) {
        let TARGET = boxes.indexOf(BOX);
        let CURRENT = gsap.utils.wrap(
          0,
          boxes.length,
          Math.floor(boxes.length * (Number(window.linearCarousel.SCRUB.vars.position) || 0))
        );
        let BUMP = TARGET - CURRENT;
        if (TARGET > CURRENT && TARGET - CURRENT > boxes.length * 0.5) {
          BUMP = (boxes.length - BUMP) * -1;
        }
        if (CURRENT > TARGET && CURRENT - TARGET > boxes.length * 0.5) {
          BUMP = boxes.length + BUMP;
        }
        window.linearCarousel.scrollToPosition((Number(window.linearCarousel.SCRUB.vars.position) || 0) + BUMP * (1 / boxes.length));
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
        {VIDEO_COVERS.map((cover, index) => (
          <div
            key={index}
            className="video-box h-80 w-80 min-h-[200px] min-w-[200px] rounded-xl cursor-pointer transition-transform duration-300 hover:scale-105"
            style={{
              backgroundImage: `url(${cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: index % 2 === 0 ? 'hsl(90, 80%, 70%)' : 'hsl(90, 80%, 40%)',
              borderRadius: '12px'
            }}
          >
            <span className="sr-only">{index + 1}</span>
            <img 
              src={cover} 
              alt={`Video project ${index + 1}`}
              className="absolute h-full w-full top-0 left-0 object-cover rounded-xl"
              style={{ borderRadius: '12px' }}
            />
          </div>
        ))}
      </div>



      {/* Drag Proxy */}
      <div 
        ref={dragProxyRef}
        className="drag-proxy invisible absolute"
      />

      {/* Video Editing Title */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10">
        <h1 className="text-6xl font-bold text-white font-teko tracking-wider">
          VIDEO EDITING
        </h1>
        <p className="text-xl text-gray-300 text-center mt-4 font-light">
          Creative Motion & Visual Storytelling
        </p>
      </div>
    </section>
  );
}
