'use client'

import { useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { Mail, Phone, MapPin, Send, Instagram, Linkedin, Github, Globe } from 'lucide-react'

export default function Contact() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll()
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })
  
  const y = useTransform(scrollYProgress, [0, 1], [0, -100])
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [1, 1, 0.5, 0])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "hello@theonlyrosh.com",
      link: "mailto:hello@theonlyrosh.com",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+353 87 123 4567",
      link: "tel:+353871234567",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Dublin, Ireland",
      link: "#",
      color: "from-purple-500 to-pink-500"
    }
  ]

  const socialLinks = [
    { name: "Instagram", icon: Instagram, link: "https://instagram.com/theonlyrosh", color: "from-pink-500 to-rose-500" },
    { name: "LinkedIn", icon: Linkedin, link: "https://linkedin.com/in/roshannajar", color: "from-blue-500 to-indigo-500" },
    { name: "Portfolio", icon: Globe, link: "https://theonlyrosh.com", color: "from-blue-600 to-blue-700" },
    { name: "GitHub", icon: Github, link: "https://github.com/roshannajar", color: "from-gray-600 to-gray-800" }
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setIsSubmitting(false)
    setIsSubmitted(true)
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({ name: '', email: '', subject: '', message: '' })
    }, 3000)
  }

  return (
    <motion.section
      id="contact"
      ref={containerRef}
      className="relative min-h-screen bg-gradient-to-b from-black via-dark-gray to-black py-20 overflow-hidden"
      style={{ y, opacity }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-gradient-to-r from-purple-500/5 to-accent/5 rounded-full blur-3xl" />
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
            Let's <span className="gradient-text">Work</span> Together
          </motion.h2>
          
          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Based in Ireland, I am an Architect by training, a creator by nature and a UX Designer. 
            My architectural journey has taught me to build more than just structures; it's about crafting 
            experiences with empathy that leave an indelible mark.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left Column - Contact Form */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">
                Send Me a <span className="gradient-text">Message</span>
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Ready to start your next project? Let's discuss how we can bring your ideas to life 
                with cutting-edge design and technology.
              </p>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.8, duration: 0.6 }}
                >
                  <label className="block text-white font-medium mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors duration-300"
                    placeholder="Your name"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.9, duration: 0.6 }}
                >
                  <label className="block text-white font-medium mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors duration-300"
                    placeholder="your@email.com"
                  />
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1, duration: 0.6 }}
              >
                <label className="block text-white font-medium mb-2">Subject</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors duration-300"
                  placeholder="What's this about?"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.1, duration: 0.6 }}
              >
                <label className="block text-white font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-accent transition-colors duration-300 resize-none"
                  placeholder="Tell me about your project..."
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-8 py-4 bg-accent text-black font-bold rounded-lg hover:bg-accent/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.2, duration: 0.6 }}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center justify-center gap-3">
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      Sending Message...
                    </>
                  ) : isSubmitted ? (
                    <>
                      <div className="w-5 h-5 bg-green-500 rounded-full" />
                      Message Sent!
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      Send Message
                    </>
                  )}
                </span>
              </motion.button>
            </form>
          </motion.div>

          {/* Right Column - Contact Info & Social */}
          <motion.div
            className="space-y-8"
            initial={{ opacity: 0, x: 50 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-white mb-6">
                Get in <span className="gradient-text">Touch</span>
              </h3>
              
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.title}
                  href={info.link}
                  className="group flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, x: 30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 1 + index * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.02, x: 5 }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <info.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold group-hover:text-accent transition-colors duration-300">
                      {info.title}
                    </h4>
                    <p className="text-gray-300">{info.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white">
                Follow My <span className="gradient-text">Journey</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.name}
                    href={social.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.4 + index * 0.1, duration: 0.6 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <div className={`w-10 h-10 bg-gradient-to-r ${social.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                      <social.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-medium group-hover:text-accent transition-colors duration-300">
                      {social.name}
                    </span>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <motion.div
              className="bg-gradient-to-r from-accent/20 to-blue-500/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.6, duration: 0.8 }}
            >
              <h4 className="text-white font-semibold mb-4">Quick Facts</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-accent font-bold">5+</div>
                  <div className="text-gray-400">Years Experience</div>
                </div>
                <div>
                  <div className="text-accent font-bold">50+</div>
                  <div className="text-gray-400">Projects Completed</div>
                </div>
                <div>
                  <div className="text-accent font-bold">24h</div>
                  <div className="text-gray-400">Response Time</div>
                </div>
                <div>
                  <div className="text-accent font-bold">100%</div>
                  <div className="text-gray-400">Client Satisfaction</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <div className="inline-block bg-gradient-to-r from-accent/20 to-blue-500/20 backdrop-blur-sm border border-white/10 rounded-2xl p-8 max-w-3xl">
            <h3 className="text-3xl font-bold text-white mb-4">
              Ready to Create Something Amazing?
            </h3>
            <p className="text-gray-300 mb-6 text-lg">
              Let's turn your vision into reality with innovative design and cutting-edge technology.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                className="px-8 py-4 bg-accent text-black font-bold rounded-full hover:bg-accent/90 transition-colors"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Start Your Project
              </motion.button>
              <motion.button
                className="px-8 py-4 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                Download Portfolio
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full"
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
