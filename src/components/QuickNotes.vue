<template>
  <div class="quick-notes">
    <!-- Кнопка-триггер -->
    <button
      class="notes-trigger"
      @click="togglePanel"
      :class="{ active: isPanelOpen }"
      :title="isPanelOpen ? 'Close notes' : 'Open notes (N)'"
    >
      📝
      <span v-if="notes.length > 0" class="notes-badge">{{ notes.length }}</span>
    </button>

    <!-- Панель -->
    <div v-if="isPanelOpen" class="notes-panel">
      <div class="panel-header">
        <h3>📝 Quick Notes</h3>
        <div class="panel-actions">
          <button class="action-btn" @click="clearAll" title="Clear all notes">🗑️</button>
          <button class="action-btn" @click="exportNotes" title="Export notes">📤</button>
          <button class="close-btn" @click="isPanelOpen = false">✕</button>
        </div>
      </div>

      <div class="panel-body">
        <!-- Поле ввода -->
        <div class="input-area">
          <textarea
            v-model="currentNote"
            class="note-input"
            placeholder="Type a word or phrase here..."
            @keydown.ctrl.enter="addNote"
            @keydown.meta.enter="addNote"
            rows="2"
          ></textarea>
          <button class="add-btn" @click="addNote" :disabled="!currentNote.trim()">
            ➕ Add
          </button>
        </div>

        <!-- Список заметок -->
        <div v-if="notes.length > 0" class="notes-list">
          <div
            v-for="(note, index) in notes"
            :key="index"
            class="note-item"
            @click="copyNote(note)"
            @dblclick="removeNote(index)"
            :title="'Click to copy | Double-click to remove'"
          >
            <span class="note-number">{{ index + 1 }}.</span>
            <span class="note-text">{{ note }}</span>
            <button class="remove-btn" @click.stop="removeNote(index)">✕</button>
          </div>
        </div>
        <div v-else class="empty-state">
          <span>📭 No notes yet</span>
          <span class="hint">Press Ctrl+Enter to add</span>
        </div>

        <!-- Кнопка копирования всего -->
        <div v-if="notes.length > 0" class="footer-actions">
          <button class="copy-all-btn" @click="copyAllNotes">📋 Copy all</button>
          <span class="notes-count">{{ notes.length }} notes</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';

// Состояния
const isPanelOpen = ref(false);
const currentNote = ref('');
const notes = ref([]);

// Загрузка сохраненных заметок
const loadNotes = () => {
  try {
    const saved = localStorage.getItem('quickNotes');
    if (saved) {
      notes.value = JSON.parse(saved);
    }
  } catch (e) {}
};

// Сохранение заметок
const saveNotes = () => {
  try {
    localStorage.setItem('quickNotes', JSON.stringify(notes.value));
  } catch (e) {}
};

// Добавление заметки
const addNote = () => {
  const text = currentNote.value.trim();
  if (text) {
    notes.value.push(text);
    currentNote.value = '';
    saveNotes();
  }
};

// Удаление заметки
const removeNote = (index) => {
  notes.value.splice(index, 1);
  saveNotes();
};

// Очистка всех заметок
const clearAll = () => {
  if (notes.value.length === 0) return;
  if (confirm('Delete all notes?')) {
    notes.value = [];
    saveNotes();
  }
};

// Копирование одной заметки
const copyNote = (text) => {
  navigator.clipboard.writeText(text).then(() => {
    // Визуальный фидбэк — можно добавить тост
    console.log('📋 Copied:', text);
  }).catch(() => {
    // Fallback
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  });
};

// Копирование всех заметок
const copyAllNotes = () => {
  const text = notes.value.map((n, i) => `${i + 1}. ${n}`).join('\n');
  navigator.clipboard.writeText(text).then(() => {
    console.log('📋 Copied all notes');
  }).catch(() => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  });
};

// Экспорт заметок
const exportNotes = () => {
  if (notes.value.length === 0) return;
  const text = notes.value.map((n, i) => `${i + 1}. ${n}`).join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `notes-${new Date().toISOString().slice(0, 10)}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

// Toggle панели
const togglePanel = () => {
  isPanelOpen.value = !isPanelOpen.value;
  if (isPanelOpen.value) {
    setTimeout(() => {
      document.querySelector('.note-input')?.focus();
    }, 100);
  }
};

// Горячие клавиши
const handleKeyPress = (event) => {
  // Игнорируем, если печатаем в поле ввода
  if (['INPUT', 'TEXTAREA'].includes(event.target.tagName)) return;

  // N — открыть/закрыть панель
  if (event.key === 'n' || event.key === 'N') {
    if (!event.ctrlKey && !event.metaKey) {
      event.preventDefault();
      togglePanel();
    }
  }
};

// Следим за изменениями для автосохранения
watch(notes, saveNotes, { deep: true });

onMounted(() => {
  loadNotes();
  window.addEventListener('keydown', handleKeyPress);
  console.log('📝 Quick Notes loaded! Press N to open');
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});

// Экспорт API
defineExpose({
  addNote,
  notes,
  togglePanel,
  clearAll
});
</script>

<style scoped>
.quick-notes {
  position: fixed;
  bottom: 90px;
  right: 20px;
  z-index: 9998;
}

/* ===== КНОПКА-ТРИГГЕР ===== */
.notes-trigger {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2d4059, #1a1a2e);
  border: 2px solid rgba(255, 255, 255, 0.15);
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.notes-trigger:hover {
  transform: scale(1.1);
  border-color: #ffd93d;
  box-shadow: 0 4px 30px rgba(255, 217, 61, 0.2);
}

.notes-trigger.active {
  border-color: #ffd93d;
  background: linear-gradient(135deg, #1a1a2e, #2d4059);
}

.notes-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #ff6b6b;
  color: #fff;
  font-size: 11px;
  font-weight: bold;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
}

/* ===== ПАНЕЛЬ ===== */
.notes-panel {
  position: fixed;
  bottom: 160px;
  right: 20px;
  width: 380px;
  max-height: 70vh;
  background: #1a1a2e;
  border: 2px solid rgba(255, 217, 61, 0.15);
  border-radius: 16px;
  box-shadow: 0 10px 60px rgba(0, 0, 0, 0.8);
  color: #fff;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.panel-header h3 {
  margin: 0;
  font-size: 16px;
  color: #ffd93d;
}

.panel-actions {
  display: flex;
  gap: 6px;
}

.panel-actions button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.2s ease;
}

.panel-actions button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
}

.close-btn {
  font-size: 18px;
}

.close-btn:hover {
  transform: rotate(90deg);
}

.panel-body {
  padding: 16px;
  max-height: calc(70vh - 60px);
  overflow-y: auto;
}

/* ===== ВВОД ===== */
.input-area {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.note-input {
  flex: 1;
  padding: 10px 12px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: #fff;
  font-size: 14px;
  resize: vertical;
  min-height: 50px;
  font-family: inherit;
  transition: border-color 0.3s ease;
}

.note-input:focus {
  outline: none;
  border-color: #ffd93d;
}

.note-input::placeholder {
  color: rgba(255, 255, 255, 0.3);
}

.add-btn {
  padding: 0 16px;
  background: linear-gradient(135deg, #ffd93d, #f5a623);
  border: none;
  border-radius: 10px;
  color: #1a1a2e;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 14px;
}

.add-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.add-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* ===== СПИСОК ЗАМЕТОК ===== */
.notes-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 300px;
  overflow-y: auto;
}

.note-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.04);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
}

.note-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.05);
}

.note-number {
  color: rgba(255, 255, 255, 0.2);
  font-size: 12px;
  min-width: 24px;
}

.note-text {
  flex: 1;
  font-size: 14px;
  word-break: break-word;
}

.remove-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  transition: all 0.2s ease;
}

.remove-btn:hover {
  background: rgba(255, 107, 107, 0.2);
  color: #ff6b6b;
}

/* ===== ПУСТОЕ СОСТОЯНИЕ ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  color: rgba(255, 255, 255, 0.2);
}

.empty-state .hint {
  font-size: 12px;
  margin-top: 4px;
}

/* ===== ФУТЕР ===== */
.footer-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.copy-all-btn {
  padding: 6px 14px;
  background: rgba(255, 255, 255, 0.08);
  border: none;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s ease;
}

.copy-all-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}

.notes-count {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
}

/* ===== СКРОЛЛБАР ===== */
.notes-list::-webkit-scrollbar,
.panel-body::-webkit-scrollbar {
  width: 4px;
}

.notes-list::-webkit-scrollbar-track,
.panel-body::-webkit-scrollbar-track {
  background: transparent;
}

.notes-list::-webkit-scrollbar-thumb,
.panel-body::-webkit-scrollbar-thumb {
  background: rgba(255, 217, 61, 0.3);
  border-radius: 2px;
}

/* ===== СВЕТЛАЯ ТЕМА (если нужно) ===== */
.jeopardy-container.light .notes-panel {
  background: #fff;
  color: #1a1a2e;
}

.jeopardy-container.light .panel-header {
  background: rgba(0, 0, 0, 0.05);
}

.jeopardy-container.light .panel-header h3 {
  color: #4a6fa5;
}

.jeopardy-container.light .note-input {
  background: #f5f5f5;
  color: #1a1a2e;
  border-color: #ddd;
}

.jeopardy-container.light .note-input:focus {
  border-color: #4a6fa5;
}

.jeopardy-container.light .note-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.jeopardy-container.light .panel-actions button {
  color: rgba(0, 0, 0, 0.4);
}

.jeopardy-container.light .panel-actions button:hover {
  color: #1a1a2e;
}

/* ===== АДАПТИВНОСТЬ ===== */
@media (max-width: 600px) {
  .notes-panel {
    width: calc(100vw - 40px);
    right: 20px;
    bottom: 150px;
  }

  .input-area {
    flex-direction: column;
  }

  .add-btn {
    padding: 10px;
  }
}
</style>
