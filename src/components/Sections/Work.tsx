'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight, ExternalLink, Github, Play, Eye } from 'lucide-react'

export default function Work() {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  
  const [activeProject, setActiveProject] = useState(0)
  const [isHovering, setIsHovering] = useState<number | null>(null)

  const y = useTransform(scrollYProgress, [0, 1], [0, -200])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.5, 0])

  const projects = [
    {
      id: 1,
      title: "TaxiOutFixt",
      category: "UX Design • UX Research • Wireframing • Prototype",
      description: "A comprehensive taxi booking and management platform designed with user experience at its core. Features intuitive wireframes and interactive prototypes.",
      image: "/images/projects/taxioutfixt.jpg",
      tags: ["UX Design", "UX Research", "Wireframing", "Prototype"],
      link: "#",
      github: "#",
      demo: "#"
    },
    {
      id: 2,
      title: "BirdWatch AR",
      category: "Augmented Reality • Mobile App • Wildlife",
      description: "An innovative AR application that helps users identify and learn about birds in their environment through augmented reality technology.",
      image: "/images/projects/birdwatch-ar.jpg",
      tags: ["AR", "Mobile App", "Unity", "C#"],
      link: "#",
      github: "#",
      demo: "#"
    },
    {
      id: 3,
      title: "Spookie Pookie",
      category: "Game Design • Entertainment • Halloween",
      description: "A spooky Halloween-themed game featuring engaging gameplay mechanics and immersive storytelling elements.",
      image: "/images/projects/spookie-pookie.jpg",
      tags: ["Game Design", "Unity", "C#", "Entertainment"],
      link: "#",
      github: "#",
      demo: "#"
    },
    {
      id: 4,
      title: "Shimmy Jimmy",
      category: "Basketball • Game • Entertainment",
      description: "A basketball-themed game with unique mechanics and engaging gameplay that keeps players entertained for hours.",
      image: "/images/projects/shimmy-jimmy.jpg",
      tags: ["Game Design", "Basketball", "Unity", "C#"],
      link: "#",
      github: "#",
      demo: "#"
    },
    {
      id: 5,
      title: "VR Shooter Game",
      category: "VR • Entertainment • Immersive",
      description: "An immersive virtual reality shooter game that pushes the boundaries of VR gaming technology.",
      image: "/images/projects/vr-shooter.jpg",
      tags: ["VR", "Game Design", "Unity", "C#"],
      link: "#",
      github: "#",
      demo: "#"
    }
  ]

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const containerWidth = scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth
        const progress = scrollLeft / containerWidth
        const newActiveProject = Math.round(progress * (projects.length - 1))
        setActiveProject(newActiveProject)
      }
    }

    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll)
      return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [projects.length])

  const scrollToProject = (index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const projectWidth = container.scrollWidth / projects.length
      container.scrollTo({
        left: projectWidth * index,
        behavior: 'smooth'
      })
    }
  }

  return (
    <motion.section
      id="work"
      ref={containerRef}
      className="relative min-h-screen bg-black py-20 overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
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
            My <span className="gradient-text">Work</span>
          </motion.h2>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Some crazy sh*t that showcases my multidisciplinary approach to design and development.
          </motion.p>
        </motion.div>

        {/* Project Navigation Dots */}
        <motion.div
          className="flex justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          {projects.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => scrollToProject(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeProject === index ? 'bg-accent scale-125' : 'bg-white/30 hover:bg-white/50'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </motion.div>

        {/* Horizontal Scroll Container */}
        <div className="relative">
          <motion.div
            ref={scrollContainerRef}
            className="flex gap-8 overflow-x-auto scrollbar-hide pb-8"
            style={{ scrollSnapType: 'x mandatory' }}
            initial={{ opacity: 0, x: 100 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.8, duration: 1 }}
          >
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                className="flex-shrink-0 w-full max-w-2xl scroll-snap-start"
                style={{ scrollSnapAlign: 'start' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 1 + index * 0.2, duration: 0.8 }}
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setIsHovering(index)}
                onHoverEnd={() => setIsHovering(null)}
              >
                <div className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden">
                  {/* Project Image */}
                  <div className="relative h-64 bg-gradient-to-br from-accent/20 to-blue-500/20 overflow-hidden">
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
                    
                    {/* Placeholder for project image */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white/60">
                        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Eye className="w-8 h-8" />
                        </div>
                        <p className="text-sm">Project Preview</p>
                      </div>
                    </div>

                    {/* Hover Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-accent/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    >
                      <div className="flex gap-4">
                        <motion.button
                          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Play className="w-5 h-5" />
                        </motion.button>
                        <motion.button
                          className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <ExternalLink className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </motion.div>
                  </div>

                  {/* Project Content */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-accent transition-colors duration-300">
                        {project.title}
                      </h3>
                      <p className="text-sm text-accent font-medium mb-3">
                        {project.category}
                      </p>
                      <p className="text-gray-300 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {project.tags.map((tag, tagIndex) => (
                        <span
                          key={tagIndex}
                          className="px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-white/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <motion.button
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Play className="w-4 h-4" />
                        Live Demo
                      </motion.button>
                      <motion.button
                        className="px-4 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Github className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-accent/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ filter: 'blur(20px)' }}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll Indicators */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/60 border border-white/20">
            <ArrowRight className="w-5 h-5 rotate-180" />
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center text-white/60 border border-white/20">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* View All Projects Button */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          <motion.button
            className="group px-8 py-4 border-2 border-accent text-accent font-bold rounded-full hover:bg-accent hover:text-black transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-3">
              View All Projects
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </span>
          </motion.button>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 1, 0.2],
              scale: [1, 2, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>
    </motion.section>
  )
}
