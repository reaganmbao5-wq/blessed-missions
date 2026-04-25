'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface MasonryCarouselItemProps {
  label: string
  images: string[]
  syncIndex: number
}

export default function MasonryCarouselItem({ label, images, syncIndex }: MasonryCarouselItemProps) {
  // Use modulo so we don't crash if arrays have different specific lengths
  const activeLocalIndex = images.length > 0 ? (syncIndex % images.length) : 0


  return (
    <div className="relative h-full w-full overflow-hidden group cursor-pointer">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={activeLocalIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${images[activeLocalIndex]})` }}
        />
      </AnimatePresence>
      
      {/* Dark bottom gradient for text readability */}
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-10 transition-opacity duration-300 group-hover:opacity-100"></div>
      
      <h3 className="absolute bottom-6 left-6 text-white font-bold text-xl drop-shadow-md z-20 pointer-events-none">
        {label}
      </h3>
    </div>
  )
}
