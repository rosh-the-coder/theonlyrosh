'use client'

import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero/Hero";
import Navigation from "@/components/Navigation/Navigation";
import FloatingBottomNav from "@/components/Navigation/FloatingBottomNav";
import Showreel from "@/components/Sections/Showreel";
import CustomCursor from "@/components/UI/CustomCursor";
import MusicPlayer from "@/components/UI/MusicPlayer";
import { useSmoothScrollBetter } from "@/hooks/useSmoothScrollBetter";

// Lazy load heavy components that aren't immediately visible
const About = lazy(() => import("@/components/Sections/About"));
const Work = lazy(() => import("@/components/Sections/Work"));
const Services = lazy(() => import("@/components/Sections/Services"));
const TechStack = lazy(() => import("@/components/Sections/TechStack"));
const InfoFooter = lazy(() => import("@/components/Sections/InfoFooter"));
const SpookiePookieEntry = lazy(() => import("@/components/SpookiePookieEntry"));

export default function Page() {
  const [isLoading, setIsLoading] = useState(true) // Start with true
  const [isInitialized, setIsInitialized] = useState(false)
  const hasDecided = useRef(false) // Prevent double execution in Strict Mode

  // Enable smooth scrolling with breathing effect
  useSmoothScrollBetter()

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (hasDecided.current) return
    hasDecided.current = true
    
    // Always scroll to top on page load/reload to prevent layout issues
    window.scrollTo(0, 0)
    
    // Check if this is a navigation back from another page (not a refresh)
    const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
    const isPageRefresh = navigationEntry?.type === 'reload'
    const isPageNavigation = navigationEntry?.type === 'navigate'
    
    console.log('Navigation type:', navigationEntry?.type, 'isPageRefresh:', isPageRefresh)
    
    // Always show loading screen on refresh or first visit
    if (isPageRefresh || isPageNavigation) {
      console.log('Showing loading screen - page refresh or first visit')
      // Keep isLoading as true to show the countdown
    } else {
      console.log('Skipping loading screen - navigation back')
      setIsLoading(false)
    }
    setIsInitialized(true)
  }, [])

  const handleLoadingComplete = () => {
    setIsLoading(false)
    
    // Check for scroll intent from sessionStorage
    const scrollToWork = sessionStorage.getItem('scrollToWork')
    console.log('Loading complete, scrollToWork:', scrollToWork)
    
    if (scrollToWork === 'true') {
      // Clear the flag
      sessionStorage.removeItem('scrollToWork')
      
      // Small delay to ensure all components are rendered
      setTimeout(() => {
        const workSection = document.querySelector('#work')
        console.log('Work section found:', !!workSection)
        if (workSection) {
          const workRect = workSection.getBoundingClientRect()
          const workTop = workRect.top + window.pageYOffset
          
          // Scroll to 50px after Work section starts
          const scrollTarget = workTop + 50
          console.log('Work section top:', workTop, 'Scroll target:', scrollTarget)
          window.scrollTo({ top: scrollTarget, behavior: 'smooth' })
        }
      }, 1500) // Increased delay to ensure everything is loaded
    }
  }

  // Don't render anything until we've checked session storage
  if (!isInitialized) {
    console.log('Not initialized yet, returning null')
    return null
  }

  console.log('Rendering with isLoading:', isLoading)

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <main 
        className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}
        style={{ position: 'relative' }}
        suppressHydrationWarning
      >
             <Hero />
             <Navigation />
             <Showreel />
             <Suspense fallback={<div className="h-screen bg-black" />}>
               <Work />
             </Suspense>
             <Suspense fallback={<div className="h-screen bg-black" />}>
               <SpookiePookieEntry />
             </Suspense>
             <Suspense fallback={<div className="h-screen bg-black" />}>
               <About />
             </Suspense>
             <Suspense fallback={<div className="h-screen bg-black" />}>
               <Services />
             </Suspense>
             <Suspense fallback={<div className="h-screen bg-black" />}>
               <TechStack />
             </Suspense>
             <Suspense fallback={<div className="h-screen bg-black" />}>
               <InfoFooter />
             </Suspense>
        <FloatingBottomNav />
        <CustomCursor />
        <MusicPlayer />
      </main>
    </>
  );
}
