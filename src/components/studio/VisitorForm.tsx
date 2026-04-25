'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'

interface VisitorFormProps {
  campus: 'kabwe' | 'main'
  userId: string
}

export default function VisitorForm({ campus, userId }: VisitorFormProps) {
  const [loading, setLoading] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [formData, setFormData] = useState({
    name: '',
    sex: 'Male',
    contact: '',
    program_year: '',
    hostel: '',
    needs_help: false,
    needs_prayer: false,
    is_new_soul: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const target = e.target as HTMLInputElement
      setFormData(prev => ({ ...prev, [name]: target.checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      ...formData,
      campus, // Auto-assigned from prop
      recorded_by: userId,
      date_recorded: new Date().toISOString(),
    }

    const { error } = await supabase.from('visitors').insert([payload])

    if (error) {
      toast.error('Failed to record entry', { description: error.message })
    } else {
      toast.success('Entry Recorded', { description: `Successfully recorded ${formData.name}. Ready for next entry.` })
      
      // Reset form but keep defaults to speed up bulk entry
      setFormData({
        name: '',
        sex: 'Male',
        contact: '',
        program_year: '',
        hostel: '',
        needs_help: false,
        needs_prayer: false,
        is_new_soul: formData.is_new_soul, // Keep the selected entry type!
      })
      
      // Auto-focus name field for next entry
      document.getElementById('name-input')?.focus()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
    
    setLoading(false)
  }

  return (
    <div className="bg-white border border-black/5 shadow-sm p-8 w-full max-w-2xl rounded-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-bold uppercase tracking-tight text-mariners-charcoal">Visitor & Souls Entry</h2>
        <p className="text-sm text-zinc-500 mt-1">Campus automatically set to <span className="font-bold text-mariners-salmon uppercase">{campus}</span>.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Entry Type Toggle */}
        <div className="flex bg-zinc-100 p-1 rounded-lg w-full max-w-sm mb-6">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, is_new_soul: false }))}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
              !formData.is_new_soul ? 'bg-white shadow-sm text-mariners-charcoal' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            Visitor
          </button>
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, is_new_soul: true }))}
            className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest rounded-md transition-all ${
              formData.is_new_soul ? 'bg-mariners-salmon text-white shadow-sm' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            New Soul
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Full Name</label>
            <input 
              id="name-input"
              required
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-zinc-50 placeholder-zinc-400 border border-zinc-200 p-3 text-mariners-charcoal focus:outline-none focus:ring-1 focus:ring-mariners-salmon focus:border-mariners-salmon transition-colors rounded-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Sex</label>
            <select 
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="w-full bg-zinc-50 placeholder-zinc-400 border border-zinc-200 p-3 text-mariners-charcoal focus:outline-none focus:ring-1 focus:ring-mariners-salmon focus:border-mariners-salmon transition-colors rounded-none"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Contact Number</label>
            <input 
              required
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              className="w-full bg-zinc-50 placeholder-zinc-400 border border-zinc-200 p-3 text-mariners-charcoal focus:outline-none focus:ring-1 focus:ring-mariners-salmon focus:border-mariners-salmon transition-colors rounded-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Program & Year</label>
            <input 
              required
              name="program_year"
              placeholder="e.g. BEng 2nd Year"
              value={formData.program_year}
              onChange={handleChange}
              className="w-full bg-zinc-50 placeholder-zinc-400 border border-zinc-200 p-3 text-mariners-charcoal focus:outline-none focus:ring-1 focus:ring-mariners-salmon focus:border-mariners-salmon transition-colors rounded-none"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Hostel / Location</label>
            <input 
              required
              name="hostel"
              value={formData.hostel}
              onChange={handleChange}
              className="w-full bg-zinc-50 placeholder-zinc-400 border border-zinc-200 p-3 text-mariners-charcoal focus:outline-none focus:ring-1 focus:ring-mariners-salmon focus:border-mariners-salmon transition-colors rounded-none"
            />
          </div>
        </div>

        <div className="flex gap-8 py-4 border-y border-white/5">
          <label className="flex items-center space-x-3 cursor-pointer group">
            <input 
              type="checkbox" 
              name="needs_help"
              checked={formData.needs_help}
              onChange={handleChange}
              className="w-5 h-5 bg-white border border-zinc-300 checked:bg-mariners-salmon checked:border-mariners-salmon focus:ring-1 focus:ring-mariners-salmon transition-all cursor-pointer accent-mariners-salmon" 
            />
            <span className="text-sm font-medium text-zinc-600 group-hover:text-mariners-charcoal transition-colors">Needs Practical Help</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer group">
            <input 
              type="checkbox" 
              name="needs_prayer"
              checked={formData.needs_prayer}
              onChange={handleChange}
              className="w-5 h-5 bg-white border border-zinc-300 checked:bg-mariners-salmon checked:border-mariners-salmon focus:ring-1 focus:ring-mariners-salmon transition-all cursor-pointer accent-mariners-salmon" 
            />
            <span className="text-sm font-medium text-zinc-600 group-hover:text-mariners-charcoal transition-colors">Needs Prayer</span>
          </label>
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-mariners-charcoal text-white font-bold uppercase tracking-widest py-4 hover:bg-mariners-salmon transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save & Prepare Next Entry'}
        </button>
      </form>
    </div>
  )
}
