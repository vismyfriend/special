<template>
  <div class="legendary-mode-content">
    <!-- Заголовок модального окна -->
    <div class="modal-header">
      <h2>🔥 Legendary Mode</h2>
    </div>

    <!-- Блок с текущей серией -->
    <div class="streak-info">
      <div class="current-streak">
        <span class="streak-number">{{ legendaryStreak }}</span>
        <span class="streak-text">дней подряд</span>
      </div>
      <p class="streak-description">
        {{ getStreakDescription() }}
      </p>
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


    <div v-if="isDevMode" class="dev-controls">
      <button @click="forceAddDay" class="dev-button">[DEV] +1 день</button>
      <button @click="forceSkipDay" class="dev-button">[DEV] Пропустить день</button>
      <button @click="forceReset" class="dev-button">[DEV] Сбросить</button>
    </div>

  </div>
</template>

<script setup>

import { ref, computed, onMounted, watch } from 'vue';


// Добавляем в начало скрипта
const isDevMode = import.meta.env.DEV; // Кнопки будут видны только в режиме разработки

// Методы для тестирования
const forceAddDay = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Эмулируем посещение на следующий день
  const newDate = new Date(lastVisitDate.value || today);
  newDate.setDate(newDate.getDate() + 1);

  lastVisitDate.value = newDate;
  updateStreakValue(legendaryStreak.value + 1);
  visitDates.value.push(newDate.toISOString());
};

const forceReset = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  lastVisitDate.value = today;
  updateStreakValue(1);
  visitDates.value = [today.toISOString()]; // Полностью очищаем массив посещений
  updateStreakValue(1);
};

// Новая функция генерации дней календаря
const generateCalendarDays = () => {
  const today = new Date();
  const currentMonth = today.getMonth();
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
    const currentDate = new Date(currentYear, currentMonth, i);
    const isToday = i === today.getDate();
    const isFuture = currentDate > today;
    const isActive = visitDates.value.some(dateStr => {
      const visitDate = new Date(dateStr);
      return visitDate.getDate() === i &&
        visitDate.getMonth() === currentMonth &&
        visitDate.getFullYear() === currentYear;
    });

    days.push({ date: i, isActive, isToday, isFuture });
  }

  return days;
};
const forceSkipDay = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Эмулируем пропуск дня (устанавливаем последнее посещение как "позавчера")
  const newDate = new Date(lastVisitDate.value || today);
  newDate.setDate(newDate.getDate() + 1); // +1 дня = пропуск одного дня

  lastVisitDate.value = newDate;
  updateStreakValue(1); // Сбрасываем счетчик до 1
  visitDates.value.push(today.toISOString()); // Добавляем текущий день

  alert(`Пропущен день! Счетчик сброшен. Последнее посещение: ${newDate.toLocaleDateString()}`);
};



const props = defineProps({
  currentDays: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['update-days']);

// Основные данные
const legendaryStreak = ref(props.currentDays);
const lastVisitDate = ref(null);
const visitDates = ref([]);
const currentYear = new Date().getFullYear();
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

// Обновление значения с синхронизацией
const updateStreakValue = (newValue) => {
  legendaryStreak.value = newValue;
  emit('update-days', newValue);
  saveLegendaryData();
};

// Инициализация
onMounted(() => {
  loadLegendaryData();
  checkStreak();
});

// Проверка и обновление серии
const checkStreak = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (!lastVisitDate.value) {
    initFirstVisit(today);
    return;
  }

  const lastVisit = new Date(lastVisitDate.value);
  lastVisit.setHours(0, 0, 0, 0);
  const daysDiff = Math.floor((today - lastVisit) / (86400000));

  if (daysDiff === 0) return;

  if (daysDiff === 1) {
    // Продолжение серии
    updateStreakValue(legendaryStreak.value + 1);
    visitDates.value.push(today.toISOString());
    lastVisitDate.value = today;
  } else if (daysDiff > 1) {
    // Сброс серии
    updateStreakValue(1);
    visitDates.value.push(today.toISOString());
    lastVisitDate.value = today;
  }
};

// 4. Методы для работы с localStorage
const loadLegendaryData = () => {
  try {
    const savedStreak = localStorage.getItem('legendaryStreak');
    const savedLastVisit = localStorage.getItem('lastVisitDate');
    const savedVisitDates = localStorage.getItem('visitDates');

    if (savedStreak) legendaryStreak.value = parseInt(savedStreak) || 1;
    if (savedLastVisit) lastVisitDate.value = new Date(savedLastVisit);
    if (savedVisitDates) visitDates.value = JSON.parse(savedVisitDates);

    console.log('Data loaded from localStorage:', {
      streak: legendaryStreak.value,
      lastVisit: lastVisitDate.value,
      visits: visitDates.value.length
    });
  } catch (e) {
    console.error('Error loading legendary data:', e);
    // Восстанавливаем значения по умолчанию при ошибке
    legendaryStreak.value = 1;
    lastVisitDate.value = new Date();
    visitDates.value = [new Date().toISOString()];
  }
};

const saveLegendaryData = () => {
  try {
    localStorage.setItem('legendaryStreak', legendaryStreak.value.toString());
    localStorage.setItem('lastVisitDate', new Date().toISOString());
    localStorage.setItem('visitDates', JSON.stringify(visitDates.value));
    console.log('Data saved to localStorage');
  } catch (e) {
    console.error('Error saving legendary data:', e);
  }
};


const initFirstVisit = (today) => {
  console.log('First visit detected');
  lastVisitDate.value = today;
  legendaryStreak.value = 1;
  visitDates.value = [today.toISOString()];
  saveLegendaryData();
};


// 6. Вспомогательные методы
const getStreakDescription = () => {
  if (legendaryStreak.value === 1) return 'Начни свой легендарный путь!';
  if (legendaryStreak.value < 7) return 'Отличное начало! Продолжай в том же духе!';
  if (legendaryStreak.value < 30) return 'Неделя за неделей - ты становишься сильнее!';
  if (legendaryStreak.value < 100) return 'Месяц за месяцем - ты настоящий герой!';
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
const calendarDays = computed(generateCalendarDays);

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

@media (max-width: 768px) {
  .streak-number {
    font-size: 36px;
  }

  .calendar-day {
    font-size: 12px;
  }
}

/* dev-кнопки display flex - отобразить */
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

.dev-button:nth-child(1) { background: #e8f5e9; } /* +1 день - зеленый */
.dev-button:nth-child(2) { background: #fff8e1; } /* Пропустить - желтый */
.dev-button:nth-child(3) { background: #ffebee; } /* Сбросить - красный */
</style>
