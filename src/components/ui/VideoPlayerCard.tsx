'use client'

import { useState } from 'react'

interface VideoPlayerCardProps {
  highlight: {
    id: string
    title: string
    video_url: string
    thumbnail: string
    description: string
    campus: string
    created_at: string
  }
  isFeatured?: boolean
}

// Helper to extract YouTube ID
function getYouTubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

export default function VideoPlayerCard({ highlight, isFeatured = false }: VideoPlayerCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const videoId = getYouTubeId(highlight.video_url)
  const thumbnail = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : highlight.thumbnail

  if (isFeatured) {
    return (
      <div className="mb-16">
        <h2 className="text-sm font-semibold tracking-widest text-zinc-500 uppercase mb-4">Latest Featured</h2>
        <div className="block group relative aspect-video w-full bg-zinc-900 border border-white/10 overflow-hidden cursor-pointer" onClick={() => !isPlaying && setIsPlaying(true)}>
          {!isPlaying || !videoId ? (
            <>
              <div 
                className="absolute inset-0 bg-cover bg-center brightness-75 group-hover:brightness-100 transition-all duration-500"
                style={{ backgroundImage: `url(${thumbnail})` }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-colors">
                    <div className="w-0 h-0 border-t-[10px] border-t-transparent border-l-[15px] border-l-white border-b-[10px] border-b-transparent ml-2 group-hover:scale-110 transition-transform" />
                 </div>
              </div>
              <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full bg-gradient-to-t from-black/90 via-black/60 to-transparent pointer-events-none flex flex-col justify-end">
                <p className="text-ministry-accent text-xs md:text-sm font-bold uppercase tracking-wider mb-2 drop-shadow-md">
                  {highlight.campus} Campus
                </p>
                <h3 className="text-2xl md:text-4xl font-bold uppercase mb-2 text-white drop-shadow-lg">{highlight.title}</h3>
                <div className="pointer-events-auto max-h-[150px] overflow-y-auto pr-4 thin-scrollbar">
                  <p className="text-zinc-200 text-sm md:text-base whitespace-pre-wrap">{highlight.description}</p>
                </div>
              </div>
            </>
          ) : (
            <iframe
              className="absolute inset-0 w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={highlight.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          )}
        </div>
      </div>
    )
  }

  // Standard Card
  return (
    <>
      <div className="block group cursor-pointer" onClick={() => setIsPlaying(true)}>
        <div className="aspect-video bg-zinc-900 border border-white/10 overflow-hidden relative mb-4">
          <div 
            className="absolute inset-0 bg-cover bg-center brightness-75 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
            style={{ backgroundImage: `url(${thumbnail})` }}
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
             </div>
          </div>
        </div>
        <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-1">
          {highlight.campus} Campus • {new Date(highlight.created_at).toLocaleDateString()}
        </p>
        <h3 className="text-lg font-bold uppercase line-clamp-1 group-hover:text-ministry-accent transition-colors text-white">{highlight.title}</h3>
      </div>

      {/* Native Full-Screen Modal for Standard Cards */}
      {isPlaying && videoId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12 backdrop-blur-sm">
          <button 
            onClick={() => setIsPlaying(false)}
            className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 p-3 rounded-full hover:bg-white/10 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
          
          <div className="w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden border border-white/10 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title={highlight.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </>
  )
}
