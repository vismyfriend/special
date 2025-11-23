<template>
  <div class="legendary-mode-content">
    <div class="modal-header">
      <h2>🔥 Legendary Mode</h2>
    </div>

    <!-- Блок с текущей серией -->
    <div class="streak-info">
      <div class="current-streak">
        <span class="streak-number">{{ currentStreak }}</span>
        <span class="streak-text">дней подряд</span>
      </div>
      <p class="streak-description">
        {{ getStreakDescription() }}
      </p>
    </div>

    <!-- Статистика -->
    <div class="stats-container">
      <div class="stat-item">
        <span class="stat-number">{{ totalVisits }}</span>
        <span class="stat-label">всего посещений</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ currentStreak }}</span>
        <span class="stat-label">текущая серия</span>
      </div>
      <div class="stat-item">
        <span class="stat-number">{{ bestStreak }}</span>
        <span class="stat-label">рекорд</span>
      </div>
    </div>

    <!-- Календарь посещений -->
    <div class="calendar-container">
      <div class="calendar-header">
        <h3>{{ getCurrentMonthName() }} {{ currentYear }}</h3>
      </div>

      <div class="calendar-grid">
        <!-- Дни недели -->
        <div class="calendar-days-header">
          <div v-for="day in weekDays" :key="day" class="day-header">{{ day }}</div>
        </div>

        <!-- Ячейки календаря -->
        <div class="calendar-days">
          <div
            v-for="day in calendarDays"
            :key="day.date"
            class="calendar-day"
            :class="{
              'empty': !day.date,
              'active': day.isActive,
              'today': day.isToday,
              'future': day.isFuture
            }"
          >
            <span v-if="day.date">{{ day.date }}</span>
            <span v-if="day.isActive" class="fire-icon">🔥</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Мотивирующий текст -->
    <div class="motivational-text">
      <p>{{ getMotivationalText() }}</p>
    </div>

    <!-- Кнопки для разработки -->
    <div v-if="isDevMode" class="dev-controls">
      <button @click="forceAddDay" class="dev-button">[DEV] +1 день</button>
      <button @click="forceSkipDay" class="dev-button">[DEV] Пропустить день</button>
      <button @click="forceReset" class="dev-button">[DEV] Сбросить</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const props = defineProps({
  currentDays: {
    type: Number,
    default: 1
  }
});

const isDevMode = import.meta.env.DEV;

// Основные данные
const currentStreak = ref(props.currentDays);
const totalVisits = ref(0);
const bestStreak = ref(0);
const visitDates = ref([]);
const currentYear = new Date().getFullYear();
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Загрузка данных
function loadTrackerData() {
  try {
    // Текущий streak передается через props
    currentStreak.value = props.currentDays;

    // Загружаем остальные данные
    const savedVisits = localStorage.getItem('allVisits');
    const savedBestStreak = localStorage.getItem('bestStreak');

    if (savedVisits) {
      visitDates.value = JSON.parse(savedVisits);
      totalVisits.value = visitDates.value.length;
    }

    if (savedBestStreak) {
      bestStreak.value = parseInt(savedBestStreak);
    }

    // Обновляем лучший streak если текущий больше
    if (currentStreak.value > bestStreak.value) {
      bestStreak.value = currentStreak.value;
      localStorage.setItem('bestStreak', bestStreak.value.toString());
    }

  } catch (e) {
    console.error('Error loading tracker data:', e);
  }
}

// Генерация календаря
function generateCalendarDays() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentDate = today.getDate();

  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);

  let firstDayOfWeek = firstDay.getDay();
  if (firstDayOfWeek === 0) firstDayOfWeek = 7;

  const days = [];

  // Пустые дни в начале
  for (let i = 1; i < firstDayOfWeek; i++) {
    days.push({ date: null, isActive: false, isToday: false, isFuture: false });
  }

  // Дни месяца
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
    const isToday = i === currentDate;
    const isFuture = i > currentDate;
    const isActive = visitDates.value.includes(dateStr);

    days.push({
      date: i,
      isActive,
      isToday,
      isFuture
    });
  }

  return days;
}

// Методы для тестирования
const forceAddDay = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  const todayStr = today.toISOString().slice(0, 10);

  // Эмулируем вчерашнее посещение
  if (!visitDates.value.includes(yesterdayStr)) {
    visitDates.value.push(yesterdayStr);
  }

  // Увеличиваем streak
  currentStreak.value += 1;
  totalVisits.value = visitDates.value.length;

  // Сохраняем
  localStorage.setItem('allVisits', JSON.stringify(visitDates.value));
  localStorage.setItem('currentStreak', currentStreak.value.toString());

  alert(`День добавлен! Текущая серия: ${currentStreak.value} дней`);
};

const forceSkipDay = () => {
  // Сбрасываем streak до 1
  currentStreak.value = 1;
  localStorage.setItem('currentStreak', '1');
  alert('Серия сброшена!');
};

const forceReset = () => {
  // Полный сброс
  currentStreak.value = 1;
  visitDates.value = [];
  totalVisits.value = 0;
  bestStreak.value = 0;

  localStorage.setItem('currentStreak', '1');
  localStorage.setItem('allVisits', '[]');
  localStorage.setItem('bestStreak', '0');
  localStorage.removeItem('lastVisitDate');

  alert('Все данные сброшены!');
};

// Вспомогательные методы
const getStreakDescription = () => {
  if (currentStreak.value === 1) return 'Начни свой легендарный путь!';
  if (currentStreak.value < 7) return 'Отличное начало! Продолжай в том же духе!';
  if (currentStreak.value < 30) return 'Неделя за неделей - ты становишься сильнее!';
  if (currentStreak.value < 100) return 'Месяц за месяцем - ты настоящий герой!';
  return 'Ты легенда! Продолжай свой путь!';
};

const getMotivationalText = () => {
  const texts = [
    'Каждый день - это шаг к совершенству!',
    'Систематичность - ключ к успеху!',
    'Ты делаешь это каждый день - ты молодец!',
    'Продолжай в том же духе!',
    'Ты становишься лучше с каждым днем!'
  ];
  return texts[Math.floor(Math.random() * texts.length)];
};

const getCurrentMonthName = () => {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];
  return months[new Date().getMonth()];
};

// Computed
const calendarDays = computed(generateCalendarDays);

// Хуки
onMounted(() => {
  loadTrackerData();
});

// Следим за изменением props
watch(() => props.currentDays, (newVal) => {
  currentStreak.value = newVal;
  loadTrackerData();
});
</script>

<style scoped>
.legendary-mode-content {
  max-width: 100%;
  padding: 15px;
}

.modal-header {
  text-align: center;
  margin-bottom: 20px;
}

.modal-header h2 {
  margin: 0;
  color: #ff6b35;
  font-size: 24px;
}

.streak-info {
  text-align: center;
  margin-bottom: 25px;
}

.current-streak {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
}

.streak-number {
  font-size: 48px;
  font-weight: bold;
  color: #ff6b35;
}

.streak-text {
  font-size: 18px;
  color: #666;
}

.streak-description {
  font-size: 16px;
  color: #333;
  margin: 0;
}

/* Статистика */
.stats-container {
  display: flex;
  justify-content: space-around;
  margin-bottom: 25px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #ff6b35;
}

.stat-label {
  font-size: 12px;
  color: #666;
  text-align: center;
}

.calendar-container {
  margin-bottom: 25px;
}

.calendar-header {
  text-align: center;
  margin-bottom: 15px;
}

.calendar-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.calendar-grid {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.calendar-days-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: #f8f9fa;
  border-bottom: 1px solid #e0e0e0;
}

.day-header {
  padding: 10px;
  text-align: center;
  font-weight: bold;
  color: #666;
  font-size: 12px;
}

.calendar-days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #f0f0f0;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  font-size: 14px;
  color: #333;
}

.calendar-day:nth-child(7n) {
  border-right: none;
}

.calendar-day.empty {
  background: #fafafa;
}

.calendar-day.active {
  background: linear-gradient(145deg, #ff6b35, #f7931e);
  color: white;
  font-weight: bold;
}

.calendar-day.today {
  border: 2px solid #ff6b35;
  font-weight: bold;
}

.calendar-day.future {
  color: #ccc;
}

.fire-icon {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 10px;
}

.motivational-text {
  text-align: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 20px;
}

.motivational-text p {
  margin: 0;
  font-size: 16px;
  color: #333;
  font-style: italic;
}

/* Стили для dev-кнопок */
.dev-controls {
  display: none;
  gap: 8px;
  justify-content: center;
  margin-top: 20px;
  padding: 10px;
  background: #f5f5f5;
  border-radius: 8px;
}

.dev-button {
  padding: 6px 10px;
  background: #e0e0e0;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s;
}

.dev-button:hover {
  background: #d0d0d0;
}

.dev-button:nth-child(1) { background: #e8f5e9; }
.dev-button:nth-child(2) { background: #fff8e1; }
.dev-button:nth-child(3) { background: #ffebee; }

@media (max-width: 768px) {
  .streak-number {
    font-size: 36px;
  }

  .calendar-day {
    font-size: 12px;
  }

  .stats-container {
    padding: 10px;
  }

  .stat-number {
    font-size: 20px;
  }

  .stat-label {
    font-size: 10px;
  }

  .dev-controls {
    flex-direction: column;
  }
}
</style>
