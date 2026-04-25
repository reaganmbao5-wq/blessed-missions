'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Users, HeartHandshake, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const steps = [
  {
    id: 1,
    title: "Visit a Campus",
    icon: MapPin,
    description: "Join us this Sunday at Main Campus or Kabwe Campus. Experience authentic worship and deeply rooted biblical teaching.",
    action: "Get Directions",
    link: "/visit",
    image: "https://images.unsplash.com/photo-1543165365-0723ec0041d4?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 2,
    title: "Join a House Group",
    icon: Users,
    description: "Don't do college alone. Our small groups meet mid-week across campus to study the Word, pray, and build lifelong friendships.",
    action: "Find a Group",
    link: "/visit",
    image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000&auto=format&fit=crop"
  },
  {
    id: 3,
    title: "Serve the Vision",
    icon: HeartHandshake,
    description: "Use your gifts to serve the house. From the Media Crew to the Worship Team, there is a place for you to make a tangible impact.",
    action: "Join a Team",
    link: "/visit",
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop"
  }
]

export default function InteractiveBentoSteps() {
  const [activeStep, setActiveStep] = useState<number>(1)

  return (
    <div className="w-full bg-white py-24 px-4 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-5xl font-medium text-mariners-charcoal mb-4">
            Next Steps
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto font-light">
            We believe that church is more than just a Sunday event. It's a community. Here is how you can get deeply planted.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[500px]">
          {steps.map((step) => {
            const isActive = activeStep === step.id
            
            return (
              <motion.div
                key={step.id}
                layout
                onClick={() => setActiveStep(step.id)}
                onMouseEnter={() => setActiveStep(step.id)}
                className={`relative rounded-[40px] cursor-pointer overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isActive ? 'lg:flex-[3] h-[400px] lg:h-auto' : 'lg:flex-[1] h-[120px] lg:h-auto'
                }`}
              >
                {/* Background Image (Only visible when active) */}
                <div 
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  style={{ backgroundImage: `url(${step.image})` }}
                />
                
                {/* Gradients */}
                <div className={`absolute inset-0 transition-opacity duration-500 ${isActive ? 'bg-gradient-to-t from-black/80 via-black/30 to-black/30' : 'bg-zinc-100 hover:bg-zinc-200'}`} />

                {/* Content */}
                <div className={`absolute inset-0 p-8 md:p-10 flex flex-col justify-end transition-colors duration-500 ${isActive ? 'text-white' : 'text-mariners-charcoal'}`}>
                  
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-auto transition-colors duration-500 ${isActive ? 'bg-white/20 backdrop-blur-md' : 'bg-white shadow-sm'}`}>
                    <step.icon size={20} className={isActive ? 'text-white' : 'text-mariners-salmon'} />
                  </div>

                  {/* Text Container */}
                  <motion.div layout="position" className="mt-4">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className={`text-sm font-bold font-mono tracking-widest ${isActive ? 'text-mariners-teal' : 'text-zinc-400'}`}>
                        0{step.id}
                      </span>
                      <h3 className="font-serif text-2xl md:text-3xl font-bold whitespace-nowrap">
                        {step.title}
                      </h3>
                    </div>
                    
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <p className="font-light text-white/80 max-w-md mt-4 mb-8 leading-relaxed">
                            {step.description}
                          </p>
                          <Link 
                            href={step.link}
                            className="inline-flex items-center text-xs font-bold uppercase tracking-widest bg-white text-black px-6 py-3 rounded-full hover:bg-mariners-teal hover:text-white transition-colors group"
                          >
                            {step.action} <ArrowRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
