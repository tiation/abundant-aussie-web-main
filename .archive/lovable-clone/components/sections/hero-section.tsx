'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight, Play, Sparkles, Code2, Zap, Users } from 'lucide-react'

const stats = [
  { value: '10M+', label: 'Apps Created', icon: Code2 },
  { value: '50K+', label: 'Developers', icon: Users },
  { value: '99.9%', label: 'Uptime', icon: Zap },
]

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background Elements */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 h-20 w-20 rounded-full bg-lovable-purple/10 blur-xl animate-pulse-slow" />
      <div className="absolute top-40 right-20 h-32 w-32 rounded-full bg-lovable-blue/10 blur-xl animate-pulse-slow delay-700" />
      <div className="absolute bottom-20 left-20 h-24 w-24 rounded-full bg-lovable-green/10 blur-xl animate-pulse-slow delay-1000" />

      <div className="container relative px-4 py-24 sm:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="inline-flex items-center rounded-full bg-muted/50 px-4 py-2 text-sm backdrop-blur-sm border">
              <Sparkles className="mr-2 h-4 w-4 text-lovable-purple" />
              <span className="font-medium">AI-Powered Development Platform</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-6 text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl"
          >
            Build software products,{' '}
            <span className="text-gradient-lovable">using only a chat interface</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-10 text-lg text-muted-foreground sm:text-xl lg:text-2xl max-w-3xl mx-auto"
          >
            Transform your ideas into fully functional applications through natural conversation. 
            No coding required, enterprise-grade results guaranteed.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button 
              size="lg" 
              className="bg-lovable-gradient hover:opacity-90 text-white font-semibold px-8 py-3 h-12"
              asChild
            >
              <Link href="/get-started">
                Get started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-2 hover:bg-muted/50 px-8 py-3 h-12"
              asChild
            >
              <Link href="#demo">
                <Play className="mr-2 h-4 w-4" />
                Watch demo
              </Link>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid grid-cols-1 gap-8 sm:grid-cols-3"
          >
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-center rounded-lg bg-card/50 backdrop-blur-sm border p-6 transition-colors hover:bg-card/70"
                >
                  <Icon className="mb-2 h-8 w-8 text-lovable-purple" />
                  <div className="text-2xl font-bold sm:text-3xl">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              )
            })}
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.6, delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center space-y-2">
          <div className="text-xs text-muted-foreground">Scroll to explore</div>
          <div className="h-6 w-4 rounded-full border-2 border-muted-foreground/30">
            <div className="mx-auto mt-1 h-2 w-1 animate-bounce rounded-full bg-muted-foreground/50" />
          </div>
        </div>
      </motion.div>
    </section>
  )
}
