'use client'

import { useState, useEffect } from 'react'
import MasonryCarouselItem from './MasonryCarouselItem'

interface UnifiedMasonryGridProps {
  worshipImages: string[]
  groupsImages: string[]
  baptismImages: string[]
}

export default function UnifiedMasonryGrid({ worshipImages, groupsImages, baptismImages }: UnifiedMasonryGridProps) {
  const [syncIndex, setSyncIndex] = useState(0)

  useEffect(() => {
    // A single unified interval tick that drives all 3 boxes simultaneously
    const interval = setInterval(() => {
      setSyncIndex(prev => prev + 1)
    }, 6000) // Flip every 6 seconds
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="lg:col-span-6 grid grid-cols-2 gap-4 h-[600px]">
      <MasonryCarouselItem 
        label="Campus Worship" 
        images={worshipImages} 
        syncIndex={syncIndex}
      />
      <div className="flex flex-col gap-4 h-full">
        <div className="relative h-1/2">
          <MasonryCarouselItem 
            label="Small Groups" 
            images={groupsImages} 
            syncIndex={syncIndex}
          />
        </div>
        <div className="relative h-1/2">
          <MasonryCarouselItem 
            label="Baptisms" 
            images={baptismImages} 
            syncIndex={syncIndex}
          />
        </div>
      </div>
    </div>
  )
}
