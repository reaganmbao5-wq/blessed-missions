import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardSidebar from '@/components/studio/DashboardSidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/login')
  }

  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!userData) {
    // If they have auth but no user profile record, log them out
    await supabase.auth.signOut()
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-sans flex">
      {/* Sidebar - fixed width */}
      <div className="w-64 flex-shrink-0 hidden md:block">
        <DashboardSidebar role={(userData as any).role} userEmail={user.email!} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-x-hidden p-6 md:p-10 ml-0 md:ml-64 transition-all w-full">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  )
}
