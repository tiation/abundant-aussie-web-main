'use client'

import { useState, useRef, useEffect } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { useBuilderStore } from '@/stores/builderStore'
import { useAnalytics } from '@/hooks/useAnalytics'
import { useStoreHydration } from '@/hooks/useStoreHydration'
import { Button } from '@/components/ui/Button'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'
import { formatTime } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function ChatInterface() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const hasHydrated = useStoreHydration()
  
  const { messages, isLoading, sendMessage } = useChatStore()
  const { startBuild, currentProject } = useBuilderStore()
  const { trackChatInteraction } = useAnalytics()
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    
    const message = input.trim()
    setInput('')
    
    // Track chat interaction
    trackChatInteraction('message_sent', {
      message_length: message.length,
      word_count: message.split(' ').length,
    })
    
    // Send message to chat
    sendMessage(message)
    
    // If we have a current project, start building based on the message
    if (currentProject) {
      await startBuild(currentProject.id, message)
    }
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }
  
  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])
  
  // Show loading state during hydration
  if (!hasHydrated) {
    return (
      <div className="flex flex-col h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-sm text-muted-foreground">Loading chat...</p>
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className="flex flex-col h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 opacity-50">
                <span className="text-2xl">🤖</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Start Building with AI</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Describe what you want to create and I'll help you build it step by step.
              </p>
              <div className="grid grid-cols-1 gap-2 text-left">
                <div className="p-3 bg-accent/50 rounded-lg">
                  <p className="text-sm font-medium">Example prompts:</p>
                  <ul className="text-xs text-muted-foreground mt-1 space-y-1">
                    <li>• "Create a landing page for a SaaS product"</li>
                    <li>• "Build a portfolio website with dark mode"</li>
                    <li>• "Make a simple blog with navigation"</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'rounded-2xl px-4 py-3 max-w-[80%] break-words',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground ml-12'
                      : 'bg-secondary text-secondary-foreground mr-12 border'
                  )}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-between mt-2 text-xs opacity-70">
                    <span>{formatTime(message.timestamp)}</span>
                    {message.metadata?.model && (
                      <span className="text-xs bg-black/10 dark:bg-white/10 px-2 py-1 rounded">
                        {message.metadata.model}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary text-secondary-foreground rounded-2xl px-4 py-3 mr-12 border">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="border-t border p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe what you want to build..."
              className="w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[2.5rem] max-h-32"
              disabled={isLoading}
              rows={1}
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            loading={isLoading}
            className="self-end"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
          </Button>
        </form>
        
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          {input.length > 0 && (
            <span>{input.length}/2000</span>
          )}
        </div>
      </div>
    </div>
  )
}
