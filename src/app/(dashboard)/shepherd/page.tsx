import { createClient } from '@/lib/supabase/server'
import ShepherdTabbedView from '@/components/studio/ShepherdTabbedView'

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function ShepherdDashboardPage() {
  const supabase = await createClient()
  
  // Basic analytics fetching
  const { data: visitors } = await supabase.from('visitors').select('*').order('date_recorded', { ascending: false })
  const allRecords = (visitors as any[]) || []
  
  // Weekly calculations
  const oneWeekAgo = new Date()
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
  const isThisWeek = (dateStr: string) => new Date(dateStr) >= oneWeekAgo

  const newSouls = allRecords.filter(v => v.is_new_soul)
  const regularVisitors = allRecords.filter(v => !v.is_new_soul)
  
  const totalNewSoulsWeekly = newSouls.filter(v => isThisWeek(v.date_recorded)).length
  const totalVisitorsWeekly = regularVisitors.filter(v => isThisWeek(v.date_recorded)).length
  
  const needsPrayerCount = allRecords.filter(v => v.needs_prayer && v.follow_up_status !== 'followed_up').length
  const needsHelpCount = allRecords.filter(v => v.needs_help && v.follow_up_status !== 'followed_up').length
  
  const kabweNewSouls = newSouls.filter(v => v.campus === 'kabwe').length
  const mainNewSouls = newSouls.filter(v => v.campus === 'main').length
  
  const kabweVisitors = regularVisitors.filter(v => v.campus === 'kabwe').length
  const mainVisitors = regularVisitors.filter(v => v.campus === 'main').length

  const stats = {
    totalNewSoulsWeekly,
    totalVisitorsWeekly,
    needsPrayerCount,
    needsHelpCount,
    kabweNewSouls,
    mainNewSouls,
    kabweVisitors,
    mainVisitors
  }

  return (
    <div className="max-w-[1700px] mx-auto relative pb-20 px-4 md:px-8">
      <div className="mb-12">
        <h1 className="text-4xl lg:text-7xl font-bold uppercase tracking-tight text-white mb-4 font-serif italic">
          Shepherd <span className="text-ministry-accent not-italic font-sans">Core</span>
        </h1>
        <p className="text-zinc-500 font-light text-xl max-w-3xl leading-relaxed">
          The central cognitive hub for ministry oversight. Manage spiritual growth, moderate global media, and track the impact of every campus session.
        </p>
      </div>

      <ShepherdTabbedView stats={stats} allRecords={allRecords} />
    </div>
  )
}

