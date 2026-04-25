'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Highlights', href: '/highlights' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Events', href: '/events' },
  { name: 'Visit Us', href: '/visit' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Hide Navbar completely on dashboard routes
  const isDashboardRoute = ['/studio-town', '/studio-main', '/shepherd', '/control', '/login'].some(route => pathname.startsWith(route))

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (isDashboardRoute) return null

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled ? 'bg-black/90 backdrop-blur-lg py-3 border-b border-white/5' : 'bg-transparent py-8'
      }`}
    >
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        <motion.div
          initial={false}
          animate={{ 
            opacity: isScrolled ? 1 : 0,
            pointerEvents: isScrolled ? 'auto' : 'none'
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <Link href="/" className="flex items-center hover:opacity-90 transition-opacity">
            <Image
              src="/logo.png"
              alt="Blessed Missions Campus Ministries Logo"
              width={160}
              height={45}
              className="object-contain brightness-0 invert"
              priority
            />
          </Link>
        </motion.div>

        {/* Desktop Nav */}
        <div className="hidden md:flex space-x-8 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm tracking-wide uppercase transition-colors hover:text-white ${
                pathname === link.href ? 'text-white' : 'text-zinc-400'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-black border-b border-white/10 flex flex-col p-6 space-y-6 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-lg transition-colors ${
                  pathname === link.href ? 'text-white' : 'text-zinc-400'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
