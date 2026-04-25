import { createClient } from '@/lib/supabase/server'
import { InviteUserButton, EditUserButton } from '@/components/studio/ControlActions'
export default async function ControlPanelPage() {
  const supabase = await createClient()
  
  const { data: users } = await supabase.from('users').select('*').order('created_at', { ascending: false })

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold uppercase tracking-tight text-white mb-2">Control Panel</h1>
        <p className="text-zinc-400 font-light">System Administration & User Management.</p>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-zinc-900 border border-green-500/30 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-zinc-400 uppercase text-[10px] font-bold tracking-widest mb-1">Database Status</h3>
            <p className="text-green-500 font-bold uppercase tracking-widest text-sm">Connected</p>
          </div>
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
        </div>
        <div className="bg-zinc-900 border border-white/10 p-6 flex flex-col justify-center">
          <h3 className="text-zinc-400 uppercase text-[10px] font-bold tracking-widest mb-1">Active Users</h3>
          <p className="text-2xl font-light text-white">{users?.length || 0}</p>
        </div>
      </div>

      {/* User Management Table */}
      <div className="bg-black border border-white/10 overflow-hidden">
        <div className="p-6 border-b border-white/10 flex justify-between items-center bg-zinc-900/50">
          <h2 className="text-lg font-bold uppercase tracking-tight text-white">System Users</h2>
          <InviteUserButton />
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black border-b border-white/10">
              <tr>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Name</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Email</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Role</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500">Campus</th>
                <th className="p-4 text-xs font-bold uppercase tracking-widest text-zinc-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {(users as any[])?.map((user) => (
                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 text-white font-medium">{user.name}</td>
                  <td className="p-4 text-zinc-400">{user.email}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 bg-white/10 text-[10px] font-bold text-white uppercase tracking-widest rounded-sm border border-white/10">
                      {user.role?.replace('_', ' ') || 'User'}
                    </span>
                  </td>
                  <td className="p-4 text-zinc-400 uppercase text-xs font-bold tracking-wider">{user.campus || '-'}</td>
                  <td className="p-4 text-right">
                    <EditUserButton user={user} />
                  </td>
                </tr>
              ))}
              {(!users || users.length === 0) && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-zinc-500">No users found. Check backend sync.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
