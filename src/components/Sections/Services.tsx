"use client";
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Services() {
  const rootRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    const root = rootRef.current;
    const container = containerRef.current;
    const overlay = overlayRef.current;
    if (!root || !container || !overlay) return;

    // Animate skill tags with word weave effect
    const animateSkillTags = () => {
      const skillTags = container.querySelectorAll('.skill-tag');
      
      skillTags.forEach((tag, index) => {
        const rect = tag.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible) {
          // Calculate scroll progress based on the Services section scroll
          const servicesRect = root.getBoundingClientRect();
          const scrollProgress = Math.max(0, Math.min(1, (window.innerHeight - servicesRect.top) / (window.innerHeight + servicesRect.height)));
          
          const amplitude = 25; // Increased amplitude for more noticeable movement
          const frequency = 1.5;
          const phase = index * 0.4;
          const x = Math.sin(scrollProgress * Math.PI * frequency + phase) * amplitude;
          const y = Math.cos(scrollProgress * Math.PI * frequency * 0.8 + phase) * 12;
          
          (tag as HTMLElement).style.setProperty('--scroll-x', `${x}px`);
          (tag as HTMLElement).style.setProperty('--scroll-y', `${y}px`);
        } else {
          // Reset transform when not visible
          (tag as HTMLElement).style.setProperty('--scroll-x', '0px');
          (tag as HTMLElement).style.setProperty('--scroll-y', '0px');
        }
      });
    };

    // Add scroll listener for skill tags animation
    window.addEventListener('scroll', animateSkillTags);
    animateSkillTags(); // Initial call

    // Add hover displacement effect to skill tags
    const addHoverDisplacement = () => {
      const skillTags = container.querySelectorAll('.skill-tag');
      
      skillTags.forEach((tag) => {
        tag.addEventListener('mousemove', (e) => {
          const rect = tag.getBoundingClientRect();
          const centerX = rect.left + rect.width / 2;
          const centerY = rect.top + rect.height / 2;
          
          const deltaX = (e as MouseEvent).clientX - centerX;
          const deltaY = (e as MouseEvent).clientY - centerY;
          
          // Calculate displacement away from cursor
          const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
          const maxDistance = 50; // Maximum displacement distance
          const displacement = Math.min(distance * 0.3, maxDistance);
          
          // Normalize direction vector
          const normalizedX = deltaX / distance;
          const normalizedY = deltaY / distance;
          
          // Apply displacement in opposite direction
          const hoverX = -normalizedX * displacement;
          const hoverY = -normalizedY * displacement;
          
          (tag as HTMLElement).style.setProperty('--hover-x', `${hoverX}px`);
          (tag as HTMLElement).style.setProperty('--hover-y', `${hoverY}px`);
        });
        
        tag.addEventListener('mouseleave', () => {
          (tag as HTMLElement).style.setProperty('--hover-x', '0px');
          (tag as HTMLElement).style.setProperty('--hover-y', '0px');
        });
      });
    };

    addHoverDisplacement();

    // Overlay used to key off Work's pin (when Work sat directly above Services).
    // Work now comes earlier, so trigger from Services itself — keeps Spookie/About clear.
    const overlayTl = gsap.timeline({ paused: true })
      .fromTo(overlay, { xPercent: -100, autoAlpha: 0 }, { xPercent: 0, autoAlpha: 1, ease: 'power3.out', duration: 0.6 });

    // Dispatch event to toggle dark nav like About section
    const dispatchDarkNav = (isVisible: boolean) => {
      const event = new CustomEvent('about-section-visibility', { detail: { isVisible } });
      window.dispatchEvent(event);
    };

    ScrollTrigger.create({
      id: 'services-overlay',
      trigger: '#services',
      start: 'top 85%',
      end: () => {
        // End when the last card (card-5) finishes its scroll animation
        const lastCardTrigger = ScrollTrigger.getById('card-5') || ScrollTrigger.getById('card-5-mobile');
        return lastCardTrigger ? lastCardTrigger.end : `+=${root.offsetHeight}`;
      },
      onEnter: () => { overlayTl.restart(); dispatchDarkNav(true); },
      onLeave: () => { overlayTl.reverse(); dispatchDarkNav(false); },
      onEnterBack: () => { overlayTl.restart(); dispatchDarkNav(true); },
      onLeaveBack: () => { overlayTl.reverse(); dispatchDarkNav(false); },
    });    const mm = gsap.matchMedia();

    // large screens
    mm.add('(min-width: 769px)', () => {
      gsap.to(container.querySelector('.card-2') as Element, {
        x: '80px',
                scrollTrigger: {
                  trigger: root,
          start: 'top top',
                  end: '25% bottom',
                  scrub: true,
                  pin: container,
                  pinSpacing: false,
                  id: 'card-2',
                },
      });

      gsap.to(container.querySelector('.card-3') as Element, {
        x: '160px',
                scrollTrigger: {
                  trigger: root,
          start: () => ScrollTrigger.getById('card-2')!.end as any,
                  end: '50% bottom',
                  scrub: true,
                  pin: container,
                  pinSpacing: false,
                  id: 'card-3',
                },
      });

      gsap.to(container.querySelector('.card-4') as Element, {
        x: '240px',
                scrollTrigger: {
                  trigger: root,
          start: () => ScrollTrigger.getById('card-3')!.end as any,
                  end: '75% bottom',
                  scrub: true,
                  pin: container,
                  pinSpacing: false,
                  id: 'card-4',
                },
      });

      gsap.to(container.querySelector('.card-5') as Element, {
        x: '320px',
                scrollTrigger: {
                  trigger: root,
          start: () => ScrollTrigger.getById('card-4')!.end as any,
                  end: 'bottom bottom',
                  scrub: true,
                  pin: container,
                  pinSpacing: false,
                  id: 'card-5',
                },
      });
    });

    // small screens
    mm.add('(max-width: 768px)', () => {
      gsap.to(container.querySelector('.card-2') as Element, {
        y: '80px',
                scrollTrigger: {
                  trigger: root,
          start: 'top top',
                  end: '25% bottom',
                  scrub: true,
                  pin: container,
                  pinSpacing: false,
                  id: 'card-2-mobile',
                },
      });

      gsap.to(container.querySelector('.card-3') as Element, {
        y: '160px',
                scrollTrigger: {
                  trigger: root,
          start: () => ScrollTrigger.getById('card-2-mobile')!.end as any,
                  end: '50% bottom',
                  scrub: true,
                  pin: container,
          pinSpacing: true,
                  id: 'card-3-mobile',
                },
      });

      gsap.to(container.querySelector('.card-4') as Element, {
        y: '240px',
                scrollTrigger: {
                  trigger: root,
          start: () => ScrollTrigger.getById('card-3-mobile')!.end as any,
                  end: '75% bottom',
                  scrub: true,
                  pin: container,
                  pinSpacing: false,
                  id: 'card-4-mobile',
                },
      });

      gsap.to(container.querySelector('.card-5') as Element, {
        y: '320px',
                scrollTrigger: {
                  trigger: root,
          start: () => ScrollTrigger.getById('card-4-mobile')!.end as any,
                  end: 'bottom bottom',
                  scrub: true,
                  pin: container,
                  pinSpacing: false,
                  id: 'card-5-mobile',
                },
      });
    });

    return () => {
      mm.revert();
      ScrollTrigger.getById('services-overlay')?.kill();
      window.removeEventListener('scroll', animateSkillTags);
      // Ensure nav resets when unmounting
      const event = new CustomEvent('about-section-visibility', { detail: { isVisible: false } });
      window.dispatchEvent(event);
    };
  }, []);

  return (
    <section id="services" className="relative bg-[#0B0B0B] pt-[80px]">
      {/* Fixed overlay page-like cover matching Work styling (stays visible; content renders above) */}
      <div ref={overlayRef} className="fixed inset-0 pointer-events-none z-[30] bg-white" style={{ transform: 'translateZ(0)' }}>
        <div className="w-full h-full px-4 sm:px-6 md:px-10 pt-[110px] sm:pt-[120px] md:pt-[130px] pb-6 sm:pb-8 md:pb-10">
          <div className="flex justify-between items-start sm:items-center flex-col sm:flex-row gap-4 sm:gap-6">
            <div className="text-[80px] sm:text-[120px] md:text-[160px] lg:text-[200px] font-teko font-normal text-black leading-none">SERVICES</div>
            <div className="text-[24px] sm:text-[32px] md:text-[40px] lg:text-[50px] font-teko font-normal text-black" style={{ lineHeight: '1.1' }}>
              Designing<br />
              with <em>Intent.</em><br />
              Building with<br />
              <em>Curiosity.</em>
            </div>
          </div>
        </div>
            </div>

      <div className="w-full px-4 sm:px-6 md:px-10 relative z-[40]">
        {/* Title removed to tighten section */}

        <div ref={rootRef} className="scroll-root">
              <div ref={containerRef} className="scroll-container">
            {/* UX/UI/INTERACTION DESIGN */}
            <div className="card card-1">
              <div className="card-content">
                <div className="card-left">
                  <div className="text-container">
                    <h2 className="card-title">UX/UI/INTERACTION DESIGN</h2>
                    <p className="card-description">Designing intuitive interfaces with deep attention to user flow and context.</p>
                  </div>
                  <div className="skill-tags">
                    <div className="skill-tag">User Research & Personas</div>
                    <div className="skill-tag">Wireframing (Low-Hi)</div>
                    <div className="skill-tag">Design Systems</div>
                    <div className="skill-tag">Micro-Interactions & Motion</div>
                    <div className="skill-tag">Prototyping (Figma/Framer)</div>
                    <div className="skill-tag">Usability Testing</div>
                    <div className="skill-tag">Information Architecture & User Flows</div>
                  </div>
                </div>
                <div className="card-right">
                  <img src="/Services/INTERACTION DESIGN.png" alt="UX/UI Design" className="card-image" />
                </div>
              </div>
            </div>

            {/* WEBSITE & APP DEVELOPMENT */}
            <div className="card card-2">
              <div className="card-content">
                <div className="card-left">
                  <div className="text-container">
                    <h2 className="card-title">WEBSITE & APP DEVELOPMENT</h2>
                    <p className="card-description">Building functional and responsive end-to-end apps with backend integrations.</p>
                  </div>
                  <div className="skill-tags">
                    <div className="skill-tag">Responsive Layouts</div>
                    <div className="skill-tag">Debugging and Version Control</div>
                    <div className="skill-tag">React / Ionic</div>
                    <div className="skill-tag">TypeScript</div>
                    <div className="skill-tag">Deployment & QA</div>
                    <div className="skill-tag">Firebase AUTH, Storage and Hosting</div>
                    <div className="skill-tag">HTML / CSS / JavaScript</div>
                  </div>
                </div>
                <div className="card-right">
                  <img src="/Services/WEBSITE & APP DEVELOPMENT.png" alt="Website Development" className="card-image" />
                </div>
              </div>
            </div>

            {/* VIDEO EDITING */}
            <div className="card card-3">
              <div className="card-content">
                <div className="card-left">
                  <div className="text-container">
                    <h2 className="card-title">VIDEO EDITING</h2>
                    <p className="card-description">Plan, cut, animate, grade, and mix videos that grab attention and convert.</p>
                  </div>
                  <div className="skill-tags">
                    <div className="skill-tag">Timeline Editing and Pacing</div>
                    <div className="skill-tag">Color Grading</div>
                    <div className="skill-tag">Motion Graphics</div>
                    <div className="skill-tag">Social Media Content</div>
                    <div className="skill-tag">Podcasts</div>
                    <div className="skill-tag">Thumbnail Design (CTR)</div>
                    <div className="skill-tag">Sound Design and Mixing</div>
                    <div className="skill-tag">Storyboard Planning and Narrative</div>
                    <div className="skill-tag">Youtube SEO</div>
                  </div>
                </div>
                <div className="card-right">
                  <img src="/Services/VIDEO EDITING.png" alt="Video Editing" className="card-image" />
                </div>
              </div>
            </div>

            {/* GAME DESIGN AND DEVELOPMENT */}
            <div className="card card-4">
              <div className="card-content">
                <div className="card-left">
                  <div className="text-container">
                    <h2 className="card-title">GAME DESIGN AND DEVELOPMENT</h2>
                    <p className="card-description">Creating 2D games and immersive 3D environments with Unity and C# with React/WebGL integrations into websites.</p>
                  </div>
                  <div className="skill-tags">
                    <div className="skill-tag">Unity + C#</div>
                    <div className="skill-tag">WebGL Building and Integration</div>
                    <div className="skill-tag">Shipping Games</div>
                    <div className="skill-tag">C# Gameplay Scripting</div>
                    <div className="skill-tag">Audio & SFX</div>
                    <div className="skill-tag">AR / VR App Development</div>
                    <div className="skill-tag">Playtesting and Balancing</div>
                    <div className="skill-tag">Level Design</div>
                  </div>
                </div>
                <div className="card-right">
                  <img src="/Services/GAME DESIGN AND DEVELOPMENT.png" alt="Game Development" className="card-image" />
                </div>
              </div>
            </div>

            {/* 3D MODELLING */}
            <div className="card card-5">
              <div className="card-content">
                <div className="card-left">
                  <div className="text-container">
                    <h2 className="card-title">3D MODELLING</h2>
                    <p className="card-description">Crafting interactive and architectural 3D scenes for both real-time and pre-rendered use.</p>
                  </div>
                  <div className="skill-tags">
                    <div className="skill-tag">Architectural Modelling</div>
                    <div className="skill-tag">Web + Unity Optimized</div>
                    <div className="skill-tag">Sketchup / Revit / Spline</div>
                    <div className="skill-tag">Rendering (Lumion)</div>
                  </div>
                </div>
                <div className="card-right">
                  <img src="/Services/3D MODELLING.png" alt="3D Modelling" className="card-image" />
                </div>
              </div>
            </div>
              </div>
            </div>
          </div>


      <style jsx>{`
        .scroll-root {
          min-height: 800vh; /* reduced to fit cards more tightly */
        }

        .scroll-container {
          position: sticky;
          display: flex;
          flex-direction: row;
          align-items: center;
          overflow-x: clip;
          position: relative;
          width: 100%;
        }

        .card {
          position: absolute;
          height: 100%;
          min-height: 25rem;
          max-height: 45rem;
          width: 100%;
          background: #000000;
          border-radius: 16px;
          border: 0.5px solid white;
          box-shadow: 0 10px 25px rgba(0,0,0,0.35);
          overflow: hidden;
        }

        .card-content {
          display: flex;
          height: 100%;
          padding: 2rem;
          gap: 2rem;
        }

        .card-left {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.5rem;
        }

        .text-container {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .card-right {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .card-title {
          font-size: clamp(1.5rem, 3vw, 2.5rem);
          font-weight: 700;
          color: #ffffff;
          text-transform: uppercase;
          line-height: 1.1;
          margin: 0;
        }

        .card-description {
          font-size: clamp(0.9rem, 1.5vw, 1.1rem);
          color: #ffffff;
          line-height: 1.4;
          margin: 0;
          opacity: 0.9;
        }

        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 0.5rem;
        }

        .skill-tag {
          background: #ff3333;
          color: #ffffff;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: clamp(0.7rem, 1.2vw, 0.9rem);
          font-weight: 600;
          text-transform: uppercase;
          text-align: center;
          white-space: nowrap;
          flex-shrink: 0;
          transition: transform 0.2s ease;
          will-change: transform;
          border: 0.2px solid white;
          cursor: pointer;
          transform: translate3d(var(--scroll-x, 0px), var(--scroll-y, 0px), 0);
        }

        .skill-tag:hover {
          transform: translate3d(calc(var(--scroll-x, 0px) + var(--hover-x, 0px)), calc(var(--scroll-y, 0px) + var(--hover-y, 0px)), 0) scale(1.05);
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 12px;
          max-height: 400px;
          border: 1px solid white;
        }

        .card-1 { z-index: 21; transform: none; }
        .card-2 { z-index: 22; }
        .card-3 { z-index: 23; }
        .card-4 { z-index: 24; }
        .card-5 { z-index: 25; }

        @media (min-width: 768px) {
          .scroll-container { top: 5rem; height: calc(-10rem + 100vh); margin: 5rem 0px; }
          .card-content { padding: 3rem; gap: 3rem; }
          .card-2 { transform: translate3d(calc(100% - 320px), 0, 0); }
          .card-3 { transform: translate3d(calc(100% - 240px), 0, 0); }
          .card-4 { transform: translate3d(calc(100% - 160px), 0, 0); }
          .card-5 { transform: translate3d(calc(100% - 80px), 0, 0); }
        }

        @media (max-width: 768px) {
          .scroll-container { flex-direction: column; overflow-y: clip; top: 1rem; height: calc(-2rem + 100vh); margin: 1rem 0px; }
          .card-content { flex-direction: column; padding: 1.5rem; gap: 1.5rem; }
          .card-left { order: 2; }
          .card-right { order: 1; }
          .skill-tags { gap: 0.5rem; }
          .skill-tag { font-size: 0.7rem; padding: 0.4rem 0.8rem; }
          .card-image { max-height: 300px; }
          .card-2 { transform: translate3d(0, calc(100% - 320px), 0); }
          .card-3 { transform: translate3d(0, calc(100% - 240px), 0); }
          .card-4 { transform: translate3d(0, calc(100% - 160px), 0); }
          .card-5 { transform: translate3d(0, calc(100% - 80px), 0); }
        }
      `}</style>
    </section>
  );
}


