import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export const uploadMeme = async (imageFile, topText, bottomText) => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('topText', topText);
  formData.append('bottomText', bottomText);

  const response = await api.post('/memes/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

export const getAllMemes = async () => {
  const response = await api.get('/memes');
  return response.data;
};

export const deleteMeme = async (id) => {
  const response = await api.delete(`/memes/${id}`);
  return response.data;
};

export const downloadMeme = async (id) => {
  const response = await api.get(`/memes/${id}/download`);
  return response.data.downloadUrl;
};

export default api;