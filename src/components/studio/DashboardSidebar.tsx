'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, Image as ImageIcon, Video, Calendar, Settings, LogOut } from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'

interface SidebarProps {
  role: 'media_town' | 'media_main' | 'pastor' | 'admin'
  userEmail: string
}

export default function DashboardSidebar({ role, userEmail }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  let links: any[] = []

  if (role === 'admin') {
    links = [
      { name: 'Control Panel', href: '/control', icon: Settings },
    ]
  } else if (role === 'pastor') {
    links = [
      { name: 'Shepherd Analytics', href: '/shepherd', icon: LayoutDashboard },
    ]
  } else if (role === 'media_town') {
    links = [
      { name: 'Town Studio', href: '/studio-town', icon: LayoutDashboard },
    ]
  } else if (role === 'media_main') {
    links = [
      { name: 'Main Studio', href: '/studio-main', icon: LayoutDashboard },
    ]
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="w-64 h-screen bg-black border-r border-white/5 flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-xl font-bold uppercase tracking-tighter text-white">Portal</h2>
        <p className="text-xs text-zinc-500 font-mono mt-2 truncate">{userEmail}</p>
        <span className="inline-block mt-2 px-2 py-1 bg-white/10 text-[10px] font-bold uppercase tracking-widest text-ministry-accent rounded-sm">
          {role.replace('_', ' ')}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href || pathname.startsWith(link.href + '/')
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-3 px-6 py-3 text-sm font-medium transition-colors ${
                  isActive ? 'bg-white/5 text-white border-r-2 border-ministry-accent' : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 text-sm font-medium text-zinc-500 hover:text-white transition-colors w-full"
        >
          <LogOut size={18} />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  )
}
