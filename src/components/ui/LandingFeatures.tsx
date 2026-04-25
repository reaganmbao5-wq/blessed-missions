'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import UnifiedMasonryGrid from './UnifiedMasonryGrid'

interface LandingFeaturesProps {
  worshipImages: string[]
  groupsImages: string[]
  baptismImages: string[]
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
}

export default function LandingFeatures({ worshipImages, groupsImages, baptismImages }: LandingFeaturesProps) {
  return (
    <>
      {/* OVERLAPPING CARDS SECTION (Glassmorphism + Staggered Reveal) */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-100px" }}
        className="relative z-20 -mt-24 md:-mt-32 px-4 mb-24 max-w-[1400px] mx-auto w-full"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-mariners-charcoal">
          
          <motion.div variants={cardVariants}>
            <Link href="/highlights" className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-[40px] p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 block group h-full">
              <div>
                <h3 className="font-serif text-2xl font-bold mb-4">Latest Highlights</h3>
                <p className="text-gray-600 mb-8 font-light">Catch up on Sunday gatherings and campus teachings.</p>
              </div>
              <div className="inline-flex items-center text-sm font-semibold uppercase tracking-wider text-mariners-salmon group-hover:text-black transition-colors">
                Watch Now <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </Link>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Link href="/gallery" className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-[40px] p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 block group h-full">
              <div>
                <h3 className="font-serif text-2xl font-bold mb-4">Campus Life</h3>
                <p className="text-gray-600 mb-8 font-light">See moments captured across our Town and Main campuses.</p>
              </div>
              <div className="inline-flex items-center text-sm font-semibold uppercase tracking-wider text-mariners-salmon group-hover:text-black transition-colors">
                View Gallery <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </Link>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Link href="/events" className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-[40px] p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 block group h-full">
              <div>
                <h3 className="font-serif text-2xl font-bold mb-4">Upcoming Events</h3>
                <p className="text-gray-600 mb-8 font-light">Join us for worship nights, outreaches, and fellowships.</p>
              </div>
              <div className="inline-flex items-center text-sm font-semibold uppercase tracking-wider text-mariners-salmon group-hover:text-black transition-colors">
                Read More <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </Link>
          </motion.div>

          <motion.div variants={cardVariants}>
            <Link href="/visit" className="bg-white/90 backdrop-blur-xl border border-white/40 rounded-[40px] p-10 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.08)] flex flex-col justify-between hover:-translate-y-2 transition-transform duration-300 block group h-full">
              <div>
                <h3 className="font-serif text-2xl font-bold mb-4">Plan a Visit</h3>
                <p className="text-gray-600 mb-8 font-light">Find our service times, locations, and what to expect.</p>
              </div>
              <div className="inline-flex items-center text-sm font-semibold uppercase tracking-wider text-mariners-salmon group-hover:text-black transition-colors">
                Get Directions <ArrowRight size={16} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* SPLIT TEXT & MASONRY GRID SECTION (Scroll Reveal) */}
      <section className="bg-white py-24 px-4 w-full">
        <div className="container mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="lg:col-span-4 lg:col-start-2"
          >
            <h2 className="font-serif text-4xl md:text-5xl font-medium text-mariners-charcoal mb-4 leading-tight">
              One Church.<br />Multiple Campuses.
            </h2>
            <p className="text-gray-500 mb-8 text-sm uppercase tracking-widest font-semibold">
              Kabwe • Main Mposhi
            </p>
            <p className="text-gray-600 leading-relaxed font-light mb-10 text-lg">
              We are a vibrant community of students and young professionals dedicated to growing in faith, serving our campuses, and making a lasting impact in the world. You have a home here.
            </p>
            <Link 
              href="/visit" 
              className="inline-block bg-mariners-teal text-white px-8 py-4 text-sm font-bold uppercase tracking-widest hover:bg-opacity-90 transition-all duration-300"
            >
              Learn More
            </Link>
          </motion.div>

          <motion.div 
             initial={{ opacity: 0, scale: 0.95 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true, margin: "-100px" }}
             transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
             className="lg:col-span-6 h-[600px] w-full"
          >
            <UnifiedMasonryGrid 
              worshipImages={worshipImages}
              groupsImages={groupsImages}
              baptismImages={baptismImages}
            />
          </motion.div>
        </div>
      </section>
    </>
  )
}
