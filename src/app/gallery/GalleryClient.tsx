'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, BookOpen, PlayCircle, X } from 'lucide-react'
import { MasonryGrid } from '@/components/ui/image-testimonial-grid'
import RotatingGalleryCard from '@/components/ui/RotatingGalleryCard'

// Helper to extract YouTube ID dynamically
function getYouTubeId(url: string) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

// Helper to get fallback thumbnail
function getThumbnail(url: string, dbThumbnail: string) {
  const id = getYouTubeId(url);
  // Only fallback to DB if there is no youtube ID AND DB is not the default unplash
  if (id) return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  return dbThumbnail || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800';
}

interface GalleryImage {
  id: string
  title: string
  image_url?: string
  image_urls?: string[]
  campus: 'kabwe' | 'main'
  is_featured: boolean
  created_at: string
}

interface SermonHighlight {
  id: string
  title: string
  video_url: string
  video_type: 'sermon' | 'highlight' | 'both'
  summary?: string
  description: string
  session_date: string
  campus: 'kabwe' | 'main'
  thumbnail: string
}

interface GalleryClientProps {
  initialPhotos: GalleryImage[]
  initialSermons: SermonHighlight[]
}

export default function GalleryClient({ initialPhotos, initialSermons }: GalleryClientProps) {
  const [activeTab, setActiveTab] = useState<'featured' | 'kabwe' | 'main' | 'sermons'>('featured')
  const [columns, setColumns] = useState(3);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  // Determine columns based on screen width
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 1024) setColumns(2);
      else setColumns(3);
    };

    handleResize(); // Set initial columns
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const filteredPhotos = initialPhotos.filter((img) => {
    if (activeTab === 'sermons') return false
    if (activeTab === 'featured') return img.is_featured
    return img.campus === activeTab
  })

  const filteredSermons = initialSermons.filter((sermon) => {
    const isSermon = sermon.video_type === 'sermon' || sermon.video_type === 'both' || !sermon.video_type;
    if (activeTab === 'sermons') return isSermon
    if (activeTab === 'featured') return false 
    return false
  })

  return (
    <div>
      {/* Tabs */}
      <div className="flex flex-wrap gap-4 mb-12">
        {(['featured', 'kabwe', 'main', 'sermons'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-3 text-sm font-bold uppercase tracking-widest transition-all border ${
              activeTab === tab 
                ? 'border-ministry-accent bg-ministry-accent text-white' 
                : 'border-white/10 text-zinc-500 hover:border-white/30 hover:text-white'
            }`}
          >
            {tab === 'featured' ? 'Featured' : tab === 'sermons' ? 'Sermons & Summaries' : `${tab} Campus`}
          </button>
        ))}
      </div>

      <motion.div layout className="min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {/* Photos Grid using 21st.dev Masonry */}
          {(activeTab !== 'sermons') && (
            <motion.div 
              key="photos-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <MasonryGrid columns={Math.min(filteredPhotos.length || 1, columns)} gap={6}>
                {filteredPhotos.map((img) => (
                  <RotatingGalleryCard key={img.id} galleryItem={img} />
                ))}
              </MasonryGrid>
            </motion.div>
          )}

          {/* Sermons List */}
          {activeTab === 'sermons' && (
            <motion.div 
              key="sermons-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="space-y-8 max-w-4xl"
            >
              {filteredSermons.length > 0 ? filteredSermons.map((sermon) => (
                <div key={sermon.id} className="bg-zinc-900/50 border border-white/5 p-8 flex flex-col md:flex-row gap-8 hover:border-white/10 transition-colors">
                  <div onClick={() => setActiveVideo(getYouTubeId(sermon.video_url))} className="block w-full md:w-64 aspect-video bg-black relative group cursor-pointer overflow-hidden border border-white/5 shadow-lg">
                     <div 
                       className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:scale-105 transition-transform duration-500"
                       style={{ backgroundImage: `url(${getThumbnail(sermon.video_url, sermon.thumbnail)})` }}
                     />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <PlayCircle className="text-white group-hover:text-ministry-accent group-hover:scale-110 transition-all" size={48} />
                     </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
                      <span className="px-2 py-1 bg-ministry-accent/10 border border-ministry-accent/20 text-ministry-accent text-[10px] font-bold uppercase tracking-widest rounded-sm">
                        {sermon.campus}
                      </span>
                      <div className="flex items-center text-zinc-500 text-xs font-medium uppercase tracking-wider">
                        <Calendar size={12} className="mr-1.5" />
                        {new Date(sermon.session_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold uppercase text-white mb-4 tracking-tight">{sermon.title}</h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <BookOpen size={16} className="text-ministry-accent mr-3 mt-1 shrink-0" />
                        <div className="text-zinc-400 text-sm font-light leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {sermon.description || "No summary available for this session."}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="py-20 text-center text-zinc-500 border border-dashed border-white/10 uppercase tracking-widest text-xs">
                  No sermons have been uploaded yet. Check back soon.
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {activeTab !== 'sermons' && filteredPhotos.length === 0 && (
        <div className="py-20 text-center text-zinc-500 border border-dashed border-white/10 uppercase tracking-widest text-xs">
          No moments found for this category.
        </div>
      )}

      {/* Native Video Modal */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 md:p-12 backdrop-blur-sm"
          >
            <button 
              onClick={() => setActiveVideo(null)}
              className="absolute top-6 right-6 text-white/50 hover:text-white bg-white/5 p-3 rounded-full hover:bg-white/10 transition-all"
            >
              <X size={24} />
            </button>
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-6xl aspect-video bg-black rounded-lg overflow-hidden border border-white/10 shadow-2xl"
            >
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo}?autoplay=1`}
                title="Sermon Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
