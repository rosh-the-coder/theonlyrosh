'use client'

import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Code, Palette, Video, Gamepad2, Globe, Smartphone, Zap } from 'lucide-react'

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -150])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.5, 0])

  const [animatedSkills, setAnimatedSkills] = useState<Set<string>>(new Set())

  const skillCategories = [
    {
      id: "design",
      title: "Design & Creative",
      icon: Palette,
      color: "from-purple-500 to-pink-500",
      skills: [
        { name: "UX/UI Design", level: 95, description: "Designing intuitive interfaces with deep attention to user flow and context" },
        { name: "Interaction Design", level: 90, description: "Creating engaging and responsive user interactions" },
        { name: "Wireframing", level: 88, description: "Building clear and effective user journey maps" },
        { name: "Prototyping", level: 92, description: "Rapid prototyping with modern design tools" }
      ]
    },
    {
      id: "development",
      title: "Development & Code",
      icon: Code,
      color: "from-blue-500 to-cyan-500",
      skills: [
        { name: "JavaScript", level: 85, description: "Frontend development and interactive web applications" },
        { name: "React/Next.js", level: 80, description: "Modern web development frameworks" },
        { name: "Unity + C#", level: 88, description: "Game development and AR/VR applications" },
        { name: "App Development", level: 82, description: "Mobile and web app prototyping" }
      ]
    },
    {
      id: "creative",
      title: "Creative & Media",
      icon: Video,
      color: "from-orange-500 to-red-500",
      skills: [
        { name: "Video Editing", level: 90, description: "Effortless execution, rapid results" },
        { name: "Motion Graphics", level: 85, description: "Dynamic visual storytelling" },
        { name: "3D Modeling", level: 78, description: "Crafting interactive 3D scenes" },
        { name: "Game Design", level: 88, description: "Creating engaging gameplay mechanics" }
      ]
    },
    {
      id: "tools",
      title: "Tools & Platforms",
      icon: Zap,
      color: "from-green-500 to-emerald-500",
      skills: [
        { name: "Figma", level: 95, description: "Collaborative design and prototyping" },
        { name: "Adobe Suite", level: 88, description: "Creative design and video editing" },
        { name: "Unity", level: 85, description: "Game and AR/VR development" },
        { name: "Framer", level: 80, description: "Design-to-code platform" }
      ]
    }
  ]

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => {
        skillCategories.forEach(category => {
          category.skills.forEach(skill => {
            setTimeout(() => {
              setAnimatedSkills(prev => new Set(Array.from(prev).concat(skill.name)))
            }, Math.random() * 1000)
          })
        })
      }, 500)
      
      return () => clearTimeout(timer)
    }
  }, [isInView])

  const getSkillColor = (level: number) => {
    if (level >= 90) return "from-green-400 to-emerald-500"
    if (level >= 80) return "from-blue-400 to-cyan-500"
    if (level >= 70) return "from-yellow-400 to-orange-500"
    return "from-red-400 to-pink-500"
  }

  return (
    <motion.section
      id="skills"
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-b from-black via-dark-gray to-black py-20 overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-r from-accent/5 to-purple-500/5 rounded-full blur-3xl" />
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
            Pro <span className="gradient-text">Skills</span>
          </motion.h2>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Discover my range of skills to elevate your brand to the next level.
          </motion.p>
        </motion.div>

        {/* Skills Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              className="space-y-6"
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 + categoryIndex * 0.2, duration: 0.8 }}
            >
              {/* Category Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-16 h-16 bg-gradient-to-r ${category.color} rounded-2xl flex items-center justify-center`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">{category.title}</h3>
                  <p className="text-gray-400 text-sm">Professional expertise</p>
                </div>
              </div>

              {/* Skills List */}
              <div className="space-y-6">
                {category.skills.map((skill, skillIndex) => (
                  <motion.div
                    key={skill.name}
                    className="group"
                    initial={{ opacity: 0, x: -30 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.8 + categoryIndex * 0.2 + skillIndex * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-lg font-semibold text-white group-hover:text-accent transition-colors duration-300">
                        {skill.name}
                      </h4>
                      <span className="text-accent font-bold text-lg">{skill.level}%</span>
                    </div>
                    
                    {/* Skill Bar */}
                    <div className="relative h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">
                      <motion.div
                        className={`h-full bg-gradient-to-r ${getSkillColor(skill.level)} rounded-full relative overflow-hidden`}
                        initial={{ width: 0 }}
                        animate={animatedSkills.has(skill.name) ? { width: `${skill.level}%` } : {}}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      >
                        {/* Animated Shine Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          animate={animatedSkills.has(skill.name) ? {
                            x: ["-100%", "100%"]
                          } : {}}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3,
                            ease: "easeInOut"
                          }}
                        />
                      </motion.div>
                    </div>
                    
                    {/* Skill Description */}
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                      {skill.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Additional Skills */}
        <motion.div
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4, duration: 0.8 }}
        >
          <h3 className="text-3xl font-bold text-white mb-8">
            Additional <span className="gradient-text">Tools</span> & Technologies
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[
              { name: "Spline", icon: Globe, description: "3D Web Design" },
              { name: "Unicorn Studio", icon: Gamepad2, description: "Interactive Design" },
              { name: "SketchUp", icon: Palette, description: "3D Modeling" },
              { name: "Revit", icon: Code, description: "Architecture" },
              { name: "Lumion", icon: Palette, description: "Rendering" },
              { name: "GitHub", icon: Code, description: "Version Control" },
              { name: "itch.io", icon: Globe, description: "Game Publishing" },
              { name: "Mobile Dev", icon: Smartphone, description: "App Development" }
            ].map((tool, index) => (
              <motion.div
                key={tool.name}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.6 + index * 0.1, duration: 0.6 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/30 transition-colors duration-300">
                  <tool.icon className="w-6 h-6 text-accent" />
                </div>
                <h4 className="text-white font-semibold mb-2 group-hover:text-accent transition-colors duration-300">
                  {tool.name}
                </h4>
                <p className="text-gray-400 text-sm">{tool.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.8, duration: 0.8 }}
        >
          {[
            { number: "50+", label: "Projects Designed and Shipped" },
            { number: "5+", label: "Years of Designing Experience" },
            { number: "15+", label: "Design Tools Used" },
            { number: "100%", label: "Success Rate" }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center group"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 2 + index * 0.1, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-4xl md:text-5xl font-bold text-accent mb-2 group-hover:scale-110 transition-transform duration-300">
                {stat.number}
              </div>
              <div className="text-gray-400 text-sm leading-relaxed">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -25, 0],
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.8, 1],
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
