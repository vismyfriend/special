<template>
  <div class="journal-container" :class="{ 'dark-theme': isDarkMode }">
    <!-- Верхняя плавающая панель -->
    <div class="floating-panel top-panel glass" :class="{ 'search-active': isSearchFocused }">
      <div class="panel-left">
        <button class="panel-btn" @click="toggleTheme" :title="isDarkMode ? 'Светлая тема' : 'Темная тема'">
          <span class="icon">{{ isDarkMode ? '🌙' : '☀️' }}</span>
        </button>
        <button class="panel-btn" @click="quickPost" title="Быстрая запись">
          <span class="icon">📝</span>
        </button>
      </div>

      <!-- Верхняя плавающая панель - секция поиска (всегда открыт) -->
      <div class="panel-center">
        <div class="search-container always-expanded">
          <!-- Иконка поиска внутри поля -->
          <div class="search-wrapper">
            <span class="search-icon">🔍</span>
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              type="text"
              class="search-input glass"
              placeholder="Найти в журнале..."
              @keyup.esc="clearSearch"
              @keyup.enter="nextMatch"
              @focus="onSearchFocus"
              @blur="onSearchBlur"
            />
            <button
              v-if="searchQuery.length > 0"
              class="clear-search-btn"
              @click="clearSearch"
              type="button"
              aria-label="Очистить поиск"
            >
              ✕
            </button>
          </div>

          <!-- Навигация по результатам (показываем, если есть совпадения) -->
          <div v-if="searchMatchCount > 0" class="search-nav">
      <span class="search-counter">
        {{ currentMatchIndex + 1 }} / {{ searchMatchCount }}
      </span>
            <button class="search-nav-btn" @click="previousMatch" :disabled="searchMatchCount === 0">
              ⬆️
            </button>
            <button class="search-nav-btn" @click="nextMatch" :disabled="searchMatchCount === 0">
              ⬇️
            </button>
          </div>
        </div>
      </div>

      <div class="panel-right">
        <button class="panel-btn" @click="openSettings" title="Настройки">
          <span class="icon">⚙️</span>
        </button>
<!--        <button class="panel-btn" @click="randomPost" title="Случайная запись">-->
<!--          <span class="icon">🎲</span>-->
<!--        </button>-->
      </div>
    </div>

    <!-- Основной контент -->
    <div class="content-wrapper">
      <!-- Шапка журнала -->
      <div class="journal-header glass" :class="{ 'dark-glass': isDarkMode }">
        <h1 class="journal-title">Журнал Винсента <br> Life of V 📔📚 </h1>
        <p class="journal-subtitle">мысли, события, дневник воспоминаний</p>
      </div>

      <!-- Счетчик постов -->
      <div class="posts-counter glass" :class="{ 'dark-glass': isDarkMode }" v-if="displayedPosts.length">
<!--        {{ displayedPosts.length }}-->
        {{ filteredPosts.length }}
<!--        {{ pluralize(displayedPosts.length, 'запись', 'записи', 'записей') }}-->
        {{ pluralize(displayedPosts.length, 'воспоминание', 'воспоминания', 'воспоминаний') }}
<!--        <span v-if="filteredPosts.length > displayedPosts.length" class="posts-total">-->
<!--    из {{ filteredPosts.length }}-->
<!--  </span>-->
      </div>

      <!-- Лента постов -->
      <div class="posts-feed">
        <div v-if="filteredPosts.length === 0" class="no-posts glass" :class="{ 'dark-glass': isDarkMode }">
          🤷‍♂️ Ничего не нашлось по запросу "{{ searchQuery }}"
        </div>

        <div
          v-for="(post, index) in displayedPosts"
          :key="post.id"
          class="post-card glass"
          :class="{
            'dark-glass': isDarkMode,
            'current-post': currentPostIndex === index,
            'highlight-post': highlightedPostId === post.id
          }"
          :ref="el => setPostRef(el, index)"
          :id="`post-${post.id}`"
        >
          <!-- Заголовок поста -->
          <div class="post-header">
            <h2 class="post-title">{{ post.title }}</h2>
            <div class="post-meta">
              <span class="post-date">{{ post.date }}</span>
              <span class="post-mood">{{ post.mood }}</span>
              <span class="post-location" v-if="post.location">
                📍 {{ post.location.name || post.location }}
              </span>
            </div>
          </div>

          <!-- Тело поста -->
          <div class="post-content">
            <div
              v-for="(item, idx) in post.content"
              :key="idx"
              class="content-block"
            >
              <!-- Текст -->
              <p v-if="item.type === 'text'" class="content-text">
                <span v-html="highlightText(item.value, searchQuery)"></span>
              </p>
              <!-- Одиночное изображение (ленивая загрузка) -->
              <LazyImage
                v-if="item.type === 'image'"
                :src="item.value"
                :caption="item.caption"
                :isDarkMode="isDarkMode"
              />

              <!-- Галерея -->
              <PhotoGallery
                v-if="item.type === 'gallery'"
                :photos="item.items"
              />

              <!-- Одиночное аудио (ленивая загрузка) -->
              <LazyAudio
                v-if="item.type === 'audio'"
                :src="item.value"
                :caption="item.caption"
                :isDarkMode="isDarkMode"
              />

              <!-- Плейлист с ленивой загрузкой -->
              <div v-if="item.type === 'audio-playlist'" class="audio-playlist">
                <div v-for="(track, trackIdx) in item.items" :key="trackIdx" class="audio-track">
                  <LazyAudio
                    :src="track.src"
                    :caption="track.caption"
                    :isDarkMode="isDarkMode"
                  />
                </div>
              </div>

              <!-- Ссылка -->
              <div v-if="item.type === 'link'" class="content-link">
                <a :href="item.value" target="_blank" rel="noopener" class="link-button" :class="{ 'dark-link': isDarkMode }">
                  🔗 {{ item.caption || item.value }}
                </a>
              </div>

            </div>

          </div>

          <!-- Реакции (как в Telegram) + кнопка поделиться -->
          <!-- Реакции -->
          <!-- Реакции -->
          <div class="post-reactions">
            <!-- Первая ручка - комментарий (модалка) -->
            <button class="reaction-btn comment-btn" @click="openComment(post.id)" title="Комментарий (модалка)">
              <span class="reaction-emoji">
<!--                ✏️-->
              </span>
            </button>

            <!-- Вторая ручка - раскрывающиеся комментарии -->
            <button
              class="reaction-btn comment-expand-btn"
              @click="toggleComments(post.id)"
              :class="{ 'active': activeCommentPostId === post.id }"
              title="Показать комментарии"
            >
              <span class="reaction-emoji">📝</span>
              <span class="reaction-count" v-if="getCommentsCount(post.id) > 0">
      {{ getCommentsCount(post.id) }}
    </span>
            </button>

            <!-- Все эмодзи реакций -->
            <button
              v-for="reaction in reactions"
              :key="reaction.emoji"
              class="reaction-btn"
              :class="{ 'active': postReactions[post.id]?.[reaction.emoji] }"
              @click="addReaction(post.id, reaction.emoji)"
            >
              <span class="reaction-emoji">{{ reaction.emoji }}</span>
              <span class="reaction-count" v-if="postReactions[post.id]?.[reaction.emoji]">
      {{ postReactions[post.id][reaction.emoji] }}
    </span>
            </button>

            <!-- Кнопка поделиться - САМАЯ ПРАВАЯ -->
            <button class="reaction-btn share-btn" @click="sharePost(post.id, post.title)">
              <span class="reaction-emoji">✉️</span>
            </button>
          </div>

          <!-- Блок комментариев (раскрывается) -->
          <div v-if="activeCommentPostId === post.id" class="comments-section">
            <div class="comments-header">
              <h4>Комментарии</h4>
              <button class="close-comments-btn" @click="closeComments">✕</button>
            </div>

            <!-- Список комментариев -->
            <div class="comments-list">
              <div v-for="comment in postComments[post.id] || []" :key="comment.id" class="comment-item">
                <div class="comment-content">
                  <div class="comment-header">
                    <div class="comment-avatar">{{ comment.avatar }}
                      <span class="comment-author">{{ comment.author }}</span>
                    </div>

                    <span class="comment-date">{{ comment.date }} в {{ comment.time }}</span>
                  </div>
                  <p class="comment-text">{{ comment.text }}</p>
                </div>
              </div>

              <!-- Пустое состояние -->
              <div v-if="!postComments[post.id] || postComments[post.id].length === 0" class="no-comments">
                Пока нет комментариев. Будьте первым!
              </div>
            </div>

            <!-- Форма нового комментария -->
            <div class="comment-form">
    <textarea
      v-model="newCommentText"
      placeholder="Напишите комментарий..."
      rows="2"
      class="comment-textarea"
      :class="{ 'dark-textarea': isDarkMode }"
    ></textarea>
              <div class="comment-form-actions">
                <button
                  class="comment-submit-btn"
                  @click="submitComment(post.id)"
                  :disabled="!newCommentText.trim()"
                >
                  Отправить
                </button>
              </div>
            </div>
          </div>
          <!-- Подвал поста -->
          <div class="post-footer">
            <span class="post-id">#{{ post.id }}</span>
          </div>
        </div>

      </div>
    </div>

    <!-- Нижняя плавающая панель навигации -->
    <div class="floating-panel bottom-panel glass" :class="{ 'dark-glass': isDarkMode, 'search-active': isSearchFocused }">

      <button class="panel-btn" @click="scrollToPrevious" :disabled="!hasPreviousPost" title="Предыдущий пост">
        <span class="icon">⬆️</span>
      </button>
      <button class="panel-btn" @click="scrollToNext" :disabled="!hasNextPost" title="Следующий пост">
        <span class="icon">⬇️</span>
      </button>
      <button class="panel-btn" @click="randomPost" title="Случайная запись">
        <span class="icon">🎲</span>
      </button>
      <button class="panel-btn" @click="scrollToTop" title="Наверх">
        <span class="icon">⏫</span>
      </button>
      <button class="panel-btn" @click="scrollToBottom" title="Вниз">
        <span class="icon">⏬</span>
      </button>

    </div>

    <!-- Модалка быстрой записи -->
    <div v-if="showQuickPostModal" class="modal-overlay" @click.self="closeQuickPost">
      <div class="modal-content glass" :class="{ 'dark-glass': isDarkMode }">
        <h3>📝 Быстрая запись</h3>
        <textarea
          v-model="quickPostText"
          placeholder="Что у тебя нового?"
          rows="5"
          class="quick-post-textarea"
          :class="{ 'dark-textarea': isDarkMode }"
        ></textarea>
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="closeQuickPost">Отмена</button>
          <button class="modal-btn save" @click="saveQuickPost">Сохранить</button>
        </div>
      </div>
    </div>

    <!-- Модалка комментария -->
    <div v-if="showCommentModal" class="modal-overlay" @click.self="closeCommentModal">
      <div class="modal-content glass" :class="{ 'dark-glass': isDarkMode }">
        <h3>✏️ Комментарий к посту</h3>
        <textarea
          v-model="commentText"
          placeholder="Напиши свой комментарий..."
          rows="4"
          class="quick-post-textarea"
          :class="{ 'dark-textarea': isDarkMode }"
        ></textarea>
        <div class="modal-actions">
          <button class="modal-btn cancel" @click="closeCommentModal">Отмена</button>
          <button class="modal-btn save" @click="saveComment">Отправить</button>
        </div>
      </div>
    </div>

    <!-- Уведомление об успешном копировании -->
    <Teleport to="body">
      <div v-if="showCopyNotification" class="notification-toast" :class="{ 'dark-theme': isDarkMode }">
        <span class="notification-icon">✅</span>
        <span class="notification-text">Ссылка скопирована!</span>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { lifeJournalPosts } from '../dataForGames/life-journal-data';
import PhotoGallery from './MyLifeJournalPhotoGallery.vue';

import LazyImage from './LazyImage.vue';
import LazyAudio from './LazyAudio.vue';

// В начале файла, после импортов добавь тестовые комментарии
const mockComments = {
  '2026-February-27': [
    {
      id: 1,
      author: 'Студент007',
      avatar: '👩',
      text: 'Teacher! You are the best!',
      date: '2026-02-27',
      time: '14:00'
    },
    {
      id: 2,
      author: 'АндрейБадаБум',
      avatar: '👨',
      text: 'Это я Винсента кодингу научил',
      date: '2026-02-27',
      time: '23:59'
    },
    {
      id: 3,
      author: 'Михамиджонка',
      avatar: '👩‍🦰',
      text: 'Ты не перестаешь surprise меня вообще... Откуда у тебя столько времени на всё это...',
      date: '2026-03-01',
      time: '09:11'
    },

  ],
  '2026-February-09-kusokPlaneti-0': [
    {
      id: 1,
      author: 'Полина',
      avatar: '👩',
      text: 'Ох уж этот холод! Зато участок того стоит ❄️',
      date: '2026-02-10',
      time: '08:30'
    },
    {
      id: 2,
      author: 'Сибиряк',
      avatar: '👨',
      text: '-30 это еще тепло! У нас бывает и -45))',
      date: '2026-02-10',
      time: '10:15'
    }
  ],

  '2026-February-05-kusokPlaneti-1': [
    {
      id: 1,
      author: 'Мечтатель',
      avatar: '👨‍🦰',
      text: 'Газончик - это святое! Тоже мечтаю о своем доме',
      date: '2026-02-06',
      time: '09:23'
    },
    {
      id: 2,
      author: 'Кэт_мама',
      avatar: '👩',
      text: 'Кэйси наверное тоже ждет свой домик с окошком)',
      date: '2026-02-06',
      time: '12:45'
    }
  ],

  '2026-February-06-kusokPlaneti-2': [
    {
      id: 1,
      author: 'Дмитрий',
      avatar: '👨‍🦰',
      text: 'Цена действительно подозрительная. Хорошо, что проверили',
      date: '2026-02-07',
      time: '11:30'
    },
    {
      id: 2,
      author: 'Ольга',
      avatar: '👩',
      text: 'Я тоже всегда настораживаюсь, когда цена сильно ниже рынка',
      date: '2026-02-07',
      time: '18:20'
    }
  ],

  '2026-February-07-kusokPlaneti-3': [
    {
      id: 1,
      author: 'Друг',
      avatar: '👨',
      text: 'В 38 попугаев? 😂 Классика!',
      date: '2026-02-08',
      time: '14:30'
    }
  ],

  '2026-February-09-kusokPlaneti-5': [
    {
      id: 1,
      author: 'Юрист_по_жизни',
      avatar: '⚖️',
      text: 'Эти "специалисты" в МФЦ везде одинаковые...',
      date: '2026-02-10',
      time: '16:20'
    }
  ],

  '2026-02-15-kusok-planeti-6': [
    {
      id: 1,
      author: 'Аналитик',
      avatar: '🔍',
      text: 'Душнила - это звучит гордо! Спасибо за ссылки',
      date: '2026-02-16',
      time: '09:45'
    }
  ],

  '2026-02-20-kusok-planeti-7': [
    {
      id: 1,
      author: 'Криптан',
      avatar: '🪙',
      text: 'Курс 77 - хорошая цена была для вывода',
      date: '2026-02-21',
      time: '10:30'
    }
  ],

  '2026-02-24-kusok-planeti-8': [
    {
      id: 1,
      author: 'Автолюбитель',
      avatar: '🚗',
      text: 'Главное что машина теплая и душевная!',
      date: '2026-02-25',
      time: '08:15'
    }
  ],

  '2026-02-25-kusok-planeti-9': [
    {
      id: 1,
      author: 'Полина',
      avatar: '👩',
      text: 'Феодалы звучит гордо! Теперь надо замок строить 🏰',
      date: '2026-02-26',
      time: '20:30'
    }
  ],

  '2026-02-20-monday-breakfast2': [
    {
      id: 1,
      author: 'Гурман',
      avatar: '🍳',
      text: 'Скрэмбл с лососем - моя любовь!',
      date: '2026-02-21',
      time: '09:15'
    }
  ]
};

// Добавь ref для хранения комментариев
const postComments = ref({
  '2026-February-27': mockComments['2026-February-27'],
  '2026-February-09-kusokPlaneti-0': mockComments['2026-February-09-kusokPlaneti-0'],
  '2026-February-05-kusokPlaneti-1': mockComments['2026-February-05-kusokPlaneti-1'],
  '2026-February-06-kusokPlaneti-2': mockComments['2026-February-06-kusokPlaneti-2'],
  '2026-February-07-kusokPlaneti-3': mockComments['2026-February-07-kusokPlaneti-3'],
  '2026-February-09-kusokPlaneti-5': mockComments['2026-February-09-kusokPlaneti-5'],
  '2026-02-15-kusok-planeti-6': mockComments['2026-02-15-kusok-planeti-6'],
  '2026-02-20-kusok-planeti-7': mockComments['2026-02-20-kusok-planeti-7'],
  '2026-02-24-kusok-planeti-8': mockComments['2026-02-24-kusok-planeti-8'],
  '2026-02-25-kusok-planeti-9': mockComments['2026-02-25-kusok-planeti-9'],
  '2026-02-20-monday-breakfast2': mockComments['2026-02-20-monday-breakfast2']
});

// Для новых комментариев
const newCommentText = ref('');
const activeCommentPostId = ref(null);


// Функции для комментариев
function toggleComments(postId) {
  if (activeCommentPostId.value === postId) {
    activeCommentPostId.value = null;
  } else {
    activeCommentPostId.value = postId;
    newCommentText.value = ''; // Очищаем поле при открытии

    // Плавно скроллим к блоку комментариев
    nextTick(() => {
      const commentsSection = document.querySelector('.comments-section');
      if (commentsSection) {
        const offset = 200; // Отступ сверху
        const elementPosition = commentsSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  }
}

function closeComments() {
  activeCommentPostId.value = null;
  newCommentText.value = '';
}

function getCommentsCount(postId) {
  return postComments.value[postId]?.length || 0;
}

function submitComment(postId) {
  if (!newCommentText.value.trim()) return;

  const newComment = {
    id: Date.now(),
    author: 'Сделайте скриншот вашего коммента:',
    avatar: '📸',
    text: newCommentText.value,
    date: new Date().toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '.'),
    time: new Date().toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    })
  };

  if (!postComments.value[postId]) {
    postComments.value[postId] = [];
  }

  postComments.value[postId].push(newComment);
  newCommentText.value = '';

  // Сохраняем в localStorage
  saveToStorage();

  nextTick(() => {
    const commentsList = document.querySelector('.comments-list');
    if (commentsList) {
      commentsList.scrollTop = commentsList.scrollHeight;
    }
  });
}
////

const router = useRouter();
const route = useRoute();

// Поиск с навигацией
const searchResults = ref([]);
const currentMatchIndex = ref(-1);
const searchMatchCount = ref(0);

// Состояние темы
const isDarkMode = ref(true);

// Поиск
const searchQuery = ref('');
const searchExpanded = ref(true);
const searchInputRef = ref(null);

// Быстрая запись
const showQuickPostModal = ref(false);
const quickPostText = ref('');

// Комментарии
const showCommentModal = ref(false);
const commentText = ref('');
const currentPostForComment = ref(null);

// local storage - до бэкенда

// В начале script setup, после других ref
const STORAGE_KEYS = {
  REACTIONS: 'journal_reactions',
  COMMENTS: 'journal_comments'
};

// Загружаем данные из localStorage
function loadFromStorage() {
  // Загружаем реакции
  const savedReactions = localStorage.getItem(STORAGE_KEYS.REACTIONS);
  if (savedReactions) {
    postReactions.value = JSON.parse(savedReactions);
  }

  // Загружаем комментарии
  const savedComments = localStorage.getItem(STORAGE_KEYS.COMMENTS);
  if (savedComments) {
    // Объединяем с mockComments (сохраненные имеют приоритет)
    const parsedComments = JSON.parse(savedComments);
    postComments.value = {
      ...mockComments, // базовые комментарии из моков
      ...parsedComments // сохраненные комментарии поверх
    };
  }
}

// Сохраняем в localStorage
function saveToStorage() {
  localStorage.setItem(STORAGE_KEYS.REACTIONS, JSON.stringify(postReactions.value));
  localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(postComments.value));
}



// Навигация
const postRefs = ref([]);
const currentPostIndex = ref(0);

const globalCurrentIndex = ref(0);

// Состояние для мобильного поиска
const isSearchFocused = ref(false);

// Пагинация
const postsPerPage = 3;
const currentStartPage = ref(1); // Для загрузки с начала
const currentEndPage = ref(1);    // Для загрузки с конца
const isLoadingMore = ref(false);
const scrollObserver = ref(null);
const loadingDirection = ref('down'); // 'down' или 'up'


const spoilerRevealed = ref(new Set());

// Реакции
const postReactions = ref({});

// Подсветка поста по ссылке
const highlightedPostId = ref(null);

// Уведомление о копировании
const showCopyNotification = ref(false);
let notificationTimeout = null;

// Список доступных реакций
const reactions = [
  { emoji: '👍', name: 'like' },
  { emoji: '💩', name: 'poop' },
  // { emoji: '👎', name: 'dislike' },
  { emoji: '❤️', name: 'heart' },
  // { emoji: '🤔', name: 'think' },
  // { emoji: '🔥', name: 'fire' }
];

// ========== ВЫЧИСЛЯЕМЫЕ СВОЙСТВА ==========

// Фильтруем посты
const filteredPosts = computed(() => {
  if (!searchQuery.value.trim()) {
    return lifeJournalPosts;
  }

  const query = searchQuery.value.toLowerCase().trim();

  return lifeJournalPosts.filter(post => {
    if (post.title?.toLowerCase().includes(query)) return true;
    for (const item of post.content) {
      if (item.type === 'text' && item.value?.toLowerCase().includes(query)) return true;
      if (item.type === 'link' && item.caption?.toLowerCase().includes(query)) return true;
      if (item.type === 'gallery') {
        for (const photo of item.items) {
          if (photo.caption?.toLowerCase().includes(query)) return true;
        }
      }
      if (item.type === 'audio-playlist') {
        for (const track of item.items) {
          if (track.caption?.toLowerCase().includes(query)) return true;
        }
      }
    }
    return false;
  });
});

// Посты с начала (для скролла вниз)
const startPosts = computed(() => {
  return filteredPosts.value.slice(0, currentStartPage.value * postsPerPage);
});

// Посты с конца (для скролла вверх)
const endPosts = computed(() => {
  const total = filteredPosts.value.length;
  const endIndex = total;
  const startIndex = Math.max(0, total - (currentEndPage.value * postsPerPage));
  return filteredPosts.value.slice(startIndex, endIndex);
});

// Итоговые отображаемые посты (объединение)
const displayedPosts = computed(() => {
  const start = startPosts.value;
  const end = endPosts.value;

  // Если конец пересекается с началом - убираем дубликаты
  const combined = [...start];
  end.forEach(post => {
    if (!combined.some(p => p.id === post.id)) {
      combined.push(post);
    }
  });

  return combined;
});

// Проверка, можно ли загрузить еще с начала
const hasMoreStart = computed(() => {
  return startPosts.value.length < filteredPosts.value.length;
});

// Проверка, можно ли загрузить еще с конца
const hasMoreEnd = computed(() => {
  return endPosts.value.length < filteredPosts.value.length;
});

// Навигация
const hasPreviousPost = computed(() => {
  return currentPostIndex.value > 0;
});

const hasNextPost = computed(() => {
  return currentPostIndex.value < filteredPosts.value.length - 1;
});

// ========== МЕТОДЫ ЗАГРУЗКИ ==========

// Загрузить следующие посты (при скролле вниз)
function loadMoreStart() {
  if (isLoadingMore.value || !hasMoreStart.value) return;
  isLoadingMore.value = true;
  loadingDirection.value = 'down';
  currentStartPage.value++;
  isLoadingMore.value = false;

  nextTick(() => {
    setupInfiniteScroll();
  });
}

// Загрузить предыдущие посты (при скролле вверх от конца)
function loadMoreEnd() {
  if (isLoadingMore.value || !hasMoreEnd.value) return;
  isLoadingMore.value = true;
  loadingDirection.value = 'up';
  currentEndPage.value++;
  isLoadingMore.value = false;

  nextTick(() => {
    setupInfiniteScroll();
  });
}

// Настройка Intersection Observer
function setupInfiniteScroll() {
  if (scrollObserver.value) {
    scrollObserver.value.disconnect();
  }

  // Определяем, за каким постом следить в зависимости от направления
  let targetIndex;

  if (loadingDirection.value === 'down') {
    // При скролле вниз следим за последним постом из начала
    const lastStartPostId = startPosts.value[startPosts.value.length - 1]?.id;
    targetIndex = displayedPosts.value.findIndex(p => p.id === lastStartPostId);
  } else {
    // При скролле вверх следим за первым постом из конца
    const firstEndPostId = endPosts.value[0]?.id;
    targetIndex = displayedPosts.value.findIndex(p => p.id === firstEndPostId);
  }

  if (targetIndex === -1) return;
  const targetElement = postRefs.value[targetIndex];

  if (!targetElement) return;

  scrollObserver.value = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoadingMore.value) {
        if (loadingDirection.value === 'down' && hasMoreStart.value) {
          loadMoreStart();
        } else if (loadingDirection.value === 'up' && hasMoreEnd.value) {
          loadMoreEnd();
        }
      }
    },
    { threshold: 0.3, rootMargin: '200px' }
  );

  scrollObserver.value.observe(targetElement);
}

// ========== НАВИГАЦИЯ ПО ПОСТАМ ==========

function setPostRef(el, index) {
  if (el) {
    postRefs.value[index] = el;
  }
}

function scrollToPost(index) {
  if (index >= 0 && index < postRefs.value.length) {
    // Временно отключаем автоопределение
    isNavigatingByButton.value = true;

    // Очищаем предыдущий таймаут
    if (navigationTimeout) clearTimeout(navigationTimeout);

    postRefs.value[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    currentPostIndex.value = index;

    // Снова включаем автоопределение через 500ms
    navigationTimeout = setTimeout(() => {
      isNavigatingByButton.value = false;
      // Обновляем после окончания анимации
      setTimeout(updateCurrentPostByCenter, 100);
    }, 500);
  }
}

function scrollToPrevious() {
  if (!hasPreviousPost.value) return;

  const prevGlobalIndex = currentPostIndex.value - 1;
  const prevPost = filteredPosts.value[prevGlobalIndex];

  // Проверяем, загружен ли предыдущий пост
  const isLoaded = displayedPosts.value.some(p => p.id === prevPost.id);

  if (!isLoaded) {
    // Если не загружен - подгружаем с конца
    loadingDirection.value = 'up';
    currentEndPage.value++;
  }

  // Ждем загрузки и скроллим
  setTimeout(() => {
    const newIndex = displayedPosts.value.findIndex(p => p.id === prevPost.id);
    if (newIndex !== -1) {
      scrollToPost(newIndex);
    }
  }, 100);
}

function scrollToNext() {


  if (!hasNextPost.value) return;

  const nextGlobalIndex = currentPostIndex.value + 1;
  const nextPost = filteredPosts.value[nextGlobalIndex];

  // Проверяем, загружен ли следующий пост
  const isLoaded = displayedPosts.value.some(p => p.id === nextPost.id);

  if (!isLoaded) {
    // Если не загружен - подгружаем с начала
    loadingDirection.value = 'down';
    currentStartPage.value++;
  }

  // Ждем загрузки и скроллим
  setTimeout(() => {
    const newIndex = displayedPosts.value.findIndex(p => p.id === nextPost.id);
    if (newIndex !== -1) {
      scrollToPost(newIndex);
    }
  }, 100);
}

const isNavigatingByButton = ref(false);
let navigationTimeout = null;


function updateCurrentPostByCenter() {
  if (isNavigatingByButton.value) return; // Не обновляем во время навигации по кнопкам

  let closestPostIndex = -1;
  let minDistanceToCenter = Infinity;
  const windowCenter = window.innerHeight / 2;

  postRefs.value.forEach((ref, index) => {
    if (!ref) return;

    const rect = ref.getBoundingClientRect();
    const postCenter = rect.top + rect.height / 2;
    const distanceToCenter = Math.abs(postCenter - windowCenter);

    if (distanceToCenter < minDistanceToCenter) {
      minDistanceToCenter = distanceToCenter;
      closestPostIndex = index;
    }
  });

  if (closestPostIndex !== -1 && closestPostIndex !== currentPostIndex.value) {
    currentPostIndex.value = closestPostIndex;
  }
}

function scrollToTop() {
  const firstGlobalPost = filteredPosts.value[0];
  if (!firstGlobalPost) return;

  const indexInDisplayed = displayedPosts.value.findIndex(p => p.id === firstGlobalPost.id);

  if (indexInDisplayed !== -1) {
    const element = document.getElementById(`post-${firstGlobalPost.id}`);
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      // Для скролла вверх: отступ 200px от верхнего края первого поста
      // const offset = 200;
      const offset = window.innerHeight * 0.4;

      const targetPosition = rect.top + scrollY - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'auto'
      });

      currentPostIndex.value = 0;
    }
  }
}

function scrollToBottom() {
  const lastGlobalPost = filteredPosts.value[filteredPosts.value.length - 1];
  if (!lastGlobalPost) return;

  const indexInDisplayed = displayedPosts.value.findIndex(p => p.id === lastGlobalPost.id);

  if (indexInDisplayed !== -1) {
    const element = document.getElementById(`post-${lastGlobalPost.id}`);
    if (element) {
      const rect = element.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;

      // Для скролла вниз: 30% высоты экрана, чтобы было видно конец предпоследнего и начало последнего
      const offset = window.innerHeight * 0.3;
      const targetPosition = rect.top + scrollY - offset;

      window.scrollTo({
        top: targetPosition,
        behavior: 'auto'
      });

      currentPostIndex.value = filteredPosts.value.length - 1;
    }
  }
}

function scrollToPostById(postId) {
  const postIndex = lifeJournalPosts.findIndex(p => p.id === postId);
  if (postIndex !== -1) {
    highlightedPostId.value = postId;

    // Проверяем, загружен ли пост
    const isLoaded = displayedPosts.value.some(p => p.id === postId);

    if (!isLoaded) {
      // Если пост в начале
      if (postIndex < postsPerPage) {
        loadingDirection.value = 'down';
        currentStartPage.value = Math.ceil((postIndex + 1) / postsPerPage);
      }
      // Если пост в конце
      else if (postIndex >= filteredPosts.value.length - postsPerPage) {
        loadingDirection.value = 'up';
        const endPages = Math.ceil((filteredPosts.value.length - postIndex) / postsPerPage);
        currentEndPage.value = endPages;
      }
      // Если пост где-то в середине - загружаем и с начала, и с конца
      else {
        loadingDirection.value = 'down';
        currentStartPage.value = Math.ceil((postIndex + 1) / postsPerPage);
        loadingDirection.value = 'up';
        const endPages = Math.ceil((filteredPosts.value.length - postIndex) / postsPerPage);
        currentEndPage.value = endPages;
      }
    }

    setTimeout(() => {
      const newIndex = displayedPosts.value.findIndex(p => p.id === postId);
      if (newIndex !== -1) {
        scrollToPost(newIndex);
        setTimeout(() => {
          highlightedPostId.value = null;
        }, 3000);
      }
    }, 300);
  }
}

function checkRouteForPost() {
  const postId = route.query.post ? parseInt(route.query.post) : null;
  if (postId && !isNaN(postId)) {
    scrollToPostById(postId);
  }
}

// ========== ФУНКЦИИ ПОИСКА ==========

function onSearchFocus() {
  if (window.innerWidth <= 600) {
    isSearchFocused.value = true;
  }
}

function onSearchBlur() {
  setTimeout(() => {
    if (window.innerWidth <= 600 && !searchQuery.value) {
      isSearchFocused.value = false;
    }
  }, 200);
}

function clearSearch() {
  searchQuery.value = '';
  searchResults.value = [];
  searchMatchCount.value = 0;
  currentMatchIndex.value = -1;

  document.querySelectorAll('.search-highlight').forEach(el => {
    el.outerHTML = el.innerHTML;
  });

  if (searchInputRef.value) {
    searchInputRef.value.blur();
  }

  if (window.innerWidth <= 600) {
    setTimeout(() => {
      isSearchFocused.value = false;
    }, 10);
  }
}

function handleNavClick(action) {
  if (window.innerWidth <= 600 && searchInputRef.value) {
    action();
    setTimeout(() => {
      searchInputRef.value?.focus();
    }, 10);
  } else {
    action();
  }
}

function toggleSpoiler(id) {
  if (spoilerRevealed.value.has(id)) {
    spoilerRevealed.value.delete(id);
  } else {
    spoilerRevealed.value.add(id);
  }
}

// парсинг для эффектов в тексте

function parseTextWithEffects(text) {

  if (!text) return [{ type: 'plain', content: text }];

  const parts = [];
  let lastIndex = 0;
  const regex = /\(\((spoiler|crossed|bold)\)\s*([^)]+)\)/g;
  let match;

  while ((match = regex.exec(text)) !== null) {


    // Добавляем обычный текст перед совпадением
    if (match.index > lastIndex) {
      const plainText = text.slice(lastIndex, match.index);
      parts.push({
        type: 'plain',
        content: plainText
      });
    }

    // Добавляем часть с эффектом
    parts.push({
      type: match[1], // spoiler, crossed или bold
      content: match[2],
      id: match[1] === 'spoiler' ? `spoiler-${Date.now()}-${Math.random()}` : undefined
    });

    lastIndex = match.index + match[0].length;
  }

  // Добавляем остаток текста
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    parts.push({
      type: 'plain',
      content: remainingText
    });
  }

  return parts;
}

function highlightText(text, query) {
  if (!text) return text;

  // Разбираем текст на части с эффектами
  const parts = parseTextWithEffects(text);

  // Собираем HTML с учетом эффектов и поиска
  const html = parts.map(part => {
    let content = part.content;

    // Применяем подсветку поиска если есть запрос
    if (query) {
      const regex = new RegExp(`(${query})`, 'gi');
      content = content.replace(regex, '<mark class="search-highlight">$1</mark>');
    }

    // Оборачиваем в соответствующий тег
    switch(part.type) {
      case 'spoiler':
        // Добавляем data-атрибут для идентификации и onclick атрибут
        return `<span class="spoiler" data-spoiler-id="${part.id}" onclick="this.classList.toggle('revealed'); console.log('🎯 Клик по спойлеру:', '${part.content}');">${content}</span>`;
      case 'crossed':
        return `<span class="crossed-text">${content}</span>`;
      case 'bold':
        return `<strong>${content}</strong>`;
      default:
        return content;
    }
  }).join('');

  return html;
}

//
// function highlightText(text, query) {
//   if (!query || !text) return text;
//   const regex = new RegExp(`(${query})`, 'gi');
//   return text.replace(regex, '<mark class="search-highlight">$1</mark>');
// }

function collectSearchMatches() {
  nextTick(() => {
    document.querySelectorAll('.search-highlight').forEach(el => {
      el.classList.remove('current-match');
    });
    const highlights = document.querySelectorAll('.search-highlight');
    searchResults.value = Array.from(highlights);
    searchMatchCount.value = highlights.length;
    currentMatchIndex.value = highlights.length > 0 ? 0 : -1;
    if (highlights.length > 0) {
      highlights[0].classList.add('current-match');
      highlights[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

function nextMatch() {
  handleNavClick(() => {
    if (searchResults.value.length === 0) return;
    searchResults.value[currentMatchIndex.value]?.classList.remove('current-match');
    let newIndex = (currentMatchIndex.value + 1) % searchResults.value.length;
    currentMatchIndex.value = newIndex;
    const currentElement = searchResults.value[newIndex];
    currentElement.classList.add('current-match');
    currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function previousMatch() {
  handleNavClick(() => {
    if (searchResults.value.length === 0) return;
    searchResults.value[currentMatchIndex.value]?.classList.remove('current-match');
    let newIndex = currentMatchIndex.value - 1;
    if (newIndex < 0) newIndex = searchResults.value.length - 1;
    currentMatchIndex.value = newIndex;
    const currentElement = searchResults.value[newIndex];
    currentElement.classList.add('current-match');
    currentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
}

function performSearch() {
  if (!searchQuery.value.trim()) {
    searchResults.value = [];
    searchMatchCount.value = 0;
    currentMatchIndex.value = -1;
    return;
  }
  setTimeout(collectSearchMatches, 100);
}

// ========== РЕАКЦИИ И КОММЕНТАРИИ ==========

function addReaction(postId, emoji) {
  if (!postReactions.value[postId]) {
    postReactions.value[postId] = {};
  }

  // Увеличиваем счетчик
  postReactions.value[postId][emoji] = (postReactions.value[postId][emoji] || 0) + 1;

  // Сохраняем в localStorage
  saveToStorage();
}

function openComment(postId) {
  currentPostForComment.value = postId;
  showCommentModal.value = true;
}

function closeCommentModal() {
  showCommentModal.value = false;
  commentText.value = '';
  currentPostForComment.value = null;
}

function saveComment() {
  if (commentText.value.trim()) {
    alert(`💬 Винсент только учится кодингу... Поэтому комментарии пока сохранятся только пару часов... Вы на всякий случай сриншот сделайте и отправьте Винсентику:\n\n${commentText.value}`);
    closeCommentModal();
  }
}

// ========== БЫСТРАЯ ЗАПИСЬ ==========

function quickPost() {
  showQuickPostModal.value = true;
}

function closeQuickPost() {
  showQuickPostModal.value = false;
  quickPostText.value = '';
}

function saveQuickPost() {
  if (quickPostText.value.trim()) {
    alert('📝 Винсент только учится кодингу... Поэтому вы на всякий случай скриншот сделайте, чтобы точно сохранилась запись и отправьте Винсентику:\n\n' + quickPostText.value);

    closeQuickPost();
  }
}

// ========== ПРОЧИЕ ФУНКЦИИ ==========

function randomPost() {
  const randomIndex = Math.floor(Math.random() * filteredPosts.value.length);
  const randomPost = filteredPosts.value[randomIndex];

  // Проверяем, загружен ли пост
  const isLoaded = displayedPosts.value.some(p => p.id === randomPost.id);

  if (!isLoaded) {
    // Если пост в начале
    if (randomIndex < postsPerPage) {
      loadingDirection.value = 'down';
      currentStartPage.value = Math.ceil((randomIndex + 1) / postsPerPage);
    }
    // Если пост в конце
    else if (randomIndex >= filteredPosts.value.length - postsPerPage) {
      loadingDirection.value = 'up';
      const endPages = Math.ceil((filteredPosts.value.length - randomIndex) / postsPerPage);
      currentEndPage.value = endPages;
    }
    // Если пост где-то в середине
    else {
      loadingDirection.value = 'down';
      currentStartPage.value = Math.ceil((randomIndex + 1) / postsPerPage);
    }
  }

  setTimeout(() => {
    const newIndex = displayedPosts.value.findIndex(p => p.id === randomPost.id);
    if (newIndex !== -1) {
      scrollToPost(newIndex);
    }
  }, 300);
}

function openSettings() {
  alert('⚙️ Тут будут настройки журнала');
}

function pluralize(count, one, few, many) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod100 >= 11 && mod100 <= 19) return many;
  if (mod10 >= 2 && mod10 <= 4) return few;
  if (mod10 === 1) return one;
  return many;
}

function toggleTheme() {
  isDarkMode.value = !isDarkMode.value;
}

function sharePost(postId, postTitle) {
  const currentPath = route.path;
  const shareUrl = `${window.location.origin}${currentPath}?post=${postId}`;

  navigator.clipboard.writeText(shareUrl).then(() => {
    showCopyNotification.value = true;
    if (notificationTimeout) clearTimeout(notificationTimeout);
    notificationTimeout = setTimeout(() => {
      showCopyNotification.value = false;
    }, 2000);
  }).catch(err => {
    const textarea = document.createElement('textarea');
    textarea.value = shareUrl;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    showCopyNotification.value = true;
    setTimeout(() => {
      showCopyNotification.value = false;
    }, 2000);
  });
}

// ========== WATCH ==========

watch(searchQuery, () => {
  performSearch();
  currentStartPage.value = 1;
  currentEndPage.value = 1;
});

watch(() => route.query.post, (newPostId) => {
  if (newPostId) {
    scrollToPostById(parseInt(newPostId));
  }
});

// Для отладки
const currentPostTitle = computed(() => {
  if (currentPostIndex.value >= 0 && currentPostIndex.value < displayedPosts.value.length) {
    return displayedPosts.value[currentPostIndex.value]?.title;
  }
  return 'нет поста';
});

// Логируем изменение фокуса
// watch(currentPostIndex, (newVal, oldVal) => {
//   if (newVal !== oldVal) {
//     console.log(`🎯 Фокус: ${oldVal} → ${newVal}`,
//       displayedPosts.value[newVal]?.title);
//   }
// });




// ========== МОНТИРОВАНИЕ ==========

onMounted(() => {
  // Загружаем сохраненные данные
  loadFromStorage();
  // Очищаем postRefs
  postRefs.value = postRefs.value.filter(Boolean);

  // Создаем наблюдатель за скроллом с requestAnimationFrame для производительности
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateCurrentPostByCenter();
        ticking = false;
      });
      ticking = true;
    }
  });

  // Также обновляем при изменении размера окна
  window.addEventListener('resize', () => {
    window.requestAnimationFrame(updateCurrentPostByCenter);
  });

  // Первоначальное обновление
  setTimeout(updateCurrentPostByCenter, 100);

  // Убираем старый Intersection Observer и оставляем только infinite scroll
  setupInfiniteScroll();
  checkRouteForPost();

  if (window.location.hash) {
    const hash = window.location.hash;
    const match = hash.match(/^#post-(\d+)$/);
    if (match) {
      const postId = parseInt(match[1]);
      router.replace({ query: { post: postId } });
    }
  }



});

</script>


<style lang="scss" scoped>
.journal-container {
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
  transition: background 0.3s ease, color 0.3s ease;
  position: relative;
  color: white;

  &.dark-theme {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: #e0e0e0;
  }
}

// Стеклянный эффект
.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);

  &.dark-glass {
    background: rgba(0, 0, 0, 0.4);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

// Плавающие панели
.floating-panel {
  position: fixed;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  z-index: 1000;
  transition: all 0.3s ease;

  &.top-panel {
    left: 50%;
    transform: translateX(-50%);
    top: 20px;
    min-width: 300px;
    justify-content: space-between;
  }

  &.bottom-panel {
    right: 20px; /* прижимаем к правому краю */
    top: 50%;
    transform: translateY(-50%);
    left: auto;
    bottom: auto;
    min-width: auto;
    width: auto;
    padding: 0.5rem;
    flex-direction: column; /* вертикальное расположение */
    gap: 0.3rem;
  }

  .panel-left,
  .panel-center,
  .panel-right {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
}

.panel-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  color: inherit;
  cursor: none;


  .icon {
    font-size: 1.3rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;

    &:hover {
      transform: none;
      background: none;
    }
  }
}

// Поиск (всегда открыт)
.search-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &.always-expanded {
    .search-wrapper {
      position: relative;
      display: flex;
      align-items: center;

      .search-icon {
        position: absolute;
        left: 12px;
        font-size: 1.2rem;
        opacity: 0.8;
        pointer-events: none;
        z-index: 1;
      }

      .search-input {
        width: 220px;
        padding: 0.5rem 1rem 0.5rem 2.5rem;
        border: 1px solid rgba(255, 255, 255, 0.3);
        background: rgba(255, 255, 255, 0.2);
        color: white;
        outline: none;
        border-radius: 30px;
        font-size: 0.95rem;
        transition: all 0.3s ease;

        &::placeholder {
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }

        &:focus {
          background: rgba(255, 255, 255, 0.25);
          border-color: rgba(255, 255, 255, 0.6);
          width: 280px;
        }

        .dark-theme & {
          background: rgba(0, 0, 0, 0.3);
          border-color: rgba(255, 255, 255, 0.1);

          &:focus {
            background: rgba(0, 0, 0, 0.4);
            border-color: rgba(255, 255, 255, 0.2);
          }
        }
      }
    }
  }
}

// Навигация поиска
.search-nav {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: 0.2rem;
  flex-shrink: 0;
}

.search-counter {
  font-size: 0.8rem;
  padding: 0 0.5rem;
  color: white;
  white-space: nowrap;
}

.search-nav-btn {
  background: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1rem;
  transition: all 0.2s;


  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

// Основной контент
.content-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 90px 2rem 0.5rem; /* увеличили правый отступ */
  padding-top: 100px;
  padding-bottom: 100px;
  min-height: 100vh;
  box-sizing: border-box;
  overflow-y: auto;
}

// Шапка журнала
.journal-header {
  padding: 2rem;
  margin-bottom: 2rem;
  color: inherit;

  .journal-title {
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
    font-weight: 600;
    font-family: Special_f1;
  }

  .journal-subtitle {
    font-size: 1.1rem;
    margin: 0;
    opacity: 0.9;
    line-height: 0.9;
  }
}

// Счетчик постов
.posts-counter {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  margin-bottom: 2rem;
  color: inherit;
  font-size: 0.95rem;
}

// Лента
.posts-feed {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

// Карточка поста
.post-card {
  padding: 2rem;
  color: inherit;
  transition: transform 0.3s, box-shadow 0.3s;
  scroll-margin-top: 100px;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 40px 0 rgba(31, 38, 135, 0.3);
  }

  &.current-post {
    outline: 2px solid rgba(255, 255, 255, 0.8);
    outline-offset: 2px;
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.3);
  }

  &.highlight-post {
    animation: highlightPulse 3s ease;
    border: 2px solid rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
  }
}

@keyframes highlightPulse {
  0% {
    border-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
  }
  70% {
    border-color: rgba(255, 255, 255, 0.8);
    box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
  }
  100% {
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: none;
  }
}

.post-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
}

.post-title {
  font-size: 1.8rem;
  padding-left: 10px;
  margin: 0 0 0.8rem 0;
  line-height: 0.9;
}

.post-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.9rem;
  opacity: 0.9;
  flex-wrap: wrap;

  span {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.2rem 1rem;
    border-radius: 20px;
  }
}

.post-content {
  line-height: 0.9;
}

.content-block {
  margin-bottom: 1.5rem;
}

.content-text {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  white-space: pre-wrap;
  line-height: 0.9;
}

// Одиночное изображение
.content-image {
  margin: 1.5rem 0;

  img {
    max-width: 100%;
    max-height: 500px;
    border-radius: 15px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
    display: block;
    margin: 0 auto;
  }
}

.image-caption {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.8;
  text-align: center;
  font-style: italic;
}

// Аудио
.content-audio {
  margin: 1.5rem 0;
}

.audio-player {
  width: 100%;
  border-radius: 30px;
}

.audio-caption {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  opacity: 0.8;
}

// Плейлист
.audio-playlist {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin: 1.5rem 0;
}

.audio-track {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem;

  .dark-theme & {
    background: rgba(0, 0, 0, 0.3);
  }
}

// Ссылка
.content-link {
  margin: 1.5rem 0;
}

.link-button {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  color: inherit;
  text-decoration: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s;

  &:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: scale(1.02);
  }

  .dark-theme & {
    background: rgba(0, 0, 0, 0.3);

    &:hover {
      background: rgba(0, 0, 0, 0.5);
    }
  }
}

// Реакции
.post-reactions {
  display: flex;
  gap: 0.5rem;
  margin: 1.5rem 0;
  padding: 0.5rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  align-items: center;
}

.reaction-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 30px;
  padding: 0.3rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s;
  color: inherit;
  font-size: 1rem;
  cursor: none;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
  }

  &.active {
    background: rgba(255, 255, 255, 0.3);
    border: 1px solid rgba(255, 255, 255, 0.5);
  }

  .reaction-emoji {
    font-size: 1.2rem;
  }

  .reaction-count {
    font-size: 0.9rem;
    opacity: 0.8;
  }

  &.comment-btn {
    background: rgba(255, 255, 255, 0.15);
    margin-right: auto; /* Прижимает комментарий к левому краю */
  }

  &.share-btn {
    background: rgba(255, 255, 255, 0.15);
    margin-left: auto; /* Прижимает поделиться к правому краю */

    &:hover {
      background: rgba(255, 255, 255, 0.25);
    }

    .reaction-emoji {
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }
  }
}

.post-footer {
  margin-top: 1rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.8rem;
  opacity: 0.6;
  display: flex;
}

.no-posts {
  padding: 3rem;
  text-align: center;
  color: inherit;
  font-size: 1.2rem;
}

// Модальные окна
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  padding: 2rem;
  color: inherit;

  h3 {
    margin-top: 0;
    margin-bottom: 1rem;
  }
}

.quick-post-textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 1rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }

  .dark-theme & {
    background: rgba(0, 0, 0, 0.3);
  }
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.modal-btn {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 20px;
  font-size: 1rem;
  transition: all 0.2s;

  &.cancel {
    background: rgba(255, 255, 255, 0.2);
    color: inherit;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  &.save {
    background: rgba(76, 175, 80, 0.8);
    color: white;

    &:hover {
      background: rgba(76, 175, 80, 1);
    }
  }
}

// Уведомление
.notification-toast {
  position: fixed;
  bottom: 100px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(76, 175, 80, 0.9);
  backdrop-filter: blur(10px);
  color: white;
  padding: 12px 24px;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 3000;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;

  &.dark-theme {
    background: rgba(46, 125, 50, 0.9);
  }

  .notification-icon {
    font-size: 1.2rem;
  }

  .notification-text {
    font-size: 1rem;
    font-weight: 500;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translate(-50%, 20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

// Подсветка поиска
::v-deep .search-highlight {
  background: rgba(255, 255, 0, 0.4);
  padding: 0 2px;
  border-radius: 4px;
  transition: all 0.2s;

  &.current-match {
    background: rgba(255, 255, 0, 0.8);
    box-shadow: 0 0 10px rgba(255, 255, 0, 0.5);
    font-weight: bold;
  }

  .dark-theme & {
    background: rgba(255, 255, 0, 0.3);

    &.current-match {
      background: rgba(255, 255, 0, 0.6);
    }
  }
}

// Адаптивность
@media (max-width: 600px) {
  .floating-panel {
    min-width: auto;
    width: 95%;
    padding: 0.4rem 0.6rem;
    gap: 0.3rem;

    .panel-btn {
      width: 32px;
      height: 32px;

      .icon {
        font-size: 1rem;
      }
    }
  }

  // Верхняя панель - всё в одну строку!
  .floating-panel.top-panel {
    flex-wrap: nowrap;
    gap: 0.3rem;
    padding: 0.4rem 0.6rem;

    .panel-left, .panel-right {
      flex: 0 0 auto;
    }

    .panel-center {
      flex: 1 1 auto;
      min-width: 0;
      order: 0;
      width: auto;
      margin-top: 0;

      .search-container {
        width: auto;
        justify-content: flex-start;
        gap: 0.3rem;
      }
    }
  }

  .floating-panel.top-panel.search-active {
    top: auto;
    bottom: 20px;
    transition: all 0.3s ease;
  }

  // Правая панель при поиске - только немного поднимаем, но не уводим за экран
  .floating-panel.bottom-panel.search-active {
    bottom: auto;
    top: 40%; // чуть выше обычного, но не сильно
    transform: translateY(-40%);
  }

  // Добавляем плавность
  .floating-panel.bottom-panel {
    transition: top 0.3s ease, transform 0.3s ease;

  }

  // Немного корректируем отступы контента
  .floating-panel.top-panel.search-active ~ .content-wrapper {
    padding-top: 80px; // Оставляем как есть
    padding-bottom: 100px; // Увеличиваем нижний отступ
  }

  .journal-header {
    padding: 1.5rem;

    .journal-title {
      font-size: 1.6rem;
    }

    .journal-subtitle {
      font-size: 0.9rem;
    }
  }

  .post-card {
    padding: 0.5rem 1.2rem 0.5rem 0.5rem;
  }

  // Адаптация поиска для мобильных - всё в одной строке
  .search-container.always-expanded {
    flex-wrap: nowrap;
    align-items: center;
    gap: 0.3rem;
    width: 100%;

    .search-wrapper {
      flex: 1 1 auto;
      min-width: 50px;

      .search-input {
        width: 100%;
        font-size: 0.85rem;
        padding: 0.3rem 0.8rem 0.3rem 2rem;

        &:focus {
          width: 100%;
        }
      }

      .search-icon {
        left: 8px;
        font-size: 0.9rem;
      }
    }

    .search-nav {
      flex-shrink: 0;
      margin-top: 0;
      padding: 0.1rem;
      gap: 0.1rem;

      .search-counter {
        font-size: 0.65rem;
        padding: 0 0.2rem;
      }

      .search-nav-btn {
        width: 22px;
        height: 22px;
        font-size: 0.8rem;
      }
    }
  }

  .post-reactions {
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 0.3rem;
  }

  .reaction-btn {
    padding: 0.2rem 0.5rem;
    font-size: 0.85rem;

    .reaction-emoji {
      font-size: 0.95rem;
    }
  }

  .comment-btn, .share-btn {
    margin-left: 0;
  }

  // Для очень маленьких экранов
  @media (max-width: 380px) {
    .search-container.always-expanded {
      .search-nav {
        .search-counter {
          display: none;
        }
      }
    }

    .panel-btn {
      width: 28px;
      height: 28px;

      .icon {
        font-size: 0.9rem;
      }
    }
  }

  .floating-panel.bottom-panel {
    display: flex; // меняем с none на flex
    left: auto;
    right: 2px;
    top: 50%;
    transform: translateY(-50%);
    bottom: auto;
    min-width: auto;
    width: auto;
    padding: 4px;
    flex-direction: column; // вертикальное расположение
    gap: 0.3rem;

    .panel-btn {
      width: 36px;
      height: 36px;

      .icon {
        font-size: 1.1rem;
      }
    }
  }
  // Корректируем отступы контента, так как панель теперь сбоку
  .content-wrapper {
    padding-right: 30px; // чтобы контент не заходил за панель
  }

}

// Кнопка очистки поиска
.clear-search-btn {
  position: absolute;
  right: 8px;
  background: none;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ff6b6b;
  font-size: 1.2rem;
  font-weight: bold;
  transition: all 0.2s ease;
  z-index: 2;
  padding: 0;
  line-height: 1;

  &:hover {
    background: rgba(255, 107, 107, 0.2);
    transform: scale(1.1);
    color: #ff4757;
  }

  &:active {
    transform: scale(0.95);
  }

  .dark-theme & {
    color: #ff8a8a;

    &:hover {
      background: rgba(255, 138, 138, 0.2);
      color: #ff6b6b;
    }
  }
}



// Стиль для "из N записей" в счетчике
.posts-total {
  opacity: 0.7;
  font-size: 0.85rem;
  margin-left: 0.3rem;
}

// Адаптация для мобильных
@media (max-width: 600px) {
  .clear-search-btn {
    right: 6px;
    width: 22px;
    height: 22px;
    font-size: 1rem;
  }

}

/* Секция комментариев */
.comments-section {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 2px solid rgba(255, 255, 255, 0.2);
  animation: slideDown 0.3s ease;
}

.comments-header {
  display: flex;
  justify-content: space-between;
  align-items: center;


  h4 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
}

.close-comments-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  font-size: 1rem;
  transition: all 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(1.1);
  }
}

.comments-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
  padding: 0.5rem 0.5rem 0.5rem 0; /* Добавили отступы внутри */
  background: rgba(0, 0, 0, 0.1); /* Очень легкий полупрозрачный фон */
  border-radius: 8px; /* Легкое скругление */

  /* Стилизация скроллбара */
  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba(255, 255, 255, 0.4);
    }
  }

}


/* Темная тема для блока комментариев */
.dark-theme .comments-list {
  background: rgba(255, 255, 255, 0.05); /* Светлый полупрозрачный фон для темной темы */
  border-color: rgba(255, 255, 255, 0.03);
}

.comment-item {
  display: flex;
  gap: 1rem;
  padding: 0.5rem 0.5rem; /* Немного увеличили отступы */
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);

  &:last-child {
    border-bottom: none;
  }
}

.comment-avatar {
  font-size: 1.5rem;
  line-height: 1;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 4px;
}

.comment-author {
  font-weight: 600;
  font-size: 0.95rem;
}

.comment-date {
  font-size: 0.75rem;
  opacity: 0.6;
}

.comment-text {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.4;
  white-space: pre-wrap;
}

.no-comments {
  text-align: center;
  padding: 2rem;
  opacity: 0.6;
  font-style: italic;
}

/* Форма комментария */
.comment-form {
  margin-top: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 1rem;
}

.comment-textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: inherit;
  font-family: inherit;
  font-size: 0.95rem;
  resize: vertical;
  margin-bottom: 0.8rem;

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }

  &:focus {
    outline: none;
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.15);
  }

  .dark-theme & {
    background: rgba(0, 0, 0, 0.2);

    &:focus {
      background: rgba(0, 0, 0, 0.3);
    }
  }
}

.comment-form-actions {
  display: flex;
  justify-content: flex-end;
}

.comment-submit-btn {
  background: rgba(76, 175, 80, 0.8);
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  color: white;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background: rgba(76, 175, 80, 1);
    transform: scale(1.05);
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
}

/* Анимация */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Стиль для активной кнопки */
.reaction-btn.comment-expand-btn.active {
  background: rgba(255, 255, 255, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.5);
}
/* Стили для спойлера */

/* Стили для спойлера - исправлено для v-html */
:deep(.spoiler) {
  filter: blur(4px);
  cursor: pointer;
  transition: filter 0.2s ease;
  background: rgba(0, 0, 0, 0.1);
  padding: 0 2px;
  border-radius: 4px;
  display: inline-block;

  &:hover {
    filter: blur(3px);
    background: rgba(0, 0, 0, 0.15);
  }

  &.revealed {
    filter: none;
    background: none;

    &:hover {
      filter: none;
      background: none;
    }
  }
}

:deep(.crossed-text) {
  text-decoration: line-through;
  opacity: 0.8;
}

.dark-theme :deep(.spoiler) {
  background: rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
}

/* Адаптация для мобильных */
@media (max-width: 600px) {
  .comment-item {
    gap: 0.8rem;
  }

  .comment-avatar {
    font-size: 1.5rem;
  }

  .comment-header {

    gap: 0.2rem;
  }

  .comment-date {
    font-size: 0.7rem;
  }

  .comment-text {
    font-size: 0.9rem;
  }

  .comment-form {
    padding: 0.8rem;
  }

  .comment-textarea {
    padding: 0.6rem;
    font-size: 0.9rem;
  }

  .comment-submit-btn {
    padding: 0.4rem 1.2rem;
    font-size: 0.85rem;
  }
}

</style>
