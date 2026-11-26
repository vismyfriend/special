<template>
  <div class="sound-widget">
    <!-- Переключатель ON/OFF -->
    <button
      class="toggle-btn"
      :class="{ on: enabled }"
      @click="toggleEnabled"
      :title="enabled ? 'Sound system: ON' : 'Sound system: OFF'"
    >
      <span class="toggle-track">
        <span class="toggle-knob"></span>
      </span>
      <span class="toggle-label">{{ enabled ? 'ON' : 'OFF' }}</span>
    </button>

    <!-- Шестерёнка — ведёт на страницу SoundManagerPage -->
    <button
      class="gear-btn"
      @click="goToSoundManager"
      title="Open Sound Manager"
    >
      ⚙️
    </button>

    <!-- Аудио-элементы (скрытые) — они нужны для воспроизведения звуков с любой страницы -->
    <audio
      v-for="sound in soundConfigs"
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
import { soundManagerState, soundConfigs, playSoundById, stopAllSounds, stopSoundById } from 'src/composables/useSoundManager';
import { useRouter } from 'vue-router';

const router = useRouter();
const audioRefs = reactive({});

const enabled = computed(() => soundManagerState.enabled);

// Рефы к аудио
const setAudioRef = (id, el) => {
  if (el) audioRefs[id] = el;
};

// Включение / выключение
const toggleEnabled = () => {
  soundManagerState.enabled = !soundManagerState.enabled;
  localStorage.setItem('soundManagerEnabled', String(soundManagerState.enabled));
  if (!soundManagerState.enabled) stopAllSounds(audioRefs);
};

// Переход на страницу Sound Manager
const goToSoundManager = () => {
  router.push('/sound-manager');
};

// 🔥 Обработчик клавиш (работает глобально, пока виджет смонтирован)
const handleKeyPress = (event) => {
  if (!soundManagerState.enabled) return;

  if (event.key === 'Escape') {
    event.preventDefault();
    stopAllSounds(audioRefs);
    return;
  }

  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;

  const isCmd = event.metaKey;
  const isCtrl = event.ctrlKey;
  const isShift = event.shiftKey;
  const isAlt = event.altKey;

  // H - открыть страницу Sound Manager
  if (event.key === 'h' || event.key === 'H') {
    if (!isCmd && !isCtrl && !isShift && !isAlt) {
      event.preventDefault();
      goToSoundManager();
      return;
    }
  }

  // С модификаторами
  if (isCmd || isCtrl || isShift || isAlt) {
    let activeModifier = null;
    if (isCmd) activeModifier = 'Cmd';
    else if (isCtrl) activeModifier = 'Ctrl';
    else if (isShift) activeModifier = 'Shift';
    else if (isAlt) activeModifier = 'Alt';

    const sound = soundConfigs.find(s => {
      if (!s.modifierKey) return false;
      if (s.modifierKey === 'Cmd/Ctrl') {
        return (isCmd || isCtrl) && s.key === event.key;
      }
      return s.modifierKey === activeModifier && s.key === event.key;
    });

    if (sound) {
      event.preventDefault();
      playSoundById(sound.id, audioRefs);
      return;
    }
  }

  // Без модификаторов
  if (!isCmd && !isCtrl && !isShift && !isAlt) {
    const sound = soundConfigs.find(s => s.key === event.key && s.modifierKey === null);
    if (sound) {
      event.preventDefault();
      playSoundById(sound.id, audioRefs);
    }
  }
};

onMounted(() => {
  // Загружаем сохранённое состояние ON/OFF
  const saved = localStorage.getItem('soundManagerEnabled');
  if (saved !== null) soundManagerState.enabled = saved === 'true';
  window.addEventListener('keydown', handleKeyPress);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress);
});

// Экспорт методов для использования из родителя
defineExpose({
  playSoundById: (id) => playSoundById(id, audioRefs),
  stopAllSounds: () => stopAllSounds(audioRefs),
  stopSoundById: (id) => stopSoundById(id, audioRefs),
  getSoundList: () => soundConfigs,
  toggleEnabled,
});
</script>

<style scoped>
.sound-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 10px;
  background: linear-gradient(135deg, #1a1a2e, #2d4059);
  border: 2px solid rgba(255, 217, 61, 0.3);
  border-radius: 40px;
  padding: 8px 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  transition: border-color 0.3s ease;
}
.sound-widget:hover {
  border-color: #ffd93d;
}

/* Тумблер */
.toggle-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  cursor: pointer;
  color: #fff;
  padding: 0;
}
.toggle-track {
  position: relative;
  width: 40px;
  height: 22px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  transition: background 0.3s ease;
}
.toggle-btn.on .toggle-track {
  background: #51cf66;
}
.toggle-knob {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 16px;
  height: 16px;
  background: #fff;
  border-radius: 50%;
  transition: transform 0.3s ease;
}
.toggle-btn.on .toggle-knob {
  transform: translateX(18px);
}
.toggle-label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.7);
  min-width: 26px;
  text-align: left;
}
.toggle-btn.on .toggle-label {
  color: #51cf66;
}

/* Шестерёнка */
.gear-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 217, 61, 0.15);
  color: #ffd93d;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.gear-btn:hover {
  background: rgba(255, 217, 61, 0.3);
  transform: rotate(45deg) scale(1.05);
}
</style>
