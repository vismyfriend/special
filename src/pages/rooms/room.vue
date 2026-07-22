<template>
  <!-- Прелоадер -->
  <Preloader />

  <!-- Фон -->
  <img
    class="backgroundImg"
    :src="backgroundImage"
    alt="Фон игры"
  >

  <!-- Контент поверх фона -->
  <div class="auth-overlay">
    <!-- Начальный экран: только кнопка Start -->
    <div v-if="!isLoginMode" class="glass-card start-screen">
      <button class="start-btn" @click="startGame">
        start
      </button>
    </div>

    <!-- Экран входа: поле ввода + кнопка -->
    <div v-else-if="!isRegistered" class="glass-card login-screen">
      <div class="card-content">
        <h1 class="title">/ эй джэ нт /</h1>

        <!-- 👇 НОВЫЙ КОНТЕЙНЕР ДЛЯ ПОЛЯ + КНОПКИ -->
        <div class="input-with-btn">
          <!-- Поле ввода -->
          <div class="input-group">
            <input
              v-model="agentName"
              type="text"
              class="glass-input"
              placeholder="введите ваше имя"
              @keyup.enter="handleRegister"
              @focus="onInputFocus"
              @blur="onInputBlur"
            />
          </div>

          <!-- Кнопка "войти" теперь справа -->
          <button class="register-btn secondary" @click="handleRegister">
            <span class="btn-text ">ok</span>
            <span class="btn-hover-text">ок</span>
          </button>
        </div>

        <!-- Предложенные имена (показываем только при фокусе) -->
        <div v-if="isInputFocused && suggestedNames.length > 0" class="suggested-names">
          <div class="suggested-buttons">
            <button
              v-for="name in suggestedNames"
              :key="name"
              class="suggested-btn"
              @mousedown.prevent="useSuggestedName(name)"
            >
              {{ name }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Экран приветствия: Hello + 2 кнопки -->
    <div v-else class="glass-card welcome-screen">
      <!-- Крестик закрытия -->
      <button class="close-btn" @click="goBackToLogin">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6L18 18" stroke="rgba(255,255,255,0.6)" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>

      <div class="card-content">
        <h1 class="welcome-title">hello, <span class="agent-name-display">{{ agentName }}</span></h1>

        <div class="welcome-buttons">
          <button class="welcome-btn primary" @click="goToSelfStudy">
            <span class="btn-text">заниматься самостоятельно</span>
            <span class="btn-hover-text">выбрать миссию</span>
          </button>
          <button class="welcome-btn secondary" @click="openZoomMeeting">
            <span class="btn-text">🎥 🕵️ подключиться к созвону</span>
            <span class="btn-hover-text">join the call</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Preloader from '/src/components/SpecialPreloader.vue';

const router = useRouter();
const backgroundImage = new URL("/src/assets/images/SpecialRoomGreen.jpg", import.meta.url).href;
const agentName = ref('');
const isLoginMode = ref(false);
const isRegistered = ref(false);
const suggestedNames = ref([]);

// Добавь переменную для отслеживания фокуса
const isInputFocused = ref(false);

// Добавь методы для управления показом
const onInputFocus = () => {
  isInputFocused.value = true;
};

const onInputBlur = () => {
  // Даем небольшую задержку, чтобы успело сработать нажатие на кнопку
  setTimeout(() => {
    isInputFocused.value = false;
  }, 200);
};

// Случайные суффиксы
const randomSuffixes = [
  "Great", "Super", "Awesome", "Brave", "Smart", "Cool", "Fast", "Котлета",
  "Strong", "Wise", "21", "Шварцнеггер", "69", "Fantastic", "Poop",
  "Epic", "Legend", "Hero", "Star", "Big", "Master", "90 Lvl", "Красотуля",
];

// Функция для получения названия устройства
const getDeviceSuggestion = () => {
  const ua = navigator.userAgent;
  if (/iPhone/.test(ua)) return 'iPhone';
  if (/iPad/.test(ua)) return 'iPad';
  if (/Android/.test(ua)) return 'Android';
  if (/Windows/.test(ua)) return 'Windows';
  if (/Mac/.test(ua)) return 'MacBook';
  if (/Linux/.test(ua)) return 'Linux';
  return 'Компьютер';
};

// Функция для получения предыдущего агента из localStorage
const getPreviousAgentName = () => {
  return localStorage.getItem('agentName') || null;
};

// Функция для генерации случайного суффикса
const getRandomSuffix = () => {
  const randomIndex = Math.floor(Math.random() * randomSuffixes.length);
  return randomSuffixes[randomIndex];
};

// Загрузка предложенных имён
const loadSuggestedNames = () => {
  const previousName = getPreviousAgentName();
  const suggestions = [];

  if (previousName) {
    suggestions.push(previousName);
    const nameWithoutSuffix = previousName.split(/#|_/)[0];
    const suffixVariant = `${nameWithoutSuffix}_${getRandomSuffix()}`;
    if (suffixVariant !== previousName) {
      suggestions.push(suffixVariant);
    }
  }

  if (suggestions.length === 0) {
    suggestions.push(getDeviceSuggestion());
    const classicNames = ['No name', 'Shrek', 'Гость 007'];
    suggestions.push(classicNames[Math.floor(Math.random() * classicNames.length)]);
  }

  suggestedNames.value = suggestions;
};

// Использовать предложенное имя
const useSuggestedName = (name) => {
  agentName.value = name;
  localStorage.setItem('agentName', name);
};

const startGame = () => {
  console.log('🎮 Нажата кнопка Start! Переключаем на форму входа');
  isLoginMode.value = true;
};

const goBackToStart = () => {
  console.log('↩️ Возврат к экрану Start');
  isLoginMode.value = false;
  agentName.value = '';
};

const goBackToLogin = () => {
  console.log('↩️ Возврат к экрану входа');
  isRegistered.value = false;
};

const handleRegister = () => {
  if (!agentName.value.trim()) {
    console.log('⚠️ Поле имени пустое!');
    return;
  }

  console.log('🟢 Регистрация агента:');
  console.log(`📝 Имя: ${agentName.value}`);
  console.log('⏰ Время:', new Date().toLocaleString());
  console.log('✅ Агент зарегистрирован в системе');

  // Сохраняем имя в localStorage
  localStorage.setItem('agentName', agentName.value);

  isRegistered.value = true;
};

const goToSelfStudy = () => {
  console.log('📚 Агент выбрал самостоятельное занятие');
  router.push('/see-all-sets-of-words');
};

const openZoomMeeting = () => {
  const zoomMeetingUrl = 'https://us06web.zoom.us/j/9041113793?pwd=cmZpZlpQZXRhYkh4RW9JTzZoTTZXZz09';
  console.log(`🎥 Открываем Zoom: ${zoomMeetingUrl}`);
  window.open(zoomMeetingUrl, '_blank');
};

onMounted(() => {
  loadSuggestedNames();
});
</script>
<style scoped lang="scss">
// Фон
.backgroundImg {
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  object-fit: cover;
  z-index: -1;
}

// Контейнер для центрирования карточки
.auth-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
  pointer-events: none;
}

// Glass-карточка (общая)
.glass-card {
  pointer-events: auto;
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(7px) saturate(130%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 48px;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  animation: floatIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
  transform: translateY(20px);
}

// Начальный экран (только кнопка Start)
.start-screen {
  padding: 10px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
}

// Экран входа
.login-screen {
  position: relative;
  overflow: hidden;
  padding: 36px 44px;
  min-width: 340px;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -100%;
    width: 60%;
    height: 200%;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.08) 30%,
        rgba(255, 255, 255, 0.25) 50%,
        rgba(255, 255, 255, 0.08) 70%,
        transparent 100%
    );
    transform: skewX(-25deg);
    animation: glassShine 3s ease-in-out infinite;
    pointer-events: none;
  }
}

// Экран приветствия
.welcome-screen {
  position: relative;
  overflow: hidden;
  padding: 36px 44px;
  min-width: 340px;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -100%;
    width: 60%;
    height: 200%;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.08) 30%,
        rgba(255, 255, 255, 0.25) 50%,
        rgba(255, 255, 255, 0.08) 70%,
        transparent 100%
    );
    transform: skewX(-25deg);
    animation: glassShine 3s ease-in-out infinite;
    pointer-events: none;
  }
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 40px;
}

// Заголовок "agent"
.title {
  font-family: -apple-system, 'Helvetica Neue', 'Segoe UI', Roboto, sans-serif;
  font-weight: 300;
  font-size: 30px;
  letter-spacing: 14px;
  text-transform: lowercase;
  margin: 0;

  background: linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.7) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
}

// Приветствие
.welcome-title {
  font-family: -apple-system, 'Helvetica Neue', 'Segoe UI', Roboto, sans-serif;
  font-weight: 300;
  font-size: 28px;
  letter-spacing: 2px;
  margin: 0;
  color: rgba(255, 255, 255, 0.85);

  .agent-name-display {
    font-weight: 600;
    background: linear-gradient(135deg, #70ff6b, #28a818);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    text-shadow: 0 0 30px rgba(238, 64, 64, 0.2);
  }
}

// Контейнер для кнопок приветствия
.welcome-buttons {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
}

// ===== УНИВЕРСАЛЬНЫЙ ЭФФЕКТ ЗАМЕНЫ ТЕКСТА ДЛЯ ВСЕХ КНОПОК =====
.register-btn,
.welcome-btn {
  position: relative;
  overflow: hidden;

  .btn-text {
    display: inline-block;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .btn-hover-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
    white-space: nowrap;
  }

  &:hover {
    .btn-text {
      opacity: 0;
      transform: translateY(-12px);
    }

    .btn-hover-text {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
}

// Кнопка "войти" — компактная версия для размещения справа
.register-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 60px;
  padding: 14px 24px;
  cursor: none;
  outline: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  font-family: -apple-system, 'Helvetica Neue', 'Segoe UI', Roboto, sans-serif;
  font-weight: 400;
  font-size: 17px;
  letter-spacing: 4px;
  text-transform: lowercase;
  color: rgba(255, 255, 255, 0.8);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.02);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
    color: #ffffff;
  }

  &:active {
    transform: scale(0.96);
    background: rgba(255, 255, 255, 0.2);
  }

  // Эффект замены текста
  position: relative;
  overflow: hidden;

  .btn-text {
    display: inline-block;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .btn-hover-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, 50%);
    opacity: 0;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    pointer-events: none;
    white-space: nowrap;
  }

  &:hover {
    .btn-text {
      opacity: 0;
      transform: translateY(-12px);
    }

    .btn-hover-text {
      opacity: 1;
      transform: translate(-50%, -50%);
    }
  }
}

.register-btn.secondary {
  background: rgba(43, 181, 115, 0.15);
  color: rgba(255, 255, 255, 0.85);
  border-color: rgba(43, 181, 115, 0.25);

  &:hover {
    background: rgba(43, 181, 115, 0.3);
    box-shadow: 0 8px 32px rgba(43, 181, 115, 0.15);
    color: #ffffff;
  }
}
// Кнопки приветствия
.welcome-btn {
  border-radius: 60px;
  padding: 14px 32px;
  cursor: none;
  outline: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  min-width: 220px;
  font-family: -apple-system, 'Helvetica Neue', 'Segoe UI', Roboto, sans-serif;
  font-weight: 400;
  font-size: 16px;
  letter-spacing: 2px;
  text-transform: lowercase;
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  // Эффект блика
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -100%;
    width: 60%;
    height: 200%;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 30%,
        rgba(255, 255, 255, 0.25) 50%,
        rgba(255, 255, 255, 0.1) 70%,
        transparent 100%
    );
    transform: skewX(-25deg);
    animation: glassShine 4s ease-in-out infinite;
    pointer-events: none;
  }

  &:hover {
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.96);
  }
}

.welcome-btn.primary {
  background: rgba(255, 255, 255, 0.12);
  color: rgba(255, 255, 255, 0.9);
  border-color: rgba(255, 255, 255, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    box-shadow: 0 8px 32px rgba(255, 255, 255, 0.05);
    color: #ffffff;
  }
}

.welcome-btn.secondary {
  background: rgba(43, 181, 115, 0.15);
  color: rgba(255, 255, 255, 0.85);
  border-color: rgba(43, 181, 115, 0.25);

  &:hover {
    background: rgba(43, 181, 115, 0.3);
    box-shadow: 0 8px 32px rgba(43, 181, 115, 0.15);
    color: #ffffff;
  }

  .btn-hover-text {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.zoom-icon {
  font-size: 18px;
}

// Кнопка Start
.start-btn {
  position: relative;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 60px;
  padding: 18px 64px;
  cursor: none;
  outline: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  min-width: 180px;

  font-family: -apple-system, 'Helvetica Neue', 'Segoe UI', Roboto, sans-serif;
  font-weight: 400;
  font-size: 20px;
  letter-spacing: 6px;
  text-transform: lowercase;
  color: rgba(255, 255, 255, 0.8);

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -100%;
    width: 60%;
    height: 200%;
    background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.15) 30%,
        rgba(255, 255, 255, 0.4) 50%,
        rgba(255, 255, 255, 0.15) 70%,
        transparent 100%
    );
    transform: skewX(-25deg);
    animation: glassShine 3s ease-in-out infinite;
    pointer-events: none;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.3);
    transform: scale(1.05);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
    color: #ffffff;
  }

  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.2);
  }
}

// ===== КЛЮЧЕВЫЕ КАДРЫ ДЛЯ БЛИКА =====
@keyframes glassShine {
  0% {
    left: -100%;
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  40% {
    left: 150%;
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
  100% {
    left: 150%;
    opacity: 0;
  }
}
// ===== КОНТЕЙНЕР ДЛЯ ПОЛЯ + КНОПКИ =====
.input-with-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
}

// Поле ввода
.input-group {
  flex: 1;
  min-width: 0;
}

.glass-input {
  width: 100%;
  padding: 14px 20px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-family: Special_f1;
  font-size: 22px;
  font-weight: 300;
  letter-spacing: 0.5px;
  outline: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  text-align: center;

  &::placeholder {
    color: rgba(255, 255, 255, 0.3);
    font-weight: 300;
    text-align: center;
  }

  &:focus {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.03);
  }
}

// Анимация появления карточки
@keyframes floatIn {
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.97);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
// ===== ПРЕДЛОЖЕННЫЕ ИМЕНА =====
.suggested-names {
  width: 100%;
  margin-top: 4px;
  margin-bottom: 4px;
}

.suggested-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
}

.suggested-btn {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 20px;
  padding: 6px 16px;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: -apple-system, 'Helvetica Neue', 'Segoe UI', Roboto, sans-serif;
  white-space: nowrap;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
    color: #ffffff;
    transform: scale(1.02);
  }

  &:active {
    transform: scale(0.95);
    background: rgba(255, 255, 255, 0.2);
  }
}
// ===== КНОПКА ЗАКРЫТИЯ (КРЕСТИК) =====
.close-btn {
  position: absolute;
  top: 33px;
  right: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  padding: 0;
  z-index: 10;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
    transform: rotate(90deg);
  }

  &:active {
    transform: rotate(90deg) scale(0.9);
  }

  svg {
    display: block;
  }
}

// Адаптивность
@media (max-width: 480px) {
  .login-screen,
  .welcome-screen {
    padding: 40px 28px;
    border-radius: 32px;
    min-width: unset;
    width: 92%;
    max-width: 380px;
  }

  .login-screen .card-content,
  .welcome-screen .card-content {
    gap: 32px;
  }

  .title {
    font-size: 25px;
    letter-spacing: 10px;
  }

  .welcome-title {
    font-size: 25px;
  }

  .start-btn {
    padding: 14px 48px;
    min-width: 140px;
    font-size: 17px;
    letter-spacing: 4px;
  }

  .glass-input {
    padding: 12px 16px;
    font-size: 15px;
  }

  .register-btn {
    padding: 10px 13px;
    font-size: 15px;
    letter-spacing: 3px;
  }

  .welcome-btn {
    padding: 12px 24px;
    min-width: 180px;
    font-size: 14px;
  }

  .close-btn {
    top: 16px;
    right: 16px;
    width: 32px;
    height: 32px;
  }
}
</style>
