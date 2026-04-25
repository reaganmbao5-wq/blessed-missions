'use client'

import { toast } from 'sonner'
import { Plus, Edit2 } from 'lucide-react'

export function InviteUserButton() {
  return (
    <button 
      onClick={() => {
        toast('Invitation Sent', { description: 'A magic link has been sent to the new user.', icon: <Plus size={16} /> })
      }}
      className="text-xs font-bold uppercase tracking-widest bg-white text-black px-4 py-2 hover:bg-ministry-accent transition-colors flex items-center gap-2"
    >
      <Plus size={14} /> Invite User
    </button>
  )
}

export function EditUserButton({ user }: { user: any }) {
  return (
    <button 
      onClick={() => {
        toast('Edit Mode', { description: `Opened editing modal for ${user.name}.`, icon: <Edit2 size={16} /> })
      }}
      className="text-xs uppercase font-bold text-zinc-500 hover:text-white transition-colors"
    >
      Edit
    </button>
  )
}
