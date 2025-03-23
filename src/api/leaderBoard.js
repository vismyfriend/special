import { httpClient } from "./modules/httpClient";

export default {
  get: () => httpClient.get('/scores'),
  post: (game, time, mistakes, agentName) => httpClient.post('/scores',{
    "game": game,
    "time": time,
    "mistakes": mistakes,
    "agent": agentName
  })}
