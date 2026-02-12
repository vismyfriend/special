<!-- vbase-3-setup -->
<template>
  <div class="relative">
    <div id="phoneFrame">
      <p class="bubble left" id="intro-message">vismyfriend<br> and <br> vismyteacher</p>

      <div class="q-pa-15 ">
        <img src="../assets/images/chooseMissionGirlOnBooks.png" alt="logo" class="border-radius50">

        <!-- Поле поиска -->
        <div class="search-container">
          <div class="search-input-wrapper">
            <input
              v-model="searchQuery"
              placeholder="🔎 вводи название миссии или листай"
              class="search-input"
              @focus="focusSearch"

            />
            <button
              v-if="showPronunciationButton"
              class="pronunciation-btn youglish-btn"
              @click="handleYouglishSearch"
              title="Найти произношение на Youglish"
            >
              🍿
            </button>
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

        <!-- Используем единый список -->
        <div class="v-cards-choose">

          <!-- Создать свой набор (всегда первый) -->
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
              Vincent works hard for you
            </div>
          </div>

          <!-- Единый список subTasks и обычных наборов в правильном порядке -->
          <div
            v-for="missionItem in filteredOrderedMissions"
            :key="getItemKey(missionItem)"
          >
            <!-- Если это subTasks -->
            <div
              v-if="isSubTasks(missionItem)"
              class="subtasks-container"
            >
              <!-- Заголовок subTasks -->
              <div
                class="v-card-choose tooltip-wrapper subtasks-header"
                :class="getSubTaskStyleClass(missionItem)"
                @click="toggleSubTasks(missionItem)"
                :style="{
                  '--offset-x': '5px',
                  '--offset-y': '29.5px'
                }"
              >
                <div class="card-content">
                  <span class="card-description">
                    {{ missionItem.missionVisibleName }} ( {{ getActiveSubTasksCount(missionItem) }} )
                  </span>
                  <span class="card-icons">
                    <span class="expand-icon">{{ isSubTasksExpanded(missionItem) ? '' : '' }}</span>
                  </span>
                </div>
                <div class="custom-tooltip">
                  {{ missionItem.missionDescription }}
                </div>
              </div>

              <!-- Раскрытые подзадания -->
              <div
                v-if="isSubTasksExpanded(missionItem) && getActiveSubTasksCount(missionItem) > 0"
                class="subtasks-sets-container"
                :class="`subtasks-${getSubTaskStyleClass(missionItem)}`"
              >
                <div
                  v-for="subTask in getFilteredSubTasks(missionItem)"
                  :key="getSubTaskItemKey(subTask)"
                >
                  <!-- Если это underSubTasks -->
                  <div
                    v-if="isUnderSubTasks(subTask)"
                    class="undersubtasks-container"
                  >
                    <!-- Заголовок underSubTasks -->
                    <div
                      class="v-card-choose tooltip-wrapper undersubtasks-header"
                      :class="`undersubtask-${getSubTaskStyleClass(missionItem)}`"
                      @click="toggleUnderSubTasks(subTask)"
                      :style="{
          '--offset-x': '5px',
          '--offset-y': '29.5px'
        }"
                    >
                      <div class="card-content">
          <span class="card-description">
            {{ subTask.missionVisibleName }} ( {{ getActiveUnderSubTasksCount(subTask) }} )
          </span>
                        <span class="card-icons">
            <span class="expand-icon">{{ isUnderSubTasksExpanded(subTask) ? '' : '' }}</span>
          </span>
                      </div>
                      <div class="custom-tooltip">
                        {{ subTask.missionDescription }}
                      </div>
                    </div>

                    <!-- Раскрытые underSubTasks -->
                    <div
                      v-if="isUnderSubTasksExpanded(subTask) && getActiveUnderSubTasksCount(subTask) > 0"
                      class="undersubtasks-sets-container"
                      :class="`undersubtasks-${getSubTaskStyleClass(missionItem)}`"
                    >
                      <div
                        v-for="underSubTask in getFilteredUnderSubTasks(subTask)"
                        :key="getSubTaskItemKey(underSubTask)"
                        class="v-card-choose tooltip-wrapper undersubtask-set"
                        :class="`undersubtask-${getSubTaskStyleClass(missionItem)}`"
                        @click="handleUnderSubTaskClick(underSubTask)"
                        :style="{
      '--offset-x': '5px',
      '--offset-y': '29.5px'
    }"
                      >
                        <div class="card-content">
            <span class="card-description">
              {{ underSubTask.missionVisibleName }}
            </span>
                          <span class="card-icons">
              <span class="card-stars" v-if="underSubTask.stars">
                {{ getLevelStars(underSubTask.stars) }}
              </span>
              <span class="game-icon" v-if="underSubTask.gameIcon">
                {{ underSubTask.gameIcon }}
              </span>
            </span>
                        </div>
                        <div class="custom-tooltip">
                          {{ underSubTask.missionDescription }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Если это обычный подтаск -->
                  <div
                    v-else
                    class="v-card-choose tooltip-wrapper subtask-set"
                    :class="`subtask-${getSubTaskStyleClass(missionItem)}`"
                    @click="handleSubTaskClick(subTask)"
                    :style="{
        '--offset-x': '5px',
        '--offset-y': '29.5px'
      }"
                  >
                    <div class="card-content">
        <span class="card-description">
          {{ subTask.missionVisibleName }}
        </span>
                      <span class="card-icons">
          <span class="card-stars" v-if="subTask.stars">
            {{ getLevelStars(subTask.stars) }}
          </span>
          <span class="game-icon" v-if="subTask.gameIcon">
            {{ subTask.gameIcon }}
          </span>
        </span>
                    </div>
                    <div class="custom-tooltip">
                      {{ subTask.missionDescription }}
                    </div>
                  </div>
                </div>
              </div>            </div>

            <!-- Если это обычный набор -->
            <div
              v-else
              class="v-card-choose tooltip-wrapper"
              role="button"
              @click="handlePasswordProtectedClick(missionItem)"
              :style="{
                '--offset-x': '5px',
                '--offset-y': '29.5px'
              }"
            >
              <div class="card-content">
                <span class="card-description">
                  {{ missionItem.missionVisibleName }}
                </span>
                <span class="card-icons">
                  <span class="card-stars" v-if="missionItem.stars">
                    {{ getLevelStars(missionItem.stars) }}
                  </span>
                  <span class="game-icon" v-if="missionItem.gameIcon">
                    {{ missionItem.gameIcon }}
                  </span>
                  <img
                    v-if="missionItem.gameImg"
                    :src="getImagePath(missionItem.gameImg)"
                    class="game-image"
                    alt="game icon"
                  >
                </span>
              </div>
              <div class="custom-tooltip">
                <div class="tooltip-content">
                  <span class="mission-name">{{ missionItem.missionDescription }}</span>
                  <span class="mission-icons">
                    <span class="mission-stars" v-if="missionItem.stars">
                      {{ getLevelStars(missionItem.stars) }}
                    </span>
                    <span class="game-icon" v-if="missionItem.gameIcon">
                      {{ missionItem.gameIcon }}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Специальные карточки -->
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
            <div class="custom-tooltip">Random Set</div>
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

          <!-- Рандомные вопросы -->
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
              :key="getItemKey(currentSetOfWords)"
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
              :key="getItemKey(currentSetOfWords)"
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
              :key="getItemKey(currentSetOfWords)"
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
              :key="getItemKey(currentSetOfWords)"
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
              :key="getItemKey(currentSetOfWords)"
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
import { onMounted, onBeforeUnmount } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { allGamesAndSetsOfWordsList } from "src/dataForGames/allGamesAndSetsOfWordsList";

// ==================== КОНСТАНТЫ ====================
const ANIMATION_TEXT = "What mission?";
const ANIMATION_SPEED = 150;

// ==================== COMPOSABLES ====================
const $q = useQuasar();
const router = useRouter();

// ==================== БАЗОВЫЕ СОСТОЯНИЯ ====================
const searchQuery = ref('');                    // Поисковый запрос
const passwordModal = ref(false);              // Модалка пароля
const passwordInput = ref('');                // Ввод пароля
const currentSetToUnlock = ref(null);         // Текущий набор для разблокировки
const shake = ref(false);                    // Анимация тряски
const savedScrollPosition = ref(0);          // Сохраненная позиция скролла

// ==================== СОСТОЯНИЯ РАСКРЫТИЙ ====================
// 👤 ПОЛЬЗОВАТЕЛЬСКИЕ - сохраняются в localStorage
const userExpandedSubTasks = ref(new Set());
const userExpandedUnderSubTasks = ref(new Set());

// 🔍 ПОИСКОВЫЕ - временные, сбрасываются при очистке поиска
const searchExpandedSubTasks = ref(new Set());
const searchExpandedUnderSubTasks = ref(new Set());

// 🎯 ИТОГОВЫЕ COMPUTED - переключаются в зависимости от наличия поиска
const expandedSubTasks = computed({
  get: () => searchQuery.value?.trim()
    ? searchExpandedSubTasks.value
    : userExpandedSubTasks.value,
  set: (value) => {
    if (searchQuery.value?.trim()) {
      searchExpandedSubTasks.value = value;
    } else {
      userExpandedSubTasks.value = value;
    }
  }
});

const expandedUnderSubTasks = computed({
  get: () => searchQuery.value?.trim()
    ? searchExpandedUnderSubTasks.value
    : userExpandedUnderSubTasks.value,
  set: (value) => {
    if (searchQuery.value?.trim()) {
      searchExpandedUnderSubTasks.value = value;
    } else {
      userExpandedUnderSubTasks.value = value;
    }
  }
});


// ==================== Нажатие на поиск - СКРОЛЛ К ВЕРХУ ====================
const focusSearch = () => {
  // Для iOS нужно больше времени из-за анимации клавиатуры
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

  setTimeout(() => {
    const phoneFrame = document.getElementById('phoneFrame');
    if (phoneFrame) {
      // Пробуем оба метода для надежности
      try {
        phoneFrame.scrollTo({
          top: 0,
          behavior: isIOS ? 'auto' : 'smooth' // На iOS smooth ломается
        });
      } catch(e) {
        // Fallback для старых браузеров
        phoneFrame.scrollTop = 0;
      }
    }
  }, isIOS ? 350 : 50); // На iOS ждем дольше (350ms)
};

// ==================== СОСТОЯНИЯ КАТЕГОРИЙ ====================
const categoryStates = ref({
  reading: false,
  categoryX: false,
  categoryExamplesPatterns: false,
  gamePatterns: false,
  chinese: false
});

// Computed для шаблона
const isReadingExpanded = computed(() => categoryStates.value.reading);
const isCategoryXExpanded = computed(() => categoryStates.value.categoryX);
const iscategoryExamplesPatternsExpanded = computed(() => categoryStates.value.categoryExamplesPatterns);
const isGamePatternsExpanded = computed(() => categoryStates.value.gamePatterns);
const isChineseExpanded = computed(() => categoryStates.value.chinese);

// ==================== ДАННЫЕ ====================
const AllSetsOfWords = ref([...allGamesAndSetsOfWordsList]);

// ==================== COMPUTED - ПОИСК И ФИЛЬТРАЦИЯ ====================
const showPronunciationButton = computed(() => searchQuery.value.trim().length > 2);

// Категории наборов
const readingSets = computed(() => filterByCategory('reading'));
const categoryXSets = computed(() => filterByCategory('categoryX'));
const categoryExamplesPatternsSets = computed(() => filterByCategory('categoryExamplesPatterns'));
const gamePatternsSets = computed(() => filterByCategory('gamePatterns'));
const chineseSets = computed(() => filterByCategory('chinese'));

// Фильтрованные по поиску
const filteredReadingSets = computed(() => filterSetsBySearch(readingSets.value));
const filteredCategoryXSets = computed(() => filterSetsBySearch(categoryXSets.value));
const filteredCategoryExamplesSets = computed(() => filterSetsBySearch(categoryExamplesPatternsSets.value));
const filteredGamePatternsSets = computed(() => filterSetsBySearch(gamePatternsSets.value));
const filteredChineseSets = computed(() => filterSetsBySearch(chineseSets.value));

// Умное отображение категорий
const shouldShowReadingCategory = computed(() =>
  shouldShowCategory('reading', readingSets.value, ['чтение reading', 'интенсивы']));
const shouldShowCategoryX = computed(() =>
  shouldShowCategory('categoryX', categoryXSets.value, ['категория x categoryx', 'секретные']));
const shouldShowCategoryExamples = computed(() =>
  shouldShowCategory('categoryExamplesPatterns', categoryExamplesPatternsSets.value, ['examples примеры categoryexamplespatterns']));
const shouldShowGamePatterns = computed(() =>
  shouldShowCategory('gamePatterns', gamePatternsSets.value, ['games gamepatterns игры', 'vincent']));
const shouldShowChinese = computed(() =>
  shouldShowCategory('chinese', chineseSets.value, ['chinese китайский язык']));

// Основной список миссий (без категорий)
const orderedMissionList = computed(() => {
  const excludedCategories = ['reading', 'categoryX', 'categoryExamplesPatterns', 'gamePatterns', 'chinese'];
  return AllSetsOfWords.value.filter(item =>
    item.active &&
    (item.type === "subTasks" ||
      !excludedCategories.some(category => hasCategory(item, category)))
  );
});

// ФИЛЬТРОВАННЫЙ СПИСОК С УЧЕТОМ ПОИСКА
const filteredOrderedMissions = computed(() => {
  const query = normalizeString(searchQuery.value).replace(/\//g, '');
  if (!query) return orderedMissionList.value;

  const result = [];
  const seen = new Set();

  const itemMatches = (item) => item.active && universalSearch(item, query);

  const searchItems = (items, parentSubTask = null, parentUnderSubTask = null) => {
    items.forEach(item => {
      if (!item.active) return;
      const key = getItemKey(item);
      if (seen.has(key)) return;

      if (itemMatches(item)) {
        if (parentUnderSubTask && !seen.has(getItemKey(parentUnderSubTask))) {
          seen.add(getItemKey(parentUnderSubTask));
          result.push(parentUnderSubTask);
        }
        if (parentSubTask && !seen.has(getItemKey(parentSubTask))) {
          seen.add(getItemKey(parentSubTask));
          result.push(parentSubTask);
        }
        seen.add(key);
        result.push(item);
      }

      if (isSubTasks(item) && item.subTasks) {
        item.subTasks.forEach(subTask => {
          if (isUnderSubTasks(subTask)) {
            searchItems(subTask.underSubTasks || [], item, subTask);
          } else {
            searchItems([subTask], item, null);
          }
        });
      }
    });
  };

  searchItems(orderedMissionList.value);
  return result;
});

// ==================== УТИЛИТЫ ====================
const normalizeString = (str) => {
  if (!str) return '';
  return str.toString().toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\wа-яё\/]/g, '');
};

const getItemKey = (item) => {
  if (item._uniqueKey) return item._uniqueKey;
  const keyParts = [
    item.type || '', item.missionName || '', item.missionVisibleName || '',
    item.missionDescription || '', item.path || '', item.url || ''
  ].filter(part => part !== '');
  return keyParts.join('_') || `key_${Math.random().toString(36).substr(2, 9)}`;
};

const getSubTaskItemKey = (subTask) => {
  const keyParts = [
    subTask.type || '', subTask.missionName || '', subTask.missionVisibleName || '',
    subTask.missionDescription || '', subTask.path || '', subTask.url || ''
  ].filter(part => part !== '');
  return keyParts.join('_') || `subtask_${Math.random().toString(36).substr(2, 9)}`;
};

const getSubTaskUniqueKey = (subTaskSet) => {
  return `${subTaskSet.id}_${subTaskSet.missionVisibleName}_${subTaskSet.missionDescription}`;
};

const getUnderSubTaskUniqueKey = (underSubTaskSet) => {
  return `under_${underSubTaskSet.id}_${underSubTaskSet.missionVisibleName}`;
};

const hasCategory = (set, categoryName) => {
  if (set.type === "subTasks") return false;
  return set.category === categoryName ||
    (Array.isArray(set.category) && set.category.includes(categoryName));
};

const isSubTasks = (set) => {
  return set.type === "subTasks" && Array.isArray(set.subTasks);
};

const isUnderSubTasks = (item) => {
  return item.type === "underSubTasks" && Array.isArray(item.underSubTasks);
};

const getSubTaskStyleClass = (subTaskSet) => {
  return subTaskSet.style || 'default';
};

// ==================== УНИВЕРСАЛЬНЫЙ ПОИСК ====================
const universalSearch = (item, query) => {
  if (!query) return true;

  const searchFields = [
    item.missionVisibleName, item.missionDescription, item.missionName,
    item.type, item.path, item.url,
    item.category ? (Array.isArray(item.category) ? item.category.join(' ') : item.category) : '',
    item.style, item.gameIcon, item.gameImg,
    item.stars?.toString(), item.password, item.target
  ].filter(Boolean);

  if (searchFields.some(field => field && normalizeString(field).includes(query))) return true;

  if (isSubTasks(item) && item.subTasks) {
    if (item.subTasks.some(subTask => {
      if (!subTask.active) return false;
      const subTaskFields = [
        subTask.missionVisibleName, subTask.missionDescription,
        subTask.missionName, subTask.type, subTask.style, subTask.gameIcon
      ].filter(Boolean);
      return subTaskFields.some(field => field && normalizeString(field).includes(query));
    })) return true;
  }

  if (item.type === "subTasks" && item.subTasks) {
    if (item.subTasks.some(subTask => {
      if (!subTask.active || !isUnderSubTasks(subTask) || !subTask.underSubTasks) return false;
      return subTask.underSubTasks.some(underSubTask => {
        if (!underSubTask.active) return false;
        const underSubTaskFields = [
          underSubTask.missionVisibleName, underSubTask.missionDescription,
          underSubTask.missionName, underSubTask.type, underSubTask.style, underSubTask.gameIcon
        ].filter(Boolean);
        return underSubTaskFields.some(field => field && normalizeString(field).includes(query));
      });
    })) return true;
  }

  return false;
};

// ==================== ФИЛЬТРЫ ====================
const filterByCategory = (categoryName) => {
  return AllSetsOfWords.value.filter(set =>
    set.active && hasCategory(set, categoryName)
  );
};

const getSubTasksSets = () => {
  return AllSetsOfWords.value.filter(set =>
    set.active && set.type === "subTasks"
  );
};

const filterSetsBySearch = (sets) => {
  if (!searchQuery.value) return sets;
  const query = normalizeString(searchQuery.value);
  return sets.filter(set => universalSearch(set, query));
};

const shouldShowCategory = (categoryKey, categorySets, searchTerms) => {
  if (!searchQuery.value) return categorySets.length > 0;
  const query = normalizeString(searchQuery.value);
  return searchTerms.some(term => term.includes(query)) ||
    categorySets.some(set => universalSearch(set, query));
};

const getFilteredSubTasks = (subTaskSet) => {
  const query = normalizeString(searchQuery.value).replace(/\//g, '');
  if (!query) return getActiveSubTasks(subTaskSet);

  return getActiveSubTasks(subTaskSet).filter(subTask => {
    if (isUnderSubTasks(subTask)) {
      const filteredUnder = getActiveUnderSubTasks(subTask).filter(underSubTask =>
        universalSearch(underSubTask, query)
      );
      return filteredUnder.length > 0 || universalSearch(subTask, query);
    }
    return universalSearch(subTask, query);
  });
};

const getFilteredUnderSubTasks = (underSubTaskSet) => {
  const query = normalizeString(searchQuery.value).replace(/\//g, '');
  if (!query) return getActiveUnderSubTasks(underSubTaskSet);
  return getActiveUnderSubTasks(underSubTaskSet).filter(underSubTask =>
    universalSearch(underSubTask, query)
  );
};

// ==================== ACTIVE COUNTS ====================
const getActiveSubTasks = (subTaskSet) => {
  return (subTaskSet.subTasks || []).filter(task => task.active);
};

const getActiveSubTasksCount = (subTaskSet) => {
  return getActiveSubTasks(subTaskSet).length;
};

const getActiveUnderSubTasks = (underSubTaskSet) => {
  return (underSubTaskSet.underSubTasks || []).filter(task => task.active);
};

const getActiveUnderSubTasksCount = (underSubTaskSet) => {
  return getActiveUnderSubTasks(underSubTaskSet).length;
};

// ==================== LOCALSTORAGE - СОХРАНЕНИЕ СОСТОЯНИЙ ====================
const saveUserExpandedState = () => {
  try {
    const expandedArray = Array.from(userExpandedSubTasks.value);
    localStorage.setItem('userExpandedSubTasks', JSON.stringify(expandedArray));

    const expandedUnderArray = Array.from(userExpandedUnderSubTasks.value);
    localStorage.setItem('userExpandedUnderSubTasks', JSON.stringify(expandedUnderArray));

    console.log('💾 Сохранено раскрытий:', {
      subTasks: expandedArray.length,
      underSubTasks: expandedUnderArray.length
    });
  } catch (e) {
    console.error('Ошибка сохранения:', e);
  }
};

const restoreUserExpandedState = () => {
  try {
    const savedExpanded = localStorage.getItem('userExpandedSubTasks');
    if (savedExpanded) {
      userExpandedSubTasks.value = new Set(JSON.parse(savedExpanded));
    }

    const savedUnderExpanded = localStorage.getItem('userExpandedUnderSubTasks');
    if (savedUnderExpanded) {
      userExpandedUnderSubTasks.value = new Set(JSON.parse(savedUnderExpanded));
    }
  } catch (e) {
    console.error('Ошибка восстановления:', e);
    userExpandedSubTasks.value = new Set();
    userExpandedUnderSubTasks.value = new Set();
  }
};

// ==================== SCROLL - СОХРАНЕНИЕ ПОЗИЦИИ ====================
const getScrollKey = () => {
  const userId = localStorage.getItem('userId') || 'default';
  return `scroll_${userId}_missions`;
};

const saveScrollPosition = () => {
  const phoneFrame = document.getElementById('phoneFrame');
  if (phoneFrame) {
    const position = phoneFrame.scrollTop;
    savedScrollPosition.value = position;
    localStorage.setItem(getScrollKey(), position.toString());
  }
};

const restoreScrollPosition = () => {
  const position = savedScrollPosition.value || localStorage.getItem(getScrollKey());
  if (position) {
    setTimeout(() => {
      const phoneFrame = document.getElementById('phoneFrame');
      if (phoneFrame) {
        phoneFrame.scrollTo({ top: Number(position), behavior: 'instant' });
      }
    }, 100);
  }
};

// ==================== ПОИСК - АВТОРАСКРЫТИЕ ====================
const autoExpandParentCategoriesForSearch = (query) => {
  if (!query) return;

  searchExpandedSubTasks.value.clear();
  searchExpandedUnderSubTasks.value.clear();

  const subTasksToExpand = new Set();
  const underSubTasksToExpand = new Set();

  orderedMissionList.value.forEach(item => {
    if (isSubTasks(item) && item.subTasks) {
      item.subTasks.forEach(subTask => {
        let shouldExpand = false;

        if (!isUnderSubTasks(subTask) && universalSearch(subTask, query)) {
          shouldExpand = true;
        }

        if (isUnderSubTasks(subTask) && subTask.underSubTasks) {
          if (universalSearch(subTask, query)) shouldExpand = true;

          if (subTask.underSubTasks.some(under => universalSearch(under, query))) {
            shouldExpand = true;
            underSubTasksToExpand.add(getUnderSubTaskUniqueKey(subTask));
          }
        }

        if (shouldExpand) {
          subTasksToExpand.add(getSubTaskUniqueKey(item));
        }
      });
    }
  });

  subTasksToExpand.forEach(key => searchExpandedSubTasks.value.add(key));
  underSubTasksToExpand.forEach(key => searchExpandedUnderSubTasks.value.add(key));
};

// ==================== ЛОГИКА РАСКРЫТИЯ ====================
const isSubTasksExpanded = (subTaskSet) => {
  return expandedSubTasks.value.has(getSubTaskUniqueKey(subTaskSet));
};

const isUnderSubTasksExpanded = (underSubTaskSet) => {
  return expandedUnderSubTasks.value.has(getUnderSubTaskUniqueKey(underSubTaskSet));
};

const toggleSubTasks = (subTaskSet) => {
  const key = getSubTaskUniqueKey(subTaskSet);

  if (searchQuery.value?.trim()) {
    searchExpandedSubTasks.value.has(key)
      ? searchExpandedSubTasks.value.delete(key)
      : searchExpandedSubTasks.value.add(key);
  } else {
    userExpandedSubTasks.value.has(key)
      ? userExpandedSubTasks.value.delete(key)
      : userExpandedSubTasks.value.add(key);
    saveUserExpandedState();
  }
};

const toggleUnderSubTasks = (underSubTaskSet) => {
  const key = getUnderSubTaskUniqueKey(underSubTaskSet);

  if (searchQuery.value?.trim()) {
    searchExpandedUnderSubTasks.value.has(key)
      ? searchExpandedUnderSubTasks.value.delete(key)
      : searchExpandedUnderSubTasks.value.add(key);
  } else {
    userExpandedUnderSubTasks.value.has(key)
      ? userExpandedUnderSubTasks.value.delete(key)
      : userExpandedUnderSubTasks.value.add(key);
    saveUserExpandedState();
  }
};

// ==================== КАТЕГОРИИ - ПЕРЕКЛЮЧЕНИЕ ====================
const toggleCategory = (category) => {
  if (searchQuery.value && !categoryStates.value[category]) {
    categoryStates.value[category] = true;
  } else {
    categoryStates.value[category] = !categoryStates.value[category];
  }
};

const toggleReadingCategory = () => toggleCategory('reading');
const toggleCategoryX = () => toggleCategory('categoryX');
const togglecategoryExamplesPatterns = () => toggleCategory('categoryExamplesPatterns');
const toggleGamePatterns = () => toggleCategory('gamePatterns');
const toggleChinese = () => toggleCategory('chinese');

// ==================== НАВИГАЦИЯ ====================
const goToChosenGame = (set) => {
  saveScrollPosition();
  saveUserExpandedState();

  if (set.type === "hardcodedLink") {
    router.push(set.path);
  } else if (set.type === "externalLink") {
    window.open(set.url, set.target || '_blank');
  } else {
    router.push(`/see-all-sets-of-words/${set.missionName}`);
  }
};

const handlePasswordProtectedClick = (set) => {
  if (!set.password) {
    goToChosenGame(set);
    return;
  }
  currentSetToUnlock.value = set;
  passwordModal.value = true;
};

const handleSubTaskClick = (subTask) => {
  subTask.password
    ? (currentSetToUnlock.value = subTask, passwordModal.value = true)
    : goToChosenGame(subTask);
};

const handleUnderSubTaskClick = (underSubTask) => {
  underSubTask.password
    ? (currentSetToUnlock.value = underSubTask, passwordModal.value = true)
    : goToChosenGame(underSubTask);
};

// ==================== ИГРОВЫЕ ФУНКЦИИ ====================
const showSpecialCardAlert = () => {
  saveScrollPosition();
  saveUserExpandedState();
  router.push('/create-special-set');
};

const playRandomSet = () => {
  saveScrollPosition();
  saveUserExpandedState();

  const availableSets = filteredOrderedMissions.value.filter(set =>
    !set.type && set.active && set.missionName !== 'create-special-set'
  );

  if (availableSets.length === 0) {
    $q.notify({ message: 'Нет доступных наборов', color: 'negative' });
    return;
  }

  const randomIndex = Math.floor(Math.random() * availableSets.length);
  goToChosenGame(availableSets[randomIndex]);
};

const playRandomQuestions = () => {
  saveScrollPosition();
  saveUserExpandedState();
  router.push('/phoneFramePattern');
};

const playSnake = () => {
  saveScrollPosition();
  saveUserExpandedState();
  router.push('/gameSnakeWords');
};

const tapalka = () => {
  saveScrollPosition();
  saveUserExpandedState();
  router.push('/');
};

// ==================== ПРОИЗНОШЕНИЕ ====================
const handlePronunciationSearch = () => {
  const query = searchQuery.value.trim();
  if (!query) return;
  openPronunciationSearch(query);
  searchQuery.value = '';
};

const handleYouglishSearch = () => {
  const query = searchQuery.value.trim();
  if (!query) return;
  openYouglishSearch(query);
  searchQuery.value = '';
};

const openPronunciationSearch = (term) => {
  const cleanTerm = term.replace(/[^\w\sа-яё]/gi, '').trim().replace(/\s+/g, '+');
  window.open(`https://www.google.com/search?q=how+to+pronounce+${cleanTerm}`, '_blank');
  $q.notify({ message: `Ищем произношение: ${term}`, color: 'positive', timeout: 2000 });
};

const openYouglishSearch = (term) => {
  const cleanTerm = term.replace(/[^\w\sа-яё]/gi, '').trim().replace(/\s+/g, '%20');
  window.open(`https://youglish.com/pronounce/${cleanTerm}/english`, '_blank');
  $q.notify({ message: `Youglish: ${term}`, color: 'primary', timeout: 2000 });
};

// ==================== МОДАЛКА ПАРОЛЯ ====================
const checkPassword = () => {
  if (passwordInput.value === currentSetToUnlock.value?.password) {
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

// ==================== ВСПОМОГАТЕЛЬНЫЕ ====================
const getImagePath = (imgName) => {
  return new URL(`../assets/images/${imgName}`, import.meta.url).href;
};

const getLevelStars = (stars) => {
  if (!stars) return '';
  return '⭐'.repeat(parseInt(stars));
};

// ==================== WATCHERS ====================
watch(searchQuery, (newQuery) => {
  if (!newQuery?.trim()) {
    searchExpandedSubTasks.value.clear();
    searchExpandedUnderSubTasks.value.clear();

    Object.keys(categoryStates.value).forEach(key => {
      categoryStates.value[key] = false;
    });
    return;
  }

  autoExpandParentCategoriesForSearch(normalizeString(newQuery).replace(/\//g, ''));
});

// ==================== LIFECYCLE HOOKS ====================
onMounted(() => {
  restoreUserExpandedState();
  restoreScrollPosition();

  // Анимация текста
  const introMessage = document.getElementById("intro-message");
  if (introMessage) {
    introMessage.textContent = "";
    let i = 0;
    const typeWriter = () => {
      if (i < ANIMATION_TEXT.length) {
        introMessage.textContent += ANIMATION_TEXT[i] === "\n" ? "\n" : ANIMATION_TEXT[i];
        i++;
        setTimeout(typeWriter, ANIMATION_SPEED);
      }
    };
    typeWriter();
  }
});

onBeforeUnmount(() => {
  saveScrollPosition();
  saveUserExpandedState();
});

onBeforeRouteLeave((to, from, next) => {
  saveScrollPosition();
  saveUserExpandedState();
  next();
});

</script>

<style lang="scss" scoped>
.blur {
  filter: blur(5px);
}
/* ==================== STICKY SEARCH ==================== */
.search-container {
  margin: 0 0 10px 0;
  padding: 0 10px;

  /* 🎯 STICKY - главное */
  position: sticky;
  top: 0;
  z-index: 100;



  /* ✨ Красивое прилипание */
  border-radius: 25px;
  margin-top: -5px;
  padding-top: 15px;
  padding-bottom: 5px;

  /* 📦 Тень, чтобы отделить от контента */
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  /* 🚀 Анимация появления */
  transition: box-shadow 0.3s ease;
}



.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  scale: 1.1;
  width: 100%;
  padding: 8px 8px 8px 15px;
  border-radius: 20px;
  border: 3px solid #000000;
  font-size: 15px;
  font-family: Special_f1;
  outline: none;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  animation: breathe 4s ease-in-out infinite;

  /* 🟡 ЖЕЛТОЕ СВЕЧЕНИЕ - РАВНОМЕРНО СО ВСЕХ СТОРОН */
  box-shadow:
    0 0 20px 5px rgba(0, 0, 0, 0.7),    /* Основное желтое свечение */
    0 2px 5px rgba(0, 0, 0, 0.1);            /* Легкая тень для глубины */
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
  animation: fadeInScale 0.3s ease;
}

.youglish-btn {
  right: 45px; /* Сдвигаем вторую кнопку левее */
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
}

.pronunciation-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.3);
}

.pronunciation-btn:active {
  transform: scale(0.95);
}

.pronunciation-btn:hover {
  background: linear-gradient(135deg, #764ba2, #667eea);
}

.youglish-btn:hover {
  background: linear-gradient(135deg, #ee5a24, #ff6b6b);
}

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

.search-input:focus {
  border-color: #6a6a6a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: none;
  padding-right: 40px;
}

.search-input::placeholder {
  font-style: italic;
  font-family: Helvetica;
  font-size: 11px;
  color: #888;
  opacity: 0.8;
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

.v-cards-choose {
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
}

.v-card-choose {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 5px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  cursor: none;
  transition: transform 0.2s, box-shadow 0.2s;
  margin: 0;
  user-select: none;
  width: 100%;
  box-sizing: border-box;
  flex-shrink: 0;
}

.q-btn {
  cursor: none;
}

.v-card-choose:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  user-select: none;
}

.card-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.card-description {
  text-align: left;
  margin-right: 10px;
  flex-grow: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-stars {
  text-align: right;
  white-space: nowrap;
  flex-shrink: 0;
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
  position: relative;
  height: 655px;
  width: 310px;
  right: 15px;

  background:
    linear-gradient(
        to top,
        #fff -250%,
        #000000 150%
    );
  margin: 5px auto;
  margin-top: 10px;
  border-radius: 2em;
  border: solid 5px #6a6a6a;
  box-shadow:
    inset 0 0 2px 7px #000,
    inset 0 0 3px 7px #000,
    0 0 30px 10px rgba(0, 0, 0, 0.6),
    0 150px 200px -80px #000;
  overflow: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: gray;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: darkgray;
  }

  &::before {
    text-align: center;
    word-spacing: 6em;
    color: #fff;
    font-family: helvetica;
    font-size: .7em;
    display: block;
    height: 240px;
    width: 240px;
    position: absolute;
    margin: 30px;
  }
}

.bubble {
  text-align: center;
  user-select: none;
  font-family: "Permanent Marker";
  font-size: 17px;
  display: inline-block;
  position: absolute;
  padding: 30px 40px;
  border-radius: 10px;
  border: 3px solid black;
  background: white;
  clear: both;
  line-height: 16px;
  padding: 16px 17px;

  &:before {
    content: '';
    position: absolute;
    bottom: -50px;
    height: 50px;
    width: 90px;
  }

  &.left {
    float: left;
    margin: 25px 1px 62px 176px;

    &:before {
      border-radius: 0 0 100%;
      box-shadow:
        -2px -2px 0 0 #000 inset,
        -23px 0 0 0 #fff inset,
        -25px -2px 0 0 #000 inset;
      left: 0;
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
  left: 0;
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

/* Специальные карточки одинаковой ширины */
.create-special-set,
.random-set,
.glassMorphism,
.randomQuestions,
.glassMorphism3,
.categoryExamples,
.category-game-patterns,
.reading-category,
.category-x,
.category-chinese {
  width: 100% !important;
  box-sizing: border-box !important;
}

/* Контейнеры категорий */
.category-sets-container,
.reading-sets-container,
.subtasks-sets-container {
  width: 100%;
  display: flex;
  flex-direction: column;
}

/* Элементы внутри контейнеров категорий */
.category-set,
.reading-set,
.subtask-set {
  width: 100% !important;
  box-sizing: border-box !important;
  margin-left: 0 !important;
}

/* Для subTasks добавляем небольшой отступ слева для визуальной иерархии */
.subtasks-sets-container .subtask-set {
  margin-left: 10px !important;
  width: calc(100% - 10px) !important;
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
  .reading-set {
    background: rgba(102, 126, 234, 0.1);
    border-left: 3px solid #667eea;

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

    &:hover {
      background: rgba(255, 107, 107, 0.2);
    }
  }
}

/* Стили для категории Examples */
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

    &:hover {
      background: rgba(0, 210, 211, 0.2);
    }
  }
}


.mission-name {
  text-align: left;
  margin-right: 10px;
}

.mission-stars {
  text-align: right;
  white-space: nowrap;
}




.glassMorphism {
  position: relative;
  overflow: hidden;
  margin: 1.5px;
  padding: 5px 20px;
  border-radius: 20px;
  color: white;
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
  position: relative;
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
}

.create-special-set::before {
  content: "";
  position: absolute;
  top: 0;
  left: -75%;
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
  position: relative;
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
}

.randomQuestions {
  background: linear-gradient(to top, #594eef, #6f75f1);
}

.random-set::before {
  content: "";
  position: absolute;
  top: 0;
  left: -75%;
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

.glassMorphism3::after {
  content: "";
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-image:
    linear-gradient(45deg, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
    linear-gradient(-45deg, rgba(255, 255, 255, 0.1) 2px, transparent 2px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
    linear-gradient(0deg, rgba(255, 255, 255, 0.08) 1px, transparent 1px);
  background-size: 15px 15px, 15px 15px, 20px 20px, 20px 20px;
  background-position: 0 0, 8px 8px, 0 0, 10px 10px;
  animation: geometricFloat 20s infinite linear;
  pointer-events: none;
  opacity: 0.4;
}

@keyframes geometricFloat {
  0% {
    background-position: 0px 0px, 8px 8px, 0px 0px, 10px 10px;
  }
  100% {
    background-position: 100px 100px, 108px 108px, 200px 200px, 210px 210px;
  }
}

/* Стили для subTasks */
.subtasks-header {
  background: linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%);
  color: white;
  border: 2px solid #8e44ad;
  font-weight: bold;
}

.subtask-set {
  //background: rgba(142, 68, 173, 0.1);
  background-color: #f9f9f9;
  //border-left: 3px solid #8e44ad;
  border-left: 8px solid rgba(0, 0, 0, 0.82);

  &:hover {
    background: rgba(142, 68, 173, 0.2);
  }
}








/* Стиль для интенсивных курсов */
.subtasks-header.intensive {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  border: 2px solid #ff4757;
  box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);

  &::before {
    background: linear-gradient(
        120deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.4) 50%,
        rgba(255, 255, 255, 0) 100%
    );
  }
}

.subtasks-intensive .subtask-set {
  background: rgba(255, 107, 107, 0.1);
  border-left: 3px solid #ff6b6b;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
  }
}

/* Стиль для премиум контента */
.subtasks-header.premium {
  background: linear-gradient(135deg, #ffd700 0%, #ffa500 100%);
  border: 2px solid #daa520;
  color: #000;

  &::before {
    background: linear-gradient(
        120deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.6) 50%,
        rgba(255, 255, 255, 0) 100%
    );
  }
}

/* Стиль для greenish контента */
.subtasks-header.greenish {
  background: linear-gradient(135deg, #88ff06 0%, #0bd506 100%);
  border: 2px solid rgba(21, 193, 1, 0.6);
  color: #000;

  &::before {
    background: linear-gradient(
        120deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.6) 50%,
        rgba(255, 255, 255, 0) 100%
    );
  }
}

.subtasks-premium .subtask-set {
  background: rgba(255, 215, 0, 0.1);
  border-left: 3px solid #ffd700;

  &:hover {
    background: rgba(255, 215, 0, 0.2);
  }
}

/* Стиль для грамматики */
.subtasks-header.grammar {
  background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
  border: 2px solid #00b894;

  &::before {
    background: linear-gradient(
        120deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0) 100%
    );
  }
}

.subtasks-grammar .subtask-set {
  background: rgba(0, 184, 148, 0.1);
  border-left: 3px solid #00b894;

  &:hover {
    background: rgba(0, 184, 148, 0.2);
  }
}

/* Стиль для разговорной практики */
.subtasks-header.speaking {
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  border: 2px solid #74b9ff;

  &::before {
    background: linear-gradient(
        120deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0) 100%
    );
  }
}

.subtasks-speaking .subtask-set {
  background: rgba(116, 185, 255, 0.1);
  border-left: 3px solid #74b9ff;

  &:hover {
    background: rgba(116, 185, 255, 0.2);
  }
}

/* Стиль для игровых заданий */
.subtasks-header.gaming {
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
  border: 2px solid #a29bfe;

  &::before {
    background: linear-gradient(
        120deg,
        rgba(255, 255, 255, 0) 0%,
        rgba(255, 255, 255, 0.3) 50%,
        rgba(255, 255, 255, 0) 100%
    );
  }
}

.subtasks-gaming .subtask-set {
  background: rgba(162, 155, 254, 0.1);
  border-left: 3px solid #a29bfe;

  &:hover {
    background: rgba(162, 155, 254, 0.2);
  }
}




/* Стиль Лава Лампа - ИСПРАВЛЕННЫЙ с работающими анимациями */
.subtasks-header.lavaLamp {
  background: linear-gradient(135deg, #1a237e 0%, #283593 50%, #1a237e 100%);
  color: #fff;
  border: 2px solid #3949ab;
  font-weight: bold;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 4px 20px rgba(26, 35, 126, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  z-index: 1;
}

/* Анимированные пузыри для заголовка - ФИКСИРОВАННЫЕ */
.subtasks-header.lavaLamp::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(255, 64, 129, 0.6) 8px, transparent 0),
    radial-gradient(circle at 80% 10%, rgba(255, 64, 129, 0.5) 15px, transparent 0),
    radial-gradient(circle at 40% 20%, rgba(255, 64, 129, 0.7) 10px, transparent 0),
    radial-gradient(circle at 65% 65%, rgba(255, 64, 129, 0.6) 12px, transparent 0),
    radial-gradient(circle at 15% 35%, rgba(255, 64, 129, 0.5) 9px, transparent 0);
  animation: lavaBubbleMove 8s ease-in-out infinite;
  pointer-events: none;
  z-index: -1;
}

/* Контейнер для подзаданий в стиле лава лампы */
.subtasks-lavaLamp {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #0d47a1 0%, #1976d2 100%);
  border-radius: 15px;
  padding: 3px;
  box-shadow:
    inset 0 0 20px rgba(0, 0, 0, 0.3),
    0 5px 15px rgba(13, 71, 161, 0.4);
}

/* Движущиеся пузыри в контейнере */
.subtasks-lavaLamp::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image:
    radial-gradient(circle at 10% 20%, rgba(255, 105, 180, 0.4) 12px, transparent 0),
    radial-gradient(circle at 90% 80%, rgba(255, 20, 147, 0.3) 18px, transparent 0),
    radial-gradient(circle at 30% 70%, rgba(255, 64, 129, 0.5) 10px, transparent 0),
    radial-gradient(circle at 70% 30%, rgba(255, 105, 180, 0.4) 15px, transparent 0),
    radial-gradient(circle at 50% 50%, rgba(255, 64, 129, 0.3) 8px, transparent 0),
    radial-gradient(circle at 25% 40%, rgba(255, 20, 147, 0.4) 14px, transparent 0),
    radial-gradient(circle at 75% 60%, rgba(255, 64, 129, 0.5) 11px, transparent 0);
  animation: lavaContainerBubbles 12s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

/* Отдельные подзадания */
.subtask-lavaLamp {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-left: 4px solid #ff4081;
  position: relative;
  z-index: 2;
  transition: all 0.3s ease;
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  overflow: hidden;
}

/* Маленькие пузыри в отдельных карточках */
.subtask-lavaLamp::before {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background-image:
    linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent);
  animation: cardShine 3s ease-in-out infinite;
  pointer-events: none;
  z-index: 1;
}

.subtask-lavaLamp:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateX(5px) scale(1.02);
  border-left: 4px solid #ff79b0;
  box-shadow:
    0 4px 15px rgba(255, 64, 129, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.subtask-lavaLamp:hover::before {
  animation: cardShine 1.5s ease-in-out infinite;
}

/* АНИМАЦИИ - ПЕРЕПИСАННЫЕ ДЛЯ РАБОТЫ */

/* Движение пузырей в заголовке */
@keyframes lavaBubbleMove {
  0%, 100% {
    background-position:
      0% 0%,
      100% 100%,
      50% 50%,
      75% 25%,
      25% 75%;
    opacity: 0.8;
  }
  25% {
    background-position:
      25% 25%,
      75% 75%,
      100% 100%,
      50% 50%,
      0% 0%;
    opacity: 1;
  }
  50% {
    background-position:
      50% 50%,
      25% 25%,
      75% 75%,
      100% 100%,
      0% 0%;
    opacity: 0.8;
  }
  75% {
    background-position:
      75% 75%,
      50% 50%,
      25% 25%,
      0% 0%,
      100% 100%;
    opacity: 1;
  }
}

/* Движение пузырей в контейнере */
@keyframes lavaContainerBubbles {
  0% {
    background-position:
      0% 0%,
      100% 100%,
      50% 50%,
      75% 25%,
      25% 75%,
      10% 90%,
      90% 10%;
    transform: scale(1);
  }
  33% {
    background-position:
      33% 33%,
      67% 67%,
      83% 17%,
      17% 83%,
      50% 50%,
      25% 75%,
      75% 25%;
    transform: scale(1.02);
  }
  66% {
    background-position:
      66% 66%,
      33% 33%,
      17% 83%,
      83% 17%,
      75% 25%,
      50% 50%,
      25% 75%;
    transform: scale(0.98);
  }
  100% {
    background-position:
      100% 100%,
      0% 0%,
      25% 75%,
      75% 25%,
      100% 0%,
      0% 100%,
      50% 50%;
    transform: scale(1);
  }
}

/* Блеск на карточках */
@keyframes cardShine {
  0% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: -100%;
  }
}


/* Стили для underSubTasks */
.undersubtasks-header {
  background: rgba(255, 255, 255, 0.1);
  border-left: 4px solid #09ff00;

  margin: 3px 0;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

.undersubtasks-sets-container {
  width: 100%;
  margin: 2px 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.undersubtask-set {
  background: rgba(255, 255, 255, 0.05);
  border-left: 4px solid #09ff00;
  margin-left: 25px !important;
  width: calc(100% - 25px) !important;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
  }
}

/* Специфичные стили для разных типов underSubTasks */
.undersubtask-speaking {
  border-left-color: #74b9ff;

  &:hover {
    border-left-color: #0984e3;
  }
}

.undersubtask-premium {
  border-left-color: #ffd700;

  &:hover {
    border-left-color: #ffa500;
  }
}

.undersubtask-grammar {
  border-left-color: #00b894;

  &:hover {
    border-left-color: #00a085;
  }
}

.undersubtask-lavaLamp {
  border-left-color: #ff4081;

  &:hover {
    border-left-color: #ff79b0;
  }
}

/* Пульсация при клике */
.subtask-lavaLamp:active {
  animation: lavaPulse 0.4s ease;
}

@keyframes lavaPulse {
  0% {
    transform: translateX(5px) scale(1.02);
    box-shadow:
      0 0 0 0 rgba(255, 64, 129, 0.7),
      0 4px 15px rgba(255, 64, 129, 0.3);
  }
  50% {
    transform: translateX(5px) scale(1.05);
    box-shadow:
      0 0 0 8px rgba(255, 64, 129, 0.3),
      0 6px 20px rgba(255, 64, 129, 0.4);
  }
  100% {
    transform: translateX(5px) scale(1.02);
    box-shadow:
      0 0 0 0 rgba(255, 64, 129, 0),
      0 4px 15px rgba(255, 64, 129, 0.3);
  }
}

/* Дополнительная анимация плавающих пузырей */
@keyframes floatBubble {
  0%, 100% {
    transform: translateY(0) translateX(0);
    opacity: 0.7;
  }
  25% {
    transform: translateY(-10px) translateX(5px);
    opacity: 1;
  }
  50% {
    transform: translateY(-5px) translateX(10px);
    opacity: 0.8;
  }
  75% {
    transform: translateY(-15px) translateX(-5px);
    opacity: 0.9;
  }
}

/* Добавляем отдельные плавающие элементы */
.subtasks-header.lavaLamp::after {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, rgba(255, 64, 129, 0.8), transparent);
  border-radius: 50%;
  top: 10%;
  left: 15%;
  animation: floatBubble 6s ease-in-out infinite;
  pointer-events: none;
  z-index: -1;
}

.subtasks-lavaLamp::after {
  content: "";
  position: absolute;
  width: 25px;
  height: 25px;
  background: radial-gradient(circle, rgba(255, 105, 180, 0.6), transparent);
  border-radius: 50%;
  bottom: 20%;
  right: 10%;
  animation: floatBubble 8s ease-in-out infinite reverse;
  pointer-events: none;
  z-index: 1;
}

/* ==================== СТИЛИ ДЛЯ UNDERSUBTASK-SET ==================== */
.undersubtask-premium {
  border-left-color: #ffd700 !important;
  background: rgba(255, 215, 0, 0.05);
}

.undersubtask-greenish {
  border-left-color: #88ff06 !important;
  background: rgba(68, 255, 6, 0.99);
}

.undersubtask-grammar {
  border-left-color: #00b894 !important;
  background: rgba(0, 184, 148, 0.05);
}

.undersubtask-speaking {
  border-left-color: #74b9ff !important;
  background: rgba(116, 185, 255, 0.05);
}

.undersubtask-gaming {
  border-left-color: #a29bfe !important;
  background: rgba(162, 155, 254, 0.05);
}

.undersubtask-lavaLamp {
  border-left-color: #ff4081 !important;
  background: rgba(255, 64, 129, 0.05);
}

.undersubtask-intensive {
  border-left-color: #ff6b6b !important;
  background: rgba(255, 107, 107, 0.05);
}

.undersubtask-glassMorphism {
  border-left-color: #ff6b35 !important;
  background: rgba(255, 107, 53, 0.05);
}
</style>


