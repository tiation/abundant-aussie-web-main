'use client'

import { BuilderProject } from '@/stores/builderStore'
import { cn } from '@/lib/utils'
import { FolderIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  projects: BuilderProject[]
  currentProject: BuilderProject | null
}

export function Sidebar({ isOpen, onToggle, projects, currentProject }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 h-full w-64 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-r border-border transform transition-transform duration-300 z-50',
          'lg:relative lg:translate-x-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold">Projects</h2>
          <button
            onClick={onToggle}
            className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 lg:hidden"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {projects.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <FolderIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No projects yet</p>
              <p className="text-sm">Create your first project to get started</p>
            </div>
          ) : (
            <div className="space-y-2">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={cn(
                    'p-3 rounded-lg border cursor-pointer transition-colors',
                    currentProject?.id === project.id
                      ? 'bg-primary/10 border-primary/20 text-primary'
                      : 'hover:bg-accent hover:text-accent-foreground'
                  )}
                >
                  <h3 className="font-medium truncate">{project.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className={cn(
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                      project.status === 'completed' && 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
                      project.status === 'building' && 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
                      project.status === 'draft' && 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
                      project.status === 'error' && 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    )}>
                      {project.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
