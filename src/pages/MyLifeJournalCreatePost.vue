<template>
  <div class="create-post-modal">
    <h3>Новая запись</h3>

    <!-- Основной текст -->

    <!-- ЭТО КОМПОНЕНТ ПОКА НИГДЕ НЕ ИСПОЛЬЗУЕТСЯ -->

    <!-- НУЖНО ПОДКЛЮЧИТЬ ЕГО К ЖУРНАЛУ ЧТОБЫ ДЕЛАТЬ ПОСТЫ, НО ДЛЯ ЭТОГО НУЖЕН БЭКЕНД -->

    <!-- Основной текст -->


    <!-- Основной текст -->
    <textarea v-model="newPost.text" placeholder="Что нового?"></textarea>

    <!-- Кнопки добавления -->
    <div class="attach-buttons">
      <button @click="attachImages">📷 Фото</button>
      <button @click="attachAudio">🎵 Аудио</button>
      <button @click="attachLink">🔗 Ссылка</button>
    </div>

    <!-- Предпросмотр прикрепленных файлов -->
    <div class="attachments-preview">
      <div v-for="(file, idx) in attachments" :key="idx" class="attachment">
        <img v-if="file.type.startsWith('image/')" :src="file.preview" />
        <audio v-if="file.type.startsWith('audio/')" controls :src="file.preview"></audio>
        <span>{{ file.name }}</span>
        <button @click="removeAttachment(idx)">✕</button>
      </div>
    </div>

    <button @click="savePost">Опубликовать</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const newPost = ref({
  text: '',
  attachments: []
});

// Прикрепление файлов
function attachImages() {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.accept = 'image/*'; // ограничиваем только картинками [citation:7]

  input.onchange = (e) => {
    Array.from(e.target.files).forEach(file => {
      // Создаем превью
      const reader = new FileReader();
      reader.onload = (e) => {
        attachments.value.push({
          type: file.type,
          name: file.name,
          preview: e.target.result, // base64 для предпросмотра
          file: file // сам файл для отправки
        });
      };
      reader.readAsDataURL(file);
    });
  };

  input.click();
}

// Автоопределение типа файла
function getFileType(file) {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  return 'file';
}

// Сохранение поста
async function savePost() {
  // Собираем структуру как в life-journal-data.js
  const postContent = [];

  // Добавляем текст
  if (newPost.value.text) {
    postContent.push({
      type: 'text',
      value: newPost.value.text
    });
  }

  // Группируем изображения в галерею
  const images = attachments.value.filter(a => a.type.startsWith('image/'));
  if (images.length > 0) {
    postContent.push({
      type: 'gallery',
      items: images.map(img => ({
        src: img.preview, // или URL после загрузки на сервер
        caption: img.name
      }))
    });
  }

  // Аудио добавляем по одному или плейлистом
  const audios = attachments.value.filter(a => a.type.startsWith('audio/'));
  if (audios.length === 1) {
    postContent.push({
      type: 'audio',
      value: audios[0].preview,
      caption: audios[0].name
    });
  } else if (audios.length > 1) {
    postContent.push({
      type: 'audio-playlist',
      items: audios.map(audio => ({
        src: audio.preview,
        caption: audio.name
      }))
    });
  }

  // Создаем объект поста
  const newPostObj = {
    id: Date.now().toString(),
    date: new Date().toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric'
    }),
    title: newPost.value.text.split('\n')[0].slice(0, 50) || 'Новая запись',
    mood: '😊',
    location: '', // можно добавить определение геолокации
    content: postContent
  };

  // Отправляем на сервер (или сохраняем локально)
  await saveToServer(newPostObj);
}
</script>
