import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = {
  uploadDocument: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_URL}/api/upload-document`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  
  generateObjectives: async (documentData) => {
    const response = await axios.post(`${API_URL}/api/generate-objectives`, documentData);
    return response.data;
  },
  
  generateSyllabus: async (objectives) => {
    const response = await axios.post(`${API_URL}/api/generate-syllabus`, { objectives });
    return response.data;
  }
};

export default api;