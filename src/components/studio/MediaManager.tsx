'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'
import { Search, Calendar as CalendarIcon, X, ChevronLeft, ChevronRight, Filter, SearchX, CalendarDays as CalendarDaysIcon, Upload, Link as LinkIcon, FileVideo, Image as ImageIcon, CheckCircle2, Loader2, Video, Database, Trash2, Clock, ChevronDown } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSunday, addMonths, subMonths, isSameDay } from 'date-fns'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import ConfirmDialog from '../ui/ConfirmDialog'

interface MediaManagerProps {
  campus: 'kabwe' | 'main'
  initialCategory?: MediaCategory
  onClose?: () => void
  onSuccess?: () => void
}

type MediaCategory = 'gallery' | 'sermon' | 'highlight' | 'hero' | 'landing_box' | 'event'

export default function MediaManager({ campus, initialCategory = 'gallery', onClose, onSuccess }: MediaManagerProps) {
  const supabase = createClient()
  const [viewMode, setViewMode] = useState<'upload' | 'manage'>('upload')
  const [category, setCategory] = useState<MediaCategory>(initialCategory)
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file')
  const [isCrossPosted, setIsCrossPosted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Library State
  const [libraryItems, setLibraryItems] = useState<any[]>([])
  const [libraryLoading, setLibraryLoading] = useState(false)
  const [showArchive, setShowArchive] = useState(false)

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [currentMonth, setCurrentMonth] = useState(new Date())

  // Dialog State
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<{ id: string, table: string, title: string } | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    externalUrl: '',
    section: 'hero_images' as any,
    sessionDate: new Date().toISOString().split('T')[0],
    isFeatured: false
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])

  useEffect(() => {
    if (viewMode === 'manage') {
      fetchLibraryItems()
    }
  }, [viewMode, category])

  const fetchLibraryItems = async () => {
    setLibraryLoading(true)
    const table = getTableForCategory()
    if (table) {
      let query = supabase.from(table).select('*').eq('campus', campus).order('created_at', { ascending: false })
      if (category === 'sermon' || category === 'highlight') {
        query = query.or(`video_type.eq.${category},video_type.eq.both`)
      }
      if (category === 'hero') query = query.eq('section', 'hero_images')
      if (category === 'landing_box') query = query.neq('section', 'hero_images')

      const { data, error } = await query
      if (!error && data) setLibraryItems(data)
    }
    setLibraryLoading(false)
    setShowArchive(false)
  }

  const openDeleteConfirm = (id: string, table: string, title?: string) => {
    setPendingDelete({ id, table, title: title || 'this item' })
    setConfirmOpen(true)
  }

  const handleDeleteItem = async () => {
    if (!pendingDelete) return
    const { id, table } = pendingDelete

    const previousItems = [...libraryItems]
    setLibraryItems(libraryItems.filter(i => i.id !== id))
    setConfirmOpen(false)
    toast.success('Resource Deleted', { description: 'Item permanently removed.' })

    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) {
      toast.error('Deletion Failed', { description: 'Could not remove from database.' })
      setLibraryItems(previousItems)
    }
  }

  // Filter Logic
  const filteredItems = useMemo(() => {
    return libraryItems.filter(item => {
      const matchesSearch = 
        (item.title && item.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.section && item.section.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.summary && item.summary.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      
      const itemDate = new Date(item.created_at || item.session_date || item.date)
      const matchesDate = !selectedDate || isSameDay(itemDate, selectedDate)

      return matchesSearch && matchesDate
    })
  }, [libraryItems, searchQuery, selectedDate])

  // Group items by week logic
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const thisWeek = filteredItems.filter(i => new Date(i.created_at) >= oneWeekAgo)
  const lastWeek = filteredItems.filter(i => new Date(i.created_at) >= twoWeeksAgo && new Date(i.created_at) < oneWeekAgo)
  const older = filteredItems.filter(i => new Date(i.created_at) < twoWeeksAgo)

  // Calendar Helpers
  const daysInMonth = useMemo(() => {
    const start = startOfMonth(currentMonth)
    const end = endOfMonth(currentMonth)
    return eachDayOfInterval({ start, end })
  }, [currentMonth])

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

  // Standard handlers...
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files)
      const oversized = files.find(f => f.size > 50 * 1024 * 1024)
      if (oversized) {
        setError('One or more files exceed the 50MB limit.')
        return
      }
      setSelectedFiles(files)
      setError(null)
    }
  }

  const getTableForCategory = () => {
    if (category === 'gallery') return 'gallery'
    if (category === 'sermon' || category === 'highlight') return 'highlights'
    if (category === 'hero' || category === 'landing_box') return 'site_content'
    if (category === 'event') return 'events'
    return ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      let finalUrl = formData.externalUrl
      let finalUrls: string[] = [] 
      if (uploadType === 'file' && selectedFiles.length > 0) {
        if (category === 'gallery') {
          const uploadPromises = selectedFiles.map(async (file) => {
            const fileName = `${uuidv4()}.${file.name.split('.').pop()}`
            const filePath = `${category}/${fileName}`
            const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file)
            if (uploadError) throw uploadError
            const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)
            return publicUrl
          })
          finalUrls = await Promise.all(uploadPromises)
        } else {
          const file = selectedFiles[0]
          const fileName = `${uuidv4()}.${file.name.split('.').pop()}`
          const filePath = `${category}/${fileName}`
          const { error: uploadError } = await supabase.storage.from('media').upload(filePath, file)
          if (uploadError) throw uploadError
          const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)
          finalUrl = publicUrl
        }
      }

      const table = getTableForCategory()
      let payload: any = { campus }
      
      if (category === 'gallery') {
        payload = { ...payload, title: formData.title, image_url: finalUrls[0], image_urls: finalUrls, is_featured: formData.isFeatured }
      } else if (category === 'sermon' || category === 'highlight') {
        let extractedThumbnail = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800';
        if (finalUrl.includes('youtube.com') || finalUrl.includes('youtu.be')) {
          const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
          const match = finalUrl.match(ytRegex);
          if (match && match[1]) extractedThumbnail = `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg`;
        }
        payload = { ...payload, title: formData.title, video_url: finalUrl, description: formData.summary, video_type: category === 'sermon' && isCrossPosted ? 'both' : category, session_date: formData.sessionDate, thumbnail: extractedThumbnail, is_featured: formData.isFeatured }
      } else if (category === 'hero' || category === 'landing_box') {
        payload = { ...payload, section: category === 'hero' ? 'hero_images' : formData.section, content_url: finalUrl }
      } else if (category === 'event') {
        payload = { ...payload, title: formData.title, description: formData.summary, date: formData.sessionDate, image: finalUrl }
      }

      const { error: dbError } = await supabase.from(table).insert(payload)
      if (dbError) throw dbError

      toast.success('Upload complete!', { description: `${formData.title} published live.` })
      if (onSuccess) onSuccess()
      setSelectedFiles([])
      setFormData({ title: '', summary: '', externalUrl: '', section: 'hero_images', sessionDate: new Date().toISOString().split('T')[0], isFeatured: false })
    } catch (err: any) {
      toast.error('Upload Failed', { description: err.message })
    } finally {
      setLoading(false)
    }
  }

  const RenderLibraryCard = ({ item }: { item: any }) => {
    const itemTitle = item.title || item.section || 'Untitled Content';
    const imageUrl = item.image_url || (item.image_urls && item.image_urls[0]) || item.thumbnail || item.image || item.content_url;
    return (
      <div className="flex bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
        {imageUrl && (
          <div className="w-1/3 bg-zinc-50 flex-shrink-0 overflow-hidden relative">
            <img src={imageUrl} alt={itemTitle} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100" />
            {item.is_featured && <div className="absolute top-2 left-2 bg-ministry-accent text-[8px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg">Featured</div>}
          </div>
        )}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-zinc-900 group-hover:text-ministry-accent transition-colors line-clamp-1">{itemTitle}</h3>
            <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-400 mt-1 flex items-center gap-1">
              <Clock size={10} /> {new Date(item.created_at).toLocaleDateString()}
            </p>
          </div>
          <button 
            onClick={() => openDeleteConfirm(item.id, getTableForCategory(), itemTitle)}
            className="mt-4 flex items-center justify-center py-2 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-red-100 hover:border-red-600"
          >
            <Trash2 size={12} className="mr-2" /> Delete Item
          </button>
        </div>
      </div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="bg-white border border-black/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] w-full max-w-4xl overflow-hidden rounded-[2.5rem] flex flex-col max-h-[92vh]"
    >
      <ConfirmDialog 
        isOpen={confirmOpen}
        title="Revoke Permission"
        message={`This action will permanently remove "${pendingDelete?.title}" from the live ${campus} portal. It cannot be recovered by the media crew once purged.`}
        confirmText="Purge Permanently"
        onConfirm={handleDeleteItem}
        onCancel={() => setConfirmOpen(false)}
      />

      <div className="flex justify-between items-start p-10 bg-zinc-50/50 border-b border-zinc-100 shrink-0">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-zinc-900 flex items-center gap-3 font-serif italic text-ministry-accent">
            Media <span className="not-italic text-zinc-900 font-sans">Command</span>
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-zinc-900 text-[10px] font-black uppercase tracking-widest text-white rounded-full">{campus} Campus</span>
            <span className="text-xs text-zinc-400 font-medium tracking-tight">Active Ingestion Pipeline</span>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-3 text-zinc-400 hover:text-zinc-900 transition-all bg-white shadow-xl shadow-zinc-200/50 rounded-2xl border border-zinc-100 hover:scale-110 active:scale-95">
            <X size={24} />
          </button>
        )}
      </div>

      <div className="flex w-full bg-white border-b border-zinc-100 shrink-0 uppercase text-[10px] font-black tracking-[0.2em] px-10 justify-between items-center">
        <div className="flex">
          <button 
            onClick={() => setViewMode('upload')}
            className={`py-6 px-4 relative transition-all ${viewMode === 'upload' ? 'text-ministry-accent' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            {viewMode === 'upload' && <motion.div layoutId="mediatab_m" className="absolute bottom-0 left-0 right-0 h-1 bg-ministry-accent rounded-t-full" />}
            Content Ingestion
          </button>
          <button 
            onClick={() => setViewMode('manage')}
            className={`py-6 px-4 relative transition-all flex items-center gap-2 ${viewMode === 'manage' ? 'text-ministry-accent' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
            {viewMode === 'manage' && <motion.div layoutId="mediatab_m" className="absolute bottom-0 left-0 right-0 h-1 bg-ministry-accent rounded-t-full" />}
            Live Moderation Archive
          </button>
        </div>

        {viewMode === 'manage' && (
          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-300 group-hover:text-ministry-accent transition-colors" size={14} />
              <input 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-zinc-50 border border-zinc-100 p-2 pl-9 text-[10px] text-zinc-900 focus:outline-none focus:border-ministry-accent/50 rounded-xl transition-all w-48" 
                placeholder="Search catalog..." 
              />
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                className={`flex items-center gap-2 px-4 py-2 border transition-all rounded-xl text-[9px] font-black tracking-widest ${
                  selectedDate || isCalendarOpen 
                  ? 'bg-ministry-accent border-ministry-accent text-white' 
                  : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:border-zinc-200'
                }`}
              >
                <CalendarIcon size={14} />
                {selectedDate ? format(selectedDate, 'MMM dd') : 'Sunday'}
              </button>

              <AnimatePresence>
                {isCalendarOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-2 w-64 bg-white border border-zinc-200 p-4 rounded-2xl shadow-2xl z-[100]"
                  >
                    <div className="flex justify-between items-center mb-3">
                      <button onClick={prevMonth} className="p-1 hover:bg-zinc-50 rounded-full"><ChevronLeft size={12} /></button>
                      <span className="text-[9px] font-black uppercase tracking-widest text-zinc-900">{format(currentMonth, 'MMMM yyyy')}</span>
                      <button onClick={nextMonth} className="p-1 hover:bg-zinc-50 rounded-full"><ChevronRight size={12} /></button>
                    </div>
                    
                    <div className="grid grid-cols-7 gap-1">
                      {['S','M','T','W','T','F','S'].map((d, i) => (
                        <span key={i} className={`text-center text-[7px] font-black tracking-widest ${i === 0 ? 'text-red-500' : 'text-zinc-400'}`}>{d}</span>
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
                            className={`aspect-square flex items-center justify-center rounded-lg text-[9px] font-bold transition-all ${isSun ? 'text-red-500 border border-red-500/10' : 'text-zinc-500 hover:bg-zinc-50'} ${isSelected ? 'bg-ministry-accent text-white font-black' : ''}`}
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
        )}
      </div>

      <div className="p-10 overflow-y-auto flex-1 custom-scrollbar">
        {/* Category Selection */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-12">
          {[
            { id: 'gallery', label: 'Gallery', icon: ImageIcon },
            { id: 'sermon', label: 'Sermons', icon: FileVideo },
            { id: 'highlight', label: 'Snippets', icon: Video },
            { id: 'event', label: 'Events', icon: CalendarIcon },
            { id: 'hero', label: 'Hero', icon: Upload },
            { id: 'landing_box', label: 'Modules', icon: Upload },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategory(cat.id as any)}
              className={`flex flex-col items-center justify-center p-5 border-2 transition-all rounded-[1.5rem] ${
                category === cat.id 
                  ? 'bg-ministry-accent/5 border-ministry-accent text-ministry-accent shadow-xl shadow-ministry-accent/5' 
                  : 'bg-zinc-50 border-zinc-100 text-zinc-400 hover:border-zinc-200 hover:bg-white'
              }`}
            >
              <cat.icon size={24} className="mb-3 opacity-80" />
              <span className="text-[9px] uppercase font-black tracking-widest leading-none">{cat.label}</span>
            </button>
          ))}
        </div>

        {viewMode === 'upload' ? (
          <form onSubmit={handleSubmit} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* Upload Type Selection */}
             <div className="flex items-center gap-4 bg-zinc-50 p-2 border border-zinc-100 rounded-3xl w-fit">
                <button type="button" onClick={() => setUploadType('file')} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${uploadType === 'file' ? 'bg-white text-ministry-accent shadow-lg' : 'text-zinc-400 hover:text-zinc-600'}`}>Local Asset</button>
                <button type="button" onClick={() => setUploadType('link')} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${uploadType === 'link' ? 'bg-white text-ministry-accent shadow-lg' : 'text-zinc-400 hover:text-zinc-600'}`}>External Link</button>
             </div>

             <div className="space-y-8">
               <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Content Title</label>
                 <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 p-5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-ministry-accent/20 focus:border-ministry-accent transition-all rounded-[1.5rem] text-lg font-bold tracking-tight" placeholder="Identify this session or asset..." />
               </div>

               {uploadType === 'file' ? (
                 <div onClick={() => fileInputRef.current?.click()} onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); setSelectedFiles(Array.from(e.dataTransfer.files)) }} className={`border-2 border-dashed p-16 flex flex-col items-center justify-center cursor-pointer transition-all rounded-[2rem] group ${isDragging ? 'border-ministry-accent bg-ministry-accent/5' : 'border-zinc-100 bg-zinc-50/50 hover:border-ministry-accent/30 hover:bg-white'}`}>
                   <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple={category === 'gallery'} />
                   {selectedFiles.length > 0 ? (
                     <div className="text-center">
                       <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-900/10"><CheckCircle2 className="text-green-500" size={40} /></div>
                       <p className="text-zinc-900 font-black text-xl tracking-tight">{selectedFiles.length === 1 ? selectedFiles[0].name : `${selectedFiles.length} Assets Segmented`}</p>
                       <p className="text-[10px] uppercase font-black tracking-widest text-zinc-400 mt-3">Ready for Ingestion Protocol</p>
                     </div>
                   ) : (
                     <>
                       <div className="w-20 h-20 bg-white shadow-2xl shadow-zinc-200 flex items-center justify-center rounded-3xl mb-6 group-hover:scale-110 transition-transform"><Upload className="text-zinc-300 group-hover:text-ministry-accent" size={32} /></div>
                       <p className="text-lg font-bold text-zinc-900 tracking-tight">Select Spiritual Assets</p>
                       <p className="text-[10px] text-zinc-400 uppercase mt-2 font-black tracking-[0.2em]">{category === 'gallery' ? 'Batch Ingestion Supported' : 'Max File Weight: 50MB'}</p>
                     </>
                   )}
                 </div>
               ) : (
                 <div className="space-y-3">
                   <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Canonical Link</label>
                   <input required value={formData.externalUrl} onChange={(e) => setFormData({...formData, externalUrl: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 p-5 text-zinc-900 focus:outline-none focus:ring-2 focus:ring-ministry-accent/20 focus:border-ministry-accent transition-all rounded-[1.5rem]" placeholder="https://youtube.com/watch?v=..." />
                 </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 ml-2">Session Logistics (Date)</label>
                    <input type="date" value={formData.sessionDate} onChange={(e) => setFormData({...formData, sessionDate: e.target.value})} className="w-full bg-zinc-50 border border-zinc-100 p-5 text-zinc-900 focus:outline-none rounded-[1.5rem]" />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center gap-4 bg-zinc-50 p-5 border border-zinc-100 rounded-[1.5rem] w-full cursor-pointer group hover:bg-white hover:border-ministry-accent transition-all">
                       <input type="checkbox" checked={formData.isFeatured} onChange={(e) => setFormData({...formData, isFeatured: e.target.checked})} className="w-6 h-6 rounded-lg pointer-events-none" />
                       <div className="pointer-events-none">
                         <p className="text-xs font-black uppercase tracking-widest text-zinc-900">Featured Placement</p>
                         <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tight">Promote to highlight modules</p>
                       </div>
                    </label>
                  </div>
               </div>
             </div>

             <button type="submit" disabled={loading} className="w-full bg-zinc-900 text-white font-black uppercase tracking-[0.3em] py-6 hover:bg-ministry-accent transition-all disabled:opacity-50 rounded-[2rem] shadow-2xl flex items-center justify-center gap-4 text-sm group">
               {loading ? <Loader2 className="animate-spin" size={24} /> : (
                 <>
                   Ingest to Live Feed
                   <CheckCircle2 size={18} className="group-hover:scale-125 transition-transform" />
                 </>
               )}
             </button>
          </form>
        ) : (
          <div className="space-y-12 animate-in fade-in duration-500 pb-20">
             {libraryLoading ? (
               <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-ministry-accent" size={40} /></div>
             ) : filteredItems.length === 0 ? (
               <div className="py-24 text-center border-2 border-dashed border-zinc-100 bg-zinc-50 rounded-[3rem]">
                 <SearchX className="mx-auto text-zinc-200 mb-6" size={60} />
                 <p className="text-zinc-500 font-bold uppercase tracking-widest">No matching records found.</p>
               </div>
             ) : (
               <div className="space-y-12">
                  {thisWeek.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-ministry-accent flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-ministry-accent animate-ping" /> New Content Cycle
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {thisWeek.map(item => <RenderLibraryCard key={item.id} item={item} />)}
                      </div>
                    </div>
                  )}

                  {lastWeek.length > 0 && (
                    <div className="space-y-6">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400 ml-4">Previous Ingestions</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {lastWeek.map(item => <RenderLibraryCard key={item.id} item={item} />)}
                      </div>
                    </div>
                  )}

                  {older.length > 0 && (
                    <div>
                      <button onClick={() => setShowArchive(!showArchive)} className="w-full py-8 bg-zinc-50 hover:bg-zinc-100 border border-zinc-100 rounded-[2rem] transition-all flex items-center justify-between px-10 group">
                        <div className="flex items-center gap-6">
                          <Clock size={24} className="text-zinc-300 group-hover:text-ministry-accent transition-colors" />
                          <div className="text-left">
                            <p className="text-sm font-black uppercase tracking-widest text-zinc-900">Historical Vault</p>
                            <p className="text-[10px] text-zinc-400 font-bold uppercase">{older.length} Archived Sessions</p>
                          </div>
                        </div>
                        <ChevronDown size={24} className={`text-zinc-400 transition-transform duration-500 ${showArchive ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {showArchive && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 overflow-hidden">
                            {older.map(item => <RenderLibraryCard key={item.id} item={item} />)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
               </div>
             )}
          </div>
        )}
      </div>
    </motion.div>
  )
}
