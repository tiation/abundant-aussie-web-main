'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import posthog from 'posthog-js'

function PostHogPageView() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (pathname && typeof window !== 'undefined') {
      let url = pathname
      if (searchParams && searchParams.toString()) {
        url = `${pathname}?${searchParams.toString()}`
      }
      
      posthog.capture('$pageview', {
        $current_url: url,
      })
    }
  }, [pathname, searchParams])

  return null
}

export function Analytics() {
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com',
        loaded: (posthog) => {
          if (process.env.NODE_ENV === 'development') {
            posthog.debug()
          }
        },
        capture_pageview: false, // We'll handle this manually
        capture_pageleave: true,
        autocapture: {
          dom_event_allowlist: ['click', 'change', 'submit'],
          css_selector_allowlist: [
            '[data-track]',
            '.btn',
            'button',
            'a',
            'input[type="submit"]',
            'input[type="button"]',
          ],
        },
        session_recording: {
          recordCrossOriginIframes: true,
        },
        persistence: 'localStorage+cookie',
        cookie_expiration: 365, // 1 year
      })
    }
  }, [])

  return <PostHogPageView />
}
