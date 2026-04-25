'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import { CheckCircle2, Phone, MessageCircle, Save, X, Edit3, ChevronDown, ChevronRight, CalendarDays, User, MapPin, MessageSquare, Trash2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import ConfirmDialog from '../ui/ConfirmDialog'

export default function FollowUpList({ initialVisitors }: { initialVisitors: any[] }) {
  const [visitors, setVisitors] = useState(initialVisitors)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [activeTab, setActiveTab] = useState<'all' | 'new_souls' | 'visitors' | 'prayer' | 'help' | 'kabwe' | 'main'>('all')
  const [editingNotes, setEditingNotes] = useState<string | null>(null)
  const [tempNote, setTempNote] = useState('')
  const [showOlder, setShowOlder] = useState(false)
  
  // Deletion State
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [pendingDelete, setPendingDelete] = useState<{ id: string, name: string } | null>(null)

  const handleDelete = async () => {
    if (!pendingDelete) return
    const { id } = pendingDelete
    
    const previousVisitors = [...visitors]
    setVisitors(visitors.filter(v => v.id !== id))
    setConfirmOpen(false)
    toast.success('Record Removed', { description: 'The spiritual record has been permanently purged.' })

    const { error } = await supabase.from('visitors').delete().eq('id', id)
    if (error) {
      toast.error('Purge Failed', { description: 'Could not remove record from the database.' })
      setVisitors(previousVisitors)
    }
  }

  const updateStatus = async (id: string, status: string, name: string) => {
    setVisitors(visitors.map(v => v.id === id ? { ...v, follow_up_status: status } : v))
    toast.success('Status Updated', { description: `${name} is now marked as ${status.replace('_', ' ')}.` })

    const { error } = await supabase
      .from('visitors')
      .update({ follow_up_status: status })
      .eq('id', id)

    if (error) {
       toast.error('Sync Error', { description: 'Failed to update status in the database.' })
       setVisitors(initialVisitors) 
    }
  }

  const saveNote = async (id: string) => {
    setVisitors(visitors.map(v => v.id === id ? { ...v, notes: tempNote } : v))
    setEditingNotes(null)
    toast.success('Notes Saved', { description: 'Visitor record updated successfully.' })

    const { error } = await supabase
      .from('visitors')
      .update({ notes: tempNote })
      .eq('id', id)

    if (error) {
       toast.error('Sync Error', { description: 'Failed to save notes.' })
       setVisitors(initialVisitors) 
    }
  }

  const displayList = visitors.filter(v => {
    if (activeTab === 'new_souls') return v.is_new_soul
    if (activeTab === 'visitors') return !v.is_new_soul
    if (activeTab === 'prayer') return v.needs_prayer
    if (activeTab === 'help') return v.needs_help
    if (activeTab === 'kabwe') return v.campus === 'kabwe'
    if (activeTab === 'main') return v.campus === 'main'
    return true
  }).sort((a, b) => {
    if (a.is_new_soul && !b.is_new_soul) return -1
    if (!a.is_new_soul && b.is_new_soul) return 1
    return new Date(b.date_recorded).getTime() - new Date(a.date_recorded).getTime()
  })

  // GROUP BY WEEK LOGIC
  const now = new Date()
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

  const thisWeek = displayList.filter(v => new Date(v.date_recorded) >= oneWeekAgo)
  const lastWeek = displayList.filter(v => new Date(v.date_recorded) >= twoWeeksAgo && new Date(v.date_recorded) < oneWeekAgo)
  const older = displayList.filter(v => new Date(v.date_recorded) < twoWeeksAgo)

  const filtersLine1: Array<{ id: typeof activeTab, label: string }> = [
    { id: 'all', label: 'All Records' },
    { id: 'new_souls', label: 'Spiritual Growth' },
    { id: 'visitors', label: 'Fellowship' },
  ]
  const filtersLine2: Array<{ id: typeof activeTab, label: string }> = [
    { id: 'prayer', label: 'Prayer Requests' },
    { id: 'help', label: 'Practical Needs' },
    { id: 'kabwe', label: 'Kabwe' },
    { id: 'main', label: 'Main' },
  ]

  const formatPhone = (phone: string) => {
    let cleaned = phone.replace(/\D/g, '')
    if (cleaned.startsWith('0')) {
      cleaned = '260' + cleaned.substring(1)
    } else if (!cleaned.startsWith('260') && cleaned.length === 9) {
      cleaned = '260' + cleaned
    }
    return cleaned
  }

  const RenderVisitorCard = ({ v }: { v: any }) => (
    <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col gap-6 p-8 border border-white/5 bg-zinc-950/20 group hover:border-white/20 transition-all rounded-3xl overflow-hidden relative shadow-lg">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-white/10 transition-colors">
            <User size={24} className="text-zinc-500 group-hover:text-white transition-colors" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <p className="text-xl font-bold text-white font-serif italic tracking-wide">{v.name}</p>
              {v.is_new_soul && <span className="px-3 py-1 bg-ministry-accent text-[8px] font-black text-white uppercase tracking-[0.2em] rounded-full shadow-lg shadow-ministry-accent/20">Divine Growth</span>}
              {v.needs_prayer && <span className="px-3 py-1 bg-yellow-500/10 text-[8px] font-black text-yellow-500 uppercase tracking-[0.2em] rounded-full border border-yellow-500/20">Spiritual Need</span>}
              {v.needs_help && <span className="px-3 py-1 bg-blue-500/10 text-[8px] font-black text-blue-500 uppercase tracking-[0.2em] rounded-full border border-blue-500/20">Practical Help</span>}
            </div>
            <p className="text-sm text-zinc-500 flex flex-wrap items-center gap-x-4 gap-y-2">
              <span className="flex items-center gap-1.5 text-zinc-300 font-mono text-xs"><Phone size={12} className="text-zinc-600" /> {v.contact}</span>
              <span className="flex items-center gap-1.5 uppercase tracking-widest text-[10px] font-bold text-zinc-500"><MapPin size={12} className="text-zinc-600" /> {v.campus === 'kabwe' ? 'Kabwe' : 'Main'} • {v.hostel}</span>
              <span className="flex items-center gap-1.5 uppercase tracking-widest text-[10px] font-bold text-zinc-600"><CalendarDays size={12} /> {new Date(v.date_recorded).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={v.follow_up_status || 'not_contacted'}
            onChange={(e) => updateStatus(v.id, e.target.value, v.name)}
            className={`text-[10px] font-black uppercase tracking-[0.1em] px-4 py-3 border rounded-xl focus:outline-none transition-all cursor-pointer shadow-sm ${
              v.follow_up_status === 'followed_up' ? 'bg-green-500/10 border-green-500/50 text-green-400' :
              v.follow_up_status === 'contacted' ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-400' :
              'bg-zinc-900 border-white/10 text-zinc-400 hover:text-white hover:border-white/30'
            }`}
          >
            <option value="not_contacted">Awaiting Initiative</option>
            <option value="contacted">In Direct Dialogue</option>
            <option value="followed_up">Follow-up Complete</option>
          </select>
        </div>
      </div>

      <ConfirmDialog 
        isOpen={confirmOpen}
        title="Purge Spiritual Record"
        message={`Are you absolutely certain you want to permanently delete the spiritual record for "${pendingDelete?.name}"? this action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a href={`tel:${formatPhone(v.contact)}`} className="flex items-center justify-center gap-3 py-4 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-300 transition-all rounded-2xl border border-white/5 hover:border-white/10 shadow-sm">
          <Phone size={16} /> Direct Call
        </a>
        <a href={`https://wa.me/${formatPhone(v.contact)}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3 py-4 bg-green-500/5 hover:bg-green-500/10 text-green-500 border border-green-500/10 text-[10px] font-black uppercase tracking-widest transition-all rounded-2xl hover:scale-[1.02] shadow-sm">
          <MessageCircle size={16} /> WhatsApp Envoy
        </a>
      </div>

      <div className="bg-white/[0.02] p-6 rounded-2xl border border-white/5">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <MessageSquare size={14} className="text-zinc-600" />
            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-zinc-500">Pastoral Context</span>
          </div>
          <div className="flex items-center gap-4">
            {editingNotes !== v.id && (
              <button onClick={() => { setEditingNotes(v.id); setTempNote(v.notes || '') }} className="text-[10px] font-black text-ministry-accent hover:text-white uppercase tracking-widest transition-colors flex items-center gap-2">
                <Edit3 size={12} /> Refine Notes
              </button>
            )}
            <button 
              onClick={() => { setPendingDelete({ id: v.id, name: v.name }); setConfirmOpen(true) }}
              className="text-[10px] font-black text-zinc-600 hover:text-red-500 uppercase tracking-widest transition-colors flex items-center gap-2"
            >
              <Trash2 size={12} /> Purge Record
            </button>
          </div>
        </div>
        {editingNotes === v.id ? (
          <div className="space-y-4">
            <textarea autoFocus rows={3} value={tempNote} onChange={(e) => setTempNote(e.target.value)} className="w-full bg-zinc-900/50 border border-ministry-accent/30 p-4 text-sm text-white focus:outline-none focus:border-ministry-accent rounded-xl resize-none leading-relaxed transition-all shadow-inner" placeholder="Record pertinent spiritual dialogue details..." />
            <div className="flex justify-end gap-3">
              <button onClick={() => setEditingNotes(null)} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all">Cancel</button>
              <button onClick={() => saveNote(v.id)} className="px-6 py-2 text-[10px] font-black uppercase tracking-widest bg-ministry-accent hover:opacity-90 text-white rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-ministry-accent/20"><Save size={14} /> Commit Changes</button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-zinc-400 leading-relaxed font-light italic">
            {v.notes ? v.notes : <span className="opacity-30">No pastoral logs recorded for this individual.</span>}
          </p>
        )}
      </div>
    </motion.div>
  )

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-full">
          {filtersLine1.map(f => (
            <button 
              key={f.id} 
              onClick={() => setActiveTab(f.id)} 
              className={`flex-1 py-3 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === f.id ? 'bg-ministry-accent text-white shadow-xl' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-full">
          {filtersLine2.map(f => (
            <button 
              key={f.id} 
              onClick={() => setActiveTab(f.id)} 
              className={`flex-1 py-2.5 px-6 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === f.id ? 'bg-white/15 text-white shadow-xl' : 'text-zinc-600 hover:text-white hover:bg-white/5'}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {displayList.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-white/5 bg-zinc-950/20 rounded-3xl">
          <p className="text-zinc-600 text-sm font-bold uppercase tracking-widest">No matching records found in this segment.</p>
        </div>
      ) : (
        <div className="space-y-12 max-h-[1200px] overflow-y-auto pr-6 pb-20 custom-scrollbar scroll-smooth">
          
          {thisWeek.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-ministry-accent flex items-center gap-3 shrink-0">
                  <CalendarDays size={16} /> Latest Initiative: This Week
                </h3>
                <div className="h-px bg-white/5 flex-1" />
              </div>
              <div className="space-y-6">
                {thisWeek.map(v => <RenderVisitorCard key={v.id} v={v} />)}
              </div>
            </div>
          )}

          {lastWeek.length > 0 && (
            <div className="space-y-6 pt-8">
              <div className="flex items-center gap-4">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 flex items-center gap-3 shrink-0">
                  Recent History: Last Week
                </h3>
                <div className="h-px bg-white/5 flex-1" />
              </div>
              <div className="space-y-6">
                {lastWeek.map(v => <RenderVisitorCard key={v.id} v={v} />)}
              </div>
            </div>
          )}

          {older.length > 0 && (
            <div className="pt-12">
              <button 
                onClick={() => setShowOlder(!showOlder)}
                className="w-full py-10 bg-zinc-950/40 hover:bg-zinc-950/60 border border-white/5 transition-all flex items-center justify-between px-10 rounded-3xl group shadow-2xl"
              >
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-all group-hover:scale-110 shadow-inner">
                    <CalendarDays size={28} className="text-zinc-600 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-left">
                    <span className="block text-2xl font-bold font-serif italic text-white mb-2 group-hover:text-ministry-accent transition-colors">Historical Logs</span>
                    <span className="block text-xs uppercase tracking-[0.2em] font-black text-zinc-500">{older.length} Previous Records Archived</span>
                  </div>
                </div>
                <div className={`p-4 rounded-full border border-white/10 transition-all ${showOlder ? 'bg-white/10' : ''}`}>
                  <ChevronDown size={32} className={`text-zinc-500 transition-transform duration-700 group-hover:text-white ${showOlder ? 'rotate-180' : ''}`} />
                </div>
              </button>

              <AnimatePresence>
                {showOlder && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 40 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-6 border-l-2 border-white/5 pl-10">
                      {older.map(v => <RenderVisitorCard key={v.id} v={v} />)}
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

