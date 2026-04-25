'use client'

import { useState, useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { Search, Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Filter, Clock, SearchX, CalendarDays } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import VideoPlayerCard from './VideoPlayerCard'
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSunday, 
  addMonths, 
  subMonths,
  isSameDay,
  startOfToday,
  subDays
} from 'date-fns'

interface MediaExplorerProps {
  initialItems: any[]
  type: 'sermon' | 'highlight'
  title: string
}

export default function MediaExplorer({ initialItems, type, title }: MediaExplorerProps) {
  const searchParams = useSearchParams()
  const campusFilter = searchParams.get('campus') // 'kabwe' or 'main'

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // 1. Strict Campus Filtering
  const campusScopedItems = useMemo(() => {
    if (!campusFilter) return initialItems
    return initialItems.filter(item => item.campus === campusFilter)
  }, [initialItems, campusFilter])

  // 2. Search & Date Filtering
  const filteredItems = useMemo(() => {
    return campusScopedItems.filter(item => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const itemDate = new Date(item.created_at || item.session_date)
      const matchesDate = !selectedDate || isSameDay(itemDate, selectedDate)

      return matchesSearch && matchesDate
    })
  }, [campusScopedItems, searchQuery, selectedDate])

  // 3. Weekly Cohort Grouping
  const now = startOfToday()
  const oneWeekAgo = subDays(now, 7)
  const twoWeeksAgo = subDays(now, 14)

  const thisSundayItems = filteredItems.filter(i => new Date(i.created_at || i.session_date) >= oneWeekAgo)
  const lastSundayItems = filteredItems.filter(i => {
    const d = new Date(i.created_at || i.session_date)
    return d >= twoWeeksAgo && d < oneWeekAgo
  })
  const archiveItems = filteredItems.filter(i => new Date(i.created_at || i.session_date) < twoWeeksAgo)

  // Calendar Helpers
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-20 px-4 md:px-8">
      <div className="container mx-auto max-w-7xl">
        
        {/* Header with Breadcrumb-style Campus Badge */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
             <span className="px-3 py-1 bg-zinc-900 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-500">
               Archive Explorer
             </span>
             {campusFilter && (
               <span className="px-3 py-1 bg-ministry-accent text-[10px] font-black uppercase tracking-widest text-white rounded-full shadow-lg shadow-ministry-accent/20">
                 {campusFilter === 'kabwe' ? 'Town Campus' : 'Main Campus'}
               </span>
             )}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tighter font-serif italic mb-4">
            {title} <span className="not-italic text-zinc-500 font-sans">Vault</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl text-lg font-light leading-relaxed">
            Relive previous sessions, search by spiritual topic, or browse by Sunday date.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-16 relative z-50">
          <div className="relative flex-1 group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500 group-hover:text-ministry-accent transition-colors" size={20} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900/50 border border-white/5 p-5 pl-14 text-white focus:outline-none focus:border-ministry-accent/50 rounded-2xl transition-all hover:bg-zinc-900" 
              placeholder="Search by topic, speaker, or scriptural theme..." 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className={`flex items-center gap-3 px-8 py-5 border transition-all rounded-2xl h-full font-bold uppercase tracking-widest text-xs ${
                selectedDate || isCalendarOpen 
                ? 'bg-ministry-accent border-ministry-accent text-white' 
                : 'bg-zinc-900/50 border-white/5 text-zinc-400 hover:border-white/20'
              }`}
            >
              <CalendarIcon size={18} />
              {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'Filter by Sunday'}
            </button>

            {/* Custom Sunday-Highlighted Calendar */}
            <AnimatePresence>
              {isCalendarOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-80 bg-zinc-900 border border-white/10 p-6 rounded-[2rem] shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex justify-between items-center mb-6">
                    <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronLeft size={16} /></button>
                    <span className="text-xs font-black uppercase tracking-widest">{format(currentMonth, 'MMMM yyyy')}</span>
                    <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronRight size={16} /></button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-2">
                    {['S','M','T','W','T','F','S'].map((d, i) => (
                      <span key={i} className={`text-center text-[8px] font-black tracking-widest ${i === 0 ? 'text-red-500/50' : 'text-zinc-600'}`}>
                        {d}
                      </span>
                    ))}
                    {daysInMonth.map((day, i) => {
                      const isSun = isSunday(day)
                      const isSelected = selectedDate && isSameDay(day, selectedDate)
                      return (
                        <button 
                          key={i}
                          onClick={() => {
                            if (isSelected) setSelectedDate(null)
                            else setSelectedDate(day)
                            setIsCalendarOpen(false)
                          }}
                          className={`
                            aspect-square flex items-center justify-center rounded-xl text-[10px] font-bold transition-all relative
                            ${isSun ? 'text-red-500 border border-red-500/20' : 'text-zinc-400 hover:bg-white/5'}
                            ${isSelected ? 'bg-white text-black font-black hover:bg-white' : ''}
                          `}
                        >
                          {format(day, 'd')}
                          {isSun && <div className="absolute top-1 right-1 w-1 h-1 bg-red-500 rounded-full" />}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Results Area */}
        {filteredItems.length === 0 ? (
          <div className="py-24 text-center border-2 border-dashed border-white/5 bg-zinc-950/20 rounded-[3rem] animate-in fade-in zoom-in duration-500">
            <SearchX className="mx-auto text-zinc-800 mb-8" size={80} />
            <p className="text-2xl font-serif italic text-zinc-500">No spiritual sessions found matching your criteria.</p>
            <p className="text-xs uppercase tracking-[0.2em] font-black text-zinc-700 mt-4">Try broadening your search or choosing a different campus portal</p>
          </div>
        ) : (
          <div className="space-y-24">
            
            {thisSundayItems.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                <div className="flex items-center gap-6 mb-10">
                   <h3 className="text-xs font-black uppercase tracking-[0.4em] text-ministry-accent flex items-center gap-3 shrink-0">
                     <div className="w-2 h-2 rounded-full bg-ministry-accent animate-ping" /> This Cycle
                   </h3>
                   <div className="h-px bg-white/5 flex-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {thisSundayItems.map(item => (
                    <VideoPlayerCard key={item.id} highlight={item} />
                  ))}
                </div>
              </section>
            )}

            {lastSundayItems.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                <div className="flex items-center gap-6 mb-10">
                   <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500 flex items-center gap-3 shrink-0">
                     <Clock size={16} /> Last Week
                   </h3>
                   <div className="h-px bg-white/5 flex-1" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 opacity-80 hover:opacity-100 transition-opacity">
                  {lastSundayItems.map(item => (
                    <VideoPlayerCard key={item.id} highlight={item} />
                  ))}
                </div>
              </section>
            )}

            {archiveItems.length > 0 && (
              <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                <div className="flex items-center gap-6 mb-10 pt-10 border-t border-white/5">
                   <h3 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-700 flex items-center gap-3 shrink-0">
                     <CalendarDays size={16} /> Historical Vault
                   </h3>
                   <div className="h-px bg-white/5 flex-1" />
                   <span className="text-[10px] font-mono text-zinc-800 uppercase tracking-widest">{archiveItems.length} Sessions total</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
                  {archiveItems.map(item => (
                    <VideoPlayerCard key={item.id} highlight={item} />
                  ))}
                </div>
              </section>
            )}

          </div>
        )}

      </div>
    </div>
  )
}
