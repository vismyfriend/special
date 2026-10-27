import { httpClient } from "./modules/httpClient";

export default {
  getAll: () => httpClient.get('/word-sets'),
  getOne: (missionName) => httpClient.get(`/word-sets/${missionName}`),
  create: (data) => httpClient.post('/word-sets', data),
  update: (missionName, data) => httpClient.put(`/word-sets/${missionName}`, data),
  delete: (missionName) => httpClient.delete(`/word-sets/${missionName}`),
  clone: (missionName) => httpClient.post(`/word-sets/${missionName}/clone`),
}
