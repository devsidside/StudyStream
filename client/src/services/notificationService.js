import { apiRequest } from '@/lib/queryClient';

const NOTIFICATIONS_CACHE_KEY = 'notifications_cache';
const CACHE_DURATION = 2 * 60 * 1000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

const notificationService = {
  async getNotifications(filters = {}) {
    const cacheKey = `${NOTIFICATIONS_CACHE_KEY}_${JSON.stringify(filters)}`;
    
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await this.retryRequest(async () => 
        fetch(`/api/notifications?${params.toString()}`)
      );
      
      if (!response.ok) throw new Error('Failed to fetch notifications');
      const data = await response.json();
      
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        console.warn('Using cached notifications data due to network error');
        return cached;
      }
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  async createNotification(notificationData) {
    try {
      return await apiRequest('POST', '/api/notifications', notificationData);
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  async updateNotification(id, updates) {
    try {
      return await apiRequest('PUT', `/api/notifications/${id}`, updates);
    } catch (error) {
      console.error('Error updating notification:', error);
      throw error;
    }
  },

  async markAsRead(id) {
    try {
      return await apiRequest('PUT', `/api/notifications/${id}/read`);
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  async markAllAsRead() {
    try {
      return await apiRequest('PUT', '/api/notifications/read-all');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  },

  async deleteNotification(id) {
    try {
      return await apiRequest('DELETE', `/api/notifications/${id}`);
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },

  async getUnreadCount() {
    try {
      const response = await fetch('/api/notifications/unread-count');
      if (!response.ok) throw new Error('Failed to fetch unread count');
      return response.json();
    } catch (error) {
      console.error('Error fetching unread count:', error);
      return { count: 0 };
    }
  },

  async getUnreadNotifications() {
    return this.getNotifications({ isRead: false });
  },

  setupRealtimeListener(callback) {
    const pollInterval = 30000;
    
    const poll = async () => {
      try {
        const data = await this.getUnreadNotifications();
        callback(data);
      } catch (error) {
        console.error('Error polling notifications:', error);
      }
    };
    
    const intervalId = setInterval(poll, pollInterval);
    
    poll();
    
    return () => clearInterval(intervalId);
  },

  subscribeToNotifications(userId, callback) {
    return this.setupRealtimeListener(callback);
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

export default notificationService;
