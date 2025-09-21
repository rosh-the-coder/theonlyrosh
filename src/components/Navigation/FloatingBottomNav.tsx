'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function FloatingBottomNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')

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
    } else {
      // Handle section scrolling
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }
    setIsOpen(false)
  }

  return (
    <>
      {/* Floating Bottom Navigation */}
      <motion.nav
        className="floating-bottom-nav"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {/* Noise Texture Overlay for Glassmorphic Effect */}
        <div className="floating-bottom-nav-noise" />
        
        <div className="flex items-center justify-between h-full relative z-10">
          {/* Profile Picture */}
          <motion.div
            className="floating-bottom-nav-profile"
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
          <div className="floating-bottom-nav-content">
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              className="absolute bottom-32 left-[calc(35%-14px)] transform -translate-x-1/2 w-[600px]"
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
