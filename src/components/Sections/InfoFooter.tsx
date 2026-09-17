"use client";

import { useEffect, useRef, useState } from 'react';

export default function InfoFooter() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('Mouse entered card!');
    e.currentTarget.style.backgroundColor = 'rgba(255, 0, 0, 0.3)'; // Red background for testing
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    console.log('Mouse left card!');
    e.currentTarget.style.backgroundColor = ''; // Reset background
  };

  useEffect(() => {
    // Check if mobile on mount and window resize
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.5;
        
        // Dispatch custom event for navigation bars
        console.log('InfoFooter: Dispatching work-section-visibility with isVisible:', isVisible);
        const event = new CustomEvent('work-section-visibility', {
          detail: { isVisible }
        });
        window.dispatchEvent(event);
      },
      { threshold: [0, 0.5, 1] }
    );

    observer.observe(section);

    return () => {
      window.removeEventListener('resize', checkMobile);
      observer.unobserve(section);
    };
  }, []);
  return (
    <section ref={sectionRef} id="info-footer" className="relative bg-[#0B0B0B] w-full min-h-screen flex justify-center items-center px-4 sm:px-6 md:px-10 py-10 md:py-20">
      {/* Mobile Layout (< 768px) */}
      <div className="md:hidden grid grid-cols-2 gap-2 w-full relative z-50 max-h-[calc(100vh-180px)] py-4">
        {/* Large Work Card - Full Width */}
        <div 
          className="col-span-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 flex items-end justify-start p-5 min-h-[158px] cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => {
            const workSection = document.querySelector('#work');
            if (workSection) {
              const rect = workSection.getBoundingClientRect();
              const scrollTop = window.pageYOffset + rect.top - 1200;
              window.scrollTo({ top: scrollTop, behavior: 'smooth' });
            }
          }}
        >
          <span className="text-white text-2xl font-teko font-normal">work</span>
        </div>
        
        {/* Contact Card */}
        <div 
          className="col-span-1 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 flex items-end justify-start p-4 min-h-[96px] cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => { window.location.href = 'mailto:theonlyroshn@gmail.com' }}
        >
          <span className="text-white text-lg font-teko font-normal">contact</span>
        </div>
        
        {/* GitHub Card */}
        <div 
          className="col-span-1 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 flex items-end justify-start p-4 min-h-[96px] cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => window.open('https://github.com/rosh-the-coder', '_blank')}
        >
          <span className="text-white text-lg font-teko font-normal">github</span>
        </div>
        
        {/* Instagram Card */}
        <div 
          className="col-span-1 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 flex items-end justify-start p-4 min-h-[86px] cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => window.open('https://www.instagram.com/roshannajar10/', '_blank')}
        >
          <span className="text-white text-lg font-teko font-normal">instagram</span>
        </div>
        
        {/* LinkedIn Card - Spans 2 rows */}
        <div 
          className="col-span-1 row-span-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 flex items-end justify-start p-4 min-h-[168px] cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => window.open('https://www.linkedin.com/in/roshan-najar-0556711b4/', '_blank')}
        >
          <span className="text-white text-lg font-teko font-normal">linkedin</span>
        </div>
        
        {/* Video Editing Card - Half Width */}
        <div 
          className="col-span-1 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 flex items-end justify-start p-5 min-h-[158px] cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => window.open('/video-editing', '_blank')}
        >
          <span className="text-white text-xl font-teko font-normal">video editing</span>
        </div>
        
        {/* Behance Card - Full Width */}
        <div 
          className="col-span-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 flex items-end justify-start p-4 min-h-[96px] cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => window.open('https://www.behance.net/roshNjr', '_blank')}
        >
          <span className="text-white text-lg font-teko font-normal">behance</span>
        </div>
        
        {/* Copyright Card - Full Width */}
        <div 
          className="col-span-2 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 flex flex-col items-start justify-between p-4 min-h-[70px] cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300 gap-1"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <span className="text-white text-base font-teko font-normal">©2025 ROSHAN NAJAR</span>
          <span className="text-white text-sm font-teko font-normal">ALL RIGHTS RESERVED</span>
        </div>
      </div>

      {/* Desktop Layout (>= 768px) - UNCHANGED */}
      <div className="hidden md:grid grid-cols-6 gap-4 w-full h-full px-10 relative z-50" style={{ gridAutoRows: '250px' }}>
         {/* Large Work Card - Top Left */}
         <div 
           className="col-span-2 row-span-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 flex items-end justify-start p-6 cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300"
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
           onClick={() => {
             // Scroll to just before the Work section to avoid triggering the overlay
             const workSection = document.querySelector('#work');
             if (workSection) {
               const rect = workSection.getBoundingClientRect();
               // Scroll to 1200px before the Work section starts
               const scrollTop = window.pageYOffset + rect.top - 1200;
               window.scrollTo({ top: scrollTop, behavior: 'smooth' });
             }
           }}
         >
           <span className="text-white text-2xl font-teko font-normal">work</span>
         </div>
         
         {/* Contact Card - Below Work */}
         <div 
           className="col-span-1 row-span-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 flex items-end justify-start p-4 cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300"
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
           onClick={() => { window.location.href = 'mailto:theonlyroshn@gmail.com' }}
         >
           <span className="text-white text-2xl font-teko font-normal">contact</span>
         </div>
         
         {/* GitHub Card - Below Contact */}
         <div 
           className="col-span-1 row-span-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 flex items-end justify-start p-4 cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300"
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
           onClick={() => window.open('https://github.com/rosh-the-coder', '_blank')}
         >
           <span className="text-white text-2xl font-teko font-normal">github</span>
         </div>
         
         {/* Video Editing Card - Top Right */}
         <div 
           className="col-span-2 row-span-2 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 flex items-end justify-start p-6 cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300"
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
           onClick={() => window.open('/video-editing', '_blank')}
         >
           <span className="text-white text-2xl font-teko font-normal">video editing</span>
         </div>
         
         {/* Instagram Card - Bottom Left */}
         <div 
           className="col-span-1 row-span-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 flex items-end justify-start p-4 cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300"
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
           onClick={() => window.open('https://www.instagram.com/roshannajar10/', '_blank')}
         >
           <span className="text-white text-2xl font-teko font-normal">instagram</span>
         </div>
         
         {/* LinkedIn Card - Bottom Center */}
         <div 
           className="col-span-1 row-span-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 flex items-end justify-start p-4 cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300"
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
           onClick={() => window.open('https://www.linkedin.com/in/roshan-najar-0556711b4/', '_blank')}
         >
           <span className="text-white text-2xl font-teko font-normal">linkedin</span>
         </div>
         
         {/* Behance Card - Bottom Right */}
         <div 
           className="col-span-1 row-span-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 flex items-end justify-start p-4 cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300"
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
           onClick={() => window.open('https://www.behance.net/roshNjr', '_blank')}
         >
           <span className="text-white text-2xl font-teko font-normal">behance</span>
         </div>
         
         {/* Copyright Card - Bottom */}
         <div 
           className="col-span-5 row-span-1 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/20 flex flex-row items-end justify-between p-4 cursor-pointer hover:bg-white/20 hover:backdrop-blur-lg transition-all duration-300 gap-2"
           onMouseEnter={handleMouseEnter}
           onMouseLeave={handleMouseLeave}
         >
           <span className="text-white text-2xl font-teko font-normal">©2025 ROSHAN NAJAR</span>
           <span className="text-white text-2xl font-teko font-normal">ALL RIGHTS RESERVED</span>
         </div>
      </div>
      
      {/* Watermark Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <span 
          className="text-red-500/30 text-3xl sm:text-4xl md:text-6xl lg:text-8xl font-teko font-bold select-none"
          style={{ 
            transform: isMobile ? 'translateY(-90px)' : 'translateY(0px)'
          }}
        >
          theonlyrosh.com
        </span>
      </div>
    </section>
  );
}
