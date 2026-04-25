import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/ui/HeroSection'
import LandingFeatures from '@/components/ui/LandingFeatures'
import DynamicImpactCounters from '@/components/ui/DynamicImpactCounters'
import TestimonialMarquee from '@/components/ui/TestimonialMarquee'
import InteractiveBentoSteps from '@/components/ui/InteractiveBentoSteps'
import ParallaxVideoCTA from '@/components/ui/ParallaxVideoCTA'

// Professional static fallbacks
const FALLBACK_HERO = [
  "https://images.unsplash.com/photo-1438232992991-995b7058bab3?q=80&w=2673&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1544427920-c49ccdaf8c48?q=80&w=2000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2000&auto=format&fit=crop"
]

const FALLBACK_WORSHIP = ["https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=80&w=1000&auto=format&fit=crop"]
const FALLBACK_GROUPS = ["https://images.unsplash.com/photo-1544427920-c49ccdaf8c48?q=80&w=1000&auto=format&fit=crop"]
const FALLBACK_BAPTISM = ["https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1000&auto=format&fit=crop"]

export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'

export default async function Home() {
  const supabase = await createClient()

  // Fetch all site content in parallel
  const [
    { data: heroData },
    { data: worshipData },
    { data: groupsData },
    { data: baptismData },
    { data: testimonyData }
  ] = await Promise.all([
    supabase.from('site_content').select('content_url').eq('section', 'hero_images').eq('is_active', true).eq('campus', 'main'),
    supabase.from('site_content').select('content_url').eq('section', 'landing_worship').eq('is_active', true).eq('campus', 'main'),
    supabase.from('site_content').select('content_url').eq('section', 'landing_groups').eq('is_active', true).eq('campus', 'main'),
    supabase.from('site_content').select('content_url').eq('section', 'landing_baptisms').eq('is_active', true).eq('campus', 'main'),
    supabase.from('testimonies').select('*').eq('campus', 'main')
  ])

  const heroImages = (heroData as any[])?.length ? (heroData as any[]).map(d => d.content_url) : FALLBACK_HERO
  const worshipImages = (worshipData as any[])?.length ? (worshipData as any[]).map(d => d.content_url) : FALLBACK_WORSHIP
  const groupsImages = (groupsData as any[])?.length ? (groupsData as any[]).map(d => d.content_url) : FALLBACK_GROUPS
  const baptismImages = (baptismData as any[])?.length ? (baptismData as any[]).map(d => d.content_url) : FALLBACK_BAPTISM
  const testimonies = (testimonyData as any[]) || []

  return (
    <div className="flex flex-col min-h-screen bg-mariners-cream">
      {/* Hero Section */}
      <HeroSection 
        title="Blessed Mission Main Campus" 
        subtitle="Serving to save a soul. Join a vibrant community of students and young professionals."
        images={heroImages}
      />

      {/* Dynamic Animated UI Sections */}
      <LandingFeatures 
        worshipImages={worshipImages}
        groupsImages={groupsImages}
        baptismImages={baptismImages}
      />

      {/* NEW PRO MAX EXPANSION SECTIONS */}
      <DynamicImpactCounters />
      <TestimonialMarquee dynamicTestimonies={testimonies} />
      <InteractiveBentoSteps />
      <ParallaxVideoCTA />

    </div>
  )
}
