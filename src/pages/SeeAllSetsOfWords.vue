<!-- vbase-3-setup -->
<template>
  <div class="relative">
    <div id="phoneFrame">
<!--      <p class="bubble left" id="intro-message">Choose<br> a mission</p>-->
      <p class="bubble left" id="intro-message">vismyfriend<br> and <br> vismyteacher</p>

      <div class="q-pa-15 ">
<!--        <img src="../assets/images/ancient_man.jpeg" alt="logo" class="border-radius50">-->
        <img src="../assets/images/choose%20mission%20pic%20snowman.jpeg" alt="logo" class="border-radius50">

        <!-- Поле поиска -->
        <div class="search-container">
          <div class="search-input-wrapper">
            <input
              v-model="searchQuery"
              placeholder="_ _ _ Введи задание или листай 👇"
              class="search-input"
            />
            <button
              v-if="showPronunciationButton"
              class="pronunciation-btn"
              @click="handlePronunciationSearch"
              title="Найти произношение в Google"
            >
              🎧
            </button>
          </div>
        </div>

        <!-- Используем filteredSets для отображения карточек -->
        <div class="v-cards-choose">

          <!-- 1. Создать свой набор (всегда первый) -->
          <div
            class="v-card-choose tooltip-wrapper create-special-set"
            role="button"
            @click="showSpecialCardAlert"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            Создать свой S.P.E.C.I.A.L. набор
            <div class="custom-tooltip">
              Click to see special content
            </div>
          </div>

          <!-- 1 display none, а дальше 2-3-4 - по порядку это 3 обычных набора -->
          <div
            class="v-card-choose tooltip-wrapper"
            v-for="currentSetOfWords in filteredSets.slice(0, 3)"
            :key="currentSetOfWords.missionName"
            role="button"
            @click="handlePasswordProtectedClick(currentSetOfWords)"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            <div class="card-content">
              <span class="card-description">
                {{ currentSetOfWords.missionVisibleName }}
              </span>
              <span class="card-icons">
                <span class="card-stars" v-if="currentSetOfWords.stars">
                  {{ getLevelStars(currentSetOfWords.stars) }}
                </span>
                <span class="game-icon" v-if="currentSetOfWords.gameIcon">
                  {{ currentSetOfWords.gameIcon }}
                </span>
                <img
                  v-if="currentSetOfWords.gameImg"
                  :src="getImagePath(currentSetOfWords.gameImg)"
                  class="game-image"
                  alt="game icon"
                >
              </span>
            </div>
            <div class="custom-tooltip">
              <div class="tooltip-content">
                <span class="mission-name">{{ currentSetOfWords.missionDescription }}</span>
                <span class="mission-icons">
                  <span class="mission-stars" v-if="currentSetOfWords.stars">
                    {{ getLevelStars(currentSetOfWords.stars) }}
                  </span>
                  <span class="game-icon" v-if="currentSetOfWords.gameIcon">
                    {{ currentSetOfWords.gameIcon }}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div
            class="v-card-choose tooltip-wrapper glassMorphism"
            role="button"
            @click="tapalka"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            Разминка
            <div class="custom-tooltip">
              Произношение
            </div>
          </div>

          <!-- 5. Рандомные вопросы  -->
          <div
            class="v-card-choose tooltip-wrapper randomQuestions random-set"
            role="button"
            @click="playRandomQuestions"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            Рандомные вопросы : 🎲
            <div class="custom-tooltip">
              Random Questions
            </div>
          </div>

          <!-- КАТЕГОРИЯ EXAMPLES -->
          <div
            v-if="shouldShowCategoryExamples"
            class="v-card-choose tooltip-wrapper categoryExamples"
            @click="togglecategoryExamplesPatterns"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            <div class="card-content">
              <span class="card-description">
                examples ( {{ filteredCategoryExamplesSets.length }} )
              </span>
              <span class="card-icons">
                <span class="expand-icon">{{ iscategoryExamplesPatternsExpanded ? '▼' : '▶' }}</span>
              </span>
            </div>
            <div class="custom-tooltip">
              примеры заданий
            </div>
          </div>

          <!-- РАСКРЫТЫЕ НАБОРЫ КАТЕГОРИИ EXAMPLES -->
          <div
            v-if="iscategoryExamplesPatternsExpanded && filteredCategoryExamplesSets.length > 0"
            class="category-sets-container categoryExamples-sets"
          >
            <div
              v-for="currentSetOfWords in filteredCategoryExamplesSets"
              :key="currentSetOfWords.missionName"
              class="v-card-choose tooltip-wrapper category-set"
              @click="handlePasswordProtectedClick(currentSetOfWords)"
              :style="{
                '--offset-x': '5px',
                '--offset-y': '29.5px'
              }"
            >
              <div class="card-content">
                <span class="card-description">
                  {{ currentSetOfWords.missionVisibleName }}
                </span>
                <span class="card-icons">
                  <span class="card-stars" v-if="currentSetOfWords.stars">
                    {{ getLevelStars(currentSetOfWords.stars) }}
                  </span>
                  <span class="game-icon" v-if="currentSetOfWords.gameIcon">
                    {{ currentSetOfWords.gameIcon }}
                  </span>
                </span>
              </div>
              <div class="custom-tooltip">
                {{ currentSetOfWords.missionDescription }}
              </div>
            </div>
          </div>

          <!--Следующие 2 обычных наборов -->
          <div
            class="v-card-choose tooltip-wrapper"
            v-for="currentSetOfWords in filteredSets.slice(3, 5)"
            :key="currentSetOfWords.missionName"
            role="button"
            @click="handlePasswordProtectedClick(currentSetOfWords)"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            <div class="card-content">
              <span class="card-description">
                {{ currentSetOfWords.missionVisibleName }}
              </span>
              <span class="card-icons">
                <span class="card-stars" v-if="currentSetOfWords.stars">
                  {{ getLevelStars(currentSetOfWords.stars) }}
                </span>
                <span class="game-icon" v-if="currentSetOfWords.gameIcon">
                  {{ currentSetOfWords.gameIcon }}
                </span>
                <img
                  v-if="currentSetOfWords.gameImg"
                  :src="getImagePath(currentSetOfWords.gameImg)"
                  class="game-image"
                  alt="game icon"
                >
              </span>
            </div>
            <div class="custom-tooltip">
              <div class="tooltip-content">
                <span class="mission-name">{{ currentSetOfWords.missionDescription }}</span>
                <span class="mission-icons">
                  <span class="mission-stars" v-if="currentSetOfWords.stars">
                    {{ getLevelStars(currentSetOfWords.stars) }}
                  </span>
                  <span class="game-icon" v-if="currentSetOfWords.gameIcon">
                    {{ currentSetOfWords.gameIcon }}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <!--Следующие 2 обычных наборов -->
          <div
            class="v-card-choose tooltip-wrapper"
            v-for="currentSetOfWords in filteredSets.slice(5, 8)"
            :key="currentSetOfWords.missionName"
            role="button"
            @click="handlePasswordProtectedClick(currentSetOfWords)"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            <div class="card-content">
              <span class="card-description">
                {{ currentSetOfWords.missionVisibleName }}
              </span>
              <span class="card-icons">
                <span class="card-stars" v-if="currentSetOfWords.stars">
                  {{ getLevelStars(currentSetOfWords.stars) }}
                </span>
                <span class="game-icon" v-if="currentSetOfWords.gameIcon">
                  {{ currentSetOfWords.gameIcon }}
                </span>
                <img
                  v-if="currentSetOfWords.gameImg"
                  :src="getImagePath(currentSetOfWords.gameImg)"
                  class="game-image"
                  alt="game icon"
                >
              </span>
            </div>
            <div class="custom-tooltip">
              <div class="tooltip-content">
                <span class="mission-name">{{ currentSetOfWords.missionDescription }}</span>
                <span class="mission-icons">
                  <span class="mission-stars" v-if="currentSetOfWords.stars">
                    {{ getLevelStars(currentSetOfWords.stars) }}
                  </span>
                  <span class="game-icon" v-if="currentSetOfWords.gameIcon">
                    {{ currentSetOfWords.gameIcon }}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <!-- Змейка -->
          <div
            class="v-card-choose tooltip-wrapper glassMorphism3"
            role="button"
            @click="playSnake"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            Snake - снэЙк - змеЙка
            <div class="custom-tooltip">
              Snaсk - снЭк - перекус
            </div>
          </div>

          <!-- Category Game Patterns -->
          <div
            v-if="shouldShowGamePatterns"
            class="v-card-choose tooltip-wrapper category-game-patterns"
            @click="toggleGamePatterns"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            <div class="card-content">
              <span class="card-description">
                🎮 Games by Vincent ( {{ filteredGamePatternsSets.length }} )
              </span>
              <span class="card-icons">
                <span class="expand-icon">{{ isGamePatternsExpanded ? '▼' : '▶' }}</span>
              </span>
            </div>
            <div class="custom-tooltip">
              Игры с паттернами
            </div>
          </div>

          <!-- Раскрытые наборы Game Patterns -->
          <div
            v-if="isGamePatternsExpanded && filteredGamePatternsSets.length > 0"
            class="category-sets-container category-game-patterns-sets"
          >
            <div
              v-for="currentSetOfWords in filteredGamePatternsSets"
              :key="currentSetOfWords.missionName"
              class="v-card-choose tooltip-wrapper category-set"
              @click="handlePasswordProtectedClick(currentSetOfWords)"
              :style="{
                '--offset-x': '5px',
                '--offset-y': '29.5px'
              }"
            >
              <div class="card-content">
                <span class="card-description">
                  {{ currentSetOfWords.missionVisibleName }}
                </span>
                <span class="card-icons">
                  <span class="card-stars" v-if="currentSetOfWords.stars">
                    {{ getLevelStars(currentSetOfWords.stars) }}
                  </span>
                  <span class="game-icon" v-if="currentSetOfWords.gameIcon">
                    {{ currentSetOfWords.gameIcon }}
                  </span>
                </span>
              </div>
              <div class="custom-tooltip">
                {{ currentSetOfWords.missionDescription }}
              </div>
            </div>
          </div>

          <!--Следующие 2 обычных наборов -->
          <div
            class="v-card-choose tooltip-wrapper"
            v-for="currentSetOfWords in filteredSets.slice(8, 11)"
            :key="currentSetOfWords.missionName"
            role="button"
            @click="handlePasswordProtectedClick(currentSetOfWords)"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            <div class="card-content">
              <span class="card-description">
                {{ currentSetOfWords.missionVisibleName }}
              </span>
              <span class="card-icons">
                <span class="card-stars" v-if="currentSetOfWords.stars">
                  {{ getLevelStars(currentSetOfWords.stars) }}
                </span>
                <span class="game-icon" v-if="currentSetOfWords.gameIcon">
                  {{ currentSetOfWords.gameIcon }}
                </span>
                <img
                  v-if="currentSetOfWords.gameImg"
                  :src="getImagePath(currentSetOfWords.gameImg)"
                  class="game-image"
                  alt="game icon"
                >
              </span>
            </div>
            <div class="custom-tooltip">
              <div class="tooltip-content">
                <span class="mission-name">{{ currentSetOfWords.missionDescription }}</span>
                <span class="mission-icons">
                  <span class="mission-stars" v-if="currentSetOfWords.stars">
                    {{ getLevelStars(currentSetOfWords.stars) }}
                  </span>
                  <span class="game-icon" v-if="currentSetOfWords.gameIcon">
                    {{ currentSetOfWords.gameIcon }}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <!-- Все остальные обычные наборы -->
          <div
            class="v-card-choose tooltip-wrapper"
            v-for="currentSetOfWords in filteredSets.slice(11)"
            :key="currentSetOfWords.missionName"
            role="button"
            @click="handlePasswordProtectedClick(currentSetOfWords)"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            <div class="card-content">
              <span class="card-description">
                {{ currentSetOfWords.missionVisibleName }}
              </span>
              <span class="card-icons">
                <span class="card-stars" v-if="currentSetOfWords.stars">
                  {{ getLevelStars(currentSetOfWords.stars) }}
                </span>
                <span class="game-icon" v-if="currentSetOfWords.gameIcon">
                  {{ currentSetOfWords.gameIcon }}
                </span>
                <img
                  v-if="currentSetOfWords.gameImg"
                  :src="getImagePath(currentSetOfWords.gameImg)"
                  class="game-image"
                  alt="game icon"
                >
              </span>
            </div>

            <div class="custom-tooltip">
              <div class="tooltip-content">
                <span class="mission-name">{{ currentSetOfWords.missionDescription }}</span>
                <span class="mission-icons">
                  <span class="mission-stars" v-if="currentSetOfWords.stars">
                    {{ getLevelStars(currentSetOfWords.stars) }}
                  </span>
                  <span class="game-icon" v-if="currentSetOfWords.gameIcon">
                    {{ currentSetOfWords.gameIcon }}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <!-- 7. Остальные специальные карточки -->
          <div
            class="v-card-choose tooltip-wrapper random-set"
            role="button"
            @click="playRandomSet"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            Случайный набор слов 🎲
            <div class="custom-tooltip">
              Random Set
            </div>
          </div>

          <!-- КАТЕГОРИЯ ЧТЕНИЯ -->
          <div
            v-if="shouldShowReadingCategory"
            class="v-card-choose tooltip-wrapper reading-category"
            @click="toggleReadingCategory"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            <div class="card-content">
              <span class="card-description">
                 🚀 Интенсивы ( {{ filteredReadingSets.length }} )
              </span>
              <span class="card-icons">
                <span class="expand-icon">{{ isReadingExpanded ? '▼' : '▶' }}</span>
              </span>
            </div>
            <div class="custom-tooltip">
              for super agents
            </div>
          </div>

          <!-- РАСКРЫТЫЕ НАБОРЫ ЧТЕНИЯ -->
          <div
            v-if="isReadingExpanded && filteredReadingSets.length > 0"
            class="reading-sets-container"
          >
            <div
              v-for="currentSetOfWords in filteredReadingSets"
              :key="currentSetOfWords.missionName"
              class="v-card-choose tooltip-wrapper reading-set"
              @click="handlePasswordProtectedClick(currentSetOfWords)"
              :style="{
                '--offset-x': '5px',
                '--offset-y': '29.5px'
              }"
            >
              <div class="card-content">
                <span class="card-description">
                  {{ currentSetOfWords.missionVisibleName }}
                </span>
                <span class="card-icons">
                  <span class="card-stars" v-if="currentSetOfWords.stars">
                    {{ getLevelStars(currentSetOfWords.stars) }}
                  </span>
                  <span class="game-icon" v-if="currentSetOfWords.gameIcon">
                    {{ currentSetOfWords.gameIcon }}
                  </span>
                </span>
              </div>
              <div class="custom-tooltip">
                {{ currentSetOfWords.missionDescription }}
              </div>
            </div>
          </div>

          <!-- Category X -->
          <div
            v-if="shouldShowCategoryX"
            class="v-card-choose tooltip-wrapper category-x"
            @click="toggleCategoryX"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            <div class="card-content">
              <span class="card-description">
                🔥 Категория X ( {{ filteredCategoryXSets.length }} )
              </span>
              <span class="card-icons">
                <span class="expand-icon">{{ isCategoryXExpanded ? '▼' : '▶' }}</span>
              </span>
            </div>
            <div class="custom-tooltip">
              Секретные задания категории X
            </div>
          </div>

          <!-- РАСКРЫТЫЕ НАБОРЫ КАТЕГОРИИ X -->
          <div
            v-if="isCategoryXExpanded && filteredCategoryXSets.length > 0"
            class="category-sets-container category-x-sets"
          >
            <div
              v-for="currentSetOfWords in filteredCategoryXSets"
              :key="currentSetOfWords.missionName"
              class="v-card-choose tooltip-wrapper category-set"
              @click="handlePasswordProtectedClick(currentSetOfWords)"
              :style="{
                '--offset-x': '5px',
                '--offset-y': '29.5px'
              }"
            >
              <div class="card-content">
                <span class="card-description">
                  {{ currentSetOfWords.missionVisibleName }}
                </span>
                <span class="card-icons">
                  <span class="card-stars" v-if="currentSetOfWords.stars">
                    {{ getLevelStars(currentSetOfWords.stars) }}
                  </span>
                  <span class="game-icon" v-if="currentSetOfWords.gameIcon">
                    {{ currentSetOfWords.gameIcon }}
                  </span>
                </span>
              </div>
              <div class="custom-tooltip">
                {{ currentSetOfWords.missionDescription }}
              </div>
            </div>
          </div>

          <!-- Category Chinese -->
          <div
            v-if="shouldShowChinese"
            class="v-card-choose tooltip-wrapper category-chinese"
            @click="toggleChinese"
            :style="{
              '--offset-x': '5px',
              '--offset-y': '29.5px'
            }"
          >
            <div class="card-content">
              <span class="card-description">
                🈷️ Китайский язык ( {{ filteredChineseSets.length }} )
              </span>
              <span class="card-icons">
                <span class="expand-icon">{{ isChineseExpanded ? '▼' : '▶' }}</span>
              </span>
            </div>
            <div class="custom-tooltip">
              Изучение китайского языка
            </div>
          </div>

          <!-- Раскрытые наборы Chinese -->
          <div
            v-if="isChineseExpanded && filteredChineseSets.length > 0"
            class="category-sets-container category-chinese-sets"
          >
            <div
              v-for="currentSetOfWords in filteredChineseSets"
              :key="currentSetOfWords.missionName"
              class="v-card-choose tooltip-wrapper category-set"
              @click="handlePasswordProtectedClick(currentSetOfWords)"
              :style="{
                '--offset-x': '5px',
                '--offset-y': '29.5px'
              }"
            >
              <div class="card-content">
                <span class="card-description">
                  {{ currentSetOfWords.missionVisibleName }}
                </span>
                <span class="card-icons">
                  <span class="card-stars" v-if="currentSetOfWords.stars">
                    {{ getLevelStars(currentSetOfWords.stars) }}
                  </span>
                  <span class="game-icon" v-if="currentSetOfWords.gameIcon">
                    {{ currentSetOfWords.gameIcon }}
                  </span>
                </span>
              </div>
              <div class="custom-tooltip">
                {{ currentSetOfWords.missionDescription }}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Кастомное модальное окно для пароля -->
    <div v-if="passwordModal" class="password-modal-overlay">
      <div class="password-modal" :class="{ 'shake': shake }" @animationend="shake = false">
        <div class="password-modal-header">
          <div class="lock-icon">🔒</div>
          <h3>Секретный доступ</h3>
        </div>

        <div class="password-modal-body">
          <p>Этот набор защищен паролем</p>

          <div class="password-input-wrapper">
            <input
              v-model="passwordInput"
              type="password"
              placeholder="Введите кодовое слово..."
              class="password-input"
              @keyup.enter="checkPassword"
            >
            <button class="unlock-btn" @click="checkPassword">
              <div class="unlock-icon">🔓</div>
            </button>
          </div>

          <p class="hint">Подсказка: спросите у Винсента</p>
        </div>

        <button class="close-modal" @click="closeModal">✕</button>
      </div>
    </div>
  </div>
</template>


<script setup>
import { useQuasar } from 'quasar';
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { onMounted } from "vue";
import { allGamesAndSetsOfWordsList } from "src/dataForGames/allGamesAndSetsOfWordsList";

// const text = "choose \na \nmission";
// const text = "Vincent \nis \nmy friend";
const text = "to Vincent\nfrom me\nHappy New Year";
const speed = 150;
const introMessage = ref(null);
const searchQuery = ref('');
const router = useRouter()
const $q = useQuasar()

// Добавляем новые переменные для модального окна
const passwordModal = ref(false);
const passwordInput = ref('');
const currentSetToUnlock = ref(null);
const shake = ref(false);

/// Категории
const isReadingExpanded = ref(false)
const isCategoryXExpanded = ref(false)
const iscategoryExamplesPatternsExpanded = ref(false)
const isGamePatternsExpanded = ref(false)
const isChineseExpanded = ref(false)



// Вычисляемое свойство для показа кнопки
const showPronunciationButton = computed(() => {
  return searchQuery.value.trim().length > 2;
});

// Функция для поиска произношения
const handlePronunciationSearch = () => {
  const query = searchQuery.value.trim();

  let searchTerm;


    searchTerm = query;

  openPronunciationSearch(searchTerm);
  searchQuery.value = '';

};

const openPronunciationSearch = (term) => {
  // Очищаем и нормализуем поисковый термин
  const cleanTerm = term
    .replace(/[^\w\sа-яё]/gi, '') // убираем специальные символы
    .trim()
    .replace(/\s+/g, '+'); // заменяем пробелы на + для URL

  // Создаем URL для поиска произношения в Google
  const googleSearchUrl = `https://www.google.com/search?q=how+to+pronounce+ ${cleanTerm}`;

  // Открываем в новой вкладке
  window.open(googleSearchUrl, '_blank');

  // Показываем уведомление
  $q.notify({
    message: `Ищем произношение: ${term}`,
    color: 'positive',
    timeout: 2000,
    position: 'top'
  });
};



// для компактности кода проверяем наличие категорий у наборов
const hasCategory = (set, categoryName) => {
  return set.category === categoryName ||
    (Array.isArray(set.category) && set.category.includes(categoryName))
}

// Компьютеды для группировки
const readingSets = computed(() => {
  return allGamesAndSetsOfWordsList.filter(set =>
    set.active && hasCategory(set, 'reading')
  )
})

const categoryXSets = computed(() => {
  return allGamesAndSetsOfWordsList.filter(set =>
    set.active && hasCategory(set, 'categoryX')
  )
})

const categoryExamplesPatternsSets = computed(() => {
  return allGamesAndSetsOfWordsList.filter(set =>
    set.active && hasCategory(set, 'categoryExamplesPatterns')
  )
})

const gamePatternsSets = computed(() => {
  return allGamesAndSetsOfWordsList.filter(set =>
    set.active && hasCategory(set, 'gamePatterns')
  )
})

const chineseSets = computed(() => {
  return allGamesAndSetsOfWordsList.filter(set =>
    set.active && hasCategory(set, 'chinese')
  )
})

// Улучшенная функция нормализации
const normalizeString = (str) => {
  if (!str) return '';
  return str.toString().toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\wа-яё\/]/g, '');
};

// ОПТИМИЗИРОВАННАЯ ФИЛЬТРАЦИЯ С УЧЕТОМ КАТЕГОРИЙ
const filteredSets = computed(() => {
  const query = normalizeString(searchQuery.value).replace(/\//g, '');

  if (!query) {
    // Без поиска - показываем обычные наборы (без тех, что в категориях)
    return AllSetsOfWords.value.filter(set =>
      set.active &&
      !hasCategory(set, 'reading') &&
      !hasCategory(set, 'categoryX') &&
      !hasCategory(set, 'categoryExamplesPatterns') &&
      !hasCategory(set, 'gamePatterns') &&
      !hasCategory(set, 'chinese')
    );
  }

  // С поиском - используем Set для устранения дубликатов
  const seen = new Set();
  const result = [];

  AllSetsOfWords.value.forEach(set => {
    if (!set.active) return;

    const missionId = set.missionName || set.missionVisibleName;
    if (seen.has(missionId)) return;

    // Нормализуем все поля для поиска
    const searchFields = [
      set.missionVisibleName,
      set.missionDescription,
      set.missionName,
      set.path,
      set.url,
      set.category ? (Array.isArray(set.category) ? set.category.join(' ') : set.category) : ''
    ].filter(Boolean);

    const matchesSearch = searchFields.some(field =>
      normalizeString(field).includes(query)
    );

    if (matchesSearch) {
      seen.add(missionId);
      result.push(set);
    }
  });

  return result;
});

// НОВЫЕ КОМПЬЮТЕДЫ ДЛЯ УМНОГО СКРЫТИЯ КАТЕГОРИЙ
const shouldShowReadingCategory = computed(() => {
  if (!searchQuery.value) return readingSets.value.length > 0;

  const query = normalizeString(searchQuery.value);
  const categoryNameMatches = 'чтение reading'.includes(query) ||
    'интенсивы'.includes(query);

  const hasMatchingMissions = readingSets.value.some(set => {
    const searchFields = [
      set.missionVisibleName,
      set.missionDescription,
      set.missionName
    ];
    return searchFields.some(field =>
      normalizeString(field).includes(query)
    );
  });

  return categoryNameMatches || hasMatchingMissions;
});

const shouldShowCategoryX = computed(() => {
  if (!searchQuery.value) return categoryXSets.value.length > 0;

  const query = normalizeString(searchQuery.value);
  const categoryNameMatches = 'категория x categoryx'.includes(query) ||
    'секретные'.includes(query);

  const hasMatchingMissions = categoryXSets.value.some(set => {
    const searchFields = [
      set.missionVisibleName,
      set.missionDescription,
      set.missionName
    ];
    return searchFields.some(field =>
      normalizeString(field).includes(query)
    );
  });

  return categoryNameMatches || hasMatchingMissions;
});

const shouldShowCategoryExamples = computed(() => {
  if (!searchQuery.value) return categoryExamplesPatternsSets.value.length > 0;

  const query = normalizeString(searchQuery.value);
  const categoryNameMatches = 'examples примеры categoryexamplespatterns'.includes(query);

  const hasMatchingMissions = categoryExamplesPatternsSets.value.some(set => {
    const searchFields = [
      set.missionVisibleName,
      set.missionDescription,
      set.missionName
    ];
    return searchFields.some(field =>
      normalizeString(field).includes(query)
    );
  });

  return categoryNameMatches || hasMatchingMissions;
});

const shouldShowGamePatterns = computed(() => {
  if (!searchQuery.value) return gamePatternsSets.value.length > 0;

  const query = normalizeString(searchQuery.value);
  const categoryNameMatches = 'games gamepatterns игры'.includes(query) ||
    'vincent'.includes(query);

  const hasMatchingMissions = gamePatternsSets.value.some(set => {
    const searchFields = [
      set.missionVisibleName,
      set.missionDescription,
      set.missionName
    ];
    return searchFields.some(field =>
      normalizeString(field).includes(query)
    );
  });

  return categoryNameMatches || hasMatchingMissions;
});

const shouldShowChinese = computed(() => {
  if (!searchQuery.value) return chineseSets.value.length > 0;

  const query = normalizeString(searchQuery.value);
  const categoryNameMatches = 'chinese китайский язык'.includes(query);

  const hasMatchingMissions = chineseSets.value.some(set => {
    const searchFields = [
      set.missionVisibleName,
      set.missionDescription,
      set.missionName
    ];
    return searchFields.some(field =>
      normalizeString(field).includes(query)
    );
  });

  return categoryNameMatches || hasMatchingMissions;
});

// ФИЛЬТРОВАННЫЕ НАБОРЫ ДЛЯ КАЖДОЙ КАТЕГОРИИ (с учетом поиска)
const filteredReadingSets = computed(() => {
  if (!searchQuery.value) return readingSets.value;

  const query = normalizeString(searchQuery.value);
  return readingSets.value.filter(set => {
    const searchFields = [
      set.missionVisibleName,
      set.missionDescription,
      set.missionName
    ];
    return searchFields.some(field =>
      normalizeString(field).includes(query)
    );
  });
});

const filteredCategoryXSets = computed(() => {
  if (!searchQuery.value) return categoryXSets.value;

  const query = normalizeString(searchQuery.value);
  return categoryXSets.value.filter(set => {
    const searchFields = [
      set.missionVisibleName,
      set.missionDescription,
      set.missionName
    ];
    return searchFields.some(field =>
      normalizeString(field).includes(query)
    );
  });
});

const filteredCategoryExamplesSets = computed(() => {
  if (!searchQuery.value) return categoryExamplesPatternsSets.value;

  const query = normalizeString(searchQuery.value);
  return categoryExamplesPatternsSets.value.filter(set => {
    const searchFields = [
      set.missionVisibleName,
      set.missionDescription,
      set.missionName
    ];
    return searchFields.some(field =>
      normalizeString(field).includes(query)
    );
  });
});

const filteredGamePatternsSets = computed(() => {
  if (!searchQuery.value) return gamePatternsSets.value;

  const query = normalizeString(searchQuery.value);
  return gamePatternsSets.value.filter(set => {
    const searchFields = [
      set.missionVisibleName,
      set.missionDescription,
      set.missionName
    ];
    return searchFields.some(field =>
      normalizeString(field).includes(query)
    );
  });
});

const filteredChineseSets = computed(() => {
  if (!searchQuery.value) return chineseSets.value;

  const query = normalizeString(searchQuery.value);
  return chineseSets.value.filter(set => {
    const searchFields = [
      set.missionVisibleName,
      set.missionDescription,
      set.missionName
    ];
    return searchFields.some(field =>
      normalizeString(field).includes(query)
    );
  });
});

// Функции переключения
const toggleGamePatterns = () => {
  if (searchQuery.value && !isGamePatternsExpanded.value) {
    isGamePatternsExpanded.value = true;
  } else {
    isGamePatternsExpanded.value = !isGamePatternsExpanded.value;
  }
}

const toggleChinese = () => {
  if (searchQuery.value && !isChineseExpanded.value) {
    isChineseExpanded.value = true;
  } else {
    isChineseExpanded.value = !isChineseExpanded.value;
  }
}

const toggleReadingCategory = () => {
  if (searchQuery.value && !isReadingExpanded.value) {
    isReadingExpanded.value = true;
  } else {
    isReadingExpanded.value = !isReadingExpanded.value;
  }
}

const toggleCategoryX = () => {
  if (searchQuery.value && !isCategoryXExpanded.value) {
    isCategoryXExpanded.value = true;
  } else {
    isCategoryXExpanded.value = !isCategoryXExpanded.value;
  }
}

const togglecategoryExamplesPatterns = () => {
  if (searchQuery.value && !iscategoryExamplesPatternsExpanded.value) {
    iscategoryExamplesPatternsExpanded.value = true;
  } else {
    iscategoryExamplesPatternsExpanded.value = !iscategoryExamplesPatternsExpanded.value;
  }
}

// Автоматически скрывать раскрытые категории при очистке поиска
watch(searchQuery, (newQuery) => {
  if (!newQuery) {
    isReadingExpanded.value = false;
    isCategoryXExpanded.value = false;
    iscategoryExamplesPatternsExpanded.value = false;
    isGamePatternsExpanded.value = false;
    isChineseExpanded.value = false;
  }
});

const handlePasswordProtectedClick = (set) => {
  if (!set.password) {
    goToChosenGame(set);
    return;
  }

  currentSetToUnlock.value = set;
  passwordModal.value = true;
};

// Функции для работы с модальным окном
const checkPassword = () => {
  if (passwordInput.value === currentSetToUnlock.value.password) {
    goToChosenGame(currentSetToUnlock.value);
    closeModal();
  } else {
    shake.value = true;
    passwordInput.value = '';
  }
};

const closeModal = () => {
  passwordModal.value = false;
  passwordInput.value = '';
  shake.value = false;
};

// Делаем список реактивным
const AllSetsOfWords = ref([...allGamesAndSetsOfWordsList]);

const showSpecialCardAlert = () => {
  router.push('/create-special-set');
};

// Функция для получения пути к изображению
const getImagePath = (imgName) => {
  return new URL(`../assets/images/${imgName}`, import.meta.url).href;
};

const goToChosenGame = (set) => {
  if (set.type === "hardcodedLink") {
    router.push(set.path);
  } else if (set.type === "externalLink") {
    // Для внешних ссылок
    window.open(set.url, set.target || '_blank');
  } else {
    // Для обычных наборов
    router.push(`/see-all-sets-of-words/${set.missionName}`);
  }
}

const getLevelStars = (stars) => {
  if (!stars) return '';
  const starCount = parseInt(stars);
  return '⭐'.repeat(starCount);
};

const playRandomSet = () => {
  // Фильтруем наборы, исключая специальные (create-special-set и другие, если нужно)
  const availableSets = filteredSets.value.filter(set =>
    !set.type && set.active && set.missionName !== 'create-special-set'
  );

  if (availableSets.length === 0) {
    $q.notify({
      message: 'Нет доступных наборов для случайного выбора',
      color: 'negative'
    });
    return;
  }

  // Выбираем случайный набор
  const randomIndex = Math.floor(Math.random() * availableSets.length);
  const randomSet = availableSets[randomIndex];

  // Переходим к случайному набору
  goToChosenGame(randomSet);
};

const playRandomQuestions = () => {
  router.push('/phoneFramePattern');
}

const playSnake = () => {
  router.push('/gameSnakeWords');
}

const tapalka = () => {
  router.push('/');
}

onMounted(() => {
  const introMessage = document.getElementById("intro-message");
  if (!introMessage) return;

  introMessage.textContent = "";
  let i = 0;

  function typeWriter() {
    if (i < text.length) {
      introMessage.textContent += text[i] === "\n" ? "\n" : text[i];
      i++;
      setTimeout(typeWriter, speed);
    }
  }

  typeWriter();
});
</script>
<style lang="scss" scoped>
/* ask как убрать белые края у блюра? я просто отдельную фотку загрузил, но это же мегабайты лишние*/
.blur {
  filter: blur(5px);
}
.search-container {
  margin: 0 0 10px 0;
  padding: 0 10px;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  scale: 1.1;
  width: 100%;
  padding: 8px 40px 8px 15px; /* добавляем правый отступ для кнопки */
  border-radius: 20px;
  border: 3px solid #000000;
  font-size: 15px;
  font-family: Special_f1;
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  /* Анимация дыхания */
  animation: breathe 4s ease-in-out infinite;
}

.pronunciation-btn {
  position: absolute;
  right: 12px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border: 2px solid #000000;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  /* Анимация появления */
  animation: fadeInScale 0.3s ease;
}

.pronunciation-btn:hover {
  transform: scale(1.1);
  background: linear-gradient(135deg, #764ba2, #667eea);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.pronunciation-btn:active {
  transform: scale(0.95);
}

/* Анимация появления кнопки */
@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* Обновляем анимацию placeholder с учетом кнопки */
.search-input:focus {
  border-color: #6a6a6a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: none;
  padding-right: 40px; /* сохраняем отступ при фокусе */
}

.search-input::placeholder {
  font-style: italic;
  font-family: Helvetica;
  font-size: 11px;
  color: #888;
  opacity: 0.8;
  animation: placeholderPulse 2s ease-in-out infinite;
}

.search-input:focus {
  border-color: #6a6a6a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: none; /* Останавливаем анимацию при фокусе */
}

.search-input::placeholder {
  font-style: italic;
  font-family: Helvetica;

  font-size: 11px;
  color: #888;
  opacity: 0.8;
  /* Анимация мерцания placeholder */
  animation: placeholderPulse 2s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% {
    transform: scale(1);
    border-color: #000000;
  }
  50% {
    transform: scale(1.02);
    border-color: #4a4a4a;
  }
}

@keyframes placeholderPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

.backgroundImg {
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  object-fit: cover;
  z-index: -1;
  right: 0;
  bottom: 0;

}


/*
.phoneFrame{
  position: absolute;
  height: 100%;
  z-index: -1;
}
*/

.v-cards-choose {
  display: flex;
  flex-wrap: wrap;
  /* Позволяет карточкам переходить на новую строку */


}

.v-card-choose {
  background-color: #f9f9f9;
  /* Цвет фона карточки */
  border: 1px solid #ddd;
  /* Цвет границы */
  border-radius: 20px;
  /* Закругление углов */
  padding: 5px 20px;
  /* Внутренние отступы */
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  /* Тень */
  cursor: none;
  /* Указатель мыши при наведении */
  transition: transform 0.2s, box-shadow 0.2s;
  /* Плавный переход при наведении */
  margin: 1.5px;
  user-select: none;
  width: 100%;

}
.q-btn {
  cursor: none;

}
.v-card-choose:hover {
  transform: scale(1.05);
  /* Увеличение карточки при наведении */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  /* Увеличенная тень при наведении */
  user-select: none;

}


.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center; /* выравнивание по вертикали */
  width: 100%;
}

.card-description {
  text-align: left;
  margin-right: 10px;
  flex-grow: 1; /* позволяет описанию занимать всё доступное пространство */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* предотвращаем перенос текста */
}

.card-stars {
  text-align: right;
  white-space: nowrap;
  flex-shrink: 0; /* предотвращает сжатие звёзд */
}

.closeThisPage {

  display: block;
  margin: 0 auto;
}

.border-radius50 {
  border-radius: 50px;
  margin-bottom: -15px;
}
#phoneFrame {
  position: relative; // Устанавливает элемент относительно его нормального положения
  height: 655px; // Высота элемента
  width: 310px; // Ширина элемента
  background:
    linear-gradient( // Фоновый градиент
      to top, // Направление градиента
      #fff -250%, // Белый цвет
      #000000 150% // Черный цвет
    );
  margin: 5px auto; // Отступы сверху и снизу, центрирование по горизонтали
  margin-top: 10px;
  border-radius: 2em; // Скругление углов
  border: solid 5px #6a6a6a; // Рамка вокруг элемента
  box-shadow: // Тени для элемента
    inset 0 0 2px 7px #000, // Внутренняя тень
    inset 0 0 3px 7px #000, // Внутренняя тень
    0 0 30px 10px rgba(0, 0, 0, 0.6), // Внешняя тень
    0 150px 200px -80px #000; // Внешняя тень
  overflow: auto; // Обрезка содержимого, если оно выходит за пределы элемента

 // Стилизация полосы прокрутки
 &::-webkit-scrollbar {
  width: 8px; // Ширина полосы прокрутки
}

&::-webkit-scrollbar-track {
  background: transparent; // Цвет фона полосы прокрутки
}

&::-webkit-scrollbar-thumb {
  background: gray; // Цвет ползунка
  border-radius: 10px; // Скругление углов ползунка
}

&::-webkit-scrollbar-thumb:hover {
  background: darkgray; // Цвет ползунка при наведении
}

  &::before {
    // Псевдоэлемент перед элементом
    text-align: center; // Выравнивание текста по центру
    word-spacing: 6em; // Промежуток между словами
    color: #fff; // Цвет текста
    font-family: helvetica; // Шрифт
    font-size: .7em; // Размер шрифта
    display: block; // Отображение как блочный элемент
    height: 240px; // Высота псевдоэлемента
    width: 240px; // Ширина псевдоэлемента
    position: absolute; // Абсолютное позиционирование
    margin: 30px; // Отступы
  }
}

.bubble {
  // Класс bubble
  text-align: center; // Выравнивание текста по центру
  user-select: none; // Запрет на выделение текста
  font-family: "Permanent Marker"; // Шрифт
  font-size: 17px; // Размер шрифта
  display: inline-block; // Отображение как строчно-блочный элемент
  position: absolute; // Абсолютное позиционирование
  padding: 30px 40px; // Внутренние отступы
  border-radius: 10px; // Скругление углов
  border: 3px solid black; // Рамка вокруг элемента
  background: white; // Фоновый цвет
  clear: both; // Очищение флоатов
  line-height: 16px;

  padding: 16px 17px; // Внутренние отступы (переопределение предыдущих)

  &:before {
    // Псевдоэлемент перед элементом bubble
    content: ''; // Пустое содержимое
    position: absolute; // Абсолютное позиционирование
    bottom: -50px; // Позиция снизу
    height: 50px; // Высота псевдоэлемента
    width: 90px; // Ширина псевдоэлемента
  }

  &.left {
    // Состояние, когда bubble имеет класс left
    float: left; // Обтекание слева
    margin: 25px 1px 62px 176px; // Отступы

    &:before {
      // Псевдоэлемент перед элементом bubble с классом left
      border-radius: 0 0 100%; // Скругление углов
      box-shadow: // Тени для псевдоэлемента
        -2px -2px 0 0 #000 inset,
        -23px 0 0 0 #fff inset,
        -25px -2px 0 0 #000 inset;
      left: 0; // Позиция слева
      /* ask - в инспекторе если в это месте добавить margin-right: 15px то стрелка двигается, а если тут в стилях дописать, то в инспекторе не отображается эта строчка*/
    }
  }

  &.right {
    float: right;
    margin: 10px 10px 60px 10px;

    &:before {
      border-radius: 0 0 0 100%;
      box-shadow:
        2px -2px 0 0 #000 inset,
        23px 0 0 0 #fff inset,
        25px -2px 0 0 #000 inset;
      right: 0;

    }
  }

  &.think {
    &:before {
      height: 3px;
      width: 3px;
      bottom: -20px;
      border-radius: 100%;
      background: #fff;
    }

    &.left:before {
      left: 50px;
      box-shadow:
        0 0 0 7px white,
        0 0 0 10px black,
        -20px 15px 0 5px white,
        -20px 15px 0 8px black,
        -40px 20px 0 2px white,
        -40px 20px 0 5px black;
    }

    &.right:before {
      right: 50px;
      box-shadow:
        0 0 0 7px white,
        0 0 0 10px black,
        20px 15px 0 5px white,
        20px 15px 0 8px black,
        40px 20px 0 2px white,
        40px 20px 0 5px black;
    }
  }

  &.yell {
    &:before {
      height: 0px;
      width: 0px;
      bottom: -8px;
      border-radius: 0;
      background: #fff;
    }

    &:after {
      content: '';
      position: absolute;
      bottom: -41px;
      height: 20px;
      width: 59px;
    }

    &.left {
      &:before {
        transform: skew(-45deg);
        left: 50px;
        box-shadow:
          //0 0 0 7px white,
          0 -3px 0 5px white,
          0 0 0 5px white,
          0 8px 0 5px white,
          8px 8px 0 5px white,
          16px 8px 0 5px white,
          24px 8px 0 5px white,

          0 0 0 8px black,
          0 8px 0 8px black,
          8px 8px 0 8px black,
          16px 8px 0 8px black,
          24px 8px 0 8px black;
      }

      &:after {
        border-radius: 0 0 60%;
        transform: skew(-45deg);
        box-shadow:
          -3px -2px 0 0 #000 inset,
          -14px 0 0 0 #fff inset,
          -17px -2px 0 0 #000 inset;
        left: 0;
      }
    }

    &.right {
      &:before {
        transform: skew(45deg);
        right: 50px;
        box-shadow:
          0 -3px 0 5px white,
          0 0 0 5px white,
          0 8px 0 5px white,
          -8px 8px 0 5px white,
          -16px 8px 0 5px white,
          -24px 8px 0 5px white,
          0 0 0 8px black,
          0 8px 0 8px black,
          -8px 8px 0 8px black,
          -16px 8px 0 8px black,
          -24px 8px 0 8px black;
      }

      &:after {
        border-radius: 0 0 0 60%;
        transform: skew(45deg);
        box-shadow:
          3px -2px 0 0 #000 inset,
          14px 0 0 0 #fff inset,
          17px -2px 0 0 #000 inset;
        right: 0;
      }
    }
  }

}
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}
.custom-tooltip {
  position: absolute;
  left: 0; // ← ПРИЖАТ К ЛЕВОМУ КРАЮ
  transform: translate(var(--offset-x, 0px), var(--offset-y, -10px));
  bottom: 100%;

  background-color: #222;
  color: #fff;
  padding: 2px 12px;
  border-radius: 30px;
  font-size: 16px;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 100;
  //max-width: 300px;
  text-align: left;
  width: 100%;
}

.tooltip-wrapper:hover .custom-tooltip {
  opacity: 1;
}


.tooltip-content {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

/* Стили для Category Game Patterns */
.category-game-patterns {
  background: linear-gradient(135deg, #ff9a00 0%, #ff6a00 100%);
  color: white;
  border: 2px solid #ff8c00;
  font-weight: bold;
}

.category-game-patterns-sets {
  .category-set {
    background: rgba(255, 154, 0, 0.1);
    border-left: 3px solid #ff9a00;
    margin-left: 10px;
    width: calc(100% - 10px);

    &:hover {
      background: rgba(255, 154, 0, 0.2);
    }
  }
}

/* Стили для Category Chinese */
.category-chinese {
  background: linear-gradient(135deg, #d50000 0%, #b71c1c 100%);
  color: white;
  border: 2px solid #c62828;
  font-weight: bold;
}

.category-chinese-sets {
  .category-set {
    background: rgba(213, 0, 0, 0.1);
    border-left: 3px solid #d50000;
    margin-left: 10px;
    width: calc(100% - 10px);

    &:hover {
      background: rgba(213, 0, 0, 0.2);
    }
  }
}

/* Стили для категории чтения */
.reading-category {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: 2px solid #5a6fd8;
  font-weight: bold;

  .expand-icon {
    font-size: 14px;
    transition: transform 0.3s ease;
  }
}

.reading-sets-container {
  width: 100%;
  margin: 5px 0;

  .reading-set {
    background: rgba(102, 126, 234, 0.1);
    border-left: 3px solid #667eea;
    margin-left: 10px;
    width: calc(100% - 10px);

    &:hover {
      background: rgba(102, 126, 234, 0.2);
    }
  }
}


/* Стили для категории X */
.category-x {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  border: 2px solid #ff4757;
  font-weight: bold;

  .expand-icon {
    font-size: 14px;
    transition: transform 0.3s ease;
  }
}

.category-x-sets {
  .category-set {
    background: rgba(255, 107, 107, 0.1);
    border-left: 3px solid #ff6b6b;
    margin-left: 10px;
    width: calc(100% - 10px);

    &:hover {
      background: rgba(255, 107, 107, 0.2);
    }
  }
}

/* Стили для категории Y */
.categoryExamples {
  background: linear-gradient(135deg, #00d2d3 0%, #54a0ff 100%);
  color: white;
  border: 2px solid #00d2d3;
  font-weight: bold;

  .expand-icon {
    font-size: 14px;
    transition: transform 0.3s ease;
  }
}

.categoryExamples-sets {
  .category-set {
    background: rgb(107 177 255);
    border-left: 3px solid #00d2d3;
    margin-left: 10px;
    width: calc(100% - 10px);

    &:hover {
      background: rgba(0, 210, 211, 0.2);
    }
  }
}

/* Общие стили для контейнеров категорий */
.category-sets-container {
  width: 100%;
  margin: 5px 0;
}


.mission-name {
  text-align: left;
  margin-right: 10px; /* небольшой отступ между названием и звёздами */
}

.mission-stars {
  text-align: right;
  white-space: nowrap; /* чтобы звёзды не переносились */
}



.glassMorphism {
  position: relative;
  overflow: hidden;
  margin: 1.5px;
  padding: 5px 20px;
  border-radius: 20px;
  color: white;

  /* Глассморфизм */
  background: rgba(255, 107, 53, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 8px 32px rgba(255, 107, 53, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -2px 8px rgba(0, 0, 0, 0.2);

  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  cursor: none;
}

/* Эффект пузырьков */
.glassMorphism::before {
  content: "";
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-20deg);
  opacity: 0.6;
  pointer-events: none;
  animation: shine 3s infinite ease-in-out;
}

/* Анимированные пузырьки */
.glassMorphism::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.3) 2px, transparent 0),
    radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.2) 3px, transparent 0),
    radial-gradient(circle at 40% 80%, rgba(255, 255, 255, 0.25) 1px, transparent 0),
    radial-gradient(circle at 60% 20%, rgba(255, 255, 255, 0.15) 2px, transparent 0);
  background-size: 50% 50%, 60% 60%, 70% 70%, 80% 80%;
  animation: bubbles 8s infinite linear;
  pointer-events: none;
}

@keyframes bubbles {
  0% { background-position: 0% 0%, 0% 0%, 0% 0%, 0% 0%; }
  100% { background-position: 100% 100%, 200% 200%, -100% 150%, 150% -100%; }
}

.glassMorphism:hover {
  transform: translateY(-2px) scale(1.02);
  background: rgba(255, 107, 53, 0.35);
  box-shadow:
    0 12px 40px rgba(255, 107, 53, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.5),
    inset 0 -2px 8px rgba(0, 0, 0, 0.3);
}

.glassMorphism:active {
  transform: translateY(1px) scale(0.98);
}





.create-special-set {
  display: none;
  position: relative; /* для псевдоэлемента */
  overflow: hidden;
  margin: 1.5px;
  padding: 5px 20px;
  border-radius: 20px;
  color: white;
  background: linear-gradient(to top, #007BFF, #339CFF);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -2px 4px rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  cursor: none;
  //font-size: 16px;
}

.create-special-set::before {
  content: "";
  position: absolute;
  top: 0;
  left: -75%;  /* стартуем слева за пределами */
  width: 50%;
  height: 100%;
  background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-20deg);
  opacity: 0.7;
  pointer-events: none;
  animation: shine 3s infinite ease-in-out;
}

.random-set {
  position: relative; /* для псевдоэлемента */
  overflow: hidden;
  margin: 1.5px;
  padding: 5px 20px;
  border-radius: 20px;
  color: white;
  background: linear-gradient(to top, #884eef, #9e6ff1);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), inset 0 -2px 4px rgba(255, 255, 255, 0.2);
  transition: all 0.2s ease;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  cursor: none;
  //font-size: 16px;
}

.randomQuestions {
  background: linear-gradient(to top, #594eef, #6f75f1);

}


.random-set::before {
  content: "";
  position: absolute;
  top: 0;
  left: -75%;  /* стартуем слева за пределами */
  width: 50%;
  height: 100%;
  background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.5) 50%,
      rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-20deg);
  opacity: 0.7;
  pointer-events: none;
  animation: shine 3s infinite ease-in-out;
}

@keyframes shine {
  0% {
    left: -75%;
  }
  50% {
    left: 125%;
  }
  100% {
    left: -75%;
  }
}

.create-special-set:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.4), inset 0 -2px 4px rgba(255, 255, 255, 0.2);
}

.create-special-set:active {
  transform: translateY(1px);
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.4);
}

.card-icons, .mission-icons {
  display: flex;
  align-items: center;
  gap: 4px;
}

.game-icon {
  font-size: 1em;
  line-height: 1;
}
/* Добавляем новые стили для картинок */
.card-description {
  display: flex;
  align-items: center;
  gap: 8px;
}

.game-image {
  width: 20px;
  height: 20px;
  object-fit: contain;
  flex-shrink: 0;
}
.password-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(3px);
}

.password-modal {
  position: relative;
  background: linear-gradient(145deg, #2c3e50, #1a1a2e);
  border-radius: 15px;
  padding: 25px;
  width: 320px;
  max-width: 90%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
  border: 2px solid #6a6a6a;
  color: #fff;
  font-family: 'Courier New', monospace;

  &.shake {
    animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
  }
}

.password-modal-header {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border-bottom: 1px solid #444;
  padding-bottom: 15px;

  h3 {
    margin: 0;
    font-size: 1.4rem;
    color: #e74c3c;
  }

  .lock-icon {
    font-size: 1.8rem;
    margin-right: 15px;
    color: #e74c3c;
  }
}

.password-modal-body {
  p {
    margin: 0 0 15px;
    font-size: 0.95rem;
    color: #ecf0f1;
  }

  .hint {
    font-size: 0.8rem;
    color: #7f8c8d;
    margin-top: 15px;
    font-style: italic;
  }
}

.password-input-wrapper {
  display: flex;
  align-items: center;
  margin: 20px 0;
}

.password-input {
  flex: 1;
  padding: 12px 15px;
  border: 1px solid #444;
  border-radius: 8px 0 0 8px;
  background-color: #34495e;
  color: #fff;
  font-family: 'Courier New', monospace;
  font-size: 1rem;
  outline: none;

  &::placeholder {
    color: #7f8c8d;
  }

  &:focus {
    border-color: #e74c3c;
    box-shadow: 0 0 0 2px rgba(231, 76, 60, 0.3);
  }
}

.unlock-btn {
  background: linear-gradient(to bottom, #e74c3c, #c0392b);
  border: none;
  border-radius: 0 8px 8px 0;
  padding: 12px 15px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background: linear-gradient(to bottom, #c0392b, #a5281b);
  }

  .unlock-icon {
    font-size: 1.2rem;
    color: white;
  }
}

.close-modal {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  color: #7f8c8d;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #e74c3c;
  }
}

/* Анимация тряски */
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(2px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
  40%, 60% { transform: translate3d(4px, 0, 0); }
}

.glassMorphism3 {
  position: relative;
  overflow: hidden;
  margin: 1.5px;
  padding: 5px 20px;
  border-radius: 20px;
  color: white;

  /* Глассморфизм */
  background: rgba(110, 255, 53, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow:
    0 8px 32px rgba(255, 107, 53, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.4),
    inset 0 -2px 8px rgba(0, 0, 0, 0.2);

  transition: all 0.3s ease;
  text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
  cursor: none;
}

/* Бликовый эффект */
.glassMorphism3::before {
  content: "";
  position: absolute;
  top: 0;
  left: -75%;
  width: 50%;
  height: 100%;
  background: linear-gradient(
      120deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
  );
  transform: skewX(-20deg);
  opacity: 0.6;
  pointer-events: none;
  animation: shine 3s infinite ease-in-out;
}

/* Геометрические фигуры - квадраты и крестики */
.glassMorphism3::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image:
    /* Квадраты */
    linear-gradient(45deg, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
    linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
      /* Крестики */
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(0deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);

  background-size:
    15px 15px, /* Размер квадратов */
    15px 15px, /* Размер квадратов */
    20px 20px, /* Размер крестиков */
    20px 20px; /* Размер крестиков */

  background-position:
    0 0,       /* Квадраты */
    8px 8px,   /* Смещение квадратов */
    0 0,       /* Крестики */
    10px 10px; /* Смещение крестиков */

  animation: geometricFloat 20s infinite linear;
  pointer-events: none;
  opacity: 0.4;
}

/* Анимация движения геометрических фигур */
@keyframes geometricFloat {
  0% {
    background-position:
      0px 0px,
      8px 8px,
      0px 0px,
      10px 10px;
  }
  100% {
    background-position:
      100px 100px,
      108px 108px,
      200px 200px,
      210px 210px;
  }
}




</style>



