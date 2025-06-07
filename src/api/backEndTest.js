import { httpClient } from "./modules/httpClient";

export default {
  test: () => httpClient.get('/test'),
 testDb: () => httpClient.get('/db'),
 health: () => httpClient.get('/health'),

  }
