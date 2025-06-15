// import { httpClient } from "./modules/httpClient";
//
// export default {
//   post: (name) => httpClient.post('/auth', {'username': name})
// }
//


import { httpClient } from "./modules/httpClient";

export default {
  post: (name) => httpClient.post('/auth', {'username': name}),
  // Добавляем новый метод с более понятным названием
  getToken: (name) => httpClient.post('/auth', {'username': name})
}
