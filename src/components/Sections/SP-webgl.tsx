'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useEffect, useRef, useState } from 'react';

type SizingMode = 'fixed' | 'contain';

const GAME_WIDTH = 670;
const GAME_HEIGHT = 418;
const DPR_CAP = 1.75;
const UNITY_KEY = '__ROSH_SP_UNITY__';      // singleton
const LOADER_KEY = '__ROSH_SP_UNITY_LOADER__';

export default function SPWebgl() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const unityRef = useRef<any>(null);

  const [loaded, setLoaded] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);

  // scroll anim
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 0.8', 'end 0.2'] });
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, -50]);

  const sizingMode: SizingMode = 'fixed'; // 'fixed' for exact 670x418

  // ---- helpers ----
  const layoutCanvas = () => {
    const canvas = canvasRef.current;
    const wrap = containerRef.current;
    if (!canvas || !wrap) return;

    if (sizingMode === 'fixed') {
      canvas.style.width = `${GAME_WIDTH}px`;
      canvas.style.height = `${GAME_HEIGHT}px`;
      return;
    }

    const cw = wrap.clientWidth;
    const ch = Math.max(1, wrap.clientHeight);
    const scale = Math.min(cw / GAME_WIDTH, ch / GAME_HEIGHT);
    const cssW = Math.round(GAME_WIDTH * scale);
    const cssH = Math.round(GAME_HEIGHT * scale);
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
  };

  const ensureLoader = (src: string) =>
    new Promise<void>((resolve, reject) => {
      // if already loaded, resolve
      // @ts-ignore
      if ((window as any)[LOADER_KEY]) return resolve();

      const existing = Array.from(document.getElementsByTagName('script')).find(
        s => s.src === location.origin + src || s.src.endsWith(src)
      );
      if (existing) {
        // @ts-ignore
        (window as any)[LOADER_KEY] = true;
        return resolve();
      }
      const s = document.createElement('script');
      s.src = src;
      s.async = true;
      s.onload = () => {
        // @ts-ignore
        (window as any)[LOADER_KEY] = true;
        resolve();
      };
      s.onerror = (e) => reject(e);
      document.body.appendChild(s);
    });

  const tryResumeAudioAndFocus = async () => {
    const c = canvasRef.current;
    if (c) c.focus();
    const u = unityRef.current;
    try {
      const ctx = u?.Module?.audioContext || u?.audioContext;
      if (ctx && ctx.state && ctx.state !== 'running') {
        await ctx.resume?.();
      }
      setNeedsGesture(false);
    } catch {}
  };

  // ---- init once (dev-safe) ----
  useEffect(() => {
    const base = `/${encodeURIComponent('webgl_spookie pookie')}`;
    const stem = encodeURIComponent('webgl 21-09-2025');

    const LOADER_URL = `${base}/Build/${stem}.loader.js`;
    const DATA_URL   = `${base}/Build/${stem}.data`;
    const FRAME_URL  = `${base}/Build/${stem}.framework.js`;
    const WASM_URL   = `${base}/Build/${stem}.wasm`;

    let ro: ResizeObserver | null = null;

    (async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      layoutCanvas();

      // Reuse an existing instance if present (prevents Strict-Mode double init)
      // @ts-ignore
      if ((window as any)[UNITY_KEY]) {
        unityRef.current = (window as any)[UNITY_KEY];
        setLoaded(true);
        setNeedsGesture(false);
        return; // already running
      }

      // load loader (only once)
      await ensureLoader(LOADER_URL);

      const createUnityInstance = (window as any).createUnityInstance as
        | ((canvas: HTMLCanvasElement, cfg: any) => Promise<any>)
        | undefined;

      if (!createUnityInstance) {
        console.error('Unity loader not found. URL:', LOADER_URL);
        return;
      }

      try {
        const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);

        // Initial width/height attributes won’t hurt; Unity will sync to CSS anyway
        canvas.width  = Math.round((parseFloat(getComputedStyle(canvas).width)  || GAME_WIDTH)  * dpr);
        canvas.height = Math.round((parseFloat(getComputedStyle(canvas).height) || GAME_HEIGHT) * dpr);

        const instance = await createUnityInstance(canvas, {
          dataUrl: DATA_URL,
          frameworkUrl: FRAME_URL,
          codeUrl: WASM_URL,
          streamingAssetsUrl: `${base}/StreamingAssets`,
          companyName: "Rosh's",
          productName: 'Spookie Pookie',
          productVersion: '1.0',
          matchWebGLToCanvasSize: true,
          devicePixelRatio: dpr,
        });

        unityRef.current = instance;
        // @ts-ignore
        (window as any)[UNITY_KEY] = instance;

        setLoaded(true);

        // audio policy?
        const ctx = instance?.Module?.audioContext || instance?.audioContext;
        if (ctx && ctx.state && ctx.state !== 'running') setNeedsGesture(true);

        // resize reactions
        ro = new ResizeObserver(() => layoutCanvas());
        if (containerRef.current) ro.observe(containerRef.current);
        window.addEventListener('orientationchange', layoutCanvas);
        window.addEventListener('resize', layoutCanvas);

        // focus & audio resume on first gesture
        const onDown = () => tryResumeAudioAndFocus();
        canvas.addEventListener('pointerdown', onDown);
        canvas.addEventListener('touchstart', onDown, { passive: true });

        // cleanup on real unmount (don’t quit in dev re-renders)
        return () => {
          canvas.removeEventListener('pointerdown', onDown);
          canvas.removeEventListener('touchstart', onDown);
        };
      } catch (err) {
        console.error('Unity init failed:', err);
        setLoaded(false);
      }
    })();

    return () => {
      // DO NOT call instance.Quit() here — this cleanup runs twice in React 18 dev.
      // We keep the singleton alive while you’re on this page.
      window.removeEventListener('orientationchange', layoutCanvas);
      window.removeEventListener('resize', layoutCanvas);
      ro?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // hide loader eventually anyway
  useEffect(() => {
    const t = setTimeout(() => {
      const el = document.getElementById('unity-loading');
      if (el) el.style.display = 'none';
    }, 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <section ref={containerRef} className="relative min-h-screen bg-black py-20" id="sp-webgl">
      <div className="flex justify-center items-center min-h-screen">
        <motion.div style={{ opacity, y }} className="relative">
          <div
            className="relative bg-gray-900 border-2 border-blue-500 rounded-lg overflow-hidden shadow-2xl flex items-center justify-center"
            style={{
              width: 'min(92vw, 1100px)',
              height:
                sizingMode === 'fixed'
                  ? `${GAME_HEIGHT}px`
                  : `clamp(240px, calc((min(92vw, 1100px) * ${GAME_HEIGHT}) / ${GAME_WIDTH}), 80vh)`,
            }}
          >
            <canvas
              ref={canvasRef}
              id="unity-canvas"
              tabIndex={0}
              style={{
                display: 'block',
                background: '#80132C',
                outline: 'none',
                imageRendering: 'auto',
                touchAction: 'none',
              }}
              onFocus={() => tryResumeAudioAndFocus()}
              onClick={() => tryResumeAudioAndFocus()}
            />

            {!loaded && (
              <div id="unity-loading" className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-500 rounded-lg flex items-center justify-center animate-pulse">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M10 2L3 7v11h14V7l-7-5zM8 15v-6h4v6H8z" />
                    </svg>
                  </div>
                  <h3 className="text-white text-xl font-semibold mb-2">Loading Unity Game...</h3>
                  <p className="text-gray-400 text-sm">Spooky Pookie — 2D Platformer</p>
                </div>
              </div>
            )}

            {loaded && needsGesture && (
              <button
                className="absolute inset-0 z-20 bg-black/60 text-white flex items-center justify-center text-sm sm:text-base"
                onClick={tryResumeAudioAndFocus}
              >
                Click to start
              </button>
            )}
          </div>
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
      </div>
    </section>
  );
}
