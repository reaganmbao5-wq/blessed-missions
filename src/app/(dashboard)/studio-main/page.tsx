import { createClient } from '@/lib/supabase/server'
import StudioDashboard from '@/components/studio/StudioDashboard'
import { redirect } from 'next/navigation'

export default async function MainStudioPage() {
  const supabase = await createClient()
  
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { count: visitorCount } = await supabase
    .from('visitors')
    .select('*', { count: 'exact', head: true })
    .eq('campus', 'main')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">Main Studio</h1>
        <p className="text-zinc-400 font-light">Welcome, Media Crew.</p>
      </div>

      <StudioDashboard 
        campus="main" 
        visitorCount={visitorCount || 0} 
        userId={session.user.id} 
      />
    </div>
  )
}
