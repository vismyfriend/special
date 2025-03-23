import { httpClient } from "./modules/httpClient";

export default {
  post: (name) => httpClient.post('/auth', {'username': name})
}
