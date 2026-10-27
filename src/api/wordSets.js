import { httpClient } from "./modules/httpClient";

export default {
  // Получить все наборы (публичные + свои)
  getAll: () => httpClient.get('/word-sets'),

  // Получить один набор по ID
  getOne: (id) => httpClient.get(`/word-sets/${id}`),

  // Создать набор
  create: (data) => httpClient.post('/word-sets', data),

  // Обновить набор
  update: (id, data) => httpClient.put(`/word-sets/${id}`, data),

  // Удалить набор
  delete: (id) => httpClient.delete(`/word-sets/${id}`),

  // Клонировать набор
  clone: (id) => httpClient.post(`/word-sets/${id}/clone`),
}
