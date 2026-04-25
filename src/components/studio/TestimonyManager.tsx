'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'
import { X, Upload, Link as LinkIcon, Image as ImageIcon, CheckCircle2, Loader2, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface TestimonyManagerProps {
  campus: 'kabwe' | 'main'
  onClose?: () => void
}

export default function TestimonyManager({ campus, onClose }: TestimonyManagerProps) {
  const supabase = createClient()
  const [uploadType, setUploadType] = useState<'file' | 'link'>('file')
  const [loading, setLoading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [testimonies, setTestimonies] = useState<any[]>([])
  const [fetchingTestimonies, setFetchingTestimonies] = useState(true)

  const [formData, setFormData] = useState({
    author: '',
    quote: '',
    externalUrl: '',
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Fetch testimonies
  const fetchTestimonies = async () => {
    setFetchingTestimonies(true)
    const { data, error } = await supabase
      .from('testimonies')
      .select('*')
      .eq('campus', campus)
      .order('created_at', { ascending: false })
      
    if (!error && data) {
      setTestimonies(data)
    }
    setFetchingTestimonies(false)
  }

  useEffect(() => {
    fetchTestimonies()
  }, [campus])

  const handleDelete = async (id: string, author: string) => {
    const confirmDelete = window.confirm(`Are you sure you want to delete ${author}'s testimony?`)
    if (!confirmDelete) return

    setTestimonies(prev => prev.filter(t => t.id !== id))
    toast.success('Testimony Deleted', { description: `Removed ${author}'s testimony.` })

    const { error } = await supabase.from('testimonies').delete().eq('id', id)
    if (error) {
      toast.error('Sync Error', { description: 'Failed to delete from database.' })
      fetchTestimonies()
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > 50 * 1024 * 1024) {
        setError('File exceeds the 50MB limit.')
        return
      }
      setSelectedFile(file)
      setError(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let finalUrl = formData.externalUrl || null

      if (uploadType === 'file' && selectedFile) {
        const fileExt = selectedFile.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        const filePath = `testimonies/${fileName}`
        const { error: uploadError } = await supabase.storage.from('media').upload(filePath, selectedFile, { cacheControl: '3600', upsert: false })
        if (uploadError) throw uploadError
        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(filePath)
        finalUrl = publicUrl
      }

      const payload = {
        author: formData.author,
        quote: formData.quote,
        image_url: finalUrl,
        campus
      }

      const { error: dbError } = await supabase.from('testimonies').insert([payload])
      if (dbError) throw dbError

      toast.success('Testimony published!', {
        description: `${formData.author}'s testimony is now live.`,
      })
      
      // Reset form
      setFormData({ author: '', quote: '', externalUrl: '' })
      setSelectedFile(null)
      fetchTestimonies()
    } catch (err: any) {
      toast.error('Upload Failed', {
        description: err.message || 'An error occurred during upload.'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true) }
  const handleDragLeave = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(false) }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.size > 50 * 1024 * 1024) {
        toast.error('File too large', { description: 'Exceeds the 50MB limit' })
        return
      }
      setSelectedFile(file)
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-black/5 shadow-xl p-6 md:p-8 w-full max-w-4xl overflow-y-auto max-h-[90vh] rounded-2xl flex flex-col lg:flex-row gap-8"
    >
      {/* Upload Form Side */}
      <div className="flex-1 space-y-6 lg:border-r border-zinc-100 lg:pr-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold uppercase tracking-tight text-mariners-charcoal">Manage Testimonies</h2>
            <p className="text-sm text-zinc-500 mt-1">Status: <span className="text-mariners-salmon font-bold uppercase">{campus}</span> Campus</p>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-zinc-400 hover:text-mariners-salmon transition-colors bg-zinc-50 p-2 rounded-full lg:hidden">
              <X size={20} />
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Student Name</label>
            <input 
              required
              value={formData.author}
              onChange={(e) => setFormData({...formData, author: e.target.value})}
              className="w-full bg-zinc-50 placeholder-zinc-400 border border-zinc-200 p-3 text-mariners-charcoal focus:outline-none focus:ring-1 focus:ring-mariners-salmon focus:border-mariners-salmon transition-colors rounded-none"
              placeholder="e.g. Sarah T."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Testimony</label>
            <textarea 
              required
              rows={3}
              value={formData.quote}
              onChange={(e) => setFormData({...formData, quote: e.target.value})}
              className="w-full bg-zinc-50 placeholder-zinc-400 border border-zinc-200 p-3 text-mariners-charcoal focus:outline-none focus:ring-1 focus:ring-mariners-salmon focus:border-mariners-salmon transition-colors rounded-none resize-none"
              placeholder="How has God impacted your life here?"
            />
          </div>

          <div className="space-y-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Optional Photo</label>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setUploadType('file')}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase transition-colors ${
                  uploadType === 'file' ? 'text-ministry-accent border-b-2 border-ministry-accent' : 'text-zinc-500'
                }`}
              >
                <Upload size={14} />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setUploadType('link')}
                className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold uppercase transition-colors ${
                  uploadType === 'link' ? 'text-ministry-accent border-b-2 border-ministry-accent' : 'text-zinc-500'
                }`}
              >
                <LinkIcon size={14} />
                <span>Image Link</span>
              </button>
            </div>

            {uploadType === 'file' ? (
              <AnimatePresence mode="popLayout">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed p-6 flex flex-col items-center justify-center cursor-pointer transition-colors rounded-xl ${
                    isDragging ? 'border-mariners-salmon bg-mariners-salmon/5' : 'border-zinc-200 bg-zinc-50 hover:border-mariners-salmon/50 hover:bg-zinc-100'
                  }`}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                  {selectedFile ? (
                    <div className="text-center">
                      <CheckCircle2 className="text-green-500 mx-auto mb-2" size={24} />
                      <p className="text-mariners-charcoal font-medium text-sm">{selectedFile.name}</p>
                    </div>
                  ) : (
                    <>
                      <ImageIcon className={`${isDragging ? 'text-mariners-salmon' : 'text-zinc-400'} mb-2 transition-colors`} size={24} />
                      <p className="text-xs font-medium text-mariners-charcoal">Click or drag a photo here</p>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            ) : (
              <input 
                value={formData.externalUrl}
                onChange={(e) => setFormData({...formData, externalUrl: e.target.value})}
                className="w-full bg-zinc-50 placeholder-zinc-400 border border-zinc-200 p-3 text-mariners-charcoal focus:outline-none focus:ring-1 focus:ring-mariners-salmon focus:border-mariners-salmon transition-colors rounded-none"
                placeholder="https://example.com/photo.jpg"
              />
            )}
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-mariners-charcoal text-white font-bold uppercase tracking-widest py-4 hover:bg-mariners-salmon transition-colors disabled:opacity-50 flex items-center justify-center space-x-2 rounded-lg mt-4"
          >
            {loading ? (
              <><Loader2 className="animate-spin" size={20} /><span>Publishing...</span></>
            ) : (
              <span>Publish Testimony</span>
            )}
          </button>
        </form>
      </div>

      {/* List Side */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold uppercase tracking-tight text-mariners-charcoal">Active Testimonies</h3>
          {onClose && (
            <button onClick={onClose} className="hidden lg:block text-zinc-400 hover:text-mariners-salmon transition-colors bg-zinc-50 p-2 rounded-full">
              <X size={20} />
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto pr-2 space-y-3 min-h-[300px]">
          {fetchingTestimonies ? (
            <div className="flex justify-center items-center h-20 text-zinc-400"><Loader2 className="animate-spin" size={24} /></div>
          ) : testimonies.length === 0 ? (
            <p className="text-zinc-400 text-sm italic py-4">No testimonies uploaded yet for this campus.</p>
          ) : (
            testimonies.map(t => (
              <div key={t.id} className="p-4 border border-zinc-200 bg-zinc-50 flex justify-between items-start group hover:border-mariners-salmon transition-colors rounded-lg">
                <div className="pr-4">
                  <div className="flex items-center gap-2 mb-2">
                    {t.image_url ? (
                      <img src={t.image_url} alt={t.author} className="w-8 h-8 rounded-full border border-black/10 object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-mariners-teal/10 flex items-center justify-center text-mariners-teal font-bold font-serif text-sm">
                        {t.author.charAt(0)}
                      </div>
                    )}
                    <p className="text-sm font-bold text-mariners-charcoal">{t.author}</p>
                  </div>
                  <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed">"{t.quote}"</p>
                </div>
                <button 
                  onClick={() => handleDelete(t.id, t.author)}
                  className="text-zinc-400 hover:text-red-500 p-2 rounded-full transition-colors"
                  title="Remove Testimony"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}
