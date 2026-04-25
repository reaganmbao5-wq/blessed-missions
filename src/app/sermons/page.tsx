import { createClient } from '@/lib/supabase/server'
import MediaExplorer from '@/components/ui/MediaExplorer'

export const dynamic = 'force-dynamic'

export default async function SermonsPage() {
  const supabase = await createClient()
  
  const { data: allHighlights } = await supabase
    .from('highlights')
    .select('*')
    .order('created_at', { ascending: false })

  // Filter for sermons (includes 'sermon', 'both', or entries missing the type)
  const sermons = (allHighlights as any[])?.filter(h => !h.video_type || h.video_type === 'sermon' || h.video_type === 'both') || []

  return (
    <MediaExplorer 
      initialItems={sermons} 
      type="sermon" 
      title="Sermon"
    />
  )
}
