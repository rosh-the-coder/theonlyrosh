"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  text: string;
  className?: string; // for Tailwind font/size styles
  widthPercent?: number; // widen the box to give lateral room (110–125)
};

export default function WordWeaveMeasured({
  text,
  className = "",
  widthPercent = 118,
}: Props) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current!;
    if (!root) return;

    console.log('WordWeaveMeasured: Starting animation setup');

    // Build words as spans (with trailing space so wrapping stays natural)
    root.innerHTML = "";
    const tokens = text.split(/\s+/).filter(Boolean);
    console.log('WordWeaveMeasured: Split into', tokens.length, 'tokens');
    
    const words: HTMLSpanElement[] = tokens.map((w, i) => {
      const span = document.createElement("span");
      span.className = "ww-word";
      span.textContent = i === tokens.length - 1 ? w : w + " ";
      span.style.display = 'inline-block';
      span.style.willChange = 'transform';
      root.appendChild(span);
      return span;
    });
    
    console.log('WordWeaveMeasured: Created', words.length, 'word spans');

    // Group words by visual line (compare top positions with tolerance)
    const lineTol = 6; // px tolerance
    const lines: HTMLSpanElement[][] = [];
    words.forEach((w) => {
      const top = w.offsetTop;
      let line = lines.find((arr) => Math.abs(arr[0].offsetTop - top) <= lineTol);
      if (!line) {
        line = [];
        lines.push(line);
      }
      line.push(w);
    });

    const cs = getComputedStyle(root);
    const fontSize = parseFloat(cs.fontSize) || 16;
    const safeAmp = fontSize * 0.35; // cap X amplitude to avoid collisions
    const yAmp = fontSize * 0.06;    // tiny vertical "breath"
    const freq = 1.05;               // scroll frequency

    // Precompute per-word seeds: line-based direction + word alternation
    const seeds = words.map((el, i) => {
      const lineIndex = lines.findIndex((arr) => arr.includes(el));
      const lineDir = lineIndex % 2 === 0 ? 1 : -1;            // alternate rows
      const wordDir = i % 2 === 0 ? 1 : -1;                    // alternate words
      const dir = lineDir * wordDir;                           // combined sign
      const amp = safeAmp * (0.75 + ((i * 0.137) % 0.5));      // 0.75..1.25
      const phase = i * 0.36;                                  // staggered phase
      return { lineIndex, dir, amp, phase };
    });

    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const rect = root.getBoundingClientRect();
        const total = window.innerHeight + rect.height;
        const raw = (window.innerHeight - rect.top) / total; // ~0..1
        const p = Math.max(0, Math.min(1, raw));
        const omega = Math.PI * 2 * freq;

        console.log('WordWeaveMeasured: Scroll progress:', p, 'Words:', words.length);

        for (let i = 0; i < words.length; i++) {
          const el = words[i];
          const s = seeds[i];
          const x = Math.sin(omega * p + s.phase) * s.amp * s.dir;
          const y = Math.cos(omega * 0.6 * p + s.phase) * yAmp * 0.5;
          el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [text, widthPercent]);

  return (
    <div
      className={`ww-root ${className}`}
      style={{
        // widen slightly so words can weave into side "gaps"
        width: `${widthPercent}%`,
        marginLeft: `${(100 - widthPercent) / 2}%`,
        color: '#000000',
        opacity: 1,
      }}
      ref={rootRef}
    />
  );
}
