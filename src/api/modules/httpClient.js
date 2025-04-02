import axios from "axios";

const baseURL = 'http://178.184.87.113:3000';
// const baseURL = 'https://backend-for-english-app.onrender.com';
const instance = axios.create({ baseURL });

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Всегда берем свежий токен
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const httpClient = instance;
