'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { MessageSquare, Zap, Shield, Globe, Code2, Users, Sparkles, BarChart3 } from 'lucide-react'

const features = [
  {
    icon: MessageSquare,
    title: 'Natural Language Interface',
    description: 'Simply describe what you want to build using natural language. Our AI understands context and intent.',
    color: 'text-lovable-blue'
  },
  {
    icon: Zap,
    title: 'Lightning Fast Development',
    description: 'From idea to deployed application in minutes, not months. Accelerate your development cycle.',
    color: 'text-lovable-orange'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'Built with security first. SOC 2 compliant with enterprise-grade data protection.',
    color: 'text-lovable-green'
  },
  {
    icon: Globe,
    title: 'Global Deployment',
    description: 'Deploy globally with our edge network. Automatic scaling and performance optimization.',
    color: 'text-lovable-purple'
  },
  {
    icon: Code2,
    title: 'Modern Tech Stack',
    description: 'Built on modern technologies including React, Next.js, and TypeScript for reliability.',
    color: 'text-lovable-blue'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together seamlessly with real-time collaboration and version control.',
    color: 'text-lovable-green'
  },
  {
    icon: Sparkles,
    title: 'AI-Powered Features',
    description: 'Advanced AI capabilities including smart suggestions, code generation, and optimization.',
    color: 'text-lovable-purple'
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Built-in analytics and user insights to help you make data-driven decisions.',
    color: 'text-lovable-orange'
  },
]

export function FeaturesSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section id="features" className="py-24 sm:py-32" ref={ref}>
      <div className="container px-4">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <div className="inline-flex items-center rounded-full bg-muted/50 px-4 py-2 text-sm backdrop-blur-sm border">
              <Sparkles className="mr-2 h-4 w-4 text-lovable-purple" />
              <span className="font-medium">Powerful Features</span>
            </div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6"
          >
            Everything you need to build
            <span className="text-gradient-lovable"> amazing applications</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Our platform provides all the tools and services you need to create, deploy, and scale your applications with confidence.
          </motion.p>
        </div>

        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                  className="group relative rounded-lg border bg-card p-6 hover:bg-card/80 transition-all duration-300 hover:shadow-lg hover:shadow-lovable/10"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted/50 group-hover:bg-muted/70 transition-colors">
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-lovable-purple/5 via-lovable-blue/5 to-lovable-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
