import chalk from 'chalk'
import { intro, outro, select, text, multiselect, confirm, spinner, note } from '@clack/prompts'
import { execa } from 'execa'
import { existsSync } from 'fs'
import { mkdir, writeFile } from 'fs/promises'
import { join, resolve } from 'path'
import { degit } from 'degit'

interface CreateOptions {
  directory?: string
  add?: string[]
  packageManager: 'npm' | 'yarn' | 'pnpm'
  git: boolean
  install: boolean
}

interface Template {
  id: string
  name: string
  description: string
  category: 'web' | 'mobile' | 'backend' | 'fullstack'
  features: string[]
  repository: string
  complexity: 'beginner' | 'intermediate' | 'advanced'
  estimatedSetupTime: string
  tags: string[]
}

interface InnovationModule {
  id: string
  name: string
  description: string
  category: string
  dependencies: string[]
  configurable: boolean
  estimatedSetupTime: string
}

const TEMPLATES: Template[] = [
  {
    id: 'react-enterprise',
    name: 'React Enterprise',
    description: 'React 18 + TypeScript + Tailwind + Framer Motion + Glass UI',
    category: 'web',
    features: ['TypeScript', 'Tailwind CSS', 'Framer Motion', 'Glass Morphism', 'ESLint', 'Prettier', 'Vite'],
    repository: 'tiation/tiation-react-enterprise-template',
    complexity: 'intermediate',
    estimatedSetupTime: '3-5 minutes',
    tags: ['react', 'typescript', 'modern', 'animations']
  },
  {
    id: 'svelte-enterprise',
    name: 'Svelte Enterprise',
    description: 'SvelteKit + TypeScript + Tailwind + Glass UI components',
    category: 'web',
    features: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'Glass Morphism', 'Vite', 'Playwright'],
    repository: 'tiation/tiation-svelte-enterprise-template',
    complexity: 'intermediate',
    estimatedSetupTime: '2-4 minutes',
    tags: ['svelte', 'sveltekit', 'fast', 'minimal']
  },
  {
    id: 'vue-enterprise',
    name: 'Vue Enterprise',
    description: 'Vue 3 + Composition API + Pinia + Enterprise UI components',
    category: 'web',
    features: ['Vue 3', 'Composition API', 'Pinia', 'TypeScript', 'Vite', 'Vue Router'],
    repository: 'tiation/tiation-vue-enterprise-template',
    complexity: 'intermediate',
    estimatedSetupTime: '3-5 minutes',
    tags: ['vue', 'composition-api', 'pinia', 'enterprise']
  },
  {
    id: 'nextjs-enterprise',
    name: 'Next.js Enterprise',
    description: 'Next.js 14 + App Router + tRPC + Prisma + TypeScript',
    category: 'fullstack',
    features: ['Next.js 14', 'App Router', 'tRPC', 'Prisma', 'TypeScript', 'Tailwind'],
    repository: 'tiation/tiation-nextjs-enterprise-template',
    complexity: 'advanced',
    estimatedSetupTime: '5-10 minutes',
    tags: ['nextjs', 'fullstack', 'trpc', 'database']
  },
  {
    id: 'react-native-enterprise',
    name: 'React Native Enterprise',
    description: 'React Native + Expo + TypeScript + Zustand + Navigation',
    category: 'mobile',
    features: ['React Native', 'Expo', 'TypeScript', 'Zustand', 'React Navigation', 'NativeWind'],
    repository: 'tiation/tiation-react-native-enterprise-template',
    complexity: 'intermediate',
    estimatedSetupTime: '5-8 minutes',
    tags: ['react-native', 'expo', 'mobile', 'cross-platform']
  },
  {
    id: 'node-enterprise',
    name: 'Node.js Enterprise',
    description: 'Fastify + TypeScript + Prisma + OpenAPI + Docker',
    category: 'backend',
    features: ['Fastify', 'TypeScript', 'Prisma', 'OpenAPI', 'Docker', 'JWT Auth'],
    repository: 'tiation/tiation-node-enterprise-template',
    complexity: 'intermediate',
    estimatedSetupTime: '4-6 minutes',
    tags: ['nodejs', 'api', 'backend', 'fast']
  }
]

const INNOVATION_MODULES: InnovationModule[] = [
  {
    id: 'ai-integration',
    name: 'AI Integration',
    description: 'LangChain + OpenAI + Vector Database integration',
    category: 'ai',
    dependencies: ['langchain', 'openai', 'pinecone-client'],
    configurable: true,
    estimatedSetupTime: '5-10 minutes'
  },
  {
    id: 'realtime-features',
    name: 'Real-time Features',
    description: 'WebSocket + WebRTC + Collaborative editing',
    category: 'realtime',
    dependencies: ['socket.io', 'yjs', 'y-websocket'],
    configurable: true,
    estimatedSetupTime: '10-15 minutes'
  },
  {
    id: '3d-visualization',
    name: '3D Visualization',
    description: 'Three.js + React Three Fiber + WebGL components',
    category: 'ui',
    dependencies: ['three', '@react-three/fiber', '@react-three/drei'],
    configurable: false,
    estimatedSetupTime: '8-12 minutes'
  },
  {
    id: 'auth-enterprise',
    name: 'Enterprise Authentication',
    description: 'OAuth2 + RBAC + Audit logging',
    category: 'security',
    dependencies: ['@auth/core', 'jose', 'zod'],
    configurable: true,
    estimatedSetupTime: '15-20 minutes'
  }
]

export async function createProject(
  templateId?: string,
  projectName?: string,
  options: CreateOptions = {
    packageManager: 'npm',
    git: true,
    install: true
  }
): Promise<void> {
  console.clear()
  
  intro(chalk.bgBlue(chalk.bold(' 🏛️ Tiation Enterprise Framework ')))
  
  // Get template selection
  let selectedTemplate: Template
  
  if (templateId) {
    const template = TEMPLATES.find(t => t.id === templateId)
    if (!template) {
      outro(chalk.red(`Template '${templateId}' not found. Use 'tiation list' to see available templates.`))
      return
    }
    selectedTemplate = template
  } else {
    const templateChoice = await select({
      message: 'Select a template category:',
      options: [
        { value: 'web', label: '🌐 Web Frameworks', hint: 'React, Svelte, Vue, Next.js' },
        { value: 'mobile', label: '📱 Mobile Frameworks', hint: 'React Native, Flutter, iOS, Android' },
        { value: 'backend', label: '⚙️ Backend Frameworks', hint: 'Node.js, Python, Go, Rust' },
        { value: 'fullstack', label: '🚀 Full-Stack Solutions', hint: 'Complete application stacks' },
        { value: 'all', label: '📋 Show All Templates', hint: 'Browse all available templates' }
      ]
    })

    if (typeof templateChoice === 'symbol') return

    const filteredTemplates = templateChoice === 'all' 
      ? TEMPLATES 
      : TEMPLATES.filter(t => t.category === templateChoice)

    const selectedTemplateId = await select({
      message: 'Choose your template:',
      options: filteredTemplates.map(template => ({
        value: template.id,
        label: `${getCategoryIcon(template.category)} ${template.name}`,
        hint: `${template.description} (${template.estimatedSetupTime})`
      }))
    })

    if (typeof selectedTemplateId === 'symbol') return

    selectedTemplate = TEMPLATES.find(t => t.id === selectedTemplateId)!
  }

  // Get project name
  let finalProjectName: string
  
  if (projectName) {
    finalProjectName = projectName
  } else {
    const nameInput = await text({
      message: 'Project name:',
      placeholder: 'my-awesome-app',
      validate: (value) => {
        if (!value) return 'Project name is required'
        if (!/^[a-zA-Z0-9-_]+$/.test(value)) return 'Project name can only contain letters, numbers, hyphens, and underscores'
        return undefined
      }
    })

    if (typeof nameInput === 'symbol') return
    finalProjectName = nameInput
  }

  // Get target directory
  const targetDir = options.directory || resolve(process.cwd(), finalProjectName)
  
  if (existsSync(targetDir)) {
    const overwrite = await confirm({
      message: `Directory '${targetDir}' already exists. Overwrite?`
    })
    
    if (typeof overwrite === 'symbol') return
    if (!overwrite) {
      outro(chalk.yellow('Project creation cancelled'))
      return
    }
  }

  // Show template details
  note(
    [
      `${chalk.bold('Template:')} ${selectedTemplate.name}`,
      `${chalk.bold('Description:')} ${selectedTemplate.description}`,
      `${chalk.bold('Features:')} ${selectedTemplate.features.join(', ')}`,
      `${chalk.bold('Complexity:')} ${selectedTemplate.complexity}`,
      `${chalk.bold('Setup time:')} ${selectedTemplate.estimatedSetupTime}`
    ].join('\n'),
    'Template Details'
  )

  // Innovation modules selection
  let selectedModules: string[] = options.add || []
  
  if (selectedModules.length === 0) {
    const addModules = await confirm({
      message: 'Add innovation modules?',
      initialValue: false
    })

    if (addModules && typeof addModules !== 'symbol') {
      const moduleChoices = await multiselect({
        message: 'Select innovation modules to add:',
        options: INNOVATION_MODULES.map(module => ({
          value: module.id,
          label: `${getModuleIcon(module.category)} ${module.name}`,
          hint: `${module.description} (${module.estimatedSetupTime})`
        })),
        required: false
      })

      if (typeof moduleChoices !== 'symbol') {
        selectedModules = moduleChoices
      }
    }
  }

  // Package manager selection
  let packageManager = options.packageManager
  
  if (!packageManager) {
    const pmChoice = await select({
      message: 'Package manager:',
      options: [
        { value: 'npm', label: '📦 npm' },
        { value: 'yarn', label: '🧶 Yarn' },
        { value: 'pnpm', label: '⚡ pnpm' }
      ]
    })

    if (typeof pmChoice === 'symbol') return
    packageManager = pmChoice as 'npm' | 'yarn' | 'pnpm'
  }

  // Create project
  const s = spinner()
  
  try {
    s.start('Creating project structure...')
    
    // Create directory
    await mkdir(targetDir, { recursive: true })
    
    // Clone template
    const emitter = degit(`github:${selectedTemplate.repository}`, {
      cache: false,
      force: true,
      verbose: false
    })
    
    await emitter.clone(targetDir)
    
    s.message('Setting up project configuration...')
    
    // Update package.json with project name
    const packageJsonPath = join(targetDir, 'package.json')
    if (existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(await readFile(packageJsonPath, 'utf-8'))
      packageJson.name = finalProjectName
      await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))
    }

    // Add innovation modules
    if (selectedModules.length > 0) {
      s.message('Adding innovation modules...')
      for (const moduleId of selectedModules) {
        await addInnovationModule(targetDir, moduleId, selectedTemplate)
      }
    }

    // Initialize git repository
    if (options.git) {
      s.message('Initializing git repository...')
      try {
        await execa('git', ['init'], { cwd: targetDir })
        await execa('git', ['add', '.'], { cwd: targetDir })
        await execa('git', ['commit', '-m', 'Initial commit from Tiation Enterprise Framework'], { cwd: targetDir })
      } catch (error) {
        console.warn(chalk.yellow('Warning: Could not initialize git repository'))
      }
    }

    // Install dependencies
    if (options.install) {
      s.message(`Installing dependencies with ${packageManager}...`)
      try {
        await execa(packageManager, ['install'], { cwd: targetDir })
      } catch (error) {
        console.warn(chalk.yellow(`Warning: Could not install dependencies with ${packageManager}`))
      }
    }

    s.stop('Project created successfully!')

  } catch (error) {
    s.stop('Failed to create project')
    console.error(chalk.red('Error:'), error.message)
    return
  }

  // Success message
  outro(
    [
      chalk.green('🎉 Project created successfully!'),
      '',
      chalk.bold('Next steps:'),
      `  cd ${finalProjectName}`,
      options.install ? '' : `  ${packageManager} install`,
      `  ${packageManager} run dev`,
      '',
      chalk.gray('For more information, visit: https://docs.tiation.dev')
    ].filter(Boolean).join('\n')
  )
}

function getCategoryIcon(category: string): string {
  const icons = {
    web: '🌐',
    mobile: '📱',
    backend: '⚙️',
    fullstack: '🚀'
  }
  return icons[category] || '📄'
}

function getModuleIcon(category: string): string {
  const icons = {
    ai: '🤖',
    realtime: '⚡',
    ui: '🎨',
    security: '🔒',
    data: '💾',
    cloud: '☁️'
  }
  return icons[category] || '📦'
}

async function addInnovationModule(
  projectDir: string,
  moduleId: string,
  template: Template
): Promise<void> {
  const module = INNOVATION_MODULES.find(m => m.id === moduleId)
  if (!module) return

  // This would implement the actual module installation logic
  // For now, we'll create a placeholder configuration file
  const moduleConfigPath = join(projectDir, '.tiation', 'modules', `${moduleId}.json`)
  await mkdir(join(projectDir, '.tiation', 'modules'), { recursive: true })
  
  const config = {
    id: module.id,
    name: module.name,
    version: '1.0.0',
    installedAt: new Date().toISOString(),
    template: template.id,
    dependencies: module.dependencies
  }
  
  await writeFile(moduleConfigPath, JSON.stringify(config, null, 2))
}

async function readFile(path: string, encoding: BufferEncoding): Promise<string> {
  const fs = await import('fs/promises')
  return fs.readFile(path, encoding)
}
