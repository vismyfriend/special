<!-- ==================== -->
<!-- PicResizer - Сжатие изображений -->
<!-- ==================== -->
<template>
  <div class="resizer-container">
    <div class="resizer-header">
      <h1>🖼️ PicResizer</h1>
      <p class="subtitle">Уменьши размер изображения без потери качества</p>
    </div>

    <!-- ==================== -->
    <!-- НАСТРОЙКИ -->
    <!-- ==================== -->
    <div class="settings-bar">
      <div class="settings-group">
        <label class="settings-label">📤 Выходной формат:</label>
        <div class="format-buttons">
          <button
            class="format-btn"
            :class="{ active: outputFormat === 'jpeg' }"
            @click="outputFormat = 'jpeg'"
          >
            JPEG
          </button>
          <button
            class="format-btn"
            :class="{ active: outputFormat === 'png' }"
            @click="outputFormat = 'png'"
          >
            PNG
          </button>
        </div>
      </div>

      <div class="settings-group">
        <label class="settings-label">📐 Качество:</label>
        <div class="quality-control">
          <input
            type="range"
            v-model="quality"
            min="0.1"
            max="1"
            step="0.05"
            class="quality-slider"
          >
          <span class="quality-value">{{ Math.round(quality * 100) }}%</span>
        </div>
      </div>

      <div class="settings-group">
        <label class="settings-label">📏 Макс. ширина:</label>
        <select v-model="maxWidth" class="width-select">
          <option :value="800">800 px</option>
          <option :value="1200">1200 px</option>
          <option :value="1600">1600 px</option>
          <option :value="1920">1920 px</option>
          <option :value="0">Без изменения</option>
        </select>
      </div>
    </div>

    <!-- ==================== -->
    <!-- ЗОНА ЗАГРУЗКИ -->
    <!-- ==================== -->
    <div
      class="upload-zone"
      :class="{ 'dragover': isDragging }"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      @click="$refs.fileInput.click()"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*,.heic,.heif"
        multiple
        @change="handleFiles"
        style="display: none"
      >

      <div class="upload-content">
        <div class="upload-icon">📤</div>
        <p class="upload-text">
          <strong>Перетащите изображения сюда</strong><br>
          или кликните для выбора файлов
        </p>
        <p class="upload-hint">Поддерживаются JPG, JPEG, PNG, WebP, HEIC, HEIF</p>
      </div>
    </div>

    <!-- ==================== -->
    <!-- ПРОГРЕСС И СТАТИСТИКА -->
    <!-- ==================== -->
    <div v-if="files.length > 0" class="stats-bar">
      <div class="stats-item">
        <span class="stats-label">📁 Всего файлов</span>
        <span class="stats-value">{{ files.length }}</span>
      </div>
      <div class="stats-item">
        <span class="stats-label">📊 Общий размер</span>
        <span class="stats-value">{{ totalOriginalSize }}</span>
      </div>
      <div class="stats-item">
        <span class="stats-label">✅ Сжато</span>
        <span class="stats-value">{{ processedCount }}/{{ files.length }}</span>
      </div>
      <div class="stats-item">
        <span class="stats-label">💾 Экономия</span>
        <span class="stats-value">{{ totalSavings }}</span>
      </div>
      <div class="stats-actions">
        <button class="download-all-btn" @click="downloadAll" :disabled="processedCount === 0">
          📥 Скачать всё
        </button>
        <button class="clear-btn" @click="clearAll">Очистить всё</button>
      </div>
    </div>

    <!-- ==================== -->
    <!-- ГАЛЕРЕЯ ФАЙЛОВ -->
    <!-- ==================== -->
    <div v-if="files.length > 0" class="gallery">
      <div
        v-for="(file, index) in files"
        :key="file.id"
        class="file-card"
        :class="{ 'processing': file.status === 'processing' }"
      >
        <!-- Превью -->
        <div class="preview-wrapper">
          <img
            v-if="file.previewUrl"
            :src="file.previewUrl"
            :alt="file.name"
            class="preview-image"
          >
          <div v-else class="preview-placeholder">
            <span>🖼️</span>
          </div>

          <!-- Индикатор обработки -->
          <div v-if="file.status === 'processing'" class="processing-overlay">
            <div class="spinner"></div>
          </div>

          <!-- Индикатор завершения -->
          <div v-if="file.status === 'done'" class="done-badge">
            ✅
          </div>
        </div>

        <!-- Информация -->
        <div class="file-info">
          <div class="file-name" :title="file.name">
            {{ file.name }}
            <span v-if="file.format" class="file-format-badge">{{ file.format.toUpperCase() }}</span>
          </div>
          <div class="file-size">
            <span class="original-size">{{ file.originalSizeKB }} KB</span>
            <span v-if="file.compressedSizeKB" class="arrow">→</span>
            <span v-if="file.compressedSizeKB" class="compressed-size">
              {{ file.compressedSizeKB }} KB
            </span>
            <span v-if="file.savings" class="savings">
              ({{ file.savings }}% ⬇️)
            </span>
          </div>
        </div>

        <!-- Кнопки действий -->
        <div class="file-actions">
          <button
            v-if="file.status === 'done' && file.compressedDataUrl"
            class="download-btn"
            @click="downloadFile(file)"
          >
            📥 Скачать
          </button>
          <button
            class="remove-btn"
            @click="removeFile(index)"
            title="Удалить"
          >
            ✕
          </button>
        </div>
      </div>
    </div>

    <!-- ==================== -->
    <!-- ПУСТОЕ СОСТОЯНИЕ -->
    <!-- ==================== -->
    <div v-else class="empty-state">
      <p>Загрузите изображения, чтобы начать сжатие</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// ==================== //
// СОСТОЯНИЕ
// ==================== //

const files = ref([])
const isDragging = ref(false)
const fileInput = ref(null)

// ==================== //
// НАСТРОЙКИ
// ==================== //

const outputFormat = ref('jpeg') // 'jpeg' | 'png'
const quality = ref(0.75) // 0.1 - 1.0
const maxWidth = ref(1200) // 0 = без изменения

// ==================== //
// ВСПОМОГАТЕЛЬНЫЕ ВЫЧИСЛЕНИЯ
// ==================== //

const processedCount = computed(() => {
  return files.value.filter(f => f.status === 'done').length
})

const totalOriginalSize = computed(() => {
  const totalKB = files.value.reduce((sum, f) => sum + (f.originalSizeKB || 0), 0)
  return formatSize(totalKB)
})

const totalSavings = computed(() => {
  if (files.value.length === 0) return '0%'
  const doneFiles = files.value.filter(f => f.status === 'done')
  if (doneFiles.length === 0) return '0%'
  const totalOriginal = doneFiles.reduce((sum, f) => sum + (f.originalSizeKB || 0), 0)
  const totalCompressed = doneFiles.reduce((sum, f) => sum + (f.compressedSizeKB || 0), 0)
  if (totalOriginal === 0) return '0%'
  const savings = Math.round((1 - totalCompressed / totalOriginal) * 100)
  return savings + '%'
})

// ==================== //
// МЕТОДЫ
// ==================== //

const formatSize = (kb) => {
  if (kb >= 1024) {
    return (kb / 1024).toFixed(1) + ' MB'
  }
  return kb.toFixed(0) + ' KB'
}

/**
 * Определение формата файла по расширению
 */
const detectFormat = (fileName) => {
  const ext = fileName.toLowerCase().split('.').pop()
  const formats = {
    'heic': 'heic',
    'heif': 'heif',
    'jpg': 'jpeg',
    'jpeg': 'jpeg',
    'png': 'png',
    'webp': 'webp'
  }
  return formats[ext] || 'unknown'
}

/**
 * Проверка, можно ли использовать HEIC (только Safari на Apple устройствах)
 */
const isHeicSupported = () => {
  const canvas = document.createElement('canvas')
  // Проверяем поддержку HEIC через createImageBitmap
  // В современных Safari он работает
  return 'createImageBitmap' in window
}

/**
 * Конвертация HEIC в JPEG/PNG через Canvas
 * HEIC загружается в Safari, поэтому используем обычный Image
 */
const convertHeicToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        // Для HEIC всегда конвертируем в JPEG (как базовый формат)
        resolve(canvas.toDataURL('image/jpeg', 0.92))
      }
      img.onerror = reject
      img.src = e.target.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const handleFiles = (event) => {
  const selectedFiles = Array.from(event.target.files)
  processFiles(selectedFiles)
  event.target.value = ''
}

const handleDrop = (event) => {
  isDragging.value = false
  const droppedFiles = Array.from(event.dataTransfer.files)
  processFiles(droppedFiles)
}

const processFiles = (newFiles) => {
  // Поддерживаемые форматы
  const supportedTypes = [
    'image/jpeg', 'image/png', 'image/webp',
    'image/heic', 'image/heif'
  ]

  // Фильтруем только изображения
  const imageFiles = newFiles.filter(file => {
    // Проверяем по MIME типу или по расширению
    const isImage = file.type.startsWith('image/')
    const ext = file.name.toLowerCase().split('.').pop()
    const isHeic = ['heic', 'heif'].includes(ext)
    return isImage || isHeic
  })

  if (imageFiles.length === 0) {
    alert('Пожалуйста, загружайте изображения (JPG, PNG, WebP, HEIC, HEIF)')
    return
  }

  imageFiles.forEach((file) => {
    const fileData = {
      id: Date.now() + Math.random() + Math.random(),
      file: file,
      name: file.name,
      format: detectFormat(file.name),
      originalSizeKB: Math.round(file.size / 1024),
      compressedSizeKB: null,
      previewUrl: null,
      compressedDataUrl: null,
      status: 'processing',
      savings: null
    }

    files.value.push(fileData)

    // Обработка HEIC
    if (fileData.format === 'heic' || fileData.format === 'heif') {
      // Пробуем конвертировать через Canvas
      convertHeicToDataUrl(file)
        .then(dataUrl => {
          fileData.previewUrl = dataUrl
          compressImage(fileData)
        })
        .catch(() => {
          // Если не получилось, пробуем через FileReader
          const reader = new FileReader()
          reader.onload = (e) => {
            fileData.previewUrl = e.target.result
            compressImage(fileData)
          }
          reader.onerror = () => {
            fileData.status = 'error'
            alert('Не удалось обработать HEIC файл. Попробуйте использовать Safari.')
          }
          reader.readAsDataURL(file)
        })
      return
    }

    // Обычные форматы
    const reader = new FileReader()
    reader.onload = (e) => {
      fileData.previewUrl = e.target.result
      compressImage(fileData)
    }
    reader.onerror = () => {
      fileData.status = 'error'
    }
    reader.readAsDataURL(file)
  })
}

const compressImage = (fileData) => {
  const img = new Image()
  img.onload = () => {
    try {
      // Вычисляем новые размеры
      let width = img.width
      let height = img.height

      if (maxWidth.value > 0 && width > maxWidth.value) {
        const ratio = maxWidth.value / width
        width = maxWidth.value
        height = Math.round(height * ratio)
      }

      // Создаём canvas
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')

      // Рисуем изображение с высоким качеством
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(img, 0, 0, width, height)

      // Определяем формат
      const format = outputFormat.value === 'png' ? 'image/png' : 'image/jpeg'
      const mimeType = format

      // Создаём сжатый файл
      const compressedDataUrl = canvas.toDataURL(mimeType, quality.value)

      // Вычисляем размер сжатого файла
      const compressedData = compressedDataUrl.split(',')[1]
      const compressedBytes = atob(compressedData).length
      const compressedSizeKB = Math.round(compressedBytes / 1024)

      // Обновляем данные файла
      fileData.compressedDataUrl = compressedDataUrl
      fileData.compressedSizeKB = compressedSizeKB
      fileData.savings = Math.round((1 - compressedSizeKB / fileData.originalSizeKB) * 100)
      fileData.status = 'done'

    } catch (error) {
      console.error('Ошибка сжатия:', error)
      fileData.status = 'error'
    }
  }

  img.onerror = () => {
    console.error('Ошибка загрузки изображения')
    fileData.status = 'error'
  }

  img.src = fileData.previewUrl
}

const downloadFile = (fileData) => {
  if (!fileData.compressedDataUrl) return

  const link = document.createElement('a')
  const ext = outputFormat.value === 'png' ? 'png' : 'jpg'
  const baseName = fileData.name.replace(/\.[^.]+$/, '')
  link.download = `${baseName}.${ext}`
  link.href = fileData.compressedDataUrl
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const downloadAll = () => {
  const doneFiles = files.value.filter(f => f.status === 'done')
  if (doneFiles.length === 0) return

  // Если один файл — скачиваем сразу
  if (doneFiles.length === 1) {
    downloadFile(doneFiles[0])
    return
  }

  // Если несколько — скачиваем по очереди с задержкой
  doneFiles.forEach((file, index) => {
    setTimeout(() => {
      downloadFile(file)
    }, index * 500)
  })
}

const removeFile = (index) => {
  files.value.splice(index, 1)
}

const clearAll = () => {
  if (files.value.length === 0) return
  if (confirm('Удалить все файлы?')) {
    files.value = []
  }
}
</script>

<style scoped>
/* ==================== */
/* ОСНОВНОЙ КОНТЕЙНЕР */
/* ==================== */

.resizer-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Courier New', monospace;
}

.resizer-header {
  text-align: center;
  margin-bottom: 25px;
}

.resizer-header h1 {
  font-size: 32px;
  color: #5D2906;
  margin: 0;
}

.subtitle {
  color: #666;
  font-size: 16px;
  margin-top: 5px;
}

/* ==================== */
/* НАСТРОЙКИ */
/* ==================== */

.settings-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
  padding: 15px 20px;
  background: #f5f0eb;
  border-radius: 12px;
  margin-bottom: 20px;
}

.settings-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.settings-label {
  font-size: 13px;
  font-weight: bold;
  color: #555;
}

.format-buttons {
  display: flex;
  gap: 4px;
  background: #e8e0d8;
  border-radius: 8px;
  padding: 3px;
}

.format-btn {
  padding: 4px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  font-weight: bold;
  background: transparent;
  color: #666;
  transition: all 0.3s;
}

.format-btn.active {
  background: #5D2906;
  color: white;
}

.format-btn:hover:not(.active) {
  background: rgba(93, 41, 6, 0.1);
}

.quality-control {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quality-slider {
  width: 120px;
  accent-color: #5D2906;
  cursor: pointer;
}

.quality-value {
  font-size: 14px;
  font-weight: bold;
  color: #5D2906;
  min-width: 40px;
}

.width-select {
  padding: 4px 10px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  background: white;
  cursor: pointer;
}

.width-select:focus {
  outline: none;
  border-color: #5D2906;
}

/* ==================== */
/* ЗОНА ЗАГРУЗКИ */
/* ==================== */

.upload-zone {
  border: 3px dashed #ccc;
  border-radius: 16px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.upload-zone:hover {
  border-color: #5D2906;
  background: #f5f0eb;
}

.upload-zone.dragover {
  border-color: #5D2906;
  background: #e8ddd0;
  transform: scale(1.01);
}

.upload-icon {
  font-size: 48px;
  margin-bottom: 15px;
}

.upload-text {
  font-size: 18px;
  color: #333;
  line-height: 1.6;
}

.upload-text strong {
  color: #5D2906;
}

.upload-hint {
  font-size: 14px;
  color: #999;
  margin-top: 10px;
}

/* ==================== */
/* СТАТИСТИКА */
/* ==================== */

.stats-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;
  padding: 12px 18px;
  margin: 20px 0;
  background: #f5f0eb;
  border-radius: 12px;
}

.stats-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stats-label {
  font-size: 11px;
  color: #888;
}

.stats-value {
  font-size: 16px;
  font-weight: bold;
  color: #5D2906;
}

.stats-actions {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

.download-all-btn {
  padding: 6px 16px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  transition: background 0.2s;
}

.download-all-btn:hover:not(:disabled) {
  background: #219a52;
}

.download-all-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.clear-btn {
  padding: 6px 16px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  transition: background 0.2s;
}

.clear-btn:hover {
  background: #c0392b;
}

/* ==================== */
/* ГАЛЕРЕЯ */
/* ==================== */

.gallery {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 15px;
}

.file-card {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 12px 15px;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s;
}

.file-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.file-card.processing {
  opacity: 0.6;
}

/* ==================== */
/* ПРЕВЬЮ */
/* ==================== */

.preview-wrapper {
  position: relative;
  width: 70px;
  height: 70px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  background: #f0f0f0;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  background: #f0f0f0;
}

.processing-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #fff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.done-badge {
  position: absolute;
  top: -6px;
  right: -6px;
  font-size: 18px;
  background: white;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* ==================== */
/* ИНФОРМАЦИЯ О ФАЙЛЕ */
/* ==================== */

.file-info {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.file-format-badge {
  font-size: 10px;
  font-weight: bold;
  background: #e8e0d8;
  color: #5D2906;
  padding: 0 8px;
  border-radius: 4px;
  text-transform: uppercase;
}

.file-size {
  font-size: 13px;
  color: #888;
  margin-top: 3px;
}

.original-size {
  color: #e74c3c;
}

.compressed-size {
  color: #27ae60;
}

.arrow {
  margin: 0 6px;
  color: #999;
}

.savings {
  color: #27ae60;
  font-weight: bold;
  margin-left: 6px;
}

/* ==================== */
/* КНОПКИ ДЕЙСТВИЙ */
/* ==================== */

.file-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.download-btn {
  padding: 6px 14px;
  background: #5D2906;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
  font-size: 13px;
  transition: background 0.2s;
}

.download-btn:hover {
  background: #8B4513;
}

.remove-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f0f0;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  color: #999;
  transition: all 0.2s;
}

.remove-btn:hover {
  background: #e74c3c;
  color: white;
}

/* ==================== */
/* ПУСТОЕ СОСТОЯНИЕ */
/* ==================== */

.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
}

/* ==================== */
/* АДАПТАЦИЯ ДЛЯ МОБИЛЬНЫХ */
/* ==================== */

@media (max-width: 768px) {
  .resizer-container {
    padding: 10px;
  }

  .settings-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    padding: 12px 15px;
  }

  .settings-group {
    justify-content: center;
  }

  .stats-bar {
    flex-wrap: wrap;
    gap: 10px;
    padding: 12px 15px;
  }

  .stats-item {
    flex: 1;
    min-width: 60px;
  }

  .stats-actions {
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }

  .stats-value {
    font-size: 15px;
  }

  .file-card {
    flex-wrap: wrap;
    padding: 12px;
  }

  .preview-wrapper {
    width: 60px;
    height: 60px;
  }

  .file-info {
    flex: 1 1 100%;
    order: 1;
  }

  .file-actions {
    order: 2;
    width: 100%;
    justify-content: flex-end;
  }

  .file-name {
    font-size: 13px;
  }

  .file-size {
    font-size: 12px;
  }

  .upload-zone {
    padding: 25px 15px;
  }

  .upload-text {
    font-size: 15px;
  }

  .upload-icon {
    font-size: 36px;
  }

  .resizer-header h1 {
    font-size: 24px;
  }

  .quality-slider {
    width: 80px;
  }

  .width-select {
    font-size: 12px;
    padding: 3px 8px;
  }
}

@media (max-width: 480px) {
  .file-card {
    gap: 10px;
    padding: 10px;
  }

  .preview-wrapper {
    width: 50px;
    height: 50px;
  }

  .download-btn {
    padding: 4px 10px;
    font-size: 12px;
  }

  .remove-btn {
    width: 28px;
    height: 28px;
    font-size: 14px;
  }

  .format-btn {
    font-size: 12px;
    padding: 3px 10px;
  }

  .settings-label {
    font-size: 12px;
  }
}
</style>
