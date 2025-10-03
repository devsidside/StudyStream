import { apiRequest } from './api';

const aiService = {
  async summarizeContent(content, maxLength = 150) {
    try {
      if (!content || content.trim().length === 0) {
        throw new Error('Content is required for summarization');
      }
      
      const response = await apiRequest('POST', '/api/ai/summarize', {
        content,
        maxLength
      });
      
      return response.summary;
    } catch (error) {
      if (error.message?.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again in a minute.');
      }
      console.error('Error summarizing content:', error);
      throw error;
    }
  },

  async generateQuiz(content, numQuestions = 5) {
    try {
      if (!content || content.trim().length === 0) {
        throw new Error('Content is required for quiz generation');
      }
      
      const response = await apiRequest('POST', '/api/ai/quiz', {
        content,
        numQuestions
      });
      
      return response.quiz;
    } catch (error) {
      if (error.message?.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again in a minute.');
      }
      console.error('Error generating quiz:', error);
      throw error;
    }
  },

  async getCodeAssistance(code, language = 'javascript', task = 'explain') {
    try {
      if (!code || code.trim().length === 0) {
        throw new Error('Code is required for assistance');
      }
      
      const response = await apiRequest('POST', '/api/ai/code-assist', {
        code,
        language,
        task
      });
      
      return response.assistance;
    } catch (error) {
      if (error.message?.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again in a minute.');
      }
      console.error('Error getting code assistance:', error);
      throw error;
    }
  },

  async explainCode(code, language = 'javascript') {
    return this.getCodeAssistance(code, language, 'explain');
  },

  async reviewCode(code, language = 'javascript') {
    return this.getCodeAssistance(code, language, 'review');
  },

  async debugCode(code, language = 'javascript') {
    return this.getCodeAssistance(code, language, 'debug');
  },

  async optimizeCode(code, language = 'javascript') {
    return this.getCodeAssistance(code, language, 'optimize');
  }
};

export default aiService;
