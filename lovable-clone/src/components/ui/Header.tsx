'use client'

import { Button } from './Button'
import { PlusIcon, Bars3Icon } from '@heroicons/react/24/outline'

interface HeaderProps {
  onMenuClick: () => void
  onNewProject: () => void
}

export function Header({ onMenuClick, onNewProject }: HeaderProps) {
  return (
    <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-b border-border flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" onClick={onMenuClick}>
          <Bars3Icon className="w-5 h-5" />
        </Button>
        <h1 className="text-xl font-bold text-ai-gradient">BuildAI</h1>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button variant="ai" onClick={onNewProject}>
          <PlusIcon className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>
    </header>
  )
}
