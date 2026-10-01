// src/composables/useSpeech.js
import { ref, onBeforeUnmount } from 'vue'

/**
 * Composable для озвучки текста через Web Speech API.
 *
 * Возможности:
 * - Рандомный выбор голоса из списка
 * - Фиксированный голос (выбранный)
 * - Поддержка английских и русских голосов
 * - filterLang: 'ru' / 'en' — ограничивает рандом и fallback нужным языком
 *   (можно задать при создании composable ИЛИ при вызове speak)
 * - Нормализация текста (убирает транскрипцию в /.../, [...], (...), неразрывные пробелы)
 * - Безопасная работа: если API недоступен — не крашится
 *
 * @param {Object} options
 * @param {string} options.defaultVoice - имя голоса по умолчанию (например, 'alex' или 'ru-google')
 * @param {boolean} options.randomByDefault - выбирать голос рандомно по умолчанию
 * @param {string|null} options.filterLang - 'ru' | 'en' | null — ограничить язык голосов
 * @param {boolean} options.normalize - нормализовать текст перед озвучкой (по умолчанию true)
 * @param {number} options.rate - скорость речи (0.1 - 10, по умолчанию 0.9)
 * @param {number} options.pitch - высота тона (0 - 2, по умолчанию 1)
 * @param {number} options.volume - громкость (0 - 1, по умолчанию 1)
 */
export function useSpeech(options = {}) {
  const {
    defaultVoice = 'alex',
    randomByDefault = false,
    filterLang = null,
    normalize = true,
    rate = 0.9,
    pitch = 1,
    volume = 1,
  } = options

  // ==================== СПИСОК ГОЛОСОВ ====================
  const VOICE_OPTIONS = [
    // 🇬🇧🇺🇸 Английские
    { label: '👨 Daniel (UK)', value: 'daniel', search: ['Daniel', 'Google UK English Male'], lang: 'en-GB' },
    { label: '👩 Samantha (US)', value: 'samantha', search: ['Samantha', 'Google US English Female'], lang: 'en-US' },
    { label: '👨 Alex (US)', value: 'alex', search: ['Alex', 'Google US English'], lang: 'en-US' },
    { label: '👨 Arthur (UK)', value: 'arthur', search: ['Arthur'], lang: 'en-GB' },
    { label: '👨 Albert', value: 'albert', search: ['Albert'], lang: 'en-US' },
    { label: '👩 Victoria', value: 'victoria', search: ['Victoria', 'Karen', 'Catherine', 'Martha'], lang: 'en-US' },

    // 🇷🇺 Русские (три самых популярных)
    { label: '🇷🇺 Google русский', value: 'ru-google', search: ['Google русский', 'Russian'], lang: 'ru-RU' },
    { label: '🇷🇺 Microsoft Irina', value: 'ru-irina', search: ['Irina', 'Microsoft Irina'], lang: 'ru-RU' },
    { label: '🇷🇺 Milena', value: 'ru-milena', search: ['Milena', 'Microsoft Milena'], lang: 'ru-RU' },
  ]

  // ==================== СОСТОЯНИЕ ====================
  const isMuted = ref(false)

  const availableVoices = ref([])
  const voicesLoaded = ref(false)
  const voicesError = ref(null)
  const isSpeaking = ref(false)
  const isSupported = ref(true)

  const currentVoiceName = ref(defaultVoice)
  const randomMode = ref(randomByDefault)
  const currentVoice = ref(null)

  // ==================== НОРМАЛИЗАЦИЯ ТЕКСТА ====================
  const normalizeText = (text) => {
    if (!text || typeof text !== 'string') return ''

    let result = text

    // 1. Удаляем // ... //
    result = result.replace(/\/\/[^\/]*\/\//g, '')

    // 2. Удаляем / ... /
    result = result.replace(/\/[^\/]*\//g, '')

    // 3. Удаляем [ ... ]
    result = result.replace(/\[[^\]]*\]/g, '')

    // 4. Удаляем ( ... )
    result = result.replace(/\([^)]*\)/g, '')

    // 5. Удаляем HTML-теги
    result = result.replace(/<[^>]*>/g, '')

    // 6. Заменяем все виды пробелов на обычный
    result = result.replace(/[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g, ' ')

    // 7. Удаляем невидимые символы
    result = result.replace(/[\u200B-\u200D\uFEFF]/g, '')

    // 8. Схлопываем множественные пробелы
    result = result.replace(/\s+/g, ' ')

    // 9. Обрезаем
    result = result.trim()

    return result
  }

  // ==================== ПРОВЕРКА ПОДДЕРЖКИ ====================
  const checkSupport = () => {
    if (typeof window === 'undefined') {
      isSupported.value = false
      voicesError.value = 'SSR: window не доступен'
      return false
    }
    if (!window.speechSynthesis) {
      isSupported.value = false
      voicesError.value = 'Web Speech API не поддерживается'
      console.warn('[useSpeech] Web Speech API не поддерживается в этом браузере')
      return false
    }
    if (typeof window.SpeechSynthesisUtterance === 'undefined') {
      isSupported.value = false
      voicesError.value = 'SpeechSynthesisUtterance не поддерживается'
      return false
    }
    return true
  }

  // ==================== ЗАГРУЗКА ГОЛОСОВ ====================
  const loadVoices = () => {
    return new Promise((resolve) => {
      if (!checkSupport()) {
        resolve(false)
        return
      }

      const timeout = setTimeout(() => {
        if (!voicesLoaded.value) {
          console.warn('[useSpeech] Таймаут загрузки голосов — используем fallback')
          voicesError.value = 'Не удалось загрузить голоса (таймаут)'
          voicesLoaded.value = true
          resolve(false)
        }
      }, 3000)

      const tryLoad = () => {
        try {
          const voices = window.speechSynthesis.getVoices()
          if (voices && voices.length) {
            availableVoices.value = voices
            voicesLoaded.value = true
            clearTimeout(timeout)
            console.log(`[useSpeech] Загружено ${voices.length} голосов`)
            resolve(true)
          } else {
            window.speechSynthesis.onvoiceschanged = () => {
              const v = window.speechSynthesis.getVoices()
              if (v && v.length) {
                availableVoices.value = v
                voicesLoaded.value = true
                clearTimeout(timeout)
                console.log(`[useSpeech] Загружено ${v.length} голосов (событие)`)
                resolve(true)
              }
            }
          }
        } catch (e) {
          console.error('[useSpeech] Ошибка загрузки голосов:', e)
          voicesError.value = e.message
          clearTimeout(timeout)
          voicesLoaded.value = true
          resolve(false)
        }
      }

      tryLoad()
    })
  }

  // ==================== ПОИСК ГОЛОСА ====================
  /**
   * Ищет голос по value (метке из VOICE_OPTIONS).
   * @param {string} value — например, 'alex' или 'ru-google'
   * @param {string|null} langOverride — переопределить filterLang (например, 'ru')
   */
  const findVoiceByValue = (value, langOverride = null) => {
    if (!availableVoices.value.length) return null

    const option = VOICE_OPTIONS.find(v => v.value === value)
    if (!option) return null

    const effectiveFilterLang = langOverride || filterLang

    // 1. Сначала ищем по имени (search) — это точнее для конкретных голосов
    const searchTerms = option.search || []
    let found = availableVoices.value.find(voice =>
      searchTerms.some(term =>
        voice.name.toLowerCase().includes(term.toLowerCase())
      )
    )
    if (found) return found

    // 2. Потом по lang из option
    if (option.lang) {
      const voiceByLang = availableVoices.value.find(v => v.lang === option.lang)
      if (voiceByLang) return voiceByLang
    }

    // 3. Fallback — ищем по filterLang, если задан
    if (effectiveFilterLang) {
      const fallbackByFilter = availableVoices.value.find(v =>
        v.lang.toLowerCase().startsWith(effectiveFilterLang.toLowerCase())
      )
      if (fallbackByFilter) return fallbackByFilter
    }

    // 4. Совсем fallback — любой английский
    return availableVoices.value.find(voice => voice.lang.startsWith('en')) || availableVoices.value[0]
  }

  // ==================== ВЫБОР ГОЛОСА ====================
  const setVoice = (voiceName) => {
    currentVoiceName.value = voiceName
    currentVoice.value = findVoiceByValue(voiceName)
    randomMode.value = false
    console.log('[useSpeech] Установлен голос:', currentVoice.value?.name)
  }

  /**
   * Возвращает случайный value из VOICE_OPTIONS.
   * Учитывает filterLang.
   */
  const getRandomVoiceValue = (langOverride = null) => {
    const effectiveFilterLang = langOverride || filterLang

    let pool = VOICE_OPTIONS
    if (effectiveFilterLang) {
      pool = VOICE_OPTIONS.filter(v =>
        v.lang && v.lang.toLowerCase().startsWith(effectiveFilterLang.toLowerCase())
      )
    }

    // Если после фильтра пусто — берём весь список
    if (!pool.length) pool = VOICE_OPTIONS

    const randomIndex = Math.floor(Math.random() * pool.length)
    return pool[randomIndex].value
  }

  /**
   * Выбирает случайный голос и устанавливает его как текущий.
   * Учитывает filterLang.
   */
  const pickRandomVoice = (langOverride = null) => {
    const value = getRandomVoiceValue(langOverride)
    currentVoiceName.value = value
    currentVoice.value = findVoiceByValue(value, langOverride)
    randomMode.value = true
    return value
  }

  // ==================== MUTE ====================
  const mute = () => {
    isMuted.value = true
    stop()  // останавливаем текущую речь
    console.log('[useSpeech] Звук выключен')
  }

  const unmute = () => {
    isMuted.value = false
    console.log('[useSpeech] Звук включён')
  }

  const toggleMute = () => {
    if (isMuted.value) {
      unmute()
    } else {
      mute()
    }
    return isMuted.value
  }

  // ==================== ОЗВУЧКА ====================
  const speak = (text, speakOptions = {}) => {
    return new Promise((resolve) => {
      if (!checkSupport()) {
        resolve(false)
        return
      }


      // Если звук выключен — молча выходим
      if (isMuted.value) {
        console.log('[useSpeech] Звук выключен — озвучка пропущена')
        resolve(false)
        return
      }


      if (!text || typeof text !== 'string') {
        console.warn('[useSpeech] Пустой текст для озвучки')
        resolve(false)
        return
      }

      // НОРМАЛИЗАЦИЯ
      const cleanText = normalize ? normalizeText(text) : text
      if (!cleanText) {
        console.warn('[useSpeech] После нормализации текст пуст:', text)
        resolve(false)
        return
      }

      // Отменяем предыдущую речь
      try {
        window.speechSynthesis.cancel()
      } catch (e) {
        // ignore
      }

      // filterLang можно переопределить в speakOptions
      const effectiveFilterLang = speakOptions.filterLang ?? filterLang

      // Выбираем голос
      let voiceToUse = currentVoice.value

      // 1. Если передан готовый объект голоса — используем его напрямую
      if (speakOptions.voiceObject) {
        voiceToUse = speakOptions.voiceObject
      }
      // 2. Если передан value — ищем по нему
      else if (speakOptions.voice) {
        voiceToUse = findVoiceByValue(speakOptions.voice, effectiveFilterLang)
      }
      // 3. Если random — берём случайный из VOICE_OPTIONS (с учётом filterLang)
      else if (speakOptions.random || randomMode.value) {
        pickRandomVoice(effectiveFilterLang)
        voiceToUse = currentVoice.value
      }

      if (!voiceToUse) {
        console.warn('[useSpeech] Голос не найден — озвучка пропущена')
        resolve(false)
        return
      }

      try {
        const utterance = new window.SpeechSynthesisUtterance(cleanText)
        utterance.voice = voiceToUse
        utterance.rate = speakOptions.rate ?? rate
        utterance.pitch = speakOptions.pitch ?? pitch
        utterance.volume = speakOptions.volume ?? volume
        utterance.lang = speakOptions.lang ?? voiceToUse.lang ?? 'en-US'

        isSpeaking.value = true

        utterance.onend = () => {
          isSpeaking.value = false
          resolve(true)
        }

        utterance.onerror = (e) => {
          console.warn('[useSpeech] Ошибка озвучки:', e)
          isSpeaking.value = false
          resolve(false)
        }

        window.speechSynthesis.speak(utterance)
      } catch (e) {
        console.error('[useSpeech] Критическая ошибка озвучки:', e)
        isSpeaking.value = false
        resolve(false)
      }
    })
  }

  // ==================== ОСТАНОВКА ====================
  const stop = () => {
    if (!checkSupport()) return
    try {
      window.speechSynthesis.cancel()
      isSpeaking.value = false
    } catch (e) {
      console.warn('[useSpeech] Ошибка остановки:', e)
    }
  }

  // ==================== ОЧИСТКА ====================
  onBeforeUnmount(() => {
    stop()
  })

  // ==================== ПУБЛИЧНЫЙ API ====================
  return {
    // Состояние
    isMuted,
    mute,
    unmute,
    toggleMute,
    availableVoices,
    voicesLoaded,
    voicesError,
    isSpeaking,
    isSupported,
    currentVoiceName,
    currentVoice,
    randomMode,
    filterLang,
    voiceOptions: VOICE_OPTIONS,

    // Методы
    loadVoices,
    setVoice,
    pickRandomVoice,
    speak,
    stop,
    findVoiceByValue,
    normalizeText,
  }


}
