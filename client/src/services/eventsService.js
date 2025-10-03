import { apiRequest } from '@/lib/queryClient';

const EVENTS_CACHE_KEY = 'events_cache';
const CACHE_DURATION = 5 * 60 * 1000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

const eventsService = {
  async getEvents(filters = {}) {
    const cacheKey = `${EVENTS_CACHE_KEY}_${JSON.stringify(filters)}`;
    
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await this.retryRequest(async () => 
        fetch(`/api/events?${params.toString()}`)
      );
      
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        console.warn('Using cached events data due to network error');
        return cached;
      }
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  async getEventById(id) {
    try {
      const response = await fetch(`/api/events/${id}`);
      if (!response.ok) throw new Error('Event not found');
      return response.json();
    } catch (error) {
      console.error('Error fetching event:', error);
      throw error;
    }
  },

  async createEvent(eventData) {
    try {
      return await apiRequest('POST', '/api/events', eventData);
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  async updateEvent(id, eventData) {
    try {
      return await apiRequest('PUT', `/api/events/${id}`, eventData);
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  async deleteEvent(id) {
    try {
      return await apiRequest('DELETE', `/api/events/${id}`);
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },

  async registerForEvent(id) {
    try {
      return await apiRequest('POST', `/api/events/${id}/register`);
    } catch (error) {
      console.error('Error registering for event:', error);
      throw error;
    }
  },

  async unregisterFromEvent(id) {
    try {
      return await apiRequest('DELETE', `/api/events/${id}/register`);
    } catch (error) {
      console.error('Error unregistering from event:', error);
      throw error;
    }
  },

  async getEventAttendees(id) {
    try {
      const response = await fetch(`/api/events/${id}/attendees`);
      if (!response.ok) throw new Error('Failed to fetch attendees');
      return response.json();
    } catch (error) {
      console.error('Error fetching event attendees:', error);
      throw error;
    }
  },

  async getUpcomingEvents(limit = 10) {
    const now = new Date().toISOString();
    return this.getEvents({
      startDate: now,
      status: 'upcoming',
      limit,
      sortBy: 'startDate'
    });
  },

  async getUserEvents() {
    try {
      const response = await fetch('/api/events?myEvents=true');
      if (!response.ok) throw new Error('Failed to fetch user events');
      return response.json();
    } catch (error) {
      console.error('Error fetching user events:', error);
      throw error;
    }
  },

  async retryRequest(requestFn, retries = MAX_RETRIES) {
    for (let i = 0; i < retries; i++) {
      try {
        return await requestFn();
      } catch (error) {
        if (i === retries - 1) throw error;
        
        if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * (i + 1)));
          continue;
        }
        
        throw error;
      }
    }
  },

  setCache(key, data) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    try {
      const cacheItem = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(key, JSON.stringify(cacheItem));
    } catch (error) {
      console.warn('Failed to cache data:', error);
    }
  },

  getFromCache(key) {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const { data, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(key);
        return null;
      }
      
      return data;
    } catch (error) {
      console.warn('Failed to read cache:', error);
      return null;
    }
  }
};

export default eventsService;
