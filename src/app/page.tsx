'use client'

import { useState, useEffect, useRef } from 'react'
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero/Hero";
import Navigation from "@/components/Navigation/Navigation";
import FloatingBottomNav from "@/components/Navigation/FloatingBottomNav";
import About from "@/components/Sections/About";
import Showreel from "@/components/Sections/Showreel";
import Intro_Spooky_Pookie from "@/components/Sections/Intro_Spooky-Pookie";
import SPWebgl from "@/components/Sections/SP-webgl";
import Work from "@/components/Sections/Work";
import Skills from "@/components/Sections/Skills";
import Experience from "@/components/Sections/Experience";
import Contact from "@/components/Sections/Contact";
import CustomCursor from "@/components/UI/CustomCursor";
import MusicPlayer from "@/components/UI/MusicPlayer";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true) // Start with true
  const [isInitialized, setIsInitialized] = useState(false)
  const hasDecided = useRef(false) // Prevent double execution in Strict Mode

  useEffect(() => {
    // Prevent double execution in React Strict Mode
    if (hasDecided.current) return
    hasDecided.current = true
    
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
        <Intro_Spooky_Pookie />
        <SPWebgl />
        <About />
        <Work />
        <Skills />
        <Experience />
        <Contact />
        <FloatingBottomNav />
        <CustomCursor />
        <MusicPlayer />
      </main>
    </>
  );
}
