'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Calendar, Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, Filter, SearchX, CalendarDays as CalendarDaysIcon, Star, Trash2, Image as ImageIcon, Video, Loader2, Clock, ChevronDown } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSunday, addMonths, subMonths, isSameDay } from 'date-fns'
import ConfirmDialog from '../ui/ConfirmDialog'

interface ShepherdMediaControlProps {
  campusFilter?: 'kabwe' | 'main'
}

export default function ShepherdMediaControl({ campusFilter }: ShepherdMediaControlProps) {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [activeTab, setActiveTab] = useState<'gallery' | 'highlights' | 'events'>('gallery')
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showArchive, setShowArchive] = useState(false)
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Dialog State
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<{ id: string, title: string } | null>(null)

  const fetchData = async (table: string) => {
    setLoading(true)
    let query = supabase.from(table).select('*').order('created_at', { ascending: false })
    
    if (campusFilter) {
      query = query.eq('campus', campusFilter)
    }

    const { data, error } = await query
    if (!error && data) setItems(data)
    setLoading(false)
    setShowArchive(false)
  }

  useEffect(() => {
    fetchData(activeTab)
    setSearchQuery('')
    setSelectedDate(null)
  }, [activeTab, campusFilter])

  const openDeleteConfirm = (id: string, title?: string) => {
    setPendingDelete({ id, title: title || 'this item' })
    setConfirmOpen(true)
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    const { id } = pendingDelete

    const previousItems = [...items]
    setItems(items.filter(i => i.id !== id))
    setConfirmOpen(false)
    toast.success('Item Deleted', { description: 'Permanently removed from the system.' })

    const { error } = await supabase.from(activeTab).delete().eq('id', id)
    
    if (error) {
      toast.error('Deletion Failed', { description: 'Could not remove from database.' })
      setItems(previousItems)
    }
  }

  const toggleFeature = async (id: string, currentState: boolean, title?: string) => {
    const newState = !currentState
    setItems(items.map(i => i.id === id ? { ...i, is_featured: newState } : i))
    
    toast.success(newState ? 'Content Featured' : 'Feature Removed', {
      description: `${title || 'Item'} will ${newState ? 'now appear' : 'no longer appear'} natively on the homepage highlights.`
    })

    const { error } = await supabase.from(activeTab).update({ is_featured: newState }).eq('id', id)
    if (error) {
       toast.error('Sync Error', { description: 'Failed to update database.' })
       fetchData(activeTab)
    }
  }

  const formatCampus = (campus: string) => campus === 'kabwe' ? 'Town Campus' : 'Main Campus';

  const RenderCard = ({ item, isLarge = false }: { item: any, isLarge?: boolean }) => {
    const isFeatured = item.is_featured || false;
    const imageUrl = item.image_url || (item.image_urls && item.image_urls[0]) || item.thumbnail || item.image;
    const itemTitle = item.title || 'Untitled Session';

    return (
      <div className={`bg-zinc-950/50 border border-white/5 group rounded-3xl overflow-hidden flex ${isLarge ? 'flex-col lg:flex-row h-auto lg:h-72' : 'flex-col h-full'} relative hover:border-white/10 transition-all shadow-xl`}>
        {/* Image View */}
        {imageUrl && (
          <div className={`${isLarge ? 'w-full lg:w-5/12 h-56 lg:h-full' : 'h-48 w-full'} bg-zinc-900 overflow-hidden relative shrink-0`}>
            {imageUrl.includes('.mp4') ? (
              <video src={imageUrl} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
            ) : (
              <img src={imageUrl} alt={itemTitle} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
            )}
            
            {!campusFilter && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-black/80 backdrop-blur-md border border-white/10 text-[9px] font-bold uppercase tracking-widest text-zinc-300 rounded-full">
                {formatCampus(item.campus)}
              </div>
            )}
            
            {isFeatured && (
               <div className="absolute top-4 right-4 px-3 py-1 bg-ministry-accent text-[9px] font-bold uppercase tracking-widest text-white rounded-full flex items-center gap-1 shadow-lg shadow-ministry-accent/20">
                 <Star size={10} className="fill-white" /> Featured
               </div>
            )}
          </div>
        )}
        
        <div className="p-6 lg:p-10 flex-1 flex flex-col justify-between">
          <div>
            <h4 className={`font-bold text-white ${isLarge ? 'text-3xl font-serif italic' : 'text-lg'} line-clamp-2 leading-tight`}>{itemTitle}</h4>
            {(item.description || item.summary) && <p className={`text-zinc-500 mt-4 leading-relaxed ${isLarge ? 'text-base line-clamp-3' : 'text-sm line-clamp-2'}`}>{item.description || item.summary}</p>}
            
            <p className="text-xs text-zinc-500 mt-6 font-mono flex items-center gap-2">
              <Calendar size={14} className="text-zinc-600" /> {new Date(item.created_at).toLocaleDateString(undefined, { dateStyle: 'long' })}
            </p>
          </div>

          <div className="flex items-center justify-between mt-8 border-t border-white/5 pt-6">
            {/* Feature Action */}
            {activeTab !== 'events' ? (
               <button 
                 onClick={() => toggleFeature(item.id, isFeatured, itemTitle)}
                 className={`text-[10px] font-bold uppercase tracking-widest px-6 py-2.5 rounded-xl border transition-all flex items-center gap-2 ${
                   isFeatured 
                   ? 'bg-ministry-accent/10 border-ministry-accent text-ministry-accent hover:bg-ministry-accent/20' 
                   : 'bg-white/5 border-white/10 text-zinc-500 hover:text-white hover:border-white/20'
                 }`}
               >
                 <Star size={14} className={isFeatured ? 'fill-ministry-accent' : ''} />
                 {isFeatured ? 'Unpublish Home' : 'Feature to Home'}
               </button>
            ) : <div />}

            {/* Delete Action */}
            <button 
              onClick={() => openDeleteConfirm(item.id, itemTitle)}
              className="p-3 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
              title="Delete Permanently"
            >
              <Trash2 size={20} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Filter Logic
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      const matchesSearch = 
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const itemDate = new Date(item.created_at || item.session_date || item.date)
      const matchesDate = !selectedDate || isSameDay(itemDate, selectedDate)

      return matchesSearch && matchesDate
    })
  }, [items, searchQuery, selectedDate])

  const newestItem = filteredItems.length > 0 ? filteredItems[0] : null;
  const previousItem = filteredItems.length > 1 ? filteredItems[1] : null;
  const archiveItems = filteredItems.length > 2 ? filteredItems.slice(2) : [];

  // Calendar Helpers
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  return (
    <div className="space-y-10">
      <ConfirmDialog 
        isOpen={confirmOpen}
        title="Confirm Deletion"
        message={`This action will permanently remove "${pendingDelete?.title}" from the church archive. This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      {/* View Tabs & Search Bar */}
      <div className="flex flex-col xl:flex-row gap-6 items-start xl:items-center justify-between">
        <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest text-zinc-500 w-full md:w-fit">
          {[
            { id: 'gallery', label: 'Gallery', icon: ImageIcon },
            { id: 'highlights', label: 'Sermons/Highlights', icon: Video },
            { id: 'events', label: 'Ministry Events', icon: Calendar },
          ].map(t => (
            <button 
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 md:flex-none px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-3 ${activeTab === t.id ? 'bg-white/10 text-white shadow-xl' : 'hover:text-white hover:bg-white/5'}`}
            >
              <t.icon size={16} /> {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto relative z-50">
          <div className="relative group w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-hover:text-ministry-accent transition-colors" size={16} />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/40 border border-white/5 p-3.5 pl-12 text-sm text-white focus:outline-none focus:border-ministry-accent/50 rounded-xl transition-all hover:bg-zinc-950" 
              placeholder={`Search ${activeTab}...`} 
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>

          <div className="relative">
            <button 
              onClick={() => setIsCalendarOpen(!isCalendarOpen)}
              className={`flex items-center gap-3 px-6 py-3.5 border transition-all rounded-xl h-full font-bold uppercase tracking-widest text-[10px] ${
                selectedDate || isCalendarOpen 
                ? 'bg-ministry-accent border-ministry-accent text-white' 
                : 'bg-zinc-950/40 border-white/5 text-zinc-500 hover:border-white/20'
              }`}
            >
              <CalendarIcon size={16} />
              {selectedDate ? format(selectedDate, 'MMM dd, yyyy') : 'By Sunday'}
            </button>

            <AnimatePresence>
              {isCalendarOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-3 w-72 bg-zinc-900 border border-white/10 p-5 rounded-3xl shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={prevMonth} className="p-1.5 hover:bg-white/5 rounded-full"><ChevronLeft size={14} /></button>
                    <span className="text-[10px] font-black uppercase tracking-widest">{format(currentMonth, 'MMMM yyyy')}</span>
                    <button onClick={nextMonth} className="p-1.5 hover:bg-white/5 rounded-full"><ChevronRight size={14} /></button>
                  </div>
                  
                  <div className="grid grid-cols-7 gap-1">
                    {['S','M','T','W','T','F','S'].map((d, i) => (
                      <span key={i} className={`text-center text-[7px] font-black tracking-widest ${i === 0 ? 'text-red-500/50' : 'text-zinc-600'}`}>{d}</span>
                    ))}
                    {daysInMonth.map((day, i) => {
                      const isSun = isSunday(day)
                      const isSelected = selectedDate && isSameDay(day, selectedDate)
                      return (
                        <button 
                          key={i}
                          onClick={() => {
                            setSelectedDate(isSelected ? null : day)
                            setIsCalendarOpen(false)
                          }}
                          className={`aspect-square flex items-center justify-center rounded-lg text-[9px] font-bold transition-all ${isSun ? 'text-red-500 border border-red-500/10' : 'text-zinc-500 hover:bg-white/5'} ${isSelected ? 'bg-white text-black font-black' : ''}`}
                        >
                          {format(day, 'd')}
                        </button>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="animate-spin text-ministry-accent" size={40} />
          <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest animate-pulse">Syncing Archive...</p>
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-24 text-center border-2 border-dashed border-white/5 bg-zinc-950/30 rounded-3xl">
          <SearchX className="mx-auto text-zinc-800 mb-6" size={48} />
          <p className="text-zinc-500 text-sm italic">No records found matching "{searchQuery || 'criteria'}".</p>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* SLOT 1: Most Recent Selection */}
          {newestItem && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="h-px bg-white/10 flex-1" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-ministry-accent flex items-center gap-3 shrink-0 px-4">
                  <div className="w-2 h-2 rounded-full bg-ministry-accent animate-ping" />
                  Primary Feature
                </h3>
                <div className="h-px bg-white/10 flex-1" />
              </div>
              <RenderCard item={newestItem} isLarge={true} />
            </motion.div>
          )}

          {/* SLOT 2: Previous Selection */}
          {previousItem && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 lg:grid-cols-12">
              <div className="lg:col-span-8 lg:col-start-5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-6 flex items-center gap-3">
                  <Clock size={14} /> Secondary Oversight
                </h3>
                <RenderCard item={previousItem} isLarge={false} />
              </div>
            </motion.div>
          )}

          {/* ARCHIVE SLOT: Older Data */}
          {archiveItems.length > 0 && (
            <div className="pt-16 mt-16 border-t border-white/5">
              <button 
                onClick={() => setShowArchive(!showArchive)}
                className="w-full py-8 bg-zinc-950/20 hover:bg-zinc-950/40 border border-white/5 transition-all flex items-center justify-between px-10 rounded-3xl group"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                    <Clock size={24} className="text-zinc-500 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-left">
                    <span className="block text-xl font-bold font-serif text-white mb-1 group-hover:text-ministry-accent transition-colors">Historical Archives</span>
                    <span className="block text-xs uppercase tracking-widest text-zinc-500 font-bold">{archiveItems.length} Records categorized as older history</span>
                  </div>
                </div>
                <div className={`p-3 rounded-full border border-white/5 group-hover:border-white/20 transition-all ${showArchive ? 'bg-white/10' : ''}`}>
                  <ChevronDown size={28} className={`text-zinc-500 transition-transform duration-500 group-hover:text-white ${showArchive ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {showArchive && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.98, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.98, y: -20 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10">
                      {archiveItems.map(item => (
                        <RenderCard key={item.id} item={item} isLarge={false} />
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      )}
    </div>
  )
}

