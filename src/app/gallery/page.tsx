import { createClient } from '@/lib/supabase/server'
import GalleryClient from './GalleryClient'

export const dynamic = 'force-dynamic'

export default async function GalleryPage() {
  const supabase = await createClient()
  
  // Fetch both photo gallery and video highlights
  const [
    { data: galleryImages },
    { data: highlights }
  ] = await Promise.all([
    supabase.from('gallery').select('*').order('created_at', { ascending: false }),
    supabase.from('highlights').select('*').order('session_date', { ascending: false })
  ])

  // Process data for the client
  const photos = galleryImages || []
  const sermons = highlights || []

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4 text-white">
      <div className="container mx-auto max-w-7xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">Ministry Media</h1>
          <p className="text-zinc-400 font-light max-w-2xl">
            Moments captured across our campuses and spiritual teachings for your journey. 
            Select a category below to explore.
          </p>
        </div>

        <GalleryClient initialPhotos={photos as any} initialSermons={sermons as any} />
      </div>
    </div>
  )
}
