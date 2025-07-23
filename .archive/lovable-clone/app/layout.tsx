import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { cn } from '@/lib/utils'
import { Providers } from '@/components/providers'
import { Analytics } from '@/components/analytics'
import '@/styles/globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-geist-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Lovable Clone - AI-Powered Website Builder',
    template: '%s | Lovable Clone',
  },
  description: 'Build software products using only a chat interface. Enterprise-grade AI-powered website builder inspired by Lovable.dev',
  keywords: [
    'AI website builder',
    'no-code',
    'website creation',
    'AI development',
    'enterprise software',
    'chat interface',
    'react',
    'nextjs',
    'surveys',
    'analytics',
  ],
  authors: [{ name: 'Tiation' }],
  creator: 'Tiation',
  publisher: 'Tiation',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'Lovable Clone - AI-Powered Website Builder',
    description: 'Build software products using only a chat interface',
    siteName: 'Lovable Clone',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Lovable Clone - AI-Powered Website Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lovable Clone - AI-Powered Website Builder',
    description: 'Build software products using only a chat interface',
    images: ['/twitter-image.png'],
    creator: '@tiation',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
}


interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          jetbrainsMono.variable
        )}
        suppressHydrationWarning
      >
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <div className="flex-1">{children}</div>
          </div>
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
