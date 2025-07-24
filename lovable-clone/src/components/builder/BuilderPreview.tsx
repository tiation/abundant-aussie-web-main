'use client'

import { useEffect, useState } from 'react'
import { useBuilderStore } from '@/stores/builderStore'
import { Button } from '@/components/ui/Button'
import { 
  ComputerDesktopIcon, 
  DeviceTabletIcon, 
  DevicePhoneMobileIcon,
  ArrowPathIcon,
  CodeBracketIcon,
  EyeIcon
} from '@heroicons/react/24/outline'
import { cn } from '@/lib/utils'

export function BuilderPreview() {
  const { 
    currentProject, 
    previewMode, 
    previewUrl, 
    isBuilding, 
    buildProgress, 
    currentBuildStep,
    setPreviewMode, 
    generatePreview 
  } = useBuilderStore()
  
  const [isGenerating, setIsGenerating] = useState(false)
  
  useEffect(() => {
    if (currentProject && !previewUrl) {
      handleGeneratePreview()
    }
  }, [currentProject])
  
  const handleGeneratePreview = async () => {
    setIsGenerating(true)
    try {
      await generatePreview()
    } finally {
      setIsGenerating(false)
    }
  }
  
  const previewSizes = {
    desktop: 'w-full h-full',
    tablet: 'w-[768px] h-[1024px] mx-auto',
    mobile: 'w-[375px] h-[667px] mx-auto'
  }
  
  return (
    <div className="flex flex-col h-full bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border">
        <div className="flex items-center space-x-2">
          <EyeIcon className="w-5 h-5" />
          <h2 className="font-semibold">Preview</h2>
          {currentProject && (
            <span className="text-sm text-muted-foreground">
              {currentProject.name}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Device toggle */}
          <div className="flex rounded-lg border border p-1">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
              className="px-2 py-1 h-8"
            >
              <ComputerDesktopIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
              className="px-2 py-1 h-8"
            >
              <DeviceTabletIcon className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
              className="px-2 py-1 h-8"
            >
              <DevicePhoneMobileIcon className="w-4 h-4" />
            </Button>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleGeneratePreview}
            disabled={isGenerating || isBuilding}
            loading={isGenerating}
          >
            <ArrowPathIcon className="w-4 h-4 mr-1" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {isBuilding ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                <CodeBracketIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Building Your Website</h3>
              <p className="text-muted-foreground text-sm mb-4">{currentBuildStep}</p>
              
              {/* Progress bar */}
              <div className="w-full bg-secondary rounded-full h-2 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${buildProgress}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground">{Math.round(buildProgress)}% complete</p>
            </div>
          </div>
        ) : !currentProject ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <EyeIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No Project Selected</h3>
              <p className="text-muted-foreground text-sm">
                Create a new project or select an existing one to see the preview.
              </p>
            </div>
          </div>
        ) : !previewUrl ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center max-w-md">
              <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ArrowPathIcon className="w-8 h-8 text-muted-foreground animate-spin" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Generating Preview</h3>
              <p className="text-muted-foreground text-sm">
                Please wait while we prepare your website preview...
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className={cn(
              'border rounded-lg overflow-hidden shadow-lg transition-all duration-300',
              previewSizes[previewMode],
              previewMode !== 'desktop' && 'max-h-full'
            )}>
              <iframe
                src={previewUrl}
                className="w-full h-full border-none"
                title="Website Preview"
                sandbox="allow-scripts allow-same-origin"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Footer */}
      {currentProject && (
        <div className="border-t border p-4">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Framework: {currentProject.metadata.framework}</span>
              <span>Theme: {currentProject.metadata.theme}</span>
              <span>Status: {currentProject.status}</span>
            </div>
            {currentProject.preview?.lastGenerated && (
              <span>
                Last updated: {new Date(currentProject.preview.lastGenerated).toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
