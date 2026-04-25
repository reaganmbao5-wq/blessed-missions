import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { CalendarIcon, MapPinIcon } from 'lucide-react'

export const revalidate = 60

export default async function EventsPage() {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true })

  const now = new Date().toISOString()
  
  // Use DB events or premium fallbacks if empty
  const allEvents = events?.length ? events : [
    {
      id: 'fallback-1',
      title: 'Revival Night',
      date: new Date(Date.now() + 86400000 * 3).toISOString(),
      description: 'A powerful night of worship, prayer, and spiritual awakening. Join us as we seek God for our campuses.',
      image: 'https://images.unsplash.com/photo-1470229722913-7c092bb2bb22?q=80&w=2670',
      campus: 'kabwe'
    },
    {
      id: 'fallback-2',
      title: 'Youth Leadership Summit',
      date: new Date(Date.now() + 86400000 * 10).toISOString(),
      description: 'Equipping the next generation of leaders. Practical sessions on influence, ethics, and vision.',
      image: 'https://images.unsplash.com/photo-1544427920-c49ccf08c146?q=80&w=2627',
      campus: 'main'
    }
  ]

  const upcomingEvents = allEvents.filter(e => e.date >= now)

  return (
    <div className="min-h-screen bg-black pt-24 pb-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold uppercase tracking-tight mb-4">Upcoming Events</h1>
          <p className="text-zinc-400 font-light max-w-2xl text-balance">
            Stay connected with what's happening across our campuses. Join us for fellowship, worship, and community service.
          </p>
        </div>

        {upcomingEvents.length > 0 ? (
          <div className="space-y-8">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="group flex flex-col md:flex-row bg-zinc-900 border border-white/10 overflow-hidden hover:border-white/30 transition-colors">
                {/* Image Section */}
                <div className="w-full md:w-2/5 aspect-[4/3] md:aspect-auto relative overflow-hidden">
                  <div 
                    className="absolute inset-0 bg-cover bg-center brightness-75 group-hover:scale-105 transition-transform duration-700"
                    style={{ backgroundImage: `url(${event.image})` }}
                  />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 border border-white/10">
                    <p className="text-ministry-accent text-xs font-bold uppercase tracking-widest">{event.campus}</p>
                  </div>
                </div>
                
                {/* Content Section */}
                <div className="w-full md:w-3/5 p-8 md:p-12 pl-8 flex flex-col justify-center">
                  <div className="flex items-center space-x-2 text-zinc-400 mb-4 text-sm font-medium tracking-wide">
                    <CalendarIcon size={16} />
                    <span>{format(new Date(event.date), 'EEEE, MMMM do, yyyy')}</span>
                    <span className="px-2">•</span>
                    <span>{format(new Date(event.date), 'h:mm a')}</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-bold uppercase mb-4 text-white group-hover:text-ministry-accent transition-colors">
                    {event.title}
                  </h2>
                  
                  <p className="text-zinc-300 font-light leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-zinc-500 border border-dashed border-white/10">
            <p>No upcoming events at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  )
}
