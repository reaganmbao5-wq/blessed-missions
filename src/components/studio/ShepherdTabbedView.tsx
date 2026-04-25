'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Church, MapPin, Users, Activity, ShieldCheck } from 'lucide-react'
import FollowUpList from './FollowUpList'
import ShepherdMediaControl from './ShepherdMediaControl'

interface ShepherdTabbedViewProps {
  stats: {
    totalNewSoulsWeekly: number
    totalVisitorsWeekly: number
    needsPrayerCount: number
    needsHelpCount: number
    kabweNewSouls: number
    mainNewSouls: number
    kabweVisitors: number
    mainVisitors: number
  }
  allRecords: any[]
}

export default function ShepherdTabbedView({ stats, allRecords }: ShepherdTabbedViewProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'main' | 'town'>('overview')

  const tabs = [
    { id: 'overview', label: 'Ministry Overview', icon: LayoutDashboard },
    { id: 'main', label: 'Main Campus', icon: Church },
    { id: 'town', label: 'Town Campus', icon: MapPin },
  ]

  return (
    <div className="space-y-10">
      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 p-1 bg-white/5 border border-white/10 rounded-2xl w-fit">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold uppercase tracking-widest transition-all ${
                isActive 
                ? 'bg-ministry-accent text-white shadow-lg shadow-ministry-accent/20' 
                : 'text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-12"
          >
            {/* Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                label="New Souls (7D)" 
                value={stats.totalNewSoulsWeekly} 
                accent="ministry-accent"
                icon={<Users size={20} />}
              />
              <StatCard 
                label="Visitors (7D)" 
                value={stats.totalVisitorsWeekly} 
                icon={<Activity size={20} />}
              />
              <StatCard 
                label="Prayer Requests" 
                value={stats.needsPrayerCount} 
                variant="warning"
                icon={<ShieldCheck size={20} />}
              />
              <StatCard 
                label="Practical Help" 
                value={stats.needsHelpCount} 
                variant="info"
                icon={<ShieldCheck size={20} />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              <div className="lg:col-span-4 space-y-8">
                {/* Campus Breakdown Card */}
                <div className="bg-zinc-950 border border-white/10 p-8 rounded-3xl shadow-xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />
                  <h2 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-8 flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-ministry-accent animate-pulse" /> Growth Distribution
                  </h2>
                  
                  <div className="space-y-8 relative z-10">
                    <CampusProgress 
                      label="Main Campus" 
                      souls={stats.mainNewSouls} 
                      visitors={stats.mainVisitors} 
                      color="white" 
                      total={allRecords.filter(v => v.is_new_soul).length}
                    />
                    <div className="pt-4 border-t border-white/5">
                      <CampusProgress 
                        label="Kabwe Town" 
                        souls={stats.kabweNewSouls} 
                        visitors={stats.kabweVisitors} 
                        color="ministry-accent" 
                        total={allRecords.filter(v => v.is_new_soul).length}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8">
                <div className="bg-zinc-950 border border-white/10 p-8 rounded-3xl shadow-xl">
                   <h2 className="text-xl font-bold font-serif text-white mb-8 flex items-center gap-3">
                     Master Follow-up Board
                   </h2>
                   <FollowUpList initialVisitors={allRecords} />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'main' && (
          <motion.div
            key="main"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-zinc-950 border border-white/10 p-8 rounded-3xl shadow-2xl space-y-8"
          >
            <div className="border-b border-white/10 pb-8">
              <h2 className="text-3xl font-bold font-serif text-white mb-2 underline decoration-white/10 underline-offset-8">Main Campus Moderation</h2>
              <p className="text-zinc-500 max-w-2xl">
                Global oversight of sermons, gallery highlights, and events specifically for the Main Campus body.
              </p>
            </div>
            <ShepherdMediaControl campusFilter="main" />
          </motion.div>
        )}

        {activeTab === 'town' && (
          <motion.div
            key="town"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="bg-zinc-950 border border-white/10 p-8 rounded-3xl shadow-2xl space-y-8"
          >
            <div className="border-b border-white/10 pb-8">
              <h2 className="text-3xl font-bold font-serif text-ministry-accent mb-2 underline decoration-ministry-accent/10 underline-offset-8">Town Campus (Kabwe)</h2>
              <p className="text-zinc-500 max-w-2xl">
                Moderate session uploads and community events originating from the Kabwe Town campus.
              </p>
            </div>
            <ShepherdMediaControl campusFilter="kabwe" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function StatCard({ label, value, accent, variant, icon }: any) {
  const borderClass = accent 
    ? `border-l-4 border-l-${accent}` 
    : variant === 'warning' ? 'border-l-4 border-l-yellow-500' 
    : variant === 'info' ? 'border-l-4 border-l-blue-500'
    : 'border-l-4 border-white/10'

  return (
    <div className={`bg-zinc-950 border border-white/10 p-8 rounded-2xl ${borderClass} transition-all hover:bg-white/5 group`}>
      <div className="flex justify-between items-start mb-6">
        <h3 className="uppercase text-[10px] font-bold tracking-widest text-zinc-500 group-hover:text-zinc-300 transition-colors">{label}</h3>
        <div className="text-zinc-500 group-hover:text-white transition-colors">{icon}</div>
      </div>
      <p className={`text-5xl font-light tracking-tighter ${accent ? 'text-ministry-accent' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function CampusProgress({ label, souls, visitors, color, total }: any) {
  const percentage = total ? (souls / total) * 100 : 0
  const colorClass = color === 'ministry-accent' ? 'bg-ministry-accent' : 'bg-white'
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-end">
        <span className="text-lg uppercase font-serif text-white tracking-tight">{label}</span>
        <span className={`text-2xl font-light ${color === 'ministry-accent' ? 'text-ministry-accent' : 'text-white'}`}>
          {souls} <span className="text-[10px] text-zinc-600 uppercase tracking-widest font-bold">Souls</span>
        </span>
      </div>
      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className={`${colorClass} h-full`}
        />
      </div>
      <div className="flex justify-between text-[10px] uppercase tracking-widest font-bold">
        <span className="text-zinc-600">Visitors Accounted</span>
        <span className="text-zinc-400">{visitors}</span>
      </div>
    </div>
  )
}
