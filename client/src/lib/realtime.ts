import { supabase } from './supabase'
import type { RealtimeChannel } from '@supabase/supabase-js'

// Types for realtime events
export interface RealtimeSubscriptionOptions {
  table: string
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  filter?: string
  callback: (payload: any) => void
}

// Manage realtime subscriptions
export class RealtimeManager {
  private channels: Map<string, RealtimeChannel> = new Map()

  // Subscribe to database changes
  subscribe(options: RealtimeSubscriptionOptions): string {
    const { table, event = '*', filter, callback } = options
    const channelId = `${table}_${event}_${filter || 'all'}_${Date.now()}`
    
    const channel = supabase
      .channel(channelId)
      .on(
        'postgres_changes' as any, 
        { 
          event,
          schema: 'public',
          table,
          ...(filter ? { filter } : {})
        },
        callback
      )
      .subscribe()

    this.channels.set(channelId, channel)
    return channelId
  }

  // Unsubscribe from a specific channel
  unsubscribe(channelId: string): void {
    const channel = this.channels.get(channelId)
    if (channel) {
      channel.unsubscribe()
      this.channels.delete(channelId)
    }
  }

  // Unsubscribe from all channels
  unsubscribeAll(): void {
    this.channels.forEach((channel) => {
      channel.unsubscribe()
    })
    this.channels.clear()
  }

  // Get active channels count
  getActiveChannelsCount(): number {
    return this.channels.size
  }
}

// Global realtime manager instance
export const realtimeManager = new RealtimeManager()

// Convenience hooks for common use cases
export const subscribeToNotes = (callback: (payload: any) => void): string => {
  return realtimeManager.subscribe({
    table: 'notes',
    callback
  })
}

export const subscribeToUserNotes = (userId: string, callback: (payload: any) => void): string => {
  return realtimeManager.subscribe({
    table: 'notes',
    filter: `uploader_id=eq.${userId}`,
    callback
  })
}

export const subscribeToAccommodations = (callback: (payload: any) => void): string => {
  return realtimeManager.subscribe({
    table: 'accommodations',
    callback
  })
}

export const subscribeToTutors = (callback: (payload: any) => void): string => {
  return realtimeManager.subscribe({
    table: 'tutors',
    callback
  })
}