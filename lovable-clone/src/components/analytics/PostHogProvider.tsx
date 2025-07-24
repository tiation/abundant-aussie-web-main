import { useEffect } from 'react'
import posthog from 'posthog-js'

export const PostHogProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  useEffect(() => {
    // Only init PostHog if API key is provided
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      return
    }
    
    // Init PostHog
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      loaded: (posthog) => {
        if (process.env.NODE_ENV === 'development') posthog.debug() // Debug mode
      },
      // Enable feature flags
      feature_flags: { autoReload: true },
      session_recording: {
        // opt out of session recording
        onRecordingStart: () => false,
      },
      // Set your cross-domain config
      cross_subdomain_cookie: false,
    })
    // Cleanup on unmount
    return () => {
      // PostHog doesn't have a shutdown method, but we can reset if needed
      if (typeof window !== 'undefined') {
        posthog.reset()
      }
    }
  }, [])

  return children
}

