<template>
  <div class="voice-diagnostic q-pa-md">
    <q-card class="q-pa-md">
      <div class="text-h6 q-mb-md">🔍 Диагностика голосов в браузере</div>

      <q-btn
        @click="showAvailableVoices"
        color="primary"
        label="Показать все доступные голоса"
        class="q-mb-md"
      />

      <div v-if="voicesList.length > 0" class="q-mt-md">
        <div class="text-subtitle1 q-mb-sm">Доступные голоса ({{ voicesList.length }}):</div>
        <div class="voice-list" style="max-height: 400px; overflow-y: auto;">
          <div
            v-for="(voice, idx) in voicesList"
            :key="idx"
            class="voice-item q-pa-sm q-mb-xs"
            :style="{ borderLeft: `3px solid ${voice.gender === 'male' ? '#2196F3' : '#E91E63'}` }"
          >
            <div><strong>{{ voice.name }}</strong></div>
            <div class="text-caption text-grey-7">
              Язык: {{ voice.lang }} |
              Пол: {{ voice.gender === 'male' ? '👨 Мужской' : '👩 Женский' }} |
              По умолчанию: {{ voice.default ? 'Да' : 'Нет' }}
            </div>
            <q-btn
              size="sm"
              flat
              icon="play_arrow"
              @click="testVoice(voice)"
              label="Тест"
            />
          </div>
        </div>
      </div>

      <div v-else-if="loading" class="q-mt-md text-center">
        <q-spinner color="primary" size="md" />
        <div>Загрузка голосов...</div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const voicesList = ref([])
const loading = ref(false)

const showAvailableVoices = () => {
  loading.value = true
  const voices = window.speechSynthesis.getVoices()

  if (voices.length) {
    voicesList.value = voices.map(voice => ({
      name: voice.name,
      lang: voice.lang,
      default: voice.default,
      gender: voice.name.toLowerCase().includes('male') ? 'male' :
        voice.name.toLowerCase().includes('female') ? 'female' : 'unknown'
    }))
    loading.value = false

    console.log('Все доступные голоса:', voicesList.value)
    $q.notify({
      type: 'info',
      message: `Найдено ${voices.length} голосов`,
      timeout: 2000
    })
  } else {
    // Если голоса еще не загружены, ждем
    window.speechSynthesis.onvoiceschanged = () => {
      const newVoices = window.speechSynthesis.getVoices()
      voicesList.value = newVoices.map(voice => ({
        name: voice.name,
        lang: voice.lang,
        default: voice.default,
        gender: voice.name.toLowerCase().includes('male') ? 'male' :
          voice.name.toLowerCase().includes('female') ? 'female' : 'unknown'
      }))
      loading.value = false
      console.log('Все доступные голоса (после загрузки):', voicesList.value)
      $q.notify({
        type: 'info',
        message: `Найдено ${newVoices.length} голосов`,
        timeout: 2000
      })
    }
  }
}

const testVoice = (voice) => {
  const utterance = new SpeechSynthesisUtterance("Hello! This is a test of this voice. How does it sound?")

  // Находим оригинальный объект голоса
  const originalVoice = window.speechSynthesis.getVoices().find(v => v.name === voice.name)
  if (originalVoice) {
    utterance.voice = originalVoice
  }

  utterance.rate = 0.9
  utterance.onstart = () => {
    $q.notify({
      type: 'info',
      message: `Тестируем голос: ${voice.name}`,
      timeout: 1500
    })
  }
  utterance.onerror = () => {
    $q.notify({
      type: 'negative',
      message: 'Ошибка воспроизведения голоса',
      timeout: 2000
    })
  }

  window.speechSynthesis.speak(utterance)
}

onMounted(() => {
  // Автоматически показываем голоса при загрузке
  showAvailableVoices()
})
</script>

<style scoped>
.voice-item {
  background: rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  margin-bottom: 8px;
}
</style>
