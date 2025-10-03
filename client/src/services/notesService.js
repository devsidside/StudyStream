import { apiRequest } from '@/lib/queryClient';

const NOTES_CACHE_KEY = 'notes_cache';
const CACHE_DURATION = 5 * 60 * 1000;
const MAX_RETRIES = 2;
const RETRY_DELAY = 1000;

const notesService = {
  async getNotes(filters = {}) {
    const cacheKey = `${NOTES_CACHE_KEY}_${JSON.stringify(filters)}`;
    
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await this.retryRequest(async () => 
        fetch(`/api/notes?${params.toString()}`)
      );
      
      if (!response.ok) throw new Error('Failed to fetch notes');
      const data = await response.json();
      
      this.setCache(cacheKey, data);
      return data;
    } catch (error) {
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        console.warn('Using cached notes data due to network error');
        return cached;
      }
      throw error;
    }
  },

  async getNoteById(id) {
    try {
      const response = await fetch(`/api/notes/${id}`);
      if (!response.ok) throw new Error('Note not found');
      return response.json();
    } catch (error) {
      console.error('Error fetching note:', error);
      throw error;
    }
  },

  async createNote(noteData) {
    try {
      return await apiRequest('POST', '/api/notes', noteData);
    } catch (error) {
      console.error('Error creating note:', error);
      throw error;
    }
  },

  async updateNote(id, noteData) {
    try {
      return await apiRequest('PUT', `/api/notes/${id}`, noteData);
    } catch (error) {
      console.error('Error updating note:', error);
      throw error;
    }
  },

  async deleteNote(id) {
    try {
      return await apiRequest('DELETE', `/api/notes/${id}`);
    } catch (error) {
      console.error('Error deleting note:', error);
      throw error;
    }
  },

  async likeNote(id) {
    try {
      return await apiRequest('POST', `/api/notes/${id}/like`);
    } catch (error) {
      console.error('Error liking note:', error);
      throw error;
    }
  },

  async saveNote(id) {
    try {
      return await apiRequest('POST', `/api/notes/${id}/save`);
    } catch (error) {
      console.error('Error saving note:', error);
      throw error;
    }
  },

  async unsaveNote(id) {
    try {
      return await apiRequest('DELETE', `/api/notes/${id}/save`);
    } catch (error) {
      console.error('Error unsaving note:', error);
      throw error;
    }
  },

  async getSavedNotes() {
    try {
      const response = await fetch('/api/saved-notes');
      if (!response.ok) throw new Error('Failed to fetch saved notes');
      return response.json();
    } catch (error) {
      console.error('Error fetching saved notes:', error);
      throw error;
    }
  },

  async getNoteRatings(noteId) {
    try {
      const response = await fetch(`/api/notes/${noteId}/ratings`);
      if (!response.ok) throw new Error('Failed to fetch ratings');
      return response.json();
    } catch (error) {
      console.error('Error fetching note ratings:', error);
      throw error;
    }
  },

  async rateNote(noteId, ratingData) {
    try {
      return await apiRequest('POST', `/api/notes/${noteId}/ratings`, ratingData);
    } catch (error) {
      console.error('Error rating note:', error);
      throw error;
    }
  },

  async getNoteComments(noteId) {
    try {
      const response = await fetch(`/api/notes/${noteId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json();
    } catch (error) {
      console.error('Error fetching note comments:', error);
      throw error;
    }
  },

  async addComment(noteId, commentData) {
    try {
      return await apiRequest('POST', `/api/notes/${noteId}/comments`, commentData);
    } catch (error) {
      console.error('Error adding comment:', error);
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

export default notesService;
