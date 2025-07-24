'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to handle Zustand store hydration for SSR compatibility
 * This prevents hydration mismatches between server and client
 */
export function useStoreHydration() {
  const [hasHydrated, setHasHydrated] = useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  return hasHydrated
}
