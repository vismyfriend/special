<template>
  <div class="background-page">
    <!-- Фоновая картинка для десктопа -->
    <div
      class="background-image desktop-bg"
      :class="{ blurred: isModalOpen }"
      :style="{ backgroundImage: `url(${desktopBgImage})` }"
    ></div>

    <!-- Фоновая картинка для мобильных -->
    <div
      class="background-image mobile-bg"
      :class="{ blurred: isModalOpen }"
      :style="{ backgroundImage: `url(${mobileBgImage})` }"
    ></div>

    <!-- Кнопка Start по центру -->
    <div class="start-wrapper" :class="{ hidden: isModalOpen }">
      <button class="start-btn" @click="openModal">
        hi, Vincent !
      </button>
    </div>

    <!-- Модальное окно Finder -->
    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="finder-window">
        <!-- Заголовок Finder -->
        <div class="finder-header">
          <div class="window-controls">
            <button class="window-btn close" @click="closeModal"></button>
            <button class="window-btn minimize" @click="handleMinimize"></button>
            <button class="window-btn zoom" @click="handleZoom"></button>
          </div>
          <span class="finder-title">Finder</span>
          <div class="finder-spacer"></div>
        </div>

        <!-- Тело Finder -->
        <div class="finder-body">
          <!-- Боковая панель -->
          <div class="sidebar">
            <div
              class="sidebar-item"
              :class="{ favorite: activeTab === 'disclaimer' }"
              @click="activeTab = 'disclaimer'"
            >
              <span class="sidebar-icon">⭐</span>
              <span>Дисклеймер</span>
            </div>

            <div
              class="sidebar-item"
              :class="{ favorite: activeTab === 'important' }"
              @click="activeTab = 'important'"
            >
              <span class="sidebar-icon">📁</span>
              <span>Важно</span>
            </div>

            <div class="sidebar-divider"></div>

            <div
              class="sidebar-item"
              :class="{ favorite: activeTab === 'devices' }"
              @click="activeTab = 'devices'"
            >
              <span class="sidebar-icon">💻</span>
              <span>Устройства</span>
            </div>
          </div>

          <!-- Основное содержимое -->
          <div class="finder-content">
            <!-- Заготовка под будущие вкладки -->
            <div class="content-header">
              <div class="tabs-placeholder">
                <!-- Сюда потом придут вкладки -->
              </div>
            </div>

            <!-- ВКЛАДКА: ДИСКЛЕЙМЕР -->
            <div v-if="activeTab === 'disclaimer'" class="tab-content">
              <div class="disclaimer-icon">📄</div>
              <h2 class="disclaimer-title">Добро пожаловать!</h2>

              <div class="disclaimer-text">
                <p>Перед началом игры ознакомьтесь с правилами:</p>
                <ul>
                  <li>🔹 Вам будут показаны пары слов</li>
                  <li>🔹 Нужно найти все совпадающие пары</li>
                  <li>🔹 Игра развивает память и внимание</li>
                  <li>🔹 Удачи! 🍀</li>
                </ul>
              </div>

              <!-- Чекбокс согласия -->
              <label class="disclaimer-checkbox">
                <input type="checkbox" v-model="isAgreed">
                <span class="checkbox-box"></span>
                <span class="checkbox-label">Я согласен с правилами</span>
              </label>

              <div class="finder-actions">
                <button
                  class="finder-btn primary"
                  :disabled="!isAgreed"
                  @click="goToImportant"
                >
                  Продолжить
                </button>
                <button class="finder-btn secondary" @click="closeModal">
                  Выйти
                </button>
              </div>
            </div>

            <!-- ВКЛАДКА: ВАЖНО -->
            <div v-else-if="activeTab === 'important'" class="tab-content">
              <div class="disclaimer-icon">📁</div>
              <h2 class="disclaimer-title">Важно</h2>

              <div class="disclaimer-text">
                <p>Это приложение для изучения английского языка.</p>
                <ul>
                  <li>🔹 Отключите автопереводчик страницы</li>
                  <li>🔹 Не переводите слова через Google Translate</li>
                  <li>🔹 Старайтесь понимать контекст сами</li>
                  <li>🔹 Если совсем непонятно — используйте Oxford / Reverso</li>
                </ul>
              </div>
            </div>

            <!-- ВКЛАДКА: УСТРОЙСТВА -->
            <div v-else-if="activeTab === 'devices'" class="tab-content">
              <div class="disclaimer-icon">💻</div>
              <h2 class="disclaimer-title">Устройства</h2>

              <div class="disclaimer-text">
                <ul>
                  <li>🔹 💻 MacBook — рекомендуемое устройство</li>
                  <li>🔹 📱 iPhone — поддерживается</li>
                  <li>🔹 🖥️ Windows — поддерживается</li>
                  <li>🔹 📱 Android — поддерживается</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <!-- Строка состояния -->
        <div class="finder-footer">
          <span class="status-text">Готов к работе</span>
          <span class="status-items">1 элемент</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// ==================== ФОНОВЫЕ КАРТИНКИ ====================
// ВАЖНО: пути через new URL(...) считаются относительно ТЕКУЩЕГО файла,
// поэтому тут нужно два ../ (компонент лежит глубже, чем корень src)
const desktopBgImage = new URL('../../assets/images/specialMonitorHorizontalTJPEG.jpg', import.meta.url).href;
const mobileBgImage  = new URL('../../assets/images/specialMonitorVerticalTJPEG2.jpg',  import.meta.url).href;

// ==================== СОСТОЯНИЕ ====================
const isMobile = ref(false);
const isModalOpen = ref(false);

// Finder: активная вкладка и галочка согласия
const activeTab = ref('disclaimer'); // 'disclaimer' | 'important' | 'devices'
const isAgreed = ref(false);

// ==================== ОПРЕДЕЛЕНИЕ МОБИЛЬНОГО ====================
const checkMobile = () => {
  isMobile.value = window.innerWidth <= 768;
};

const toggleBodyClass = () => {
  if (isMobile.value) {
    document.body.classList.add('mobile-view');
    document.body.classList.remove('desktop-view');
  } else {
    document.body.classList.add('desktop-view');
    document.body.classList.remove('mobile-view');
  }
};

const updateView = () => {
  checkMobile();
  toggleBodyClass();
};

// ==================== МОДАЛКА ====================
const openModal = () => {
  isModalOpen.value = true;
  document.body.style.overflow = 'hidden';

  // Сбрасываем состояние Finder при каждом открытии
  activeTab.value = 'disclaimer';
  isAgreed.value = false;
};

const closeModal = () => {
  isModalOpen.value = false;
  document.body.style.overflow = '';
};

// ==================== КНОПКИ ОКНА ====================
const handleMinimize = () => {
  console.log('🟡 Жёлтая кнопка: свернуть окно');
  // TODO: свернуть окно
};

const handleZoom = () => {
  console.log('🟢 Зелёная кнопка: развернуть окно');
  // TODO: развернуть окно
};

// ==================== ПЕРЕХОД НА ВКЛАДКУ "ВАЖНО" ====================
const goToImportant = () => {
  if (!isAgreed.value) return;
  console.log('✅ Пользователь согласен, переходим на "Важно"');
  activeTab.value = 'important';
};

// ==================== ЖИЗНЕННЫЙ ЦИКЛ ====================
onMounted(() => {
  updateView();
  window.addEventListener('resize', updateView);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateView);
  document.body.style.overflow = '';
});
</script>

<style lang="scss" scoped>
// ==================== ОБЩИЙ ФОН ====================
.background-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #000;
}

.background-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  will-change: transform, filter;
  transform: translateZ(0);
  backface-visibility: hidden;
  transition: filter 0.5s ease, opacity 0.3s ease;

  &.blurred {
    filter: blur(12px) brightness(0.7);
  }
}

.desktop-bg {
  opacity: 1;
  z-index: 1;
}

.mobile-bg {
  opacity: 0;
  z-index: 2;
}

@media (max-width: 768px) {
  .desktop-bg {
    opacity: 0;
  }

  .mobile-bg {
    opacity: 1;
  }
}

.mobile-view .mobile-bg {
  opacity: 1;
  z-index: 2;
}

.mobile-view .desktop-bg {
  opacity: 0;
  z-index: 1;
}

.desktop-view .desktop-bg {
  opacity: 1;
  z-index: 1;
}

.desktop-view .mobile-bg {
  opacity: 0;
  z-index: 2;
}

// ==================== КНОПКА START ====================
.start-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -100px;
  transition: opacity 0.3s ease, transform 0.3s ease;

  &.hidden {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
    pointer-events: none;
  }
}

.start-btn {
  position: relative;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 60px;
  padding: 18px 64px;
  cursor: pointer;
  outline: none;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  min-width: 180px;
  font-family: Special_f1;
  font-weight: 500;
  font-size: 22px;
  text-transform: lowercase;
  color: rgba(255, 255, 255, 0.95);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.15);

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
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0.1) 70%,
        transparent 100%
    );
    transform: skewX(-25deg);
    animation: glassShine 3s ease-in-out infinite;
    pointer-events: none;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.75);
    border-color: rgba(255, 255, 255, 0.4);
    transform: scale(1.05);
    box-shadow: 0 8px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }

  &:active {
    transform: scale(0.95);
    background: rgba(0, 0, 0, 0.8);
  }
}

@keyframes glassShine {
  0% {
    left: -100%;
  }
  60% {
    left: 150%;
  }
  100% {
    left: 150%;
  }
}

@media (max-width: 768px) {
  .start-wrapper {
    margin-top: -70px;
  }

  .start-btn {
    padding: 4px 12px;
    font-size: 14px;
    min-width: 70px;
  }
}

// ==================== МОДАЛКА FINDER ====================
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: overlayFade 0.3s ease;
}

@keyframes overlayFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.finder-window {
  width: 90%;
  max-width: 640px;
  height: 460px;
  max-height: 80vh;
  background: rgba(245, 245, 247, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 12px;
  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.5),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: windowAppear 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes windowAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

// Заголовок Finder
.finder-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: rgba(220, 220, 224, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  min-height: 44px;
  flex-shrink: 0;
}

.window-controls {
  display: flex;
  gap: 8px;
  align-items: center;
}

.window-btn {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
  padding: 0;

  &:hover {
    transform: scale(1.15);
  }

  &.close {
    background: #ff5f57;

    &:hover {
      background: #ff3b30;
    }
  }

  &.minimize {
    background: #ffbd2e;

    &:hover {
      background: #ff9500;
    }
  }

  &.zoom {
    background: #28c840;

    &:hover {
      background: #34c759;
    }
  }
}

.finder-title {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0.3px;
}

.finder-spacer {
  flex: 1;
}

// Тело Finder
.finder-body {
  display: flex;
  flex: 1;
  overflow: hidden;
}

// Боковая панель
.sidebar {
  width: 160px;
  background: rgba(240, 240, 242, 0.6);
  padding: 8px 0;
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.sidebar-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 6px 16px;
  font-size: 13px;
  color: rgba(0, 0, 0, 0.7);
  cursor: pointer;
  transition: background 0.15s ease;
  border-radius: 4px;
  margin: 0 4px;

  &:hover {
    background: rgba(0, 0, 0, 0.05);
  }

  &.favorite {
    color: #007aff;
    font-weight: 500;
    background: rgba(0, 122, 255, 0.08);
  }
}

.sidebar-icon {
  font-size: 14px;
  opacity: 0.7;
}

.sidebar-divider {
  height: 1px;
  background: rgba(0, 0, 0, 0.06);
  margin: 6px 12px;
}

// Основное содержимое
.finder-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.6);
  padding: 0;
  overflow: hidden;
}

.content-header {
  padding: 8px 16px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: flex-end;
  flex-shrink: 0;
  min-height: 36px;
}

.tabs-placeholder {
  display: flex;
  gap: 8px;
  /* сюда потом придут вкладки */
}

// Содержимое вкладок
.tab-content {
  flex: 1;
  padding: 30px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  overflow-y: auto;
}

.disclaimer-icon {
  font-size: 48px;
  margin-bottom: 12px;
  opacity: 0.8;
}

.disclaimer-title {
  font-size: 22px;
  font-weight: 600;
  color: #1c1c1e;
  margin: 0 0 16px 0;
}

.disclaimer-text {
  text-align: left;
  width: 100%;
  max-width: 400px;
  color: #3a3a3c;
  font-size: 14px;
  line-height: 1.6;

  p {
    margin: 0 0 12px 0;
    font-weight: 500;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;

    li {
      padding: 6px 0;
      border-bottom: 1px solid rgba(0, 0, 0, 0.04);

      &:last-child {
        border-bottom: none;
      }
    }
  }
}

// ==================== ЧЕКБОКС ====================
.disclaimer-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
  cursor: pointer;
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  .checkbox-box {
    width: 20px;
    height: 20px;
    border-radius: 5px;
    border: 2px solid rgba(0, 0, 0, 0.3);
    background: rgba(255, 255, 255, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &::after {
      content: '';
      width: 10px;
      height: 10px;
      border-radius: 2px;
      background: transparent;
      transition: background 0.2s ease;
    }
  }

  input:checked + .checkbox-box {
    border-color: #007aff;
    background: #007aff;

    &::after {
      background: #fff;
    }
  }

  &:hover .checkbox-box {
    border-color: rgba(0, 122, 255, 0.6);
  }

  .checkbox-label {
    font-size: 14px;
    color: #3a3a3c;
  }
}

// ==================== КНОПКИ ====================
.finder-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.finder-btn {
  padding: 10px 32px;
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &.primary {
    background: #007aff;
    color: white;

    &:hover:not(:disabled) {
      background: #0066d9;
      transform: scale(1.02);
    }

    &:active:not(:disabled) {
      transform: scale(0.98);
    }

    &:disabled {
      background: rgba(0, 0, 0, 0.1);
      color: rgba(0, 0, 0, 0.3);
      cursor: not-allowed;
      transform: none;
    }
  }

  &.secondary {
    background: rgba(0, 0, 0, 0.05);
    color: #3a3a3c;

    &:hover {
      background: rgba(0, 0, 0, 0.1);
    }
  }
}

// ==================== ФУТЕР FINDER ====================
.finder-footer {
  display: flex;
  justify-content: space-between;
  padding: 6px 16px;
  background: rgba(240, 240, 242, 0.5);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  font-size: 11px;
  color: rgba(0, 0, 0, 0.45);
  flex-shrink: 0;
  min-height: 28px;
}

// ==================== АДАПТИВ ====================
@media (max-width: 768px) {
  .finder-window {
    width: 95%;
    height: 90vh;
    max-height: 90vh;
    border-radius: 8px;
  }

  .sidebar {
    width: 120px;
  }

  .sidebar-item {
    font-size: 12px;
    padding: 5px 12px;
  }

  .tab-content {
    padding: 20px;
  }

  .disclaimer-title {
    font-size: 18px;
  }

  .finder-actions {
    flex-direction: column;
    width: 100%;

    .finder-btn {
      width: 100%;
    }
  }

  .finder-title {
    font-size: 12px;
  }
}
</style>
