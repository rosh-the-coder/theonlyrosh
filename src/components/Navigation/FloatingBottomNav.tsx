'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function FloatingBottomNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [workSectionVisible, setWorkSectionVisible] = useState(false)
  const [aboutSectionVisible, setAboutSectionVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      // Update active section based on scroll position
      const sections = ['home', 'work', 'contact']
      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= 100 && rect.bottom >= 100
        }
        return false
      })
      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Listen for Work section visibility updates
  useEffect(() => {
    const handleWorkSectionUpdate = (event: CustomEvent) => {
      setWorkSectionVisible(event.detail.isVisible)
    }

    window.addEventListener('work-section-visibility', handleWorkSectionUpdate as EventListener)
    return () => window.removeEventListener('work-section-visibility', handleWorkSectionUpdate as EventListener)
  }, [])

  // Listen for About section visibility updates
  useEffect(() => {
    const handleAboutSectionUpdate = (event: CustomEvent) => {
      setAboutSectionVisible(event.detail.isVisible)
    }

    window.addEventListener('about-section-visibility', handleAboutSectionUpdate as EventListener)
    return () => window.removeEventListener('about-section-visibility', handleAboutSectionUpdate as EventListener)
  }, [])

  const navItems = [
    { name: 'Home', href: '#home', id: 'home' },
    { name: 'Work', href: '#work', id: 'work' },
    { name: 'Video Editing', href: '/video-editing', id: 'video-editing' },
    { name: 'Contact', href: '#contact', id: 'contact' },
  ]

  const scrollToSection = (href: string) => {
    if (href.startsWith('/')) {
      // Handle route navigation for Video Editing
      window.location.href = href
    } else if (href === '#contact') {
      // Open email client for contact
      window.location.href = 'mailto:theonlyroshn@gmail.com'
    } else if (href === '#work') {
      // Check if we're on video editing page
      if (window.location.pathname === '/video-editing') {
        // Navigate to main page and scroll to work after load
        window.location.href = '/';
        sessionStorage.setItem('scrollToWork', 'true');
      } else {
        // We're on main page - check if we're below Work section
        const workSection = document.querySelector('#work');
        if (workSection) {
          const workRect = workSection.getBoundingClientRect();
          const workTop = workRect.top + window.pageYOffset;
          const currentScroll = window.pageYOffset;
          
          if (currentScroll > workTop) {
            // We're below Work section - use InfoFooter logic to avoid Services overlay
            const scrollTarget = workTop - 1200;
            console.log('Below Work section - using InfoFooter logic, scroll target:', scrollTarget);
            window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
          } else {
            // We're above Work section - use current logic
            const scrollTarget = workTop + 50;
            console.log('Above Work section - using current logic, scroll target:', scrollTarget);
            window.scrollTo({ top: scrollTarget, behavior: 'smooth' });
          }
        }
      }
    } else if (href === '#home') {
      // Handle Home navigation
      const homeSection = document.querySelector('#home') || document.querySelector('#hero');
      if (homeSection) {
        homeSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // If not on main page, navigate to main page first
        window.location.href = '/';
      }
    } else {
      // Handle other section scrolling
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      } else {
        // If not on main page, navigate to main page first
        window.location.href = '/';
      }
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Bottom Navigation */}
      <motion.nav
        className={`floating-bottom-nav ${aboutSectionVisible ? 'about-section-active' : ''}`}
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: workSectionVisible ? 100 : 0, 
          opacity: workSectionVisible ? 0 : 1 
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ x: '-50%' }}
      >
        {/* Noise Texture Overlay for Glassmorphic Effect */}
        <div className="floating-bottom-nav-noise" />
        
        <div className="flex items-center h-full relative z-10 w-full" style={{ gap: '12px', width: '100%' }}>
          {/* Profile Picture */}
          <motion.div
            className="floating-bottom-nav-profile"
            style={{ flexShrink: 0, flexGrow: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('#home')}
          >
            <img
              src="/rosh-placeholder.jpg"
              alt="Roshan Najar"
              className="w-full h-full object-cover"
            />
          </motion.div>

          {/* Name and Title */}
          <div className="floating-bottom-nav-content" style={{ flex: '1 1 0%', minWidth: 0, overflow: 'hidden' }}>
            <motion.h2
              className="floating-bottom-nav-name"
              whileHover={{ scale: 1.05 }}
            >
              ROSHAN NAJAR
            </motion.h2>
            <div className="floating-bottom-nav-title">
              <div className="floating-bottom-nav-ticker">
                Product Designer, Website and App Developer, Creative Design Engineer, Video Editor, Architect, Product Designer, Website and App Developer, Creative Design Engineer, Video Editor, Architect
              </div>
            </div>
          </div>

          {/* Hamburger Menu */}
          <motion.button
            className="floating-bottom-nav-menu"
            style={{ flexShrink: 0, flexGrow: 0 }}
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {isOpen ? (
              <X className="w-8 h-8" />
            ) : (
              <Menu className="w-8 h-8" />
            )}
          </motion.button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-end justify-center pb-32"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="w-[600px] max-w-[calc(100vw-32px)]"
              style={{
                background: 'rgba(255, 255, 255, 0.10)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                filter: 'drop-shadow(4px 4px 9.4px rgba(0, 0, 0, 0.25))',
              }}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
             <div className="p-6">
               {navItems.map((item, index) => (
                 <div key={item.name}>
                   <motion.button
                     onClick={() => scrollToSection(item.href)}
                     className={`block w-full text-center text-[48px] font-normal transition-colors duration-300 relative ${
                       activeSection === item.id ? 'text-white' : 'text-white/80 hover:text-white'
                     }`}
                     style={{
                       fontFamily: "'League Gothic', sans-serif",
                       fontWeight: 400
                     }}
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     transition={{ delay: index * 0.1, duration: 0.3 }}
                     whileHover={{ x: 10 }}
                   >
                     {item.name}
                   </motion.button>
                   {index < navItems.length - 1 && (
                     <div 
                       className="mx-auto my-6 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"
                       style={{ width: '80%' }}
                     />
                   )}
                 </div>
               ))}
             </div>
           </motion.div>
         </motion.div>
        )}
      </AnimatePresence>
     </>
   )
 }
