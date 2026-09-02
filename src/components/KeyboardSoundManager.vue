<template>
  <div class="sound-manager">
    <!-- Кнопка-триггер -->
    <button
      class="sound-trigger"
      @click="togglePanel"
      :class="{ active: isPanelOpen }"
      title="Sound Manager (H)"
    >
      🔊
    </button>

    <!-- Панель -->
    <div v-if="isPanelOpen" class="sound-panel">
      <div class="panel-header">
        <h3>🎵 Sound Manager</h3>
        <button class="close-btn" @click="isPanelOpen = false">✕</button>
      </div>

      <div class="panel-body">
        <!-- Горячие клавиши -->
        <div class="shortcuts-section">
          <h4>⌨️ Keyboard Shortcuts</h4>

          <!-- Обычные клавиши -->
          <div class="shortcut-group">
            <div class="shortcut-group-label">Without modifiers:</div>
            <div class="shortcut-grid">
              <div
                v-for="sound in soundsWithoutModifier"
                :key="sound.id"
                class="shortcut-item"
              >
                <span class="key-badge">{{ sound.key }}</span>
                <span class="shortcut-label">{{ sound.label }}</span>
                <span class="sound-status">{{ sound.loaded ? '✅' : '❓' }}</span>
                <button
                  class="play-btn small"
                  @click="playSoundById(sound.id)"
                  :disabled="!sound.loaded"
                >▶</button>
              </div>
            </div>
          </div>

          <!-- Комбинации с модификаторами -->
          <div class="shortcut-group">
            <div class="shortcut-group-label">With modifiers:</div>
            <div class="shortcut-grid">
              <div
                v-for="sound in soundsWithModifier"
                :key="'mod-' + sound.id"
                class="shortcut-item"
              >
                <span class="key-badge">{{ getModifierDisplay(sound.modifierKey) }}+{{ sound.key }}</span>
                <span class="shortcut-label">{{ sound.label }}</span>
                <span class="sound-status">{{ sound.loaded ? '✅' : '❓' }}</span>
                <button
                  class="play-btn small"
                  @click="playSoundById(sound.id)"
                  :disabled="!sound.loaded"
                >▶</button>
              </div>
            </div>
          </div>
          <!-- Универсальная остановка -->
          <div class="shortcut-group stop-group">
            <div class="shortcut-group-label">Control:</div>
            <div class="shortcut-grid">
              <div class="shortcut-item stop-item">
                <span class="key-badge stop-key">⌫</span>
                <span class="shortcut-label stop-label">⏹️ Stop all sounds</span>
                <span class="sound-status">🔇</span>
              </div>
            </div>
          </div>

          <div class="shortcut-hint">
            <span class="hint-key">H</span> - Toggle panel
            <span class="hint-divider">|</span>
            <span class="hint-key">⌫</span> - Stop all sounds
          </div>
        </div>

        <!-- Настройки звуков -->
        <div class="sounds-section">
          <h4>🎛️ Sound Settings</h4>

          <div
            v-for="sound in soundList"
            :key="'settings-' + sound.id"
            class="sound-row"
          >
            <div class="sound-info">
              <span class="sound-status">{{ sound.loaded ? '✅' : '❓' }}</span>
              <span class="sound-icon">{{ sound.icon }}</span>
              <span class="sound-name">{{ sound.label }}</span>
              <span class="sound-key">
                {{ sound.modifierKey ? getModifierDisplay(sound.modifierKey) + '+' : '' }}{{ sound.key }}
              </span>
            </div>
            <div class="sound-controls">
              <input
                type="range"
                v-model="sound.volume"
                min="0"
                max="1"
                step="0.05"
                class="volume-slider"
                @input="updateVolume(sound.id, $event)"
              />
              <span class="volume-value">{{ Math.round(sound.volume * 100) }}%</span>
              <button
                class="play-btn"
                @click="playSoundById(sound.id)"
                :disabled="!sound.loaded"
              >▶</button>
              <button
                class="stop-btn"
                @click="stopSoundById(sound.id)"
                title="Stop this sound"
              >⏹</button>
            </div>
          </div>
        </div>

        <!-- Загрузка своих звуков -->
        <div class="upload-section">
          <h4>📁 Custom Sounds</h4>
          <div class="upload-grid">
            <div
              v-for="sound in soundList"
              :key="'upload-' + sound.id"
              class="upload-item"
            >
              <label class="upload-label">
                {{ sound.icon }} {{ sound.label }}
                <input
                  type="file"
                  accept="audio/*"
                  @change="handleSoundUpload(sound.id, $event)"
                  style="display: none"
                />
              </label>
              <span class="file-status" :class="{ loaded: sound.customUrl }">
                {{ sound.customUrl ? '✅' : '📁' }}
              </span>
            </div>
          </div>
        </div>

        <div class="actions-section">
          <button class="reset-btn" @click="resetToDefaults">🔄 Reset</button>
          <button class="reload-btn" @click="reloadAllSounds">🔄 Reload</button>
        </div>
      </div>
    </div>

    <!-- Аудио -->
    <audio
      v-for="sound in soundList"
      :key="'audio-' + sound.id"
      :ref="el => setAudioRef(sound.id, el)"
      :src="sound.customUrl || sound.defaultUrl"
      preload="auto"
      style="display: none"
      @error="sound.loaded = false"
      @canplaythrough="sound.loaded = true"
    ></audio>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue';

// ============ 🎵 КОНФИГ ЗВУКОВ ============
// key - всегда указывается (цифра, буква или символ)
// modifierKey - null (без модификатора) или 'Cmd', 'Ctrl', 'Shift', 'Alt', 'Cmd/Ctrl'
const soundConfigs = reactive([
  // Без модификаторов
  {
    id: 'correct',
    label: 'Correct!',
    icon: '✅',
    key: '1',
    modifierKey: null,
    defaultUrl: new URL("../assets/audio/keySoundPress.mp3", import.meta.url).href,
    volume: 0.8,
    customUrl: null,
    loaded: false
  },
  {
    id: 'wrong',
    label: 'Wrong',
    icon: '❌',
    key: '2',
    modifierKey: null,
    defaultUrl: new URL("../assets/audio/KeyboardSoundManagerSounds/ohNo.mp3", import.meta.url).href,
    volume: 0.7,
    customUrl: null,
    loaded: false
  },
  {
    id: 'boing',
    label: 'Boing!',
    icon: '🤡',
    key: '6',
    modifierKey: null,
    defaultUrl: new URL("../assets/audio/keySoundPress.mp3", import.meta.url).href,
    volume: 0.7,
    customUrl: null,
    loaded: false
  },

  // С модификаторами
  {
    id: 'applause',
    label: 'Applause',
    icon: '👏',
    key: '1',
    modifierKey: 'Cmd/Ctrl',     // Cmd+1 или Ctrl+1
    defaultUrl: new URL("../assets/audio/KeyboardSoundManagerSounds/ohNo.mp3", import.meta.url).href,
    volume: 0.9,
    customUrl: null,
    loaded: false
  },
  {
    id: 'buzzer',
    label: 'Buzzer',
    icon: '🔔',
    key: '2',
    modifierKey: 'Cmd/Ctrl',     // Cmd+2 или Ctrl+2
    defaultUrl: new URL("../assets/audio/keySoundPress.mp3", import.meta.url).href,
    volume: 0.8,
    customUrl: null,
    loaded: false
  },
  {
    id: 'win',
    label: 'Victory!',
    icon: '🏆',
    key: '3',
    modifierKey: 'Cmd/Ctrl',     // Cmd+3 или Ctrl+3
    defaultUrl: new URL("../assets/audio/keySoundPress.mp3", import.meta.url).href,
    volume: 0.9,
    customUrl: null,
    loaded: false
  },
  // Пример с Shift
  {
    id: 'shiftSound',
    label: 'Shift + S',
    icon: '🔊',
    key: 's',
    modifierKey: 'Shift',        // Shift + S
    defaultUrl: new URL("../assets/audio/keySoundPress.mp3", import.meta.url).href,
    volume: 0.8,
    customUrl: null,
    loaded: false
  },
  // Пример с Alt
  {
    id: 'altSound',
    label: 'Alt + A',
    icon: '🎵',
    key: 'a',
    modifierKey: 'Alt',          // Alt + A
    defaultUrl: new URL("../assets/audio/keySoundPress.mp3", import.meta.url).href,
    volume: 0.8,
    customUrl: null,
    loaded: false
  },
  // Пример с разными комбинациями на одну клавишу
  // 4 - обычный звук, Cmd+4 - другой звук
  {
    id: 'normal4',
    label: 'Number 4',
    icon: '4️⃣',
    key: '4',
    modifierKey: null,
    defaultUrl: new URL("../assets/audio/keySoundPress.mp3", import.meta.url).href,
    volume: 0.8,
    customUrl: null,
    loaded: false
  },
  {
    id: 'secret4',
    label: 'Secret 4!',
    icon: '🤫',
    key: '4',
    modifierKey: 'Cmd/Ctrl',     // Cmd+4 или Ctrl+4
    defaultUrl: new URL("../assets/audio/keySoundPress.mp3", import.meta.url).href,
    volume: 0.8,
    customUrl: null,
    loaded: false
  },
  {
    id: 'mySound',              // Уникальный ID
    label: 'My Sound!',         // Название
    icon: '🎵',                 // Эмодзи
    key: 'f',                   // Клавиша (буква, цифра, символ)
    modifierKey: null,          // null или 'Cmd', 'Ctrl', 'Shift', 'Alt', 'Cmd/Ctrl'
    defaultUrl: new URL("../assets/audio/keySoundPress.mp3", import.meta.url).href,
    volume: 0.8,
    customUrl: null,
    loaded: false
  }
]);

// Состояния
const isPanelOpen = ref(false);
const audioRefs = reactive({});
const isMac = ref(false);

// Список всех звуков
const soundList = computed(() => soundConfigs);

// Звуки без модификатора
const soundsWithoutModifier = computed(() =>
  soundConfigs.filter(s => s.modifierKey === null)
);

// Звуки с модификатором
const soundsWithModifier = computed(() =>
  soundConfigs.filter(s => s.modifierKey !== null)
);

// Загрузка сохраненных настроек
const loadSettings = () => {
  try {
    const saved = localStorage.getItem('soundManagerSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      soundConfigs.forEach(sound => {
        if (parsed[sound.id]) {
          sound.volume = parsed[sound.id].volume ?? sound.volume;
          sound.customUrl = parsed[sound.id].customUrl || null;
        }
      });
    }
  } catch (e) {}
};

// Сохранение
const saveSettings = () => {
  const settings = {};
  soundConfigs.forEach(sound => {
    settings[sound.id] = {
      volume: sound.volume,
      customUrl: sound.customUrl
    };
  });
  localStorage.setItem('soundManagerSettings', JSON.stringify(settings));
};

// Рефы
const setAudioRef = (id, el) => {
  if (el) audioRefs[id] = el;
};

// Воспроизведение по id
const playSoundById = (id) => {
  const audio = audioRefs[id];
  const sound = soundConfigs.find(s => s.id === id);
  if (!audio || !sound?.loaded) return;
  audio.currentTime = 0;
  audio.volume = sound.volume || 0.8;
  audio.play().catch(() => {});
};
// Остановка конкретного звука
const stopSoundById = (id) => {
  const audio = audioRefs[id];
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
};

// Остановка ВСЕХ звуков
const stopAllSounds = () => {
  Object.keys(audioRefs).forEach(id => {
    const audio = audioRefs[id];
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
  console.log('🔇 All sounds stopped');
};

// Обновление громкости
const updateVolume = (id, event) => {
  const sound = soundConfigs.find(s => s.id === id);
  if (sound) {
    sound.volume = parseFloat(event.target.value);
    saveSettings();
  }
};

// Загрузка своего звука
const handleSoundUpload = (id, event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const sound = soundConfigs.find(s => s.id === id);
      if (sound) {
        sound.customUrl = e.target.result;
        sound.loaded = true;
        saveSettings();
        if (audioRefs[id]) {
          audioRefs[id].src = e.target.result;
          audioRefs[id].load();
        }
      }
    };
    reader.readAsDataURL(file);
    event.target.value = '';
  }
};

// Перезагрузка
const reloadAllSounds = () => {
  soundConfigs.forEach(sound => {
    sound.loaded = false;
    if (audioRefs[sound.id]) {
      audioRefs[sound.id].src = sound.customUrl || sound.defaultUrl;
      audioRefs[sound.id].load();
    }
  });
};

// Сброс
const resetToDefaults = () => {
  if (confirm('Reset all sound settings?')) {
    soundConfigs.forEach(sound => {
      const defaultSound = soundConfigs.find(s => s.id === sound.id);
      if (defaultSound) {
        sound.volume = defaultSound.volume;
        sound.customUrl = null;
        sound.loaded = false;
        if (audioRefs[sound.id]) {
          audioRefs[sound.id].src = defaultSound.defaultUrl;
          audioRefs[sound.id].load();
        }
      }
    });
    saveSettings();
    localStorage.removeItem('soundManagerSettings');
  }
};

// Получить отображение модификатора
const getModifierDisplay = (modifier) => {
  if (!modifier) return '';
  if (modifier === 'Cmd/Ctrl') return isMac.value ? '⌘' : 'Ctrl';
  if (modifier === 'Cmd') return '⌘';
  if (modifier === 'Ctrl') return 'Ctrl';
  if (modifier === 'Shift') return '⇧';
  if (modifier === 'Alt') return '⌥';
  return modifier;
};

// 🔥 ОБРАБОТЧИК КЛАВИШ
const handleKeyPress = (event) => {
  // Backspace - остановить все звуки
  if (event.key === 'Backspace') {
    event.preventDefault();
    stopAllSounds();
    return;
  }

  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;

  const isMacPlatform = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const isCmd = event.metaKey;
  const isCtrl = event.ctrlKey;
  const isShift = event.shiftKey;
  const isAlt = event.altKey;

  // H - открыть панель
  if (event.key === 'h' || event.key === 'H') {
    event.preventDefault();
    isPanelOpen.value = !isPanelOpen.value;
    return;
  }

  // 🎯 Проверяем комбинации с модификаторами (приоритет выше)
  if (isCmd || isCtrl || isShift || isAlt) {
    // Определяем активный модификатор
    let activeModifier = null;
    if (isCmd) activeModifier = 'Cmd';
    else if (isCtrl) activeModifier = 'Ctrl';
    else if (isShift) activeModifier = 'Shift';
    else if (isAlt) activeModifier = 'Alt';

    // Ищем звук с этим модификатором
    const sound = soundConfigs.find(s => {
      if (!s.modifierKey) return false;
      if (s.modifierKey === 'Cmd/Ctrl') {
        return (isCmd || isCtrl) && s.key === event.key;
      }
      return s.modifierKey === activeModifier && s.key === event.key;
    });

    if (sound) {
      event.preventDefault();
      playSoundById(sound.id);
      console.log(`🎵 ${sound.id} (${getModifierDisplay(sound.modifierKey)}+${event.key})`);
      return;
    }
  }

  // 🎯 Обычная клавиша (без модификаторов)
  if (!isCmd && !isCtrl && !isShift && !isAlt) {
    const sound = soundConfigs.find(s => s.key === event.key && s.modifierKey === null);
    if (sound) {
      event.preventDefault();
      playSoundById(sound.id);
      console.log(`🎵 ${sound.id} (${event.key})`);
    }
  }


};

const togglePanel = () => { isPanelOpen.value = !isPanelOpen.value; };

onMounted(() => {
  isMac.value = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  loadSettings();
  window.addEventListener('keydown', handleKeyPress);
  console.log('🎵 Sound Manager loaded!');
  console.log(`⌨️ Available keys: ${soundConfigs.map(s => s.modifierKey ? `${getModifierDisplay(s.modifierKey)}+${s.key}` : s.key).join(', ')}`);
  console.log('⌨️ Press H for panel');
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});

// 🔥 ЭКСПОРТ МЕТОДОВ
const exposedMethods = {};
soundConfigs.forEach(sound => {
  const methodName = `play${sound.id.charAt(0).toUpperCase() + sound.id.slice(1)}`;
  exposedMethods[methodName] = () => playSoundById(sound.id);
});

defineExpose({
  ...exposedMethods,
  playSoundById,
  togglePanel,
  reloadAllSounds,
  stopAllSounds,
  stopSoundById,
  getSoundList: () => soundConfigs
});
</script>

<style scoped>
/* ============ ОБЩИЕ СТИЛИ ============ */
.sound-manager {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
}

.sound-trigger {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1a1a2e, #2d4059);
  border: 2px solid rgba(255, 217, 61, 0.3);
  color: #fff;
  font-size: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.sound-trigger:hover {
  transform: scale(1.1);
  border-color: #ffd93d;
}

.sound-trigger.active {
  border-color: #ffd93d;
}

/* ============ ПАНЕЛЬ ============ */
.sound-panel {
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 420px;
  max-height: 80vh;
  background: #1a1a2e;
  border: 2px solid rgba(255, 217, 61, 0.2);
  border-radius: 16px;
  box-shadow: 0 10px 60px rgba(0, 0, 0, 0.8);
  color: #fff;
  overflow: hidden;
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.panel-header h3 {
  margin: 0;
  font-size: 18px;
  color: #ffd93d;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  font-size: 20px;
  cursor: pointer;
  padding: 4px 8px;
  transition: all 0.3s ease;
}

.close-btn:hover {
  color: #fff;
  transform: rotate(90deg);
}

.panel-body {
  padding: 15px 20px;
  max-height: calc(80vh - 70px);
  overflow-y: auto;
}

/* ============ СЕКЦИИ ============ */
.shortcuts-section,
.sounds-section,
.upload-section,
.actions-section {
  margin-bottom: 15px;
}

.shortcuts-section h4,
.sounds-section h4,
.upload-section h4 {
  margin: 0 0 8px 0;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  padding-bottom: 6px;
}

.shortcut-group {
  margin-bottom: 10px;
}

.shortcut-group:last-child {
  margin-bottom: 0;
}

.shortcut-group-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 4px;
}

.shortcut-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.shortcut-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
}

.key-badge {
  background: #ffd93d;
  color: #1a1a2e;
  font-weight: bold;
  padding: 0 8px;
  border-radius: 4px;
  font-size: 12px;
  min-width: 24px;
  text-align: center;
}

.shortcut-label {
  font-size: 13px;
  flex: 1;
}

.sound-status {
  font-size: 14px;
  min-width: 24px;
  text-align: center;
}

.play-btn.small {
  width: 24px;
  height: 24px;
  font-size: 10px;
  padding: 0;
}

.play-btn.small:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.shortcut-hint {
  margin-top: 6px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
}

.hint-key {
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  padding: 0 8px;
  border-radius: 4px;
  font-weight: bold;
}

/* ============ ЗВУКИ ============ */
.sound-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

.sound-row:last-child {
  border-bottom: none;
}

.sound-info {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.sound-icon {
  font-size: 16px;
}

.sound-name {
  font-size: 13px;
}

.sound-key {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
  min-width: 60px;
}

.sound-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider {
  width: 80px;
  height: 4px;
  -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 2px;
  outline: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 14px;
  height: 14px;
  background: #ffd93d;
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 14px;
  height: 14px;
  background: #ffd93d;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.volume-value {
  font-size: 12px;
  min-width: 40px;
  color: rgba(255, 255, 255, 0.5);
}

.play-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 217, 61, 0.15);
  color: #ffd93d;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
}

.play-btn:hover:not(:disabled) {
  background: rgba(255, 217, 61, 0.3);
  transform: scale(1.1);
}

.play-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

/* ============ ЗАГРУЗКА ============ */
.upload-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px;
}

.upload-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 6px;
  font-size: 12px;
}

.upload-label {
  cursor: pointer;
  padding: 4px 0;
  transition: all 0.3s ease;
  flex: 1;
}

.upload-label:hover {
  color: #ffd93d;
}

.file-status {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.2);
}

.file-status.loaded {
  color: #51cf66;
}

/* ============ ДЕЙСТВИЯ ============ */
.actions-section {
  display: flex;
  gap: 6px;
}

.actions-section button {
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn {
  background: rgba(255, 107, 107, 0.15);
  color: #ff6b6b;
}

.reset-btn:hover {
  background: rgba(255, 107, 107, 0.25);
}

.reload-btn {
  background: rgba(255, 217, 61, 0.15);
  color: #ffd93d;
}

.reload-btn:hover {
  background: rgba(255, 217, 61, 0.25);
}

.stop-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 107, 107, 0.15);
  color: #ff6b6b;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
}

.stop-btn:hover {
  background: rgba(255, 107, 107, 0.3);
  transform: scale(1.1);
}

.stop-item {
  background: rgba(255, 107, 107, 0.05) !important;
  border: 1px solid rgba(255, 107, 107, 0.15);
}

.stop-key {
  background: #ff6b6b !important;
  color: #fff !important;
}

.stop-label {
  color: #ff6b6b !important;
}
/* ============ АДАПТИВНОСТЬ ============ */
@media (max-width: 600px) {
  .sound-panel {
    width: calc(100vw - 40px);
    right: 20px;
    bottom: 80px;
  }

  .shortcut-grid,
  .upload-grid {
    grid-template-columns: 1fr;
  }

  .sound-row {
    flex-wrap: wrap;
  }

  .volume-slider {
    flex: 1;
  }
}
</style>
