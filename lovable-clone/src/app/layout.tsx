import './globals.css'
import { Providers } from './providers'
import { Analytics } from '@/components/analytics/Analytics'
import { Toast } from '@/components/ui/Toast'

export const metadata = {
  title: 'BuildAI - Enterprise AI-Powered Website Builder',
  description: 'Professional AI-powered website builder with chat-based interface for rapid development',
  keywords: ['AI', 'website builder', 'enterprise', 'chat interface', 'development'],
  authors: [{ name: 'Tiiation', url: 'https://tiiation.dev' }],
  creator: 'Tiiation',
  publisher: 'Tiiation',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXTAUTH_URL,
    title: 'BuildAI - Enterprise AI-Powered Website Builder',
    description: 'Professional AI-powered website builder with chat-based interface for rapid development',
    siteName: 'BuildAI',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'BuildAI - Enterprise AI-Powered Website Builder',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BuildAI - Enterprise AI-Powered Website Builder',
    description: 'Professional AI-powered website builder with chat-based interface for rapid development',
    creator: '@tiiation',
    images: ['/og-image.jpg'],
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
  viewport: 'width=device-width, initial-scale=1',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Security Headers */}
        <meta httpEquiv="Content-Security-Policy" 
              content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.posthog.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.openai.com https://app.posthog.com;" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
        
        {/* PWA Support */}
        <meta name="application-name" content="BuildAI" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BuildAI" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="font-sans bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen antialiased">
        <Providers>
          <div className="relative flex min-h-screen flex-col">
            <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.1))]" />
            <div className="relative z-10 flex-1">
              {children}
            </div>
          </div>
          <Toast />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
