'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle } from 'lucide-react'

interface ConfirmDialogProps {
  isOpen: boolean
  title: string
  message: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel: () => void
  variant?: 'danger' | 'warning' | 'info'
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'danger'
}: ConfirmDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
          />
          
          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-[101] p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-zinc-950 border border-white/10 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl pointer-events-auto"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl shrink-0 ${
                    variant === 'danger' ? 'bg-red-500/10 text-red-500' :
                    variant === 'warning' ? 'bg-yellow-500/10 text-yellow-500' :
                    'bg-ministry-accent/10 text-ministry-accent'
                  }`}>
                    <AlertCircle size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-serif text-white mb-2">{title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{message}</p>
                  </div>
                  <button 
                    onClick={onCancel}
                    className="text-zinc-500 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="bg-white/5 p-4 flex gap-3 justify-end">
                <button
                  onClick={onCancel}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  className={`px-8 py-2.5 rounded-xl text-sm font-bold uppercase tracking-widest text-white transition-all shadow-lg ${
                    variant === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-900/20' :
                    variant === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700 shadow-yellow-900/20' :
                    'bg-ministry-accent hover:opacity-90 shadow-ministry-accent/20'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
