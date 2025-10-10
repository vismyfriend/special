<template>
  <div class="container">
    <!-- Полноэкранный белый контур (позади всех) -->
    <ElectroDivLayout
      color="#ffffff"
      effect="moving"
      :full-screen="true"
      :outline-only="true"
    />

    <!-- Остальные обычные контейнеры -->
    <ElectroDivLayout
      color="#dd8448"
      effect="moving"
      title="Оранжевая молния"
      description="Классический эффект движущейся молнии"
    />

    <ElectroDivLayout
      color="#1e90ff"
      effect="hue"
      title="Синяя радуга"
      description="Цветной меняющийся эффект"
    />

    <!-- Кастомные цвета -->
    <ElectroDivLayout
      color="#ff0000"
      effect="moving"
      title="Красная энергия"
    />

    <ElectroDivLayout
      color="#00ff00"
      effect="hue"
      title="Зеленая магия"
    />

    <ElectroDivLayout
      color="#000000"
      effect="moving"
      title="Черная буря"
    />

    <!-- Кастомный контент через слоты -->
    <ElectroDivLayout color="#8a2be2" effect="hue">
      <template #top>
        <div class="content-top">
          <div class="scrollbar-glass">
            Кастомный
          </div>
          <p class="title">Мой контент</p>
        </div>
      </template>

      <template #bottom>
        <div class="content-bottom">
          <p class="description">Здесь может быть любой ваш контент!</p>
          <button class="custom-button">Кнопка</button>
        </div>
      </template>
    </ElectroDivLayout>

    <!-- Еще один полноэкранный вариант с другим эффектом -->
    <ElectroDivLayout
      color="#00ffff"
      effect="hue"
      :full-screen="true"
      :outline-only="true"
      v-if="showSecondOutline"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ElectroDivLayout from '../layouts/ElectroDivLayout.vue'

const showSecondOutline = ref(false)

// Опционально: можно переключать второй контур
setTimeout(() => {
  showSecondOutline.value = true
}, 3000)
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 2rem;
  background: #0f0f0f;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  position: relative;
}

.custom-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-top: 1rem;
}
</style>
