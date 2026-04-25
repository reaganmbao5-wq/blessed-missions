'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Lock } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Success! Fetch profile to determine where to redirect
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase
        .from('users')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profile?.role) {
        if (profile.role === 'media_town') router.push('/studio-town')
        else if (profile.role === 'media_main') router.push('/studio-main')
        else if (profile.role === 'pastor') router.push('/shepherd')
        else if (profile.role === 'admin') router.push('/control')
        else router.push('/')
      } else {
        router.push('/')
      }
    }

    router.refresh()
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black px-4">
      <div className="absolute inset-0 bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))]" />
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10 flex flex-col items-center gap-3">
          <Image
            src="/logo.png"
            alt="Blessed Missions Campus Ministries"
            width={320}
            height={90}
            className="object-contain brightness-0 invert mb-2"
            priority
          />
          <p className="text-zinc-500 font-light tracking-widest text-xs uppercase">Ministry Portal — Sign in to continue</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 bg-zinc-900 border border-white/10 p-8">
          {error && (
            <div className="p-4 bg-red-950/50 border border-red-500/50 text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-white/10 p-3 text-white focus:outline-none focus:border-ministry-accent transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Password</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 p-3 text-white focus:outline-none focus:border-ministry-accent transition-colors"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-ministry-accent transition-colors disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}
