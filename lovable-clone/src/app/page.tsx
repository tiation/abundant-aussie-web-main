'use client'

import { useState, useEffect } from 'react'
import { ChatInterface } from '@/components/chat/ChatInterface'
import { BuilderPreview } from '@/components/builder/BuilderPreview'
import { Header } from '@/components/ui/Header'
import { Sidebar } from '@/components/ui/Sidebar'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useChatStore } from '@/stores/chatStore'
import { useBuilderStore } from '@/stores/builderStore'
import { Button } from '@/components/ui/Button'
import { PlusIcon, CodeBracketIcon, EyeIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/outline'

export default function HomePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeView, setActiveView] = useState<'chat' | 'preview'>('chat')
  const { trackEvent, trackFeatureUsage } = useAnalytics()
  const { messages, isLoading } = useChatStore()
  const { currentProject, projects } = useBuilderStore()

  useEffect(() => {
    trackEvent('page_loaded', {
      page: 'home',
      user_agent: navigator.userAgent,
    })
  }, [trackEvent])

  const handleNewProject = () => {
    trackFeatureUsage('new_project')
    // Logic to create new project will be implemented
  }

  const handleViewToggle = (view: 'chat' | 'preview') => {
    setActiveView(view)
    trackFeatureUsage(`view_${view}`)
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        projects={projects}
        currentProject={currentProject}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          onNewProject={handleNewProject}
        />

        {/* Main Area */}
        <div className="flex-1 flex overflow-hidden">
          {/* Chat/Builder Toggle Bar */}
          <div className="flex flex-col w-16 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-r border-border">
            <div className="flex flex-col space-y-2 p-2">
              <Button
                variant={activeView === 'chat' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewToggle('chat')}
                className="w-12 h-12 p-0"
              >
                <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
              </Button>
              <Button
                variant={activeView === 'preview' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleViewToggle('preview')}
                className="w-12 h-12 p-0"
              >
                <EyeIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex">
            {/* Chat Interface */}
            <div className={`${activeView === 'chat' ? 'flex-1' : 'w-96'} transition-all duration-300`}>
              <ChatInterface />
            </div>

            {/* Builder Preview */}
            {activeView === 'preview' && (
              <div className="flex-1 border-l border-border">
                <BuilderPreview />
              </div>
            )}
          </div>
        </div>

        {/* Status Bar */}
        <div className="h-8 bg-slate-100 dark:bg-slate-800 border-t border-border flex items-center px-4 text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`} />
              <span>{isLoading ? 'AI Processing...' : 'Ready'}</span>
            </div>
            {currentProject && (
              <div className="flex items-center space-x-1">
                <CodeBracketIcon className="w-3 h-3" />
                <span>{currentProject.name}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <ChatBubbleLeftEllipsisIcon className="w-3 h-3" />
              <span>{messages.length} messages</span>
            </div>
          </div>
        </div>
      </div>

      {/* Welcome Modal for First-time Users */}
      {messages.length === 0 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <PlusIcon className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-ai-gradient">Welcome to BuildAI</h2>
              <p className="text-muted-foreground mb-6">
                Start building your website by chatting with our AI assistant. 
                Describe what you want to create, and we'll build it for you in real-time.
              </p>
              <Button
                onClick={() => {
                  trackFeatureUsage('welcome_dismissed')
                  // This will be handled by the chat store
                }}
                className="btn-ai w-full"
              >
                Start Building
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
