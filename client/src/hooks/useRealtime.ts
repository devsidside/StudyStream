import { useEffect, useRef } from 'react'
import { realtimeManager, type RealtimeSubscriptionOptions } from '@/services/realtime'

// Hook for subscribing to realtime changes
export const useRealtime = (options: RealtimeSubscriptionOptions) => {
  const channelIdRef = useRef<string | null>(null)

  useEffect(() => {
    // Subscribe to realtime changes
    channelIdRef.current = realtimeManager.subscribe(options)

    // Cleanup subscription on unmount
    return () => {
      if (channelIdRef.current) {
        realtimeManager.unsubscribe(channelIdRef.current)
        channelIdRef.current = null
      }
    }
  }, [options.table, options.event, options.filter]) // Re-subscribe if options change

  // Return unsubscribe function for manual cleanup
  return {
    unsubscribe: () => {
      if (channelIdRef.current) {
        realtimeManager.unsubscribe(channelIdRef.current)
        channelIdRef.current = null
      }
    }
  }
}

// Hook for notes realtime updates
export const useNotesRealtime = (callback: (payload: any) => void) => {
  return useRealtime({
    table: 'notes',
    callback
  })
}

// Hook for user-specific notes realtime updates
export const useUserNotesRealtime = (userId: string, callback: (payload: any) => void) => {
  return useRealtime({
    table: 'notes',
    filter: `uploader_id=eq.${userId}`,
    callback
  })
}

// Hook for accommodations realtime updates
export const useAccommodationsRealtime = (callback: (payload: any) => void) => {
  return useRealtime({
    table: 'accommodations',
    callback
  })
}

// Hook for tutors realtime updates
export const useTutorsRealtime = (callback: (payload: any) => void) => {
  return useRealtime({
    table: 'tutors',
    callback
  })
}