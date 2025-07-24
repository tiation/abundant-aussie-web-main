import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId } from '@/lib/utils'

export interface BuilderProject {
  id: string
  name: string
  description: string
  createdAt: Date
  updatedAt: Date
  status: 'draft' | 'building' | 'completed' | 'error'
  code: {
    html: string
    css: string
    javascript: string
  }
  preview?: {
    url: string
    lastGenerated: Date
  }
  metadata: {
    framework?: 'html' | 'react' | 'vue' | 'angular'
    theme?: 'light' | 'dark' | 'auto'
    components: string[]
    pages: string[]
  }
}

interface BuilderState {
  // Projects
  projects: BuilderProject[]
  currentProject: BuilderProject | null
  
  // Building state
  isBuilding: boolean
  buildProgress: number
  buildSteps: string[]
  currentBuildStep: string
  
  // Preview
  previewMode: 'desktop' | 'tablet' | 'mobile'
  previewUrl: string | null
  
  // Actions
  createProject: (name: string, description: string) => BuilderProject
  updateProject: (projectId: string, updates: Partial<BuilderProject>) => void
  deleteProject: (projectId: string) => void
  setCurrentProject: (projectId: string) => void
  duplicateProject: (projectId: string, newName: string) => BuilderProject
  
  // Building
  startBuild: (projectId: string, instructions: string) => Promise<void>
  updateBuildProgress: (progress: number, step: string) => void
  completeBuild: (code: BuilderProject['code']) => void
  cancelBuild: () => void
  
  // Code management
  updateCode: (type: 'html' | 'css' | 'javascript', content: string) => void
  exportProject: (projectId: string) => string
  importProject: (projectData: string) => void
  
  // Preview
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void
  generatePreview: () => Promise<string>
  updatePreviewUrl: (url: string) => void
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    (set, get) => ({
      // Initial state
      projects: [],
      currentProject: null,
      isBuilding: false,
      buildProgress: 0,
      buildSteps: [],
      currentBuildStep: '',
      previewMode: 'desktop',
      previewUrl: null,
      
      // Project management
      createProject: (name: string, description: string) => {
        const project: BuilderProject = {
          id: generateId(),
          name,
          description,
          createdAt: new Date(),
          updatedAt: new Date(),
          status: 'draft',
          code: {
            html: '<!DOCTYPE html>\n<html>\n<head>\n  <title>New Project</title>\n</head>\n<body>\n  <h1>Welcome to your new project!</h1>\n</body>\n</html>',
            css: '/* Add your styles here */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  padding: 20px;\n}',
            javascript: '// Add your JavaScript here\nconsole.log("Project initialized");'
          },
          metadata: {
            framework: 'html',
            theme: 'light',
            components: [],
            pages: ['index']
          }
        }
        
        set((state) => ({
          projects: [...state.projects, project],
          currentProject: project
        }))
        
        return project
      },
      
      updateProject: (projectId: string, updates: Partial<BuilderProject>) => {
        set((state) => {
          const updatedProjects = state.projects.map(p => 
            p.id === projectId 
              ? { ...p, ...updates, updatedAt: new Date() }
              : p
          )
          
          const updatedCurrentProject = state.currentProject?.id === projectId
            ? { ...state.currentProject, ...updates, updatedAt: new Date() }
            : state.currentProject
          
          return {
            projects: updatedProjects,
            currentProject: updatedCurrentProject
          }
        })
      },
      
      deleteProject: (projectId: string) => {
        set((state) => {
          const updatedProjects = state.projects.filter(p => p.id !== projectId)
          const newCurrentProject = state.currentProject?.id === projectId
            ? (updatedProjects[0] || null)
            : state.currentProject
          
          return {
            projects: updatedProjects,
            currentProject: newCurrentProject
          }
        })
      },
      
      setCurrentProject: (projectId: string) => {
        const { projects } = get()
        const project = projects.find(p => p.id === projectId)
        if (project) {
          set({ currentProject: project })
        }
      },
      
      duplicateProject: (projectId: string, newName: string) => {
        const { projects } = get()
        const originalProject = projects.find(p => p.id === projectId)
        
        if (originalProject) {
          const duplicatedProject: BuilderProject = {
            ...originalProject,
            id: generateId(),
            name: newName,
            createdAt: new Date(),
            updatedAt: new Date(),
            status: 'draft'
          }
          
          set((state) => ({
            projects: [...state.projects, duplicatedProject]
          }))
          
          return duplicatedProject
        }
        
        throw new Error('Project not found')
      },
      
      // Building functionality
      startBuild: async (projectId: string, instructions: string) => {
        const steps = [
          'Parsing instructions...',
          'Generating HTML structure...',
          'Creating CSS styles...',
          'Adding JavaScript functionality...',
          'Optimizing code...',
          'Finalizing build...'
        ]
        
        set({
          isBuilding: true,
          buildProgress: 0,
          buildSteps: steps,
          currentBuildStep: steps[0]
        })
        
        // Simulate building process
        for (let i = 0; i < steps.length; i++) {
          await new Promise(resolve => setTimeout(resolve, 1000))
          set({
            buildProgress: ((i + 1) / steps.length) * 100,
            currentBuildStep: steps[i]
          })
        }
        
        // Generate mock code based on instructions
        const generatedCode = {
          html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Generated Website</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>Your AI-Generated Website</h1>
        <p>Built based on: ${instructions}</p>
        <button onclick="handleClick()">Click me!</button>
    </div>
    <script src="script.js"></script>
</body>
</html>`,
          css: `.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

h1 {
    color: #333;
    text-align: center;
}

button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: transform 0.2s;
}

button:hover {
    transform: translateY(-2px);
}`,
          javascript: `function handleClick() {
    alert('Hello from your AI-generated website!');
    console.log('Button clicked:', new Date());
}

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('Website loaded successfully');
});`
        }
        
        get().completeBuild(generatedCode)
      },
      
      updateBuildProgress: (progress: number, step: string) => {
        set({
          buildProgress: progress,
          currentBuildStep: step
        })
      },
      
      completeBuild: (code: BuilderProject['code']) => {
        const { currentProject } = get()
        if (currentProject) {
          get().updateProject(currentProject.id, {
            code,
            status: 'completed',
            preview: {
              url: '', // Will be generated
              lastGenerated: new Date()
            }
          })
        }
        
        set({
          isBuilding: false,
          buildProgress: 100,
          currentBuildStep: 'Build completed!'
        })
        
        // Generate preview
        setTimeout(() => {
          get().generatePreview()
        }, 500)
      },
      
      cancelBuild: () => {
        set({
          isBuilding: false,
          buildProgress: 0,
          currentBuildStep: '',
          buildSteps: []
        })
      },
      
      // Code management
      updateCode: (type: 'html' | 'css' | 'javascript', content: string) => {
        const { currentProject } = get()
        if (currentProject) {
          const updatedCode = {
            ...currentProject.code,
            [type]: content
          }
          
          get().updateProject(currentProject.id, {
            code: updatedCode,
            status: 'draft'
          })
        }
      },
      
      exportProject: (projectId: string) => {
        const { projects } = get()
        const project = projects.find(p => p.id === projectId)
        return project ? JSON.stringify(project, null, 2) : ''
      },
      
      importProject: (projectData: string) => {
        try {
          const project: BuilderProject = JSON.parse(projectData)
          project.id = generateId() // Generate new ID to avoid conflicts
          
          set((state) => ({
            projects: [...state.projects, project]
          }))
        } catch (error) {
          console.error('Failed to import project:', error)
          throw new Error('Invalid project data')
        }
      },
      
      // Preview management
      setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => {
        set({ previewMode: mode })
      },
      
      generatePreview: async () => {
        const { currentProject } = get()
        if (!currentProject) return ''
        
        // Create blob URL for preview
        const htmlContent = currentProject.code.html.replace(
          '<link rel="stylesheet" href="styles.css">',
          `<style>${currentProject.code.css}</style>`
        ).replace(
          '<script src="script.js"></script>',
          `<script>${currentProject.code.javascript}</script>`
        )
        
        const blob = new Blob([htmlContent], { type: 'text/html' })
        const url = URL.createObjectURL(blob)
        
        set({ previewUrl: url })
        
        get().updateProject(currentProject.id, {
          preview: {
            url,
            lastGenerated: new Date()
          }
        })
        
        return url
      },
      
      updatePreviewUrl: (url: string) => {
        set({ previewUrl: url })
      }
    }),
    {
      name: 'builder-store',
      version: 1,
      skipHydration: true,
    }
  )
)
