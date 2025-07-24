'use client'

import { useCallback } from 'react'
import posthog from 'posthog-js'

export interface AnalyticsEvent {
  [key: string]: any
}

export function useAnalytics() {
  const trackEvent = useCallback((eventName: string, properties?: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      try {
        posthog.capture(eventName, {
          ...properties,
          timestamp: new Date().toISOString(),
          page_url: window.location.href,
          page_title: document.title,
          referrer: document.referrer,
        })
      } catch (error) {
        console.error('Analytics tracking error:', error)
      }
    }
  }, [])

  const trackPageView = useCallback((url: string) => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      try {
        posthog.capture('$pageview', {
          $current_url: url,
          $host: window.location.host,
          $pathname: window.location.pathname,
          $search: window.location.search,
          title: document.title,
        })
      } catch (error) {
        console.error('Page view tracking error:', error)
      }
    }
  }, [])

  const identifyUser = useCallback((userId: string, properties?: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      try {
        posthog.identify(userId, properties)
      } catch (error) {
        console.error('User identification error:', error)
      }
    }
  }, [])

  const setUserProperties = useCallback((properties: AnalyticsEvent) => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      try {
        posthog.people.set(properties)
      } catch (error) {
        console.error('User properties error:', error)
      }
    }
  }, [])

  const trackChatInteraction = useCallback((type: 'message_sent' | 'message_received' | 'chat_started' | 'chat_ended', properties?: AnalyticsEvent) => {
    trackEvent(`chat_${type}`, {
      ...properties,
      interaction_type: 'chat',
      feature: 'ai_builder',
    })
  }, [trackEvent])

  const trackBuilderAction = useCallback((action: string, properties?: AnalyticsEvent) => {
    trackEvent(`builder_${action}`, {
      ...properties,
      feature: 'website_builder',
      action_type: action,
    })
  }, [trackEvent])

  const trackFeatureUsage = useCallback((feature: string, properties?: AnalyticsEvent) => {
    trackEvent('feature_used', {
      ...properties,
      feature_name: feature,
      usage_timestamp: new Date().toISOString(),
    })
  }, [trackEvent])

  const trackError = useCallback((error: Error, context?: string) => {
    trackEvent('application_error', {
      error_message: error.message,
      error_name: error.name,
      error_stack: error.stack,
      error_context: context,
      timestamp: new Date().toISOString(),
    })
  }, [trackEvent])

  const trackPerformance = useCallback((metric: string, value: number, properties?: AnalyticsEvent) => {
    trackEvent('performance_metric', {
      ...properties,
      metric_name: metric,
      metric_value: value,
      timestamp: new Date().toISOString(),
    })
  }, [trackEvent])

  return {
    trackEvent,
    trackPageView,
    identifyUser,
    setUserProperties,
    trackChatInteraction,
    trackBuilderAction,
    trackFeatureUsage,
    trackError,
    trackPerformance,
  }
}
