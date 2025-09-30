<script setup>
import { ref } from 'vue'

// Данные статей прямо в компоненте
const articles = ref([
  {
    id: 1,
    title: "You Don't Need 10,000 Steps for Good Health",
    level: 2,
    description: "New research shows that walking 7,000 steps per day is enough for good health, challenging the popular 10,000 steps myth.",
    warmupQuestions: [
      "How often do you walk on foot?",
      "Do you count your steps?",
      "Do you enjoy walking?",
      "How many steps did you make this week?",
      "What kinds of exercise do you do to stay healthy?"
    ],
    imageUrl: new URL("../assets/images/vincentOnKayak.jpg", import.meta.url).href,
    imageAlt: "Why walk if you can lie and relax",
    publishDate: "2024-01-15",
    readTime: "3 min",
    content: `
      <p>Many people think they need to walk 10,000 steps  every day to be <strong>healthy.</strong> But new <strong>research</strong> shows this is not true. <strong>Scientists</strong> say 7,000 steps per day is <strong>enough</strong> for your health.</p>

      <p>Dr. Melody Ding did this research at the University of Sydney. She looked at different other researches about walking and health. She wanted to know how many steps people need to stay healthy.</p>

      <p>Her research was based on people who walk different amounts every day. People who walk 7,000 steps are healthier than people who walk only 2,000 steps. People who walk more have less risk of catching a cold. They also have less risk of heart disease and dementia. And even the risk of dying.</p>

      <p>Where does the 10,000 steps <strong>benchmark come from?</strong> Dr. Sean Heffron says this number is not from science. The 10,000 steps objective came from advertising in Japan. A company made a pedometer and called it "10,000 steps meter."</p>

      <p>Dr. Martha Gulati is a heart doctor. She does not trust round numbers like 10,000. She thinks these numbers are not always from science.</p>

      <p>The research shows that walking more is fundamental for good health. Dr. Ding says walking more than 7,000 steps is good. "If one is already very active and doing 10,000+ steps a day, they definitely don't need to hold back and go back to 7,000!" she said.</p>

      <p><strong>You don't need to worry if you can't walk 10,000 steps every day.</strong> Just walk a little more than you do now. This will help your health.</p>
    `
  },
  {
    id: 2,
    title: "The Benefits of Learning English Through Stories",
    level: 1,
    description: "Discover how reading stories can improve your English vocabulary and comprehension in a natural way.",
    warmupQuestions: [
      "What do you find most difficult about learning English?",
      "Do you enjoy reading stories in English? Why or why not?"
    ],
    imageUrl: null,
    imageAlt: "A person reading an English book in a cozy environment",
    publishDate: "2024-01-10",
    readTime: "4 min",
    content: `
      <p><strong>Learning English through stories is one of the most effective methods</strong> for language acquisition. When you read stories, you encounter vocabulary and grammar in context, which makes it easier to remember and use.</p>

      <p>Stories provide emotional connection and context that help your brain retain information better than isolated vocabulary lists. Your brain remembers words better when they are part of an interesting narrative.</p>

      <p>Start with simple stories at your level and gradually move to more complex texts. Don't worry about understanding every word - focus on the overall meaning and enjoy the story!</p>
    `
  }
])

// Выбираем первую статью для демонстрации
const currentArticle = ref(articles.value[0])

// Функция для смены статьи
const selectArticle = (article) => {
  currentArticle.value = article
}

// Функция для цвета уровня
const getLevelColor = (level) => {
  const colors = {
    1: '#10b981', // изумрудный
    2: '#f59e0b', // янтарный
    3: '#ef4444'  // красный
  }
  return colors[level] || '#6366f1'
}
</script>

<template>
  <div class="newspaper-page">
    <!-- Список статей -->
    <div class="articles-list" v-if="articles.length > 1">
      <div class="list-header">
        <h2>Choose an Article</h2>
        <p class="list-subtitle">Select a story to read and improve your English</p>
      </div>
      <div class="articles-grid">
        <div
          v-for="article in articles"
          :key="article.id"
          class="article-card"
          @click="selectArticle(article)"
          :class="{ active: currentArticle.id === article.id }"
        >
          <div class="card-content">
            <div class="card-header">
              <h3>{{ article.title }}</h3>
              <span
                class="level-badge"
                :style="{ backgroundColor: getLevelColor(article.level) }"
              >
                Level {{ article.level }}
              </span>
            </div>
            <p class="card-description">{{ article.description }}</p>
            <div class="card-meta">
              <span class="read-time">{{ article.readTime }}</span>
              <span class="publish-date">{{ article.publishDate }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Отображение выбранной статьи -->
    <article class="story-article">
      <header class="article-header">
        <div class="article-meta-top">
          <span
            class="level-badge"
            :style="{ backgroundColor: getLevelColor(currentArticle.level) }"
          >
            Level {{ currentArticle.level }}
          </span>
          <div class="meta-info">
            <span class="read-time">{{ currentArticle.readTime }}</span>
            <span class="publish-date">{{ currentArticle.publishDate }}</span>
          </div>
        </div>
        <h1 class="article-title">{{ currentArticle.title }}</h1>
      </header>

      <section v-if="currentArticle.warmupQuestions.length" class="warmup-section">
        <div class="section-header">
          <h2 class="section-title">USA newspaper.  "Think about it"</h2>
          <div class="section-icon">💡</div>
        </div>
        <h3 class="warmup-title">Discussion:</h3>
        <ol class="warmup-questions">
          <li
            v-for="(question, index) in currentArticle.warmupQuestions"
            :key="index"
            class="warmup-question"
          >
            {{ question }}
          </li>
        </ol>
      </section>

      <div v-if="currentArticle.imageUrl" class="article-image">
        <img :src="currentArticle.imageUrl" :alt="currentArticle.imageAlt" class="image" />
        <p class="image-caption">{{ currentArticle.imageAlt }}</p>
      </div>

      <section class="article-content">
        <div
          v-html="currentArticle.content"
          class="content-text"
        ></div>
      </section>
    </article>
  </div>
</template>

<style scoped lang="scss">
.newspaper-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.articles-list {
  max-width: 1200px;
  margin: 0 auto 40px auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.list-header {
  text-align: center;
  margin-bottom: 30px;
}

.list-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 8px;
}

.list-subtitle {
  color: #6b7280;
  font-size: 1.1rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.article-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border-color: #6366f1;
  }

  &.active {
    border-color: #6366f1;
    background: linear-gradient(135deg, #f0f4ff 0%, #fdf2f8 100%);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
  gap: 12px;
}

.card-header h3 {
  color: #1f2937;
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.4;
  flex: 1;
  margin: 0;
}

.level-badge {
  display: inline-flex;
  align-items: center;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-description {
  color: #6b7280;
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 0.95rem;
}

.card-meta {
  display: flex;
  gap: 16px;
  font-size: 0.8rem;
  color: #9ca3af;
}

.story-article {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  font-family: 'Inter', 'Georgia', serif;
}

.article-header {
  background: linear-gradient(135deg, #1f2937 0%, #374151 100%);
  color: white;
  padding: 40px;
  position: relative;
}

.article-meta-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;
}

.meta-info {
  display: flex;
  gap: 16px;
  font-size: 0.9rem;
  color: #d1d5db;
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin: 0;
  background: linear-gradient(135deg, #fff 0%, #e5e7eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.warmup-section {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 32px;
  margin: 0;
  border-bottom: 1px solid #e5e7eb;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e40af;
  margin: 0;
}

.section-icon {
  font-size: 1.5rem;
}

.warmup-title {
  font-size: 1.1rem;
  color: #374151;
  margin-bottom: 16px;
  font-weight: 600;
}

.warmup-questions {
  margin: 0;
  padding-left: 1.5rem;
}

.warmup-question {
  color: #4b5563;
  margin-bottom: 12px;
  line-height: 1.6;
  font-size: 1rem;
}

.article-image {
  margin: 0;
}

.image {
  width: 100%;
  height: 400px;
  object-fit: cover;
  display: block;
}

.image-caption {
  background: #f8fafc;
  padding: 16px;
  margin: 0;
  color: #6b7280;
  font-style: italic;
  text-align: center;
  border-top: 1px solid #e5e7eb;
  font-size: 0.9rem;
}

.article-content {
  padding: 40px;
}

.content-text {
  :deep(p) {
    margin-bottom: 1.5rem;
    line-height: 1.8;
    color: #374151;
    font-size: 1.1rem;
  }

  :deep(strong) {
    font-weight: 700;
    color: #1f2937;
    background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
    padding: 2px 4px;
    border-radius: 4px;
  }
}

// Адаптивность
@media (max-width: 768px) {
  .newspaper-page {
    padding: 10px;
  }

  .articles-list {
    padding: 20px;
    margin-bottom: 20px;
  }

  .list-header h2 {
    font-size: 2rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .article-card {
    padding: 20px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .article-header {
    padding: 24px;
  }

  .article-title {
    font-size: 2rem;
  }

  .article-meta-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .warmup-section {
    padding: 24px;
  }

  .article-content {
    padding: 24px;
  }

  .image {
    height: 250px;
  }
}

@media (max-width: 480px) {
  .articles-grid {
    grid-template-columns: 1fr;
  }

  .article-title {
    font-size: 1.75rem;
  }

  .article-content {
    padding: 20px;
  }
}
</style>
