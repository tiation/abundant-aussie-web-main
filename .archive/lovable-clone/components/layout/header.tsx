'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Monitor,
  Sparkles,
  Code2,
  Users,
  BarChart3,
  Zap
} from 'lucide-react'

const navigation = [
  { name: 'Features', href: '#features', icon: Sparkles },
  { name: 'Community', href: '#community', icon: Users },
  { name: 'Pricing', href: '#pricing', icon: BarChart3 },
  { name: 'Enterprise', href: '#enterprise', icon: Zap },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />
      case 'dark':
        return <Moon className="h-4 w-4" />
      default:
        return <Monitor className="h-4 w-4" />
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lovable-gradient">
            <Code2 className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Lovable</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:items-center md:space-x-6">
          {navigation.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center space-x-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground',
                  'group relative'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.name}</span>
                <div className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all group-hover:w-full" />
              </Link>
            )
          })}
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex md:items-center md:space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 px-0"
            aria-label="Toggle theme"
          >
            {getThemeIcon()}
          </Button>
          
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Log in</Link>
          </Button>
          
          <Button size="sm" className="bg-lovable-gradient hover:opacity-90" asChild>
            <Link href="/get-started">Get started</Link>
          </Button>
        </div>

        {/* Mobile menu button */}
        <div className="flex items-center space-x-2 md:hidden">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleTheme}
            className="h-9 w-9 px-0"
            aria-label="Toggle theme"
          >
            {getThemeIcon()}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 px-0"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t bg-background/95 backdrop-blur md:hidden">
          <div className="container px-4 py-4">
            <div className="grid gap-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center space-x-3 text-sm font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
              <div className="mt-4 flex flex-col space-y-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button size="sm" className="bg-lovable-gradient hover:opacity-90" asChild>
                  <Link href="/get-started" onClick={() => setMobileMenuOpen(false)}>
                    Get started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
