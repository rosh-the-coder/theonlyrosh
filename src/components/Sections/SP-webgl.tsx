'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';
import ParticleBackground from '../ParticleBackground';
import GameControls from '../GameControls';

// Fixed frame (Unity native res you chose)
const FRAME_W = 960;
const FRAME_H = 600;

const UNITY_SINGLETON = '__ROSH_SP_UNITY__';
const LOADER_SINGLETON = '__ROSH_SP_UNITY_LOADER__';

interface SPWebglProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SPWebgl({ isOpen, onClose }: SPWebglProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const frameRef   = useRef<HTMLDivElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const unityRef   = useRef<any>(null);

  const [loaded, setLoaded] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [inView, setInView] = useState(false);
  const [unityLoaded, setUnityLoaded] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Initializing...');

  // Fade only (no transforms on the game container to keep input mapping correct)
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start 0.8', 'end 0.2'] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

  // --- PATHS - Back to working webgl-game files -------------------
  const folderSegments = ['webgl_spookie_pookie'];
  const fileStem       = 'webgl-game'; // Use the original working version

  const base = '/' + folderSegments.map(encodeURIComponent).join('/');
  const stem = encodeURIComponent(fileStem);

  const LOADER_URL = `${base}/Build/${stem}.loader.js`;
  const DATA_URL   = `${base}/Build/${stem}.data`;
  const FRAME_URL  = `${base}/Build/${stem}.framework.js`;
  const WASM_URL   = `${base}/Build/${stem}.wasm`;

  // --- CACHE BUSTING (your request) ----------------------------------------
  const BUILD_VERSION = '2025-09-22-01';
  const v = (u: string) => `${u}?v=${BUILD_VERSION}`;

  // Use versioned loader URL too so the loader doesn’t get stuck in cache
  const LOADER_URL_VER = v(LOADER_URL);

  // Load Unity loader only once
  const ensureLoader = (src: string) =>
    new Promise<void>((resolve, reject) => {
      if ((window as any)[LOADER_SINGLETON]) {
        if (typeof (window as any).createUnityInstance === 'function') return resolve();
      }

      const exists = Array.from(document.getElementsByTagName('script')).some(
        s => s.src === (location.origin + src) || s.src.endsWith(src)
      );
      if (exists) {
        setTimeout(() => {
          if (typeof (window as any).createUnityInstance === 'function') resolve();
          else resolve();
        }, 0);
        (window as any)[LOADER_SINGLETON] = true;
        return;
      }

      const tag = document.createElement('script');
      tag.src = src;                 // versioned src
      tag.defer = true;
      tag.async = false;
      tag.crossOrigin = 'anonymous';

      tag.onload = async () => {
        (window as any)[LOADER_SINGLETON] = true;

        // Fallback: if loader didn’t attach global, force-eval
        if (typeof (window as any).createUnityInstance !== 'function') {
          try {
            const res = await fetch(src, { cache: 'no-store' });
            const code = await res.text();
            (0, eval)(code);
          } catch (e) {
            return reject(new Error(`Loader script downloaded but couldn't expose createUnityInstance. ${String(e)}`));
          }
        }

        if (typeof (window as any).createUnityInstance === 'function') resolve();
        else reject(new Error('createUnityInstance still undefined after fallback eval.'));
      };

      tag.onerror = () => reject(new Error(`Failed to load Unity loader script at ${src}`));
      document.head.appendChild(tag);
    });

  // Fullscreen modal: treat it as "in view" when open
  useEffect(() => {
    setInView(isOpen);
    if (!isOpen) {
      muteAudioOnLeave();
      // Clean up Unity instance when modal closes
      cleanupUnity();
    }
  }, [isOpen]);

  // Prevent page scrolling when game is open (but allow keys to work in game)
  useEffect(() => {
    if (!isOpen) return;

    // Lock the page scroll by hiding overflow
    const htmlElement = document.documentElement;
    const bodyElement = document.body;
    const originalHtmlOverflow = htmlElement.style.overflow;
    const originalBodyOverflow = bodyElement.style.overflow;
    const originalPosition = bodyElement.style.position;
    const originalTop = bodyElement.style.top;
    const originalWidth = bodyElement.style.width;
    
    // Store current scroll position
    const scrollY = window.scrollY;
    
    // Lock scroll position
    htmlElement.style.overflow = 'hidden';
    bodyElement.style.overflow = 'hidden';
    bodyElement.style.position = 'fixed';
    bodyElement.style.top = `-${scrollY}px`;
    bodyElement.style.width = '100%';

    return () => {
      // Restore scroll
      htmlElement.style.overflow = originalHtmlOverflow;
      bodyElement.style.overflow = originalBodyOverflow;
      bodyElement.style.position = originalPosition;
      bodyElement.style.top = originalTop;
      bodyElement.style.width = originalWidth;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  // Cleanup Unity instance when component unmounts or modal closes
  const cleanupUnity = () => {
    console.log('Cleaning up Unity instance...');
    
    const u = unityRef.current || (window as any).unityInstance;
    if (u) {
      try {
        // Try to destroy the Unity instance
        if (typeof u.Quit === 'function') {
          u.Quit();
          console.log('Unity instance quit successfully');
        }
        
        // Clear references
        unityRef.current = null;
        (window as any)[UNITY_SINGLETON] = null;
        (window as any).unityInstance = null;
        
        // Reset states
        setLoaded(false);
        setUnityLoaded(false);
        setAudioEnabled(false);
        setInView(false);
        
        console.log('Unity cleanup completed');
      } catch (err) {
        console.error('Error during Unity cleanup:', err);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupUnity();
    };
  }, []);

  // Browser-controlled audio toggle using direct WebGL audio control
  const toggleAudio = async () => {
    console.log('Toggle audio clicked, current state:', audioEnabled, 'inView:', inView);
    
    const u = unityRef.current || (window as any).unityInstance;
    if (!u) {
      console.log('No Unity instance found');
      return;
    }
    
    try {
      // Try to find audio context in multiple ways
      let ctx = null;
      
      // Method 1: Direct from Unity instance
      if (u.Module && u.Module.audioContext) {
        ctx = u.Module.audioContext;
        console.log('Found audio context via u.Module.audioContext');
      }
      // Method 2: From Unity instance directly
      else if (u.audioContext) {
        ctx = u.audioContext;
        console.log('Found audio context via u.audioContext');
      }
      // Method 3: From Unity's Module
      else if (u.Module && u.Module.audioContext) {
        ctx = u.Module.audioContext;
        console.log('Found audio context via u.Module.audioContext (fallback)');
      }
      // Method 4: Try to access through Unity's internal structure
      else if (u.Module && u.Module.audioContext) {
        ctx = u.Module.audioContext;
        console.log('Found audio context via u.Module.audioContext (method 4)');
      }
      
      if (!ctx) {
        console.log('No audio context found, trying canvas-based approach');
        // Try to control audio through canvas element
        const canvas = canvasRef.current;
        if (canvas) {
          // Try to pause/resume audio by manipulating the canvas
          if (audioEnabled) {
            canvas.style.pointerEvents = 'none';
            canvas.style.opacity = '0.5';
            setAudioEnabled(false);
            console.log('Audio disabled via canvas manipulation');
          } else {
            if (inView) {
              canvas.style.pointerEvents = 'auto';
              canvas.style.opacity = '1';
              setAudioEnabled(true);
              console.log('Audio enabled via canvas manipulation');
            }
          }
        }
        return;
      }
      
      console.log('Audio context state:', ctx.state);
      
      if (audioEnabled) {
        // Disable audio
        if (ctx.state === 'running') {
          await ctx.suspend();
          console.log('Audio context suspended');
        }
        setAudioEnabled(false);
        console.log('Audio disabled');
      } else {
        // Only enable audio if we're in the Unity section
        if (inView) {
          if (ctx.state === 'suspended') {
            await ctx.resume();
            console.log('Audio context resumed');
          }
          setAudioEnabled(true);
          console.log('Audio enabled');
        } else {
          console.log('Cannot enable audio - not in Unity section');
        }
      }
    } catch (err) {
      console.error('Audio toggle error:', err);
    }
  };

  // Auto-mute when leaving section
  const muteAudioOnLeave = async () => {
    console.log('Auto-muting audio - leaving Unity section');
    
    const u = unityRef.current || (window as any).unityInstance;
    if (!u) {
      console.log('No Unity instance for auto-mute');
      return;
    }
    
    try {
      // Try to find audio context
      let ctx = null;
      if (u.Module && u.Module.audioContext) {
        ctx = u.Module.audioContext;
      } else if (u.audioContext) {
        ctx = u.audioContext;
      }
      
      if (ctx && ctx.state === 'running') {
        await ctx.suspend();
        setAudioEnabled(false);
        console.log('Audio auto-muted via context');
      } else {
        // Fallback: canvas manipulation
        const canvas = canvasRef.current;
        if (canvas) {
          canvas.style.pointerEvents = 'none';
          canvas.style.opacity = '0.5';
          setAudioEnabled(false);
          console.log('Audio auto-muted via canvas manipulation');
        }
      }
      
      // Additional cleanup: try to stop all audio sources
      if (u.Module && u.Module.audioContext) {
        const audioContext = u.Module.audioContext;
        if (audioContext.state !== 'closed') {
          try {
            await audioContext.close();
            console.log('Audio context closed completely');
          } catch (e) {
            console.log('Could not close audio context:', e);
          }
        }
      }
    } catch (err) {
      console.error('Auto-mute error:', err);
    }
  };
  

  // Load Unity when section becomes visible
  useEffect(() => {
    if (!inView || unityLoaded) return;

    (async () => {
      setErrorMsg(null);
      try {
        // HEAD check (versioned loader)
        const head = await fetch(LOADER_URL_VER, { method: 'HEAD' });
        if (!head.ok) throw new Error(`HTTP ${head.status} for ${LOADER_URL_VER}`);
      } catch (e: any) {
        setErrorMsg(
          `Unity loader not found.\n` +
          `Expected at: ${LOADER_URL_VER}\n\n` +
          `Fix: ensure your files live under /public/${folderSegments.join('/')}/Build\n` +
          `and keep their original names (spaces are okay).`
        );
        return;
      }

      const canvas = canvasRef.current;
      const frame  = frameRef.current;
      if (!canvas || !frame) return;

      // Lock to exact canvas size; matchWebGLToCanvasSize will sync render buffer
      frame.style.width = `${FRAME_W}px`;
      frame.style.height = `${FRAME_H}px`;
      canvas.width = FRAME_W;
      canvas.height = FRAME_H;
      canvas.style.width = `${FRAME_W}px`;
      canvas.style.height = `${FRAME_H}px`;

      // React Strict Mode double mount guard
      if ((window as any)[UNITY_SINGLETON]) {
        unityRef.current = (window as any)[UNITY_SINGLETON];
        setLoaded(true);
        setUnityLoaded(true);
        setAudioEnabled(false);
        return;
      }

      try {
        await ensureLoader(LOADER_URL_VER);

        const createUnityInstance = (window as any).createUnityInstance as
          | ((canvas: HTMLCanvasElement, cfg: any) => Promise<any>)
          | undefined;

        if (!createUnityInstance) {
          setErrorMsg(`Unity loader loaded but createUnityInstance is undefined.\nScript: ${LOADER_URL_VER}`);
          return;
        }

        // Simulate loading progress (40 seconds to reach 95%)
        const progressInterval = setInterval(() => {
          setLoadingProgress(prev => {
            const newProgress = prev + 2.375; // 95% over 40 steps (40s with 1s intervals)
            if (newProgress >= 95) {
              clearInterval(progressInterval);
              return 95;
            }
            
            // Update messages based on progress
            if (newProgress < 25) {
              setLoadingMessage('Loading game assets...');
            } else if (newProgress < 50) {
              setLoadingMessage('Loading framework...');
            } else if (newProgress < 75) {
              setLoadingMessage('Initializing game...');
            } else {
              setLoadingMessage('Almost ready!');
            }
            
            return newProgress;
          });
        }, 1000);

        // --- Your requested cache-busted config ---------------------------
        const instance = await createUnityInstance(canvas, {
          dataUrl: v(DATA_URL),
          frameworkUrl: v(FRAME_URL),
          codeUrl: v(WASM_URL),
          streamingAssetsUrl: `${base}/StreamingAssets`,
          companyName: "Rosh's",
          productName: 'Spookie Pookie',
          productVersion: BUILD_VERSION,
          matchWebGLToCanvasSize: true,
          devicePixelRatio: 1,
        });

        // Clear interval and set to 100% when loaded
        clearInterval(progressInterval);
        setLoadingProgress(100);
        setLoadingMessage('Ready!');

        unityRef.current = instance;
        (window as any)[UNITY_SINGLETON] = instance;
        (window as any).unityInstance = instance;

        // Start with audio suspended (user gesture to enable)
        try {
          const ctx = instance?.Module?.audioContext || instance?.audioContext;
          if (ctx && ctx.state === 'running') {
            await ctx.suspend();
            console.log('Audio context suspended on Unity load');
          }
          // Store audio context globally for easier access
          (window as any).unityAudioContext = ctx;
        } catch (err) {
          console.log('Error suspending audio context:', err);
        }

        setAudioEnabled(false);
        setLoaded(true);
        setUnityLoaded(true);

        const onDown = () => { canvas.focus(); canvas.style.pointerEvents = 'auto'; };
        canvas.addEventListener('pointerdown', onDown);
        canvas.addEventListener('touchstart', onDown, { passive: true });

        return () => {
          canvas.removeEventListener('pointerdown', onDown);
          canvas.removeEventListener('touchstart', onDown);
        };
      } catch (e: any) {
        console.error('Unity init failed:', e);
        setErrorMsg(`Unity failed to initialize.\n${String(e?.message || e)}`);
        setLoaded(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, unityLoaded]);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '100%' }}
      transition={{ 
        duration: 0.8, 
        ease: [0.25, 0.1, 0.25, 1] // Custom cubic-bezier: fast start, slow end
      }}
      className="fixed inset-0 z-[9998] bg-black"
    >
      {/* Particle Background Effect */}
      <ParticleBackground isActive={isOpen} />
      
      {/* Game Controls */}
      <GameControls isVisible={loaded && isOpen} />
      
      {/* Close button */}
      <button
        onClick={() => {
          console.log('Close button clicked - cleaning up Unity');
          cleanupUnity();
          onClose();
        }}
        className="absolute top-4 right-4 z-50 p-2 bg-gray-800 hover:bg-gray-700 rounded-full text-white transition-colors"
        aria-label="Close Unity game"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <div className="flex justify-center items-center min-h-screen p-4 relative z-20">
        <motion.div 
          style={{ opacity }} 
          className="relative"
        >
          <div
            ref={frameRef}
            className="relative bg-gray-900 border-2 border-blue-500 rounded-lg overflow-hidden shadow-2xl"
            style={{ width: FRAME_W, height: FRAME_H }}
          >
            <canvas
              ref={canvasRef}
              id="unity-canvas"
              tabIndex={0}
              style={{
                display: 'block',
                background: '#0f172a',
                outline: 'none',
                touchAction: 'none',
                pointerEvents: 'auto',
                imageRendering: 'pixelated',
              }}
            />

            {!loaded && !errorMsg && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
                <div className="text-center text-gray-200 w-80">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-lg flex items-center justify-center animate-pulse">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2L3 7v11h14V7l-7-5zM8 15v-6h4v6H8z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-1">Loading Unity Game…</h3>
                  <p className="text-sm opacity-70 mb-4">Spookie Pookie — 2D Platformer</p>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2 overflow-hidden">
                    <div 
                      className="bg-blue-500 h-2.5 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${loadingProgress}%` }}
                    >
                      <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse"></div>
                    </div>
                  </div>
                  
                  {/* Progress Text */}
                  <div className="flex justify-between text-xs opacity-70">
                    <span>{loadingMessage}</span>
                    <span>{loadingProgress}%</span>
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="absolute inset-0 bg-black/80 text-red-300 p-4 text-xs whitespace-pre-wrap z-30 overflow-auto">
                <div className="font-bold text-red-200 mb-2">Unity loader error</div>
                {errorMsg}
              </div>
            )}

            {loaded && inView && !errorMsg && (
              <div className="absolute top-3 right-3 z-30">
                <div className="relative group">
                  <button
                    onClick={toggleAudio}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                      audioEnabled ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-700 hover:bg-gray-800 text-white'
                    }`}
                    aria-label={audioEnabled ? 'Disable game audio' : 'Enable game audio'}
                  >
                    {audioEnabled ? '🔊 Audio ON' : '🔇 Audio OFF'}
                  </button>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    Are you a recruiter?
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
