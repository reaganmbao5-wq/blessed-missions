'use client'

import { useState } from 'react'
import MediaManager from './MediaManager'
import VisitorForm from './VisitorForm'
import TestimonyManager from './TestimonyManager'
import { LayoutDashboard, Users, Image as ImageIcon, Video, Calendar, Plus, ArrowRight, MessageSquare } from 'lucide-react'

interface StudioDashboardProps {
  campus: 'kabwe' | 'main'
  visitorCount: number
  userId: string
}

export default function StudioDashboard({ campus, visitorCount, userId }: StudioDashboardProps) {
  const [activeAction, setActiveAction] = useState<string | null>(null)

  const actions = [
    { id: 'gallery', title: 'Upload Gallery', description: 'Add recent photos', icon: ImageIcon, color: 'text-blue-400', initialTab: 'gallery' },
    { id: 'sermon', title: 'Upload Sermon', description: 'Full Sunday message', icon: Video, color: 'text-red-400', initialTab: 'sermon' },
    { id: 'highlight', title: 'Upload Highlight', description: 'Short clips / worship', icon: Video, color: 'text-pink-400', initialTab: 'highlight' },
    { id: 'event', title: 'Upcoming Events', description: 'Post house gatherings', icon: Calendar, color: 'text-purple-400', initialTab: 'event' },
    { id: 'visitors', title: 'Record Visitors', description: 'Bulk entry for Sunday', icon: Users, color: 'text-green-400', initialTab: null },
    { id: 'testimonies', title: 'Student Voices', description: 'Manage testimonies', icon: MessageSquare, color: 'text-yellow-400', initialTab: null },
    { id: 'branding', title: 'Manage Branding', description: 'Hero & Landing images', icon: LayoutDashboard, color: 'text-ministry-accent', initialTab: 'hero' },
  ]

  if (activeAction === 'visitors') {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setActiveAction(null)}
          className="flex items-center text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowRight size={14} className="rotate-180 mr-2" /> Back to Dashboard
        </button>
        <VisitorForm campus={campus} userId={userId} />
      </div>
    )
  }

  if (activeAction === 'testimonies') {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setActiveAction(null)}
          className="flex items-center text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowRight size={14} className="rotate-180 mr-2" /> Back to Dashboard
        </button>
        <TestimonyManager campus={campus} onClose={() => setActiveAction(null)} />
      </div>
    )
  }

  if (activeAction) {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setActiveAction(null)}
          className="flex items-center text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
        >
          <ArrowRight size={14} className="rotate-180 mr-2" /> Back to Dashboard
        </button>
        <MediaManager 
          campus={campus} 
          initialCategory={actions.find(a => a.id === activeAction)?.initialTab || 'sermon'}
          onSuccess={() => setActiveAction(null)} 
          onClose={() => setActiveAction(null)}
        />
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900 border border-white/10 p-8 flex flex-col justify-between group hover:border-ministry-accent/30 transition-colors">
          <h3 className="text-zinc-500 uppercase text-xs font-bold tracking-widest mb-4">Total Campus Visitors</h3>
          <div className="flex items-baseline space-x-2">
            <p className="text-6xl font-light text-white">{visitorCount}</p>
            <span className="text-zinc-600 text-sm font-mono uppercase tracking-tighter">Souls</span>
          </div>
        </div>
        
        <div className="bg-zinc-900 border border-white/10 p-8 flex flex-col justify-between md:col-span-2">
          <h3 className="text-zinc-500 uppercase text-xs font-bold tracking-widest mb-4">Live Status</h3>
          <div className="flex-1 flex flex-col justify-center">
             <div className="flex items-center space-x-2 mb-2">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
               <p className="text-white font-medium uppercase tracking-tight text-sm">System Operational</p>
             </div>
             <p className="text-zinc-500 text-xs font-light">Connected to Supabase Cloud Engine. Media uploads are restricted to 50MB per file.</p>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h2 className="text-xl font-bold uppercase tracking-tight mb-8 flex items-center border-l-2 border-ministry-accent pl-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => setActiveAction(action.id)}
              className="p-8 border border-white/10 bg-black hover:border-ministry-accent/50 transition-all duration-300 text-left group flex flex-col h-full"
            >
              <action.icon className={`${action.color} mb-6 group-hover:scale-110 transition-transform`} size={28} />
              <h4 className="font-bold text-white uppercase tracking-tight mb-2 group-hover:text-ministry-accent transition-colors">
                {action.title}
              </h4>
              <p className="text-xs text-zinc-500 font-light mt-auto">
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Guidance Section */}
      <div className="p-8 bg-zinc-900/50 border border-dashed border-white/5 rounded-sm">
        <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-4">Media Crew Instructions</h3>
        <ul className="text-xs text-zinc-500 space-y-3 font-light leading-relaxed">
          <li className="flex items-start">
            <span className="text-ministry-accent mr-2">•</span>
            <span>Always include a **Sermon Summary** for Highlight uploads to help members study at home.</span>
          </li>
          <li className="flex items-start">
            <span className="text-ministry-accent mr-2">•</span>
            <span>Use **External Links (YouTube)** for videos longer than 5 minutes to ensure fast page loads.</span>
          </li>
          <li className="flex items-start">
            <span className="text-ministry-accent mr-2">•</span>
            <span>Tag your media with the correct **Campus** to avoid content overlaps on the homepage.</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
