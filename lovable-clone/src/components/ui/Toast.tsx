'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { XMarkIcon, CheckCircleIcon, ExclamationTriangleIcon, InformationCircleIcon } from '@heroicons/react/24/outline'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

const toastIcons = {
  success: CheckCircleIcon,
  error: ExclamationTriangleIcon,
  warning: ExclamationTriangleIcon,
  info: InformationCircleIcon,
}

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400',
  error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400',
  info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
}

// Global toast state
let toastMessages: ToastMessage[] = []
let setToastMessages: React.Dispatch<React.SetStateAction<ToastMessage[]>> | null = null

export function showToast(toast: Omit<ToastMessage, 'id'>) {
  const id = Math.random().toString(36).substr(2, 9)
  const newToast: ToastMessage = {
    id,
    duration: 5000,
    ...toast,
  }
  
  if (setToastMessages) {
    setToastMessages(prev => [...prev, newToast])
    
    // Auto remove after duration
    setTimeout(() => {
      removeToast(id)
    }, newToast.duration)
  }
}

export function removeToast(id: string) {
  if (setToastMessages) {
    setToastMessages(prev => prev.filter(toast => toast.id !== id))
  }
}

export function Toast() {
  const [messages, setMessages] = useState<ToastMessage[]>([])
  
  useEffect(() => {
    setToastMessages = setMessages
    return () => {
      setToastMessages = null
    }
  }, [])
  
  if (messages.length === 0) return null
  
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {messages.map((toast) => {
        const Icon = toastIcons[toast.type]
        
        return (
          <div
            key={toast.id}
            className={cn(
              'flex items-start space-x-3 p-4 rounded-lg border shadow-lg backdrop-blur-sm transition-all duration-300 transform',
              'animate-in slide-in-from-right-full',
              toastStyles[toast.type],
              'max-w-sm w-full'
            )}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.message && (
                <p className="text-sm opacity-90 mt-1">{toast.message}</p>
              )}
              {toast.action && (
                <button
                  onClick={toast.action.onClick}
                  className="text-sm font-medium underline hover:no-underline mt-2"
                >
                  {toast.action.label}
                </button>
              )}
            </div>
            
            <button
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )
      })}
    </div>
  )
}
