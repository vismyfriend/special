<template>
    <div class="draggable-window" 
         :style="{ top: position.top, left: position.left, zIndex: zIndex }" 
         @mousedown="startDragging" 
         @touchstart="startDragging">
      <div class="title-bar">{{ title }}</div>
      <div class="content">
        <p>Это тестовое окно. Перетаскивайте меня!</p>
      </div>
    </div>
  </template>
  <script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  const props = defineProps(['title', 'position', 'isActive']);
  const emit = defineEmits(['updatePosition', 'setActiveWindow']);
  const isDragging = ref(false);
  const offset = ref({ x: 0, y: 0 });
  const zIndex = ref(1); // Начальный z-index окна
  const windowWidth = 300; // Ширина окна
  const windowHeight = 200; // Высота окна
  const startDragging = (event) => {
    isDragging.value = true;
    zIndex.value = 1; 
    zIndex.value = zIndex.value + 1; // Увеличиваем z-index при начале перетаскивания
    emit('setActiveWindow', props.title); // Устанавливаем активное окно
    const clientX = event.touches ? event.touches[0].clientX : event.clientX;
    const clientY = event.touches ? event.touches[0].clientY : event.clientY;
    offset.value.x = clientX - event.target.getBoundingClientRect().left;
    offset.value.y = clientY - event.target.getBoundingClientRect().top;
    if (event.touches) {
      event.preventDefault();
    }
  };
  const onMove = (event) => {
    if (isDragging.value) {
      const clientX = event.touches ? event.touches[0].clientX : event.clientX;
      const clientY = event.touches ? event.touches[0].clientY : event.clientY;
      // Вычисляем новые координаты
      let newTop = clientY - offset.value.y;
      let newLeft = clientX - offset.value.x;
      // Ограничиваем окно в пределах экрана
      const maxTop = window.innerHeight - windowHeight;
      const maxLeft = window.innerWidth - windowWidth;
      newTop = Math.max(0, Math.min(newTop, maxTop));
      newLeft = Math.max(0, Math.min(newLeft, maxLeft));
      const newPosition = {
        top: `${newTop}px`,
        left: `${newLeft}px`,
      };
      zIndex.value = 1
      zIndex.value = zIndex.value + 1
      emit('updatePosition', newPosition);
      // Предотвращаем прокрутку страницы
      if (event.touches) {
        event.preventDefault();
      }
    }
  };
  const stopDragging = () => {
    isDragging.value = false;
    zIndex.value = zIndex.value + 1; // 
  };
  onMounted(() => {
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', stopDragging);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', stopDragging);
  });
  onBeforeUnmount(() => {
    window.removeEventListener('mousemove', onMove);
    window.removeEventListener('mouseup', stopDragging);
    window.removeEventListener('touchmove', onMove);
    window.removeEventListener('touchend', stopDragging);
  });
  </script>
  <style scoped>
  .draggable-window {
    position: absolute;
    width: 300px;
    height: 200px;
    background-color: white;
    border: 2px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    user-select: none; /* Запретить выделение текста */
  }
  .title-bar {
    background-color: #007aff;
    color: white;
    padding: 10px;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    cursor: grab;
  }
  .title-bar:active {
    cursor: grabbing;
  }
  .content {
    padding: 10px;
  }
  </style>
  