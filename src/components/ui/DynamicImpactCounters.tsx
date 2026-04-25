'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

function Counter({ from, to, duration, suffix = '' }: { from: number, to: number, duration: number, suffix?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "-100px" })
  const [count, setCount] = useState(from)

  useEffect(() => {
    if (inView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        setCount(Math.floor(progress * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, from, to, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

export default function DynamicImpactCounters() {
  return (
    <div className="w-full py-20 relative overflow-hidden">
      {/* Decorative gradient bleed */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-full bg-mariners-teal/10 blur-[100px] pointer-events-none rounded-full" />
      
      <div className="max-w-[1400px] mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center divide-y md:divide-y-0 md:divide-x divide-gray-200">
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center pt-8 md:pt-0"
          >
            <h4 className="text-5xl md:text-7xl font-serif font-medium mb-4 text-mariners-salmon">
              <Counter from={0} to={500} duration={2.5} suffix="+" />
            </h4>
            <p className="uppercase tracking-[0.2em] text-xs font-bold text-gray-500">Souls Reached</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col items-center pt-8 md:pt-0"
          >
            <h4 className="text-5xl md:text-7xl font-serif font-medium mb-4 text-mariners-teal">
              <Counter from={0} to={2} duration={1.5} />
            </h4>
            <p className="uppercase tracking-[0.2em] text-xs font-bold text-gray-500">Thriving Campuses</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col items-center pt-8 md:pt-0"
          >
            <h4 className="text-5xl md:text-7xl font-serif font-medium mb-4 text-[#E6B981]">
              <Counter from={0} to={30} duration={2} suffix="+" />
            </h4>
            <p className="uppercase tracking-[0.2em] text-xs font-bold text-gray-500">House Groups</p>
          </motion.div>

        </div>
      </div>
    </div>
  )
}
