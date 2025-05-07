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
  },

  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  getAllCourses: async () => {
    try {
      const response = await axios.get(`${API_URL}/courses`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  getCoursesByProfessor: async (professorId) => {
    try {
      const response = await axios.get(`${API_URL}/courses/professor/${professorId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching professor courses:', error);
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user details:', error);
      return null;
    }
  },

  generateTitle: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/generate-title`, data);
      return response.data;
    } catch (error) {
      console.error('Error generating title:', error);
      return { title: "Curso Educacional" };  // Título padrão em caso de erro
    }
  },

  generateDescription: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/generate-description`, data);
      return response.data;
    } catch (error) {
      console.error('Error generating description:', error);
      return { description: "Curso educacional com material didático e recursos interativos." };  // Descrição padrão em caso de erro
    }
  },
};

export default api;