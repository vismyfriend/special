<!-- components/SpeechSynthesizer.vue -->
<template>
  <div style="display: none;">
    <!-- Невидимый компонент, только для функциональности -->
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Props для настройки компонента
const props = defineProps({
  // Голос по умолчанию
  defaultVoice: {
    type: String,
    default: 'google' // 'google', 'samantha', 'daniel', 'alex', 'albert', 'victoria'
  },
  randomVoiceEachTime: {
    type: Boolean,
    default: false
  },
  // Скорость речи (0.5 - 2)
  rate: {
    type: Number,
    default: 0.9
  },
  // Высота тона (0 - 2)
  pitch: {
    type: Number,
    default: 1
  },
  // Громкость (0 - 1)
  volume: {
    type: Number,
    default: 1
  },
  // Автоматически выбирать случайный голос при загрузке
  randomVoiceOnInit: {
    type: Boolean,
    default: false
  }
});

// Emits для событий
const emit = defineEmits(['speaking-start', 'speaking-end', 'speaking-error', 'voices-loaded']);

// Состояние
const isSpeaking = ref(false);
const availableVoices = ref([]);
const currentVoice = ref(null);
const synthesis = ref(null);
const isInitialized = ref(false);

// Настройки голосов
const voiceOptions = {
  google: ['Google UK English Male', 'Google UK English Female', 'Google US English'],
  samantha: ['Samantha'],
  daniel: ['Daniel'],
  alex: ['Alex'],
  albert: ['Albert'],
  victoria: ['Victoria', 'Karen', 'Catherine']
};

// Функция для загрузки доступных голосов
const loadVoices = () => {
  return new Promise((resolve) => {
    if (!window.speechSynthesis) {
      console.error('Web Speech API не поддерживается');
      resolve(false);
      return;
    }

    synthesis.value = window.speechSynthesis;

    const voices = synthesis.value.getVoices();
    if (voices.length) {
      availableVoices.value = voices;
      selectVoice(props.defaultVoice);
      isInitialized.value = true;
      emit('voices-loaded', voices);
      resolve(true);
    } else {
      window.speechSynthesis.onvoiceschanged = () => {
        availableVoices.value = synthesis.value.getVoices();
        selectVoice(props.defaultVoice);
        isInitialized.value = true;
        emit('voices-loaded', availableVoices.value);
        resolve(true);
      };
    }
  });
};

// Выбор голоса
const selectVoice = (voiceName) => {
  if (!availableVoices.value.length) return;

  const searchTerms = voiceOptions[voiceName] || [voiceName];

  let foundVoice = availableVoices.value.find(voice =>
    searchTerms.some(term =>
      voice.name.toLowerCase().includes(term.toLowerCase()) ||
      voice.lang.toLowerCase().includes(term.toLowerCase())
    )
  );

  // Если не нашли, берем любой английский голос
  if (!foundVoice) {
    foundVoice = availableVoices.value.find(voice =>
      voice.lang.startsWith('en') || voice.lang.startsWith('en-US')
    );
  }

  // Если все еще нет, берем первый доступный
  if (!foundVoice && availableVoices.value.length) {
    foundVoice = availableVoices.value[0];
  }

  currentVoice.value = foundVoice;
  console.log('Selected voice for speech:', currentVoice.value?.name);
  return currentVoice.value;
};

// Установка случайного голоса
const setRandomVoice = () => {
  const voiceKeys = Object.keys(voiceOptions);
  const randomKey = voiceKeys[Math.floor(Math.random() * voiceKeys.length)];
  selectVoice(randomKey);
  return randomKey;
};

// Основная функция произношения текста
const speak = (text, options = {}) => {
  return new Promise((resolve, reject) => {
    if (!text || !synthesis.value) {
      reject(new Error('Speech synthesis not available'));
      return;
    }

    // Если нужно менять голос каждый раз
    if (props.randomVoiceEachTime) {
      setRandomVoice();
    }

    // Останавливаем текущую речь, если она идет
    if (isSpeaking.value) {
      stop();
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Применяем голос
    if (options.voice) {
      utterance.voice = options.voice;
    } else if (currentVoice.value) {
      utterance.voice = currentVoice.value;
    }

    // Применяем настройки
    utterance.rate = options.rate ?? props.rate;
    utterance.pitch = options.pitch ?? props.pitch;
    utterance.volume = options.volume ?? props.volume;

    // Обработчики событий
    utterance.onstart = () => {
      isSpeaking.value = true;
      emit('speaking-start', text);
    };

    utterance.onend = () => {
      isSpeaking.value = false;
      emit('speaking-end', text);
      resolve();
    };

    utterance.onerror = (event) => {
      isSpeaking.value = false;
      emit('speaking-error', event);
      reject(event);
    };

    synthesis.value.speak(utterance);
  });
};

// Остановка речи
const stop = () => {
  if (synthesis.value && isSpeaking.value) {
    synthesis.value.cancel();
    isSpeaking.value = false;
  }
};

// Пауза
const pause = () => {
  if (synthesis.value && isSpeaking.value) {
    synthesis.value.pause();
  }
};

// Возобновление
const resume = () => {
  if (synthesis.value) {
    synthesis.value.resume();
  }
};

// Получить список доступных голосов
const getVoices = () => {
  return availableVoices.value;
};

// Получить текущий голос
const getCurrentVoice = () => {
  return currentVoice.value;
};

// Проверить, говорит ли сейчас
const getIsSpeaking = () => {
  return isSpeaking.value;
};

// Инициализация
onMounted(async () => {
  await loadVoices();

  if (props.randomVoiceOnInit) {
    const randomVoice = setRandomVoice();
    console.log('Random voice selected:', randomVoice);
  }
});

// Очистка при размонтировании
onBeforeUnmount(() => {
  if (synthesis.value && isSpeaking.value) {
    synthesis.value.cancel();
  }
});

// Экспортируем методы для использования в родительских компонентах
defineExpose({
  speak,
  stop,
  pause,
  resume,
  setRandomVoice,
  selectVoice,
  getVoices,
  getCurrentVoice,
  getIsSpeaking,
  isSpeaking,
  loadVoices
});
</script>
