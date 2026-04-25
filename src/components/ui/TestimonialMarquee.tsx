'use client'

import { motion } from 'framer-motion'

const DEFAULT_TESTIMONIALS = [
  { quote: "Blessed Missions gave me a family on campus when I felt completely lost.", author: "Sarah T.", campus: "Main Campus", image_url: null },
  { quote: "The worship here is undeniably authentic. It shifted my entire perspective.", author: "David M.", campus: "Kabwe Campus", image_url: null },
  { quote: "Small groups have been the anchor of my week. Real friends, real faith.", author: "Grace K.", campus: "Main Campus", image_url: null },
  { quote: "I came to visit once and never left. The love here is contagious.", author: "Emmanuel", campus: "Kabwe Campus", image_url: null },
]

export default function TestimonialMarquee({ dynamicTestimonies = [] }: { dynamicTestimonies?: any[] }) {
  // If we have less than 4 testimonies dynamically, combine with defaults to ensure scrolling looks full
  let baseData = [...dynamicTestimonies]
  
  if (baseData.length < 4) {
    const needed = 4 - baseData.length
    baseData = [...baseData, ...DEFAULT_TESTIMONIALS.slice(0, needed)]
  }

  // Duplicate the final array to enable seamless infinite scrolling
  const displayTestimonials = [...baseData, ...baseData]

  return (
    <div className="w-full bg-mariners-cream py-24 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-4 mb-12">
        <h2 className="font-serif text-3xl md:text-5xl font-medium text-mariners-charcoal mb-4">
          Voices of the Ministry
        </h2>
        <div className="w-20 h-1 bg-mariners-salmon" />
      </div>

      <div className="relative flex inset-0 w-[200vw] overflow-hidden group">
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ ease: "linear", duration: 35, repeat: Infinity }}
          className="flex gap-8 px-4"
        >
          {displayTestimonials.map((t, idx) => (
            <div 
              key={idx} 
              className="w-[300px] md:w-[400px] flex-shrink-0 bg-white border border-black/5 p-8 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 flex flex-col justify-between"
            >
              <p className="text-gray-600 font-light text-lg mb-8 leading-relaxed italic">
                "{t.quote}"
              </p>
              <div className="flex items-center space-x-3 mt-auto">
                {t.image_url ? (
                  <img src={t.image_url} alt={t.author} className="w-10 h-10 rounded-full object-cover border border-black/10" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-mariners-teal/10 flex items-center justify-center text-mariners-teal font-bold font-serif shadow-inner">
                    {t.author.charAt(0)}
                  </div>
                )}
                <div>
                  <h5 className="font-bold text-sm text-mariners-charcoal">{t.author}</h5>
                  <p className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold">
                    {t.campus === 'kabwe' ? 'Town Campus' : t.campus === 'main' ? 'Main Campus' : t.campus}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Fade Gradients for smooth edge cutoff */}
      <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-mariners-cream to-transparent pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-mariners-cream to-transparent pointer-events-none" />
    </div>
  )
}
