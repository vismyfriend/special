import axios from "axios";


// Читаем адрес из .env. Если переменной нет — падаем на localhost и работаем локально
// const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001'
const baseURL = 'https://api.special-agents.ru'

// нужно разобраться почему пока все таки только локально работает бэк если из env запрос



const instance = axios.create({ baseURL });

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Всегда берем свежий токен
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const httpClient = instance;
