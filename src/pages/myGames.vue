<template>
  <div>
    <button class="closeThisPage" @click="backToIntroPage">close Special App ❌</button>
    <button class="play-itch-game" @click="openItchGame">Play Itch.io Game</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const itchGameUrl = "https://vismyfriend.itch.io/vismygame2/";

const backToIntroPage = () => {
  router.push("/");
};

const openItchGame = () => {
  const width = 900;
  const height = 700;
  const left = (window.innerWidth - width) / 2;
  const top = (window.innerHeight - height) / 2;

  window.open(itchGameUrl, "_blank", `width=${width},height=${height},top=${top},left=${left},resizable=no,scrollbars=no,status=no,toolbar=no,menubar=no,location=no`);
};
</script>

<style lang="scss" scoped>
.closeThisPage {
  display: block;
  margin: 10px auto;
  border-radius: 30px;
  background-color: transparent;
}

.play-itch-game {
  margin-top: 10px;
  padding: 10px 15px;
  border: none;
  background-color: #ff4f4f;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
}

.play-itch-game:hover {
  background-color: #e04444;
}
</style>
