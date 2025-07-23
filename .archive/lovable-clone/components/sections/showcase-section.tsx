'use client'

import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { ExternalLink, Github, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

const showcaseItems = [
  {
    title: 'E-commerce Platform',
    description: 'Full-featured online store with payment processing, inventory management, and customer analytics.',
    image: '/api/placeholder/600/400',
    tags: ['React', 'Next.js', 'Stripe', 'PostgreSQL'],
    stars: 1240,
    demo: '#',
    github: '#'
  },
  {
    title: 'Task Management App',
    description: 'Collaborative project management tool with real-time updates, team chat, and progress tracking.',
    image: '/api/placeholder/600/400',
    tags: ['React', 'WebSockets', 'MongoDB', 'Express'],
    stars: 892,
    demo: '#',
    github: '#'
  },
  {
    title: 'Analytics Dashboard',
    description: 'Beautiful data visualization dashboard with real-time metrics and customizable widgets.',
    image: '/api/placeholder/600/400',
    tags: ['React', 'D3.js', 'Redis', 'Node.js'],
    stars: 567,
    demo: '#',
    github: '#'
  },
]

export function ShowcaseSection() {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  return (
    <section className="py-24 sm:py-32 bg-muted/20" ref={ref}>
      <div className="container px-4">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6"
          >
            Built with <span className="text-gradient-lovable">Lovable</span>
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-lg text-muted-foreground"
          >
            See what others have created using our platform. From simple prototypes to production-ready applications.
          </motion.p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {showcaseItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              className="group relative overflow-hidden rounded-lg border bg-card hover:shadow-lg transition-all duration-300"
            >
              {/* Image placeholder */}
              <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-sm font-medium">{item.stars}</span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  {item.description}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={item.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Demo
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1" asChild>
                    <a href={item.github} target="_blank" rel="noopener noreferrer">
                      <Github className="mr-2 h-4 w-4" />
                      Code
                    </a>
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <Button variant="outline" size="lg">
            View more examples
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
