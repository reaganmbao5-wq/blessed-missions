import { createClient } from '@/lib/supabase/server'
import MediaExplorer from '@/components/ui/MediaExplorer'

export const dynamic = 'force-dynamic'

export default async function HighlightsPage() {
  const supabase = await createClient()
  
  const { data: allHighlights } = await supabase
    .from('highlights')
    .select('*')
    .order('created_at', { ascending: false })

  // Filter for highlights (includes 'highlight', 'both', or entries missing the type)
  const highlights = allHighlights?.filter(h => !h.video_type || h.video_type === 'highlight' || h.video_type === 'both') || []

  return (
    <MediaExplorer 
      initialItems={highlights} 
      type="highlight" 
      title="Highlights"
    />
  )
}
