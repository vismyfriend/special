<template>
  <div class="sound-page">
    <div class="page-header">
      <h1>🎵 Sound Manager</h1>
      <div class="header-actions">
        <div class="status-badge" :class="{ on: enabled }">
          {{ enabled ? 'SYSTEM ON' : 'SYSTEM OFF' }}
        </div>
        <button class="action-btn" @click="toggleEnabled">
          {{ enabled ? '⏸ Disable' : '▶ Enable' }}
        </button>
        <button class="action-btn" @click="$router.back()">← Back</button>
      </div>
    </div>

    <div class="page-body">
      <!-- Секция горячих клавиш -->
      <section class="section">
        <h2>⌨️ Keyboard Shortcuts</h2>

        <div class="shortcut-group">
          <div class="group-label">Without modifiers:</div>
          <div class="shortcut-grid">
            <div v-for="sound in soundsWithoutModifier" :key="sound.id" class="shortcut-item">
              <span class="key-badge">{{ sound.key }}</span>
              <span class="shortcut-label">{{ sound.label }}</span>
              <span class="sound-status">{{ sound.loaded ? '✅' : '❓' }}</span>
              <button class="play-btn small" @click="playSoundById(sound.id)" :disabled="!sound.loaded">▶</button>
            </div>
          </div>
        </div>

        <div class="shortcut-group">
          <div class="group-label">With modifiers:</div>
          <div class="shortcut-grid">
            <div v-for="sound in soundsWithModifier" :key="'mod-' + sound.id" class="shortcut-item">
              <span class="key-badge">{{ getModifierDisplay(sound.modifierKey) }}+{{ sound.key }}</span>
              <span class="shortcut-label">{{ sound.label }}</span>
              <span class="sound-status">{{ sound.loaded ? '✅' : '❓' }}</span>
              <button class="play-btn small" @click="playSoundById(sound.id)" :disabled="!sound.loaded">▶</button>
            </div>
          </div>
        </div>

        <div class="shortcut-group stop-group">
          <div class="group-label">Control:</div>
          <div class="shortcut-grid">
            <div class="shortcut-item stop-item">
              <span class="key-badge stop-key">⌫</span>
              <span class="shortcut-label stop-label">⏹️ Stop all sounds</span>
              <span class="sound-status">🔇</span>
            </div>
          </div>
        </div>

        <div class="shortcut-hint">
          <span class="hint-key">H</span> — Open this page
          <span class="hint-divider">|</span>
          <span class="hint-key">⌫</span> — Stop all sounds
        </div>
      </section>

      <!-- Настройки звуков -->
      <section class="section">
        <h2>🎛️ Sound Settings</h2>
        <div v-for="sound in soundList" :key="'settings-' + sound.id" class="sound-row">
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
              min="0" max="1" step="0.05"
              class="volume-slider"
              @input="onVolumeChange(sound.id, $event)"
            />
            <span class="volume-value">{{ Math.round(sound.volume * 100) }}%</span>
            <button class="play-btn" @click="playSoundById(sound.id)" :disabled="!sound.loaded">▶</button>
            <button class="stop-btn" @click="stopSoundById(sound.id)" title="Stop this sound">⏹</button>
          </div>
        </div>
      </section>

      <!-- Загрузка своих звуков -->
      <section class="section">
        <h2>📁 Custom Sounds</h2>
        <div class="upload-grid">
          <div v-for="sound in soundList" :key="'upload-' + sound.id" class="upload-item">
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
      </section>

      <section class="section actions-section">
        <button class="reset-btn" @click="resetToDefaults">🔄 Reset</button>
        <button class="reload-btn" @click="reloadAllSounds">🔄 Reload</button>
        <button class="stop-all-btn" @click="stopAll">⏹ Stop all</button>
      </section>
    </div>

    <!-- Скрытые аудио -->
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
import {
  soundManagerState,
  soundConfigs,
  loadSettings,
  saveSettings,
  playSoundById,
  stopSoundById,
  stopAllSounds,
} from 'src/composables/useSoundManager';

const audioRefs = reactive({});
const isMac = ref(false);

const enabled = computed(() => soundManagerState.enabled);
const soundList = computed(() => soundConfigs);
const soundsWithoutModifier = computed(() => soundConfigs.filter(s => s.modifierKey === null));
const soundsWithModifier = computed(() => soundConfigs.filter(s => s.modifierKey !== null));

const setAudioRef = (id, el) => {
  if (el) audioRefs[id] = el;
};

const toggleEnabled = () => {
  soundManagerState.enabled = !soundManagerState.enabled;
  localStorage.setItem('soundManagerEnabled', String(soundManagerState.enabled));
  if (!soundManagerState.enabled) stopAllSounds(audioRefs);
};

const play = (id) => playSoundById(id, audioRefs);
const stop = (id) => stopSoundById(id, audioRefs);
const stopAll = () => stopAllSounds(audioRefs);

const onVolumeChange = (id, event) => {
  const sound = soundConfigs.find(s => s.id === id);
  if (sound) {
    sound.volume = parseFloat(event.target.value);
    saveSettings();
  }
};

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

const reloadAllSounds = () => {
  soundConfigs.forEach(sound => {
    sound.loaded = false;
    if (audioRefs[sound.id]) {
      audioRefs[sound.id].src = sound.customUrl || sound.defaultUrl;
      audioRefs[sound.id].load();
    }
  });
};

const resetToDefaults = () => {
  if (confirm('Reset all sound settings?')) {
    soundConfigs.forEach(sound => {
      sound.volume = 0.8;
      sound.customUrl = null;
      sound.loaded = false;
      if (audioRefs[sound.id]) {
        audioRefs[sound.id].src = sound.defaultUrl;
        audioRefs[sound.id].load();
      }
    });
    saveSettings();
    localStorage.removeItem('soundManagerSettings');
  }
};

const getModifierDisplay = (modifier) => {
  if (!modifier) return '';
  if (modifier === 'Cmd/Ctrl') return isMac.value ? '⌘' : 'Ctrl';
  if (modifier === 'Cmd') return '⌘';
  if (modifier === 'Ctrl') return 'Ctrl';
  if (modifier === 'Shift') return '⇧';
  if (modifier === 'Alt') return '⌥';
  return modifier;
};

// Горячие клавиши работают и на этой странице
const handleKeyPress = (event) => {
  if (!soundManagerState.enabled) return;
  if (event.key === 'Escape') {
    event.preventDefault();
    stopAll();
    return;
  }
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;

  const isCmd = event.metaKey, isCtrl = event.ctrlKey, isShift = event.shiftKey, isAlt = event.altKey;

  if (isCmd || isCtrl || isShift || isAlt) {
    let activeModifier = null;
    if (isCmd) activeModifier = 'Cmd';
    else if (isCtrl) activeModifier = 'Ctrl';
    else if (isShift) activeModifier = 'Shift';
    else if (isAlt) activeModifier = 'Alt';

    const sound = soundConfigs.find(s => {
      if (!s.modifierKey) return false;
      if (s.modifierKey === 'Cmd/Ctrl') return (isCmd || isCtrl) && s.key === event.key;
      return s.modifierKey === activeModifier && s.key === event.key;
    });
    if (sound) {
      event.preventDefault();
      play(sound.id);
      return;
    }
  }

  if (!isCmd && !isCtrl && !isShift && !isAlt) {
    const sound = soundConfigs.find(s => s.key === event.key && s.modifierKey === null);
    if (sound) {
      event.preventDefault();
      play(sound.id);
    }
  }
};

onMounted(() => {
  isMac.value = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  loadSettings();
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});
</script>

<style scoped>
.sound-page {
  min-height: 100vh;
  background: radial-gradient(ellipse at center, #0a0a0f 0%, #000 100%);
  color: #fff;
  padding: 30px 20px;
  font-family: 'Courier New', monospace;
  box-sizing: border-box;
}
.page-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  max-width: 900px;
  margin: 0 auto 24px;
}
.page-header h1 {
  margin: 0;
  color: #ffd93d;
  font-size: 24px;
  letter-spacing: 2px;
}
.header-actions {
  display: flex;
  gap: 10px;
  align-items: center;
}
.status-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  letter-spacing: 1px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.5);
}
.status-badge.on {
  color: #51cf66;
  border-color: rgba(81, 207, 102, 0.4);
}
.action-btn {
  padding: 6px 14px;
  border-radius: 8px;
  border: 1px solid rgba(255, 217, 61, 0.3);
  background: rgba(255, 217, 61, 0.1);
  color: #ffd93d;
  cursor: pointer;
  font-family: inherit;
  font-size: 12px;
  transition: all 0.3s ease;
}
.action-btn:hover {
  background: rgba(255, 217, 61, 0.25);
}

.page-body {
  max-width: 900px;
  margin: 0 auto;
}

.section {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 18px 20px;
  margin-bottom: 18px;
}
.section h2 {
  margin: 0 0 14px;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 1px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 8px;
}

.shortcut-group { margin-bottom: 14px; }
.group-label { font-size: 12px; color: rgba(255, 255, 255, 0.4); margin-bottom: 6px; }
.shortcut-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 6px;
}
.shortcut-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 10px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
}
.key-badge {
  background: #ffd93d;
  color: #1a1a2e;
  font-weight: bold;
  padding: 2px 10px;
  border-radius: 4px;
  font-size: 12px;
  min-width: 30px;
  text-align: center;
}
.shortcut-label { flex: 1; font-size: 13px; }
.sound-status { min-width: 22px; text-align: center; }

.shortcut-hint {
  margin-top: 10px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
}
.hint-key {
  background: rgba(255, 255, 255, 0.1);
  padding: 1px 8px;
  border-radius: 4px;
  font-weight: bold;
}
.hint-divider { margin: 0 8px; }

.sound-row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}
.sound-row:last-child { border-bottom: none; }
.sound-info { display: flex; align-items: center; gap: 8px; flex: 1; min-width: 200px; }
.sound-icon { font-size: 16px; }
.sound-name { font-size: 13px; }
.sound-key { font-size: 11px; color: rgba(255, 255, 255, 0.35); }
.sound-controls { display: flex; align-items: center; gap: 8px; }
.volume-slider {
  width: 100px; height: 4px; -webkit-appearance: none;
  background: rgba(255, 255, 255, 0.15); border-radius: 2px; outline: none; cursor: pointer;
}
.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none; width: 14px; height: 14px;
  background: #ffd93d; border-radius: 50%; cursor: pointer;
}
.volume-slider::-moz-range-thumb {
  width: 14px; height: 14px; background: #ffd93d;
  border-radius: 50%; cursor: pointer; border: none;
}
.volume-value { font-size: 12px; min-width: 38px; color: rgba(255, 255, 255, 0.5); }

.play-btn {
  width: 32px; height: 32px; border-radius: 50%; border: none;
  background: rgba(255, 217, 61, 0.15); color: #ffd93d; cursor: pointer;
  font-size: 12px; transition: all 0.3s ease;
}
.play-btn:hover:not(:disabled) { background: rgba(255, 217, 61, 0.3); transform: scale(1.1); }
.play-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.play-btn.small { width: 24px; height: 24px; font-size: 10px; }
.stop-btn {
  width: 32px; height: 32px; border-radius: 50%; border: none;
  background: rgba(255, 107, 107, 0.15); color: #ff6b6b;
  cursor: pointer; font-size: 12px; transition: all 0.3s ease;
}
.stop-btn:hover { background: rgba(255, 107, 107, 0.3); transform: scale(1.1); }

.upload-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 6px;
}
.upload-item {
  display: flex; align-items: center; justify-content: space-between;
  padding: 6px 10px; background: rgba(255, 255, 255, 0.03);
  border-radius: 8px; font-size: 12px;
}
.upload-label { cursor: pointer; flex: 1; transition: color 0.3s ease; }
.upload-label:hover { color: #ffd93d; }
.file-status { font-size: 14px; color: rgba(255, 255, 255, 0.2); }
.file-status.loaded { color: #51cf66; }

.actions-section { display: flex; gap: 8px; }
.actions-section button {
  padding: 8px 16px; border: none; border-radius: 8px;
  font-size: 12px; cursor: pointer; font-family: inherit;
  transition: all 0.3s ease;
}
.reset-btn { background: rgba(255, 107, 107, 0.15); color: #ff6b6b; }
.reset-btn:hover { background: rgba(255, 107, 107, 0.3); }
.reload-btn { background: rgba(255, 217, 61, 0.15); color: #ffd93d; }
.reload-btn:hover { background: rgba(255, 217, 61, 0.3); }
.stop-all-btn { background: rgba(255, 107, 107, 0.15); color: #ff6b6b; }
.stop-all-btn:hover { background: rgba(255, 107, 107, 0.3); }

.stop-item { background: rgba(255, 107, 107, 0.05) !important; border: 1px solid rgba(255, 107, 107, 0.15); }
.stop-key { background: #ff6b6b !important; color: #fff !important; }
.stop-label { color: #ff6b6b !important; }

@media (max-width: 600px) {
  .shortcut-grid, .upload-grid { grid-template-columns: 1fr; }
  .sound-row { flex-direction: column; align-items: flex-start; }
}
</style>
