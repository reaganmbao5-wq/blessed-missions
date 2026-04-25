'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Footer() {
  const pathname = usePathname()
  const isDashboardRoute = ['/studio-town', '/studio-main', '/shepherd', '/control', '/login'].some(route => pathname.startsWith(route))

  if (isDashboardRoute) return null

  return (
    <footer className="border-t border-white/10 bg-black py-24 text-zinc-400">
      <div className="container mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center md:items-start gap-12">
        <div className="space-y-6 max-w-sm flex flex-col items-center md:items-start text-center md:text-left">
          <Image
            src="/logo.png"
            alt="Blessed Missions Campus Ministries"
            width={240}
            height={65}
            className="object-contain brightness-0 invert"
          />
          <p className="text-base font-light italic opacity-80 leading-relaxed">
            "Serving to save a soul."<br/>
            Inspiring students and professionals across campuses.
          </p>
        </div>
        
        <div className="flex flex-col space-y-4 text-center md:text-left">
          <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-2">Connect</h4>
          <Link href="/visit" className="hover:text-white transition-colors text-sm uppercase tracking-wide">Visit Us</Link>
          <Link href="/highlights" className="hover:text-white transition-colors text-sm uppercase tracking-wide">Church Highlights</Link>
          <Link href="/events" className="hover:text-white transition-colors text-sm uppercase tracking-wide">Upcoming Events</Link>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-white/10 text-xs text-center">
        © {new Date().getFullYear()} Blessed Missions Campus Ministries. All rights reserved.
      </div>
    </footer>
  )
}
