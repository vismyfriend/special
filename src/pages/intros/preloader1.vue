<template>
  <div class="detective-preloader" v-if="isVisible">
    <div class="magnifying-glass">
      <div class="glass">
        <div class="glass-inner"></div>
      </div>
      <div class="handle"></div>
    </div>
    <div class="loading-text">
      <span class="text">{{ currentPhrase }}</span>
      <span class="dots">
        <span class="dot">.</span>
        <span class="dot">.</span>
        <span class="dot">.</span>
      </span>
    </div>
    <div class="percentage-display">
      loading
      {{ currentPercentage }}% загрузка
    </div>
    <!-- Скрытый элемент для сброса курсора -->
    <div class="cursor-helper"></div>
  </div>
</template>

<script>
export default {
  name: 'DetectivePreloader',
  props: {
    // Автоматически скрывать прелоадер при завершении анимации
    autoHide: {
      type: Boolean,
      default: true
    },
    // Минимальное время показа (мс)
    minDisplayTime: {
      type: Number,
      default: 4000
    },
    // Скрывать сразу при вызове hide()
    immediateHide: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currentPercentage: 2.12,
      currentPhrase: 'INVESTIGATING',
      isVisible: true,
      // Настройки прогресса: [начальный %, конечный %, длительность(ms)]
      progressStages: [
        [2.12, 12.12, 2000],   // 2 сек
        [12.12, 22.98, 3000],  // 3 сек
        [22.98, 40.14, 2000],  // 2 сек
        [40.14, 68.77, 2000],  // 2 сек
        [68.77, 98.89, 4500],  // 4.5 сек
        [98.89, 99.98, 3000]   // 3 сек
      ],
      // Массив фраз с возможностью легко добавлять новые
      phrases: [
        'HELLO FROM VINCENT',
        'YOU ARE SPECIAL',
        'WELCOME BACK',
        'IT IS A GOOD DAY TODAY',
        'YOUR TEACHER LIKES YOU',
        'HOMEWORK ? KAKAYA ESHE HOMEWORK ? NE NADO NAM TAKOGO',
        'HOW ARE YOU TODAY?',
        'ALCO-COCA-COLICK',
        'SECURITY CHECK',
      ],
      currentStage: 0,
      animationStartTime: null,
      animationFrame: null,
      startTimestamp: null
    }
  },
  mounted() {
    this.startTimestamp = Date.now()
    this.setCurrentPhrase()
    this.startPercentageAnimation()
  },
  beforeUnmount() {
    this.cleanup()
  },
  methods: {
    /**
     * Очистка анимации
     */
    cleanup() {
      if (this.animationFrame) {
        cancelAnimationFrame(this.animationFrame)
        this.animationFrame = null
      }
    },

    /**
     * Плавное скрытие прелоадера
     */
    async hide() {
      if (this.immediateHide) {
        this.isVisible = false
        this.cleanup()
        return
      }

      // Гарантируем минимальное время показа
      const elapsed = Date.now() - this.startTimestamp
      const remainingTime = Math.max(0, this.minDisplayTime - elapsed)

      if (remainingTime > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingTime))
      }

      // Плавное исчезновение
      this.isVisible = false
      this.cleanup()

      // Даем время на анимацию исчезновения
      return new Promise(resolve => setTimeout(resolve, 500))
    },

    /**
     * Принудительное завершение
     */
    complete() {
      this.currentPercentage = 99.98
      this.cleanup()

      if (this.autoHide) {
        setTimeout(() => this.hide(), 500)
      }
    },

    /**
     * Показать прелоадер
     */
    show() {
      this.isVisible = true
      this.resetAnimation()
    },

    /**
     * Устанавливает текущую фразу на основе истории посещений
     */
    setCurrentPhrase() {
      const visitData = this.getVisitData()
      const phraseIndex = this.calculatePhraseIndex(visitData.visitCount)

      this.currentPhrase = this.phrases[phraseIndex]

      // Обновляем данные о посещении
      this.updateVisitData(visitData, phraseIndex)
    },

    /**
     * Получает данные о посещениях из Local Storage
     */
    getVisitData() {
      const defaultData = {
        visitCount: 0,
        lastPhraseIndex: -1,
        usedPhrases: []
      }

      try {
        const stored = localStorage.getItem('detective_preloader_visits')
        return stored ? JSON.parse(stored) : defaultData
      } catch {
        return defaultData
      }
    },

    /**
     * Вычисляет индекс фразы для показа
     */
    calculatePhraseIndex(visitCount) {
      // Если посещений меньше чем фраз - показываем по порядку
      if (visitCount < this.phrases.length) {
        return visitCount
      }

      // Если все фразы были показаны - случайный выбор
      return Math.floor(Math.random() * this.phrases.length)
    },

    /**
     * Обновляет данные о посещениях в Local Storage
     */
    updateVisitData(oldData, usedPhraseIndex) {
      const newData = {
        visitCount: oldData.visitCount + 1,
        lastPhraseIndex: usedPhraseIndex,
        lastVisit: new Date().toISOString(),
        usedPhrases: [...oldData.usedPhrases, usedPhraseIndex].slice(-20)
      }

      try {
        localStorage.setItem('detective_preloader_visits', JSON.stringify(newData))
      } catch (error) {
        console.warn('Не удалось сохранить данные о посещении:', error)
      }
    },

    startPercentageAnimation() {
      this.animationStartTime = performance.now()
      this.animatePercentage()
    },

    animatePercentage() {
      const currentTime = performance.now()
      const elapsed = currentTime - this.animationStartTime

      if (this.currentStage < this.progressStages.length) {
        const [start, end, duration] = this.progressStages[this.currentStage]
        const progress = Math.min(elapsed / duration, 1)

        const easedProgress = this.easeInOutCubic(progress)
        this.currentPercentage = Number((start + (end - start) * easedProgress).toFixed(2))

        if (progress < 1) {
          this.animationFrame = requestAnimationFrame(this.animatePercentage)
        } else {
          this.currentStage++
          this.animationStartTime = currentTime
          this.animationFrame = requestAnimationFrame(this.animatePercentage)
        }
      } else {
        this.currentPercentage = 99.98
        // Автоматически скрываем при завершении анимации
        if (this.autoHide) {
          setTimeout(() => this.hide(), 1000)
        }
      }
    },

    easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    },

    // Метод для сброса анимации
    resetAnimation() {
      this.cleanup()
      this.currentPercentage = 2.12
      this.currentStage = 0
      this.animationStartTime = null
      this.startTimestamp = Date.now()
      this.startPercentageAnimation()
    },

    /**
     * Ручное добавление новой фразы
     */
    addNewPhrase(newPhrase) {
      if (!this.phrases.includes(newPhrase.toUpperCase())) {
        this.phrases.push(newPhrase.toUpperCase())
      }
    },

    /**
     * Получение статистики посещений
     */
    getVisitStats() {
      return this.getVisitData()
    },

    /**
     * Сброс истории посещений
     */
    resetVisitHistory() {
      try {
        localStorage.removeItem('detective_preloader_visits')
        console.log('История посещений сброшена')
      } catch (error) {
        console.warn('Не удалось сбросить историю:', error)
      }
    }
  }
}
</script>

<style scoped>
.detective-preloader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  gap: 1.5rem;
  transition: opacity 0.5s ease-out;

  /* ВАЖНО: Устанавливаем нормальный курсор */
  cursor: default;
}

/* Скрытый элемент, который занимает весь экран и сбрасывает курсор */
.cursor-helper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  cursor: default;
  pointer-events: none; /* Чтобы не блокировать клики на прелоадер */
}

/* Убедимся, что все элементы внутри имеют нормальный курсор */
.magnifying-glass,
.loading-text,
.percentage-display {
  cursor: default;
}

/* Добавим красивый курсор при наведении на лупу */
.magnifying-glass:hover {
  filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
  cursor: default;
}

/* Остальные стили без изменений */
.magnifying-glass {
  position: relative;
  width: 80px;
  height: 80px;
  animation: search 3s ease-in-out infinite;
}

.glass {
  width: 60px;
  height: 60px;
  border: 3px solid #fff;
  border-radius: 50%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.05);
}

.glass-inner {
  width: 40px;
  height: 40px;
  border: 2px solid rgb(0, 143, 255);
  border-radius: 5%;
  position: relative;
}

.glass-inner::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 8px;
  height: 8px;
  background: rgb(255, 0, 182);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: pulse 2s ease-in-out infinite;
}

.handle {
  width: 35px;
  height: 10px;
  background: #fff;
  position: absolute;
  bottom: 0;
  right: 5px;
  transform: rotate(45deg);
  transform-origin: right center;
  border-radius: 2px 25px 25px 2px;
}

.loading-text {
  color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 2px;
  margin-bottom: 0.5rem;
  text-align: center;
  min-height: 24px;
}

.text {
  color: #fff;
}

.dots {
  display: flex;
  gap: 1px;
}

.dot {
  animation: blink 1.4s infinite;
  color: #fff;
  font-weight: bold;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

.percentage-display {
  color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  font-weight: normal;
  letter-spacing: 1px;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  min-width: 80px;
  text-align: center;
  animation: percentagePulse 2s ease-in-out infinite;
}

@keyframes search {
  0%, 100% {
    transform: translateX(-15px) rotate(-3deg);
  }
  25% {
    transform: translateX(0) rotate(0deg);
  }
  50% {
    transform: translateX(15px) rotate(3deg);
  }
  75% {
    transform: translateX(0) rotate(0deg);
  }
}

@keyframes blink {
  0%, 100% {
    opacity: 0.3;
    transform: scale(0.8);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(0.8);
  }
  50% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes percentagePulse {
  0%, 100% {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
  }
  50% {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
  }
}



@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .magnifying-glass {
    width: 60px;
    height: 60px;
  }
  .glass {
    width: 45px;
    height: 45px;
  }
  .glass-inner {
    width: 35px;
    height: 35px;
  }
  .handle {
    width: 25px;
    height: 10px;
    bottom: 0;
  }
  .loading-text {
    font-size: 16px;
  }
  .percentage-display {
    font-size: 12px;
    padding: 0.4rem 0.8rem;
  }
}
</style>
