import { httpClient } from "./modules/httpClient";

export default {
  test: () => httpClient.get('/test'),
 testBd: () => httpClient.get('/bd'),

  }
