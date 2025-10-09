<template>
  <div class="keypad-container">
    <main>
      <div class="keypad" :data-platform="platform" :data-theme="theme">
        <div class="keypad__base">
          <img
            :src="images.aiBase"
            alt="Keyboard base"
          />
        </div>

        <!-- Кнопка 1 -->
        <button
          id="one"
          class="key keypad__single"
          :data-pressed="keys.one.pressed"
          @mousedown="pressKey('one')"
          @mouseup="releaseKey('one')"
          @touchstart="pressKey('one')"
          @touchend="releaseKey('one')"
        >
          <span class="key__mask">
            <span class="key__content">
              <span class="key__text">
                <span data-key="perplexity">you are</span>
                <span data-key="macos">⌘</span>
                <span data-key="gemini">
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <title>Google Gemini</title>
                    <path fill="currentColor" d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"/>
                  </svg>
                </span>
                <span data-key="claude">
                  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <title>Claude</title>
                    <path fill="currentColor" d="m4.7144 15.9555 4.7174-2.6471.079-.2307-.079-.1275h-.2307l-.7893-.0486-2.6956-.0729-2.3375-.0971-2.2646-.1214-.5707-.1215-.5343-.7042.0546-.3522.4797-.3218.686.0608 1.5179.1032 2.2767.1578 1.6514.0972 2.4468.255h.3886l.0546-.1579-.1336-.0971-.1032-.0972L6.973 9.8356l-2.55-1.6879-1.3356-.9714-.7225-.4918-.3643-.4614-.1578-1.0078.6557-.7225.8803.0607.2246.0607.8925.686 1.9064 1.4754 2.4893 1.8336.3643.3035.1457-.1032.0182-.0728-.164-.2733-1.3539-2.4467-1.445-2.4893-.6435-1.032-.17-.6194c-.0607-.255-.1032-.4674-.1032-.7285L6.287.1335 6.6997 0l.9957.1336.419.3642.6192 1.4147 1.0018 2.2282 1.5543 3.0296.4553.8985.2429.8318.091.255h.1579v-.1457l.1275-1.706.2368-2.0947.2307-2.6957.0789-.7589.3764-.9107.7468-.4918.5828.2793.4797.686-.0668.4433-.2853 1.8517-.5586 2.9021-.3643 1.9429h.2125l.2429-.2429.9835-1.3053 1.6514-2.0643.7286-.8196.85-.9046.5464-.4311h1.0321l.759 1.1293-.34 1.1657-1.0625 1.3478-.8804 1.1414-1.2628 1.7-.7893 1.36.0729.1093.1882-.0183 2.8535-.607 1.5421-.2794 1.8396-.3157.8318.3886.091.3946-.3278.8075-1.967.4857-2.3072.4614-3.4364.8136-.0425.0304.0486.0607 1.5482.1457.6618.0364h1.621l3.0175.2247.7892.522.4736.6376-.079.4857-1.2142.6193-1.6393-.3886-3.825-.9107-1.3113-.3279h-.1822v.1093l1.0929 1.0686 2.0035 1.8092 2.5075 2.3314.1275.5768-.3218.4554-.34-.0486-2.2039-1.6575-.85-.7468-1.9246-1.621h-.1275v.17l.4432.6496 2.3436 3.5214.1214 1.0807-.17.3521-.6071.2125-.6679-.1214-1.3721-1.9246L14.38 17.959l-1.1414-1.9428-.1397.079-.674 7.2552-.3156.3703-.7286.2793-.6071-.4614-.3218-.7468.3218-1.4753.3886-1.9246.3157-1.53.2853-1.9004.17-.6314-.0121-.0425-.1397.0182-1.4328 1.9672-2.1796 2.9446-1.7243 1.8456-.4128.164-.7164-.3704.0667-.6618.4008-.5889 2.386-3.0357 1.4389-1.882.929-1.0868-.0062-.1579h-.0546l-6.3385 4.1164-1.1293.1457-.4857-.4554.0608-.7467.2307-.2429 1.9064-1.3114Z"/>
                  </svg>
                </span>
              </span>
              <img
                :src="images.keypadSingle"
                alt=""
              />
            </span>
          </span>
        </button>

        <!-- Остальные кнопки -->
        <button
          v-for="key in otherKeys"
          :key="key.id"
          :id="key.id"
          class="key keypad__single"
          :data-pressed="keys[key.id].pressed"
          @mousedown="pressKey(key.id)"
          @mouseup="releaseKey(key.id)"
          @touchstart="pressKey(key.id)"
          @touchend="releaseKey(key.id)"
        >
          <span class="key__mask">
            <span class="key__content">
              <span class="key__text">{{ key.text }}</span>
              <img
                :src="images.keypadSingle"
                alt=""
              />
            </span>
          </span>
        </button>
      </div>
    </main>


    <!-- БЛОК КАПЧИ -->
    <div class="captcha-container" :class="captcha.status">
      <div class="captcha-message">
        {{ captcha.message }}
      </div>
      <div v-if="captcha.status === 'failed'" class="captcha-retry"></div>
    </div>

    <!-- Контролы для настройки -->
    <div class="controls">
      <div class="control-group">
        <label>Platform:</label>
        <select v-model="platform">
          <option value="macos">macOS</option>
          <option value="gemini">Gemini</option>
          <option value="claude">Claude</option>
          <option value="perplexity">Perplexity</option>
          <option value="newplatform">New Platform</option> <!-- НОВАЯ ПЛАТФОРМА -->

        </select>
      </div>

      <div class="control-group">
        <label>Theme:</label>
        <select v-model="theme">
          <option value="system">System</option>
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
      </div>

      <div class="control-group">
        <label>
          <input type="checkbox" v-model="muted" /> Muted
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import aiBaseImage from '/src/assets/images/keyPad7.png' // НОВОЕ ИЗОБРАЖЕНИЕ С 8 КЛАВИШАМИ
import keypadSingleImage from '/src/assets/images/keypad-single.png'
import keySoundPress from '/src/assets/audio/keySoundPress.mp3'

export default {
  name: 'AIKeypad',

  data() {
    return {
      platform: 'perplexity',
      theme: 'dark',
      muted: false,
      // ДОБАВЬ НОВЫЕ ПЕРЕМЕННЫЕ ДЛЯ КАПЧИ
      captcha: {
        message: '',
        status: 'waiting', // waiting, success, failed
        targetKey: '', // случайная буква для проверки
        targetKeyName: '' // русское название буквы
      },
      keys: {
        one: { pressed: false, travel: 26 },
        two: { pressed: false, travel: 26, text: 'S' },
        three: { pressed: false, travel: 18, text: 'P' },
        four: { pressed: false, travel: 18, text: 'E' },
        five: { pressed: false, travel: 18, text: 'C' },
        six: { pressed: false, travel: 18, text: 'I' },
        seven: { pressed: false, travel: 18, text: 'A' },
        eight: { pressed: false, travel: 18, text: 'L' }
      },
      clickAudio: null,
      images: {
        aiBase: aiBaseImage,
        keypadSingle: keypadSingleImage
      },
      blockKeyRelease: false // ДОБАВЬ ЭТОТ ФЛАГ

    }
  },

  computed: {
    otherKeys() {
      const { one, ...others } = this.keys
      return Object.entries(others).map(([id, config]) => ({ id, ...config }))
    }
  },
  mounted() {
    this.initializeAudio()
    this.setupKeyListeners()
    this.updateDocumentTheme()
    this.generateCaptcha() // ГЕНЕРИРУЕМ КАПЧУ ПРИ ЗАГРУЗКЕ
  },
  watch: {
    theme() {
      this.updateDocumentTheme()
    },
    platform() {
      this.updateDocumentTheme()
    },
    muted(newVal) {
      if (this.clickAudio) {
        this.clickAudio.muted = newVal
      }
    }
  },
  methods: {
    initializeAudio() {
      this.clickAudio = new Audio(keySoundPress)
      this.clickAudio.muted = this.muted
    },

    setupKeyListeners() {
      window.addEventListener('keydown', this.handleKeyDown)
      window.addEventListener('keyup', this.handleKeyUp)
    },

    handleKeyDown(event) {
      const keyMap = {
        'Meta': 'one',
        'Tab': 'two',
        's': 'two',    // S
        'p': 'three',  // P
        'e': 'four',   // E
        'c': 'five',   // C
        'i': 'six',    // I
        'a': 'seven',  // A
        'l': 'eight'   // L
      }

      const keyId = keyMap[event.key.toLowerCase()]
      if (keyId && !this.keys[keyId].pressed) {
        this.pressKey(keyId)
      }
    },

    handleKeyUp(event) {
      const keyMap = {
        'Meta': 'one',
        'Tab': 'two',
        'c': 'three',
        'v': 'four',
        'Escape': 'five',
        // ДОБАВЬ НОВЫЕ КЛАВИШИ
        'a': 'six',
        'b': 'seven',
        'd': 'eight'
      }

      const keyId = keyMap[event.key]
      if (keyId) {
        this.releaseKey(keyId)
      }
    },

    cyclePlatformAndTheme() {
      // Список платформ для циклического переключения
      const platforms = ['macos', 'gemini', 'claude', 'perplexity', 'newplatform']
      const themes = ['dark', 'light', 'system']

      // Находим текущие индексы
      const currentPlatformIndex = platforms.indexOf(this.platform)
      const currentThemeIndex = themes.indexOf(this.theme)

      // Переключаем platform на следующую (по кругу)
      this.platform = platforms[(currentPlatformIndex + 1) % platforms.length]

      // Переключаем theme на следующую (по кругу)
      this.theme = themes[(currentThemeIndex + 1) % themes.length]

      // Обновляем документ (watch уже должен сработать, но на всякий случай)
      this.updateDocumentTheme()
    },

    generateCaptcha() {
      // Доступные буквы и их русские названия
      const availableKeys = [
        { key: 's', name: 'эс' },
        { key: 'p', name: 'пи' },
        { key: 'e', name: 'и' },
        { key: 'c', name: 'си' },
        { key: 'i', name: 'ай' },
        { key: 'a', name: 'эй' },
        { key: 'l', name: 'эл' }
      ]

      // Выбираем случайную букву
      const randomKey = availableKeys[Math.floor(Math.random() * availableKeys.length)]

      this.captcha.targetKey = randomKey.key
      this.captcha.targetKeyName = randomKey.name
      this.captcha.message = `Нажми букву [ ${randomKey.name.toUpperCase()} ]`
      this.captcha.status = 'waiting'
    },

    checkCaptcha(keyId) {
      if (this.captcha.status !== 'waiting') return

      const pressedKey = this.keys[keyId].text.toLowerCase()

      if (pressedKey === this.captcha.targetKey) {
        this.captcha.status = 'success'
        this.captcha.message = '✅ тест IQ пройден !'
        this.blockKeyRelease = false // РАЗБЛОКИРУЕМ ОТПУСКАНИЕ
      } else {
        this.captcha.status = 'failed'
        this.captcha.message = '❌ недостаточный IQ ...'

        // БЛОКИРУЕМ ОТПУСКАНИЕ КЛАВИШИ
        this.blockKeyRelease = true

        // ОСТАВЛЯЕМ КЛАВИШУ ЗАЖАТОЙ
        this.keys[keyId].pressed = true

        setTimeout(() => {
          // РАЗБЛОКИРУЕМ И ОТПУСКАЕМ КЛАВИШУ
          this.blockKeyRelease = false
          this.keys[keyId].pressed = false
          this.generateCaptcha()
        }, 3000)
      }
    },
    pressKey(keyId) {
      // ПРОСТАЯ ЗАЩИТА ОТ ДВОЙНЫХ НАЖАТИЙ
      if (this.keys[keyId].pressed) return

      this.keys[keyId].pressed = true

      // НЕМЕДЛЕННОЕ ВОСПРОИЗВЕДЕНИЕ ЗВУКА ДЛЯ МОБИЛЬНЫХ
      this.playClickSound()

      // ЗАДЕРЖКА ДЛЯ ВИЗУАЛЬНОГО ЭФФЕКТА (опционально)
      setTimeout(() => {
        if (keyId === 'one') {
          this.cyclePlatformAndTheme()
        } else {
          this.checkCaptcha(keyId)
        }
      }, 50)
    },

    playClickSound() {
      if (!this.muted && this.clickAudio) {
        // СБРАСЫВАЕМ И СРАЗУ ПРОИГРЫВАЕМ
        this.clickAudio.currentTime = 0
        const playPromise = this.clickAudio.play()

        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Игнорируем ошибки на мобильных
          })
        }
      }
    },


    releaseKey(keyId) {
      // НЕ ОТПУСКАЕМ КЛАВИШУ ЕСЛИ ОНА ЗАБЛОКИРОВАНА
      if (!this.blockKeyRelease) {
        this.keys[keyId].pressed = false
      }
    },




    updateDocumentTheme() {
      document.documentElement.dataset.theme = this.theme
      document.documentElement.dataset.platform = this.platform
    }
  },

  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown)
    window.removeEventListener('keyup', this.handleKeyUp)
  }
}
</script>

<style scoped>
/* Основные стили */
.keypad-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  min-height: 100vh;
  justify-content: center;
}

.controls {
  //display: flex;
  display: none;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.control-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.control-group label {
  font-weight: bold;
}

/* Ключевые стили из оригинального кода */
.keypad {
  position: relative;
  aspect-ratio: 400 / 310;
  display: flex;
  place-items: center;
  width: clamp(280px, 45vw, 500px);
  -webkit-tap-highlight-color: transparent;
  transition-property: translate, transform;
  transition-duration: 0.26s;
  transition-timing-function: ease-out;
  transform-style: preserve-3d;
  scale: 1;
}

.key {
  transform-style: preserve-3d;
  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;
  outline: none;
}

.key[data-pressed="true"] .key__content,
.key:active .key__content {
  translate: 0 calc(var(--travel, 20) * 1%);
}

.key__content {
  width: 100%;
  display: inline-block;
  height: 100%;
  transition: translate 0.12s ease-out;
  container-type: inline-size;
}

/* Стили для цвета кнопок */
.key img {
  filter: hue-rotate(calc(var(--hue, 0) * 1deg))
  saturate(var(--saturate, 1))
  brightness(var(--brightness, 1));
}

.keypad__single img {
  --brightness: 2;
  --saturate: 0;
  top: 0;
  opacity: 1;
  width: 96%;
  position: absolute;
  left: 50%;
  translate: -50% 1%;
}

/* Добавь стили для новой платформы */
[data-platform='newplatform'] #one img {
  --hue: 120; /* Зеленый оттенок */
  --brightness: 0.8;
  --saturate: 1.0;
}

[data-platform='newplatform'] #one .key__text {
  color: #fff;
}

[data-platform='newplatform'] [data-key='newplatform'] {
  display: grid;
}



/* Стили для разных платформ на кнопке #one */
[data-platform='gemini'] #one img {
  --brightness: 1.4;
  --saturate: 0.4;
  --hue: 330;
}

[data-platform='claude'] #one img {
  --brightness: 0.6;
  --saturate: 0;
}

[data-platform='perplexity'] #one img {
  --hue: 280;
  --brightness: 0.8;
  --saturate: 1.2;
}

[data-platform='macos'] #one img {
  --saturate: 0;
  --brightness: 0.6;
}

/* Стили для текста на разных платформах */
[data-platform='gemini'] #one .key__text {
  color: hsl(214, 81%, 100%);
}

[data-platform='claude'] #one .key__text {
  color: #d97757;
}

[data-platform='perplexity'] #one .key__text {
  color: #fff;
}

[data-platform='macos'] #one .key__text {
  color: #fff;
  font-size: 22cqi;
}
/* Позиционирование кнопок */
#one {
  left: 2.43%;
  bottom: 72.2%;
}

#two {
  left: 14.43%;  /* 2.43% + 12.0% */
  bottom: 63.17%; /* 72.2% - 9.03% */
}

#three {
  left: 26.43%;  /* 14.43% + 12.0% */
  bottom: 54.14%; /* 63.17% - 9.03% */
}

#four {
  left: 38.43%;  /* 26.43% + 12.0% */
  bottom: 45.11%; /* 54.14% - 9.03% */
}

#five {
  left: 50.43%;  /* 38.43% + 12.0% */
  bottom: 36.08%; /* 45.11% - 9.03% */
}

#six {
  left: 62.43%;  /* 50.43% + 12.0% */
  bottom: 27.05%; /* 36.08% - 9.03% */
}

#seven {
  left: 74.43%;  /* 62.43% + 12.0% */
  bottom: 18.02%; /* 27.05% - 9.03% */
}

#eight {
  left: 86.4%;
  bottom: 9%;
}

/* Стили для капчи */
.captcha-container {
  text-align: center;
  padding: 1rem 2rem;
  border-radius: 12px;
  background: light-dark(rgba(255,255,255,0.9), rgba(0,0,0,0.9));
  backdrop-filter: blur(10px);
  border: 2px solid transparent;
  transition: all 0.3s ease;
  max-width: 400px;
  margin: 0 auto;
}

.captcha-container.waiting {
  border-color: light-dark(#666, #999);
}

.captcha-container.success {
  border-color: #4CAF50;
  background: light-dark(rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.2));
}

.captcha-container.failed {
  border-color: #f44336;
  background: light-dark(rgba(244, 67, 54, 0.1), rgba(244, 67, 54, 0.2));
}

.captcha-message {
  font-size: 1.1rem;
  font-weight: 600;
  color: light-dark(#333, #28d0f4);
  margin-bottom: 0.5rem;
  font-family: Special_f1;
}

.captcha-retry {
  font-size: 0.9rem;
  color: light-dark(#666, #999);
  font-style: italic;
}



/* Обнови отступы контейнера */
.keypad-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem; /* УМЕНЬШИЛИ ОТСТУП */
  padding: 2rem;
  min-height: 100vh;
  justify-content: center;
  scale: 1.2;
}

.keypad__single {
  position: absolute;
  width: 21%;
  height: 24%;
  clip-path: polygon(
    0 0,
    54% 0,
    89% 24%,
    100% 70%,
    54% 100%,
    46% 100%,
    0 69%,
    12% 23%,
    47% 0%
  );
}

.key__text {
  width: 52%;
  height: 62%;
  position: absolute;
  font-size: 18cqi;
  z-index: 21;
  top: 5%;
  left: 0;
  mix-blend-mode: normal;
  color: hsl(0 0% 4%);
  translate: 45% -16%;
  transform: rotateX(36deg) rotateY(45deg) rotateX(-90deg) rotate(0deg);
  display: grid;
  place-items: center;
}

.keypad__base {
  position: absolute;
  bottom: 0;
  width: 110%;
}

.keypad__base img,
.key img {
  width: 100%;
}

/* Стили для разных платформ */
[data-key] {
  display: none;
  position: absolute;
  inset: 0;
  place-items: center;
}

[data-key] svg {
  width: 50%;
}

[data-platform='macos'] [data-key='macos'],
[data-platform='perplexity'] [data-key='perplexity'],
[data-platform='claude'] [data-key='claude'],
[data-platform='gemini'] [data-key='gemini'] {
  display: grid;
}

/* Стиль для заблокированной клавиши при ошибке */
.key[data-pressed="true"].locked {
  pointer-events: none; /* Отключаем клики */
  opacity: 0.7;
}
</style>

<style>
/* Глобальные стили для фона */
body {
  background: light-dark(#fff, #000);
  display: grid;
  place-items: center;
  min-height: 100vh;
  margin: 0;
  font-family: 'SF Pro Text', 'SF Pro Icons', 'Helvetica Neue', Helvetica, Arial, sans-serif, system-ui;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

body::before {
  --size: 45px;
  --line: color-mix(in hsl, canvasText, transparent 80%);
  content: '';
  height: 100vh;
  width: 100vw;
  position: fixed;
  background:
    linear-gradient(90deg, var(--line) 1px, transparent 1px var(--size)) calc(var(--size) * 0.36) 50% / var(--size) var(--size),
    linear-gradient(var(--line) 1px, transparent 1px var(--size)) 0% calc(var(--size) * 0.32) / var(--size) var(--size);
  mask: linear-gradient(-20deg, transparent 50%, white);
  top: 0;
  transform-style: flat;
  pointer-events: none;
  z-index: -1;
}

/* Стили для системных тем */
[data-theme='light'] {
  color-scheme: light only;
}

[data-theme='dark'] {
  color-scheme: dark only;
}

[data-theme='system'] {
  color-scheme: light dark;
}
</style>
