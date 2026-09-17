"use client";

import { useEffect, useRef } from 'react';

interface SmoothScrollOptions {
  damping?: number;        // 0.1 = very smooth, 0.9 = less smooth
  stiffness?: number;      // 0.1 = slow, 0.9 = fast
  mass?: number;          // 0.1 = light, 0.9 = heavy
  threshold?: number;     // Minimum scroll distance to trigger
}

export function useSmoothScroll(options: SmoothScrollOptions = {}) {
  const {
    damping = 0.15,      // Breathing effect - slower damping
    stiffness = 0.08,    // Gentle stiffness
    mass = 0.8,          // Slight weight for momentum
    threshold = 1
  } = options;

  const targetScrollY = useRef(0);
  const currentScrollY = useRef(0);
  const velocity = useRef(0);
  const animationId = useRef<number | null>(null);
  const isScrolling = useRef(false);

  useEffect(() => {
    const updateScroll = () => {
      const diff = targetScrollY.current - currentScrollY.current;
      const springForce = stiffness * diff;
      const dampingForce = damping * velocity.current;
      
      velocity.current += (springForce - dampingForce) / mass;
      currentScrollY.current += velocity.current;

      // Apply the scroll with breathing ease
      window.scrollTo(0, currentScrollY.current);

      // Continue animation if there's still movement
      if (Math.abs(diff) > 0.1 || Math.abs(velocity.current) > 0.1) {
        animationId.current = requestAnimationFrame(updateScroll);
      } else {
        // Snap to final position
        window.scrollTo(0, targetScrollY.current);
        currentScrollY.current = targetScrollY.current;
        velocity.current = 0;
        isScrolling.current = false;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (!isScrolling.current) {
        isScrolling.current = true;
        currentScrollY.current = window.scrollY;
      }

      // Gentle scroll delta with breathing curve
      const delta = e.deltaY;
      const scrollAmount = Math.sign(delta) * Math.min(Math.abs(delta) * 0.6, 100);
      
      targetScrollY.current = Math.max(0, Math.min(
        targetScrollY.current + scrollAmount,
        document.documentElement.scrollHeight - window.innerHeight
      ));

      if (!animationId.current) {
        updateScroll();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      
      if (!isScrolling.current) {
        isScrolling.current = true;
        currentScrollY.current = window.scrollY;
      }

      const delta = e.touches[0].clientY - (e as any).lastTouchY;
      (e as any).lastTouchY = e.touches[0].clientY;
      
      const scrollAmount = -delta * 0.8;
      
      targetScrollY.current = Math.max(0, Math.min(
        targetScrollY.current + scrollAmount,
        document.documentElement.scrollHeight - window.innerHeight
      ));

      if (!animationId.current) {
        updateScroll();
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      (e as any).lastTouchY = e.touches[0].clientY;
    };

    // Add event listeners
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: false });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      
      if (animationId.current) {
        cancelAnimationFrame(animationId.current);
      }
    };
  }, [damping, stiffness, mass, threshold]);
}
