"use client";
import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function Work() {
  const [activePanel, setActivePanel] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const [hoveredPanel, setHoveredPanel] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const workItems = [
    {
      id: 1,
      title: "REDVELVETVAULT",
      subtitle: "GAMIFIED PRODUCT",
      year: "2024-Current",
      image: "/Work/RVV/rvv-cover.png",
      tickerText: "UX • UI • UNITY 3D DEVELOPMENT • FIREBASE INTEGRATION • GAMIFIED PLATFORMS • E-COMMERCE DESIGN • HYBRID APP DEVELOPMENT • SOCIAL MEDIA • INFORMATION ARCHITECTURE • USER RESEARCH & TESTING • INTERACTION DESIGN • 3D ENVIRONMENT DESIGN • DIGITAL PRODUCT STRATEGY • UX • UI • UNITY 3D DEVELOPMENT • FIREBASE INTEGRATION • GAMIFIED PLATFORMS • E-COMMERCE DESIGN • HYBRID APP DEVELOPMENT • SOCIAL MEDIA • INFORMATION ARCHITECTURE • USER RESEARCH & TESTING • INTERACTION DESIGN • 3D ENVIRONMENT DESIGN • DIGITAL PRODUCT STRATEGY"
    },
    {
      id: 2,
      title: "POWERSTRIDE",
      subtitle: "SUSTAINABLE APP",
      year: "2024",
      image: "/Work/PowerStride/Power-stride-Cover.png",
      tickerText: "UX RESEARCH • UI REDESIGN • SUSTAINABLE DESIGN • QUANTITATIVE RESEARCH • SCIENCE & INNOVATION • ENERGY AWARENESS • SMART MOBILITY • TRANSIT INNOVATION • PIEZOELECTRIC TECHNOLOGY • ECO-INCENTIVES • MOBILE APP REDESIGN • UX RESEARCH • UI REDESIGN • SUSTAINABLE DESIGN • QUANTITATIVE RESEARCH • SCIENCE & INNOVATION • ENERGY AWARENESS • SMART MOBILITY • TRANSIT INNOVATION • PIEZOELECTRIC TECHNOLOGY • ECO-INCENTIVES • MOBILE APP REDESIGN"
    },
    {
      id: 3,
      title: "THEFILMMAKERARCHITECT.COM",
      subtitle: "CLIENT",
      year: "2025",
      image: "/Work/TFA/TFA-COVER.png",
      tickerText: "FREELANCE • WEBSITE DESIGN • FRAMER WEBSITE DEVELOPMENT • ARCHITECTURE PORTFOLIO DESIGN • DUAL-DISCIPLINE BRANDING • NARRATIVE-DRIVEN DESIGN • RESPONSIVE WEB DESIGN • USER EXPERIENCE DESIGN • VISUAL STORYTELLING • INTERACTIVE PORTFOLIO • BRAND DESIGN • PROTOTYPING • FREELANCE • WEBSITE DESIGN • FRAMER WEBSITE DEVELOPMENT • ARCHITECTURE PORTFOLIO DESIGN • DUAL-DISCIPLINE BRANDING • NARRATIVE-DRIVEN DESIGN • RESPONSIVE WEB DESIGN • USER EXPERIENCE DESIGN • VISUAL STORYTELLING • INTERACTIVE PORTFOLIO • BRAND DESIGN • PROTOTYPING"
    },
    {
      id: 4,
      title: "COMING SOON",
      subtitle: "UI/UX",
      year: "2024",
      image: "/Work/soon/pexels-alleksana-4271927.jpg",
      tickerText: "VOICE & TONE • BRAND DESIGN • STRATEGY • UX • UI • WEB DESIGN • PRODUCT DESIGN • MOBILE DEVELOPMENT • CREATIVE DIRECTION • USER RESEARCH • PROTOTYPING • VISUAL IDENTITY • BRAND STRATEGY • DIGITAL MARKETING • CONTENT CREATION • INTERACTION DESIGN • INFORMATION ARCHITECTURE • USABILITY TESTING • DESIGN SYSTEMS • FRONTEND DEVELOPMENT • BACKEND INTEGRATION • API DESIGN • DATABASE ARCHITECTURE • CLOUD SOLUTIONS • DEVOPS • PERFORMANCE OPTIMIZATION • SECURITY IMPLEMENTATION • SCALABLE APPLICATIONS • MICROSERVICES • CONTAINERIZATION • CI/CD PIPELINES • AUTOMATED TESTING • MONITORING & ANALYTICS"
    },
    {
      id: 5,
      title: "COMING SOON",
      subtitle: "UI/UX",
      year: "2024",
      image: "/Work/soon/pexels-vie-studio-4439444.jpg",
      tickerText: "VOICE & TONE • BRAND DESIGN • STRATEGY • UX • UI • WEB DESIGN • PRODUCT DESIGN • MOBILE DEVELOPMENT • CREATIVE DIRECTION • USER RESEARCH • PROTOTYPING • VISUAL IDENTITY • BRAND STRATEGY • DIGITAL MARKETING • CONTENT CREATION • INTERACTION DESIGN • INFORMATION ARCHITECTURE • USABILITY TESTING • DESIGN SYSTEMS • FRONTEND DEVELOPMENT • BACKEND INTEGRATION • API DESIGN • DATABASE ARCHITECTURE • CLOUD SOLUTIONS • DEVOPS • PERFORMANCE OPTIMIZATION • SECURITY IMPLEMENTATION • SCALABLE APPLICATIONS • MICROSERVICES • CONTAINERIZATION • CI/CD PIPELINES • AUTOMATED TESTING • MONITORING & ANALYTICS"
    }
  ];

  const handlePanelClick = (index: number) => {
    console.log('Panel clicked:', index);
    setActivePanel(index);
  };

  // Simple click handler
  const handleClick = (index: number) => {
    console.log('CLICKED PANEL:', index);
    setActivePanel(index);
  };

  // Handle card click - only navigate if expanded
  const handleCardClick = (index: number) => {
    if (activePanel === index) {
      // Card is expanded, navigate to project page
      window.location.href = `/project/${workItems[index].id}`;
    } else {
      // Card is collapsed, just expand it
      setActivePanel(index);
      // Auto-trigger hover state when expanding
      setTimeout(() => {
        setHoveredPanel(index);
      }, 100); // Small delay to ensure smooth transition
    }
  };

  // Intersection Observer to detect when Work section is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isVisible = entry.isIntersecting && entry.intersectionRatio > 0.5;
        setIsInView(isVisible);
        
        // Dispatch custom event for navigation bars
        const event = new CustomEvent('work-section-visibility', {
          detail: { isVisible }
        });
        window.dispatchEvent(event);
      },
      { threshold: [0, 0.5, 1] }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  // Pin Work section near end to keep it fixed while Services enters - DESKTOP ONLY
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Skip pinning on mobile
    if (window.innerWidth <= 768) return;
    
    gsap.registerPlugin(ScrollTrigger);

    if (!sectionRef.current) return;

    const pinTrigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: 'top -15%',
      end: '+=1500',
      pin: sectionRef.current,
      pinSpacing: true,
      id: 'work-pin'
    });

    return () => {
      pinTrigger.kill();
    };
  }, []);

  return (
    <section id="work" ref={sectionRef} className="relative min-h-[250vh] md:min-h-screen bg-[#0B0B0B] py-10 md:py-20" style={{ zIndex: 20 }}>
      <div className="w-full px-4 md:px-10">
        {/* Section Title and Year */}
        <div className="w-full mb-8 md:mb-12">
          <div className="flex justify-between items-center">
            <div className="text-[80px] sm:text-[120px] md:text-[160px] lg:text-[200px] font-teko font-normal text-white">WORK</div>
            <div className="text-[80px] sm:text-[120px] md:text-[160px] lg:text-[200px] font-teko font-normal text-white">'25</div>
          </div>
        </div>

        {/* Expanding Cards Container */}
        <div ref={containerRef} className="flex flex-col md:flex-row w-full gap-3 md:gap-4 px-1 -mt-[60px] sm:-mt-[100px] md:-mt-[150px]" style={{ position: 'relative', zIndex: 2 }}>
          {workItems.map((item, index) => {
            // Hide cards 4 and 5 (index 3 and 4) on mobile
            const isHiddenOnMobile = index >= 3;
            
            return (
              <div
                key={item.id}
                className={`panel ${activePanel === index ? 'active' : ''} ${hoveredPanel === index ? 'hovered' : ''} ${isHiddenOnMobile ? 'hidden md:block' : ''}`}
                style={{
                  position: 'relative',
                  zIndex: 3,
                  cursor: activePanel === index ? 'pointer' : 'pointer'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleCardClick(index);
                }}
                onMouseEnter={() => {
                  if (activePanel === index) {
                    setHoveredPanel(index);
                  }
                }}
                onMouseLeave={() => {
                  setHoveredPanel(null);
                }}
              >
              {/* Background image layer (isolates blur/scale from overlay content) */}
              <div
                className={`panel-bg absolute inset-0 rounded-[16px]`}
                style={{
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  zIndex: 0
                }}
              />

              {/* Dim overlay on hover (below placeholder, above bg) */}
              {hoveredPanel === index && activePanel === index && (
                <div className="absolute inset-0 rounded-[16px] bg-black/30" style={{ zIndex: 1 }} />
              )}
              {/* Video player - only visible on hover when expanded */}
              <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
                hoveredPanel === index && activePanel === index ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`} style={{ zIndex: 2 }}>
                <div className="w-[80%] aspect-video rounded-lg border border-white/30 shadow-[0_10px_25px_rgba(0,0,0,0.45)] overflow-hidden">
                  {/* Only load video when hovered to save bandwidth and performance */}
                  {hoveredPanel === index && activePanel === index && (
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    >
                      <source src={index === 0 ? "/Work/RVV/Showreel-Grid-Mobile.mp4" : index === 1 ? "/Work/PowerStride/Showreel_-Mobile-screens.mp4" : index === 2 ? "/Work/TFA/TFA.mp4" : ""} type="video/mp4" />
                    </video>
                  )}
                </div>
              </div>

              {/* Expanded state - detailed layout */}
              <div className={`absolute bottom-0 left-0 right-0 transition-opacity duration-500 ${
                activePanel === index ? 'opacity-100' : 'opacity-0'
              }`}>
                <div className="card-footer bg-black/85 backdrop-blur-md rounded-b-[16px] p-4 md:p-6 min-h-[100px] md:min-h-[116px] border-t border-white/25">
                  {/* Project info */}
                  <div className="flex justify-between items-start mb-3 md:mb-4">
                    <div>
                      <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">{item.title}</h3>
                      <div className="flex items-center space-x-2 md:space-x-4 text-white/80">
                        <span className="text-sm md:text-lg">{item.subtitle}</span>
                        <span className="text-lg md:text-2xl font-bold">{item.year}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ticker text */}
                  <div className="overflow-hidden">
                    <div className="ticker-text text-white/60 text-xs md:text-sm whitespace-nowrap">
                      {item.tickerText}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
          })}
        </div>
      </div>

      <style jsx>{`
        .panel {
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          height: 40vh;
          border-radius: 16px;
          /* Start with no visible border/shadow; we'll animate these when active */
          border: 3px solid rgba(255, 255, 255, 0);
          box-shadow: inset 0 0 0 0 rgba(0, 0, 0, 0), 0 0 0 rgba(0,0,0,0);
          color: #fff;
          cursor: pointer;
          flex: 0.5;
          margin: 5px;
          position: relative;
          overflow: hidden; /* Prevent background image from bleeding outside */
          transition: flex 0.7s ease-in, border-color 0.4s ease, box-shadow 0.4s ease, height 0.5s ease;
          -webkit-transition: flex 700ms ease-in, border-color 400ms ease, box-shadow 400ms ease, height 500ms ease;
          display: block !important;
          visibility: visible !important;
        }

        .panel.active {
          flex: 2;
          height: 50vh;
          /* Animate in a prominent border & shadow in expanded state */
          border-color: rgba(255, 255, 255, 0.28);
          box-shadow: inset 0 0 0 4px rgba(0, 0, 0, 0.45), 0 10px 28px rgba(0,0,0,0.45);
        }

        .ticker-text {
          animation: ticker 30s linear infinite;
          will-change: transform;
        }

        /* Background layer transitions (keeps overlays crisp) */
        .panel .panel-bg {
          transition: transform 500ms ease, filter 500ms ease;
          will-change: transform, filter;
        }

        .panel.hovered .panel-bg {
          transform: scale(1.12);
          filter: blur(2px);
        }

        @keyframes ticker {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        /* Mobile specific styles */
        @media (max-width: 767px) {
          .panel {
            height: 50vh !important;
            flex: none !important;
            width: 100% !important;
            margin: 8px 0 !important;
            display: block !important;
            visibility: visible !important;
            position: relative !important;
          }

          /* Force hide cards 4 and 5 on mobile */
          .panel.hidden {
            display: none !important;
          }

          .panel.active {
            height: 60vh !important;
            flex: none !important;
          }

          .panel .panel-bg {
            display: block !important;
            opacity: 1 !important;
          }

          .card-footer {
            display: block !important;
            opacity: 1 !important;
          }
        }

        @media (min-width: 768px) {
          .panel {
            height: 80vh;
            flex: 0.5;
            margin: 10px;
          }

          .panel.active {
            flex: 5;
            height: 80vh;
          }
        }
      `}</style>
    </section>
  );
}