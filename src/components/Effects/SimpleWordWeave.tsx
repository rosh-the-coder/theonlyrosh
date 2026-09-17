"use client";

import React, { useEffect, useRef } from "react";

type Props = {
  text: string;
  className?: string;
};

export default function SimpleWordWeave({ text, className = "" }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Split text into words
    const words = text.split(' ').map((word, index) => {
      const span = document.createElement('span');
      span.textContent = word;
      span.style.display = 'inline-block';
      span.style.transition = 'transform 0.3s ease';
      span.style.willChange = 'transform';
      span.style.marginRight = '0.75em'; // Increased spacing by 50% (0.5em * 1.5)
      return { element: span, index };
    });

    // Clear container and add words
    container.innerHTML = '';
    words.forEach(({ element }) => container.appendChild(element));

    // Animation function
    const animateWords = () => {
      const rect = container.getBoundingClientRect();
      const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isVisible) {
        const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / (window.innerHeight + rect.height)));
        
        words.forEach(({ element, index }) => {
          const amplitude = 30;
          const frequency = 1.5;
          const phase = index * 0.4;
          const x = Math.sin(scrollProgress * Math.PI * frequency + phase) * amplitude;
          const y = Math.cos(scrollProgress * Math.PI * frequency * 0.8 + phase) * 8;
          
          element.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        });
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', animateWords);
    animateWords(); // Initial call

    return () => {
      window.removeEventListener('scroll', animateWords);
    };
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`text-2xl md:text-4xl font-bold text-black uppercase leading-tight text-left ${className}`}
      style={{ minHeight: '200px', paddingLeft: '40px', paddingRight: '40px' }}
    />
  );
}
