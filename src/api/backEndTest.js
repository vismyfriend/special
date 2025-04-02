import { httpClient } from "./modules/httpClient";

export default {
  get: () => httpClient.get('/test'),

  }
