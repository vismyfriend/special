<template>
  <div v-if="data" class="noir-container">
    <div class="desk-lamp"></div>

    <div class="case-file">
      <div class="file-label" @click="goToAllMissionSets">
        Нужно заучить<br>{{ data.title }}
      </div>

      <div class="table-wrapper">
        <table class="noir-table">
          <tbody>
          <tr v-for="(row, rowIndex) in data.tableConfig.rows" :key="rowIndex">
            <td
              v-for="(cell, cellIndex) in row.cells"
              :key="cellIndex"
              :colspan="cell.colspan || 1"
              :rowspan="cell.rowspan || 1"
              :style="cell.style || {}"
              :class="[...(Array.isArray(cell.classes) ? cell.classes : [cell.classes]),
    { 'blurred': cell.isBlurred }]"
              @click="toggleBlur(rowIndex, cellIndex)"
            >
              <!-- Изображение (если есть) -->
              <div
                v-if="cell.image"
                class="cell-image-container"
                :class="cell.imagePosition || 'inline'"
                @click.stop="openImageModal(cell.image)"
              >
                <img
                  :src="cell.image"
                  :alt="cell.imageAlt || 'image'"
                  class="cell-image"
                  :class="{ 'zoomable': true }"
                />
              </div>

              <!-- HTML контент -->
              <span v-html="cell.content" class="cell-content"></span>

              <!-- Аудио кнопка (если есть) -->
              <AudioButtonSpecial1
                v-if="cell.audio"
                :audioSrc="cell.audio"
                :showText="true"
                :text="cell.audioText || '.'"
                class="cell-audio-button"
                @click.stop
              />
            </td>
          </tr>
          </tbody>
        </table>
      </div>

      <div class="stamps">
        <div
          v-for="(stamp, index) in stamps"
          :key="index"
          class="stamp"
          :class="[stamp.type, { 'blocked': isDelaying && stamp.type === 'confidential' }]"
          @click="stamp.action()"
        >
          {{ stamp.text }}
        </div>
      </div>
    </div>

    <div class="noir-overlay"></div>

    <!-- Обычный таймер -->
    <div
      class="stopwatch-timer"
      :class="{ 'freeze': !isRunning && showTimer }"
      v-if="showTimer"
      @click="stopTimer"
    >
      {{ minutes }}:{{ seconds }}<span class="milliseconds">.{{ milliseconds }}</span>
    </div>

    <!-- Обратный таймер -->
    <div
      class="countdown-timer"
      :class="{ 'disabled': !isCountdownActive }"
      v-if="isCountdownActive || (!isCountdownActive && countdownRemaining > 0 && countdownRemaining < countdownTime)"
      @click="toggleCountdownTimer"
    >
      <span class="timer-icon">{{ isCountdownActive ? '' : '' }}</span>
      {{ countdownMinutes }}:{{ countdownSeconds }}<span class="milliseconds">.{{ countdownMilliseconds }}</span>
    </div>

    <!-- Модальное окно для изображения -->
    <div v-if="showImageModal" class="image-modal" @click="closeImageModal">
      <div class="image-modal-content" @click.stop>
        <img
          :src="modalImageSrc"
          alt="Full size image"
          class="modal-image"
          @click="closeByImageClick"
        />
        <button class="modal-close" @click="closeImageModal">✕</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRouter } from "vue-router";
import AudioButtonSpecial1 from '../components/AudioButtonSpecial1.vue';

// ==================== PROPS ====================
const props = defineProps({
  data: {
    type: Object,
    required: true,
    validator: (value) => {
      return value && value.id && value.title && value.tableConfig;
    }
  }
});

const router = useRouter();

// ==================== ТАЙМЕР 1 (обычный) ====================
const showTimer = ref(false);
const timer = ref(null);
const startTime = ref(0);
const elapsedTime = ref(0);
const isRunning = ref(false);
const isDelaying = ref(false);

// Защита: если данных нет, не выполняем код
if (!props.data) {
  console.error('GrammarChartPattern: no data provided');
}

const formatTime = (time) => {
  const mins = Math.floor(time / 60000).toString().padStart(2, '0');
  const secs = Math.floor((time % 60000) / 1000).toString().padStart(2, '0');
  const ms = Math.floor((time % 1000) / 10).toString().padStart(2, '0');
  return { mins, secs, ms };
};

const minutes = computed(() => formatTime(elapsedTime.value).mins);
const seconds = computed(() => formatTime(elapsedTime.value).secs);
const milliseconds = computed(() => formatTime(elapsedTime.value).ms);

const updateTimer = () => {
  if (!isRunning.value) return;
  elapsedTime.value = Date.now() - startTime.value;
  if (elapsedTime.value >= 59999) {
    stopTimer();
    return;
  }
  timer.value = requestAnimationFrame(updateTimer);
};

const startTimer = () => {
  if (isRunning.value || isDelaying.value) return;
  showTimer.value = true;
  isRunning.value = true;
  startTime.value = Date.now();
  elapsedTime.value = 0;
  updateTimer();
};

const stopTimer = () => {
  if (isDelaying.value) return;
  isRunning.value = false;
  isDelaying.value = true;
  if (timer.value) {
    cancelAnimationFrame(timer.value);
    timer.value = null;
  }
  setTimeout(() => {
    showTimer.value = false;
    elapsedTime.value = 0;
    isDelaying.value = false;
  }, 3000);
};

const toggleConfidential = () => {
  if (isDelaying.value) return;
  if (!showTimer.value) {
    startTimer();
  } else {
    stopTimer();
  }
};

const goToAllMissionSets = () => {
    router.push('/see-all-sets-of-words/');
}

// ==================== ТАЙМЕР 2 (обратный) ====================
const countdownTimer = ref(null);
const countdownTime = ref(props.data.countdownTime || 77000);
const countdownRemaining = ref(props.data.countdownTime || 77000);
const isCountdownActive = ref(true);
const countdownStartTime = ref(0);

const countdownMinutes = computed(() => {
  const mins = Math.floor(countdownRemaining.value / 60000).toString().padStart(2, '0');
  return mins;
});

const countdownSeconds = computed(() => {
  const secs = Math.floor((countdownRemaining.value % 60000) / 1000).toString().padStart(2, '0');
  return secs;
});

const countdownMilliseconds = computed(() => {
  const ms = Math.floor((countdownRemaining.value % 1000) / 10).toString().padStart(2, '0');
  return ms;
});

const updateCountdown = () => {
  if (!isCountdownActive.value) return;
  countdownRemaining.value = countdownTime.value - (Date.now() - countdownStartTime.value);
  if (countdownRemaining.value <= 0) {
    stopCountdownTimer();
    router.push('/see-all-sets-of-words/');
    return;
  }
  countdownTimer.value = requestAnimationFrame(updateCountdown);
};

const startCountdownTimer = () => {
  if (!isCountdownActive.value) return;
  countdownStartTime.value = Date.now();
  countdownRemaining.value = countdownTime.value;
  updateCountdown();
};

const stopCountdownTimer = () => {
  if (countdownTimer.value) {
    cancelAnimationFrame(countdownTimer.value);
    countdownTimer.value = null;
  }
};

const disableCountdownTimer = () => {
  isCountdownActive.value = false;
  if (countdownTimer.value) {
    cancelAnimationFrame(countdownTimer.value);
    countdownTimer.value = null;
  }
};

const enableCountdownTimer = () => {
  isCountdownActive.value = true;
  startCountdownTimer();
};

const toggleCountdownTimer = () => {
  if (isCountdownActive.value) {
    disableCountdownTimer();
  } else {
    enableCountdownTimer();
  }
};

// ==================== ТАБЛИЦА ====================
const tableConfig = ref(props.data.tableConfig);

const toggleBlur = (rowIndex, cellIndex) => {
  const cell = tableConfig.value.rows[rowIndex].cells[cellIndex];
  if (cell.classes?.includes('blurred') || cell.isBlurred !== undefined) {
    cell.isBlurred = !cell.isBlurred;
  }
};

// ==================== ИЗОБРАЖЕНИЯ (модальное окно) ====================
const showImageModal = ref(false);
const modalImageSrc = ref('');

const openImageModal = (imageSrc) => {
  modalImageSrc.value = imageSrc;
  showImageModal.value = true;
};

const closeImageModal = () => {
  showImageModal.value = false;
  modalImageSrc.value = '';
};

// Новая функция для клика по картинке в модалке
const closeByImageClick = () => {
  closeImageModal();
};

// ==================== ШТАМПЫ ====================
const stamps = ref([
  {
    text: 'НАДО ВЫУЧИТЬ!',
    type: 'confidential',
    action: toggleConfidential
  },
  {
    text: 'OК!',
    type: 'approved',
    action: () => {
      router.push('/see-all-sets-of-words/');
    }
  }
]);

// ==================== LIFECYCLE ====================
onMounted(() => {
  startCountdownTimer();
});

onUnmounted(() => {
  if (timer.value) cancelAnimationFrame(timer.value);
  if (countdownTimer.value) cancelAnimationFrame(countdownTimer.value);
});
</script>

<style lang="scss" scoped>
.noir-container {
  position: relative;
  padding: 40px;
  background: #111;
  min-height: 100vh;
  font-family: 'Courier New', monospace;
  overflow: hidden;
  user-select: none;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 120px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent);
    z-index: 1;
  }
}

.desk-lamp {
  position: absolute;
  top: -50px;
  right: 100px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%);
  border-radius: 50%;
  z-index: 0;

  &::after {
    content: "";
    position: absolute;
    bottom: -30px;
    left: 50%;
    width: 10px;
    height: 150px;
    background: linear-gradient(to bottom, #333, #111);
    transform: translateX(-50%);
  }
}

.case-file {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
  background: #1a1a1a;
  border: 1px solid #333;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
  padding: 30px;
  z-index: 2;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml;utf8,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 0 L100 0 L100 100 L0 100 Z" fill="none" stroke="%23333" stroke-width="0.5"/></svg>');
    opacity: 0.1;
    pointer-events: none;
  }
}

.file-label {
  position: absolute;
  top: -15px;
  left: 20px;
  background: #8B0000;
  color: #FFD700;
  padding: 5px 15px;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 1px;
  text-transform: uppercase;
  border: 2px solid #333;
  transform: rotate(-2deg);
  cursor: pointer;
}

.noir-table {
  width: 100%;
  border-collapse: collapse;
  color: #e0e0e0;
  font-size: 16px;
  margin: 20px 0;
  line-height: 20px;

  td {
    padding: 6px;
    border: 1px solid #333;
    position: relative;
    vertical-align: middle;

    &::after {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, transparent, rgba(0,0,0,0.3));
      pointer-events: none;
    }

  }


  .evidence-tag {
    background: #8B0000;
    color: #FFD700;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 14px;
    text-align: center;
    width: 120px;
  }

  .green {
    background: #42dd2785;
  }

  .case-title {
    background: #222;
    color: #FFD700;
    font-size: 18px;
    font-weight: bold;
    letter-spacing: 2px;
    text-transform: uppercase;
    text-align: center;
  }

  .suspect {
    background: #1e1e1e;
    color: #b8860b;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    text-align: center;
  }

  .verb {
    color: #add8e6;
    font-style: italic;
  }

  .blue-font {
    color: #10e3ff;
    font-style: italic;
  }

  .verb-alias {
    color: #98fb98;
    font-style: italic;
  }

  .blurred {
    filter: blur(3px);
    user-select: none;
    transition: filter 0.2s ease;
  }

  .notes-label {
    background: #1e1e1e;
    color: #b8860b;
    font-weight: bold;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 1px;
    width: 150px;
  }

  .notes {
    background: #0f0f0f;
    color: #d3d3d3;
    line-height: 18px;

    .note-line {
      margin-bottom: 8px;
      position: relative;
      padding-left: 20px;

      &::before {
        content: "•";
        position: absolute;
        left: 5px;
        color: #8B0000;
      }
    }
  }

  .rules {
    color: white;
    line-height: 17px;
  }

  // Стили для изображений в ячейках
  .cell-image-container {
    display: inline-flex;
    vertical-align: middle;
    margin: 4px;

    &.inline {
      display: inline-flex;
      vertical-align: middle;
    }

    &.left {
      float: left;
      margin-right: 12px;
      margin-bottom: 8px;
    }

    &.right {
      float: right;
      margin-left: 12px;
      margin-bottom: 8px;
    }

    &.top {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 12px;
    }


    &.bottom {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-end;
      margin-top: 12px;
    }

    // Новый стиль для fullCell
    &.fullCell {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      margin: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #1a1a1a;
      z-index: 1;

      .cell-image {
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
        object-fit: contain;
        border-radius: 4px;
      }
    }

    .cell-image {
      max-width: 50px;
      max-height: 50px;
      object-fit: contain;
      border-radius: 8px;
      transition: all 0.3s ease;
      cursor: pointer;

      &.zoomable:hover {
        transform: scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
      }
    }
  }

  .cell-content {
    display: inline;
  }

  .cell-audio-button {
    display: inline-block;
    vertical-align: middle;
    margin-left: 8px;
  }
}

.stamps {
  display: flex;
  justify-content: flex-end;
  gap: 15px;
  margin-top: 20px;

  .stamp {
    padding: 5px 15px;
    border: 2px solid;
    font-family: 'Times New Roman', serif;
    font-weight: bold;
    transform: rotate(5deg);
    opacity: 0.8;
    cursor: pointer;

    &.approved {
      border-color: #006400;
      color: #006400;
      background: rgba(0,100,0,0.1);
    }

    &.confidential {
      border-color: #8B0000;
      color: #8B0000;
      background: rgba(139,0,0,0.1);
    }
  }
}

.noir-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 70% 20%, transparent 60%, rgba(0,0,0,0.7));
  pointer-events: none;
  z-index: 1;
}

@keyframes flicker {
  0%, 100% { opacity: 0.8; }
  25% { opacity: 0.6; }
  50% { opacity: 0.9; }
  75% { opacity: 0.7; }
}

.desk-lamp {
  animation: flicker 5s infinite;
}

// Модальное окно для изображений
.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
  z-index: 2000;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  .image-modal-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    cursor: default;

    .modal-image {
      max-width: 70vw;
      max-height: 70vh;
      object-fit: contain;
      border-radius: 8px;
      box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
    }

    .modal-close {
      position: absolute;
      top: -15px;
      right: -15px;
      background: #8B0000;
      color: #FFD700;
      border: none;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      font-size: 20px;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.1);
        background: #a00000;
      }
    }
  }
}

@media (max-width: 768px) {
  .noir-container {
    padding: 20px 10px;

    &::before {
      height: 60px;
    }
  }

  .desk-lamp {
    right: 30px;
    width: 120px;
    height: 120px;

    &::after {
      height: 100px;
    }
  }

  .case-file {
    padding: 20px 15px;
    margin: 0 10px;
  }

  .file-label {
    font-size: 12px;
    padding: 3px 10px;
    left: 10px;
  }

  .table-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0 -15px;
    padding: 0 15px;
  }

  .noir-table {
    font-size: 14px;
    min-width: 250px;

    td {
      padding: 5px 4px;

      &.evidence-tag,
      &.notes-label {
        width: auto;
        font-size: 12px;
      }

      &.case-title {
        font-size: 16px;
      }

      &.suspect {
        padding: 8px;
        font-size: 14px;
      }

      .cell-image-container .cell-image {
        max-width: 35px;
        max-height: 35px;
      }

      .cell-audio-button {
        transform: scale(0.9);
      }
    }

  }

  .stamps {
    gap: 10px;

    .stamp {
      padding: 3px 10px;
      font-size: 12px;
    }
  }

  .image-modal .image-modal-content .modal-close {
    top: -10px;
    right: -10px;
    width: 30px;
    height: 30px;
    font-size: 16px;
  }
}

.stopwatch-timer {
  position: fixed;
  bottom: 20px;
  left: 40%;
  transform: translateX(-50%);
  font-size: 3rem;
  font-family: 'Courier New', monospace;
  color: #FFD700;
  background: rgba(0, 0, 0, 0.7);
  padding: 10px 20px;
  border: 2px solid #37ff00;
  border-radius: 5px;
  z-index: 1000;
  cursor: pointer;
  user-select: none;
  animation: pulse 1.5s infinite;
}

.stopwatch-timer .milliseconds {
  font-size: 1.5rem;
  color: #10e3ff;
}

.stamp.confidential:active {
  transform: rotate(5deg) scale(0.95);
  transition: transform 0.1s;
}

.stamp.confidential.blocked {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.stopwatch-timer.freeze {
  animation: none;
  border-color: #10e3ff;
  color: #10e3ff;
  transform: translateX(-50%) scale(1.05);
}

@media (max-width: 768px) {
  .stopwatch-timer {
    font-size: 1.8rem;
    padding: 8px 16px;
    bottom: 15px;
  }

  .stopwatch-timer .milliseconds {
    font-size: 1rem;
  }
}

.countdown-timer {
  position: fixed;
  top: 20px;
  left: 65%;
  transform: translateX(-50%);
  font-size: 2rem;
  font-family: 'Courier New', monospace;
  color: #ff4444;
  background: rgba(0, 0, 0, 0.8);
  padding: 8px 20px;
  border: 2px solid #ff4444;
  border-radius: 5px;
  z-index: 1000;
  user-select: none;
  animation: countdownPulse 1s ease-in-out infinite;
  box-shadow: 0 0 15px rgba(255, 68, 68, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(-50%) scale(1.02);
  }

  &.disabled {
    animation: none;
    border-color: #666;
    color: #888;
    box-shadow: none;
    background: rgba(0, 0, 0, 0.6);
  }
}

.countdown-timer .milliseconds {
  font-size: 1rem;
  color: #ff8888;
}

@keyframes countdownPulse {
  0%, 100% {
    transform: translateX(-50%) scale(1);
    border-color: #ff4444;
    box-shadow: 0 0 10px rgba(255, 68, 68, 0.5);
  }
  50% {
    transform: translateX(-50%) scale(1.02);
    border-color: #ff8888;
    box-shadow: 0 0 20px rgba(255, 68, 68, 0.8);
  }
}

@media (max-width: 768px) {
  .countdown-timer {
    font-size: 1.2rem;
    padding: 5px 12px;
    top: 10px;
  }

  .countdown-timer .milliseconds {
    font-size: 0.8rem;
  }
}
</style>
