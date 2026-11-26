import { reactive } from 'vue';

// Глобальное состояние
export const soundManagerState = reactive({
  enabled: true,
});

// Конфиг звуков (тот же, что у тебя был)
export const soundConfigs = reactive([
  {
    id: 'correct', label: 'Correct!', icon: '✅', key: '1', modifierKey: null,
    defaultUrl: new URL('../assets/audio/keySoundPress.mp3', import.meta.url).href,
    volume: 0.8, customUrl: null, loaded: false
  },
  {
    id: 'wrong', label: 'Wrong', icon: '❌', key: '2', modifierKey: null,
    defaultUrl: new URL('../assets/audio/KeyboardSoundManagerSounds/ohNoLong.mp3', import.meta.url).href,
    volume: 0.7, customUrl: null, loaded: false
  },
  {
    id: 'boing', label: 'Boing!', icon: '🤡', key: '6', modifierKey: null,
    defaultUrl: new URL('../assets/audio/keySoundPress.mp3', import.meta.url).href,
    volume: 0.7, customUrl: null, loaded: false
  },
  {
    id: 'applause', label: 'Applause', icon: '👏', key: '1', modifierKey: 'Cmd/Ctrl',
    defaultUrl: new URL('../assets/audio/KeyboardSoundManagerSounds/ohNoLong.mp3', import.meta.url).href,
    volume: 0.9, customUrl: null, loaded: false
  },
  {
    id: 'buzzer', label: 'Buzzer', icon: '🔔', key: '2', modifierKey: 'Cmd/Ctrl',
    defaultUrl: new URL('../assets/audio/keySoundPress.mp3', import.meta.url).href,
    volume: 0.8, customUrl: null, loaded: false
  },
  {
    id: 'win', label: 'Victory!', icon: '🏆', key: '3', modifierKey: 'Cmd/Ctrl',
    defaultUrl: new URL('../assets/audio/keySoundPress.mp3', import.meta.url).href,
    volume: 0.9, customUrl: null, loaded: false
  },
  {
    id: 'shiftSound', label: 'Shift + S', icon: '🔊', key: 's', modifierKey: 'Shift',
    defaultUrl: new URL('../assets/audio/keySoundPress.mp3', import.meta.url).href,
    volume: 0.8, customUrl: null, loaded: false
  },
  {
    id: 'altSound', label: 'Alt + A', icon: '🎵', key: 'a', modifierKey: 'Alt',
    defaultUrl: new URL('../assets/audio/keySoundPress.mp3', import.meta.url).href,
    volume: 0.8, customUrl: null, loaded: false
  },
  {
    id: 'normal4', label: 'Number 4', icon: '4️⃣', key: '4', modifierKey: null,
    defaultUrl: new URL('../assets/audio/keySoundPress.mp3', import.meta.url).href,
    volume: 0.8, customUrl: null, loaded: false
  },
  {
    id: 'secret4', label: 'Secret 4!', icon: '🤫', key: '4', modifierKey: 'Cmd/Ctrl',
    defaultUrl: new URL('../assets/audio/keySoundPress.mp3', import.meta.url).href,
    volume: 0.8, customUrl: null, loaded: false
  },
  {
    id: 'mySound', label: 'My Sound!', icon: '🎵', key: 'f', modifierKey: null,
    defaultUrl: new URL('../assets/audio/keySoundPress.mp3', import.meta.url).href,
    volume: 0.8, customUrl: null, loaded: false
  }
]);

// Работа с localStorage
export function loadSettings() {
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
}

export function saveSettings() {
  const settings = {};
  soundConfigs.forEach(sound => {
    settings[sound.id] = {
      volume: sound.volume,
      customUrl: sound.customUrl,
    };
  });
  localStorage.setItem('soundManagerSettings', JSON.stringify(settings));
}

// Воспроизведение / остановка
export function playSoundById(id, audioRefs) {
  if (!soundManagerState.enabled) return;
  const audio = audioRefs[id];
  const sound = soundConfigs.find(s => s.id === id);
  if (!audio || !sound?.loaded) return;
  audio.currentTime = 0;
  audio.volume = sound.volume || 0.8;
  audio.play().catch(() => {});
}

export function stopSoundById(id, audioRefs) {
  const audio = audioRefs[id];
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
}

export function stopAllSounds(audioRefs) {
  Object.keys(audioRefs).forEach(id => {
    const audio = audioRefs[id];
    if (audio && !audio.paused) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
}
