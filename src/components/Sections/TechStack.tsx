"use client";

import { useEffect, useRef } from 'react';

export default function TechStack() {
  const sectionRef = useRef<HTMLElement>(null);
  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.border = '0.5px solid #000000';
    e.currentTarget.style.borderTopWidth = '1px';
    e.currentTarget.style.borderRightWidth = '0.8px';
    e.currentTarget.style.borderBottomWidth = '0.5px';
    const img = e.currentTarget.querySelector('img');
    if (img) img.style.transform = 'scale(1.1)';
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.border = '0.5px solid transparent';
    e.currentTarget.style.borderTopWidth = '1px';
    e.currentTarget.style.borderRightWidth = '0.8px';
    e.currentTarget.style.borderBottomWidth = '0.5px';
    const img = e.currentTarget.querySelector('img');
    if (img) img.style.transform = 'scale(1)';
  };

  const containerStyle = {
    border: '0.5px solid transparent',
    borderTopWidth: '1px',
    borderRightWidth: '0.8px',
    borderBottomWidth: '0.5px',
    transition: 'all 0.3s ease-in-out',
    zIndex: 9999,
    position: 'relative' as const,
    pointerEvents: 'auto' as const
  };

  const imageStyle = { transition: 'transform 0.3s ease-in-out' };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.5;
        
        // Dispatch custom event for navigation bars
        const event = new CustomEvent('work-section-visibility', {
          detail: { isVisible }
        });
        window.dispatchEvent(event);
      },
      { threshold: [0, 0.5, 1] }
    );

    observer.observe(section);

    return () => {
      observer.unobserve(section);
    };
  }, []);

  return (
    <section ref={sectionRef} id="tech-stack" className="relative bg-[#0B0B0B] py-10 md:py-20">
      <div className="w-full">
        <div className="w-full px-4 sm:px-6 md:px-10">
          <h2 className="text-[28px] sm:text-[32px] md:text-[36px] lg:text-[40px] font-teko font-normal text-white text-left mb-2 md:mb-0">
            Website Powered With
          </h2>
        </div>
        
        {/* Tech Stack Grid */}
        <div 
          className="grid grid-cols-2 md:grid-cols-4 gap-0 w-full min-h-[60vh] md:h-[calc(100vh-150px)] px-4 sm:px-6 md:px-10"
          style={{ zIndex: 1000, position: 'relative' }}
        >
             <div 
               className="flex justify-center items-center p-2 sm:p-4 md:p-6 overflow-hidden cursor-pointer bg-white"
               style={containerStyle}
               onMouseEnter={handleMouseEnter}
               onMouseLeave={handleMouseLeave}
               onClick={() => window.open('https://nextjs.org/', '_blank')}
             >
               <img 
                 src="/Tech Stack/next js.png" 
                 alt="Next.js" 
                 className="h-16 sm:h-20 md:h-28 lg:h-36 object-cover"
                 style={imageStyle}
               />
             </div>
            <div 
              className="flex justify-center items-center p-2 sm:p-4 md:p-6 cursor-pointer bg-white"
              style={containerStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => window.open('https://react.dev/', '_blank')}
            >
              <img 
                src="/Tech Stack/react.png" 
                alt="React" 
                className="h-12 sm:h-14 md:h-16 lg:h-20 object-contain"
                style={imageStyle}
              />
            </div>
            <div 
              className="flex justify-center items-center cursor-pointer bg-white p-2 sm:p-4 md:p-6"
              style={containerStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => window.open('https://www.typescriptlang.org/', '_blank')}
            >
              <img src="/Tech Stack/typescript.png" alt="TypeScript" className="h-12 sm:h-14 md:h-16 lg:h-20 object-contain" style={imageStyle} />
            </div>
            <div 
              className="flex justify-center items-center cursor-pointer bg-white p-2 sm:p-3 md:p-4"
              style={containerStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => window.open('https://tailwindcss.com/', '_blank')}
            >
              <img src="/Tech Stack/tailwind.png" alt="Tailwind CSS" className="h-8 sm:h-10 md:h-12 lg:h-16 object-contain" style={imageStyle} />
            </div>
            
            
            {/* Second Row - Standard */}
            <div 
              className="flex justify-center items-center cursor-pointer bg-white p-2 sm:p-3 md:p-4"
              style={containerStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => window.open('https://gsap.com/', '_blank')}
            >
              <img src="/Tech Stack/gsap.png" alt="GSAP" className="h-8 sm:h-10 md:h-12 lg:h-16 object-contain" style={imageStyle} />
            </div>
            <div 
              className="flex justify-center items-center cursor-pointer bg-white p-2 sm:p-4 md:p-6"
              style={containerStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => window.open('https://threejs.org/', '_blank')}
            >
              <img src="/Tech Stack/three.js.png" alt="Three.js" className="h-12 sm:h-14 md:h-16 lg:h-20 object-contain" style={imageStyle} />
            </div>
            <div 
              className="flex justify-center items-center cursor-pointer bg-white p-2 sm:p-3 md:p-4"
              style={containerStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => window.open('https://motion.dev/', '_blank')}
            >
              <img src="/Tech Stack/motion.dev.png" alt="Framer Motion" className="h-8 sm:h-10 md:h-12 lg:h-16 object-contain" style={imageStyle} />
            </div>
            <div 
              className="flex justify-center items-center cursor-pointer bg-white p-2 sm:p-3 md:p-4"
              style={containerStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => window.open('https://get.webgl.org/', '_blank')}
            >
              <img src="/Tech Stack/webgl.png" alt="WebGL" className="h-8 sm:h-10 md:h-12 lg:h-16 object-contain" style={imageStyle} />
            </div>
            
            {/* Third Row - Standard */}
            <div 
              className="flex justify-center items-center cursor-pointer bg-white p-2 sm:p-3 md:p-4"
              style={containerStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => window.open('https://unity.com/', '_blank')}
            >
              <img src="/Tech Stack/unity.png" alt="Unity" className="h-8 sm:h-10 md:h-12 lg:h-16 object-contain" style={imageStyle} />
            </div>
            <div 
              className="flex justify-center items-center cursor-pointer bg-white p-2 sm:p-3 md:p-4"
              style={containerStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => window.open('https://nodejs.org/en', '_blank')}
            >
              <img src="/Tech Stack/node js.png" alt="Node.js" className="h-8 sm:h-10 md:h-12 lg:h-16 object-contain" style={imageStyle} />
            </div>
            <div 
              className="flex justify-center items-center cursor-pointer bg-white p-2 sm:p-3 md:p-4"
              style={containerStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => window.open('https://www.w3schools.com/cs/index.php', '_blank')}
            >
              <img src="/Tech Stack/csharp.png" alt="C#" className="h-8 sm:h-10 md:h-12 lg:h-16 object-contain" style={imageStyle} />
            </div>
            <div 
              className="flex justify-center items-center cursor-pointer bg-white p-2 sm:p-3 md:p-4"
              style={containerStyle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={() => window.open('https://figma.com', '_blank')}
            >
              <img src="/Tech Stack/figma.png" alt="Figma" className="h-8 sm:h-10 md:h-12 lg:h-16 object-contain" style={imageStyle} />
            </div>
        </div>
      </div>
      
    </section>
  );
}
