<template>
  <div class="legendary-mode-content">
    <div v-if="showYearView">
      <div class="modal-header">
      <h2>Legendary Mode</h2>
    </div>

      <!-- Блок с текущей серией -->
      <div class="streak-info">
      <div class="current-streak">
        <span class="streak-text">Вы тренируетесь</span>
        <span class="streak-number">{{ currentStreak }}</span>
        <span class="streak-text">{{ declensionDays(currentStreak) }} подряд</span>
      </div>
      <p class="streak-description"
         v-html="getStreakDescription()">
      </p>
    </div>

      <!-- Статистика -->
      <div class="stats-container">
      <div class="stat-item">
        <span class="stat-number">{{ totalVisits }}</span>
        <span class="stat-label">всего <br>занятий</span>
      </div>
        <div class="stat-item">
          <span class="stat-number">{{ currentStreak }}</span>
          <span class="stat-label">{{ declensionDays(currentStreak) }} без <br>пропусков</span>
        </div>
      <div class="stat-item">
        <span class="stat-number">{{ bestStreak }}</span>
        <span class="stat-label">прошлый <br> рекорд</span>
      </div>
    </div>
    </div>
    <!-- Календарь (кликабельный) -->
    <div
      class="calendar-container"
      @click="toggleCalendarView"
      :class="{ 'clickable': true }"
    >
      <!-- Режим: текущий месяц -->
      <div v-if="!showYearView" class="month-view">
        <div class="calendar-header">
          <h3>{{ getCurrentMonthName() }} {{ currentYear }}</h3>
        </div>

        <div class="calendar-grid">
          <div class="calendar-days-header">
            <div v-for="day in weekDays" :key="day" class="day-header">{{ day }}</div>
          </div>
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
        <!-- Подсказка для переключения -->
        <div class="toggle-hint">👆 нажмите, чтобы увидеть подробнее</div>
      </div>

      <!-- Режим: несколько месяцев -->
      <div v-else class="year-calendar-container">
        <div class="year-grid">
          <div
            v-for="(month, index) in yearCalendar"
            :key="index"
            class="month-card"
            :class="{
              'current-month': month.isCurrentMonth,
              'past-month': month.isPast,
              'future-month': month.isFuture
            }"
          >
            <div class="month-name">
              {{ month.name }}
              <span v-if="month.year !== currentYear" class="month-year">{{ month.year }}</span>
            </div>
            <div class="month-days-grid">
              <div
                v-for="day in month.days"
                :key="day.date"
                class="month-day"
                :class="{
                  'empty': !day.date,
                  'active': day.isActive
                }"
              >
                <span v-if="day.date">{{ day.date }}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- Подсказка для переключения -->
        <div class="toggle-hint">👆 нажмите, чтобы вернуться к текущему месяцу</div>
      </div>
    </div>

    <!-- Мотивирующий текст -->
    <div class="motivational-text">
      <p v-html="getMotivationalText()">
      </p>
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

// 🆕 Эмит для обновления дней (если нужно)
const emit = defineEmits(['updateDays']);

const isDevMode = import.meta.env.DEV;

// Основные данные
const currentStreak = ref(props.currentDays);
const totalVisits = ref(0);
const bestStreak = ref(0);
const visitDates = ref([]);
const currentYear = new Date().getFullYear();
const weekDays = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];

// 🆕 По умолчанию показываем несколько месяцев (false)
const showYearView = ref(false);

// 🆕 Функция переключения режима
const toggleCalendarView = () => {
  showYearView.value = !showYearView.value;
};

// Генерация ограниченного календаря (4 месяца назад + текущий + 1 месяц вперед)
const yearCalendar = computed(() => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();
  const months = [];

  const startMonth = currentMonth - 4;
  const endMonth = currentMonth + 1;

  for (let month = startMonth; month <= endMonth; month++) {
    let year = currentYear;
    let adjustedMonth = month;

    if (month < 0) {
      year = currentYear - 1;
      adjustedMonth = 12 + month;
    } else if (month > 11) {
      year = currentYear + 1;
      adjustedMonth = month - 12;
    }

    const firstDay = new Date(year, adjustedMonth, 1);
    const lastDay = new Date(year, adjustedMonth + 1, 0);
    let firstDayOfWeek = firstDay.getDay();
    if (firstDayOfWeek === 0) firstDayOfWeek = 7;

    const days = [];

    for (let i = 1; i < firstDayOfWeek; i++) {
      days.push({ date: null, isActive: false });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      const dateStr = `${year}-${String(adjustedMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      const isActive = visitDates.value.includes(dateStr);
      days.push({
        date: i,
        isActive
      });
    }

    months.push({
      name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][adjustedMonth],
      year: year,
      isCurrentMonth: month === currentMonth,
      isPast: month < currentMonth,
      isFuture: month > currentMonth,
      days
    });
  }

  return months;
});

const declensionDays = (number) => {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 19) return 'дней';
  if (lastDigit === 1) return 'день';
  if (lastDigit >= 2 && lastDigit <= 4) return 'дня';
  return 'дней';
};

const calculateBestStreakFromHistory = (dates) => {
  if (!dates || dates.length === 0) return 0;

  const sortedDates = [...dates].sort();
  let currentStreak = 1;
  let maxStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1]);
    const currDate = new Date(sortedDates[i]);
    const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      maxStreak = Math.max(maxStreak, currentStreak);
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }

  return maxStreak;
};

// Загрузка данных
function loadTrackerData() {
  try {
    currentStreak.value = props.currentDays;

    const savedVisits = localStorage.getItem('allVisits');

    if (savedVisits) {
      visitDates.value = JSON.parse(savedVisits);
      totalVisits.value = visitDates.value.length;

      bestStreak.value = calculateBestStreakFromHistory(visitDates.value);
      localStorage.setItem('bestStreak', bestStreak.value.toString());
    }

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

  for (let i = 1; i < firstDayOfWeek; i++) {
    days.push({ date: null, isActive: false, isToday: false, isFuture: false });
  }

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

  if (!visitDates.value.includes(yesterdayStr)) {
    visitDates.value.push(yesterdayStr);
  }

  currentStreak.value += 1;
  totalVisits.value = visitDates.value.length;

  localStorage.setItem('allVisits', JSON.stringify(visitDates.value));
  localStorage.setItem('currentStreak', currentStreak.value.toString());

  // Обновляем bestStreak
  bestStreak.value = calculateBestStreakFromHistory(visitDates.value);
  localStorage.setItem('bestStreak', bestStreak.value.toString());

  emit('updateDays', currentStreak.value);
  alert(`День добавлен! Текущая серия: ${currentStreak.value} дней`);
};

const forceSkipDay = () => {
  currentStreak.value = 1;
  localStorage.setItem('currentStreak', '1');
  emit('updateDays', currentStreak.value);
  alert('Серия сброшена!');
};

const forceReset = () => {
  currentStreak.value = 1;
  visitDates.value = [];
  totalVisits.value = 0;
  bestStreak.value = 0;

  localStorage.setItem('currentStreak', '1');
  localStorage.setItem('allVisits', '[]');
  localStorage.setItem('bestStreak', '0');
  localStorage.removeItem('lastVisitDate');

  emit('updateDays', currentStreak.value);
  alert('Все данные сброшены!');
};

// Вспомогательные методы
const getStreakDescription = () => {
  if (currentStreak.value === 1) return '"Дорога длиною в 1000 миль<br> начинается с первого шага!"';
  if (currentStreak.value === 2) return 'Вижу цель - не вижу преград!';
  if (currentStreak.value < 7) return 'Дальше будет круче!';
  if (currentStreak.value < 30) return 'День за днём - приходит уверенность!';
  if (currentStreak.value < 100) return 'Винсент будет тобой гордиться!';
  return 'Ты легенда! Продолжай свой путь!';
};

const getMotivationalText = () => {
  const texts = [
    'Каждый день по чуть-чуть!',
    'Систематичность - ключ к успеху!',
    'Сова из Дуолинго нам позавидует!',
    'Терпение и труд результаты дадут!',
    'Вай вай какой студент! Молодец!'
  ];
  return texts[Math.floor(Math.random() * texts.length)];
};

const getCurrentMonthName = () => {
  const months = [
    'Джэ нью э ри', 'Фэ бру э ри', 'Марч', 'Эй прил', 'Мэй', 'Джун',
    'Джу лай', 'О гэст', 'Сэп тэм бэр', 'Ок тоу бэр', 'Ноу вэм бэр', 'Ди сэм бэр'
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
  padding: 5px;
}

.modal-header {
  text-align: center;
  margin-bottom: 5px;
  font-family: Special_f1;
}

.modal-header h2 {
  margin: 0;
  color: #ff6b35;
  font-size: 24px;
}

.streak-info {
  text-align: center;
  margin-bottom: 10px;
}

.current-streak {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 10px;
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
  margin-bottom: 5px;
  padding: 1px;
  background: #f8f9fa;
  border-radius: 10px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1px;
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

/* 🆕 Календарь кликабельный */
.calendar-container {
  cursor: pointer;
  margin-bottom: 25px;
  transition: all 0.3s ease;
  border-radius: 12px;
  padding: 4px;
}

.calendar-container:hover {
  background: rgba(255, 107, 53, 0.05);
}

.calendar-container:active {
  transform: scale(0.99);
}

/* 🆕 Подсказка для переключения */
.toggle-hint {
  text-align: center;
  font-size: 11px;
  color: #999;
  margin-top: 6px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
  user-select: none;
}

.calendar-container:hover .toggle-hint {
  opacity: 1;
}

.calendar-header {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 2px;
}

.calendar-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-family: Special_f1;
  padding-bottom: 15px;
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
  border-radius: 7px;

}

.calendar-day.today {
  border: 2px solid #090909;
  background: linear-gradient(145deg, #f7931e, #ed4f15);
  border-radius: 7px;

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
  padding: 5px;
  background: #f8f9fa;
  border-radius: 8px;
  line-height: 15px;
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

/* Годовой календарь */
.year-calendar-container {
  margin-top: 5px;
  max-height: 400px;
  overflow-y: auto;
  padding-right: 5px;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #ff6b35;
    border-radius: 10px;
  }
}

.year-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
}

.month-card {
  background: #f8f9fa;
  border-radius: 6px;
  padding: 6px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;

  &.current-month {
    border: 2px solid #ff6b35;
    background: #fff8f0;
    box-shadow: 0 2px 10px rgba(255, 107, 53, 0.15);
  }

  &.past-month {
    opacity: 0.85;
  }

  &.future-month {
    opacity: 0.7;

    .month-day.active {
      background: #d4d4d4;
      color: #999;
    }
  }

  .month-name {
    text-align: center;
    font-size: 10px;
    font-weight: bold;
    color: #333;
    margin-bottom: 4px;
    padding-bottom: 3px;
    border-bottom: 1px solid #e0e0e0;

    .month-year {
      font-size: 8px;
      font-weight: normal;
      color: #999;
      margin-left: 2px;
    }
  }

  .month-days-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 1px;
  }

  .month-day {
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 8px;
    color: #999;
    border-radius: 2px;
    transition: all 0.2s ease;

    &.empty {
      background: transparent;
    }

    &.active {
      background: #ff6b35;
      color: white;
      font-weight: bold;
    }
  }
}

/* Адаптив */
@media (max-width: 600px) {
  .calendar-container {
    transform: scale(0.85);
    margin-bottom: 5px;
    transform-origin: top center;
  }

  .calendar-header h3 {
    font-size: 20px;
  }

  .streak-text {
    font-size: 16px;
    color: #666;
  }

  .year-grid {
    gap: 5px;
  }

  .month-card {
    padding: 4px;
    border-radius: 4px;

    .month-name {
      font-size: 8px;
      margin-bottom: 3px;
      padding-bottom: 2px;
    }

    .month-day {
      font-size: 7px;
    }
  }

  .toggle-hint {
    font-size: 10px;
  }
}

@media (max-width: 400px) {
  .year-grid {
    gap: 4px;
  }

  .month-card {
    padding: 3px;

    .month-name {
      font-size: 7px;
    }

    .month-day {
      font-size: 6px;
    }
  }

  .calendar-container {
    transform: scale(0.8);
  }
}
</style>
