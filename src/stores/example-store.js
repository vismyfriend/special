import { defineStore } from 'pinia';

export const useGameStore = defineStore('game', {
  state: () => ({
    lastGameResults: null,
    agentName: null,
    gameName: null,

  }),
  actions: {
    setLastGameResults(time, mistakes) {
      this.lastGameResults = { time, mistakes };
    },
    setAgentName(agentName) {
      this.agentName = agentName;
    },
    setGameName(gameName) {
      this.gameName = gameName
    },
  }
});
