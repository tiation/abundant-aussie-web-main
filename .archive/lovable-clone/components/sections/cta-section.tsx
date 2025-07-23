'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Button } from '@/components/ui/button'
import { ArrowRight, Sparkles } from 'lucide-react'

export function CTASection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-24 sm:py-32" ref={ref}>
      <div className="container px-4">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-lovable-purple via-lovable-blue to-lovable-green p-8 sm:p-16">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute top-10 right-10 h-32 w-32 rounded-full bg-white/10 blur-xl" />
          <div className="absolute bottom-10 left-10 h-24 w-24 rounded-full bg-white/10 blur-xl" />
          
          <div className="relative mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <div className="inline-flex items-center rounded-full bg-white/20 px-4 py-2 text-sm backdrop-blur-sm border border-white/30">
                <Sparkles className="mr-2 h-4 w-4 text-white" />
                <span className="font-medium text-white">Ready to get started?</span>
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl mb-6"
            >
              Turn your ideas into reality with AI
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-white/90 max-w-2xl mx-auto mb-10"
            >
              Join thousands of developers who are already building amazing applications with our AI-powered platform. 
              Start your free trial today and see the difference.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            >
              <Button 
                size="lg" 
                className="bg-white text-lovable-purple hover:bg-white/90 font-semibold px-8 py-3 h-12"
                asChild
              >
                <Link href="/get-started">
                  Start building for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              
              <Button 
                variant="outline" 
                size="lg" 
                className="border-2 border-white/30 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm px-8 py-3 h-12"
                asChild
              >
                <Link href="/contact">
                  Talk to sales
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 text-sm text-white/70"
            >
              No credit card required • Free 14-day trial • Cancel anytime
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
