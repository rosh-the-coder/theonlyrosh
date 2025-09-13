'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Calendar, MapPin, ExternalLink, Play, Pause } from 'lucide-react'

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.5, 0])

  const experiences = [
    {
      id: 1,
      company: "Two Blokes Trading",
      location: "Dublin, Ireland",
      position: "Video Editor & Designer",
      period: "2024 Jan - Present",
      description: "Two Blokes Trading is one of the most popular trading Podcasts on air, with its own groundbreaking social APP designed to offer a fully immersive learning experience.",
      achievements: [
        "Video editing for long-form and short-form content",
        "Social media design and branding",
        "App interface design and user experience optimization"
      ],
      technologies: ["Adobe Premiere", "After Effects", "Figma", "Social Media"],
      type: "current"
    },
    {
      id: 2,
      company: "ARCOP Associates Pvt Ltd",
      location: "Bengaluru, India",
      position: "Architectural Intern",
      period: "2022 – 2023",
      description: "ARCOP Associates Private Limited is a leading architecture and urban planning firm with a rich history that dates back to the early '50s when it was founded in Montreal.",
      achievements: [
        "Architectural design and planning",
        "3D modeling and visualization",
        "Urban planning and development"
      ],
      technologies: ["SketchUp", "Revit", "Lumion", "AutoCAD"],
      type: "past"
    },
    {
      id: 3,
      company: "Freelance",
      location: "Remote",
      position: "Video Editor",
      period: "2021 - Present",
      description: "Crafting engaging video content for clients across podcasting, fitness, architecture, music and tech. Specialized in editing long-form and short-form content for YouTube, Instagram, and TikTok.",
      achievements: [
        "Long-form and short-form video editing",
        "Motion graphics and visual effects",
        "Platform-specific content optimization",
        "Client collaboration and project management"
      ],
      technologies: ["Adobe Creative Suite", "DaVinci Resolve", "Motion Graphics", "Social Media"],
      type: "ongoing"
    }
  ]

  return (
    <motion.section
      id="experience"
      ref={containerRef}
      className="relative min-h-screen bg-black py-20 overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-accent/5 rounded-full blur-3xl" />
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
            <span className="gradient-text">Experience</span>
          </motion.h2>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            My professional journey from architecture to digital design, showcasing diverse skills and continuous growth.
          </motion.p>
        </motion.div>

        {/* Experience Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <motion.div
            className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-accent via-blue-500 to-purple-500"
            initial={{ height: 0 }}
            animate={isInView ? { height: "100%" } : {}}
            transition={{ duration: 1.5, delay: 0.6 }}
          />

          {/* Experience Items */}
          <div className="space-y-16">
            {experiences.map((experience, index) => (
              <motion.div
                key={experience.id}
                className="relative"
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.8 + index * 0.3, duration: 0.8 }}
              >
                {/* Timeline Dot */}
                <div className="absolute left-6 top-6 w-4 h-4 bg-accent rounded-full border-4 border-black z-10">
                  {experience.type === 'current' && (
                    <motion.div
                      className="absolute inset-0 w-4 h-4 bg-accent rounded-full"
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </div>

                {/* Content Card */}
                <motion.div
                  className={`ml-20 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all duration-300 ${
                    index % 2 === 0 ? 'lg:mr-20' : 'lg:ml-20'
                  }`}
                  whileHover={{ scale: 1.02, y: -5 }}
                >
                  {/* Header */}
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-2xl font-bold text-white">{experience.position}</h3>
                        {experience.type === 'current' && (
                          <span className="px-3 py-1 bg-accent/20 text-accent text-xs rounded-full border border-accent/30">
                            Current
                          </span>
                        )}
                      </div>
                      <h4 className="text-xl text-accent font-semibold mb-2">{experience.company}</h4>
                    </div>
                    
                    <div className="flex items-center gap-4 text-gray-400 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        {experience.period}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {experience.location}
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {experience.description}
                  </p>

                  {/* Achievements */}
                  <div className="mb-6">
                    <h5 className="text-white font-semibold mb-3">Key Achievements:</h5>
                    <ul className="space-y-2">
                      {experience.achievements.map((achievement, achievementIndex) => (
                        <motion.li
                          key={achievementIndex}
                          className="flex items-start gap-3 text-gray-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 1.2 + index * 0.3 + achievementIndex * 0.1, duration: 0.6 }}
                        >
                          <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0" />
                          {achievement}
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-2">
                    {experience.technologies.map((tech, techIndex) => (
                      <motion.span
                        key={techIndex}
                        className="px-3 py-1 bg-white/10 text-white/80 text-xs rounded-full border border-white/20 hover:bg-accent/20 hover:border-accent/30 transition-colors duration-300"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={isInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 1.4 + index * 0.3 + techIndex * 0.05, duration: 0.6 }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 mt-6">
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 bg-accent text-black font-semibold rounded-lg hover:bg-accent/90 transition-colors"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play className="w-4 h-4" />
                      View Work
                    </motion.button>
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors border border-white/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Company Site
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <motion.div
            className="inline-block bg-gradient-to-r from-accent/20 to-blue-500/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-2xl"
            whileHover={{ scale: 1.02 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              Ready to Work Together?
            </h3>
            <p className="text-gray-300 mb-6">
              Let's discuss your next project and bring your ideas to life with cutting-edge design and technology.
            </p>
            <motion.button
              className="px-8 py-4 bg-accent text-black font-bold rounded-full hover:bg-accent/90 transition-colors"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Start a Project
            </motion.button>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full"
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
    </motion.section>
  )
}
