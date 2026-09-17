"use client";

import { useEffect } from 'react';

export function useSmoothScrollBetter() {
  useEffect(() => {
    // Detect if user is on macOS (has native smooth scrolling)
    const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
    
    // For macOS/iOS, use native scrolling (it's already smooth)
    // For Windows/Linux, use CSS scroll-behavior (much more performant than JS)
    if (isMac) {
      // Native scrolling is already buttery smooth on Mac - don't interfere!
      document.documentElement.style.scrollBehavior = 'auto';
    } else {
      // Use CSS smooth scroll for Windows/Linux (GPU accelerated)
      document.documentElement.style.scrollBehavior = 'smooth';
    }

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);
}
