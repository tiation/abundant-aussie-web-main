import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/utils'

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  metadata?: {
    tokens?: number
    model?: string
    error?: boolean
    processing?: boolean
  }
}

export interface ChatSession {
  id: string
  name: string
  messages: ChatMessage[]
  createdAt: Date
  updatedAt: Date
  projectId?: string
}

interface ChatState {
  // Current session
  currentSession: ChatSession | null
  messages: ChatMessage[]
  isLoading: boolean
  isTyping: boolean
  
  // All sessions
  sessions: ChatSession[]
  
  // Actions
  sendMessage: (content: string) => void
  receiveMessage: (content: string, metadata?: ChatMessage['metadata']) => void
  addSystemMessage: (content: string) => void
  setLoading: (loading: boolean) => void
  setTyping: (typing: boolean) => void
  clearMessages: () => void
  deleteMessage: (messageId: string) => void
  editMessage: (messageId: string, newContent: string) => void
  
  // Session management
  createSession: (name?: string, projectId?: string) => ChatSession
  switchSession: (sessionId: string) => void
  deleteSession: (sessionId: string) => void
  renameSession: (sessionId: string, newName: string) => void
  
  // Utility
  exportChat: () => string
  importChat: (chatData: string) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentSession: null,
      messages: [],
      isLoading: false,
      isTyping: false,
      sessions: [],
      
      // Message actions
      sendMessage: (content: string) => {
        const { currentSession } = get()
        if (!currentSession) {
          // Create a new session if none exists
          const newSession = get().createSession()
          set({ currentSession: newSession })
        }
        
        const message: ChatMessage = {
          id: generateId(),
          role: 'user',
          content,
          timestamp: new Date(),
        }
        
        set((state) => {
          const updatedMessages = [...state.messages, message]
          const updatedSession = state.currentSession ? {
            ...state.currentSession,
            messages: updatedMessages,
            updatedAt: new Date(),
          } : null
          
          const updatedSessions = state.sessions.map(s => 
            s.id === updatedSession?.id ? updatedSession : s
          )
          
          return {
            messages: updatedMessages,
            currentSession: updatedSession,
            sessions: updatedSessions,
            isLoading: true,
          }
        })
        
        // Simulate AI response (replace with actual API call)
        setTimeout(() => {
          get().receiveMessage(`I understand you want to: "${content}". Let me help you build that!`, {
            model: 'gpt-4',
            tokens: 50,
          })
        }, 2000)
      },
      
      receiveMessage: (content: string, metadata?: ChatMessage['metadata']) => {
        const message: ChatMessage = {
          id: generateId(),
          role: 'assistant',
          content,
          timestamp: new Date(),
          metadata,
        }
        
        set((state) => {
          const updatedMessages = [...state.messages, message]
          const updatedSession = state.currentSession ? {
            ...state.currentSession,
            messages: updatedMessages,
            updatedAt: new Date(),
          } : null
          
          const updatedSessions = state.sessions.map(s => 
            s.id === updatedSession?.id ? updatedSession : s
          )
          
          return {
            messages: updatedMessages,
            currentSession: updatedSession,
            sessions: updatedSessions,
            isLoading: false,
            isTyping: false,
          }
        })
      },
      
      addSystemMessage: (content: string) => {
        const message: ChatMessage = {
          id: generateId(),
          role: 'system',
          content,
          timestamp: new Date(),
        }
        
        set((state) => {
          const updatedMessages = [...state.messages, message]
          const updatedSession = state.currentSession ? {
            ...state.currentSession,
            messages: updatedMessages,
            updatedAt: new Date(),
          } : null
          
          return {
            messages: updatedMessages,
            currentSession: updatedSession,
          }
        })
      },
      
      setLoading: (loading: boolean) => set({ isLoading: loading }),
      setTyping: (typing: boolean) => set({ isTyping: typing }),
      
      clearMessages: () => {
        set((state) => {
          const updatedSession = state.currentSession ? {
            ...state.currentSession,
            messages: [],
            updatedAt: new Date(),
          } : null
          
          return {
            messages: [],
            currentSession: updatedSession,
          }
        })
      },
      
      deleteMessage: (messageId: string) => {
        set((state) => {
          const updatedMessages = state.messages.filter(m => m.id !== messageId)
          const updatedSession = state.currentSession ? {
            ...state.currentSession,
            messages: updatedMessages,
            updatedAt: new Date(),
          } : null
          
          return {
            messages: updatedMessages,
            currentSession: updatedSession,
          }
        })
      },
      
      editMessage: (messageId: string, newContent: string) => {
        set((state) => {
          const updatedMessages = state.messages.map(m => 
            m.id === messageId ? { ...m, content: newContent } : m
          )
          const updatedSession = state.currentSession ? {
            ...state.currentSession,
            messages: updatedMessages,
            updatedAt: new Date(),
          } : null
          
          return {
            messages: updatedMessages,
            currentSession: updatedSession,
          }
        })
      },
      
      // Session management
      createSession: (name?: string, projectId?: string) => {
        const session: ChatSession = {
          id: generateId(),
          name: name || `Chat ${get().sessions.length + 1}`,
          messages: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          projectId,
        }
        
        set((state) => ({
          sessions: [...state.sessions, session],
          currentSession: session,
          messages: [],
        }))
        
        return session
      },
      
      switchSession: (sessionId: string) => {
        const { sessions } = get()
        const session = sessions.find(s => s.id === sessionId)
        if (session) {
          set({
            currentSession: session,
            messages: session.messages,
          })
        }
      },
      
      deleteSession: (sessionId: string) => {
        set((state) => {
          const updatedSessions = state.sessions.filter(s => s.id !== sessionId)
          const newCurrentSession = state.currentSession?.id === sessionId 
            ? (updatedSessions[0] || null) 
            : state.currentSession
          
          return {
            sessions: updatedSessions,
            currentSession: newCurrentSession,
            messages: newCurrentSession?.messages || [],
          }
        })
      },
      
      renameSession: (sessionId: string, newName: string) => {
        set((state) => {
          const updatedSessions = state.sessions.map(s => 
            s.id === sessionId ? { ...s, name: newName, updatedAt: new Date() } : s
          )
          const updatedCurrentSession = state.currentSession?.id === sessionId
            ? { ...state.currentSession, name: newName }
            : state.currentSession
          
          return {
            sessions: updatedSessions,
            currentSession: updatedCurrentSession,
          }
        })
      },
      
      // Utility functions
      exportChat: () => {
        const { currentSession } = get()
        if (!currentSession) return ''
        
        return JSON.stringify(currentSession, null, 2)
      },
      
      importChat: (chatData: string) => {
        try {
          const session: ChatSession = JSON.parse(chatData)
          set((state) => ({
            sessions: [...state.sessions, session],
            currentSession: session,
            messages: session.messages,
          }))
        } catch (error) {
          console.error('Failed to import chat:', error)
        }
      },
    }),
    {
      name: 'chat-store',
      version: 1,
    }
  )
)
