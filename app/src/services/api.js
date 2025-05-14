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

  getCourseById: async (courseId) => {
    try {
      const response = await axios.get(`${API_URL}/courses/${courseId}`);

      // Verificar se o curso possui slides
      const courseData = response.data;
      if (courseData && courseData.steps && courseData.steps.content &&
        courseData.steps.content.content_items) {
        // O curso já tem os dados que precisamos
        return courseData;
      } else {
        console.warn("Curso encontrado, mas sem conteúdo de slides:", courseId);
        return courseData; // Retornar o que temos, mesmo que incompleto
      }
    } catch (error) {
      console.error('Erro ao buscar dados do curso:', error);
      throw error;
    }
  },

  generateSlides: async (contentItem) => {
    try {
      console.log("Enviando item para geração de slides:", contentItem);

      const response = await axios.post(`${API_URL}/generate-slides`, {
        content_item: contentItem
      });

      if (!response.data || !response.data.slides) {
        console.warn("API retornou dados inválidos para slides:", response.data);
        return { slides: [] };
      }

      return response.data;
    } catch (error) {
      console.error('Error generating slides:', error);
      // Retornar slides vazios em caso de erro para não quebrar o fluxo
      return { slides: [] };
    }
  },

  getUserProgress: async (userId, courseId) => {
    try {
      const response = await axios.get(`${API_URL}/user-progress/${userId}/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar progresso do usuário:', error);
      return {};
    }
  },

  saveUserProgress: async (data) => {
    try {
      const response = await axios.post(`${API_URL}/user-progress`, data);
      return response.data;
    } catch (error) {
      console.error('Erro ao salvar progresso do usuário:', error);
      throw error;
    }
  },

  regenerateContentSlides: async (context) => {
    try {
      const response = await axios.post(`${API_URL}/generate-slides`, {
        content_item: {
          ...context,
          is_regeneration: true // Flag para indicar que é uma regeneração
        }
      });

      return {
        slides: response.data.slides || []
      };
    } catch (error) {
      console.error('Erro ao regenerar slides:', error);
      throw error;
    }
  }
};

export default api;