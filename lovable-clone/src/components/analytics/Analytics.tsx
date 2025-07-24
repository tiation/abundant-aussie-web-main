'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'
import { useAnalytics } from '@/hooks/useAnalytics'

export function Analytics() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { trackPageView, trackEvent } = useAnalytics()

  useEffect(() => {
    // Track page views
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '')
      trackPageView(url)
    }
  }, [pathname, searchParams, trackPageView])

  useEffect(() => {
    // Track user properties on mount
    if (typeof window !== 'undefined') {
      const userAgent = navigator.userAgent
      const language = navigator.language
      const platform = navigator.platform
      const screenResolution = `${screen.width}x${screen.height}`
      
      posthog.people.set({
        $browser: userAgent,
        $browser_language: language,
        $os: platform,
        screen_resolution: screenResolution,
        app_version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
        environment: process.env.NODE_ENV,
      })
    }
  }, [])

  // Track performance metrics
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const measurePerformance = () => {
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
        
        if (perfData) {
          trackEvent('performance_metrics', {
            page_load_time: perfData.loadEventEnd - perfData.fetchStart,
            dom_content_loaded: perfData.domContentLoadedEventEnd - perfData.fetchStart,
            first_byte: perfData.responseStart - perfData.fetchStart,
            dns_lookup: perfData.domainLookupEnd - perfData.domainLookupStart,
          })
        }
      }

      // Measure after the page has loaded
      if (document.readyState === 'complete') {
        measurePerformance()
      } else {
        window.addEventListener('load', measurePerformance)
        return () => window.removeEventListener('load', measurePerformance)
      }
    }
  }, [trackEvent])

  // Track errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      trackEvent('javascript_error', {
        error_message: event.message,
        error_filename: event.filename,
        error_line: event.lineno,
        error_col: event.colno,
        stack_trace: event.error?.stack,
      })
    }

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      trackEvent('unhandled_promise_rejection', {
        reason: event.reason?.toString(),
        stack_trace: event.reason?.stack,
      })
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('error', handleError)
      window.addEventListener('unhandledrejection', handleUnhandledRejection)

      return () => {
        window.removeEventListener('error', handleError)
        window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      }
    }
  }, [trackEvent])

  return null
}
