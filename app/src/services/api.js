import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = {
  uploadDocument: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/upload-document`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  generateObjectives: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/generate-objectives`, data);
      return response.data;
    } catch (error) {
      console.error('Error generating objectives:', error);
      throw error;
    }
  },

  generateSyllabus: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/generate-syllabus`, data);
      return response.data;
    } catch (error) {
      console.error('Error generating syllabus:', error);
      throw error;
    }
  },

  generateContent: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/generate-content`, data);
      return response.data;
    } catch (error) {
      console.error('Error generating content:', error);
      throw error;
    }
  },

  saveProgress: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/save-progress`, data);
      return response.data;
    } catch (error) {
      console.error('Error saving progress:', error);
      throw error;
    }
  }
};

export default api;