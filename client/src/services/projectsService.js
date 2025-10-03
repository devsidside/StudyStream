import { apiRequest } from '@/lib/queryClient';

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const projectsService = {
  async getProjects(filters = {}) {
    return this.retryRequest(async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const response = await fetch(`/api/projects?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch projects');
      return response.json();
    });
  },

  async getProjectById(id) {
    return this.retryRequest(async () => {
      const response = await fetch(`/api/projects/${id}`);
      if (!response.ok) throw new Error('Project not found');
      return response.json();
    });
  },

  async createProject(projectData) {
    return this.retryRequest(async () => {
      return await apiRequest('POST', '/api/projects', projectData);
    });
  },

  async updateProject(id, projectData) {
    return this.retryRequest(async () => {
      return await apiRequest('PUT', `/api/projects/${id}`, projectData);
    });
  },

  async deleteProject(id) {
    return this.retryRequest(async () => {
      return await apiRequest('DELETE', `/api/projects/${id}`);
    });
  },

  async likeProject(id) {
    return this.retryRequest(async () => {
      return await apiRequest('POST', `/api/projects/${id}/like`);
    });
  },

  async saveProject(id) {
    return this.retryRequest(async () => {
      return await apiRequest('POST', `/api/projects/${id}/save`);
    });
  },

  async unsaveProject(id) {
    return this.retryRequest(async () => {
      return await apiRequest('DELETE', `/api/projects/${id}/save`);
    });
  },

  async getSavedProjects() {
    return this.retryRequest(async () => {
      const response = await fetch('/api/saved-projects');
      if (!response.ok) throw new Error('Failed to fetch saved projects');
      return response.json();
    });
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
  }
};

export default projectsService;
