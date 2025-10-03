import { apiRequest } from '@/lib/queryClient';

const VENDORS_CACHE_KEY = 'vendors_cache';
const CACHE_DURATION = 10 * 60 * 1000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

const vendorsService = {
  async getVendors(filters = {}) {
    const cacheKey = `${VENDORS_CACHE_KEY}_${JSON.stringify(filters)}`;
    
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;
    
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await this.retryRequest(async () =>
        fetch(`/api/vendors?${params.toString()}`)
      );
      
      if (!response.ok) throw new Error('Failed to fetch vendors');
      const data = await response.json();
      
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching vendors:', error);
      throw error;
    }
  },

  async getVendorById(id) {
    const cacheKey = `vendor_${id}`;
    
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;
    
    try {
      const response = await this.retryRequest(async () =>
        fetch(`/api/vendors/${id}`)
      );
      
      if (!response.ok) throw new Error('Vendor not found');
      const data = await response.json();
      
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      console.error('Error fetching vendor:', error);
      throw error;
    }
  },

  async createVendor(vendorData) {
    try {
      const result = await apiRequest('POST', '/api/vendors', vendorData);
      this.clearCache();
      return result;
    } catch (error) {
      console.error('Error creating vendor:', error);
      throw error;
    }
  },

  async updateVendor(id, vendorData) {
    try {
      const result = await apiRequest('PUT', `/api/vendors/${id}`, vendorData);
      this.clearCache();
      return result;
    } catch (error) {
      console.error('Error updating vendor:', error);
      throw error;
    }
  },

  async deleteVendor(id) {
    try {
      const result = await apiRequest('DELETE', `/api/vendors/${id}`);
      this.clearCache();
      return result;
    } catch (error) {
      console.error('Error deleting vendor:', error);
      throw error;
    }
  },

  async getVendorRatings(vendorId) {
    try {
      const response = await fetch(`/api/vendors/${vendorId}/ratings`);
      if (!response.ok) throw new Error('Failed to fetch ratings');
      return response.json();
    } catch (error) {
      console.error('Error fetching vendor ratings:', error);
      throw error;
    }
  },

  async rateVendor(vendorId, ratingData) {
    try {
      return await apiRequest('POST', `/api/vendors/${vendorId}/ratings`, ratingData);
    } catch (error) {
      console.error('Error rating vendor:', error);
      throw error;
    }
  },

  async getNearbyVendors(latitude, longitude, radius = 5000) {
    const cacheKey = `nearby_vendors_${latitude}_${longitude}_${radius}`;
    
    const cached = this.getFromCache(cacheKey);
    if (cached) return cached;
    
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString()
      });
      
      const response = await this.retryRequest(async () =>
        fetch(`/api/vendors/nearby?${params.toString()}`)
      );
      
      if (!response.ok) throw new Error('Failed to fetch nearby vendors');
      const data = await response.json();
      
      this.setCache(cacheKey, data, 5 * 60 * 1000);
      return data;
    } catch (error) {
      console.error('Error fetching nearby vendors:', error);
      throw error;
    }
  },

  async getVendorAnalytics() {
    try {
      const response = await fetch('/api/vendor/analytics');
      if (!response.ok) throw new Error('Failed to fetch analytics');
      return response.json();
    } catch (error) {
      console.error('Error fetching vendor analytics:', error);
      throw error;
    }
  },

  setCache(key, data, duration = CACHE_DURATION) {
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    try {
      const cacheItem = {
        data,
        timestamp: Date.now(),
        duration
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
      
      const { data, timestamp, duration } = JSON.parse(cached);
      if (Date.now() - timestamp > (duration || CACHE_DURATION)) {
        localStorage.removeItem(key);
        return null;
      }
      
      return data;
    } catch (error) {
      console.warn('Failed to read cache:', error);
      return null;
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

  clearCache() {
    if (typeof window === 'undefined' || !window.localStorage) return;
    
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(VENDORS_CACHE_KEY) || key.startsWith('vendor_') || key.startsWith('nearby_vendors_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (error) {
      console.warn('Failed to clear cache:', error);
    }
  }
};

export default vendorsService;
