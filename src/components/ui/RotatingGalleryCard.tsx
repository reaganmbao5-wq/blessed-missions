import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlayCircle } from 'lucide-react';

interface RotatingGalleryCardProps {
  galleryItem: {
    id: string;
    title: string;
    image_url?: string;
    image_urls?: string[];
    created_at: string;
    campus: 'kabwe' | 'main';
    is_featured: boolean;
  };
}

export default function RotatingGalleryCard({ galleryItem }: RotatingGalleryCardProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = galleryItem.image_urls && galleryItem.image_urls.length > 0 
    ? galleryItem.image_urls 
    : galleryItem.image_url 
      ? [galleryItem.image_url] 
      : ['https://placehold.co/800x1200/1a1a1a/ffffff?text=No+Image'];

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <div className="relative rounded-2xl overflow-hidden group transition-transform duration-300 ease-in-out hover:scale-105 bg-black">
      
      {/* Invisible relative anchor image to set exact natural height of the card for the Masonry columns (Portrait/Landscape) */}
      <img
        src={images[0]}
        alt={galleryItem.title}
        className="w-full h-auto object-cover opacity-0 invisible"
        onError={(e) => {
          e.currentTarget.src = 'https://placehold.co/800x1200/1a1a1a/ffffff?text=No+Image';
        }}
      />

      <AnimatePresence mode="popLayout">
        <motion.img
          key={currentIndex}
          src={images[currentIndex]}
          alt={galleryItem.title}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

      <div className="absolute top-0 left-0 p-4 text-white w-full pointer-events-none">
        <div className="flex items-center gap-3 mb-2">
          <img
            src="https://images.unsplash.com/photo-1438232992991-995b7058bab3?q=80&w=2673&auto=format&fit=crop"
            className="w-8 h-8 rounded-full border-2 border-white/80 object-cover bg-black"
            alt={galleryItem.campus}
          />
          <span className="font-semibold text-sm drop-shadow-md uppercase">
            {galleryItem.campus} Campus
          </span>
        </div>
        
        <p className="text-sm font-medium leading-tight drop-shadow-md">
          {galleryItem.title}
        </p>
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 px-4 z-20">
          {images.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-500 shadow-sm ${idx === currentIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
