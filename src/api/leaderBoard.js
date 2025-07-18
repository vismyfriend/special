import { httpClient } from "./modules/httpClient";

export default {
  get: (gameName) => httpClient.get(`${gameName ? '/scores?game=' + gameName : '/scores' }` ),
  post: (game, time, mistakes, agentName, wordSet) => httpClient.post('/scores',{
    "game": game,
    "time": time,
    "mistakes": mistakes,
    "agent": agentName,
    "wordSet": wordSet,
  })}
