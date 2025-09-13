'use client'

import { useState } from 'react'
import LoadingScreen from "@/components/LoadingScreen";
import Hero from "@/components/Hero/Hero";
import Navigation from "@/components/Navigation/Navigation";
import About from "@/components/Sections/About";
import Work from "@/components/Sections/Work";
import Skills from "@/components/Sections/Skills";
import Experience from "@/components/Sections/Experience";
import Contact from "@/components/Sections/Contact";
import CustomCursor from "@/components/UI/CustomCursor";
import MusicPlayer from "@/components/UI/MusicPlayer";

export default function Page() {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <main className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500'}>
        <Hero />
        <Navigation />
        <About />
        <Work />
        <Skills />
        <Experience />
        <Contact />
        <CustomCursor />
        <MusicPlayer />
      </main>
    </>
  );
}
