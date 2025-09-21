'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import { Download, ArrowRight, Sparkles, Code, Palette, Camera } from 'lucide-react'

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const { scrollYProgress } = useScroll()
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.5, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  const approachItems = [
    {
      number: "01",
      title: "Discover & Analysis",
      description: "Uncovering insights through research, play, and curiosity.",
      icon: Sparkles,
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "02", 
      title: "Design & Implement",
      description: "Turning ideas into interactive realities — one frame, and line of code at a time.",
      icon: Code,
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "03",
      title: "Deliver & Monitor", 
      description: "Testing, shipping, iterating — and making sure it actually works.",
      icon: Palette,
      color: "from-orange-500 to-red-500"
    }
  ]

  const personalInfo = [
    { label: "Location", value: "Dublin, Ireland" },
    { label: "Experience", value: "5+ Years" },
    { label: "Specialization", value: "UX/UI Design" },
    { label: "Tools", value: "Figma, Unity, C#" }
  ]

  return (
    <motion.section
      id="about"
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-b from-black via-dark-gray to-black py-20 overflow-hidden"
      style={isClient ? { y, opacity, scale, zIndex: 2 } : { zIndex: 2 }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-accent/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          ref={textRef}
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2
            className="text-5xl md:text-7xl font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <span className="gradient-text">About</span> Me
          </motion.h2>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            I'm a hybrid designer who breaks all discipline boundaries, based in Ireland. 
            I design bold, intuitive experiences at the edge of UX, tech, and storytelling.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Left Column - Personal Story */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white">
                More About <span className="gradient-text">Rosh</span>
              </h3>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                I started as an architect, but I've always been drawn to the spaces where tech, 
                design, and storytelling intersect. From designing and developing fun apps, playful 
                2D platformers to immersive virtual galleries, my work focuses on creating intuitive, 
                engaging experiences.
              </p>
              
              <p className="text-lg text-gray-300 leading-relaxed">
                Whether I'm editing videos, designing interfaces, or prototyping AR ideas, I lean into 
                curiosity, simplicity, and a bit of edge. I like getting my hands dirty technically, 
                breaking barriers and mixing different fields of design.
              </p>
            </div>

            {/* Personal Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              {personalInfo.map((item, index) => (
                <motion.div
                  key={item.label}
                  className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg p-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
                >
                  <div className="text-sm text-gray-400 mb-1">{item.label}</div>
                  <div className="text-white font-semibold">{item.value}</div>
                </motion.div>
              ))}
            </div>

            {/* CTA Button */}
            <motion.button
              className="group flex items-center gap-3 px-8 py-4 bg-accent text-black font-bold rounded-full hover:bg-accent/90 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.2, duration: 0.6 }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Download className="w-5 h-5" />
              Download Resume
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </motion.button>
          </motion.div>

          {/* Right Column - Approach */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <h3 className="text-3xl font-bold text-white text-center lg:text-left">
              My <span className="gradient-text">Approach</span>
            </h3>
            
            <div className="space-y-6">
              {approachItems.map((item, index) => (
                <motion.div
                  key={item.number}
                  className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {/* Background Gradient */}
                  <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                  
                  <div className="relative z-10 flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-xl flex items-center justify-center`}>
                        <item.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl font-bold text-accent">{item.number}</span>
                        <h4 className="text-xl font-semibold text-white">{item.title}</h4>
                      </div>
                      <p className="text-gray-300 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                  
                  {/* Hover Effect Line */}
                  <motion.div
                    className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent to-blue-500 rounded-b-2xl"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Quote */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <blockquote className="text-2xl md:text-3xl text-white/80 italic font-light max-w-4xl mx-auto">
            "Think Globally. Act Locally."
          </blockquote>
          <div className="text-accent font-medium mt-4">- My Design Philosophy</div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      {isClient && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-accent/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}
    </motion.section>
  )
}
