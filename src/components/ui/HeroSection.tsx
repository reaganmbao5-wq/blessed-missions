'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'

import Image from 'next/image'

interface HeroSectionProps {
  title: string
  subtitle: string
  images: string[]
}

export default function HeroSection({ title, subtitle, images }: HeroSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { scrollY } = useScroll()

  // Fade out hero logo as we scroll down to hand off to navbar
  const logoOpacity = useTransform(scrollY, [0, 80], [1, 0])
  const logoScale = useTransform(scrollY, [0, 80], [1, 0.95])

  // 7s interval for background images
  useEffect(() => {
    if (!images || images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [images])

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-black">
      {/* Background Images Stacking (Prevents Black Screen by pre-rendering all) */}
      {images.map((img, index) => {
        const isActive = index === currentIndex;
        return (
          <motion.div
            key={img}
            initial={false}
            animate={{ 
              opacity: isActive ? 1 : 0,
              scale: isActive ? 1.05 : 1
            }}
            transition={{ 
              opacity: { duration: 1.5, ease: "easeInOut" },
              scale: { duration: 8, ease: "linear" } 
            }}
            className="absolute inset-0 w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url(${img})` }}
          />
        )
      })}

      {/* Modern Cinematic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/60 pointer-events-none" />

      {/* Branded Logo (Repositioned to match Navbar container) */}
      <div className="absolute top-10 left-0 w-full z-40 hidden md:block">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div
            style={{ opacity: logoOpacity, scale: logoScale }}
          >
            <Image
              src="/logo.png"
              alt="Blessed Missions Campus Ministries"
              width={360}
              height={95}
              className="object-contain"
              priority
            />
          </motion.div>
        </div>
      </div>

      {/* Mobile Branding (Matching Navbar container) */}
      <div className="absolute top-8 left-0 w-full z-40 md:hidden">
        <div className="container mx-auto px-4">
          <motion.div
            style={{ opacity: logoOpacity }}
          >
            <Image
              src="/logo.png"
              alt="Blessed Missions Campus Ministries"
              width={240}
              height={65}
              className="object-contain"
              priority
            />
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center pb-24">
        {/* Use Serif Font for Hero Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.1] font-medium text-white tracking-normal mb-8"
        >
          {title}
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-xl md:text-2xl text-white/90 font-light max-w-3xl text-balance"
        >
          {subtitle}
        </motion.p>
      </div>
    </section>
  )
}
