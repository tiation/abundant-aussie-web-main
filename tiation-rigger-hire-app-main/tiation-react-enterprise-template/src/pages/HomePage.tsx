import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  TiationButton, 
  TiationCard, 
  TiationInput, 
  TiationModal 
} from '@/components/ui'
import { Search, User, Mail, Star, Code, Zap } from 'lucide-react'

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-12"
    >
      {/* Hero Section */}
      <motion.section variants={itemVariants} className="text-center py-12">
        <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-tiation-primary to-tiation-accent bg-clip-text text-transparent">
          Tiation React Enterprise Template
        </h1>
        <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
          A modern, production-ready React template with TypeScript, Tailwind CSS, 
          and enterprise-grade architecture. Built with performance, scalability, and developer experience in mind.
        </p>
        <div className="flex justify-center gap-4">
          <TiationButton variant="primary" size="lg">
            Get Started
          </TiationButton>
          <TiationButton variant="glass" size="lg">
            View Documentation
          </TiationButton>
        </div>
      </motion.section>

      {/* Features Overview */}
      <motion.section variants={itemVariants}>
        <h2 className="text-3xl font-bold text-center mb-8">Enterprise Features</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <TiationCard variant="glass" hover className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-tiation-primary/20">
                <Code className="text-tiation-primary" size={24} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Type Safety</h3>
            <p className="text-gray-400">
              Built with TypeScript for enhanced developer experience and fewer runtime errors.
            </p>
          </TiationCard>

          <TiationCard variant="glass" hover className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-tiation-accent/20">
                <Zap className="text-tiation-accent" size={24} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Performance</h3>
            <p className="text-gray-400">
              Optimized build process with code splitting and lazy loading for fast load times.
            </p>
          </TiationCard>

          <TiationCard variant="glass" hover className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-purple-500/20">
                <Star className="text-purple-400" size={24} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-3">Modern Design</h3>
            <p className="text-gray-400">
              Glass morphism UI with smooth animations and responsive design principles.
            </p>
          </TiationCard>
        </div>
      </motion.section>

      {/* UI Components Showcase */}
      <motion.section variants={itemVariants} className="space-y-8">
        <h2 className="text-3xl font-bold text-center">UI Components Showcase</h2>
        
        {/* Button Examples */}
        <TiationCard variant="solid" padding="lg">
          <h3 className="text-xl font-semibold mb-6">Button Variants</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-300">Standard Variants</h4>
              <div className="flex flex-wrap gap-3">
                <TiationButton variant="primary">Primary</TiationButton>
                <TiationButton variant="secondary">Secondary</TiationButton>
                <TiationButton variant="accent">Accent</TiationButton>
                <TiationButton variant="glass">Glass</TiationButton>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-300">Interactive</h4>
              <div className="flex flex-wrap gap-3">
                <TiationButton 
                  variant="primary" 
                  onClick={() => setIsModalOpen(true)}
                >
                  Open Modal
                </TiationButton>
                <TiationButton variant="secondary" disabled>
                  Disabled
                </TiationButton>
                <TiationButton variant="accent" loading>
                  Loading
                </TiationButton>
              </div>
            </div>
          </div>
        </TiationCard>

        {/* Input Examples */}
        <TiationCard variant="gradient" padding="lg">
          <h3 className="text-xl font-semibold mb-6">Form Inputs</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-300">Input Variants</h4>
              <TiationInput
                label="Default Input"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleInputChange}
                icon={<User size={20} />}
                variant="default"
              />
              
              <TiationInput
                label="Glass Input"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                icon={<Mail size={20} />}
                variant="glass"
                success={formData.email.includes('@')}
                helperText="We'll never share your email"
              />
              
              <TiationInput
                label="Neon Input"
                placeholder="Search something..."
                icon={<Search size={20} />}
                variant="neon"
                helperText="This input has a neon glow effect"
              />
            </div>
            
            <div className="space-y-6">
              <h4 className="text-lg font-medium text-gray-300">Input States</h4>
              <TiationInput
                label="Password Input"
                type="password"
                placeholder="Enter password"
                showPasswordToggle
                variant="default"
                helperText="Password must be at least 8 characters"
              />
              
              <TiationInput
                label="Error State"
                placeholder="This field has an error"
                error="This field is required"
                variant="default"
              />
              
              <TiationInput
                label="Success State"
                placeholder="This field is valid"
                success
                helperText="Great! This looks good"
                variant="default"
              />
            </div>
          </div>
        </TiationCard>

        {/* Card Examples */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-center">Card Variants</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <TiationCard variant="glass" hover padding="lg">
              <h4 className="text-lg font-semibold mb-2">Glass Card</h4>
              <p className="text-gray-300 text-sm">
                Beautiful glass morphism effect with backdrop blur.
              </p>
            </TiationCard>
            
            <TiationCard variant="neon" hover padding="lg">
              <h4 className="text-lg font-semibold mb-2">Neon Card</h4>
              <p className="text-gray-300 text-sm">
                Eye-catching neon border effects for highlights.
              </p>
            </TiationCard>
            
            <TiationCard variant="solid" hover padding="lg">
              <h4 className="text-lg font-semibold mb-2">Solid Card</h4>
              <p className="text-gray-300 text-sm">
                Clean and professional for content display.
              </p>
            </TiationCard>
            
            <TiationCard variant="gradient" hover padding="lg">
              <h4 className="text-lg font-semibold mb-2">Gradient Card</h4>
              <p className="text-gray-300 text-sm">
                Subtle gradient background for visual depth.
              </p>
            </TiationCard>
          </div>
        </div>
      </motion.section>

      {/* Technology Stack */}
      <motion.section variants={itemVariants}>
        <TiationCard variant="glass" padding="xl" className="text-center">
          <h2 className="text-3xl font-bold mb-6">Built with Modern Technology</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div>
              <h4 className="font-semibold mb-2 text-tiation-primary">Frontend</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• React 18</li>
                <li>• TypeScript</li>
                <li>• React Router</li>
                <li>• TanStack Query</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-tiation-accent">Styling</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Tailwind CSS</li>
                <li>• Framer Motion</li>
                <li>• Custom Design System</li>
                <li>• Responsive Design</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-purple-400">Development</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Vite Build Tool</li>
                <li>• ESLint</li>
                <li>• Prettier</li>
                <li>• Hot Module Reload</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-green-400">Quality</h4>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• TypeScript Types</li>
                <li>• Component Testing</li>
                <li>• Code Splitting</li>
                <li>• Performance Optimized</li>
              </ul>
            </div>
          </div>
        </TiationCard>
      </motion.section>

      {/* Modal Example */}
      <TiationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Welcome to Tiation"
        subtitle="This is an example modal with smooth animations and glass morphism styling"
        variant="glass"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-300">
            This modal demonstrates the TiationModal component with:
          </p>
          <ul className="text-gray-400 space-y-1 ml-4">
            <li>• Smooth enter/exit animations</li>
            <li>• Backdrop blur effects</li>
            <li>• Keyboard navigation (ESC to close)</li>
            <li>• Click outside to close</li>
            <li>• Multiple size and variant options</li>
          </ul>
          
          <div className="flex gap-3 justify-end pt-4">
            <TiationButton 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </TiationButton>
            <TiationButton 
              variant="primary"
              onClick={() => setIsModalOpen(false)}
            >
              Awesome!
            </TiationButton>
          </div>
        </div>
      </TiationModal>
    </motion.div>
  )
}

export default HomePage
