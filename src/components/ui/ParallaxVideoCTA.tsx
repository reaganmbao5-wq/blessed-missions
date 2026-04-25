'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function ParallaxVideoCTA() {
  const containerRef = useRef(null)
  
  // Create a parallax scroll effect for the background
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })
  
  // Background images moves slightly slower than the scroll creating depth
  const y = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 1, 0.5])

  return (
    <div ref={containerRef} className="relative w-full h-[80vh] min-h-[600px] overflow-hidden bg-black flex items-center justify-center">
      
      <motion.div 
        style={{ ...{ y, opacity }, backgroundImage: 'url(https://images.unsplash.com/photo-1438232992991-995b7058bab3?q=80&w=2673&auto=format&fit=crop)' }}
        className="absolute inset-0 w-full h-[140%] -top-[20%] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-mariners-charcoal/60 mix-blend-multiply" />
      </motion.div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           transition={{ duration: 0.8, ease: "easeOut" }}
           className="w-16 h-16 md:w-20 md:h-20 bg-mariners-teal rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(45,180,170,0.4)]"
        >
           <span className="text-white font-serif text-3xl font-bold italic">B</span>
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
        >
          You Belong Here.
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg md:text-xl text-white/80 font-light mb-12 max-w-2xl"
        >
          Join us this Sunday and experience a community where you are known, loved, and challenged to grow.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link 
            href="/visit" 
            className="group relative inline-flex items-center justify-center px-10 py-5 font-bold uppercase tracking-widest text-white transition-all duration-300"
          >
            {/* Glowing border effect */}
            <div className="absolute inset-0 rounded-full border border-white/30 backdrop-blur-sm transition-all duration-300 group-hover:bg-white/10 group-hover:border-white/60" />
            
            <span className="relative z-10 flex items-center">
              Plan Your Visit <ArrowRight size={18} className="ml-3 group-hover:translate-x-2 transition-transform" />
            </span>
          </Link>
        </motion.div>
      </div>

    </div>
  )
}
